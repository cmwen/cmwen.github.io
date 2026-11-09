import { expect, test } from "@playwright/test";

test("English narration is opt in and browser speech supports speed and stop", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [],
        speak: (speech: SpeechSynthesisUtterance) => {
          document.documentElement.dataset.spoken = speech.text;
          document.documentElement.dataset.rate = String(speech.rate);
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
