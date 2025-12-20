---
name: podcast-generator
description: Converts blog posts into podcast audio using Kokoro TTS engine. Use this when asked to generate podcasts, create audio, or run TTS for blog posts.
---

# Podcast Generator Skill

This skill converts blog posts into podcast audio using the Kokoro TTS engine with multi-language support and automatic RSS feed generation.

## Key Features

- Automatic model download and language-aware synthesis (English and Traditional Chinese).
- Automatic chunking for long posts.
- RSS feed generation for multi-language podcast feeds.
- Optional LLM-provided transcripts to drive TTS output for better listening quality.
- Support for both generic and language-specific transcripts.

## Installation & Setup

1. **Ensure Python dependencies are installed:**

   ```bash
   uv sync
   ```

2. **Verify FFmpeg and dependencies are available** (required for audio processing).

## Usage

### Generate Podcast for Specific Post(s)

```bash
uv run podcast-generate --posts "my-post-slug"
```

### Generate Podcast for All Posts

```bash
uv run podcast-generate --all
```

### Force Regeneration

If a post has already been generated, use `--force` to overwrite:

```bash
uv run podcast-generate --posts "my-post-slug" --force
```

### Refresh RSS Feeds Only

Rebuild feeds from existing audio without re-synthesizing:

```bash
uv run podcast-generate --refresh-feeds
```

### Specify Output Directory

```bash
uv run podcast-generate --posts "my-post-slug" --output-dir /custom/path
```

(Defaults to `public/podcasts` if not specified.)

## LLM Transcripts for Better Audio Quality

To provide a human-optimized transcript produced by an LLM (recommended for long/technical posts), save one of the following files in `src/content/blog/transcripts/`:

- **Generic transcript**: `<slug>.txt` — used for posts in any language
- **Language-specific transcript**: `<slug>.<lang>.txt` — e.g., `my-post.zh-hant.txt` for Chinese

### Transcript Priority

1. Language-specific transcripts are prioritized (e.g., `post.zh-hant.txt` for Chinese).
2. Falls back to generic transcript (`post.txt`).
3. If no transcript exists, TTS engine automatically derives spoken-friendly text from Markdown.

### Agent & LLM Workflow

Use an LLM (via your agents UI or chat service) to:

1. Generate a TTS-optimized transcript from the blog post.
2. Remove code blocks, tables, and other anti-audio constructs.
3. Add spoken clarifications and natural phrasing.
4. Save the transcript file to `src/content/blog/transcripts/`.
5. Run `uv run podcast-generate --posts "<slug>"` to synthesize audio from the transcript.

## Best Practices

- **Keep transcripts concise and spoken-style** — LLMs can convert code into plain-language explanations.
- **Verify transcripts by reading aloud** before generating audio to ensure quality.
- **Use language suffixes for transcripts** when generating audio in other languages.
- **Leverage auto-chunking** for posts over 10 minutes of audio to improve podcast compatibility.
- **Test with different voices** (if manually configuring) to match your audience preferences.

## Output Structure

Generated audio files are organized in `public/podcasts/`:

```
public/podcasts/
├── feed.xml              # Main RSS feed
├── <slug>.mp3            # English podcasts
├── <slug>.zh-hant.mp3    # Chinese podcasts
├── en/
│   └── feed.xml          # English-specific feed
└── zh-hant/
    └── feed.xml          # Chinese-specific feed
```

## Troubleshooting

- **"Found 0 posts" error**: Verify frontmatter passes Astro schema validation. Check that the post appears in the dev server at `/posts/`.
- **Audio file exists but not updating**: Use `--force` to regenerate, or delete the existing file and re-run.
- **Model download fails**: Check internet connection and disk space in `~/.cache/kokoro-onnx/`.
- **FFmpeg errors**: Ensure FFmpeg is installed and accessible in your PATH.
