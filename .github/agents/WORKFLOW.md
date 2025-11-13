# Agentic Blog Generation Workflow

This document visualizes the custom agents workflow for blog post generation.

## Workflow Diagram

```mermaid
graph TD
    Start([Start: Topic Idea]) --> R[Researcher Agent]

    R -->|Gathers information<br/>Cites sources<br/>Structures findings| R_Output[Research Report]

    R_Output -->|Handoff: Generate Ideas| I[Ideas Generator Agent]

    I -->|Creates 3-5 concepts<br/>Detailed outlines<br/>Suggests tags| I_Output[Blog Ideas + Outlines]

    I_Output -->|Handoff: Write Blog Post| W[Blog Writer Agent]

    W -->|Writes full post<br/>Proper frontmatter<br/>Markdown format| W_Output[Draft Blog Post]

    W_Output -->|Handoff: Fact Check<br/>Optional| F[Fact Checker Agent]

    F -->|Verifies claims<br/>Tests code<br/>Validates links| F_Output{Issues Found?}

    F_Output -->|Yes: Corrections needed| W
    F_Output -->|No: All verified| T[Translator Agent]

    W_Output -->|Handoff: Translate<br/>Optional| T

    T -->|Translates to zh-hant<br/>Maintains structure<br/>Preserves code| T_Output[Chinese Version]

    T_Output -->|Handoff: Generate Podcast| P[Podcast Generation]
    W_Output -->|Direct: Generate Podcast| P

    P -->|Kokoro TTS<br/>MP3 output<br/>RSS feeds| End([Published: EN + ZH + Audio])

    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style R fill:#e3f2fd
    style I fill:#f3e5f5
    style W fill:#fff3e0
    style F fill:#fce4ec
    style T fill:#e0f2f1
    style P fill:#f1f8e9

    style R_Output fill:#bbdefb
    style I_Output fill:#e1bee7
    style W_Output fill:#ffe0b2
    style F_Output fill:#f8bbd0
    style T_Output fill:#b2dfdb
```

## Agent Roles

| Agent               | Primary Role          | Key Outputs                        | Tools Used                |
| ------------------- | --------------------- | ---------------------------------- | ------------------------- |
| **Researcher**      | Information gathering | Research reports, source citations | fetch, githubRepo, search |
| **Ideas Generator** | Ideation & outlining  | Blog concepts, detailed outlines   | search                    |
| **Blog Writer**     | Content creation      | Complete blog posts, frontmatter   | edit, search, runCommands |
| **Fact Checker**    | Quality assurance     | Accuracy reports, corrections      | fetch, githubRepo, search |
| **Translator**      | Localization          | Chinese versions                   | edit, search, problems    |

## Handoff Flow

```mermaid
stateDiagram-v2
    [*] --> Researcher
    Researcher --> IdeasGenerator: Generate Ideas
    IdeasGenerator --> BlogWriter: Write Blog Post
    BlogWriter --> FactChecker: Fact Check (optional)
    BlogWriter --> Translator: Translate (optional)
    FactChecker --> BlogWriter: Fix Issues
    FactChecker --> Translator: Content Verified
    Translator --> BlogWriter: Generate Podcast
    BlogWriter --> [*]: Publish
```

## Workflow Variations

### 1. Full Pipeline (Recommended for Technical Posts)

```
Research → Ideas → Write → Fact Check → Translate → Podcast → Publish
```

**Use when**:

- New technical topics
- Code-heavy content
- Need bilingual support
- High accuracy required

### 2. Quick Write (For Opinion/Analysis)

```
Ideas → Write → Translate → Podcast → Publish
```

**Use when**:

- Topic already familiar
- Opinion pieces
- Less technical content
- Faster turnaround needed

### 3. Research-First (For Complex Topics)

```
Research → Research → Research → Ideas → Write → Fact Check → Publish
```

**Use when**:

- Unfamiliar territory
- Need deep understanding
- Multiple aspects to explore
- Building knowledge base

### 4. English-Only (Fast Track)

```
Ideas → Write → Podcast → Publish
```

**Use when**:

- Time-sensitive content
- English-only audience
- Simple updates
- News/announcements

## Decision Points

```mermaid
graph TD
    A[Blog Post Idea] --> B{Research Needed?}
    B -->|Yes| C[Use Researcher]
    B -->|No| D[Use Ideas Generator]

    C --> D
    D --> E[Use Blog Writer]

    E --> F{Technical Content?}
    F -->|Yes| G[Use Fact Checker]
    F -->|No| H{Chinese Version?}

    G --> I{Issues Found?}
    I -->|Yes| E
    I -->|No| H

    H -->|Yes| J[Use Translator]
    H -->|No| K[Generate Podcast]

    J --> K
    K --> L[Publish]

    style A fill:#e1f5e1
    style L fill:#e1f5e1
```

## Time Estimates

| Workflow Stage            | Estimated Time | Can Be Automated     |
| ------------------------- | -------------- | -------------------- |
| Research                  | 10-20 min      | ✅ Yes (agent)       |
| Idea Generation           | 5-10 min       | ✅ Yes (agent)       |
| Writing                   | 15-30 min      | ✅ Yes (agent)       |
| Fact Checking             | 10-15 min      | ✅ Yes (agent)       |
| Translation               | 10-15 min      | ✅ Yes (agent)       |
| Podcast Generation        | 2-5 min        | ✅ Yes (automated)   |
| **Total (Full Pipeline)** | **52-95 min**  | **Mostly automated** |

_Note: Times vary based on topic complexity and content length_

## Best Practices by Workflow Type

### For Technical Tutorials

✅ Always use: Researcher → Fact Checker
✅ Include: Code examples, version numbers
✅ Verify: All commands and APIs
✅ Translate: Include if Chinese audience

### For Opinion/Analysis Posts

✅ Optional: Researcher (for supporting data)
✅ Always: Fact Checker (verify claims)
✅ Focus: Clear arguments, personal voice
✅ Translate: Great for thought leadership

### For News/Updates

✅ Speed: Skip research if timely
✅ Accuracy: Still fact-check claims
✅ Length: Can be shorter (500+ words)
✅ Podcast: Quick updates work well

### For Deep Dives

✅ Research: Multiple rounds recommended
✅ Structure: Use detailed outlines
✅ Length: 1500+ words acceptable
✅ Quality: Full fact-checking essential

## Error Recovery

If something goes wrong at any stage:

1. **Research Issues**: Re-run with more specific prompts
2. **Writing Problems**: Provide more outline detail
3. **Fact-Check Failures**: Return to writer with corrections
4. **Translation Errors**: Check YAML syntax, verify frontmatter
5. **Podcast Generation**: Run `uv sync`, check models

## Monitoring Progress

Use handoff buttons to:

- ✅ Review output before proceeding
- ✅ Make manual adjustments if needed
- ✅ Choose alternative paths
- ✅ Maintain control over quality

## Next Steps

Ready to start? See [`README.md`](./README.md) for:

- Detailed agent descriptions
- Setup instructions
- Sample prompts
- Customization tips

---

**Pro Tip**: Start with the full pipeline for your first post to understand how each agent works, then optimize for your specific needs! 🚀
