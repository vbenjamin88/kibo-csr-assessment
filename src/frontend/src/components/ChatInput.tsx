import React, { useState, useRef, useEffect } from 'react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasDisabled = useRef(false);
  const lastMicStopRef = useRef(0);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  // Auto-focus on initial page load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Restore focus when loading finishes (input goes from disabled to enabled)
  useEffect(() => {
    if (wasDisabled.current && !disabled) {
      inputRef.current?.focus();
    }
    wasDisabled.current = !!disabled;
  }, [disabled]);

  const placeholder = isSmallScreen ? 'Type or speak...' : 'Type or speak your request...';
  const voiceHint = isSmallScreen ? 'Voice: Chrome/Edge' : 'Voice input available in Chrome and Edge.';
  const listeningHint = isSmallScreen ? 'Click mic to stop' : 'Listening... Click mic to stop, then send.';

  const { transcript, listening, startListening, stopListening, supported } =
    useVoiceInput();

  // When mic stops, copy transcript to input only (no send - user must click Send)
  useEffect(() => {
    if (!listening && transcript.trim()) {
      setInput(transcript.trim());
    }
  }, [listening, transcript]);

  const displayValue = supported && listening ? transcript || input : input;

  const doSubmit = () => {
    // Block submit for 400ms after mic stop (prevents accidental post from overlapping touch/click)
    if (Date.now() - lastMicStopRef.current < 400) return;
    const text = (supported && listening ? transcript || input : input).trim();
    if (!text || disabled) return;
    onSend(text);
    setInput('');
  };

  const handleMicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.nativeEvent as Event).stopImmediatePropagation();
    if (listening) {
      lastMicStopRef.current = Date.now();
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2 p-3 sm:p-4 flex-shrink-0">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative flex items-center min-h-[48px]">
          <textarea
            ref={inputRef}
            value={displayValue}
            onChange={(e) => !listening && setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                doSubmit();
              }
            }}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-kibo-yellow focus:border-transparent disabled:opacity-50 min-h-[48px] max-h-[120px] overflow-x-hidden"
            aria-label="Chat message"
          />
          {supported && (
            <button
              type="button"
              onClick={handleMicClick}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors flex items-center justify-center z-20 ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-label={listening ? 'Stop listening' : 'Start voice input'}
              title={listening ? 'Stop listening' : 'Voice input'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={doSubmit}
          disabled={disabled || !(displayValue || '').trim()}
          className="flex-shrink-0 h-[48px] w-[48px] rounded-xl bg-kibo-yellow hover:bg-kibo-yellow-dark dark:bg-kibo-yellow dark:hover:bg-amber-500 text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      {supported && (
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {listening ? listeningHint : voiceHint}
        </p>
      )}
    </form>
  );
};
