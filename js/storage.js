"use strict";
/* ---------- guardado ---------- */
function save(k='wc_save'){try{localStorage.setItem(k,JSON.stringify(S));return 1}catch(e){return 0}}
function fixS(){S.tw=S.tw||{};S.dm=S.dm||[];S.cdd=S.cdd||{};S.inb=S.inb||[];S.bt=S.bt||[];S.bh=S.bh||[];S.wh=S.wh||[];S.ch=S.ch||[];S.pp=S.pp||[];S.res=S.res||[];S.rel=S.rel||{};S.tr=S.tr||[];S.nt=S.nt||1;S.nz=S.nz||[];S.sa=S.sa||[];S.cl=S.cl||[];S.mid=S.mid||1;
 for(const c of Object.values(S.C)){if(!c.fl||!c.fl.c)c.fl=genFlag(GF[c.gov]||'new');c.fh=c.fh||[];c.flY=c.flY||c.fy;c.md=c.md||mkMedia(c);c.wf=c.wf||0;c.sv=c.sv??50;c.cr=c.cr??35;c.op=c.op||{};c.an=c.an||mkAnthem(c);c.ah=c.ah||[];c.mo=c.mo||mkMotto();c.mil=c.mil??100}
 for(const t of S.tr){t.ac=t.ac||acr(t.n);t.fl=t.fl||genFlag('org');t.fo=t.fo??t.ms[0];t.co=t.co??30;t.m0=t.m0||t.ms.length}}
function loadS(o){S=o;fixS();fades={};buildMap();recount();fillSnap();sel={c:null,p:null};snapV=null;refresh()}
function load(){try{const t=localStorage.getItem('wc_save');if(t){loadS(JSON.parse(t));return 1}}catch(e){}return 0}
