/** Package streamed mono PCM for native, pitch-preserving media playback. */
function wav(chunks: Float32Array[], sampleRate: number): Blob {
  const samples = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const bytes = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(bytes);
  const label = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++)
      view.setUint8(offset + i, text.charCodeAt(i));
  };
  label(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  label(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  label(36, "data");
  view.setUint32(40, samples * 2, true);
  let offset = 44;
  for (const chunk of chunks)
    for (const value of chunk) {
      const sample = Math.max(-1, Math.min(1, value));
      view.setInt16(offset, sample * (sample < 0 ? 32768 : 32767), true);
      offset += 2;
    }
  return new Blob([bytes], { type: "audio/wav" });
}

/** Generate ahead, preload the next segment, and preserve pitch at every speed. */
export class StreamingSpeech {
  readonly elements = [new Audio(), new Audio()];
  private queue: { url: string; seconds: number }[] = [];
  private pending: Float32Array[] = [];
  private pendingSeconds = 0;
  private slot = 0;
  private stopped = false;
  private error: unknown;
  private rate = 1;
  private primed = false;
  paused = false;

  constructor(private sampleRate: number) {
    for (const audio of this.elements) {
      audio.preload = "auto";
      audio.preservesPitch = true;
      audio.onerror = () => {
        this.error = new Error("Audio playback failed");
      };
    }
  }

  /** Unlock both reusable media elements inside the Listen click gesture. */
  async resume() {
    this.paused = false;
    if (!this.primed) {
      this.primed = true;
      const silent = URL.createObjectURL(
        wav([new Float32Array(240)], this.sampleRate)
      );
      try {
        await Promise.all(
          this.elements.map(async audio => {
            audio.src = silent;
            await audio.play();
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
          })
        );
      } finally {
        URL.revokeObjectURL(silent);
      }
    } else if (this.queue.length && !this.stopped) {
      await this.elements[this.slot].play();
    }
  }

  pause() {
    this.paused = true;
    this.elements[this.slot].pause();
  }

  get bufferedSeconds() {
    const consumed = this.queue.length
      ? this.elements[this.slot].currentTime
      : 0;
    return (
      (Math.max(
        0,
        this.queue.reduce((sum, entry) => sum + entry.seconds, 0) - consumed
      ) +
        this.pendingSeconds) /
      this.rate
    );
  }

  setRate(rate: number) {
    this.rate = rate;
    for (const audio of this.elements) audio.playbackRate = rate;
  }

  private prepareNext() {
    if (this.queue.length > 1)
      this.elements[1 - this.slot].src = this.queue[1].url;
  }

  private playNext() {
    if (!this.queue.length || this.stopped) return;
    const audio = this.elements[this.slot];
    if (audio.src !== this.queue[0].url) audio.src = this.queue[0].url;
    audio.playbackRate = this.rate;
    audio.onended = () => {
      const finished = this.queue.shift();
      if (finished) URL.revokeObjectURL(finished.url);
      audio.onended = null;
      audio.removeAttribute("src");
      audio.load();
      this.slot = 1 - this.slot;
      this.playNext();
    };
    this.prepareNext();
    if (!this.paused)
      void audio.play().catch(error => {
        this.error = error;
      });
  }

  append(pcm: Float32Array) {
    if (this.stopped) return;
    this.pending.push(pcm);
    this.pendingSeconds += pcm.length / this.sampleRate;
    // Two-second segments let the next buffer fill during current playback.
    if (this.pendingSeconds >= 2) this.flush();
  }

  flush() {
    if (!this.pending.length || this.stopped) return;
    const wasEmpty = this.queue.length === 0;
    this.queue.push({
      url: URL.createObjectURL(wav(this.pending, this.sampleRate)),
      seconds: this.pendingSeconds,
    });
    this.pending = [];
    this.pendingSeconds = 0;
    if (wasEmpty) this.playNext();
    else if (this.queue.length === 2) this.prepareNext();
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
    while (!this.stopped && this.queue.length) {
      if (this.error) throw this.error;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  stop() {
    this.stopped = true;
    for (const audio of this.elements) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    for (const entry of this.queue) URL.revokeObjectURL(entry.url);
    this.queue = [];
    this.pending = [];
  }
}
