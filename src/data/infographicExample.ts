import type { InfographicIR } from "@min-infograph/core";
import type { Locale } from "@i18n/config";

export function infographicExample(lang: Locale): InfographicIR {
  const zh = lang === "zh-hant";
  return {
    version: "0.1",
    title: zh ? "從想法到靜態網站" : "From idea to static website",
    subtitle: zh
      ? "用結構化資料呈現網站的內容流程。"
      : "A content workflow presented as structured data.",
    style: "technical",
    shape: "rounded",
    layout: { type: "grid", columns: 2 },
    blocks: [
      {
        id: "workflow",
        type: "mermaid",
        span: 2,
        title: zh ? "內容流程" : "Content workflow",
        diagram: zh
          ? "flowchart LR\n  A[撰寫內容] --> B[驗證資料]\n  B --> C[建置靜態頁面]\n  C --> D[讀者瀏覽]"
          : "flowchart LR\n  A[Write content] --> B[Validate data]\n  B --> C[Build static pages]\n  C --> D[Read on the web]",
      },
      {
        id: "static",
        type: "text",
        title: zh ? "先呈現內容" : "Content first",
        text: zh
          ? "文字與圖片在建置時產生，不需要 JavaScript 就能閱讀。"
          : "Text and images are generated at build time and remain readable without JavaScript.",
      },
      {
        id: "diagrams",
        type: "callout",
        title: zh ? "按需載入圖表" : "Diagrams on demand",
        text: zh
          ? "Mermaid 圖表進入可視範圍時才載入，原始碼也隨時可查看。"
          : "Mermaid diagrams load when they enter the viewport, with their source available to read.",
        tone: "info",
      },
    ],
  };
}
