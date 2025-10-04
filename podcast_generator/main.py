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
@click.option('--output-dir', default='public/podcasts', help='Output directory for podcasts')
def cli(posts, all, provider, force, dry_run, output_dir):
    """Generate podcasts from blog posts using Kokoro TTS"""
    
    console.print("🎙️  [bold blue]Blog-to-Podcast Generator[/bold blue]")
    console.print(f"Provider: {provider}")
    console.print(f"Force regenerate: {force}")
    console.print(f"Dry run: {dry_run}")
    console.print()
    
    try:
        main_generate(posts, all, provider, force, dry_run, output_dir)
    except KeyboardInterrupt:
        console.print("\n❌ Generation cancelled by user")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n❌ Error: {e}")
        sys.exit(1)


def main_generate(posts, all, provider, force, dry_run, output_dir):
    """Main generation logic"""
    
    # Initialize components
    blog_parser = BlogParser()
    tts_engine = KokoroTTSEngine()
    feed_generator = PodcastFeedGenerator()
    
    # Parse blog posts
    console.print("📚 Loading blog posts...")
    
    if posts:
        post_slugs = [slug.strip() for slug in posts.split(',')]
        blog_posts = blog_parser.load_posts_by_slugs(post_slugs)
    elif all:
        blog_posts = blog_parser.load_all_posts()
    else:
        console.print("❌ Please specify --posts or --all")
        return
    
    console.print(f"Found {len(blog_posts)} blog post(s)")
    
    if not blog_posts:
        console.print("No posts to generate. Exiting.")
        return
    
    if dry_run:
        console.print("\n🔍 Dry run - Posts that would be generated:")
        for post in blog_posts:
            console.print(f"  • {post.title} ({post.lang})")
        return
    
    # Setup TTS engine
    console.print(f"\n🎤 Setting up {provider} TTS...")
    
    # Detect languages in the posts
    languages = set(post.lang for post in blog_posts)
    console.print(f"Detected languages: {', '.join(languages)}")
    
    # Download models for all languages (without full initialization)
    for lang in languages:
        console.print(f"Ensuring {lang} models are available...")
        if lang in ['zh-hant', 'zh']:
            config = tts_engine.model_config['zh']
        else:
            config = tts_engine.model_config.get(lang, tts_engine.model_config['en'])
        tts_engine._ensure_models_downloaded(config)
    
    # Generate podcasts
    console.print("\n🎵 Generating podcast audio files...")
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    episodes = []
    current_tts_language = None  # Track the currently loaded TTS model language
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        
        for post in blog_posts:
            task = progress.add_task(f"Generating: {post.title}", total=None)
            
            # Check if already exists
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
                
                # Generate TTS audio
                audio_data = tts_engine.synthesize(
                    text=post.content_for_tts,
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
    
    # Generate RSS feeds
    console.print("\n📡 Generating podcast RSS feeds...")
    feed_generator.generate_feeds(episodes, output_path)
    
    console.print(f"\n✅ Generated {len(episodes)} podcast episode(s)")
    console.print("\n🎉 Podcast generation complete!")


def main():
    """Entry point when called as module"""
    cli()


if __name__ == "__main__":
    main()