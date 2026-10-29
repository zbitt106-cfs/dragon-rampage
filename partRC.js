// ================= partRC: the RICH desert caravan + Sandhaven's desert soldiers & archers =================
// One of Sandhaven's two camel caravans is a rich one: colourful camels, a treasure chest (20 gold) and two richly dressed traders.
// It walks the roads from Sandhaven to the castle gate and back, guarded by desert soldiers (scimitar + round shield) and desert archers.
// Kill the lead trader or the treasure camel and the 20 gold goes straight to your lair (via the auto-deposit). It comes back from Sandhaven
// after a while, and fresh every level. Surviving guards stay on as Sandhaven's town guard; during a kingdom-wide muster the town is guarded too.
// desert troops are tougher than regular ones (regular foot soldier 24 HP / 4 dmg, archer 22 HP / 4 dmg): ~1.45x HP, 1.25x damage.
// The rich caravan walks at 67% of its old pace with 10 desert soldiers + 6 desert archers in formation; Sandhaven keeps its own garrison (3 + 2).
const RCV={cur:null,gold:20,respawn:600,first:6,sol:10,arc:6,solHp:35,arcHp:32,dmgMul:1.25,spd:.67,arcRange:420,wait:6,townCap:4,milN:[2,1],milCd:30,garSol:3,garArc:2,guardR:240,predDmg:5,predCd:1.35,arcCd:2,leash:380,threatR:300};
function rcEnds(){return{a:{x:DTOWN.x+40,y:DTOWN.y+60},b:{x:GATE.x+60,y:GATE.y+70}};}
function rcPath(){const e=rcEnds();let P=null;try{const q=scRoute(e.a,e.b);P=q&&q.P;}catch(_){P=null;}if(!P||P.length<2)P=[e.a,e.b];return P.map(p=>({x:p.x,y:p.y}));}
function rcAlive(){const c=RCV.cur;return !!(c&&!c.done);}
function mkDSol(x,y,o){return mkUnit('knight',x,y,Object.assign({foot:true,dsol:true,hp:RCV.solHp,maxHp:RCV.solHp,atk:0,colr:'#d8b878',dmgMul:RCV.dmgMul,born:G.t},o||{}));}
function mkDArc(x,y,o){return mkUnit('archer',x,y,Object.assign({darch:true,hp:RCV.arcHp,maxHp:RCV.arcHp,dmgMul:RCV.dmgMul,shootT:R(1,3),born:G.t},o||{}));}
function spawnRich(o){o=o||{};const P=o.path||rcPath(),ri=Math.max(0,Math.min(P.length-1,o.ri==null?0:o.ri)),dir=o.dir||1,p=o.x!=null?{x:o.x,y:o.y}:P[0];
  // keep the desert at two caravans: retire a plain one that is out of sight
  const plain=units.filter(u=>u.carav&&u.type==='villager'&&!u.dead&&!u.rc);if(plain.length>=2){const v=plain.sort((a,b)=>dist(b,D)-dist(a,D))[0];if(dist(v,D)>900){for(const c of units)if(c.carav&&c.type==='animal'){let L=c;while(L&&L.type==='animal')L=L.leader;if(L===v){c.dead=c.gone=true;}}for(const g of units)if(g.cvG&&g.escort===v)g.dead=g.gone=true;v.dead=v.gone=true;}}
  const lead=spawnVillager(p.x,p.y,'trader',DTOWN.vi);Object.assign(lead,{carav:true,rc:1,rcLead:true,route:P,ri,rcDir:dir,shirt:'#7a1f6a',turban:1,hp:14,maxHp:14,rcWait:o.wait||0,rcPaid:!!o.paid});
  const t2=spawnVillager(p.x-20,p.y+16,'trader',DTOWN.vi);Object.assign(t2,{rc:1,rcF:lead,shirt:'#1f5a8a',turban:1,hp:12,maxHp:12});
  if(o.t2===false){t2.dead=t2.gone=true;}
  const pal=[['#c0392b','#f1c40f','#2e86c1'],['#8e44ad','#f39c12','#16a085'],['#d35400','#27ae60','#f1c40f']],camels=[];let prev=lead;
  const nc=o.camels==null?3:o.camels;for(let k=0;k<nc;k++){const c=mkUnit('animal',p.x-(k+1)*34,p.y,{species:'camel',carav:true,rc:1,rcPal:pal[k%3],leader:prev,hp:34,maxHp:34,face:1});if(k===0&&o.chest!==false)c.rcChest=true;units.push(c);camels.push(c);prev=c;}
  const guards=[];const gl=o.guards||[...Array(RCV.sol)].map(()=>({k:'dsoldier'})).concat([...Array(RCV.arc)].map(()=>({k:'darcher'})),[...Array(RCV.camN)].map(()=>({k:'dcamel'})));
  gl.forEach((g,i)=>{const x=g.x!=null?g.x:p.x+R(-30,30),y=g.y!=null?g.y:p.y+R(-20,30);const u=g.k==='darcher'?mkDArc(x,y):g.k==='dcamel'?mkDCam(x,y):mkDSol(x,y);if(g.hp)u.hp=g.hp;u.escort=lead;u.eo=[-1.6,1.6,-.6,.6][i%4];u.rcG=true;u.rcSlot=gl.slice(0,i).filter(q=>(q.k||'dsoldier')===(g.k||'dsoldier')).length;units.push(u);guards.push(u);});
  RCV.cur={lead,t2,camels,guards,done:false};G.rcSpawned=(G.rcSpawned||0)+1;return RCV.cur;}
