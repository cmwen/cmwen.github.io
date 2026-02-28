import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { MindMap, MindMapNode } from "@data/mindmaps";
import { MindMapNotes } from "./MindMapNotes";

interface Props {
  mindmap: MindMap;
}

// ---------------------------------------------------------------------------
// Layout types
// ---------------------------------------------------------------------------

interface LayoutNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  node: MindMapNode;
  depth: number;
  parentId: string | null;
}

interface LayoutEdge {
  from: string;
  to: string;
  isRef: boolean;
  label?: string;
}

// ---------------------------------------------------------------------------
// Branch color palette
// ---------------------------------------------------------------------------
const BRANCH_COLORS = [
  "#326CE5", // blue
  "#0F1689", // navy
  "#7B42BC", // purple
  "#E00", // red
  "#0EA5E9", // sky
  "#F59E0B", // amber
  "#10B981", // emerald
  "#EC4899", // pink
];

// ---------------------------------------------------------------------------
// Radial tree layout engine
// ---------------------------------------------------------------------------

function computeLayout(root: MindMapNode): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  // 1) Count total leaves under each node to allocate angular space
  const leafCounts = new Map<string, number>();
  function countLeaves(n: MindMapNode): number {
    if (!n.children || n.children.length === 0) {
      leafCounts.set(n.id, 1);
      return 1;
    }
    let total = 0;
    for (const c of n.children) total += countLeaves(c);
    leafCounts.set(n.id, total);
    return total;
  }
  countLeaves(root);

  // Radii per depth level — generous spacing
  const RADII = [0, 220, 400, 560, 700, 830];
  const getRadius = (depth: number) =>
    depth < RADII.length
      ? RADII[depth]
      : RADII[RADII.length - 1] + (depth - RADII.length + 1) * 140;

  // 2) Place root at center
  nodes.push({
    id: root.id,
    label: root.label,
    x: 0,
    y: 0,
    color: "#888",
    node: root,
    depth: 0,
    parentId: null,
  });

  // 3) Recursively place children in angular sectors
  function placeChildren(
    parent: MindMapNode,
    parentId: string,
    depth: number,
    angleStart: number,
    angleEnd: number,
    branchColor: string
  ) {
    if (!parent.children || parent.children.length === 0) return;

    const totalLeaves = leafCounts.get(parent.id) || 1;
    const r = getRadius(depth);
    let currentAngle = angleStart;

    parent.children.forEach((child, idx) => {
      const childLeaves = leafCounts.get(child.id) || 1;
      const childSpan = ((angleEnd - angleStart) * childLeaves) / totalLeaves;
      const midAngle = currentAngle + childSpan / 2;

      const color =
        child.color ||
        (depth === 1 ? BRANCH_COLORS[idx % BRANCH_COLORS.length] : branchColor);

      const x = Math.cos(midAngle) * r;
      const y = Math.sin(midAngle) * r;

      nodes.push({
        id: child.id,
        label: child.label,
        x,
        y,
        color,
        node: child,
        depth,
        parentId,
      });

      edges.push({ from: parentId, to: child.id, isRef: false });

      // Collect cross-branch refs
      if (child.refs) {
        for (const ref of child.refs) {
          edges.push({
            from: child.id,
            to: ref.targetId,
            isRef: true,
            label: ref.label,
          });
        }
      }

      placeChildren(
        child,
        child.id,
        depth + 1,
        currentAngle,
        currentAngle + childSpan,
        color
      );
      currentAngle += childSpan;
    });
  }

  // Spread children around full circle
  const startAngle = -Math.PI;
  const endAngle = Math.PI;
  placeChildren(root, root.id, 1, startAngle, endAngle, "#888");

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// SVG bezier path helpers
// ---------------------------------------------------------------------------

function parentChildPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Slight curve via midpoint offset toward center
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const off = len * 0.15;
  // perpendicular offset for a gentle S-curve
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * off;
  const cy = my + ny * off;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function refPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const off = len * 0.25;
  const cx = mx + nx * off;
  const cy = my + ny * off;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// ---------------------------------------------------------------------------
// Node dimensions
// ---------------------------------------------------------------------------
function estimateNodeWidth(label: string, depth: number): number {
  const fontSize = depth === 0 ? 16 : depth === 1 ? 13 : 11;
  const charWidth = fontSize * 0.62;
  return Math.max(60, label.length * charWidth + 28);
}

