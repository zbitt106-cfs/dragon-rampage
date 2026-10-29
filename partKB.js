// ======================= partKB: KING WILLIAM BUYS MATERIALS (grudgingly) =======================
// Only when the stockpile is too LOW to rebuild a destroyed building, the kingdom spends castle gold on exactly the missing wood/stone.
// Never for watchtowers (they are only ever built from cart-delivered stock: bought goods don't count toward the tower budget), never to stockpile.
// The goods come by TRADE SHIP from the southern sea edge to the King's Quay (announced: banner, horn, map marker), then by a
// GUARDED CART along the roads to the storehouse. Sink the ship or smash the cart and the goods (and the gold) are lost. Saved with the game.
const KB={rate:{wood:4,stone:6},check:3,cool:25,quayX:2400,guards:3,unload:2.5,ship:{hp:130,sp:58,crew:3,r:50},last:null};
function kbNeed(){ // the first ruin the masons would rebuild that is blocked ONLY by stock (same order and waits as the rebuild loop)
  for(const s of [...structures].sort((a,b)=>(b.kind==='bridge')-(a.kind==='bridge'))){
    if(s.state!=='ruin'||s.builder||s.paid||s.kind==='wtower')continue;
    if(s.kind==='gate'&&G.t-(s.ruinT||0)<GATE_REBUILD_WAIT)continue;if(s.kind==='kroof'&&(PR.state!=='tower'||G.t-(s.ruinT||0)<KROOF.wait))continue;
    const c=s.kind==='bridge'?bridgeCost(s):COST[s.kind];if(!c)continue;const [w,st]=c;
    if(G.wood>=w&&G.stone>=st)return null;   // the next rebuild is affordable: buy nothing
    return{s,w:Math.max(0,w-G.wood),st:Math.max(0,st-G.stone)};}
  return null;}
function kbTraders(){return carts.filter(c=>c.trader&&!c.wrecked);}
function kbShips(){return ships.filter(s=>s.kind==='trade'&&s.state!=='sink');}
function kbBusy(){return kbShips().some(s=>s.state!=='home')||kbTraders().length>0;}
function kbSpendGold(n){let left=n;for(const g of [...goldPiles].sort((a,b)=>(b.amt||0)-(a.amt||0))){if(left<=0)break;const t=Math.min(left,Math.max(0,g.amt||0));g.amt-=t;left-=t;}return n-left;}
// the King's Quay: a royal pier on the south shore, the nearest harbour to the castle storehouse
function kbQuay(){if(KB.q)return KB.q;const x=KB.quayX,yS=(typeof shoreAt==='function'&&shoreAt(x))||4330;
  return KB.q={x,y:yS+18,land:{x,y:yS-60},anchor:{x:x+10,y:yS+80}};}
SHIPK.trade={hp:KB.ship.hp,sp:KB.ship.sp,crew:KB.ship.crew,r:KB.ship.r,gold:0};
if(typeof SHIP_NM!=='undefined')SHIP_NM.trade='Royal trade ships';
SC_SRC.trader={kind:'wood',yard:null,park:()=>kbQuay().land,job:'trader',name:"the King's Quay"};
function kbWhat(w,st){return [w?`${w} wood`:'',st?`${st} stone`:''].filter(Boolean).join(' and ');}
function kbGoods(w,st){return w&&st?'lumber and stone':w?'lumber':'stone';}
function kbSpawnShip(w,st,o){o=o||{};const q=kbQuay();let sx=o.x!=null?o.x:q.x+R(-160,160),sy=o.y!=null?o.y:WY1-170;
  if(o.x==null)for(let t=0;t<40&&!inSea(sx,sy);t++)sy-=40;
  const s={kind:'trade',trade:true,w:w|0,st:st|0,x:sx,y:sy,ang:o.ang!=null?o.ang:-Math.PI/2,sp:KB.ship.sp,hp:o.hp!=null?o.hp:KB.ship.hp,maxHp:KB.ship.hp,r:KB.ship.r,crew:KB.ship.crew,
    fire:0,fireT:0,state:o.state||'sail',wp:null,cd:0,cd2:0,t:0,id:rnd(),bob:R(0,TAU),unT:o.unT!=null?o.unT:KB.unload,anchor:{x:q.anchor.x,y:q.anchor.y}};ships.push(s);return s;}
