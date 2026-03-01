import { useState, useCallback, useRef } from 'react';

const Recognition =
  typeof window !== 'undefined'
    ? ((window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
       (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition)
    : undefined;

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: { results: { length: number; [i: number]: { isFinal: boolean; 0?: { transcript: string } } } }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

let activeRecognition: SpeechRecognitionLike | null = null;

export function useVoiceInput() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const transcriptRef = useRef('');
  transcriptRef.current = transcript;
  const supported = !!Recognition;

  const startListening = useCallback(() => {
    if (!Recognition) return;
    if (activeRecognition) activeRecognition.stop();
    setTranscript('');
    transcriptRef.current = '';
    const rec = new Recognition() as SpeechRecognitionLike;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r[0]) text += r[0].transcript;
      }
      setTranscript(text);
      transcriptRef.current = text;
    };
    rec.onend = () => {
      setListening(false);
      activeRecognition = null;
    };
    rec.onerror = () => {
      setListening(false);
      activeRecognition = null;
    };
    activeRecognition = rec;
    rec.start();
    setListening(true);
  }, [Recognition]);

  const stopListening = useCallback(() => {
    if (activeRecognition) {
      activeRecognition.stop();
      activeRecognition = null;
    }
    setListening(false);
  }, []);

  return { transcript, listening, startListening, stopListening, supported };
}
