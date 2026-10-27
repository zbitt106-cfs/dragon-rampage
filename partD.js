// ======================= THE SCORCHING SANDS (life: decor, fauna, worm, vultures, caravans)
const PASS_W={x:RANGE0-150,y:1830},PASS_E={x:RANGE1+150,y:1830};
const DES_SP=new Set(['camel','lizard','dfox','snake','dscorp','sandworm']);
const inDesert=(x,y)=>regionKey(x,y)==='desert';
function desertCol(x,y,n){const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  const dune=Math.sin(x*.011+y*.0045+fbm(x/500,y/500)*7)*.5+.5;let c=mix([232,202,140],[204,166,104],dune*.55+n*.35);
  const od=Math.hypot((x-OASIS.x)/(OASIS.rx+120),(y-OASIS.y)/(OASIS.ry+90));if(od<1.25)c=mix([96,140,62],c,clamp((od-.85)/.4,0,1)); // green ring around the oasis
  if(fbm(x/380+30,y/380)>.68)c=mix(c,[178,120,80],.55); // red rock flats
  return c;}
// ---------- decor: cacti, palms, mesas, bleached bones ----------
let MESAS=[];
function addDesertDecor(r,Rr){MESAS=[];
  for(let i=0;i<16;i++){const x=Rr(WX0+900,RANGE0-300),y=Rr(-50,4000);if(d2(x,y,DTOWN.x,DTOWN.y)<700||d2(x,y,OASIS.x,OASIS.y)<600||y>coastY(x)-350)continue;const m={k:'mesa',x,y,w:Rr(160,300),h:Rr(70,120)};MESAS.push(m);DECOR.push(m);}
  for(let i=0;i<420;i++){const x=Rr(WX0+760,RANGE0-60),y=Rr(-120,4200);if(regionKey(x,y)!=='desert'||inLake(x,y)||d2(x,y,DTOWN.x,DTOWN.y)<330||MESAS.some(m=>Math.abs(m.x-x)<m.w*.6&&Math.abs(m.y-y)<60))continue;DECOR.push({k:'cactus',x,y,s:Rr(.7,1.3),arms:r()<.7?(r()<.5?2:1):0});}
  for(let i=0;i<16;i++){const a=i/16*TAU+Rr(-.15,.15);DECOR.push({k:'palm',x:OASIS.x+Math.cos(a)*(OASIS.rx+Rr(25,70)),y:OASIS.y+Math.sin(a)*(OASIS.ry+Rr(20,55)),s:Rr(.9,1.3)});}
  for(const[dx,dy]of[[-150,-120],[170,-110],[-190,110],[200,130]])DECOR.push({k:'palm',x:DTOWN.x+dx,y:DTOWN.y+dy,s:1});
  for(let i=0;i<26;i++){const x=Rr(WX0+900,RANGE0-200),y=Rr(0,4000);if(regionKey(x,y)==='desert'&&!inLake(x,y))DECOR.push({k:'bones',x,y});}}