// the lead trader walks the road there and back again (rests at each end); the second trader follows him
{const _c=updCaravan;updCaravan=function(u,dt){if(!u.rcLead||u.type!=='villager')return _c.apply(this,arguments);u.anim=(u.anim||0)+dt*4;
  const dd=dist(u,D);if(dd<200&&!G.over){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,75,dt);if(!u.yelp||G.t-u.yelp>6){u.yelp=G.t;float(u.x,u.y-30,['Guards! Protect the treasure!','Dragon! Hold the line!'][RI(0,1)],'#ffe0a0');}return true;}
  if(u.rcWait>0){u.rcWait-=dt;return true;}
  const P=u.route,t=P[u.ri];if(!t)return true;u.rcHd=Math.atan2(t.y-u.y,t.x-u.x);if(moveTo(u,t.x,t.y,38*RCV.spd,dt)||dist(u,t)<16){const n=u.ri+u.rcDir;if(n<0||n>=P.length){if(n>=P.length)rcDeliver(u);else if(u.rcPaid)rcHome(u);u.rcDir=-u.rcDir;u.rcWait=RCV.wait;u.rcTrips=(u.rcTrips||0)+1;}else u.ri=n;}
  return true;};}
{const _v=updVillager;updVillager=function(u,dt){if(u.rcF){const L=u.rcF;if(!L.dead){u.anim=(u.anim||0)+dt*4;const dd=dist(u,D);
    if(dd<200&&!G.over){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,75,dt);return;}
    if(dist(u,L)>28)moveTo(u,L.x-14*(L.face||1),L.y+14,dist(u,L)>100?80:42*RCV.spd,dt);u.face=L.x>u.x?1:-1;return;}
    u.rcF=null;u.home=DTOWN;}return _v.apply(this,arguments);};}
// desert archers shoot from further out while escorting
{const _e=escortStep;escortStep=function(k,dt){if(k.darch&&k.escort&&!k.escort.dead&&dist(k,D)<RCV.arcRange&&!G.over)return false;return _e.apply(this,arguments);};}
// town guards (former caravan guards / muster guards) keep to Sandhaven: soldiers use the 'guard' post leash, archers a short leash of their own
{const _a=updArcher;updArcher=function(u,dt){if(u.darch&&u.dguard&&!u.retreat){const dd=dist(u,D);if(dd>450||d2(u.x,u.y,u.px,u.py)>560){if(dist(u,{x:u.px,y:u.py})>10)moveTo(u,u.px,u.py,60,dt);u.anim+=dt*6;u.face=D.x>u.x?1:-1;u.shootT=Math.max(u.shootT,.6);return;}}return _a.apply(this,arguments);};}
function rcTownPost(i){const a=i*2.1+.5,r=110+(i%3)*40;return{x:DTOWN.x+Math.cos(a)*r,y:DTOWN.y+Math.sin(a)*r*.7};}
function rcMakeGuard(u,i){u.escort=null;u.rcG=false;u.dguard=true;const P=rcTownPost(i);u.px=P.x;u.py=P.y;u.pa=i*1.7;if(u.dsol){u.post='guard';u.slot='d'+i;}}
function rcTownGuards(){return units.filter(u=>u.dguard&&!u.dead);}
function rcRaided(why){const c=RCV.cur;if(!c||c.done)return;c.done=true;const L=c.lead,x=L.x,y=L.y;
  D.gold+=RCV.gold;G.rcRaids=(G.rcRaids||0)+1;G.stats.richCaravans=(G.stats.richCaravans||0)+1;if(typeof tallyAdd==='function')tallyAdd('richcaravan');
  const tc=c.camels.find(k=>k.rcChest)||L;float(tc.x,tc.y-50,`+${RCV.gold} gold! The rich caravan's treasure chest is yours`,'#ffd84a');sparkle(tc.x,tc.y,22);puff(tc.x,tc.y-20,14,'rgba(255,216,74,',140,5);
  for(const k of c.camels)k.rcChest=false;if(typeof SFX!=='undefined')SFX.play('coin',tc.x,tc.y,1);
  // the guards stay on as Sandhaven's town guard (oldest extras sent home if there are too many)
  let n=rcTownGuards().length;for(const u of c.guards)if(!u.dead){rcMakeGuard(u,n++);}
  if(!L.dead){L.rcLead=false;L.carav=false;L.home=DTOWN;}if(c.t2&&!c.t2.dead){c.t2.rcF=null;c.t2.home=DTOWN;}
  G.rcT=RCV.respawn;RCV.cur=null;}
function rcCheck(){const c=RCV.cur;if(!c||c.done)return;const chest=c.camels.find(k=>k.rcChest);
  if(c.lead.dead)rcRaided('lead');else if(chest&&chest.dead)rcRaided('chest');else if(!chest&&c.camels.every(k=>k.dead))rcRaided('camels');}
