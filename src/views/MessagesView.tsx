import React, { useState } from 'react';
import { MessageSquare, Send, ShieldCheck, CheckCircle2, User, Clock, AlertCircle, Radio } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const MessagesView: React.FC = () => {
  const [recipient, setRecipient] = useState('Tony Stark');
  const [platform, setPlatform] = useState<'whatsapp' | 'discord' | 'email'>('whatsapp');
  const [messageText, setMessageText] = useState("Mark VII suit deployment sequence initiated.");
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const [messageHistory, setMessageHistory] = useState([
    {
      id: 'msg-1',
      recipient: 'Tony Stark',
      platform: 'WhatsApp',
      message: "Mark VII suit deployment sequence initiated.",
      status: 'Delivered',
      time: '10:45 AM',
    },
    {
      id: 'msg-2',
      recipient: 'Avengers Base',
      platform: 'Discord',
      message: 'J.A.R.V.I.S. core subsystems online and verified.',
      status: 'Delivered',
      time: '09:20 AM',
    },
  ]);

  const handlePrepareMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    soundEffects.playClick();
    setIsPendingConfirmation(true);
  };

  const handleConfirmSend = () => {
    soundEffects.playReactorPulse();
    setIsPendingConfirmation(false);
    const newMsg = {
      id: `msg-${Date.now()}`,
      recipient,
      platform: platform === 'whatsapp' ? 'WhatsApp' : platform === 'discord' ? 'Discord' : 'Email',
      message: messageText,
      status: 'Delivered',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessageHistory([newMsg, ...messageHistory]);
    setStatusNotification(`Message successfully dispatched to ${recipient} via ${newMsg.platform}.`);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleCancelSend = () => {
    soundEffects.playClick();
    setIsPendingConfirmation(false);
  };

  return (
    <div id="jarvis-messages-view" className="flex-1 h-full overflow-y-auto p-4 sm:p-6 flex flex-col font-['Michroma',sans-serif] text-xs bg-[#050203] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#880015] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-[#ff0033]" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              MESSAGING &amp; NOTIFICATIONS AGENT
            </h2>
            <div className="text-[10px] text-[#ffd700] tracking-wider mt-0.5">
              WHATSAPP • DISCORD • EMAIL (LEVEL 2 RISK VERIFICATION PROTECTED)
            </div>
          </div>
        </div>
      </div>

      {statusNotification && (
        <div className="mb-4 p-3 rounded-sm border border-[#ffd700] bg-[#880015]/80 text-[#ffd700] text-xs flex items-center gap-2 shadow-[0_0_12px_#ffd700]">
          <CheckCircle2 className="w-4 h-4 text-[#ffd700] shrink-0" />
          <span className="font-sans text-xs">{statusNotification}</span>
        </div>
      )}

      {/* Main Form & Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Compose & Dispatch Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white tracking-wider">Compose Outbound Message</h3>

            {/* Platform picker */}
            <div className="flex gap-2">
              {[
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'discord', label: 'Discord' },
                { id: 'email', label: 'Email' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { soundEffects.playClick(); setPlatform(p.id as any); }}
                  className={`px-3 py-1.5 rounded-sm border text-[10px] font-semibold tracking-wider transition-all cursor-pointer ${
                    platform === p.id
                      ? 'border-[#ff0033] bg-[#880015]/80 text-white font-bold shadow-[0_0_8px_#ff0033]'
                      : 'border-[#880015]/40 bg-black/60 text-white/70 hover:bg-[#880015]/20 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-[9px] text-[#ffd700] uppercase tracking-wider mb-1">
                Recipient
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Contact name (e.g. Tony Stark)"
                className="w-full px-3 py-2 rounded-sm bg-black/80 border border-[#880015] text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd700] text-xs font-mono tracking-wider shadow-inner"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[9px] text-[#ffd700] uppercase tracking-wider mb-1">
                Message Body
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type message text..."
                className="w-full px-3 py-2 rounded-sm bg-black/80 border border-[#880015] text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd700] text-xs font-mono tracking-wider resize-none shadow-inner"
              />
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={handlePrepareMessage}
              className="w-full py-2.5 rounded-sm bg-gradient-to-r from-[#ff0033] to-[#ffd700] hover:opacity-90 text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,0,51,0.5)] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>STAGE MESSAGE FOR APPROVAL</span>
            </button>
          </div>

          {/* Level 2 Confirmation Card */}
          {isPendingConfirmation && (
            <div className="p-5 rounded-sm border-2 border-[#ffd700] bg-[#880015]/90 shadow-[0_0_20px_rgba(255,215,0,0.4)] space-y-4">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-sm">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
                <span className="tracking-wider">MESSAGE READY FOR TRANSMISSION</span>
              </div>
              <div className="p-3 rounded-sm bg-black/70 border border-[#ffd700]/50 text-xs space-y-1 font-mono">
                <div>
                  <span className="text-[#ffd700]/70">To:</span>{' '}
                  <span className="text-white font-bold">{recipient}</span>
                </div>
                <div>
                  <span className="text-[#ffd700]/70">Platform:</span>{' '}
                  <span className="text-white">{platform.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[#ffd700]/70">Message:</span>{' '}
                  <span className="text-[#ffd700] font-semibold">{messageText}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelSend}
                  className="px-4 py-2 rounded-sm border border-[#880015] hover:bg-black text-white/80 text-[10px] tracking-wider uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  className="px-5 py-2 rounded-sm bg-[#ffd700] hover:bg-white text-black font-bold text-[10px] tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  Send Directive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Transmission Log */}
        <div className="lg:col-span-5 rounded-sm border border-[#880015]/70 bg-[#0a0204]/90 p-4 flex flex-col shadow-2xl">
          <div className="text-[10px] uppercase tracking-wider text-white/80 font-bold mb-3 flex items-center justify-between">
            <span>Recent Transmissions</span>
            <span className="text-[#ffd700]">COMM LINK</span>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 font-mono">
            {messageHistory.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-sm border border-[#880015]/40 bg-black/60 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold flex items-center gap-1.5 text-[11px]">
                    <User className="w-3 h-3 text-[#ff0033]" />
                    <span>{m.recipient}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-[#880015]/60 text-[#ffd700] border border-[#ff0033]">
                      {m.platform}
                    </span>
                  </span>
                  <span className="text-[9px] text-[#ffd700] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#ffd700]" />
                    <span>{m.status}</span>
                  </span>
                </div>
                <p className="text-white/80 text-xs italic mt-0.5 font-sans">"{m.message}"</p>
                <div className="text-[9px] text-white/50 text-right mt-1">{m.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
