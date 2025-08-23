import React, { useState, useCallback } from "react";
import { providers, agents } from "@data/agents";
import type { Agent, Provider } from "@data/agents";
import ProviderSelector from "./ProviderSelector";
import AgentSearch from "./AgentSearch";
import AgentCard from "./AgentCard";
import AgentDetails from "./AgentDetails";
import {
  getSelectedProvider,
  setSelectedProvider,
  launchProvider,
} from "@utils/agents";

export default function AgentsApp() {
  const [selectedProvider, setSelectedProviderState] = useState<Provider>(() =>
    getSelectedProvider(providers)
  );
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProviderChange = useCallback((provider: Provider) => {
    setSelectedProviderState(provider);
    setSelectedProvider(provider);
  }, []);

  const handleAgentClick = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  }, []);

  const handleLaunchAgent = useCallback(
    async (prompt: string) => {
      try {
        await launchProvider(selectedProvider, prompt);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to launch provider:", error);
      }
    },
    [selectedProvider]
  );

  return (
    <div className="mx-auto max-w-4xl">
      <ProviderSelector
        providers={providers}
        selectedProvider={selectedProvider}
        onProviderChange={handleProviderChange}
      />

      <AgentSearch agents={agents} onFilteredAgentsChange={setFilteredAgents} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} onClick={handleAgentClick} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-skin-base opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-skin-base">
            No agents found
          </h3>
          <p className="mt-2 text-skin-base opacity-70">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      <AgentDetails
        agent={selectedAgent}
        provider={selectedProvider}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLaunch={handleLaunchAgent}
      />
    </div>
  );
}
