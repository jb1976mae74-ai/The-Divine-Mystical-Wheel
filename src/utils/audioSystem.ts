/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSystem {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private primaryGain: GainNode | null = null;
  private carrierOsc: OscillatorNode | null = null;
  private harmonicOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isMuted: boolean = false;
  private activeWordBounce: number = 0;

  constructor() {}

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      // Configure for high frequency resolution
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;

      this.primaryGain = this.ctx.createGain();
      this.primaryGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Deep resonant fundamental oscillator (56Hz is octave subharmonic of 112Hz)
      this.carrierOsc = this.ctx.createOscillator();
      this.carrierOsc.type = "sine";
      this.carrierOsc.frequency.setValueAtTime(56, this.ctx.currentTime);

      // Warm harmonic oscillator (112Hz is direct Salazar structural alignment)
      this.harmonicOsc = this.ctx.createOscillator();
      this.harmonicOsc.type = "triangle";
      this.harmonicOsc.frequency.setValueAtTime(112, this.ctx.currentTime);

      // Gentle sub-bass layer (28Hz) to feel the resonant depth
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = "sine";
      this.subOsc.frequency.setValueAtTime(28, this.ctx.currentTime);

      // LFO to create structural, waving, chanting dynamic in the filters
      this.lfoOsc = this.ctx.createOscillator();
      this.lfoOsc.type = "sine";
      this.lfoOsc.frequency.setValueAtTime(3.6, this.ctx.currentTime); // 3.6 Hz chanting speed
      
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(60, this.ctx.currentTime); // Depth of filter modulation

      // Map up the synthesizer circuit
      this.lfoOsc.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode.frequency);

      this.carrierOsc.connect(this.filterNode);
      this.harmonicOsc.connect(this.filterNode);
      this.subOsc.connect(this.filterNode);

      this.filterNode.connect(this.primaryGain);
      this.primaryGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Fire up the generators
      this.carrierOsc.start();
      this.harmonicOsc.start();
      this.subOsc.start();
      this.lfoOsc.start();
    } catch (e) {
      console.warn("Failed to initiate real-time AudioContext:", e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.primaryGain) {
      const targetGain = muted ? 0 : 0.28;
      this.primaryGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.12);
    }
  }

  public startSpeech() {
    this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(console.warn);
    }

    const t = this.ctx.currentTime;
    const currentMuteState = this.isMuted;

    if (this.primaryGain && this.filterNode) {
      this.primaryGain.gain.cancelScheduledValues(t);
      this.primaryGain.gain.setValueAtTime(this.primaryGain.gain.value, t);
      // Fade in comfortably to 28% volume to avoid click issues
      this.primaryGain.gain.linearRampToValueAtTime(currentMuteState ? 0 : 0.24, t + 0.4);

      this.filterNode.frequency.cancelScheduledValues(t);
      this.filterNode.frequency.setValueAtTime(180, t);
      this.filterNode.frequency.exponentialRampToValueAtTime(360, t + 0.6);
    }
  }

  public endSpeech() {
    if (!this.ctx || !this.primaryGain) return;
    const t = this.ctx.currentTime;
    this.primaryGain.gain.cancelScheduledValues(t);
    this.primaryGain.gain.setValueAtTime(this.primaryGain.gain.value, t);
    // Smooth fade out
    this.primaryGain.gain.linearRampToValueAtTime(0, t + 0.4);
    this.activeWordBounce = 0;
  }

  public triggerWordBoundaryPulse() {
    if (!this.ctx || !this.primaryGain || !this.filterNode || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Reacting to spoken word boundary updates
    this.activeWordBounce = 0.2;

    this.primaryGain.gain.cancelScheduledValues(t);
    this.primaryGain.gain.setValueAtTime(this.primaryGain.gain.value, t);
    // Swell volume briefly to simulate throat voice modulation
    this.primaryGain.gain.linearRampToValueAtTime(0.38, t + 0.04);
    this.primaryGain.gain.exponentialRampToValueAtTime(0.24, t + 0.28);

    this.filterNode.frequency.cancelScheduledValues(t);
    this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, t);
    // Shift frequency cuts up for vocal consonant sizzle
    this.filterNode.frequency.exponentialRampToValueAtTime(680, t + 0.04);
    this.filterNode.frequency.exponentialRampToValueAtTime(320, t + 0.32);
  }

  public getFrequencyData(array: Uint8Array) {
    if (this.analyser && this.ctx && this.ctx.state !== "suspended") {
      this.analyser.getByteFrequencyData(array);
    } else {
      array.fill(0);
    }
  }

  public getWaveformData(array: Uint8Array) {
    if (this.analyser && this.ctx && this.ctx.state !== "suspended") {
      this.analyser.getByteTimeDomainData(array);
    } else {
      array.fill(128);
    }
  }

  public getAnalyserByteFrequencyData(): Uint8Array | null {
    if (this.analyser && this.ctx && this.ctx.state !== "suspended") {
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(data);
      return data;
    }
    return null;
  }

  public getAnalyserByteTimeDomainData(): Uint8Array | null {
    if (this.analyser && this.ctx && this.ctx.state !== "suspended") {
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(data);
      return data;
    }
    return null;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public isAudioActive(): boolean {
    return !this.isMuted && !!this.ctx && this.ctx.state !== "suspended";
  }

  public getActiveWordBounce(): number {
    const val = this.activeWordBounce;
    // Gradually decay the scalar
    if (this.activeWordBounce > 0) {
      this.activeWordBounce *= 0.92;
      if (this.activeWordBounce < 0.01) this.activeWordBounce = 0;
    }
    return val;
  }

  /**
   * Plays a quick UI tone for buttons, toggles, or auditory feedback.
   */
  public playTone(freq: number = 440, type: OscillatorType = "sine", duration: number = 0.15, volume: number = 0.12) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(console.warn);
    }
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      gain.gain.setValueAtTime(0, t + duration + 0.02);

      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      }
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration + 0.05);
    } catch (e) {
      console.warn("Error playing tone:", e);
    }
  }

  /**
   * Plays a distinct, localized resonant chime tone corresponding to the 7 sacred star points of the Heptagram.
   * Utilizes Solfeggio / celestial overtone bell synthesis with an exponential acoustic decay envelope.
   */
  public playStarPointResonance(pointIndex: number, customFreq?: number) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(console.warn);
    }

    const t = this.ctx.currentTime;

    // 7 Sacred celestial Solfeggio / Harmonic frequencies (Hz) tuned for the 7 star points
    const baseFrequencies = [
      963, // Point 0 (Crown / Zenith Apex) - Divine Illumination & Crown Resonance
      852, // Point 1 (Wisdom / Northeast) - Intuitive Awakening
      741, // Point 2 (Understanding / East) - Spiritual Expression
      639, // Point 3 (Mercy / Nether East) - Heart & Connection
      528, // Point 4 (Severity / Nether West) - Transformation & Miracle Tone
      417, // Point 5 (Beauty / West) - Transmutation & Facilitating Change
      396  // Point 6 (Foundation / Northwest) - Grounding & Liberation
    ];

    const freq = customFreq || baseFrequencies[((pointIndex % 7) + 7) % 7];

    try {
      // Primary resonant bell oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, t);

      // Warm harmonic overtone (1.5x fifth)
      const osc2 = this.ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 1.5, t);

      // Crystalline shimmer overtone (2.76x)
      const osc3 = this.ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(freq * 2.76, t);

      // Deep foundation subharmonic (0.5x)
      const oscSub = this.ctx.createOscillator();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(freq * 0.5, t);

      // Dedicated resonant gain envelope
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0, t);
      // Fast crisp attack
      chimeGain.gain.linearRampToValueAtTime(0.35, t + 0.015);
      // Bell exponential decay over ~2.4 seconds
      chimeGain.gain.exponentialRampToValueAtTime(0.0008, t + 2.4);
      chimeGain.gain.setValueAtTime(0, t + 2.45);

      // Soft bandpass filter for warm acoustic character
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq * 1.25, t);
      filter.Q.setValueAtTime(2.2, t);

      // Connect synthesis nodes
      osc1.connect(chimeGain);
      osc2.connect(chimeGain);
      osc3.connect(chimeGain);
      oscSub.connect(chimeGain);

      chimeGain.connect(filter);

      if (this.analyser) {
        filter.connect(this.analyser);
      }
      filter.connect(this.ctx.destination);

      // Trigger word bounce / visualizer particle flare
      this.activeWordBounce = 0.5;

      // Start and auto-cleanup
      osc1.start(t);
      osc2.start(t);
      osc3.start(t);
      oscSub.start(t);

      osc1.stop(t + 2.5);
      osc2.stop(t + 2.5);
      osc3.stop(t + 2.5);
      oscSub.stop(t + 2.5);
    } catch (err) {
      console.warn("Failed to play resonant star chime:", err);
    }
  }
}

export const audioSystem = new AudioSystem();
