import { toast } from '@/hooks/use-toast';

export class AllGeminiKeysFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AllGeminiKeysFailedError";
  }
}

let apiKeys: string[] = [];
let currentApiKeyIndex = 0;

function loadApiKeys() {
  apiKeys = [
    import.meta.env.VITE_GEMINI_API_KEY_PRIMARY,
    import.meta.env.VITE_GEMINI_API_KEY_SECONDARY_1,
    import.meta.env.VITE_GEMINI_API_KEY_SECONDARY_2,
  ].filter(Boolean) as string[];

  if (apiKeys.length === 0) {
    console.error('No Gemini API keys found in .env file.');
  } else {
    console.log(`[API Client] Loaded ${apiKeys.length} Gemini API keys.`);
  }
}

// Initial load
loadApiKeys();

export const geminiApiClient = {
  async post(url: string, body: any) {
    if (apiKeys.length === 0) {
      throw new AllGeminiKeysFailedError("No Gemini API keys are configured.");
    }

    const initialIndex = currentApiKeyIndex;
    let attempts = 0;

    while (attempts < apiKeys.length) {
      const apiKey = apiKeys[currentApiKeyIndex];
      console.log(`[API Client] Attempting API call with Gemini key index ${currentApiKeyIndex}`);

      try {
        const fullUrl = `${url}?key=${apiKey}`;
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          return response; // Success
        }

        // If response is not ok, it's treated as a failure for this key
        throw new Error(`API error: ${response.status} ${response.statusText}`);

      } catch (error: any) {
        console.error(`[API Client] API call failed for Gemini key index ${currentApiKeyIndex}:`, error.message);
        
        toast({
          title: "Gemini API Request Failed",
          description: `Key index ${currentApiKeyIndex} failed. Trying the next one.`,
          variant: "destructive"
        });

        // Move to the next key
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
        attempts++;
      }
    }

    // If we've looped through all keys and all have failed
    console.error("[API Client] All available Gemini API keys failed.");
    // Reset index to start from the beginning on the next logical request
    currentApiKeyIndex = initialIndex; 
    throw new AllGeminiKeysFailedError("All available Gemini API keys failed for this request.");
  }
};
