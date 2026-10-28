// ======================= foot soldiers (first wanted tier) & the village MILITIA (final tier) =======================
function drawFootman(u){const x=u.x,y=u.y,f=u.face||1,g=Math.sin(u.anim*1.6);
  ell(x,y+1.5,6,2.4,'rgba(0,0,0,.25)');ctx.save();ctx.translate(x,y);ctx.scale(1.28,1.28);
  line(-1.4,0,-1.4+g*1.6,-5,'#3a2a1a',1.6);line(1.4,0,1.4-g*1.6,-5,'#3a2a1a',1.6);
  rect(-3.2,-11.5,6.4,7.5,u.burn>0?'#f60':u.colr||'#a33');rect(-3.2,-6.5,6.4,1.2,'#5a3a1a'); // padded gambeson + belt
  ell(0,-13.6,2.5,2.5,'#f0c8a0');
  ell(0,-15,4.2,1.3,'#9aa0aa');ell(0,-15.8,2.6,1.8,'#b4bac4'); // kettle hat
  const st=u.swing>0?6:0;line(-f*4,-4,f*(10+st),-14,'#8a6a40',1.1);poly([f*(10+st),-14,f*(7.5+st),-14.6,f*(8.6+st),-12.2],'#d8dce2'); // spear
  ell(-f*3.2,-8,2.8,3.4,'#7a5530');ell(-f*3.2,-8,1,1,'#c9a43a'); // round shield
  ctx.restore();
  if(u.hp<u.maxHp){rect(x-8,y-26,16,2,'#400');rect(x-8,y-26,16*u.hp/u.maxHp,2,'#e44');}}
function drawMilitiaKit(u,x,y,f,bob){const st=u.poke>0?4:0,ar=u.throwA>0;
  rect(x-2.8,y-7.5+bob*.3,5.6,1.3,'#c22'); // red armband sash: "we're the militia now"
  if(!ar){line(x-f*3,y-3,x+f*(9+st),y-17,'#8a6a40',1);poly([x+f*(9+st),y-17,x+f*(7+st),y-17.4,x+f*(7.8+st),y-15.4],'#ccd');}
  else line(x,y-9,x-f*3,y-16,'#f0c8a0',1.2);
  if(u.hp<u.maxHp){rect(x-6,y-20,12,2,'#400');rect(x-6,y-20,12*u.hp/u.maxHp,2,'#e44');}}
function militiaOK(u){return u.type==='villager'&&!u.dead&&!u.inside&&!u.tax&&!u.carav&&u.v>=0&&VILLAGES[u.v]&&(u.job==='peasant'||u.job==='farmer')&&!u.task&&!u.water;}
function updMilitiaAll(dt){G.milT=(G.milT||0)-dt;if(G.milT>0)return;G.milT=.5;
  const want=G.level>=6; // the HUD says MILITIA at the top tier, so the villagers arm up right then (no extra wave gate)
  if(want)G.milOff=0;else if(G.milOn){G.milOff=(G.milOff||0)+.5;}
  if(want&&!G.milOn){G.milOn=true;if(!G.seenMil){G.seenMil=true;G.banner={text:'MILITIA! The villagers take up spears!',sub:'Every town defends itself now: they gather in groups, poke and throw spears when you are on the ground or flying low.',extra:'They are the weakest fighters in the kingdom (a feeble poke), but they stand their ground instead of running away.',t:5};}}
  if(G.milOn&&!want&&G.milOff>=8){G.milOn=false;for(const u of units)if(u.militia){u.militia=false;u.state='idle';u.tgt=null;}float(D.x,D.y-120,'The militia goes home','#cfe');}
  if(!G.milOn)return;
  const per={},rally={};for(const u of units)if(u.militia&&!u.dead){per[u.v]=(per[u.v]||0)+1;const r=rally[u.v]||(rally[u.v]={x:0,y:0,n:0});r.x+=u.x;r.y+=u.y;r.n++;}
  for(const u of units)if(!u.militia&&militiaOK(u)&&(per[u.v]||0)<12&&d2(u.x,u.y,VILLAGES[u.v].x,VILLAGES[u.v].y)<700){u.militia=true;u.state='idle';u.tgt=null;per[u.v]=(per[u.v]||0)+1;u.hp=u.maxHp=FBN.milHp;u.throwT=R(2,5);if(rnd()<.3)float(u.x,u.y-24,['To arms!','Spears!','Get the beast!','For our homes!'][RI(0,3)],'#fdd');}
  G.milRally=rally;for(const k in rally){const r=rally[k];r.x/=r.n;r.y/=r.n;}
  for(const u of units)if(u.militia&&!u.dead){let n=0;for(const o of units)if(o!==u&&o.militia&&!o.dead&&Math.abs(o.x-u.x)<150&&Math.abs(o.y-u.y)<150)n++;u.allies=n;}}
function militiaCount(){let n=0;for(const u of units)if(u.militia&&!u.dead)n++;return n;}
function updMilitia(u,dt){if(!G.milOn||G.over){u.militia=false;return false;}
  const V=VILLAGES[u.v];if(!V){u.militia=false;return false;}
  const dd=dist(u,D),low=D.alt<.55,near=d2(D.x,D.y,V.x,V.y)<720||dd<260,al=u.allies||0,k=Math.min(2.2,1+.15*al);
  u.poke=Math.max(0,(u.poke||0)-dt);u.throwA=Math.max(0,(u.throwA||0)-dt);u.throwT=(u.throwT||0)-dt;u.atk=(u.atk||0)-dt;
  if(near){u.face=D.x>u.x?1:-1;const r=G.milRally&&G.milRally[u.v];
    if(al<2&&dd>200&&r&&r.n>1&&d2(u.x,u.y,r.x,r.y)>40){moveTo(u,r.x,r.y,62,dt);u.anim+=dt*10;} // bunch up first
    else if(low&&dd>46){moveTo(u,D.x,D.y,dd>300?60:52,dt);u.anim+=dt*9;}
    else if(!low){const a=u.id*TAU+G.t*.3;moveTo(u,D.x+Math.cos(a)*110,D.y+Math.sin(a)*70,40,dt);u.anim+=dt*6;}
    if(low&&D.alt<DR.hitAltSword&&dd<60&&u.atk<=0){u.atk=FBN.milCd*R(.92,1.1);u.poke=.22;hurtDragon(FBN.milDmg,'spear');}
    else if(dd>70&&dd<270&&u.throwT<=0&&D.alt<.6){u.throwT=FBN.milTcd*R(.9,1.15);u.throwA=.35;const T=dd/300,px=D.x+D.vx*T*.5,py=D.y+D.vy*T*.5,a=Math.atan2(py-u.y,px-u.x);
      projs.push({kind:'spear',x:u.x,y:u.y,z:12,vx:Math.cos(a)*300,vy:Math.sin(a)*300,tz:heightOf()+10,life:T+.25,dmg:FBN.milTdmg});}
    return true;}
  // no dragon about: stand guard around the village, never hide
  if(u.state!=='walk'||!u.tgt){u.tgt={x:V.x+R(-150,150),y:V.y+R(-110,110)};u.state='walk';u.wait=R(1,4);}
  if(u.wait>0){u.wait-=dt;return true;}if(moveTo(u,u.tgt.x,u.tgt.y,34,dt))u.state='idle';u.anim+=dt*6;return true;}
