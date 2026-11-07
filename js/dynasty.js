"use strict";
/* ---------- dinastías ---------- */
const monarchic=g=>g=='mab'||g=='mco';
const MN=['Alejandro','Fernando','Carlos','Mateo','Aurelio','Ricardo','Teodoro','Leopoldo','Rodrigo','Arturo'],FM=['Isabel','Elena','Leonor','Beatriz','Marta','Sofía','Adela','Catalina','Berenice','Julia'];
const ROM=n=>['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'][n]||String(n);
const SK=['#e8c7a0','#d9a577','#b87a4b','#8d5a36'],HC=['#2b1d12','#5a3a1a','#a8a8a8','#8a5a2a'];
const dsn=()=>pick(S1)+pick(['court','mont','ier','hall','berg','mar']);
const mname=p=>`${p.g=='M'?'Rey':'Reina'} ${p.n} ${ROM(p.num||1)} ${p.sn}`;
const curMon=c=>{const d=c.dyns&&c.dyns[c.dyn];return d&&c.mon!=null?d.p.find(p=>p.id===c.mon):null};
const portrait=p=>`<svg width="26" height="32" viewBox="0 0 26 32" style="flex:none;background:#26331f;border:1px solid #000"><path d="M2 32q0-9 11-9t11 9z" fill="${p.ac?'#8b1a1a':'#4a5a3a'}"/><circle cx="13" cy="13" r="7" fill="${SK[p.sk]}"/><path d="M6 12q0-9 7-9t7 9q-3-4-7-4t-7 4z" fill="${HC[p.hc]}"/>${p.ac?'<path d="M7 7l2-4 2 3 2-4 2 4 2-3 2 4z" fill="#d9b030"/>':''}</svg>`;
function newP(d,g,by,f){const p={id:d.p.length+1,g,n:pick(g=='M'?MN:FM),by,f,sn:d.sn,al:1,ab:0,sk:R()*4|0,hc:R()*4|0,lg:60,ac:null,en:null,dy:null};d.p.push(p);return p}
function crown(c,p,lg0){const mh=c.mh||(c.mh=[]);p.num=1+mh.filter(h=>h.sn===p.sn&&h.nm===p.n).length;p.ac=S.y;p.lg=lg0;c.mon=p.id;mh.push({nm:p.n,sn:p.sn,g:p.g,num:p.num,y0:S.y,y1:null,why:'',d:c.dyn});c.ld=mname(p)}
function endReign(c,why){const h=(c.mh||[]).slice(-1)[0];if(h&&h.y1==null){h.y1=S.y;h.why=why}const m=curMon(c);if(m)m.en=S.y;c.mon=null}
function startDynasty(c,quiet,lg0=75){const d={sn:dsn(),rule:pick(['agn','cog']),p:[],y:S.y};(c.dyns=c.dyns||[]).push(d);c.dyn=c.dyns.length-1;const age=28+(R()*22|0),f=newP(d,R()<.8?'M':'F',S.y-age,null);crown(c,f,lg0);
 const n=R()*4|0;for(let i=0;i<n;i++)newP(d,R()<.5?'M':'F',S.y-(R()*(age-20)|0),f.id);if(!quiet)lg('suc','Nueva dinastía en '+c.b,`Asciende ${mname(f)}, fundador de la Casa ${d.sn}.`,c.id);return f}
function heirs(c,ex){const d=c.dyns[c.dyn],m=curMon(c)||ex;if(!m)return[];const tier=q=>q.f===m.id?0:q.f!=null&&q.f===m.f?1:2;
 return d.p.filter(q=>q.al&&!q.ab&&q.id!==m.id).sort((a,b)=>(d.rule=='agn'?(a.g=='F')-(b.g=='F'):0)||tier(a)-tier(b)||a.by-b.by)}
