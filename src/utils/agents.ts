import type { Provider } from "@data/agents";

const STORAGE_KEY = "agents.selectedProvider";

/**
 * Get the selected provider from localStorage
 */
export function getSelectedProvider(providers: Provider[]): Provider {
  if (typeof window === "undefined") {
    return providers[0]; // Default to first provider on server
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const providerId = JSON.parse(stored);
      const provider = providers.find(p => p.id === providerId);
      if (provider) {
        return provider;
      }
    }
  } catch (error) {
    console.error("Error reading provider from localStorage:", error);
  }

  return providers[0]; // Default to first provider
}

/**
 * Save the selected provider to localStorage
 */
export function setSelectedProvider(provider: Provider): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(provider.id));
  } catch (error) {
    console.error("Error saving provider to localStorage:", error);
  }
}

/**
 * Build a deep link URL for the provider with the given prompt
 */
export function buildProviderUrl(provider: Provider, prompt: string): string {
  if (!provider.supportsDirectPrompt) {
    return provider.webUrl;
  }

  const encodedPrompt = encodeURIComponent(prompt);

  switch (provider.id) {
    case "openai_chatgpt": {
      // Use GPT-4 model param; provider.webUrl ends with '/'
      const base = provider.webUrl.endsWith("/")
        ? provider.webUrl
        : provider.webUrl + "/";
      return `${base}?model=gpt-4&prompt=${encodedPrompt}`;
    }
    case "microsoft_copilot":
      return `${provider.webUrl}?q=${encodedPrompt}`;
    case "perplexity":
      return `${provider.webUrl}search?q=${encodedPrompt}`;
    default:
      return provider.webUrl;
  }
}

/**
 * Launch the provider with the given prompt
 * - If provider supports direct prompts, open URL with prompt
 * - Otherwise, copy prompt to clipboard and open provider URL
 */
export async function launchProvider(
  provider: Provider,
  prompt: string
): Promise<void> {
  const url = buildProviderUrl(provider, prompt);

  if (provider.supportsDirectPrompt) {
    // Open provider with direct prompt injection
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // Copy prompt to clipboard and open provider
    try {
      await navigator.clipboard.writeText(prompt);
      window.open(provider.webUrl, "_blank", "noopener,noreferrer");

      // You could show a toast notification here
      console.log("Prompt copied to clipboard");
    } catch (error) {
      console.error("Failed to copy prompt to clipboard:", error);
      // Fallback: just open the provider
      window.open(provider.webUrl, "_blank", "noopener,noreferrer");
    }
  }
}

/**
 * Get app scheme URL if available
 */
export function getAppSchemeUrl(
  provider: Provider,
  prompt: string
): string | null {
  if (!provider.appScheme) return null;

  // Most app schemes don't support direct prompt injection
  // but we can try common patterns
  switch (provider.id) {
    case "perplexity":
      return `${provider.appScheme}search?q=${encodeURIComponent(prompt)}`;
    default:
      return provider.appScheme;
  }
}

/**
 * Validate prompt for URL length limits
 */
export function validatePromptLength(prompt: string): {
  isValid: boolean;
  warning?: string;
} {
  const MAX_URL_LENGTH = 2000; // Conservative limit for URL length
  const estimatedUrlLength = prompt.length * 3; // Account for URL encoding

  if (estimatedUrlLength > MAX_URL_LENGTH) {
    return {
      isValid: false,
      warning:
        "Prompt is too long for URL parameters. Consider shortening it or use copy-to-clipboard instead.",
    };
  }

  return { isValid: true };
}

/**
 * Show a toast notification (placeholder implementation)
 * You might want to integrate with a proper toast library
 */
export function showToast(
  message: string,
  type: "success" | "error" | "info" = "info"
): void {
  // Placeholder implementation
  console.log(`[${type.toUpperCase()}] ${message}`);

  // You could implement a proper toast notification system here
  // For now, we'll use a simple alert as fallback for important messages
  if (type === "error") {
    alert(message);
  }
}
