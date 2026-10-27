// ======================= procedural medieval music + layered positional SFX (WebAudio) =======================
const AUD={music:.55,sfx:.8,muted:false,mood:null,want:null,wantN:0,evalT:0,voices:[],last:{},cap:14};
try{const s=JSON.parse(localStorage.getItem('dr_audio')||'null');if(s){AUD.music=+s.music;AUD.sfx=+s.sfx;AUD.muted=!!s.muted;if(!(AUD.music>=0))AUD.music=.55;if(!(AUD.sfx>=0))AUD.sfx=.8;}}catch(e){}
function audSave(){try{localStorage.setItem('dr_audio',JSON.stringify({music:AUD.music,sfx:AUD.sfx,muted:AUD.muted}));}catch(e){}}
let ABUS=null;
function abus(){const a=AC;if(!a)return null;if(ABUS&&ABUS.a===a)return ABUS;
  const master=a.createGain(),music=a.createGain(),sfx=a.createGain(),comp=a.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
  music.connect(master);sfx.connect(master);master.connect(comp);comp.connect(a.destination);
  // shared echo for harps / eerie moods
  const dl=a.createDelay(1),fb=a.createGain(),wet=a.createGain();dl.delayTime.value=.38;fb.gain.value=.38;wet.gain.value=.5;dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(music);
  const nb=a.createBuffer(1,a.sampleRate*1.5,a.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  ABUS={a,master,music,sfx,echo:dl,noise:nb,moods:{}};audApply();return ABUS;}
function audApply(){if(!ABUS)return;const t=ABUS.a.currentTime;ABUS.master.gain.setTargetAtTime(AUD.muted?0:1,t,.05);ABUS.music.gain.setTargetAtTime(AUD.music*1.2,t,.1);ABUS.sfx.gain.setTargetAtTime(AUD.sfx,t,.05);}
function audOut(kind){const B=abus();return B?(kind==='music'?B.music:B.sfx):null;}
function toggleMute(){AUD.muted=!AUD.muted;audSave();audApply();if(typeof showToast==='function')showToast(AUD.muted?'🔇 Sound muted (N to unmute)':'🔊 Sound on (N to mute)');}
function setVol(kind,v){AUD[kind]=Math.round(clamp(v,0,1)*10)/10;audSave();audApply();}
// ---------- music ----------
const NOTE=m=>440*Math.pow(2,(m-69)/12);
const MOODS={
  pastoral:{bpm:96,root:62,scale:[0,2,4,5,7,9,10],prog:[0,3,4,0,5,3,4,0],lead:'recorder',bass:'lute',arp:true,drum:0,beats:4},
  battle:{bpm:138,root:57,scale:[0,2,3,5,7,8,10],prog:[0,5,6,4,0,5,3,4],lead:'horn',bass:'drone',arp:false,drum:2,beats:4},
  shanty:{bpm:112,root:62,scale:[0,2,3,5,7,9,10],prog:[0,0,6,6,0,0,4,0],lead:'squeeze',bass:'lute',arp:false,drum:1,beats:6},
  squid:{bpm:52,root:45,scale:[0,1,3,6,7,8,11],prog:[0,1,0,6],lead:'glass',bass:'deep',arp:false,drum:0,beats:4},
  fanfare:{bpm:104,root:60,scale:[0,2,4,5,7,9,11],prog:[0,4,0,3,4,0,3,4],lead:'trumpet',bass:'lute',arp:false,drum:3,beats:4},
  night:{bpm:66,root:57,scale:[0,2,3,5,7,9,10],prog:[0,3,0,4,5,3,6,0],lead:'flute',bass:'harp',arp:true,drum:0,beats:4},
  desert:{bpm:88,root:62,scale:[0,1,4,5,7,8,10],prog:[0,0,1,0,6,1,0,0],lead:'oud',bass:'drone',arp:false,drum:4,beats:4}};
function inst(B,dest,kind,t,m,dur,v){AUD.notes=(AUD.notes||0)+1;const a=B.a,f=NOTE(m);const g=a.createGain();g.connect(dest);const o=a.createOscillator();o.frequency.setValueAtTime(f,t);let o2=null,flt=null;
  const env=(at,peak,rel)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak*v,t+at);g.gain.setTargetAtTime(0,t+Math.max(at,dur-rel),rel/3);};
  switch(kind){
    case'lute':case'harp':o.type='triangle';flt=a.createBiquadFilter();flt.type='lowpass';flt.frequency.setValueAtTime(kind==='harp'?2600:3200,t);flt.frequency.exponentialRampToValueAtTime(500,t+.5);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32*v,t+.006);g.gain.exponentialRampToValueAtTime(.001*v+1e-5,t+(kind==='harp'?1.6:.8));if(kind==='harp'){const s=a.createGain();s.gain.value=.5;g.connect(s);s.connect(B.echo);}break;
    case'recorder':case'flute':o.type='sine';o2=a.createOscillator();o2.frequency.value=f;o2.type='triangle';{const vib=a.createOscillator(),vg=a.createGain();vib.frequency.value=5.2;vg.gain.value=f*.006;vib.connect(vg);vg.connect(o.frequency);vg.connect(o2.frequency);vib.start(t);vib.stop(t+dur+.3);}
      env(.05,kind==='flute'?.18:.22,.12);if(kind==='flute'){const s=a.createGain();s.gain.value=.4;g.connect(s);s.connect(B.echo);}break;
    case'horn':case'trumpet':o.type='sawtooth';o2=a.createOscillator();o2.frequency.value=f;o2.type='sawtooth';o2.detune.value=7;flt=a.createBiquadFilter();flt.type='lowpass';flt.frequency.setValueAtTime(400,t);flt.frequency.linearRampToValueAtTime(kind==='trumpet'?2200:1300,t+.08);flt.frequency.setTargetAtTime(900,t+.1,.2);
      env(.04,.13,.1);break;
    case'squeeze':o.type='square';o2=a.createOscillator();o2.frequency.value=f;o2.type='sawtooth';o2.detune.value=12;flt=a.createBiquadFilter();flt.type='lowpass';flt.frequency.value=1500;env(.03,.09,.06);break;
    case'oud':o.type='sawtooth';flt=a.createBiquadFilter();flt.type='bandpass';flt.Q.value=3;flt.frequency.value=f*2;o.frequency.setValueAtTime(f*.97,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.4*v,t+.005);g.gain.exponentialRampToValueAtTime(1e-4,t+.6);break;
    case'drone':o.type='sawtooth';o2=a.createOscillator();o2.frequency.value=f;o2.type='sawtooth';o2.frequency.value=f*1.5;flt=a.createBiquadFilter();flt.type='lowpass';flt.frequency.value=380;env(.25,.09,.4);break;
    case'deep':o.type='sine';o2=a.createOscillator();o2.frequency.value=f;o2.type='sine';o2.detune.value=-14;env(.8,.3,1.2);{const s=a.createGain();s.gain.value=.6;g.connect(s);s.connect(B.echo);}break;
    case'glass':o.type='sine';o2=a.createOscillator();o2.frequency.value=f;o2.type='sine';o2.frequency.value=f*2.76;o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*1.03,t+dur);env(.3,.07,.8);{const s=a.createGain();s.gain.value=.9;g.connect(s);s.connect(B.echo);}break;}
  if(flt){o.connect(flt);if(o2)o2.connect(flt);flt.connect(g);}else{o.connect(g);if(o2){const h=a.createGain();h.gain.value=.35;o2.connect(h);h.connect(g);}}
  o.start(t);o.stop(t+dur+1.8);if(o2){o2.start(t);o2.stop(t+dur+1.8);}}
