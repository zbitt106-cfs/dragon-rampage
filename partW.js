// ======================= the big explorable world: regions, terrain, decor, fog of war =======================
const WX0=-17400,WY0=-2600,WX1=9800,WY1=6200,TS=8; // world bounds (the old kingdom map is the 0..3200 x 0..2200 core)
const coastX=y=>5500+140*Math.sin(y/530)+60*Math.sin(y/190+1);
const coastY=x=>4450+110*Math.sin(x/470)+50*Math.sin(x/170+2);
const frostY=x=>-260+90*Math.sin(x/420)+40*Math.sin(x/150);
const forestX=y=>-180+70*Math.sin(y/310)+30*Math.sin(y/97);
const LAKE={x:1500,y:3300,rx:520,ry:300};
const RIVER=[[1980,3330],[2500,3520],[3000,3470],[3500,3700],[4100,3640],[4700,3880],[5250,3820],[5900,3900]],RIVW=48;
function hsh(i,j){let h=Math.imul(i,374761393)+Math.imul(j,668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function vnoise(x,y){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const a=hsh(i,j),b=hsh(i+1,j),c=hsh(i,j+1),d=hsh(i+1,j+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y){return vnoise(x,y)*.5+vnoise(x*2.1+5,y*2.1+3)*.3+vnoise(x*4.3+9,y*4.3+1)*.2;}
function riverD(x,y){let m=1e9;for(let i=0;i<RIVER.length-1;i++){const[ax,ay]=RIVER[i],[bx,by]=RIVER[i+1],dx=bx-ax,dy=by-ay;
  const t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);const d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<m)m=d;}return m;}
const inLake=(x,y)=>inOasis(x,y)||inLake0(x,y)||(x<-9800&&x>-11400&&inWHole(x,y));
const inLake0=(x,y)=>{const dx=(x-LAKE.x)/LAKE.rx,dy=(y-LAKE.y)/LAKE.ry,a=Math.atan2(dy,dx);return dx*dx+dy*dy<1+.07*Math.sin(a*5)+.04*Math.sin(a*9);};
const LH={x:7350,y:2100,r:290}; // the Lonely Lighthouse island, just before the deep water
const onIsle=(x,y)=>{const dx=x-LH.x,dy=(y-LH.y)*1.25,a=Math.atan2(dy,dx);return dx*dx+dy*dy<(LH.r*(1+.1*Math.sin(a*5)+.06*Math.sin(a*3+1)))**2;};
const seaD=(x,y)=>Math.max(x-coastX(y),y-coastY(x));
const DEEPX=y=>7900+120*Math.sin(y/600); // east of this the Kraken Deep begins
const inSea=(x,y)=>(x>coastX(y)||y>coastY(x))&&!onIsle(x,y);
const inDeep=(x,y)=>x>DEEPX(y)&&inSea(x,y);
const inWater=(x,y)=>inSea(x,y)||inLake(x,y)||riverD(x,y)<RIVW||jriverD(x,y)<JRW;
// ---------- shore safety: no farm, pen, field, paddock or barn may touch water (with a margin of clean sand/grass) ----------
const SHORE_M=40;
function boxWet(x0,y0,x1,y1,m){m=m===undefined?SHORE_M:m;for(let x=x0-m;x<=x1+m;x+=8)for(let y=y0-m;y<=y1+m;y+=8)if(inWater(x,y))return true;return false;}
function inlandBox(b,w,h,ax,ay){ // nudge a footprint {x,y} (top-left) toward (ax,ay) until it is dry
  for(let k=0;k<80&&boxWet(b.x,b.y,b.x+w,b.y+h);k++){const cx=b.x+w/2,cy=b.y+h/2,d=Math.hypot(ax-cx,ay-cy)||1;b.x+=(ax-cx)/d*12;b.y+=(ay-cy)/d*12;}
  b.x=Math.round(b.x);b.y=Math.round(b.y);return b;}
function fixShoreFootprints(){
  for(const f of FARMS){const v=VILLAGES[f.v];inlandBox(f.field,f.field.w,f.field.h,v.x,v.y);inlandBox(f.pen,f.pen.w,f.pen.h,v.x,v.y);
    const bb={x:f.barn.x-40,y:f.barn.y-40};inlandBox(bb,80,60,v.x,v.y);f.barn.x=bb.x+40;f.barn.y=bb.y+40;}
  for(const P of PADDOCKS)inlandBox(P,P.w,P.h,1600,1450);}
fixShoreFootprints();
const onBeach=(x,y)=>!inSea(x,y)&&!onIsle(x,y)&&(x>coastX(y)-170||y>coastY(x)-150);
const REGION_NAMES={farm:'The Kingdom Farmlands',castle:'Castle Aldric',forest:'The Deepwood',hills:'The Rocky Hills',lake:'Mirror Lake & the Silver River',
  mountain:'The Frostpeak Mountains',coast:'The Sapphire Coast',south:'The Southern Farmlands',lair:"Dragon's Roost (home)",sea:'The Sapphire Sea',isle:'The Lonely Lighthouse',deep:'The Kraken Deep',desert:'The Scorching Sands'};
const REGION_SUB={farm:'Villages, farms and fat, tasty livestock',castle:'Gold, guards and Princess Elizabeth locked inside the keep: break its stone roof!',forest:"Deer, boars, wolves, bears and the hunter's cabin",
  hills:'The mine, goats and rocky crags',lake:'Ducks, geese, jumping fish and busy beavers',mountain:'Snowy cliffs, mountain goats, eagles and hawks',
  coast:'Seagulls, crabs and lazy seals',south:'More villages and farms to explore',lair:'Your home base: land here to rest and heal',sea:'Swim or soar: fish, sharks, whales, boats and pirates!',isle:'A quiet rest stop: catch your breath and heal',deep:'Something huge stirs below... the GIANT SQUID',desert:'Dunes, cacti, camels, scorpions… and something under the sand'};
const REGION_LABEL={farm:[1000,1500],castle:[CASTLE.x,CWALL.y0-80],forest:[-1700,1700],hills:[4300,1300],lake:[1250,2960],mountain:[1500,-1500],coast:[5650,2400],south:[700,3500],lair:[LAIR.x,LAIR.y-260],sea:[6500,4900],isle:[7350,2480],deep:[8850,900],desert:[-6600,1150]};
function regionKey(x,y){
  if(d2(x,y,LAIR.x,LAIR.y)<420)return'lair';
  {const dx=x-LH.x,dy=y-LH.y;if(dx*dx+dy*dy<470*470)return'isle';}
  if(inSea(x,y)){if(inDeep(x,y))return'deep';return seaD(x,y)<260?'coast':'sea';}
  if(x>coastX(y)-260||y>coastY(x)-220)return'coast';
  if(y<frostY(x)||inRange(x,y)||x<WX0+650)return'mountain';
  if(x<desW(y))return x<savW(y)?'jungle':'savanna';
  if(x<RANGE0)return'desert';
  if(x>CWALL.x0-100&&x<CWALL.x1+100&&y>CWALL.y0-70&&y<CWALL.y1+190)return'castle';
  if(x<forestX(y))return'forest';
  {const dx=(x-LAKE.x)/(LAKE.rx+260),dy=(y-LAKE.y)/(LAKE.ry+220);if(dx*dx+dy*dy<1||riverD(x,y)<230)return'lake';}
  if((x>3250&&y<3000)||(x>2650&&y>900&&y<1700))return'hills';
  if(y>2250)return'south';
  return'farm';}

// ---------- low-res terrain for the whole world (built once) ----------
let TERR=null,DECOR=[],FARSCORCH=[];
function buildTerrain(){if(TERR)return;const W=(WX1-WX0)/TS|0,H=(WY1-WY0)/TS|0;TERR=document.createElement('canvas');TERR.width=W;TERR.height=H;const g=TERR.getContext('2d');
  const im=g.createImageData(W,H),d=im.data;const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=WX0+i*TS+TS/2,y=WY0+j*TS+TS/2;const n=fbm(x/260,y/260);if(seaD(x,y)>500&&!onIsle(x,y)&&d2(x,y,LH.x,LH.y)>LH.r*1.6){const dd=seaD(x,y),dp=inDeep(x,y);let c=dp?mix([26,62,128],[12,30,78],clamp((x-DEEPX(y))/900,0,1)):mix([60,140,190],[26,70,140],clamp((dd-500)/1500,0,1));c=mix(c,[255,255,255],(n-.5)*.12+.03);const k=(j*W+i)*4;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255;continue;}const wx=x+(fbm(x/700,y/700)-.5)*260,wy=y+(fbm(x/700+40,y/700)-.5)*260;let c;
    if(onIsle(x,y)){const ld=d2(x,y,LH.x,LH.y);c=ld>LH.r*.78?mix([228,210,160],[200,182,130],n):mix([96,140,70],[124,160,84],n);}
    else if(inSea(x,y)&&d2(x,y,LH.x,LH.y)<LH.r*1.6){const dd=Math.max(seaD(x,y),0);c=mix([90,190,205],[30,80,150],clamp((d2(x,y,LH.x,LH.y)-LH.r)/(LH.r*.6),0,1));c=mix(c,[255,255,255],(n-.5)*.12+.03);}
    else if(inSea(x,y)){const dd=Math.max(x-coastX(y),y-coastY(x));c=mix([84,165,200],[26,66,138],clamp(dd/600,0,1));if(dd<22)c=mix([220,240,245],c,dd/22);c=mix(c,[255,255,255],(n-.5)*.12+.03);}
    else if(inLake(x,y)||riverD(x,y)<RIVW||jriverD(x,y)<JRW){const ld=Math.min(riverD(x,y),jriverD(x,y));c=[58,108,172];if(ld<RIVW&&ld>RIVW-8)c=[90,140,190];c=mix(c,[30,70,140],n*.3);}
    else if(onBeach(x,y)){c=mix([230,212,155],[205,185,130],n);}
    else if(wy<frostY(wx)||inRange(wx,wy)||wx<WX0+650){const t=clamp((frostY(wx)-wy)/500,0,1)+(inRange(wx,wy)?clamp(Math.min(wx-RANGE0,RANGE1-wx,passEdge(wx,wy))/260,0,1):0)+(wx<WX0+650?clamp((WX0+650-wx)/300,0,1):0);c=mix([118,132,100],[238,242,250],clamp(t,0,1));if(n>.6)c=mix(c,[130,130,140],.7);}
    else if(wx<RANGE0){c=westCol(x,y,wx,wy,n);}
    else if(wx<forestX(wy)){c=mix([40,76,36],[58,96,44],n);}
    else if((wx>3250&&wy<3000)||(wx>2650&&wy>900&&wy<1700&&x>2600)){c=mix([112,132,82],[146,130,106],clamp(n*1.6-.3,0,1));}
    else{c=mix([86,134,56],[112,158,70],n);if(fbm(x/900+7,y/900)>.66)c=mix(c,[132,160,74],.5);}
    // muddy shores
    if(!inWater(x,y)){const ldx=(x-LAKE.x)/(LAKE.rx*1.1),ldy=(y-LAKE.y)/(LAKE.ry*1.1);if(ldx*ldx+ldy*ldy<1.05||riverD(x,y)<RIVW+16)c=mix(c,[74,100,56],.6);else if(x<-9800&&(jriverD(x,y)<JRW+18||(x>-11400&&inWHole(x,y,1.3))))c=mix(c,[96,84,52],.65);}
    const k=(j*W+i)*4;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255;}
  g.putImageData(im,0,0);
  // roads, plazas, fields & clearings outside the detailed core map (painted at low res)
  g.save();g.setTransform(1/TS,0,0,1/TS,-WX0/TS,-WY0/TS);g.beginPath();g.rect(WX0,WY0,WX1-WX0,WY1-WY0);g.rect(30,30,WW-60,WH-60);g.clip('evenodd');
  // Castle Aldric's grounds (south-central, outside the detailed core ground canvas)
  g.fillStyle='#6b7a5a';g.fillRect(CWALL.x0-50,CWALL.y0-50,CWALL.x1-CWALL.x0+100,CWALL.y1-CWALL.y0+90);
  g.fillStyle='#b3a487';g.fillRect(CWALL.x0,CWALL.y0,CWALL.x1-CWALL.x0,CWALL.y1-CWALL.y0);
  strokeRoads(g);const V=VILLAGES;
  for(let i=5;i<V.length;i++){const v=V[i];g.fillStyle='#a8915f';g.beginPath();g.ellipse(v.x,v.y,120,90,0,0,TAU);g.fill();}
  FARMS.forEach(f=>{const F=f.field;g.fillStyle='#7a5a32';g.fillRect(F.x-4,F.y-4,F.w+8,F.h+8);const P=f.pen;g.fillStyle='#7fa84a';g.fillRect(P.x,P.y,P.w,P.h);});
  PADDOCKS.forEach(P=>{g.fillStyle='#86ad52';g.fillRect(P.x,P.y,P.w,P.h);});
  g.fillStyle='rgba(30,60,26,.6)';g.beginPath();g.ellipse(CABIN.x,CABIN.y,110,80,0,0,TAU);g.fill();g.fillStyle='#8a7a62';g.beginPath();g.ellipse(CABIN.x+10,CABIN.y+20,70,45,0,0,TAU);g.fill();
  g.fillStyle='#8c8e98';g.beginPath();g.ellipse(LAIR.x,LAIR.y+40,330,250,0,0,TAU);g.fill();g.fillStyle='#e8eef6';g.beginPath();g.ellipse(LAIR.x,LAIR.y+40,260,190,0,0,TAU);g.fill();g.fillStyle='#6e6a66';g.beginPath();g.ellipse(LAIR.x,LAIR.y,150,100,0,0,TAU);g.fill();
  g.restore();
  // decor (purely visual, never blocks movement)
  let s=4242;const r=()=>{s=Math.imul(s^s>>>15,2246822519)+0x9E3779B9|0;return((s^s>>>13)>>>0)/4294967296;},Rr=(a,b)=>a+r()*(b-a);DECOR=[];
  for(let y=WY0+100;y<-1050;y+=200)for(let x=WX0+60;x<WX1;x+=230+Rr(-40,40)){const xx=x+Rr(-60,60),yy=y+Rr(-60,60);if(!inSea(xx,yy)&&!(Math.abs(xx-LAIR.x)<480&&yy>LAIR.y-320&&yy<LAIR.y+760))DECOR.push({k:'peak',x:xx,y:yy,w:Rr(200,360),h:Rr(.7,1)});}
  for(let y=-1000;y<WY1-300;y+=210)for(let x=WX0+40;x<WX0+640;x+=200)DECOR.push({k:'peak',x:x+Rr(-50,50),y:y+Rr(-50,50),w:Rr(180,300),h:Rr(.6,.9)});
  for(let y=-1000;y<coastY(-3300)-150;y+=190)for(let x=RANGE0+90;x<RANGE1-60;x+=190){const xx=x+Rr(-40,40),yy=y+Rr(-40,40);if(inRange(xx,yy)&&passEdge(xx,yy)>90)DECOR.push({k:'peak',x:xx,y:yy,w:Rr(170,280),h:Rr(.6,.9)});}
  addDesertDecor(r,Rr);
  for(let i=0;i<90;i++){const x=Rr(-2800,5200),y=Rr(-1000,-320);if(y<frostY(x)-60)DECOR.push({k:'cliff',x,y,r:Rr(30,55)});}
  for(let i=0;i<220;i++){const x=Rr(-2900,5300),y=Rr(-1050,-150);if(y<frostY(x)+20)DECOR.push({k:'pine',x,y,s:Rr(.8,1.3)});}
  for(let i=0;i<70;i++){const a=Rr(0,TAU),x=LAKE.x+Math.cos(a)*LAKE.rx*Rr(1.02,1.12),y=LAKE.y+Math.sin(a)*LAKE.ry*Rr(1.02,1.12);DECOR.push({k:'reed',x,y});}
  for(let i=0;i<40;i++){const p=RIVER[RI(0,RIVER.length-2)],q=RIVER[RIVER.indexOf(p)+1],t=r();const x=p[0]+(q[0]-p[0])*t,y=p[1]+(q[1]-p[1])*t+(r()<.5?-1:1)*(RIVW+10);DECOR.push({k:'reed',x,y});}
  for(let i=0;i<14;i++){const y=Rr(0,4200);DECOR.push({k:'searock',x:coastX(y)-Rr(10,90),y,r:Rr(18,32)});}
  for(let i=0;i<6;i++){const x=Rr(500,5000);DECOR.push({k:'searock',x,y:coastY(x)-Rr(10,80),r:Rr(18,30)});}
  DECOR.push({k:'lodge',x:LAKE.x-LAKE.rx*.9,y:LAKE.y+LAKE.ry*.45},{k:'lodge',x:3300,y:3600-RIVW});
  DECOR.push({k:'sign',x:LAIR.x-170,y:LAIR.y+150});addIsleDecor();}
