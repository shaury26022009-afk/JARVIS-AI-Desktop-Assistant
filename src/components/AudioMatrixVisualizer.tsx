import React, { useEffect, useState } from 'react';
import { voiceService } from '../services/voiceService';

interface AudioMatrixVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  barCount?: number;
  className?: string;
  themeColor?: 'ironman' | 'cyan';
}

export const AudioMatrixVisualizer: React.FC<AudioMatrixVisualizerProps> = ({
  isListening,
  isSpeaking,
  barCount = 38,
  className = '',
  themeColor = 'ironman',
}) => {
  const [bars, setBars] = useState<number[]>(() => new Array(barCount).fill(5));

  useEffect(() => {
    const interval = setInterval(() => {
      const heights = voiceService.getAudioMatrix(barCount);
      setBars([...heights]);
    }, 60);

    return () => clearInterval(interval);
  }, [barCount, isListening, isSpeaking]);

  const active = isListening || isSpeaking;

  return (
    <div
      className={`flex items-end justify-between gap-[3px] h-[36px] w-full border-b border-[#880015]/60 pb-1 ${className}`}
      title={active ? 'AUDIO MATRIX: ACTIVE' : 'AUDIO MATRIX: STANDBY'}
    >
      {bars.map((height, idx) => {
        // Color mapping: gold accent for center spikes, red for flanks, stark white for tops
        const isCenter = Math.abs(idx - barCount / 2) < 8;
        let barColor = 'bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.4)]';

        if (active) {
          if (isCenter && isSpeaking) {
            barColor = 'bg-[#ffd700] shadow-[0_0_10px_#ffd700]';
          } else if (isListening) {
            barColor = 'bg-[#ff0033] shadow-[0_0_10px_#ff0033]';
          } else {
            barColor = 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]';
          }
        }

        return (
          <div
            key={idx}
            className={`w-[5px] rounded-t-sm transition-all duration-75 ${barColor}`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
};
