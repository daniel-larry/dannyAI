import { toast } from '@/hooks/use-toast';

const API_KEYS = [
  import.meta.env.VITE_GROQ_API_KEY_PRIMARY,
  import.meta.env.VITE_GROQ_API_KEY_FALLBACK
].filter(Boolean) as string[];

if (API_KEYS.length === 0) {
  throw new Error('No Groq API keys found. Please add VITE_GROQ_API_KEY_PRIMARY and/or VITE_GROQ_API_KEY_FALLBACK to your .env file.');
}

let currentKeyIndex = 0;
let failures = 0;
let isCircuitOpen = false;
let lastFailureTime = 0;

const COOLDOWN_PERIOD = 30000; // 30 seconds
const FAILURE_THRESHOLD = 3;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoff = async (retries: number) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const backoff = Math.min(maxDelay, baseDelay * Math.pow(2, retries));
  const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
  await delay(backoff + jitter);
};

export const apiClient = {
  async post(url: string, body: any) {
    if (isCircuitOpen) {
      if (Date.now() - lastFailureTime < COOLDOWN_PERIOD) {
        throw new Error("Circuit is open. Please try again later.");
      } else {
        // Attempt to reset the circuit
        isCircuitOpen = false;
        failures = 0;
      }
    }

    let retries = 0;
    while (retries < API_KEYS.length) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEYS[currentKeyIndex]}`
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        failures = 0; // Reset failures on success
        return response;
      } catch (error) {
        console.error(error);
        failures++;
        lastFailureTime = Date.now();

        if (failures >= FAILURE_THRESHOLD) {
          isCircuitOpen = true;
          toast({
            title: "API Unstable",
            description: "Temporarily pausing requests.",
          });
        }

        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        retries++;
        if (retries < API_KEYS.length) {
          toast({
            title: "API limit reached",
            description: "Switching to backup voice server…",
          });
          await exponentialBackoff(retries);
        }
      }
    }

    throw new Error("All API keys failed.");
  }
};