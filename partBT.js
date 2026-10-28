// ======================= partBT: EVERY BITE HURTS =======================
// A bite that can't swallow its target (too big, an alpha or champion not yet worn down, the prince, bosses, bulls, wild dragons, a whale...)
// still deals bite damage, with a jaw-snap impact cue and a red "-N". Edible targets are eaten exactly as before.
// The bite never takes a tough target below 1 HP, so you wear it down and then swallow it. King William and Princess Elizabeth are untouchable.
const BT={dmg:18,cues:[],hits:0,last:null};
function btDmg(u){return Math.round(BT.dmg*(D.alt<.3?1:.8)*(G.lvl>1?1+.05*(G.lvl-1):1));}
function btSafe(u){return !u||u.dead||u.inside||u.princess||u.isPrincess||u.isKing||u.king;}
function btCue(u,n){const x=u.x,y=u.y-(u.type==='sea'?10:22);BT.cues.push({x,y,t:0,n});if(BT.cues.length>12)BT.cues.shift();
  if(n>0)float(x+30,y-4,`-${n}`,'#ff5a4a');G.shake=Math.max(G.shake||0,2.5);if(typeof SFX!=='undefined'&&SFX.chomp)SFX.chomp(1);}
{const _te=tryEat;tryEat=function(){
  if(!G||G.over||G.won||scene!=='play')return _te.apply(this,arguments);
  const T=biteTargets().filter(u=>!btSafe(u)),hp=new Map(T.map(u=>[u,u.hp])),pr=D.princess,gold=(G.stash||0)+(D.gold||0);
  const r=_te.apply(this,arguments);
  if(!T.length||D.princess!==pr||(G.stash||0)+(D.gold||0)!==gold)return r;   // nothing in the jaws, or it was a grab (princess / gold)
  if(T.some(u=>u.dead||u.eaten))return r;                                     // swallowed (or killed): eaten as before
  const u=T[0],h0=hp.get(u);if(btSafe(u))return r;
  if(!(h0-u.hp>0)){const d=Math.min(btDmg(u),Math.max(0,Math.ceil(u.hp)-1));if(d>0)hurtUnit(u,d,'bite');}
  const dealt=Math.max(0,Math.round(h0-(u.dead?0:u.hp)));BT.hits++;BT.last={sp:u.species||u.kind||u.type,dealt,hp:u.hp,max:u.maxHp};btCue(u,dealt);
  D.eatT=Math.max(D.eatT||0,.3);return r;};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);for(const c of BT.cues)c.t+=dt;BT.cues=BT.cues.filter(c=>c.t<.45);return r;};}
{const _gp=gfxPost;gfxPost=function(){const r=_gp.apply(this,arguments);
  for(const c of BT.cues){const k=c.t/.45,a=1-k,s=1+k*.6;ctx.save();ctx.globalAlpha=a;ctx.translate(c.x,c.y);ctx.scale(s,s);
    ctx.strokeStyle='#fff3c0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,16+k*10,0,TAU);ctx.stroke();
    ctx.fillStyle='#ffffff';const g=(1-Math.min(1,k*3))*7;   // two rows of teeth snapping shut
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*6-3,-9-g);ctx.lineTo(i*6+3,-9-g);ctx.lineTo(i*6,-2-g);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(i*6-3,9+g);ctx.lineTo(i*6+3,9+g);ctx.lineTo(i*6,2+g);ctx.closePath();ctx.fill();}
    ctx.restore();BT.drawn=(BT.drawn||0)+1;}return r;};}
