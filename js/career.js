"use strict";
/* ---------- modos, creador de país y carrera política ---------- */
const RD=['Oficial','Coronel','General','Número dos del régimen'],RT=['Novicio','Sacerdote','Obispo','Miembro del Consejo'],RTR=['Guerrero','Anciano del consejo'];
const ctype=c=>c.gov=='mab'?'mab':c.gov=='mco'?'mco':c.gov=='dmi'||c.gov=='soc'?'dic':c.gov=='teo'?'teo':c.gov=='tri'?'tri':'dem';
const ph=t=>{if(S.pl)S.pl.hist.push({y:S.y,m:S.m,t})},partyOf=P=>{const c=C(P.c);return c&&c.ps&&c.ps.find(q=>q.n===P.party)},perP=()=>{const P=S.pl,c=P&&C(P.c);return c&&c.dyns&&c.dyns[P.di]?c.dyns[P.di].p.find(p=>p.id===P.pid):null};
function role(P,c){const ty=ctype(c);if(P.gov)return LDT[c.gov];if(ty=='dem'){const q=partyOf(P);return P.party?(q&&q.ld===P.n?'Líder de ':'Militante de ')+P.party:'Ciudadano'}if(ty=='mab'||ty=='mco'){const m=perP();return m?(m.g=='M'?'Príncipe heredero':'Princesa heredera'):'Familiar real'}if(ty=='dic')return RD[P.rk];if(ty=='teo')return RT[P.rk];return RTR[Math.min(1,P.rk)]}
function startCareer(c,name,mk){mk=mk||{};const P={n:name||ldn(),c:c.id,by:S.y-30,cap:10,sup:20,ap:3,gov:0,rk:0,hist:[],party:null,camp:0},ty=ctype(c);S.pl=P;S.mode='pol';
 if(ty=='mab'||ty=='mco'){if(!c.dyns||!curMon(c))startDynasty(c,1,70);const d=c.dyns[c.dyn],m=curMon(c);
  if(mk.monarch){m.pl=1;P.pid=m.id;P.di=c.dyn;P.by=m.by;P.gov=1;ph('Asciendes al trono como '+mname(m))}
  else{const by=Math.max(m.by+18,S.y-24),p=newP(d,R()<.5?'M':'F',by,m.id);p.n=P.n;p.pl=1;P.pid=p.id;P.di=c.dyn;P.by=by;ph(`Naces en la Casa ${d.sn}, hijo/a de ${mname(m)}`)}}
 else if(ty=='dic'){if(mk.heir||(c.hd&&R()<.5)){P.heir=1;ph('Eres el heredero del dictador')}else ph('Entras al servicio del régimen')}
 else if(ty=='teo')ph('Ingresas en la institución religiosa');else if(ty=='tri')ph('Creces entre los guerreros de la tribu');else ph('Comienzas tu vida política como ciudadano');
 S.player=P.gov?c.id:null;lg('fund','Nuevo personaje: '+P.n,`${P.n} inicia su carrera política en ${tt(c)}.`,c.id);refresh()}
