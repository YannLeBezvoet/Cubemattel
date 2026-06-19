// @ts-check
/**
 * @file src/game/index.js
 * @description Game module entry point. Re-exports the public elements of the business layer.
 */

const { CubeWorldGame } = require("./cube-world-game");
const { CHARACTER_DATA, CHARACTERS } = require("./constants");

module.exports = { CubeWorldGame, CHARACTER_DATA, CHARACTERS };
