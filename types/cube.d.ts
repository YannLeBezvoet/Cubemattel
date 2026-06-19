/**
 * @file types/cube.d.ts
 * @description Shared TypeScript declarations used by both the Node.js game
 * server (src/) and the browser client (public/js/).
 *
 * Both tsconfig.json and public/tsconfig.json reference this directory,
 * and both set "baseUrl" to the project root so that `import('types/cube')`
 * resolves here from any source file.
 */

/** Runtime state of a single cube, as produced by the server and consumed by the client. */
export interface Cube {
  id: string;
  playerName: string;
  /** 0xRRGGBB integer colour — canonical per character, from CHARACTER_DATA */
  color: number;
  /** One of the 22 Cube World stickman names (see src/game/constants.js CHARACTER_DATA) */
  character: string;
  /** "upright" | "upside_down" */
  orientation: string;
  /** "happy" | "surprised" | "curious" | "joyful" | "disoriented" */
  emotion: string;
  activity: string;
  /** IDs of adjacent cubes */
  connectedTo: string[];
  /** Grid column */
  x: number;
  /** Grid row */
  y: number;
}

export interface HistoryEntry {
  text: string;
  timestamp: number;
}

export interface GameState {
  cubes: Cube[];
  history: HistoryEntry[];
}
