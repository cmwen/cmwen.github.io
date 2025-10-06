import mermaid from "mermaid";
import type { MermaidConfig } from "mermaid";

const DEFAULT_CONFIG: MermaidConfig = {
  startOnLoad: false,
  securityLevel: "loose",
  theme: "neutral",
  themeVariables: {
    primaryColor: "#0ea5e9",
    primaryBorderColor: "#0284c7",
    lineColor: "#94a3b8",
    fontSize: "16px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
  },
};

let initialized = false;

function ensureInitialized() {
  if (!initialized) {
    mermaid.initialize(DEFAULT_CONFIG);
    initialized = true;
  }
}

function createDiagramContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.className =
    "mermaid-diagram my-6 overflow-x-auto rounded border border-skin-line bg-skin-card p-4";
  // Ensure SVGs inside display properly
  container.style.cssText = "min-height: 100px;";
  return container;
}

export async function renderMermaidDiagrams(
  blocks: HTMLElement[]
): Promise<void> {
  ensureInitialized();

  await Promise.all(
    blocks.map(async (pre, index) => {
      const code = pre.querySelector("code");
      const chartDefinition = code?.textContent?.trim();

      if (!chartDefinition) {
        return;
      }

      const container = createDiagramContainer();
      const renderId = `mermaid-${Date.now()}-${index}`;

      try {
        const { svg, bindFunctions } = await mermaid.render(
          renderId,
          chartDefinition
        );
        container.innerHTML = svg;

        // Fix SVG sizing - ensure it's visible and properly scaled
        const svgElement = container.querySelector("svg");
        if (svgElement) {
          // Set explicit width to 100% and let height scale proportionally
          svgElement.style.cssText =
            "width: 100%; height: auto; max-width: 100%;";
          // Remove any fixed width/height attributes that might interfere
          svgElement.removeAttribute("width");
          svgElement.removeAttribute("height");
        }

        bindFunctions?.(container);
        pre.replaceWith(container);
      } catch (error) {
        console.error("Failed to render mermaid diagram", error);
        const errorWrapper = document.createElement("div");
        errorWrapper.className =
          "mermaid-error border border-red-300 bg-red-50 p-3 text-sm text-red-700";
        errorWrapper.textContent = `Mermaid rendering error: ${error instanceof Error ? error.message : String(error)}`;
        container.appendChild(errorWrapper);
        pre.replaceWith(container);
      }
    })
  );
}
