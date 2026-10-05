import{A as e,B as t,D as n,L as r,_ as i,a,a4 as o,a7 as s,b as c,b3 as l,c as u,d,g as f,l as p,n as m,o as h,p as g,s as _}from"./mermaid.core-84uow4rU.CKVLoBOp.js";import{t as v}from"./chunk-JWPE2WC7-vB_Qh7KZ.CJT6ip0R.js";import{i as y}from"./cynefin-OW5HDTMX-B9bwJKt_.Donrz_3J.js";import{t as b}from"./ordinal-B6-f3MAq.B-Z4RLug.js";import{t as x}from"./arc-BW-x8K9H.P01fFSLE.js";function S(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}function C(e){return e}function w(){var e=C,t=S,n=null,r=o(0),i=o(s),a=o(0);function c(o){var c,u=(o=l(o)).length,d,f,p=0,m=Array(u),h=Array(u),g=+r.apply(this,arguments),_=Math.min(s,Math.max(-s,i.apply(this,arguments)-g)),v,y=Math.min(Math.abs(_)/u,a.apply(this,arguments)),b=y*(_<0?-1:1),x;for(c=0;c<u;++c)(x=h[m[c]=c]=+e(o[c],c,o))>0&&(p+=x);for(t==null?n!=null&&m.sort(function(e,t){return n(o[e],o[t])}):m.sort(function(e,n){return t(h[e],h[n])}),c=0,f=p?(_-u*b)/p:0;c<u;++c,g=v)d=m[c],x=h[d],v=g+(x>0?x*f:0)+b,h[d]={data:o[d],index:c,value:x,startAngle:g,endAngle:v,padAngle:y};return h}return c.value=function(t){return arguments.length?(e=typeof t==`function`?t:o(+t),c):e},c.sortValues=function(e){return arguments.length?(t=e,n=null,c):t},c.sort=function(e){return arguments.length?(n=e,t=null,c):n},c.startAngle=function(e){return arguments.length?(r=typeof e==`function`?e:o(+e),c):r},c.endAngle=function(e){return arguments.length?(i=typeof e==`function`?e:o(+e),c):i},c.padAngle=function(e){return arguments.length?(a=typeof e==`function`?e:o(+e),c):a},c}var T=t.pie,E={sections:new Map,showData:!1},D=E.sections,O=E.showData,k=structuredClone(T),A={getConfig:i(()=>structuredClone(k),`getConfig`),clear:i(()=>{D=new Map,O=E.showData,g()},`clear`),setDiagramTitle:m,getDiagramTitle:h,setAccTitle:c,getAccTitle:a,setAccDescription:_,getAccDescription:f,addSection:i(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);D.has(e)||(D.set(e,t),p.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:i(()=>D,`getSections`),setShowData:i(e=>{O=e},`setShowData`),getShowData:i(()=>O,`getShowData`)},j=i((e,t)=>{v(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),M={parse:i(async e=>{let t=await y(`pie`,e);p.debug(t),j(t,A)},`parse`)},N=i(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),P=i(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return w().value(e=>e.value).sort(null)(n)},`createPieArcs`),F={parser:M,db:A,renderer:{draw:i((t,i,a,o)=>{p.debug(`rendering pie chart
`+t);let s=o.db,c=u(),l=e(s.getConfig(),c.pie),f=n(i),m=f.append(`g`);m.attr(`transform`,`translate(225,225)`);let{themeVariables:h}=c,[g]=r(h.pieOuterStrokeWidth);g??=2;let _=l.legendPosition,v=l.textPosition,y=l.donutHole>0&&l.donutHole<=.9?l.donutHole:0,S=x().innerRadius(y*185).outerRadius(185),C=x().innerRadius(185*v).outerRadius(185*v),w=m.append(`g`);w.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+g/2).attr(`class`,`pieOuterCircle`);let T=s.getSections(),E=P(T),D=[h.pie1,h.pie2,h.pie3,h.pie4,h.pie5,h.pie6,h.pie7,h.pie8,h.pie9,h.pie10,h.pie11,h.pie12],O=0;T.forEach(e=>{O+=e});let k=E.filter(e=>(e.data.value/O*100).toFixed(0)!==`0`),A=b(D).domain([...T.keys()]);w.selectAll(`mySlices`).data(k).enter().append(`path`).attr(`d`,S).attr(`fill`,e=>A(e.data.label)).attr(`class`,e=>{let t=`pieCircle`;return l.highlightSlice===`hover`?t+=` highlightedOnHover`:l.highlightSlice===e.data.label&&(t+=` highlighted`),t}),w.selectAll(`mySlices`).data(k).enter().append(`text`).text(e=>(e.data.value/O*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+C.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let j=m.append(`text`).text(s.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),M=[...T.entries()].map(([e,t])=>({label:e,value:t})),N=m.selectAll(`.legend`).data(M).enter().append(`g`).attr(`class`,`legend`);N.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>A(e.label)).style(`stroke`,e=>A(e.label)),N.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>s.getShowData()?`${e.label} [${e.value}]`:e.label);let F=Math.max(...N.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),I=450,L=490,R=M.length*22;switch(_){case`center`:N.attr(`transform`,(e,t)=>{let n=22*M.length/2,r=-F/2-22,i=t*22-n;return`translate(`+r+`,`+i+`)`});break;case`top`:I+=R,N.attr(`transform`,(e,t)=>`translate(${-F/2-22}, ${t*22-185})`),w.attr(`transform`,()=>`translate(0, ${R+22})`);break;case`bottom`:I+=R,N.attr(`transform`,(e,t)=>{let n=-F/2-22,r=t*22- -207;return`translate(`+n+`,`+r+`)`});break;case`left`:L+=22+F,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(-207,`+(t*22-n)+`)`}),w.attr(`transform`,()=>`translate(${F+18+4}, 0)`);break;default:L+=22+F,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(216,`+(t*22-n)+`)`});break}let z=j.node()?.getBoundingClientRect().width??0,B=450/2-z/2,V=450/2+z/2,H=Math.min(0,B),U=Math.max(L,V)-H;f.attr(`viewBox`,`${H} 0 ${U} ${I}`),d(f,I,U,l.useMaxWidth)},`draw`)},styles:N};export{F as diagram};