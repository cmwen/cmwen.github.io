---
name: podcast-generator
description: Converts blog posts into podcast audio using Kokoro TTS engine with multi-language support
license: MIT
compatibility: opencode
metadata:
  audience: blog-contributors
  workflow: content-distribution
---

# Podcast Generator Skill

Use this skill when converting blog posts to podcast audio or generating TTS-optimized transcripts for enhanced audio quality.

## What I Do

- Creates TTS-optimized transcripts for better audio quality
- Generates podcast audio files using Kokoro TTS engine
- Supports both English and Traditional Chinese posts
- Automatically updates RSS feeds for podcast distribution
- Manages multi-language podcast feeds

## When to Use Me

Use this skill when you need to:
- Convert blog posts to podcast audio
- Generate TTS-optimized transcripts
- Create multilingual podcast content
- Update podcast feeds
- Improve audio quality for specific posts
- Troubleshoot podcast generation issues

## Key Features

- **Multi-language support**: Automatic English and Chinese processing
- **TTS optimization**: Create transcripts optimized for natural speech
- **Transcript management**: Support for language-specific and generic transcripts
- **RSS feed generation**: Automatic feed updates for podcast distribution
- **Auto chunking**: Handles long posts with automatic audio chunking
- **Voice configuration**: Customizable voices for different languages

## Quick Start

### Basic Generation
```bash
uv run podcast-generate --posts "my-post-slug"
```

### Force Regeneration
```bash
uv run podcast-generate --posts "my-post-slug" --force
```

### All Posts
```bash
uv run podcast-generate --all
```

## Transcript Management

### File Organization
Place transcripts in: `src/content/blog/transcripts/`

**Naming conventions**:
- `slug.en.txt` - English transcript (preferred)
- `slug.zh-hant.txt` - Chinese transcript (preferred)
- `slug.txt` - Generic transcript (fallback)

### Transcript Priority
1. Language-specific (if exists)
2. Generic (if exists)
3. Auto-derived from post markdown

### Creating Transcripts

Convert blog post markdown to spoken text:
- Remove markdown syntax (headers, lists, code fences)
- Describe code blocks in plain language
- Expand abbreviations ("e.g." → "for example")
- Add natural punctuation for pauses
- Keep sentences short for better pacing

## Output Structure

```
public/podcasts/
├── feed.xml                    # Main feed (all languages)
├── post-slug.mp3              # English audio
├── post-slug.zh-hant.mp3      # Chinese audio
├── en/
│   └── feed.xml               # English-specific feed
└── zh-hant/
    └── feed.xml               # Chinese-specific feed
```

## Language Support

**English**:
- Voice: `af_sarah`
- Model: Kokoro v1.0
- Auto-detected from `lang: "en"`

**Traditional Chinese**:
- Default voice: `zf_001` (female)
- Alternative: `zm_009` (male)
- Model: Kokoro v1.1-zh
- Auto-detected from `lang: "zh-hant"`
- 90+ voice options available

## Verification Commands

```bash
# Check audio file
ls -lh public/podcasts/post-slug*.mp3

# Verify duration
ffprobe public/podcasts/post-slug.mp3 2>&1 | grep Duration

# Check RSS feeds
grep "post-slug" public/podcasts/feed.xml
grep "post-slug" public/podcasts/en/feed.xml
grep "post-slug" public/podcasts/zh-hant/feed.xml
```

## Troubleshooting

**"Found 0 posts"**: Verify frontmatter YAML is valid and `pubDatetime` is in the past

**Audio not updating**: Delete existing file and use `--force` flag

**Model download fails**: Check disk space and internet connection, retry download

**FFmpeg errors**: Verify FFmpeg is installed and in PATH

## Prerequisites

- Python environment: `uv sync`
- FFmpeg installed
- Valid post frontmatter with proper `pubDatetime`
- Write permissions to `public/podcasts/`

## Quality Tips

- Create transcripts for complex/technical posts
- Use language-specific transcripts for better pronunciation
- Listen to generated audio for quality assessment
- Test that RSS feeds validate correctly
- Monitor podcast subscriber feedback

## Integration

Works seamlessly with:
- Blog Writer (content creation)
- Translator (multilingual content)
- Fact Checker (content verification)
- GitHub Publisher (deployment)
