import React from 'react';
import { User } from '../../types/auth';
import { Users, Bot, Activity } from 'lucide-react';

interface AnalyticsProps {
  users: User[];
}

export function Analytics({ users }: AnalyticsProps) {
  // Calculate total users excluding admin accounts
  const totalUsers = users.filter(user => user.role === 'user').length;

  // Calculate total agents across all users
  const totalAgents = users.reduce((sum, user) => sum + (user.agentCount || 0), 0);

  // Calculate active users (users who logged in within the last 7 days)
  const activeUsers = users.filter(user => {
    const lastLoginDays = (Date.now() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
    return lastLoginDays <= 7 && user.role === 'user';
  }).length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-blue-800">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Agents</p>
              <p className="text-2xl font-bold text-green-800">{totalAgents}</p>
            </div>
            <Bot className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-purple-800">{activeUsers}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}