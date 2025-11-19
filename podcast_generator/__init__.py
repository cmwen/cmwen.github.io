"""
Pure Python Blog-to-Podcast Generator
=====================================

A streamlined solution for converting blog posts to podcasts using Kokoro TTS.

Main Features:
- Automatic model download and setup
- Markdown blog post parsing with frontmatter
- High-quality TTS synthesis with text chunking
- RSS feed generation for podcast apps
- Simple uv-based dependency management

Usage:
    uv run podcast-generate --help
    uv run podcast-generate --posts post-slug-1,post-slug-2
    uv run podcast-generate --all
"""

__version__ = "0.1.0"
__author__ = "cmwen"

from .blog_parser import BlogParser
from .tts_engine import KokoroTTSEngine
from .feed_generator import PodcastFeedGenerator
from .main import cli

__all__ = [
    "BlogParser",
    "KokoroTTSEngine", 
    "PodcastFeedGenerator",
    "cli",
]