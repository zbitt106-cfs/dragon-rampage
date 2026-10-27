# Dragon's Rampage

A single-file browser game where you play a dragon. Open `index.html`; it needs no build step and no server.

## Building from source
The source is split into parts, which are concatenated in this order:
```
cat part1.html partD0.js partW.js partF.js part2.js part3.js part4.js part5.js part7.js partB.js partS.js partG.js partK.js partD.js partR.js partFL.js partT.js partA.js partV.js partH.js partRD.js partTR.js partM.js part6.js > index.html
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
- partK.js / partD.js / partR.js / partT.js: destruction and repair, crash dive stomp, desert life, roads, wells, wanted tiers and militia
- partFL.js: wildflowers and village/castle gardens
- partA.js: procedural music and sound effects (Web Audio, no audio files)
- partV.js: the volcano (Mount Cinder) beside Dragon Peak and lava shots
- partH.js: the gold hoard in the lair (grows with your stash, coin-clink drop-offs, map marker)
- partRD.js: hoard raids (named champions with escorts march on the lair to steal gold)
- partTR.js: trophy banners of beaten champions, planted around the hoard
- partM.js: touch controls and mobile support
- part6.js: main loop, HUD, minimap and world map, title screen

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

The title screen also has **Music volume** and **Sound effects** rows (←/→ in 10% steps); the settings are saved in the browser.

**DIVE STOMP:** press stomp while flying to fold your wings and plummet. The shockwave smashes wooden buildings flat and cracks stone (2.4 s cooldown, costs 6 stamina). A normal stomp also damages wood.

### Touch (phones and tablets)
- Play in landscape. In portrait the game pauses and shows a "Rotate your phone" hint.
- **Left thumb:** touch anywhere on the left half and drag. The joystick appears under your thumb.
- **Right thumb:** **FIRE** (hold), **BITE**, **STOMP** (it reads DIVE while flying and does the crash dive stomp) and **FLY** (it reads LAND in the air). **MAP** and **II** (pause) sit on the left edge.
- On the title screen, tap a row to change it. Tap the left or right side of a volume row to turn it down or up.
- The game keeps the HUD clear of the notch and home bar (safe areas), and draws on small screens at a larger logical size so everything fits. Sound unlocks on the first tap (iOS).
- The first visit on a touch device defaults to Low graphics. It can be added to the home screen and runs full screen (PWA meta tags).

## The world
- The map is a large explorable kingdom with 13 regions: Kingdom Farmlands, Castle Aldric, The Deepwood (with the hunter's cabin), Mirror Lake & the Silver River, Frostpeak Mountains, the hills and Stone Mine, the Southern Farmlands, the Sapphire Coast, Dragon's Roost (your lair, on the peak), the Scorching Sands desert (far west) and, out east, three sea regions: The Sapphire Sea, The Lonely Lighthouse and The Kraken Deep.
- Entering a region shows its banner, and finding a new region is worth +100.
- Unexplored land is hidden under fog. The minimap shows explored terrain, structures, units, patrols (shield icons, red when engaged), siege engines, gold, Princess Elizabeth and your lair. M / LB opens a full world map with region and village names and the explored %.
- Goal: raid the castle, stash gold in your lair, and fly Princess Elizabeth home (follow the gold arrow). The kingdom fights back with waves, the wanted meter, the hunter and bucket brigades, and it rebuilds.

## Wanted tiers and the MILITIA
The WANTED meter rises as you cause damage and cools down faster the farther you are from where the trouble was. Wild animals never raise it. The kingdom's response grows in tiers:
**foot soldiers → knights → archers → mounted knights → siege engines → MILITIA.**
Early waves and patrols are only foot soldiers and knights. At the top tier, whole villages take up spears and pitchforks. Difficulty grows slowly, and Easy mode is gentler still.

## Kingdom life
- **Roads** link every village, the castle and the camps. They never cross water except over bridges. Patrols and caravans travel along them.
- **Wells** stand in villages. They are tough (about 3× a hut's health) and fire barely hurts them. Villagers fetch water from them to fight fires.
- **Everything is destructible:** huts, barns, markets, wells, the castle and bridges. Villagers repair and rebuild over time. Buildings and markets drop gold, and the castle collects taxes.
- **Wildflowers** carpet each region in its own colours: meadow, forest, hill, alpine (low slopes only), desert and oasis blooms, and coastal pinks. Villages and the castle grounds have fenced **vegetable and flower gardens**. Fire scorches flowers and gardens to black. Flowers regrow, and villagers replant gardens (the alarm rises a little when a garden burns).

## The volcano and LAVA SHOTS
**Mount Cinder** smokes and glows just south-east of your lair on Dragon Peak (a volcano marker shows on the minimap and world map). Every 10–18 s it puffs out a harmless shower of embers. Land beside the crater and press **E / X / BITE** (the touch button reads **DRINK**) to gulp **20 LAVA SHOTS**. They replace fire breath until they run out:
- Each fire press (Space, A/RT or the touch **FIRE** button, which reads **LAVA n**) lobs one lava glob. Holding it repeats about twice a second.
- The glob arcs about 400 px and splashes. It sets wood, trees, fields and carts ablaze, hurts and burns soldiers, and, unlike fire, **cracks stone walls, towers and wells**.
- It leaves a lava puddle that burns for about 5 s. Over water it fizzles into steam (ships still catch fire).
- While you carry lava, your mouth glows and drips embers, and the HUD shows **Lava: N**.
- At 0 you are back to normal fire. You can refill at the crater 8 s after your last drink.

## The castle gate
The gate is its own destructible part of the castle; fire or stomps bring it down. While it lies in rubble (or is still being rebuilt):
- Waves come about **2.5× less often** and are **half the size**.
- The soldiers trickle out through the rubble one at a time.
- The HUD shows **"Gate destroyed: waves delayed"** with the rebuild status.

The engineers wait about 20 s for the dust to settle, then spend 6 wood and 6 stone from the kingdom's stockpiles and rebuild the gate slowly (about 45 s). When it is repaired, the normal wave pace returns.

## The gold hoard

Every coin you bring home lands on a visible treasure pile inside the lair, and the pile grows smoothly as your total rises:

| Gold stashed | Stage |
|---|---|
| 0–24 | A few coins |
| 25–79 | Small pile (plus a few coin stacks) |
| 80–199 | Big mound (plus a treasure chest) |
| 200+ | Mountain of treasure: crowns, goblets and gems |

When you drop gold off, coins arc from the dragon into the pile with a clink, and the pile bumps up. On High graphics the hoard glows and twinkles. A label under the pile shows its stage and total. The world map (M) shows a gold mound beside the lair, sized to the hoard, with its total.

## Princess Elizabeth

The princess has a name: **Princess Elizabeth**. A pink name tag floats above her in her tower, in your claws and in your lair. Messages use her name, such as *"You captured Princess Elizabeth!"*, and the HUD shows where she is. While you carry her, the nearest knights and archers shout rescue calls ("Rescue Princess Elizabeth!", "Unhand Princess Elizabeth, foul beast!"). She is only ever captured, never eaten or hurt, just very cross.

## Hoard raids

A big hoard attracts trouble. When the pile reaches **60 gold** (then 150, 300, 500, 800, and every 400 after that; ×1.4 in Easy mode), a brave **named knight** comes for it. There are at least 100 seconds between raids.

1. **Warning:** a banner reads, for example, *"Sir Gareth the Bold vows before the King to claim the dragon's hoard!"* A horn sounds, and you get **8 seconds** to get ready.
2. **March:** the champion rides out of the castle gate with an escort of foot soldiers. The escort carries heraldic flags and spears with pennants in the champion's colours. The party goes east along the King's road, then up the mountain trail to Dragon Peak, which takes about 45 seconds.
3. **The champion** is a mini-boss. They are bigger, with a plume, a coloured tabard and a crested kite shield, and have a name tag and health bar overhead. Fire does only 60% damage to them. They can't be swallowed until they're below half health; they raise their shield.
4. **Theft:** if the champion reaches the hoard, they grab 25–45% of it, depending on the raid number, and carry the sack back to the castle. If they get through the gate, that gold is gone.
5. **Victory:** defeat or eat the champion (a cartoon gulp) and any stolen gold flies back into the hoard. You also get a bonus of 40 + 20×raid gold and 300 + 150×raid points.

**Trophy banners:** each champion you defeat or eat leaves their heraldic banner planted around your gold pile, in their colours and with their crest (lion, star, tree, crown, sun, moon, rose or bolt). The banners fill a ring around the hoard (back first, then a wider second ring) and wave in the wind. Walk the dragon close to a banner to see that knight's name. Trophies stay for the whole session, even after a new game, and the world map shows a 🚩 count beside the lair.

Every raid uses a new name from a pool of 16 knights and dames, such as Sir Roland Ironheart and Dame Elara the Brave. Later raids bring a tougher champion (HP 150 → 220 → 290 → …) and a bigger escort (2 → 3 → 4 …, up to 8).

While a raid is on, a HUD bar shows its status (countdown, distance to your hoard, or distance to the gate when they're running off with your gold). The world map and minimap show the party with a flashing banner marker.

Controls are the usual ones: fire, stomp, and bite/eat (E, pad X, or the BITE button on touch).

## The desert (Scorching Sands, far west)
Sandhaven and its bazaar, an oasis, camel caravans on the road, desert animals, vultures and a **sand worm**. Reach it through the mountain pass. Hunger drains 1.35× faster in the heat.

## Music and sound
All sound is generated in code with Web Audio; there are no audio files. The music follows where you are: a pastoral theme in the farmlands, a sea shanty on the water, a desert theme in the Scorching Sands, battle drums when soldiers close in, an eerie theme near the giant squid, fanfare at the castle and on the title screen, and a night theme. Themes crossfade. Sound effects (fire, chomps, stomps, crashes, splashes, coins, roars, arrows and more) are panned to where they happen and fade with distance. **N** mutes everything.

## Hunger (normal mode only)
- A drumstick meter in the HUD (under Stamina) slowly empties: about 80 s from full to empty on the ground, and about 60 s at the fastest (flying and breathing fire).
- Eating any person, animal or bird refills it; bigger meals refill more (a chicken about 11, a villager 22, a cow 57, a bear 88). Resting at the lair heals you but does **not** feed you.
- Below 25 the meter flashes orange ("Getting hungry…"). At zero you are **Starving!**: the meter pulses red, a warning appears on screen, and you lose 2.5 HP/s until you eat again. Starving to death ends the game.
- Easy mode has no hunger at all (the meter is hidden).
- Hunger drains 1.4× faster while you swim or fly over water (sea, lake or river).

## The sea
- East of the coast is a big open sea. Fly over it, or land on any water (sea, Mirror Lake, the Silver River) to **swim**: you move at about half speed, regain stamina more slowly, cannot stomp, and sit half-submerged with ripples. Biting (E) and fire still work.
- **Sea life:** fish schools (a small snack per bite; fire just makes them dive), sharks (circle and nip you for 3; +20 HP), whales (slow; their tail slaps for 4; too big to swallow until worn down below half health; +75 HP).
- **The GIANT SQUID** lurks in **The Kraken Deep** (far east). It slams a tentacle where you are heading (dodge the red ring, 9 damage) or grabs you (3 HP/s; burn it to break free). Wear it down until it is **DAZED**, then eat it for +150 HP and +1500 points. It returns only after about 4 minutes.
- **Boats:** fishing boats, merchant ships (they flee and carry a little gold) and rowboats on the lake. Burn them, bite their hulls, or dive slam onto them. Sunk crews swim in the water and can be eaten.
- **Pirates:** cartoony skull-and-crossbones ships that circle you and fire crossbows (2) and arcing cannonballs (7; watch the red target ring), whether you are flying or swimming. They douse fires after a while, so keep burning! A sunk pirate ship leaves pirate swimmers and a floating gold chest (swoop low to collect it, then stash it at your lair).
- **The Lonely Lighthouse:** a rest-stop island just before the Kraken Deep, with a sweeping light beam and a map marker. Landing on it restores stamina fast and slowly heals you. The keeper and fishermen at the dock are edible and come back over time, and seals lounge on the rocks: they flop into the sea when you come near, are worth +24 HP, and respawn. Pirates rarely sail nearby.

## Wildlife (spawns and respawns only in its home region; bigger animals heal more)
- **Farmland:** cows, pigs, sheep, chickens, horses (in paddocks), crows
- **Forest:** deer, rabbits, boars, foxes, wolves (packs that nip back), bears (fight back harder, big heal)
- **Lake/river:** ducks, geese, jumping fish, beavers
- **Mountains/cliffs:** mountain goats, eagles, hawks
- **Coast:** seagulls, crabs, seals
- **Hills/mine:** goats

## Mounted knights
- Fast lance cavalry rides out of the castle gate. They charge in a straight line (the lance only hits a grounded dragon) and then wheel around for another pass.
- They are tougher than foot knights. Fire or a stomp dismounts the rider: the horse bolts and a foot knight is left behind.
- Horse and rider can be eaten for a big heal.
- They join waves from the archer tier, in bigger numbers later, and the wave banner lists them.

## Patrols
- Patrols roam the roads between villages, the castle and the camps, independent of the wanted meter. Each has a random mix of foot knights, archers and cavalry, plus a banner carrier.
- Later levels bring bigger, tougher patrols. The number of patrols is capped.
- They attack if you come close, and attacking them raises the wanted meter.

## Bridges
- Wooden bridges carry the roads over the Silver River. Burn one and it collapses into charred posts.
- Ground units, cavalry, patrols and siege engines can't cross a broken bridge. They detour to another bridge, or around the lake if every bridge is out.
- Villagers rebuild bridges in wood first. From level 3, with enough stone, they rebuild or upgrade them in stone. A progress bar shows the build.
- Stone bridges are fireproof but can be wrecked by repeated stomps (about 5) or heavy dive slams (about 4).
- Each wrecked bridge is worth +80.

## Graphics (High / Low)

On the title screen, pick the **Graphics** row with ↑/↓ and switch it with ←/→ or Enter, or press **G** anywhere on the title screen. The setting is saved in the browser (`localStorage` key `dr_gfx`). High is the default.

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
