import React from 'react';
import { Settings } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { ImageSelector } from '../Agent/ImageSelector';
import { LanguageSelector } from '../Agent/LanguageSelector';
import { FormField } from '../Form/FormField';
import { FloatingSaveButton } from '../SaveButton/FloatingSaveButton';
import { useFormChanges } from '../../hooks/useFormChanges';

export function AgentTab() {
  const { selectedAgent, updateAgent } = useAgentStore();
  const { currentData, hasChanges, updateField, resetChanges } = useFormChanges(selectedAgent);

  const handleSave = async () => {
    if (!currentData) return;
    await updateAgent(currentData);
    resetChanges();
  };

  if (!selectedAgent || !currentData) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Agent Configuration
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Image</label>
            <ImageSelector
              value={currentData.image || ''}
              onChange={(value) => updateField('image', value)}
            />
          </div>

          <FormField
            label="Agent Name"
            value={currentData.name}
            onChange={(value) => updateField('name', value)}
            placeholder="Enter agent name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <div className="mt-1">
              <LanguageSelector
                value={currentData.language}
                onChange={(value) => updateField('language', value)}
              />
            </div>
          </div>

          <FormField
            label="First Message"
            value={currentData.firstMessage}
            onChange={(value) => updateField('firstMessage', value)}
            type="textarea"
            placeholder="Enter the initial greeting message"
          />

          <FormField
            label="System Prompt"
            value={currentData.systemPrompt}
            onChange={(value) => updateField('systemPrompt', value)}
            type="textarea"
            rows={5}
            placeholder="Define how the AI agent should behave"
          />
        </div>
      </div>

      <FloatingSaveButton
        onSave={handleSave}
        hasChanges={hasChanges}
      />
    </div>
  );
}