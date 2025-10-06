import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function tryReadLocal(target: string): Promise<ArrayBuffer | null> {
  try {
    const candidates: string[] = [];

    if (target.startsWith("file://")) {
      candidates.push(fileURLToPath(new URL(target)));
    } else if (target.startsWith("/")) {
      candidates.push(target);
    } else if (target.startsWith(".")) {
      const moduleDir = fileURLToPath(new URL(".", import.meta.url));
      candidates.push(path.resolve(moduleDir, target));
      candidates.push(path.resolve(process.cwd(), "src/utils", target));
      candidates.push(path.resolve(process.cwd(), target));
    }

    // Always add the raw target as a last resort (covers absolute Windows paths or cwd-relative strings)
    candidates.push(target);

    for (const candidate of [...new Set(candidates)]) {
      try {
        const buf = await fs.readFile(candidate);
        const u8 = new Uint8Array(buf);
        return u8.buffer.slice(0);
      } catch {
        continue;
      }
    }

    // Ensure we return a plain ArrayBuffer (not SharedArrayBuffer)
  } catch {
    return null;
  }

  return null;
}

async function tryFetch(url: string): Promise<ArrayBuffer | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return await resp.arrayBuffer();
  } catch {
    return null;
  }
}

async function fetchFonts() {
  // Prefer local vendored fonts if available to avoid network flakiness.
  const fonts: SatoriOptions["fonts"] = [];

  // IBM Plex Mono (Latin) — optional
  const ibmLocalRegular =
    (await tryReadLocal("../assets/fonts/IBMPlexMono-Regular.ttf")) ??
    (await tryReadLocal("../assets/fonts/IBMPlexMono-Regular.otf"));
  const ibmLocalBold =
    (await tryReadLocal("../assets/fonts/IBMPlexMono-Bold.ttf")) ??
    (await tryReadLocal("../assets/fonts/IBMPlexMono-Bold.otf"));
  if (ibmLocalRegular)
    fonts.push({
      name: "IBM Plex Mono",
      data: ibmLocalRegular,
      weight: 400,
      style: "normal",
    });
  if (ibmLocalBold)
    fonts.push({
      name: "IBM Plex Mono",
      data: ibmLocalBold,
      weight: 700,
      style: "normal",
    });
  if (!ibmLocalRegular || !ibmLocalBold) {
    const ibmCandidates = [
      "https://raw.githubusercontent.com/IBM/plex/main/IBM-Plex-Mono/fonts/complete/ttf/IBM-Plex-Mono/IBMPlexMono-Regular.ttf",
      "https://github.com/IBM/plex/raw/main/IBM-Plex-Mono/fonts/complete/ttf/IBM-Plex-Mono/IBMPlexMono-Regular.ttf",
    ];
    const ibmBoldCandidates = [
      "https://raw.githubusercontent.com/IBM/plex/main/IBM-Plex-Mono/fonts/complete/ttf/IBM-Plex-Mono/IBMPlexMono-Bold.ttf",
      "https://github.com/IBM/plex/raw/main/IBM-Plex-Mono/fonts/complete/ttf/IBM-Plex-Mono/IBMPlexMono-Bold.ttf",
    ];
    const ibmRegData =
      ibmLocalRegular ??
      (await (async () => {
        for (const u of ibmCandidates) {
          const d = await tryFetch(u);
          if (d) return d;
        }
        return null;
      })());
    const ibmBoldData =
      ibmLocalBold ??
      (await (async () => {
        for (const u of ibmBoldCandidates) {
          const d = await tryFetch(u);
          if (d) return d;
        }
        return null;
      })());
    if (ibmRegData)
      fonts.push({
        name: "IBM Plex Mono",
        data: ibmRegData,
        weight: 400,
        style: "normal",
      });
    if (ibmBoldData)
      fonts.push({
        name: "IBM Plex Mono",
        data: ibmBoldData,
        weight: 700,
        style: "normal",
      });
    if (!ibmRegData || !ibmBoldData) {
      console.warn(
        "Warning: IBM Plex Mono could not be fully loaded; continuing without it."
      );
    }
  }

  // Source Han Sans / Noto Sans TC (Traditional Chinese)
  // Try vendored Source Han Sans first (recommended), fall back to vendored Noto, then remote sources.
  let cjkFontName = "Source Han Sans TC";
  let cjkRegular = await tryReadLocal(
    "../assets/fonts/SourceHanSansTC-Regular.otf"
  );
  let cjkBold = await tryReadLocal("../assets/fonts/SourceHanSansTC-Bold.otf");

  if (!cjkRegular || !cjkBold) {
    const notoRegularLocal =
      (await tryReadLocal("../assets/fonts/NotoSansTC-Regular.ttf")) ??
      (await tryReadLocal("../assets/fonts/NotoSansTC-VF.ttf")) ??
      (await tryReadLocal("../assets/fonts/NotoSansTC-Regular.otf"));
    const notoBoldLocal =
      (await tryReadLocal("../assets/fonts/NotoSansTC-Bold.ttf")) ??
      (await tryReadLocal("../assets/fonts/NotoSansTC-VF.ttf")) ??
      (await tryReadLocal("../assets/fonts/NotoSansTC-Bold.otf")) ??
      notoRegularLocal;
    if (notoRegularLocal && notoBoldLocal) {
      cjkRegular = notoRegularLocal;
      cjkBold =
        notoRegularLocal === notoBoldLocal ? notoRegularLocal : notoBoldLocal;
      cjkFontName = "Noto Sans TC";
    }
  }

  if (!cjkRegular || !cjkBold) {
    type Candidate = {
      name: "Source Han Sans TC" | "Noto Sans TC";
      urls: string[];
    };
    const remoteCandidates: Candidate[] = [
      {
        name: "Source Han Sans TC",
        urls: [
          "https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/TraditionalChinese/SourceHanSansTC-Regular.otf",
        ],
      },
      {
        name: "Noto Sans TC",
        urls: [
          "https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/OTF/TraditionalChinese/NotoSansTC-Regular.otf",
          "https://github.com/googlefonts/noto-cjk/releases/download/Sans2.004/NotoSansTC-Regular.otf",
        ],
      },
    ];
    const remoteBoldCandidates: Candidate[] = [
      {
        name: "Source Han Sans TC",
        urls: [
          "https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/TraditionalChinese/SourceHanSansTC-Bold.otf",
        ],
      },
      {
        name: "Noto Sans TC",
        urls: [
          "https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/OTF/TraditionalChinese/NotoSansTC-Bold.otf",
          "https://github.com/googlefonts/noto-cjk/releases/download/Sans2.004/NotoSansTC-Bold.otf",
        ],
      },
    ];

    if (!cjkRegular) {
      for (const candidate of remoteCandidates) {
        for (const url of candidate.urls) {
          const data = await tryFetch(url);
          if (data) {
            cjkRegular = data;
            cjkFontName = candidate.name;
            break;
          }
        }
        if (cjkRegular) break;
      }
    }

    if (!cjkBold) {
      for (const candidate of remoteBoldCandidates) {
        for (const url of candidate.urls) {
          const data = await tryFetch(url);
          if (data) {
            cjkBold = data;
            cjkFontName = candidate.name;
            break;
          }
        }
        if (cjkBold) break;
      }
    }
  }

  if (!cjkRegular || !cjkBold) {
    console.warn(
      "Warning: CJK font assets could not be loaded. OG images may not render Traditional Chinese correctly. Consider vendoring Source Han Sans TC or Noto Sans TC OTFs under src/assets/fonts/."
    );
  } else {
    fonts.push({
      name: cjkFontName,
      data: cjkRegular,
      weight: 400,
      style: "normal",
    });
    fonts.push({
      name: cjkFontName,
      data: cjkBold,
      weight: 700,
      style: "normal",
    });
  }

  return fonts;
}

const fonts = await fetchFonts();
const hasFonts = (fonts?.length ?? 0) > 0;

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts,
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

async function fallbackPngBuffer() {
  // Minimal, textless SVG to avoid font requirements.
  // Try to embed site logo if available.
  let logoDataUri: string | null = null;
  const logoBuf = await tryReadLocal("../../public/assets/logo.png");
  if (logoBuf) {
    const b64 = Buffer.from(new Uint8Array(logoBuf)).toString("base64");
    logoDataUri = `data:image/png;base64,${b64}`;
  }
  const w = 1200;
  const h = 630;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${logoDataUri ? `<image href="${logoDataUri}" x="${(w - 256) / 2}" y="${(h - 256) / 2}" width="256" height="256" />` : ``}
</svg>`;
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  if (!hasFonts) {
    console.warn("No OG fonts loaded; using fallback OG image for post.");
    return await fallbackPngBuffer();
  }
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  if (!hasFonts) {
    console.warn("No OG fonts loaded; using fallback OG image for site.");
    return await fallbackPngBuffer();
  }
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
