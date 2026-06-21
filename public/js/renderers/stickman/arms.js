// @ts-check
/**
 * @file renderers/stickman/arms.js
 * @description Arm pose selection and rendering for the stickman figure.
 *
 * Each pose is a list of [spriteRow, spriteCol] pixel pairs defined in sprites.js.
 * All poses contain exactly 14 pixels (7 per arm) so total rect counts stay equal
 * across emotions.
 *
 * Available poses:
 *   ARMS_NEUTRAL  — idle, arms hanging diagonally outward (default)
 *   ARMS_WIDE     — surprised, arms spread horizontally
 *   ARMS_UP_RIGHT — joyful Dodger, right arm raised
 *   ARMS_UP_LEFT  — joyful (all others), left arm raised
 *   ARMS_CURIOUS  — curious, right arm extended horizontally
 *
 * @dependencies renderers/stickman/body.js (drawArmPixels)
 *               renderers/stickman/sprites.js (arm pixel data)
 */

import { drawArmPixels } from "./body.js";
import {
  ARMS_NEUTRAL,
  ARMS_WIDE,
  ARMS_UP_RIGHT,
  ARMS_UP_LEFT,
  ARMS_CURIOUS,
} from "./sprites.js";

/**
 * Selects and draws the correct arm pose for the given emotion and character.
 *
 * @param {any} gfx       - PIXI Graphics object
 * @param {string} emotion    - 'surprised' | 'joyful' | 'curious' | (default: neutral)
 * @param {string} character  - 'Dodger' raises the right arm on joyful; others raise left
 */
export function drawArms(gfx, emotion, character) {
  switch (emotion) {
    case "surprised": return drawArmPixels(gfx, ARMS_WIDE);
    case "joyful":    return drawArmPixels(gfx, character === "Dodger" ? ARMS_UP_RIGHT : ARMS_UP_LEFT);
    case "curious":   return drawArmPixels(gfx, ARMS_CURIOUS);
    default:          return drawArmPixels(gfx, ARMS_NEUTRAL);
  }
}
