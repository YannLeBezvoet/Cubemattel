// @ts-check
/**
 * @file src/socket-handlers.js
 * @description Socket.IO event wiring for a connected cube.
 *
 * Responsibilities:
 *   - Bind Socket.IO events (cube:move, cubes:connect, disconnect)
 *     to the game business methods.
 *   - Broadcast the world state after each mutation via broadcastWorld.
 *
 * @dependencies src/game
 */

/**
 * @typedef {import('./game/cube-world-game').CubeWorldGame} CubeWorldGame
 */

const VALID_MOVEMENTS = new Set(["shake", "flip", "tilt", "play"]);
const VALID_DIRECTIONS = new Set(["above", "below", "left", "right"]);

/**
 * Wires all Socket.IO events for a cube through a single handler.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 * @param {CubeWorldGame} game
 */
function registerSocketHandlers(io, socket, game) {
  const playerName = `Player-${socket.id.slice(0, 4)}`;

  game.createCube(socket.id, playerName);
  broadcastWorld(io, game);

  socket.on("cube:move", (data) => {
    const movement = data?.movement;
    if (typeof movement !== "string" || !VALID_MOVEMENTS.has(movement)) return;
    game.moveCube(socket.id, movement);
    broadcastWorld(io, game);
  });

  socket.on("cubes:connect", (data) => {
    if (!data || typeof data !== "object") return;
    const { targetId, direction } = data;
    if (typeof targetId !== "string" || !targetId) return;
    if (!VALID_DIRECTIONS.has(direction)) return;
    game.connectCubes(socket.id, targetId, direction);
    broadcastWorld(io, game);
  });

  socket.on("cube:find-nearest", () => {
    game.moveToNearestCube(socket.id);
    broadcastWorld(io, game);
  });

  socket.on("disconnect", () => {
    game.removeCube(socket.id);
    broadcastWorld(io, game);
  });
}

/**
 * Broadcasts the current world state to all connected clients.
 *
 * @param {import('socket.io').Server} io
 * @param {CubeWorldGame} game
 */
function broadcastWorld(io, game) {
  io.emit("world:update", game.getState());
}

module.exports = { registerSocketHandlers };
