import { useState, useRef, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface UseSpeechRecognitionProps {
  language: string;
  onResult: (transcript: string) => void;
}

export function useSpeechRecognition({ language, onResult }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const startListening = useCallback(async () => {
    try {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: 'Browser Not Supported',
          description: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
          type: 'error'
        });
        return;
      }

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
      } catch (error) {
        toast({
          title: 'Microphone Access Denied',
          description: 'Please allow microphone access to use speech recognition.',
          type: 'error'
        });
        return;
      }

      // Initialize recognition
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
      }
      const recognition = recognitionRef.current;

      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      // Set up event handlers
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: 'Listening...',
          description: 'Speak now. The microphone will automatically stop after you finish speaking.',
          type: 'info'
        });

        // Set a timeout to stop listening if no speech is detected
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 7000); // 7 seconds timeout
      };

      recognition.onresult = (event: any) => {
        // Clear the timeout since we got a result
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          onResult(transcript);
          recognition.stop();
          toast({
            title: 'Speech Recognized',
            description: 'Processing your message...',
            type: 'success'
          });
        }
      };

      recognition.onerror = (event: any) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        switch (event.error) {
          case 'no-speech':
            toast({
              title: 'No Speech Detected',
              description: 'Please try again and speak clearly into your microphone.',
              type: 'warning'
            });
            break;
          case 'audio-capture':
            toast({
              title: 'Microphone Not Found',
              description: 'Please ensure your microphone is connected and allowed.',
              type: 'error'
            });
            break;
          case 'not-allowed':
            toast({
              title: 'Microphone Access Denied',
              description: 'Please allow microphone access to use speech recognition.',
              type: 'error'
            });
            break;
          default:
            toast({
              title: 'Recognition Error',
              description: 'An error occurred. Please try again.',
              type: 'error'
            });
        }
      };

      recognition.onend = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setIsListening(false);
      };

      // Start recognition
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: 'Recognition Error',
        description: 'Failed to start speech recognition. Please try again.',
        type: 'error'
      });
      setIsListening(false);
    }
  }, [language, onResult, toast]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    startListening,
    stopListening
  };
}