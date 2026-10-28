// ======================= KINGDOM WATCHTOWERS: wooden ARCHER towers + stone SCORPION towers, built from a big cart-delivered stockpile =======================
// Two types: ARCHER TOWER (lots of wood, an archer on top, medium HP, burns) and SCORPION TOWER (castle level 3+, lots of stone, slow heavy
// ballista bolts, high HP, fireproof stone: only stomps, dive slams, bites, claws and lava hurt it). The kingdom builds whichever type it has
// the materials for (scorpion first when it can afford one). Nothing is built until a big stockpile has been delivered this level.
// Spots: beside the kingdom roads (first near the castle, then progressively farther out, spaced apart) plus guard posts on village edges.
// Max towers = 2 + castle level. Kingdom regions only (never the wilds/forest, lair, desert, savanna, jungle, mountains or Dragon Peaks).
// Built ONLY from wood/stone delivered by carts to the storehouse during this level (no starting stock, no free/timed resources):
// each tower spends its cost. Kill the carts/workers and building slows. Destroyed towers leave rubble, still count toward the max,
// and are rebuilt (same delivered-only rule). Saved with the game.
KDEF.wtower={name:'Archer tower',hp:170,cost:[18,4],gold:[1,3],pts:120,alarm:6,sz:30};KDEF.stower={name:'Scorpion tower',hp:560,stone:1,cost:[6,22],gold:[2,5],pts:300,alarm:9,sz:32};
for(const k of['wtower','stower']){COST[k]=KDEF[k].cost;STRUCT_NAME[k]=KDEF[k].name;}
// unlock: total wood+stone delivered by the carts this level before the first tower (undisturbed carts bring ~4-5 a minute -> ~8 minutes in)
const RT={unlock:36,buildT:{wtower:14,stower:22},T:{wtower:{cost:[18,4],lvl:1,name:'Archer Tower'},stower:{cost:[6,22],lvl:3,unlock:50,name:'Scorpion Tower'}},
  check:3,space:650,archerWait:25,bolt:{range:720,cd:4.6,speed:560,life:1.45},regions:new Set(['farm','castle','south','lake','hills','coast'])};
const RT_KINDS=new Set(['wtower','stower']);const isRT=s=>!!s&&RT_KINDS.has(s.kind);
let RT_SPOTS=null;
const rtMax=()=>Math.min((RT_SPOTS||rtSpots()).length,2+(G.lvl||1));
function rtOkAt(x,y){const k=regionKey(x,y);if(!RT.regions.has(k))return false;if(inWater(x,y)||inSea(x,y)||(typeof inDP==='function'&&inDP(x,y,1.3)))return false;
  if(typeof roadWet==='function'&&roadWet(x,y,30))return false;if(castleBox(x,y))return false;if(d2(x,y,LAIR.x,LAIR.y)<1400)return false;
  if(typeof DESERT!=='undefined'&&x<RANGE0+200)return false;return true;}
