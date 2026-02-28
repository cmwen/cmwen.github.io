import { useState, useMemo } from "react";

export interface MindMapCardInfo {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  updatedAt: string;
}

interface Props {
  mindmaps: MindMapCardInfo[];
  basePath: string; // e.g. "/toolbox/mindmaps" or "/zh-hant/toolbox/mindmaps"
}

export default function MindMapsApp({ mindmaps, basePath }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return mindmaps;
    const q = search.toLowerCase();
    return mindmaps.filter(
      m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [search, mindmaps]);

  return (
    <div className="mt-4">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search mind maps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border-skin-line bg-skin-fill text-skin-base placeholder:text-skin-base/50 focus:border-skin-accent focus:ring-skin-accent w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-skin-base/60 py-12 text-center">
          <p className="text-lg font-medium">No mind maps found</p>
          <p className="mt-1 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(m => (
            <a
              key={m.slug}
              href={`${basePath}/${m.slug}/`}
              className="group border-skin-line bg-skin-card hover:border-skin-accent hover:bg-skin-card-muted rounded-lg border p-4 text-left transition-colors"
            >
              <h3 className="text-skin-base group-hover:text-skin-accent font-semibold">
                {m.title}
              </h3>
              <p className="text-skin-base/70 mt-1 line-clamp-2 text-sm">
                {m.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-skin-accent/10 text-skin-accent inline-block rounded px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-skin-base/50 mt-2 text-xs">
                Updated{" "}
                {new Date(m.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
