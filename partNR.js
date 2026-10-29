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
function wzHurt(d,how){if(!WZB.on||WZB.koT>0||G.nrOpen)return;WZB.hp-=d;WZB.hitT=G.t;G.nrWzHp=Math.max(1,Math.round(WZB.hp));
  if(rnd()<.15)float(WZ.x+R(-30,30),WZ.y-WZ.H-60,how==='bite'?'Ouch! My beard!':'Yowch! Hot hot!','#e6d0ff');
  if(WZB.hp<=0){WZB.hp=0;WZB.koT=2;WZB.ice=[];WZB.marks=[];WZB.winds=[];float(WZ.x,WZ.y-WZ.H-70,'Dizzy wizard!','#ffe28a');}}
function wzCast(){const k=WZB.spell++%3,t=wzTop();WZB.cast=.5;
  if(k===0){const a0=Math.atan2(D.y-t.y,D.x-t.x),dd=Math.hypot(D.x-WZ.x,D.y-WZ.y);for(let i=0;i<5;i++){const a=a0+(i-2)*.13,sp=440,T=Math.max(.5,dd/sp);
      WZB.ice.push({x:WZ.x,y:WZ.y,z:WZ.H+20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vz:(heightOf()-WZ.H-20)/T,t:0,T:T+.6});}float(t.x,t.y-40,'Ice spikes!','#bfe8ff');WZB.stats.ice++;}
  else if(k===1){WZB.marks.push({x:D.x+D.vx*.35,y:D.y+D.vy*.35,t:1});float(t.x,t.y-40,'Lightning!','#fff3a0');WZB.stats.lightning++;}
  else{WZB.winds.push({r:30,t:0,hit:0});float(t.x,t.y-40,'Gust of wind!','#d8f0ff');WZB.stats.wind++;}}
