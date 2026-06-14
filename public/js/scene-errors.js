import { escapeHtml } from "./dom.js";

export function showSceneError(sceneState, cubeScene, text) {
  if (sceneState.hasFatalError) {
    return;
  }
  sceneState.hasFatalError = true;
  cubeScene.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
}
