const { CHARACTERS, CUBE_COLORS } = require("./game/constants");
const { getMovementAction } = require("./game/movements");
const { pickRandomAvailableColor } = require("./game/colors");
const {
  ensureAllCoordinates,
  findFirstFreeCoordinate,
  placeConnectedCube,
} = require("./game/coordinates");

class CubeWorldGame {
  constructor() {
    this.cubes = new Map();
    this.links = new Set();
    this.history = [];
  }

  createCube(id, playerName, preferredCharacter) {
    const character = CHARACTERS.includes(preferredCharacter)
      ? preferredCharacter
      : CHARACTERS[this.cubes.size % CHARACTERS.length];
    const position = findFirstFreeCoordinate(this.cubes);
    const color = pickRandomAvailableColor(this.cubes);

    const cube = {
      id,
      playerName,
      color,
      character,
      orientation: "upright",
      emotion: "happy",
      activity: character === "Dodger" ? "jongle avec un ballon" : "saute à la corde",
      connectedTo: [],
      x: position.x,
      y: position.y,
    };

    this.cubes.set(id, cube);
    this._record(`${cube.character} (${cube.playerName}) rejoint la ville.`);
    this._syncConnections();
    return cube;
  }

  removeCube(id) {
    const cube = this.cubes.get(id);
    if (!cube) {
      return;
    }

    this.cubes.delete(id);
    [...this.links].forEach((link) => {
      if (link.includes(id)) {
        this.links.delete(link);
      }
    });

    this._record(`${cube.character} (${cube.playerName}) quitte la ville.`);
    this._syncConnections();
  }

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

  connectCubes(sourceId, targetId, direction) {
    if (sourceId === targetId || !this.cubes.has(sourceId) || !this.cubes.has(targetId)) {
      return;
    }

    ensureAllCoordinates(this.cubes);
    const orientation = direction === "vertical" ? "verticalement" : "horizontalement";
    const key = [sourceId, targetId].sort().join("::");
    this.links.add(key);
    placeConnectedCube(this.cubes, sourceId, targetId, direction);
    this._syncConnections();

    const source = this.cubes.get(sourceId);
    const target = this.cubes.get(targetId);
    this._record(
      `${source.character} et ${target.character} relient leurs cubes ${orientation} et discutent ensemble.`
    );
    this._recordInteractions(sourceId, targetId);
  }

  getState() {
    ensureAllCoordinates(this.cubes);
    return {
      cubes: [...this.cubes.values()],
      history: this.history.slice(-20),
    };
  }

  _syncConnections() {
    this.cubes.forEach((cube) => {
      cube.connectedTo = [];
    });

    this.links.forEach((key) => {
      const [a, b] = key.split("::");
      const cubeA = this.cubes.get(a);
      const cubeB = this.cubes.get(b);
      if (!cubeA || !cubeB) {
        return;
      }
      cubeA.connectedTo.push(b);
      cubeB.connectedTo.push(a);
    });
  }

  _recordInteractions(sourceId, explicitTargetId) {
    const source = this.cubes.get(sourceId);
    if (!source) {
      return;
    }

    const targets = explicitTargetId
      ? [this.cubes.get(explicitTargetId)]
      : source.connectedTo.map((id) => this.cubes.get(id));

    targets
      .filter(Boolean)
      .forEach((target) => {
        this._record(`${source.character} passe voir ${target.character} dans le cube voisin.`);
      });
  }

  _record(text) {
    this.history.push({ text, timestamp: Date.now() });
  }
}

module.exports = { CubeWorldGame, CHARACTERS, CUBE_COLORS };
