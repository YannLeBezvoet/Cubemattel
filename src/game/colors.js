// @ts-check
/**
 * @file src/game/colors.js
 * @description Character-based colour lookup for Cube World stickmen.
 *
 * Each stickman has a canonical 0xRRGGBB colour defined in CHARACTER_DATA
 * (constants.js). Colour is deterministic — derived from the character name,
 * not chosen randomly.
 *
 * @dependencies src/game/constants.js
 */

const { CHARACTER_DATA } = require("./constants");

/**
 * Returns the canonical 0xRRGGBB colour for the given character name.
 * Falls back to neutral mid-grey (0x888888) for unknown character names.
 *
 * @param {string} character - Stickman name (e.g. "Dodger", "Whip")
 * @returns {number} Colour as 0xRRGGBB integer
 */
function getCharacterColor(character) {
  return CHARACTER_DATA[character]?.color ?? 0x888888;
}

module.exports = { getCharacterColor };
