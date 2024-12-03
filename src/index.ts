
import { attachToElement } from './ui/index';

interface InitOptions {
  provider?: string;
  apiKey?: string;
  autoAttach?: boolean;
  className?: string;
  useStreaming?: boolean;
}

let globalConfig: InitOptions = {
  autoAttach: true,
  className: 'mimic-assist',
  useStreaming: true,
};

export function initMimicAssist(options?: InitOptions) {
  globalConfig = { ...globalConfig, ...options };

  if (globalConfig.autoAttach) {
    document
      .querySelectorAll(`.${globalConfig.className}`)
      .forEach((element) => {
        attachToElement(element as HTMLElement, globalConfig);
      });
  }
}

export { attachToElement };
