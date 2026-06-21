// @ts-check
/**
 * @file renderers/stickman.js
 * @description Public API for the pixel-art stickman renderer.
 *
 * Assembles the stickman from sub-modules:
 *   - stickman/sprites.js — pixel data (BODY_PIXELS + arm pose arrays)
 *   - stickman/body.js   — sprite renderer (drawSprite, drawArmPixels, drawBody)
 *   - stickman/arms.js   — arm pose selection (emotion-driven pixel dispatch)
 *   - stickman/props.js  — character prop icons (one per character)
 *
 * Coordinate system (sprite pixels, Y+ downward):
 *   - 1 sprite pixel = P=3 display pixels.
 *   - Grid origin: sprite col 6 = x 0, sprite row 11 = y 0 (waist level).
 *   - Total figure: 12 × 20 sprite pixels = 36 × 60 display px.
 *
 * Gravity positioning (managed by renderers/cube-node.js):
 *   - upright:     figure.y = 15  (5 LCD pixels below centre)
 *   - upside_down: figure.y = -15, scale.y = -1
 *
 * @dependencies PIXI.js v8 — Graphics objects are passed in, not imported.
 */

import { drawBody } from "./stickman/body.js";
import { drawArms } from "./stickman/arms.js";
import { getCharacterPropDrawer } from "./stickman/props.js";

/**
 * Draws the complete pixel-art stickman onto the given PIXI Graphics object.
 * The caller must clear the graphics object before calling this function.
 *
 * @param {any} gfx       - Figure Graphics object (figure-local coords)
 * @param {string} emotion    - 'happy' | 'surprised' | 'joyful' | 'curious' | 'disoriented'
 * @param {string} character  - Any Cube World character name (see constants.js)
 */
export function drawStickman(gfx, emotion, character) {
  drawBody(gfx);
  drawArms(gfx, emotion, character);
  gfx.fill(0x000000);
}

/**
 * Draws the character's prop icon at the bottom of the LCD screen area.
 * The caller must clear the graphics object before calling this function.
 *
 * @param {any} gfx      - Prop Graphics object (body-container coords)
 * @param {string} character - Any Cube World character name (see constants.js)
 */
export function drawProp(gfx, character) {
  getCharacterPropDrawer(character)(gfx);
  gfx.fill(0x000000);
}
