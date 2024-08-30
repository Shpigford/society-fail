document.addEventListener('DOMContentLoaded', () => {
  const collapsibles = document.querySelectorAll('.collapsible');

  collapsibles.forEach(collapsible => {
    collapsible.addEventListener('click', () => {
      collapsible.classList.toggle('collapsed');
      const content = collapsible.nextElementSibling;
      content.classList.toggle('collapsed');
    });
  });
});

// Make sure to call this function after any dynamic content updates
function updateLucideIcons() {
  lucide.createIcons();
}