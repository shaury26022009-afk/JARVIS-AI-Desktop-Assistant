import { ToolDefinition, RiskLevel } from '../types';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // Windows & Applications
  {
    name: 'open_application',
    category: 'windows',
    description: 'Launch an installed Windows desktop application (e.g., VS Code, Chrome, Discord, Forza, Terminal).',
    riskLevel: 0,
    parameters: {
      application_name: { type: 'string', description: 'Executable name or common app title', required: true },
    },
  },
  {
    name: 'close_application',
    category: 'windows',
    description: 'Close or terminate an active application window.',
    riskLevel: 1,
    parameters: {
      application_name: { type: 'string', description: 'Application name or process to terminate', required: true },
    },
  },
  {
    name: 'open_vscode',
    category: 'windows',
    description: 'Launch Visual Studio Code and optionally open a project directory or file.',
    riskLevel: 0,
    parameters: {
      path: { type: 'string', description: 'Path to folder or file to open in VS Code', required: false },
    },
  },
  {
    name: 'window_control',
    category: 'windows',
    description: 'Minimize, maximize, restore, or bring window to focus.',
    riskLevel: 0,
    parameters: {
      action: { type: 'string', description: 'minimize | maximize | focus | restore', required: true },
      window_title: { type: 'string', description: 'Target window title', required: true },
    },
  },
  {
    name: 'take_screenshot',
    category: 'windows',
    description: 'Capture screenshot of display for computer vision and error inspection.',
    riskLevel: 0,
    parameters: {
      monitor: { type: 'number', description: 'Monitor index (0 for primary)', required: false, default: 0 },
    },
  },
  {
    name: 'volume_control',
    category: 'windows',
    description: 'Adjust or mute Windows audio volume output.',
    riskLevel: 0,
    parameters: {
      level: { type: 'number', description: 'Volume level from 0 to 100', required: false },
      mute: { type: 'boolean', description: 'Toggle mute state', required: false },
    },
  },

  // Web & Browser
  {
    name: 'launch_url',
    category: 'browser',
    description: 'Open a target website or URL in the default web browser.',
    riskLevel: 0,
    parameters: {
      url: { type: 'string', description: 'Target destination URL', required: true },
    },
  },
  {
    name: 'search_web',
    category: 'browser',
    description: 'Search the web for up-to-date queries, benchmarks, or articles.',
    riskLevel: 0,
    parameters: {
      query: { type: 'string', description: 'Search term or query', required: true },
    },
  },
  {
    name: 'read_webpage',
    category: 'browser',
    description: 'Fetch and summarize text content from a specified URL.',
    riskLevel: 0,
    parameters: {
      url: { type: 'string', description: 'Webpage URL to read', required: true },
    },
  },

  // Filesystem Agent
  {
    name: 'search_files',
    category: 'filesystem',
    description: 'Search files and folders matching extension, pattern, or name in target directory.',
    riskLevel: 0,
    parameters: {
      path: { type: 'string', description: 'Base directory (e.g., C:\\Users\\User\\Downloads)', required: true },
      extension: { type: 'string', description: 'Optional file extension filter (e.g., .pdf, .py, .png)', required: false },
      query: { type: 'string', description: 'Filename substring or wildcard', required: false },
    },
  },
  {
    name: 'create_file',
    category: 'filesystem',
    description: 'Create a new file on disk with specified content.',
    riskLevel: 1,
    parameters: {
      path: { type: 'string', description: 'Target file path', required: true },
      content: { type: 'string', description: 'Text or code to write', required: true },
    },
  },
  {
    name: 'read_file',
    category: 'filesystem',
    description: 'Read the text contents of a file on disk.',
    riskLevel: 0,
    parameters: {
      path: { type: 'string', description: 'File path to read', required: true },
    },
  },
  {
    name: 'move_file',
    category: 'filesystem',
    description: 'Move or organize files into target folder.',
    riskLevel: 1,
    parameters: {
      source: { type: 'string', description: 'Source file or folder path', required: true },
      destination: { type: 'string', description: 'Destination directory path', required: true },
    },
  },
  {
    name: 'delete_file',
    category: 'filesystem',
    description: 'Delete specified file or directory. Requires user confirmation.',
    riskLevel: 2,
    parameters: {
      path: { type: 'string', description: 'File path to remove', required: true },
      recursive: { type: 'boolean', description: 'Delete folder recursively', required: false, default: false },
    },
  },
  {
    name: 'create_folder',
    category: 'filesystem',
    description: 'Create a new folder or directory structure.',
    riskLevel: 1,
    parameters: {
      path: { type: 'string', description: 'Directory path to create', required: true },
    },
  },

  // Coding Agent
  {
    name: 'run_command',
    category: 'coding',
    description: 'Execute a shell command via Windows PowerShell / CMD and capture stdout/stderr.',
    riskLevel: 1,
    parameters: {
      command: { type: 'string', description: 'PowerShell / CMD command line string', required: true },
    },
  },
  {
    name: 'run_python',
    category: 'coding',
    description: 'Execute a Python script or inline snippet with the local Python runtime.',
    riskLevel: 1,
    parameters: {
      file_path: { type: 'string', description: 'Path to .py file or leave empty for inline code', required: false },
      code: { type: 'string', description: 'Inline Python code to execute', required: false },
    },
  },
  {
    name: 'run_c',
    category: 'coding',
    description: 'Compile and execute a C source file using gcc/clang on Windows.',
    riskLevel: 1,
    parameters: {
      file_path: { type: 'string', description: 'Path to .c source file', required: true },
    },
  },
  {
    name: 'run_cpp',
    category: 'coding',
    description: 'Compile and execute a C++ source file using g++/MSVC on Windows.',
    riskLevel: 1,
    parameters: {
      file_path: { type: 'string', description: 'Path to .cpp source file', required: true },
    },
  },
  {
    name: 'git_status',
    category: 'coding',
    description: 'Inspect current Git repository branch, staged changes, and unstaged modifications.',
    riskLevel: 0,
    parameters: {
      project_path: { type: 'string', description: 'Directory of git repo', required: false },
    },
  },
  {
    name: 'git_commit',
    category: 'coding',
    description: 'Commit staged changes to git with a descriptive commit message.',
    riskLevel: 1,
    parameters: {
      message: { type: 'string', description: 'Git commit message', required: true },
    },
  },

  // Messaging & Communications (Level 2: Always requires confirmation)
  {
    name: 'send_message',
    category: 'messaging',
    description: 'Send a message to a recipient via WhatsApp, Discord, or Telegram. Requires explicit user approval.',
    riskLevel: 2,
    parameters: {
      platform: { type: 'string', description: 'whatsapp | discord | telegram | email', required: true },
      recipient: { type: 'string', description: 'Contact name or handle', required: true },
      message: { type: 'string', description: 'Text message body to dispatch', required: true },
    },
  },

  // Memory & Knowledge
  {
    name: 'remember_fact',
    category: 'memory',
    description: 'Store a fact, preference, or piece of knowledge in persistent memory.',
    riskLevel: 0,
    parameters: {
      key: { type: 'string', description: 'Subject or label (e.g., "Car", "Coding IDE")', required: true },
      value: { type: 'string', description: 'Fact or statement to remember', required: true },
      category: { type: 'string', description: 'facts | preferences | projects | tasks', required: false, default: 'facts' },
    },
  },
  {
    name: 'forget_fact',
    category: 'memory',
    description: 'Remove a fact or preference from persistent memory.',
    riskLevel: 1,
    parameters: {
      key: { type: 'string', description: 'Memory label or search term to remove', required: true },
    },
  },

  // System & Tasks
  {
    name: 'system_info',
    category: 'system',
    description: 'Query hardware diagnostics: CPU, RTX 4050 GPU, RAM, battery, thermals, and disk usage.',
    riskLevel: 0,
    parameters: {},
  },
  {
    name: 'create_reminder',
    category: 'system',
    description: 'Schedule a time-based notification or reminder.',
    riskLevel: 0,
    parameters: {
      time: { type: 'string', description: 'Time or duration (e.g., "7 PM", "in 30 minutes")', required: true },
      note: { type: 'string', description: 'Reminder description', required: true },
    },
  },
  {
    name: 'set_timer',
    category: 'system',
    description: 'Start a countdown timer.',
    riskLevel: 0,
    parameters: {
      seconds: { type: 'number', description: 'Duration in seconds', required: true },
      label: { type: 'string', description: 'Timer label', required: false },
    },
  },
];