function drawDesertDecor(o){const x=o.x,y=o.y;
  if(o.k==='cactus'){const s=o.s,g='#4f8a3a',dk='#3a6a2a';ell(x+6*s,y+2,12*s,4*s,'rgba(0,0,0,.2)');rect(x-5*s,y-40*s,10*s,40*s,g);ell(x,y-40*s,5*s,5*s,g);rect(x-1*s,y-38*s,2*s,36*s,dk);
    if(o.arms>0){rect(x-15*s,y-26*s,10*s,6*s,g);rect(x-15*s,y-38*s,6*s,14*s,g);ell(x-12*s,y-38*s,3*s,3*s,g);}
    if(o.arms>1){rect(x+5*s,y-20*s,10*s,6*s,g);rect(x+9*s,y-32*s,6*s,14*s,g);ell(x+12*s,y-32*s,3*s,3*s,g);}
    if((o.x|0)%5===0)ell(x,y-45*s,3*s,2.5*s,'#ff7ab0');return true;}
  if(o.k==='palm'){const s=o.s,sw=Math.sin(G.t*1.2+x)*3;ell(x+16*s,y+3,22*s,6*s,'rgba(0,0,0,.2)');ctx.strokeStyle='#8a6a3a';ctx.lineWidth=6*s;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+8*s,y-30*s,x+4*s+sw,y-62*s);ctx.stroke();
    for(let i=0;i<7;i++){const a=i/7*TAU+.3,L=30*s;ctx.strokeStyle=i%2?'#3f8a3a':'#55a040';ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(x+4*s+sw,y-62*s);ctx.quadraticCurveTo(x+4*s+sw+Math.cos(a)*L*.6,y-70*s+Math.sin(a)*L*.3-10*s,x+4*s+sw+Math.cos(a)*L,y-58*s+Math.sin(a)*L*.4);ctx.stroke();}
    for(let i=0;i<3;i++)ell(x+2*s+sw+i*3,y-58*s,3*s,3*s,'#6a4a2a');return true;}
  if(o.k==='mesa'){const w=o.w,h=o.h;ell(x+20,y+6,w*.6,w*.12,'rgba(0,0,0,.22)');poly([x-w/2,y,x-w*.38,y-h,x+w*.38,y-h,x+w/2,y],'#b8704a');poly([x+w*.1,y,x+w*.22,y-h,x+w*.38,y-h,x+w/2,y],'#9a5838');
    for(let k=1;k<4;k++)line(x-w*(.5-.03*k),y-h*k/4,x+w*(.5-.03*k),y-h*k/4,'rgba(120,60,30,.45)',3);ell(x,y-h,w*.38,10,'#d08a58');return true;}
  if(o.k==='bones'){ell(x,y,9,4,'#efe6d0');ell(x-8,y-2,4,3.5,'#f4ecd8');for(let i=0;i<3;i++)line(x-2+i*4,y-3,x-1+i*4,y+3,'#d8ccb0',1.5);return true;}
  return false;}
// ---------- desert wildlife ----------
Object.assign(FAUNA,{camel:{hp:30,sp:70,flee:220,zone:'desert'},lizard:{hp:3,sp:110,flee:170,zone:'desert'},dfox:{hp:7,sp:115,flee:240,zone:'desert'},
  snake:{hp:5,sp:55,bite:1,aggro:85,cd:1.6,say:'Hsss! Snake bite! -1',zone:'desert'},dscorp:{hp:4,sp:60,bite:1,aggro:80,cd:1.5,say:'Scorpion sting! -1',zone:'desert'}});
