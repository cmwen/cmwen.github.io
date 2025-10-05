import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  slug: string;
  lang?: "en" | "zh-hant";
};

const PLAYBACK_SPEED_KEY = "audio-playback-speed";

export default function AudioPlayer({ slug, lang = "en" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioExists, setAudioExists] = useState<boolean | null>(null);
  const listenersAttached = useRef(false);

  // Construct the audio URL based on slug and language
  const audioUrl =
    lang === "zh-hant"
      ? `/podcasts/${slug}.zh-hant.mp3`
      : `/podcasts/${slug}.mp3`;

  // Check if audio file exists
  useEffect(() => {
    const checkAudioExists = async () => {
      try {
        const response = await fetch(audioUrl, { method: "HEAD" });
        setAudioExists(response.ok);
      } catch {
        setAudioExists(false);
      }
    };
    checkAudioExists();
  }, [audioUrl]);

  // Load saved playback speed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(PLAYBACK_SPEED_KEY);
    if (saved) {
      const speed = parseFloat(saved);
      if (!isNaN(speed) && speed >= 0.25 && speed <= 2.0) {
        setPlaybackSpeed(speed);
      }
    }
  }, []);

  // Apply playback speed to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audio.readyState > 0) {
      audio.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Set up audio element with callback ref to ensure listeners are attached
  const setAudioElement = (element: HTMLAudioElement | null) => {
    // Clean up old listeners if ref is being updated
    if (audioRef.current && listenersAttached.current) {
      const audio = audioRef.current;
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      listenersAttached.current = false;
    }

    audioRef.current = element;

    // Set up new listeners when element is available
    if (element && !listenersAttached.current) {
      element.addEventListener("timeupdate", updateTime);
      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      element.addEventListener("durationchange", handleDurationChange);
      element.addEventListener("canplay", handleCanPlay);
      element.addEventListener("ended", handleEnded);
      element.addEventListener("play", handlePlay);
      element.addEventListener("pause", handlePause);
      listenersAttached.current = true;

      // Set initial state if audio is already loaded
      if (element.readyState > 0) {
        if (
          !isNaN(element.duration) &&
          isFinite(element.duration) &&
          element.duration > 0
        ) {
          setDuration(element.duration);
        }
        if (element.currentTime > 0) {
          setCurrentTime(element.currentTime);
        }
        element.playbackRate = playbackSpeed;
      }
    }
  };

  // Event handlers defined outside to be reusable
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      // Apply playback speed when metadata is loaded
      audio.playbackRate = playbackSpeed;
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    }
  };

  const handleCanPlay = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(speed);
    localStorage.setItem(PLAYBACK_SPEED_KEY, speed.toString());
    // Immediately apply the speed to the audio element
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Don't render if audio doesn't exist or still checking
  if (audioExists === null) return null;
  if (!audioExists) return null;

  return (
    <div className="mb-6 rounded-lg border border-skin-line bg-skin-card p-4">
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-2xl">
          🎧
        </span>
        <div className="flex-1">
          <h3 className="m-0 text-base font-semibold text-skin-accent">
            {lang === "zh-hant" ? "音訊版本" : "Audio Version"}
          </h3>
          <p className="mt-1 text-xs opacity-70">
            {lang === "zh-hant"
              ? "由 Kokoro TTS 生成"
              : "Generated by Kokoro TTS"}
          </p>

          <audio ref={setAudioElement} src={audioUrl} preload="metadata" />

          <div className="mt-3 space-y-3">
            {/* Playback controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-skin-accent text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-skin-accent focus:ring-offset-2"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full"
                  style={{
                    accentColor: "var(--color-accent)",
                  }}
                />
                <div className="mt-1 flex justify-between text-xs opacity-70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Speed control */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="playback-speed"
                className="text-sm opacity-80 whitespace-nowrap"
              >
                {lang === "zh-hant" ? "播放速度" : "Speed"}
              </label>
              <select
                id="playback-speed"
                value={playbackSpeed.toString()}
                onChange={handleSpeedChange}
                className="rounded-md border border-skin-line bg-skin-fill px-2 py-1 text-sm focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
              >
                <option value="0.5">0.5×</option>
                <option value="0.75">0.75×</option>
                <option value="1.0">1.0×</option>
                <option value="1.25">1.25×</option>
                <option value="1.5">1.5×</option>
                <option value="1.75">1.75×</option>
                <option value="2.0">2.0×</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
