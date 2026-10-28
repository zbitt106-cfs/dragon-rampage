// ================= partRC: the RICH desert caravan + Sandhaven's desert soldiers & archers =================
// One of Sandhaven's two camel caravans is a rich one: colourful camels, a treasure chest (20 gold) and two richly dressed traders.
// It walks the roads from Sandhaven to the castle gate and back, guarded by desert soldiers (scimitar + round shield) and desert archers.
// Kill the lead trader or the treasure camel and the 20 gold goes straight to your lair (via the auto-deposit). It comes back from Sandhaven
// after a while, and fresh every level. Surviving guards stay on as Sandhaven's town guard; during a kingdom-wide muster the town is guarded too.
// desert troops are tougher than regular ones (regular foot soldier 24 HP / 4 dmg, archer 22 HP / 4 dmg): ~1.45x HP, 1.25x damage.
// The rich caravan walks at 67% of its old pace with 10 desert soldiers + 6 desert archers in formation; Sandhaven keeps its own garrison (3 + 2).
const RCV={cur:null,gold:20,respawn:75,first:6,sol:10,arc:6,solHp:35,arcHp:32,dmgMul:1.25,spd:.67,arcRange:420,wait:6,townCap:4,milN:[2,1],milCd:30,garSol:3,garArc:2,guardR:240,predDmg:5,predCd:1.35,arcCd:2};
function rcEnds(){return{a:{x:DTOWN.x+40,y:DTOWN.y+60},b:{x:GATE.x+60,y:GATE.y+70}};}
function rcPath(){const e=rcEnds();let P=null;try{const q=scRoute(e.a,e.b);P=q&&q.P;}catch(_){P=null;}if(!P||P.length<2)P=[e.a,e.b];return P.map(p=>({x:p.x,y:p.y}));}
function rcAlive(){const c=RCV.cur;return !!(c&&!c.done);}
function mkDSol(x,y,o){return mkUnit('knight',x,y,Object.assign({foot:true,dsol:true,hp:RCV.solHp,maxHp:RCV.solHp,atk:0,colr:'#d8b878',dmgMul:RCV.dmgMul,born:G.t},o||{}));}
function mkDArc(x,y,o){return mkUnit('archer',x,y,Object.assign({darch:true,hp:RCV.arcHp,maxHp:RCV.arcHp,dmgMul:RCV.dmgMul,shootT:R(1,3),born:G.t},o||{}));}
function spawnRich(o){o=o||{};const P=o.path||rcPath(),ri=Math.max(0,Math.min(P.length-1,o.ri==null?0:o.ri)),dir=o.dir||1,p=o.x!=null?{x:o.x,y:o.y}:P[0];
  // keep the desert at two caravans: retire a plain one that is out of sight
  const plain=units.filter(u=>u.carav&&u.type==='villager'&&!u.dead&&!u.rc);if(plain.length>=2){const v=plain.sort((a,b)=>dist(b,D)-dist(a,D))[0];if(dist(v,D)>900){for(const c of units)if(c.carav&&c.type==='animal'){let L=c;while(L&&L.type==='animal')L=L.leader;if(L===v){c.dead=c.gone=true;}}v.dead=v.gone=true;}}
  const lead=spawnVillager(p.x,p.y,'trader',DTOWN.vi);Object.assign(lead,{carav:true,rc:1,rcLead:true,route:P,ri,rcDir:dir,shirt:'#7a1f6a',turban:1,hp:14,maxHp:14,rcWait:o.wait||0});
  const t2=spawnVillager(p.x-20,p.y+16,'trader',DTOWN.vi);Object.assign(t2,{rc:1,rcF:lead,shirt:'#1f5a8a',turban:1,hp:12,maxHp:12});
  if(o.t2===false){t2.dead=t2.gone=true;}
  const pal=[['#c0392b','#f1c40f','#2e86c1'],['#8e44ad','#f39c12','#16a085'],['#d35400','#27ae60','#f1c40f']],camels=[];let prev=lead;
  const nc=o.camels==null?3:o.camels;for(let k=0;k<nc;k++){const c=mkUnit('animal',p.x-(k+1)*34,p.y,{species:'camel',carav:true,rc:1,rcPal:pal[k%3],leader:prev,hp:34,maxHp:34,face:1});if(k===0&&o.chest!==false)c.rcChest=true;units.push(c);camels.push(c);prev=c;}
  const guards=[];const gl=o.guards||[...Array(RCV.sol)].map(()=>({k:'dsoldier'})).concat([...Array(RCV.arc)].map(()=>({k:'darcher'})));
  gl.forEach((g,i)=>{const x=g.x!=null?g.x:p.x+R(-30,30),y=g.y!=null?g.y:p.y+R(-20,30);const u=g.k==='darcher'?mkDArc(x,y):mkDSol(x,y);if(g.hp)u.hp=g.hp;u.escort=lead;u.eo=[-1.6,1.6,-.6,.6][i%4];u.rcG=true;u.rcSlot=u.darch?gl.slice(0,i).filter(q=>q.k==='darcher').length:gl.slice(0,i).filter(q=>q.k!=='darcher').length;units.push(u);guards.push(u);});
  RCV.cur={lead,t2,camels,guards,done:false};G.rcSpawned=(G.rcSpawned||0)+1;return RCV.cur;}
