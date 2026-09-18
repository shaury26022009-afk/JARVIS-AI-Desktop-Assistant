import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle2, Clock, Check, Loader2, Gamepad2, GraduationCap, Laptop2, Trash2, Flame } from 'lucide-react';
import { AutomationRoutine } from '../types';
import { soundEffects } from '../services/soundEffects';

interface AutomationViewProps {
  automations: AutomationRoutine[];
  onRunAutomation: (id: string) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({ automations, onRunAutomation }) => {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [completedRoutines, setCompletedRoutines] = useState<Record<string, boolean>>({});

  const handleTrigger = (id: string) => {
    soundEffects.playReactorPulse();
    setRunningId(id);
    onRunAutomation(id);

    setTimeout(() => {
      setRunningId(null);
      setCompletedRoutines((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCompletedRoutines((prev) => ({ ...prev, [id]: false }));
      }, 5000);
    }, 1500);
  };

  const getIcon = (id: string) => {
    if (id.includes('study')) return <GraduationCap className="w-5 h-5 text-[#ffd700]" />;
    if (id.includes('gaming')) return <Gamepad2 className="w-5 h-5 text-[#ff0033]" />;
    if (id.includes('clean')) return <Trash2 className="w-5 h-5 text-white" />;
    return <Laptop2 className="w-5 h-5 text-[#ffd700]" />;
  };

  return (
    <div id="jarvis-automation-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              COMPLEX AUTOMATION ROUTINES
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              MULTI-STEP WORKFLOWS • DEV WORKSPACE • SIMULATOR MODE • SUIT CALIBRATION
            </div>
          </div>
        </div>
      </div>

      {/* Routine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(Array.isArray(automations) ? automations : []).map((routine) => {
          const isRunning = runningId === routine.id;
          const isDone = completedRoutines[routine.id];

          return (
            <div
              key={routine.id}
              className="p-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 hover:border-[#ffd700]/70 transition-all flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {getIcon(routine.id)}
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {routine.name}
                    </h3>
                  </div>
                  <span className="text-[9px] text-[#ffd700] uppercase tracking-widest px-2 py-0.5 rounded-sm border border-[#880015] bg-black/60">
                    {routine.steps.length} Steps
                  </span>
                </div>

                <p className="text-white/80 text-xs mb-4 leading-relaxed font-sans">
                  {routine.description}
                </p>

                {/* Steps sequence */}
                <div className="space-y-1.5 pt-2 border-t border-[#880015]/40 mb-4 font-mono">
                  {routine.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-sm bg-black/60 border border-[#880015]/40 flex items-center justify-between text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-white/90">
                        <span className="text-[#ffd700] text-[10px] font-bold">0{idx + 1}.</span>
                        <span>{step.label}</span>
                      </span>
                      <span className="text-[9px] text-[#ff0033] uppercase tracking-wider">
                        {step.toolName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleTrigger(routine.id)}
                  disabled={isRunning}
                  className={`w-full py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isDone
                      ? 'bg-[#ffd700] text-black shadow-[0_0_15px_#ffd700]'
                      : isRunning
                      ? 'bg-[#880015] text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black shadow-[0_0_12px_rgba(255,0,51,0.5)] active:scale-98'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ROUTINE EXECUTED SUCCESSFULLY</span>
                    </>
                  ) : isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>DISPATCHING DIRECTIVES...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>EXECUTE ROUTINE NOW</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
