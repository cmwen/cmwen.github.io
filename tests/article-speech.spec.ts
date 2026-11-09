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

test("buffered speech preserves pitch at faster speeds and supports pause and stop", async ({
  page,
}) => {
  const { readFile } = await import("node:fs/promises");
  const ts = await import("typescript");
  const source = await readFile(
    new URL("../src/utils/streamingSpeech.ts", import.meta.url),
    "utf8"
  );
  const compiled = ts.transpileModule(source.replace("export class", "class"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;
  await page.goto("/posts/postgresql-ai-agents/");
  await page.addScriptTag({
    content: `${compiled}\nwindow.TestStreamingSpeech = StreamingSpeech;`,
  });
  await page.evaluate(() => {
    const button = document.createElement("button");
    button.id = "test-audio";
    button.textContent = "Test audio";
    document.body.append(button);
    button.onclick = async () => {
      const scope = window as unknown as {
        TestStreamingSpeech: new (sampleRate: number) => {
          elements: HTMLAudioElement[];
          append(pcm: Float32Array): void;
          flush(): void;
          resume(): Promise<void>;
          pause(): void;
          setRate(rate: number): void;
          stop(): void;
          bufferedSeconds: number;
        };
        audioResult: {
          frequency: number;
          paused: boolean;
          rate: number;
          preservesPitch: boolean;
          buffered: number;
          stopped: boolean;
        };
      };
      const context = new AudioContext();
      await context.resume();
      const player = new scope.TestStreamingSpeech(24000);
      const analyser = context.createAnalyser();
      analyser.fftSize = 8192;
      for (const element of player.elements)
        context.createMediaElementSource(element).connect(analyser);
      analyser.connect(context.destination);
      await player.resume();
      player.setRate(1.5);
      for (let frame = 0; frame < 100; frame++) {
        const pcm = Float32Array.from(
          { length: 1920 },
          (_, i) =>
            0.3 * Math.sin((2 * Math.PI * 440 * (frame * 1920 + i)) / 24000)
        );
        player.append(pcm);
      }
      player.flush();
      await new Promise(resolve =>
        player.elements[0].addEventListener("ended", resolve, { once: true })
      );
      await new Promise(resolve => setTimeout(resolve, 300));
      const bins = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(bins);
      let peak = 0;
      for (let i = 1; i < bins.length; i++) if (bins[i] > bins[peak]) peak = i;
      const buffered = player.bufferedSeconds;
      const rate =
        player.elements.find(element => !element.paused)?.playbackRate ?? 0;
      player.pause();
      const paused = player.elements.every(element => element.paused);
      const preservesPitch = player.elements.every(
        element => element.preservesPitch
      );
      await player.resume();
      player.stop();
      scope.audioResult = {
        frequency: (peak * context.sampleRate) / analyser.fftSize,
        paused,
        rate,
        preservesPitch,
        buffered,
        stopped: player.elements.every(element => !element.hasAttribute("src")),
      };
      await context.close();
    };
  });
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
            paused: boolean;
            rate: number;
            preservesPitch: boolean;
            buffered: number;
            stopped: boolean;
          };
        }
      ).audioResult
  );
  // A 440 Hz source must stay near 440 Hz, rather than rising to 660 Hz at 1.5×.
  expect(result.frequency).toBeGreaterThan(410);
  expect(result.frequency).toBeLessThan(470);
  expect(result.paused).toBe(true);
  expect(result.rate).toBe(1.5);
  expect(result.preservesPitch).toBe(true);
  expect(result.buffered).toBeGreaterThan(3);
  expect(result.stopped).toBe(true);
});
