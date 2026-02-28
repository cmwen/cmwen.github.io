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
// Theme-aware color palette
//
// Maps the raw data colors (used in the JSON) to theme-safe alternatives.
// The key is the normalized lowercase hex from the data file.
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, { light: string; dark: string }> = {
  // Kubernetes blue — slightly brighter on light, lighter on dark
  "#326ce5": { light: "#2563EB", dark: "#60A5FA" },
  // Near-black navy — unreadable on dark; shift to proper blue
  "#0f1689": { light: "#3B5FD4", dark: "#7B9EFF" },
  // Purple — fine on both, minor tweak for dark
  "#7b42bc": { light: "#7B42BC", dark: "#A78BFA" },
  // Red variants — keep vibrant but accessible
  "#ee0000": { light: "#DC2626", dark: "#F87171" },
  "#e00": { light: "#DC2626", dark: "#F87171" },
  "#ff0000": { light: "#DC2626", dark: "#F87171" },
  // Sky blue — deepen on light for contrast
  "#0ea5e9": { light: "#0284C7", dark: "#38BDF8" },
  // Amber — fine on light, slightly lighter on dark
  "#f59e0b": { light: "#D97706", dark: "#FCD34D" },
  // Emerald (root) — good on both
  "#10b981": { light: "#059669", dark: "#34D399" },
  // Pink — fine on both
  "#ec4899": { light: "#DB2777", dark: "#F472B6" },
};

/** Normalise a color string for lookup (lowercase, expand #rgb → #rrggbb). */
function normaliseColor(c: string): string {
  const lower = c.trim().toLowerCase();
  // Expand shorthand #rgb → #rrggbb
  if (/^#[0-9a-f]{3}$/.test(lower)) {
    return (
      "#" + lower[1] + lower[1] + lower[2] + lower[2] + lower[3] + lower[3]
    );
  }
  return lower;
}

/** Return a theme-safe version of a raw data color. Falls back to the original. */
function themeColor(raw: string, isDark: boolean): string {
  const key = normaliseColor(raw);
  const entry = COLOR_MAP[key];
  if (entry) return isDark ? entry.dark : entry.light;
  return raw;
}