const rtRoadD=(x,y)=>{let b=1e9;for(const r of buildRoads())for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],c=r.pts[i+1],vx=c.x-a.x,vy=c.y-a.y,L=vx*vx+vy*vy||1,t=clamp(((x-a.x)*vx+(y-a.y)*vy)/L,0,1);b=Math.min(b,Math.hypot(x-a.x-vx*t,y-a.y-vy*t));}return b;};
function rtClear(x,y){return !structures.some(s=>!isRT(s)&&d2(x,y,s.x,s.y)<85);}
function rtSpots(){if(RT_SPOTS)return RT_SPOTS;const C={x:GATE.x,y:GATE.y+40},cand=[];
  // road spots: every ~60 px along kingdom roads, set 58 px to the side of the road
  for(const r of buildRoads()){if(r.kind==='bridge')continue;const P=r.pts;let acc=0;
    for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=Math.hypot(b.x-a.x,b.y-a.y);if(L<1)continue;const nx=-(b.y-a.y)/L,ny=(b.x-a.x)/L;
      for(let t=0;t<L;t+=60){const x=a.x+(b.x-a.x)*t/L,y=a.y+(b.y-a.y)*t/L;for(const sd of[1,-1]){const px=x+nx*58*sd,py=y+ny*58*sd;
        if(rtOkAt(px,py)&&rtRoadD(px,py)>40&&rtClear(px,py)&&d2(px,py,C.x,C.y)>260)cand.push({x:Math.round(px),y:Math.round(py),t:'road'});}}}}
  // village guard spots: on the edge of each kingdom village, on the side facing out from the castle
  const vil=[];VILLAGES.forEach((v,i)=>{if(typeof DTOWN!=='undefined'&&i===DTOWN.vi)return;if(!rtOkAt(v.x,v.y))return;const a0=Math.atan2(v.y-C.y,v.x-C.x);
    for(const da of[0,.5,-.5,1,-1,1.6,-1.6]){const x=v.x+Math.cos(a0+da)*230,y=v.y+Math.sin(a0+da)*190;if(rtOkAt(x,y)&&rtClear(x,y)&&rtRoadD(x,y)>36){vil.push({x:Math.round(x),y:Math.round(y),t:'village',v:i});break;}}});
  // worker guard spots: beside the kingdom's lumber camps, mines, farms (barns) and hunters' cabins
  const WK=new Set(['logpile','stonepile','barn','cabin','sawmill','camptent','minehut','minehead']),wk=[];const seenW=[];
  for(const b of structures){if(!WK.has(b.kind))continue;if(seenW.some(q=>d2(q.x,q.y,b.x,b.y)<300))continue;
    for(const a of[0,Math.PI,Math.PI/2,-Math.PI/2,.8,-.8,2.4,-2.4]){const x=b.x+Math.cos(a)*125,y=b.y+Math.sin(a)*105;if(rtOkAt(x,y)&&rtClear(x,y)&&rtRoadD(x,y)>36){wk.push({x:Math.round(x),y:Math.round(y),t:'work',k:b.kind});seenW.push(b);break;}}}
  // order: nearest the castle first, greedily spaced apart; village guard spots slot in by their distance too
  const all=[...cand,...vil,...wk].map(p=>Object.assign(p,{d:Math.hypot(p.x-C.x,p.y-C.y)})).sort((a,b)=>a.d-b.d||(a.t!=='road'?-1:1));
  const out=[];for(const p of all){const sp=p.t!=='road'?380:RT.space;if(out.some(q=>d2(p.x,p.y,q.x,q.y)<sp))continue;out.push(p);}
  out.forEach((p,i)=>p.i=i);RT_SPOTS=out;return out;}
const rtTowers=()=>structures.filter(isRT);
function rtBudget(){return{w:G.rtW||0,s:G.rtS||0};}
// delivered stock is the only thing that funds towers
{const _d=scDeliver;scDeliver=function(c){const n=c&&c.load|0;if(n>0){if(c.kind==='wood')G.rtW=(G.rtW||0)+n;else G.rtS=(G.rtS||0)+n;G.rtDelivered=(G.rtDelivered||0)+n;}return _d.apply(this,arguments);};}
function rtUnlocked(k){const need=Math.max(RT.unlock,RT.T[k].unlock||0);return(G.rtDelivered||0)>=need&&(G.lvl||1)>=RT.T[k].lvl;}
function rtCanPay(k){if(!k)return rtCanPay('stower')||rtCanPay('wtower');if(!rtUnlocked(k))return false;const[w,s]=RT.T[k].cost;return(G.rtW||0)>=w&&(G.rtS||0)>=s&&G.wood>=w&&G.stone>=s;}
// whichever type the kingdom has the materials for (the stronger scorpion tower first)
function rtPick(){return rtCanPay('stower')?'stower':rtCanPay('wtower')?'wtower':null;}
function rtPay(k){const[w,s]=RT.T[k].cost;G.rtW-=w;G.rtS-=s;G.wood-=w;G.stone-=s;G.rtSpent=(G.rtSpent||0)+w+s;}
function rtAdd(p,state,kind){kind=kind||'wtower';const s=kAdd(kind,p.x,p.y,-1,{wt:p.i,rt:1});s.state=state||'ok';s.build=state==='building'?0:1;s.hasGold=true;
  for(const t of trees)if(t.state==='ok'&&d2(t.x,t.y,p.x,p.y)<55){t.state='gone';t.hp=0;}return s;}
function rtStartBuild(s,why){rtPay(s.kind);s.state='building';s.build=0;s.hp=s.maxHp;s.fire=0;G.rtBuilds=(G.rtBuilds||0)+1;
  if(dist(s,D)<1400)float(s.x,s.y-90,(why==='re'?'Masons rebuild the ':'Masons start ')+(why==='re'?'':s.kind==='stower'?'a ':'an ')+(s.kind==='stower'?'scorpion tower':'archer tower'),'#e8d0a0');}
