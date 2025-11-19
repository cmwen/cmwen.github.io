"""
Blog post parser for extracting content from markdown files
"""

import frontmatter
import re
from pathlib import Path
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Optional


@dataclass
class BlogPost:
    """Represents a parsed blog post"""
    slug: str
    title: str
    description: str
    content: str
    content_for_tts: str
    lang: str
    pub_date: datetime
    author: str
    tags: List[str]
    base_slug: Optional[str] = None
    llm_transcript: Optional[str] = None
    featured: bool = False


class BlogParser:
    """Parser for blog posts in markdown format with frontmatter"""
    
    def __init__(self, content_dir: str = "src/content/blog"):
        self.content_dir = Path(content_dir)
        
    def load_all_posts(self) -> List[BlogPost]:
        """Load all blog posts from the content directory"""
        posts = []
        
        # Search in main directory and subdirectories
        for md_file in self.content_dir.rglob("*.md"):
            try:
                post = self._parse_post_file(md_file)
                if post:
                    posts.append(post)
            except Exception as e:
                print(f"Warning: Failed to parse {md_file}: {e}")
        
        # Sort by publication date (newest first)
        posts.sort(key=lambda p: p.pub_date, reverse=True)
        return posts
    
    def load_posts_by_slugs(self, slugs: List[str]) -> List[BlogPost]:
        """Load specific posts by their slugs"""
        posts = []
        
        for slug in slugs:
            # Try different file patterns in main directory and subdirectories
            for pattern in [f"{slug}.md", f"{slug}*.md", f"*{slug}*.md"]:
                matches = list(self.content_dir.rglob(pattern))
                if matches:
                    # If multiple matches, prefer the one that exactly matches the slug
                    best_match = matches[0]
                    for match in matches:
                        if match.stem == slug or match.stem.startswith(f"{slug}."):
                            best_match = match
                            break
                    
                    try:
                        post = self._parse_post_file(best_match)
                        if post:
                            posts.append(post)
                        break
                    except Exception as e:
                        print(f"Warning: Failed to parse {best_match}: {e}")
            else:
                print(f"Warning: Post not found for slug: {slug}")
        
        return posts
    
    def _parse_post_file(self, file_path: Path) -> Optional[BlogPost]:
        """Parse a single markdown file into a BlogPost"""
        
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
        
        # Extract frontmatter
        metadata = post.metadata
        content = post.content
        
        # Skip drafts
        if metadata.get('draft', False):
            return None
        
        # Extract basic info
        # Prefer a canonical baseSlug from frontmatter for translations; fall back to file stem
        base_slug = metadata.get('baseSlug')
        slug = base_slug or file_path.stem
        title = metadata.get('title', slug.replace('-', ' ').title())
        description = metadata.get('description', '')
        lang = metadata.get('lang', 'en')
        author = metadata.get('author', 'Min Wen')
        tags = metadata.get('tags', [])
        featured = metadata.get('featured', False)
        
        # Parse publication date
        pub_date_str = metadata.get('pubDatetime')
        if pub_date_str:
            if isinstance(pub_date_str, datetime):
                pub_date = pub_date_str
            else:
                pub_date = datetime.fromisoformat(str(pub_date_str).replace('Z', '+00:00'))
        else:
            # Fallback to file modification time (make it timezone-aware)
            pub_date = datetime.fromtimestamp(file_path.stat().st_mtime, tz=timezone.utc)
        
        # Ensure pub_date is timezone-aware for comparison
        if pub_date.tzinfo is None:
            pub_date = pub_date.replace(tzinfo=timezone.utc)
        
        # Skip future posts (scheduled posts)
        if pub_date > datetime.now(timezone.utc):
            return None
        
        # Check for LLM-generated transcript first
        # The agent may place a TTS-optimized transcript at src/content/blog/transcripts/<slug>.txt
        transcript = self._read_transcript_file(slug, lang)

        # Process content for TTS, preferring LLM transcript if available
        if transcript:
            content_for_tts = transcript
        else:
            content_for_tts = self._prepare_content_for_tts(content, title, author)
        
        return BlogPost(
            slug=slug,
            base_slug=base_slug,
            title=title,
            description=description,
            content=content,
            content_for_tts=content_for_tts,
            llm_transcript=transcript,
            lang=lang,
            pub_date=pub_date,
            author=author,
            tags=tags,
            featured=featured
        )

    def _read_transcript_file(self, slug: str, lang: str) -> Optional[str]:
        """Read an LLM-generated transcript if it exists.

        Transcript files are looked up in two places:
        1. src/content/blog/transcripts/<slug>.<lang>.txt  (e.g., my-post.en.txt or my-post.zh-hant.txt)
        2. src/content/blog/transcripts/<slug>.txt

        Returns the transcript string or None if not found.
        """

        transcripts_dir = self.content_dir / "transcripts"
        if not transcripts_dir.exists():
            return None

        # Prefer language-expanded transcript file
        lang_suffix = f"{slug}.{lang}.txt"
        lang_file = transcripts_dir / lang_suffix
        if lang_file.exists():
            return lang_file.read_text(encoding='utf-8').strip()

        # Fall back to generic slug.txt
        generic_file = transcripts_dir / f"{slug}.txt"
        if generic_file.exists():
            return generic_file.read_text(encoding='utf-8').strip()

        return None
    
    def _prepare_content_for_tts(self, content: str, title: str, author: str) -> str:
        """Prepare markdown content for text-to-speech synthesis"""
        
        # Start with title and author
        tts_content = f"{title}. By {author}.\n\n"
        
        # Remove markdown syntax
        text = content
        
        # Remove code blocks
        text = re.sub(r'```[\s\S]*?```', '', text)
        text = re.sub(r'`[^`]+`', '', text)
        
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Convert markdown headers to readable text
        text = re.sub(r'^#{1,6}\s+(.+)$', r'\1. ', text, flags=re.MULTILINE)
        
        # Convert markdown links to just the text
        text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
        
        # Convert markdown bold/italic to plain text
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
        text = re.sub(r'\*([^*]+)\*', r'\1', text)
        
        # Remove markdown list markers and convert to readable format
        text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
        
        # Clean up multiple newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # Remove extra whitespace
        text = re.sub(r'[ \t]+', ' ', text)
        text = text.strip()
        
        tts_content += text
        
        # Add closing
        tts_content += "\n\nThank you for listening. Visit the blog for more articles."
        
        return tts_content