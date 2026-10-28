// ======================= partFB: WORKERS FIGHT BACK - farmers, lumberjacks and miners defend their worksite with their tools =======================
// Before the Militia tier, plain villagers still run from the dragon, but a farmer, lumberjack or miner who is at work
// stands up to it: a pitchfork/scythe prod, an axe chop or a pickaxe clonk (about 2 damage each, every ~1.6-2 s).
// When the dragon leaves (or flies too high to reach) they go back to work. Soldiers still hit far harder (4 per swing).
const FBW={siteR:460,hold:110,spd:50,
  arm:{woodcutter:'axe',miner:'pick'},say:{axe:['Off my trees!','Timber-r-r!','Shoo!'],pick:['Not our mine!','Pickaxe up!','Go away!'],fork:['Off my farm!','Shoo, dragon!','Pitchfork!'],scythe:['Off my crops!','Shoo!']}};
function fbArm(u){if(u.job==='farmer'){if(!u.kmTool){G.kmFarmN=(G.kmFarmN||0)+1;u.kmTool=G.kmFarmN%2?'fork':'scythe';}return u.kmTool;}return FBW.arm[u.job]||null;}
function fbSite(u){if(u.job==='woodcutter')return{x:CAMP.x,y:CAMP.y+30,name:'logging camp'};if(u.job==='miner')return{x:MINE.x,y:MINE.y+30,name:'mine'};
  if(u.job==='farmer'){const F=FARMS[u.farm];if(F)return{x:F.field.x+F.field.w/2,y:F.field.y+F.field.h/2,name:'farm'};}return null;}
// who may fight back: a worker at (or near) their worksite, not hauling a cart, not inside the mine, not on special duty
function fbWorker(u){if(!u||u.dead||u.type!=='villager'||u.inside||u.tax||u.carav||u.scart||u.wk||u.rcF||u.water||u.task)return false;
  if(G.milOn&&(u.militia||u.arm))return false; // the Militia tier has its own (kingdom-wide) fighting
  if(u.job==='miner'&&(u.state==='haul'||u.state==='return'||u.state==='cart'||u.cart))return false;
  const S=fbSite(u);return !!S&&fbArm(u)&&d2(u.x,u.y,S.x,S.y)<FBW.siteR;}
function fbFight(u,dt){const W=KM_W[u.fbArm]||KM_W.axe,S=fbSite(u),dd=dist(u,D),low=D.alt<.55;
  u.poke=Math.max(0,(u.poke||0)-dt);u.atk=(u.atk||0)-dt;u.face=D.x>u.x?1:-1;
  if(low&&dd>W.reach*.8){const[tx,ty]=kmClampLeash({x:S.x,y:S.y},D.x,D.y);const k=d2(tx,ty,S.x,S.y);if(k<FBW.siteR)kmMove(u,tx,ty,FBW.spd,dt);u.anim+=dt*9;}
  else if(!low){u.anim+=dt*4;if(rnd()<dt*.4)float(u.x,u.y-26,'Come down here!','#fdd');}
  if(low&&D.alt<DR.hitAltSword&&dd<W.reach&&u.atk<=0){u.atk=W.cd*R(.92,1.1);u.poke=.25;hurtDragon(W.dmg,'tool');u.fbHits=(u.fbHits||0)+1;
    if(rnd()<.35)float(D.x+R(-20,20),D.y-heightOf()-64,{axe:'Chop!',pick:'Clonk!',fork:'Prod!',scythe:'Swish!'}[u.fbArm]||'Bonk!','#ffe0b0');}
  u.face=D.x>u.x?1:-1;}
function fbBackToWork(u){u.fbArm=null;u.engaged=false;u.poke=0;
  if(u.job==='woodcutter')u.state=u.tree&&u.tree.state==='ok'?'towalk':'idle';else if(u.job==='miner')u.state='towalk';else u.state='idle';u.tgt=null;}
{const _v=updVillager;updVillager=function(u,dt){
  if(u.state==='fbfight'&&!fbWorker(u)){fbBackToWork(u);}
  if(!G.over&&fbWorker(u)){const dd=dist(u,D),fighting=u.state==='fbfight';
    if(dd<fearR()||fighting&&dd<fearR()+FBW.hold){
      if(!fighting){dropCarry(u);if(u.tree&&u.job==='woodcutter'){u.tree.claimed=null;u.tree=null;}u.state='fbfight';u.fbArm=fbArm(u);u.atk=R(.2,.8);u.fbN=(u.fbN||0)+1;
        if(rnd()<.5){const L=FBW.say[u.fbArm];float(u.x,u.y-24,L[RI(0,L.length-1)],'#fdd');}}
      fbFight(u,dt);return;}
    if(fighting){fbBackToWork(u);if(rnd()<.3)float(u.x,u.y-24,'Back to work!','#cfe');}}
  return _v.apply(this,arguments);};}
// draw the worker's tool (no red armband: they're not the militia)
{const _p=drawPerson;drawPerson=function(u){const r=_p.apply(this,arguments);if(u.fbArm&&!u.arm&&!u.dead&&u.state==='fbfight')kmDrawTool({arm:u.fbArm,poke:u.poke||0,throwA:0,hp:u.hp,maxHp:u.maxHp,noBand:true},u.x,u.y,u.face||1,Math.sin(u.anim||0)*1.2);return r;};}
