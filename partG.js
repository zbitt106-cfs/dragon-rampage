// ======================= GRAPHICS: "High" renderer (cartoon realism, all procedural, no assets) =======================
// Toggle on the title screen (Graphics: HIGH / LOW). Low = the original flat look (fastest).
let GFX_HI=(()=>{try{return localStorage.getItem('dr_gfx')!=='low';}catch(e){return true;}})();
function setGfx(v){GFX_HI=(v===true||v==='high');try{localStorage.setItem('dr_gfx',GFX_HI?'high':'low');}catch(e){}}
const GX={lights:[],fires:[],chunks:new Map(),built:0,baked:new Set()};
function mkCv(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);return c;}
function radialCv(r,stops){const c=mkCv(r*2,r*2),g=c.getContext('2d'),gr=g.createRadialGradient(r,r,0,r,r,r);for(const[o,col]of stops)gr.addColorStop(o,col);g.fillStyle=gr;g.fillRect(0,0,r*2,r*2);return c;}
GX.shadow=radialCv(64,[[0,'rgba(0,0,0,.6)'],[.5,'rgba(0,0,0,.38)'],[1,'rgba(0,0,0,0)']]);
GX.light=radialCv(64,[[0,'rgba(255,255,255,1)'],[.45,'rgba(255,255,255,.55)'],[1,'rgba(255,255,255,0)']]);
GX.glowO=radialCv(64,[[0,'rgba(255,200,110,.95)'],[.3,'rgba(255,130,40,.5)'],[1,'rgba(255,80,0,0)']]);
GX.glowY=radialCv(32,[[0,'rgba(255,255,200,1)'],[.35,'rgba(255,220,60,.6)'],[1,'rgba(255,160,0,0)']]);
GX.glowC=radialCv(64,[[0,'rgba(255,250,220,1)'],[.3,'rgba(255,236,170,.55)'],[1,'rgba(255,220,140,0)']]);
GX.fireY=radialCv(32,[[0,'rgba(255,252,220,1)'],[.4,'rgba(255,214,100,.75)'],[1,'rgba(255,150,30,0)']]);
GX.fireO=radialCv(32,[[0,'rgba(255,196,90,.95)'],[.45,'rgba(255,112,22,.6)'],[1,'rgba(220,50,0,0)']]);
GX.fireR=radialCv(32,[[0,'rgba(232,84,22,.85)'],[.5,'rgba(170,32,10,.4)'],[1,'rgba(110,10,0,0)']]);
GX.puffD=radialCv(32,[[0,'rgba(64,58,54,.8)'],[.55,'rgba(70,64,60,.4)'],[1,'rgba(70,64,60,0)']]);
GX.puffL=radialCv(32,[[0,'rgba(196,186,170,.7)'],[.6,'rgba(176,166,154,.32)'],[1,'rgba(160,150,140,0)']]);
GX.puffG=radialCv(32,[[0,'rgba(120,116,114,.7)'],[.6,'rgba(110,106,104,.3)'],[1,'rgba(100,96,94,0)']]);
// dragon scale tile
{const c=mkCv(14,12),g=c.getContext('2d');g.strokeStyle='rgba(50,0,0,.55)';g.lineWidth=1.1;
  for(const[ox,oy]of[[0,0],[7,6],[14,0],[0,12],[14,12],[-7,6]]){g.beginPath();g.arc(ox+3.5,oy,4,.15*Math.PI,.85*Math.PI);g.stroke();}
  g.strokeStyle='rgba(255,170,140,.35)';g.lineWidth=.8;for(const[ox,oy]of[[0,0],[7,6],[14,0],[0,12],[14,12],[-7,6]]){g.beginPath();g.arc(ox+3.5,oy+1.2,2.6,.3*Math.PI,.7*Math.PI);g.stroke();}
  GX.scalePat=ctx.createPattern(c,'repeat');}
// stone brick tile for the castle
{const c=mkCv(32,16),g=c.getContext('2d');g.fillStyle='rgba(0,0,0,0)';g.strokeStyle='rgba(30,30,40,.35)';g.lineWidth=1;
  g.strokeRect(.5,.5,15,7);g.strokeRect(16.5,.5,15,7);g.strokeRect(-7.5,8.5,15,7);g.strokeRect(8.5,8.5,15,7);g.strokeRect(24.5,8.5,15,7);
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(1,1,14,1.5);g.fillRect(17,1,14,1.5);g.fillRect(9,9,14,1.5);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(3,3,5,3);g.fillRect(20,11,6,3);
  GX.brickPat=ctx.createPattern(c,'repeat');}
// tileable caustic network (Voronoi edges), used for animated water light
{const S=256,c=mkCv(S,S),g=c.getContext('2d'),im=g.createImageData(S,S),pts=[];let sd=77;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
  for(let i=0;i<18;i++)pts.push([rr()*S,rr()*S]);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let d1=1e9,d2=1e9;for(const[px,py]of pts){let dx=Math.abs(x-px),dy=Math.abs(y-py);if(dx>S/2)dx=S-dx;if(dy>S/2)dy=S-dy;const d=dx*dx+dy*dy;if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
    const e=Math.sqrt(d2)-Math.sqrt(d1),v=Math.max(0,1-e/5),k=(y*S+x)*4;im.data[k]=225;im.data[k+1]=246;im.data[k+2]=255;im.data[k+3]=v*v*150;}
  g.putImageData(im,0,0);GX.caustPat=ctx.createPattern(c,'repeat');}

// ---------- day / night ----------
const DAYLEN=300; // seconds per full day
function dayPhase(){return((((G.t||0)+(G.dayOff||0))/DAYLEN)%1+1)%1;}
function nightAmt(){if(!GFX_HI||!G)return 0;const p=dayPhase(),sm=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
  if(p<.6)return 0;if(p<.7)return sm((p-.6)/.1);if(p<.9)return 1;return 1-sm((p-.9)/.1);}
function duskAmt(){if(!GFX_HI||!G)return 0;const p=dayPhase();return Math.max(0,1-Math.abs(p-.63)/.06)+Math.max(0,1-Math.abs(p-.94)/.05)*.7;}
function setDayTime(f){G.dayOff=f*DAYLEN-G.t;}
function shadowK(){return 1-.75*nightAmt();}
function softShadow(x,y,rx,ry,a){if(a<=.01)return;ctx.globalAlpha=a;ctx.drawImage(GX.shadow,x-rx,y-ry,rx*2,ry*2);ctx.globalAlpha=1;}
function addLight(x,y,r,a,warm){GX.lights.push(x,y,r,a,warm?1:0);}
const LEANK=.00045;function leanOf(x){return clamp((x-cam.x)*LEANK,-.4,.4);}
function hsh01(o){if(o._h===undefined)o._h=hsh((o.x*3)|0,(o.y*7)|0);return o._h;}

// ---------- terrain detail chunks (grass tufts, flowers, pebbles, path grit, snow sparkle) + water masks + shore foam ----------
const CHK=512;let TDATA=null,GDATA=null;
function terrCol(x,y){if(x>=20&&y>=20&&x<WW-20&&y<WH-20&&GDATA){const k=((y|0)*WW+(x|0))*4;if(GDATA[k+3]>200)return[GDATA[k],GDATA[k+1],GDATA[k+2]];}
  const W=TERR.width,i=clamp((x-WX0)/TS|0,0,W-1),j=clamp((y-WY0)/TS|0,0,TERR.height-1),k=(j*W+i)*4;return[TDATA[k],TDATA[k+1],TDATA[k+2]];}
