"use strict";
/* ---------- simulación ---------- */
function tick(){S.m++;if(S.pl&&S.pl.ap<4)S.pl.ap++;if(S.m>=12){S.m=0;S.y++;yearly();if(edition(S.y-1)&&speed<=5&&$('st').style.display=='none')paperModal(S.pp.length-1)}
 const L=alive(),P=S.provs;
 for(const c of L){const g=GOV[c.gov],w=atWar(c).length>0;
  c.st=cl(c.st+(g[2]+(c.eco-50)*.35-(w?10:0)-c.wf*.12+(c.po-50)*.05-Math.max(0,c.np-5)*1.6+(c.tax>1?-6:c.tax<1?4:0)-c.st)*.06+(R()-.5)*4);c.eco=cl(c.eco+(R()-.47)*2);c.tr+=(c.np*(c.eco/50)*c.tax*.6-c.np*.4-(w?c.np*.3:0));socTick(c,w);if(c.gov=='teo'){const h=prov(c).filter(p=>p.rel===undefined&&p.re===c.rel).length/(c.np||1);c.st=cl(c.st+(h-.6)*.4)}c.mil=cl((c.mil??100)+.4,35,100);
  for(const p of prov(c)){p.st=cl(p.st+((c.st-(p.cu!==c.cul?12:0))-p.st)*.08+(R()-.5)*3);p.eco=cl(p.eco+(c.eco-p.eco)*.03+(R()-.5));p.pop*=1+.0006+(p.eco-40)*1e-5;provOp(c,p);
   if(p.st<22&&!(p.cd>abs())&&p.id!==c.cap&&c.np>1&&R()<.025&&alive().length<45){p.cd=abs()+60;const g2=[p.id];for(const q of p.nb){const Q=P[q];if(Q.o===c.id&&Q.id!==c.cap&&Q.st<40&&g2.length<3)g2.push(q)}secede(c,g2,R()<.6);break}}
  if(c.alive&&c.st<34&&R()<.03)revol(c);
  if(c.alive&&g[1]&&(abs()>=c.nx||c.st<18&&R()<.02))elect(c)}
 warStep();battleTick();recount();relTick(alive());if(S.m===0&&S.y%5===0)save();if(S.player&&!C(S.player).alive)S.player=null;dirty=1}
function revol(c){loseP(c,'revolución');const old=c.gov,ng=pick(TR[c.gov]),civil=c.np>=3&&R()<.45;
 if(civil){const ps=prov(c).filter(p=>p.id!==c.cap).sort((a,b)=>a.st-b.st).slice(0,Math.max(1,Math.floor(c.np*.4)));const nc=secede(c,ps.map(p=>p.id),0);nc.gov=ng;nc.fl=genFlag(GF[ng]);if(monarchic(ng)&&!curMon(nc))startDynasty(nc,1,45);nc.b=c.b+' Libre';nc.cul=c.cul;lg('rev','Revolución en '+c.b,`Los revolucionarios proclaman ${GOV[ng][0]} en ${ps.length} provincias.`,c.id);declare(c,nc,'Guerra civil: gobierno contra revolucionarios',1);c.st=40}
 else{setGov(c,ng,'Revolución');c.st=50;lg('rev','Revolución en '+c.b,`${GOV[old][0]} → ${GOV[ng][0]}.`,c.id)}}
function yearly(){const L=alive();if(S.y%5===0){S.snaps.push({y:S.y,o:S.provs.map(p=>p.o)});fillSnap()}
 for(const c of L){if(!c.alive)continue;const pl=c.id===S.player;
  dynYear(c);leaderYear(c);if(c.alive&&R()<.07)evento(c);
  if(!pl){const nb=nbC(c);colonize(c);
   if(c.gov=='tri'&&c.np>=3&&R()<.1)setGov(c,pick(TR.tri),'Formación del Estado');else if(c.st>70&&R()<.012)setGov(c,pick(TR[c.gov]),'Reforma constitucional');
   diplo(c,L);
   if(R()<.04){const p=pick(prov(c)),ci={n:cn(),s:.15,cap:0};p.cities.push(ci);lg('ciu','Nueva ciudad: '+ci.n,`${c.b} funda ${ci.n} en ${p.n}.`,c.id)}}}
 claimYear();sanYear();orgYear();lifeYear();paceYear();
 const sm=L.filter(c=>c.alive&&c.np<=4&&!atWar(c).length);if(sm.length&&R()<.3){const c=pick(sm),n=nbC(c).map(C).find(x=>x.np<=6&&rel(c.id,x.id)>55&&!atWar(x).length);if(n&&c.id!==S.player&&n.id!==S.player)union(c,n)}}
function union(c,n){const nn=nm();for(const p of prov(n))assign(p,c.id);lg('uni','Unificación',`${tt(c)} y ${tt(n)} se unen y forman ${nn}.`,c.id);chFlag(c,'Unificación con '+n.b,'new',[c.fl,n.fl]);killC(n,c,0);c.b=nn;c.md=mkMedia(c);recount()}
function evento(c){const g=GOV[c.gov],o=[['Crisis económica','La economía se contrae; crece el descontento.',()=>{c.eco=cl(c.eco-10);c.st=cl(c.st-6)}],['Descubrimiento de recursos','Nuevos yacimientos impulsan la economía.',()=>{c.eco=cl(c.eco+8)}],['Crisis diplomática','Tensiones con los vecinos.',()=>{c.st=cl(c.st-3)}],['Auge cultural','Prosperidad y orgullo nacional.',()=>{c.st=cl(c.st+5)}]];
 if(g[1])o.push(['Crisis constitucional','Bloqueo institucional: se adelantan las elecciones.',()=>{c.nx=abs()+2}]);if(c.gov=='rpr'||c.gov=='rpa')o.push(['Dimisión del jefe de gobierno','Dimite '+c.ld+'.',()=>{c.ld=ldn();c.st=cl(c.st-4)}]);
 const e=pick(o);e[2]();lg('evt',e[0]+' en '+c.b,e[1],c.id)}
