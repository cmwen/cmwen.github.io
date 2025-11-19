"""
Main CLI entry point for the podcast generator
"""

import click
import sys
from pathlib import Path
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn

from .blog_parser import BlogParser
from .tts_engine import KokoroTTSEngine
from .feed_generator import PodcastFeedGenerator

console = Console()


@click.command()
@click.option('--posts', help='Comma-separated list of post slugs to generate')
@click.option('--all', is_flag=True, help='Generate podcasts for all posts')
@click.option('--provider', default='kokoro', help='TTS provider (currently only kokoro)')
@click.option('--force', is_flag=True, help='Force regenerate existing podcasts')
@click.option('--dry-run', is_flag=True, help='Show what would be generated without doing it')
@click.option('--refresh-feeds', is_flag=True, help='Rebuild feeds from existing audio only (no new TTS)')
@click.option('--output-dir', default='public/podcasts', help='Output directory for podcasts')
def cli(posts, all, provider, force, dry_run, refresh_feeds, output_dir):
    """Generate podcasts from blog posts using Kokoro TTS"""
    
    console.print("🎙️  [bold blue]Blog-to-Podcast Generator[/bold blue]")
    console.print(f"Provider: {provider}")
    console.print(f"Force regenerate: {force}")
    console.print(f"Dry run: {dry_run}")
    console.print(f"Refresh feeds only: {refresh_feeds}")
    console.print()
    
    try:
        main_generate(posts, all, provider, force, dry_run, refresh_feeds, output_dir)
    except KeyboardInterrupt:
        console.print("\n❌ Generation cancelled by user")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n❌ Error: {e}")
        sys.exit(1)


