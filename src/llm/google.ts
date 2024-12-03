declare const ai: any;

export async function generateResponse(
  prompt: string,
  useStreaming: boolean,
  streamingCallback?: (response: string) => void,
): Promise<string> {
  const { available } = await ai.languageModel.capabilities();

  if (available !== 'no') {
    const session = await ai.languageModel.create();

    if (useStreaming) {
      const stream = session.promptStreaming(prompt);
      let result = '';
      for await (const chunk of stream) {
        result = chunk;
        if (streamingCallback) {
          streamingCallback(chunk);
        }
      }
      return result;
    } else {
      const result = await session.prompt(prompt);

      return result;
    }
  } else {
    throw new Error('Google AI API is not available');
  }
}
