// Prueba de humo y de coherencia: carga los módulos sin navegador (DOM simulado),
// simula 5 mundos durante 150 años y comprueba invariantes. Uso: npm test
const fs=require('fs'),vm=require('vm'),path=require('path');
const idx=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const files=[...idx.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
if(!files.length)throw new Error('index.html no referencia scripts');
const js=files.map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n').replace('requestAnimationFrame(loop);','');
const mk=()=>({style:{},dataset:{},innerHTML:'',textContent:'',value:'',width:640,height:400,clientWidth:900,clientHeight:600,
 getContext:()=>new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)})},{get:(t,k)=>k in t?t[k]:()=>{},set:()=>true}),
 getBoundingClientRect:()=>({left:0,top:0}),addEventListener(){},setPointerCapture(){},contains:()=>false,querySelectorAll:()=>[]});
const els={},ls={};
const ctx={document:{getElementById:i=>els[i]||(els[i]=mk()),createElement:()=>mk(),activeElement:null},console,localStorage:{getItem:k=>ls[k]??null,setItem:(k,v)=>{ls[k]=v}},
 addEventListener(){},requestAnimationFrame(){},setTimeout,clearTimeout,Math,JSON,Object,Set,Array,Int16Array,Uint8ClampedArray,Number,String,Date};
vm.createContext(ctx);vm.runInContext(js,ctx);
const test=`(()=>{const out=[];
for(const seed of ['a1','zz9','mundo','x','k77']){newWorld(seed);
 for(let i=0;i<12*150;i++){tick();if(i%120==0){
  for(const p of S.provs)if(p.l&&(p.o==null||!C(p.o).alive))throw new Error('provincia sin propietario válido');
  for(const c of alive()){if(c.np<1)throw new Error('país sin provincias');if(S.provs[c.cap].o!==c.id)throw new Error('capital inválida');if(!c.fl||!c.md.length)throw new Error('país sin bandera o prensa');
   if(monarchic(c.gov)){const m=curMon(c);if(!m||!m.al)throw new Error('monarquía sin monarca vivo')}}
  for(const t of S.tr)if(t.on&&t.ms.some(m=>!C(m).alive))throw new Error('organización con miembro extinto');
  for(const k in S.rel)if(!(S.rel[k]>=-100&&S.rel[k]<=100))throw new Error('relación fuera de rango');
  for(const w of S.wars)if(w.a.some(x=>w.d.includes(x)))throw new Error('país en ambos bandos');}}
 render();draw();lists();panel();bottom();hud();alModal();histModal();newsModal();dynModal(alive()[0]);
 const j=JSON.stringify(S);loadS(JSON.parse(j));for(let i=0;i<24;i++)tick();
 out.push(seed+': año '+S.y+', '+alive().length+' países vivos, '+S.tr.length+' organizaciones, '+S.nz.length+' noticias, '+S.log.length+' acontecimientos');}
return out.join('\\n')})()`;
try{console.log(vm.runInContext(test,ctx));console.log('OK: todas las comprobaciones pasaron');}catch(e){console.error('FALLO:',e.stack);process.exit(1)}
