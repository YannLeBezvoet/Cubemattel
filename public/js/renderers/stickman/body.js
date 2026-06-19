// @ts-check
/**
 * @file renderers/stickman/body.js
 * @description Grid primitive and body-part drawing functions for the stickman.
 *
 * Coordinate system (grid units, Y+ downward):
 *   - 1 grid unit = P display pixels.
 *   - Grid origin is the figure's visual centre (hip level).
 *
 * Layout overview (grid rows, each cell = P px):
 *   HEAD         circle at (0, -8P), radius 2P
 *   row -6       NECK       2×1 (cols -1, 0)
 *   row -5       SHOULDERS  4×1 solid row (cols -2..+1)
 *   row -4...-1  BODY       2×4 solid block (cols -1, 0)
 *   row  0...2   LEGS       1 col each, left=-2 right=+1 (separated)
 *   row  3       FEET       2 cols each, left=-3..-2 right=+1..+2
 *
 * @dependencies PIXI.js v8 — Graphics objects are passed in, not imported directly.
 */

/** Display pixels per grid unit. Change to scale the entire figure uniformly. */
export const P = 3;

/**
 * Fills a single P×P grid cell at (col, row) in figure-local display coords.
 *
 * @param {any} gfx
 * @param {number} col
 * @param {number} row
 */
export function cell(gfx, col, row) {
  gfx.rect(col * P, row * P, P, P);
}

/**
 * Draws the head as a filled circle centred at (0, -8P), radius 2P.
 *
 * @param {any} gfx
 */
export function drawHead(gfx) {
  gfx.circle(0, -8 * P, P * 2);
}

/**
 * Draws the neck as a 2×1 block at row -6, cols -1 to 0.
 *
 * @param {any} gfx
 */
export function drawNeck(gfx) {
  cell(gfx, -1, -6);
  cell(gfx, 0, -6);
}

/**
 * Draws the torso: wide shoulder row (-5) then a narrower body (rows -4 to -1).
 *
 * @param {any} gfx
 */
export function drawTorso(gfx) {
  for (let c = -2; c <= 1; c++) cell(gfx, c, -5);
  for (let r = -4; r <= -1; r++) {
    cell(gfx, -1, r);
    cell(gfx, 0, r);
  }
}

/**
 * Draws both legs (rows 0–2) and feet (row 3).
 * Each leg is 1 column wide; feet extend one cell outward on each side.
 *
 * @param {any} gfx
 * @param {number} [leftX=-2]
 * @param {number} [rightX=1]
 */
export function drawLegs(gfx, leftX = -2, rightX = 1) {
  for (let r = 0; r <= 2; r++) {
    cell(gfx, leftX, r);
    cell(gfx, rightX, r);
  }
  cell(gfx, leftX - 1, 3);
  cell(gfx, leftX, 3);
  cell(gfx, rightX, 3);
  cell(gfx, rightX + 1, 3);
}
