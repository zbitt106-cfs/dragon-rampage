
// ===================== partAL: turf guardians (male lion, white alpha wolf, silverback, any partTF leader) =====================
// A full-health leader can't be swallowed on the first bite: the bite is shrugged off (and stings him).
// One or two hits of any kind (bite, claw, stomp, fire burst, lava) bring him under AL_TH of his max HP,
// then he is dizzy (little orbiting stars) and can be gulped like any other animal.
const AL_TH=.78,AL_REBUFF=.24;
const alWeak=u=>u.hp<=u.maxHp*AL_TH;
function alTough(u){return tfIsLeader(u)&&!alWeak(u);}
function alRebuff(u){const L=TF_L[u.species];hurtUnit(u,Math.ceil(u.maxHp*AL_REBUFF),'bite');u.roarFx=1.2;G.alRebuffs=(G.alRebuffs||0)+1;
  if(dist(u,D)<1200)float(u.x,u.y-60,`${L.who} shrugs off the bite!`,'#ffd27a');}
for(const sp in TF_L){const prev=TOUGH[sp];
  TOUGH[sp]={chk:u=>tfIsLeader(u)?!alWeak(u):!!(prev&&prev.chk(u)),hit:u=>{if(tfIsLeader(u))alRebuff(u);else if(prev)prev.hit(u);}};}
// small dizzy stars over a weakened leader
{const _da=drawAnimal;drawAnimal=function(u){_da.apply(this,arguments);
  if(!u.dead&&tfIsLeader(u)&&alWeak(u)){if(!u.alDz){u.alDz=1;G.alDizzy=(G.alDizzy||0)+1;}
    const L=TF_L[u.species],sc=L.scale||1.2,hy=u.y-38*sc,t=G.t*3.2;
    for(let i=0;i<3;i++){const a=t+i*TAU/3;hnStar(u.x+Math.cos(a)*14*sc,hy+Math.sin(a)*4,3.2,i%2?'#ffe35a':'#fff7c0');}}
  else if(u.alDz&&!alWeak(u))u.alDz=0;};}