function kbSpawn(kind,n,o){o=o||{};const c=scSpawn('trader',{load:n,st:o.st||'go',s:o.s||0,noDrv:o.noDrv,noHorse:o.noHorse});c.kind=kind;c.trader=true;c.load=n;if(c.drv)c.drv.shirt='#2a6a5a';
  if(!o.noGuards)kbGuards(c,o.guards!=null?o.guards:KB.guards);return c;}
// a few foot soldiers march beside each cart (partK escortStep); they fight if the dragon comes close
function kbGuards(c,n){if(!Object.getOwnPropertyDescriptor(c,'dead'))Object.defineProperty(c,'dead',{get(){return this.wrecked||this.gone;},configurable:true});
  const G_=[];for(let i=0;i<n;i++){const a=R(0,TAU),k=mkUnit('knight',c.x+Math.cos(a)*26,c.y+Math.sin(a)*16,{hp:24,maxHp:24,atk:0,foot:true,colr:'#2f8a6a',escort:c,eo:[-1,1,0,-1,1][i%5]*(i>2?1.8:1),born:G.t,kbGuard:1});units.push(k);G_.push(k);}
  return G_;}
function kbGuardsOf(c){return units.filter(u=>!u.dead&&u.kbGuard&&u.escort===c);}
function kbBuy(){if(!storeUp()||kbBusy()||G.t<(G.kbCoolT||0))return false;const need=kbNeed();if(!need)return false;
  const cost=need.w*KB.rate.wood+need.st*KB.rate.stone,have=castleTreasury();if(cost<=0||have<cost)return false;
  const paid=kbSpendGold(cost);G.kbSpent=(G.kbSpent||0)+paid;G.kbBuys=(G.kbBuys||0)+1;
  const what=kbWhat(need.w,need.st);KB.last={kind:need.s.kind,w:need.w,st:need.st,cost:paid};
  kbSpawnShip(need.w,need.st);G.kbShipsSent=(G.kbShipsSent||0)+1;
  float(STORE_DOOR.x,STORE_DOOR.y-70,`King William grudgingly pays ${paid} gold for ${what}`,'#ffe08a');
  if(kbSay()){G.banner={text:`A trade ship approaches with King William's ${kbGoods(need.w,need.st)}!`,sub:`${what} sailing for the King's Quay, then by guarded cart to the castle storehouse  ·  sink it or smash the cart!`,t:4.5};
  if(typeof showToast==='function')showToast(`⛵ Royal trade ship sighted: ${what}`);
  if(typeof SFX!=='undefined')SFX.play('princeHorn');G.kbHorn=(G.kbHorn||0)+1;}else G.kbQuiet=(G.kbQuiet||0)+1;return true;}
