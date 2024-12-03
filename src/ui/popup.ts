export function createPopup(
  contentElement: HTMLElement,
  promptPrefix: string,
): [HTMLElement, HTMLButtonElement] {
  const popup = document.createElement('div');
  popup.classList.add('mimic-popup');

  const popupContent = document.createElement('div');
  popupContent.classList.add('mimic-popup-content');

  const promptElement = document.createElement('p');
  promptElement.textContent = promptPrefix;

  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Enter your input...';

  const runButton = document.createElement('button');
  runButton.classList.add('mimic-run-btn');
  runButton.textContent = 'Run';

  popupContent.appendChild(promptElement);
  popupContent.appendChild(textarea);
  popupContent.appendChild(runButton);

  popup.appendChild(popupContent);

  const rect = contentElement.getBoundingClientRect();
  popup.style.position = 'absolute';
  popup.style.top = `${rect.top + window.scrollY}px`;
  popup.style.left = `${rect.left + window.scrollX + rect.width + 10}px`;

  return [popup, runButton];
}
