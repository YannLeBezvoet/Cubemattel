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
import { CubeWorldGame, CUBE_COLORS } from "../src/game.js";

test("un cube réagit aux mouvements", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");

  game.moveCube("a", "shake");
  let cube = game.getState().cubes[0];
  expect(cube.emotion).toBe("surpris");

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
  expect(state.history.some((entry) => entry.text.includes("discutent ensemble"))).toBe(true);
});

test("chaque cube reçoit une couleur aléatoire différente", () => {
  const game = new CubeWorldGame();
  game.createCube("a", "Alice", "Dodger");
  game.createCube("b", "Bob", "Whip");

  const state = game.getState();
  const cubeA = state.cubes.find((cube) => cube.id === "a");
  const cubeB = state.cubes.find((cube) => cube.id === "b");

  expect(typeof cubeA.color).toBe("number");
  expect(typeof cubeB.color).toBe("number");
  expect(cubeA.color).not.toBe(cubeB.color);
  expect(CUBE_COLORS.includes(cubeA.color)).toBe(true);
  expect(CUBE_COLORS.includes(cubeB.color)).toBe(true);
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
