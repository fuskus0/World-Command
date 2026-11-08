"use strict";
/* ---------- himnos y descargas ---------- */
const MODES=[[0,2,4,5,7,9,11],[0,2,3,5,7,8,10],[0,2,4,7,9],[0,2,3,5,7,9,10]],MOT=[['Unidos','Fuertes','Libres','Fieles','Firmes','Con honor'],['por la patria','en la adversidad','hasta el final','ante el mundo','por siempre']];
const mkMotto=()=>pick(MOT[0])+' '+pick(MOT[1]);
const mkAnthem=c=>({sd:hs(c.b+c.id+S.seed+S.y+S.m),sc:R()*4|0,tp:68+(R()*60|0),rt:[196,220,247,262,294][R()*5|0]});
function melody(a){let s=a.sd|0;const r=()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296},sc=MODES[a.sc],N=[];let deg=0;
 const ph_=()=>{const o=[];for(let b=0;b<4;b++){for(const d of[[1,1,2],[2,1,1],[1,1,1,1],[3,1],[2,2]][r()*5|0]){deg=Math.max(-2,Math.min(sc.length+2,deg+(r()<.5?-1:1)*(r()<.7?1:2)));o.push([deg,d])}}return o},A=ph_(),B=ph_();
 [A,B,A,B].forEach(p=>p.forEach(x=>N.push(x)));N.push([0,4]);
 return N.map(([d,l])=>{const o=Math.floor(d/sc.length),k=((d%sc.length)+sc.length)%sc.length;return{f:a.rt*Math.pow(2,(sc[k]+12*o)/12),d:l*60/a.tp}})}
let AC=null;
function playAnthem(c){stopAnthem();const AX=(typeof window!=='undefined')&&(window.AudioContext||window.webkitAudioContext);if(!AX)return ban('Audio no disponible en este navegador',2000);AC=new AX();let t=AC.currentTime+.05;
 for(const n of melody(c.an)){const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=n.f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+n.d*.95);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+n.d);t+=n.d}}
function stopAnthem(){if(AC){try{AC.close()}catch(e){}AC=null}}
function pauseAnthem(){if(AC)AC.state=='running'?AC.suspend():AC.resume()}
function wavBlob(a){const sr=22050,M=melody(a),tot=M.reduce((s,n)=>s+n.d,0),buf=new Float32Array(Math.ceil((tot+.3)*sr));let t=0;
 for(const n of M){const s0=Math.floor(t*sr),len=Math.floor(n.d*sr);for(let i=0;i<len;i++){const x=i/sr,env=Math.min(1,x/.03)*Math.exp(-2.2*x/n.d),ph=(n.f*x)%1;buf[s0+i]+=(4*Math.abs(ph-.5)-1)*env*.4}t+=n.d}
 const dv=new DataView(new ArrayBuffer(44+buf.length*2)),w=(o,s)=>[...s].forEach((c,i)=>dv.setUint8(o+i,c.charCodeAt(0)));w(0,'RIFF');dv.setUint32(4,36+buf.length*2,true);w(8,'WAVEfmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,sr,true);dv.setUint32(28,sr*2,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,buf.length*2,true);
 for(let i=0;i<buf.length;i++)dv.setInt16(44+i*2,Math.max(-1,Math.min(1,buf[i]))*32767,true);return new Blob([dv],{type:'audio/wav'})}
const dl=(name,blob)=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)};
const flagFile=f=>flagSVG(f,600,400).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace(/ style="[^"]*"/,'');
function flagPNG(f,name){const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=600;c.height=400;c.getContext('2d').drawImage(img,0,0,600,400);c.toBlob(b=>dl(name+'.png',b))};img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(flagFile(f))))}
function chAnthem(c,why){(c.ah=c.ah||[]).push({an:c.an,y0:c.anY||c.fy,y1:S.y,why});c.an=mkAnthem(c);c.anY=S.y}
function media(a,c){if(a=='fsvg')dl('bandera-'+c.b+'.svg',new Blob([flagFile(c.fl)],{type:'image/svg+xml'}));else if(a=='fpng')flagPNG(c.fl,'bandera-'+c.b);else if(a=='anp')playAnthem(c);else if(a=='anpause')pauseAnthem();else if(a=='anstop')stopAnthem();else if(a=='anwav')dl('himno-'+c.b+'.wav',wavBlob(c.an))}
const dlPortrait=id=>{const p=S.ch.find(x=>x.id===id);if(p)dl('retrato-'+p.n+'.svg',new Blob([portrait(p).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ')],{type:'image/svg+xml'}))};
const dlPerson=(ci,pid)=>{const d=C(ci).dyns[C(ci).dyn],p=d.p.find(x=>x.id===pid);if(p)dl('retrato-'+p.n+'.svg',new Blob([portrait(p).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ')],{type:'image/svg+xml'}))};
