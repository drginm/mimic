var MimicAssist = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function createBrainIcon() {
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

    function createPopup(contentElement, promptPrefix) {
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

    function generateResponse$1(prompt, useStreaming, streamingCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const { available } = yield ai.languageModel.capabilities();
            if (available !== 'no') {
                const session = yield ai.languageModel.create();
                if (useStreaming) {
                    const stream = session.promptStreaming(prompt);
                    let result = '';
                    try {
                        for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                            _c = stream_1_1.value;
                            _d = false;
                            const chunk = _c;
                            result = chunk;
                            if (streamingCallback) {
                                streamingCallback(chunk);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return result;
                }
                else {
                    const result = yield session.prompt(prompt);
                    return result;
                }
            }
            else {
                throw new Error('Google AI API is not available');
            }
        });
    }

    function generateResponse(prompt, useStreaming, streamingCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            // For now, we only have Google the implementation
            return yield generateResponse$1(prompt, useStreaming, streamingCallback);
        });
    }

    function attachToElement(element, config) {
        const brainIcon = createBrainIcon();
        element.style.position = 'relative';
        element.appendChild(brainIcon);
        let popup = null;
        let runButton = null;
        brainIcon.addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
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
            runButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!popup || !runButton) {
                    return;
                }
                runButton.disabled = true;
                const userInput = promptPrefix +
                    popup.querySelector('textarea').value || '';
                const elementText = element.textContent || '';
                const prompt = `Using the input text ${elementText} as the base, rewrite the text strictly according to the following modifications: ${userInput}. Produce only the revised text—do not include explanations, comments, or process descriptions. Your response should be the final, rephrased text only.`;
                const preContainer = document.createElement('pre');
                const responseContainer = document.createElement('code');
                responseContainer.classList.add('language-javascript');
                preContainer.appendChild(responseContainer);
                responseContainer.classList.add('mimic-response');
                (_a = popup === null || popup === void 0 ? void 0 : popup.querySelector('.mimic-popup-content')) === null || _a === void 0 ? void 0 : _a.appendChild(preContainer);
                responseContainer.classList.add('typing-indicator');
                try {
                    const responseText = yield generateResponse(prompt, useStreaming, (response) => {
                        if (responseContainer.classList.contains('typing-indicator')) {
                            responseContainer.classList.remove('typing-indicator');
                        }
                        responseContainer.textContent = response;
                    });
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
                }
                catch (error) {
                    responseContainer.classList.remove('typing-indicator');
                    responseContainer.textContent = 'Error generating response.';
                }
            }));
            document.addEventListener('click', function onClickOutside(event) {
                if (popup &&
                    !popup.contains(event.target) &&
                    event.target !== brainIcon) {
                    popup.remove();
                    popup = null;
                    document.removeEventListener('click', onClickOutside);
                }
            });
        }));
    }

    let globalConfig = {
        autoAttach: true,
        className: 'mimic-assist',
        useStreaming: true,
    };
    function initMimicAssist(options) {
        globalConfig = Object.assign(Object.assign({}, globalConfig), options);
        if (globalConfig.autoAttach) {
            document
                .querySelectorAll(`.${globalConfig.className}`)
                .forEach((element) => {
                attachToElement(element);
            });
        }
    }

    exports.attachToElement = attachToElement;
    exports.initMimicAssist = initMimicAssist;

    return exports;

})({});
//# sourceMappingURL=mimic-assist.js.map