function rcUpd(dt){if(G.over)return;rcCheck();
  if(!RCV.cur){G.rcT=(G.rcT==null?RCV.first:G.rcT)-dt;if(G.rcT<=0){G.rcT=0;spawnRich();}}
  // too many town guards: send the extras home (out of sight)
  rcGarrison();const tg=rcTownGuards(),tx=tg.filter(u=>!u.garr),cap=RCV.townCap+(G.milOn?3:0);if(tx.length>cap)for(const u of tx.slice(0,tx.length-cap))if(dist(u,D)>900){u.dead=u.gone=true;}
  // kingdom muster: Sandhaven's desert troops turn out to guard the town
  G.rcMilT=(G.rcMilT||0)-dt;if(G.milOn&&G.rcMilT<=0){G.rcMilT=RCV.milCd;const s=tg.filter(u=>u.dsol).length,a=tg.filter(u=>u.darch).length;let i=tg.length;
    for(let k=s;k<RCV.milN[0];k++){const P=rcTownPost(i);const u=mkDSol(P.x,P.y,{milG:true});rcMakeGuard(u,i++);units.push(u);}
    for(let k=a;k<RCV.milN[1];k++){const P=rcTownPost(i);const u=mkDArc(P.x,P.y,{milG:true});rcMakeGuard(u,i++);units.push(u);}}
  if(!G.milOn)for(const u of tg)if(u.milG&&dist(u,D)>900){u.dead=u.gone=true;}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&!paused&&G&&D&&typeof DTOWN!=='undefined')rcUpd(dt);return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);RCV.cur=null;G.rcT=RCV.first;G.rcMilT=0;G.rcGar=false;return r;};}
// ---- tally: desert soldiers / archers get their own lines, plus raided rich caravans ----
{const _k=tallyKeyU;tallyKeyU=function(u){if(u&&u.dsol)return'dsoldier';if(u&&u.darch)return'darcher';return _k.apply(this,arguments);};}
TALLY_SECT.splice(2,0,{id:'desert',name:'Sandhaven (desert)',icon:'🐫',col:'#f0c878',keys:[['dsoldier','Desert soldiers'],['darcher','Desert archers'],['richcaravan','Rich caravans raided']]});
if(typeof TALLY_LABEL!=='undefined'){TALLY_LABEL.dsoldier='Desert soldiers';TALLY_LABEL.darcher='Desert archers';TALLY_LABEL.richcaravan='Rich caravans raided';}
// ---- drawing ----
function drawDesertSoldier(u){const x=u.x,y=u.y,f=u.face||1,g=Math.sin((u.anim||0)*1.6);
  ell(x,y+1.5,6,2.4,'rgba(0,0,0,.25)');ctx.save();ctx.translate(x,y);ctx.scale(1.28,1.28);
  line(-1.4,0,-1.4+g*1.6,-4,'#5a4a3a',1.6);line(1.4,0,1.4-g*1.6,-4,'#5a4a3a',1.6);
  poly([-3.6,-11.5,3.6,-11.5,4.6,-2.5,-4.6,-2.5],u.burn>0?'#f60':'#e2cfa0');rect(-3.6,-7.4,7.2,1.3,'#b0302a'); // sand robe + red sash
  ell(0,-13.6,2.5,2.5,'#c99a70');ell(0,-15.4,3.4,2.2,'#f4ecd8');ell(f*.8,-16.6,2.2,1.2,'#e8dcc0');rect(-f*3.4-.4,-15.4,1,3,'#f4ecd8'); // turban + tail
  const sw=u.swing>0?-1.2:0;ctx.strokeStyle='#dfe4ea';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(f*3,-8);ctx.quadraticCurveTo(f*(9+sw*-3),-12+sw*3,f*(8+sw*-4),-17+sw*5);ctx.stroke();rect(f*3-1,-8.6,2,1.4,'#c9a227'); // scimitar
  ell(-f*3.6,-8,3.4,3.4,'#8a5a2a');ell(-f*3.6,-8,2.2,2.2,'#c9a227');ell(-f*3.6,-8,.8,.8,'#8a5a2a'); // round shield
  ctx.restore();if(u.hp<u.maxHp){rect(x-7,y-26,14,2,'#400');rect(x-7,y-26,14*u.hp/u.maxHp,2,'#e44');}}