function takeP(c,P,why){P.gov=1;S.player=c.id;c.ld=P.n;c.lby=P.by;ph('Accedes al poder: '+why);lg('suc','Nuevo gobernante en '+c.b,`${P.n} accede al poder en ${tt(c)}: ${why}.`,c.id)}
function loseP(c,why){const P=S.pl;if(P&&P.gov&&P.c===c.id){P.gov=0;P.rk=0;P.sup=Math.max(0,P.sup-30);if(S.player===c.id)S.player=null;ph('Pierdes el poder: '+why);ban('HAS PERDIDO EL PODER: '+esc(why),3500)}}
function plElect(c,w){const P=S.pl;if(!P||P.c!==c.id||!P.party)return;if(w.n===P.party&&w.ld===P.n){if(!P.gov){takeP(c,P,'victoria electoral de '+P.party);ban('¡HAS GANADO LAS ELECCIONES!',3500)}}else{if(P.gov)loseP(c,'derrota electoral');else if(w.n===P.party){P.cap=cl(P.cap+10);ph('Tu partido gobierna, pero no lideras el gobierno')}else{ph('Pierdes las elecciones: '+P.party+' queda por detrás de '+w.n);P.cap=cl(P.cap-3)}}}
function leaderYear(c){if(!['dmi','soc','teo','tri'].includes(c.gov)||!c.alive||(S.pl&&S.pl.gov&&S.pl.c===c.id))return;c.lby=c.lby??S.y-(35+(R()*25|0));const a=S.y-c.lby;
 if(R()<(a>55?.03+(a-55)*.008:.004)){const P=S.pl,ty=ctype(c),old=c.ld;let win=false;
  if(P&&P.c===c.id&&!P.gov&&!P.out){if(ty=='dic')win=!!(P.heir&&c.hd)||(P.rk>=3&&R()<cl((P.sup-35)/80,0,.9));else if(ty=='teo')win=P.rk>=3&&P.cap>Math.max(20+R()*40,20+R()*40,20+R()*40);else win=P.rk>=1&&R()<cl((P.cap-20)/80,0,.9)}
  if(win)takeP(c,P,ty=='teo'?'elegido por el consejo religioso':ty=='tri'?'elegido por el consejo de ancianos':P.heir&&c.hd?'sucesión hereditaria':'sucede al dictador fallecido');
  else{c.ld=c.hd?pick(FN)+' '+c.hd.sn:ldn();c.lby=S.y-(35+(R()*20|0));c.st=cl(c.st-4);lg('suc','Muere el líder de '+c.b,`${old} fallece. ${ty=='teo'?'El consejo religioso':'El régimen'} designa a ${c.ld}.`,c.id)}}}
