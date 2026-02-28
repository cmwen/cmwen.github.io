import type { MindMapNode } from "@data/mindmaps";

interface Props {
  node: MindMapNode;
  onClose: () => void;
}

export function MindMapNotes({ node, onClose }: Props) {
  return (
    <div className="border-skin-accent/30 bg-skin-card rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3
            className="text-skin-base font-semibold"
            style={node.color ? { color: node.color } : undefined}
          >
            {node.label}
          </h3>
          {node.annotation && (
            <span
              className="rounded px-1.5 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: node.color || "#888" }}
            >
              {node.annotation}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-skin-base/60 hover:bg-skin-card-muted hover:text-skin-accent flex h-6 w-6 flex-shrink-0 items-center justify-center rounded transition-colors"
          aria-label="Close notes"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-skin-base/80 mt-2 text-sm leading-relaxed">
        {node.notes}
      </p>
      {node.refs && node.refs.length > 0 && (
        <div className="border-skin-line/30 mt-3 border-t pt-2">
          <p className="text-skin-base/50 text-xs font-medium tracking-wide uppercase">
            Related
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {node.refs.map(ref => (
              <span
                key={ref.targetId}
                className="inline-flex items-center gap-1 rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400"
              >
                {ref.label && <span className="opacity-70">{ref.label}</span>}
                <span className="font-medium">{ref.targetId}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
