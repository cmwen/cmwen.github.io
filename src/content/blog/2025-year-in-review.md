---
title: "2025: A Year of AI-Powered Development and Personal Growth"
author: Min Wen
description: "A comprehensive reflection on 27 blog posts, tracing my journey through AI coding agents, developer tools, personal experiments, and the evolving landscape of software development in 2025."
pubDatetime: 2025-12-31T12:00:00.000Z
slug: 2025-year-in-review
tags: ["yearly-review", "ai", "coding-agents", "reflection"]
featured: true
llmKeyIdeas:
  [
    "AI coding evolution",
    "tool-calling patterns",
    "agentic SDLC",
    "personal workflows",
    "developer productivity",
    "continuous AI adoption",
    "learning experiments",
    "year retrospective",
  ]
---

# 2025: A Year of AI-Powered Development and Personal Growth

As I sit down to reflect on 2025, I'm struck by how much has changed—not just in the technology I use, but in how I think about software development itself. This year produced 27 blog posts, each one a snapshot of learning, experimentation, and sometimes stumbling upon something unexpected. Looking back, I see a clear narrative emerging: **2025 was the year AI coding agents moved from novelty to necessity, and I learned to work alongside them as partners rather than tools**.

But that's not the whole story. This year was also about venturing beyond my comfort zone—into video production, self-hosted systems, and even generating custom book chapters with LLMs. It was about finding patterns in chaos and building mental models that actually work.

Let me take you through the journey.

---

## Part I: Foundations – Understanding How LLMs Really Work (May)

The year began with a deep dive into the fundamentals. I needed to understand not just _what_ LLMs could do, but _how_ they did it. Three posts in May set the stage:

### **Tool Calling and the RAG Revolution**