const NODE_HEIGHT = 32;
const ROOT_HEIGHT = 40;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MindMapViewer({ mindmap }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    ids.add(mindmap.root.id);
    mindmap.root.children?.forEach(c => {
      ids.add(c.id);
      // Also expand level-2 for a richer initial view
      c.children?.forEach(gc => ids.add(gc.id));
    });
    return ids;
  });

  // Transform state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.65);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  // Build the pruned tree based on expanded nodes
  const prunedRoot = useMemo(() => {
    function prune(node: MindMapNode): MindMapNode {
      if (!expandedIds.has(node.id) || !node.children) {
        return { ...node, children: undefined };
      }
      return { ...node, children: node.children.map(prune) };
    }
    return prune(mindmap.root);
  }, [mindmap.root, expandedIds]);

  // Compute layout
  const { nodes, edges } = useMemo(
    () => computeLayout(prunedRoot),
    [prunedRoot]
  );

  // Build lookup for positions
  const nodeMap = useMemo(() => {
    const m = new Map<string, LayoutNode>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  // Toggle expand/collapse
  const toggleExpand = useCallback(
    (id: string) => {
      // Find the original node in the full tree
      function findNode(n: MindMapNode): MindMapNode | null {
        if (n.id === id) return n;
        if (n.children) {
          for (const c of n.children) {
            const found = findNode(c);
            if (found) return found;
          }
        }
        return null;
      }
      const target = findNode(mindmap.root);
      if (!target || !target.children || target.children.length === 0) return;

      setExpandedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          // Collapse: remove this node and all descendants
          function removeDescendants(n: MindMapNode) {
            if (n.children) {
              for (const c of n.children) {
                next.delete(c.id);
                removeDescendants(c);
              }
            }
          }
          next.delete(id);
          removeDescendants(target);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [mindmap.root]
  );

  const expandAll = useCallback(() => {
    const ids = new Set<string>();
    function walk(n: MindMapNode) {
      ids.add(n.id);
      n.children?.forEach(walk);
    }
    walk(mindmap.root);
    setExpandedIds(ids);
  }, [mindmap]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set([mindmap.root.id]));
  }, [mindmap]);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(0.65);
  }, []);

  // Check if node has children in the FULL tree (not pruned)
  const fullNodeChildren = useMemo(() => {
    const m = new Map<string, number>();
    function walk(n: MindMapNode) {
      m.set(n.id, n.children?.length ?? 0);
      n.children?.forEach(walk);
    }
    walk(mindmap.root);
    return m;
  }, [mindmap.root]);

  // Pan handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOffset.current = { ...pan };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [pan]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({
      x: panOffset.current.x + dx,
      y: panOffset.current.y + dy,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Zoom via scroll wheel
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom(z => Math.max(0.15, Math.min(3, z * delta)));
  }, []);

  // Center the view on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-skin-base text-xl font-bold">{mindmap.title}</h2>
        <p className="text-skin-base/70 mt-1 text-sm">{mindmap.description}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={expandAll}
          className="border-skin-line text-skin-base hover:border-skin-accent hover:text-skin-accent rounded border px-2.5 py-1 text-xs transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="border-skin-line text-skin-base hover:border-skin-accent hover:text-skin-accent rounded border px-2.5 py-1 text-xs transition-colors"
        >
          Collapse All
        </button>
        <button
          onClick={resetView}
          className="border-skin-line text-skin-base hover:border-skin-accent hover:text-skin-accent rounded border px-2.5 py-1 text-xs transition-colors"
        >
          Reset View
        </button>
        <span className="text-skin-base/50 ml-auto text-xs">
          Scroll to zoom &middot; Drag to pan &middot; Click nodes to expand
          &middot; Right-click for notes
        </span>
      </div>

      {/* Mind map canvas */}
      <div
        ref={containerRef}
        className="border-skin-line bg-skin-fill relative overflow-hidden rounded-lg border"
        style={{ height: "600px", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Defs for arrow markers */}
            <defs>
              <marker
                id="ref-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 Z" fill="#888" opacity="0.5" />
              </marker>
            </defs>

            {/* Parent-child edges */}
            {edges
              .filter(e => !e.isRef)
              .map(edge => {
                const from = nodeMap.get(edge.from);
                const to = nodeMap.get(edge.to);
                if (!from || !to) return null;
                const isHighlighted =
                  hoveredId === edge.from || hoveredId === edge.to;
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={parentChildPath(from.x, from.y, to.x, to.y)}
                    fill="none"
                    stroke={to.color}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    opacity={hoveredId ? (isHighlighted ? 0.9 : 0.15) : 0.5}
                    style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}
                  />
                );
              })}

            {/* Cross-branch reference edges */}
            {edges
              .filter(e => e.isRef)
              .map(edge => {
                const from = nodeMap.get(edge.from);
                const to = nodeMap.get(edge.to);
                if (!from || !to) return null;
                const isHighlighted =
                  hoveredId === edge.from || hoveredId === edge.to;
                return (
                  <g key={`ref-${edge.from}-${edge.to}`}>
                    <path
                      d={refPath(from.x, from.y, to.x, to.y)}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={isHighlighted ? 2 : 1.2}
                      strokeDasharray="6 4"
                      opacity={hoveredId ? (isHighlighted ? 0.9 : 0.12) : 0.4}
                      markerEnd="url(#ref-arrow)"
                      style={{ transition: "opacity 0.2s" }}
                    />
                    {edge.label && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#F59E0B"
                        opacity={hoveredId ? (isHighlighted ? 0.9 : 0.1) : 0.55}
                        style={{ pointerEvents: "none" }}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

            {/* Nodes */}
            {nodes.map(ln => {
              const isRoot = ln.depth === 0;
              const w = estimateNodeWidth(ln.label, ln.depth);
              const h = isRoot ? ROOT_HEIGHT : NODE_HEIGHT;
              const hasChildren = (fullNodeChildren.get(ln.id) ?? 0) > 0;
              const isExpanded = expandedIds.has(ln.id);
              const isHovered = hoveredId === ln.id;
              const isSelected = selectedNode?.id === ln.id;
              const hasNotes = Boolean(ln.node.notes);
              const hasAnnotation = Boolean(ln.node.annotation);
              const childCount = fullNodeChildren.get(ln.id) ?? 0;
              const collapsedChildren =
                hasChildren && !isExpanded ? childCount : 0;

              return (
                <g
                  key={ln.id}
                  transform={`translate(${ln.x}, ${ln.y})`}
                  onMouseEnter={() => setHoveredId(ln.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={e => {
                    e.stopPropagation();
                    if (hasChildren) toggleExpand(ln.id);
                  }}
                  onContextMenu={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (hasNotes) {
                      setSelectedNode(
                        selectedNode?.id === ln.id ? null : ln.node
                      );
                    }
                  }}
                  style={{ cursor: hasChildren ? "pointer" : "default" }}
                >
                  {/* Node background */}
                  <rect
                    x={-w / 2}
                    y={-h / 2}
                    width={w}
                    height={h}
                    rx={isRoot ? 12 : 8}
                    fill={
                      isRoot
                        ? "var(--color-card)"
                        : isSelected
                          ? ln.color + "30"
                          : isHovered
                            ? ln.color + "20"
                            : ln.color + "12"
                    }
                    stroke={ln.color}
                    strokeWidth={
                      isRoot ? 2.5 : isSelected ? 2 : isHovered ? 1.5 : 1
                    }
                    opacity={
                      hoveredId && !isHovered && hoveredId !== ln.parentId
                        ? (() => {
                            // Keep nodes in the same branch visible
                            const hovered = nodeMap.get(hoveredId);
                            if (!hovered) return 0.4;
                            if (ln.parentId === hoveredId) return 0.9;
                            if (hovered.parentId === ln.id) return 0.9;
                            return 0.4;
                          })()
                        : 1
                    }
                    style={{
                      transition:
                        "opacity 0.2s, fill 0.15s, stroke-width 0.15s",
                    }}
                  />

                  {/* Label text */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isRoot ? 15 : ln.depth === 1 ? 12 : 10.5}
                    fontWeight={isRoot || ln.depth === 1 ? "bold" : "500"}
                    fill={isRoot ? "var(--color-text-base)" : ln.color}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {ln.label}
                  </text>

                  {/* Annotation badge */}
                  {hasAnnotation && (
                    <g transform={`translate(${w / 2 - 4}, ${-h / 2 - 6})`}>
                      <rect
                        x={-2}
                        y={-7}
                        width={(ln.node.annotation?.length ?? 0) * 5.5 + 10}
                        height={14}
                        rx={4}
                        fill={ln.color}
                        opacity={0.85}
                      />
                      <text
                        x={3}
                        fontSize="8"
                        fontWeight="600"
                        fill="white"
                        style={{
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        {ln.node.annotation}
                      </text>
                    </g>
                  )}

                  {/* Collapsed children count badge */}
                  {collapsedChildren > 0 && (
                    <g transform={`translate(${w / 2 + 4}, 0)`}>
                      <circle r={9} fill={ln.color} opacity={0.7} />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontWeight="bold"
                        fill="white"
                        style={{
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        +{collapsedChildren}
                      </text>
                    </g>
                  )}

                  {/* Notes indicator dot */}
                  {hasNotes && (
                    <circle
                      cx={w / 2 + (collapsedChildren > 0 ? 20 : 4)}
                      cy={-h / 2 + 4}
                      r={3.5}
                      fill={isSelected ? ln.color : "#F59E0B"}
                      opacity={isHovered || isSelected ? 1 : 0.5}
                      style={{ transition: "opacity 0.15s" }}
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Notes panel */}
      {selectedNode && selectedNode.notes && (
        <MindMapNotes
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
