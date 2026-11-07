"use strict";
/* ---------- flags ---------- */
const PAL=[['#c0392b','#f1e9d2','#1f3a6e'],['#2e6b3a','#f1e9d2','#c9a227'],['#1f3a6e','#f1e9d2','#9b2d20'],['#222','#c9a227','#9b2d20'],['#6a3d8f','#f1e9d2','#c9a227'],['#0e6b6b','#f1e9d2','#c0392b'],['#8a3b12','#e8c872','#2e4a2e'],['#2b2b5e','#d8d8d8','#b8860b'],['#a8322a','#e8c872','#1d4a2a'],['#274c77','#e8c872','#d8d8d8']],IV='#f1e9d2';
const GF={tri:'new',mab:'mon',mco:'mon',rpa:'rep',rpr:'rep',dmi:'dic',soc:'soc',teo:'teo'};
const sigF=f=>f.lay+f.sym+f.c.join();
function genFlag(mode,mx){const used=new Set(Object.values(S.C).filter(c=>c.alive&&c.fl&&c.fl.c).map(c=>sigF(c.fl)));let f;
 for(let i=0;i<40;i++){let P=pick(PAL).slice().sort(()=>R()-.5),lay=pick(['h3','v3','h2','v2','diag','cross','plain','nordic','tri2']),sym=pick([null,'star','circle','cross','shield','sun','diamond','stars3']);
  if(mode=='rep'){lay=pick(['h3','v3','tri2','h3']);sym=pick([null,'star','sun'])}
  else if(mode=='mon'){lay=pick(['plain','h2','nordic','v2','diag']);sym=pick(['shield','cross','crown','sun'])}
  else if(mode=='dic'){P=pick([['#222','#9b2d20','#c9a227'],['#5a1a1a','#222','#d8d8d8'],['#2b2b2b','#c9a227','#9b2d20']]);lay=pick(['plain','diag','h2']);sym=pick(['star','diamond','cross'])}
  else if(mode=='soc'){P=['#b02a20','#c9a227',IV];lay=pick(['plain','h2','tri2']);sym=pick(['star','stars3','sun'])}
  else if(mode=='teo'){lay=pick(['plain','cross','h2']);sym=pick(['sun','circle','cross'])}
  else if(mode=='org'){lay=pick(['plain','h2','nordic']);sym=pick(['stars3','circle','star','sun'])}
  if(mx){P=[mx[0].c[0],mx[1].c[1],mx[0].c[2]];sym=mx[1].sym||sym}
  f={c:P,lay,sym,bd:R()<.25};if(!used.has(sigF(f)))break}return f}
const starP=r=>Array.from({length:10},(_,i)=>{const q=i%2?r*.4:r,a=-Math.PI/2+i*Math.PI/5;return(Math.cos(a)*q).toFixed(1)+','+(Math.sin(a)*q).toFixed(1)}).join(' ');
function symSVG(s,x,y,k,fl,st){const g=b=>`<g transform="translate(${x},${y}) scale(${k})" fill="${fl}" stroke="${st}" stroke-width="1">${b}</g>`;
 switch(s){case'star':return g(`<polygon points="${starP(10)}"/>`);case'circle':return g('<circle r="8"/>');case'cross':return g('<rect x="-2.5" y="-9" width="5" height="18"/><rect x="-9" y="-2.5" width="18" height="5"/>');
 case'shield':return g('<path d="M-7-9h14v9q0 7-7 10q-7-3-7-10z"/>');case'diamond':return g('<polygon points="0,-10 8,0 0,10 -8,0"/>');
 case'sun':return g('<circle r="4.5"/>'+[0,1,2,3,4,5,6,7].map(i=>`<line x1="0" y1="-7" x2="0" y2="-11" transform="rotate(${i*45})"/>`).join(''));
 case'stars3':return g([-9,0,9].map(i=>`<polygon points="${starP(4)}" transform="translate(${i},0)"/>`).join(''));
 case'crown':return g('<polygon points="-9,6 -9,-5 -4.5,0 0,-7 4.5,0 9,-5 9,6"/>')}return''}
function flagSVG(f,w=22,h=14){if(!f||!f.c)return'';const[a,b,c]=f.c,r=(x,y,w,h,k)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k}"/>`;
 let s=`<svg class="fl" viewBox="0 0 60 40" width="${w}" height="${h}" preserveAspectRatio="none" style="vertical-align:middle;border:1px solid #000">`,cb=b,cx_=30,k=1;
 switch(f.lay){case'h3':s+=r(0,0,60,14,a)+r(0,13,60,14,b)+r(0,26,60,14,c);break;case'v3':s+=r(0,0,21,40,a)+r(20,0,21,40,b)+r(40,0,20,40,c);break;case'h2':s+=r(0,0,60,21,a)+r(0,20,60,20,b);break;case'v2':s+=r(0,0,31,40,a)+r(30,0,30,40,b);break;
 case'diag':s+=r(0,0,60,40,a)+`<polygon points="0,40 0,27 47,0 60,0 60,13 13,40" fill="${b}"/>`;cb=a;break;case'cross':s+=r(0,0,60,40,a)+r(0,16,60,8,b)+r(26,0,8,40,b);break;
 case'nordic':s+=r(0,0,60,40,a)+r(14,0,10,40,b)+r(0,15,60,10,b)+r(17,0,4,40,c)+r(0,18,60,4,c);cx_=19;cb=c;break;case'tri2':s+=r(0,0,60,40,a)+`<polygon points="0,0 34,20 0,40" fill="${b}"/>`;cx_=11;k=.55;break;default:s+=r(0,0,60,40,a);cb=a}
 if(f.sym){const sf=cb===IV?c:IV;s+=symSVG(f.sym,cx_,20,k,sf,c===sf?a:c)}
 if(f.bd)s+=`<rect x="1.5" y="1.5" width="57" height="37" fill="none" stroke="${b}" stroke-width="3"/>`;return s+'</svg>'}
function chFlag(c,why,mode,mx){c.fh.push({fl:c.fl,y0:c.flY,y1:S.y,why});c.fl=genFlag(mode,mx);c.flY=S.y;lg('flag','Nueva bandera: '+c.b,`${tt(c)} adopta una nueva bandera (${why}).`,c.id)}
function chGov(c,o,g,why){if(GF[o]!==GF[g])chFlag(c,why,GF[g]);if(monarchic(g)&&!monarchic(o))startDynasty(c,1,50);else if(!monarchic(g)&&monarchic(o))endReign(c,'fin de la monarquía')}