// the lead trader walks the road there and back again (rests at each end); the second trader follows him
{const _c=updCaravan;updCaravan=function(u,dt){if(!u.rcLead||u.type!=='villager')return _c.apply(this,arguments);u.anim=(u.anim||0)+dt*4;
  const dd=dist(u,D);if(dd<200&&!G.over){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,75,dt);if(!u.yelp||G.t-u.yelp>6){u.yelp=G.t;float(u.x,u.y-30,['Guards! Protect the treasure!','Dragon! Hold the line!'][RI(0,1)],'#ffe0a0');}return true;}
  if(u.rcWait>0){u.rcWait-=dt;return true;}
  const P=u.route,t=P[u.ri];if(!t)return true;u.rcHd=Math.atan2(t.y-u.y,t.x-u.x);if(moveTo(u,t.x,t.y,38*RCV.spd,dt)||dist(u,t)<16){const n=u.ri+u.rcDir;if(n<0||n>=P.length){u.rcDir=-u.rcDir;u.rcWait=RCV.wait;u.rcTrips=(u.rcTrips||0)+1;}else u.ri=n;}
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
function rcMakeGuard(u,i){u.escort=null;u.rcG=false;u.dguard=true;const P=rcTownPost(i);u.px=P.x;u.py=P.y;if(u.dsol){u.post='guard';u.slot='d'+i;}}
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
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);const c=RCV.cur,g=u=>({k:u.dsol?'dsoldier':'darcher',hp:Math.round(u.hp),x:Math.round(u.x),y:Math.round(u.y),garr:!!u.garr});
  d.RCV={cur:c&&!c.done&&!c.lead.dead?{x:Math.round(c.lead.x),y:Math.round(c.lead.y),ri:c.lead.ri|0,dir:c.lead.rcDir||1,wait:+(c.lead.rcWait||0).toFixed(1),t2:!!(c.t2&&!c.t2.dead),
    camels:c.camels.filter(k=>!k.dead).length,chest:c.camels.some(k=>k.rcChest&&!k.dead),guards:c.guards.filter(u=>!u.dead).map(g)}:null,town:rcTownGuards().map(u=>Object.assign(g(u),{mil:!!u.milG})),garDone:!!G.rcGar};return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(!d||!d.RCV)return r;
  for(let i=units.length-1;i>=0;i--){const u=units[i];if(u.rc||u.dsol||u.darch)units.splice(i,1);}RCV.cur=null;
  if(d.RCV.cur){const c=d.RCV.cur;spawnRich({x:c.x,y:c.y,ri:c.ri,dir:c.dir,wait:c.wait,t2:c.t2,camels:c.camels,chest:c.chest,guards:c.guards});G.rcSpawned=Math.max(0,(G.rcSpawned||1)-1);}
  (d.RCV.town||[]).forEach((t,i)=>{const u=t.k==='darcher'?mkDArc(t.x,t.y):mkDSol(t.x,t.y);u.hp=t.hp||u.hp;if(t.mil)u.milG=true;if(t.garr)u.garr=true;rcMakeGuard(u,i);units.push(u);});G.rcGar=(d.RCV.town||[]).some(t=>t.garr)||!!d.RCV.garDone;
  return r;};}

// ---- Sandhaven's standing garrison: 3 desert soldiers + 2 desert archers guard the town every level (separate from the caravan escort) ----
function rcGarrison(){if(G.rcGar||typeof DTOWN==='undefined')return;G.rcGar=true;let i=0;
  for(let k=0;k<RCV.garSol;k++){const P=rcTownPost(i);const u=mkDSol(P.x,P.y,{garr:true});rcMakeGuard(u,i++);units.push(u);}
  for(let k=0;k<RCV.garArc;k++){const P=rcTownPost(i);const u=mkDArc(P.x,P.y,{garr:true});rcMakeGuard(u,i++);units.push(u);}G.rcGarN=(G.rcGarN||0)+1;}
// ---- the escort marches in formation: soldiers in two files of five down the flanks, archers paired at the front, rear and outer flanks ----
const RC_FORM={sol:[[10,-30],[-20,-30],[-50,-30],[-80,-30],[-110,-30],[10,30],[-20,30],[-50,30],[-80,30],[-110,30]],arc:[[42,-16],[42,16],[-150,-16],[-150,16],[-50,-64],[-50,64]]};
function rcSlotPos(k,L){const F=k.darch?RC_FORM.arc:RC_FORM.sol,s=F[(k.rcSlot||0)%F.length],a=L.rcHd||0,f=s[0],l=s[1];return{x:L.x+Math.cos(a)*f-Math.sin(a)*l,y:L.y+Math.sin(a)*f*.8+Math.cos(a)*l*.8};}
{const _e=escortStep;escortStep=function(k,dt){const c=RCV.cur;if(!(k.rcG&&c&&!c.done&&k.escort===c.lead&&!c.lead.dead))return _e.apply(this,arguments);
  if(typeof gpGuardStep==='function'&&gpGuardStep(k,dt))return true;
  const dd=dist(k,D);if(dd<260&&D.alt<.6)return false;if(k.darch&&dd<RCV.arcRange&&!G.over)return false;
  const L=c.lead,T=rcSlotPos(k,L),dt2=dist(k,T);if(dt2>4)moveTo(k,T.x,T.y,dt2>120?80:Math.max(30,Math.min(60,dt2*2)),dt);k.face=L.face||1;k.born=G.t;k.retreat=false;return true;};}
