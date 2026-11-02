/**
 * Tactile Brutalism Audio Synthesizer
 * Uses native Web Audio API (zero external assets) to create mechanical,
 * industrial micro-clicks and relay telemetry tones.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Crisp mechanical button click
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Heavy mechanical relay latch (for funding deposit & lock)
  public playRelayLock() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      // First click
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, t);
      osc1.frequency.exponentialRampToValueAtTime(60, t + 0.06);
      gain1.gain.setValueAtTime(0.12, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.06);

      // Heavy resonant clunk
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(140, t + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(40, t + 0.16);
      gain2.gain.setValueAtTime(0.18, t + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.07);
      osc2.stop(t + 0.16);
    } catch {
      // Audio fallback
    }
  }

  // Funds released celebration chime (dual high-tech confirmation)
  public playReleaseSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      [880, 1174.66, 1760].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.08);
        gain.gain.setValueAtTime(0.08, t + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.22);
      });
    } catch {
      // Audio fallback
    }
  }

  // Dispute / Warning alert
  public playHazard() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.setValueAtTime(190, t + 0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // Audio fallback
    }
  }
}

export const soundFx = new SoundController();
