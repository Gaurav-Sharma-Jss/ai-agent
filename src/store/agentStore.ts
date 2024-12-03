import { create } from 'zustand';
import { Agent } from '../types/agent';
import * as FirestoreService from '../services/firestore/agents';

interface AgentStore {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  loadAgents: (userId: string) => Promise<void>;
  addAgent: (agent: Omit<Agent, 'id'>) => Promise<void>;
  updateAgent: (agent: Agent) => Promise<void>;
  selectAgent: (agentId: string) => void;
  createNewAgent: (userId: string) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
  addTrainingExample: (agentId: string, example: { input: string; output: string; category: string }) => Promise<void>;
  removeTrainingExample: (agentId: string, index: number) => Promise<void>;
  addInteraction: (agentId: string, interaction: { query: string; response: string; responseTime: number; successful: boolean }) => Promise<void>;
}

const defaultAgent: Omit<Agent, 'id' | 'userId'> = {
  name: 'AI Assistant',
  language: 'en',
  firstMessage: 'Hello! I am your AI assistant. How can I help you today?',
  systemPrompt: 'You are a helpful and friendly AI assistant. Always maintain your assigned identity and characteristics.',
  voiceSettings: {
    gender: 'female',
    pitch: 0,
    speed: 1,
    accent: 'neutral'
  },
  responseStyle: 'conversational',
  interactionMode: 'informative',
  behaviorRules: [
    'Always be helpful and friendly',
    'Maintain your assigned identity',
    'Use appropriate language and tone',
    'Be concise but informative'
  ],
  apiKeys: {
    openai: '',
    gemini: ''
  },
  llmProvider: 'openai',
  model: 'gpt-3.5-turbo',
  widgetSettings: {
    theme: 'light',
    position: 'bottom-right',
    buttonSize: 'medium',
    borderRadius: 'medium',
    showAgentImage: true
  },
  trainingExamples: [],
  analytics: {
    interactions: []
  }
};

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,

  loadAgents: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const agents = await FirestoreService.getUserAgents(userId);
      set({ 
        agents, 
        selectedAgent: agents[0] || null,
        error: null 
      });
    } catch (error: any) {
      console.error('Error loading agents:', error);
      set({ 
        error: error.message || 'Failed to load agents',
        agents: [],
        selectedAgent: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addAgent: async (agent) => {
    set({ isLoading: true, error: null });
    try {
      const id = await FirestoreService.createAgent(agent);
      const newAgent = { ...agent, id };
      set(state => ({
        agents: [...state.agents, newAgent],
        selectedAgent: newAgent,
        error: null
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to add agent' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAgent: async (agent) => {
    set({ isLoading: true, error: null });
    try {
      await FirestoreService.updateAgent(agent);
      set(state => ({
        agents: state.agents.map(a => a.id === agent.id ? agent : a),
        selectedAgent: state.selectedAgent?.id === agent.id ? agent : state.selectedAgent,
        error: null
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update agent' });
    } finally {
      set({ isLoading: false });
    }
  },

  selectAgent: (agentId) => {
    set(state => ({
      selectedAgent: state.agents.find(a => a.id === agentId) || null
    }));
  },

  createNewAgent: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const agentData = {
        ...defaultAgent,
        userId
      };
      const id = await FirestoreService.createAgent(agentData);
      const newAgent = { ...agentData, id };
      set(state => ({
        agents: [...state.agents, newAgent],
        selectedAgent: newAgent,
        error: null
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create new agent' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAgent: async (agentId) => {
    set({ isLoading: true, error: null });
    try {
      await FirestoreService.deleteAgent(agentId);
      set(state => {
        const newAgents = state.agents.filter(a => a.id !== agentId);
        return {
          agents: newAgents,
          selectedAgent: state.selectedAgent?.id === agentId ? newAgents[0] || null : state.selectedAgent,
          error: null
        };
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete agent' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTrainingExample: async (agentId, example) => {
    const agent = get().agents.find(a => a.id === agentId);
    if (!agent) return;

    const updatedAgent = {
      ...agent,
      trainingExamples: [...agent.trainingExamples, example]
    };

    await get().updateAgent(updatedAgent);
  },

  removeTrainingExample: async (agentId, index) => {
    const agent = get().agents.find(a => a.id === agentId);
    if (!agent) return;

    const updatedAgent = {
      ...agent,
      trainingExamples: agent.trainingExamples.filter((_, i) => i !== index)
    };

    await get().updateAgent(updatedAgent);
  },

  addInteraction: async (agentId, interaction) => {
    set({ isLoading: true, error: null });
    try {
      await FirestoreService.addInteraction(agentId, interaction);
      const agent = get().agents.find(a => a.id === agentId);
      if (agent) {
        const updatedAgent = {
          ...agent,
          analytics: {
            ...agent.analytics,
            interactions: [
              {
                id: `interaction-${Date.now()}`,
                ...interaction,
                timestamp: new Date()
              },
              ...agent.analytics.interactions
            ]
          }
        };
        set(state => ({
          agents: state.agents.map(a => a.id === agentId ? updatedAgent : a),
          selectedAgent: state.selectedAgent?.id === agentId ? updatedAgent : state.selectedAgent,
          error: null
        }));
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to add interaction' });
    } finally {
      set({ isLoading: false });
    }
  }
}));