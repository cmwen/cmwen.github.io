# Podcast Generator (podcast_generator)

This module converts blog posts into podcast audio using the Kokoro TTS engine.

Key features
- Automatic model download and language-aware synthesis (English and Traditional Chinese)
- Automatic chunking for long posts
- RSS feed generation for multi-language podcast feeds
- Optional LLM-provided transcripts to drive TTS output for better listening quality

Usage
1. Install Python dependencies (uses `uv` dev wrapper in this repo):

```bash
uv sync
```

2. Generate a podcast for a post:

```bash
uv run podcast-generate --posts "my-post-slug"
```

3. CLI options
- `--posts`: comma separated slug(s)
- `--all`: generate for all posts
- `--force`: regenerate audio even if it exists
- `--refresh-feeds`: rebuild feeds from existing audio without synthesizing
- `--output-dir`: output directory (defaults to `public/podcasts`)

LLM transcripts
----------------

To provide a human-optimized transcript produced by an LLM (recommended for long/technical posts), save one of the following files in the transcripts folder:

- `src/content/blog/transcripts/<slug>.txt` — a generic transcript file used for posts in any language
- `src/content/blog/transcripts/<slug>.<lang>.txt` — language-specific transcript (e.g., `my-post.zh-hant.txt` for Chinese)

The generator will prioritize language-specific transcripts, then fall back to the generic one. When a transcript exists the TTS engine will use it as the audio input instead of converting the markdown to speech; this is useful to remove code, tables, and other anti-audio constructs.

Agent & LLM workflow
---------------------

Use the `podcast-generator` agent (see `.github/agents/podcast-generator.agent.md`) to instruct a chat LLM to produce a transcript optimized for audio. Once the transcript file is saved to the `transcripts/` folder, running the generator for the post will synthesize audio from the transcript and publish the episode.

Best practices
- Keep transcripts concise and spoken-style — LLMs can convert code into a short, plain-language explanation.
- Verify the transcript by reading it out loud before generating audio.
- Use language suffixes for transcripts when generating audio in other languages.

Troubleshooting
- If no transcripts are found, the system automatically derives TTS-friendly text from the markdown body.
- If the audio file already exists and you change the transcript, re-run with `--force` to update the audio.
