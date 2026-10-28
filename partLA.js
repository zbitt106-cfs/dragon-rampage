// ================= partLA: LAIR GUIDE ARROW =================
// A gold arrow that circles the dragon and points home to the LAIR, with the distance. It hides
// while the lair is on screen. It glows and pulses bright gold while you carry Princess Elizabeth or loot.
// The hunter edge arrows stay small blue (knights) and green (archers) at the screen edges.
// It is drawn after every HUD layer and kept clear of the HUD panels and the touch buttons.
const LA={last:null};
function laHide(){return scene!=='play'||!G||!D||G.over||G.won||paused||G.bigMap;}
function laDragonScreen(){const h=typeof heightOf==='function'?heightOf():0;return{x:(D.x-cam.x)*cam.z+VW/2,y:(D.y-h*.5-cam.y)*cam.z+VH/2};}
function laLairOnScreen(){const sx=(LAIR.x-cam.x)*cam.z+VW/2,sy=(LAIR.y-cam.y)*cam.z+VH/2,m=30;return sx>m&&sx<VW-m&&sy>m&&sy<VH-m;}
function laBlocked(x,y,pad){if(typeof TOUCH!=='undefined'&&TOUCH.on&&TOUCH.btns)for(const b of TOUCH.btns)if(Math.hypot(x-b.x,y-b.y)<b.r+pad)return true;return false;}
function laSpot(){const sm=VW<760,S=typeof SAFE!=='undefined'?SAFE:{l:0,r:0,t:0,b:0},d=laDragonScreen(),a=Math.atan2(LAIR.y-D.y,LAIR.x-D.x);
  const top=(TOUCH&&TOUCH.on?118:sm?96:140)+S.t+(typeof princeHudOn==='function'&&princeHudOn()?(sm?36:30):0),bot=VH-S.b-(TOUCH&&TOUCH.on?24:30),lft=S.l+44,rgt=VW-S.r-44;
  for(let r=Math.max(110,175*cam.z);r>=70;r-=6){const x=clamp(d.x+Math.cos(a)*r,lft,rgt),y=clamp(d.y+Math.sin(a)*r,top,bot),lx=x+Math.cos(a)*48,ly=y+Math.sin(a)*40;
    if(!laBlocked(x,y,26)&&!laBlocked(lx,ly,30))return{x,y,a,lx:clamp(lx,lft+10,rgt-10),ly:clamp(ly+4,top+10,bot)};}
  const x=clamp(d.x+Math.cos(a)*56,lft,rgt),y=clamp(d.y+Math.sin(a)*56,top,bot);return{x,y,a,lx:x,ly:y-26};}
function drawLairArrow(){LA.last=null;if(laHide()||laLairOnScreen())return;
  ctx.setTransform(DPR,0,0,DPR,0,0);const p=laSpot(),dist=Math.round(Math.hypot(LAIR.x-D.x,LAIR.y-D.y)/10),glow=!!(D.princess||D.gold>0),pl=.5+.5*Math.sin(G.t*6);
  LA.last={x:p.x,y:p.y,ang:p.a,dist,glow,lx:p.lx,ly:p.ly};
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);const k=glow?1.35+.12*pl:1;ctx.scale(k,k);
  if(glow){ctx.shadowColor='rgba(255,200,40,1)';ctx.shadowBlur=16+14*pl;}
  ctx.globalAlpha=glow?1:.8;poly([24,0,-10,-14,-3,0,-10,14],glow?'#ffd21e':'#d8b060');
  ctx.shadowBlur=0;ctx.lineWidth=2;ctx.strokeStyle=glow?'#fff6c0':'rgba(60,40,10,.8)';ctx.stroke();ctx.restore();ctx.globalAlpha=1;
  const lab=`LAIR ${dist} m`;txt(lab,p.lx,p.ly+(glow&&Math.sin(p.a)<-.3?4:0),glow?14:12,glow?'#fff0a0':'#ffe2a0','center');
  if(glow)txt(D.princess?'♛ take her home!':`💰 ${D.gold} gold`,p.lx,p.ly+(Math.sin(p.a)<-.3?-15:15),11,D.princess?'#ffc0e0':'#ffd84a','center',false);}
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);drawLairArrow();};}
