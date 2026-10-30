# Dragon's Rampage

A single-file browser game where you play a dragon. Open `index.html`; it needs no build step and no server.

## Building from source
The source is split into parts, which are concatenated in this order:
```
cat part1.html partD0.js partW.js partF.js part2.js part3.js part4.js part5.js part7.js partB.js partS.js partG.js partK.js partD.js partR.js partFL.js partT.js partA.js partV.js partH.js partRD.js partTR.js partM.js partP.js partY.js partWK.js partSV.js partSC.js partCS.js partHC.js partRN.js partFM.js partMH.js partGH.js partKM.js partPR.js partHN.js partSJ.js partKW.js partWD.js partMR.js partBL.js partOC.js partTF.js partPB.js partHU.js partNW.js partAL.js partWF.js partCR.js partRT.js partMU.js partLA.js partUI.js partGA.js partKB.js partJT.js partEC.js partRK.js partRC.js partGP.js partBT.js partKA.js part6.js > index.html
```
(`bash build.sh` does the same.)

- part1.html: page shell, canvas, game state, mobile/PWA meta tags and screen scaling
- partD0.js: the desert (Scorching Sands) layout, Sandhaven and the oasis
- partW.js: the world (regions, terrain, rivers/lake, roads, decor, fog of war)
- partF.js: regional wildlife, mounted knights, patrols
- part2–5.js: dragon, units, kingdom AI, siege engines and drawing
- part7.js: input and gamepad
- partB.js: bridges and river pathing
- partS.js: the sea (swimming, sea life, boats, pirates, the giant squid, the Lonely Lighthouse)
- partG.js: High graphics (shading, lighting, day and night)
- partK.js / partD.js / partR.js / partT.js: destruction and repair, crash dive stomp, desert life, roads, wells and town fountains, any-water bucket brigades, wanted tiers and militia
- partFL.js: wildflowers and village/castle gardens
- partA.js: procedural music and sound effects (Web Audio, no audio files)
- partV.js: the volcano (Mount Cinder) beside Dragon Peak and lava shots (short heavy lob, wide splash, cooling lava puddles)
- partH.js: the gold hoard in the lair (grows with your stash, coin-clink drop-offs, map marker)
- partRD.js: hoard raids (named champions with escorts march on the lair to steal gold)
- partTR.js: trophy banners of beaten champions, planted around the hoard
- partM.js: touch controls and mobile support
- partP.js: Princess Elizabeth inside the great keep, under its stone roof
- partY.js: the Dragon's Tally (bestiary) and the pause menu (P / Esc)
- partWK.js: worker respawn for rebuilt work buildings
- partSV.js: save / load (3 manual slots)
- partSC.js: supply carts and the Castle Storehouse
- partCS.js: claw scratch while swimming
- partHC.js: the hoard and trophies carry over between castle levels
- partFM.js: the FIRE meter
- partMH.js: max-health growth: monster feasts (kraken / sand worm +50) and Glutton food milestones (+5)
- partGH.js: northern mountain-goat herds and the mountain lions that hunt them
- partKM.js: the kingdom-wide militia (every villager arms up and guards their own post)
- partFB.js: workers fight back (farmers, lumberjacks and miners defend their worksite with their tools, then go back to work)
- partRN.js: the princess ransom King William pays after each level win
- partPR.js: prince boss armies that arrive by sea in royal war fleets (every 5th castle level); after landing the prince and his army hunt the dragon wherever it goes
- partHN.js: +5% prey, predators that hunt prey, and freshwater crocodiles
- partSJ.js: the world expansion west of the desert: the Golden Savanna and the Emerald Jungle
- partKW.js: King William, who stands in the castle courtyard and shouts orders
- partWD.js: the Dragon Peaks (a roost of smaller wild dragons in the far north-west mountains)
- partMR.js: meerkats, roadrunners and jackals (savanna and desert)
- partBL.js: bulls in the cow pens (they charge, and break out of damaged fences)
- partOC.js: ocean and beach creatures (morays, narwhals, stingrays, anglerfish, sea and pond turtles, penguins, the giant octopus, starfish and seashells)
- partTF.js: territorial pack leaders: the male lion (savanna prides) and the white alpha wolf (Deepwood packs)
- partPB.js: plant fire in every biome (acacias, savanna grass, jungle trees and ferns, cacti, desert scrub, palms, mountain pines, Dragon Peaks heather)
- partHU.js: three hunters per hunters' cabin
- partCB.js: the three hunters' cabins (Deepwood north, Deepwood south, the Eastwood), each with its own trio of hunters
- partNW.js: gorilla troops (a 92 HP silverback alpha with a silver back that chest-beats *THUMP THUMP* to call the troop, who drop what they're doing to defend it; 7.2-point blow with a small shove), giant river otters, dolphins, orcas, flying fish and marine iguanas; small wild dragons give +5 permanent max stamina
- partAL.js: alpha / turf leaders (male lion, white alpha wolf, silverback) shrug off the first bite; worn to ~80% HP (1-2 hits of bite, claw, stomp, fire or lava) they get dizzy stars and become edible. Their turf call **rallies** the alpha and every responder: +12% damage and +8% speed (responders also take 10% less damage; the alpha's wear-down is unchanged), shown by a soft orange glow and sparkles, fading 10 s after the dragon leaves or the alpha is eaten
- partWF.js: Dragon Peaks wild dragons are immune to your fire (lava, bites, claws and stomps still hurt); their weak fire is only for hunting goats, birds and mountain lions (never hurts you; small scorches only; mountain lions swipe back); a guarded 3-egg nest: eat an egg for +5 permanent max fire (kept across levels on the same life, reset on death/new game, saved), or smash it (stomp, claw, lava, full-belly bite) for no bonus; the guards attack when you come near. Eggs reset every castle level
- Birds: fire breath (on the ground or in the air) and lava splashes knock out sparrows, crows, ducks, gulls, hawks and eagles (feathers fly and they puff away). Bigger birds take a moment longer in the flames. Wyverns burn too; Dragon Peaks wild dragons stay fireproof.
- partCR.js: cruise speed: steady flight with no combat input ramps from 1x to 1.8x over ~5 s (keyboard, touch, gamepad); combat, landing, diving, a sharp turn or stopping resets it; normal stamina drain; wind streaks
- partRT.js: kingdom towers: wooden archer towers and (castle level 3+) stone scorpion ballista towers, built beside roads, villages and worker buildings from a big cart-delivered stockpile
- partMU.js: region music (a procedural theme per region, 2 s crossfades, boss override, iPhone first-tap audio unlock) and slower hunger at the lair
- partLA.js: the small gold lair guide arrow, pinned to the screen edge in the lair's direction (glows while you carry the princess)
- partKB.js: King William buys wood and stone by trade ship when the storehouse runs short
- partJT.js: the Ancient Jungle Temple (stone, fire-proof, +100 gold when wrecked) and Mount Ember, a second volcano in the far south-west jungle
- partEC.js: town economy (hidden building gold, taxes collected from it) and the tax collector's patrol escort
- partRK.js: hoard-raid tiers by hoard size, the stolen share per tier, and loaded raiders walking home slower with gold sacks
- partRC.js: the rich desert caravan (slower, 10 + 6 escort in formation), Sandhaven's desert soldiers and archers, and the town garrison
- partGP.js: caravan guards and road patrols chase predators off travellers (non-lethal), plus the worksite patrols at the lumber camps and the mines
- partES.js: the East March (map v2): a second lumber camp in the Eastwood and a second mine in the Iron Crags, with their own workers, yards, mine carts, supply carts, roads, guard squads and tower spots, and loading of saves made on the old, smaller map
- partBT.js: every bite hurts: targets too tough to swallow yet still take bite damage, with a jaw-snap impact cue and a red -N
- partKA.js: King William's golden armour: he suits up in the keep, fights as a mini-boss, retreats to the keep with Princess Elizabeth at low health, heals and returns; on his second wind he fights until knocked out dizzy (30 s), then leads a charge of his surviving nearby guards after the dragon unless it has reached the lair
- partGA.js: instant gold deposits: every coin you pick up flies straight into the lair hoard, with a coin '+N' pop by the HUD dragon icon
- partUI.js: the compact wood/stone stockpile icons plus the gold icons (castle + coin = the kingdom's gold, dragon + coin = your lair hoard) on the HUD and in the pause menu; the score shows only in the pause menu
- partNR.js: the Northern Realms (the map doubles north): the light realms (Hobbit Shire, Lumeria the Elven Realm, the Dwarf Holds) and the dark realms (Goblin Bogs, Orc Warlands, Cyclops Highlands), their unit rosters, the dark side's vanguards and 5-minute armies, magic turret towers, the Storm Wizard boss, the magic barrier, and the dragon eggs with their guardian dragons
- part6.js: main loop, HUD, minimap and world map, title screen

## Install as an app (PWA)
On iPhone, open the game in Safari, tap Share, then **Add to Home Screen**. It launches fullscreen with the dragon icon and turns with the phone (portrait or landscape).
- `manifest.json`: name, fullscreen display, any orientation, theme colours and icons
- `icons/`: apple-touch-icon (180), 192 and 512 icons, a maskable 512, and iOS splash images (`make_icons.py` regenerates them)

## Controls
| Action | Keyboard | Gamepad |
|---|---|---|
| Move | WASD / Arrows | Left stick |
| Breathe fire (hold) | Space | A / RT |
| Take off / land (landing from high up is a **dive slam**) | F | Y |
| Eat / grab gold or Princess Elizabeth (bites everyone close together); **drink lava** at the volcano | E | X |
| Stomp on the ground; **while flying = crash DIVE STOMP** | Q / Shift | B |
| World map | M | LB |
| Mute / unmute music and sound | N | — |
| Pause / restart | P or Esc / R | Start |

### Settings (title screen and pause menu)
Pick **⚙ Settings** on the title screen (Start · Mode · Settings · Load) or **⚙ Settings: volume · mute · graphics** in the pause (II / Esc) menu. The panel has:
- **Music volume** and **Sound effects volume** sliders (0–100%, 5% steps: drag or tap the bar, or ←/→ for 10%). The SFX slider plays a coin clink so you can hear the level. Moving a slider also un-mutes.
- **Mute all sound** toggle (N still works anywhere).
- **Graphics quality:** LOW (the simple flat look, fastest), MEDIUM (all the effects at a lower resolution, smoother on phones) or HIGH (shading, lighting, day and night, sharpest).
- **Back** (Esc / B also goes back).

Big touch targets, works in portrait, landscape and Flip 90°. Everything is saved on the device (`localStorage` keys `dr_audio`, `dr_gfxq`) and remembered after a reload.

**DIVE STOMP:** press stomp while flying to fold your wings and plummet. The shockwave smashes wooden buildings flat and cracks stone (2.4 s cooldown, costs 6 stamina). A normal stomp also damages wood.

### Touch (phones and tablets)
- Phones play in **both portrait and landscape**: just turn the phone, even mid-game, and the view, HUD and touch controls re-lay themselves out (no "rotate your phone" block). The title menu works either way: tap **Start game**, or anywhere in the "Tap down here to start" strip in portrait. After a rotation the game cross-checks the device orientation, because some big iPhones (Pro Max, iOS 26) briefly report the old screen size.
- **Flip screen 90°**: if your phone won't rotate the game (rotation lock, or a home-screen app that ignores turning), tap **FLIP** on the title screen or **⟳ Flip screen 90°** in the pause (II) menu. The whole game turns sideways, touch controls follow it, and it re-lays itself out immediately. Tap it again to turn it back. The choice is remembered.
- **Phone HUD**: there is no fire gauge on phones, because the FIRE button shows your fire (🔥 number, and an orange ring when it's full). A compact **🌋 Lava ×n** counter appears up top only while you have lava shots. Desktop keeps the full fire gauge.
- **Minimap** sits in the top-right corner on every screen. On phones it stays inside the safe area, clear of the notch/Dynamic Island and the rounded screen corners, in portrait, landscape and Flip mode.
- **No overlapping bars**: the WANTED panel, health panel, minimap and every bar that can appear (raid, prince, militia, gate warning, wizard, Hydra, Griffin, egg, region and announcement banners) stack in a lane between the health panel and the minimap. They never cross each other or the touch buttons, and long text shrinks to fit. This is checked automatically at 956x440, 932x430, 844x390 and 667x375 in landscape and in Flip 90° mode (an emulated browser, not real phones).
- The screen re-sizes after every rotation and toolbar change (iPhone Safari reports its new size late, so it re-measures a few times). The game loop keeps running even if one frame hits an error.
- **Left thumb:** touch anywhere on the left half and drag. The joystick appears under your thumb.
- **Right thumb:** **FIRE** (hold), **BITE**, **STOMP** (it reads DIVE while flying and does the crash dive stomp) and **FLY** (it reads LAND in the air). **MAP** and **II** (pause) sit on the left edge.
- On the title screen, tap a row to choose it. In **Settings**, drag or tap a slider and tap the mute / graphics buttons.
- The game keeps the HUD clear of the notch and home bar (safe areas), and draws on small screens at a larger logical size so everything fits. Sound unlocks on the first tap (iOS).
- The first visit on a touch device defaults to Low graphics (change it in Settings). It can be added to the home screen and runs full screen (PWA meta tags).

## The world
- The map is a large explorable kingdom (30,200 × 17,600 since the Northern Realms doubled it north) with 19 regions: Kingdom Farmlands, Castle Aldric (King William's castle), The Deepwood (with two hunters' cabins; a third stands in the Eastwood), Mirror Lake & the Silver River, Frostpeak Mountains, the hills and Stone Mine, the Southern Farmlands, the East March with the Eastwood and the Iron Crags (east, between Saltmere and the sea), the Sapphire Coast, Dragon's Roost (your lair, on the peak), the Scorching Sands desert (west), the Golden Savanna and the Emerald Jungle (far west, past the desert), the Dragon Peaks (far north-west) and, out east, three sea regions: The Sapphire Sea, The Lonely Lighthouse and The Kraken Deep.
- Entering a region shows its banner, and finding a new region is worth +100.
- Unexplored land is hidden under fog. The minimap shows explored terrain, structures, units, patrols (shield icons, red when engaged), siege engines, gold, Princess Elizabeth and your lair. M / LB opens a full world map with region and village names and the explored %.
- Goal: raid the castle for gold (it goes straight to your lair hoard) and fly Princess Elizabeth home (follow the gold arrow). The kingdom fights back with waves, the wanted meter, the hunter and bucket brigades, and it rebuilds.

## The Northern Realms (beyond the Frostpeak range)
The map doubles northward. A glowing **magic barrier** of crystal peaks runs along the Frostpeak range and blocks the way ("A magic barrier blocks the way — defeat the Wizard!") until you beat the **Storm Wizard**.
- **The Storm Wizard** stands on top of his tower on a small island in the north-east deep sea (around x 11500, y −1500) and never leaves it. The whole isle and his widest wind-gust ring sit **south of the magic wind wall** (the isle clears it by about 1100 px, the gust ring by about 370 px), so you can always fly in and fight him before he is beaten. He wakes when you come near and casts three spells: **ice spikes** (the hardest hitting; your fire melts them), **telegraphed lightning** (a warning mark first, then a strike about a second later, so you can dodge it) and a **wind gust** that knocks you back (the weakest). His shield is 300 at every castle level (he never scales; lower on easy). His health bar is a **magic shield** (see *Queue update* below). When the shield breaks he is beaten: the barrier opens for the dragon only (he gives **no gold**, see *No gold in the fantasy lands* below). He stays beaten for the rest of that castle level and **comes back at the next castle level** with his tower and a full shield (queue 140). The wall stays open for you while he's back, because the open barrier is your reward and you keep it until your dragon is defeated. Then it closes again and you have to beat him again.
- **Wizard spells hit twice as hard (item 126):** every Storm Wizard and Dark Wizard spell does double damage, the same at every castle level. Storm Wizard: ice spike **18** (was 9), lightning **12** (was 6), wind gust **2** (was 1). Dark Wizard: lava shot **26** (was 13), eruption **12** (was 6), purple lightning **16** (was 8).
- **The northern sea** above the Wizard's Isle is full of life: 3 narwhal pods (3-5 each), 2 orca pods, 3 dolphin pods, 3 whales and 5 fish schools (about 36 animals plus 35 schooling fish). They stay in open water well clear of the isle and the wizard's wind ring, appear only when you fly up into the north-east (so the rest of the map runs as before), and pods you eat come back a few seconds later out of sight.
- **Two bands of realms.** The light band in the south has the Hobbit Shire (west), **Lumeria, the Elven Realm** (centre: purple grass, glowing trees, unicorns, centaurs, satyrs) and the Dwarf Holds (east). The dark band in the north has the Goblin Bogs (west), the **Orc Warlands** (centre) and the Cyclops Highlands (east), with trolls, wyverns, giant scorpions and red-eyed spiders. All vegetation up north burns.
- **War.** The dark side raids south with small vanguards, and every 3 minutes it marches a big army to the border (announced only while you are in the north). The light side patrols its own lands and only ever defends. Army size grows with castle level: 16 + 4 per level, and since item 127 also **×1.1 per castle level** (compounding), up to **52 a side** (was 46). Levels 1–5: 16 → 16, 20 → **22**, 24 → **29**, 28 → **37**, 32 → **47** a side. From level 4 an alpha troll or centaur band may join too. The war pauses while King William is suiting up, charging or fighting.
- **Light units:** hobbit soldiers (small spearmen), armoured dwarves with a hammer or an axe (their plate nearly halves the damage they take), elves with a bow at range and a sword up close (they dodge-dash out of your fire with a short burst of invulnerability), and **elf unicorn riders**. A rider shows a glowing horn and a "!" (the telegraph), then makes a horn charge that knocks you back, then kites you and shoots arrows before charging again after a cooldown.
- **Dark units:** sword goblins and goblin archers, **orcs** with great swords or battle axes (tougher and slower than goblins), trolls and **cyclopes**. A cyclops raises its club in a clear wind-up with an arc warning, then makes a wide club sweep that knocks back the dragon and any units in the arc. It has very high HP. Toughness order: goblin < orc < troll / cyclops.
- The mix shifts with castle level: low levels are mostly hobbits and elves (or goblins); higher levels bring more dwarves, unicorn riders, orcs and cyclopes. The same units fill patrols, castle guards and the armies.
- **Magic turret towers.** There are 19 towers at the castles, along the border and at key villages: 10 elven **crystal towers** that shoot ice bolts (4 damage and a 1.3 s slow) and 9 orc **spiked storm towers** that charge up and zap lightning (5 damage; move away during the charge to dodge it). They shoot the dragon and enemy units but never their own side, and they stay quiet while the barrier is still sealed. Burn them or bite them ("Crunch the tower!") to turn them into rubble. 45 s later, if you are more than 500 away, a tower **magically rebuilds** with a sparkle.
- **Dragon eggs and the yin-yang guardians.** A **white egg** rests in the keep of **Lumenspire Citadel** (the light side's central castle) and a **black egg** in the keep of **Doomforge Citadel** (the dark side's central castle); see *Queue update* below. Grab an egg like the princess (E/X) and fly it to your lair to hatch a wingless, serpentine guardian dragon. The **white guardian** has black eyes and ice breath (chill, slow and a splash). The **black guardian** has white eyes and lightning breath (chains to nearby raiders). The two circle the outskirts of your lair on opposite sides, like yin and yang, and attack any knight, archer, hunter, militia, prince or raider that comes near. They never target King William or the princess. A guardian worn down to zero goes **dizzy** (it is not lost): after 4 s with no enemies near it shakes it off at 30% health, and every guardian heals to full in about 8 s once the fight is over. Guardians stay with you across castle levels and are saved with the game (older saves start with both eggs in their castles). They are lost, and both eggs go home, only when your dragon is defeated. See *Lair guardians* below.
- Everything stays cartoony: defeated creatures go dizzy and puff away.

## Queue update (Oct 2026)
- **Cerberus:** cartoony three-headed dogs roam the dark north (goblin and orc lands) in packs of 2–3. Each has a triple bite and a fast lunge, is fairly tough (90 hp) and hostile to the dragon. Once worn down it can be eaten (food 38). Cerberus also march in the dark armies and patrol Doomforge.
- **The giant squid** still spawns in the Kraken Deep, well clear of the Wizard's Isle.
- **Sand worm safe zones:** the worm only hunts a dragon that has **landed in open desert**. It gives a rumble-ripple warning first, then bursts up. Towns (within 750 px of a village, e.g. Sandhaven), the oasis (its pool plus 260 px) and **the desert road from Sandhaven to the king's castle** (within 140 px of it) are safe, and flying is always safe.
- **The worm comes for every landing:** land anywhere in open desert outside those safe zones and the worm tunnels in from wherever it is (it relocates under the sand about 280 px away), with a short **rumble… rumble** warning (about 1 s after landing), screen shake and ripples racing in, then bursts up about 2–2.5 s after you land. It stays up for only 2.5 s (was 4.5 s) before diving back under, unless it is dazed. Every landing, again and again, until you beat it (there is no more 150 s wait between worms).
- **Tougher worm:** the sand worm has **270 health** (was 150) at castle level 1.
- **Comes back each castle level:** defeat or eat the worm and *"🪱 Sand worm beaten! It comes back at the next castle level"*. It stays gone for the rest of that level (also through save/load) and returns at the start of the next castle level. Its win counter and achievements are kept.
- **Confined to the desert:** the worm never leaves the sand. Fly or walk off the desert (or into a safe zone) and a surfaced worm stops and sinks back down.
- **No treasury cap:** the gold hoard has no upper limit. The HUD shortens big numbers (9999, 12.3k, 120k, 2.5M, 1.2B).
- **Stone buildings:** when the kingdom has more than **100 stone**, it turns one wooden building into stone about **once per game minute**, spending stone each time. Stone buildings have grey walls and slate roofs, +60% health, take 50% of fire's wood damage (21 a second instead of 42) and 60% of the other damage, and **never catch fire or keep burning** (before: 40% of the fire damage, a 50% chance to catch fire, and then they burned on at 40%). They are saved. A rebuilt stone building stays stone if there is stone for it.
- **Wild dragons land:** Dragon Peaks dragons land to fight when you are on the ground near them, walking, clawing and breathing fire, and take off again when you fly or when they are hurt. Grounded dragons are hit by ground attacks, airborne ones by air attacks.
- **Mixed armies:** the big 5-minute armies, vanguards and patrols draw from all allied creatures. Light: elves, unicorn riders, dwarves, hobbit soldiers, centaurs, minotaurs, satyrs and unicorns. Dark: goblins, goblin archers, orcs, cyclopes, trolls, wyverns, giant spiders, giant scorpions and cerberus. Heavies are rarer. Drafted creatures fight the other side and the dragon.
- **The Hydra (dark far west, Temple of the Hydra around x −16300, y −9300):** a cartoony mini-boss that replaced Medusa. It always has 3 heads. Each head has its own health (85 at castle level 1, +15% a level, see *Mini bosses grow with the castle level*). Heads bite up close and spit goo blobs from range. A head you knock down leaves a stump that **regrows after about 6 s** at 60% health (at most twice per head) unless you **burn the stump with fire**. When every head is down, the Hydra is beaten: it curls up asleep in its pool, you get **+50 max health** (the health bar keeps its width), and it stays beaten for the rest of the castle level. **It comes back at the next castle level** (see *Mini bosses come back each castle level*). Once beaten, it can be gobbled up (+40 health, big food). Saving mid-fight keeps which heads are cut or burnt. Old saves where Medusa was beaten count the Hydra as beaten.
- **Medusa (regular dark unit, mostly the far west):** a normal snake-haired dark creature with a small health bar. She joins dark armies and roams the Goblin Bogs (sometimes the Orc Warlands). Her eyes glow for about 0.9 s before her stone gaze. If you face her when it fires, you turn grey and are slowed for 1.2 s, which never hurts you; look away to dodge it. She also gives small snake-hair nips. She is edible like the other realm creatures.
- **The Griffin (light lands):** a cartoony griffin mini-boss who slowly roams the elven, dwarf and hobbit lands. He switches between walking and flying and fights in both: claw swipes and pounces on the ground, talon dives from the sky. He attacks dark creatures that cross into his range (520), but he never heads off to join a big battle. He only fights one if he happens to wander into it. He is hostile to the dragon and has a boss bar. Defeating him gives **+50 max health** (the bar keeps its width). He stays beaten for the rest of the castle level and **comes back at the next castle level**, and you can gobble him up after the fight. His position and beaten state are saved.
- **Watchtowers vs the dragon:** bites now do 32 damage to a realm turret (was 15). Stomps do 45 (scaled with stomp power; before, they did nothing). Fire is unchanged. Against ordinary buildings, a stomp (96) already beats a bite (40–70).
- **Dizzy linger:** a creature beaten by fire, lava, stomps, claws or other non-bite attacks now stays dizzy (with stars) for about 1.3 s before it puffs away, and you can eat it in that window for its normal food. The princess, King William and the princes are unchanged.
- **Lava caves in burrows:** a lava shot or splash on a meerkat burrow (the game's underground animal homes) caves it in to a scorched crater. The meerkats hiding inside pop out and flee (still edible), and the colony digs it out again after 60–90 s. A hidden sand worm hit by lava is forced up, dazed.
- **Central citadels:** each side has one grand castle at the centre of its lands. **Lumenspire Citadel** (light, white and silver, with ice towers) is at about x −4400, y −4950, and **Doomforge Citadel** (dark, black iron, spikes and lava, with lightning towers) is at about x −4400, y −9100. Each has walls, a gate, corner towers, a keep holding its egg, a mixed garrison that musters when the egg is taken, patrols, and a rescue charge after the dragon carries the egg off. The big armies and the dark vanguards muster at and march from their citadel, and go back there afterwards. Old saves migrate the eggs to the citadels.
- **Egg in flight:** a carried egg is drawn in the dragon's claws while flying, with a soft white or dark glow, and the HUD shows a small egg icon.
- **Fixed-width bars:** every HUD bar (health, stamina, fire, lava, food, boss, ally and guardian bars) keeps a fixed width (the player's bars are 230 px), and only the fill changes. The numbers are shown as text. This was checked in portrait, landscape and Flip layouts.
- **Fairies (light lands):** small glowing fairies with a sparkle trail flutter around the elven glowing trees, sacred glades and hobbit flower beds. They flee, dart and dodge (a bite misses about a third of the time). A brave one may give a tiny pixie-dust sting (−1). You can gulp one (small snack, sparkle puff). Fire makes them go *poof*. A glade that loses fairies gets new ones after a while, when the dragon is away.
- **Vampire bats (dark lands):** cartoony purple bats with red eyes (no gore) swarm around goblin and orc caves, the cyclops cave, dark towers and burnt trees. They fly erratically and swoop in for a small nibble (−1), then a tiny red-sparkle heal for the bat. Edible, hurt by fire, and they come back over time. They don't join the dark armies.
- **Seagulls (seas and coasts):** small flocks circle over the southern sea, the northern sea on both sides of the wind wall, the shorelines, the dock, the lighthouse and passing trade and fishing ships (they follow the ship). Flocks land on the dock, the lighthouse rocks and beaches, and scatter with a squawk when the dragon comes close. Edible and hurt by fire. Only a few flocks exist at once, near the dragon, so performance stays within budget.
- **Mermaids (light side):** family-friendly mermaids all swim **north of the magic wind wall**, in the light fantasy ocean along the dwarf coast (none south of the wall any more; old saves move them north on load). Most dive away from the dragon. Brave ones defend with a splash or a trident poke (small damage), and they also poke dark creatures that come near the water. You can only bite or burn them while they're surfaced. There are no river or lake mermaids, because the purple and elven lands have no rivers or lakes and the elven realm has no coast.
- **Sunbathers on rocks and ice:** some mermaids lie back on sea rocks, the ice floes (11 of them, all north of the wall) and the dwarf-coast beaches, flicking their tails. When the dragon comes close they slide into the sea and dive.
- **Nessie, the Loch Ness Monster (mini boss):** a friendly-looking green plesiosaur with her own loch in the **southern part of the light fantasy ocean, north of the wind wall** (about x 9700, y −3500), clear of the Kraken Deep. Old saves that had her south of the wall move her there on load. Her loch is one soft gradient, a darker heart fading smoothly to open water with no rings or hard edges. Once beaten she naps there and can be gulped down in one big cartoony GULP (food 90, +60 HP), then she is gone for the rest of the castle level. She lurks, surfaces and dives, and attacks with a neck lunge, a tail slap and a wave splash. She has a fixed-width boss bar, and her health grows gently with the castle level (800, +15% a level). Beating her gives **+50 max health**. She **stays beaten for the rest of the castle level** (also through save/load) and **comes back at the next castle level**. Her health and beaten state are saved.
- **No movement-state row:** the health panel no longer has the flying / grounded / swimming row or the "F: take off / F: land" bar, on any device. The dragon's wings and the water show its state, and the FLY button, the F key and the controls help still cover taking off and landing. The panel now ends right under the last bar, and the CASTLE LV and resources panels move up to close the gap.
- **No griffin "· flying" label:** the Griffin's boss bar just shows its name and health now, because you can see it flying. The other boss bars never had a flying or ground label.
- **Dragon no longer hidden by set pieces:** when the dragon walks or lands near the Temple of the Hydra, the temple floor and pool are drawn under it, and the pillars, the Hydra, a grounded or dizzy Griffin, Nessie and dizzy units are depth-sorted with the dragon. Anything behind the dragon is drawn first, anything in front of it is drawn after. When flying, the dragon is always on top.
- **HUD title restored:** a line-break slip in the phone-landscape HUD update (item 45) had commented out the "THE DRAGON" title on the health panel. It's back.
- **Alpha trolls and centaurs:** 3 **troll caves** in the dark north, each home to a white alpha troll with 3–4 regular trolls, and 3 **sacred glades** in the light north, each home to a silver-and-gold alpha centaur with 3–4 regular centaurs. They follow the lion and white-wolf alpha rules: they defend the turf, the alpha's call rallies the band (+12% damage, +8% speed, 10% less damage taken, 10 s, orange glow), helpers refill about every 40 s, and a new alpha takes over about 75 s after one is beaten. An alpha can only be eaten once worn below 80%. Alphas hit **+20% harder**: alpha troll ×1.8 a troll's blow (was ×1.5), alpha centaur ×1.92 (was ×1.6), and the centaur charge 8.4 (was 7; easy 4.8, was 4). A few regular trolls and centaurs still roam freely. From level 4 an alpha may lead its band in the big armies and goes home afterwards.
- **Wizard's tower and magic shield:** while the wizard is alive, his tower is invulnerable. Every attack on the tower or on him (fire, lava, stomp, claw, dive, bite) drains his **magic shield** instead, shown as a shimmering bubble that fades as it drops. When the shield breaks he is beaten, goes dizzy and can be eaten (it counts as food). His tower can then be burned or smashed into rubble. He, his tower and his shield return at every new castle level and when your dragon is defeated.

- **Wizard's Isle, flat:** the wizard's island has no mountains any more, just sand and his tower, on the world and the minimap/big map.
- **Soft boss waters:** the Kraken Deep now fades in over about 840 px instead of a hard seam, and Nessie's loch is a single smooth gradient (see the shots below).
- **Storm near the Wizard's Isle:** the weather turns stormier the closer you fly to the isle. It starts about 3,200 px out and builds smoothly: a gentle blue-grey dimming, a soft edge vignette, light rain streaks, and every 5–11 s a soft lightning flash with quiet thunder. Strength 0 far away, about 0.18 at 2,500 px, 0.72 at 1,500 px and 1.0 on the isle; once the Storm Wizard is beaten it calms to 35%. On **LOW** graphics there are only 30 rain streaks (90 on HIGH), and the flash is capped at 22% brightness so it's never scary.

| Nessie & mermaids north of the wall | Wizard's Isle (no mountains) |
|---|---|
| ![](screenshots/294_nessie_mermaids_north.png) | ![](screenshots/295_wizard_isle_no_mountains.png) |
| Kraken Deep edge, before | Kraken Deep edge, after |
| ![](screenshots/296_before_deep_edge.png) | ![](screenshots/297_after_deep_edge.png) |
| Nessie's loch, before (rings) | Nessie's loch, after (soft) |
| ![](screenshots/298_before_nessie_loch.png) | ![](screenshots/299_after_nessie_loch.png) |
| Storm near the isle | Lightning flash |
| ![](screenshots/300_storm_near_wizard_isle.png) | ![](screenshots/301_storm_lightning_flash.png) |

## Everyone is on the menu (except three)
Every creature, villager, soldier, animal and mini boss can be eaten once it's worn down or beaten, with a soft white puff and a GULP (no gore). Mini bosses: the Kraken and the giant octopus (dazed), the sand worm (surfaced), the Hydra, the Griffin, the Storm Wizard, the Dark Wizard, Cerberus, Medusa, trolls and cyclopes (dizzy), wild dragons, alphas, princes (under 30%), raid champions (under 50%) and now **Nessie** (beaten). Only three can **never** be eaten: **King William**, **Princess Elizabeth** (she is carried, never harmed) and **your own lair guardian dragons** (they're on your side). A bite at the king just goes *CLANG!*

## The Dark Wizard of Cinder Isle (northern dark ocean)
On **Cinder Isle**, a small ash-grey volcano island in the northern dark ocean (about x 9700, y −9000), the **Dark Wizard** hovers over his own volcano and guards it. There is no tower or spire on the island, only the volcano.
- **Magic shield:** the same rules as the Storm Wizard: every hit (fire, lava, stomp, dive, claw, bite) drains his shield. Shield **525** (1.75× the Storm Wizard's 300); it does **not** grow with the castle level. Easy mode: ×0.7.
- **Spells** (every 2 s, Easy 2.8 s), starting when you come within 1,400 px:
  - **Lava shots:** 5 lava blobs, **26** damage each (was 13). These never melt in water.
  - **Eruption:** his volcano erupts in a ring that grows to 900 px over 1.5 s: **12** damage (was 6) and a strong knockback (stronger than the wind wall's push).
  - **Purple lightning:** a purple mark appears for 1 s, then the bolt hits for **16** damage (was 8).
- **Beat him:** your reward is **his volcano and the purple triple lava shot** (below), plus a full heal, the *Volcano Tamer* achievement and a horn. There is no gold or max-health bonus for beating him. He lies dizzy and can be eaten (+40 HP, *Spicy Snack* achievement).
- **He comes back every castle level** (queue 140) with a full shield. **Your rewards stay** until your dragon is defeated: the volcano stays yours and the purple triple lava shot stays on. While he's back you can still land on the rim and drink from his volcano, but he keeps casting at you. Beating him again gives the full heal and a *"beaten again"* message, with no second alert and no doubled reward. When your dragon is defeated, the new game takes the rewards away until you beat him again.

## Purple TRIPLE lava (the Dark Wizard's reward)
Beating the Dark Wizard unlocks **his volcano for lava drinking**: land anywhere by the crater on Cinder Isle and press **E** (pad X / touch DRINK). The rules are exactly the same as at Mount Cinder: a full load of 20 shots, an 8-second refill cooldown, and *Already full of lava!* when you are topped up. Before he is beaten, his shield keeps you away. While he lies dizzy on the rim, the first **E** gulps him and after that **E** drinks. The unlock is saved and kept through level-ups, even when he comes back. Losing your dragon (a new game) takes it away.

Beating him also upgrades lava at **every** volcano (Mount Cinder, Mount Ember and Cinder Isle). A small alert announces it: *"🌋 Purple TRIPLE lava shot!"* (*Dark Wizard beaten · his volcano is yours · 3 purple globs, +50% damage each, at every volcano*).
- Each lava press now lobs **3 dark-purple globs** (straight ahead and ±18°, a 36° fan). They are big, with a purple glow and a short trail, so the three shots are easy to tell apart even on a phone. All three cost just **1 lava**.
- Each glob does **+50% damage**: units 30 → 45 (wet units 25 → 37.5), stone buildings 55 → 82.5, wooden buildings 60 → 90, ships 70 → 105, siege engines 70 → 105. Cooling puddles are unchanged (2 per tick).
- The upgrade is saved and kept through every level-up. It is lost when your dragon is defeated and comes back when you beat him again.

| Volcano fight | Eruption |
|---|---|
| ![](screenshots/302_dark_wizard_volcano_fight.png) | ![](screenshots/303_dark_wizard_eruption.png) |
| Beaten: triple lava unlocked | Purple triple lava shot |
| ![](screenshots/304_dark_wizard_beaten_alert.png) | ![](screenshots/305_purple_triple_lava_shot.png) |
| Volcano Tamer achievement hint | Drinking lava at Cinder Isle |
| ![](screenshots/306_volcano_tamer_hint.png) | ![](screenshots/307_cinder_isle_drinking_lava.png) |
| Cinder Isle: no tower, the wizard hovers over the volcano | |
| ![](screenshots/308_cinder_isle_no_tower.png) | |

## No gold in the fantasy lands
Nothing north of the magic wind wall gives gold: not the light or dark realms, their seas and isles, the fantasy castles and citadels, creatures, mini bosses, buildings or spires, and not the two wizards (the Storm Wizard's isle sits just south of the wall but counts as fantasy too). They still give everything else: health, max health, fire, lava, food and achievements. Gold comes only from the human lands, as before.
- **Removed:** the Storm Wizard's +300 gold (he now just opens the barrier), the Dark Wizard's +400 gold and the Cinder Isle spire's +100 gold (the spire itself is gone).
- **Safety nets:** building coins, dropped coins, sunk-ship loot, seashells and raider purses can never appear north of the wall (none did before either).

## Wanted tiers and the MILITIA
The WANTED meter rises as you cause damage and cools down faster the farther you are from where the trouble was. Wild animals never raise it. The kingdom's response grows in tiers:
**foot soldiers → knights → archers → mounted knights → siege engines → MILITIA.**
Early waves and patrols are only foot soldiers and knights. Difficulty grows slowly, and Easy mode is gentler still.

### The whole kingdom takes up arms!
When the MILITIA tier is reached, bells ring in every town and a banner reads **"The whole kingdom takes up arms!"** A red HUD strip with a swinging bell shows how many are armed. **Every** villager on the map arms up, each with a red armband and their own tool:

| Who | Weapon | Guards |
|---|---|---|
| Villagers | spears (poke, or throw from range) | their own village |
| Lumberjacks | axes (swing or throw) | the logging camp |
| Miners | pickaxes (swing or toss a rock) | the mine |
| Farmers | pitchforks or scythes | their farm |
| Masons | hammers | the castle gate |
| The hunter | his bow and dagger | his cabin |
| Bucket villagers | throw water and buckets | the fire line (they keep fighting fires) |
| Tax collectors | clubs | their route |
| Caravan / cart drivers | staffs and whips | their cart (carts keep rolling) |
| The lighthouse keeper | an oar (and pebbles) | the lighthouse |

They **defend their own post only**: they engage the dragon when it comes within about one screen of the post, never chase it more than a short leash away, and walk back when it leaves. Nobody marches across the map. When the WANTED level drops below the militia tier, everyone puts their tools down and goes back to work. The armed state is kept in saves. It's all cartoon fun: a dragon can still gulp a militiaman whole.

### Who fights back, and how hard
- **The militia (spear villagers) are the weakest fighters in the kingdom.** They never run away once the Militia tier starts. They close in and poke for **0.5 damage about every 2.2 s**, and now and then throw a spear for **0.4** (about every 6 s). A crowd doesn't make them hit harder, and each has only **8 HP**, so they're easy to beat.
- The militia arm up as soon as the WANTED bar reaches **Militia**. There's no longer an extra hidden wave gate, which used to leave villagers fleeing while the HUD already said Militia.
- **Workers fight back even before the Militia tier.** A lumberjack, miner or farmer at their worksite stands up to the dragon instead of fleeing:
  - lumberjack: axe chop, **2.0 every 1.8 s**;
  - miner: pickaxe, **2.2 every 2.0 s**;
  - farmer: pitchfork, **1.8 every 1.6 s**, or scythe, **2.0 every 1.8 s**.
  - When the dragon leaves (or flies too high to reach) they go back to work. Workers have 10 HP, or 14 when armed at the Militia tier.
- **Plain unarmed villagers still run away** until the Militia tier.
- **Soldiers stay far stronger:** a foot soldier hits for 4 every 1.35 s, and knights hit harder still.

## The East March: a second lumber camp and a second mine
The kingdom has grown east. The Sapphire Coast, the sea, the Lonely Lighthouse and the Kraken Deep moved 3,000 px further east (the world is now 30,200 px wide instead of 27,200), and the new land between Saltmere and the coast is **the East March**:

- **The Eastwood Logging Camp** (around x 6250, y 1250): a tent, a sawmill and the *Eastwood log yard*, in a clearing at the south edge of the Eastwood, a big new pine-and-oak forest. 3 lumberjacks fell its trees.
- **The Iron Crags Mine** (around x 7450, y 2300): a mine head, a miner's hut, mine carts and the *Crags stone yard*, in the rocky Iron Crags. 3 miners dig there.
- Both have their own yards, workers and mine carts. Their supply carts haul the wood and stone along new roads through Saltmere to the **Castle Storehouse**. A road runs from Saltmere to each site, and a track joins the two sites.
- Each site has its own **worksite guard squad**, road-patrol stops and **watchtower spots**. Their workers fight back with their tools like the first camp's, and lost workers are replaced by villagers walking in from Saltmere. Predators (wolves, foxes and boars in the Eastwood, and goats in the Crags) roam nearby.
- The minimap, world map (3 new region names), lair arrow and fog all cover the new land.
- **Old saves** made on the smaller map still load. Anything that was on the old coast or at sea, including the dragon and the fog you had explored there, is moved 3,000 px east with the coast. The East March starts unexplored with fresh workers and yards.

## Kingdom life
- **Castle Aldric** sits in the south-central kingdom, well away from your lair on Dragon's Roost. Roads, waves, patrols, raids, tax collectors and the map markers all start from there.
- **Supply carts and the Castle Storehouse:** lumberjacks and miners pile wood and stone in their yards. Horse carts, each led by a driver, haul it along the roads to the storehouse beside the castle. Carts now run about 1.8× as often: a cart sets off with a part load after 12 s instead of 22 s, loads a unit every 0.6 s instead of 1.1 s, drives at 58 instead of 46, each yard runs 3 carts instead of 2, and a wrecked cart comes back after 20 s instead of 35 s. Only delivered cargo pays for rebuilding, so wrecking a cart costs the kingdom its load.
- **Worker respawn:** when the logging camp, mine or hunters' cabin is rebuilt, new workers walk in from the nearest village.
- **Three hunters per cabin:** the hunters' cabin houses three hunters with bows and daggers. Each one respawns on his own timer (about 20 s, staggered) while the cabin stands. If the cabin is wrecked, none return until it is rebuilt; then villagers walk in one by one and take up the bow until there are three again. To keep it fair they fan out to different sides, only one arrow flies every 0.6 s across the trio, and only one hunter stabs with his dagger at a time. During the militia all three guard their own corner of the cabin. Save and load keep which hunters are alive and their health.
- **Three hunters' cabins:** one in the north of the Deepwood (the original, beside its track), one deep in the **south Deepwood** (around x −2300, y 3300) and one in the heart of the **Eastwood** (around x 7600, y 300). They are far apart, off the roads and away from villages and worksites. Each cabin has its own three hunters with exactly the rules above: their own respawn timers, no respawns while that cabin is wrecked, villagers walking in one by one after a rebuild, militia bows and corner posts at their own cabin, and save/load. Every cabin shows on the minimap and world map (grey when burned). Saves from before the extra cabins load fine and the two new trios simply appear.
- **Roads** link every village, the castle and the camps. They never cross water except over bridges. Patrols and caravans travel along them.
- **Wells** stand in villages. They are tough (about 3× a hut's health) and fire barely hurts them. Small villages always keep at least one well.
- **Town fountains:** the nicer, bigger towns (8+ huts or a market) have a decorative stone **fountain** in the town square, with tiered bowls and splashing water, plus at most one well. Fountains are fireproof and tougher than wells (540 hp, 2× a well). Wreck one and it topples into rubble (counted in the tally as *Town fountain*); villagers rebuild it with stone.
- **Bucket brigades use ANY water:** villagers fetch firefighting water from wells, fountains, rivers, ponds, the lake or the sea shore, whichever is nearest the fire. They walk to the dry bank, fill up (*"A bucket from the river!"*) and run back to throw it.
- **Everything is destructible:** huts, barns, markets, wells, the castle and bridges. Villagers repair and rebuild over time. Buildings and markets drop gold, and the castle collects taxes.
- **Wildflowers** carpet each region in its own colours: meadow, forest, hill, alpine (low slopes only), desert and oasis blooms, and coastal pinks. Villages and the castle grounds have fenced **vegetable and flower gardens**. Fire scorches flowers and gardens to black. Flowers regrow, and villagers replant gardens (the alarm rises a little when a garden burns).
- **Plants burn everywhere:** dragon fire and lava shots set alight savanna grass and acacias, jungle trees (with their vines) and giant ferns, desert cacti and scrub, beach and oasis palms, mountain pines, island grass and the heather of the Dragon Peaks, as well as forest trees, wildflowers and gardens. Burning plants spread fire to nearby plants, flowers, trees and (big ones) buildings, burn down to charred stumps, and later regrow as saplings, just like forest trees. Reeds and other water plants never burn. Burnt plants are saved and loaded.

## The volcano and LAVA SHOTS
**Mount Cinder** smokes and glows just south-east of your lair on Dragon Peak (a volcano marker shows on the minimap and world map). Every 10–18 s it puffs out a harmless shower of embers. Land beside the crater and press **E / X / BITE** (the touch button reads **DRINK**) to gulp **20 LAVA SHOTS**. They replace fire breath until they run out:
- Each fire press (Space, A/RT or the touch **FIRE** button, which reads **LAVA n**) lobs one lava glob. Holding it repeats about twice a second.
- The glob is a short, heavy lob: it lands about **290 px** from the dragon (≈185 px past the mouth, about 62% of the old ~400 px) and splashes over a **130 px** radius (was 80 px, about 1.6×). It sets wood, trees, fields and carts ablaze, hurts and burns soldiers, and, unlike fire, **cracks stone walls, towers and wells**.
- It leaves a **glowing lava puddle** (62–74 px across the middle) that cools over **5.5 s**: bright orange and glowing at first, then deep red, then a dark cracked crust. While it is still hot (about the first 4.8 s) it does a small **8 damage per second** to soldiers, animals and anyone else standing in it (no extra burning) and slowly damages wooden buildings it touches. Once it crusts over it is harmless, then fades. At most **24** puddles glow at once (the oldest cools away first). Over water it fizzles into steam (ships still catch fire).
- The puddles **never hurt the dragon or Princess Elizabeth**. They *can* hurt **King William**: in his golden armour he takes the usual ×0.55 fire damage, and even out of armour he hops and shouts *"Hot! Hot! HOT!"*. As always he can never drop below 12% health.
- While you carry lava, your mouth glows and drips embers, and the HUD shows **Lava: N**.
- At 0 you are back to normal fire. You can refill at the crater 8 s after your last drink.

## The castle gate
The gate is its own destructible part of the castle; fire or stomps bring it down. While it lies in rubble (or is still being rebuilt):
- Waves come about **2.5× less often** and are **half the size**.
- The soldiers trickle out through the rubble one at a time.
- The HUD shows **"Gate destroyed: waves delayed"** with the rebuild status.

The engineers wait about 20 s for the dust to settle, then spend 6 wood and 6 stone from the kingdom's stockpiles and rebuild the gate slowly (about 45 s). When it is repaired, the normal wave pace returns.

## The gold hoard
The HUD shows gold as icons next to the wood and stone: a **castle + coin** with the amount is the gold still in Castle Aldric, and a **dragon + coin** with the amount is your lair hoard. All four resources (wood, stone, kingdom gold, lair hoard) sit on the **left side**, in one compact row directly under the **CASTLE LV** panel (two rows only if the numbers get too wide). The **minimap** sits in the **top-right corner** (inside the iPhone safe area / notch), with its "Explored % · M: map" caption underneath; it shrinks a little on narrower screens so it never touches the centred WANTED panel or boss/raid bars. Announcement banners move below the left column on desktop, or start right of it on touch screens, and stay under the minimap; the lair arrow, hunter arrows and MAP / PAUSE buttons keep clear of both. The pause menu shows the same icons.
The HUD's castle panel shows only the **castle level**. There is no Princess Elizabeth status line, no lair-hoard points line and no blinking *break the stone roof* label over the keep. The wanted/alarm bar stays, and your score is in the pause menu.


**No carrying:** every bit of gold you collect (castle gold piles, coins from buildings, tax sacks, caravans, pirate loot, seashells and so on, all from the human lands; nothing in the fantasy lands gives gold) goes **straight into the lair hoard** the moment you grab it. A little coin and **+N** pops up next to the dragon icon on the HUD. Raids, raid cooldowns, the ransom and save/load all work from that hoard total.

The gold lands on a visible treasure pile inside the lair, and the pile grows smoothly as your total rises:

| Gold stashed | Stage |
|---|---|
| 0–24 | A few coins |
| 25–79 | Small pile (plus a few coin stacks) |
| 80–199 | Big mound (plus a treasure chest) |
| 200+ | Mountain of treasure: crowns, goblets and gems |

When gold comes in, coins rain into the pile with a clink, and the pile bumps up. On High graphics the hoard glows and twinkles. A label under the pile shows its stage and total. The world map (M) shows a gold mound beside the lair, sized to the hoard, with its total.

## Princess Elizabeth

She is held inside the great keep under a tough **stone roof**. Fire barely scorches it; bites, stomps, the crash stomp and lava shots crack it in stages until it crumbles, and masons patch it while she is inside. The princess has a name: **Princess Elizabeth**. A pink name tag floats above her in her tower, in your claws and in your lair. Messages use her name, such as *"You captured Princess Elizabeth!"*, and the HUD shows where she is. While you carry her, the nearest knights and archers shout rescue calls ("Rescue Princess Elizabeth!", "Unhand Princess Elizabeth, foul beast!"). She is only ever captured, never eaten or hurt, just very cross.

## Hoard raids

A hoard attracts trouble. Raids come on a clock, not on gold growth: **5 minutes after a raid ends** (7 minutes in Easy mode) the next **named knight** comes for the pile, even if it hasn't grown at all, as long as the hoard holds at least **100 gold** (140 in Easy mode). With less than that, no raid comes; the next one is announced as soon as the hoard reaches the minimum. The first raid of a game can't come in the first 30 seconds. The raid's **tier** (champion strength, spears, archers and the share he can steal) is set by the gold in the hoard when it is announced: Tier 1 from 100 gold, 2 from 250, 3 from 500, 4 from 1000, then +1 per extra 1000. The HUD shows the time until the next raid.

**No raids during the King William fight:** from the moment King William runs to the armoury to suit up, through the armoured fight, his shelter in the keep, second wind, dizzy spell and any charge or princess-rescue chase, no new hoard raid is announced (the HUD says *"No hoard raids while King William is fighting"*). A raid that was already announced or marching before he went to suit up carries on as normal. When he is calm again the usual raid rules resume after a 20-second grace, and only one raid comes, never a backlog.

1. **Warning:** a banner reads, for example, *"Sir Gareth the Bold vows before King William to claim the dragon's hoard!"* A horn sounds, and you get **8 seconds** to get ready.
2. **March:** the champion rides out of the castle gate with an escort of foot soldiers. The escort carries heraldic flags and spears with pennants in the champion's colours. The party goes east along King William's road, then up the mountain trail to Dragon Peak, which takes about 45 seconds.
3. **The champion** is a mini-boss. They are bigger, with a plume, a coloured tabard and a crested kite shield, and have a name tag and health bar overhead. Fire does only 60% damage to them. They can't be swallowed until they're below half health; they raise their shield.
4. **Theft:** if the champion reaches the hoard, they grab **25% of it at every tier** (queue 136; never the whole pile) and carry the sacks back to the castle. Loaded raiders walk home **slower**: the more gold they carry, the slower they go (about 92% speed with 100 gold, 78% with 300, down to 55% with 600 or more), and you can see the gold sacks bouncing on them (1 to 4 sacks by load). If they get through the gate, that gold is gone.
5. **Victory:** defeat or eat the champion (a cartoon gulp), even on the way back, and the sacks drop: all the stolen gold goes automatically back into the lair pile with a '+N' pop. There is **no lump-sum gold bonus**: the only gold is what each knight was carrying (the stolen sacks, which go straight back to the lair). Each knight also carries its own purse, which it drops on the ground when it falls; see *Raid knights drop gold*. You still get 300 + 150×raid points, and the *Raid defeated!* announcement shows every time, including when your guardians win without you (*"Your guardian dragons beat Sir …!"*).

**Raid tiers (by hoard size):** the thresholds above still decide *when* a knight comes, and the 5-minute cooldown is unchanged. How *tough* the raid is depends on the size of your hoard at the moment the raid is announced: **Tier 1** under 250 gold, **Tier 2** from 250, **Tier 3** from 500, **Tier 4** from 1,000, then one more tier per extra 1,000 (2,000 = Tier 5, 3,000 = Tier 6...). The banner says so: *"Sir Gareth the Bold (Tier 3) rides for your hoard!"*

| Tier | Hoard | Champion HP | Spearmen | Archers | Damage | Gold taken |
|---|---|---|---|---|---|---|
| 1 | 100–249 | 150 | 2 | 0 | ×1.0 | 25% (was 20%) |
| 2 | 250–499 | 210 | 3 | 0 | ×1.1 | 25% (unchanged) |
| 3 | 500–999 | 270 | 4 | 1 | ×1.2 | 25% (was 30%) |
| 4 | 1,000–1,999 | 330 | 5 | 2 | ×1.3 | 25% (was 35%) |
| 5 | 2,000–2,999 | 390 | 5 | 3 | ×1.4 | 25% (was 40%) |
| 6 | 3,000–3,999 | 450 | 5 | 3 | ×1.5 | 25% (was 45%) |
| 7+ | 4,000+ | 480+ | 5 | 3 | ×1.6 (max) | 25% (was 50%) |

Champion HP grows gently with the tier (and a little with the raid number), escorts get a bit tougher, and the party never exceeds 8 units, so iPhones stay smooth. Easy mode gives one fewer spearman and softer HP. A raid always leaves you at least 1 gold.

**Trophy banners:** each champion you defeat or eat leaves their heraldic banner planted around your gold pile, in their colours and with their crest (lion, star, tree, crown, sun, moon, rose or bolt). The banners fill a ring around the hoard (back first, then a wider second ring) and wave in the wind. Walk the dragon close to a banner to see that knight's name. Trophies stay for the whole session, even after a new game, and the world map shows a 🚩 count beside the lair.

Every raid uses a new name from a pool of 16 knights and dames, such as Sir Roland Ironheart and Dame Elara the Brave. Toughness comes from the raid tier (above); champion HP also rises a little with each raid (+15 per raid, up to +60) and with the castle level, and from level 2 the escort has one extra spearman. The whole party is capped at 8.

While a raid is on, a HUD bar shows its status (countdown, distance to your hoard, or distance to the gate when they're running off with your gold). The world map and minimap show the party with a flashing banner marker.

Controls are the usual ones: fire, stomp, and bite/eat (E, pad X, or the BITE button on touch).

## The Ancient Jungle Temple
On the east flank of **Mount Ember**, the jungle volcano in the far west of the Emerald Jungle, stands a stepped stone temple, overgrown with vines, with a gold-glinting shrine on top. It is **fire-proof** and too solid for most attacks: use **bites**, the **Q stomp** or **lava shots**. When it crumbles: KA-BOOM, stone blocks fly, and **+100 gold** goes straight to your lair. It is never rebuilt, but a new one stands every level. It has its own Tally line, and a world-map marker once you have seen it.
- **Ember power (once per game):** the first time you wreck the temple you also get a **permanent +10 max fire** on top of the 100 gold, shown in the small alert at the bottom of the screen (*"🔥 Max fire +10!"*). It stacks with the nest-egg fire boosts, carries over every castle level and is kept in saves. Wrecking the temple again on later levels still gives the 100 gold, but no more fire. A new game resets it.
- **Ruin stones, 5 gold each (item 130):** every piece of jungle temple ruin can now be smashed for **+5 gold** (*"Smash! +5 gold"*). Bite it (on the ground), stomp it (Q) or rake it with a claw; stone never burns, so fire alone does nothing. There are **30 pieces, 150 gold in all**:
  - the **3 overgrown "ancient ruins"** in the jungle: 4 pillars and 1 lintel each, **15 pieces (75 gold)**. The lintel rests on the two west pillars, so knocking out either of those brings it down too (+5 for each);
  - the **rubble of the wrecked temple**: 14 rubble blocks and 1 leaning broken pillar, **15 pieces (75 gold)**. They only appear once the temple itself has been wrecked (which still pays its own 100 gold).
  - Smashed stones stay smashed in a save; all 30 are back at the start of the next castle level, like the temple. They count in the Dragon's Tally (*Ancient ruin stones smashed*), and the jungle hint mentions them.

## Mount Ember (the second volcano)
A second volcano, **Mount Ember**, smokes in the far south-west of the jungle. You can drink lava there just like at Mount Cinder (lava shots). It erupts now and then, raining embers that can set nearby jungle plants and trees alight and leaving lava puddles. Both volcanoes show on the world map. Trees, decorations and animals never spawn on its cone.

## Town economy and the tax collector
Houses (huts and adobes) slowly earn gold, and merchant shops (stalls, fishmongers, bakeries, smithies and jewellers) earn it 2.5× faster. This gold is **hidden**: nothing on screen shows it. It is **not** the kingdom's gold until the tax collector physically carries it to the castle.
- The tax collector empties each building into his sack, but always leaves **1 gold in a house and 3 in a shop**.
- **Intercept him** and his sack goes straight to your lair pile; it never reaches the castle.
- **Wreck a house or shop** and whatever gold it held drops automatically into your lair pile.
- **Escort:** with a heavy sack (25+ gold) he asks any **patrol he passes within about 200 px** to walk him home: 2 guards at 25 gold, 3 at 40, 4 (the cap) at 60. He never calls patrols from afar, and they never detour; if none is near, he walks alone. The escort walks with him, fights you, and returns to its patrol route after delivery. His sack visibly fills up. Buildings' gold, the tax collector and his escort are all saved.

## The rich desert caravan and Sandhaven's troops
One of Sandhaven's two camel caravans is a **rich caravan**: three plain camels (no blankets, tassels or bells), one carrying a **treasure chest**, and two richly dressed traders. It plods along the roads from Sandhaven to the castle gate and back again (about 67% of its old pace: lead trader 38 → 25.5 px/s), resting at each end.
- **Escort:** exactly **10 desert soldiers** (turban, sand robe, scimitar and round shield) and **6 desert archers** (blue turban and a curved bow, which shoot from about 420 px), marching in formation: two files of soldiers flanking the camels, archers at the front, rear and sides.
- **Desert troops are tougher** than the kingdom's regulars: desert soldier 35 HP (regular foot soldier 24), desert archer 32 HP (regular archer 22), and they hit 75% harder than regulars. **Toughened again:** desert soldier **53 HP** (was 35), desert archer **48 HP** (was 32), camel rider **90 HP** (was 60), so +50% HP; and **+40% attack**: sword and arrow hits 7 (were 5), camel-rider scimitar 10.5 (was 7.5). This covers every desert soldier: escort, camel riders, Sandhaven garrison and tower archers. HP still grows with the level.
- **Sandhaven garrison:** 3 desert soldiers + 2 desert archers always guard the town, separate from the escort, fresh every level (and saved).
- **The escort defends the caravan:** guards stay on a leash around the camels. When the dragon comes within 300 px of the caravan, the guards turn out and chase it, but never more than 380 px from the lead trader ("Back to the caravan!"); then they regroup into formation. In a test, a dragon landing next to the caravan drew guards at most 368 px away, and they regrouped to 156 px. (Before, guards could be pulled over 1000 px away.)
- **Camel soldiers:** each caravan (the rich one and the ordinary one) has **2 camel riders** (desert soldiers riding camels, with swords) that keep to the caravan under the same leash rules, and **4 camel riders** guard Sandhaven every level. They are saved and have their own *Camel soldiers* Tally line.
- **Predators:** lions, hyenas, big cats, wolves, bears, scorpions, snakes and the like that come near the caravan get chased off by the escort; the animal fights back, and once worn down it simply runs off (nobody is defeated for good). If the dragon attacks, the guards turn on the dragon first.
- **Raid it:** take down the lead trader or the treasure camel and the treasure chest bursts open: **50 gold coins** spill on the ground for you to collect (was +20 gold straight to the lair). The ordinary desert caravan drops 50 coins too when its lead trader falls. This works whether you catch it on the way to the castle or on the way back after it has paid the king.
- **It pays the king:** every time the rich caravan reaches the castle gate safely, **+100 gold** (was +50) goes into the king's treasury, with a small alert: *"🐪 The desert caravan reached the castle safely: +100 gold for the king's treasury"*.
- **The escort grows:** every time the rich caravan arrives safely at **either end** (the castle or Sandhaven), its escort gains one more guard (soldier, soldier, archer, repeating; the live caravan gets the new guard at once). Cap: **+8 extra guards at level 1**, and the cap grows 10% per castle level (8, 9, 10, 11, 12 at levels 1–5). The growth is saved, carries over to new castle levels and resets only with a new game.
- **Bigger caravans each castle level (item 128):** every caravan starts a level with about 10% more guards per castle level (×1.1 per level, compounding, rounded, and at least +1 every two levels), on top of the per-arrival growth above.

| Castle level | Rich caravan guards (before → now) | Ordinary caravan camel riders (before → now) | Per-arrival cap |
|---|---|---|---|
| 1 | 18 → 18 | 2 → 2 | +8 |
| 2 | 18 → 20 | 2 → 2 | +9 |
| 3 | 18 → 21 | 2 → 3 | +10 |
| 4 | 18 → 23 | 2 → 3 | +11 |
| 5 | 18 → 25 | 2 → 4 | +12 |

Rich caravan counts are 16 foot soldiers and archers plus 2 camel riders; the level extras are foot troops (soldier, soldier, archer, repeating). Caps for performance: +16 level extras for the rich caravan and +4 camel riders for an ordinary one.
- **Sandhaven's garrison grows:** once all **8 towers** stand, each caravan arrival at Sandhaven adds **2 desert soldiers + 1 desert archer** to the town garrison (*"Sandhaven's garrison grows"*), up to **15 extra troops**. If a tower has been burned down, the caravan rebuilds the tower first and adds no troops that time. Saved; it belongs to the current castle level like the towers.
- **Respawn:** a raided rich caravan comes back from Sandhaven **10 minutes** later, quietly (no announcement). Fresh every level.
- **Reward towers:** each time a caravan that has paid the king gets safely back to Sandhaven, Sandhaven raises a **sandstone tower** (blue and gold pennant) with a desert archer on top, in the desert around the town (never overlapping). Up to **8** (was 5). Towers can be burned down; the archer then joins the town guard, and the next caravan home rebuilds a ruined tower first. Towers are saved with the game and belong to the current castle level (a new level or new game starts with none). Tally: *Sandhaven towers*.
- Surviving guards stay on as **Sandhaven's town guard**. When the kingdom musters (militia), desert soldiers and archers guard Sandhaven too.
- Desert soldiers, desert archers and raided rich caravans have their own **Sandhaven** section in the Tally. The caravan and the town guard are saved.

## The desert (Scorching Sands, west)
Sandhaven and its bazaar, an oasis, camel caravans on the road, desert animals, vultures and a **sand worm**. Reach it through the mountain pass. Hunger drains 1.35× faster in the heat. The desert is about 17% narrower than before, so the crossing to the savanna is shorter.

## The Golden Savanna and the Emerald Jungle (far west, past the desert)
The map is 36% wider (27,200 px instead of 20,000). Past the desert crossing, the sand blends into the **Golden Savanna**: golden grass, acacia trees, termite mounds, rocky kopjes and **two watering holes** (the big one in the middle and a smaller one further south-west, about 1,500 px away; animals drink at both, crocodiles lurk in the big one, and firefighters fetch water from either). Further west, the savanna blends into the **Emerald Jungle**: dense canopy trees with vines, giant ferns, the **jungle river** (it runs out to the sea) and overgrown **ruins**. The borders fade smoothly; there are no hard edges.
- **Savanna prey:** zebras, gazelles, wildebeest, giraffes, elephants (a feast: food 70), warthogs, ostriches. **Predators:** lion prides, cheetahs, hyenas and circling vultures.
- **Male lions:** every pride is led by a bigger, maned male lion (54 HP and a 7.2-point swipe (was 6) that gives the dragon a small shove, against a lioness's 22 HP and 3). He guards the pride's home turf. When he spots the dragon in or near it, he ROARS (visible rings and a roar sound) and calls the pride: any lioness that is hunting drops her hunt and runs in to fight. Once the dragon has been away from the turf for a few seconds, they calm down and go back to normal. He has his own Tally line ("Male lions").
- **Jungle prey:** monkeys, tapirs, capybaras, frogs, parrots and toucans. **Predators:** jaguars, tigers, pythons, and crocodiles in the jungle river. The jungle has about 5% more animals: 13 monkeys, 7 tapirs, 11 capybaras, 15 frogs and 13 river fish (up from 12, 6, 10, 14 and 12). Predator numbers are unchanged. The ancient ruins are python country: 12 pythons coil around the three ruin sites (5, 4 and 3, biggest ruin first) and 2 more roam the jungle, 14 in all (up from 4). Pythons that are eaten come back at the ruins.
- Every existing rule applies: they hunt, respawn only in their home region, count for the Glutton milestone, never raise the wanted level, and have Tally entries (greyed out until discovered). The regions have their own banners, fog, world-map labels and minimap colours, and are saved and loaded.
- Hunger: 1.1× in the savanna, normal in the jungle. Flying nonstop from the castle you arrive in the savanna hungry, so snack on a lizard or camel in the desert on the way (the test does this and arrives with plenty left).

## The Dragon Peaks (far north-west)
A craggy roost of smaller **wild dragons** with their nests, mountain goats and eagles, plus purple heather (which burns). Wild dragons are never killed outright: worn down to 1 HP they are dazed (cartoon stars) and can be gulped. Hurting one makes it (and, in Normal mode, its roost-mates) defend. A dragonet hatches from a nest about every 100 s while the roost is small. **Eating a wild dragon gives +5 permanent max stamina** (the yellow Stamina bar used for flying, not the fire meter; a *"+5 Stamina!"* popup shows it). It stacks, stays on the same life across castle levels, resets on death or a new game (like the nest-egg fire bonus), and is kept in saves. It no longer gives max health. The giant octopus still gives +20 max health.

## Meerkats, roadrunners, jackals and bulls
- **Meerkats** (savanna and desert) live in colonies at burrow mounds. A lookout squeaks when the dragon or a predator comes near and everyone dives into the burrows, where they can't be bitten, burned or caught.
- **Roadrunners** (desert) zig-zag away at top speed with dust puffs and a "Meep meep!".
- **Jackals** are small scavenger-hunters that chase meerkats and roadrunners.
- **Bulls** (1–2 per cow pen) paw the ground, snort steam, then charge and ram. A damaged fence lets a bull break out, chase you briefly and trot home. Their tough hide means they must be worn down before you can swallow them. Farmers mend the fences.

## Quick dodges
Hunters and nimble animals (deer, gazelles, rabbits, foxes, wolves and the white alpha, jackals, hyenas, big cats, monkeys, meerkats, roadrunners) sometimes see an attack coming and **dash sideways** in a puff of dust ("Dodged!"). It works against fire, lava, stomps, scratches and bites. A dodge only happens if they've had a moment to notice you, it has a few seconds' cooldown, and grabbed, carried or eaten creatures can't dodge. Heavy animals (bears, boars, bulls, elephants, crocodiles and so on) never dodge.

## Exploration carries over
The fog of war you've cleared and the places you've discovered stay revealed when you move up a level, and they're kept in your save. Only a brand-new game starts with a fresh map.

## Predators hunt, and more prey
- Prey populations (spawn counts and respawn caps for wild prey, herds, fish schools and birds) are **5% higher**, rounded per group, so some groups gain one animal and small groups stay the same.
- **Every predator hunts:** wolves, foxes, bears, mountain lions, snakes, desert foxes and scorpions, the sand worm, hawks, eagles, gulls, sharks, the squid, crocodiles, lions, cheetahs, hyenas, jaguars, tigers, pythons and vultures stalk, chase and **gulp** their prey, which vanishes in a cartoon puff of stars or feathers (no gore). Prey that escape run away.
- Performance: only a few predators look for prey each frame (6 on High graphics, 3 on Low), so the hunting costs almost nothing.

## Crocodiles (fresh water only)
Crocodiles live only in **fresh water**: the Silver River, Mirror Lake, the ponds, the big savanna watering hole and the jungle river. They never appear in the sea or the desert oasis. They lurk with only their eyes and snout showing, then lunge at animals that come to drink, fish and birds. They **snap at the dragon** (8 damage) when it swims or walks close by. They are edible (food 22) and wild, so eating them never raises the wanted level. They respawn slowly (at most one every ~75 s), appear in the Tally and are saved and loaded.

## Princess ransom
When you deliver Princess Elizabeth to your lair (a level win), **King William pays a ransom** at the start of the next level: **50% of the gold still in the castle treasury + 100 gold + 50 × (castle level − 1)** (nothing extra at level 1). *Before:* 10% of the treasury + 100 + 50 × (level − 1). Examples (old → new): level 1 with an empty treasury 100 → 100; level 1 with 1,000 gold 200 → 600; level 3 with 500 gold 250 → 450; level 5 with 2,000 gold 500 → 1,300; level 10 with 4,000 gold 950 → 2,550. A banner reads *"King William pays a ransom for Princess Elizabeth: +X gold!"* and coins fly into your hoard, on top of the gold you carried over. The ransom counts toward raid thresholds, but a raid can't start in the first 45 seconds of a level.

## Prince boss armies (every 5th castle level)
At castle level 5, 10, 15 and so on, a named **prince** comes for the dragon. A herald announces *"Hear ye! Prince … vows before King William to slay the dragon!"*, then after a horn call and war drums his **royal war fleet** sails in from the southern sea edge: 2 warships at level 5 and one more for each later prince. While at sea, the ships can be burned, hit with lava shots or raked with a claw scratch. Sinking a ship dumps its soldiers into the sea; they can't swim in armour, so they cling to barrels and are fished out (no drowning). The ships that make it beach at the landing spot (⚓ on the map), and from then on **the prince and his whole army hunt the dragon down together as one group**, wherever you are on the map. The prince rides his white warhorse at the head and his soldiers march in formation (rows of four) behind him. About every 1.2 seconds he re-targets your current position. Long distances follow King William's roads, short ones go straight across dry land, and they never wade into water: if you hover over the sea or a lake, they head for the nearest dry ground. His army is **separate from the regular soldier waves**. It doesn't count toward wave reinforcements, and defeating his soldiers doesn't raise the WANTED meter, so regular waves still come only from the WANTED level. The empty ships stay on the beach and can be burned. The prince has a boss health bar (600 HP at level 5, +650 per later prince) and can only be eaten below 30% health. Beating him gives 250 gold (+150 per later prince), 1,500 points per prince level and his royal banner as a trophy. There are no hoard raids during a prince attack.

**Prince tiers.** The first prince (level 5) is a gentle warm-up, and each later prince (levels 10, 15, 20 …) is a clear step harder:

| Prince (castle level) | Health | Lance thrust | Charge | Cavalry charge | Army |
|---|---|---|---|---|---|
| 1st (5) | 600 | 8 | 8 | 8 | 6 |
| 2nd (10) | 1,250 | 14 | 11 | 10 | 12 |
| 3rd (15) | 1,900 | 20 | 14 | 12 | 18 |
| each later | +650 | +6 | +3 | +2 | +6 (max 40) |

His soldiers get tougher per tier too (foot 26 HP +6, knights 48 +8, archers 20 +4, cavalry 85 +10). Easy mode gives the prince 25% less health and 2 fewer soldiers.

## King William's trade ships
When something is wrecked and the stockpile can't cover the rebuild, **King William orders a shipload of wood and/or stone worth 25% of the castle treasury** (at **2 gold per wood, 4 per stone**, were 4 and 6; split evenly by value when both are needed, and only the goods the rebuild needs). The shipload always covers at least the shortfall and is worth at least 40 gold; if 25% isn't enough for that he still buys the shortfall, if the treasury can cover it. He never buys for watchtowers, and never twice at once.
- *Before:* each ship brought exactly the shortfall, e.g. 6 wood + 6 stone (60 gold) for a wrecked gate with an empty storehouse. *Now:* with 1,400 gold in the treasury the same gate gets a 348-gold shipload of 42 wood + 30 stone; with 2,400 gold, 73 wood + 51 stone (598 gold). (Briefly, item 90 had ships carry 2.5× the shortfall; item 91 replaced that with the treasury rule before release.) *Cheaper goods (item 122):* the shipload is still worth 25% of the treasury, but each gold now buys more: with 1,400 gold the gate gets 85 wood + 45 stone (350 gold, was 42 + 30), and with 2,400 gold 148 wood + 76 stone (600 gold, was 73 + 51). Escort tiers still go by the gold value, so they are unchanged.
- **Bigger shipments get bigger escorts** (by the shipload's gold value). The banner names the tier and escort:

| Tier | Shipload value | Trade ship HP | Escort per cart | Escort warships |
|---|---|---|---|---|
| Small | under 100 gold | 130 | 3 foot guards (2 each when there are two carts) | none |
| Medium | 100–249 | 180 | 4 guards + 1 archer (3 + 1 with two carts) | none |
| Large | 250–499 | 240 | 5 guards + 2 archers (4 + 2) | 1 |
| Grand | 500+ | 320 | 6 guards + 3 archers (5 + 3) | 2 |

- **Royal escort warships** (green sails, 200 HP) keep station beside the trade ship; their deck archers loose arrows at a dragon within range. Once the cargo is ashore (or sunk) they sail home. Sinking one doesn't spill the cargo. It's tallied as *Royal escort warships*. Cart archers stand off and shoot when the dragon comes near.

| Grand shipment with 2 escort warships | Grand shipment's carts and guards at the quay |
|---|---|
| ![](screenshots/292_trade_ship_grand_escort.png) | ![](screenshots/293_trade_carts_grand_guards.png) |
- A banner announces *"A trade ship approaches with King William's lumber/stone!"*, a horn sounds, and a gold map marker follows the ship. The banner and horn only play while the dragon is south of the northern fantasy lands; up north the ship still sails, silently.
- The ship sails in from the south edge of the map to the **King's Quay** (a royal dock on the shore below the castle), unloads, and sails home.
- At the quay the goods go onto a **cart escorted by soldiers** (see the tiers above) that drives to the castle storehouse.
- **Sink the ship or smash the cart** and the goods are lost (tallied as *Royal trade ship* / *Royal trade cart*). After a cooldown the king re-buys only if the rebuild still needs it and the treasury can afford it.
- Ships, carts, guards and archers in transit are saved and restored, with their tier. Escort warships are re-launched beside a loaded ship.

### The castle detachment meets the ship
The moment a trade ship is **announced**, Castle Aldric sends a detachment (blue-grey tabards) out of the gate to the King's Quay. It marches at a pace set from the ship's arrival time (never slower than a walk), so it is already **standing in line on the shore when the ship ties up** (about 6 s after the announcement vs. about 27 s for the ship). If it is ever late (say a faster ship), the carts wait at the quay until it is there (at most 30 s). The banner adds *"N castle soldiers march to the quay to meet it"*.
When the goods are on the carts, the detachment falls in beside them (*"N castle soldiers fall in to escort the carts"*) and walks them to the castle, **on top of** the carts' own guards. They fight a dragon that comes close, like any soldier. After delivery (or if the cart is smashed or the ship sunk) the survivors march back through the gate to the garrison.

| Tier | Castle detachment |
|---|---|
| Small | 2 (2 foot soldiers) |
| Medium | 4 (2 foot, 1 knight, 1 archer) |
| Large | 6 (2 foot, 2 knights, 2 archers) |
| Grand | 9 (3 foot, 3 knights, 3 archers) |

Saving keeps a detachment that walks with a cart; a ship still at sea gets a fresh detachment from the gate after loading. Older saves load fine.

| Grand detachment waiting as the ship arrives | Grand detachment escorting the carts |
|---|---|
| ![](screenshots/309_castle_detachment_grand_waiting.png) | ![](screenshots/310_castle_detachment_grand_escort.png) |

## King William
Castle Aldric belongs to **King William**. He stands in the castle courtyard with a gold name tag, and when the dragon comes close he shouts orders, starting with *King William: "Guards! Protect Princess Elizabeth!"*. While you carry the princess away, he calls for her rescue. He can't be eaten or hurt. His name is used in the raid and prince announcements (*"… vows before King William to claim the dragon's hoard!"*), the ransom banner, the prince's march, the tax collectors (*"King William's taxes! Begone!"*), the militia (*"By order of King William!"*) and the castle label.


## King William's golden armour
When the dragon threatens Castle Aldric (comes low within about 520 px of the king, or attacks anything within about 700 px of the castle), King William shouts *"To the armoury!"*, runs into the keep and **suits up for about 3.5 s** (banner: **"King William dons his golden armor!"**, a glow and a *Suiting up!* bar at the keep door). He comes out as a **gold-armoured mini-boss** with a crown helm, sword and shield, an HP bar and the label **👑 King William**, and fights beside the guards, staying within 360 px of his courtyard post.

- **Health:** 600 at castle level 1, +100 per level (max 1600). Easy mode ×0.75.
- **Sword:** 10 damage +1.5 per level (max 22) every 1.1 s. Easy mode ×0.7.
- **Shield bash:** 8 + castle level damage every 6 s, which shoves the dragon back 40 px (never through walls). Easy mode ×0.7.
- **Armour:** fire does ×0.55 damage to him, and every other hit ×0.8. A bite does 40 (before armour) and goes *CLANG!*: he can't be eaten.
- **Retreat:** at **30% health**, the banner **"King William retreats to safety!"** appears. He runs into the keep, where Princess Elizabeth is held under the stone roof. Inside he can't be targeted, and a heal bar shows *King William is resting in the keep*.
- **Healing:** 3% of his max health per second while inside.
- **Returning:** he comes back out if the attack is still going **35 s** after he went in and he's at least 90% healed.
- **Calm:** after 30 s with no threat, he takes the armour off and returns to his post.
- **He can never be eaten or killed.** His health can't drop below 12%, and nothing can flag him as dead.
- The armour resets every level. A save made while he's resting in the keep loads with him still resting there.

### Second wind, knocked out dizzy and the king's charge
- **Round 1** is as above: at 30% health he retreats to the keep.
- When he comes back out, a banner announces **"King William's second wind!"**. This time he **doesn't retreat**: he fights until his health hits the 12% floor.
- Then he is **knocked out dizzy for 30 s** (banner **"King William is knocked out dizzy!"**). He sits on the ground swaying, with stars circling his crown and a *Knocked out dizzy: N s* countdown. While dizzy he can't be hurt, bitten, eaten or targeted, and he doesn't fight back.
- When he cools off, if you **haven't reached your lair**, he gets up and **leads a charge after you** (banner **"King William leads the charge!"**). He takes **every surviving knight, archer and soldier still around him** (guards near the castle; tower archers stay on the walls, and patrol squads, raiders, escorts and the prince keep their own jobs). Nobody new is spawned; if nobody is left, he charges **alone**. They follow behind him in a loose formation, carrying a red war banner, and chase you anywhere on the map, well past his usual courtyard leash.
- The charge turns back for the castle when you reach your lair, after about 90 s, or if he gets knocked out dizzy a second time. The guards then return to their posts.
- If you are already at your lair when he wakes up, he just walks home.
- **Princess rescue:** if you grab Princess Elizabeth and fly her out of the castle area while King William is **not** knocked out dizzy, he gathers his soldiers: **6 s** after you leave the castle with her (**7 s** on Easy), a banner reads **"King William rallies his soldiers to rescue the princess!"**. He comes out in his armour (wherever he was) with every surviving knight, archer and soldier near the castle (no new spawns; alone if none are left) and leads the charge after you. Reach your lair and they turn back; delivering her still wins the level and the ransom works as before. If he is knocked out dizzy when you grab her, there's no immediate chase, but he still leads the usual charge when he cools off (unless you've reached the lair).
- All of this resets each level. A save made during the charge loads with the king safely back home and his guards back at their posts.
## Every bite hurts
Your bite **always deals damage**. If the target can be eaten, it is swallowed as before. If it can't be swallowed yet (a bear, elephant or bull at high health, a pack leader or silverback, a wild dragon, a whale, a raid champion, a prince, the sandworm and so on), it still takes bite damage: a jaw-snap ring flashes on it and a red **-N** shows the damage. The bite never takes a tough target below 1 HP, so you wear it down and then swallow it. King William and Princess Elizabeth can't be bitten.

## Kingdom watchtowers
**Starting stock:** the kingdom starts with **100 wood and 20 stone** (it used to be 8 and 4). This applies to every new game **and to every new castle level**, because moving up a level rebuilds the kingdom from scratch. Loading a save restores whatever the kingdom had when you saved. The starting stock doesn't count toward watchtowers: they still need wood and stone *delivered by carts* during the level. It does let the villagers build carts and upgrade bridges to stone sooner.

**Starting stock grows with the castle level (item 125):** the kingdom's starting gold, wood and stone grow **10% per castle level, compounding** (×1.1 for each level after the first), applied when each new level begins. Level 1 is unchanged. The castle's 5 gold piles already started bigger each level (20 + 10 per level each); the 10% growth comes on top.

| Castle level | Multiplier | Treasury gold (before → now) | Wood (before → now) | Stone (before → now) |
|---|---|---|---|---|
| 1 | ×1 | 100 → 100 | 100 → 100 | 20 → 20 |
| 2 | ×1.1 | 150 → 165 | 100 → 110 | 20 → 22 |
| 3 | ×1.21 | 200 → 240 | 100 → 121 | 20 → 24 |
| 4 | ×1.331 | 250 → 335 | 100 → 133 | 20 → 27 |
| 5 | ×1.4641 | 300 → 440 | 100 → 146 | 20 → 29 |

**Surplus rule (newer):** towers are only paid for from **surplus**. A wooden archer tower needs the castle's wood to be above the wood it would take to rebuild the *whole* kingdom; a stone crossbow (scorpion) tower needs the stone stock to be above the stone it would take to rebuild the whole kingdom *in stone* (whether or not it has turned to stone yet). Only the amount above the reserve is spent. Once the kingdom is at its tower maximum, stone surplus turns standing archer towers into crossbow towers, one at a time. The older rules below still apply on top.

The kingdom builds two kinds of tower, but only after its worker carts have delivered a **big stockpile**. Nothing is built until **36 wood and stone in total** have been delivered to the storehouse during the current level. Undisturbed carts bring about 4–5 a minute, so the first tower goes up around **minute 8**, mid-game. Only cart-delivered material counts, not the starting stock or free resources. Each tower then spends a large cost from that delivered stock. The kingdom builds whichever type it has the materials for, and it picks the scorpion tower first when it can afford one.

- **Wooden archer tower**: 18 wood + 4 stone, about 14 s to build. An archer stands on top. It has medium health (170) and is **burnable**.
- **Stone scorpion tower**: unlocks from **castle level 3** and needs 50 delivered in total. It costs 6 wood + 22 stone and takes about 22 s to build. A ballista on top turns toward the dragon and fires **big, slow bolts** (one about every 4.6 s, range about 720 px, aimed ahead of you) that hit much harder than arrows. It has high health (560) and is **fireproof stone**: fire does nothing, so you need stomps, dive slams, bites, claw rakes or lava shots.

Placement starts beside the roads near the castle and moves outward (spaced about 650 px apart). The kingdom also builds guard posts at the edges of villages and **beside its worker buildings**: the lumber camp, the stone pile and mine, and the farm barns. Hunters' cabins only count when they are inside the kingdom. Towers are only built in the kingdom's own lands (farmlands, castle, south, lake, hills, coast, the East March and the Iron Crags). The maximum is 2 + the castle level.

When a tower is finished, a banner says **"The kingdom builds an Archer Tower!"** or **"The kingdom builds a Scorpion Tower!"**. The pause menu shows `Towers n/max (a archer · b scorpion)`. The tally counts **Archer towers** and **Scorpion towers** separately. A destroyed tower leaves rubble that still counts toward the maximum, and it is rebuilt as the same type once the stock is there again. Towers, with their type, are saved with the game.

## The lair arrow
A gold arrow circles the dragon and points home to the lair (see also *On-screen direction arrows* for the only other arrows), with the distance. It hides while the lair is on screen, glows while you carry the princess (not for gold, which goes home on its own), and stays clear of the HUD panels and touch buttons.

## Music and sound
All sound is generated in code with Web Audio; there are no audio files. **Every region has its own theme**, and themes crossfade over about 2 s as you cross a border:

| Region | Theme |
|---|---|
| Kingdom Farmlands, hills, lake, south | cheerful medieval (a night version after dark) |
| Castle Aldric (and near the gate) | regal fanfare |
| The Deepwood | mysterious |
| Scorching Sands | Arabian-style scale |
| Golden Savanna | drums |
| Emerald Jungle | marimba and percussion |
| Frostpeak Mountains and the Dragon Peaks | epic low horns |
| The sea, coast and islands | airy pads |
| Your lair / the volcano | dark rumble |

**Boss music** (a prince's army, the sandworm once it surfaces) overrides the region theme; the giant squid keeps its eerie theme. Battle drums play only when you have been hit recently with several foes close by, so tower and castle archers don't drown out the region music. The music is quiet, honours mute, and on iPhone it starts on your first tap. Sound effects (fire, chomps, stomps, crashes, splashes, coins, roars, arrows and more) are panned to where they happen and fade with distance. **N** mutes everything.

## Hunger (normal mode only)
- A drumstick meter in the HUD (under Stamina) slowly empties: about 80 s from full to empty on the ground, and about 60 s at the fastest (flying and breathing fire).
- Eating any person, animal or bird refills it; bigger meals refill more (a chicken about 11, a villager 22, a cow 57, a bear 88). Resting at the lair heals you but does **not** feed you.
- Below 25 the meter flashes orange ("Getting hungry…"). At zero you are **Starving!**: the meter pulses red, a warning appears on screen, and you lose 2.5 HP/s until you eat again. Starving to death ends the game.
- Easy mode has no hunger at all (the meter is hidden).
- Hunger drains 1.4× faster while you swim or fly over water (sea, lake or river).
- **At the lair** (anywhere inside the lair area) hunger drains at only **40%** of the normal rate.

## The sea
- East of the coast is a big open sea. Fly over it, or land on any water (sea, Mirror Lake, the Silver River) to **swim**: you move at about half speed, regain stamina more slowly, cannot stomp, and sit half-submerged with ripples. Biting (E) and fire still work.
- **Sea life:** fish schools (a small snack per bite; fire just makes them dive), sharks (circle and nip you for 3; +20 HP), whales (slow; their tail slaps for 4; too big to swallow until worn down below half health; +75 HP).
- **The GIANT SQUID** lurks in **The Kraken Deep** (far east), its lair now about 320 px further south than before but always at least 260 px inside the deep water, so it never comes near the shallows or the beach. It slams a tentacle where you are heading (dodge the red ring, 9 damage) or grabs you (3 HP/s; burn it to break free). Wear it down until it is **DAZED**, then eat it for +150 HP and +1500 points. It returns only after about 4 minutes.
- **Boats:** fishing boats, merchant ships (they flee and carry a little gold) and rowboats on the lake. Burn them, bite their hulls, or dive slam onto them. Sunk crews swim in the water and can be eaten.
- **Pirates:** cartoony skull-and-crossbones ships that circle you and shoot arrows from the archers on deck (2 each, plus a three-arrow volley every few seconds; no cannons), whether you are flying or swimming. They douse fires after a while, so keep burning! A sunk pirate ship leaves pirate swimmers and a floating gold chest (swoop low to collect it, then stash it at your lair).
- **The Lonely Lighthouse:** a rest-stop island just before the Kraken Deep, with a sweeping light beam and a map marker. Landing on it restores stamina fast and slowly heals you. The keeper and fishermen at the dock are edible and come back over time, and seals lounge on the rocks: they flop into the sea when you come near, are worth +24 HP, and respawn. Pirates rarely sail nearby.
- **Ocean and beach creatures:** moray eels lunge from reefs, narwhal pods roam the northern sea, stingrays lie in the shallows (step on one and its tail barb zaps you; it then glides away, and it zaps predators too), anglerfish lure small fish in the deep with a glowing lamp, sea turtles nest on the beach (hatchlings scurry to the sea), pond turtles plop into the lake, penguin colonies waddle on the shore, and a giant octopus (wear it down until it is dazed, then eat it for +20 max HP). Starfish and seashells dot the beaches; swoop low to pick up shells. All of them are cartoony, never raise the wanted level, and have Tally entries.

## Wildlife (spawns and respawns only in its home region; bigger animals heal more)
- **Farmland:** cows, pigs, sheep, chickens, horses (in paddocks), crows
- **Forest (the Deepwood and the Eastwood):** deer, rabbits, boars, foxes, wolves (packs that nip back), bears (fight back harder, big heal)
- **White alpha wolves:** every wolf pack has a bigger, white-furred alpha (40 HP and a 6-point bite (was 5) with a small shove, against a wolf's 14 HP and 2). Like the male lion, he guards the pack's woods turf: when he spots the dragon he HOWLS (visible rings and a howl sound) and every wolf that is hunting stops and joins the fight. They calm down after the dragon leaves. A pack that loses its leader gets a new one after a while. He has his own Tally line ("White alpha wolves") and is saved and loaded.
- **Lake/river:** ducks, geese, jumping fish, beavers
- **Mountains/cliffs:** mountain goats, eagles, hawks
- **Coast:** seagulls, crabs, seals
- **Hills/mines (and the Iron Crags):** goats
- **Snowy slopes north of the desert:** three herds of mountain goats that hop over rocks, and the mountain lions that hunt them

## The dragon's body
- **FIRE meter:** fire breath has its own red bar. It drains while you breathe fire and refills when you stop. If it runs dry, you have to catch your breath before it works again.
- **Max health grows (Monster feast):** eating the giant squid (kraken) or a sand worm gives **+50 permanent max health** each, plus a full heal and a *"Max health up! (+50)"* banner.
- **Glutton:** everything you eat adds food (about its size): villager 10, knight 18, mounted knight 40, chicken 5, sheep 14, goat 12, mountain goat 15, cow 26, camel 30, bear 40, fish bite 5, shark 20, **whale 75**, sand worm 100, kraken 150, and so on. Each *whale's worth* of food (75) fills a milestone for **+5 permanent max health** (*"A whale's worth eaten! Max health +5"*). The cost scales: the 1st +5 needs 1 whale's worth, the 2nd 2 more, the 3rd 3 more, and it never stops. The pause menu and the Tally show a *"Next +5: 47%"* progress bar.
- Both bonuses stay on the same life across castle levels, reset on death or a new game, and are kept in saves. The health bar grows with max health but is capped on screen, and always shows the number.
- **Claw scratch:** while swimming, the stomp button (Q / Shift, pad B, or touch, which reads SCRATCH) becomes a quick claw swipe that hits boats, sea creatures and the squid.
- **The hoard carries over:** your lair's gold pile and trophy banners stay when you move up a castle level. They reset only on a new game or when the dragon dies.

## Dragon's Tally, pause, save and load
- Press **P** or **Esc** to pause. The pause menu has the **Dragon's Tally**, a bestiary that counts everything you've gobbled or beaten this game and all-time, plus **Save** and **Load**.
- There are three save slots, stored in the browser. **The game only saves when you save it** (Pause → Save): there is no autosave any more (no timed save, no save on pause, level-up or closing the page). An *Old autosave* from an earlier version still shows in Load and still loads.

## Mounted knights
- Fast lance cavalry rides out of the castle gate. They charge in a straight line (the lance only hits a grounded dragon) and then wheel around for another pass.
- They are tougher than foot knights. Fire or a stomp dismounts the rider: the horse bolts and a foot knight is left behind.
- Horse and rider can be eaten for a big heal.
- They join waves from the archer tier, in bigger numbers later, and the wave banner lists them.

## Patrols
- Patrols roam the roads between villages, the castle and the camps, independent of the wanted meter. Each has a random mix of foot knights, archers and cavalry, plus a banner carrier.
- Later levels bring bigger, tougher patrols.
- **How many:** the castle keeps a target number of road patrols out: 3 at castle level 1, 4 at level 2, 5 from level 3 on (easy mode: 2 / 3 / 4), plus up to 2 more when the treasury is full. The first patrol rides out about 20 s into a level, more follow every 25 s (easy 40 s) until the target is reached, and a lost patrol is replaced within about 45 s (easy 70 s).
- The only limit is the number of soldiers on the map (170). Animals and villagers don't count, so a busy map full of wildlife still gets its patrols. Wanted-level waves are separate and unchanged.
- They attack if you come close, and attacking them raises the wanted meter.
- **Keeping the roads safe:** a patrol that meets a predator on the road, or sees one bothering a traveller nearby, shouts "Keep the road safe!" and chases it off (the animal fights back, then runs off), then carries on along its route. The dragon always comes first.
- **Worksite patrols:** a small squad (3 foot soldiers + 1 archer, with a banner) loops around each **lumber camp** and each **mine** (the Deepwood camp, the Stone Mine, the Eastwood camp and the Iron Crags mine). They defend against you and against predators, are fresh every level, and a lost squad is replaced about 60 s later. They don't count toward the road patrol cap.

## Bridges
- Wooden bridges carry the roads over the Silver River. Burn one and it collapses into charred posts.
- Ground units, cavalry, patrols and siege engines can't cross a broken bridge. They detour to another bridge, or around the lake if every bridge is out.
- Villagers rebuild bridges in wood first. From level 3, with enough stone, they rebuild or upgrade them in stone. A progress bar shows the build.
- Stone bridges are fireproof but can be wrecked by repeated stomps (about 5) or heavy dive slams (about 4).

### Dragon fire on stone (item 124)
Dragon fire still hurts stone buildings directly, at **about half its wood damage**, but stone **never catches fire and never keeps burning**. Wood is unchanged: fire breath does 42 damage a second to a wooden building, sets it alight, and it burns on at 9 a second until villagers put it out or it collapses.

| Target | Before | Now |
|---|---|---|
| Wooden buildings | 42/s, catches fire, burns on at 9/s | unchanged |
| Castle stone (walls, towers, keep, princess tower, lighthouse) | 3.6/s, never below 35% health | **21/s**, still never below 35% from fire alone (stomps, dive slams, lava and the claw finish it); no burning |
| Stone-upgraded town buildings | 16.8/s, 50% chance to catch fire, then burned on at 3.6/s | **21/s**, never catch fire |
| Fantasy-realm stone (elven castle, dwarf hall/forge/mine/Ironhold Gate, cyclops cave) | 30/s, like wooden realm buildings | **15/s** (wooden realm buildings stay 30/s) |

Unchanged: the keep roof (it barely notices fire), wells and fountains (fireproof), stone bridges (fireproof), the Jungle Temple (fire-proof).
- Each wrecked bridge is worth +80.

## Graphics (High / Low)

Pick it in **Settings** (title screen or pause menu): LOW, MEDIUM or HIGH. **G** on the title screen still toggles Low/High. The setting is saved in the browser (`localStorage` keys `dr_gfxq`, `dr_gfx`). High is the default on desktop, Low on a first touch visit. MEDIUM is High at a lower resolution.

**High** ("cartoon realism"). All art is drawn in code, with no image files. Static art is cached in offscreen canvases.
- Dragon: gradient-shaded body with a scale pattern, belly plates, back ridge spikes, veined and scalloped wings, horns, glowing eyes and claws. It casts a soft shadow that shrinks and fades the higher it flies, and a wavy reflection over water.
- Terrain: textured grass tufts, pebbles, path grit, sand ripples and snow sparkle, baked once per 512 px chunk.
- Water: two moving caustic layers, breathing shore foam and sun glints.
- Trees: layered, shaded canopies that sway in the wind, with pines in the deep forest.
- Buildings: 2.5D houses, barns, barracks and cabins with lit and shaded roof slopes, chimney smoke and windows that glow at night. The castle has brick walls, round towers with cone roofs and flags, and glittering gold piles. Buildings lean slightly with the camera, for parallax.
- People have hair, eyes, rosy cheeks, belts and arms. Animals have fur, manes, spots and wool.
- Fire: additive flames, drifting embers, heat shimmer, an orange glow on the ground around fires and tall smoke plumes.
- Day and night: a full cycle every 5 minutes, with dusk tint, night darkness, warm light pools around fires, windows, torches and the lair, and the Lonely Lighthouse's rotating beam. Also a vignette and fire bloom.

**Low** keeps the original flat look. It has no day/night cycle and is the fastest choice for old machines.

## Mini bosses come back each castle level

Every mini boss returns at the start of each new castle level, even if you beat or ate it on the level before. A small banner names them: *"👹 New castle level: the mini bosses are back (Hydra, Griffin, Nessie, Sand worm)"*.
- **Now come back (used to stay beaten for the whole game):** the Hydra, the Griffin, Nessie and the Sand worm.
- **Already came back each level:** the Kraken (giant squid), the giant octopus, Cerberus, the wild dragons of the Dragon Peaks, and the turf alphas (male lions, white alpha wolves, silverbacks, alpha hippos, white alpha trolls, alpha centaurs).
- **The two wizards come back too (queue 140):** the **Storm Wizard** and the **Dark Wizard** return each level with a full shield (*"🧙 The Storm Wizard and the Dark Wizard are back! Your rewards are kept"*). Their rewards (the open barrier, the Cinder Isle volcano and the purple triple lava shot) stay yours until your dragon is defeated.
- Rewards and progress are kept: win counters, Tally lines, earned achievements and the bosses' extra-health growth all carry on.

## Mini bosses grow with the castle level
The king's castle gets about **+31% gate health per level** (260 + 80 a level). Mini bosses, the two fantasy citadels and your guardian dragons grow about **half as fast**, and they **keep growing at every level with no upper cap**:
- **Health: +15% per castle level** (×1.15 at level 2, ×1.30 at 3, ×1.60 at 5, ×2.05 at 8, ×2.35 at 10, ×2.8 at 13, ×3.85 at 20, ×4.0 at 21).
- **Damage to the dragon: +6% per castle level** (×1.06 at level 2, ×1.12 at 3, ×1.24 at 5, ×1.42 at 8, ×1.54 at 10, ×1.72 at 13, ×2.14 at 20, ×2.2 at 21).
- **Who scales:** the giant squid (Kraken), the giant octopus, the sand worm, Nessie, the Hydra (each of its 3 heads), the Griffin, Cerberus, and every other dragon (wild and rival dragons). The Lumenspire (light) and Doomforge (dark) citadel towers and the realm's other magic ice and lightning towers scale the same way.
- **Level 1 health:** squid 700, octopus 220, sand worm 270, Nessie 800, Hydra head 85, Griffin 420, Cerberus 90, wild dragon 110, ice tower 70, lightning tower 80.
- **Raid balance holds at any level:** raid champions and your guardians both grow ×1.15 health per level, so one guardian still beats raids up to Tier 5 and two guardians up to Tier 8 at high castle levels too (checked at levels 12 and 20).
- **Never scales:** the Storm Wizard (shield 300 at every level, lower on easy).
- **Regular units don't scale:** soldiers, villagers, realm creatures (orcs, elves, trolls and the rest, including pack alphas) keep the same health at every level.

## Small bottom alerts (permanent boosts and the whale alert)
Permanent boosts (max-health feasts such as *"Max health up! (+50)"*, mini-boss rewards, nest-egg fire, wild-dragon stamina, the Glutton *"A whale's worth eaten! Max health +5"* and similar) now show as a **small dark-teal strip with a gold edge near the bottom of the screen** (above the hint line on desktop, left of the FIRE/BITE buttons on phones), instead of the big centre-top announcement. It looks clearly different from event announcements (raids, battles, bosses), which keep the big banner at the top. Gameplay is unchanged: the gluttony, whale and food rules are exactly as before. If a big announcement is on screen where the pill would touch it (some phone-landscape sizes), the pill waits and shows right after, so nothing overlaps in portrait, landscape or Flip layouts.

## Lair guardians
- **Gold is safe while any guardian stands.** Raiders can't take lair gold while at least one guardian is up (not dizzy). With no guardians, or with both dizzy, a raid grabs the gold as before.
- **They meet every raid.** Guardians leave their circle to meet any raid near the lair at every tier, breathe on it and slow it down.
- **Stats (castle level 1, ×1.15 per level, like the raid champion):**
  - 600 health each.
  - Breath of about 30 damage a second.
  - White: ice that hits 60% to raiders within 80 px and slows them for 2.5 s.
  - Black: lightning that chains to 2 more raiders at 65%.
- **Raider gear vs guardians:** bigger raids bring dragon-hunting gear. Their blows on a guardian (never on your dragon) are multiplied by tier:
  - Tiers 1–5: ×1 to ×1.6.
  - Tiers 6–8 (nets and long spears): ×2.8 to ×3.2.
  - Tier 9 and up (the King's dragonslayer kit): ×8.5 and more.
- **After a fight:**
  - A guardian worn to zero is dizzy, not gone.
  - After 4 s of calm it wakes at 30%.
  - Both heal to full in about 8 s.
- **Simulated win rates** (raid alone vs guardians, dragon away; 10 runs per tier):

| Raid tier (lair gold) | 1 guardian | 2 guardians |
|---|---|---|
| 1–5 (100–2,999) | 10/10 win | 10/10 win |
| 6–8 (3,000–5,999) | 0/10 (raid wins) | 10/10 win |
| 9–12 (6,000+) | 0/10 | 0/10 (raid wins) |

- **Time bought when they lose:** with no guardians a raid reaches the gold about 23 s after it starts marching. When the guardians lose, the grab takes about:
  - 1 guardian: 39–49 s (+16–26 s).
  - 2 guardians: 39–43 s (+16–20 s).

  That is plenty of time to fly home and help.

## Raid gold and map-wide raid alerts
- A beaten raid gives back the gold its knights stole (the stolen sacks), with no lump-sum bonus. Each fallen knight also drops its own purse on the ground (see *Raid knights drop gold*).
- Every raid announcement shows wherever your dragon is on the map, unlike regional news such as the north battle or trade ships, which only show nearby: *rides for your hoard*, *has stolen N gold*, *Raid defeated*, *escaped*.
- A raid announcement keeps the screen for at least 2.6 s. Any other banner that arrives meanwhile shows right after it.

## Raid knights drop gold
- **Every raiding knight carries a purse** and drops it as a gold sack on the ground when it is defeated, whether your dragon or your guardian dragons beat it. Purse size grows with the raid tier: spear knights and archers carry **5 + 5×tier** gold, the champion **20 + 10×tier**:

| Raid tier | Spear knight / archer | Champion |
|---|---|---|
| 1 | 10 | 30 |
| 3 | 20 | 50 |
| 5 | 30 | 70 |
| 8 | 45 | 100 |
| 12 | 65 | 140 |

- **Only your dragon can collect it.** Fly low or land within reach of a sack to add it to your hoard (*"+N raid gold → hoard"*). Guardians don't pick it up, and flying high over a sack doesn't collect it.
- **Uncollected gold is up for grabs.** Knights of a later raid that pass close to a sack on their way scoop it up (*"… scoops up N gold!"*) and carry it on their belt. Defeat that knight and it drops its purse plus everything it scooped up.
- Sacks that land close together merge into one bigger sack, labelled with its amount, and show as gold dots on the map. **Escaped gold goes to King William (queue 135).** If the champion reaches the castle gate, his stolen sacks and his purse go into the king's treasury, and every raiding knight who escapes home pays its purse in too, with a small *"👑 +N gold to the king's treasury"* alert (a richer king fields bigger waves). Stop the champion first and the stolen lair gold still goes straight back to your lair as before. Guardian dragon rules are unchanged.
- Sacks on the ground are kept in saves and cleared by a new game.

## Alpha hippos at the watering holes
Each of the two savanna watering holes has its own **alpha hippo**: a big lilac-grey hippo, a quarter bigger than the others, with pale scars across its back. Each pool also has a **regular hippo** (grey-brown, smaller) that wallows peacefully beside the alpha. It spends its time half-submerged in the middle of the pool, blowing ripples and giving the odd lazy yawn.
- **It guards its pool.** If your dragon comes close **on the ground or flying low** (within about 200 px of the water's edge), it surfaces with a big yawn (*"HRRUMPH! The alpha hippo guards its watering hole!"*) and charges, chomping you for **7 damage every 2 s** (*"Hippo CHOMP!"*).
- **It's a homebody.** It never chases you more than about 300 px from its pool. When you leave or fly high, it grumbles and wades back into the water.
- **Hippos and crocodiles ignore each other.** The crocodile in the pool never hunts the hippo, and the hippo never fights the crocodile; they share the water peacefully.
- **Too big to swallow at first.** While it has more than 60% of its health, a bite just makes it grumpy (*"Too big! Wear the alpha hippo down below 60% first"*) and costs it 10 HP. Wear it down with fire or bites; dizzy stars show when it's ready, and then you can gulp it.
- **Reward:** beating or eating it gives **+250 points**. Eating it is a big meal (**70 food, 50 health**). After about **2 minutes**, once your dragon is well away, a new alpha wades into that pool.

| Stat | Alpha hippo |
|---|---|
| Health | 150 (doesn't grow with the castle level, like other wild animals) |
| Bite | 8.4 every 2 s (was 7; Easy mode lowers it, as with all damage) |
| Charge speed | 88 (wading home: 40) |
| Notices you | within ~200 px of the water, on the ground or flying low |
| Leash | ~300 px from its pool |
| Can be swallowed | below 60% health (90 HP) |
| Reward | +250 points; 70 food / 50 health when eaten |
| Comes back | ~2 min later |


## The white alpha elephant and his herd (item 129)
A big **white alpha elephant** (pale white hide with pink mottling on the ears and trunk, and long curved ivory tusks) now patrols the savanna with **his herd of 4 elephants**. He walks a **random route of random waypoints** (a new spot 500 to 2,400 px away each time he arrives, never into a watering hole) and his herd follows behind him in a file.
- **He calls his herd.** Attack him or any elephant in his herd and he trumpets (*"PAWOOOOO!"*), and the whole herd comes running to protect him (the herd gets the alpha rally bonus: ×1.12 damage).
- **Elephants fight back (gently).** Any savanna elephant you hurt now pushes back for about 8 s while you are on the ground nearby: *Trunk swat!* (5), *Tusk shove!* (5, pushes you back) and *Ground stomp!* (6, shakes the screen). Flying high keeps you safe.
- **Alpha rules, like the other alphas:** he shrugs off bites while he has more than half his health (each bite still costs him 15%), shows dizzy stars below half, and then you can gulp him. Beating or eating him gives **+300 points**; eating him is a feast (90 food, 60 health). His stats grow with the castle level like the mini bosses, and his bite includes the +20% alpha bonus (item 119).
- **He comes back:** a new white alpha takes over the herd about 60 s after you fly away, and if the whole herd is gone, a new herd arrives about 2 minutes later once you've left the savanna. The herd is not saved; loading a save brings in a fresh one.
- **Achievement:** *Herd Guardian*, first defeat (🎁 *+300 points · gulp him for +60 health*).

| Castle level | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| White alpha health | 180 | 207 | 234 | 261 | 288 |
| White alpha bite (every 1.6 s, 110 knockback) | 8.4 | 8.9 | 9.41 | 9.91 | 10.42 |

Herd elephants: 60 health, bite 5 (5.6 rallied). Before this change an elephant only swatted you (5) if you stood within about 75 px of it on the ground; now a hurt elephant comes after you (up to about 700 px, for about 8 s) with all three moves.

![The white alpha elephant's herd charges the dragon](screenshots/311_elephant_herd_fight.png)

## Savanna animal sizes (items 131 and 132)
Elephants and giraffes now really look (and hit) like the giants of the savanna. Measured drawn size (width × height in pixels, at normal zoom):

| Animal | Before | Now | Hitbox |
|---|---|---|---|
| Elephant | 56 × 37 | **137 × 87** (×2.4), the biggest land animal | +34 px body radius |
| White alpha elephant | (new) | **171 × 122** (×3.0) | +42.5 px |
| Giraffe | 43 × 65 | **85 × 124** (×1.9), the tallest | +22 px |
| Hippo | 101 × 64 | unchanged | unchanged (centre point) |
| Lion | 42 × 24 | **57 × 33** (×1.35; male leaders still ×1.22 on top) | +5 px |

Bites, flames and stomps now reach a big animal's body, not just its centre point, so a bigger animal is easier to hit. Zebras (39 × 30) and the other animals are unchanged.

![Size comparison: lion, hippo, giraffe, elephant and the white alpha elephant](screenshots/312_savanna_sizes.png)

## Natural animals (queue 133 and 134)

Real animals no longer wear clothes or accessories. Alphas stand out by **size, colour and natural markings** instead:

| Animal | Removed | Now marked by |
|---|---|---|
| White alpha elephant | red-and-gold blanket, gold crest, red gem | white hide, pink mottling, long ivory tusks, ×3 size |
| Alpha hippos | gold crown | lilac colour, ×1.25 size, pale back scars |
| Bull | gold nose ring | (none needed) |
| Cavalry horses | saddle cloth | (none needed) |
| Prince's horse | caparison with crest, head plume | (none needed) |
| Desert camel-rider camels | red-and-gold saddle blanket, tassels | (none needed) |
| Rich caravan camels | striped blankets, tassels, bell, bridle | (none needed) |

Lions, wolves, gorillas, giraffes, crocodiles, meerkats, goats, birds, whales and the other sea creatures already had none. Loads (cargo bags, the treasure chest, cart traces) stay, and humans and fantasy creatures keep their outfits.

Each savanna watering hole now also has a **regular hippo** next to its alpha: 2 hippos per pond, 4 in total (before: 1 alpha per pond, 2 in total). Regular hippos are peaceful, wallow and drift in the water, dive away with a *SPLOOSH* when burned or hurt, stay inside their pond, and come back about 120 s after being eaten if the dragon is far away. They are not on the crocodiles' menu.

| Before | After |
|---|---|
| ![Savanna animals before](screenshots/313_savanna_animals_before.png) | ![Savanna animals after](screenshots/314_savanna_animals_after.png) |

![A savanna pond with its alpha hippo and a regular hippo](screenshots/315_savanna_pond_hippos.png)

## Castles on the maps (queue 137)

Castles are now drawn as proper castle icons (two towers, a keep with battlements, a gate and a waving pennant on a soft halo) on both the minimap and the big **M** map, instead of small squares. They are about 13 px on the minimap and 26 px on the big map, and the two forts are drawn at three quarters of that size.

| Castle | Colour |
|---|---|
| Lumenspire Citadel | light (white and blue) |
| Doomforge Citadel | dark (black and ember orange) |
| Castle Aldric (King William) | warm stone and gold |
| Ironhold Gate (fort) | light |
| Gorgrim War-Fort (fort) | dark |

The dragon dot and the princess marker are still drawn on top of the icons. Forts only show once you have uncovered them.

![Minimap before and after](screenshots/316_map_castles_minimap.png)
![Big map after](screenshots/317_map_castles_bigmap.png)
![Big map before](screenshots/318_map_castles_bigmap_before.png)

## Attack balance (queue 138)
Each attack now has its own job. Dive is unchanged. Stomp is a building-breaker. Bite is the best close-range move against creatures. Direct fire is the weakest hit, but things that catch fire keep burning, and ships burn hardest. Stone never catches fire.

| Target | Attack | Before 138 | After 138 | Now (145/145a/145b) |
|---|---|---|---|---|
| Soldiers / animals | Bite | swallowed whole | swallowed whole | 50 damage; anything at 50 health or less is eaten in that bite |
| Soldiers / animals | Stomp | 60 | 18 | **30** |
| Soldiers / animals | Dive | 96 | 96 | 96 (unchanged) |
| Soldiers / animals | Direct fire | 60 per second | 15 per second | 15 per second |
| Soldiers / animals | Burning afterwards | 10/s for 1.4 s (14) | 16/s for 3 s (48) | 16/s for 3 s (48) |
| Shielded champion | Bite / Stomp / Dive | 14.4 / 48 / 76.8 | 19.2 / 14.4 / 76.8 | **40 / 24** / 76.8 (his shield takes 20% off the 50 bite and 30 stomp) |
| Bosses (griffin, hydra, Nessie) | Stomp / Fire | 30 / 30 per second | 9 / 7.5 per second | **15** / 7.5 per second (bite unchanged at 18) |
| Wooden buildings | Stomp | 120 | 150 | 150 |
| Wooden buildings | Bite | none | none | **30** |
| Wooden buildings | Dive | smashed flat | smashed flat | smashed flat |
| Wooden buildings | Direct fire / Burning | 42/s / 9/s | 21/s / 13.5/s | 21/s / 13.5/s |
| Stone buildings | Stomp | 96 | 120 | 120 |
| Stone buildings | Bite | none | none | **25** |
| Stone buildings | Dive | 263.6 | 263.6 | 263.6 |
| Stone buildings | Fire | 21/s, never ignites | 21/s, never ignites | 21/s, never ignites |
| Realm turrets | Stomp / Bite | 45 / 32 | 56 / 32 | 56 / **25** |
| Ships | Bite / Dive | 18 / 80 | 18 / 80 | 18 / 80 |
| Ships | Direct fire | 30 per second | 15 per second | 15 per second |
| Ships | Burning | 6 per second | 18 per second | 18 per second |
| Siege engines | Stomp / Fire / Burning | 78 / 30/s / 18/s | 23.4 / 15/s / 22.5/s | **39** / 15/s / 22.5/s |

All of these are base numbers. Each repeat wizard win (queue 146) adds +2.5% to every one of the dragon's attacks.

## King William is weaker in normal mode (queue 144a)
In normal mode King William starts with **half the health** and **25% less attack** (sword and shield-bash), and he still grows with the castle level. Easy mode applies its own discount on top of this. A hard-mode hook (`KW144.full()`) keeps him at full strength; hard mode itself is not built yet.

| Castle level | Health before -> now | Sword before -> now | Shield bash before -> now |
|---|---|---|---|
| 1 | 600 -> 300 | 10 -> 8 | 9 -> 7 |
| 3 | 800 -> 400 | 13 -> 10 | 11 -> 8 |
| 5 | 1000 -> 500 | 16 -> 12 | 13 -> 10 |
| 10 (cap) | 1500 -> 750 | 22 -> 17 | 18 -> 14 |

## Bite and stomp (queue 145, 145a, 145b; normal mode)
- **Bite = 50 damage.** A soldier, villager, crew member, archer, knight, hunter or animal at **50 health or less is eaten in that bite**. Above 50, the bite takes 50 off (it never kills outright), and the next bite eats him once he is at 50 or less. A 51-health knight is left at 1.
- **Never eaten:** King William (CLANG, and his dizzy bite still does 40), Princess Elizabeth and the guardian dragons.
- **Alphas, champions, the prince, bears and wild dragons** keep their own "wear him down first" line (for example 50% for alphas). Every bite that doesn't eat them now does 50, never below 1 health, and once they are under their line they are eaten whole, even when that is above 50 health.
- **Bosses** (griffin, hydra, Nessie, the wizards) keep their own bite damage (18 / 14). Ships still take 18 from a bite.
- **Buildings (145a):** a ground bite on a building in front of the mouth does **30 to wooden** buildings and **25 to stone** ones (realm turrets 25 too), with a "CRUNCH!" pop.
- **Stomp (145b):** **30** area damage to soldiers and animals (it was 18). Building stomp stays at 150 on wood and 120 on stone. The same change lifts champion stomp to 24, boss stomp to 15 and siege stomp to 39. Dive is unchanged.
- **Hard-mode hooks:** `BT145.on()` (hard mode can bring back "eat whole"), `BT145.mustHurtFirst` for rule 139b ("damage a fighter before you can eat it"). Hard mode (queue 139) uses `BT145.mustHurtFirst`.

## Permanent attack boost from repeat wizard wins (queue 146)
- The **first** time you beat a wizard in a game you get his normal reward. **Every later win** over a wizard you have already beaten in that game (Storm or Dark, since they come back every castle level) gives **+2.5% attack** to every dragon attack: bite, stomp, dive, claw scratch, fire breath and burning, and lava.
- The boosts **add up**: +2.5% for each repeat win, so 4 repeat wins = +10%.
- **Permanent:** it stays through castle levels **and** after you lose your dragon, because a new game keeps it. It is stored in the browser (like achievements) and written into every save. Loading a save keeps whichever count is bigger.
- A small bottom pill shows "⚔️ Attack up! +2.5%" with your new total.
- The eat line stays at 50 health, and a bite meant to leave a target alive still leaves it alive.

## Tax collectors ride horses (queue 147)
- Every tax collector now rides a brown horse with a purple saddle cloth. His coin sack hangs as a saddlebag.
- He rides **twice as fast** as he used to walk (96 on his route, 140 when fleeing). When soldiers escort him, he slows to their walking pace so they can keep up.
- **Like a mounted knight:** fire, or a stomp he survives, throws him off. The horse bolts away as a free horse, and he carries on on foot at the old speed. A bite simply gobbles horse and rider.

Screenshots: `screenshots/321_tax_collector_horse_147.png` and `321_tax_collector_horse_147_zoom.png` (rider next to a collector who was thrown off).

## Tax collectors: bolting, regions and caps (queue 147a-147e)
- A tax collector on horseback who sees the dragon (within 450 px) gives up the rest of his route and gallops straight home to the castle at 140 px/s ("The dragon! Back to the castle!"). He still delivers whatever is in his sack.
- The escort call is unchanged: 2 / 3 / 4 guards at 25 / 40 / 60 coins, borrowed from a patrol he passes within 200 px.
- Up to 4 collectors ride at once (it was 2). While the castle gate is broken, the cap is 2 (it was 1). The spawn timer is unchanged: 40 s, or 55 s in easy mode.
- Each collector covers one region, and each region has at most one collector:

| Region | Where | Tax stops |
|---|---|---|
| East | x >= 3700 | Stonebrook, Saltmere, Crabhaven and their markets, the Eastwood hunters' cabin, the east mine and the east lumber camp |
| North | y < 2200 | the five northern villages, the north mine and the north lumber camp |
| South | the rest | Millbrook, Riverbend, Southwold, Haybury, the Castle Market and the Millbrook and Riverbend markets |
| Desert | x < 0 | Sandhaven, the Sandhaven Bazaar, and the Deepwood north and Deepwood south hunters' cabins |

- A route covers ONE area per trip, the richest in his region (see queue 147j below).
- When choosing a region, the richest uncovered region goes first (by the gold waiting to be taxed). With the gate broken, only the two richest uncovered regions get a collector.
- The desert has no hunter camps of its own. The two Deepwood hunters' cabins on the western road to the desert are the "hunters" on the desert route.

## Tax collectors carry every coin home, richest area first (queue 147f, 147g, 147h)

- **Carried home (147f):** a collector's gold only reaches King William's treasury when he walks into the castle. Nothing is credited when he collects. If he is caught or eaten on the road, the treasury gets nothing and his whole sack goes to your lair.
- **No carry cap (147g):** the old 30-coin limit per stop is gone. At each stop he takes every taxable coin (houses still keep 1 coin, and shops, market stalls and working sites keep 3). In the test he left Riverbend with 589 gold in one sack and delivered all 589.
- **Richest area first (147h):** the stops in his region are grouped into areas: a village, a market, or a cluster of working sites within 700 px of each other. Areas are ranked by the total taxes they hold. He goes to the richest area first, collects from every building there, then moves on to the next-richest area, up to 4 areas per trip.


## Tax collectors: hat, always mounted, one area per trip, escorts hold the line (queue 147i, 147j, 147k)
- **Hat on his head (147i):** the tall tax-man hat now sits on the collector's head, both mounted and on foot. Before, it floated above the rider.
- **Always mounted (147i):** every collector spawns on horseback. Fire or a stomp still throws him off ("Whoa! My horse!"), but after 2 seconds he catches his horse and climbs back on ("Back in the saddle!"). The loose horse is removed when he remounts. Loading a save always restores collectors mounted, including old saves that stored one on foot.
- **One area per trip (147j):** he collects every building in the richest area of his region (a village, a market, or a cluster of working sites), rides back to the castle and delivers, then re-ranks the areas by their live stored taxes and rides out to the richest one. The area he just emptied is skipped while any other area has gold. When nothing is left anywhere in his region, he retires. There is still one collector per region. Saves keep his current area.
- **Escort holds the line (147k):** when a collector bolts for the castle on seeing the dragon, the soldiers he borrowed from patrols stay behind and fight ("Hold the line! The taxes must get through!"). Once the dragon has been more than 700 px away for 3 seconds, they rejoin their patrol. A soldier whose patrol is gone returns to the castle. The guards who leave the castle with him are unchanged.
## Earning tiers for hidden gold (queue 148, 148a, 148b)
| Tier | Buildings | Rate | Cap | Always left behind |
|---|---|---|---|---|
| Working (most) | smithies, bakeries, lumber camps (sawmill), mines (minehead), hunters' cabins, farms (barns) | 4x (0.16 gold/s) | 60 | 3 |
| Markets | stalls, fishmongers, jewellers | 2.5x (0.10 gold/s) | 40 | 3 |
| Houses (least) | huts and Sandhaven adobe houses | 1x (0.04 gold/s) | 15 | 1 |

- Barns pay at their village's stop. Smithies and bakeries pay at their market's stop.
- Lumber camps, mines and hunters' cabins outside any village are now tax stops of their own.
- The map has no separate mills, workshops or quarries. The sawmill is the lumber camp, and the mine is also the stone quarry. Wrecking any of these drops its stored gold on the lair pile, as before.

## Ship speeds (queue 149)
Trade (merchant) ships are now the slowest ships of all.

| Ship | Cruise speed (px/s) | Notes |
|---|---|---|
| Trade / merchant ship | 48 -> **36** | flees at 1.25x = 45 |
| Rowboat (small lake/river boat) | 40 | unchanged |
| Fishing boat | 55 | flees at 1.25x |
| King's trade/treasure ship (the quay order) | 58 | |
| Royal escort warship | 66 | |
| Pirate ship | 68 | 78 when attacking |
| Prince fleet warship | 72 x 0.92-1.02 = 66-73 | |
| Viking warship (queue 141y) | 72 x 1.1 = **79.2** | 10% faster than the warship; can sail up the river |
| Viking longship (queue 141j/141y) | 60 (ferry) | only for crossing water during a chase |

Only Viking ships go up the Silver River (141t). The small river rowboats stay as they were; trade ships, the treasure ship, prince fleets and pirates all stay on the sea.

## Viking mercenaries (queue 141-141z, every mode)
King William hires Viking mercenaries with his tax money.

**Hiring.** Every **1,000 gold** the king collects (a running income total, not his balance), he hires one Viking warship for **50 gold** from his treasury. In hard mode it is every **500 gold** for **25 gold** (this setting sits behind the hard-mode hook). Ships stack. If he cannot pay, the hire waits until he can. The alert "⚔️ King William hired Viking mercenaries!" appears only while the dragon is south of the wind wall; north of it the hire happens quietly.

**One warship crew (18 Vikings)**
| Viking | Health | Attack | Notes |
|---|---|---|---|
| Shield warrior x10 | 66 (desert soldier 53, +25%) | 8.75 per axe hit every 1.35 s (desert 7) | round shield; forms the shield wall |
| Axe thrower x5 | 60 (desert archer 48, +25%) | 8.75 per thrown axe every 1.6-2.2 s | stays behind the wall |
| Berserker x2 | 66 | 8.75 per hit every 0.68 s (two axes) | no shirt; charges straight at the dragon |
| War chief on a bear x1 | chief 113 + bear 113 (camel rider 90, +25%) | double-sided axe 13.1, plus thrown axes 8.75; the bear bites too | the bear takes the hits first and then vanishes in a puff, and the chief fights on foot |

**Shields (they never block everything).** While the wall holds (3 or more warriors in position, marching at the dragon), a shield warrior takes **50%** of a hit from the front (within about 75 degrees). The chief on foot blocks **35%** from the front with his giant round shield. Burn damage over time is never blocked.

**Where they go**
- Warships arrive from the south sea edge and sail **up the Silver River** to Mirror Lake by the castle.
- **Crews 1-5** wait aboard at the lake.
- **Crews 6-8** patrol the lake.
- **Crew 9 and up** spread out across nine posts on the eastern and southern sea.

**What they do**
- **Castle attacked:** they land and defend it. They go back aboard 20 s after the last hit.
- **Wanted level reaches Militia:** they land and chase the dragon anywhere on the non-fantasy lands until wanted drops back to 0, then return to their ships. They never enter the fantasy lands.
- **Water in the way:** a **longship** appears at the shore, ferries them across and disappears in a puff when they land. This works on any river, lake or sea, but not on wells or fountains.

**Ships shoot arrows** at the dragon:
| Ship | Arrows per second | Range |
|---|---|---|
| Viking warship | about 3.3 (2 every 1-1.4 s, plus a 5-arrow volley every 2.5-3.5 s) | 560 / 660 |
| Viking longship | about 2.6 (2 every 1.2-1.6 s, plus a 4-arrow volley every 3-4 s) | 520 / 620 |
| Pirate ship (for comparison) | about 1.9 | 520 / 620 |

Vikings and pirates ignore each other. Viking ships take **10% less direct fire damage**; burning damage is the same as on any other ship.

**Sinking and rebuilding**
1. When a Viking ship sinks, the crew swims slowly to the nearest land (22 px/s). Swimmers cannot fight back and can be eaten.
2. On land, and when not fighting, up to three of them walk to **real trees**, chop them down (the trees fall and are gone), and carry **3 logs** back to the shore.
3. Then they build: **15 s**, or **10 s** if the war chief is alive, with a progress bar.
4. The new ship launches and they go back to their job.

**Trade escort.** When a royal trade ship sails in, up to two patrolling Viking warships within 3,200 px sail alongside it. At the quay the crew lands and walks with the king's carts to the castle, then goes back to its patrol post.

**Save and load:** Viking crews are saved. On loading, each crew is back aboard its ship at its post.

### Viking ships keep clear of sea bosses and fantasy waters (queue 141aa, 141ab)
- **141aa:** Viking warships and longships give the giant squid, the giant octopus, the Kraken Deep and Wizard's Isle a wide berth. Routes bend around them, the Vikings don't chase the dragon into a boss circle, and they won't escort a trade ship that sails next to one. In tests the closest a warship got to a squid it was sent straight at was 900 px.
- **Fix (with queue 139):** a Viking ship whose route runs into a sea monster's circle now slides around the edge of the circle toward its next waypoint instead of turning in place. Before, it could stay stuck until the monster moved away. With an octopus parked on the route at 8 different spots, ships reached their berth in 5 to 6 of them per run (before the fix: 0 of 7). In the rest the octopus sat by the river mouth, so the ship waits outside the circle until the monster moves. It never enters the circle.
- **141ab:** Viking ships never sail into fantasy waters (the Northern Realms sea past the wizard's barrier). If the dragon flies over fantasy water they wait at the edge. Over three runs of 20 seconds each aimed straight at it, no Viking ship spent a single frame inside.

## Tax collectors already out at the start of each level (queue 147l)
At the start of every level (a new game and every level-up), the tax collectors are already working. One mounted collector rides out per region that has taxable gold, up to the region cap (4, or 2 once the gate is broken). Each starts 40% of the way along his route to his first area, with his escort beside him, instead of at the gate. Loading a save restores the collectors that were saved and never adds extra ones. In tests a new game started with 4 collectors in 4 regions, between 142 and 3076 px from the gate.

## Tax escorts restart their own patrol (queue 147m, 147m-fix)
When a tax man borrows soldiers from a road patrol, the patrol's route is written down: its waypoint, or its site loop and loop position, plus its colours. If that patrol is wiped out while they are away, the released soldiers rebuild it on exactly that route instead of retreating to the castle ("Back on our patrol!"). If another patrol is still walking the same site loop, they join it. They only retreat if the patrol had no route at all. The saved route is also kept in save files.

## Castle tops up its patrols (queue 151, 151-fix)
Every **60 seconds**, if the castle is **not under attack**, every road patrol that isn't fighting and is below its original size gets fresh soldiers from the castle gate. The castle counts as under attack if one of its buildings was hit in the last 20 seconds, the dragon is within 1200 px of the gate, or the militia is out. When that happens the pass is skipped.
- Replacements are the same types that were lost: foot soldiers, knights, mounted knights or archers, with the patrol's original hit points and colours. Hard-mode extra troops count too.
- Soldiers lent to a tax man, or already on their way, count as present, so a patrol is never over-filled.
- New soldiers ride out (72 px/s on foot, 95 mounted) and fall into the column when they reach it.
- Never more than **170** soldiers in total. Completely missing patrols still use the existing replacement timer (45 s, or 25 s refill).
- **Silent (151-fix):** no banner, float text, alert or sound.

## No wave announcements (queue 152)
When a wave of troops rides out, nothing is announced any more: the WANTED bar already shows the threat. The troops are exactly the same. Removed:
- The banner **"The foot soldiers are coming!" / "The knights are coming!"**, and **"Reinforcements! ..."** for top-up waves.
- Its sub-line **"Wave N: 3 foot soldiers, 1 knight ... · riding out of the castle gate"** (or "trickling out through the rubble").
- The first-time troop tips that rode along with it ("Scorpions roll out of the castle!", "Catapults! Dodge the warning circles", "Mounted knights charge in straight lines", "Archers can hit you even in the air!", "Armoured knights on horseback join the foot soldiers", "Foot soldiers can only poke you on the ground", "Your damage to the castle has slowed them down!", "The gate is rubble: a smaller wave trickles out").
- The **war horn** sound and the small screen shake that went with a wave.

Kept: the WANTED bar itself, the "Wave N" line in the pause menu, and all other banners (for example the princess capture, raids and King William).

## Bigger minimap; big icons only for the 3 castles (queue 150, 150a)
- **150:** the minimap is about **30% wider and 10% taller**, with no stretching. The map is scaled up 10% evenly and sits in the middle of the wider frame, with sea-blue side bands. The top-right corner stays put, and the minimap never reaches the WANTED bar or HUD panels.
  - Desktop 1280x800: 257x150 -> map 283x165 in a 334-px frame (tap area 263x171 -> 340x186).
  - Phone landscape: tap area 115x80 -> 139x86. Phone portrait: 184x125 -> 234x135.
- **150a:** only the 3 real castles keep the big castle icon: **Lumenspire Citadel**, **Doomforge Citadel** and **King William's Castle Aldric**. Ironhold Gate and Gorgrim War-Fort (and any other strongholds) now use a normal-size square icon in their land's colours.

| Before | After |
|---|---|
| ![Desktop before](screenshots/332_minimap_150_before_desktop.png) | ![Desktop after](screenshots/332_minimap_150_after_desktop.png) |
| ![Phone landscape before](screenshots/332b_minimap_150_before_phone_landscape.png) | ![Phone landscape after](screenshots/332b_minimap_150_after_phone_landscape.png) |
| ![Phone portrait before](screenshots/332c_minimap_150_before_phone_portrait.png) | ![Phone portrait after](screenshots/332c_minimap_150_after_phone_portrait.png) |
| ![Big map before](screenshots/333_bigmap_150a_before_castle_icons.png) | ![Big map after](screenshots/333_bigmap_150a_after_castle_icons.png) |

Close-ups: `screenshots/332z_minimap_150_zoom_desktop.png`, `332z_minimap_150_zoom_landscape.png`, `332z_minimap_150_zoom_portrait.png`. (Phone shots are emulated in desktop Chrome at iPhone 17 Pro Max size, not taken on a real phone.)


## Hard mode (queue 139, selectable)
On the title screen the **Mode** row now cycles **NORMAL -> EASY -> HARD**. Use the arrows, A/D or M, or tap it. Your choice is remembered on this device, saved in each save file, and shown as "· Hard" in the save list. **Normal and easy are unchanged**: every rule below applies only in hard mode.

| Item | Hard mode | Normal |
|---|---|---|
| 139a food | hunger and gluttony fill **25% less** (x0.75) | x1 |
| 139b eating fighters | a fighter at full health must be **bitten first** (24 damage) before you can eat it | eat whole |
| 139c troops | x1.3 health and attack, then **x1.05 per castle level** (compounding) | x1 |
| 139d/e crossbows | royal knights (5 damage) and the prince (6) shoot crossbow bolts (range 480). **King William fires a 3-bolt spread** (7 damage each) | none |
| 139f/i mini bosses and both wizards | health x1.2^(level-1), damage x1.1^(level-1) | x1 |
| 139g Vikings | hired every 500 gold of income for 25 gold | 1000 / 50 |
| 139h meters | fire and fly drain 10% faster | x1 |
| 139j alphas | x1.075^(level-1) health and damage | x1 |
| 139k castle start | **double** the starting gold, wood and stone (level 1: 200/200/40 vs 100/100/20) | x1 |
| 139l towns | a building upgrades to stone every 45 s | 60 s |
| 139m towers | town and desert towers +1% a level health and bolt damage | x1 |
| 139n caravan | the rich desert caravan travels 15% faster out of combat | x1 |
| 139o Cinder Isle | the Dark Wizard's **lava flood**: a 2.2 s warning, then 5 s of lava over the island (9 damage a second), every 13-17 s | none |
| 139p carts | wood and stone carts 10% faster | x1 |
| 139q patrols | +1 archer every even castle level and +1 sword soldier every odd level, cumulative | none |
| 139r patrols | +1 mounted knight every 5 castle levels, cumulative | none |
| 139s tax collectors | spawn/respawn every **30 s** | 40 s (easy 55 s) |
| 139t King William's chase | gathers his men and chases **5 s** after the princess leaves the castle area, **riding his warhorse** (145 px/s) | 6 s (easy 7 s), on foot at 115 px/s |
| 139u King William dizzy | **20 s** (the banner says 20) | 30 s |

After being knocked out dizzy he also charges again as soon as he wakes, so in hard mode that chase comes after 20 s instead of 30.

| | |
|---|---|
| ![Mode select](screenshots/327_hard_mode_select_139.png) | ![Crossbow knights](screenshots/328_hard_crossbow_knights_139.png) |
| ![King William's 3-bolt spread](screenshots/329_hard_king_3bolt_spread_139.png) | ![Lava flood on Cinder Isle](screenshots/330_hard_lava_flood_island_139.png) |
| ![King William rides out on his horse](screenshots/334_hard_king_rides_horse_139t.png) | |

## Wizards come back every level (queue 140)
- Both wizards return at the start of every castle level, in every mode. The Storm Wizard comes back with his tower and a 300 shield (210 on easy). The Dark Wizard comes back with a 525 shield (368 on easy). Their shields don't grow with the level yet. A hard-mode switch can add that later through one hook (`WZ140.hpMul`).
- **Rewards last until your dragon is defeated:**
  - Storm Wizard: the barrier stays open.
  - Dark Wizard: his volcano stays drinkable, and the purple triple lava shot stays on.
  - Beating a wizard again while you have his reward doesn't double anything. You get a "beaten again" message, his normal beat bonuses (the Dark Wizard's full heal, the horn) and the gobble. Each repeat win now also gives a permanent +2.5% attack (queue 146).
- **The Dark Wizard's volcano while he's back:** you can still drink if you hold the unlock. His shield no longer keeps you off the rim, but he keeps casting lava, eruptions and lightning at you, so it's risky. Without the unlock, the old "his shield keeps you from the lava" rule applies.
- **Defeat:** when your dragon is defeated, the restart is a brand-new game. The barrier closes, the Cinder Isle volcano locks and the triple shot is gone until you beat each wizard again.
- **Save and load:** saves record both "beaten this level" and "reward held". Loading a save restores exactly what that save had. You can't save on the game-over screen (the autosave stops too), so a save from before a defeat brings back the rewards you held at that point. Old saves with a beaten wizard load as "beaten this level, reward held".

## On-screen direction arrows (queue 142)
Only four kinds of direction arrow are left on screen (all modes). Each one is pinned to the screen edge and kept clear of the HUD and touch buttons, and each one hides while its target is on screen:
- **Lair** (gold): points home, as before.
- **Raid** (blue, "RAID ... m"): points to the hoard-raid knights only while they march on your lair. It is not shown during the warning or while they run back to the castle.
- **Prince** (gold with his colours, "PRINCE ... m"): only while a landed prince is hunting you. It is not shown before he lands or after he is beaten.
- **King William** (gold and red, "KING ... m"): only while he charges after the dragon. It is not shown while he fights next to his castle or rides home.

**Removed:** the small blue (knight) and green (archer) edge arrows that pointed to every off-screen knight and archer. That included wave knights and archers, mounted knights, raid knights outside a march and a prince's soldiers (guards standing at a post never had one). No other on-screen direction arrows existed in the game. Map markers such as the ⚓ landing spot and the minimap icons are not direction arrows and are unchanged.

## Alpha tigers that guard their turf (queue 143)

Every tiger in the Emerald Jungle is now an **alpha** and follows the same rules as the other alphas:

- **Too strong to gulp above half health.** Biting a tiger above 50% health doesn't eat him: he shrugs it off (the bite still takes 50 off, never below 1 health; queue 145). Wear him down below 50% first. Then he gets dizzy (spinning stars) and can be eaten.
- **+20% alpha hit bonus** (item 119): his swipe hits for 7 x 1.2 = 8.4 at castle level 1 (it was 4).
- **Alpha level scaling:** 70 health at level 1, +15% health and +6% damage per castle level (level 3: 91 health, 9.4 swipe).
- Beating or gulping a tiger gives **+150 points**.
- **He keeps hunting** tapirs, capybaras and monkeys just like before.
- **He now guards a turf**, a circle about 450 px wide around the middle of his home ground. If the dragon lands inside it, the tiger roars "This is MY turf!" and charges, even from far beyond his normal attack range. Knights, archers and hunters who walk in get pounced on. When the intruder leaves (or the dragon takes off), he walks back to his turf. Outside his turf, a tiger is no more aggressive than before.

**Size (143a):** tigers are now drawn about 1.84x (1.6 on top of their art, which was already 1.15x a lion's). That makes them bigger than lionesses (1.35x) and male lions (1.35 x 1.22 = about 1.65x). Lions were not shrunk.

Screenshot: `screenshots/320_tiger_vs_lion_143.png` (tiger, male lion and lioness side by side).

## Achievements
Open **🏆 Achievements** from the title menu (it shows *N of 74* right on the button) or from the pause menu (between *Settings* and *Flip screen*). It's a scrollable list sized for touch: big **▲ Up / ▼ Down** buttons, drag or swipe to scroll, **Show: All / Locked / Unlocked** to filter, and **◀ Back**. On a keyboard: ↑/↓ scroll, ←/→ page, A cycles the filter, Esc/B goes back.
- **Nothing is hidden.** Every locked achievement shows its name and a one-line how-to, so the list doubles as a guide to everything there is to do. Counters show progress (e.g. *260 / 500* gold, *3 / 10* eggs, *1% / 50%* explored).
- **Reward hints.** Anything that gives an in-game reward shows a 🎁 line, even while locked: the bosses' *+50 max health*, the wizard opening *the barrier to the Northern Realms*, the temple's *+100 gold · +10 max fire (once per game)*, the rich caravan's *+50 gold*, dragon eggs' *+5 max fire*, wild dragons' *+5 max stamina*, the guardian egg hatchlings, trade-ship cooldowns, the hippo's *+250 points*, raid purses, and more. These numbers are read from the game's own settings, so they always match the game.
- **Unlocking** shows a small alert at the bottom of the screen (*"🏆 Name — Achievement unlocked"* plus the reward). If several unlock at once you see two alerts and a *"+N more"* one.
- **Saved on this device** (browser storage key `dr_ach_v1`), separately from save games: unlocks carry across new games, restarts and reloads, and never alert twice.

What's in the list (74):
- **Castle, hoard & princess:** first gold home, 500 / 2000 gold stashed, smashing the keep's roof, grabbing Princess Elizabeth (she is never harmed), flying her home (the ransom), castle levels 3, 5 and 10.
- **Dragons & dragon eggs:** eat your first and 10th wild dragon egg, beat 1 and 5 wild dragons, carry home and hatch the **light (white) egg** from the Lumenspire Citadel and the **dark (black) egg** from the Doomforge Citadel (one achievement each, each hint names the guardian dragon you get), and the Glutton boost (eat a whale's worth of food).
- **Bosses:** the wizard (defeat him, and gobble him), the Dark Wizard (*Volcano Tamer*, with a 🎁 *Purple TRIPLE lava shot at every volcano (+50% damage each) · his volcano unlocks* hint, and *Spicy Snack* for eating him), the hydra, griffin, Nessie, the giant squid, the giant octopus, the sand worm, Medusa, Cerberus, and wrecking the jungle temple.
- **Alpha guardians (first defeat of each type):** the savanna pride's male lion, the Deepwood's white alpha wolf, the jungle's silverback gorilla, the alpha hippo, the white alpha elephant (*Herd Guardian*), the white alpha troll and the alpha centaur. **Alphas come back:** a new lion, wolf or silverback takes over about 60 s after you fly away, a new hippo wades in about 2 minutes later, a new white elephant leads the herd about 60 s later (a whole new herd about 2 minutes after the old one is gone), and a new troll or centaur alpha arrives about 75 s later, so you can always find one.
- **Hoard raids & royal fleets:** beat a hoard-raiding champion (1 and 5), pick up a gold sack a raiding knight dropped, stop a prince's royal war fleet, sink a royal warship.
- **Kingdom:** stop a royal **trade ship at sea**, and separately stop a trade ship **on land** (unloading at the quay, or its carts unloading on shore), destroy the **rich desert caravan** (*+50 gold*), break the castle gate, wreck the barracks, topple 3 towers, knock down the lighthouse, wreck a catapult, stop a tax collector, defeat a knight, defeat 50 of King William's soldiers, burn 10 crop fields, knock down or burn 25 trees, and wreck 5 carts.
- **Exploring:** 25%, 50%, 75% and **100%** of the map (the minimap fog), and visiting every region (the list shows which regions you haven't seen yet). All of it is reachable by flying; the far north opens once the wizard's barrier falls.
- **Region feasts:** one per region (Farmlands, Deepwood, lake & rivers, hills & mountains, coast & sea, desert, savanna, jungle) for **eating** at least one of every animal type that lives there. Each shows *eaten / total* and a *"Still to eat: …"* list. Only gulping counts, not burning or knocking out. The princess and the king never count, and alphas have their own achievements instead.
- **First encounters:** one for each other group in the Dragon's Tally (people, the king's army, the desert army, the light and dark lands, boats and siege engines, buildings, and so on).

| | |
|---|---|
| ![Achievements list](screenshots/286_achievements_list.png) | ![Achievements on a phone](screenshots/287_achievements_phone.png) |
| ![Pause menu with Achievements](screenshots/288_achievements_pause_phone.png) | ![Region feasts with still-to-eat lists](screenshots/289_achievements_feasts.png) |
| ![Alpha guardians](screenshots/290_achievements_alphas.png) | ![Achievement unlocked alert](screenshots/291_achievement_unlocked_alert.png) |
