import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IronMan3DCore } from '../components/IronMan3DCore';
import { AudioMatrixVisualizer } from '../components/AudioMatrixVisualizer';
import { JarvisState, SystemMetrics, MemoryItem, AutomationRoutine } from '../types';
import { soundEffects } from '../services/soundEffects';
import { voiceService } from '../services/voiceService';
import {
  Sparkles,
  Terminal,
  Code2,
  FolderOpen,
  Mic,
  Cpu,
  Globe,
  MessageSquare,
  Brain,
  Zap,
  Activity,
  Radio,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PowerOff,
  Flame,
  Clock,
  RotateCcw,
  Crosshair,
  Layers,
  HardDrive,
} from 'lucide-react';

interface HomeViewProps {
  jarvisState: JarvisState;
  metrics: SystemMetrics | null;
  memories: MemoryItem[];
  automations: AutomationRoutine[];
  isListening: boolean;
  onToggleVoice: () => void;
  onExecutePrompt: (prompt: string) => void;
  onNavigateTab: (tab: any) => void;
  combatMode?: boolean;
  onToggleCombatMode?: () => void;
  recentMessages?: { sender: 'user' | 'jarvis' | 'system'; content: string }[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  jarvisState,
  metrics,
  memories,
  automations,
  isListening,
  onToggleVoice,
  onExecutePrompt,
  onNavigateTab,
  combatMode = false,
  onToggleCombatMode,
  recentMessages = [],
}) => {
  const [soundMuted, setSoundMuted] = useState(!soundEffects.enabled);
  const [altitude, setAltitude] = useState(12450);
  const [speedMach, setSpeedMach] = useState(2.8);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // 12-Hour Stark Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to voice errors if any
  useEffect(() => {
    voiceService.onError = (err) => {
      setMicNotice(err);
      setTimeout(() => setMicNotice(null), 5000);
    };
  }, []);

  // Subtle flight altitude telemetry variation
  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude((prev) => Math.max(9000, Math.min(24000, prev + (Math.random() * 60 - 28))));
      setSpeedMach((prev) => Number(Math.max(1.2, Math.min(3.4, prev + (Math.random() * 0.1 - 0.05))).toFixed(2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    soundEffects.enabled = !soundEffects.enabled;
    setSoundMuted(!soundEffects.enabled);
    if (soundEffects.enabled) soundEffects.playClick();
  };

  const handleMicToggle = () => {
    soundEffects.playReactorPulse();
    onToggleVoice();
  };

  const handleSkipAudio = () => {
    soundEffects.playClick();
    voiceService.stopSpeaking();
  };

  const toggleFullScreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleActionChip = (prompt: string) => {
    soundEffects.playClick();
    onExecutePrompt(prompt);
  };

  // Status computation for HUD indicator
  const getStatusText = () => {
    if (isListening || jarvisState === 'listening') return 'LISTENING';
    if (jarvisState === 'speaking') return 'TALKING';
    if (jarvisState === 'thinking' || jarvisState === 'executing') return 'PROCESSING';
    if (combatMode) return 'COMBAT PROTOCOL';
    return 'SYSTEM STANDBY';
  };

  const statusText = getStatusText();
  const isTalking = jarvisState === 'speaking';
  const isBusy = isListening || isTalking || jarvisState === 'thinking' || jarvisState === 'executing';

  // Format 12-Hour Clock
  const format12Hour = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${ampm} // ${date.toLocaleDateString()}`;
  };

  // Recent user and jarvis exchange
  const latestUserMsg = [...recentMessages].reverse().find((m) => m.sender === 'user')?.content || 'Awaiting vocal directive...';
  const latestJarvisMsg = [...recentMessages].reverse().find((m) => m.sender === 'jarvis')?.content || 'All Stark S.H.I.E.L.D. systems operational, sir.';

  // Launcher matrix items
  const launcherItems = [
    { id: 'armor', label: 'Mark XLV', icon: Flame, action: () => onExecutePrompt('Run complete Mark XLV suit armor telemetry scan.'), color: 'text-[#ffd700]' },
    { id: 'assistant', label: 'AI Voice', icon: MessageSquare, action: () => onNavigateTab('assistant'), color: 'text-white' },
    { id: 'coding', label: 'Dev Matrix', icon: Code2, action: () => onNavigateTab('coding'), color: 'text-[#ff0033]' },
    { id: 'files', label: 'File Drive', icon: FolderOpen, action: () => onNavigateTab('files'), color: 'text-[#ffd700]' },
    { id: 'browser', label: 'Web Scout', icon: Globe, action: () => onNavigateTab('browser'), color: 'text-white' },
    { id: 'comms', label: 'Encrypted', icon: Radio, action: () => onNavigateTab('messages'), color: 'text-[#ff0033]' },
    { id: 'memory', label: 'Synapse', icon: Brain, action: () => onNavigateTab('memory'), color: 'text-[#ffd700]' },
    { id: 'system', label: 'Hardware', icon: Activity, action: () => onNavigateTab('system'), color: 'text-white' },
    {
      id: 'combat',
      label: combatMode ? 'Standby' : 'Combat HUD',
      icon: combatMode ? RotateCcw : Crosshair,
      action: () => {
        if (onToggleCombatMode) onToggleCombatMode();
        soundEffects.playClick();
      },
      color: combatMode ? 'text-[#ffd700]' : 'text-[#ff0033]',
    },
  ];

  return (
    <div
      id="jarvis-ironman-hud"
      className="relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden bg-[#050203] text-white flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none font-['Michroma',sans-serif]"
    >
      {/* Ambient Radial Gradient Overlay for Stark Cinematic Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,0,51,0.06)_0%,rgba(255,215,0,0.03)_40%,rgba(5,2,3,0.92)_85%)] z-0" />

      {/* Mic Notice Banner if permission is needed */}
      <AnimatePresence>
        {micNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-30 mb-3 p-2.5 rounded-lg border border-[#ff0033] bg-[#880015]/80 text-[#ffd700] text-xs flex items-center justify-between shadow-[0_0_15px_rgba(255,0,51,0.5)]"
          >
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#ff0033] animate-pulse" />
              <span>{micNotice}</span>
            </div>
            <button
              onClick={() => setMicNotice(null)}
              className="text-xs text-white/80 hover:text-white px-2 py-0.5 border border-white/30 rounded"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER: Stark Tactical OS // Mark XLV */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between border-b-2 border-[#880015] pb-3 md:pb-4 gap-4">
        {/* Stark Brand */}
        <div className="flex flex-col">
          <h1 className="m-0 text-xl sm:text-2xl md:text-3xl tracking-[0.25em] font-normal text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] flex items-center gap-2">
            <span>J.A.R.V.I.S.</span>
            <span className="text-xs px-2 py-0.5 border border-[#ffd700]/60 text-[#ffd700] rounded tracking-widest hidden sm:inline-block">
              MK XLV
            </span>
          </h1>
          <span className="text-[9px] sm:text-[10px] opacity-90 tracking-[0.35em] mt-1 text-[#ff0033]">
            S.H.I.E.L.D. TACTICAL OS // MARK XLV
          </span>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Skip Audio */}
          <button
            type="button"
            onClick={handleSkipAudio}
            title="Skip current speech output"
            className="px-3 py-1.5 rounded-sm border border-[#ff9900] text-[#ff9900] bg-[rgba(20,0,0,0.8)] hover:bg-[#ff9900]/20 hover:text-white text-[10px] md:text-[11px] tracking-wider transition-all hover:shadow-[0_0_12px_#ff9900]"
          >
            [ SKIP ANSWER ]
          </button>

          {/* Full Screen */}
          <button
            type="button"
            onClick={toggleFullScreen}
            title="Toggle full screen interface"
            className="px-3 py-1.5 rounded-sm border border-white text-white bg-[rgba(20,0,0,0.8)] hover:bg-white/15 text-[10px] md:text-[11px] tracking-wider transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          >
            {isFullscreen ? '[ EXIT FULL ]' : '[ FULL SCREEN ]'}
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
            className="px-2.5 py-1.5 rounded-sm border border-[#ffd700]/60 text-[#ffd700] bg-[rgba(20,0,0,0.8)] hover:bg-[#ffd700]/20 text-[10px] md:text-[11px] tracking-wider transition-all"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-[#ff0033]" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Turn Off Jarvis / Emergency Stop */}
          <button
            type="button"
            onClick={() => onExecutePrompt('Emergency stop all active tasks immediately.')}
            title="Halt all background automations and voice speech"
            className="px-3 py-1.5 rounded-sm border border-[#ff0033] text-[#ff0033] bg-[rgba(20,0,0,0.8)] hover:bg-[#ff0033]/20 hover:text-white text-[10px] md:text-[11px] tracking-wider transition-all hover:shadow-[0_0_15px_#ff0033]"
          >
            [ SHUTDOWN / HALT ]
          </button>
        </div>

        {/* Right Status Indicator & Clock */}
        <div className="flex flex-col items-end gap-1.5">
          <div
            id="status-indicator"
            className={`text-xs md:text-sm font-bold px-3 sm:px-5 py-1 rounded-sm border transition-all duration-300 tracking-[0.2em] shadow-lg ${
              isTalking
                ? 'border-white text-white bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                : isListening
                ? 'border-[#ff0033] text-[#ff0033] bg-[#ff0033]/15 shadow-[0_0_20px_#ff0033] animate-pulse'
                : jarvisState === 'thinking' || jarvisState === 'executing'
                ? 'border-[#ffd700] text-[#ffd700] bg-[#ffd700]/15 shadow-[0_0_18px_#ffd700]'
                : 'border-[#ff0033]/70 text-white bg-transparent shadow-[0_0_10px_rgba(255,0,51,0.3)]'
            }`}
          >
            {statusText}
          </div>
          <div id="live-clock" className="text-[10px] sm:text-xs text-white tracking-[0.15em] font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {format12Hour(currentTime)}
          </div>
        </div>
      </header>

      {/* MAIN STAGE: 3-Column Wings with Center 3D Model */}
      <main className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-3 min-h-[380px]">
        {/* LEFT WING (Col 1-3): System Core Processor, Audio Matrix, Flight Telemetry */}
        <div className="lg:col-span-3 flex flex-col gap-3 pointer-events-auto">
          {/* Panel 1: System Core Processor */}
          <div className="w-full bg-[#0a0204]/80 border-l-[3px] border-[#ff0033] backdrop-blur-md p-3.5 sm:p-4 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            <div className="text-[10px] opacity-80 tracking-[0.2em] mb-1 text-white flex items-center justify-between">
              <span>SYSTEM CORE PROCESSOR</span>
              <Cpu className="w-3 h-3 text-[#ff0033]" />
            </div>
            <div className="text-lg md:text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              {metrics?.cpuUsage || 18}%
            </div>
            <div className="w-full h-1.5 bg-black/60 border border-[#ff0033]/50 mt-2">
              <div
                className="h-full bg-[#ff0033] shadow-[0_0_12px_#ff0033] transition-all duration-300"
                style={{ width: `${metrics?.cpuUsage || 18}%` }}
              />
            </div>
            <div className="text-[9px] text-[#ffd700]/80 tracking-wider mt-1.5 flex justify-between">
              <span>INTEL i5-13500H</span>
              <span>12C / 16T // 4.2 GHz</span>
            </div>
          </div>

          {/* Panel 2: Suite Diagnostics & Audio Matrix */}
          <div className="w-full bg-[#0a0204]/80 border-l-[3px] border-[#ffd700] backdrop-blur-md p-3.5 sm:p-4 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            <div className="text-[10px] opacity-80 tracking-[0.2em] mb-1 text-white flex items-center justify-between">
              <span>SUITE DIAGNOSTICS & AUDIO MATRIX</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${isTalking || isListening ? 'bg-[#ff0033] text-white' : 'bg-white/10 text-[#ffd700]'}`}>
                {isTalking ? 'TALK' : isListening ? 'MIC ON' : 'STANDBY'}
              </span>
            </div>
            {/* Real Dynamic 38-Bar Audio Visualizer */}
            <AudioMatrixVisualizer isListening={isListening} isSpeaking={isTalking} barCount={34} className="mt-2" />
            <div className="text-[9px] text-white/70 tracking-wider mt-2 flex justify-between">
              <span>QUANTUM SYNAPSE</span>
              <span className="text-[#ffd700]">STARK MARK XLV</span>
            </div>
          </div>

          {/* Panel 3: Flight Telemetry & Armor Unibeam */}
          <div className="w-full bg-[#0a0204]/80 border-l-[3px] border-[#ff0033] backdrop-blur-md p-3.5 sm:p-4 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            <div className="text-[10px] opacity-80 tracking-[0.2em] mb-2 text-white">
              FLIGHT TELEMETRY & ATTITUDE
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 border border-[#ff0033]/30 bg-black/40">
                <div className="text-[8px] text-[#ffd700]">ALTITUDE</div>
                <div className="text-sm font-bold text-white mt-0.5">{Math.round(altitude).toLocaleString()} FT</div>
              </div>
              <div className="p-2 border border-[#ff0033]/30 bg-black/40">
                <div className="text-[8px] text-[#ff0033]">AIRSPEED</div>
                <div className="text-sm font-bold text-white mt-0.5">MACH {speedMach}</div>
              </div>
            </div>
            <div className="mt-2 text-[9px] text-white/70 flex justify-between">
              <span>UNIBEAM OUTPUT: <strong className="text-[#ffd700]">3.4 GW</strong></span>
              <span>TEMP: <strong className="text-white">48.2°C</strong></span>
            </div>
          </div>
        </div>

        {/* CENTER STAGE (Col 4-9): Iron Man 3D Kinetic Hologram Model */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[340px] md:min-h-[420px]">
          {/* Subtle Ambient HUD Ring Background */}
          <div className="absolute w-[280px] sm:w-[360px] md:w-[420px] h-[280px] sm:h-[360px] md:h-[420px] rounded-full border border-[#ff0033]/20 border-dashed animate-[spin_40s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[220px] sm:w-[290px] md:w-[340px] h-[220px] sm:h-[290px] md:h-[340px] rounded-full border border-[#ffd700]/25 pointer-events-none" />

          {/* Real Three.js 3D Model with Red, Gold, White, Carbon Palette */}
          <IronMan3DCore
            state={jarvisState}
            isListening={isListening}
            combatMode={combatMode}
            onClick={handleMicToggle}
            className="w-full max-w-[500px]"
          />

          {/* Interactive Core Directive Prompt */}
          <div className="text-center mt-1 z-10">
            <button
              type="button"
              onClick={handleMicToggle}
              className={`px-4 py-1.5 rounded-sm border text-[11px] tracking-[0.2em] font-bold transition-all shadow-lg flex items-center gap-2 ${
                isListening
                  ? 'border-[#ff0033] bg-[#ff0033]/30 text-white shadow-[0_0_20px_#ff0033] animate-pulse'
                  : 'border-[#ffd700] bg-black/60 text-[#ffd700] hover:bg-[#ffd700]/20 hover:text-white hover:shadow-[0_0_15px_#ffd700]'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-[#ff0033]' : 'text-[#ffd700]'}`} />
              <span>{isListening ? '[ LISTENING - SPEAK COMMAND ]' : '[ TAP CORE TO SPEAK ]'}</span>
            </button>
            <div className="text-[9px] text-white/60 tracking-[0.25em] mt-1 uppercase">
              3D HOLOGRAPHIC QUANTUM ENGINE // MARK XLV
            </div>
          </div>
        </div>

        {/* RIGHT WING (Col 10-12): Network Layer, Memory Allocation, GPU Status */}
        <div className="lg:col-span-3 flex flex-col gap-3 pointer-events-auto">
          {/* Panel 1: Network Layer */}
          <div className="w-full bg-[#0a0204]/80 border-l-[3px] border-[#ff0033] backdrop-blur-md p-3.5 sm:p-4 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            <div className="text-[10px] opacity-80 tracking-[0.2em] mb-1 text-white flex items-center justify-between">
              <span>NETWORK LAYER</span>
              <Radio className="w-3 h-3 text-[#ffd700]" />
            </div>
            <div className="text-xs md:text-sm font-bold text-[#ff0033] drop-shadow-[0_0_12px_#ff0033]">
              SECURE QUANTUM LINK // ACTIVE
            </div>
            <div className="text-[9px] text-white/80 tracking-wider mt-2 flex justify-between">
              <span>UPSTREAM: 128 MB/s</span>
              <span className="text-[#ffd700]">PING: 12 ms</span>
            </div>
            <div className="w-full h-1 bg-black/60 border border-[#ff0033]/40 mt-1.5">
              <div className="h-full bg-[#ffd700] w-[82%]" />
            </div>
          </div>

          {/* Panel 2: System Memory Allocation */}
          <div className="w-full bg-[#0a0204]/80 border-l-[3px] border-[#ffd700] backdrop-blur-md p-3.5 sm:p-4 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            <div className="text-[10px] opacity-80 tracking-[0.2em] mb-1 text-white flex items-center justify-between">
              <span>SYSTEM MEMORY ALLOCATION</span>
              <span className="text-[9px] text-[#ffd700]">DDR5</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              {Math.round(((metrics?.ramUsedGb || 7.9) / 16) * 100)}%
            </div>
            <div className="w-full h-1.5 bg-black/60 border border-[#ff0033]/50 mt-2">
              <div
                className="h-full bg-[#ffd700] shadow-[0_0_12px_#ffd700] transition-all duration-300"
                style={{ width: `${Math.round(((metrics?.ramUsedGb || 7.9) / 16) * 100)}%` }}
              />
            </div>
            <div className="text-[9px] text-white/80 tracking-wider mt-1.5 flex justify-between">
              <span>USED: {metrics?.ramUsedGb || 7.9} GB</span>
              <span>TOTAL: 16.0 GB</span>
            </div>
          </div>

          {/* Panel 3: GPU & NVMe Storage Matrix */}
          <div className="w-full bg-[#0a0204]/80 border-l-[3px] border-[#ff0033] backdrop-blur-md p-3.5 sm:p-4 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            <div className="text-[10px] opacity-80 tracking-[0.2em] mb-2 text-white flex items-center justify-between">
              <span>NVIDIA RTX 4050 & STORAGE</span>
              <HardDrive className="w-3 h-3 text-[#ff0033]" />
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between text-white/90">
                <span>GPU LOAD ({metrics?.gpuUsage || 28}%)</span>
                <span className="text-[#ffd700]">VRAM: 2.1 / 6.0 GB</span>
              </div>
              <div className="w-full h-1 bg-black/60 border border-[#ff0033]/30">
                <div className="h-full bg-[#ff0033]" style={{ width: `${metrics?.gpuUsage || 28}%` }} />
              </div>

              <div className="flex justify-between text-white/90 pt-1">
                <span>NVMe C: (OS // WIN 11)</span>
                <span className="text-white font-bold">284 / 1024 GB</span>
              </div>
              <div className="w-full h-1 bg-black/60 border border-[#ffd700]/30">
                <div className="h-full bg-[#ffd700] w-[28%]" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM SECTION: Live Communication Array Terminal + Launcher Dock */}
      <footer className="relative z-10 w-full flex flex-col items-center gap-3 mt-2">
        {/* Terminal Box (Directly matching user HTML snippet) */}
        <div className="w-full max-w-4xl bg-[#0a0204]/85 border border-[#ff0033]/50 border-t-[3px] border-t-[#ff0033] p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.95)] backdrop-blur-md">
          <div className="flex justify-between border-b border-dashed border-[#880015] pb-1.5 mb-2 text-[10px] text-[#ff0033] tracking-[0.2em]">
            <span>LIVE COMMUNICATION ARRAY</span>
            <span className="text-[#ffd700]">OPERATOR: SHAURYA</span>
          </div>

          <div className="max-h-[90px] overflow-y-auto pr-2 text-xs space-y-1.5">
            <div className="text-[#aaaaaa] leading-relaxed text-[11px] sm:text-xs">
              &gt; SHAURYA: {latestUserMsg}
            </div>
            <div className="text-white leading-relaxed text-[12px] sm:text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] blink-cursor">
              &gt; J.A.R.V.I.S.: {latestJarvisMsg}
            </div>
          </div>
        </div>

        {/* Stark 9-Item Holographic Launcher Matrix Dock (All features preserved) */}
        <div className="w-full max-w-4xl p-2.5 rounded-lg border border-[#ff0033]/40 bg-[#0a0204]/80 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {launcherItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#ff0033]/30 bg-black/50 hover:border-[#ffd700] hover:bg-[#ffd700]/10 transition-all cursor-pointer group"
              >
                <Icon className={`w-3.5 h-3.5 ${item.color} transition-transform group-hover:scale-110`} />
                <span className="text-[10px] tracking-wider text-white/90 group-hover:text-[#ffd700] transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Directive Chips */}
        <div className="w-full max-w-4xl flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[10px] tracking-wider">
          <span className="text-[#ffd700] flex items-center gap-1 shrink-0 font-bold">
            <Terminal className="w-3 h-3 text-[#ffd700]" />
            DIRECTIVES:
          </span>
          {[
            'Run complete Mark XLV suit diagnostics.',
            'Calibrate unibeam and repulsor output.',
            'Initialize local development workspace.',
            'Scan memory banks for recent changes.',
            'Clean downloads and cache folders.',
            'Search latest tech developments.',
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleActionChip(chip)}
              className="px-2.5 py-1 rounded-sm border border-[#ff0033]/30 bg-black/60 hover:border-[#ffd700] hover:text-[#ffd700] text-white/80 whitespace-nowrap transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
