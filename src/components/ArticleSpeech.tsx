import { useEffect, useRef, useState } from "react";
import type { PhononTTS } from "phonon-tts";

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
    text.match(/.{1,350}(?:\s|$)|.{1,350}/g)?.map(chunk => chunk.trim()) ?? []
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
  const audio = useRef<HTMLAudioElement | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const generation = useRef(0);
  const rate = useRef(1);
  const finishPlayback = useRef<(() => void) | null>(null);
  const objectUrl = useRef<string | null>(null);

  function stop() {
    generation.current++;
    finishPlayback.current?.();
    finishPlayback.current = null;
    audio.current?.pause();
    if (audio.current) audio.current.removeAttribute("src");
    audio.current = null;
    if (utterance.current) window.speechSynthesis?.cancel();
    utterance.current = null;
    model.current?.dispose();
    model.current = null;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setState("idle");
  }

  useEffect(() => {
    setReady(true);
    const cleanup = () => stop();
    window.addEventListener("pagehide", cleanup);
    document.addEventListener("astro:before-swap", cleanup);
    return () => {
      window.removeEventListener("pagehide", cleanup);
      document.removeEventListener("astro:before-swap", cleanup);
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
          window.speechSynthesis
            .getVoices()
            .find(voice => /^en(?:-|$)/i.test(voice.lang)) ?? null;
        speech.rate = rate.current;
        speech.onend = () => read(index + 1);
        speech.onerror = () => {
          if (id !== generation.current) return;
          stop();
          setMessage("Browser speech failed. Try Phonon or another browser.");
        };
        utterance.current = speech;
        window.speechSynthesis.speak(speech);
      };
      setState("playing");
      read(0);
      return;
    }
    setState("loading");
    setMessage("Loading Phonon and its voice model for on-device speech…");
    // Create playback during the user gesture; reuse it for each bounded chunk.
    const player = new Audio();
    player.preservesPitch = true;
    audio.current = player;
    try {
      const { PhononTTS } = await import("phonon-tts");
      if (id !== generation.current) return;
      const tts = await PhononTTS.load({ lang: "en" });
      if (id !== generation.current) {
        tts.dispose();
        return;
      }
      model.current = tts;
      for (const chunk of chunks) {
        if (id !== generation.current) return;
        setState("loading");
        setMessage("Preparing speech on your device…");
        const wav = await tts.synthWav(chunk);
        if (id !== generation.current) return;
        objectUrl.current = URL.createObjectURL(wav);
        player.src = objectUrl.current;
        player.playbackRate = rate.current;
        setMessage("");
        setState("playing");
        await new Promise<void>((resolve, reject) => {
          finishPlayback.current = resolve;
          player.onended = () => resolve();
          player.onerror = () => reject(new Error("Audio playback failed"));
          player.play().catch(reject);
        });
        if (id !== generation.current) return;
        finishPlayback.current = null;
        URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = null;
      }
      if (id === generation.current) stop();
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
        void audio.current?.play().catch(() => {
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
        <label>
          Reading speed{" "}
          <select
            className="focus-outline bg-skin-fill"
            value={speed}
            onChange={event => {
              const next = Number(event.target.value);
              rate.current = next;
              setSpeed(next);
              if (audio.current) audio.current.playbackRate = next;
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
      {engine === "browser" && (
        <p className="mt-1 text-sm">Speed changes apply to the next passage.</p>
      )}
    </section>
  );
}
