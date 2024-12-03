import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { AppearanceSettings } from './AppearanceSettings';
import { WidgetPreview } from './WidgetPreview';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';
import { FloatingSaveButton } from '../SaveButton/FloatingSaveButton';

export function WidgetConfigurator() {
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { selectedAgent, updateAgent } = useAgentStore();
  const { isSaving, saveSettings } = useWidgetSettings(selectedAgent?.id || '');

  if (!selectedAgent) return null;

  const widgetCode = `<!-- AI Agent Widget -->
<div id="ai-agent-widget"></div>
<script>
  window.voiceAIConfig = {
    agentId: "${selectedAgent.id}",
    theme: "${selectedAgent.widgetSettings.theme}",
    position: "${selectedAgent.widgetSettings.position}",
    buttonSize: "${selectedAgent.widgetSettings.buttonSize}",
    borderRadius: "${selectedAgent.widgetSettings.borderRadius}",
    showAgentImage: ${selectedAgent.widgetSettings.showAgentImage},
    ${selectedAgent.widgetSettings.theme === 'custom' ? `
    customColors: ${JSON.stringify(selectedAgent.widgetSettings.customColors, null, 2)},` : ''}
  };
</script>
<script src="https://wondrous-melba-0abe63.netlify.app/widget.js" async defer></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSettingsChange = async (newSettings: typeof selectedAgent.widgetSettings) => {
    const updatedAgent = {
      ...selectedAgent,
      widgetSettings: newSettings
    };
    await updateAgent(updatedAgent);
    await saveSettings(newSettings);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <AppearanceSettings
          agent={selectedAgent}
          onChange={handleSettingsChange}
          disabled={isSaving}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5" />
            Embed Code
          </h3>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">HTML</span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <pre className="text-gray-100 text-sm overflow-x-auto whitespace-pre-wrap">
              {widgetCode}
            </pre>
          </div>
        </div>
      </div>

      <WidgetPreview
        agent={selectedAgent}
        isOpen={isPreviewOpen}
        onToggle={() => setIsPreviewOpen(!isPreviewOpen)}
      />

      {isSaving && (
        <FloatingSaveButton
          onSave={() => {}}
          hasChanges={false}
          isLoading={true}
        />
      )}
    </div>
  );
}