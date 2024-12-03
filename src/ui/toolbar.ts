export function createToolbar(popup: HTMLElement): HTMLElement {
  const toolbar = document.createElement('div');
  toolbar.classList.add('mimic-toolbar');

  const editButton = document.createElement('button');
  editButton.classList.add('mimic-edit-btn');
  editButton.textContent = 'Edit';

  const clearButton = document.createElement('button');
  clearButton.classList.add('mimic-clear-btn');
  clearButton.textContent = 'Clear';

  const saveButton = document.createElement('button');
  saveButton.classList.add('mimic-save-btn');
  saveButton.textContent = 'Save';
  saveButton.disabled = true;

  toolbar.appendChild(editButton);
  toolbar.appendChild(clearButton);
  toolbar.appendChild(saveButton);

  editButton.addEventListener('click', () => {
    saveButton.removeAttribute('disabled');
  });

  clearButton.addEventListener('click', () => {
    const textarea = popup.querySelector('textarea') as HTMLTextAreaElement;
    const responseContainer = popup.querySelector('.mimic-response');
    const ratingSection = popup.querySelector('.rating-buttons');

    textarea.value = '';

    if (responseContainer) responseContainer.remove();
    if (ratingSection) ratingSection.remove();

    saveButton.setAttribute('disabled', 'true');
  });

  return toolbar;
}