ZONES.desert={ok:(x,y)=>regionKey(x,y)==='desert'&&!inLake(x,y),s:()=>({x:R(WX0+800,RANGE0-120),y:R(-80,4100)})};
FAUNA_PLAN.push(['camel',10],['lizard',14],['dfox',6],['snake',8],['dscorp',10]);
Object.assign(HEAL,{camel:34,lizard:4,dfox:8,snake:5,dscorp:4,sandworm:60});
['camel','lizard','dfox','snake','dscorp','sandworm'].forEach(s=>FAUNA_ART.add(s));
function drawDesertFauna(u){const x=u.x,y=u.y,s=u.species,f=u.face||1,b=Math.abs(Math.sin(u.anim||0))*1.5;
  if(s==='sandworm'){drawWorm(u);return;}
  if(s==='camel'){ell(x,y+2,24,6,'rgba(0,0,0,.2)');const c=u.carav?'#c8965a':'#c89a62',dk='#a07444';for(const lx of[-12,-6,8,14])line(x+lx,y-14-b,x+lx+Math.sin((u.anim||0)+lx)*3,y,dk,3);
    ell(x,y-20-b,20,10,c);ell(x-4,y-30-b,8,7,c);ell(x+6,y-28-b,7,6,c); // two humps
    line(x+f*16,y-22-b,x+f*24,y-36-b,c,6);ell(x+f*27,y-38-b,7,4.5,c);ell(x+f*30,y-38-b,1.5,1.5,'#222');ell(x+f*23,y-42-b,2,3,dk);
    if(u.carav){rect(x-12,y-34-b,10,8,'#7a3a6a');rect(x+1,y-33-b,10,7,'#3a6a8a');line(x-14,y-27-b,x+14,y-27-b,'#5a3a1a',2);}return;}
  if(s==='lizard'){ell(x,y+1,9,2.5,'rgba(0,0,0,.18)');const w=Math.sin((u.anim||0)*2)*2;ell(x,y-3,8,3,'#8aa040');ctx.strokeStyle='#8aa040';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-f*7,y-3);ctx.quadraticCurveTo(x-f*12,y-3+w,x-f*17,y-1);ctx.stroke();
    ell(x+f*9,y-4,3.5,2.5,'#9ab048');ell(x+f*10,y-5,.9,.9,'#222');for(const lx of[-4,4])line(x+lx,y-3,x+lx+2,y+1+(w>0?1:-1),'#6a8030',1.5);return;}
  if(s==='snake'){ctx.strokeStyle='#a0763a';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<=8;i++){const px=x-f*i*3.2,py=y-2+Math.sin(G.t*6+i*.9+u.id)*3;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
    ctx.strokeStyle='rgba(90,60,20,.6)';ctx.lineWidth=1.5;ctx.stroke();ell(x+f*2,y-3,4,3,'#a0763a');ell(x+f*3,y-4,.9,.9,'#222');if(u.state==='hunt')line(x+f*5,y-3,x+f*9,y-2,'#e33',1);return;}
  if(s==='dscorp'){ell(x,y+1,8,2.5,'rgba(0,0,0,.18)');ell(x,y-3,6,3.5,'#3a2a20');for(const k of[-1,1])for(let i=0;i<3;i++)line(x-3+i*3,y-3,x-4+i*3,y-3+k*6,'#3a2a20',1.2);
    ell(x+f*7,y-4,2.5,1.8,'#3a2a20');ell(x+f*9,y-6,2,1.6,'#3a2a20');ctx.strokeStyle='#3a2a20';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-f*5,y-3);ctx.quadraticCurveTo(x-f*11,y-12,x-f*4,y-14);ctx.stroke();ell(x-f*3,y-14,1.5,1.5,'#e8c040');return;}
  if(s==='dfox'){ell(x,y+1,12,3,'rgba(0,0,0,.18)');const c='#e0b070';for(const lx of[-6,5])line(x+lx,y-6-b,x+lx,y,c,2);ell(x,y-9-b,10,5,c);ell(x-f*12,y-10-b,7,3,c);ell(x-f*17,y-10-b,2.5,2,'#fff');
    ell(x+f*10,y-12-b,5,4.5,c);poly([x+f*8,y-15-b,x+f*7,y-27-b,x+f*12,y-16-b],c);poly([x+f*11,y-15-b,x+f*13,y-27-b,x+f*15,y-15-b],c);ell(x+f*14,y-12-b,1,1,'#222');return;}}
// ---------- the giant sand worm mini-boss ----------
function spawnWorm(){for(let t=0;t<40;t++){const x=R(WX0+1400,RANGE0-700),y=R(300,3800);if(ZONES.desert.ok(x,y)&&d2(x,y,DTOWN.x,DTOWN.y)>800&&d2(x,y,D.x,D.y)>900){
  const u=mkUnit('animal',x,y,{species:'sandworm',wild:true,zone:'desert',home:{x:x-700,y:y-500,w:1400,h:1000},hp:150,maxHp:150,ws:'under',inside:true,t:0,cd:3,face:1});units.push(u);return u;}}return null;}
