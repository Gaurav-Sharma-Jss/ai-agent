import React, { useRef, useEffect, useState } from 'react';
import { Bot, X, Mic, Send, MicOff } from 'lucide-react';
import { Agent } from '../../types/agent';
import { useWidgetChat } from '../../hooks/useWidgetChat';
import { LoadingSpinner } from '../LoadingSpinner';

interface WidgetPreviewProps {
  agent: Agent;
  isOpen: boolean;
  onToggle: () => void;
}

export function WidgetPreview({ agent, isOpen, onToggle }: WidgetPreviewProps) {
  const settings = agent.widgetSettings;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    messages,
    inputMessage,
    isListening,
    setInputMessage,
    sendMessage,
    startListening,
    stopListening
  } = useWidgetChat(agent);
  
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const buttonSizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16'
  };

  const radiusClasses = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-xl',
    large: 'rounded-2xl'
  };

  const getThemeColors = () => {
    if (settings.theme === 'custom' && settings.customColors) {
      return settings.customColors;
    }
    return settings.theme === 'dark' 
      ? { primary: '#3B82F6', background: '#1F2937', text: '#F9FAFB' }
      : { primary: '#3B82F6', background: '#FFFFFF', text: '#111827' };
  };

  const colors = getThemeColors();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sendMessage(inputMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed ${positionClasses[settings.position]} z-50`}>
      {isOpen ? (
        <div 
          className={`${radiusClasses[settings.borderRadius]} shadow-lg overflow-hidden`}
          style={{ 
            width: '320px',
            backgroundColor: colors.background,
            color: colors.text
          }}
        >
          <div 
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="flex items-center gap-2">
              {settings.showAgentImage && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {agent.image ? (
                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
              )}
              <span className="font-medium text-white">{agent.name || 'AI Assistant'}</span>
            </div>
            <button 
              onClick={onToggle}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-96 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {msg.sender === 'user' ? (
                      <div className="w-5 h-5 bg-blue-600 rounded-full" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                }`}
                disabled={isSubmitting}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                disabled={isSubmitting || !inputMessage.trim()}
              >
                {isSubmitting ? <LoadingSpinner /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className={`${buttonSizeClasses[settings.buttonSize]} ${radiusClasses[settings.borderRadius]} shadow-lg flex items-center justify-center transition-transform hover:scale-110`}
          style={{ backgroundColor: colors.primary }}
        >
          {settings.showAgentImage && agent.image ? (
            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
          ) : (
            <Bot className="w-6 h-6 text-white" />
          )}
        </button>
      )}
    </div>
  );
}