/**
 * @file scene/errors.js
 * @description Fatal error display for the cube scene.
 *
 * Replaces the PixiJS canvas with a plain HTML error message when an
 * unrecoverable rendering failure occurs. Guards against double-rendering
 * via the `hasFatalError` flag on sceneState.
 *
 * @dependencies dom.js (escapeHtml)
 */

import { escapeHtml } from "../dom.js";

export function showSceneError(sceneState, cubeScene, text) {
  if (sceneState.hasFatalError) {
    return;
  }
  sceneState.hasFatalError = true;
  cubeScene.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
}
