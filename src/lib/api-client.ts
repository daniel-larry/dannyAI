import { toast } from '@/hooks/use-toast';

export class AllGroqKeysFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AllGroqKeysFailedError";
  }
}

interface ApiKey {
  key: string;
  isHealthy: boolean;
  lastFailureTime: number;
  failureCount: number; // New: Consecutive failure count
  lastUsed: number; // New: Timestamp of last use for round-robin
}

const INITIAL_COOLDOWN_PERIOD = 60 * 1000; // 1 minute initial cooldown
const API_KEY_STATUS_STORAGE_KEY = 'groq_api_key_status';

let apiKeys: ApiKey[];
let lastUsedKeyIndex: number = -1; // Track the last used key for round-robin

function calculateCooldown(failureCount: number): number {
  // Exponential backoff: 1 min, 2 min, 4 min, 8 min, etc.
  return INITIAL_COOLDOWN_PERIOD * Math.pow(2, Math.min(failureCount, 5)); // Cap at 5 for max 32 min cooldown
}

function loadApiKeys() {
  const storedStatus = localStorage.getItem(API_KEY_STATUS_STORAGE_KEY);
  let initialStatus: { isHealthy: boolean; lastFailureTime: number; failureCount: number; }[] = [];

  if (storedStatus) {
    try {
      initialStatus = JSON.parse(storedStatus);
      console.log('[API Client] Loaded API key status from localStorage:', initialStatus);
    } catch (e) {
      console.error('[API Client] Error parsing stored API key status, re-initializing.', e);
    }
  }

  const rawKeys = [
    import.meta.env.VITE_GROQ_API_KEY_PRIMARY,
    import.meta.env.VITE_GROQ_API_KEY_SECONDARY_1,
    import.meta.env.VITE_GROQ_API_KEY_SECONDARY_2,
  ].filter(key => key); // Filter out undefined/empty keys

  apiKeys = rawKeys.map((key, index) => {
    const status = initialStatus[index] || { isHealthy: true, lastFailureTime: 0, failureCount: 0 };
    return {
      key: key as string,
      isHealthy: status.isHealthy,
      lastFailureTime: status.lastFailureTime,
      failureCount: status.failureCount,
      lastUsed: 0, // Initialize lastUsed to 0, will be updated on first use
    };
  });

  if (apiKeys.length === 0) {
    throw new Error('No Groq API keys found. Please add VITE_GROQ_API_KEY_PRIMARY and/or VITE_GROQ_API_KEY_SECONDARY_1 and VITE_GROQ_API_KEY_SECONDARY_2 to your .env file.');
  }
  console.log('[API Client] Initialized API keys:', apiKeys.map(k => ({ isHealthy: k.isHealthy, lastFailureTime: k.lastFailureTime, failureCount: k.failureCount })));
}

function saveApiKeyStatus() {
  const statusToStore = apiKeys.map(key => ({
    isHealthy: key.isHealthy,
    lastFailureTime: key.lastFailureTime,
    failureCount: key.failureCount,
  }));
  localStorage.setItem(API_KEY_STATUS_STORAGE_KEY, JSON.stringify(statusToStore));
  console.log('[API Client] Saved API key status to localStorage:', statusToStore);
}

// Load keys on module initialization
loadApiKeys();