function drum(B,dest,kind,t,v){const a=B.a,g=a.createGain();g.connect(dest);
  if(kind==='kick'||kind==='timp'){const o=a.createOscillator();o.type='sine';o.frequency.setValueAtTime(kind==='timp'?110:120,t);o.frequency.exponentialRampToValueAtTime(kind==='timp'?82:45,t+.18);o.connect(g);
    g.gain.setValueAtTime(.5*v,t);g.gain.exponentialRampToValueAtTime(1e-4,t+(kind==='timp'?.7:.3));o.start(t);o.stop(t+.8);return;}
  const s=a.createBufferSource();s.buffer=B.noise;const f=a.createBiquadFilter();f.type=kind==='tabor'?'bandpass':'highpass';f.frequency.value=kind==='tabor'?900:6000;f.Q.value=kind==='tabor'?1.5:.7;s.connect(f);f.connect(g);
  g.gain.setValueAtTime((kind==='tabor'?.35:.08)*v,t);g.gain.exponentialRampToValueAtTime(1e-4,t+(kind==='tabor'?.14:.05));s.start(t,Math.random());s.stop(t+.2);}
function moodChan(name){const B=ABUS;let c=B.moods[name];if(!c){const g=B.a.createGain();g.gain.value=0;g.connect(B.music);c=B.moods[name]={g,next:B.a.currentTime+.05,step:0,mel:4,on:false};}return c;}
function schedMood(name,c,ahead){const B=ABUS,M=MOODS[name],spb=60/M.bpm/2;// eighth notes
  while(c.next<ahead){const t=c.next,st=c.step,bar=Math.floor(st/(M.beats*2)),pos=st%(M.beats*2),deg=M.prog[bar%M.prog.length],sc=M.scale,N=k=>M.root+sc[((k%7)+7)%7]+12*Math.floor(k/7);
    const dst=c.g;
    if(pos===0)inst(B,dst,M.bass,t,N(deg)-12,spb*M.beats*2*(M.bass==='deep'||M.bass==='drone'?1:.5),.9);
    if(M.bass==='lute'&&pos===M.beats)inst(B,dst,'lute',t,N(deg+4)-12,spb*2,.6);
    if(M.arp&&pos%2===1)inst(B,dst,M.bass==='harp'?'harp':'lute',t,N(deg+[0,2,4,7][(pos>>1)%4]),spb*2,.45);
    if(M.beats===6&&(pos===2||pos===4||pos===8||pos===10))inst(B,dst,'lute',t,N(deg+2),spb,.4); // shanty oom-pah
    // melody: a seeded random walk around the chord tone, rests now and then
    const dens=name==='squid'?.18:name==='night'?.4:name==='battle'?.75:.6;
    if((pos%2===0||name==='battle'||name==='desert')&&Math.random()<dens){c.mel+=[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)];if(pos===0)c.mel=deg+[0,2,4][Math.floor(Math.random()*3)]+7;
      c.mel=clamp(c.mel,deg+3,deg+12);const len=name==='squid'?spb*8:name==='night'?spb*3:spb*(Math.random()<.3?2:1.5);inst(B,dst,M.lead,t,N(c.mel),len,name==='squid'?.8:.7);}
    if(name==='fanfare'&&bar%4===0&&pos===0)[0,4,7,12].forEach((k,i)=>inst(B,dst,'trumpet',t+i*spb*.5,M.root+12+k,spb*(i===3?3:.6),.8));
    if(name==='battle'&&bar%4===3&&pos===4)inst(B,dst,'horn',t,M.root+7,spb*4,.9);
    // percussion
    if(M.drum===1){if(pos%3===0)drum(B,dst,pos===0?'kick':'tabor',t,.7);}
    if(M.drum===2){if(pos%4===0)drum(B,dst,'kick',t,.9);if(pos%2===1)drum(B,dst,'tabor',t,.5);if(pos===6||pos===7)drum(B,dst,'tabor',t,.8);drum(B,dst,'hat',t,.6);}
    if(M.drum===3){if(pos===0||pos===4)drum(B,dst,'timp',t,.7);if(pos===6)drum(B,dst,'tabor',t,.5);}
    if(M.drum===4){if(pos===0||pos===3||pos===6)drum(B,dst,pos===0?'kick':'tabor',t,.6);}
    c.next+=spb*(name==='shanty'&&pos%2?0.92:1);c.step++;}}
