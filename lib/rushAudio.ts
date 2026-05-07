/* lib/rushAudio.ts */

class RushAudio {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmInterval: any = null;

  // Optimized initialization with latencyHint
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      const saved = localStorage.getItem("risen_rush_sound_enabled");
      this.enabled = saved === null ? true : saved === "true";

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) this.stopBGM();
    else if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  private createGain(duration: number, volume: number = 0.1) {
    if (!this.ctx) return null;
    // Ensure context is running before playing
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    gain.connect(this.ctx.destination);
    return gain;
  }

  playCoin() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.15, 0.08);
    if (!gain) return;

    const now = this.ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playGolden() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    [1320, 1760, 2200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05 + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.1);
      gain.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      osc.connect(gain);
      osc.start(now + i * 0.05);
      osc.stop(now + 0.5);
    });
  }

  playHazard() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.4, 0.2);
    if (!gain) return;

    const now = this.ctx.currentTime;
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.4);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playLevelUp() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = this.createGain(0.8, 0.05);
      if (!gain) return;

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.8);
    });
  }

  playGameOver() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(1.0, 0.15);
    if (!gain) return;

    const now = this.ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 1.0);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 1.0);
  }

  startBGM() {
    this.init();
    if (!this.ctx || !this.enabled || this.bgmInterval) return;

    const playPulse = () => {
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now); // Deep tech bass
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.5);
    };

    this.bgmInterval = setInterval(playPulse, 600);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const rushAudio = new RushAudio();
