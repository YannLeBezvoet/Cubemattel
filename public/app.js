import { bindControls, getDomRefs, setSelfBadge, updateDirectionButtons } from "./js/dom.js";
import { createScene } from "./js/scene/index.js";

const socket = io();
const dom = getDomRefs();
const scene = createScene(dom);

bindControls({ socket, targetInput: dom.targetInput, directionButtons: dom.directionButtons });

socket.on("connect", () => {
  scene.setMyCubeId(socket.id);
  setSelfBadge(dom.selfBadge, socket.id);
});

socket.on("world:update", (state) => {
  scene.handleWorldUpdate(state);
  // Rafraîchit les boutons de direction si une cible est déjà sélectionnée.
  const targetId = dom.targetInput.value.trim();
  if (targetId) {
    updateDirectionButtons(dom.directionButtons, state.cubes, targetId);
  }
});

scene.setup();