const RISE={dic:[[25,30],[50,50],[70,65]],teo:[[20,20],[45,40],[65,55]],tri:[[30,20]]};
function careerAct(a,v){const P=S.pl,c=P&&C(P.c);if(!P||!c||!c.alive||P.out)return;if(P.ap<1)return ban('No te quedan acciones este mes: espera al siguiente',1800);const ty=ctype(c),g=x=>x*(.6+R()*.8);P.ap--;
 if(a=='k_speech'){P.cap=cl(P.cap+g(4));const q=partyOf(P);if(q)q.po=cl(q.po+.5);ph('Pronuncias un discurso público')}
 else if(a=='k_elite'){P.sup=cl(P.sup+g(4));P.cap=cl(P.cap+1);ph('Te reúnes con las élites del país')}
 else if(a=='k_found'){if(!c.ps)genP(c);const n=($('kpn').value||'').trim()||pick(PA)+' '+pick(PB),id=+($('kid').value||0),q={n,s:n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,4),id,col:hsl(R()*360,55,45),po:6,ld:P.n,v:0,se:0,w:0,pl:1};c.ps.push(q);P.party=n;P.cap=cl(P.cap+3);ph(`Fundas el partido ${n} (${IDEO[id]})`)}
 else if(a=='k_join'&&v){const q=c.ps.find(x=>x.n===v);if(q){P.party=q.n;P.cap=cl(P.cap+2);if(P.cap>65&&R()<.3){q.ld=P.n;ph('Asumes el liderazgo de '+q.n)}else ph('Te unes a '+q.n)}}
 else if(a=='k_camp'){const q=partyOf(P);if(!q||c.nx-abs()>24){P.ap++;return ban('No hay elecciones en los próximos 24 meses o no tienes partido',2200)}P.camp++;q.po=cl(q.po+.6+P.cap/100);P.cap=cl(P.cap+1.5);ph('Haces campaña por '+P.party)}
 else if(a=='k_court'){P.sup=cl(P.sup+g(5));ph('Ganas apoyos en la corte')}
 else if(a=='k_conspire'){const m=curMon(c),me=perP();if(!m||!me||m.id===me.id){P.ap++;return}const p=cl(.1+(P.sup-50)/200-(m.lg-50)/300,.03,.6);
  if(R()<p){m.ab=1;endReign(c,'depuesto');crown(c,me,45);P.gov=1;S.player=c.id;P.gov=1;ph('Depones al monarca y tomas el trono');lg('rev','Usurpación en '+c.b,`${P.n} depone a ${mname(m)} y se proclama soberano.`,c.id)}else{P.sup=cl(P.sup-30);P.cap=cl(P.cap-20);ph('Tu conspiración fracasa');lg('evt','Conspiración fallida en '+c.b,`Se descubre un complot contra ${mname(m)}.`,c.id)}}
 else if(a=='k_loyal'||a=='k_serve'||a=='k_hunt'||a=='k_study'){P.sup=cl(P.sup+g(a=='k_loyal'||a=='k_serve'?5:2));P.cap=cl(P.cap+g(a=='k_study'||a=='k_hunt'?4:2));ph({k_loyal:'Ganas la lealtad de oficiales',k_serve:'Sirves en el templo',k_hunt:'Lideras una cacería',k_study:'Estudias las escrituras'}[a])}
 else if(a=='k_rise'){const th=(RISE[ty]||[])[P.rk];if(!th){P.ap++;return ban('No hay más ascensos posibles',1500)}if(P.cap>=th[0]&&P.sup>=th[1]){P.rk++;ph('Ascenso: '+role(P,c))}else{P.ap++;ban(`Necesitas capital ≥${th[0]} y apoyo ≥${th[1]}`,2200)}}
 else if(a=='k_coup'){const p=cl(.15+(P.sup-50)/150+(50-c.st)/150,.05,.8);if(P.rk<3){P.ap++;return ban('Necesitas ser el número dos del régimen',2000)}
  if(R()<p){takeP(c,P,'golpe de Estado');if(c.gov!='soc')c.gov='dmi';c.st=cl(c.st-20);lg('rev','Golpe de Estado en '+c.b,`${P.n} toma el poder.`,c.id)}else{P.rk=0;P.cap=cl(P.cap-30);P.sup=cl(P.sup-30);ph('Tu golpe fracasa: eres degradado');lg('evt','Golpe fallido en '+c.b,`Fracasa un golpe de ${P.n}.`,c.id)}}
 refresh()}
