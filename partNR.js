// ======================= partNR: the NORTHERN REALMS (the world doubles northward: WY0 -2600 -> -11400) =======================
// Beyond the Frostpeak range lies a fantasy land in two bands.
//  Light band (south):  the Hobbit Shire (west) · the Elven realm of Lumeria (centre: purple grass, glowing trees, unicorns, centaurs, satyrs, minotaurs) · the Dwarf Holds (east)
//  Dark band (north):   the Goblin Bogs (west) · the Orc Warlands (centre) · the Cyclops Highlands (east) - with trolls, wyverns, giant scorpions & spiders (glowing red eyes)
// The dark side raids south with small vanguards and every 5 minutes marches a big army to the border; the light side patrols its own lands and only ever DEFENDS.
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
  {k:'elven',n:'Silverleaf',x:-1500,y:-4300},{k:'elven',n:'Moonglade',x:1700,y:-5300},{k:'elven',n:'Starwood',x:-4700,y:-5500},
  {k:'shire',n:'Bramblebottom',x:-10200,y:-4100},{k:'shire',n:'Thistledown',x:-13500,y:-5300},
  {k:'dwarf',n:'Ironhold Gate',x:6300,y:-4300},{k:'dwarf',n:'Emberforge',x:5300,y:-5900},
  {k:'goblin',n:'Gobbleton',x:-10600,y:-8600},{k:'goblin',n:'Scrapheap Hollow',x:-14000,y:-9900},{k:'goblin',n:'Snaggletooth Camp',x:-7700,y:-10300},
  {k:'orc',n:'Gorgrim War-Fort',x:-1200,y:-8900},{k:'orc',n:'Blackspike Camp',x:2000,y:-10000},
  {k:'cyclops',n:'One-Eye Caves',x:6300,y:-8800},{k:'cyclops',n:'Megalith Ring',x:5400,y:-10400}];
NR_TOWNS.forEach((t,i)=>t.i=i);
const NRT=n=>NR_TOWNS.find(t=>t.n===n);
const NR_BF={x:-1400,y:nrDarkY(-1400)+230}; // the border battlefield (just inside elven land)
const NR_ROADS=[['Gorgrim War-Fort','BF'],['BF','Silverleaf'],['Silverleaf','Moonglade'],['Silverleaf','Starwood'],['Starwood','Bramblebottom'],['Bramblebottom','Thistledown'],
  ['Moonglade','Emberforge'],['Emberforge','Ironhold Gate'],['Gobbleton','Scrapheap Hollow'],['Gobbleton','Snaggletooth Camp'],['Snaggletooth Camp','Gorgrim War-Fort'],
  ['Gorgrim War-Fort','Blackspike Camp'],['Blackspike Camp','Megalith Ring'],['Megalith Ring','One-Eye Caves'],['Silverleaf','PASS']];
const NR_PASS={x:2150,y:-2900};
function nrPt(n){return n==='BF'?NR_BF:n==='PASS'?NR_PASS:NRT(n);}
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
function onWzIsle(x,y){const dx=x-11600,dy=(y+6000)*1.2;return dx*dx+dy*dy<230*230;}
const WZ={x:11600,y:-6000,r:230,H:196};
{const _nc=nrCol;nrCol=function(x,y,wx,wy,n){if(onWzIsle(x,y)){const dx=x-WZ.x,dy=(y-WZ.y)*1.2,r=Math.hypot(dx,dy)/WZ.r;return r>.8?nrMix([230,216,176],[206,190,150],n):nrMix([120,96,176],[150,120,206],n);}return _nc(x,y,wx,wy,n);};}
{const _rk=regionKey;regionKey=function(x,y){if(y<-4000&&onWzIsle(x,y))return'wzisle';return _rk(x,y);};}
REGION_NAMES.wzisle="The Wizard's Isle";REGION_SUB.wzisle='Crackling tower of the Storm Wizard - he holds the magic barrier';REGION_LABEL.wzisle=[WZ.x,WZ.y-300];
// ---- the magic barrier: glowing crystal mountains along the south edge + a shimmer along the north coast ----
// Locked: the dragon may not enter the north lands. Unlocked (wizard defeated): ONLY the player's dragon crosses; every other unit stays on its side for good.
function nrBarZone(x,y){return y<nrEdge(x)+60&&x<coastX(y)+60&&y<MWY0+300;}
function nrBarPush(o,nr){ // returns true if moved
  if(nr){let m=false;const ey=nrEdge(o.x)-40;if(o.y>ey){o.y=ey;m=true;}const cx=coastX(o.y)-40;if(o.x>cx){o.x=cx;m=true;}return m;}
  if(!nrBarZone(o.x,o.y))return false;const dS=nrEdge(o.x)+62-o.y,dE=coastX(o.y)+62-o.x;if(dS<=dE)o.y=nrEdge(o.x)+62;else o.x=coastX(o.y)+62;return true;}
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
function nrKeepOut(){for(const u of units){if(u.dead||u.nr||u.princess)continue;if(u.y<MWY0+300&&nrBarZone(u.x,u.y))nrBarPush(u,false);}
  if(typeof birds!=='undefined')for(const b of birds){if(!b.dead&&b.y<MWY0+300&&nrBarZone(b.x,b.y))nrBarPush(b,false);}
  for(const s of(typeof ships!=='undefined'?ships:[]))if(s&&s.y<MWY0+300&&nrBarZone(s.x,s.y))nrBarPush(s,false);}

