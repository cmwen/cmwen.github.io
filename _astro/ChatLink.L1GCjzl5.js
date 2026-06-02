import{j as e}from"./jsx-runtime.u17CrQMm.js";import{a as l}from"./index.UEuQJ2Tp.js";import{p as m,g as x,s as f,v,l as b}from"./agents.CyDlSpnZ.js";function N({title:r,url:c,keyIdeas:h,lang:t="en"}){const[a,o]=l.useState(m[0]);l.useEffect(()=>{const s=x(m);s&&o(s)},[]);const d=l.useCallback(s=>{const n=m.find(u=>u.id===s.target.value);n&&(o(n),f(n))},[]),i=l.useMemo(()=>j({title:r,url:c,keyIdeas:h,lang:t}),[r,c,h,t]),p=l.useCallback(async()=>{const{isValid:s,warning:n}=v(i);!s&&n&&console.warn(n),await b(a,i)},[i,a]);return e.jsx("div",{className:"mb-4 rounded-lg border border-skin-line bg-skin-card p-4",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("span",{"aria-hidden":!0,className:"text-2xl",children:"💬"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"m-0 text-base font-semibold text-skin-accent",children:t==="zh-hant"?"就這篇文章發問":"Ask this article a question"}),e.jsx("p",{className:"mt-1 text-sm opacity-80",children:t==="zh-hant"?"選擇你喜歡的聊天模型，帶著重點與連結開始對話。":"Pick your favorite chat LLM and start a conversation with key ideas and the link."}),e.jsxs("div",{className:"mt-3 flex flex-col gap-2",children:[e.jsx("label",{htmlFor:"chat-provider",className:"text-sm opacity-80",children:t==="zh-hant"?"目標 LLM":"Target LLM"}),e.jsx("select",{id:"chat-provider",className:"w-full rounded-md border border-skin-line bg-skin-fill px-3 py-2 text-sm focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent",value:a.id,onChange:d,children:m.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))}),e.jsxs("button",{onClick:p,className:"inline-flex w-full items-center justify-center gap-2 rounded-md bg-skin-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90",children:[e.jsx("span",{children:"🚀"}),e.jsx("span",{children:t==="zh-hant"?"開始對話":"Start chatting"})]})]}),e.jsxs("details",{className:"mt-3 select-text",children:[e.jsx("summary",{className:"cursor-pointer text-sm opacity-70",children:t==="zh-hant"?"查看將發送的提示":"Preview the prompt"}),e.jsx("pre",{className:"mt-2 whitespace-pre-wrap rounded-md border border-skin-line bg-skin-fill p-3 text-xs opacity-90",children:i})]})]})]})})}function j({title:r,url:c,keyIdeas:h,lang:t}){const a=h.filter(Boolean).map(d=>d.trim()).filter(Boolean),o=a.length?a.map((d,i)=>`${i+1}. ${d}`).join(`
`):t==="zh-hant"?"(尚未提供重點)":"(No key ideas provided)";return t==="zh-hant"?`以下是文章資訊與重點，請根據這些內容回答我的提問，並在需要時引用來源：

標題：${r}
連結：${c}
重點：
${o}

請先給出簡潔摘要（3~5 句），再就我的問題進行具體與可採取行動的回覆。`:`Here are the article details and key ideas. Use them to answer my question and cite the source when useful.

Title: ${r}
URL: ${c}
Key ideas:
${o}

Start with a concise 3–5 sentence summary, then provide specific, actionable answers to my query.`}export{N as default};