function careerHtml(){const P=S.pl,c=P&&C(P.c);if(!P)return'';let h=`<h4>PERSONAJE: ${esc(P.n)}</h4>`;if(P.out||!c||!c.alive)return h+'Tu país ya no existe. Puedes continuar como observador (Modo Dios).';
 const ty=ctype(c),b=(a,l,v)=>`<button class="b" data-a="${a}"${v?` data-v="${v}"`:''}>${l}</button>`;
 h+=`<table><tr><td>País</td><td>${esc(c.b)}</td></tr><tr><td>Cargo</td><td>${esc(role(P,c))}</td></tr><tr><td>Edad</td><td>${S.y-P.by}</td></tr><tr><td>Capital político</td><td>${P.cap.toFixed(0)}</td></tr><tr><td>Apoyo institucional</td><td>${P.sup.toFixed(0)}</td></tr><tr><td>Acciones este mes</td><td>${P.ap}</td></tr></table>`;
 if(P.gov)h+=`<span class="dm">Gobiernas: usa las acciones de gobierno de abajo.${c.reg>S.y?' Regencia hasta el año '+c.reg+'.':''}${c.gov=='mco'?' Competencias limitadas: el gobierno efectivo es parlamentario.':''}</span>`;
 else{h+=b('k_speech','Discurso público')+b('k_elite','Reunirse con élites');
  if(ty=='dem'){const q=partyOf(P);h+=`<br><span class="dm">Próximas elecciones en ${Math.max(0,c.nx-abs())} meses.</span><br>`;if(!P.party)h+=`<input id="kpn" size="14" placeholder="nombre del partido"><select id="kid">${IDEO.map((x,i)=>`<option value="${i}">${x}</option>`).join('')}</select>${b('k_found','Fundar partido')}<br><select data-a="k_join"><option value="">Unirse a un partido…</option>${(c.ps||[]).map(p=>`<option value="${esc(p.n)}">${esc(p.n)} (${IDEO[p.id]})</option>`).join('')}</select>`;else h+=b('k_camp','Hacer campaña')+`<br>Partido: <b>${esc(P.party)}</b>${q?' · '+IDEO[q.id]+' · popularidad '+q.po.toFixed(0)+'%':''}`}
  else if(ty=='mab'||ty=='mco'){const m=perP(),H=c.dyns?heirs(c).map(x=>x.id):[];h+=`<br>Línea sucesoria: ${m?(H.indexOf(m.id)+1||'fuera'):'—'}<br>`+b('k_court','Ganar apoyo en la corte')+b('k_conspire','Conspirar (usurpar)')}
  else if(ty=='dic')h+=b('k_loyal','Ganar lealtad militar')+b('k_rise','Ascender')+(P.rk>=3?b('k_coup','Golpe de Estado'):'')+(P.heir?'<br>Eres el <b>heredero</b> designado.':'');
  else if(ty=='teo')h+=b('k_serve','Servir en el templo')+b('k_study','Estudiar escrituras')+b('k_rise','Ascender')+`<br><span class="dm">Religión oficial: ${RELN[c.rel]}. El consejo religioso elige al máximo dirigente.</span>`;
  else h+=b('k_hunt','Liderar una cacería')+b('k_rise','Ascender a Anciano')}
 return h+`<h4>HISTORIA PERSONAL</h4>`+(P.hist.slice(-8).reverse().map(e=>`<span class="dm">Año ${e.y}</span> ${esc(e.t)}`).join('<br>')||'—')}
function canAct(c,a){if(c.reg>S.y){ban('Regencia hasta el año '+c.reg+': aún no puedes gobernar',2200);return 0}if(c.gov=='mco'&&!['prop','srv','elec','ref','cap'].includes(a)){ban('Monarquía constitucional: el gobierno efectivo corresponde al Parlamento',2500);return 0}return 1}
function toggleMode(){if(S.mode=='pol'){S.mode='god';S.player=null}else if(S.pl&&!S.pl.out){S.mode='pol';S.player=S.pl.gov?S.pl.c:null}else polStart();refresh()}
/* pantalla inicial y selección de país */
function showStart(){$('st').style.display='flex';$('bcon').style.display=localStorage.getItem('wc_save')?'':'none'}
function pickMode(m){const sd=$('stseed').value.trim();if(sd){newWorld(sd)}S.mode=m;$('st').style.display='none';if(m=='pol')polStart();refresh()}
function polStart(){modal(`<h4>MODO POLÍTICO</h4>Tu personaje: <input id="pn" value="${esc(ldn())}" size="18"><br><br><button onclick="creatorModal(1)">Crear un país propio</button><h4>O ELEGIR UN PAÍS EXISTENTE</h4>`+alive().sort((a,b)=>b.np-a.np).map(c=>`<div class="ci" onclick="startCareer(C(${c.id}),$('pn').value);$('md').style.display='none'">${flag(c)} <b>${esc(c.b)}</b> <span class="dm">${GOV[c.gov][0]} · ${c.np} prov.</span></div>`).join(''))}
let crF=null;
function crRegen(){const g=$('cg').value;crF=genFlag(GF[g]);$('crf').innerHTML=flagSVG(crF,90,60)}
function creatorModal(pl){const n=pl&&$('pn')?$('pn').value:ldn();modal(`<h4>${pl?'CREAR TU PAÍS':'CREAR PAÍS (MODO DIOS)'}</h4><table>
 <tr><td>Nombre</td><td><input id="cn" value="${nm()}"></td></tr><tr><td>Nombre oficial</td><td><input id="co" placeholder="(automático)"></td></tr><tr><td>Capital</td><td><input id="cc" value="${cn()}"></td></tr>
 <tr><td>Religión</td><td><select id="cr">${RELN.map((x,i)=>`<option value="${i}">${x}</option>`).join('')}</select></td></tr><tr><td>Idioma</td><td><input id="cl" value="${nm().toLowerCase()}ense"></td></tr><tr><td>Cultura</td><td><select id="cu">${CULN.map((x,i)=>`<option value="${i}">${x}</option>`).join('')}</select></td></tr>
 <tr><td>Sistema político</td><td><select id="cg" onchange="crRegen()">${Object.keys(GOV).map(k=>`<option value="${k}">${GOV[k][0]}</option>`).join('')}</select></td></tr><tr><td>Ideología inicial</td><td><select id="ci">${IDEO.map((x,i)=>`<option value="${i}">${x}</option>`).join('')}</select></td></tr>
 <tr><td>Partido gobernante</td><td><input id="cp" value="${pick(PA)} ${pick(PB)}"></td></tr><tr><td>Monarca / gobernante inicial</td><td><input id="cm" value="${pick(FN)}"></td></tr><tr><td>Dictadura hereditaria</td><td><input type="checkbox" id="ch"> familia: <input id="cf" size="10" value="${pick(LN)}"></td></tr>
 <tr><td>Lema</td><td><input id="cmo" value="${mkMotto()}"></td></tr><tr><td>Bandera</td><td><span id="crf"></span> <button onclick="crRegen()">Otra bandera</button></td></tr></table><span class="dm">El himno se genera automáticamente. El país empieza con una sola provincia.</span><br><button onclick="crOk(${pl?1:0})">FUNDAR PAÍS</button>`);crRegen()}
