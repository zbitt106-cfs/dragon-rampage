// ======================= partNR: the NORTHERN REALMS (the world doubles northward: WY0 -2600 -> -11400) =======================
// Beyond the Frostpeak range lies a fantasy land in two bands.
//  Light band (south):  the Hobbit Shire (west) · the Elven realm of Lumeria (centre: purple grass, glowing trees, unicorns, centaurs, satyrs, minotaurs) · the Dwarf Holds (east)
//  Dark band (north):   the Goblin Bogs (west) · the Orc Warlands (centre) · the Cyclops Highlands (east) - with trolls, wyverns, giant scorpions & spiders (glowing red eyes)
// The dark side raids south with small vanguards and every 3 minutes marches a big army to the border; the light side patrols its own lands and only ever DEFENDS.
// Everything is cartoony: defeated creatures go dizzy and puff away. Creatures spawn lazily around the dragon only (perf).
function nrEdge(x){return -2750+90*Math.sin(x/500)+40*Math.sin(x/170);}         // north of this line = the Northern Realms
function nrDarkY(x){return -7000+180*Math.sin(x/650)+70*Math.sin(x/210);}       // light band south of it, dark band north of it
function nrShireX(y){return -7400+160*Math.sin(y/520)+60*Math.sin(y/170);}
function nrDwarfX(y){return 3700+160*Math.sin(y/480)+60*Math.sin(y/150);}
function nrGobX(y){return -6200+170*Math.sin(y/560)+60*Math.sin(y/190);}
function nrCycX(y){return 3900+170*Math.sin(y/600)+60*Math.sin(y/200);}
function nrRealm(x,y){if(y>=nrEdge(x))return null;if(y>nrDarkY(x))return x<nrShireX(y)?'shire':x>nrDwarfX(y)?'dwarf':'elven';return x<nrGobX(y)?'goblin':x>nrCycX(y)?'cyclops':'orc';}
const NR_LIGHT=new Set(['shire','elven','dwarf']),NR_DARK=new Set(['goblin','orc','cyclops']);
function nrInNorth(x,y){return y<nrEdge(x)&&!inSea(x,y);}
const NR_BORDER_M=150; // light units never go more than this far north of the dark border
function nrMix(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}

// ---- regions: names, banners, minimap labels ----
Object.assign(REGION_NAMES,{shire:'The Hobbit Shire',elven:'Lumeria, the Elven Realm',dwarf:'The Dwarf Holds',goblin:'The Goblin Bogs',orc:'The Orc Warlands',cyclops:'The Cyclops Highlands'});
Object.assign(REGION_SUB,{shire:'Round doors, flower gardens and nervous little hobbits',elven:'Purple meadows, glowing trees, unicorns, centaurs and satyrs',dwarf:'Carved stone halls, roaring forges and stubborn axe-dwarves',
  goblin:'Scrap shacks, trolls, wyverns and red-eyed spiders',orc:'Spiked war forts - the goblin horde musters here',cyclops:'Boulder caves of the one-eyed giants'});
Object.assign(REGION_LABEL,{shire:[-11600,-4900],elven:[-1300,-5200],dwarf:[6000,-5100],goblin:[-11200,-9300],orc:[-900,-9700],cyclops:[6300,-9700]});
{const _rk=regionKey;regionKey=function(x,y){if(y<MWY0+200&&y<nrEdge(x)&&!inSea(x,y)&&d2(x,y,LAIR.x,LAIR.y)>=420)return nrRealm(x,y);return _rk(x,y);};}

// ---- settlements, roads and the border battlefield ----
const NR_TOWNS=[
  {k:'elven',n:'Silverleaf',x:-1500,y:-4300},{k:'elven',n:'Moonglade',x:1700,y:-5300},{k:'elven',n:'Starwood',x:-6600,y:-5900},
  {k:'shire',n:'Bramblebottom',x:-10200,y:-4100},{k:'shire',n:'Thistledown',x:-13500,y:-5300},
  {k:'dwarf',n:'Ironhold Gate',x:6300,y:-4300},{k:'dwarf',n:'Emberforge',x:5300,y:-5900},
  {k:'goblin',n:'Gobbleton',x:-10600,y:-8600},{k:'goblin',n:'Scrapheap Hollow',x:-14000,y:-9900},{k:'goblin',n:'Snaggletooth Camp',x:-7700,y:-10300},
  {k:'orc',n:'Gorgrim War-Fort',x:-1200,y:-8900},{k:'orc',n:'Blackspike Camp',x:2000,y:-10000},
  {k:'cyclops',n:'One-Eye Caves',x:6300,y:-8800},{k:'cyclops',n:'Megalith Ring',x:5400,y:-10400}];
NR_TOWNS.forEach((t,i)=>t.i=i);
const NRT=n=>NR_TOWNS.find(t=>t.n===n);
const NR_BF={x:-1400,y:nrDarkY(-1400)+230}; // the border battlefield (just inside elven land)
// the two grand central castles (queue 15-17): at the true geographic centre (bounding-box midpoint) of each side's land; the eggs live here and the big armies march from here
const NR_CC={L:{k:'L',n:'Lumenspire Citadel',x:-4400,y:-4950,egg:'W'},D:{k:'D',n:'Doomforge Citadel',x:-4400,y:-9100,egg:'B'}};
const NR_ROADS=[['Gorgrim War-Fort','BF'],['BF','Silverleaf'],['Silverleaf','Moonglade'],['Silverleaf','LC'],['LC','Starwood'],['LC','BF'],['DC','BF'],['DC','Gorgrim War-Fort'],['DC','Snaggletooth Camp'],['Starwood','Bramblebottom'],['Bramblebottom','Thistledown'],
  ['Moonglade','Emberforge'],['Emberforge','Ironhold Gate'],['Gobbleton','Scrapheap Hollow'],['Gobbleton','Snaggletooth Camp'],['Snaggletooth Camp','Gorgrim War-Fort'],
  ['Gorgrim War-Fort','Blackspike Camp'],['Blackspike Camp','Megalith Ring'],['Megalith Ring','One-Eye Caves'],['Silverleaf','PASS']];
const NR_PASS={x:2150,y:-2900};
function nrPt(n){return n==='BF'?NR_BF:n==='PASS'?NR_PASS:n==='LC'?NR_CC.L:n==='DC'?NR_CC.D:NRT(n);}
function nrRoadPts(a,b){const L=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(2,Math.ceil(L/36)),px=-(b.y-a.y)/L,py=(b.x-a.x)/L,out=[];
  for(let i=0;i<=n;i++){const t=i/n,w=Math.sin(t*Math.PI)*Math.sin(t*7+a.x*.013)*130;out.push({x:a.x+(b.x-a.x)*t+px*w,y:a.y+(b.y-a.y)*t+py*w});}return out;}
const NR_ROADP=NR_ROADS.map(([a,b])=>({a,b,p:nrRoadPts(nrPt(a),nrPt(b))}));
// a walking route along roads from town A to town B (graph BFS over the road list), thinned to waypoints
function nrRoute(a,b){if(a===b)return[nrPt(a)];const prev={[a]:null},q=[a];
  while(q.length){const c=q.shift();if(c===b)break;for(const r of NR_ROADP){const o=r.a===c?r.b:r.b===c?r.a:null;if(o&&!(o in prev)){prev[o]=c;q.push(o);}}}
  if(!(b in prev))return[nrPt(a),nrPt(b)];const chain=[];for(let c=b;c;c=prev[c])chain.unshift(c);const out=[];
  for(let i=0;i+1<chain.length;i++){const r=NR_ROADP.find(r=>(r.a===chain[i]&&r.b===chain[i+1])||(r.b===chain[i]&&r.a===chain[i+1]));let p=r.p;if(r.a!==chain[i])p=[...p].reverse();
    for(let k=(i?6:0);k<p.length;k+=6)out.push({x:p[k].x,y:p[k].y});}out.push(nrPt(b));return out;}

// ---- terrain colours (called per pixel from buildTerrain for the north) ----
const NR_SNOW=[236,240,248];
function nrPix(k,n,x,y){let c;switch(k){
  case'elven':{c=nrMix([152,110,206],[116,80,178],n);const p=Math.sin(x/95+Math.sin(y/140)*2.2)*Math.sin(y/115+x/400);if(p>.55)c=nrMix(c,[200,168,240],(p-.55)*1.7);if(n>.7)c=nrMix(c,[126,206,220],Math.min(1,(n-.7)*1.6));break;}
  case'shire':{c=nrMix([102,166,64],[134,194,84],n);const p=Math.sin(x/160)*Math.sin(y/130);if(p>.7)c=nrMix(c,[166,210,98],.5);break;}
  case'dwarf':{c=nrMix([130,122,112],[96,90,86],n);if(n>.64)c=nrMix(c,NR_SNOW,clamp((n-.64)*4,0,1));else if(n<.3)c=nrMix(c,[110,128,92],.5);break;}
  case'goblin':{c=nrMix([76,84,52],[50,58,38],n);if(n<.3)c=nrMix(c,[42,66,62],clamp((.3-n)*6,0,1));break;}
  case'orc':{c=nrMix([92,70,56],[58,44,38],n);const v=Math.abs(Math.sin(x/210+Math.sin(y/160)*1.8)+Math.sin(y/190)*.6);if(v<.05)c=nrMix(c,[226,98,36],1-v/.05);break;}
  default:{c=nrMix([138,124,98],[100,92,78],n);if(n>.7)c=nrMix(c,[162,152,132],.6);}}
  return c;}
function nrCol(x,y,wx,wy,n){const sm=t=>t<=0?0:t>=1?1:t*t*(3-2*t),tL=sm((wy-nrDarkY(wx))/360+.5),c=[0,0,0];
  const add=(k,w)=>{if(w<.01)return;const p=nrPix(k,n,x,y);c[0]+=p[0]*w;c[1]+=p[1]*w;c[2]+=p[2]*w;};
  if(tL>0){const wS=sm((nrShireX(wy)-wx)/360+.5),wD=sm((wx-nrDwarfX(wy))/360+.5);add('shire',wS*tL);add('dwarf',wD*tL);add('elven',Math.max(0,1-wS-wD)*tL);}
  if(tL<1){const wG=sm((nrGobX(wy)-wx)/360+.5),wC=sm((wx-nrCycX(wy))/360+.5),k=1-tL;add('goblin',wG*k);add('cyclops',wC*k);add('orc',Math.max(0,1-wG-wC)*k);}
  let r=c;const e=nrEdge(wx)-wy;if(e<320)r=nrMix(r,NR_SNOW,clamp(1-e/320,0,1));const f=wy-(WY0+420);if(f<380)r=nrMix(r,NR_SNOW,clamp(1-f/380,0,1));
  const cs=coastX(y)-x;if(cs<140)r=nrMix(r,[226,214,170],clamp(1-cs/140,0,1)*.8);
  return r;}
const NR_ROADC={elven:'#e4d8f4',shire:'#bc9c66',dwarf:'#9c968e',goblin:'#5c5238',orc:'#4c3c32',cyclops:'#a08e70'};
const NR_PLAZA={elven:'#d6c8ee',shire:'#9ccc6a',dwarf:'#8c8680',goblin:'#4e4630',orc:'#3e302a',cyclops:'#8e7e62'};
function nrPaint(g){g.save();g.setTransform(1/TS,0,0,1/TS,-WX0/TS,-WY0/TS);
  for(const r of NR_ROADP)for(const p of r.p){const k=nrRealm(p.x,p.y);g.fillStyle=k?NR_ROADC[k]:'#d8dee8';g.beginPath();g.arc(p.x,p.y,22,0,TAU);g.fill();}
  for(const t of NR_TOWNS){g.fillStyle=NR_PLAZA[t.k];g.beginPath();g.ellipse(t.x,t.y,t.k==='orc'?230:200,t.k==='orc'?170:150,0,0,TAU);g.fill();}
  g.fillStyle='rgba(120,90,60,.35)';g.beginPath();g.ellipse(NR_BF.x,NR_BF.y,520,300,0,0,TAU);g.fill();
  g.restore();}
{const _bt=buildTerrain;buildTerrain=function(){const first=!TERR;const r=_bt.apply(this,arguments);if(first&&TERR)nrPaint(TERR.getContext('2d'));return r;};}
// ---- the Wizard's Isle: a small island in the deep north-east sea (literals: onIsle may be asked before this part has run) ----
function onWzIsle(x,y){const dx=x-WZ.x,dy=(y-WZ.y)*1.2;return dx*dx+dy*dy<WZ.r*WZ.r;}
const WZ={x:11500,y:-1500,r:230,H:196}; // moved south (was 11600,-6000, then -1750): it sits in the Kraken Deep fully SOUTH of the magic wind wall - the isle clears the barrier line by ~1100 and even his biggest wind-gust ring (900) by ~370, so it is always reachable before the barrier opens
{const _nc=nrCol;nrCol=function(x,y,wx,wy,n){if(onWzIsle(x,y)){const dx=x-WZ.x,dy=(y-WZ.y)*1.2,r=Math.hypot(dx,dy)/WZ.r;return r>.8?nrMix([230,216,176],[206,190,150],n):nrMix([120,96,176],[150,120,206],n);}return _nc(x,y,wx,wy,n);};}
{const _rk=regionKey;regionKey=function(x,y){if(y<0&&onWzIsle(x,y))return'wzisle';return _rk(x,y);};}
REGION_NAMES.wzisle="The Wizard's Isle";REGION_SUB.wzisle='Crackling tower of the Storm Wizard - he holds the magic barrier';REGION_LABEL.wzisle=[WZ.x,WZ.y-300];
// ---- the magic barrier: glowing crystal mountains along the south edge + a shimmer along the north coast ----
// Locked: the dragon may not enter the north lands. Unlocked (wizard defeated): ONLY the player's dragon crosses; every other unit stays on its side for good.
// The barrier runs the WHOLE width of the map: crystal mountains on land, a wall of strong magic winds over the sea (same line), so nobody sneaks north by sea or air.
function nrBarZone(x,y){return y<nrEdge(x)+60&&y<MWY0+300;}
function nrBarPush(o,nr){ // returns true if moved
  if(nr){let m=false;const ey=nrEdge(o.x)-40;if(o.y>ey){o.y=ey;m=true;}const cx=coastX(o.y)-40;if(o.x>cx){o.x=cx;m=true;}return m;}
  if(!nrBarZone(o.x,o.y))return false;o.y=nrEdge(o.x)+62;return true;}
// ---- realm art: every building/tree kind is painted once into a cached sprite (cheap to draw), with small live glows/smoke on top ----
const NR_ART={},NR_SPR=new Map();
function nG(x,y,r,c){const g=SJC.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');SJC.fillStyle=g;SJC.beginPath();SJC.arc(x,y,r,0,TAU);SJC.fill();}
function nrSpr(k,v){const key=k+'|'+(v||0);let s=NR_SPR.get(key);if(s)return s;const A=NR_ART[k],Q=1.25,cv=document.createElement('canvas');cv.width=Math.ceil(A.w*Q);cv.height=Math.ceil(A.h*Q);
  const g=cv.getContext('2d');g.scale(Q,Q);g.translate(A.ax,A.ay);g.lineCap='round';g.lineJoin='round';const old=SJC;SJC=g;try{A.p(v||0);}finally{SJC=old;}s={cv,A};NR_SPR.set(key,s);return s;}
function nrBlit(o){const s=nrSpr(o.k,o.v),A=s.A,sc=(o.s||1)*(o.g==null?1:o.g);ctx.drawImage(s.cv,o.x-A.ax*sc,o.y-A.ay*sc,A.w*sc,A.h*sc);}
function nArt(k,w,h,ax,ay,p){NR_ART[k]={w,h,ax,ay,p};}
const nSh=(rx,ry)=>sE(0,0,rx,ry,'rgba(20,10,30,.25)');
// ===== ELVEN: white/silver spires, leaf roofs, glowing lanterns, tree-houses, glowing trees =====
const leafRoof=(cx,by,w,h,c,c2)=>{sP([cx-w,by,cx-w*.7,by-h*.55,cx-w*.25,by-h*.9,cx,by-h,cx+w*.25,by-h*.9,cx+w*.7,by-h*.55,cx+w,by,cx,by-h*.18],c);sL(cx,by-h*.15,cx,by-h*.95,c2,2);
  for(let i=1;i<4;i++){sL(cx,by-h*(.2+i*.18),cx-w*(.5-i*.1),by-h*(.08+i*.2),c2,1.2);sL(cx,by-h*(.2+i*.18),cx+w*(.5-i*.1),by-h*(.08+i*.2),c2,1.2);}};
nArt('glowtree',110,150,55,140,v=>{const C=[['#8a5ad0','#a77ae6','#6f40b8','#d2b0ff'],['#3fa8c0','#62c8dc','#2a8aa4','#b8f6ff'],['#c060c8','#de88e0','#9a40a8','#ffd0fa']][v%3];
  nSh(30,8);nG(0,-84,56,'rgba(200,170,255,.35)');sP([-6,0,-4,-62,4,-62,7,0],'#ece8f8');sL(0,-40,-16,-62,'#e4e0f4',3);sL(1,-46,15,-66,'#e4e0f4',3);
  sE(0,-84,38,30,C[0]);sE(-16,-92,24,19,C[1]);sE(16,-76,24,18,C[2]);sE(4,-102,19,14,C[1]);sE(-6,-80,14,10,C[3]);
  for(let i=0;i<9;i++)sE(Math.cos(i*2.3)*30,-86+Math.sin(i*1.7)*22,2.4,2.4,i%2?'#f4f0ff':'#9ff4ff');});
nArt('glowflower',40,30,20,26,v=>{for(let i=0;i<5;i++){const x=(i-2)*6,c=[['#ff9af0','#9ff4ff'],['#b8a0ff','#ffe89a']][v%2][i%2];sL(x,0,x+1,-9-i%2*3,'#6fb08a',1.2);nG(x+1,-10-i%2*3,6,'rgba(255,255,255,.45)');sE(x+1,-10-i%2*3,2.6,2.6,c);}});
nArt('elfspire',130,250,65,240,v=>{nSh(48,12);sE(0,-4,44,12,'#d4d0e2');sE(0,-8,38,9,'#ecebf6');
  sP([-20,-8,-13,-160,13,-160,20,-8],'#f6f4fc');sP([4,-8,7,-160,13,-160,20,-8],'#dcd8ec');sL(-13,-160,-20,-8,'#b8b4d0',1.5);sL(13,-160,20,-8,'#b8b4d0',1.5);
  for(const y of[-40,-80,-120]){sE(0,y,5,8,'#2a2050');sE(0,y+1,3.6,6.5,'#a8f0ff');}sR(-15,-162,30,5,'#c8c4dc');
  leafRoof(0,-158,22,74,'#8fdcae','#5fae80');sE(0,-234,4,4,'#fff6c0');
  sP([30,-8,34,-90,44,-90,48,-8],'#f0eef8');leafRoof(39,-88,10,34,'#a4e6bc','#6cb88c');});
nArt('elfhouse',140,130,70,120,v=>{nSh(50,10);sR(-40,-48,80,48,'#f4f2fa');sR(10,-48,30,48,'#e2def0');sP([-40,-48,-40,0,-46,0,-46,-50],'#d8d4e8');
  sE(0,-14,10,14,'#7a5ac8');sR(-10,-14,20,14,'#7a5ac8');sE(0,-14,7,11,'#b8a0ff');sR(-7,-14,14,14,'#b8a0ff');
  for(const x of[-26,26]){sE(x,-30,6,6,'#2a2050');sE(x,-30,4.5,4.5,'#aef2ff');}
  leafRoof(0,-46,58,52,v%2?'#9ad6e6':'#8fdcae',v%2?'#62a8bc':'#5fae80');sE(-2,-94,3,3,'#fff6c0');});
nArt('treehouse',170,230,85,220,v=>{nSh(56,14);nG(0,-150,80,'rgba(180,150,255,.3)');sP([-16,0,-10,-150,10,-150,18,0],'#e6e2f4');sP([-16,0,-30,4,-8,-6],'#d6d2e8');sP([18,0,34,4,10,-6],'#d6d2e8');
  sE(0,-96,52,10,'#c8c0e0');sR(-50,-96,100,4,'#b0a8cc');for(let i=-4;i<=4;i++)sL(i*11,-96,i*11,-106,'#e8e4f6',1.5);sL(-48,-106,48,-106,'#e8e4f6',1.5);
  sR(-22,-128,44,32,'#f6f4fc');sE(0,-110,6,8,'#b8a0ff');leafRoof(0,-126,32,34,'#8fdcae','#5fae80');
  const C=v%2?['#3fa8c0','#62c8dc']:['#8a5ad0','#a77ae6'];sE(-34,-176,40,28,C[0]);sE(30,-182,40,30,C[0]);sE(0,-196,44,30,C[1]);
  for(let i=0;i<12;i++)sE(Math.cos(i*2.1)*58,-182+Math.sin(i*1.4)*24,2.4,2.4,i%2?'#f4f0ff':'#9ff4ff');});
nArt('lantern',30,70,15,64,v=>{nSh(8,3);sL(0,0,0,-50,'#d8d4ea',3);sL(0,-50,8,-52,'#d8d4ea',2);nG(9,-46,18,'rgba(190,240,255,.6)');sE(9,-46,4.5,6,'#e8fcff');});
// ===== DWARF: carved stone halls, mountain gates, forges, runes =====
const rune=(x,y,c)=>{sL(x-3,y-5,x+3,y+5,c,1.6);sL(x+3,y-5,x-3,y+5,c,1.6);sL(x,y-6,x,y+6,c,1.2);};
nArt('dwgate',240,230,120,218,v=>{nSh(100,16);sP([-118,0,-100,-110,-60,-170,-10,-210,40,-180,90,-140,116,-60,118,0],'#7e7870');sP([-60,-170,-10,-210,40,-180,10,-190],'#eef2f8');sP([40,-180,90,-140,70,-150],'#e6eaf2');
  sP([-118,0,-100,-110,-80,-60,-70,0],'#6a645e');sR(-56,-118,112,118,'#9a948c');sR(-62,-126,124,12,'#b4aea4');sR(-62,-8,124,8,'#857f78');
  for(const x of[-50,38])sR(x,-114,12,106,'#aaa49a');sP([-30,0,-30,-70,0,-92,30,-70,30,0],'#4a3a2c');sL(0,-92,0,0,'#2e241c',2);for(const y of[-60,-36,-14])sL(-29,y,29,y,'#7a7068',3);
  for(let i=0;i<7;i++)rune(-42+i*14,-119,'#7ff0ff');sE(0,-102,9,9,'#c8a040');sE(0,-102,5,5,'#ffe48a');});
nArt('dwforge',150,140,75,130,v=>{nSh(56,12);sR(-50,-58,100,58,'#8e8880');sR(-50,-58,100,6,'#a8a298');for(let i=0;i<5;i++)sL(-50,-46+i*10,50,-46+i*10,'#7a746c',1);
  sP([-58,-56,0,-86,58,-56],'#5e5854');sR(22,-100,16,40,'#6e6862');sR(20,-104,20,6,'#4e4844');
  sE(-14,-24,22,20,'#2a1a10');nG(-14,-22,30,'rgba(255,150,40,.75)');sE(-14,-20,14,10,'#ffb040');sE(-14,-18,8,5,'#fff0a0');
  sR(14,-14,26,8,'#3a3a40');sR(20,-6,14,6,'#2e2e34');rune(30,-40,'#ff9a40');});
nArt('dwhall',170,140,85,130,v=>{nSh(66,12);sR(-62,-64,124,64,'#958f86');for(let i=0;i<6;i++)sL(-62,-54+i*10,62,-54+i*10,'#80796f',1);
  sP([-72,-62,0,-118,72,-62],'#6e6862');sP([-72,-62,0,-118,0,-110,-60,-62],'#7e7870');sL(-72,-62,0,-118,'#56504a',3);sL(72,-62,0,-118,'#56504a',3);
  sP([-16,0,-16,-36,0,-48,16,-36,16,0],'#4e3c2c');for(const x of[-38,38]){sR(x-8,-46,16,18,'#3a3a44');sR(x-6,-44,12,14,'#ffc870');}
  for(let i=0;i<5;i++)rune(-24+i*12,-56,'#7ff0ff');sE(0,-82,12,12,'#b8a060');sE(0,-82,7,7,'#8a4a2a');});
nArt('dwmine',160,120,80,110,v=>{nSh(60,12);sP([-76,0,-60,-70,-20,-104,30,-96,70,-50,78,0],'#77716a');sP([-20,-104,30,-96,10,-100],'#e6eaf2');
  sE(0,-26,30,30,'#1e1a18');sR(-30,-26,60,26,'#1e1a18');sR(-34,-58,8,58,'#8a6a40');sR(26,-58,8,58,'#8a6a40');sR(-38,-62,76,10,'#7a5a34');
  sL(-12,0,-8,-24,'#5a5a60',2);sL(12,0,8,-24,'#5a5a60',2);sR(-14,-16,28,12,'#6a5040');sE(-6,-18,6,4,'#c8b060');sE(5,-19,5,4,'#a0a8b0');});
nArt('dpine',70,110,35,104,v=>{nSh(18,5);sR(-3,-14,6,14,'#5a4030');for(let i=0;i<3;i++){const y=-14-i*26,w=26-i*6;sP([-w,y,0,y-34,w,y],i%2?'#2e5a46':'#365e4c');sP([-w*.5,y-18,0,y-34,w*.5,y-18],'#eef2f8');}});
nArt('rock',60,50,30,44,v=>{nSh(22,6);sP([-22,0,-18,-20,-4,-30,14,-24,22,0],v%2?'#8a847c':'#9a948a');sP([-4,-30,14,-24,6,-26],'#e8ecf2');});
// ===== HOBBIT: round doors in grassy hillside homes, flower gardens, fences =====
nArt('hobhole',170,110,85,100,v=>{nSh(70,12);sE(0,-18,72,44,'#6aae4a');sE(-10,-30,56,32,'#80c25a');sR(-80,-2,160,6,'rgba(0,0,0,0)');
  sE(0,-20,19,19,'#8a8070');sE(0,-20,15,15,v%2?'#c8402e':'#2e7d4f');sL(0,-35,0,-5,'rgba(0,0,0,.2)',1);sE(6,-19,2.4,2.4,'#ffd84a');
  for(const x of[-40,40]){sE(x,-22,9,9,'#8a8070');sE(x,-22,6.5,6.5,'#ffe08a');sL(x-6,-22,x+6,-22,'#8a8070',1.2);sL(x,-28,x,-16,'#8a8070',1.2);}
  sR(30,-64,10,16,'#9a8a7a');sR(28,-66,14,4,'#7a6a5a');
  for(let i=0;i<12;i++){const x=-62+i*11;if(Math.abs(x)<16)continue;sL(x,6,x,-6,'#a07a4a',2);}sL(-62,-2,-16,-2,'#a07a4a',1.5);sL(16,-2,60,-2,'#a07a4a',1.5);
  for(let i=0;i<14;i++)sE(-58+i*8.5+(i%3)*2,-8-(i%2)*4,2.6,2.6,['#ff5a7a','#ffd84a','#ff9ad8','#ffffff','#b07aff'][i%5]);});
nArt('oak',100,120,50,112,v=>{nSh(30,8);sP([-6,0,-4,-50,4,-50,7,0],'#7a5434');sE(0,-70,38,30,v%2?'#4e9a3a':'#5aa840');sE(-18,-80,24,20,'#68b84a');sE(16,-62,22,18,'#468a34');
  if(v%2)for(let i=0;i<6;i++)sE(Math.cos(i*2.4)*24,-70+Math.sin(i*1.9)*16,3,3,'#e8402e');});
nArt('flowerbed',80,40,40,32,v=>{sE(0,-6,36,12,'#7a5a3a');for(let i=0;i<16;i++){const x=-30+i*4,y=-6+Math.sin(i*2.7)*6;sL(x,y,x,y-6,'#3e8a3a',1.2);sE(x,y-7,2.8,2.8,['#ff5a7a','#ffd84a','#ff9ad8','#b07aff','#ff8a3a'][(i+v)%5]);}
  for(let i=0;i<9;i++)sL(-38+i*9.5,6,-38+i*9.5,-2,'#a07a4a',1.6);sL(-38,2,38,2,'#a07a4a',1.3);});
// ===== GOBLIN: ramshackle spiky scrap/wood shacks, crooked towers =====
nArt('gobshack',130,120,65,110,v=>{nSh(50,10);sP([-44,0,-40,-52,38,-58,46,0],'#6a5236');for(let i=0;i<7;i++)sL(-40+i*12,-2,-38+i*12+(i%2?2:-2),-54,i%2?'#5a4428':'#7a5e3e',2);
  sR(-30,-44,22,16,'#8a8e92');sR(14,-30,20,14,'#7a6e5e');sL(-30,-44,-8,-28,'#5e6266',1);
  sP([-56,-46,-10,-90,8,-84,54,-52],'#4e3a26');for(let i=0;i<7;i++){const x=-50+i*16;sL(x,-50-(i%3)*10,x-6+i*2,-76-(i%2)*14,'#3a2a1a',2);}
  sP([-8,0,-6,-30,10,-32,12,0],'#2a1e14');sE(26,-44,6,5,'#1a2a14');sE(26,-44,4,3,'#b6ff5a');});
nArt('gobtower',110,210,55,200,v=>{nSh(34,8);for(const[a,b]of[[-24,-10],[24,10],[-4,0]])sL(a,0,b*.6+6,-120,'#5a4428',5);sL(-20,-40,18,-80,'#4a3820',3);sL(20,-40,-16,-80,'#4a3820',3);
  sP([-30,-118,-26,-160,30,-166,34,-114],'#6a5236');sR(-18,-150,16,12,'#8a8e92');sE(16,-140,6,5,'#b6ff5a');
  sP([-40,-160,6,-200,44,-162],'#4e3a26');for(let i=0;i<5;i++)sL(-34+i*16,-164,-40+i*18,-182-(i%2)*8,'#3a2a1a',2);sL(6,-200,8,-222+10,'#3a2a1a',2);sP([8,-210,28,-204,8,-198],'#6aa83a');});
nArt('deadtree',80,110,40,104,v=>{nSh(18,5);sP([-6,0,-3,-50,3,-50,6,0],'#3e3830');sL(0,-46,-22,-80,'#3e3830',4);sL(-14,-66,-26,-66,'#3e3830',2);sL(1,-50,20,-88,'#3e3830',4);sL(12,-72,26,-76,'#3e3830',2);sL(0,-50,2,-96,'#3e3830',3);});
nArt('toadstool',60,50,30,44,v=>{for(let i=0;i<3;i++){const x=(i-1)*16,h=10+i%2*8;sR(x-2.5,-h,5,h,'#e6dccb');nG(x,-h-2,16,'rgba(150,255,110,.4)');sE(x,-h-2,10-i%2*3,5,v%2?'#7dff6a':'#5affc8');sE(x-3,-h-4,1.8,1.4,'#ffffff');sE(x+3,-h-2,1.6,1.2,'#ffffff');}});
nArt('bonfire',60,50,30,40,v=>{for(let i=0;i<8;i++)sE(Math.cos(i*.8)*18,Math.sin(i*.8)*7,5,4,'#6a6460');sL(-10,0,10,-6,'#4a3420',4);sL(10,0,-10,-6,'#4a3420',4);});
// ===== ORC: dark iron/wood war forts, spiked palisades, banners =====
const stake=(x,y,h,c)=>{sP([x-5,y,x-5,y-h,x,y-h-9,x+5,y-h,x+5,y],c);};
const banner=(x,y,c)=>{sL(x,y,x,y-70,'#2a2420',3);sP([x,y-70,x+22,y-66,x+18,y-52,x+22,y-38,x,y-42],c);sE(x+10,y-56,4,4,'#1a1a1a');};
nArt('orcfort',260,220,130,206,v=>{nSh(110,18);sP([-50,-60,-44,-150,44,-150,50,-60],'#3a3230');sR(-50,-150,100,10,'#4e4642');for(let i=0;i<6;i++)stake(-45+i*18,-150,10,'#2a2422');
  sR(-12,-130,24,20,'#ff7a2a');sR(-10,-128,20,16,'#ffb050');for(let i=0;i<4;i++)sL(-50,-80-i*16,50,-80-i*16,'#5a5450',2);
  for(let i=0;i<20;i++){const x=-118+i*12.4;if(x>-26&&x<26)continue;stake(x,0,60+(i%2)*8,i%2?'#4a3a2c':'#5a4634');}sL(-120,-30,-26,-30,'#2a2a2e',3);sL(26,-30,120,-30,'#2a2a2e',3);
  sR(-26,-70,52,70,'#3a2c22');for(let i=0;i<4;i++)sL(-26,-60+i*16,26,-60+i*16,'#6a6670',3);sE(-8,-34,3,3,'#9a9aa4');sE(8,-34,3,3,'#9a9aa4');
  stake(-30,0,84,'#2a2422');stake(30,0,84,'#2a2422');banner(-60,-60,'#b02828');banner(60,-60,'#b02828');banner(0,-150,'#1e1e1e');});
nArt('orcwall',130,100,65,90,v=>{for(let i=0;i<10;i++)stake(-56+i*12.4,0,52+(i%3)*6,i%2?'#4a3a2c':'#5a4634');sL(-60,-24,60,-24,'#2a2a2e',3);if(v%2)banner(0,-20,'#b02828');});
nArt('orctent',120,110,60,100,v=>{nSh(44,10);sP([-46,0,0,-70,46,0],'#5a4030');sP([0,-70,46,0,10,0],'#4a3426');sP([-10,0,0,-30,10,0],'#2a1a12');sL(0,-70,0,-92,'#2a2420',3);sP([0,-92,18,-88,0,-80],'#b02828');
  for(let i=0;i<3;i++)sL(-30+i*14,-24+i*-14,-36+i*14,-30+i*-14,'#bab4a8',2);});
nArt('spikes',70,50,35,44,v=>{for(let i=0;i<5;i++){const x=(i-2)*12;sL(x,0,x+(i%2?6:-6),-30-i%2*8,'#4a3a2c',4);sP([x+(i%2?6:-6)-3,-28-i%2*8,x+(i%2?6:-6),-40-i%2*8,x+(i%2?6:-6)+3,-28-i%2*8],'#9a9aa4');}});
nArt('ashrock',70,50,35,44,v=>{nSh(24,6);sP([-24,0,-20,-22,-2,-32,18,-24,24,0],'#3a3230');sL(-14,-6,-4,-20,'#ff7a2a',2);sL(-4,-20,8,-14,'#ff9a3a',1.5);sL(10,-4,14,-18,'#ff7a2a',1.5);});
nArt('lavavent',80,40,40,30,v=>{sE(0,-4,34,12,'#2a2220');nG(0,-4,30,'rgba(255,120,30,.6)');sE(0,-4,20,6,'#ff7a2a');sE(0,-4,10,3,'#ffe08a');});
// ===== CYCLOPS: huge rough boulder caves, megalith huts =====
nArt('cyccave',250,190,125,178,v=>{nSh(110,18);sE(-70,-40,56,44,'#8a7e6a');sE(70,-44,58,46,'#7e725e');sE(0,-100,90,66,'#968a74');sE(-40,-120,40,30,'#a89c84');sE(46,-110,36,28,'#8a7e6a');
  sE(0,-44,48,46,'#1e1812');sR(-48,-44,96,44,'#1e1812');sE(0,-40,34,30,'#2e241a');sE(-96,-12,30,20,'#968a74');sE(98,-14,28,20,'#8a7e6a');
  for(let i=0;i<4;i++)sL(-30+i*20,-140-i%2*8,-20+i*20,-120,'#6e624e',2);sE(0,-6,10,4,'#5a3a20');sL(-8,-4,12,-14,'#7a5434',4);});
nArt('megahut',200,180,100,168,v=>{nSh(86,16);for(const x of[-60,60]){sP([x-16,0,x-14,-100,x+14,-104,x+16,0],'#8e8676');sL(x-6,-20,x-4,-80,'#7a7262',2);}
  sP([-84,-96,80,-108,84,-88,-80,-80],'#9e9684');sP([-40,-82,0,-140,40,-86],'#8a6a40');for(let i=0;i<8;i++)sL(-36+i*10,-84,-4+i*1.5,-136,'#6e5230',1.5);
  sE(0,-40,34,40,'#2a2018');sR(-34,-40,68,40,'#2a2018');sP([-30,0,-30,-36,30,-36,30,0],'#6a4a2a');sL(0,0,0,-36,'#4a321a',2);});
nArt('boulder',100,80,50,72,v=>{nSh(40,10);sE(0,-30,40,32,v%2?'#8a7e6a':'#9a8e78');sE(-12,-42,20,14,'#aca088');sE(14,-18,16,10,'#7a6e5a');});
nArt('stone',50,110,25,104,v=>{nSh(18,5);sP([-14,0,-11,-90,0,-100,11,-88,14,0],'#8e8878');sL(-4,-20,-2,-70,'#7a7464',2);if(v%2){sL(-6,-60,6,-60,'#9ff4ff',1.5);sL(0,-66,0,-54,'#9ff4ff',1.5);}});
// ===== MAGIC: the barrier's crystal mountains and the wizard's tower =====
nArt('magicpeak',260,230,130,214,v=>{sP([-128,0,-70,-120,-30,-170,10,-206,50,-160,90,-110,128,0],v%2?'#5a4a9a':'#4e4290');sP([10,-206,50,-160,90,-110,128,0,30,0],'rgba(30,20,70,.35)');
  sP([-30,-170,10,-206,50,-160,24,-176,6,-150,-10,-170],'#eef2ff');nG(10,-120,110,'rgba(170,140,255,.35)');
  for(let i=0;i<7;i++){const x=-90+i*30,h=40+(i*37%50);sP([x-9,-4,x,-4-h,x+9,-4],i%2?'#9ff4ff':'#d4b0ff');sP([x,-4-h,x+9,-4,x+2,-4],'rgba(255,255,255,.4)');}});
nArt('wztower',150,270,75,256,v=>{nSh(60,14);sE(0,-4,52,16,'#6e6878');sP([-30,-6,-24,-190,24,-190,30,-6],'#8a84a0');sP([6,-6,10,-190,24,-190,30,-6],'#6e6888');
  for(let i=0;i<9;i++)sL(-28+(i%2)*2,-20-i*20,28-(i%2)*2,-20-i*20,'#76708c',1.5);for(const y of[-60,-120]){sE(0,y,6,9,'#1a1430');sE(0,y+1,4,7,'#9ff4ff');}
  sP([-14,-6,-14,-34,0,-44,14,-34,14,-6],'#3a2a50');sE(0,-194,44,10,'#5a5476');sR(-40,-200,80,10,'#7a7496');for(let i=0;i<9;i++)sR(-40+i*9.5,-210,6,10,'#7a7496');
  nG(0,-230,40,'rgba(150,200,255,.3)');});
// ===== extra burnable vegetation: purple elven grass, hobbit hedges, dwarf shrubs, dark dead brush =====
nArt('pgrass',40,30,20,26,v=>{for(let i=0;i<7;i++){const x=(i-3)*4,h=10+(i*5%7);sL(x,0,x+(i%2?3:-3),-h,i%2?'#b48ae6':'#8e5ccc',2);}if(v%2)nG(0,-10,10,'rgba(200,170,255,.35)');});
nArt('hedge',90,40,45,34,v=>{nSh(40,6);for(let i=0;i<6;i++)sE(-30+i*12,-12,10,12,i%2?'#3e7e34':'#4a8e3c');sE(-14,-20,8,6,'#5aa04a');sE(16,-18,8,6,'#5aa04a');
  if(v%2)for(let i=0;i<5;i++)sE(-28+i*14,-16,2.4,2.4,['#ff5a7a','#ffd84a','#ffffff'][i%3]);});
nArt('dshrub',50,40,25,34,v=>{nSh(18,5);sE(-8,-10,11,10,'#3e5e44');sE(8,-12,12,11,'#466a4c');sE(0,-18,9,8,'#527a56');sE(4,-22,5,3,'#e6eaf2');});
nArt('deadbrush',50,40,25,34,v=>{nSh(16,4);for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.32;sL(0,0,Math.cos(a)*18,Math.sin(a)*(16+i%2*5),i%2?'#4a4034':'#5a4e3e',1.6);}sE(0,-3,8,3,'#3a3228');});
// ---- placing the realm scenery (once per new game, AFTER the classic foliage so saved plant-state indices of older saves stay valid) ----
// ALL realm vegetation burns and regrows with the classic plant-fire system (PB): trees are 'big', the rest small
Object.assign(PB_K,{glowtree:{hp:34,re:90,big:1},oak:{hp:30,re:80,big:1},dpine:{hp:30,re:80,big:1},deadtree:{hp:22,re:70,big:1},
  glowflower:{hp:5,re:35},pgrass:{hp:4,re:30},flowerbed:{hp:6,re:40},hedge:{hp:10,re:50},dshrub:{hp:7,re:40},toadstool:{hp:5,re:35},deadbrush:{hp:4,re:30}});
const NR_VEG=['glowtree','glowflower','pgrass','oak','flowerbed','hedge','dpine','dshrub','deadtree','toadstool','deadbrush'];
const NR_TOWN_ART={
  elven:[['elfspire',0,0],['elfhouse',-190,40],['elfhouse',170,60],['elfhouse',20,150],['treehouse',-150,-120],['treehouse',190,-90],['lantern',-70,70],['lantern',80,80],['lantern',-90,-40],['lantern',100,-30],['glowflower',-40,110],['glowflower',60,120]],
  shire:[['hobhole',-170,-60],['hobhole',30,-130],['hobhole',190,-40],['hobhole',-120,110],['hobhole',140,120],['flowerbed',-30,30],['flowerbed',70,40],['flowerbed',-60,-20],['oak',-230,60],['oak',250,40],['hedge',-80,190],['hedge',60,200],['hedge',-250,-140]],
  dwarf:[['dwhall',0,-40],['dwforge',-180,60],['dwforge',180,70],['dwmine',-170,-130],['dwhall',170,-120],['rock',40,120],['stone',-60,110]],
  goblin:[['gobtower',0,-40],['gobshack',-170,10],['gobshack',160,-10],['gobshack',-90,120],['gobshack',100,120],['gobshack',-40,-150],['bonfire',0,50],['toadstool',190,90],['toadstool',-200,-90]],
  orc:[['orcfort',0,-30],['orcwall',-230,40],['orcwall',230,40],['orcwall',-200,-120],['orcwall',200,-120],['orctent',-120,130],['orctent',120,130],['orctent',0,170],['spikes',-260,140],['spikes',260,140],['bonfire',0,90]],
  cyclops:[['cyccave',0,-40],['megahut',-200,60],['megahut',200,50],['megahut',0,150],['boulder',-260,-60],['boulder',250,-80],['stone',-120,-150],['stone',120,-150]]};
const NR_SCAT={elven:[['glowtree',.34],['pgrass',.3],['glowflower',.22],['lantern',.04],['rock',.05],['treehouse',.02]],shire:[['oak',.34],['hedge',.18],['flowerbed',.16],['rock',.08],['hobhole',.03]],
  dwarf:[['dpine',.34],['dshrub',.22],['rock',.25],['stone',.08]],goblin:[['deadtree',.32],['toadstool',.25],['deadbrush',.2],['spikes',.06],['rock',.08]],
  orc:[['ashrock',.26],['spikes',.18],['deadbrush',.2],['lavavent',.1],['deadtree',.14],['orctent',.02]],cyclops:[['boulder',.38],['stone',.18],['dpine',.14],['dshrub',.12],['deadbrush',.1]]};
function nrDecor(){if(DECOR.some(o=>o.nr))return;let s=9191;const r=()=>{s=Math.imul(s^s>>>15,2246822519)+0x9E3779B9|0;return((s^s>>>13)>>>0)/4294967296;},Rr=(a,b)=>a+r()*(b-a);
  const add=(k,x,y,o)=>DECOR.push(Object.assign({k,x,y,nr:1,v:(r()*6)|0,s:1},o||{}));
  // the barrier mountains: glowing crystal peaks along the whole southern edge of the north lands
  for(let x=WX0+120;x<coastX(nrEdge(x))-60;x+=Rr(110,150))add('magicpeak',x,nrEdge(x)-Rr(0,40),{s:Rr(.75,1.05)});
  add('wztower',WZ.x,WZ.y+10,{s:1,v:0});
  // settlements
  for(const t of NR_TOWNS){let L=NR_TOWN_ART[t.k];if(t.n==='Ironhold Gate')L=[['dwgate',0,-60],...L.slice(1)];if(t.n==='Megalith Ring'){L=[['megahut',0,0]];for(let i=0;i<10;i++)L.push(['stone',Math.cos(i/10*TAU)*230,Math.sin(i/10*TAU)*160]);}
    for(const[k,dx,dy]of L)add(k,t.x+dx,t.y+dy,{town:t.i});}
  // scattered scenery
  const near=(x,y)=>NR_TOWNS.some(t=>Math.abs(t.x-x)<330&&Math.abs(t.y-y)<260)||(Math.abs(x-NR_BF.x)<560&&Math.abs(y-NR_BF.y)<330);
  const onRoad=(x,y)=>NR_ROADP.some(R=>R.p.some(p=>Math.abs(p.x-x)<60&&Math.abs(p.y-y)<50));
  for(let i=0;i<6800;i++){const x=Rr(WX0+200,coastX(-6000)),y=Rr(WY0+300,MWY0);if(y>nrEdge(x)-150||x>coastX(y)-110||inWater(x,y))continue;const k=nrRealm(x,y);if(!k||near(x,y))continue;
    let q=r(),pick=null;for(const[kk,p]of NR_SCAT[k]){if(q<p){pick=kk;break;}q-=p;}if(!pick)continue;const big=/tree|oak|pine|hob|tent|hedge/.test(pick);if(big&&onRoad(x,y))continue;add(pick,x,y,{s:Rr(.85,1.2)});}
  // a few glowing groves in Lumeria
  for(let g=0;g<14;g++){const cx=Rr(-6600,3400),cy=Rr(-6600,-3300);if(nrRealm(cx,cy)!=='elven'||near(cx,cy))continue;for(let i=0;i<7;i++){const x=cx+Rr(-170,170),y=cy+Rr(-120,120);if(nrRealm(x,y)==='elven'&&!inWater(x,y))add('glowtree',x,y,{s:Rr(.9,1.25)});}}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);nrDecor();pbIndex();return r;};}
// old saves made before the north existed: their burnt/regrowing plant string is shorter - pad it with 'ok' for the new northern trees
{const _sa=svApply;svApply=function(d){if(d&&typeof d.PB==='string'&&typeof d.nPB==='number'){const nOld=PB.filter(o=>!o.nr).length;if(d.nPB===nOld&&PB.length>nOld){d.PB=d.PB+'o'.repeat(PB.length-nOld);d.nPB=PB.length;}}return _sa.apply(this,arguments);};}
// drawing: baked sprite + small live touches (lantern pulse, forge/bonfire flicker, glowing motes); burnt trees reuse the charred look
function nrDrawDecor(o){if(PB_K[o.k]&&o.pst==='burnt'){drawPBBurnt(o);return;}
  nrBlit(o);const x=o.x,y=o.y,s=o.s||1,t=G.t;
  switch(o.k){
    case'lantern':{const f=.55+.25*Math.sin(t*2.4+x);ell(x+9*s,y-46*s,11*s,11*s,`rgba(190,240,255,${.25*f})`);break;}
    case'glowtree':if(GFX_HI){const a=t*.8+x*.01;ell(x+Math.cos(a)*34*s,y-90*s+Math.sin(a*1.3)*20*s,2,2,'rgba(240,230,255,.9)');ell(x+Math.cos(a+2)*28*s,y-70*s+Math.sin(a*1.7)*16*s,1.6,1.6,'rgba(160,250,255,.9)');}break;
    case'dwforge':{const f=.5+.5*Math.sin(t*9+x);ell(x-14*s,y-20*s,16*s,11*s,`rgba(255,${150+Math.round(60*f)},60,${.35+.2*f})`);if(rnd()<.02)smoke(x+30*s,y-104*s);break;}
    case'bonfire':{const f=Math.sin(t*12+x);ell(x,y-10,14+3*f,18+4*f,'rgba(255,140,40,.75)');ell(x,y-8,8,11+2*f,'rgba(255,230,120,.9)');if(rnd()<.03)smoke(x,y-28);break;}
    case'lavavent':{const f=.5+.5*Math.sin(t*3+x);ell(x,y-4,22*s,7*s,`rgba(255,150,40,${.25*f})`);break;}
    case'magicpeak':{if(!G.nrOpen){const f=.5+.5*Math.sin(t*1.6+x*.01);ell(x+10*s,y-110*s,60*s,80*s,`rgba(170,140,255,${.08+.06*f})`);}break;}
    case'wztower':{const f=.5+.5*Math.sin(t*2);ell(x,y-230*s,26,26,`rgba(150,200,255,${.15+.15*f})`);break;}}
  if(o.fire){const k=PB_K[o.k],sz=(o.s||1)*(k&&k.big?1:.5),f=.5+.3*Math.sin(t*14+x);ell(x,y-20*sz,22*sz,26*sz,`rgba(255,${110+Math.round(60*f)},30,${.25+.15*f})`);}}
{const _dd=drawDecor;drawDecor=function(o){if(o.nr){if(o.g!=null&&o.g<1&&o.pst!=='burnt'){ctx.save();ctx.translate(o.x,o.y);ctx.scale(o.g,o.g);ctx.translate(-o.x,-o.y);const g=o.g;o.g=1;nrDrawDecor(o);o.g=g;ctx.restore();}else nrDrawDecor(o);return;}return _dd(o);};}
// ======================= realm creatures & soldiers =======================
// side: L = light (elves, dwarves, hobbits, centaurs) · D = dark (goblins, orcs, trolls, cyclopes) · W = wild dark beasts (wyverns, scorpions, spiders) · N = neutral (unicorns, satyrs, minotaurs)
// EVERY fighter of both sides attacks the dragon when it is close (ranged ones shoot, wyverns chase it in the air); otherwise they fight each other.
const NRS={
  hobbit:{hp:8,sp:88,side:'L',dm:.5,cd:1.6,rng:200,civ:1,food:12,sz:.75},
  hobsol:{hp:11,sp:134,side:'L',dm:2,cd:.6,food:12,sz:.75}, // hobbit soldier: quick, knife/short sword, frail
  elf:{hp:16,sp:100,side:'L',dm:2,cd:1.1,rng:330,food:16,sz:1,swR:105,swDm:2.6,swCd:.75,dash:1}, // bow at range, sword up close, dodge dash
  unirider:{hp:34,sp:150,side:'L',dm:2,cd:1.25,rng:340,food:44,sz:1.35,horn:5}, // elf on a unicorn: horn charge, then fall back and shoot
  dwarf:{hp:46,sp:62,side:'L',dm:4,cd:1.15,food:20,sz:.85,armor:.55}, // heavy armour: takes 55% damage
  centaur:{hp:34,sp:125,side:'L',dm:3,cd:1.2,rng:330,food:26,sz:1.35},
  unicorn:{hp:26,sp:165,side:'N',flee:300,food:40,sz:1.3},
  satyr:{hp:12,sp:140,side:'N',flee:260,food:14,sz:.95},
  minotaur:{hp:60,sp:78,side:'N',dm:6,cd:2,food:32,sz:1.45,tough:1,aggro:420},
  goblin:{hp:10,sp:108,side:'D',dm:2,cd:.8,food:10,sz:.8}, // sword goblin
  gobarch:{hp:9,sp:104,side:'D',dm:1.6,cd:1.2,rng:300,food:10,sz:.8}, // goblin archer
  orc:{hp:32,sp:84,side:'D',dm:4,cd:1.1,food:22,sz:1.1}, // great sword or battle axe
  troll:{hp:70,sp:56,side:'D',dm:6,cd:1.5,food:40,sz:1.6,tough:1,regen:1.5},
  cyclops:{hp:170,sp:48,side:'D',dm:9,cd:2.6,food:45,sz:2,tough:1},
  wyvern:{hp:34,sp:190,side:'W',dm:4,cd:1.4,food:22,sz:1.4,fly:1,aggro:700},
  scorpion:{hp:36,sp:72,side:'W',dm:4,cd:1.4,food:18,sz:1.3,fireRes:.5,aggro:380},
  spider:{hp:16,sp:132,side:'W',dm:2,cd:1,food:12,sz:1,aggro:440,web:1}};
const NR_SP=new Set(Object.keys(NRS));
const NR_NAMES={hobbit:'Hobbits',hobsol:'Hobbit soldiers',unirider:'Elf unicorn riders',gobarch:'Goblin archers',elf:'Elven warriors',dwarf:'Dwarves',centaur:'Centaurs',unicorn:'Unicorns',satyr:'Satyrs',minotaur:'Minotaurs',goblin:'Goblins',orc:'Orcs',troll:'Trolls',cyclops:'Cyclopes',wyvern:'Wyverns',scorpion:'Giant scorpions',spider:'Giant spiders'};
// food meter + health growth: exactly like other animals (HEAL heals, FOOD feeds the Glutton milestones), scaled by size
for(const k in NRS){HEAL[k]=NRS[k].food;FOOD[k]=NRS[k].food;FAUNA[k]={hp:NRS[k].hp,sp:NRS[k].sp,zone:'nr',flee:NRS[k].flee};}
ZONES.nr={ok:(x,y)=>nrInNorth(x,y),s:()=>({x:R(-14000,7000),y:R(-10500,-3200)})};
Object.assign(DG.ch,{hobsol:.3,unirider:.4,gobarch:.3,elf:.35,centaur:.3,unicorn:.45,satyr:.45,goblin:.3,wyvern:.35,spider:.4,hobbit:.25});
if(typeof tallyAddSect==='function'){tallyAddSect('nrlight','Northern Realms · Light lands','🧝','#d6c0ff',['elf','unirider','dwarf','hobbit','hobsol','centaur','unicorn','satyr','minotaur'].map(k=>[k,NR_NAMES[k]]));
  tallyAddSect('nrdark','Northern Realms · Dark lands','👹','#9ad06a',['goblin','gobarch','orc','troll','cyclops','wyvern','scorpion','spider'].map(k=>[k,NR_NAMES[k]]));}
function nrLvl(){return Math.max(1,(G&&G.lvl)||1);}
function nrHpMul(){return Math.min(1.8,1+.1*(nrLvl()-1));}
function nrIsFighter(u){const S=NRS[u.species];return !!(S.dm&&!S.civ);}
function nrEnemy(a,b){const A=NRS[a.species].side,B=NRS[b.species].side;return(A==='L'&&(B==='D'||B==='W'))||(B==='L'&&(A==='D'||A==='W'));}
let NRU=[]; // live realm units
function nrSpawn(sp,x,y,o){const S=NRS[sp],hp=Math.round(S.hp*nrHpMul());
  const u=mkUnit('animal',x,y,Object.assign({species:sp,wild:true,zone:'nr',nr:1,side:S.side,home:{x:x-200,y:y-150,w:400,h:300},hp,maxHp:hp,free:true,t:R(0,3),cd:R(0,1),z:S.fly?R(30,70):0,face:rnd()<.5?1:-1},o||{}));
  if(sp==='dwarf')u.wpn=rnd()<.5?'hammer':'axe';else if(sp==='orc')u.wpn=rnd()<.5?'gsword':'axe';
  units.push(u);NRU.push(u);return u;}
function nrGone(u){if(u.dead)return;u.dead=true;u.gone=true;}
// ---- projectiles (arrows, pebbles, webs) shared by all realm shooters ----
let NR_P=[];
function nrShoot(u,tx,ty,tz,kind,dmg,tgt){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy)||1,sp=kind==='web'?380:kind==='pebble'?300:520,T=d/sp;
  NR_P.push({x:u.x,y:u.y,z:(NRS[u.species].sz||1)*18,tz:tz||0,vx:dx/T,vy:dy/T,T,t:0,kind,dmg,tgt,src:u});}
function nrUpdP(dt){for(const p of NR_P){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t<p.T)continue;p.done=1;const g=p.tgt;
    if(g===D){if(!G.over&&!G.won&&Math.hypot(D.x-p.x,D.y-p.y)<46+(D.alt>.3?30:0)){if(p.kind==='web'){D.webT=2.5;float(D.x,D.y-heightOf()-80,'Webbed! Slowed down','#e8e8f0');}else hurtDragon(p.dmg,p.src&&p.src.species||'arrow');}}
    else if(g&&!g.dead&&Math.hypot(g.x-p.x,g.y-p.y)<34)nrHit(g,p.dmg,p.src);}
  if(NR_P.length)NR_P=NR_P.filter(p=>!p.done);}
function nrHit(v,d,by){if(!v||v.dead)return;if(v.dash>0){if(rnd()<.5)float(v.x,v.y-36,'Dodged!','#d8f0ff');return;}d*=NRS[v.species].armor||1;v.hp-=d;v.hitT=G.t;if(by&&!v.dead&&!v.tgt)v.tgt=by;if(v.hp<=0){v.hp=0;v.dead=true;v.nrKO=1;nrKO(v);G.nrKills=(G.nrKills||0)+1;}}
// ---- defeat: dizzy stars, then a friendly puff (no gore) ----
let NR_KO=[];
function nrKO(u){NR_KO.push({u:Object.assign({},u,{dead:false}),t:0});}
function nrUpdKO(dt){for(const k of NR_KO){k.t+=dt;if(k.t>=1.4&&!k.done){k.done=1;if(Math.abs(k.u.x-D.x)<2000&&Math.abs(k.u.y-D.y)<1500)puff(k.u.x,k.u.y-10,8,'rgba(235,235,245,',70,8);}}if(NR_KO.length)NR_KO=NR_KO.filter(k=>!k.done);}
let NR_MUTE=0;{const _p=puff;puff=function(){if(NR_MUTE)return;return _p.apply(this,arguments);};}
// dragon damage: scorpions shrug off half of the fire; a defeated creature goes dizzy and puffs away instead of the usual splat
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(!u||!u.nr||u.dead)return _hu.apply(this,arguments);if(src==='fire'&&NRS[u.species].fireRes)d*=NRS[u.species].fireRes;if(u.dash>0){G.nrDodged=(G.nrDodged||0)+1;return;}d*=NRS[u.species].armor||1;
  u.hitT=G.t;u.mad=G.t;NR_MUTE=1;let r;try{r=_hu.call(this,u,d,src);}finally{NR_MUTE=0;}if(u.dead&&!u.eaten){nrKO(u);float(u.x,u.y-30*(NRS[u.species].sz||1),'Dizzy!','#ffe28a');}return r;};}
{const _eu=eatUnit;eatUnit=function(u){if(!u||!u.nr)return _eu.apply(this,arguments);NR_MUTE=1;let r;try{r=_eu.apply(this,arguments);}finally{NR_MUTE=0;}
  puff(u.x,u.y-8,6,'rgba(240,240,250,',60,5);float(u.x,u.y-34,u.species==='hobbit'?'Gulp! (sorry, little fellow)':NRS[u.species].tough?'Big gulp!':'Gulp!','#ffd27a');G.nrEaten=(G.nrEaten||0)+1;return r;};}
// big ones (cyclopes, trolls, minotaurs) can only be swallowed once worn down below half health
{const _te=tryEat;tryEat=function(){let T=[];try{T=biteTargets();}catch(e){}
  const f=T[0];if(f&&f.nr&&NRS[f.species].tough&&f.hp>f.maxHp*.5&&T.every(u=>u.nr&&NRS[u.species].tough&&u.hp>u.maxHp*.5)){D.eatCD=.8;D.hp-=4*G.dmgMul;D.hurt=.3;f.mad=G.t;
    float(f.x,f.y-60,`The ${f.species} shoves you off! Wear it down first`,'#ffd27a');return;}
  if(f){const hold=[];for(const u of T)if(u.nr&&NRS[u.species].tough&&u.hp>u.maxHp*.5){hold.push(u);u.inside=true;}try{return _te.apply(this,arguments);}finally{for(const u of hold)u.inside=false;}}
  return _te.apply(this,arguments);};}
// webbed dragon is slowed
{const _uc=updCruise;updCruise=function(dt){const r=_uc.apply(this,arguments);if(D.webT>0){D.webT-=dt;return(typeof r==='number'?r:1)*.45;}return r;};}
// ---- realm AI ----
const NR_RINGS=[];const NR_SWEEP_R=170,NR_SWEEP_A=1.25,NR_SWEEP_WIND=.9; // cyclops ground-smash shock rings (visual)
function nrPastBorder(o){return o.y<nrDarkY(o.x)-NR_BORDER_M;}
function nrClamp(u){nrBarPush(u,true);if(u.side==='L'){const lim=nrDarkY(u.x)-NR_BORDER_M;if(u.y<lim)u.y=lim;}
  u.x=clamp(u.x,WX0+60,WX1-60);u.y=clamp(u.y,WY0+260,WY1-60);}
function nrFindFoe(u,r){let best=null,bd=r*r;for(const v of NRU){if(v.dead||v.inside||v===u||!nrEnemy(u,v))continue;if(u.side==='L'&&nrPastBorder(v))continue;
  const dx=v.x-u.x,dy=v.y-u.y,q=dx*dx+dy*dy;if(q<bd){bd=q;best=v;}}return best;}
function nrMeleeR(u){return 26+(NRS[u.species].sz||1)*12;}
function nrAttack(u,S,T,dt,isD){const d=Math.hypot(T.x-u.x,T.y-u.y),sp=S.sp*(u.role==='sq'&&u.sq&&u.sq.kind==='army'?1:1);
  if(Math.abs(T.x-u.x)>1)u.face=T.x>u.x?1:-1;
  const hitD=dmg=>{if(isD){hurtDragon(dmg,u.species);u.lastHitD=G.t;}else nrHit(T,dmg,u);};
  if(u.species==='cyclops'){ // giant club: slow wind-up, then a big wide sweep in front - heavy hit + knockback
    if(u.wind>0){u.wind-=dt;if(u.wind<=0){const fa=Math.atan2(u.sy-u.y,u.sx-u.x);NR_RINGS.push({x:u.x,y:u.y,t:0,sweep:1,a:fa});u.swings=(u.swings||0)+1;
        if(Math.abs(u.x-D.x)<1800&&Math.abs(u.y-D.y)<1300)G.shake=Math.max(G.shake,5);
        const inArc=(px,py)=>{const dx=px-u.x,dy=py-u.y,dd=Math.hypot(dx,dy);if(dd>NR_SWEEP_R)return false;if(dd<40)return true;let da=Math.abs(Math.atan2(dy,dx)-fa);if(da>Math.PI)da=TAU-da;return da<NR_SWEEP_A;};
        if(D.alt<.4&&!G.over&&inArc(D.x,D.y)){hurtDragon(S.dm,'cyclops');const a=Math.atan2(D.y-u.y,D.x-u.x);D.nrKb={vx:Math.cos(a)*650,vy:Math.sin(a)*650*.8,t:.35};float(D.x,D.y-90,'CLUB SWEEP!','#ffb0a0');}
        for(const v of NRU)if(!v.dead&&nrEnemy(u,v)&&inArc(v.x,v.y)){nrHit(v,S.dm*1.4,u);const a=Math.atan2(v.y-u.y,v.x-u.x);v.x+=Math.cos(a)*70;v.y+=Math.sin(a)*70;}}return;}
    if(d<NR_SWEEP_R-20&&u.cd<=0&&(!isD||D.alt<.4)){u.wind=NR_SWEEP_WIND;u.cd=S.cd;u.sx=T.x;u.sy=T.y;if(isD&&rnd()<.6)float(u.x,u.y-90,'Raaagh!','#ffe060');return;}if(d>nrMeleeR(u)+20)moveTo(u,T.x,T.y,sp,dt);return;}
  if(u.species==='unirider'){ // telegraphed horn charge (decent hit + small knockback), then fall back and shoot, repeat on cooldown
    if(u.tele>0){u.tele-=dt;if(u.tele<=0){u.chg=.8;u.chHit=0;u.ca=Math.atan2(T.y-u.y,T.x-u.x);}return;}
    if(u.chg>0){u.chg-=dt;u.x+=Math.cos(u.ca)*sp*2.4*dt;u.y+=Math.sin(u.ca)*sp*2.4*dt;u.anim=(u.anim||0)+dt*16;
      const hitR=isD?62:40;if(!u.chHit&&Math.hypot(T.x-u.x,T.y-u.y)<hitR&&(!isD||D.alt<.4)){u.chHit=1;u.charges=(u.charges||0)+1;const a=u.ca;
        if(isD){hurtDragon(S.horn,'unirider');D.nrKb={vx:Math.cos(a)*420,vy:Math.sin(a)*420*.8,t:.25};float(D.x,D.y-90,'Unicorn horn! -'+S.horn,'#ffd0f0');}else{nrHit(T,S.horn,u);T.x+=Math.cos(a)*45;T.y+=Math.sin(a)*45;}}
      if(u.chg<=0){u.kite=1.8;u.ucd=6;}return;}
    if(u.kite>0){u.kite-=dt;const a=Math.atan2(u.y-T.y,u.x-T.x);moveTo(u,u.x+Math.cos(a)*50,u.y+Math.sin(a)*50,sp,dt);if(d<S.rng&&u.cd<=0){u.cd=S.cd;nrShoot(u,T.x,T.y,isD?heightOf():0,'arrow',S.dm,T);}return;}
    u.ucd=(u.ucd||0)-dt;if(u.ucd<=0&&d<420&&d>90&&(!isD||D.alt<.4)){u.tele=.6;u.teles=(u.teles||0)+1;float(u.x,u.y-62,'Horn charge!','#ffd0f0');return;}}
  if(u.species==='elf'&&d<S.swR){u.swd=1;if(d>nrMeleeR(u))moveTo(u,T.x,T.y,sp,dt);else if(u.cd<=0){u.cd=S.swCd*R(.9,1.15);u.slashes=(u.slashes||0)+1;hitD(S.swDm);if(isD&&rnd()<.5)float(D.x+R(-20,20),D.y-90,'Sword slash!','#d8f0ff');}return;}
  if(u.species==='elf')u.swd=0;
  if(u.species==='minotaur'){if(u.chg>0){u.chg-=dt;u.x+=Math.cos(u.ca)*sp*2.6*dt;u.y+=Math.sin(u.ca)*sp*2.6*dt;u.anim+=dt*16;
      if(isD&&!u.chHit&&D.alt<.4&&Math.hypot(D.x-u.x,D.y-u.y)<60){u.chHit=1;hurtDragon(S.dm,'minotaur');float(D.x,D.y-90,'Horn bonk!','#ffb0a0');G.shake=Math.max(G.shake,6);}return;}
    if(d<420&&d>70&&u.cd<=0&&(!isD||D.alt<.4)){u.chg=1.1;u.chHit=0;u.ca=Math.atan2(T.y-u.y,T.x-u.x);u.cd=S.cd+1.6;float(u.x,u.y-60,'Snort! CHARGE!','#ffd0a0');return;}
    if(d>nrMeleeR(u))moveTo(u,T.x,T.y,sp*.7,dt);else if(u.cd<=0){u.cd=S.cd;hitD(S.dm);}return;}
  if(u.species==='wyvern'){if(d>50)moveTo(u,T.x,T.y,sp,dt);else if(u.cd<=0&&(!isD||Math.abs(u.z-heightOf())<60)){u.cd=S.cd;hitD(S.dm);if(isD)float(D.x,D.y-heightOf()-80,'Wyvern swoop! -'+S.dm,'#ffb0a0');
      const a=Math.atan2(u.y-T.y,u.x-T.x);u.x+=Math.cos(a)*90;u.y+=Math.sin(a)*90;}return;}
  if(u.species==='spider'&&isD&&d<360&&!(u.webCd>0)){u.webCd=4.5;nrShoot(u,D.x,D.y,heightOf(),'web',0,D);float(u.x,u.y-24,'Thwip!','#e8e8f0');}
  if(S.rng){if(d>S.rng*.9)moveTo(u,T.x,T.y,sp,dt);else if(isD&&d<S.rng*.35){const a=Math.atan2(u.y-T.y,u.x-T.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,sp*.8,dt);}
    if(d<S.rng&&u.cd<=0){u.cd=S.cd*R(.9,1.2);nrShoot(u,T.x,T.y,isD?heightOf():0,S.civ?'pebble':'arrow',S.dm,T);if(S.civ&&isD&&rnd()<.4)float(u.x,u.y-24,'Shoo! Shoo!','#fff3c0');}return;}
  if(d>nrMeleeR(u))moveTo(u,T.x,T.y,sp,dt);else if(u.cd<=0){u.cd=S.cd*R(.9,1.15);hitD(S.dm);if(isD&&rnd()<.5)float(D.x+R(-20,20),D.y-90,{goblin:'Stab stab!',hobsol:'Poke poke!',orc:u.wpn==='axe'?'Battle-axe chop!':'Great sword swing!',troll:'Club bonk!',dwarf:u.wpn==='hammer'?'Hammer smash!':'Axe chop!',scorpion:'Tail sting!',spider:'Nip!'}[u.species]||'Bonk!','#ffb0a0');}}
function nrWander(u,S,dt){if(!u.tgtP||u.t<=0){u.t=R(2,6);const H=u.home;u.tgtP={x:H.x+R(0,H.w),y:H.y+R(0,H.h)};}if(moveTo(u,u.tgtP.x,u.tgtP.y,S.sp*.25,dt))u.tgtP=null;}
function nrDash(u,fx,fy){if(u.dash>0||(u.dashCd||0)>G.t)return false;const a=Math.atan2(u.y-fy,u.x-fx)+(rnd()<.5?1.2:-1.2);u.dash=.3;u.dva=a;u.dashCd=G.t+3.2;u.dashes=(u.dashes||0)+1;G.nrDashes=(G.nrDashes||0)+1;float(u.x,u.y-40,'Dodge!','#d8f0ff');return true;}
function nrUpd(u,dt){const S=NRS[u.species],dd=Math.hypot(u.x-D.x,u.y-D.y),alive=!G.over&&!G.won;u.cd-=dt;u.t-=dt;if(u.webCd>0)u.webCd-=dt;
  if(u.dash>0){u.dash-=dt;u.x+=Math.cos(u.dva)*480*dt;u.y+=Math.sin(u.dva)*480*dt;nrClamp(u);return;}
  if(S.dash&&u.tgt&&!u.tgt.dead&&!NRS[u.tgt.species].rng&&Math.hypot(u.tgt.x-u.x,u.tgt.y-u.y)<nrMeleeR(u.tgt)+8&&(u.tgt.cd<.15||u.tgt.wind>0)&&rnd()<.5)nrDash(u,u.tgt.x,u.tgt.y);
  if(S.regen&&!(u.burn>0)&&u.hp<u.maxHp)u.hp=Math.min(u.maxHp,u.hp+S.regen*dt);
  if(S.fly){const tz=u.vsD&&D.alt>.2?heightOf():u.vsD?14:45+15*Math.sin(G.t*1.3+u.id*9);u.z+=(tz-u.z)*Math.min(1,dt*2.5);}
  if(u.dgT>0){nrClamp(u);return;}
  if(S.flee||S.civ){const fr=S.flee||190;if(u.burn>0||(alive&&dd<fr)){const a=Math.atan2(u.y-D.y,u.x-D.x)+R(-.3,.3);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,S.sp,dt);u.tgtP=null;}
    else if(S.civ&&alive&&dd<S.rng+60&&D.alt<.5){nrAttack(u,S,D,dt,true);}
    else if(u.role==='sq')nrSquadMove(u,S,dt);else nrWander(u,S,dt);nrClamp(u);return;}
  const canReach=S.rng||S.fly||D.alt<.4||(u.species==='spider'&&dd<360),aggro=S.aggro||(S.rng?S.rng+60:300);
  if(alive&&canReach&&(dd<aggro||(u.mad&&G.t-u.mad<4&&dd<aggro*1.8))&&!(u.side==='L'&&nrPastBorder(D))){u.vsD=1;u.tgt=null;nrAttack(u,S,D,dt,true);nrClamp(u);return;}
  u.vsD=0;if(u.chg>0)u.chg=0;
  const reach=u.sq&&u.sq.kind==='army'?1000:560;
  if(u.tgt&&(u.tgt.dead||u.tgt.inside||Math.hypot(u.tgt.x-u.x,u.tgt.y-u.y)>reach*1.4||(u.side==='L'&&nrPastBorder(u.tgt))))u.tgt=null;
  if(!u.tgt&&(u.seekT=(u.seekT||0)-dt)<=0){u.seekT=R(.35,.7);u.tgt=nrFindFoe(u,reach);}
  if(u.tgt){nrAttack(u,S,u.tgt,dt,false);nrClamp(u);return;}
  if(u.wind>0)u.wind=0;
  if(u.role==='sq')nrSquadMove(u,S,dt);else nrWander(u,S,dt);nrClamp(u);}
{const _uw=updWild;updWild=function(u,dt){if(u.nr){nrUpd(u,dt);return;}return _uw.apply(this,arguments);};updWild._base=_uw._base;}
// every other unit, creature and bird stays out of the north for good (only the player's dragon may ever cross the barrier)
function nrKeepOut(){for(const u of units){if(u.dead||u.nr||u.princess||u.nsea)continue;if(u.y<MWY0+300&&nrBarZone(u.x,u.y))nrBarPush(u,false);}
  if(typeof birds!=='undefined')for(const b of birds){if(!b.dead&&b.y<MWY0+300&&nrBarZone(b.x,b.y))nrBarPush(b,false);}
  for(const s of(typeof ships!=='undefined'?ships:[]))if(s&&s.y<MWY0+300&&nrBarZone(s.x,s.y))nrBarPush(s,false);}

// elves see dragon fire coming and dash out of it (hunter-style, on a cooldown) - the dash also dodges the dragon's bite and stomp
{const _af=applyFire;applyFire=function(ox,oy,dt){for(const u of NRU)if(!u.dead&&NRS[u.species].dash&&Math.abs(u.x-ox)<DR.fireRange+60&&Math.abs(u.y-oy)<DR.fireRange+60&&inFire(u.x,u.y,ox,oy))nrDash(u,D.x,D.y);
  const r=_af.apply(this,arguments);for(const u of NRU)if(u.dash>0&&u.burn>0&&NRS[u.species].dash)u.burn=0;return r;};}
// ======================= the faction war: patrols, vanguard raids, the 5-minute army march =======================
// Squads are abstract (cheap) while far from the dragon and become real units when it comes near.
const NR_WAR_T=180; // QUEUE 30: the big dark-vs-light march every 3 minutes (was 5)
// QUEUE 30: the big battle's announcements (toasts + horn) only show while the dragon is in the northern realms; elsewhere it happens silently
function nrWarSay(m,h){if(!(G&&D&&nrInNorth(D.x,D.y))){G.nrWarQuiet=(G.nrWarQuiet||0)+1;return false;}showToast(m);if(h)try{horn();}catch(e){}return true;}
let NRQ=[]; // squads
function nrStr(sp){const S=NRS[sp];return S.dm?S.hp/(S.armor||1)*(S.horn?S.dm+S.horn*.3:S.dm)/S.cd*(S.rng?1.2:1):0;}
function nrArmySize(l){return Math.min(46,16+4*((l||nrLvl())-1));}
function nrDarkMix(n,l){l=l||nrLvl();const out=[],bigs=Math.min(1+Math.floor(l/2),6),orcs=Math.min(Math.round((.25+.04*l)*n),Math.round(.45*n));
  for(let i=0;i<bigs;i++)out.push(['troll','cyclops'][i%2===0&&l>=3?1:0]);if(l>=4)out.push('wyvern');
  for(let i=0;i<orcs;i++)out.push('orc');let g=0;while(out.length<n)out.push(g++%5<2?'gobarch':'goblin');return out.slice(0,n);}
function nrLightMix(n,dark){const tgt=.9*dark.reduce((s,k)=>s+nrStr(k),0),out=[];const L=nrLvl(),cyc=L<=2?['hobsol','elf','hobsol','dwarf','elf','hobsol','elf','unirider']:L>=6?['elf','dwarf','unirider','elf','dwarf','hobsol','unirider','elf']:['hobsol','elf','dwarf','elf','hobsol','unirider','dwarf','elf'];let i=0,s=0;
  while(out.length<n){const k=cyc[i++%cyc.length];out.push(k);s+=nrStr(k);}
  // upgrade hobbit soldiers -> elves -> dwarves -> unicorn riders until the light army matches the dark strength (so tougher dark armies meet heavier light ones)
  const UP={hobsol:'elf',elf:'dwarf',dwarf:'unirider'};for(let j=0;s<tgt&&j<out.length*3;j++){const q=j%out.length;const up=UP[out[q]];if(up){s+=nrStr(up)-nrStr(out[q]);out[q]=up;}}
  return out;}
function nrMkSq(kind,side,list,route,o){const sq=Object.assign({kind,side,mem:list.map(sp=>({sp,hp:Math.round(NRS[sp].hp*nrHpMul())})),route,pi:0,x:route[0].x,y:route[0].y,st:'go',t:0,units:null},o||{});NRQ.push(sq);return sq;}
function nrSqSpeed(sq){let m=999;for(const k of sq.mem)m=Math.min(m,NRS[k.sp].sp);return Math.min(m,120)*(sq.kind==='army'?.75:.55);}
function nrMaterialize(sq){if(sq.units)return;sq.units=[];const n=sq.mem.length,cols=Math.max(3,Math.ceil(Math.sqrt(n*1.6)));
  sq.mem.forEach((m,i)=>{const ox=((i%cols)-(cols-1)/2)*46,oy=Math.floor(i/cols)*40;const u=nrSpawn(m.sp,sq.x+ox+R(-6,6),sq.y+oy+R(-6,6),{role:'sq',sq,off:{x:ox,y:oy}});u.hp=Math.min(u.maxHp,m.hp);u.mem=m;sq.units.push(u);});}
function nrDematerialize(sq){if(!sq.units)return;const keep=new Set();for(const u of sq.units){if(!u.dead){u.mem.hp=u.hp;keep.add(u.mem);nrGone(u);}}sq.mem=sq.mem.filter(m=>keep.has(m));sq.units=null;}
function nrSqSync(sq){if(!sq.units)return;const live=sq.units.filter(u=>!u.dead);if(live.length!==sq.units.length){const keep=new Set(live.map(u=>u.mem));sq.mem=sq.mem.filter(m=>keep.has(m));sq.units=live;}
  for(const u of live)u.mem.hp=u.hp;}
// formation follower
function nrSquadMove(u,S,dt){const sq=u.sq;if(!sq||sq.dead){nrWander(u,S,dt);return;}const fx=sq.x+u.off.x,fy=sq.y+u.off.y,d=Math.hypot(fx-u.x,fy-u.y);
  if(d>8)moveTo(u,fx,fy,Math.min(S.sp,d>120?S.sp:S.sp*.7),dt);else if(Math.abs(sq.vx||0)>.1)u.face=sq.vx>0?1:-1;}
function nrSqBusy(sq){return sq.units&&sq.units.some(u=>!u.dead&&(u.tgt||u.vsD));}
function nrSqAdvance(sq,dt){if(sq.wait>0){sq.wait-=dt;return false;}const p=sq.route[sq.pi];if(!p)return true;const dx=p.x-sq.x,dy=p.y-sq.y,d=Math.hypot(dx,dy);
  if(sq.units){const live=sq.units.filter(u=>!u.dead);if(live.length){let lag=0;for(const u of live)lag+=Math.hypot(u.x-(sq.x+u.off.x),u.y-(sq.y+u.off.y));if(lag/live.length>150)return false;}}
  if(d<12){sq.pi++;sq.vx=0;return sq.pi>=sq.route.length;}const s=Math.min(d,nrSqSpeed(sq)*dt);sq.x+=dx/d*s;sq.y+=dy/d*s;sq.vx=dx;return false;}
// abstract fight (Lanchester-ish) between two far-away squads
function nrAbsFight(A,B,dt){const pow=q=>q.mem.reduce((s,m)=>{const S=NRS[m.sp];return s+(S.dm&&!S.civ?S.dm/S.cd:0);},0);const pa=pow(A),pb=pow(B);
  const hit=(q,dmg)=>{while(dmg>0&&q.mem.length){const m=q.mem[RI(0,q.mem.length-1)],ar=NRS[m.sp].armor||1,d=Math.min(dmg,m.hp/ar);m.hp-=d*ar;dmg-=d;if(m.hp<=.01){q.mem.splice(q.mem.indexOf(m),1);G.nrKills=(G.nrKills||0)+1;}}};
  hit(B,pa*dt*.9);hit(A,pb*dt*.9);}
function nrSqDist(sq){return Math.hypot(sq.x-D.x,sq.y-D.y);}
function nrNearTown(sq,side){let b=null,bd=1e9;for(const t of NR_TOWNS){if(NR_LIGHT.has(t.k)!==(side==='L'))continue;const d=Math.hypot(t.x-sq.x,t.y-sq.y);if(d<bd){bd=d;b=t;}}return b;}
const NR_PATROL_ROADS=[['Silverleaf','Starwood'],['Moonglade','Emberforge'],['Bramblebottom','Thistledown'],['Silverleaf','Moonglade'],['Emberforge','Ironhold Gate']];
function nrUpdWar(dt){if(!G||G.over||G.won)return;
  const ka=typeof KA!=='undefined'&&KA&&['suit','charge','fight','dizzy'].includes(KA.phase); // the war pauses while King William fights
  if(!ka){G.nrWarT=(G.nrWarT||0)+dt;G.nrVanT=(G.nrVanT===undefined?50:G.nrVanT)-dt;}
  // --- the big march every 3 minutes ---
  if(!ka&&G.nrWarT>=NR_WAR_T&&!NRQ.some(q=>q.kind==='army')){G.nrWarT=0;nrMarch();}
  // --- vanguard raids ---
  if(!ka&&G.nrVanT<=0){G.nrVanT=R(45,75);if(NRQ.filter(q=>q.kind==='van').length<2)nrVanguard();}
  // --- light patrols (defensive, light lands only) ---
  if(NRQ.filter(q=>q.kind==='patrol').length<3){const r=NR_PATROL_ROADS[(G.nrPatI=(G.nrPatI||0)+1)%NR_PATROL_ROADS.length];
    if(!NRQ.some(q=>q.kind==='patrol'&&q.road===r)){const a=nrPt(r[0]),b=nrPt(r[1]),route=[...nrRoute(r[0],r[1]),...nrRoute(r[1],r[0])];
      const mix=r[0]==='Bramblebottom'?['hobsol','hobsol','elf','dwarf']:r[0]==='Emberforge'||r[0]==='Ironhold Gate'?['dwarf','dwarf','elf','hobsol']:['elf','elf','unirider','dwarf'];nrMkSq('patrol','L',mix,route,{road:r,loop:1});}}
  for(const sq of NRQ){if(sq.dead)continue;sq.t+=dt;
    const far=nrSqDist(sq),near=sq.kind==='army'?4000:3000,farR=sq.kind==='army'?5000:3800;
    if(!sq.units&&far<near&&!ka)nrMaterialize(sq);else if(sq.units&&far>farR)nrDematerialize(sq);
    nrSqSync(sq);
    if(!sq.mem.length){sq.dead=1;continue;}
    if(nrSqBusy(sq))continue;
    if(sq.st==='go'){if(nrSqAdvance(sq,dt)){if(sq.loop){sq.pi=0;}else if(sq.kind==='van'){sq.st='raid';sq.t=0;}else if(sq.kind==='army'){sq.st='battle';sq.t=0;}else sq.st='home';}}
    else if(sq.st==='raid'){ // goblins whoop around the village for a while, then head home
      if(!sq.units){if(sq.t>20)nrSqHome(sq);}else{sq.x+=Math.cos(sq.t*.7)*30*dt;sq.y+=Math.sin(sq.t*.9)*20*dt;if(sq.t>20)nrSqHome(sq);}}
    else if(sq.st==='home'){if(nrSqAdvance(sq,dt)){if(sq.units)for(const u of sq.units)nrGone(u);sq.dead=1;}}
    else if(sq.st==='battle'){}}
  // --- abstract fights: vanguards vs patrols nearby, and the big battle when far away ---
  for(const a of NRQ)if(!a.dead&&!a.units&&a.side==='D')for(const b of NRQ)if(!b.dead&&!b.units&&b.side==='L'&&Math.hypot(a.x-b.x,a.y-b.y)<500)nrAbsFight(a,b,dt);
  nrBattle(dt);
  if(NRQ.some(q=>q.dead))NRQ=NRQ.filter(q=>!q.dead);
  if(G.fc%30===0&&NRU.length)NRU=NRU.filter(u=>!u.dead);}
function nrSqHome(sq){const h=sq.homeT;sq.st='home';sq.route=nrRoute(sq.at||'BF',h);sq.pi=0;}
function nrMarch(){const n=nrArmySize(),dk=nrDarkMix(n),lt=nrLightMix(n,dk);
  const A=nrMkSq('army','D',dk,nrRoute('DC','BF').map((p,i,a)=>i===a.length-1?{x:NR_BF.x,y:NR_BF.y-90}:p),{homeT:'DC',at:'BF'});
  const B=nrMkSq('army','L',lt,nrRoute('LC','BF').map((p,i,a)=>i===a.length-1?{x:NR_BF.x,y:NR_BF.y+90}:p),{homeT:'LC',at:'BF'});
  A.foe=B;B.foe=A;G.nrBattles=(G.nrBattles||0)+1;G.nrArmy={d:dk.length,l:lt.length,t:G.t};
  nrWarSay(`📯 The dark army marches out of the Doomforge Citadel! (${dk.length} strong) — the Lumenspire Citadel sends ${lt.length} defenders to the border`,1);}
function nrBattle(dt){const A=NRQ.find(q=>q.kind==='army'&&q.side==='D'&&!q.dead),B=NRQ.find(q=>q.kind==='army'&&q.side==='L'&&!q.dead);
  if(!A&&!B)return;
  if(A&&B&&A.st==='battle'&&B.st==='battle'){A.bt=(A.bt||0)+dt;
    if(!A.units&&!B.units){nrAbsFight(A,B,dt);}
    else{ // when real, the soldiers actually fight: nudge both blocks together
      A.x+=(B.x-A.x)*Math.min(1,dt*.3)*.5;B.x+=(A.x-B.x)*Math.min(1,dt*.3)*.5;}
    const aL=A.mem.length,bL=B.mem.length;
    if(!aL||!bL||A.bt>120){const lightWon=!aL||A.bt>120;nrWarSay(lightWon?'🛡️ The light army holds the border! The dark survivors flee back to the Doomforge Citadel':'⚔️ The dark army broke through... the light army falls back to the Lumenspire Citadel');
      G.nrLastWin=lightWon?'L':'D';if(aL)nrSqHome(A);if(bL)nrSqHome(B);if(!lightWon&&aL){A.st='van';A.kind='van';A.st='go';A.route=nrRoute('BF','Silverleaf');A.pi=0;A.at='Silverleaf';}}}
  else if(A&&!B&&A.st==='battle'){A.kind='van';A.st='go';A.route=nrRoute('BF','Silverleaf');A.pi=0;A.at='Silverleaf';}
  else if(B&&!A&&B.st==='battle')nrSqHome(B);}
function nrVanguard(){const dark=NR_TOWNS.filter(t=>NR_DARK.has(t.k)&&t.k!=='cyclops'),light=NR_TOWNS.filter(t=>NR_LIGHT.has(t.k));
  const h={n:'DC'},tg=light[RI(0,light.length-1)];const n=RI(3,6),l=nrLvl(),mix=[];
  for(let i=0;i<n;i++)mix.push(i===0&&l>=3?'orc':rnd()<.18+.03*l?'orc':i%3===1?'gobarch':'goblin');if(l>=5&&rnd()<.4)mix[n-1]='troll';
  nrMkSq('van','D',mix,nrRoute(h.n,tg.n),{homeT:h.n,at:tg.n});G.nrVans=(G.nrVans||0)+1;
  if(Math.hypot(tg.x-D.x,tg.y-D.y)<5000||G.nrOpen)showToast(`🏴 A raiding party (${n}) leaves the Doomforge Citadel for ${tg.n}!`);}
// ======================= the Storm Wizard (boss) & the magic barrier =======================
// He stands on top of his tower on a small island in the NE deep sea and never leaves it. His health bar is a MAGIC SHIELD over him and his tower (q.js):
// break it and the barrier opens - for the dragon only - and he is left dizzy and edible.
const WZB={on:false,hp:0,maxHp:0,cd:2,spell:0,ice:[],marks:[],winds:[],koT:0,said:0,hitT:0,cast:0,stats:{ice:0,lightning:0,wind:0,melt:0}};
const WZ_DMG={ice:9,lightning:6,wind:1};
function wzMaxHp(){return Math.round(300*(1+.15*(nrLvl()-1))*(EASY?.7:1));}
function wzTop(){return{x:WZ.x,y:WZ.y-WZ.H-20};}
function wzStart(){WZB.on=true;if(!WZB.maxHp||WZB.lvl!==nrLvl()){WZB.maxHp=wzMaxHp();WZB.hp=G.nrWzHp>0?Math.min(G.nrWzHp,WZB.maxHp):WZB.maxHp;WZB.lvl=nrLvl();}WZB.cd=1.4;
  if(!WZB.said){WZB.said=1;showToast('🧙 The Storm Wizard: "None shall pass my barrier, wyrm!"');}}
function wzBeaten(){return !!(G&&G.wzBeat);} // 140: beaten THIS level (G.nrOpen = the barrier reward, kept until the dragon dies)
function wzHurt(d,how){if(!WZB.on||WZB.koT>0||wzBeaten())return;WZB.hp-=d;WZB.hitT=G.t;G.nrWzHp=Math.max(1,Math.round(WZB.hp));
  if(rnd()<.15)float(WZ.x+R(-30,30),WZ.y-WZ.H-60,how==='bite'?'Ouch! My beard!':'Yowch! Hot hot!','#e6d0ff');
  if(WZB.hp<=0){WZB.hp=0;WZB.koT=2;WZB.ice=[];WZB.marks=[];WZB.winds=[];float(WZ.x,WZ.y-WZ.H-70,'Dizzy wizard!','#ffe28a');}}
function wzCast(){const k=WZB.spell++%3,t=wzTop();WZB.cast=.5;
  if(k===0){const a0=Math.atan2(D.y-t.y,D.x-t.x),dd=Math.hypot(D.x-WZ.x,D.y-WZ.y);for(let i=0;i<5;i++){const a=a0+(i-2)*.13,sp=440,T=Math.max(.5,dd/sp);
      WZB.ice.push({x:WZ.x,y:WZ.y,z:WZ.H+20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vz:(heightOf()-WZ.H-20)/T,t:0,T:T+.6});}float(t.x,t.y-40,'Ice spikes!','#bfe8ff');WZB.stats.ice++;}
  else if(k===1){WZB.marks.push({x:D.x+D.vx*.35,y:D.y+D.vy*.35,t:1});float(t.x,t.y-40,'Lightning!','#fff3a0');WZB.stats.lightning++;}
  else{WZB.winds.push({r:30,t:0,hit:0});float(t.x,t.y-40,'Gust of wind!','#d8f0ff');WZB.stats.wind++;}}
function wzUpd(dt){const dd=Math.hypot(D.x-WZ.x,D.y-WZ.y);
  if(wzBeaten()){WZB.on=false;return;}
  if(WZB.koT>0){WZB.koT-=dt;if(WZB.koT<=0)wzDefeat();return;}
  if(!WZB.on){if(dd<1400&&!G.over&&!G.won)wzStart();else return;}
  if(dd>2600){WZB.on=false;WZB.ice=[];WZB.marks=[];WZB.winds=[];return;}
  if(WZB.cast>0)WZB.cast-=dt;
  WZB.cd-=dt;if(WZB.cd<=0&&!G.over&&!G.won){WZB.cd=EASY?3:2.2;wzCast();}
  for(const s of WZB.ice){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z=Math.max(0,s.z+s.vz*dt);
    if(!s.done&&Math.hypot(D.x-s.x,D.y-s.y)<42&&Math.abs(s.z-heightOf())<70){s.done=1;hurtDragon(WZ_DMG.ice,'ice');float(D.x,D.y-heightOf()-80,'Ice spike!','#bfe8ff');}
    if(s.t>s.T)s.done=1;}
  for(const m of WZB.marks){m.t-=dt;if(m.t<=0&&!m.done){m.done=1;m.flash=.25;if(Math.hypot(D.x-m.x,D.y-m.y)<90){hurtDragon(WZ_DMG.lightning,'lightning');float(D.x,D.y-heightOf()-80,'ZAP!','#fff3a0');}G.shake=Math.max(G.shake,3);}if(m.flash>0)m.flash-=dt;}
  for(const w of WZB.winds){w.t+=dt;w.r=30+870*Math.min(1,w.t/1.6);if(!w.hit&&Math.abs(dd-w.r)<60){w.hit=1;hurtDragon(WZ_DMG.wind,'wind');const a=Math.atan2(D.y-WZ.y,D.x-WZ.x);
      D.nrKb={vx:Math.cos(a)*1100,vy:Math.sin(a)*1100*.8,t:.65};float(D.x,D.y-heightOf()-80,'Whoooosh!','#d8f0ff');}}
  WZB.ice=WZB.ice.filter(s=>!s.done);WZB.marks=WZB.marks.filter(m=>!m.done||m.flash>0);WZB.winds=WZB.winds.filter(w=>w.t<1.7);}
const WZ_GOLD=0; // QUEUE 109: no gold in the fantasy lands - breaking his shield gives no gold (was 300); the barrier opening is the reward
function wzDefeat(){const had=!!G.nrOpen;WZB.on=false;G.wzBeat=1;G.nrOpen=1;if(!had)G.nrOpenT=G.t;G.nrWzHp=0;puff(WZ.x,WZ.y-WZ.H,14,'rgba(200,170,255,',90,10);sparkle(WZ.x,WZ.y-WZ.H,20);
  float(WZ.x,WZ.y-WZ.H-60,had?'Beaten again!':'The barrier opens!','#d8c8ff');showToast(had?`🛡️ The Storm Wizard is beaten again! The barrier stays open for you — the dizzy wizard can be gobbled up`:`🛡️ The magic shield shatters! The barrier to the Northern Realms opens for you — the dizzy wizard can be gobbled up`);try{horn();}catch(e){}G.nrWzWins=(G.nrWzWins||0)+1;}
// dragon fire: hurts the wizard and melts ice spikes into steam
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);
  if(WZB.on&&WZB.koT<=0&&inFire(WZ.x,WZ.y,ox,oy))wzHurt(DR.fireDps*.55*dt,'fire');
  for(const s of WZB.ice)if(!s.done&&inFire(s.x,s.y,ox,oy)){s.done=1;WZB.stats.melt++;G.nrMelt=(G.nrMelt||0)+1;puff(s.x,s.y-s.z,3,'rgba(235,245,255,',50,6);if(rnd()<.3)float(s.x,s.y-s.z-20,'Hiss! Melted','#e8f6ff');}
  return r;};}
{const _te=tryEat;tryEat=function(){if(WZB.on&&WZB.koT<=0&&Math.hypot(D.x-WZ.x,D.y-WZ.y)<150){D.eatCD=.6;wzHurt(14,'bite');float(D.x,D.y-90,'Chomp the tower!','#ffd27a');return;}return _te.apply(this,arguments);};}
// ---- the per-frame hook ----
let NR_BART=-9;
function nrTick(dt){
  if(D.nrKb){const k=D.nrKb;D.x+=k.vx*dt;D.y+=k.vy*dt;k.vx*=Math.pow(.05,dt);k.vy*=Math.pow(.05,dt);k.t-=dt;D.x=clamp(D.x,WX0+40,WX1-40);D.y=clamp(D.y,WY0+40,WY1-40);if(k.t<=0)D.nrKb=null;}
  if(!G.nrOpen&&nrBarZone(D.x,D.y)){nrBarPush(D,false);if(G.t-NR_BART>4){NR_BART=G.t;showToast(D.x>coastX(D.y)?'🌪️ Strong magic winds blow you back — defeat the Wizard!':'🔮 A magic barrier blocks the way — defeat the Wizard!');}}
  if(G.fc%4===0)nrKeepOut();
  nrUpdP(dt);nrUpdKO(dt);for(const r of NR_RINGS)r.t+=dt;if(NR_RINGS.length&&NR_RINGS[0].t>.6)NR_RINGS.shift();
  nrUpdWar(dt);nrPop(dt);wzUpd(dt);
  if(G.fc%60===0&&units.some(u=>u.nr&&u.dead))units=units.filter(u=>!(u.nr&&u.dead));}
{const _up=update;update=function(dt){const r=_up.apply(this,arguments);if(G&&scene==='play'&&!paused)nrTick(dt);return r;};}
// ---- residents of the towns and the wild things of each realm (spawned lazily near the dragon) ----
const NR_RES={elven:['elf','elf','unirider','elf','centaur'],shire:['hobbit','hobbit','hobbit','hobsol','hobsol'],dwarf:['dwarf','dwarf','dwarf','hobsol'],goblin:['goblin','gobarch','goblin','gobarch','troll'],orc:['orc','orc','goblin','gobarch'],cyclops:['cyclops','cyclops']};
const NR_AMB={elven:[['unicorn',3],['satyr',3],['centaur',1],['minotaur',1]],shire:[['hobbit',2],['satyr',1]],dwarf:[['dwarf',1],['minotaur',1]],
  goblin:[['spider',3],['troll',1],['wyvern',1],['scorpion',1]],orc:[['scorpion',2],['wyvern',2],['troll',1],['spider',1]],cyclops:[['scorpion',2],['wyvern',1],['troll',1],['spider',1]]};
function nrPick(tab){let s=0;for(const t of tab)s+=t[1];let r=rnd()*s;for(const t of tab){r-=t[1];if(r<=0)return t[0];}return tab[0][0];}
let NR_POPT=0;
function nrPop(dt){NR_POPT-=dt;if(NR_POPT>0)return;NR_POPT=1;const nearN=D.y<MWY0+1600;
  for(const t of NR_TOWNS){const d=Math.hypot(t.x-D.x,t.y-D.y);
    if(t.res){const live=NRU.filter(u=>u.town===t&&!u.dead);if(!live.length){t.res=0;t.cool=G.t+60;}else if(d>3000){for(const u of live)nrGone(u);t.res=0;}}
    else if(d<1800&&!(t.cool>G.t)){t.res=1;for(const sp of NR_RES[t.k]){const a=R(0,TAU),r=R(80,260);nrSpawn(sp,t.x+Math.cos(a)*r,t.y+Math.sin(a)*r*.7,{role:'res',town:t,home:{x:t.x-330,y:t.y-230,w:660,h:460}});}}}
  let n=0;for(const u of NRU){if(u.dead||u.role!=='amb')continue;if(Math.hypot(u.x-D.x,u.y-D.y)>3300)nrGone(u);else n++;}
  if(!nearN)return;
  for(let k=0;k<3&&n<22;k++){const a=R(0,TAU),r=R(900,1700),x=D.x+Math.cos(a)*r,y=D.y+Math.sin(a)*r*.75;if(y>nrEdge(x)-80||x>coastX(y)-80||inSea(x,y)||y<WY0+400||x<WX0+300)continue;
    const rk=nrRealm(x,y);if(!rk)continue;if(NR_TOWNS.some(t=>Math.hypot(t.x-x,t.y-y)<350))continue;const sp=nrPick(NR_AMB[rk]);
    if(NRS[sp].side==='L'&&y<nrDarkY(x)-NR_BORDER_M)continue;nrSpawn(sp,x,y,{role:'amb',home:{x:x-350,y:y-260,w:700,h:520}});n++;}}
// ---- saves: the war timer, the wizard and the unlock ride along in G (nrWarT, nrVanT, nrOpen, nrWzHp); old saves get their fog shifted to the bigger map ----
let NR_FOGOFF=0;
{const _uf=svUnfog;svUnfog=function(s){if(!NR_FOGOFF||!s)return _uf.apply(this,arguments);for(let i=0;i<s.length;i++){const n=parseInt(s[i],16);for(let b=0;b<4;b++){const j=i*4+b+NR_FOGOFF;if(j<FOG.length&&(n>>b)&1)FOG[j]=1;}}fogDirty=true;};}
{const _ss=svSnapshot;svSnapshot=function(){const d=_ss.apply(this,arguments);d.FY0=WY0;return d;};}
{const _sa=svApply;svApply=function(d){NR_FOGOFF=d&&d.FY0===undefined?Math.round((MWY0-WY0)/FG)*FW:0;let r;try{r=_sa.apply(this,arguments);}finally{NR_FOGOFF=0;}nrReset(true);return r;};}
function nrReset(keepG){for(const u of NRU)nrGone(u);NRU=[];NRQ=[];NR_P=[];NR_KO=[];NR_RINGS.length=0;for(const t of NR_TOWNS){t.res=0;t.cool=0;}
  Object.assign(WZB,{on:false,hp:0,maxHp:0,cd:2,spell:0,ice:[],marks:[],winds:[],koT:0,said:0,cast:0});D.nrKb=null;D.webT=0;
  if(!keepG){G.nrWarT=0;G.nrVanT=50;G.nrOpen=0;G.wzBeat=0;G.nrWzHp=0;}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);nrReset(false);return r;};}
// ======================= drawing the realm folk =======================
function nrEyes(x,y,n,gap,r){for(let i=0;i<n;i++){const ex=x+(i-(n-1)/2)*gap;ell(ex,y,r*2.4,r*2.4,'rgba(255,40,30,.28)');ell(ex,y,r,r,'#ff3020');ell(ex-r*.3,y-r*.3,r*.35,r*.35,'#ffd0c0');}}
function nrLegs(x,y,s,a,c,w,sp){line(x-sp*s,y-8*s,x-sp*s+a*3*s,y,c,w*s);line(x+sp*s,y-8*s,x+sp*s-a*3*s,y,c,w*s);}
function nrHumanoid(x,y,s,f,a,o){const h=o.h||22; // generic little person
  nrLegs(x,y,s,a,o.leg,3.2,3);ell(x,y-h*.55*s,7*s*(o.wide||1),h*.32*s,o.body);if(o.belt)line(x-6*s*(o.wide||1),y-h*.45*s,x+6*s*(o.wide||1),y-h*.45*s,o.belt,2*s);
  line(x+5*s*f,y-h*.7*s,x+10*s*f,y-h*.45*s+a*2*s,o.skin,3*s);ell(x,y-h*s,6*s*(o.head||1),6*s*(o.head||1),o.skin);ell(x+2.5*s*f,y-h*s-1*s,1.1*s,1.1*s,o.eye||'#222');}
const NR_DRAW={
  hobbit(x,y,s,f,a,u){ell(x-3*s,y,4*s,2*s,'#c08a5a');ell(x+3*s,y,4*s,2*s,'#c08a5a');nrHumanoid(x,y,s,f,a,{leg:'#7a5a3a',body:'#4e8a3a',belt:'#d8b04a',skin:'#f0c8a0',h:20,wide:1.15,head:1.1});
    for(let i=0;i<5;i++)ell(x-4*s+i*2*s,y-25*s,2.6*s,2.6*s,'#7a4a24');ell(x-5*s*f,y-20*s,2*s,1.4*s,'#f0c8a0');},
  elf(x,y,s,f,a,u){if(u.dash>0){ctx.globalAlpha=.35;nrHumanoid(x-Math.cos(u.dva)*14,y-Math.sin(u.dva)*10,s,f,a,{leg:'#3a5a3a',body:'#2f7a5a',skin:'#f4e0cc',h:28,wide:.85,head:.9});ctx.globalAlpha=1;}
    nrHumanoid(x,y,s,f,a,{leg:'#3a5a3a',body:'#2f7a5a',belt:'#c8c0ff',skin:'#f4e0cc',h:28,wide:.85,head:.9});
    poly([x-6*s,y-27*s,x+6*s,y-27*s,x,y-36*s],'#e8e0a8');poly([x-5*s*f,y-25*s,x-11*s*f,y-28*s,x-5*s*f,y-23*s],'#f4e0cc');
    if(u.swd){const sw=Math.sin(G.t*14+u.id*7);line(x+9*s*f,y-14*s,x+(16+sw*4)*s*f,y-(30-sw*6)*s,'#e8f0ff',2*s);line(x+7*s*f,y-15*s,x+12*s*f,y-13*s,'#c8a040',2*s);
      ctx.strokeStyle='#8a5a2a';ctx.lineWidth=1.4*s;ctx.beginPath();ctx.arc(x-6*s*f,y-17*s,7*s,0,TAU);ctx.stroke();}
    else{ctx.strokeStyle='#8a5a2a';ctx.lineWidth=1.8*s;ctx.beginPath();ctx.arc(x+10*s*f,y-17*s,9*s,f>0?-1.3:1.84,f>0?1.3:4.44);ctx.stroke();line(x+10*s*f+(f>0?2.4:-2.4)*s,y-26*s,x+10*s*f+(f>0?2.4:-2.4)*s,y-8*s,'#ddd',.8);line(x-5*s*f,y-6*s,x-5*s*f,y-20*s,'#9aa',1.4*s);}
    if(GFX_HI)ell(x,y-14*s,12*s,16*s,'rgba(200,180,255,.08)');},
  hobsol(x,y,s,f,a,u){ell(x-3*s,y,4*s,2*s,'#c08a5a');ell(x+3*s,y,4*s,2*s,'#c08a5a');nrHumanoid(x,y,s,f,a,{leg:'#5a4a3a',body:'#6a7a8a',belt:'#8a5a2a',skin:'#f0c8a0',h:20,wide:1.1,head:1.1});
    ell(x,y-25*s,7*s,3.6*s,'#9aa4b0');rect(x-7*s,y-25*s,14*s,1.6*s,'#7a8490');poly([x-5*s,y-18*s,x+5*s,y-18*s,x+4*s,y-8*s,x-4*s,y-8*s],'#4e8a3a');
    const st=Math.sin(G.t*16+u.id*5);line(x+9*s*f,y-11*s,x+(15+st*2)*s*f,y-(16+st*2)*s,'#e0e8f0',1.8*s);line(x+8*s*f,y-11*s,x+10*s*f,y-10*s,'#6a4a2a',2*s);},
  unirider(x,y,s,f,a,u){const tele=u.tele>0,chg=u.chg>0;if(chg){ctx.globalAlpha=.3;NR_DRAW.unicorn(x-Math.cos(u.ca)*20,y-Math.sin(u.ca)*14,s,f,a,u);ctx.globalAlpha=1;}
    NR_DRAW.unicorn(x,y,s,f,a,u);nrHumanoid(x-1*s*f,y-17*s,s*.85,f,0,{leg:'#3a5a3a',body:'#2f7a5a',belt:'#c8c0ff',skin:'#f4e0cc',h:22,wide:.85,head:.9});
    poly([x-5*s-1*s*f,y-39*s,x+5*s-1*s*f,y-39*s,x-1*s*f,y-47*s],'#e8e0a8');
    ctx.strokeStyle='#8a5a2a';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.arc(x+7*s*f,y-33*s,7*s,f>0?-1.3:1.84,f>0?1.3:4.44);ctx.stroke();
    if(tele||chg){const p=tele?.5+.5*Math.sin(G.t*30):1;ell(x+23*s*f,y-42*s,(8+6*p)*s,(8+6*p)*s,`rgba(255,220,250,${.35+.35*p})`);if(tele)txt('!',x,y-62*s,14,'#ffd0f0','center');}},
  gobarch(x,y,s,f,a,u){nrHumanoid(x,y,s,f,a,{leg:'#4a5a2a',body:'#5a4a2a',belt:'#3a2a1a',skin:'#7ab040',h:20,wide:1,head:1.2,eye:'#ffe040'});
    poly([x-6*s,y-21*s,x-15*s,y-25*s,x-6*s,y-18*s],'#7ab040');poly([x+6*s,y-21*s,x+15*s,y-25*s,x+6*s,y-18*s],'#7ab040');poly([x-6*s,y-25*s,x+6*s,y-25*s,x,y-33*s],'#3a3a2a');
    ctx.strokeStyle='#5a3a1a';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.arc(x+9*s*f,y-14*s,8*s,f>0?-1.3:1.84,f>0?1.3:4.44);ctx.stroke();line(x-5*s*f,y-6*s,x-6*s*f,y-19*s,'#7a5a3a',1.6*s);},
  dwarf(x,y,s,f,a,u){nrHumanoid(x,y,s,f,a,{leg:'#4a4a52',body:'#8a929e',belt:'#d8a040',skin:'#f0c0a0',h:22,wide:1.5,head:1.1});
    rect(x-8*s,y-19*s,16*s,3*s,'#6a727e');ell(x-7*s,y-17*s,3.4*s,2.6*s,'#a8b0bc');ell(x+7*s,y-17*s,3.4*s,2.6*s,'#a8b0bc'); // plate armour + pauldrons
    poly([x-6*s,y-21*s,x+6*s,y-21*s,x+4*s*f,y-8*s,x-1*s*f,y-6*s],'#d8702a');ell(x,y-27*s,7.5*s,4.5*s,'#8a96a8');rect(x-7.5*s,y-27*s,15*s,2*s,'#6a7686');rect(x-1*s,y-33*s,2*s,4*s,'#8a96a8');
    line(x+9*s*f,y-30*s,x+9*s*f,y-4*s,'#6a4a2a',2.2*s);
    if(u.wpn==='hammer')rect(x+9*s*f-6*s,y-35*s,12*s,7*s,'#7a8290');else poly([x+9*s*f,y-30*s,x+17*s*f,y-34*s,x+18*s*f,y-21*s,x+9*s*f,y-24*s],'#c8d0dc');},
  centaur(x,y,s,f,a,u){ell(x,y+1,16*s,4*s,'rgba(0,0,0,.2)');for(const lx of[-10,-5,6,11])line(x+lx*s,y-12*s,x+lx*s+Math.sin(u.anim+lx)*3*s,y,'#6a4026',2.6*s);
    ell(x,y-15*s,15*s,7*s,'#9a6038');line(x-14*s*f,y-16*s,x-21*s*f,y-8*s,'#3a2414',3*s);
    ell(x+10*s*f,y-25*s,5.5*s,9*s,'#2f6a4a');ell(x+10*s*f,y-36*s,5*s,5*s,'#e8c49c');ell(x+9*s*f,y-39*s,5.5*s,3*s,'#5a3418');ell(x+12*s*f,y-37*s,.9*s,.9*s,'#222');
    ctx.strokeStyle='#8a5a2a';ctx.lineWidth=1.8*s;ctx.beginPath();ctx.arc(x+17*s*f,y-27*s,8*s,f>0?-1.3:1.84,f>0?1.3:4.44);ctx.stroke();},
  unicorn(x,y,s,f,a,u){for(const lx of[-9,-4,6,10])line(x+lx*s,y-11*s,x+lx*s+Math.sin(u.anim+lx)*3*s,y,'#e8e8f4',2.6*s);ell(x,y-14*s,14*s,7*s,'#fbfbff');
    poly([x+8*s*f,y-17*s,x+15*s*f,y-29*s,x+20*s*f,y-27*s,x+14*s*f,y-14*s],'#fbfbff');ell(x+18*s*f,y-29*s,6*s,4*s,'#fbfbff');ell(x+20*s*f,y-30*s,.9*s,.9*s,'#334');
    line(x+18*s*f,y-32*s,x+23*s*f,y-42*s,'#ffd84a',2*s);const M=['#ff9ad8','#b89aff','#8ad8ff','#a8ffb8'];for(let i=0;i<4;i++)ell(x+(13-i*2)*s*f,y-(30-i*3.5)*s,2.6*s,2.2*s,M[i]);
    for(let i=0;i<3;i++)ell(x-(15+i*2)*s*f,y-(14-i*2)*s,2.6*s,2*s,M[i]);if(GFX_HI)ell(x,y-16*s,22*s,16*s,'rgba(255,230,255,.1)');},
  satyr(x,y,s,f,a,u){line(x-3*s,y-9*s,x-4*s+a*3*s,y,'#6a4a30',3*s);line(x+3*s,y-9*s,x+4*s-a*3*s,y,'#6a4a30',3*s);ell(x,y-9*s,6*s,4*s,'#7a5638');
    ell(x,y-16*s,5*s,6*s,'#e8c09a');ell(x,y-24*s,5*s,5*s,'#e8c09a');ell(x,y-27*s,5.5*s,3*s,'#6a3a1a');line(x-3*s,y-28*s,x-6*s,y-33*s,'#d8c8a8',1.6*s);line(x+3*s,y-28*s,x+6*s,y-33*s,'#d8c8a8',1.6*s);
    ell(x+2*s*f,y-24*s,.9*s,.9*s,'#222');for(let i=0;i<4;i++)rect(x+(5+i*2)*s*f-(f<0?2*s:0),y-22*s,1.6*s,(6-i)*s,'#c8a050');},
  minotaur(x,y,s,f,a,u){const c=u.chg>0?'#a04a2a':'#7a4a2a';nrLegs(x,y,s,a,'#4a2a18',4,4);ell(x,y-16*s,10*s,10*s,c);rect(x-8*s,y-11*s,16*s,4*s,'#5a3a1a');
    line(x+7*s*f,y-20*s,x+13*s*f,y-10*s+a*2*s,c,4*s);ell(x+3*s*f,y-28*s,7*s,6.5*s,c);ell(x+7*s*f,y-25*s,4*s,3*s,'#c89070');
    poly([x-2*s,y-32*s,x-11*s,y-37*s,x-8*s,y-31*s],'#f0ecd8');poly([x+8*s,y-32*s,x+17*s,y-37*s,x+14*s,y-31*s],'#f0ecd8');ell(x+5*s*f,y-30*s,1.2*s,1.2*s,'#222');
    ctx.strokeStyle='#ffd84a';ctx.lineWidth=1.2*s;ctx.beginPath();ctx.arc(x+9*s*f,y-23*s,2*s,0,TAU);ctx.stroke();},
  goblin(x,y,s,f,a,u){nrHumanoid(x,y,s,f,a,{leg:'#4a5a2a',body:'#6a5a3a',belt:'#3a2a1a',skin:'#7ab040',h:20,wide:1,head:1.2,eye:'#ffe040'});
    poly([x-6*s,y-21*s,x-15*s,y-25*s,x-6*s,y-18*s],'#7ab040');poly([x+6*s,y-21*s,x+15*s,y-25*s,x+6*s,y-18*s],'#7ab040');
    line(x+11*s*f,y-9*s,x+16*s*f,y-19*s,'#b8b8c0',1.6*s);ell(x+3*s*f,y-16*s,2.4*s,1*s,'#2a3a1a');},
  orc(x,y,s,f,a,u){nrHumanoid(x,y,s,f,a,{leg:'#3a3a3a',body:'#5a5a62',belt:'#8a2a1a',skin:'#6a8a5a',h:26,wide:1.35,head:1.15});
    rect(x-8*s,y-20*s,16*s,3*s,'#3a3a40');poly([x-1*s,y-23*s,x+1*s,y-27*s,x+2*s,y-23*s],'#f0ecd8');poly([x+4*s*f,y-23*s,x+5*s*f,y-27*s,x+6*s*f,y-23*s],'#f0ecd8');
    if(u.wpn==='axe'){line(x+12*s*f,y-6*s,x+12*s*f,y-34*s,'#5a3a1a',2.4*s);poly([x+12*s*f,y-34*s,x+22*s*f,y-38*s,x+23*s*f,y-24*s,x+12*s*f,y-27*s],'#a8acb8');poly([x+12*s*f,y-34*s,x+4*s*f,y-37*s,x+4*s*f,y-27*s,x+12*s*f,y-28*s],'#a8acb8');}
    else{line(x+12*s*f,y-10*s,x+12*s*f,y-4*s,'#5a3a1a',2.4*s);rect(x+8*s*f-(f<0?0:0)-2*s,y-11*s,12*s,2.4*s,'#8a6a2a');poly([x+10.5*s*f,y-11*s,x+13.5*s*f,y-11*s,x+12.8*s*f,y-42*s,x+12*s*f,y-45*s,x+11.2*s*f,y-42*s],'#c8ccd8');}},
  troll(x,y,s,f,a,u){nrLegs(x,y,s,a,'#5a6a7a',4.5,4);ell(x,y-15*s,11*s,11*s,'#7a8a9a');ell(x-2*s,y-12*s,7*s,6*s,'#8a9aaa');
    line(x-8*s*f,y-18*s,x-11*s*f,y-4*s,'#7a8a9a',4*s);line(x+8*s*f,y-18*s,x+14*s*f,y-6*s+a*2*s,'#7a8a9a',4*s);
    line(x+14*s*f,y-6*s,x+20*s*f,y-24*s,'#6a4a2a',4*s);ell(x+20*s*f,y-25*s,4*s,5*s,'#6a4a2a');
    ell(x+2*s*f,y-28*s,6*s,6*s,'#7a8a9a');ell(x+7*s*f,y-27*s,3*s,2.2*s,'#8a9aaa');ell(x+3*s*f,y-30*s,1.2*s,1.2*s,'#ffe060');if(u.hp<u.maxHp&&!(u.burn>0)&&rnd()<.04)sparkle(x,y-20*s,1);},
  cyclops(x,y,s,f,a,u){const up=u.wind>0?1-u.wind/NR_SWEEP_WIND:0;nrLegs(x,y,s,a,'#c09070',4.5,4);ell(x,y-15*s,11*s,11*s,'#d8a882');rect(x-10*s,y-9*s,20*s,5*s,'#7a5a3a');
    const ang=u.wind>0?-1.9-up*.9:-.6,hx=x+12*s*f,hy=y-18*s,L=26*s;line(x+8*s*f,y-20*s,hx,hy,'#d8a882',4*s);
    const cx=hx+Math.cos(ang)*L*f,cy=hy+Math.sin(ang)*L;line(hx,hy,cx,cy,'#5a3a1a',4.5*s);ell(cx,cy,7*s,8*s,'#5a3a1a');ell(cx+2*s*f,cy-3*s,2*s,2*s,'#7a5a3a');
    ell(x+1*s*f,y-29*s,7*s,7*s,'#d8a882');ell(x+2*s*f,y-30*s,3.4*s,3*s,'#fff');ell(x+3*s*f,y-30*s,1.7*s,1.7*s,'#3a6aa8');line(x-3*s,y-34*s,x+6*s,y-34*s,'#6a3a1a',1.6*s);
    if(u.wind>0){txt('!',x,y-50*s,16,'#ffe060','center');ctx.strokeStyle=`rgba(255,220,120,${.25+.3*up})`;ctx.lineWidth=3;ctx.beginPath();const fa=Math.atan2((u.sy||y)-u.y,(u.sx||x)-u.x);ctx.ellipse(x,y,NR_SWEEP_R,NR_SWEEP_R*.6,0,fa-NR_SWEEP_A,fa+NR_SWEEP_A);ctx.stroke();}},
  wyvern(x,y,s,f,a,u){const z=u.z||40,fl=Math.sin(G.t*10+u.id*20);ell(x,y,12*s,4*s,'rgba(0,0,0,.22)');const Y=y-z;
    ell(x,Y-6*s,12*s,6*s,'#4a3a6a');line(x-11*s*f,Y-6*s,x-24*s*f,Y-2*s+fl*2*s,'#4a3a6a',3*s);poly([x-24*s*f,Y-2*s,x-30*s*f,Y-5*s,x-28*s*f,Y+2*s],'#7a3a5a');
    for(const sd of[-1,1])poly([x-2*s,Y-8*s,x+4*s*sd,Y-(20+fl*10)*s,x+16*s*sd,Y-(14+fl*12)*s,x+12*s*sd,Y-6*s],sd>0?'#6a4a8a':'#5a3a7a');
    line(x+9*s*f,Y-8*s,x+15*s*f,Y-15*s,'#4a3a6a',3*s);ell(x+18*s*f,Y-16*s,5*s,3*s,'#4a3a6a');nrEyes(x+20*s*f,Y-17*s,1,0,1.1*s);},
  scorpion(x,y,s,f,a,u){ell(x,y+1,16*s,5*s,'rgba(0,0,0,.25)');for(let i=0;i<4;i++){const lx=(i-1.5)*5*s,w=Math.sin(u.anim+i)*2*s;line(x+lx,y-4*s,x+lx-7*s,y+w,'#1a1424',1.6*s);line(x+lx,y-4*s,x+lx+7*s,y-w,'#1a1424',1.6*s);}
    ell(x,y-5*s,11*s,5*s,'#2a2038');ell(x+1*s*f,y-6*s,7*s,3.4*s,'#3a2e4e');
    for(const sd of[-1,1]){line(x+9*s*f,y-5*s+sd*2*s,x+16*s*f,y-4*s+sd*5*s,'#2a2038',2*s);ell(x+18*s*f,y-4*s+sd*5*s,3.4*s,2.2*s,'#3a2e4e');}
    let px=x-9*s*f,py=y-6*s;for(let i=0;i<5;i++){const nx=px-(4-i*2.2)*s*f,ny=py-5*s;ell(nx,ny,3*s,2.6*s,'#2a2038');px=nx;py=ny;}poly([px,py-2*s,px+7*s*f,py+1*s,px+1*s*f,py+3*s],'#8a2a3a');
    nrEyes(x+8*s*f,y-8*s,2,2.4*s,.9*s);},
  spider(x,y,s,f,a,u){ell(x,y+1,13*s,4*s,'rgba(0,0,0,.25)');for(let i=0;i<4;i++){const lx=(i-1.5)*3.5*s,w=Math.sin(u.anim*1.4+i*1.7)*3*s;
      for(const sd of[-1,1]){ctx.strokeStyle='#14101c';ctx.lineWidth=1.6*s;ctx.beginPath();ctx.moveTo(x+lx,y-7*s);ctx.lineTo(x+lx*1.8+sd*0,y-14*s+w*.5);ctx.lineTo(x+lx*2.6+sd*w,y+sd*1.5*s);ctx.stroke();}}
    ell(x-6*s*f,y-8*s,8*s,7*s,'#1e1828');ell(x-7*s*f,y-11*s,3*s,2*s,'#5a2a3a');ell(x+4*s*f,y-8*s,5*s,4.5*s,'#2a2236');nrEyes(x+6*s*f,y-9*s,3,1.9*s,.75*s);}};
{const _da=drawAnimal;drawAnimal=function(u){if(!u.nr)return _da.apply(this,arguments);nrDrawU(u,0);};}
function nrDrawU(u,ko){const S=NRS[u.species],s=S.sz||1,f=u.face||1,x=u.x,y=u.y,a=Math.sin(u.anim||0);
  if(!S.fly)ell(x,y+1,10*s,3.5*s,'rgba(0,0,0,.22)');
  if(ko){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(ko*9)*.25);ctx.translate(-x,-y);ctx.globalAlpha=Math.max(0,1-Math.max(0,ko-1)*2.5);}
  NR_DRAW[u.species](x,y,s,f,ko?0:a,u);
  if(ko){ctx.restore();const top=y-(S.fly?(u.z||40):0)-40*s;for(let i=0;i<3;i++){const an=G.t*5+i*TAU/3;txt('★',x+Math.cos(an)*12*s,top+Math.sin(an)*4,10,'#ffe060','center');}return;}
  if(G.t-(u.hitT||-9)<.12){ctx.globalAlpha=.45;ell(x,y-14*s-(S.fly?u.z:0),13*s,14*s,'#fff');ctx.globalAlpha=1;}
  if(u.burn>0&&rnd()<.5)smoke(x,y-10);
  if((S.tough||S.side==='D'||S.side==='L')&&u.hp<u.maxHp&&Math.hypot(x-D.x,y-D.y)<700){const w=22*s,top=y-(S.fly?u.z:0)-46*s;rect(x-w/2,top,w,3,'rgba(0,0,0,.5)');rect(x-w/2,top,w*u.hp/u.maxHp,3,S.side==='L'?'#7ad0ff':'#ff7050');
    if(S.tough&&u.hp<=u.maxHp*.5)txt('🍖',x+w/2+6,top+4,9,'#fff','center',false);}}
// projectiles, KO'd folk, smash rings, the wizard and his spells (drawn on top)
var SP47={r:0,ok:-1,done:{}};// (item 47) per-render bookkeeping: set pieces already drawn behind the low dragon
function nrDrawFx(){const x0=cam.x-VW/cam.z/2-200,x1=cam.x+VW/cam.z/2+200,y0=cam.y-VH/cam.z/2-300,y1=cam.y+VH/cam.z/2+300,on=(x,y)=>x>x0&&x<x1&&y>y0&&y<y1;
  for(const p of NR_P){if(!on(p.x,p.y))continue;const k=p.t/p.T,z=p.z+(p.tz-p.z)*k+Math.sin(k*Math.PI)*40,Y=p.y-z;
    if(p.kind==='web'){ell(p.x,Y,6,6,'rgba(240,240,250,.8)');line(p.x-6,Y,p.x+6,Y,'#fff',1);line(p.x,Y-6,p.x,Y+6,'#fff',1);}
    else if(p.kind==='pebble')ell(p.x,Y,2.5,2.5,'#8a8070');else{const a=Math.atan2(p.vy-(p.tz-p.z)/p.T*.5,p.vx);line(p.x-Math.cos(a)*9,Y-Math.sin(a)*9,p.x+Math.cos(a)*9,Y+Math.sin(a)*9,'#f4ead0',1.6);ell(p.x+Math.cos(a)*9,Y+Math.sin(a)*9,1.6,1.6,'#c8d0ff');}}
  for(const k of NR_KO)if(on(k.u.x,k.u.y)&&k._sp!==SP47.r)nrDrawU(k.u,k.t+.001);
  for(const r of NR_RINGS){const q=r.t/.6;if(r.sweep){ctx.strokeStyle=`rgba(255,230,160,${.85*(1-q)})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.ellipse(r.x,r.y,NR_SWEEP_R*(.6+.4*q),NR_SWEEP_R*(.6+.4*q)*.6,0,r.a-NR_SWEEP_A,r.a+NR_SWEEP_A);ctx.stroke();continue;}ctx.strokeStyle=`rgba(200,170,120,${.8*(1-q)})`;ctx.lineWidth=6*(1-q)+1;ctx.beginPath();ctx.ellipse(r.x,r.y,120*q+10,(120*q+10)*.6,0,0,TAU);ctx.stroke();}
  if(on(WZ.x,WZ.y))wzDraw();}
function wzDraw(){const t=wzTop(),x=t.x,y=t.y+20;
  if(!wzBeaten()&&!(WZB.koT<0)){const ko=WZB.koT>0,bob=ko?0:Math.sin(G.t*2)*2,c=WZB.cast>0;
    if(ko){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(G.t*9)*.2);ctx.translate(-x,-y);}
    poly([x-11,y,x+11,y,x+4,y-30+bob,x-4,y-30+bob],'#4a3aa8');for(let i=0;i<4;i++)txt('✦',x-6+i*4,y-8-i*6+bob,6,'#ffe890','center',false);
    ell(x,y-34+bob,6,6,'#f0d0b0');poly([x-6,y-28+bob,x+6,y-28+bob,x+2,y-12+bob,x-2,y-12+bob],'#f4f4f4');poly([x-10,y-37+bob,x+10,y-37+bob,x+2,y-62+bob],'#3a2a90');ell(x,y-37+bob,11,3,'#3a2a90');
    line(x+12,y+2,x+14,y-46+bob,'#7a5a3a',2.4);ell(x+14,y-50+bob,c?7:5,c?7:5,c?'#e8f8ff':'#9ae0ff');if(GFX_HI||c)ell(x+14,y-50+bob,c?18:11,c?18:11,'rgba(160,220,255,.3)');
    ell(x+2,y-35+bob,1,1,'#222');ell(x-2,y-35+bob,1,1,'#222');
    if(ko){ctx.restore();for(let i=0;i<3;i++){const an=G.t*5+i*TAU/3;txt('★',x+Math.cos(an)*14,y-70+Math.sin(an)*4,11,'#ffe060','center');}}}
  for(const s of WZB.ice){const Y=s.y-s.z,a=Math.atan2(s.vy+s.vz*-.5,s.vx);ctx.save();ctx.translate(s.x,Y);ctx.rotate(a);poly([14,0,-8,-4,-12,0,-8,4],'#cfeeff');poly([14,0,-4,-2,-4,2],'#ffffff');ctx.restore();ell(s.x,s.y,6,2,'rgba(0,0,0,.15)');}
  for(const m of WZB.marks){if(!m.done){const q=1-m.t;ctx.strokeStyle=`rgba(255,240,120,${.4+.5*q})`;ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.ellipse(m.x,m.y,70,44,0,0,TAU);ctx.stroke();ctx.setLineDash([]);ell(m.x,m.y,70*q,44*q,'rgba(255,240,120,.18)');}
    else if(m.flash>0){let px=m.x+R(-10,10),py=m.y-700;for(let i=0;i<8;i++){const nx=m.x+R(-30,30)*(1-i/8),ny=py+88;line(px,py,nx,ny,'#fffbe0',4);line(px,py,nx,ny,'#a8d8ff',1.6);px=nx;py=ny;}ell(m.x,m.y,50,30,'rgba(255,250,200,.5)');}}
  for(const w of WZB.winds){const q=w.t/1.6;ctx.strokeStyle=`rgba(220,240,255,${.7*(1-q)})`;ctx.lineWidth=8*(1-q)+2;ctx.beginPath();ctx.ellipse(WZ.x,WZ.y,w.r,w.r*.62,0,0,TAU);ctx.stroke();
    for(let i=0;i<6;i++){const an=i*TAU/6+w.t*2;txt('~',WZ.x+Math.cos(an)*w.r,WZ.y+Math.sin(an)*w.r*.62,16,'rgba(240,250,255,.8)','center');}}
  if(WZB.on&&WZB.koT<=0&&WZB.maxHp){const w=90,y0=t.y-90;rect(x-w/2,y0,w,6,'rgba(0,0,0,.5)');rect(x-w/2,y0,w*WZB.hp/WZB.maxHp,6,'#b48aff');}}
{const _cf=drawCrashFx;drawCrashFx=function(){const r=_cf.apply(this,arguments);nrDrawFx();return r;};}
// screen boss bar
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!WZB.on||wzBeaten()||!WZB.maxHp)return;const S=hudSlot('wizard',Math.min(424,VW*.6+4),32),w=S.w-4,x=S.x+2,y=S.y+20,lab='🛡️ Storm Wizard\'s magic shield'+(EASY?' (easy)':'');
  rect(x-2,y-2,w+4,14,'rgba(20,10,40,.75)');rect(x,y,w*Math.max(0,WZB.hp)/WZB.maxHp,10,'#a87aff');txt(lab,S.cx,S.y+13,hudFit(lab,S.w,13),'#e8dcff','center');};}
// ======================= magic turret towers =======================
// Light lands: elven crystal towers shoot ice bolts (damage + a brief slow). Dark lands: orc spiked storm towers shoot lightning (short charge-up, then a zap).
// They guard the castles, the border and the key villages, shoot the dragon and enemy-faction soldiers, can be burned/bitten down, and magically rebuild.
const NR_TUR_R=540,NR_TUR_K={ice:{hp:70,cd:1.7,dmg:4,col:'#bfe8ff'},storm:{hp:80,cd:2.6,dmg:5,col:'#fff3a0'}};
let NR_TUR=[],NR_TB=[];
function nrTurPlace(){NR_TUR=[];const add=(x,y,side)=>{for(let k=0;k<12&&(inWater(x,y)||nrBarZone(x,y)===false);k++){x+=R(-60,60);y+=side==='L'?-30:30;}
    if(inWater(x,y))return;const kind=side==='L'?'ice':'storm';NR_TUR.push({x,y,side,kind,hp:NR_TUR_K[kind].hp,cd:R(0,1),st:'ok',reT:0,ch:0,shots:0});};
  const T=n=>NR_TOWNS.find(t=>t.n===n);
  for(const[n,dx,dy]of[['Silverleaf',-260,-200],['Silverleaf',260,-200],['Moonglade',0,-230],['Starwood',250,-180],['Ironhold Gate',-200,-200],['Thistledown',200,-150]]){const t=T(n);if(t)add(t.x+dx,t.y+dy,'L');}
  for(const[n,dx,dy]of[['Gorgrim War-Fort',-300,140],['Gorgrim War-Fort',300,140],['Blackspike Camp',0,200],['Gobbleton',220,180],['Snaggletooth Camp',-200,180]]){const t=T(n);if(t)add(t.x+dx,t.y+dy,'D');}
  // the border: matching pairs either side, well away from the big battlefield
  for(const dx of[-2600,-1300,1300,2600]){const x=NR_BF.x+dx;if(x<WX0+500||x>coastX(nrDarkY(x))-300)continue;add(x,nrDarkY(x)+260,'L');add(x,nrDarkY(x)-420,'D');}}
function nrTurMaxHp(t){return Math.round(NR_TUR_K[t.kind].hp*nrHpMul());}
function nrTurFoe(t){let b=null,bd=NR_TUR_R*NR_TUR_R;for(const v of NRU){if(v.dead||v.inside)continue;const S=NRS[v.species];if(!S.dm||S.side==='N')continue;
    if(t.side==='L'?!(S.side==='D'||S.side==='W'):S.side!=='L')continue;const q=(v.x-t.x)**2+(v.y-t.y)**2;if(q<bd){bd=q;b=v;}}return b;}
function nrTurUpd(dt){if(!NR_TUR.length)nrTurPlace();const alive=!G.over&&!G.won;
  for(const t of NR_TUR){if(Math.abs(t.x-D.x)>2400||Math.abs(t.y-D.y)>1800){if(t.st==='ruin'&&G.t>t.reT)nrTurRebuild(t);continue;}
    if(t.st==='ruin'){if(G.t>t.reT&&Math.hypot(t.x-D.x,t.y-D.y)>500)nrTurRebuild(t);continue;}
    if(t.maxHp!==nrTurMaxHp(t)){t.maxHp=nrTurMaxHp(t);t.hp=Math.min(t.hp,t.maxHp)||t.maxHp;}
    t.cd-=dt;const K=NR_TUR_K[t.kind];
    if(t.ch>0){t.ch-=dt;if(t.ch<=0)nrTurZap(t);continue;}
    if(t.cd>0)continue;const dd=Math.hypot(D.x-t.x,D.y-t.y);let tg=null;
    if(alive&&G.nrOpen&&dd<NR_TUR_R)tg=D;else tg=nrTurFoe(t);if(!tg)continue;t.cd=K.cd*R(.9,1.1);t.tg=tg;
    if(t.kind==='ice'){const tz=tg===D?heightOf():12,d=Math.hypot(tg.x-t.x,tg.y-t.y)||1,T=Math.max(.25,d/560);NR_TB.push({x:t.x,y:t.y,z:100,tz,vx:(tg.x-t.x)/T,vy:(tg.y-t.y)/T,T,t:0,tg,dmg:K.dmg});t.shots++;G.nrTurShots=(G.nrTurShots||0)+1;}
    else{t.ch=.45;t.cx=tg.x;t.cy=tg.y;}}
  for(const b of NR_TB){b.t+=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.t<b.T)continue;b.done=1;const g=b.tg;
    if(g===D){if(alive&&Math.hypot(D.x-b.x,D.y-b.y)<52+(D.alt>.3?30:0)){hurtDragon(b.dmg,'iceturret');D.nrSlowT=1.3;float(D.x,D.y-heightOf()-80,'Frost bolt! Slowed','#bfe8ff');}}
    else if(g&&!g.dead&&Math.hypot(g.x-b.x,g.y-b.y)<36){nrHit(g,b.dmg*1.5,null);g.nrSlowT=1.3;}
    if(Math.abs(b.x-D.x)<1500&&Math.abs(b.y-D.y)<1000)puff(b.x,b.y-10,3,'rgba(220,245,255,',40,5);}
  if(NR_TB.length)NR_TB=NR_TB.filter(b=>!b.done);
  if(D.nrSlowT>0)D.nrSlowT-=dt;}
function nrTurZap(t){const K=NR_TUR_K[t.kind],g=t.tg;let hx=t.cx,hy=t.cy,hit=false;t.shots++;G.nrTurShots=(G.nrTurShots||0)+1;
  if(g===D){if(!G.over&&!G.won&&Math.hypot(D.x-t.x,D.y-t.y)<NR_TUR_R+40){hx=D.x;hy=D.y-heightOf();hurtDragon(K.dmg,'stormturret');float(D.x,D.y-heightOf()-80,'Lightning tower! ZAP','#fff3a0');hit=true;}}
  else if(g&&!g.dead&&Math.hypot(g.x-t.x,g.y-t.y)<NR_TUR_R+40){hx=g.x;hy=g.y-14;nrHit(g,K.dmg*1.5,null);hit=true;}
  t.zap={x:hx,y:hy,t:.22};if(hit)G.shake=Math.max(G.shake,2);}
function nrTurHurt(t,d,how){if(t.st!=='ok')return;t.hp-=d;t.hitT=G.t;if(t.hp<=0){t.hp=0;t.st='ruin';t.reT=G.t+45;t.ch=0;G.nrTurDown=(G.nrTurDown||0)+1;
    puff(t.x,t.y-50,12,t.kind==='ice'?'rgba(200,230,255,':'rgba(120,110,130,',90,10);sparkle(t.x,t.y-60,10);float(t.x,t.y-110,t.kind==='ice'?'Crystal tower shattered!':'Storm tower toppled!','#ffd27a');G.shake=Math.max(G.shake,5);}}
function nrTurRebuild(t){t.st='ok';t.maxHp=nrTurMaxHp(t);t.hp=t.maxHp;t.cd=2;G.nrTurRebuilt=(G.nrTurRebuilt||0)+1;if(Math.abs(t.x-D.x)<2000&&Math.abs(t.y-D.y)<1500){sparkle(t.x,t.y-60,16);float(t.x,t.y-120,'✨ The tower magically rebuilds','#e6d0ff');}}
// dragon fire burns them, a bite chips them
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);for(const t of NR_TUR)if(t.st==='ok'&&Math.abs(t.x-ox)<DR.fireRange+60&&Math.abs(t.y-oy)<DR.fireRange+60&&inFire(t.x,t.y,ox,oy)){t.burnT=G.t;nrTurHurt(t,DR.fireDps*.3*dt,'fire');}return r;};}
{const _te=tryEat;tryEat=function(){for(const t of NR_TUR)if(t.st==='ok'&&Math.hypot(D.x-t.x,D.y-t.y)<110&&D.alt<.5){D.eatCD=.6;nrTurHurt(t,NR_TUR_BITE,'bite');float(D.x,D.y-90,'Crunch the tower!','#ffd27a');return;}return _te.apply(this,arguments);};}
// (QUEUE 34/35) magic turrets crack under a dragon's weight: bite 32 (was 15), STOMP 45 (was none) - stomp is the strongest; fire unchanged
const NR_TUR_BITE=25,NR_TUR_STOMP=45;
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);let n=0;for(const t of NR_TUR)if(t.st==='ok'&&Math.hypot(D.x-t.x,D.y-t.y)<DR.stompR+60){nrTurHurt(t,NR_TUR_STOMP*DR.stompDmg/60,'stomp');n++;}if(n){G.nrTurStomps=(G.nrTurStomps||0)+n;float(D.x,D.y-110,'STOMP! The tower cracks','#ffd27a');}return r;};}
// slowed by frost
{const _uc=updCruise;updCruise=function(){const r=_uc.apply(this,arguments);return D.nrSlowT>0?r*.6:r;};}
{const _t=nrTick;nrTick=function(dt){_t(dt);nrTurUpd(dt);};}
{const _r=nrReset;nrReset=function(keepG){_r(keepG);NR_TB=[];D.nrSlowT=0;for(const t of NR_TUR){t.st='ok';t.hp=t.maxHp||nrTurMaxHp(t);t.ch=0;t.zap=null;}};}
// drawing (y-sorted with the scenery as DECOR items)
function nrTurDraw(o){const t=o.tur;if(!t)return;const x=t.x,y=t.y,T=G.t;ell(x,y+2,26,9,'rgba(0,0,0,.25)');
  if(t.st==='ruin'){for(let i=0;i<7;i++)ell(x-18+i*6,y-4-(i%3)*4,8,5,t.kind==='ice'?'#c8c8dc':'#3a343e');if(t.kind==='ice')for(let i=0;i<3;i++)poly([x-10+i*10,y-6,x-6+i*10,y-18,x-3+i*10,y-6],'#b8d8ff');
    else for(let i=0;i<3;i++)poly([x-12+i*12,y-6,x-9+i*12,y-20,x-6+i*12,y-6],'#5a4a52');const q=Math.max(0,t.reT-G.t)/45;if(q<.3)ell(x,y-30,30,30,`rgba(220,200,255,${.25*(1-q/.3)})`);return;}
  const hurt=G.t-(t.hitT||-9)<.12,ch=t.ch>0;
  if(t.kind==='ice'){poly([x-16,y,x+16,y,x+10,y-80,x-10,y-80],'#eef0fa');poly([x-16,y,x-4,y,x-3,y-80,x-10,y-80],'#d8dcf0');for(let i=0;i<3;i++)rect(x-11+i*.5,y-24-i*22,22-i,3,'#b8a8e8');
    poly([x-14,y-80,x+14,y-80,x+8,y-90,x-8,y-90],'#c8c0f0');const p=.6+.4*Math.sin(T*3+x);poly([x,y-128,x+9,y-104,x,y-90,x-9,y-104],'#a8e0ff');poly([x,y-128,x+4,y-104,x,y-92],'#e8f8ff');
    ell(x,y-108,22*p+8,22*p+8,`rgba(150,220,255,${.18*p})`);rect(x-3,y-60,6,10,'#7aa8d8');}
  else{poly([x-18,y,x+18,y,x+12,y-84,x-12,y-84],'#2e2a34');poly([x-18,y,x-6,y,x-4,y-84,x-12,y-84],'#24202a');for(let i=0;i<4;i++){const yy=y-14-i*20;poly([x-15+i,yy,x-26+i,yy-4,x-14+i,yy-8],'#5a4a52');poly([x+15-i,yy,x+26-i,yy-4,x+14-i,yy-8],'#5a4a52');}
    rect(x-15,y-90,30,8,'#3a3440');for(let i=0;i<4;i++)poly([x-14+i*9,y-90,x-11+i*9,y-102,x-8+i*9,y-90],'#5a4a52');rect(x-3,y-58,6,9,'#ff7030');
    const p=ch?1:.5+.3*Math.sin(T*7+x);ell(x,y-110,(ch?16:9)+4*p,(ch?16:9)+4*p,`rgba(255,240,140,${.25+.3*p})`);ell(x,y-110,7,7,ch?'#fffbe0':'#ffe070');
    if(rnd()<(ch?.6:.15)){let px=x,py=y-110;for(let i=0;i<3;i++){const nx=px+R(-14,14),ny=py+R(-12,12);line(px,py,nx,ny,'#fff3a0',1.4);px=nx;py=ny;}}}
  if(hurt){ctx.globalAlpha=.35;ell(x,y-60,22,60,'#fff');ctx.globalAlpha=1;}
  if(t.burnT&&G.t-t.burnT<1.5&&rnd()<.3)smoke(x+R(-10,10),y-70);
  if(t.hp<t.maxHp&&Math.hypot(x-D.x,y-D.y)<800){rect(x-22,y-140,44,4,'rgba(0,0,0,.5)');rect(x-22,y-140,44*t.hp/t.maxHp,4,t.side==='L'?'#9ad8ff':'#ffb050');}}
function nrTurFx(){const x0=cam.x-VW/cam.z/2-200,x1=cam.x+VW/cam.z/2+200;
  for(const b of NR_TB){if(b.x<x0||b.x>x1)continue;const k=b.t/b.T,Y=b.y-(b.z+(b.tz-b.z)*k);const a=Math.atan2(b.vy,b.vx);ell(b.x,Y,22,22,'rgba(150,220,255,.28)');ctx.save();ctx.translate(b.x,Y);ctx.rotate(a);ctx.globalAlpha=.5;poly([0,-5,-46,0,0,5],'#bfe8ff');ctx.globalAlpha=1;poly([20,0,-8,-7,-16,0,-8,7],'#9ad8ff');poly([20,0,-4,-3,-4,3],'#fff');ctx.restore();ell(b.x,b.y,10,4,'rgba(0,0,0,.18)');}
  for(const t of NR_TUR){if(!t.zap||t.zap.t<=0)continue;t.zap.t-=1/60;let px=t.x,py=t.y-110;const n=7;for(let i=1;i<=n;i++){const nx=t.x+(t.zap.x-t.x)*i/n+(i<n?R(-16,16):0),ny=py+(t.zap.y-(t.y-110))/n+(i<n?R(-10,10):0);line(px,py,nx,ny,'#fffbe0',4);line(px,py,nx,ny,'#ffe060',1.6);px=nx;py=ny;}ell(t.zap.x,t.zap.y,24,16,'rgba(255,250,200,.45)');}
  if(D.nrSlowT>0)ell(D.x,D.y-heightOf()*.5,46,30,'rgba(190,235,255,.18)');}
{const _f=nrDrawFx;nrDrawFx=function(){_f();nrTurFx();};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);nrTurPlace();for(let i=DECOR.length-1;i>=0;i--)if(DECOR[i].k==="nrtur")DECOR.splice(i,1);for(const t of NR_TUR){t.maxHp=nrTurMaxHp(t);t.hp=t.maxHp;DECOR.push({k:'nrtur',x:t.x,y:t.y,nr:1,tur:t,s:1,v:0});}return r;};}
{const _dd=drawDecor;drawDecor=function(o){if(o.k==='nrtur'){nrTurDraw(o);return;}return _dd(o);};}
// frost-slowed soldiers move at 60%
{const _mt=moveTo;moveTo=function(u,x,y,sp,dt){if(u&&u.nrSlowT>0)sp*=.6;return _mt.call(this,u,x,y,sp,dt);};}
{const _nu=nrUpd;nrUpd=function(u,dt){if(u.nrSlowT>0)u.nrSlowT-=dt;return _nu(u,dt);};}

// region music for the Northern Realms (themes from partA/partMU)
if(typeof MU!=='undefined'&&MU.themes)Object.assign(MU.themes,{shire:'pastoral',elven:'night',dwarf:'peaks',goblin:'jungle',orc:'battle',cyclops:'peaks',wzisle:'ocean'});
// ======================= dragon eggs & the yin-yang guardian dragons =======================
// A WHITE egg rests in the light side's shared Lumenspire Citadel, a BLACK egg in the dark side's Doomforge Citadel (see n.js/p.js), each in its keep with a garrison.
// Grab it (like the princess) and fly it to your lair: it hatches a wingless, serpentine guardian dragon that circles the lair outskirts
// (white: black eyes, ice breath; black: white eyes, lightning breath; they ride opposite each other like yin and yang).
// Guardians last until the player dragon dies (saved). A guardian that is knocked out goes dizzy, puffs away, and its egg reappears at its castle.
const NR_EGG={W:{k:'W',cc:'L',town:'Lumenspire Citadel',dx:0,dy:40,g:[],gT:-99},B:{k:'B',cc:'D',town:'Doomforge Citadel',dx:0,dy:40,g:[],gT:-99}};
const GD_R=560,GD_W=.32,GD_HP=140,GD_RANGE=480,GD_CD=1.1,GD_SEG=30;
let GD=[];
function eggPos(e){const t=NR_CC[e.cc];return{x:t.x+e.dx,y:t.y+e.dy};}
function eggState(k){return G['nrEgg'+k]||'nest';}
function eggSet(k,s){G['nrEgg'+k]=s;}
function gdMk(k,hp){return{k,hp:hp||gdMaxHp(),maxHp:gdMaxHp(),cd:R(0,1),fx:null,hitT:-9,koT:0,segs:[]};}
function gdSync(){GD=GD.filter(g=>G['nrGd'+g.k]>0);for(const k of ['W','B'])if(G['nrGd'+k]>0&&!GD.some(g=>g.k===k))GD.push(gdMk(k,G['nrGd'+k]));}
function gdAng(g){return (G.nrGdA||0)+(g.k==='B'?Math.PI:0);}
function gdHead(g){const a=gdAng(g);return{x:LAIR.x+Math.cos(a)*GD_R,y:LAIR.y+Math.sin(a)*GD_R*.78,a};}
function gdFoe(u){if(!u||u.dead||u.princess||u.isPrincess||u.king||u.isKing||u.inside)return false;
  if(u.nr){const S=NRS[u.species];return !!(S&&S.dm&&!S.civ&&u.side!=='N');}
  return u.type==='knight'||u.type==='archer'||u.type==='hunter'||!!u.militia||!!u.prince||!!u.raid;}
function gdHurtFoe(u,d,k){if(u.nr)nrHit(u,d,null);else hurtUnit(u,d,k==='W'?'ice':'zap');if(k==='W')u.nrSlowT=Math.max(u.nrSlowT||0,1.5);}
// --- guards at the shrines (spawned lazily near the dragon, like every realm unit) ---
function eggGuards(e,dt){if(eggState(e.k)!=='nest')return;const p=eggPos(e);if(Math.hypot(D.x-p.x,D.y-p.y)>1700)return;
  e.g=e.g.filter(u=>!u.gone&&(!u.dead||G.t-(u.koAt||(u.koAt=G.t))<60));const alive=e.g.filter(u=>!u.dead).length;
  if(e.g.length<6&&G.t-e.gT>1){e.gT=G.t;const L=e.k==='W'?['elf','dwarf','unirider','elf','dwarf','elf']:['goblin','orc','gobarch','orc','goblin','gobarch'];const i=e.g.length,a=i/6*TAU;
    const u=nrSpawn(L[i%6],p.x+Math.cos(a)*110,p.y+Math.sin(a)*80,{home:{x:p.x-130,y:p.y-100,w:260,h:200},eggG:e.k});e.g.push(u);}
  return alive;}
// --- grabbing / carrying / hatching ---
{const _tg=tryGrab;tryGrab=function(){if(!D.princess&&!D.nrEgg)for(const e of Object.values(NR_EGG)){if(eggState(e.k)!=='nest')continue;const p=eggPos(e),mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;
    if(Math.hypot(D.x-p.x,D.y-p.y)<120||Math.hypot(mx-p.x,my-p.y)<110){D.nrEgg=e.k;eggSet(e.k,'carried');addAlarm(30);float(p.x,p.y-60,e.k==='W'?'The white egg!':'The black egg!','#fff2c0');
      showToast(e.k==='W'?'🥚 You took the WHITE dragon egg! Fly it to your lair to hatch it':'🥚 You took the BLACK dragon egg! Fly it to your lair to hatch it');
      return true;}}
  return _tg.apply(this,arguments);};}
function eggHatch(k){D.nrEgg=null;eggSet(k,'lair');G['nrGd'+k]=gdMaxHp();gdSync();sparkle(LAIR.x,LAIR.y-40,26);puff(LAIR.x,LAIR.y-30,10,k==='W'?'rgba(230,240,255,':'rgba(60,50,80,',70,9);
  float(LAIR.x,LAIR.y-90,k==='W'?'A white guardian dragon hatches!':'A black guardian dragon hatches!','#ffe9a0');
  showToast(k==='W'?'🐉 The WHITE guardian dragon (ice breath) now circles your lair!':'🐉 The BLACK guardian dragon (lightning breath) now circles your lair!');try{horn();}catch(e){}}
function eggReturn(k,why){if(D.nrEgg===k)D.nrEgg=null;eggSet(k,'nest');const e=NR_EGG[k];e.gT=-99;if(why)showToast(why);}
// --- guardians ---
function gdUpd(dt){G.nrGdA=((G.nrGdA||0)+GD_W*dt)%TAU;
  for(const g of GD){const h=gdHead(g);g.fx&&(g.fx.t-=dt);if(g.koT>0){g.koT-=dt;if(g.koT<=0){g.dead=true;puff(h.x,h.y-30,12,'rgba(230,230,240,',70,9);G['nrGd'+g.k]=0;eggReturn(g.k,g.k==='W'?'💫 The white guardian puffed away — its egg is back in the Lumenspire Citadel':'💫 The black guardian puffed away — its egg is back in the Doomforge Citadel');}continue;}
    let best=null,bd=GD_RANGE,near=0;const scan=a=>{for(const u of a){if(!gdFoe(u))continue;const d=Math.hypot(u.x-h.x,u.y-h.y);if(d<120)near++;if(d<bd){bd=d;best=u;}}};
    scan(units);
    g.cd-=dt;if(best&&g.cd<=0){g.cd=GD_CD;gdHurtFoe(best,g.k==='W'?6:7,g.k);g.fx={x:best.x,y:best.y,t:.35};g.shots=(g.shots||0)+1;}
    if(near){g.hp-=3*near*dt;g.hitT=G.t;}else g.hp=Math.min(g.maxHp,g.hp+2*dt);
    if(g.hp<=0){g.hp=0;g.koT=2.5;float(h.x,h.y-50,'Dizzy!','#ffe0a0');}G['nrGd'+g.k]=Math.max(.01,Math.round(g.hp*10)/10);}
  GD=GD.filter(g=>!g.dead);}
{const _t=nrTick;nrTick=function(dt){_t(dt);
  if(G.over){if(!G.nrDeadSeen){G.nrDeadSeen=1;for(const k of ['W','B']){G['nrGd'+k]=0;eggReturn(k);}GD=[];}return;}G.nrDeadSeen=0;
  for(const e of Object.values(NR_EGG))eggGuards(e,dt);
  if(D.nrEgg&&Math.hypot(D.x-LAIR.x,D.y-LAIR.y)<130)eggHatch(D.nrEgg);
  if(GD.length)gdUpd(dt);};}
{const _r=nrReset;nrReset=function(keepG){_r(keepG);for(const e of Object.values(NR_EGG)){e.g=[];e.gT=-99;}
  if(!keepG){G.nrEggW=G.nrEggB='nest';G.nrGdW=G.nrGdB=0;G.nrGdA=0;}
  for(const k of ['W','B'])if(eggState(k)==='carried')eggSet(k,'nest');D.nrEgg=null;GD=[];gdSync();};}
// --- drawing ---
function nrEggArt(x,y,k,s){s=s||1;ell(x,y+2,14*s,5*s,'rgba(0,0,0,.25)');ell(x,y-16*s,14.5*s,18.5*s,k==='W'?'#7a80a8':'#c8b0ff');ell(x,y-16*s,13*s,17*s,k==='W'?'#f4f4fa':'#1e1a26');ell(x-4*s,y-22*s,4*s,6*s,k==='W'?'#ffffff':'#4a4060');
  for(let i=0;i<3;i++)ell(x-6*s+i*6*s,y-12*s+(i%2)*4*s,2*s,2*s,k==='W'?'#cfd8ff':'#8a6aff');const p=.5+.5*Math.sin(G.t*3);ell(x,y-16*s,(22+4*p)*s,(24+4*p)*s,k==='W'?`rgba(200,230,255,${.18+.1*p})`:`rgba(150,90,255,${.18+.1*p})`);}
function gdDraw(g){const T=G.t,a0=gdAng(g),W=g.k==='W',body=W?'#f2f2f8':'#1c1824',belly=W?'#c8d0e8':'#4a3a5a',mane=W?'#9ad8ff':'#ffd040',eye=W?'#111':'#fff';
  const ko=g.koT>0||!!g.down,pts=[];for(let i=0;i<GD_SEG;i++){const a=a0-i*.036,w=Math.sin(T*4-i*.38)*14;const r=GD_R+w;pts.push({x:LAIR.x+Math.cos(a)*r,y:LAIR.y+Math.sin(a)*r*.78-34-Math.sin(T*3-i*.27)*6});}
  if(g.eng>0&&g.hx!==undefined){const e=Math.min(1,g.eng),bx=-Math.cos(g.dir||0),by=-Math.sin(g.dir||0);for(let i=0;i<GD_SEG;i++){const w=Math.sin(T*5-i*.45)*10*Math.min(1,i/4),ex=g.hx+bx*i*13-by*w,ey=g.hy-34+by*i*13*.8+bx*w-Math.sin(T*3-i*.27)*5;pts[i].x+=(ex-pts[i].x)*e;pts[i].y+=(ey-pts[i].y)*e;}} // engaged: the guardian leaves its circle to meet raiders (queue 72)
  const ol=W?'#5a6488':'#b8a8d8';
  for(let i=GD_SEG-1;i>=0;i--){const p=pts[i],s=1-i/GD_SEG*.6;ell(p.x,p.y+34,12*s,4*s,'rgba(0,0,0,.16)');ell(p.x,p.y,16.5*s,14.5*s,ol);ell(p.x,p.y,15*s,13*s,body);ell(p.x,p.y+4*s,9*s,6*s,belly);if(i%4===1)poly([p.x-3,p.y-11*s,p.x,p.y-20*s,p.x+3,p.y-11*s],mane);
    if(i===7||i===19){line(p.x-6,p.y+8,p.x-10,p.y+18,body,4);line(p.x+6,p.y+8,p.x+10,p.y+18,body,4);}}
  const h=pts[0],n=pts[1],dir=Math.atan2(h.y-n.y,h.x-n.x);ctx.save();ctx.translate(h.x,h.y);ctx.rotate(dir);
  ell(0,0,21.5,16.5,ol);ell(16,3,13.5,9.5,ol);ell(0,0,20,15,body);ell(16,3,12,8,belly);poly([-6,-12,-16,-26,-2,-14],mane);poly([2,-12,-4,-28,8,-14],mane);line(18,6,30,14,mane,2);line(18,-2,32,-8,mane,2);
  ell(6,-5,4,4,eye);if(ko){ctx.restore();for(let i=0;i<3;i++){const aa=T*4+i*2.1;ell(h.x+Math.cos(aa)*20,h.y-26+Math.sin(aa)*6,4,4,'#ffe060');}}else ctx.restore();
  if(G.t-g.hitT<.12){ctx.globalAlpha=.35;ell(h.x,h.y,24,18,'#fff');ctx.globalAlpha=1;}
  if(g.fx&&g.fx.t>0){if(W){const k=g.fx.t/.35;ctx.globalAlpha=.75*k;line(h.x,h.y,g.fx.x,g.fx.y-12,'#bfe8ff',9);line(h.x,h.y,g.fx.x,g.fx.y-12,'#ffffff',3);ell(g.fx.x,g.fx.y-12,26,18,'rgba(190,235,255,.5)');ctx.globalAlpha=1;}
    else{let px=h.x,py=h.y;for(let i=1;i<=7;i++){const nx=h.x+(g.fx.x-h.x)*i/7+(i<7?R(-14,14):0),ny=h.y+(g.fx.y-12-h.y)*i/7+(i<7?R(-10,10):0);line(px,py,nx,ny,'#fffbe0',4);line(px,py,nx,ny,'#ffd040',1.6);px=nx;py=ny;}ell(g.fx.x,g.fx.y-12,22,14,'rgba(255,240,170,.5)');}}
  if(g.hp<g.maxHp){rect(h.x-22,h.y-44,44,4,'rgba(0,0,0,.5)');rect(h.x-22,h.y-44,44*g.hp/g.maxHp,4,W?'#9ad8ff':'#ffd040');}}
function nrEggFx(){const x0=cam.x-VW/cam.z/2-300,x1=cam.x+VW/cam.z/2+300,y0=cam.y-VH/cam.z/2-300,y1=cam.y+VH/cam.z/2+300;
  for(const e of Object.values(NR_EGG)){if(eggState(e.k)!=='nest')continue;const p=eggPos(e);if(p.x<x0||p.x>x1||p.y<y0||p.y>y1)continue;
    poly([p.x-24,p.y+4,p.x+24,p.y+4,p.x+16,p.y-6,p.x-16,p.y-6],e.k==='W'?'#d8d0f0':'#3a2e3e');rect(p.x-18,p.y-10,36,5,e.k==='W'?'#b8a8e8':'#5a3a4a');nrEggArt(p.x,p.y-10,e.k,1);}
  // (the carried egg is now drawn after the dragon, in its claws: n.js eggCarryDraw)
  if(GD.length&&Math.abs(LAIR.x-cam.x)<VW/cam.z/2+GD_R+200&&Math.abs(LAIR.y-cam.y)<VH/cam.z/2+GD_R+200)for(const g of GD)gdDraw(g);}
{const _f=nrDrawFx;nrDrawFx=function(){_f();nrEggFx();};}
// --- save / load: G.nrEggW/B and G.nrGdW/B are plain G fields, so the existing save keeps them; old saves simply have none ---
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);for(const k of ['W','B']){if(typeof G['nrGd'+k]!=='number')G['nrGd'+k]=0;if(!G['nrEgg'+k]||G['nrEgg'+k]==='carried')G['nrEgg'+k]=G['nrGd'+k]>0?'lair':'nest';}gdSync();return r;};}
// --- moving up a castle level is not a death: guardians, eggs at the lair and the wizard's opened barrier carry over ---
{const _nl=nextLevel;nextLevel=function(){const k={nrGdW:G.nrGdW,nrGdB:G.nrGdB,nrEggW:G.nrEggW,nrEggB:G.nrEggB,nrOpen:G.nrOpen,nrOpenT:G.nrOpenT},egg=D.nrEgg;const r=_nl.apply(this,arguments);
  for(const f in k)if(k[f]!==undefined)G[f]=k[f];if(egg){eggSet(egg,'nest');}for(const q of ['W','B'])if(G['nrEgg'+q]==='carried')G['nrEgg'+q]='nest';D.nrEgg=null;gdSync();return r;};}

// ================= fire & lava hurt birds =================
// Birds live in their own list (not `units`), so the breath and lava splash never reached them. Now: fire singes a bird in the cone
// (small birds pop at once, hawks/eagles/vultures last a moment longer); a lava splash knocks out every low bird in the blast.
// Family-friendly: a singed bird is "knocked out of the sky" in a puff of feathers with dizzy stars, no remains.
function birdKO(b,why){if(b.dead)return;b.dead=true;const B=BIRD[b.kind]||{pts:10},y=b.y-(b.z||0);
  puff(b.x,y,6,'rgba(245,235,215,',70,4);if(typeof hnFx==='function')hnFx(b.x,b.y-(b.z||0)*.6,'feathers');
  G.stats.birdsSinged=(G.stats.birdsSinged||0)+1;G.stats.birdPts=(G.stats.birdPts||0)+B.pts;float(b.x,y-16,`Feathers fly! ${why} +${B.pts} pts`,'#ffd27a');}
function birdFireHp(b){return b.bfHp!==undefined?b.bfHp:(b.bfHp=(BIRD[b.kind]&&BIRD[b.kind].hp||1)*.25);}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);
  if(typeof birds!=='undefined')for(const b of birds){if(b.dead||Math.abs(b.x-ox)>DR.fireRange+20||Math.abs(b.y-oy)>DR.fireRange+20||!inFire(b.x,b.y,ox,oy))continue;
    b.bfHp=birdFireHp(b)-dt;b.scared=3;if(b.bfHp<=0)birdKO(b,'Singed!');}
  return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);const R2=(LAVA_CFG.splashR+20)**2;
  if(typeof birds!=='undefined')for(const b of birds)if(!b.dead&&(b.z||0)<160&&(b.x-x)**2+(b.y-y)**2<R2)birdKO(b,'Lava!');return r;};}

// ================= the northern sea above the Wizard's Isle =================
// Open water north of the isle, beyond the magic wind wall (x from the coast to the east edge, y from the top edge to just north of the wall) used to be empty.
// Now it holds narwhal pods, orca and dolphin pods, whales and fish schools. Lazy: they only exist while the dragon is near the north-east
// (spawned out of sight, topped up every few seconds, so anything eaten comes back) and are removed when it leaves, so the rest of the map pays nothing.
const NSEA_PLAN={narwhal:3,orca:2,dolphin:3,whale:3,school:5}; // groups (narwhal 3-5, orca 2-3, dolphin 3-4 each; whales single; schools of 6-9 fish)
const NSEA={on:false,t:0,grp:{}};
const NSEA_GAP=240; // they keep this far north of the wind wall
function nseaIn(x,y){return y>WY0+260&&y<nrEdge(x)-NSEA_GAP&&y<WZ.y-700&&x>coastX(y)+180&&x<WX1-160&&inSea(x,y)&&Math.hypot(x-WZ.x,(y-WZ.y)*1.2)>950;}
function nseaPt(far){for(let t=0;t<120;t++){const y=R(WY0+300,Math.min(WZ.y-760,-2700-NSEA_GAP)),x=R(coastX(y)+220,WX1-200);if(!nseaIn(x,y)||seaD(x,y)<200)continue;if(far&&Math.hypot(x-D.x,y-D.y)<1100)continue;return{x,y};}return null;}
function nseaNear(){return D.y<nrEdge(D.x)+1300&&D.x>coastX(D.y)-500;} // the dragon is at or near the north-east sea (the wind wall, the Wizard's Isle, or beyond)
function nseaUnits(){return units.filter(u=>!u.dead&&u.nsea);}
function nseaSpawn(k,far){const p=nseaPt(far);if(!p)return 0;const n0=units.length,g=++NSEA.t;
  if(k==='narwhal')ocPod(p,RI(3,5));else if(k==='orca'||k==='dolphin')nwGroup(k,far,p);
  else if(k==='whale')mkSea('whale',p.x,p.y,{hp:140,maxHp:140,spoutT:R(2,6)});else if(k==='school')mkSea('school',p.x,p.y,{n:RI(6,9),hp:999,maxHp:999});
  for(let i=n0;i<units.length;i++){units[i].nsea=k;units[i].nsg=g;}return units.length-n0;}
function nseaGroups(k){return new Set(nseaUnits().filter(u=>u.nsea===k).map(u=>u.nsg)).size;}
function nseaTick(dt){if(!nseaNear()){if(NSEA.on){NSEA.on=false;for(const u of units)if(u.nsea)u.dead=true;units=units.filter(u=>!u.nsea);}return;}
  // the wind wall holds them too: they stay north of it (two-way barrier for everything but the player's dragon)
  for(const u of units)if(u.nsea&&!u.dead){const lim=nrEdge(u.x)-90;if(u.y>lim)u.y=lim;}
  NSEA.cd=(NSEA.cd||0)-dt;if(NSEA.on&&NSEA.cd>0)return;NSEA.on=true;NSEA.cd=4;
  for(const k in NSEA_PLAN){let have=nseaGroups(k);for(let i=0;have<NSEA_PLAN[k]&&i<NSEA_PLAN[k];i++)if(nseaSpawn(k,true))have++;}}
{const _up=updParts;updParts=function(dt){_up(dt);if(scene==='play'&&G&&!G.over)nseaTick(dt);};}
{const _r=nrReset;nrReset=function(){const r=_r.apply(this,arguments);NSEA.on=false;NSEA.cd=0;return r;};}
REGION_SUB.wzisle=(REGION_SUB.wzisle||'')+'. Beyond his wall of winds, narwhals, orcas, dolphins and whales swim the cold north sea';

// ================= the wall of magic winds over the sea (same line as the crystal mountains) =================
// The barrier zone itself (nrBarZone) now spans the whole map width; this draws the sea half: swirling gusts and streaks along nrEdge.
// Strong before the Wizard falls; afterwards it still blows (fainter) - only the player's dragon may pass, everything else stays on its side.
function wwDraw(x0,x1,y0,y1){const T=G.t,a=G.nrOpen?.4:1,xs=Math.max(x0,coastX(nrEdge(x0))-40),xe=Math.min(x1,WX1);if(xs>=xe)return;
  ctx.lineCap='round';const st=Math.floor(xs/52)*52;
  // misty violet band - the body of the wall
  for(let x=st;x<xe;x+=52){const y=nrEdge(x);if(y<y0-200||y>y1+60||x<coastX(y)-30)continue;const p=Math.sin(T*1.3+x*.013);
    ell(x,y-46,70,78,`rgba(196,186,255,${(.10+.04*p)*a})`);ell(x+20,y-70+10*p,46,40,`rgba(235,240,255,${(.08+.04*p)*a})`);}
  for(let x=st;x<xe;x+=52){const y=nrEdge(x);if(y<y0-200||y>y1+60||x<coastX(y)-30)continue;
    for(let k=0;k<5;k++){const ph=T*(1.7+k*.45)+x*.021+k*2.3,yy=y+34-k*34+Math.sin(ph)*12,w=.42+.2*Math.sin(ph*1.3+k);
      ctx.strokeStyle=k%2?`rgba(200,176,255,${w*a})`:`rgba(236,246,255,${(w+.1)*a})`;ctx.lineWidth=(6-k*.8);ctx.beginPath();
      ctx.moveTo(x-38,yy);ctx.quadraticCurveTo(x-4,yy-24*Math.cos(ph),x+44,yy+5*Math.sin(ph));ctx.stroke();}
    if((x/52|0)%2===0){const ph=T*3+x*.05,cx=x+12*Math.sin(T*.9+x),cy=y-56+10*Math.cos(ph);ctx.strokeStyle=`rgba(245,250,255,${.6*a})`;ctx.lineWidth=3.2;
      ctx.beginPath();ctx.arc(cx,cy,22,ph,ph+4.2);ctx.stroke();ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,cy,11,ph+2,ph+5.6);ctx.stroke();}}
  // fast streaks racing along the wall
  for(let i=0;i<44;i++){const span=xe-xs;if(span<60)break;const x=xs+((T*(260+i*9)+i*977)%span),y=nrEdge(x)-4-(i%6)*24+Math.sin(T*2+i)*8;if(x<coastX(y))continue;
    ctx.strokeStyle=`rgba(250,252,255,${.7*a})`;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x-64,y);ctx.lineTo(x,y-4);ctx.stroke();}
  ctx.lineCap='butt';}
// drawn after drawSeaTop (the sea surface is painted over everything below it)
{const _st=drawSeaTop;drawSeaTop=function(){const r=_st.apply(this,arguments);const hw=VW/cam.z/2+120,hh=VH/cam.z/2+200;wwDraw(cam.x-hw,cam.x+hw,cam.y-hh,cam.y+hh);return r;};}

// ---- the new isle is kept clear: no ice floes on/around it, and the giant squid lurks elsewhere ----
{const _np=ocNorthPt;ocNorthPt=function(far){for(let t=0;t<20;t++){const p=_np.apply(this,arguments);if(!p||Math.hypot(p.x-WZ.x,(p.y-WZ.y)*1.2)>700)return p;}return null;};}
{const _sq=sqDeepOK;sqDeepOK=function(x,y){return Math.hypot(x-WZ.x,(y-WZ.y)*1.2)>1300&&_sq.apply(this,arguments);};}
function wzClearFloes(){if(OC&&OC.floes)OC.floes=OC.floes.filter(f=>Math.hypot(f.x-WZ.x,(f.y-WZ.y)*1.2)>WZ.r+Math.max(f.rx,f.ry)+250);}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);wzClearFloes();return r;};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);wzClearFloes();if(!G.nrOpen&&nrBarZone(D.x,D.y))nrBarPush(D,false);nrbLoad();return r;};}

// ================= every northern building can be burned, lava-splashed or stomped down, then magically rebuilds =================
// [hp, hit radius]. Not buildings (stay): the crystal barrier peaks, rocks/stones/boulders, lava vents, bonfires. Plants already burn (PB). The Wizard's tower is added in q.js (only destroyable once he is defeated).
const NR_BLD={elfspire:[260,70],elfhouse:[110,50],treehouse:[80,40],lantern:[14,16],hobhole:[100,48],dwhall:[260,72],dwforge:[150,52],dwmine:[180,56],dwgate:[300,80],
  gobtower:[160,48],gobshack:[70,42],orcfort:[300,100],orcwall:[150,64],orctent:[60,44],spikes:[24,24],cyccave:[300,90],megahut:[160,64]};
const NRB_RE=45;let NRB=[],NRB_SRC=null,NRB_N=-1;
function nrbList(){if(NRB_SRC!==DECOR||NRB_N!==DECOR.length){NRB_SRC=DECOR;NRB_N=DECOR.length;NRB=DECOR.filter(o=>o.nr&&NR_BLD[o.k]);for(const o of NRB)if(o.bst===undefined){o.bmax=NR_BLD[o.k][0]*(o.s||1);o.bhp=o.bmax;o.bst='ok';}}return NRB;}
function nrbName(k){return{elfspire:'Elven castle',elfhouse:'Elf house',treehouse:'Tree house',lantern:'Elf lantern',hobhole:'Hobbit hole',dwhall:'Dwarf hall',dwforge:'Dwarf forge',dwmine:'Dwarf mine',dwgate:'Ironhold Gate',
  gobtower:'Goblin tower',gobshack:'Goblin shack',orcfort:'Orc fortress',orcwall:'Orc palisade',orctent:'Orc tent',spikes:'Spike barricade',cyccave:'Cyclops cave',megahut:'Cyclops hut'}[k]||'Building';}
function nrbHurt(o,d,how){if(o.bst!=='ok')return false;o.bhp-=d;o.bhit=G.t;if(how==='fire')o.bburn=G.t;if(o.bhp>0)return false;
  o.bhp=0;o.bst='ruin';o.breT=G.t+NRB_RE;G.nrBldDown=(G.nrBldDown||0)+1;const r=NR_BLD[o.k][1]*(o.s||1);
  puff(o.x,o.y-r*.5,Math.min(14,4+r/8|0),'rgba(150,130,110,',60+r,8);if(r>30)G.shake=Math.max(G.shake,r>60?6:3);
  if(o.k!=='spikes'&&o.k!=='lantern'||rnd()<.25)float(o.x,o.y-r-30,`${nrbName(o.k)} ${how==='fire'?'burns down':how==='lava'?'melts in the lava':how==='claw'?'is smashed to rubble':'is stomped flat'}!`,'#ffd27a');return true;}
function nrbRebuild(o){o.bst='ok';o.bhp=o.bmax;o.bburn=0;G.nrBldRebuilt=(G.nrBldRebuilt||0)+1;
  if(Math.abs(o.x-D.x)<2000&&Math.abs(o.y-D.y)<1500){sparkle(o.x,o.y-40,12);if(o.k!=='spikes'&&o.k!=='lantern')float(o.x,o.y-NR_BLD[o.k][1]-40,`✨ The ${nrbName(o.k).toLowerCase()} magically rebuilds`,'#e6d0ff');}}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);if(oy<MWY0+400){const F=DR.fireRange+110;
  for(const o of nrbList())if(o.bst==='ok'&&Math.abs(o.x-ox)<F&&Math.abs(o.y-oy)<F){const R=NR_BLD[o.k][1]*(o.s||1)*.6;if(inFire(o.x,o.y,ox,oy)||inFire(o.x-R,o.y,ox,oy)||inFire(o.x+R,o.y,ox,oy))nrbHurt(o,DR.fireDps*.5*dt,'fire');}}
  return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);if(y<MWY0+400)for(const o of nrbList())if(o.bst==='ok'&&Math.hypot(o.x-x,o.y-y)<LAVA_CFG.splashR+NR_BLD[o.k][1]*(o.s||1))nrbHurt(o,70,'lava');return r;};}
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);if(D.y<MWY0+400)for(const o of nrbList())if(o.bst==='ok'&&Math.hypot(o.x-D.x,o.y-D.y)<DR.stompR+NR_BLD[o.k][1]*(o.s||1))nrbHurt(o,DR.stompDmg*1.6,'stomp');return r;};}
{const _t=nrTick;nrTick=function(dt){_t(dt);if(G.fc%30===0)for(const o of nrbList())if(o.bst==='ruin'&&G.t>=o.breT&&Math.hypot(o.x-D.x,o.y-D.y)>500)nrbRebuild(o);};}
{const _r=nrReset;nrReset=function(){const r=_r.apply(this,arguments);for(const o of nrbList()){o.bst='ok';o.bhp=o.bmax;o.bburn=0;}return r;};}
// save/load: the ruined ones (indices into the fixed, seeded list) - older saves simply have none
{const _ss=svSnapshot;svSnapshot=function(){const L=nrbList();G.nrBR=[];for(let i=0;i<L.length;i++)if(L[i].bst==='ruin')G.nrBR.push(i,Math.max(0,Math.round(L[i].breT-G.t)));return _ss.apply(this,arguments);};}
function nrbLoad(){const L=nrbList();for(const o of L){o.bst='ok';o.bhp=o.bmax;}if(Array.isArray(G.nrBR))for(let i=0;i+1<G.nrBR.length;i+=2){const o=L[G.nrBR[i]];if(o){o.bst='ruin';o.bhp=0;o.breT=G.t+(+G.nrBR[i+1]||NRB_RE);}}}
// drawing: rubble while down (a soft sparkle shortly before it rebuilds), flames/smoke while burning, a small health bar when damaged
{const _dd=nrDrawDecor;nrDrawDecor=function(o){if(o.bst==='ruin'){nrbRubble(o);return;}_dd(o);if(o.bst==='ok'){const x=o.x,y=o.y,s=o.s||1,R=NR_BLD[o.k][1]*s;
  if(o.bburn&&G.t-o.bburn<1.2){const f=.5+.4*Math.sin(G.t*15+x);ell(x,y-R*.6,R*.55,R*.6,`rgba(255,${120+Math.round(60*f)},40,${.22+.14*f})`);if(rnd()<.25)smoke(x+R*(rnd()-.5),y-R);}
  if(o.bhp<o.bmax&&o.bmax>=40&&Math.abs(x-D.x)<700&&Math.abs(y-D.y)<500){rect(x-22,y-R*1.5-30,44,4,'rgba(0,0,0,.5)');rect(x-22,y-R*1.5-30,44*o.bhp/o.bmax,4,'#ffb050');}}};}
function nrbRubble(o){const x=o.x,y=o.y,R=NR_BLD[o.k][1]*(o.s||1),n=Math.max(3,Math.min(11,R/7|0)),dark=/gob|orc|cyc|mega|spikes/.test(o.k),c1=dark?'#4a4038':o.k.startsWith('elf')||o.k==='lantern'?'#d8d0e8':'#8a8278',c2=dark?'#2e2824':'#6a645c';
  ell(x,y,R*1.05,R*.42,'rgba(30,24,20,.35)');for(let i=0;i<n;i++){const a=i*2.4+(o.v||0),rr=R*.75*((i*37%11)/11);ell(x+Math.cos(a)*rr,y-4+Math.sin(a)*rr*.35-(i%3)*3,4+R*.09+(i%3),3+R*.06,i%2?c1:c2);}
  if(R>30)for(let i=0;i<3;i++)line(x-R*.4+i*R*.35,y-4,x-R*.3+i*R*.35,y-R*.35,'#3a2e24',2);const q=(o.breT-G.t)/NRB_RE;if(q<.25&&q>0)ell(x,y-R*.4,R*.8,R*.6,`rgba(220,200,255,${.22*(1-q/.25)})`);}
// ======================= queue 1, 10, 11, 12, 18: Cerberus, mixed armies, Medusa, wizard/Medusa stay down until death, carried egg in flight =======================
// ---- 1. CERBERUS: cartoony three-headed dogs in small packs near goblin/orc lands (hostile, triple bite + fast lunge, edible once worn down) ----
NRS.cerberus={hp:90,sp:122,side:'W',dm:3,cd:1.35,food:38,sz:1.3,tough:1,aggro:480};
NR_SP.add('cerberus');NR_NAMES.cerberus='Cerberus (three-headed dogs)';HEAL.cerberus=FOOD.cerberus=38;FAUNA.cerberus={hp:90,sp:122,zone:'nr'};
if(typeof DG!=='undefined'&&DG.ch)DG.ch.cerberus=.2;
if(typeof tallyAddSect==='function')tallyAddSect('nrdark','Northern Realms · Dark lands','👹','#9ad06a',[['cerberus',NR_NAMES.cerberus]]);
NR_AMB.goblin.push(['cerberus',1]);NR_AMB.orc.push(['cerberus',1]);
const CB_PACK_MAX=2;
function cbNear(){let n=0;for(const u of NRU)if(!u.dead&&u.species==='cerberus'&&u.role==='amb'&&Math.abs(u.x-D.x)<3300&&Math.abs(u.y-D.y)<3300)n++;return n;}
{const _sp=nrSpawn;nrSpawn=function(sp,x,y,o){
  // war units (11): a neutral creature that joins a squad fights for that squad's side with real war stats
  if(o&&o.sq&&NR_WARS[sp]&&NRS[sp].side!==o.sq.side){const old=NRS[sp];NRS[sp]=NR_WARS[sp];let u;try{u=_sp.call(this,sp,x,y,Object.assign({},o,{side:o.sq.side,war:1}));}finally{NRS[sp]=old;}return u;}
  if(sp==='cerberus'&&o&&o.role==='amb'&&!o.pack){if(cbNear()>=CB_PACK_MAX*3)return _sp.call(this,'goblin',x,y,o);
    const u=_sp.apply(this,arguments);u.pack=1;const n=RI(1,2);for(let i=0;i<n;i++){const a=R(0,TAU);const v=_sp.call(this,'cerberus',x+Math.cos(a)*60,y+Math.sin(a)*40,Object.assign({},o,{pack:1}));v.pack=1;}G.cbPacks=(G.cbPacks||0)+1;return u;}
  return _sp.apply(this,arguments);};}
function cbAttack(u,S,T,dt,isD){const d=Math.hypot(T.x-u.x,T.y-u.y);if(Math.abs(T.x-u.x)>1)u.face=T.x>u.x?1:-1;u.lcd=(u.lcd||0)-dt;if(u.bite>0)u.bite-=dt;
  const dmg=()=>S.dm*(G.lvl>1?1+.06*(G.lvl-1):1);
  if(u.lg>0){u.lg-=dt;u.x+=Math.cos(u.lga)*S.sp*3*dt;u.y+=Math.sin(u.lga)*S.sp*3*dt;nrClamp(u);u.anim=(u.anim||0)+dt*20;if(d<50&&!(u.tb>0)){u.tb=3;u.tbT=0;u.lg=0;}return;}
  if(u.tb>0){u.tbT-=dt;if(u.tbT<=0){u.tbT=.16;u.tb--;u.bite=.14;u.mouth=((u.mouth||0)+1)%3;
      if(d<64&&(!isD||D.alt<.4)){if(isD){hurtDragon(dmg(),'cerberus');u.lastHitD=G.t;}else nrHit(T,S.dm,u);G.cbBites=(G.cbBites||0)+1;}
      if(u.tb===0){u.cd=S.cd;if(isD&&dist(u,D)<900&&rnd()<.6)float(D.x+R(-20,20),D.y-90,'Chomp chomp chomp!','#ffb0a0');}}return;}
  if(u.tele>0){u.tele-=dt;if(u.tele<=0){u.lg=.42;u.lga=Math.atan2(T.y-u.y,T.x-u.x);u.lcd=3.2;G.cbLunges=(G.cbLunges||0)+1;}return;}
  if(d<54){if(u.cd<=0){u.tb=3;u.tbT=0;}return;}
  if(d<260&&u.lcd<=0){u.tele=.35;if(isD&&dist(u,D)<900)float(u.x,u.y-46,'Grrr-rrr-rrr!','#ffb0a0');return;}
  moveTo(u,T.x,T.y,S.sp,dt);u.anim=(u.anim||0)+dt*12;}
{const _na=nrAttack;nrAttack=function(u,S,T,dt,isD){if(u.species==='cerberus')return cbAttack(u,S,T,dt,isD);return _na.apply(this,arguments);};}
NR_DRAW.cerberus=function(x,y,s,f,a,u){const body='#3e3038',dk='#271d24',lt='#64505a',crouch=u.tele>0?3*s:0;y+=crouch*.3;
  for(const lx of[-11,-5,6,12]){const sw=a?Math.sin((u.anim||0)*1.6+lx)*3*s:0;line(x+lx*s*f,y-9*s,x+lx*s*f+sw,y,dk,3.4*s);ell(x+lx*s*f+sw,y,2.8*s,1.5*s,'#1a1418');}
  const tw=Math.sin(G.t*8+(u.id||0))*3*s;line(x-14*s*f,y-15*s,x-23*s*f,y-25*s+tw,dk,2.6*s);ell(x-23*s*f,y-26*s+tw,2.6*s,3*s,'#e0603a');ell(x-23*s*f,y-27*s+tw,1.3*s,1.6*s,'#ffd070');
  ell(x,y-15*s,17*s,9*s,body);ell(x+1*s*f,y-19*s,12*s,4.5*s,lt);
  for(let i=0;i<3;i++){const bob=Math.sin(G.t*6+i*2.1)*1.2*s,hx=x+(10+i*5)*s*f,hy=y-(32-i*5)*s+bob+crouch,open=u.bite>0&&(u.mouth||0)===i;
    line(x+7*s*f,y-19*s,hx-2*s*f,hy+2*s,body,6*s);ell(hx-3*s*f,hy+4*s,4.4*s,2*s,'#a83232');for(const k of[-2,0,2])ell(hx-3*s*f+k*s,hy+5*s,.9*s,.9*s,'#e8c040');
    poly([hx-4*s*f,hy-3*s,hx-2*s*f,hy-10*s,hx+1*s*f,hy-4*s],dk);ell(hx,hy,6*s,5*s,body);ell(hx+5*s*f,hy+(open?0:1)*s,4.2*s,2.8*s,lt);ell(hx+8.6*s*f,hy-.4*s,1.4*s,1.3*s,'#111');
    if(open){ell(hx+5*s*f,hy+3.6*s,3.4*s,2*s,'#c83048');ell(hx+6*s*f,hy+2.2*s,.8*s,.8*s,'#fff');ell(hx+3.6*s*f,hy+2.2*s,.8*s,.8*s,'#fff');}
    nrEyes(hx+1.5*s*f,hy-1.6*s,2,2.6*s,.75*s);}
  if(u.tele>0)txt('!',x+18*s*f,y-46*s,14,'#ff6040','center');};
// ---- 11. MIXED ARMIES: every creature of each side marches (heavies rarer), strength still matched ----
const NR_WARS={satyr:Object.assign({},NRS.satyr,{side:'L',flee:0,dm:1.5,cd:.9}),unicorn:Object.assign({},NRS.unicorn,{side:'L',flee:0,dm:3,cd:1.1}),minotaur:Object.assign({},NRS.minotaur,{side:'L'})};
nrStr=function(sp){const S=NR_WARS[sp]&&!NRS[sp].dm?NR_WARS[sp]:NRS[sp];return S.dm?S.hp/(S.armor||1)*(S.horn?S.dm+S.horn*.3:S.dm)/S.cd*(S.rng?1.2:1):0;};
{const _dm=nrDarkMix;nrDarkMix=function(n,l){l=l||nrLvl();const out=_dm.call(this,n,l);
  const add=[['spider',Math.max(1,Math.round(n*.08))],['scorpion',Math.max(1,Math.round(n*.06))],['cerberus',l>=2?Math.max(1,Math.round(n*.05)):1],['medusa',Math.max(1,Math.round(n*.04))]];if(l>=3&&!out.includes('cyclops'))add.push(['cyclops',1]);if(l>=2&&!out.includes('wyvern'))add.push(['wyvern',1]);if(l>=6)add.push(['wyvern',1]);
  let c=0;for(const[k,m]of add)for(let i=0;i<m;i++){let j=out.lastIndexOf((c++)%3===2?'gobarch':'goblin');if(j<0)j=out.lastIndexOf('goblin');if(j<0)j=out.lastIndexOf('gobarch');if(j<0)j=out.lastIndexOf('orc');if(j<0)break;out[j]=k;}
  return out;};}
{const _lm=nrLightMix;nrLightMix=function(n,dark){const out=_lm.apply(this,arguments),L=nrLvl(),tgt=.9*dark.reduce((s,k)=>s+nrStr(k),0);
  const add=[['centaur',Math.max(1,Math.round(n*.1))],['satyr',Math.max(1,Math.round(n*.06))],['unicorn',Math.max(1,Math.round(n*.05))]];if(L>=2)add.push(['minotaur',Math.max(1,Math.round(n/18))]);
  for(const[k,m]of add)for(let i=0;i<m;i++){let j=out.lastIndexOf('hobsol');if(j<0)j=out.lastIndexOf('elf');if(j<0)break;out[j]=k;}
  let s=out.reduce((a,k)=>a+nrStr(k),0);const UP={hobsol:'elf',elf:'dwarf',dwarf:'unirider',satyr:'centaur'};
  for(let j=0;s<tgt&&j<out.length*3;j++){const q=j%out.length,up=UP[out[q]];if(up){s+=nrStr(up)-nrStr(out[q]);out[q]=up;}}return out;};}
// vanguards and patrols get a little variety too
{const _mk=nrMkSq;nrMkSq=function(kind,side,list,route,o){list=list.slice();const l=nrLvl();
  if(kind==='van'&&side==='D'){for(let i=1;i<list.length;i++)if((list[i]==='goblin'||list[i]==='gobarch')&&rnd()<.35)list[i]=nrPick([['spider',3],['scorpion',2],['cerberus',l>=2?2:1],['wyvern',l>=4?1:0]]);}
  if(kind==='patrol'&&side==='L'&&rnd()<.6)list[list.length-1]=nrPick([['centaur',3],['satyr',2],['unicorn',2],['minotaur',l>=2?1:0]]);
  return _mk.call(this,kind,side,list,route,o);};}
// war units: their own side, their war stats while they update / fight abstractly
nrEnemy=function(a,b){const A=a.side||NRS[a.species].side,B=b.side||NRS[b.species].side;return (A==='L'&&(B==='D'||B==='W'))||(B==='L'&&(A==='D'||A==='W'));};
{const _nu=nrUpd;nrUpd=function(u,dt){if(u.war&&NR_WARS[u.species]){const k=u.species,old=NRS[k];NRS[k]=NR_WARS[k];try{return _nu.apply(this,arguments);}finally{NRS[k]=old;}}return _nu.apply(this,arguments);};}
{const _af=nrAbsFight;nrAbsFight=function(a,b,dt){const old={};for(const k in NR_WARS){old[k]=NRS[k];NRS[k]=NR_WARS[k];}try{return _af.apply(this,arguments);}finally{for(const k in old)NRS[k]=old[k];}};}
// ---- 12. (QUEUE 32/33) The HYDRA mini boss lives in the old Gorgon temple at the far west of the dark lands; Medusa is now a regular dark-side creature (below) ----
// 3-5 cartoony heads (more at higher levels) bite up close and spit swamp water from range. Knock a head down and it hisses and REGROWS after 6 s, unless you
// BURN the stump first (fire on the hydra cauterizes every open stump; a head regrows at most twice). All heads down at once = defeated (dizzy, then a long nap).
// Reward: +50 MAX HEALTH (the bar keeps its fixed width, items 19/20). Stays beaten for the rest of this dragon's life (G.mdDown, the old Medusa flag: an old
// save where Medusa was beaten counts the Hydra as beaten). Not edible: it is far too big, it just slinks into its pool for a nap.
const MDL={x:-16300,y:-9300,r:330};
const HYD={on:false,x:MDL.x,y:MDL.y,face:1,heads:[],koT:0,hitT:-9,toastT:-99,anim:0,P:[]};
const HY_K={reward:50,grow:6,regrowMax:2,biteR:200,biteDm:3,spitDm:4,spitSp:380,spitR:640};
function hyHeadN(){return Math.min(5,3+Math.floor((nrLvl()-1)/2));}
function hyHeadHp(){return Math.round(Math.min(260,85+20*(nrLvl()-1)));}
function mdDown(){return !!G.mdDown;}
function hyAlive(h){return h.hp>0;}
function hyMaxHp(){return HYD.heads.length*hyHeadHp();}
function hyHpNow(){let s=0;for(const h of HYD.heads)s+=Math.max(0,h.hp);return s;}
function hyStart(){HYD.on=true;HYD.x=MDL.x;HYD.y=MDL.y;HYD.koT=0;HYD.P=[];const n=hyHeadN(),hp=hyHeadHp(),sv=Array.isArray(G.hyHeads)?G.hyHeads:null;HYD.heads=[];
  for(let i=0;i<n;i++){const v=sv&&sv[i]!=null?sv[i]:hp;HYD.heads.push({i,hp:v>0?Math.min(v,hp):0,grow:0,burnt:v>0?0:1,regrow:0,cd:R(.8,2),bite:0,spCd:R(2.5,4.5),hitT:-9});}}
function hySave(){G.hyHeads=HYD.heads.map(h=>h.hp>0?Math.round(h.hp):(h.burnt?0:-1));} // -1 = an open stump: it regrows if you leave
function hyHeadPos(h){const n=HYD.heads.length,k=h.i-(n-1)/2,sw=Math.sin(HYD.anim*1.6+h.i*1.3)*8,b=h.bite>0?14:0;
  return {x:HYD.x+HYD.face*28+k*44+sw*.6+HYD.face*b,y:HYD.y-118+Math.abs(k)*16+Math.cos(HYD.anim*2+h.i)*5+b*.4};}
function hyNearest(px,py){let b=null,bd=1e9;for(const h of HYD.heads)if(hyAlive(h)){const p=hyHeadPos(h),d=Math.hypot(p.x-px,p.y-py);if(d<bd){bd=d;b=h;}}return b;}
function hyHurt(d,how,px,py){if(!HYD.on||HYD.koT>0||mdDown()||d<=0)return;const h=hyNearest(px==null?D.x:px,py==null?D.y-60:py);if(!h)return;
  h.hp-=d;h.hitT=HYD.hitT=G.t;G.hyHits=(G.hyHits||0)+1;
  if(h.hp<=0){h.hp=0;G.hyCut=(G.hyCut||0)+1;const p=hyHeadPos(h);puff(p.x,p.y,10,'rgba(150,200,140,',80,8);
    if(h.regrow>=HY_K.regrowMax){h.burnt=1;h.grow=0;float(p.x,p.y-30,'Hisss! That head is too tired to grow back','#c8ffb0');}
    else{h.grow=HY_K.grow;float(p.x,p.y-30,'Hisss! A head is down - burn the stump before it grows back!','#c8ffb0');}
    if(HYD.heads.every(q=>!hyAlive(q))){HYD.koT=2.2;float(HYD.x,HYD.y-170,'Dizzy!','#ffe28a');}}
  hySave();}
function hyDefeat(){HYD.on=false;HYD.P=[];G.mdDown=1;G.hyHeads=null;G.hyWins=(G.hyWins||0)+1;G.mdWins=(G.mdWins||0)+1;puff(HYD.x,HYD.y-40,14,'rgba(150,210,190,',90,10);sparkle(HYD.x,HYD.y-80,24);
  const gain=HY_K.reward;D.hpBonus=(D.hpBonus||0)+gain;D.maxHp+=gain;D.hp=D.maxHp;D.healFx=1;G.hyHp=(G.hyHp||0)+gain;
  G.banner={text:'The Hydra is defeated!',sub:`It slinks into the temple pool for a very long nap (you can gobble it up). You feel tougher: +${gain} max health (now ${D.maxHp}, until you lose this dragon)`,t:4.5};
  float(D.x,D.y-heightOf()-130,`MAX HEALTH +${gain}!`,'#7aff8a');
  showToast(`🐉 The Hydra is defeated! ❤️ +${gain} max health`);try{horn();}catch(e){}}
function hyUpd(dt){if(mdDown()){HYD.on=false;return;}const dd=Math.hypot(D.x-MDL.x,D.y-MDL.y);
  if(!HYD.on){if(dd<1500)hyStart();else return;}if(dd>2600){hySave();HYD.on=false;HYD.P=[];return;}HYD.anim+=dt;
  if(HYD.koT>0){HYD.koT-=dt;HYD.P=[];if(HYD.koT<=0)hyDefeat();return;}
  const de=Math.hypot(D.x-HYD.x,D.y-HYD.y),near=de<900&&!G.over;if(Math.abs(D.x-HYD.x)>4)HYD.face=D.x>HYD.x?1:-1;
  if(near&&G.t-HYD.toastT>40){HYD.toastT=G.t;showToast('🐉 The HYDRA! Knock its heads down - and burn the stumps before they grow back!');}
  // regrowing stumps
  for(const h of HYD.heads)if(!hyAlive(h)&&!h.burnt&&h.grow>0){h.grow-=dt;if(h.grow<=0){h.regrow++;h.hp=Math.round(hyHeadHp()*.6);G.hyRegrow=(G.hyRegrow||0)+1;const p=hyHeadPos(h);float(p.x,p.y-30,'The head grows back! Use fire on the stumps','#ffe0a0');hySave();}}
  // drift a little toward the dragon inside the temple pool
  if(near&&de>140){const a=Math.atan2(D.y-HYD.y,D.x-HYD.x),nx=HYD.x+Math.cos(a)*40*dt,ny=HYD.y+Math.sin(a)*30*dt;if(Math.hypot(nx-MDL.x,(ny-MDL.y)*1.3)<MDL.r-60){HYD.x=nx;HYD.y=ny;}}
  // swamp-water spit (projectiles)
  for(const p of HYD.P){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(!G.over&&Math.hypot(D.x-p.x,D.y-p.y)<46+(D.alt>.3?30:0)&&D.alt<.85){p.dead=1;hurtDragon(HY_K.spitDm,'hydra');G.hySpitHits=(G.hySpitHits||0)+1;float(D.x,D.y-heightOf()-80,`Splash! Swamp spit -${HY_K.spitDm}`,'#a8f0c8');puff(D.x,D.y-20,6,'rgba(150,220,180,',60,5);}
    if(p.t>2.2)p.dead=1;}
  if(HYD.P.length)HYD.P=HYD.P.filter(p=>!p.dead);
  if(!near)return;
  for(const h of HYD.heads){if(!hyAlive(h))continue;if(h.bite>0)h.bite-=dt;h.cd-=dt;h.spCd-=dt;const hp=hyHeadPos(h),dh=Math.hypot(D.x-hp.x,D.y-(hp.y+90));
    if(h.cd<=0&&de<HY_K.biteR&&D.alt<.6){h.cd=R(1.3,1.8);h.bite=.25;hurtDragon(HY_K.biteDm,'hydra');G.hyBites=(G.hyBites||0)+1;if(rnd()<.4)float(D.x+R(-20,20),D.y-90,`Snap! -${HY_K.biteDm}`,'#ffb0a0');}
    else if(h.spCd<=0&&de>150&&de<HY_K.spitR&&HYD.P.length<4){h.spCd=R(3.5,5.5);const a=Math.atan2(D.y-hp.y-60,D.x-hp.x);HYD.P.push({x:hp.x,y:hp.y+60,vx:Math.cos(a)*HY_K.spitSp,vy:Math.sin(a)*HY_K.spitSp,t:0});G.hySpits=(G.hySpits||0)+1;}}}
// the old stone-gaze freeze stays for saves that carry it; the new gaze (regular Medusas) only greys and slows for a moment
{const _ud=updDragon;updDragon=function(dt){if(D.mdGrey>0)D.mdGrey-=dt;if(D.mdStone>0&&!G.over){D.mdStone-=dt;if(D.vx!==undefined){D.vx=0;D.vy=0;}if(rnd()<.2)sparkle(D.x+R(-30,30),D.y-heightOf()-R(0,40),1);return;}return _ud.apply(this,arguments);};}
const MD_FILTER=(()=>{try{const c=document.createElement('canvas').getContext('2d');c.filter='grayscale(1)';return c.filter==='grayscale(1)';}catch(e){return false;}})();
{const _dd=drawDragon;drawDragon=function(){if(D.mdStone>0||D.mdGrey>0){ctx.save();if(MD_FILTER)ctx.filter=D.mdStone>0?'grayscale(1) brightness(1.15)':'grayscale(.85) brightness(1.1)';try{_dd.apply(this,arguments);}finally{ctx.restore();}
    if(!MD_FILTER){ctx.globalAlpha=.45;ell(D.x,D.y-heightOf()-10,70,40,'#9a9aa2');ctx.globalAlpha=1;}if(D.mdStone>0)txt('🗿',D.x,D.y-heightOf()-80,18,'#ddd','center');}else _dd.apply(this,arguments);
  if(D.nrEgg)eggCarryDraw();};}
// player attacks on the Hydra: fire (also burns the stumps), bite, stomp/dive, claw, lava
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);if(HYD.on&&!(HYD.koT>0)){
    if(inFire(HYD.x,HYD.y-40,ox,oy)||inFire(HYD.x,HYD.y,ox,oy)){for(const h of HYD.heads)if(!hyAlive(h)&&!h.burnt){h.burnt=1;h.grow=0;G.hyBurnt=(G.hyBurnt||0)+1;const p=hyHeadPos(h);puff(p.x,p.y,6,'rgba(90,80,80,',60,6);float(p.x,p.y-26,'Stump sealed! It won\'t grow back','#ffd27a');hySave();}}
    for(const h of HYD.heads)if(hyAlive(h)){const p=hyHeadPos(h);if(inFire(p.x,p.y+100,ox,oy)||inFire(HYD.x,HYD.y-40,ox,oy)){hyHurt(DR.fireDps*.5*dt/Math.max(1,HYD.heads.filter(hyAlive).length),'fire',p.x,p.y);}}}return r;};}
{const _te=tryEat;tryEat=function(){if(HYD.on&&!(HYD.koT>0)&&!(D.eatCD>0)&&D.alt<.5){const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;if(Math.hypot(mx-HYD.x,my-HYD.y+30)<150){hyHurt(18,'bite',mx,my-100);D.eatCD=.45;float(HYD.x,HYD.y-150,'Chomp! -18','#ffe0a0');return;}}return _te.apply(this,arguments);};}
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);if(HYD.on&&Math.hypot(D.x-HYD.x,D.y-HYD.y)<DR.stompR+80)hyHurt(30,'stomp');return r;};}
{const _ds=diveSlam;diveSlam=function(){const r=_ds.apply(this,arguments);if(HYD.on&&Math.hypot(D.x-HYD.x,D.y-HYD.y)<DR.stompR+100)hyHurt(40,'dive');return r;};}
if(typeof clawScratch==='function'){const _cs=clawScratch;clawScratch=function(){const r=_cs.apply(this,arguments);if(HYD.on&&D.alt<.5){const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;if(Math.hypot(mx-HYD.x,my-HYD.y)<170)hyHurt(12,'claw',mx,my-100);}return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);if(HYD.on&&Math.hypot(x-HYD.x,y-HYD.y)<LAVA_CFG.splashR+90)hyHurt(35,'lava',x,y-100);return r;};}
// drawing: the temple pool + the Hydra (or the sleeping Hydra once beaten)
function mdTemple(){mdTempleBase();mdTempleBack();}
// (item 47) the floor + pool go on the ground layer; the back pillars and the Hydra are depth-sorted with the dragon
function mdTempleBase(){const x=MDL.x,y=MDL.y;ell(x,y+10,MDL.r+40,(MDL.r+40)*.55,'rgba(40,30,40,.35)');ell(x,y,MDL.r,MDL.r*.5,'#6e6a66');ell(x,y-6,MDL.r-30,(MDL.r-30)*.46,'#8a857e');
  ell(x,y+4,MDL.r-90,(MDL.r-90)*.42,'#3d6e66');ell(x-20,y-2,MDL.r-130,(MDL.r-130)*.36,'#4f8a7c');for(let i=0;i<3;i++){const a=G.t*.7+i*2.1;ell(x+Math.cos(a)*90,y+Math.sin(a)*30,14,4,'rgba(200,240,230,.35)');}
  for(const[dx,dy]of[[-120,60],[140,50],[60,90]])ell(x+dx,y+dy,22,10,'#a49c8e');}
function mdBackY(){return MDL.y-(MDL.r-70)*.3;}
function mdTempleBack(){const x=MDL.x,y=MDL.y;
  for(let i=0;i<5;i++){const a=Math.PI*(1.05+i*.225),cx=x+Math.cos(a)*(MDL.r-70),cy=y+Math.sin(a)*(MDL.r-70)*.5,hgt=i%2?44:110;rect(cx-12,cy-hgt,24,hgt,'#b8b0a2');rect(cx-16,cy-hgt-8,32,9,'#9a9284');rect(cx-16,cy-4,32,8,'#9a9284');if(i%2)poly([cx-12,cy-hgt,cx+12,cy-hgt,cx+4,cy-hgt-12,cx-6,cy-hgt-6],'#b8b0a2');}
  poly([x-90,y-120,x+90,y-120,x+70,y-150,x-70,y-150],'#9a9284');}
function hyArt(sleep){const x=HYD.on?HYD.x:MDL.x,y=HYD.on?HYD.y:MDL.y,f=HYD.face,T=G.t,body='#3f9a7a',dk='#2a6e56',bel='#cfe8a0',ko=HYD.koT>0;
  ell(x,y+6,96,30,'rgba(20,40,40,.35)');
  for(let i=5;i>=0;i--){const tx=x-f*(60+i*14),ty=y+2+Math.sin(T*2+i)*3;ell(tx,ty,18-i*2,9-i,body);}
  ell(x,y-24,70,40,body);ell(x+f*6,y-14,48,20,bel);for(let i=0;i<4;i++)poly([x-36+i*22,y-58+Math.abs(i-1.5)*4,x-28+i*22,y-74+Math.abs(i-1.5)*4,x-20+i*22,y-58+Math.abs(i-1.5)*4],dk);
  if(sleep){for(let i=0;i<3;i++){const hx=x+(i-1)*38,hy=y-30+Math.abs(i-1)*6;ell(hx,hy,15,10,body);line(hx+3,hy-2,hx+11,hy-2,'#1a3a2a',1.6);}
    for(let i=0;i<3;i++){const p=((T*.5+i/3)%1);txt('z',x+40+p*30,y-70-p*50,10+p*10,'rgba(255,255,255,'+(1-p)+')','center');}return;}
  const heads=HYD.heads.length?HYD.heads:[0,1,2].map(i=>({i,hp:1,bite:0,grow:0,burnt:0,hitT:-9}));
  for(const h of heads){const p=HYD.heads.length?hyHeadPos(h):{x:x+(h.i-1)*44,y:y-118+Math.abs(h.i-1)*16},bx=x+(h.i-(heads.length-1)/2)*18,by=y-46;
    if(hyAlive(h)){ctx.strokeStyle=body;ctx.lineWidth=15;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx-f*10,(by+p.y)/2,p.x,p.y+8);ctx.stroke();
      ctx.strokeStyle=bel;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(bx+f*3,by);ctx.quadraticCurveTo(bx-f*7,(by+p.y)/2,p.x+f*3,p.y+10);ctx.stroke();
      const open=h.bite>0;ell(p.x,p.y,17,12,body);poly([p.x-f*6,p.y-10,p.x-f*14,p.y-22,p.x-f*2,p.y-12],dk);ell(p.x+f*14,p.y+(open?5:3),12,open?7:5,body);
      if(open){ell(p.x+f*15,p.y+7,8,4,'#c83048');ell(p.x+f*20,p.y+4,1.4,2,'#fff');ell(p.x+f*11,p.y+4,1.4,2,'#fff');}else line(p.x+f*6,p.y+6,p.x+f*24,p.y+6,'#1a3a2a',1.4);
      ell(p.x+f*4,p.y-4,4.4,4.4,'#fff');ell(p.x+f*5,p.y-4,2.2,2.6,ko?'#888':'#2a2010');if(ko){txt('×',p.x+f*4,p.y-1,10,'#333','center');}
      ell(p.x+f*24,p.y+2,1.2,1,'#1a3a2a');if(G.t-h.hitT<.12){ctx.globalAlpha=.5;ell(p.x,p.y,20,15,'#fff');ctx.globalAlpha=1;}}
    else{const sx=bx+f*4,sy=by-24;ctx.strokeStyle=body;ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(sx,sy);ctx.stroke();
      ell(sx,sy,8,5,h.burnt?'#5a4a44':'#e89a7a');if(h.burnt){if(rnd()<.15)puff(sx,sy-6,1,'rgba(120,120,120,',20,3);}
      else if(h.grow>0){const g=1-h.grow/HY_K.grow;ell(sx,sy-6-g*10,5+g*8,4+g*5,body);ell(sx+f*(2+g*4),sy-8-g*10,1.6+g,1.6+g,'#fff');}}}
  if(ko){for(let i=0;i<3;i++){const an=T*5+i*TAU/3;txt('★',x+Math.cos(an)*30,y-150+Math.sin(an)*6,13,'#ffe060','center');}}
  for(const p of HYD.P){ell(p.x,p.y,7,6,'rgba(140,230,190,.85)');ell(p.x-2,p.y-2,2.5,2,'rgba(255,255,255,.8)');}}
function mdVis(){return Math.abs(MDL.x-cam.x)<=VW/cam.z/2+700&&Math.abs(MDL.y-cam.y)<=VH/cam.z/2+600;}
function mdDraw(){if(!mdVis())return;txt('Temple of the Hydra',MDL.x,MDL.y+MDL.r*.5+28,14,'#e8e0d0','center');if(!SP47.done.mdP)mdTempleBack();if(!SP47.done.hy)mdHyDraw();}
function mdHyDraw(){
  if(mdDown()){if(G.hyEaten)return;hyArt(true);txt('The Hydra (fast asleep - gobble it up?)',MDL.x,MDL.y-130,13,'#e0f0e8','center');return;}hyArt(false);}
// once beaten (all heads down) the sleeping Hydra can be gulped like other big creatures (optional); it is gone until the next dragon
{const _te=tryEat;tryEat=function(){if(mdDown()&&!G.hyEaten&&!(D.eatCD>0)&&D.alt<.5&&scene==='play'&&Math.hypot(D.x-MDL.x,D.y-MDL.y)<220){G.hyEaten=1;D.eatCD=.6;D.eatT=.3;const h=40;D.hp=Math.min(D.maxHp,D.hp+h);try{feed(h);}catch(e){}try{if(typeof glutEat==='function')glutEat(60);}catch(e){}
    G.stats.eaten=(G.stats.eaten||0)+1;puff(MDL.x,MDL.y-30,16,'rgba(150,220,190,',100,10);float(MDL.x,MDL.y-90,'BIG GULP! The Hydra (+'+h+')','#ffe28a');showToast('🐉 Gulp! The Hydra is gone - until the next dragon comes along...');if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play('gulp',MDL.x,MDL.y,1);}catch(e){}return;}
  return _te.apply(this,arguments);};}
{const _f=nrDrawFx;nrDrawFx=function(){mdDraw();return _f.apply(this,arguments);};}
// boss bar (fixed width, items 19/20): total head health, plus how many heads are up
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!HYD.on||mdDown()||!HYD.heads.length)return;const S=hudSlot('hydra',Math.min(384,VW*.55+4),16),w=S.w-4,x=S.x+2,y=S.y+2,up=HYD.heads.filter(hyAlive).length,lab=`🐉 Hydra · ${up}/${HYD.heads.length} heads up`;
  rect(x-2,y-2,w+4,16,'rgba(0,0,0,.6)');rect(x,y,w*Math.max(0,hyHpNow())/Math.max(1,hyMaxHp()),12,'#4fc39a');txt(lab,S.cx,y+10,hudFit(lab,S.w-6,11),'#fff','center');};}
{const _t=nrTick;nrTick=function(dt){_t(dt);hyUpd(dt);};}
// ---- Medusa, now a REGULAR dark-side creature: a few roam the Goblin Bogs (far west); she can march with the dark armies. Snake-hair nips up close and a short,
// telegraphed stone gaze: if you are facing her when her eyes flash you turn grey and slow for 1.2 s (never deadly). Normal health bar, edible like any creature. ----
NRS.medusa={hp:30,sp:86,side:'D',dm:2.5,cd:1.3,food:22,sz:1.05,aggro:460};
NR_SP.add('medusa');NR_NAMES.medusa='Medusas';HEAL.medusa=FOOD.medusa=22;FAUNA.medusa={hp:30,sp:86,zone:'nr'};
if(typeof DG!=='undefined'&&DG.ch)DG.ch.medusa=.15;
if(typeof tallyAddSect==='function')tallyAddSect('nrdark','Northern Realms · Dark lands','👹','#9ad06a',[['medusa',NR_NAMES.medusa]]);
NR_AMB.goblin.push(['medusa',2]);NR_AMB.orc.push(['medusa',.6]);
const MD_GZ={tele:.9,grey:1.2,r:460,gap:3};
function mduFacing(u){return Math.abs(angDiff(Math.atan2(u.y-30-D.y,u.x-D.x),D.ang))<1.15;}
function mdAttack(u,S,T,dt,isD,_na,args){const d=Math.hypot(T.x-u.x,T.y-u.y);if(Math.abs(T.x-u.x)>1)u.face=T.x>u.x?1:-1;u.gzCd=(u.gzCd===undefined?R(2,4):u.gzCd)-dt;if(u.hb>0)u.hb-=dt;
  if(u.gz>0){u.gz-=dt;if(u.gz<=0){G.mdGazes=(G.mdGazes||0)+1;if(isD&&!G.over&&Math.hypot(D.x-u.x,D.y-u.y)<MD_GZ.r+40&&mduFacing(u)){D.mdGrey=MD_GZ.grey;D.webT=Math.max(D.webT||0,MD_GZ.grey);G.mdStoned=(G.mdStoned||0)+1;float(D.x,D.y-heightOf()-90,'Stone gaze! Slowed for a moment','#d0d0d8');}
      else if(isD){G.mdDodged=(G.mdDodged||0)+1;float(D.x,D.y-heightOf()-90,'You looked away!','#e0ffe0');}}return;}
  if(isD&&u.gzCd<=0&&d<MD_GZ.r&&G.t-(G.mdGazeG||-99)>MD_GZ.gap){u.gzCd=R(7,9);u.gz=MD_GZ.tele;G.mdGazeG=G.t;float(u.x,u.y-56,'Her eyes glow... LOOK AWAY!','#fff2a0');return;}
  if(d>nrMeleeR(u)){moveTo(u,T.x,T.y,S.sp,dt);u.anim=(u.anim||0)+dt*10;return;}
  if(u.cd<=0){u.cd=S.cd*R(.9,1.15);u.hb=.25;if(isD){hurtDragon(S.dm,'medusa');u.lastHitD=G.t;if(rnd()<.5)float(D.x+R(-20,20),D.y-90,'Hiss! Snake-hair nip','#c8ffb0');}else nrHit(T,S.dm,u);}}
{const _na=nrAttack;nrAttack=function(u,S,T,dt,isD){if(u.species==='medusa')return mdAttack(u,S,T,dt,isD);return _na.apply(this,arguments);};}
function mdArt(x,y,f,s,stone,st){st=st||{};const T=G.t,sk=stone?'#a8a8ae':'#7ec07a',tail=stone?'#8e8e96':'#4e9a5a',bel=stone?'#bcbcc2':'#d8e8a0',dress=stone?'#9a9aa2':'#7a4aa8';
  ctx.save();ctx.translate(x,y);ctx.scale(s*f,s);
  for(let i=6;i>=0;i--){const tx=-14-i*9,ty=-2+Math.sin(T*3+i)*(stone?0:2)+(i>3?4:0);ell(tx,ty,13-i*.9,8-i*.5,tail);ell(tx,ty+2,9-i*.6,3.5,bel);}
  ell(-74,2,9,5,tail);poly([-80,0,-96,-4,-82,6],tail);
  ell(0,-18,18,22,dress);ell(0,-4,24,8,dress);ell(0,-46,12,13,sk);ell(-10,-28,4,10,sk);ell(10,-28,4,10,sk);
  const glow=st.gz>0&&!stone;for(let i=0;i<8;i++){const a=-Math.PI*.95+i*Math.PI*.9/7,bx=Math.cos(a)*11,by=-50+Math.sin(a)*11,w=stone?0:Math.sin(T*6+i*1.3)*3+(st.hb>0&&i%2?6:0),hx=bx+Math.cos(a)*14+w,hy=by+Math.sin(a)*12;
    ctx.strokeStyle=tail;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+Math.cos(a)*8-w,by+Math.sin(a)*6,hx,hy);ctx.stroke();ell(hx,hy,3.6,2.8,tail);if(!stone){ell(hx+1,hy-1,.8,.8,'#fff');}}
  ell(-4,-47,2.6,glow?3:2,glow?'#fff6a0':stone?'#888':'#2a3a20');ell(4,-47,2.6,glow?3:2,glow?'#fff6a0':stone?'#888':'#2a3a20');
  ctx.strokeStyle='#4a2a3a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,-42,3.5,.2,Math.PI-.2);ctx.stroke();
  if(glow){const p=1-st.gz/(st.gzMax||1.2);ctx.globalAlpha=.25+.5*p;ell(0,-47,22+30*p,14+16*p,'#fff6a0');ctx.globalAlpha=1;}
  ctx.restore();}
NR_DRAW.medusa=function(x,y,s,f,a,u){mdArt(x+6*s*f,y-4*s,f,s*.62,false,{gz:u.gz||0,gzMax:MD_GZ.tele,hb:u.hb||0});};
// map marker
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s;
  if(big||!mdDown()){ell(X(MDL.x),Y(MDL.y),big?5:3,big?5:3,mdDown()?'#9a9aa2':'#4fc39a');if(big)txt(mdDown()?'Hydra temple (asleep)':'🐉 Hydra',X(MDL.x)+8,Y(MDL.y)+4,10,'#e8ffe0','left');}
  for(const k in NR_CC){const c=NR_CC[k];/* queue 137: the castle icon itself is drawn by mapCastles (q.js) */if(big)txt(c.n,X(c.x)+17,Y(c.y)+4,11,k==='L'?'#e8f0ff':'#ffb0a0','left');}}catch(e){}return r;};}
// 10/12/32: stays down for the rest of this dragon's life: carried over levels, cleared when the dragon dies (newGame makes a fresh G)
{const _nl=nextLevel;nextLevel=function(){const k={mdDown:G.mdDown,mdWins:G.mdWins,hyWins:G.hyWins,hyHp:G.hyHp,hyEaten:G.hyEaten};const r=_nl.apply(this,arguments);Object.assign(G,k);HYD.on=false;HYD.P=[];return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);HYD.on=false;HYD.koT=0;HYD.P=[];HYD.heads=[];D.mdStone=0;D.mdGrey=0;return r;};}
const MDB=HYD; // older code/tests read MDB.on
// ---- 18. the carried egg is drawn in the claws, under the dragon, at flight height, with a glow, plus a HUD icon ----
function eggCarryDraw(){const h=heightOf(),a=D.ang,s=.85+.25*D.alt,x=D.x-Math.cos(a)*6,y=D.y-h+26+8*D.alt,W=D.nrEgg==='W',p=.5+.5*Math.sin(G.t*4);
  ctx.globalAlpha=.35+.2*p;ell(x,y-14*s,30*s,32*s,W?'#ffffff':'#6a3aff');ctx.globalAlpha=1;
  for(const sd of[-1,1])line(x+sd*14,y-30*s,x+sd*9*s,y-12*s,'#5a4030',3);
  nrEggArt(x,y,D.nrEgg,s);for(const sd of[-1,1]){ell(x+sd*9*s,y-12*s,4,3,'#3a2a20');}G.eggDrawn=G.fc;}
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!D.nrEgg)return;const W=D.nrEgg==='W',S=hudSlot('egg',208,24),y=S.y+2,lab=W?'Carrying the WHITE egg → lair':'Carrying the BLACK egg → lair';
  rect(S.x,S.y,S.w,24,'rgba(0,0,0,.55)');ell(S.x+16,y+11,7,9,W?'#f4f4fa':'#1e1a26');ell(S.x+16,y+11,8.5,10.5,W?'rgba(255,255,255,.35)':'rgba(140,90,255,.45)');
  txt(lab,S.x+28+(S.w-30)/2,y+15,hudFit(lab,S.w-32,11),'#fff2c0','center');G.eggHud=G.fc;};}
// ---- 19/20. no HUD bar grows with its max: the health bar keeps the same fixed width as the others (fill = hp/maxHp, numbers as text) ----
hpBarW=function(){return 230;};
// saving mid-fight keeps the Hydra's heads (cut / burnt) - they are written to G before the snapshot
{const _ss=svSnapshot;svSnapshot=function(){try{if(HYD.on&&HYD.heads.length)hySave();}catch(e){}return _ss.apply(this,arguments);};}
// ======================= queue 3-9, 13, 14: kingdom economy + creature upgrades (worm, treasury, stone, carts, towers, landing dragons, KO linger, lava burrows) =======================
// ---- 3. the sand worm only hunts a LANDED dragon in OPEN desert: towns (Sandhaven etc.) and oases are safe zones, flying is safe ----
const WORM_SAFE={town:750,oasis:260};
function wormSafe(x,y){if(typeof inOasis==='function'&&(inOasis(x,y)||Math.hypot((x-OASIS.x)/(OASIS.rx+WORM_SAFE.oasis),(y-OASIS.y)/(OASIS.ry+WORM_SAFE.oasis))<1))return 'oasis';
  for(const v of VILLAGES)if(d2(x,y,v.x,v.y)<WORM_SAFE.town)return 'town';return null;}
{const _uw=updWorm;updWorm=function(u,dt){const safe=wormSafe(D.x,D.y);if(safe){
    // the dragon stands in a safe zone: the worm loses the scent and keeps to its own dunes
    const sv=D.alt;D.alt=1;try{_uw.call(this,u,dt);}finally{D.alt=sv;}if(D.alt<.4&&dist(u,D)<750){G.wormSafeT=(G.wormSafeT||0)+dt;}return;}
  const w0=u.warn;const r=_uw.apply(this,arguments);if(u.warn!==w0)G.wormWarn=(G.wormWarn||0)+1;if(u.ws==='up'&&u.upT>4.4&&!u.burstSeen){u.burstSeen=1;G.wormBurst=(G.wormBurst||0)+1;}if(u.ws==='under')u.burstSeen=0;return r;};}
// rumble ripples above a hunting worm (fair warning before it bursts)
{const _dw=drawWorm;drawWorm=function(u){if(u.ws==='under'&&D.alt<.4&&dist(u,D)<750&&!wormSafe(D.x,D.y)){const p=(G.t*2)%1;for(let i=0;i<2;i++){const q=(p+i*.5)%1;ctx.strokeStyle=`rgba(120,90,50,${.5*(1-q)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(u.x,u.y,14+q*40,6+q*16,0,0,TAU);ctx.stroke();}}return _dw.apply(this,arguments);};}
// ---- 4. no treasury cap (there never was one on the piles); HUD numbers stay short and clean however big the hoard gets ----
uiAmt=function(n){n=Math.max(0,Math.floor(+n||0));const f=(v,s)=>{const t=v>=100?String(Math.round(v)):v>=10?v.toFixed(1):v.toFixed(2);return(t.includes('.')?t.replace(/\.?0+$/,''):t)+s;};
  return n>=1e9?f(n/1e9,'B'):n>=1e6?f(n/1e6,'M'):n>=1e4?f(n/1e3,'k'):String(n);};
// ---- 6. supply carts run ~1.8x more trips (shorter loading/dispatch, quicker carts, one more cart per source, faster replacements) ----
const SC_OLD={loadEvery:SC.loadEvery,lazyGo:SC.lazyGo,speed:SC.speed,perSrc:SC.perSrc,respawn:SC.respawn};Object.assign(SC,{loadEvery:.6,lazyGo:12,speed:58,perSrc:3,respawn:20});
// ---- 5 + 8. wood buildings upgrade to STONE (grey walls, slate roofs, +60% HP, fire-resistant): only while stone > 100, at most one per game minute ----
const STUP={min:100,every:60,hp:1.6,fire:.4,hit:.6,kinds:new Set(['hut','barn','cabin','barracks','gate','minehut','sawmill','bakery','smithy','jeweler','storehouse','fishmonger','adobe'])};
const kStruct=s=>!s.nr&&!isRT(s)&&s.kind!=='bridge'; // kingdom buildings (bridges have their own stone upgrade)
function stUpCost(k){const c=COST[k]||[3,1];return c[0]+c[1]+2;} // stone for the stone version
function stoneReserve(){let n=0;for(const s of structures){if(!kStruct(s))continue;n+=STUP.kinds.has(s.kind)?stUpCost(s.kind):(COST[s.kind]||[0,0])[1];}return n;}
function woodReserve(){let n=0;for(const s of structures){if(!kStruct(s))continue;n+=(COST[s.kind]||[0,0])[0];}return n;}
function stBase(s){if(!s.hp0)s.hp0=(KDEF[s.kind]&&KDEF[s.kind].hp)||s.maxHp;return s.hp0;}
function stUpgrade(s){const c=stUpCost(s.kind);G.stone-=c;const b=stBase(s),f=s.hp/s.maxHp;s.stoneUp=1;s.maxHp=Math.round(b*STUP.hp);s.hp=Math.round(s.maxHp*f);G.stUps=(G.stUps||0)+1;G.stLast=G.t;
  puff(s.x,s.y-10,10,'rgba(200,200,210,',80,8);if(dist(s,D)<1500)float(s.x,s.y-60,`Masons rebuild the ${STRUCT_NAME[s.kind]||s.kind} in STONE (-${c} stone)`,'#d8dce6');
  if(typeof showToast==='function'&&(G.stUps<=3||G.stUps%10===0))showToast(`🧱 ${STRUCT_NAME[s.kind]||s.kind} upgraded to stone (${G.stUps} so far)`);}
function stTick(dt){if(!G||G.over)return;G.stT=(G.stT||0)+dt;if(G.stT<STUP.every||G.stone<=STUP.min)return;
  const C={x:GATE.x,y:GATE.y};let best=null,bd=1e18;for(const s of structures){if(!kStruct(s)||!STUP.kinds.has(s.kind)||s.stoneUp||s.state!=='ok'||s.fire)continue;if(G.stone-stUpCost(s.kind)<0)continue;const d=d2(s.x,s.y,C.x,C.y);if(d<bd){bd=d;best=s;}}
  if(best){G.stT=0;stUpgrade(best);}}
// stone takes less from everything and much less from fire; a collapsed stone building is rebuilt in stone if the stone is there
{const _h=hurtStruct;hurtStruct=function(s,d){if(s&&s.stoneUp&&!HEAVY)d*=s.fire?STUP.fire:STUP.hit;return _h.call(this,s,d);};}
{const _r=onRuin;onRuin=function(s){const r=_r.apply(this,arguments);if(s&&s.stoneUp){const c=stUpCost(s.kind);if(G.stone>=c+STUP.min*0){G.stone-=c;s.stoneKeep=1;}else{s.stoneUp=0;s.maxHp=stBase(s);G.stLost=(G.stLost||0)+1;}}return r;};}
// fire catches stone roofs only half as often
{const _af=applyFire;applyFire=function(){const S=structures.filter(s=>s.stoneUp&&!s.fire);const r=_af.apply(this,arguments);for(const s of S)if(s.fire&&rnd()<.5){s.fire=0;G.stFireShrug=(G.stFireShrug||0)+1;}return r;};}
const ST_FILTER=(()=>{try{const c=document.createElement('canvas').getContext('2d');c.filter='grayscale(1)';return c.filter==='grayscale(1)';}catch(e){return false;}})();
{const _ds=drawStruct;drawStruct=function(s){if(!s||!s.stoneUp||s.state==='ruin')return _ds.apply(this,arguments);const sz=(KDEF[s.kind]&&KDEF[s.kind].sz)||({hut:24,barn:34,cabin:26,barracks:40,gate:44}[s.kind])||28;
  if(ST_FILTER){ctx.save();ctx.filter='grayscale(.92) brightness(1.08) contrast(1.05)';try{_ds.apply(this,arguments);}finally{ctx.restore();}}
  else{_ds.apply(this,arguments);ctx.save();ctx.globalAlpha=.55;rect(s.x-sz*.85,s.y-sz*1.05,sz*1.7,sz*1.05,'#9a9ca6');ctx.restore();}
  // stone courses + a slate roof cap so the upgrade reads on every device
  ctx.save();ctx.globalAlpha=.6;for(let r=1;r<4;r++)line(s.x-sz*.8,s.y-sz*.26*r,s.x+sz*.8,s.y-sz*.26*r,'#5e6068',1);
  for(let r=0;r<4;r++)for(let i=-2;i<=2;i++)line(s.x+i*sz*.3+(r%2)*sz*.15,s.y-sz*.26*r,s.x+i*sz*.3+(r%2)*sz*.15,s.y-sz*.26*(r+1),'#5e6068',1);ctx.globalAlpha=.9;
  poly([s.x-sz*.95,s.y-sz*1.02,s.x,s.y-sz*1.62,s.x+sz*.95,s.y-sz*1.02],'#4a5262');line(s.x-sz*.95,s.y-sz*1.02,s.x+sz*.95,s.y-sz*1.02,'#2e3440',2);ctx.restore();};}
// ---- 7 + 8. defensive towers come from SURPLUS only: wooden archer towers from wood above the full-kingdom wood rebuild reserve;
// giant stone crossbow (scorpion) towers only once the stone stock covers rebuilding the WHOLE kingdom in stone (spending only the surplus) ----
rtCanPay=function(k){if(!k)return rtCanPay('stower')||rtCanPay('wtower');const[w,s]=RT.T[k].cost;
  if(k==='wtower')return G.wood-woodReserve()>=w&&G.stone>=s;return G.stone-stoneReserve()>=s&&G.wood>=w;};
rtUnlocked=function(k){return rtCanPay(k);};
rtPay=function(k){const[w,s]=RT.T[k].cost;G.wood-=w;G.stone-=s;G.rtSpent=(G.rtSpent||0)+w+s;G.rtW=Math.max(0,(G.rtW||0)-w);G.rtS=Math.max(0,(G.rtS||0)-s);};
// once the kingdom is at its tower max, stone surplus turns standing archer towers into crossbow towers one at a time
{const _t=rtTick;rtTick=function(dt){_t.apply(this,arguments);if(!G||G.over)return;G.rtUpCk=(G.rtUpCk||0)-dt;if(G.rtUpCk>0)return;G.rtUpCk=RT.check;
  const T=rtTowers();if(T.length<rtMax()||T.some(s=>s.state==='building')||!rtCanPay('stower'))return;const s=T.find(q=>q.kind==='wtower'&&q.state==='ok');if(!s)return;
  for(const u of units)if(!u.dead&&u.wtS===s){u.dead=true;u.gone=true;}s.kind='stower';s.maxHp=KDEF.stower.hp;s.hp=s.maxHp;G.rtUpg=(G.rtUpg||0)+1;rtStartBuild(s,'up');};}
// ---- 9. wild dragons LAND to fight a grounded player: walk, bite, claw and breathe fire on the ground; take off when the player flies or they get hurt ----
const WDG={landR:520,offHurt:.18,reland:4,walk:.5,fireR:230,fireCd:3.4,clawDmg:3,fireDmg:4};
{const _w=updWD;updWD=function(u,dt){if(u.st==='attack'&&!(u.daze>0)){const dd=dist(u,D),easy=G.easy,thr=wdThreat();
    if(u.gnd){const hurt=u.gHp0-u.hp>u.maxHp*WDG.offHurt;if(D.alt>.5||hurt||!thr||u.atkT<=0||u.hp<u.maxHp*.3){u.gnd=0;u.toffT=G.t;G.wdOff=(G.wdOff||0)+1;if(dd<1400)float(u.x,u.y-60,hurt?'Ow! It flaps back up!':'It takes off after you!','#ffe6a8');}}
    else if(D.alt<.3&&thr&&dd<WDG.landR&&(!u.toffT||G.t-u.toffT>WDG.reland)&&u.hp>u.maxHp*.45){u.gnd=1;u.gHp0=u.hp;G.wdLand=(G.wdLand||0)+1;if(dd<1400)float(u.x,u.y-60,'THUD! The wild dragon lands to fight you!','#ffd0a0');}
    if(u.gnd){u.cd-=dt;u.fcd-=dt;u.atkT-=dt;u.fireT=Math.max(0,u.fireT-dt);u.anim=(u.anim||0)+dt;u.alt=lerp(u.alt,0,Math.min(1,dt*3));u.flapT+=dt*1.5;
      if(dd>64)wdMove(u,D.x,D.y,FAUNA.wdragon.sp*WDG.walk*(easy?.8:1),dt);else{const a=Math.atan2(D.y-u.y,D.x-u.x);u.ang=a;u.face=Math.cos(a)>0?1:-1;}
      if(u.alt<.15&&dd<84&&u.cd<=0){u.cd=easy?2.2:1.3;u.gSw=(u.gSw||0)+1;if(u.gSw%2){const dmg=easy?3:FAUNA.wdragon.bite;hurtDragon(dmg,'wdragon');G.wdGBite=(G.wdGBite||0)+1;float(D.x+R(-20,20),D.y-70,`Wild dragon bite! -${dmg}`,'#ffb0a0');}
        else{hurtDragon(WDG.clawDmg,'wdragon');G.wdClaw=(G.wdClaw||0)+1;G.wdClaws=(G.wdClaws||0)+1;float(D.x+R(-20,20),D.y-70,`Claw swipe! -${WDG.clawDmg}`,'#ffb0a0');}}
      if(u.alt<.15&&dd>70&&dd<WDG.fireR&&u.fcd<=0){u.fcd=WDG.fireCd;wdFire(u,1);G.wdGFire=(G.wdGFire||0)+1;const a=Math.atan2(D.y-u.y,D.x-u.x),df=Math.abs(Math.atan2(Math.sin(a-u.ang),Math.cos(a-u.ang)));
        if(df<.6&&D.alt<.3){hurtDragon(easy?2:WDG.fireDmg,'wdragon');float(D.x,D.y-80,'Scorched by dragon fire!','#ffb070');}}
      return;}}
  else u.gnd=0;return _w.apply(this,arguments);};}
// altitude hit rules: ground-only attacks (stomp/slam shockwave, claw scratch) cannot reach a wild dragon up in the air
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.species==='wdragon'&&!u.dead){if((src==='stomp'||src==='scratch')&&u.alt>.45){G.wdAirMiss=(G.wdAirMiss||0)+1;return;}}return _hu.apply(this,arguments);};}
// ---- 13. KO linger: a creature beaten (not eaten) goes dizzy with spinning stars for ~1.3 s, can still be gobbled for food, then puffs away ----
// never the princess or King William (they are never harmed in the first place). NR creatures already linger dizzy (NR_KO) and are now edible too.
let KOL=[];const KO_T=1.3;
function koOk(u){return u&&!u.nr&&u.type!=='sea'&&!u.princess&&!u.isPrincess&&!u.isKing&&!u.king&&u.species!=='wdragon'&&u.species!=='sandworm'&&!u.isPrince;}
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(!u||u.dead||!koOk(u)||Math.abs(u.x-D.x)>2000||Math.abs(u.y-D.y)>1500)return _hu.apply(this,arguments);
  const m=NR_MUTE;NR_MUTE=1;let r;try{r=_hu.apply(this,arguments);}finally{NR_MUTE=m;}
  if(u.dead&&!u.eaten&&!u.gone){KOL.push({u:Object.assign({},u,{dead:false}),src:u,t:0,src2:src});G.kolN=(G.kolN||0)+1;}else if(u.dead&&!NR_MUTE)puff(u.x,u.y,5,'rgba(235,235,245,',50,6);return r;};}
function koTick(dt){for(const k of KOL){k.t+=dt;if(k.t>=KO_T&&!k.done){k.done=1;puff(k.u.x,k.u.y-6,7,'rgba(235,235,245,',60,7);}}if(KOL.length)KOL=KOL.filter(k=>!k.done);}
function koStars(x,y,t){for(let i=0;i<3;i++){const a=t*6+i*TAU/3;const sx=x+Math.cos(a)*10,sy=y+Math.sin(a)*3.5;poly([sx,sy-3.5,sx+1.2,sy-1,sx+3.5,sy-1,sx+1.6,sy+.8,sx+2.3,sy+3.5,sx,sy+1.8,sx-2.3,sy+3.5,sx-1.6,sy+.8,sx-3.5,sy-1,sx-1.2,sy-1],'#ffe24a');}}
function koDraw(f){for(const k of KOL){const u=k.u;if(Math.abs(u.x-cam.x)>1800||Math.abs(u.y-cam.y)>1400||k._sp===SP47.r||(f&&!f(k)))continue;if(f)k._sp=SP47.r;u.anim=(u.anim||0);ctx.save();ctx.translate(u.x,u.y);ctx.rotate(Math.sin(k.t*9)*.18);ctx.translate(-u.x,-u.y);
    try{if(u.type==='knight')drawKnight(u);else if(u.type==='animal')drawAnimal(u);else drawPerson(u);}catch(e){}ctx.restore();koStars(u.x,u.y-(u.type==='animal'?22:34),k.t);}}
  // (northern NR_KO units already get their dizzy stars from nrDrawU)
{const _f=nrDrawFx;nrDrawFx=function(){const r=_f.apply(this,arguments);koDraw();return r;};}
function koFind(){const gr=D.alt<0.3,r=(gr?DR.eatRGround:DR.eatRAir)*1.3,mx=D.x+Math.cos(D.ang)*80,my=D.y+Math.sin(D.ang)*80;let best=null,bd=r;
  for(const L of[KOL,NR_KO])for(const k of L){if(k.done||k.eaten||k.t>=(L===KOL?KO_T:1.4))continue;const d=Math.min(d2(k.u.x,k.u.y,mx,my),d2(k.u.x,k.u.y,D.x,D.y));if(d<bd){bd=d;best={k,L};}}return best;}
function koEat(b){const k=b.k;k.eaten=1;k.done=1;const st=Object.assign({},G.stats);const c=Object.assign({},k.u,{dead:false,eaten:false});const m=NR_MUTE;NR_MUTE=1;
  try{eatUnit(c);}finally{NR_MUTE=m;}for(const q of['knights','archers','hunters'])if(st[q]!==undefined)G.stats[q]=st[q];G.kolEaten=(G.kolEaten||0)+1;D.eatCD=.25;sparkle(k.u.x,k.u.y,6);
  if(b.L===NR_KO)NR_KO=NR_KO.filter(q=>q!==k);}
{const _te=tryEat;tryEat=function(){if(!D.nrEgg&&!D.carry&&!(typeof PR!=='undefined'&&PR.carried)){const T=biteTargets();if(!T.length){const b=koFind();if(b){koEat(b);return;}}}return _te.apply(this,arguments);};}
// ---- 14. lava destroys burrows: a lava splash on a meerkat burrow collapses it into a scorched crater; whoever hid inside pops out and flees
// (and can be eaten); the colony digs it out again after 60-90 s once the dragon is away. A hidden sand worm hit by lava is forced up, dazed. ----
function burRuin(c,b,x,y){b.ruin=1;b.reT=G.t+R(60,90);b.ruinAt=G.t;G.burRuined=(G.burRuined||0)+1;if(typeof scorch==='function')try{scorch(b.x,b.y+2,26);}catch(e){}
  puff(b.x,b.y,10,'rgba(90,70,50,',80,8);if(dist(b,D)<1500)float(b.x,b.y-30,'The lava caves the burrow in!','#ffb070');
  const live=c.bur.filter(q=>!q.ruin);for(const u of mkMembers(c)){if(u.bur!==b)continue;const was=u.mst==='hide';u.bur=live.length?live[RI(0,live.length-1)]:b;
    if(was){u.mst='flee';u.inside=false;u.x=b.x+R(-8,8);u.y=b.y+R(-5,5);u.pop=1;u.fleeT=R(2.5,3.5);u.fx=x;u.fy=y;G.burPop=(G.burPop||0)+1;}else if(!live.length){u.mst='flee';u.fleeT=3;u.fx=x;u.fy=y;}}}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments),R2=LAVA_CFG.splashR+30;
  for(const c of MK.cols){if(d2(c.x,c.y,x,y)>LAVA_CFG.splashR+120)continue;for(const b of c.bur)if(!b.ruin&&d2(b.x,b.y,x,y)<R2)burRuin(c,b,x,y);}
  for(const u of units)if(!u.dead&&u.species==='sandworm'&&u.ws==='under'&&d2(u.x,u.y,x,y)<LAVA_CFG.splashR+40){u.ws='up';u.t=0;u.upT=4;u.inside=false;u.bite=1.5;u.stuck=true;G.wormLava=(G.wormLava||0)+1;
    puff(u.x,u.y,20,'rgba(220,190,130,',160,10);float(u.x,u.y-120,'Lava in its tunnel! The sand worm bursts up, dazed!','#ffb070');}
  return r;};}
{const _u=updMK;updMK=function(u,dt){const c=MK.cols[u.col];
  if(c&&u.bur&&u.bur.ruin&&u.mst!=='flee'){const live=c.bur.filter(q=>!q.ruin);if(live.length)u.bur=live[RI(0,live.length-1)];else if(u.mst==='hide'||u.mst==='run'){u.mst='flee';u.inside=false;u.fleeT=3;u.fx=D.x;u.fy=D.y;}}
  if(u.mst==='flee'){u.inside=false;u.fleeT-=dt;const a=Math.atan2(u.y-u.fy,u.x-u.fx),s=150*dt,nx=u.x+Math.cos(a)*s,ny=u.y+Math.sin(a)*s;const Z=ZONES[u.zone];if(!Z||Z.ok(nx,ny)){u.x=nx;u.y=ny;}u.face=Math.cos(a)>0?1:-1;u.anim=(u.anim||0)+dt*14;
    if(u.fleeT<=0){const live=c?c.bur.filter(q=>!q.ruin):[];if(live.length){u.bur=live[RI(0,live.length-1)];u.mst='run';}else{u.mst='out';u.t=0;}}return;}
  return _u.apply(this,arguments);};}
{const _t=mkTick;mkTick=function(dt){const r=_t.apply(this,arguments);for(const c of MK.cols)for(const b of c.bur)if(b.ruin&&G.t>=b.reT&&dist(b,D)>500){b.ruin=0;G.burReopen=(G.burReopen||0)+1;if(dist(b,D)<1500)float(b.x,b.y-24,'The meerkats dig the burrow out again','#fff2b0');}return r;};}
{const _dm=drawMounds;drawMounds=function(x0,y0,x1,y1){_dm.apply(this,arguments);for(const c of MK.cols){if(c.x<x0-120||c.x>x1+120||c.y<y0-80||c.y>y1+80)continue;
  c.bur.forEach((b,i)=>{if(!b.ruin)return;const s=i===0?1.3:1,age=G.t-(b.ruinAt||0);ell(b.x,b.y+1,22*s,10*s,'#3a3028');ell(b.x,b.y,16*s,7*s,'#221c18');ell(b.x-4*s,b.y-1,5*s,2*s,'#4a3e32');
    if(age<10)for(let k=0;k<4;k++){const a=k*1.7+G.t*.5;ell(b.x+Math.cos(a)*10*s,b.y+Math.sin(a)*4*s,1.6,1.2,`rgba(255,${120+k*20},40,${.9*(1-age/10)})`);}});}};}
// ---- ticks ----
{const _t=nrTick;nrTick=function(dt){_t(dt);stTick(dt);koTick(dt);};}
{const _ng=newGame;newGame=function(){KOL=[];return _ng.apply(this,arguments);};}
// ======================= queue 15-17: the two grand CENTRAL EGG CASTLES (one per side, shared by its allied races) =======================
// Lumenspire Citadel (light: white/silver elven-dwarven grandeur, ice towers) and Doomforge Citadel (dark: black iron, spikes and lava, lightning towers),
// at the bounding-box centre of each side's land (NR_CC in a.js). Walls, a gate, corner towers and a keep (all burnable / lava-able / stompable, they
// magically rebuild like every northern building). The egg sits in front of the keep, guarded by a mixed garrison; take it and the castle musters a
// rescue party that chases you (light ones never past the border). The big 5-minute armies and the dark vanguards march out of these castles and go back there.
const CC_W=380,CC_H=250,CC_CLR={n:0};
function ccLayout(c){const p=c.k==='L'?'lc':'dc',L=[];for(let x=-CC_W+70;x<=CC_W-70;x+=95){L.push([p+'wall',x,-CC_H]);if(Math.abs(x)>100)L.push([p+'wall',x,CC_H]);}
  for(let y=-CC_H+55;y<=CC_H-45;y+=58){L.push([p+'wallv',-CC_W,y]);L.push([p+'wallv',CC_W,y]);}
  for(const sx of[-1,1]){for(const sy of[-1,1])L.push([p+'tower',sx*CC_W,sy*CC_H]);L.push([p+'tower',sx*CC_W,0]);}
  L.push([p+'gate',0,CC_H+4]);L.push([p+'keep',0,-40]);return L;}
function ccInside(c,x,y,m){m=m||0;return Math.abs(x-c.x)<CC_W+m&&Math.abs(y-c.y)<CC_H+m;}
// --- art (cached sprites) ---
nArt('lcwall',110,84,55,74,v=>{sR(-50,-46,100,48,'#e6e8f2');for(let i=0;i<5;i++)sR(-50+i*21.5,-57,13,12,'#f6f6fc');for(let r=1;r<4;r++)sL(-50,-46+r*12,50,-46+r*12,'#cfd2e2',1);sL(-50,-46,50,-46,'#d8b04a',2);sR(-50,-4,100,6,'#c0c4d8');});
nArt('lcwallv',44,96,22,86,v=>{sR(-15,-58,30,60,'#dfe2ee');sR(-17,-66,34,10,'#f4f4fa');sL(-15,-40,15,-40,'#c8cce0',1);sL(-15,-20,15,-20,'#c8cce0',1);});
nArt('lctower',96,180,48,170,v=>{nSh(36,10);sR(-28,-112,56,114,'#eef0f8');sE(0,0,28,8,'#d4d8e6');sR(-31,-118,62,10,'#d8b04a');sP([-36,-116,0,-170,36,-116],'#7f9fe0');sP([-36,-116,0,-170,0,-116],'#9ab6f0');sR(-6,-84,12,20,'#9ad8ff');sR(-6,-46,12,16,'#9ad8ff');sL(0,-170,0,-178,'#d8b04a',2);});
nArt('lcgate',180,160,90,150,v=>{nSh(80,14);for(const sx of[-1,1]){sR(sx*52-20,-112,40,114,'#eef0f8');sP([sx*52-25,-110,sx*52,-150,sx*52+25,-110],'#7f9fe0');}
  sR(-32,-90,64,92,'#e2e4f0');sP([-24,0,-24,-50,0,-72,24,-50,24,0],'#6a5a7a');for(let i=-18;i<=18;i+=9)sL(i,-60,i,0,'#c8c8d8',2);sL(-24,-40,24,-40,'#c8c8d8',2);sR(-32,-96,64,8,'#d8b04a');});
nArt('lckeep',280,280,140,262,v=>{nSh(120,22);sR(-110,-120,220,122,'#eef0f8');for(let i=0;i<9;i++)sR(-110+i*25,-132,14,14,'#f6f6fc');sR(-110,-12,220,12,'#cfd2e2');
  sR(-36,-215,72,100,'#f4f4fc');sP([-44,-212,0,-262,44,-212],'#7f9fe0');sP([-44,-212,0,-262,0,-212],'#9ab6f0');sR(-40,-218,80,8,'#d8b04a');
  for(const sx of[-1,1]){sR(sx*88-16,-170,32,52,'#e6e8f4');sP([sx*88-20,-168,sx*88,-200,sx*88+20,-168],'#7f9fe0');}
  for(const x of[-80,-45,45,80])sR(x-7,-90,14,22,'#9ad8ff');sR(-10,-190,20,28,'#bfe8ff');sP([-26,0,-26,-48,0,-66,26,-48,26,0],'#8a7aa0');sP([-20,0,-20,-44,0,-58,20,-44,20,0],'#d8e8ff');
  sR(-4,-262,2,-22,'#d8b04a');sP([-2,-282,18,-276,-2,-270],'#9ad8ff');});
nArt('dcwall',110,90,55,78,v=>{sR(-50,-46,100,48,'#2c2832');for(let i=0;i<6;i++)sP([-50+i*18,-46,-41+i*18,-64,-32+i*18,-46],'#46404e');for(let r=1;r<4;r++)sL(-50,-46+r*12,50,-46+r*12,'#1c1a20',1);sR(-50,-6,100,7,'#ff6a20');sR(-50,-4,100,4,'#ffb040');});
nArt('dcwallv',44,100,22,90,v=>{sR(-15,-58,30,60,'#28242e');sP([-15,-58,0,-74,15,-58],'#46404e');sR(-15,-4,30,5,'#ff6a20');});
nArt('dctower',100,190,50,178,v=>{nSh(36,10);sR(-28,-116,56,118,'#2a2630');sE(0,0,28,8,'#1a1820');for(const sx of[-1,1])sP([sx*28,-60,sx*44,-70,sx*28,-76],'#5a5260');
  sP([-34,-114,-26,-150,-14,-124,0,-178,14,-124,26,-150,34,-114],'#3e3846');sR(-6,-88,12,20,'#ff7a2a');sR(-6,-46,12,14,'#ff7a2a');sR(-30,-4,60,5,'#ff6a20');});
nArt('dcgate',190,170,95,158,v=>{nSh(84,14);for(const sx of[-1,1]){sR(sx*54-22,-116,44,118,'#2a2630');sP([sx*54-26,-114,sx*54,-160,sx*54+26,-114],'#3e3846');}
  sR(-34,-92,68,94,'#24202a');sP([-26,0,-26,-56,0,-76,26,-56,26,0],'#120e14');for(let i=-20;i<=20;i+=10)sP([i-5,-58+Math.abs(i),i,-44+Math.abs(i)*.5,i+5,-58+Math.abs(i)],'#e8e0d0');sR(-26,-6,52,6,'#ff6a20');});
nArt('dckeep',290,290,145,270,v=>{nSh(124,22);sR(-112,-124,224,126,'#2a2630');for(let i=0;i<10;i++)sP([-112+i*22.4,-124,-101+i*22.4,-146,-90+i*22.4,-124],'#46404e');
  sR(-38,-220,76,100,'#24202a');sP([-46,-216,-30,-246,-16,-226,0,-270,16,-226,30,-246,46,-216],'#3e3846');for(const sx of[-1,1]){sR(sx*90-17,-176,34,56,'#2e2a34');sP([sx*90-21,-174,sx*90,-210,sx*90+21,-174],'#3e3846');}
  for(const x of[-80,-45,45,80])sR(x-7,-92,14,22,'#ff7a2a');sR(-10,-192,20,28,'#ffb040');sP([-28,0,-28,-50,0,-70,28,-50,28,0],'#120e14');sR(-112,-8,224,8,'#ff6a20');sR(-112,-5,224,4,'#ffc060');});
Object.assign(NR_BLD,{lcwall:[240,52],lcwallv:[220,30],lctower:[320,42],lcgate:[420,70],lckeep:[700,110],dcwall:[240,52],dcwallv:[220,30],dctower:[320,42],dcgate:[420,70],dckeep:[700,110]});
{const _n=nrbName;nrbName=function(k){const m={lcwall:'Citadel wall',lcwallv:'Citadel wall',lctower:'Citadel tower',lcgate:'Citadel gate',lckeep:'Lumenspire keep',dcwall:'Iron wall',dcwallv:'Iron wall',dctower:'Iron tower',dcgate:'Iron gate',dckeep:'Doomforge keep'}[k];return m||_n.apply(this,arguments);};}
// --- placement: after nrDecor (once per decor set); clear the scenery the castles would overlap ---
function ccPlace(){if(DECOR.some(o=>o.cc))return 0;let cleared=0;
  for(let i=DECOR.length-1;i>=0;i--){const o=DECOR[i];if(o.nr&&!o.town&&o.town!==0&&o.k!=='magicpeak'&&o.k!=='wztower'&&Object.values(NR_CC).some(c=>ccInside(c,o.x,o.y,110))){DECOR.splice(i,1);cleared++;}}
  for(const c of Object.values(NR_CC))for(const[k,dx,dy]of ccLayout(c))DECOR.push({k,x:c.x+dx,y:c.y+dy,nr:1,cc:c.k,v:0,s:1});G.ccCleared=CC_CLR.n=cleared;return cleared;}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(ccPlace()&&typeof pbIndex==='function')pbIndex();return r;};}
// courtyard paving painted into the terrain
{const _p=nrPaint;nrPaint=function(g){_p.apply(this,arguments);g.save();g.setTransform(1/TS,0,0,1/TS,-WX0/TS,-WY0/TS);
  for(const c of Object.values(NR_CC)){const L=c.k==='L';g.fillStyle=L?'#dcdcea':'#2a2428';g.fillRect(c.x-CC_W,c.y-CC_H,CC_W*2,CC_H*2);
    g.strokeStyle=L?'rgba(170,175,200,.6)':'rgba(255,110,30,.5)';g.lineWidth=L?3:4;for(let x=c.x-CC_W+40;x<c.x+CC_W;x+=80){g.beginPath();g.moveTo(x,c.y-CC_H);g.lineTo(x,c.y+CC_H);g.stroke();}
    for(let y=c.y-CC_H+40;y<c.y+CC_H;y+=80){g.beginPath();g.moveTo(c.x-CC_W,y);g.lineTo(c.x+CC_W,y);g.stroke();}
    if(!L){g.fillStyle='#ff6a20';g.fillRect(c.x-CC_W-40,c.y-CC_H-40,CC_W*2+80,14);g.fillRect(c.x-CC_W-40,c.y+CC_H+26,CC_W*2+80,14);g.fillRect(c.x-CC_W-40,c.y-CC_H-40,14,CC_H*2+80);g.fillRect(c.x+CC_W+26,c.y-CC_H-40,14,CC_H*2+80);}
    g.fillStyle=L?'#c8cce0':'#3a2e2a';g.fillRect(c.x-40,c.y+CC_H,80,140);}
  g.restore();};}
// magic turret towers on the walls (ice for light, lightning for dark)
{const _tp=nrTurPlace;nrTurPlace=function(){_tp.apply(this,arguments);for(const c of Object.values(NR_CC)){const kind=c.k==='L'?'ice':'storm';
  for(const[dx,dy]of[[-CC_W-80,-CC_H+40],[CC_W+80,-CC_H+40],[-CC_W-80,CC_H+50],[CC_W+80,CC_H+50],[-150,CC_H+90],[150,CC_H+90]])NR_TUR.push({x:c.x+dx,y:c.y+dy,side:c.k,kind,hp:NR_TUR_K[kind].hp,cd:R(0,1),st:'ok',reT:0,ch:0,shots:0,cc:c.k});}};}
// (eggGuards and its castle garrison are redefined below)
// --- garrison (mixed allied races) and the gate patrol ---
const CC_GAR={L:['elf','dwarf','unirider','hobsol','centaur','elf','dwarf','elf','unirider','dwarf'],D:['orc','goblin','gobarch','orc','troll','gobarch','goblin','cerberus','orc','cyclops']};
const CC_PAT={L:['elf','dwarf','centaur','hobsol'],D:['orc','goblin','cerberus','gobarch']};
eggGuards=function(e,dt){const c=NR_CC[e.cc];if(Math.hypot(D.x-c.x,D.y-c.y)>1900)return;
  e.g=e.g.filter(u=>!u.gone&&(!u.dead||G.t-(u.koAt||(u.koAt=G.t))<60));const alive=e.g.filter(u=>!u.dead).length;
  if(eggState(e.k)==='nest'&&e.g.length<CC_GAR[c.k].length&&G.t-e.gT>.6){e.gT=G.t;const L=CC_GAR[c.k],i=e.g.length,a=i/L.length*TAU;
    const u=nrSpawn(L[i],c.x+Math.cos(a)*200,c.y+Math.sin(a)*130,{home:{x:c.x-CC_W+40,y:c.y-CC_H+40,w:CC_W*2-80,h:CC_H*2-80},eggG:e.k,ccG:c.k});e.g.push(u);}
  // the patrol walks the outside of the walls
  e.p=(e.p||[]).filter(u=>!u.dead&&!u.gone);if(e.p.length<CC_PAT[c.k].length&&G.t-(e.pT||-99)>1.5){e.pT=G.t;const sp=CC_PAT[c.k][e.p.length];
    e.p.push(nrSpawn(sp,c.x+R(-CC_W,CC_W),c.y+CC_H+120,{home:{x:c.x-CC_W-260,y:c.y-CC_H-200,w:CC_W*2+520,h:CC_H*2+400},ccP:c.k,role:'ccpat'}));}
  return alive;};
// --- muster + rescue charge when the egg is carried off (like King William's charge for the princess) ---
const CC_RES={hits:8,far:5200,cap:14};
function ccMuster(k){const e=NR_EGG[k],c=NR_CC[e.cc],n=Math.min(CC_RES.cap,6+nrLvl());G.ccMust=(G.ccMust||0)+1;G['ccHit'+k]=0;
  const L=CC_GAR[c.k];for(let i=0;i<n;i++){const u=nrSpawn(L[i%L.length],c.x+R(-90,90),c.y+CC_H+R(20,80),{ccRes:k,role:'ccres',home:{x:c.x-CC_W,y:c.y-CC_H,w:CC_W*2,h:CC_H*2}});u.ccRes=k;}
  for(const u of e.g)if(!u.dead)u.ccRes=k;
  showToast(c.k==='L'?`📯 The Lumenspire Citadel musters ${n} riders and archers to take back the white egg!`:`📯 Doom drums! ${n} raiders pour out of the Doomforge Citadel after the black egg!`);try{horn();}catch(e){}}
{const _tg=tryGrab;tryGrab=function(){const was=D.nrEgg;const r=_tg.apply(this,arguments);if(!was&&D.nrEgg)ccMuster(D.nrEgg);return r;};}
{const _nu=nrUpd;nrUpd=function(u,dt){const k=u.ccRes;if(!k)return _nu.apply(this,arguments);const S=NRS[u.species],c=NR_CC[NR_EGG[k].cc];
  if(D.nrEgg!==k||G.over||Math.hypot(u.x-c.x,u.y-c.y)>CC_RES.far||(u.side==='L'&&nrPastBorder(D))){u.ccRes=0;u.role=u.role==='ccres'?'amb':u.role;return _nu.apply(this,arguments);}
  u.cd-=dt;const d=Math.hypot(D.x-u.x,D.y-u.y),reach=S.rng||S.fly||D.alt<.4||(u.species==='spider'&&d<360);const h0=u.lastHitD;
  if(reach&&d<(S.rng?S.rng:90))nrAttack(u,S,D,dt,true);else moveTo(u,D.x,D.y,S.sp*1.15,dt);nrClamp(u);u.anim=(u.anim||0)+dt*10;
  if(u.lastHitD!==h0&&u.lastHitD===G.t){G['ccHit'+k]=(G['ccHit'+k]||0)+1;G.ccResHits=(G.ccResHits||0)+1;
    if(G['ccHit'+k]>=CC_RES.hits&&D.nrEgg===k){G.ccRescued=(G.ccRescued||0)+1;eggReturn(k,k==='W'?'🛡️ The light army rescued the WHITE egg — it is back in the Lumenspire Citadel':'🛡️ The dark raiders snatched back the BLACK egg — it is back in the Doomforge Citadel');
      float(D.x,D.y-100,'They took the egg back!','#ffe0a0');}}};}
// saves: old saves (eggs at the old town shrines) need nothing - the egg position always comes from its castle; reset per-castle state on load
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(!DECOR.some(o=>o.cc)){ccPlace();if(typeof pbIndex==='function')pbIndex();}for(const k of['W','B'])G['ccHit'+k]=0;return r;};}
// ======================= queue 21-25: alpha troll caves (dark), alpha centaur glades (light), roamers kept, alphas in the big armies, the wizard's tower is destroyable =======================
// ---- 21/22. three turfs per side. Each is home to a WHITE alpha troll (cave) or a SILVER-AND-GOLD alpha centaur (sacred glade) with a band of 3-4 regulars.
// Same alpha rules as the lion / white wolf: defends the turf, war-cry rallies the band with the shared RALLY boost (+12% dmg, +8% speed, 10% less damage, 10 s, orange glow),
// helpers refill over time, a new alpha takes over a while after one is beaten. Same alpha rule as partAL: a bite at full health is shrugged off (and stings him); once worn to 80% he is dizzy and can be gulped.
const AT={troll:{n:'Troll cave',who:'The white alpha troll',call:'GRAAAWRR! *chest thump*',grp:'trolls',hp:2.4,dm:1.5,sz:1.3,eat:.8,R:520,col:'#f4f6fa',ring:'235,240,255',
    cands:[[-9300,-11000],[-8600,-10600],[-2900,-10900],[-3600,-10500],[3600,-11000],[3000,-10600],[-12400,-10700]]},
  centaur:{n:'Sacred glade',who:'The alpha centaur',call:'Ta-ra-RAAA! *hoof horn*',grp:'centaurs',hp:2.6,dm:1.6,sz:1.28,eat:.8,R:520,col:'#ffe08a',ring:'255,225,140',rng:380,
    cands:[[-11800,-6300],[-12400,-5700],[-300,-6400],[600,-6200],[3400,-3600],[2800,-3800],[-7600,-3400]]}};
const AT_BAND=[3,4],AT_REFILL=40,AT_NEW=75,AT_CALM=6,AT_LEASH=950;
let TURFS=[];
function atSpotOK(x,y,sp){const rk=nrRealm(x,y);if(!rk)return false;const dark=y<nrDarkY(x);if((sp==='troll')!==dark)return false;if(inSea(x,y)||x<WX0+500||y<WY0+450)return false;
  if(y>nrDarkY(x)-500&&dark||(!dark&&(y<nrDarkY(x)+450||y>nrEdge(x)-450)))return false;
  if(NR_TOWNS.some(t=>Math.hypot(t.x-x,t.y-y)<900))return false;if(Object.values(NR_CC).some(c=>Math.hypot(c.x-x,c.y-y)<1100))return false;
  if(typeof MDL!=='undefined'&&Math.hypot(MDL.x-x,MDL.y-y)<1200)return false;if(Math.hypot(NR_BF.x-x,NR_BF.y-y)<1200)return false;
  if(TURFS.some(t=>Math.hypot(t.x-x,t.y-y)<2500))return false;return true;}
function atPlace(){TURFS=[];for(const sp of['troll','centaur']){let n=0;for(const[cx,cy]of AT[sp].cands){if(n>=3)break;let p=null;
    for(let r=0;r<=900&&!p;r+=150)for(let a=0;a<8&&!p;a++){const x=cx+Math.cos(a*TAU/8)*r,y=cy+Math.sin(a*TAU/8)*r*.7;if(atSpotOK(x,y,sp))p={x:Math.round(x),y:Math.round(y)};if(!r)break;}
    if(p){TURFS.push({sp,i:TURFS.length,x:p.x,y:p.y,n:n,name:AT[sp].n,res:0,alert:false,calm:0,roarT:-99,refT:0,newT:0,away:null,alphaDead:0});n++;}}}
  // the art: a cave mouth in the dark rocks / a ring of silver trees and standing stones; cleared of other decor
  for(const t of TURFS){for(let i=DECOR.length-1;i>=0;i--){const o=DECOR[i];if(o.nr&&!o.town&&o.town!==0&&!o.cc&&!o.at&&o.k!=='wztower'&&o.k!=='magicpeak'&&Math.hypot(o.x-t.x,o.y-t.y)<170)DECOR.splice(i,1);}
    if(!DECOR.some(o=>o.at===t.i+1))DECOR.push({k:t.sp==='troll'?'atcave':'atglade',x:t.x,y:t.y,nr:1,at:t.i+1,s:1,v:t.i});}
  if(typeof pbIndex==='function')try{pbIndex();}catch(e){}}
nArt('atcave',240,170,120,150,v=>{nSh(100,24);sP([-110,0,-96,-70,-60,-120,-10,-140,40,-128,86,-96,110,-40,112,0],'#4a4450');sP([-80,0,-70,-60,-40,-96,0,-108,40,-96,74,-60,84,0],'#5c5664');
  sP([-60,0,-50,-48,-20,-72,20,-72,48,-48,58,0],'#5a5048');sP([-44,0,-34,-40,-12,-58,14,-58,36,-40,44,0],'#16121a');
  for(let i=0;i<5;i++)sE(-90+i*44,-8-(i%2)*6,14,8,'#3a343e');sE(-26,-6,6,4,'#d8d4cc');sE(-14,-4,4,3,'#d8d4cc');sL(-100,-30,-70,-40,'#2e2a32',3);sL(70,-50,100,-30,'#2e2a32',3);
  sP([-6,-120,0,-150,6,-120],'#7a7484');sE(0,-84,16,6,'rgba(255,170,90,.35)');});
nArt('atglade',300,170,150,140,v=>{nSh(130,26);sE(0,-4,120,30,'#7fbf6a');sE(0,-6,80,18,'#9fd884');sE(0,-6,26,8,'#e8f4ff');
  for(let i=0;i<6;i++){const a=i*TAU/6,x=Math.cos(a)*100,y=Math.sin(a)*24;sP([x-7,y,x-5,y-40,x+5,y-40,x+7,y],'#c8ccd8');sL(x-5,y-40,x+5,y-40,'#e0c060',2);}
  for(const[x,h]of[[-130,110],[130,100],[-70,120],[78,126]]){sP([x-5,-10,x-3,-h*.6,x+3,-h*.6,x+5,-10],'#d8dce8');sE(x,-h*.75,30,h*.32,'#cfe8d8');sE(x-8,-h*.82,18,h*.2,'#e8fff0');sE(x+6,-h*.66,5,4,'#ffe08a');}});
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);atPlace();return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);if(!TURFS.length||!DECOR.some(o=>o.at))atPlace();for(const t of TURFS){t.res=0;t.alert=false;t.away=null;}return r;};}
// variant stat blocks (swapped into NRS while that unit updates/draws, then restored)
const AT_V={};
function atVar(sp,alpha,rally){const k=sp+(alpha?'A':'')+(rally?'R':'');if(AT_V[k])return AT_V[k];const B=NRS[sp],o=Object.assign({},B);
  if(alpha){const A=AT[sp];o.hp=Math.round(B.hp*A.hp);o.dm=B.dm*A.dm;o.sz=(B.sz||1)*A.sz;if(A.rng)o.rng=A.rng;o.food=Math.round((B.food||20)*1.6);o.aggro=Math.max(B.aggro||300,420);}
  if(rally){o.dm*=RALLY.dmg;o.sp*=RALLY.spd;}return AT_V[k]=o;}
function atRallied(u){return u.rallyT>G.t;}
function atWith(u,fn){if(!u||!u.nr||!(u.atAlpha||atRallied(u)))return fn();const sp=u.species,B=NRS[sp];NRS[sp]=Object.assign(atVar(sp,u.atAlpha,atRallied(u)),{__b:B});
  try{return fn();}finally{NRS[sp]=B;}}
function atMakeAlpha(u){const V=atVar(u.species,1,0);u.atAlpha=1;u.alpha=1;u.maxHp=Math.round(V.hp*nrHpMul());u.hp=u.maxHp;return u;}
function atBand(t){return NRU.filter(u=>!u.dead&&u.turf===t);}
function atSpawn(t,alpha){const a=R(0,TAU),r=alpha?R(0,40):R(70,200);const u=nrSpawn(t.sp,t.x+Math.cos(a)*r,t.y+60+Math.sin(a)*r*.6,{role:'turf',turf:t,home:{x:t.x-260,y:t.y-120,w:520,h:340}});
  if(alpha)atMakeAlpha(u);return u;}
function atCall(t,al){t.roarT=G.t;al.roarFx=1.6;float(al.x,al.y-60*AT[t.sp].sz,AT[t.sp].call,AT[t.sp].col);if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play(t.sp==='troll'?'roar':'howl',al.x,al.y,1);}catch(e){}
  if(Math.hypot(al.x-D.x,al.y-D.y)<900)G.shake=Math.max(G.shake||0,4);G['atCall_'+t.sp]=(G['atCall_'+t.sp]||0)+1;
  for(const m of atBand(t)){if(!atRallied(m))G.tfRallied=(G.tfRallied||0)+1;m.rallyT=G.t+RALLY.fade;m.mad=G.t;}}
function atTick(dt){if(!G||G.over)return;if(G.atToast&&G.t>=G.atToast.t){showToast(G.atToast.m);G.atToast=null;}for(const t of TURFS){const d=Math.hypot(t.x-D.x,t.y-D.y),band=atBand(t);for(const u of band)if(u.roarFx>0)u.roarFx-=dt;
  // drafted alpha comes home once its army is gone or back at the castle
  if(t.away){const s=t.away,k=t.i+1,gone=s.dead||!NRQ.includes(s),lost=s.units?!s.units.some(u=>!u.dead&&u.atFrom===k):!s.mem.some(m=>m.atAlpha===k);
    if(gone||lost){t.away=null;if(lost&&!gone){t.alphaDead=G.t+AT_NEW;}else G.atReturned=(G.atReturned||0)+1;
      for(const u of (s.units||[]))if(!u.dead&&u.atFrom===k)nrGone(u);if(t.res&&!t.alphaDead&&!atBand(t).some(u=>u.atAlpha))atSpawn(t,1);}}
  if(!t.res){if(d<1900){t.res=1;if(!t.away&&!(t.alphaDead>G.t))atSpawn(t,1);const n=RI(AT_BAND[0],AT_BAND[1]);for(let i=0;i<n;i++)atSpawn(t,0);}continue;}
  if(d>3200){for(const u of band)nrGone(u);t.res=0;t.alert=false;continue;}
  const al=band.find(u=>u.atAlpha);if(!al&&!t.away&&!t.alphaDead){t.alphaDead=G.t+AT_NEW;G.atAlphaDown=(G.atAlphaDown||0)+1;if(d<1500)float(t.x,t.y-120,`${AT[t.sp].who} is beaten! The band is leaderless...`,'#ffe6a8');}
  if(t.alphaDead&&G.t>=t.alphaDead&&!t.away&&d>700){t.alphaDead=0;atSpawn(t,1);G.atNewAlpha=(G.atNewAlpha||0)+1;if(d<1800)float(t.x,t.y-120,`A new alpha takes over the ${AT[t.sp].n.toLowerCase()}!`,'#fff2c0');}
  t.refT+=dt;if(t.refT>=AT_REFILL){t.refT=0;if(band.filter(u=>!u.atAlpha).length<AT_BAND[1]&&d>700){atSpawn(t,0);G.atRefill=(G.atRefill||0)+1;}}
  const spot=!G.won&&D.alt<.6&&d<AT[t.sp].R+180&&!(t.sp==='centaur'&&nrPastBorder(D));
  if(spot){t.calm=0;if(!t.alert&&al){t.alert=true;atCall(t,al);float(al.x,al.y-84*AT[t.sp].sz,`${AT[t.sp].who} calls the ${AT[t.sp].grp} to fight!`,'#fff2c0');}
    else if(t.alert){for(const m of band){m.rallyT=Math.max(m.rallyT||0,al?G.t+RALLY.fade:m.rallyT||0);m.mad=G.t;}if(al&&G.t-t.roarT>8)atCall(t,al);}}
  else if(t.alert){t.calm+=dt;if(t.calm>AT_CALM){t.alert=false;if(al&&d<1500)float(al.x,al.y-60,`${AT[t.sp].who} grunts and settles down`,'#e8e0d0');}}}}
{const _t=nrTick;nrTick=function(dt){_t(dt);atTick(dt);};}
// AI: alerted band members charge the dragon anywhere near the turf (leashed), alphas + rallied units use their boosted stat blocks
{const _u=nrUpd;nrUpd=function(u,dt){if(u.turf&&u.turf.alert&&!G.over&&!G.won){const t=u.turf,S=NRS[u.species],dd=Math.hypot(u.x-D.x,u.y-D.y);
    const reach=S.rng||D.alt<.4;if(reach&&dd<1100&&Math.hypot(u.x-t.x,u.y-t.y)<AT_LEASH){return atWith(u,()=>{const V=NRS[u.species];u.vsD=1;u.tgt=null;u.cd-=dt;u.t-=dt;
      if(V.regen&&u.hp<u.maxHp&&!(u.burn>0))u.hp=Math.min(u.maxHp,u.hp+V.regen*dt);if(u.dash>0){u.dash-=dt;u.x+=Math.cos(u.dva)*480*dt;u.y+=Math.sin(u.dva)*480*dt;nrClamp(u);return;}
      if(u.atAlpha&&u.species==='centaur'&&dd<200&&D.alt<.4&&!(u.chgCd>G.t)){u.chgCd=G.t+5;u.dash=.28;u.dva=Math.atan2(D.y-u.y,D.x-u.x);hurtDragon(atChg(),'centaur');u.lastHitD=G.t;G.atCharge=(G.atCharge||0)+1;float(D.x,D.y-90,'Hoof charge! -'+Math.round(atChg()),'#ffb0a0');return;}
      nrAttack(u,V,D,dt,true);nrClamp(u);});}
    if(Math.hypot(u.x-t.x,u.y-t.y)>AT_LEASH){moveTo(u,t.x,t.y+60,NRS[u.species].sp,dt);nrClamp(u);return;}}
  return atWith(u,()=>_u.call(this,u,dt));};}
// perf: a live ctx.filter on the main canvas turns every one of the alpha's vector shapes into its own filtered layer (~20 ms per alpha on a throttled phone).
// Instead the alpha is drawn once into a small offscreen canvas (ctx calls redirected there), filtered offscreen, then blitted with one plain drawImage.
const AT_SPRITE_FX=true,ATFX_N=320;let ATFX=null;
const ATFX_PROPS=['fillStyle','strokeStyle','lineWidth','lineCap','lineJoin','miterLimit','lineDashOffset','globalAlpha','globalCompositeOperation','font','textAlign','textBaseline','direction','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY','imageSmoothingEnabled','filter'];
function atFx(u,F,draw){if(!ATFX){const a=document.createElement('canvas'),b=document.createElement('canvas');a.width=a.height=b.width=b.height=ATFX_N;ATFX={a,b,ga:a.getContext('2d'),gb:b.getContext('2d')};}
  const {a,b,ga,gb}=ATFX,M=ctx.getTransform(),p=M.transformPoint(new DOMPoint(u.x,u.y-20)),ox=Math.round(p.x-ATFX_N/2),oy=Math.round(p.y-ATFX_N/2);
  if(ox>ctx.canvas.width||oy>ctx.canvas.height||ox+ATFX_N<0||oy+ATFX_N<0)return;
  ga.setTransform(1,0,0,1,0,0);ga.globalAlpha=1;ga.globalCompositeOperation='source-over';ga.filter='none';ga.clearRect(0,0,ATFX_N,ATFX_N);
  ga.setTransform(M.a,M.b,M.c,M.d,M.e-ox,M.f-oy);for(const k of ATFX_PROPS)if(k in ga)try{ga[k]=ctx[k];}catch(e){}ga.globalAlpha=ctx.globalAlpha;
  const P=CanvasRenderingContext2D.prototype,own=[];
  for(const m of Object.getOwnPropertyNames(P)){if(m==='constructor'||m==='canvas')continue;const d=Object.getOwnPropertyDescriptor(P,m);
    if(typeof d.value==='function'){if(m==='getTransform')continue;Object.defineProperty(ctx,m,{configurable:true,writable:true,value:m==='setTransform'?function(){if(arguments.length===0)return;if(arguments.length===1){const t=arguments[0];return ga.setTransform(t.a,t.b,t.c,t.d,t.e-ox,t.f-oy);}const A=arguments;return ga.setTransform(A[0],A[1],A[2],A[3],A[4]-ox,A[5]-oy);}:m==='resetTransform'?function(){return ga.setTransform(1,0,0,1,-ox,-oy);}:function(){return d.value.apply(ga,arguments);}});own.push(m);}
    else if(d.get&&d.set){Object.defineProperty(ctx,m,{configurable:true,get(){return ga[m];},set(v){ga[m]=v;}});own.push(m);}}
  Object.defineProperty(ctx,'getTransform',{configurable:true,writable:true,value:function(){const t=ga.getTransform();t.e+=ox;t.f+=oy;return t;}});own.push('getTransform');
  try{draw();}finally{for(const m of own)delete ctx[m];}
  gb.setTransform(1,0,0,1,0,0);gb.filter='none';gb.clearRect(0,0,ATFX_N,ATFX_N);gb.filter=F;gb.drawImage(a,0,0);gb.filter='none';
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.filter='none';ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(b,ox,oy);ctx.restore();}
{const _da=drawAnimal;drawAnimal=function(u){if(!u||!u.nr||!(u.atAlpha||atRallied(u)))return _da.apply(this,arguments);const S=atVar(u.species,u.atAlpha,0),s=S.sz||1;
  if(atRallied(u)){const p=.5+.5*Math.sin(G.t*8+u.id);ell(u.x,u.y-14*s,22*s,26*s,`rgba(255,150,40,${.14+.1*p})`);}
  if(u.roarFx>0){const q=1-u.roarFx/1.6;ctx.strokeStyle=`rgba(${AT[u.species].ring},${.8*(1-q)})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(u.x,u.y-20,30+q*120,12+q*48,0,0,TAU);ctx.stroke();}
  if(!u.atAlpha)return atWith(u,()=>_da.apply(this,arguments));
  {const F=u.species==='troll'?'grayscale(1) brightness(1.75) contrast(.9)':'saturate(.25) brightness(1.45)';if(ST_FILTER&&AT_SPRITE_FX)atFx(u,F,()=>atWith(u,()=>_da.call(this,u)));else{ctx.save();if(ST_FILTER)ctx.filter=F;try{atWith(u,()=>_da.call(this,u));}finally{ctx.restore();}}}
  if(!ST_FILTER){ctx.save();ctx.globalAlpha=.45;ell(u.x,u.y-18*s,11*s,16*s,'#f4f6fa');ctx.restore();}
  const top=u.y-46*s;if(u.species==='centaur'){poly([u.x-7,top+4,u.x-6,top-4,u.x-3,top,u.x,top-6,u.x+3,top,u.x+6,top-4,u.x+7,top+4],'#ffd24a');line(u.x-9*s,u.y-28*s,u.x+9*s,u.y-18*s,'#e0b040',2.5);}
  else{line(u.x-8*s,top+4,u.x+8*s,top+4,'#c8d4e8',2);ell(u.x,top+1,3,3,'#a8e0ff');}};}
// alpha death bookkeeping
// (rallied responders already take RALLY.def less damage from partAL's shared rallyT rule; the alpha itself does not)
{const _hu=hurtUnit;hurtUnit=function(u,d,src){const r=_hu.call(this,u,d,src);if(u&&u.dead&&u.atAlpha){G.atAlphaKO=(G.atAlphaKO||0)+1;}return r;};}
// eating: same rule as the lion/wolf alphas (partAL, AL_TH 80%): above 80% the bite is shrugged off and stings; at/below 80% he is dizzy and can be gulped (the troll's own 'wear it down to half' rule is lifted for a dizzy alpha)
{const _te=tryEat;tryEat=function(){let T=[];try{T=biteTargets();}catch(e){}const f=T[0];
  if(f&&f.atAlpha&&f.hp>f.maxHp*AT[f.species].eat&&T.every(u=>u.atAlpha&&u.hp>u.maxHp*AT[u.species].eat)){D.eatCD=.8;f.mad=G.t;G.atShove=(G.atShove||0)+1;
    hurtUnit(f,Math.ceil(f.maxHp*.24),'bite');f.roarFx=1.2;float(f.x,f.y-70,`${AT[f.species].who} shrugs off the bite!`,'#ffd27a');return;}
  if(f&&f.atAlpha&&NRS[f.species].tough){const B=NRS[f.species];NRS[f.species]=Object.assign({},B,{tough:0});try{return _te.apply(this,arguments);}finally{NRS[f.species]=B;}}
  return _te.apply(this,arguments);};}
{const _da=drawAnimal;drawAnimal=function(u){_da.apply(this,arguments);if(u&&u.atAlpha&&!u.dead&&u.hp<=u.maxHp*AT[u.species].eat){if(!u.atDz){u.atDz=1;G.atDizzy=(G.atDizzy||0)+1;}
  const s=atVar(u.species,1,0).sz,hy=u.y-50*s;for(let i=0;i<3;i++){const a=G.t*3.2+i*TAU/3;hnStar(u.x+Math.cos(a)*14*s,hy+Math.sin(a)*4,3.4,i%2?'#ffe35a':'#fff7c0');}}};}
// minimap marks
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s;
  for(const t of TURFS){ell(X(t.x),Y(t.y),big?4:2.2,big?4:2.2,t.sp==='troll'?'#e8ecf4':'#ffd24a');if(big)txt(t.sp==='troll'?'🪨 Troll cave':'🌿 Sacred glade',X(t.x)+7,Y(t.y)+4,10,t.sp==='troll'?'#e8ecf4':'#fff0b0','left');}}catch(e){}return r;};}
// ---- 23. the free-roaming regulars stay: ambient trolls/centaurs still come from NR_AMB (turf bands are extra, role 'turf') ----
// ---- 24. regular trolls & centaurs already sit in the army mixes (item 11); from level 4 an alpha may lead the band: it leaves its turf, marches, and goes home after ----
{const _m=nrMarch;nrMarch=function(){const r=_m.apply(this,arguments);if(nrLvl()<4)return r;const msg=[];
  for(const side of['D','L']){const sq=NRQ.filter(q=>q.kind==='army'&&q.side===side&&!q.dead).pop();if(!sq)continue;const sp=side==='D'?'troll':'centaur';
    const free=TURFS.filter(t=>t.sp===sp&&!t.away&&!(t.alphaDead>G.t));if(!free.length||rnd()>.5)continue;const t=free[RI(0,free.length-1)];
    for(const u of atBand(t))if(u.atAlpha)nrGone(u);t.away=sq;const V=atVar(sp,1,0);sq.mem.push({sp,hp:Math.round(V.hp*nrHpMul()),atAlpha:t.i+1});
    for(let i=0;i<RI(1,2);i++)sq.mem.push({sp,hp:Math.round(NRS[sp].hp*nrHpMul())});G.atDrafted=(G.atDrafted||0)+1;
    msg.push(side==='D'?'🪨 a white alpha troll leads its trolls':'🌿 an alpha centaur leads its centaurs');}
  if(msg.length&&nrInNorth(D.x,D.y))G.atToast={t:G.t+2.5,m:'📯 Also marching: '+msg.join(' and ')+' into battle!'};
  return r;};}
{const _mz=nrMaterialize;nrMaterialize=function(sq){const had=sq.units;const r=_mz.apply(this,arguments);if(!had&&sq.units)for(const u of sq.units)if(u.mem&&u.mem.atAlpha){const hp=u.mem.hp;atMakeAlpha(u);u.hp=Math.min(u.maxHp,hp);u.atFrom=u.mem.atAlpha;}return r;};}
// ---- 25 + 26. The Wizard's tower: INVULNERABLE while the Storm Wizard is alive (fire, lava and stomps do nothing). Once he is defeated (G.nrOpen) it can be
// burned / melted / stomped down like any northern building and magically rebuilds (NRB_RE). When the dragon dies the wizard returns (item 10) and the tower is
// restored and invulnerable again (nrReset on newGame, plus a guard below for loaded saves).
NR_BLD.wztower=[620,70];
{const _n=nrbName;nrbName=function(k){return k==='wztower'?"Wizard's tower":_n.apply(this,arguments);};}
function wzTw(){return nrbList().find(o=>o.k==='wztower');}
function wzTowerOpen(){return wzBeaten();}
// the generic northern handlers only look north of MWY0+400; the wizard's isle (y -1500) gets its own, gated on the wizard being defeated
// item 28: while he lives, every hit on the tower (fire, lava, stomp, claw, dive slam, bite) drains his MAGIC SHIELD (= his health bar, WZB.hp) instead; the tower takes no damage.
// (fire that already hit him this frame is not counted twice)
const WZ_SHIELD={fire:.55/.5,lava:.5,stomp:.35,claw:.6};
{const _h=nrbHurt;nrbHurt=function(o,d,how){if(o&&o.k==='wztower'&&!wzTowerOpen()){G.wzTowerShrug=(G.wzTowerShrug||0)+1;
    if(WZB.on&&WZB.koT<=0&&!(how==='fire'&&WZB.hitT===G.t)){const h0=WZB.hp;wzHurt(d*(WZ_SHIELD[how]||.5),how==='fire'?'fire':'bite');if(WZB.hp<h0){G.wzShieldHits=(G.wzShieldHits||0)+1;G['wzSh_'+how]=(G['wzSh_'+how]||0)+1;o.shFx=G.t;}}
    if(!(o.wzSay>G.t)&&Math.hypot(o.x-D.x,o.y-D.y)<1200){o.wzSay=G.t+4;float(o.x,o.y-260,'The magic shield absorbs the blow!','#d8c8ff');}return false;}
  const r=_h.apply(this,arguments);if(r&&o.k==='wztower')G.wzTowerDown=(G.wzTowerDown||0)+1;return r;};}
const WZ_NEAR=o=>o&&o.y>=MWY0+400;
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);const o=wzTw();if(WZ_NEAR(o)&&o.bst==='ok'&&Math.abs(o.x-ox)<DR.fireRange+120&&Math.abs(o.y-oy)<DR.fireRange+120){
  if(inFire(o.x,o.y,ox,oy)||inFire(o.x,o.y-60,ox,oy)||inFire(o.x-40,o.y,ox,oy)||inFire(o.x+40,o.y,ox,oy))nrbHurt(o,DR.fireDps*.5*dt,'fire');}return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);const o=wzTw();if(WZ_NEAR(o)&&o.bst==='ok'&&Math.hypot(o.x-x,o.y-y)<LAVA_CFG.splashR+70)nrbHurt(o,70,'lava');return r;};}
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);const o=wzTw();if(WZ_NEAR(o)&&o.bst==='ok'&&Math.hypot(o.x-D.x,o.y-D.y)<DR.stompR+70)nrbHurt(o,DR.stompDmg*1.6,'stomp');return r;};}
// item 27: once he is defeated the tower can also be SMASHED, not only burned: stomp/crash-landing (above), dive slam, bite and claw scratch all chip it
{const _ds=diveSlam;diveSlam=function(){const r=_ds.apply(this,arguments);const o=wzTw();if(WZ_NEAR(o)&&o.bst==='ok'&&Math.hypot(o.x-D.x,o.y-D.y)<220)nrbHurt(o,110,'stomp')&&(G.wzSmash=(G.wzSmash||0)+1);return r;};}
{const _cs=clawScratch;clawScratch=function(){const r=_cs.apply(this,arguments);const o=wzTw();if(r!==false&&WZ_NEAR(o)&&o.bst==='ok'&&D.alt<.45&&Math.hypot(o.x-(D.x+Math.cos(D.ang)*80),o.y-(D.y+Math.sin(D.ang)*80))<170){
  if(nrbHurt(o,30,'claw'))G.wzSmash=(G.wzSmash||0)+1;else if(wzTowerOpen())puff(o.x,o.y-30,5,'rgba(170,160,190,',60,5);}return r;};}
{const _bw=biteWell;biteWell=function(){const o=wzTw();if(D.alt<.3&&WZ_NEAR(o)&&o.bst==='ok'&&wzTowerOpen()){const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70;
    if(Math.hypot(mx-o.x,my-(o.y-20))<120){const down=nrbHurt(o,40,'claw');D.eatCD=.45;D.eatT=.3;G.wzBites=(G.wzBites||0)+1;if(down)G.wzSmash=(G.wzSmash||0)+1;
      else float(o.x,o.y-140,'Crunch! Enchanted stone cracks','#d8c8ff');puff(mx,my,8,'rgba(170,160,190,',90,8);return true;}}
  return _bw.apply(this,arguments);};}
// wizard back (death / a save with him alive) -> tower whole again at once
{const _t=nrTick;nrTick=function(dt){_t(dt);if(!wzTowerOpen()){const o=wzTw();if(o&&(o.bst!=='ok'||o.bhp<o.bmax)){o.bst='ok';o.bhp=o.bmax;o.bburn=0;G.wzTowerRestored=(G.wzTowerRestored||0)+1;}}};}
// the shield bubble over tower + wizard: bright when full, fading as it drops, flashes when struck
{const _dd=nrDrawDecor;nrDrawDecor=function(o){_dd(o);if(o.k!=='wztower'||wzTowerOpen()||Math.abs(o.x-D.x)>1400||Math.abs(o.y-D.y)>1000)return;
  const f=WZB.maxHp?Math.max(0,WZB.hp)/WZB.maxHp:1,p=.5+.5*Math.sin(G.t*2.4),hit=o.shFx&&G.t-o.shFx<.25||WZB.hitT&&G.t-WZB.hitT<.25,cy=o.y-WZ.H*.62,ry=WZ.H*.78,rx=95;
  ctx.save();ctx.globalAlpha=.25+.75*f;ell(o.x,cy,rx,ry,`rgba(170,150,255,${(hit?.22:.08)+.05*p})`);ctx.strokeStyle=hit?'rgba(255,255,255,.9)':`rgba(205,185,255,${.35+.25*p})`;ctx.lineWidth=hit?4:2.5;
  ctx.beginPath();ctx.ellipse(o.x,cy,rx,ry,0,0,TAU);ctx.stroke();for(let i=0;i<5;i++){const a=G.t*.7+i*TAU/5;ell(o.x+Math.cos(a)*rx*.92,cy+Math.sin(a)*ry*.92,2.5,2.5,'rgba(240,230,255,.85)');}
  if(f<.35){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.5;line(o.x-30,cy-ry*.6,o.x-5,cy-ry*.2,'rgba(255,255,255,.55)',1.5);line(o.x-5,cy-ry*.2,o.x-20,cy+ry*.1,'rgba(255,255,255,.55)',1.5);}ctx.restore();};}
// shield broken: he is defeated (barrier/wind wall open, item 10) but stays dizzy where he stood - on the tower, or on the rubble once it is knocked down - and can be gulped (optional)
function wzEdibleSpot(){const o=wzTw(),up=o&&o.bst==='ok';return{x:WZ.x,y:up?WZ.y-WZ.H:WZ.y+20,up};}
function wzEdible(){return wzBeaten()&&!G.wzEaten&&scene==='play';}
{const _w=wzDraw;wzDraw=function(){const r=_w.apply(this,arguments);if(!wzEdible())return r;const sp=wzEdibleSpot(),x=sp.x,y=sp.y;if(Math.abs(x-D.x)>1600||Math.abs(y-D.y)>1200)return r;
  ctx.save();ctx.translate(x,y);ctx.rotate(.5+Math.sin(G.t*3)*.12);ctx.translate(-x,-y);poly([x-11,y,x+11,y,x+4,y-30,x-4,y-30],'#4a3aa8');ell(x,y-34,6,6,'#f0d0b0');
  poly([x-6,y-28,x+6,y-28,x+2,y-12,x-2,y-12],'#f4f4f4');poly([x-10,y-37,x+10,y-37,x+16,y-58],'#3a2a90');ell(x,y-37,11,3,'#3a2a90');line(x-3,y-36,x-1,y-34,'#222',1);line(x+1,y-36,x+3,y-34,'#222',1);ctx.restore();
  line(x+22,y+2,x+34,y-6,'#7a5a3a',2.4);for(let i=0;i<3;i++){const a=G.t*5+i*TAU/3;txt('★',x+Math.cos(a)*14,y-62+Math.sin(a)*4,11,'#ffe060','center');}
  if(Math.hypot(x-D.x,(sp.up?WZ.y:y)-D.y)<260&&!(G.wzHintT>G.t)){G.wzHintT=G.t+6;float(x,y-80,'Dizzy wizard - gobble him up!','#ffe28a');}return r;};}
{const _te=tryEat;tryEat=function(){if(wzEdible()&&!(D.eatCD>0)){const sp=wzEdibleSpot(),gx=sp.up?WZ.x:sp.x,gy=sp.up?WZ.y:sp.y,mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;
    if(Math.min(Math.hypot(D.x-gx,D.y-gy),Math.hypot(mx-gx,my-gy))<(sp.up?150:95)){G.wzEaten=1;G.wzEatenN=(G.wzEatenN||0)+1;D.eatCD=.6;D.eatT=.3;const heal=30;D.hp=Math.min(D.maxHp,D.hp+heal);try{feed(heal);}catch(e){}
      G.stats.eaten=(G.stats.eaten||0)+1;puff(sp.x,sp.y-30,14,'rgba(200,170,255,',90,10);sparkle(sp.x,sp.y-30,16);float(sp.x,sp.y-70,'GULP! The Storm Wizard (+'+heal+')','#ffe28a');
      showToast('🧙 Gulp! The Storm Wizard is gone - until the next dragon comes along...');if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play('gulp',sp.x,sp.y,1);}catch(e){}return;}}
  return _te.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);G.wzEaten=0;return r;};}
// ---- perf: the small minimap used to downscale the whole 3200x2200 ground canvas every frame (very slow once the browser keeps it in software).
// It now draws from a 1/8-size cached copy that is refreshed one 128-px column strip per frame (a full refresh about every 0.4 s). The big world map is unchanged. ----
let GMC=null,GMK=0,GMD=0,GMP=null,GMF=0;
// minimap cache: 1/8-scale copy of `ground`; strips are re-copied only after something draws on the ground (dirty sweep), never during static frames
function gmcStrip(k){const g=GMC.getContext('2d',{willReadFrequently:true}),sw=128,sx=k*sw;g.clearRect(sx/8,0,sw/8,GMC.height);g.drawImage(ground,sx,0,sw,ground.height,sx/8,0,sw/8,GMC.height);}
function gmcPatch(){if(GMP===ground)return;GMP=ground;const gc=ground.getContext('2d');for(const m of ['fillRect','fill','stroke','drawImage','putImageData','fillText','strokeText','clearRect']){const f=gc[m];if(typeof f!=='function')continue;gc[m]=function(){GMD=Math.ceil(ground.width/128);return f.apply(this,arguments);};}}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){if(big||typeof ground==='undefined'||!ground||!ground.width)return _m.apply(this,arguments);
  gmcPatch();
  if(!GMC||GMC.width!==Math.ceil(ground.width/8)){GMC=document.createElement('canvas');GMC.width=Math.ceil(ground.width/8);GMC.height=Math.ceil(ground.height/8);const g=GMC.getContext('2d',{willReadFrequently:true});g.imageSmoothingEnabled=true;g.drawImage(ground,0,0,ground.width,ground.height,0,0,GMC.width,GMC.height);GMK=0;GMD=0;}
  else if(GMD>0&&(++GMF%6===0)){const n=Math.ceil(ground.width/128);gmcStrip(GMK%n);GMK=(GMK+1)%n;GMD--;}
  const di=ctx.drawImage;ctx.drawImage=function(img){if(img===ground&&arguments.length===9){const a=arguments,s=1/8;return di.call(this,GMC,a[1]*s,a[2]*s,a[3]*s,a[4]*s,a[5],a[6],a[7],a[8]);}return di.apply(this,arguments);};
  try{return _m.apply(this,arguments);}finally{delete ctx.drawImage;}};}
// ======================= queue 36/37: the GRIFFIN, light-side mini boss =======================
// A cartoony eagle-lion who slowly roams the light lands (Shire / Lumeria / Dwarf Holds) on a loop of waypoints, walking and flying by turns.
// He pounces on any dark creature that comes within his normal aggro range on his roam (raiders, vanguards, or a big battle he happens to stumble into);
// he never heads for the big battle on purpose (37). He is hostile to the dragon like every fantasy fighter.
// Ground: claw swipes + a telegraphed pounce.  Air: a telegraphed talon dive/swoop.  Boss bar (fixed width).  Defeat: dizzy, then he lies there seeing stars
// and can be gulped (optional). Reward +50 MAX HEALTH. Stays beaten until the dragon dies (G.grDown, saved with G; cleared by newGame).
const GR_WP=[[-12200,-5300],[-10000,-4300],[-7600,-5500],[-4600,-4700],[-1500,-5600],[1500,-4600],[4200,-5600],[6600,-4500],[8600,-5400],[5200,-6300],[1200,-6200],[-3000,-6200],[-8200,-6200],[-11400,-6100]];
const GR={x:-1500,y:-5600,wp:4,on:false,hp:0,maxHp:0,mode:'walk',modeT:10,alt:0,face:1,anim:0,koT:0,hitT:-9,toastT:-99,cd:1,pcd:3,dcd:4,act:null,actT:0,tx:0,ty:0,foe:null,foeT:0,lastD:-99,swipeT:0};
const GR_K={aggro:520,walk:62,fly:120,swipe:4,pounce:6,dive:7,vsDark:{swipe:16,pounce:24,dive:26},food:60,heal:40,reward:50};
function grMaxHp(){return Math.round(Math.min(1000,420+80*(nrLvl()-1)));}
function grDown(){return !!G.grDown;}
function grLight(x,y){const r=nrRealm(x,y);return !!r&&NR_LIGHT.has(r);}
function grInit(){if(G.grX==null){G.grX=GR_WP[4][0];G.grY=GR_WP[4][1];G.grWp=5;}GR.x=G.grX;GR.y=G.grY;GR.wp=G.grWp||0;GR.maxHp=grMaxHp();GR.hp=G.grHp>0?Math.min(G.grHp,GR.maxHp):GR.maxHp;GR.koT=0;GR.act=null;GR.foe=null;GR.on=true;}
function grDark(v){if(!v||v.dead||v.inside)return false;const S=NRS[v.species];if(!S||!S.dm)return false;const sd=v.side||S.side;return sd==='D';}
function grFindFoe(){let b=null,bd=GR_K.aggro*GR_K.aggro;for(const v of NRU){if(!grDark(v))continue;const dx=v.x-GR.x,dy=v.y-GR.y,d=dx*dx+dy*dy;if(d<bd){bd=d;b=v;}}return b;}
function grHurt(d,how){if(!GR.on||GR.koT>0||grDown()||d<=0)return;GR.hp-=d;GR.hitT=G.t;GR.lastD=G.t;G.grHp=Math.max(1,Math.round(GR.hp));G.grHits=(G.grHits||0)+1;
  if(GR.hp<=0){GR.hp=0;GR.koT=2.2;GR.alt=0;GR.act=null;float(GR.x,GR.y-110,'Dizzy!','#ffe28a');}}
function grDefeat(){G.grDown=1;G.grHp=0;G.grWins=(G.grWins||0)+1;G.grX=GR.x;G.grY=GR.y;sparkle(GR.x,GR.y-60,22);puff(GR.x,GR.y-30,10,'rgba(255,240,200,',80,8);
  const gain=GR_K.reward;D.hpBonus=(D.hpBonus||0)+gain;D.maxHp+=gain;D.hp=D.maxHp;D.healFx=1;G.grHpGain=(G.grHpGain||0)+gain;
  G.banner={text:'The Griffin is defeated!',sub:`He flops down seeing stars (you can gobble him up). You feel tougher: +${gain} max health (now ${D.maxHp}, until you lose this dragon)`,t:4.5};
  float(D.x,D.y-heightOf()-130,`MAX HEALTH +${gain}!`,'#7aff8a');showToast(`🦅 The Griffin is defeated! ❤️ +${gain} max health`);try{horn();}catch(e){}}
function grSay(m,c){if(Math.abs(GR.x-D.x)<1400&&Math.abs(GR.y-D.y)<1000)float(GR.x,GR.y-120-GR.alt*90,m,c||'#ffe8a0');}
function grUpd(dt){if(grDown()){GR.on=false;return;}if(!GR.on)grInit();if(GR.maxHp!==grMaxHp()){const f=GR.hp/GR.maxHp;GR.maxHp=grMaxHp();GR.hp=GR.maxHp*f;}
  const far=Math.abs(GR.x-D.x)>2600||Math.abs(GR.y-D.y)>2000;
  if(GR.koT>0){GR.koT-=dt;if(GR.koT<=0)grDefeat();return;}
  if(far){ // cheap roam while nobody is watching; heal up slowly
    GR.foe=null;GR.act=null;GR.alt=0;const w=GR_WP[GR.wp],dx=w[0]-GR.x,dy=w[1]-GR.y,d=Math.hypot(dx,dy),s=GR_K.walk*1.4*dt;if(d<s+4)GR.wp=(GR.wp+1)%GR_WP.length;else{GR.x+=dx/d*s;GR.y+=dy/d*s;}
    GR.hp=Math.min(GR.maxHp,GR.hp+3*dt);G.grX=Math.round(GR.x);G.grY=Math.round(GR.y);G.grWp=GR.wp;G.grHp=Math.round(GR.hp);return;}
  GR.anim+=dt;GR.cd-=dt;GR.pcd-=dt;GR.dcd-=dt;if(GR.swipeT>0)GR.swipeT-=dt;
  // walk / fly by turns
  GR.modeT-=dt;if(GR.modeT<=0&&!GR.act){GR.mode=GR.mode==='walk'?'fly':'walk';GR.modeT=GR.mode==='fly'?R(8,12):R(9,14);G.grSwitch=(G.grSwitch||0)+1;}
  const tgtAlt=GR.mode==='fly'?1:0;if(!GR.act)GR.alt+=(tgtAlt-GR.alt)*Math.min(1,dt*1.6);
  // who to fight: dark creatures within aggro range (never seeks the big battle), or the dragon when it is close
  if(!GR.foe||!grDark(GR.foe)||Math.hypot(GR.foe.x-GR.x,GR.foe.y-GR.y)>GR_K.aggro*1.4){GR.foe=null;if(G.t>GR.foeT){GR.foeT=G.t+.4;GR.foe=grFindFoe();}}
  const dd=Math.hypot(D.x-GR.x,D.y-GR.y),dragonOn=!G.over&&!G.won&&(dd<GR_K.aggro||(G.t-GR.lastD<6&&dd<GR_K.aggro*1.8));
  let T=null,isD=false;if(dragonOn&&(!GR.foe||dd<Math.hypot(GR.foe.x-GR.x,GR.foe.y-GR.y)*.8||G.t-GR.lastD<3)){T=D;isD=true;}else if(GR.foe)T=GR.foe;
  if(isD&&G.t-GR.toastT>45){GR.toastT=G.t;showToast('🦅 The GRIFFIN guards the light lands! Claws on the ground, talon dives from the sky');}
  if(T&&!isD){G.grFights=(G.grFights||0)+1;GR.fightT=G.t;}
  // abstract scuffle: dark creatures next to him chip at him a little
  for(const v of NRU)if(grDark(v)&&Math.abs(v.x-GR.x)<70&&Math.abs(v.y-GR.y)<60&&GR.alt<.3){const S=NRS[v.species];GR.hp-=S.dm/S.cd*.35*dt;G.grChip=(G.grChip||0)+1;}
  if(GR.hp<GR.maxHp*.15&&!isD)GR.hp=Math.max(GR.hp,GR.maxHp*.15); // the dark creatures can wear him down, but only the dragon can beat him
  if(!isD&&G.t-GR.lastD>10)GR.hp=Math.min(GR.maxHp,GR.hp+2*dt);
  G.grX=Math.round(GR.x);G.grY=Math.round(GR.y);G.grWp=GR.wp;G.grHp=Math.max(1,Math.round(GR.hp));
  // current move (pounce / dive)
  if(GR.act){GR.actT-=dt;const a=GR.act;
    if(a.ph==='tele'){if(GR.actT<=0){a.ph='go';GR.actT=a.k==='pounce'?.45:.55;a.sx=GR.x;a.sy=GR.y;a.tx=a.T.x;a.ty=a.T.y;}return;}
    const p=1-Math.max(0,GR.actT)/(a.k==='pounce'?.45:.55);GR.x=a.sx+(a.tx-a.sx)*p;GR.y=a.sy+(a.ty-a.sy)*p;if(a.k==='pounce')GR.alt=Math.sin(p*Math.PI)*.45;else GR.alt=Math.max(.05,1-p);
    if(GR.actT<=0){const hitR=a.k==='pounce'?70:90;
      if(a.isD){if(!G.over&&Math.hypot(D.x-GR.x,D.y-GR.y)<hitR+30&&(a.k==='dive'||D.alt<.5)){const dm=GR_K[a.k];hurtDragon(dm,'griffin');float(D.x,D.y-heightOf()-80,a.k==='dive'?`Talon swoop! -${dm}`:`Pounce! -${dm}`,'#ffd0a0');G.grHitsD=(G.grHitsD||0)+1;}}
      else{let n=0;for(const v of NRU)if(grDark(v)&&Math.hypot(v.x-GR.x,v.y-GR.y)<hitR+20){nrHit(v,GR_K.vsDark[a.k],null);n++;}if(n){G.grKills=(G.grKills||0);G.grStrikes=(G.grStrikes||0)+n;}}
      G[a.k==='dive'?'grDives':'grPounces']=(G[a.k==='dive'?'grDives':'grPounces']||0)+1;GR.act=null;if(a.k==='dive')GR.alt=.6;}
    return;}
  if(!T){// roam: next waypoint, at a stroll
    const w=GR_WP[GR.wp],dx=w[0]-GR.x,dy=w[1]-GR.y,d=Math.hypot(dx,dy),s=(GR.mode==='fly'?GR_K.fly:GR_K.walk)*dt;if(d<s+4)GR.wp=(GR.wp+1)%GR_WP.length;else{GR.x+=dx/d*s;GR.y+=dy/d*s;}if(Math.abs(dx)>4)GR.face=dx>0?1:-1;return;}
  const tx=T.x,ty=T.y,d=Math.hypot(tx-GR.x,ty-GR.y);if(Math.abs(tx-GR.x)>4)GR.face=tx>GR.x?1:-1;
  if(GR.alt>.6){// air: circle in and dive
    if(GR.dcd<=0&&d<420){GR.dcd=R(3.5,5);GR.act={k:'dive',ph:'tele',T,isD};GR.actT=.6;if(isD)grSay('SCREEE! (diving!)');return;}
    if(d>160){const s=GR_K.fly*1.3*dt;GR.x+=(tx-GR.x)/d*s;GR.y+=(ty-GR.y)/d*s;}return;}
  // ground: pounce from mid range, claw swipes up close
  if(GR.pcd<=0&&d>110&&d<330&&(!isD||D.alt<.5)){GR.pcd=R(4.5,6);GR.act={k:'pounce',ph:'tele',T,isD};GR.actT=.4;if(isD)grSay('Grrr... POUNCE!');return;}
  if(d<85){if(GR.cd<=0){GR.cd=R(1.2,1.6);GR.swipeT=.25;G.grSwipes=(G.grSwipes||0)+1;
      if(isD){if(D.alt<.5){hurtDragon(GR_K.swipe,'griffin');if(rnd()<.5)float(D.x+R(-20,20),D.y-90,`Claw swipe! -${GR_K.swipe}`,'#ffd0a0');}}else nrHit(T,GR_K.vsDark.swipe,null);}return;}
  if(isD&&D.alt>.5&&GR.mode==='walk'){GR.mode='fly';GR.modeT=R(6,9);} // takes off to chase a flying dragon
  const s=GR_K.walk*1.5*dt;GR.x+=(tx-GR.x)/d*s;GR.y+=(ty-GR.y)/d*s;}
{const _t=nrTick;nrTick=function(dt){_t(dt);if(scene==='play'&&G&&!G.over)grUpd(dt);};}
// player attacks: fire hits him in the air too; bite/stomp/claw/lava only when he is low
function grNear(px,py,r){return GR.on&&!(GR.koT>0)&&!grDown()&&Math.hypot(px-GR.x,py-(GR.y-GR.alt*60))<r;}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);if(GR.on&&!(GR.koT>0)&&!grDown()&&(inFire(GR.x,GR.y,ox,oy)||inFire(GR.x,GR.y-40,ox,oy)))grHurt(DR.fireDps*.5*dt,'fire');return r;};}
{const _te=tryEat;tryEat=function(){if(!(D.eatCD>0)&&D.alt<.5&&GR.alt<.5){const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;if(grNear(mx,my,120)){grHurt(18,'bite');D.eatCD=.45;float(GR.x,GR.y-110,'Chomp! -18','#ffe0a0');return;}}return _te.apply(this,arguments);};}
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);if(GR.alt<.4&&grNear(D.x,D.y,DR.stompR+60))grHurt(30,'stomp');return r;};}
{const _ds=diveSlam;diveSlam=function(){const r=_ds.apply(this,arguments);if(GR.alt<.5&&grNear(D.x,D.y,DR.stompR+80))grHurt(40,'dive');return r;};}
if(typeof clawScratch==='function'){const _cs=clawScratch;clawScratch=function(){const r=_cs.apply(this,arguments);if(D.alt<.5&&GR.alt<.5&&grNear(D.x+Math.cos(D.ang)*60,D.y+Math.sin(D.ang)*60,140))grHurt(12,'claw');return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);if(grNear(x,y,LAVA_CFG.splashR+60))grHurt(35,'lava');return r;};}
// after defeat he lies where he fell, seeing stars: edible (optional), gone until the next dragon once gulped
function grEdible(){return grDown()&&!G.grEaten&&scene==='play';}
{const _te=tryEat;tryEat=function(){if(grEdible()&&!(D.eatCD>0)&&D.alt<.5){const gx=G.grX,gy=G.grY,mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;
    if(Math.min(Math.hypot(D.x-gx,D.y-gy),Math.hypot(mx-gx,my-gy))<120){G.grEaten=1;D.eatCD=.6;D.eatT=.3;const h=GR_K.heal;D.hp=Math.min(D.maxHp,D.hp+h);try{feed(h);}catch(e){}try{if(typeof glutEat==='function')glutEat(GR_K.food);}catch(e){}
      G.stats.eaten=(G.stats.eaten||0)+1;puff(gx,gy-30,14,'rgba(255,240,200,',90,10);sparkle(gx,gy-30,14);float(gx,gy-70,'BIG GULP! The Griffin (+'+h+')','#ffe28a');
      showToast('🦅 Gulp! The Griffin is gone - until the next castle level...');if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play('gulp',gx,gy,1);}catch(e){}return;}}
  return _te.apply(this,arguments);};}
// drawing
function grArt(x,y,f,alt,st){const T=G.t,gold='#d9a441',dg='#a8762a',wh='#f6f2e8',fly=alt>.15,ko=st.ko,lift=alt*90;
  ell(x,y+4,40-alt*14,12-alt*4,'rgba(0,0,0,'+(.3-alt*.15)+')');if(st.tele)ell(x,y+4,52,16,'rgba(255,80,40,.25)');
  ctx.save();ctx.translate(x,y-lift);if(ko)ctx.rotate(f*.9);ctx.scale(f,1);
  const wing=fly?Math.sin(T*9)*.9:-.25,step=fly||ko?0:Math.sin(st.anim*8)*5;
  // legs (lion back, eagle front)
  line(-20,-14,-22+step,0,dg,6);line(-12,-14,-10-step,0,dg,6);line(14,-16,16-step,0,'#e8c060',5);line(20,-16,22+step,0,'#e8c060',5);
  for(const lx of[16-step,22+step])line(lx,0,lx+5,1,'#7a5a20',1.6);
  // tail
  ctx.strokeStyle=gold;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-28,-22);ctx.quadraticCurveTo(-46,-30+Math.sin(T*3)*5,-50,-44);ctx.stroke();ell(-51,-46,5,6,dg);
  // far wing
  ctx.save();ctx.translate(2,-30);ctx.rotate(-1.1-wing*.7);poly([0,0,46,-6,56,4,40,10,24,8],'#e6dcc8');ctx.restore();
  ell(0,-22,30,15,gold);ell(4,-16,20,8,'#ecc870');
  // near wing
  ctx.save();ctx.translate(-2,-28);ctx.rotate(-1.3+wing);poly([0,0,48,-8,60,2,52,8,40,6,30,12,14,8],wh);for(let i=0;i<3;i++)line(18+i*12,2,30+i*12,8,'#d8ccb0',1.4);ctx.restore();
  // head: white eagle head, golden beak, crest
  ell(24,-36,13,12,wh);poly([20,-46,15,-58,26,-48],wh);poly([28,-47,26,-57,33,-48],wh);
  const open=st.swipe;poly([34,-38,48,-34,36,-29],'#f0b030');if(open)poly([35,-30,46,-27,36,-26],'#e09a20');
  ell(28,-39,3.6,3.8,'#fff');ell(29,-39,ko?0:2,ko?0:2.4,'#2a1a08');if(ko)txt('×',28.5,-36.5,8,'#333','center');
  if(st.hit){ctx.globalAlpha=.45;ell(0,-26,40,24,'#fff');ctx.globalAlpha=1;}
  ctx.restore();
  if(ko){for(let i=0;i<3;i++){const an=T*5+i*TAU/3;txt('★',x+Math.cos(an)*22,y-70+Math.sin(an)*5,13,'#ffe060','center');}}
  if(st.tele)txt('!',x+f*30,y-lift-80,16,'#ff6040','center');}
function grDraw(){const x=grDown()?G.grX:GR.x,y=grDown()?G.grY:GR.y;if(x==null||Math.abs(x-cam.x)>VW/cam.z/2+300||Math.abs(y-cam.y)>VH/cam.z/2+300)return;
  if(grDown()){if(G.grEaten)return;grArt(x,y,1,0,{ko:1,anim:0});if(Math.hypot(x-D.x,y-D.y)<260&&!(G.grHintT>G.t)){G.grHintT=G.t+6;float(x,y-90,'Dizzy griffin - gobble him up!','#ffe28a');}return;}
  if(!GR.on)return;grArt(x,y,GR.face,GR.alt,{ko:GR.koT>0,anim:GR.anim,swipe:GR.swipeT>0,hit:G.t-GR.hitT<.12,tele:GR.act&&GR.act.ph==='tele'});G.grDrawn=G.fc;}
{const _f=nrDrawFx;nrDrawFx=function(){const r=_f.apply(this,arguments);if(!SP47.done.gr)grDraw();return r;};}
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!GR.on||grDown()||!GR.maxHp)return;if(Math.hypot(D.x-GR.x,D.y-GR.y)>900&&!(G.t-GR.lastD<6))return;
  const S=hudSlot('griffin',Math.min(384,VW*.55+4),16),w=S.w-4,x=S.x+2,y=S.y+2,lab=`🦅 Griffin · ${Math.ceil(GR.hp)}/${GR.maxHp}`;
  rect(x-2,y-2,w+4,16,'rgba(0,0,0,.6)');rect(x,y,w*Math.max(0,GR.hp)/GR.maxHp,12,'#e0b050');txt(lab,S.cx,y+10,hudFit(lab,S.w-6,11),'#fff','center');G.grBar=G.fc;};}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{if(big&&!grDown()&&GR.on){const s=mmw/(WX1-WX0);ell(mmx+(GR.x-WX0)*s,mmy+(GR.y-WY0)*s,4,4,'#e0b050');txt('🦅 Griffin',mmx+(GR.x-WX0)*s+7,mmy+(GR.y-WY0)*s+4,10,'#fff0c0','left');}}catch(e){}return r;};}
{const _nl=nextLevel;nextLevel=function(){const k={grDown:G.grDown,grWins:G.grWins,grEaten:G.grEaten,grX:G.grX,grY:G.grY,grWp:G.grWp,grHpGain:G.grHpGain};const r=_nl.apply(this,arguments);Object.assign(G,k);GR.on=false;GR.act=null;return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);GR.on=false;GR.koT=0;GR.act=null;GR.foe=null;GR.mode='walk';GR.alt=0;return r;};}
// after a load: re-read his place/health from G
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);GR.on=false;GR.act=null;GR.koT=0;HYD.on=false;HYD.P=[];return r;};}
// ======================= queue 38-40 (batch 3): FAIRIES, VAMPIRE BATS, SEAGULL FLOCKS =======================
// All three live in the shared `birds` list, so the breath, the lava splash and the bird bites reach them like any bird, but they are
// owned here: spawned lazily only near the dragon (perf), kept on their homes/flocks, refilled over time (respawn), drawn with their own art.
//  38 fairies: glowing pixies with a sparkle trail around the elven glow trees, glades and Shire meadows (light lands). They flit, dart away
//     from the dragon (and sometimes dodge a snap); a brave one may give a tiny pixie-dust sting (-1). Gulp = a puff of sparkles, small food.
//  39 vampire bats: cartoony, red glowing eyes, small swarms at the dark caves, burnt trees and dark towers. Erratic flight; they swoop in
//     for a tiny nibble (-1) and the bat gets a little red-sparkle "heal". No blood, no gore.
//  40 seagulls: flocks over every sea (south sea, east sea, the northern sea beyond the wind wall), around trade ships, the dock and the
//     lighthouse; they glide in circles, land on beaches and the dock, scatter and squawk when the dragon comes.
Object.assign(BIRD,{fairy:{heal:2,pts:20,sp:150,col:'#fff0ff',hp:1},vbat:{heal:2,pts:15,sp:170,col:'#3a2846',hp:1}});
FOOD.fairy=3;FOOD.vbat=3;
const B3={homes:null,flocks:[],t:0,ft:0,stats:{},cur:[]};
const B3K={fairyN:4,batN:5,flockMax:3,near:1500,far:2500,refill:12,flockNear:1300,flockFar:2600};
const B3_FC=['#ffb0e8','#b8f0a0','#a8d8ff','#ffe28a','#d8b0ff'];
function b3Pick(list,minD,max){const out=[];for(const o of list){if(out.length>=max)break;if(out.every(p=>Math.hypot(p.x-o.x,p.y-o.y)>=minD))out.push({x:o.x,y:o.y});}return out;}
function b3Homes(){if(B3.homes)return B3.homes;const H=[],pref=ks=>{const a=[];for(const k of ks)for(const o of DECOR)if(o.k===k)a.push(o);return a;};
  for(const p of b3Pick(pref(['atglade','glowtree','flowerbed']).filter(o=>grLight(o.x,o.y)),1200,16))H.push({k:'fairy',x:p.x,y:p.y-20,n:0,lost:0,rt:0,on:false});
  for(const p of b3Pick(pref(['atcave','cyccave','gobtower','dctower','deadtree']).filter(o=>{const r=nrRealm(o.x,o.y);return !!r&&NR_DARK.has(r);}),1300,14))H.push({k:'vbat',x:p.x,y:p.y-30,n:0,lost:0,rt:0,on:false});
  return B3.homes=H;}
function b3St(k){B3.stats[k]=(B3.stats[k]||0)+1;}
function b3SpawnHome(h){const cap=(h.k==='fairy'?B3K.fairyN:B3K.batN)-h.lost;for(let i=h.n;i<cap;i++){const a=R(0,TAU),r=R(30,140);
    birds.push(mkBird(h.k,h.x+Math.cos(a)*r,h.y+Math.sin(a)*r*.6,{state:'fly',z:R(35,80),b3:h.k,b3h:h,ph:R(0,TAU),cd:R(2,6),md:'home',mt:0,brave:h.k==='fairy'&&rnd()<.35,c1:B3_FC[RI(0,B3_FC.length-1)]}));h.n++;b3St(h.k+'Spawn');}}
function b3Side(x,y){return y<nrEdge(x)?-1:1;}
function b3KeepSide(b,side){const e=nrEdge(b.x);if(side<0&&b.y>e-30)b.y=e-30;if(side>0&&b.y<e+30)b.y=e+30;}
// a landing spot near a sea point: the first dry ground in 8 directions
function b3Land(x,y){for(let r=120;r<=480;r+=120)for(let i=0;i<8;i++){const a=i*TAU/8,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(!inWater(px,py)&&px>WX0+200&&px<WX1-200&&py>WY0+200&&py<WY1-200)return{x:px,y:py};}return null;}
function b3NewFlock(c){const f={cx:c.x,cy:c.y,ship:c.ship||null,tag:c.tag,side:b3Side(c.x,c.y),land:c.land||null,md:'circle',mt:R(14,24),sq:0,n:0,want:RI(4,6),rt:0};
  for(let i=0;i<f.want;i++)b3AddGull(f);B3.flocks.push(f);b3St('flocks');return f;}
function b3AddGull(f){const a=R(0,TAU),r=R(90,190);birds.push(mkBird('gull',f.cx+Math.cos(a)*r,f.cy+Math.sin(a)*r*.6,{state:'fly',z:R(45,85),b3:'gull',fl:f,ph:a,rr:r,lx:R(-60,60),ly:R(-30,30),flap:R(0,6)}));f.n++;b3St('gullSpawn');}
function b3FlockSpots(){const out=[];const near=(x,y)=>Math.abs(x-D.x)<B3K.flockNear&&Math.abs(y-D.y)<B3K.flockNear;
  for(const s of ships)if(s.state!=='sink'&&near(s.x,s.y))out.push({x:s.x,y:s.y,ship:s,tag:'ship'});
  if(typeof DOCK!=='undefined'&&near(DOCK.x,DOCK.y))out.push({x:DOCK.x,y:DOCK.y,land:{x:DOCK.x,y:DOCK.y},tag:'dock'});
  if(typeof LH!=='undefined'&&near(LH.x,LH.y))out.push({x:LH.x+R(-120,120),y:LH.y+R(-80,80),land:{x:LH.x,y:LH.y},tag:'lighthouse'});
  for(let i=0;i<6;i++){const a=R(0,TAU),r=R(450,1150),x=D.x+Math.cos(a)*r,y=D.y+Math.sin(a)*r;if(x<WX0+300||x>WX1-300||y<WY0+300||y>WY1-300||!inSea(x,y))continue;const l=b3Land(x,y);out.push({x,y,land:l,tag:l?'coast':'sea'});}
  return out;}
function b3Spawner(dt){B3.ft-=dt;if(B3.ft>0)return;B3.ft=.5;const H=b3Homes();
  for(const h of H){const d=Math.hypot(h.x-D.x,h.y-D.y);
    if(!h.on&&d<B3K.near){h.on=true;h.n=0;b3SpawnHome(h);}
    else if(h.on&&d>B3K.far){h.on=false;for(const b of B3.cur)if(b.b3h===h){b.dead=true;b.gone=1;}h.n=0;}
    if(h.lost>0){h.rt+=.5;if(h.rt>=B3K.refill&&d>700){h.rt=0;h.lost--;b3St(h.k+'Respawn');if(h.on)b3SpawnHome(h);}}}
  for(let i=B3.flocks.length-1;i>=0;i--){const f=B3.flocks[i];if(f.ship&&(f.ship.state==='sink'||!ships.includes(f.ship)))f.ship=null;
    if(Math.hypot(f.cx-D.x,f.cy-D.y)>B3K.flockFar||f.n<=0&&f.want<=0){for(const b of B3.cur)if(b.fl===f){b.dead=true;b.gone=1;}B3.flocks.splice(i,1);continue;}
    if(f.n<f.want){f.rt+=.5;if(f.rt>15&&Math.hypot(f.cx-D.x,f.cy-D.y)>700){f.rt=0;b3AddGull(f);b3St('gullRespawn');}}}
  B3.gt=(B3.gt||0)-.5;if(B3.gt<=0&&B3.flocks.length<B3K.flockMax){B3.gt=2;const sp=b3FlockSpots();sp.sort((p,q)=>(q.ship?1:0)-(p.ship?1:0));if(!B3.flocks.some(f=>f.land)){const i=sp.findIndex(c=>c.land);if(i>0)sp.unshift(sp.splice(i,1)[0]);}
    for(const c of sp){if(B3.flocks.length>=B3K.flockMax)break;if(B3.flocks.some(f=>(c.ship&&f.ship===c.ship)||Math.hypot(f.cx-c.x,f.cy-c.y)<700))continue;b3NewFlock(c);}}}
function b3Move(b,tx,ty,sp,dt,k){const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy)||1,v=Math.min(sp,d/Math.max(dt,.001));b.vx+=((dx/d)*v-b.vx)*Math.min(1,dt*(k||4));b.vy+=((dy/d)*v-b.vy)*Math.min(1,dt*(k||4));b.x+=b.vx*dt;b.y+=b.vy*dt;}
function b3Fairy(b,dt){const h=b.b3h,dx=b.x-D.x,dy=b.y-D.y,dd=Math.hypot(dx,dy);b.cd-=dt;b.mt-=dt;b.flap+=dt*34;
  if(b.md==='home'&&dd<230&&!G.over){if(b.brave&&b.cd<=0){b.md='sting';b.mt=1.3;}else{b.md='flee';b.mt=R(1.1,2);b.da=Math.atan2(dy,dx)+R(-.8,.8);b.dt2=.3;}}
  if(b.md==='flee'){b.dt2-=dt;if(b.dt2<=0){b.dt2=R(.2,.4);b.da=Math.atan2(dy,dx)+R(-.9,.9);}b3Move(b,b.x+Math.cos(b.da)*200,b.y+Math.sin(b.da)*200,BIRD.fairy.sp*1.5,dt,7);b.z+=(R(60,110)-b.z)*Math.min(1,dt*3);if(b.mt<=0)b.md='home';}
  else if(b.md==='sting'){b3Move(b,D.x,D.y-10,BIRD.fairy.sp*1.7,dt,8);b.z+=(Math.min(110,heightOf()+20)-b.z)*Math.min(1,dt*4);
    if(dd<46&&!G.over){hurtDragon(1,'fairy');sparkle(D.x,D.y-heightOf()-30,8);float(D.x+R(-15,15),D.y-heightOf()-80,'Pixie-dust sting! -1','#ffd8ff');b.cd=R(8,12);b.md='flee';b.mt=1.5;b.da=Math.atan2(dy,dx);b.dt2=.3;b3St('fairyStings');}
    else if(b.mt<=0){b.md='flee';b.mt=1;b.cd=R(4,6);b.da=Math.atan2(dy,dx);b.dt2=.3;}}
  else{b.ph+=dt*(1.2+(b.id%3)*.3);const r=70+40*Math.sin(b.ph*.7+b.id),tx=h.x+Math.cos(b.ph)*r,ty=h.y+Math.sin(b.ph*1.3)*r*.6;b3Move(b,tx,ty,BIRD.fairy.sp*.6,dt,3);b.z+=(45+20*Math.sin(G.t*2+b.id)-b.z)*Math.min(1,dt*2);}
  if(Math.hypot(b.x-h.x,b.y-h.y)>650){b.md='home';}}
function b3Bat(b,dt,swoopers){const h=b.b3h,dx=D.x-b.x,dy=D.y-b.y,dd=Math.hypot(dx,dy);b.cd-=dt;b.mt-=dt;b.flap+=dt*26;if(b.full>0)b.full-=dt;
  if(b.md==='home'&&dd<520&&b.cd<=0&&swoopers.n<2&&!G.over&&Math.hypot(D.x-h.x,D.y-h.y)<900){b.md='swoop';b.mt=2.6;swoopers.n++;}
  if(b.md==='swoop'){const j=Math.sin(G.t*13+b.id)*60*Math.min(1,Math.max(0,dd-60)/240);b3Move(b,D.x-dy/(dd||1)*j,D.y+dx/(dd||1)*j,BIRD.vbat.sp*1.6,dt,6);b.z+=(heightOf()+18-b.z)*Math.min(1,dt*4);
    if(dd<44&&!G.over){hurtDragon(1,'bat');float(D.x+R(-15,15),D.y-heightOf()-80,'Nibble! -1','#ff9aa8');b.full=1.4;puff(b.x,b.y-b.z,5,'rgba(255,70,100,',40,3);float(b.x,b.y-b.z-14,'+♥','#ff5a7a');b.cd=R(4,7);b.md='back';b.mt=2;b3St('batNibbles');}
    else if(b.mt<=0){b.md='back';b.mt=2;b.cd=R(2,4);}}
  else{if(b.md==='back'&&b.mt<=0)b.md='home';b.ph+=dt*(1.6+(b.id%4)*.25);const tx=h.x+Math.cos(b.ph)*130+Math.sin(G.t*4.3+b.id)*45,ty=h.y+Math.sin(b.ph*1.4)*80+Math.cos(G.t*3.7+b.id)*35;
    b3Move(b,tx+R(-40,40),ty+R(-40,40),BIRD.vbat.sp*(b.md==='back'?1.2:.8),dt,5);b.z+=(80+35*Math.sin(G.t*3+b.id)-b.z)*Math.min(1,dt*3);}}
function b3Gull(b,dt){const f=b.fl,dx=b.x-D.x,dy=b.y-D.y,dd=Math.hypot(dx,dy);b.flap+=dt*(b.state==='ground'?0:9);
  if(dd<240&&f.md!=='scatter'&&!G.over){f.md='scatter';f.mt=R(3,4);if(f.sq<=0){f.sq=2.5;float(b.x,b.y-b.z-20,RI(0,1)?'Squawk!':'SQUAWK!','#f4f4f0');b3St('squawks');}}
  if(f.md==='scatter'){b.state='fly';const a=Math.atan2(dy,dx)+Math.sin(b.id)*.6;b3Move(b,b.x+Math.cos(a)*200,b.y+Math.sin(a)*200,BIRD.gull.sp*1.5,dt,5);b.z+=(140-b.z)*Math.min(1,dt*1.5);}
  else if(f.md==='land'&&f.land){const tx=f.land.x+b.lx,ty=f.land.y+b.ly;if(Math.hypot(tx-b.x,ty-b.y)<8){b.x=tx;b.y=ty;b.vx=b.vy=0;b.z=Math.max(0,b.z-dt*60);if(b.z<=0)b.state='ground';}else{b.state='fly';b3Move(b,tx,ty,BIRD.gull.sp,dt,4);b.z+=(20-b.z)*Math.min(1,dt*1.5);}}
  else{b.state='fly';b.ph+=dt*.55;const tx=f.cx+Math.cos(b.ph)*b.rr,ty=f.cy+Math.sin(b.ph)*b.rr*.6;b3Move(b,tx,ty,BIRD.gull.sp*1.1,dt,3);b.z+=(65+18*Math.sin(G.t*.8+b.id)-b.z)*Math.min(1,dt*1.2);}
  b3KeepSide(b,f.side);}
function b3Flocks(dt){for(const f of B3.flocks){f.sq-=dt;f.mt-=dt;if(f.ship&&f.md!=='land'){f.cx+=(f.ship.x-f.cx)*Math.min(1,dt*2);f.cy+=(f.ship.y-f.cy)*Math.min(1,dt*2);}
    if(f.mt<=0){if(f.md==='circle'&&f.land&&Math.hypot(f.land.x-D.x,f.land.y-D.y)>600){f.md='land';f.mt=R(8,12);b3St('flockLandings');}else{f.md='circle';f.mt=R(14,24);}}}}
function b3Upd(dt,mine){B3.cur=mine;b3Spawner(dt);b3Flocks(dt);const sw={n:0};for(const b of mine)if(b.kind==='vbat'&&b.md==='swoop'&&!b.dead)sw.n++;
  for(const b of mine){if(b.dead)continue;if(b.kind==='fairy')b3Fairy(b,dt);else if(b.kind==='vbat')b3Bat(b,dt,sw);else if(b.fl)b3Gull(b,dt);}}
{const _ub=updBirds;updBirds=function(dt){let mine=null;for(const b of birds)if(b.b3){mine=[];break;}
  if(mine){let j=0;for(let i=0;i<birds.length;i++){const b=birds[i];if(b.b3)mine.push(b);else birds[j++]=b;}birds.length=j;}
  const r=_ub.apply(this,arguments);mine=mine||[];
  if(scene==='play'&&G&&!G.over)b3Upd(dt,mine);B3.cur=[];for(const b of birds)if(b.b3&&mine.indexOf(b)<0)mine.push(b); // newly spawned this frame
  {let j=0;for(let i=0;i<birds.length;i++)if(!birds[i].b3)birds[j++]=birds[i];birds.length=j;}
  for(const b of mine){if(!b.dead){birds.push(b);continue;}if(b.gone)continue;if(b.b3h){b.b3h.n=Math.max(0,b.b3h.n-1);b.b3h.lost++;}if(b.fl){b.fl.n=Math.max(0,b.fl.n-1);}}
  return r;};}
// eating: a low fairy/bat/gull can be snapped from the ground too (they hover low), and from the air; fairies sometimes dart aside
function b3Eat(){if(D.eatCD>0)return false;const air=D.alt>=.5,mx=D.x+Math.cos(D.ang)*80,my=D.y+Math.sin(D.ang)*80;let best=null,bd=1e9;
  for(const b of birds){if(!b.b3||b.dead)continue;if(!air&&(b.z>100||b.state==='ground'))continue;if(air&&b.state==='ground')continue;
    const d=Math.min(Math.hypot(b.x-mx,b.y-my),Math.hypot(b.x-D.x,b.y-D.y)+12);if(d<72&&d<bd){bd=d;best=b;}}
  if(!best)return false;D.eatT=.3;const y=best.y-best.z;
  if(best.kind==='fairy'&&!best.dodged&&rnd()<.35){best.dodged=1;D.eatCD=.4;best.md='flee';best.mt=1.5;best.da=Math.atan2(best.y-D.y,best.x-D.x);best.dt2=.3;sparkle(best.x,y,6);float(best.x,y-18,'Missed! The fairy darted away','#ffe0ff');b3St('fairyDodges');return true;}
  best.dead=true;const B=BIRD[best.kind];D.eatCD=air?.6:.4;D.hp=Math.min(D.maxHp,D.hp+B.heal);D.healFx=.6;try{feed(B.heal);}catch(e){}try{glutEat(foodOf(best.kind));}catch(e){}try{tallyAdd(best.kind);}catch(e){}
  G.stats.birds=(G.stats.birds||0)+1;G.stats.birdPts=(G.stats.birdPts||0)+B.pts;b3St(best.kind+'Eaten');float(D.x+R(-10,10),D.y-heightOf()-70,`+${B.heal} HP`,'#6dff7a');
  if(best.kind==='fairy'){sparkle(best.x,y,12);puff(best.x,y,8,'rgba(255,240,200,',60,4);float(best.x,y-18,`Gulp! *poof of sparkles* +${B.pts} pts`,'#ffe8ff');}
  else if(best.kind==='vbat'){puff(best.x,y,7,'rgba(120,90,140,',60,4);float(best.x,y-18,`Gulp! Bat snack +${B.pts} pts`,'#e0c8ff');}
  else{puff(best.x,y,8,'rgba(240,240,235,',70,4);float(best.x,y-18,`Snack! +${B.pts} pts`,'#ffd27a');}
  return true;}
// the northern barrier keeps every bird out of the north - except these, which belong there (and the gulls hold their own side)
{const _ko=nrKeepOut;nrKeepOut=function(){const H=[];for(const b of birds)if(b.b3&&!b.dead){b.dead=true;H.push(b);}try{return _ko.apply(this,arguments);}finally{for(const b of H)b.dead=false;}};}
{const _te=tryEatBird;tryEatBird=function(){if(b3Eat())return true;return _te.apply(this,arguments);};}
// fire: fairies vanish in a sparkle puff, bats flap off dizzy (no remains)
{const _ko=birdKO;birdKO=function(b,why){if(b.dead||(b.kind!=='fairy'&&b.kind!=='vbat'))return _ko.apply(this,arguments);b.dead=true;const B=BIRD[b.kind],y=b.y-(b.z||0);
  G.stats.birdsSinged=(G.stats.birdsSinged||0)+1;G.stats.birdPts=(G.stats.birdPts||0)+B.pts;b3St(b.kind+'Singed');
  if(b.kind==='fairy'){sparkle(b.x,y,10);puff(b.x,y,6,'rgba(255,230,200,',60,4);float(b.x,y-16,`Poof! The fairy zips off dizzy +${B.pts} pts`,'#ffe8ff');}
  else{puff(b.x,y,6,'rgba(90,70,100,',60,4);float(b.x,y-16,`${why} The bat flaps off dizzy +${B.pts} pts`,'#e0c8ff');}};}
// art
function b3DrawFairy(b){const x=b.x,y=b.y-b.z,w=Math.sin(b.flap),gl=.5+.3*Math.sin(G.t*6+b.ph),c=b.c1||'#ffb0e8';
  ell(b.x,b.y,5,2,'rgba(0,0,0,.12)');
  for(let i=1;i<=4;i++){const tx=x-(b.vx||0)*.035*i,ty=y-(b.vy||0)*.035*i+i*1.5;ell(tx,ty,3-i*.55,3-i*.55,`rgba(255,240,170,${.6-i*.13})`);}
  ell(x,y,13,13,`rgba(255,240,190,${.18*gl+.08})`);ell(x,y,7,7,`rgba(255,250,220,${.25*gl+.1})`);
  ctx.globalAlpha=.7;ell(x-6,y-4-w*3,7,3.5+w*1.8,'#d8f4ff');ell(x+6,y-4-w*3,7,3.5+w*1.8,'#d8f4ff');ctx.globalAlpha=1;
  ell(x,y+1.5,3,5,c);ell(x,y-5,3,3,'#ffe2c8');ell(x,y-7,3.2,1.6,c);
  if(((G.fc||0)+b.id)%9===0)txt('✦',x+R(-10,10),y+R(-10,8),7,'#fff8c0','center',false);}
function b3DrawBat(b){const x=b.x,y=b.y-b.z,w=Math.sin(b.flap),c='#3a2846',c2='#5c3c6e';
  ell(b.x,b.y,7,2.4,'rgba(0,0,0,.15)');
  poly([x-3,y-1,x-15,y-8-w*8,x-20,y-1-w*3,x-14,y+1-w*2,x-10,y+4],c2);poly([x+3,y-1,x+15,y-8-w*8,x+20,y-1-w*3,x+14,y+1-w*2,x+10,y+4],c2);
  ell(x,y,5,6,c);poly([x-4.5,y-3,x-3.5,y-11,x-1,y-5],c);poly([x+4.5,y-3,x+3.5,y-11,x+1,y-5],c);
  ell(x-2,y-1.5,2.6,2.6,'rgba(255,40,60,.35)');ell(x+2,y-1.5,2.6,2.6,'rgba(255,40,60,.35)');ell(x-2,y-1.5,1.2,1.2,'#ff3040');ell(x+2,y-1.5,1.2,1.2,'#ff3040');
  if(b.full>0)txt('✦',x+R(-8,8),y-12+R(-4,4),8,'#ff6a8a','center',false);}
{const _db=drawBird;drawBird=function(b,fly){if(b.kind==='fairy'){ctx.save();ctx.translate(b.x,b.y);ctx.scale(1.45,1.45);ctx.translate(-b.x,-b.y);try{return b3DrawFairy(b);}finally{ctx.restore();}}if(b.kind==='vbat')return b3DrawBat(b);return _db.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);B3.flocks.length=0;if(B3.homes)for(const h of B3.homes){h.on=false;h.n=0;h.lost=0;h.rt=0;}return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);B3.flocks.length=0;if(B3.homes)for(const h of B3.homes){h.on=false;h.n=0;}for(const b of birds)if(b.b3){b.dead=true;b.gone=1;}return r;};}
// ======================= queue 41-44 (batch 3, piece 2): MERMAIDS, SUNBATHERS ON ROCKS & ICE, and NESSIE =======================
//  41/42 mermaids (light side, family-friendly): (QUEUE 93) they ALL swim north of the magic wind wall, in the northern sea along the
//     light dwarf coast (never south of the wall, never on the Wizard's isle). Most dive away from the dragon; brave ones
//     (guards) defend with a splash or a trident poke (small damage) and also poke dark creatures that come near the water.
//     Edible while surfaced like a light unit; fire only reaches them while they are surfaced.
//  43  some sunbathe (lying back, tail flicking) on sea rocks, ice floes and the dwarf-coast beaches - all north of the wall (QUEUE 93); when the dragon
//     comes close they slide into the sea and dive.
//     (Not done: the purple/elven lands have no rivers or lakes and the elven realm has no coast, so there are no river/lake mermaids.)
//  44  NESSIE, the Loch Ness monster: a friendly-looking green plesiosaur mini boss with her own dark loch-water patch in the northern ocean,
//     NORTH of the wind wall (QUEUE 93; was south of it) and clear of the Wizard's isle and the Kraken Deep. She lurks, surfaces and dives (like the Kraken), and attacks
//     with a neck lunge/bite, a tail slap and a wave splash. Boss bar (fixed width). Beating her gives +50 MAX HEALTH. She STAYS BEATEN UNTIL
//     THE DRAGON IS DEFEATED (like the Wizard/Hydra/Griffin, not the Kraken's 240 s respawn); her health and beaten state are saved with G.
const MMK={swim:4,near:1400,far:2600,hp:40,food:14,heal:10,pts:60,guard:.35,bask:380};
const MM={list:[],spots:null,t:0,id:0,stats:{}};
const NSZ={x:9700,y:-3500,rx:620,ry:330}; // QUEUE 93/99: north of the magic wind wall, in the SOUTHERN part of the light (dwarf-coast) fantasy ocean (was 9950,-2120, south of the wall)
const NSK={reward:50,lunge:9,tail:7,wave:6};
const NS={on:false,x:NSZ.x,y:NSZ.y,sub:1,st:'lurk',t:0,hp:0,maxHp:0,act:null,cd:0,face:1,waves:[],hitT:-9,lastD:-99};
function mmSt(k){MM.stats[k]=(MM.stats[k]||0)+1;}
function nsIn(x,y,s){s=s||1;const a=(x-NSZ.x)/(NSZ.rx*s),b=(y-NSZ.y)/(NSZ.ry*s);return a*a+b*b<1;}
function mmSouth(x,y){return y>nrEdge(x)+110&&y<-150&&x>coastX(y)+60;}
function mmNorth(x,y){return y<nrEdge(x)-150&&y>nrDarkY(x)+300&&x>coastX(y)+60&&x<coastX(y)+2600;}
function mmRegion(x,y){if(x<WX0+200||x>WX1-200||!inSea(x,y)||inDeep(x,y))return false;if(Math.hypot(x-WZ.x,y-WZ.y)<WZ.r+320||nsIn(x,y,1.25))return false;return mmNorth(x,y);} // QUEUE 93: north of the wind wall only
function mmRng(s){return ()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648;};}
function mmSpots(){if(MM.spots)return MM.spots;const r=mmRng(4242),S=[];
  const add=(k,x,y,sx,sy)=>{if(S.some(o=>Math.hypot(o.x-x,o.y-y)<380))return false;S.push({k,x,y,sx,sy,rt:0,who:null,seed:r()*9});return true;};
  // sea rocks in the northern sea, north of the wall (QUEUE 93: they used to be south of it, along the east coast)
  for(let i=0,n=0;i<90&&n<8;i++){const y=-6200+r()*3000,x=coastX(y)+180+r()*900;if(mmRegion(x,y)&&mmRegion(x+120,y)&&add('rock',x,y,x+110,y+30))n++;}
  // ice floes: a few drifting just NORTH of the wind wall (QUEUE 93: was just south of it), more in the cold northern sea
  for(let i=0,n=0;i<60&&n<3;i++){const x=coastX(-3100)+300+r()*2000,y=nrEdge(x)-220-r()*160;if(mmRegion(x,y)&&add('ice',x,y,x+130,y+40))n++;}
  for(let i=0,n=0;i<90&&n<8;i++){const y=-6400+r()*3300,x=coastX(y)+260+r()*1300;if(mmRegion(x,y)&&add('ice',x,y,x+130,y+40))n++;}
  // dwarf-coast beaches (light shore of the northern sea)
  for(let i=0,n=0;i<60&&n<5;i++){const y=-6200+r()*3000,cx=coastX(y),x=cx-45;const rl=nrRealm(cx-220,y);if(!inSea(x,y)&&inSea(cx+140,y)&&rl&&NR_LIGHT.has(rl)&&add('beach',x,y,cx+150,y))n++;}
  return MM.spots=S;}
function mmNew(x,y,o){const m=Object.assign({id:++MM.id,x,y,hx:x,hy:y,vx:0,vy:0,st:'swim',sub:1,hp:MMK.hp,ang:R(0,TAU),ph:R(0,TAU),cd:R(1,3),t:0,guard:rnd()<MMK.guard,
  hair:['#f2c14e','#e0703a','#b04a8a','#6a3a1e','#2f6fd0'][RI(0,4)],tail:['#2fb3a0','#3d8fe0','#8a5ad8','#2fc07a'][RI(0,3)],top:['#f4a6c8','#ffd27a','#c8e6ff'][RI(0,2)]},o||{});
  MM.list.push(m);mmSt('spawn');return m;}
function mmGone(m,why){m.dead=true;if(m.spot){m.spot.who=null;m.spot.rt=why==='eaten'||why==='fire'?45:18;}}
function mmSpawner(dt){MM.t-=dt;if(MM.t>0)return;MM.t=.5;const S=mmSpots();
  for(const m of MM.list)if(!m.dead&&Math.hypot(m.x-D.x,m.y-D.y)>MMK.far){m.dead=true;m.far=1;if(m.spot)m.spot.who=null;}
  for(const s of S){if(s.rt>0)s.rt-=.5;const d=Math.hypot(s.x-D.x,s.y-D.y);if(!s.who&&s.rt<=0&&d<MMK.near&&d>MMK.bask+420){s.who=mmNew(s.x,s.y,{st:'bask',sub:0,spot:s,guard:false});mmSt('baskSpawn');}}
  let n=0;for(const m of MM.list)if(!m.dead&&!m.spot)n++;
  for(let i=0;i<4&&n<MMK.swim;i++){const a=R(0,TAU),r=R(520,1150),x=D.x+Math.cos(a)*r,y=D.y+Math.sin(a)*r;if(!mmRegion(x,y))continue;mmNew(x,y);n++;}
  MM.list=MM.list.filter(m=>!m.dead);}
function mmMove(m,tx,ty,sp,dt){const dx=tx-m.x,dy=ty-m.y,d=Math.hypot(dx,dy)||1,v=Math.min(sp,d/Math.max(dt,.001));m.vx+=((dx/d)*v-m.vx)*Math.min(1,dt*3);m.vy+=((dy/d)*v-m.vy)*Math.min(1,dt*3);
  const nx=m.x+m.vx*dt,ny=m.y+m.vy*dt;if(m.st==='slide'||mmRegion(nx,ny)||(inSea(nx,ny)&&!mmRegion(m.x,m.y))){m.x=nx;m.y=ny;}else{m.vx*=-.5;m.vy*=-.5;}
  if(Math.abs(m.vx)+Math.abs(m.vy)>8)m.ang=Math.atan2(m.vy,m.vx);}
function mmDarkNear(m){let b=null,bd=240*240;for(const v of NRU){if(!grDark(v))continue;const dx=v.x-m.x,dy=v.y-m.y,d=dx*dx+dy*dy;if(d<bd){bd=d;b=v;}}return b;}
function mmUpd(m,dt){m.t+=dt;m.ph+=dt;m.cd-=dt;const dx=m.x-D.x,dy=m.y-D.y,dd=Math.hypot(dx,dy),low=D.alt<.6;
  if(m.st==='bask'){m.sub=0;if(dd<MMK.bask&&!G.over){m.st='slide';m.t=0;float(m.x,m.y-50,'Eek! Splash!','#bfefff');mmSt('slides');}return;}
  if(m.st==='slide'){mmMove(m,m.spot.sx,m.spot.sy,190,dt);if(Math.hypot(m.x-m.spot.sx,m.y-m.spot.sy)<30||m.t>2.5){m.st='dive';m.t=0;m.spot.who=null;m.spot.rt=20;m.spot=null;m.hx=m.x+(m.x-D.x)*.5;m.hy=m.y+(m.y-D.y)*.5;puff(m.x,m.y,8,'rgba(210,240,255,',60,5);}return;}
  if(m.st==='dive'){m.sub=Math.min(1,m.sub+dt*1.6);const a=Math.atan2(dy,dx);mmMove(m,m.x+Math.cos(a)*200,m.y+Math.sin(a)*200,200,dt);if(m.t>3.2&&dd>420){m.st='swim';m.t=0;m.hx=m.x;m.hy=m.y;}return;}
  // swim: surface, wander round home; guards defend, the rest dive away
  m.sub=Math.max(m.st==='swim'&&Math.sin(m.ph*.35+m.id)>.93?.75:0,m.sub-dt*1.2);
  if(m.guard&&!G.over){const v=m.cd<=0?mmDarkNear(m):null;if(v){m.cd=1.4;nrHit(v,8,null);float(v.x,v.y-40,'Trident poke!','#bfefff');puff(v.x,v.y,6,'rgba(210,240,255,',60,4);m.ang=Math.atan2(v.y-m.y,v.x-m.x);mmSt('fightDark');m.atkT=.4;}}
  if(dd<300&&low&&!G.over){if(m.guard){const a=Math.atan2(dy,dx);if(dd>130)mmMove(m,D.x+Math.cos(a)*120,D.y+Math.sin(a)*120,120,dt);m.ang=Math.atan2(-dy,-dx);
      if(m.cd<=0&&dd<230){m.cd=R(2,2.8);m.atkT=.45;if(rnd()<.5){hurtDragon(2,'mermaid');float(D.x+R(-15,15),D.y-heightOf()-80,'Splash! -2','#9fe0ff');puff(D.x,D.y,10,'rgba(200,240,255,',90,5);m.atk='splash';mmSt('splashes');}
        else{hurtDragon(3,'mermaid');float(D.x+R(-15,15),D.y-heightOf()-80,'Trident poke! -3','#d8f4ff');m.atk='trident';mmSt('pokes');}}return;}
    m.st='dive';m.t=0;mmSt('dives');return;}
  const tx=m.hx+Math.cos(m.ph*.4+m.id)*220,ty=m.hy+Math.sin(m.ph*.3+m.id)*120;mmMove(m,tx,ty,70,dt);}
function mmTick(dt){mmSpawner(dt);for(const m of MM.list)if(!m.dead){mmUpd(m,dt);if(m.atkT>0)m.atkT-=dt;}}
// player vs mermaids: a bite gulps a surfaced one; fire / lava only reach surfaced ones
function mmMouth(){return {x:D.x+Math.cos(D.ang)*60,y:D.y+Math.sin(D.ang)*60};}
{const _te=tryEat;tryEat=function(){if(!(D.eatCD>0)&&D.alt<.6&&scene==='play'){const p=mmMouth();let b=null,bd=95;for(const m of MM.list){if(m.dead||m.sub>.5)continue;const d=Math.min(Math.hypot(m.x-p.x,m.y-p.y),Math.hypot(m.x-D.x,m.y-D.y)+25);if(d<bd){bd=d;b=m;}}
    if(b){mmGone(b,'eaten');D.eatCD=.45;D.eatT=.3;D.hp=Math.min(D.maxHp,D.hp+MMK.heal);D.healFx=.5;try{feed(MMK.heal);}catch(e){}try{glutEat(MMK.food);}catch(e){}try{tallyAdd('mermaid');}catch(e){}
      G.stats.eaten=(G.stats.eaten||0)+1;G.stats.seaPts=(G.stats.seaPts||0)+MMK.pts;puff(b.x,b.y,12,'rgba(210,240,255,',80,6);sparkle(b.x,b.y-20,8);float(b.x,b.y-60,'GULP! (+'+MMK.heal+')','#bfefff');mmSt('eaten');return;}}
  return _te.apply(this,arguments);};}
function mmBurn(m,d){m.hp-=d;m.hitT=G.t;if(m.hp<=0&&!m.dead){mmGone(m,'fire');puff(m.x,m.y,12,'rgba(230,240,255,',70,7);float(m.x,m.y-50,'Hiss! She dives away for good','#bfefff');mmSt('burned');}
  else if(m.st==='swim'||m.st==='bask'){if(m.st==='bask'){m.st='slide';m.t=0;}else{m.st='dive';m.t=0;}}}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);for(const m of MM.list)if(!m.dead&&m.sub<.4&&inFire(m.x,m.y,ox,oy))mmBurn(m,DR.fireDps*dt*1.4);return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);for(const m of MM.list)if(!m.dead&&m.sub<.4&&Math.hypot(m.x-x,m.y-y)<LAVA_CFG.splashR+30)mmBurn(m,60);return r;};}
// ---- drawing: rocks, ice floes, mermaids (ground layer, under the units) ----
function mmRock(s){const x=s.x,y=s.y;ell(x,y+10,86,30,'rgba(20,40,60,.25)');ell(x-26,y-4,46,30,'#7d756c');ell(x+22,y,52,28,'#8c8478');ell(x,y-14,40,22,'#9d958a');ell(x-8,y-22,20,8,'rgba(255,255,255,.18)');
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y+14,92,26,0,0,Math.PI);ctx.stroke();}
function mmIce(s){const x=s.x,y=s.y,k=s.seed,P=[];for(let i=0;i<9;i++){const a=i/9*TAU,rr=1+.18*Math.sin(k+i*2.1);P.push([x+Math.cos(a)*110*rr,y+Math.sin(a)*52*rr]);}
  ctx.fillStyle='rgba(20,60,90,.25)';ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]+10):ctx.moveTo(p[0],p[1]+10));ctx.fill();
  ctx.fillStyle='#e8f6ff';ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.strokeStyle='#9cc8e6';ctx.lineWidth=2;ctx.stroke();
  ell(x-20,y-10,50,18,'#ffffff');ell(x+40,y+12,22,8,'rgba(170,215,240,.6)');}
function mmBody(m,x,y,a,lie){const T=G.t+m.id,fl=Math.sin(T*(lie?2.2:5))*(lie?.35:.25),c=Math.cos(a),s=Math.sin(a);
  // tail (behind), fin flick
  const tx=x-c*34,ty=y-s*34;ctx.strokeStyle=m.tail;ctx.lineWidth=13;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-c*6,y-s*6);ctx.quadraticCurveTo(x-c*22-s*8*fl*3,y-s*22+c*8*fl*3,tx,ty);ctx.stroke();
  const fa=a+Math.PI+fl;ctx.fillStyle=m.tail;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(fa-.6)*20,ty+Math.sin(fa-.6)*20-(lie?6:0));ctx.lineTo(tx+Math.cos(fa)*12,ty+Math.sin(fa)*12);ctx.lineTo(tx+Math.cos(fa+.6)*20,ty+Math.sin(fa+.6)*20-(lie?6:0));ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-c*12,y-s*12);ctx.lineTo(x-c*26,y-s*26);ctx.stroke();ctx.lineCap='butt';
  // torso + shell top, arms, head with flowing hair
  ell(x,y-6,10,12,'#f3c9a8');ell(x-4+c*2,y-8,4,3,m.top);ell(x+4+c*2,y-8,4,3,m.top);
  if(lie){ctx.strokeStyle='#f3c9a8';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+c*4-6,y-12);ctx.lineTo(x+c*16-4,y-24);ctx.moveTo(x+c*4+6,y-12);ctx.lineTo(x+c*16+4,y-24);ctx.stroke();}
  const hx=x+c*10,hy=y-20+s*4;ctx.fillStyle=m.hair;ctx.beginPath();ctx.ellipse(hx-c*6,hy+4,12,9,a,0,TAU);ctx.fill();ell(hx-c*12+Math.sin(T*2)*2,hy+10,7,10,m.hair);
  ell(hx,hy,8,8,'#f3c9a8');ell(hx-3,hy-1,1.4,1.4,'#2a2a3a');ell(hx+3,hy-1,1.4,1.4,'#2a2a3a');ctx.strokeStyle='#c0605a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hx,hy+2,2.5,.2,Math.PI-.2);ctx.stroke();
  ctx.fillStyle=m.hair;ctx.beginPath();ctx.ellipse(hx,hy-5,9,5,0,Math.PI,TAU);ctx.fill();}
function mmDraw(m){const x=m.x,y=m.y;if(Math.abs(x-cam.x)>VW/cam.z/2+150||Math.abs(y-cam.y)>VH/cam.z/2+150)return;
  if(m.st==='bask'||m.st==='slide'){if(m.hitT&&G.t-m.hitT<.1)ctx.globalAlpha=.6;mmBody(m,x,y-(m.spot&&m.spot.k==='rock'?18:4),m.st==='slide'?m.ang:-.25,true);ctx.globalAlpha=1;return;}
  const sub=m.sub;ctx.strokeStyle=`rgba(255,255,255,${.5-sub*.3})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,26+Math.sin(G.t*3+m.id)*3,10,0,0,TAU);ctx.stroke();
  if(sub>.85)return;
  if(sub>.35){const a=m.ang,fx=x-Math.cos(a)*10,fy=y-8-(1-sub)*20;ctx.globalAlpha=1-sub;ctx.fillStyle=m.tail;ctx.beginPath();ctx.moveTo(fx,fy+12);ctx.lineTo(fx-16,fy-6);ctx.lineTo(fx,fy+2);ctx.lineTo(fx+16,fy-6);ctx.closePath();ctx.fill();ctx.globalAlpha=1;return;}
  ctx.save();ctx.beginPath();ctx.rect(x-80,y-80,160,84);ctx.clip();if(m.hitT&&G.t-m.hitT<.1)ctx.globalAlpha=.6;mmBody(m,x,y,m.ang,false);ctx.restore();ctx.globalAlpha=1;
  ell(x,y+1,22,6,'rgba(120,190,230,.55)');
  if(m.guard){const c=Math.cos(m.ang),s=Math.sin(m.ang),k=m.atkT>0&&m.atk==='trident'?18:0,px=x+c*(14+k),py=y-28+s*(4+k*.3);ctx.strokeStyle='#e8d070';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+c*4,y-2);ctx.lineTo(px,py);ctx.stroke();
    ctx.beginPath();ctx.moveTo(px-4,py-1);ctx.lineTo(px-4,py-8);ctx.moveTo(px,py);ctx.lineTo(px,py-9);ctx.moveTo(px+4,py-1);ctx.lineTo(px+4,py-8);ctx.stroke();}
  if(m.atkT>0&&m.atk==='splash'){ctx.strokeStyle='rgba(200,240,255,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y-10,20+(.45-m.atkT)*60,Math.PI*1.1,Math.PI*1.9);ctx.stroke();}}
// ---- NESSIE ----
function nsMaxHp(){return Math.round(Math.min(1500,800+80*(nrLvl()-1)));}
function nsDown(){return !!G.nsDown;}
function nsInit(){NS.maxHp=nsMaxHp();NS.hp=G.nsHp>0?Math.min(G.nsHp,NS.maxHp):NS.maxHp;NS.on=true;NS.st='lurk';NS.sub=1;NS.t=R(1,2);NS.act=null;NS.waves=[];NS.x=G.nsX!=null?G.nsX:NSZ.x;NS.y=G.nsY!=null?G.nsY:NSZ.y;NS.koT=0;}
function nsClamp(){const a=(NS.x-NSZ.x)/(NSZ.rx*.82),b=(NS.y-NSZ.y)/(NSZ.ry*.82),d=Math.hypot(a,b);if(d>1){NS.x=NSZ.x+(NS.x-NSZ.x)/d;NS.y=NSZ.y+(NS.y-NSZ.y)/d;}}
function nsHead(){const f=NS.face,up=1-NS.sub,A=NS.act;if(A&&A.k==='lunge'&&A.ph==='hit')return {x:NS.x+Math.cos(NS.la)*230,y:NS.y+Math.sin(NS.la)*230-60*up};
  if(A&&A.ph==='tele')return {x:NS.x+f*40,y:NS.y-175*up};return {x:NS.x+f*75,y:NS.y-150*up};}
function nsHurtD(d,src,txt){if(G.over||D.alt>.8)return;hurtDragon(d,'nessie');float(D.x+R(-15,15),D.y-heightOf()-90,txt,'#a8ffb8');}
function nsUpd(dt){if(nsDown()){NS.on=false;NS.waves.length=0;return;}const dd=Math.hypot(D.x-NS.x,D.y-NS.y),inZ=nsIn(D.x,D.y,1.7);
  if(!NS.on){if(!nsIn(D.x,D.y,3.2))return;nsInit();}
  if(NS.maxHp!==nsMaxHp()){const f=NS.hp/NS.maxHp;NS.maxHp=nsMaxHp();NS.hp=NS.maxHp*f;}
  if(inZ&&!G.nsSeen){G.nsSeen=1;showToast('🦕 Something big stirs in the dark water... it is NESSIE!');float(D.x,D.y-heightOf()-120,'Nessie!','#a8ffb8');}
  for(const w of NS.waves){w.r+=430*dt;if(!w.hit&&D.alt<.5&&Math.abs(Math.hypot(D.x-w.x,D.y-w.y)-w.r)<38){w.hit=1;nsHurtD(NSK.wave,'wave','Wave splash! -'+NSK.wave);const a=Math.atan2(D.y-w.y,D.x-w.x);D.nrKb={vx:Math.cos(a)*260,vy:Math.sin(a)*260,t:.5};}}
  NS.waves=NS.waves.filter(w=>w.r<640);
  if(NS.koT>0){NS.koT-=dt;NS.sub=0;if(NS.koT<=0)nsDefeat();return;}
  NS.t-=dt;NS.cd-=dt;if(Math.abs(D.x-NS.x)>20)NS.face=D.x>NS.x?1:-1;
  if(NS.st==='lurk'){NS.sub=Math.min(1,NS.sub+dt*1.5);if(inZ){const a=Math.atan2(D.y-NS.y,D.x-NS.x),sp=dd>240?150:0;NS.x+=Math.cos(a)*sp*dt;NS.y+=Math.sin(a)*sp*dt;nsClamp();}
    if(NS.t<=0&&inZ){NS.st='rise';NS.t=1.1;puff(NS.x,NS.y,10,'rgba(200,240,230,',80,6);}return;}
  if(NS.st==='rise'){NS.sub=Math.max(0,NS.sub-dt*1.1);if(NS.t<=0){NS.st='up';NS.t=R(7,9);NS.cd=.8;}return;}
  if(NS.st==='dive'){NS.sub=Math.min(1,NS.sub+dt*1.4);NS.act=null;if(NS.t<=0){NS.st='lurk';NS.t=R(2.5,4);}return;}
  // surfaced
  NS.sub=Math.max(0,NS.sub-dt*2);if(!inZ&&!NS.act){NS.st='dive';NS.t=1;return;}
  if(NS.act){const A=NS.act;A.t-=dt;
    if(A.ph==='tele'&&A.t<=0){A.ph='hit';A.t=A.k==='lunge'?.35:.3;
      if(A.k==='lunge'){const hx=NS.x+Math.cos(NS.la)*230,hy=NS.y+Math.sin(NS.la)*230;if(Math.hypot(D.x-hx,D.y-hy)<110)nsHurtD(NSK.lunge,'lunge','Nessie lunge - CHOMP! -'+NSK.lunge);else float(hx,hy-60,'Snap!','#a8ffb8');}
      else if(A.k==='tail'){if(dd<360){nsHurtD(NSK.tail,'tail','Tail slap! -'+NSK.tail);const a=Math.atan2(D.y-NS.y,D.x-NS.x);D.nrKb={vx:Math.cos(a)*380,vy:Math.sin(a)*380,t:.45};}puff(NS.x-NS.face*120,NS.y,14,'rgba(210,245,255,',110,7);}
      else if(A.k==='wave'){NS.waves.push({x:NS.x,y:NS.y,r:60,hit:0});float(NS.x,NS.y-180,'WHOOSH!','#bfefff');}}
    else if(A.ph==='hit'&&A.t<=0){NS.act=null;NS.cd=R(1.2,2);}return;}
  if(NS.t<=0){NS.st='dive';NS.t=1;puff(NS.x,NS.y,10,'rgba(200,240,230,',80,6);return;}
  if(NS.cd<=0&&!G.over){NS.la=Math.atan2(D.y-NS.y,D.x-NS.x);
    if(dd<300&&rnd()<.55){NS.act={k:'lunge',ph:'tele',t:.7};}else if(dd<380){NS.act={k:'tail',ph:'tele',t:.6};}else if(dd<760){NS.act={k:'wave',ph:'tele',t:.7};}else NS.cd=.5;
    if(NS.act)G.nsAtk=(G.nsAtk||0)+1;}}
function nsHurt(d,how){if(!NS.on||nsDown()||NS.koT>0||NS.sub>.5||d<=0)return;NS.hp-=d;NS.hitT=G.t;NS.lastD=G.t;G.nsHp=Math.max(1,Math.round(NS.hp));G.nsX=NS.x;G.nsY=NS.y;
  if(NS.hp<=0){NS.hp=0;NS.koT=2;NS.act=null;NS.waves.length=0;float(NS.x,NS.y-200,'Dizzy!','#ffe28a');}}
function nsDefeat(){G.nsDown=1;G.nsHp=0;G.nsWins=(G.nsWins||0)+1;G.nsX=NS.x;G.nsY=NS.y;NS.on=false;sparkle(NS.x,NS.y-120,24);puff(NS.x,NS.y,14,'rgba(210,245,230,',90,9);
  const gain=NSK.reward;D.hpBonus=(D.hpBonus||0)+gain;D.maxHp+=gain;D.hp=D.maxHp;D.healFx=1;G.nsHpGain=(G.nsHpGain||0)+gain;
  G.banner={text:'Nessie is beaten!',sub:`She paddles off for a long nap. You feel tougher: +${gain} max health (now ${D.maxHp}, until you lose this dragon)`,t:4.5};
  float(D.x,D.y-heightOf()-130,`MAX HEALTH +${gain}!`,'#7aff8a');showToast(`🦕 Nessie is beaten! ❤️ +${gain} max health`);try{horn();}catch(e){}}
function nsNear(px,py,r){if(!NS.on||nsDown()||NS.koT>0||NS.sub>.5)return false;const h=nsHead();return Math.hypot(px-NS.x,py-NS.y)<r+90||Math.hypot(px-h.x,py-h.y)<r;}
{const _t=nrTick;nrTick=function(dt){_t(dt);if(scene==='play'&&G&&!G.over){mmTick(dt);nsUpd(dt);}};}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);if(NS.on&&NS.sub<.5&&!(NS.koT>0)&&!nsDown()){const h=nsHead();if(inFire(NS.x,NS.y,ox,oy)||inFire(h.x,h.y,ox,oy)||inFire(NS.x,NS.y-60,ox,oy))nsHurt(DR.fireDps*.5*dt,'fire');}return r;};}
{const _te=tryEat;tryEat=function(){if(!(D.eatCD>0)&&D.alt<.6){const p=mmMouth();if(nsNear(p.x,p.y,110)){nsHurt(18,'bite');D.eatCD=.45;float(NS.x,NS.y-170,'Chomp! -18','#a8ffb8');return;}}return _te.apply(this,arguments);};}
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);if(nsNear(D.x,D.y,DR.stompR+40))nsHurt(30,'stomp');return r;};}
{const _ds=diveSlam;diveSlam=function(){const r=_ds.apply(this,arguments);if(nsNear(D.x,D.y,DR.stompR+60))nsHurt(40,'dive');return r;};}
if(typeof clawScratch==='function'){const _cs=clawScratch;clawScratch=function(){const r=_cs.apply(this,arguments);const p=mmMouth();if(D.alt<.6&&nsNear(p.x,p.y,130))nsHurt(12,'claw');return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);if(nsNear(x,y,LAVA_CFG.splashR+40))nsHurt(35,'lava');return r;};}
function nsArt(x,y,f,sub,st){const T=G.t,up=1-sub,g='#4fae6a',gd='#3a8a52',bl='#bfe8b0';if(up<=.02)return;const H=nsHead();
  ctx.save();ctx.beginPath();ctx.rect(x-700,y-700,1400,700+6);ctx.clip();
  // humps + tail + flippers (only the part above the water shows)
  const hb=up*34;ell(x-f*20,y-hb*.7,95,40*up+4,g);ell(x-f*120,y-hb*.45,45,24*up+3,g);ell(x-f*20,y-hb*.7-8*up,60,14*up,bl);
  const tl=st.tail?1:0;if(tl){ctx.fillStyle=gd;ctx.beginPath();ctx.ellipse(x-f*190,y-40*up,60,16,-f*.6,0,TAU);ctx.fill();}
  ell(x+f*50,y-4,26,9,gd);ell(x-f*70,y-4,24,8,gd);
  // long neck (curve of circles) to the head
  const sx=x+f*55,sy=y-hb*.8,cx=(sx+H.x)/2+f*(st.tele?-40:10),cy=Math.min(sy,H.y)-40*up;
  for(let i=0;i<=14;i++){const t=i/14,px=(1-t)*(1-t)*sx+2*(1-t)*t*cx+t*t*H.x,py=(1-t)*(1-t)*sy+2*(1-t)*t*cy+t*t*H.y,r=22-t*9;ell(px,py,r,r,g);if(i%3===0)ell(px-f*4,py+r*.4,r*.6,r*.35,bl);}
  // friendly head: big eyes, smile, little nose bumps; open jaw when biting
  const open=st.bite?1:0;ell(H.x+f*8,H.y,30,20,g);ell(H.x+f*30,H.y+6,18,12+open*6,g);if(open)ell(H.x+f*34,H.y+10,12,6,'#8a3a4a');
  ell(H.x+f*2,H.y-10,9,10,'#fff');ell(H.x+f*5,H.y-9,4.5,5.5,'#1a2a1a');ell(H.x+f*6,H.y-11,1.6,1.6,'#fff');
  ctx.strokeStyle='#2a5a36';ctx.lineWidth=2;ctx.beginPath();ctx.arc(H.x+f*28,H.y+6,9,f>0?.1:Math.PI-1.2,f>0?1.2:Math.PI-.1);ctx.stroke();ell(H.x+f*44,H.y-2,2,2,'#2a5a36');
  ell(H.x-f*6,H.y-20,5,7,gd);ell(H.x+f*10,H.y-19,4,6,gd);
  ctx.restore();
  // waterline ring + splash
  ctx.strokeStyle=`rgba(255,255,255,${.35+.25*up})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x-f*20,y,120+Math.sin(T*2)*6,22,0,0,TAU);ctx.stroke();
  if(st.ko){for(let i=0;i<3;i++){const a=T*3+i*2.1;txt('★',H.x+Math.cos(a)*26,H.y-38+Math.sin(a)*8,14,'#ffe28a','center');}}
  if(st.hit){ctx.globalAlpha=.35;ell(H.x,H.y,34,24,'#fff');ctx.globalAlpha=1;}}
function nsDraw(){if(!nsIn(cam.x,cam.y,6))return;
  for(const w of NS.waves){ctx.strokeStyle=`rgba(225,250,255,${Math.max(0,.8-w.r/700)})`;ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(w.x,w.y,w.r,w.r*.55,0,0,TAU);ctx.stroke();}
  if(nsDown()){const x=G.nsX!=null?G.nsX:NSZ.x,y=G.nsY!=null?G.nsY:NSZ.y;NS.x=x;NS.y=y;NS.sub=.35;NS.act=null;nsArt(x,y,1,.35,{});
    const T=G.t;for(let i=0;i<3;i++){const k=(T*.6+i/3)%1;txt('z',x+70+k*40,y-90-k*60,12+k*10,`rgba(255,255,255,${1-k})`,'center');}
    if(Math.hypot(x-D.x,y-D.y)<380&&!(G.nsHintT>G.t)){G.nsHintT=G.t+7;float(x,y-160,'Nessie is having a nap. Shh!','#a8ffb8');}return;}
  if(!NS.on)return;const A=NS.act;nsArt(NS.x,NS.y,NS.face,NS.sub,{tele:A&&A.ph==='tele',bite:A&&A.k==='lunge'&&A.ph==='hit',tail:A&&A.k==='tail',ko:NS.koT>0,hit:G.t-NS.hitT<.12});G.nsDrawn=G.fc;}
// QUEUE 97: the loch is ONE soft radial gradient (dark heart fading to clear at the rim, no rings or hard edges) on every graphics setting
function nsLochPaint(){ctx.save();ctx.translate(NSZ.x,NSZ.y);ctx.scale(1,NSZ.ry/NSZ.rx);const R=NSZ.rx*1.25,g=ctx.createRadialGradient(0,0,0,0,0,R);
  g.addColorStop(0,'rgba(6,26,40,.5)');g.addColorStop(.45,'rgba(8,32,50,.4)');g.addColorStop(.75,'rgba(10,40,60,.18)');g.addColorStop(1,'rgba(10,40,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.restore();}
// loch patch (darker, deeper water) + rocks/ice + mermaids drawn on the ground layer
{const _df=drawFlora;drawFlora=function(x0,y0,x1,y1){const r=_df.apply(this,arguments);try{
  if(NSZ.x+NSZ.rx*1.2>x0&&NSZ.x-NSZ.rx*1.2<x1&&NSZ.y+NSZ.ry*1.2>y0&&NSZ.y-NSZ.ry*1.2<y1){nsLochPaint();
    if(NS.on&&NS.sub>.5&&!nsDown()){ctx.globalAlpha=.35*(NS.sub);ell(NS.x,NS.y,110,34,'#123a2a');ell(NS.x+NS.face*120,NS.y-6,30,14,'#123a2a');ctx.globalAlpha=1;}}
  for(const s of mmSpots())if(s.x>x0-150&&s.x<x1+150&&s.y>y0-100&&s.y<y1+100){if(s.k==='rock')mmRock(s);else if(s.k==='ice')mmIce(s);}
  for(const m of MM.list)if(!m.dead)mmDraw(m);}catch(e){if(!MM.err){MM.err=String(e);}}return r;};}
{const _f=nrDrawFx;nrDrawFx=function(){const r=_f.apply(this,arguments);try{if(!SP47.done.ns)nsDraw();}catch(e){if(!NS.err)NS.err=String(e);}SP47.ok=-1;return r;};}
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!NS.on||nsDown()||!NS.maxHp||NS.sub>.9&&!(G.t-NS.lastD<6))return;if(!nsIn(D.x,D.y,2.2)&&!(G.t-NS.lastD<6))return;
  const S=hudSlot('nessie',Math.min(384,VW*.55+4),16),w=S.w-4,x=S.x+2,y=S.y+2,lab=`🦕 Nessie · ${Math.ceil(NS.hp)}/${NS.maxHp}`;
  rect(x-2,y-2,w+4,16,'rgba(0,0,0,.6)');rect(x,y,w*Math.max(0,NS.hp)/NS.maxHp,12,'#4fae6a');txt(lab,S.cx,y+10,hudFit(lab,S.w-6,11),'#fff','center');G.nsBar=G.fc;G.nsBarW=w;};}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{if(big){const s=mmw/(WX1-WX0),px=mmx+(NSZ.x-WX0)*s,py=mmy+(NSZ.y-WY0)*s;ell(px,py,4,4,nsDown()?'#88aa88':'#4fae6a');txt(nsDown()?'🦕 Nessie (napping)':'🦕 Nessie',px+7,py+4,10,'#d8ffd0','left');}}catch(e){}return r;};}
{const _nl=nextLevel;nextLevel=function(){const k={nsDown:G.nsDown,nsWins:G.nsWins,nsHp:G.nsHp,nsX:G.nsX,nsY:G.nsY,nsHpGain:G.nsHpGain,nsSeen:G.nsSeen};const r=_nl.apply(this,arguments);Object.assign(G,k);NS.on=false;NS.act=null;return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);NS.on=false;NS.act=null;NS.koT=0;NS.waves=[];MM.list=[];for(const s of MM.spots||[]){s.who=null;s.rt=0;}return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);NS.on=false;NS.act=null;NS.koT=0;NS.waves=[];MM.list=[];for(const s of MM.spots||[]){s.who=null;s.rt=0;}return r;};}
// ---- 47. set pieces depth-sorted with the low dragon (it used to vanish under the Hydra temple)
// the temple floor/pool is ground; pillars, Hydra, a grounded/dizzy griffin, Nessie and dizzy units that stand BEHIND the dragon are drawn just before it, the rest after it as before
function sp47Pre(){const dy=D.y+10,dn=SP47.done;
  if(mdVis()){if(!dn.mdP&&mdBackY()<=dy){dn.mdP=1;mdTempleBack();}const hy=HYD.on?HYD.y:MDL.y;if(!dn.hy&&hy<=dy){dn.hy=1;mdHyDraw();}}
  const gy=grDown()?G.grY:GR.y;if(!dn.gr&&gy!=null&&(grDown()||(GR.on&&GR.alt<.5))&&gy<=dy){dn.gr=1;grDraw();}
  if(!dn.ns&&(NS.on||nsDown())){const ny=nsDown()?(G.nsY!=null?G.nsY:NSZ.y):NS.y;if(ny<=dy){dn.ns=1;nsDraw();}}
  koDraw(k=>k.u.y<=dy);
  for(const k of NR_KO)if(k.u.y<=dy&&Math.abs(k.u.x-cam.x)<VW/cam.z/2+200&&Math.abs(k.u.y-cam.y)<VH/cam.z/2+300){k._sp=SP47.r;nrDrawU(k.u,k.t+.001);}}
{const _df=drawFlora;drawFlora=function(){const r=_df.apply(this,arguments);if(scene==='play'&&G){SP47.r++;SP47.done={};SP47.ok=SP47.r;try{if(mdVis())mdTempleBase();}catch(e){if(!SP47.err)SP47.err=String(e);}}return r;};}
{const _dd=drawDragon;drawDragon=function(){if(scene==='play'&&G&&D.alt<.15&&SP47.ok===SP47.r){SP47.ok=-1;try{sp47Pre();}catch(e){if(!SP47.err)SP47.err=String(e);}}return _dd.apply(this,arguments);};}
// ---- 45. phone-landscape HUD: the region banner and the big announcement banner are drawn LAST, as the bottom slot of the HUD centre lane (part6 hudSlot), so it never covers a bar ----
const HUD_BANNER_LAST=1;
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);ctx.setTransform(DPR,0,0,DPR,0,0);drawRegionBanner();if(!G.over&&!G.won&&!paused)drawAnnounce(VW<760);else UI.banner=null;};}
// ======================= items 58-59: the sand worm hunts ANY landed dragon in open desert, but never leaves the sand =======================
// 58: land anywhere in the desert away from Sandhaven (and the other towns) and the oasis, and after ~1 s on the ground the worm tunnels over
//     from wherever it is: a rumble + shake + "the sand is moving" warning and ripples racing toward you (~5 s of fair warning) before it
//     bursts up under you. This repeats every time until the worm is DEFEATED (eaten or beaten); then it STAYS BEATEN until the dragon is
//     lost (like the Wizard/Hydra/Griffin/Nessie): no more respawns, kept across castle levels and saves, back on death / new game.
// 60: the desert road between Sandhaven and the castle is safe too (like Sandhaven and the oasis).
// 59: the worm is confined to the desert: it never moves off the sand, and once the dragon is off the sand it loses the scent, cannot bite,
//     and an above-ground worm sinks back into the dunes.
const WRM={land:.9,tunnel:280,far:340,road:140,upT:2.5,hpMul:1.8,chase:140};
// 60: the desert road from Sandhaven to the king's castle (the caravan road) is a safe zone too: within WRM.road px of it
let WRM_ROAD=null;function wormRoadD(x,y){if(!WRM_ROAD||WRM_ROAD.lvl!==G.lvl||WRM_ROAD.g!==G){try{WRM_ROAD={P:rcPath(),lvl:G.lvl,g:G};}catch(e){return 1e9;}}
  const P=WRM_ROAD.P;let b=1e9;for(let i=0;i<P.length-1;i++){const a=P[i],c=P[i+1],vx=c.x-a.x,vy=c.y-a.y,L=vx*vx+vy*vy||1,t=clamp(((x-a.x)*vx+(y-a.y)*vy)/L,0,1);b=Math.min(b,Math.hypot(x-a.x-vx*t,y-a.y-vy*t));}return b;}
{const _ws=wormSafe;wormSafe=function(x,y){return _ws(x,y)||(!inDesert(x,y)?'out':null)||(wormRoadD(x,y)<WRM.road?'road':null);};}
function wormBeat(u){if(G.wormDown)return;G.wormDown=1;G.wormWins=(G.wormWins||0)+1;
  float(u.x,u.y-140,'The sand worm is beaten! The dunes are quiet now.','#7aff8a');if(typeof showToast==='function')showToast('🪱 Sand worm beaten! It comes back at the next castle level');}
{const _h=hurtUnit;hurtUnit=function(u){const w=u&&u.species==='sandworm'&&!u.dead;const r=_h.apply(this,arguments);if(w&&(u.dead||u.hp<=0))wormBeat(u);return r;};}
{const _e=eatUnit;eatUnit=function(u){const w=u&&u.species==='sandworm'&&!u.dead;const r=_e.apply(this,arguments);if(w&&u.dead)wormBeat(u);return r;};}
{const _s=spawnWorm;spawnWorm=function(){if(G.wormDown)return null;return _s.apply(this,arguments);};}
// until it is beaten there is always a worm (no 150 s gap, also right after loading a save)
{const _d=updDesert;updDesert=function(dt){if(G&&!G.wormDown)G.wormFirst=0;return _d.apply(this,arguments);};}
{const _nl=nextLevel;nextLevel=function(){const k={wormDown:G.wormDown,wormWins:G.wormWins};const r=_nl.apply(this,arguments);Object.assign(G,k);return r;};}
function wormOpen(){return D.alt<.4&&!G.over&&!G.won&&inDesert(D.x,D.y)&&!wormSafe(D.x,D.y);}
function wormTunnel(u){const a0=Math.atan2(u.y-D.y,u.x-D.x);for(let i=0;i<16;i++){const a=a0+(i%2?1:-1)*Math.ceil(i/2)*.4;for(const r of[WRM.tunnel,330,220]){const x=D.x+Math.cos(a)*r,y=D.y+Math.sin(a)*r;
    if(ZONES.desert.ok(x,y)&&inDesert(x,y)&&!wormSafe(x,y)){u.x=x;u.y=y;u.tgt=null;u.hPrey=null;u.cd=Math.max(u.cd,1);G.wormTunnel=(G.wormTunnel||0)+1;return true;}}}return false;}
{const _uw=updWorm;updWorm=function(u,dt){
  if(u.ws==='under'&&wormOpen()){G.wrmLand=(G.wrmLand||0)+dt;
    if(G.wrmLand>=WRM.land&&dist(u,D)>WRM.far&&(!u.tunT||G.t-u.tunT>3)&&wormTunnel(u)){u.tunT=G.t;}
    const dd=dist(u,D);if(dd<750){if(!u.rumT||G.t-u.rumT>8){u.rumT=G.t;G.wormRumble=(G.wormRumble||0)+1;float(D.x,D.y-140,'Rumble… rumble… something big is under the sand!','#ffd090');
        if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play('worm',u.x,u.y,.35);}catch(e){}}G.shake=Math.max(G.shake,dd<300?3:1.5);}}
  else if(D.alt>=.4||!inDesert(D.x,D.y))G.wrmLand=0;
  // off the sand (or in a safe zone): an above-ground worm stops and sinks back down
  if(u.ws==='up'&&wormSafe(D.x,D.y)){u.stuck=false;u.upT=Math.min(u.upT,.25);G.wormSink=(G.wormSink||0)+1;}
  const ox=u.x,oy=u.y;const r=_uw.apply(this,arguments);if(!u.dead&&!inDesert(u.x,u.y)){u.x=ox;u.y=oy;G.wormClamp=(G.wormClamp||0)+1;}return r;};}

// (items 61-62) the worm strikes sooner (rumble ~0.6 s after landing, burst ~2-2.5 s), stays up for a shorter time (2.5 s instead of 4.5 s),
// and is 1.8x tougher (150 -> 270 hp). Lava-stunned / dazed worms keep their longer time up so you can still eat them.
{const _s=spawnWorm;spawnWorm=function(){const u=_s.apply(this,arguments);if(u&&!u.hpX){u.hpX=1;u.maxHp=Math.round(u.maxHp*WRM.hpMul);u.hp=u.maxHp;}return u;};}
{const _uw=updWorm;updWorm=function(u,dt){if(!u.hpX){u.hpX=1;const f=u.hp/u.maxHp;u.maxHp=Math.round(u.maxHp*WRM.hpMul);u.hp=Math.max(1,Math.round(u.maxHp*f));}
  const was=u.ws,dd=dist(u,D);
  // faster final run in under the sand once it is coming for a landed dragon
  if(was==='under'&&wormOpen()&&dd<750&&dd>40){const a=Math.atan2(D.y-u.y,D.x-u.x),k=Math.min(dd-40,(WRM.chase-110)*dt),nx=u.x+Math.cos(a)*k,ny=u.y+Math.sin(a)*k;if(ZONES.desert.ok(nx,ny)&&inDesert(nx,ny)){u.x=nx;u.y=ny;}}
  const pre=G.wrmLand||0;const r=_uw.apply(this,arguments);
  // a fresh landing never waits on an old cool-down (the spawn's 3 s or the 4-6 s after a dive): it is ready ~1 s after the tunnel
  if(u.ws==='under'&&pre<WRM.land&&(G.wrmLand||0)>=WRM.land&&u.cd>1.1){u.cd=1.1;G.wormCdCap=(G.wormCdCap||0)+1;}
  if(was==='under'&&u.ws==='up'&&!u.stuck&&u.upT>WRM.upT){u.upT=WRM.upT;u.bite=Math.min(u.bite,.9);G.wormUpSet=(G.wormUpSet||0)+1;}
  return r;};}
// ======================= queue 63-66: gentle per-castle-level scaling for MINI BOSSES and the two fantasy castles only =======================
// 187/188a (Oct 2026): HARD only. Mini bosses grow +15% health and +10% damage per castle level (linear, no cap): x1.6 / x1.4 at level 5, x2.5 / x2.0 at 11, x4.0 / x3.0 at 21.
// NORMAL and EASY (188a/188b): every mini boss, magic tower and wizard stays at its level-1 strength at every castle level. Mini bosses: giant squid (Kraken), giant octopus, sand worm, Nessie,
// Hydra (per head; always 3 heads now), Griffin, Cerberus, and every other dragon (wild / rival dragons). The Lumenspire (light) and Doomforge (dark)
// citadel towers scale the same way (and so do the realm's other magic towers - they belong to the same two castles' kingdoms).
// 188: the WIZARDS (Storm + Dark) count as bosses: hard +25% health / +20% spell damage per level (see the queue 188 block at the end); normal/easy 300 health (210 easy) at every level.
const LVS={hp:.15,dm:.10,cap:Infinity}; // queue 76: no level cap (guardians gdLv() and raid champions were never capped)
function lvsL(){return Math.min(LVS.cap,Math.max(1,(G&&G.lvl)||1));}
function bossHpMul(){return 1+LVS.hp*(lvsL()-1);}
function bossDmMul(){return 1+LVS.dm*(lvsL()-1);}
const LVS_SRC={squid:1,octopus:1,sandworm:1,nessie:1,hydra:1,griffin:1,cerberus:1,wdragon:1,iceturret:1,stormturret:1};
function lvsBoss(u){return !!u&&!u.dead&&(u.species==='sandworm'||u.species==='wdragon'||u.species==='cerberus'||u.kind==='squid'||(u.oc&&u.kind==='octopus'));}
function lvsApply(u){if(!u.hpB)u.hpB=u.maxHp;const m=Math.round(u.hpB*bossHpMul());if(u.maxHp!==m){const f=u.maxHp>0?Math.min(1,u.hp/u.maxHp):1;u.maxHp=m;u.hp=Math.max(1,Math.round(m*f));G.lvsApplied=(G.lvsApplied||0)+1;}}
nrHpMul=function(){return 1;};                       // 65: regular realm creatures (and pack alphas) keep their base health at every level
wzMaxHp=function(){return Math.round(300*(EASY?.7:1));}; // 64: the wizard never scales
hyHeadN=function(){return 3;};
hyHeadHp=function(){return Math.round(85*bossHpMul());};
grMaxHp=function(){return Math.round(420*bossHpMul());};
nsMaxHp=function(){return Math.round(800*bossHpMul());};
nrTurMaxHp=function(t){return Math.round(NR_TUR_K[t.kind].hp*bossHpMul());};
{const _hd=hurtDragon;hurtDragon=function(d,src){if(typeof src==='string'&&LVS_SRC[src]&&d>0){d*=bossDmMul();G.lvsDm=(G.lvsDm||0)+1;}return _hd.call(this,d,src);};}
{const _u=update;let acc=0;update=function(dt){const r=_u.apply(this,arguments);acc+=dt;if(acc>=.25&&!G.over){acc=0;
  for(const u of units)if(lvsBoss(u))lvsApply(u);for(const u of NRU)if(u.species==='cerberus'&&!u.dead)lvsApply(u);}return r;};}
{const _sw=spawnWorm;spawnWorm=function(){const u=_sw.apply(this,arguments);if(u)lvsApply(u);return u;};}
{const _mw=mkWD;mkWD=function(){const u=_mw.apply(this,arguments);if(u)lvsApply(u);return u;};}
{const _ns=nrSpawn;nrSpawn=function(sp){const u=_ns.apply(this,arguments);if(u&&sp==='cerberus')lvsApply(u);return u;};}
// ======================= queue 67-68: permanent boosts get a SMALL alert at the BOTTOM of the screen (no gameplay change) =======================
// Max health feasts (+50), mini-boss rewards, the Glutton "whale's worth" (+5), nest-egg fire and wild-dragon stamina boosts no longer use the big
// centre banner (that stays for realm / event announcements). They queue as a small dark-teal strip with a gold edge just above the bottom of the
// screen; on phones it sits left of the FIRE/BITE buttons and is a registered HUD box, so the hudlay test checks it for overlaps.
const BOOST={t:3.4,max:4};
function boostAlert(text,sub){if(!G)return;const Q=G.boostQ||(G.boostQ=[]);const last=Q[Q.length-1];
  if(last&&last.text===text&&last.age<.5){last.sub=sub;return;}if(Q.length>=BOOST.max)Q.shift();Q.push({text,sub:sub||'',age:0});G.boostN=(G.boostN||0)+1;}
function boostSwap(fn,icon){return function(){const b0=G.banner,t0=GPAD.toast,tt0=GPAD.toastT;const r=fn.apply(this,arguments);
  if(G.banner!==b0&&G.banner){const nb=G.banner;G.banner=b0;boostAlert((icon||'')+nb.text,nb.sub);}
  if(GPAD.toast!==t0&&GPAD.toast){const s=GPAD.toast;GPAD.toast=t0;GPAD.toastT=tt0;if(!(G.boostQ&&G.boostQ.length&&G.boostQ[G.boostQ.length-1].age<.1))boostAlert(s,'');}return r;};}
maxHpUp=boostSwap(maxHpUp,'❤ ');
stUp=boostSwap(stUp,'⚡ ');
mhBanner=function(text,sub){boostAlert((/^Fire/.test(text)?'🔥 ':/whale/i.test(text)?'🐋 ':'❤ ')+text,sub);};
for(const nm of['hyDefeat','grDefeat','nsDefeat']){const f=window[nm]||{hyDefeat,grDefeat,nsDefeat}[nm];const w=function(){const h0=D.maxHp,t0=GPAD.toast,tt0=GPAD.toastT;const r=f.apply(this,arguments);const gain=D.maxHp-h0;
    if(gain>0){const b=G.banner;if(b&&b.sub)b.sub=b.sub.replace(/\s*You feel tougher: \+\d+ max health \(now \d+, until you lose this dragon\)/,'');GPAD.toast=t0;GPAD.toastT=tt0;
      boostAlert(`❤ Max health +${gain}!`,`${b&&b.text?b.text.replace(/!$/,''):'Mini boss beaten'} · max health now ${D.maxHp} (until you lose this dragon)`);}return r;};
  if(nm==='hyDefeat')hyDefeat=w;else if(nm==='grDefeat')grDefeat=w;else nsDefeat=w;}
function drawBoost(){const Q=G&&G.boostQ;if(!Q||!Q.length||scene!=='play')return;const a=Q[0];
  const touch=TOUCH.on;let R=VW-8;if(touch)for(const o of HUDL.obs)R=Math.min(R,o.x-HUDL.gap-2);const L=8,h=a.sub?(touch?32:36):(touch?20:22);
  const w=Math.max(120,Math.min(touch?360:460,R-L)),x=touch?Math.max(L,Math.min((L+R)/2,VW/2)-w/2):VW/2-w/2,y=VH-h-(touch?6:58),fade=Math.min(1,a.age*6,(BOOST.t-a.age)*3);
  const ub=UI.banner;a.hold=!!(ub&&x<ub.x+ub.w&&x+w>ub.x&&y<ub.y+ub.h&&y+h>ub.y);if(a.hold){G.boostHeld=(G.boostHeld||0)+1;return;} // phone landscape: wait under a big announcement, never overlap it
  hudBox('boost',x,y,w,h);ctx.save();ctx.globalAlpha=Math.max(0,fade);ctx.fillStyle='rgba(12,48,52,.88)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#e6c34a';ctx.fillRect(x,y,3,h);ctx.fillRect(x+w-3,y,3,h);
  ctx.strokeStyle='rgba(230,195,74,.75)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  const tw=w-14;txt(a.text,x+w/2,y+(touch?14:15),hudFit(a.text,tw,touch?12:13),'#bff7c8','center');
  if(a.sub)txt(a.sub,x+w/2,y+h-(touch?5:7),hudFit(a.sub,tw,touch?10:11,false),'#e8f4f0','center',false);ctx.restore();}
{const _h=drawHUD;drawHUD=function(){const r=_h.apply(this,arguments);try{drawBoost();}catch(e){}return r;};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);const Q=G.boostQ;if(Q&&Q.length&&!Q[0].hold){Q[0].age+=dt;if(Q[0].age>=BOOST.t)Q.shift();}return r;};}
// ======================= queue 69-72: lair guardian dragons vs hoard raids =======================
// 69  While ANY guardian dragon is standing, raiding knights cannot take lair gold: they must first beat every guardian. No guardians = old rules.
// 70  After combat (no raider / soldier near the lair for GDB.calm s, raid not on the lair) guardians heal to full in ~GDB.heal s.
//     A guardian knocked out in a fight is NOT lost any more: it lies dizzy by the lair and gets back up (GDB.wake of its health, then heals) once
//     things are calm, i.e. after the raid has left. (It still vanishes, egg back in its citadel, if the player dragon dies, as before.)
// 71  Balance (castle level 1, scales with the castle level like the raid champion): see README "Lair guardians". 1 guardian beats Tier 1-5 raids
//     (hoard up to 2,999 gold), 2 guardians beat Tier 1-8 (up to 5,999 gold); bigger raids can win unless the dragon helps.
// 72  Guardians always leave their circle to meet ANY raid near the lair, breathe on it and slow it (ice: chill + splash, lightning: chains).
const GDB={hp:600,eng:1150,leash:1250,spd:190,hold:300,melee:80,arch:250,vsK:1.4,
  chD:7,spD:1.8,arD:1.6,hitCd:1,arCd:1.4,
  brD:30,cd:1,wSplash:.6,wR:80,wSlow:2.5,slow:.55,bChain:2,bCf:.65,bR:170,
  calm:4,heal:8,wake:.3};
function gdLv(){return 1+.15*(Math.max(1,(G&&G.lvl)||1)-1);}
function gdMaxHp(){return Math.round(GDB.hp*gdLv());}
function gdStanding(){return GD.filter(g=>!g.dead&&!g.down);}
function gdOrbit(g){const a=gdAng(g);return{x:LAIR.x+Math.cos(a)*GD_R,y:LAIR.y+Math.sin(a)*GD_R*.78,a};}
gdHead=function(g){if(g.hx!==undefined&&g.eng>0)return{x:g.hx,y:g.hy,a:g.dir||0};return gdOrbit(g);};
function gdHitRaider(u,d,k){if(!u||u.dead)return;G.gdDealt=(G.gdDealt||0)+d;u.gdHitT=G.t;gdHurtFoe(u,d,k);if(k==='W')u.gdSlowT=Math.max(u.gdSlowT||0,GDB.wSlow);}
gdUpd=function(dt){G.nrGdA=((G.nrGdA||0)+GD_W*dt)%TAU;const lv=gdLv(),M=gdMaxHp(),r=RAID.cur,raidOn=!!(r&&r.phase!=='warn');
  const foes=[];for(const u of units){if(!gdFoe(u))continue;if(Math.abs(u.x-LAIR.x)<GDB.eng&&Math.abs(u.y-LAIR.y)<GDB.eng&&Math.hypot(u.x-LAIR.x,u.y-LAIR.y)<GDB.eng)foes.push(u);}
  if(foes.length)G.gdFoeT=G.t;const calm=G.t-(G.gdFoeT===undefined?-99:G.gdFoeT)>GDB.calm;
  if(foes.length&&raidOn&&!r.gdT0&&foes.some(u=>u.raid===r))r.gdT0=G.t; // when the guardians first engaged this raid (for "time bought")
  for(const g of GD){if(g.maxHp!==M){g.hp=g.maxHp>0?g.hp*M/g.maxHp:M;g.maxHp=M;}g.fx&&(g.fx.t-=dt);const o=gdOrbit(g);
    if(g.hx===undefined){g.hx=o.x;g.hy=o.y;g.eng=0;}
    if(g.koT>0)g.koT=0;
    if(g.down){if(calm){g.down=false;g.hp=Math.max(g.hp,M*GDB.wake);const h=gdHead(g);float(h.x,h.y-60,g.k==='W'?'The white guardian shakes off the dizziness!':'The black guardian shakes off the dizziness!','#ffe9a0');sparkle(h.x,h.y-30,10);}
      else{G['nrGd'+g.k]=Math.max(.01,Math.round(g.hp*10)/10);continue;}}
    // pick a foe: the nearest raider/soldier to this guardian's head (both guardians naturally end up on the raid's front line)
    let tgt=null,bd=1e9;for(const u of foes){const d=Math.hypot(u.x-g.hx,u.y-g.hy);if(d<bd){bd=d;tgt=u;}}
    const ch=raidOn&&r.champ&&!r.champ.dead?r.champ:null,lead=ch&&foes.includes(ch)?ch:tgt;
    let dx,dy;if(lead){const side=g.k==='W'?-1:1,ang=Math.atan2(LAIR.y-lead.y,LAIR.x-lead.x);dx=lead.x+Math.cos(ang)*45-Math.sin(ang)*side*55;dy=lead.y+Math.sin(ang)*45+Math.cos(ang)*side*55;
      const ld=Math.hypot(dx-LAIR.x,dy-LAIR.y);if(ld>GDB.leash){dx=LAIR.x+(dx-LAIR.x)*GDB.leash/ld;dy=LAIR.y+(dy-LAIR.y)*GDB.leash/ld;}g.eng=Math.min(1,g.eng+dt*2);}
    else{dx=o.x;dy=o.y;}
    const mx=dx-g.hx,my=dy-g.hy,md=Math.hypot(mx,my),st=Math.min(md,GDB.spd*dt),hold=lead&&Math.hypot(lead.x-g.hx,lead.y-g.hy)<110; // close enough: stand and fight (no chasing in circles)
    if(md>1&&!hold){g.hx+=mx/md*st;g.hy+=my/md*st;g.dir=Math.atan2(my,mx);}
    if(!lead&&g.eng>0){if(md<20)g.eng=Math.max(0,g.eng-dt*1.5);}
    // breath
    g.cd-=dt;if(tgt&&bd<GD_RANGE&&g.cd<=0){g.cd=GDB.cd;const d=GDB.brD*lv*R(.85,1.15);g.shots=(g.shots||0)+1;g.fx={x:tgt.x,y:tgt.y,t:.35};
      if(tgt.raid){gdHitRaider(tgt,d,g.k);
        if(g.k==='W'){for(const u of foes)if(u!==tgt&&u.raid&&!u.dead&&Math.hypot(u.x-tgt.x,u.y-tgt.y)<GDB.wR)gdHitRaider(u,d*GDB.wSplash,'W');}
        else{let prev=tgt;const hit=[tgt];for(let c=0;c<GDB.bChain;c++){let nx=null,nd=GDB.bR;for(const u of foes)if(!hit.includes(u)&&u.raid&&!u.dead){const q=Math.hypot(u.x-prev.x,u.y-prev.y);if(q<nd){nd=q;nx=u;}}if(!nx)break;hit.push(nx);gdHitRaider(nx,d*GDB.bCf,'B');prev=nx;}}}
      else gdHurtFoe(tgt,g.k==='W'?6:7,g.k);}
    // non-raid soldiers bunching on the head still wear it down (old rule); raiders hit it with their own blows (raidStep below)
    let near=0;for(const u of foes)if(!u.raid&&Math.hypot(u.x-g.hx,u.y-g.hy)<120)near++;if(near){g.hp-=3*near*dt;g.hitT=G.t;}
    if(calm&&g.hp<M)g.hp=Math.min(M,g.hp+M/GDB.heal*dt);
    if(g.hp<=0){g.hp=0;g.down=true;G.gdDowns=(G.gdDowns||0)+1;float(g.hx,g.hy-50,'Dizzy!','#ffe0a0');
      if(!gdStanding().length&&raidOn&&typeof showToast==='function')showToast('💫 Your guardian dragons are dizzy: the raiders head for the hoard!');}
    G['nrGd'+g.k]=Math.max(.01,Math.round(g.hp*10)/10);}
  GD=GD.filter(g=>!g.dead);};
// bigger raids bring dragon-hunting gear (heavier lances, barbed arrows): their blows on a GUARDIAN grow x GDB.vsK per tier (not on the player dragon)
// raider gear vs guardian dragons, by raid tier: small steps up to Tier 5 (2,000-gold hoards), then dragon-hunting nets and long spears from Tier 6,
// then the King's dragonslayer kit from Tier 9 (hoards above 5,000). Past the table it keeps growing by GDB.vsK per tier.
GDB.vs=[1,1,1.1,1.25,1.4,1.6,2.8,3,3.2,8.5,9.5,10.5,11.5];
// x gdLv(): guardians and champions both grow x1.15 per castle level, so the raid-vs-guardian balance is the same at every level
function gdVs(r){const T=Math.max(1,(r&&r.tier)||1),V=GDB.vs;return (T<V.length?V[T]:V[V.length-1]*Math.pow(GDB.vsK,T-V.length+1))*gdLv();}
function gdHurt(g,d){if(!g||g.down)return;g.hp-=d;g.hitT=G.t;G.gdTaken=(G.gdTaken||0)+d;}
// raiders: once the champion comes within GDB.hold of a standing guardian (or reaches the hoard) the whole raid fights the guardians first
{const _r=raidStep;raidStep=function(u,dt){const r=u.raid;if(u.gdSlowT>0)u.gdSlowT-=dt;
  if(r&&RAID.cur===r&&r.phase==='march'&&GD.length){const st=gdStanding();
    if(!st.length){r.gdEng=false;return _r.apply(this,arguments);}
    const ch=r.champ;if(!r.gdEng&&ch&&!ch.dead){for(const g of st){const h=gdHead(g);if(Math.hypot(h.x-ch.x,h.y-ch.y)<GDB.hold){r.gdEng=true;break;}}if(!r.gdEng&&(!r.path||!r.path.length))r.gdEng=true;}
    if(r.gdEng){const arch=u.type==='archer';if(!G.over&&D.alt<DR.hitAltSword&&dist(u,D)<(arch?400:u.champ?150:230))return _r.apply(this,arguments); // the dragon itself is right here: fight it as before
      let g=null,bd=1e9;for(const q of st){const h=gdHead(q);const d=Math.hypot(h.x-u.x,h.y-u.y);if(d<bd){bd=d;g=q;}}const h=gdHead(g),reach=arch?GDB.arch:GDB.melee;
      u.gdCd=(u.gdCd===undefined?R(0,.8):u.gdCd)-dt;u.swing=Math.max(0,(u.swing||0)-dt);
      if(bd>reach){moveTo(u,h.x+R(-1,1),h.y+R(-1,1),u.champ?70:90,dt);}
      else{u.anim+=dt*4;u.face=h.x>u.x?1:-1;if(u.gdCd<=0){const m=(u.dmgM||1)*gdVs(r);if(arch){u.gdCd=GDB.arCd;gdHurt(g,GDB.arD*m*R(.85,1.15));if(typeof projs!=='undefined')u.shootT=Math.max(u.shootT||0,.5);}
        else{u.gdCd=GDB.hitCd;u.swing=.3;gdHurt(g,(u.champ?GDB.chD:GDB.spD)*m*R(.85,1.15));}}}
      return true;}}
  return _r.apply(this,arguments);};}
{const _g=raidGrab;raidGrab=function(){if(GD.length&&gdStanding().length){const r=RAID.cur;if(r)r.gdEng=true;return;}const r=RAID.cur;if(r)r.grabT=G.t;return _g.apply(this,arguments);};}
{const _m=moveTo;moveTo=function(u,tx,ty,sp,dt){if(u&&u.gdSlowT>0)arguments[3]=sp*GDB.slow;return _m.apply(this,arguments);};}
// ======================= queue 74: raid announcements are MAP-WIDE (they affect the lair) =======================
// Incoming / stolen / escaped / defeated raid banners (and their toasts) never depend on where the dragon is (unlike the
// regional north-battle and trade-ship news, which stay gated by nrWarSay/kbSay). They also get priority: if another
// banner tries to replace a raid banner during its first 2.6 s, that banner waits and shows right after the raid one.
const RAIDBN={min:2.6};
function raidBnMark(b0){if(G.banner&&G.banner!==b0){G.banner.raid=1;G.raidBn={b:G.banner,t0:G.t};G.raidBnN=(G.raidBnN||0)+1;}}
function raidBnWrap(f){return function(){const b0=G&&G.banner;const r=f.apply(this,arguments);try{raidBnMark(b0);}catch(e){}return r;};}
startRaidWarning=raidBnWrap(startRaidWarning);raidGrab=raidBnWrap(raidGrab);raidEscaped=raidBnWrap(raidEscaped);raidChampDown=raidBnWrap(raidChampDown);
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{if(scene==='play'&&G){const rb=G.raidBn;
  if(rb){if(G.banner!==rb.b){if(G.t-rb.t0<RAIDBN.min&&rb.b.t>0){if(G.banner&&!G.banner.raid)G.bnHeld=G.banner;G.banner=rb.b;G.raidBnKept=(G.raidBnKept||0)+1;}else G.raidBn=null;}
    else if(!(rb.b.t>0))G.raidBn=null;}
  if(!G.raidBn&&G.bnHeld&&!G.banner){G.banner=G.bnHeld;G.bnHeld=null;}}}catch(e){}return r;};}
// ======================= queue 75: defeated raiding knights drop their purse of gold on the ground =======================
// Every raiding knight (champion, spearmen, archers) carries a purse that scales with the raid tier: spear/archer 5+5*Tier, champion 20+10*Tier
// (Tier 1: 10 / 30, Tier 5: 30 / 70, Tier 8: 45 / 100, Tier 12: 65 / 140), plus anything it picked up on the way. When it is defeated (by the
// dragon, fire, a stomp, a gulp or the lair guardians) the purse drops as a gold sack on the ground. It never vanishes. ONLY the player dragon
// collects it (land / fly low next to it, like coins); guardians and other creatures can't. Sacks left lying there are scooped up by LATER
// raiding knights that pass within 90 px, who carry them as loot (and drop them again if they fall). A champion who escapes takes his purse home.
// Sacks are kept in saves (G.rgS) and on new castle levels; a new game clears them.
const RG={esc:[5,5],champ:[20,10],grab:60,alt:.55,pass:90,merge:36,max:40};
let RGOLD=[];
function rgPurse(T,champ){T=Math.max(1,T||1);const k=champ?RG.champ:RG.esc;return k[0]+k[1]*T;}
function rgAdd(x,y,n){if(!(n>0))return null;for(const p of RGOLD)if(Math.abs(p.x-x)<RG.merge&&Math.abs(p.y-y)<RG.merge){p.amt+=n;return p;}
  if(RGOLD.length>=RG.max){const q=RGOLD.reduce((a,b)=>a.amt<=b.amt?a:b);q.amt+=n;return q;}const p={x:Math.round(x),y:Math.round(y),amt:n,t0:G.t,ph:R(0,6)};RGOLD.push(p);return p;}
function rgDrop(u){if(!u||u.rgDone||!u.rgT||u.gone)return;u.rgDone=true;const n=rgPurse(u.rgT,u.champ)+(u.rgP||0);u.rgP=0;rgAdd(u.x+R(-8,8),u.y+R(-4,6),n);
  G.rgDropped=(G.rgDropped||0)+n;sparkle(u.x,u.y,6);float(u.x,u.y-(u.champ?100:40),`💰 ${n} gold dropped`,'#ffd84a');}
{const _s=spawnRaid;spawnRaid=function(){const res=_s.apply(this,arguments);const r=RAID.cur;if(r)for(const u of r.members){if(!u.rgT){u.rgT=r.tier||1;u.rgP=0;}}return res;};}
{const _h=hurtUnit;hurtUnit=function(u,d,src){const was=u&&u.dead;const res=_h.apply(this,arguments);if(u&&u.rgT&&!was&&u.dead)rgDrop(u);return res;};}
{const _e=eatUnit;eatUnit=function(u){const was=u&&u.dead;const res=_e.apply(this,arguments);if(u&&u.rgT&&!was&&u.dead)rgDrop(u);return res;};}
function rgUpd(dt){for(const u of units)if(u.rgT&&u.dead&&!u.rgDone&&!u.gone)rgDrop(u); // any other way a raider falls
  if(!RGOLD.length)return;
  // only the player's dragon collects (low, like coins); the gold goes straight into the hoard (partGA sweeps D.gold)
  if(D&&!D.dead&&D.alt<RG.alt)for(let i=RGOLD.length-1;i>=0;i--){const p=RGOLD[i];if(G.t-p.t0<.3)continue;if(d2(p.x,p.y,D.x,D.y)<RG.grab){RGOLD.splice(i,1);D.gold=(D.gold||0)+p.amt;
    G.rgGot=(G.rgGot||0)+p.amt;float(p.x,p.y-30,`+${p.amt} raid gold → hoard`,'#ffe070');sparkle(p.x,p.y,8);if(typeof SFX!=='undefined')SFX.play('coin',p.x,p.y,.7);}}
  // later raiding knights pick up sacks they pass by
  const r=RAID.cur;if(r&&r.phase!=='warn')for(const u of r.members){if(u.dead||u.gone||u.raid!==r)continue;
    for(let i=RGOLD.length-1;i>=0;i--){const p=RGOLD[i];if(Math.abs(p.x-u.x)<RG.pass&&Math.abs(p.y-u.y)<RG.pass&&d2(p.x,p.y,u.x,u.y)<RG.pass){RGOLD.splice(i,1);u.rgP=(u.rgP||0)+p.amt;
      G.rgStolen=(G.rgStolen||0)+p.amt;float(u.x,u.y-50,`${u.champ?r.short:'A raider'} scoops up ${p.amt} gold!`,'#ff9a5a');if(typeof SFX!=='undefined')SFX.play('clink');}}}}
{const _u=updParts;updParts=function(dt){const res=_u.apply(this,arguments);if(scene==='play'&&G&&!G.over)rgUpd(dt);return res;};}
function drawRgSack(p){const sc=p.amt>=150?1.9:p.amt>=60?1.6:1.35;ctx.save();ctx.translate(p.x,p.y);ctx.scale(sc,sc);rgSackBody(p);ctx.restore();
  if(D&&d2(p.x,p.y,D.x,D.y)<560)txt(`💰 ${p.amt}g`,p.x,p.y-20*sc-4,12,'#ffe070','center',true);}
function rgSackBody(p){const x=0,y=0,b=Math.sin(G.t*3+p.ph)*.6,big=p.amt>=60;ell(x,y+3,big?15:12,5,'rgba(0,0,0,.3)');
  for(let i=0;i<5;i++){const a=i*1.3+p.ph;ell(x+Math.cos(a)*(big?11:9),y+2+Math.sin(a)*3,3.4,1.8,i%2?'#e0a820':'#ffd84a');}
  ell(x,y-4+b,big?8:6.5,big?8:6.5,'#a07a3a');ell(x,y-10+b,big?3.6:3,1.6,'#7a5a28');line(x-3,y-11+b,x+3,y-11+b,'#c9a43a',1.4);
  ctx.fillStyle='#ffd23a';ctx.fillRect(x-1.5,y-5+b,3,3);if(Math.sin(G.t*4+p.ph)>.85)ell(x+4,y-8+b,1.5,1.5,'#fff');
}
{const _dc=drawCoins;drawCoins=function(){const res=_dc.apply(this,arguments);for(const p of RGOLD)drawRgSack(p);return res;};}
// a raider carrying picked-up gold shows a little sack on its belt
{const _dk=drawKnight;drawKnight=function(u){const res=_dk.apply(this,arguments);if(u.rgP>0&&!u.dead){ell(u.x+(u.face||1)*-7,u.y-6,3.6,3.2,'#a07a3a');ctx.fillStyle='#ffd23a';ctx.fillRect(u.x+(u.face||1)*-7-1,u.y-6.5,2,2);}return res;};}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const res=_m.apply(this,arguments);try{if(RGOLD.length){const s=mmw/(WX1-WX0);ctx.fillStyle='#ffe070';
  for(const p of RGOLD)ctx.fillRect(mmx+(p.x-WX0)*s-(big?2:1),mmy+(p.y-WY0)*s-(big?2:1),big?4:2,big?4:2);}}catch(e){}return res;};}
{const _ng=newGame;newGame=function(){const res=_ng.apply(this,arguments);RGOLD=[];return res;};}
{const _ss=svSnapshot;svSnapshot=function(){G.rgS=[];for(const p of RGOLD)G.rgS.push(p.x,p.y,p.amt);return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const res=_sa.apply(this,arguments);RGOLD=[];const S=d&&d.G&&d.G.rgS;if(Array.isArray(S))for(let i=0;i+2<S.length;i+=3)if(S[i+2]>0)RGOLD.push({x:S[i],y:S[i+1],amt:S[i+2],t0:-9,ph:R(0,6)});return res;};}

// ======================= queue 78: an ALPHA GUARDIAN HIPPO at each savanna watering hole =======================
// One big cartoony alpha hippo wallows in each watering hole (WHOLES). Territorial: if the dragon comes close on the ground or flying low,
// it surfaces with a huge yawn and charges, chomping (-7 every 2 s), then wades back home once the dragon leaves or flies high.
// It never fights the crocodiles and the crocs never hunt it (it is on no predator's menu, and it only ever targets the dragon).
// Like the other alphas, a full-health hippo shrugs off a bite (and the shove stings it); wear it below 60% first, then it can be gulped.
// Beaten or eaten: +250 points; a new alpha wades in after ~2 minutes when the dragon is away. Wild animals don't scale with castle level.
const HP_A={hp:150,bite:7,cd:2,sp:88,wade:40,warn:200,leash:300,th:.6,pts:250,back:120};
FAUNA.hippo={hp:HP_A.hp,sp:HP_A.sp,bite:HP_A.bite,aggro:0,cd:HP_A.cd,say:'Hippo CHOMP! -7',growl:'HRRUMPH!',zone:'savanna'};
HEAL.hippo=50;FOOD.hippo=70;
if(typeof HN_WHO!=='undefined')HN_WHO.hippo='The alpha hippo';
let HIPPO_T=[0,0],HIPPOS=[null,null];
function hpSpot(H){return{x:H.x+H.rx*.15,y:H.y+H.ry*.1};}
function hpSpawn(i){const H=WHOLES[i],p=hpSpot(H);const u=mkUnit('animal',p.x,p.y,{species:'hippo',wild:true,zone:'savanna',hippo:1,hole:i,alpha:1,hp:HP_A.hp,maxHp:HP_A.hp,free:true,t:R(0,3),jt:0,
  home:{x:H.x-H.rx,y:H.y-H.ry,w:H.rx*2,h:H.ry*2},face:rnd()<.5?1:-1,st:'wallow',cd:0,yawn:0,sub:1});units.push(u);return u;}
function hpInit(){HIPPO_T=[0,0];HIPPOS=[];for(let i=0;i<WHOLES.length;i++)HIPPOS[i]=hpSpawn(i);}
const hpD=(u,H)=>Math.max(0,Math.hypot((D.x-H.x)/H.rx,(D.y-H.y)/H.ry)-1)*Math.min(H.rx,H.ry); // dragon's distance past the hole's edge
function hpUpd(u,dt){const H=WHOLES[u.hole],dd=dist(u,D),low=D.alt<.4&&!G.over&&!G.won,edge=hpD(u,H);u.cd=(u.cd||0)-dt;u.yawn=Math.max(0,(u.yawn||0)-dt);u.t-=dt;
  const inHole=inWHole1(H,u.x,u.y,1);u.sub+=((inHole&&u.st!=='charge'?1:0)-u.sub)*Math.min(1,dt*3);
  if(u.burn>0||u.bolted>0){u.bolted=Math.max(0,(u.bolted||0)-dt);u.st='home';} // fire makes it splash back home
  const angry=low&&!(u.burn>0)&&(edge<HP_A.warn||(u.st==='charge'&&edge<HP_A.leash));
  if(angry){if(u.st!=='charge'){u.st='charge';u.yawn=1.2;G.hpCharges=(G.hpCharges||0)+1;if(dd<1300)float(u.x,u.y-60,'HRRUMPH! The alpha hippo guards its watering hole!','#ffd0a0');puff(u.x,u.y,6,'rgba(200,230,255,',50,4);}
    if(dd>44)moveTo(u,D.x,D.y,HP_A.sp,dt);else if(u.cd<=0){u.cd=HP_A.cd;u.yawn=.6;hurtDragon(HP_A.bite,'hippo');G.hpBites=(G.hpBites||0)+1;float(D.x+R(-20,20),D.y-90,FAUNA.hippo.say,'#ffb0a0');}
    // never leaves its territory
    const ex=Math.hypot((u.x-H.x)/H.rx,(u.y-H.y)/H.ry);const lim=1+HP_A.leash/Math.min(H.rx,H.ry);if(ex>lim){u.x=H.x+(u.x-H.x)*lim/ex;u.y=H.y+(u.y-H.y)*lim/ex;}
    return;}
  if(u.st==='charge'){u.st='home';if(dd<1300)float(u.x,u.y-50,'*grumble* The hippo wades back home','#d8e8ff');}
  if(u.st==='home'){const p=hpSpot(H);if(moveTo(u,p.x,p.y,HP_A.wade,dt)||inWHole1(H,u.x,u.y,.6))u.st='wallow';return;}
  // wallow: drift slowly around the middle of the pool, with the odd lazy yawn
  if(!u.tgt||u.t<=0){u.t=R(3,7);const a=R(0,TAU),r=R(0,.45);u.tgt={x:H.x+Math.cos(a)*H.rx*r,y:H.y+Math.sin(a)*H.ry*r};if(rnd()<.25)u.yawn=1;}
  if(moveTo(u,u.tgt.x,u.tgt.y,12,dt))u.tgt=null;u.anim=(u.anim||0)+dt*.4;}
{const _uw=updWild;updWild=function(u,dt){if(u.species==='hippo'){hpUpd(u,dt);return;}return _uw.apply(this,arguments);};updWild._base=_uw._base;}
// alpha rule: a full-health hippo can't be swallowed
TOUGH.hippo={chk:u=>u.hp>u.maxHp*HP_A.th,hit:u=>{hurtUnit(u,10,'bite');u.yawn=.8;G.hpShrug=(G.hpShrug||0)+1;float(u.x,u.y-60,'Too big! Wear the alpha hippo down below 60% first','#ffd27a');}};
function hpMgr(dt){if(!G||typeof WHOLES==='undefined')return;for(let i=0;i<WHOLES.length;i++){const u=HIPPOS[i];
    if(u&&u.dead){HIPPOS[i]=null;HIPPO_T[i]=G.t+HP_A.back;G.stats.kPts=(G.stats.kPts||0)+HP_A.pts;G.hpBeaten=(G.hpBeaten||0)+1;puff(u.x,u.y,10,'rgba(200,230,255,',70,6);
      float(u.x,u.y-70,`The alpha hippo is ${u.eaten?'gulped':'beaten'}! +${HP_A.pts}`,'#fff2c0');continue;}
    if(!u&&G.t>=HIPPO_T[i]){const H=WHOLES[i];if(Math.hypot(D.x-H.x,D.y-H.y)>900){HIPPO_T[i]=0;HIPPOS[i]=hpSpawn(i);G.hpNew=(G.hpNew||0)+1;if(Math.hypot(D.x-H.x,D.y-H.y)<1800)float(H.x,H.y-90,'A new alpha hippo wades into the watering hole!','#fff2c0');}}}}
{const _up=updParts;updParts=function(dt){const r=_up.apply(this,arguments);if(scene==='play'&&G&&!G.over)hpMgr(dt);return r;};}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);hpInit();return r;};}
if(typeof REGION_SUB!=='undefined'&&REGION_SUB.savanna)REGION_SUB.savanna=REGION_SUB.savanna.replace('around the watering hole','around the watering holes, each guarded by an alpha hippo and its pod');
// drawing: a big round lilac-grey hippo (the alpha: x1.25, with pale old scars on its back; no crown since queue 133; regular hippos: grey-brown, x1); half-submerged (eyes, ears, nostrils and back) while wallowing, fully out when it charges
function drawHippo(u){const x=u.x,y=u.y,f=u.face||1,sub=clamp(u.sub||0,0,1),bob=Math.sin(G.t*1.4+u.id)*1.5,yw=u.yawn>0?Math.sin(Math.min(1,u.yawn)*Math.PI):0,A=!!u.alpha,sc=A?1.25:1;
  const body=A?'#8f7f9a':'#8a7468',dk=A?'#6c5d78':'#665248',lt=A?'#c9b3cf':'#b39a8c',pink='#f2a6b8';
  const rp=(G.t*.5+u.id*.3)%1;ctx.strokeStyle=`rgba(220,240,255,${.5*(1-rp)*sub+.05})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x,y+3,30+26*rp,9+8*rp,0,0,TAU);ctx.stroke();
  ctx.save();ctx.translate(x,y+bob*sub);ctx.scale(sc,sc);
  if(sub<.5){ell(0,6,30,8,'rgba(0,0,0,.25)');for(const s of[-1,1])for(const k of[-14,12]){ell(k+s*3,4,5,7,dk);}}
  // body (only the back shows in the water)
  ctx.save();if(sub>=.5){ctx.beginPath();ctx.rect(-60,-60,120,58);ctx.clip();}
  ell(-f*4,-8,28,17,body);ell(-f*6,-14,20,8,lt);
  // alpha: no clothes, just natural markings (old pale battle scars across its back)
  if(A){ctx.strokeStyle='rgba(246,236,250,.9)';ctx.lineWidth=1.7;ctx.lineCap='round';ctx.beginPath();for(const[a,b,c,d]of[[-16,-21,-8,-16],[-9,-24,-1,-18],[-2,-23,5,-17]]){ctx.moveTo(f*a,b);ctx.lineTo(f*c,d);}ctx.stroke();ctx.lineWidth=1;}
  // head + muzzle (mouth opens in a big yawn)
  const hx=f*22,hy=-12;ell(hx,hy,15,13,body);
  if(yw>.05){poly([hx+f*6,hy+2,hx+f*30,hy-6-yw*14,hx+f*30,hy+12+yw*10,hx+f*6,hy+8],pink);ctx.fillStyle='#fff';for(const t of[-1,1])ctx.fillRect(hx+f*24-2,hy+(t<0?-5-yw*11:9+yw*7),4,5);}
  ell(hx+f*14,hy+3,13,10,lt);ell(hx+f*20,hy-1,2.2,1.6,dk);ell(hx+f*14,hy-1,2.2,1.6,dk);
  ctx.restore();
  // eyes + ears always visible
  ell(hx-f*2,hy-12,5,5,'#fff');ell(hx-f*1,hy-12,2.4,2.6,'#222');ell(hx-f*10,hy-15,4,5,dk);ell(hx-f*10,hy-15,2,2.5,pink);
  // (queue 133: the alpha's little gold crown was removed: real animals wear no clothes or accessories)
  ctx.restore();
  if(sub>=.5){ctx.strokeStyle='rgba(225,245,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y-2,40,7,0,0,TAU);ctx.stroke();}
  if(u.hp<u.maxHp&&!u.dead){const w=44;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(x-w/2,y-64,w,5);ctx.fillStyle=!A||u.hp>u.maxHp*HP_A.th?'#e05050':'#ffd23a';ctx.fillRect(x-w/2,y-64,w*Math.max(0,u.hp/u.maxHp),5);}
  if(A&&!u.dead&&u.hp<=u.maxHp*HP_A.th){const t=G.t*3.2;for(let i=0;i<3;i++){const a=t+i*TAU/3;hnStar(x+f*22+Math.cos(a)*16,y-58+Math.sin(a)*4,3.2,i%2?'#ffe35a':'#fff7c0');}}}
FAUNA_ART.add('hippo');
{const _df=drawFauna;drawFauna=function(u){if(u.species==='hippo'){drawHippo(u);return;}return _df.apply(this,arguments);};}
// ======================= queue 134: more hippos in the savanna water (regular hippos share each watering hole) =======================
// Each watering hole used to hold just its alpha hippo (2 hippos in all). Now HR134.per REGULAR hippos wallow beside each alpha, so every
// pond has twice the hippos (1 -> 2; 2 -> 4 overall). The alphas are unchanged. Regular hippos are a separate species ('rhippo') so none
// of the alpha rules touch them: they are smaller (x1), grey-brown with no scars, peaceful (they never bite the dragon and never fight
// the crocodiles; crocs don't hunt them either), have no "too big to swallow" rule, and don't count for Hippo Hero.
// Hurt or singed, they grunt, splash and dive to the far side of the pool. A lost one is replaced about 2 minutes later once the dragon
// is more than 900 px from that pond (checked once a second; units aren't saved, so a loaded game simply starts with a full pod).
const HR134={per:1,hp:40,sp:22,flee:55,back:120,far:900};
FAUNA.rhippo={hp:HR134.hp,sp:HR134.sp,flee:0,zone:'savanna'};HEAL.rhippo=30;FOOD.rhippo=45;
let HR_T=[],HR_CK=0;
function hrSpawn(i,k){const H=WHOLES[i],a=1.3+k*2.1+i,r=.32,x=H.x+Math.cos(a)*H.rx*r,y=H.y+Math.sin(a)*H.ry*r;
  const u=mkUnit('animal',x,y,{species:'rhippo',wild:true,zone:'savanna',hole:i,hrK:k,hp:HR134.hp,maxHp:HR134.hp,free:true,t:R(0,3),jt:0,
    home:{x:H.x-H.rx,y:H.y-H.ry,w:H.rx*2,h:H.ry*2},face:rnd()<.5?1:-1,st:'wallow',yawn:0,sub:1});units.push(u);return u;}
function hrInit(){HR_T=[];HR_CK=0;if(typeof WHOLES==='undefined')return;for(let i=0;i<WHOLES.length;i++){HR_T[i]=0;for(let k=0;k<HR134.per;k++)hrSpawn(i,k);}}
function hrUpd(u,dt){const H=WHOLES[u.hole];if(!H)return;u.t-=dt;u.yawn=Math.max(0,(u.yawn||0)-dt);u.anim=(u.anim||0)+dt*.4;
  const inHole=inWHole1(H,u.x,u.y,1);u.sub+=((inHole?1:0)-u.sub)*Math.min(1,dt*3);
  if((u.burn>0||(u.hitT&&G.t-u.hitT<.2))&&u.st!=='dive'){u.st='dive';u.yawn=.8;const a=Math.atan2(u.y-D.y,u.x-D.x);u.tgt={x:H.x+Math.cos(a)*H.rx*.5,y:H.y+Math.sin(a)*H.ry*.5};
    if(dist(u,D)<1300)float(u.x,u.y-44,'*SPLOOSH* The hippo dives away!','#d8e8ff');puff(u.x,u.y,5,'rgba(200,230,255,',40,4);}
  const sp=u.st==='dive'?HR134.flee:HR134.sp;
  if(!u.tgt||u.t<=0&&u.st!=='dive'){u.st='wallow';u.t=R(3,8);const a=R(0,TAU),r=R(.1,.55);u.tgt={x:H.x+Math.cos(a)*H.rx*r,y:H.y+Math.sin(a)*H.ry*r};if(rnd()<.2)u.yawn=1;}
  if(moveTo(u,u.tgt.x,u.tgt.y,u.st==='dive'?sp:12,dt)){u.tgt=null;u.st='wallow';}
  // never wander out of its pond
  const ex=Math.hypot((u.x-H.x)/H.rx,(u.y-H.y)/H.ry);if(ex>.85){u.x=H.x+(u.x-H.x)*.85/ex;u.y=H.y+(u.y-H.y)*.85/ex;}}
{const _uw=updWild;updWild=function(u,dt){if(u.species==='rhippo'){hrUpd(u,dt);return;}return _uw.apply(this,arguments);};updWild._base=_uw._base;}
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.species==='rhippo'&&!u.dead)u.hitT=G.t;return _hu.apply(this,arguments);};}
function hrMgr(){if(!G||typeof WHOLES==='undefined'||G.t<HR_CK)return;HR_CK=G.t+1;
  const n=WHOLES.map(()=>0);for(const u of units)if(u.species==='rhippo'&&!u.dead&&n[u.hole]!=null)n[u.hole]++;
  for(let i=0;i<WHOLES.length;i++){if(n[i]>=HR134.per){HR_T[i]=0;continue;}
    if(!HR_T[i]){HR_T[i]=G.t+HR134.back;continue;}
    const H=WHOLES[i];if(G.t>=HR_T[i]&&Math.hypot(D.x-H.x,D.y-H.y)>HR134.far){HR_T[i]=0;hrSpawn(i,n[i]);G.hrNew=(G.hrNew||0)+1;}}}
{const _up=updParts;updParts=function(dt){const r=_up.apply(this,arguments);if(scene==='play'&&G&&!G.over)hrMgr();return r;};}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);hrInit();return r;};}
FAUNA_ART.add('rhippo');
{const _df=drawFauna;drawFauna=function(u){if(u.species==='rhippo'){drawHippo(u);return;}return _df.apply(this,arguments);};}
// ======================= queue 79: wrecking the ancient jungle temple also gives a PERMANENT +10 max fire (once per game) =======================
// On top of the 100 gold. Only the first wreck in a game counts (the temple is back every level, but the flag G.jtFire carries over levels and
// is in saves). The bonus goes into D.fireBonus (same pool as the nest-egg fire), so it carries over castle levels and is saved. Small bottom alert.
const JT_FIRE=10;let JT_FCARRY=null;
{const _o=onRuin;onRuin=function(s){const r=_o.apply(this,arguments);
  if(s&&s.kind==='jtemple'&&!s._loading&&G&&!G.jtFire&&scene==='play'){G.jtFire=1;if(D.maxFire===undefined&&typeof fireInit==='function')fireInit();
    D.fireBonus=(D.fireBonus||0)+JT_FIRE;D.maxFire=wfFireMax();D.fire=Math.min(D.maxFire,(D.fire||0)+JT_FIRE);D.fireOut=false;G.jtFireN=(G.jtFireN||0)+1;
    boostAlert(`🔥 Max fire +${JT_FIRE}!`,`The ancient temple's ember power is yours · max fire now ${D.maxFire} (permanent)`);}
  return r;};}
{const _nl=nextLevel;nextLevel=function(){JT_FCARRY=G&&G.jtFire?1:0;try{return _nl.apply(this,arguments);}finally{JT_FCARRY=null;}};}
{const _ng=newGame;newGame=function(){const c=JT_FCARRY;const r=_ng.apply(this,arguments);G.jtFire=c?1:0;return r;};}

// ======================= (queue 80-89) ACHIEVEMENTS =======================
// A list of (almost) everything the player can do. Nothing is hidden: locked entries show their name, a short how-to and (when the
// thing gives an in-game reward) a reward hint whose numbers are read from the game's own constants. Unlocks are saved on this device
// (localStorage 'dr_ach_v1', separate from save slots) and a small bottom boost alert pops when one is earned.
const ACH_KEY='dr_ach_v1';
const ACH={got:{},eat:{},ev:{},fresh:true,dirty:0,list:null,t:0,primed:false};
(function(){try{const j=JSON.parse(localStorage.getItem(ACH_KEY)||'null');if(j&&typeof j==='object'){ACH.got=j.got||{};ACH.eat=j.eat||{};ACH.ev=j.ev||{};ACH.fresh=false;}}catch(e){}})();
let achSaveTm=null;
function achSave(){if(achSaveTm){clearTimeout(achSaveTm);achSaveTm=null;}try{localStorage.setItem(ACH_KEY,JSON.stringify({v:1,got:ACH.got,eat:ACH.eat,ev:ACH.ev}));}catch(e){}}
function achSoon(){if(!achSaveTm)achSaveTm=setTimeout(achSave,500);}
try{addEventListener('pagehide',achSave);}catch(e){}
function achEv(k){if(!ACH.ev[k]){ACH.ev[k]=Date.now();achSave();}ACH.dirty=1;}
const ACH_NOEAT={princess:1,king:1,shell:1};
function achAte(k){if(!k||ACH_NOEAT[k])return;ACH.eat[k]=(ACH.eat[k]||0)+1;achSoon();ACH.dirty=1;}
const achTA=k=>(TALLY&&TALLY.all&&TALLY.all[k])||0;
const achPre=p=>{let n=0;if(TALLY&&TALLY.all)for(const k in TALLY.all)if(k.startsWith(p))n+=TALLY.all[k];return n;};
const achG=k=>(G&&G[k])||0;
const achPct=()=>{try{return typeof exploredPct==='function'&&typeof FOG!=='undefined'&&FOG?exploredPct():0;}catch(e){return 0;}};
function achKeyU(u){if(typeof tfIsLeader==='function'&&tfIsLeader(u))return TF_L[u.species].key;return typeof tallyKeyU==='function'?tallyKeyU(u):u.species;}
function achAlpha(u){if(!u)return;if(typeof tfIsLeader==='function'&&tfIsLeader(u))achEv('al_'+u.species);if(u.atAlpha)achEv('alat_'+u.species);if(u.hippo)achEv('al_hippo');}
// eaten-only tracking for the region feasts (the tally counts eaten AND defeated, so it can't be used here)
// anything the tally records while one of the eat actions is running was eaten (bite button, auto-eat, birds, sea creatures, eggs)
ACH.eatD=0;
{const _t=tallyAdd;tallyAdd=function(k){if(ACH.eatD>0)achAte(k);return _t.apply(this,arguments);};}
{const _e=tryEat;tryEat=function(){ACH.eatD++;try{return _e.apply(this,arguments);}finally{ACH.eatD--;}};}
{const _e=tryEatBird;tryEatBird=function(){ACH.eatD++;try{return _e.apply(this,arguments);}finally{ACH.eatD--;}};}
{const _e=eatSea;eatSea=function(){ACH.eatD++;try{return _e.apply(this,arguments);}finally{ACH.eatD--;}};}
{const _e=eatUnit;eatUnit=function(u){const was=!u||u.dead;ACH.eatD++;let r;try{r=_e.apply(this,arguments);}finally{ACH.eatD--;}if(u&&!was&&u.dead)achAlpha(u);return r;};}
{const _h=hurtUnit;hurtUnit=function(u){const was=!u||u.dead;const r=_h.apply(this,arguments);if(u&&!was&&u.dead)achAlpha(u);return r;};}
// event hooks: guardian eggs (85), trade goods lost at sea / on land (86), the wizard (81)
{const _h=eggHatch;eggHatch=function(k){const r=_h.apply(this,arguments);achEv('egg'+k);return r;};}
{const _h=wzDefeat;wzDefeat=function(){const r=_h.apply(this,arguments);achEv('wizard');return r;};}
{const _h=hurtShip;hurtShip=function(s){const tr=s&&s.kind==='trade'&&s.state!=='sink'&&(s.w>0||s.st>0),st=s&&s.state;
  const r=_h.apply(this,arguments);if(tr&&s.state==='sink')achEv(st==='unload'?'tradeLand':'tradeSea');return r;};}
{const _w=wreckCart;wreckCart=function(c){const ld=c&&!c.wrecked&&c.trader&&(c.load||0)>0;const r=_w.apply(this,arguments);if(ld&&c.wrecked)achEv('tradeLand');return r;};}

const ACH_SEC={goal:{n:'Castle, hoard & princess',i:'🏰',c:'#ffd24a'},dragon:{n:'Dragons & dragon eggs',i:'🐉',c:'#c89aff'},boss:{n:'Bosses & legends',i:'⚔',c:'#ff9a7a'},
  alpha:{n:'Alpha guardians (first defeat)',i:'👑',c:'#ffe08a'},raid:{n:'Hoard raids & royal fleets',i:'🛡',c:'#9ad0ff'},kingdom:{n:"King William's kingdom",i:'👑',c:'#f0c070'},
  explore:{n:'Exploring the map',i:'🗺',c:'#9ae0a0'},feast:{n:'Region feasts (eat every animal type)',i:'🍖',c:'#ffb070'},first:{n:'First encounters',i:'⭐',c:'#d0d0ff'}};
function achBuild(){const L=[],A=(sec,id,name,how,ok,o)=>L.push(Object.assign({sec,id,name,how,ok},o||{}));
  const n=(f,need)=>()=>[Math.min(f(),need),need];
  // ---- goals (81: princess) ----
  A('goal','gold1','Shiny!','Carry any gold back to your lair on Dragon Peak',()=>achG('stash')>0);
  A('goal','hoard500','Treasure Hoard','Stash 500 gold in your lair',()=>achG('stash')>=500,{prog:n(()=>achG('stash'),500)});
  A('goal','hoard2000',"Dragon's Fortune",'Stash 2000 gold in your lair',()=>achG('stash')>=2000,{prog:n(()=>achG('stash'),2000)});
  A('goal','roof','Raise the Roof',"Smash the great keep's stone roof at Castle Aldric",()=>achTA('b:kroof')>0);
  A('goal','princess','Royal Guest','Grab Princess Elizabeth from the keep (she is never hurt!)',()=>(TALLY.prAll||0)>0||!!(D&&D.princess));
  A('goal','clear1','Castle Cleared','Fly Princess Elizabeth safely home to your lair',()=>achG('lvl')>=2||!!(G&&G.won),
    {rew:()=>typeof RANSOM!=='undefined'?`the king pays a ransom of ${Math.round(RANSOM.treasury*100)}% of his treasury + ${RANSOM.base} gold (+${RANSOM.perLvl} per castle level) · next castle level`:'next castle level'});
  for(const v of[3,5,10])A('goal','lvl'+v,v===3?'Rising Terror':v===5?'Dread of the Realm':'Legend of the Realm',`Reach castle level ${v}`,()=>achG('lvl')>=v,{prog:n(()=>achG('lvl'),v)});
  // ---- dragons (81, 85) ----
  A('dragon','egg1','Egg Snack','Eat a dragon egg from the wild dragon nest in the Dragon Peaks',()=>achTA('wdegg')>0,{rew:()=>`+${WDN_FIRE} max fire per egg`});
  A('dragon','egg10','Omelette Master','Eat 10 dragon eggs',()=>achTA('wdegg')>=10,{prog:n(()=>achTA('wdegg'),10),rew:()=>`+${WDN_FIRE} max fire per egg`});
  A('dragon','wd1','Dragon Duel','Defeat a wild dragon in the Dragon Peaks',()=>achTA('wdragon')>0,{rew:()=>`+${WD_ST} max stamina per dragon`});
  A('dragon','wd5','Dragon Champion','Defeat 5 wild dragons',()=>achTA('wdragon')>=5,{prog:n(()=>achTA('wdragon'),5),rew:()=>`+${WD_ST} max stamina per dragon`});
  A('dragon','eggW','Light Egg Hatched','Carry the white egg from the Lumenspire Citadel (light lands) to your lair',()=>!!ACH.ev.eggW,
    {rew:()=>`a white guardian dragon (${GDB.hp} health, more each castle level) that breathes ice for you`});
  A('dragon','eggB','Dark Egg Hatched','Carry the black egg from the Doomforge Citadel (dark lands) to your lair',()=>!!ACH.ev.eggB,
    {rew:()=>`a black guardian dragon (${GDB.hp} health, more each castle level) that throws lightning for you`});
  A('dragon','glut','Glutton','Eat a whale\'s worth of food (watch the Glutton bar in the pause menu)',()=>(D&&D.glutN||0)>0,{rew:()=>`+${GLUT.gain} max health per whale's worth`});
  // ---- bosses (81: wizard) ----
  A('boss','wizard','Shield Breaker',"Break the Storm Wizard's magic shield on his isle",()=>!!ACH.ev.wizard||achG('nrWzWins')>0,{rew:()=>'the barrier to the Northern Realms opens'});
  A('boss','wizEat','Wizard Snack','Gobble the dizzy wizard after breaking his shield',()=>achG('wzEatenN')>0||achTA('wizard')>0);
  A('boss','hydra','Hydra Hunter','Defeat the 3-headed Hydra at its temple in the dark far west',()=>achG('hyWins')>0,{rew:()=>`+${HY_K.reward} max health`});
  A('boss','griffin','Griffin Tamer','Defeat the Griffin who roams the light lands',()=>achG('grWins')>0,{rew:()=>`+${GR_K.reward} max health`});
  A('boss','nessie','Loch Legend','Defeat Nessie in her dark loch in the northern ocean',()=>achG('nsWins')>0,{rew:()=>`+${NSK.reward} max health`});
  A('boss','squid','Calamari','Defeat the giant squid (Kraken) far out at sea',()=>achTA('squid')>0,{rew:()=>`+${MH.feast} max health when you eat it`});
  A('boss','octo','Eight Arms','Wear down a giant octopus until it is dazed, then gulp it',()=>achTA('octopus')>0,{rew:()=>`+${MH.octo} max health when you eat it`});
  A('boss','worm','Worm Wrangler','Defeat the giant sand worm in the desert',()=>achTA('sandworm')>0,{rew:()=>`+${MH.feast} max health when you eat it`});
  A('boss','medusa','Stone Cold','Defeat a Medusa in the Goblin Bogs (look away when her eyes glow)',()=>achTA('medusa')>0);
  A('boss','cerberus','Good Doggo','Defeat a three-headed Cerberus in the dark north',()=>achTA('cerberus')>0);
  A('boss','temple','Temple Wrecker','Wreck the ancient jungle temple',()=>achTA('b:jtemple')>0||achG('jtFire')>0,{rew:()=>`+${JT.gold} gold · +${JT_FIRE} max fire (once per game)`});
  // ---- alphas (89): every alpha guardian type, first defeat; they all come back after a while ----
  const ALN={lion:['Pride Leader','the male lion of a savanna pride'],wolf:['Pack Leader','a white alpha wolf in the Deepwood'],gorilla:['King of the Troop','a silverback gorilla in the jungle']};
  for(const sp in TF_L){const L=TF_L[sp],nm=ALN[sp]||[L.label,L.label.toLowerCase()];
    A('alpha','al_'+sp,nm[0],`Defeat ${nm[1]} (a new one takes over about ${TF_NEWLEADER}s after, once you fly away)`,()=>!!ACH.ev['al_'+sp]||achTA(L.key)>0,{rew:()=>`gulp him for +${L.heal} health`});}
  A('alpha','al_hippo','Hippo Hero',`Defeat an alpha hippo at a savanna watering hole (a new one wades in about ${Math.round(HP_A.back/60)} min later)`,()=>!!ACH.ev.al_hippo||achG('hpBeaten')>0,{rew:()=>`+${HP_A.pts} points`});
  for(const sp in AT){const a=AT[sp];A('alpha','alat_'+sp,sp==='troll'?'Troll Toppler':'Glade Guardian',`Defeat ${a.who.replace(/^The /,'the ')} at a ${a.n.toLowerCase()} (a new one arrives about ${AT_NEW}s later)`,()=>!!ACH.ev['alat_'+sp]);}
  // ---- raids ----
  A('raid','champ1','Hoard Defender','Beat a brave knight who comes to raid your hoard',()=>achPre('champ:')>0,{rew:()=>`he drops a sack of ${rgPurse(1,true)}+ gold (more each castle level)`});
  A('raid','champ5','Dragon Keeper','Beat 5 hoard-raiding champions',()=>achPre('champ:')>=5,{prog:n(()=>achPre('champ:'),5),rew:()=>`a sack of ${rgPurse(1,true)}+ gold each`});
  A('raid','sack','Finders Keepers','Pick up a gold sack dropped by a raiding knight',()=>achG('rgGot')>0||!!ACH.ev.sack);
  A('raid','prince','Fleet Breaker',"Stop a prince's royal war fleet",()=>achPre('prince:')>0);
  A('raid','warship','Admiral Snack','Sink a royal warship',()=>achTA('ship:warship')>0);
  // ---- kingdom (86, 87) ----
  A('kingdom','tradeSea','Stormy Waters','Sink a loaded trade ship at sea before it reaches the King\'s Quay',()=>!!ACH.ev.tradeSea,{rew:()=>`the king loses the cargo · no new order for ${KB.cool}s`});
  A('kingdom','tradeLand','Dockside Ambush','Stop the goods on land: sink the trade ship at the quay or smash the cart unloading on shore',()=>!!ACH.ev.tradeLand,{rew:()=>`the king loses the cargo · no new order for ${KB.cool}s`});
  A('kingdom','caravan','Caravan Raider',"Destroy Sandhaven's rich camel caravan in the desert",()=>achTA('richcaravan')>0,{rew:()=>`+${RCV.gold} gold`});
  A('kingdom','gate','Gatecrasher','Break the castle gate',()=>achTA('b:gate')>0);
  A('kingdom','barracks','Barracks Buster','Wreck the castle barracks',()=>achTA('b:barracks')>0);
  A('kingdom','towers','Tower Toppler','Topple 3 castle or archer towers',()=>achTA('b:ctower')+achTA('b:wtower')+achTA('b:stower')>=3,{prog:n(()=>achTA('b:ctower')+achTA('b:wtower')+achTA('b:stower'),3)});
  A('kingdom','lighthouse','Lights Out','Knock down the lighthouse',()=>achTA('b:lighthouse')>0);
  A('kingdom','catapult','Siege Breaker','Wreck a catapult',()=>achTA('siege:catapult')>0);
  A('kingdom','taxman','Tax Holiday','Stop a royal tax collector',()=>achTA('taxman')>0);
  A('kingdom','knight','Shiny Snack','Defeat a knight',()=>achTA('knight')>0);
  A('kingdom','army50','Army Scatterer',"Defeat 50 of King William's soldiers",()=>achSect('army')>=50,{prog:n(()=>achSect('army'),50)});
  A('kingdom','crops','Crop Toaster','Burn 10 crop fields',()=>achTA('crop')>=10,{prog:n(()=>achTA('crop'),10)});
  A('kingdom','trees','Lumber Jack','Knock down or burn 25 trees',()=>achTA('tree')>=25,{prog:n(()=>achTA('tree'),25)});
  A('kingdom','carts','Highway Robbery','Wreck 5 carts on the roads',()=>achTA('cart')+achTA('supplycart')+achTA('tradecart')>=5,{prog:n(()=>achTA('cart')+achTA('supplycart')+achTA('tradecart'),5)});
  // ---- exploring (82): 100% is reachable by flying everywhere ----
  for(const v of[25,50,75,100])A('explore','ex'+v,v===100?'Cartographer':v===50?'Halfway There':v===25?'Scout':'Wide Wings',`Explore ${v}% of the map (the minimap fog clears as you fly)`,()=>achPct()>=v,{prog:n(achPct,v),unit:'%'});
  A('explore','regions','Grand Tour','Visit every region of the world',()=>achRegMiss().length===0,{prog:()=>{const k=Object.keys(REGION_NAMES);return[k.length-achRegMiss().length,k.length];},
    miss:()=>achRegMiss().map(k=>REGION_NAMES[k]).join(', ')});
  // ---- region feasts (88): eaten only; never princess or king; alphas have their own achievements ----
  const alK={};for(const sp in TF_L)alK[TF_L[sp].key]=1;
  const FN={farm:['Farmyard Feast','Farmlands'],forest:['Deepwood Feast','the Deepwood'],water:['Lake & River Feast','the lake & rivers'],mount:['Mountain Feast','the hills & mountains'],
    coast:['Seaside Feast','the coast & sea'],desert:['Desert Feast','the desert'],savanna:['Savanna Feast','the savanna'],jungle:['Jungle Feast','the jungle']};
  for(const s of TALLY_SECT){if(!/^Animals · /.test(s.name)||!FN[s.id]||s.id==='drpeaks')continue;const f=FN[s.id];const keys=s.keys.filter(k=>!ACH_NOEAT[k[0]]&&!alK[k[0]]);
    const miss=()=>keys.filter(k=>!(ACH.eat[k[0]]>0)).map(k=>k[1]);
    A('feast','feast_'+s.id,f[0],`Eat at least one of every animal type in ${f[1]}`,()=>miss().length===0,{prog:()=>[keys.length-miss().length,keys.length],miss:()=>miss().join(', ')});}
  // ---- first encounters (one per tally group) ----
  for(const s of TALLY_SECT){if(/^Animals · /.test(s.name)||!s.keys.length||['champ','prince','other'].includes(s.id))continue;const ks=s.keys.map(k=>k[0]);
    const lab=s.name.replace(/^[^·]*· /,'');let fid='first_'+s.id;while(L.some(d=>d.id===fid))fid+='_';const verb=s.id==='build'?'Destroy':s.id==='boats'?'Sink or wreck':'Gobble or defeat';A('first',fid,`First of: ${lab}`,`${verb} any of: ${s.keys.slice(0,5).map(k=>k[1].toLowerCase()).join(', ')}${s.keys.length>5?'…':''}`,()=>ks.some(k=>achTA(k)>0));}
  return L;}
function achSect(id){const s=TALLY_SECT.find(s=>s.id===id);if(!s)return 0;let n=0;for(const k of s.keys)n+=achTA(k[0]);return n;}
function achRegMiss(){const v=(G&&G.visited)||{};return Object.keys(REGION_NAMES).filter(k=>!v[k]);}
function achList(){return ACH.list||(ACH.list=achBuild());}
function achCount(){const L=achList();return[L.filter(d=>ACH.got[d.id]).length,L.length];}
function achSafe(f){try{return f();}catch(e){return null;}}
function achCheck(silent){const L=achList(),nw=[];for(const d of L)if(!ACH.got[d.id]&&achSafe(d.ok)){ACH.got[d.id]=Date.now();nw.push(d);}
  if(nw.length){achSave();if(!silent){const sh=nw.length>3?nw.slice(0,2):nw;for(const d of sh){const rw=d.rew&&achSafe(d.rew);boostAlert(`🏆 ${d.name}`,rw?`Achievement unlocked · 🎁 ${rw}`:`Achievement unlocked · ${d.how}`);}
    if(nw.length>3)boostAlert(`🏆 +${nw.length-2} more achievements!`,'See them all in the pause menu → Achievements');}}
  return nw;}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!G.over&&!paused){ACH.t-=dt;if(ACH.t<=0||ACH.dirty){ACH.t=.5;ACH.dirty=0;
    if(!ACH.primed){ACH.primed=true;if(ACH.fresh){achCheck(true);ACH.fresh=false;achSave();}}achCheck(false);}}return r;};}
function achTitleRow(){const[c,n]=achCount();return`🏆  Achievements (${c} of ${n})`;}

// ---- the list screen (pause menu row + title row) ----
let ACH_F=0;const ACH_FN=['All','Locked','Unlocked'];
function achRows(){const R=[];let last=null;for(const d of achList()){const g=!!ACH.got[d.id];if(ACH_F===1&&g||ACH_F===2&&!g)continue;if(d.sec!==last){last=d.sec;R.push({h:1,s:ACH_SEC[d.sec]});}R.push({d,g});}return R;}
function achLines(d){const out=[];const rw=d.rew&&achSafe(d.rew);if(rw)out.push(['rew','🎁 Reward: '+rw]);const m=d.miss&&achSafe(d.miss);if(m){const full=(d.sec==='explore'?'Not visited yet: ':'Still to eat: ')+m;
    // long lists wrap onto up to 3 lines instead of being cut off
    ctx.save();ctx.font=`${ACH_WRAP.fs}px Georgia`;const parts=full.split(', '),W=ACH_WRAP.tw-4,fit=t=>ctx.measureText(t).width<=W;let i=0;
    for(let ln=0;ln<3&&i<parts.length;ln++){let cur=parts[i++];
      while(i<parts.length){const left=parts.length-i-1,nx=cur+', '+parts[i];const tail=ln===2&&left>0?`, … +${left} more`:',';if(!fit(nx+tail))break;cur=nx;i++;}
      const left=parts.length-i;out.push(['miss',cur+(left?(ln===2?`, … +${left} more`:','):'')]);}
    ctx.restore();}return out;}
const ACH_WRAP={tw:600,fs:12.5};
function achRowH(r,touch){const lh=touch?17:15;return r.h?(touch?28:24):(touch?22:20)+lh*(1+achLines(r.d).length)+8;}
function achFitTxt(s,x,y,maxW,size,col,bold){let fs=hudFit(s,maxW,size,bold);if(fs<9.5)fs=9.5;ctx.font=`${bold===false?'':'bold '}${fs}px Georgia`;if(ctx.measureText(s).width>maxW){while(s.length>6&&ctx.measureText(s+'…').width>maxW)s=s.slice(0,-1);s+='…';}txt(s,x,y,fs,col,'left',bold);}
function achMaxScroll(rows,hs,listH){let s=rows.length,sum=0;while(s>0&&sum+hs[s-1]<=listH){sum+=hs[s-1];s--;}return Math.min(s,rows.length-1<0?0:rows.length-1);}
function drawAchScreen(x0,W,S,ah,touch){const cx=x0+W/2,y0=S.t+8,H=ah-16;panel(x0,y0,W,H);ctx.fillStyle='rgba(30,18,8,.6)';ctx.fillRect(x0+1,y0+1,W-2,H-2);
  const sm=W<520,[c,n]=achCount();txt('🏆  ACHIEVEMENTS',cx,y0+(sm?26:30),sm?19:24,'#ffd24a','center');
  txt(`${c} of ${n} unlocked · saved on this device · showing: ${ACH_FN[ACH_F]}`,cx,y0+(sm?44:50),sm?11:13,'#fff','center',false);
  const bx=x0+24,bw=W-48,byy=y0+(sm?52:58);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(bx,byy,bw,7);ctx.fillStyle='#ffd24a';ctx.fillRect(bx,byy,bw*(n?c/n:0),7);
  ACH_WRAP.tw=W-(sm?40:50);ACH_WRAP.fs=sm?11:12.5;const top=byy+14,foot=touch?54:44,listH=H-(top-y0)-foot-(touch?0:20),rows=achRows(),hs=rows.map(r=>achRowH(r,touch)),mx=achMaxScroll(rows,hs,listH);
  PM.scroll=clamp(PM.scroll|0,0,mx);PM._achMx=mx;let vis=0,acc=0;for(let i=PM.scroll;i<rows.length&&acc+hs[i]<=listH;i++){acc+=hs[i];vis++;}PM.vis=Math.max(1,vis);PM.rh=Math.max(20,acc/Math.max(1,vis));
  PM.hit.push({x:x0,y:top,w:W,h:listH,list:1});
  ctx.save();ctx.beginPath();ctx.rect(x0+2,top,W-4,listH+1);ctx.clip();let y=top;const lh=touch?17:15,tw=W-(sm?40:50);
  for(let i=PM.scroll;i<rows.length&&y<top+listH;i++){const r=rows[i],h=hs[i];
    if(r.h){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(x0+6,y+2,W-28,h-4);ctx.fillStyle=r.s.c;ctx.fillRect(x0+6,y+2,4,h-4);txt(`${r.s.i}  ${r.s.n}`,x0+16,y+h-8,sm?12.5:14,r.s.c,'left');}
    else{const d=r.d,g=r.g;ctx.fillStyle=g?'rgba(255,215,90,.10)':'rgba(0,0,0,.18)';ctx.fillRect(x0+8,y+3,W-30,h-6);
      const pr=d.prog&&achSafe(d.prog);const right=g?'✔ unlocked':pr?`${pr[0]}${d.unit||''} / ${pr[1]}${d.unit||''}`:'locked';
      const rs=sm?11:12.5;ctx.font=`bold ${rs}px Georgia`;const rwid=ctx.measureText(right).width;txt(right,x0+W-26,y+(touch?18:16),rs,g?'#9ef09a':'#d8cfc0','right');
      achFitTxt(`${g?'🏆':'🔒'}  ${d.name}`,x0+16,y+(touch?18:16),W-60-rwid,sm?13:15,g?'#ffd24a':'#f2ece2',true);
      let ly=y+(touch?18:16)+lh;achFitTxt(d.how,x0+20,ly,tw,sm?11:12.5,g?'#e8e2d6':'#cfc8bc',false);
      for(const[k,s]of achLines(d)){ly+=lh;achFitTxt(s,x0+20,ly,tw,sm?11:12.5,k==='rew'?(g?'#ffd27a':'#e8c27a'):'#ffb0a0',false);}}
    y+=h;}
  ctx.restore();
  if(mx>0){const sx=x0+W-10,th=Math.max(24,listH*PM.vis/rows.length),ty=top+(listH-th)*(PM.scroll/mx);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(sx,top,5,listH);ctx.fillStyle='#d9a64a';ctx.fillRect(sx,ty,5,th);}
  const by=y0+H-foot+8,bh=foot-16,nb=4,gap=8,bw2=(W-24-gap*(nb-1))/nb,pg=Math.max(1,PM.vis-1);
  pmBtn(x0+12,by,bw2,bh,'▲ Up',()=>{PM.scroll=Math.max(0,PM.scroll-pg);},false);
  pmBtn(x0+12+(bw2+gap),by,bw2,bh,'▼ Down',()=>{PM.scroll=Math.min(mx,PM.scroll+pg);},false);
  pmBtn(x0+12+2*(bw2+gap),by,bw2,bh,'Show: '+ACH_FN[ACH_F],()=>{ACH_F=(ACH_F+1)%3;PM.scroll=0;},false,'#ffe08a');
  pmBtn(x0+12+3*(bw2+gap),by,bw2,bh,'◀ Back',achBack,false);
  if(!touch)txt(`↑/↓ scroll · ←/→ page · Enter / A: show All / Locked / Unlocked · Esc / B: back`,cx,by-6,11,'#aaa','center',false);}
function achBack(){if(PM.from==='title')pmClose();else{PM.scr='main';PM.sel=Math.max(0,PM_MAIN.findIndex(r=>r[1]==='ach'));}}
function achOpen(from){if(from==='title'||!PM.on)pmOpen('ach',from);else{PM.scr='ach';PM.scroll=0;}ACH_F=0;}
PM_MAIN.splice(Math.max(0,PM_MAIN.findIndex(r=>r[1]==='settings'))+1,0,['🏆  Achievements','ach']);
{const _a=pmAct;pmAct=function(a){if(a==='ach'){PM.scr='ach';PM.scroll=0;ACH_F=0;return;}return _a.apply(this,arguments);};}
{const _i=pmInput;pmInput=function(){if(PM.scr==='ach'&&!PM.confirm){const up=P('arrowup')||P('w'),dn=P('arrowdown')||P('s'),lf=P('arrowleft')||P('a'),rt=P('arrowright')||P('d'),ok=P('enter')||P(' ')||P('e'),back=P('escape')||P('p')||P('backspace');
    const mx=PM._achMx||0,pg=Math.max(1,(PM.vis||5)-1);if(up)PM.scroll--;if(dn)PM.scroll++;if(lf||P('pageup'))PM.scroll-=pg;if(rt||P('pagedown'))PM.scroll+=pg;PM.scroll=clamp(PM.scroll,0,mx);
    if(ok){ACH_F=(ACH_F+1)%3;PM.scroll=0;}else if(back)achBack();return true;}return _i.apply(this,arguments);};}
{const _b=pmBack;pmBack=function(){if(PM.scr==='ach'&&!PM.confirm)return achBack();return _b.apply(this,arguments);};}
{const _d=pmDragMove;pmDragMove=function(id,y,x){const d=PM.drag;if(PM.scr==='ach'&&d&&d.id===id&&!d.slider){PM.scroll=clamp(Math.round(d.sc-(y-d.y)/(PM.rh||40)),0,PM._achMx||0);return;}return _d.apply(this,arguments);};}
{const _d=drawPM;drawPM=function(){if(PM.scr!=='ach')return _d.apply(this,arguments);
  ctx.setTransform(DPR,0,0,DPR,0,0);const S=SAFE,touch=TOUCH.on;PM.hit=[];ctx.fillStyle='rgba(6,4,10,.66)';ctx.fillRect(0,0,VW,VH);
  const aw=VW-S.l-S.r,ah=VH-S.t-S.b,W=Math.min(aw-16,720),x0=S.l+(aw-W)/2;drawAchScreen(x0,W,S,ah,touch);};}

// ======================= queue 93: Nessie and ALL mermaids (sunbathers too) live north of the magic wind wall and stay there =======================
// mmRegion is north-only, the rocks / ice floes moved north, Nessie's loch moved to NSZ (9800,-3900). Old saves: a Nessie position (G.nsX/nsY) outside the new
// loch snaps back to its centre on load and on spawn; any mermaid that ends up south of the wall line (e.g. pushed by a slide) is quietly removed and respawns north.
function mmNorthOK(x,y){return y<nrEdge(x)-60;}
function nsFixPos(){if(G&&G.nsX!=null&&!nsIn(G.nsX,G.nsY,1)){G.nsX=NSZ.x;G.nsY=NSZ.y;G.nsMoved=(G.nsMoved||0)+1;}}
{const _i=nsInit;nsInit=function(){nsFixPos();return _i.apply(this,arguments);};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);try{nsFixPos();}catch(e){}return r;};}
{const _sp=mmSpawner;mmSpawner=function(dt){const r=_sp.apply(this,arguments);for(const m of MM.list)if(!m.dead&&!mmNorthOK(m.x,m.y)){m.dead=true;if(m.spot){m.spot.who=null;m.spot.rt=2;}mmSt('southCull');}MM.list=MM.list.filter(m=>!m.dead);return r;};}
// ======================= queue 94/95: every beaten mini boss is edible; everyone is edible EXCEPT King William, Princess Elizabeth and your own guardian dragons =======================
// Audit (see README "Everyone is on the menu"): Kraken (dazed), octopus (dazed), sand worm (surfaced), Hydra, Griffin, Wizard, Cerberus/Medusa/trolls/cyclopes (dizzy KO),
// wild dragons, alphas, princes (<30%), raid champions (<50%) were already edible once worn down. NEW: Nessie - once beaten she naps in her loch and can be gulped in one
// big cartoony GULP (food 90, +60 HP), after which she is gone until the dragon is defeated (like her beaten state). The eat puff is now a soft white cloud (no red).
// Hard safety net: King William (isKing / isKingArmor), Princess Elizabeth (princess / isPrincess) and guardian dragons (GD, never in units) can never be swallowed.
const NSE={heal:60,food:90,r:210};
function nsNoKing(u){return !!(u&&(u.isKing||u.isKingArmor||u.king||u.princess||u.isPrincess||u.gd||u.guardian));}
{const _bt=biteTargets;biteTargets=function(){const T=_bt.apply(this,arguments);if(typeof KA!=='undefined'&&KA.peek)return T;return T.filter(u=>!nsNoKing(u));};}
{const _eu=eatUnit;eatUnit=function(u){if(nsNoKing(u)){D.eatCD=Math.max(D.eatCD||0,.6);if(u.isKing||u.isKingArmor)float(u.x,u.y-60,'CLANG! The king is NOT a snack!','#ffd27a');return;}return _eu.apply(this,arguments);};}
function nsEdible(){return nsDown()&&!G.nsEaten&&scene==='play';}
function nsEat(){const x=G.nsX!=null?G.nsX:NSZ.x,y=G.nsY!=null?G.nsY:NSZ.y;G.nsEaten=1;G.nsEatN=(G.nsEatN||0)+1;D.eatCD=.9;D.eatT=.4;
  D.hp=Math.min(D.maxHp,D.hp+NSE.heal);D.healFx=1;D.st=Math.min(D.maxSt,D.st+20);try{feed(NSE.heal);}catch(e){}try{glutEat(NSE.food);}catch(e){}try{tallyAdd('nessie');}catch(e){}
  puff(x,y-30,18,'rgba(235,250,245,',120,12);sparkle(D.x,D.y-heightOf(),22);G.shake=Math.max(G.shake||0,6);try{if(typeof SFX!=='undefined')SFX.chomp(3);}catch(e){}
  float(x,y-150,'GULP! Nessie, swallowed whole!','#a8ffb8');float(D.x+R(-10,10),D.y-heightOf()-70,`+${NSE.heal} HP`,'#6dff7a');showToast('🦕 GULP! You swallowed the sleepy Nessie in one go!');}
{const _te=tryEat;tryEat=function(){if(nsEdible()&&!(D.eatCD>0)&&D.alt<.6){const p=mmMouth(),x=G.nsX!=null?G.nsX:NSZ.x,y=G.nsY!=null?G.nsY:NSZ.y;
    if(Math.hypot(p.x-x,p.y-y)<NSE.r||Math.hypot(D.x-x,D.y-y)<NSE.r*.8){nsEat();return;}}return _te.apply(this,arguments);};}
{const _d=nsDraw;nsDraw=function(){if(nsDown()&&G.nsEaten)return;return _d.apply(this,arguments);};}
{const _nl=nextLevel;nextLevel=function(){const e=G.nsEaten,n=G.nsEatN;const r=_nl.apply(this,arguments);if(G.nsDown){G.nsEaten=e;G.nsEatN=n;}return r;};}
if(typeof TALLY_LABEL!=='undefined'){TALLY_LABEL.nessie='Nessie';const s=TALLY_SECT.find(q=>q.id==='coast');if(s&&!s.keys.some(k=>k[0]==='nessie'))s.keys.push(['nessie','Nessie']);}
// ======================= queue 96: no mountains on the wizard's isle =======================
// The old northern mountain range scatter (partW) left 4 grey 'peak' crags on the isle, overlapping the tower. They are flattened into plain isle ground (kept in DECOR as
// 'wzflat' so saved plant-state indices never shift) and the minimap paints the isle as island ground (sand rim + violet heart) with the tower dot.
function wzPeakOnIsle(o){return o.k==='peak'&&Math.hypot(o.x-WZ.x,(o.y-WZ.y)*1.2)<WZ.r+(o.w||200)*.55+40;}
function wzFlatten(){let n=0;for(const o of DECOR)if(wzPeakOnIsle(o)){o.k='wzflat';n++;}G&&(G.wzFlat=(G.wzFlat||0)+n);return n;}
{const _dd=drawDecor;drawDecor=function(o){if(o.k==='peak'&&!o.wzc){o.wzc=1;if(wzPeakOnIsle(o))o.k='wzflat';}if(o.k==='wzflat')return;return _dd.apply(this,arguments);};}
if(typeof drawDecorHi==='function'){const _dh=drawDecorHi;drawDecorHi=function(o){if(o.k==='peak'&&!o.wzc){o.wzc=1;if(wzPeakOnIsle(o))o.k='wzflat';}if(o.k==='wzflat')return;return _dh.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{wzFlatten();}catch(e){}return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);try{wzFlatten();}catch(e){}return r;};}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{const s=mmw/(WX1-WX0),px=mmx+(WZ.x-WX0)*s,py=mmy+(WZ.y-WY0)*s,rx=Math.max(2,WZ.r*s),ry=rx/1.2;
  ell(px,py,rx,ry,'#d8c89a');ell(px,py,rx*.78,ry*.78,'#8a6cc0');ell(px,py,Math.max(1.2,rx*.22),Math.max(1.2,rx*.22),'#4a3a78');}catch(e){}return r;};}
// ======================= queue 100-104: the DARK WIZARD of Cinder Isle =======================
// A volcano island in the northern DARK ocean (east of the cyclops lands, north of the dark/light divide). The Dark Wizard hovers over the crater inside a magic shield
// with the Storm Wizard's rules: the shield IS his health bar, every hit on the volcano or on him drains it. (107: his obsidian spire is gone; he just hovers over the crater.)
// ~1.75x the Storm Wizard (525 shield vs 300) and he never level-scales (101). Attacks (kid-friendly, cartoony):
//  - LAVA SHOTS: 5 glowing blobs (13 dmg each vs ice 9). Dragon fire does NOT melt them (unlike ice spikes); they just fizzle into steam when they land.
//  - ERUPTION: the volcano blasts smoke + fire; an expanding fire ring knocks the dragon back harder than the wind (1300 vs 1100) for 6 dmg (wind: 1).
//  - PURPLE LIGHTNING: telegraphed ring, then a purple bolt (8 dmg vs 6, radius 95 vs 90).
// Beaten (104): stays beaten for good - saved, kept through level-ups (only a brand-new game after losing the dragon resets him). Reward: +50 max health, +400 gold,
// his volcano unlocks for lava drinking and the LAVA SHOT is upgraded at EVERY volcano (102/103): a dark-purple TRIPLE shot (spread 0.14 rad) with +50% splash damage.
const DWV={x:9700,y:-9000,r:250,H:170,drinkR:190,name:'Cinder Isle'},DW_HP=525,DW_DMG={lava:13,erupt:6,bolt:8},DW_KB=1300,DW_GOLD=0,DW_GAIN=0,/* QUEUE 105: no gold / max-health reward; the volcano + purple triple lava ARE the reward */DW_SPIRE=520;
const DWL={n:3,spread:18*Math.PI/180,mul:1.5};/* 108: 18 deg between globs (36 deg fan) so the three read apart */
const DWB={on:false,hp:0,maxHp:0,cd:2,spell:0,shots:[],marks:[],erupts:[],koT:0,said:0,hitT:0,cast:0,stats:{lava:0,bolt:0,erupt:0}};
function onDwIsle(x,y){const dx=x-DWV.x,dy=(y-DWV.y)*1.2;return dx*dx+dy*dy<DWV.r*DWV.r;}
{const _o=onWzIsle;onWzIsle=function(x,y){return _o(x,y)||onDwIsle(x,y);};}
{const _nc=nrCol;nrCol=function(x,y,wx,wy,n){if(onDwIsle(x,y)){const r=Math.hypot(x-DWV.x,(y-DWV.y)*1.2)/DWV.r;return r>.82?nrMix([150,138,126],[124,112,104],n):nrMix([70,60,64],[92,78,82],n);}return _nc.apply(this,arguments);};}
{const _rk=regionKey;regionKey=function(x,y){if(y<0&&onDwIsle(x,y))return'dwisle';return _rk(x,y);};}
REGION_NAMES.dwisle='Cinder Isle';REGION_SUB.dwisle='The Dark Wizard guards his volcano - break his magic shield';REGION_LABEL.dwisle=[DWV.x,DWV.y-320];
function dwDown(){return !!(G&&G.dwDown);}
function dwTop(){return{x:DWV.x,y:DWV.y-DWV.H-70+Math.sin((G?G.t:0)*2)*6};}
function dwSpire(){return{x:DWV.x+150,y:DWV.y+40};}
function dwStart(){DWB.on=true;if(!DWB.maxHp){DWB.maxHp=Math.round(DW_HP*(EASY?.7:1));DWB.hp=G.dwHp>0?Math.min(G.dwHp,DWB.maxHp):DWB.maxHp;}DWB.cd=1.4;
  if(!DWB.said){DWB.said=1;showToast('🧙‍♂️ The Dark Wizard: "My volcano is mine, little lizard!"');}}
function dwHurt(d,how){if(!DWB.on||DWB.koT>0||dwDown()||d<=0)return;DWB.hp-=d;DWB.hitT=G.t;G.dwHp=Math.max(1,Math.round(DWB.hp));G.dwHits=(G.dwHits||0)+1;
  if(rnd()<.12){const t=dwTop();float(t.x+R(-30,30),t.y-40,how==='bite'?'Hey! Not my shield!':'Grr! My shield!','#e0c8ff');}
  if(DWB.hp<=0){DWB.hp=0;DWB.koT=2;DWB.shots=[];DWB.marks=[];DWB.erupts=[];const t=dwTop();float(t.x,t.y-50,'Dizzy Dark Wizard!','#ffe28a');}}
function dwCast(){const k=DWB.spell++%3,t=dwTop();DWB.cast=.5;
  if(k===0){const a0=Math.atan2(D.y-DWV.y,D.x-DWV.x),dd=Math.hypot(D.x-DWV.x,D.y-DWV.y);for(let i=0;i<5;i++){const a=a0+(i-2)*.14,sp=400,T=Math.max(.5,dd/sp);
      DWB.shots.push({x:DWV.x,y:DWV.y,z:DWV.H+70,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vz:(heightOf()-DWV.H-70)/T,t:0,T:T+.6});}float(t.x,t.y-30,'Lava shots!','#ffb060');DWB.stats.lava++;}
  else if(k===1){DWB.marks.push({x:D.x+D.vx*.35,y:D.y+D.vy*.35,t:1});float(t.x,t.y-30,'Purple lightning!','#e0a8ff');DWB.stats.bolt++;}
  else{DWB.erupts.push({r:40,t:0,hit:0});float(DWV.x,DWV.y-DWV.H-20,'ERUPTION!','#ff9a4a');DWB.stats.erupt++;G.shake=Math.max(G.shake||0,4);
    puff(DWV.x,DWV.y-DWV.H,12,'rgba(90,80,90,',120,14);for(let i=0;i<14;i++)LEMBERS.push({x:DWV.x+R(-30,30),y:DWV.y+R(-10,10),z:DWV.H,vx:R(-180,180),vy:R(-120,120),vz:R(160,340),t:R(.6,1.1)});}}
function dwUpd(dt){if(!G||G.over)return;const dd=Math.hypot(D.x-DWV.x,D.y-DWV.y);
  if(dwDown()){DWB.on=false;return;}
  if(DWB.koT>0){DWB.koT-=dt;if(DWB.koT<=0)dwDefeat();return;}
  if(!DWB.on){if(dd<1400&&!G.won)dwStart();else return;}
  if(dd>2600){DWB.on=false;DWB.shots=[];DWB.marks=[];DWB.erupts=[];return;}
  if(DWB.cast>0)DWB.cast-=dt;DWB.cd-=dt;if(DWB.cd<=0&&!G.won){DWB.cd=EASY?2.8:2.0;dwCast();}
  for(const s of DWB.shots){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z=Math.max(0,s.z+s.vz*dt);
    if(!s.done&&Math.hypot(D.x-s.x,D.y-s.y)<44&&Math.abs(s.z-heightOf())<70){s.done=1;hurtDragon(DW_DMG.lava,'lava');float(D.x,D.y-heightOf()-80,'Lava shot!','#ffb060');G.dwLavaHits=(G.dwLavaHits||0)+1;}
    if(!s.done&&s.t>s.T){s.done=1;puff(s.x,s.y,4,'rgba(230,230,240,',60,8);}}
  for(const m of DWB.marks){m.t-=dt;if(m.t<=0&&!m.done){m.done=1;m.flash=.28;if(Math.hypot(D.x-m.x,D.y-m.y)<95){hurtDragon(DW_DMG.bolt,'lightning');float(D.x,D.y-heightOf()-80,'ZZAP!','#e0a8ff');G.dwBoltHits=(G.dwBoltHits||0)+1;}G.shake=Math.max(G.shake||0,3);}if(m.flash>0)m.flash-=dt;}
  for(const w of DWB.erupts){w.t+=dt;w.r=40+860*Math.min(1,w.t/1.5);if(!w.hit&&Math.abs(dd-w.r)<70){w.hit=1;hurtDragon(DW_DMG.erupt,'erupt');const a=Math.atan2(D.y-DWV.y,D.x-DWV.x);
      D.nrKb={vx:Math.cos(a)*DW_KB,vy:Math.sin(a)*DW_KB*.8,t:.7};float(D.x,D.y-heightOf()-80,'KABOOM! Blown back!','#ff9a4a');G.dwKb=(G.dwKb||0)+1;}}
  DWB.shots=DWB.shots.filter(s=>!s.done);DWB.marks=DWB.marks.filter(m=>!m.done||m.flash>0);DWB.erupts=DWB.erupts.filter(w=>w.t<1.6);}
function dwDefeat(){const had=!!(G.lavaUp&&G.dwKey);DWB.on=false;G.dwDown=1;G.dwHp=0;G.dwWins=(G.dwWins||0)+1;G.lavaUp=1;G.dwKey=1;const t=dwTop();puff(t.x,t.y,14,'rgba(200,160,255,',90,10);sparkle(t.x,t.y,22);
  D.hp=D.maxHp;D.healFx=1;float(t.x,t.y-40,had?'Beaten again!':'Volcano unlocked!','#d8a8ff');
  if(had)showToast('🌋 The Dark Wizard is beaten again! You already have his volcano and the purple triple lava shot');else boostAlert('🌋 Purple TRIPLE lava shot!',`Dark Wizard beaten · his volcano is yours · 3 purple globs, +${Math.round((DWL.mul-1)*100)}% damage each, at every volcano`);
  try{achEv('dwizard');}catch(e){}try{horn();}catch(e){}}
// hits on him / his volcano drain the shield
function dwNear(x,y,r){return Math.hypot(x-DWV.x,(y-DWV.y)*1.2)<DWV.r*.6+(r||0);}
function dwSpireUp(){return false;}/* QUEUE 107: no spire on Cinder Isle any more (old saves' dwSpire* fields are simply ignored) */
function dwSpireHurt(){}/* 107: spire (and its +100 gold) removed */
function dwHit(d,how){if(!dwDown()&&DWB.on)dwHurt(d,how);}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);if(Math.abs(ox-DWV.x)<900&&Math.abs(oy-DWV.y)<900){
    if(!dwDown()&&(inFire(DWV.x,DWV.y,ox,oy)||inFire(DWV.x,DWV.y-60,ox,oy)))dwHurt(DR.fireDps*.55*dt,'fire');}return r;};}
{const _ls=lavaSplash;lavaSplash=function(x,y){const r=_ls.apply(this,arguments);if(dwNear(x,y,LAVA_CFG.splashR))dwHit(dwDown()?70:35,'lava');return r;};}
{const _st=doStomp;doStomp=function(){const r=_st.apply(this,arguments);if(dwNear(D.x,D.y,DR.stompR))dwHit(dwDown()?DR.stompDmg*1.6:20,'stomp');return r;};}
{const _ds=diveSlam;diveSlam=function(){const r=_ds.apply(this,arguments);if(dwNear(D.x,D.y,160))dwHit(dwDown()?110:40,'stomp');return r;};}
{const _cs=clawScratch;clawScratch=function(){const r=_cs.apply(this,arguments);if(r!==false&&D.alt<.45&&dwNear(D.x+Math.cos(D.ang)*80,D.y+Math.sin(D.ang)*80,90))dwHit(dwDown()?30:12,'claw');return r;};}
// eating: bite the shield while he is up; once beaten he lies dizzy on the crater rim and can be gulped (food 30, +40 HP)
function dwEatSpot(){return{x:DWV.x-40,y:DWV.y-DWV.H*.55};}
function dwEdible(){return dwDown()&&!G.dwEaten&&scene==='play';}
{const _te=tryEat;tryEat=function(){if(!(D.eatCD>0)){const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;
    if(dwEdible()&&Math.min(Math.hypot(D.x-DWV.x,D.y-DWV.y),Math.hypot(mx-DWV.x,my-DWV.y))<200){const sp=dwEatSpot(),heal=40;G.dwEaten=1;G.dwEatenN=(G.dwEatenN||0)+1;D.eatCD=.6;D.eatT=.3;
      D.hp=Math.min(D.maxHp,D.hp+heal);D.healFx=.8;try{feed(heal);}catch(e){}try{glutEat(30);}catch(e){}try{tallyAdd('dwizard');}catch(e){}G.stats.eaten=(G.stats.eaten||0)+1;
      puff(sp.x,sp.y,14,'rgba(220,200,255,',90,10);sparkle(sp.x,sp.y,16);float(sp.x,sp.y-40,'GULP! The Dark Wizard (+'+heal+')','#ffe28a');showToast('🧙‍♂️ Gulp! The Dark Wizard is gone for good');
      try{SFX.play('gulp',sp.x,sp.y,1);}catch(e){}try{achEv('dwEat');}catch(e){}return;}
    if(DWB.on&&DWB.koT<=0&&!dwDown()&&Math.hypot(D.x-DWV.x,D.y-DWV.y)<210){D.eatCD=.6;dwHurt(14,'bite');float(D.x,D.y-90,'Chomp the shield!','#e0c8ff');return;}}
  return _te.apply(this,arguments);};}
{const _t=nrTick;nrTick=function(dt){_t(dt);if(scene==='play'&&G)dwUpd(dt);};}
// ---- 102: his volcano is drinkable once he is beaten; the triple purple lava shot at every volcano ----
function dwEatRange(){const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;return Math.min(Math.hypot(D.x-DWV.x,D.y-DWV.y),Math.hypot(mx-DWV.x,my-DWV.y))<200;}
function nearDW(){return (dwDown()||G.dwKey)&&D&&!(dwEdible()&&dwEatRange())&&D.mode==='ground'&&D.alt<.3&&!D.swim&&Math.hypot(D.x-DWV.x,D.y-DWV.y)<DWV.drinkR+60;}
{const _n=nearLava;nearLava=function(){return _n.apply(this,arguments)||nearDW();};}
{const _l=lavaDrink;lavaDrink=function(){if(dwEdible()&&D&&dwEatRange())return false;/* 106: the dizzy wizard on the rim is gulped first, then E drinks */if(nearDW()){const ox=VOLC.x,oy=VOLC.y;VOLC.x=DWV.x;VOLC.y=DWV.y;try{const r=_l.apply(this,arguments);if(r)G.dwDrinks=(G.dwDrinks||0)+1;return r;}finally{VOLC.x=ox;VOLC.y=oy;}}
  if(!dwDown()&&!G.dwKey&&D&&Math.hypot(D.x-DWV.x,D.y-DWV.y)<DWV.drinkR+60&&D.alt<.3&&!(G.dwLockT>G.t)){G.dwLockT=G.t+3;float(D.x,D.y-90,'The Dark Wizard\'s shield keeps you from the lava!','#e0c8ff');}
  return _l.apply(this,arguments);};}
{const _lf=lavaFire;lavaFire=function(dt){const n0=LGLOBS.length;const r=_lf.apply(this,arguments);if(G&&G.lavaUp&&LGLOBS.length===n0+1){const g=LGLOBS[n0];g.dw=1;
    const sp=Math.hypot(g.vx,g.vy),a=Math.atan2(g.vy,g.vx);for(const k of[-1,1]){const b=a+k*DWL.spread;LGLOBS.push(Object.assign({},g,{vx:Math.cos(b)*sp,vy:Math.sin(b)*sp,rot:R(0,TAU)}));}G.dwTriple=(G.dwTriple||0)+1;}return r;};}
let DWL_MUL=1;
{const _ls=lavaSplash;lavaSplash=function(x,y){const g=LGLOBS.find(q=>q.dw&&q.dead&&q.x===x&&q.y===y);if(!g)return _ls.apply(this,arguments);DWL_MUL=DWL.mul;const p0=LPUDDLES.length;
  try{return _ls.apply(this,arguments);}finally{DWL_MUL=1;for(let i=p0;i<LPUDDLES.length;i++)LPUDDLES[i].dw=1;G.dwSplash=(G.dwSplash||0)+1;}};}
{const _hu=hurtUnit;hurtUnit=function(u,d){if(DWL_MUL!==1)arguments[1]=d*DWL_MUL;return _hu.apply(this,arguments);};}
{const _hs=hurtStruct;hurtStruct=function(s,d){if(DWL_MUL!==1)arguments[1]=d*DWL_MUL;return _hs.apply(this,arguments);};}
if(typeof hurtShip==='function'){const _h=hurtShip;hurtShip=function(s,d){if(DWL_MUL!==1)arguments[1]=d*DWL_MUL;return _h.apply(this,arguments);};}
if(typeof hurtSiege==='function'){const _h=hurtSiege;hurtSiege=function(g,d){if(DWL_MUL!==1)arguments[1]=d*DWL_MUL;return _h.apply(this,arguments);};}
{const _h=nrbHurt;nrbHurt=function(o,d){if(DWL_MUL!==1)arguments[1]=d*DWL_MUL;return _h.apply(this,arguments);};}
// purple globs (drawn by us, the classic drawer skips them)
{const _dl=drawLavaAir;drawLavaAir=function(){const P=LGLOBS.filter(g=>g.dw);if(P.length)LGLOBS=LGLOBS.filter(g=>!g.dw);try{_dl.apply(this,arguments);}finally{if(P.length)LGLOBS=LGLOBS.concat(P);}
  for(const g of P){const sy=g.y-g.z;g.tr=g.tr||[];if(!g.dead&&(!g.tr.length||g.tr[g.tr.length-1][0]!==g.x||g.tr[g.tr.length-1][1]!==sy)){g.tr.push([g.x,sy]);if(g.tr.length>9)g.tr.shift();}ell(g.x,g.y,16,7,'rgba(20,0,30,.35)');
    for(let i=0;i<g.tr.length-1;i++){const q=g.tr[i],f=(i+1)/g.tr.length;ctx.fillStyle=`rgba(110,30,190,${.55*f})`;ctx.beginPath();ctx.arc(q[0],q[1],5+9*f,0,TAU);ctx.fill();}ctx.globalCompositeOperation='lighter';
    const gg=ctx.createRadialGradient(g.x,sy,3,g.x,sy,44);gg.addColorStop(0,'rgba(210,130,255,.85)');gg.addColorStop(.45,'rgba(150,40,240,.4)');gg.addColorStop(1,'rgba(100,0,200,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(g.x,sy,44,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#3a0c5c';ctx.beginPath();ctx.arc(g.x,sy,17,0,TAU);ctx.fill();ctx.fillStyle='#8a2ad0';ctx.beginPath();ctx.arc(g.x-3,sy-3,12,0,TAU);ctx.fill();ctx.fillStyle='#f0d0ff';ctx.beginPath();ctx.arc(g.x-6,sy-6,4.5,0,TAU);ctx.fill();
    ctx.strokeStyle='#14041e';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(g.x,sy,17,0,TAU);ctx.stroke();}};}
// ---- drawing: soft shallows (no hard edge), volcano cone, the wizard, his spells, shield, HUD bar, map ----
function dwGround(){const x=DWV.x,y=DWV.y,r=DWV.r;ctx.save();ctx.translate(x,y);ctx.scale(1,1/1.2);const g=ctx.createRadialGradient(0,0,r*.85,0,0,r*1.7);
  g.addColorStop(0,'rgba(120,150,160,.45)');g.addColorStop(1,'rgba(60,90,130,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*1.7,0,TAU);ctx.fill();
  const a=ctx.createRadialGradient(0,0,r*.2,0,0,r*.9);a.addColorStop(0,'rgba(64,54,60,.95)');a.addColorStop(.7,'rgba(84,72,76,.85)');a.addColorStop(1,'rgba(110,98,92,0)');ctx.fillStyle=a;ctx.beginPath();ctx.arc(0,0,r*.9,0,TAU);ctx.fill();ctx.restore();}
function dwVolcano(){const x=DWV.x,y=DWV.y,H=DWV.H,t=G.t,pl=.5+.5*Math.sin(t*2.6),hot=!dwDown()||true;
  ell(x,y+6,150,34,'rgba(0,0,0,.22)');poly([x-150,y,x-36,y-H,x+36,y-H,x+150,y],'#4a3c44');poly([x-150,y,x-36,y-H,x-6,y-H,x-60,y],'#5c4c54');
  for(const k of[-1,1])poly([x+k*10,y-H+4,x+k*24,y-H*.55,x+k*14,y-H*.3,x+k*6,y-H*.6],`rgba(255,${110+pl*60|0},40,.85)`);
  ell(x,y-H,36,10,'#2a1a20');ell(x,y-H+1,28,7,`rgba(255,${120+pl*80|0},40,1)`);if(GFX_HI){ctx.globalCompositeOperation='lighter';ell(x,y-H-6,50,18,`rgba(255,120,40,${.12+.1*pl})`);ctx.globalCompositeOperation='source-over';}
}
{const _df=drawFlora;drawFlora=function(x0,y0,x1,y1){const r=_df.apply(this,arguments);try{if(DWV.x+500>x0&&DWV.x-500<x1&&DWV.y+400>y0&&DWV.y-400<y1){dwGround();dwVolcano();}}catch(e){if(!DWB.err)DWB.err=String(e);}return r;};}
function dwWizard(x,y,ko){const c=DWB.cast>0;if(ko){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(G.t*9)*.2);ctx.translate(-x,-y);}
  poly([x-12,y,x+12,y,x+4,y-32,x-4,y-32],'#2a1438');for(let i=0;i<4;i++)txt('✦',x-6+i*4,y-8-i*6,6,'#d8a0ff','center',false);
  ell(x,y-36,6,6,'#d8c0b0');poly([x-6,y-30,x+6,y-30,x+2,y-14,x-2,y-14],'#9a9aa8');poly([x-11,y-39,x+11,y-39,x+3,y-66],'#1a0a26');ell(x,y-39,12,3,'#1a0a26');
  line(x+12,y+2,x+14,y-48,'#3a2a2a',2.4);ell(x+14,y-52,c?7:5,c?7:5,c?'#ffd0a0':'#ff7a2a');if(GFX_HI||c)ell(x+14,y-52,c?18:11,c?18:11,'rgba(255,140,60,.3)');
  ell(x+2,y-37,1.2,1.2,'#ffcc33');ell(x-2,y-37,1.2,1.2,'#ffcc33');
  if(ko){ctx.restore();for(let i=0;i<3;i++){const an=G.t*5+i*TAU/3;txt('★',x+Math.cos(an)*14,y-72+Math.sin(an)*4,11,'#ffe060','center');}}}
function dwDrawFx(){if(Math.abs(cam.x-DWV.x)>2600||Math.abs(cam.y-DWV.y)>2200)return;const t=dwTop();
  if(!dwDown()){if(!(DWB.koT>0))ell(t.x,t.y+8,26,7,'rgba(255,120,40,.25)');dwWizard(t.x,t.y,DWB.koT>0);
    const f=DWB.maxHp?Math.max(0,DWB.hp)/DWB.maxHp:1,p=.5+.5*Math.sin(G.t*2.4),hit=DWB.hitT&&G.t-DWB.hitT<.25,cy=DWV.y-DWV.H*.6,rx=190,ry=DWV.H*.95;
    ctx.save();ctx.globalAlpha=.25+.75*f;ell(DWV.x,cy,rx,ry,`rgba(170,90,230,${(hit?.22:.08)+.05*p})`);ctx.strokeStyle=hit?'rgba(255,255,255,.9)':`rgba(210,150,255,${.35+.25*p})`;ctx.lineWidth=hit?4:2.5;
    ctx.beginPath();ctx.ellipse(DWV.x,cy,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();}
  else if(!G.dwEaten){const sp=dwEatSpot();ctx.save();ctx.translate(sp.x,sp.y);ctx.rotate(1.2);ctx.translate(-sp.x,-sp.y);dwWizard(sp.x,sp.y,false);ctx.restore();
    for(let i=0;i<3;i++){const a=G.t*5+i*TAU/3;txt('★',sp.x+Math.cos(a)*14,sp.y-40+Math.sin(a)*4,11,'#ffe060','center');}
    if(Math.hypot(sp.x-D.x,sp.y-D.y)<300&&!(G.dwHintT>G.t)){G.dwHintT=G.t+6;float(sp.x,sp.y-70,'Dizzy Dark Wizard - gobble him up!','#ffe28a');}}
  for(const s of DWB.shots){const Y=s.y-s.z;ell(s.x,s.y,7,2.5,'rgba(0,0,0,.18)');if(GFX_HI)ell(s.x,Y,18,18,'rgba(255,120,30,.25)');ell(s.x,Y,10,10,'#d8400c');ell(s.x-2,Y-2,6,6,'#ffb040');ell(s.x-3,Y-3,2.5,2.5,'#fff0a0');}
  for(const m of DWB.marks){if(!m.done){const q=1-m.t;ctx.strokeStyle=`rgba(210,140,255,${.4+.5*q})`;ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.ellipse(m.x,m.y,75,47,0,0,TAU);ctx.stroke();ctx.setLineDash([]);ell(m.x,m.y,75*q,47*q,'rgba(200,120,255,.18)');}
    else if(m.flash>0){let px=m.x+R(-10,10),py=m.y-700;for(let i=0;i<8;i++){const nx=m.x+R(-30,30)*(1-i/8),ny=py+88;line(px,py,nx,ny,'#f4e0ff',5);line(px,py,nx,ny,'#a050ff',2);px=nx;py=ny;}ell(m.x,m.y,55,32,'rgba(220,170,255,.5)');}}
  for(const w of DWB.erupts){const q=w.t/1.5;ctx.strokeStyle=`rgba(255,140,60,${.75*(1-Math.min(1,q))})`;ctx.lineWidth=10*(1-Math.min(1,q))+2;ctx.beginPath();ctx.ellipse(DWV.x,DWV.y,w.r,w.r*.62,0,0,TAU);ctx.stroke();
    if(GFX_HI||G.fc%2===0)for(let i=0;i<8;i++){const an=i*TAU/8+w.t;ell(DWV.x+Math.cos(an)*w.r,DWV.y+Math.sin(an)*w.r*.62,14,9,`rgba(110,100,110,${.5*(1-Math.min(1,q))})`);}}}
{const _f=nrDrawFx;nrDrawFx=function(){const r=_f.apply(this,arguments);try{dwDrawFx();}catch(e){if(!DWB.err)DWB.err=String(e);}return r;};}
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!DWB.on||dwDown()||!DWB.maxHp)return;const S=hudSlot('dwizard',Math.min(424,VW*.6+4),32),w=S.w-4,x=S.x+2,y=S.y+20,lab='🛡️ Dark Wizard\'s magic shield'+(EASY?' (easy)':'');
  rect(x-2,y-2,w+4,14,'rgba(30,8,30,.75)');rect(x,y,w*Math.max(0,DWB.hp)/DWB.maxHp,10,'#c060ff');txt(lab,S.cx,S.y+13,hudFit(lab,S.w,13),'#f0dcff','center');G.dwBar=G.fc;};}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{if(big){const s=mmw/(WX1-WX0),px=mmx+(DWV.x-WX0)*s,py=mmy+(DWV.y-WY0)*s;ell(px,py,4,4,dwDown()?'#c8a0e0':'#a040e0');txt(dwDown()?'🌋 Cinder Isle (yours)':'🌋 Dark Wizard',px+7,py+4,10,'#f0d8ff','left');}}catch(e){}return r;};}
// ---- saves / levels (101: fixed strength; 103/104: beaten + lava upgrade kept through level-ups) ----
function dwReset(){Object.assign(DWB,{on:false,hp:0,maxHp:0,cd:2,spell:0,shots:[],marks:[],erupts:[],koT:0,said:0,cast:0});}
{const _ng=newGame;newGame=function(opt){const lv=opt&&opt.lvl>1&&G,k=lv?{dwDown:G.dwDown,dwWins:G.dwWins,lavaUp:G.lavaUp,dwKey:G.dwKey,dwEaten:G.dwEaten,dwEatenN:G.dwEatenN,dwSpireDown:G.dwSpireDown,dwSpireHp:G.dwSpireHp,dwHp:G.dwHp}:null;
  const r=_ng.apply(this,arguments);dwReset();if(k)for(const q in k)if(k[q]!==undefined)G[q]=k[q];return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);dwReset();return r;};}
if(typeof tallyAddSect==='function')tallyAddSect('nrdark','Northern Realms · Dark lands','👹','#9ad06a',[['dwizard','Dark Wizard']]);
{const _ab=achBuild;achBuild=function(){const L=_ab.apply(this,arguments),i=L.findIndex(a=>a.id==='wizEat'),A=(id,name,how,ok,o)=>Object.assign({sec:'boss',id,name,how,ok},o||{});
  L.splice(i<0?L.length:i+1,0,A('dwizard','Volcano Tamer',"Break the Dark Wizard's shield on his volcano isle in the dark northern sea",()=>!!ACH.ev.dwizard||achG('dwWins')>0,
      {rew:()=>`Purple TRIPLE lava shot at every volcano (+${Math.round((DWL.mul-1)*100)}% damage each) · his volcano unlocks`}),
    A('dwEat','Spicy Snack','Gobble the dizzy Dark Wizard after breaking his shield',()=>!!ACH.ev.dwEat||achG('dwEatenN')>0));return L;};}
{const _w=wzClearFloes;wzClearFloes=function(){_w();if(OC&&OC.floes)OC.floes=OC.floes.filter(f=>Math.hypot(f.x-DWV.x,(f.y-DWV.y)*1.2)>DWV.r+Math.max(f.rx,f.ry)+250);};}
// ======================= queue 98: the weather turns stormier near the Wizard's Isle =======================
// Intensity ramps smoothly with distance to the isle (0 beyond ~3200, full inside ~600) and softens to 35% once the Storm Wizard is beaten.
// Screen overlay only: a dark blue-grey wash + vignette, choppy darker water tint, slanted rain streaks (30 on LOW, 90 on HIGH), and a soft harmless lightning
// flash every ~5-11 s with a quiet, delayed distant rumble. No damage, nothing scary.
const STORM={s:0,flash:0,next:6,thunder:-1,flashes:0};
function stormLevel(){if(!D||!G)return 0;const d=Math.hypot(D.x-WZ.x,D.y-WZ.y),s=clamp(1-(d-600)/2600,0,1);return s*s*(3-2*s)*(wzBeaten()?.35:1);}
{const _t=nrTick;nrTick=function(dt){_t(dt);if(scene!=='play'||!G)return;const tgt=stormLevel();STORM.s+=(tgt-STORM.s)*Math.min(1,dt*1.5);
  if(STORM.flash>0)STORM.flash-=dt;if(STORM.thunder>0){STORM.thunder-=dt;if(STORM.thunder<=0){STORM.thunder=-1;try{SFX.play('stomp',D.x,D.y,.18*STORM.s);}catch(e){}}}
  STORM.next-=dt;if(STORM.next<=0){STORM.next=R(5,11);if(STORM.s>.45&&!wzBeaten()||STORM.s>.3&&rnd()<.3){STORM.flash=.35;STORM.flashes++;STORM.thunder=R(.8,1.8);}}};}
function drawStorm(){const s=STORM.s;if(scene!=='play'||s<.02)return;const W=VW,H=VH,t=G.t;
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle=`rgba(22,28,48,${.28*s})`;ctx.fillRect(0,0,W,H);
  {const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(10,12,26,0)');g.addColorStop(1,`rgba(10,12,26,${.45*s})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  const n=Math.round((GFX_HI?90:30)*s);ctx.strokeStyle=`rgba(200,215,240,${.25+.2*s})`;ctx.lineWidth=1.2;ctx.beginPath();
  for(let i=0;i<n;i++){const ph=(i*0.6180339)%1,sp=900+(i%7)*60,x=((ph*W*1.3+t*260)%(W*1.3))-W*.15,y=((i*137.5+t*sp)%(H+60))-30;ctx.moveTo(x,y);ctx.lineTo(x-7,y+22);}ctx.stroke();
  if(STORM.flash>0)ctx.fillStyle=`rgba(235,240,255,${.22*s*Math.min(1,STORM.flash/.35)*(Math.sin(STORM.flash*40)>-.3?1:.4)})`,ctx.fillRect(0,0,W,H);
  ctx.restore();}
{const _h=drawHUD;drawHUD=function(){try{drawStorm();}catch(e){if(!STORM.err)STORM.err=String(e);}return _h.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);STORM.s=0;STORM.flash=0;return r;};}

// ======================= QUEUE 109: no human gold in the fantasy lands =======================
// Nothing in the Northern Realms (both realms, their seas and isles: everything north of the magic wind wall) gives gold, and neither do the
// Storm Wizard (g.js, was +300) or the Dark Wizard (105/107: his +400 and the spire's +100 are gone). Their other rewards stay.
// The rest are safety nets, so gold can never turn up up there by accident: buildings spill no coins, sunk-ship loot, coins, seashells
// and raiders' purses are not dropped north of the wall. Human-land gold is untouched.
function nrFantasyAt(x,y){return typeof nrEdge==='function'&&y<nrEdge(x);}
{const _o=onRuin;onRuin=function(s){if(s&&nrFantasyAt(s.x,s.y))s.hasGold=false;return _o.apply(this,arguments);};}
{const _d=dropCoins;dropCoins=function(x,y,n){if(nrFantasyAt(x,y))return;return _d.apply(this,arguments);};}
{const _a=rgAdd;rgAdd=function(x,y,n){if(nrFantasyAt(x,y))return null;return _a.apply(this,arguments);};}
{const _r=rgDrop;rgDrop=function(u){if(u&&!u.rgDone&&nrFantasyAt(u.x,u.y)){u.rgDone=true;u.rgP=0;return;}return _r.apply(this,arguments);};}
if(typeof ocShell==='function'){const _s=ocShell;ocShell=function(p){if(p&&nrFantasyAt(p.x,p.y))return;return _s.apply(this,arguments);};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if((G.fc&15)===0){if(loot.length)loot=loot.filter(l=>!nrFantasyAt(l.x,l.y));if(coins.length&&coins.some(c=>nrFantasyAt(c.x,c.y)))coins=coins.filter(c=>!nrFantasyAt(c.x,c.y));}return r;};}

// ======================= QUEUE 110/111: a castle detachment meets the trade ship at the King's Quay =======================
// The moment a trade ship is announced, Castle Aldric sends a detachment out of the gate. It marches to the quay and is already standing in
// line on the shore when the ship ties up (its pace is set from the ship's ETA; and the carts never leave before it is there). When the
// goods are on the carts the detachment walks with them to the castle, on top of the carts' own guards. Once the goods are delivered (or the
// cart is smashed / the ship sunk) the survivors march back in through the gate to the garrison. Size by shipload tier:
//   Small 2 (2 foot soldiers) · Medium 4 (2 foot, 1 knight, 1 archer) · Large 6 (2 foot, 2 knights, 2 archers) · Grand 9 (3 foot, 3 knights, 3 archers)
const KBD={tiers:[[2,0,0],[2,1,1],[2,2,2],[3,3,3]],sp:70,maxSp:170,col:'#2f6a8a',hold:30,ld:false};
function kbdComp(t){return KBD.tiers[Math.max(0,Math.min(3,(t|0)-1))];}
function kbdUnit(kind,x,y,o){const b={born:G.t,colr:KBD.col,kbDet:1};let u;
  if(kind==='a')u=mkUnit('archer',x,y,Object.assign({hp:22,maxHp:22,shootT:R(1,3)},b,o));
  else if(kind==='k')u=mkUnit('knight',x,y,Object.assign({hp:45,maxHp:45,atk:0},b,o));
  else u=mkUnit('knight',x,y,Object.assign({hp:24,maxHp:24,atk:0,foot:true},b,o));units.push(u);return u;}
function kbdSlot(L,i){const n=L.n,row=n>5?(i%2):0,k=n>5?Math.floor(i/2):i,cols=n>5?Math.ceil(n/2):n;const q=kbQuay();
  return {x:q.land.x+(k-(cols-1)/2)*38+(row?19:0),y:q.land.y+14-row*30};}
function kbdSpawn(s,atDock){const T=kbdComp(s.tier||1),q=kbQuay(),ks=[];for(let i=0;i<T[0];i++)ks.push('f');for(let i=0;i<T[1];i++)ks.push('k');for(let i=0;i<T[2];i++)ks.push('a');
  const L={kbdL:1,ship:s,n:ks.length,dead:false,x:q.land.x,y:q.land.y,t0:G.t,tier:s.tier||1};
  const eta=Math.max(1,Math.hypot(s.x-s.anchor.x,s.y-s.anchor.y)/(s.sp||KB.ship.sp)),far=Math.hypot(GATE.x-q.land.x,GATE.y-q.land.y);
  L.sp=Math.min(KBD.maxSp,Math.max(KBD.sp,far/(eta*.7)));s.kbd=L;
  ks.forEach((k,i)=>{const sl=kbdSlot(L,i),p=atDock?sl:{x:GATE.x+R(-16,16),y:GATE.y-6+i*4};const u=kbdUnit(k,p.x,p.y,{escort:L,kbdI:i,eo:[-2.4,2.4,-1.7,1.7,-3,3,-1,1,0][i%9]});u.face=1;});
  G.kbdSent=(G.kbdSent||0)+1;G.kbdLast=ks.length;return L;}
function kbdOf(L){return units.filter(u=>!u.dead&&u.kbDet&&u.escort===L);}
function kbdLeft(L){return kbdOf(L).filter(u=>{const sl=kbdSlot(L,u.kbdI|0);return Math.hypot(u.x-sl.x,u.y-sl.y)>40;}).length;}
function kbdHome(u){u.escort=null;u.retreat=true;u.kbdHome=1;G.kbdHomeN=(G.kbdHomeN||0)+1;}
// march / wait / walk-with-cart steps (fighting is left to the usual AI whenever the dragon comes close)
function kbdStep(k,dt){const L=k.escort;if(!L)return false;
  if(L.kbdL){const s=L.ship;if(L.dead||!s||s.state==='sink'||s.state==='home'||s.gone){L.dead=true;kbdHome(k);return false;}
    if(dist(k,D)<260&&D.alt<.6)return false;if(k.type==='archer'&&dist(k,D)<380&&!G.over)return false;
    const sl=kbdSlot(L,k.kbdI|0),d=Math.hypot(sl.x-k.x,sl.y-k.y);if(d>3)moveTo(k,sl.x,sl.y,d>60?L.sp:Math.max(25,Math.min(L.sp,d*2)),dt);else{k.face=1;k.kbdAt=1;}
    k.born=G.t;k.retreat=false;return true;}
  if(L.wrecked||L.gone||L.dead||!((L.load|0)>0)){kbdHome(k);return false;}
  return null;}
{const _e=escortStep;escortStep=function(k,dt){if(k&&k.kbDet){const r=kbdStep(k,dt);if(r!==null)return r;}return _e.apply(this,arguments);};}
// the ship is announced -> the detachment sets out (not for restored saves, see below)
{const _s=kbSpawnShip;kbSpawnShip=function(w,st,o){const s=_s.apply(this,arguments);try{if(s&&!KBD.ld&&s.state!=='home')kbdSpawn(s,s.state==='unload');}catch(e){G.kbdErr=String(e);}return s;};}
// the banner names the detachment too
{const _b=kbBuy;kbBuy=function(){const b0=G.banner,r=_b.apply(this,arguments);try{if(r&&G.banner&&G.banner!==b0&&G.banner.sub){const n=G.kbdLast||0;if(n)G.banner.sub+=`  ·  ${n} castle soldiers march to the quay to meet it`;}}catch(e){}return r;};}
// the ship ties up -> the goods go onto the carts and the detachment falls in beside them; the carts wait until it is there
{const _u=kbUnload;kbUnload=function(s){const before=new Set(kbTraders()),r=_u.apply(this,arguments);try{const L=s&&s.kbd;const nc=kbTraders().filter(c=>!before.has(c));
    if(L&&!L.dead&&nc.length){const m=kbdOf(L),late=kbdLeft(L);m.forEach((u,i)=>{u.escort=nc[i%nc.length];u.retreat=false;});
      if(late>0)for(const c of nc)c.kbHold=G.t+KBD.hold;G.kbdMet=(G.kbdMet||0)+1;G.kbdMetN=m.length;
      if(m.length){const q=kbQuay();float(q.land.x,q.land.y-80,`${m.length} castle soldier${m.length>1?'s':''} fall in to escort the carts`,'#bfe0ff');}}
    if(s)s.kbd=null;}catch(e){G.kbdErr=String(e);}return r;};}
function kbdReady(c){const m=units.filter(u=>!u.dead&&u.kbDet&&u.escort===c);return m.every(u=>dist(u,c)<120);}
{const _s=scStep;scStep=function(c,dt){if(c&&c.trader&&c.kbHold&&!c.wrecked){if(G.t>c.kbHold||kbdReady(c))c.kbHold=0;else return;}return _s.apply(this,arguments);};}
// save / load: carts in transit keep their detachment (counts per cart, same order as the carts); a ship still at sea gets a fresh one
{const _sn=svSnapshot;svSnapshot=function(){const o=_sn.apply(this,arguments);try{o.KBD=kbTraders().map(c=>{const m=units.filter(u=>!u.dead&&u.kbDet&&u.escort===c);
    return [m.filter(u=>u.type!=='archer'&&u.foot).length,m.filter(u=>u.type!=='archer'&&!u.foot).length,m.filter(u=>u.type==='archer').length].join(',');}).join(';');}catch(e){}return o;};
  const _ap=svApply;svApply=function(d){KBD.ld=true;let r;try{r=_ap.apply(this,arguments);}finally{KBD.ld=false;}try{for(const u of units)if(u.kbDet){u.dead=true;u.gone=true;}
    for(const s of kbShips())if(s.state==='sail'||s.state==='unload')kbdSpawn(s,s.state==='unload');
    const cs=kbTraders(),a=String((d&&d.KBD)||'').split(';');cs.forEach((c,i)=>{const e=(a[i]||'').split(',').map(Number);if(e.length<3)return;let j=0;
      for(const [k,n] of [['f',e[0]],['k',e[1]],['a',e[2]]])for(let t=0;t<(n|0)&&t<9;t++){const g=R(0,TAU);kbdUnit(k,c.x+Math.cos(g)*34,c.y+Math.sin(g)*20,{escort:c,kbdI:j,eo:[-2.4,2.4,-1.7,1.7,-3,3,-1,1,0][j%9]});j++;}});}catch(e){G.kbdErr=String(e);}return r;};}
// ======================= QUEUE 112: no more autosave — the game only saves when the player saves =======================
// Removed triggers: the timed autosave (every 2 minutes of play, partSV update hook) and the save-on-pause (part6, opening the pause menu,
// which also covered the auto-pause when the window loses focus). There were no level-up or page-hide/unload game saves (the pagehide
// listeners only store the all-time tally and the achievements, which are not game saves). An old 'Autosave' from an earlier version still
// shows in the Load list (as "Old autosave") and still loads; it simply never gets written again. Manual Slot 1-3 save/load is unchanged.
svAuto=function(){G.svAutoSkip=(G.svAutoSkip||0)+1;return false;};
{const _sl=svList;svList=function(){const L=_sl.apply(this,arguments);if(!L||!L.length||!L[0].auto)return L;
  const a=Object.assign({},L[0],{name:'Old autosave'});if(typeof PM!=='undefined'&&PM.scr==='save')return [a].concat(L.slice(1));return a.raw?[a].concat(L.slice(1)):L.slice(1);};}
{const _r=pmRowsN;pmRowsN=function(){if(typeof PM!=='undefined'&&PM.scr==='load')return svList().length+1;return _r.apply(this,arguments);};}
{const _d=drawSlots;drawSlots=function(){const _t=txt;txt=function(s){if(typeof s==='string'&&s.indexOf('The autosave updates')>=0){s='Pick a save to load. The game only saves when you save it yourself (Pause → Save).';const a=[].slice.call(arguments);a[0]=s;return _t.apply(this,a);}return _t.apply(this,arguments);};
  try{return _d.apply(this,arguments);}finally{txt=_t;}};}
// ======================= queue 113: every mini boss comes back with each new castle level =======================
// Before: the Hydra (and its Medusa flag), the Griffin, Nessie and the sand worm stayed beaten through level-ups. Now this wrapper (the
// outermost nextLevel) clears their "beaten / eaten / where it fell / its hurt health" flags after the older carry-over wrappers have run,
// so each comes back fresh on the new level at the usual mini-boss scaling (lvsL). Wins counters (grWins, nsWins, wormWins, hyWins,
// mdWins, nsEatN), the max-health they already gave (hyHp, grHpGain, nsHpGain) and achievements are kept. The Storm Wizard (wzDown) and the
// Dark Wizard (dwDown) and their unlocks are NOT touched: they stay beaten for good. Everything else (Kraken, giant octopus/squid, Cerberus
// packs, wild dragons, alphas...) is already rebuilt by newGame on every level. All of these flags live in G, so saves keep per-level state.
const MB113={keys:{mdDown:0,hyEaten:0,hyHeads:null,grDown:0,grEaten:0,grX:null,grY:null,grWp:null,grHp:0,nsDown:0,nsEaten:0,nsHp:0,nsX:null,nsY:null,wormDown:0},last:[]};
{const _nl=nextLevel;nextLevel=function(){const r=_nl.apply(this,arguments);const back=[];
  if(G.mdDown)back.push('Hydra');if(G.grDown)back.push('Griffin');if(G.nsDown)back.push('Nessie');if(G.wormDown)back.push('Sand worm');
  for(const k in MB113.keys)G[k]=MB113.keys[k];G.wormFirst=0;
  try{HYD.on=false;HYD.P=[];}catch(e){}try{GR.on=false;GR.act=null;}catch(e){}try{NS.on=false;NS.act=null;}catch(e){}
  MB113.last=back;G.mbBack=(G.mbBack||0)+1;
  if(back.length&&typeof showToast==='function')showToast(`👹 New castle level: the mini bosses are back (${back.join(', ')})`);return r;};}

// ======================= queue 114-116: Sandhaven grows its garrison and the rich caravan's escort grows =======================
// The towers cap is 8 (was 5). 114: once Sandhaven has all 8 towers standing, every rich-caravan arrival home adds SHG.add troops to the
// town garrison (2 desert soldiers + 1 desert archer), up to SHG.cap extra (perf cap). A burned tower is rebuilt first (no troops on that trip).
// 115/116: every time the rich caravan reaches EITHER end (castle gate or Sandhaven) its own escort gains one more guard (soldier, soldier,
// archer, ...) up to RCE.cap extra; the bonus adds up over time, is saved (G.rcEscX), carries over castle levels and is used by every
// new rich caravan (a raided one comes back with it too). A brand-new game starts again from the base escort.
DTW.max=8;
const SHG={add:[2,1],cap:15},RCE={cap:8};
// the old spot rings only fit 5 towers: add outer rings (same rules: desert, no water/oasis/buildings, 230 px apart) until 8 fit
{const _sp=dtSpots;dtSpots=function(){const had=!!DTW_SPOTS,out=_sp.apply(this,arguments);if(had||typeof DTOWN==='undefined'||out.length>=DTW.max)return out;
  for(const r of[520,600,680])for(let k=0;k<12&&out.length<DTW.max+2;k++){const a=k*TAU/12+r/97,x=Math.round(DTOWN.x+Math.cos(a)*r),y=Math.round(DTOWN.y+Math.sin(a)*r*.8);
    if(!inDesert(x,y)||(typeof inWater==='function'&&inWater(x,y)))continue;if(structures.some(s=>!isDT(s)&&d2(x,y,s.x,s.y)<95))continue;
    if(typeof inOasis==='function'&&inOasis(x,y))continue;if(out.some(q=>d2(x,y,q.x,q.y)<230))continue;out.push({x,y});}
  return out;};}
RC_FORM.sol.push([-140,-30],[-140,30],[-170,-30],[-170,30],[-200,-30],[-200,30]);RC_FORM.arc.push([-110,-64],[-110,64]);
function shExtra(){return units.filter(u=>u.shX&&u.dguard&&!u.dead).length;}
function shGarAdd(){let n=0;const L=[];for(let k=0;k<SHG.add[0];k++)L.push('s');for(let k=0;k<SHG.add[1];k++)L.push('a');
  for(const t of L){if(shExtra()>=SHG.cap){G.shGarCapHit=(G.shGarCapHit||0)+1;break;}const i=rcTownGuards().length,P=rcTownPost(i);
    const u=t==='a'?mkDArc(P.x,P.y,{shX:1}):mkDSol(P.x,P.y,{shX:1});rcMakeGuard(u,i);units.push(u);n++;}
  if(n){G.shGarAdded=(G.shGarAdded||0)+n;if(dist(DTOWN,D)<1500)float(DTOWN.x,DTOWN.y-160,`Sandhaven's garrison grows: +${n} troops!`,'#ffe0a0');}return n;}
{const _h=rcHome;rcHome=function(u){const T=dtTowers(),full=T.length>=DTW.max&&!T.some(s=>s.state==='druin');const r=_h.apply(this,arguments);
  if(full)shGarAdd();rcEscGrow(u);return r;};}
{const _d=rcDeliver;rcDeliver=function(u){const n0=G.rcDeliv||0;const r=_d.apply(this,arguments);rcEscGrow(u);if((G.rcDeliv||0)>n0){
    if(typeof showToast==='function')showToast(`🐪 The desert caravan reached the castle safely: +${RCV.deliver} gold for the king's treasury`);}return r;};}
function rcEscKind(i){return i%3===2?'darcher':'dsoldier';}
function rcEscAdd(c,i){const L=c.lead,k=rcEscKind(i),x=L.x+R(-30,30),y=L.y+R(-20,30);const u=k==='darcher'?mkDArc(x,y):mkDSol(x,y);
  u.escort=L;u.eo=[-1.6,1.6,-.6,.6][c.guards.length%4];u.rcG=true;u.rcX=1;u.rcSlot=c.guards.filter(g=>(k==='darcher')===!!g.darch&&!g.dcam).length;units.push(u);c.guards.push(u);return u;}
function rcEscGrow(u){const c=RCV.cur;G.rcEnds=(G.rcEnds||0)+1;if((G.rcEscX||0)>=RCE.cap){G.rcEscCapHit=(G.rcEscCapHit||0)+1;return;}
  G.rcEscX=(G.rcEscX||0)+1;if(c&&!c.done&&c.lead===u){rcEscAdd(c,G.rcEscX-1);if(dist(u,D)<1500)float(u.x,u.y-60,'One more guard joins the caravan!','#ffe0a0');}}
{const _s=spawnRich;spawnRich=function(o){const c=_s.apply(this,arguments);if(c&&!(o&&o.guards))for(let i=0;i<Math.min(RCE.cap,G.rcEscX||0);i++)rcEscAdd(c,i);return c;};}
{const _nl=nextLevel;nextLevel=function(){const e=G.rcEscX;const r=_nl.apply(this,arguments);if(e)G.rcEscX=e;return r;};}
// the garrison extras keep their mark through save/load (town list is saved in rcTownGuards order)
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);if(d&&d.RCV&&d.RCV.town){const T=rcTownGuards();d.RCV.town.forEach((t,i)=>{if(T[i]&&T[i].shX)t.shx=1;});}return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(d&&d.RCV&&d.RCV.town){const T=rcTownGuards();d.RCV.town.forEach((t,i)=>{if(t.shx&&T[i])T[i].shX=1;});}return r;};}

// ======================= queue 117/118: desert soldiers +50% health, +40% attack =======================
// before → after: desert soldier HP 35 → 53, desert archer HP 32 → 48, camel rider HP 60 → 90 (all still grow with the level);
// damage multiplier 1.25 → 1.75 (= ×1.4): desert soldier sword 5 → 7, desert archer arrow 5 → 7, camel rider scimitar 7.5 → 10.5,
// camel rider arrow 5 → 7. Covers the escort, Sandhaven's garrison, militia, tower archers, camel riders (there are no separate oasis guards).
Object.assign(RCV,{solHp:53,arcHp:48,camHp:90,dmgMul:1.75});

// ======================= queue 119: every alpha hits 20% harder =======================
const AL119={mul:1.2,before:{}};
(function(){for(const sp in TF_L){AL119.before[sp]=TF_L[sp].bite;TF_L[sp].bite=+(TF_L[sp].bite*AL119.mul).toFixed(2);}
  AL119.before.hippo=HP_A.bite;HP_A.bite=+(HP_A.bite*AL119.mul).toFixed(2);if(FAUNA.hippo){FAUNA.hippo.bite=HP_A.bite;FAUNA.hippo.say=`Hippo CHOMP! -${Math.round(HP_A.bite)}`;}
  for(const sp in AT){AL119.before['at_'+sp]=AT[sp].dm;AT[sp].dm=+(AT[sp].dm*AL119.mul).toFixed(3);}for(const k in AT_V)delete AT_V[k];})();
function atChg(){return (EASY?4:7)*AL119.mul;}

// ======================= queue 120/121: desert caravan gold =======================
// 120: destroying a desert caravan (the rich one or a plain one) spills 50 gold COINS to collect (was: rich only, 20 gold straight to the lair).
// 121: the rich caravan pays 100 gold (was 50) into the king's treasury at the castle gate, with a small toast (see rcDeliver above).
RCV.gold=50;RCV.deliver=100;
{const _r=rcRaided;rcRaided=function(why){const c=RCV.cur;if(!c||c.done)return _r.apply(this,arguments);const tc=c.camels.find(k=>k.rcChest&&!k.gone)||c.lead,x=tc.x,y=tc.y;
  const g0=D.gold,_f=float;float=function(a,b,s){if(typeof s==='string'&&s.indexOf("treasure chest is yours")>=0)s=`The treasure chest bursts open: ${RCV.gold} gold coins to collect!`;return _f.apply(this,[a,b,s].concat([].slice.call(arguments,3)));};
  try{_r.apply(this,arguments);}finally{float=_f;}D.gold=g0;dropCoins(x,y,RCV.gold);G.cvCoins=(G.cvCoins||0)+RCV.gold;};}
const cvPlainLive=u=>!!(u&&u.carav&&u.type==='villager'&&!u.rc&&!u.tax&&!u.dead);
function cvPlainLoot(u){if(u.cvLoot)return;u.cvLoot=1;dropCoins(u.x,u.y,RCV.gold);G.cvCoins=(G.cvCoins||0)+RCV.gold;G.cvPlainRaids=(G.cvPlainRaids||0)+1;
  if(dist(u,D)<1500)float(u.x,u.y-50,`The caravan's packs spill: ${RCV.gold} gold coins to collect!`,'#ffd84a');}
{const _h=hurtUnit;hurtUnit=function(u){const w=cvPlainLive(u);const r=_h.apply(this,arguments);if(w&&u.dead)cvPlainLoot(u);return r;};}
{const _e=eatUnit;eatUnit=function(u){const w=cvPlainLive(u);const r=_e.apply(this,arguments);if(w&&u.dead)cvPlainLoot(u);return r;};}
// ===== QUEUE 122: trade prices 2 gold per wood, 4 per stone (were 4 and 6); the shipload stays 25% of the treasury =====
const TP122={before:{wood:KB.rate.wood,stone:KB.rate.stone}};KB.rate.wood=2;KB.rate.stone=4;
// ===== QUEUE 123: ransom = 50% of the king's treasury + 100 + 50 x (castle level - 1)  (was 10% of the treasury) =====
const RS123={before:RANSOM.treasury};RANSOM.treasury=.5;
// ===== QUEUE 124: dragon fire hurts stone buildings directly at 50% of its wood rate; stone never catches fire or keeps burning =====
const F124={wood:DR.fireDps*.7,stone:.5,realmStone:new Set(['elfspire','dwhall','dwforge','dwmine','dwgate','cyccave'])};
// castle stone (walls, towers, keep, princess tower, lighthouse): 3.6/s -> 21/s; fire alone still can't push it below 35% (stomps, slams and lava finish it). Keep roof, wells, fountains, temple unchanged.
{const _sf=stoneFire;stoneFire=function(s,dt){if(!s||s.kind==='kroof'||s.kind==='well'||s.kind==='fountain'||s.kind==='jtemple'||!isStone(s))return _sf.apply(this,arguments);
  s.weak=3;if(s.hp>s.maxHp*.35)s.hp=Math.max(s.maxHp*.35,s.hp-F124.wood*F124.stone*dt);};}
// stone-upgraded kingdom buildings: direct fire 50% (was 40%), and they never catch fire (was: 50% chance, then burned on at 40%)
STUP.fire=F124.stone;let F124_IN=0;
{const _af=applyFire;applyFire=function(){const S=[];for(const s of structures)if(s.stoneUp&&s.state!=='ruin'&&!s.fire){s.fire=1;S.push(s);}F124_IN=1; // pre-set so no ignition / alarm / shrug roll happens
  try{return _af.apply(this,arguments);}finally{F124_IN=0;for(const s of S)s.fire=0;for(const s of structures)if(s.stoneUp&&s.fire)s.fire=0;}};}
{const _h=hurtStruct;hurtStruct=function(s,d){if(s&&s.stoneUp&&s.fire&&!F124_IN&&!HEAVY){s.fire=0;G.f124Out=(G.f124Out||0)+1;return;} // a stray spark on stone just goes out (no burn tick)
  return _h.apply(this,arguments);};}
// fantasy-realm stone buildings (elven castle, dwarf hall/forge/mine/gate, cyclops cave): fire 50% of the wooden ones' rate (30/s -> 15/s)
{const _n=nrbHurt;nrbHurt=function(o,d,how){if(how==='fire'&&o&&F124.realmStone.has(o.k))d*=F124.stone;return _n.call(this,o,d,how);};}
// ===== QUEUE 125: the kingdom's starting gold, wood and stone grow 10% per castle level, compounding (x1.1^(level-1)); level 1 unchanged =====
// Applied on top of the existing start values (gold piles 5 x (20+10 x (level-1)); 100 wood; 20 stone) when each level is set up. A loaded save keeps its saved amounts.
const KS125={g:1.1,last:null};
function ks125Mul(l){return Math.pow(KS125.g,Math.max(0,(l|0)-1));}
{const _ng=newGame;newGame=function(opt){const r=_ng.apply(this,arguments);const l=(opt&&opt.lvl)||1,m=ks125Mul(l);
  if(m>1&&G){for(const p of goldPiles)p.amt=Math.round(p.amt*m);G.wood=Math.round(G.wood*m);G.stone=Math.round(G.stone*m);}
  KS125.last={lvl:l,mul:m,gold:goldPiles.reduce((a,p)=>a+p.amt,0),wood:G&&G.wood,stone:G&&G.stone};return r;};}
// ===== QUEUE 126: every wizard spell does double damage (no level scaling) =====
const WZ126={before:{wz:Object.assign({},WZ_DMG),dw:Object.assign({},DW_DMG)}};
Object.assign(WZ_DMG,{ice:18,lightning:12,wind:2});Object.assign(DW_DMG,{lava:26,erupt:12,bolt:16});

// ======================= queue 127: the fantasy battle starts ~10% bigger each castle level =======================
// Army size per side was 16 + 4 per castle level (cap 46). Now that is ×1.1^(level−1) on top (compounding), cap 52 a side (nrperf-tested).
// L1 16 → 16, L2 20 → 22, L3 24 → 29, L4 28 → 37, L5 32 → 47. The light side still matches 90% of the dark army's strength.
const NA127={g:1.1,cap:52,before:nrArmySize};
nrArmySize=function(l){l=l||nrLvl();return Math.min(NA127.cap,Math.round((16+4*(l-1))*Math.pow(NA127.g,l-1)));};

// ======================= queue 128: caravans start each castle level with ~10% more guards =======================
// Extra starting guards = max(round(base × (1.1^(level−1) − 1)), floor((level−1)/2)), so at least +1 every two levels.
// Rich caravan (base 10 soldiers + 6 archers + 2 camel riders): foot extras cycle soldier, soldier, archer; cap +16.
// Plain caravans (base 2 camel riders): extra camel riders, cap +4. The per-crossing bonus of 115/116 comes on top and its cap scales: round(8 × 1.1^(level−1)).
const CG128={g:1.1,richBase:16,plainBase:2,richCap:16,plainCap:4,crossBase:8};
function cg128Lvl(){return Math.max(1,(G&&G.lvl)||1);}
function cg128Extra(base,cap,l){l=l||cg128Lvl();const m=Math.pow(CG128.g,l-1);return Math.min(cap,Math.max(Math.round(base*(m-1)),Math.floor((l-1)/2)));}
Object.defineProperty(RCE,'cap',{get(){return Math.round(CG128.crossBase*Math.pow(CG128.g,cg128Lvl()-1));},configurable:true});
RC_FORM.sol.push([-230,-30],[-230,30],[-260,-30],[-260,30],[-290,-30],[-290,30]);RC_FORM.arc.push([-200,-64],[-200,64],[-260,-64],[-260,64]);
{const _s=spawnRich;spawnRich=function(o){const c=_s.apply(this,arguments);if(c&&!(o&&o.guards)){const x0=Math.min(RCE.cap,G.rcEscX||0),n=cg128Extra(CG128.richBase,CG128.richCap);
    for(let i=0;i<n;i++){const u=rcEscAdd(c,x0+i);u.rcLv=1;}c.lvX=n;}return c;};}
{const _s=spawnCaravan;spawnCaravan=function(){const lead=_s.apply(this,arguments);if(lead&&typeof DTOWN!=='undefined'){const n=cg128Extra(CG128.plainBase,CG128.plainCap);
    for(let i=0;i<n;i++){const s=RCV.camN+i;const u=mkDCam(lead.x-40-55*Math.floor(s/2),lead.y+(s%2?46:-46),{escort:lead,cvG:true,cvSlot:s,eo:s%2?1.6:-1.6});units.push(u);}lead.cvLvX=n;}return lead;};}
{const _p=cvSlotPos;cvSlotPos=function(k,L){if(!(k.cvSlot>=2))return _p.apply(this,arguments);const t=L.route&&L.route[L.ri],a=t?Math.atan2(t.y-L.y,t.x-L.x):0,f=-40-55*Math.floor(k.cvSlot/2),l=k.cvSlot%2?50:-50;
  return{x:L.x+Math.cos(a)*f-Math.sin(a)*l,y:L.y+Math.sin(a)*f*.8+Math.cos(a)*l*.8};};}
// ===================== item 129: savanna elephants fight back + the WHITE ALPHA GUARDIAN ELEPHANT and his herd =====================
// Family-friendly: trunk swats, tusk shoves and ground stomps (no gore).
// 1) Any savanna elephant that gets hurt by the dragon stays cross for EL129.mad seconds and chases a dragon on the ground (up to EL129.madR px).
// 2) One big white alpha elephant (extra big, white hide, long ivory tusks) PATROLS the savanna with his herd on a random route: he walks to a random savanna
//    waypoint, picks a brand-new random one when he arrives (so the route is different every time), and the herd follows him.
//    When he or any herd member is attacked (or the dragon lands near the herd) he TRUMPETS (rings + sound) and calls the herd to protect him.
//    He uses the shared partTF turf-leader system (call, rally, fight, leash, calm down, a new leader ~60 s later once you fly away).
//    Alpha rules: shrugs off bites until under 50%, then dizzy and edible; mini-boss level scaling (HP +15%/level, damage +6%/level);
//    item 119's +20% alpha damage; points + first-defeat achievement. If the whole herd is gone a new herd arrives EL129.back s later.
const EL129={hp0:180,bite0:7,cd:1.6,herd:4,sp:34,th:.5,pts:300,back:120,mad:8,madR:700,R:300,food:90,
  moves:[['Trunk swat!',5,0],['Tusk shove!',5,90],['Ground stomp!',6,0]],pk:0,down:0,wpN:0};
function el129Lv(){return (G&&G.lvl)||1;}
function el129Hp(l){l=l||el129Lv();return Math.round(EL129.hp0*(1+.15*(l-1)));}
function el129Bite(l){l=l||el129Lv();return +(EL129.bite0*AL119.mul*(1+.06*(l-1))).toFixed(2);}
TF_L.elephant={flag:'elA',hp:EL129.hp0,bite:el129Bite(1),cd:EL129.cd,R:EL129.R,scale:1.25,kb:110,call:'PAWOOOOO!',sfx:'elTrumpet',col:'#fff4c8',ring:'255,244,200',
  key:'elephantw',label:'White alpha elephants',food:EL129.food,heal:(HEAL.elephant||60),grp:'herd',who:'The white elephant',say:'Trunk swat!',
  calm:'The white elephant flaps his ears and leads the herd on',fresh:'A new white elephant leads the herd!'};
AL119.before.elephantw=EL129.bite0;
FOOD.elephantw=EL129.food;
if(typeof SFX_DEF!=='undefined'&&!SFX_DEF.elTrumpet)SFX_DEF.elTrumpet=(a,B,o,t)=>{osc(a,o,t,'sawtooth',220,520,.35,.16,.04);osc(a,o,t+.33,'sawtooth',520,430,.8,.15,.02);osc(a,o,t,'triangle',110,260,1.1,.08,.1);return 1.2;};
function el129Sync(){const L=TF_L.elephant;L.hp=el129Hp();L.bite=el129Bite();}
const el129Ld=()=>EL129.pk?units.find(v=>!v.dead&&v.pack===EL129.pk&&tfIsLeader(v)):null;
const el129Herd=()=>EL129.pk?units.filter(v=>!v.dead&&v.type==='animal'&&v.pack===EL129.pk&&v.species==='elephant'):[];
function el129Wp(u){const Z=ZONES.savanna;for(let t=0;t<60;t++){const q=Z.s(),d=Math.hypot(q.x-u.x,q.y-u.y);
    if(d<500||d>2400||!Z.ok(q.x,q.y))continue;if(typeof WHOLES!=='undefined'&&WHOLES.some(H=>Math.hypot((q.x-H.x)/(H.rx+160),(q.y-H.y)/(H.ry+120))<1))continue;return{x:q.x,y:q.y};}
  return null;}
function el129Spawn(){el129Sync();const Z=ZONES.savanna;
  for(const v of units)if(!v.dead&&v.species==='elephant'&&(v.herd==='el129'||(v.pack&&v.pack===EL129.pk))){v.dead=true;v.gone=true;}if(EL129.pk&&TF.packs[EL129.pk])delete TF.packs[EL129.pk];
  let p=null;for(let t=0;!p&&t<80;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&d2(q.x,q.y,D.x,D.y)>900)p=q;}if(!p)return null;
  const pk=++packId,home={x:p.x-EL129.R,y:p.y-EL129.R*.7,w:EL129.R*2,h:EL129.R*1.4},F=FAUNA.elephant,L=TF_L.elephant;EL129.pk=pk;EL129.down=0;
  const ld=tfMakeLeader(mkUnit('animal',p.x,p.y,{species:'elephant',wild:true,zone:'savanna',home,hp:L.hp,maxHp:L.hp,free:true,pack:pk,herd:'el129',t:R(0,3),jt:0,face:rnd()<.5?1:-1}));
  units.push(ld);ld.wp=el129Wp(ld);
  for(let i=0;i<EL129.herd;i++){const q=sjNear(Z,p,90,60);units.push(mkUnit('animal',q.x,q.y,{species:'elephant',wild:true,zone:'savanna',home,hp:F.hp,maxHp:F.hp,free:true,pack:pk,herd:'el129',elSlot:i,t:R(0,3),jt:0,face:ld.face}));}
  if(TF.packs[pk])delete TF.packs[pk];G.elHerds=(G.elHerds||0)+1;return ld;}
// patrol (pack calm): the white elephant walks his random route, the herd follows in a loose file behind him; the turf moves with him
function el129Patrol(u,dt,ld){const Z=ZONES.savanna,ox=u.x,oy=u.y;
  if(u===ld){if(!u.wp||Math.hypot(u.wp.x-u.x,u.wp.y-u.y)<30||(u.wpT=(u.wpT||0)+dt)>90){u.wp=el129Wp(u);u.wpT=0;EL129.wpN++;G.elWps=(G.elWps||0)+1;}
    if(u.wp){if(moveTo(u,u.wp.x,u.wp.y,EL129.sp,dt))u.wp=null;}
    const H=u.home;if(H){H.x=u.x-H.w/2;H.y=u.y-H.h/2;}}
  else{const s=u.elSlot!==undefined?u.elSlot:(u.id%5),f=ld.face||1,row=1+(s>>1),side=(s&1)?1:-1;
    const tx=ld.x-f*(55*row),ty=ld.y+side*(34+8*row),dd=Math.hypot(tx-u.x,ty-u.y);
    if(dd>12)moveTo(u,tx,ty,dd>260?FAUNA.elephant.sp*1.2:Math.max(EL129.sp,Math.min(FAUNA.elephant.sp,dd*.5)),dt);else u.face=f;}
  if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;if(u===ld)u.wp=null;}}
// a hurt elephant (any elephant not busy in a herd fight) stays cross for a few seconds and fights back
function el129Mad(u,dt){const F=FAUNA.elephant,Z=ZONES[u.zone]||ZONES.savanna,dd=dist(u,D),ox=u.x,oy=u.y;
  if(G.over||G.won||u.burn>0||u.bolted>0||D.alt>=.5||dd>EL129.madR)return false;u.cd=(u.cd||0)-dt;u.state='hunt';
  if(u.state2==='back'){u.t2-=dt;const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp*.8,dt);if(u.t2<=0)u.state2=null;}
  else if(dd>40)moveTo(u,D.x,D.y,F.sp*1.15,dt);
  else if(u.cd<=0){const m=EL129.moves[(u.elMv=(u.elMv||0)+1)%EL129.moves.length];u.cd=F.cd;hurtDragon(m[1],'elephant');
    if(m[2]){const ka=Math.atan2(D.y-u.y,D.x-u.x);D.vx+=Math.cos(ka)*m[2];D.vy+=Math.sin(ka)*m[2];}if(m[0]==='Ground stomp!'){G.shake=Math.max(G.shake||0,5);puff(u.x,u.y,6,'rgba(200,170,120,',50,4);}
    float(D.x+R(-20,20),D.y-90,`${m[0]} -${Math.round(m[1]*G.dmgMul)}`,'#ffb0a0');G.elHits=(G.elHits||0)+1;u.state2='back';u.t2=.9;}
  if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}return true;}
{const _uw=updWild;updWild=function(u,dt){
  if(u&&!u.dead&&u.species==='elephant'){
    if(u.pack&&u.pack===EL129.pk){tfPackTick(u);const P=TF.packs[u.pack];const ld=P&&P.ld&&!P.ld.dead?P.ld:null;
      if(P&&P.alert){if(ld===u&&u.cd<=dt){const m=EL129.moves[(u.elMv=(u.elMv||0)+1)%EL129.moves.length];TF_L.elephant.say=m[0];}return _uw(u,dt);}
      if(u.elMad>G.t&&el129Mad(u,dt))return;
      if(ld&&!(u.burn>0)&&!(u.bolted>0)){if(!u.herd)u.herd='el129';el129Patrol(u,dt,ld);u.cd=(u.cd||0)-dt;if(ld===u&&u.roarFx>0)u.roarFx-=dt;return;}
      return _uw(u,dt);}
    if(u.elMad>G.t&&el129Mad(u,dt))return;}
  return _uw(u,dt);};updWild._base=_uw._base;}
// attacked -> cross; a herd member or the white elephant attacked -> he trumpets and calls the herd
{const _hu=hurtUnit;hurtUnit=function(u,d,src){const el=u&&!u.dead&&u.type==='animal'&&u.species==='elephant';const wasL=el&&tfIsLeader(u);const r=_hu.apply(this,arguments);
  if(el&&!u.dead&&dist(u,D)<1500){u.elMad=G.t+EL129.mad;G.elMadN=(G.elMadN||0)+1;
    if(u.pack&&u.pack===EL129.pk){const ld=el129Ld();if(ld){const P=tfPack(ld);P.ld=ld;P.seenT=G.t;P.calm=0;if(!P.alert){tfAlarm(ld,P);G.elCalls=(G.elCalls||0)+1;}}}}
  if(wasL&&u.dead)el129Down(u);return r;};}
{const _e=eatUnit;eatUnit=function(u){const wasL=u&&!u.dead&&u.species==='elephant'&&tfIsLeader(u);const r=_e.apply(this,arguments);if(wasL&&u.dead)el129Down(u);return r;};}
function el129Down(u){if(u._elDown)return;u._elDown=1;G.stats.kPts=(G.stats.kPts||0)+EL129.pts;G.elBeaten=(G.elBeaten||0)+1;puff(u.x,u.y,10,'rgba(255,250,230,',70,6);
  float(u.x,u.y-80,`The white elephant is ${u.eaten?'gulped':'beaten'}! +${EL129.pts}`,'#fff2c0');}
// alpha rule: a healthy white elephant shrugs off a bite (and it stings him); under 50% he is dizzy and can be gulped
{const prev=TOUGH.elephant;TOUGH.elephant={chk:u=>tfIsLeader(u)?u.hp>u.maxHp*EL129.th:!!(prev&&prev.chk(u)),
  hit:u=>{if(!tfIsLeader(u)){if(prev)prev.hit(u);return;}hurtUnit(u,Math.ceil(u.maxHp*.15),'bite');u.roarFx=1.2;G.elShrug=(G.elShrug||0)+1;
    if(dist(u,D)<1200)float(u.x,u.y-80,'The white elephant shrugs off the bite! Wear him below 50% first','#ffd27a');}};}
// manager: keep the leader's numbers in step with the castle level; a whole new herd if the old one is gone
function el129Mgr(dt){if(!G||!ZONES.savanna)return;el129Sync();if(el129Herd().length){EL129.down=0;return;}
  EL129.down+=dt;if(EL129.down>=EL129.back&&regionKey(D.x,D.y)!=='savanna'){el129Spawn();G.elNew=(G.elNew||0)+1;}}
{const _up=updParts;updParts=function(dt){const r=_up.apply(this,arguments);if(scene==='play'&&G&&!G.over)el129Mgr(dt);return r;};}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);EL129.pk=0;EL129.down=0;el129Spawn();return r;};}
// loads rebuild the herd after the saved gorilla packs have restored their pack ids (so the ids never clash)
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);el129Spawn();return r;};}
tallyAddSect('savanna','Animals · The savanna','🦓','#e8c860',[['elephantw',TF_L.elephant.label]]);
if(typeof REGION_SUB!=='undefined'&&REGION_SUB.savanna&&!/white elephant/.test(REGION_SUB.savanna))REGION_SUB.savanna+='. A white alpha elephant patrols with his herd (elephants fight back when hurt)';
// achievement text (the partTF alpha loop already makes 'al_elephant'; give it its own name, hint and reward)
{const _b=achBuild;achBuild=function(){const L=_b.apply(this,arguments);const a=L.find(q=>q.id==='al_elephant');
  if(a){a.name='Herd Guardian';a.how=`Defeat the white alpha elephant who patrols the savanna with his herd (a new one takes over about ${TF_NEWLEADER}s after, once you fly away)`;
    a.ok=()=>!!ACH.ev.al_elephant||achG('elBeaten')>0;a.rew=()=>`+${EL129.pts} points · gulp him for +${TF_L.elephant.heal} health`;}return L;};if(ACH.list)ACH.list=null;}
// drawing: a big white elephant (queue 133: no blanket, crest or gem any more: real animals wear nothing) marked out by its size,
// its white hide, long curved ivory tusks and natural pale-pink mottling on the ears and trunk; dizzy stars only once he is under 50% (edible)
function el129Draw(u){const x=u.x,y=u.y,f=u.face||1,W='#eef0f4',S='#cdd2dc';ctx.lineCap='round';
  const by=sjQuad(u,{bw:22,bh:13,leg:12,c:W,dk:S,lw:7});
  ell(x+f*20,by-4,10,10,W);ell(x+f*14,by-3,7,11,S);
  ctx.strokeStyle=W;ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(x+f*27,by);ctx.quadraticCurveTo(x+f*31,by+10,x+f*28+Math.sin(G.t*1.4+u.id*7)*3*f,by+16);ctx.stroke();
  ctx.strokeStyle='#fff4c8';ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x+f*24,by+4);ctx.quadraticCurveTo(x+f*33,by+13,x+f*37,by+3);ctx.stroke();ctx.lineWidth=1; // long curved ivory tusk
  for(const[a,b,r]of[[12.5,-7,2.2],[15,-1,1.7],[13,4,1.4],[16,-9,1.2]])ell(x+f*a,by+b,r,r*1.25,'#efc9cf');ell(x+f*26.5,by+2,1.8,1.4,'#efc9cf');ell(x+f*29,by+7,1.4,1.1,'#efc9cf'); // natural pink mottling
  sjEye(x+f*23,by-6,1.4);line(x-f*22,by-2,x-f*24,by+8,'#aab0bc',1.6);
}
FAUNA_ART.add('elephant');
{const _df=drawFauna;drawFauna=function(u){if(!(u&&u.species==='elephant'&&tfIsLeader(u)))return _df.apply(this,arguments);const L=TF_L.elephant;
  tfRings(u);if(tfRallied(u)){ctx.save();ctx.globalAlpha=.25;ell(u.x,u.y-10*L.scale,16*L.scale,9*L.scale,'#ffb347');ctx.restore();}
  ctx.save();ctx.translate(u.x,u.y);ctx.scale(L.scale,L.scale);ctx.translate(-u.x,-u.y);try{el129Draw(u);}finally{ctx.restore();}
  {const hp=u._elRH!==undefined?u._elRH:u.hp;if(hp<u.maxHp&&!u.dead){const k=typeof szBase==='function'?szBase(u):1,w=50/k,bh=5/k,y=u.y-62;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(u.x-w/2,y,w,bh);ctx.fillStyle=hp>u.maxHp*EL129.th?'#e05050':'#ffd23a';ctx.fillRect(u.x-w/2,y,w*Math.max(0,hp/u.maxHp),bh);}}};}
// partAL's dizzy stars show at 80%; this alpha becomes edible at 50%, so hide them until then
{const _da=drawAnimal;drawAnimal=function(u){if(u&&u.species==='elephant'&&!u.dead&&tfIsLeader(u)&&u.hp>u.maxHp*EL129.th&&u.hp<=u.maxHp*AL_TH){const h=u.hp;u._elRH=h;u.hp=u.maxHp;try{return _da.apply(this,arguments);}finally{u.hp=h;u._elRH=undefined;}}return _da.apply(this,arguments);};}
// ======================= queue 130: every jungle temple ruin piece can be smashed for 5 gold =======================
// The pieces: the 3 overgrown "ancient ruins" sites in the jungle (4 pillars + 1 lintel each = 15) and the rubble of the
// wrecked ancient jungle temple (14 rubble blocks + 1 leaning broken pillar = 15, only once the temple is wrecked).
// A bite (on the ground), a stomp or a claw rake smashes a piece: no gold per piece (queue 167a); a WHOLE ruins site pays 10 gold, the temple pays 100 on wreck. Stone, so fire alone never breaks them.
// Pieces are back every level (like the temple); smashed pieces are remembered in saves (G.rp130).
const RP130={gold:0,siteGold:10,perSite:5,rubble:14,biteR:55,clawR:120};
const RP_PILL=[-.3,-.1,.12,.3];
function rpSiteN(){return RUINS.length*RP130.perSite;}
function rpTotal(){return rpSiteN()+RP130.rubble+1;}
function rpDead(i){return !!(G.rp130&&G.rp130[i]==='1');}
function rpSet(i){let s=G.rp130||'';while(s.length<rpTotal())s+='0';G.rp130=s.slice(0,i)+'1'+s.slice(i+1);}
// world positions of every piece (x,y = where it stands on the ground)
function rpPieces(){const P=[];RUINS.forEach((q,si)=>{const w=q.w;RP_PILL.forEach((px,k)=>P.push({i:si*5+k,site:si,kind:'pillar',x:q.x+px*w,y:q.y-w*.12}));
    P.push({i:si*5+4,site:si,kind:'lintel',x:q.x-w*.1,y:q.y-w*.14});});
  const t=jtS(),tx=t?t.x:JT.x,ty=t?t.y:JT.y,b=rpSiteN();
  for(let i=0;i<RP130.rubble;i++){const a=i*2.1,r=20+(i*37%60);P.push({i:b+i,kind:'rubble',x:tx+Math.cos(a)*r,y:ty+Math.sin(a)*r*.4});}
  P.push({i:b+RP130.rubble,kind:'tpillar',x:tx-23,y:ty-5});return P;}
function rpLive(p){if(rpDead(p.i))return false;if(p.kind==='rubble'||p.kind==='tpillar'){const t=jtS();return !!(t&&t.state==='ruin');}return true;}
function rpSmash(p,how){if(!rpLive(p))return false;rpSet(p.i);G.rpN=(G.rpN||0)+1;if(typeof tallyAdd==='function')tallyAdd('rpStone');
  float(p.x,p.y-50,'Smash!','#e8e0c0');puff(p.x,p.y-14,10,'rgba(170,165,140,',110,10);
  if(p.site===undefined)for(let k=0;k<5;k++){const a=R(0,TAU),v=R(60,160);JT_BITS.push({x:p.x,y:p.y-10,z:R(8,30),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.5,vz:R(120,260),t:R(.8,1.4),c:k%2?'#8e8a76':'#a8a492',s:R(3,7)});}
  if(typeof SFX!=='undefined')SFX.play('crashStone',p.x,p.y,.45);
  // the lintel rests on the two west pillars: knock either out and it tumbles too
  if(p.kind==='pillar'&&p.site!==undefined&&(p.i%5===0||p.i%5===1)){const l=p.site*5+4;if(!rpDead(l))rpSmash({i:l,site:p.site,kind:'lintel',x:p.x,y:p.y-10},how);}
  if(p.site!==undefined)rp167Site(p.site);
  if(G.rpN>=rpTotal()&&!G.rpAll){G.rpAll=1;float(D.x,D.y-110,'Every ancient ruin stone smashed!','#ffe28a');}
  return true;}
// queue 167a: no gold per piece anywhere; a whole ancient ruins site (all 5 stones) pays RP130.siteGold once (the temple pays JT.gold=100 on wreck)
function rp167Site(si){G.rp167=G.rp167||{};let all=true;for(let k=0;k<5;k++)if(!rpDead(si*5+k)){all=false;break;}
  if(!all){delete G.rp167[si];return false;}if(G.rp167[si])return false;G.rp167[si]=1;const g=RP130.siteGold;D.gold=(D.gold||0)+g;G.rpGold=(G.rpGold||0)+g;G.rpSites=(G.rpSites||0)+1;
  const c=RUINS[si];float(c?c.x:D.x,(c?c.y:D.y)-80,`Ancient ruins destroyed! +${g} gold`,'#ffd84a');return true;}
function rpNear(x,y,r,one){let best=null,bd=r;const out=[];for(const p of rpPieces()){if(!rpLive(p))continue;const d=Math.hypot(p.x-x,(p.y-y)*1.2);if(d<r){out.push(p);if(d<bd){bd=d;best=p;}}}return one?best:out;}
{const _b=biteWell;biteWell=function(){if(D.alt<.3){const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70,p=rpNear(mx,my,RP130.biteR,true)||rpNear(D.x,D.y,RP130.biteR,true);
    if(p){rpSmash(p,'bite');D.eatCD=.45;D.eatT=.3;return true;}}return _b.apply(this,arguments);};}
{const _s=doStomp;doStomp=function(){const r=_s.apply(this,arguments);for(const p of rpNear(D.x,D.y,DR.stompR+10,false))rpSmash(p,'stomp');return r;};}
{const _c=clawScratch;clawScratch=function(){const r=_c.apply(this,arguments);if(r!==false&&D.alt<.6){const p=rpNear(D.x,D.y,RP130.clawR,true);if(p)rpSmash(p,'claw');}return r;};}
// drawing: the ancient ruins without their smashed pillars / lintel (rubble stubs where they stood)
{const _dw=drawWildDecor;drawWildDecor=function(o){if(!o||o.k!=='ruin')return _dw.apply(this,arguments);const si=RUINS.findIndex(q=>q.x===o.x&&q.y===o.y);
  if(si<0||!G.rp130||G.rp130.slice(si*5,si*5+5).indexOf('1')<0)return _dw.apply(this,arguments);
  SJC=ctx;const x=o.x,y=o.y,w=o.w;sE(x+20,y+8,w*.6,w*.14,'rgba(0,0,0,.25)');sP([x-w/2,y,x-w*.42,y-w*.12,x+w*.42,y-w*.12,x+w/2,y],'#8a8676');sP([x-w*.34,y-w*.12,x-w*.28,y-w*.24,x+w*.28,y-w*.24,x+w*.34,y-w*.12],'#9a9686');
  RP_PILL.forEach((px,k)=>{if(rpDead(si*5+k)){sR(x+px*w-7,y-w*.24-6,14,6,'#8e8a76');sR(x+px*w-2,y-w*.24-9,6,4,'#a4a08a');return;}const h=px===.12?w*.22:w*.42;sR(x+px*w-6,y-w*.24-h,12,h,'#a8a492');sR(x+px*w-8,y-w*.24-h-5,16,6,'#b8b4a2');});
  if(!rpDead(si*5+4))sR(x-w*.3-6,y-w*.66-10,w*.4+12,10,'#a8a492');
  sE(x+w*.05,y-w*.3,10,7,'#6a8a4a');txt('ancient ruins',x,y+16,10,'rgba(255,255,220,.55)','center');return true;};}
{const _dt=drawTemple;drawTemple=function(s){if(!s||s.state!=='ruin'||!G.rp130||G.rp130.slice(rpSiteN()).indexOf('1')<0)return _dt.apply(this,arguments);
  const x=s.x,y=s.y,b=rpSiteN();ell(x,y+6,96,30,'rgba(0,0,0,.18)');for(let i=0;i<RP130.rubble;i++){if(rpDead(b+i))continue;const a=i*2.1,r=20+(i*37%60);rect(x+Math.cos(a)*r-9,y+Math.sin(a)*r*.4-8,18,12,i%2?'#8e8a76':'#a4a08a');}
  if(!rpDead(b+RP130.rubble)){rect(x-30,y-16,14,22,'#9a9680');line(x-30,y-16,x-10,y-30,'#4f7a2a',3);}ell(x+20,y-6,16,8,'#4a7a2a');ell(x-48,y+2,14,7,'#5a8a34');
  for(const q of JT_BITS){ell(q.x,q.y+2,q.s*.8,q.s*.3,'rgba(0,0,0,.2)');rect(q.x-q.s/2,q.y-q.z-q.s/2,q.s,q.s,q.c);}};}
// smash bits from the ancient ruins sites fly even when the temple stands
try{const S=TALLY_SECT.find(s=>s.id==='build');if(S&&!S.keys.some(k=>k[0]==='rpStone'))S.keys.push(['rpStone','Ancient ruin stones smashed']);TALLY_LABEL.rpStone='Ancient ruin stones smashed';}catch(e){}
if(typeof REGION_SUB!=='undefined'&&REGION_SUB.jungle&&REGION_SUB.jungle.indexOf('ruin stone')<0)REGION_SUB.jungle+=(/[.!]$/.test(REGION_SUB.jungle)?' ':'. ')+'Wreck the jungle temple for 100 gold; smash a WHOLE ancient ruins site (all its stones) for 10 gold';
// ======================= queue 131-132: savanna animal sizes =======================
// Drawn art used to be: elephant ~55x40 px, giraffe ~43x61 px, lion ~38x24 px, while the hippo is drawn x1.25 (~117x57 px).
// Now elephants x2.4 (~132x80, the biggest land animal), giraffes x1.9 (~82x116, taller than everything), lions x1.35
// (never smaller than before), hippos unchanged. The white alpha adds x1.25 on top (x3.0 overall, ~165x100).
// The hitboxes grow with them: bites, flames and stomps reach a big animal's body, not just its centre point.
const SZ131={elephant:2.4,giraffe:1.9,lion:1.35};
const SZ131_R={elephant:34,giraffe:22,lion:5}; // extra hit radius (px) beyond the old centre point; hippos keep 0
function szBase(u){return (u&&SZ131[u.species])||1;}
function szK(u){let k=szBase(u);if(u&&k!==1&&typeof tfIsLeader==='function'&&TF_L[u.species]&&tfIsLeader(u))k*=TF_L[u.species].scale||1;return k;}
function szR(u){const r=u&&SZ131_R[u.species];if(!r)return 0;const L=typeof tfIsLeader==='function'&&TF_L[u.species]&&tfIsLeader(u)?TF_L[u.species].scale||1:1;return r*L;}
{const _da=drawAnimal;drawAnimal=function(u){const k=szBase(u);if(k===1||!u||u.nr)return _da.apply(this,arguments);
  ctx.save();ctx.translate(u.x,u.y);ctx.scale(k,k);ctx.translate(-u.x,-u.y);try{return _da.apply(this,arguments);}finally{ctx.restore();}};}
// bites: a big animal counts as in the jaws when any part of its body is
{const _bt=biteTargets;biteTargets=function(){const T=_bt.apply(this,arguments);const gr=D.alt<0.3,r=(gr?DR.eatRGround:DR.eatRAir)*1.3,mx=D.x+Math.cos(D.ang)*80,my=D.y+Math.sin(D.ang)*80;
  const add=[];for(const u of units){const e=szR(u);if(!e||u.dead||u.inside||u.type!=='animal'||T.includes(u))continue;if(u.dgInv>0||(typeof TG_NOBITE!=='undefined'&&TG_NOBITE&&TG_NOBITE.has(u)))continue;
    const dm=d2(u.x,u.y,mx,my)-e,dd=dist(u,D)-e,fa=Math.abs(angDiff(Math.atan2(u.y-D.y,u.x-D.x),D.ang));
    if(dm<r||(dd<r+(gr?90:30)&&fa<BITE_ARC&&dd>20-e)||dd+12<r*.8)add.push(u);}
  if(!add.length)return T;const key=u=>Math.min(d2(u.x,u.y,mx,my),dist(u,D)+12)-szR(u);return T.concat(add).sort((a,b)=>key(a)-key(b));};}
// flames: also test the body edges of a big animal (only if the centre point was not already in the flames this tick)
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);
  for(const u of units){const e=szR(u);if(!e||u.dead||u.inside||inFire(u.x,u.y,ox,oy))continue;const h=e*.9;
    if(inFire(u.x-h,u.y-h*.5,ox,oy)||inFire(u.x+h,u.y-h*.5,ox,oy)||inFire(u.x,u.y-h,ox,oy)){u.burn=1.4;hurtUnit(u,DR.fireDps*dt,'fire');G.szFire=(G.szFire||0)+1;}}return r;};}
// stomps: reach the body edge too
{const _s=doStomp;doStomp=function(){const r=_s.apply(this,arguments);const R0=DR.stompR;
  for(const u of units){const e=szR(u);if(!e||u.dead||u.inside)continue;const d=dist(u,D);if(d>=R0&&d<R0+e){hurtUnit(u,DR.stompDmg,'stomp');G.szStomp=(G.szStomp||0)+1;}}return r;};}

// ======================= queue 133: real animals wear no clothes or accessories =======================
// Every real animal is drawn bare: the white alpha elephant lost his red-and-gold blanket, gold crest and forehead gem, the alpha
// hippos their little gold crowns (both above), the bulls their gold nose rings, cavalry horses their coloured saddle cloths, the
// prince's white horse its heraldic caparison and head plume, the desert camel riders' camels their red-and-gold saddle blankets
// and tassels, and the rich caravan's camels their striped blankets, tassels, bell and bridle. Alphas are told apart by size, colour
// and natural markings instead. Fantasy creatures and humans keep their outfits; cargo (packs, the treasure chest) and the cart
// horse's traces to its cart stay, since they are loads, not clothing.
// The originals live in partBL/partF/partPR/partRC (not editable here), so these are the same functions minus the accessories.
drawBull=function(u){const x=u.x,y=u.y,f=u.face,mad=u.bst==='paw'||u.bst==='charge',lift=animalLift(u),bob=u.bst==='charge'?Math.abs(Math.sin(u.anim))*2:0;
  ell(x,y+2,13,4,'rgba(0,0,0,.25)');ctx.save();ctx.translate(0,-lift-bob);
  const leg=u.bst==='paw'?Math.sin(u.anim)*3:Math.sin(u.anim)*1.2;
  for(const lx of[-7,-3,4,8]){const sw=lx===8&&u.bst==='paw'?leg:Math.sin(u.anim+lx)*1.2;line(x+lx*f,y-4,x+lx*f+sw,y+1,'#2e1c10',2);}
  ell(x,y-8,12,6.5,'#4a2c1a');ell(x-f*2,y-11,7,3,'#5c3820');ell(x-f*12,y-9,1.6,1.6,'#2e1c10');line(x-f*12,y-9,x-f*14,y-3,'#2e1c10',1.2);
  const hx=x+f*12,hy=y-10;ell(hx,hy,5.5,4.6,'#3e2414');ell(hx+f*3.5,hy+2,3,2.4,'#7a5040');
  ctx.strokeStyle='#f2e8cc';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(hx-2,hy-3);ctx.quadraticCurveTo(hx-6,hy-8,hx-3,hy-11);ctx.moveTo(hx+2,hy-3);ctx.quadraticCurveTo(hx+7,hy-7,hx+5,hy-11);ctx.stroke();ctx.lineWidth=1;
  ell(hx+f*1.5,hy-1.5,1.2,1.2,mad?'#ff3a2a':'#111');
  if(u.bst==='paw'){ctx.fillStyle='#ff4a3a';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('!',x,y-28);}
  if(u.burn>0)ell(x,y-8,9,5,'rgba(255,120,0,.55)');ctx.restore();
  if(u.hp<u.maxHp)miniBar(x,y-34-lift,u.hp/u.maxHp,28);};
drawCavalry=function(u){const x=u.x,y=u.y,f=u.face,g=Math.sin(u.anim*1.6);
  ell(x,y+2,16,5,'rgba(0,0,0,.25)');for(const lx of[-8,-4,5,9])line(x+lx,y-7,x+lx+g*3*(lx>0?1:-1),y+1,'#3a2410',2.2);
  ell(x,y-11,13,6,u.burn>0?'#a64':'#e8e2d4');ell(x+f*12,y-17,3.6,5.5,'#e8e2d4');ell(x+f*15,y-21,4.6,3,'#e8e2d4');ell(x+f*16,y-22,1,1,'#111');line(x-f*13,y-12,x-f*17,y-4,'#888',2.5);
  rect(x-3,y-27,6,11,'#c8ccd4');ell(x,y-30,3.3,3.3,'#aab0ba');poly([x-3,y-33,x+3,y-33,x,y-38],u.colr);
  if(u.cs==='charge')line(x-f*8,y-22,x+f*34,y-18,'#8a6a40',2.5);else line(x-f*4,y-20,x+f*20,y-44,'#8a6a40',2.2);
  if(u.cs==='charge'){ctx.fillStyle='#ddd';ell(x+f*35,y-18,2.2,2.2,'#eee');}
  if(u.banner)drawFlag(x-f*4,y-28,u);
  if(u.hp<u.maxHp){rect(x-10,y-44,20,2.5,'#400');rect(x-10,y-44,20*u.hp/u.maxHp,2.5,'#e44');}};
drawPrince=function(u){const c=u.prince||{},x=u.x,y=u.y,f=u.face||1,g=Math.sin(u.anim*1.6),s=1.45,ch=u.cs==='charge'||u.thrust>0,sh=u.shieldT>0;
  ell(x,y+3,24,7,'rgba(0,0,0,.28)');
  if(sh){ctx.strokeStyle=`rgba(255,230,140,${.5+.3*Math.sin(G.t*14)})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x+f*16,y-34,18,26,0,0,TAU);ctx.stroke();}
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  for(const lx of[-8,-4,5,9]){const ex=lx+g*3*(lx>0?1:-1);line(lx,-7,ex,1,'#e4e0d6',2.4);ell(ex,1.2,1.4,.9,'#555');}
  line(-f*13,-12,-f*17,-3,'#f2f0ea',3);ell(0,-11,13.5,6.4,u.burn>0?'#e0b090':'#fbfaf6');
  
  ell(f*12,-17,3.8,5.8,'#fbfaf6');ell(f*15.5,-21.5,4.8,3.1,'#fbfaf6');ell(f*16.6,-22.4,1,1,'#111');line(f*10,-22,f*11.5,-14,'#e6dcc0',2);
  ctx.fillStyle=c.col;ctx.beginPath();ctx.moveTo(-f*1,-29);ctx.quadraticCurveTo(-f*10,-23+g,-f*12,-12);ctx.lineTo(-f*3,-14);ctx.closePath();ctx.fill();ctx.strokeStyle=c.trim;ctx.lineWidth=1;ctx.stroke();
  rect(-3.6,-29,7.2,13,'#e2e7ee');rect(-3.6,-29,2,13,'#ffffff');rect(-3,-25,6,5,c.col);line(-3,-20.5,3,-20.5,c.trim,1);
  ell(0,-32,3.5,3.5,'#e8ecf2');ell(f*1.2,-31.6,1.8,2,'#f0c8a0');
  poly([-3.8,-34.5,3.8,-34.5,3.8,-38.4,1.9,-36.4,0,-39.6,-1.9,-36.4,-3.8,-38.4],'#ffd23a');ell(0,-35.6,.8,.8,'#e33');
  if(ch){line(-f*6,-22,f*40,-19,'#d8c090',2.6);poly([f*40,-20.6,f*45,-19,f*40,-17.4],'#eef');poly([f*30,-19.5,f*22,-17,f*30,-15],c.col);}
  else{line(-f*3,-18,f*18,-50,'#d8c090',2.2);poly([f*18,-50,f*12,-46,f*16.6,-47.8],'#eef');poly([f*16.4,-47,f*7,-44,f*14.6,-42.6],c.col);}
  if(sh){ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(f*5,-31);ctx.lineTo(f*15,-31);ctx.lineTo(f*15,-22);ctx.lineTo(f*10,-15);ctx.lineTo(f*5,-22);ctx.closePath();ctx.fill();
    ctx.fillStyle=c.col;ctx.beginPath();ctx.moveTo(f*6,-30);ctx.lineTo(f*14,-30);ctx.lineTo(f*14,-22.5);ctx.lineTo(f*10,-16.5);ctx.lineTo(f*6,-22.5);ctx.closePath();ctx.fill();drawCrest(f*10,-25,.75,c.crest,c.trim);}
  else{ctx.fillStyle=c.trim;ctx.beginPath();ctx.moveTo(-f*2,-27);ctx.lineTo(-f*8,-27);ctx.lineTo(-f*8,-22);ctx.lineTo(-f*5,-18);ctx.lineTo(-f*2,-22);ctx.closePath();ctx.fill();ctx.fillStyle=c.col;ctx.fillRect(f>0?-7.4:2.6,-26.4,4.8,3.6);}
  ctx.restore();
  const ty=y-72,w=70;rect(x-w/2-1,ty-1,w+2,7,'#000');rect(x-w/2,ty,w,5,'#401010');rect(x-w/2,ty,w*Math.max(0,u.hp/u.maxHp),5,u.hp>u.maxHp*.3?'#ffc23a':'#ff5a3a');
  txt(`👑 ${c.name||'Prince'}`,x,ty-5,11,'#fff4c0','center',true);if(u.hp<=u.maxHp*.3)txt('weak! gobble him!',x,ty+16,10,'#ffb08a','center',true);};
drawCamelRider=function(u){const x=u.x,y=u.y,f=u.face||1,w=Math.sin(u.anim||0),b=Math.abs(w)*1.2,burn=u.burn>0,fur=burn?'#f60':'#d4a464';
  ell(x,y+2,17,4,'rgba(0,0,0,.25)');if(u.dguard)ell(x,y+2,19,5,'rgba(255,220,120,.25)');
  for(const lx of[-9,-5,6,10])line(x+lx*f,y-14,x+lx*f+w*(lx<0?3:-3),y,'#b8874a',2.4);
  ell(x,y-17-b,15,7,fur);ell(x-2*f,y-23-b,7,6,fur);line(x+12*f,y-18-b,x+17*f,y-30-b,fur,4.5);ell(x+20*f,y-31-b,5.5,3.2,fur);
  ell(x+18.5*f,y-33-b,1,1,'#222');ell(x+24.5*f,y-30.5-b,1,.8,'#6a4a2a');line(x-15*f,y-18-b,x-17*f,y-12-b+w,'#b8874a',1.5); // eye, nose, tail
  
  const ry=y-27-b;line(x+f,ry,x+4*f,ry+6,'#5a4a3a',1.8);
  poly([x-3.6,ry-10,x+3.6,ry-10,x+4.4,ry,x-4.4,ry],burn?'#f60':'#e2cfa0');rect(x-3.6,ry-6,7.2,1.3,'#b0302a');
  ell(x,ry-12,2.5,2.5,'#c99a70');ell(x,ry-14,3.4,2.2,'#f4ecd8');ell(f*.8+x,ry-15.2,2.2,1.2,'#e8dcc0');rect(x-f*3.4-.4,ry-14,1,3,'#f4ecd8');
  if(u.cm==='bow'){const bx=x+f*3;ctx.strokeStyle='#7a4a1a';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(bx,ry-13);ctx.quadraticCurveTo(bx+f*5,ry-11,bx+f*2.5,ry-7);ctx.quadraticCurveTo(bx+f*5,ry-3,bx,ry-1);ctx.stroke();line(bx-(u.draw>0?f*2:0),ry-7,bx,ry-13,'#eee',.6);line(bx-(u.draw>0?f*2:0),ry-7,bx,ry-1,'#eee',.6);rect(x-f*4-1,ry-11,2,6,'#8a5a2a');}
  else{const sw=u.swing>0?-1.2:0;ctx.strokeStyle='#dfe4ea';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x+f*3,ry-7);ctx.quadraticCurveTo(x+f*(9+sw*-3),ry-11+sw*3,x+f*(8+sw*-4),ry-16+sw*5);ctx.stroke();rect(x+f*3-1,ry-7.6,2,1.4,'#c9a227');rect(x-f*4-1,ry-11,2,6,'#8a5a2a');}
  if(u.hp<u.maxHp){rect(x-9,y-56-b,18,2,'#400');rect(x-9,y-56-b,18*u.hp/u.maxHp,2,'#e44');}};
{const _f=drawDesertFauna;drawDesertFauna=function(u){if(!(u&&u.rc&&u.species==='camel'))return _f.apply(this,arguments);const rc=u.rc;u.rc=0;let r;try{r=_f.apply(this,arguments);}finally{u.rc=rc;}
  const x=u.x,y=u.y,b=Math.abs(Math.sin(u.anim||0))*1.5;
  if(u.rcChest){rect(x-8,y-45-b,16,10,'#7a4a1a');rect(x-8,y-45-b,16,3,'#a0662a');rect(x-8.5,y-41.5-b,17,1.4,'#e8c050');rect(x-1.5,y-42-b,3,4,'#e8c050');
      ell(x-4,y-46-b,2,1.4,'#ffd84a');ell(x+3,y-46.5-b,2,1.4,'#ffd84a');if(Math.sin(G.t*5)>.6)ell(x+R(-6,6),y-48-b,1.2,1.2,'#fff4b0');}
  return r;};}
// ======================= queue 136: knight hoard raids steal a FLAT 25% of the hoard at every tier =======================
// Old per-tier shares (partRK raidShare): T1 20%, T2 25%, T3 30%, T4 35%, T5 40%, T6 45%, T7+ 50%. Now every tier carries off 25%
// (raidTake still leaves at least 1 gold and takes at least 1). Tier still sets the champion's strength and escort size.
// Guardian dragon rules (queue 69-72) are untouched: standing guardians still stop the grab, and beating or eating the champion brings it all back.
const RK136={share:.25};
raidShare=function(T){return RK136.share;};
// ======================= queue 135: stolen raid gold that ESCAPES goes into King William's treasury =======================
// Before: a champion who reached the gate just vanished with his sacks (and his purse), and escorts who retreated home took their
// purses with them; none of it went anywhere. Now, on arrival at the castle gate, the stolen sacks + the champion's purse, and each escaped
// raider's purse, are added to the treasury (the castle gold piles, like taxes and caravans), with a small "+N gold to the king's treasury" alert.
const KT135={gap:1.2,gate:45};
function kgTreasuryAdd(n){n=Math.floor(n||0);if(!(n>0)||typeof goldPiles==='undefined'||!goldPiles||!goldPiles.length)return 0;
  const p=goldPiles.reduce((a,b)=>a.amt<=b.amt?a:b);p.amt+=n;G.kgRaidIn=(G.kgRaidIn||0)+n;G.kgPend=(G.kgPend||0)+n;
  float(GATE.x,GATE.y-90,`+${n} gold to the king's treasury`,'#ffd84a');return n;}
function kgPurse(u){if(!u||!u.rgT||u.rgDone)return 0;u.rgDone=true;const n=rgPurse(u.rgT,u.champ)+(u.rgP||0);u.rgP=0;return n;}
{const _e=raidEscaped;raidEscaped=function(){const r=RAID.cur,ch=r&&r.champ;const loot=r?Math.floor(r.loot||0):0,purse=kgPurse(ch);const res=_e.apply(this,arguments);
  const n=kgTreasuryAdd(loot+purse);G.kgChampEsc=(G.kgChampEsc||0)+1;
  if(n>0&&G.banner&&String(G.banner.text||'').indexOf('returns to King William')>=0)G.banner.sub=`+${n} gold to the king's treasury (${loot} stolen${purse?` + ${purse} purse`:''}). The hoard is smaller.`;
  return res;};}
function kgEscCheck(u,wasGone){if(!wasGone&&u&&u.gone&&u.rgT&&!u.rgDone&&!u.champ&&dist(u,GATE)<KT135.gate){G.kgEscN=(G.kgEscN||0)+1;kgTreasuryAdd(kgPurse(u));}}
{const _k=updKnight;updKnight=function(u,dt){const g=u&&u.gone;const r=_k.apply(this,arguments);kgEscCheck(u,g);return r;};}
{const _a=updArcher;updArcher=function(u,dt){const g=u&&u.gone;const r=_a.apply(this,arguments);kgEscCheck(u,g);return r;};}
{const _u=updParts;updParts=function(dt){const res=_u.apply(this,arguments);
  if(scene==='play'&&G&&G.kgPend>0&&G.t-(G.kgToastT||-99)>KT135.gap){G.kgToastT=G.t;if(typeof showToast==='function')showToast(`👑 +${G.kgPend} gold to the king's treasury`);G.kgPend=0;}
  return res;};}
// ======================= queue 137: CASTLES are bigger, clearer icons on the minimap and the big M map =======================
// Little castle silhouettes (two towers, a keep, crenellations, a gate and a pennant) with a soft halo and an outline, in place of the
// old 6-10 px squares: Lumenspire Citadel light (white/silver, blue outline), Doomforge Citadel dark (black iron, ember outline),
// King William's Castle Aldric in warm stone with a gold pennant, plus the two northern fortresses (Ironhold Gate light, Gorgrim War-Fort dark) a size smaller.
// Size: minimap 13 px wide (forts 10), big map 26 px (forts 19). Drawn last, on top of the fog, roads and unit dots.
const MAPC={mini:13,big:26,fort:.75,pal:{
  L:{f:'#f4f6ff',s:'#c3cbe8',o:'#2c3c86',g:'#5a6aa8',fl:'#7fd0ff',h:'rgba(255,255,255,.45)'},
  D:{f:'#2c2234',s:'#17111c',o:'#ff7a3a',g:'#ff5a20',fl:'#e0302a',h:'rgba(255,90,40,.35)'},
  K:{f:'#e2d6b8',s:'#ab9c7c',o:'#3a2a10',g:'#4a3418',fl:'#ffd84a',h:'rgba(255,230,150,.45)'}}};
function mapCastle(cx,cy,w,p,big){const h=w*.9,lw=big?1.5:1,tw=w*.27,top=cy-h*.55,bot=cy+h*.38,kw=w*.5;ctx.save();
  ctx.fillStyle=p.h;ctx.beginPath();ctx.ellipse(cx,cy,w*.78,h*.72,0,0,TAU);ctx.fill();
  const merl=(x,y,ww,n)=>{const m=ww/(2*n-1);for(let i=0;i<n;i++)ctx.rect(x+i*2*m,y-m*1.1,m,m*1.1);};
  ctx.beginPath();
  ctx.rect(cx-kw/2,cy-h*.3,kw,bot-(cy-h*.3));merl(cx-kw/2,cy-h*.3,kw,3);           // keep wall
  ctx.rect(cx-w/2,top,tw,bot-top);merl(cx-w/2,top,tw,2);                           // left tower
  ctx.rect(cx+w/2-tw,top,tw,bot-top);merl(cx+w/2-tw,top,tw,2);                     // right tower
  ctx.fillStyle=p.f;ctx.fill();ctx.strokeStyle=p.o;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.stroke();
  ctx.fillStyle=p.s;ctx.fillRect(cx+w/2-tw*.45,top+.5,tw*.45-lw*.5,bot-top-1);ctx.fillRect(cx-kw/2+lw*.5,bot-h*.12,kw-lw,h*.12-lw*.5);   // shading
  const gw=kw*.42,gh=h*.32;ctx.fillStyle=p.g;ctx.beginPath();ctx.moveTo(cx-gw/2,bot);ctx.lineTo(cx-gw/2,bot-gh+gw/2);ctx.arc(cx,bot-gh+gw/2,gw/2,Math.PI,0);ctx.lineTo(cx+gw/2,bot);ctx.closePath();ctx.fill(); // gate
  if(big){ctx.fillStyle=p.g;for(const sx of[-1,1])ctx.fillRect(cx+sx*(w/2-tw/2)-.8,top+h*.22,1.6,h*.14);}                       // tower windows
  const px=cx,py=cy-h*.3-w*.09;ctx.strokeStyle=p.o;ctx.lineWidth=big?1.2:.8;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-h*.38);ctx.stroke(); // pennant
  ctx.fillStyle=p.fl;ctx.beginPath();ctx.moveTo(px,py-h*.38);ctx.lineTo(px+w*.26,py-h*.3+Math.sin(G.t*4)*.6);ctx.lineTo(px,py-h*.22);ctx.closePath();ctx.fill();
  ctx.restore();}
function mapCastles(mmx,mmy,mmw,big){const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s,W=big?MAPC.big:MAPC.mini,P=MAPC.pal;
  if(typeof NR_TOWNS!=='undefined')for(const [n,k] of [['Ironhold Gate','L'],['Gorgrim War-Fort','D']]){const t=NRT(n);if(t&&(big?seen(t.x,t.y):true))mapCastle(X(t.x),Y(t.y),W*MAPC.fort,P[k],big);}
  if(typeof NR_CC!=='undefined')for(const k in NR_CC){const c=NR_CC[k];mapCastle(X(c.x),Y(c.y),W,P[k],big);}
  mapCastle(X(CASTLE.x),Y(CASTLE.y)+(big?2:1),W,P.K,big);G.mapCastleN=(G.mapCastleN||0)+1;
  // the princess and the dragon dot stay on top of the icons
  if(typeof PR!=='undefined'&&PR.state==='tower'){const pb=big?5:2.4;ell(X(PR.x),Y(PR.y),pb+1.5,pb+1.5,'#fff');ell(X(PR.x),Y(PR.y),pb,pb,'#f6c');}
  ell(X(D.x),Y(D.y),big?6:4,big?6:4,Math.floor(G.t*4)%2?'#f33':'#ff0');}
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{mapCastles(mmx,mmy,mmw,big);}catch(e){}return r;};}
// ===== queue 138: attack balance. Stomp is weak against creatures but strong against buildings; dive (crash stomp)
// is unchanged; bite beats stomp against enemies; direct fire is the weakest hit but burning things (ships most of all) burn harder.
const AB138={stompFoe:.3,stompBld:1.25,fireFoe:.25,fireShip:.5,fireSiege:.5,fireWood:.5,fireBld:.5,
  burnUnit:1.6,burnT:3,burnShip:3,burnSiege:1.25,burnWood:1.5,biteMin:24,st:0,dive:0,fire:0,burn:0};
{const _c=crashStomp;crashStomp=function(){AB138.dive++;try{return _c.apply(this,arguments);}finally{AB138.dive--;}};}
{const _s=doStomp;doStomp=function(){const k=!AB138.dive;if(k)AB138.st++;try{return _s.apply(this,arguments);}finally{if(k)AB138.st--;}};}
{const _f=applyFire;applyFire=function(){AB138.fire++;let r;try{r=_f.apply(this,arguments);}finally{AB138.fire--;}
  for(const u of units)if(!u.dead&&u.type!=='sea'&&u.burn===1.4)u.burn=AB138.burnT;return r;};}
{const _u=updFire;updFire=function(){AB138.burn++;try{return _u.apply(this,arguments);}finally{AB138.burn--;}};}
const ab138Foe=(d,how)=>{if(AB138.st&&how==='stomp')return d*AB138.stompFoe;if(AB138.fire&&how==='fire')return d*AB138.fireFoe;return d;};
{const _h=hurtUnit;hurtUnit=function(u,d,src){if(u&&!u.dead&&typeof d==='number'){
   if(src==='stomp'&&AB138.st)d*=AB138.stompFoe;
   else if(src==='fire'){if(AB138.fire)d*=AB138.fireFoe;else if(AB138.burn&&u.type!=='sea')d*=AB138.burnUnit;}
   else if(src==='bite'&&d<AB138.biteMin&&u.hp>d)d=Math.max(d,Math.min(AB138.biteMin,u.hp-1));}
  return _h.call(this,u,d,src);};}
{const _h=hurtSiege;hurtSiege=function(g,d){if(typeof d==='number'){if(AB138.st)d*=AB138.stompFoe;else if(AB138.fire)d*=AB138.fireSiege;else if(AB138.burn)d*=AB138.burnSiege;}return _h.call(this,g,d);};}
{const _u=updShip;updShip=function(){AB138.sb=(AB138.sb||0)+1;try{return _u.apply(this,arguments);}finally{AB138.sb--;}};}
{const _h=hurtShip;hurtShip=function(s,d,src){if(typeof d==='number'&&src==='fire'){if(AB138.fire)d*=AB138.fireShip;else if(AB138.sb)d*=AB138.burnShip;}else if(typeof d==='number'&&AB138.st)d*=AB138.stompFoe;return _h.call(this,s,d,src);};}
{const _h=hurtStruct;hurtStruct=function(s,d){if(s&&typeof d==='number'){if(AB138.st)d*=AB138.stompBld;else if(AB138.fire&&!stoneish(s))d*=AB138.fireWood;else if(AB138.burn&&!stoneish(s)&&s.kind!=='stonepile')d*=AB138.burnWood;}return _h.apply(this,[s,d].concat([].slice.call(arguments,2)));};}
{const _h=nrbHurt;nrbHurt=function(o,d,how){if(typeof d==='number'){if(AB138.st)d*=AB138.stompBld;else if(AB138.fire&&how==='fire')d*=AB138.fireBld;}return _h.apply(this,[o,d].concat([].slice.call(arguments,2)));};}
{const _h=nrTurHurt;nrTurHurt=function(t,d,how){if(typeof d==='number'){if(AB138.st)d*=AB138.stompBld;else if(AB138.fire&&how==='fire')d*=AB138.fireBld;}return _h.apply(this,[t,d].concat([].slice.call(arguments,2)));};}
{const _h=blFenceHit;blFenceHit=function(P,d){if(typeof d==='number'&&AB138.st)d*=AB138.stompBld;return _h.apply(this,[P,d].concat([].slice.call(arguments,2)));};}
{const _h=hyHurt;hyHurt=function(d,how){if(typeof d==='number')d=ab138Foe(d,how);return _h.apply(this,[d].concat([].slice.call(arguments,1)));};}
{const _h=grHurt;grHurt=function(d,how){if(typeof d==='number')d=ab138Foe(d,how);return _h.apply(this,[d].concat([].slice.call(arguments,1)));};}
{const _h=nsHurt;nsHurt=function(d,how){if(typeof d==='number')d=ab138Foe(d,how);return _h.apply(this,[d].concat([].slice.call(arguments,1)));};}
{const _h=dwHurt;dwHurt=function(d,how){if(typeof d==='number')d=ab138Foe(d,how);return _h.apply(this,[d].concat([].slice.call(arguments,1)));};}
{const _h=wzHurt;wzHurt=function(d,how){if(typeof d==='number')d=ab138Foe(d,how);return _h.apply(this,[d].concat([].slice.call(arguments,1)));};}
{const _h=mmBurn;mmBurn=function(m,d){if(typeof d==='number'&&AB138.fire)d*=AB138.fireFoe;return _h.call(this,m,d);};}

// ======================= queue 140 / 140a: both wizards come back every castle level (all modes) =======================
// "Beaten" and "reward" are now separate:
//   Storm Wizard: G.wzBeat = beaten this level (he, his tower and shield come back next level); G.nrOpen = the reward (barrier open).
//   Dark Wizard:  G.dwDown = beaten this level; G.dwKey = his volcano is drinkable, G.lavaUp = the purple triple lava shot (the rewards).
// The rewards last until the dragon dies: a defeat ends the run and the restart is a brand-new game (newGame() with no level) which
// clears every reward, so they must be won again. Beating a wizard again while holding his reward just says "beaten again" (no duplicate,
// rewards are plain on/off flags). Saves carry all of these flags in G, so loading a save restores exactly what that save had.
// The dark volcano stays drinkable while he is back (if you hold G.dwKey): his shield no longer locks you out, but he still fights you.
// Hard-mode hook (139f): WZ140.hpMul() is 1 in every mode for now; hard mode can return the mini-boss level scaling here.
const WZ140={hpMul:()=>1,back:0};
{const _w=wzMaxHp;wzMaxHp=function(){return Math.round(_w.apply(this,arguments)*WZ140.hpMul());};}
{const _s=dwStart;dwStart=function(){const fresh=!DWB.maxHp;const r=_s.apply(this,arguments);if(fresh&&WZ140.hpMul()!==1){DWB.maxHp=Math.round(DWB.maxHp*WZ140.hpMul());DWB.hp=G.dwHp>0?Math.min(G.dwHp,DWB.maxHp):DWB.maxHp;}return r;};}
{const _nl=nextLevel;nextLevel=function(){const back=[];if(G.wzBeat)back.push('Storm Wizard');if(G.dwDown)back.push('Dark Wizard');
  const r=_nl.apply(this,arguments);
  G.wzBeat=0;G.wzEaten=0;G.nrWzHp=0;Object.assign(WZB,{on:false,hp:0,maxHp:0,lvl:0,koT:0,said:0,cast:0,ice:[],marks:[],winds:[]});
  G.dwDown=0;G.dwEaten=0;G.dwHp=0;dwReset();
  if(back.length){WZ140.back++;G.wzBack=(G.wzBack||0)+1;if(typeof showToast==='function')showToast(`🧙 The ${back.join(' and the ')} ${back.length>1?'are':'is'} back! Your rewards are kept`);}
  return r;};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);const g=d&&d.G||{};
  if(g.wzBeat===undefined)G.wzBeat=g.nrOpen?1:0;   // pre-140 saves: an open barrier meant he was beaten
  if(g.dwKey===undefined)G.dwKey=g.dwDown?1:0;
  return r;};}

// ======================= queue 142 / 142a / 142b: only four kinds of on-screen direction arrows (all modes) =======================
// REMOVED: the small blue (knight) and green (archer) edge arrows that pointed at EVERY off-screen knight and archer (part6 drawHUD).
// KEPT: the gold LAIR arrow (partLA). ADDED, each only while it applies:
//   RAID arrow -> the hoard-raid party while it MARCHES to the lair (RAID.cur.phase==='march'; not during the warning or the run home)
//   PRINCE arrow -> the landed prince while his army hunts the dragon (princeActive, boss alive)
//   KING arrow -> King William while he CHARGES after the dragon (KA.phase==='charge')
const AR142={on:0,drawn:[],cnt:{raid:0,prince:0,king:0}};
{const _p=poly;poly=function(pts,c){if(AR142.on&&pts&&pts.length===6&&pts[0]===8&&pts[1]===0&&pts[2]===-6&&pts[3]===-6&&(c==='rgba(80,160,255,.85)'||c==='rgba(80,255,80,.85)')){AR142.cut=(AR142.cut||0)+1;return;}return _p.apply(this,arguments);};}
function ar142Targets(){const T=[];
  try{const r=RAID.cur;if(r&&r.phase==='march'){let t=r.champ&&!r.champ.dead?r.champ:(r.members||[]).find(u=>!u.dead);if(t)T.push({k:'raid',x:t.x,y:t.y,col:'#6ab0ff',lab:'RAID'});}}catch(e){}
  try{const c=PRN.cur;if(princeActive()&&c.boss&&!c.boss.dead&&!c.done)T.push({k:'prince',x:c.boss.x,y:c.boss.y,col:'#f0d050',edge:c.col,lab:'PRINCE'});}catch(e){}
  try{if(KA.phase==='charge'&&KA.u&&!KA.u.dead)T.push({k:'king',x:KA.u.x,y:KA.u.y,col:'#ffcc33',edge:'#a01818',lab:'KING'});}catch(e){}
  return T;}
function ar142Draw(){AR142.drawn=[];if(laHide())return;const T=ar142Targets();if(!T.length)return;
  const sm=VW<760,S=typeof SAFE!=='undefined'?SAFE:{l:0,r:0,t:0,b:0},M=sm?20:24,
    top=(TOUCH&&TOUCH.on?118:sm?96:140)+S.t+(typeof princeHudOn==='function'&&princeHudOn()?(sm?36:30):0),bot=VH-S.b-M-(TOUCH&&TOUCH.on?0:14),lft=S.l+M,rgt=VW-S.r-M;
  const taken=LA.last?[{x:LA.last.x,y:LA.last.y}]:[];ctx.setTransform(DPR,0,0,DPR,0,0);
  for(const t of T){const sx=(t.x-cam.x)*cam.z+VW/2,sy=(t.y-cam.y)*cam.z+VH/2;if(sx>30&&sx<VW-30&&sy>30&&sy<VH-30)continue;
    const cx=(lft+rgt)/2,cy=(top+bot)/2,dx=sx-cx,dy=sy-cy;const tx=dx>0?(rgt-cx)/dx:dx<0?(lft-cx)/dx:1e9,ty=dy>0?(bot-cy)/dy:dy<0?(top-cy)/dy:1e9,tt=Math.min(tx,ty),side=tx<ty?'v':'h';
    let x=clamp(cx+dx*tt,lft,rgt),y=clamp(cy+dy*tt,top,bot);
    const ok=(x,y)=>!laBlocked(x,y,14)&&!taken.some(q=>Math.hypot(q.x-x,q.y-y)<44);
    if(!ok(x,y)){let best=null;for(let k=1;k<60&&!best;k++)for(const sg of[1,-1]){const o=k*10*sg,nx=side==='v'?x:clamp(x+o,lft,rgt),ny=side==='v'?clamp(y+o,top,bot):y;if(ok(nx,ny)){best={x:nx,y:ny};break;}}if(best){x=best.x;y=best.y;}}
    const a=Math.atan2(sy-y,sx-x),pl=.5+.5*Math.sin(G.t*5),dist=Math.round(Math.hypot(t.x-D.x,t.y-D.y)/10);taken.push({x,y});
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(.5,.5);ctx.globalAlpha=.85+.15*pl;poly([24,0,-10,-14,-3,0,-10,14],t.col);ctx.lineWidth=2.5;ctx.strokeStyle=t.edge||'rgba(10,30,70,.9)';ctx.stroke();ctx.restore();ctx.globalAlpha=1;
    let lx=clamp(x-Math.cos(a)*30,lft+24,rgt-24),ly=clamp(y-Math.sin(a)*16+4,top+8,bot-2);txt(`${t.lab} ${dist} m`,lx,ly,10,t.col,'center');
    AR142.drawn.push({k:t.k,x,y,a});AR142.cnt[t.k]++;}}
{const _h=drawHUD;drawHUD=function(){AR142.on=1;AR142.cut=0;try{_h.apply(this,arguments);}finally{AR142.on=0;}};}
// drawn in the lair arrow's slot (after every HUD layer), so the HUD layout test treats all guide arrows alike
{const _l=drawLairArrow;drawLairArrow=function(){const r=_l.apply(this,arguments);ar142Draw();return r;};}
// ======================= queue 155: a bigger LAIR arrow, and a BIG flashing one while you carry Princess Elizabeth or a dark / light egg =======================
// Normal: 28% bigger than before (scale .5 -> .64). Carrying the princess (D.princess) or an egg (D.nrEgg, dark or light): ~1.85x normal (scale ~1.1-1.26), pulsing in
// size and flashing bright/dim about 3 times a second, with a glow. The arrow is pulled in from the screen edge by the extra length so its tip never leaves the screen.
// Same spot logic (laSpot, clear of the HUD and touch buttons) as before; the other guide arrows (queue 142) are unchanged.
const LA155={n:1.28,c:1.85,lastK:0,lastCarry:'',flash:0};
function la155Carry(){if(D.princess)return 'princess';if(D.nrEgg)return D.nrEgg==='W'?'light egg':'dark egg';return '';}
drawLairArrow=function(){LA.last=null;if(laHide()||laLairOnScreen()){ar142Draw();return;}
  ctx.setTransform(DPR,0,0,DPR,0,0);const p=laSpot(),dist=Math.round(Math.hypot(LAIR.x-D.x,LAIR.y-D.y)/10),cr=la155Carry(),glow=!!cr,pl=.5+.5*Math.sin(G.t*6),fl=Math.sin(G.t*19)>0;
  const base=.5*LA155.n,k=glow?base*LA155.c*(.94+.12*pl):base,pull=Math.max(0,24*k-12),ax=p.x-Math.cos(p.a)*pull,ay=p.y-Math.sin(p.a)*pull;
  const lp=glow?pull+10:pull*.6,lx=clamp(p.lx-Math.cos(p.a)*lp,30,VW-30),ly=clamp(p.ly-Math.sin(p.a)*lp*.6,14,VH-6);
  LA155.lastK=k;LA155.lastCarry=cr;LA155.flash=glow?(fl?1:0):0;
  LA.last={x:ax,y:ay,ang:p.a,dist,glow,lx,ly,k,carry:cr};
  const egg=cr==='dark egg',col=!glow?'#d8b060':egg?(fl?'#e0a0ff':'#9a50e0'):(fl?'#fff27a':'#ffc21e'),sh=egg?'rgba(200,120,255,1)':'rgba(255,200,40,1)';
  ctx.save();ctx.translate(ax,ay);ctx.rotate(p.a);ctx.scale(k,k);
  if(glow){ctx.shadowColor=sh;ctx.shadowBlur=(fl?18:8)+8*pl;}
  ctx.globalAlpha=glow?(fl?1:.62):.85;poly([24,0,-10,-14,-3,0,-10,14],col);
  ctx.shadowBlur=0;ctx.lineWidth=2;ctx.strokeStyle=glow?(fl?'#ffffff':'#fff6c0'):'rgba(60,40,10,.85)';ctx.stroke();ctx.restore();ctx.globalAlpha=1;
  txt(`LAIR ${dist} m`,lx,ly,glow?12:11,glow?'#fff0a0':'#ffe2a0','center');
  if(glow)txt(cr==='princess'?'\u265b take her home!':`take the ${cr} home!`,lx,ly+(ly>VH/2?-13:13),10,egg?'#e8c8ff':cr==='light egg'?'#fff8c0':'#ffc0e0','center',false);
  ar142Draw();};

// ======================= queue 143 / 143a: every tiger is an ALPHA that guards its own turf (all modes) =======================
// Alpha rules (same as the white elephant, item 129): a tiger above 50% health shrugs off a bite (it stings him); at/below 50% he is
// dizzy (stars) and can be gulped. Item 119's +20% alpha hit bonus. Alpha level scaling: health +15% and damage +6% per castle level
// (TG143.lvHp / TG143.lvDm: the hard-mode switch (139j, 7.5% compounding) can swap these later; hard mode is NOT built).
// Tigers keep hunting tapirs, capybaras and monkeys (partHN) and now GUARD A TURF: a circle (TG143.R) around the middle of their home ground.
// A dragon on the ground inside it, or a soldier/hunter who walks in, is attacked; once the intruder leaves, the tiger walks back.
// 143a: tigers are drawn x1.6 on top of their own x1.15 art (~x1.84 overall), bigger than lions (x1.35) and male lions (x1.65). Lions are unchanged.
const TG143={hp0:70,bite0:7,th:.5,R:450,leash:700,pts:150,sz:1.6,szR:8,
  lvHp:l=>1+.15*(l-1),lvDm:l=>1+.06*(l-1),base:{hp:FAUNA.tiger.hp,bite:FAUNA.tiger.bite,aggro:FAUNA.tiger.aggro}};
function tgLv(){return (G&&G.lvl)||1;}
function tgHp(l){return Math.round(TG143.hp0*TG143.lvHp(l||tgLv()));}
function tgBite(l){return +(TG143.bite0*AL119.mul*TG143.lvDm(l||tgLv())).toFixed(2);}
AL119.before.tiger=TG143.base.bite;
SZ131.tiger=TG143.sz;SZ131_R.tiger=TG143.szR;
function tgTurf(u){if(!u.tgTurf){const H=u.home;u.tgTurf=H?{x:H.x+H.w/2,y:H.y+H.h/2}:{x:u.x,y:u.y};}return u.tgTurf;}
function tgMake(u){const mx=tgHp(),k=u.maxHp?u.hp/u.maxHp:1;u.tgA=1;u.alpha=1;u.maxHp=mx;u.hp=Math.max(1,Math.round(mx*Math.min(1,k)));u.tgL=tgLv();tgTurf(u);return u;}
function tgSync(){const F=FAUNA.tiger;F.bite=tgBite();F.hp=tgHp();F.say=`Tiger swipe! -${Math.round(F.bite)}`;
  for(const u of units)if(!u.dead&&u.type==='animal'&&u.species==='tiger'&&(!u.tgA||u.tgL!==tgLv()))tgMake(u);}
function tgIntruder(u){const T=tgTurf(u);let best=null,bd=TG143.R*TG143.R;
  for(const v of units){if(v.dead||v.gone||v.inside||!(v.type==='knight'||v.type==='archer'||v.type==='hunter'))continue;const d=(v.x-T.x)**2+(v.y-T.y)**2;if(d<bd){bd=d;best=v;}}
  return best;}
// AI: the dragon (on the ground) inside the turf -> the tiger hunts it down (leashed); a soldier/hunter inside -> pounce on him; otherwise its usual life (hunting prey),
// and if it has wandered well off its turf with nothing to do, it walks home
{const _uw=updWild;updWild=function(u,dt){
  if(!u||u.dead||u.species!=='tiger'||!u.tgA||G.over||G.won||u.burn>0||u.bolted>0)return _uw.apply(this,arguments);
  const T=tgTurf(u),F=FAUNA.tiger,dIn=Math.hypot(D.x-T.x,D.y-T.y)<TG143.R&&D.alt<.4,uT=Math.hypot(u.x-T.x,u.y-T.y);
  if(dIn&&uT<TG143.leash){u.tgGuard=1;if(!u.tgRoar||G.t-u.tgRoar>8){u.tgRoar=G.t;G.tgTurfAlarm=(G.tgTurfAlarm||0)+1;if(dist(u,D)<1400)float(u.x,u.y-60,'ROARRR! This is MY turf!','#ffb060');}
    if(u.hPrey&&typeof hnDrop==='function')hnDrop(u);
    const a0=F.aggro;F.aggro=1e4;try{return _uw.apply(this,arguments);}finally{F.aggro=a0;}}
  const I=uT<TG143.leash?tgIntruder(u):null;
  if(I){u.tgGuard=2;u.cd=(u.cd||0)-dt;const Z=ZONES[u.zone],ox=u.x,oy=u.y,dd=dist(u,I);u.state='hunt';
    if(dd>30)moveTo(u,I.x,I.y,F.sp*1.05,dt);else if(u.cd<=0){u.cd=F.cd;hurtUnit(I,F.bite*3,'tiger');G.tgIntruderHits=(G.tgIntruderHits||0)+1;if(dist(u,D)<1200)float(I.x,I.y-40,'Tiger pounce!','#ffb060');}
    if(Z&&!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}u.anim=(u.anim||0)+dt*8;return;}
  if(u.tgGuard){u.tgGuard=0;u.state='idle';u.tgHome=1;}
  if(u.tgHome||(!u.hPrey&&uT>TG143.R*1.4)){if(uT<TG143.R*.5){u.tgHome=0;}else{const Z=ZONES[u.zone],ox=u.x,oy=u.y;moveTo(u,T.x,T.y,F.sp*.7,dt);if(Z&&!Z.ok(u.x,u.y)&&Z.ok(ox,oy)){u.x=ox;u.y=oy;u.tgHome=0;}u.anim=(u.anim||0)+dt*6;return;}}
  return _uw.apply(this,arguments);};updWild._base=_uw._base;}
// alpha rule: above 50% a bite is shrugged off (and stings him)
{const prev=TOUGH.tiger;TOUGH.tiger={chk:u=>u.tgA?u.hp>u.maxHp*TG143.th:!!(prev&&prev.chk(u)),
  hit:u=>{if(!u.tgA){if(prev)prev.hit(u);return;}hurtUnit(u,Math.ceil(u.maxHp*.15),'bite');u.roarFx=1.2;G.tgShrug=(G.tgShrug||0)+1;
    if(dist(u,D)<1200)float(u.x,u.y-70,'The tiger shrugs off the bite! Wear him below 50% first','#ffd27a');}};}
// beaten / gulped: points
function tgDown(u){if(u._tgDown)return;u._tgDown=1;G.stats.kPts=(G.stats.kPts||0)+TG143.pts;G.tgBeaten=(G.tgBeaten||0)+1;if(dist(u,D)<1500)float(u.x,u.y-70,`The alpha tiger is ${u.eaten?'gulped':'beaten'}! +${TG143.pts}`,'#ffd9a0');}
{const _hu=hurtUnit;hurtUnit=function(u){const w=u&&!u.dead&&u.tgA;const r=_hu.apply(this,arguments);if(w&&u.dead)tgDown(u);return r;};}
{const _e=eatUnit;eatUnit=function(u){const w=u&&!u.dead&&u.tgA;const r=_e.apply(this,arguments);if(w&&u.dead)tgDown(u);return r;};}
// dizzy stars once he is at/below 50% (edible) + a health bar while hurt
{const _da=drawAnimal;drawAnimal=function(u){const r=_da.apply(this,arguments);if(u&&u.tgA&&!u.dead){const k=szBase(u)*1.15;
  if(u.hp<=u.maxHp*TG143.th){if(!u.tgDz){u.tgDz=1;G.tgDizzy=(G.tgDizzy||0)+1;}const hy=u.y-30*k,t=G.t*3.2;for(let i=0;i<3;i++){const a=t+i*TAU/3;hnStar(u.x+Math.cos(a)*12*k,hy+Math.sin(a)*4,3.2,i%2?'#ffe35a':'#fff7c0');}}
  if(u.hp<u.maxHp){const w=44,y=u.y-34*k;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(u.x-w/2,y,w,5);ctx.fillStyle=u.hp>u.maxHp*TG143.th?'#e05050':'#ffd23a';ctx.fillRect(u.x-w/2,y,w*Math.max(0,u.hp/u.maxHp),5);}}return r;};}
{const _up=updParts;updParts=function(dt){const r=_up.apply(this,arguments);if(scene==='play'&&G&&!G.over)tgSync();return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{tgSync();}catch(e){}return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);try{for(const u of units)if(u.species==='tiger')u.tgL=0;tgSync();}catch(e){}return r;};}
if(typeof REGION_SUB!=='undefined'&&REGION_SUB.jungle&&!/alpha tigers/.test(REGION_SUB.jungle))REGION_SUB.jungle+=' Alpha tigers guard their own turf.';

// ======================= queue 144a: NORMAL mode King William is weaker (all non-hard modes) =======================
// -25% attack (sword swing and shield bash) and -50% health compared with before; he still scales with the castle level exactly as
// before (health 600 +100/level up to 1600, sword 10 +1.5/level up to 22, bash 8+level, all then x0.5 / x0.75). Easy mode keeps its
// own extra reduction on top. HARD-MODE HOOK: KW144.full() returning true (hard mode, item 139, not built yet) gives him full strength.
const KW144={hpMul:.5,atkMul:.75,full:()=>!!(G&&G.hard)};
{const _k=kaStats;kaStats=function(){const S=_k.apply(this,arguments);if(KW144.full())return S;
  S.hp=Math.round(S.hp*KW144.hpMul);S.dmg=Math.round(S.dmg*KW144.atkMul);S.bash=Math.round(S.bash*KW144.atkMul);return S;};}

// ======================= queue 145 / 145a / 145b: bite = 50, eat at 50 or less; bite buildings; stronger stomp =======================
// 145 (NORMAL mode): the bite deals 50 damage to an enemy. A target with 50 health or less is eaten in that bite (as before).
//   A plain soldier/animal with more than 50 health is no longer swallowed whole: the bite takes 50 off it, and the next bite eats it.
//   Never eaten (unchanged): King William (CLANG; his dizzy-bite stays 40), Princess Elizabeth, the guardian dragons.
//   Alphas / champions / the prince / bears / wild dragons keep their own "wear it down below X% first" rule; every bite on them now
//   deals 50 (never below 1 HP) instead of 18-24, and once they are below their line they are eaten whole as before.
//   Bosses (griffin, hydra, Nessie, the wizards) keep their own boss bites (18 / 14) - not units, not changed.
//   HARD-MODE HOOK (139b): BT145.on() (false in hard mode) and BT145.mustHurtFirst(u) (return true for a fighter at full health
//   to force "damage before you can eat").
// 145a (all modes): a bite on a building: wooden 30, stone 25 (realm turrets 32 -> 25, NR_TUR_BITE in i.js).
// 145b (all modes): stomp vs soldiers & animals 18 -> 30 (stompFoe .3 -> .5; also scales stomp vs champions, bosses and siege x5/3).
const BT145={dmg:50,eatAt:50,wood:30,stone:25,oldMin:24,on:()=>!(G&&G.hard),mustHurtFirst:u=>false,hits:0,bld:0,last:null,
  types:['villager','animal','crew','archer','knight','hunter'],
  nrStone:{elfspire:1,dwhall:1,dwforge:1,dwmine:1,dwgate:1,orcfort:1,orcwall:1,cyccave:1}};
AB138.stompFoe=.5;
{let kingBite=0;Object.defineProperty(AB138,'biteMin',{get:()=>BT145.on()&&!kingBite?BT145.dmg:BT145.oldMin,set:v=>{BT145.oldMin=v;},configurable:true});
 const _h=hurtUnit;hurtUnit=function(u,d,src){const k=src==='bite'&&u&&u.isKingArmor;if(k)kingBite++;try{return _h.apply(this,arguments);}finally{if(k)kingBite--;}};}
{const _b=btDmg;btDmg=function(u){return BT145.on()&&!(u&&u.isKingArmor)?BT145.dmg:_b.apply(this,arguments);};}
function bt145Safe(u){return !u||u.dead||u.inside||u.princess||u.isPrincess||u.isKing||u.king||u.isKingArmor||u.isPrince||u.champ||u.alpha||u.tgA||u.gd||u.guardian||u.carried||u.grabbed;}
function bt145Tough(u){return (typeof toughNow==='function'&&toughNow(u))||u.species==='bear'||u.species==='elephant'||u.species==='sandworm'||u.type==='sea'||!!TOUGH[toughKey(u)];}
function bt145Big(u){return BT145.on()&&!bt145Safe(u)&&BT145.types.includes(u.type)&&!bt145Tough(u)&&(u.hp>BT145.eatAt||!!BT145.mustHurtFirst(u));}
let BT145_SKIP=null;
{const _bt=biteTargets;biteTargets=function(){const T=_bt.apply(this,arguments);return BT145_SKIP?T.filter(u=>!BT145_SKIP.has(u)):T;};}
function bt145Bld(){if(D.alt>=.3)return false;const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70;let best=null,bd=1e9,nr=false;
  for(const s of structures){if(s.state==='ruin')continue;const r=(s.r||Math.max(s.w||0,s.h||0)/2||40)+28,d=Math.hypot(s.x-mx,s.y-my);if(d<r&&d<bd){bd=d;best=s;nr=false;}}
  if(typeof nrbList==='function'&&D.y<MWY0+400)for(const o of nrbList()){if(o.bst!=='ok')continue;const r=NR_BLD[o.k][1]*(o.s||1)*.7+20,d=Math.hypot(o.x-mx,o.y-my);if(d<r&&d<bd){bd=d;best=o;nr=true;}}
  if(!best)return false;let st,dmg;
  if(nr){st=!!BT145.nrStone[best.k];dmg=st?BT145.stone:BT145.wood;nrbHurt(best,dmg,'bite');}
  else{st=stoneish(best);dmg=st?BT145.stone:BT145.wood;const hv=HEAVY;HEAVY=true;try{hurtStruct(best,dmg);}finally{HEAVY=hv;}if(!st)splinters(best.x,best.y,3);}
  BT145.bld++;BT145.last={bld:best.kind||best.k,stone:st,dmg};D.eatCD=.45;D.eatT=.3;G.shake=Math.max(G.shake||0,2.5);
  float(best.x,best.y-50,`CRUNCH! -${dmg}`,st?'#d8d8d8':'#e8c090');if(typeof SFX!=='undefined'&&SFX.chomp)SFX.chomp(1);return true;}
{const _te=tryEat;tryEat=function(){
  if(!G||G.over||G.won||scene!=='play'||D.eatCD>0||D.princess||D.carry)return _te.apply(this,arguments);
  let T=[];try{T=biteTargets();}catch(e){}
  if(T.length&&bt145Big(T[0])){const u=T[0];if(typeof dgTry==='function'&&dgTry(u,'bite')){D.eatCD=.45;return;}
    const h0=u.hp,dm=Math.min(BT145.dmg,Math.max(0,Math.ceil(u.hp)-1));if(dm>0)hurtUnit(u,dm,'bite');const dealt=Math.max(0,Math.round(h0-(u.dead?0:u.hp)));BT145.hits++;BT145.last={sp:u.species||u.type,dealt,hp:u.hp};
    if(typeof btCue==='function')btCue(u,dealt);if(!u.dead&&dist(u,D)<1200)float(u.x,u.y-56,u.hp<=BT145.eatAt?'Weak enough - bite again to eat!':'Too big to swallow - keep biting!','#ffd27a');
    D.eatCD=D.alt<.3?.45:.9;D.eatT=.3;return;}
  const big=T.filter(bt145Big);BT145_SKIP=big.length?new Set(big):null;const cd0=D.eatCD;let r;
  try{r=_te.apply(this,arguments);}finally{BT145_SKIP=null;}
  if(!T.length&&D.eatCD===.25&&cd0!==.25)bt145Bld();
  return r;};}

// ======================= queue 146: repeat wizard wins give a PERMANENT +2.5% attack (all modes) =======================
// The FIRST time you beat a wizard in a game you get his reward (140/140a). Every LATER win over a wizard you already beat in this game
// (Storm or Dark, he comes back each castle level) adds +2.5% to ALL dragon attacks: bite, stomp, dive, claw scratch, fire + burning, lava.
// Additive: n repeat wins = +2.5% x n (10 repeat wins = +25%). PERMANENT: kept through levels AND through losing the dragon (a new game
// keeps it) - stored in its own browser key (like achievements) and also written into every save; loading a save keeps the larger count.
// The eat line stays 50 HP (145); a bite that was meant to leave a target alive (hp-1 cap) still leaves it alive.
const PB146={step:.025,key:'dr_perm_v1',n:0,c:0,in:0,
  mul(){return 1+PB146.step*PB146.n;},
  load(){try{const j=JSON.parse(localStorage.getItem(PB146.key)||'null');if(j&&j.atk>0)PB146.n=Math.max(PB146.n,j.atk|0);}catch(e){}},
  save(){try{localStorage.setItem(PB146.key,JSON.stringify({v:1,atk:PB146.n}));}catch(e){}if(G)G.pb146=PB146.n;}};
PB146.load();
function pb146Win(who){PB146.n++;PB146.save();G.pb146Wins=(G.pb146Wins||0)+1;
  boostAlert('⚔️ Attack up! +2.5%',`${who} beaten again · all your attacks +${(PB146.step*PB146.n*100).toFixed(1).replace(/\.0$/,'')}% for good (kept even if you lose this dragon)`);}
{const _d=wzDefeat;wzDefeat=function(){const had=!!G.nrOpen,was=!!WZB.on;const r=_d.apply(this,arguments);if(had&&was)pb146Win('Storm Wizard');return r;};}
{const _d=dwDefeat;dwDefeat=function(){const had=!!(G.lavaUp&&G.dwKey),was=!!DWB.on;const r=_d.apply(this,arguments);if(had&&was)pb146Win('Dark Wizard');return r;};}
// dragon-attack context: damage dealt while one of these runs is the dragon's
for(const nm of['tryEat','doStomp','crashStomp','applyFire','updFire','lavaSplash','clawScratch']){
  const f={tryEat,doStomp,crashStomp,applyFire,updFire,lavaSplash,clawScratch}[nm];
  const w=function(){PB146.c++;try{return f.apply(this,arguments);}finally{PB146.c--;}};
  if(nm==='tryEat')tryEat=w;else if(nm==='doStomp')doStomp=w;else if(nm==='crashStomp')crashStomp=w;else if(nm==='applyFire')applyFire=w;
  else if(nm==='updFire')updFire=w;else if(nm==='lavaSplash')lavaSplash=w;else clawScratch=w;}
// scale once at the OUTERMOST damage funnel (nested funnels, e.g. hurtUnit -> hurtSea, dwHit -> dwHurt, are not scaled twice)
function pb146Wrap(f,di,cap){return function(){const a=[].slice.call(arguments);
  if(!PB146.c||PB146.in||PB146.n<=0||typeof a[di]!=='number'||!(a[di]>0))return f.apply(this,a);
  const d0=a[di];a[di]=d0*PB146.mul();if(cap){const u=a[0];if(u&&a[2]==='bite'&&typeof u.hp==='number'&&d0<u.hp)a[di]=Math.min(a[di],Math.max(d0,u.hp-1));}
  G.pb146Dmg=(G.pb146Dmg||0)+(a[di]-d0);PB146.in++;try{return f.apply(this,a);}finally{PB146.in--;}};}
hurtUnit=pb146Wrap(hurtUnit,1,true);hurtSea=pb146Wrap(hurtSea,1);hurtShip=pb146Wrap(hurtShip,1);hurtSiege=pb146Wrap(hurtSiege,1);hurtStruct=pb146Wrap(hurtStruct,1);
nrbHurt=pb146Wrap(nrbHurt,1);nrTurHurt=pb146Wrap(nrTurHurt,1);blFenceHit=pb146Wrap(blFenceHit,1);mmBurn=pb146Wrap(mmBurn,1);
hyHurt=pb146Wrap(hyHurt,0);grHurt=pb146Wrap(grHurt,0);nsHurt=pb146Wrap(nsHurt,0);dwHit=pb146Wrap(dwHit,0);dwHurt=pb146Wrap(dwHurt,0);wzHurt=pb146Wrap(wzHurt,0);
{const _n=newGame;newGame=function(){const r=_n.apply(this,arguments);PB146.load();G.pb146=PB146.n;return r;};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);const g=d&&d.G||{};if(g.pb146>PB146.n){PB146.n=g.pb146|0;PB146.save();}G.pb146=PB146.n;return r;};}

// ======================= queue 147: tax collectors ride HORSES (all modes) =======================
// Every tax collector rides a brown horse (purple saddle cloth): 2x faster than on foot (96 riding his route, 140 fleeing), but when an
// escort is with him he slows to the guards' walking pace so they keep up. Like mounted knights, FIRE or a STOMP that he survives throws
// him off: the horse bolts (a free horse runs wild) and he carries on on foot at the old speed. A bite simply gobbles horse and rider.
const TX147={sp:2,cur:0,off:0};
const tx147Rides=u=>u&&u.tax&&!u.dead&&!u.txFoot;
{const _m=moveTo;moveTo=function(u,tx,ty,sp,dt){if(TX147.cur&&u===TX147.cur&&typeof sp==='number')sp*=TX147.sp;return _m.call(this,u,tx,ty,sp,dt);};}
{const _t=updTax;updTax=function(u,dt){const ride=tx147Rides(u)&&!(typeof txeOf==='function'&&txeOf(u).length);const p=TX147.cur;TX147.cur=ride?u:0;
  if(tx147Rides(u))u.anim=(u.anim||0)+dt*(ride?6:2);try{return _t.apply(this,arguments);}finally{TX147.cur=p;}};}
function tx147Off(u){u.txFoot=1;TX147.off++;G.tx147Off=(G.tx147Off||0)+1;
  const h=mkUnit('animal',u.x+R(-10,10),u.y+8,{species:'horse',wild:true,zone:'any',home:{x:u.x-300,y:u.y-200,w:600,h:400},hp:18,maxHp:18,free:true,bolted:4,t:0,face:-(u.face||1)});units.push(h);
  if(dist(u,D)<1200)float(u.x,u.y-44,'Whoa! My horse!','#ffe0a0');}
{const _h=hurtUnit;hurtUnit=function(u,d,src){const r=_h.apply(this,arguments);if(tx147Rides(u)&&u.hp>0&&(src==='fire'||src==='stomp'))tx147Off(u);return r;};}
function tx147Horse(u){const x=u.x,y=u.y,f=u.face||1,g=Math.sin((u.anim||0)*1.6);
  ell(x,y+2,16,5,'rgba(0,0,0,.25)');for(const lx of[-8,-4,5,9])line(x+lx,y-7,x+lx+g*3*(lx>0?1:-1),y+1,'#3a2410',2.2);
  const c=u.burn>0?'#a64':'#8a5a32';ell(x,y-11,13,6,c);rect(x-7,y-15,14,6,'#5a2a6a');rect(x-7,y-10,14,1.5,'#e0c050');
  ell(x+f*12,y-17,3.6,5.5,c);ell(x+f*15,y-21,4.6,3,c);ell(x+f*16,y-22,1,1,'#111');line(x+f*10,y-21,x+f*8,y-14,'#3a2410',2);line(x-f*13,y-12,x-f*17,y-4,'#3a2410',2.5);}
{const _p=drawPerson;drawPerson=function(u){if(!tx147Rides(u))return _p.apply(this,arguments);tx147Horse(u);tx147Bag(u);ctx.save();ctx.translate(0,-13);try{return _p.apply(this,arguments);}finally{ctx.restore();}};}
// riding: the coin sack hangs as a saddlebag on the horse's rump (drawn before the rider), only the tall hat is drawn on top
function tx147Bag(u){const f=u.face||1,x=u.x-f*10,y=u.y-9,s=4+Math.min(5,(u.sack||0)/5);ell(x,y,s,s+1,'#a07a40');ell(x,y-s,2.4,1.6,'#7a5a28');ctx.fillStyle='#ffe58a';ctx.font='bold 7px Georgia';ctx.textAlign='center';ctx.fillText('$',x,y+2);}
{const _s=drawTaxSack;drawTaxSack=function(u){if(!tx147Rides(u))return _s.apply(this,arguments);rect(u.x-5,u.y-35,10,3,"#2a1a2a");rect(u.x-3,u.y-39,6,4,"#2a1a2a");};}
// ===== QUEUE 147a-147e: mounted tax collectors BOLT to the castle when they see the dragon; up to 4 at once, one per region (east, north, south, desert) =====
// The escort call is unchanged (147b): 2/3/4 guards at 25/40/60 coins from a patrol he passes within 200 px.
const TXR={see:450,cap:4,capBroken:2,regs:['east','north','south','desert'],maxStops:4,bolts:0};
function txRegion(x,y){return x<0?'desert':x>=3700?'east':y<2200?'north':'south';}
// ===== QUEUE 148/148a/148b: hidden-gold earning tiers - WORKING buildings 4x, MARKETS 2.5x, HOUSES 1x =====
const EC148={work:new Set(['smithy','bakery','sawmill','minehead','cabin','barn']),market:new Set(['stall','fishmonger','jeweler']),workMul:4,marketMul:2.5,workCap:60,
  nm:{sawmill:'the lumber camp',minehead:'the mine',cabin:'the hunters\' cabin'}};
for(const k of EC148.work)EC_SHOP.add(k);
const ec148Tier=s=>EC148.work.has(s.kind)?'work':EC148.market.has(s.kind)?'market':ecHouse(s)?'house':null;
const ec148Rate=s=>{const t=ec148Tier(s);return EC.houseRate*(t==='work'?EC148.workMul:t==='market'?EC148.marketMul:1);};
const ec148Cap=s=>{const t=ec148Tier(s);return t==='work'?EC148.workCap:t==='market'?EC.shopCap:EC.houseCap;};
ecUpd=function(dt){for(const s of structures){if(!ec148Tier(s))continue;ecInit(s);const c=ec148Cap(s);if(s.state==='ok'&&s.sg<c)s.sg=Math.min(c,s.sg+ec148Rate(s)*dt);}};
const ec148Key=s=>s.kind+'@'+Math.round(s.x)+','+Math.round(s.y);
const ec148Lone=s=>s.state==='ok'&&EC148.work.has(s.kind)&&!(s.v>=0)&&!s.market; // a working site outside any village or market: its own tax stop
{const _p=ecPayers;ecPayers=function(tg){if(tg&&tg.wk)return structures.filter(s=>s.state==='ok'&&ec148Key(s)===tg.wk);return _p.apply(this,arguments);};}
{const _t=taxTargets;taxTargets=function(){const T=_t.apply(this,arguments);
  for(const s of structures){if(!ec148Lone(s))continue;const k=ec148Key(s),t={x:s.x,y:s.y+50,wk:k,mk:k,name:(s.kind==='cabin'&&s.cb!==undefined?(CABINS[s.cb]&&CABINS[s.cb].name||['Deepwood north','Deepwood south','Eastwood'][s.cb])+' cabin':EC148.nm[s.kind]||s.kind)};
    const P=ecPayers(t);if(P.length){t.amt=P.reduce((a,q)=>a+ecTaxable(q),0);T.push(t);}}
  for(const t of T)t.rg=txRegion(t.x,t.y);return T;};}
function tx147Order(T){const out=[];let p={x:GATE.x,y:GATE.y};const L=T.slice();while(L.length){L.sort((a,b)=>dist(a,p)-dist(b,p));p=L.shift();out.push(p);}return out;}
spawnTaxman=function(){const act=units.filter(u=>u.tax&&!u.dead),have=new Set(act.map(u=>u.txRg)),by={};
  for(const t of taxTargets())(by[t.rg]=by[t.rg]||[]).push(t);
  const sum=r=>by[r].reduce((a,t)=>a+(t.amt||0),0),free=TXR.regs.filter(r=>!have.has(r)&&by[r]&&by[r].length).sort((a,b)=>sum(b)-sum(a)); // richest uncovered region first
  if(!free.length)return null;const rg=free[0];const route=tx147Order(by[rg].sort(()=>Math.random()-.5).slice(0,TXR.maxStops));
  const u=mkUnit('villager',GATE.x,GATE.y+20,{job:'tax',tax:true,route,ri:0,sack:0,hp:10,maxHp:10,shirt:'#5a2a6a',home:{x:GATE.x,y:GATE.y+20},v:-1});u.txRg=rg;units.push(u);
  const ne=G.easy?1:RI(1,2);for(let i=0;i<ne;i++){const k=mkUnit('knight',GATE.x+R(-20,20),GATE.y+10,{hp:45,maxHp:45,atk:0,colr:'#c9a227',escort:u,eo:i?-1:1,born:G.t});units.push(k);}
  G.taxmen=(G.taxmen||0)+1;return u;};
const tx147Cap=()=>castleHealth('gate')>0?TXR.cap:TXR.capBroken;
{const _u=updTaxes;updTaxes=function(dt){const n0=G.taxmen||0,t0=G.taxT;const r=_u.apply(this,arguments);
  if(t0!==undefined&&G.taxT>t0&&(G.taxmen||0)===n0&&units.filter(u=>u.tax&&!u.dead).length<tx147Cap())spawnTaxman();return r;};}
{const _t=updTax;updTax=function(u,dt){if(!tx147Rides(u)||G.over||u.dead)return _t.apply(this,arguments);
  const dd=dist(u,D);if(!u.txBolt&&dd<TXR.see){u.txBolt=1;TXR.bolts++;G.tx147Bolt=(G.tx147Bolt||0)+1;if(dd<1200)float(u.x,u.y-44,'The dragon! Back to the castle!','#ffe0a0');}
  if(!u.txBolt)return _t.apply(this,arguments);
  if(u.route)u.ri=u.route.length;u.wait=0;if(u.state==='flee')u.state='walk';const hx=GATE.x,hy=GATE.y+10;
  if(dist(u,{x:hx,y:hy})<22)return _t.apply(this,arguments); // home: the normal delivery line
  const p=TX147.cur;TX147.cur=u;try{moveTo(u,hx,hy,70,dt);}finally{TX147.cur=p;}u.anim=(u.anim||0)+dt*8;
  if(dd<200&&(!u.yelp||G.t-u.yelp>5)){u.yelp=G.t;float(u.x,u.y-44,['Gallop! Gallop!','The King\'s coin must get home!','Make way, make way!'][RI(0,2)],'#ffe0a0');}};}
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);if(Array.isArray(d.TX)){const L=units.filter(u=>u.tax&&!u.dead);
  d.TX.forEach((t,i)=>{const u=L[i];if(u){t.foot=u.txFoot?1:0;t.rg=u.txRg||null;t.bolt=u.txBolt?1:0;}});}return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(d&&Array.isArray(d.TX)){const L=units.filter(u=>u.tax);
  d.TX.forEach((t,i)=>{const u=L[i];if(!u)return;if(t.foot)u.txFoot=1;if(t.bolt)u.txBolt=1;const s0=u.route&&u.route[0];u.txRg=t.rg||(s0?txRegion(s0.x,s0.y):txRegion(u.x,u.y));});}return r;};}
// ===== QUEUE 149: TRADE (merchant) ships sail the slowest of all ships =====
const TS149={sp:36};SHIPK.merchant.sp=TS149.sp;
{const _u=updShip;updShip=function(s,dt){if(s&&s.kind==='merchant'&&s.sp!==TS149.sp)s.sp=TS149.sp;return _u.apply(this,arguments);};}
// ======================= QUEUE 147f-147h(-fix): carry-home taxes, no sack cap, richest AREA first =======================
// 147f: gold is only credited when the collector walks into the castle (partK updTax 'home' step); catching/eating him on the road sends the sack
//       to the lair instead (partEC taxSacks). Nothing is credited at collection time - verified by t147f.
// 147g: no carry cap - the old per-stop cap of 30 coins is lifted: at each stop he takes every taxable coin (houses still keep 1, shops/markets/work sites 3).
// 147h-fix: his region's stops are grouped into AREAS (a village, a market, or a cluster of working sites within 700 px); areas are ranked by their
//       TOTAL stored taxes, he goes to the richest area first and collects from every building there before moving to the next-richest area.
const TXH={areas:4,cluster:700,extra:0};
{const _t=updTax;updTax=function(u,dt){const ri0=u.ri,s0=u.sack,tg=u.route&&ri0<u.route.length?u.route[ri0]:null;const r=_t.apply(this,arguments);
  if(tg&&!tg.home&&u.ri>ri0&&!u.dead&&(tg.vi!==undefined||tg.mk)){const more=ecCollect(tg,1e9);if(more>0){u.sack+=more;TXH.extra+=more;G.ecTaxed=(G.ecTaxed||0)+more;
      if(dist(u,D)<900)float(u.x,u.y-48,`Every coin! sack ${Math.floor(u.sack)} gold`,'#ffd84a');}
    u.txGot=(u.txGot||[]);u.txGot.push(Math.floor(u.sack-s0));}
  return r;};}
function txAreaKey(t){return t.wk?'wk':t.vi!==undefined?'v'+t.vi:'m'+t.mk;}
function txAreas(T){const A=[];for(const t of T){const live=ecPayers(t).reduce((a,q)=>a+ecTaxable(q),0);t.amt=live;
    if(t.wk){let a=A.find(z=>z.wk&&z.stops.some(s=>dist(s,t)<TXH.cluster));if(!a){a={wk:1,key:'wk'+A.length,stops:[],tot:0};A.push(a);}a.stops.push(t);a.tot+=live;}
    else{const k=txAreaKey(t);let a=A.find(z=>z.key===k);if(!a){a={key:k,stops:[],tot:0};A.push(a);}a.stops.push(t);a.tot+=live;}}
  return A.sort((a,b)=>b.tot-a.tot);}
{const _sp=spawnTaxman;spawnTaxman=function(){const u=_sp.apply(this,arguments);if(!u||!u.txRg)return u;
  const T=taxTargets().filter(t=>t.rg===u.txRg),A=txAreas(T).filter(a=>a.tot>0).slice(0,TXH.areas);
  if(A.length){let p={x:GATE.x,y:GATE.y};const route=[];for(const a of A){const L=a.stops.slice();while(L.length){L.sort((x,y)=>dist(x,p)-dist(y,p));p=L.shift();route.push(p);}}
    u.route=route;u.ri=0;u.txAreas=A.map(a=>({key:a.key,tot:a.tot,n:a.stops.length,names:a.stops.map(s=>s.name||s.wk||s.mk||('village '+s.vi))}));}
  return u;};}

/* ===== 141: King William's Viking mercenaries (all modes) ===== */
const VK={every:1000,cost:50,hEvery:500,hCost:25,garCap:5,lakeCap:3,sp:72*1.1,hp:260,lhp:90,r:46,lr:28,tough:1.25,wall:.5,chiefSh:.35,logs:3,build:15,buildC:10,swim:22,
  crew:[['war',10],['ber',2],['thr',5],['chief',1]],
  deck:{cd:[1,1.4],n:2,vcd:[2.5,3.5],vn:5,rg:560,vrg:660,dmg:2},ldeck:{cd:[1.2,1.6],n:2,vcd:[3,4],vn:4,rg:520,vrg:620,dmg:2},
  fireShip:.9,defendT:20,mouth:{x:9150,y:4050},corner:{x:9150,y:4950},
  CASTLE:new Set(['gate','barracks','cwall','ctower','keep','kroof','ptower'])};
let VKG=[],VKID=1;
SHIPK.vkwar={hp:VK.hp,sp:VK.sp,crew:0,r:VK.r,gold:0};SHIPK.vklong={hp:VK.lhp,sp:60,crew:0,r:VK.lr,gold:0};
if(typeof TALLY_SECT!=='undefined'){const B=TALLY_SECT.find(s=>s.id==='boats');if(B&&!B.keys.some(k=>k[0]==='ship:vkwar')){B.keys.splice(B.keys.length,0,['ship:vkwar','Viking warships'],['ship:vklong','Viking longships']);}TALLY_LABEL['ship:vkwar']='Viking warships';TALLY_LABEL['ship:vklong']='Viking longships';}
const vkFant=(x,y)=>typeof nrFantasyAt==='function'&&nrFantasyAt(x,y);
const vkQuiet=()=>vkFant(D.x,D.y)||(typeof nrInNorth==='function'&&nrInNorth(D));
const vkG=id=>VKG.find(g=>g.id===id);
const vkWet=(x,y)=>inSea(x,y)||inLake0(x,y)||riverD(x,y)<RIVW-6;
const vkStats=r=>{const b=RCV.solHp*VK.tough,a=RCV.arcHp*VK.tough;return r==='thr'?Math.round(a):r==='chief'?Math.round(RCV.camHp*VK.tough):Math.round(b);};
const vkDmg=()=>RCV.dmgMul*VK.tough;
function vkBerth(role,slot){if(role==='gar'){const a=-.35+slot*.42;return{x:LAKE.x+Math.cos(a)*LAKE.rx*.66,y:LAKE.y+Math.sin(a)*LAKE.ry*.62};}
  if(role==='lake')return{x:LAKE.x+Math.cos(slot*2.1+2)*LAKE.rx*.5,y:LAKE.y+Math.sin(slot*2.1+2)*LAKE.ry*.45};
  const P=vkSeaPosts();return P[slot%P.length];}
let VKPOSTS=null;
function vkSeaPosts(){if(VKPOSTS)return VKPOSTS;const c=[];for(const y of [3000,1500,0,-1300])c.push({x:coastX(y)+750,y});for(const x of [7600,6000,4300,2600,900])c.push({x,y:coastY(x)+650});
  VKPOSTS=c.filter(p=>inSea(p.x,p.y)&&!vkFant(p.x,p.y)&&!(typeof inDeep==='function'&&inDeep(p.x,p.y)));if(!VKPOSTS.length)VKPOSTS=[{x:VK.mouth.x,y:VK.mouth.y+400}];return VKPOSTS;}
function vkBody(x,y){if(inLake0(x,y))return'lake';if(riverD(x,y)<RIVW+10&&!inSea(x,y))return'river';return'sea';}
function vkPath(x,y,to){const a=vkBody(x,y),b=vkBody(to.x,to.y),P=[];const riv=RIVER.map(p=>({x:p[0],y:p[1]}));
  const seaHop=(fx,fy,tx,ty)=>{const w=fx<8400&&fy>4300,n=ty<4300||tx>=8400&&ty<4300;const w2=tx<8400&&ty>4300,n2=fy<4300;if((w&&ty<4300)||(n2&&w2))P.push(VK.corner);};
  if(a===b&&a!=='sea'){P.push(to);return P;}
  if(a==='sea'&&b==='sea'){seaHop(x,y,to.x,to.y);P.push(to);return P;}
  if(a==='sea'){seaHop(x,y,VK.mouth.x,VK.mouth.y);P.push(VK.mouth);let i=riv.length-1;for(;i>=0;i--)P.push(riv[i]);P.push(to);return P;}
  if(b==='sea'){let j=0,bd=1e9;riv.forEach((p,k)=>{const d=d2(x,y,p.x,p.y);if(d<bd){bd=d;j=k;}});for(let k=a==='lake'?0:j;k<riv.length;k++)P.push(riv[k]);P.push(VK.mouth);seaHop(VK.mouth.x,VK.mouth.y,to.x,to.y);P.push(to);return P;}
  if(a==='lake'){P.push(riv[0]);P.push(to);return P;}
  P.push(riv[0]);P.push(to);return P;}
function vkShipOK(s,x,y){const g=vkG(s.vkg);if(g&&g.role!=='sea'&&s.kind==='vkwar')return inLake0(x,y)&&d2(x,y,LAKE.x,LAKE.y)<LAKE.rx;return inSea(x,y)&&!vkFant(x,y)&&(typeof seaD!=='function'||seaD(x,y)>s.r*.8);}
function vkMkShip(g,x,y,kind){const L=kind==='vklong';const s={kind:L?'vklong':'vkwar',vk:1,vkg:g?g.id:0,x,y,ang:-Math.PI/2,sp:L?60:VK.sp,hp:L?VK.lhp:VK.hp,maxHp:L?VK.lhp:VK.hp,r:L?VK.lr:VK.r,crew:0,state:'sail',t:0,id:rnd(),bob:R(0,TAU),fire:0,fireT:0,cd:R(0,1),vcd:R(1,3),path:null,goal:null,goalSp:1};ships.push(s);return s;}
function vkRoleNext(){const used={gar:new Set(),lake:new Set(),sea:new Set()};for(const g of VKG)if(!g.gone)used[g.role].add(g.slot);const free=r=>{let i=0;while(used[r].has(i))i++;return i;};
  if(used.gar.size<VK.garCap)return['gar',free('gar')];if(used.lake.size<VK.lakeCap)return['lake',free('lake')];return['sea',free('sea')];}
function vkSpawnFleet(role,slot,o){o=o||{};if(!role){const q=vkRoleNext();role=q[0];slot=q[1];}
  const g={id:VKID++,role,slot,mode:'sail',ship:null,aboard:[],units:[],A:null,dir:0,t:0,logs:0,site:null,buildT:0};
  for(const [r,n] of VK.crew)for(let i=0;i<n;i++)g.aboard.push({r,hp:0,bearHp:0});
  const p=o.at||{x:VK.mouth.x,y:WY1-170};const s=vkMkShip(g,p.x,p.y);g.ship=s;const post=vkBerth(role,slot);
  if(o.atPost){s.x=post.x;s.y=post.y;g.mode='aboard';}else s.path=vkPath(s.x,s.y,post);
  VKG.push(g);G.vkFleets=(G.vkFleets||0)+1;return g;}
function vkHireStep(){const inc=(G.taxIn||0)+(G.rcTreasIn||0)+(G.kgRaidIn||0),ev=G.hard?VK.hEvery:VK.every,cost=G.hard?VK.hCost:VK.cost;const want=Math.floor(inc/ev);G.vkHired=G.vkHired||0;
  let guard=0;while(G.vkHired<want&&guard++<20){if(treasury()>=cost){kbSpendGold(cost);G.vkSpent=(G.vkSpent||0)+cost;G.vkHired++;G.vkOwed=0;const g=vkSpawnFleet();
      const where=g.role==='gar'?'to guard the castle lake':g.role==='lake'?'to patrol the lake':'to patrol the coast';
      if(!vkQuiet()){G.banner={text:'⚔️ King William hired Viking mercenaries!',sub:`A Viking warship sails up from the south ${where} · ${cost} gold for every ${ev} gold he earns`,t:4.5};G.vkAlerts=(G.vkAlerts||0)+1;}else G.vkQuietHires=(G.vkQuietHires||0)+1;}
    else{G.vkOwed=1;break;}}}
function vkMk(g,r,x,y,a){a=a||{};const max=vkStats(r),t=r==='thr'?'archer':'knight';
  const u=mkUnit(t,x,y,{vk:r,vkg:g.id,post:'vk',foot:true,dsol:r!=='thr',darch:r==='thr',hp:a.hp>0?a.hp:max,maxHp:max,atk:R(0,1),dmgMul:vkDmg(),shootT:R(.5,1.5),born:G.t,vkc:Math.floor(rnd()*3)});
  if(r==='chief'){const bm=Math.round(RCV.camHp*VK.tough);u.bear=(a.hp>0?a.bearHp:bm)>0?1:0;u.bearHp=a.hp>0?a.bearHp:bm;u.bearMax=bm;}
  units.push(u);g.units.push(u);return u;}
function vkBoard(u,g){g.aboard.push({r:u.vk,hp:u.hp,bearHp:u.bearHp||0});u.dead=true;u.gone=true;u.vkBoarded=1;if(u.vkJob&&u.vkJob.tree&&u.vkJob.tree.claimed===u)u.vkJob.tree.claimed=null;u.vkJob=null;}
function vkLand(g,mode,at){const s=g.ship;const p=at||(s&&dryNear(s.x,s.y));if(!p)return false;
  for(const a of g.aboard){const u=vkMk(g,a.r,p.x+R(-30,30),p.y+R(-18,18),a);if(soldierWet(u.x,u.y)){u.x=p.x;u.y=p.y;}}
  g.aboard=[];g.mode=mode;g.land={x:p.x,y:p.y};g.A={x:p.x,y:p.y};g.t=0;if(s){s.goal=null;s.path=null;}
  puff(p.x,p.y,14,'rgba(230,240,255,',90,8);if(d2(p.x,p.y,D.x,D.y)<1600)float(p.x,p.y-50,mode==='defend'?'Vikings storm ashore to defend the castle!':'Vikings storm ashore!','#ffd0a0');G.vkLandings=(G.vkLandings||0)+1;return true;}
function vkCentroid(L){if(!L.length)return null;let x=0,y=0;for(const u of L){x+=u.x;y+=u.y;}return{x:x/L.length,y:y/L.length};}
function vkShoreOf(g){const s=g.ship;if(!s)return null;if(!g.bp||g.bpT<G.t){g.bpT=G.t+1;g.bp=dryNear(s.x,s.y);}return g.bp;}
function vkGuardPt(g){const a=g.slot*1.25+g.id;return{x:GATE.x+Math.cos(a)*150,y:GATE.y+110+Math.sin(a)*60};}
function vkCart(g){if(typeof kbTraders!=='function')return null;const A=g.A||g.land;let b=null,bd=1e9;for(const c of kbTraders()){const d=d2(c.x,c.y,A.x,A.y);if(d<bd){bd=d;b=c;}}return b;}
/* formation: shield wall line facing the dragon, throwers behind, chief behind the centre */
function vkForm(g,dt,T,hold){const L=g.units.filter(u=>!u.dead&&!u.inLong&&!u.vkSwim&&!u.vkJob);g.eng=!hold;if(!L.length)return;
  const c=vkCentroid(L);if(!g.A)g.A={x:c.x,y:c.y};const A=g.A;const W=L.filter(u=>u.vk==='war');
  const dx=T.x-A.x,dy=T.y-A.y,dd=Math.hypot(dx,dy)||1;const stop=hold?20:(D.alt>DR.hitAltSword?110:48);
  if(dd>stop){const sp=(W.length>=3?60:85)*dt,m=Math.min(sp,dd-stop);const nx=A.x+dx/dd*m,ny=A.y+dy/dd*m;if(!soldierWet(nx,ny)||hold){A.x=nx;A.y=ny;}else{for(let k=40;k<=Math.min(500,dd);k+=20){const qx=A.x+dx/dd*k,qy=A.y+dy/dd*k;if(!soldierWet(qx,qy)){A.x=qx;A.y=qy;g.Ajump=G.t;break;}}}}
  const lc=d2(A.x,A.y,c.x,c.y);if(lc>70&&G.t-(g.Ajump||-99)>12){A.x=c.x+(A.x-c.x)*70/lc;A.y=c.y+(A.y-c.y)*70/lc;}
  if(dd>8)g.dir=Math.atan2(dy,dx);const ca=Math.cos(g.dir),sa=Math.sin(g.dir),px=-sa,py=ca;
  W.forEach((u,i)=>{const k=i-(W.length-1)/2;u.slot={x:A.x+px*k*19,y:A.y+py*k*19};});
  const Th=L.filter(u=>u.vk==='thr');Th.forEach((u,i)=>{const k=i-(Th.length-1)/2;u.slot={x:A.x-ca*85+px*k*24,y:A.y-sa*85+py*k*24};});
  for(const u of L){if(u.vk==='chief')u.slot={x:A.x-ca*40,y:A.y-sa*40};if(u.vk==='ber')u.slot={x:A.x+ca*10+px*(u.vkc-1)*30,y:A.y+sa*10+py*(u.vkc-1)*30};}
  const dD=d2(A.x,A.y,D.x,D.y);for(const u of W)u.wallOn=W.length>=3&&!hold&&dD<650&&u.slot&&d2(u.x,u.y,u.slot.x,u.slot.y)<26;}
/* walking with longship ferry over water */
function vkMove(u,tx,ty,sp,dt,g){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy);if(d<4)return true;const st=Math.min(d,sp*dt),nx=u.x+dx/d*st,ny=u.y+dy/d*st;u.face=dx>=0?1:-1;u.anim+=dt*6;
  if(soldierWet(nx+dx/d*10,ny+dy/d*10)&&!soldierWet(u.x,u.y)){if(d>90||!soldierWet(tx,ty))vkFerry(u,tx,ty,g);return false;}
  u.x=nx;u.y=ny;return false;}
function vkFerry(u,tx,ty,g){if(!g||G.t<(u.lsCool||0))return;let ls=ships.find(s=>s.kind==='vklong'&&s.vkg===g.id&&s.state==='load'&&d2(s.x,s.y,u.x,u.y)<240);
  if(!ls){if(G.t<(g.lsT||0)){return;}const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy)||1;let bx=u.x+dx/d*30,by=u.y+dy/d*30;if(!soldierWet(bx,by))return;
    ls=vkMkShip(g,bx,by,'vklong');ls.state='load';ls.lt=0;ls.cargo=[];ls.tx=tx;ls.ty=ty;ls.bx=u.x;ls.by=u.y;ls.ang=Math.atan2(dy,dx);g.lsT=G.t+1.5;G.vkLongships=(G.vkLongships||0)+1;puff(bx,by,10,'rgba(230,240,255,',70,7);if(d2(bx,by,D.x,D.y)<1500)float(bx,by-40,'A Viking longship!','#ffd0a0');}
  ls.cargo.push(u);u.inLong=ls;u.dead=true;u.gone=true;ls.tx=tx;ls.ty=ty;}
function vkUnload(s,fx,fy){const p=!soldierWet(fx,fy)?{x:fx,y:fy}:(dryNear(s.x,s.y)||{x:s.bx,y:s.by});
  for(const u of s.cargo){u.dead=false;u.gone=false;u.inLong=null;u.lsCool=G.t+4;u.x=p.x+R(-14,14);u.y=p.y+R(-10,10);if(soldierWet(u.x,u.y)){u.x=p.x;u.y=p.y;}units.push(u);}
  s.cargo=[];puff(s.x,s.y,12,'rgba(230,240,255,',80,8);s.state='sink';s.t=99;s.gone=true;}
function vkDryFar(x,y){const p=dryNear(x,y);if(p)return p;for(let r=520;r<=3200;r+=80)for(let k=0;k<24;k++){const a=k/24*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(px>WX0+60&&px<WX1-60&&py>WY0+60&&py<WY1-60&&!soldierWet(px,py)&&!vkFant(px,py))return{x:px,y:py};}return null;}
function vkWaterNear(x,y){for(let r=0;r<=1600;r+=40)for(let k=0;k<(r?24:1);k++){const a=k/24*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(vkWet(px,py)&&vkWet(px+30,py)&&vkWet(px-30,py)&&!vkFant(px,py)&&!onBridge(px,py))return{x:px,y:py};}return null;}
function vkTree(p){let b=null,bd=1800;for(const t of trees){if(t.state!=='ok'||t.fire||t.claimed||!(t.s>.8))continue;const d=d2(t.x,t.y,p.x,p.y);if(d<bd&&!vkFant(t.x,t.y)){bd=d;b=t;}}return b;}
/* per-unit step (replaces updKnight / updArcher for Vikings) */
function vkUnit(u,dt){u.retreat=0;u.atk=Math.max(0,(u.atk||0)-dt);u.atk2=Math.max(0,(u.atk2||0)-dt);u.shootT=(u.shootT||0)-dt;
  const g=vkG(u.vkg);if(u.vkSwim){vkSwimStep(u,dt);return;}if(!g){u.vk&&(u.hp=Math.min(u.hp,u.maxHp));return;}
  if(u.vkJob){vkJobStep(u,g,dt);return;}
  const fant=vkFant(D.x,D.y),dd=d2(u.x,u.y,D.x,D.y),low=D.alt<DR.hitAltSword&&!fant&&!G.over,dm=u.dmgMul||vkDmg();
  const fightMode=g.mode==='defend'||g.mode==='chase'||g.mode==='escort'||g.mode==='rebuild';
  // throwing axes (throwers always defend themselves; chief at mid range)
  const throwAxe=(dmg)=>{const a=Math.atan2(D.y-u.y,D.x-u.x),sp=380;projs.push({kind:'axe',x:u.x,y:u.y,z:16,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,tz:heightOf(D.x,D.y)+15,life:1.4,dmg,vkAxe:1});u.face=Math.cos(a)>=0?1:-1;G.vkAxes=(G.vkAxes||0)+1;};
  if(!fightMode){const bp=g.ship?(g.mode==='return'&&g.land&&d2(g.ship.x,g.ship.y,g.land.x,g.land.y)<560?g.land:vkShoreOf(g)):null;if(!bp){u.anim=0;return;}
    if(vkMove(u,bp.x,bp.y,95,dt,g)||d2(u.x,u.y,bp.x,bp.y)<34)vkBoard(u,g);
    if(u.vk==='thr'&&dd<400&&!fant&&u.shootT<=0){u.shootT=R(1.6,2.2);throwAxe(4*dm);}return;}
  if(u.vk==='ber'){if(g.eng&&!fant){if(dd>40)vkMove(u,D.x,D.y,150,dt,g);if(low&&dd<58&&u.atk<=0){u.atk=.68;u.swing=(u.swing?0:1);hurtDragon(4*dm,'spear');G.vkHits=(G.vkHits||0)+1;}}else if(u.slot)vkMove(u,u.slot.x,u.slot.y,120,dt,g);return;}
  if(u.vk==='chief'){const sp=u.bear?120:95;if(g.eng&&!fant&&dd>60)vkMove(u,D.x,D.y,sp,dt,g);else if(!g.eng&&u.slot)vkMove(u,u.slot.x,u.slot.y,sp,dt,g);
    if(low&&dd<70){if(u.atk<=0){u.atk=1.5;u.swing=1;hurtDragon(6*dm,'spear');G.vkHits=(G.vkHits||0)+1;}if(u.bear&&u.atk2<=0){u.atk2=1.2;hurtDragon(4*dm,'spear');G.vkBearHits=(G.vkBearHits||0)+1;}}
    else if(dd>100&&dd<420&&!fant&&u.shootT<=0){u.shootT=R(2.2,3);throwAxe(4*dm);}if(u.atk<1.2)u.swing=0;return;}
  if(u.vk==='thr'){if(u.slot)vkMove(u,u.slot.x,u.slot.y,100,dt,g);if(dd<400&&!fant&&u.shootT<=0){u.shootT=R(1.6,2.2);throwAxe(4*dm);}return;}
  // warrior
  if(u.slot&&d2(u.x,u.y,u.slot.x,u.slot.y)>3)vkMove(u,u.slot.x,u.slot.y,u.wallOn?60:95,dt,g);
  if(low&&dd<58&&u.atk<=0){u.atk=1.35;u.swing=1;hurtDragon(4*dm,'spear');G.vkHits=(G.vkHits||0)+1;}if(u.atk<1.1)u.swing=0;}
function vkSwimStep(u,dt){if(!soldierWet(u.x,u.y)){u.vkSwim=0;u.swTo=null;const g=vkG(u.vkg);if(g&&d2(u.x,u.y,D.x,D.y)<1500)float(u.x,u.y-24,'Ashore!','#cde');return;}
  u.swRe=(u.swRe||0)-dt;if(!u.swTo||u.swRe<0){u.swRe=3;u.swTo=vkDryFar(u.x,u.y);}const t=u.swTo;
  if(t){const a=Math.atan2(t.y-u.y,t.x-u.x);u.x+=Math.cos(a)*VK.swim*dt;u.y+=Math.sin(a)*VK.swim*dt;u.face=Math.cos(a)>=0?1:-1;}u.anim+=dt*3;if(rnd()<dt*1.5)ripples.push({x:u.x,y:u.y,t:0});}
function vkJobStep(u,g,dt){const j=u.vkJob,S=g.site;if(!S){vkBoardJobClear(u);return;}
  if(j.st==='walk'){const t=j.tree;if(!t||t.state!=='ok'){vkBoardJobClear(u);return;}if(vkMove(u,t.x+14,t.y+6,95,dt,g)||d2(u.x,u.y,t.x+14,t.y+6)<8){j.st='chop';j.t=3;}}
  else if(j.st==='chop'){j.t-=dt;u.face=-1;u.swing=(Math.floor(j.t*3)%2);u.anim+=dt*2;if(rnd()<dt*3)puff(j.tree.x+6,j.tree.y-6,1,'rgba(200,170,110,',25,3);
    if(j.t<=0){const t=j.tree;t.state='falling';t.fallT=0;t.fallA=rnd()<.5?1:-1;t.claimed=null;u.vkLog=1;u.swing=0;j.st='carry';G.vkTrees=(G.vkTrees||0)+1;}}
  else if(j.st==='carry'){if(vkMove(u,S.shore.x,S.shore.y,80,dt,g)||d2(u.x,u.y,S.shore.x,S.shore.y)<30){u.vkLog=0;u.vkJob=null;g.logs=Math.min(VK.logs,g.logs+1);if(d2(u.x,u.y,D.x,D.y)<1600)float(u.x,u.y-30,`Log ${g.logs}/${VK.logs}`,'#e8c090');}}}
function vkBoardJobClear(u){if(u.vkJob&&u.vkJob.tree&&u.vkJob.tree.claimed===u)u.vkJob.tree.claimed=null;u.vkJob=null;u.vkLog=0;}
function vkRebuild(g,dt){const L=g.units.filter(u=>!u.dead&&!u.inLong&&!u.vkSwim);if(!L.length)return;
  if(!g.site){const c=vkCentroid(L);const w=vkWaterNear(c.x,c.y)||g.sinkAt||c;g.site={x:w.x,y:w.y,shore:dryNear(w.x,w.y)||c};g.logs=0;g.buildT=0;g.rt=0;if(d2(c.x,c.y,D.x,D.y)<1800)float(c.x,c.y-50,'The Vikings will build a new ship!','#ffd0a0');}
  const S=g.site;g.rt+=dt;const fant=vkFant(D.x,D.y),near=!fant&&d2(D.x,D.y,S.shore.x,S.shore.y)<320;
  vkForm(g,dt,near?D:S.shore,!near);
  if(g.logs<VK.logs){const busy=L.filter(u=>u.vkJob).length,need=Math.min(3,VK.logs-g.logs)-busy;
    if(need>0){const pool=L.filter(u=>!u.vkJob&&u.vk!=='chief').sort((a,b)=>(a.vk==='war'?0:1)-(b.vk==='war'?0:1));let n=need;for(const u of pool){if(n<=0)break;const t=vkTree(S.shore);if(!t){g.noTree=1;break;}t.claimed=u;u.vkJob={tree:t,st:'walk',t:0};n--;}}
    if(g.noTree&&!L.some(u=>u.vkJob)&&g.rt>30)g.logs=VK.logs;}
  else{const chief=L.some(u=>u.vk==='chief');g.buildT+=dt/(chief?VK.buildC:VK.build);if(g.buildT>=1){g.buildT=1;g.wt=(g.wt||0)+dt;const far=g.units.some(u=>!u.dead&&!u.inLong&&(u.vkSwim||d2(u.x,u.y,S.shore.x,S.shore.y)>300));if(!far||g.wt>25){g.wt=0;vkLaunch(g);}}}}
function vkLaunch(g){const S=g.site;const s=vkMkShip(g,S.x,S.y);g.ship=s;G.vkRebuilt=(G.vkRebuilt||0)+1;
  for(const u of g.units)if(!u.dead&&!u.inLong)vkBoard(u,g);g.units=g.units.filter(u=>!u.dead||u.inLong);g.site=null;g.noTree=0;g.mode='sail';s.path=vkPath(s.x,s.y,vkBerth(g.role,g.slot));
  puff(s.x,s.y,20,'rgba(230,240,255,',110,9);if(d2(s.x,s.y,D.x,D.y)<1800)float(s.x,s.y-70,'A new Viking warship is launched!','#ffd0a0');}
function vkPatrol(g,s){if(s.path)return;const P=vkBerth(g.role,g.slot);if(g.role==='gar'){s.goal=d2(s.x,s.y,P.x,P.y)>30?P:null;s.goalSp=.6;return;}
  const a=G.t*(g.role==='lake'?.05:.04)+g.id;const r=g.role==='lake'?1:130;s.goal=g.role==='lake'?{x:LAKE.x+Math.cos(a)*LAKE.rx*.55,y:LAKE.y+Math.sin(a)*LAKE.ry*.5}:{x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r*.6};s.goalSp=g.role==='lake'?.45:.4;}
function vkSeek(g,s,dt){s.path=null;let t={x:D.x,y:D.y};if(g.role!=='sea'){const dx=(D.x-LAKE.x)/LAKE.rx,dy=(D.y-LAKE.y)/LAKE.ry,m=Math.hypot(dx,dy);if(m>.8)t={x:LAKE.x+dx/m*.8*LAKE.rx,y:LAKE.y+dy/m*.8*LAKE.ry};}
  s.goal=t;s.goalSp=1;g.stk=(g.stk||0);const lp=g.lp||{x:s.x,y:s.y};if(d2(lp.x,lp.y,s.x,s.y)<4*dt*60)g.stk+=dt;else g.stk=0;g.lp={x:s.x,y:s.y};
  const dd=d2(s.x,s.y,D.x,D.y);if(dd<700||(g.stk>1.5&&dd<1600)||(g.role!=='sea'&&d2(s.x,s.y,t.x,t.y)<60))vkLand(g,'chase');}
function vkEscortStep(g,s,dt){if(typeof kbShips!=='function')return false;const T=kbShips().find(t=>(t.state==='sail'||t.state==='unload')&&t!==g.escDone);if(!T)return false;
  if(g.escortOf!==T){const n=VKG.filter(o=>o!==g&&o.escortOf===T&&!o.gone).length;if(n>=2||d2(s.x,s.y,T.x,T.y)>3200)return false;g.escortOf=T;G.vkEscorts=(G.vkEscorts||0)+1;if(d2(s.x,s.y,D.x,D.y)<2200)float(s.x,s.y-70,'Vikings escort the royal trade ship!','#ffd0a0');}
  s.path=null;const side=g.id%2?1:-1;s.goal={x:T.x+side*140,y:T.y+30};s.goalSp=d2(s.x,s.y,s.goal.x,s.goal.y)>240?1:.6;
  if(T.state==='unload'&&d2(s.x,s.y,T.x,T.y)<420&&g.aboard.length){const q=kbQuay();if(vkLand(g,'escort',q.land)){g.escDone=T;s.goal=null;if(d2(q.land.x,q.land.y,D.x,D.y)<1800)float(q.land.x,q.land.y-60,'Vikings guard the royal cargo!','#ffd0a0');}}
  return true;}
function vkGroupStep(g,dt){g.t+=dt;
  for(const u of g.units)if(u.dead&&!u.inLong&&!u.vkBoarded)vkBoardJobClear(u);
  g.units=g.units.filter(u=>!u.dead||u.inLong);if(g.ship&&(g.ship.state==='sink'||g.ship.gone||!ships.includes(g.ship)))g.ship=null;
  const s=g.ship,fant=vkFant(D.x,D.y),mil=G.level>=6&&!fant&&!G.over,hit=G.vkHitT!=null&&G.t-G.vkHitT<3,ashore=g.units.length>0;
  if(!ashore&&!g.aboard.length){g.gone=true;G.vkWiped=(G.vkWiped||0)+1;if(s){s.vkg=0;s.leave=1;s.goal=null;s.path=[{x:VK.mouth.x,y:WY1+150}];}return;}
  if(s&&g.mode!=='aboard'&&g.mode!=='sail'&&!(g.mode==='return'&&!ashore)){s.goal=null;s.path=null;}
  switch(g.mode){
  case 'sail':if(!s){g.mode=ashore?'rebuild':'swim';}break;
  case 'aboard':if(!s){g.mode='swim';break;}if(ashore){g.mode='return';break;}
    if(g.role==='gar'){vkPatrol(g,s);if(hit)vkLand(g,'defend');else if(mil)vkLand(g,'chase');}
    else if(mil&&d2(s.x,s.y,D.x,D.y)<3000)vkSeek(g,s,dt);else if(!(g.role==='sea'&&vkEscortStep(g,s,dt)))vkPatrol(g,s);break;
  case 'defend':{if(mil){g.mode='chase';break;}const nearC=!fant&&d2(D.x,D.y,GATE.x,GATE.y)<1000;if(G.t-(G.vkHitT||-99)>VK.defendT&&!nearC){g.mode='return';break;}vkForm(g,dt,nearC?D:vkGuardPt(g),!nearC);break;}
  case 'chase':if(G.level<=0||G.over){g.mode='return';break;}vkForm(g,dt,fant?(g.A||D):D,fant);break;
  case 'escort':{const c=vkCart(g);if(c){const near=!fant&&d2(c.x,c.y,D.x,D.y)<320;vkForm(g,dt,near?D:{x:c.x,y:c.y},!near);g.sawCart=1;}else if(g.sawCart||g.t>(KB.unload||2.5)+8){g.mode='return';g.sawCart=0;}else vkForm(g,dt,g.land,true);if(mil)g.mode='chase';break;}
  case 'return':if(mil){g.mode='chase';break;}if(g.role==='gar'&&hit){g.mode='defend';break;}if(!s){g.mode='rebuild';break;}
    if(!ashore){g.mode='sail';s.goal=null;const P=vkBerth(g.role,g.slot);s.path=vkPath(s.x,s.y,P);}break;
  case 'swim':if(s){g.mode=ashore?'return':'aboard';break;}if(!g.units.some(u=>u.vkSwim||u.inLong))g.mode='rebuild';break;
  case 'rebuild':if(s){g.mode='return';break;}if(mil||hit){/* fight first, build later */vkForm(g,dt,fant?(g.A||D):D,fant);g.eng=!fant;break;}vkRebuild(g,dt);break;}}
function vkStep(dt){VK.hT=(VK.hT||0)-dt;if(VK.hT<=0){VK.hT=.5;vkHireStep();}for(const g of VKG)if(!g.gone)vkGroupStep(g,dt);if(VKG.some(g=>g.gone))VKG=VKG.filter(g=>!g.gone);}
/* ships */
function vkDeck(s,dt,C){const g=vkG(s.vkg);if(!g||vkFant(D.x,D.y)||G.over)return;const n=s.kind==='vklong'?(s.cargo||[]).length:g.aboard.length;if(!n)return;const dd=d2(s.x,s.y,D.x,D.y);
  const shoot=(k)=>{for(let i=0;i<k;i++){const a=Math.atan2(D.y-s.y,D.x-s.x)+R(-.12,.12),ox=R(-s.r*.5,s.r*.5);projs.push({kind:'arrow',x:s.x+ox,y:s.y-8,z:18,vx:Math.cos(a)*470,vy:Math.sin(a)*470,tz:heightOf(D.x,D.y)+15,life:1.5,dmg:C.dmg,vkArrow:1});}G.vkArrows=(G.vkArrows||0)+k;};
  s.cd-=dt;if(s.cd<=0&&dd<C.rg){s.cd=R(C.cd[0],C.cd[1]);shoot(Math.min(C.n,n));}
  s.vcd-=dt;if(s.vcd<=0&&dd<C.vrg){s.vcd=R(C.vcd[0],C.vcd[1]);shoot(Math.min(C.vn,n+2));}}
function vkFire(s,dt){if(!s.fire)return;s.fireT=(s.fireT||0)+dt;if(rnd()<dt*8)flame(s.x+R(-s.r*.6,s.r*.6),s.y-8,R(4,14));hurtShip(s,6*dt,'fire');if(s.fireT>(s.kind==='vklong'?5:7)&&s.state!=='sink'){s.fire=0;s.fireT=0;puff(s.x,s.y-10,10,'rgba(200,200,200,',50,8);if(d2(s.x,s.y,D.x,D.y)<1500)float(s.x,s.y-60,'The Vikings douse the flames!','#cde');}}
function vkSail(s,dt,tx,ty,spf){const a=Math.atan2(ty-s.y,tx-s.x);s.ang+=angDiff(a,s.ang)*Math.min(1,2.5*dt);const st=s.sp*spf*dt;const nx=s.x+Math.cos(s.ang)*st,ny=s.y+Math.sin(s.ang)*st;return{nx,ny};}
function updVkShip(s,dt){s.t+=dt;s.bob+=dt;if(s.state==='sink'){return;}vkFire(s,dt);if(s.state==='sink')return;
  if(s.path&&s.path.length){const p=s.path[0];let r=vkSail(s,dt,p.x,p.y,1);if(!vkShipOK(s,r.nx,r.ny)&&vkShipOK(s,s.x,s.y)){/*156b: never let the turn swing the hull onto land*/const a0=Math.atan2(p.y-s.y,p.x-s.x),st=s.sp*dt,sd=s.slideDir||1;let ok=null;for(const k of [0,1,-1,2,-2,3,-3,4,-4,5,-5]){const a=a0+k*sd*.38,nx=s.x+Math.cos(a)*st,ny=s.y+Math.sin(a)*st;if(vkShipOK(s,nx,ny)&&vkShipOK(s,s.x+Math.cos(a)*st*8,s.y+Math.sin(a)*st*8)){ok={a,nx,ny};if(k)s.slideDir=sd*Math.sign(k);break;}}if(ok){s.ang=ok.a;r={nx:ok.nx,ny:ok.ny};}else{r={nx:s.x,ny:s.y};s.ang+=dt*1.5;const g=vkG(s.vkg);if(g)g.stk=(g.stk||0)+dt;if(d2(s.x,s.y,p.x,p.y)<90)s.path.shift();if(!s.path.length){s.path=null;if(s.leave||!g){s.state='sink';s.t=99;s.gone=true;return;}if(g.mode==='sail')g.mode='aboard';}}}if(!s.path){vkDeck(s,dt,VK.deck);return;}s.x=r.nx;s.y=r.ny;if(d2(s.x,s.y,p.x,p.y)<40){s.path.shift();if(!s.path.length){s.path=null;const g=vkG(s.vkg);if(s.leave||!g){s.state='sink';s.t=99;s.gone=true;return;}if(g.mode==='sail')g.mode='aboard';}}}
  else if(s.goal){const d=d2(s.x,s.y,s.goal.x,s.goal.y);if(d>12){const r=vkSail(s,dt,s.goal.x,s.goal.y,s.goalSp||1);if(vkShipOK(s,r.nx,r.ny)){s.x=r.nx;s.y=r.ny;}else{s.ang+=dt*1.5;const g=vkG(s.vkg);if(g)g.stk=(g.stk||0)+dt;}}}
  if((G.fc&7)===0&&(s.path||s.goal))ripples.push({x:s.x-Math.cos(s.ang)*s.r,y:s.y-Math.sin(s.ang)*s.r*.5,t:0});
  vkDeck(s,dt,VK.deck);}
function updVkLong(s,dt){s.t+=dt;s.bob+=dt;if(s.state==='sink')return;vkFire(s,dt);if(s.state==='sink')return;
  if(s.state==='load'){s.lt+=dt;if(s.lt>1.2)s.state='row';vkDeck(s,dt,VK.ldeck);return;}
  const g=vkG(s.vkg);if(g&&(g.mode==='chase'||g.mode==='defend')&&!vkFant(D.x,D.y)){s.tx=D.x;s.ty=D.y;}
  const r=vkSail(s,dt,s.tx,s.ty,1),fx=s.x+Math.cos(s.ang)*(s.r+10),fy=s.y+Math.sin(s.ang)*(s.r+10);
  if(!soldierWet(fx,fy)||s.t>40||d2(s.x,s.y,s.tx,s.ty)<30){vkUnload(s,fx,fy);return;}
  s.x=r.nx;s.y=r.ny;if((G.fc&7)===0)ripples.push({x:s.x,y:s.y,t:0});vkDeck(s,dt,VK.ldeck);}
function vkShipSunk(s){G.vkSunk=(G.vkSunk||0)+1;const t=texts[texts.length-1];if(t&&/sunk/i.test(t.txt))t.txt='Viking warship sunk! The crew swims for shore!';else float(s.x,s.y-40,'Viking warship sunk! The crew swims for shore!','#ffd0a0');
  const g=vkG(s.vkg);if(!g)return;g.ship=null;g.sinkAt={x:s.x,y:s.y};
  for(const a of g.aboard){const an=R(0,TAU);const u=vkMk(g,a.r,s.x+Math.cos(an)*s.r*.8,s.y+Math.sin(an)*s.r*.4,a);u.vkSwim=1;G.vkSwimmers=(G.vkSwimmers||0)+1;}
  g.aboard=[];if(g.mode==='aboard'||g.mode==='sail')g.mode='swim';}
function vkLongSunk(s){G.vkLongSunk=(G.vkLongSunk||0)+1;const t=texts[texts.length-1];if(t&&/sunk/i.test(t.txt))t.txt='Longship sunk! Vikings in the water!';
  for(const u of (s.cargo||[])){u.dead=false;u.gone=false;u.inLong=null;u.vkSwim=1;u.x=s.x+R(-20,20);u.y=s.y+R(-10,10);units.push(u);G.vkSwimmers=(G.vkSwimmers||0)+1;}s.cargo=[];}
{const _u=updShip;updShip=function(s,dt){if(s&&s.vk){AB138.sb=(AB138.sb||0)+1;try{if(s.kind==='vklong')updVkLong(s,dt);else updVkShip(s,dt);}finally{AB138.sb--;}return;}return _u.apply(this,arguments);};}
{const _h=hurtShip;hurtShip=function(s,d,src){if(!s||!s.vk)return _h.apply(this,arguments);if(s.state==='sink'||s.gone||src==='vksite')return;
  if(typeof d==='number'&&src==='fire'&&AB138.fire&&!AB138.sb)d*=VK.fireShip;const was=s.state==='sink';const r=_h.call(this,s,d,src);
  if(!was&&s.state==='sink'){if(s.kind==='vklong')vkLongSunk(s);else vkShipSunk(s);}return r;};}
{const _d=drawShip;drawShip=function(s){if(s&&s.vk){if(!s.gone)drawVkShip(s);return;}return _d.apply(this,arguments);};}
/* units */
{const _k=updKnight;updKnight=function(u,dt){if(u&&u.vk){vkUnit(u,dt);return;}return _k.apply(this,arguments);};}
{const _a=updArcher;updArcher=function(u,dt){if(u&&u.vk){vkUnit(u,dt);return;}return _a.apply(this,arguments);};}
{const _s=soldierSwim;soldierSwim=function(u,dt){if(u&&u.vk)return false;return _s.apply(this,arguments);};}
{const _h=hurtUnit;hurtUnit=function(u,d,src){if(!u||!u.vk||u.dead||typeof d!=='number')return _h.apply(this,arguments);
  const burn=src==='fire'&&AB138.burn&&!AB138.fire;
  if(!burn&&!u.vkSwim&&(u.wallOn||u.vk==='chief')){const a=Math.atan2(D.y-u.y,D.x-u.x),g=vkG(u.vkg),fa=u.vk==='chief'?(u.face>0?0:Math.PI):(g?g.dir:a);
    if(Math.abs(angDiff(a,fa))<1.31){d*=1-(u.vk==='chief'?VK.chiefSh:VK.wall);G.vkBlocked=(G.vkBlocked||0)+1;if(rnd()<.2&&u.wallOn)float(u.x,u.y-30,'Shield wall!','#cde');}}
  if(u.vk==='chief'&&u.bear&&u.bearHp>0){u.bearHp-=d;if(u.bearHp<=0){u.bear=0;u.bearHp=0;puff(u.x,u.y,16,'rgba(150,110,70,',90,10);float(u.x,u.y-50,'The war bear runs off! The chief fights on foot!','#ffd0a0');G.vkBears=(G.vkBears||0)+1;}return;}
  const was=u.dead;const r=_h.call(this,u,d,src);
  if(!was&&u.dead){G.vkDown=(G.vkDown||0)+1;const t=texts[texts.length-1];if(t&&/down!$/.test(t.txt))t.txt=u.vk==='chief'?'The Viking chief falls!':'Viking down!';}return r;};}
// queue 173a: no size gate - the war bear can be eaten once it is worn down (at/below 35% health or 50 HP); before that a bite wears it down
{const _e=eatUnit;eatUnit=function(u){if(u&&u.vk==='chief'&&u.bear&&!u.dead&&!bt173Low(u)){const dm=Math.min(50,Math.max(0,Math.ceil(u.hp)-1));if(dm>0)hurtUnit(u,dm,'bite');float(u.x,u.y-40,'The war bear is still too strong to eat - wear it down!','#ffd0a0');return;}return _e.apply(this,arguments);};}
{const _hs=hurtStruct;hurtStruct=function(s,d){if(s&&VK.CASTLE.has(s.kind)&&s.state!=='ruin'&&d2(s.x,s.y,GATE.x,GATE.y)<1300)G.vkHitT=G.t;return _hs.apply(this,arguments);};}
{const _up=update;update=function(dt){const r=_up.apply(this,arguments);try{if(G&&!G.over&&typeof scene!=='undefined'&&scene==='play')vkStep(dt);}catch(e){if(!VK.err){VK.err=String(e&&e.stack||e);console.warn('vk',e);}}return r;};}
function vkReset(){VKG=[];if(typeof ships!=='undefined')ships=ships.filter(s=>!s.vk);if(typeof units!=='undefined')for(const u of units)if(u.vk){u.dead=true;u.gone=true;}}
{const _n=newGame;newGame=function(){const r=_n.apply(this,arguments);try{vkReset();}catch(e){}return r;};}
{const _sn=svSnapshot;svSnapshot=function(){const o=_sn.apply(this,arguments);try{if(o)o.VK=VKG.filter(g=>!g.gone).map(g=>{const n={};for(const a of g.aboard)n[a.r]=(n[a.r]||0)+1;for(const u of g.units)if(!u.dead||u.inLong)n[u.vk]=(n[u.vk]||0)+1;return{role:g.role,slot:g.slot,n};});}catch(e){}return o;};}
{const _ap=svApply;svApply=function(d){const r=_ap.apply(this,arguments);try{vkReset();if(d&&Array.isArray(d.VK))for(const v of d.VK){const g=vkSpawnFleet(v.role,v.slot,{atPost:true});g.aboard=[];for(const [rr] of VK.crew)for(let i=0;i<((v.n||{})[rr]||0);i++)g.aboard.push({r:rr,hp:0,bearHp:0});}}catch(e){}return r;};}
/* drawing */
const VKBEARD=['#d9822b','#e8d070','#8a4a1a'],VKTUN=['#4f7a3a','#8a3a2a','#3a5a8a'],VKSH=[['#c0392b','#f1c40f'],['#2c6fbb','#ecf0f1'],['#27ae60','#f39c12']];
function drawVkBear(u){const x=u.x,y=u.y,f=u.face||1,w=Math.sin((u.anim||0)*1.4)*2.5;ell(x,y+2,17,4,'rgba(0,0,0,.25)');
  for(const [lx,ph] of [[-9,1],[-4,-1],[5,1],[10,-1]])rect(x+lx*f-2,y-7+0*ph,4,8+ph*w*.4,'#4e3018');
  ell(x,y-10,16,9,'#6b4423');ell(x-f*4,y-14,9,5,'#7a5030');ell(x+f*14,y-13,6.5,5.5,'#6b4423');ell(x+f*11,y-18,2,2,'#4e3018');ell(x+f*15,y-18.5,2,2,'#4e3018');ell(x+f*19.5,y-12,3,2.4,'#c9a27a');ell(x+f*21.5,y-12.5,1.3,1.1,'#222');ell(x+f*16,y-15,1,1,'#111');}
function drawViking(u){const x=u.x,y=u.y,f=u.face||1,c=((u.vkc|0)%3+3)%3,r=u.vk,gk=Math.sin((u.anim||0)*1.6);
  if(u.vkSwim){ell(x,y+1,10,3.5,'rgba(230,245,255,.6)');ell(x,y-4,3.2,3.2,'#e8c0a0');ell(x,y-6,3.4,2.2,'#9aa3ad');line(x-3,y-7,x-5,y-10,'#f2e6c8',1.2);line(x+3,y-7,x+5,y-10,'#f2e6c8',1.2);line(x-4,y-2,x-8,y-4+gk*2,'#e8c0a0',1.6);line(x+4,y-2,x+8,y-4-gk*2,'#e8c0a0',1.6);return;}
  const mount=r==='chief'&&u.bear;if(mount)drawVkBear(u);else ell(x,y+1.5,6,2.4,'rgba(0,0,0,.25)');
  ctx.save();ctx.translate(x-(mount?f*3:0),y-(mount?15:0));const sc=r==='chief'?1.5:1.3;ctx.scale(sc,sc);
  if(!mount){line(-1.4,0,-1.4+gk*1.6,-4.5,'#4a3a2a',1.8);line(1.4,0,1.4-gk*1.6,-4.5,'#4a3a2a',1.8);}
  const skin='#e8c0a0',tun=r==='ber'?skin:r==='chief'?'#6a2a5a':VKTUN[c];poly([-3,-4.5,3,-4.5,2.6,-11,-2.6,-11],tun);if(r==='ber'){poly([-3.4,-11.4,3.4,-11.4,2.4,-8.6,-2.4,-8.6],'#6a4a2a');}rect(-3,-6,6,1.2,'#3a2a1a');
  if(r==='chief')poly([-3.4,-11,3.4,-11,4.4,-3,-4.4,-3],'rgba(160,40,40,.85)');
  ell(0,-13.6,2.6,2.6,skin);poly([-2.5,-13,2.5,-13,1.5,r==='chief'?-8:-9.6,-1.5,r==='chief'?-8:-9.6],VKBEARD[c]);
  if(r==='ber'){ell(0,-15,3.2,2.5,'#6a4a2a');ell(-2.4,-17,1.1,1.1,'#5a3a1a');ell(2.4,-17,1.1,1.1,'#5a3a1a');}
  else{ell(0,-15.3,3,2.1,'#9aa3ad');rect(-.4,-15.4,.8,3,'#7a838d');line(-2.6,-15.8,-4.4,-18.6,'#f2e6c8',1.3);line(2.6,-15.8,4.4,-18.6,'#f2e6c8',1.3);}
  const sw=u.swing?1:0;
  if(r==='war'){line(f*3,-3,f*(4+sw*3),-19+sw*6,'#7a5a3a',1.2);poly([f*(4+sw*3),-21+sw*6,f*(5+sw*3),-18.5+sw*6,f*(3+sw*3),-18.5+sw*6],'#cfd6dd');
    const S=VKSH[c];if(u.wallOn){ell(f*4.4,-7.2,4.8,5.4,S[0]);ctx.strokeStyle=S[1];ctx.lineWidth=1;ctx.stroke();line(f*4.4,-12.4,f*4.4,-2,S[1],.9);ell(f*4.4,-7.2,1.2,1.2,'#888');}
    else{ell(-f*3.6,-8,3.6,3.6,S[0]);ell(-f*3.6,-8,1,1,'#888');}}
  else if(r==='ber'){for(const k of [-1,1]){const a=(k>0?sw:1-sw);line(k*3,-9,k*(5+a*2),-14+a*6,'#7a5a3a',1.1);poly([k*(5+a*2),-15+a*6,k*(7.5+a*2),-14+a*6,k*(5.5+a*2),-12+a*6],'#cfd6dd');}}
  else if(r==='thr'){line(f*3,-8,f*5,-13,'#7a5a3a',1);poly([f*5,-14,f*6.6,-13,f*5.4,-11.6],'#cfd6dd');line(-1.6,-6,-2.6,-3,'#7a5a3a',1);line(1.6,-6,2.6,-3,'#7a5a3a',1);}
  else if(r==='chief'){line(f*3.5,-4,f*(5+sw*3),-21+sw*7,'#5a3a1a',1.4);poly([f*(5+sw*3),-21+sw*7,f*(9+sw*3),-23+sw*7,f*(9+sw*3),-18+sw*7],'#d8dee4');poly([f*(5+sw*3),-21+sw*7,f*(1+sw*3),-23+sw*7,f*(1+sw*3),-18+sw*7],'#d8dee4');
    ell(-f*4,-8,5.4,6.2,'#7a1f1f');ctx.strokeStyle='#e0b030';ctx.lineWidth=1.1;ctx.stroke();ell(-f*4,-8,1.6,1.6,'#e0b030');}
  ctx.restore();
  if(u.vkLog){rect(x-10,y-24,20,4,'#8a5a2a');ell(x-10,y-22,2,2,'#c09060');ell(x+10,y-22,2,2,'#c09060');}
  const top=y-(r==='chief'?(mount?52:30):26);if(u.hp<u.maxHp){rect(x-8,top,16,2,'#300');rect(x-8,top,16*Math.max(0,u.hp/u.maxHp),2,'#e85');}
  if(mount&&u.bearHp<u.bearMax){rect(x-10,top+3,20,2,'#210');rect(x-10,top+3,20*Math.max(0,u.bearHp/u.bearMax),2,'#b87a3a');}}
{const _dk=drawKnight;drawKnight=function(u){if(u&&u.vk){drawViking(u);return;}return _dk.apply(this,arguments);};}
{const _dp=drawPerson;drawPerson=function(u){if(u&&u.vk){drawViking(u);return;}return _dp.apply(this,arguments);};}
function drawVkShip(s){const x=s.x,y=s.y,sk=s.state==='sink'?Math.min(1.2,s.t/4):0,b=Math.sin(s.bob*1.5)*1.6,r=s.r,f=Math.cos(s.ang)>=0?1:-1,L=s.kind==='vklong',n=L?4:7;
  ctx.save();ctx.globalAlpha=Math.max(0,1-sk*.9);ell(x,y+6,r*1.1,r*.3,'rgba(10,30,60,.3)');ctx.translate(x,y+sk*26+b);ctx.rotate(f*sk*.5);ctx.scale(f,1);
  const oa=Math.sin(G.t*4+s.id*9)*4;for(let i=0;i<n;i++){const ox=-r*.6+i*r*1.2/(n-1);line(ox,-3,ox-6+oa,12,'#7a5a34',1.6);}
  ctx.fillStyle='#6b4226';ctx.beginPath();ctx.moveTo(-r*1.02,-20);ctx.quadraticCurveTo(-r*.95,6,-r*.5,8);ctx.lineTo(r*.5,8);ctx.quadraticCurveTo(r*.95,6,r*1.02,-20);ctx.lineTo(r*.85,-9);ctx.lineTo(-r*.85,-9);ctx.closePath();ctx.fill();
  line(-r*.88,-3,r*.88,-3,'#8a5a32',2);line(-r*.8,3,r*.8,3,'#5a3418',1.5);
  line(r*.92,-12,r*1.1,-28,'#5a3418',4);ell(r*1.13,-30,5.5,3.6,'#5a3418');poly([r*1.15,-32,r*1.32,-30,r*1.15,-27.5],'#5a3418');ell(r*1.14,-31,1.2,1.2,'#ffd23a');line(r*1.08,-33,r*1.02,-38,'#5a3418',1.6);
  ctx.strokeStyle='#5a3418';ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(-r*1.02,-26,6,Math.PI*.1,Math.PI*1.4);ctx.stroke();
  const g=vkG(s.vkg),crew=g?(L?(s.cargo||[]).length:g.aboard.length):0;for(let i=0;i<Math.min(crew,n);i++){const hx=-r*.62+i*r*1.24/Math.max(1,n-1)+3;ell(hx,-15,2.4,2.4,'#e8c0a0');ell(hx,-16.6,2.6,1.7,'#9aa3ad');}
  for(let i=0;i<n;i++){const sx=-r*.7+i*r*1.4/(n-1);ell(sx,-10,4.4,4.4,i%2?'#c0392b':'#f1c40f');ell(sx,-10,1.3,1.3,'#666');}
  const mh=L?44:80,w=L?13:26,sw=Math.sin(G.t*1.3+s.id*5)*2.5;line(0,-12,0,-mh,'#4a2a10',3);line(-w,-mh+6,w,-mh+6,'#4a2a10',2);
  for(let k=0;k<5;k++){ctx.fillStyle=k%2?'#f4ecd8':'#b03030';const x0=-w+k*w*2/5;ctx.beginPath();ctx.moveTo(x0,-mh+7);ctx.lineTo(x0+w*2/5,-mh+7);ctx.lineTo(x0+w*2/5+sw*.6,-22);ctx.lineTo(x0+sw*.6,-22);ctx.closePath();ctx.fill();}
  ctx.restore();
  if(s.state!=='sink'){if(s.hp<s.maxHp){rect(x-22,y-r-(L?30:62),44,3,'#300');rect(x-22,y-r-(L?30:62),44*Math.max(0,s.hp/s.maxHp),3,'#e85');}
    if(!L&&Math.abs(x-D.x)<1100&&Math.abs(y-D.y)<800)txt('Viking warship',x,y-r-(L?36:68),10,'#ffd0a0','center',true);}}
{const _st=drawSeaTop;drawSeaTop=function(x0,y0,x1,y1){const r=_st.apply(this,arguments);try{
  for(const p of projs)if(p.kind==='axe'&&p.x>x0-50&&p.x<x1+50&&p.y>y0-50&&p.y<y1+50){ctx.save();ctx.translate(p.x,p.y-(p.z||0));ctx.rotate(G.t*16+p.x*.01);line(-5,0,5,0,'#7a5a3a',1.6);poly([4,-4,8,-1,8,3,4,1],'#d8dee4');ctx.restore();}
  for(const g of VKG){const S=g.site;if(!S||S.x<x0-200||S.x>x1+200||S.y<y0-200||S.y>y1+200)continue;
    const p=g.logs<VK.logs?0:g.buildT;line(S.x-40,S.y,S.x+40,S.y,'#6b4226',4);const nr=Math.floor(p*9);for(let i=0;i<nr;i++){const rx=S.x-36+i*9;ctx.strokeStyle='#8a5a32';ctx.lineWidth=2;ctx.beginPath();ctx.arc(rx,S.y-4,9,Math.PI*1.05,Math.PI*1.95);ctx.stroke();}
    for(let i=0;i<g.logs;i++)rect(S.shore.x-14,S.shore.y-4-i*4,28,4,'#8a5a2a');
    const bx=S.x-30,by=S.y-40;rect(bx,by,60,6,'#222');rect(bx,by,60*(g.logs<VK.logs?g.logs/VK.logs:p),6,g.logs<VK.logs?'#c99a50':'#6c6');
    txt(g.logs<VK.logs?`Vikings gathering wood ${g.logs}/${VK.logs}`:`Building a new warship ${Math.round(p*100)}%`,S.x,by-6,10,'#ffd0a0','center',true);}
}catch(e){}return r;};}
// ===== QUEUE 147i (all modes): the tax-man hat sits ON his head, and tax collectors are always mounted =====
// Knocked off by fire/stomp he lands on foot for 2 s, then catches his horse and is back in the saddle (the loose horse is
// removed when he remounts; if it was lost, he gets a fresh one). Saves never restore a collector on foot.
const TX147I={remount:2,remounts:0};
{const _o=tx147Off;tx147Off=function(u){const n=units.length;_o.apply(this,arguments);u.txFootT=TX147I.remount;const h=units[units.length-1];u.txHorse=units.length>n&&h&&h.species==='horse'?h:null;};}
function tx147iRemount(u){u.txFoot=0;u.txFootT=0;const h=u.txHorse;u.txHorse=null;if(h&&!h.dead){const i=units.indexOf(h);if(i>=0)units.splice(i,1);}
  TX147I.remounts++;if(dist(u,D)<1200)float(u.x,u.y-44,'Back in the saddle!','#ffe0a0');}
{const _t=updTax;updTax=function(u,dt){if(u&&u.tax&&!u.dead&&u.txFoot){if(!(u.txFootT>0))u.txFootT=Math.min(u.txFootT||TX147I.remount,TX147I.remount);u.txFootT-=dt;if(u.txFootT<=0)tx147iRemount(u);}
  return _t.apply(this,arguments);};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);for(const u of units)if(u.tax){u.txFoot=0;u.txFootT=0;u.txHorse=null;}return r;};}
// hat: brim on top of the head (head top is ~15 px above the feet; riders sit 13 px higher)
{const _s=drawTaxSack;drawTaxSack=function(u){const ride=tx147Rides(u);
  if(!ride){const x=u.x+(u.face||1)*-7,y=u.y-10,s=4+Math.min(5,(u.sack||0)/5);ell(x,y,s,s+1,'#a07a40');ell(x,y-s,2.4,1.6,'#7a5a28');ctx.fillStyle='#ffe58a';ctx.font='bold 7px Georgia';ctx.textAlign='center';ctx.fillText('$',x,y+2);}
  const hy=u.y-(ride?13:0)+Math.sin(u.anim||0)*.36;rect(u.x-5,hy-16,10,2.4,'#2a1a2a');rect(u.x-3,hy-20,6,4.2,'#2a1a2a');};}
// ===== QUEUE 147j (all modes): ONE AREA per trip - richest area of his region, ride home and deliver, then out again to the (re-ranked) richest area =====
// His region (one collector per region) is unchanged. After each delivery he re-ranks his region's areas by live stored taxes and rides out to the
// richest one (the area he just emptied is skipped while another area has anything to give). Nothing left anywhere in his region = he retires.
const TXJ={trips:0,retired:0,wait:1.5};
function txjRoute(u,skip){const T=taxTargets().filter(t=>t.rg===u.txRg);let A=txAreas(T).filter(a=>a.tot>0);
  if(skip&&A.length>1)A=A.filter(a=>a.key!==skip);const a=A[0];if(!a)return false;let p={x:GATE.x,y:GATE.y};const L=a.stops.slice(),route=[];
  while(L.length){L.sort((x,y)=>dist(x,p)-dist(y,p));p=L.shift();route.push(p);}
  u.route=route;u.ri=0;u.txArea=a.key;u.txAreas=[{key:a.key,tot:a.tot,n:a.stops.length,names:a.stops.map(s=>s.name||s.wk||s.mk||('village '+s.vi))}];return true;}
{const _sp=spawnTaxman;spawnTaxman=function(){const u=_sp.apply(this,arguments);if(u&&u.txRg){txjRoute(u);u.txTrip=1;}return u;};}
{const _t=updTax;updTax=function(u,dt){const was=u&&u.tax&&!u.dead;const r=_t.apply(this,arguments);
  if(was&&u.dead&&u.gone&&u.sack===0&&!G.over){ // just delivered at the gate
    if(txjRoute(u,u.txArea)){u.dead=false;u.gone=false;u.txeDone=0;u.txBolt=0;u.txGot=[];u.wait=TXJ.wait;u.txTrip=(u.txTrip||1)+1;TXJ.trips++;u.x=GATE.x;u.y=GATE.y+20;
      if(dist(u,D)<1500)float(GATE.x,GATE.y-50,`The tax collector rides out again: ${u.txAreas[0].names[0]}`,'#ffe0a0');}
    else TXJ.retired++;}
  return r;};}
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);if(Array.isArray(d.TX)){const L=units.filter(u=>u.tax&&!u.dead);d.TX.forEach((t,i)=>{const u=L[i];if(u){t.area=u.txArea||null;t.trip=u.txTrip||1;}});}return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(d&&Array.isArray(d.TX)){const L=units.filter(u=>u.tax);d.TX.forEach((t,i)=>{const u=L[i];if(u){u.txArea=t.area||null;u.txTrip=t.trip||1;}});}return r;};}
// ===== QUEUE 147k (all modes): when he BOLTS, the escort he borrowed from patrols STAYS BEHIND and fights; afterwards they rejoin their patrol =====
const TXK={stay:0,rejoin:0,calm:3,far:700};
function txkStay(m){const E=txeOf(m);for(const u of E){u.escort=null;u.txe=0;u.txStay=1;u.txCalm=0;u.retreat=false;u.born=G.t;TXK.stay++;}
  if(E.length){G.txkStay=(G.txkStay||0)+E.length;if(dist(m,D)<1200)float(E[0].x,E[0].y-40,'Hold the line! The taxes must get through!','#bfe0ff');}}
{const _t=updTax;updTax=function(u,dt){const b0=u&&u.txBolt;const r=_t.apply(this,arguments);if(u&&u.tax&&!b0&&u.txBolt)txkStay(u);return r;};}
function txkRejoin(u){u.txStay=0;const p=u.txP;u.txP=null;TXK.rejoin++;
  if(p){if(!patrols.includes(p)){p.dead=false;p.engaged=false;p.wp=null;patrols.push(p);}if(!p.members.includes(u))p.members.push(u);u.patrol=p;}else u.retreat=true;}
{const _u=updTaxes;updTaxes=function(dt){const r=_u.apply(this,arguments);
  for(const u of units){if(!u.txStay||u.dead)continue;u.born=G.t;if(dist(u,D)>TXK.far||G.over)u.txCalm+=dt;else u.txCalm=0;if(u.txCalm>=TXK.calm)txkRejoin(u);}return r;};}
// ===== QUEUE 141aa (all modes): Viking ships and longships keep AWAY from the ocean mini bosses and never engage them =====
// Kept-out circles: the giant squid (kraken) +900, the giant octopus +900, Nessie's loch +700 past her water, the storm Wizard's Isle +1400.
// No Viking waypoint, chase target or escort station may fall inside; a move that would enter one is refused (the ship turns away / holds).
// ===== QUEUE 141ab (all modes): Viking ships and longships NEVER enter fantasy-land water; a chase on the water stops at the fantasy boundary =====
const VKA={sq:900,oc:900,ns:700,wz:1400,blocked:0,skipSeek:0,skipEsc:0};
function vkBossZones(){const Z=[];for(const u of units){if(u.dead||u.type!=='sea')continue;if(u.kind==='squid')Z.push({x:u.x,y:u.y,r:VKA.sq});else if(u.kind==='octopus')Z.push({x:u.x,y:u.y,r:VKA.oc});}
  if(typeof NS!=='undefined'&&typeof NSZ!=='undefined'&&!(typeof nsDown==='function'&&nsDown()))Z.push({x:NS.on?NS.x:NSZ.x,y:NS.on?NS.y:NSZ.y,r:Math.max(NSZ.rx,NSZ.ry)+VKA.ns});
  if(typeof WZ!=='undefined')Z.push({x:WZ.x,y:WZ.y,r:WZ.r+VKA.wz});return Z;}
let VKA_Z=null,VKA_ZF=-1;const vkZones=()=>{if(VKA_ZF!==G.fc||!VKA_Z){VKA_Z=vkBossZones();VKA_ZF=G.fc;}return VKA_Z;};
function vkNearBoss(x,y,pad){for(const z of vkZones())if(d2(x,y,z.x,z.y)<z.r+(pad||0))return z;return null;}
const vkNoGo=(x,y,pad)=>vkFant(x,y)||!!vkNearBoss(x,y,pad);
// waypoint/goal moves (all roles): never into fantasy water or a boss circle
{const _ok=vkShipOK;vkShipOK=function(s,x,y){if(vkNoGo(x,y)&&!vkNoGo(s.x,s.y))return false;if(vkNoGo(s.x,s.y)){const z=vkNearBoss(s.x,s.y);if(z&&d2(x,y,z.x,z.y)<d2(s.x,s.y,z.x,z.y))return false;}return _ok.apply(this,arguments);};}
// a ship whose next step would enter a boss circle slides along the edge of the circle (toward its next waypoint/goal) instead of
// spinning in place, so a kraken or octopus parked beside the route can never trap it; it never slides onto land or into another no-go area
const VKS={slides:0};
function vkSlide(s,ax,ay){const z=vkNearBoss(ax,ay);if(!z||vkFant(ax,ay))return false;const st=Math.hypot(ax-s.x,ay-s.y);if(st<.01)return false;
  const T=(s.path&&s.path[0])||s.goal;let rx=s.x-z.x,ry=s.y-z.y;const rl=Math.hypot(rx,ry)||1;rx/=rl;ry/=rl;let tx=-ry,ty=rx;
  if(T&&(T.x-s.x)*tx+(T.y-s.y)*ty<0){tx=-tx;ty=-ty;}else if(!T&&(ax-s.x)*tx+(ay-s.y)*ty<0){tx=-tx;ty=-ty;}
  const wet=(x,y)=>inWater(x,y)&&(!inSea(x,y)||seaD(x,y)>s.r*.8);
  for(const sg of [1,-1])for(const k of [1,.5]){const cx=s.x+tx*sg*st*k+rx*st*.15,cy=s.y+ty*sg*st*k+ry*st*.15;
    if(!vkNoGo(cx,cy)&&wet(cx,cy)){s.x=cx;s.y=cy;s.ang=Math.atan2(ty*sg,tx*sg);VKS.slides++;return true;}}
  return false;}
// path following and longship rowing move without vkShipOK: refuse any step that enters a no-go area (a longship that is blocked unloads at the nearest shore)
{const _s=updVkShip;updVkShip=function(s,dt){const x=s.x,y=s.y,was=vkNoGo(x,y);const r=_s.apply(this,arguments);
  if(!was&&s.state!=='sink'&&!s.gone&&vkNoGo(s.x,s.y)){const ax=s.x,ay=s.y;s.x=x;s.y=y;VKA.blocked++;if(!vkSlide(s,ax,ay))s.ang+=dt*1.5;if(s.path&&s.path.length&&vkNoGo(s.path[0].x,s.path[0].y,-1)){s.path.shift();if(!s.path.length)s.path=null;}}return r;};}
{const _l=updVkLong;updVkLong=function(s,dt){if(s.state!=='sink'&&s.state!=='load'&&vkNoGo(s.tx,s.ty)&&!vkNoGo(s.x,s.y)){const a=Math.atan2(s.ty-s.y,s.tx-s.x);
    let k=0;while(k<60&&vkNoGo(s.tx,s.ty)){s.tx-=Math.cos(a)*40;s.ty-=Math.sin(a)*40;k++;}}
  const x=s.x,y=s.y,was=vkNoGo(x,y);const r=_l.apply(this,arguments);
  if(!was&&s.state==='row'&&vkNoGo(s.x,s.y)){s.x=x;s.y=y;VKA.blocked++;s.t=Math.max(s.t,40.5);}return r;};}
// chase: a dragon over fantasy water or inside a boss circle is not chased on the water (the ship patrols instead)
{const _k=vkSeek;vkSeek=function(g,s,dt){if(vkNoGo(D.x,D.y)){VKA.skipSeek++;s.goal=null;vkPatrol(g,s);return;}return _k.apply(this,arguments);};}
// escort: a royal trade ship sailing near a boss (or in fantasy water) is not escorted there
{const _e=vkEscortStep;vkEscortStep=function(g,s,dt){const r=_e.apply(this,arguments);if(r&&s.goal&&vkNoGo(s.goal.x,s.goal.y)){s.goal=null;VKA.skipEsc++;return false;}return r;};}
// patrol stations: skip a station inside a boss circle (fall back to the next safe one)
{const _p=vkPatrol;vkPatrol=function(g,s){const r=_p.apply(this,arguments);if(s.goal&&vkNoGo(s.goal.x,s.goal.y)){const P=vkSeaPosts().filter(p=>!vkNoGo(p.x,p.y,200));
    if(g.role==='sea'&&P.length){const p=P[(g.slot||0)%P.length];s.goal={x:p.x,y:p.y};}else s.goal=null;}return r;};}
// ======================= queue 150 / 150-fix: a bigger MINIMAP, more wide than tall (~+30% width, ~+10% height), no stretching =======================
// The world map keeps its true aspect: it is drawn ~10% bigger (uniform scale), and the frame is ~30% wider than before; the extra width is
// a framed margin either side (queue 153 later replaced the margin: the map is now drawn to fill the frame). The top-right corner stays put,
// and the frame never grows past the old "room" limit, so it stays clear of the centred WANTED panel and the touch buttons.
const MM150={w:1.3,h:1.1,f:null,n:0};
{const _g=hudMMGeom;hudMMGeom=function(sm){const o=_g.apply(this,arguments);try{
  const room=Math.floor(VW/2-(sm?210:260)-20),R=o.mx0+o.mmw,asp=o.mmh/o.mmw;
  let fw=Math.round(o.mmw*MM150.w);fw=Math.max(o.mmw,Math.min(fw,Math.max(room,o.mmw)));
  const cw=Math.min(o.mmw*MM150.h,fw),ch=cw*asp,fl=R-fw,mx0=fl+(fw-cw)/2;
  ctx.font='10px Georgia';const capW=Math.ceil(ctx.measureText(`Explored ${exploredPct()}%  ·  M: map`).width)+4;
  MM150.f={x:fl,y:o.my0,w:fw,h:ch,cx:mx0};MM150.n++;
  return{mx0,my0:o.my0,mmw:cw,mmh:ch,mmL:Math.min(fl-3,mx0+cw-capW),fw,fl,old:{w:o.mmw,h:o.mmh}};}catch(e){MM150.f=null;return o;}};}
// queue 153: no more blue side strips - the minimap is drawn to FILL the wider frame (stretched sideways by frame/map width, ~1.18x),
// so the minimap shows only the map. Every map layer (all the drawMap add-ons) is inside this transform, so icons stay lined up.
const MM153={n:0,k:1};
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const f=MM150.f;if(!big&&f&&Math.abs(mmx-f.cx)<.5&&f.w>mmw+1){const k=f.w/mmw;MM153.k=k;MM153.n++;
    ctx.save();const fT=ctx.fillText,sT=ctx.strokeText;
         // labels and icon glyphs are NOT stretched: each text is drawn at its stretched spot with the sideways scale undone
         const un=o=>function(t,x,y,...a){ctx.save();ctx.translate(x,y);ctx.scale(1/k,1);try{return o.call(this,t,0,0,...a);}finally{ctx.restore();}};
         let r;try{ctx.fillText=un(fT);ctx.strokeText=un(sT);ctx.translate(f.x-mmx*k,0);ctx.scale(k,1);r=_m.apply(this,arguments);}finally{delete ctx.fillText;delete ctx.strokeText;if(ctx.fillText!==fT){ctx.fillText=fT;ctx.strokeText=sT;}ctx.restore();}return r;}return _m.apply(this,arguments);};}
// the minimap's HUD box (used by the layout checks and taps) spans the whole wider frame
{const _h=drawHUD;drawHUD=function(){const r=_h.apply(this,arguments);try{const f=MM150.f;if(f&&UI.mm){const x0=Math.min(UI.mm.x,f.x-3),x1=Math.max(UI.mm.x+UI.mm.w,f.x+f.w+3);UI.mm.x=x0;UI.mm.w=x1-x0;}}catch(e){}return r;};}
// ======================= queue 150a / 150a-fix: only the THREE true castles keep the big map icons =======================
// Lumenspire Citadel (light), Doomforge Citadel (dark) and King William's Castle Aldric keep the item-137 castle icons. The forts / other
// strongholds (Ironhold Gate, Gorgrim War-Fort) go back to a normal-size marker: a small square in their side's colours, like before 137.
MAPC.fortSq={mini:5,big:9};
mapCastles=function(mmx,mmy,mmw,big){const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s,W=big?MAPC.big:MAPC.mini,P=MAPC.pal;
  if(typeof NR_TOWNS!=='undefined')for(const [n,k] of [['Ironhold Gate','L'],['Gorgrim War-Fort','D']]){const t=NRT(n);if(t&&(big?seen(t.x,t.y):true)){const q=big?MAPC.fortSq.big:MAPC.fortSq.mini;
    ctx.fillStyle=P[k].f;ctx.fillRect(X(t.x)-q/2,Y(t.y)-q/2,q,q);ctx.strokeStyle=P[k].o;ctx.lineWidth=1;ctx.strokeRect(X(t.x)-q/2,Y(t.y)-q/2,q,q);G.mapFortN=(G.mapFortN||0)+1;}}
  if(typeof NR_CC!=='undefined')for(const k in NR_CC){const c=NR_CC[k];mapCastle(X(c.x),Y(c.y),W,P[k],big);}
  mapCastle(X(CASTLE.x),Y(CASTLE.y)+(big?2:1),W,P.K,big);G.mapCastleN=(G.mapCastleN||0)+1;
  if(typeof PR!=='undefined'&&PR.state==='tower'){const pb=big?5:2.4;ell(X(PR.x),Y(PR.y),pb+1.5,pb+1.5,'#fff');ell(X(PR.x),Y(PR.y),pb,pb,'#f6c');}
  ell(X(D.x),Y(D.y),big?6:4,big?6:4,Math.floor(G.t*4)%2?'#f33':'#ff0');};
// ======================= queue 147l: every level STARTS with tax collectors already out =======================
// New game and every level-up (both go through newGame): on the first tax tick of the level, one mounted collector rides out per region
// that has taxable gold (richest region first, up to the usual cap), each placed partway (40%) along the road to his first area with his
// escort beside him, instead of everyone waiting at the gate. Loading a save clears the pending start (the save's own collectors are restored),
// so nothing is double-spawned.
const TXL={pend:0,frac:.4,n:0,last:[]};
{const _n=newGame;newGame=function(){const r=_n.apply(this,arguments);TXL.pend=1;return r;};}
{const _a=svApply;svApply=function(){const r=_a.apply(this,arguments);TXL.pend=0;return r;};}
function txlStart(){TXL.pend=0;TXL.last=[];if(G.over)return;const cap=tx147Cap();let guard=8;
  while(guard-->0&&units.filter(u=>u.tax&&!u.dead).length<cap){const u=spawnTaxman();if(!u)break;
    const s0=u.route&&u.route.find(t=>!t.home);
    if(s0){const gx=u.x,gy=u.y,nx=gx+(s0.x-gx)*TXL.frac,ny=gy+(s0.y-gy)*TXL.frac;u.x=nx;u.y=ny;
      for(const k of units)if(!k.dead&&k.escort===u){k.x=nx+R(-24,24);k.y=ny+R(-14,14);}}
    u.txStart=1;TXL.n++;TXL.last.push({rg:u.txRg,x:Math.round(u.x),y:Math.round(u.y),to:s0?s0.name||s0.wk||s0.mk:null,d:s0?Math.round(dist(u,s0)):0});}}
{const _u=updTaxes;updTaxes=function(dt){if(TXL.pend){try{txlStart();}catch(e){TXL.pend=0;}}return _u.apply(this,arguments);};}
// ======================= queue 147m / 147m-fix: released tax escorts RESTART their own patrol on its original route =======================
// When the tax man borrows soldiers (txeLend), the patrol's route is stored on the patrol and on each lent soldier (u.txR): a waystation
// patrol's site + loop index, or a road patrol's current waypoint, and its colours. When they are released (delivery, the tax man lost, or the
// 147k hold-the-line rejoin) and their old patrol was destroyed meanwhile, they re-create it on that SAME route with themselves as members
// (a site patrol that was already replaced joins the replacement on that same loop). Only a soldier with no route info at all retreats home.
// The route is also kept in saves, so escorts restored from a save still know their way back.
const TXM={saved:0,restarted:0,joined:0,last:null,np:new WeakMap()};
function txmRoute(p){if(!p)return null;if(p.txR)return p.txR;const L=p.members&&p.members.find(m=>m.colr);
  const R={site:p.site||null,li:p.li|0,wp:p.wp?{x:Math.round(p.wp.x),y:Math.round(p.wp.y)}:null,colr:L?L.colr:null,id:p.id};
  if(!R.site&&!R.wp){const m=p.members&&p.members[0];if(m)R.wp={x:Math.round(m.x),y:Math.round(m.y)};}
  if(!R.site&&!R.wp)return null;p.txR=R;TXM.saved++;return R;}
{const _l=txeLend;txeLend=function(m,u,p){const R=p?txmRoute(p):null;const r=_l.apply(this,arguments);if(R)u.txR=R;return r;};}
const txmGone=p=>!p||p.dead||!patrols.includes(p)||!p.members.some(x=>!x.dead&&!x.txe&&x.escort==null&&!x.txStay);
function txmPrep(u){const R=u.txR;let p=u.txP;if(!R)return;
  if(p&&!txmGone(p)&&!p.txLoad)return; // the old patrol is still out there: the normal rejoin
  if(R.site){const live=patrols.find(q=>q!==p&&q.site===R.site&&!q.dead&&q.members.some(x=>!x.dead));if(live){u.txP=live;TXM.joined++;return;}}
  if(!p){p=TXM.np.get(R);if(!p||p.dead&&patrols.includes(p)){p={id:++patrolId,members:[],engaged:false,wp:null};TXM.np.set(R,p);}}
  p.dead=false;p.txFix=R;u.txP=p;}
function txmFix(){for(const p of patrols){const R=p.txFix;if(!R)continue;p.txFix=null;p.txLoad=0;p.txR=R;
  if(R.site){const S=typeof WS!=='undefined'&&WS.sites?WS.sites().find(s=>s.key===R.site):null;if(S){p.site=R.site;p.siteS=S;p.li=R.li;p.wp=null;}else if(R.wp)p.wp={x:R.wp.x,y:R.wp.y};}
  else if(R.wp)p.wp={x:R.wp.x,y:R.wp.y};
  if(!p.members.some(m=>m.banner)&&p.members[0])p.members[0].banner=true;
  TXM.restarted++;TXM.last={id:p.id,site:p.site||null,li:p.li,wp:p.wp?{x:Math.round(p.wp.x),y:Math.round(p.wp.y)}:null,n:p.members.length};
  if(p.members[0]&&dist(p.members[0],D)<1200)float(p.members[0].x,p.members[0].y-40,'Back on our patrol!','#bfe0ff');}}
{const _r=txeRelease;txeRelease=function(m){for(const u of units)if(!u.dead&&u.escort===m&&u.txe)txmPrep(u);const r=_r.apply(this,arguments);txmFix();
  return r;};}
{const _k=txkRejoin;txkRejoin=function(u){txmPrep(u);const r=_k.apply(this,arguments);txmFix();return r;};}
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);if(Array.isArray(d.TX)){const L=units.filter(u=>u.tax&&!u.dead);
  d.TX.forEach((t,i)=>{const m=L[i];if(!m||!Array.isArray(t.esc))return;const E=txeOf(m);t.esc.forEach((e,j)=>{const u=E[j];if(u&&u.txR)e.r=u.txR;});});}return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(d&&Array.isArray(d.TX)){const L=units.filter(u=>u.tax);
  d.TX.forEach((t,i)=>{const m=L[i];if(!m||!Array.isArray(t.esc))return;const E=txeOf(m);t.esc.forEach((e,j)=>{const u=E[j];if(u&&e.r){u.txR=e.r;if(u.txP&&u.txP.txLoad)u.txP.txR=e.r;}});});}return r;};}
// ======================= queue 152: NO wave announcements (the WANTED bar already shows the threat) =======================
// spawnWave still musters the same troops, but its announcement is gone: the "The knights / foot soldiers are coming!" and
// "Reinforcements! ..." banner (with its "Wave N: ..." line and the first-time troop tips), the war horn it blew, and its screen shake.
// Any banner that was already up (or that the caller sets afterwards, e.g. the princess capture) is untouched.
const W152={muted:0};
{const _w=spawnWave;spawnWave=function(){const b0=G.banner,sh0=G.shake,h0=typeof horn==='function'?horn:null;if(h0)horn=function(){};
  try{return _w.apply(this,arguments);}finally{if(h0)horn=h0;if(G.banner!==b0){G.banner=b0;W152.muted++;}G.shake=sh0;}};}
// ======================= queue 151 / 151-fix: the castle quietly tops up its patrols every 60 s =======================
// Every 60 s, unless the castle is under attack (a castle building hit in the last 20 s, the dragon within 1200 px of the gate, or the
// militia out), every patrol that is not fighting and is below its original strength gets fresh soldiers from the castle gate: the exact
// lost types (foot / knight / mounted knight / archer, at the patrol's original hit points and colours). They ride out and fall in once they
// reach the column. Soldiers lent to a tax man or on their way back count as present. Never past maxSoldiers (170). Missing patrols keep the
// existing 45 s / 25 s replacement timer. 151-fix: completely silent (no banner, float text, alert or sound).
const RP151={every:60,t:60,passes:0,skipped:0,sent:0,joined:0,capped:0,hitWin:20,nearGate:1200,last:null};
const rp151Kind=u=>u.type==='archer'?'archer':u.mounted?'cavalry':u.foot?'foot':'knight';
function rp151Attack(){return(G.vkHitT!=null&&G.t-G.vkHitT<RP151.hitWin)||d2(D.x,D.y,GATE.x,GATE.y)<RP151.nearGate||!!G.milOn;}
function rp151Mk(o){const x=GATE.x+R(-20,20),y=GATE.y+10;let u;
  if(o.k==='foot')u=mkUnit('knight',x,y,{hp:o.hp,maxHp:o.hp,atk:0,foot:true,colr:o.colr});else if(o.k==='cavalry')u=mkCavalry(x,y,o.colr?{colr:o.colr}:{});
  else if(o.k==='archer')u=mkUnit('archer',x,y,{hp:o.hp,maxHp:o.hp,shootT:R(1,3)});else u=mkUnit('knight',x,y,{hp:o.hp,maxHp:o.hp,atk:0,colr:o.colr});
  u.hp=u.maxHp=o.hp;u.born=G.t;return u;}
function rp151Pass(){RP151.passes++;let sent=0;const per=[];
  for(const p of patrols){if(p.dead||p.engaged||!p.orig||!p.members.some(u=>!u.dead))continue;
    const have={};const cnt=u=>{const k=rp151Kind(u);have[k]=(have[k]||0)+1;};
    for(const u of p.members)if(!u.dead)cnt(u);for(const u of units)if(!u.dead&&!u.gone&&(u.txP===p||u.rp151===p)&&!p.members.includes(u))cnt(u);
    const need=[];for(const o of p.orig){if(have[o.k]>0)have[o.k]--;else need.push(o);}
    let n=0;for(const o of need){if(soldierCount()>=PATROL_CFG.maxSoldiers){RP151.capped++;break;}const u=rp151Mk(o);u.patrol=p;u.rp151=p;units.push(u);n++;sent++;}
    if(n)per.push({id:p.id,n,orig:p.orig.length});}
  if(sent)G.gateOpenT=Math.max(G.gateOpenT||0,2);RP151.sent+=sent;RP151.last={t:Math.round(G.t),sent,per};return sent;}
{const _u=updPatrols;updPatrols=function(dt){const r=_u.apply(this,arguments);
  for(const p of patrols)if(!p.orig&&p.members.length)p.orig=p.members.filter(u=>!u.dead).map(u=>({k:rp151Kind(u),hp:u.maxHp,colr:u.colr||null}));
  // reinforcements on their way: ride to the patrol leader, then fall into the column
  for(const u of units){const p=u.rp151;if(!p||u.dead)continue;if(p.dead||!patrols.includes(p)){u.rp151=null;u.patrol=null;u.retreat=true;continue;}
    const L=p.members.find(m=>!m.dead);if(!L){continue;}if(p.engaged){if(dist(u,L)<120){u.rp151=null;p.members.push(u);RP151.joined++;}continue;}
    if(dist(u,L)<70){u.rp151=null;p.members.push(u);RP151.joined++;continue;}moveTo(u,L.x,L.y,u.mounted?95:72,dt);if(u.mounted){u.cs='wheel';u.ha=Math.atan2(L.y-u.y,L.x-u.x);}}
  if(G.over||G.won)return r;RP151.t-=dt;if(RP151.t<=0){RP151.t=RP151.every;if(rp151Attack())RP151.skipped++;else rp151Pass();}return r;};}

// ======================= QUEUE 139 (139-GO): HARD MODE - a new selectable mode (title screen: NORMAL -> EASY -> HARD) =======================
// Normal and easy are untouched: every rule below checks G.hard (HM.on()). Saved in the save file (G.hard) and remembered on the title screen (localStorage dr_hard).
//  139a food fills hunger and gluttony 25% less (x0.75)          139b fighters at full health must be bitten (24 dmg) before they can be eaten
//  139c regular troops x1.3 health+attack, then x1.05 per castle level compounding   139d/e crossbows: royal knights + the prince (1 bolt), King William (3-bolt spread)
//  139f/i mini bosses + both wizards: health x1.2^(L-1), damage x1.1^(L-1)           139g/141n Viking hire 500 / 25 (VK hook, already built)
//  139h fire + fly meters drain 10% faster   139j alphas x1.075^(L-1) health+damage   139k castle starts with double gold/wood/stone (then +10%/level)
//  139l a town building upgrades to stone every 45 s (normal 60 s; same stone price, same 100-stone reserve)   139m town/desert towers +1%/level health+bolt damage
//  139n rich desert caravan 15% faster out of combat   139o Dark Wizard LAVA FLOOD on Cinder Isle   139p wood/stone carts 10% faster
let HARD=false;try{HARD=localStorage.getItem('dr_hard')==='1';}catch(e){}
const HM={food:.75,bite:24,troop:1.3,troopLv:1.05,bossHp:1.2,bossDm:1.1,drain:1.10,alpha:1.075,start:2,stoneEvery:45,tower:1.01,caravan:1.15,cart:1.10,
  xb:{range:480,min:70,sp:520,knight:5,prince:6,king:7,kingN:3,kingSpread:.18,cdK:[3,4.2],cdP:[2.6,3.4],cdW:[3.2,4]},
  flood:{warn:2.2,dur:5,cd:[13,17],dps:9,tick:.5},
  on:()=>!!(G&&G.hard),L:()=>Math.max(1,(G&&G.lvl)||1),cur:null,ld:0,force:null,xbList:[],stats:{xb:0,xbKing:0,flood:0,floodDmg:0,troops:0,alphas:0,towers:0,fed:0}};
function hmLvPow(b){return Math.pow(b,HM.L()-1);}
function hmTroopMul(){return HM.troop*hmLvPow(HM.troopLv);}
function setHard(v){HARD=!!v&&!EASY;try{localStorage.setItem('dr_hard',HARD?'1':'0');}catch(e){}if(G&&scene!=='play')G.hard=HARD?1:0;}
// --- mode select: the title "Mode" row now cycles NORMAL -> EASY -> HARD (left arrow / A goes the other way) ---
{const _se=setEasy;setEasy=function(v){
  if(scene==='title'&&!HM.ld&&(P('m')||P('arrowleft')||P('arrowright')||P('a')||P('d')||P('enter'))){const back=P('arrowleft')||P('a'),m=EASY?1:HARD?2:0,n=(m+(back?2:1))%3;_se(n===1);setHard(n===2);return;}
  _se(v);if(v)setHard(false);};}
{const _ng=newGame;newGame=function(opt){const r=_ng.apply(this,arguments);if(!G)return r;const h=HM.force!==null?HM.force:(HARD&&!EASY);G.hard=h?1:0;
  if(h){for(const p of goldPiles)p.amt=Math.round(p.amt*HM.start);G.wood=Math.round(G.wood*HM.start);G.stone=Math.round(G.stone*HM.start);
    if(KS125.last)Object.assign(KS125.last,{hard:1,gold:goldPiles.reduce((a,p)=>a+p.amt,0),wood:G.wood,stone:G.stone});}
  return r;};}
{const _sa=svApply;svApply=function(d){HM.ld=1;HM.force=!!(d&&d.G&&d.G.hard);try{return _sa.apply(this,arguments);}finally{HM.ld=0;HM.force=null;HARD=!!(G&&G.hard);try{localStorage.setItem('dr_hard',HARD?'1':'0');}catch(e){}}};}
{const _sm=svMeta;svMeta=function(d){const m=_sm.apply(this,arguments);m.hard=!!(d&&d.G&&d.G.hard);return m;};}
{const _sd=svDesc;svDesc=function(i){const s=_sd.apply(this,arguments);return i&&i.hard&&!i.old?s+'  ·  Hard':s;};}
{const _dt=drawTitle;drawTitle=function(){_dt.apply(this,arguments);if(!HARD||EASY)return;const T=TOUCH.tg;if(!T)return;
  ctx.setTransform(DPR*T.k,0,0,DPR*T.k,DPR*T.ox,0);const W0=VW,y=T.y0+36,s=titleSel===1;panel(W0/2-230,y,460,30);
  if(s){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.strokeRect(W0/2-230,y,460,30);}
  txt('Mode:  HARD (tougher troops, crossbows, less food)   ◀ ▶',W0/2,y+21,17,s?'#ffd24a':'#ff8a6a','center');ctx.setTransform(DPR,0,0,DPR,0,0);};}
{let inHud=0;const _t=txt;txt=function(s){if(inHud&&s==='THE DRAGON'&&G&&G.hard){arguments[0]='THE DRAGON  ·  HARD MODE';arguments[4]='#ff9a7a';}return _t.apply(this,arguments);};
  const _h=drawHUD;drawHUD=function(){inHud=1;try{return _h.apply(this,arguments);}finally{inHud=0;}};}
// --- 139a: food counts 25% less (hunger meter + gluttony meter) ---
{const _f=feed;feed=function(heal){if(!HM.on())return _f.apply(this,arguments);const a=HUNGER.feedMul,b=HUNGER.feedMin;HUNGER.feedMul=a*HM.food;HUNGER.feedMin=b*HM.food;HM.stats.fed++;
  try{return _f.apply(this,arguments);}finally{HUNGER.feedMul=a;HUNGER.feedMin=b;}};}
{const _g=glutEat;glutEat=function(food){if(HM.on()&&food>0)arguments[0]=food*HM.food;return _g.apply(this,arguments);};}
// --- 139b: anything that can attack must be hurt before it can be eaten (the first bite only damages: 24, never below 1 HP) ---
function hmFighter(u){return !!u&&(u.type==='knight'||u.type==='archer'||u.type==='hunter'||u.militia||u.type==='crew'&&!!u.siege);}
{let d0=BT145.dmg;Object.defineProperty(BT145,'dmg',{get:()=>HM.on()?HM.bite:d0,set:v=>{d0=v;},configurable:true});}
{const _bb=bt145Big;bt145Big=function(u){if(!HM.on())return _bb.apply(this,arguments);return !!u&&!bt145Safe(u)&&hmFighter(u)&&!bt145Tough(u)&&!u.hmHurt&&u.hp>1;};}
{const _hu=hurtUnit;hurtUnit=function(u,d){if(u&&typeof d==='number'&&d>0&&HM.on())u.hmHurt=1;return _hu.apply(this,arguments);};}
// --- 139c: regular troops (castle/prince/raid/desert/treasure-ship soldiers + archers incl. tower archers) x1.3 then x1.05/level ---
// Not King William, the prince, raid champions, guardians or your Viking allies (they have their own hard rule: 500/25 hire).
function hmTroop(u){return (u.type==='knight'||u.type==='archer')&&!u.isKing&&!u.isKingArmor&&!u.isPrince&&!u.champ&&!u.vk&&!u.gd&&!u.guardian&&!u.princess;}
function hmXbow(u){return u.type==='knight'&&!u.dead&&!u.inside&&!u.vk&&(u.isKingArmor||u.isPrince||(!u.foot&&!u.dsol&&!u.dcam&&!u.champ&&!u.raid&&!u.gd&&!u.guardian));}
// --- 139j: alphas (pack leaders, alpha hippos, realm alphas) x1.075^(L-1) health (+ damage below). The white elephant and tigers keep max(their linear scaling, 1.075^(L-1)).
function hmAlpha(u){return u.species!=='elephant'&&u.species!=='tiger'&&(u.alpha||u.atAlpha||(typeof tfIsLeader==='function'&&tfIsLeader(u)));}
{const _h=el129Hp,_b=el129Bite;el129Hp=function(l){l=l||el129Lv();const v=_h(l);return HM.on()?Math.max(v,Math.round(EL129.hp0*Math.pow(HM.alpha,l-1))):v;};
  el129Bite=function(l){l=l||el129Lv();const v=_b(l);return HM.on()?Math.max(v,+(EL129.bite0*AL119.mul*Math.pow(HM.alpha,l-1)).toFixed(2)):v;};}
{const h0=TG143.lvHp,d0=TG143.lvDm;TG143.lvHp=l=>HM.on()?Math.max(h0(l),Math.pow(HM.alpha,l-1)):h0(l);TG143.lvDm=l=>HM.on()?Math.max(d0(l),Math.pow(HM.alpha,l-1)):d0(l);}
// --- 139f/i: mini-boss scaling becomes 1.2^(L-1) health / 1.1^(L-1) damage, and both wizards join it ---
{const _bh=bossHpMul,_bd=bossDmMul;bossHpMul=function(){return HM.on()?Math.pow(HM.bossHp,lvsL()-1):_bh();};bossDmMul=function(){return HM.on()?Math.pow(HM.bossDm,lvsL()-1):_bd();};}
{const _w=WZ140.hpMul;WZ140.hpMul=()=>HM.on()?bossHpMul():_w();}
const HM_WIZ={ice:1,lightning:1,wind:1,lava:1,erupt:1,lavaflood:1};
// one damage hook for 139c lance / 139f wizards / 139j alphas / 139m bolts
{const _hd=hurtDragon;hurtDragon=function(d,src){if(HM.on()&&typeof d==='number'&&d>0){const u=HM.cur;
    if(HM_WIZ[src]&&(WZB.on||DWB.on))d*=Math.pow(HM.bossDm,lvsL()-1);
    else if(src==='bolt')d*=hmLvPow(HM.tower);
    else if(u&&u.hmA)d*=u.hmA;
    else if(u&&u.hmM&&src==='lance')d*=u.hmM;}
  return _hd.call(this,d,src);};}
for(const n of['updKnight','updCavalry','updWild','nrUpd','hpUpd']){const f=window[n];if(typeof f!=='function')continue;
  const w=function(u){const p=HM.cur;HM.cur=u;try{return f.apply(this,arguments);}finally{HM.cur=p;}};Object.assign(w,f);
  if(n==='updKnight')updKnight=w;else if(n==='updCavalry')updCavalry=w;else if(n==='updWild')updWild=w;else if(n==='nrUpd')nrUpd=w;else hpUpd=w;}
// --- 139l: one town building to stone every 45 s (normal: 60 s); price and the 100-stone reserve unchanged ---
{let e0=STUP.every;Object.defineProperty(STUP,'every',{get:()=>HM.on()?HM.stoneEvery:e0,set:v=>{e0=v;},configurable:true});}
// --- 139m: town archer/scorpion towers + desert towers +1% health per level (castle towers and realm turrets already scale more) ---
const HM_TOWER=new Set(['wtower','stower','dtower']);
// --- 139n: rich desert caravan 15% faster when nothing is fighting it ---
{let sp0=RCV.spd;Object.defineProperty(RCV,'spd',{get:()=>HM.on()&&!HM.rcFight?sp0*HM.caravan:sp0,set:v=>{sp0=v;},configurable:true});}
// --- 139p: wood/stone (supply) carts 10% faster ---
{const _s=scStep;scStep=function(c){if(!HM.on())return _s.apply(this,arguments);const v=SC.speed;SC.speed=v*HM.cart;try{return _s.apply(this,arguments);}finally{SC.speed=v;}};}
// --- 139h + the 0.25 s scans + crossbows ---
{const _u=update;let acc=0;update=function(dt){if(!HM.on())return _u.apply(this,arguments);const st0=D.st,f0=D.fire,air=D.mode==='air'||D.alt>.3;
  const r=_u.apply(this,arguments);
  if(!G.over){if(air&&D.st<st0)D.st=Math.max(0,D.st-(st0-D.st)*(HM.drain-1));if(typeof f0==='number'&&D.fire<f0)D.fire=Math.max(0,D.fire-(f0-D.fire)*(HM.drain-1));
    acc+=dt;if(acc>=.25){acc=0;hmScan();}hmXbTick(dt);}
  return r;};}
function hmScan(){const tm=hmTroopMul(),am=hmLvPow(HM.alpha),tw=hmLvPow(HM.tower);HM.xbList=[];let fight=false;
  for(const u of units){if(u.dead)continue;
    if(!u.hmM&&hmTroop(u)){u.hmM=tm;u.maxHp=Math.round((u.maxHp||u.hp)*tm);u.hp=Math.round(u.hp*tm);u.dmgMul=(u.dmgMul||1)*tm;HM.stats.troops++;}
    if(!u.hmA&&u.type==='animal'&&hmAlpha(u)&&am>1){u.hmA=am;u.maxHp=Math.round((u.maxHp||u.hp)*am);u.hp=Math.round(u.hp*am);HM.stats.alphas++;}
    if(hmXbow(u))HM.xbList.push(u);
    if(u.rc&&Math.hypot(u.x-D.x,u.y-D.y)<700)fight=true;}
  if(typeof NRU!=='undefined')for(const u of NRU)if(!u.dead&&!u.hmA&&(u.alpha||u.atAlpha)&&am>1){u.hmA=am;u.maxHp=Math.round((u.maxHp||u.hp)*am);u.hp=Math.round(u.hp*am);HM.stats.alphas++;}
  HM.rcFight=fight;
  if(tw>1)for(const s of structures)if(HM_TOWER.has(s.kind)&&!s.hmT&&s.maxHp>0){s.hmT=tw;s.maxHp=Math.round(s.maxHp*tw);s.hp=Math.round(s.hp*tw);HM.stats.towers++;}}
function hmXbFire(u,a,dmg){const s=HM.xb.sp;projs.push({kind:'arrow',x:u.x,y:u.y-6,z:16,vx:Math.cos(a)*s,vy:Math.sin(a)*s,tz:heightOf()+15,life:1.3,dmg,z0:16,xb:1});HM.stats.xb++;}
function hmXbTick(dt){if(G.won||scene!=='play')return;const X=HM.xb;
  for(const u of HM.xbList){if(u.dead||u.inside||u.dizzy>0||u.carried||u.grabbed)continue;
    if(u.xbT===undefined)u.xbT=R(1,2.5);u.xbT-=dt;if(u.xbAim>0)u.xbAim-=dt;const dd=Math.hypot(D.x-u.x,D.y-u.y);
    if(u.xbT>0||dd>X.range||dd<X.min)continue;
    const T=dd/X.sp,a=Math.atan2(D.y+D.vy*T*.5-u.y,D.x+D.vx*T*.5-u.x);u.face=D.x>u.x?1:-1;u.xbAim=.35;
    if(u.isKingArmor){u.xbT=R(X.cdW[0],X.cdW[1]);for(let i=0;i<X.kingN;i++)hmXbFire(u,a+(i-(X.kingN-1)/2)*X.kingSpread,X.king);HM.stats.xbKing++;
      if(rnd()<.4)float(u.x,u.y-84,'Royal crossbow - three bolts!','#ffe08a');}
    else if(u.isPrince){u.xbT=R(X.cdP[0],X.cdP[1]);hmXbFire(u,a,X.prince);}
    else{u.xbT=R(X.cdK[0],X.cdK[1]);hmXbFire(u,a,X.knight*(u.hmM||1));}}}
{const _dk=drawKnight;drawKnight=function(u){const r=_dk.apply(this,arguments);if(!HM.on()||!hmXbow(u)||!(u.xbShow>0))return r; // 139w: only drawn while shooting
  const f=u.face||1,k=u.isKingArmor?1.35:1,x=u.x+f*9*k,y=u.y-(u.mounted?34:22)*k-(u.isKingArmor?8:0),aim=u.xbAim>0;
  line(x-f*7*k,y+2,x+f*9*k,y-(aim?2:0),'#6a4020',3*k);line(x+f*7*k,y-7*k,x+f*7*k,y+6*k,'#3a2a1a',2*k);line(x+f*7*k,y-7*k,x+f*1*k,y,'#ddd',1);line(x+f*7*k,y+6*k,x+f*1*k,y,'#ddd',1);
  if(aim)ell(x+f*10*k,y-1,2,2,'#ffe08a');return r;};}
// --- 139o: the Dark Wizard's LAVA FLOOD - the volcano rumbles (telegraph), then lava covers Cinder Isle for 5 s; only hurts on the ground ---
const HMF={st:'idle',t:6,tick:0};
{const _d=dwUpd;dwUpd=function(dt){const r=_d.apply(this,arguments);if(!HM.on()||!DWB.on||dwDown()||DWB.koT>0||G.over){if(HMF.st!=='idle'){HMF.st='idle';HMF.t=6;}return r;}
  const F=HM.flood;HMF.t-=dt;
  if(HMF.st==='idle'&&HMF.t<=0){HMF.st='warn';HMF.t=F.warn;const t=dwTop();float(t.x,t.y-40,'The volcano rumbles... LAVA FLOOD - take off!','#ffb060');showToast('🌋 The volcano rumbles - Cinder Isle is about to FLOOD with lava! Get airborne!');G.shake=Math.max(G.shake||0,3);}
  else if(HMF.st==='warn'){G.shake=Math.max(G.shake||0,1.5);if(HMF.t<=0){HMF.st='flood';HMF.t=F.dur;HMF.tick=0;HM.stats.flood++;float(DWV.x,DWV.y-DWV.H-30,'LAVA FLOOD!','#ff7a2a');}}
  else if(HMF.st==='flood'){HMF.tick-=dt;if(HMF.tick<=0){HMF.tick=F.tick;if(onDwIsle(D.x,D.y)&&D.alt<.3){const d=F.dps*F.tick;const h0=D.hp;hurtDragon(d,'lavaflood');HM.stats.floodDmg+=h0-D.hp;
      if(rnd()<.5)float(D.x,D.y-heightOf()-80,'Hot hot HOT! Fly up!','#ffb060');}}
    if(HMF.t<=0){HMF.st='idle';HMF.t=R(F.cd[0],F.cd[1]);}}
  return r;};}
{const _w=drawWells;drawWells=function(){const r=_w.apply(this,arguments);if(HMF.st==='idle'||Math.abs(cam.x-DWV.x)>2600||Math.abs(cam.y-DWV.y)>2200)return r;
  const rx=DWV.r,ry=DWV.r/1.2,p=.5+.5*Math.sin(G.t*8);
  if(HMF.st==='warn'){const q=1-HMF.t/HM.flood.warn;ctx.strokeStyle=`rgba(255,120,30,${.5+.4*p})`;ctx.lineWidth=5;ctx.setLineDash([14,10]);ctx.beginPath();ctx.ellipse(DWV.x,DWV.y,rx,ry,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
    ell(DWV.x,DWV.y,rx*q,ry*q,`rgba(255,110,30,${.18+.1*p})`);for(let i=0;i<6;i++){const a=i*TAU/6+G.t;ell(DWV.x+Math.cos(a)*rx*.35*q,DWV.y+Math.sin(a)*ry*.35*q-DWV.H*.2,10,6,'rgba(255,150,40,.55)');}}
  else{const k=Math.min(1,(HM.flood.dur-HMF.t)/.6,HMF.t/.6+.15);ell(DWV.x,DWV.y,rx*k,ry*k,'rgba(200,50,10,.85)');ell(DWV.x,DWV.y,rx*.86*k,ry*.86*k,`rgba(255,${110+40*p|0},20,.75)`);
    for(let i=0;i<10;i++){const a=i*2.39+G.t*.6,rr=(.25+.6*((i*37)%10)/10)*k;ell(DWV.x+Math.cos(a)*rx*rr,DWV.y+Math.sin(a)*ry*rr,7+4*Math.sin(G.t*5+i),4,'rgba(255,230,120,.8)');}}
  return r;};}
// ===== QUEUE 139q-fix + 139r (HARD MODE only): patrols grow with the level =====
// 139q-fix: +1 ARCHER on every EVEN level and +1 SWORD (foot) soldier on every ODD level from level 2 on (cumulative; level 1 unchanged):
//           L2 +1 archer, L3 +1 archer +1 sword, L4 +2 archers +1 sword, L5 +2/+2 ...
// 139r:     +1 MOUNTED knight (cavalry) at every 5th level (L5, L10, L15 ...), cumulative and on top of the above.
// Extras use the patrol's own colours and level HP; hard-mode troop strength (139c) applies to them like every other soldier. Safety cap: 20 extra per patrol.
const HMP={cap:20,added:0};
function hmPatrolExtra(L){const a=Math.floor(L/2),s=Math.floor((L-1)/2),c=Math.floor(L/5);return{archer:a,foot:s,cavalry:c};}
{const _sp=spawnPatrol;spawnPatrol=function(){const p=_sp.apply(this,arguments);if(!p||!HM.on())return p;
  const L=HM.L(),E=hmPatrolExtra(L),hpM=1+.2*(L-1),b=p.members[0],colr=(b&&b.colr)||'#c33';let n=0;const add=[];
  for(const [k,c] of [['cavalry',E.cavalry],['archer',E.archer],['foot',E.foot]])for(let i=0;i<c&&n<HMP.cap;i++,n++){const x=GATE.x+R(-20,20),y=GATE.y+10+(p.members.length+add.length)*6;let u;
    if(k==='foot')u=mkUnit('knight',x,y,{hp:24,maxHp:24,atk:0,foot:true,colr});else if(k==='cavalry')u=mkCavalry(x,y,{colr});else u=mkUnit('archer',x,y,{hp:22,maxHp:22,shootT:R(1,3)});
    u.hp=u.maxHp=Math.round(u.maxHp*hpM);u.patrol=p;u.born=G.t;u.hmExtra=k;add.push(u);}
  p.members.push(...add);units.push(...add);HMP.added+=add.length;p.hmExtra=E;return p;};}
// ===== 139s: HARD - the tax collector spawn/respawn timer is 30 s (normal 40 s, easy 55 s) =====
const HMS={every:30,resets:0};
{const _u=updTaxes;updTaxes=function(dt){const t0=G.taxT;const r=_u.apply(this,arguments);
  if(HM.on()&&t0!==undefined&&G.taxT>t0&&G.taxT>HMS.every){G.taxT=HMS.every;HMS.resets++;}return r;};}
// ===== 139t: HARD - King William gives chase after only 5 s, and rides his horse while he chases =====
// Normal: once the dragon carries Princess Elizabeth out of the castle area he gathers his men after 6 s (7 s easy); hard: 5 s.
// (The other chase, after he wakes from being knocked out dizzy, now follows the 20 s dizzy time of 139u.)
// While charging (phase 'charge') in hard mode he sits on a big golden-caparisoned warhorse and rides at 145 instead of 115.
const HMK={rescue:5,horseSp:145,rides:0,dizzy:20};
{const _r=kaRescueDelay;kaRescueDelay=function(){return HM.on()?HMK.rescue:_r.apply(this,arguments);};}
{const _c=kaCharge;kaCharge=function(){const r=_c.apply(this,arguments);if(HM.on()&&KA.u){KA.u.kaHorse=1;HMK.rides++;}return r;};}
{const _s=kaStep;kaStep=function(u,dt){if(u&&u.kaHorse&&(KA.phase!=='charge'||!HM.on()))u.kaHorse=0;if(!(u&&u.kaHorse))return _s.apply(this,arguments);
  const o=KA_CFG.chargeSp;KA_CFG.chargeSp=HMK.horseSp;try{return _s.apply(this,arguments);}finally{KA_CFG.chargeSp=o;}};}
function hmKingHorse(x,y,f,an){const g=Math.sin(an*1.6);ctx.save();ctx.translate(x,y);ctx.scale(1.7,1.7);
  ell(0,2,17,5,'rgba(0,0,0,.25)');for(const lx of[-8,-4,5,9])line(lx,-7,lx+g*3*(lx>0?1:-1),1,'#2a1a0a',2.4);
  ell(0,-11,14,6.5,'#5a3a22');rect(-10,-15,20,7,'#a8142a');rect(-10,-9,20,1.6,'#ffd23a');
  ell(f*12,-17,3.8,5.8,'#5a3a22');ell(f*15.5,-21,4.8,3.1,'#5a3a22');ell(f*17,-22,1,1,'#111');poly([f*11,-21,f*13,-21,f*11.5,-26],'#ffd23a');
  line(-f*13,-12,-f*18,-3,'#2a1a0a',2.6);ctx.restore();}
{const _d=drawArmoredKing;drawArmoredKing=function(u){if(!(u&&u.kaHorse&&!u.dizzy&&KA.phase==='charge'))return _d.apply(this,arguments);
  hmKingHorse(u.x,u.y,u.face||1,u.anim||0);const y0=u.y;u.y=y0-24;try{return _d.apply(this,arguments);}finally{u.y=y0;}};}
// ===== 139u: HARD - King William stays knocked out dizzy for 20 s (normal 30 s); the banner says 20 =====
{const _z=kaDizzy;kaDizzy=function(){const o=KA_CFG.dizzy;if(HM.on())KA_CFG.dizzy=HMK.dizzy;try{return _z.apply(this,arguments);}finally{KA_CFG.dizzy=o;}};}
// ======================= queue 154: a HARD boundary - fairies and every other fantasy-land creature stay NORTH of the magic mountains / magic wind wall =======================
// Applies after every update, so it covers wandering, chasing, fleeing, flying, dashes, knockback and anything else that moves them:
//  - realm units (zone 'nr': unicorns, elves, trolls, cyclopes, Medusa, Cerberus, Hydra, wild dragons... flying ones too),
//  - fairies and vampire bats (b3), the Griffin, and the mermaids (already culled south of the wall by queue 93).
// The line is the magic barrier itself (nrEdge, which is the crystal mountains on land and the magic winds over the sea), less a 40 px margin.
// A fairy that is stinging the dragon gives up and flies home when the dragon is south of the wall. Only the player's dragon may cross.
// The Storm Wizard's isle is south of the wall by design (he holds the barrier) and is not a fantasy-land creature, so it is not affected.
const FB154={m:40,units:0,birds:0,gr:0,stings:0,passes:0};
function fb154Line(x){return nrEdge(x)-FB154.m;}
function fb154Fantasy(u){return !!(u&&(u.nr||u.zone==='nr'));}
function fb154Skip(u){return !u||u.dead||u.inside||u.princess||u.isPrincess||(typeof D!=='undefined'&&D.carry===u)||u.carried||u.held;}
function fb154Pass(){FB154.passes++;
  for(const u of units){if(!fb154Fantasy(u)||fb154Skip(u))continue;const L=fb154Line(u.x);if(u.y>L){u.y=L;if(u.vy>0)u.vy=0;FB154.units++;}}
  if(typeof birds!=='undefined')for(const b of birds){const k=b.b3||b.kind||b.type;if(b.dead||(k!=='fairy'&&k!=='vbat'))continue;
    if(k==='fairy'&&b.md==='sting'&&D.y>fb154Line(D.x)-60){b.md='home';b.mt=0;b.cd=R(4,6);FB154.stings++;}
    const L=fb154Line(b.x);if(b.y>L){b.y=L;FB154.birds++;}}
  if(typeof GR!=='undefined'&&GR.on){const L=fb154Line(GR.x);if(GR.y>L){GR.y=L;FB154.gr++;}}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{if(scene==='play'&&G&&typeof nrEdge==='function')fb154Pass();}catch(e){FB154.err=String(e);}return r;};}
// ======================= queue 157: King William never runs away because a bridge burned =======================
// Bug: while he chased the dragon (phase 'charge') across the Silver River and the dragon wrecked the bridges, riverRoute sent him on the long
// "go round Mirror Lake" detour (or to a far-off bridge), so he turned and marched AWAY from the dragon. Now:
//  - a standing bridge that is not a huge detour (route <= 2.2x the straight distance + 600) -> he repaths over it, as before;
//  - otherwise he HOLDS at the nearest point of his own riverbank facing the dragon and shoots his royal crossbow (3-bolt spread) across the water.
// He keeps the chase going (no retreat because his path broke); the usual chase time limit, dizzy and lair rules are unchanged.
const KB157={ratio:2.2,extra:600,range:560,dmg:5,n:3,spread:.18,cd:[2.6,3.4],holdT:0,bolts:0,holds:0,repath:0,last:null};
function kb157Cross(u){if(typeof rside!=='function'||typeof riverY!=='function')return false;const ru=rside(u.x,u.y),rd=rside(D.x,D.y);if(!ru||!rd||ru===rd)return false;
  if((u.y<3150&&D.y<3150)||(u.x<1900&&D.x<1900))return false;return true;}
function kb157Bank(u){const su=rside(u.x,u.y);let best=null,bd=1e18;
  for(let k=-10;k<=10;k++){const x=D.x+k*50,ry=riverY(x);if(ry==null)continue;const y=ry+su*(RIVW+36);
    if((typeof inSea==='function'&&inSea(x,y))||(typeof inLake==='function'&&inLake(x,y))||riverD(x,y)<RIVW+10)continue;
    const d=d2(x,y,D.x,D.y)+.1*d2(x,y,u.x,u.y);if(d<bd){bd=d;best={x,y};}}return best;}
function kb157Need(u){if(KA.phase!=='charge'||!u||u.dizzy||!kb157Cross(u))return null;
  const direct=Math.hypot(D.x-u.x,D.y-u.y);let best=1e18;
  for(const s of structures)if(s.kind==='bridge'&&s.state==='ok'){const L=Math.hypot(s.x-u.x,s.y-u.y)+Math.hypot(D.x-s.x,D.y-s.y);if(L<best)best=L;}
  if(best<=direct*KB157.ratio+KB157.extra){KB157.repath++;return null;}return kb157Bank(u);}
function kb157Fire(u){const X=KB157,sp=520,dd=Math.hypot(D.x-u.x,D.y-u.y),T=dd/sp,a=Math.atan2(D.y+(D.vy||0)*T*.5-u.y,D.x+(D.vx||0)*T*.5-u.x);
  for(let i=0;i<X.n;i++){const b=a+(i-(X.n-1)/2)*X.spread;projs.push({kind:'arrow',x:u.x,y:u.y-6,z:16,vx:Math.cos(b)*sp,vy:Math.sin(b)*sp,tz:heightOf()+15,life:1.3,dmg:X.dmg,z0:16,xb:1});}
  X.bolts+=X.n;u.xbAim=.35;if(rnd()<.4)float(u.x,u.y-84,['King William: "You shan\'t escape across the river!"','Royal crossbow - three bolts!','King William: "Hold the bank, men!"'][RI(0,2)],'#ffe08a');}
{const _s=kaStep;kaStep=function(u,dt){const b=kb157Need(u);if(!b){if(u)u.kb157=0;return _s.apply(this,arguments);}
  // hold the bank toward the dragon and shoot; drop any detour/bridge leg he had picked
  u.detour=0;u.leg=null;u.rp=null;u.retreat=false;u.post=null;u.atk-=dt;u.swing=Math.max(0,(u.swing||0)-dt);u.bashFx=Math.max(0,(u.bashFx||0)-dt);
  if(!u.kb157){u.kb157=1;KB157.holds++;float(u.x,u.y-90,'King William: "The bridge is out! Hold the bank - crossbows!"','#ffe08a');}
  const sp=u.kaHorse&&typeof HMK!=='undefined'?HMK.horseSp:KA_CFG.chargeSp;if(d2(u.x,u.y,b.x,b.y)>16*16)moveTo(u,b.x,b.y,sp,dt);else u.anim=(u.anim||0)+dt*2;
  u.face=D.x>u.x?1:-1;KB157.holdT+=dt;KB157.last={x:b.x,y:b.y};
  const hmOwn=typeof HM!=='undefined'&&HM.on&&HM.on();
  if(!hmOwn){if(u.kbT===undefined)u.kbT=R(.6,1.2);u.kbT-=dt;if(u.xbAim>0)u.xbAim-=dt;const dd=Math.hypot(D.x-u.x,D.y-u.y);
    if(u.kbT<=0&&dd<KB157.range&&dd>60&&!G.over){u.kbT=R(KB157.cd[0],KB157.cd[1]);kb157Fire(u);}}};}
// show his crossbow while he holds the bank in normal mode too (hard mode already draws it)
{const _dk=drawKnight;drawKnight=function(u){const r=_dk.apply(this,arguments);if(!(u&&u.isKingArmor&&u.kb157)||!(u.xbShow>0)||(typeof HM!=='undefined'&&HM.on&&HM.on()))return r;
  const f=u.face||1,k=1.35,x=u.x+f*9*k,y=u.y-22*k-8,aim=u.xbAim>0;
  line(x-f*7*k,y+2,x+f*9*k,y-(aim?2:0),'#6a4020',3*k);line(x+f*7*k,y-7*k,x+f*7*k,y+6*k,'#3a2a1a',2*k);line(x+f*7*k,y-7*k,x+f*1*k,y,'#ddd',1);line(x+f*7*k,y+6*k,x+f*1*k,y,'#ddd',1);
  if(aim)ell(x+f*10*k,y-1,2,2,'#ffe08a');return r;};}
// ======================= queue 158: tax collectors NEVER go on water (river, sea, Mirror Lake) =======================
// They already used bridges for the Silver River; the sea and the lake were not walls to them (only soldiers had that), and a bolt/flee step
// could still end in the water. Now the sea and lake are walls for collectors too (they slide along the shore), and a final check after every
// update puts a collector back on his last dry spot if anything moved him onto water. A burned bridge -> riverRoute already repaths via
// another bridge (or round the lake), and a collector whose route stop is unreachable skips it rather than wading.
const TX158={reverts:0,skips:0};
function tx158Wet(x,y){return (riverD(x,y)<RIVW-6&&!onBridge(x,y))||inSea(x,y)||inLake(x,y);}
{const _b=uBlocked;uBlocked=function(u){const b=_b.apply(this,arguments);if(!(u&&u.tax))return b;return (x,y)=>b(x,y)||inSea(x,y)||inLake(x,y);};}
function tx158Pass(){for(const u of units){if(!u.tax||u.dead)continue;
    if(tx158Wet(u.x,u.y)){if(u.txDry){u.x=u.txDry.x;u.y=u.txDry.y;}else{for(let r=20;r<600;r+=20){let ok=false;for(let a=0;a<6.28&&!ok;a+=.4){const x=u.x+Math.cos(a)*r,y=u.y+Math.sin(a)*r;if(!tx158Wet(x,y)){u.x=x;u.y=y;ok=true;}}if(ok)break;}}
      TX158.reverts++;u.txWetN=(u.txWetN||0)+1;
      // stuck against water for a long time on the way to a stop: skip that stop (head for the next one / home)
      if(u.txWetN>240&&u.route&&u.ri<u.route.length){u.ri++;u.txWetN=0;TX158.skips++;}}
    else{u.txDry={x:u.x,y:u.y};if(u.txWetN>0)u.txWetN-=.25;}}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{if(scene==='play'&&G)tx158Pass();}catch(e){TX158.err=String(e);}return r;};}
// ===== fix found by t155 (iPhone run): a smoke/dust particle living past 1.6x its max life gave ctx.arc a NEGATIVE radius and threw inside drawWorld
// (the rest of that frame's world drawing was skipped). Clamp such particles before drawing.
{const _dw=drawWorld;drawWorld=function(){try{for(const p of parts)if((p.kind==='smoke'||p.kind==='dust')&&p.max>0&&p.life>p.max*1.55)p.life=p.max*1.55;}catch(e){}return _dw.apply(this,arguments);};}
// ===== QUEUE 159: NO castle STOREHOUSE. Castle Aldric's storehouse was the only one in the game (partSC; no other castle had one).
// Supply carts (camp/mine, partSC + partES east yards) and the king's trade carts now drive through the castle GATE and unload INTO THE CASTLE.
// The wood/stone stockpile (G.wood/G.stone) is unchanged; it is simply kept in the castle. No storehouse building, no map marker.
const SH159={door:{x:GATE.x+30,y:GATE.y-55}};
STORE_DOOR.x=SH159.door.x;STORE_DOOR.y=SH159.door.y;STORE_POS.x=GATE.x;STORE_POS.y=GATE.y-90;
storeS=function(){return null;};
storeUp=function(){return true;};   // the castle is always open for deliveries
function sh159Strip(){if(typeof structures==='undefined')return 0;let n=0;for(let i=structures.length-1;i>=0;i--)if(structures[i]&&structures[i].kind==='storehouse'){structures.splice(i,1);n++;}return n;}
{const _n=newGame;newGame=function(){const r=_n.apply(this,arguments);sh159Strip();return r;};}
{const _a=svApply;svApply=function(){const r=_a.apply(this,arguments);sh159Strip();
  for(const c of carts)if(c.supply&&!c.wrecked&&c.st==='wait')c.st='go';return r;};}
{const _s=scStep;scStep=function(c,dt){if(c&&c.st==='wait'&&!c.wrecked){c.st='go';c.s=c.R?c.R.len:0;}return _s.apply(this,arguments);};}
{const _d=scDeliver;scDeliver=function(c){if(!c||c.trader||c.tb160)return _d.apply(this,arguments);const f0=float;
  float=function(x,y,t,col){return f0.call(this,x,y,String(t).replace('delivered to the storehouse','delivered to the castle'),col);};try{return _d.apply(this,arguments);}finally{float=f0;}};}
// ===== QUEUE 160/160a/160b: when the castle's WOOD or STONE drops below 5 (or a rebuild is blocked by stock), King William spends 25% of the
// castle gold. The gold leaves the castle on a GUARDED CART (deducted the moment it rolls out), goes to the King's Quay, is loaded onto a
// TREASURE SHIP that sails off the south edge of the map, and later the bought goods come back by trade ship -> guarded cart -> castle (141z flow).
// Smash the gold cart or sink the treasure ship and the gold is yours (it goes to your lair like a caught tax sack). Then no goods come.
// Rate: KB.rate (2 gold per wood, 4 gold per stone). 160f: no cooldown - one open order per resource (wood and stone separately) until it is delivered or destroyed.
const TB160={low:5,share:.25,minBudget:8,cool:0,away:18,chk:2,grace:.5,tick:.5};
// 160d: wood and stone are bought INDEPENDENTLY: each resource has its own open order (gold cart -> treasure ship -> goods back) and its own cooldown.
// 160f: no cooldown. One order per resource is in flight until it is RESOLVED: delivered into the castle, or the dragon destroys the gold cart,
// treasure ship, goods ship or goods cart. (A 600 s failsafe only frees a order that somehow vanished.)
function tb160Open(){const o=G.tbOpen||(G.tbOpen={wood:0,stone:0}),idle=G.tbIdle||(G.tbIdle={wood:0,stone:0});for(const k of ['wood','stone']){if(!o[k]){idle[k]=0;continue;}
  if(tb160Fly(k)){idle[k]=0;}else{if(!idle[k])idle[k]=G.t;if(G.t-idle[k]>=TB160.grace){o[k]=0;idle[k]=0;G.tbResolved=(G.tbResolved||0)+1;}}if(o[k]&&G.t>o[k]+600){o[k]=0;G.tbFailsafe=(G.tbFailsafe||0)+1;}}return o;}
function tb160Fly(k){const f=g=>g&&(k==='wood'?g.w>0:g.st>0);return carts.some(c=>c.tb160&&!c.wrecked&&!c.gone&&f(c.tb160))||ships.some(s=>s.treasure>0&&!s.gone&&s.state!=='sink'&&f(s.tbGoods))||f(G.tbGoods)||(G.tbGoodsQ||[]).some(f)
  ||ships.some(s=>s.kind==='trade'&&!s.gone&&s.state!=='sink'&&(k==='wood'?s.w>0:s.st>0))||carts.some(c=>c.trader&&c.kind===k&&!c.wrecked&&!c.gone&&c.load>0);}
function tb160Busy(res){const o=tb160Open();if(res)return !!o[res];return !!(o.wood||o.stone);}
function tb160Close(g){if(!g||!G.tbOpen)return;if(g.w>0)G.tbOpen.wood=0;if(g.st>0)G.tbOpen.stone=0;}
function tb160Plan(have,res){const nd=kbNeed();const low=res==='wood'?(G.wood<TB160.low||(nd&&nd.w>0)):(G.stone<TB160.low||(nd&&nd.st>0));if(!low)return null;
  const budget=Math.floor(have*TB160.share);if(budget<TB160.minBudget)return null;const w=res==='wood'?Math.floor(budget/KB.rate.wood):0,st=res==='stone'?Math.floor(budget/KB.rate.stone):0;
  if(w+st<=0)return null;return{w,st,budget,res,why:(res==='wood'?G.wood:G.stone)<TB160.low?'low':'rebuild'};}
// 160e: each order is 25% of the treasury as it stood BEFORE this cycle's orders (snapshot when the first order goes out), so a second order does not shrink
function tb160Try(force){if(!G||G.over||G.won)return false;const o=tb160Open(),cl=G.tbCool||(G.tbCool={wood:0,stone:0});let sent=false;
  if(!o.wood&&!o.stone)G.tbBase=null;
  for(const res of ['wood','stone']){if(!force&&o[res])continue;const now=castleTreasury(),base=G.tbBase!=null?Math.max(G.tbBase,now):now;const p=tb160Plan(base,res);if(!p)continue;
    if(p.budget>now){p.budget=Math.floor(now);p.w=res==='wood'?Math.floor(p.budget/KB.rate.wood):0;p.st=res==='stone'?Math.floor(p.budget/KB.rate.stone):0;if(p.budget<TB160.minBudget||p.w+p.st<=0)continue;}
    if(tb160Send(p)){if(G.tbBase==null)G.tbBase=now;o[res]=G.t;cl[res]=G.t+TB160.cool;sent=true;if(force)break;}}
  return sent;}
function tb160Send(p){const paid=kbSpendGold(p.budget);if(paid<=0)return false;const T=kbTier(paid),what=kbWhat(p.w,p.st);
  const c=scSpawn('trader',{st:'back',load:0});c.kind='gold';c.tb160={gold:paid,w:p.w,st:p.st,tier:T.n};c.tier=T.n;if(c.drv)c.drv.shirt='#8a2a2a';
  kbGuards(c,T.guards);if(T.archers)kbArchers(c,T.archers);
  G.kbCoolT=G.t+TB160.cool;G.kbSpent=(G.kbSpent||0)+paid;G.kbBuys=(G.kbBuys||0)+1;G.tbSent=(G.tbSent||0)+1;G.tbLast={gold:paid,w:p.w,st:p.st,why:p.why,t:G.t};
  float(GATE.x,GATE.y-80,`King William sends ${paid} gold to buy ${what}`,'#ffe08a');
  if(kbSay()){G.banner={text:`King William sends ${paid} gold to the King's Quay!`,sub:`25% of his treasury buys ${what}  ·  ${T.guards} guards escort the gold  ·  smash the cart or sink the treasure ship and the gold is yours!`,t:4.5};
    if(typeof showToast==='function')showToast(`💰 Royal gold cart: ${paid} gold heading for the quay`);}
  return true;}
kbBuy=function(){return tb160Try(false);};
// 160g: as soon as an order resolves and that resource is still below 5, the next order goes out (checked every 0.5 s, no extra wait)
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!G.over&&!paused){G.tbTick=(G.tbTick||0)-dt;if(G.tbTick<=0){G.tbTick=TB160.tick;tb160Try(false);}}return r;};}
// the gold cart: castle -> quay; at the quay the gold goes aboard the treasure ship
{const _s=scStep;scStep=function(c,dt){if(!c||!c.tb160||c.wrecked)return _s.apply(this,arguments);if(c.st==='load'||c.s>=(c.R?c.R.len:0)-1){tb160Board(c);return;}
  const r=_s.apply(this,arguments);if(c.tb160&&!c.wrecked&&c.st!=='back')tb160Board(c);return r;};}
function tb160Board(c){const o=c.tb160;if(!o||c.gone)return;const q=kbQuay();
  const s=kbSpawnShip(0,0,{x:q.anchor.x,y:q.anchor.y,state:'home',tier:o.tier,ang:Math.PI/2});s.treasure=o.gold;s.tbGoods={w:o.w,st:o.st,tier:o.tier};s.sp=KB.ship.sp*.8;
  G.tbBoarded=(G.tbBoarded||0)+1;float(q.land.x,q.land.y-50,`${o.gold} gold is loaded onto the treasure ship`,'#ffd84a');
  c.tb160=null;kbDismiss(c);c.wrecked=true;c.t=0;c.gone=true;for(const u of [c.drv,c.horse])if(u&&!u.dead){u.dead=true;u.gone=true;}}
function tb160Loot(n,x,y,how){n=Math.max(0,Math.floor(n||0));if(n<=0)return;D.gold=(D.gold||0)+n;G.tbLoot=(G.tbLoot||0)+n;G.tbLost=(G.tbLost||0)+1;kbLose(how);
  puff(x,y-10,10,'rgba(255,216,74,',100,6);sparkle(x,y,10);float(x,y-60,`The king's gold is yours! +${n} gold → lair`,'#ffd84a');addAlarm(6);}
{const _w=wreckCart;wreckCart=function(c){const o=c&&!c.wrecked&&c.tb160;const r=_w.apply(this,arguments);if(o){c.tb160=null;tb160Close(o);tb160Loot(o.gold,c.x,c.y,'goldcart');}return r;};}
{const _h=hurtShip;hurtShip=function(s,d,src){const tr=s&&s.treasure>0&&s.state!=='sink';const r=_h.apply(this,arguments);
  if(tr&&s.state==='sink'&&!s.gone){const n=s.treasure;s.treasure=0;tb160Close(s.tbGoods);s.tbGoods=null;tb160Loot(n,s.x,s.y,'treasureship');}return r;};}
{const _u=updTradeShip;updTradeShip=function(s,dt){const r=_u.apply(this,arguments);
  if(s.treasure>0&&s.gone&&!s.tbDone){s.tbDone=1;const g=s.tbGoods||{w:0,st:0,tier:1};{const ng={w:g.w,st:g.st,tier:g.tier,t:G.t+TB160.away};if(G.tbGoods)(G.tbGoodsQ||(G.tbGoodsQ=[])).push(ng);else G.tbGoods=ng;}G.tbAway=(G.tbAway||0)+1;s.treasure=0;}return r;};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(G&&!G.tbGoods&&G.tbGoodsQ&&G.tbGoodsQ.length){G.tbGoods=G.tbGoodsQ.shift();G.tbGoods.t=Math.max(G.tbGoods.t,G.t+4);}if(scene==='play'&&G&&!G.over&&!paused&&G.tbGoods&&G.t>=G.tbGoods.t){const g=G.tbGoods;G.tbGoods=null;
    kbSpawnShip(g.w,g.st,{tier:g.tier});G.kbShipsSent=(G.kbShipsSent||0)+1;G.tbReturned=(G.tbReturned||0)+1;
    if(kbSay()){G.banner={text:`A trade ship brings King William's ${kbGoods(g.w,g.st)}!`,sub:`${kbWhat(g.w,g.st)} bought with the king's gold  ·  sink it or smash the cart!`,t:4};
      if(typeof SFX!=='undefined')SFX.play('princeHorn');G.kbHorn=(G.kbHorn||0)+1;}else G.kbQuiet=(G.kbQuiet||0)+1;}return r;};}
// gold chest on the cart and on the treasure ship
{const _dc=drawSupplyCart;drawSupplyCart=function(c){_dc.apply(this,arguments);if(c.tb160&&!c.wrecked)ch161Icon(c.x,c.y-14,.8);};}
{const _d=drawShip;drawShip=function(s){_d.apply(this,arguments);if(s&&s.treasure>0&&!(s.state==='sink'&&s.t>2)){const b=Math.sin(s.bob*1.6)*1.5;ch161Icon(s.x-4,s.y-10+b,1);ch161Icon(s.x+14,s.y-6+b,.8);}};}
// ===== QUEUE 161/161a: the castle's gold piles are replaced by BREAKABLE TREASURE CHESTS.
// Replaced mechanic: 5 heaps of coins in the courtyard held the WHOLE treasury; the dragon bit up to 60 gold (80 easy) per bite from any heap.
// Now the heaps are only the treasury ledger (hidden, not grab-able). Chests = floor(treasury/1000), max 10; together they hold 20% of the
// treasury, split evenly. Bite, dive-slam or burn a chest: its gold leaves the treasury and goes to the dragon (carried to the lair).
const CH161={per:1000,max:10,share:.2,hp:40,respawn:25,bite:95,mouth:90,slam:150,
  slot:[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[1,1],[2,1],[3,1],[4,1]],list:[],broken:{}};
function ch161Pos(i){const gp=goldPiles||[];const a=gp[i%5]||{x:CASTLE.x,y:CASTLE.y};return i<5?{x:a.x,y:a.y}:{x:a.x+(i%2?38:-38),y:a.y+(i===9?-34:30)};}
function ch161Count(T){return Math.max(0,Math.min(CH161.max,Math.floor((T||0)/CH161.per)));}
function ch161Each(T,n){return n>0?Math.floor(CH161.share*T/n):0;}
function ch161Sync(){const T=castleTreasury(),n=ch161Count(T),each=ch161Each(T,n),L=CH161.list;const B=CH161.broken;
  for(let i=L.length-1;i>=0;i--)if(L[i].i>=n||L[i].dead)L.splice(i,1);
  for(let i=0;i<n;i++){if(L.some(c=>c.i===i))continue;if(B[i]&&G.t<B[i])continue;const p=ch161Pos(i);L.push({i,x:p.x,y:p.y,hp:CH161.hp,amt:0,shake:0});}
  for(const c of L)c.amt=each;return L;}
function ch161Break(c,how){if(!c||c.dead)return 0;c.dead=true;CH161.broken[c.i]=G.t+CH161.respawn;const n=kbSpendGold(c.amt);D.gold=(D.gold||0)+n;
  G.chBroken=(G.chBroken||0)+1;G.chGold=(G.chGold||0)+n;G.chLast={i:c.i,amt:n,how};
  puff(c.x,c.y-8,10,'rgba(150,110,60,',90,6);sparkle(c.x,c.y,12);float(c.x,c.y-34,`Chest smashed! +${n} gold → lair`,'#ffd84a');addAlarm(6);
  if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play('coin');}catch(e){}ch161Sync();return n;}
{const _n=newGame;newGame=function(){CH161.list=[];CH161.broken={};return _n.apply(this,arguments);};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!paused){ch161Sync();for(const c of CH161.list)c.shake=Math.max(0,c.shake-dt);}return r;};}
// heaps are hidden ledgers: the old bite-the-heap grab is off; bite a chest instead
{const _g=tryGrab;tryGrab=function(){const gp=goldPiles;goldPiles=[];let r;try{r=_g.apply(this,arguments);}finally{goldPiles=gp;}if(r)return r;
  if(D.alt>.6)return false;const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;
  for(const c of ch161Sync())if(!c.dead&&(d2(D.x,D.y,c.x,c.y)<CH161.bite||d2(mx,my,c.x,c.y)<CH161.mouth)){ch161Break(c,'bite');return true;}return false;};}
{const _a=applyFire;applyFire=function(ox,oy,dt){const r=_a.apply(this,arguments);for(const c of CH161.list)if(!c.dead&&inFire(c.x,c.y,ox,oy)){c.hp-=DR.fireDps*.5*dt;c.shake=.2;if(c.hp<=0)ch161Break(c,'fire');}return r;};}
{const _s=diveSlam;diveSlam=function(){const r=_s.apply(this,arguments);for(const c of [...CH161.list])if(!c.dead&&dist(c,D)<CH161.slam)ch161Break(c,'slam');return r;};}
function ch161Icon(x,y,k){k=k||1;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ell(0,9,15,5,'rgba(0,0,0,.3)');
  rect(-13,-4,26,13,'#7a4a1c');rect(-13,-4,26,2,'#5a3410');ctx.fillStyle='#8a5a26';ctx.beginPath();ctx.ellipse(0,-4,13,6,0,Math.PI,0);ctx.fill();
  rect(-13,-1,26,2,'#d8a830');rect(-2,-4,4,13,'#d8a830');rect(-2,1,4,4,'#ffe27a');ctx.restore();}
function ch161Draw(){for(const c of CH161.list){if(c.dead)continue;const sx=c.shake>0?R(-1.5,1.5):0;ch161Icon(c.x+sx,c.y,1.15);
  if(c.hp<CH161.hp){const f=Math.max(0,c.hp/CH161.hp);rect(c.x-12,c.y-22,24,3,'rgba(0,0,0,.5)');rect(c.x-12,c.y-22,24*f,3,'#ffb030');}}}
{const _d=drawCastle;drawCastle=function(){const gp=goldPiles;goldPiles=[];try{_d.apply(this,arguments);}finally{goldPiles=gp;}ch161Draw();};}
// (drawCastleHi is only called from drawCastle, so the wrapper above covers both graphics modes)
// map: chests instead of heaps (the castle label still shows the full treasury)
{const _m=drawMap;drawMap=function(){const gp=goldPiles,t0=treasury,T=castleTreasury();goldPiles=CH161.list.filter(c=>!c.dead).map(c=>({x:c.x,y:c.y,amt:1}));treasury=function(){return T;};
  try{return _m.apply(this,arguments);}finally{goldPiles=gp;treasury=t0;}};}
{const _h=drawHUD;drawHUD=function(){const gp=goldPiles;goldPiles=CH161.list.filter(c=>!c.dead).map(c=>({x:c.x,y:c.y,amt:1}));try{return _h.apply(this,arguments);}finally{goldPiles=gp;}};}

/* ===== QUEUE 156 / 156a-j: Viking crews fight on LAND, the crew IS the ship ===== */
const V156={shoreR:2400,landNear:450,regroup:12,wade:40,furlT:15,reach:750,gapMax:220,stuckD:25,stuckEvery:6,stuckFor:12};
function v156ShipOK(g,x,y){if(x<WX0+80||x>WX1-80||y<WY0+80||y>WY1-80)return false;return vkShipOK({vkg:g.id,kind:'vkwar',r:VK.r,x,y,vk:1},x,y)&&!vkNoGo(x,y)&&!vkFant(x,y);}
/* nearest water tile this group's ship may float on, searched outward from a LAND point = the shoreline tile */
function v156ShoreWater(g,x,y){for(let r=0;r<=V156.shoreR;r+=40)for(let k=0;k<(r?24:1);k++){const a=k/24*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(v156ShipOK(g,px,py))return{x:px,y:py};}return null;}
/* where the dragon can be fought on foot: the dragon on land, or land within reach of where it hovers */
function v156DryNearD(){if(vkFant(D.x,D.y))return null;if(!soldierWet(D.x,D.y))return{x:D.x,y:D.y};const p=dryNear(D.x,D.y);return p&&d2(p.x,p.y,D.x,D.y)<V156.landNear&&!vkFant(p.x,p.y)?p:null;}
/* longest stretch of real water (lake/sea, not a crossable river mouth) between two points, ignoring water at the far end */
function v156Gap(a,b){const d=d2(a.x,a.y,b.x,b.y),n=Math.max(1,Math.ceil(d/20));let run=0,mx=0;for(let i=1;i<n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(soldierWet(x,y)&&!(riverD(x,y)<RIVW-6&&!inSea(x,y)&&!inLake(x,y)))run+=d/n;else{if(run>mx)mx=run;run=0;}}return mx;}
function v156Live(g){return g.units.filter(u=>!u.dead&&!u.inLong);}
/* 156h: in combat only when the dragon is reachable on foot and they are not stuck */
function v156Reach(g,L){if(G.over||vkFant(D.x,D.y))return false;if(g.stuckT&&G.t<g.stuckT)return false;const c=vkCentroid(L||v156Live(g));if(!c)return false;
  const d=d2(c.x,c.y,D.x,D.y);if(d>V156.reach+(g.mode==='chase'?400:0))return false;if(!v156DryNearD())return false;if(v156Gap(c,D)>V156.gapMax)return false;return true;}
function v156StuckCheck(g,L,dt){const c=vkCentroid(L);if(!c)return;if(!g.ckP||G.t>(g.ckT||0)){if(g.ckP&&d2(c.x,c.y,D.x,D.y)>160&&d2(c.x,c.y,g.ckP.x,g.ckP.y)<V156.stuckD&&(g.mode==='chase'||g.mode==='rebuild')&&!(D.alt<DR.hitAltSword&&d2(c.x,c.y,D.x,D.y)<420)){g.stuckT=G.t+V156.stuckFor;G.vkStuckFree=(G.vkStuckFree||0)+1;}g.ckP=c;g.ckT=G.t+V156.stuckEvery;}}
function v156NearTree(c){let b=null,bd=1e9;for(const t of trees){if(t.state!=='ok'||t.fire||t.claimed||!(t.s>.8)||vkFant(t.x,t.y))continue;const d=d2(t.x,t.y,c.x,c.y);if(d<bd){bd=d;b=t;}}return b;}
/* lead the formation toward T, swimming slowly over water (156i/156j) */
function v156Lead(g,dt,T,L){const c=vkCentroid(L);if(!c)return;const A=g.A||(g.A={x:c.x,y:c.y});const dx=T.x-A.x,dy=T.y-A.y,d=Math.hypot(dx,dy)||1;const sp=soldierWet(A.x,A.y)?V156.wade*.9:55;
  if(d>20){A.x+=dx/d*Math.min(d,sp*dt);A.y+=dy/d*Math.min(d,sp*dt);}vkForm(g,dt,{x:A.x+dx/d*5,y:A.y+dy/d*5},true);}
/* 156e: the crew turns back into its ship at the shoreline (quick, no puff, nothing stored) */
function v156Unfurl(g,L){const W=g.fp&&g.fp.w;if(!W)return false;const s=vkMkShip(g,W.x,W.y);s.hp=Math.max(1,Math.min(g.furl.maxHp||s.maxHp,g.furl.hp||s.hp));s.maxHp=g.furl.maxHp||s.maxHp;g.ship=s;g.furl=null;
  for(const u of g.units)if(!u.dead&&!u.inLong){u.vkSwim=0;vkBoard(u,g);}g.units=g.units.filter(u=>!u.dead||u.inLong);g.mode='sail';g.fp=null;g.rgT=0;g.awayT=0;g.noLandT=G.t+20;s.path=vkPath(s.x,s.y,vkBerth(g.role,g.slot));
  G.vkUnfurls=(G.vkUnfurls||0)+1;if(d2(s.x,s.y,D.x,D.y)<1600)float(s.x,s.y-60,'The Vikings form up into their ship','#ffd0a0');return true;}
function v156Regroup(g,dt,L){const hit=G.vkHitT!=null&&G.t-G.vkHitT<3;if(g.role==='gar'&&hit&&!vkFant(D.x,D.y)){g.mode='defend';g.rgT=0;return;}if(v156Reach(g,L)&&G.level>=6){g.mode='chase';g.awayT=0;g.rgT=0;return;}
  g.rgT=(g.rgT||0)+dt;const c=vkCentroid(L);if(!c)return;
  if(!g.fp||G.t>(g.fpT||0)){g.fpT=G.t+4;let W=v156ShoreWater(g,c.x,c.y);g.fp=W?{w:W,land:dryNear(W.x,W.y)||{x:c.x,y:c.y}}:g.fp;}
  if(!g.fp){v156Lead(g,dt,{x:c.x,y:c.y},L);return;}
  const P=g.fp.land;if(soldierWet(c.x,c.y)||d2(c.x,c.y,P.x,P.y)>500)v156Lead(g,dt,P,L);else vkForm(g,dt,P,true);
  const near=L.filter(u=>d2(u.x,u.y,P.x,P.y)<110).length;
  if(near>=L.length||(g.rgT>V156.furlT&&near*2>=L.length)||g.rgT>V156.furlT*2.5)v156Unfurl(g,L);}

/* 156/156a: a crew hunting the dragon sails to the shore tile nearest it and lands; open sea -> sea fight, never lands */
{const _k=vkSeek;vkSeek=function(g,s,dt){if(!s||vkNoGo(D.x,D.y))return _k.apply(this,arguments);const L=v156DryNearD();
  if(!L){g.noLand=1;try{return _k.apply(this,arguments);}finally{g.noLand=0;}}
  if(!g.sW||G.t>(g.sT||0)){g.sT=G.t+1;g.sW=v156ShoreWater(g,L.x,L.y);}const W=g.sW;if(!W)return _k.apply(this,arguments);
  const lp=g.lp156||{x:s.x,y:s.y};if(d2(lp.x,lp.y,s.x,s.y)<4*dt*60)g.stk156=(g.stk156||0)+dt;else g.stk156=0;g.lp156={x:s.x,y:s.y};
  const dW=d2(s.x,s.y,W.x,W.y);
  if(dW<s.r+45||(g.stk156>1.5&&dW<700)){const p=dryNear(s.x,s.y);if(p&&vkLand(g,'chase',p))return;}
  if(s.path&&s.path.length){if(g.stk156>3){s.path=null;g.stk156=0;}return;}
  if(g.stk156>3){s.path=vkPath(s.x,s.y,W);g.stk156=0;return;}
  s.path=null;s.goal={x:W.x,y:W.y};s.goalSp=1;};}
/* 156c/e: landing turns the ship into its crew (no puff, ship not kept) */
{const _l=vkLand;vkLand=function(g,mode,at){if(g&&(g.noLand||(mode==='chase'&&g.noLandT&&G.t<g.noLandT)))return false;if(g&&g.garGate&&mode==='chase'&&g.role==='gar'&&g.ship&&(!v156DryNearD()||d2(g.ship.x,g.ship.y,D.x,D.y)>2600))return false;const s=g&&g.ship;const p0=puff;puff=function(){};let r;try{r=_l.apply(this,arguments);}finally{puff=p0;}
  if(r&&s&&!s.gone&&s.state!=='sink'){g.furl={hp:s.hp,maxHp:s.maxHp};s.gone=true;s.state='sink';s.t=99;s.vkFurled=1;s.goal=null;s.path=null;g.ship=null;g.awayT=0;g.rgT=0;G.vkFurls=(G.vkFurls||0)+1;}return r;};}
/* 156j: on foot they swim across water instead of calling longships */
vkMove=function(u,tx,ty,sp,dt,g){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy);const wet=soldierWet(u.x,u.y);u.vkWade=wet?1:0;if(d<4)return true;
  const s2=wet?Math.min(sp,V156.wade):sp,st=Math.min(d,s2*dt),nx=u.x+dx/d*st,ny=u.y+dy/d*st;if(vkFant(nx,ny)&&!vkFant(u.x,u.y))return false;
  u.face=dx>=0?1:-1;u.anim+=dt*(wet?3:6);u.x=nx;u.y=ny;if(wet&&rnd()<dt*2&&typeof ripples!=='undefined'&&Array.isArray(ripples))ripples.push({x:u.x,y:u.y,t:0,r:6});return false;};
{const _dv=drawViking;drawViking=function(u){if(u&&u.vkWade&&!u.vkSwim&&soldierWet(u.x,u.y)){u.vkSwim=1;try{return _dv.apply(this,arguments);}finally{u.vkSwim=0;}}return _dv.apply(this,arguments);};}
/* units of a regrouping crew follow their formation slots */
{const _u=vkUnit;vkUnit=function(u,dt){const g=u&&!u.vkSwim&&!u.vkJob?vkG(u.vkg):null;if(g&&g.mode==='furlret'){u.retreat=0;u.atk=Math.max(0,(u.atk||0)-dt);u.atk2=Math.max(0,(u.atk2||0)-dt);u.shootT=(u.shootT||0)-dt;
    if(u.slot)vkMove(u,u.slot.x,u.slot.y,u.vk==='chief'&&u.bearHp>0?120:95,dt,g);else u.anim=0;return;}return _u.apply(this,arguments);};}
/* 156i: no reachable trees -> swim slowly to the nearest land that has trees */
{const _r=vkRebuild;vkRebuild=function(g,dt){const L=v156Live(g);if(!L.length)return _r.apply(this,arguments);
  if(g.trip){const c=vkCentroid(L),T=g.trip;if(d2(c.x,c.y,T.x,T.y)<220&&!soldierWet(c.x,c.y)){g.trip=null;g.site=null;g.noTree=0;g.rt=0;return _r.apply(this,arguments);}v156Lead(g,dt,T,L);return;}
  if(g.site&&(g.logs||0)<VK.logs&&!L.some(u=>u.vkJob)&&!vkTree(g.site.shore||g.site)){const c=vkCentroid(L),t=v156NearTree(c);
    if(t&&d2(t.x,t.y,c.x,c.y)>200){g.trip={x:t.x,y:t.y};g.site=null;G.vkTrips=(G.vkTrips||0)+1;float(c.x,c.y-50,'No trees here! The Vikings swim for a wooded shore','#ffd0a0');return;}}
  return _r.apply(this,arguments);};}
/* group brain: furled crews regroup + transform; wrecked crews rebuild only when not in combat (156g/h) */
{const _g=vkGroupStep;vkGroupStep=function(g,dt){const m=g.mode;
  const furlMine=g.furl&&!g.ship&&(m==='return'||m==='sail'||m==='swim'||m==='rebuild'||m==='furlret'||m==='aboard');
  const rbMine=!g.furl&&!g.ship&&m==='rebuild';
  if(!furlMine&&!rbMine){g.garGate=g.role==='gar'&&m==='aboard'?1:0;let r;try{r=_g.apply(this,arguments);}finally{g.garGate=0;}if(g.furl&&!g.ship&&!g.gone&&g.mode==='chase'){const L=v156Live(g);v156StuckCheck(g,L,dt);
      if(!v156Reach(g,L))g.awayT=(g.awayT||0)+dt;else g.awayT=0;if(g.awayT>V156.regroup){g.mode='furlret';g.awayT=0;g.rgT=0;g.fp=null;G.vkRegroups=(G.vkRegroups||0)+1;}}
    else if(g.furl&&!g.ship&&!g.gone&&g.mode==='return'){g.mode='furlret';g.rgT=0;g.fp=null;}return r;}
  g.mode='__156';_g.apply(this,arguments);if(g.gone){return;}g.mode=m;const L=v156Live(g);if(!L.length)return;
  if(furlMine){g.mode='furlret';v156Regroup(g,dt,L);return;}
  v156StuckCheck(g,L,dt);if(v156Reach(g,L)){g.eng=true;g.rbFight=1;vkForm(g,dt,{x:D.x,y:D.y},false);return;}g.rbFight=0;vkRebuild(g,dt);};}

// 158b: tax collectors walk AROUND Mirror Lake instead of standing at its shore (the lake now blocks them since 158)
function tx158Cross(x0,y0,x1,y1){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/40);for(let i=1;i<n;i++){const f=i/n;if(inLake0(x0+(x1-x0)*f,y0+(y1-y0)*f))return true;}return false;}
function tx158Detour(u,tx,ty){if(!tx158Cross(u.x,u.y,tx,ty))return null;let best=null,bc=1e18;
  for(let k=0;k<16;k++){const a=k/16*TAU,cx=LAKE.x+Math.cos(a)*LAKE.rx*1.3,cy=LAKE.y+Math.sin(a)*LAKE.ry*1.45;if(tx158Wet(cx,cy)||tx158Cross(u.x,u.y,cx,cy))continue;
    const c=Math.hypot(cx-u.x,cy-u.y)+Math.hypot(tx-cx,ty-cy)+(tx158Cross(cx,cy,tx,ty)?400:0);if(c<bc){bc=c;best={x:cx,y:cy};}}return best;}
{const _m=moveTo;moveTo=function(u,tx,ty,sp,dt){if(u&&u.tax&&!u.dead&&Math.hypot(u.x-LAKE.x,u.y-LAKE.y)<LAKE.rx*2.2){const w=tx158Detour(u,tx,ty);if(w){_m.call(this,u,w.x,w.y,sp,dt);TX158.detours=(TX158.detours||0)+1;return false;}}return _m.apply(this,arguments);};}

// a toast with no text (null/undefined/empty) is ignored instead of showing a "null" box
{const _s=showToast;showToast=function(s){if(s==null||s==='')return;return _s.apply(this,arguments);};}
{const _d=drawToast;drawToast=function(){if(GPAD.toast==null||GPAD.toast===''){GPAD.toastT=0;return;}return _d.apply(this,arguments);};}

// 156b: a rebuilt ship is only ever launched on real water (the build site could fall back to the crew's spot on land)
function v156Water(x,y){return inSea(x,y)||inLake(x,y)||riverD(x,y)<RIVW-10;}
function v156WaterNear(x,y,R){for(let r=0;r<=R;r+=30)for(let k=0;k<(r?32:1);k++){const a=k/32*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(px<WX0+80||px>WX1-80||py<WY0+80||py>WY1-80)continue;if(v156Water(px,py)&&!vkFant(px,py)&&!onBridge(px,py))return{x:px,y:py};}return null;}
{const _l=vkLaunch;vkLaunch=function(g){const S=g.site;if(S&&!v156Water(S.x,S.y)){const w=v156WaterNear(S.x,S.y,2400);if(!w){g.site=null;G.vkLaunchHeld=(G.vkLaunchHeld||0)+1;return;}S.x=w.x;S.y=w.y;G.vkLaunchFix=(G.vkLaunchFix||0)+1;}return _l.apply(this,arguments);};}

// ---- 170 hotfix: HUD castle-gold counter showed the CHEST count (161 drawHUD swap) + short/exact gold formats ----
function amt170(n){n=Math.max(0,Math.floor(+n||0));if(n<1000)return String(n);
  const f=(v,s)=>{const t=v<10?(Math.floor(v*10)/10).toFixed(1).replace(/\.0$/,''):String(Math.floor(v));return t+s;};
  return n>=1e9?f(n/1e9,'b'):n>=1e6?f(n/1e6,'m'):f(n/1e3,'k');}
function exact170(n){n=Math.max(0,Math.floor(+n||0));return n.toLocaleString('en-US');}
uiAmt=amt170;
{const _h=drawHUD;drawHUD=function(){const t0=treasury,T=t0();treasury=function(){return T;};try{return _h.apply(this,arguments);}finally{treasury=t0;}};}
{const _p=drawPM;drawPM=function(){const u0=uiAmt;uiAmt=exact170;try{return _p.apply(this,arguments);}finally{uiAmt=u0;}};}
uiStock=function(x,y,fs){fs=fs||12;const s=fs/12;ctx.font=`bold ${fs}px Georgia`;const a=uiAmt(G.wood|0),b=uiAmt(G.stone|0),w1=ctx.measureText(a).width,w2=ctx.measureText(b).width;
  let cx=x+9*s;uiLog(cx,y,s);cx+=13*s;txt(a,cx,y+fs*.38,fs,'#f0d6a8','left');cx+=w1+12*s;
  uiRock(cx,y,s);cx+=12*s;txt(b,cx,y+fs*.38,fs,'#e4e8ee','left');cx+=w2;return cx-x;};
uiStockW=function(fs){fs=fs||12;const s=fs/12;ctx.font=`bold ${fs}px Georgia`;return 9*s+13*s+ctx.measureText(uiAmt(G.wood|0)).width+12*s+12*s+ctx.measureText(uiAmt(G.stone|0)).width;};
function pm170Line(){if(!(scene==='play'&&G&&PM.scr==='main'))return;const S=SAFE,touch=TOUCH.on,aw=VW-S.l-S.r,ah=VH-S.t-S.b,W=Math.min(aw-16,600),x0=S.l+(aw-W)/2,cx=x0+W/2;
  const rh=Math.max(30,Math.min(touch?46:38,Math.floor((ah-16-182)/PM_MAIN.length)-8)),H=86+PM_MAIN.length*(rh+8)+96,y0=S.t+Math.max(8,(ah-H)/2);
  const t=`Gold: ${exact170(G.stash||0)}   ·   Castle gold: ${exact170(treasury())}   ·   Wood: ${exact170(G.wood|0)}   ·   Stone: ${exact170(G.stone|0)}`;
  let fs=touch?12:13;ctx.font=`bold ${fs}px Georgia`;while(fs>8&&ctx.measureText(t).width>W-24){fs--;ctx.font=`bold ${fs}px Georgia`;}txt(t,cx,y0+H-88,fs,'#ffe08a','center');}
{const _p=drawPM;drawPM=function(){const r=_p.apply(this,arguments);try{ctx.setTransform(DPR,0,0,DPR,0,0);pm170Line();}catch(e){}return r;};}

// ===== QUEUE 139v/139w/139x: hard-mode crossbows only for NAMED knights; crossbow only in hand while shooting =====
// 139v replaced: 139d gave every mounted castle knight a crossbow. Now only the named raid champions (Sir Gareth the Bold etc.),
// King William (3-bolt spread) and the foreign princes carry one. Regular knights fight with their lance/sword only, as in normal mode.
hmXbow=function(u){return u.type==='knight'&&!u.dead&&!u.inside&&!u.vk&&(u.isKingArmor||u.isPrince||!!u.champ);};
// 139w/139x: u.xbShow > 0 = crossbow drawn (and the melee weapon put away). Set just before a shot (in range, bolt about ready) and
// for 0.7 s after it; otherwise the sprite shows the normal sword / lance only.
const XB139={pre:.45,after:.7};
{const _t=hmXbTick;hmXbTick=function(dt){const r=_t.apply(this,arguments);const X=HM.xb;
  for(const u of HM.xbList||[]){if(u.dead)continue;if(u.xbAim>.3)u.xbShow=Math.max(u.xbShow||0,XB139.after);
    const dd=Math.hypot(D.x-u.x,D.y-u.y);if(u.xbT!==undefined&&u.xbT<XB139.pre&&dd<=X.range&&dd>=X.min&&!u.inside&&!(u.dizzy>0))u.xbShow=Math.max(u.xbShow||0,.12);}return r;};}
{const _f=kb157Fire;kb157Fire=function(u){const r=_f.apply(this,arguments);if(u)u.xbShow=XB139.after;return r;};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!paused){for(const u of units){if(u.xbShow>0)u.xbShow-=dt;
    if(u.isKingArmor&&u.kb157&&!u.dead&&!(typeof HM!=='undefined'&&HM.on&&HM.on())&&u.kbT!==undefined&&u.kbT<XB139.pre){const dd=Math.hypot(D.x-u.x,D.y-u.y);if(dd<KB157.range&&dd>60)u.xbShow=Math.max(u.xbShow||0,.12);}}}return r;};}
// hide the melee weapon while the crossbow is up: skip just the sword / lance strokes of that one sprite
const XB139H={champ:{line:{'#eef':1,'#dde':1,'#c9a43a':1}},king:{line:{'#f4f6ff':1},lineW:{'#ffd23a':1.8},ell:{'#ffd23a':1.4}},prince:{line:{'#d8c090':1},poly:{'#eef':1}}};
function xb139Draw(u,fn){const k=u.isKingArmor?'king':u.isPrince?'prince':u.champ?'champ':null,F=k&&XB139H[k];if(!F)return fn();
  const L=line,P=poly,El=ell;let skipP=0;XB139.hid=(XB139.hid||0)+1;
  line=function(x1,y1,x2,y2,c,w){if(F.line&&F.line[c])return;if(F.lineW&&F.lineW[c]===w)return;return L.apply(this,arguments);};
  poly=function(pts,c){if(skipP>0){skipP--;return;}if(F.poly&&F.poly[c]){skipP=1;return;}return P.apply(this,arguments);}; // lance tip + its pennant
  ell=function(x,y,rx,ry,c){if(F.ell&&F.ell[c]===rx)return;return El.apply(this,arguments);};
  try{return fn();}finally{line=L;poly=P;ell=El;}}
{const _dk=drawKnight;drawKnight=function(u){if(u&&u.xbShow>0&&!u.dead&&(u.isKingArmor||u.isPrince||u.champ)){const a=arguments,t=this;return xb139Draw(u,()=>_dk.apply(t,a));}return _dk.apply(this,arguments);};}
// ======================= queue 141ac-141af: Viking hires on TREASURY milestones =======================
// Replaces the old "every 1000 gold he EARNS" counter (141m/139g). A hire happens each time King William's treasury BALANCE climbs up
// through a milestone (1000, 2000, 3000 ... or 500, 1000, 1500 ... in hard mode), also when it climbs back up after dropping below one.
// Falling through a milestone never hires, and staying above one doesn't hire again. Each hire costs 50 gold (25 hard) and starts a 120 s
// cooldown; a milestone crossed during the cooldown is simply ignored (not saved up for later).
const VK141={cool:120,crossings:0,hires:0,ignored:0,down:0,log:[]};
vkHireStep=function(){const ev=G.hard?VK.hEvery:VK.every,cost=G.hard?VK.hCost:VK.cost,tr=treasury(),m=Math.floor(tr/ev);
  if(G.vkMsEv!==ev||G.vkMs==null){G.vkMs=m;G.vkMsEv=ev;return;}
  if(m<G.vkMs){VK141.down++;G.vkMs=m;return;}if(m===G.vkMs)return;
  VK141.crossings++;G.vkMs=m;G.vkHired=G.vkHired||0;
  if(G.vkHireT!=null&&G.t-G.vkHireT<VK141.cool){VK141.ignored++;G.vkHireIgn=(G.vkHireIgn||0)+1;return;}
  if(tr<cost){G.vkOwed=1;return;}
  kbSpendGold(cost);G.vkSpent=(G.vkSpent||0)+cost;G.vkHired++;G.vkOwed=0;G.vkHireT=G.t;VK141.hires++;G.vkMs=Math.floor(treasury()/ev);
  VK141.log.push({t:+G.t.toFixed(1),ms:m*ev,tr:Math.round(tr)});if(VK141.log.length>20)VK141.log.shift();
  const g=vkSpawnFleet();const where=g&&g.role==='gar'?'to guard the castle lake':g&&g.role==='lake'?'to patrol the lake':'to patrol the coast';
  if(!vkQuiet()){G.banner={text:'⚔️ King William hired Viking mercenaries!',sub:`A Viking warship sails up from the south ${where} · his treasury passed ${m*ev} gold (${cost} gold)`,t:4.5};G.vkAlerts=(G.vkAlerts||0)+1;}else G.vkQuietHires=(G.vkQuietHires||0)+1;};

// ======================= queue 171: the lair gold pile grows ~2.5x slower =======================
// Every size step now needs 2.5x the gold: stages at 0 / 62 / 200 / 500 (were 0 / 25 / 80 / 200); the size curve is the same
// power-0.55 (about square-root) curve stretched 2.5x, so the pile reaches its old full size at 650 gold (was 260) and tops out ~1,120 (was ~450).
const HD171={mul:2.5};
HOARD_ST.forEach(s=>{s.at=Math.round(s.at*HD171.mul);});
hoardK=function(g){return clamp(Math.pow(Math.max(0,g)/(260*HD171.mul),.55),0,1.35);};

// ======================= queue 172: gamepad Select / "-" (button 8) toggles the big map, once per press =======================
// Before: button 8 was mapped to the R key in play (R does nothing mid-game; it restarts only on the game-over / win / pause screens,
// and those menu bindings are unchanged). LB (button 4) still also toggles the map.
{const _pp=pollPad;pollPad=function(dt){const pv=!!(GPAD.prev&&GPAD.prev[8]),hadR=!!pressed['r'];const r=_pp.apply(this,arguments);
  const menu=scene==='title'||(G&&(G.over||G.won))||paused;const now=!!(GPAD.prev&&GPAD.prev[8]);
  if(!menu&&now&&!pv){if(!hadR)delete pressed['r'];pressed['m']=true;GPAD.sel172=(GPAD.sel172||0)+1;}
  return r;};}

// ======================= queue 173 / 173a: every bite hurts; nothing is "too big" (or too small) to eat =======================
// 173: if a bite neither eats nor hurts the first thing in the dragon's jaws, it now takes BT173.dmg (18) damage anyway - never below 1 HP,
//      so the bite always wears the target down. (Blockers found: the whale's "too big" check in eatSea did no damage; an awake giant
//      squid took none; the bear / elephant / champion / sandworm "tough" checks only hurt the DRAGON, not the target; in hard mode the
//      queue-145 50-damage bite is off.)
// 173a: health is the only gate. A target the old rules refused to swallow is eaten once its health is low enough
//      (at/below 35% of max, or 50 HP for big ones). King William, Princess Elizabeth and the guardian dragons are never eaten.
const BT173={dmg:18,low:.35,lowAbs:50,hits:0,eats:0,last:null};
function bt173Never(u){return !u||u.isKing||u.king||u.isKingArmor||u.princess||u.isPrincess||u.gd||u.guardian;}
function bt173Low(u){return u.hp<=Math.max(u.maxHp*BT173.low,Math.min(BT173.lowAbs,u.maxHp*.5));}
function bt173Gone(u){return !!(u.dead||u.eaten||(u.type==='sea'?false:units.indexOf(u)<0));}
{const _te=tryEat;tryEat=function(){
  if(!G||G.over||G.won||scene!=='play'||D.eatCD>0||D.princess||D.carry)return _te.apply(this,arguments);
  if(typeof PR!=='undefined'&&PR.state==='tower'&&d2(D.x,D.y,PR.x,PR.y)<160)return _te.apply(this,arguments);
  let T=[];try{T=biteTargets();}catch(e){}const f=T[0];if(!f||bt173Never(f))return _te.apply(this,arguments);
  const h0=f.hp,g0=D.gold,n0=f.type==='sea'&&f.kind==='school'?f.n:0,dg0=typeof DG!=='undefined'?DG.n:0;const r=_te.apply(this,arguments);
  if((typeof DG!=='undefined'&&DG.n!==dg0)||f.dgInv>0||D.gold!==g0||D.princess||D.carry||bt173Gone(f)||f.hp<h0-.01||(f.kind==='school'&&f.n!==n0))return r;
  if(f.kind==='school'){return r;}
  if(bt173Low(f)){BT173.eats++;BT173.last={sp:f.species||f.kind||f.type,eat:1,hp:Math.round(f.hp)};
    if(f.type==='sea'){if(f.kind==='squid')f.state='dazed';const hp=f.hp;if(f.kind==='whale')f.hp=Math.min(f.hp,f.maxHp*.5);eatSea(f);if(!f.dead)f.hp=hp;}
    else eatUnit(f);
    if(!bt173Gone(f)){f.dead=true;f.eaten=true;}D.eatCD=D.alt<.3?.45:.9;D.eatT=.3;return r;}
  const dm=Math.min(BT173.dmg,Math.max(0,Math.ceil(f.hp)-1));
  if(dm>0){const hp=f.hp;if(f.type==='sea')hurtSea(f,dm,'bite');else hurtUnit(f,dm,'bite');if(!(f.hp<hp-.01)&&!f.dead)f.hp=Math.max(1,hp-dm);}
  BT173.hits++;BT173.last={sp:f.species||f.kind||f.type,dealt:Math.round(h0-f.hp),hp:Math.round(f.hp)};
  if(dist(f,D)<1200)float(f.x,f.y-62,bt173Low(f)?'Worn down - bite again to eat!':`Bite! -${Math.round(h0-f.hp)} - keep wearing it down`,'#ffd27a');
  D.eatCD=Math.max(D.eatCD||0,D.alt<.3?.45:.9);D.eatT=.3;return r;};}

// ======================= queue 141ag: Viking hire cooldown per difficulty (overrides 141af's flat 120 s) =======================
// easy 240 s (4 min) · normal 180 s (3 min) · hard 120 s (2 min). A milestone crossed during the cooldown is still ignored.
const VK141AG={easy:240,normal:180,hard:120};
try{Object.defineProperty(VK141,'cool',{get(){return G&&G.hard?VK141AG.hard:(G&&G.easy)||(!G&&EASY)?VK141AG.easy:VK141AG.normal;},set(v){},configurable:true});}catch(e){}

// ======================= queue 176: pack / herd alphas start tougher =======================
// Starting health of every pack or herd alpha: +25% on normal, +50% on hard (easy unchanged). Covers pride lions, wolf-pack leaders,
// gorilla silverbacks, the elephant herd leader, the tiger alpha, the alpha hippo and the north-realm alphas. Health is the only stat
// scaled (alphas have no separate defence stat). The hard-mode per-level growth (x1.075 per level, queue HM) still multiplies on top.
const AL176={normal:1.25,hard:1.5,n:0};
function al176Is(u){if(!u||u.dead||u.type!=='animal')return false;if(u.alpha||u.atAlpha||u.tgA)return true;if(u.hippo&&u.alpha)return true;
  return typeof tfIsLeader==='function'&&!!u.pack&&tfIsLeader(u);}
function al176Scan(){if(!G||G.easy)return;const m=G.hard?AL176.hard:AL176.normal;const L=units.slice();if(typeof NRU!=='undefined')for(const u of NRU)if(L.indexOf(u)<0)L.push(u);
  for(const u of L){if(u.al176||!al176Is(u))continue;u.al176=m;u.maxHp=Math.round((u.maxHp||u.hp)*m);u.hp=Math.round(u.hp*m);AL176.n++;}}
{const _u=update;let acc=0;update=function(dt){const r=_u.apply(this,arguments);if(G&&scene==='play'&&!G.over){acc+=dt;if(acc>=.25){acc=0;try{al176Scan();}catch(e){}}}return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{al176Scan();}catch(e){}return r;};}
{const _sl=svLoad;svLoad=function(){const r=_sl.apply(this,arguments);try{al176Scan();}catch(e){}return r;};}
// the tiger alpha rebuilds its health on a new level or after loading a save; clear the mark so it gets the boost again
if(typeof tgMake==='function'){const _tm=tgMake;tgMake=function(u){const r=_tm.apply(this,arguments);if(u)u.al176=0;return r;};}

// ======================= queue 177: the sand worm hits harder =======================
// Base worm damage: surfacing ambush 8 -> 12 normal / 14 hard; chomp bite 5 -> 7.5 normal / 8.75 hard (easy unchanged 8 / 5).
// Any existing scaling (hard-mode G.dmgMul, boss-level scaling) still multiplies on top inside hurtDragon.
const SW177={normal:1.5,hard:1.75,hits:0};
{const _hd=hurtDragon;hurtDragon=function(d,src){if(src==='sandworm'&&G&&!G.easy){d*=G.hard?SW177.hard:SW177.normal;SW177.hits++;}return _hd.call(this,d,src);};}

// ======================= queue 182: HARD mode - King William's GOLDEN SHIELD block =======================
// Hard only (normal/easy unchanged). The armoured King (on foot) carries a big golden shield. Sometimes he raises it:
// when your fire washes toward him (~1.2/s chance while you breathe at him within 330 px), when you are close on the
// ground (~0.35/s within 150 px), or 50% of the time right after you hurt him. Block lasts 1.8 s, then 3-5 s before
// he can block again. While blocking he cannot attack (no sword, no shield bash) and takes HALF damage (not immune).
// He is still never eaten (the CLANG rule is untouched).
const KB182={dur:1.8,cd:[3,5],fireCh:1.2,fireR:330,nearCh:.35,nearR:150,hitCh:.5,dmg:.5,n:0,halved:0,sayT:-9};
function kb182On(u){return !!(u&&u===KA.u&&!u.dead&&HM.on()&&!u.kaHorse&&!u.dizzy&&(kaOut()||KA.phase==='charge'));}
function kb182Start(u){u.kb182=KB182.dur;KB182.n++;G.kb182=(G.kb182||0)+1;u.atk=Math.max(u.atk||0,.4);if(G.t-KB182.sayT>4){KB182.sayT=G.t;float(u.x,u.y-90,'The King raises his golden shield!','#ffe08a');}}
{const _s=kaStep;kaStep=function(u,dt){if(!(u&&u===KA.u&&HM.on())){if(u)u.kb182=0;return _s.apply(this,arguments);}
  if(u.kb182>0){u.kb182-=dt;if(u.kb182<=0){u.kb182=0;u.kb182Cd=R(KB182.cd[0],KB182.cd[1]);}}else if(u.kb182Cd>0)u.kb182Cd-=dt;
  if(!kb182On(u))u.kb182=0;
  else if(!(u.kb182>0)&&!(u.kb182Cd>0)){const dd=Math.hypot(u.x-D.x,u.y-D.y),a=Math.atan2(u.y-D.y,u.x-D.x),fac=Math.cos(a-D.ang);
    if(D.breath&&dd<KB182.fireR&&fac>.6&&rnd()<KB182.fireCh*dt)kb182Start(u);else if(dd<KB182.nearR&&D.alt<.6&&rnd()<KB182.nearCh*dt)kb182Start(u);}
  if(!(u.kb182>0))return _s.apply(this,arguments);
  u.atk=Math.max(u.atk||0,dt+.02);u.bashT=Math.max(u.bashT||0,dt+.02);const r=_s.apply(this,arguments);u.swing=0;u.bashFx=0;u.face=D.x>u.x?1:-1;return r;};Object.assign(kaStep,_s);}
{const _h=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.isKingArmor&&u===KA.u&&d>0&&HM.on()&&!u.dead){
    if(u.kb182>0){KB182.halved++;if(G.t-(u.kb182Say||-9)>.8){u.kb182Say=G.t;float(u.x+R(-10,10),u.y-80,'BLOCKED! (half damage)','#ffe08a');}
      const h0=u.hp,r=_h.call(this,u,d,src);if(!u.dead&&u.hp<h0)u.hp+=(h0-u.hp)*(1-KB182.dmg);return r;}
    else if(!(u.kb182Cd>0)&&kb182On(u)&&rnd()<KB182.hitCh){const r=_h.call(this,u,d,src);kb182Start(u);return r;}
    return _h.call(this,u,d,src);}
  return _h.apply(this,arguments);};Object.assign(hurtUnit,_h);}
function kb182Shield(x,y,sc,raised,t){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
  const g=ctx.createLinearGradient(0,-12,0,12);g.addColorStop(0,'#fff6b0');g.addColorStop(.45,'#f2c232');g.addColorStop(1,'#9a6a10');
  ctx.fillStyle=g;ctx.strokeStyle='#7a5208';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-8,-11);ctx.lineTo(8,-11);ctx.lineTo(8,1);ctx.quadraticCurveTo(7,8,0,13);ctx.quadraticCurveTo(-7,8,-8,1);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#fff2a8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-5.5,-8.5);ctx.lineTo(5.5,-8.5);ctx.lineTo(5.5,0.5);ctx.quadraticCurveTo(4.8,6,0,9.8);ctx.quadraticCurveTo(-4.8,6,-5.5,.5);ctx.closePath();ctx.stroke();
  poly([-3,-1,-3,-4.5,-1.5,-2.8,0,-5,1.5,-2.8,3,-4.5,3,-1],'#c88a10');ell(0,2.5,1.6,1.6,'#e8342a');
  if(raised){const p=(t*1.7)%1.6;if(p<1){const gx=-8+p*16,gy=-11+p*20;ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx-3,gy-3);ctx.lineTo(gx+3,gy+3);ctx.stroke();}
    line(9,-14,13,-18,'#fff',1.2);line(11,-18,11,-14,'#fff',1);line(9,-16,13,-16,'#fff',1);}
  ctx.restore();}
{const _d=drawArmoredKing;drawArmoredKing=function(u){const r=_d.apply(this,arguments);if(!(u&&HM.on()&&u===KA.u&&!u.dizzy&&!u.kaHorse))return r;
  const f=u.face||1,s=1.45,t=G.t||0;
  if(u.kb182>0){ctx.save();ctx.globalAlpha=.35+.15*Math.sin(t*8);ell(u.x+f*12*s,u.y-21*s,17*s,19*s,'#fff2a0');ctx.restore();kb182Shield(u.x+f*12*s,u.y-21*s,s*1.45,true,t);
    txt('🛡 BLOCKING',u.x,u.y-76,9,'#ffe08a','center');}
  else kb182Shield(u.x-f*10*s,u.y-14*s,s*.95,false,t);
  return r;};Object.assign(drawArmoredKing,_d);}

// ======================= queue 183 / 183a: RESTART is now MAIN MENU (game over, win screen, pause menu) =======================
// Game over: Enter / Space / R / tap / A / Start / Back now go to the title MAIN MENU (instead of instantly restarting). The Mode row (the
// EASY / NORMAL / HARD difficulty picker) is highlighted with the current difficulty, Start game begins a new game, Continue loads the
// autosave (queue 184). Pause menu: the "Restart (new game)" button is now "Main Menu" and asks "Are you sure?" first (mid-run); R / Back
// on the pause screen opens the same question. Win screen: R / Back starts the next level, autosaves it and goes to the main menu.
const MM183={n:0,last:null,conf:0,auto:3.5}; // death: the game-over screen shows for 3.5 s (score), then goes straight to the main menu (any key sooner)
function mm183Go(why){try{pmClose();}catch(e){}paused=false;if(typeof TOUCH!=='undefined')TOUCH.rotPaused=false;
  scene='title';newGame();D.x=-9999;titleSel=1;pressed={};MM183.n++;MM183.last=why||'?';}
function mm183Ask(){const safe=as184Safe(),q='Leave this run and go to the MAIN MENU?';
  PM.on=true;PM.from='pause';PM.scr='main';MM183.conf++;
  PM.confirm={q,sub:safe?'Your run is autosaved first, so Continue on the main menu picks it up again.':'(Not autosaved now: you are in a fight or badly hurt. Continue loads your last autosave.)',sel:1,
    yes:()=>{if(as184Safe())as184Save('menu');mm183Go('menu');}};}
{const i=PM_MAIN.findIndex(r=>r[1]==='restart');if(i>=0)PM_MAIN[i]=['🏠  Main Menu (new game · difficulty · continue)','mainmenu'];}
{const _a=pmAct;pmAct=function(a){if(a==='mainmenu'){mm183Ask();return;}if(a==='restart'){mm183Ask();return;}return _a.apply(this,arguments);};}
// 183b: the gamepad is read inside frameBody (pollPad), after the check below, so pad Back / A / Start on the game-over, win and pause
// screens used to reach the old restart code (instant new game). The same check now also runs right after pollPad.
function mm183Chk(){if(scene==='play'&&G){
      if(G.over&&!PM.on&&G.overT>MM183.auto){mm183Go('death');}
      else if(G.over&&!PM.on&&(P('r')||P(' ')||(P('enter')&&G.overT>1))){if(G.overT>1||P('r'))mm183Go('death');else{delete pressed['enter'];delete pressed[' '];}}
      else if(G.won&&!PM.on&&P('r')){nextLevel();paused=false;as184Save('level');mm183Go('won');}
      else if(paused&&!G.over&&!G.won&&P('r')){delete pressed['r'];if(!(PM.on&&PM.confirm))mm183Ask();}}
    else if(scene==='title'&&!PM.on&&titleSel===3&&as184Valid()){
      if(P('enter')){delete pressed['enter'];as184Continue();}
      else if(P('arrowleft')||P('arrowright')||P('a')||P('d')){pressed={};pmOpen('load','title');}}}
{const _f=frameBody;frameBody=function(ts){try{mm183Chk();}catch(e){console.warn('183',e);}return _f.apply(this,arguments);};}
{const _pp=pollPad;pollPad=function(dt){const r=_pp.apply(this,arguments);try{mm183Chk();}catch(e){console.warn('183b',e);}return r;};}
{const _tt=titleTap;titleTap=function(x,y){const g=TOUCH.tg;
  if(g&&as184Valid()){const lx=(x-g.ox)/g.k,ly=y/g.k,ry=g.y0+3*36;if(lx>g.cx-230&&lx<g.cx+230&&ly>ry-4&&ly<ry+34){titleSel=3;if(lx>g.cx+230-120)pmOpen('load','title');else as184Continue();return true;}}
  return _tt.apply(this,arguments);};}
const TX183={'Press R / Enter (or Back / Start / A) to rise again':'Enter / A / tap: MAIN MENU  (Continue your autosave · or New game)',
  'P / Esc / Start to resume · R / Back to restart':'P / Esc / Start to resume · R / Back: main menu',
  '↑/↓ + Enter (A) choose · P / Esc / Start resume · R / Back restart':'↑/↓ + Enter (A) choose · P / Esc / Start resume · R / Back main menu',
  'R / Back: start over at level 1':'R / Back: autosave the next level + MAIN MENU','Restart (game over)':'Main menu (game over / pause)'};
{const _t=txt;txt=function(s,x,y,size){if(typeof s==='string'){
    if(s==='Tap to continue'&&G&&G.over&&scene==='play')return;
    else{let r=TX183[s];if(r!==undefined){if(TOUCH.on&&s.indexOf('rise again')>0)r='Tap (or A): MAIN MENU  ·  Continue your autosave or start a New game';arguments[0]=r;if(s.indexOf('rise again')>0){ctx.font=`bold ${size}px Georgia`;let f=size;while(f>11&&(ctx.font=`bold ${f}px Georgia`,ctx.measureText(r).width>VW-24))f--;arguments[3]=f;}}}}
  return _t.apply(this,arguments);};}

// ======================= queue 184: AUTOSAVE is back (safe points only) + Continue on the main menu =======================
// Why it was removed (queue 112, Oct 29 5:30 PM, 94b506d): the queue item gives no reason. What the old autosave did that could go wrong:
// it saved on EVERY pause-menu open, including the automatic pause when the window / phone app lost focus, and on a blind 2-minute timer,
// so it could save in the middle of a fight or with the dragon nearly beaten (a Continue that drops you straight back into losing).
// Now: those two old triggers stay OFF (svAuto is still a no-op). New safe autosave into the same 'dr_save_auto' localStorage slot:
//   * level start (new game and each next level) as soon as it is safe (from 2 s in), * level complete (R on the win screen saves the next level),
//   * every 60 s of play, only while NOT in combat (no damage taken for 8 s, no hit on a fighter near the dragon for 6 s), health >= 30%,
//     not starving, not paused, never game over / won / dying (svWrite also refuses G.over / G.won), * leaving to the main menu when safe.
// What is saved is the full partSV snapshot: difficulty (easy / hard), castle level, wanted level, dragon stats (health, max health, fire,
// stamina, hunger, upgrades and boosts), gold stash + carried gold, castle gold / wood / stone, world state (burned trees, ruined buildings,
// structures, crops, fog / explored map, wizard / boss flags and rewards, tally). Like every load it starts the dragon at the lair spawn.
const AS184={every:60,calm:8,calmHit:6,minHp:.3,startAt:2,t:0,n:0,pend:null,last:null,why:{},skip:0,ms:0};
// 184a (Zack 2:47 PM): Continue always restarts the dragon at the lair, so the autosave now runs at ANY time: in fights, when hurt, under 30%
// health and when starving. It is only blocked for a dying dragon (health 0) or game over (and the win screen, which saves the next level).
// Before (184): no save while hit in the last 8 s, while hitting a fighter in the last 6 s, under 30% health or starving.
AS184.anytime=true;
function as184Safe(){if(scene!=='play'||!G||!D||G.over||G.won||G.starved)return false;if(!(D.hp>0))return false;if(AS184.anytime)return true;
  if(D.hp<AS184.minHp*D.maxHp)return false;
  if(G.t-(G.as184Hurt==null?-99:G.as184Hurt)<AS184.calm)return false;if(G.t-(G.as184Hit==null?-99:G.as184Hit)<AS184.calmHit)return false;return true;}
function as184Save(why){if(!as184Safe()&&why!=='level'){AS184.skip++;return false;}if(G.over||G.won||!(D.hp>0))return false;
  const t0=performance.now();const ok=svWrite('dr_save_auto');AS184.ms=Math.round((performance.now()-t0)*10)/10;
  if(ok){AS184.n++;AS184.t=0;AS184.last={why,t:Math.round(G.t),lvl:G.lvl,hp:Math.round(D.hp),hard:!!G.hard,easy:!!EASY};AS184.why[why]=(AS184.why[why]||0)+1;G.as184N=(G.as184N||0)+1;}
  return ok;}
function as184Info(){try{const L=svList(),a=L.find(s=>s.key==='dr_save_auto');return a&&a.info&&!a.info.old?a.info:null;}catch(e){return null;}}
function as184Valid(){return !!as184Info();}
function as184Continue(){const res=svLoad('dr_save_auto');if(res===true){try{pmClose();}catch(e){}paused=false;scene='play';pressed={};AS184.cont=(AS184.cont||0)+1;
    G.as184Hurt=-99;G.as184Hit=-99;AS184.t=0;AS184.pend=null;showToast('📂 Continued from your autosave');return true;}
  pmOpen('load','title');pmSay(res);return false;}
{const _h=hurtDragon;hurtDragon=function(d){if(G&&!G.over&&d>0)G.as184Hurt=G.t;return _h.apply(this,arguments);};Object.assign(hurtDragon,_h);}
{const _h=hurtUnit;hurtUnit=function(u){if(G&&u&&u.type!=='villager'&&u.type!=='animal'&&D&&Math.abs(u.x-D.x)<700&&Math.abs(u.y-D.y)<700)G.as184Hit=G.t;return _h.apply(this,arguments);};Object.assign(hurtUnit,_h);}
{const _n=newGame;newGame=function(){const r=_n.apply(this,arguments);AS184.t=0;AS184.pend='start';if(G){G.as184Hurt=-99;G.as184Hit=-99;G.as184T0=G.t;}return r;};Object.assign(newGame,_n);}
{const _n=nextLevel;nextLevel=function(){const r=_n.apply(this,arguments);AS184.t=0;AS184.pend='level';if(G)G.as184T0=G.t;return r;};Object.assign(nextLevel,_n);}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(scene==='play'&&G&&!G.over&&!G.won){AS184.t+=dt;
      if(AS184.pend&&G.t-(G.as184T0||0)>=AS184.startAt){if(as184Safe()&&as184Save(AS184.pend))AS184.pend=null;}
      else if(AS184.t>=AS184.every&&as184Safe())as184Save('timer');}}catch(e){console.warn('autosave',e);}
  return r;};}
// the autosave row shows as "Autosave" again (it was renamed "Old autosave" by queue 112) and the load help text tells the new rules
{const _sl=svList;svList=function(){const L=_sl.apply(this,arguments);if(!L||!L.length)return L;return L.map(s=>s.key==='dr_save_auto'&&s.name!=='Autosave'?Object.assign({},s,{name:'Autosave'}):s);};}
{const _d=drawSlots;drawSlots=function(){const _t=txt;txt=function(s){if(typeof s==='string'&&s.indexOf('The game only saves when you save it yourself')>=0){const a=[].slice.call(arguments);
      a[0]='Pick a save to load. The autosave updates at each level start, each level complete and every minute of play.';return _t.apply(this,a);}return _t.apply(this,arguments);};
  try{return _d.apply(this,arguments);}finally{txt=_t;}};}
// title: row 0 reads "New game", row 3 reads "Continue (autosave ...)" with a "📂 All saves" side button when an autosave exists
{const _dt=drawTitle;drawTitle=function(){_dt.apply(this,arguments);const T=TOUCH.tg;if(!T)return;
  try{ctx.setTransform(DPR*T.k,0,0,DPR*T.k,DPR*T.ox,0);const W0=VW;
    {const y=T.y0,s=titleSel===0;ctx.fillStyle='rgb(22,13,9)';ctx.fillRect(W0/2-231,y-1,462,32);panel(W0/2-230,y,460,30);if(s){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.strokeRect(W0/2-230,y,460,30);}
      txt(`▶  New game  (${EASY?'EASY':HARD?'HARD':'NORMAL'}: change it on the Mode row below)`,W0/2,y+21,16,s?'#ffd24a':'#ddd','center');}
    const i=as184Info();if(i){const y=T.y0+3*36,s=titleSel===3;ctx.fillStyle='rgb(22,13,9)';ctx.fillRect(W0/2-231,y-1,462,32);panel(W0/2-230,y,460,30);if(s){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.strokeRect(W0/2-230,y,346,30);}
      const md=i.hard?'Hard':i.easy?'Easy':'Normal';txt(`⟲  Continue  (autosave · castle lvl ${i.lvl} · ${md} · ${svDur(i.playT)})`,W0/2-57,y+21,14,s?'#ffd24a':'#9fe09f','center');
      ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(W0/2+118,y+3,108,24);txt('📂 All saves ▶',W0/2+172,y+20,13,'#ddd','center',false);}
  }catch(e){}finally{ctx.setTransform(DPR,0,0,DPR,0,0);}};}
// ======================= queue 185-185g: faster walk, out-of-combat SPRINT and FAST SWIM, crocodile tail =======================
// 185: ground walk 135 -> 182 px/s (+35%); flying (255) unchanged; stride animation 35% faster.
// 185a-c: on the ground, out of combat (no damage taken or dealt near the dragon for 4 s, not breathing fire / biting / stomping,
//   no soldier / knight / warrior within 220 px) and walking steadily (stick held, no turn sharper than ~60 deg) for 1.5 s, the walk
//   ramps over 1.2 s up to a SPRINT of 95% of the BASE flying speed (242 px/s). The cap is the un-boosted DR base 255, never cruise /
//   dash / boosts, and the final speed is clamped so it can never pass it. Any attack, hit, a hard turn or stopping drops it at once.
// 185d/e: not needed: base flying (255) stays above the sprint (242), and the out-of-combat flying cruise (up to 1.8x) is unchanged.
// 185f: swimming (74 px/s, unchanged) uses the same out-of-combat + steady 1.5 s rule to ramp to a FAST SWIM of 80% of base fly (204).
// 185g: while swimming the dragon sweeps its tail side to side (crocodile style, legs tucked), fast during the fast swim.
const MV185={walk:1.35,sprintFly:.95,swimFly:.8,steady:1.5,ramp:1.2,calm:4,turn:1.05,near:220,FLY0:DR.airSpeed};
function mv185Combat(){if(!D||!G)return true;if(D.breath||keys[' ']||GPAD.fire||D.eatT>0||D.stompT>0||(D.scratchT||0)>0)return true;
  if(G.t-(G.as184Hurt==null?-99:G.as184Hurt)<MV185.calm||G.t-(G.mv185Hit==null?-99:G.mv185Hit)<MV185.calm)return true;
  for(const u of units){if(u.dead||u.inside||u.type==='animal'||u.type==='villager'||u.type==='sea'||u.type==='bird')continue;
    if(Math.abs(u.x-D.x)<MV185.near&&Math.abs(u.y-D.y)<MV185.near&&dist(u,D)<MV185.near)return true;}return false;}
{const _h=hurtUnit;hurtUnit=function(u){if(G&&u&&D&&Math.abs(u.x-D.x)<450&&Math.abs(u.y-D.y)<450)G.mv185Hit=G.t;return _h.apply(this,arguments);};Object.assign(hurtUnit,_h);}
{const _uc=updCruise;updCruise=function(dt,ix,iy){const m=_uc.apply(this,arguments);try{
  const S=D.mv185||(D.mv185={t:0,k:0,a:null,ph:0,fast:0});
  const gw=D.mode!=='air'&&D.alt<.3;if(!gw){S.t=0;S.k=0;S.a=null;S.fast=0;return m;}
  const mag=Math.hypot(ix,iy);let stop=mag<.5||mv185Combat();
  if(!stop){const a=Math.atan2(iy,ix);if(S.a!=null&&Math.abs(angDiff(a,S.a))>MV185.turn){stop=true;S.a=a;}else S.a=S.a==null?a:S.a+angDiff(a,S.a)*Math.min(1,2.5*dt);}
  else if(mag<.5)S.a=null;
  if(stop){S.t=0;S.k=0;}else{S.t+=dt;if(S.t>MV185.steady)S.k=Math.min(1,S.k+dt/MV185.ramp);}
  const base=lerp(DR.groundSpeed,DR.airSpeed,D.alt)*(D.swim?.55:1);let f;
  if(D.swim){const top=MV185.FLY0*MV185.swimFly/base;f=1+(top-1)*S.k;}
  else{const w=clamp(1-D.alt/.3,0,1),wf=1+(MV185.walk-1)*w,top=Math.max(wf,MV185.FLY0*MV185.sprintFly/base);f=wf+(top-wf)*S.k*w;}
  f=Math.min(f,MV185.FLY0/base); // never faster than base (un-boosted) flying
  S.fast=S.k;G.mv185Peak=Math.max(G.mv185Peak||0,base*f);
  if(mag>0&&!D.swim)D.walkT+=dt*7*(f-1); // stride keeps pace with the speed
  if(D.swim)S.ph+=dt*(5+7*S.k);
  return m*f;}catch(e){return m;}};}
{const _dd=drawDragon;drawDragon=function(){if(!D||!D.swim)return _dd.apply(this,arguments);
  const S=D.mv185||{ph:G.t*5,k:0},A=12+12*(S.k||0),ph=S.ph||0,L0=line,P0=poly;
  const off=x=>x<-36?A*Math.sin(ph+(x+36)*.055)*Math.pow((-36-x)/90,1.2):0;
  line=function(x1,y1,x2,y2,c,w){if(x1<=-36&&x2<-36)return L0(x1,y1+off(x1),x2,y2+off(x2),c,w);return L0.apply(this,arguments);};
  poly=function(p,c,s){if(p&&p.length&&p[0]<-36){const q=p.slice();for(let i=0;i<q.length;i+=2)q[i+1]+=off(q[i]);return P0(q,c,s);}return P0.apply(this,arguments);};
  try{return _dd.apply(this,arguments);}finally{line=L0;poly=P0;}};}
// ======================= queue 187 / 188 / 188a / 188b: castle-level scaling only in HARD (except castles + resources) =======================
// 188b: on NORMAL and EASY only the castle itself (gate, barracks, walls, its tower archers and castle guards, the king's own
// Archer/Scorpion towers) and resources (castle gold piles, treasury, ransom, loot) grow with the castle level. Everything else plays
// as castle level 1 on normal/easy: mini bosses, wizards, magic towers, King William, princes, raid champions + escorts, guardians,
// patrols (count + size + health), work-site guards, alarm waves, caravan guards, realm armies, the white elephant, tigers,
// realm creature damage (partNR cbAttack, was +6%/level) and the dragon's own "every bite hurts" damage (btDmg, was +5%/level).
// HARD keeps every existing level rule, except 187/188a: regular mini bosses +15% health / +10% damage per level (linear; was 1.2^ / 1.1^),
// and both wizards (Storm + Dark) count as bosses at +25% health / +20% damage per level (linear; was 1.2^ / 1.1^).
const LV188={bossHp:.15,bossDm:.10,wizHp:.25,wizDm:.20,n:0,cb:0,cbFix:0};
// G.hard is only written at the end of newGame, so while a new game/level is being built (bosses, elephant, tigers spawn) it is still unset:
// fall back to the chosen mode then, the same way the end of newGame decides it.
function lv188H(){if(!G)return false;if(G.hard!==undefined&&G.hard!==null)return !!G.hard;return !!(HM.force!==null?HM.force:(HARD&&!EASY));}
function lv188Run(fn,self,args){if(!G||G.hard||!(G.lvl>1))return fn.apply(self,args);const l=G.lvl;G.lvl=1;LV188.n++;try{return fn.apply(self,args);}finally{G.lvl=l;}}
// bosses (kraken, octopus, sand worm, Nessie, Hydra, Griffin, Cerberus, wild dragons, magic towers) - every path goes through these two
bossHpMul=function(){return lv188H()?1+LV188.bossHp*(lvsL()-1):1;};
bossDmMul=function(){return lv188H()?1+LV188.bossDm*(lvsL()-1):1;};
function wz188Hp(){return lv188H()?1+LV188.wizHp*(lvsL()-1):1;}
function wz188Dm(){return lv188H()?1+LV188.wizDm*(lvsL()-1):1;}
WZ140.hpMul=wz188Hp;
// wizard spell damage: the 139f hook (inside) multiplies hard-mode wizard spells by 1.1^(L-1); swap that for +20%/level
{const _hd=hurtDragon;hurtDragon=function(d,src){if(lv188H()&&typeof d==='number'&&d>0&&HM_WIZ[src]&&(WZB.on||DWB.on))arguments[0]=d*wz188Dm()/Math.pow(HM.bossDm,lvsL()-1);return _hd.apply(this,arguments);};}
// level readers that are not castle / resources: level 1 on normal/easy
{const _f=nrLvl;nrLvl=function(){return lv188H()?_f.apply(this,arguments):1;};}
{const _f=gdLv;gdLv=function(){return lv188H()?_f.apply(this,arguments):1;};}
{const _f=cg128Lvl;cg128Lvl=function(){return lv188H()?_f.apply(this,arguments):1;};}
{const _f=el129Lv;el129Lv=function(){return lv188H()?_f.apply(this,arguments):1;};}
{const _f=tgLv;tgLv=function(){return lv188H()?_f.apply(this,arguments):1;};}
{const _f=raidTierStats;raidTierStats=function(T,n,lvl,easy){return _f.call(this,T,n,lv188H()?lvl:1,easy);};}
for(const k of ['kaStats','startRaidWarning','spawnPatrol','patrolTarget','wsSpawn','btDmg']){try{const _f=eval(k);if(typeof _f!=='function')continue;
  const w=function(){return lv188Run(_f,this,arguments);};Object.assign(w,_f);eval(k+'=w');}catch(e){}}
// Cerberus (partNR cbAttack, line 924 of the built file) multiplied its bites by +6%/level on top of the mini-boss hurtDragon hook (LVS_SRC.cerberus),
// so it was counted twice. Cerberus is a mini boss: its bite now scales only through the boss rule (hard +10%/level, normal/easy x1).
// The extra 924 factor is divided back out here in every mode (cbAttack itself runs at the real castle level, so a death inside it is unaffected).
{const _f=cbAttack;cbAttack=function(){LV188.cb++;try{return _f.apply(this,arguments);}finally{LV188.cb--;}};}
{const _hd=hurtDragon;hurtDragon=function(d,src){if(LV188.cb>0&&src==='cerberus'&&typeof d==='number'&&G&&G.lvl>1){arguments[0]=d/(1+.06*(G.lvl-1));LV188.cbFix++;}return _hd.apply(this,arguments);};}
// princes: on normal/easy every prince fleet has the first prince's strength (names and colours still change)
{const _f=princeInfo;princeInfo=function(l){const r=_f.apply(this,arguments);if(lv188H()||!(r&&r.k>1))return r;const b=_f.call(this,5);
  return Object.assign({},b,{name:r.name,short:r.short,col:r.col,trim:r.trim,crest:r.crest,lvl:r.lvl});};}
// alarm waves (knights riding out of the castle as the wanted bar climbs): no +25%/level on normal/easy
{const _ng=newGame;newGame=function(opt){const r=_ng.apply(this,arguments);if(G&&!G.hard)G.waveMul=(EASY?.5:1);return r;};}

// ======================= queue 191 / 191a: bites only hit what is IN FRONT of the jaws; mouth capacity for multi-bites =======================
// 191:  a bite only reaches targets in a forward cone of +-50 degrees around the way the dragon faces (big animals count by their body
//       edge), or right at the tip of the snout - no more 360-degree "belly bites" of things beside or behind the dragon.
//       The swoop-bite (flying low onto ground targets) stays. From the GROUND the dragon can no longer bite flying things: airborne
//       wild dragons, leaping flying fish / dolphins, flying fairies and vampire bats (birds in the air were already out of reach and the
//       griffin needs both of you low). Flying-vs-flying bites in front still work.
// 191a: one bite can take several SMALL things in the cone, up to the mouth capacity BC191.cap (4): small = 1 (villagers, sheep, wolves,
//       deer...), medium = 2 (knights, hunters, archers on foot, 25+ HP animals), large = the whole mouth (elephants, hippos, bears,
//       gorillas, lions, tigers, bulls, mounted riders, champions, princes, whales, squid, sandworms, wild dragons, anything 60+ HP).
//       A large target is always bitten alone. Closest first.
const BC191={cone:50*Math.PI/180,tip:28,cap:4,skipCone:0,skipAir:0,capCut:0,
  big:new Set(['elephant','giraffe','hippo','rhippo','rhino','bear','gorilla','tiger','lion','bull','sandworm','wdragon','croc','camel']),
  bigSea:new Set(['whale','squid','orca','octopus','narwhal','school'])};
function bc191Airborne(u){return !!((u.alt||0)>.3||(u.fly||0)>.3||u.flying===true);}
function bc191Cost(u){if(!u)return 1;if(u.type==='sea'?BC191.bigSea.has(u.kind):BC191.big.has(u.species))return BC191.cap;
  if(u.mounted||u.horse||u.champ||u.prince||u.boss||(u.maxHp||0)>=60||(typeof szK==='function'&&szK(u)>=1.3))return BC191.cap;
  if((u.maxHp||0)>=25||u.type==='knight'||u.type==='hunter')return 2;return 1;}
function bc191InCone(u){const dd=dist(u,D),ext=typeof szR==='function'?szR(u)||0:0;
  const mx=D.x+Math.cos(D.ang)*80,my=D.y+Math.sin(D.ang)*80;if(d2(u.x,u.y,mx,my)<BC191.tip+ext)return true;
  if(dd<1)return false;const fa=Math.abs(angDiff(Math.atan2(u.y-D.y,u.x-D.x),D.ang));return fa<=BC191.cone+(ext?Math.atan2(ext,dd):0);}
function bc191Pick(T){const out=[];let used=0;
  for(const u of T){const c=bc191Cost(u);if(!out.length){out.push(u);used=c;if(c>=BC191.cap)break;continue;}
    if(c>=BC191.cap)continue;if(used+c>BC191.cap)continue;out.push(u);used+=c;if(used>=BC191.cap)break;}
  if(out.length<T.length)BC191.capCut++;return out;}
{const _bt=biteTargets;biteTargets=function(){const T=_bt.apply(this,arguments);if(!T||!T.length||!D)return T;const gr=D.alt<0.3;
  const F=T.filter(u=>{if(gr&&bc191Airborne(u)){BC191.skipAir++;return false;}if(!bc191InCone(u)){BC191.skipCone++;return false;}return true;});
  return bc191Pick(F);};}
// fairies / vampire bats (b3Eat) could be snapped out of the air from the ground: ground bites now only reach ones that have landed
{const _b=b3Eat;b3Eat=function(){if(!D||D.alt>=.3)return _b.apply(this,arguments);const hid=[];
  try{for(const b of birds)if(b.b3&&!b.dead&&b.state!=='ground'&&b.state!=='perch'&&(b.z||0)>25){b.dead=true;hid.push(b);}return _b.apply(this,arguments);}
  finally{for(const b of hid)b.dead=false;if(hid.length)BC191.skipAir++;}};}
// ======================= queue 146a / 146b: repeat wizard bonus by mode, kept until the dragon dies =======================
// 146a: every repeat wizard win adds +7.5% attack on NORMAL, +5% on HARD, +10% on EASY (additive). The "Attack up!" pill shows the step.
// 146b: the bonus carries over from castle level to castle level but is LOST when the dragon dies (a new game starts at 0). It is stored
//       in the game itself (G.pb146 wins, G.pb146p bonus), so autosaves and manual saves keep it; the old forever-browser key is retired.
function pb146Step(){return EASY?.10:(G&&G.hard?.05:.075);}
PB146.p=0;PB146.n=0;PB146.mul=function(){return 1+(PB146.p||0);};PB146.load=function(){};
PB146.save=function(){if(G){G.pb146=PB146.n;G.pb146p=PB146.p;}};
try{localStorage.removeItem(PB146.key);}catch(e){}
pb146Win=function(who){const s=pb146Step();PB146.n++;PB146.p=Math.round((PB146.p+s)*1000)/1000;PB146.save();G.pb146Wins=(G.pb146Wins||0)+1;
  const pc=v=>(v*100).toFixed(1).replace(/\.0$/,'');
  boostAlert(`⚔️ Attack up! +${pc(s)}%`,`${who} beaten again · all your attacks +${pc(PB146.p)}% until this dragon falls`);};
{const _nl=nextLevel;nextLevel=function(){PB146.carry={n:PB146.n,p:PB146.p};try{return _nl.apply(this,arguments);}finally{PB146.carry=null;}};}
{const _n=newGame;newGame=function(){const c=PB146.carry;const r=_n.apply(this,arguments);if(c){PB146.n=c.n;PB146.p=c.p;}else{PB146.n=0;PB146.p=0;}PB146.save();return r;};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);const g=d&&d.G||{};PB146.n=g.pb146|0;
  PB146.p=typeof g.pb146p==='number'?g.pb146p:Math.round(PB146.n*pb146Step()*1000)/1000; // older saves: count x this mode's step
  PB146.save();return r;};}
// ======================= queue 193: water puts out burning enemies and shields them from lava splashes =======================
// Enemies standing or swimming in water (sea creatures always, others in water and not on a bridge) take no burning damage over time:
// a burning unit that is in water, or walks into it, is put out at once with a puff of steam. Lava splashes no longer hurt enemies in
// water. A direct fire-breath hit still does its normal damage. Ships still burn (unchanged). The dragon has no burning status, so no change.
const WD193={out:0,shield:0,ls:0};
function wd193Wet(u){if(!u||u.dead)return false;if((u.alt||0)>.3||(u.fly||0)>.3)return false;if(u.type==='sea')return true;
  try{return inWater(u.x,u.y)&&!onBridge(u.x,u.y);}catch(e){return false;}}
function wd193Douse(){for(const u of units)if(u.burn>0&&!u.dead&&wd193Wet(u)){u.burn=0;WD193.out++;
  if(Math.abs(u.x-D.x)<1400&&Math.abs(u.y-D.y)<1000){try{puff(u.x,u.y-10,8,'rgba(235,240,245,',70,10);}catch(e){}}}}
{const _u=updFire;updFire=function(){try{wd193Douse();}catch(e){console.warn('193',e);}return _u.apply(this,arguments);};}
{const _l=lavaSplash;lavaSplash=function(){WD193.ls++;try{return _l.apply(this,arguments);}finally{WD193.ls--;}};}
{const _h=hurtUnit;hurtUnit=function(u,d,src){if(WD193.ls>0&&src==='fire'&&wd193Wet(u)){WD193.shield++;return;}return _h.apply(this,arguments);};Object.assign(hurtUnit,_h);}

// ======================= sand worm labels show the real damage (follow-up to 177) =======================
// partD.js line 59/64 printed fixed text ("-8" ambush, "-5" chomp) although 177 and the level/hard rules change the bite.
// The worm's hurtDragon call is measured (dragon health before/after) and the label shows that number; no number if the hit was blocked.
const SWL={last:null,n:0};
{const _hd=hurtDragon;hurtDragon=function(d,src){if(src!=='sandworm')return _hd.apply(this,arguments);const h0=D.hp;
  try{return _hd.apply(this,arguments);}finally{SWL.last={t:G?G.t:0,d:Math.max(0,h0-D.hp)};}};}
{const _fl=float;float=function(x,y,t,c){if(typeof t==='string'&&SWL.last&&G&&SWL.last.t===G.t){const m=/^(CHOMP! Worm bite!|A GIANT SAND WORM bursts from the dunes!) -[58]$/.exec(t);
  if(m){const v=Math.round(SWL.last.d);t=v>0?m[1]+' -'+v:m[1];SWL.n++;}}return _fl.apply(this,[x,y,t,c].concat([].slice.call(arguments,4)));};}


// ======================= queue 182b: King William can never strike while his golden shield is up =======================
// The tdiff "attacks while blocking" hits were traced to ordinary knights (base updKnight melee, 10 damage), not the King: his own
// sword/bash timers are frozen during a block. Closed for good anyway: any sword/bash hit dealt from inside the King's own update while
// his shield is raised is dropped, and on hard his royal crossbow also waits until the shield comes down.
const KB182B={u:null,drop:0,xbHeld:0};
{const _s=kaStep;kaStep=function(u){const p=KB182B.u;KB182B.u=u;try{return _s.apply(this,arguments);}finally{KB182B.u=p;}};Object.assign(kaStep,_s);}
{const _hd=hurtDragon;hurtDragon=function(d,src){const k=KB182B.u;if(k&&k===KA.u&&k.kb182>0&&(src==='sword'||src==='bash')){KB182B.drop++;return;}return _hd.apply(this,arguments);};}
{const _x=hmXbTick;hmXbTick=function(){const L=HM.xbList;if(!L||!L.some(u=>u&&u.isKingArmor&&u.kb182>0))return _x.apply(this,arguments);
  HM.xbList=L.filter(u=>!(u&&u.isKingArmor&&u.kb182>0));KB182B.xbHeld++;try{return _x.apply(this,arguments);}finally{HM.xbList=L;}};}

// ======================= queue 194a: HARD mode - troops and alphas get tougher every castle level =======================
// HARD only (normal and easy unchanged). Per castle level, compounding, x1 at level 1:
//   troops (knights, soldiers, archers, guards, hunters, militia, Vikings, raid champions, realm soldiers): health x1.01^(L-1), attack x1.05^(L-1)
//   alphas (the 176 list: pack leaders, alpha hippos, tigers, realm alphas): health x1.05^(L-1), attack x1.10^(L-1), on top of 176
// All existing hard rules (139 troop x1.3 x1.05/level, 139 alpha growth, 176) still apply first. Not King William, the prince, the
// princess or the realm guardians. Attack = melee hits made during the unit's own update plus the arrows/axes/spears it fires.
// Units are not saved (they respawn on load), so nothing is applied twice.
const T194={tHp:1.01,tAt:1.05,aHp:1.05,aAt:1.10,cur:null,nT:0,nA:0,hits:0,proj:0};
const T194_NR=new Set(['hobsol','elf','unirider','dwarf','centaur','goblin','gobarch','orc']);
function t194L(){return Math.max(1,(G&&G.lvl)||1);}
function t194On(){return !!(G&&!G.easy&&!EASY&&lv188H());}
function t194Troop(u){if(!u||u.dead||u.isKing||u.isKingArmor||u.isPrince||u.princess||u.gd||u.guardian)return false;
  if(u.type==='knight'||u.type==='archer'||u.type==='hunter'||u.militia||u.vk)return true;
  return !!(u.nr&&T194_NR.has(u.species)&&!al176Is(u));}
function t194Kind(u){if(!u||u.dead)return null;if(al176Is(u))return 'a';if(t194Troop(u))return 't';return null;}
function t194AtkMul(u){if(!t194On())return 1;const L=t194L();if(L<=1)return 1;const k=t194Kind(u);return k==='a'?Math.pow(T194.aAt,L-1):k==='t'?Math.pow(T194.tAt,L-1):1;}
function t194Proj(A,n,m){if(!A)return;for(let i=Math.max(0,n);i<A.length;i++){const q=A[i];if(!q||q.t194)continue;q.t194=1;if(m!==1&&m>0&&typeof q.dmg==='number'&&q.dmg>0){q.dmg*=m;T194.proj++;}}}
function t194Wrap(f){const w=function(u){if(!u||typeof u!=='object'||T194.cur===u)return f.apply(this,arguments);
    const p=T194.cur,a=projs,b=typeof NR_P!=='undefined'?NR_P:null,n0=a.length,n1=b?b.length:0;T194.cur=u;
    try{return f.apply(this,arguments);}finally{T194.cur=p;try{const na=projs===a&&a.length>n0,nb=b&&NR_P===b&&b.length>n1;
      if(na||nb){const m=t194AtkMul(u);if(na)t194Proj(a,n0,m);if(nb)t194Proj(b,n1,m);}}catch(e){}}};
  Object.assign(w,f);return w;}
for(const k of['updKnight','updArcher','updCavalry','updHunter','updMilitia','updCrew','updWild','updAnimal','updCroc','updCougar','updWD','updRR','updNW','updOC',
  'updSeaUnit','updDCam','updBull','nrUpd','hpUpd','raidStep','escortStep','princeStep','soldierSwim']){try{const f=eval(k);if(typeof f!=='function')continue;const w=t194Wrap(f);eval(k+'=w');}catch(e){}}
{const _hd=hurtDragon;hurtDragon=function(d,src){const u=T194.cur;if(u&&typeof d==='number'&&d>0){let m=1;try{m=t194AtkMul(u);}catch(e){}if(m!==1&&m>0){arguments[0]=d*m;T194.hits++;}}return _hd.apply(this,arguments);};}
function t194Scan(){if(!t194On())return;const L=t194L();if(L<=1)return;const tm=Math.pow(T194.tHp,L-1),am=Math.pow(T194.aHp,L-1);
  const S=new Set(units);if(typeof NRU!=='undefined')for(const u of NRU)S.add(u);
  for(const u of S){if(!u||u.dead)continue;let m=0;const k=t194Kind(u);
    if(k==='a'&&!u.a194){u.a194=am;m=am;T194.nA++;}else if(k==='t'&&!u.t194h){u.t194h=tm;m=tm;T194.nT++;}
    if(m>1){u.maxHp=Math.round((u.maxHp||u.hp)*m);u.hp=Math.round(u.hp*m);}}}
{const _u=update;let acc=0;update=function(dt){const r=_u.apply(this,arguments);if(G&&scene==='play'&&!G.over){acc+=dt;if(acc>=.25){acc=0;try{t194Scan();}catch(e){}}}return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{t194Scan();}catch(e){}return r;};Object.assign(newGame,_ng);}
{const _sl=svLoad;svLoad=function(){const r=_sl.apply(this,arguments);try{t194Scan();}catch(e){}return r;};}
// the tiger alpha rebuilds its health on a new level or after loading; clear the mark so it gets the boost again (same as 176)
if(typeof tgMake==='function'){const _tm=tgMake;tgMake=function(u){const r=_tm.apply(this,arguments);if(u)u.a194=0;return r;};}
// ======================= queue 195/195a-c, 196b/196c, 197: leader crossbows only while the dragon flies; weaker regular troops; Viking hire price =======================
// 195: no common crossbowmen any more (139v above: only King William, the princes and the named raid knights carry one; regular
//      knights fight with lance / sword only). 195a/b: those leaders draw and shoot the crossbow ONLY while the dragon is flying;
//      when it walks / lands the crossbow stays holstered and they fight in melee. King William 3 bolts per volley, the others 1.
// 196b/c: every regular troop of every faction (kingdom, desert, Vikings incl. the chief's bear, light and dark realms) starts with
//      less health AND attack: easy x0.75, normal x0.80, hard x0.85. Not the King, princes, princess, named knights, guardians,
//      bosses, alphas or animals. The 194a hard per-level growth comes on top.
// 197: a Viking hire costs easy 200, normal 100, hard 50 gold (milestones and cooldowns unchanged).
const XB195={fly:()=>!!(typeof D!=='undefined'&&D&&D.mode==='air'),held:0};
function xb195Hold(){for(const u of units)if(u&&(u.isKingArmor||u.isPrince||u.champ)){u.xbShow=0;u.xbAim=0;}}
{const _t=hmXbTick;hmXbTick=function(dt){if(!XB195.fly()){XB195.held++;for(const u of HM.xbList||[])if(u){u.xbShow=0;u.xbAim=0;}return;}return _t.apply(this,arguments);};}
{const _f=kb157Fire;kb157Fire=function(u){if(!XB195.fly()){XB195.held++;if(u){u.xbShow=0;u.xbAim=0;}return;}return _f.apply(this,arguments);};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!XB195.fly())xb195Hold();return r;};}
const W196={easy:.75,normal:.8,hard:.85,nT:0};
function w196F(){if((G&&G.easy)||EASY)return W196.easy;return lv188H()?W196.hard:W196.normal;}
function w196Troop(u){return !!(u&&!u.dead&&!u.champ&&!u.boss&&t194Troop(u)&&!al176Is(u));}
{const _a=t194AtkMul;t194AtkMul=function(u){let m=_a.apply(this,arguments);try{if(w196Troop(u))m*=w196F();}catch(e){}return m;};}
function w196Apply(u,f,keep){u.w196=f;u.maxHp=Math.max(1,Math.round((u.maxHp||u.hp)*f));u.hp=keep?Math.min(u.hp,u.maxHp):Math.max(1,Math.round(u.hp*f));
  if(u.bearMax>0){u.bearMax=Math.max(1,Math.round(u.bearMax*f));u.bearHp=keep?Math.min(u.bearHp,u.bearMax):Math.max(0,Math.round((u.bearHp||0)*f));}W196.nT++;}
function w196Scan(){if(!G)return;const f=w196F();const S=new Set(units);if(typeof NRU!=='undefined')for(const u of NRU)S.add(u);
  for(const u of S)if(u&&!u.w196&&w196Troop(u))w196Apply(u,f,false);}
// a Viking coming back ashore from his ship keeps the (already lowered) health he boarded with
{const _m=vkMk;vkMk=function(g,r,x,y,a){const u=_m.apply(this,arguments);try{if(u&&a&&a.hp>0){const f=w196F();w196Apply(u,f,true);
  if(t194On()&&t194L()>1){const tm=Math.pow(T194.tHp,t194L()-1);u.t194h=tm;u.maxHp=Math.round(u.maxHp*tm);u.hp=Math.min(u.hp,u.maxHp);}}}catch(e){}return u;};}
{const _u=update;let acc=0;update=function(dt){const r=_u.apply(this,arguments);if(G&&scene==='play'&&!G.over){acc+=dt;if(acc>=.25){acc=0;try{w196Scan();}catch(e){}}}return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{w196Scan();}catch(e){}return r;};Object.assign(newGame,_ng);}
{const _sl=svLoad;svLoad=function(){const r=_sl.apply(this,arguments);try{w196Scan();}catch(e){}return r;};}
const VK197={easy:200,normal:100,hard:50};
try{Object.defineProperty(VK,'cost',{get(){return (G&&G.easy)||EASY?VK197.easy:VK197.normal;},set(v){},configurable:true});
  Object.defineProperty(VK,'hCost',{get(){return VK197.hard;},set(v){},configurable:true});}catch(e){}
// ======================= queue 198: iPhone portrait - main menu fits the screen (safe area) =======================
// In portrait on a touch screen the title menu started at the very top, under the iPhone status bar / Dynamic Island.
// Now (portrait touch only) it starts below the safe-area top inset and is scaled to the widest line actually drawn, so it uses
// the screen width. The tap areas (TOUCH.tg) follow the same scale and offset. Landscape and desktop are unchanged.
const TT198={w:0,h:0,k:0,dy:0,on:0};
function tt198On(){return !!(typeof TOUCH!=='undefined'&&TOUCH.on&&VH>VW*1.05);}
{const _dt=drawTitle;drawTitle=function(){if(!tt198On()){TT198.on=0;return _dt.apply(this,arguments);}
  const dy=Math.round((SAFE&&SAFE.t||0)+Math.max(8,VH*.015));let k2=Math.min(1.2,VH/470,VW/900);
  if(TT198.w>200)k2=Math.max(k2*.8,Math.min(1.2,(VW-16)/TT198.w,(VH*.5-dy)/Math.max(200,TT198.h+12)));
  const S=ctx.setTransform,FT=ctx.fillText;let sc=0,mw=0,mh=0;
  ctx.setTransform=function(a,b,c,d,e,f){if(typeof a==='number'&&Math.abs(a-DPR)>1e-6){sc=1;return S.call(ctx,DPR*k2,0,0,DPR*k2,DPR*(VW-VW*k2)/2,DPR*dy);}sc=0;return S.apply(ctx,arguments);};
  ctx.fillText=function(s,x,y){try{if(sc&&s){const w=ctx.measureText(String(s)).width,al=ctx.textAlign,c=VW/2;
      const l=al==='center'?x-w/2:al==='right'||al==='end'?x-w:x,r=l+w;mw=Math.max(mw,2*Math.max(c-l,r-c));mh=Math.max(mh,y);}}catch(e){}return FT.apply(ctx,arguments);};
  try{return _dt.apply(this,arguments);}finally{delete ctx.setTransform;delete ctx.fillText;if(ctx.setTransform!==S)ctx.setTransform=S;if(ctx.fillText!==FT)ctx.fillText=FT;
    if(mw>0){TT198.w=Math.max(460,mw);TT198.h=mh;}TT198.k=k2;TT198.dy=dy;TT198.on=1;
    const g=TOUCH.tg;if(g)TOUCH.tg={k:k2,ox:(VW-VW*k2)/2,cx:VW/2,y0:(g.y0||112)+dy/k2};S.call(ctx,DPR,0,0,DPR,0,0);}};}
