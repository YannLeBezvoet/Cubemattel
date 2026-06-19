// @ts-check
/**
 * @file dom/refs.js
 * @description Returns references to all DOM elements used by the application.
 *
 * Centralises element lookups so no other module queries the DOM directly.
 * All elements are cast to their correct types for type-checking.
 *
 * @dependencies None — reads from the native DOM only.
 */

/**
 * Returns references to the DOM elements used by the application.
 *
 * @returns {{ historyList: HTMLElement, targetInput: HTMLInputElement, directionButtons: HTMLButtonElement[], findNearestBtn: HTMLButtonElement, selfBadge: HTMLElement, cubeCount: HTMLElement, linkCount: HTMLElement, cubeScene: HTMLElement }}
 */
export function getDomRefs() {
  return {
    historyList: /** @type {HTMLElement} */ (document.getElementById("history")),
    targetInput: /** @type {HTMLInputElement} */ (document.getElementById("targetId")),
    directionButtons: /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(".dir-btn")]),
    findNearestBtn: /** @type {HTMLButtonElement} */ (document.getElementById("findNearestBtn")),
    selfBadge: /** @type {HTMLElement} */ (document.getElementById("selfBadge")),
    cubeCount: /** @type {HTMLElement} */ (document.getElementById("cubeCount")),
    linkCount: /** @type {HTMLElement} */ (document.getElementById("linkCount")),
    cubeScene: /** @type {HTMLElement} */ (document.getElementById("cubeScene")),
  };
}
