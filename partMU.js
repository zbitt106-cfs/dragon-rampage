// ======================= region music: one procedural theme per region, ~2 s crossfades, boss override; lair hunger =======================
// Kingdom/farms cheerful (pastoral), castle regal (fanfare), forest mysterious, desert Arabian (existing 'desert' scale),
// savanna drums, jungle marimba + percussion, Dragon Peaks / mountains epic low horns, ocean airy, lair dark rumble.
const MU={fade:2,themes:{farm:'pastoral',south:'pastoral',lake:'pastoral',hills:'pastoral',castle:'fanfare',forest:'forest',desert:'desert',
  savanna:'savanna',jungle:'jungle',mountain:'peaks',drpeaks:'peaks',sea:'ocean',deep:'ocean',coast:'ocean',isle:'ocean',lair:'lair',eastwood:'forest',crags:'pastoral',march:'pastoral'},hitT:-99};
Object.assign(MOODS,{
  forest:{bpm:70,root:57,scale:[0,2,3,5,7,9,10],prog:[0,6,5,6,0,3,4,0],lead:'flute',bass:'harp',arp:true,drum:0,beats:4,dens:.35,vol:.85},
  savanna:{bpm:108,root:55,scale:[0,2,4,7,9,12,14],prog:[0,0,3,3,4,4,0,0],lead:'recorder',bass:'drone',arp:false,drum:5,beats:4,dens:.3,vol:.8},
  jungle:{bpm:116,root:60,scale:[0,2,4,7,9,12,14],prog:[0,5,3,4,0,5,4,0],lead:'marimba',bass:'marimba',arp:true,drum:6,beats:4,dens:.55,vol:.8},
  peaks:{bpm:64,root:43,scale:[0,2,3,5,7,8,10],prog:[0,5,6,0,3,6,4,0],lead:'horn',bass:'drone',arp:false,drum:3,beats:4,dens:.3,low:true,vol:.9},
  ocean:{bpm:60,root:62,scale:[0,2,4,7,9,11,14],prog:[0,4,5,3,0,4,3,4],lead:'pad',bass:'harp',arp:true,drum:0,beats:4,dens:.22,vol:.75},
  lair:{bpm:54,root:38,scale:[0,1,3,5,6,8,10],prog:[0,0,1,0,6,0,1,0],lead:'deep',bass:'drone',arp:false,drum:7,beats:4,dens:.12,vol:.85},
  boss:{bpm:150,root:50,scale:[0,1,3,5,7,8,10],prog:[0,1,0,6,0,1,5,4],lead:'horn',bass:'drone',arp:false,drum:2,beats:4,dens:.8,vol:.9}});
// extra instruments / drums (fall through to the originals for everything else)
{const _in=inst;inst=function(B,dest,kind,t,m,dur,v){
  if(kind==='marimba'){AUD.notes=(AUD.notes||0)+1;const a=B.a,f=NOTE(m),g=a.createGain(),o=a.createOscillator(),o2=a.createOscillator(),h=a.createGain();g.connect(dest);
    o.type='sine';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*4;h.gain.value=.25;o.connect(g);o2.connect(h);h.connect(g);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32*v,t+.004);g.gain.exponentialRampToValueAtTime(1e-4,t+.45);o.start(t);o2.start(t);o.stop(t+.5);o2.stop(t+.5);return;}
  if(kind==='pad'){AUD.notes=(AUD.notes||0)+1;const a=B.a,f=NOTE(m),g=a.createGain(),o=a.createOscillator(),o2=a.createOscillator(),fl=a.createBiquadFilter();g.connect(dest);
    o.type='triangle';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f;o2.detune.value=9;fl.type='lowpass';fl.frequency.value=1600;o.connect(fl);o2.connect(fl);fl.connect(g);
    const s=a.createGain();s.gain.value=.7;g.connect(s);s.connect(B.echo);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*v,t+Math.min(.6,dur*.4));g.gain.setTargetAtTime(0,t+dur*.7,.4);o.start(t);o2.start(t);o.stop(t+dur+1.6);o2.stop(t+dur+1.6);return;}
  return _in.apply(this,arguments);};}
{const _dr=drum;drum=function(B,dest,kind,t,v){const a=B.a;
  if(kind==='djembe'){const g=a.createGain();g.connect(dest);const o=a.createOscillator();o.type='sine';o.frequency.setValueAtTime(230,t);o.frequency.exponentialRampToValueAtTime(110,t+.12);o.connect(g);
    g.gain.setValueAtTime(.42*v,t);g.gain.exponentialRampToValueAtTime(1e-4,t+.22);o.start(t);o.stop(t+.25);return _dr(B,dest,'tabor',t,v*.45);}
  if(kind==='shaker'){const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=B.noise;f.type='bandpass';f.frequency.value=5200;f.Q.value=1.2;s.connect(f);f.connect(g);g.connect(dest);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09*v,t+.02);g.gain.exponentialRampToValueAtTime(1e-4,t+.09);s.start(t,Math.random());s.stop(t+.12);return;}
  if(kind==='rumble'){const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=B.noise;f.type='lowpass';f.frequency.value=140;s.connect(f);f.connect(g);g.connect(dest);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55*v,t+.5);g.gain.linearRampToValueAtTime(0,t+1.45);s.start(t,Math.random()*.1);s.stop(t+1.5);return;}
  return _dr.apply(this,arguments);};}
