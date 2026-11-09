import type { SoundTouchNode } from "@soundtouchjs/audio-worklet";
import processorUrl from "@soundtouchjs/audio-worklet/processor?url";

/** One continuous audio graph; PCM frames never restart a media player. */
export class StreamingSpeech {
  readonly context = new AudioContext();
  readonly output = this.context.createGain();
  private input = this.context.createGain();
  private correction: SoundTouchNode | null = null;
  private nodeClass: typeof SoundTouchNode | null = null;
  private queue: {
    buffer: AudioBuffer;
    offset: number;
    start: number;
    source: AudioBufferSourceNode;
  }[] = [];
  private rate = 1;
  private tail = 0;
  private stopped = false;
  private started = false;
  private pending: Float32Array[] = [];
  private pendingSeconds = 0;
  private error: Error | null = null;
  paused = false;

  constructor(private sampleRate: number) {
    this.input.connect(this.output);
    this.output.connect(this.context.destination);
  }

  async resume() {
    this.paused = false;
    await this.context.resume();
    if (!this.nodeClass) {
      const { SoundTouchNode } = await import("@soundtouchjs/audio-worklet");
      if (this.stopped) return;
      await SoundTouchNode.register(this.context, processorUrl);
      if (this.stopped) return;
      this.nodeClass = SoundTouchNode;
      this.route();
    }
  }

  pause() {
    this.paused = true;
    void this.context.suspend();
  }

  private route() {
    this.input.disconnect();
    if (this.correction) {
      this.correction.disconnect();
      this.correction.port.close();
      this.correction = null;
    }
    // No time-stretch processing or extra latency at normal reading speed.
    if (this.rate === 1 || !this.nodeClass) this.input.connect(this.output);
    else {
      this.correction = new this.nodeClass({ context: this.context });
      this.correction.playbackRate.value = this.rate;
      this.correction.onprocessorerror = () => {
        this.error = new Error("Pitch correction failed");
      };
      this.input.connect(this.correction);
      this.correction.connect(this.output);
    }
  }

  get bufferedSeconds() {
    return (
      Math.max(0, this.tail - this.context.currentTime) +
      this.pendingSeconds / this.rate
    );
  }

  setRate(rate: number) {
    if (rate === this.rate) return;
    const now = this.context.currentTime;
    const remaining = this.queue
      .map(item => ({
        buffer: item.buffer,
        offset: item.offset + Math.max(0, now - item.start) * this.rate,
      }))
      .filter(item => item.offset < item.buffer.duration);
    for (const item of this.queue) {
      item.source.onended = null;
      item.source.stop();
      item.source.disconnect();
    }
    this.queue = [];
    this.tail = now;
    this.rate = rate;
    this.route();
    for (const item of remaining) this.schedule(item.buffer, item.offset);
  }

  private schedule(buffer: AudioBuffer, offset = 0) {
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = this.rate;
    source.connect(this.input);
    const start = Math.max(this.tail, this.context.currentTime + 0.02);
    const item = { buffer, offset, start, source };
    this.queue.push(item);
    source.onended = () => {
      source.disconnect();
      this.queue = this.queue.filter(entry => entry !== item);
    };
    source.start(start, offset);
    this.tail = start + (buffer.duration - offset) / this.rate;
  }

  append(pcm: Float32Array) {
    if (this.stopped) return;
    this.pending.push(pcm);
    this.pendingSeconds += pcm.length / this.sampleRate;
    // Start with a cushion; keep scheduling subsequent frames on the audio clock.
    if (this.started || this.pendingSeconds >= 3) this.flush();
  }

  flush() {
    if (!this.pending.length || this.stopped) return;
    this.started = true;
    const length = this.pending.reduce((sum, pcm) => sum + pcm.length, 0);
    const buffer = this.context.createBuffer(1, length, this.sampleRate);
    const data = buffer.getChannelData(0);
    let offset = 0;
    for (const pcm of this.pending) {
      data.set(pcm, offset);
      offset += pcm.length;
    }
    this.pending = [];
    this.pendingSeconds = 0;
    this.schedule(buffer);
  }

  async waitForRoom() {
    while (!this.stopped && this.bufferedSeconds > 10) {
      if (this.error) throw this.error;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (this.error) throw this.error;
  }

  async finish() {
    this.flush();
    // Feed silence through the worklet to drain its final processing window.
    if (!this.stopped && this.rate !== 1)
      this.schedule(
        this.context.createBuffer(1, this.sampleRate / 2, this.sampleRate)
      );
    while (!this.stopped && this.queue.length) {
      if (this.error) throw this.error;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  stop() {
    this.stopped = true;
    for (const item of this.queue) {
      item.source.onended = null;
      item.source.stop();
      item.source.disconnect();
    }
    this.queue = [];
    this.pending = [];
    this.correction?.port.close();
    this.correction?.disconnect();
    this.input.disconnect();
    this.output.disconnect();
    void this.context.close();
  }
}
