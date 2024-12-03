import { useMemo } from 'react';
import { Agent } from '../types/agent';

export interface AnalyticsData {
  totalInteractions: number;
  avgResponseTime: number;
  userSatisfaction: number;
  successRate: number;
  recentInteractions: Array<{
    id: string;
    query: string;
    response: string;
    timestamp: Date;
    responseTime: number;
    successful: boolean;
  }>;
}

export function useAnalytics(agent: Agent | null): AnalyticsData {
  return useMemo(() => {
    if (!agent) {
      return {
        totalInteractions: 0,
        avgResponseTime: 0,
        userSatisfaction: 0,
        successRate: 0,
        recentInteractions: []
      };
    }

    const interactions = agent.analytics.interactions;
    const totalInteractions = interactions.length;

    // Calculate average response time
    const avgResponseTime = totalInteractions > 0
      ? interactions.reduce((sum, int) => sum + int.responseTime, 0) / totalInteractions
      : 0;

    // Calculate success rate
    const successfulInteractions = interactions.filter(int => int.successful).length;
    const successRate = totalInteractions > 0
      ? (successfulInteractions / totalInteractions) * 100
      : 0;

    // Calculate user satisfaction (based on success rate and response times)
    const userSatisfaction = totalInteractions > 0
      ? (successRate * 0.7) + ((1 - Math.min(avgResponseTime, 5) / 5) * 30)
      : 0;

    return {
      totalInteractions,
      avgResponseTime,
      userSatisfaction,
      successRate,
      recentInteractions: interactions.slice(0, 5)
    };
  }, [agent]);
}