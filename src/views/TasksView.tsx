import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Circle, Plus, Trash2, Clock, Flame } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't-1',
      title: 'Initialize Arc Reactor diagnostics sequence',
      category: 'System',
      status: 'completed',
      dueDate: 'Today',
    },
    {
      id: 't-2',
      title: 'Run full Python codebase unit tests',
      category: 'Coding',
      status: 'completed',
      dueDate: 'Today',
    },
    {
      id: 't-3',
      title: 'Purge local cache and analyze network logs',
      category: 'System',
      status: 'pending',
      dueDate: 'Tomorrow',
    },
    {
      id: 't-4',
      title: 'Verify Mark XLV suit assembly parameters',
      category: 'Engineering',
      status: 'pending',
      dueDate: 'Today, 6:00 PM',
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Coding');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleToggleTask = (id: string) => {
    soundEffects.playClick();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    soundEffects.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    soundEffects.playReactorPulse();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      status: 'pending',
      dueDate: 'Today',
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div id="jarvis-tasks-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <ListTodo className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              J.A.R.V.I.S. TASK ORCHESTRATION &amp; SCHEDULE
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              AUTONOMOUS EXECUTION QUEUE • REMINDERS • FLIGHT OBJECTIVES
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { soundEffects.playClick(); setFilter(f as any); }}
              className={`px-3 py-1.5 rounded-sm uppercase text-[9px] tracking-widest transition-all cursor-pointer ${
                filter === f
                  ? 'border border-[#ff0033] bg-[#880015]/60 text-white font-bold shadow-[0_0_8px_#ff0033]'
                  : 'border border-[#880015]/40 bg-black/50 text-white/70 hover:bg-[#880015]/20 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 sm:gap-3 mb-5">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add new task or action for J.A.R.V.I.S. to track..."
          className="flex-1 px-4 py-2.5 rounded-sm bg-black/80 border border-[#880015]/70 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd700] text-xs font-mono tracking-wider shadow-inner"
        />
        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          className="px-3 py-2 rounded-sm bg-black border border-[#880015] text-[#ffd700] text-xs font-mono"
        >
          <option value="Coding">Coding</option>
          <option value="Research">Research</option>
          <option value="System">System</option>
          <option value="Personal">Personal</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,51,0.5)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD TASK</span>
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto divide-y divide-[#880015]/20">
          {filtered.map((task) => {
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className="p-3.5 px-4 flex items-center justify-between hover:bg-[#880015]/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className="cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#ff0033]" />
                    )}
                  </button>
                  <div>
                    <span
                      className={`text-xs font-sans ${
                        isDone ? 'line-through text-white/40' : 'text-white font-medium'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-white/60 font-mono">
                      <span className="px-1.5 py-0.2 rounded-sm bg-black border border-[#880015] text-[#ffd700]">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#ff0033]" />
                          <span>{task.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 rounded text-white/40 hover:text-[#ff0033] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
