import React from 'react';
import { Paintbrush } from 'lucide-react';
import { Agent } from '../../types/agent';
import { FormField } from '../Form/FormField';

interface AppearanceSettingsProps {
  agent: Agent;
  onChange: (settings: Agent['widgetSettings']) => void;
}

export function AppearanceSettings({ agent, onChange }: AppearanceSettingsProps) {
  const handleChange = (key: keyof Agent['widgetSettings'], value: any) => {
    const newSettings = {
      ...agent.widgetSettings,
      [key]: value
    };

    // Handle theme change
    if (key === 'theme') {
      newSettings.customColors = value === 'custom' 
        ? {
            primary: '#3B82F6',
            background: '#FFFFFF',
            text: '#1F2937'
          }
        : null;
    }

    onChange(newSettings);
  };

  const handleColorChange = (key: string, value: string) => {
    onChange({
      ...agent.widgetSettings,
      customColors: {
        ...agent.widgetSettings.customColors,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Paintbrush className="w-5 h-5" />
        Appearance Settings
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={agent.widgetSettings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {agent.widgetSettings.theme === 'custom' && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Color</label>
              <input
                type="color"
                value={agent.widgetSettings.customColors?.primary || '#3B82F6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <input
                type="color"
                value={agent.widgetSettings.customColors?.background || '#FFFFFF'}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Color</label>
              <input
                type="color"
                value={agent.widgetSettings.customColors?.text || '#1F2937'}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="mt-1 block w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={agent.widgetSettings.position}
            onChange={(e) => handleChange('position', e.target.value)}
          >
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Button Size</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={agent.widgetSettings.buttonSize}
            onChange={(e) => handleChange('buttonSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Border Radius</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={agent.widgetSettings.borderRadius}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
          >
            <option value="none">None</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Show Agent Image</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={agent.widgetSettings.showAgentImage}
              onChange={(e) => handleChange('showAgentImage', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}