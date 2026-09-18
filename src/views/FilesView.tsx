import React, { useState } from 'react';
import { FolderOpen, Search, Filter, FolderPlus, Trash2, ArrowRight, CheckCircle2, FileText, FileCode, FileArchive, Shield } from 'lucide-react';
import { FileItem } from '../types';
import { soundEffects } from '../services/soundEffects';

interface FilesViewProps {
  files: FileItem[];
  onOrganizeFiles: (mode: string) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({ files, onOrganizeFiles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const safeFiles = Array.isArray(files) ? files : [];

  const filteredFiles = safeFiles.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFolder === 'downloads') return f.path.includes('Downloads');
    if (activeFolder === 'projects') return f.path.includes('Projects');
    if (activeFolder === 'documents') return f.path.includes('Documents') || f.path.includes('Cars');
    return true;
  });

  const handleCleanDownloads = () => {
    soundEffects.playReactorPulse();
    onOrganizeFiles('clean_downloads');
    setStatusMessage('Downloads cleanup complete: 18 files cataloged and categorized.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOrganizeCars = () => {
    soundEffects.playClick();
    onOrganizeFiles('organize_cars');
    setStatusMessage('Created C:\\Users\\User\\Documents\\Cars and moved vehicle assets.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div id="jarvis-files-view" className="flex-1 h-full overflow-hidden p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              FILE SYSTEM AGENT // WINDOWS 11 EXPLORER
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              SEARCH, SMART CATEGORIZATION, CLEANUP &amp; FILE INTEGRITY
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleOrganizeCars}
            className="px-3 py-1.5 rounded-sm border border-[#880015] bg-[#0a0204] hover:bg-[#880015]/30 hover:border-[#ffd700] text-white flex items-center gap-1.5 transition-all text-[10px] tracking-wider cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>CREATE "CARS" FOLDER &amp; MOVE</span>
          </button>
          <button
            type="button"
            onClick={handleCleanDownloads}
            className="px-3.5 py-1.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,0,51,0.5)] text-[10px] tracking-wider cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>CLEAN UP DOWNLOADS</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-4 p-3 rounded-sm border border-[#ffd700] bg-[#880015]/80 text-[#ffd700] text-xs flex items-center gap-2 shadow-[0_0_12px_#ffd700]">
          <CheckCircle2 className="w-4 h-4 text-[#ffd700] shrink-0" />
          <span className="font-sans text-xs">{statusMessage}</span>
        </div>
      )}

      {/* Search & Folder Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#ff0033]/70 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filenames, paths, or extensions..."
            className="w-full pl-9 pr-4 py-2 rounded-sm bg-black/80 border border-[#880015]/70 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd700] text-xs font-mono tracking-wider shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'downloads', 'projects', 'documents'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { soundEffects.playClick(); setActiveFolder(f); }}
              className={`px-3 py-1.5 rounded-sm uppercase text-[9px] tracking-widest transition-all cursor-pointer ${
                activeFolder === f
                  ? 'border border-[#ff0033] bg-[#880015]/60 text-white font-bold shadow-[0_0_8px_#ff0033]'
                  : 'border border-[#880015]/40 bg-black/50 text-white/70 hover:bg-[#880015]/20 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* File List Table */}
      <div className="flex-1 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 overflow-hidden flex flex-col shadow-2xl">
        <div className="grid grid-cols-12 p-3 border-b border-[#880015]/70 bg-black/60 text-[10px] text-white/80 uppercase tracking-wider font-semibold">
          <div className="col-span-5">Filename &amp; Type</div>
          <div className="col-span-4">Full Path</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-1 text-right">Modified</div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#880015]/20 font-mono">
          {filteredFiles.length === 0 ? (
            <div className="p-8 text-center text-white/40 italic">
              No matching files found in target scope.
            </div>
          ) : (
            filteredFiles.map((file, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-3 hover:bg-[#880015]/20 transition-colors items-center text-[11px] text-white/90"
              >
                <div className="col-span-5 flex items-center gap-2.5 truncate pr-2">
                  {file.extension === '.py' || file.extension === '.c' ? (
                    <FileCode className="w-4 h-4 text-[#ffd700] shrink-0" />
                  ) : file.extension === '.pdf' ? (
                    <FileText className="w-4 h-4 text-[#ff0033] shrink-0" />
                  ) : (
                    <FileArchive className="w-4 h-4 text-white shrink-0" />
                  )}
                  <span className="font-semibold text-white truncate font-sans text-xs">{file.name}</span>
                </div>
                <div className="col-span-4 text-white/60 truncate text-[10px] pr-2">
                  {file.path}
                </div>
                <div className="col-span-2 text-[#ffd700] text-[10px]">
                  {file.sizeBytes > 1048576
                    ? `${(file.sizeBytes / 1048576).toFixed(1)} MB`
                    : `${(file.sizeBytes / 1024).toFixed(1)} KB`}
                </div>
                <div className="col-span-1 text-right text-white/50 text-[10px]">
                  {new Date(file.modified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
