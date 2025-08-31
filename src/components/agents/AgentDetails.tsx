import { useState, useEffect, useMemo } from "react";
import type { Agent, Provider } from "@data/agents";

interface AgentDetailsProps {
  agent: Agent | null;
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (prompt: string) => void;
}

export default function AgentDetails({
  agent,
  provider,
  isOpen,
  onClose,
  onLaunch,
}: AgentDetailsProps) {
  const [editedPrompt, setEditedPrompt] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (agent) {
      // Extract variables from prompt template ({{variable}} format)
      const variableMatches = agent.promptTemplate.match(/\{\{(\w+)\}\}/g);
      const foundVariables: Record<string, string> = {};

      if (variableMatches) {
        variableMatches.forEach(match => {
          const varName = match.slice(2, -2); // Remove {{ and }}
          foundVariables[varName] = "";
        });
      }

      setVariables(foundVariables);
      setEditedPrompt(agent.promptTemplate);
    }
  }, [agent]);

  const processedPrompt = useMemo(() => {
    let processed = editedPrompt;
    Object.entries(variables).forEach(([key, value]) => {
      processed = processed.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
        value
      );
    });
    return processed;
  }, [editedPrompt, variables]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedPrompt);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-skin-fill border border-skin-line">
        <div className="flex items-center justify-between border-b border-skin-line p-6">
          <div>
            <h2 className="text-xl font-semibold text-skin-base">
              {agent.name}
            </h2>
            <p className="text-sm text-skin-base opacity-80">
              {agent.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-2 text-skin-base hover:bg-skin-card"
            aria-label="Close agent details"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {agent.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block rounded bg-skin-accent px-2 py-1 text-xs text-skin-inverted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {Object.keys(variables).length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-skin-base">
                Variables
              </h3>
              <div className="space-y-2">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={`var-${key}`}
                      className="block text-sm text-skin-base"
                    >
                      {key}
                    </label>
                    <input
                      id={`var-${key}`}
                      type="text"
                      value={value}
                      onChange={e =>
                        setVariables(prev => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded border border-skin-line bg-skin-fill px-3 py-2 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
                      placeholder={`Enter ${key}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-skin-base">
              Prompt Template
            </h3>
            <textarea
              value={editedPrompt}
              onChange={e => setEditedPrompt(e.target.value)}
              className="h-40 w-full rounded border border-skin-line bg-skin-fill p-3 text-sm text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
              placeholder="Edit your prompt here..."
            />
          </div>

          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-skin-base">
              Final Prompt
            </h3>
            <div className="max-h-32 overflow-y-auto rounded border border-skin-line bg-skin-card p-3 text-sm text-skin-base">
              <pre className="whitespace-pre-wrap">{processedPrompt}</pre>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onLaunch(processedPrompt)}
              className="rounded bg-skin-accent px-4 py-2 text-skin-inverted hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-skin-accent focus:ring-offset-2"
            >
              {provider.supportsDirectPrompt
                ? `Open in ${provider.name}`
                : `Open ${provider.name} & Copy Prompt`}
            </button>
            <button
              onClick={copyToClipboard}
              className="rounded border border-skin-line px-4 py-2 text-skin-base hover:bg-skin-card focus:outline-none focus:ring-2 focus:ring-skin-accent focus:ring-offset-2"
            >
              Copy Prompt
            </button>
          </div>

          <div className="mt-4 text-xs text-skin-base opacity-60">
            Target: {provider.name}
            {provider.supportsDirectPrompt
              ? " (supports direct prompt injection)"
              : " (prompt will be copied to clipboard)"}
          </div>
        </div>
      </div>
    </div>
  );
}
