// ======================= wildflowers & cottage gardens (burn -> scorched -> regrow / replant) =======================
const FLORA_PAL={
  meadow:{c:['#e8322a','#ffd23a','#ffffff','#b46aff','#ff8a2a','#5aa0ff','#ff6aa0'],leaf:'#4e8a32',n:[12,22],w:[18,34],sz:1.5},
  forest:{c:['#5a6aff','#7d6cf0','#f4f4ff','#d860b0','#fff08a'],leaf:'#3a6a2a',n:[10,18],w:[16,30],sz:1.4},
  hills:{c:['#b05ab0','#d080d0','#f0d030','#9a4aa0','#ffffff'],leaf:'#5a7a3a',n:[12,20],w:[18,32],sz:1.3},
  alpine:{c:['#f4f4ea','#2a5aff','#ff80b0','#ffe060','#8a6aff'],leaf:'#5f7f4a',n:[8,14],w:[12,22],sz:1.1},
  desert:{c:['#ff6a3a','#ffb020','#e050a0','#ffe080'],leaf:'#7a8a4a',n:[3,6],w:[10,18],sz:1.6},
  coast:{c:['#ff90c0','#ffffff','#ffb0d8','#f0e060'],leaf:'#5a8a4a',n:[8,14],w:[14,26],sz:1.2},
  oasis:{c:['#ff4a6a','#ffd23a','#ffffff','#ff8a2a'],leaf:'#3e8a3a',n:[10,16],w:[14,26],sz:1.5}};
let FLORA=[],GARDENS=[],FLORA_BASE=null,FL_ACTIVE=new Set(),FL_SPR={};
function floraPal(x,y){const k=regionKey(x,y);
  if(k==='mountain'){if(inSea(x,y))return null;const low=inRange(x,y)?(x<RANGE0+220||x>RANGE1-220):y>frostY(x)-450;return rnd()<(low?.3:.03)?'alpine':null;}
  if(k==='desert'){if(d2(x,y,OASIS.x,OASIS.y)<OASIS.rx*1.9)return rnd()<.7?'oasis':null;return rnd()<.07?'desert':null;}
  if(k==='forest'){const e=Math.abs(x-forestX(y));return rnd()<(e<380?.5:.07)?'forest':null;}
  if(k==='farm'||k==='south')return rnd()<.62?'meadow':null;
  if(k==='hills')return rnd()<.55?(rnd()<.6?'hills':'meadow'):null;
  if(k==='lake')return rnd()<.4?'meadow':null;
  if(k==='castle')return rnd()<.3?'meadow':null;
  if(k==='coast'||k==='isle')return rnd()<.3?'coast':null;
  return null;}
function inFieldRect(x,y,m){for(const f of FARMS){for(const r of[f.field,f.pen])if(x>r.x-m&&x<r.x+r.w+m&&y>r.y-m&&y<r.y+r.h+m)return true;}
  if(typeof PADDOCKS!=='undefined')for(const r of PADDOCKS)if(x>r.x-m&&x<r.x+r.w+m&&y>r.y-m&&y<r.y+r.h+m)return true;return false;}
function floraSpotOK(x,y,m){if(roadWet(x,y,m)||castleBox(x,y)||roadNear(x,y,m*.5)||inFieldRect(x,y,m))return false;
  for(const s of structures)if(Math.abs(s.x-x)<60&&Math.abs(s.y-y)<60&&d2(x,y,s.x,s.y)<(KDEF[s.kind]?.sz||30)+m+6)return false;return true;}
function floraSprite(pal,v){const key=pal+v;if(FL_SPR[key])return FL_SPR[key];const P=FLORA_PAL[pal],W=Math.round(P.w[0]+(P.w[1]-P.w[0])*((v%4)/3)),H=Math.round(W*.6)+8;
  const c=document.createElement('canvas');c.width=W*2+8;c.height=H*2+8;const g=c.getContext('2d');g.translate(W+4,H+4);
  const n=P.n[0]+((v*7)%(P.n[1]-P.n[0]+1)),main=P.c[v%P.c.length],alt=P.c[(v*3+1)%P.c.length];let s=v*9301+49297;const r=()=>((s=(s*9301+49297)%233280)/233280);
  for(let i=0;i<n*1.6;i++){const a=r()*TAU,d=Math.sqrt(r()),x=Math.cos(a)*W*d,y=Math.sin(a)*H*.55*d;g.strokeStyle=P.leaf;g.lineWidth=1;g.beginPath();g.moveTo(x,y+2);g.lineTo(x+(r()-.5)*2,y-2.5);g.stroke();}
  for(let i=0;i<n;i++){const a=r()*TAU,d=Math.sqrt(r()),x=Math.cos(a)*W*d,y=Math.sin(a)*H*.55*d-2,col=r()<.7?main:alt,z=P.sz*(.8+r()*.5);
    g.strokeStyle=P.leaf;g.lineWidth=.8;g.beginPath();g.moveTo(x,y+3.5);g.lineTo(x,y);g.stroke();g.fillStyle=col;
    for(let k=0;k<5;k++){const b=k/5*TAU;g.beginPath();g.arc(x+Math.cos(b)*z,y+Math.sin(b)*z*.8,z*.8,0,TAU);g.fill();}
    g.fillStyle=col==='#ffd23a'||col==='#ffe060'?'#a0601a':'#ffe27a';g.beginPath();g.arc(x,y,z*.55,0,TAU);g.fill();}
  return FL_SPR[key]={c,W:W+4,H:H+4};}
