import React from 'react';
import { Volume2, Settings2 } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { APIKeysSection } from '../Settings/APIKeysSection';
import { VoiceSettings } from '../Settings/VoiceSettings';
import { ResponseSettings } from '../Settings/ResponseSettings';

export function SettingsTab() {
  const { selectedAgent } = useAgentStore();

  if (!selectedAgent) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please select or create an agent first
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <VoiceSettings />
      <ResponseSettings />
      <APIKeysSection />
    </div>
  );
}