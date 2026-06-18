/**
 * @file scene/animation.js
 * @description Per-frame animation loop for the cube scene.
 *
 * Handles floating/bobbing of unconnected cubes, flip animations triggered by
 * orientation changes, and delegates background particle updates to background.js.
 * Called every tick by the PixiJS ticker set up in scene/setup.js.
 *
 * @dependencies scene/background.js, renderers/cube-node.js
 */

import { updateBackground } from "./background.js";
import { drawCube } from "../renderers/cube-node.js";

const FLIP_SPEED = 0.04;

export function animate(sceneState, delta) {
  updateBackground(sceneState, delta);

  sceneState.cubeNodes.forEach((node) => {
    node.phase += 0.05 * delta;

    if (node.flipAnim) {
      node.flipAnim.progress = Math.min(node.flipAnim.progress + FLIP_SPEED * delta, 1);
      const p = node.flipAnim.progress;
      const eased = (1 - Math.cos(p * Math.PI)) / 2;
      node.body.rotation = eased * Math.PI;

      if (p >= 1) {
        drawCube(node, node.flipAnim.pendingCube);
        node.body.rotation = 0;
        node.flipAnim = null;
      }
    }

    const bob = hasConnections(node.cube)
      ? 0
      : Math.sin(node.phase) * getBobIntensity(node.cube?.emotion);
    node.x += (node.targetX - node.x) * 0.11;
    node.y += (node.targetY + bob - node.y) * 0.11;
    node.container.position.set(node.x, node.y);
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

function hasConnections(cube) {
  return Array.isArray(cube?.connectedTo) && cube.connectedTo.length > 0;
}
