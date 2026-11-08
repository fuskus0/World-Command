"use strict";
const $=i=>document.getElementById(i),W=640,H=400,GX=16,GY=10,CW=W/GX,CH=H/GY;
let S,PID,EI,EA,EB,view={x:0,y:0,k:1,i:0},sel={c:null,p:null},speed=0,fades={},layer='pol',snapV=null,dirty=1,MSG='';let orgSel=null,nf=0;
const GOV={tri:['Gobierno tribal',0,45],mab:['Monarquía absoluta',0,55],mco:['Monarquía constitucional',1,62],rpa:['República parlamentaria',1,60],rpr:['República presidencialista',1,58],dmi:['Dictadura militar',0,46],soc:['Estado socialista (partido único)',0,55],teo:['Estado teocrático',0,52]};
const TR={tri:['mab','teo'],mab:['mco','rpa','soc','dmi'],mco:['rpa','mab'],rpa:['rpr','dmi','mco'],rpr:['dmi','rpa'],dmi:['rpa','rpr','soc'],soc:['rpa','dmi'],teo:['mab','rpa']};
const GC={tri:[140,110,70],mab:[150,60,120],mco:[170,120,170],rpa:[70,130,170],rpr:[60,160,110],dmi:[130,50,40],soc:[190,50,50],teo:[200,170,60]};
const LDT={mab:'Monarca',mco:'Monarca',tri:'Jefe tribal',rpa:'Primer ministro',rpr:'Presidente',dmi:'General',soc:'Secretario general',teo:'Sumo sacerdote'};
const PERS=['Expansionista','Pacifista','Diplomático','Aislacionista','Imperialista','Comercial','Revolucionario','Conservador'];
const WP={Expansionista:3,Imperialista:4,Revolucionario:2,Pacifista:.1,Diplomático:.5,Aislacionista:.3,Comercial:.5,Conservador:.8};
const IDEO=['Liberalismo','Conservadurismo','Socialismo','Nacionalismo','Ecologismo','Socialdemocracia','Republicanismo','Monarquismo','Federalismo','Tecnocracia'];
const CULC=[[181,101,74],[90,138,106],[201,167,79],[106,127,168],[142,106,160],[160,160,80]],CULN=['Aurenos','Valdios','Korvanos','Telmares','Ishkani','Doran'];
const RELC=[[220,190,80],[80,150,200],[90,150,70],[170,170,160],[170,90,150]],RELN=['Culto del Sol','Fe de los Ríos','Orden del Roble','Camino Austero','Los Dos Astros'];
const TERN=['Llanura','Bosque','Montaña','Desierto'],TERC=[[138,154,85],[78,107,58],[122,116,104],[181,158,102]];
const PA=['Partido','Unión','Frente','Alianza','Movimiento'],PB=['Nacional','Popular','Liberal','Social','Republicano','Tradicionalista','Verde','Federal','Renovador','Democrático','Unido','Cívico'];
const S1=['Var','Dor','Kel','Aur','Mor','Tal','Ven','Sar','Nor','Isk','Bel','Cas','Lum','Oth','Zan','Vel','Tor','Ald'],S2=['encia','vania','oria','esia','ania','land','mark','dia','ria','gar'],S3=['burgo','polis','ton','ara','ford','hallen','ena','ia','grado'];
const FN=['Aldric','Marta','Ivo','Selene','Tomas','Lucan','Berta','Orlan','Ilse','Dario','Neva','Cirilo'],LN=['Varga','Montés','Kerrin','Duval','Ostrow','Belmar','Tarsis','Lorca','Hendel','Quiroz'];
const MES=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const LAY={pol:'Político',prov:'Provincial',pob:'Población',eco:'Economía',cul:'Cultural',rel:'Religioso',ide:'Ideologías',ali:'Diplomático',org:'Organizaciones',est:'Estabilidad',con:'Conflictos',ter:'Relieve'};
const REAS=['Disputa fronteriza','Rivalidad histórica','Control de recursos','Ambición expansionista','Reivindicación territorial','Crisis diplomática'];
function R(){let t=(S.rs=(S.rs+0x6D2B79F5)|0);t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
const hs=s=>{let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}return h>>>0};
const pick=a=>a[R()*a.length|0],cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)),abs=()=>S.y*12+S.m,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nm=()=>pick(S1)+pick(S2),cn=()=>pick(S1)+pick(S3),ldn=()=>pick(FN)+' '+pick(LN),C=id=>S.C[id],alive=()=>Object.values(S.C).filter(c=>c.alive),prov=c=>S.provs.filter(p=>p.o===c.id);
function hsl(h,s,l){s/=100;l/=100;const f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-s*Math.min(l,1-l)*Math.max(-1,Math.min(k-3,9-k,1))))};return[f(0),f(8),f(4)]}
const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
function tt(c){return(c.np>=12&&['mab','mco','dmi'].includes(c.gov)?'Imperio de ':{mab:'Reino de ',mco:'Reino de ',tri:'Confederación de ',teo:'Estado Teocrático de ',soc:'República Socialista de ',dmi:'Junta Militar de '}[c.gov]||'República de ')+c.b}
const flag=c=>flagSVG(c.fl,22,14),flagOld=c=>`<i class="fl" style="background:linear-gradient(${c.f[2]}deg,${rgb(c.f[0])} 33%,${rgb(c.f[1])} 33% 66%,${rgb(c.col)} 66%)"></i>`;
function lg(ty,t,d,c,x){const id=S.lid=(S.lid||0)+1;S.log.push({id,y:S.y,m:S.m,ty,t,d,c,pr:x?[x.a&&x.a.b,x.d&&x.d.b,x.who].filter(Boolean):[]});CUR=id;press(ty,t,d,c,x);if(S.log.length>3000)S.log.shift();if(['guerra!','paz','rev','ind'].includes(ty))ban(t)}
function ban(h,ms=4500){const b=$('bn');b.innerHTML=h;b.style.display='block';clearTimeout(ban.t);ban.t=setTimeout(()=>b.style.display='none',ms)}
function modal(h){$('md').innerHTML='<button onclick="$(\'md\').style.display=\'none\'" style="float:right">Cerrar</button>'+h;$('md').style.display='block'}
