"use strict";
/* ---------- generación ---------- */
function newWorld(seed){
 S={seed,rs:hs(seed),y:1000,m:0,provs:[],C:{},wars:[],log:[],snaps:[],nid:1,nw:1,player:null,truce:{},bn:{},rel:{},tr:[],nt:1,nz:[],sa:[],cl:[],mid:1,tw:{},dm:[],cdd:{},inb:[],bt:[],bh:[],wh:[],ch:[],pp:[],res:[],mode:null,pl:null};fades={};
 S.world=nm()+'ia';const names=new Set();let land;
 do{const ph=[R()*6,R()*6,R()*6,R()*6];S.provs=[];land=0;
  for(let gy=0;gy<GY;gy++)for(let gx=0;gx<GX;gx++){const x=(gx+.15+R()*.7)*CW,y=(gy+.15+R()*.7)*CH,dx=(x/W-.5)*2,dy=(y/H-.5)*2;
   const h=Math.sin(x*.012+ph[0])*Math.cos(y*.017+ph[1])+.6*Math.sin(x*.03+ph[2])*Math.sin(y*.025+ph[3]),f=h*.8+.55-.9*(dx*dx+dy*dy),l=f>0;if(l)land++;
   S.provs.push({id:gy*GX+gx,x,y,l,o:null,pop:l?20000+R()*180000:0,eco:30+R()*40,st:60,cu:0,re:0,t:R()*4|0,n:'',cities:[],nb:[],ar:0})}}while(land<70);
 buildMap();const L=S.provs.filter(p=>p.l);
 for(const p of L){do{p.n=nm()}while(names.has(p.n));names.add(p.n);const n=1+(R()<.5)+(R()<.25);for(let i=0;i<n;i++)p.cities.push({n:cn(),s:i?.2+R()*.2:.5,cap:0})}
 const seeds=[];for(let i=0;i<16;i++){let b=null,bd=-1;for(let k=0;k<8;k++){const p=pick(L),d=Math.min(1e9,...seeds.map(s=>(s.x-p.x)**2+(s.y-p.y)**2));if(d>bd){bd=d;b=p}}seeds.push(b)}
 const gw={};seeds.forEach(p=>{const c=newC({gov:pick(['tri','tri','mab','mab','mco','rpa','dmi','teo']),cap:p.id});gw[c.id]=.3+R()*.9;p.o=c.id});
 for(const c of alive()){const ps=prov(c);ps.forEach(p=>{p.cu=c.cul;p.re=c.rel;if(R()<.18)p.cu=(R()*6)|0;if(R()<.12)p.re=(R()*5)|0});c.cap=ps.sort((a,b)=>b.pop-a.pop)[0].id;S.provs[c.cap].cities[0].cap=1}
 for(const p of L)if(p.o==null){p.cu=R()*6|0;p.re=R()*5|0}
 for(const c of alive())if(monarchic(c.gov)&&!c.dyns)startDynasty(c,1,70);
 for(const c of alive())lg('fund','Fundación de '+tt(c),'Surge '+tt(c)+' ('+GOV[c.gov][0]+').',c.id);
 recount();sel={c:null,p:null};view.i=0;snapV=null;fillSnap();dirty=1}
function newC(o={}){const id=S.nid++,c={id,b:o.b||nm(),col:hsl((id*53+R()*40)%360,48,46),gov:o.gov||pick(['tri','mab','mco','rpa','rpr','dmi','soc','teo']),pers:pick(PERS),cap:o.cap??0,st:55,eco:45,po:50,tr:60,tax:1,al:[],rv:[],cul:(R()*6)|0,rel:(R()*5)|0,alive:1,fy:S.y,fm:S.m,np:0,pop:0,pw:0,ld:ldn(),nx:abs()+24+(R()*40|0)};S.C[id]=c;c.fl=genFlag(GF[c.gov]);c.fh=[];c.flY=S.y;c.md=mkMedia(c);c.wf=0;c.sv=50;c.cr=35;c.op={};c.an=mkAnthem(c);c.ah=[];c.anY=S.y;c.mo=mkMotto();c.mil=100;if(monarchic(c.gov))startDynasty(c,1,60);return c}
function buildMap(){PID=new Int16Array(W*H);const P=S.provs;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const gx=x/CW|0,gy=y/CH|0;let b=0,bd=1e9;for(let j=gy-1;j<=gy+1;j++)for(let i=gx-1;i<=gx+1;i++){if(i<0||j<0||i>=GX||j>=GY)continue;const p=P[j*GX+i],d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;b=p.id}}PID[y*W+x]=b}
 const N=P.map(()=>new Set);EI=[];EA=[];EB=[];P.forEach(p=>p.ar=0);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,a=PID[i];P[a].ar++;for(const j of[x<W-1?i+1:-1,y<H-1?i+W:-1]){if(j<0)continue;const b=PID[j];if(b!==a){EI.push(i,j);EA.push(a,a);EB.push(b,b);if(P[a].l&&P[b].l){N[a].add(b);N[b].add(a)}}}}
 P.forEach((p,i)=>p.nb=[...N[i]])}
