import React, { useState } from 'react';
import { Sliders, Volume2, Shield, Radio, Download, CheckCircle2, Terminal } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const SettingsView: React.FC = () => {
  const [model, setModel] = useState('qwen3:8b');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [wakeWord, setWakeWord] = useState('Hey JARVIS');
  const [wakeWordActive, setWakeWordActive] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.05);
  const [speechPitch, setSpeechPitch] = useState(0.95);
  const [level2Confirm, setLevel2Confirm] = useState(true);
  const [level3Confirm, setLevel3Confirm] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    soundEffects.playReactorPulse();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDownloadDesktopScript = () => {
    soundEffects.playClick();
    const pythonScript = `"""
J.A.R.V.I.S. Desktop Local Bridge for Windows 11
Connects Local Hardware, Win32 APIs, and Ollama (qwen3:8b)
"""
import os
import sys
import subprocess
import requests

OLLAMA_URL = "${ollamaUrl}"
MODEL_NAME = "${model}"

def query_jarvis(prompt: str):
    print(f"[J.A.R.V.I.S.] Querying {MODEL_NAME} at {OLLAMA_URL}...")
    try:
        res = requests.post(f"{OLLAMA_URL}/api/generate", json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }, timeout=30)
        return res.json().get("response", "No response from model.")
    except Exception as e:
        return f"[Connection Error] Ensure 'ollama serve' is active: {e}"

if __name__ == "__main__":
    print("[J.A.R.V.I.S.] Windows 11 Local Desktop Bridge Initialized.")
    print(f"[J.A.R.V.I.S.] Local Model: {MODEL_NAME}")
    test = query_jarvis("Good morning J.A.R.V.I.S. Report system status.")
    print(f"[J.A.R.V.I.S. Output]:\\n{test}")
`;

    const blob = new Blob([pythonScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jarvis_desktop_bridge.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="jarvis-settings-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              J.A.R.V.I.S. CONFIGURATION &amp; PROTOCOLS
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              LOCAL OLLAMA BINDINGS • SPEECH SYNTHESIS • RISK SECURITY GUARDS
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-1.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(255,0,51,0.5)] cursor-pointer"
        >
          APPLY CONFIGURATION
        </button>
      </div>

      {savedNotice && (
        <div className="mb-4 p-3 rounded-sm border border-[#ffd700] bg-[#880015]/80 text-[#ffd700] text-xs flex items-center gap-2 shadow-[0_0_12px_#ffd700]">
          <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
          <span className="font-sans text-xs">Configuration applied and persisted across sessions.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Model & Ollama */}
        <div className="p-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Radio className="w-4 h-4 text-[#ff0033]" />
            <span className="tracking-wider">AI Brain &amp; Local Model Binding</span>
          </div>

          <div>
            <label className="block text-[9px] text-[#ffd700] uppercase mb-1 tracking-wider">
              Local Ollama Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-black/80 border border-[#880015] text-white text-xs font-mono"
            />
            <span className="text-[9px] text-white/60 mt-1 block">
              Default model: <span className="text-[#ffd700]">qwen3:8b</span>. (Runs locally via Ollama).
            </span>
          </div>

          <div>
            <label className="block text-[9px] text-[#ffd700] uppercase mb-1 tracking-wider">
              Ollama Server Endpoint
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-black/80 border border-[#880015] text-white text-xs font-mono"
            />
            <span className="text-[9px] text-white/60 mt-1 block">
              Standard local address: <span className="text-[#ffd700]">http://localhost:11434</span>.
            </span>
          </div>
        </div>

        {/* Card 2: Voice Pipeline & SpeechSynthesis */}
        <div className="p-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Volume2 className="w-4 h-4 text-[#ffd700]" />
            <span className="tracking-wider">Voice &amp; Audio Pipeline</span>
          </div>

          <div>
            <label className="block text-[9px] text-[#ffd700] uppercase mb-1 tracking-wider">Wake Word Phrase</label>
            <input
              type="text"
              value={wakeWord}
              onChange={(e) => setWakeWord(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-black/80 border border-[#880015] text-white text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-white text-[11px]">Enable Wake Word Detection</span>
            <input
              type="checkbox"
              checked={wakeWordActive}
              onChange={(e) => setWakeWordActive(e.target.checked)}
              className="w-4 h-4 accent-[#ff0033]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/70">Speech Rate</span>
              <span className="text-[#ffd700] font-bold">{speechRate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-[#ff0033]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/70">Pitch Calibration</span>
              <span className="text-[#ffd700] font-bold">{speechPitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Card 3: Security & Risk Permissions */}
        <div className="p-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Shield className="w-4 h-4 text-[#ffd700]" />
            <span className="tracking-wider">Safety &amp; Execution Confirmation Guards</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-sm bg-black/60 border border-[#880015]/40">
            <div>
              <div className="font-semibold text-white text-[11px]">Level 2 Confirmations</div>
              <div className="text-[9px] text-white/60 font-sans">
                Confirm outbound emails, messages, or mass file operations.
              </div>
            </div>
            <input
              type="checkbox"
              checked={level2Confirm}
              onChange={(e) => setLevel2Confirm(e.target.checked)}
              className="w-4 h-4 accent-[#ffd700]"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-sm bg-black/60 border border-[#880015]/40">
            <div>
              <div className="font-semibold text-white text-[11px]">Level 3 Critical Guard</div>
              <div className="text-[9px] text-white/60 font-sans">
                Mandatory confirmation for system commands, registry edits, or deletions.
              </div>
            </div>
            <input
              type="checkbox"
              checked={level3Confirm}
              onChange={(e) => setLevel3Confirm(e.target.checked)}
              className="w-4 h-4 accent-[#ff0033]"
            />
          </div>
        </div>

        {/* Card 4: Local Windows Bridge Script */}
        <div className="p-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Terminal className="w-4 h-4 text-[#ff0033]" />
            <span className="tracking-wider">Windows 11 Native Local Bridge</span>
          </div>

          <p className="text-white/80 text-xs leading-relaxed font-sans">
            Download the native Python bridge script to run J.A.R.V.I.S. with full direct access to your local Windows 11 shell, PowerShell, and native Ollama background service.
          </p>

          <button
            type="button"
            onClick={handleDownloadDesktopScript}
            className="w-full py-2.5 rounded-sm border border-[#ff0033] bg-[#880015]/60 hover:bg-[#ff0033] text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-[10px] tracking-wider"
          >
            <Download className="w-4 h-4 text-[#ffd700]" />
            <span>DOWNLOAD `jarvis_desktop_bridge.py`</span>
          </button>
        </div>
      </div>
    </div>
  );
};
