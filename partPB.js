// ======================= plant fire everywhere: wild foliage of EVERY biome joins the tree/grass burn & spread system =======================
// Burnable foliage kept in DECOR: savanna acacias + grass tufts, jungle canopy trees (with vines) + giant ferns, desert cacti + scrub,
// oasis/town/beach palms, mountain pines, island grass and Dragon Peaks heather. Water plants (reeds round rivers, lakes, waterholes) never burn.
// Same life cycle as forest trees: ignite -> burn (flames + smoke, spreads to trees, crops, wildflowers, gardens and other plants) -> burnt -> regrow as a sapling.
const PB_K={acacia:{hp:30,re:80,big:1},jtree:{hp:36,re:90,big:1},palm:{hp:26,re:75,big:1},pine:{hp:30,re:80,big:1},
  cactus:{hp:16,re:60},scrub:{hp:6,re:40},tuft:{hp:4,re:30},fern:{hp:6,re:35},grass:{hp:4,re:30},heather:{hp:5,re:40}};
const PB_WATER=new Set(['reed']); // never burnable
let PB=[],PB_GRID=new Map(),PB_ACT=new Set();const PB_C=160;
function pbKey(i,j){return(i+4000)*10000+(j+4000);}
function pbAddFoliage(){if(DECOR.some(o=>o.pbNew))return;let s=777;const r=()=>{s=Math.imul(s^s>>>15,2246822519)+0x9E3779B9|0;return((s^s>>>13)>>>0)/4294967296;},Rr=(a,b)=>a+r()*(b-a);
  // Dragon Peaks: hardy mountain heather between the crags
  for(let i=0;i<90;i++){const x=Rr(WD_E.x-WD_E.rx,WD_E.x+WD_E.rx),y=Rr(WD_E.y-WD_E.ry,WD_E.y+WD_E.ry);if(!inDP(x,y,.92)||inWater(x,y))continue;
    if(WD_CRAGS.some(c=>d2(x,y,c.x,c.y)<110)||WD_NESTS.some(n=>d2(x,y,n.x,n.y)<120))continue;DECOR.push({k:'heather',x,y,s:Rr(.8,1.3),pbNew:1});}
  // desert: dry scrub bushes
  for(let i=0;i<140;i++){const x=Rr(DESX0+760,RANGE0-60),y=Rr(-120,4200);if(regionKey(x,y)!=='desert'||inWater(x,y)||d2(x,y,DTOWN.x,DTOWN.y)<330)continue;DECOR.push({k:'scrub',x,y,s:Rr(.7,1.2),pbNew:1});}
  // eastern beach: a row of coconut palms on the sand
  for(let i=0;i<40;i++){const y=Rr(-200,4100),x=coastX(y)-Rr(90,210);if(regionKey(x,y)!=='coast'||inWater(x,y)||inSea(x,y))continue;DECOR.push({k:'palm',x,y,s:Rr(.9,1.25),beach:1,pbNew:1});}}
function pbIndex(){PB=[];PB_GRID=new Map();PB_ACT=new Set();
  for(const o of DECOR){if(!PB_K[o.k]||PB_WATER.has(o.k))continue;o.pst='ok';o.fire=0;o.php=0;o.re=0;o.g=1;PB.push(o);
    const k=pbKey(Math.floor(o.x/PB_C),Math.floor(o.y/PB_C));let a=PB_GRID.get(k);if(!a)PB_GRID.set(k,a=[]);a.push(o);}}
function pbNear(x,y,r,fn){const i0=Math.floor((x-r)/PB_C),i1=Math.floor((x+r)/PB_C),j0=Math.floor((y-r)/PB_C),j1=Math.floor((y+r)/PB_C);
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const a=PB_GRID.get(pbKey(i,j));if(a)for(const o of a)if(Math.abs(o.x-x)<r&&Math.abs(o.y-y)<r)fn(o,d2(o.x,o.y,x,y));}}
function pbIgnite(o){if(!o||!PB_K[o.k]||o.pst!=='ok'||o.fire)return false;if(o.g<.25)return false; // a fresh sprout is too green to catch
  o.fire=1;o.php=PB_K[o.k].hp*(o.g<1?.6:1);PB_ACT.add(o);G.plantFires=(G.plantFires||0)+1;return true;}
function pbUpd(dt){if(!PB_ACT.size)return;for(const o of[...PB_ACT]){const K=PB_K[o.k];
  if(o.fire){o.php-=6*dt;const z=K.big?36*(o.s||1):10;if(rnd()<dt*(K.big?6:4))flame(o.x,o.y-z*.5,R(z*.3,z));if(K.big&&rnd()<dt*3)smoke(o.x,o.y-30);
    if(rnd()<dt*1.6){spreadFlora(o);const near=(t,r)=>Math.abs(t.x-o.x)<r&&Math.abs(t.y-o.y)<r&&d2(t.x,t.y,o.x,o.y)<r;
      for(const t of trees)if(t.state==='ok'&&!t.fire&&near(t,48)&&rnd()<.5)t.fire=1;
      for(const c of cells)if(!c.burnt&&!c.fire&&c.growth>.15&&near(c,32))c.fire=0.01;
      if(K.big)for(const st of structures)if(st.state!=='ruin'&&!st.fire&&!stoneish(st)&&near(st,62)&&rnd()<.35)st.fire=1;}
    if(o.php<=0){o.fire=0;o.pst='burnt';o.re=K.re;G.stats.plants=(G.stats.plants||0)+1;scorch(o.x,o.y,K.big?16:9);}}
  else if(o.pst==='burnt'){o.re-=dt;if(o.re<=0){o.pst='ok';o.g=.3;}}
  else if(o.g<1){o.g=Math.min(1,o.g+dt*.02);}
  else PB_ACT.delete(o);}}