function drawDesertArcher(u){const x=u.x,y=u.y,f=u.face||1,bob=Math.sin(u.anim||0)*1.2;
  ell(x,y+1,4,1.8,'rgba(0,0,0,.25)');if(u.dguard)ell(x,y+1,6,2.5,'rgba(255,220,120,.3)');
  line(x-1.2,y,x-1.2+Math.sin(u.anim||0)*1.5,y-4,'#5a4a3a',1.4);line(x+1.2,y,x+1.2-Math.sin(u.anim||0)*1.5,y-4,'#5a4a3a',1.4);
  poly([x-3,y-10+bob*.3,x+3,y-10+bob*.3,x+3.8,y-3,x-3.8,y-3],u.burn>0?'#f60':'#d9c08a');rect(x-3,y-6.6,6,1.1,'#2a6a8a');
  ell(x,y-12.5+bob*.3,2.4,2.4,'#c99a70');ell(x,y-14.4+bob*.3,3,1.9,'#2a6a8a');rect(x-f*3,y-14.6,1,3,'#2a6a8a'); // blue turban
  ctx.strokeStyle='#7a4a1a';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x+f*2,y-14);ctx.quadraticCurveTo(x+f*7,y-12,x+f*4.5,y-8);ctx.quadraticCurveTo(x+f*7,y-4,x+f*2,y-2);ctx.stroke(); // recurve bow
  line(x+f*2,y-14,x+f*2,y-2,'#eee',.6);rect(x-f*4-1,y-12,2,6,'#8a5a2a');
  if(u.hp<u.maxHp){rect(x-7,y-22,14,2,'#400');rect(x-7,y-22,14*u.hp/u.maxHp,2,'#e44');}}
{const _d=drawKnight;drawKnight=function(u){if(u.dsol&&!u.mounted){drawDesertSoldier(u);return;}return _d.apply(this,arguments);};}
{const _p=drawPerson;drawPerson=function(u){if(u.darch){drawDesertArcher(u);return;}const r=_p.apply(this,arguments);
  if(u.rc&&u.type==='villager'){const x=u.x,y=u.y,f=u.face||1;line(x-2.8,y-9.5,x+2.8,y-5,'#f1c40f',1.2);ell(x,y-15.6,1,1,'#e74c3c');ell(x+f*2.5,y-7,1,1,'#f1c40f');}return r;};}
{const _f=drawDesertFauna;drawDesertFauna=function(u){const r=_f.apply(this,arguments);if(u.rc&&u.species==='camel'){const x=u.x,y=u.y,b=Math.abs(Math.sin(u.anim||0))*1.5,P=u.rcPal||['#c0392b','#f1c40f','#2e86c1'];
    rect(x-14,y-35-b,28,11,P[0]);rect(x-14,y-31-b,28,2.4,P[1]);rect(x-14,y-27.5-b,28,2,P[2]); // striped saddle blanket
    for(let i=0;i<6;i++){const tx=x-12+i*5;line(tx,y-24.5-b,tx,y-21.5-b+Math.sin(G.t*4+i)*.8,P[(i+1)%3],1.2);ell(tx,y-21-b,1,1,'#f1c40f');} // tassels
    ell(x+16,y-20-b,1.6,1.6,'#e8c050');line(x+12,y-24-b,x+20,y-24-b,P[1],1.5); // bell + bridle
    if(u.rcChest){rect(x-8,y-45-b,16,10,'#7a4a1a');rect(x-8,y-45-b,16,3,'#a0662a');rect(x-8.5,y-41.5-b,17,1.4,'#e8c050');rect(x-1.5,y-42-b,3,4,'#e8c050');
      ell(x-4,y-46-b,2,1.4,'#ffd84a');ell(x+3,y-46.5-b,2,1.4,'#ffd84a');if(Math.sin(G.t*5)>.6)ell(x+R(-6,6),y-48-b,1.2,1.2,'#fff4b0');}}return r;};}
// ---- save / load (units are not saved: snapshot the rich caravan and Sandhaven's town guard) ----
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);const c=RCV.cur,g=u=>({k:u.dsol?'dsoldier':u.dcam?'dcamel':'darcher',hp:Math.round(u.hp),x:Math.round(u.x),y:Math.round(u.y),garr:!!u.garr});
  d.RCV={cur:c&&!c.done&&!c.lead.dead?{x:Math.round(c.lead.x),y:Math.round(c.lead.y),ri:c.lead.ri|0,dir:c.lead.rcDir||1,wait:+(c.lead.rcWait||0).toFixed(1),paid:!!c.lead.rcPaid,t2:!!(c.t2&&!c.t2.dead),
    camels:c.camels.filter(k=>!k.dead).length,chest:c.camels.some(k=>k.rcChest&&!k.dead),guards:c.guards.filter(u=>!u.dead).map(g)}:null,town:rcTownGuards().map(u=>Object.assign(g(u),{mil:!!u.milG})),garDone:!!G.rcGar,camGar:!!G.rcCamGar};return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(!d||!d.RCV)return r;
  for(let i=units.length-1;i>=0;i--){const u=units[i];if(u.rc||u.dsol||u.darch||u.dcam)units.splice(i,1);}RCV.cur=null;
  if(d.RCV.cur){const c=d.RCV.cur;spawnRich({x:c.x,y:c.y,ri:c.ri,dir:c.dir,wait:c.wait,paid:c.paid,t2:c.t2,camels:c.camels,chest:c.chest,guards:c.guards});G.rcSpawned=Math.max(0,(G.rcSpawned||1)-1);}
  (d.RCV.town||[]).forEach((t,i)=>{const u=t.k==='darcher'?mkDArc(t.x,t.y):t.k==='dcamel'?mkDCam(t.x,t.y):mkDSol(t.x,t.y);u.hp=t.hp||u.hp;if(t.mil)u.milG=true;if(t.garr)u.garr=true;rcMakeGuard(u,i);units.push(u);});G.rcGar=(d.RCV.town||[]).some(t=>t.garr)||!!d.RCV.garDone;G.rcCamGar=(d.RCV.town||[]).some(t=>t.garr&&t.k==='dcamel')||!!d.RCV.camGar;
  return r;};}

// ---- Sandhaven's standing garrison: 3 desert soldiers + 2 desert archers guard the town every level (separate from the caravan escort) ----
function rcGarrison(){if(G.rcGar||typeof DTOWN==='undefined')return;G.rcGar=true;let i=0;
  for(let k=0;k<RCV.garSol;k++){const P=rcTownPost(i);const u=mkDSol(P.x,P.y,{garr:true});rcMakeGuard(u,i++);units.push(u);}
  for(let k=0;k<RCV.garArc;k++){const P=rcTownPost(i);const u=mkDArc(P.x,P.y,{garr:true});rcMakeGuard(u,i++);units.push(u);}G.rcGarN=(G.rcGarN||0)+1;}