function rtTick(dt){if(!G||G.over)return;G.rtCk=(G.rtCk||0)-dt;
  for(const s of rtTowers()){
    if(s.state==='building'){s.build=Math.min(1,s.build+dt/RT.buildT[s.kind]);if(s.build>=1){s.state='ok';s.hp=s.maxHp;G.rtBuilt=(G.rtBuilt||0)+1;rtBuiltMsg(s);}}
    if(s.state==='ok'&&s.kind==='stower'){rtScorp(s,dt);continue;}
    if(s.state==='ok'){const a=units.find(u=>!u.dead&&u.wtS===s);if(!a){s.archT=(s.archT||0)+dt;if(s.archT>=(s.archFirst?RT.archerWait:0)){s.archT=0;s.archFirst=1;rtArcher(s);}}}}
  if(G.rtCk>0)return;G.rtCk=RT.check;
  // rebuild a ruined tower first, else start a new one (one job at a time)
  const T=rtTowers();if(T.some(s=>s.state==='building'))return;
  const ru=T.find(s=>s.state==='wruin'&&rtCanPay(s.kind));if(ru){rtStartBuild(ru,'re');return;}
  if(T.length>=rtMax())return;const k=rtPick();if(!k)return;const used=new Set(T.map(s=>s.wt));const p=rtSpots().find(q=>!used.has(q.i));if(!p)return;const s=rtAdd(p,'building',k);rtStartBuild(s);}
function rtBuiltMsg(s){const nm=RT.T[s.kind].name;G.rtBuiltK=G.rtBuiltK||{};G.rtBuiltK[s.kind]=(G.rtBuiltK[s.kind]||0)+1;
  G.banner={text:`The kingdom builds ${s.kind==='stower'?'a':'an'} ${nm}!`,sub:s.kind==='stower'?'Heavy ballista bolts. Fireproof stone: stomp, dive-slam, bite or lava it down.':'An archer keeps watch from the top. Wooden: it burns!',t:3.5};
  if(typeof showToast==='function')showToast(`🏰 ${nm} built (${rtTowers().filter(q=>q.state==='ok').length}/${rtMax()} towers)`);
  if(dist(s,D)<1400)float(s.x,s.y-150,s.kind==='stower'?'Scorpion tower ready!':'Archer tower manned!','#ffe0a0');}
// scorpion tower: a slow, hard-hitting ballista on top that leads the dragon
function rtScorp(s,dt){const B=RT.bolt;s.cd=(s.cd==null?2:s.cd)-dt;const dd=dist(s,D);if(dd>B.range+200||G.over)return;
  const lead=Math.min(1.2,dd/B.speed),tx=D.x+(D.vx||0)*lead*.8,ty=D.y+(D.vy||0)*lead*.8;s.aim=Math.atan2(ty-(s.y-120),tx-s.x);
  if(s.cd>0||dd>B.range)return;s.cd=B.cd;const a=Math.atan2(ty-s.y,tx-s.x),sx=s.x+Math.cos(a)*20,sy=s.y+Math.sin(a)*20;
  projs.push({kind:'bolt',tw:1,x:sx,y:sy,z:118,vx:Math.cos(a)*B.speed,vy:Math.sin(a)*B.speed,tz:heightOf()+15,life:B.life,dmg:0});G.rtBolts=(G.rtBolts||0)+1;
  if(typeof SFX!=='undefined')try{SFX.play('arrow',s.x,s.y,.8);}catch(e){}}
function rtArcher(s){const u=mkUnit('archer',s.x,s.y+4,{post:'tower',slot:'wt'+s.wt,px:s.x,py:s.y+4,hp:22,maxHp:22,shootT:R(1,3),wtS:s,lift:108});units.push(u);return u;}
// structure damage: a collapsed watchtower becomes rubble that only the tower builders handle; its archer climbs down
{const _h=hurtStruct;hurtStruct=function(s,d){if(isRT(s)){if(s.state==='wruin')return;if(s.kind==='stower'&&!HEAVY)return;if(s.state==='building'){s.build=Math.max(0,s.build-d/s.maxHp);s.hp=Math.max(1,s.hp-d);if(s.build<=0){s.state='wruin';s.ruinT=G.t;}return;}}
  const r=_h.apply(this,arguments);if(isRT(s)&&s.state==='ruin'){s.state='wruin';s.fire=0;G.rtLost=(G.rtLost||0)+1;for(const u of units)if(u.wtS===s&&!u.dead){u.post=null;u.wtS=null;u.lift=0;}}return r;};}