function drawDecor(o){const x=o.x,y=o.y;if((o.k==='cactus'||o.k==='palm'||o.k==='mesa'||o.k==='bones')&&drawDesertDecor(o))return;if(GFX_HI&&drawDecorHi(o)!==false)return;if(o.k==='lighthouse'){drawLighthouse(o);return;}if(o.k==='dock'){drawDock(o);return;}if(o.k==='isrock'){drawSeaRock(o);return;}
  if(o.k==='peak'){const w=o.w,h=w*o.h;ell(x,y+4,w*.55,w*.14,'rgba(0,0,0,.2)');poly([x-w/2,y,x,y-h,x+w/2,y],'#7d7f8c');poly([x,y-h,x+w/2,y,x+w*.08,y],'#666874');
    poly([x-w*.17,y-h*.66,x,y-h,x+w*.17,y-h*.66,x+w*.07,y-h*.6,x,y-h*.68,x-w*.08,y-h*.6],'#f4f6fb');}
  else if(o.k==='cliff'){const r=o.r;ell(x,y+3,r*1.1,r*.35,'rgba(0,0,0,.25)');poly([x-r,y,x-r*.7,y-r*1.2,x+r*.2,y-r*1.5,x+r,y-r*.8,x+r*1.05,y],'#8a8578');poly([x+r*.2,y-r*1.5,x+r,y-r*.8,x+r*1.05,y,x+r*.3,y],'#6f6a60');
    poly([x-r*.7,y-r*1.2,x+r*.2,y-r*1.5,x+r*.5,y-r*1.25,x-r*.3,y-r*1.05],'#f2f4f8');}
  else if(o.k==='pine'){const s=o.s;ell(x,y+2,12*s,4*s,'rgba(0,0,0,.22)');rect(x-2*s,y-8*s,4*s,8*s,'#5a3a1e');poly([x-14*s,y-6*s,x,y-38*s,x+14*s,y-6*s],'#2f5a3c');poly([x-9*s,y-22*s,x,y-38*s,x+9*s,y-22*s],'#eef3f8');}
  else if(o.k==='reed'){for(let i=-1;i<=1;i++)line(x+i*3,y,x+i*4+Math.sin(G.t*2+x)*1.5,y-14,'#6a7a30',1.5);ell(x+4,y-13,1.6,3.5,'#6a4a2a');}
  else if(o.k==='boat'){const b=Math.sin(G.t*1.5+x)*2;ell(x,y+4,30,7,'rgba(0,0,0,.15)');poly([x-26,y-4+b,x+26,y-4+b,x+18,y+5+b,x-18,y+5+b],'#7a4a24');line(x,y-4+b,x,y-44+b,'#5a3a1a',2);poly([x+1,y-42+b,x+1,y-10+b,x+20,y-12+b],'#f2eee0');}
  else if(o.k==='searock'){ell(x,y,o.r,o.r*.55,'#7a7468');ell(x-o.r*.2,y-o.r*.2,o.r*.5,o.r*.25,'rgba(255,255,255,.18)');}
  else if(o.k==='lodge'){ell(x,y,30,16,'#6a4a28');for(let i=0;i<9;i++)line(x-26+i*6,y+6,x-20+i*5,y-14,'#4a3018',3);}
  else if(o.k==='sign'){rect(x-2,y-24,4,24,'#5a3a1a');rect(x-26,y-36,52,16,'#8a6a3a');txt('HOME',x,y-24,10,'#ffd27a','center');}}
