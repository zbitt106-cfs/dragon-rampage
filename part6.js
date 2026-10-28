function drawWorld(){
  const z=cam.z;ctx.setTransform(DPR*z,0,0,DPR*z,DPR*(VW/2-cam.x*z),DPR*(VH/2-cam.y*z));
  if(G.shake>0){ctx.translate(R(-G.shake,G.shake),R(-G.shake,G.shake));}
  const vw=VW/z,vh=VH/z,x0=cam.x-vw/2-60,y0=cam.y-vh/2-60,x1=cam.x+vw/2+60,y1=cam.y+vh/2+120;
  const sx=clamp(x0,0,WW),sy=clamp(y0,0,WH);ctx.fillStyle='#2a4a78';ctx.fillRect(x0,y0,x1-x0,y1-y0);
  {const tx0=clamp(x0,WX0,WX1),ty0=clamp(y0,WY0,WY1),tx1=clamp(x1,WX0,WX1),ty1=clamp(y1,WY0,WY1);if(tx1>tx0&&ty1>ty0){ctx.imageSmoothingEnabled=true;ctx.drawImage(TERR,(tx0-WX0)/TS,(ty0-WY0)/TS,(tx1-tx0)/TS,(ty1-ty0)/TS,tx0,ty0,tx1-tx0,ty1-ty0);}}
  if(x1>0&&y1>0&&x0<WW&&y0<WH)ctx.drawImage(ground,sx,sy,clamp(x1,0,WW)-sx,clamp(y1,0,WH)-sy,sx,sy,clamp(x1,0,WW)-sx,clamp(y1,0,WH)-sy);
  const vis=o=>o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;
  drawWater(x0,y0,x1,y1);if(GFX_HI)drawWaterHi(x0,y0,x1,y1);drawSeaLow(x0,y0,x1,y1);if(GFX_HI)drawDetailHi(x0,y0,x1,y1);gfxPre(x0,y0,x1,y1);
  for(const s of FARSCORCH)if(vis(s)){ell(s.x,s.y,s.r,s.r*.75,'rgba(30,22,15,.55)');ell(s.x+s.r*.2,s.y-s.r*.1,s.r*.4,s.r*.3,'rgba(20,15,10,.35)');}
  for(const s of structures)if(s.kind==='bridge'&&vis(s))drawBridge(s);
  for(const c of cells)if(vis(c))drawCell(c);
  FARMS.forEach(f=>{const P=f.pen;if(P.x<x1&&P.x+P.w>x0&&P.y<y1&&P.y+P.h>y0)drawPen(P);});PADDOCKS.forEach(P=>{if(P.x<x1&&P.x+P.w>x0&&P.y<y1&&P.y+P.h>y0)drawPen(P);});
  for(const r of ROCKS)if(vis(r)){if(GFX_HI){drawRockHi(r);continue;}ell(r.x,r.y,r.r,r.r*.6,r.c<.5?'#7d7466':'#8f8676');ell(r.x-r.r*.2,r.y-r.r*.2,r.r*.5,r.r*.3,'rgba(255,255,255,.15)');}
  drawCastleGround();drawFlora(x0,y0,x1,y1);drawCastle();drawMine();drawCamp();drawLair();drawWells();drawCoins();for(const u of units)if(u.species==='sandworm'&&!u.dead&&u.ws==='under'&&Math.abs(u.x-cam.x)<1400&&Math.abs(u.y-cam.y)<1000)drawWormMound(u);
  // catapult warning circles on the ground
  for(const b of boulders){if(b.done)continue;const f=b.t/b.T;ctx.fillStyle=`rgba(220,30,20,${.12+.25*f})`;ctx.beginPath();ctx.ellipse(b.tx,b.ty,b.r,b.r*.7,0,0,TAU);ctx.fill();
    ctx.strokeStyle=`rgba(255,60,40,${.6+.4*Math.sin(G.t*20)})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(b.tx,b.ty,b.r,b.r*.7,0,0,TAU);ctx.stroke();
    ctx.strokeStyle='rgba(255,220,200,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.tx,b.ty,b.r*(1-f),b.r*.7*(1-f),0,0,TAU);ctx.stroke();}
  const list=[];
  for(const t of trees)if(vis(t))list.push([t.y,0,t]);for(const s of structures)if(s.kind!=='bridge'&&vis(s))list.push([s.y,1,s]);for(const o of DECOR)if(o.x>x0-200&&o.x<x1+200&&o.y>y0-60&&o.y<y1+260)list.push([o.y,7,o]);
  for(const u of units)if(!u.dead&&!u.inside&&vis(u))list.push([u.y,2,u]);for(const g of siege)if(vis(g))list.push([g.y,3,g]);
  for(const c of carts)if(vis(c))list.push([c.y,4,c]);for(const bd of birds)if(!bd.dead&&vis(bd)&&(bd.state==='ground'||bd.state==='perch'))list.push([bd.y+(bd.state==='perch'?2:0),6,bd]);
  for(const s of ships)if(vis(s))list.push([s.y,8,s]);
  const dragonLow=D.alt<.15;if(dragonLow)list.push([D.y+10,5,D]);
  list.sort((a,b)=>a[0]-b[0]);
  for(const [,k,o] of list){if(k===0)drawTree(o);else if(k===1){drawStruct(o);if(!KDEF[o.kind])drawDamage(o);}else if(k===8)drawShip(o);else if(k===2&&o.flounder)drawFlounder(o);else if(k===2){if(o.type==='sea')drawSeaUnit(o);else if(o.type==='knight'){drawKnight(o);if(o.post==='guard')ell(o.x,o.y+2,8,3,'rgba(255,220,120,.25)');}else if(o.type==='animal')drawAnimal(o);else drawPerson(o);if(o.tax)drawTaxSack(o);if(o.banner&&!o.mounted)drawFlag(o.x-8,o.y-16,o);}
    else if(k===3)drawSiege(o);else if(k===4)drawCart(o);else if(k===6)drawBird(o,false);else if(k===7)drawDecor(o);else drawDragon();}
  drawCrashFx();
  for(const bd of birds)if(!bd.dead&&vis(bd)&&bd.state!=='ground'&&bd.state!=='perch'&&bd.z<heightOf()+5)drawBird(bd,true);
  // scorpion aiming lines
  for(const g of siege)if(!g.dead&&g.kind==='scorpion'&&g.state==='aim'){const lock=g.t<.35;ctx.setLineDash(lock?[]:[10,8]);
    ctx.strokeStyle=lock?'rgba(255,255,255,.95)':`rgba(255,40,30,${.5+.4*Math.sin(G.t*25)})`;ctx.lineWidth=lock?3:2;ctx.beginPath();ctx.moveTo(g.x,g.y-6);ctx.lineTo(g.aim.x,g.aim.y-(g.aimH||0));ctx.stroke();ctx.setLineDash([]);
    ell(g.aim.x,g.aim.y-(g.aimH||0),6,6,lock?'rgba(255,255,255,.8)':'rgba(255,40,30,.6)');}
  if(!dragonLow)drawDragon();drawSeaTop(x0,y0,x1,y1);
  for(const bd of birds)if(!bd.dead&&vis(bd)&&bd.state!=='ground'&&bd.state!=='perch'&&bd.z>=heightOf()+5)drawBird(bd,true);
  // projectiles
  for(const p of projs){const a=Math.atan2(p.vy,p.vx),L=p.kind==='bolt'?26:p.kind==='spear'?18:12;ell(p.x,p.y,3,1.5,'rgba(0,0,0,.25)');
    line(p.x-Math.cos(a)*L,p.y-p.z-Math.sin(a)*L,p.x,p.y-p.z,p.kind==='bolt'?'#3a2a1a':'#6b4a26',p.kind==='bolt'?4:p.kind==='spear'?2:1.6);
    poly([p.x+Math.cos(a)*5,p.y-p.z+Math.sin(a)*5,p.x+Math.cos(a+2.4)*4,p.y-p.z+Math.sin(a+2.4)*4,p.x+Math.cos(a-2.4)*4,p.y-p.z+Math.sin(a-2.4)*4],'#ccc');}
  for(const b of boulders){if(b.done)continue;const f=b.t/b.T,bx=lerp(b.sx,b.tx,f),by=lerp(b.sy,b.ty,f),bz=4*300*f*(1-f);
    ell(bx,by,10,5,'rgba(0,0,0,.3)');ell(bx,by-bz,12,12,'#7d7466');ell(bx-3,by-bz-3,5,4,'#9c9384');}
  // particles
  ctx.globalCompositeOperation='source-over';
  if(GFX_HI)drawPartsHi();else{
  for(const p of parts){const l=p.life/p.max;if(p.kind==='smoke'||p.kind==='dust'){ctx.fillStyle=p.col+(l*.5)+')';ctx.beginPath();ctx.arc(p.x,p.y-p.z,p.size*(1.6-l),0,TAU);ctx.fill();}}
  ctx.globalCompositeOperation='lighter';
  for(const p of parts){if(p.kind!=='breath'&&p.kind!=='flame')continue;const l=clamp(p.life/p.max,0,1);
    const A=p.kind==='breath'?l*.32:l*.6;ctx.fillStyle=l>.6?`rgba(255,220,120,${A})`:l>.3?`rgba(255,130,20,${A})`:`rgba(220,50,10,${A})`;ctx.beginPath();ctx.arc(p.x,p.y-p.z,p.size*(p.kind==='breath'?1.6-l*.6:l+.3),0,TAU);ctx.fill();}
  for(const p of parts){if(p.kind!=='sparkle')continue;const l=clamp(p.life/p.max,0,1);ctx.fillStyle=`rgba(140,255,160,${l*.9})`;const sx=p.x,sy=p.y-p.z,r=p.size*l;
    ctx.beginPath();ctx.moveTo(sx,sy-r*2);ctx.lineTo(sx+r*.5,sy);ctx.lineTo(sx,sy+r*2);ctx.lineTo(sx-r*.5,sy);ctx.closePath();ctx.fill();ctx.fillRect(sx-r*2,sy-r*.3,r*4,r*.6);}
  }
  ctx.globalCompositeOperation='source-over';gfxPost();
  ctx.textAlign='center';ctx.font='bold 14px Georgia';
  for(const t of texts){ctx.globalAlpha=clamp(t.t,0,1);ctx.fillStyle='#000';ctx.fillText(t.txt,t.x+1,t.y+1);ctx.fillStyle=t.col;ctx.fillText(t.txt,t.x,t.y);}ctx.globalAlpha=1;
}
function updParts(dt){for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z=Math.max(0,p.z+p.vz*dt);p.life-=dt;
    if(p.kind==='breath'&&p.z<=0){p.vx*=.9;p.vy*=.9;}if(p.kind==='sparkle'){p.vx*=.9;p.vy*=.9;}if(p.kind==='dust'){p.vx*=.94;p.vy*=.94;p.vz-=40*dt;}}
  for(let i=parts.length-1;i>=0;i--)if(parts[i].life<=0)parts.splice(i,1);if(parts.length>2200)parts.splice(0,parts.length-2200);
  for(const t of texts){t.t-=dt;t.y-=22*dt;}for(let i=texts.length-1;i>=0;i--)if(texts[i].t<=0)texts.splice(i,1);}

// ---------- HUD ----------
function panel(x,y,w,h){ctx.fillStyle='rgba(20,14,10,.72)';ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(230,190,120,.6)';ctx.lineWidth=1.5;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
function bar(x,y,w,h,f,c,label){rect(x,y,w,h,'#2a1a12');rect(x,y,w*clamp(f,0,1),h,c);ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
  ctx.fillStyle='#fff';ctx.font='bold 11px Georgia';ctx.textAlign='left';ctx.fillText(label,x+5,y+h-3);}
let MAPLB=null;// when set (big world map), every label's box is recorded so region names can dodge them
function lbBox(s,x,y,size,align){const w=ctx.measureText(s).width,x0=align==='center'?x-w/2:align==='right'?x-w:x;return{x0:x0-2,y0:y-size,x1:x0+w+2,y1:y+3};}
const lbHit=(b,L)=>L.some(o=>b.x0<o.x1&&b.x1>o.x0&&b.y0<o.y1&&b.y1>o.y0);
function txt(s,x,y,size,col,align,bold){ctx.font=`${bold===false?'':'bold '}${size}px Georgia`;ctx.textAlign=align||'left';if(MAPLB)MAPLB.push(lbBox(s,x,y,size,align||'left'));ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(s,x+1.5,y+1.5);ctx.fillStyle=col||'#fff';ctx.fillText(s,x,y);}
function drawHUD(){ctx.setTransform(DPR,0,0,DPR,0,0);const sm=VW<760;
  // dragon vitals + mode
  const hy=(G.easy?0:18)+18,hbw=typeof hpBarW==='function'?hpBarW():230;panel(10,10,Math.max(250,hbw+20),104+hy);txt('THE DRAGON'+(G.easy?'  ·  EASY MODE':''),20,28,13,'#f0c070');
  bar(20,36,hbw,16,D.hp/D.maxHp,D.hp/D.maxHp<.3?'#e33':'#c0302a',`Health ${Math.ceil(D.hp)}/${D.maxHp}`);
  bar(20,58,230,14,D.st/D.maxSt,D.mode==='air'&&D.st<25?(Math.floor(G.t*4)%2?'#f0a020':'#a06010'):'#e0b030',`Stamina ${Math.ceil(D.st)}`);
  if(typeof drawFireBar==='function')drawFireBar(20,76,230,14); // FIRE meter, right under stamina
  if(!G.easy){const hf=D.hunger/D.maxHunger,st=D.hunger<=0,low=hf<=HUNGER.low/100,pl=.5+.5*Math.sin(G.t*9);
    drawDrumstick(28,103,st?`rgba(255,${Math.round(80*pl)},${Math.round(80*pl)},1)`:low?'#ffb060':'#e8c090');bar(38,96,212,14,st?1:hf,st?`rgba(${150+Math.round(105*pl)},20,20,1)`:low?(Math.floor(G.t*3)%2?'#e07020':'#a04810'):'#b8742a',st?'STARVING! Eat something!':`Hunger ${Math.ceil(D.hunger)}${low?'  (hungry!)':''}`);
    if(st){ctx.strokeStyle=`rgba(255,60,60,${pl})`;ctx.lineWidth=2;ctx.strokeRect(37,95,214,16);
      if(!G.over&&!G.won)txt('⚠ STARVING! Eat a villager or animal! ⚠',VW/2,VH*.30,VW<760?18:24,`rgba(255,${Math.round(90+90*pl)},${Math.round(60+60*pl)},1)`,'center');}}
  const air=D.mode==='air';rect(20,78+hy,230,28,air?'#2a4a7a':'#4a3a22');
  txt(air?(D.alt<.95?'⇧ TAKING OFF…':'⇧ FLYING'):(D.swim?'≈ SWIMMING (slower)':D.alt>0.02?'⇩ LANDING…':'⇩ ON THE GROUND'),30,97+hy,14,air?'#cfe6ff':'#f2dcb0');
  txt(air?'F: land':'F: take off',242,97+hy,11,'#ddd','right',false);
  // wanted meter
  const mw=Math.min(380,VW-560>0?380:VW-300),mx=VW/2-mw/2,my=10;if(!sm){panel(mx-10,my,mw+20,72);
  txt('WANTED  ·  ALARM',VW/2,my+18,13,'#f0c070','center');
  const f=G.alarm/100;rect(mx,my+26,mw,18,'#2a1a12');const gr=ctx.createLinearGradient(mx,0,mx+mw,0);gr.addColorStop(0,'#6c6');gr.addColorStop(.35,'#ee3');gr.addColorStop(.65,'#f80');gr.addColorStop(1,'#e22');
  ctx.fillStyle=gr;ctx.fillRect(mx,my+26,mw*f,18);ctx.strokeStyle='#000';ctx.strokeRect(mx,my+26,mw,18);
  const names=['Foot','Knights','Archers','Mounted','Siege','Militia'];THRESH.forEach((t,i)=>{const tx=mx+mw*t/100;line(tx,my+22,tx,my+48,G.alarm>=t?'#fff':'#999',2);
    txt(names[i],tx,my+62,10,G.alarm>=t?'#ffd080':'#999','center',G.alarm>=t);});
  txt(`Level ${G.level}: ${LEVEL_NAMES[G.level]}`,mx+mw,my+18,11,'#fff','right',false);
  if(G.sinceDmg>6&&G.alarm>0)txt(coolMul()>1.4?'cooling fast…':'cooling…',mx,my+18,11,'#9cf','left',false);
  {const c=concern();panel(VW/2-100,my+74,200,17);txt(`Kingdom: ${c.name} concern  ×${c.k.toFixed(2)}`,VW/2,my+86,10,c.col,'center',false);}
  if(gateBroken()){const s=gateStruct(),[cw,cs]=COST.gate,st=s.state==='building'?`rebuilding ${Math.round(s.build*100)}%`:s.paid||s.builder?'engineers on the way':G.t-(s.ruinT||0)<GATE_REBUILD_WAIT?'rubble settling':(G.wood<cw||G.stone<cs)?`needs ${cw} wood + ${cs} stone`:'awaiting engineers';
    const pl=.75+.25*Math.sin(G.t*4);ctx.fillStyle=`rgba(90,20,10,${.8*pl})`;ctx.fillRect(VW/2-190,my+94,380,20);ctx.strokeStyle='#ff9a6a';ctx.lineWidth=1;ctx.strokeRect(VW/2-189.5,my+94.5,379,19);
    txt(`⚠ Gate destroyed: waves delayed ×${GATE_SLOW} & smaller`,VW/2,my+108,11,'#ffd8b0','center');}
  if(G.level>0&&Math.floor(G.t*2)%2)txt('⚠',mx+mw*f,my+41,13,'#fff','center');}
  // small screens: the compact wanted bar is drawn in the left column, under the resources (below)
  // LEFT COLUMN under the vitals: CASTLE LV (+ damage note) -> resources -> (small screens) wanted bar -> lava badge (partV)
  const colW=Math.max(250,hbw+20);let cy=118+hy;
  panel(10,cy,colW,28);txt(`CASTLE LV ${G.lvl}`,20,cy+18,12,'#ffd84a'); // princess status + lair-hoard lines removed from the HUD (castle level stays)
  const cs=musterSlow();if(cs>1.05)txt(`damaged: waves ${Math.round((cs-1)*100)}% slower`,10+colW-8,cy+18,10,'#ffc080','right',false);
  cy+=32;cy+=drawStockPill(10,cy,colW)+4; // resources: wood, stone, kingdom gold, the dragon's hoard
  if(sm){panel(10,cy,colW,26);rect(16,cy+6,(colW-12)*G.alarm/100,14,'#e44');txt(`Wanted Lv ${G.level}`,20,cy+18,11);cy+=30;}
  UI.colY=cy;UI.col={x:10,y:10,w:colW,h:cy-4-10};
  // minimap: top-right corner (inside the safe area: drawHUD runs in withSafe), shrunk if needed to stay clear of the centred WANTED / boss bars
  {const base=Math.round((sm||TOUCH.on?150:230)*Math.min(1.36,(WX1-WX0)/20000)),room=Math.floor(VW/2-(sm?210:260)-20),mmw=Math.max(120,Math.min(base,room)),mmh=mmw*(WY1-WY0)/(WX1-WX0);
    const mx0=VW-mmw-10,my0=10;drawMap(mx0,my0,mmw,false);UI.mm={x:mx0-3,y:my0-3,w:mmw+6,h:mmh+6+12};}
  if(G.bigMap){const bw=Math.min(VW-80,(VH-120)*(WX1-WX0)/(WY1-WY0));ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,VW,VH);drawMap(VW/2-bw/2,70,bw,true);
    txt(`WORLD MAP  ·  explored ${exploredPct()}%  ·  regions found ${Object.keys(G.visited).length}/${Object.keys(REGION_NAMES).length}  ·  M / LB to close`,VW/2,52,16,'#ffd24a','center');}
  if(false){const mmw=0,mmh=0,mmx=0,mmy=0,s=1;
  for(const st of structures){ctx.fillStyle=st.state==='ruin'?'#222':st.kind==='barn'?'#c33':'#dcb070';ctx.fillRect(mmx+st.x*s-1.5,mmy+st.y*s-1.5,3,3);}
  rect(mmx+(CASTLE.x-CASTLE.w/2)*s,mmy+(CASTLE.y-CASTLE.h/2)*s,CASTLE.w*s,CASTLE.h*s,'#999');
  for(const u of units){if(u.dead)continue;if(u.type==='knight'||u.type==='archer'||u.type==='hunter'){ctx.fillStyle=u.type==='knight'?'#4af':'#4f4';ctx.fillRect(mmx+u.x*s-1.5,mmy+u.y*s-1.5,3,3);}}
  for(const g of siege)if(!g.dead){ctx.fillStyle='#f0f';ctx.fillRect(mmx+g.x*s-2.5,mmy+g.y*s-2.5,5,5);}
  ctx.fillStyle='#ffd84a';for(const g of goldPiles)if(g.amt>0)ctx.fillRect(mmx+g.x*s-1.5,mmy+g.y*s-1.5,3,3);
  ell(mmx+LAIR.x*s,mmy+LAIR.y*s,6,4,'#c80');txt('LAIR',mmx+LAIR.x*s,mmy+LAIR.y*s-6,9,'#ffd27a','center');
  ell(mmx+CABIN.x*s,mmy+CABIN.y*s,3,3,'#7c4');if(PR.state==='tower')ell(mmx+PR.x*s,mmy+PR.y*s,3,3,'#f6c');
  ell(mmx+D.x*s,mmy+D.y*s,4,4,Math.floor(G.t*4)%2?'#f33':'#ff0');
  ctx.strokeStyle='rgba(255,255,255,.6)';ctx.strokeRect(mmx+(cam.x-VW/2/cam.z)*s,mmy+(cam.y-VH/2/cam.z)*s,VW/cam.z*s,VH/cam.z*s);}
  drawRegionBanner();
  // edge arrows for hunters approaching off-screen
  // (the lair guide arrow is drawn by partLA, on top of every HUD layer)
  for(const u of units){if(u.dead||u.post||(u.type!=='knight'&&u.type!=='archer'))continue;const sx=(u.x-cam.x)*cam.z+VW/2,sy=(u.y-cam.y)*cam.z+VH/2;
    if(sx>0&&sx<VW&&sy>0&&sy<VH)continue;let ex=clamp(sx,14,VW-14),ey=clamp(sy,130,VH-14);const a=Math.atan2(sy-VH/2,sx-VW/2);
    for(const r of [UI.col,UI.mm])if(r&&ex>r.x-8&&ex<r.x+r.w+8&&ey>r.y-8&&ey<r.y+r.h+8){if(ey<r.y+r.h+8&&r.y+r.h+14<VH-14)ey=r.y+r.h+14;} // keep clear of the left column / minimap
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);poly([8,0,-6,-6,-6,6],u.type==='knight'?'rgba(80,160,255,.85)':'rgba(80,255,80,.85)');ctx.restore();}
  // banner
  if(G.banner){const b=G.banner,al=clamp(Math.min(b.t,4.5-b.t)*2,0,1);ctx.globalAlpha=al;
    // keep the banner clear of the left HUD column: below it on desktop, beside it (column edge -> right edge) on touch screens
    const cb=(UI.colY||0)+(D.lava>0?32:D.lavaCD>0?26:0);let by=VH*0.26,bx0=0;if(by-46<cb+6){if(TOUCH.on)bx0=UI.col?UI.col.x+UI.col.w+8:0;else by=cb+52;}if(UI.mm&&bx0+0<UI.mm.x+UI.mm.w&&by-46<UI.mm.y+UI.mm.h+4)by=UI.mm.y+UI.mm.h+50; // and below the top-right minimap
    const bw=VW-bx0,bcx=bx0+bw/2;UI.banner={x:bx0,y:by-46,w:bw,h:b.extra?104:86};
    ctx.fillStyle='rgba(60,0,0,.75)';ctx.fillRect(bx0,by-46,bw,b.extra?104:86);
    const fitF=(s,f,bold)=>{ctx.font=`${bold?'bold ':''}${f}px Georgia`;const w=ctx.measureText(s).width;return w>bw-24?Math.max(10,Math.floor(f*(bw-24)/w)):f;};
    txt(b.text,bcx,by,fitF(b.text,sm?26:40,true),'#ffd24a','center');txt(b.sub,bcx,by+28,fitF(b.sub,sm?13:17,false),'#fff','center',false);if(b.extra)txt(b.extra,bcx,by+50,fitF(b.extra,sm?12:14,false),'#ffc0a0','center',false);ctx.globalAlpha=1;}
  else UI.banner=null;
  // controls reminder
  if(!sm&&!TOUCH.on)txt(GPAD.connected?'Stick move · A/RT fire · Y fly/land · X eat/grab · B stomp/dive/scratch · LB map · Start pause':'WASD move · Space fire · F fly/land · E eat/grab · Q stomp/dive/scratch · M map · P pause',14,VH-12,12,'rgba(255,255,255,.75)','left',false);
  if(!sm&&!TOUCH.on&&!G.over&&!G.won)txt(D.princess?'Goal: carry Princess Elizabeth to your LAIR (follow the gold arrow)':'Goal: raid the castle (south) for gold & the princess (E/X)',VW/2,VH-12,13,'#ffe8a0','center');
  if(G.over)drawOver();else if(G.won)drawWon();if(paused&&!G.over&&!G.won)drawPause();}
function center(lines,top){let y=top;for(const [s,size,col,bold] of lines){txt(s,VW/2,y,size,col,'center',bold);y+=size*1.45;}}
let titleSel=0;
function drawTitle(){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='rgba(10,5,5,.66)';ctx.fillRect(0,0,VW,VH);
  const k=TOUCH.on?Math.min(1.2,VH/470,VW/900):Math.min(1,VH/920,VW/1000);ctx.setTransform(DPR*k,0,0,DPR*k,DPR*(VW-VW*k)/2,0);const W0=VW;TOUCH.tg={k,ox:(VW-VW*k)/2,cx:W0/2,y0:112};
  let y=46;txt("DRAGON'S RAMPAGE",W0/2,y+10,52,'#ff9a3a','center');txt('You are a full-grown dragon. Raid the castle, steal the gold, carry off Princess Elizabeth!',W0/2,y+40,17,'#f3dcb8','center',false);
  // menu
  y=y+66;const rows=['▶  Start game',`Mode:  ${EASY?'EASY (more health, fewer attackers, no hunger)':'NORMAL'}   ◀ ▶`,`Graphics:  ${GFX_HI?'HIGH (shading, lighting, day & night)':'LOW (fastest)'}   ◀ ▶`,`Music volume:  ${AUD.muted?'MUTED':volBar(AUD.music)}   ◀ ▶`,`Sound effects:  ${AUD.muted?'MUTED':volBar(AUD.sfx)}   ◀ ▶`,svHasAny()?'⟲  Continue / Load saved game':'⟲  Load saved game  (no saves yet)'];
  rows.forEach((r,i)=>{const s=titleSel===i;panel(W0/2-230,y+i*36,460,30);if(s){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.strokeRect(W0/2-230,y+i*36,460,30);}
    txt(r,W0/2,y+i*36+21,17,s?'#ffd24a':(i===1&&EASY)||(i===2&&GFX_HI)||(i>2&&i<5&&!AUD.muted)?'#9f9':i===5&&!svHasAny()?'#888':'#ddd','center');});
  if(TOUCH.on){y+=232;txt('Tap a row to change it · tap ◀ / ▶ side of a volume row',W0/2,y,13,'#bbb','center',false);
    const T=['LEFT thumb: drag anywhere to move   ·   RIGHT thumb: FIRE (hold) · BITE (eat / grab) · STOMP · FLY',
      'STOMP while flying = crash DIVE STOMP · in water it becomes SCRATCH   ·   MAP and II (pause) on the left',
      'GOAL: grab the castle gold and Princess Elizabeth (north), carry them to your LAIR on Dragon Peak!'];
    y+=28;for(const t of T){txt(t,W0/2,y,15,'#e8d6c0','center',false);y+=24;}
    txt(Math.floor(performance.now()/500)%2?'Tap  ▶ Start game  to begin':'',W0/2,y+14,22,'#ffd24a','center');
    if(best)txt(`Best score: ${best}`,W0/2,y+40,14,'#ccc','center',false);ctx.setTransform(DPR,0,0,DPR,0,0);return;}
  y+=228;txt('↑/↓ choose · Enter/A select · ←/→ toggle / volume · M = Easy mode (great for young players: no hunger) · G = graphics · N = mute',W0/2,y,12,'#bbb','center',false);
  // controls table
  const L=[['Move','WASD / Arrows','Left stick / D-pad'],['Breathe fire (hold) · uses the red FIRE bar','Space','A / Cross  or  RT'],['Eat · grab gold/Princess Elizabeth','E','X / Square'],
    ['Stomp · flying = crash DIVE STOMP · swimming = CLAW SCRATCH','Q / Shift','B / Circle'],['Take off / land (from high = DIVE SLAM)','F','Y / Triangle'],['World map','M','LB / L1'],['Mute / unmute music & sound','N','—'],['Pause / start','P / Esc · Enter','Start / Options'],['Restart (game over)','R','Back / Select / Share']];
  const w=740,x=W0/2-w/2;y+=24;panel(x,y-20,w,L.length*23+34);txt('',x,y,1);txt('Action',x+20,y,13,'#f0c070');txt('Keyboard',x+300,y,13,'#f0c070');txt('Controller',x+500,y,13,'#f0c070');y+=24;
  for(const [a,b,c] of L){txt(a,x+20,y,14,'#fff','left',false);txt(b,x+300,y,14,'#ffd080');txt(c,x+500,y,14,'#9fd0ff');y+=23;}
  y+=20;const tips=['GOAL: raid King William\'s Castle Aldric (south-central): grab gold piles and Princess Elizabeth, then carry them home to your LAIR on Dragon Peak (far north, top of the snowy mountains).',
    'Delivering Princess Elizabeth wins the level (she is never hurt, only very cross!). Rest at the lair to heal and catch your breath.',
    'A huge world: farmlands, the Deepwood, hills, Mirror Lake, snowy peaks, the sea, and west past the desert the Golden Savanna and the Emerald Jungle. Fog lifts as you go.',
    'Every region has its own animals to eat (elephants = a feast). Predators hunt prey too; crocodiles lurk in rivers and ponds and snap back. Fish only while they jump!',
    'HUNGER (normal mode): your belly empties in about a minute or so (faster flying or breathing fire). Eat to refill it, or you starve and lose health. Easy mode: no hunger.',
    'WANTED tiers: foot soldiers, then knights, archers, mounted knights (lance charges) and siege engines from the castle gate. At the top tier whole villages take up spears: the MILITIA!',
    'MOUNT CINDER, the volcano beside your lair: land at the crater and press E / X to drink 20 LAVA SHOTS. Each fire press lobs a glob that cracks even stone and wells!',
    'Your GOLD HOARD grows as you stash loot. Big hoards lure HOARD RAIDS: a named champion marches on your lair. Beat or eat them to win the gold back, a bonus, and their banner as a trophy!',
    'Smash the CASTLE GATE: while it lies in rubble, waves are smaller and come far less often, until the engineers rebuild it with wood and stone.',
    'Patrols roam the roads under a banner (shields on the map). Attacking them raises the alarm. Burn the wooden bridges to cut them off!',
    'FIRE BAR: the red bar under stamina drains while you breathe fire and refills when you stop. Empty = no fire until it recovers a bit. It glows orange while you hold lava shots.',
    'MONSTER FEAST: wear down the giant squid or a sand worm, then eat it: +10% MAX HEALTH each time, fully healed. Your hoard, trophies and bonus carry over between castle levels (reset on death or a new game).',
    'DIVE STOMP: press stomp while flying to tuck your wings and plummet: a huge shockwave that smashes wooden buildings flat and cracks stone (2.4 s cooldown, 6 stamina).',
    'Villagers fight fires with buckets from ANY water (wells, town fountains, rivers, ponds, the sea), rebuild with wood and stone, replant burnt gardens and build fireproof STONE bridges: smash those with stomps or a dive slam.',
    'THE SEA (east): fly over water, or land in sea, lake or river to SWIM (slower; stomp becomes a CLAW SCRATCH that rakes boats, sharks, seals, pirates and squid tentacles; bite and fire still work). Hunger drains faster over water!',
    'Eat fish, sharks and whales; sink boats and cartoon PIRATES (archers!) for their gold. Rest at the Lonely Lighthouse, then face the GIANT SQUID.',
    'Wildflowers carpet every region and villagers tend fenced gardens: burn them and they scorch, then regrow. The music follows you from meadow to sea to desert (N mutes).'];
  for(const t of tips){txt(t,W0/2,y,13,'#e8d6c0','center',false);y+=19;}
  txt(GPAD.connected?'🎮 Controller ready':'Plug in an Xbox / PlayStation controller any time',W0/2,y+12,13,GPAD.connected?'#9fd0ff':'#999','center',false);
  txt(Math.floor(performance.now()/500)%2?'Press Enter, Space or A to begin':'',W0/2,y+42,22,'#ffd24a','center');
  if(best)txt(`Best score: ${best}`,W0/2,y+66,14,'#ccc','center',false);ctx.setTransform(DPR,0,0,DPR,0,0);}
function setEasy(v){EASY=!!v;try{localStorage.setItem('dr_easy',EASY?'1':'0');}catch(e){}}
function drawDrumstick(x,y,c){ctx.save();ctx.translate(x,y);ctx.rotate(-.7);ctx.fillStyle='#f4ead8';ctx.fillRect(-1.5,1,3,7);ctx.beginPath();ctx.arc(-2.2,8.5,2,0,TAU);ctx.arc(2.2,8.5,2,0,TAU);ctx.fill();
  ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,-2,5.5,7,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
function drawOver(){ctx.fillStyle=`rgba(20,0,0,${Math.min(.7,G.overT)})`;ctx.fillRect(0,0,VW,VH);const s=G.stats;
  center([['THE DRAGON HAS FALLEN',VW<760?28:48,'#ff6a4a'],[D.princess?'(The princess hops down, dusts herself off and stomps home to complain.)':'',14,'#ffc0e0',false],[G.starved?'You starved! Keep eating to keep your hunger up.':'',15,'#ffb060',false],['',VW<760?28:48,'#ff6a4a'],[`Final score: ${G.score}${G.score>=best?'  (new best!)':''}`,22,'#ffe08a'],
    [`Survived ${Math.floor(G.t/60)}m ${Math.floor(G.t%60)}s · reached wave ${G.waveNum}`,16,'#fff',false],
    [`Huts ${s.huts} · Barns ${s.barns} · Trees ${s.trees} · Crop patches ${s.crops}`,15,'#ddd',false],
    [`Villagers eaten ${s.eaten} · Farm animals ${s.animals} · Birds ${s.birds||0} · Carts ${s.carts} · Stockpiles ${s.piles}`,15,'#ddd',false],
    [`Knights ${s.knights} · Archers ${s.archers} · Siege engines ${s.siege}`,15,'#ddd',false],['',10,'#fff',false],['Press R / Enter (or Back / Start / A) to rise again',20,'#ffd24a']],VH*.3);}
function drawPause(){if(typeof PM!=='undefined'&&PM.on)return;ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,0,VW,VH);center([['PAUSED',44,'#ffd24a'],['P / Esc / Start to resume · R / Back to restart',18,'#fff',false]],VH*.42);}

function drawMap(mmx,mmy,mmw,big){const s=mmw/(WX1-WX0),mmh=(WY1-WY0)*s,X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s;panel(mmx-3,mmy-3,mmw+6,mmh+6);
  ctx.imageSmoothingEnabled=true;ctx.drawImage(TERR,mmx,mmy,mmw,mmh);ctx.drawImage(ground,0,0,WW,WH,X(0),Y(0),WW*s,WH*s);
  if(ROADS){ctx.lineCap='round';ctx.lineJoin='round';for(const r of ROADS){ctx.strokeStyle=r.kind==='bridge'?'#e0a040':r.kind==='main'?'rgba(120,90,50,.9)':'rgba(120,90,50,.6)';ctx.lineWidth=(big?2.2:1.2)*(r.kind==='main'||r.kind==='bridge'?1:.6);ctx.beginPath();r.pts.forEach((p,i)=>i?ctx.lineTo(X(p.x),Y(p.y)):ctx.moveTo(X(p.x),Y(p.y)));ctx.stroke();}}
  const q=big?4:2.4;
  for(const st of structures){ctx.fillStyle=st.state==='ruin'?'#222':st.kind==='bridge'?(st.mat==='stone'?'#ccc':'#c90'):st.kind==='barn'?'#c33':'#dcb070';ctx.fillRect(X(st.x)-q/2,Y(st.y)-q/2,q,q);}
  rect(X(CASTLE.x-CASTLE.w/2),Y(CASTLE.y-CASTLE.h/2),CASTLE.w*s,CASTLE.h*s,'#999');
  for(const u of units){if(u.dead||u.patrol)continue;if(u.type==='knight'||u.type==='archer'||u.type==='hunter'){ctx.fillStyle=u.type==='knight'?'#4af':'#4f4';ctx.fillRect(X(u.x)-q/2,Y(u.y)-q/2,q,q);}}
  for(const g of siege)if(!g.dead){ctx.fillStyle='#f0f';ctx.fillRect(X(g.x)-q,Y(g.y)-q,q*2,q*2);}
  ctx.fillStyle='#ffd84a';for(const g of goldPiles)if(g.amt>0)ctx.fillRect(X(g.x)-q/2,Y(g.y)-q/2,q,q);
  ctx.drawImage(fogImage(),mmx,mmy,mmw,mmh);
  for(const p of patrols){const L=p.members.find(u=>!u.dead);if(L&&seen(L.x,L.y))drawShield(X(L.x),Y(L.y),p.engaged?'#e33':'#36c');}
  drawSeaMap(X,Y,big,q);
  if(big)MAPLB=[];
  if(big)VILLAGES.forEach(v=>{if(v.name&&seen(v.x,v.y))txt(v.name,X(v.x),Y(v.y)+14,10,'#ffe8c0','center',false);});
  for(const M of MARKETS)if(seen(M.x,M.y)){const up=structures.some(s=>s.market===M.name&&s.state==='ok');ctx.fillStyle=up?'#ffb030':'#555';ctx.beginPath();ctx.arc(X(M.x),Y(M.y),big?5:3,0,TAU);ctx.fill();if(big)txt('⚖ '+M.name,X(M.x),Y(M.y)-8,9,up?'#ffd080':'#999','center',false);}
  for(const u of units)if(u.tax&&!u.dead&&seen(u.x,u.y)){ctx.fillStyle='#c6f';ctx.fillRect(X(u.x)-q/2,Y(u.y)-q/2,q,q);}
  if(typeof storeS==='function'){const s=storeS();if(s){ctx.fillStyle=s.state==='ok'?'#d8a860':'#6a5a4a';ctx.fillRect(X(s.x)-(big?4:2),Y(s.y)-(big?4:2),big?8:4,big?8:4);if(big)txt(s.state==='ok'?'Storehouse':'Storehouse (wrecked)',X(s.x)-8,Y(s.y)+16,9,'#e8d0a0','center');}
    for(const c of carts)if(c.supply&&!c.wrecked){ctx.fillStyle=c.kind==='wood'?'#c08040':'#c8c8c8';ctx.fillRect(X(c.x)-(big?3:1.5),Y(c.y)-(big?3:1.5),big?6:3,big?6:3);}}
  {const fs=big?11:8,sc=fs/12,a=typeof uiAmt==='function'?uiAmt(treasury()):String(treasury()),cy=Y(CASTLE.y)-(big?20:7);if(big)txt('♜ Castle Aldric',X(CASTLE.x),cy-14,fs,'#ffd84a','center');ctx.font=`bold ${fs}px Georgia`;const w=22*sc+ctx.measureText(a).width,x=X(CASTLE.x)-w/2;if(typeof uiCastle==='function'){uiCastle(x+8*sc,cy-fs*.35,sc);uiCoin(x+15*sc,cy-fs*.35+3*sc,sc);}txt(a,x+22*sc,cy,fs,'#ffd84a','left');}
  ell(X(LAIR.x),Y(LAIR.y),big?8:5,big?6:4,'#c80');txt(big?'LAIR (home)':'LAIR',X(LAIR.x),Y(LAIR.y)-6,9,'#ffd27a','center');
  for(const C of CABINS)if(seen(C.x,C.y)){const s=structures.find(q=>q.kind==='cabin'&&(q.cb||0)===CABINS.indexOf(C));ell(X(C.x),Y(C.y),big?4:3,big?4:3,s&&s.state!=='ok'?'#555':'#7c4');if(big)txt(s&&s.state!=='ok'?'Cabin (burned)':"Hunters' cabin",X(C.x),Y(C.y)+13,9,'#cfe8b0','center',false);}if(PR.state==='tower'){const pb=big?5:3.5;ell(X(PR.x),Y(PR.y),pb+1.5,pb+1.5,'#fff');ell(X(PR.x),Y(PR.y),pb,pb,'#f6c');txt(big?(roofOpen()?'♛ Princess (roof broken!)':'♛ Princess (in the keep)'):'♛',X(PR.x)-(big?24:0),Y(PR.y)+(big?4:-5),big?10:9,'#ffb0dc',big?'right':'center',false);}
  ell(X(D.x),Y(D.y),big?6:4,big?6:4,Math.floor(G.t*4)%2?'#f33':'#ff0');
  ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.strokeRect(X(cam.x-VW/2/cam.z),Y(cam.y-VH/2/cam.z),VW/cam.z*s,VH/cam.z*s);
  if(big){// region names last, nudged off the town / castle / princess labels (skipped if there's no room)
    const L=MAPLB;MAPLB=null;ctx.font='bold 13px Georgia';
    for(const k in REGION_LABEL){if(!G.visited[k]||k==='castle')continue;const[lx,ly]=REGION_LABEL[k],nm=REGION_NAMES[k];
      for(const[ox,oy]of[[0,0],[0,-14],[0,14],[0,-26],[0,26],[-50,0],[50,0],[-50,-16],[50,16],[0,-40],[0,40]]){const b=lbBox(nm,X(lx)+ox,Y(ly)+oy,13,'center');if(!lbHit(b,L)){L.push(b);txt(nm,X(lx)+ox,Y(ly)+oy,13,'#fff','center');break;}}}}
  if(!big)txt(`Explored ${exploredPct()}%  ·  M: map`,mmx+mmw,mmy<24?mmy+mmh+15:mmy-8,10,'#ddd','right',false);} // caption under the minimap when it sits in the top corner
// ---------- main loop ----------
function update(dt){G.t+=dt;G.fc++;if(P('m'))G.bigMap=!G.bigMap;G.shake=Math.max(0,G.shake-dt*30);if(G.banner){G.banner.t-=dt;if(G.banner.t<=0)G.banner=null;}
  if(!G.over&&!G.won)updDragon(dt);else if(G.over)G.overT+=dt;
  updFire(dt);updEconomy(dt);updK(dt);updTaxes(dt);updDesert(dt);updAlarm(dt);updMilitiaAll(dt);updFlora(dt);updGoal(dt);updBirds(dt);updHunger(dt);updWorld(dt);updFauna(dt);updPatrols(dt);updBridges(dt);updSea(dt);
  for(const u of units){if(u.dead)continue;
    if(u.type==='sea'){const far=Math.abs(u.x-D.x)>2000||Math.abs(u.y-D.y)>1600;if(far&&u.kind!=='squid'){if((G.fc+((u.id*97)|0))%6)continue;updSeaUnit(u,dt*6);continue;}updSeaUnit(u,dt);continue;}
    if(u.type==='villager'||u.type==='animal'||u.type==='hunter'){const t=farTick(u,dt);if(!t)continue;if(u.carav&&updCaravan(u,t))continue;if(u.species==='sandworm'){updWorm(u,t);continue;}if(u.type==='villager')updVillager(u,t);else if(u.type==='hunter')updHunter(u,t);else if(u.wild)updWild(u,t);else updAnimal(u,t);continue;}
    if(u.patrol&&!u.patrol.engaged)continue;
    if(soldierSwim(u,dt))continue;
    if(u.prince&&princeStep(u,dt))continue;
    if(u.raid&&raidStep(u,dt))continue;
    if(u.escort&&escortStep(u,dt))continue;
    if(u.type==='knight')updKnight(u,dt);else if(u.type==='archer')updArcher(u,dt);else if(u.type==='crew')updCrew(u,dt);}
  for(const g of siege)updSiege(g,dt);
  taxSacks();for(let i=units.length-1;i>=0;i--)if(units[i].dead)units.splice(i,1);
  for(let i=siege.length-1;i>=0;i--)if(siege[i].dead&&!siege[i].gone){siege[i].deadT=(siege[i].deadT||0)+dt;if(siege[i].deadT>25)siege.splice(i,1);}
  updProjs(dt);updParts(dt);if(GFX_HI)gfxTick(dt);}
let FRAME_ERR=null,FRAME_ERRN=0;
function frame(ts){try{frameBody(ts);}catch(e){FRAME_ERRN++;if(!FRAME_ERR||FRAME_ERRN<4)try{console.error('frame error',e);}catch(_){}FRAME_ERR={msg:String(e&&e.message||e),t:performance.now()};pressed={};
    try{ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(120,0,0,.85)';ctx.fillRect(0,0,cv.width,Math.round(28*DPR));ctx.fillStyle='#fff';ctx.font=Math.round(14*DPR)+'px Georgia';ctx.textAlign='left';ctx.fillText('Oops: '+FRAME_ERR.msg.slice(0,90),8*DPR,19*DPR);}catch(_){}}
  requestAnimationFrame(frame);}
function frameBody(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
  pollPad(dt);touchTick();if(P('n'))toggleMute();musicTick(dt);sfxTick(dt);
  if(scene==='title'&&PM.on){pmInput();pressed={};G.t+=dt;}
  else if(scene==='title'){if(P('arrowup')||P('w'))titleSel=Math.max(0,titleSel-1);if(P('arrowdown')||P('s'))titleSel=Math.min(5,titleSel+1);
    if(titleSel>=3){const k=titleSel===3?'music':'sfx',dv=(P('arrowleft')||P('a'))?-.1:(P('arrowright')||P('d'))?.1:P('enter')?(AUD[k]>=1?-1:.1):0;if(dv){setVol(k,AUD[k]+dv);if(k==='sfx')SFX.play('coin');}}
    if(P('g')||((P('arrowleft')||P('arrowright')||P('a')||P('d')||P('enter'))&&titleSel===2))setGfx(!GFX_HI);
    if(P('m')||((P('arrowleft')||P('arrowright')||P('a')||P('d'))&&titleSel===1)||(P('enter')&&titleSel===1))setEasy(!EASY);
    if(P('enter')&&titleSel===5){pmOpen('load','title');}
    else if((P('enter')&&titleSel===0)||P(' ')){scene='play';newGame();pressed={};}
    else{G.t+=dt;cam.x=1700+Math.sin(ts/9000)*700;cam.y=1900+Math.cos(ts/11000)*1300;cam.z=1;updFire(dt);updEconomy(dt);G.fc++;for(const u of units){const t=farTick(u,dt);if(!t)continue;if(u.type==='villager')updVillager(u,t);else if(u.type==='animal'){if(u.wild)updWild(u,t);else updAnimal(u,t);}}updBirds(dt);updParts(dt);}}
  else{ const used=PM.on&&PM.from==='pause'&&paused&&!G.over&&!G.won&&pmInput();
    if(!used&&(P('p')||P('escape'))&&!G.over)paused=!paused;
    if(paused&&!PM.on&&scene==='play'&&!G.over&&!G.won&&!TOUCH.rotPaused){pmOpen('main','pause');svAuto();}
    if(!paused&&PM.on&&PM.from==='pause')pmClose();
    if(!used&&((G.over&&(P('r')||(P('enter')&&G.overT>1)))||(paused&&P('r')))||(G.won&&P('r'))){newGame();paused=false;}
    else if(G.won&&G.wonT>1&&(P('enter')||P(' '))){nextLevel();paused=false;}
    if(!paused)update(dt);
    cam.z=clamp(Math.min(VW/1150,VH/760),.55,1.15)*(1-.12*D.alt);cam.x=lerp(cam.x,D.x+D.vx*.35,Math.min(1,dt*5));cam.y=lerp(cam.y,D.y-heightOf()*.5+D.vy*.35,Math.min(1,dt*5));}
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);
  drawWorld();if(scene==='title')drawTitle();else withSafe(drawHUD);drawTouch();if(PM.on)drawPM();drawToast();
  pressed={};}
newGame();D.x=-9999;requestAnimationFrame(frame);
// test hook
window.DRG={setEasy,tryEat,biteTargets,kingdomMul,concern,isWild,LIVESTOCK,mkUnit,get birds(){return birds},mkBird,get PR(){return PR},eatUnit,feed,HUNGER,updHunger,get ships(){return ships},get loot(){return loot},get cballs(){return cballs},LH,ISEAL_ROCKS,DOCK,get G(){return G},get D(){return D},get units(){return units},get siege(){return siege},get structures(){return structures},get trees(){return trees},get cells(){return cells},get carts(){return carts},get boulders(){return boulders},get projs(){return projs},
  start(){scene='play';newGame();},step(n,dt){for(let i=0;i<n;i++){update(dt||1/60);pressed={};}},press(k){pressed[k]=true;},hold(k,v){keys[k]=v;},spawnWave,addAlarm,DR,setScene(s){scene=s;},get PR(){return PR},get birds(){return birds},tryEatBird,get goldPiles(){return goldPiles},LAIR,CABIN,GATE,nextLevel,tryEat,setEasy,get patrols(){return patrols},spawnPatrol,regionKey,get FOG(){return FOG},seen,get TERR(){return TERR},get DECOR(){return DECOR},spawnWild,FAUNA,mkCavalry,dismount,LAKE,RIVER,riverRoute,riverBlocked,onBridge,bridgeEnds,diveSlam,updBridgeWork,exploredPct,VILLAGES,hurtStruct,hurtUnit,doStomp,applyFire,update,get EASY(){return EASY},GPAD,musterSlow,get scene(){return scene},get titleSel(){return titleSel}};
</script></body></html>
