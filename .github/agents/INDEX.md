# Custom Agents Documentation Index

Complete documentation for the blog generation agentic system.

## 📚 Documentation Files

| File                                           | Purpose                                     | Read When                      |
| ---------------------------------------------- | ------------------------------------------- | ------------------------------ |
| **[README.md](./README.md)**                   | Complete overview and getting started guide | First time using the system    |
| **[WORKFLOW.md](./WORKFLOW.md)**               | Visual workflows and decision trees         | Planning your content workflow |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Commands, prompts, and troubleshooting      | During active use              |
| **[INDEX.md](./INDEX.md)**                     | This file - navigation hub                  | Finding specific documentation |

## 🤖 Agent Files

| Agent                | File                                                     | Purpose                            |
| -------------------- | -------------------------------------------------------- | ---------------------------------- |
| **Researcher**       | [researcher.agent.md](./researcher.agent.md)             | Research and information gathering |
| **Ideas Generator**  | [ideas.agent.md](./ideas.agent.md)                       | Ideation and outline creation      |
| **Blog Writer**      | [blog-writer.agent.md](./blog-writer.agent.md)           | Content creation                   |
| **Fact Checker**     | [fact-checker.agent.md](./fact-checker.agent.md)         | Accuracy verification              |
| **Translator**       | [translator.agent.md](./translator.agent.md)             | Translation to Traditional Chinese |
| **GitHub Publisher** | [github-publisher.agent.md](./github-publisher.agent.md) | CI/CD deployment and monitoring    |

## 🎯 Quick Navigation

### Getting Started

1. Read: [README.md](./README.md) - Overview & Setup
2. Try: `@Researcher research [topic]` in VS Code Chat
3. Follow: Handoff buttons through the pipeline
4. Reference: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) as needed

### Understanding Workflows

1. Visual Guide: [WORKFLOW.md](./WORKFLOW.md) - See diagrams and flows
2. Choose Your Path: Full pipeline vs. quick write vs. research-only
3. Time Estimates: Plan based on workflow type

### Daily Usage

- **Commands**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-terminal-commands)
- **Prompts**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-sample-prompts)
- **Troubleshooting**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#%EF%B8%8F-common-issues)

### Customization

