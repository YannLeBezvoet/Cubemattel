// @ts-check
/**
 * @file dom.js
 * @description Barrel re-export for the dom/ sub-modules.
 *
 * Consumers import from this file — the split into sub-modules is an
 * internal detail. Sub-modules:
 *   - dom/refs.js     — getDomRefs
 *   - dom/bindings.js — bindControls
 *   - dom/ui.js       — setSelfBadge, updateCounters, updateDirectionButtons,
 *                        renderHistory, escapeHtml
 */

export { getDomRefs } from "./dom/refs.js";
export { bindControls } from "./dom/bindings.js";
export { setSelfBadge, updateCounters, updateDirectionButtons, renderHistory, escapeHtml } from "./dom/ui.js";
