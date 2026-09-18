import React, { useState } from 'react';
import { Brain, Plus, Trash2, CheckCircle2, Sparkles, Filter, Shield } from 'lucide-react';
import { MemoryItem } from '../types';
import { soundEffects } from '../services/soundEffects';

interface MemoryViewProps {
  memories: MemoryItem[];
  onAddMemory: (category: any, key: string, value: string) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'facts' | 'preferences' | 'projects' | 'tasks'>('facts');
  const [showAddForm, setShowAddForm] = useState(false);

  const safeMemories = Array.isArray(memories) ? memories : [];

  const filteredMemories = safeMemories.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    soundEffects.playReactorPulse();
    onAddMemory(newCategory, newKey.trim(), newValue.trim());
    setNewKey('');
    setNewValue('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    onDeleteMemory(id);
  };

  return (
    <div id="jarvis-memory-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              NEURAL PERSISTENT MEMORY
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              SYNAPSE RECALL • SUIT TELEMETRY • USER DIRECTIVES • CONTEXT MATRIX
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { soundEffects.playClick(); setShowAddForm(!showAddForm); }}
          className="px-3.5 py-1.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,0,51,0.5)] cursor-pointer text-[10px] tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>STORE NEW MEMORY</span>
        </button>
      </div>

      {/* Add Memory Modal Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mb-5 p-4 rounded-sm border border-[#ff0033] bg-[#0a0204]/95 space-y-3 shadow-2xl"
        >
          <div className="font-bold text-white tracking-wider text-xs">Record Persistent Memory Entry</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            <div>
              <label className="block text-[9px] text-[#ffd700] uppercase mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-sm bg-black border border-[#880015] text-white text-xs"
              >
                <option value="facts">Facts / Knowledge</option>
                <option value="preferences">User Preferences</option>
                <option value="projects">Projects &amp; Workspaces</option>
                <option value="tasks">Tasks &amp; Directives</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] text-[#ffd700] uppercase mb-1">Subject / Key</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. Target Platform, Mark VII Specs"
                className="w-full px-3 py-2 rounded-sm bg-black border border-[#880015] text-white text-xs placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-[9px] text-[#ffd700] uppercase mb-1">Value / Fact</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g. Flight stabilizer calibrated"
                className="w-full px-3 py-2 rounded-sm bg-black border border-[#880015] text-white text-xs placeholder:text-white/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-sm border border-[#880015] text-white/70 hover:bg-[#880015]/30 hover:text-white text-[10px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-sm bg-[#ff0033] hover:bg-white hover:text-black text-white font-bold text-[10px] tracking-wider transition-all shadow-md"
            >
              Commit to Neural Synapse
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'facts', label: 'Facts' },
          { id: 'preferences', label: 'Preferences' },
          { id: 'projects', label: 'Projects' },
          { id: 'tasks', label: 'Tasks' },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => { soundEffects.playClick(); setActiveCategory(c.id); }}
            className={`px-3 py-1.5 rounded-sm uppercase text-[9px] tracking-widest transition-all cursor-pointer ${
              activeCategory === c.id
                ? 'border border-[#ff0033] bg-[#880015]/60 text-white font-bold shadow-[0_0_8px_#ff0033]'
                : 'border border-[#880015]/40 bg-black/50 text-white/70 hover:bg-[#880015]/20 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="p-4 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 hover:border-[#ffd700]/70 transition-all flex flex-col justify-between group shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] px-2 py-0.5 rounded-sm border border-[#880015] bg-black/80 text-[#ffd700] uppercase tracking-wider font-mono">
                  {mem.category}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(mem.id)}
                  className="p-1 rounded text-white/40 hover:text-[#ff0033] transition-colors cursor-pointer"
                  title="Forget this memory record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-[#ffd700] font-bold text-xs uppercase tracking-wide">
                {mem.key}
              </h4>
              <p className="text-white text-xs mt-1.5 font-sans leading-relaxed">
                {mem.value}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#880015]/40 flex items-center justify-between text-[9px] text-white/60 font-mono">
              <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
              <span className="text-[#ffd700]">STARK SYNAPSE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