// elves see dragon fire coming and dash out of it (hunter-style, on a cooldown) - the dash also dodges the dragon's bite and stomp
{const _af=applyFire;applyFire=function(ox,oy,dt){for(const u of NRU)if(!u.dead&&NRS[u.species].dash&&Math.abs(u.x-ox)<DR.fireRange+60&&Math.abs(u.y-oy)<DR.fireRange+60&&inFire(u.x,u.y,ox,oy))nrDash(u,D.x,D.y);
  const r=_af.apply(this,arguments);for(const u of NRU)if(u.dash>0&&u.burn>0&&NRS[u.species].dash)u.burn=0;return r;};}
// ======================= the faction war: patrols, vanguard raids, the 5-minute army march =======================
// Squads are abstract (cheap) while far from the dragon and become real units when it comes near.
const NR_WAR_T=300;
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
  // --- the big march every 5 minutes ---
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
  const A=nrMkSq('army','D',dk,nrRoute('Gorgrim War-Fort','BF').map((p,i,a)=>i===a.length-1?{x:NR_BF.x,y:NR_BF.y-90}:p),{homeT:'Gorgrim War-Fort',at:'BF'});
  const B=nrMkSq('army','L',lt,nrRoute('Silverleaf','BF').map((p,i,a)=>i===a.length-1?{x:NR_BF.x,y:NR_BF.y+90}:p),{homeT:'Silverleaf',at:'BF'});
  A.foe=B;B.foe=A;G.nrBattles=(G.nrBattles||0)+1;G.nrArmy={d:dk.length,l:lt.length,t:G.t};
  showToast(`📯 The goblin army marches! (${dk.length} strong) — the elves muster ${lt.length} defenders at the border`);try{horn();}catch(e){}}
function nrBattle(dt){const A=NRQ.find(q=>q.kind==='army'&&q.side==='D'&&!q.dead),B=NRQ.find(q=>q.kind==='army'&&q.side==='L'&&!q.dead);
  if(!A&&!B)return;
  if(A&&B&&A.st==='battle'&&B.st==='battle'){A.bt=(A.bt||0)+dt;
    if(!A.units&&!B.units){nrAbsFight(A,B,dt);}
    else{ // when real, the soldiers actually fight: nudge both blocks together
      A.x+=(B.x-A.x)*Math.min(1,dt*.3)*.5;B.x+=(A.x-B.x)*Math.min(1,dt*.3)*.5;}
    const aL=A.mem.length,bL=B.mem.length;
    if(!aL||!bL||A.bt>120){const lightWon=!aL||A.bt>120;showToast(lightWon?'🛡️ The light army holds the border! The goblins scatter home':'⚔️ The dark army broke through... the elves fall back to Silverleaf');
      G.nrLastWin=lightWon?'L':'D';if(aL)nrSqHome(A);if(bL)nrSqHome(B);if(!lightWon&&aL){A.st='van';A.kind='van';A.st='go';A.route=nrRoute('BF','Silverleaf');A.pi=0;A.at='Silverleaf';}}}
  else if(A&&!B&&A.st==='battle'){A.kind='van';A.st='go';A.route=nrRoute('BF','Silverleaf');A.pi=0;A.at='Silverleaf';}
  else if(B&&!A&&B.st==='battle')nrSqHome(B);}
