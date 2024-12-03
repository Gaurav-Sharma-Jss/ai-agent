import { useState, useCallback } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback(({ text, sender }: { text: string; sender: 'user' | 'bot' }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    addMessage,
    setIsLoading,
    setError
  };
}