function wzUpd(dt){const dd=Math.hypot(D.x-WZ.x,D.y-WZ.y);
  if(G.nrOpen){WZB.on=false;return;}
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
const WZ_GOLD=300; // gold for breaking the wizard's shield (achievements list reads it)
function wzDefeat(){WZB.on=false;G.nrOpen=1;G.nrOpenT=G.t;G.nrWzHp=0;puff(WZ.x,WZ.y-WZ.H,14,'rgba(200,170,255,',90,10);sparkle(WZ.x,WZ.y-WZ.H,20);
  D.gold=(D.gold||0)+WZ_GOLD;float(WZ.x,WZ.y-WZ.H-60,`+${WZ_GOLD} gold`,'#ffd84a');showToast(`🛡️ The magic shield shatters! The barrier opens for you (+${WZ_GOLD} gold) — the dizzy wizard can be gobbled up`);try{horn();}catch(e){}G.nrWzWins=(G.nrWzWins||0)+1;}
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
  if(!keepG){G.nrWarT=0;G.nrVanT=50;G.nrOpen=0;G.nrWzHp=0;}}
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
  if(!G.nrOpen&&!(WZB.koT<0)){const ko=WZB.koT>0,bob=ko?0:Math.sin(G.t*2)*2,c=WZB.cast>0;
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
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!WZB.on||G.nrOpen||!WZB.maxHp)return;const S=hudSlot('wizard',Math.min(424,VW*.6+4),32),w=S.w-4,x=S.x+2,y=S.y+20,lab='🛡️ Storm Wizard\'s magic shield'+(EASY?' (easy)':'');
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
const NR_TUR_BITE=32,NR_TUR_STOMP=45;
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
  for(const k in NR_CC){const c=NR_CC[k];rect(X(c.x)-(big?5:3),Y(c.y)-(big?5:3),big?10:6,big?10:6,k==='L'?'#f0f0ff':'#2a2030');if(big)txt(c.n,X(c.x)+8,Y(c.y)+4,10,k==='L'?'#e8f0ff':'#ffb0a0','left');}}catch(e){}return r;};}
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
      if(u.atAlpha&&u.species==='centaur'&&dd<200&&D.alt<.4&&!(u.chgCd>G.t)){u.chgCd=G.t+5;u.dash=.28;u.dva=Math.atan2(D.y-u.y,D.x-u.x);hurtDragon(EASY?4:7,'centaur');u.lastHitD=G.t;G.atCharge=(G.atCharge||0)+1;float(D.x,D.y-90,'Hoof charge! -'+(EASY?4:7),'#ffb0a0');return;}
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
function wzTowerOpen(){return !!G.nrOpen;}
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
function wzEdible(){return G.nrOpen&&!G.wzEaten&&scene==='play';}
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
      showToast('🦅 Gulp! The Griffin is gone - until the next dragon comes along...');if(typeof SFX!=='undefined'&&SFX.play)try{SFX.play('gulp',gx,gy,1);}catch(e){}return;}}
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
  float(u.x,u.y-140,'The sand worm is beaten! The dunes are quiet now.','#7aff8a');if(typeof showToast==='function')showToast('🪱 Sand worm beaten! It stays gone until you lose this dragon');}
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
// The king's castle grows ~+31% gate health per level (260+80/level); mini bosses grow about HALF that: +15% health and +6% damage per castle level,
// with NO upper cap (queue 76: the old level-8 cap is gone; x2.05 / x1.42 at level 8, x2.8 / x1.72 at 13, x4.0 / x2.2 at 21). Mini bosses: giant squid (Kraken), giant octopus, sand worm, Nessie,
// Hydra (per head; always 3 heads now), Griffin, Cerberus, and every other dragon (wild / rival dragons). The Lumenspire (light) and Doomforge (dark)
// citadel towers scale the same way (and so do the realm's other magic towers - they belong to the same two castles' kingdoms).
// The WIZARD never scales (300 health at every level), and regular soldiers, units and creatures (incl. pack alphas) no longer scale either.
const LVS={hp:.15,dm:.06,cap:Infinity}; // queue 76: no level cap (guardians gdLv() and raid champions were never capped)
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
if(typeof REGION_SUB!=='undefined'&&REGION_SUB.savanna)REGION_SUB.savanna=REGION_SUB.savanna.replace('around the watering hole','around the watering holes, each guarded by an alpha hippo');
// drawing: a big round lilac-grey hippo; half-submerged (eyes, ears, nostrils and back) while wallowing, fully out when it charges
function drawHippo(u){const x=u.x,y=u.y,f=u.face||1,sub=clamp(u.sub||0,0,1),bob=Math.sin(G.t*1.4+u.id)*1.5,yw=u.yawn>0?Math.sin(Math.min(1,u.yawn)*Math.PI):0,sc=1.25;
  const body='#8f7f9a',dk='#6c5d78',lt='#c9b3cf',pink='#f2a6b8';
  const rp=(G.t*.5+u.id*.3)%1;ctx.strokeStyle=`rgba(220,240,255,${.5*(1-rp)*sub+.05})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x,y+3,30+26*rp,9+8*rp,0,0,TAU);ctx.stroke();
  ctx.save();ctx.translate(x,y+bob*sub);ctx.scale(sc,sc);
  if(sub<.5){ell(0,6,30,8,'rgba(0,0,0,.25)');for(const s of[-1,1])for(const k of[-14,12]){ell(k+s*3,4,5,7,dk);}}
  // body (only the back shows in the water)
  ctx.save();if(sub>=.5){ctx.beginPath();ctx.rect(-60,-60,120,58);ctx.clip();}
  ell(-f*4,-8,28,17,body);ell(-f*6,-14,20,8,lt);
  // head + muzzle (mouth opens in a big yawn)
  const hx=f*22,hy=-12;ell(hx,hy,15,13,body);
  if(yw>.05){poly([hx+f*6,hy+2,hx+f*30,hy-6-yw*14,hx+f*30,hy+12+yw*10,hx+f*6,hy+8],pink);ctx.fillStyle='#fff';for(const t of[-1,1])ctx.fillRect(hx+f*24-2,hy+(t<0?-5-yw*11:9+yw*7),4,5);}
  ell(hx+f*14,hy+3,13,10,lt);ell(hx+f*20,hy-1,2.2,1.6,dk);ell(hx+f*14,hy-1,2.2,1.6,dk);
  ctx.restore();
  // eyes + ears always visible
  ell(hx-f*2,hy-12,5,5,'#fff');ell(hx-f*1,hy-12,2.4,2.6,'#222');ell(hx-f*10,hy-15,4,5,dk);ell(hx-f*10,hy-15,2,2.5,pink);
  // alpha crest: a little gold crown
  poly([hx-f*8,hy-20,hx-f*6,hy-28,hx-f*3,hy-22,hx,hy-29,hx+f*2,hy-21],'#ffd23a');
  ctx.restore();
  if(sub>=.5){ctx.strokeStyle='rgba(225,245,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y-2,40,7,0,0,TAU);ctx.stroke();}
  if(u.hp<u.maxHp&&!u.dead){const w=44;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(x-w/2,y-64,w,5);ctx.fillStyle=u.hp>u.maxHp*HP_A.th?'#e05050':'#ffd23a';ctx.fillRect(x-w/2,y-64,w*Math.max(0,u.hp/u.maxHp),5);}
  if(!u.dead&&u.hp<=u.maxHp*HP_A.th){const t=G.t*3.2;for(let i=0;i<3;i++){const a=t+i*TAU/3;hnStar(x+f*22+Math.cos(a)*16,y-58+Math.sin(a)*4,3.2,i%2?'#ffe35a':'#fff7c0');}}}
FAUNA_ART.add('hippo');
{const _df=drawFauna;drawFauna=function(u){if(u.species==='hippo'){drawHippo(u);return;}return _df.apply(this,arguments);};}
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
    {rew:()=>typeof RANSOM!=='undefined'?`the king pays a ransom of ${RANSOM.base} gold (+${RANSOM.perLvl} per castle level) · next castle level`:'next castle level'});
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
  A('boss','wizard','Shield Breaker',"Break the Storm Wizard's magic shield on his isle",()=>!!ACH.ev.wizard||achG('nrWzWins')>0,{rew:()=>`+${WZ_GOLD} gold · the barrier to the Northern Realms opens`});
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
// with the Storm Wizard's rules: the shield IS his health bar, every hit on the volcano, his obsidian spire or on him drains it, and the spire can only be smashed after he is beaten.
// ~1.75x the Storm Wizard (525 shield vs 300) and he never level-scales (101). Attacks (kid-friendly, cartoony):
//  - LAVA SHOTS: 5 glowing blobs (13 dmg each vs ice 9). Dragon fire does NOT melt them (unlike ice spikes); they just fizzle into steam when they land.
//  - ERUPTION: the volcano blasts smoke + fire; an expanding fire ring knocks the dragon back harder than the wind (1300 vs 1100) for 6 dmg (wind: 1).
//  - PURPLE LIGHTNING: telegraphed ring, then a purple bolt (8 dmg vs 6, radius 95 vs 90).
// Beaten (104): stays beaten for good - saved, kept through level-ups (only a brand-new game after losing the dragon resets him). Reward: +50 max health, +400 gold,
// his volcano unlocks for lava drinking and the LAVA SHOT is upgraded at EVERY volcano (102/103): a dark-purple TRIPLE shot (spread 0.14 rad) with +50% splash damage.
const DWV={x:9700,y:-9000,r:250,H:170,drinkR:190,name:'Cinder Isle'},DW_HP=525,DW_DMG={lava:13,erupt:6,bolt:8},DW_KB=1300,DW_GOLD=400,DW_GAIN=50,DW_SPIRE=520;
const DWL={n:3,spread:.14,mul:1.5};
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
function dwDefeat(){DWB.on=false;G.dwDown=1;G.dwHp=0;G.dwWins=(G.dwWins||0)+1;G.lavaUp=1;const t=dwTop();puff(t.x,t.y,14,'rgba(200,160,255,',90,10);sparkle(t.x,t.y,22);
  D.gold=(D.gold||0)+DW_GOLD;D.hpBonus=(D.hpBonus||0)+DW_GAIN;D.maxHp+=DW_GAIN;D.hp=D.maxHp;D.healFx=1;float(t.x,t.y-40,`+${DW_GOLD} gold`,'#ffd84a');
  boostAlert('🌋 Purple TRIPLE lava shot!',`Dark Wizard beaten · +${DW_GAIN} max health · 3 purple globs, +${Math.round((DWL.mul-1)*100)}% damage each, at every volcano`);
  try{achEv('dwizard');}catch(e){}try{horn();}catch(e){}}
// hits on him / his volcano / his spire all drain the shield
function dwNear(x,y,r){return Math.hypot(x-DWV.x,(y-DWV.y)*1.2)<DWV.r*.6+(r||0)||Math.hypot(x-dwSpire().x,y-dwSpire().y)<60+(r||0);}
function dwSpireUp(){return !(G&&G.dwSpireDown);}
function dwSpireHurt(d){if(!dwDown()||!dwSpireUp()||d<=0)return;G.dwSpireHp=(G.dwSpireHp==null?DW_SPIRE:G.dwSpireHp)-d;const s=dwSpire();
  if(G.dwSpireHp<=0){G.dwSpireDown=1;G.dwSpireHp=0;puff(s.x,s.y-60,16,'rgba(110,90,130,',120,14);D.gold=(D.gold||0)+100;float(s.x,s.y-120,'The obsidian spire crumbles! +100 gold','#ffd84a');}}
function dwHit(d,how){if(dwDown())dwSpireHurt(d);else if(DWB.on)dwHurt(d,how);}
{const _af=applyFire;applyFire=function(ox,oy,dt){const r=_af.apply(this,arguments);if(Math.abs(ox-DWV.x)<900&&Math.abs(oy-DWV.y)<900){const s=dwSpire();
    if(!dwDown()&&(inFire(DWV.x,DWV.y,ox,oy)||inFire(DWV.x,DWV.y-60,ox,oy)||inFire(s.x,s.y,ox,oy)))dwHurt(DR.fireDps*.55*dt,'fire');
    else if(dwDown()&&dwSpireUp()&&inFire(s.x,s.y,ox,oy))dwSpireHurt(DR.fireDps*.5*dt);}return r;};}
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
function nearDW(){return dwDown()&&D&&D.mode==='ground'&&D.alt<.3&&!D.swim&&Math.hypot(D.x-DWV.x,D.y-DWV.y)<DWV.drinkR+60;}
{const _n=nearLava;nearLava=function(){return _n.apply(this,arguments)||nearDW();};}
{const _l=lavaDrink;lavaDrink=function(){if(nearDW()){const ox=VOLC.x,oy=VOLC.y;VOLC.x=DWV.x;VOLC.y=DWV.y;try{const r=_l.apply(this,arguments);if(r)G.dwDrinks=(G.dwDrinks||0)+1;return r;}finally{VOLC.x=ox;VOLC.y=oy;}}
  if(!dwDown()&&D&&Math.hypot(D.x-DWV.x,D.y-DWV.y)<DWV.drinkR+60&&D.alt<.3&&!(G.dwLockT>G.t)){G.dwLockT=G.t+3;float(D.x,D.y-90,'The Dark Wizard\'s shield keeps you from the lava!','#e0c8ff');}
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
  for(const g of P){const sy=g.y-g.z;ell(g.x,g.y,10,5,'rgba(0,0,0,.25)');if(GFX_HI){ctx.globalCompositeOperation='lighter';const gg=ctx.createRadialGradient(g.x,sy,2,g.x,sy,26);gg.addColorStop(0,'rgba(200,120,255,.7)');gg.addColorStop(1,'rgba(120,0,200,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(g.x,sy,26,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
    ctx.fillStyle='#4a1470';ctx.beginPath();ctx.arc(g.x,sy,11,0,TAU);ctx.fill();ctx.fillStyle='#9a3ad8';ctx.beginPath();ctx.arc(g.x-2,sy-2,7.5,0,TAU);ctx.fill();ctx.fillStyle='#f0c8ff';ctx.beginPath();ctx.arc(g.x-4,sy-4,3,0,TAU);ctx.fill();
    ctx.strokeStyle='#22082e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.x,sy,11,0,TAU);ctx.stroke();}};}
// ---- drawing: soft shallows (no hard edge), volcano cone, obsidian spire, the wizard, his spells, shield, HUD bar, map ----
function dwGround(){const x=DWV.x,y=DWV.y,r=DWV.r;ctx.save();ctx.translate(x,y);ctx.scale(1,1/1.2);const g=ctx.createRadialGradient(0,0,r*.85,0,0,r*1.7);
  g.addColorStop(0,'rgba(120,150,160,.45)');g.addColorStop(1,'rgba(60,90,130,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*1.7,0,TAU);ctx.fill();
  const a=ctx.createRadialGradient(0,0,r*.2,0,0,r*.9);a.addColorStop(0,'rgba(64,54,60,.95)');a.addColorStop(.7,'rgba(84,72,76,.85)');a.addColorStop(1,'rgba(110,98,92,0)');ctx.fillStyle=a;ctx.beginPath();ctx.arc(0,0,r*.9,0,TAU);ctx.fill();ctx.restore();}
function dwVolcano(){const x=DWV.x,y=DWV.y,H=DWV.H,t=G.t,pl=.5+.5*Math.sin(t*2.6),hot=!dwDown()||true;
  ell(x,y+6,150,34,'rgba(0,0,0,.22)');poly([x-150,y,x-36,y-H,x+36,y-H,x+150,y],'#4a3c44');poly([x-150,y,x-36,y-H,x-6,y-H,x-60,y],'#5c4c54');
  for(const k of[-1,1])poly([x+k*10,y-H+4,x+k*24,y-H*.55,x+k*14,y-H*.3,x+k*6,y-H*.6],`rgba(255,${110+pl*60|0},40,.85)`);
  ell(x,y-H,36,10,'#2a1a20');ell(x,y-H+1,28,7,`rgba(255,${120+pl*80|0},40,1)`);if(GFX_HI){ctx.globalCompositeOperation='lighter';ell(x,y-H-6,50,18,`rgba(255,120,40,${.12+.1*pl})`);ctx.globalCompositeOperation='source-over';}
  if(dwSpireUp()){const s=dwSpire(),hf=G.dwSpireHp!=null&&dwDown()?G.dwSpireHp/DW_SPIRE:1;poly([s.x-26,s.y,s.x-14,s.y-120,s.x,s.y-150,s.x+14,s.y-120,s.x+26,s.y],'#1e1626');poly([s.x-14,s.y-120,s.x,s.y-150,s.x,s.y],'#34283e');
    ell(s.x,s.y-104,6,8,`rgba(200,120,255,${.6+.4*pl})`);if(dwDown()&&hf<1){rect(s.x-30,s.y-170,60,5,'#300');rect(s.x-30,s.y-170,60*hf,5,'#b48aff');}}
  else{const s=dwSpire();ell(s.x,s.y,34,12,'#2a2030');ell(s.x-10,s.y-6,12,8,'#3a2e44');ell(s.x+12,s.y-4,10,6,'#3a2e44');}}
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
{const _ng=newGame;newGame=function(opt){const lv=opt&&opt.lvl>1&&G,k=lv?{dwDown:G.dwDown,dwWins:G.dwWins,lavaUp:G.lavaUp,dwEaten:G.dwEaten,dwEatenN:G.dwEatenN,dwSpireDown:G.dwSpireDown,dwSpireHp:G.dwSpireHp,dwHp:G.dwHp}:null;
  const r=_ng.apply(this,arguments);dwReset();if(k)for(const q in k)if(k[q]!==undefined)G[q]=k[q];return r;};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);dwReset();return r;};}
if(typeof tallyAddSect==='function')tallyAddSect('nrdark','Northern Realms · Dark lands','👹','#9ad06a',[['dwizard','Dark Wizard']]);
{const _ab=achBuild;achBuild=function(){const L=_ab.apply(this,arguments),i=L.findIndex(a=>a.id==='wizEat'),A=(id,name,how,ok,o)=>Object.assign({sec:'boss',id,name,how,ok},o||{});
  L.splice(i<0?L.length:i+1,0,A('dwizard','Volcano Tamer',"Break the Dark Wizard's shield on his volcano isle in the dark northern sea",()=>!!ACH.ev.dwizard||achG('dwWins')>0,
      {rew:()=>`+${DW_GAIN} max health, +${DW_GOLD} gold · purple TRIPLE lava shot at every volcano (+${Math.round((DWL.mul-1)*100)}% damage each) · his volcano unlocks`}),
    A('dwEat','Spicy Snack','Gobble the dizzy Dark Wizard after breaking his shield',()=>!!ACH.ev.dwEat||achG('dwEatenN')>0));return L;};}
{const _w=wzClearFloes;wzClearFloes=function(){_w();if(OC&&OC.floes)OC.floes=OC.floes.filter(f=>Math.hypot(f.x-DWV.x,(f.y-DWV.y)*1.2)>DWV.r+Math.max(f.rx,f.ry)+250);};}
// ======================= queue 98: the weather turns stormier near the Wizard's Isle =======================
// Intensity ramps smoothly with distance to the isle (0 beyond ~3200, full inside ~600) and softens to 35% once the Storm Wizard is beaten.
// Screen overlay only: a dark blue-grey wash + vignette, choppy darker water tint, slanted rain streaks (30 on LOW, 90 on HIGH), and a soft harmless lightning
// flash every ~5-11 s with a quiet, delayed distant rumble. No damage, nothing scary.
const STORM={s:0,flash:0,next:6,thunder:-1,flashes:0};
function stormLevel(){if(!D||!G)return 0;const d=Math.hypot(D.x-WZ.x,D.y-WZ.y),s=clamp(1-(d-600)/2600,0,1);return s*s*(3-2*s)*(G.nrOpen?.35:1);}
{const _t=nrTick;nrTick=function(dt){_t(dt);if(scene!=='play'||!G)return;const tgt=stormLevel();STORM.s+=(tgt-STORM.s)*Math.min(1,dt*1.5);
  if(STORM.flash>0)STORM.flash-=dt;if(STORM.thunder>0){STORM.thunder-=dt;if(STORM.thunder<=0){STORM.thunder=-1;try{SFX.play('stomp',D.x,D.y,.18*STORM.s);}catch(e){}}}
  STORM.next-=dt;if(STORM.next<=0){STORM.next=R(5,11);if(STORM.s>.45&&!G.nrOpen||STORM.s>.3&&rnd()<.3){STORM.flash=.35;STORM.flashes++;STORM.thunder=R(.8,1.8);}}};}
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