// ---- the escort marches in formation: soldiers in two files of five down the flanks, archers paired at the front, rear and outer flanks ----
const RC_FORM={sol:[[10,-30],[-20,-30],[-50,-30],[-80,-30],[-110,-30],[10,30],[-20,30],[-50,30],[-80,30],[-110,30]],arc:[[42,-16],[42,16],[-150,-16],[-150,16],[-50,-64],[-50,64]]};
function rcThreat(c){if(D.alt>=.6)return false;for(const u of [c.lead,c.t2,...c.camels])if(u&&!u.dead&&d2(u.x,u.y,D.x,D.y)<RCV.threatR)return true;return false;}
RC_FORM.cam=[[-50,-100],[-50,100]];
function rcSlotPos(k,L){const F=k.dcam?RC_FORM.cam:k.darch?RC_FORM.arc:RC_FORM.sol,s=F[(k.rcSlot||0)%F.length],a=L.rcHd||0,f=s[0],l=s[1];return{x:L.x+Math.cos(a)*f-Math.sin(a)*l,y:L.y+Math.sin(a)*f*.8+Math.cos(a)*l*.8};}
{const _e=escortStep;escortStep=function(k,dt){const c=RCV.cur;if(!(k.rcG&&c&&!c.done&&k.escort===c.lead&&!c.lead.dead))return _e.apply(this,arguments);
  if(typeof gpGuardStep==='function'&&gpGuardStep(k,dt))return true;
  // (item 51) the escort STAYS WITH THE CARAVAN: it fights the dragon when the dragon comes for the caravan (or right up to a guard), but a
  // guard never chases more than RCV.leash from the lead trader: past that it breaks off and hurries back to its place in the formation.
  const L=c.lead,dd=dist(k,D),thr=rcThreat(c);if(dist(k,L)>RCV.leash&&!k.rcBack){k.rcBack=true;if(!c.backSaid||G.t-c.backSaid>8){c.backSaid=G.t;if(dist(k,D)<1200)float(k.x,k.y-34,['Back to the caravan!','Guard the treasure, not the dragon!','Hold the formation!'][RI(0,2)],'#ffe0a0');}}
  if(k.rcBack){const T=rcSlotPos(k,L);if(dist(k,T)<50)k.rcBack=false;else{moveTo(k,T.x,T.y,95,dt);k.face=T.x>k.x?1:-1;k.born=G.t;k.retreat=false;return true;}}
  if(!G.over&&D.alt<.6&&(thr||dd<((k.darch||k.dcam)?RCV.arcRange:220)))return false;
  const T=rcSlotPos(k,L),dt2=dist(k,T);if(dt2>4)moveTo(k,T.x,T.y,dt2>120?80:Math.max(30,Math.min(60,dt2*2)),dt);k.face=L.face||1;k.born=G.t;k.retreat=false;return true;};}

// ================= (items 52/53) mounted CAMEL SOLDIERS: a desert rider on a camel with a scimitar and a recurve bow =================
// They shoot when the dragon is at range or in the air, and ride in to slash when it is close on the ground (like the elf unicorn riders).
// Every desert caravan (the rich one and the two plain ones) has 2 in its escort; Sandhaven's garrison has 4 that patrol around the town.
Object.assign(RCV,{camHp:60,camN:2,camSp:150,camBow:400,camMelee:62,camSword:6,camArrow:4,camShotCd:1.9,camSlashCd:1.15,garCam:4,patrolR:250,townR:560,townLeash:700,camHeal:40});
function mkDCam(x,y,o){return mkUnit('knight',x,y,Object.assign({dcam:true,post:'dcam',hp:RCV.camHp,maxHp:RCV.camHp,atk:0,dmgMul:RCV.dmgMul,shootT:R(.8,2),born:G.t,pa:R(0,TAU),cm:'sword'},o||{}));}
function dcFight(u,dt){const dd=dist(u,D),ground=D.alt<DR.hitAltSword;u.atk-=dt;u.shootT-=dt;
  if(ground&&dd<170){u.cm='sword';if(dd>RCV.camMelee*.8)moveTo(u,D.x,D.y,RCV.camSp,dt);if(dd<RCV.camMelee&&u.atk<=0){u.atk=RCV.camSlashCd;u.swing=.3;hurtDragon(RCV.camSword*(u.dmgMul||1),'sword');}}
  else{u.cm='bow';if(dd>RCV.camBow*.85)moveTo(u,D.x,D.y,RCV.camSp*.8,dt);else if(dd<150){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*30,u.y+Math.sin(a)*30,110,dt);}
    if(dd<RCV.camBow&&u.shootT<=0){u.shootT=RCV.camShotCd;u.draw=.3;const T=dd/430,px=D.x+D.vx*T*.6,py=D.y+D.vy*T*.6,a=Math.atan2(py-u.y,px-u.x);
      projs.push({kind:'arrow',x:u.x,y:u.y,z:18,vx:Math.cos(a)*430,vy:Math.sin(a)*430,tz:heightOf()+15,life:1.4,dmg:RCV.camArrow*(u.dmgMul||1),z0:18});G.camShots=(G.camShots||0)+1;}}
  u.face=D.x>u.x?1:-1;}
