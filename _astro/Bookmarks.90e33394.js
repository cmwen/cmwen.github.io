import{g as c,s as g,i as o,t as i,a as u,c as m,b as d}from"./web.27c45a36.js";const x=i('<div class="border rounded p-3 max-w-xs h-24 hover:animate-pulse"><a class="text-sky-300 text-lg block"></a><span class="text-xs"></span></div>'),$=({name:a,url:n,description:e})=>(()=>{const t=c(x),l=t.firstChild,s=l.nextSibling;return g(l,"href",n),o(l,a),o(s,e),t})(),_=i('<div class="m-2"><label class="m-3"></label><select class="rounded-md text-sky-400 p-1"></select></div>'),f=i("<option></option>"),h=({label:a,options:n,onChange:e})=>(()=>{const t=c(_),l=t.firstChild,s=l.nextSibling;return o(l,a),u(s,"change",e),o(s,()=>n.map(r=>(()=>{const p=c(f);return p.value=r,o(p,r),p})())),t})(),v=i('<div class="flex flex-wrap flex-row space-x-4"></div>'),b=a=>{const n=new Set;return a.map(e=>e.tags).forEach(e=>{e.forEach(t=>n.add(t))}),[...n.values()]},k=({bookmarks:a})=>{const n=b(a),[e,t]=m("");return console.log(e()),[d(h,{label:"Tags",get options(){return["",...n]},onChange:s=>{t(s.target.value)}}),(()=>{const s=c(v);return o(s,()=>a.filter(r=>e()===""||r.tags.includes(e())).map(r=>d($,r))),s})()]};export{k as Bookmarks,k as default};