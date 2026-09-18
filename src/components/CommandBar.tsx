import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Terminal } from 'lucide-react';
import { JarvisState } from '../types';

interface CommandBarProps {
  onSendMessage: (text: string) => void;
  isListening: boolean;
  onToggleVoice: () => void;
  jarvisState: JarvisState;
  disabled?: boolean;
  combatMode?: boolean;
}

const SUGGESTIONS = [
  'Run full system diagnostics.',
  'Calibrate Mark VII suit armor.',
  'Initialize development workspace.',
  'Compile the active python project.',
  'Scan memory banks for recent changes.',
  'Analyze orbital telemetry.',
  'Clean up system caches and downloads.',
];

export const CommandBar: React.FC<CommandBarProps> = ({
  onSendMessage,
  isListening,
  onToggleVoice,
  jarvisState,
  disabled = false,
  combatMode = false,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (disabled) return;
    onSendMessage(suggestion);
  };

  return (
    <div
      id="jarvis-command-bar"
      className="w-full border-t border-[#880015]/70 bg-[#070204]/95 backdrop-blur-md p-3 px-4 sm:px-6 flex flex-col gap-2 z-30 shadow-2xl font-['Michroma',sans-serif]"
    >
      {/* Quick suggestions pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[10px]">
        <span className="text-[#ffd700] flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-[#ffd700]" />
          <span>DIRECTIVES:</span>
        </span>
        {SUGGESTIONS.slice(0, 5).map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(s)}
            className="px-2.5 py-1 rounded-sm border border-[#ff0033]/30 bg-black/60 hover:bg-[#880015]/30 hover:border-[#ffd700] text-white/90 hover:text-[#ffd700] whitespace-nowrap transition-all text-[9px] tracking-wider"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Main input HUD */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        {/* Voice Push-To-Talk / Wake Toggle */}
        <button
          id="voice-mic-toggle-btn"
          type="button"
          onClick={onToggleVoice}
          title={isListening ? 'Microphone Active (Tap to Stop)' : 'Engage Voice Command (Tap to Speak)'}
          className={`p-3 rounded-sm border flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
            isListening
              ? 'border-[#ff0033] bg-[#ff0033]/30 text-white ring-2 ring-[#ff0033]/60 shadow-[0_0_15px_#ff0033] animate-pulse'
              : 'border-[#ff0033]/50 bg-black/70 text-[#ffd700] hover:border-[#ffd700] hover:bg-[#880015]/30 hover:shadow-[0_0_10px_#ffd700]'
          }`}
        >
          {isListening ? (
            <Mic className="w-5 h-5 text-[#ff0033]" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Input box */}
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-3 text-[#ff0033]/70 pointer-events-none">
            <Terminal className="w-4 h-4" />
          </div>
          <input
            id="jarvis-command-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder={
              isListening
                ? 'Voice link streaming... (Speak naturally to J.A.R.V.I.S.)'
                : 'Enter directive... (e.g. "Calibrate armor", "Diagnostics", "Dev workspace")'
            }
            className="w-full pl-9 pr-24 py-2.5 sm:py-3 rounded-sm bg-black/80 border border-[#ff0033]/40 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 text-white placeholder:text-white/30 text-xs sm:text-sm tracking-wider transition-all shadow-inner"
          />

          {/* Voice status badge inside input */}
          {isListening && (
            <div className="absolute right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#ff0033]/20 border border-[#ff0033] text-[9px] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff0033] animate-ping" />
              <span>STREAMING</span>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          id="send-command-btn"
          type="submit"
          disabled={!input.trim() || disabled}
          className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 disabled:opacity-30 text-black font-bold text-xs tracking-widest uppercase flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(255,0,51,0.5)] active:scale-95 cursor-pointer"
        >
          <span>EXECUTE</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