function updDCam(u,dt){u.anim=(u.anim||0)+dt*6;u.swing=Math.max(0,(u.swing||0)-dt);u.draw=Math.max(0,(u.draw||0)-dt);u.retreat=false;if(G.over)return;
  // a plain caravan's riders whose trader is gone join Sandhaven's town guard
  if(!u.escort&&!u.dguard){rcMakeGuard(u,rcTownGuards().length);u.cvG=false;}
  if(u.dguard&&typeof DTOWN!=='undefined'){const T=DTOWN,far=dist(u,T)>RCV.townLeash;
    if(!far&&(dist(D,T)<RCV.townR||dist(u,D)<260&&D.alt<.6)){dcFight(u,dt);return;}
    u.pa=(u.pa||0)+dt*.12;const px=T.x+Math.cos(u.pa)*RCV.patrolR,py=T.y+Math.sin(u.pa)*RCV.patrolR*.7;u.cm='sword';moveTo(u,px,py,far?120:55,dt);return;}
  dcFight(u,dt);}
{const _k=updKnight;updKnight=function(u,dt){if(u.dcam){updDCam(u,dt);return;}return _k.apply(this,arguments);};}
// plain caravans get 2 camel riders that keep to the caravan (same leash / threat rules as the rich caravan's escort, item 51)
{const _s=spawnCaravan;spawnCaravan=function(){const n0=units.length,lead=_s.apply(this,arguments);if(lead&&typeof DTOWN!=='undefined'){lead.cvCam=units.slice(n0).filter(c=>c.species==='camel');
    for(let i=0;i<RCV.camN;i++){const u=mkDCam(lead.x-40,lead.y+(i?46:-46),{escort:lead,cvG:true,cvSlot:i,eo:i?1.6:-1.6});units.push(u);}}return lead;};}
function cvThreat(L){if(D.alt>=.6)return false;if(dist(L,D)<RCV.threatR)return true;for(const c of L.cvCam||[])if(!c.dead&&dist(c,D)<RCV.threatR)return true;return false;}
function cvSlotPos(k,L){const t=L.route&&L.route[L.ri],a=t?Math.atan2(t.y-L.y,t.x-L.x):0,f=-40,l=k.cvSlot?50:-50;return{x:L.x+Math.cos(a)*f-Math.sin(a)*l,y:L.y+Math.sin(a)*f*.8+Math.cos(a)*l*.8};}
{const _e=escortStep;escortStep=function(k,dt){if(!k.cvG)return _e.apply(this,arguments);const L=k.escort;if(!L||L.dead||!L.carav){k.escort=null;return false;}
  const dd=dist(k,D);if(dist(k,L)>RCV.leash)k.rcBack=true;
  if(k.rcBack){const T=cvSlotPos(k,L);if(dist(k,T)<50)k.rcBack=false;else{moveTo(k,T.x,T.y,120,dt);k.face=T.x>k.x?1:-1;k.anim=(k.anim||0)+dt*6;k.cm='sword';return true;}}
  if(!G.over&&D.alt<.6&&(cvThreat(L)||dd<RCV.camBow))return false;
  const T=cvSlotPos(k,L),d=dist(k,T);if(d>4)moveTo(k,T.x,T.y,d>120?90:Math.max(30,Math.min(60,d*2)),dt);k.anim=(k.anim||0)+dt*4;k.face=L.face||1;k.cm='sword';k.born=G.t;k.retreat=false;return true;};}
// Sandhaven's 4 camel riders: part of the standing garrison, back every level (a separate flag so older saves get them too)
{const _r=rcUpd;rcUpd=function(dt){_r.apply(this,arguments);if(G.over||G.rcCamGar||typeof DTOWN==='undefined')return;G.rcCamGar=true;
  for(let k=0;k<RCV.garCam;k++){const P=rcTownPost(10+k);const u=mkDCam(P.x,P.y,{garr:true});rcMakeGuard(u,10+k);u.pa=k*TAU/RCV.garCam;units.push(u);}};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);G.rcCamGar=false;return r;};}
