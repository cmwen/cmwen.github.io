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

test("stream schedules ahead continuously and supports rate, pause and stop", async ({
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
      module: ts.ModuleKind.None,
    },
  }).outputText;
  await page.goto("/posts/postgresql-ai-agents/");
  await page.addScriptTag({
    content: `${compiled}\nwindow.TestStreamingSpeech = StreamingSpeech;`,
  });
  const result = await page.evaluate(async () => {
    const context = new AudioContext();
    const planned: { start: number; duration: number }[] = [];
    const create = context.createBufferSource.bind(context);
    context.createBufferSource = () => {
      const source = create();
      const start = source.start.bind(source);
      source.start = (when = 0, offset = 0) => {
        planned.push({
          start: when,
          duration:
            (source.buffer!.duration - offset) / source.playbackRate.value,
        });
        start(when, offset);
      };
      return source;
    };
    const Class = (
      window as unknown as {
        TestStreamingSpeech: new (
          context: AudioContext,
          rate: number
        ) => {
          append(pcm: Float32Array): void;
          bufferedSeconds: number;
          setRate(rate: number): void;
          stop(): void;
        };
      }
    ).TestStreamingSpeech;
    const player = new Class(context, 24000);
    await context.resume();
    for (let i = 0; i < 40; i++) player.append(new Float32Array(1920));
    const count = planned.length;
    const gap = Math.max(
      ...planned
        .slice(1)
        .map((item, i) =>
          Math.abs(item.start - planned[i].start - planned[i].duration)
        )
    );
    const buffered = player.bufferedSeconds;
    await context.suspend();
    const time = context.currentTime;
    player.setRate(1.5);
    const rescheduled = planned.length > count;
    const paused =
      context.state === "suspended" && context.currentTime === time;
    player.stop();
    return { count, gap, buffered, rescheduled, paused };
  });
  expect(result.count).toBeGreaterThan(1);
  expect(result.gap).toBeLessThan(0.001);
  expect(result.buffered).toBeGreaterThan(2);
  expect(result.rescheduled).toBe(true);
  expect(result.paused).toBe(true);
});
