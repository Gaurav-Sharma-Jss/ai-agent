import React from 'react';
import { BarChart2, Clock, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAnalytics } from '../../hooks/useAnalytics';

export function AnalyticsTab() {
  const { selectedAgent } = useAgentStore();
  const analytics = useAnalytics(selectedAgent);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Interactions</p>
              <p className="text-2xl font-bold">{analytics.totalInteractions.toLocaleString()}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-bold">{analytics.avgResponseTime.toFixed(1)}s</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">User Satisfaction</p>
              <p className="text-2xl font-bold">{Math.round(analytics.userSatisfaction)}%</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold">{Math.round(analytics.successRate)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <BarChart2 className="w-6 h-6" />
          Recent Interactions
        </h3>
        
        <div className="space-y-4">
          {analytics.recentInteractions.map((interaction) => (
            <div key={interaction.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">User Query</p>
                  <p className="text-gray-600">{interaction.query}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {interaction.timestamp.toLocaleString()}
                </span>
              </div>
              <div className="mt-2">
                <p className="font-medium">Agent Response</p>
                <p className="text-gray-600">{interaction.response}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>Response Time: {interaction.responseTime.toFixed(1)}s</span>
                  <span className={`px-2 py-1 rounded ${
                    interaction.successful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {interaction.successful ? 'Successful' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {analytics.recentInteractions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No interactions recorded yet. Start chatting with your agent to see analytics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}