function gfxInitData(){if(TDATA)return;TDATA=TERR.getContext('2d').getImageData(0,0,TERR.width,TERR.height).data;try{GDATA=gctx.getImageData(0,0,WW,WH).data;}catch(e){GDATA=null;}}
function buildChunk(ci,cj){gfxInitData();const X0=WX0+ci*CHK,Y0=WY0+cj*CHK,ch={used:0,det:null,wm:null,foam:null};
  const Q=4,M=CHK/Q,pad=3,MW=M+pad*2,mk=new Uint8Array(MW*MW);let anyW=0,anyL=0;
  for(let j=0;j<MW;j++)for(let i=0;i<MW;i++){const x=X0+(i-pad)*Q+2,y=Y0+(j-pad)*Q+2,w=inWater(x,y)?1:0;mk[j*MW+i]=w;if(i>=pad&&j>=pad&&i<M+pad&&j<M+pad){if(w)anyW=1;else anyL=1;}}
  if(anyW){const c=mkCv(M,M),g=c.getContext('2d'),im=g.createImageData(M,M);for(let j=0;j<M;j++)for(let i=0;i<M;i++){im.data[(j*M+i)*4+3]=mk[(j+pad)*MW+i+pad]*255;}g.putImageData(im,0,0);ch.wm=c;}
  if(anyW&&anyL){const c=mkCv(M,M),g=c.getContext('2d'),im=g.createImageData(M,M);
    for(let j=0;j<M;j++)for(let i=0;i<M;i++){if(!mk[(j+pad)*MW+i+pad])continue;let best=9;
      for(let dj=-pad;dj<=pad;dj++)for(let di=-pad;di<=pad;di++){if(!mk[(j+pad+dj)*MW+i+pad+di]){const d=Math.max(Math.abs(di),Math.abs(dj));if(d<best)best=d;}}
      if(best<=pad){const k=(j*M+i)*4;im.data[k]=im.data[k+1]=im.data[k+2]=255;im.data[k+3]=best===1?235:best===2?140:55;}}
    g.putImageData(im,0,0);ch.foam=c;}
  if(anyL){const c=mkCv(CHK,CHK),g=c.getContext('2d');g.translate(-X0,-Y0);g.lineCap='round';let n=0;const ST=17;
    for(let y=Y0+ST/2;y<Y0+CHK;y+=ST)for(let x=X0+ST/2;x<X0+CHK;x+=ST){const h1=hsh(x|0,y|0),h2=hsh((x|0)+7,(y|0)+3),px=x+(h1-.5)*ST,py=y+(h2-.5)*ST;
      if(inWater(px,py))continue;const[r,gg,b]=terrCol(px,py);
      if(r>205&&gg>205&&b>205){if(h1<.07){g.fillStyle='rgba(255,255,255,.9)';g.fillRect(px,py,2,2);g.fillStyle='rgba(160,200,255,.6)';g.fillRect(px+2,py+1,1.5,1.5);}else if(h1>.95){g.fillStyle='#7d7f8c';g.beginPath();g.ellipse(px,py,4,2.5,0,0,TAU);g.fill();}continue;}
      if(gg>r+10&&gg>b+18){ // grass
        if(h1<.55){const bl=3+(h2*3|0),hh=4+h2*5,dk=`rgb(${r*.62|0},${gg*.7|0},${b*.6|0})`,lt=`rgb(${Math.min(255,r*1.22)|0},${Math.min(255,gg*1.25)|0},${b*1.05|0})`;
          for(let k=0;k<bl;k++){const ox=(k-bl/2)*1.6,lean=(hsh(k,x|0)-.5)*4;g.strokeStyle=k%2?lt:dk;g.lineWidth=1.2;g.beginPath();g.moveTo(px+ox,py);g.quadraticCurveTo(px+ox+lean*.3,py-hh*.6,px+ox+lean,py-hh);g.stroke();}n++;}
        else if(h1<.6){const fc=['#fff6f0','#ffd84a','#ff9ac8','#9fc8ff','#e86a6a'][h2*5|0];for(let k=0;k<4;k++){const a=k*Math.PI/2+h2;g.fillStyle=fc;g.beginPath();g.arc(px+Math.cos(a)*1.6,py+Math.sin(a)*1.6,1.3,0,TAU);g.fill();}g.fillStyle='#e8a020';g.beginPath();g.arc(px,py,.9,0,TAU);g.fill();}
        else if(h1<.63){g.fillStyle='rgba(110,104,96,.9)';g.beginPath();g.ellipse(px,py,2.4,1.6,0,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.3)';g.fillRect(px-1.2,py-1.2,1.2,.8);}
        else if(h1>.9){g.fillStyle=`rgba(${r*.8|0},${gg*.85|0},${b*.7|0},.35)`;g.beginPath();g.ellipse(px,py,8,4,h2*3,0,TAU);g.fill();}
        continue;}
      if(r>150&&gg>120&&b<120&&r>gg&&r-b>50&&!(r>200&&gg>180)){ // dirt path grit
        if(h1<.3){g.fillStyle=h2<.5?'rgba(120,96,62,.7)':'rgba(196,172,128,.8)';g.beginPath();g.ellipse(px,py,1.6+h2*1.4,1+h2,0,0,TAU);g.fill();}
        else if(h1<.42){g.strokeStyle='rgba(110,84,50,.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(px-5,py);g.lineTo(px+5,py+(h2-.5)*3);g.stroke();}continue;}
      if(r>190&&gg>170&&b>110){ // sand
        if(h1<.12){g.strokeStyle='rgba(170,150,100,.5)';g.lineWidth=1;g.beginPath();g.arc(px,py+4,6,1.2*Math.PI,1.8*Math.PI);g.stroke();}
        else if(h1<.15){g.fillStyle='#fff0e0';g.beginPath();g.ellipse(px,py,1.8,1.2,0,0,TAU);g.fill();}continue;}
      // rocky / grey-brown ground
      if(h1<.2){const rr=2+h2*4;g.fillStyle=`rgb(${r*.7|0},${gg*.7|0},${b*.72|0})`;g.beginPath();g.ellipse(px+1,py+1,rr,rr*.65,0,0,TAU);g.fill();g.fillStyle=`rgb(${Math.min(255,r*1.15)|0},${Math.min(255,gg*1.15)|0},${Math.min(255,b*1.15)|0})`;g.beginPath();g.ellipse(px-.4,py-.5,rr*.8,rr*.5,0,0,TAU);g.fill();}
      else if(h1<.3){g.strokeStyle='rgba(120,130,70,.7)';g.lineWidth=1;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(px+k*1.5,py);g.lineTo(px+k*2.5,py-4);g.stroke();}}}
    ch.det=c;
    // inside the full-res core map, bake the detail straight into the ground canvas (free to draw afterwards)
    const ix0=Math.max(0,X0),iy0=Math.max(0,Y0),ix1=Math.min(WW,X0+CHK),iy1=Math.min(WH,Y0+CHK);
    if(ix1>ix0&&iy1>iy0){const bk=ci*1000+cj;if(!GX.baked.has(bk)){GX.baked.add(bk);gctx.drawImage(c,ix0-X0,iy0-Y0,ix1-ix0,iy1-iy0,ix0,iy0,ix1-ix0,iy1-iy0);}if(X0>=0&&Y0>=0&&X0+CHK<=WW&&Y0+CHK<=WH)ch.det=null;else ch.part=[ix0,iy0,ix1,iy1];}}
  GX.built++;return ch;}
function getChunk(ci,cj,canBuild){const key=ci*1000+cj;let ch=GX.chunks.get(key);if(!ch&&canBuild){ch=buildChunk(ci,cj);GX.frameBuilds++;GX.chunks.set(key,ch);
    if(GX.chunks.size>72){let ok=null,ou=1e18;for(const[k,v]of GX.chunks)if(v.used<ou){ou=v.used;ok=k;}GX.chunks.delete(ok);}}
  if(ch)ch.used=performance.now();return ch;}
function visChunks(x0,y0,x1,y1,fn){const i0=Math.max(0,Math.floor((x0-WX0)/CHK)),i1=Math.min(Math.ceil((WX1-WX0)/CHK)-1,Math.floor((x1-WX0)/CHK)),j0=Math.max(0,Math.floor((y0-WY0)/CHK)),j1=Math.min(Math.ceil((WY1-WY0)/CHK)-1,Math.floor((y1-WY0)/CHK));
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const budget=GX.frameBuilds<(GX.warm?2:40);const ch=getChunk(i,j,budget);if(!ch)continue;if(!GX.chunks.has(i*1000+j))continue;fn(ch,WX0+i*CHK,WY0+j*CHK);}}
function drawDetailHi(x0,y0,x1,y1){ctx.imageSmoothingEnabled=cam.z<.8;visChunks(x0,y0,x1,y1,(ch,X,Y)=>{if(!ch.det)return;
    if(!ch.part){ctx.drawImage(ch.det,X,Y);return;}const[a,b,c,d]=ch.part; // draw only the strips outside the baked core
    if(b>Y)ctx.drawImage(ch.det,0,0,CHK,b-Y,X,Y,CHK,b-Y);if(d<Y+CHK)ctx.drawImage(ch.det,0,d-Y,CHK,Y+CHK-d,X,d,CHK,Y+CHK-d);
    if(a>X)ctx.drawImage(ch.det,0,b-Y,a-X,d-b,X,b,a-X,d-b);if(c<X+CHK)ctx.drawImage(ch.det,c-X,b-Y,X+CHK-c,d-b,c,b,X+CHK-c,d-b);});ctx.imageSmoothingEnabled=true;GX.warm=1;}

// ---------- animated water: caustics, sky sheen, shore foam ----------
function drawWaterHi(x0,y0,x1,y1){if(GX.gref!==ground||GX.tref!==TERR){GX.gref=ground;GX.tref=TERR;TDATA=GDATA=null;GX.chunks.clear();GX.baked.clear();GX.warm=0;}GX.frameBuilds=0;const z=cam.z,bw=Math.ceil(VW/2),bh=Math.ceil(VH/2);
  if(!GX.wb||GX.wb.width!==bw||GX.wb.height!==bh){GX.wb=mkCv(bw,bh);GX.wm=mkCv(bw,bh);}
  const wg=GX.wb.getContext('2d'),mg=GX.wm.getContext('2d'),T=[z/2,0,0,z/2,bw/2-cam.x*z/2,bh/2-cam.y*z/2];
  mg.setTransform(1,0,0,1,0,0);mg.clearRect(0,0,bw,bh);mg.setTransform(...T);mg.imageSmoothingEnabled=true;let any=0;
  const foams=[];visChunks(x0,y0,x1,y1,(ch,X,Y)=>{if(ch.wm){mg.drawImage(ch.wm,X,Y,CHK,CHK);any=1;}if(ch.foam)foams.push([ch.foam,X,Y]);});
  if(!any)return;
  wg.setTransform(1,0,0,1,0,0);wg.globalCompositeOperation='source-over';wg.clearRect(0,0,bw,bh);
  // sky sheen: soft diagonal light bands drifting slowly
  wg.setTransform(...T);const t=G.t;
  wg.globalAlpha=.9;wg.fillStyle=GX.caustPat;wg.save();wg.translate(t*9,t*5);wg.fillRect(x0-t*9-300,y0-t*5-300,x1-x0+600,y1-y0+600);wg.restore();
  wg.globalAlpha=.55;wg.save();wg.scale(1.7,1.7);wg.translate(-t*6,t*4);wg.fillRect(x0/1.7+t*6-300,y0/1.7-t*4-300,(x1-x0)/1.7+600,(y1-y0)/1.7+600);wg.restore();wg.globalAlpha=1;
  wg.setTransform(1,0,0,1,0,0);wg.globalCompositeOperation='destination-in';wg.drawImage(GX.wm,0,0);wg.globalCompositeOperation='source-over';
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=.6*(1-.5*nightAmt());ctx.drawImage(GX.wb,0,0,VW,VH);ctx.globalAlpha=1;ctx.restore();
  // shore foam, breathing in and out
  const fa=.55+.3*Math.sin(G.t*1.6);ctx.imageSmoothingEnabled=true;
  for(const[c,X,Y]of foams){ctx.globalAlpha=fa;ctx.drawImage(c,X-6,Y-6,CHK+12,CHK+12);ctx.globalAlpha=.35*(1-fa+.3);ctx.drawImage(c,X-14,Y-10,CHK+28,CHK+20);}ctx.globalAlpha=1;
  // sun glints on open water
  ctx.globalCompositeOperation='lighter';for(let y=Math.floor(y0/90)*90;y<y1;y+=90)for(let x=Math.floor(x0/110)*110;x<x1;x+=110){const h=hsh(x,y),ph=Math.sin(G.t*2.2+h*40);if(ph<.75)continue;
    const gx=x+h*90,gy=y+hsh(y,x)*70;if(!inSea(gx,gy)&&!inLake(gx,gy))continue;ctx.globalAlpha=(ph-.75)*3*(1-nightAmt());ctx.drawImage(GX.glowC,gx-7,gy-3,14,6);}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}

// ---------- trees: cached, layered, shaded canopies that sway in the breeze ----------
function blob(g,x,y,r,d,m,l){const gr=g.createRadialGradient(x-r*.35,y-r*.45,r*.1,x,y,r*1.08);gr.addColorStop(0,l);gr.addColorStop(.55,m);gr.addColorStop(1,d);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
function treeSprites(v,fire,pine){const key=`${v}${fire?'f':''}${pine?'p':''}`;if(GX['ts'+key])return GX['ts'+key];const S=2,trunk=mkCv(64*S,64*S),can=mkCv(64*S,64*S);
  let g=trunk.getContext('2d');g.scale(S,S);g.translate(32,58);g.globalAlpha=.5;g.drawImage(GX.shadow,-4,-8,30,14);g.globalAlpha=1;const tg=g.createLinearGradient(-4,0,4,0);tg.addColorStop(0,'#4a3018');tg.addColorStop(.45,'#86603a');tg.addColorStop(1,'#33200e');
  g.fillStyle=tg;g.beginPath();g.moveTo(-4.5,1);g.quadraticCurveTo(-2.4,-8,-2.6,-22);g.lineTo(2.6,-22);g.quadraticCurveTo(2.4,-8,4.5,1);g.closePath();g.fill();
  g.strokeStyle='rgba(30,18,8,.5)';g.lineWidth=.6;for(let k=0;k<3;k++){g.beginPath();g.moveTo(-1.5+k*1.4,0);g.lineTo(-1+k*1.2,-18);g.stroke();}
  g=can.getContext('2d');g.scale(S,S);g.translate(32,58);let sd=v*131+7;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
  const P=fire?[['#4a2410','#7a3c14','#b8642a'],['#5a2c12','#94481a','#d0803a']]:v%2?[['#1d4a1c','#2f6e2a','#5ea040'],['#285a22','#3f8a34','#7cc056']]:[['#183e1e','#2a6230','#4f9448'],['#21502a','#367a3a','#6cb05a']];
  if(pine){for(let k=0;k<4;k++){const w=16-k*3.2,y=-12-k*8,[d,m,l]=P[k%2];const gr=g.createLinearGradient(-w,0,w,0);gr.addColorStop(0,l);gr.addColorStop(.5,m);gr.addColorStop(1,d);g.fillStyle=gr;
      g.beginPath();g.moveTo(-w,y);g.quadraticCurveTo(0,y+3,w,y);g.lineTo(0,y-13);g.closePath();g.fill();}}
  else{const blobs=[];for(let k=0;k<6;k++){const a=k/6*TAU+rr()*.6;blobs.push([Math.cos(a)*9*(.7+rr()*.4),-26+Math.sin(a)*6.5,7.5+rr()*3,0]);}
    for(let k=0;k<4;k++)blobs.push([(rr()-.6)*9,-31+rr()*6,6+rr()*3,1]);blobs.push([-3,-34,5.5,1]);
    // drop shadow inside canopy
    g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(1.5,-21,16,8,0,0,TAU);g.fill();
    for(const[x,y,r,top]of blobs){const[d,m,l]=P[top];blob(g,x,y,r,d,m,l);}
    // leaf speckle
    for(let k=0;k<26;k++){const x=(rr()-.5)*28,y=-38+rr()*22;g.fillStyle=rr()<.55?(fire?'rgba(255,200,120,.35)':'rgba(200,255,160,.28)'):'rgba(0,30,0,.25)';g.beginPath();g.arc(x,y,.9+rr()*1.1,0,TAU);g.fill();}}
  return GX['ts'+key]={trunk,can};}
function pineSnow(){if(GX.pineSnow)return GX.pineSnow;const S=2,c=mkCv(64*S,64*S),g=c.getContext('2d');g.scale(S,S);g.translate(32,58);
  for(let k=0;k<4;k++){const w=16-k*3.2,y=-12-k*8;const gr=g.createLinearGradient(-w,0,w,0);gr.addColorStop(0,'#3c7050');gr.addColorStop(.6,'#2a5a3e');gr.addColorStop(1,'#1a3a28');g.fillStyle=gr;
    g.beginPath();g.moveTo(-w,y);g.quadraticCurveTo(0,y+3,w,y);g.lineTo(0,y-13);g.closePath();g.fill();g.fillStyle='rgba(244,248,255,.95)';g.beginPath();g.moveTo(-w*.55,y-5);g.quadraticCurveTo(-w*.2,y-3,0,y-6);g.quadraticCurveTo(w*.25,y-3,w*.45,y-6);g.lineTo(0,y-13);g.closePath();g.fill();}
  const tg=g.createLinearGradient(-3,0,3,0);tg.addColorStop(0,'#5a3a1e');tg.addColorStop(1,'#2e1c0c');g.fillStyle=tg;g.fillRect(-2.5,-12,5,12);
  return GX.pineSnow=c;}
function drawTreeHi(t){const s=t.s;if(t._v===undefined){t._v=(hsh01(t)*4)|0;t._pine=t.x<forestX(t.y)-150&&hsh01(t)>.55;}
  const sp=treeSprites(t._v,!!t.fire,t._pine),sk=shadowK();
  ctx.save();ctx.translate(t.x,t.y);if(t.state==='falling')ctx.rotate(t.fallA*Math.min(1,t.fallT)**2*Math.PI/2);
  ctx.scale(s,s);ctx.drawImage(sp.trunk,-32,-58,64,64);
  const sw=Math.sin(G.t*1.25+t.x*.013+t.y*.007)*.06+Math.sin(G.t*2.9+t.x*.05)*.02;ctx.transform(1,0,sw,1,0,0);
  if(t.claimed&&t.claimed.state==='chop')ctx.translate(Math.sin(G.t*30)*.8,0);
  ctx.drawImage(sp.can,-32,-58,64,64);ctx.restore();}

// ---------- 2.5D buildings (parallax lean, gabled roofs, lit windows at night) ----------
function shear(x,y,lx){ctx.save();ctx.transform(1,0,-lx,1,x,y);} // local (u,-z) -> screen (x+u+lx*z, y-z)
function qd(p,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fill();}
function shade(hex,k){const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=v=>clamp(Math.round(k>1?v+(255-v)*(k-1):v*k),0,255);return`rgb(${f(r)},${f(g)},${f(b)})`;}
function house(x,y,o){const lx=leanOf(x),P=(gx,gy,z)=>[gx+lx*z,gy-z],w=o.w,dp=o.dp,H=o.H,R=o.R,ov=o.ov||4,xl=x-w/2,xr=x+w/2,yb=y-dp,n=nightAmt();
  softShadow(x+w*.16,y-dp*.25,w*.72,dp*.55+9,.62*shadowK());
  const sxw=lx>0?xl:xr;qd([P(sxw,y,0),P(sxw,yb,0),P(sxw,yb,H),P(sxw,y,H)],shade(o.wall,lx>0?1.12:.62));
  // front wall + gable
  shear(x,y,lx);const gr=ctx.createLinearGradient(0,-H-R,0,0);gr.addColorStop(0,shade(o.wall,1.12));gr.addColorStop(1,shade(o.wall,.8));
  ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(w/2,0);ctx.lineTo(w/2,-H);ctx.lineTo(0,-H-R);ctx.lineTo(-w/2,-H);ctx.closePath();ctx.fill();
  if(o.front)o.front(w,H,R,n);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-w/2,-2,w,2);ctx.restore();
  // roof slopes: lit west slope, shaded east slope, with strand/tile texture
  const L=[P(xl-ov,y+ov,H-3),P(x,y+ov,H+R),P(x,yb-ov,H+R),P(xl-ov,yb-ov,H-3)],Rt=[P(xr+ov,y+ov,H-3),P(x,y+ov,H+R),P(x,yb-ov,H+R),P(xr+ov,yb-ov,H-3)];
  qd(Rt,shade(o.roof,.68));qd(L,shade(o.roof,1.08));
  ctx.strokeStyle=o.fire?'rgba(30,10,0,.5)':'rgba(0,0,0,.18)';ctx.lineWidth=1;
  for(let k=1;k<6;k++){const f=k/6;for(const S of[L,Rt]){const a=[S[1][0]+(S[0][0]-S[1][0])*f,S[1][1]+(S[0][1]-S[1][1])*f],b=[S[2][0]+(S[3][0]-S[2][0])*f,S[2][1]+(S[3][1]-S[2][1])*f];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
  ctx.strokeStyle=shade(o.roof,.5);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(...L[1]);ctx.lineTo(...L[2]);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(...L[0]);ctx.lineTo(...L[1]);ctx.stroke();
  if(o.chimney){const cz=H+R*.45,cx=x+w*.22,cy=y-dp*.6,p=P(cx,cy,cz),q=P(cx,cy,cz+16);qd([[p[0]-4,p[1]],[p[0]+4,p[1]],[q[0]+4,q[1]],[q[0]-4,q[1]]],'#7a6a5e');rect(q[0]-5,q[1]-2,10,3,'#5a4a40');
    if(!o.fire)for(let k=0;k<3;k++){const ph=(G.t*.35+k/3+hsh01(o.s))%1;ctx.globalAlpha=(1-ph)*.55;ctx.drawImage(GX.puffL,q[0]-5-ph*10+Math.sin(G.t+k)*3,q[1]-8-ph*34,10+ph*22,10+ph*22);}ctx.globalAlpha=1;}
  return P;}
function win(x,y,w,h,n,o){const lit=n>.25;rect(x,y,w,h,lit?'#ffd070':'#2a3a4a');if(!lit){rect(x+1,y+1,w*.35,h*.45,'rgba(200,230,255,.45)');}rect(x+w/2-.5,y,1,h,'#3a2614');rect(x,y+h/2-.5,w,1,'#3a2614');
  ctx.strokeStyle='#3a2614';ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);if(lit&&o)o.lit=1;}
function drawStructHi(s){const x=s.x,y=s.y,F=s.fire,o={s,fire:F};let txtAfter=null;
  if(s.kind==='hut'){o.w=50;o.dp=22;o.H=24;o.R=21;o.wall=F?'#8a6a40':'#e6cf9e';o.roof=F?'#4a2e14':'#b08a48';o.chimney=hsh01(s)>.4;
    o.front=(w,H,R,n)=>{ctx.strokeStyle='#5a3a1c';ctx.lineWidth=2.2;ctx.strokeRect(-w/2+1,-H+1,w-2,H-2);ctx.beginPath();ctx.moveTo(-w/2,-H);ctx.lineTo(0,-H-R);ctx.lineTo(w/2,-H);ctx.stroke();
      ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-w/2,-H*.55);ctx.lineTo(-8,-H*.55);ctx.moveTo(8,-H*.55);ctx.lineTo(w/2,-H*.55);ctx.moveTo(-w/2+2,-2);ctx.lineTo(-10,-H+2);ctx.stroke();
      const dg=ctx.createLinearGradient(-6,0,6,0);dg.addColorStop(0,'#6a4424');dg.addColorStop(1,'#3a2410');ctx.fillStyle=dg;ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-6,-13);ctx.arc(0,-13,6,Math.PI,0);ctx.lineTo(6,0);ctx.fill();ell(3.5,-7,.9,.9,'#e8c060');
      win(11,-17,9,8,n,o);win(-w/2+5,-H-R*.35+3,0,0,0);rect(-3,-H-R*.55,6,6,n>.25?'#ffd070':'#3a2a1a');};}
  else if(s.kind==='barn'){o.w=80;o.dp=34;o.H=34;o.R=30;o.wall=F?'#6a2a20':'#b23a2e';o.roof=F?'#3a2a20':'#6e5e50';
    o.front=(w,H,R,n)=>{ctx.strokeStyle='rgba(60,10,6,.35)';ctx.lineWidth=1;for(let u=-w/2+6;u<w/2;u+=6){ctx.beginPath();ctx.moveTo(u,0);ctx.lineTo(u,-H-R*(1-Math.abs(u)/(w/2)));ctx.stroke();}
      rect(-15,-26,30,26,'#f2e8d8');rect(-13,-24,26,24,'#7a2a20');ctx.strokeStyle='#f2e8d8';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-13,-24);ctx.lineTo(13,0);ctx.moveTo(13,-24);ctx.lineTo(-13,0);ctx.stroke();
      rect(-7,-H-R*.5,14,11,n>.25?'#ffd070':'#3a1a14');ctx.strokeStyle='#f2e8d8';ctx.strokeRect(-7,-H-R*.5,14,11);if(n>.25)o.lit=1;ctx.strokeStyle='#f2e8d8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w/2,-H);ctx.lineTo(0,-H-R);ctx.lineTo(w/2,-H);ctx.stroke();};}
  else if(s.kind==='barracks'){o.w=100;o.dp=34;o.H=32;o.R=20;o.wall=F?'#5a4a3a':'#9a8c76';o.roof=F?'#3a2a20':'#4e3e64';
    o.front=(w,H,R,n)=>{ctx.fillStyle=GX.brickPat;ctx.fillRect(-w/2,-H,w,H);rect(-10,-22,20,22,'#3a2a20');ctx.strokeStyle='#2a1a10';ctx.lineWidth=1.5;ctx.strokeRect(-10,-22,20,22);win(-40,-24,10,9,n,o);win(30,-24,10,9,n,o);};
    txtAfter=()=>{line(x+46,y-62,x+46,y-90,'#333',2);poly([x+46,y-90,x+64,y-85+Math.sin(G.t*4)*2,x+46,y-79],'#c22');ctx.fillStyle='#fff';ctx.font='bold 10px Georgia';ctx.textAlign='center';ctx.fillText('Barracks',x,y+16);};}
  else if(s.kind==='cabin'){o.w=60;o.dp=26;o.H=22;o.R=18;o.wall=F?'#5a3a1a':'#7e5634';o.roof=F?'#3a2a1a':'#4e6e36';o.chimney=true;
    o.front=(w,H,R,n)=>{for(let j=2;j<H;j+=5){const g2=ctx.createLinearGradient(0,-j-2.5,0,-j+2.5);g2.addColorStop(0,'#9a6e44');g2.addColorStop(1,'#5a3a1e');ctx.fillStyle=g2;ctx.fillRect(-w/2,-j-2.5,w,5);ell(-w/2,-j,2.5,2.5,'#c89a62');ell(w/2,-j,2.5,2.5,'#c89a62');}
      rect(-6,-14,12,14,'#3a2410');win(14,-16,8,8,n,o);};
    txtAfter=()=>{line(x-28,y-6,x-40,y-20,'#6b4a26',2);ell(x-42,y-22,6,4,'#a07a50');ctx.fillStyle='#ffe';ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.fillText("Hunter's Cabin",x,y-62);};}
  else return false;
  house(x,y,o);if(o.lit)addLight(x,y-14,90,.75,1);if(txtAfter)txtAfter();
  if(F&&s.hp<s.maxHp){rect(x-20,y+8,40,3,'#400');rect(x-20,y+8,40*s.hp/s.maxHp,3,'#f80');}return true;}

// ---------- castle (2.5D towers with cylinder shading, brick walls, lean) ----------
function tower3(x,y,r,h,roof){const lx=leanOf(x),tx=x+lx*h,ty=y-h;softShadow(x+r*.7,y,r*2,r*.9,.6*shadowK());
  const g=ctx.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,'#c8c8ce');g.addColorStop(.3,'#acacb4');g.addColorStop(.75,'#7c7c86');g.addColorStop(1,'#5a5a64');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-r,y);ctx.ellipse(x,y,r,r*.5,0,Math.PI,0,true);ctx.lineTo(tx+r,ty);ctx.lineTo(tx-r,ty);ctx.closePath();ctx.fill();
  ctx.save();ctx.clip();ctx.strokeStyle='rgba(30,30,40,.18)';ctx.lineWidth=1;for(let z=8;z<h;z+=8){ctx.beginPath();ctx.ellipse(x+lx*z,y-z,r,r*.5,0,0,Math.PI);ctx.stroke();}ctx.restore();
  rect(x+lx*h*.5-2,y-h*.55-6,4,10,'#2a2230');
  ell(tx,ty,r,r*.5,'#b8b8be');ell(tx,ty,r*.72,r*.34,'#7a7a82');
  for(let i=0;i<=6;i++){const a=i/6*Math.PI,mx=tx+Math.cos(a)*r*.86,my=ty+Math.sin(a)*r*.43;const c=Math.cos(a);rect(mx-3,my-8,6,8,c>.3?'#8a8a92':c>-.3?'#aaaab2':'#c4c4ca');}
  if(roof){const ax=tx+lx*48,ay=ty-50,rg=ctx.createLinearGradient(tx-r,0,tx+r,0);rg.addColorStop(0,shade(roof,1.35));rg.addColorStop(.4,roof);rg.addColorStop(1,shade(roof,.5));
    ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(tx-r-5,ty-4);ctx.lineTo(ax,ay);ctx.lineTo(tx+r+5,ty-4);ctx.ellipse(tx,ty-4,r+5,(r+5)*.45,0,0,Math.PI);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(tx+k*r*.45,ty-4+(r+5)*.45*Math.sqrt(1-(k*.45)**2));ctx.stroke();}
    line(ax,ay,ax,ay-12,'#333',1.5);poly([ax,ay-12,ax+10,ay-9+Math.sin(G.t*5+x)*1.5,ax,ay-6],'#ffd24a');}
  return[tx,ty];}
