import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Cpu,
  HardDrive,
  Battery,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Radio,
  Flame,
  Gauge,
} from 'lucide-react';
import { SystemMetrics, ToolCall } from '../types';
import { soundEffects } from '../services/soundEffects';

interface LiveActivityPanelProps {
  metrics: SystemMetrics | null;
  activeToolCalls: ToolCall[];
  activityLogs: { id: string; timestamp: string; event: string; tool: string; status: string }[];
  emergencyStop: boolean;
  onEmergencyStop: () => void;
  onEmergencyResume: () => void;
  combatMode?: boolean;
}

export const LiveActivityPanel: React.FC<LiveActivityPanelProps> = ({
  metrics,
  activeToolCalls,
  activityLogs,
  emergencyStop,
  onEmergencyStop,
  onEmergencyResume,
  combatMode = false,
}) => {
  const handleHaltClick = () => {
    soundEffects.playClick();
    if (emergencyStop) {
      onEmergencyResume();
    } else {
      soundEffects.playReactorPulse();
      onEmergencyStop();
    }
  };

  return (
    <aside
      id="jarvis-activity-panel"
      className="w-80 h-full flex flex-col border-l border-[#880015]/70 bg-[#070204]/95 backdrop-blur-md overflow-hidden text-white/90 font-['Michroma',sans-serif] text-xs select-none transition-colors duration-500 shadow-2xl"
    >
      {/* Header */}
      <div className="p-3 border-b border-[#880015]/70 bg-black/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#ff0033] animate-pulse" />
          <span className="font-bold tracking-widest text-white text-[11px] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {combatMode ? 'COMBAT HUD DIAGNOSTICS' : 'STARK HUD DIAGNOSTICS'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#880015]/60 border border-[#ff0033] text-[9px] text-[#ffd700] shadow-[0_0_8px_rgba(255,0,51,0.4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff0033] animate-ping" />
          <span>LIVE FEED</span>
        </div>
      </div>

      {/* Emergency Status Banner if active */}
      {emergencyStop ? (
        <div className="p-3 bg-[#880015]/90 border-b-2 border-[#ff0033] text-white flex items-center justify-between shadow-[0_0_20px_#ff0033]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ffd700] animate-bounce" />
            <span className="font-bold text-[11px] tracking-wider text-[#ffd700]">HALT ENGAGED</span>
          </div>
          <button
            id="resume-jarvis-button"
            onClick={handleHaltClick}
            className="px-2 py-1 rounded-sm bg-[#ff0033] hover:bg-white hover:text-black text-white font-bold text-[10px] tracking-wider transition-colors shadow-md"
          >
            DISENGAGE
          </button>
        </div>
      ) : null}

      {/* Live Tool Execution Flow */}
      <div className="p-3 border-b border-[#880015]/60 max-h-52 overflow-y-auto space-y-2 bg-black/30">
        <div className="text-[10px] uppercase tracking-wider text-white/70 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#ffd700]" />
            Active Directives
          </span>
          <span className="text-[#ffd700] font-bold px-1.5 py-0.2 rounded bg-black/60 border border-[#ffd700]/40">
            {activeToolCalls.length}
          </span>
        </div>

        {activeToolCalls.length === 0 ? (
          <div className="py-2.5 text-center text-white/40 italic text-[11px]">
            Awaiting task dispatch...
          </div>
        ) : (
          activeToolCalls.map((tc) => (
            <motion.div
              key={tc.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-2 rounded-sm border border-[#ff0033]/30 bg-black/60 hover:border-[#ffd700]/50 transition-all flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-bold truncate max-w-[170px] text-[11px]">
                  {tc.toolName}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-bold ${
                    tc.status === 'completed'
                      ? 'border-[#ffd700] bg-[#ffd700]/15 text-[#ffd700]'
                      : tc.status === 'failed'
                      ? 'border-[#ff0033] bg-[#880015]/60 text-white'
                      : 'border-white bg-white/10 text-white animate-pulse'
                  }`}
                >
                  {tc.status.toUpperCase()}
                </span>
              </div>
              <div className="text-[9px] text-[#ffd700]/70 truncate tracking-wider">
                Risk Level {tc.riskLevel} • {tc.durationMs ? `${tc.durationMs}ms` : 'Running'}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Hardware Telemetry Section */}
      <div className="p-3 border-b border-[#880015]/60 bg-black/40 space-y-2.5">
        <div className="text-[10px] uppercase tracking-wider text-white/70 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-[#ff0033]" />
            Hardware Sensors
          </span>
          <span className="text-[9px] text-[#ffd700]">RTX 4050 / i5-13500H</span>
        </div>

        {/* CPU */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-white/80">
              <Cpu className="w-3.5 h-3.5 text-[#ff0033]" />
              <span>CPU (Intel Core i5)</span>
            </span>
            <span className="font-bold text-white">{metrics?.cpuUsage || 18}%</span>
          </div>
          <div className="w-full h-1.5 bg-black rounded-none overflow-hidden border border-[#880015]">
            <div
              className="h-full bg-gradient-to-r from-[#880015] to-[#ff0033] shadow-[0_0_10px_#ff0033] transition-all duration-500"
              style={{ width: `${metrics?.cpuUsage || 18}%` }}
            />
          </div>
        </div>

        {/* GPU */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-white/80">
              <Zap className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>GPU (RTX 4050 Laptop)</span>
            </span>
            <span className="font-bold text-[#ffd700]">{metrics?.gpuUsage || 22}%</span>
          </div>
          <div className="w-full h-1.5 bg-black rounded-none overflow-hidden border border-[#880015]">
            <div
              className="h-full bg-gradient-to-r from-[#880015] to-[#ffd700] shadow-[0_0_10px_#ffd700] transition-all duration-500"
              style={{ width: `${metrics?.gpuUsage || 22}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-white/80">
              <HardDrive className="w-3.5 h-3.5 text-white" />
              <span>Memory (16 GB DDR5)</span>
            </span>
            <span className="font-bold text-white">
              {metrics?.ramUsedGb || 7.9} / 16.0 GB
            </span>
          </div>
          <div className="w-full h-1.5 bg-black rounded-none overflow-hidden border border-[#880015]">
            <div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all duration-500"
              style={{ width: `${((metrics?.ramUsedGb || 7.9) / 16) * 100}%` }}
            />
          </div>
        </div>

        {/* Battery & Model Status */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-1.5 rounded-sm border border-[#880015] bg-black/60 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] text-white/70">
              <Battery className="w-3 h-3 text-[#ffd700]" />
              <span>Battery</span>
            </span>
            <span className="text-[10px] font-bold text-[#ffd700]">82%</span>
          </div>
          <div className="p-1.5 rounded-sm border border-[#880015] bg-black/60 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] text-white/70">
              <Radio className="w-3 h-3 text-[#ff0033]" />
              <span>Neural</span>
            </span>
            <span className="text-[9px] font-bold text-white">qwen3:8b</span>
          </div>
        </div>
      </div>

      {/* System Event Log */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 bg-black/20">
        <div className="text-[10px] uppercase tracking-wider text-white/70 mb-2 flex items-center justify-between">
          <span>System Event Stream</span>
          <span className="text-[8px] text-[#ffd700]">REALTIME</span>
        </div>
        {activityLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-1.5 text-[10px] text-white/80 border-b border-[#880015]/30 pb-1 font-mono"
          >
            <span className="text-[#ffd700] text-[9px] shrink-0 font-bold">{log.timestamp}</span>
            <span className="text-white/90 leading-tight break-words font-sans text-[11px]">{log.event}</span>
          </div>
        ))}
      </div>

      {/* Footer / Emergency Stop Button */}
      <div className="p-3 border-t border-[#880015]/70 bg-black/60">
        <button
          id="global-stop-jarvis-btn"
          onClick={handleHaltClick}
          className={`w-full py-2.5 px-3 rounded-sm font-['Michroma',sans-serif] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            emergencyStop
              ? 'bg-[#ffd700] hover:bg-[#ffd700]/90 text-black shadow-[0_0_15px_#ffd700]'
              : 'bg-[#ff0033] hover:bg-[#880015] text-white shadow-[0_0_15px_#ff0033] active:scale-95'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{emergencyStop ? 'Resume JARVIS' : 'STOP JARVIS (HALT)'}</span>
        </button>
      </div>
    </aside>
  );
};
