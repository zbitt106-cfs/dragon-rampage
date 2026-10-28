// ======================= NORTHERN GOAT HERDS: extra mountain-goat herds (and the mountain lions that hunt them) on the snowy slopes north of the desert =======================
// Wild animals: eating them never raises the alarm (isWild), they count in the Dragon's Tally, and they respawn slowly.
const GH={centers:[[-8500,-950],[-6700,-1350],[-4900,-850]],goats:[4,6],lions:2,goatEvery:22,lionEvery:60};
let GH_HERDS=[];
function ghStructNear(x,y){for(const s of structures)if(d2(x,y,s.x,s.y)<110)return true;return false;}
ZONES.dnpeaks={ok:(x,y)=>y<frostY(x)-120&&y>WY0+450&&x>WX0+350&&x<RANGE0-60&&!inSea(x,y)&&!inLake(x,y)&&(typeof riverD!=='function'||riverD(x,y)>RIVW+30)&&!ghStructNear(x,y),
  s:()=>({x:R(WX0+500,RANGE0-200),y:R(WY0+550,-450)})};
function ghPoint(h,r,far){for(let t=0;t<60;t++){const a=R(0,TAU),q=R(0,r),x=h.x+Math.cos(a)*q,y=h.y+Math.sin(a)*q*.7;if(ZONES.dnpeaks.ok(x,y)&&(!far||d2(x,y,D.x,D.y)>800))return{x,y};}return null;}
function ghSpawn(h,sp){const far=G&&G.t>1,p=ghPoint(h,sp==='cougar'?420:220,far);if(!p)return null;const F=FAUNA[sp],big=sp==='cougar',hw=big?1300:900,hh=big?900:620;
  const u=mkUnit('animal',p.x,p.y,{species:sp,wild:true,zone:'dnpeaks',herd:h.i,home:{x:h.x-hw/2,y:h.y-hh/2,w:hw,h:hh},hp:F.hp,maxHp:F.hp,free:true,pack:0,t:R(0,3),jt:0});units.push(u);return u;}
function initGoatHerds(){GH_HERDS=GH.centers.map(([cx,cy],i)=>{let c={x:cx,y:cy};for(let t=0;t<80&&!ZONES.dnpeaks.ok(c.x,c.y);t++)c={x:cx+R(-500,500),y:cy+R(-350,350)};
    return {i,x:c.x,y:c.y,want:preyN('ghgoat'+i,RI(GH.goats[0],GH.goats[1])),gT:GH.goatEvery,lT:GH.lionEvery};});
  for(const h of GH_HERDS){for(let k=0;k<h.want;k++)ghSpawn(h,'mgoat');for(let k=0;k<GH.lions;k++)ghSpawn(h,'cougar');}}
function ghCount(h,sp){return units.filter(u=>!u.dead&&u.herd===h.i&&u.species===sp).length;}
function updGoatHerds(dt){for(const h of GH_HERDS){
  if(ghCount(h,'mgoat')<h.want){h.gT-=dt;if(h.gT<=0){h.gT=GH.goatEvery;ghSpawn(h,'mgoat');}}else h.gT=GH.goatEvery;
  if(ghCount(h,'cougar')<GH.lions){h.lT-=dt;if(h.lT<=0){h.lT=GH.lionEvery;ghSpawn(h,'cougar');}}else h.lT=GH.lionEvery;}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);initGoatHerds();return r;};}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!G.over&&!paused)updGoatHerds(dt);return r;};}
// world map: herds and lions show up once that ground is explored
{const _dm=drawMap;drawMap=function(mmx,mmy,mmw,big){_dm.apply(this,arguments);const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s,q=big?3.2:2;
  for(const u of units){if(u.dead||u.herd===undefined||!seen(u.x,u.y))continue;ctx.fillStyle=u.species==='cougar'?'#e08a3a':'#f4f2ea';ctx.fillRect(X(u.x)-q/2,Y(u.y)-q/2,q,q);}
  if(big)for(const h of GH_HERDS)if(seen(h.x,h.y))txt('🐐 Goat herd',X(h.x),Y(h.y)-10,9,'#f0ece0','center',false);};}
// herd lions are not gluttons: after a catch they rest a while before stalking again, so the herds survive
{const _uc=updCougar;updCougar=function(u,dt,dd){if(u.herd===undefined)return _uc.apply(this,arguments);
  if(u.full>0&&(u.state==='prowl'||u.state==='stalk'||!u.state)&&!(D.alt<.4&&dd<FAUNA.cougar.aggro)){u.full-=dt;u.prey=null;u.state='prowl';return false;}
  const was=u.state,r=_uc.apply(this,arguments);if(u.state==='feed'&&was!=='feed')u.full=R(35,50);return r;};}