- **Modify Agents**: Edit `.agent.md` files
- **Create New Agents**: Follow structure in [README.md](./README.md#-customization-tips)
- **Change Workflows**: Update handoffs in agent frontmatter

## 📖 By Task

### Writing Your First Post

```
1. Read: README.md (Overview + Getting Started)
2. Read: WORKFLOW.md (Full Pipeline section)
3. Try: @Researcher → follow handoffs
4. Reference: QUICK_REFERENCE.md (if stuck)
```

### Troubleshooting Issues

```
1. Check: QUICK_REFERENCE.md (Common Issues)
2. Verify: Agent files exist in .github/agents/
3. Try: Reload VS Code window
4. Review: Terminal output for errors
```

### Understanding Agent Design

```
1. Read: README.md (Agent Descriptions)
2. Review: Individual .agent.md files
3. Study: Handoff configurations
4. Explore: Available tools
```

### Optimizing Workflows

```
1. Read: WORKFLOW.md (Workflow Variations)
2. Study: Decision Points diagram
3. Experiment: Different paths
4. Measure: Time vs. quality tradeoffs
```

## 🔍 Documentation Structure

```
.github/agents/
│
├── INDEX.md (this file)
│   └─→ Navigation hub for all docs
│
├── README.md
│   ├─→ Project overview
│   ├─→ Agent descriptions
│   ├─→ Setup instructions
│   ├─→ Best practices
│   └─→ Customization guide
│
├── WORKFLOW.md
│   ├─→ Visual diagrams (Mermaid)
│   ├─→ Workflow variations
│   ├─→ Decision trees
│   ├─→ Time estimates
│   └─→ Best practices by type
│
├── QUICK_REFERENCE.md
│   ├─→ Command reference
│   ├─→ Sample prompts
│   ├─→ Frontmatter templates
│   ├─→ Common issues
│   └─→ Troubleshooting
│
└── *.agent.md (6 agents)
    ├─→ researcher.agent.md
    ├─→ ideas.agent.md
    ├─→ blog-writer.agent.md
    ├─→ fact-checker.agent.md
    ├─→ translator.agent.md
    └─→ github-publisher.agent.md
```

## 📋 Common Questions

### "Where do I start?"

→ [README.md](./README.md#-getting-started)

### "How does the workflow work?"

→ [WORKFLOW.md](./WORKFLOW.md#workflow-diagram)

### "What command do I use?"

→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-agent-quick-reference)

### "My agent isn't working"

→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#%EF%B8%8F-common-issues)

### "How do I customize agents?"

→ [README.md](./README.md#-customization-tips)

### "What's the fastest workflow?"

→ [WORKFLOW.md](./WORKFLOW.md#4-english-only-fast-track)

### "How long does each step take?"

→ [WORKFLOW.md](./WORKFLOW.md#time-estimates)

### "Can I skip fact-checking?"

→ Yes, but not recommended for technical posts. See [WORKFLOW.md](./WORKFLOW.md#decision-points)

### "How do I create Chinese posts?"

→ Use Translator agent, see [translator.agent.md](./translator.agent.md)

### "Where are the podcasts saved?"

→ In the separate [`cmwen/podcasts`](https://github.com/cmwen/podcasts)
repository under `public/`.

## 🎓 Learning Paths

### Path 1: Quick Start (30 min)

1. Skim [README.md](./README.md)
2. Try one research → ideas cycle
3. Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Path 2: Full Understanding (2 hours)

1. Read [README.md](./README.md) completely
2. Study [WORKFLOW.md](./WORKFLOW.md) diagrams
3. Create one post using full pipeline
4. Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Path 3: Power User (1 week)

1. Day 1: Read all docs
2. Day 2-3: Try each workflow type
3. Day 4-5: Customize agents
4. Day 6-7: Create your own agents

## 🚀 Key Concepts

| Concept           | Learn In             | Deep Dive In               |
| ----------------- | -------------------- | -------------------------- |
| **Custom Agents** | README.md            | Individual .agent.md files |
| **Handoffs**      | README.md            | WORKFLOW.md                |
| **Tools**         | README.md            | VS Code docs               |
| **Workflows**     | WORKFLOW.md          | Your experiments           |
| **Frontmatter**   | blog-writer.agent.md | QUICK_REFERENCE.md         |
| **Translation**   | translator.agent.md  | QUICK_REFERENCE.md         |
| **Podcasts**      | External repository  | `cmwen/podcasts`           |

## 🔗 External Resources

- **VS Code Custom Agents**: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- **AstroPaper Blog Docs**: `/AGENTS.MD` in repo root
- **Podcast System**: https://github.com/cmwen/podcasts
- **GitHub Copilot**: https://github.com/features/copilot

## 📊 File Sizes Reference

```
README.md          ~10KB   (Complete guide)
WORKFLOW.md        ~6KB    (Visual workflows)
QUICK_REFERENCE.md ~8KB    (Commands & tips)
researcher.agent    ~3KB    (Research agent)
ideas.agent         ~4KB    (Ideas agent)
blog-writer.agent   ~6KB    (Writer agent)
fact-checker.agent  ~6KB    (Fact checker)
translator.agent    ~7KB    (Translator)
```

## ✅ Documentation Checklist

Use this to track your learning:

- [ ] Read README.md overview
- [ ] Understand agent roles
- [ ] Try Researcher agent
- [ ] Follow a handoff
- [ ] Review WORKFLOW.md diagrams
- [ ] Write first post
- [ ] Use fact checker
- [ ] Translate a post
- [ ] Publish optional audio in `cmwen/podcasts`
- [ ] Read QUICK_REFERENCE.md
- [ ] Customize an agent
- [ ] Create your own workflow

## 🎯 Next Steps

**New User?** → Start with [README.md](./README.md)

**Ready to Write?** → Jump to [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Want Visuals?** → Check [WORKFLOW.md](./WORKFLOW.md)

**Need Help?** → Search [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#%EF%B8%8F-common-issues)

---

**Remember**: The agents are here to help you create better content faster. Start simple, experiment, and iterate! 🚀

_Last Updated: November 13, 2025_
