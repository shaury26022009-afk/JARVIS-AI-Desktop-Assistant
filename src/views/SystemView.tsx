import React, { useState } from 'react';
import { Cpu, Zap, HardDrive, Battery, Radio, Shield, Activity, RefreshCw, XCircle } from 'lucide-react';
import { SystemMetrics } from '../types';
import { soundEffects } from '../services/soundEffects';

interface SystemViewProps {
  metrics: SystemMetrics | null;
  onRefreshMetrics: () => void;
}

export const SystemView: React.FC<SystemViewProps> = ({ metrics, onRefreshMetrics }) => {
  const [processes, setProcesses] = useState([
    { pid: 1420, name: 'Code.exe (VS Code)', cpu: 2.4, ramMb: 420 },
    { pid: 8840, name: 'ollama.exe (qwen3:8b)', cpu: 5.1, ramMb: 3850 },
    { pid: 5120, name: 'chrome.exe (YouTube)', cpu: 3.2, ramMb: 610 },
    { pid: 3290, name: 'Discord.exe', cpu: 1.1, ramMb: 240 },
    { pid: 9940, name: 'FlightSimulator.exe', cpu: 0.0, ramMb: 120 },
    { pid: 2110, name: 'WindowsExplorer.exe', cpu: 0.8, ramMb: 180 },
  ]);

  const handleKillProcess = (pid: number) => {
    soundEffects.playClick();
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  const handlePoll = () => {
    soundEffects.playClick();
    onRefreshMetrics();
  };

  return (
    <div id="jarvis-system-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              HARDWARE TELEMETRY &amp; PROCESS CONTROL
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              INTEL CORE i5-13500H • NVIDIA GEFORCE RTX 4050 • 16GB DDR5 • WIN 11
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePoll}
          className="px-3 py-1.5 rounded-sm border border-[#ff0033] bg-[#880015]/40 hover:bg-[#ff0033]/30 text-white flex items-center gap-1.5 transition-all text-[10px] tracking-wider cursor-pointer shadow-[0_0_10px_rgba(255,0,51,0.3)]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>POLL SENSORS</span>
        </button>
      </div>

      {/* Sensor Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CPU */}
        <div className="p-4 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#ff0033]" />
              <span className="font-bold text-[11px]">CPU Core i5</span>
            </span>
            <span className="text-white font-bold text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {metrics?.cpuUsage || 18}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-black border border-[#880015]">
            <div
              className="h-full bg-gradient-to-r from-[#880015] to-[#ff0033] shadow-[0_0_10px_#ff0033] transition-all duration-500"
              style={{ width: `${metrics?.cpuUsage || 18}%` }}
            />
          </div>
          <div className="text-[9px] text-[#ffd700]/80 flex justify-between pt-1">
            <span>Clock: 3.8 GHz</span>
            <span>Temp: 46°C</span>
          </div>
        </div>

        {/* GPU */}
        <div className="p-4 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#ffd700]" />
              <span className="font-bold text-[11px]">RTX 4050 GPU</span>
            </span>
            <span className="text-[#ffd700] font-bold text-sm drop-shadow-[0_0_8px_#ffd700]">
              {metrics?.gpuUsage || 22}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-black border border-[#880015]">
            <div
              className="h-full bg-gradient-to-r from-[#880015] to-[#ffd700] shadow-[0_0_10px_#ffd700] transition-all duration-500"
              style={{ width: `${metrics?.gpuUsage || 22}%` }}
            />
          </div>
          <div className="text-[9px] text-white/70 flex justify-between pt-1">
            <span>VRAM: 3.9 / 6.0 GB</span>
            <span>Temp: 52°C</span>
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-white" />
              <span className="font-bold text-[11px]">16 GB DDR5</span>
            </span>
            <span className="text-white font-bold text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {metrics?.ramUsedGb || 7.9} GB
            </span>
          </div>
          <div className="w-full h-1.5 bg-black border border-[#880015]">
            <div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all duration-500"
              style={{ width: `${((metrics?.ramUsedGb || 7.9) / 16) * 100}%` }}
            />
          </div>
          <div className="text-[9px] text-[#ffd700]/80 flex justify-between pt-1">
            <span>Available: 8.1 GB</span>
            <span>Speed: 5600 MT/s</span>
          </div>
        </div>

        {/* Battery & Power */}
        <div className="p-4 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-[#ffd700]" />
              <span className="font-bold text-[11px]">Power Grid</span>
            </span>
            <span className="text-[#ffd700] font-bold text-sm">82% Charging</span>
          </div>
          <div className="w-full h-1.5 bg-black border border-[#880015]">
            <div className="h-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] transition-all duration-500" style={{ width: '82%' }} />
          </div>
          <div className="text-[9px] text-white/70 flex justify-between pt-1">
            <span>AC: Connected</span>
            <span className="text-[#ff0033]">Profile: Maximum</span>
          </div>
        </div>
      </div>

      {/* Active Windows Process Manager Table */}
      <div className="flex-1 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 overflow-hidden flex flex-col shadow-2xl">
        <div className="p-3 border-b border-[#880015]/70 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <Activity className="w-4 h-4 text-[#ff0033]" />
            <span className="tracking-wider">ACTIVE WINDOWS 11 PROCESSES ({processes.length})</span>
          </div>
          <span className="text-[9px] text-[#ffd700] tracking-widest">PROCESS ISOLATION ACTIVE</span>
        </div>

        <div className="grid grid-cols-12 p-3 border-b border-[#880015]/40 text-[9px] text-white/70 uppercase tracking-wider font-semibold bg-black/40">
          <div className="col-span-2">PID</div>
          <div className="col-span-5">Process Name</div>
          <div className="col-span-2">CPU %</div>
          <div className="col-span-2">RAM (MB)</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#880015]/20 font-mono">
          {processes.map((proc) => (
            <div
              key={proc.pid}
              className="grid grid-cols-12 p-2.5 hover:bg-[#880015]/20 transition-colors items-center text-xs text-white/90"
            >
              <div className="col-span-2 text-[#ffd700] text-[11px]">{proc.pid}</div>
              <div className="col-span-5 font-semibold text-white truncate font-sans text-xs">{proc.name}</div>
              <div className="col-span-2 text-[#ff0033] font-bold">{proc.cpu}%</div>
              <div className="col-span-2 text-white/80">{proc.ramMb} MB</div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleKillProcess(proc.pid)}
                  title="Terminate process"
                  className="p-1 rounded text-[#ff0033] hover:bg-[#880015]/60 hover:text-white transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
