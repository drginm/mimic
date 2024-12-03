import { createBrainIcon } from './icon';
import { createPopup } from './popup';
import { createToolbar } from './toolbar';
import { generateResponse } from '../llm/index';

interface ConfigOptions {
  useStreaming?: boolean;
}

export function attachToElement(element: HTMLElement, config: ConfigOptions) {
  const brainIcon = createBrainIcon();

  element.style.position = 'relative';
  element.appendChild(brainIcon);

  let popup: HTMLElement | null = null;
  let runButton: HTMLButtonElement | null = null;

  brainIcon.addEventListener('click', async (event) => {
    const expectedResponse =
      element.getAttribute('data-expected-response') || '';
    const promptPrefix = `${element.getAttribute('data-prompt-prefix')} ` || '';

    const useStreamingTemp = element.getAttribute('data-prompt-use-streaming');
    let useStreaming = true;
    if (useStreamingTemp) {
      useStreaming = useStreamingTemp === 'true';
    }

    event.stopPropagation();

    if (popup) {
      popup.remove();
      popup = null;
      return;
    }

    [popup, runButton] = createPopup(element, promptPrefix);
    document.body.appendChild(popup);

    runButton.addEventListener('click', async () => {
      if (!popup || !runButton) {
        return;
      }
      runButton.disabled = true;
      const userInput =
        promptPrefix +
          (popup.querySelector('textarea') as HTMLTextAreaElement).value || '';
      const elementText = element.textContent || '';
      const prompt = `Using the input text ${elementText} as the base, rewrite the text strictly according to the following modifications: ${userInput}. Produce only the revised text—do not include explanations, comments, or process descriptions. Your response should be the final, rephrased text only.`;

      const preContainer = document.createElement('pre');
      const responseContainer = document.createElement('code');
      responseContainer.classList.add('language-javascript');
      preContainer.appendChild(responseContainer);
      responseContainer.classList.add('mimic-response');

      popup?.querySelector('.mimic-popup-content')?.appendChild(preContainer);

      responseContainer.classList.add('typing-indicator');
      try {
        const responseText = await generateResponse(
          prompt,
          useStreaming,
          (response) => {
            if (responseContainer.classList.contains('typing-indicator')) {
              responseContainer.classList.remove('typing-indicator');
            }

            responseContainer.textContent = response;
          },
        );
        if (!useStreaming) {
          responseContainer.textContent = responseText;
          responseContainer.classList.remove('typing-indicator');
        }
        runButton.disabled = false;

        /*if (expectedResponse) {
          const comparisonResult = compareResponses(responseText, expectedResponse);
          const ratingSection = createRatingSection(comparisonResult);
          popup?.querySelector('.mimic-popup-content')?.appendChild(ratingSection);
        }*/
      } catch (error) {
        responseContainer.classList.remove('typing-indicator');
        responseContainer.textContent = 'Error generating response.';
      }
    });

    document.addEventListener('click', function onClickOutside(event) {
      if (
        popup &&
        !popup.contains(event.target as Node) &&
        event.target !== brainIcon
      ) {
        popup.remove();
        popup = null;
        document.removeEventListener('click', onClickOutside);
      }
    });
  });
}

function compareResponses(generated: string, expected: string): boolean {
  return generated.trim() === expected.trim();
}

function createRatingSection(isMatch: boolean): HTMLElement {
  const ratingDiv = document.createElement('div');
  ratingDiv.classList.add('rating-buttons');

  const message = document.createElement('p');
  message.textContent = isMatch
    ? 'The response matches the expected output.'
    : 'The response does not match the expected output.';
  ratingDiv.appendChild(message);

  const thumbsUp = document.createElement('button');
  thumbsUp.textContent = '👍';
  const thumbsDown = document.createElement('button');
  thumbsDown.textContent = '👎';

  ratingDiv.appendChild(thumbsUp);
  ratingDiv.appendChild(thumbsDown);

  thumbsUp.addEventListener('click', () => {
    alert('Thank you for your feedback!');
  });
  thumbsDown.addEventListener('click', () => {
    alert('We appreciate your feedback and will work to improve.');
  });

  return ratingDiv;
}
