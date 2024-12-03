import OpenAI from 'openai';
import { Agent } from '../../types/agent';
import { formatTrainingExamples } from '../trainingData';

export async function getOpenAIResponse(message: string, agent: Agent) {
  if (!agent.apiKeys?.openai) {
    throw new Error('OpenAI API key is required');
  }

  const openai = new OpenAI({
    apiKey: agent.apiKeys.openai,
    dangerouslyAllowBrowser: true
  });

  try {
    const systemPrompt = formatTrainingExamples(agent);

    const response = await openai.chat.completions.create({
      model: agent.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response.";
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the Settings tab.');
    }
    throw new Error(error.message);
  }
}