// animated surf + ocean waves in view
function drawWater(x0,y0,x1,y1){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;
  for(let y=Math.floor(y0/120)*120;y<y1;y+=120)for(let x=Math.floor(x0/160)*160;x<x1;x+=160){const xx=x+((y*7)%80),yy=y+Math.sin(G.t+x*.01)*6;if(!inSea(xx,yy))continue;
    ctx.beginPath();ctx.arc(xx,yy,14,Math.PI*1.1,Math.PI*1.9);ctx.stroke();}}
function scorchFar(x,y,r){FARSCORCH.push({x,y,r});if(FARSCORCH.length>350)FARSCORCH.shift();}

// ---------- fog of war ----------
const FG=200,FW=Math.ceil((WX1-WX0)/FG),FH=Math.ceil((WY1-WY0)/FG);let FOG=null,fogCv=null,fogDirty=true;
function initFog(){FOG=new Uint8Array(FW*FH);fogCv=document.createElement('canvas');fogCv.width=FW;fogCv.height=FH;revealAt(D.x,D.y,1200);revealAt(LAIR.x,LAIR.y,500);}
function revealAt(x,y,r){const i0=Math.floor((x-r-WX0)/FG),i1=Math.floor((x+r-WX0)/FG),j0=Math.floor((y-r-WY0)/FG),j1=Math.floor((y+r-WY0)/FG);
  for(let j=Math.max(0,j0);j<=Math.min(FH-1,j1);j++)for(let i=Math.max(0,i0);i<=Math.min(FW-1,i1);i++){const cx=WX0+(i+.5)*FG,cy=WY0+(j+.5)*FG;if(d2(cx,cy,x,y)<r&&!FOG[j*FW+i]){FOG[j*FW+i]=1;fogDirty=true;}}}
