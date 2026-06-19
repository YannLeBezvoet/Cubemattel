// @ts-check
/**
 * @file renderers/stickman/props.js
 * @description Character prop icon drawing (ball for Dodger, rope for Whip).
 *
 * Props are drawn in body-container coords, not stickman grid units.
 * They appear at the bottom of the LCD screen area and mirror vertically
 * when the cube is upside_down (handled by cube-node.js via scale.y = -1).
 *
 * @dependencies PIXI.js v8 — Graphics objects are passed in, not imported directly.
 */

/** Pixel size for prop icons. */
const PP = 2;

/**
 * Draws a pixel-art basketball for Dodger.
 * Centred near (0, 28) so its bottom aligns with the LCD bottom edge (y=32).
 *
 * @param {any} gfx
 */
export function drawBall(gfx) {
  const cx = 20, cy = 28;
  gfx.rect(cx - PP,      cy - 2 * PP, 2 * PP, PP);
  gfx.rect(cx - 2 * PP, cy - PP,     4 * PP, PP);
  gfx.rect(cx - 2 * PP, cy,          4 * PP, PP);
  gfx.rect(cx - PP,      cy + PP,    2 * PP, PP);
}

/**
 * Draws a pixel-art lasso coil for Whip.
 * Centred near (0, 24) so its bottom aligns with the LCD bottom edge (y=32).
 *
 * @param {any} gfx
 */
export function drawRope(gfx) {
  const cx = 20, cy = 24;
  gfx.rect(cx - 3 * PP, cy,          6 * PP, PP);
  gfx.rect(cx - 4 * PP, cy + PP,     PP,     2 * PP);
  gfx.rect(cx + 3 * PP, cy + PP,     PP,     2 * PP);
  gfx.rect(cx - 3 * PP, cy + 3 * PP, 6 * PP, PP);
  gfx.rect(cx + PP,     cy - 3 * PP, PP,     3 * PP);
}
