"use strict";
/* ---------- eventos ---------- */
$('ly').innerHTML=Object.keys(LAY).map(k=>`<option value="${k}">${LAY[k]}</option>`).join('');$('ly').onchange=e=>{layer=e.target.value;dirty=1};
$('sn').onchange=e=>{snapV=e.target.value===''?null:S.snaps[+e.target.value];dirty=1};
$('tp').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.s!=null){speed=+b.dataset.s;hud()}else if(b.dataset.a)act(b.dataset.a)};
$('nw').onclick=()=>{const s=$('sd').value.trim()||String(Math.random().toString(36).slice(2,8));$('sd').value=s;newWorld(s);refresh()};
$('sv').onclick=()=>ban(save()?'Partida guardada':'No se pudo guardar',1500);$('ld').onclick=()=>ban(load()?'Partida cargada':'No hay partida guardada',1500);
$('ex').onclick=()=>modal('<h4>EXPORTAR MUNDO (JSON)</h4>Copia este texto y guárdalo en un archivo.<textarea readonly onclick="this.select()">'+esc(JSON.stringify(S))+'</textarea>');
$('im').onclick=()=>{modal('<h4>IMPORTAR MUNDO</h4>Pega el JSON exportado.<textarea id="ji"></textarea><br><button id="jo">Cargar JSON</button>');$('jo').onclick=()=>{try{loadS(JSON.parse($('ji').value));$('md').style.display='none'}catch(e){ban('JSON no válido',2000)}}};
$('hs').onclick=()=>histModal();$('al').onclick=()=>alModal();$('nz').onclick=()=>newsModal();
$('lp').onclick=e=>{const d=e.target.closest('[data-c]');if(!d)return;sel.c=+d.dataset.c;const c=C(sel.c);if(c.alive){sel.p=c.cap;view.k=Math.max(view.k,1.8);const s=bs()*view.k,p=S.provs[c.cap];view.x=cv.width/2-p.x*s;view.y=cv.height/2-p.y*s}refresh()};
$('rp').onclick=e=>{const b=e.target.closest('button[data-a]');if(b)act(b.dataset.a,b.dataset.v)};$('rp').onchange=e=>{const s=e.target.closest('select[data-a]');if(s&&s.value)act(s.dataset.a,s.value)};
function resize(){const m=$('mp');cv.width=m.clientWidth;cv.height=m.clientHeight;if(!view.i){view.k=1;view.x=(cv.width-W*bs())/2;view.y=(cv.height-H*bs())/2;view.i=1}dirty=1}
addEventListener('resize',resize);
function zoomAt(f,x,y){const k=cl(view.k*f,.8,8),r=k/view.k;view.x=x-(x-view.x)*r;view.y=y-(y-view.y)*r;view.k=k;dirty=1}
cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoomAt(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
$('zi').onclick=()=>zoomAt(1.3,cv.width/2,cv.height/2);$('zo').onclick=()=>zoomAt(1/1.3,cv.width/2,cv.height/2);
let dr=null;cv.onpointerdown=e=>{dr={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y,m:0};cv.setPointerCapture(e.pointerId)};
cv.onpointermove=e=>{const r=cv.getBoundingClientRect(),s=bs()*view.k,mx=(e.clientX-r.left-view.x)/s,my=(e.clientY-r.top-view.y)/s;$('co').textContent=`X ${mx.toFixed(0)}  Y ${my.toFixed(0)}`;if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;if(Math.abs(dx)+Math.abs(dy)>4)dr.m=1;if(dr.m){view.x=dr.vx+dx;view.y=dr.vy+dy;dirty=1}};
cv.onpointerup=e=>{if(dr&&!dr.m){const r=cv.getBoundingClientRect(),s=bs()*view.k,mx=Math.floor((e.clientX-r.left-view.x)/s),my=Math.floor((e.clientY-r.top-view.y)/s);if(mx>=0&&my>=0&&mx<W&&my<H){const p=S.provs[PID[my*W+mx]];if(p.l){sel.p=p.id;if(p.o!=null)sel.c=p.o;refresh()}}}dr=null};
addEventListener('keydown',e=>{if(e.target.tagName=='INPUT'||e.target.tagName=='TEXTAREA')return;if(e.code=='Space'){e.preventDefault();speed=speed?0:1;hud()}});
let last=0,acc=0,lt=0;
function loop(t){const dt=Math.min(t-last,100);last=t;if(speed>0){acc+=dt/1000*speed;let n=0;while(acc>=1&&n<40){tick();acc--;n++}if(acc>5)acc=0}
 let fd=0;for(const k in fades){fades[k].t+=dt/900;if(fades[k].t>=1)delete fades[k];else fd=1}
 if(dirty||fd){render();draw();dirty=0}
 if(t-lt>400){lt=t;hud();bottom();if(!$('rp').contains(document.activeElement)){lists();panel()}}requestAnimationFrame(loop)}
resize();if(!load()){const s=Math.random().toString(36).slice(2,8);$('sd').value=s;newWorld(s)}refresh();requestAnimationFrame(loop);