function seen(x,y){const i=Math.floor((x-WX0)/FG),j=Math.floor((y-WY0)/FG);return i>=0&&j>=0&&i<FW&&j<FH&&FOG[j*FW+i]===1;}
function fogImage(){if(fogDirty){const g=fogCv.getContext('2d'),im=g.createImageData(FW,FH);for(let k=0;k<FW*FH;k++){im.data[k*4]=14;im.data[k*4+1]=16;im.data[k*4+2]=24;im.data[k*4+3]=FOG[k]?0:235;}g.putImageData(im,0,0);fogDirty=false;}return fogCv;}
function exploredPct(){let n=0;for(let k=0;k<FOG.length;k++)n+=FOG[k];return Math.round(n/FOG.length*100);}

// ---------- region banners, discovery bonus and the lair home base ----------
function updWorld(dt){
  G.fogT=(G.fogT||0)-dt;if(G.fogT<=0){G.fogT=.25;revealAt(D.x,D.y,D.alt>.5?1250:850);}
  const k=regionKey(D.x,D.y);if(k!==G.regCand){G.regCand=k;G.regCandT=0;}else G.regCandT+=dt;
  if(G.regCandT>.5&&k!==G.region){G.region=k;const first=!G.visited[k];G.visited[k]=1;if(first&&G.t>1){G.stats.regions=(G.stats.regions||0)+1;}
    G.regBanner={k,t:3.2,first:first&&G.t>1};}
  if(G.regBanner){G.regBanner.t-=dt;if(G.regBanner.t<=0)G.regBanner=null;}
  // resting at home: walk into the lair to heal and recover stamina
  if(!G.over&&!G.won&&D.alt<.3&&d2(D.x,D.y,LAIR.x,LAIR.y)<170){if(D.hp<D.maxHp){D.hp=Math.min(D.maxHp,D.hp+(G.easy?12:8)*dt);D.healFx=Math.max(D.healFx||0,.15);}D.st=Math.min(D.maxSt,D.st+25*dt);
    if(!G.homeMsgT||G.t-G.homeMsgT>12){G.homeMsgT=G.t;float(D.x,D.y-90,'Home sweet lair: resting heals you','#9fffa8');}}
  // soft world edges: the far ocean and the northern peaks gently push the dragon back
  const push=(v,a,b)=>v<a?(a-v):v>b?(b-v):0;const px=push(D.x,WX0+220,WX1-220),py=push(D.y,WY0+260,WY1-220);
  if(px||py){D.x+=px*2*dt;D.y+=py*2*dt;if(!G.edgeMsgT||G.t-G.edgeMsgT>6){G.edgeMsgT=G.t;float(D.x,D.y-90,D.y<WY0+400?'The peaks are too high to cross!':D.x<WX0+400?'Endless crags block the way':'The open sea stretches forever...','#cfe8ff');}}}
