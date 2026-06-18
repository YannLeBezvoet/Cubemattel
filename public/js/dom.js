/**
 * @file dom.js
 * @description Centralise les accès DOM et les bindings d'événements.
 *
 * Responsabilités :
 *   - Fournir une référence unique à tous les éléments DOM utilisés.
 *   - Brancher les boutons sur les événements Socket.IO.
 *   - Mettre à jour l'état des boutons de direction en fonction des faces
 *     disponibles du cube cible sélectionné.
 *
 * @dependencies Socket.IO (via paramètre), DOM natif
 */

/** Décalages de position pour chaque direction (relatifs au cube cible). */
const DIRECTION_OFFSETS = {
  above: [0, -1],
  below: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/**
 * Retourne les références aux éléments DOM utilisés par l'application.
 *
 * @returns {{ historyList: HTMLElement, targetInput: HTMLInputElement, directionButtons: HTMLButtonElement[], selfBadge: HTMLElement, cubeCount: HTMLElement, linkCount: HTMLElement, cubeScene: HTMLElement }}
 */
export function getDomRefs() {
  return {
    historyList: document.getElementById("history"),
    targetInput: document.getElementById("targetId"),
    directionButtons: [...document.querySelectorAll(".dir-btn")],
    selfBadge: document.getElementById("selfBadge"),
    cubeCount: document.getElementById("cubeCount"),
    linkCount: document.getElementById("linkCount"),
    cubeScene: document.getElementById("cubeScene"),
  };
}

/**
 * Branche les boutons de la page sur les événements Socket.IO.
 *
 * @param {{ socket: object, targetInput: HTMLInputElement, directionButtons: HTMLButtonElement[] }} params
 */
export function bindControls({ socket, targetInput, directionButtons }) {
  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      socket.emit("cube:move", { movement: button.dataset.move });
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
}

/**
 * Affiche l'identité locale du joueur connecté.
 *
 * @param {HTMLElement} selfBadge
 * @param {string} cubeId
 */
export function setSelfBadge(selfBadge, cubeId) {
  selfBadge.textContent = `Mon cube : ${cubeId.slice(0, 6)}`;
}

/**
 * Met à jour les compteurs visibles dans l'interface.
 *
 * @param {{ cubeCount: HTMLElement, linkCount: HTMLElement, cubeTotal: number, linkTotal: number }} params
 */
export function updateCounters({ cubeCount, linkCount, cubeTotal, linkTotal }) {
  cubeCount.textContent = `${cubeTotal} ${cubeTotal > 1 ? "cubes" : "cube"}`;
  linkCount.textContent = `${linkTotal} ${linkTotal > 1 ? "liens" : "lien"}`;
}

/**
 * Active ou désactive les boutons de direction selon les faces disponibles
 * du cube cible dans l'état monde courant.
 * Une face est indisponible si une autre cube l'occupe déjà.
 *
 * @param {HTMLButtonElement[]} directionButtons
 * @param {Array<{ id: string, x: number, y: number }>} cubes - Snapshot monde
 * @param {string} targetId - ID du cube cible sélectionné
 */
export function updateDirectionButtons(directionButtons, cubes, targetId) {
  const target = cubes?.find((c) => c.id === targetId);

  directionButtons.forEach((btn) => {
    const dir = btn.dataset.dir;
    if (!target) {
      btn.disabled = true;
      btn.classList.remove("selected");
      return;
    }
    const [dx, dy] = DIRECTION_OFFSETS[dir];
    const occupied = (cubes ?? []).some(
      (c) => c.id !== targetId && c.x === target.x + dx && c.y === target.y + dy
    );
    btn.disabled = occupied;
    if (occupied) {
      btn.classList.remove("selected");
    }
  });
}

/**
 * Rend l'historique serveur dans l'ordre inverse de lecture.
 *
 * @param {HTMLElement} historyList
 * @param {Array<{ text: string, timestamp: number }>} history
 */
export function renderHistory(historyList, history) {
  if (!history.length) {
    historyList.innerHTML = '<li class="empty-state">La ville attend ses premiers mouvements.</li>';
    return;
  }

  historyList.innerHTML = history
    .slice()
    .reverse()
    .map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `<li class="history-item"><span>${time}</span>${escapeHtml(entry.text)}</li>`;
    })
    .join("");
}

/**
 * Échappe les contenus texte avant insertion dans le DOM.
 *
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
