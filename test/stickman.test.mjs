/**
 * @file stickman.test.mjs
 * @description Unit tests for stickman pixel-art renderer.
 *
 * The stickman is a 12×20 sprite pixel grid with P=3 display pixels per
 * sprite pixel. Origin: sprite col 6 = x 0, sprite row 11 = y 0 (waist).
 *
 * Bounding box (body + arms, rect-based):
 *   Width:  36 display px  (cols 0–11 → x −18..+18)
 *   Height: 60 display px  (rows 0–19 → y −33..+27)
 *
 * Uses a lightweight PIXI.Graphics mock — no browser required.
 */

import { test, expect } from "vitest";
import { drawStickman, drawProp } from "../public/js/renderers/stickman.js";

// ─── PIXI.Graphics mock ───────────────────────────────────────────────────────

/**
 * Records every rect() call so tests can assert on geometry.
 * Mirrors the PixiJS v8 Graphics API used by stickman.js.
 *
 * @returns {{ rects: Array<{x,y,w,h}>, rect: Function, fill: Function }}
 */
function makeMockGfx() {
  const rects = [];
  return {
    rects,
    rect(x, y, w, h) {
      rects.push({ x, y, w, h });
      return this;
    },
    circle() {
      return this;
    },
    fill() {
      return this;
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
  expect(typeof drawStickman).toBe("function");
  expect(typeof drawProp).toBe("function");
});

test("drawStickman default pose fits within 36×60 px bounding box", () => {
  const gfx = makeMockGfx();
  drawStickman(gfx, "happy", "Whip");

  expect(gfx.rects.length).toBeGreaterThan(0);

  const { minX, minY, maxX, maxY } = bbox(gfx.rects);
  expect(minX).toBeGreaterThanOrEqual(-18);
  expect(maxX).toBeLessThanOrEqual(18);
  expect(minY).toBeGreaterThanOrEqual(-33);
  expect(maxY).toBeLessThanOrEqual(27);
});

test("drawStickman arms-wide pose (surprised) stays within bounding box", () => {
  const gfx = makeMockGfx();
  drawStickman(gfx, "surprised", "Dodger");

  const { minX, maxX, minY, maxY } = bbox(gfx.rects);
  expect(minX).toBeGreaterThanOrEqual(-18);
  expect(maxX).toBeLessThanOrEqual(18);
  expect(minY).toBeGreaterThanOrEqual(-33);
  expect(maxY).toBeLessThanOrEqual(27);
});

test("drawStickman joyful pose arm cells reach above row -4 (y=-12)", () => {
  const gfxJoyeux = makeMockGfx();
  drawStickman(gfxJoyeux, "joyful", "Whip");

  const gfxHappy = makeMockGfx();
  drawStickman(gfxHappy, "happy", "Whip");

  const armCellsJoyeux = gfxJoyeux.rects.filter((r) => r.x < -6 || r.x >= 6);
  const armCellsHappy  = gfxHappy.rects.filter((r) => r.x < -6 || r.x >= 6);

  const topJoyeux = bbox(armCellsJoyeux).minY;
  const topHappy  = bbox(armCellsHappy).minY;

  expect(topJoyeux).toBeLessThan(topHappy);
});

test("drawStickman head is symmetric around x=0", () => {
  const gfx = makeMockGfx();
  drawStickman(gfx, "happy", "Dodger");

  // At y <= −15 (sprite rows 0–6): body spans cols 3–8 in the widest row (row 6, the chest).
  // Grid coords: col 3 → x=−9, col 8 → x=6 (rect right edge = 9). Symmetric around 0.
  const headRects = gfx.rects.filter((r) => r.y <= -15);
  expect(headRects.length).toBeGreaterThan(0);

  const { minX, maxX } = bbox(headRects);
  expect(minX).toBe(-9);
  expect(maxX).toBe(9);
});

test("all emotion poses draw same number of body cells (head+neck+torso+legs)", () => {
  const emotions = ["happy", "surprised", "curious", "joyful", "disoriented"];
  const counts = emotions.map((e) => {
    const gfx = makeMockGfx();
    drawStickman(gfx, e, "Whip");
    return gfx.rects.length;
  });
  const unique = new Set(counts);
  expect(unique.size).toBe(1);
});

// ─── drawProp tests ───────────────────────────────────────────────────────────

test("drawProp Dodger draws a ball (4 rects)", () => {
  const gfx = makeMockGfx();
  drawProp(gfx, "Dodger");
  expect(gfx.rects.length).toBe(4);
});

test("drawProp Whip draws a rope (5 rects)", () => {
  const gfx = makeMockGfx();
  drawProp(gfx, "Whip");
  expect(gfx.rects.length).toBe(5);
});

test("drawProp draws at least 3 rects for every known character", () => {
  const characters = [
    "Scoop", "Slim", "Whip", "Dodger",
    "Mic", "Hans", "Handy", "Dusty",
    "Chief", "Toner", "Dash", "Sparky",
    "Slugger", "Kicks", "Slam", "Grinder",
    "Dart", "Hip Hop", "Splash", "Sci-fi",
    "Block Bash", "Global Getaways",
  ];

  for (const character of characters) {
    const gfx = makeMockGfx();
    drawProp(gfx, character);
    expect(gfx.rects.length, `${character} drew no rects`).toBeGreaterThanOrEqual(3);
  }
});

test("drawProp falls back gracefully for unknown characters", () => {
  const gfx = makeMockGfx();
  drawProp(gfx, "Unknown");
  expect(gfx.rects.length).toBeGreaterThan(0);
});
