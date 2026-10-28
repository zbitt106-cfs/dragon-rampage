// ================= partLA: LAIR GUIDE ARROW =================
// A small gold arrow pinned to the screen edge that points home to the LAIR, with the distance. It hides
// while the lair is on screen. It glows and pulses bright gold while you carry Princess Elizabeth or loot.
// The hunter edge arrows stay small blue (knights) and green (archers) at the screen edges.
// It is drawn after every HUD layer and kept clear of the HUD panels (left column, top-right minimap) and the touch buttons.
const LA={last:null};
function laHide(){return scene!=='play'||!G||!D||G.over||G.won||paused||G.bigMap;}
function laDragonScreen(){const h=typeof heightOf==='function'?heightOf():0;return{x:(D.x-cam.x)*cam.z+VW/2,y:(D.y-h*.5-cam.y)*cam.z+VH/2};}
function laLairOnScreen(){const sx=(LAIR.x-cam.x)*cam.z+VW/2,sy=(LAIR.y-cam.y)*cam.z+VH/2,m=30;return sx>m&&sx<VW-m&&sy>m&&sy<VH-m;}
function laBlocked(x,y,pad){if(typeof UI!=='undefined')for(const r of [UI.col,UI.mm])if(r&&x>r.x-pad&&x<r.x+r.w+pad&&y>r.y-pad&&y<r.y+r.h+pad)return true;if(typeof TOUCH!=='undefined'&&TOUCH.on&&TOUCH.btns)for(const b of TOUCH.btns)if(Math.hypot(x-b.x,y-b.y)<b.r+pad)return true;return false;}
function laSpot(){const sm=VW<760,S=typeof SAFE!=='undefined'?SAFE:{l:0,r:0,t:0,b:0},M=sm?20:24;
  // pinned to the screen border in the lair's direction (from screen centre), small margin, clear of HUD + touch buttons
  const top=(TOUCH&&TOUCH.on?118:sm?96:140)+S.t+(typeof princeHudOn==='function'&&princeHudOn()?(sm?36:30):0),bot=VH-S.b-M-(TOUCH&&TOUCH.on?0:14),lft=S.l+M,rgt=VW-S.r-M;
  const lx0=(LAIR.x-cam.x)*cam.z+VW/2,ly0=(LAIR.y-cam.y)*cam.z+VH/2,cx=(lft+rgt)/2,cy=(top+bot)/2,dx=lx0-cx,dy=ly0-cy;let a=Math.atan2(dy,dx);
  const tx=dx>0?(rgt-cx)/dx:dx<0?(lft-cx)/dx:1e9,ty=dy>0?(bot-cy)/dy:dy<0?(top-cy)/dy:1e9,t=Math.min(tx,ty),side=tx<ty?'v':'h';
  let x=clamp(cx+dx*t,lft,rgt),y=clamp(cy+dy*t,top,bot);
  const ok=(x,y)=>!laBlocked(x,y,14);
  if(!ok(x,y)){let best=null;for(let k=1;k<60&&!best;k++)for(const sg of [1,-1]){const o=k*10*sg,nx=side==='v'?x:clamp(x+o,lft,rgt),ny=side==='v'?clamp(y+o,top,bot):y;if(ok(nx,ny)){best={x:nx,y:ny};break;}}
    if(!best)for(let k=1;k<60&&!best;k++){const nx=clamp(x-Math.cos(a)*k*8,lft,rgt),ny=clamp(y-Math.sin(a)*k*8,top,bot);if(ok(nx,ny))best={x:nx,y:ny};}
    if(best){x=best.x;y=best.y;}}
  {const na=Math.atan2(ly0-y,lx0-x);if(isFinite(na))a=na;}
  // distance readout sits just inside the arrow (toward screen centre)
  let lx=x-Math.cos(a)*30,ly=y-Math.sin(a)*16+4;lx=clamp(lx,lft+24,rgt-24);ly=clamp(ly,top+8,bot-2);
  if(laBlocked(lx,ly,10)){lx=clamp(x-Math.cos(a)*30,lft+24,rgt-24);ly=clamp(y+(y>VH/2?-16:16),top+8,bot-2);}
  return{x,y,a,lx,ly};}
function drawLairArrow(){LA.last=null;if(laHide()||laLairOnScreen())return;
  ctx.setTransform(DPR,0,0,DPR,0,0);const p=laSpot(),dist=Math.round(Math.hypot(LAIR.x-D.x,LAIR.y-D.y)/10),glow=!!D.princess,pl=.5+.5*Math.sin(G.t*6);
  LA.last={x:p.x,y:p.y,ang:p.a,dist,glow,lx:p.lx,ly:p.ly};
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);const k=glow?.68+.06*pl:.5;ctx.scale(k,k);
  if(glow){ctx.shadowColor='rgba(255,200,40,1)';ctx.shadowBlur=10+8*pl;}
  ctx.globalAlpha=glow?1:.8;poly([24,0,-10,-14,-3,0,-10,14],glow?'#ffd21e':'#d8b060');
  ctx.shadowBlur=0;ctx.lineWidth=2;ctx.strokeStyle=glow?'#fff6c0':'rgba(60,40,10,.8)';ctx.stroke();ctx.restore();ctx.globalAlpha=1;
  const lab=`LAIR ${dist} m`;txt(lab,p.lx,p.ly,glow?11:10,glow?'#fff0a0':'#ffe2a0','center');
  if(glow)txt('♛ take her home!',p.lx,p.ly+(p.ly>VH/2?-12:12),9,'#ffc0e0','center',false);}
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);drawLairArrow();};}
