import React from "react";
import type { Provider } from "@data/agents";

interface ProviderSelectorProps {
  providers: Provider[];
  selectedProvider: Provider;
  onProviderChange: (provider: Provider) => void;
}

export default function ProviderSelector({
  providers,
  selectedProvider,
  onProviderChange,
}: ProviderSelectorProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="provider-select"
        className="block text-sm font-medium text-skin-base mb-2"
      >
        Target LLM
      </label>
      <select
        id="provider-select"
        value={selectedProvider.id}
        onChange={e => {
          const provider = providers.find(p => p.id === e.target.value);
          if (provider) {
            onProviderChange(provider);
          }
        }}
        className="block w-full max-w-xs rounded-md border border-skin-line bg-skin-fill px-3 py-2 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
      >
        {providers.map(provider => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-skin-base opacity-70">
        {selectedProvider.supportsDirectPrompt
          ? "Supports direct prompt injection"
          : "Prompt will be copied to clipboard"}
      </p>
    </div>
  );
}
