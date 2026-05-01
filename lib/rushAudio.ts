/* lib/rushAudio.ts */

class RushAudio {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmInterval: any = null;

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const saved = localStorage.getItem("risen_rush_sound_enabled");
      this.enabled = saved === null ? true : saved === "true";
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) this.stopBGM();
  }

  private createGain(duration: number, volume: number = 0.1) {
    if (!this.ctx) return null;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    gain.connect(this.ctx.destination);
    return gain;
  }

  playCoin() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.15, 0.08);
    if (!gain) return;

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
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

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
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

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 1.0);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.0);
  }

  startBGM() {
    this.init();
    if (!this.ctx || !this.enabled || this.bgmInterval) return;

    const playPulse = () => {
      if (!this.ctx || !this.enabled) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now); // Deep tech bass
      osc.connect(gain);
      osc.start();
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