function buildFloraBase(){if(FLORA_BASE)return FLORA_BASE;const t0=performance.now(),out=[];let tries=0;
  while(tries<12000&&out.length<1750){tries++;const x=R(WX0+300,WX1-300),y=R(WY0+300,WY1-300);const pal=floraPal(x,y);if(!pal)continue;
    if(!floraSpotOK(x,y,22))continue;out.push({x,y,pal,v:RI(0,11)});
    // patches cluster: sometimes add 1-3 neighbours of the same kind
    if(pal!=='desert'&&rnd()<.55)for(let k=RI(1,3);k>0;k--){const nx=x+R(-70,70),ny=y+R(-45,45);if(floraSpotOK(nx,ny,22))out.push({x:nx,y:ny,pal,v:RI(0,11)});}}
  FLORA_BASE=out;FLORA_BASE.ms=Math.round(performance.now()-t0);return out;}
function placeGardens(){GARDENS=[];
  const ok=(x,y,w,h,inCastle)=>{if(roadWet(x,y,w*.7)||(!inCastle&&castleBox(x,y))||roadNear(x,y,h*.9)||inFieldRect(x,y,24))return false;
    for(const s of structures)if(s.state!=='ruin'&&Math.abs(s.x-x)<120&&Math.abs(s.y-y)<120&&d2(x,y,s.x,s.y)<(KDEF[s.kind]?.sz||30)+w*.6)return false;
    for(const g of GARDENS)if(d2(x,y,g.x,g.y)<w+20)return false;return true;};
  VILLAGES.forEach((V,vi)=>{const huts=structures.filter(s=>s.kind==='hut'&&s.v===vi);const want=Math.min(V.desert?2:4,Math.max(1,Math.floor(huts.length/2)));let got=0;
    for(const h of huts){if(got>=want)break;for(const [ox,oy] of[[52,14],[-52,14],[0,50],[46,46],[-46,46]]){const w=V.desert?36:R(40,50),hh=R(26,32),x=h.x+ox,y=h.y+oy;
      if(ok(x,y,w,hh)){GARDENS.push({x,y,w,h:hh,kind:V.desert?'veg':(got%2?'flower':'veg'),v:vi,st:0,g:1,t:0,seed:RI(0,999)});got++;break;}}}});
  // the castle's kitchen and herb gardens, just outside the curtain wall
  let cg=0;for(const [x,y,ins] of[[1720,250,1],[1250,300],[1950,300],[1500,150,1],[1250,200],[1950,200],[1380,420],[1820,420]].map(([x,y,i])=>[x+CDX,y+CDY,i])){if(cg>=4)break;if(ok(x,y,ins?40:48,ins?26:30,ins)){GARDENS.push({x,y,w:ins?40:48,h:ins?26:30,kind:cg%2?'flower':'veg',v:-1,castle:true,st:0,g:1,t:0,seed:RI(0,999)});cg++;}}}
function initFlora(){const B=buildFloraBase();FLORA=B.map(o=>({x:o.x,y:o.y,pal:o.pal,v:o.v,st:0,g:1,t:0}));FL_ACTIVE=new Set();placeGardens();}
// ----- fire -----
function burnPatch(f){if(f.st===1)return;f.st=1;f.t=R(.8,1.6);FL_ACTIVE.add(f);}
function burnGarden(g){if(g.st===1)return;g.st=1;g.t=R(2,3);FL_ACTIVE.add(g);addAlarm(.4);if(g.g>.3)float(g.x,g.y-30,g.kind==='veg'?'The vegetable patch is ablaze!':'The flower garden burns!','#ffb050');}
function fireFlora(ox,oy){const r=DR.fireRange+30;
  for(const f of FLORA)if(f.st!==1&&!(f.st===2&&f.g<.25)&&Math.abs(f.x-ox)<r&&Math.abs(f.y-oy)<r&&inFire(f.x,f.y,ox,oy))burnPatch(f);
  for(const g of GARDENS)if(g.st!==1&&!(g.st===2&&g.g<.25)&&Math.abs(g.x-ox)<r&&Math.abs(g.y-oy)<r&&inFire(g.x,g.y,ox,oy))burnGarden(g);}