export const apiClient = {
  async post(url: string, body: any) {
    const MAX_RETRIES_PER_REQUEST = apiKeys.length * 2; // Allow multiple attempts across keys

    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < MAX_RETRIES_PER_REQUEST) {
      attempts++;
      console.log(`[API Client] Attempt ${attempts}/${MAX_RETRIES_PER_REQUEST}`);

      let selectedKeyIndex = -1;
      let bestKeyScore = -1;

      // Prioritize healthy keys, then keys coming off cooldown, using round-robin
      const now = Date.now();
      const sortedKeys = [...apiKeys]
        .map((key, index) => ({ key, index }))
        .sort((a, b) => {
          const aCooldown = calculateCooldown(a.key.failureCount);
          const bCooldown = calculateCooldown(b.key.failureCount);

          const aReady = a.key.isHealthy || (now - a.key.lastFailureTime > aCooldown);
          const bReady = b.key.isHealthy || (now - b.key.lastFailureTime > bCooldown);

          // Prioritize ready keys
          if (aReady && !bReady) return -1;
          if (!aReady && bReady) return 1;

          // Among ready keys, prioritize healthy ones
          if (a.key.isHealthy && !b.key.isHealthy) return -1;
          if (!a.key.isHealthy && b.key.isHealthy) return 1;

          // Among equally healthy/unhealthy and ready keys, use round-robin (least recently used)
          return a.key.lastUsed - b.key.lastUsed;
        });

      for (const { key: keyCandidate, index } of sortedKeys) {
        const currentKeyCooldown = calculateCooldown(keyCandidate.failureCount);
        const timeSinceLastFailure = now - keyCandidate.lastFailureTime;
        const isReady = keyCandidate.isHealthy || (timeSinceLastFailure > currentKeyCooldown);

        if (isReady) {
          selectedKeyIndex = index;
          console.log(`[API Client] Selected Key ${selectedKeyIndex} (Round-Robin). Healthy=${keyCandidate.isHealthy}, Failures=${keyCandidate.failureCount}, Cooldown=${currentKeyCooldown}ms, Time since last failure=${timeSinceLastFailure}ms`);
          break;
        } else {
          console.log(`[API Client] Key ${index} is not ready. Healthy=${keyCandidate.isHealthy}, Failures=${keyCandidate.failureCount}, Cooldown=${currentKeyCooldown}ms, Time since last failure=${timeSinceLastFailure}ms (${Math.ceil((currentKeyCooldown - timeSinceLastFailure) / 1000)}s left)`);
        }
      }

      if (selectedKeyIndex === -1) {
        console.warn('[API Client] All API keys are currently unhealthy and in cooldown. Cannot make request.');
        throw new AllGroqKeysFailedError("All API keys are currently unavailable. Please try again later.");
      }

      const currentApiKey = apiKeys[selectedKeyIndex];
      currentApiKey.lastUsed = now; // Update last used timestamp for round-robin
      saveApiKeyStatus(); // Save status after updating lastUsed

      console.log(`Attempting API call with key index: ${selectedKeyIndex}`);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentApiKey.key}`
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          console.error(`[API Client] API response not OK for key ${selectedKeyIndex}: Status ${response.status}`);
          throw new Error(`API error with key ${selectedKeyIndex}: ${response.status}`);
        }

        // If successful, mark key as healthy and reset failure count
        if (!currentApiKey.isHealthy || currentApiKey.failureCount > 0) {
          console.log(`[API Client] Key ${selectedKeyIndex} is now healthy. Resetting failure count.`);
        }
        currentApiKey.isHealthy = true;
        currentApiKey.lastFailureTime = 0;
        currentApiKey.failureCount = 0; // Reset failure count on success
        saveApiKeyStatus(); // Save status on success
        return response;

      } catch (error: any) {
        console.error(`[API Client] API call failed with key ${selectedKeyIndex}:`, error);
        lastError = error;

        // Mark key as unhealthy and increment failure count
        if (currentApiKey.isHealthy) {
          console.warn(`[API Client] Key ${selectedKeyIndex} marked as unhealthy. Incrementing failure count.`);
        }
        currentApiKey.isHealthy = false;
        currentApiKey.lastFailureTime = now;
        currentApiKey.failureCount++; // Increment failure count
        saveApiKeyStatus(); // Save status on failure

        toast({
          title: "API Request Failed",
          description: `Switching to next available API key.`, // More generic message
        });
      }
    }

    console.error(`[API Client] All API keys failed after ${MAX_RETRIES_PER_REQUEST} attempts. Last error: ${lastError?.message || "Unknown error"}`);
    throw new AllGroqKeysFailedError(`All API keys failed after multiple attempts. Last error: ${lastError?.message || "Unknown error"}`);
  }
};
            