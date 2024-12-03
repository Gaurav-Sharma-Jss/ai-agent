import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';

export function APIKeysSection() {
  const { selectedAgent, updateAgent } = useAgentStore();
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  const handleAPIKeyChange = (provider: 'openai' | 'gemini', value: string) => {
    if (!selectedAgent) return;
    updateAgent({
      ...selectedAgent,
      apiKeys: {
        ...selectedAgent.apiKeys,
        [provider]: value
      }
    });
  };

  const handleProviderChange = (provider: 'openai' | 'gemini') => {
    if (!selectedAgent) return;
    const models = provider === 'openai' 
      ? ['gpt-3.5-turbo', 'gpt-4'] 
      : ['gemini-pro'];
    
    updateAgent({
      ...selectedAgent,
      llmProvider: provider,
      model: models[0]
    });
  };

  const handleModelChange = (model: string) => {
    if (!selectedAgent) return;
    updateAgent({
      ...selectedAgent,
      model
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Key className="w-6 h-6" />
        API Keys & Model Settings
      </h2>

      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">LLM Provider</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedAgent?.llmProvider}
            onChange={(e) => handleProviderChange(e.target.value as 'openai' | 'gemini')}
          >
            <option value="openai">OpenAI (ChatGPT)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedAgent?.model}
            onChange={(e) => handleModelChange(e.target.value)}
          >
            {selectedAgent?.llmProvider === 'openai' ? (
              <>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </>
            ) : (
              <option value="gemini-pro">Gemini Pro</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showOpenAI ? "text" : "password"}
              value={selectedAgent?.apiKeys?.openai || ''}
              onChange={(e) => handleAPIKeyChange('openai', e.target.value)}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="sk-..."
            />
            <button
              type="button"
              onClick={() => setShowOpenAI(!showOpenAI)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showOpenAI ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Required for ChatGPT integration. Get your API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              OpenAI's platform
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Gemini API Key</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showGemini ? "text" : "password"}
              value={selectedAgent?.apiKeys?.gemini || ''}
              onChange={(e) => handleAPIKeyChange('gemini', e.target.value)}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Gemini API key"
            />
            <button
              type="button"
              onClick={() => setShowGemini(!showGemini)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showGemini ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Required for Gemini AI integration. Get your API key from{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Google AI Studio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}