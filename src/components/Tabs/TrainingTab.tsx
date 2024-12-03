import React, { useState } from 'react';
import { BookOpen, MessageCircle, Upload, FileText, Plus, Trash2 } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { TrainingExample } from '../../types/agent';
import { getDefaultTrainingExamples } from '../../services/trainingData';
import { FileUploader } from '../Training/FileUploader';

export function TrainingTab() {
  const { selectedAgent, addTrainingExample, removeTrainingExample } = useAgentStore();
  const [newExample, setNewExample] = useState<TrainingExample>({
    input: '',
    output: '',
    category: 'custom'
  });

  if (!selectedAgent) return null;

  const defaultExamples = getDefaultTrainingExamples(selectedAgent);

  const handleAddExample = () => {
    if (newExample.input.trim() && newExample.output.trim()) {
      addTrainingExample(selectedAgent.id, { ...newExample });
      setNewExample({ input: '', output: '', category: 'custom' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Training Data
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Upload Training Data</h3>
            <FileUploader />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Default Training Examples</h3>
            <div className="space-y-4">
              {defaultExamples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-500">Category: {example.category}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User Input</label>
                      <div className="mt-1 p-2 bg-white rounded border">
                        {example.input}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assistant Response</label>
                      <div className="mt-1 p-2 bg-white rounded border">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Training Examples</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Add New Example</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Input</label>
                    <input
                      type="text"
                      value={newExample.input}
                      onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter user message..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assistant Response</label>
                    <textarea
                      value={newExample.output}
                      onChange={(e) => setNewExample(prev => ({ ...prev, output: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter expected response..."
                    />
                  </div>
                  <button
                    onClick={handleAddExample}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Example
                  </button>
                </div>
              </div>

              {selectedAgent.trainingExamples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-500">Custom Example #{index + 1}</span>
                    <button
                      onClick={() => removeTrainingExample(selectedAgent.id, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User Input</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded">
                        {example.input}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assistant Response</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}