function spreadFlora(b){for(const f of FLORA)if(f.st===0&&Math.abs(f.x-b.x)<55&&Math.abs(f.y-b.y)<45&&rnd()<.4)burnPatch(f);
  for(const g of GARDENS)if(g.st===0&&Math.abs(g.x-b.x)<70&&Math.abs(g.y-b.y)<60&&rnd()<.4)burnGarden(g);}
function updFlora(dt){if(!FL_ACTIVE.size)return;for(const o of FL_ACTIVE){const gd=o.w!==undefined;
  if(o.st===1){o.t-=dt;if(rnd()<dt*(gd?10:5))flame(o.x+R(-(o.w||20)/2,(o.w||20)/2),o.y+R(-6,6),R(6,gd?24:14));if(rnd()<dt*2)smoke(o.x,o.y-10);
    if(o.t<=0){o.st=2;o.g=0;o.t=gd?R(30,40):R(18,30);
      // fire creeps to neighbouring patches / gardens
      for(const f of FLORA)if(f.st===0&&Math.abs(f.x-o.x)<60&&Math.abs(f.y-o.y)<45&&rnd()<.3)burnPatch(f);
      if(gd)for(const s of structures)if(s.state!=='ruin'&&!s.fire&&!stoneish(s)&&d2(s.x,s.y,o.x,o.y)<60&&rnd()<.25)s.fire=1;}}
  else if(o.st===2){if(o.t>0){o.t-=dt;if(o.t<=0&&gd&&Math.abs(o.x-D.x)<900&&Math.abs(o.y-D.y)<700)float(o.x,o.y-26,o.castle?'The castle gardeners replant':'Villagers replant the garden','#c8f0a0');continue;}
    o.g=Math.min(1,o.g+dt/(gd?50:65));if(o.g>=1){o.st=0;FL_ACTIVE.delete(o);}}}}
// ----- drawing -----
function drawGardenPlants(g,gc,G1,lo){const w=g.w,h=g.h,rows=Math.max(3,Math.round(h/7)),cols=Math.max(4,Math.round(w/8));let s=g.seed*9301+7;const r=()=>((s=(s*9301+49297)%233280)/233280);
  for(let j=0;j<rows;j++){const y=-h/2+5+j*(h-9)/(rows-1);gc.fillStyle='rgba(60,35,15,.45)';gc.fillRect(-w/2+3,y+1.5,w-6,1.2);
    for(let i=0;i<cols;i++){const x=-w/2+5+i*(w-10)/(cols-1)+(r()-.5);if(r()<.08)continue;const z=G1*(.8+r()*.4);if(z<.08)continue;
      if(g.kind==='veg'){const t=(j+g.seed)%3;
        if(t===0){gc.fillStyle='#4f8f34';gc.beginPath();gc.arc(x,y,2.8*z,0,TAU);gc.fill();if(!lo){gc.fillStyle='#8ac860';gc.beginPath();gc.arc(x-.6,y-.6,1.5*z,0,TAU);gc.fill();}}
        else if(t===1){gc.strokeStyle='#5aa040';gc.lineWidth=1;for(let k=-1;k<=1;k++){gc.beginPath();gc.moveTo(x,y+1);gc.lineTo(x+k*1.8*z,y-3.2*z);gc.stroke();}if(!lo&&z>.6){gc.fillStyle='#e8782a';gc.fillRect(x-.8,y+.4,1.6,1.4);}}
        else{gc.strokeStyle='#7a5a32';gc.lineWidth=.9;gc.beginPath();gc.moveTo(x,y+1);gc.lineTo(x,y-6*z);gc.stroke();gc.fillStyle='#3f8a2e';gc.beginPath();gc.arc(x,y-3*z,1.8*z,0,TAU);gc.fill();if(!lo&&z>.7){gc.fillStyle='#d03a2a';gc.beginPath();gc.arc(x+1.2,y-1.5,1,0,TAU);gc.fill();}}}
      else{const cs=['#ff5a7a','#ffd23a','#ffffff','#b46aff','#ff8a2a','#e8322a'];gc.fillStyle='#4e8a32';gc.beginPath();gc.arc(x,y,2*z,0,TAU);gc.fill();if(z>.45){gc.fillStyle=cs[(j*2+i+g.seed)%cs.length];gc.beginPath();gc.arc(x,y-1.5,1.6*z,0,TAU);gc.fill();if(!lo){gc.fillStyle='#ffe27a';gc.beginPath();gc.arc(x,y-1.5,.6*z,0,TAU);gc.fill();}}}}}}
