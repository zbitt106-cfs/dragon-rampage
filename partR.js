// ======================= road network: A* routed around every pond, lake and the sea; rivers crossed only at the bridges =======================
const RC=40;let ROADS=null,RGRAPH=null;
const pondHit=(x,y,m)=>PONDS.some(p=>{const dx=(x-p.x)/(p.rx+m),dy=(y-p.y)/(p.ry+m);return dx*dx+dy*dy<1;});
// true if a road of half-width m would get wet here (sea, Mirror Lake, ponds, the oasis or the river)
function roadWet(x,y,m){if(pondHit(x,y,m))return true;if(riverD(x,y)<RIVW+m)return true;
  if(inWater(x,y))return true;for(let k=0;k<8;k++){const a=k*Math.PI/4;if(inSea(x+Math.cos(a)*m,y+Math.sin(a)*m)||inLake(x+Math.cos(a)*m,y+Math.sin(a)*m))return true;}return false;}
const castleBox=(x,y)=>x>CWALL.x0-30&&x<CWALL.x1+30&&y>CWALL.y0-40&&y<CWALL.y1-6;
const roadBad=(x,y,m)=>x<WX0+700||x>WX1-60||y<WY0+60||y>WY1-60||y<frostY(x)+20||inRange(x,y)||castleBox(x,y)||roadWet(x,y,m);
function bridgeSpot(i,j){const a=VILLAGES[i],b=VILLAGES[j];let best=null,bd=1e9;
  for(let k=0;k<=400;k++){const t=k/400,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,d=riverD(x,y);if(d<bd){bd=d;best={x,y};}}
  const ang=Math.atan2(b.y-a.y,b.x-a.x),h=(2*RIVW+44)/2+14,p={x:best.x-Math.cos(ang)*h,y:best.y-Math.sin(ang)*h},q={x:best.x+Math.cos(ang)*h,y:best.y+Math.sin(ang)*h};
  return{x:best.x,y:best.y,ang,a:p,b:q};} // a = end on village i's side
function roadGrid(){const W=Math.ceil((WX1-WX0)/RC),H=Math.ceil((WY1-WY0)/RC),bad=new Uint8Array(W*H),near=new Uint8Array(W*H);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=WX0+(i+.5)*RC,y=WY0+(j+.5)*RC;if(roadBad(x,y,30))bad[j*W+i]=1;else if(roadWet(x,y,90))near[j*W+i]=1;}return{W,H,bad,near};}
function astar(Gd,a,b){const{W,H,bad,near}=Gd,cell=p=>{let i=clamp((p.x-WX0)/RC|0,0,W-1),j=clamp((p.y-WY0)/RC|0,0,H-1);
    if(bad[j*W+i]){let best=-1,bd=1e9;for(let r=1;r<6&&best<0;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){const ii=i+di,jj=j+dj;if(ii<0||jj<0||ii>=W||jj>=H||bad[jj*W+ii])continue;const d=di*di+dj*dj;if(d<bd){bd=d;best=jj*W+ii;}}return best;}return j*W+i;};
  const s=cell(a),t=cell(b);if(s<0||t<0)return null;const N=W*H,g=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),closed=new Uint8Array(N);
  const tx=t%W,ty=t/W|0,hq=[],hf=[];const push=(n,f)=>{hq.push(n);hf.push(f);let k=hq.length-1;while(k>0){const p=(k-1)>>1;if(hf[p]<=hf[k])break;[hq[p],hq[k]]=[hq[k],hq[p]];[hf[p],hf[k]]=[hf[k],hf[p]];k=p;}};
  const pop=()=>{const n=hq[0],ln=hq.pop(),lf=hf.pop();if(hq.length){hq[0]=ln;hf[0]=lf;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<hq.length&&hf[l]<hf[m])m=l;if(r<hq.length&&hf[r]<hf[m])m=r;if(m===k)break;[hq[m],hq[k]]=[hq[k],hq[m]];[hf[m],hf[k]]=[hf[k],hf[m]];k=m;}}return n;};
  g[s]=0;push(s,0);const D8=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  while(hq.length){const n=pop();if(n===t)break;if(closed[n])continue;closed[n]=1;const x=n%W,y=n/W|0;
    for(const[dx,dy,c]of D8){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const m=yy*W+xx;if(bad[m]||closed[m])continue;if(dx&&dy&&(bad[y*W+xx]||bad[yy*W+x]))continue;
      const ng=g[n]+c*(near[m]?1.5:1);if(ng<g[m]){g[m]=ng;from[m]=n;push(m,ng+Math.hypot(xx-tx,yy-ty));}}}
  if(from[t]<0&&s!==t)return null;const out=[];for(let n=t;n>=0;n=from[n]){out.push({x:WX0+(n%W+.5)*RC,y:WY0+((n/W|0)+.5)*RC});if(n===s)break;}out.reverse();return[a,...out,b];}
