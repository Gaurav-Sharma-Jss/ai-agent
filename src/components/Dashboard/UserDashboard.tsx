import React from 'react';
import { Bot, Users, Activity, Clock } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export function UserDashboard() {
  const { agents } = useAgentStore();
  const { user } = useAuth();

  const totalInteractions = agents.reduce((sum, agent) => 
    sum + agent.analytics.interactions.length, 0);

  const activeAgents = agents.filter(agent => 
    agent.analytics.interactions.some(i => 
      Date.now() - i.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    )
  ).length;

  const lastActivity = agents.reduce((latest, agent) => {
    const lastInteraction = agent.analytics.interactions[0];
    if (!lastInteraction) return latest;
    return lastInteraction.timestamp > latest ? lastInteraction.timestamp : latest;
  }, new Date(0));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Interactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalInteractions}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Last Activity</p>
              <p className="text-2xl font-bold text-gray-900">
                {lastActivity.getTime() > 0 
                  ? formatDistanceToNow(lastActivity, { addSuffix: true })
                  : 'No activity'}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recent Interactions</h3>
          <div className="space-y-4">
            {agents.flatMap(agent => 
              agent.analytics.interactions.slice(0, 3).map(interaction => (
                <div key={interaction.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">{interaction.query}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(interaction.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ).slice(0, 5)}
            {agents.every(agent => agent.analytics.interactions.length === 0) && (
              <p className="text-gray-500 text-center py-4">No recent interactions</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
          <div className="space-y-4">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {agent.image ? (
                    <img src={agent.image} alt={agent.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <Bot className="w-8 h-8 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-500">
                      {agent.analytics.interactions.length} interactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {agent.analytics.interactions.filter(i => i.successful).length} successful
                  </p>
                  <p className="text-xs text-gray-500">
                    {agent.analytics.interactions.length > 0
                      ? `${Math.round((agent.analytics.interactions.filter(i => i.successful).length / agent.analytics.interactions.length) * 100)}% success rate`
                      : 'No data'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}