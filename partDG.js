// ======================= partDG: quick dodge dashes (hunters + agile animals) & map exploration kept between levels =======================
// A hunter or a quick, agile animal that has noticed the dragon (been near it for a moment) may side-step an incoming
// bite, fire breath, lava glob, stomp or claw: a short sideways dash with a little dust puff. Fair: only sometimes, then a
// 3.5 s cooldown (a failed try also blocks re-tries for ~1 s), never while carried / grabbed / eaten / inside, never the
// slow or heavy animals. Dodging only moves the unit: it does not touch packs, alphas, rallies or herds.
const DG={cd:3.5,failCd:1.1,dash:.22,speed:270,aware:.6,awareR:330,
  ch:{hunter:.45,deer:.35,rabbit:.4,fox:.35,wolf:.35,alpha:.45,lion:.35,cougar:.4,jaguar:.4,cheetah:.45,tiger:.3,gazelle:.4,monkey:.4,jackal:.35,hyena:.3,roadrunner:.45,meerkat:.35},
  n:0,tries:0,on:true};
function dgChance(u){if(!u||u.dead||u.inside||u.eaten||u.carried||u.grabbed||u.princess||u.isPrincess||u.mounted||u.militia&&u.type!=='hunter')return 0;
  if(u.type==='hunter')return DG.ch.hunter;if(u.type!=='animal')return 0;if(u.species==='wolf'&&u.alpha)return DG.ch.alpha;return DG.ch[u.species]||0;}
function dgCan(u){return DG.on&&!(G&&(G.over||G.won))&&dgChance(u)>0&&!(u.dgCd>0)&&(u.dgAw||0)>=DG.aware&&!(u.daze>0)&&!(u.dizzy);}
// roll once; on success start the dash. Returns true if the unit dodged.
function dgTry(u,src){if(!dgCan(u))return false;DG.tries++;if(rnd()>=dgChance(u)){u.dgCd=DG.failCd;return false;}
  const ax=u.x-D.x,ay=u.y-D.y,a=Math.atan2(ay,ax);let side=angDiff(a,D.ang)>=0?1:-1;if(rnd()<.15)side=-side;
  const b=a+side*Math.PI/2*.85;u.dgT=DG.dash;u.dgVx=Math.cos(b)*DG.speed;u.dgVy=Math.sin(b)*DG.speed;u.dgCd=DG.cd;u.dgInv=DG.dash+.1;
  DG.n++;G.stats.dodges=(G.stats.dodges||0)+1;puff(u.x,u.y+4,7,'rgba(190,170,130,',55,6);
  float(u.x,u.y-30,u.type==='hunter'?'Dodged!':'Dodge!','#e8e0c8');return true;}
// bite: the dodgers leave the jaws before the bite resolves (outermost tryEat wrapper)
{const _bt=biteTargets;biteTargets=function(){const L=_bt.apply(this,arguments);return L.filter(u=>!(u.dgInv>0));};}
{const _te=tryEat;tryEat=function(){if(!(D.eatCD>0)&&!D.princess){let T=[];try{T=_bt0();}catch(e){}for(const u of T.slice(0,BITE_MAX))dgTry(u,'bite');}return _te.apply(this,arguments);};}
function _bt0(){return biteTargets();}
// fire / lava / stomp / claw: the first hit of an attack can be side-stepped (burning that was already going on can't)
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(u&&!u.dead&&(src==='fire'||src==='lava'||src==='stomp'||src==='scratch')){
    if(u.dgInv>0){if(src==='fire'&&!(u._pb>0))u.burn=0;return;}
    if((src!=='fire'||!(u._pb>0))&&dgTry(u,src)){if(!(u._pb>0))u.burn=0;return;}}
  return _hu.apply(this,arguments);};}
function dgUpd(dt){const R2=DG.awareR*DG.awareR,dx0=D.x,dy0=D.y;for(const u of units){if(u.dead)continue;const dx=u.x-dx0,dy=u.y-dy0,near=dx*dx+dy*dy<R2;
  if(!near&&!(u.dgAw>0)&&!(u.dgCd>0)&&!(u.dgInv>0)&&!(u.dgT>0)){u._pb=u.burn||0;continue;}if(!(dgChance(u)>0))continue;
  u.dgAw=near?Math.min(3,(u.dgAw||0)+dt):Math.max(0,(u.dgAw||0)-dt*2);
  if(u.dgCd>0)u.dgCd-=dt;if(u.dgInv>0)u.dgInv-=dt;
  if(u.dgT>0){u.dgT-=dt;u.x=clamp(u.x+u.dgVx*dt,WX0+20,WX1-20);u.y=clamp(u.y+u.dgVy*dt,WY0+20,WY1-20);if(rnd()<dt*30)puff(u.x,u.y+4,1,'rgba(190,170,130,',25,4);}
  u._pb=u.burn||0;}}
{const _up=update;update=function(dt){const r=_up.apply(this,arguments);if(G&&scene==='play'&&!paused)dgUpd(dt);return r;};}

// ---- exploration is kept through level-ups (a brand-new game starts unexplored); manual/auto saves already store FOG + G.visited ----
{const _nl=nextLevel;nextLevel=function(){const keep=FOG?FOG.slice():null,vis=Object.assign({},G.visited||{});const r=_nl.apply(this,arguments);
  if(keep&&FOG&&keep.length===FOG.length){for(let k=0;k<keep.length;k++)if(keep[k])FOG[k]=1;fogDirty=true;}
  G.visited=Object.assign(vis,G.visited||{});return r;};}