function segOK(a,b,m){const L=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(L/8));for(let k=0;k<=n;k++){const x=a.x+(b.x-a.x)*k/n,y=a.y+(b.y-a.y)*k/n;if(roadBad(x,y,m))return false;}return true;}
function pullStr(P,m){const out=[P[0]];let i=0;while(i<P.length-1){let j=Math.min(P.length-1,i+40);while(j>i+1&&!segOK(P[i],P[j],m))j--;out.push(P[j]);i=j;}return out;}
function chaikin(P,m){for(let it=0;it<3;it++){const Q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];Q.push({x:a.x*.75+b.x*.25,y:a.y*.75+b.y*.25},{x:a.x*.25+b.x*.75,y:a.y*.25+b.y*.75});}Q.push(P[P.length-1]);
    let ok=true;for(let i=1;i<Q.length-2&&ok;i++)if(!segOK(Q[i],Q[i+1],m))ok=false;if(!ok)break;P=Q;}return P;}
function routeRoad(Gd,a,b,w,kind){const raw=astar(Gd,a,b);if(!raw)return null;let P=pullStr(raw,18);P=chaikin(P,18);return{pts:P,w,kind};}
function buildRoads(){if(ROADS)return ROADS;const t0=performance.now(),Gd=roadGrid(),V=VILLAGES,R0=[];
  const add=(a,b,w,kind)=>{const r=routeRoad(Gd,a,b,w||26,kind||'main');if(r)R0.push(r);else console.warn('road failed',a,b);return r;};
  const N={GATE:{x:GATE.x,y:GATE.y+20},CAMP:{x:CAMP.x+30,y:CAMP.y+40},MINE:{x:MINE.x-40,y:MINE.y+70},CABIN:{x:CABIN.x+10,y:CABIN.y+30},STONE:{x:STONEPILE_POS.x,y:STONEPILE_POS.y+30}};
  // the main tree: everything converges on the castle gate
  [[N.GATE,V[2]],[N.GATE,V[0]],[N.GATE,V[1]],[V[2],V[3]],[V[2],V[4]],[V[3],V[5]],[V[5],V[7]],[V[4],V[6]],[V[1],V[9]],[V[9],V[10]],[V[0],N.CAMP],[V[1],N.MINE],[V[7],V[8]]].forEach(([a,b])=>add(a,b));
  add(V[4],N.STONE,20);add(N.CAMP,N.CABIN,16,'path');
  // river crossings go over the bridges
  for(const[i,j]of BRIDGE_ROADS){const B=bridgeSpot(i,j);add(V[i],B.a);add(B.b,V[j]);R0.push({pts:[B.a,B.b],w:26,kind:'bridge',bx:B.x,by:B.y});}
  // the long caravan road west through the Sandgate Pass to Sandhaven and the oasis
  if(typeof DTOWN!=='undefined'){add(V[5],PASS_E0());add(PASS_E0(),PASS_W0(),24);add(PASS_W0(),DTOWN);add(DTOWN,{x:OASIS.x+OASIS.rx+60,y:OASIS.y},20);}
  // short spurs: farm barns and markets
  for(const f of FARMS){const v=V[f.v];if(v)add(v,{x:f.barn.x,y:f.barn.y+30},14,'spur');}
  for(const M of MARKETS){const v=V[M.v];if(v&&dist(v,M)>60)add(v,M,16,'spur');}
  ROADS=R0;RGRAPH=null;ROADS.ms=Math.round(performance.now()-t0);return ROADS;}
const PASS_E0=()=>({x:RANGE1+160,y:(passY0(RANGE1+160)+passY1(RANGE1+160))/2}),PASS_W0=()=>({x:RANGE0-160,y:(passY0(RANGE0-160)+passY1(RANGE0-160))/2});
function strokeRoads(g){buildRoads();g.lineCap='round';g.lineJoin='round';
  const path=r=>{g.beginPath();r.pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));};
  for(const r of ROADS){if(r.kind==='bridge')continue;g.strokeStyle=r.kind==='path'?'#8a7a52':'#a48a5c';g.lineWidth=r.w;path(r);g.stroke();}
  for(const r of ROADS){if(r.kind==='bridge'||r.kind==='path')continue;g.strokeStyle='#b89c6a';g.lineWidth=r.w*.5;path(r);g.stroke();}
  g.fillStyle='#a8915f';g.beginPath();g.ellipse(GATE.x,GATE.y+30,70,40,0,0,TAU);g.fill();}