function drawRegionBanner(){const b=G.regBanner;if(!b)return;const al=clamp(Math.min(b.t,3.2-b.t)*2.5,0,1),sm=VW<760;ctx.globalAlpha=al;const y=(sm?150:132)+(typeof gateBroken==='function'&&gateBroken()&&!sm?26:0)+(typeof raidHudOn==='function'&&raidHudOn()&&!sm?24:0);
  const name=REGION_NAMES[b.k];ctx.font=`bold ${sm?18:26}px Georgia`;const w=Math.max(ctx.measureText(name).width+70,sm?260:380);
  ctx.fillStyle='rgba(20,24,40,.72)';ctx.fillRect(VW/2-w/2,y-30,w,b.first?74:58);ctx.strokeStyle='rgba(255,215,120,.7)';ctx.strokeRect(VW/2-w/2+.5,y-29.5,w-1,(b.first?74:58)-1);
  txt(`~ ${name} ~`,VW/2,y,sm?18:26,'#ffe6a0','center');txt(REGION_SUB[b.k],VW/2,y+20,sm?11:13,'#ddd','center',false);if(b.first)txt('New region discovered! +100',VW/2,y+38,sm?11:13,'#9fffa8','center');ctx.globalAlpha=1;}
// cheap far simulation: units far from the dragon think 1/8 as often (with the saved-up time)
function farTick(u,dt){if(Math.abs(u.x-D.x)<1700&&Math.abs(u.y-D.y)<1300)return dt;u.acc=(u.acc||0)+dt;if(u.slot8===undefined)u.slot8=RI(0,7);
  if(((G.fc+u.slot8)&7)!==0)return 0;const a=Math.min(u.acc,.4);u.acc=0;return a;}
