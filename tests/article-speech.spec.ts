import { expect, test } from "@playwright/test";

test("English narration is opt in and browser speech supports speed and stop", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        constructor(public text: string) {}
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [
          {
            voiceURI: "test-en",
            name: "English",
            lang: "en-US",
            localService: true,
            default: true,
          },
        ],
        speak: (speech: SpeechSynthesisUtterance) => {
          document.documentElement.dataset.spoken = speech.text;
          document.documentElement.dataset.rate = String(speech.rate);
          speech.onstart?.(new Event("start") as SpeechSynthesisEvent);
        },
        cancel: () => {
          document.documentElement.dataset.cancelled = "true";
        },
        pause: () => {},
        resume: () => {},
      },
    });
  });
  const phononRequests: string[] = [];
  page.on("request", request => {
    if (/huggingface|phonon|worker-.*\.js/.test(request.url()))
      phononRequests.push(request.url());
  });
  await page.goto("/posts/postgresql-ai-agents/");
  const player = page.getByRole("region", { name: "Listen to this article" });
  await expect(
    player.getByRole("button", { name: "Listen", exact: true })
  ).toBeEnabled();
  expect(phononRequests).toEqual([]);
  await player.getByLabel("Voice engine").selectOption("browser");
  await player.getByLabel("Reading speed").selectOption("1.5");
  await expect(
    player.getByRole("button", { name: "Listen", exact: true })
  ).toBeEnabled();
  await player.getByRole("button", { name: "Listen", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-rate", "1.5");
  await expect(page.locator("html")).toHaveAttribute(
    "data-spoken",
    /PostgreSQL/i
  );
  await player.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    player.getByRole("button", { name: "Resume", exact: true })
  ).toBeVisible();
  await player.getByRole("button", { name: "Stop", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-cancelled", "true");
  await expect(
    player.getByRole("button", { name: "Listen", exact: true })
  ).toBeVisible();
  await page.goto("/zh-hant/posts/postgresql-ai-agents/");
  await expect(
    page.getByRole("region", { name: "Listen to this article" })
  ).toHaveCount(0);
});

test("failed Phonon initialization offers browser fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "Worker", {
      value: function () {
        throw new Error("Worker unavailable");
      },
    });
  });
  await page.goto("/posts/postgresql-ai-agents/");
  const player = page.getByRole("region", { name: "Listen to this article" });
  await expect(
    player.getByRole("button", { name: "Listen", exact: true })
  ).toBeEnabled();
  await player.getByRole("button", { name: "Listen", exact: true }).click();
  await expect(player.getByRole("status")).toContainText(
    "browser speech instead"
  );
  await expect(player.getByLabel("Voice engine")).toHaveValue("browser");
});

test("browser with no English voices explains how to recover", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: { getVoices: () => [] },
    });
  });
  await page.goto("/posts/postgresql-ai-agents/");
  const player = page.getByRole("region", { name: "Listen to this article" });
  await expect(
    player.getByRole("button", { name: "Listen", exact: true })
  ).toBeEnabled();
  await player.getByLabel("Voice engine").selectOption("browser");
  await player.getByRole("button", { name: "Listen", exact: true }).click();
  await expect(player.getByRole("status")).toContainText(
    "No English browser voice"
  );
  await expect(
    player.getByRole("button", { name: "Listen", exact: true })
  ).toBeEnabled();
});

