// @ts-check
/**
 * @file renderers/stickman/body.js
 * @description Sprite rendering utilities and body drawing for the stickman.
 *
 * Coordinate system:
 *   - Sprite pixels: 12 columns × 20 rows (from BODY_PIXELS in sprites.js).
 *   - Column origin: sprite col 6  → grid col 0 (body center-right spine).
 *   - Row origin:    sprite row 11 → grid row 0 (waist / hip level).
 *   - 1 grid unit = P display pixels.
 *
 * Bounding box of body pixels (no arms):
 *   Display X: −18 px (col 0)  to +18 px (col 11 + P)
 *   Display Y: −33 px (row 0)  to +27 px (row 19 + P)
 *
 * Public API:
 *   drawSprite(gfx, pixels, startRow)  — render a 2D pixel array
 *   drawArmPixels(gfx, armPixels)      — render [row, col] arm pixel list
 *   drawBody(gfx)                      — render the full body sprite
 *
 * @dependencies PIXI.js v8 — Graphics objects are passed in, not imported.
 */

import { BODY_PIXELS } from "./sprites.js";

/** Display pixels per sprite pixel. Change P to scale the figure uniformly. */
export const P = 3;

/** Sprite column that maps to display x = 0 (body center-right). */
const COL_ORIGIN = 6;

/** Sprite row that maps to display y = 0 (waist / hip level). */
const ROW_ORIGIN = 11;

/**
 * Renders a 2D pixel sprite array onto the gfx object.
 * Each 1-value entry becomes a P×P filled rectangle.
 *
 * @param {any} gfx - PIXI Graphics object
 * @param {ReadonlyArray<ReadonlyArray<0|1>>} pixels - 2D [row][col] pixel array
 * @param {number} [startRow=0] - sprite row index of pixels[0] (used for arm overlays)
 */
export function drawSprite(gfx, pixels, startRow = 0) {
  for (let r = 0; r < pixels.length; r++) {
    const row = pixels[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c]) {
        gfx.rect(
          (c - COL_ORIGIN) * P,
          (r + startRow - ROW_ORIGIN) * P,
          P, P
        );
      }
    }
  }
}

/**
 * Renders arm pixels given as [spriteRow, spriteCol] pairs.
 * Each pair maps to a P×P rectangle in display coordinates.
 *
 * @param {any} gfx - PIXI Graphics object
 * @param {ReadonlyArray<readonly [number, number]>} armPixels - [row, col] list
 */
export function drawArmPixels(gfx, armPixels) {
  for (const [r, c] of armPixels) {
    gfx.rect(
      (c - COL_ORIGIN) * P,
      (r - ROW_ORIGIN) * P,
      P, P
    );
  }
}

/**
 * Draws the complete stickman body: head, neck, chest, torso, hips, legs.
 * Does not draw arms — those are handled by stickman/arms.js.
 *
 * @param {any} gfx - PIXI Graphics object
 */
export function drawBody(gfx) {
  drawSprite(gfx, BODY_PIXELS);
}