function pickMood(){if(scene==='title')return'fanfare';if(G.over)return'night';
  for(const u of units)if(u.kind==='squid'&&!u.dead&&u.sub<.6&&d2(u.x,u.y,D.x,D.y)<800)return'squid';
  let foes=0;for(const u of units)if(!u.dead&&(u.type==='knight'||u.type==='archer'||u.militia)&&Math.abs(u.x-D.x)<650&&Math.abs(u.y-D.y)<500)foes++;
  if(foes>=3||siege.some(g=>!g.dead&&d2(g.x,g.y,D.x,D.y)<700))return'battle';
  const k=regionKey(D.x,D.y);if(k==='sea'||k==='deep'||k==='coast'||k==='isle')return'shanty';if(k==='desert')return'desert';
  if(GFX_HI&&typeof nightAmt==='function'&&nightAmt()>.55)return'night';
  if(k==='castle'||d2(D.x,D.y,GATE.x,GATE.y)<700)return'fanfare';return'pastoral';}
function musicTick(dt){const B=abus();if(!B)return;AUD.evalT-=dt;
  if(AUD.evalT<=0){AUD.evalT=.75;const w=pickMood();if(w===AUD.want)AUD.wantN++;else{AUD.want=w;AUD.wantN=1;}
    if(w!==AUD.mood&&(AUD.wantN>=2||!AUD.mood||w==='squid'||scene==='title')){const now=B.a.currentTime;
      if(AUD.mood){const o=B.moods[AUD.mood];o.on=false;o.g.gain.cancelScheduledValues(now);o.g.gain.setValueAtTime(o.g.gain.value,now);o.g.gain.linearRampToValueAtTime(0,now+2.5);o.off=now+2.6;}
      AUD.mood=w;const c=moodChan(w);c.on=true;c.off=0;c.next=Math.max(c.next,now+.05);c.g.gain.cancelScheduledValues(now);c.g.gain.setValueAtTime(c.g.gain.value,now);c.g.gain.linearRampToValueAtTime(1,now+2.5);}}
  if(AUD.muted||AUD.music<=0)return;const now=B.a.currentTime,ahead=now+.35;
  for(const n in B.moods){const c=B.moods[n];if(c.on||(c.off&&now<c.off)){if(c.next<now-.5)c.next=now+.05;schedMood(n,c,ahead);}}}
