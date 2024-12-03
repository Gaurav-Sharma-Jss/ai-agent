export interface Agent {
  id: string;
  userId: string;
  name: string;
  image?: string;
  language: string;
  firstMessage: string;
  systemPrompt: string;
  voiceSettings: VoiceSettings;
  responseStyle: ResponseStyle;
  interactionMode: InteractionMode;
  behaviorRules: string[];
  apiKeys?: {
    openai?: string;
    gemini?: string;
  };
  llmProvider: 'openai' | 'gemini';
  model: string;
  widgetSettings: WidgetSettings;
  trainingExamples: TrainingExample[];
  analytics: {
    interactions: Array<{
      id: string;
      query: string;
      response: string;
      timestamp: Date;
      responseTime: number;
      successful: boolean;
    }>;
  };
}

export interface TrainingExample {
  input: string;
  output: string;
  category: string;
}

export interface WidgetSettings {
  theme: 'light' | 'dark' | 'custom';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customColors?: {
    primary: string;
    background: string;
    text: string;
  };
  buttonSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  showAgentImage: boolean;
}

export interface VoiceSettings {
  gender: 'male' | 'female';
  pitch: number;
  speed: number;
  accent: string;
}

export type ResponseStyle = 'concise' | 'detailed';
export type InteractionMode = 'informative' | 'conversational' | 'support' | 'interactive';