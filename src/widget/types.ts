export interface WidgetConfig {
  agentId: string;
  name?: string;
  image?: string;
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