import { Widget } from './components/Widget';
import { WidgetConfig } from './types';

declare global {
  interface Window {
    voiceAIConfig?: WidgetConfig;
  }
}

// Initialize widget when the script loads
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('ai-agent-widget');
  if (container && window.voiceAIConfig) {
    const widget = new Widget();
    container.appendChild(widget);
  } else {
    console.error('Widget container not found or configuration missing');
  }
});