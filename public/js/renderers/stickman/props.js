// @ts-check
/**
 * @file renderers/stickman/props.js
 * @description Character prop icon drawing for the stickman renderer.
 *
 * Each of the 22 Cube World stickmen has a distinct pixel-art prop derived
 * from their description (see set.md). Props are drawn in body-container
 * coords, centred around x=20 (bottom-right of the LCD screen) and y≈26.
 * They appear at the bottom of the LCD screen area and mirror vertically
 * when the cube is upside_down (handled by cube-node.js via scale.y = -1).
 *
 * Public API:
 *   getCharacterPropDrawer(character) → draw function for the given character.
 *
 * @dependencies PIXI.js v8 — Graphics objects are passed in, not imported directly.
 */

/** Pixel size for prop icons. */
const PP = 2;

// ─── Prop drawing functions ───────────────────────────────────────────────────

/**
 * Ball (Dodger — kicks a ball, Kicks — soccer, Slam — basketball).
 * @param {any} gfx
 */
function drawBall(gfx) {
  const cx = 20, cy = 28;
  gfx.rect(cx - PP,     cy - 2 * PP, 2 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - PP,     4 * PP, PP);
  gfx.rect(cx - 2 * PP, cy,          4 * PP, PP);
  gfx.rect(cx - PP,     cy + PP,     2 * PP, PP);
}

/**
 * Lasso coil (Whip — rope tricks).
 * @param {any} gfx
 */
function drawRope(gfx) {
  const cx = 20, cy = 24;
  gfx.rect(cx - 3 * PP, cy,          6 * PP, PP);
  gfx.rect(cx - 4 * PP, cy + PP,     PP,     2 * PP);
  gfx.rect(cx + 3 * PP, cy + PP,     PP,     2 * PP);
  gfx.rect(cx - 3 * PP, cy + 3 * PP, 6 * PP, PP);
  gfx.rect(cx + PP,     cy - 3 * PP, PP,     3 * PP);
}

/**
 * Dog bone (Scoop — dog lover).
 * @param {any} gfx
 */
function drawBone(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 4 * PP, cy - PP, 2 * PP, 2 * PP);
  gfx.rect(cx - 2 * PP, cy,      4 * PP, PP);
  gfx.rect(cx + 2 * PP, cy - PP, 2 * PP, 2 * PP);
}

/**
 * Diagonal stick (Slim — uses a stick).
 * @param {any} gfx
 */
function drawStick(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 3 * PP, cy + 2 * PP, PP, PP);
  gfx.rect(cx - PP,     cy,           PP, PP);
  gfx.rect(cx + PP,     cy - 2 * PP,  PP, PP);
  gfx.rect(cx + 3 * PP, cy - 4 * PP,  PP, PP);
}

/**
 * Microphone (Mic — musical).
 * @param {any} gfx
 */
function drawMic(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - PP, cy - 4 * PP, 2 * PP, 2 * PP);
  gfx.rect(cx,      cy - 2 * PP, PP,     4 * PP);
  gfx.rect(cx - PP, cy + 2 * PP, 3 * PP, PP);
}

/**
 * Dumbbell (Hans — works out).
 * @param {any} gfx
 */
function drawDumbbell(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 5 * PP, cy - PP, 2 * PP, 2 * PP);
  gfx.rect(cx - 3 * PP, cy,      6 * PP, PP);
  gfx.rect(cx + 3 * PP, cy - PP, 2 * PP, 2 * PP);
}

/**
 * Wrench (Handy — fixes things).
 * @param {any} gfx
 */
function drawWrench(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 2 * PP, cy - 3 * PP, 4 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - 2 * PP, PP,     PP);
  gfx.rect(cx + PP,     cy - 2 * PP, PP,     PP);
  gfx.rect(cx - PP,     cy - PP,     2 * PP, 4 * PP);
}

/**
 * Broom (Dusty — cleans up).
 * @param {any} gfx
 */
function drawBroom(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx,          cy - 3 * PP, PP,     4 * PP);
  gfx.rect(cx - 2 * PP, cy + PP,     5 * PP, PP);
  gfx.rect(cx - 2 * PP, cy + 2 * PP, PP,     PP);
  gfx.rect(cx + 2 * PP, cy + 2 * PP, PP,     PP);
}

/**
 * Shield badge (Chief — police officer).
 * @param {any} gfx
 */
function drawBadge(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - PP,     cy - 3 * PP, 2 * PP, PP);
  gfx.rect(cx - 3 * PP, cy - 2 * PP, 6 * PP, PP);
  gfx.rect(cx - 3 * PP, cy - PP,     6 * PP, PP);
  gfx.rect(cx - 2 * PP, cy,          4 * PP, PP);
  gfx.rect(cx - PP,     cy + PP,     2 * PP, PP);
}

/**
 * Briefcase (Toner — corporate desk jockey).
 * @param {any} gfx
 */
function drawBriefcase(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - PP,     cy - 4 * PP, 2 * PP, PP);
  gfx.rect(cx - 3 * PP, cy - 3 * PP, 6 * PP, PP);
  gfx.rect(cx - 3 * PP, cy - 2 * PP, PP,     3 * PP);
  gfx.rect(cx + 2 * PP, cy - 2 * PP, PP,     3 * PP);
  gfx.rect(cx - 3 * PP, cy + PP,     6 * PP, PP);
}

/**
 * Delivery box (Dash — delivers things).
 * @param {any} gfx
 */
function drawPackage(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 2 * PP, cy - 3 * PP, 4 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - 2 * PP, PP,     4 * PP);
  gfx.rect(cx + PP,     cy - 2 * PP, PP,     4 * PP);
  gfx.rect(cx - 2 * PP, cy + 2 * PP, 4 * PP, PP);
  gfx.rect(cx - PP,     cy - PP,     2 * PP, PP);
}

