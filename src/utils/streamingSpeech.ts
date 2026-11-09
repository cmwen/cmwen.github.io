/** Schedule PCM continuously while the worker generates ahead of playback. */
export class StreamingSpeech {
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
  constructor(
    readonly context: AudioContext,
    private sampleRate: number
  ) {}

  get bufferedSeconds() {
    return (
      Math.max(0, this.tail - this.context.currentTime) + this.pendingSeconds
    );
  }

  setRate(rate: number) {
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
    for (const item of remaining) this.schedule(item.buffer, item.offset);
  }

  private schedule(buffer: AudioBuffer, offset = 0) {
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = this.rate;
    source.connect(this.context.destination);
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
    // A short initial cushion absorbs model jitter; later frames schedule immediately.
    if (this.started || this.pendingSeconds >= 2) this.flush();
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
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async finish() {
    this.flush();
    while (!this.stopped && this.queue.length) {
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
    void this.context.close();
  }
}
