import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Settings, Sliders, BookOpen, BarChart2, Code } from 'lucide-react';
import { AgentTab } from '../Tabs/AgentTab';
import { SettingsTab } from '../Tabs/SettingsTab';
import { TrainingTab } from '../Tabs/TrainingTab';
import { AnalyticsTab } from '../Tabs/AnalyticsTab';
import { WidgetConfigurator } from '../Widget/WidgetConfigurator';

export function TabsContainer() {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
      <Tabs defaultValue="agent">
        <TabsList className="flex gap-2 p-1 mb-6">
          <TabsTrigger value="agent" className="tab-trigger">
            <Settings className="w-4 h-4" />
            Agent
          </TabsTrigger>
          <TabsTrigger value="settings" className="tab-trigger">
            <Sliders className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="training" className="tab-trigger">
            <BookOpen className="w-4 h-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="analytics" className="tab-trigger">
            <BarChart2 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="widget" className="tab-trigger">
            <Code className="w-4 h-4" />
            Widget
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agent">
          <AgentTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
        <TabsContent value="training">
          <TrainingTab />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="widget">
          <WidgetConfigurator />
        </TabsContent>
      </Tabs>
    </div>
  );
}