/**
 * Fire axe (Sparky — fireman).
 * @param {any} gfx
 */
function drawAxe(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx,          cy - 4 * PP, PP,     7 * PP);
  gfx.rect(cx - 3 * PP, cy - 4 * PP, 3 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - 3 * PP, 2 * PP, 2 * PP);
}

/**
 * Baseball bat (Slugger — baseball).
 * @param {any} gfx
 */
function drawBat(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx,          cy + PP,     PP,     3 * PP);
  gfx.rect(cx - PP,     cy - PP,     3 * PP, 2 * PP);
  gfx.rect(cx - 2 * PP, cy - 3 * PP, 5 * PP, 2 * PP);
}

/**
 * Skateboard (Grinder — extreme sports).
 * @param {any} gfx
 */
function drawSkateboard(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 4 * PP, cy - PP, 8 * PP, PP);
  gfx.rect(cx - 3 * PP, cy,      PP,     PP);
  gfx.rect(cx + 2 * PP, cy,      PP,     PP);
}

/**
 * Mirror frame (Dart — funhouse mirror modifier).
 * @param {any} gfx
 */
function drawMirror(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 2 * PP, cy - 4 * PP, 4 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - 3 * PP, PP,     4 * PP);
  gfx.rect(cx + PP,     cy - 3 * PP, PP,     4 * PP);
  gfx.rect(cx - 2 * PP, cy + PP,     4 * PP, PP);
  gfx.rect(cx - PP,     cy + 2 * PP, 2 * PP, PP);
}

/**
 * Speaker (Hip Hop — speaker modifier).
 * @param {any} gfx
 */
function drawSpeaker(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 3 * PP, cy - 4 * PP, 6 * PP, PP);
  gfx.rect(cx - 3 * PP, cy - 3 * PP, PP,     5 * PP);
  gfx.rect(cx + 2 * PP, cy - 3 * PP, PP,     5 * PP);
  gfx.rect(cx - 3 * PP, cy + 2 * PP, 6 * PP, PP);
  gfx.rect(cx - PP,     cy - 2 * PP, 2 * PP, 2 * PP);
}

/**
 * Faucet / tap (Splash — faucet modifier).
 * @param {any} gfx
 */
function drawFaucet(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - 4 * PP, cy - 2 * PP, 4 * PP, PP);
  gfx.rect(cx - PP,     cy - PP,     PP,     3 * PP);
  gfx.rect(cx - 2 * PP, cy + 2 * PP, PP,     PP);
  gfx.rect(cx,          cy + 2 * PP, PP,     PP);
}

/**
 * Atom / particle (Sci-fi — particle accelerator modifier).
 * @param {any} gfx
 */
function drawAtom(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - PP,     cy - PP,     2 * PP, 2 * PP);
  gfx.rect(cx - 3 * PP, cy,          2 * PP, PP);
  gfx.rect(cx + PP,     cy - 3 * PP, PP,     2 * PP);
  gfx.rect(cx + PP,     cy + PP,     PP,     2 * PP);
  gfx.rect(cx - 3 * PP, cy - 3 * PP, 2 * PP, PP);
}

/**
 * City building (Block Bash — city location).
 * @param {any} gfx
 */
function drawBuilding(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - PP,     cy - 5 * PP, 2 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - 4 * PP, PP,     4 * PP);
  gfx.rect(cx + PP,     cy - 4 * PP, PP,     4 * PP);
  gfx.rect(cx - 2 * PP, cy,          4 * PP, PP);
  gfx.rect(cx - PP,     cy - 3 * PP, 2 * PP, PP);
}

/**
 * Globe (Global Getaways — vacation location).
 * @param {any} gfx
 */
function drawGlobe(gfx) {
  const cx = 20, cy = 26;
  gfx.rect(cx - PP,     cy - 3 * PP, 2 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - 2 * PP, 4 * PP, PP);
  gfx.rect(cx - 3 * PP, cy - PP,     6 * PP, PP);
  gfx.rect(cx - 3 * PP, cy,          6 * PP, PP);
  gfx.rect(cx - 2 * PP, cy + PP,     4 * PP, PP);
  gfx.rect(cx - PP,     cy + 2 * PP, 2 * PP, PP);
}

// ─── Character → prop mapping ─────────────────────────────────────────────────

/** @type {Record<string, (gfx: any) => void>} */
const CHARACTER_PROP_DRAWERS = {
  Scoop:             drawBone,
  Slim:              drawStick,
  Whip:              drawRope,
  Dodger:            drawBall,
  Mic:               drawMic,
  Hans:              drawDumbbell,
  Handy:             drawWrench,
  Dusty:             drawBroom,
  Chief:             drawBadge,
  Toner:             drawBriefcase,
  Dash:              drawPackage,
  Sparky:            drawAxe,
  Slugger:           drawBat,
  Kicks:             drawBall,
  Slam:              drawBall,
  Grinder:           drawSkateboard,
  Dart:              drawMirror,
  "Hip Hop":         drawSpeaker,
  Splash:            drawFaucet,
  "Sci-fi":          drawAtom,
  "Block Bash":      drawBuilding,
  "Global Getaways": drawGlobe,
};

/**
 * Returns the prop drawing function for the given character name.
 * Falls back to drawBall for unknown characters.
 *
 * @param {string} character - Stickman name (e.g. "Dodger", "Mic")
 * @returns {(gfx: any) => void}
 */
export function getCharacterPropDrawer(character) {
  return CHARACTER_PROP_DRAWERS[character] ?? drawBall;
}
