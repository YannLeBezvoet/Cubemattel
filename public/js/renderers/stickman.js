// @ts-check
/**
 * @file renderers/stickman.js
 * @description Public API for the pixel-art stickman renderer.
 *
 * Assembles the stickman from sub-modules:
 *   - stickman/body.js  — head, neck, torso, legs (grid primitives)
 *   - stickman/arms.js  — arm poses (emotion-driven)
 *   - stickman/props.js — character prop icons (one per character)
 *
 * Coordinate system (grid units, Y+ downward):
 *   - 1 grid unit = P=3 display pixels.
 *   - Grid origin is the figure's visual centre (hip level).
 *   - Total figure: ~13 grid-row span × 3 ≈ 42 display px tall.
 *
 * Gravity positioning (managed by renderers/cube-node.js):
 *   - upright:     figure.y = 18
 *   - upside_down: figure.y = -19, scale.y = -1
 *
 * @dependencies PIXI.js v8 — Graphics objects are passed in, not imported.
 */

import { drawHead, drawNeck, drawTorso, drawLegs } from "./stickman/body.js";
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
  drawHead(gfx);
  drawNeck(gfx);
  drawTorso(gfx);
  drawArms(gfx, emotion, character);
  drawLegs(gfx);
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