// QUEUE 31: the trade ship is only ANNOUNCED (banner, toast, horn) while the dragon is south of the northern fantasy lands; up north it still sails, silently
function kbSay(){return !(typeof nrInNorth==='function'&&G&&D&&nrInNorth(D.x,D.y));}
function kbLose(why){G.kbLost=(G.kbLost||0)+1;G.kbCoolT=G.t+KB.cool;G.kbLostWhy=why;}
// the trade ship: sails straight in, unloads onto carts at the quay, then sails away off the south edge
function updTradeShip(s,dt){s.t+=dt;s.bob+=dt;if(s.state==='sink'){if(s.fire)s.fire=Math.max(0,s.fire-dt);return;}
  if(s.fire){s.fireT+=dt;hurtShip(s,6*dt,'fire');if(s.state==='sink')return;if(s.fireT>7){s.fire=0;s.fireT=0;float(s.x,s.y-70,'The sailors douse the flames!','#cfe8ff');}
    if(Math.abs(s.x-D.x)<1900&&rnd()<dt*14)flame(s.x+R(-s.r*.5,s.r*.5),s.y+R(-8,8),R(10,30));}
  if(s.state==='sail'||s.state==='home'){const tx=s.state==='home'?s.x:s.anchor.x,ty=s.state==='home'?WY1+200:s.anchor.y,a=Math.atan2(ty-s.y,tx-s.x);
    s.ang+=angDiff(a,s.ang)*Math.min(1,1.6*dt);const nx=s.x+Math.cos(s.ang)*s.sp*dt,ny=s.y+Math.sin(s.ang)*s.sp*dt;
    if(s.state==='home'){s.x=nx;s.y=ny;if(s.y>WY1-90){s.state='sink';s.t=99;s.gone=true;}}
    else{if(inSea(nx,ny)&&d2(nx,ny,LH.x,LH.y)>LH.r+s.r){s.x=nx;s.y=ny;}else s.anchor={x:s.x,y:s.y};
      if(d2(s.x,s.y,s.anchor.x,s.anchor.y)<30){s.state='unload';s.unT=KB.unload;float(s.x,s.y-80,"The trade ship ties up at the King's Quay",'#ffe08a');}}
    if((G.fc&7)===0)ripples.push({x:s.x-Math.cos(s.ang)*s.r,y:s.y-Math.sin(s.ang)*s.r,t:.3});return;}
  if(s.state==='unload'){s.unT-=dt;if(s.unT<=0){kbUnload(s);s.state='home';}}}
function kbUnload(s){const q=kbQuay(),two=s.w>0&&s.st>0,g=two?2:KB.guards;if(s.w>0)kbSpawn('wood',s.w,{guards:g});if(s.st>0)kbSpawn('stone',s.st,{guards:g,s:two?-90:0});G.kbLanded=(G.kbLanded||0)+1;
  float(q.land.x,q.land.y-50,`Dockhands load ${kbWhat(s.w,s.st)} onto a guarded cart`,'#ffe08a');s.w=0;s.st=0;}
{const _u=updShip;updShip=function(s,dt){if(s&&s.kind==='trade'){updTradeShip(s,dt);return;}return _u.apply(this,arguments);};}
{const _h=hurtShip;hurtShip=function(s,d,src){const tr=s&&s.kind==='trade'&&s.state!=='sink',had=tr&&(s.w>0||s.st>0);const r=_h.apply(this,arguments);
  if(tr&&s.state==='sink'){if(had){kbLose('ship');float(s.x,s.y-95,`King William's ${kbGoods(s.w,s.st)} sinks to the bottom!`,'#ffd84a');}s.w=0;s.st=0;}return r;};}
{const _d=drawShip;drawShip=function(s){if(!s||s.kind!=='trade')return _d.apply(this,arguments);s.kind='merchant';try{_d.apply(this,arguments);}finally{s.kind='trade';}
  if(s.state==='sink'&&s.t>2)return;const b=Math.sin(s.bob*1.6)*1.5,x=s.x,y=s.y+b;
  // royal pennant + cargo crates
  line(x,y-62,x,y-84,'#5a3a1c',2);ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.moveTo(x,y-84);ctx.lineTo(x+22,y-79);ctx.lineTo(x,y-74);ctx.fill();
  if(s.w>0||s.st>0){for(let i=0;i<3;i++)rect(x-16+i*11,y-12,9,8,s.st>0&&i===2?'#bbb':'#a8743a');}}}
// deliveries: straight into the stockpile, NOT into the watchtower budget (G.rtW/G.rtS), then the cart heads back to the quay
{const _d=scDeliver;scDeliver=function(c){if(!c||!c.trader)return _d.apply(this,arguments);const n=c.load|0;if(n<=0)return;
  if(c.kind==='wood')G.wood+=n;else G.stone+=n;c.load=0;G.kbGot=(G.kbGot||0)+n;G.kbHoldT=15;float(STORE_DOOR.x,STORE_DOOR.y-46,`The king's cart unloads ${n} ${c.kind}`,c.kind==='wood'?'#e8c090':'#e0e0e0');};}
