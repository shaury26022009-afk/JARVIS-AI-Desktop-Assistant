/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  JarvisState,
  SystemMetrics,
  ChatMessage,
  ToolCall,
  PendingConfirmation,
  MemoryItem,
  AutomationRoutine,
  FileItem,
} from './types';
import { agentOrchestrator } from './services/agentOrchestrator';
import { voiceService } from './services/voiceService';
import { soundEffects } from './services/soundEffects';

// Layout & View Components
import { NavigationSidebar, NavTab } from './components/NavigationSidebar';
import { LiveActivityPanel } from './components/LiveActivityPanel';
import { CommandBar } from './components/CommandBar';
import { ConfirmationModal } from './components/ConfirmationModal';
import { FirstRunModal } from './components/FirstRunModal';

import { HomeView } from './views/HomeView';
import { AssistantView } from './views/AssistantView';
import { CodingView } from './views/CodingView';
import { FilesView } from './views/FilesView';
import { BrowserView } from './views/BrowserView';
import { MessagesView } from './views/MessagesView';
import { MemoryView } from './views/MemoryView';
import { AutomationView } from './views/AutomationView';
import { SystemView } from './views/SystemView';
import { SettingsView } from './views/SettingsView';
import { TasksView } from './views/TasksView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [jarvisState, setJarvisState] = useState<JarvisState>('idle');
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [automations, setAutomations] = useState<AutomationRoutine[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'jarvis',
      content:
        "Good day, sir. All core services, Windows 11 hardware bridges, and local Qwen3:8b neural models are fully calibrated and standing by.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [activeToolCalls, setActiveToolCalls] = useState<ToolCall[]>([]);
  const [activityLogs, setActivityLogs] = useState<
    { id: string; timestamp: string; event: string; tool: string; status: string }[]
  >([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Kernel initialized. Connected to local qwen3:8b.',
      tool: 'system_core',
      status: 'active',
    },
  ]);

  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFirstRun, setShowFirstRun] = useState(true);
  const [combatMode, setCombatMode] = useState(false);

  const emergencyStopRef = useRef(emergencyStop);
  emergencyStopRef.current = emergencyStop;

  // Append to activity log
  const logEvent = useCallback((event: string, tool: string = 'jarvis_core', status: string = 'completed') => {
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event,
        tool,
        status,
      },
      ...prev.slice(0, 40),
    ]);
  }, []);

  // Fetch initial telemetry & session data from backend
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/system/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      // Fallback telemetry
      setMetrics({
        os: 'Windows 11 Home 64-bit',
        cpuModel: 'Intel Core 5 13500H',
        cpuUsage: 18,
        gpuModel: 'NVIDIA GeForce RTX 4050 Laptop GPU',
        gpuUsage: 22,
        gpuVramUsedGb: 3.8,
        gpuVramTotalGb: 6.0,
        ramUsedGb: 7.9,
        ramTotalGb: 16.0,
        batteryPercent: 82,
        isCharging: true,
        diskUsedGb: 280,
        diskTotalGb: 1024,
        temperatureC: 48,
        networkLatencyMs: 24,
        activeProcesses: [],
        ollamaStatus: 'online',
        ollamaModel: 'qwen3:8b',
      });
    }
  }, []);

  const fetchSessionData = useCallback(async () => {
    try {
      const [memRes, autoRes, filesRes] = await Promise.all([
        fetch('/api/memory'),
        fetch('/api/automations'),
        fetch('/api/files'),
      ]);

      if (memRes.ok) {
        const memData = await memRes.json();
        const list = Array.isArray(memData)
          ? memData
          : Array.isArray(memData?.memories)
          ? memData.memories
          : [];
        setMemories(list);
      }
      if (autoRes.ok) {
        const autoData = await autoRes.json();
        const list = Array.isArray(autoData)
          ? autoData
          : Array.isArray(autoData?.automations)
          ? autoData.automations
          : [];
        setAutomations(list);
      }
      if (filesRes.ok) {
        const filesData = await filesRes.json();
        const list = Array.isArray(filesData)
          ? filesData
          : Array.isArray(filesData?.files)
          ? filesData.files
          : [];
        setFiles(list);
      }
    } catch (e) {
      console.warn('[JARVIS] Session data fetch fallback:', e);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    fetchSessionData();
    const interval = setInterval(fetchTelemetry, 3500);
    return () => clearInterval(interval);
  }, [fetchTelemetry, fetchSessionData]);

  // Handle voice speech results
  useEffect(() => {
    voiceService.onSpeechResult = (text: string) => {
      if (text.trim()) {
        handleExecutePrompt(text);
      }
    };

    voiceService.onStateChange = (state) => {
      if (state === 'speaking') {
        setJarvisState('speaking');
      } else if (state === 'listening') {
        setIsListening(true);
        setJarvisState('listening');
      } else {
        setIsListening(false);
        setJarvisState((prev) => (prev === 'speaking' || prev === 'listening' ? 'idle' : prev));
      }
    };

    voiceService.onWakeWordDetected = () => {
      logEvent('Wake word detected ("Hey JARVIS"). Ready for command.');
      voiceService.speak('At your service, sir.');
    };
  }, [logEvent]);

  // Toggle voice recognition
  const handleToggleVoice = useCallback(() => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      setJarvisState('idle');
    } else {
      voiceService.startListening().then((started) => {
        if (started) {
          setIsListening(true);
          setJarvisState('listening');
          logEvent('Microphone activated. Audio pipeline streaming.');
        }
      });
    }
  }, [isListening, logEvent]);

  // Execute a natural language prompt through JARVIS
  const handleExecutePrompt = useCallback(
    async (prompt: string) => {
      if (emergencyStopRef.current) {
        const abortMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'jarvis',
          content: 'Execution halted. Emergency stop is active. Disengage halt to resume commands.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, abortMsg]);
        voiceService.speak('Execution halted. Emergency stop is active.');
        return;
      }

      // Check emergency stop command words
      const lower = prompt.toLowerCase();
      if (lower === 'stop jarvis' || lower === 'halt' || lower === 'emergency stop' || lower === 'cancel') {
        soundEffects.playAlert();
        setEmergencyStop(true);
        setJarvisState('warning');
        voiceService.stopSpeaking();
        voiceService.stopListening();
        logEvent('Emergency Stop engaged via direct voice/command order.');
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-user-${Date.now()}`,
            sender: 'user',
            content: prompt,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: `msg-halt-${Date.now()}`,
            sender: 'jarvis',
            content: 'All actions aborted immediately, sir. System is on standby.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        voiceService.speak('All actions aborted immediately, sir.');
        return;
      }

      // Play high-tech data transmit sound
      soundEffects.playTransmit();

      // Append user message
      const userMsg: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setJarvisState('thinking');
      logEvent(`Analyzing prompt: "${prompt}"`);

      // Parse plan through Agent Orchestrator with AI backend and local fallback
      const plan = await agentOrchestrator.orchestrate(prompt, currentTab);

      // Check if plan contains Level 2 or Level 3 actions needing explicit UI confirmation
      if (plan.riskLevel >= 2) {
        soundEffects.playAlert();
        setJarvisState('warning');
        const firstHighRiskStep = plan.steps.find((s) => s.riskLevel >= 2) || plan.steps[0] || {
          tool: 'send_message',
          description: 'Outbound dispatch verification',
          args: {},
        };

        setPendingConfirmation({
          id: `conf-${Date.now()}`,
          toolCallId: `tc-${Date.now()}`,
          title: `Confirmation: ${firstHighRiskStep.tool}`,
          description: `JARVIS requires your authorization before proceeding: ${firstHighRiskStep.description}`,
          riskLevel: (plan.riskLevel as 2 | 3) || 2,
          actionDetails: firstHighRiskStep.args,
          onConfirm: () => {
            setPendingConfirmation(null);
            runExecutionPlan(plan);
          },
          onReject: () => {
            setPendingConfirmation(null);
            setJarvisState('idle');
            logEvent(`Action aborted by user: ${firstHighRiskStep.tool}`);
            const cancelReply: ChatMessage = {
              id: `msg-cancel-${Date.now()}`,
              sender: 'jarvis',
              content: 'Action aborted. What else can I assist you with, sir?',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, cancelReply]);
            voiceService.speak('Action aborted.');
          },
        });
        return;
      }

      // Safe to execute immediately (Level 0 / 1)
      await runExecutionPlan(plan);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [logEvent, currentTab]
  );

  // Run execution plan steps sequentially
  const runExecutionPlan = async (plan: any) => {
    setJarvisState('executing');
    const executedToolCalls: ToolCall[] = [];

    // Switch view to match intent or target tab if provided
    if (plan.targetTab) {
      setCurrentTab(plan.targetTab);
    } else if (plan.intent === 'browser_action' || plan.intent?.toLowerCase().includes('browser') || plan.intent?.toLowerCase().includes('youtube')) {
      setCurrentTab('browser');
    } else if (plan.intent === 'coding_action' || plan.intent?.toLowerCase().includes('code') || plan.intent?.toLowerCase().includes('python')) {
      setCurrentTab('coding');
    } else if (plan.intent === 'file_action' || plan.intent?.toLowerCase().includes('file')) {
      setCurrentTab('files');
    } else if (plan.intent === 'messaging' || plan.intent?.toLowerCase().includes('message')) {
      setCurrentTab('messages');
    } else if (plan.intent === 'automation' || plan.intent?.toLowerCase().includes('routine')) {
      setCurrentTab('automation');
    } else if (plan.intent === 'memory_action' || plan.intent?.toLowerCase().includes('memory')) {
      setCurrentTab('memory');
    }

    for (const step of plan.steps) {
      if (emergencyStopRef.current) break;

      const toolCall: ToolCall = {
        id: `tc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        toolName: step.tool,
        parameters: step.args,
        status: 'executing',
        riskLevel: step.riskLevel as any,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setActiveToolCalls((prev) => [toolCall, ...prev]);
      logEvent(`Dispatching ${step.tool}: ${step.description}`, step.tool, 'running');

      try {
        const res = await fetch('/api/tools/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolName: step.tool, args: step.args }),
        });

        if (res.ok) {
          const result = await res.json();
          toolCall.status = 'completed';
          toolCall.result = result;
          toolCall.durationMs = result.durationMs || 45;
          logEvent(`Completed ${step.tool}: ${result.message || 'Success'}`, step.tool, 'completed');
        } else {
          toolCall.status = 'failed';
          toolCall.error = 'Tool execution failure.';
          logEvent(`Failed ${step.tool}`, step.tool, 'failed');
        }
      } catch (e: any) {
        toolCall.status = 'failed';
        toolCall.error = e.message;
        logEvent(`Error running ${step.tool}: ${e.message}`, step.tool, 'failed');
      }

      executedToolCalls.push(toolCall);
      setActiveToolCalls((prev) => prev.map((tc) => (tc.id === toolCall.id ? toolCall : tc)));
      // Brief pause between steps for realistic orchestration visual feedback
      await new Promise((r) => setTimeout(r, 200));
    }

    // Refresh memory / files after tool execution
    fetchSessionData();

    soundEffects.playSuccess();
    setJarvisState('success');
    setTimeout(() => {
      setJarvisState('idle');
    }, 2500);

    // Speak natural response
    const jarvisMsg: ChatMessage = {
      id: `msg-jarvis-${Date.now()}`,
      sender: 'jarvis',
      content: plan.finalResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: plan.intent,
      toolCalls: executedToolCalls,
    };

    setMessages((prev) => [...prev, jarvisMsg]);
    voiceService.speak(plan.finalResponse);
  };

  // Add memory handler
  const handleAddMemory = async (category: any, key: string, value: string) => {
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, key, value }),
      });
      if (res.ok) {
        const result = await res.json();
        const item = result?.memory || (result?.id ? result : null);
        if (item) {
          setMemories((prev) => [item, ...(Array.isArray(prev) ? prev : [])]);
        }
        logEvent(`New memory recorded: ${key}`, 'memory_write');
        voiceService.speak(`Noted. I'll remember that ${key} is ${value}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete memory handler
  const handleDeleteMemory = async (id: string) => {
    try {
      await fetch(`/api/memory/${id}`, { method: 'DELETE' });
      setMemories((prev) => (Array.isArray(prev) ? prev.filter((m) => m.id !== id) : []));
      logEvent(`Memory deleted: ${id}`, 'memory_delete');
      voiceService.speak('Understood. Memory record purged.');
    } catch (e) {
      console.error(e);
    }
  };

  // Run automation routine handler
  const handleRunAutomation = (routineId: string) => {
    const routine = automations.find((a) => a.id === routineId);
    if (!routine) return;
    const plan = {
      intent: 'automation',
      riskLevel: 1,
      steps: routine.steps,
      finalResponse: `${routine.name} executed. All steps completed.`,
    };
    runExecutionPlan(plan);
  };

  // Organize files handler
  const handleOrganizeFiles = async (mode: string) => {
    if (mode === 'clean_downloads') {
      await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'file_organize_downloads',
          args: { targetDirectory: 'C:\\Users\\User\\Downloads' },
        }),
      });
      logEvent('Downloads folder cleaned and categorized.', 'file_organize_downloads');
      voiceService.speak('Downloads folder organized into clean categories.');
    } else {
      await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'file_batch_move',
          args: {
            destination: 'C:\\Users\\User\\Documents\\Cars',
            files: ['stark_blueprint.pdf', 'mark_vii_telemetry.csv'],
          },
        }),
      });
      logEvent('Created Cars folder and moved vehicle files.', 'file_batch_move');
      voiceService.speak('Created Cars folder and moved files.');
    }
    fetchSessionData();
  };

  return (
    <div
      id="jarvis-app-root"
      className={`w-screen h-screen ${
        combatMode ? 'bg-[#0B0204]' : 'bg-[#050203]'
      } text-white flex flex-col overflow-hidden select-none font-sans transition-colors duration-500`}
    >
      {/* Background Holographic Hex Grid & HUD overlay */}
      <div className={`absolute inset-0 ${
        combatMode
          ? 'bg-[linear-gradient(to_right,#ff003315_1px,transparent_1px),linear-gradient(to_bottom,#ff003315_1px,transparent_1px)]'
          : 'bg-[linear-gradient(to_right,#ffd7000d_1px,transparent_1px),linear-gradient(to_bottom,#88001518_1px,transparent_1px)]'
      } bg-[size:32px_32px] pointer-events-none`} />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <NavigationSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          combatMode={combatMode}
        />

        {/* Central Viewport */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#070204]/90 to-[#020102]/95">
          {currentTab === 'home' && (
            <HomeView
              jarvisState={jarvisState}
              metrics={metrics}
              memories={memories}
              automations={automations}
              isListening={isListening}
              onToggleVoice={handleToggleVoice}
              onExecutePrompt={handleExecutePrompt}
              onNavigateTab={setCurrentTab}
              combatMode={combatMode}
              onToggleCombatMode={() => setCombatMode((prev) => !prev)}
              recentMessages={messages}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantView messages={messages} onExecutePrompt={handleExecutePrompt} />
          )}

          {currentTab === 'tasks' && <TasksView />}

          {currentTab === 'coding' && <CodingView />}

          {currentTab === 'files' && (
            <FilesView files={files} onOrganizeFiles={handleOrganizeFiles} />
          )}

          {currentTab === 'browser' && <BrowserView />}

          {currentTab === 'messages' && <MessagesView />}

          {currentTab === 'memory' && (
            <MemoryView
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === 'automation' && (
            <AutomationView automations={automations} onRunAutomation={handleRunAutomation} />
          )}

          {currentTab === 'system' && (
            <SystemView metrics={metrics} onRefreshMetrics={fetchTelemetry} />
          )}

          {currentTab === 'settings' && <SettingsView />}

          {/* Bottom Command HUD Bar */}
          <CommandBar
            onSendMessage={handleExecutePrompt}
            isListening={isListening}
            onToggleVoice={handleToggleVoice}
            jarvisState={jarvisState}
            combatMode={combatMode}
          />
        </main>

        {/* Right Live Activity & Hardware Telemetry Panel */}
        <LiveActivityPanel
          metrics={metrics}
          activeToolCalls={activeToolCalls}
          activityLogs={activityLogs}
          emergencyStop={emergencyStop}
          combatMode={combatMode}
          onEmergencyStop={() => {
            setEmergencyStop(true);
            setJarvisState('warning');
            voiceService.stopSpeaking();
            logEvent('Emergency Stop triggered manually.');
            voiceService.speak('Emergency stop engaged.');
          }}
          onEmergencyResume={() => {
            setEmergencyStop(false);
            setJarvisState('idle');
            logEvent('Emergency Stop disengaged.');
            voiceService.speak('Resuming normal operations.');
          }}
        />
      </div>

      {/* Level 2 & 3 Confirmation Modal */}
      <ConfirmationModal confirmation={pendingConfirmation} />

      {/* First-Run Futuristic Diagnostic Modal */}
      {showFirstRun && (
        <FirstRunModal
          onComplete={() => setShowFirstRun(false)}
          onPlayGreeting={() => {
            voiceService.speak('Good morning. JARVIS is online.');
          }}
        />
      )}
    </div>
  );
}
