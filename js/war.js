"use strict";
/* ---------- guerras ---------- */
function declare(a,d,reason,civil){if(a===d||atWar(a).some(w=>w.a.includes(d.id)||w.d.includes(d.id)||w.a.includes(a.id)&&w.d.includes(d.id)))return;if(S.truce[a.id+'-'+d.id]>abs()&&!civil)return;
 const w={id:S.nw++,a:[a.id],d:[d.id],y0:abs(),r:reason,civil,ga:0,gd:0,mo:0,n:(civil?'Guerra civil de ':'Guerra de ')+a.b+'-'+d.b};
 if(!civil){addRel(a.id,d.id,-60);breakT(a,d);callAllies(w,a,d);sanctionRule(a,d,'declaración de guerra')}
 S.wars.push(w);a.rv.push(d.id);d.rv.push(a.id);lg('guerra!',civil?`${tt(a).toUpperCase()}: ESTALLA LA GUERRA CIVIL`:`${tt(a).toUpperCase()} DECLARA LA GUERRA A ${tt(d).toUpperCase()}`,`Motivo: ${reason}.`+(w.a.length+w.d.length>2?' Intervienen aliados.':''),a.id,{a,d})}
function warStep(){for(const w of S.wars.slice()){w.mo++;const A=w.a.map(C).filter(c=>c.alive),D=w.d.map(C).filter(c=>c.alive);if(!A.length||!D.length){endWar(w,'Victoria total');continue}
 atk(w,A,D,'a');atk(w,D,A,'d');const ct=w.mo>3&&R()<Math.max(0,(w.mo-3)/45)+(w.civil?.01:0)+Math.max(0,[...A,...D].reduce((q,c)=>q+c.wf,0)/(A.length+D.length)-40)/250;if(ct)endWar(w,w.ga+w.gd==0?'Armisticio':'Tratado de paz firmado')}}
function atk(w,A,D,side){const as=new Set(A.map(c=>c.id)),ds=new Set(D.map(c=>c.id)),cand=[];for(const p of S.provs)if(p.l&&ds.has(p.o)){const q=p.nb.find(n=>as.has(S.provs[n].o));if(q!=null)cand.push([p,S.provs[q].o])}
 if(!cand.length)return;const sA=A.reduce((s,c)=>s+c.pw,0),sD=D.reduce((s,c)=>s+c.pw,0)*1.1;if(R()<.17*sA/(sA+sD)){const[p,o]=pick(cand),to=C(o),fr=C(p.o);
  side=='a'?w.ga++:w.gd++;assign(p,o);p.st=38;p.cd=abs()+60;fr.np--;to.np++;fr.st=cl(fr.st-4);addRel(o,fr.id,-25);fr.wf=cl(fr.wf+6);to.wf=cl(to.wf+1);if(R()<.15)sanctionRule(to,fr,'conquista territorial');allies(fr).forEach(x=>addRel(x,o,-4));lg('conq','Conquista de '+p.n,`${tt(to)} conquista ${p.n} (${p.cities.map(c=>c.n).join(', ')}) a ${tt(fr)}.`,to.id,{a:to,d:fr,p:p.n});
  const rest=prov(fr);if(!rest.length)killC(fr,to);else if(fr.cap===p.id){fr.cap=rest.sort((a,b)=>b.pop-a.pop)[0].id;fr.st=cl(fr.st-10);lg('cap','Pérdida de la capital',`${tt(fr)} traslada su capital a ${S.provs[fr.cap].n}.`,fr.id)}}}
function endWar(w,how){S.wars=S.wars.filter(x=>x!==w);const A=w.a.map(C).filter(c=>c.alive),D=w.d.map(C).filter(c=>c.alive),win=w.ga>w.gd?'Bando atacante':w.gd>w.ga?'Bando defensor':'Sin vencedor',dur=Math.max(1,Math.round((abs()-w.y0)/12));
 for(const a of w.a)for(const d of w.d){S.truce[a+'-'+d]=S.truce[d+'-'+a]=abs()+60;addRel(a,d,12)}
 const nA=A.map(c=>c.b).join(' y ')||'—',nD=D.map(c=>c.b).join(' y ')||'—',gw=w.ga>w.gd?nA:w.gd>w.ga?nD:'—';
 lg('paz','FIN DE LA '+w.n.toUpperCase(),`Ganador: ${gw}. Provincias conquistadas: atacantes ${w.ga}, defensores ${w.gd}. Duración: ${dur} años. Resultado: ${how}.`,0,{a:w.gd>w.ga?D[0]:A[0],d:w.gd>w.ga?A[0]:D[0]});
 ban(`FIN DE LA ${esc(w.n).toUpperCase()}<br><span style="font-weight:normal">Ganador: ${esc(gw)} · Territorios cambiados: ${w.ga+w.gd} · Duración: ${dur} años<br>${how}</span>`,6000)}
