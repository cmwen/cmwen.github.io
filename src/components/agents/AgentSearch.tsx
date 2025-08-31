import { useState, useMemo, useEffect } from "react";
import type { Agent } from "@data/agents";

interface AgentSearchProps {
  agents: Agent[];
  onFilteredAgentsChange: (filteredAgents: Agent[]) => void;
}

export default function AgentSearch({
  agents,
  onFilteredAgentsChange,
}: AgentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = agents.flatMap(agent => agent.tags);
    return [...new Set(tags)].sort();
  }, [agents]);

  // Filter agents based on search term and selected tag
  useEffect(() => {
    let filtered = agents;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        agent =>
          agent.name.toLowerCase().includes(term) ||
          agent.description.toLowerCase().includes(term) ||
          agent.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(agent => agent.tags.includes(selectedTag));
    }

    onFilteredAgentsChange(filtered);
  }, [searchTerm, selectedTag, agents, onFilteredAgentsChange]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="agent-search" className="sr-only">
            Search agents
          </label>
          <div className="relative">
            <input
              id="agent-search"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search agents by name, description, or tags..."
              className="w-full rounded-md border border-skin-line bg-skin-fill px-4 py-2 pl-10 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-skin-base opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="tag-filter" className="sr-only">
            Filter by tag
          </label>
          <select
            id="tag-filter"
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="rounded-md border border-skin-line bg-skin-fill px-3 py-2 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
          >
            <option value="">All categories</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(searchTerm || selectedTag) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-skin-base opacity-70">
            Active filters:
          </span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-skin-accent px-3 py-1 text-xs text-skin-inverted">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="hover:bg-opacity-80"
                aria-label="Clear search"
              >
                ×
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-skin-accent px-3 py-1 text-xs text-skin-inverted">
              Tag: {selectedTag}
              <button
                onClick={() => setSelectedTag("")}
                className="hover:bg-opacity-80"
                aria-label="Clear tag filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
