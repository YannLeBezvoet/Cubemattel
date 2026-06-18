/**
 * @file stickman.test.mjs
 * @description Unit tests for stickman pixel-art renderer.
 *
 * Verifies that drawStickman and drawProp produce geometry that stays within
 * the declared bounding box:
 *   - Width:  24 display px  (cols -4 to +3 × P=3)
 *   - Height: 36 display px  (rows -8 to +3 × P=3, y=-24..+12)
 *
 * Uses a lightweight PIXI.Graphics mock — no browser required.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { drawStickman, drawProp } from "../public/js/renderers/stickman.js";

// ─── PIXI.Graphics mock ───────────────────────────────────────────────────────

/**
 * Records every drawRect call so tests can assert on geometry.
 *
 * @returns {{ rects: Array<{x,y,w,h}>, lineStyle: Function, beginFill: Function, endFill: Function, drawRect: Function }}
 */
function makeMockGfx() {
  const rects = [];
  return {
    rects,
    lineStyle() {},
    beginFill() {},
    endFill() {},
    drawRect(x, y, w, h) {
      rects.push({ x, y, w, h });
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the axis-aligned bounding box of all recorded rects.
 *
 * @param {Array<{x,y,w,h}>} rects
 * @returns {{ minX: number, minY: number, maxX: number, maxY: number }}
 */
function bbox(rects) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const { x, y, w, h } of rects) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  }
  return { minX, minY, maxX, maxY };
}

// ─── drawStickman tests ───────────────────────────────────────────────────────

test("drawStickman exports correctly", () => {
  assert.equal(typeof drawStickman, "function");
  assert.equal(typeof drawProp, "function");
});

test("drawStickman default pose fits within 24×36 px bounding box", () => {
  const gfx = makeMockGfx();
  drawStickman(gfx, "happy", "Whip");

  assert.ok(gfx.rects.length > 0, "should draw at least one rect");

  const { minX, minY, maxX, maxY } = bbox(gfx.rects);
  assert.ok(minX >= -12, `left edge ${minX} should be ≥ -12`);
  assert.ok(maxX <= 12,  `right edge ${maxX} should be ≤ +12`);
  assert.ok(minY >= -24, `top edge ${minY} should be ≥ -24`);
  assert.ok(maxY <= 12,  `bottom edge ${maxY} should be ≤ +12`);
});

test("drawStickman arms-wide pose (surpris) stays within bounding box", () => {
  const gfx = makeMockGfx();
  drawStickman(gfx, "surpris", "Dodger");

  const { minX, maxX, minY, maxY } = bbox(gfx.rects);
  assert.ok(minX >= -12, `left edge ${minX}`);
  assert.ok(maxX <= 12,  `right edge ${maxX}`);
  assert.ok(minY >= -24, `top edge ${minY}`);
  assert.ok(maxY <= 12,  `bottom edge ${maxY}`);
});

test("drawStickman joyeux pose arm cells reach above row -4 (y=-12)", () => {
  // joyeux/Whip raises the left arm to rows -5,-6 (y=-15,-18).
  // happy/Whip hangs arms at rows -4,-3 (y=-12,-9).
  // Head is always at rows -8..-6 for both, so we compare arm-region cells only
  // (i.e. cells with x outside the torso cols -2..+1, which is x outside -6..+6).
  const gfxJoyeux = makeMockGfx();
  drawStickman(gfxJoyeux, "joyeux", "Whip");

  const gfxHappy = makeMockGfx();
  drawStickman(gfxHappy, "happy", "Whip");

  // Arm cells: outside x range of torso (-6 to +6)
  const armCellsJoyeux = gfxJoyeux.rects.filter((r) => r.x < -6 || r.x >= 6);
  const armCellsHappy  = gfxHappy.rects.filter((r) => r.x < -6 || r.x >= 6);

  const topJoyeux = bbox(armCellsJoyeux).minY;
  const topHappy  = bbox(armCellsHappy).minY;

  assert.ok(
    topJoyeux < topHappy,
    `joyeux arm top (y=${topJoyeux}) should be higher (more negative) than happy arm top (y=${topHappy})`
  );
});

test("drawStickman head is symmetric around x=0", () => {
  const gfx = makeMockGfx();
  drawStickman(gfx, "happy", "Dodger");

  // Head rows: -8 to -6, i.e. display y = -24 to -15
  const headRects = gfx.rects.filter((r) => r.y <= -15);
  assert.ok(headRects.length > 0, "head cells must exist at top rows");

  const { minX, maxX } = bbox(headRects);
  assert.equal(minX, -6, "head left edge at x=-6");
  assert.equal(maxX,  6, "head right edge at x=+6");
});

test("all emotion poses draw same number of body cells (head+neck+torso+legs)", () => {
  const emotions = ["happy", "surpris", "curieux", "joyeux", "désorienté"];
  const counts = emotions.map((e) => {
    const gfx = makeMockGfx();
    drawStickman(gfx, e, "Whip");
    return gfx.rects.length;
  });
  // Only arm pose changes — body cell count must stay constant across emotions
  const unique = new Set(counts);
  assert.equal(unique.size, 1, `all poses should draw the same total number of cells, got: ${counts}`);
});

// ─── drawProp tests ───────────────────────────────────────────────────────────

test("drawProp Dodger draws a basketball (4 rects)", () => {
  const gfx = makeMockGfx();
  drawProp(gfx, "Dodger");
  assert.equal(gfx.rects.length, 4, "basketball uses 4 drawRect calls");
});

test("drawProp Whip draws a rope (5 rects)", () => {
  const gfx = makeMockGfx();
  drawProp(gfx, "Whip");
  assert.equal(gfx.rects.length, 5, "rope uses 5 drawRect calls");
});
