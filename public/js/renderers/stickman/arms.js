// @ts-check
/**
 * @file renderers/stickman/arms.js
 * @description Arm rendering and pose selection for the stickman figure.
 *
 * Each pose draws exactly 2 × 3-segment arms (6 grid cells total).
 * Shoulder anchor: left at col -3 row -5, right at col +2 row -5.
 *
 * Available poses:
 *   down       — idle, hanging outward
 *   wide       — surprised, spread horizontally
 *   playDodger — joyful Dodger: right arm raised
 *   playWhip   — joyful Whip: left arm raised
 *   curious    — right arm extended horizontally
 *
 * @dependencies renderers/stickman/body.js (cell helper)
 */

import { cell } from "./body.js";

/**
 * Draws a single 3-segment arm using grid coordinates.
 *
 * @param {any} gfx
 * @param {number} col1 - Upper arm column
 * @param {number} row1 - Upper arm row
 * @param {number} col2 - Forearm column
 * @param {number} row2 - Forearm row
 * @param {number} col3 - Hand column
 * @param {number} row3 - Hand row
 */
function drawArm(gfx, col1, row1, col2, row2, col3, row3) {
  cell(gfx, col1, row1);
  cell(gfx, col2, row2);
  cell(gfx, col3, row3);
}

/** Arms hanging down and outward (default idle pose). @param {any} gfx */
function drawArmsDown(gfx) {
  drawArm(gfx, -3, -5, -4, -4, -5, -3);
  drawArm(gfx,  2, -5,  3, -4,  4, -3);
}

/** Arms spread wide horizontally (surprised). @param {any} gfx */
function drawArmsWide(gfx) {
  drawArm(gfx, -3, -5, -4, -5, -5, -5);
  drawArm(gfx,  2, -5,  3, -5,  4, -5);
}

/** Dodger joyful pose: right arm raised high, left arm down. @param {any} gfx */
function drawArmsPlayDodger(gfx) {
  drawArm(gfx, -3, -5, -4, -4, -5, -3);
  drawArm(gfx,  2, -5,  3, -6,  4, -7);
}

/** Whip joyful pose: left arm raised high, right arm down. @param {any} gfx */
function drawArmsPlayWhip(gfx) {
  drawArm(gfx, -3, -5, -4, -6, -5, -7);
  drawArm(gfx,  2, -5,  3, -4,  4, -3);
}

/** Curious pose: right arm extended horizontally. @param {any} gfx */
function drawArmsCurious(gfx) {
  drawArm(gfx, -3, -5, -4, -4, -5, -3);
  drawArm(gfx,  2, -5,  3, -5,  4, -5);
}

/**
 * Selects and draws the correct arm pose for the given emotion and character.
 *
 * @param {any} gfx
 * @param {string} emotion   - Emotion key driving the pose choice
 * @param {string} character - 'Dodger' | 'Whip' (used for joyful split)
 */
export function drawArms(gfx, emotion, character) {
  switch (emotion) {
    case "surprised": return drawArmsWide(gfx);
    case "joyful":    return character === "Dodger" ? drawArmsPlayDodger(gfx) : drawArmsPlayWhip(gfx);
    case "curious":   return drawArmsCurious(gfx);
    default:          return drawArmsDown(gfx);
  }
}