function nrVanguard(){const dark=NR_TOWNS.filter(t=>NR_DARK.has(t.k)&&t.k!=='cyclops'),light=NR_TOWNS.filter(t=>NR_LIGHT.has(t.k));
  const h=dark[RI(0,dark.length-1)],tg=light[RI(0,light.length-1)];const n=RI(3,6),l=nrLvl(),mix=[];
  for(let i=0;i<n;i++)mix.push(i===0&&l>=3?'orc':rnd()<.18+.03*l?'orc':i%3===1?'gobarch':'goblin');if(l>=5&&rnd()<.4)mix[n-1]='troll';
  nrMkSq('van','D',mix,nrRoute(h.n,tg.n),{homeT:h.n,at:tg.n});G.nrVans=(G.nrVans||0)+1;
  if(Math.hypot(tg.x-D.x,tg.y-D.y)<5000||G.nrOpen)showToast(`🏴 A goblin raiding party (${n}) sneaks toward ${tg.n}!`);}
// ======================= the Storm Wizard (boss) & the magic barrier =======================
// He stands on top of his tower on a small island in the NE deep sea and never leaves it. Defeat him and the barrier opens - for the dragon only.
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
function wzDefeat(){WZB.on=false;G.nrOpen=1;G.nrOpenT=G.t;G.nrWzHp=0;puff(WZ.x,WZ.y-WZ.H,14,'rgba(200,170,255,',90,10);sparkle(WZ.x,WZ.y-WZ.H,20);
  D.gold=(D.gold||0)+300;float(WZ.x,WZ.y-WZ.H-60,'+300 gold','#ffd84a');showToast('✨ The barrier opens for you! The Storm Wizard vanishes in a puff (+300 gold)');try{horn();}catch(e){}G.nrWzWins=(G.nrWzWins||0)+1;}
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
  if(!G.nrOpen&&nrBarZone(D.x,D.y)){nrBarPush(D,false);if(G.t-NR_BART>4){NR_BART=G.t;showToast('🔮 A magic barrier blocks the way — defeat the Wizard!');}}
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
function nrDrawFx(){const x0=cam.x-VW/cam.z/2-200,x1=cam.x+VW/cam.z/2+200,y0=cam.y-VH/cam.z/2-300,y1=cam.y+VH/cam.z/2+300,on=(x,y)=>x>x0&&x<x1&&y>y0&&y<y1;
  for(const p of NR_P){if(!on(p.x,p.y))continue;const k=p.t/p.T,z=p.z+(p.tz-p.z)*k+Math.sin(k*Math.PI)*40,Y=p.y-z;
    if(p.kind==='web'){ell(p.x,Y,6,6,'rgba(240,240,250,.8)');line(p.x-6,Y,p.x+6,Y,'#fff',1);line(p.x,Y-6,p.x,Y+6,'#fff',1);}
    else if(p.kind==='pebble')ell(p.x,Y,2.5,2.5,'#8a8070');else{const a=Math.atan2(p.vy-(p.tz-p.z)/p.T*.5,p.vx);line(p.x-Math.cos(a)*9,Y-Math.sin(a)*9,p.x+Math.cos(a)*9,Y+Math.sin(a)*9,'#f4ead0',1.6);ell(p.x+Math.cos(a)*9,Y+Math.sin(a)*9,1.6,1.6,'#c8d0ff');}}
  for(const k of NR_KO)if(on(k.u.x,k.u.y))nrDrawU(k.u,k.t+.001);
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
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!WZB.on||G.nrOpen||!WZB.maxHp)return;const w=Math.min(420,VW*.6),x=(VW-w)/2,y=VW<760?118:84;
  rect(x-2,y-2,w+4,14,'rgba(20,10,40,.75)');rect(x,y,w*Math.max(0,WZB.hp)/WZB.maxHp,10,'#a87aff');txt('🧙 The Storm Wizard'+(EASY?' (easy)':''),VW/2,y-6,13,'#e8dcff','center');};}
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
{const _te=tryEat;tryEat=function(){for(const t of NR_TUR)if(t.st==='ok'&&Math.hypot(D.x-t.x,D.y-t.y)<110&&D.alt<.5){D.eatCD=.6;nrTurHurt(t,15,'bite');float(D.x,D.y-90,'Crunch the tower!','#ffd27a');return;}return _te.apply(this,arguments);};}
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
// A WHITE egg rests in the elven main castle (Silverleaf), a BLACK egg in the goblin main castle (Gobbleton), each on a shrine with its own guard.
// Grab it (like the princess) and fly it to your lair: it hatches a wingless, serpentine guardian dragon that circles the lair outskirts
// (white: black eyes, ice breath; black: white eyes, lightning breath; they ride opposite each other like yin and yang).
// Guardians last until the player dragon dies (saved). A guardian that is knocked out goes dizzy, puffs away, and its egg reappears at its castle.
const NR_EGG={W:{k:'W',town:'Silverleaf',dx:0,dy:-70,g:[],gT:-99},B:{k:'B',town:'Gobbleton',dx:0,dy:-70,g:[],gT:-99}};
const GD_R=560,GD_W=.32,GD_HP=140,GD_RANGE=480,GD_CD=1.1,GD_SEG=30;
let GD=[];
function eggPos(e){const t=NRT(e.town);return{x:t.x+e.dx,y:t.y+e.dy};}
function eggState(k){return G['nrEgg'+k]||'nest';}
function eggSet(k,s){G['nrEgg'+k]=s;}
function gdMk(k,hp){return{k,hp:hp||GD_HP,maxHp:GD_HP,cd:R(0,1),fx:null,hitT:-9,koT:0,segs:[]};}
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
function eggHatch(k){D.nrEgg=null;eggSet(k,'lair');G['nrGd'+k]=GD_HP;gdSync();sparkle(LAIR.x,LAIR.y-40,26);puff(LAIR.x,LAIR.y-30,10,k==='W'?'rgba(230,240,255,':'rgba(60,50,80,',70,9);
  float(LAIR.x,LAIR.y-90,k==='W'?'A white guardian dragon hatches!':'A black guardian dragon hatches!','#ffe9a0');
  showToast(k==='W'?'🐉 The WHITE guardian dragon (ice breath) now circles your lair!':'🐉 The BLACK guardian dragon (lightning breath) now circles your lair!');try{horn();}catch(e){}}