// ---------------------------------------------------------------------------
// Branch color palette (raw data colors — remapped at render time)
// ---------------------------------------------------------------------------
const BRANCH_COLORS = [
  "#326CE5", // blue
  "#0F1689", // navy
  "#7B42BC", // purple
  "#EE0000", // red
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
    color: "#10B981", // accent color — remapped per theme at render time
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
  placeChildren(root, root.id, 1, startAngle, endAngle, "#10B981");

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
// Drag threshold — movement (px in screen space) below which a pointer
// interaction is classified as a click rather than a drag.
// ---------------------------------------------------------------------------
const DRAG_THRESHOLD = 5;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MindMapViewer({ mindmap }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  // ---------------------------------------------------------------------------
  // Theme detection
  // ---------------------------------------------------------------------------
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(
        document.documentElement.dataset.theme === "dark" ||
          document.documentElement.classList.contains("dark")
      );
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => obs.disconnect();
  }, []);

  // ---------------------------------------------------------------------------
  // Per-node drag offsets  { id → { dx, dy } }
  // ---------------------------------------------------------------------------
  const [nodeOffsets, setNodeOffsets] = useState<
    Map<string, { dx: number; dy: number }>
  >(new Map());

  // Dragging a node — refs for the active drag gesture
  const draggingNodeId = useRef<string | null>(null);
  const nodeDragStart = useRef({ px: 0, py: 0 }); // pointer start (screen)
  const nodeDragOrigin = useRef({ dx: 0, dy: 0 }); // offset at drag start
  const nodeDragMoved = useRef(false); // did we exceed threshold?

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

  // Helper: get effective (layout + drag offset) position for a node
  const nodePos = useCallback(
    (id: string): { x: number; y: number } | null => {
      const ln = nodeMap.get(id);
      if (!ln) return null;
      const off = nodeOffsets.get(id);
      return {
        x: ln.x + (off?.dx ?? 0),
        y: ln.y + (off?.dy ?? 0),
      };
    },
    [nodeMap, nodeOffsets]
  );

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

  const resetLayout = useCallback(() => {
    setNodeOffsets(new Map());
  }, []);

  // Center the view — used on mount and when toggling fullscreen
  const centerView = useCallback((zoom: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
      setZoom(zoom);
    }
  }, []);

  const resetView = useCallback(() => {
    centerView(0.65);
  }, [centerView]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
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

  // ---------------------------------------------------------------------------
  // Canvas-level pointer handlers — used for panning.
  // Node drag gestures intercept the pointer before it reaches these.
  // ---------------------------------------------------------------------------
  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only start canvas pan if no node drag is in progress
      if (draggingNodeId.current !== null) return;
      if (e.button !== 0) return;
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOffset.current = { ...pan };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [pan]
  );

  const onCanvasPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Node drag in progress — update node offset
      if (draggingNodeId.current !== null) {
        const dx =
          (e.clientX - nodeDragStart.current.px) / zoom +
          nodeDragOrigin.current.dx;
        const dy =
          (e.clientY - nodeDragStart.current.py) / zoom +
          nodeDragOrigin.current.dy;

        // Check if we exceeded the threshold (in screen px)
        if (!nodeDragMoved.current) {
          const screenDx = e.clientX - nodeDragStart.current.px;
          const screenDy = e.clientY - nodeDragStart.current.py;
          if (
            Math.sqrt(screenDx * screenDx + screenDy * screenDy) >
            DRAG_THRESHOLD
          ) {
            nodeDragMoved.current = true;
          }
        }

        if (nodeDragMoved.current) {
          const id = draggingNodeId.current;
          setNodeOffsets(prev => {
            const next = new Map(prev);
            next.set(id, { dx, dy });
            return next;
          });
        }
        return;
      }

      // Canvas pan
      if (!isPanning.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPan({
        x: panOffset.current.x + dx,
        y: panOffset.current.y + dy,
      });
    },
    [zoom]
  );

  const onCanvasPointerUp = useCallback(() => {
    isPanning.current = false;
    draggingNodeId.current = null;
  }, []);

  // Zoom via scroll wheel — must be a non-passive native listener so
  // preventDefault() actually prevents page scroll.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      setZoom(z => Math.max(0.15, Math.min(3, z * delta)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [isFullscreen]); // re-bind when fullscreen toggles (containerRef DOM changes)

  // Center on mount
  useEffect(() => {
    centerView(0.65);
  }, []);

  // Re-center whenever fullscreen is toggled — wait one frame for layout
  useEffect(() => {
    const id = requestAnimationFrame(() => centerView(0.65));
    return () => cancelAnimationFrame(id);
  }, [isFullscreen]);

  // Close fullscreen on Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // ---------------------------------------------------------------------------
  // Toolbar (shared between normal and fullscreen)
  // ---------------------------------------------------------------------------
  const hasOffsets = nodeOffsets.size > 0;

  const toolbar = (
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
      {hasOffsets && (
        <button
          onClick={resetLayout}
          className="border-skin-line text-skin-base hover:border-skin-accent hover:text-skin-accent rounded border px-2.5 py-1 text-xs transition-colors"
        >
          Reset Layout
        </button>
      )}
      <button
        onClick={toggleFullscreen}
        className="border-skin-line text-skin-base hover:border-skin-accent hover:text-skin-accent rounded border px-2.5 py-1 text-xs transition-colors"
        title={
          isFullscreen ? "Exit expanded view (Esc)" : "Expand to full viewport"
        }
      >
        {isFullscreen ? (
          // Compress icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              display: "inline",
              width: 12,
              height: 12,
              verticalAlign: "middle",
            }}
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </svg>
        ) : (
          // Expand icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              display: "inline",
              width: 12,
              height: 12,
              verticalAlign: "middle",
            }}
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          </svg>
        )}
        <span className="ml-1">{isFullscreen ? "Exit" : "Expand"}</span>
      </button>
      <span className="text-skin-base/50 ml-auto text-xs">
        Scroll to zoom &middot; Drag canvas to pan &middot; Drag nodes to
        reposition &middot; Click to expand &middot; Right-click for notes
        {isFullscreen && " \u00b7 Esc to exit"}
      </span>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Canvas SVG — the mindmap-canvas class opts out of the global svg rule
  // ---------------------------------------------------------------------------
  const canvas = (
    <div
      ref={containerRef}
      className="border-skin-line bg-skin-fill relative overflow-hidden rounded-lg border"
      style={{
        height: isFullscreen ? "calc(100vh - 120px)" : "600px",
        touchAction: "none",
      }}
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
    >
      {/* mindmap-canvas resets the global `svg { h-6 w-6 fill-skin-base }` rule */}
      <svg
        className="mindmap-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
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
              const fromPos = nodePos(edge.from);
              const toPos = nodePos(edge.to);
              const to = nodeMap.get(edge.to);
              if (!fromPos || !toPos || !to) return null;
              const isHighlighted =
                hoveredId === edge.from || hoveredId === edge.to;
              const color = themeColor(to.color, isDark);
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={parentChildPath(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                  fill="none"
                  stroke={color}
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
              const fromPos = nodePos(edge.from);
              const toPos = nodePos(edge.to);
              if (!fromPos || !toPos) return null;
              const isHighlighted =
                hoveredId === edge.from || hoveredId === edge.to;
              const refColor = isDark ? "#FCD34D" : "#D97706";
              return (
                <g key={`ref-${edge.from}-${edge.to}`}>
                  <path
                    d={refPath(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                    fill="none"
                    stroke={refColor}
                    strokeWidth={isHighlighted ? 2 : 1.2}
                    strokeDasharray="6 4"
                    opacity={hoveredId ? (isHighlighted ? 0.9 : 0.12) : 0.4}
                    markerEnd="url(#ref-arrow)"
                    style={{ transition: "opacity 0.2s" }}
                  />
                  {edge.label && (
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2 - 8}
                      textAnchor="middle"
                      fontSize="9"
                      fill={refColor}
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

            // Theme-remapped color for this node
            const color = themeColor(ln.color, isDark);

            // Effective position including drag offset
            const off = nodeOffsets.get(ln.id);
            const nx = ln.x + (off?.dx ?? 0);
            const ny = ln.y + (off?.dy ?? 0);

            return (
              <g
                key={ln.id}
                transform={`translate(${nx}, ${ny})`}
                onMouseEnter={() => setHoveredId(ln.id)}
                onMouseLeave={() => setHoveredId(null)}
                onPointerDown={e => {
                  e.stopPropagation(); // prevent canvas pan from starting
                  if (e.button !== 0) return;
                  draggingNodeId.current = ln.id;
                  nodeDragStart.current = { px: e.clientX, py: e.clientY };
                  const existing = nodeOffsets.get(ln.id);
                  nodeDragOrigin.current = {
                    dx: existing?.dx ?? 0,
                    dy: existing?.dy ?? 0,
                  };
                  nodeDragMoved.current = false;
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                }}
                onPointerUp={e => {
                  e.stopPropagation();
                  const wasDrag = nodeDragMoved.current;
                  draggingNodeId.current = null;
                  nodeDragMoved.current = false;

                  // If it was just a tap/click (no significant movement), toggle expand
                  if (!wasDrag) {
                    if (e.button === 0 && hasChildren) {
                      toggleExpand(ln.id);
                    }
                  }
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
                style={{
                  cursor: hasChildren ? "grab" : "default",
                }}
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
                      ? color // solid accent fill for root
                      : isSelected
                        ? color + "30"
                        : isHovered
                          ? color + "20"
                          : color + "12"
                  }
                  stroke={color}
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
                    transition: "opacity 0.2s, fill 0.15s, stroke-width 0.15s",
                  }}
                />

                {/* Label text */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isRoot ? 15 : ln.depth === 1 ? 12 : 10.5}
                  fontWeight={isRoot || ln.depth === 1 ? "bold" : "500"}
                  // Root: white text on solid accent bg; others: branch color
                  fill={isRoot ? "#ffffff" : color}
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
                      fill={color}
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
                    <circle r={9} fill={color} opacity={0.7} />
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
                    fill={isSelected ? color : isDark ? "#FCD34D" : "#D97706"}
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
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isFullscreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "0.75rem",
          backgroundColor: "rgb(var(--color-fill))",
          overflow: "hidden",
        }}
      >
        {/* Fullscreen header */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-skin-base text-base leading-tight font-bold">
            {mindmap.title}
          </h2>
          <button
            onClick={toggleFullscreen}
            className="border-skin-line text-skin-base hover:border-skin-accent hover:text-skin-accent rounded border px-2 py-1 text-xs transition-colors"
            title="Exit (Esc)"
          >
            ✕ Exit
          </button>
        </div>
        {toolbar}
        {canvas}
        {selectedNode && selectedNode.notes && (
          <div style={{ flexShrink: 0, maxHeight: "30vh", overflowY: "auto" }}>
            <MindMapNotes
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-skin-base text-xl font-bold">{mindmap.title}</h2>
        <p className="text-skin-base/70 mt-1 text-sm">{mindmap.description}</p>
      </div>

      {toolbar}
      {canvas}

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
