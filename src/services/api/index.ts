import { Agent } from '../../types/agent';
import { getOpenAIResponse } from './openai';
import { getGeminiResponse } from './gemini';

export async function getChatResponse(message: string, agent: Agent): Promise<string> {
  try {
    if (!agent.apiKeys?.[agent.llmProvider]) {
      throw new Error(`${agent.llmProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key is required`);
    }

    const response = await (agent.llmProvider === 'openai' 
      ? getOpenAIResponse(message, agent)
      : getGeminiResponse(message, agent));

    return response;
  } catch (error: any) {
    console.error('API error:', error);
    throw new Error(error.message || 'Failed to get response from AI service');
  }
}