// edible: rider + camel is a big meal
{const _e=eatUnit;eatUnit=function(u){if(!u||!u.dcam)return _e.apply(this,arguments);const h=HEAL.knight;HEAL.knight=RCV.camHeal;try{_e.apply(this,arguments);}finally{HEAL.knight=h;}float(u.x,u.y-44,'Camel and rider? Gulp!','#ffd27a');};}
{const _k=tallyKeyU;tallyKeyU=function(u){if(u&&u.dcam)return'dcamel';return _k.apply(this,arguments);};}
{const S=TALLY_SECT.find(s=>s.id==='desert');if(S)S.keys.splice(2,0,['dcamel','Camel soldiers']);if(typeof TALLY_LABEL!=='undefined')TALLY_LABEL.dcamel='Camel soldiers';}
function drawCamelRider(u){const x=u.x,y=u.y,f=u.face||1,w=Math.sin(u.anim||0),b=Math.abs(w)*1.2,burn=u.burn>0,fur=burn?'#f60':'#d4a464';
  ell(x,y+2,17,4,'rgba(0,0,0,.25)');if(u.dguard)ell(x,y+2,19,5,'rgba(255,220,120,.25)');
  for(const lx of[-9,-5,6,10])line(x+lx*f,y-14,x+lx*f+w*(lx<0?3:-3),y,'#b8874a',2.4);
  ell(x,y-17-b,15,7,fur);ell(x-2*f,y-23-b,7,6,fur);line(x+12*f,y-18-b,x+17*f,y-30-b,fur,4.5);ell(x+20*f,y-31-b,5.5,3.2,fur);
  ell(x+18.5*f,y-33-b,1,1,'#222');ell(x+24.5*f,y-30.5-b,1,.8,'#6a4a2a');line(x-15*f,y-18-b,x-17*f,y-12-b+w,'#b8874a',1.5); // eye, nose, tail
  rect(x-10,y-26-b,17,6,'#b0302a');rect(x-10,y-22-b,17,1.5,'#f1c40f');for(let i=0;i<4;i++)ell(x-8+i*5,y-19.5-b,1,1,'#f1c40f'); // saddle blanket + tassels
  const ry=y-27-b;line(x+f,ry,x+4*f,ry+6,'#5a4a3a',1.8);
  poly([x-3.6,ry-10,x+3.6,ry-10,x+4.4,ry,x-4.4,ry],burn?'#f60':'#e2cfa0');rect(x-3.6,ry-6,7.2,1.3,'#b0302a');
  ell(x,ry-12,2.5,2.5,'#c99a70');ell(x,ry-14,3.4,2.2,'#f4ecd8');ell(f*.8+x,ry-15.2,2.2,1.2,'#e8dcc0');rect(x-f*3.4-.4,ry-14,1,3,'#f4ecd8');
  if(u.cm==='bow'){const bx=x+f*3;ctx.strokeStyle='#7a4a1a';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(bx,ry-13);ctx.quadraticCurveTo(bx+f*5,ry-11,bx+f*2.5,ry-7);ctx.quadraticCurveTo(bx+f*5,ry-3,bx,ry-1);ctx.stroke();line(bx-(u.draw>0?f*2:0),ry-7,bx,ry-13,'#eee',.6);line(bx-(u.draw>0?f*2:0),ry-7,bx,ry-1,'#eee',.6);rect(x-f*4-1,ry-11,2,6,'#8a5a2a');}
  else{const sw=u.swing>0?-1.2:0;ctx.strokeStyle='#dfe4ea';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x+f*3,ry-7);ctx.quadraticCurveTo(x+f*(9+sw*-3),ry-11+sw*3,x+f*(8+sw*-4),ry-16+sw*5);ctx.stroke();rect(x+f*3-1,ry-7.6,2,1.4,'#c9a227');rect(x-f*4-1,ry-11,2,6,'#8a5a2a');}
  if(u.hp<u.maxHp){rect(x-9,y-56-b,18,2,'#400');rect(x-9,y-56-b,18*u.hp/u.maxHp,2,'#e44');}}
{const _d=drawKnight;drawKnight=function(u){if(u.dcam){drawCamelRider(u);return;}return _d.apply(this,arguments);};}

// ================= (items 55/56) the rich caravan pays the KING: +50 gold into the treasury each time it reaches the castle-gate end =================
// Once per arrival (when it turns round at the gate, not while it rests there), silently. The delivery never empties its own chest:
// raid it before it gets there or on the way back to Sandhaven and the dragon still gets its 20 gold.
RCV.deliver=50;
function rcDeliver(u){if(!goldPiles||!goldPiles.length)return;const p=goldPiles.reduce((a,b)=>a.amt<=b.amt?a:b);p.amt+=RCV.deliver;G.rcDeliv=(G.rcDeliv||0)+1;G.rcTreasIn=(G.rcTreasIn||0)+RCV.deliver;u.rcPaid=true;}
// ======================= item 57: SANDHAVEN REWARD TOWERS =======================
// Every time the rich caravan gets all the way home to Sandhaven AFTER paying the king (not raided on the way), Sandhaven raises one
// sandstone watchtower with a desert archer on top. Spots ring the village (never on a building), cap 5 standing towers; a destroyed
// tower leaves rubble and the next reward rebuilds that spot first. Destroyable like the kingdom watchtowers (fire, stomps, slams...).
// Like the kingdom's watchtowers they belong to the current castle level (saved with the game, a new level starts without them).
KDEF.dtower={name:'Sandhaven tower',hp:200,gold:[1,3],pts:140,alarm:5,sz:30};COST.dtower=[0,0];STRUCT_NAME.dtower='Sandhaven tower';
const DTW={max:5,archerWait:20};let DTW_SPOTS=null;
const isDT=s=>!!s&&s.kind==='dtower';const dtTowers=()=>structures.filter(isDT);
function dtSpots(){if(DTW_SPOTS)return DTW_SPOTS;const out=[];if(typeof DTOWN==='undefined')return out;
  for(const r of[330,390,450])for(let k=0;k<10;k++){const a=k*TAU/10+(r===390?.3:r===450?.15:0),x=Math.round(DTOWN.x+Math.cos(a)*r),y=Math.round(DTOWN.y+Math.sin(a)*r*.8);
    if(!inDesert(x,y)||(typeof inWater==='function'&&inWater(x,y)))continue;if(structures.some(s=>!isDT(s)&&d2(x,y,s.x,s.y)<95))continue;
    if(typeof inOasis==='function'&&inOasis(x,y))continue;if(out.some(q=>d2(x,y,q.x,q.y)<230))continue;out.push({x,y});}
  DTW_SPOTS=out;return out;}
