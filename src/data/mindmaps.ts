// Mind Map data model — AI-friendly, hierarchical tree structure
// Each mind map is a tree of MindMapNode objects with optional notes.

/** A cross-branch reference from one node to another. */
export interface MindMapRef {
  /** Target node ID this node references. */
  targetId: string;
  /** Optional label describing the relationship (e.g. "deploys via", "depends on"). */
  label?: string;
}

/** A single node in the mind map tree. */
export interface MindMapNode {
  /** Unique identifier for the node (kebab-case, e.g. "k8s-pods"). */
  id: string;
  /** Display label shown on the node. */
  label: string;
  /** Optional color hint for the node branch (CSS color or theme token). */
  color?: string;
  /** Optional detailed notes (Markdown-friendly plain text). */
  notes?: string;
  /** Optional annotation — a short tag/badge shown directly on the node (e.g. "key concept", "gotcha"). */
  annotation?: string;
  /** Cross-branch references to other nodes. Rendered as dashed connector lines. */
  refs?: MindMapRef[];
  /** Child nodes. Leaf nodes have an empty array or omit this field. */
  children?: MindMapNode[];
}

/** Metadata + tree for a mind map. Used by React components. */
export interface MindMap {
  /** Unique slug used in routing and identification. */
  slug: string;
  /** Human-readable title. */
  title: string;
  /** Short description for cards and SEO. */
  description: string;
  /** Tags for filtering/search. */
  tags: string[];
  /** ISO 8601 creation date. */
  createdAt: string;
  /** ISO 8601 last-modified date. */
  updatedAt: string;
  /** The root node of the mind map tree. */
  root: MindMapNode;
}
