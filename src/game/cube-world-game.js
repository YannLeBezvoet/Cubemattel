// @ts-check
const { CHARACTERS } = require("./constants");
const { getMovementAction } = require("./movements");
const { pickRandomAvailableColor } = require("./colors");
const {
  ensureAllCoordinates,
  findFirstIsolatedCoordinate,
  findNearestNonAdjacentPosition,
  moveSourceToTarget,
} = require("./coordinates");

/**
 * @typedef {import('../../types/cube.js').Cube} Cube
 * @typedef {import('../../types/cube.js').HistoryEntry} HistoryEntry
 * @typedef {import('../../types/cube.js').GameState} GameState
 */

class CubeWorldGame {
  constructor() {
    /** @type {Map<string, Cube>} */
    this.cubes = new Map();
    /** @type {HistoryEntry[]} */
    this.history = [];
  }

  /**
   * Creates a cube with a coherent initial state and adds it to the world.
   *
   * @param {string} id
   * @param {string} playerName
   * @param {string} preferredCharacter
   * @returns {Cube}
   */
  createCube(id, playerName, preferredCharacter) {
    const character = CHARACTERS.includes(preferredCharacter)
      ? preferredCharacter
      : CHARACTERS[this.cubes.size % CHARACTERS.length];
    const position = findFirstIsolatedCoordinate(this.cubes);
    const color = pickRandomAvailableColor(this.cubes);

    const cube = {
      id,
      playerName,
      color,
      character,
      orientation: "upright",
      emotion: "happy",
      activity: character === "Dodger" ? "juggles a ball" : "jumps rope",
      connectedTo: [],
      x: position.x,
      y: position.y,
    };

    this.cubes.set(id, cube);
    this._record(`${cube.character} (${cube.playerName}) joins the town.`);
    this._syncConnections();
    return cube;
  }

  /**
   * Removes a cube and recomputes all remaining connections.
   *
   * @param {string} id
   */
  removeCube(id) {
    const cube = this.cubes.get(id);
    if (!cube) {
      return;
    }

    this.cubes.delete(id);
    this._record(`${cube.character} (${cube.playerName}) leaves the town.`);
    this._syncConnections();
  }

  /**
   * Applies a player movement to a cube if the action is recognised.
   *
   * @param {string} id
   * @param {string} movement - "shake" | "flip" | "tilt" | "play"
   */
  moveCube(id, movement) {
    const cube = this.cubes.get(id);
    if (!cube) {
      return;
    }

    const action = getMovementAction(movement, cube);
    if (!action) {
      return;
    }

    cube.emotion = action.emotion;
    cube.activity = action.activity;
    if (action.orientation) {
      cube.orientation = action.orientation;
    }

    this._record(`${cube.character} ${action.activity}.`);
    this._recordInteractions(id);
  }

  /**
   * Moves the source cube (player) to snap it onto a face of the target cube.
   * The face must be free; if it is occupied, the connection is rejected.
   *
   * @param {string} sourceId
   * @param {string} targetId
   * @param {"above" | "below" | "left" | "right"} direction - Target cube face to connect to
   */
  connectCubes(sourceId, targetId, direction) {
    if (sourceId === targetId || !this.cubes.has(sourceId) || !this.cubes.has(targetId)) {
      return;
    }

    ensureAllCoordinates(this.cubes);
    const moved = moveSourceToTarget(this.cubes, sourceId, targetId, direction);
    if (!moved) {
      return;
    }

    this._syncConnections();
    const source = this.cubes.get(sourceId);
    const target = this.cubes.get(targetId);
    if (!source?.connectedTo.includes(targetId) || !target) {
      return;
    }

    const directionLabel = { above: "above", below: "below", left: "to the left of", right: "to the right of" }[direction] ?? direction;
    this._record(
      `${source.character} snaps ${directionLabel} ${target.character}'s cube and they chat together.`
    );
    this._recordInteractions(sourceId, targetId);
  }

  /**
   * Moves the player's cube to the position closest to the nearest other cube
   * that is not in direct contact (not orthogonally adjacent) with any cube.
   * The player ends up nearby but unconnected, preserving isolation.
   *
   * @param {string} sourceId
   * @returns {boolean} true if the cube was successfully moved
   */
  moveToNearestCube(sourceId) {
    const source = this.cubes.get(sourceId);
    if (!source || this.cubes.size < 2) {
      return false;
    }

    ensureAllCoordinates(this.cubes);

    let nearest = null;
    let nearestDistSq = Infinity;
    this.cubes.forEach((cube) => {
      if (cube.id === sourceId) return;
      const distSq = (cube.x - source.x) ** 2 + (cube.y - source.y) ** 2;
      if (distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearest = cube;
      }
    });

    if (!nearest) return false;

    const destination = findNearestNonAdjacentPosition(this.cubes, nearest.x, nearest.y, sourceId);

    if (source.x === destination.x && source.y === destination.y) {
      return true;
    }

    source.x = destination.x;
    source.y = destination.y;
    this._syncConnections();
    this._record(`${source.character} moves closer to ${nearest.character}'s cube.`);
    return true;
  }

  /**
   * Returns the public game state snapshot consumed by the client.
   *
   * @returns {GameState}
   */
  getState() {
    ensureAllCoordinates(this.cubes);
    return {
      cubes: [...this.cubes.values()],
      history: this.history.slice(-20),
    };
  }

  // Rebuilds connections from coordinates.
  _syncConnections() {
    ensureAllCoordinates(this.cubes);
    this.cubes.forEach((cube) => {
      cube.connectedTo = [];
    });

    const byPosition = new Map();
    this.cubes.forEach((cube) => {
      byPosition.set(`${cube.x},${cube.y}`, cube.id);
    });

    const neighbors = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    this.cubes.forEach((cube) => {
      const connected = new Set();
      neighbors.forEach(([dx, dy]) => {
        const neighborId = byPosition.get(`${cube.x + dx},${cube.y + dy}`);
        if (neighborId && neighborId !== cube.id) {
          connected.add(neighborId);
        }
      });
      cube.connectedTo = [...connected];
    });
  }

  /**
   * Records interactions between a source cube and its target or neighbours.
   *
   * @param {string} sourceId
   * @param {string} [explicitTargetId]
   */
  _recordInteractions(sourceId, explicitTargetId) {
    const source = this.cubes.get(sourceId);
    if (!source) {
      return;
    }

    const targets = explicitTargetId
      ? [this.cubes.get(explicitTargetId)]
      : source.connectedTo.map((id) => this.cubes.get(id));

    targets
      .filter(/** @param {Cube | undefined} t @returns {t is Cube} */ (t) => t !== undefined)
      .forEach((target) => {
        this._record(`${source.character} visits ${target.character} in the neighbouring cube.`);
      });
  }

  /**
   * Appends a timestamped entry to the history log.
   *
   * @param {string} text
   */
  _record(text) {
    this.history.push({ text, timestamp: Date.now() });
  }
}

module.exports = { CubeWorldGame };
