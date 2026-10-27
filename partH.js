// ================= partH: the GOLD HOARD in the lair grows with the gold you stash =================
// Stages: a few coins (<25) -> small pile (25+) -> big mound (80+) -> MOUNTAIN of treasure (200+) with goblets, crowns and gems.
// Size scales smoothly in between; the drawn size eases toward the real stash so drops visibly grow it.
const HOARD_ST=[{at:0,name:'A few coins'},{at:25,name:'Small pile'},{at:80,name:'Big mound'},{at:200,name:'Mountain of treasure'}];
let HCOINS=[],HOARD={shown:0,bump:0,clinkT:0};
function hoardStage(g){let s=0;for(let i=0;i<HOARD_ST.length;i++)if(g>=HOARD_ST[i].at)s=i;return s;}
function hoardK(g){return clamp(Math.pow(Math.max(0,g)/260,.55),0,1.35);} // 0..1 at 260 gold, grows a bit beyond
function hoardDims(g){const k=hoardK(g);return{k,rx:12+78*k,ry:6+34*k,h:3+54*k};}
const HX=()=>LAIR.x-10,HY=()=>LAIR.y+22;
// deterministic pseudo-random for stable layouts
const hr=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
function drawHoard(){const g=HOARD.shown,x=HX(),y=HY(),{k,rx,ry,h}=hoardDims(g),st=hoardStage(g),b=1+HOARD.bump*.08,t=G.t;
  if(g<.5&&!HCOINS.length){for(let i=0;i<4;i++)ell(x-20+i*13,y+4+(i%2)*4,6,3.5,i%2?'#e6a818':'#ffd84a');return;}
  ctx.save();ctx.translate(x,y);ctx.scale(b,b);
  ell(4,4,rx*1.1,ry*1.05,'rgba(0,0,0,.28)');
  // the mound: a dome of gold (cartoon shading) seen from above-front
  const top=-h;ctx.beginPath();ctx.moveTo(-rx,0);ctx.bezierCurveTo(-rx*.8,top*.75,-rx*.35,top,0,top);ctx.bezierCurveTo(rx*.35,top,rx*.8,top*.75,rx,0);ctx.ellipse(0,0,rx,ry,0,0,Math.PI,false);ctx.closePath();
  const gr=ctx.createLinearGradient(-rx,top,rx*.6,ry);gr.addColorStop(0,'#fff2a0');gr.addColorStop(.35,'#ffd23a');gr.addColorStop(.8,'#e09a12');gr.addColorStop(1,'#a86a0a');ctx.fillStyle=gr;ctx.fill();
  ctx.strokeStyle='#8a5408';ctx.lineWidth=2;ctx.stroke();
  // coins scattered over the surface and spilling round the base
  const nc=Math.round(8+70*Math.min(k,1.2));
  for(let i=0;i<nc;i++){const u=hr(i)*2-1,v=hr(i+50),px=u*rx*.92,surf=-h*(1-u*u)*.95,py=surf*(1-v*.15)+v*ry*.85;
    ell(px,py,5,3,i%3?'#ffd84a':'#f0b020');ctx.strokeStyle='rgba(140,90,10,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(px,py,5,3,0,0,TAU);ctx.stroke();}
  for(let i=0;i<Math.round(4+18*k);i++){const a=hr(i+90)*Math.PI,d=1+hr(i+130)*.35;ell(Math.cos(a)*rx*d,Math.sin(a)*ry*d+2,5,3,i%2?'#ffd84a':'#e6a818');}
  // big mound: a treasure chest and coin stacks
  if(st>=2){const c=Math.min(1,(g-80)/40);ctx.globalAlpha=c;
    rect(rx*.45,-h*.35,30,18,'#7a4a1c');rect(rx*.45,-h*.35-9,30,9,'#9a6028');rect(rx*.45,-h*.35-1,30,3,'#e0b040');rect(rx*.45+13,-h*.35-3,4,6,'#ffe070');
    for(let s=0;s<3;s++)for(let j=0;j<4+s;j++)ell(-rx*.55+s*12,-h*.25-j*3.5,6,3,j%2?'#ffd84a':'#e6a818');ctx.globalAlpha=1;}
  // mountain of treasure: goblets, crowns and gems
  if(st>=3){const c=Math.min(1,(g-200)/50);ctx.globalAlpha=c;
    const gob=(px,py,col)=>{poly([px-6,py-14,px+6,py-14,px+3,py-6,px-3,py-6],col);rect(px-1,py-6,2,6,col);rect(px-5,py,10,2,col);ell(px,py-14,6,2,'#7a3a0a');};
    const crown=(px,py,s)=>{poly([px-9*s,py,px-9*s,py-9*s,px-5*s,py-4*s,px,py-11*s,px+5*s,py-4*s,px+9*s,py-9*s,px+9*s,py],'#ffcc22');ctx.strokeStyle='#8a5408';ctx.lineWidth=1.2;ctx.stroke();ell(px,py-5*s,2*s,2*s,'#e0204a');ell(px-6*s,py-3*s,1.5*s,1.5*s,'#2a7ae0');ell(px+6*s,py-3*s,1.5*s,1.5*s,'#20c060');};
    const gem=(px,py,col)=>{poly([px,py-6,px+5,py,px,py+5,px-5,py],col);poly([px,py-6,px+2,py-1,px-2,py-1],'rgba(255,255,255,.7)');};
    crown(0,-h-2,1.3);gob(-rx*.35,-h*.55,'#ffd040');gob(rx*.3,-h*.7,'#e8e8f0');crown(-rx*.62,-h*.12,1);
    const gc=['#e0204a','#2a7ae0','#20c060','#b040e0','#40e0e0'];for(let i=0;i<Math.round(6+10*Math.min(1,k));i++){const u=hr(i+300)*2-1;gem(u*rx*.8,-h*(1-u*u)*.8+hr(i+330)*ry*.6,gc[i%5]);}
    ctx.globalAlpha=1;}
  // sparkles (High graphics)
  if(GFX_HI){ctx.globalCompositeOperation='lighter';const ns=Math.round(3+14*k);
    for(let i=0;i<ns;i++){const ph=(t*.9+hr(i+500)*7)%2.2;if(ph>1)continue;const u=hr(i+520)*2-1,px=u*rx*.85,py=-h*(1-u*u)*.9+hr(i+540)*ry*.5,s=Math.sin(ph*Math.PI)*(4+3*k);
      ctx.strokeStyle=`rgba(255,255,220,${Math.sin(ph*Math.PI)})`;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(px-s,py);ctx.lineTo(px+s,py);ctx.moveTo(px,py-s);ctx.lineTo(px,py+s);ctx.stroke();ell(px,py,s*.35,s*.35,'rgba(255,255,200,.9)');}
    const gl=ctx.createRadialGradient(0,-h*.5,4,0,-h*.5,rx*1.3);gl.addColorStop(0,`rgba(255,210,80,${.12+.06*Math.sin(t*2)})`);gl.addColorStop(1,'rgba(255,200,60,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(0,-h*.5,rx*1.3,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='source-over';}
  else{ell(-rx*.2,-h*.7,3,2,`rgba(255,255,230,${.4+.4*Math.sin(t*3)})`);}
  ctx.restore();
  // flying coins from the drop-off
  for(const c of HCOINS){if(c.t<0)continue;const p=Math.min(1,c.t/c.dur),cx=c.x0+(c.x1-c.x0)*p,cy=c.y0+(c.y1-c.y0)*p-Math.sin(p*Math.PI)*c.arc-(1-p)*c.z0;
    const sq=Math.abs(Math.cos(c.t*14));ell(cx,cy,5,3.5*sq+.6,sq>.5?'#ffd84a':'#c88a10');}
  if(G.stash>0&&scene==='play'){const s=HOARD_ST[hoardStage(G.stash)].name;txt(`${s} · ${G.stash} gold`,x,y+ry+30,11,'#ffe8a0','center');}}
// coin-clink drop-off animation: coins arc from the dragon into the pile, clinking as they land
function hoardDrop(n,fx,fy){const m=Math.min(28,Math.max(4,n));const {rx,ry,h}=hoardDims(G.stash);
  for(let i=0;i<m;i++){const u=R(-.8,.8);HCOINS.push({t:-i*.045,dur:R(.45,.7),x0:fx+R(-20,20),y0:fy+R(-10,10),z0:heightOf()+20,x1:HX()+u*rx,y1:HY()-h*(1-u*u)*.8+R(0,ry*.4),arc:R(40,90),clink:false});}}
function updHoard(dt){if(!G)return;const target=G.stash;HOARD.shown+=(target-HOARD.shown)*Math.min(1,dt*1.6);if(Math.abs(target-HOARD.shown)<.3)HOARD.shown=target;
  HOARD.bump=Math.max(0,HOARD.bump-dt*3);HOARD.clinkT-=dt;
  for(const c of HCOINS){c.t+=dt;if(!c.clink&&c.t>=c.dur){c.clink=true;HOARD.bump=1;if(HOARD.clinkT<=0){HOARD.clinkT=.06;SFX.play('clink',c.x1,c.y1,.7);}if(GFX_HI&&rnd()<.5)sparkle(c.x1,c.y1,1);}}
  HCOINS=HCOINS.filter(c=>c.t<c.dur+.05);}
const _newGameH=newGame;newGame=function(opt){const r=_newGameH(opt);HCOINS=[];HOARD={shown:G?G.stash:0,bump:0,clinkT:0};return r;};
const _updPartsH=updParts;updParts=function(dt){_updPartsH(dt);updHoard(dt);};
// world map / minimap: a gold mound beside the lair that grows with the hoard
const _drawMapH=drawMap;drawMap=function(mmx,mmy,mmw,big){_drawMapH(mmx,mmy,mmw,big);if(!G||G.stash<=0)return;const s=mmw/(WX1-WX0),X=mmx+(LAIR.x-WX0)*s+(big?14:8),Y=mmy+(LAIR.y-WY0)*s+(big?4:3),k=hoardK(G.stash),r=(big?4:2.5)+(big?7:3.5)*k;
  ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.ellipse(X,Y,r,r*.6,0,Math.PI,0);ctx.lineTo(X+r,Y+1);ctx.lineTo(X-r,Y+1);ctx.fill();ctx.strokeStyle='#8a5408';ctx.lineWidth=1;ctx.stroke();
  if(GFX_HI&&Math.sin(Date.now()/300)>.3){ctx.fillStyle='#fff';ctx.fillRect(X-1,Y-r*.55-1,2,2);}
  if(big)txt(`Hoard ${G.stash}g`,X+r+4,Y+3,10,'#ffd84a','left',false);};
SFX_DEF.clink=(a,B,o,t)=>{const f=2400+Math.random()*1400;osc(a,o,t,'triangle',f,f*.98,.12,.28,.002);osc(a,o,t+.01,'sine',f*1.51,f*1.5,.09,.14,.002);return .15;};