function updWorm(u,dt){const dd=dist(u,D),low=D.alt<.4&&!G.over&&!G.won;u.cd-=dt;u.t+=dt;u.anim=(u.anim||0)+dt*4;
  if(u.ws==='under'){u.inside=true;const H=u.home;let tx,ty,sp=55;
    if(low&&dd<750&&inDesert(D.x,D.y)){tx=D.x;ty=D.y;sp=dd<300?150:110;if(!u.warn||G.t-u.warn>10){u.warn=G.t;float(D.x,D.y-110,'The sand is moving…!','#ffd090');}}
    else{if(!u.tgt||dist(u,u.tgt)<30)u.tgt={x:H.x+R(0,H.w),y:H.y+R(0,H.h)};tx=u.tgt.x;ty=u.tgt.y;}
    const a=Math.atan2(ty-u.y,tx-u.x),nx=u.x+Math.cos(a)*sp*dt,ny=u.y+Math.sin(a)*sp*dt;if(ZONES.desert.ok(nx,ny)){u.x=nx;u.y=ny;}u.face=Math.cos(a)>0?1:-1;
    if(low&&dd<55&&u.cd<=0){u.ws='up';u.t=0;u.upT=4.5;u.inside=false;u.bite=1.2;hurtDragon(8,'sandworm');G.shake=Math.max(G.shake,14);puff(u.x,u.y,30,'rgba(220,190,130,',240,14);
      float(u.x,u.y-120,'A GIANT SAND WORM bursts from the dunes! -8','#ff9a5a');if(typeof SFX!=='undefined'&&SFX.play)SFX.play('worm',u.x,u.y,1);}
    if(dd<900&&Math.random()<dt*6)puff(u.x+R(-14,14),u.y+R(-6,6),1,'rgba(200,170,110,',30,4);return;}
  // above ground: lunges at a dragon in reach, then sinks back
  u.upT-=dt;u.bite-=dt;u.face=D.x>u.x?1:-1;
  if(low&&dd<120&&u.bite<=0){u.bite=1.5;u.lunge=.35;hurtDragon(5,'sandworm');float(D.x,D.y-100,'CHOMP! Worm bite! -5','#ffb0a0');}
  u.lunge=Math.max(0,(u.lunge||0)-dt);
  if(u.upT<=0||u.hp<u.maxHp*.2&&u.upT<2.5&&!u.stuck){if(u.hp<u.maxHp*.35&&!u.stuck){u.stuck=true;u.upT=5;float(u.x,u.y-120,'The worm is dazed! Eat it!','#ffe08a');return;}
    u.ws='under';u.inside=true;u.cd=R(4,6);u.stuck=false;puff(u.x,u.y,18,'rgba(220,190,130,',160,10);}}
