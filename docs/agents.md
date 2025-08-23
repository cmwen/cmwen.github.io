Agents feature — UX & implementation plan

Overview

Add an "Agents" tab to the site that hosts a curated collection of prompt templates and small agent descriptions (e.g., Accountant, Storic). Users can: select the target LLM/provider, pick an agent, optionally edit the prompt, and then launch the chosen provider's web UI or desktop app with the prompt pre-filled via deep link or web URL.

Goals

- Give readers a simple place to reuse and launch prompts against multiple providers.
- Keep the UI minimal and consistent with the site's design.
- Persist provider preference in localStorage so users can quickly reuse their preferred endpoint.

Requirements (explicit)

- A new "Agents" tab/route that lists agents and prompts.
- Provider selection stored in localStorage.
- A list of agents/prompts that can be selected and then launched.
- Deep links or web URLs that prepopulate the prompt when possible.
- Saved UX/design doc in `docs/agents.md`.

Assumptions (reasonable defaults)

- We'll support a small set of providers up front: OpenAI ChatGPT (web + app), Microsoft Copilot (web), Google Gemini (web), Perplexity (web + app). Anthropic (Claude) will be web-only with no prompt deep-link support.
- LocalStorage key: `agents.selectedProvider`.
- Prompt templates may include variables (like {{topic}}); initial MVP will not support complex templating beyond simple string replacement.

UX Design

High level flow

1. User opens the "Agents" page from the top nav.
2. A compact header shows the selected provider and a provider selector dropdown (label: "Target LLM").
3. Below, a searchable list/grid of agent cards (name, short description, tags).
4. Clicking an agent opens a drawer/modal (or route) with the full prompt template, editable textarea, and two actions: "Open in Provider" and "Copy prompt".
5. "Open in Provider" will build the provider-specific deep link or web URL and open it in a new tab/window. If an app scheme is available, the same link is shown as a direct app-scheme link and the web URL is provided as fallback.
6. The provider selector persists to localStorage and updates the page immediately; agent selection should not change provider.

Layout & components

- Provider Selector (small dropdown, persistent): shows provider logo/name; selecting updates localStorage.
- AgentCard component: shows name, short description, tags; click to open details.
- AgentDetails modal/drawer: shows template, editable text area, deep link preview, launch/copy buttons.

Accessibility

- Keyboard-navigable list, proper aria labels for dropdown and modal.

Data Model

- provider: { id: string, name: string, appScheme?: string, webUrl: string, promptParam?: string }
- agent: { id: string, name: string, description: string, tags: string[], promptTemplate: string }

Example providers (MVP)

- openai_chatgpt
  - name: "OpenAI — ChatGPT"
  - appScheme: "chatgpt://"
  - webUrl: "https://chat.openai.com/"
  - web deep-link: https://chat.openai.com/?model=gpt-4&prompt={urlEncodedPrompt} (VERIFIED WORKING)
- microsoft_copilot
  - name: "Microsoft Copilot"
  - webUrl: "https://copilot.microsoft.com/"
  - web deep-link: https://copilot.microsoft.com/?q={urlEncodedPrompt}
- google_gemini
  - name: "Google Gemini"
  - appScheme: "bard://"
  - webUrl: "https://gemini.google.com/"
  - web deep-link: https://gemini.google.com/app?query={urlEncodedPrompt}
- perplexity
  - name: "Perplexity"
  - appScheme: "perplexity://"
  - webUrl: "https://www.perplexity.ai/"
  - web deep-link: https://www.perplexity.ai/search?q={urlEncodedPrompt} (VERIFIED WORKING)
- anthopic_claude
  - name: "Anthropic — Claude"
  - webUrl: "https://claude.ai/"
  - deep linking: none / not supported

Deep-link building rules

- Always url-encode the prompt text.
- If provider supports app scheme and appScheme is set, present both a fast-launch app-scheme link (which opens the native app when available) and a web URL fallback.
- Use provider-specific query param names as noted above; use defaults if provider doesn't support direct prompt injection.
- For providers without prompt injection, open their main web URL and copy the prompt to clipboard (and show a toast) as guidance.

Implementation roadmap (MVP)

1. Add `docs/agents.md` (this document).
2. Add route `src/pages/agents/index.astro` with placeholder and register a top nav tab linking to `/agents/` (small header change in `src/components/Header.astro`).
3. Add a minimal `src/components/Agents` React component set (ProviderSelector, AgentCard, AgentDetails modal). Keep client-only (`client:load`) for interactivity.
4. Add `src/content/agents.json` or `src/data/agents.ts` containing agent definitions (start with curated agents).
5. Implement localStorage provider persistence and deep-link builder utility `src/utils/agents.ts`.
6. Add small Playwright smoke test hitting `/agents/` and exercising provider selection and opening link (only navigation and copy behavior in test — no external network calls).

Sample Agent Personas (Initial Collection)

**Thought Leaders & Visionaries**
- Yuval Noah Harari: Historical perspective on technology and humanity's future
- Naval Ravikant: Wealth creation, happiness, and philosophical insights
- Adam Grant: Organizational psychology and thinking patterns
- Steve Jobs: Product design philosophy and innovation thinking

**SDLC Specialists**
- Product Manager: Requirements gathering, roadmap planning, stakeholder communication
- Software Architect: System design, technology decisions, scalability planning
- DevOps Engineer: Infrastructure, CI/CD, monitoring, and deployment strategies
- QA Engineer: Test strategy, automation, quality assurance processes
- Scrum Master: Agile facilitation, team dynamics, process improvement
- Technical Writer: Documentation, API references, user guides

**Domain Experts**
- NSW Sydney Accountant: Australian tax law, GST, business structures, compliance
- Clinical Psychologist: Mental health assessment, therapeutic approaches, behavioral analysis
- Financial Advisor: Investment strategies, retirement planning, risk management
- Legal Counsel: Contract review, intellectual property, regulatory compliance

**Meta-Prompt Specialists**
- Prompt Engineer: Optimizing AI interactions, chain-of-thought reasoning
- Research Assistant: Academic research, citation management, literature reviews
- Creative Director: Brand strategy, visual design, creative campaigns
- Data Analyst: Statistical analysis, visualization, insights generation

Edge cases & considerations

- Empty prompt template or very long prompts (URL length limits): warn user and fallback to copying prompt to clipboard.
- Mobile vs desktop: opening app-scheme may behave differently. For web UX, always show web URL and copy-to-clipboard fallback.
- Provider API changes: keep provider definitions centralized for easy updates.

Acceptance criteria

- `docs/agents.md` exists and contains the UX & plan.
- The site has a new `/agents/` route (placeholder) and a top nav link to it (scaffolded in next steps; not part of this doc-only change).

Next steps (if you want me to continue)

- I can scaffold the `/agents/` page and Header tab, plus client-side React components, sample agent data, and utilities; then run the dev server to validate.
- I can also add tests and small README usage notes.

Quality gates

- Add Playwright smoke test for basic navigation and provider select interaction.
- Run lint/format.

Notes

- This doc is intentionally implementation-oriented and small. If you prefer a richer visual mockup or more complex templating, say so and I will expand the spec.
