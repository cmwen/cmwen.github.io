import{j as e}from"./jsx-runtime.7faW4zRM.js";import{r as c}from"./index.DhYZZe0J.js";const b=[{id:"openai_chatgpt",name:"OpenAI — ChatGPT",appScheme:"chatgpt://",webUrl:"https://chat.openai.com/",supportsDirectPrompt:!0},{id:"microsoft_copilot",name:"Microsoft Copilot",webUrl:"https://copilot.microsoft.com/",promptParam:"q",supportsDirectPrompt:!0},{id:"google_gemini",name:"Google Gemini",appScheme:"gemini://",webUrl:"https://gemini.google.com/",supportsDirectPrompt:!1},{id:"perplexity",name:"Perplexity",appScheme:"perplexity://",webUrl:"https://www.perplexity.ai/",promptParam:"q",supportsDirectPrompt:!0},{id:"anthropic_claude",name:"Anthropic — Claude",webUrl:"https://claude.ai/",supportsDirectPrompt:!1}],x=[{id:"content_writer",name:"Content Writer",description:"Expert copywriter for blogs, marketing content, and technical documentation. Focuses on clarity, engagement, and SEO optimization.",tags:["content","writing","marketing","copywriting","blog"],promptTemplate:`You are an expert content writer with 10+ years of experience in creating compelling, clear, and engaging content across various formats and industries.

Your expertise includes:
- Blog posts and articles
- Marketing copy and sales content
- Technical documentation
- Social media content
- Email campaigns
- Web copy and landing pages

Please help me with: {{task}}

When writing, consider:
- Target audience and their needs
- SEO best practices
- Clear structure and flow
- Compelling headlines and hooks
- Call-to-action optimization
- Brand voice and tone consistency

Provide specific, actionable content that's ready to use or requires minimal editing.`},{id:"code_reviewer",name:"Code Reviewer",description:"Thorough code analysis focusing on security, performance, best practices, and maintainability. Provides actionable feedback.",tags:["code","review","security","performance","best-practices"],promptTemplate:`You are a senior software engineer and code reviewer with expertise across multiple programming languages and frameworks. You conduct thorough code reviews focusing on:

**Security**: Vulnerabilities, input validation, authentication/authorization
**Performance**: Optimization opportunities, algorithmic efficiency, resource usage
**Best Practices**: Design patterns, coding standards, maintainability
**Architecture**: Code organization, separation of concerns, scalability
**Testing**: Test coverage, testability, edge cases

Please review the following code: {{code}}

Provide:
1. **Critical Issues**: Security vulnerabilities or bugs that must be fixed
2. **Performance Concerns**: Bottlenecks or inefficiencies
3. **Best Practice Violations**: Code quality and maintainability issues
4. **Suggestions**: Specific improvements with code examples
5. **Positive Feedback**: What's done well

Format your review with clear priorities and actionable recommendations.`},{id:"business_analyst",name:"Business Analyst",description:"Strategic business analysis and recommendations for decisions, market research, competitive analysis, and growth opportunities.",tags:["business","strategy","analysis","market-research","consulting"],promptTemplate:`You are a senior business analyst with MBA-level expertise in strategic planning, market analysis, and business optimization. You provide data-driven insights and actionable recommendations.

Your analysis capabilities include:
- Market research and competitive analysis
- Business model evaluation
- Financial analysis and projections
- Risk assessment
- Growth strategy development
- Process optimization
- Stakeholder analysis

Please analyze: {{business_question}}

Structure your analysis with:
1. **Executive Summary**: Key findings and recommendations
2. **Current Situation**: Market position and context
3. **Opportunities**: Growth and improvement areas
4. **Risks**: Potential challenges and mitigation strategies
5. **Recommendations**: Specific, prioritized action items
6. **Success Metrics**: How to measure progress

Provide concrete, actionable insights that can drive business decisions.`},{id:"research_assistant",name:"Research Assistant",description:"Comprehensive research with credible sources, structured analysis, and clear documentation. Perfect for academic or professional research.",tags:["research","analysis","academic","sources","documentation"],promptTemplate:`You are a professional research assistant with expertise in conducting thorough, credible research across multiple domains. You excel at finding reliable sources, synthesizing information, and presenting findings clearly.

Your research capabilities:
- Academic and scientific literature review
- Market and industry research
- Historical and factual analysis
- Data collection and analysis
- Source verification and credibility assessment
- Structured documentation and reporting

Please research: {{research_topic}}

Provide a comprehensive research report including:
1. **Executive Summary**: Key findings and insights
2. **Background**: Context and scope of the topic
3. **Methodology**: How you approached the research
4. **Key Findings**: Main discoveries with supporting evidence
5. **Sources**: Credible references and citations
6. **Implications**: What the findings mean and their applications
7. **Further Research**: Areas that need additional investigation

Focus on credible, recent sources and present information objectively with proper attribution.`},{id:"yuval_noah_harari",name:"Yuval Noah Harari Analyst",description:"Historical and civilizational analysis of technology, society, and future trajectories.",tags:["history","society","future","philosophy","analysis"],promptTemplate:`Adopt the perspective of a historian analyzing long-term civilizational patterns. Draw on comparative history to contextualize present technological changes.

Topic: {{topic}}

Provide:
1) Historical precedents and cycles
2) Transformations of power, institutions, and narratives
3) Ethical risks and governance considerations
4) Scenarios for the next 5, 20, and 100 years
5) Actionable guidance for citizens and policymakers`},{id:"naval_ravikant",name:"Naval Ravikant Thinker",description:"Mental models for wealth, health, happiness, and leverage; concise wisdom and practical principles.",tags:["philosophy","wealth","leverage","decision-making","principles"],promptTemplate:`Respond with aphoristic clarity and practical frameworks. Prioritize leverage (code, media, capital), judgment, accountability, and specific knowledge.

Question: {{question}}

Output:
- First Principles: core truths
- Framework: 3–5 step model
- Leverage: how to scale outcomes
- Pitfalls: common errors
- One-liner maxim`},{id:"adam_grant",name:"Adam Grant Advisor",description:"Organizational psychology: rethinking assumptions, feedback cultures, and evidence-based change.",tags:["org-psych","leadership","teams","feedback","culture"],promptTemplate:`Act as an organizational psychologist who challenges assumptions with curiosity and data.

Situation: {{situation}}

Deliver:
1) Diagnose cognitive biases and cultural dynamics
2) Experiments to test assumptions
3) Feedback mechanisms and psychological safety
4) Practical scripts for conversations
5) Metrics to evaluate change`},{id:"steve_jobs",name:"Steve Jobs Product Sense",description:"Product taste, simplicity, end-to-end experience, and bold focus.",tags:["product","design","focus","simplicity","innovation"],promptTemplate:`Advise with uncompromising product taste and user-centric obsession.

Product/Idea: {{idea}}

Answer with:
- What to ruthlessly cut
- The delightful end-to-end story
- 2 insanely great details
- Marketing narrative in one sentence
- A bold no that clarifies the yes`},{id:"product_manager",name:"Product Manager",description:"Crafts clear problem statements, PRDs, metrics, and stakeholder alignment.",tags:["product","roadmap","metrics","stakeholders","PRD"],promptTemplate:`Create a one-page PRD.

Problem: {{problem}}
Users: {{users}}

Sections:
- Goals & Non-goals
- User stories & acceptance criteria
- Metrics (activation, retention, satisfaction)
- Risks & mitigations
- Release plan & experiment design`},{id:"software_architect",name:"Software Architect",description:"System design choices, trade-offs, scalability, reliability, and cost.",tags:["architecture","scalability","reliability","cost","design"],promptTemplate:`Propose an architecture.

Requirements: {{requirements}}

Include:
- Component diagram (text)
- Data model outline
- Scaling strategy & bottlenecks
- Security & privacy considerations
- Cost estimate & trade-offs
- 3 failure scenarios and graceful degradation`},{id:"devops_engineer",name:"DevOps Engineer",description:"CI/CD, infra-as-code, observability, SRE practices, and runbooks.",tags:["devops","cicd","observability","sre","runbook"],promptTemplate:`Design a pragmatic DevOps plan.

Context: {{context}}

Deliver:
- Pipeline steps with quality gates
- IaC approach and environments
- Monitoring dashboards & alerts
- SLO/SLI targets
- Incident runbook with escalation policy`},{id:"qa_engineer",name:"QA Engineer",description:"Risk-based testing strategy, automation plan, and critical paths.",tags:["qa","testing","automation","risk","quality"],promptTemplate:`Create a testing strategy.

Feature: {{feature}}

Include:
- Risks & priority matrix
- Test plan (unit, integration, e2e)
- Automation scope & tooling
- Data & environment needs
- Exit criteria`},{id:"scrum_master",name:"Scrum Master",description:"Facilitates agile ceremonies, removes impediments, and improves flow.",tags:["agile","scrum","facilitation","flow","teams"],promptTemplate:`Coach the team.

Team context: {{team_context}}

Provide:
- Sprint health check
- Bottlenecks & WIP limits
- Retrospective prompts
- Stakeholder alignment plan
- Improvement experiment (2 weeks)`},{id:"technical_writer",name:"Technical Writer",description:"Clear developer docs, API references, and tutorials with examples.",tags:["docs","api","tutorials","developer-experience","writing"],promptTemplate:`Write developer documentation.

Topic: {{doc_topic}}

Include:
- Overview & prerequisites
- Quickstart with code
- API reference structure
- Examples & common errors
- Style guide consistency checklist`},{id:"nsw_accountant",name:"NSW Sydney Accountant",description:"Australian tax law, GST, small business compliance for NSW Sydney context.",tags:["accounting","australia","gst","tax","nsw"],promptTemplate:`Act as a chartered accountant in NSW, Australia. Provide general, non-fiduciary guidance and reference official ATO resources.

Scenario: {{scenario}}

Cover:
- Entity structure implications (sole trader, company, trust)
- GST registration thresholds and BAS
- Payroll, superannuation, and workers comp
- Deductions, records, and deadlines
- Links to relevant ATO guidance`},{id:"clinical_psychologist",name:"Clinical Psychologist",description:"Evidence-based mental health strategies; not a substitute for professional care.",tags:["psychology","cognitive","behavioral","wellbeing","mental-health"],promptTemplate:`Provide psychoeducation and coping strategies using CBT/ACT principles. Include disclaimers and crisis resources. Not medical advice.

Concern: {{concern}}

Output:
- Psychoeducation summary
- Skills & exercises
- Behavior plan & tracking
- When to seek professional help`},{id:"prompt_engineer",name:"Prompt Engineer",description:"Optimizes prompts, decomposes tasks, and designs tool-augmented reasoning.",tags:["prompting","reasoning","chain-of-thought","tools","meta"],promptTemplate:`Design an optimal prompt and plan.

Task: {{task}}

Return:
1) Problem decomposition (steps)
2) Prompt skeleton (roles, constraints, examples)
3) Tool plan (search, code, calculators)
4) Verification checks & eval cases
5) Short baseline vs improved prompt`},{id:"data_analyst",name:"Data Analyst",description:"Statistical thinking, visualization, and decision-support insights.",tags:["data","stats","visualization","analytics","insights"],promptTemplate:`Analyze the dataset conceptually (no execution). Propose methods, caveats, and visuals.

Question: {{analysis_question}}

Include:
- Hypotheses and metrics
- Exploratory analysis plan
- Statistical tests and assumptions
- Visualization recommendations
- Decision implications`}];function v({providers:t,selectedProvider:s,onProviderChange:i}){return e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{htmlFor:"provider-select",className:"block text-sm font-medium text-skin-base mb-2",children:"Target LLM"}),e.jsx("select",{id:"provider-select",value:s.id,onChange:o=>{const l=t.find(p=>p.id===o.target.value);l&&i(l)},className:"block w-full max-w-xs rounded-md border border-skin-line bg-skin-fill px-3 py-2 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent",children:t.map(o=>e.jsx("option",{value:o.id,children:o.name},o.id))}),e.jsx("p",{className:"mt-1 text-sm text-skin-base opacity-70",children:s.supportsDirectPrompt?"Supports direct prompt injection":"Prompt will be copied to clipboard"})]})}function k({agents:t,onFilteredAgentsChange:s}){const[i,o]=c.useState(""),[l,p]=c.useState(""),h=c.useMemo(()=>{const a=t.flatMap(d=>d.tags);return[...new Set(a)].sort()},[t]);return c.useEffect(()=>{let a=t;if(i){const d=i.toLowerCase();a=a.filter(m=>m.name.toLowerCase().includes(d)||m.description.toLowerCase().includes(d)||m.tags.some(g=>g.toLowerCase().includes(d)))}l&&(a=a.filter(d=>d.tags.includes(l))),s(a)},[i,l,t,s]),e.jsxs("div",{className:"mb-6 space-y-4",children:[e.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{htmlFor:"agent-search",className:"sr-only",children:"Search agents"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{id:"agent-search",type:"text",value:i,onChange:a=>o(a.target.value),placeholder:"Search agents by name, description, or tags...",className:"w-full rounded-md border border-skin-line bg-skin-fill px-4 py-2 pl-10 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"}),e.jsx("svg",{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-skin-base opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"tag-filter",className:"sr-only",children:"Filter by tag"}),e.jsxs("select",{id:"tag-filter",value:l,onChange:a=>p(a.target.value),className:"rounded-md border border-skin-line bg-skin-fill px-3 py-2 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent",children:[e.jsx("option",{value:"",children:"All categories"}),h.map(a=>e.jsx("option",{value:a,children:a},a))]})]})]}),(i||l)&&e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx("span",{className:"text-sm text-skin-base opacity-70",children:"Active filters:"}),i&&e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-full bg-skin-accent px-3 py-1 text-xs text-skin-inverted",children:['Search: "',i,'"',e.jsx("button",{onClick:()=>o(""),className:"hover:bg-opacity-80","aria-label":"Clear search",children:"×"})]}),l&&e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-full bg-skin-accent px-3 py-1 text-xs text-skin-inverted",children:["Tag: ",l,e.jsx("button",{onClick:()=>p(""),className:"hover:bg-opacity-80","aria-label":"Clear tag filter",children:"×"})]})]})]})}function w({agent:t,onClick:s}){return e.jsxs("div",{className:"cursor-pointer rounded-lg border border-skin-line bg-skin-card p-4 transition-colors hover:border-skin-accent hover:bg-skin-card-muted",onClick:()=>s(t),onKeyDown:i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),s(t))},tabIndex:0,role:"button","aria-label":`Open ${t.name} agent details`,children:[e.jsx("h3",{className:"font-semibold text-skin-base",children:t.name}),e.jsx("p",{className:"mt-2 text-sm text-skin-base opacity-80 line-clamp-2",children:t.description}),e.jsxs("div",{className:"mt-3 flex flex-wrap gap-2",children:[t.tags.slice(0,3).map(i=>e.jsx("span",{className:"inline-block rounded bg-skin-accent px-2 py-1 text-xs text-skin-inverted",children:i},i)),t.tags.length>3&&e.jsxs("span",{className:"inline-block rounded border border-skin-line px-2 py-1 text-xs text-skin-base",children:["+",t.tags.length-3," more"]})]})]})}function j({agent:t,provider:s,isOpen:i,onClose:o,onLaunch:l}){const[p,h]=c.useState(""),[a,d]=c.useState({});c.useEffect(()=>{if(t){const n=t.promptTemplate.match(/\{\{(\w+)\}\}/g),r={};n&&n.forEach(u=>{const f=u.slice(2,-2);r[f]=""}),d(r),h(t.promptTemplate)}},[t]);const m=c.useMemo(()=>{let n=p;return Object.entries(a).forEach(([r,u])=>{n=n.replace(new RegExp(`\\{\\{${r}\\}\\}`,"g"),u)}),n},[p,a]),g=async()=>{try{await navigator.clipboard.writeText(m)}catch(n){console.error("Failed to copy to clipboard:",n)}};return!i||!t?null:e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4",children:e.jsxs("div",{className:"max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-skin-fill border border-skin-line",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-skin-line p-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-skin-base",children:t.name}),e.jsx("p",{className:"text-sm text-skin-base opacity-80",children:t.description})]}),e.jsx("button",{onClick:o,className:"rounded p-2 text-skin-base hover:bg-skin-card","aria-label":"Close agent details",children:e.jsx("svg",{className:"h-6 w-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"mb-4",children:e.jsx("div",{className:"flex flex-wrap gap-2",children:t.tags.map(n=>e.jsx("span",{className:"inline-block rounded bg-skin-accent px-2 py-1 text-xs text-skin-inverted",children:n},n))})}),Object.keys(a).length>0&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"mb-2 text-sm font-medium text-skin-base",children:"Variables"}),e.jsx("div",{className:"space-y-2",children:Object.entries(a).map(([n,r])=>e.jsxs("div",{children:[e.jsx("label",{htmlFor:`var-${n}`,className:"block text-sm text-skin-base",children:n}),e.jsx("input",{id:`var-${n}`,type:"text",value:r,onChange:u=>d(f=>({...f,[n]:u.target.value})),className:"mt-1 block w-full rounded border border-skin-line bg-skin-fill px-3 py-2 text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent",placeholder:`Enter ${n}...`})]},n))})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"mb-2 text-sm font-medium text-skin-base",children:"Prompt Template"}),e.jsx("textarea",{value:p,onChange:n=>h(n.target.value),className:"h-40 w-full rounded border border-skin-line bg-skin-fill p-3 text-sm text-skin-base focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent",placeholder:"Edit your prompt here..."})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"mb-2 text-sm font-medium text-skin-base",children:"Final Prompt"}),e.jsx("div",{className:"max-h-32 overflow-y-auto rounded border border-skin-line bg-skin-card p-3 text-sm text-skin-base",children:e.jsx("pre",{className:"whitespace-pre-wrap",children:m})})]}),e.jsxs("div",{className:"flex flex-col gap-3 sm:flex-row",children:[e.jsx("button",{onClick:()=>l(m),className:"rounded bg-skin-accent px-4 py-2 text-skin-inverted hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-skin-accent focus:ring-offset-2",children:s.supportsDirectPrompt?`Open in ${s.name}`:`Open ${s.name} & Copy Prompt`}),e.jsx("button",{onClick:g,className:"rounded border border-skin-line px-4 py-2 text-skin-base hover:bg-skin-card focus:outline-none focus:ring-2 focus:ring-skin-accent focus:ring-offset-2",children:"Copy Prompt"})]}),e.jsxs("div",{className:"mt-4 text-xs text-skin-base opacity-60",children:["Target: ",s.name,s.supportsDirectPrompt?" (supports direct prompt injection)":" (prompt will be copied to clipboard)"]})]})]})})}const y="agents.selectedProvider";function S(t){if(typeof window>"u")return t[0];try{const s=localStorage.getItem(y);if(s){const i=JSON.parse(s),o=t.find(l=>l.id===i);if(o)return o}}catch(s){console.error("Error reading provider from localStorage:",s)}return t[0]}function P(t){if(!(typeof window>"u"))try{localStorage.setItem(y,JSON.stringify(t.id))}catch(s){console.error("Error saving provider to localStorage:",s)}}function N(t,s){if(!t.supportsDirectPrompt)return t.webUrl;const i=encodeURIComponent(s);switch(t.id){case"openai_chatgpt":return`${t.webUrl.endsWith("/")?t.webUrl:t.webUrl+"/"}?model=gpt-4&prompt=${i}`;case"microsoft_copilot":return`${t.webUrl}?q=${i}`;case"perplexity":return`${t.webUrl}search?q=${i}`;default:return t.webUrl}}async function C(t,s){const i=N(t,s);if(t.supportsDirectPrompt)window.open(i,"_blank","noopener,noreferrer");else try{await navigator.clipboard.writeText(s),window.open(t.webUrl,"_blank","noopener,noreferrer"),console.log("Prompt copied to clipboard")}catch(o){console.error("Failed to copy prompt to clipboard:",o),window.open(t.webUrl,"_blank","noopener,noreferrer")}}function _(){const[t,s]=c.useState(b[0]),[i,o]=c.useState(x),[l,p]=c.useState(null),[h,a]=c.useState(!1);c.useEffect(()=>{const r=S(b);r&&r.id!==t.id&&s(r)},[]);const d=c.useCallback(r=>{s(r),P(r)},[]),m=c.useCallback(r=>{p(r),a(!0)},[]),g=c.useCallback(()=>{a(!1),p(null)},[]),n=c.useCallback(async r=>{try{await C(t,r),a(!1)}catch(u){console.error("Failed to launch provider:",u)}},[t]);return e.jsxs("div",{className:"mx-auto max-w-4xl",children:[e.jsx(v,{providers:b,selectedProvider:t,onProviderChange:d}),e.jsx(k,{agents:x,onFilteredAgentsChange:o}),e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:i.map(r=>e.jsx(w,{agent:r,onClick:m},r.id))}),i.length===0&&e.jsxs("div",{className:"py-12 text-center",children:[e.jsx("svg",{className:"mx-auto h-12 w-12 text-skin-base opacity-50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsx("h3",{className:"mt-4 text-lg font-medium text-skin-base",children:"No agents found"}),e.jsx("p",{className:"mt-2 text-skin-base opacity-70",children:"Try adjusting your search or filter criteria."})]}),e.jsx(j,{agent:l,provider:t,isOpen:h,onClose:g,onLaunch:n})]})}export{_ as default};
