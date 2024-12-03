import { useState, useCallback } from 'react';
import { saveWidgetInteraction, WidgetInteraction } from '../services/widget/widgetService';
import { useToast } from '../contexts/ToastContext';

export function useWidgetInteractions(agentId: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const saveInteraction = useCallback(async (
    interaction: Omit<WidgetInteraction, 'id' | 'timestamp'>
  ) => {
    setIsProcessing(true);
    try {
      await saveWidgetInteraction(agentId, interaction);
    } catch (error) {
      console.error('Failed to save interaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to save interaction data',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [agentId, toast]);

  return {
    isProcessing,
    saveInteraction
  };
}