/* ---------- recuento y utilidades ---------- */
function recount(){const L=alive();L.forEach(c=>{c.np=0;c.pop=0;c.pw=0;c.cx=0;c.cy=0;c.nc=0;c.nbs=new Set});
 for(const p of S.provs){const c=p.o!=null&&C(p.o);if(!c||!c.alive)continue;c.np++;c.pop+=p.pop;c.pw+=p.pop*(.5+p.eco/100)/1e4;c.cx+=p.x;c.cy+=p.y;c.nc+=p.cities.length;for(const q of p.nb){const o=S.provs[q].o;if(o!=null&&o!==c.id)c.nbs.add(o)}}
 for(const c of L){c.cx/=c.np||1;c.cy/=c.np||1;c.pw*=(c.mil??100)/100*(.5+c.st/100)*(c.pers=='Imperialista'||c.pers=='Expansionista'?1.15:1)}}
const atWar=c=>S.wars.filter(w=>w.a.includes(c.id)||w.d.includes(c.id)),nbC=c=>{const s=new Set;for(const p of prov(c))for(const q of p.nb){const o=S.provs[q].o;if(o!=null&&o!==c.id&&C(o).alive)s.add(o)}return[...s]};
function assign(p,cid){if(p.o!==cid)p.au=0;(p.oh=p.oh||[]).push({o:cid,y:S.y});if(p.oh.length>12)p.oh.shift();if(p.o!=null&&p.o!==cid){fades[p.id]={f:C(p.o).col,t:0};p.ex=[...(p.ex||[]).filter(x=>x!==p.o),p.o].slice(-3)}p.o=cid;dirty=1}
function setGov(c,g,why){const o=c.gov;c.gov=g;c.ps=null;if(GOV[g][1])c.nx=abs()+6;c.ld=ldn();chGov(c,o,g,why);lg('gob',why+': '+tt(c),`${c.b} pasa de ${GOV[o][0]} a ${GOV[g][0]}.`,c.id)}
function killC(c,by,msg=1){c.alive=0;if(S.pl&&S.pl.c===c.id){S.pl.gov=0;S.pl.out=1}for(const k in S.rel){const q=k.split('-');if(+q[0]===c.id||+q[1]===c.id)delete S.rel[k]}S.cl.forEach(k=>{if(k.by===c.id)k.act=0});S.sa.forEach(q=>{if(q.by===c.id||q.to===c.id)q.act=0});c.dy=S.y;c.dm=S.m;for(const t of S.tr)if(t.on&&t.ms.includes(c.id)){t.ms=t.ms.filter(i=>i!==c.id);if(t.ms.length<2){t.on=0;t.end={y:S.y,m:S.m}}}for(const w of S.wars.slice()){w.a=w.a.filter(i=>i!==c.id);w.d=w.d.filter(i=>i!==c.id)}
 if(msg)lg('fin','Desaparece '+tt(c),`${tt(c)} deja de existir${by?' tras ser absorbido por '+tt(by):''}. Su ficha histórica se conserva.`,c.id);if(c.id===S.player){S.player=null;ban('EL GOBIERNO HA CAÍDO: vuelves a ser observador')}}
function secede(c,ids,war){const ps=ids.map(i=>S.provs[i]);const nc=newC({b:nm(),gov:pick(['tri','rpa','soc','mab','dmi']),cap:ps[0].id});ps.forEach(p=>{assign(p,nc.id);p.st=50;pev(p,'Independencia de '+c.b)});nc.cul=ps[0].cu;nc.cap=ps.slice().sort((a,b)=>b.pop-a.pop)[0].id;S.provs[nc.cap].cities[0].cap=1;nc.st=50;
 if(!S.provs[c.cap]||S.provs[c.cap].o!==c.id){const r=prov(c).sort((a,b)=>b.pop-a.pop)[0];if(r)c.cap=r.id}
 addRel(nc.id,c.id,-30);recount();lg('ind','Independencia: '+tt(nc),`${ps.map(p=>p.n).join(', ')} se separa(n) de ${tt(c)} y funda(n) ${tt(nc)}.`,nc.id,{a:c,d:nc});if(war&&c.np>0)declare(c,nc,'Guerra de independencia',1);return nc}