// region moods use their own light scheduler (bass, sparse arpeggio, melody walk, a drum pattern); original moods unchanged
{const _sm=schedMood;schedMood=function(name,c,ahead){const M=MOODS[name];if(!M||M.dens==null)return _sm.apply(this,arguments);
  const B=ABUS,spb=60/M.bpm/2,dst=c.g;
  while(c.next<ahead){const t=c.next,st=c.step,bar=Math.floor(st/(M.beats*2)),pos=st%(M.beats*2),deg=M.prog[bar%M.prog.length],sc=M.scale,N=k=>M.root+sc[((k%7)+7)%7]+12*Math.floor(k/7);
    if(pos===0)inst(B,dst,M.bass,t,N(deg)-12,spb*M.beats*2*(M.bass==='drone'?1:.5),.85);
    if(M.arp&&pos%2===1)inst(B,dst,M.bass==='harp'?'harp':M.bass,t,N(deg+[0,2,4,7][(pos>>1)%4])+(M.bass==='marimba'?12:0),spb*2,.4);
    if(M.low&&pos===0&&bar%2===0)inst(B,dst,'horn',t,N(deg)+(bar%4?7:0),spb*7,.8);// epic low horn calls
    if((pos%2===0||name==='jungle'||name==='boss')&&Math.random()<M.dens){c.mel+=[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)];if(pos===0)c.mel=deg+[0,2,4][Math.floor(Math.random()*3)]+7;
      c.mel=clamp(c.mel,deg+3,deg+12);const len=M.lead==='pad'||M.lead==='deep'?spb*6:M.lead==='marimba'?spb:spb*(Math.random()<.3?2:1.5);
      inst(B,dst,M.lead,t,N(c.mel)-(M.low||name==='lair'?12:0),len,.7);}
    if(M.drum===5){if(pos===0||pos===3||pos===6)drum(B,dst,'djembe',t,pos===0?.9:.6);if(pos===4)drum(B,dst,'kick',t,.7);if(pos%2===1&&Math.random()<.5)drum(B,dst,'djembe',t,.3);}
    if(M.drum===6){drum(B,dst,'shaker',t,pos%2?.5:.8);if(pos===0||pos===5)drum(B,dst,'djembe',t,.55);if(pos===3||pos===7)drum(B,dst,'tabor',t,.35);}
    if(M.drum===7){if(pos===0&&bar%2===0)drum(B,dst,'rumble',t,.9);if(pos===4&&bar%4===2)drum(B,dst,'timp',t,.5);}
    if(M.drum===2){if(pos%4===0)drum(B,dst,'kick',t,.9);if(pos%2===1)drum(B,dst,'tabor',t,.5);if(pos===6||pos===7)drum(B,dst,'tabor',t,.8);drum(B,dst,'hat',t,.6);}
    if(M.drum===3){if(pos===0||pos===4)drum(B,dst,'timp',t,.7);if(pos===6)drum(B,dst,'tabor',t,.5);}
    c.next+=spb;c.step++;}};}
