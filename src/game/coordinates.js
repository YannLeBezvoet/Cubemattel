function ensureAllCoordinates(cubes) {
  cubes.forEach((cube) => {
    if (Number.isFinite(cube.x) && Number.isFinite(cube.y)) {
      return;
    }
    const position = findFirstFreeCoordinate(cubes, cube.id);
    cube.x = position.x;
    cube.y = position.y;
  });
}

function findFirstFreeCoordinate(cubes, ignoredCubeId) {
  const searchLimit = cubes.size + 2;
  for (let y = -searchLimit; y <= searchLimit; y += 1) {
    for (let x = -searchLimit; x <= searchLimit; x += 1) {
      if (!isPositionTaken(cubes, x, y, ignoredCubeId)) {
        return { x, y };
      }
    }
  }
  return { x: searchLimit + 1, y: 0 };
}

function isPositionTaken(cubes, x, y, ignoredCubeId) {
  return [...cubes.values()].some(
    (cube) => cube.id !== ignoredCubeId && cube.x === x && cube.y === y
  );
}

function placeConnectedCube(cubes, sourceId, targetId, direction) {
  const source = cubes.get(sourceId);
  const target = cubes.get(targetId);
  if (!source || !target) {
    return;
  }

  const currentCandidates = connectionCandidates(source, direction, 1);
  const targetAlreadyPlaced = currentCandidates.some(
    (candidate) => candidate.x === target.x && candidate.y === target.y
  );
  if (targetAlreadyPlaced) {
    return;
  }

  const maxDistance = Math.max(2, cubes.size + 1);
  for (let distance = 1; distance <= maxDistance; distance += 1) {
    const candidates = connectionCandidates(source, direction, distance);
    const destination = candidates.find(
      (candidate) => !isPositionTaken(cubes, candidate.x, candidate.y, target.id)
    );
    if (destination) {
      target.x = destination.x;
      target.y = destination.y;
      return;
    }
  }
}

function connectionCandidates(source, direction, distance) {
  if (direction === "vertical") {
    return [
      { x: source.x, y: source.y + distance },
      { x: source.x, y: source.y - distance },
    ];
  }
  return [
    { x: source.x + distance, y: source.y },
    { x: source.x - distance, y: source.y },
  ];
}

module.exports = {
  ensureAllCoordinates,
  findFirstFreeCoordinate,
  placeConnectedCube,
};