function kbDismiss(c){for(const k of kbGuardsOf(c)){k.escort=null;k.retreat=true;}}
{const _s=scStep;scStep=function(c,dt){if(c.trader&&!c.wrecked&&c.st==='load'){kbDismiss(c);c.wrecked=true;c.t=0;c.gone=true;for(const u of [c.drv,c.horse])if(u&&!u.dead){u.dead=true;u.gone=true;}return;}return _s.apply(this,arguments);};}
{const _w=wreckCart;wreckCart=function(c){const tr=c&&c.trader&&!c.wrecked,had=tr&&(c.load|0)>0;
  if(tr&&typeof tallyAdd==='function'){const t0=tallyAdd,f0=float;tallyAdd=function(k,n){return t0.call(this,k==='supplycart'?'tradecart':k,n);};float=function(x,y,t,c){return f0.call(this,x,y,String(t).replace('Supply cart',"The king's trade cart"),c);};try{var r=_w.apply(this,arguments);}finally{tallyAdd=t0;float=f0;}}else r=_w.apply(this,arguments);
  if(tr){if(had){kbLose('cart');float(c.x,c.y-50,"King William's goods are lost!",'#ffd84a');}for(const k of kbGuardsOf(c))k.escort=null;}return r;};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!G.over&&!paused){G.kbT=(G.kbT||0)-dt;if(G.kbT<=0){G.kbT=KB.check;kbBuy();}}return r;};}
{const _n=newGame;newGame=function(){const r=_n.apply(this,arguments);G.kbT=KB.check;G.kbCoolT=0;return r;};}
// the quay itself is a (destructible) dock structure
{const _i=initStructsK;initStructsK=function(){const r=_i.apply(this,arguments);const q=kbQuay();kAdd('dock',q.x,q.y,-1,{royal:1});return r;};}
// the tally: trade ships (via the generic ship tally) and trade carts
if(typeof TALLY_SECT!=='undefined'){const B=TALLY_SECT.find(s=>s.id==='boats');if(B){if(!B.keys.some(k=>k[0]==='ship:trade'))B.keys.splice(B.keys.findIndex(k=>k[0]==='siege:catapult'),0,['ship:trade','Royal trade ships']);
  B.keys.splice(B.keys.findIndex(k=>k[0]==='carthorse'),0,['tradecart','Royal trade carts']);}TALLY_LABEL['ship:trade']='Royal trade ships';TALLY_LABEL.tradecart='Royal trade carts';}