function drawCastleHi(){const W=CWALL,th=22,n=nightAmt();
  softShadow((W.x0+W.x1)/2+20,W.y1+6,(W.x1-W.x0)*.55,24,.4*shadowK());
  const wall=(x,y,w,h,face)=>{const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#a6a6ac');g.addColorStop(1,'#84848c');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle=GX.brickPat;ctx.fillRect(x,y,w,h);
    if(face){const fg=ctx.createLinearGradient(0,y+h,0,y+h+14);fg.addColorStop(0,'#77777f');fg.addColorStop(1,'#55555e');ctx.fillStyle=fg;ctx.fillRect(x,y+h,w,14);ctx.fillStyle=GX.brickPat;ctx.fillRect(x,y+h,w,14);}};
  wall(W.x0-th/2,W.y0-th/2,W.x1-W.x0+th,th,1);wall(W.x0-th/2,W.y0,th,W.y1-W.y0);wall(W.x1-th/2,W.y0,th,W.y1-W.y0);wall(W.x0-th/2,W.y1-th/2,W.x1-W.x0+th,th,1);
  rect(W.x0+th/2,W.y0,4,W.y1-W.y0,'rgba(0,0,0,.18)');rect(W.x1-th/2-4,W.y0,4,W.y1-W.y0,'rgba(255,255,255,.08)');
  for(let x=W.x0;x<W.x1;x+=22){rect(x,W.y0-th/2-7,12,8,'#b0b0b6');rect(x,W.y0-th/2+1,12,2,'#7a7a82');if(Math.abs(x-GATE.x)>50){rect(x,W.y1-th/2-7,12,8,'#acacb2');rect(x,W.y1-th/2+1,12,2,'#7a7a82');}}
  // keep: a 2.5D great hall with a gabled slate roof
  house(1610,150,{w:140,dp:60,H:46,R:34,ov:6,wall:'#a2a2a8',roof:'#3f4a7a',front:(w,H,R,nn)=>{ctx.fillStyle=GX.brickPat;ctx.fillRect(-w/2,-H,w,H);
    const dg=ctx.createLinearGradient(-14,0,14,0);dg.addColorStop(0,'#5a3a24');dg.addColorStop(1,'#2a1a10');ctx.fillStyle=dg;ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-14,-22);ctx.arc(0,-22,14,Math.PI,0);ctx.lineTo(14,0);ctx.fill();
    for(const u of[-50,-30,30,50]){rect(u-4,-34,8,14,nn>.25?'#ffd070':'#2a2a3a');}rect(-8,-H-R*.6,16,12,'#c22');poly([-8,-H-R*.6+12,0,-H-R*.6+18,8,-H-R*.6+12],'#c22');}});
  if(n>.25){for(const u of[-50,-30,30,50])addLight(1610+u,120,70,.6,1);}
  addLight(GATE.x-50,GATE.y-40,110,.8,1);addLight(GATE.x+50,GATE.y-40,110,.8,1);
  ctx.fillStyle='#fff';ctx.font='bold 15px Georgia';ctx.textAlign='center';ctx.fillText(`Castle of King Aldric · Level ${G.lvl}`,1600,W.y0-44);
  for(const g of goldPiles){if(g.amt<=0){ell(g.x,g.y,14,6,'rgba(90,70,30,.5)');continue;}const k=Math.min(14,Math.ceil(g.amt/3));softShadow(g.x+4,g.y+3,26,9,.5);
    for(let i=0;i<k;i++){const ang=i*2.4,rr=(i%4)*4,cx=g.x+Math.cos(ang)*rr*1.5,cy=g.y-Math.floor(i/4)*4+Math.sin(ang)*rr*.4,cg=ctx.createRadialGradient(cx-2,cy-1.5,.5,cx,cy,6.5);cg.addColorStop(0,'#fff6b0');cg.addColorStop(.5,i%2?'#ffd84a':'#f0b820');cg.addColorStop(1,'#a87a10');
      ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(cx,cy,6,3.4,0,0,TAU);ctx.fill();}
    ctx.globalCompositeOperation='lighter';const tw=.5+.5*Math.sin(G.t*3+g.x);ctx.globalAlpha=.35+.4*tw;ctx.drawImage(GX.glowY,g.x-14,g.y-16,28,22);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(Math.sin(G.t*3+g.x)>.85){const sx=g.x+R(-8,8),sy=g.y-8;line(sx-3,sy,sx+3,sy,'#fff',1);line(sx,sy-3,sx,sy+3,'#fff',1);}addLight(g.x,g.y,60,.35,1);
    ctx.fillStyle='#ffe58a';ctx.font='bold 10px Georgia';ctx.textAlign='center';ctx.fillText(`${g.amt} gold`,g.x,g.y+18);}
  [[W.x0,W.y0],[W.x1,W.y0],[W.x0,W.y1],[W.x1,W.y1]].forEach(([x,y])=>tower3(x,y+8,26,40,'#3f4a7a'));
  const T=PRINCESS_TOWER;const[tx,ty]=tower3(T.x,T.y+30,20,76,'#d86aa8');
  rect(tx-7,ty+40,14,16,n>.25?'#ffd070':'#2a1a14');if(n>.25)addLight(tx,ty+46,80,.6,1);
  if(PR.state==='tower'){drawPrincess(tx,ty+60,true);if(Math.sin(G.t*1.3)>.3){ctx.fillStyle='#fff';ctx.font='bold 11px Georgia';ctx.textAlign='center';ctx.fillText('Help! A dragon!',tx,ty-74);}}}

