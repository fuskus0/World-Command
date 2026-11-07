"use strict";
/* ---------- colores / render ---------- */
const cv=$('cv'),cx=cv.getContext('2d'),off=document.createElement('canvas');off.width=W;off.height=H;const ox=off.getContext('2d'),img=ox.createImageData(W,H);
const own=p=>snapV?snapV.o[p.id]:p.o,mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t|0,a[1]+(b[1]-a[1])*t|0,a[2]+(b[2]-a[2])*t|0],heat=(t,c)=>mix([40,50,40],c,cl(t,0,1));
function colP(p){if(!p.l)return[14,26,24];const o=own(p),c=o!=null?S.C[o]:null,base=c?c.col:[91,86,64];
 switch(layer){case'pol':{const f=fades[p.id];return f&&!snapV?mix(f.f,base,f.t):base}
 case'prov':return mix(base,[(p.id*37)%90+80,150,100],.18);
 case'pob':return heat(p.pop/180000,[170,200,90]);case'eco':return heat(p.eco/80,[220,180,60]);case'est':return mix([160,40,30],[70,170,80],p.st/100);
 case'cul':return CULC[p.cu];case'rel':return RELC[p.re];case'ter':return TERC[p.t];
 case'ide':return c?GC[c.gov]:base;case'org':{const t=S.tr.find(x=>x.id===orgSel);if(t&&c&&t.on&&t.ms.includes(c.id))return hsl((t.id*67)%360,60,50);return c?[60,66,56]:base}
 case'ali':{if(!c)return base;if(sel.c===c.id)return[240,210,80];if(sel.c!=null&&S.C[sel.c]&&S.C[sel.c].alive)return mix([170,50,40],[70,170,80],(rel(sel.c,c.id)+100)/200);const t=trOf(c).find(x=>TT[x.type][1]);return t?hsl((t.id*67)%360,55,48):[70,76,66]}
 case'con':{if(!c)return base;let r=[70,78,66];for(const w of S.wars){if(w.a.includes(c.id))r=w.civil?[220,130,40]:[190,50,40];else if(w.d.includes(c.id))r=w.civil?[220,170,60]:[60,110,190]}return r}}return base}
function render(){const P=S.provs,PC=P.map(colP),d=img.data,CM=[];for(const k of S.cl)if(k.act&&C(k.by).alive)CM[k.p]=C(k.by).col;for(let i=0;i<W*H;i++){let c=PC[PID[i]];const cc=CM[PID[i]];if(cc&&((i%W)+(i/W|0))%8<2)c=mix(c,cc,.8);const j=i*4;d[j]=c[0];d[j+1]=c[1];d[j+2]=c[2];d[j+3]=255}
 for(let k=0;k<EI.length;k++){const a=P[EA[k]],b=P[EB[k]];if(!a.l&&!b.l)continue;let c,f;if(!a.l||!b.l){c=[18,24,18];f=.7}else if(own(a)!==own(b)){c=[10,10,8];f=.92}else{c=[0,0,0];f=layer=='prov'?.5:.22}const j=EI[k]*4;for(let q=0;q<3;q++)d[j+q]=d[j+q]*(1-f)+c[q]*f}
 ox.putImageData(img,0,0)}
const bs=()=>Math.min(cv.width/W,cv.height/H);
function draw(){const w=cv.width,h=cv.height;cx.setTransform(1,0,0,1,0,0);cx.fillStyle='#0a0f0d';cx.fillRect(0,0,w,h);const s=bs()*view.k;cx.setTransform(s,0,0,s,view.x,view.y);cx.imageSmoothingEnabled=true;cx.drawImage(off,0,0);cx.setTransform(1,0,0,1,0,0);
 cx.strokeStyle='rgba(163,179,92,.12)';cx.lineWidth=1;for(let i=0;i<=8;i++){const x=view.x+W*s*i/8,y=view.y+H*s*i/8;cx.beginPath();cx.moveTo(x,view.y);cx.lineTo(x,view.y+H*s);cx.moveTo(view.x,y);cx.lineTo(view.x+W*s,y);cx.stroke()}
 const P=S.provs;for(const p of P){if(!p.l||p.o==null)continue;const X=p.x*s+view.x,Y=p.y*s+view.y;p.cities.forEach((c,i)=>{const cap=S.C[p.o]&&S.C[p.o].cap===p.id&&c.cap;if(!cap&&view.k<1.5)return;const x=X+(i*7-4)*s*.5,y=Y+(i%2?5:-3)*s*.5;cx.fillStyle=cap?'#c0392b':'#e8dfc4';cx.strokeStyle='#000';cx.lineWidth=1;if(cap){cx.beginPath();cx.moveTo(x,y-6);cx.lineTo(x+5,y);cx.lineTo(x,y+6);cx.lineTo(x-5,y);cx.closePath();cx.fill();cx.stroke()}else cx.fillRect(x-1.5,y-1.5,3,3)});
  if(view.k>=2.2){cx.fillStyle='rgba(232,223,196,.8)';cx.font='9px Courier New';cx.fillText(p.n,X-14,Y+16)}}
 if(layer=='ali'&&!snapV){const cp=c=>{const p=P[c.cap];return p&&[p.x*s+view.x,p.y*s+view.y]};cx.lineWidth=2;for(const t of S.tr){if(!t.on)continue;cx.strokeStyle=TT[t.type][1]?'#6f6':'#cc6';const a=cp(C(t.ms[0]));if(!a)continue;for(const m of t.ms.slice(1)){const b=cp(C(m));if(!b)continue;cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1]);cx.stroke()}}cx.strokeStyle='#f44';for(const w of S.wars)for(const x of w.a)for(const y of w.d){const a=cp(C(x)),b=cp(C(y));if(a&&b){cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1]);cx.stroke()}}}
 if(sel.p!=null){const p=P[sel.p];cx.strokeStyle='#ffe066';cx.lineWidth=2;cx.strokeRect(p.x*s+view.x-8,p.y*s+view.y-8,16,16)}
 if(!snapV)for(const c of alive()){if(!c.np)continue;const sz=cl(Math.sqrt(c.np)*3.4*view.k+6,8,24);cx.font=`bold ${sz}px Courier New`;cx.textAlign='center';cx.lineWidth=3;cx.strokeStyle='rgba(8,12,8,.85)';const X=c.cx*s+view.x,Y=c.cy*s+view.y;cx.strokeText(c.b.toUpperCase(),X,Y);cx.fillStyle='#efe8cf';cx.fillText(c.b.toUpperCase(),X,Y)}cx.textAlign='left'}