// the map: the trade ship (gold, pulsing) and the king's carts (green)
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s,q=big?1:.6,p=.6+.4*Math.sin(G.t*5);
  for(const sh of kbShips()){if(sh.state==='home'&&!(sh.w||sh.st))continue;ctx.strokeStyle=`rgba(255,210,74,${p})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(sh.x),Y(sh.y),(big?11:7),0,TAU);ctx.stroke();
    ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.moveTo(X(sh.x)-6*q,Y(sh.y)+2*q);ctx.lineTo(X(sh.x)+6*q,Y(sh.y)+2*q);ctx.lineTo(X(sh.x)+3*q,Y(sh.y)+5*q);ctx.lineTo(X(sh.x)-3*q,Y(sh.y)+5*q);ctx.fill();
    ctx.fillRect(X(sh.x)-.6,Y(sh.y)-6*q,1.4,8*q);G.kbMapDrawn=(G.kbMapDrawn||0)+1;}
  for(const c of kbTraders()){ctx.fillStyle='#2fdc9a';ctx.fillRect(X(c.x)-3*q-1,Y(c.y)-3*q-1,6*q+2,6*q+2);G.kbMapDrawn=(G.kbMapDrawn||0)+1;}}catch(e){}return r;};}
// save / load: trade ships + carts in transit stored as flat strings
{const _ss=scSave;scSave=function(){return _ss.apply(this,arguments).filter(a=>a.src!=='trader');};}
if(typeof svSnapshot==='function'){const _sn=svSnapshot;svSnapshot=function(){const o=_sn.apply(this,arguments);
    o.KBS=kbShips().filter(s=>s.state!=='home'||s.w||s.st).map(s=>[Math.round(s.x),Math.round(s.y),Math.round(s.hp),s.state,s.w,s.st,(+s.ang).toFixed(2),(+s.unT||0).toFixed(1)].join(',')).join(';');
    o.KB=kbTraders().map(c=>[c.kind,c.load|0,c.st,Math.round(c.s),scAlive(c.drv)?1:0,scAlive(c.horse)&&!c.horse.loose?1:0,kbGuardsOf(c).length].join(',')).join(';');return o;};
  const _ap=svApply;svApply=function(d){const r=_ap.apply(this,arguments);try{
      for(const c of kbTraders()){c.wrecked=true;c.t=0;for(const u of [c.drv,c.horse])if(u){u.dead=true;u.gone=true;}}
      for(let i=carts.length-1;i>=0;i--)if(carts[i].trader)carts.splice(i,1);
      for(const u of units)if(u.kbGuard){u.dead=true;u.gone=true;}
      ships=ships.filter(s=>s.kind!=='trade');
      if(!structures.some(s=>s.kind==='dock'&&s.royal)){const q=kbQuay();const s=structures.find(s=>s.kind==='dock'&&Math.abs(s.x-q.x)<4&&Math.abs(s.y-q.y)<4);if(s)s.royal=1;else kAdd('dock',q.x,q.y,-1,{royal:1});}
      if(d.KBS)for(const e of String(d.KBS).split(';')){const [x,y,hp,st,w,s_,a,u]=e.split(',');if(!(+hp>0))continue;
        kbSpawnShip(+w,+s_,{x:+x,y:+y,hp:+hp,state:['sail','unload','home'].includes(st)?st:'sail',ang:+a,unT:+u});}
      const ts=String(d.KB||'');if(ts&&ts.indexOf('|')<0)for(const e of ts.split(';')){const [k,n,st,s,dr,ho,gn]=e.split(',');if(!(+n>0)&&st!=='back')continue;const S=['go','wait','back'].includes(st)?st:'go';
        const c=kbSpawn(k==='stone'?'stone':'wood',+n||0,{st:S==='wait'?'go':S,noDrv:dr==='0',noHorse:ho==='0',guards:gn!=null?+gn:KB.guards});if(S==='back')c.R=scRoute(STORE_DOOR,SC_SRC.trader.park());
        c.st=S;c.s=S==='wait'?c.R.len:Math.max(0,Math.min(c.R.len,+s||0));scPlace(c,0,true);for(const g of kbGuardsOf(c)){const a=R(0,TAU);g.x=c.x+Math.cos(a)*26;g.y=c.y+Math.sin(a)*16;}}}catch(e){console.error(e);}return r;};}
// the trader cart: green awning so you can tell it from the kingdom's own supply carts
{const _dc=drawSupplyCart;drawSupplyCart=function(c){_dc.apply(this,arguments);if(c.trader&&!c.wrecked){const x=c.x,y=c.y,w=Math.abs(Math.cos(c.ang||0))*12+5;
  rect(x-w-5,y-22,2*w+10,3,'#2f8a6a');for(let i=0;i<4;i++)rect(x-w-5+i*(2*w+10)/4,y-22,(2*w+10)/8,3,'#e8e0c0');line(x-w-4,y-19,x-w-4,y-10,'#5a3a1c',1.5);line(x+w+4,y-19,x+w+4,y-10,'#5a3a1c',1.5);}};}
// bought wood is for the rebuild: no new mine carts from it while the masons pick it up
{const _e=updEconomy;updEconomy=function(dt){if(G.kbHoldT>0){G.kbHoldT-=dt;G.cartBuildT=Math.max(G.cartBuildT||0,.5);}return _e.apply(this,arguments);};}
