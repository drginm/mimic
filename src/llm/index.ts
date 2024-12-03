import { generateResponse as generateGoogleResponse } from './google';

export async function generateResponse(prompt: string, useStreaming: boolean, streamingCallback?: (response: string) => void): Promise<string> {
  // For now, we only have Google the implementation
  return await generateGoogleResponse(prompt, useStreaming, streamingCallback);
}
