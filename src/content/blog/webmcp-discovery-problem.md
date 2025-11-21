---
title: "The Discovery Problem: How Will Agents Find Your WebMCP Tools?"
description: "WebMCP's biggest unsolved challenge is tool discovery—the future of agent-web interaction depends on solving how AI agents find your website's structured tools without expensive navigation."
author: "Min Wen"
pubDatetime: 2025-11-21T00:00:00.000Z
slug: "webmcp-discovery-problem"
featured: true
tags: ["webmcp", "discovery", "agents", "web-standards", "ai"]
llmKeyIdeas:
  [
    "tool discovery challenge",
    "declarative manifests",
    "PWA service workers",
    "agent SEO future",
    "directory protocols",
  ]
---

You've built the perfect WebMCP implementation. Your e-commerce site exposes elegant tools like `searchProducts(query)`, `addToCart(productId)`, and `checkout()`. An AI agent could complete purchases in milliseconds instead of fumbling through your UI with expensive vision models.

There's just one problem: **How does an agent in San Francisco know your tools exist?**

This is WebMCP's biggest unsolved challenge, and it's explicitly acknowledged in the [official proposal](https://github.com/webmachinelearning/webmcp). While the protocol defines _how_ agents interact with web tools, it doesn't solve _how_ agents discover those tools in the first place. And without discovery, even the most efficient tool interface sits unused.

## Table of Contents

## The Current State: Navigation Required

Today, WebMCP discovery works like this:

1. Agent decides to visit your website (somehow)
2. Browser navigates to your page
3. JavaScript executes and registers tools via `navigator.modelContext.provideContext()`
4. Agent discovers available tools
5. Agent can now invoke tools

The "somehow" in step 1 is the problem. Agents must already know to visit your site before they can discover your tools. It's a chicken-and-egg problem that makes WebMCP discovery fundamentally inefficient compared to backend alternatives.

### Why This Breaks Down

Consider a user asking their agent: _"Find me a red dress under $200 for a summer wedding."_

With backend MCP servers, the agent might:

- Query a directory service: "Which e-commerce sites have clothing search APIs?"
- Get list of relevant MCP servers with capabilities
- Connect directly to servers and invoke `searchProducts()` tools
- Present results without ever opening a browser

With WebMCP, the agent must:

- Navigate to each potential e-commerce site (Nordstrom, Wildebloom, Lulus, etc.)
- Wait for page load and JavaScript execution on each site
- Discover what tools each site offers
- Invoke tools on relevant sites
- Waste tokens and time on irrelevant sites that don't have useful tools

**Every navigation is expensive**: page load time, DOM parsing, JavaScript execution, and most critically, token budget burned on sites that may not even support WebMCP.

The WebMCP proposal candidly states: _"There is no built-in mechanism for client applications to discover which sites provide callable tools without visiting or querying them directly."_

## Solution 1: The Declarative Manifest Approach

The most obvious solution is letting sites declare their tools _before_ agents navigate to them. This is similar to how web apps already advertise their capabilities through Web App Manifests, `robots.txt`, and OpenGraph meta tags.

### How It Could Work

A new field in the Web App Manifest (or a separate `.well-known/webmcp.json` file) could declare available tools:

```json
{
  "name": "Wildebloom Clothing",
  "short_name": "Wildebloom",
  "webmcp_tools": [
    {
      "name": "searchProducts",
      "description": "Search for clothing items by category, color, size, and style attributes",
      "category": "commerce",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "category": {
            "type": "string",
            "enum": ["dresses", "tops", "bottoms"]
          },
          "size": { "type": "number", "minimum": 2, "maximum": 14 }
        }
      }
    },
    {
      "name": "addToCart",
      "description": "Add a product to the shopping cart",
      "category": "commerce",
      "requiresAuth": true
    }
  ]
}
```

Agents could fetch this manifest with a simple HTTP GET request—no JavaScript execution, no page load, just structured metadata. Crawlers could index these manifests, building searchable directories of WebMCP-enabled sites.

### The Limitations

Static manifests solve discovery but create new problems:

**1. State-Dependent Tools**

Many tools should only be available in specific contexts. Consider a design tool that exposes:

- `undo()` - only available if edits have been made
- `exportDesign()` - only available if a design is loaded
- `shareWithUser(userId)` - only available after authentication

Static manifests can't express "this tool exists only when the user has an active editing session." You'd need dynamic manifest updates, which defeats the efficiency purpose.

**2. Privacy Concerns**

Should every site publicly advertise all its capabilities? Consider enterprise tools, personalized features, or capabilities that vary by user subscription tier. A static manifest exposes your entire API surface to competitors and scrapers.

**3. Maintenance Burden**

Developers now maintain tool definitions in two places: the manifest and the actual implementation. These inevitably drift out of sync, leading to agents attempting to invoke tools that don't actually exist or have changed signatures.

### The Hybrid Compromise

The WebMCP proposal suggests a hybrid approach:

> "A future iteration of this feature could introduce declarative tools definitions that are placed in an app manifest so that agents would only need to fetch the manifest with a simple HTTP GET request. Agents will of course still need to navigate to the site to actually use its tools, but a manifest makes it far less costly to discover these tools and reason about their relevance to the user's task."

This preserves efficiency for discovery while requiring navigation for invocation. Agents can pre-filter irrelevant sites, only navigating to those with useful tools.

## Solution 2: Progressive Web Apps + Service Workers

Service workers offer a more sophisticated approach by decoupling tools from visible browser windows.

### The Architecture

When a user installs a PWA, its service worker could register WebMCP tools that persist even after the browser window closes:

```javascript
// In service worker scope
self.addEventListener("activate", () => {
  self.agent.provideContext({
    tools: [
      {
        name: "addToCalendar",
        description: "Add event to user's calendar",
        execute: async ({ title, date, duration }) => {
          // Call backend API, update local storage, etc.
          await fetch("/api/calendar/add", {
            method: "POST",
            body: JSON.stringify({ title, date, duration }),
          });
          return { content: [{ type: "text", text: `Added: ${title}` }] };
        },
      },
    ],
  });
});
```

Now the tool is available system-wide, even when the calendar web app isn't open. An agent can invoke it directly:

```
User: "Add lunch meeting with Sarah tomorrow at noon"
Agent: [discovers calendar.example.com has addToCalendar tool via installed PWA]
Agent: [invokes tool without opening browser window]
Agent: "Done! Added to your calendar."
```

### The User Experience

This model mirrors native app capabilities:

1. User installs PWA (explicit trust signal)
2. PWA registers tools in service worker
3. Tools available to authorized agents system-wide
4. Background execution without UI disruption
5. Security prompts only on first use per agent

Service workers can open windows when needed (e.g., for payment confirmation) while keeping simple operations headless.

### The Discovery Challenge Remains

This solves _persistence_ but not _initial discovery_. How does an agent know `calendar.example.com` has a useful PWA to install in the first place? We're back to needing some form of directory or search mechanism.

## Solution 3: Directories and Search APIs

If websites can't efficiently advertise their tools individually, perhaps centralized (or federated) directories fill the gap.

### The Centralized Model

Similar to browser extension marketplaces or app stores:

**Google WebMCP Registry**

- Developers submit their sites for indexing
- Google crawls for `webmcp.json` manifests or `<meta>` tags
- Agents query: `GET https://webmcp.google.com/api/search?q=e-commerce+clothing+search`
- Returns ranked list of sites with relevant tools

**Pros:**

- Single authoritative source
- Quality control and vetting
- Rich metadata and categorization
- Built on existing infrastructure (Google already crawls the web)

**Cons:**

- Centralization risk (one company controls agent-web interface)
- Pay-to-play concerns (featured listings, promoted tools)
- Slower updates than real-time web changes
- Doesn't match the open web's philosophy

### The Decentralized Model

Alternatively, a distributed protocol similar to RSS or ActivityPub:

**WebMCP Discovery Protocol**

- Sites publish `/.well-known/webmcp.json` endpoints
- Discovery nodes crawl and aggregate (anyone can run one)
- Agents query multiple discovery nodes, deduplicate results
- Sites control their own metadata without gatekeepers

This could work like the Fediverse: federated instances share knowledge while sites retain sovereignty over their data.

### The Search Engine Pivot

Search engines already index website capabilities through structured data (Schema.org, OpenGraph, JSON-LD). They could extend this to WebMCP:

```html
<meta property="webmcp:tool" content="searchProducts" />
<meta property="webmcp:category" content="e-commerce" />
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    "name": "Wildebloom Product Search",
    "description": "Search for sustainable clothing",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "webmcp://wildebloom.example/searchProducts?query={query}"
    }
  }
</script>
```

Search engines already understand structured data. Extending it to describe agent-accessible tools is natural evolution.

## Solution 4: AI-Native Discovery

Perhaps the solution isn't technical but contextual. Modern LLMs are trained on vast web corpuses and could learn which sites offer which capabilities organically.

### How It Works

When training foundation models, include WebMCP tool schemas as part of web content:

- Model learns "Wildebloom has clothing search tools"
- Model learns "Gerrit has code review automation tools"
- Model learns "Figma has design editing tools"

At inference time, agents use this learned knowledge to navigate directly to relevant sites:

```
User: "Find me a dress for a wedding"
Agent reasoning: [I know Wildebloom and Nordstrom have WebMCP clothing search tools]
Agent: [Navigates to Wildebloom]
Agent: [Discovers and invokes searchProducts()]
```

### The Training Challenge

This requires:

1. WebMCP adoption reaches critical mass
2. Training data includes tool schemas (in manifests, documentation, or meta tags)
3. Models are retrained to incorporate this knowledge
4. Knowledge stays current as sites update tools

It also inherits LLM knowledge cutoff issues—agents won't know about newly launched sites or tools added after training.

## What Developers Should Do Today

While the WebMCP community debates discovery mechanisms, developers can position their sites for eventual discoverability:

### 1. Add Semantic Metadata

Even without standardized WebMCP manifests, you can signal capabilities:

```html
<!-- OpenGraph hints -->
<meta property="og:type" content="website.ecommerce" />
<meta property="og:capabilities" content="search,cart,checkout" />

<!-- Schema.org structured data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Wildebloom",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": "https://wildebloom.example/search?q={query}",
        "query-input": "required name=query"
      }
    ]
  }
</script>
```

### 2. Document Your Tools Prominently

Create an `/agents` or `/api-docs` page describing your WebMCP tools in human-readable format. Agents trained on web content will learn from these descriptions:

```markdown
## Agent Integration

Wildebloom supports WebMCP for AI agent access:

**searchProducts(query, category, size, color)**

- Search our catalog with natural language or structured filters
- Returns product listings with images, prices, and availability

**addToCart(productId, quantity)**

- Add items to shopping cart
- Requires user authentication

**checkout()**

- Initiate secure checkout flow
- Opens payment window for user confirmation
```

### 3. Experiment with `.well-known` Endpoints

Even without standardization, you can create your own:

```
https://yoursite.com/.well-known/webmcp.json
```

This follows web conventions and positions you well if a standard emerges using this pattern.

### 4. Join the Conversation

The WebMCP proposal has [31 open issues on GitHub](https://github.com/webmachinelearning/webmcp/issues). Discovery is discussed in multiple threads. Contributing to this discussion helps shape the eventual solution.

## The Future: Agent SEO

Within the next 2-3 years, I predict a new professional category emerges: **Agent SEO Specialist**.

Just as traditional SEO optimizes for search engine crawlers, Agent SEO will optimize for AI agent discovery:

- Crafting tool descriptions that LLMs understand
- Structuring metadata for agent consumption
- Monitoring agent traffic and tool invocation analytics
- A/B testing tool names and descriptions for agent comprehension
- Managing reputation in agent directories

The first movers in this space will gain significant competitive advantages as agents become primary web interfaces for certain tasks.

## Conclusion: The Last Mile Problem

WebMCP has solved the efficiency problem—structured tools beat vision-based UI automation by orders of magnitude. But discovery remains the "last mile" challenge preventing adoption at scale.

The solution will likely be **hybrid**:

- Static manifests for basic tool advertising
- Service workers for persistent, installed-app experiences
- Directory services (centralized or federated) for search
- LLM training incorporating tool knowledge for contextual awareness

None of these solutions are mutually exclusive. The web thrives on layered approaches—think of how websites are discovered today through search engines, social media, direct links, bookmarks, and suggested sites.

WebMCP discovery will evolve similarly: multiple overlapping mechanisms that agents choose based on context, user trust, and efficiency trade-offs.

The race is on. Sites that implement WebMCP tools today will be indexed, learned about, and recommended by tomorrow's agent ecosystems. The question isn't whether to prepare for agent discovery—it's how early you start.

---

## Further Reading

- [WebMCP Official Proposal](https://github.com/webmachinelearning/webmcp) - The specification and explainers
- [Model Context Protocol](https://modelcontextprotocol.io/) - Backend MCP for comparison
- [Web App Manifest Specification](https://www.w3.org/TR/appmanifest/) - Existing capability declaration
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - Background execution context
- [Schema.org Actions](https://schema.org/Action) - Structured data for web capabilities
