import React from 'react';
import { useAgentStore } from '../../store/agentStore';
import { Bot, Trash2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function AgentsList() {
  const { agents, selectedAgent, selectAgent, deleteAgent } = useAgentStore();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    if (agents.length === 1) {
      toast({
        title: 'Error',
        description: 'Cannot delete the last agent',
        type: 'error'
      });
      return;
    }

    try {
      await deleteAgent(agentId);
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete agent',
        type: 'error'
      });
    }
  };

  return (
    <div className="border-r border-gray-200 w-64 p-4 space-y-4">
      <h2 className="font-semibold text-gray-700">My Agents</h2>
      <div className="space-y-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => selectAgent(agent.id)}
            className={`group w-full flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
              selectedAgent?.id === agent.id
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {agent.image ? (
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Bot className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <span className="flex-1 text-left truncate">
              {agent.name || 'Unnamed Agent'}
            </span>
            <span className="text-xs text-gray-500">
              {agent.llmProvider === 'openai' ? 'GPT' : 'Gemini'}
            </span>
            <button
              onClick={(e) => handleDelete(e, agent.id)}
              className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-1 transition-opacity"
              aria-label="Delete agent"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}