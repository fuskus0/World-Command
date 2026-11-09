"use strict";
/* ---------- guerras ---------- */
function declare(a,d,reason,civil){if(a===d||atWar(a).some(w=>w.a.includes(d.id)||w.d.includes(d.id)||w.a.includes(a.id)&&w.d.includes(d.id)))return;if(S.truce[a.id+'-'+d.id]>abs()&&!civil)return;
 const w={id:S.nw++,a:[a.id],d:[d.id],y0:abs(),r:reason,civil,cv:civil?{g:a.id,r:d.id}:null,ga:0,gd:0,la:0,ld:0,mo:0,n:(civil?'Guerra civil de ':'Guerra de ')+a.b+'-'+d.b};
 if(!civil){addRel(a.id,d.id,-60);addTrust(d.id,a.id,-25);dmem(a.id,d.id,'Declara la guerra');breakT(a,d);callAllies(w,a,d);sanctionRule(a,d,'declaración de guerra')}
 S.wars.push(w);a.rv.push(d.id);d.rv.push(a.id);lg('guerra!',civil?`${tt(a).toUpperCase()}: ESTALLA LA GUERRA CIVIL`:`${tt(a).toUpperCase()} DECLARA LA GUERRA A ${tt(d).toUpperCase()}`,`Motivo: ${reason}.`+(w.a.length+w.d.length>2?' Intervienen aliados.':''),a.id,{a,d})}
function warStep(){for(const w of S.wars.slice()){w.mo++;const A=w.a.map(C).filter(c=>c.alive),D=w.d.map(C).filter(c=>c.alive);if(!A.length||!D.length){endWar(w,'Victoria total');continue}
 launch(w,A,D);launch(w,D,A);const ct=w.mo>3&&R()<Math.max(0,(w.mo-3)/45)+(w.civil?.01:0)+Math.max(0,[...A,...D].reduce((q,c)=>q+c.wf,0)/(A.length+D.length)-40)/250+(w.ga+w.gd)*.025;if(ct)endWar(w,w.ga+w.gd==0?'Armisticio':'Tratado de paz firmado')}}
function endWar(w,how){for(const b of S.bt)if(b.w===w.id&&b.st=='curso')endBattle(b,'interrumpida','La guerra terminó');S.wh.push({id:w.id,n:w.n,y0:w.y0,y1:abs(),ga:w.ga,gd:w.gd,la:w.la||0,ld:w.ld||0,how});if(S.wh.length>80)S.wh.shift();S.wars=S.wars.filter(x=>x!==w);const A=w.a.map(C).filter(c=>c.alive),D=w.d.map(C).filter(c=>c.alive),win=w.ga>w.gd?'Bando atacante':w.gd>w.ga?'Bando defensor':'Sin vencedor',dur=Math.max(1,Math.round((abs()-w.y0)/12));
 for(const a of w.a)for(const d of w.d){S.truce[a+'-'+d]=S.truce[d+'-'+a]=abs()+60;addRel(a,d,12)}
 const nA=A.map(c=>c.b).join(' y ')||'—',nD=D.map(c=>c.b).join(' y ')||'—',gw=w.ga>w.gd?nA:w.gd>w.ga?nD:'—';
 lg('paz','FIN DE LA '+w.n.toUpperCase(),`Ganador: ${gw}. Provincias conquistadas: atacantes ${w.ga}, defensores ${w.gd}. Duración: ${dur} años. Resultado: ${how}.`,0,{a:w.gd>w.ga?D[0]:A[0],d:w.gd>w.ga?A[0]:D[0]});
 ban(`FIN DE LA ${esc(w.n).toUpperCase()}<br><span style="font-weight:normal">Ganador: ${esc(gw)} · Territorios cambiados: ${w.ga+w.gd} · Duración: ${dur} años<br>${how}</span>`,6000);if(w.civil&&w.cv)civilEnd(w)}
