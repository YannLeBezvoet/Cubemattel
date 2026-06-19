// @ts-check
/**
 * @file src/game/constants.js
 * @description Character catalogue for Cube World stickmen.
 *
 * CHARACTER_DATA maps every stickman name to its canonical data:
 *   - color:    0xRRGGBB cube frame/halo colour (deterministic per character)
 *   - prop:     pixel-art prop identifier (see renderers/stickman/props.js)
 *   - activity: text used in game history logs (idle and play action)
 *
 * CHARACTERS: ordered list of all stickman names, derived from CHARACTER_DATA.
 *
 * Source: https://en.wikipedia.org/wiki/Cube_World_(toy)#Sets
 */

/**
 * @typedef {{ color: number, prop: string, activity: string }} CharacterInfo
 */

/** @type {Record<string, CharacterInfo>} */
const CHARACTER_DATA = {
  // Series 1 (2005)
  Scoop:    { color: 0xFF9800, prop: "bone",       activity: "fetches with the dog"      },
  Slim:     { color: 0xAB47BC, prop: "stick",      activity: "twirls the stick"          },
  Whip:     { color: 0xFFEE58, prop: "rope",       activity: "twirls the lasso"          },
  Dodger:   { color: 0xEF5350, prop: "ball",       activity: "dribbles and shoots"       },
  // Series 2 (2006)
  Mic:      { color: 0xEC407A, prop: "mic",        activity: "sings into the mic"        },
  Hans:     { color: 0x42A5F5, prop: "dumbbell",   activity: "lifts weights"             },
  Handy:    { color: 0x1565C0, prop: "wrench",     activity: "fixes things"              },
  Dusty:    { color: 0x81C784, prop: "broom",      activity: "sweeps the floor"          },
  // Series 3 (2006)
  Chief:    { color: 0x1E88E5, prop: "badge",      activity: "patrols the area"          },
  Toner:    { color: 0xBDBDBD, prop: "briefcase",  activity: "crunches numbers"          },
  Dash:     { color: 0x26A69A, prop: "package",    activity: "delivers a package"        },
  Sparky:   { color: 0x8D6E63, prop: "axe",        activity: "fights the fire"           },
  // Series 4 — Sports (2007)
  Slugger:  { color: 0xEF9A9A, prop: "bat",        activity: "hits a home run"           },
  Kicks:    { color: 0x4CAF50, prop: "ball",       activity: "scores a goal"             },
  Slam:     { color: 0xFF7043, prop: "ball",       activity: "dunks the ball"            },
  Grinder:  { color: 0xD7CCC8, prop: "skateboard", activity: "grinds the rail"           },
  // Series 5 — Mods (2008)
  Dart:           { color: 0x7E57C2, prop: "mirror",   activity: "stretches the mirror"  },
  "Hip Hop":      { color: 0x616161, prop: "speaker",  activity: "drops the beat"        },
  Splash:         { color: 0x29B6F6, prop: "faucet",   activity: "turns on the tap"      },
  "Sci-fi":       { color: 0xEEEEEE, prop: "atom",     activity: "runs the accelerator"  },
  // Places — Jumbo Cubes (2007)
  "Block Bash":       { color: 0xFFCA28, prop: "building", activity: "explores the city"  },
  "Global Getaways":  { color: 0x5C6BC0, prop: "globe",    activity: "plans the vacation" },
};

/** @type {string[]} */
const CHARACTERS = Object.keys(CHARACTER_DATA);

module.exports = { CHARACTER_DATA, CHARACTERS };