function dtAdd(x,y,st){const s=kAdd('dtower',x,y,DTOWN.vi,{dtw:1});s.state=st||'ok';s.build=1;s.hasGold=true;return s;}
function rcHome(u){u.rcPaid=false;G.rcHome=(G.rcHome||0)+1;const T=dtTowers();
  const ru=T.find(s=>s.state==='druin');let s=null;
  if(ru){ru.state='ok';ru.hp=ru.maxHp;ru.fire=0;s=ru;}
  else{if(T.length>=DTW.max){G.rcTowCap=(G.rcTowCap||0)+1;return null;}const p=dtSpots().find(q=>!T.some(t=>d2(t.x,t.y,q.x,q.y)<40));if(!p)return null;s=dtAdd(p.x,p.y);}
  s.archT=DTW.archerWait;G.rcTowers=(G.rcTowers||0)+1;puff(s.x,s.y,14,'rgba(220,190,130,',120,10);
  if(dist(s,D)<1200)float(s.x,s.y-150,'Sandhaven raises a new tower!','#ffe0a0');return s;}
function dtArcher(s){const u=mkDArc(s.x,s.y+4,{post:'tower',slot:'dt',px:s.x,py:s.y+4,dtS:s,dlift:104});units.push(u);return u;}
{const _r=rcUpd;rcUpd=function(dt){_r.apply(this,arguments);if(G.over)return;
  for(const s of dtTowers())if(s.state==='ok'&&!units.some(u=>!u.dead&&u.dtS===s)){s.archT=(s.archT||0)+dt;if(s.archT>=DTW.archerWait){s.archT=0;dtArcher(s);}}};}
// destroyed: rubble (the kingdom's builders leave it alone); its archer climbs down and joins the town guard
{const _h=hurtStruct;hurtStruct=function(s,d){if(isDT(s)&&s.state==='druin')return;const r=_h.apply(this,arguments);
  if(isDT(s)&&s.state==='ruin'){s.state='druin';s.fire=0;G.rcTowLost=(G.rcTowLost||0)+1;for(const u of units)if(u.dtS===s&&!u.dead){u.post=null;u.dtS=null;u.dlift=0;rcMakeGuard(u,rcTownGuards().length);}}return r;};}
function drawDTower(s){const x=s.x,y=s.y;if(s.state==='druin'){rubble(x,y+4,30,1,(x*7+y)|0);return;}
  ell(x+8,y+6,28,10,'rgba(0,0,0,.25)');
  poly([x-19,y,x+19,y,x+15,y-96,x-15,y-96],'#d9b780');poly([x+6,y,x+19,y,x+15,y-96,x+5,y-96],'#c09a62');
  for(let k=1;k<4;k++)line(x-18+k*.9,y-k*24,x+18-k*.9,y-k*24,'#b48c58',1.5);
  rect(x-3,y-70,6,14,'#4a3020');rect(x-3,y-40,6,14,'#4a3020');rect(x-7,y-16,14,16,'#5a3a22');
  rect(x-20,y-104,40,9,'#c9a46c');rect(x-20,y-104,40,3,'#e2c48e');for(let k=0;k<5;k++)rect(x-20+k*9,y-112,5,8,'#d9b780');
  rect(x-1,y-150,2,38,'#5a4030');poly([x+1,y-150,x+18,y-144,x+1,y-138],'#2e86c1');poly([x+1,y-144,x+12,y-141,x+1,y-138],'#f1c40f');
  if(s.fire>0)for(let i=0;i<3;i++)ell(x+R(-12,12),y-20-R(0,80),4,7,'rgba(255,150,40,.8)');
  if(s.hp<s.maxHp){rect(x-22,y+12,44,4,'#400');rect(x-22,y+12,44*s.hp/s.maxHp,4,'#d33');}}
{const _k=drawStructK;drawStructK=function(s){if(isDT(s)){drawDTower(s);return true;}return _k.apply(this,arguments);};}
{const _p=drawPerson;drawPerson=function(u){if(u.dlift&&u.dtS&&u.dtS.state==='ok'){ctx.save();ctx.translate(0,-u.dlift);try{return _p.apply(this,arguments);}finally{ctx.restore();}}return _p.apply(this,arguments);};}
// save / load (positions + health), a new level / new game starts without them
{const _ss=svSnapshot;svSnapshot=function(){G.dtSave=dtTowers().map(s=>[s.x|0,s.y|0,s.state,Math.round(s.hp)].join(',')).join(';');return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);for(let i=structures.length-1;i>=0;i--)if(isDT(structures[i]))structures.splice(i,1);for(const u of units)if(u.dtS)u.dead=u.gone=true;DTW_SPOTS=null;
  if(typeof G.dtSave==='string'&&G.dtSave)for(const q of G.dtSave.split(';')){const[x,y,st,hp]=q.split(',');const s=dtAdd(+x,+y,st==='druin'?'druin':'ok');s.hp=st==='druin'?0:Math.max(1,+hp||s.maxHp);}return r;};}
{const _ng=newGame;newGame=function(){DTW_SPOTS=null;return _ng.apply(this,arguments);};}
(function(){if(typeof TALLY_SECT==='undefined')return;const B=TALLY_SECT.find(q=>q.id==='build');if(!B)return;if(!B.keys.find(q=>q[0]==='b:dtower'))B.keys.push(['b:dtower','Sandhaven towers']);TALLY_LABEL['b:dtower']='Sandhaven towers';})();
