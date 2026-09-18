import React, { useState } from 'react';
import { Globe, Search, Play, ExternalLink, Youtube, FileText, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const BrowserView: React.FC = () => {
  const [query, setQuery] = useState('Stark Industries Arc Reactor tech');
  const [activeVideoId, setActiveVideoId] = useState('t0q_Jp2V_eU'); // Video ID
  const [activeTab, setActiveTab] = useState<'search' | 'youtube' | 'summary'>('youtube');

  const youtubeVideos = [
    {
      id: 't0q_Jp2V_eU',
      title: 'Stark Industries Next-Gen Arc Reactor Technology Unveiled',
      channel: 'Stark Expo',
      views: '1.4M views',
    },
    {
      id: 'D0q_4b52z6U',
      title: 'Iron Man Mark VII Suit Up - System HUD Analysis',
      channel: 'Avengers Tech',
      views: '2.8M views',
    },
    {
      id: '9bZkp7q19f0',
      title: 'NVIDIA GeForce RTX 4050 Laptop GPU In-Depth Gaming Benchmarks',
      channel: 'Hardware Unboxed',
      views: '840K views',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    soundEffects.playClick();
    if (query.toLowerCase().includes('hud')) {
      setActiveVideoId('D0q_4b52z6U');
    } else if (query.toLowerCase().includes('rtx')) {
      setActiveVideoId('9bZkp7q19f0');
    } else {
      setActiveVideoId('t0q_Jp2V_eU');
    }
  };

  const handleVideoSelect = (id: string) => {
    soundEffects.playClick();
    setActiveVideoId(id);
  };

  return (
    <div id="jarvis-browser-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              WEB BROWSER &amp; YOUTUBE INTELLIGENCE
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              QUANTUM WEB RECONNAISSANCE • VIDEO TELEMETRY • STARK NET
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { soundEffects.playClick(); setActiveTab('youtube'); }}
            className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all text-[10px] tracking-wider cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-[#880015]/80 border border-[#ff0033] text-white font-bold shadow-[0_0_12px_#ff0033]'
                : 'border border-[#880015]/50 bg-black/50 text-white/70 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-[#ff0033]" />
            <span>YOUTUBE</span>
          </button>
          <button
            type="button"
            onClick={() => { soundEffects.playClick(); setActiveTab('summary'); }}
            className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all text-[10px] tracking-wider cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-[#880015]/80 border border-[#ffd700] text-[#ffd700] font-bold shadow-[0_0_12px_#ffd700]'
                : 'border border-[#880015]/50 bg-black/50 text-white/70 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>DIGEST</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3 mb-5">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-[#ff0033]/70 absolute left-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search YouTube or web directive (e.g. 'Arc Reactor', 'Stark Tech')..."
            className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-black/80 border border-[#880015]/70 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd700] text-xs font-mono tracking-wider shadow-inner"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,51,0.5)]"
        >
          SEARCH
        </button>
      </form>

      {/* Main Content Area */}
      {activeTab === 'youtube' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Video Player */}
          <div className="lg:col-span-2 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 overflow-hidden flex flex-col shadow-2xl">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                title="JARVIS YouTube Player"
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=0&rel=0`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-black/60 border-t border-[#880015]/70">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                    Verified Stream: {query}
                  </h3>
                  <p className="text-[10px] text-white/70 mt-1 font-sans">
                    J.A.R.V.I.S. verified telemetry feed and launched secure media rendering engine.
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-sm border border-[#ffd700]/60 bg-black/80 hover:bg-[#ffd700]/20 text-[#ffd700] flex items-center gap-1.5 transition-colors text-[10px] tracking-wider"
                >
                  <span>OPEN ON YOUTUBE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Video Recommendations / Search results */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold flex items-center justify-between">
              <span>Related Intelligence</span>
              <span className="text-[#ffd700]">STARK NET</span>
            </div>
            {youtubeVideos.map((v) => (
              <div
                key={v.id}
                onClick={() => handleVideoSelect(v.id)}
                className={`p-3 rounded-sm border cursor-pointer transition-all duration-200 flex flex-col gap-1 ${
                  activeVideoId === v.id
                    ? 'border-[#ff0033] bg-[#880015]/40 shadow-[0_0_12px_rgba(255,0,51,0.4)]'
                    : 'border-[#880015]/40 bg-black/60 hover:border-[#ffd700]/60 hover:bg-[#880015]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#ff0033] text-[9px] font-bold flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    <span>{v.channel}</span>
                  </span>
                  <span className="text-[#ffd700] text-[9px]">{v.views}</span>
                </div>
                <div className="text-xs font-semibold text-white/90 line-clamp-2 font-sans">
                  {v.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Page Summary View */
        <div className="p-6 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
            <span className="tracking-wider">J.A.R.V.I.S. WEBPAGE DIGEST &amp; ANALYSIS</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-mono">
            Target: <span className="text-[#ffd700]">https://starkindustries.com/arc-reactor</span>
          </p>
          <div className="p-4 rounded-sm bg-black/60 border border-[#880015]/60 text-xs text-white/90 space-y-2.5 leading-relaxed font-sans">
            <div className="font-bold text-[#ffd700] font-['Michroma',sans-serif] text-xs">Summary Telemetry:</div>
            <p className="text-white/80">
              • Quantum Output: 3.4 Gigawatts nominal output with stabilized magnetic containment field.
            </p>
            <p className="text-white/80">
              • Repulsor Efficiency: 99.4% energy transfer rate with zero plasma thermal leakage.
            </p>
            <p className="text-white/80">
              • Windows 11 Bridge: Native direct memory access via Ollama qwen3:8b and Gemini neural processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
