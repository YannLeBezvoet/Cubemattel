import { updateBackground } from "./background.js";

export function animate(sceneState, delta) {
  updateBackground(sceneState, delta);

  sceneState.cubeNodes.forEach((node) => {
    node.phase += 0.05 * delta;
    const bob = Math.sin(node.phase) * getBobIntensity(node.cube?.emotion);
    node.x += (node.targetX - node.x) * 0.11;
    node.y += (node.targetY + bob - node.y) * 0.11;
    node.container.position.set(node.x, node.y);
  });

  drawLinks(sceneState);
}

function drawLinks(sceneState) {
  sceneState.linkGraphics.clear();
  sceneState.linkGraphics.lineStyle(2.5, 0x7fd4ff, 0.42);
  sceneState.links.forEach(([source, target]) => {
    const a = sceneState.cubeNodes.get(source);
    const b = sceneState.cubeNodes.get(target);
    if (!a || !b) {
      return;
    }
    sceneState.linkGraphics.moveTo(a.container.x, a.container.y);
    sceneState.linkGraphics.lineTo(b.container.x, b.container.y);
  });
}

function getBobIntensity(emotion) {
  if (emotion === "joyeux") {
    return 4.5;
  }
  if (emotion === "surpris") {
    return 3.3;
  }
  return 2.1;
}
