import type { Agent } from "@data/agents";

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <div
      className="cursor-pointer rounded-lg border border-skin-line bg-skin-card p-4 transition-colors hover:border-skin-accent hover:bg-skin-card-muted"
      onClick={() => onClick(agent)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(agent);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${agent.name} agent details`}
    >
      <h3 className="font-semibold text-skin-base">{agent.name}</h3>
      <p className="mt-2 text-sm text-skin-base opacity-80 line-clamp-2">
        {agent.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {agent.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="inline-block rounded bg-skin-accent px-2 py-1 text-xs text-skin-inverted"
          >
            {tag}
          </span>
        ))}
        {agent.tags.length > 3 && (
          <span className="inline-block rounded border border-skin-line px-2 py-1 text-xs text-skin-base">
            +{agent.tags.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}
