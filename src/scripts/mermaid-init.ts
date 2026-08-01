import mermaid from "mermaid";
import type { MermaidConfig } from "mermaid";

type ColorTheme = "light" | "dark";

const FONT_FAMILY =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont";

let renderSequence = 0;
let renderQueue = Promise.resolve();

function getColorTheme(): ColorTheme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getConfig(theme: ColorTheme): MermaidConfig {
  const dark = theme === "dark";

  return {
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: {
      background: dark ? "#181e28" : "#f5fbf0",
      primaryColor: dark ? "#173f34" : "#d1fae5",
      primaryTextColor: dark ? "#f8fafc" : "#10211a",
      primaryBorderColor: dark ? "#34d399" : "#059669",
      secondaryColor: dark ? "#1e3a5f" : "#e0f2fe",
      secondaryTextColor: dark ? "#f8fafc" : "#10211a",
      secondaryBorderColor: dark ? "#60a5fa" : "#0284c7",
      tertiaryColor: dark ? "#202938" : "#f8fafc",
      tertiaryTextColor: dark ? "#f8fafc" : "#10211a",
      tertiaryBorderColor: dark ? "#64748b" : "#64748b",
      lineColor: dark ? "#cbd5e1" : "#475569",
      arrowheadColor: dark ? "#cbd5e1" : "#475569",
      textColor: dark ? "#f1f5f9" : "#1f2937",
      mainBkg: dark ? "#173f34" : "#d1fae5",
      nodeBkg: dark ? "#173f34" : "#d1fae5",
      nodeBorder: dark ? "#34d399" : "#059669",
      nodeTextColor: dark ? "#f8fafc" : "#10211a",
      clusterBkg: dark ? "#111827" : "#f8fafc",
      clusterBorder: dark ? "#64748b" : "#94a3b8",
      titleColor: dark ? "#f8fafc" : "#10211a",
      edgeLabelBackground: dark ? "#181e28" : "#f5fbf0",
      actorBkg: dark ? "#243c34" : "#ecfdf5",
      actorBorder: dark ? "#34d399" : "#059669",
      actorTextColor: dark ? "#f8fafc" : "#10211a",
      actorLineColor: dark ? "#94a3b8" : "#64748b",
      signalColor: dark ? "#cbd5e1" : "#475569",
      signalTextColor: dark ? "#f1f5f9" : "#1f2937",
      labelBoxBkgColor: dark ? "#202938" : "#f8fafc",
      labelBoxBorderColor: dark ? "#64748b" : "#94a3b8",
      labelTextColor: dark ? "#f8fafc" : "#1f2937",
      loopTextColor: dark ? "#f8fafc" : "#1f2937",
      noteBkgColor: dark ? "#3f3212" : "#fef3c7",
      noteBorderColor: dark ? "#fbbf24" : "#d97706",
      noteTextColor: dark ? "#f8fafc" : "#1f2937",
      activationBkgColor: dark ? "#173f34" : "#d1fae5",
      activationBorderColor: dark ? "#34d399" : "#059669",
      fontSize: "16px",
      fontFamily: FONT_FAMILY,
    },
  };
}

function configureMermaid() {
  mermaid.initialize(getConfig(getColorTheme()));
}

function createDiagramContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.className =
    "mermaid-diagram not-prose my-6 overflow-x-auto rounded border border-skin-line bg-skin-card p-4";
  // Ensure SVGs inside display properly
  container.style.cssText = "min-height: 100px;";
  return container;
}

async function renderInto(
  container: HTMLElement,
  chartDefinition: string
): Promise<void> {
  const renderId = `mermaid-${Date.now()}-${renderSequence++}`;
  const { svg, bindFunctions } = await mermaid.render(
    renderId,
    chartDefinition
  );

  container.innerHTML = svg;
  const svgElement = container.querySelector("svg");
  if (svgElement) {
    svgElement.classList.add("mermaid-svg");
    svgElement.style.cssText = "width: 100%; height: auto; max-width: 100%;";
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");
  }

  bindFunctions?.(container);
}

function enqueueRender(work: () => Promise<void>): Promise<void> {
  renderQueue = renderQueue.catch(() => undefined).then(work);
  return renderQueue;
}

export async function renderMermaidDiagrams(
  blocks: HTMLElement[]
): Promise<void> {
  await enqueueRender(async () => {
    configureMermaid();

    await Promise.all(
      blocks.map(async pre => {
        const code = pre.querySelector("code");
        const chartDefinition = code?.textContent?.trim();

        if (!chartDefinition) {
          return;
        }

        const container = createDiagramContainer();
        container.dataset.mermaidDefinition = chartDefinition;

        try {
          await renderInto(container, chartDefinition);
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
  });
}

export async function rerenderMermaidDiagrams(
  containers: HTMLElement[]
): Promise<void> {
  await enqueueRender(async () => {
    configureMermaid();

    await Promise.all(
      containers.map(async container => {
        const chartDefinition = container.dataset.mermaidDefinition;
        if (!chartDefinition) return;

        try {
          await renderInto(container, chartDefinition);
        } catch (error) {
          console.error("Failed to re-render mermaid diagram", error);
        }
      })
    );
  });
}
