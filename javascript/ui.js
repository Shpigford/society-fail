document.addEventListener('DOMContentLoaded', () => {
  const collapsibles = document.querySelectorAll('.collapsible');
  let settings = JSON.parse(localStorage.getItem('societyFailSettings')) || {};

  collapsibles.forEach(collapsible => {
    const moduleId = collapsible.closest('[id]').id;
    const isCollapsed = settings[moduleId] === 'collapsed';

    if (isCollapsed) {
      collapsible.classList.add('collapsed');
      collapsible.nextElementSibling.classList.add('collapsed');
    }

    collapsible.addEventListener('click', () => {
      collapsible.classList.toggle('collapsed');
      const content = collapsible.nextElementSibling;
      content.classList.toggle('collapsed');

      settings[moduleId] = collapsible.classList.contains('collapsed') ? 'collapsed' : 'expanded';
      localStorage.setItem('societyFailSettings', JSON.stringify(settings));
    });
  });
});

// Make sure to call this function after any dynamic content updates
function updateLucideIcons() {
  lucide.createIcons();
}