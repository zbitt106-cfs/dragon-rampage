// ======================= world simulation =======================
function updFire(dt){
  const burning=[];
  for(const t of trees){
    if(t.state==='falling'){t.fallT+=dt;if(t.fallT>1){t.state='stump';t.regrow=80;}}
    else if(t.state==='stump'||t.state==='burnt'){t.regrow-=dt;if(t.regrow<=0&&!t.claimed){t.sapling=t.state==='burnt';t.state='ok';t.hp=40;t.s=t.sapling?.3:.5;}}
    else if(t.state==='ok'&&t.s<1)t.s=Math.min(1.1,t.s+dt*(t.sapling?.01:.02));
    if(t.fire){t.hp-=6*dt;burning.push(t);if(rnd()<dt*6)flame(t.x,t.y-20*t.s,R(10,40));if(rnd()<dt*3)smoke(t.x,t.y-30);
      if(t.hp<=0){t.fire=0;t.state='burnt';t.regrow=70;G.stats.trees++;addAlarm(1.5);scorch(t.x,t.y,16);if(t.claimed){t.claimed.tree=null;t.claimed=null;}}}}
  for(const s of structures)if(s.fire&&s.state!=='ruin'){hurtStruct(s,(s.kind==='stonepile'?5:9)*dt);burning.push(s);
    if(s.kind==='logpile'&&G[yk(s,'Wood')]>0&&rnd()<dt*.8){G[yk(s,'Wood')]--;float(s.x,s.y-40,'-1 wood','#e8c090');}
    for(let i=0;i<2;i++)if(rnd()<dt*8)flame(s.x+R(-22,22),s.y+R(-10,10),R(10,46));if(rnd()<dt*4)smoke(s.x,s.y-40);}
  for(const c of cells){if(c.fire){c.fire+=dt;burning.push(c);if(rnd()<dt*4)flame(c.x,c.y,R(2,14));if(c.fire>2.5){c.fire=0;c.burnt=true;c.growth=0;G.stats.crops++;addAlarm(.25);}}
    else if(!c.burnt&&c.growth<1)c.growth=Math.min(1,c.growth+dt/45);}
  for(const c of carts){if(c.fire&&!c.wrecked){c.fire+=dt;flame(c.x,c.y,10);if(c.fire>2)wreckCart(c);} if(c.wrecked){c.t-=dt;}}
  for(let i=carts.length-1;i>=0;i--)if(carts[i].wrecked&&carts[i].t<=0)carts.splice(i,1);
  for(const g of siege)if(g.fire&&!g.dead){hurtSiege(g,18*dt);if(rnd()<dt*8)flame(g.x+R(-15,15),g.y,R(6,30));}
  // spread
  for(const b of burning){if(rnd()>dt*1.6)continue;spreadFlora(b);
    const near=(o,r)=>Math.abs(o.x-b.x)<r&&Math.abs(o.y-b.y)<r&&d2(o.x,o.y,b.x,b.y)<r;
    for(const t of trees)if(t.state==='ok'&&!t.fire&&near(t,48)&&rnd()<.5)t.fire=1;
    for(const s of structures)if(s.state!=='ruin'&&!s.fire&&!stoneish(s)&&near(s,62)&&rnd()<.35)s.fire=1;
    for(const c of cells)if(!c.burnt&&!c.fire&&c.growth>.15&&near(c,32))c.fire=0.01;}
  for(const u of units)if(u.burn>0&&!u.dead){u.burn-=dt;hurtUnit(u,10*dt,'fire');if(rnd()<dt*10)flame(u.x,u.y,8);}
}

