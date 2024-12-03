export function createBrainIcon(): HTMLElement {
  const icon = document.createElement('div');
  icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24px" height="24px" style="pointer-events: none;">
      <circle cx="32" cy="32" r="30" stroke="#000" stroke-width="2" fill="none"></circle>
    </svg>`;
  icon.style.position = 'absolute';
  icon.style.right = '-30px';
  icon.style.top = '0';
  icon.style.cursor = 'pointer';
  icon.classList.add('mimic-brain-icon');

  return icon;
}
