// ================= partGA: gold goes straight to the lair hoard =================
// Every pick-up path (castle piles, coins / tax sacks / caravans, pirate loot, shells...) still adds to D.gold; this sweep moves it
// into G.stash the same frame, so nothing is ever carried. The pile, raid thresholds/cooldown (read G.stash), ransom and saves see it at once.
const GA={pop:[],total:0};
function gaDeposit(){if(!G||!(D.gold>0))return 0;const n=Math.round(D.gold);D.gold=0;
  G.stash=(G.stash||0)+n;GA.total+=n;G.stats.autoGold=(G.stats.autoGold||0)+n;
  if(typeof hoardDrop==='function'&&typeof HX==='function')hoardDrop(n,HX()+R(-30,30),HY()-140);// coins rain onto the pile at the lair
  const last=GA.pop[GA.pop.length-1];if(last&&last.t<.35)last.n+=n;else GA.pop.push({n,t:0});if(GA.pop.length>4)GA.pop.shift();
  if(typeof SFX!=='undefined')SFX.play('coin',D.x,D.y,.5);return n;}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);gaDeposit();for(const p of GA.pop)p.t+=dt;GA.pop=GA.pop.filter(p=>p.t<1.4);return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);GA.pop=[];D.gold=0;return r;};}
// "+N" with a little coin rising from the dragon icon on the HUD pill
{const _uiG=uiGold;uiGold=function(x,y,fs){const w=_uiG.apply(this,arguments),s=(fs||12)/12;ctx.font=`bold ${fs||12}px Georgia`;
  const dx=x+w-ctx.measureText(uiAmt(G.stash||0)).width-15*s+4*s;UI.dragonXY={x:dx,y};return w;};}
{const _dp=drawStockPill;drawStockPill=function(){const h=_dp.apply(this,arguments),p=UI.dragonXY;if(!p||!GA.pop.length)return h;
  for(const q of GA.pop){const k=q.t/1.4,yy=p.y+46-k*22,a=Math.max(0,1-k*k);ctx.globalAlpha=a;uiCoin(p.x-6,yy,1.15);txt(`+${q.n}`,p.x+1,yy+4,12,'#ffe066','left');}ctx.globalAlpha=1;UI.popDrawn=(UI.popDrawn||0)+1;return h;};}
// saves never hold "carried" gold: sweep it into the hoard first; old saves with carried gold are swept on load
{const _ss=svSnapshot;svSnapshot=function(){if(typeof D!=='undefined'&&D&&D.gold>0)gaDeposit();return _ss.apply(this,arguments);};}
{const _sl=svLoad;svLoad=function(){const r=_sl.apply(this,arguments);if(typeof D!=='undefined'&&D&&D.gold>0)gaDeposit();return r;};}
