import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Loader2, Sparkles } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface FirstRunModalProps {
  onComplete: () => void;
  onPlayGreeting: () => void;
}

const CHECKS = [
  { id: 'win', label: 'Windows 11 Operating System Architecture', status: 'pending' },
  { id: 'ollama', label: 'Local Ollama Runtime Bridge (http://localhost:11434)', status: 'pending' },
  { id: 'model', label: 'Default Local Model Binding (qwen3:8b / Gemini Server)', status: 'pending' },
  { id: 'mic', label: 'Microphone & Web Speech Audio Pipeline', status: 'pending' },
  { id: 'speaker', label: 'SpeechSynthesis Text-to-Speech Engine', status: 'pending' },
  { id: 'core', label: 'J.A.R.V.I.S. Core Kernel & Orchestrator Services', status: 'pending' },
  { id: 'tools', label: 'Tactical Tool Registry (38 System Tools Loaded)', status: 'pending' },
  { id: 'memory', label: 'Arc Reactor & Neural Persistence Matrix', status: 'pending' },
];

export const FirstRunModal: React.FC<FirstRunModalProps> = ({ onComplete, onPlayGreeting }) => {
  const [items, setItems] = useState(CHECKS);
  const [completedIndex, setCompletedIndex] = useState(-1);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < CHECKS.length) {
        soundEffects.playBeep();
        setCompletedIndex(current);
        setItems((prev) =>
          prev.map((item, idx) => (idx <= current ? { ...item, status: 'done' } : item))
        );
        current++;
      } else {
        clearInterval(interval);
        soundEffects.playReactorPulse();
        setAllDone(true);
        setTimeout(() => {
          onPlayGreeting();
        }, 400);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [onPlayGreeting]);

  return (
    <div
      id="first-run-system-check"
      className="fixed inset-0 bg-[#050203]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-['Michroma',sans-serif] text-white"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg rounded-sm border-2 border-[#880015] bg-[#0a0204]/98 p-6 shadow-[0_0_35px_rgba(255,0,51,0.4)] relative"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-[#ff0033] bg-[#880015]/40 text-[#ff0033]">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-[#ffd700] tracking-widest uppercase">
                SYSTEM DIAGNOSTIC SEQUENCE
              </span>
              <h2 className="text-base font-bold text-white tracking-wider mt-0.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                J.A.R.V.I.S. INITIALIZATION CHECK
              </h2>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-sm bg-black border border-[#ffd700] text-[10px] text-[#ffd700] font-bold">
            MARK-XLV
          </div>
        </div>

        {/* Check items list */}
        <div className="space-y-2.5 my-5 font-mono">
          {items.map((item, idx) => {
            const isDone = item.status === 'done';
            const isCurrent = idx === completedIndex + 1 && !allDone;

            return (
              <div
                key={item.id}
                className={`p-2.5 px-3 rounded-sm border text-xs flex items-center justify-between transition-all duration-300 ${
                  isDone
                    ? 'border-[#880015] bg-black/60 text-white'
                    : isCurrent
                    ? 'border-[#ff0033] bg-[#880015]/40 text-white ring-1 ring-[#ff0033]'
                    : 'border-[#880015]/20 bg-black/20 text-white/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#ffd700] font-mono text-[10px]">0{idx + 1}.</span>
                  <span className="text-[11px] font-sans">{item.label}</span>
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#ffd700] shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#ff0033] animate-spin shrink-0" />
                ) : (
                  <span className="text-[9px] text-white/30">[WAIT]</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#880015] flex items-center justify-between">
          <div className="text-xs">
            {allDone ? (
              <span className="text-[#ffd700] font-bold flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                ALL SYSTEMS OPERATIONAL
              </span>
            ) : (
              <span className="text-[#ff0033] flex items-center gap-2 text-[11px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Verifying Stark telemetry...
              </span>
            )}
          </div>

          <button
            id="first-run-enter-btn"
            type="button"
            disabled={!allDone}
            onClick={() => {
              soundEffects.playReactorPulse();
              onComplete();
            }}
            className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 disabled:opacity-30 text-black font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,0,51,0.5)] flex items-center gap-2 cursor-pointer"
          >
            <span>ENTER J.A.R.V.I.S. HUD</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
