# Dragon's Rampage

A single-file browser game where you play a dragon. Open `index.html`; it needs no build step and no server.

## Building from source
The source is split into parts, which are concatenated in this order:
```
cat part1.html partD0.js partW.js partF.js part2.js part3.js part4.js part5.js part7.js partB.js partS.js partG.js partK.js partD.js partR.js partFL.js partT.js partA.js partV.js partH.js partRD.js partTR.js partM.js partP.js partY.js partWK.js partSV.js partSC.js partCS.js partHC.js partRN.js partFM.js partMH.js partGH.js partKM.js partPR.js partHN.js partSJ.js partKW.js partWD.js partMR.js partBL.js partOC.js partTF.js partPB.js partHU.js partLA.js part6.js > index.html
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
- partP.js: Princess Elizabeth inside the great keep, under its stone roof
- partY.js: the Dragon's Tally (bestiary) and the pause menu (P / Esc)
- partWK.js: worker respawn for rebuilt work buildings
- partSV.js: save / load (3 slots plus an autosave)
- partSC.js: supply carts and the Castle Storehouse
- partCS.js: claw scratch while swimming
- partHC.js: the hoard and trophies carry over between castle levels
- partFM.js: the FIRE meter
- partMH.js: max-health growth: monster feasts (kraken / sand worm +50) and Glutton food milestones (+5)
- partGH.js: northern mountain-goat herds and the mountain lions that hunt them
- partKM.js: the kingdom-wide militia (every villager arms up and guards their own post)
- partRN.js: the princess ransom King William pays after each level win
- partPR.js: prince boss armies that arrive by sea in royal war fleets (every 5th castle level)
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
- partLA.js: the gold lair guide arrow
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
- The map is a large explorable kingdom with 16 regions: Kingdom Farmlands, Castle Aldric (King William's castle), The Deepwood (with the hunters' cabin), Mirror Lake & the Silver River, Frostpeak Mountains, the hills and Stone Mine, the Southern Farmlands, the Sapphire Coast, Dragon's Roost (your lair, on the peak), the Scorching Sands desert (west), the Golden Savanna and the Emerald Jungle (far west, past the desert), the Dragon Peaks (far north-west) and, out east, three sea regions: The Sapphire Sea, The Lonely Lighthouse and The Kraken Deep.
- Entering a region shows its banner, and finding a new region is worth +100.
- Unexplored land is hidden under fog. The minimap shows explored terrain, structures, units, patrols (shield icons, red when engaged), siege engines, gold, Princess Elizabeth and your lair. M / LB opens a full world map with region and village names and the explored %.
- Goal: raid the castle, stash gold in your lair, and fly Princess Elizabeth home (follow the gold arrow). The kingdom fights back with waves, the wanted meter, the hunter and bucket brigades, and it rebuilds.

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

## Kingdom life
- **Castle Aldric** sits in the south-central kingdom, well away from your lair on Dragon's Roost. Roads, waves, patrols, raids, tax collectors and the map markers all start from there.
- **Supply carts and the Castle Storehouse:** lumberjacks and miners pile wood and stone in their yards. Horse carts, each led by a driver, haul it along the roads to the storehouse beside the castle. Only delivered cargo pays for rebuilding, so wrecking a cart costs the kingdom its load.
- **Worker respawn:** when the logging camp, mine or hunters' cabin is rebuilt, new workers walk in from the nearest village.
- **Three hunters per cabin:** the hunters' cabin houses three hunters with bows and daggers. Each one respawns on his own timer (about 20 s, staggered) while the cabin stands. If the cabin is wrecked, none return until it is rebuilt; then villagers walk in one by one and take up the bow until there are three again. To keep it fair they fan out to different sides, only one arrow flies every 0.6 s across the trio, and only one hunter stabs with his dagger at a time. During the militia all three guard their own corner of the cabin. Save and load keep which hunters are alive and their health.
- **Roads** link every village, the castle and the camps. They never cross water except over bridges. Patrols and caravans travel along them.
- **Wells** stand in villages. They are tough (about 3× a hut's health) and fire barely hurts them. Villagers fetch water from them to fight fires.
- **Everything is destructible:** huts, barns, markets, wells, the castle and bridges. Villagers repair and rebuild over time. Buildings and markets drop gold, and the castle collects taxes.
- **Wildflowers** carpet each region in its own colours: meadow, forest, hill, alpine (low slopes only), desert and oasis blooms, and coastal pinks. Villages and the castle grounds have fenced **vegetable and flower gardens**. Fire scorches flowers and gardens to black. Flowers regrow, and villagers replant gardens (the alarm rises a little when a garden burns).
- **Plants burn everywhere:** dragon fire and lava shots set alight savanna grass and acacias, jungle trees (with their vines) and giant ferns, desert cacti and scrub, beach and oasis palms, mountain pines, island grass and the heather of the Dragon Peaks, as well as forest trees, wildflowers and gardens. Burning plants spread fire to nearby plants, flowers, trees and (big ones) buildings, burn down to charred stumps, and later regrow as saplings, just like forest trees. Reeds and other water plants never burn. Burnt plants are saved and loaded.

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

She is held inside the great keep under a tough **stone roof**. Fire barely scorches it; bites, stomps, the crash stomp and lava shots crack it in stages until it crumbles, and masons patch it while she is inside. The princess has a name: **Princess Elizabeth**. A pink name tag floats above her in her tower, in your claws and in your lair. Messages use her name, such as *"You captured Princess Elizabeth!"*, and the HUD shows where she is. While you carry her, the nearest knights and archers shout rescue calls ("Rescue Princess Elizabeth!", "Unhand Princess Elizabeth, foul beast!"). She is only ever captured, never eaten or hurt, just very cross.

## Hoard raids

A big hoard attracts trouble. When the pile reaches **100 gold** (then 200, 350, 550, 850, and every 400 after that; ×1.4 in Easy mode), a brave **named knight** comes for it. After a raid ends there is a **5-minute cooldown** (7 minutes in Easy mode) before the next one can start, and the first raid of a game can't come in the first 30 seconds. Crossing several thresholds at once still brings only one raid. The HUD shows the time until the next raid is possible and the gold it needs.

1. **Warning:** a banner reads, for example, *"Sir Gareth the Bold vows before King William to claim the dragon's hoard!"* A horn sounds, and you get **8 seconds** to get ready.
2. **March:** the champion rides out of the castle gate with an escort of foot soldiers. The escort carries heraldic flags and spears with pennants in the champion's colours. The party goes east along King William's road, then up the mountain trail to Dragon Peak, which takes about 45 seconds.
3. **The champion** is a mini-boss. They are bigger, with a plume, a coloured tabard and a crested kite shield, and have a name tag and health bar overhead. Fire does only 60% damage to them. They can't be swallowed until they're below half health; they raise their shield.
4. **Theft:** if the champion reaches the hoard, they grab 25–45% of it, depending on the raid number, and carry the sack back to the castle. If they get through the gate, that gold is gone.
5. **Victory:** defeat or eat the champion (a cartoon gulp) and any stolen gold flies back into the hoard. You also get a bonus of 40 + 20×raid gold and 300 + 150×raid points.

**Trophy banners:** each champion you defeat or eat leaves their heraldic banner planted around your gold pile, in their colours and with their crest (lion, star, tree, crown, sun, moon, rose or bolt). The banners fill a ring around the hoard (back first, then a wider second ring) and wave in the wind. Walk the dragon close to a banner to see that knight's name. Trophies stay for the whole session, even after a new game, and the world map shows a 🚩 count beside the lair.

Every raid uses a new name from a pool of 16 knights and dames, such as Sir Roland Ironheart and Dame Elara the Brave. Later raids bring a tougher champion (HP 150 → 220 → 290 → …) and a bigger escort (2 → 3 → 4 …, up to 8).

While a raid is on, a HUD bar shows its status (countdown, distance to your hoard, or distance to the gate when they're running off with your gold). The world map and minimap show the party with a flashing banner marker.

Controls are the usual ones: fire, stomp, and bite/eat (E, pad X, or the BITE button on touch).

## The desert (Scorching Sands, west)
Sandhaven and its bazaar, an oasis, camel caravans on the road, desert animals, vultures and a **sand worm**. Reach it through the mountain pass. Hunger drains 1.35× faster in the heat. The desert is about 17% narrower than before, so the crossing to the savanna is shorter.

## The Golden Savanna and the Emerald Jungle (far west, past the desert)
The map is 36% wider (27,200 px instead of 20,000). Past the desert crossing, the sand blends into the **Golden Savanna**: golden grass, acacia trees, termite mounds, rocky kopjes and a **watering hole**. Further west, the savanna blends into the **Emerald Jungle**: dense canopy trees with vines, giant ferns, the **jungle river** (it runs out to the sea) and overgrown **ruins**. The borders fade smoothly; there are no hard edges.
- **Savanna prey:** zebras, gazelles, wildebeest, giraffes, elephants (a feast: food 70), warthogs, ostriches. **Predators:** lion prides, cheetahs, hyenas and circling vultures.
- **Male lions:** every pride is led by a bigger, maned male lion (40 HP and a 5-point swipe, against a lioness's 22 HP and 3). He guards the pride's home turf. When he spots the dragon in or near it, he ROARS (visible rings and a roar sound) and calls the pride: any lioness that is hunting drops her hunt and runs in to fight. Once the dragon has been away from the turf for a few seconds, they calm down and go back to normal. He has his own Tally line ("Male lions").
- **Jungle prey:** monkeys, tapirs, capybaras, frogs, parrots and toucans. **Predators:** jaguars, tigers, pythons, and crocodiles in the jungle river.
- Every existing rule applies: they hunt, respawn only in their home region, count for the Glutton milestone, never raise the wanted level, and have Tally entries (greyed out until discovered). The regions have their own banners, fog, world-map labels and minimap colours, and are saved and loaded.
- Hunger: 1.1× in the savanna, normal in the jungle. Flying nonstop from the castle you arrive in the savanna hungry, so snack on a lizard or camel in the desert on the way (the test does this and arrives with plenty left).

## The Dragon Peaks (far north-west)
A craggy roost of smaller **wild dragons** with their nests, mountain goats and eagles, plus purple heather (which burns). Wild dragons are never killed outright: worn down to 1 HP they are dazed (cartoon stars) and can be gulped. Hurting one makes it (and, in Normal mode, its roost-mates) defend. A dragonet hatches from a nest about every 100 s while the roost is small.

## Meerkats, roadrunners, jackals and bulls
- **Meerkats** (savanna and desert) live in colonies at burrow mounds. A lookout squeaks when the dragon or a predator comes near and everyone dives into the burrows, where they can't be bitten, burned or caught.
- **Roadrunners** (desert) zig-zag away at top speed with dust puffs and a "Meep meep!".
- **Jackals** are small scavenger-hunters that chase meerkats and roadrunners.
- **Bulls** (1–2 per cow pen) paw the ground, snort steam, then charge and ram. A damaged fence lets a bull break out, chase you briefly and trot home. Their tough hide means they must be worn down before you can swallow them. Farmers mend the fences.

## Predators hunt, and more prey
- Prey populations (spawn counts and respawn caps for wild prey, herds, fish schools and birds) are **5% higher**, rounded per group, so some groups gain one animal and small groups stay the same.
- **Every predator hunts:** wolves, foxes, bears, mountain lions, snakes, desert foxes and scorpions, the sand worm, hawks, eagles, gulls, sharks, the squid, crocodiles, lions, cheetahs, hyenas, jaguars, tigers, pythons and vultures stalk, chase and **gulp** their prey, which vanishes in a cartoon puff of stars or feathers (no gore). Prey that escape run away.
- Performance: only a few predators look for prey each frame (6 on High graphics, 3 on Low), so the hunting costs almost nothing.

## Crocodiles (fresh water only)
Crocodiles live only in **fresh water**: the Silver River, Mirror Lake, the ponds, the savanna watering hole and the jungle river. They never appear in the sea or the desert oasis. They lurk with only their eyes and snout showing, then lunge at animals that come to drink, fish and birds. They **snap at the dragon** (8 damage) when it swims or walks close by. They are edible (food 22) and wild, so eating them never raises the wanted level. They respawn slowly (at most one every ~75 s), appear in the Tally and are saved and loaded.

## Princess ransom
When you deliver Princess Elizabeth to your lair (a level win), **King William pays a ransom** at the start of the next level: **100 gold + 50 per castle level beyond the first + 10% of the gold still in the castle treasury**. A banner reads *"King William pays a ransom for Princess Elizabeth: +X gold!"* and coins fly into your hoard, on top of the gold you carried over. The ransom counts toward raid thresholds, but a raid can't start in the first 45 seconds of a level.

## Prince boss armies (every 5th castle level)
At castle level 5, 10, 15 and so on, a named **prince** comes for the dragon. A herald announces *"Hear ye! Prince … vows before King William to slay the dragon!"*, then after a horn call and war drums his **royal war fleet** sails in from the southern sea edge: 2 warships at level 5 and one more for each later prince. While at sea, the ships can be burned, hit with lava shots or raked with a claw scratch. Sinking a ship dumps its soldiers into the sea; they can't swim in armour, so they cling to barrels and are fished out (no drowning). The ships that make it beach at the landing spot (⚓ on the map), and the army marches up King William's roads toward you and your lair, with the prince on his white warhorse. The empty ships stay on the beach and can be burned. The prince has a boss health bar (900 HP, +400 per later prince) and can only be eaten below 30% health. Beating him gives 250 gold (+150 per later prince), 1,500 points per prince level and his royal banner as a trophy. There are no hoard raids during a prince attack.

## King William
Castle Aldric belongs to **King William**. He stands in the castle courtyard with a gold name tag, and when the dragon comes close he shouts orders, starting with *King William: "Guards! Protect Princess Elizabeth!"*. While you carry the princess away, he calls for her rescue. He can't be eaten or hurt. His name is used in the raid and prince announcements (*"… vows before King William to claim the dragon's hoard!"*), the ransom banner, the prince's march, the tax collectors (*"King William's taxes! Begone!"*), the militia (*"By order of King William!"*) and the castle label.

## The lair arrow
A gold arrow circles the dragon and points home to the lair, with the distance. It hides while the lair is on screen, glows while you carry the princess or loot, and stays clear of the HUD panels and touch buttons.

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
- **Ocean and beach creatures:** moray eels lunge from reefs, narwhal pods roam the northern sea, stingrays lie in the shallows (step on one and its tail barb zaps you; it then glides away, and it zaps predators too), anglerfish lure small fish in the deep with a glowing lamp, sea turtles nest on the beach (hatchlings scurry to the sea), pond turtles plop into the lake, penguin colonies waddle on the shore, and a giant octopus (wear it down until it is dazed, then eat it for +20 max HP). Starfish and seashells dot the beaches; swoop low to pick up shells. All of them are cartoony, never raise the wanted level, and have Tally entries.

## Wildlife (spawns and respawns only in its home region; bigger animals heal more)
- **Farmland:** cows, pigs, sheep, chickens, horses (in paddocks), crows
- **Forest:** deer, rabbits, boars, foxes, wolves (packs that nip back), bears (fight back harder, big heal)
- **White alpha wolves:** every wolf pack has a bigger, white-furred alpha (30 HP and a 4-point bite, against a wolf's 14 HP and 2). Like the male lion, he guards the pack's woods turf: when he spots the dragon he HOWLS (visible rings and a howl sound) and every wolf that is hunting stops and joins the fight. They calm down after the dragon leaves. A pack that loses its leader gets a new one after a while. He has his own Tally line ("White alpha wolves") and is saved and loaded.
- **Lake/river:** ducks, geese, jumping fish, beavers
- **Mountains/cliffs:** mountain goats, eagles, hawks
- **Coast:** seagulls, crabs, seals
- **Hills/mine:** goats
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
- There are three save slots and an **autosave** every 2 minutes, all stored in the browser.

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
