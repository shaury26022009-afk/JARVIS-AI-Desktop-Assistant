import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { PendingConfirmation } from '../types';
import { soundEffects } from '../services/soundEffects';

interface ConfirmationModalProps {
  confirmation: PendingConfirmation | null;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ confirmation }) => {
  if (!confirmation) return null;

  const isLevel3 = confirmation.riskLevel === 3;

  return (
    <div
      id="confirmation-modal-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-['Michroma',sans-serif]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md rounded-sm border-2 p-6 text-white shadow-2xl relative ${
          isLevel3
            ? 'border-[#ff0033] bg-[#0c0204]/98 shadow-[0_0_30px_rgba(255,0,51,0.6)]'
            : 'border-[#ffd700] bg-[#0c0502]/98 shadow-[0_0_30px_rgba(255,215,0,0.5)]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-3 rounded-sm border ${
              isLevel3
                ? 'border-[#ff0033] bg-[#880015]/80 text-white'
                : 'border-[#ffd700] bg-[#880015]/60 text-[#ffd700]'
            }`}
          >
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-[#ffd700] font-semibold">
              SECURITY CONFIRMATION REQUIRED (LEVEL {confirmation.riskLevel})
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide mt-0.5">
              {confirmation.title}
            </h3>
          </div>
        </div>

        {/* Description & Payload Details */}
        <div className="p-4 rounded-sm border border-[#880015]/80 bg-black/70 text-xs mb-5 space-y-2">
          <p className="text-white/90 leading-relaxed font-sans">{confirmation.description}</p>

          {/* Key-Value payload cards */}
          {confirmation.actionDetails && (
            <div className="mt-3 pt-3 border-t border-[#880015]/60 space-y-1.5 font-mono text-[11px]">
              {Object.entries(confirmation.actionDetails).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-4">
                  <span className="text-[#ffd700] capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-white font-semibold text-right break-all">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="modal-cancel-btn"
            type="button"
            onClick={() => {
              soundEffects.playClick();
              confirmation.onReject();
            }}
            className="px-4 py-2 rounded-sm border border-[#880015] hover:bg-[#880015]/30 text-white/80 text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
          >
            CANCEL / ABORT
          </button>
          <button
            id="modal-confirm-btn"
            type="button"
            onClick={() => {
              soundEffects.playReactorPulse();
              confirmation.onConfirm();
            }}
            className={`px-5 py-2 rounded-sm font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              isLevel3
                ? 'bg-[#ff0033] hover:bg-white hover:text-black text-white shadow-[0_0_15px_#ff0033]'
                : 'bg-[#ffd700] hover:bg-white text-black shadow-[0_0_15px_#ffd700]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHORIZE &amp; EXECUTE</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
