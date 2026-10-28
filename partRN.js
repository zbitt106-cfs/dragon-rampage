// ================= partRN: PRINCESS RANSOM =================
// Delivering Princess Elizabeth to the lair (level win) makes King William pay a ransom. It lands in the
// hoard at the start of the next level, on top of the carried-over gold, with coins flying into the pile.
// Ransom = 100 + 50 per castle level already cleared beyond the first + 10% of the gold still in the castle treasury.
// It counts toward hoard-raid thresholds, but raids still respect the cooldown (no instant raid at level start).
const RANSOM={base:100,perLvl:50,treasury:.10};
function ransomFor(lvl,treasury){return Math.round(RANSOM.base+RANSOM.perLvl*Math.max(0,lvl-1)+RANSOM.treasury*Math.max(0,treasury||0));}
function castleTreasury(){return goldPiles.reduce((a,p)=>a+Math.max(0,p.amt||0),0);}
{const _nl=nextLevel;nextLevel=function(){
  const won=!!G.won&&PR.state==='lair',lvl=G.lvl,amt=won?ransomFor(lvl,castleTreasury()):0;
  const r=_nl.apply(this,arguments);
  if(amt>0){const carried=G.hoardCarry||0;G.stash+=amt;G.ransom=amt;G.ransomTot=(G.ransomTot||0)+amt;
    RAID.cd=Math.max(RAID.cd,45); // never an instant raid at level start, whatever thresholds the ransom crosses
    const text=`King William pays a ransom for Princess Elizabeth: +${amt} gold!`;
    G.banner={text,sub:`Castle Level ${G.lvl}  ·  ${carried>0?`Hoard carried over: ${carried} gold  ·  `:''}Hoard now ${G.stash} gold`,extra:'A tougher castle: thicker gate, more tower archers and guards, more gold.',t:4.5};
    if(typeof hoardDrop==='function')hoardDrop(amt,LAIR.x+220,LAIR.y-140);
    float(LAIR.x,LAIR.y-110,`Ransom +${amt} gold!`,'#ffd84a');if(typeof SFX!=='undefined')SFX.play('coin');}
  else G.ransom=0;
  return r;};}
