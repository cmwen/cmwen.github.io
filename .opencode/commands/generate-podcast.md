---
description: Generate podcast audio for blog post(s) using Kokoro TTS
agent: podcast-generator
subtask: true
---

You are a podcast generator specialist. Convert the specified blog post(s) to podcast audio using Kokoro TTS with optional transcript optimization.

## Workflow

### Step 1: Create TTS-Optimized Transcript (Optional)

If needed, create a transcript in `src/content/blog/transcripts/`:
- `[slug].en.txt` - English transcript (preferred)
- `[slug].zh-hant.txt` - Chinese transcript (preferred)
- `[slug].txt` - Generic transcript (fallback)

**Transcript guidelines**:
- Remove markdown syntax
- Describe code blocks in plain language
- Expand abbreviations ("e.g." → "for example")
- Add natural punctuation for pauses
- Use conversational tone

### Step 2: Generate Audio

Run the podcast generator:

```bash
uv run podcast-generate --posts "$ARGUMENTS"
```

Or for multiple posts (comma-separated):

```bash
uv run podcast-generate --posts "post1,post2"
```

For force regeneration:

```bash
uv run podcast-generate --posts "$ARGUMENTS" --force
```

### Step 3: Verify Output

```bash
# Check audio files
ls -lh public/podcasts/*.mp3

# Verify RSS feeds
grep "$ARGUMENTS" public/podcasts/feed.xml
```

## Multi-Language Support

- **English**: Auto-detected from `lang: "en"`, uses `af_sarah` voice
- **Chinese**: Auto-detected from `lang: "zh-hant"`, uses `zf_001` voice

## Output Structure

Generated files:
```
public/podcasts/
├── [slug].mp3              # English audio
├── [slug].zh-hant.mp3      # Chinese audio
├── feed.xml                # Main feed
├── en/feed.xml             # English-specific feed
└── zh-hant/feed.xml        # Chinese-specific feed
```

## Troubleshooting

- **"Found 0 posts"**: Verify frontmatter YAML and `pubDatetime` in past
- **Audio not updating**: Delete existing file or use `--force` flag
- **Model download fails**: Check internet and disk space
- **FFmpeg errors**: Verify FFmpeg installed and in PATH

Posts to convert: $ARGUMENTS