for (const speed of [1, 1.5, 2, 0.75]) {
  test(`continuous speech has no dropouts and preserves pitch at ${speed}×`, async ({
    page,
  }) => {
    const { readFile, cp } = await import("node:fs/promises");
    const ts = await import("typescript");
    const root = new URL(
      "../node_modules/@soundtouchjs/audio-worklet/.dist/",
      import.meta.url
    );
    // AudioWorklet module fetches bypass Playwright page routing in Chromium.
    // Serve the real package files through the test server instead.
    await cp(root, new URL("../dist/test-soundtouch/", import.meta.url), {
      recursive: true,
    });
    const source = await readFile(
      new URL("../src/utils/streamingSpeech.ts", import.meta.url),
      "utf8"
    );
    const compiled = ts.transpileModule(
      source
        .replace("export class", "class")
        .replace(
          /import processorUrl from [^;]+;/,
          'const processorUrl = "/test-soundtouch/soundtouch-processor.js";'
        )
        .replace(
          'import("@soundtouchjs/audio-worklet")',
          'import("/test-soundtouch/index.js")'
        ),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      }
    ).outputText;
    await page.goto("/posts/postgresql-ai-agents/");
    await page.addScriptTag({
      type: "module",
      content: `${compiled}\nwindow.TestStreamingSpeech = StreamingSpeech;`,
    });
    await page.evaluate(speed => {
      const button = document.createElement("button");
      button.id = "test-audio";
      button.textContent = "Test audio";
      document.body.append(button);
      button.onclick = async () => {
        const scope = window as unknown as {
          TestStreamingSpeech: new (sampleRate: number) => {
            context: AudioContext;
            output: GainNode;
            append(pcm: Float32Array): void;
            resume(): Promise<void>;
            pause(): void;
            setRate(rate: number): void;
            stop(): void;
          };
          audioResult: {
            frequency: number;
            gapSeconds: number;
            paused: boolean;
            error?: string;
          };
        };
        const player = new scope.TestStreamingSpeech(24000);
        try {
          await player.resume();
          player.setRate(speed);
          const context = player.context;
          const recorderCode = `class Recorder extends AudioWorkletProcessor {
            blocks = [];
            constructor() { super(); this.port.onmessage = () => {
              const data = new Float32Array(this.blocks.length * 128);
              this.blocks.forEach((block, i) => data.set(block, i * 128));
              this.port.postMessage(data, [data.buffer]); this.blocks = [];
            }; }
            process(inputs) { if (inputs[0]?.[0]) this.blocks.push(new Float32Array(inputs[0][0])); return true; }
          } registerProcessor('speech-test-recorder', Recorder);`;
          const url = URL.createObjectURL(
            new Blob([recorderCode], { type: "text/javascript" })
          );
          await context.audioWorklet.addModule(url);
          URL.revokeObjectURL(url);
          const recorder = new AudioWorkletNode(
            context,
            "speech-test-recorder"
          );
          player.output.connect(recorder);
          recorder.connect(context.destination);
          for (let frame = 0; frame < 150; frame++) {
            const pcm = Float32Array.from(
              { length: 1920 },
              (_, i) =>
                0.3 * Math.sin((2 * Math.PI * 440 * (frame * 1920 + i)) / 24000)
            );
            player.append(pcm);
          }
          // Span several former media handoffs and hundreds of PCM boundaries.
          // A busy main thread must not interrupt already-buffered audio.
          await new Promise(resolve => setTimeout(resolve, 2100));
          const busyUntil = performance.now() + 150;
          while (performance.now() < busyUntil) {
            /* simulate page work */
          }
          await new Promise(resolve => setTimeout(resolve, 3100));
          const recording = new Promise<Float32Array>(resolve => {
            recorder.port.onmessage = event => resolve(event.data);
          });
          recorder.port.postMessage("read");
          const data = await recording;
          const start = Math.floor(context.sampleRate * 0.8);
          const end = Math.min(
            data.length,
            Math.floor(context.sampleRate * 4.8)
          );
          let longest = 0,
            gap = 0,
            crossings = 0;
          for (let i = start; i + 128 < end; i += 128) {
            let power = 0;
            for (let j = i; j < i + 128; j++) {
              power += data[j] ** 2;
              if (data[j] <= 0 && data[j + 1] > 0) crossings++;
            }
            gap = Math.sqrt(power / 128) < 0.003 ? gap + 128 : 0;
            longest = Math.max(longest, gap);
          }
          player.pause();
          await context.suspend();
          const before = context.currentTime;
          await new Promise(resolve => setTimeout(resolve, 50));
          const paused = before === context.currentTime;
          await player.resume();
          scope.audioResult = {
            frequency: crossings / ((end - start) / context.sampleRate),
            gapSeconds: longest / context.sampleRate,
            paused,
          };
          recorder.disconnect();
          recorder.port.close();
          player.stop();
        } catch (error) {
          scope.audioResult = {
            frequency: 0,
            gapSeconds: 100,
            paused: false,
            error: String(error),
          };
          player.stop();
        }
      };
    }, speed);
    await page.locator("#test-audio").click();
    await page.waitForFunction(() =>
      Boolean((window as unknown as { audioResult?: unknown }).audioResult)
    );
    const result = await page.evaluate(
      () =>
        (
          window as unknown as {
            audioResult: {
              frequency: number;
              gapSeconds: number;
              paused: boolean;
              error?: string;
            };
          }
        ).audioResult
    );
    console.log({ speed, ...result });
    expect(result.error).toBeUndefined();
    expect(result.frequency).toBeGreaterThan(420);
    expect(result.frequency).toBeLessThan(460);
    expect(result.gapSeconds).toBeLessThan(0.015);
    expect(result.paused).toBe(true);
  });
}
