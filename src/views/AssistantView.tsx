import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, User, CheckCircle2, AlertCircle, Copy, Check, Terminal, ExternalLink, Flame } from 'lucide-react';
import { ChatMessage, ToolCall } from '../types';
import { soundEffects } from '../services/soundEffects';

interface AssistantViewProps {
  messages: ChatMessage[];
  onExecutePrompt: (prompt: string) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ messages, onExecutePrompt }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="jarvis-assistant-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top HUD title */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#ff0033]" />
          <span className="font-bold text-white text-sm tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            NEURAL CONVERSATION STREAM
          </span>
        </div>
        <span className="text-[#ffd700] text-[10px] tracking-wider">GEMINI // STARK TACTICAL PROTOCOL</span>
      </div>

      {/* Messages List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Header tag */}
              <div className="flex items-center gap-2 px-1 text-[10px] text-white/70">
                {isUser ? (
                  <>
                    <span className="text-[#ffd700] font-bold">TONY STARK</span>
                    <User className="w-3 h-3 text-[#ffd700]" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#ff0033]" />
                    <span className="font-bold text-white">J.A.R.V.I.S.</span>
                    {msg.intent && (
                      <span className="px-1.5 py-0.2 rounded-sm bg-black border border-[#880015] text-[#ffd700] text-[9px]">
                        {msg.intent}
                      </span>
                    )}
                  </>
                )}
                <span className="text-white/50 font-mono text-[9px]">{msg.timestamp}</span>
              </div>

              {/* Message Bubble / Card */}
              <div
                className={`max-w-2xl p-4 rounded-sm border leading-relaxed shadow-2xl relative group ${
                  isUser
                    ? 'border-[#ffd700]/60 bg-[#880015]/40 text-white shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                    : 'border-[#880015]/80 bg-[#0a0204]/95 text-white/90 shadow-[0_0_20px_rgba(255,0,51,0.2)]'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed select-text">
                  {msg.content}
                </div>

                {/* Tool execution cards if any */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#880015]/50 space-y-2 font-mono text-[11px]">
                    <div className="text-[10px] text-[#ffd700] uppercase tracking-wider font-semibold font-['Michroma',sans-serif]">
                      Executed Tool Directives:
                    </div>
                    {msg.toolCalls.map((tc) => (
                      <div
                        key={tc.id}
                        className="p-2.5 rounded-sm border border-[#880015] bg-black/60 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-[#ff0033]" />
                            <span>{tc.toolName}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[#ffd700] text-[10px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700]" />
                            <span>{tc.status.toUpperCase()}</span>
                          </span>
                        </div>
                        {tc.result?.message && (
                          <div className="text-white/80 text-[10px] pl-5 font-sans">
                            {tc.result.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Copy button */}
                <button
                  type="button"
                  onClick={() => handleCopy(msg.content, msg.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-sm border border-[#880015] bg-black/80 hover:bg-[#ff0033] hover:text-white text-white/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Copy message"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-[#ffd700]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
