import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, Check } from 'lucide-react';
import { parseTrainingFile } from '../../utils/fileParser';
import { useAgentStore } from '../../store/agentStore';
import { TrainingExample } from '../../types/agent';

export function FileUploader() {
  const { selectedAgent, addTrainingExample } = useAgentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedAgent) return;

    setIsProcessing(true);
    setUploadStatus(null);

    try {
      const examples = await parseTrainingFile(file);
      examples.forEach(example => {
        addTrainingExample(selectedAgent.id, example);
      });

      setUploadStatus({
        type: 'success',
        message: `Successfully added ${examples.length} training examples`
      });
    } catch (error: any) {
      setUploadStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const examples: TrainingExample[] = [
      {
        input: "What services do you offer?",
        output: "I offer various services including...",
        category: "services"
      },
      {
        input: "How can I contact support?",
        output: "You can contact our support team by...",
        category: "support"
      }
    ];

    const jsonContent = JSON.stringify(examples, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-examples-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.json,.csv"
          className="hidden"
        />
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isProcessing}
            >
              Upload training data
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: .txt, .json, .csv
            </p>
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          uploadStatus.type === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {uploadStatus.type === 'success' ? (
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <p className={`text-sm ${
            uploadStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {uploadStatus.message}
          </p>
        </div>
      )}

      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">File Format Guidelines</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            JSON: Array of objects with input, output, and optional category
          </li>
          <li className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            CSV: Header row followed by input,output,category (category optional)
          </li>
          <li className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            TXT: User: [input] followed by Assistant: [output], separated by blank lines
          </li>
        </ul>
        <button
          onClick={downloadTemplate}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Download template file
        </button>
      </div>
    </div>
  );
}