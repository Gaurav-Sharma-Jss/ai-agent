import { useCallback } from 'react';
import { Agent } from '../types/agent';
import { useToast } from '../contexts/ToastContext';

export function useApiKeys() {
  const { toast } = useToast();

  const validateApiKey = useCallback((agent: Agent) => {
    if (!agent.apiKeys?.[agent.llmProvider]) {
      const provider = agent.llmProvider === 'openai' ? 'OpenAI' : 'Gemini';
      toast({
        title: `${provider} API Key Required`,
        description: `Please add your ${provider} API key in the Settings tab to use this feature.`,
        type: 'error'
      });
      return false;
    }
    return true;
  }, [toast]);

  return { validateApiKey };
}