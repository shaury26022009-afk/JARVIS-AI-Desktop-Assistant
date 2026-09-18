export class VoiceService {
  private recognition: any = null;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private isListening = false;
  private isSpeaking = false;
  private wakeWord = 'hey jarvis';
  private wakeWordEnabled = true;
  private lastAudioActivity = 0;
  private restartTimeout: any = null;

  public onSpeechResult: ((text: string) => void) | null = null;
  public onStateChange: ((state: 'idle' | 'listening' | 'speaking') => void) | null = null;
  public onWakeWordDetected: (() => void) | null = null;
  public onError: ((err: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.initRecognition();
    }
  }

  private initRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const activeText = (finalTranscript || interimTranscript).trim();
          if (!activeText) return;

          const lower = activeText.toLowerCase();

          // Check wake word if enabled
          if (this.wakeWordEnabled && (lower.includes('hey jarvis') || lower.includes('jarvis'))) {
            if (this.onWakeWordDetected) {
              this.onWakeWordDetected();
            }
          }

          if (finalTranscript && this.onSpeechResult) {
            this.onSpeechResult(finalTranscript.trim());
          }
        };

        this.recognition.onerror = (event: any) => {
          console.log('[VoiceService] Recognition status notice:', event.error);
          // If error is 'no-speech', do NOT stop listening! Keep alive.
          if (event.error === 'no-speech') {
            return;
          }
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.isListening = false;
            if (this.onStateChange) this.onStateChange('idle');
            if (this.onError) {
              this.onError('Microphone permission not granted in this browser tab.');
            }
          }
        };

        this.recognition.onend = () => {
          // If the user intended to keep listening, auto-restart with a short delay
          if (this.isListening) {
            clearTimeout(this.restartTimeout);
            this.restartTimeout = setTimeout(() => {
              if (this.isListening && this.recognition) {
                try {
                  this.recognition.start();
                } catch {
                  // already started or transitioning
                }
              }
            }, 300);
          }
        };
      } catch (e) {
        console.warn('[VoiceService] Failed to initialize SpeechRecognition:', e);
      }
    }
  }

  public setWakeWord(phrase: string, enabled: boolean) {
    this.wakeWord = phrase.toLowerCase();
    this.wakeWordEnabled = enabled;
  }

  public async startListening(): Promise<boolean> {
    try {
      this.isListening = true;
      if (this.onStateChange) this.onStateChange('listening');

      // Initialize mic audio stream & analyzer first for hardware visualizer
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            this.audioContext = new AudioContextClass();
            if (this.audioContext.state === 'suspended') {
              await this.audioContext.resume();
            }
            const source = this.audioContext.createMediaStreamSource(this.micStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            this.analyser.smoothingTimeConstant = 0.8;
            source.connect(this.analyser);
          }
        } catch (e: any) {
          console.log('[VoiceService] UserMedia audio stream notice:', e?.message || e);
        }
      }

      // Start recognition if available
      if (this.recognition) {
        try {
          this.recognition.start();
        } catch (startErr: any) {
          // If already started or active, that's fine
          if (startErr?.name !== 'InvalidStateError') {
            console.log('[VoiceService] Recognition start warning:', startErr?.message);
          }
        }
      }

      return true;
    } catch (e) {
      console.warn('[VoiceService] Recognition start error:', e);
      this.isListening = false;
      if (this.onStateChange) this.onStateChange('idle');
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    clearTimeout(this.restartTimeout);

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
      this.analyser = null;
    }

    if (this.onStateChange && !this.isSpeaking) {
      this.onStateChange('idle');
    }
  }

  public speak(
    text: string,
    options?: { rate?: number; pitch?: number; volume?: number; voiceName?: string; onEnd?: () => void }
  ) {
    if (!this.synth) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    this.stopSpeaking();

    // Clean markdown or technical noise from text for natural speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block output.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || 1.05;
    utterance.pitch = options?.pitch || 0.95;
    utterance.volume = options?.volume || 1.0;

    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      // Find high quality English male or natural voice (Stark JARVIS style)
      const selectedVoice =
        voices.find((v) => v.name.includes('Natural') && v.lang.startsWith('en')) ||
        voices.find((v) => (v.name.includes('George') || v.name.includes('David') || v.name.includes('Guy') || v.name.includes('UK English Male')) && v.lang.startsWith('en')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange('speaking');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(this.isListening ? 'listening' : 'idle');
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.log('[VoiceService] SpeechSynthesis complete/ended:', e);
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(this.isListening ? 'listening' : 'idle');
      if (options?.onEnd) options.onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    if (this.onStateChange) {
      this.onStateChange(this.isListening ? 'listening' : 'idle');
    }
  }

  public getAudioFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Generates bar heights for the 38-bar audio matrix visualizer
   * Reacts to real microphone frequency or synthesis state
   */
  public getAudioMatrix(count: number = 38): number[] {
    const bars = new Array(count).fill(5);
    const freqData = this.getAudioFrequencyData();

    if (this.isSpeaking) {
      // Dynamic synthesis wave
      const now = Date.now() / 120;
      for (let i = 0; i < count; i++) {
        const wave = Math.sin(i * 0.4 + now) * 12 + Math.cos(i * 0.2 - now * 0.7) * 10;
        bars[i] = Math.max(5, Math.min(32, Math.round(14 + wave)));
      }
      return bars;
    }

    if (this.isListening) {
      if (freqData && freqData.length > 0) {
        const step = Math.floor(freqData.length / count) || 1;
        for (let i = 0; i < count; i++) {
          const sample = freqData[i * step] || 0;
          bars[i] = Math.max(5, Math.min(35, Math.round((sample / 255) * 32 + 5)));
        }
      } else {
        // Subtle ambient pulse when listening
        const now = Date.now() / 200;
        for (let i = 0; i < count; i++) {
          const wave = Math.sin(i * 0.35 + now) * 7;
          bars[i] = Math.max(5, Math.min(24, Math.round(10 + wave)));
        }
      }
      return bars;
    }

    return bars;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const voiceService = new VoiceService();
