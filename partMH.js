// ======================= MONSTER FEAST: eating the giant squid (kraken) or a sand worm permanently raises max health on this life =======================
const MH={frac:.10};
function maxHpUp(what,x,y){const gain=Math.max(10,Math.round(D.maxHp*MH.frac));D.hpBonus=(D.hpBonus||0)+gain;D.hpUps=(D.hpUps||0)+1;D.maxHp+=gain;D.hp=D.maxHp;D.healFx=1;
  G.banner={text:`Max health up! (+${gain})`,sub:`${what} makes you stronger: max health ${D.maxHp} and fully healed`,t:4.5};
  float(D.x,D.y-heightOf()-130,`MAX HEALTH +${gain}!`,'#7aff8a');sparkle(D.x,D.y-heightOf(),30);if(typeof SFX!=='undefined'&&SFX.play)SFX.play('coin',D.x,D.y,1);}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(D){D.baseMaxHp=D.maxHp-(D.hpBonus||0);if(!D.hpBonus){D.hpBonus=0;D.hpUps=0;}}return r;};}
{const _es=eatSea;eatSea=function(u){const was=u&&u.dead,k=u&&u.kind;const r=_es.apply(this,arguments);if(u&&k==='squid'&&!was&&u.dead){float(u.x,u.y-60,'GULP! Calamari!','#ffd27a');maxHpUp('The giant squid');}return r;};}
{const _eu=eatUnit;eatUnit=function(u){const was=u&&u.dead,s=u&&u.species;const r=_eu.apply(this,arguments);if(u&&s==='sandworm'&&!was&&u.dead){float(u.x,u.y-80,'GULP! Slurped the sand worm!','#ffd27a');maxHpUp('The sand worm');}return r;};}
// health bar grows with the bonus (230px at base, longer per feast, capped so it fits the screen)
function hpBarW(){const base=D.baseMaxHp||D.maxHp;return Math.round(Math.min(230*1.8,230*D.maxHp/base));}