// ---------- economy: stockpiles, carts, rebuilding, respawns ----------
const COST={hut:[3,1],barn:[5,2],logpile:[0,2],stonepile:[2,0],cabin:[4,1],gate:[6,6],barracks:[6,4]};
const GATE_REBUILD_WAIT=20,GATE_BUILD_T=45; // engineers wait for the dust to settle, then rebuild the gate slowly
function pile(kind){return structures.find(s=>s.kind===kind);}
function updEconomy(dt){
  G.spawnT-=dt;G.rebuildT-=dt;G.cartBuildT-=dt;
  // cart replacement at the mine (costs wood)
  const activeCarts=carts.filter(c=>!c.wrecked&&!c.supply).length+units.filter(u=>u.job==='miner'&&!u.dead&&(u.inside||u.state==='cart')).length; // a cart inside the mine is still a cart
  if(G.cartsPool+activeCarts<3&&G.cartBuildT<=0&&G.wood>=2){G.wood-=2;G.cartsPool++;G.cartBuildT=20;float(MINE.x-40,MINE.y-40,'New cart built (-2 wood)','#e8c090');}
  // rebuild: assign ruins to builders when stock allows
  if(G.rebuildT<=0){G.rebuildT=2;
    updBridgeWork();
    for(const s of [...structures].sort((a,b)=>(b.kind==='bridge')-(a.kind==='bridge'))){if(s.state!=='ruin'||s.builder)continue;if(s.kind==='gate'&&G.t-(s.ruinT||0)<GATE_REBUILD_WAIT)continue;if(s.kind==='kroof'&&(PR.state!=='tower'||G.t-(s.ruinT||0)<KROOF.wait))continue;const [w,st]=s.kind==='bridge'?bridgeCost(s):COST[s.kind];
      if(!s.paid&&(G.wood<w||G.stone<st))continue;
      let bu=null,bd=1e9;for(const u of units)if(u.type==='villager'&&!u.dead&&u.job==='peasant'&&!u.task&&!u.water&&u.state!=='flee'){const dd=dist(u,s);if(dd<bd&&dd<(s.kind==='bridge'?1600:1200)){bd=dd;bu=u;}}
      if(!bu)continue;if(!s.paid){G.wood-=w;G.stone-=st;s.paid=true;}s.builder=bu;bu.task={s};bu.state='tobuild';break;}}
  // respawn villagers from standing huts
  const vill=units.filter(u=>u.type==='villager'&&!u.dead);
  const huts=structures.filter(s=>s.kind==='hut'&&s.state==='ok');
  if(G.spawnT<=0){G.spawnT=5;if(vill.length<55&&huts.length){const h=huts[RI(0,huts.length-1)];spawnVillager(h.x,h.y+20,'peasant',h.v);}}
  // keep jobs staffed by promoting peasants
  const need=(job,n,pos)=>{const have=vill.filter(u=>u.job===job).length;if(have<n){let b=null,bd=1e9;for(const u of vill)if(u.job==='peasant'&&!u.task){const dd=dist(u,pos);if(dd<bd){bd=dd;b=u;}}if(b){b.job=job;b.state='idle';}}};
  if(rnd()<dt*.3){need('woodcutter',3,CAMP);need('miner',3,MINE);
    FARMS.forEach((f,fi)=>{if(vill.filter(u=>u.job==='farmer'&&u.farm===fi).length<2){let b=vill.find(u=>u.job==='peasant'&&!u.task&&u.v===f.v);if(b){b.job='farmer';b.farm=fi;b.state='idle';}}});}
  // replant stomped/burnt fields happens via farmers; regrow animals slowly
  if(rnd()<dt*.03)FARMS.forEach(f=>{const n=units.filter(u=>u.type==='animal'&&!u.dead&&u.pen===f.pen).length;if(n<3)units.push(mkUnit('animal',f.pen.x+f.pen.w/2,f.pen.y+f.pen.h/2,{species:f.pen.animal,pen:f.pen,hp:14}));});
}
function moveTo(u,tx,ty,sp,dt){const dx=tx-u.x,dy=ty-u.y,dd=Math.hypot(dx,dy);if(dd<3)return true;const s=Math.min(dd,sp*dt);u.x+=dx/dd*s;u.y+=dy/dd*s;if(Math.abs(dx)>1)u.face=dx>0?1:-1;u.anim+=dt*8;return dd<6;}
function fearR(){return D.alt>0.5?260:220;}
function updVillager(u,dt){if(u.tax){updTax(u,dt);return;}if(u.carav){updCaravan(u,dt);return;}
  const dd=dist(u,D);
  if(u.inside){u.t-=dt;if(u.t<=0){u.inside=false;u.state='cart';}return;}
  if(u.militia&&updMilitia(u,dt))return;
  if(dd<fearR()&&!G.over){if(u.state!=='flee'){dropCarry(u);u.state='flee';}const a=Math.atan2(u.y-D.y,u.x-D.x)+Math.sin(G.t*3+u.id*9)*.5;
    {const ox=u.x,oy=u.y;u.x=clamp(u.x+Math.cos(a)*78*dt,WX0+80,WX1-80);u.y=clamp(u.y+Math.sin(a)*78*dt,WY0+80,WY1-80);if(u.x>CWALL.x0-40&&u.x<CWALL.x1+40&&u.y>CWALL.y0-30&&u.y<CWALL.y1+20&&!(ox>CWALL.x0-40&&ox<CWALL.x1+40&&oy>CWALL.y0-30&&oy<CWALL.y1+20)){u.x=ox;u.y=oy;}if(riverBlocked(u.x,u.y)&&!riverBlocked(ox,oy)){u.x=ox;u.y=oy;}}u.face=Math.cos(a)>0?1:-1;u.anim+=dt*12;u.t=1.2;return;}
  if(u.state==='flee'){u.t-=dt;if(u.t>0)return;u.state='idle';}
  if(u.job==='peasant'){
    if(u.water){updBucket(u,dt);return;}
    if(u.task&&u.task.upg){const s=u.task.s;if(s.state!=='ok'||s.upgBy!==u){s.upgBy=null;u.task=null;u.state='idle';return;}const e=bridgeEnd(s,u);
      if(u.state==='tobuild'){if(moveTo(u,e.x,e.y,46,dt))u.state='build';return;}
      s.upg+=dt/16;u.anim+=dt*6;if(rnd()<dt*2)puff(s.x+R(-25,25),s.y,1,'rgba(200,200,200,',30,5);
      if(s.upg>=1){s.mat='stone';s.hp=s.maxHp=420;s.upgBy=null;s.upg=0;u.task=null;u.state='idle';float(s.x,s.y-40,'Stone bridge finished! (fireproof)','#cfd8e0');}return;}
    if(u.task&&u.task.s){const s=u.task.s;if(s.state!=='ruin'&&s.state!=='building'){u.task=null;return;}
      if(u.state==='tobuild'){const bp=s.kind==='bridge'?bridgeEnd(s,u):{x:s.x+18,y:s.y+22};if(moveTo(u,bp.x,bp.y,46,dt)){u.state='build';s.state='building';}}
      else if(u.state==='build'){s.state='building';s.build+=dt/(s.kind==='bridge'?(s.nextMat==='stone'?20:12):s.kind==='gate'?GATE_BUILD_T:9);u.anim+=dt*6;if(rnd()<dt*2)puff(s.x+R(-15,15),s.y,1,'rgba(200,180,140,',30,5);
        if(s.build>=1){if(s.kind==='bridge'){s.mat=s.nextMat||'wood';s.maxHp=s.mat==='stone'?420:120;}s.state='ok';s.hp=s.maxHp;s.build=0;s.paid=false;s.builder=null;u.task=null;u.state='idle';if(s.kind==='gate'){G.waveCD=Math.min(G.waveCD,12);G.reinforceT=Math.min(G.reinforceT,35);}}}
      else u.state='tobuild';return;}
    if(u.state!=='walk'||!u.tgt){u.tgt={x:u.home.x+R(-140,140),y:u.home.y+R(-100,100)};u.state='walk';u.wait=R(0,3);}
    if(u.wait>0){u.wait-=dt;return;} if(moveTo(u,u.tgt.x,u.tgt.y,32,dt))u.state='idle';
  } else if(u.job==='woodcutter'){
    const lp=pile('logpile');
    if(u.state==='carry'){if(moveTo(u,LOGPILE_POS.x+R(-2,2),LOGPILE_POS.y+16,40,dt)){if(lp.state==='ok'){G.yardWood=(G.yardWood||0)+1;float(u.x,u.y-20,'+1 log (camp yard)','#e8c090');}u.carry=null;u.state='idle';}return;}
    if(!u.tree||u.tree.state!=='ok'){if(u.tree)u.tree.claimed=null;u.tree=null;let b=null,bd=1e9;for(const t of trees)if(t.state==='ok'&&!t.fire&&!t.claimed&&t.s>.8){const q=d2(t.x,t.y,CAMP.x,CAMP.y);if(q<480){const z=dist(u,t);if(z<bd){bd=z;b=t;}}}
      if(!b){moveTo(u,CAMP.x,CAMP.y+30,30,dt);return;}u.tree=b;b.claimed=u;u.state='towalk';}
    const t=u.tree;
    if(u.state==='towalk'){if(moveTo(u,t.x+14,t.y+8,40,dt)){u.state='chop';u.t=4;u.face=-1;}}
    else if(u.state==='chop'){u.t-=dt;u.anim+=dt*7;if(Math.floor(u.anim*1.1)%2&&rnd()<dt*3)puff(t.x+6,t.y,1,'rgba(200,170,110,',25,3);
      if(u.t<=0){t.state='falling';t.fallT=0;t.fallA=rnd()<.5?1:-1;t.claimed=null;u.tree=null;u.carry='log';u.state='carry';}}
  } else if(u.job==='miner'){
    const sp=pile('stonepile');
    if(u.state==='idle'){u.state='towalk';}
    if(u.state==='towalk'){if(moveTo(u,MINE.x-50+((u.id*100)%30),MINE.y+30,40,dt)){u.state='pick';u.t=4;}}
    else if(u.state==='pick'){u.t-=dt;u.anim+=dt*7;u.face=1;if(rnd()<dt*2)puff(MINE.x-30,MINE.y+10,1,'rgba(150,140,130,',30,3);
      if(u.t<=0){if(G.cartsPool>0){G.cartsPool--;u.inside=true;u.t=3;u.x=MINE.x;u.y=MINE.y+10;}else{u.t=2;}}}
    else if(u.state==='cart'){const c={x:MINE.x,y:MINE.y+24,stone:2,fire:0,wrecked:false,pusher:u,t:0};carts.push(c);u.cart=c;u.state='haul';}
    else if(u.state==='haul'){if(!u.cart||u.cart.wrecked){u.cart=null;u.state='towalk';return;}
      const arrived=moveTo(u,STONEPILE_POS.x+30,STONEPILE_POS.y+10,30,dt);const c=u.cart;c.x=u.x-14*u.face;c.y=u.y+2;
      if(arrived){if(sp.state==='ok'){G.yardStone=(G.yardStone||0)+c.stone;float(u.x,u.y-20,`+${c.stone} stone (mine yard)`,'#ddd');}c.stone=0;u.state='return';}}
    else if(u.state==='return'){if(!u.cart||u.cart.wrecked){u.cart=null;u.state='towalk';return;}
      const c=u.cart;const arrived=moveTo(u,MINE.x,MINE.y+24,34,dt);c.x=u.x+14*u.face;c.y=u.y+2;
      if(arrived){carts.splice(carts.indexOf(c),1);G.cartsPool++;u.cart=null;u.state='towalk';}}
  } else if(u.job==='farmer'){
    if(!u.cell||u.state==='idle'){if(u.cell)u.cell.claimed=null;const mine=cells.filter(c=>c.farm===u.farm&&!c.claimed&&!c.fire);
      const burnt=mine.filter(c=>c.burnt);const pick=burnt.length?burnt[RI(0,burnt.length-1)]:mine[RI(0,mine.length-1)];
      if(!pick){return;}u.cell=pick;pick.claimed=u;u.state='towalk';}
    const c=u.cell;if(c.fire){c.claimed=null;u.cell=null;u.state='idle';return;}
    if(u.state==='towalk'){if(moveTo(u,c.x,c.y+4,30,dt)){u.state='work';u.t=c.burnt?4:3;}}
    else if(u.state==='work'){u.t-=dt;u.anim+=dt*6;if(u.t<=0){if(c.burnt){c.burnt=false;c.flat=false;c.growth=.05;float(c.x,c.y-16,'Replanted','#b8f0a0');}c.claimed=null;u.cell=null;u.state='idle';}}
  }
}
const STRUCT_NAME={hut:'Hut',barn:'Barn',logpile:'Log pile',stonepile:'Stone pile',cabin:"Hunters' cabin",gate:'Castle gate',barracks:'Barracks'};
const ANIM_SP={deer:95,rabbit:85,chicken:45,sheep:55,cow:50,pig:55};
function updAnimal(u,dt){const P=u.pen,dd=dist(u,D);let sp=u.species==='rabbit'?22:14;
  if(dd<(u.free&&u.species!=='chicken'?260:200)){sp=ANIM_SP[u.species]||55;const a=Math.atan2(u.y-D.y,u.x-D.x)+R(-.5,.5);u.tgt={x:u.x+Math.cos(a)*40,y:u.y+Math.sin(a)*40};}
  else if(!u.tgt||rnd()<dt*.3)u.tgt={x:P.x+R(12,P.w-12),y:P.y+R(12,P.h-12)};
  u.tgt.x=clamp(u.tgt.x,P.x+10,P.x+P.w-10);u.tgt.y=clamp(u.tgt.y,P.y+10,P.y+P.h-10);moveTo(u,u.tgt.x,u.tgt.y,sp,dt);
  u.x=clamp(u.x,P.x+8,P.x+P.w-8);u.y=clamp(u.y,P.y+8,P.y+P.h-8);}
