"""
RSS feed generator for podcast episodes
"""

from pathlib import Path
from typing import List, Dict
from datetime import datetime
from feedgen.feed import FeedGenerator
from rich.console import Console

console = Console()


class PodcastFeedGenerator:
    """Generates RSS feeds for podcast episodes"""
    
    def __init__(self, site_url: str = "https://cmwen.github.io"):
        self.site_url = site_url
        
        # Podcast metadata
        self.podcast_info = {
            'title': "cmwen.github.io Podcast",
            'subtitle': "Tech insights from a developer's perspective",
            'description': "Automatically generated podcasts from blog posts covering software development, AI, and tech productivity.",
            'author': "Min Wen",
            'email': "cmwen@example.com",
            'image': f"{site_url}/astropaper-og.jpg",
            'category': "Technology",
            'language': "en"
        }
    
    def generate_feeds(self, episodes: List[Dict], output_dir: Path):
        """Generate RSS feeds for all episodes and by language"""
        
        # Group episodes by language
        episodes_by_lang = {}
        for episode in episodes:
            lang = episode.get('lang', 'en')
            if lang not in episodes_by_lang:
                episodes_by_lang[lang] = []
            episodes_by_lang[lang].append(episode)
        
        # Generate feed for each language
        for lang, lang_episodes in episodes_by_lang.items():
            lang_dir = output_dir / lang
            lang_dir.mkdir(exist_ok=True)
            
            feed_path = lang_dir / "feed.xml"
            self._generate_feed(lang_episodes, feed_path, lang)
            console.print(f"✅ Generated feed: {feed_path}")
        
        # Generate main feed (all episodes)
        main_feed_path = output_dir / "feed.xml"
        self._generate_feed(episodes, main_feed_path, "en")
        console.print(f"✅ Generated main feed: {main_feed_path}")
        
        # Print feed URLs
        console.print("\n📡 RSS Feeds:")
        for lang in episodes_by_lang.keys():
            console.print(f"  {lang}: {self.site_url}/podcasts/{lang}/feed.xml")
        
        console.print(f"\nAdd these feeds to your podcast app to listen!")
    
    def _generate_feed(self, episodes: List[Dict], output_path: Path, language: str):
        """Generate a single RSS feed file"""
        
        fg = FeedGenerator()
        
        # Set up feed metadata
        fg.load_extension('podcast')
        
        title = self.podcast_info['title']
        if language != 'en':
            title += f" ({language.upper()})"
        
        fg.title(title)
        fg.description(self.podcast_info['description'])
        fg.author({'name': self.podcast_info['author'], 'email': self.podcast_info['email']})
        fg.link(href=self.site_url, rel='alternate')
        fg.link(href=f"{self.site_url}/podcasts/{language}/feed.xml", rel='self')
        fg.language(language)
        fg.copyright(f"© {datetime.now().year} {self.podcast_info['author']}")
        fg.image(
            url=self.podcast_info['image'],
            title=title,
            link=self.site_url
        )
        
        # Podcast-specific metadata
        fg.podcast.itunes_author(self.podcast_info['author'])
        fg.podcast.itunes_category(self.podcast_info['category'])
        fg.podcast.itunes_summary(self.podcast_info['description'])
        fg.podcast.itunes_image(self.podcast_info['image'])
        fg.podcast.itunes_explicit('clean')
        fg.podcast.itunes_type('episodic')
        
        # Add episodes
        for episode in sorted(episodes, key=lambda x: x['pub_date'], reverse=True):
            fe = fg.add_entry()
            
            # Basic episode info
            # Use language-specific id when language is not English to avoid collisions
            if episode.get('lang') and episode.get('lang') != 'en':
                fe.id(f"{self.site_url}/podcasts/{episode['slug']}.{episode['lang']}")
            else:
                fe.id(f"{self.site_url}/podcasts/{episode['slug']}")
            fe.title(episode['title'])
            fe.description(episode['description'])
            fe.pubDate(episode['pub_date'])
            fe.author({'name': self.podcast_info['author']})
            
            # Audio enclosure
            audio_url = f"{self.site_url}/podcasts/{episode['audio_file'].name}"
            fe.enclosure(
                url=audio_url,
                length=str(episode['file_size']),
                type='audio/mpeg'
            )
            
            # Podcast episode metadata
            fe.podcast.itunes_author(self.podcast_info['author'])
            fe.podcast.itunes_duration(self._estimate_duration(episode['file_size']))
            fe.podcast.itunes_explicit('clean')
            fe.podcast.itunes_summary(episode['description'])
        
        # Write feed to file
        fg.rss_str(pretty=True)
        fg.rss_file(str(output_path))
    
    def _estimate_duration(self, file_size: int) -> str:
        """Estimate duration based on file size (rough approximation)"""
        # Rough estimate: 128kbps MP3 = ~16KB per second
        # This is very approximate, actual duration would require parsing the audio
        estimated_seconds = file_size / (16 * 1024)
        
        hours = int(estimated_seconds // 3600)
        minutes = int((estimated_seconds % 3600) // 60)
        seconds = int(estimated_seconds % 60)
        
        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes:02d}:{seconds:02d}"