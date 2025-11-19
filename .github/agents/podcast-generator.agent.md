---
name: podcast-generator
argument-hint: "Generate podcast audio from blog posts with TTS-optimized transcripts"
description: "Creates TTS-friendly transcripts and generates podcast audio files using Kokoro TTS"
tools: ["runCommands", "edit", "search"]
handoffs:
  - label: Push to GitHub
    agent: github-publisher
    prompt: Push the generated podcast files and RSS feeds to GitHub and monitor the deployment pipeline.
    send: true
---

## Podcast Generator (transcript-first)

---

### Purpose

Create TTS-optimized transcripts for blog posts, save them under `src/content/blog/transcripts/`, and then invoke the Python podcast generator which will prefer those transcripts when synthesizing audio.

This agent focuses on two goals: 1) produce a clean, listenable transcript file, and 2) run the generator to produce MP3s and update feeds.

### Quick Summary

- **Transcript folder:** `src/content/blog/transcripts/`
- **Transcript naming:** `post-slug.txt`, `post-slug.en.txt`, or `post-slug.zh-hant.txt`
- **Generate audio:** `uv run podcast-generate --posts "post-slug"`

### Step 1 — Create a TTS-Optimized Transcript

1. Read the source post and identify language from frontmatter (`lang`).
2. Convert the markdown into natural spoken text:
   - Remove markdown syntax (headers, lists, code fences).
   - Describe code blocks in plain language rather than reading raw code.
   - Expand common abbreviations (e.g., "e.g." → "for example").
   - Replace links with readable forms (e.g., "visit example dot com").
   - Add punctuation and short sentences to create natural pauses.
3. Choose a filename:
   - Prefer language-specific files when applicable: `src/content/blog/transcripts/<slug>.en.txt` or `src/content/blog/transcripts/<slug>.zh-hant.txt`.
   - Fallback: `src/content/blog/transcripts/<slug>.txt`.
4. Save the transcript in UTF-8 and commit it for review.

Notes: keep transcripts concise and conversational — listeners benefit from clearer transitions and shorter sentences.

### Step 2 — Run the Podcast Generator

The repository's Python generator automatically prefers transcripts if they exist in `src/content/blog/transcripts/` (language-specific first, then generic). To create audio:

```bash
# activate virtualenv if needed
source .venv/bin/activate

# generate audio for one post (generator will pick transcript if present)
uv run podcast-generate --posts "post-slug"

# to force regeneration
uv run podcast-generate --posts "post-slug" --force
```

If your generator is older and does not prefer transcripts, update `podcast_generator/main.py` (or the CLI entry) to prefer transcript files in `src/content/blog/transcripts/` before using the original markdown source.

### Output and Verification

- MP3s: `public/podcasts/post-slug.mp3` and/or `public/podcasts/post-slug.<lang>.mp3`
- Feeds: `public/podcasts/feed.xml`, `public/podcasts/en/feed.xml`, `public/podcasts/zh-hant/feed.xml`

Quick checks:

```bash
ls -lh public/podcasts/post-slug*.mp3
ffprobe public/podcasts/post-slug.mp3 2>&1 | grep Duration
grep "post-slug" public/podcasts/feed.xml
```

### Troubleshooting

- "Found 0 posts": verify frontmatter is valid YAML and `pubDatetime` is in the past.
- No transcript picked up: ensure `src/content/blog/transcripts/<slug>.<lang>.txt` exists and is readable.
- FFmpeg errors: ensure `ffmpeg` is installed and accessible in PATH.
- Chinese pronunciation issues: prefer language-specific (`.zh-hant.txt`) transcripts and consider phonetic hints or alternate voices.

### Voice/Model Notes

- Default voices: English `af_sarah`, Chinese `zf_001` (fallback `zm_009` for male).
- Models are cached under `~/.cache/kokoro-onnx/`.

### Handoff / Outputs

After generation, send the `github-publisher` agent the list of generated files and feed updates. Include any quality concerns (pronunciation, pacing) and whether regeneration is required.

### Example Minimal Workflow

```bash
# 1. Create transcript
# write file: src/content/blog/transcripts/my-new-post.en.txt

# 2. Generate podcast (uses transcript automatically)
uv run podcast-generate --posts "my-new-post"

# 3. Verify
ls -lh public/podcasts/my-new-post*.mp3
```

---

Keep transcripts short, clear, and conversational — the generator will handle audio synthesis and feed updates.
