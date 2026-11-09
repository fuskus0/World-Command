"use strict";
/* ---------- territorio y memoria histórica ---------- */
const pev=(p,t)=>{(p.ev=p.ev||[]).push({y:S.y,t});if(p.ev.length>25)p.ev.shift()};
function comps(c){const seen=new Set,out=[];for(const p of prov(c)){if(seen.has(p.id))continue;const q=[p.id],comp=[];seen.add(p.id);while(q.length){const i=q.pop();comp.push(i);for(const n of S.provs[i].nb)if(S.provs[n].o===c.id&&!seen.has(n)){seen.add(n);q.push(n)}}out.push(comp)}return out}
function okRest(c,set){const rs=new Set(prov(c).filter(p=>!set.has(p.id)).map(p=>p.id));if(!rs.has(c.cap))return false;const st=[c.cap],seen=new Set([c.cap]);while(st.length){const i=st.pop();for(const n of S.provs[i].nb)if(rs.has(n)&&!seen.has(n)){seen.add(n);st.push(n)}}return seen.size===rs.size}
function region(c,size,seedP){const ps=prov(c).filter(p=>p.id!==c.cap);if(ps.length<size)return null;
 const sc=new Map(ps.map(p=>[p.id,(p.cu!==c.cul?3:0)+((p.oh||[]).some(h=>h.o!=null&&h.o!==c.id&&C(h.o)&&!C(h.o).alive)?3:0)+(50-p.st)/25+R()]));
 const seeds=(seedP&&seedP.o===c.id&&seedP.id!==c.cap?[seedP]:[]).concat(ps.slice().sort((a,b)=>sc.get(b.id)-sc.get(a.id)).slice(0,4));
 for(const sd of seeds){const reg=[sd.id],set=new Set(reg);while(reg.length<size){const cand=[];for(const i of reg)for(const n of S.provs[i].nb){const q=S.provs[n];if(q.o===c.id&&q.id!==c.cap&&!set.has(n))cand.push(q)}if(!cand.length)break;cand.sort((a,b)=>sc.get(b.id)-sc.get(a.id));reg.push(cand[0].id);set.add(cand[0].id)}
  if(reg.length===size&&okRest(c,set))return reg}return null}
function startSecession(c,size,why,opt={}){if(c.cdi>abs()||c.np<size+2||alive().length>=26)return null;const reg=region(c,size,opt.seed);if(!reg)return null;const ps=reg.map(i=>S.provs[i]);
 if(size<3&&!opt.force){ps.forEach(p=>{p.au=1;p.st=cl(p.st+20);pev(p,'Obtiene autonomía regional')});c.cdi=abs()+120;lg('aut','Autonomía regional: '+ps[0].n,`${tt(c)} concede autonomía a ${ps.map(p=>p.n).join(', ')} para evitar una crisis (${why}).`,c.id);return null}
 const nc=secede(c,reg,0);c.cdi=nc.cdi=abs()+480;return nc}
function rebel(c,p){const nc=startSecession(c,2+(R()*3|0),'rebelión',{seed:p});if(nc&&R()<.7)declare(c,nc,'Guerra de independencia',1)}
function civilEnd(w){const g=C(w.cv.g),r=C(w.cv.r);if(!g||!r||!g.alive||!r.alive)return;const x=R(),win=w.ga>w.gd?0:w.gd>w.ga?1:null;
 let o=win===0?(x<.7?'gov':'aut'):win===1?(x<.6?'reb':'split'):(x<.35?'aut':x<.7?'gov':'split');if(o=='split'&&!(r.np>=3&&comps(r).length===1))o='aut';
 const ps=prov(r);
 if(o=='split'){lg('ind','División de '+g.b,`La guerra civil termina con la división del país: ${tt(r)} se consolida con ${r.np} provincias.`,r.id,{a:g,d:r});g.cdi=r.cdi=abs()+480;return}
 if(o=='reb'){g.gov=r.gov;g.ps=null;g.ld=r.ld;loseP(g,'guerra civil');chFlag(g,'victoria rebelde',GF[g.gov]);if(monarchic(g.gov)&&!curMon(g))startDynasty(g,1,40);lg('rev','Victoria rebelde en '+g.b,`Los rebeldes imponen ${GOV[g.gov][0]} y reunifican el país.`,g.id)}
 else if(o=='aut'){ps.forEach(p=>{p.au=1;pev(p,'Región autónoma tras la guerra civil')});lg('aut','Paz y autonomía en '+g.b,`${tt(g)} concede autonomía regional a ${ps.length} provincias tras la guerra civil.`,g.id)}
 else lg('paz','Victoria del gobierno en '+g.b,`${tt(g)} recupera el control de las provincias rebeldes.`,g.id);
 ps.forEach(p=>{assign(p,g.id);p.st=45;p.cd=abs()+120;if(o=='aut')p.au=1});recount();killC(r,g,0);g.cdi=abs()+480;g.st=cl(g.st+(o=='reb'?10:5));reviewBorders()}
