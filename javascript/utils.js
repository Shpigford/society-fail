/**
 * Creates Lucide icons if the library is available.
 * This function checks for the presence of the Lucide library and its createIcons method.
 * If available, it creates the icons. Otherwise, it logs a warning.
 */
export function createLucideIcons() {
  // Check if Lucide library and createIcons function are available
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    // Create icons using Lucide
    lucide.createIcons();
  } else {
    // Log a warning if Lucide is not available
    console.warn('Lucide library not loaded or createIcons function not available');
  }
}

import { saveCollapseState, loadCollapseState } from './storage.js';

export function initializeCollapsibles() {
  const collapsibles = document.querySelectorAll('.collapsible');

  collapsibles.forEach(collapsible => {
    const moduleId = collapsible.closest('[id]').id;
    const isCollapsed = loadCollapseState(moduleId);

    if (isCollapsed) {
      collapsible.classList.add('collapsed');
      collapsible.nextElementSibling.classList.add('collapsed');
    }

    collapsible.addEventListener('click', () => {
      collapsible.classList.toggle('collapsed');
      const content = collapsible.nextElementSibling;
      content.classList.toggle('collapsed');

      const newCollapseState = collapsible.classList.contains('collapsed');
      saveCollapseState(moduleId, newCollapseState);
    });
  });
}

/**
 * Initialize collapsible functionality for a specific module
 * @param {string} moduleId - The ID of the module to initialize
 */
export function initializeCollapsibleForModule(moduleId) {
  const module = document.getElementById(moduleId);
  if (!module) return;

  const collapsible = module.querySelector('.collapsible');
  if (!collapsible) return;

  // Load saved collapse state
  const isCollapsed = loadCollapseState(moduleId);

  if (isCollapsed) {
    collapsible.classList.add('collapsed');
    const content = collapsible.nextElementSibling;
    if (content) content.classList.add('collapsed');
  }

  // Add click event listener
  collapsible.addEventListener('click', () => {
    collapsible.classList.toggle('collapsed');
    const content = collapsible.nextElementSibling;
    if (content) content.classList.toggle('collapsed');

    const newCollapseState = collapsible.classList.contains('collapsed');
    saveCollapseState(moduleId, newCollapseState);
  });
}