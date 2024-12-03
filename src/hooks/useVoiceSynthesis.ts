import { useCallback } from 'react';
import { Agent } from '../types/agent';

export function useVoiceSynthesis() {
  const findVoice = useCallback((gender: string, accent: string) => {
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = voices.find(voice => {
      const voiceLower = voice.name.toLowerCase();
      const matchesGender = gender === 'male' ? 
        voiceLower.includes('male') || voiceLower.includes('david') || voiceLower.includes('james') :
        voiceLower.includes('female') || voiceLower.includes('lisa') || voiceLower.includes('sarah');
      
      const matchesAccent = accent === 'neutral' || voiceLower.includes(accent.toLowerCase());
      return matchesGender && matchesAccent;
    });

    // Fallback to any voice matching the gender if no accent match
    if (!matchedVoice) {
      matchedVoice = voices.find(voice => {
        const voiceLower = voice.name.toLowerCase();
        return gender === 'male' ? 
          voiceLower.includes('male') || voiceLower.includes('david') || voiceLower.includes('james') :
          voiceLower.includes('female') || voiceLower.includes('lisa') || voiceLower.includes('sarah');
      });
    }

    return matchedVoice || voices[0];
  }, []);

  const speak = useCallback((text: string, agent: Agent) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = agent.voiceSettings.speed;
    utterance.pitch = agent.voiceSettings.pitch / 10;

    // Ensure voices are loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voice = findVoice(agent.voiceSettings.gender, agent.voiceSettings.accent);
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      };
    } else {
      const voice = findVoice(agent.voiceSettings.gender, agent.voiceSettings.accent);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  }, [findVoice]);

  const testVoice = useCallback((agent: Agent) => {
    const testMessage = `Hello! I am ${agent.name}, your AI assistant. This is a test of my voice settings.`;
    speak(testMessage, agent);
  }, [speak]);

  return { speak, testVoice };
}