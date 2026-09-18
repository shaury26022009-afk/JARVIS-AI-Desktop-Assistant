import React from 'react';
import { soundEffects } from '../services/soundEffects';
import {
  Home,
  Bot,
  ListTodo,
  Code2,
  FolderOpen,
  Globe,
  MessageSquare,
  Brain,
  Cpu,
  Sliders,
  Sparkles,
  Terminal,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'assistant'
  | 'tasks'
  | 'coding'
  | 'files'
  | 'browser'
  | 'messages'
  | 'memory'
  | 'automation'
  | 'system'
  | 'settings';

interface NavigationSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
  combatMode?: boolean;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'Home HUD', icon: Home },
  { id: 'assistant', label: 'Neural Assistant', icon: Bot },
  { id: 'tasks', label: 'Directive Queue', icon: ListTodo },
  { id: 'coding', label: 'Python Studio', icon: Code2 },
  { id: 'files', label: 'Files Matrix', icon: FolderOpen },
  { id: 'browser', label: 'Web Scout', icon: Globe },
  { id: 'messages', label: 'Secure Comms', icon: MessageSquare },
  { id: 'memory', label: 'Synapse Memory', icon: Brain },
  { id: 'automation', label: 'Automations', icon: Sparkles },
  { id: 'system', label: 'Diagnostics', icon: Cpu },
  { id: 'settings', label: 'Configuration', icon: Sliders },
];

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 0,
  combatMode = false,
}) => {
  const activeBorder = 'border-[#ff0033] bg-[#880015]/40 text-white shadow-[0_0_12px_rgba(255,0,51,0.5)]';
  const activeGlow = 'shadow-[#ff0033]/30';
  const activeIcon = 'text-[#ffd700]';

  const handleTabClick = (tab: NavTab) => {
    soundEffects.playClick();
    onSelectTab(tab);
  };

  return (
    <nav
      id="jarvis-left-navigation"
      className="w-56 h-full flex flex-col border-r border-[#880015]/70 bg-[#070204]/95 backdrop-blur-md overflow-hidden text-white/90 font-['Michroma',sans-serif] text-xs select-none"
    >
      {/* Brand / Logo */}
      <div className="p-4 border-b border-[#880015]/70 flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm border border-[#ff0033] bg-[#880015]/60 flex items-center justify-center shadow-[0_0_10px_#ff0033]">
          <Terminal className="w-4 h-4 text-[#ffd700]" />
        </div>
        <div>
          <div className="font-extrabold text-[11px] tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
            STARK OS
          </div>
          <div className="text-[9px] text-[#ff0033] tracking-widest mt-0.5">
            S.H.I.E.L.D. // MK XLV
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`w-full px-3 py-2.5 rounded-sm flex items-center gap-3 transition-all duration-200 text-left cursor-pointer group ${
                isActive
                  ? `border ${activeBorder} font-bold shadow-inner ${activeGlow}`
                  : 'border border-transparent text-white/70 hover:text-white hover:bg-[#880015]/20 hover:border-[#ff0033]/30'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? activeIcon : 'text-[#ff0033]/70 group-hover:text-[#ffd700]'
                }`}
              />
              <span className="truncate text-[10px] tracking-wider">{item.label}</span>
              {item.id === 'messages' && unreadCount > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded-full bg-[#ff0033] text-white font-bold text-[9px] shadow-[0_0_8px_#ff0033]">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Model & Architecture Status Box */}
      <div className="p-3 border-t border-[#880015]/70 bg-black/60 text-[10px] space-y-1">
        <div className="flex items-center justify-between text-white/70">
          <span>AI CORE</span>
          <span className="font-semibold text-[#ffd700]">STARK QUANTUM</span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>STATUS</span>
          <span className="text-[#ff0033] font-bold animate-pulse">
            {combatMode ? 'COMBAT HUD' : 'ONLINE'}
          </span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>OPERATOR</span>
          <span className="text-white font-bold">SHAURYA</span>
        </div>
      </div>
    </nav>
  );
};
