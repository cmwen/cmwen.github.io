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

# Podcast Generator

## Purpose

Transform blog posts into high-quality podcast audio with proper TTS optimization. Handle both English and Chinese content with appropriate voice selection and phonemization.

## Instructions

### 1. Analyze the Blog Post

First, read the blog post file to understand:

- **Language**: Check `lang` field in frontmatter (`en` or `zh-hant`)
- **Content type**: Technical, narrative, tutorial, etc.
- **Length**: Estimate audio duration (average 150-180 words/min)
- **Frontmatter**: Verify `pubDatetime`, `title`, `description`, `baseSlug`

```bash
# Example: Read the post file
cat src/content/blog/post-slug.md
# Or for Chinese:
cat src/content/blog/zh-hant/post-slug.zh-hant.md
```

### 2. Create TTS-Optimized Transcript

Transform the markdown content into a read-aloud friendly format:

**Content Transformations:**

- Remove markdown formatting (keep natural flow)
- Expand abbreviations (e.g., "e.g." → "for example")
- Spell out acronyms on first use
- Convert code blocks to spoken descriptions
- Replace URLs with readable text ("link to example dot com")
- Remove or describe images/diagrams
- Simplify complex tables into narrative
- Add natural pauses with punctuation

**For Technical Content:**

- Pronounce technical terms naturally
- Explain code snippets in plain language
- Break down complex concepts step-by-step
- Add transitional phrases for clarity

**For Chinese Content:**

- Ensure proper character usage (Traditional Chinese)
- Add appropriate pauses for readability
- Consider tone and formality level
- Respect cultural context in translations

**Output Format:**
Save the TTS-optimized transcript as a separate file for review:

```
src/content/blog/transcripts/post-slug.txt
```

### 3. Generate Podcast Audio

Use the Python podcast generation system:

```bash
# Activate Python environment (if not already active)
source .venv/bin/activate

# Generate podcast for specific post
uv run podcast-generate --posts "post-slug"

# Options:
# --force : Regenerate even if audio exists
# --all   : Generate for all posts (use sparingly)
```

**The script automatically:**

- Detects language from frontmatter (`lang` field)
- Switches between Kokoro v1.0 (English) and v1.1-zh (Chinese)
- Selects appropriate voices:
  - English: `af_sarah` (default female voice)
  - Chinese: `zf_001` (default female voice) or `zm_009` (male)
- Downloads models to `~/.cache/kokoro-onnx/` if needed
- Generates MP3 with FFmpeg
- Updates RSS feeds for both languages

**Expected Output:**

```
public/podcasts/
├── post-slug.mp3              # English audio
├── post-slug.zh-hant.mp3      # Chinese audio (if applicable)
├── feed.xml                   # Main RSS feed
├── en/feed.xml                # English podcast feed
└── zh-hant/feed.xml           # Chinese podcast feed
```

### 4. Verify Audio Quality

Listen to a sample of the generated audio:

- **Pronunciation**: Technical terms, names, numbers
- **Pacing**: Not too fast or slow
- **Clarity**: Clear articulation, no distortion
- **Duration**: Reasonable length (check file size)

```bash
# Check file info
ls -lh public/podcasts/post-slug*.mp3
ffprobe public/podcasts/post-slug.mp3 2>&1 | grep Duration
```

### 5. Handle Voice Customization (Optional)

If the default voice isn't suitable:

**English Voices:**

- Check `podcast_generator/tts_engine.py` for available voices
- Most common: `af_sarah`, `af_bella`, `am_adam`, `am_michael`

**Chinese Voices:**

- Female: `zf_001` to `zf_099` (99 options)
- Male: `zm_009` to `zm_100` (92 options)
- Test with: `uv run python test_chinese_voices.py` (if script exists)

**To change voice:**
Edit `podcast_generator/tts_engine.py` and modify `DEFAULT_VOICE` constant.

### 6. Troubleshooting

**Common Issues:**

1. **"Found 0 posts"**
   - Verify frontmatter is valid YAML
   - Check the dev server shows the post: `pnpm dev`
   - Ensure `pubDatetime` is in the past (UTC)

2. **Poor audio quality**
   - Review the markdown-to-text conversion
   - Check for special characters or formatting issues
   - Try manual transcript optimization

3. **Chinese pronunciation issues**
   - Verify Traditional Chinese characters (not Simplified)
   - Check misaki G2P phonemization is working
   - Consider voice change if tone is off

4. **Model download fails**
   - Check internet connection
   - Verify write access to `~/.cache/kokoro-onnx/`
   - Try manual download from Hugging Face

5. **FFmpeg errors**
   - Ensure FFmpeg is installed: `ffmpeg -version`
   - Check audio format compatibility
   - Verify disk space for output files

**Debug Commands:**

```bash
# Check Python environment
uv run python --version
uv run python -c "import kokoro_onnx; print(kokoro_onnx.__version__)"

# Test TTS directly
uv run python -c "from podcast_generator import TTSEngine; engine = TTSEngine('en'); print('OK')"

# Validate blog post parsing
uv run python -c "from podcast_generator import BlogParser; parser = BlogParser(); print(len(parser.get_all_posts()))"
```

### 7. RSS Feed Validation

After generation, verify RSS feeds are valid:

```bash
# Check feed files exist
ls -lh public/podcasts/*/feed.xml

# Validate XML structure (if xmllint available)
xmllint --noout public/podcasts/feed.xml
xmllint --noout public/podcasts/en/feed.xml
xmllint --noout public/podcasts/zh-hant/feed.xml
```

**Feed URLs for testing:**

- Main feed: `https://cmwen.github.io/podcasts/feed.xml`
- English: `https://cmwen.github.io/podcasts/en/feed.xml`
- Chinese: `https://cmwen.github.io/podcasts/zh-hant/feed.xml`

Test in podcast apps: Apple Podcasts, Pocket Casts, AntennaPod

## Best Practices

1. **Always fact-check before podcast generation** - Audio errors are harder to fix
2. **Review transcript quality** - Garbage in, garbage out for TTS
3. **Test with short posts first** - Validate the pipeline works
4. **Monitor file sizes** - Long posts may need chunking (handled automatically)
5. **Keep original markdown** - Don't modify the source post
6. **Version control audio** - Commit MP3 files to track changes
7. **Update feeds incrementally** - Don't regenerate all posts unless necessary

## Handoff to GitHub Publisher

After successful podcast generation:

1. Verify all audio files are created
2. Confirm RSS feeds are updated
3. Check file sizes are reasonable
4. Hand off to `github-publisher` agent for deployment

**What to send:**

- List of generated files
- Any issues encountered
- Verification checklist status
- Next steps for deployment

## Example Workflow

```bash
# 1. Read the blog post
cat src/content/blog/my-new-post.md

# 2. Generate podcast
uv run podcast-generate --posts "my-new-post"

# 3. Verify output
ls -lh public/podcasts/my-new-post.mp3
ffprobe public/podcasts/my-new-post.mp3 2>&1 | grep Duration

# 4. Check RSS feed
grep "my-new-post" public/podcasts/feed.xml

# 5. Hand off to github-publisher
# (Use handoff button in VS Code)
```

## Resources

- **Kokoro TTS**: https://github.com/thewh1teagle/kokoro-onnx
- **Podcast System Code**: `/podcast_generator/` directory
- **RSS Spec**: https://cyber.harvard.edu/rss/rss.html
- **FFmpeg Docs**: https://ffmpeg.org/documentation.html
- **Blog Post Schema**: `src/content/config.ts`

---

**Remember:** Quality audio starts with quality transcripts. Take time to optimize the text for natural speech before generation. 🎙️