function gardenSprite(g){const stage=g.st===2?(g.t>0?-1:g.g<.4?1:g.g<.8?2:3):3,lo=!GFX_HI,key=stage+(lo?'l':'h');if(g._k===key&&g._c)return g._c;
  const c=g._c||document.createElement('canvas');c.width=g.w+10;c.height=g.h+14;const gc=c.getContext('2d');gc.clearRect(0,0,c.width,c.height);gc.translate(c.width/2,c.height/2+2);const w=g.w,h=g.h;
  gc.fillStyle='rgba(0,0,0,.18)';gc.fillRect(-w/2+2,-h/2+3,w,h);
  gc.fillStyle=stage<0?'#2a1f18':'#6b4a2a';gc.fillRect(-w/2,-h/2,w,h);
  if(stage<0){gc.fillStyle='rgba(120,110,100,.6)';let s=g.seed;for(let i=0;i<14;i++){s=(s*9301+49297)%233280;gc.fillRect(-w/2+(s%w),-h/2+((s>>3)%h),2,1.5);}}
  else drawGardenPlants(g,gc,[0,.35,.7,1][stage],lo);
  // wattle fence with posts (charred & broken after a fire)
  const fc=stage<0?'#2b2420':'#8a6a3a';gc.strokeStyle=fc;gc.lineWidth=1.6;gc.beginPath();
  if(stage<0){gc.moveTo(-w/2,-h/2);gc.lineTo(-w/2+w*.3,-h/2);gc.moveTo(w/2,-h/2+h*.4);gc.lineTo(w/2,h/2);gc.lineTo(w/2-w*.35,h/2);}
  else{gc.moveTo(-w/2+8,h/2);gc.lineTo(-w/2,h/2);gc.lineTo(-w/2,-h/2);gc.lineTo(w/2,-h/2);gc.lineTo(w/2,h/2);gc.lineTo(-w/2+16,h/2);}gc.stroke();
  if(!lo||stage<0){gc.fillStyle=stage<0?'#1e1a18':'#6b4a26';for(let x=-w/2;x<=w/2+.1;x+=w/6){if(stage<0&&((x*7|0)%3===0))continue;gc.fillRect(x-1,-h/2-4,2,5);gc.fillRect(x-1,h/2-4,2,5);}
    for(let y=-h/2+h/3;y<h/2-1;y+=h/3){gc.fillRect(-w/2-1,y-4,2,5);gc.fillRect(w/2-1,y-4,2,5);}}
  g._c=c;g._k=key;return c;}
function drawFlora(x0,y0,x1,y1){const lo=!GFX_HI;let i=0;
  for(const f of FLORA){i++;if(f.x<x0-40||f.x>x1+40||f.y<y0-30||f.y>y1+30)continue;if(lo&&(i&1)&&f.st===0)continue;
    const S=floraSprite(f.pal,f.v);
    if(f.st===0)ctx.drawImage(S.c,f.x-S.W,f.y-S.H);
    else{const sc=f.st===1?1:1-f.g;ell(f.x,f.y,S.W*.7,S.H*.55,`rgba(32,24,18,${.55*sc})`);
      if(f.st===1){ctx.globalAlpha=.6;ctx.drawImage(S.c,f.x-S.W,f.y-S.H);ctx.globalAlpha=1;}
      else if(f.g>.15){const k=f.g;ctx.globalAlpha=k;ctx.drawImage(S.c,f.x-S.W*k,f.y-S.H*k,S.c.width*k,S.c.height*k);ctx.globalAlpha=1;}}}
  for(const g of GARDENS){if(g.x<x0-60||g.x>x1+60||g.y<y0-40||g.y>y1+40)continue;const c=gardenSprite(g);ctx.drawImage(c,g.x-c.width/2,g.y-c.height/2-2);
    if(g.st===1)ell(g.x,g.y,g.w*.5,g.h*.45,'rgba(255,120,30,.25)');}}
