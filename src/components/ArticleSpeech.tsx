import { useEffect, useRef, useState } from "react";
import type { PhononTTS } from "phonon-tts";
import { StreamingSpeech } from "@utils/streamingSpeech";

/** Read visible prose only; omit diagrams, code, and decorative controls. */
function articleChunks(title: string): string[] {
  const article = document.querySelector("#article")?.cloneNode(true);
  if (!(article instanceof HTMLElement)) return [];
  article
    .querySelectorAll(
      "pre, svg, script, style, button, .heading-link, .mermaid-diagram, [aria-hidden='true']"
    )
    .forEach(node => node.remove());
  article
    .querySelectorAll("p, h2, h3, h4, h5, h6, li, blockquote, td, th, br")
    .forEach(node => node.append(" "));
  const text = `${title}. ${article.textContent ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
  // Bound synthesis memory and browser utterance length, including long sentences.
  return (
    text.match(/.{1,160}(?:\s|$)|.{1,160}/g)?.map(chunk => chunk.trim()) ?? []
  );
}

export default function ArticleSpeech({ title }: { title: string }) {
  const [ready, setReady] = useState(false);
  const [engine, setEngine] = useState("phonon");
  const [speed, setSpeed] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const model = useRef<PhononTTS | null>(null);
  const audio = useRef<StreamingSpeech | null>(null);
  const controller = useRef<AbortController | null>(null);
  const startupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [device, setDevice] = useState<"cpu" | "auto">("cpu");
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const generation = useRef(0);
  const rate = useRef(1);

  function stop() {
    generation.current++;
    if (startupTimer.current) clearTimeout(startupTimer.current);
    controller.current?.abort();
    controller.current = null;
    audio.current?.stop();
    audio.current = null;
    if (utterance.current) window.speechSynthesis?.cancel();
    utterance.current = null;
    model.current?.dispose();
    model.current = null;
    setState("idle");
  }

  useEffect(() => {
    setReady(true);
    const refreshVoices = () =>
      setVoices(
        window.speechSynthesis
          ?.getVoices()
          .filter(voice => /^en(?:-|$)/i.test(voice.lang)) ?? []
      );
    refreshVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", refreshVoices);
    const cleanup = () => stop();
    window.addEventListener("pagehide", cleanup);
    document.addEventListener("astro:before-swap", cleanup);
    return () => {
      window.removeEventListener("pagehide", cleanup);
      document.removeEventListener("astro:before-swap", cleanup);
      window.speechSynthesis?.removeEventListener?.(
        "voiceschanged",
        refreshVoices
      );
      cleanup();
    };
  }, []);

  async function listen() {
    stop();
    const id = generation.current;
    const chunks = articleChunks(title);
    setMessage("");
    if (!chunks.length) {
      setMessage("No article text is available to read.");
      return;
    }
    if (engine === "browser") {
      if (!("speechSynthesis" in window)) {
        setMessage("Browser speech is unavailable on this device. Try Phonon.");
        return;
      }
      const available = window.speechSynthesis
        .getVoices()
        .filter(voice => /^en(?:-|$)/i.test(voice.lang));
      if (!available.length) {
        setMessage(
          "No English browser voice is available yet. Install or enable an English system voice, then try again, or use Phonon."
        );
        return;
      }
      // cancel() does not reset a paused speech engine in all browsers.
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const read = (index: number) => {
        if (id !== generation.current) return;
        if (index === chunks.length) {
          utterance.current = null;
          setState("idle");
          return;
        }
        const speech = new SpeechSynthesisUtterance(chunks[index]);
        speech.lang = "en-US";
        speech.voice =
          available.find(voice => voice.voiceURI === voiceUri) ??
          available.find(voice => voice.localService) ??
          available[0];
        speech.rate = rate.current;
        speech.onstart = () => {
          if (id !== generation.current) return;
          if (startupTimer.current) clearTimeout(startupTimer.current);
          setState("playing");
          setMessage("");
        };
        speech.onend = () => {
          if (startupTimer.current) clearTimeout(startupTimer.current);
          read(index + 1);
        };
        speech.onerror = event => {
          if (id !== generation.current) return;
          stop();
          setMessage(
            `Browser speech failed (${event.error}). Try another English voice or Phonon.`
          );
        };
        utterance.current = speech;
        startupTimer.current = setTimeout(() => {
          if (id !== generation.current) return;
          stop();
          setMessage(
            "The browser voice did not start. Try another English voice, check your device audio, or use Phonon."
          );
        }, 10000);
        window.speechSynthesis.speak(speech);
      };
      setState("loading");
      setMessage("Starting browser voice…");
      read(0);
      return;
    }
    setState("loading");
    setMessage("Loading Phonon and its voice model for on-device speech…");
    // Resume the continuous audio graph inside the click gesture.
    const player = new StreamingSpeech(24000);
    player.setRate(rate.current);
    audio.current = player;
    controller.current = new AbortController();
    const signal = controller.current.signal;
    try {
      await player.resume();
      const { PhononTTS } = await import("phonon-tts");
      if (id !== generation.current) return;
      const tts = await PhononTTS.load({
        lang: "en",
        device,
        onProgress: progress => {
          if (id !== generation.current) return;
          const amount = progress.total
            ? `${Math.round((progress.loaded / progress.total) * 100)}%`
            : `${(progress.loaded / 1048576).toFixed(1)} MB`;
          setMessage(
            `Loading voice model: ${progress.file} ${amount}${progress.cached ? " (cached)" : ""}`
          );
        },
      });
      if (id !== generation.current) {
        tts.dispose();
        return;
      }
      model.current = tts;
      setMessage(
        `Buffering speech (${tts.device === "webgpu" ? "WebGPU" : "CPU"})…`
      );
      const stream = tts.stream(chunks.join(" "), { signal });
      for await (const pcm of stream) {
        if (id !== generation.current) return;
        player.append(pcm);
        if (!player.paused && player.bufferedSeconds >= 2) {
          setState("playing");
          setMessage(
            `Reading article (${tts.device === "webgpu" ? "WebGPU" : "CPU"})`
          );
        }
        await player.waitForRoom();
      }
      if (id !== generation.current) return;
      player.flush();
      setState(current => (current === "paused" ? current : "playing"));
      await player.finish();
      if (id === generation.current) {
        stop();
        setMessage("Finished reading.");
      }
    } catch {
      if (id !== generation.current) return;
      stop();
      setEngine("browser");
      setMessage(
        "Phonon could not load or play. Select Listen to use browser speech instead."
      );
    }
  }

  function togglePause() {
    if (state === "paused") {
      if (engine === "browser") window.speechSynthesis.resume();
      else
        void audio.current?.resume().catch(() => {
          stop();
          setMessage("Playback could not resume. Select Listen to restart.");
        });
      setState("playing");
    } else {
      if (engine === "browser") window.speechSynthesis.pause();
      else audio.current?.pause();
      setState("paused");
    }
  }

  return (
    <section
      aria-label="Listen to this article"
      className="border-skin-line my-4 rounded-lg border p-4"
    >
      <h2 className="font-semibold">Listen to this article</h2>
      <p className="my-2 text-sm">
        Opt in to English narration. Phonon downloads a voice model on first use
        and generates speech on your device. Browser voices depend on your
        device and may use an online service.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label>
          Voice engine{" "}
          <select
            className="focus-outline bg-skin-fill"
            value={engine}
            onChange={event => {
              stop();
              setMessage("");
              setEngine(event.target.value);
            }}
          >
            <option value="phonon">Phonon (on device)</option>
            <option value="browser">Browser TTS</option>
          </select>
        </label>
        {engine === "browser" && (
          <label>
            English voice{" "}
            <select
              className="focus-outline bg-skin-fill"
              value={voiceUri}
              onChange={event => {
                stop();
                setMessage("");
                setVoiceUri(event.target.value);
              }}
            >
              <option value="">Automatic (prefer on-device)</option>
              {voices.map(voice => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {engine === "phonon" && (
          <label>
            Processing{" "}
            <select
              className="focus-outline bg-skin-fill"
              value={device}
              onChange={event => {
                stop();
                setMessage("");
                setDevice(event.target.value as "cpu" | "auto");
              }}
            >
              <option value="cpu">CPU</option>
              <option value="auto">Try WebGPU (CPU fallback)</option>
            </select>
          </label>
        )}
        <label>
          Reading speed{" "}
          <select
            className="focus-outline bg-skin-fill"
            value={speed}
            onChange={event => {
              const next = Number(event.target.value);
              rate.current = next;
              setSpeed(next);
              audio.current?.setRate(next);
            }}
          >
            {[0.75, 1, 1.25, 1.5, 1.75, 2].map(value => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
        {state === "idle" ? (
          <button
            className="focus-outline rounded border px-3 py-1"
            disabled={!ready}
            onClick={() => void listen()}
          >
            Listen
          </button>
        ) : (
          <>
            {state !== "loading" && (
              <button
                className="focus-outline rounded border px-3 py-1"
                onClick={togglePause}
              >
                {state === "paused" ? "Resume" : "Pause"}
              </button>
            )}
            <button
              className="focus-outline rounded border px-3 py-1"
              onClick={() => {
                stop();
                setMessage("");
              }}
            >
              Stop
            </button>
          </>
        )}
      </div>
      <p role="status" className="mt-2 text-sm">
        {message ||
          (state === "paused"
            ? "Paused"
            : state === "playing"
              ? "Reading article"
              : "")}
      </p>
      {engine === "phonon" && (
        <p className="mt-1 text-sm">
          Speech streams as it is generated. WebGPU may help on some devices.
          Reading speed preserves the voice’s pitch.
        </p>
      )}
      {engine === "browser" && (
        <p className="mt-1 text-sm">Speed changes apply to the next passage.</p>
      )}
    </section>
  );
}