In ["Understanding LLM Tool Calling in LangChain"](https://cmwen.com/posts/llm-tool-calling-langchain/) (May 3), I broke down the mechanics of how LLMs go from generating text to actually _doing things_. Tool calling isn't magic—it's a structured way for LLMs to invoke functions, fetch data, and interact with systems. This seemingly technical topic became the foundation for everything that followed.

Just days later, ["Unlocking the Power of VS Code Copilot: Using #fetch for RAG"](https://cmwen.com/posts/using-vscode-copilot-fetch-for-rag/) (May 14) showed me how these concepts applied to my daily work. The `#fetch` tool in VS Code Copilot let me pull in external context—documentation, API specs, code examples—turning Copilot from a code completer into a research assistant. This was my first taste of **Retrieval-Augmented Generation (RAG)** in practice, and it changed how I approached complex coding tasks.

### **Databases for the AI Era**

The question of persistence came next. In ["RDB vs Vector DB in LLM Financial App"](https://cmwen.com/posts/rdb-vs-vector-db-in-llm-financial-app/) (May 10), I compared relational databases with vector databases for LLM-powered applications. The answer wasn't simple—it depended on whether you needed structured transactions or semantic similarity search.

Then came ["Why Modern PostgreSQL is a Game-Changer for AI Agents"](https://cmwen.com/posts/postgresql-ai-agents/) (May 22), which revealed that PostgreSQL had evolved beyond its traditional role. With pgvector, full-text search, and JSON support, it could handle both relational and vector workloads. This was a revelation: **you don't always need to adopt bleeding-edge databases to build AI-powered systems**. Sometimes, the old guard adapts faster than we expect.

### **A New Way to Learn**

["Idea: Learn a Book Before Reading It"](https://cmwen.com/posts/idea-learn-a-book-before-reading-it/) (May 11) captured an experiment in proactive learning. Instead of passively reading books cover-to-cover, I used LLMs to generate summaries, extract key concepts, and formulate questions _before_ diving in. This inverted the traditional learning model—moving from reactive absorption to proactive exploration.

Looking back, these May posts were about **building mental models**. I was learning the grammar of AI-assisted development: tool calling, RAG, vector search, and proactive workflows. These weren't just techniques—they were the building blocks of a new way of working.

---

## Part II: The Copilot Chronicles – Navigating Premium Features and Trade-offs (August–October)

By mid-year, GitHub Copilot had become central to my workflow. But the landscape was changing rapidly. New features, new pricing models, and new mental models demanded attention.

### **Upgrading and Adapting**

["Reflections on Upgrading to GitHub Copilot Pro"](https://cmwen.com/posts/reflections-on-upgrading-to-github-copilot-pro/) (August 10) marked a turning point. Switching from enterprise Copilot to Copilot Pro forced me to rethink resource management. Suddenly, I had **premium requests** to manage—a monthly quota that required strategic thinking. I learned to save premium requests for high-value tasks like code reviews and complex design work, while using standard models for routine implementation.

The follow-up post, ["Copilot Pro Tips: Monthly Premium Reset and a Model Bakeoff"](https://cmwen.com/posts/copilot-pro-monthly-reset-and-model-bakeoff/) (August 31), shared practical strategies: tracking premium resets, running model comparisons, and using IndexedDB for offline storage of preferences. This wasn't just about using a tool—it was about **optimizing a workflow** in the face of real constraints.

### **The CLI Debates**

CLI tools became a hot topic. In ["GitHub Copilot CLI: Why the Pricing Model Matters"](https://cmwen.com/posts/copilot-cli-pricing-model-comparison/) (October 5), I examined GitHub's decision to make Copilot CLI premium-only. This wasn't just a pricing decision—it was a signal about where GitHub saw value and adoption friction.

A week later, ["Copilot CLI vs Codex CLI: Terminal AI Assistants Compared"](https://cmwen.com/posts/copilot-cli-vs-codex-cli/) (October 12) put two terminal assistants head-to-head. While Copilot CLI had enterprise backing, Codex CLI offered MCP server support and greater flexibility. The comparison highlighted a broader truth: **there's no one-size-fits-all AI coding tool**. Context matters.

### **Configuration Complexity**

["Codex CLI MCP Environment Variables: Lessons from the Sandbox"](https://cmwen.com/posts/mcp-env-vars-in-codex-cli/) (October 14) captured a frustrating but important lesson: MCP servers need explicit environment variable configuration. What seemed like a bug was actually a design decision—one that forced me to be more intentional about tool setup.

By December, I'd accumulated enough experience to write ["The 2025 Field Guide to Customizing Copilot in VS Code"](https://cmwen.com/posts/the-2025-field-guide-to-customizing-copilot-in-vs-code/) (December 22). This post synthesized months of experimentation into a practical framework: when to use instructions vs. prompt files vs. custom agents vs. MCP servers. The key insight? **Reduce configuration drift** by establishing clear boundaries and conventions.

The Copilot posts weren't just product reviews—they were explorations of **how to think about AI-assisted development**. They forced me to confront trade-offs, manage resources, and build mental models that scaled beyond individual features.

---

## Part III: Agentic SDLC – Rethinking Software Development (August–November)

The most transformative theme of 2025 was the emergence of **agentic software development life cycles (SDLC)**. This wasn't about replacing human developers—it was about augmenting workflows with AI agents that could take on well-defined tasks while keeping humans in the loop.

### **The Human-in-the-Loop Playbook**

["Agentic SDLC: Human-in-the-Loop Playbook"](https://cmwen.com/posts/agentic-sdlc-human-in-the-loop-playbook/) (August 25) laid out a practical framework. The core principle: **agents should automate the repetitive, humans should handle the creative**. This meant defining clear handoff points, establishing guardrails, and building workflows where agents could iterate quickly while humans provided direction and validation.

This playbook became my reference point for the rest of the year. It influenced how I approached code reviews, diff analysis, and even documentation.

### **Codemods and Diff Workflows**

["Exporting Diffs for LLM Analysis and Codemod Generation"](https://cmwen.com/posts/exporting-diffs-for-llm-codemods/) (August 26) tackled a specific problem: how to leverage LLMs for large-scale code transformations. By exporting git diffs and feeding them to LLMs, I could generate codemods that applied consistent changes across codebases. This was **agentic refactoring**—letting AI handle the mechanical work while I focused on the logic.

### **From Research to Engineering**

["From Research to Engineering: Understanding the Critical Transition"](https://cmwen.com/posts/from-research-to-engineering/) (September 2) explored a subtle but critical distinction. Research is about exploring possibilities; engineering is about optimizing proven solutions. AI coding agents excel in the latter—taking well-defined problems and implementing solutions efficiently. But they struggle with the former, where creativity and intuition dominate.

This post helped me understand **where agents fit in the development process**. They're not general-purpose problem solvers—they're specialized tools for execution.

### **Standardizing Agent Instructions**

["AGENTS.md: A New Standard for Unified Coding Agent Instructions"](https://cmwen.com/posts/agents-md-a-new-standard-for-unified-coding-agent-instructions/) (September 13) introduced a convention I immediately adopted: storing agent instructions in a standardized `AGENTS.md` file. This made it easier to onboard new agents, share configurations, and maintain consistency across projects.

The follow-up, ["The Rise of Personal Forks: Customizing Open Source with AI Coding Agents"](https://cmwen.com/posts/personalizing-open-source-with-coding-agents/) (September 14), explored a fascinating consequence: **AI agents make personal forks viable**. Instead of requesting features from maintainers, developers could use agents to customize open source projects for their own needs. This democratized customization but also raised questions about fragmentation and maintainability.

### **Multi-Agent Patterns**

By November, a pattern was emerging. ["Multi-Agent Systems Beyond VSCode: A Pattern Emerges"](https://cmwen.com/posts/multi-agent-pattern-vscode-autogen-sdlc/) (November 13) connected the dots between VS Code custom agents, AutoGen, and agentic SDLC. These systems all shared a common architecture: **specialized agents with clear roles, orchestrated by a supervisor**. This wasn't just a technical pattern—it was a mental model for thinking about AI collaboration.

### **Choosing the Right Mode**

["Choosing the Right AI Coding Agent: Remote, CLI, or IDE Mode?"](https://cmwen.com/posts/choosing-the-right-ai-coding-agent/) (November 30) synthesized these insights into a practical guide. When should you use remote coding agents like GitHub Copilot Workspace? When is CLI mode better? When should you stay in your IDE? The answer depended on task complexity, iteration speed, and the need for human oversight.

The agentic SDLC posts were about **redesigning workflows**. They challenged assumptions about how software gets built and forced me to think critically about where AI adds value—and where it doesn't.

---

## Part IV: Beyond Code – Personal Experiments and Side Quests (September–December)

Not all of 2025 was about AI coding. Some of the most rewarding posts came from personal experiments that had nothing to do with software development—or at least, not directly.

### **Self-Hosting and Privacy**

["Continuous E-book Reading Across Devices with KOReader and Syncthing"](https://cmwen.com/posts/koreader-syncthing-ebook-sync/) (September 20) documented my journey to a fully offline, self-hosted e-book sync solution. No cloud dependencies, no tracking—just KOReader and Syncthing working in harmony. This was about **reclaiming control** over my digital life.

Similarly, ["Ship Private Android Apps with GitHub Releases and Obtainium"](https://cmwen.com/posts/ship-private-android-apps-with-github-releases-and-obtainium/) (October 26) showed how to self-sign Android APKs and distribute them via GitHub Releases. The follow-up, ["Automating Android Repo Secrets with Val Town and GitHub Apps"](https://cmwen.com/posts/automating-android-repo-secrets-with-val-town/) (November 8), automated the tedious parts with a Val Town GitHub App. These posts were about **building personal infrastructure**—small, reliable systems that work for you, not against you.

### **Venturing into Video**

["From Code to Camera: My Journey into Video Production"](https://cmwen.com/posts/venturing-into-video-editing) (September 23) captured my first foray into video recording and editing. As a software developer, I approached video with the same mindset I use for code: iterate quickly, learn from mistakes, and build reusable templates. The result? A newfound appreciation for storytelling and a new medium for sharing ideas.

### **AI-Enhanced Learning**

["AI-Enhanced Reading: Generating Custom Book Chapters with LLMs"](https://cmwen.com/posts/ai-enhanced-reading-custom-chapters/) (December 20) revisited the proactive learning theme from May. Instead of just summarizing books, I used LLMs to _extend_ them—generating custom chapters that explored contemporary topics through the lens of classic ideas. For example, I asked an LLM to write a chapter on "Range in the Age of AI" for David Epstein's "Range." The result was a thought-provoking blend of research-based insights and modern context.

This experiment highlighted a broader truth: **LLMs can personalize learning** in ways traditional media cannot. They don't replace authors—they extend their ideas into domains the authors might not have covered.

These personal experiments were about **exploration**. They reminded me that technology is most rewarding when it serves human curiosity, not just productivity.

---

## Part V: Industry Trends and Big Bets (October–November)

While much of 2025 was about hands-on experimentation, I also spent time thinking about broader industry trends. A few posts captured these reflections:

### **Continuous AI and GitHub's Vision**

["Why GitHub is Betting on 'Continuous AI' (And What It Means for You)"](https://cmwen.com/posts/why-github-is-betting-on-continuous-ai/) (November 19) explored GitHub's strategic pivot toward **Continuous AI**—the next evolution after CI/CD. Just as CI/CD automated testing and deployment, Continuous AI aims to automate code review, refactoring, and even feature implementation. This wasn't just a product announcement—it was a signal about the future of software development.

### **The Discovery Problem**

["The Discovery Problem: How Will Agents Find Your WebMCP Tools?"](https://cmwen.com/posts/webmcp-discovery-problem/) (November 21) tackled WebMCP's biggest unsolved challenge: tool discovery. If every organization publishes MCP tools, how will agents find and trust them? This post explored potential solutions—registries, trust networks, and semantic search—but concluded that **no clear winner has emerged yet**. Discovery remains an open problem.

### **Sora 2 vs Suno**

["Sora 2 vs Suno: Why Sora 2 Might — or Might Not — Become Mainstream"](https://cmwen.com/posts/sora-2-vs-suno-why-sora2-might-or-might-not-become-mainstream/) (October 11) compared two AI music generation tools. Beyond the technical differences, the post explored **social mechanics**: network effects, community engagement, and the barriers to mainstream adoption. The best technology doesn't always win—sometimes, the tool with the best community does.

These posts were about **zooming out**. They forced me to think beyond my immediate projects and consider how broader trends might shape the future.

---

## Themes and Lessons: What I Learned in 2025

Looking across these 27 posts, several themes emerge:

### **1. AI Coding Agents Are Real—But Context Matters**

Agents aren't silver bullets. They excel at well-defined tasks with clear constraints (codemods, code reviews, routine implementation). They struggle with open-ended creativity and ambiguous requirements. The key is knowing _when_ to use them.

### **2. Mental Models Matter More Than Tools**

Whether it's understanding tool calling in LangChain or managing premium requests in Copilot Pro, success depends on having the right mental model. Tools change rapidly; mental models endure.

### **3. Personal Forks and Customization Are the Future**

AI agents make it economically viable to fork and customize open source projects for personal use. This shifts power from maintainers to users—but also raises questions about fragmentation and long-term maintenance.

### **4. The Best Workflows Are Hybrid**

Agentic SDLC works best when humans and agents play to their strengths. Agents automate the repetitive; humans provide creativity, judgment, and oversight. Neither works well alone.

### **5. Self-Hosting and Privacy Are Worth the Effort**

From e-book sync to Android app distribution, self-hosted solutions offer control and privacy that cloud services can't match. The setup cost is real, but the long-term benefits are worth it.

### **6. Learning Is Active, Not Passive**

Proactive learning—using LLMs to generate summaries, custom chapters, and targeted questions—beats passive reading. The best way to learn is to engage actively with ideas, not just consume them.

---

## Looking Ahead: 2026 and Beyond

As 2025 closes, I'm optimistic about what's coming. A few predictions and intentions for 2026:

### **Predictions**

- **Agentic SDLC will go mainstream**: More teams will adopt agent-augmented workflows, but the ones that succeed will be those that invest in human-in-the-loop processes.
- **MCP will mature**: Tool discovery, trust models, and standardization will improve, making MCP servers more practical for enterprise use.
- **Personal forks will proliferate**: As agents get better at code customization, we'll see more developers maintaining personal forks of open source projects.
- **Video and multimedia content will blend with code**: Developers will increasingly use video, diagrams, and interactive tutorials alongside traditional documentation.

### **Intentions**

- **Deepen my understanding of multi-agent systems**: I want to explore AutoGen, LangGraph, and other frameworks for orchestrating agent teams.
- **Experiment with AI-generated multimedia**: Can LLMs help with video scripts, diagrams, or even podcast outlines? I want to find out.
- **Build more personal infrastructure**: Self-hosting has been rewarding. I want to expand this to other parts of my digital life.
- **Share more of the process**: My best posts came from documenting experiments as they happened, not after the fact. I want to do more of that in 2026.

---

## Closing Thoughts

2025 was a year of rapid learning, frequent experimentation, and occasional surprises. I wrote 27 blog posts, each one a marker on a journey from skeptical observer to enthusiastic practitioner of AI-assisted development.

But more than that, 2025 taught me to **embrace hybrid workflows**—to work _with_ AI rather than being replaced by it or ignoring it entirely. The best outcomes came when I combined human creativity with agent execution, personal judgment with automated workflows, and strategic thinking with tactical efficiency.

As I look toward 2026, I'm excited about the possibilities. The tools are getting better, the mental models are getting clearer, and the community is getting more sophisticated. We're not at the end of this journey—we're just getting started.

Thank you for following along. Here's to another year of learning, building, and sharing.

---

_If you want to dive deeper into any of these topics, check out the individual posts linked throughout this retrospective. And if you're experimenting with AI coding agents, agentic workflows, or personal infrastructure projects, I'd love to hear about it. Reach out anytime._
