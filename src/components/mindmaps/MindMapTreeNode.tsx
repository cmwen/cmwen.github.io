import { useCallback } from "react";
import type { MindMapNode } from "@data/mindmaps";

interface Props {
  node: MindMapNode;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectNode: (node: MindMapNode) => void;
  selectedNodeId: string | null;
  depth: number;
}

/** Branch colors for visual distinction at depth 1. Falls back to accent. */
const BRANCH_COLORS = [
  "#326CE5", // blue (K8s)
  "#0F1689", // navy (Helm)
  "#7B42BC", // purple (Terraform)
  "#E00", // red (Ansible)
  "#0EA5E9", // sky
  "#F59E0B", // amber
  "#10B981", // emerald
  "#EC4899", // pink
];

function getBranchColor(node: MindMapNode, depth: number, index: number) {
  if (node.color) return node.color;
  if (depth === 1) return BRANCH_COLORS[index % BRANCH_COLORS.length];
  return undefined;
}

export function MindMapTreeNode({
  node,
  expandedIds,
  onToggle,
  onSelectNode,
  selectedNodeId,
  depth,
}: Props) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const hasNotes = Boolean(node.notes);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren) onToggle(node.id);
    },
    [hasChildren, onToggle, node.id]
  );

  const handleNotesClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectNode(node);
    },
    [onSelectNode, node]
  );

  const isRoot = depth === 0;

  return (
    <div className={`${isRoot ? "" : "ml-4 sm:ml-6"}`}>
      {/* Node row */}
      <div className="group flex items-center gap-1.5 py-0.5">
        {/* Expand/Collapse toggle */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="text-skin-base/60 hover:bg-skin-card hover:text-skin-accent flex h-5 w-5 flex-shrink-0 items-center justify-center rounded transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
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
              className={`transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
            <span className="bg-skin-base/30 h-1.5 w-1.5 rounded-full" />
          </span>
        )}

        {/* Node label */}
        <span
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-sm transition-colors select-none ${
            hasChildren ? "cursor-pointer" : "cursor-default"
          } ${
            isRoot
              ? "text-skin-base text-base font-bold"
              : isSelected
                ? "bg-skin-accent/10 text-skin-accent font-medium"
                : "text-skin-base hover:text-skin-accent font-medium"
          }`}
          style={node.color && depth <= 1 ? { color: node.color } : undefined}
        >
          {node.label}
          {hasChildren && (
            <span className="text-skin-base/40 text-xs">
              ({node.children!.length})
            </span>
          )}
        </span>

        {/* Notes indicator */}
        {hasNotes && (
          <button
            onClick={handleNotesClick}
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
              isSelected
                ? "bg-skin-accent text-skin-inverted"
                : "bg-skin-accent/20 text-skin-accent opacity-0 group-hover:opacity-100"
            }`}
            aria-label="View notes"
            title="View notes"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div
          className="border-skin-line/50 ml-2.5 border-l"
          style={node.color ? { borderColor: `${node.color}30` } : undefined}
        >
          {node.children!.map((child, idx) => (
            <MindMapTreeNode
              key={child.id}
              node={{
                ...child,
                color: child.color ?? getBranchColor(child, depth + 1, idx),
              }}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
