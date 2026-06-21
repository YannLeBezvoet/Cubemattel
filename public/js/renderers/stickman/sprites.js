// @ts-check
/**
 * @file renderers/stickman/sprites.js
 * @description Pixel-art sprite data for the stickman figure.
 *
 * Coordinate convention (shared with body.js):
 *   - Sprite grid: 12 columns × 20 rows.
 *   - Column origin: sprite col 6 = grid col 0 (body center-right spine).
 *   - Row origin:    sprite row 11 = grid row 0 (waist / hip level).
 *
 * BODY_PIXELS: 2D array [row][col] of 0|1 for the full body.
 *   Rows 7–10 contain only the spine (cols 5–6); arms are excluded.
 *
 * ARMS_*: [spriteRow, spriteCol] pair lists for arm pixels per emotion.
 *   Each pose defines exactly 14 pixels (7 per arm side) so that every
 *   emotion produces the same total rect count when rendering.
 *
 * @dependencies None — pure data module.
 */

/**
 * Base body sprite — 20 rows × 12 columns.
 * Head (rows 0–3), neck (row 4), shoulders (row 5), chest (row 6),
 * spine (rows 7–11), hips (row 12), upper legs (rows 13–14),
 * legs and feet (rows 15–19).
 *
 * Source: LCD pixel art traced from the physical Cube World toy LCD screen.
 * @type {ReadonlyArray<ReadonlyArray<0|1>>}
 */
export const BODY_PIXELS = [
  [0,0,0,0,0,1,1,0,0,0,0,0],  //  0 — head top
  [0,0,0,0,1,1,1,1,0,0,0,0],  //  1 — head
  [0,0,0,0,1,1,1,1,0,0,0,0],  //  2 — head
  [0,0,0,0,1,1,1,1,0,0,0,0],  //  3 — head
  [0,0,0,0,0,1,1,0,0,0,0,0],  //  4 — neck
  [0,0,0,0,1,1,1,1,0,0,0,0],  //  5 — shoulders
  [0,0,0,1,1,1,1,1,1,0,0,0],  //  6 — chest
  [0,0,0,0,0,1,1,0,0,0,0,0],  //  7 — spine
  [0,0,0,0,0,1,1,0,0,0,0,0],  //  8 — spine
  [0,0,0,0,0,1,1,0,0,0,0,0],  //  9 — spine
  [0,0,0,0,0,1,1,0,0,0,0,0],  // 10 — spine
  [0,0,0,0,0,1,1,0,0,0,0,0],  // 11 — waist  (sprite row 11 = grid row 0)
  [0,0,0,0,1,1,1,1,0,0,0,0],  // 12 — hips
  [0,0,0,1,1,0,0,1,1,0,0,0],  // 13 — upper legs
  [0,0,0,1,1,0,0,1,1,0,0,0],  // 14 — upper legs
  [0,0,1,1,0,0,0,0,1,1,0,0],  // 15 — legs
  [0,0,1,1,0,0,0,0,1,1,0,0],  // 16 — legs
  [0,0,1,1,0,0,0,0,1,1,0,0],  // 17 — legs
  [0,0,1,1,0,0,0,0,1,1,0,0],  // 18 — legs
  [0,0,1,1,0,0,0,0,1,1,0,0],  // 19 — feet
];

/**
 * Arm pixels as [spriteRow, spriteCol] pairs.
 * All poses define exactly 14 pixels to keep total rect counts equal.
 */

/**
 * Neutral / idle — arms hanging diagonally outward and down.
 * Occupies sprite rows 7–10.
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const ARMS_NEUTRAL = [
  [7, 2],[7, 3],[7, 8],[7, 9],
  [8, 1],[8, 2],[8, 9],[8,10],
  [9, 1],[9,10],
  [10,0],[10,1],[10,10],[10,11],
];

/**
 * Surprised — arms spread wide horizontally from the shoulder/chest.
 * Occupies sprite rows 5–6.
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const ARMS_WIDE = [
  [5, 0],[5, 1],[5, 2],[5, 3],
  [5, 8],[5, 9],[5,10],[5,11],
  [6, 0],[6, 1],[6, 2],
  [6, 9],[6,10],[6,11],
];

/**
 * Joyful Dodger — right arm raised up, left arm hanging down.
 * Right arm: sprite rows 3–6 (diagonal up-right).
 * Left arm:  sprite rows 7–10 (same as ARMS_NEUTRAL left).
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const ARMS_UP_RIGHT = [
  // Left arm — neutral downward
  [7, 2],[7, 3],
  [8, 1],[8, 2],
  [9, 1],
  [10,0],[10,1],
  // Right arm — raised up-right
  [6, 8],[6, 9],
  [5, 9],[5,10],
  [4,10],[4,11],
  [3,11],
];

/**
 * Joyful (all except Dodger) — left arm raised up, right arm hanging down.
 * Left arm:  sprite rows 3–6 (diagonal up-left).
 * Right arm: sprite rows 7–10 (same as ARMS_NEUTRAL right).
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const ARMS_UP_LEFT = [
  // Left arm — raised up-left
  [6, 2],[6, 3],
  [5, 1],[5, 2],
  [4, 0],[4, 1],
  [3, 0],
  // Right arm — neutral downward
  [7, 8],[7, 9],
  [8, 9],[8,10],
  [9,10],
  [10,10],[10,11],
];

/**
 * Curious — right arm extended horizontally, left arm hanging down.
 * Right arm: sprite rows 6–7 going rightward.
 * Left arm:  sprite rows 7–10 (same as ARMS_NEUTRAL left).
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const ARMS_CURIOUS = [
  // Left arm — neutral downward
  [7, 2],[7, 3],
  [8, 1],[8, 2],
  [9, 1],
  [10,0],[10,1],
  // Right arm — horizontal extension
  [6, 8],[6, 9],[6,10],[6,11],
  [7, 9],[7,10],[7,11],
];