// ---------- road graph for troops ----------
function roadGraph(){if(RGRAPH)return RGRAPH;buildRoads();const V=[],idx=new Map(),E=[];
  const vid=p=>{const k=Math.round(p.x/12)+','+Math.round(p.y/12);if(idx.has(k))return idx.get(k);V.push({x:p.x,y:p.y});E.push([]);idx.set(k,V.length-1);return V.length-1;};
  for(const r of ROADS){let prev=-1;r.pts.forEach((p,i)=>{if(i&&i<r.pts.length-1&&dist(p,r.pts[i-1])<60)return;const v=vid(p);if(prev>=0&&prev!==v){const L=dist(V[prev],V[v]);E[prev].push([v,L,r.bx!==undefined?r:null]);E[v].push([prev,L,r.bx!==undefined?r:null]);}prev=v;});}
  return RGRAPH={V,E};}
function nearV(x,y){const{V}=roadGraph();let b=-1,bd=1e18;for(let i=0;i<V.length;i++){const d=d2(x,y,V[i].x,V[i].y);if(d<bd){bd=d;b=i;}}return b;}
function bridgeOK(r){for(const s of structures)if(s.kind==='bridge'&&d2(s.x,s.y,r.bx,r.by)<60)return s.state==='ok';return true;}
function roadPath(ax,ay,bx,by){const{V,E}=roadGraph(),s=nearV(ax,ay),t=nearV(bx,by);if(s<0||t<0||s===t)return null;const g=new Float64Array(V.length).fill(1e18),fr=new Int32Array(V.length).fill(-1),done=new Uint8Array(V.length);g[s]=0;
  for(;;){let n=-1,bd=1e18;for(let i=0;i<V.length;i++)if(!done[i]&&g[i]<bd){bd=g[i];n=i;}if(n<0||n===t)break;done[n]=1;for(const[m,L,br]of E[n]){if(br&&!bridgeOK(br))continue;if(g[n]+L<g[m]){g[m]=g[n]+L;fr[m]=n;}}}
  if(g[t]>=1e18)return null;const P=[];for(let n=t;n>=0;n=fr[n])P.push(V[n]);P.reverse();return{P,len:g[t],s:V[s],t:V[t]};}
// troops heading somewhere far march along the roads (a little faster on them) when that isn't a big detour
function roadWay(u,tx,ty){const far=Math.hypot(tx-u.x,ty-u.y);if(far<700){u.rp=null;return null;}
  if(!u.rp||G.t-u.rpT>6||Math.hypot(tx-u.rpX,ty-u.rpY)>300){u.rpT=G.t;u.rpX=tx;u.rpY=ty;u.rp=[];const R=roadPath(u.x,u.y,tx,ty);
    if(R&&dist(u,R.s)<350&&Math.hypot(tx-R.t.x,ty-R.t.y)<far*.6){const tot=dist(u,R.s)+R.len+Math.hypot(tx-R.t.x,ty-R.t.y);if(tot<far*1.5)u.rp=R.P.slice();}}
  const P=u.rp;while(P.length&&(dist(u,P[0])<34||(P.length>1&&Math.hypot(tx-P[0].x,ty-P[0].y)>Math.hypot(tx-u.x,ty-u.y)+40&&dist(u,P[1])<dist(P[0],P[1]))))P.shift();
  if(!P.length)return null;if(Math.hypot(tx-u.x,ty-u.y)<Math.hypot(tx-P[P.length-1].x,ty-P[P.length-1].y)){u.rp=[];return null;}return P[0];}
const onRoad=(x,y)=>{const{V}=roadGraph();for(let i=0;i<V.length;i+=1)if(d2(x,y,V[i].x,V[i].y)<70)return true;return false;};
// ======================= village wells: sturdy stone, fire-proof, the bucket brigade's water source =======================
KDEF.well={name:'Village well',hp:270,stone:1,cost:[0,2],gold:[0,1],pts:45,alarm:3,sz:22}; // 3x a hut's 90 hp
COST.well=KDEF.well.cost;STRUCT_NAME.well=KDEF.well.name;
function roadNear(x,y,r){for(const R of buildRoads()){if(R.kind==='bridge')continue;const hw=R.w/2+r;for(let i=0;i<R.pts.length-1;i++){const a=R.pts[i],b=R.pts[i+1],dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy||1,t=clamp(((x-a.x)*dx+(y-a.y)*dy)/L2,0,1);if(d2(x,y,a.x+dx*t,a.y+dy*t)<hw)return true;}}return false;}
function wellSpotOK(x,y){if(roadWet(x,y,26)||inRange(x,y)||castleBox(x,y)||roadNear(x,y,14))return false;for(const s of structures)if(s.state!=='ruin'&&d2(x,y,s.x,s.y)<(s.kind==='well'?120:48))return false;
  for(const f of FARMS){const F=f.field;if(x>F.x-20&&x<F.x+F.w+20&&y>F.y-20&&y<F.y+F.h+20)return false;}return true;}
