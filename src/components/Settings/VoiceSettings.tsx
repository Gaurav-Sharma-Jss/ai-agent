import React from 'react';
import { Volume2, Play } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useVoiceSynthesis } from '../../hooks/useVoiceSynthesis';

export function VoiceSettings() {
  const { selectedAgent, updateAgent } = useAgentStore();
  const { testVoice } = useVoiceSynthesis();

  if (!selectedAgent) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Volume2 className="w-6 h-6" />
          Voice Settings
        </h2>
        <button
          onClick={() => testVoice(selectedAgent)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          Test Voice
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Voice Gender</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.voiceSettings.gender}
            onChange={(e) => updateAgent({
              ...selectedAgent,
              voiceSettings: {
                ...selectedAgent.voiceSettings,
                gender: e.target.value as 'male' | 'female'
              }
            })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Voice Speed</label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={selectedAgent.voiceSettings.speed}
              onChange={(e) => updateAgent({
                ...selectedAgent,
                voiceSettings: {
                  ...selectedAgent.voiceSettings,
                  speed: parseFloat(e.target.value)
                }
              })}
              className="w-full"
            />
            <span className="text-sm text-gray-500 w-12">
              {selectedAgent.voiceSettings.speed}x
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Voice Pitch</label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="range"
              min="-20"
              max="20"
              value={selectedAgent.voiceSettings.pitch}
              onChange={(e) => updateAgent({
                ...selectedAgent,
                voiceSettings: {
                  ...selectedAgent.voiceSettings,
                  pitch: parseInt(e.target.value)
                }
              })}
              className="w-full"
            />
            <span className="text-sm text-gray-500 w-12">
              {selectedAgent.voiceSettings.pitch}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Accent</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.voiceSettings.accent}
            onChange={(e) => updateAgent({
              ...selectedAgent,
              voiceSettings: {
                ...selectedAgent.voiceSettings,
                accent: e.target.value
              }
            })}
          >
            <option value="neutral">Neutral</option>
            <option value="american">American</option>
            <option value="british">British</option>
            <option value="australian">Australian</option>
          </select>
        </div>
      </div>
    </div>
  );
}