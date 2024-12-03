import React from 'react';
import { Settings2 } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';

export function ResponseSettings() {
  const { selectedAgent, updateAgent } = useAgentStore();

  if (!selectedAgent) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings2 className="w-6 h-6" />
        Response Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Response Style</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.responseStyle}
            onChange={(e) => updateAgent({
              ...selectedAgent,
              responseStyle: e.target.value as 'concise' | 'detailed'
            })}
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interaction Mode</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.interactionMode}
            onChange={(e) => updateAgent({
              ...selectedAgent,
              interactionMode: e.target.value as 'informative' | 'conversational' | 'support' | 'interactive'
            })}
          >
            <option value="informative">Informative</option>
            <option value="conversational">Conversational</option>
            <option value="support">Support</option>
            <option value="interactive">Interactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Behavior Rules</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            value={selectedAgent.behaviorRules.join('\n')}
            onChange={(e) => updateAgent({
              ...selectedAgent,
              behaviorRules: e.target.value.split('\n').filter(rule => rule.trim())
            })}
            placeholder="Enter behavior rules, one per line"
          />
          <p className="mt-1 text-sm text-gray-500">
            Add rules to guide the agent's behavior, one per line
          </p>
        </div>
      </div>
    </div>
  );
}