// ---- hook into every fire source ----
{const _af=applyFire;applyFire=function(ox,oy,dt){_af.apply(this,arguments);
  pbNear(ox,oy,DR.fireRange+40,o=>{if(!inFire(o.x,o.y,ox,oy))return;if(!o.fire)pbIgnite(o);else o.php-=DR.fireDps*.4*(dt||0);});};}
{const _sf=spreadFlora;spreadFlora=function(b){_sf.apply(this,arguments);pbNear(b.x,b.y,56,(o,d)=>{if(o!==b&&d<52&&rnd()<.45)pbIgnite(o);});};}
{const _ls=lavaSplash;lavaSplash=function(x,y){_ls.apply(this,arguments);if(inWater(x,y)&&!onBridge(x,y))return;
  pbNear(x,y,90,(o,d)=>{if(d<80+(PB_K[o.k].big?8:0)){if(pbIgnite(o)||o.fire)o.php-=30;}});};}
{const _uv=updVolcano;updVolcano=function(dt){_uv.apply(this,arguments);if(typeof LPUDDLES!=='undefined')for(const p of LPUDDLES)if(p.t>.6)pbNear(p.x,p.y,p.r+12,(o,d)=>{if(d<p.r+8)pbIgnite(o);});};}
{const _uf=updFire;updFire=function(dt){_uf.apply(this,arguments);pbUpd(dt);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);pbAddFoliage();pbIndex();G.plantFires=0;return r;};}
// ---- drawing: burning glow, charred remains, regrowing saplings, plus the new heather/scrub ----
function drawPBNew(o){const x=o.x,y=o.y,s=o.s||1;
  if(o.k==='heather'){ell(x,y+2,13*s,4*s,'rgba(0,0,0,.2)');for(let i=0;i<5;i++){const a=i*1.3;ell(x+Math.cos(a)*7*s,y-4*s+Math.sin(a)*2*s,6*s,5*s,i%2?'#5a6a3a':'#4a5a32');}
    for(let i=0;i<6;i++)ell(x+Math.cos(i*2.1)*8*s,y-7*s+Math.sin(i*1.7)*3*s,1.8*s,1.8*s,i%2?'#c070d0':'#e090e8');return true;}
  if(o.k==='scrub'){ell(x,y+2,14*s,4*s,'rgba(0,0,0,.2)');ctx.strokeStyle='#8a7048';ctx.lineWidth=1.4;for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.35;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*14*s,y+Math.sin(a)*12*s);ctx.stroke();}
    for(let i=0;i<5;i++)ell(x+(i-2)*5*s,y-9*s+Math.abs(i-2)*2*s,5*s,4*s,i%2?'#8a9a5a':'#9aa868');return true;}
  return false;}
function drawPBBurnt(o){const x=o.x,y=o.y,s=o.s||1,K=PB_K[o.k];
  if(K.big){ell(x,y+2,12*s,4*s,'rgba(20,14,10,.5)');line(x,y,x-2*s,y-26*s,'#1a1410',4*s);line(x-2*s,y-18*s,x-9*s,y-26*s,'#1f1712',2*s);line(x-1*s,y-22*s,x+7*s,y-30*s,'#1f1712',2*s);return;}
  if(o.k==='cactus'){ell(x,y+1,7*s,3*s,'#1f1712');rect(x-3*s,y-14*s,6*s,14*s,'#2a2018');return;}
  ell(x,y,9*s,4*s,'#2a1f18');for(let i=0;i<4;i++)line(x+(i-1.5)*4*s,y,x+(i-1.5)*5*s,y-5*s,'#3a2c22',1);}
{const _dd=drawDecor;drawDecor=function(o){if(!PB_K[o.k]||!o.pst){if(drawPBNew(o))return;return _dd(o);}
  if(o.pst==='burnt'){drawPBBurnt(o);return;}
  const draw=()=>{if(!drawPBNew(o))_dd(o);};
  if(o.g<1){ctx.save();ctx.translate(o.x,o.y);ctx.scale(o.g,o.g);ctx.translate(-o.x,-o.y);draw();ctx.restore();}else draw();
  if(o.fire){const s=(o.s||1)*(PB_K[o.k].big?1:.5),f=.5+.3*Math.sin(G.t*14+o.x);ell(o.x,o.y-20*s,22*s,26*s,`rgba(255,${110+Math.round(60*f)},30,${.25+.15*f})`);ell(o.x,o.y-14*s,10*s,14*s,`rgba(255,220,90,${.3*f})`);}};}
// ---- save / load: burnt and regrowing plants persist ----
{const _ss=svSnapshot;svSnapshot=function(){const d=_ss.apply(this,arguments);d.PB=PB.map(o=>o.pst==='burnt'?'b':o.fire?'f':o.g<1?'s':'o').join('');d.nPB=PB.length;return d;};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(typeof d.PB==='string'&&d.nPB===PB.length){PB_ACT=new Set();
  for(let i=0;i<PB.length;i++){const o=PB[i],c=d.PB[i];o.fire=0;o.g=1;o.pst='ok';if(c==='b'||c==='f'){o.pst='burnt';o.re=PB_K[o.k].re*.8;PB_ACT.add(o);}else if(c==='s'){o.g=.5;PB_ACT.add(o);}}}return r;};}