function genP(c){c.ps=[];const u=new Set;while(c.ps.length<5){const a=pick(PA),b=pick(PB);if(u.has(a+b))continue;u.add(a+b);c.ps.push({n:a+' '+b,s:(a[0]+b[0]+(R()<.5?b[1].toUpperCase():'')),id:R()*IDEO.length|0,col:hsl(R()*360,50,45),po:6+R()*20,ld:ldn(),v:0,se:0,w:0})}}
function elect(c){if(!c.ps)genP(c);{const P=S.pl;if(P&&P.c===c.id&&P.party){const q=c.ps.find(x=>x.n===P.party);if(q)q.po=cl(q.po+P.cap*.08+P.camp*1.2,2,60);P.camp=0}}c.ps.forEach(p=>p.po=cl(p.po+(R()-.5)*10+(p.w?(c.po-50)*.25-c.wf*.08:0),2,60));
 const ex=c.ps.map(p=>Math.exp(p.po/12)),sm=ex.reduce((a,b)=>a+b),rem=[];let tot=0;c.ps.forEach((p,i)=>{p.v=ex[i]/sm*100;const q=p.v*1.2;p.se=Math.floor(q);tot+=p.se;rem.push([q-p.se,i])});rem.sort((a,b)=>b[0]-a[0]);for(let i=0;tot<120;i++,tot++)c.ps[rem[i][1]].se++;
 const o=[...c.ps].sort((a,b)=>b.se-a.se),w=o[0];c.ps.forEach(p=>p.w=p===w?1:0);const co=[w];let s=w.se;for(const p of o.slice(1).sort((a,b)=>Math.abs(a.id-w.id)-Math.abs(b.id-w.id))){if(s>60)break;co.push(p);s+=p.se}
 c.ld=w.ld;plElect(c,w);chBio(newChar(c,'político',w.ld),'Elegido jefe de gobierno',10);c.nx=abs()+48+(R()*12|0);c.el={y:S.y,m:S.m,co:co.map(p=>p.s),w:w.n};c.st=cl(c.st+3);
 lg('elec','Elecciones en '+tt(c),`Gana ${w.n} (${w.v.toFixed(1)}%, ${w.se} escaños). ${co.length>1?'Coalición: '+co.map(p=>p.s).join('+'):'Mayoría '+(w.se>60?'absoluta':'relativa')}. Nuevo jefe de gobierno: ${w.ld}.`,c.id);if(c.id===S.player||sel.c===c.id&&speed<=2)parlModal(c)}
function parlModal(c){if(!c.ps)return modal('<h4>PARLAMENTO</h4>Este sistema no celebra elecciones competitivas.');const seats=[];[10,14,18,22,26,30].forEach((n,r)=>{for(let k=0;k<n;k++){const a=Math.PI*(1-k/(n-1));seats.push([a,r,200+(60+r*22)*Math.cos(a),210-(60+r*22)*Math.sin(a)])}});seats.sort((p,q)=>q[0]-p[0]||p[1]-q[1]);
 let i=0,sv='<svg viewBox="0 0 400 225" width="100%" style="max-width:560px">';for(const p of[...c.ps].sort((a,b)=>a.id-b.id))for(let k=0;k<p.se;k++){const s=seats[i++];if(s)sv+=`<rect x="${s[2]-5}" y="${s[3]-5}" width="9" height="9" fill="${rgb(p.col)}"/>`}
 modal(`<h4>PARLAMENTO DE ${esc(tt(c)).toUpperCase()} — ${c.el?'Elecciones Año '+c.el.y:''}</h4>${sv}</svg><table>${[...c.ps].sort((a,b)=>b.se-a.se).map(p=>`<tr><td><span class="fl" style="width:10px;height:10px;background:${rgb(p.col)}"></span> ${p.n} (${p.s}) · ${IDEO[p.id]} · ${p.ld}</td><td>${p.v.toFixed(1)}% · ${p.se} esc.${p.w?' ★':''}</td></tr>`).join('')}</table><p>Mayoría absoluta: 61 escaños. Gobierno: ${c.el?c.el.co.join(' + '):'-'}. ${LDT[c.gov]}: <b>${esc(c.ld)}</b>.</p>`)}
