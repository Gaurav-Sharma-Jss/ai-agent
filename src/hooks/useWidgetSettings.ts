import { useState, useCallback } from 'react';
import { updateWidgetSettings } from '../services/widget/widgetService';
import { Agent } from '../types/agent';
import { useToast } from '../contexts/ToastContext';

export function useWidgetSettings(agentId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveSettings = useCallback(async (settings: Agent['widgetSettings']) => {
    if (!agentId) {
      toast({
        title: 'Error',
        description: 'No agent selected',
        type: 'error'
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateWidgetSettings(agentId, settings);
      toast({
        title: 'Success',
        description: 'Widget settings saved successfully',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Failed to save widget settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save widget settings',
        type: 'error'
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [agentId, toast]);

  return {
    isSaving,
    saveSettings
  };
}