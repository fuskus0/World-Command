"use strict";
/* ---------- sociedad ---------- */
const IL=[.3,-.6,.9,-.8,.5,.5,.2,-.9,.1,.1],GL={tri:0,mab:-.7,mco:-.3,rpa:0,rpr:-.1,dmi:-.8,soc:.9,teo:-.9},LIB={tri:50,mab:30,mco:70,rpa:80,rpr:75,dmi:15,soc:35,teo:25},COR={dmi:55,mab:50,tri:35,teo:45,soc:45,mco:30,rpa:30,rpr:35};
function socTick(c,w){c.wd=w?(c.wd||0)+1:0;c.wf=cl((c.wf||0)+(w?.7+Math.min(1.2,c.wd/60)+(c.eco<40?.4:0):-1.2));
 c.sv=cl((c.sv??50)+(50-(c.sv??50))*.01);c.cr=cl((c.cr??35)+((COR[c.gov]||40)-(c.cr??35))*.01+(R()-.5)*.6);
 const imp=c.tax>1?60-(c.tax-1)*100:60+(1-c.tax)*60;c.op={eco:c.eco,seg:c.st,gue:100-c.wf,imp:cl(imp),srv:c.sv,cor:100-c.cr,lib:LIB[c.gov]||40};const o=c.op,tg=o.eco*.25+o.seg*.15+o.gue*.15+o.imp*.1+o.srv*.1+o.cor*.1+o.lib*.05+(c.el&&abs()-(c.el.y*12+c.el.m)<12?5:0);c.po=cl(c.po+(tg-c.po)*.08);
 for(const s of S.sa)if(s.act){if(s.to===c.id)c.eco=cl(c.eco-(s.ty=='emb'?.12:.04));else if(s.by===c.id&&s.ty=='emb')c.eco=cl(c.eco-.02)}
 if(c.wf>70&&!c.wfp){c.wfp=1;lg('prot','Peticiones de paz en '+c.b,`El cansancio de guerra en ${tt(c)} supera el 70%: crecen las manifestaciones y las peticiones de paz.`,c.id)}else if(c.wf<50)c.wfp=0;
 if(c.po<35&&R()<.015){c.st=cl(c.st-3);lg('prot','Protestas en '+c.b,`Manifestaciones masivas contra el Gobierno de ${tt(c)}: apoyo del ${c.po.toFixed(0)}%.`,c.id)}
 if(c.po<30&&R()<.004){c.sv=cl(c.sv+10);c.cr=cl(c.cr-8);c.st=cl(c.st+4);lg('prot','Reformas en '+c.b,`Ante la presión social, ${tt(c)} aprueba reformas de servicios y contra la corrupción.`,c.id)}}
function provOp(c,p){if(p.ln==null)p.ln=cl((p.eco-50)/40+(R()-.5)*.6,-1,1);const t=c.po+10*p.ln*(GL[c.gov]||0)-(p.cu!==c.cul?12:0),a=p.ap??c.po;p.ap=cl(a+(t-a)*.1);if(p.ap<25&&p.st>15)p.st-=.25;if(p.ap<28&&R()<.003)lg('prot','Protestas en '+p.n,`La población de ${p.n} (${tt(c)}) protesta: apoyo al gobierno del ${p.ap.toFixed(0)}%.`,c.id)}
/* reivindicaciones */
function mkClaim(c,p,why){S.cl.push({by:c.id,ow:p.o,p:p.id,why,y:S.y,m:S.m,t:20,act:1});addRel(c.id,p.o,-10);lg('reiv','Reivindicación: '+p.n,`${tt(c)} reclama ${p.n}, en poder de ${tt(C(p.o))}. Motivo: ${why}.`,c.id,{a:c,d:C(p.o),p:p.n})}
function claimYear(){const L=alive();
 for(const c of L){if(c.id===S.player||!c.nbs)continue;if(S.cl.filter(k=>k.act&&k.by===c.id).length<3&&R()<.1){const w=S.provs.filter(p=>p.l&&p.o!=null&&p.o!==c.id&&c.nbs.has(p.o)&&!shareT(c,C(p.o))&&!S.cl.some(k=>k.act&&k.by===c.id&&k.p===p.id)).map(p=>{let why=null;if((p.ex||[]).includes(c.id))why='Antigua frontera';else if(p.cu===c.cul)why='Afinidad cultural e idioma';else if(rel(c.id,p.o)<-50&&R()<.25)why='Disputa territorial';else if(p.re===c.rel&&R()<.05)why='Vínculos históricos';return why&&[p,why]}).filter(Boolean);if(w.length){const[p,why]=pick(w);mkClaim(c,p,why)}}}
 for(const k of S.cl){if(!k.act)continue;const A=C(k.by),p=S.provs[k.p];if(!A.alive||p.o==null||p.o===k.by||!C(p.o).alive){k.act=0;k.end=S.y;continue}k.ow=p.o;const B=C(k.ow),r=rel(k.by,k.ow);k.t=cl(k.t+(r<-30?6:r>20?-8:1)+(R()-.5)*4);
  if((shareT(A,B)&&r>25||r>45)&&R()<.3){k.act=0;k.end=S.y;lg('reiv','Renuncia a una reivindicación',`${A.b} renuncia a su reclamo sobre ${p.n}.`,k.by,{a:A,d:B,p:p.n})}
  else if(k.t>50&&r>0&&R()<.08&&B.np>1){assign(p,k.by);if(B.cap===p.id)B.cap=prov(B).find(x=>x.id!==p.id).id;recount();k.act=0;k.end=S.y;addRel(k.by,k.ow,15);lg('reiv','Cesión negociada: '+p.n,`${tt(B)} cede ${p.n} a ${tt(A)} tras una negociación.`,k.by)}
  else if(k.t>80&&r<-40&&R()<.15&&k.by!==S.player&&S.wars.length<Math.max(1,L.length/5))declare(A,B,'Reivindicación territorial: '+p.n)}}