// ---------- SFX: layered, panned, distance-attenuated, voice-capped ----------
const SFX={count:0,dropped:0,
  play(name,x,y,vol){const B=abus();if(!B||AUD.muted||AUD.sfx<=0)return false;const a=B.a,now=a.currentTime;vol=vol==null?1:vol;
    let pan=0;if(x!=null&&typeof cam!=='undefined'){const hw=(VW/2)/(cam.z||1),dx=x-cam.x,dy=(y==null?cam.y:y)-cam.y,dd=Math.hypot(dx,dy*1.3);pan=clamp(dx/hw,-1,1)*.85;vol*=clamp(1.15-dd/1500,0,1);}
    if(vol<.03)return false;if(AUD.last[name]&&now-AUD.last[name]<.045)return false;
    AUD.voices=AUD.voices.filter(e=>e>now);if(AUD.voices.length>=AUD.cap){SFX.dropped++;return false;}
    const fn=SFX_DEF[name];if(!fn)return false;AUD.last[name]=now;const out=a.createGain();out.gain.value=vol;let p=null;
    if(a.createStereoPanner){p=a.createStereoPanner();p.pan.value=pan;out.connect(p);p.connect(B.sfx);}else out.connect(B.sfx);
    const len=fn(a,B,out,now)||.6;AUD.voices.push(now+len);SFX.count++;return true;},
  chomp(n){n=Math.max(1,n|0);for(let i=0;i<Math.min(n,4);i++)setTimeout(()=>SFX.play('chomp',D.x+R(-20,20),D.y,.9-i*.1),i*70);if(n>1)setTimeout(()=>SFX.play('gulp',D.x,D.y,.8),n*70+60);}};
function nz(a,B,out,t,len,type,f0,f1,q,v){const s=a.createBufferSource();s.buffer=B.noise;const f=a.createBiquadFilter();f.type=type;f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+len);
  const g=a.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(1e-4,t+len);s.connect(f);f.connect(g);g.connect(out);s.start(t,Math.random()*.5);s.stop(t+len+.05);}
