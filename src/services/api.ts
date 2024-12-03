import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent } from '../types/agent';
import { getDefaultTrainingExamples, formatTrainingExamples } from './trainingData';

export async function getChatResponse(message: string, agent: Agent) {
  if (agent.llmProvider === 'openai') {
    return getOpenAIResponse(message, agent);
  } else {
    return getGeminiResponse(message, agent);
  }
}

async function getOpenAIResponse(message: string, agent: Agent) {
  const openai = new OpenAI({
    apiKey: agent.apiKeys.openai,
    dangerouslyAllowBrowser: true
  });

  const trainingExamples = getDefaultTrainingExamples(agent);
  const systemPrompt = formatTrainingExamples(agent, trainingExamples);

  try {
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
    throw new Error(error.message);
  }
}

async function getGeminiResponse(message: string, agent: Agent) {
  const genAI = new GoogleGenerativeAI(agent.apiKeys.gemini);
  const model = genAI.getGenerativeModel({ model: agent.model });

  const trainingExamples = getDefaultTrainingExamples(agent);
  const systemPrompt = formatTrainingExamples(agent, trainingExamples);
  
  try {
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(error.message);
  }
}