/* sanciones */
const sanBlock=(a,b)=>S.sa.some(s=>s.act&&(s.by===a&&s.to===b||s.by===b&&s.to===a));
function impose(by,to,ty,why,coll){if(by===to||S.sa.some(s=>s.act&&s.by===by&&s.to===to))return;const A=C(by),B=C(to);if(!A.alive||!B.alive)return;S.sa.push({by,to,ty,why,coll:coll||0,y:S.y,m:S.m,act:1});addRel(by,to,-12);addTrust(to,by,-10);
 if(ty=='dip')for(const t of S.tr.filter(t=>t.on&&t.ms.includes(by)&&t.ms.includes(to)))leave(A,t,'rompe con '+B.b);
 const o=coll&&S.tr.find(t=>t.id===coll);lg('san',(ty=='dip'?'Ruptura diplomática: ':'Sanciones: ')+A.b+' → '+B.b,`${tt(A)} ${ty=='dip'?'rompe relaciones con':'impone un embargo a'} ${tt(B)} (${why}).${o?' Sanción colectiva de '+o.n+'.':''}`,by,{a:A,d:B})}
function sanctionRule(agg,vic,why){for(const X of alive()){if(X===agg)continue;const isV=X===vic;if((isV||rel(X.id,vic.id)>30)&&rel(X.id,agg.id)<-25&&R()<(isV?.5:.2))impose(X.id,agg.id,R()<.3?'dip':'emb',why)}
 for(const t of S.tr)if(t.on&&t.type!='nag'&&t.ms.includes(vic.id)&&!t.ms.includes(agg.id)&&t.co>40&&R()<.5)for(const m of t.ms)impose(m,agg.id,'emb',why,t.id)}
function sanYear(){for(const s of S.sa){if(!s.act)continue;const A=C(s.by),B=C(s.to);if(!A.alive||!B.alive){s.act=0;continue}if(rel(s.by,s.to)>5&&R()<.4||(S.y-s.y>8&&R()<.1)){s.act=0;s.ey=S.y;lg('san','Sanciones levantadas',`${A.b} levanta las sanciones a ${B.b}.`,s.by)}}
 S.sa=S.sa.filter(s=>s.act||S.y-(s.ey||s.y)<30);const L=alive();for(const c of L){if(c.id===S.player)continue;for(const x of L)if(x!==c&&rel(c.id,x.id)<-70&&R()<.03)impose(c.id,x.id,R()<.5?'emb':'dip','relaciones muy deterioradas')}}