function reviewBorders(){let n=0;const L=alive();
 for(const p of S.provs)if(p.l&&p.o==null){const own=p.nb.filter(i=>S.provs[i].l).map(i=>S.provs[i].o),c=own.find(o=>o!=null&&own.filter(x=>x===o).length>=Math.ceil(own.length*.67));if(c!=null&&own.length>=2){assign(p,c);pev(p,'Integrada en '+C(c).b);n++}}
 for(const c of L){if(c.id===S.player)continue;const cs=comps(c);if(cs.length<2)continue;const main=cs.find(k=>k.includes(c.cap))||cs[0];
  for(const comp of cs){if(comp===main||comp.length>2)continue;const nb=new Map;for(const i of comp)for(const q of S.provs[i].nb){const o=S.provs[q].o;if(o!=null&&o!==c.id)nb.set(o,(nb.get(o)||0)+1)}
   const best=[...nb.entries()].sort((a,b)=>b[1]-a[1])[0];if(best&&best[1]>=comp.length*2&&c.np>comp.length&&R()<.5){for(const i of comp){assign(S.provs[i],best[0]);pev(S.provs[i],'Exclave cedido a '+C(best[0]).b)}lg('fron','Cesión de exclave',`${tt(c)} cede ${comp.length} provincia(s) aisladas a ${tt(C(best[0]))} mediante acuerdo.`,c.id);n++}}}
 for(const c of L)if(c.alive&&c.np===1&&c.id!==S.player&&!(S.pl&&S.pl.c===c.id)&&S.y-c.fy>40&&R()<.06){const nb=[...(c.nbs||[])].map(C).filter(x=>x.alive&&rel(c.id,x.id)>25).sort((a,b)=>rel(c.id,b.id)-rel(c.id,a.id))[0];if(nb){const p=prov(c)[0];assign(p,nb.id);pev(p,'Anexión negociada por '+nb.b);recount();killC(c,nb,0);lg('fron','Anexión negociada',`${tt(c)} se integra en ${tt(nb)} por acuerdo.`,nb.id);n++}}
 if(n)recount();return n}
function restore(c,ids,D){if(c.cdi>abs()||alive().length>=26||ids.includes(c.cap)||!okRest(c,new Set(ids)))return 0;const nc=secede(c,ids,0);nc.b=D.b;nc.fl=D.fl;nc.mo=D.mo;nc.an=D.an;nc.pa=D.id;nc.cul=S.provs[ids[0]].cu;c.cdi=nc.cdi=abs()+480;ids.forEach(i=>{S.provs[i].mv=null;pev(S.provs[i],'Restauración de '+D.b)});
 lg('ind','Restauración de '+D.b,`${ids.length} provincias restauran el antiguo ${tt(D)}, con su nombre y su bandera históricos.`,nc.id,{a:c,d:nc});if(R()<.6)declare(c,nc,'Guerra de restauración de '+D.b,1);return 1}
function memoryYear(){for(const p of S.provs){if(!p.l||p.o==null)continue;const c=C(p.o);if(!c||!c.alive)continue;
  if(!p.mv){const d=(p.oh||[]).slice().reverse().find(h=>h.o!=null&&h.o!==p.o&&C(h.o)&&!C(h.o).alive&&S.y-h.y>=20);if(d&&p.st<55&&R()<.02){p.mv={d:d.o,y:S.y};pev(p,'Resurge la identidad de '+C(d.o).b);lg('mov','Movimiento histórico en '+p.n,`En ${p.n} (${tt(c)}) resurge el recuerdo del antiguo ${tt(C(d.o))}: se reclaman su bandera y su nombre.`,c.id,{a:C(d.o),d:c,p:p.n})}}
  else if(p.st<40&&R()<.05){const D=C(p.mv.d),set=new Set([p.id]),q=[p.id];while(q.length){const i=q.pop();for(const n of S.provs[i].nb){const Q=S.provs[n];if(Q.o===c.id&&Q.mv&&Q.mv.d===p.mv.d&&!set.has(n)){set.add(n);q.push(n)}}}
   if(set.size>=2&&c.np>=set.size+2){restore(c,[...set],D)}else if(R()<.3){p.au=1;p.mv=null;p.st=cl(p.st+15);pev(p,'Autonomía por movimiento histórico');lg('aut','Autonomía en '+p.n,`${tt(c)} concede autonomía a ${p.n} ante el movimiento histórico.`,c.id)}}}}
function provModal(p){const rows=(p.oh||[]).map((h,i,a)=>{const c=h.o!=null?C(h.o):null;return`<div>${c?flag(c):'▫'} <b>${c?esc(c.b):'Sin propietario'}</b> ${c&&!c.alive?'<span class="dm">(desaparecido)</span>':''} <span class="dm">desde el Año ${h.y}${a[i+1]?' hasta '+a[i+1].y:' · actual'}</span></div>`}).join('');
 const ks=S.cl.filter(k=>k.p===p.id).map(k=>`${esc(C(k.by).b)} (${esc(k.why)}) ${k.act?'· vigente':'· cerrada'}`).join('<br>');
 modal(`<h4>HISTORIA DE ${esc(p.n).toUpperCase()}</h4>Propietarios sucesivos:${rows||'<br>—'}${p.au?'<br><span style="color:#e8b050">Región autónoma</span>':''}${p.mv?`<br><span style="color:#e8b050">Movimiento histórico: ${esc(C(p.mv.d).b)}</span> ${flag(C(p.mv.d))}`:''}<h4>ACONTECIMIENTOS</h4>${(p.ev||[]).slice().reverse().map(e=>`<span class="dm">Año ${e.y}</span> ${esc(e.t)}`).join('<br>')||'—'}<h4>REIVINDICACIONES</h4>${ks||'—'}`)}
function memoriaHtml(){const D=Object.values(S.C).filter(c=>!c.alive);return`<h4>MEMORIA HISTÓRICA: PAÍSES DESAPARECIDOS (${D.length})</h4>`+(D.map(c=>{const t=S.provs.filter(p=>(p.oh||[]).some(h=>h.o===c.id));return`<div style="margin:4px 0">${flag(c)} <b>${esc(tt(c))}</b> <span class="dm">Año ${c.fy}–${c.dy} · ${(c.fh||[]).length+1} banderas · territorio: ${t.slice(0,6).map(p=>esc(p.n)).join(', ')||'—'}</span></div>`}).join('')||'—')}