function succ(c,old,cause){endReign(c,cause=='abdica'?'abdicación':'fallecimiento');const H=heirs(c,old),n0=mname(old),yrs=S.y-old.ac,verb=cause=='abdica'?'abdica':'fallece';
 if(H.length){const q=H[0],rl=q.f===old.id?(q.g=='M'?'su hijo':'su hija'):q.f!=null&&q.f===old.f?'su hermano/a':'un pariente';crown(c,q,q.f===old.id?78:q.f===old.f?65:52);c.st=cl(c.st-(S.y-q.by<16?4:1));
  lg('suc',(cause=='abdica'?'Abdica ':'Muere ')+n0,`${n0} ${verb} tras ${yrs} años de reinado. Le sucede ${rl}, ${mname(q)}.`,c.id);return}
 const r=R(),why=`Sin heredero claro tras ${cause=='abdica'?'la abdicación':'la muerte'} de ${n0}`;c.st=cl(c.st-15);
 if(r<.45){const f=startDynasty(c,1,35);lg('suc','Cambio de dinastía en '+c.b,`${why}: la nobleza proclama a ${mname(f)}, de la Casa ${c.dyns[c.dyn].sn}.`,c.id)}
 else if(r<.7&&c.np>=3){const ps=prov(c).filter(p=>p.id!==c.cap).sort((a,b)=>a.st-b.st).slice(0,Math.max(1,Math.floor(c.np*.4))),nc=secede(c,ps.map(p=>p.id),0);nc.gov=c.gov;nc.b=c.b+' del Este';startDynasty(nc,1,40);startDynasty(c,1,40);
  lg('suc','Crisis sucesoria en '+c.b,`${why}: dos pretendientes se disputan el trono.`,c.id);declare(c,nc,'Guerra de sucesión',1)}
 else if(r<.9){setGov(c,'rpa','Proclamación de república');lg('suc','Fin de la monarquía en '+c.b,`${why}: el parlamento proclama la república.`,c.id)}
 else{const f=startDynasty(c,1,45);c.st=cl(c.st-10);lg('suc','Regencia en '+c.b,`${why}: un consejo de regencia designa a ${mname(f)}.`,c.id)}}
function dynYear(c){if(!monarchic(c.gov)||!c.alive)return;if(!c.dyns||!curMon(c))startDynasty(c,1,55);const d=c.dyns[c.dyn];
 for(const p of d.p){if(!p.al)continue;const a=S.y-p.by;if(R()<(a<50?.004:a<70?.01+(a-50)*.004:.09+(a-70)*.03)){p.al=0;p.dy=S.y;if(p.id===c.mon)succ(c,p,'fallece')}}
 for(const p of d.p.slice()){if(!p.al)continue;const a=S.y-p.by;if(a>=20&&a<=42&&d.p.filter(q=>q.f===p.id).length<5&&(d.rule=='cog'||p.g=='M')&&R()<.13)newP(d,R()<.5?'M':'F',S.y,p.id)}
 const m=curMon(c);if(m&&m.al){m.lg=cl(m.lg+(60-m.lg)*.05+(c.st-50)*.03);if(S.y-m.by>62&&heirs(c).length&&(c.st<30||R()<.025)){m.ab=1;succ(c,m,'abdica')}}}
function tree(c,d,p,dep){return`<div style="margin-left:${dep*16}px;display:flex;gap:6px;align-items:center;margin-top:3px">${portrait(p)}<span>${p.g=='M'?'♂':'♀'} <b>${esc(p.n)} ${esc(p.sn)}</b> (${p.by}–${p.al?'':p.dy}) ${p.ac?'· ★ '+esc(mname(p))+' · reinó '+((p.en??S.y)-p.ac)+' años':''}</span></div>`+d.p.filter(q=>q.f===p.id).map(q=>tree(c,d,q,dep+1)).join('')}
function dynModal(c){const mh=c.mh||[],ds=c.dyns||[];modal(`<h4>DINASTÍAS DE ${esc(c.b).toUpperCase()}</h4>`+(ds.length?ds.map((d,i)=>`<h4 style="color:#e8dfc4">CASA ${esc(d.sn).toUpperCase()} (desde Año ${d.y}${i===c.dyn&&monarchic(c.gov)?' · reinante':''}) · sucesión ${d.rule=='agn'?'agnática':'cognaticia'}</h4>`+d.p.filter(p=>p.f==null).map(p=>tree(c,d,p,0)).join('')).join(''):'Sin dinastía.')+`<h4>HISTORIAL DE MONARCAS</h4>`+(mh.slice().reverse().map(h=>`${h.g=='M'?'Rey':'Reina'} ${esc(h.nm)} ${ROM(h.num)} ${esc(h.sn)}: Año ${h.y0}–${h.y1??'actualidad'} (${(h.y1??S.y)-h.y0} años)${h.why?' · '+h.why:''}`).join('<br>')||'—'))}
