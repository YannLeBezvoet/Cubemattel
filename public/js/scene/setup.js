// @ts-check
/**
 * @file scene/setup.js
 * @description PixiJS initialisation and scene lifecycle management.
 *
 * Creates the PixiJS Application, builds the layer stack (background, links,
 * cubes, pan overlay), wires the animation ticker and the resize observer.
 * Called once at startup; subsequent world updates go through scene/world.js.
 *
 * @dependencies scene/background.js, scene/animation.js, scene/errors.js,
 *               scene/world.js, scene/pan.js
 *
 * @typedef {import('./world.js').SceneState} SceneState
 */

import { buildBackground } from "./background.js";
import { animate } from "./animation.js";
import { showSceneError } from "./errors.js";
import { renderWorld } from "./world.js";
import { applyCameraTransform, setupPanInteractions, updatePanOverlay } from "./pan.js";

/**
 * Initialises the PixiJS application and all scene layers.
 * Wires the resize observer and the animation ticker.
 * Renders the buffered world state immediately after setup.
 *
 * In PixiJS v8, Application.init() is async — the renderer is not created
 * by the constructor, so this function must be awaited by the caller.
 *
 * @param {SceneState} sceneState
 * @param {{ cubeScene: HTMLElement, targetInput: HTMLInputElement, cubeCount: HTMLElement, linkCount: HTMLElement, historyList: HTMLElement }} refs
 * @returns {Promise<void>}
 */
export async function setupScene(sceneState, refs) {
  const { cubeScene } = refs;
  if (!window.PIXI) {
    cubeScene.innerHTML = '<div class="empty-state">PixiJS not found. Please reload the page.</div>';
    return;
  }

  const PIXI = window.PIXI;
  const app = new PIXI.Application();
  try {
    await app.init({
      antialias: true,
      backgroundAlpha: 0,
      autoDensity: true,
      resolution: 1,
      resizeTo: cubeScene,
    });
  } catch (error) {
    console.error("Failed to initialise PixiJS", error);
    showSceneError(sceneState, cubeScene, "Unable to start the 2D scene in this browser.");
    return;
  }

  cubeScene.appendChild(app.canvas);
  app.renderer.resize(Math.max(1, cubeScene.clientWidth), Math.max(1, cubeScene.clientHeight));
  cubeScene.classList.add("scene-pan-ready");

  sceneState.app = app;
  sceneState.backgroundLayer = new PIXI.Container();
  sceneState.linksLayer = new PIXI.Container();
  sceneState.cubeLayer = new PIXI.Container();
  sceneState.linkGraphics = new PIXI.Graphics();
  sceneState.panOverlay = new PIXI.Graphics();
  sceneState.linksLayer.addChild(sceneState.linkGraphics);
  sceneState.linksLayer.addChild(sceneState.panOverlay);

  app.stage.addChild(sceneState.backgroundLayer);
  app.stage.addChild(sceneState.linksLayer);
  app.stage.addChild(sceneState.cubeLayer);
  buildBackground(sceneState);
  updatePanOverlay(sceneState);
  applyCameraTransform(sceneState);
  setupPanInteractions(sceneState);

  app.ticker.add((ticker) => {
    try {
      animate(sceneState, ticker.deltaTime);
    } catch (error) {
      console.error("PixiJS render error", error);
      app.ticker.stop();
      showSceneError(sceneState, cubeScene, "2D scene render error.");
    }
  });

  const resizeScene = () => {
    app.renderer.resize(Math.max(1, cubeScene.clientWidth), Math.max(1, cubeScene.clientHeight));
    buildBackground(sceneState);
    updatePanOverlay(sceneState);
    if (!sceneState.ready || !sceneState.latestWorld) {
      return;
    }

    renderWorld(sceneState, sceneState.latestWorld, refs);
    applyCameraTransform(sceneState);
  };

  if (typeof ResizeObserver === "function") {
    sceneState.resizeObserver = new ResizeObserver(resizeScene);
    sceneState.resizeObserver.observe(cubeScene);
  } else {
    window.addEventListener("resize", resizeScene);
  }

  requestAnimationFrame(resizeScene);
  sceneState.ready = true;

  try {
    renderWorld(sceneState, sceneState.latestWorld, refs);
    applyCameraTransform(sceneState);
  } catch (error) {
    console.error("Scene sync error", error);
    showSceneError(sceneState, cubeScene, "Unable to display cubes in the 2D scene.");
  }
}
