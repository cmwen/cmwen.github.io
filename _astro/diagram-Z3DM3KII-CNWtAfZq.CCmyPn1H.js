import{A as e,B as t,D as n,_ as r,a as i,b as a,d as o,g as s,l as c,n as l,o as u,p as d,s as f,y as p}from"./mermaid.core-84uow4rU.CKVLoBOp.js";import{t as m}from"./chunk-JWPE2WC7-vB_Qh7KZ.CJT6ip0R.js";import{i as h}from"./cynefin-OW5HDTMX-B9bwJKt_.Donrz_3J.js";var g=t.packet,_,v=(_=class{constructor(){this.packet=[],this.setAccTitle=a,this.getAccTitle=i,this.setDiagramTitle=l,this.getDiagramTitle=u,this.getAccDescription=s,this.setAccDescription=f}getConfig(){let t=e({...g,...p().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(e){e.length>0&&this.packet.push(e)}clear(){d(),this.packet=[]}},r(_,`PacketDB`),_),y=1e4,b=r((e,t)=>{m(e,t);let n=-1,r=[],i=1,{bitsPerRow:a}=t.getConfig();for(let{start:o,end:s,bits:l,label:u}of e.blocks){if(o!==void 0&&s!==void 0&&s<o)throw Error(`Packet block ${o} - ${s} is invalid. End must be greater than start.`);if(o??=n+1,o!==n+1)throw Error(`Packet block ${o} - ${s??o} is not contiguous. It should start from ${n+1}.`);if(l===0)throw Error(`Packet block ${o} is invalid. Cannot have a zero bit field.`);for(s??=o+(l??1)-1,l??=s-o+1,n=s,c.debug(`Packet block ${o} - ${n} with label ${u}`);r.length<=a+1&&t.getPacket().length<y;){let[e,n]=x({start:o,end:s,bits:l,label:u},i,a);if(r.push(e),e.end+1===i*a&&(t.pushWord(r),r=[],i++),!n)break;({start:o,end:s,bits:l,label:u}=n)}}t.pushWord(r)},`populate`),x=r((e,t,n)=>{if(e.start===void 0)throw Error(`start should have been set during first phase`);if(e.end===void 0)throw Error(`end should have been set during first phase`);if(e.start>e.end)throw Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*n)return[e,void 0];let r=t*n-1,i=t*n;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:i,end:e.end,label:e.label,bits:e.end-i}]},`getNextFittingBlock`),S={parser:{yy:void 0},parse:r(async e=>{let t=await h(`packet`,e),n=S.parser?.yy;if(!(n instanceof v))throw Error(`parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.`);c.debug(t),b(t,n)},`parse`)},C=r((e,t,r,i)=>{let a=i.db,s=a.getConfig(),{rowHeight:c,paddingY:l,bitWidth:u,bitsPerRow:d}=s,f=a.getPacket(),p=a.getDiagramTitle(),m=c+l,h=m*(f.length+1)-(p?0:c),g=u*d+2,_=n(t);_.attr(`viewBox`,`0 0 ${g} ${h}`),o(_,h,g,s.useMaxWidth);for(let[e,t]of f.entries())w(_,t,e,s);_.append(`text`).text(p).attr(`x`,g/2).attr(`y`,h-m/2).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).attr(`class`,`packetTitle`)},`draw`),w=r((e,t,n,{rowHeight:r,paddingX:i,paddingY:a,bitWidth:o,bitsPerRow:s,showBits:c})=>{let l=e.append(`g`),u=n*(r+a)+a;for(let e of t){let t=e.start%s*o+1,n=(e.end-e.start+1)*o-i;if(l.append(`rect`).attr(`x`,t).attr(`y`,u).attr(`width`,n).attr(`height`,r).attr(`class`,`packetBlock`),l.append(`text`).attr(`x`,t+n/2).attr(`y`,u+r/2).attr(`class`,`packetLabel`).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).text(e.label),!c)continue;let a=e.end===e.start,d=u-2;l.append(`text`).attr(`x`,t+(a?n/2:0)).attr(`y`,d).attr(`class`,`packetByte start`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,a?`middle`:`start`).text(e.start),a||l.append(`text`).attr(`x`,t+n).attr(`y`,d).attr(`class`,`packetByte end`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,`end`).text(e.end)}},`drawWord`),T={draw:C},E={byteFontSize:`10px`,startByteColor:`black`,endByteColor:`black`,labelColor:`black`,labelFontSize:`12px`,titleColor:`black`,titleFontSize:`14px`,blockStrokeColor:`black`,blockStrokeWidth:`1`,blockFillColor:`#efefef`},D={parser:S,get db(){return new v},renderer:T,styles:r(({packet:t}={})=>{let n=e(E,t);return`
	.packetByte {
		font-size: ${n.byteFontSize};
	}
	.packetByte.start {
		fill: ${n.startByteColor};
	}
	.packetByte.end {
		fill: ${n.endByteColor};
	}
	.packetLabel {
		fill: ${n.labelColor};
		font-size: ${n.labelFontSize};
	}
	.packetTitle {
		fill: ${n.titleColor};
		font-size: ${n.titleFontSize};
	}
	.packetBlock {
		stroke: ${n.blockStrokeColor};
		stroke-width: ${n.blockStrokeWidth};
		fill: ${n.blockFillColor};
	}
	`},`styles`)};export{D as diagram};