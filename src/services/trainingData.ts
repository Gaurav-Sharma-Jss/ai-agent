import { Agent, TrainingExample } from '../types/agent';

export const getDefaultTrainingExamples = (agent: Agent): TrainingExample[] => [
  {
    input: "What is your name?",
    output: `My name is ${agent.name}. I am an AI assistant dedicated to helping you.`,
    category: "identity"
  },
  {
    input: "Who are you?",
    output: `I am ${agent.name}, ${agent.systemPrompt.split('.')[0]}.`,
    category: "identity"
  },
  {
    input: "What can you do?",
    output: `As ${agent.name}, I can assist you with various tasks. I communicate in ${
      agent.language === 'en' ? 'English' : 'multiple languages'
    } and aim to be ${agent.responseStyle} in my responses. I'm particularly good at ${
      agent.interactionMode === 'informative' ? 'providing detailed information' :
      agent.interactionMode === 'conversational' ? 'engaging in natural conversations' :
      agent.interactionMode === 'support' ? 'offering support and assistance' :
      'interactive problem-solving'
    }.`,
    category: "capabilities"
  }
];

export const formatTrainingExamples = (agent: Agent): string => {
  const defaultExamples = getDefaultTrainingExamples(agent);
  const allExamples = [...defaultExamples, ...(agent.trainingExamples || [])];
  
  const formattedExamples = allExamples.map(ex => 
    `User: ${ex.input}\nAssistant: ${ex.output}`
  ).join('\n\n');

  return `
${agent.systemPrompt}

Key Characteristics:
- Name: ${agent.name}
- Language: ${agent.language}
- Response Style: ${agent.responseStyle}
- Interaction Mode: ${agent.interactionMode}

Behavior Rules:
${agent.behaviorRules.map(rule => `- ${rule}`).join('\n')}

Training Examples:
${formattedExamples}

Remember to always maintain this identity and follow the behavior rules in all interactions.
`;
};