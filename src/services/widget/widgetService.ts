import { db } from '../../config/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Agent } from '../../types/agent';

export interface WidgetInteraction {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  responseTime: number;
  successful: boolean;
}

export async function updateWidgetSettings(
  agentId: string, 
  settings: Agent['widgetSettings']
): Promise<void> {
  try {
    const agentRef = doc(db, 'agents', agentId);
    
    // Clean up the settings object
    const cleanSettings = {
      theme: settings.theme,
      position: settings.position,
      buttonSize: settings.buttonSize,
      borderRadius: settings.borderRadius,
      showAgentImage: settings.showAgentImage,
      customColors: settings.theme === 'custom' 
        ? {
            primary: settings.customColors?.primary || '#3B82F6',
            background: settings.customColors?.background || '#FFFFFF',
            text: settings.customColors?.text || '#1F2937'
          }
        : null
    };

    await updateDoc(agentRef, {
      widgetSettings: cleanSettings,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating widget settings:', error);
    throw new Error('Failed to update widget settings');
  }
}