/* fichas */
function heirsTxt(c){return heirs(c).slice(0,3).map(q=>esc(q.n)+' ('+(S.y-q.by)+')').join(', ')||'ninguno claro'}
function socHtml(c){const op=c.op||{},bar=(l,v)=>`<tr><td>${l}</td><td>${(v??0).toFixed(0)}</td></tr>`;
 let h=`<h4>OPINIÓN PÚBLICA</h4><table>${bar('Apoyo al gobierno',c.po)}${bar('Economía',op.eco)}${bar('Seguridad / estabilidad',op.seg)}${bar('Guerras (paz)',op.gue)}${bar('Impuestos',op.imp)}${bar('Servicios públicos',op.srv)}${bar('Honradez',op.cor)}${bar('Libertades',op.lib)}<tr><td>Cansancio de guerra</td><td>${(c.wf||0).toFixed(0)}%</td></tr></table>`;
 const ks=S.cl.filter(k=>k.act&&(k.by===c.id||k.ow===c.id)),ss=S.sa.filter(s=>s.act&&(s.by===c.id||s.to===c.id));
 h+=`<h4>REIVINDICACIONES</h4>`+(ks.map(k=>`${k.by===c.id?'Reclama':'Reclamada por'} ${k.by===c.id?esc(S.provs[k.p].n)+' a '+esc(C(k.ow).b):esc(C(k.by).b)+' · '+esc(S.provs[k.p].n)} · ${esc(k.why)} · tensión ${k.t.toFixed(0)}`).join('<br>')||'—');
 h+=`<h4>SANCIONES</h4>`+(ss.map(s=>`${s.by===c.id?'Impone':'Sufre'} ${s.ty=='dip'?'ruptura':'embargo'} · ${esc(C(s.by===c.id?s.to:s.by).b)} (${esc(s.why)})`).join('<br>')||'—');
 h+=`<h4>PRENSA</h4>`+(c.md||[]).map(o=>`<b>${esc(o.n)}</b> <span class="dm">${{of:'oficialista',op:'opositor',in:'independiente'}[o.st]} · ${IDEO[o.ed]} · neutralidad ${o.neu}% · lectores ${o.po}%</span>`).join('<br>');
 const O=alive().filter(x=>x.id!==c.id).map(x=>[x,rel(c.id,x.id)]).sort((a,b)=>b[1]-a[1]);if(O.length)h+=`<br><span class="dm">Línea editorial: favorable a ${esc(O[0][0].b)}, crítica con ${esc(O[O.length-1][0].b)}</span>`;
 h+=`<h4>BANDERAS</h4>${flagSVG(c.fl,66,44)} <button class="b" data-a="fsvg">SVG</button><button class="b" data-a="fpng">PNG</button> `+(c.fh||[]).slice().reverse().map(f=>`<span title="Año ${f.y0}–${f.y1}: ${esc(f.why)}">${flagSVG(f.fl,30,20)}</span>`).join(' ');
 h+=`<h4>HIMNO</h4><button class="b" data-a="anp">▶ Escuchar</button><button class="b" data-a="anpause">⏯ Pausa</button><button class="b" data-a="anstop">■</button><button class="b" data-a="anwav">WAV</button> <span class="dm">${(c.ah||[]).length} himnos anteriores</span>`;if(c.dyns&&c.dyns.length){h+=`<h4>DINASTÍA</h4>`;const m=curMon(c);if(m&&monarchic(c.gov)&&c.alive){const d=c.dyns[c.dyn];h+=`<div style="display:flex;gap:6px">${portrait(m)}<div><b>${esc(mname(m))}</b><br>Nac. ${m.by} · edad ${S.y-m.by}<br>Reina desde ${m.ac} (${S.y-m.ac} años)<br>Legitimidad ${m.lg.toFixed(0)}% · Popularidad ${c.po.toFixed(0)}%</div></div>Casa ${esc(d.sn)} · sucesión ${d.rule=='agn'?'agnática':'cognaticia'}<br>Herederos: ${heirsTxt(c)}<br>`}h+=`<button class="b" data-a="dyn">Árbol genealógico e historial</button>`}
 return h}
function provExtra(p,oc){let h='';const k=S.cl.find(k=>k.act&&k.p===p.id);if(k)h+=`<span style="color:#e8b050">▨ Reclamada por ${esc(C(k.by).b)} (${esc(k.why)})</span><br>`;
 if(oc&&oc.ps&&p.ln!=null){const sc=q=>q.po-Math.abs(IL[q.id]-p.ln)*25,b=[...oc.ps].sort((a,b)=>sc(b)-sc(a))[0];h+=`Prefiere: ${esc(b.n)}<br>`}return h+`Apoyo al gobierno ${(p.ap??0).toFixed(0)}% · oposición ${(100-(p.ap??0)).toFixed(0)}%<br>`}
