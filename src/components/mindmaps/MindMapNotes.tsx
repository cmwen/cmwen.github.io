import type { MindMapNode } from "@data/mindmaps";

interface Props {
  node: MindMapNode;
  onClose: () => void;
}

export function MindMapNotes({ node, onClose }: Props) {
  return (
    <div className="border-skin-accent/30 bg-skin-card rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className="text-skin-base font-semibold"
            style={node.color ? { color: node.color } : undefined}
          >
            {node.label}
          </h3>
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
    </div>
  );
}
