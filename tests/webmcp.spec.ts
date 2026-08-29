import { expect, test, type Page } from "@playwright/test";

type RegisteredWebMCPTool = {
  name: string;
  execute: (
    input: unknown,
    options?: { signal?: AbortSignal }
  ) => string | Promise<string>;
};

declare global {
  interface Window {
    __registeredWebMCPTools: RegisteredWebMCPTool[];
    __rejectedWebMCPTools: string[];
    __rejectWebMCPToolName?: string;
  }
}

const installWebMCPHarness = async (page: Page) => {
  await page.addInitScript(() => {
    window.__registeredWebMCPTools = [];
    window.__rejectedWebMCPTools = [];
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: {
        registerTool: async (
          tool: RegisteredWebMCPTool,
          options?: { signal?: AbortSignal }
        ) => {
          if (window.__rejectWebMCPToolName === tool.name) {
            window.__rejectedWebMCPTools.push(tool.name);
            throw new Error(`Rejected ${tool.name}`);
          }
          window.__registeredWebMCPTools =
            window.__registeredWebMCPTools.filter(
              registered => registered.name !== tool.name
            );
          window.__registeredWebMCPTools.push(tool);
          options?.signal?.addEventListener(
            "abort",
            () => {
              window.__registeredWebMCPTools =
                window.__registeredWebMCPTools.filter(
                  registered => registered !== tool
                );
            },
            { once: true }
          );
          return undefined;
        },
      },
    });
  });
};

const waitForTool = async (page: Page, name: string) => {
  await expect
    .poll(() =>
      page.evaluate(
        toolName =>
          window.__registeredWebMCPTools?.some(tool => tool.name === toolName) ??
          false,
        name
      )
    )
    .toBe(true);
};

test.describe("WebMCP", () => {
  test.beforeEach(async ({ page }) => {
    await installWebMCPHarness(page);
  });

  test("publishes a searchable content index", async ({ request }) => {
    const response = await request.get("/webmcp/content-index.json");
    expect(response.ok()).toBe(true);

    const index = (await response.json()) as {
      version: number;
      items: Array<{ kind: string; title: string }>;
    };
    expect(index.version).toBe(1);
    expect(index.items.some(item => item.kind === "post")).toBe(true);
    expect(index.items.some(item => item.kind === "notebook")).toBe(true);
    expect(index.items.some(item => item.kind === "mindmap")).toBe(true);
    expect(index.items.some(item => item.kind === "tool")).toBe(true);
    expect(index.items.some(item => item.kind === "agent")).toBe(true);

    const newPost = index.items.find(
      item => item.title === "WebMCP and the Shared Browser: Where Humans and Agents Co-Work"
    ) as { alternates?: Record<string, string> } | undefined;
    expect(newPost?.alternates?.en).toMatch(
      /\/posts\/webmcp-shared-browser-human-agent\/$/
    );
    expect(newPost?.alternates?.["zh-hant"]).toBeUndefined();
  });

  test("registers search_site globally and returns canonical results", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForTool(page, "search_site");

    const output = await page.evaluate(async () => {
      const tool = window.__registeredWebMCPTools.find(
        candidate => candidate.name === "search_site"
      );
      if (!tool) throw new Error("search_site was not registered");
      return tool.execute({
        query: "WebMCP discovery",
        kinds: ["post"],
        language: "en",
        limit: 3,
      });
    });
    const result = JSON.parse(output);

    expect(result.results[0].title).toContain("WebMCP");
    expect(result.results[0].url).toMatch(
      /\/posts\/webmcp-discovery-problem\/$/
    );
  });

  test("registers read_content on posts and reads bounded sections", async ({
    page,
  }) => {
    await page.goto("/posts/webmcp-discovery-problem/");
    await waitForTool(page, "read_content");

    const metadataOutput = await page.evaluate(async () => {
      const tool = window.__registeredWebMCPTools.find(
        candidate => candidate.name === "read_content"
      );
      if (!tool) throw new Error("read_content was not registered");
      return tool.execute({ view: "metadata" });
    });
    const metadata = JSON.parse(metadataOutput);
    expect(metadata.kind).toBe("post");
    expect(metadata.language).toBe("en");
    expect(metadata.canonicalUrl).toMatch(/webmcp-discovery-problem\/$/);

    const sectionOutput = await page.evaluate(async () => {
      const tool = window.__registeredWebMCPTools.find(
        candidate => candidate.name === "read_content"
      );
      if (!tool) throw new Error("read_content was not registered");
      return tool.execute({
        view: "section",
        section: "The Current State: Navigation Required",
        maxChars: 500,
      });
    });
    const section = JSON.parse(sectionOutput);
    expect(section.section).toBe("The Current State: Navigation Required");
    expect(section.content).toContain("WebMCP discovery works like this");
    expect(section.content.length).toBeLessThanOrEqual(500);
  });

  test("registers explore_mindmap only on mind-map details", async ({ page }) => {
    await page.goto(
      "/toolbox/mindmaps/observability-opentelemetry-and-genai/"
    );
    await waitForTool(page, "explore_mindmap");

    const output = await page.evaluate(async () => {
      const tool = window.__registeredWebMCPTools.find(
        candidate => candidate.name === "explore_mindmap"
      );
      if (!tool) throw new Error("explore_mindmap was not registered");
      return tool.execute({ query: "OTLP Protocol", depth: 0 });
    });
    const result = JSON.parse(output);

    expect(result.branch.label).toBe("OTLP Protocol");
    expect(result.path).toContain("OpenTelemetry (OTel)");
    expect(output.length).toBeLessThanOrEqual(1500);
  });

  test("rolls back earlier tools when contextual registration fails", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.__rejectWebMCPToolName = "read_content";
    });
    await page.goto("/posts/webmcp-discovery-problem/");

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.__rejectedWebMCPTools.includes("read_content")
        )
      )
      .toBe(true);
    expect(await page.evaluate(() => window.__registeredWebMCPTools)).toEqual(
      []
    );
  });
});
