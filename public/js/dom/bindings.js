// @ts-check
/**
 * @file dom/bindings.js
 * @description Wires page buttons to Socket.IO events.
 *
 * Responsibilities:
 *   - Bind movement buttons to `cube:move` socket events.
 *   - Bind direction buttons to `cubes:connect` socket events.
 *   - Bind the "find nearest" button to `cube:find-nearest`.
 *
 * @dependencies Socket.IO (via parameter), native DOM.
 */

/**
 * Wires the page buttons to Socket.IO events.
 *
 * @param {{ socket: any, targetInput: HTMLInputElement, directionButtons: HTMLButtonElement[], findNearestBtn: HTMLButtonElement, onFindNearest?: () => void }} params
 */
export function bindControls({ socket, targetInput, directionButtons, findNearestBtn, onFindNearest }) {
  document.querySelectorAll("[data-move]").forEach((button) => {
    const btn = /** @type {HTMLElement} */ (button);
    button.addEventListener("click", () => {
      socket.emit("cube:move", { movement: btn.dataset.move });
    });
  });

  directionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const targetId = targetInput.value.trim();
      if (!targetId) return;
      socket.emit("cubes:connect", { targetId, direction: btn.dataset.dir });
    });
  });

  findNearestBtn.addEventListener("click", () => {
    socket.emit("cube:find-nearest");
    onFindNearest?.();
  });
}