// boss / battle / region choice
function muBoss(){if(scene!=='play'||G.over)return false;
  const pc=typeof PRN!=='undefined'&&PRN.cur;if(pc&&pc.boss&&!pc.boss.dead&&!pc.done&&d2(pc.boss.x,pc.boss.y,D.x,D.y)<1100)return true;
  for(const u of units){if(u.dead)continue;if(u.species==='sandworm'&&u.ws!=='under'&&d2(u.x,u.y,D.x,D.y)<900)return true;if(u.isBoss&&d2(u.x,u.y,D.x,D.y)<1100)return true;}
  return false;}
function muTheme(x,y){return MU.themes[regionKey(x,y)]||'pastoral';}
pickMood=function(){if(scene==='title')return'fanfare';if(G.over)return'night';
  if(muBoss())return'boss';
  for(const u of units)if(u.kind==='squid'&&!u.dead&&u.sub<.6&&d2(u.x,u.y,D.x,D.y)<800)return'squid';
  if(G.t-MU.hitT<8){let foes=0;for(const u of units)if(!u.dead&&(u.type==='knight'||u.type==='archer'||u.militia)&&Math.abs(u.x-D.x)<650&&Math.abs(u.y-D.y)<500)foes++;
    if(foes>=3||siege.some(g=>!g.dead&&d2(g.x,g.y,D.x,D.y)<700))return'battle';}
  let m=muTheme(D.x,D.y);if(m==='pastoral'&&d2(D.x,D.y,GATE.x,GATE.y)<700)m='fanfare';
  if(m==='pastoral'&&GFX_HI&&typeof nightAmt==='function'&&nightAmt()>.55)return'night';
  return m;};
{const _hd=hurtDragon;hurtDragon=function(){MU.hitT=G.t;return _hd.apply(this,arguments);};}
// same as before but a ~2 s crossfade, per-theme volume, and only live/fading channels are scheduled (cheap)
musicTick=function(dt){const B=abus();if(!B)return;AUD.evalT-=dt;
  if(AUD.evalT<=0){AUD.evalT=.5;const w=pickMood();if(w===AUD.want)AUD.wantN++;else{AUD.want=w;AUD.wantN=1;}
    if(w!==AUD.mood&&(AUD.wantN>=2||!AUD.mood||w==='squid'||w==='boss'||scene==='title')){const now=B.a.currentTime,F=MU.fade;
      if(AUD.mood){const o=B.moods[AUD.mood];o.on=false;o.g.gain.cancelScheduledValues(now);o.g.gain.setValueAtTime(o.g.gain.value,now);o.g.gain.linearRampToValueAtTime(0,now+F);o.off=now+F+.1;}
      AUD.mood=w;AUD.switches=(AUD.switches||0)+1;const c=moodChan(w),vol=(MOODS[w]&&MOODS[w].vol)||.9;c.on=true;c.off=0;c.next=Math.max(c.next,now+.05);c.g.gain.cancelScheduledValues(now);c.g.gain.setValueAtTime(c.g.gain.value,now);c.g.gain.linearRampToValueAtTime(vol,now+F);}}
  if(AUD.muted||AUD.music<=0)return;const now=B.a.currentTime,ahead=now+.35;let live=0;
  for(const n in B.moods){const c=B.moods[n];if(c.on||(c.off&&now<c.off)){live++;if(c.next<now-.5)c.next=now+.05;schedMood(n,c,ahead);}}AUD.live=live;};
// iPhone/iPad: resume + play a silent buffer inside the first touch so WebAudio unlocks
function muUnlock(){const a=audio();if(!a)return;try{const b=a.createBuffer(1,1,22050),s=a.createBufferSource();s.buffer=b;s.connect(a.destination);s.start(0);}catch(e){}
  if(a.state==='running'){MU.unlocked=true;for(const e of['touchstart','touchend','click','keydown'])removeEventListener(e,muUnlock,true);}}
for(const e of['touchstart','touchend','click','keydown'])addEventListener(e,muUnlock,true);
// ---------- hunger drains at ~40% while resting in the lair ----------
const LAIR_HUNGER=.4;
{const _dh=desertHunger;desertHunger=function(){if(!G.easy&&regionKey(D.x,D.y)==='lair')return LAIR_HUNGER;return _dh();};}