function placeWells(){VILLAGES.forEach((v,vi)=>{const huts=structures.filter(s=>s.v===vi&&(s.kind==='hut')).length,big=huts>=8||MARKETS.some(M=>M.v===vi);const want=big?2:1;let got=0;
  for(let ring=0;ring<8&&got<want;ring++)for(let k=0;k<16&&got<want;k++){const a=k/16*TAU+ring*.37+(got?Math.PI:0),r=40+ring*22+(got?60:0),x=v.x+Math.cos(a)*r,y=v.y+Math.sin(a)*r*.8;
    if(wellSpotOK(x,y)){const s=kAdd('well',x,y,vi);s.hasGold=true;got++;}}
  v.wells=got;});}
function nearestWell(x,y){let b=null,bd=1e18;for(const s of structures){if(s.kind!=='well'||s.state!=='ok')continue;const d=d2(x,y,s.x,s.y);if(d<bd){bd=d;b=s;}}return b&&bd<900?b:null;}
// fetching water: from the nearest standing well; with none in reach, scoop slowly from a trough/puddle on the spot (much slower fire-fighting)
function wellFetch(u,w,dt){if(w.well&&w.well.state!=='ok')w.well=nearestWell(u.x,u.y);
  if(!w.well){if(!w.slowMsg){w.slowMsg=1;if(dist(u,D)<900)float(u.x,u.y-30,'No well! Scooping a puddle…','#a8d0ff');}w.t-=dt*.1;return w.t<=0;}
  if(moveTo(u,w.well.x+14,w.well.y+10,55,dt)){w.t-=dt;return w.t<=0;}return false;}
function biteWell(){if(D.alt>=.3)return false;const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70;
  for(const s of structures){if(s.kind!=='well'||s.state!=='ok'||d2(mx,my,s.x,s.y)>60)continue;HEAVY=true;try{hurtStruct(s,50);}finally{HEAVY=false;}
    D.eatCD=.6;D.eatT=.3;puff(s.x,s.y-10,8,'rgba(170,165,150,',90,6);float(s.x,s.y-40,s.state==='ruin'?'CRUNCH! The well caves in':'Crunch! You gnaw the well stones','#d8d0c0');if(typeof SFX!=='undefined'&&SFX.play)SFX.play('crashStone',s.x,s.y,.5);return true;}return false;}
function drawWell(s){const x=s.x,y=s.y;if(s.state!=='ok'){for(let i=0;i<6;i++){const a=i,b=hsh01(s)*7+i;ell(x+Math.cos(b)*12,y+Math.sin(b)*5,6,4,i%2?'#8a8a90':'#6e6e74');}return;}
  ell(x+4,y+4,20,7,'rgba(0,0,0,.22)');ell(x,y,17,8,'#6e6e76');rect(x-17,y-12,34,12,'#8a8a92');ell(x,y-12,17,8,'#9c9ca4');ell(x,y-12,11,5,'#1e3a6a');ell(x-3,y-13,4,1.5,'rgba(255,255,255,.35)');
  for(let i=0;i<5;i++){const xx=x-15+i*7.5;line(xx,y-12,xx,y,'rgba(60,60,66,.5)',1);}line(x-17,y-6,x+17,y-6,'rgba(60,60,66,.45)',1);
  rect(x-15,y-36,3,26,'#6b4a26');rect(x+12,y-36,3,26,'#6b4a26');poly([x-20,y-34,x,y-46,x+20,y-34],'#93622d');poly([x,y-46,x+20,y-34,x+12,y-34],'#7a4f22');
  line(x-12,y-28,x+12,y-28,'#5a3a1a',2);line(x,y-28,x,y-16,'#999',1);rect(x-3,y-18,6,5,'#7a5a30');
  if(s.hp<s.maxHp*.6){line(x-8,y-11,x-3,y-3,'#333',1.2);line(x+6,y-10,x+9,y-2,'#333',1.2);}}
