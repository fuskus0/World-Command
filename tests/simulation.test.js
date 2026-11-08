// Pruebas de coherencia sin navegador (DOM simulado). Uso: npm test
const fs=require('fs'),vm=require('vm'),path=require('path');
const idx=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const files=[...idx.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
const js=files.map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n').replace('requestAnimationFrame(loop);','');
const mk=()=>({style:{},dataset:{},innerHTML:'',textContent:'',value:'',width:640,height:400,clientWidth:900,clientHeight:600,
 getContext:()=>new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)})},{get:(t,k)=>k in t?t[k]:()=>{},set:()=>true}),
 getBoundingClientRect:()=>({left:0,top:0}),addEventListener(){},setPointerCapture(){},contains:()=>false,querySelectorAll:()=>[],appendChild(){},remove(){},click(){}});
const els={},ls={};
const ctx={document:{getElementById:i=>els[i]||(els[i]=mk()),createElement:()=>mk(),body:mk(),activeElement:null},console,localStorage:{getItem:k=>ls[k]??null,setItem:(k,v)=>{ls[k]=v}},addEventListener(){},requestAnimationFrame(){},setTimeout,clearTimeout,Math,JSON,Object,Set,Array,Int16Array,Uint8ClampedArray,Float32Array,DataView,ArrayBuffer,Blob,Number,String,Date};
vm.createContext(ctx);vm.runInContext(js,ctx);
const test=`(()=>{const out=[],must=(c,m)=>{if(!c)throw new Error(m)};showStart();
for(const seed of ['a1','zz9','mundo']){newWorld(seed);S.mode='god';must(alive().every(c=>c.np===1),'cada país debe empezar con 1 provincia');
 for(let i=0;i<12*100;i++){tick();if(S.bt.length)draw();if(i%120==0){
  for(const c of alive()){must(c.np>=1,'país sin provincias');must(S.provs[c.cap].o===c.id,'capital inválida');must(c.fl&&c.md.length&&c.an,'falta bandera, prensa o himno');if(monarchic(c.gov))must(curMon(c)&&curMon(c).al,'monarquía sin monarca vivo')}
  for(const t of S.tr)must(!t.on||t.ms.every(m=>C(m).alive),'organización con miembro extinto');
  for(const w of S.wars)must(!w.a.some(x=>w.d.includes(x)),'país en ambos bandos');
  for(const k in S.rel)must(S.rel[k]>=-100&&S.rel[k]<=100,'relación fuera de rango')}}
 btModal();chModal();paperModal(S.pp.length-1);atlasModal();bookModal();newsModal();alModal();dynModal(alive()[0]);lists();panel();render();draw();
 must(wavBlob(alive()[0].an).size>1000,'himno WAV vacío');
 out.push(seed+': año '+S.y+', '+alive().length+' países, '+S.bh.length+' batallas archivadas, '+S.pp.length+' periódicos, '+S.ch.length+' personajes');}
newWorld('crea');S.mode='god';const n0=alive().length,nc=makeCountry({name:'Zandria',cap:'Zan',rel:1,lang:'zandio',cul:2,gov:'rpa',ide:5,party:'Partido Zandrio',mon:'',hd:false,fam:'X',mot:'Libres siempre'});must(nc.np===1&&alive().length===n0+1,'país creado inválido');
for(const g of ['rpa','mab','mco','dmi','teo','tri','soc']){const c=g=='rpa'?nc:alive().find(x=>x.id!==nc.id);c.gov=g;c.ps=null;if(monarchic(g)&&!c.dyns)startDynasty(c,1,60);S.pl=null;S.player=null;startCareer(c,'J');const P=S.pl;
 for(let i=0;i<24;i++){P.ap=4;for(const a of['k_speech','k_elite'])careerAct(a);tick()}panel();const b=JSON.stringify(P);toggleMode();must(S.mode=='god','no pasó a Dios');toggleMode();must(S.mode=='pol'&&JSON.stringify(S.pl)==b,'se perdió el personaje');}
alive()[2].gov='rpa';let w=0,l=0;for(let t=0;t<40;t++){const c=alive().find(x=>GOV[x.gov][1]&&!monarchic(x.gov));if(!c)break;S.pl=null;S.player=null;startCareer(c,'C');const P=S.pl;if(!c.ps)genP(c);c.ps=c.ps.filter(q=>q.n!='PJ');c.ps.forEach(q=>q.po=20);c.ps.push({n:'PJ',s:'PJ',id:3,col:[1,2,3],po:t%2?58:2,ld:P.n,v:0,se:0,w:0,pl:1});P.party='PJ';P.cap=t%2?95:5;elect(c);P.gov?w++:l++}
must(w>0&&l>0,'las elecciones deben poder ganarse y perderse');
const j=JSON.stringify(S);loadS(JSON.parse(j));for(let i=0;i<24;i++)tick();
out.push('país creado y carreras: ok · elecciones ganadas/perdidas '+w+'/'+l+' · guardado '+(j.length/1e6).toFixed(2)+' MB');return out.join('\\n')})()`;
try{console.log(vm.runInContext(test,ctx));console.log('OK: todas las comprobaciones pasaron')}catch(e){console.error('FALLO:',e.stack);process.exit(1)}