def main_generate(posts, all, provider, force, dry_run, refresh_feeds, output_dir):
    """Main generation logic.

    Feed preservation fix: Always aggregate all existing audio episodes when writing feeds so
    partial generation runs (e.g., --posts slug1) do not wipe earlier entries from feed.xml.
    Use --refresh-feeds to rebuild feed(s) from existing audio without generating new audio.
    """
    
    blog_parser = BlogParser()
    feed_generator = PodcastFeedGenerator()
    tts_engine = None  # Lazy init only if we actually synthesize
    
    # Parse blog posts
    console.print("📚 Loading blog posts...")
    
    if refresh_feeds:
        blog_posts = blog_parser.load_all_posts()
    else:
        if posts:
            post_slugs = [slug.strip() for slug in posts.split(',') if slug.strip()]
            blog_posts = blog_parser.load_posts_by_slugs(post_slugs)
        elif all:
            blog_posts = blog_parser.load_all_posts()
        else:
            console.print("❌ Please specify --posts, --all, or --refresh-feeds")
            return
    
    console.print(f"Found {len(blog_posts)} blog post(s)")
    
    if not blog_posts:
        console.print("No posts to generate. Exiting.")
        return
    
    if dry_run and not refresh_feeds:
        console.print("\n🔍 Dry run - Posts that would be generated:")
        for post in blog_posts:
            console.print(f"  • {post.title} ({post.lang})")
        return
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    if refresh_feeds:
        console.print("\n♻️  Refreshing feeds from existing audio (no synthesis)...")
        existing = _collect_existing_episodes(blog_posts, output_path)
        if not existing:
            console.print("⚠️ No existing audio files found to build feeds from.")
            return
        console.print(f"Found {len(existing)} existing episode(s)")
        console.print("\n📡 Generating podcast RSS feeds...")
        feed_generator.generate_feeds(existing, output_path)
        console.print(f"\n✅ Refreshed feeds containing {len(existing)} episode(s)")
        console.print("\n🎉 Feed refresh complete!")
        return
    
    # Setup TTS engine
    console.print(f"\n🎤 Setting up {provider} TTS...")
    tts_engine = KokoroTTSEngine()
    languages = {post.lang for post in blog_posts}
    console.print(f"Detected languages: {', '.join(languages)}")
    for lang in languages:
        console.print(f"Ensuring {lang} models are available...")
        if lang in ['zh-hant', 'zh']:
            config = tts_engine.model_config['zh']
        else:
            config = tts_engine.model_config.get(lang, tts_engine.model_config['en'])
        tts_engine._ensure_models_downloaded(config)
    
    # Generate podcasts
    console.print("\n🎵 Generating podcast audio files...")
    
    episodes = []
    current_tts_language = None  # Track the currently loaded TTS model language
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        
        for post in blog_posts:
            task = progress.add_task(f"Generating: {post.title}", total=None)
            
            # Determine audio filename; include language suffix for non-English episodes
            if post.lang and post.lang != 'en':
                audio_file = output_path / f"{post.slug}.{post.lang}.mp3"
            else:
                audio_file = output_path / f"{post.slug}.mp3"
            if audio_file.exists() and not force:
                console.print(f"✓ Podcast already exists for: {post.slug}")
                episodes.append({
                    'slug': post.slug,
                    'title': post.title,
                    'description': post.description,
                    'lang': post.lang,
                    'pub_date': post.pub_date,
                    'audio_file': audio_file,
                    'file_size': audio_file.stat().st_size
                })
                progress.remove_task(task)
                continue
            
            try:
                # Setup TTS engine for this language if needed
                if current_tts_language != post.lang:
                    console.print(f"🔄 Switching TTS to {post.lang} mode...")
                    tts_engine.setup(language=post.lang)
                    current_tts_language = post.lang
                
                # Use LLM transcript if provided; otherwise fallback to prepared content
                tts_text = post.llm_transcript or post.content_for_tts

                # Generate TTS audio
                audio_data = tts_engine.synthesize(
                    text=tts_text,
                    voice=tts_engine.get_voice_for_language(post.lang),
                    language=post.lang
                )
                
                # Save as MP3 (or WAV if ffmpeg unavailable)
                actual_audio_file = tts_engine.save_as_mp3(audio_data, audio_file)
                
                console.print(f"✓ Generated: {actual_audio_file} ({actual_audio_file.stat().st_size / 1024 / 1024:.1f}MB)")
                
                episodes.append({
                    'slug': post.slug,
                    'title': post.title,
                    'description': post.description,
                    'lang': post.lang,
                    'pub_date': post.pub_date,
                    'audio_file': actual_audio_file,
                    'file_size': actual_audio_file.stat().st_size
                })
                
            except Exception as e:
                console.print(f"❌ Failed to generate {post.slug}: {e}")
            
            progress.remove_task(task)
    
    # Merge with existing episodes on disk for feed completeness
    console.print("\n🔎 Aggregating existing audio for feed completeness...")
    all_posts = blog_parser.load_all_posts()
    existing_all = _collect_existing_episodes(all_posts, output_path)
    existing_map = {e['slug']: e for e in existing_all}
    for e in episodes:
        existing_map[e['slug']] = e
    merged = list(existing_map.values())
    console.print(f"Total episodes for feeds: {len(merged)} (new: {len(episodes)})")

    console.print("\n📡 Generating podcast RSS feeds...")
    feed_generator.generate_feeds(merged, output_path)
    
    console.print(f"\n✅ Generated {len(episodes)} new episode(s); {len(merged)} total in feeds")
    console.print("\n🎉 Podcast generation complete!")


def main():
    """Entry point when called as module"""
    cli()


if __name__ == "__main__":
    main()


def _collect_existing_episodes(blog_posts, output_path: Path):
    """Collect existing audio (*.mp3) in output_path and map to blog metadata.

    Skips orphaned audio files that no longer have a corresponding blog post.
    Returns list of episode dicts compatible with feed generator.
    """
    index = {p.slug: p for p in blog_posts}
    episodes = []
    for audio_file in output_path.glob('*.mp3'):
        slug = audio_file.stem
        post = index.get(slug)

        # Support language-suffixed audio files like `slug.zh-hant.mp3` or `slug.en.mp3`.
        # If not found, try splitting the stem on the last '.' and match base slug.
        lang_override = None
        if not post and '.' in slug:
            base_slug, possible_lang = slug.rsplit('.', 1)
            post = index.get(base_slug)
            if post:
                lang_override = possible_lang
        if not post:
            continue
        try:
            episodes.append({
                'slug': base_slug if lang_override else slug,
                'title': post.title,
                'description': post.description,
                'lang': lang_override or post.lang,
                'pub_date': post.pub_date,
                'audio_file': audio_file,
                'file_size': audio_file.stat().st_size
            })
        except OSError:
            continue
    return episodes