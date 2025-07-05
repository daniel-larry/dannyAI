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
  failureCount: number;
  lastUsed: number;
}

const INITIAL_COOLDOWN_PERIOD = 60 * 1000; // 1 minute
const MAX_COOLDOWN_PERIOD = 30 * 60 * 1000; // 30 minutes
const API_KEY_STATUS_STORAGE_KEY = 'groq_api_key_status';
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const HEALTH_CHECK_URL = "https://api.groq.com/openai/v1/models"; // A lightweight endpoint

let apiKeys: ApiKey[] = [];
let healthCheckIntervalId: number | null = null;

function calculateCooldown(failureCount: number): number {
  const backoff = INITIAL_COOLDOWN_PERIOD * Math.pow(2, failureCount);
  return Math.min(backoff, MAX_COOLDOWN_PERIOD);
}

function saveApiKeyStatus() {
  try {
    const statusToStore = apiKeys.map(({ key, isHealthy, lastFailureTime, failureCount }) => ({
      key, isHealthy, lastFailureTime, failureCount
    }));
    localStorage.setItem(API_KEY_STATUS_STORAGE_KEY, JSON.stringify(statusToStore));
    console.log('[API Client] Saved API key status to localStorage.');
  } catch (e) {
    console.error('[API Client] Error saving API key status to localStorage:', e);
  }
}

async function performHealthCheck(key: string): Promise<boolean> {
  try {
    const response = await fetch(HEALTH_CHECK_URL, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${key}` },
    });
    return response.ok;
  } catch (error) {
    console.warn(`[API Client] Health check failed for a key (likely network error):`, error);
    return false;
  }
}

export async function runHealthChecks(force = false) {
  const now = Date.now();
  console.log(`[API Client] Running health checks (force=${force})...`);

  const checks = apiKeys.map(async (apiKey, index) => {
    const cooldown = calculateCooldown(apiKey.failureCount);
    const timeSinceFailure = now - apiKey.lastFailureTime;

    // Only check if forced, or if it's healthy, or if its cooldown has passed
    if (force || apiKey.isHealthy || timeSinceFailure > cooldown) {
      const wasHealthy = apiKey.isHealthy;
      const isNowHealthy = await performHealthCheck(apiKey.key);

      if (isNowHealthy) {
        if (!wasHealthy) {
          console.log(`[API Client] Key ${index} has recovered and is now healthy.`);
          toast({ title: "API Key Recovered", description: `A Groq API key is now operational.` });
        }
        apiKey.isHealthy = true;
        apiKey.failureCount = 0;
        apiKey.lastFailureTime = 0;
      } else {
        if (wasHealthy) {
          console.warn(`[API Client] Key ${index} failed health check and is now marked as unhealthy.`);
          apiKey.isHealthy = false;
          apiKey.lastFailureTime = now;
          apiKey.failureCount = 1; // Start failure count at 1
        }
      }
    } else {
       console.log(`[API Client] Skipping health check for Key ${index} (in cooldown).`);
    }
  });

  await Promise.allSettled(checks);
  saveApiKeyStatus();
  console.log('[API Client] Health checks complete.');
}

function loadApiKeys() {
  const rawKeys = [
    import.meta.env.VITE_GROQ_API_KEY_PRIMARY,
    import.meta.env.VITE_GROQ_API_KEY_SECONDARY_1,
    import.meta.env.VITE_GROQ_API_KEY_SECONDARY_2,
  ].filter(Boolean) as string[];

  if (rawKeys.length === 0) {
    console.error('No Groq API keys found in .env file.');
    return;
  }

  let storedStatus: any[] = [];
  try {
    const stored = localStorage.getItem(API_KEY_STATUS_STORAGE_KEY);
    if (stored) storedStatus = JSON.parse(stored);
  } catch (e) {
    console.error('[API Client] Error parsing stored API key status.', e);
  }

  const storedStatusMap = new Map(storedStatus.map(s => [s.key, s]));

  apiKeys = rawKeys.map(key => {
    const status = storedStatusMap.get(key);
    return {
      key,
      isHealthy: status?.isHealthy ?? true,
      lastFailureTime: status?.lastFailureTime ?? 0,
      failureCount: status?.failureCount ?? 0,
      lastUsed: 0,
    };
  });

  console.log('[API Client] Initialized API keys with status:', apiKeys);

  // Start periodic health checks
  if (healthCheckIntervalId) clearInterval(healthCheckIntervalId);
  healthCheckIntervalId = window.setInterval(() => runHealthChecks(), HEALTH_CHECK_INTERVAL);

  // Run initial check on load
  runHealthChecks();
}

// Initial load
loadApiKeys();

export const apiClient = {
  async post(url: string, body: any) {
    const now = Date.now();

    const availableKeys = apiKeys
      .filter(k => k.isHealthy)
      .sort((a, b) => a.lastUsed - b.lastUsed); // Least recently used

    if (availableKeys.length === 0) {
      console.error("[API Client] No healthy API keys available. Falling back immediately.");
      runHealthChecks(true); // Force a re-check in the background
      throw new AllGroqKeysFailedError("No healthy Groq API keys available.");
    }

    for (const currentApiKey of availableKeys) {
      console.log(`[API Client] Attempting API call with key ending in ...${currentApiKey.key.slice(-4)}`);
      currentApiKey.lastUsed = now;

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
          // Throw a specific error to be caught below
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        // Success
        return response;

      } catch (error: any) {
        console.error(`[API Client] API call failed for key ...${currentApiKey.key.slice(-4)}:`, error.message);
        
        // Mark as unhealthy and update failure stats
        currentApiKey.isHealthy = false;
        currentApiKey.lastFailureTime = now;
        currentApiKey.failureCount++;
        saveApiKeyStatus();

        toast({
          title: "Groq API Request Failed",
          description: `An API key failed. Trying the next available key.`,
          variant: "destructive"
        });
      }
    }

    // If all healthy keys failed in this loop
    console.error("[API Client] All available healthy keys failed during the request loop.");
    throw new AllGroqKeysFailedError("All available Groq API keys failed.");
  }
};

            