function drawWormMound(u){const x=u.x,y=u.y;ell(x,y,34,12,'rgba(150,110,60,.35)');ell(x,y-3,24,8,'rgba(235,205,150,.9)');for(let i=0;i<3;i++){const ph=(G.t*1.4+i/3)%1;ctx.strokeStyle=`rgba(170,130,80,${.5*(1-ph)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,24+ph*40,8+ph*14,0,0,TAU);ctx.stroke();}}
function drawWorm(u){const x=u.x,y=u.y,f=u.face||1,rise=Math.min(1,u.t/.4),H=120*rise,L=(u.lunge||0)>0?24:0,col=u.stuck?'#b07070':'#c8826a',hit=u.hurtT>0;
  ell(x,y+2,46,15,'rgba(0,0,0,.25)');ell(x,y,44,14,'#b8925a');
  for(let i=0;i<9;i++){const t=i/8,px=x+Math.sin(G.t*3+t*3)*8*t+f*L*t*t,py=y-H*t,r=26-t*6;ell(px,py,r,r*.8,i%2?col:'#a86a56');line(px-r,py,px+r,py,'rgba(90,40,30,.35)',2);}
  const hx=x+Math.sin(G.t*3+3)*8+f*L,hy=y-H;ell(hx,hy-4,22,16,'#5a1a1a');for(let k=0;k<10;k++){const a=k/10*TAU;poly([hx+Math.cos(a)*20,hy-4+Math.sin(a)*14,hx+Math.cos(a+.2)*13,hy-4+Math.sin(a+.2)*9,hx+Math.cos(a-.2)*13,hy-4+Math.sin(a-.2)*9],'#fff4dc');}
  ell(hx,hy-4,8,6,'#2a0808');if(u.stuck){txt('dazed',x,y-H-30,11,'#ffe08a','center');}
  for(let k=0;k<4;k++)ell(x+R(-40,40),y+R(-4,4),2,2,'rgba(220,190,130,.8)');}
// ---------- vultures circling over the dunes ----------
BIRD.vulture={heal:10,pts:45,sp:110,col:'#3a2a22'};
function spawnVulture(){const c={x:R(WX0+1200,RANGE0-400),y:R(200,3800)};if(regionKey(c.x,c.y)!=='desert')return;for(let i=0;i<RI(2,3);i++){const b=mkBird('vulture',c.x,c.y,{state:'soar',z:R(120,170),cx:c.x,cy:c.y,ang:R(0,TAU),rad:R(110,190),dir:Math.random()<.5?1:-1});birds.push(b);}}
function updVulture(b,dt,dd){b.flap+=dt*(Math.sin(G.t*.7+b.id)>.6?6:-12);b.ang+=dt*.55*b.dir;
  if(D.alt>.5&&dd<230){const a=Math.atan2(b.y-D.y,b.x-D.x);b.cx+=Math.cos(a)*120*dt;b.cy+=Math.sin(a)*120*dt;}
  const tx=b.cx+Math.cos(b.ang)*b.rad,ty=b.cy+Math.sin(b.ang)*b.rad*.6;b.vx=(tx-b.x)*2;b.vy=(ty-b.y)*2;b.x=tx;b.y=ty;b.z=lerp(b.z,150+Math.sin(G.t*.4+b.id)*20,dt);}
// ---------- camel caravans plodding between the pass, Sandhaven and the oasis ----------
const CARAVAN_ROUTE=()=>[PASS_E,PASS_W,{x:DTOWN.x+150,y:DTOWN.y+40},{x:OASIS.x+OASIS.rx+80,y:OASIS.y},{x:DTOWN.x-60,y:DTOWN.y+80}];
function spawnCaravan(){const R0=CARAVAN_ROUTE(),i=RI(0,R0.length-1),p=R0[i];const lead=spawnVillager(p.x,p.y,'trader',DTOWN.vi);lead.carav=true;lead.route=R0;lead.ri=(i+1)%R0.length;lead.shirt='#e0c070';lead.turban=1;
  let prev=lead;for(let k=0;k<3;k++){const c=mkUnit('animal',p.x-(k+1)*34,p.y,{species:'camel',carav:true,leader:prev,hp:30,maxHp:30,face:1});units.push(c);prev=c;}return lead;}
function updCaravan(u,dt){u.anim=(u.anim||0)+dt*4;
  if(u.type==='animal'){const L=u.leader;if(!L||L.dead){u.carav=false;u.wild=true;u.zone='desert';u.home={x:u.x-300,y:u.y-200,w:600,h:400};return false;}
    if(dist(u,L)>36){moveTo(u,L.x,L.y,dist(u,L)>90?90:48,dt);}u.face=L.x>u.x?1:-1;return true;}
  const dd=dist(u,D);if(dd<200&&!G.over){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,75,dt);if(!u.yelp||G.t-u.yelp>6){u.yelp=G.t;float(u.x,u.y-30,['Dragon! Save the camels!','By the dunes, run!'][RI(0,1)],'#ffe0a0');}return true;}
  const t=u.route[u.ri];if(moveTo(u,t.x,t.y,40,dt)||dist(u,t)<20)u.ri=(u.ri+1)%u.route.length;return true;}
// ---------- desert upkeep: worm respawn, vultures, caravans, hotter hunger ----------
function updDesert(dt){G.desT=(G.desT||0)-dt;if(G.desT>0)return;G.desT=3;
  if(!units.some(u=>u.species==='sandworm'&&!u.dead)){G.wormT=(G.wormT===undefined?0:G.wormT)+3;if(G.wormT>=(G.wormFirst?150:0)){G.wormT=0;G.wormFirst=1;spawnWorm();}}
  if(birds.filter(b=>b.kind==='vulture'&&!b.dead).length<7)spawnVulture();
  if(units.filter(u=>u.carav&&u.type==='villager'&&!u.dead).length<2)spawnCaravan();}
function desertHunger(){return !G.easy&&regionKey(D.x,D.y)==='desert'?1.35:1;}