function eggReturn(k,why){if(D.nrEgg===k)D.nrEgg=null;eggSet(k,'nest');const e=NR_EGG[k];e.gT=-99;if(why)showToast(why);}
// --- guardians ---
function gdUpd(dt){G.nrGdA=((G.nrGdA||0)+GD_W*dt)%TAU;
  for(const g of GD){const h=gdHead(g);g.fx&&(g.fx.t-=dt);if(g.koT>0){g.koT-=dt;if(g.koT<=0){g.dead=true;puff(h.x,h.y-30,12,'rgba(230,230,240,',70,9);G['nrGd'+g.k]=0;eggReturn(g.k,g.k==='W'?'💫 The white guardian puffed away — its egg is back in Silverleaf castle':'💫 The black guardian puffed away — its egg is back in Gobbleton castle');}continue;}
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
  const ko=g.koT>0,pts=[];for(let i=0;i<GD_SEG;i++){const a=a0-i*.036,w=Math.sin(T*4-i*.38)*14;const r=GD_R+w;pts.push({x:LAIR.x+Math.cos(a)*r,y:LAIR.y+Math.sin(a)*r*.78-34-Math.sin(T*3-i*.27)*6});}
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
  if(D.nrEgg){const hh=heightOf(),a=D.ang;nrEggArt(D.x+Math.cos(a)*24,D.y-hh+Math.sin(a)*24+30,D.nrEgg,.8);}
  if(GD.length&&Math.abs(LAIR.x-cam.x)<VW/cam.z/2+GD_R+200&&Math.abs(LAIR.y-cam.y)<VH/cam.z/2+GD_R+200)for(const g of GD)gdDraw(g);}
{const _f=nrDrawFx;nrDrawFx=function(){_f();nrEggFx();};}
// --- save / load: G.nrEggW/B and G.nrGdW/B are plain G fields, so the existing save keeps them; old saves simply have none ---
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);for(const k of ['W','B']){if(typeof G['nrGd'+k]!=='number')G['nrGd'+k]=0;if(!G['nrEgg'+k]||G['nrEgg'+k]==='carried')G['nrEgg'+k]=G['nrGd'+k]>0?'lair':'nest';}gdSync();return r;};}
// --- moving up a castle level is not a death: guardians, eggs at the lair and the wizard's opened barrier carry over ---
{const _nl=nextLevel;nextLevel=function(){const k={nrGdW:G.nrGdW,nrGdB:G.nrGdB,nrEggW:G.nrEggW,nrEggB:G.nrEggB,nrOpen:G.nrOpen,nrOpenT:G.nrOpenT},egg=D.nrEgg;const r=_nl.apply(this,arguments);
  for(const f in k)if(k[f]!==undefined)G[f]=k[f];if(egg){eggSet(egg,'nest');}for(const q of ['W','B'])if(G['nrEgg'+q]==='carried')G['nrEgg'+q]='nest';D.nrEgg=null;gdSync();return r;};}