// ---------- rocks, peaks, cliffs, pines ----------
function drawRockHi(r){const x=r.x,y=r.y,R2=r.r;softShadow(x+R2*.35,y+R2*.2,R2*1.25,R2*.6,.5*shadowK());
  const g=ctx.createRadialGradient(x-R2*.35,y-R2*.35,R2*.1,x,y,R2*1.05);const base=r.c<.5?[125,116,102]:[143,134,118];g.addColorStop(0,`rgb(${base[0]+50},${base[1]+50},${base[2]+46})`);g.addColorStop(.55,`rgb(${base})`);g.addColorStop(1,`rgb(${base[0]*.55|0},${base[1]*.55|0},${base[2]*.55|0})`);
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,R2,R2*.62,0,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(40,34,28,.35)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-R2*.1,y-R2*.5);ctx.lineTo(x+R2*.05,y-R2*.1);ctx.lineTo(x-R2*.2,y+R2*.2);ctx.stroke();
  if(hsh01(r)>.55){ctx.fillStyle='rgba(90,130,60,.55)';ctx.beginPath();ctx.ellipse(x-R2*.25,y-R2*.38,R2*.45,R2*.16,-.2,0,TAU);ctx.fill();}}
function drawDecorHi(o){const x=o.x,y=o.y,sk=shadowK();
  if(o.k==='peak'){const w=o.w,h=w*o.h,lx=leanOf(x)*.6,ax=x+lx*h;softShadow(x+w*.2,y,w*.62,w*.16,.5*sk);
    const gl=ctx.createLinearGradient(x-w/2,y,ax,y-h);gl.addColorStop(0,'#6c6e7c');gl.addColorStop(1,'#a8aab8');poly([x-w/2,y,ax,y-h,x+w*.06,y],null);ctx.fillStyle=gl;ctx.fill();
    const gr=ctx.createLinearGradient(ax,y-h,x+w/2,y);gr.addColorStop(0,'#5e6070');gr.addColorStop(1,'#3e404c');poly([ax,y-h,x+w/2,y,x+w*.06,y],null);ctx.fillStyle=gr;ctx.fill();
    ctx.strokeStyle='rgba(30,30,40,.25)';ctx.lineWidth=1.5;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(ax+(x-w*.3-ax)*k/4,y-h+h*k/4);ctx.lineTo(ax+(x-w*.05-ax)*k/4+4,y-h+h*k/4+6);ctx.stroke();}
    const sx=t=>ax+(x-w/2-ax)*t,sxr=t=>ax+(x+w/2-ax)*t,sy=t=>y-h+h*t;
    poly([sx(.34),sy(.34),ax,y-h,sxr(.34),sy(.34),sxr(.22)+2,sy(.4),ax+(x+w*.06-ax)*.3,sy(.3),sx(.2),sy(.42)],'#f6f8fd');poly([ax,y-h,sxr(.34),sy(.34),sxr(.22)+2,sy(.4),ax+(x+w*.06-ax)*.3,sy(.3)],'#c6d0e4');return;}
  if(o.k==='cliff'){const r=o.r;softShadow(x+r*.4,y+2,r*1.3,r*.42,.55*sk);const g=ctx.createLinearGradient(x-r,y-r*1.5,x+r,y);g.addColorStop(0,'#aca698');g.addColorStop(1,'#77726a');
    poly([x-r,y,x-r*.7,y-r*1.2,x+r*.2,y-r*1.5,x+r,y-r*.8,x+r*1.05,y],null);ctx.fillStyle=g;ctx.fill();poly([x+r*.2,y-r*1.5,x+r,y-r*.8,x+r*1.05,y,x+r*.3,y],'rgba(40,36,30,.35)');
    poly([x-r*.7,y-r*1.2,x+r*.2,y-r*1.5,x+r*.5,y-r*1.25,x-r*.3,y-r*1.05],'#f4f6fb');return;}
  if(o.k==='pine'){const s=o.s;softShadow(x+5*s,y,15*s,6*s,.5*sk);ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.transform(1,0,Math.sin(G.t*1.1+x*.02)*.04,1,0,0);ctx.drawImage(pineSnow(),-32,-58,64,64);ctx.restore();return;}
  if(o.k==='searock'){softShadow(x+o.r*.3,y+o.r*.15,o.r*1.2,o.r*.55,.35);const g=ctx.createRadialGradient(x-o.r*.3,y-o.r*.3,1,x,y,o.r);g.addColorStop(0,'#aaa498');g.addColorStop(1,'#5a564e');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,o.r,o.r*.55,0,0,TAU);ctx.fill();ctx.strokeStyle=`rgba(255,255,255,${.45+.3*Math.sin(G.t*2+x)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y+2,o.r+4,o.r*.55+3,0,.1*Math.PI,.9*Math.PI);ctx.stroke();return;}
  return false;}

// ---------- people and animal touches ----------
const HAIR=['#3a2a1a','#6a4a2a','#c8a050','#222','#a0522d','#e8d090'];
function personHi(u,x,y,bob,f,sh){const hy=y-12.5+bob*.3,hc=HAIR[(hsh01(u)*6)|0];
  rect(x+.2,y-10+bob*.3,2.6,6.5,'rgba(0,0,0,.2)');rect(x-2.8,y-10+bob*.3,5.6,1,'rgba(255,255,255,.22)');rect(x-2.8,y-6.2+bob*.3,5.6,.9,'#3a2410');
  ctx.fillStyle=hc;ctx.beginPath();ctx.arc(x-f*.3,hy-.3,2.65,Math.PI*1.05,Math.PI*1.95);ctx.fill();rect(x-f*2.3-.6,hy-1,1.2,2.4,hc);
  rect(x+f*1.05-.35,hy-.6,.75,.85,'#1a1010');ell(x+f*1.5,hy+.9,.7,.45,'rgba(230,110,110,.7)');
  const sw=Math.sin(u.anim)*1.4;line(x-f*2.6,y-9+bob*.3,x-f*3.2-sw*.4,y-5.5,sh,1.3);ell(x-f*3.2-sw*.4,y-5.3,.8,.8,'#f0c8a0');}
const FUR={sheep:[0,-5,7,5,'wool'],cow:[0,-6,9,5],chicken:[0,-3,3.5,3],rabbit:[0,-3,4,3,'#d8c8b0'],deer:[0,-7,9,4.2,'#c88a58'],pig:[0,-5,7,4.5],horse:[0,-10,12,5.5,'#b8804a'],boar:[0,-7,10,5.5,'#7a6050'],
  fox:[0,-6,8,3.8,'#f8a868'],wolf:[0,-8,10,4.5,'#b4b8c0'],bear:[0,-12,14,8,'#8a6040'],beaver:[0,-4,7,4.5,'#9a6a40'],goat:[0,-8,8,4.5,'#e0d4bc'],mgoat:[0,-8,8,4.5,'#ffffff'],seal:[0,-4,12,5]};
function furHi(u){const F=FUR[u.species];if(!F||(u.species==='fish'))return;const b=Math.abs(Math.sin(u.anim))*(FAUNA_ART.has(u.species)?1.2:1),x=u.x+F[0],y=u.y+F[1]-b-(u.rear?8:0),rx=F[2],ry=F[3];
  ell(x+rx*.1,y+ry*.4,rx*.85,ry*.45,'rgba(0,0,0,.16)');ell(x-rx*.25,y-ry*.4,rx*.5,ry*.28,'rgba(255,255,255,.25)');
  if(F[4]==='wool'){ctx.strokeStyle='rgba(170,170,160,.7)';ctx.lineWidth=.8;for(let k=0;k<7;k++){const a=k/7*TAU;ctx.beginPath();ctx.arc(x+Math.cos(a)*rx*.62,y+Math.sin(a)*ry*.55,1.8,0,TAU);ctx.stroke();}}
  else if(F[4]){ctx.strokeStyle=F[4];ctx.lineWidth=.8;for(let k=-3;k<=3;k++){const px=x+k*rx*.25,py=y-ry*Math.sqrt(Math.max(0,1-(k*.25)**2))*.9;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-1.2,py-1.8);ctx.stroke();}}}

// ---------- the dragon (gradient scales, veined wings, belly plates, horns, glowing eyes, soft height shadow) ----------
function dragonSil(g,wOpen,flap){g.fillStyle='#000';const e=(x,y,rx,ry)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill();};
  e(0,0,44,23);e(-66,0,34,8);e(-100,0,14,6);e(58,0,22,13);e(40,0,16,10);
  if(wOpen>0){const L=100*wOpen*(.72+.28*flap);for(const s of[-1,1]){g.beginPath();g.moveTo(14,s*15);g.lineTo(-6,s*(15+L*.85));g.lineTo(-36-flap*14*wOpen,s*(15+L));g.lineTo(-46,s*(15+L*.32));g.lineTo(-34,s*16);g.closePath();g.fill();}}
  else{for(const s of[-1,1]){g.beginPath();g.moveTo(16,s*12);g.lineTo(-6,s*24);g.lineTo(-36,s*22);g.lineTo(-30,s*12);g.fill();}}}
function dragonShadowHi(x,y,a,alt,wOpen,flap,h){if(!GX.ds1){GX.ds1=mkCv(120,120);GX.ds2=mkCv(120,120);}const g1=GX.ds1.getContext('2d'),g2=GX.ds2.getContext('2d');
  g1.setTransform(1,0,0,1,0,0);g1.clearRect(0,0,120,120);const sc=.25*DS*(1-.12*alt);g1.setTransform(sc*Math.cos(a),sc*Math.sin(a),-sc*Math.sin(a),sc*Math.cos(a),60,60);dragonSil(g1,wOpen,flap);
  g2.clearRect(0,0,120,120);g2.filter=`blur(${.6+alt*2.6}px)`;g2.drawImage(GX.ds1,0,0);g2.filter='none';
  const sk=shadowK(),over=D.overWater;ctx.globalAlpha=(.48-.24*alt)*sk*(over?.7:1);ctx.drawImage(GX.ds2,x+h*.25-240,y+h*.12-240,480,480);ctx.globalAlpha=1;
  if(over&&alt>.12){ // shimmering reflection on the water
    if(!GX.ds3)GX.ds3=mkCv(120,120);const g3=GX.ds3.getContext('2d');g3.globalCompositeOperation='source-over';g3.clearRect(0,0,120,120);g3.drawImage(GX.ds1,0,0);g3.globalCompositeOperation='source-in';g3.fillStyle='#c84a3a';g3.fillRect(0,0,120,120);g3.globalCompositeOperation='source-over';
    const ry=y+h*.55;ctx.globalAlpha=.2*sk;for(let k=0;k<12;k++){const sy=k*10,off=Math.sin(G.t*4+k*.9)*4;ctx.drawImage(GX.ds3,0,sy,120,10,x-240+off,ry-240+sy*4,480,40);}ctx.globalAlpha=1;}}
function drawDragonHi(x,y,a,alt,h,wOpen,flap){
  dragonShadowHi(x,y,a,alt,wOpen,flap,h);
  ctx.save();ctx.translate(x,y-h+(D.swim?4+Math.sin(G.t*3)*2:0));const k=(1+.18*alt)*DS;ctx.scale(k,k);ctx.rotate(a);
  const hurt=D.hurt>0&&Math.floor(D.hurt*30)%2===0,n=nightAmt();
  const C=hurt?{b:'#e8584a',d:'#a83a30',l:'#ffa08a',bl:'#ffd8a8',w0:'rgba(190,64,50,.96)',w1:'rgba(255,150,120,.78)',v:'rgba(120,30,20,.5)'}:{b:'#b0261c',d:'#560d09',l:'#f2684e',bl:'#f4b860',w0:'rgba(92,12,8,.97)',w1:'rgba(214,72,48,.8)',v:'rgba(50,4,2,.5)'};
  const ca=Math.cos(-a),sa=Math.sin(-a),Lx=-.6*ca+.8*sa,Ly=-.6*sa-.8*ca;
  // tail: outlined, shaded, with ivory ridge spikes and a spade tip
  const sway=Math.sin(G.t*2.5+D.walkT*.5)*.25;ctx.lineCap='round';const tp=[[-34,0]];for(let i=0;i<8;i++)tp.push([-36-(i+1)*10,Math.sin(sway*3+i*.5)*(i+1)*2.2]);
  for(const pass of[0,1,2])for(let i=0;i<8;i++){const w=18-i*2,[ax,ay]=tp[i],[bx,by]=tp[i+1];if(pass===0)line(ax,ay,bx,by,C.d,w+3);else if(pass===1)line(ax,ay,bx,by,C.b,w);else{ctx.globalAlpha=.55;line(ax+Lx*w*.22,ay+Ly*w*.22,bx+Lx*w*.22,by+Ly*w*.22,C.l,w*.32);ctx.globalAlpha=1;}}
  for(let i=1;i<8;i+=1){const[nx,ny]=tp[i],s=5-i*.4;poly([nx+3,ny,nx-s,ny-s*.5,nx-s,ny+s*.5],'#ecdcb0',C.d);}
  const[px,py]=tp[8];{const g=ctx.createLinearGradient(px,py-10,px,py+10);g.addColorStop(0,C.l);g.addColorStop(1,C.d);poly([px+2,py,px-3,py-11,px-21,py,px-3,py+11],null);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=C.d;ctx.lineWidth=1.2;ctx.stroke();}
  // legs with claws
  if(alt<.6&&!D.swim){const la=1-alt/.6,ws=Math.sin(D.walkT)*7*la;ctx.globalAlpha=la;
    [[22,1,ws],[22,-1,-ws],[-22,1,-ws],[-22,-1,ws]].forEach(([lx,s,o])=>{ell(lx+o,s*22,9.5,6.5,C.d);ell(lx+o-1+Lx*2,s*22-1+Ly*2,6,3.6,C.b);[-4,0,4].forEach(c=>{line(lx+o+6,s*22+c,lx+o+12,s*24+c,'#f4eed8',2);ell(lx+o+12,s*24+c,1,1,'#8a8070');});});ctx.globalAlpha=1;}
  // wings: gradient membranes, scalloped trailing edge, bones and veins
  for(const s of[-1,1]){
    if(wOpen<1){const fa=1-wOpen;ctx.globalAlpha=fa;const g=ctx.createLinearGradient(16,s*12,-36,s*22);g.addColorStop(0,C.w0);g.addColorStop(1,C.w1);poly([16,s*12,-6,s*22,-36,s*20,-30,s*12],null);ctx.fillStyle=g;ctx.fill();
      line(16,s*12,-36,s*20,C.d,3);line(-4,s*15,-26,s*19,C.v,1);ctx.globalAlpha=1;}
    if(wOpen>0){const L=100*wOpen*(.72+.28*flap),sw=flap*14*wOpen;ctx.globalAlpha=wOpen;
      const sx=14,sy=s*15,ex=-6+sw*.2,ey=s*(15+L*.85),tx=-36-sw,ty=s*(15+L),f2=[-40,s*(15+L*.55)],f3=[-46,s*(15+L*.32)],b=[-34,s*16];
      const cpt=(p,q,k)=>[(p[0]+q[0])/2+(ex-(p[0]+q[0])/2)*k,(p[1]+q[1])/2+(ey-(p[1]+q[1])/2)*k];
      const g=ctx.createLinearGradient(sx,sy,tx,ty);g.addColorStop(0,C.w0);g.addColorStop(.6,C.w1);g.addColorStop(1,hurt?'rgba(255,190,160,.7)':'rgba(240,110,80,.72)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.lineTo(tx,ty);let c=cpt([tx,ty],f2,.22);ctx.quadraticCurveTo(c[0],c[1],f2[0],f2[1]);c=cpt(f2,f3,.2);ctx.quadraticCurveTo(c[0],c[1],f3[0],f3[1]);c=cpt(f3,b,.12);ctx.quadraticCurveTo(c[0],c[1],b[0],b[1]);ctx.closePath();ctx.fill();
      ctx.strokeStyle=C.v;ctx.lineWidth=1;for(const[qx,qy]of[[tx,ty],f2,f3]){const mx=(ex+qx)/2,my=(ey+qy)/2;ctx.beginPath();ctx.moveTo(mx,my);ctx.quadraticCurveTo(mx-6,my-s*2,(mx+b[0])/2,(my+b[1])/2+s*4);ctx.stroke();}
      line(sx,sy,ex,ey,C.d,4.5);line(ex,ey,tx,ty,C.d,3);line(ex,ey,f2[0],f2[1],C.d,2.2);line(ex,ey,f3[0],f3[1],C.d,2.2);
      ctx.globalAlpha=wOpen*.5;line(sx+Lx,sy+Ly-1,ex+Lx,ey+Ly-1,'#ff9a80',1.2);ctx.globalAlpha=wOpen;
      poly([ex,ey,ex+5,ey+s*3,ex+1,ey+s*6],'#f4eed8');ctx.globalAlpha=1;}}
  // body: shaded volume + scale pattern + rim
  {const g=ctx.createRadialGradient(Lx*16,Ly*9,3,0,0,46);g.addColorStop(0,C.l);g.addColorStop(.5,C.b);g.addColorStop(1,C.d);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,42,22,0,0,TAU);ctx.fill();
    ctx.globalAlpha=.6;ctx.fillStyle=GX.scalePat;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='rgba(40,0,0,.55)';ctx.lineWidth=1.5;ctx.stroke();}
  // ridge plates (the golden "belly" stripe) with segment lines and dorsal spikes
  {const g=ctx.createLinearGradient(0,-11,0,11);g.addColorStop(0,'#a05a20');g.addColorStop(.45,C.bl);g.addColorStop(1,'#8a4a18');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(4,0,30,11,0,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(110,50,14,.65)';ctx.lineWidth=1.2;for(let xi=-22;xi<=30;xi+=5.5){const hh=11*Math.sqrt(Math.max(0,1-((xi-4)/30)**2));ctx.beginPath();ctx.moveTo(xi,-hh);ctx.quadraticCurveTo(xi-3.5,0,xi,hh);ctx.stroke();}
    ctx.globalAlpha=.35;ell(4+Lx*6,Ly*4,20,3.5,'#fff8d8');ctx.globalAlpha=1;}
  for(let i=-3;i<=3;i++){const g=ctx.createLinearGradient(i*10,0,i*10,-7);g.addColorStop(0,'#b88a4a');g.addColorStop(1,'#fff0c8');poly([i*10-4,0,i*10+3,-7,i*10+5,0],null);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(90,40,10,.6)';ctx.lineWidth=.8;ctx.stroke();}
  // neck
  const ny=Math.sin(G.t*2)*2;line(26,0,52,ny,C.d,21);line(26,0,52,ny,C.b,18);ctx.globalAlpha=.5;line(28+Lx*4,Ly*4,50+Lx*4,ny+Ly*4,C.l,5);ctx.globalAlpha=1;
  // head
  ctx.save();ctx.translate(60,ny);
  for(const s of[-1,1]){const hg=ctx.createLinearGradient(-3,s*6,-26,s*20);hg.addColorStop(0,'#7a6448');hg.addColorStop(1,'#fbf4dc');ctx.fillStyle=hg;ctx.beginPath();ctx.moveTo(-2,s*5);ctx.quadraticCurveTo(-12,s*18,-27,s*20);ctx.quadraticCurveTo(-15,s*12,-9,s*10);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(60,40,20,.5)';ctx.lineWidth=.8;ctx.stroke();poly([-11,s*9,-18,s*8,-13,s*5],'#efe4c4');}
  {const g=ctx.createRadialGradient(4+Lx*8,Ly*6,2,4,0,24);g.addColorStop(0,C.l);g.addColorStop(.55,C.b);g.addColorStop(1,C.d);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,17,12,0,0,TAU);ctx.moveTo(24,0);ctx.ellipse(14,0,10,7.5,0,0,TAU);ctx.fill();
    ctx.globalAlpha=.5;ctx.fillStyle=GX.scalePat;ctx.fill();ctx.globalAlpha=1;}
  for(const s of[-1,1]){poly([0,s*11,4,s*15,7,s*10],'#efe4c4');ell(20,s*3,2,1.5,'#300');ctx.strokeStyle=C.d;ctx.lineWidth=2;ctx.beginPath();ctx.arc(4,s*7,4.5,s>0?.2*Math.PI:1.2*Math.PI,s>0?.8*Math.PI:1.8*Math.PI);ctx.stroke();
    const eg=ctx.createRadialGradient(3.4,s*6.4,.3,4,s*7,3.8);eg.addColorStop(0,'#fffbd0');eg.addColorStop(.5,'#ffd31a');eg.addColorStop(1,'#d07a00');ctx.fillStyle=eg;ctx.beginPath();ctx.ellipse(4,s*7,3.6,2.7,0,0,TAU);ctx.fill();
    ell(5,s*7,1,2.1,'#000');ell(3.3,s*6.2,.7,.6,'#fff');}
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.55*n;for(const s of[-1,1])ctx.drawImage(GX.glowY,4-8-n*4,s*7-8-n*4,16+n*8,16+n*8);
  if(D.breath){ctx.globalAlpha=.8;ctx.drawImage(GX.glowO,24-18,-18,36,36);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(D.breath){ell(24,0,6,5,'#ffb020');ell(24,0,3,2.5,'#fff4c0');} if(D.eatT>0){poly([10,-9,28,-12,28,12,10,9],'#400');for(let i=0;i<4;i++){poly([13+i*4,-9.5-i*.5,15+i*4,-6,17+i*4,-10-i*.5],'#fff');poly([13+i*4,9.5+i*.5,15+i*4,6,17+i*4,10+i*.5],'#fff');}}
  ctx.restore();ctx.restore();
  addLight(x,y-h,230,.45,0);if(D.breath)addLight(x+Math.cos(a)*150,y+Math.sin(a)*150-h*.5,200,.9,1);}

// ---------- fire, embers, heat shimmer, smoke plumes, ground light ----------
function gfxPre(x0,y0,x1,y1){GX.lights.length=0;GX.fires.length=0;if(!GFX_HI)return;const F=GX.fires,vis=o=>o.x>x0-80&&o.x<x1+80&&o.y>y0-80&&o.y<y1+160;
  for(const t of trees)if(t.fire&&vis(t))F.push(t.x,t.y,26*t.s,1);for(const s of structures)if(s.fire&&s.state!=='ruin'&&vis(s))F.push(s.x,s.y-6,s.kind==='barn'||s.kind==='barracks'?54:38,2);
  for(let i=0;i<cells.length;i+=2){const c=cells[i];if(c.fire&&vis(c))F.push(c.x,c.y,16,0);}for(const u of units)if(u.burn>0&&!u.dead&&vis(u))F.push(u.x,u.y,12,0);
  // flickering orange light on the ground around every fire
  ctx.globalCompositeOperation='lighter';for(let i=0;i<F.length;i+=4){const r=F[i+2]*2.6*(1+.08*Math.sin(G.t*13+i));ctx.globalAlpha=.42;ctx.drawImage(GX.glowO,F[i]-r,F[i+1]-r*.65,r*2,r*1.3);addLight(F[i],F[i+1],r*1.9,1,1);}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
function gfxTick(dt){if(!GFX_HI)return;const F=GX.fires;if(parts.length>1600)return;
  for(let i=0;i<F.length;i+=4){const x=F[i],y=F[i+1],r=F[i+2],big=F[i+3];
    if(rnd()<dt*(big?7:3))parts.push({x:x+R(-r*.6,r*.6),y:y+R(-4,4),z:R(10,r*1.2),vx:R(-14,14)+8,vy:R(-6,6),vz:R(50,110),life:R(.8,1.8),max:1.8,size:R(1,2.2),kind:'ember'});
    if(big&&rnd()<dt*(big>1?3.5:1.6))parts.push({x:x+R(-r*.4,r*.4),y:y+R(-4,4),z:R(r*.8,r*1.4),vx:R(4,16),vy:R(-3,3),vz:R(22,38),life:R(2.6,4),max:4,size:R(10,18),kind:'plume'});}}
function drawPartsHi(){const vx0=cam.x-VW/cam.z/2-100,vx1=cam.x+VW/cam.z/2+100,vy0=cam.y-VH/cam.z/2-200,vy1=cam.y+VH/cam.z/2+200;
  for(const p of parts){if(p.x<vx0||p.x>vx1||p.y<vy0||p.y>vy1)continue;const l=clamp(p.life/p.max,0,1);
    if(p.kind==='plume'){const age=1-l,r=p.size*(1+age*2.6);ctx.globalAlpha=Math.min(1,l*1.4)*.75;ctx.drawImage(age<.35?GX.puffD:GX.puffG,p.x-r,p.y-p.z-r,r*2,r*2);}
    else if(p.kind==='smoke'){const r=p.size*(1.6-l)*1.5;ctx.globalAlpha=l*.85;ctx.drawImage(GX.puffD,p.x-r,p.y-p.z-r,r*2,r*2);}
    else if(p.kind==='dust'){const r=p.size*(1.6-l)*1.4;ctx.globalAlpha=l*.8;ctx.drawImage(GX.puffL,p.x-r,p.y-p.z-r,r*2,r*2);}}
  ctx.globalAlpha=1;
  // heat shimmer above big fires
  const F=GX.fires;ctx.lineWidth=5;for(let i=0;i<F.length;i+=4){if(!F[i+3])continue;const x=F[i],y=F[i+1],r=F[i+2];
    for(let k=0;k<3;k++){const ph=(G.t*.8+k/3)%1,yy=y-r*.9-ph*r*1.6;ctx.strokeStyle=`rgba(255,240,220,${.1*(1-ph)})`;ctx.beginPath();for(let s=-1;s<=1;s+=.25){const xx=x+s*r*.6,w=Math.sin(G.t*9+s*6+k)*3;if(s===-1)ctx.moveTo(xx,yy+w);else ctx.lineTo(xx,yy+w);}ctx.stroke();}}
  ctx.globalCompositeOperation='lighter';
  for(const p of parts){if(p.kind!=='breath'&&p.kind!=='flame'&&p.kind!=='ember')continue;if(p.x<vx0||p.x>vx1||p.y<vy0||p.y>vy1)continue;const l=clamp(p.life/p.max,0,1);
    if(p.kind==='ember'){const fl=.6+.4*Math.sin(G.t*30+p.x);ctx.globalAlpha=l*fl;const r=p.size*2.4;ctx.drawImage(GX.fireY,p.x-r,p.y-p.z-r,r*2,r*2);continue;}
    const br=p.kind==='breath',r=p.size*(br?(1.6-l*.6)*1.9:(l+.3)*2.1),sp=l>.6?GX.fireY:l>.3?GX.fireO:GX.fireR;ctx.globalAlpha=br?.42+l*.25:.75;ctx.drawImage(sp,p.x-r,p.y-p.z-r,r*2,r*2);}
  ctx.globalAlpha=1;
  // bloom on fires
  for(let i=0;i<F.length;i+=4){const r=F[i+2]*1.7;ctx.globalAlpha=.3+.35*nightAmt();ctx.drawImage(GX.glowO,F[i]-r,F[i+1]-r*1.3,r*2,r*2);}ctx.globalAlpha=1;
  for(const p of parts){if(p.kind!=='sparkle')continue;const l=clamp(p.life/p.max,0,1);ctx.fillStyle=`rgba(140,255,160,${l*.9})`;const sx=p.x,sy=p.y-p.z,r=p.size*l;
    ctx.beginPath();ctx.moveTo(sx,sy-r*2);ctx.lineTo(sx+r*.5,sy);ctx.lineTo(sx,sy+r*2);ctx.lineTo(sx-r*.5,sy);ctx.closePath();ctx.fill();ctx.fillRect(sx-r*2,sy-r*.3,r*4,r*.6);}
  ctx.globalCompositeOperation='source-over';}

// ---------- night lighting, dusk tint, lighthouse lamp, vignette ----------
function gfxPost(){if(!GFX_HI)return;const n=nightAmt(),du=duskAmt(),z=cam.z;
  if(typeof LH!=='undefined')addLight(LH.x,LH.y-150,260,1,1);addLight(LAIR.x,LAIR.y,220,.6,1);
  const bw=Math.ceil(VW/2),bh=Math.ceil(VH/2);
  if(!GX.vig||GX.vig.width!==bw||GX.vig.height!==bh){GX.vig=mkCv(bw,bh);const g=GX.vig.getContext('2d'),gr=g.createRadialGradient(bw/2,bh/2,Math.min(bw,bh)*.42,bw/2,bh/2,Math.hypot(bw,bh)*.58);
    gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,4,0,.48)');g.fillStyle=gr;g.fillRect(0,0,bw,bh);}
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  if(n<=.01){if(du>.01){ctx.fillStyle=`rgba(255,120,50,${.13*Math.min(1,du)})`;ctx.fillRect(0,0,VW,VH);}
    if(!GX.vigF||GX.vigF.width!==VW||GX.vigF.height!==VH){GX.vigF=mkCv(VW,VH);GX.vigF.getContext('2d').drawImage(GX.vig,0,0,VW,VH);}ctx.drawImage(GX.vigF,0,0);ctx.restore();return;}
  // night: one half-res buffer = darkness with holes cut for every light + warm bloom + dusk tint + vignette, blitted once
  if(!GX.lb||GX.lb.width!==bw||GX.lb.height!==bh)GX.lb=mkCv(bw,bh);const lg=GX.lb.getContext('2d'),L=GX.lights;
  lg.setTransform(1,0,0,1,0,0);lg.globalCompositeOperation='source-over';lg.globalAlpha=1;lg.clearRect(0,0,bw,bh);lg.fillStyle=`rgba(10,16,48,${.62*n})`;lg.fillRect(0,0,bw,bh);
  lg.setTransform(z/2,0,0,z/2,bw/2-cam.x*z/2,bh/2-cam.y*z/2);lg.globalCompositeOperation='destination-out';
  for(let i=0;i<L.length;i+=5){const r=L[i+2];lg.globalAlpha=Math.min(1,L[i+3]);lg.drawImage(GX.light,L[i]-r,L[i+1]-r,r*2,r*2);}
  if(typeof LH!=='undefined'){const a=G.t*.9,bx=LH.x,by=LH.y-150;lg.globalAlpha=.75;lg.fillStyle='#fff';lg.beginPath();lg.moveTo(bx,by);lg.arc(bx,by,1400,a-.13,a+.13);lg.closePath();lg.fill();}
  lg.globalCompositeOperation='lighter';for(let i=0;i<L.length;i+=5){if(!L[i+4])continue;const r=L[i+2]*.7;lg.globalAlpha=.3*n*Math.min(1,L[i+3]);lg.drawImage(GX.glowO,L[i]-r,L[i+1]-r,r*2,r*2);}
  lg.setTransform(1,0,0,1,0,0);lg.globalCompositeOperation='source-over';lg.globalAlpha=1;
  if(du>.01){lg.fillStyle=`rgba(255,120,50,${.13*Math.min(1,du)})`;lg.fillRect(0,0,bw,bh);}lg.drawImage(GX.vig,0,0);
  ctx.drawImage(GX.lb,0,0,VW,VH);ctx.restore();}
