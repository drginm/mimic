import { generateContent } from './generateContent';

     export class TooltipPanel {
       private element: HTMLElement;
       private context: string;
       private panel: HTMLDivElement;
       private contentDiv: HTMLDivElement;
       private input: HTMLTextAreaElement;
       private generateButton: HTMLButtonElement;
       private clearButton: HTMLButtonElement;

       constructor(element: HTMLElement, context: string) {
         this.element = element;
         this.context = context;
         this.panel = document.createElement('div');
         this.panel.classList.add('tooltip-panel');

         this.input = document.createElement('textarea');
         this.input.value = context;
         this.panel.appendChild(this.input);

         this.generateButton = document.createElement('button');
         this.generateButton.textContent = 'Generate Content';
         this.generateButton.onclick = () => this.handleGenerateClick();
         this.panel.appendChild(this.generateButton);

         this.clearButton = document.createElement('button');
         this.clearButton.textContent = 'Clear';
         this.clearButton.onclick = () => this.handleClearClick();
         this.panel.appendChild(this.clearButton);

         this.contentDiv = document.createElement('div');
         this.panel.appendChild(this.contentDiv);

         this.element.appendChild(this.panel);
       }

       private async handleGenerateClick() {
         const content = await generateContent(this.input.value);
         this.contentDiv.textContent = content;
       }

       private handleClearClick() {
         this.contentDiv.textContent = '';
         this.input.value = '';
       }
     }

     export function attachToElement(element: HTMLElement, context: string) {
       new TooltipPanel(element, context);
     }