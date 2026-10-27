// ======================= MONSTER FEAST + GLUTTON: permanent max-health growth on this life =======================
// Eating the giant squid (kraken) or a sand worm: +50 max health each, plus a full heal.
// Glutton: food eaten (sized by how big / filling each thing is) fills "whale's worth" milestones. Each one gives +5 max health;
// the 1st needs 1 whale's worth, the 2nd 2 more whales, the 3rd 3 more... (a real whale = exactly one whale's worth).
// All of it stays on the same life across castle levels and resets on death / new game (D.* fields are in saves).
const MH={feast:50};
const GLUT={gain:5};
// food values (≈ size / how filling it is); the milestone unit is one whale
const FOOD={whale:75,
  villager:10,shopper:10,farmer:10,logger:10,miner:10,mason:10,trader:10,keeper:10,taxman:10,carter:10,militia:10,hunter:18,sailor:10,islander:12,pirate:12,crew:10,
  foot:12,knight:18,archer:12,cavalry:40,champ:30,
  chicken:5,rabbit:6,crow:3,sparrow:2,gull:3,duck:5,goose:6,hawk:4,eagle:6,fish:4,school:5,lakeschool:5,crab:3,beaver:7,lizard:4,snake:5,dscorp:4,
  fox:8,dfox:8,wolf:12,goat:12,mgoat:15,sheep:14,pig:16,boar:16,deer:20,seal:22,iseal:24,shark:20,horse:24,carthorse:24,cow:26,camel:30,cougar:32,bear:40,
  sandworm:100,squid:150};
const WHALE=FOOD.whale;
function foodOf(k){return FOOD[k]!==undefined?FOOD[k]:(HEAL[k]||SEAHEAL[k]||10);}
function foodKeyU(u){if(!u)return null;if(u.type==='sea')return u.kind;if(u.type==='knight'&&u.champ)return'champ';return typeof tallyKeyU==='function'?tallyKeyU(u):(u.species||u.type);}
// milestone n (1-based) needs n whales; total food for the first n milestones = WHALE*n(n+1)/2
function glutCum(n){return WHALE*n*(n+1)/2;}
function glutProg(){const n=D.glutN||0,have=Math.max(0,(D.food||0)-glutCum(n))/WHALE,need=n+1;return{n,have:Math.min(have,need),need,frac:Math.min(1,have/need)};}
function glutLine(){const p=glutProg();return`🐋 Glutton · Next +${GLUT.gain} max health: ${Math.floor(p.frac*100)}%  ·  earned +${p.n*GLUT.gain}`;}
function drawGlutBar(x,y,w,h){const p=glutProg();ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#4fb3e8';ctx.fillRect(x+1,y+1,(w-2)*p.frac,h-2);
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);txt(glutLine(),x+w/2,y+h-4,Math.min(12.5,h-3),'#fff','center',false);}
function mhBanner(text,sub,t){const b=G.banner;
  if(b&&b.t>1.2&&/^Max health up/.test(b.text||'')){b.sub=(b.sub?b.sub+'  ·  ':'')+text+' (now '+D.maxHp+')';return;}
  if(b&&b.t>1.2&&!/^A whale/.test(b.text||'')){if(typeof showToast==='function')showToast('❤ '+text);return;}
  G.banner={text,sub,t:t||4.5};}
function maxHpUp(what,x,y){const gain=MH.feast;D.hpBonus=(D.hpBonus||0)+gain;D.feastBonus=(D.feastBonus||0)+gain;D.hpUps=(D.hpUps||0)+1;D.maxHp+=gain;D.hp=D.maxHp;D.healFx=1;
  G.banner={text:`Max health up! (+${gain})`,sub:`${what} makes you stronger: max health ${D.maxHp} and fully healed`,t:4.5};
  float(D.x,D.y-heightOf()-130,`MAX HEALTH +${gain}!`,'#7aff8a');sparkle(D.x,D.y-heightOf(),30);if(typeof SFX!=='undefined'&&SFX.play)SFX.play('coin',D.x,D.y,1);}
function glutEat(food){if(!D||G.over||!(food>0))return;D.food=Math.round(((D.food||0)+food)*100)/100;
  while(D.food>=glutCum((D.glutN||0)+1)){D.glutN=(D.glutN||0)+1;const n=D.glutN;D.hpBonus=(D.hpBonus||0)+GLUT.gain;D.maxHp+=GLUT.gain;D.hp=Math.min(D.maxHp,D.hp+GLUT.gain);D.healFx=Math.max(D.healFx||0,.6);
    mhBanner(`A whale's worth eaten! Max health +${GLUT.gain}`,`Max health ${D.maxHp}  ·  keep feasting: the next +${GLUT.gain} takes even more food`,3.5);
    float(D.x,D.y-heightOf()-110,`WHALE'S WORTH! +${GLUT.gain} MAX HP`,'#9aff7a');sparkle(D.x,D.y-heightOf(),16);if(typeof SFX!=='undefined'&&SFX.play)SFX.play('gulp',D.x,D.y,.8);}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(D){D.baseMaxHp=D.maxHp-(D.hpBonus||0);if(!D.hpBonus){D.hpBonus=0;D.hpUps=0;D.feastBonus=0;}if(D.food===undefined){D.food=0;D.glutN=0;}}return r;};}
{const _es=eatSea;eatSea=function(u){const was=u&&u.dead,k=u&&u.kind,n0=u&&u.n;const r=_es.apply(this,arguments);
  if(u&&k==='squid'&&!was&&u.dead){float(u.x,u.y-60,'GULP! Calamari!','#ffd27a');maxHpUp('The giant squid');}
  if(u&&((n0!==undefined&&u.n<n0)||(!was&&u.dead)))glutEat(foodOf(k));return r;};}
{const _eu=eatUnit;eatUnit=function(u){const sea=u&&u.type==='sea',was=u&&u.dead,s=u&&u.species;const r=_eu.apply(this,arguments);
  if(u&&s==='sandworm'&&!was&&u.dead){float(u.x,u.y-80,'GULP! Slurped the sand worm!','#ffd27a');maxHpUp('The sand worm');}
  if(u&&!sea&&!was&&u.dead)glutEat(foodOf(foodKeyU(u)));return r;};} // sea units are counted inside eatSea
{const _eb=tryEatBird;tryEatBird=function(){const live=birds.filter(b=>!b.dead);const r=_eb.apply(this,arguments);let f=0;for(const b of live)if(b.dead)f+=foodOf(b.kind);glutEat(f);return r;};}
// health bar: grows with the bonus but the on-screen width is capped (the number is always shown in the bar)
const HPBAR={base:230,max:400};
function hpBarW(){const base=D.baseMaxHp||D.maxHp,f=Math.max(1,D.maxHp/base);return Math.round(Math.min(HPBAR.max,HPBAR.base*Math.sqrt(f)));}