// keep struct fire/self-repair code away from rubble
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!paused&&!G.over)rtTick(dt);return r;};}
// drawing: a wooden watchtower on a stone footing (scaffolding while building, rubble when destroyed)
function drawWTower(s){const x=s.x,y=s.y;
  if(s.state==='wruin'){rubble(x,y+4,30,0,(s.wt*977)|0);return;}
  const b=s.state==='building'?s.build:1,H=88*Math.max(.15,b);
  ell(x+8,y+6,28,10,'rgba(0,0,0,.25)');
  rect(x-20,y-12,40,16,'#8b8478');rect(x-20,y-12,40,3,'#a59d90');
  ctx.strokeStyle='#6b4a2a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-15,y-10);ctx.lineTo(x-11,y-10-H);ctx.moveTo(x+15,y-10);ctx.lineTo(x+11,y-10-H);ctx.stroke();
  ctx.lineWidth=2;ctx.strokeStyle='#7d5a36';for(let k=1;k<4;k++){const yy=y-10-H*k/4;if(k/4>b+.01)break;ctx.beginPath();ctx.moveTo(x-14,yy+H/8);ctx.lineTo(x+13,yy-H/8);ctx.moveTo(x+14,yy+H/8);ctx.lineTo(x-13,yy-H/8);ctx.stroke();}
  if(b>=1){rect(x-20,y-104,40,10,'#8a643c');rect(x-20,y-104,40,3,'#a87c4c');for(let k=0;k<5;k++)rect(x-20+k*9,y-112,5,8,'#7d5a36');
    poly([x-22,y-112,x,y-134,x+22,y-112],'#a8402c');poly([x,y-134,x+22,y-112,x+8,y-112],'#8a3020');
    rect(x-1,y-150,2,18,'#5a4030');poly([x+1,y-150,x+16,y-145,x+1,y-140],'#d4b030');}
  else{ctx.strokeStyle='rgba(200,170,110,.9)';ctx.lineWidth=1.5;ctx.strokeRect(x-22,y-12-H,44,H);rect(x-25,y+12,50,4,'#333');rect(x-25,y+12,50*b,4,'#7fd07f');}
  if(s.fire>0)for(let i=0;i<3;i++)ell(x+R(-12,12),y-20-R(0,H),4,7,'rgba(255,150,40,.8)');
  if(s.state==='ok'&&s.hp<s.maxHp){rect(x-22,y+12,44,4,'#400');rect(x-22,y+12,44*s.hp/s.maxHp,4,'#d33');}}
{const _k=drawStructK;drawStructK=function(s){if(s.kind==='wtower'){drawWTower(s);return true;}if(s.kind==='stower'){drawSTower(s);return true;}return _k.apply(this,arguments);};}
// archers on a tower are drawn up on its platform
{const _da=drawPerson;drawPerson=function(u){if(u.lift&&u.wtS&&u.wtS.state==='ok'){ctx.save();ctx.translate(0,-u.lift);G.rtDrawnA=(G.rtDrawnA||0)+1;const r=_da.apply(this,arguments);ctx.restore();return r;}return _da.apply(this,arguments);};}
// pause menu line
function pauseExtraLine(){if(!G)return'';const T=rtTowers().filter(s=>s.state!=='wruin'),a=T.filter(s=>s.kind==='wtower').length,b=T.length-a;return `Towers ${T.length}/${rtMax()} (${a} archer · ${b} scorpion)`;}
// save / load
{const _ss=svSnapshot;svSnapshot=function(){G.rtSave=rtTowers().map(s=>[s.wt,s.state,Math.round(s.hp),+(s.build||0).toFixed(3),s.kind].join(',')).join(';');return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(){for(let i=structures.length-1;i>=0;i--)if(isRT(structures[i]))structures.splice(i,1);for(const u of units)if(u.wtS)u.dead=true;
  const r=_sa.apply(this,arguments);for(let i=structures.length-1;i>=0;i--)if(isRT(structures[i]))structures.splice(i,1);
  if(typeof G.rtSave==='string'&&G.rtSave){const S=rtSpots();for(const q of G.rtSave.split(';')){const[w0,st,h0,b0,k0]=q.split(','),wt=+w0,hp=+h0,b=+b0;const p=S[wt];if(!p)continue;const s=rtAdd(p,st,k0==='stower'?'stower':'wtower');s.hp=hp;s.build=b;}}return r;};}

// stone scorpion tower: a squat round stone tower with a ballista on its battlements (scaffolding while building)
function drawSTower(s){const x=s.x,y=s.y;
  if(s.state==='wruin'){rubble(x,y+4,34,1,(s.wt*977)|0);return;}
  const b=s.state==='building'?s.build:1,H=96*Math.max(.15,b);
  ell(x+8,y+6,32,11,'rgba(0,0,0,.28)');
  rect(x-24,y-8-H,48,H+8,'#8f8a80');for(let r=0;r*14<H;r++)for(let c=0;c<4;c++)rect(x-24+c*12+(r%2?6:0),y-8-r*14-13,11,12,r%2?'#a29d92':'#9a958a');
  rect(x-24,y-8-H,6,H+8,'rgba(0,0,0,.12)');rect(x+18,y-8-H,6,H+8,'rgba(255,255,255,.08)');
  if(b>=1){rect(x-28,y-112,56,10,'#7d786e');for(let k=0;k<5;k++)rect(x-28+k*12,y-122,8,10,'#8f8a80');
    rect(x-6,y-60,12,18,'#3a2a1a');
    // the ballista, turned toward the dragon
    const a=s.aim==null?-Math.PI/2:s.aim,ca=Math.cos(a),sa=Math.sin(a),cx=x,cy=y-120;
    line(cx-ca*22,cy-sa*22*.6,cx+ca*26,cy+sa*26*.6,'#5a3d22',6);
    line(cx+ca*14-sa*20,cy+sa*14*.6+ca*20*.6,cx+ca*14+sa*20,cy+sa*14*.6-ca*20*.6,'#6b4a26',4);
    line(cx+ca*30,cy+sa*30*.6,cx+ca*40,cy+sa*40*.6,'#ccc',3);
    rect(x-1,y-160,2,26,'#5a4030');poly([x+1,y-160,x+18,y-154,x+1,y-148],'#7a1f1f');}
  else{ctx.strokeStyle='rgba(200,170,110,.9)';ctx.lineWidth=1.5;ctx.strokeRect(x-26,y-12-H,52,H);rect(x-25,y+12,50,4,'#333');rect(x-25,y+12,50*b,4,'#7fd07f');}
  if(s.state==='ok'&&s.hp<s.maxHp){rect(x-24,y+12,48,4,'#400');rect(x-24,y+12,48*s.hp/s.maxHp,4,'#d33');}}
// bites gnaw a scorpion tower's stones (heavy, like a stomp); the swim claw-scratch rakes it too
{const _b=biteWell;biteWell=function(){if(D.alt<.3){const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70,s=rtTowers().find(q=>q.kind==='stower'&&(q.state==='ok'||q.state==='building')&&d2(mx,my,q.x,q.y-20)<95);
    if(s){const hv=HEAVY;HEAVY=true;hurtStruct(s,40);HEAVY=hv;D.eatCD=.45;D.eatT=.3;G.rtBites=(G.rtBites||0)+1;puff(mx,my,8,'rgba(170,165,150,',90,8);if(s.state==='ok')float(s.x,s.y-120,'Crunch! The tower stones crack','#e0d8b0');return true;}}
  return _b.apply(this,arguments);};}
{const _c=clawScratch;clawScratch=function(){const r=_c.apply(this,arguments);for(const s of rtTowers())if(s.kind==='stower'&&s.state==='ok'&&dist(s,D)<160){const hv=HEAVY;HEAVY=true;hurtStruct(s,30);HEAVY=hv;}return r;};}
// tally: archer towers and scorpion towers destroyed, listed separately
(function(){if(typeof TALLY_SECT==='undefined')return;const B=TALLY_SECT.find(q=>q.id==='build');if(!B)return;
  for(const[k,n]of[['b:wtower','Archer towers'],['b:stower','Scorpion towers']]){const e=B.keys.find(q=>q[0]===k);if(e)e[1]=n;else B.keys.push([k,n]);TALLY_LABEL[k]=n;}})();