function makeCountry(o){let p=S.provs.filter(x=>x.l&&x.o==null);p=p.length?pick(p):prov(alive().sort((a,b)=>b.np-a.np)[0]).filter(x=>true).pop();const prev=p.o,c=newC({b:o.name,gov:o.gov,cap:p.id});if(prev!=null){}
 c.cul=o.cul;c.rel=o.rel;c.off=o.off||'';c.lang=o.lang;c.mo=o.mot||mkMotto();if(crF){c.fl=crF;crF=null}if(o.hd)c.hd={sn:o.fam};assign(p,c.id);p.cu=o.cul;p.re=o.rel;p.st=60;p.cities[0].n=o.cap||p.cities[0].n;p.cities[0].cap=1;recount();
 if(GOV[o.gov][1]&&!monarchic(o.gov)){genP(c);c.ps[0].n=o.party||c.ps[0].n;c.ps[0].id=o.ide;c.ps[0].po+=12;elect(c)}
 if(monarchic(o.gov)){if(!c.dyns)startDynasty(c,1,75);const f=curMon(c);if(o.mon){f.n=o.mon;c.ld=mname(f)}}else if(!GOV[o.gov][1]){c.ld=o.mon||c.ld;c.lby=S.y-45}
 recount();lg('fund','Fundación de '+tt(c),`Se funda ${tt(c)} (${GOV[c.gov][0]}) con capital en ${p.cities[0].n}. Lema: «${c.mo}».`,c.id);return c}
function crOk(pl){const v=i=>$(i).value,o={name:v('cn').trim()||nm(),off:v('co').trim(),cap:v('cc').trim(),rel:+v('cr'),lang:v('cl'),cul:+v('cu'),gov:v('cg'),ide:+v('ci'),party:v('cp').trim(),mon:v('cm').trim(),hd:$('ch').checked,fam:v('cf').trim()||pick(LN),mot:v('cmo')},pn=$('pn')?$('pn').value:'';
 const c=makeCountry(o);$('md').style.display='none';sel.c=c.id;sel.p=c.cap;
 if(pl)startCareer(c,monarchic(o.gov)&&o.mon?o.mon:pn||ldn(),{monarch:monarchic(o.gov),heir:!!o.hd&&c.gov=='dmi'});else{S.mode=S.mode||'god'}refresh()}
