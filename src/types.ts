export type JarvisState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'executing' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'speaking';

export type RiskLevel = 0 | 1 | 2 | 3;

export interface ToolDefinition {
  name: string;
  category: 'windows' | 'coding' | 'filesystem' | 'browser' | 'messaging' | 'system' | 'memory';
  description: string;
  riskLevel: RiskLevel;
  parameters: {
    [paramName: string]: {
      type: string;
      description: string;
      required?: boolean;
      default?: any;
    };
  };
}

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, any>;
  riskLevel: RiskLevel;
  status: 'pending' | 'awaiting_confirmation' | 'executing' | 'completed' | 'failed' | 'aborted';
  result?: any;
  error?: string;
  timestamp: string;
  durationMs?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  state?: JarvisState;
  intent?: string;
  requiresConfirmation?: boolean;
}

export interface SystemMetrics {
  os: string;
  cpuModel: string;
  cpuUsage: number;
  gpuModel: string;
  gpuUsage: number;
  gpuVramUsedGb: number;
  gpuVramTotalGb: number;
  ramUsedGb: number;
  ramTotalGb: number;
  batteryPercent: number;
  isCharging: boolean;
  diskUsedGb: number;
  diskTotalGb: number;
  temperatureC: number;
  networkLatencyMs: number;
  activeProcesses: {
    pid: number;
    name: string;
    cpu: number;
    ramMb: number;
  }[];
  ollamaStatus: 'online' | 'offline' | 'checking';
  ollamaModel: string;
}

export interface MemoryItem {
  id: string;
  category: 'preferences' | 'projects' | 'facts' | 'tasks';
  key: string;
  value: string;
  updatedAt: string;
  confidence: number;
}

export interface AutomationRoutine {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  triggers: string[];
  steps: {
    order: number;
    toolName: string;
    label: string;
    params: Record<string, any>;
  }[];
  lastRun?: string;
}

export interface FileItem {
  name: string;
  path: string;
  sizeBytes: number;
  isDirectory: boolean;
  extension: string;
  modified: string;
  tags?: string[];
}

export interface PendingConfirmation {
  id: string;
  toolCallId: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  actionDetails: Record<string, any>;
  onConfirm: () => void;
  onReject: () => void;
}

export interface VoiceSettings {
  wakeWordEnabled: boolean;
  wakeWord: string;
  ttsEnabled: boolean;
  selectedVoice: string;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  language: string;
}

export interface AppSettings {
  ollamaUrl: string;
  ollamaModel: string;
  temperature: number;
  voice: VoiceSettings;
  security: {
    requireConfirmLevel2: boolean;
    requireConfirmLevel3: boolean;
    trustedApplications: string[];
    trustedContacts: string[];
  };
  ui: {
    ambientSound: boolean;
    holographicGlow: boolean;
    soundEffects: boolean;
    hudDensity: 'compact' | 'normal' | 'expanded';
  };
}
