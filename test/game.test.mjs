/**
 * @file test/game.test.mjs
 * @description Unit tests for CubeWorldGame — server-side game logic.
 *
 * Covers: movements, connections, colour assignment, and face constraints.
 *
 * Sémantique de connexion : le cube SOURCE (joueur) se déplace pour se coller
 * sur la face indiquée du cube CIBLE. La cible reste immobile.
 */

import { test, expect } from "vitest";
import { CubeWorldGame, CHARACTER_DATA } from "../src/game.js";

test("un cube réagit aux mouvements", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");

  game.moveCube("a", "shake");
  let cube = game.getState().cubes[0];
  expect(cube.emotion).toBe("surprised");

  game.moveCube("a", "flip");
  cube = game.getState().cubes[0];
  expect(cube.orientation).toBe("upside_down");
});

test("le joueur se déplace vers le cube cible pour se connecter", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");

  // A se colle à droite de B (A se déplace, B reste en place)
  game.connectCubes("a", "b", "right");
  const state = game.getState();
  const cubeA = state.cubes.find((cube) => cube.id === "a");
  const cubeB = state.cubes.find((cube) => cube.id === "b");

  expect(cubeA.connectedTo).toEqual(["b"]);
  // A est maintenant à droite de B
  expect(cubeA.y).toBe(cubeB.y);
  expect(cubeA.x).toBe(cubeB.x + 1);
  expect(state.history.some((entry) => entry.text.includes("chat together"))).toBe(true);
});

test("each cube color is derived from its character and matches CHARACTER_DATA", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");

  const state = game.getState();
  const cubeA = state.cubes.find((cube) => cube.id === "a");
  const cubeB = state.cubes.find((cube) => cube.id === "b");

  expect(typeof cubeA.color).toBe("number");
  expect(typeof cubeB.color).toBe("number");
  // Dodger and Whip have different canonical colors
  expect(cubeA.color).not.toBe(cubeB.color);
  // Colors match CHARACTER_DATA
  expect(cubeA.color).toBe(CHARACTER_DATA["Dodger"].color);
  expect(cubeB.color).toBe(CHARACTER_DATA["Whip"].color);
});

test("la direction 'below' place le joueur en dessous du cube cible", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");

  // A se colle en dessous de B
  game.connectCubes("a", "b", "below");
  const state = game.getState();
  const cubeA = state.cubes.find((cube) => cube.id === "a");
  const cubeB = state.cubes.find((cube) => cube.id === "b");

  expect(cubeA.x).toBe(cubeB.x);
  expect(cubeA.y).toBe(cubeB.y + 1);
});

test("la direction 'above' place le joueur au-dessus du cube cible", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");

  // A se colle au-dessus de B
  game.connectCubes("a", "b", "above");
  const state = game.getState();
  const cubeA = state.cubes.find((cube) => cube.id === "a");
  const cubeB = state.cubes.find((cube) => cube.id === "b");

  expect(cubeA.x).toBe(cubeB.x);
  expect(cubeA.y).toBe(cubeB.y - 1);
});

test("une connexion réaligne aussi des cubes sans coordonnées", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");
  const cubeA = game.cubes.get("a");
  const cubeB = game.cubes.get("b");
  delete cubeA.x;
  delete cubeA.y;
  delete cubeB.x;
  delete cubeB.y;

  // A se colle en dessous de B, les deux sans coordonnées au départ
  game.connectCubes("a", "b", "below");
  const state = game.getState();
  const alignedA = state.cubes.find((cube) => cube.id === "a");
  const alignedB = state.cubes.find((cube) => cube.id === "b");

  expect(alignedA.x).toBe(alignedB.x);
  expect(alignedA.y).toBe(alignedB.y + 1);
});

test("new cubes spawn with no face or corner contact with any existing cube", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");
  game.createCube("c", "Chloé", "Dodger");

  const { cubes } = game.getState();

  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const ca = cubes[i];
      const cb = cubes[j];
      const dx = Math.abs(ca.x - cb.x);
      const dy = Math.abs(ca.y - cb.y);
      // Must not touch on any face (dx+dy===1) or on any corner (dx===1 && dy===1)
      expect(dx <= 1 && dy <= 1).toBe(false);
    }
  }
});

test("une face occupée du cube cible refuse la connexion", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger"); // cible
  game.createCube("b", "Bob", "Whip");     // occupe la face droite de a
  game.createCube("c", "Chloé", "Dodger"); // essaie aussi la face droite de a

  // B se colle à droite de A
  game.connectCubes("b", "a", "right");
  // C essaie la même face → refusé car déjà occupée par B
  game.connectCubes("c", "a", "right");

  const state = game.getState();
  const cubeA = state.cubes.find((cube) => cube.id === "a");
  const cubeC = state.cubes.find((cube) => cube.id === "c");

  // A n'est pas connecté à C
  expect(cubeA.connectedTo).not.toContain("c");
  // C n'est pas adjacent à A
  expect(Math.abs(cubeC.x - cubeA.x) + Math.abs(cubeC.y - cubeA.y)).not.toBe(1);
});

test("moveToNearestCube places the player near the nearest cube without direct contact", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");

  // Force a far starting position for a and a known position for b
  const cubeA = game.cubes.get("a");
  const cubeB = game.cubes.get("b");
  cubeB.x = 0;
  cubeB.y = 0;
  cubeA.x = 20;
  cubeA.y = 20;

  const moved = game.moveToNearestCube("a");
  const state = game.getState();
  const afterA = state.cubes.find((c) => c.id === "a");

  expect(moved).toBe(true);
  // Not adjacent to b on any face or corner (Chebyshev distance >= 2)
  const dx = Math.abs(afterA.x - cubeB.x);
  const dy = Math.abs(afterA.y - cubeB.y);
  expect(Math.max(dx, dy)).toBeGreaterThanOrEqual(2);
  // But close to b (within 2 cells Euclidean)
  expect(Math.sqrt(dx * dx + dy * dy)).toBeLessThanOrEqual(2);
  // History records the move
  expect(state.history.some((e) => e.text.includes("moves closer"))).toBe(true);
});

test("moveToNearestCube returns false and does not move when the player is alone", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");

  const cubeA = game.cubes.get("a");
  const { x, y } = cubeA;

  const moved = game.moveToNearestCube("a");

  expect(moved).toBe(false);
  expect(cubeA.x).toBe(x);
  expect(cubeA.y).toBe(y);
});

test("moveToNearestCube result is never orthogonally adjacent to any cube", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");
  game.createCube("c", "Chloé", "Dodger");

  // Cluster b and c together, then move a toward them
  const cubeB = game.cubes.get("b");
  const cubeC = game.cubes.get("c");
  const cubeA = game.cubes.get("a");
  cubeB.x = 0; cubeB.y = 0;
  cubeC.x = 1; cubeC.y = 0;
  cubeA.x = 10; cubeA.y = 10;

  game.moveToNearestCube("a");

  const state = game.getState();
  const afterA = state.cubes.find((c) => c.id === "a");
  const others = state.cubes.filter((c) => c.id !== "a");

  // a must not be adjacent (face or corner) to any other cube
  others.forEach((other) => {
    const dx = Math.abs(afterA.x - other.x);
    const dy = Math.abs(afterA.y - other.y);
    expect(Math.max(dx, dy)).toBeGreaterThanOrEqual(2);
  });
});
