import { useState, useRef, useCallback, useEffect } from "react";
import type { MindMap, MindMapNode } from "@data/mindmaps";
import { MindMapTreeNode } from "./MindMapTreeNode";
import { MindMapNotes } from "./MindMapNotes";

interface Props {
  mindmap: MindMap;
}

interface Point {
  x: number;
  y: number;
}

export function MindMapViewer({ mindmap }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Expand root and first-level children by default
    const ids = new Set<string>();
    ids.add(mindmap.root.id);
    mindmap.root.children?.forEach(c => ids.add(c.id));
    return ids;
  });
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);

  // Pan state
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<Point>({ x: 0, y: 0 });
  const offsetStart = useRef<Point>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const ids = new Set<string>();
    const walk = (node: MindMapNode) => {
      ids.add(node.id);
      node.children?.forEach(walk);
    };
    walk(mindmap.root);
    setExpandedIds(ids);
  }, [mindmap]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set([mindmap.root.id]));
  }, [mindmap]);

  const resetView = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  // Mouse panning
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // left click only
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      offsetStart.current = { ...offset };
    },
    [offset]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setOffset({
        x: offsetStart.current.x + dx,
        y: offsetStart.current.y + dy,
      });
    },
    [isPanning]
  );

  const onMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch panning
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      setIsPanning(true);
      panStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      offsetStart.current = { ...offset };
    },
    [offset]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPanning || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - panStart.current.x;
      const dy = e.touches[0].clientY - panStart.current.y;
      setOffset({
        x: offsetStart.current.x + dx,
        y: offsetStart.current.y + dy,
      });
    },
    [isPanning]
  );

  const onTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Release panning if mouse leaves the container
  useEffect(() => {
    const handleGlobalUp = () => setIsPanning(false);
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
    };
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
          Drag to pan &middot; Click nodes to expand &middot; Click{" "}
          <span className="bg-skin-accent/40 inline-block h-3 w-3 rounded-full align-middle" />{" "}
          for notes
        </span>
      </div>

      {/* Mind map canvas */}
      <div
        ref={containerRef}
        className={`border-skin-line bg-skin-fill relative overflow-hidden rounded-lg border ${
          isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ minHeight: "420px" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="inline-block min-w-full p-6 transition-transform duration-75"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <MindMapTreeNode
            node={mindmap.root}
            expandedIds={expandedIds}
            onToggle={toggleExpand}
            onSelectNode={setSelectedNode}
            selectedNodeId={selectedNode?.id ?? null}
            depth={0}
          />
        </div>
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