function osc(a,out,t,type,f0,f1,len,v,at){const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+len);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(at||.005));g.gain.exponentialRampToValueAtTime(1e-4,t+len);o.connect(g);g.connect(out);o.start(t);o.stop(t+len+.05);return o;}
const SFX_DEF={
  splash:(a,B,o,t)=>{nz(a,B,o,t,.5,'bandpass',2200,300,.8,.7);nz(a,B,o,t+.05,.3,'highpass',3000,0,.5,.25);for(let i=0;i<3;i++)osc(a,o,t+.08+i*.07,'sine',700+Math.random()*500,1400,.06,.08);return .6;},
  growl:(a,B,o,t)=>{const g=a.createGain();g.connect(o);const s=osc(a,g,t,'sawtooth',95,70,.8,.4,.08);const l=a.createOscillator(),lg=a.createGain();l.frequency.value=28;lg.gain.value=.5;l.connect(lg);lg.connect(g.gain);l.start(t);l.stop(t+.9);nz(a,B,o,t,.7,'lowpass',600,200,1,.25);return .9;},
  crashStone:(a,B,o,t)=>{osc(a,o,t,'sine',90,35,.5,.8);nz(a,B,o,t,.9,'lowpass',1800,150,.7,.8);for(let i=0;i<6;i++)nz(a,B,o,t+.05+Math.random()*.4,.07,'bandpass',1500+Math.random()*2000,0,4,.35);return 1;},
  crashWood:(a,B,o,t)=>{osc(a,o,t,'triangle',180,60,.25,.4);nz(a,B,o,t,.5,'bandpass',900,300,1.2,.6);for(let i=0;i<7;i++)nz(a,B,o,t+Math.random()*.45,.04,'bandpass',2500+Math.random()*1500,0,6,.5);return .7;},
  coin:(a,B,o,t)=>{osc(a,o,t,'square',1318,0,.09,.12);osc(a,o,t+.07,'square',1760,0,.25,.12);osc(a,o,t+.07,'sine',3520,0,.25,.06);return .35;},
  whoosh:(a,B,o,t)=>{nz(a,B,o,t,.7,'bandpass',300,2400,2,.6);nz(a,B,o,t+.25,.5,'bandpass',2400,500,2,.4);return .8;},
  worm:(a,B,o,t)=>{osc(a,o,t,'sawtooth',55,30,1.6,.5,.2);osc(a,o,t,'sine',40,25,1.8,.7,.1);nz(a,B,o,t,1.6,'lowpass',500,80,1,.8);return 1.8;},
  chomp:(a,B,o,t)=>{nz(a,B,o,t,.09,'bandpass',1400+Math.random()*600,500,2,.9);osc(a,o,t,'sine',160,60,.12,.5);return .15;},
  gulp:(a,B,o,t)=>{osc(a,o,t,'sine',300,90,.22,.5,.02);return .25;},
  stomp:(a,B,o,t)=>{osc(a,o,t,'sine',70,28,.6,.9);nz(a,B,o,t,.6,'lowpass',900,100,.7,.6);return .7;},
  hurt:(a,B,o,t)=>{osc(a,o,t,'sawtooth',220,110,.25,.25);nz(a,B,o,t,.12,'bandpass',1800,0,2,.3);return .3;},
  roar:(a,B,o,t)=>{const s=osc(a,o,t,'sawtooth',160,70,1.2,.35,.1);nz(a,B,o,t,1.1,'bandpass',700,250,1.5,.5);return 1.2;},
  fire:(a,B,o,t)=>{nz(a,B,o,t,.32,'bandpass',600,900,.6,.45);for(let i=0;i<3;i++)nz(a,B,o,t+Math.random()*.25,.03,'highpass',3000,0,1,.35);return .3;},
  arrow:(a,B,o,t)=>{nz(a,B,o,t,.18,'bandpass',3500,1200,4,.3);return .2;},
  horn:(a,B,o,t)=>.1};
// gameplay hooks that don't already call SFX
let sfxFireT=0,sfxHurtT=0;
function sfxTick(dt){if(scene!=='play')return;sfxFireT-=dt;if(D.breath&&sfxFireT<=0){sfxFireT=.26;SFX.play('fire',D.x+Math.cos(D.ang)*90,D.y,.7);}}
{const _hd=hurtDragon;hurtDragon=function(d,src){const hp=D.hp;_hd(d,src);if(D.hp<hp&&G.t-sfxHurtT>.35&&d>=1.5){sfxHurtT=G.t;SFX.play('hurt',D.x,D.y,Math.min(1,.4+d/10));}};}
{const _ds=doStomp;doStomp=function(){SFX.play('stomp',D.x,D.y,1);return _ds.apply(this,arguments);};}
function volBar(v){const n=Math.round(v*10);return '▮'.repeat(n)+'▯'.repeat(10-n)+'  '+Math.round(v*100)+'%';}
