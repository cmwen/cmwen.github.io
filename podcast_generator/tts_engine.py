"""
TTS Engine using Kokoro with automatic model download and setup
"""

import re
import requests
import numpy as np
from pathlib import Path
from typing import List, Tuple, Optional
import wave
import subprocess
import tempfile
from rich.console import Console
from rich.progress import Progress, DownloadColumn, BarColumn, TextColumn

console = Console()

try:
    from misaki import zh
    MISAKI_AVAILABLE = True
except ImportError:
    MISAKI_AVAILABLE = False
    console.print("⚠️ Warning: misaki[zh] not installed. Chinese TTS will use basic phonemization.")


class KokoroTTSEngine:
    """High-quality TTS engine using Kokoro ONNX with multi-language support"""
    
    def __init__(self):
        self.cache_dir = Path.home() / ".cache" / "kokoro-onnx"
        self.model_path = None
        self.voices_path = None
        self.config_path = None
        self.kokoro = None
        self.g2p = None  # For Chinese phonemization
        self.sample_rate = 24000  # Kokoro default sample rate
        
        # Voice mappings for different languages
        self.voice_map = {
            'en': 'af_sarah',    # English - Sarah (female)
            'zh-hant': 'zf_001', # Chinese Traditional - Voice 001 (female)
            'zh': 'zf_001',      # Chinese Simplified - Voice 001 (female)
            'ja': 'af_sky',      # Japanese - Sky (female)
        }
        
        # Model mappings for different languages
        self.model_config = {
            'en': {
                'model': 'kokoro-v1.0.onnx',
                'voices': 'voices-v1.0.bin',
                'config': None,
                'download_base': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
            },
            'zh': {
                'model': 'kokoro-v1.1-zh.onnx', 
                'voices': 'voices-v1.1-zh.bin',
                'config': 'config.json',
                'download_base': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'
            },
            'zh-hant': {
                'model': 'kokoro-v1.1-zh.onnx',
                'voices': 'voices-v1.1-zh.bin', 
                'config': 'config.json',
                'download_base': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'
            }
        }
    
    def setup(self, language: str = 'en'):
        """Setup the TTS engine by downloading models and initializing for specific language"""
        console.print("🔧 Setting up Kokoro TTS...")
        
        # Get model configuration for the language
        if language in ['zh-hant', 'zh']:
            config = self.model_config['zh']  # Use Chinese model for both variants
        else:
            config = self.model_config.get(language, self.model_config['en'])
        
        # Download models if needed
        self._ensure_models_downloaded(config)
        
        # Initialize Kokoro with appropriate model
        self._initialize_kokoro(config, language)
        
        console.print("✅ Kokoro TTS ready")
    
    def _ensure_models_downloaded(self, config: dict):
        """Download Kokoro models if they don't exist"""
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Model files
        model_file = self.cache_dir / config['model']
        voices_file = self.cache_dir / config['voices']
        config_file = self.cache_dir / config['config'] if config['config'] else None
        
        # Download main model
        if not model_file.exists():
            console.print(f"📥 Downloading {config['model']} (310MB)...")
            self._download_file(
                f"{config['download_base']}{config['model']}", 
                model_file
            )
        else:
            console.print(f"✅ Main model ({config['model']}) already exists")
        
        # Download voice data
        if not voices_file.exists():
            console.print(f"📥 Downloading {config['voices']} (27MB)...")
            self._download_file(
                f"{config['download_base']}{config['voices']}", 
                voices_file
            )
        else:
            console.print(f"✅ Voice styles ({config['voices']}) already exists")
        
        # Download config file for Chinese models
        if config['config'] and config_file and not config_file.exists():
            console.print(f"📥 Downloading {config['config']}...")
            config_url = "https://huggingface.co/hexgrad/Kokoro-82M-v1.1-zh/raw/main/config.json"
            self._download_file(config_url, config_file)
        elif config['config'] and config_file:
            console.print(f"✅ Config file ({config['config']}) already exists")
        
        # Store paths
        self.model_path = model_file
        self.voices_path = voices_file
        self.config_path = config_file
    
    def _download_file(self, url: str, path: Path):
        """Download a file with progress bar"""
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with Progress(
            TextColumn("[bold blue]{task.description}"),
            BarColumn(),
            DownloadColumn(),
            console=console
        ) as progress:
            
            task = progress.add_task(f"Downloading {path.name}", total=total_size)
            
            with open(path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        progress.update(task, advance=len(chunk))
    
    def _initialize_kokoro(self, config: dict, language: str):
        """Initialize the Kokoro TTS engine"""
        try:
            from kokoro_onnx import Kokoro
            
            if config['config'] and self.config_path:
                # Initialize with config file for Chinese models
                self.kokoro = Kokoro(
                    str(self.model_path), 
                    str(self.voices_path),
                    vocab_config=str(self.config_path)
                )
            else:
                # Initialize without config for English models
                self.kokoro = Kokoro(str(self.model_path), str(self.voices_path))
            
            # Initialize Chinese G2P if needed
            if language in ['zh', 'zh-hant'] and MISAKI_AVAILABLE:
                self.g2p = zh.ZHG2P(version="1.1")
                console.print("✅ Chinese G2P initialized")
            elif language in ['zh', 'zh-hant'] and not MISAKI_AVAILABLE:
                console.print("⚠️ Warning: Chinese G2P not available, quality may be reduced")
                
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Kokoro: {e}")
    
    def get_voice_for_language(self, lang: str) -> str:
        """Get the appropriate voice for a language"""
        return self.voice_map.get(lang, 'af_sarah')  # Default to English
    
    def get_available_chinese_voices(self) -> list:
        """Get list of sample Chinese voices for testing"""
        # Sample of available voices - there are actually 90+ total
        return [
            # Female voices (zf_*) - sample selection
            'zf_001', 'zf_002', 'zf_003', 'zf_005', 'zf_008', 
            'zf_017', 'zf_021', 'zf_028', 'zf_036', 'zf_044',
            # Male voices (zm_*) - sample selection  
            'zm_009', 'zm_010', 'zm_015', 'zm_025', 'zm_033', 
            'zm_041', 'zm_055', 'zm_066', 'zm_080', 'zm_095'
        ]
    
    def test_chinese_voices(self, text: str = "你好，這是測試語音。我是來自台灣的聲音測試。", num_voices: int = 10) -> None:
        """Test sample Chinese voices with Taiwanese text"""
        if not self.kokoro:
            console.print("❌ TTS engine not initialized. Call setup() first.")
            return
            
        console.print("🎤 Testing Chinese voices with Taiwanese text...")
        voices = self.get_available_chinese_voices()[:num_voices]
        
        for voice in voices:
            console.print(f"  Testing voice: {voice}")
            try:
                # Convert to phonemes if G2P is available
                if self.g2p:
                    phonemes, _ = self.g2p(text)
                    audio_data, sample_rate = self.kokoro.create(
                        phonemes,
                        voice=voice,
                        speed=1.0,
                        is_phonemes=True
                    )
                else:
                    audio_data, sample_rate = self.kokoro.create(
                        text=text,
                        voice=voice,
                        speed=1.0
                    )
                
                # Save test file
                output_file = Path(f"test_voice_{voice}.wav")
                self._save_wav(audio_data, output_file)
                console.print(f"    ✅ Saved: {output_file}")
                
            except Exception as e:
                console.print(f"    ❌ Failed: {e}")
        
        console.print("🎉 Voice testing complete! Listen to the files and choose your favorite.")
        console.print("💡 To use a different voice, update the voice_map in tts_engine.py")
        console.print(f"📝 Available voices: zf_001-zf_099 (female), zm_009-zm_100 (male)")
    
    def synthesize(self, text: str, voice: str = 'af_sarah', language: str = 'en') -> np.ndarray:
        """Synthesize text to audio with automatic chunking and proper phonemization"""
        
        if not self.kokoro:
            raise RuntimeError("TTS engine not initialized. Call setup() first.")
        
        # Split text into chunks to handle Kokoro's phoneme limit
        # Chinese text needs much smaller chunks due to higher phoneme density
        if language in ['zh-hant', 'zh']:
            max_chars = 50  # Very conservative for Chinese to avoid phoneme overflow
        else:
            max_chars = 600  # Normal for English
        chunks = self._split_text_for_kokoro(text, max_chars=max_chars)
        console.print(f"  Text split into {len(chunks)} chunk(s)")
        
        audio_parts = []
        
        for i, chunk in enumerate(chunks):
            console.print(f"  Synthesizing chunk {i+1}/{len(chunks)}...")
            try:
                # Handle Chinese with proper phonemization
                if language in ['zh', 'zh-hant'] and self.g2p:
                    # Convert to phonemes using misaki
                    phonemes, _ = self.g2p(chunk)
                    audio_data, sample_rate = self.kokoro.create(
                        phonemes,
                        voice=voice,
                        speed=1.0,
                        is_phonemes=True
                    )
                else:
                    # Direct text input for English or fallback Chinese
                    audio_data, sample_rate = self.kokoro.create(
                        text=chunk,
                        voice=voice,
                        speed=1.0
                    )
                
                audio_parts.append(audio_data)
                self.sample_rate = sample_rate
                
            except Exception as e:
                console.print(f"  ⚠️ Warning: Chunk {i+1} failed: {e}")
                # Continue with other chunks
                continue
        
        if not audio_parts:
            raise RuntimeError("No audio chunks were successfully generated")
        
        # Concatenate audio parts with silence
        if len(audio_parts) == 1:
            return audio_parts[0]
        else:
            # Add 300ms silence between chunks
            silence_samples = int(0.3 * self.sample_rate)
            silence = np.zeros(silence_samples, dtype=np.float32)
            
            result = audio_parts[0]
            for audio_part in audio_parts[1:]:
                result = np.concatenate([result, silence, audio_part])
            
            return result
    
    def _split_text_for_kokoro(self, text: str, max_chars: int = 600) -> List[str]:
        """Split text into chunks safe for Kokoro processing"""
        
        # Split on sentences first - include Chinese punctuation
        sentences = re.split(r'(?<=[.!?。！？])\s*', text)
        
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            # If adding this sentence would exceed max_chars, start new chunk
            if len(current_chunk) + len(sentence) > max_chars and current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence
        
        # Add the last chunk
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        # Handle chunks that are still too long
        final_chunks = []
        for chunk in chunks:
            if len(chunk) <= max_chars:
                final_chunks.append(chunk)
            else:
                # For Chinese text (very small max_chars), split more aggressively
                if max_chars <= 100:  # Chinese mode
                    # Split by shorter phrases using Chinese punctuation
                    sub_chunks = re.split(r'[，。；：！？、]', chunk)
                    temp_chunk = ""
                    for sub_chunk in sub_chunks:
                        sub_chunk = sub_chunk.strip()
                        if not sub_chunk:
                            continue
                        if len(temp_chunk) + len(sub_chunk) + 1 <= max_chars:
                            temp_chunk += ("，" + sub_chunk) if temp_chunk else sub_chunk
                        else:
                            if temp_chunk:
                                final_chunks.append(temp_chunk)
                            # If even a single sub-chunk is too long, split by characters
                            if len(sub_chunk) > max_chars:
                                for i in range(0, len(sub_chunk), max_chars):
                                    final_chunks.append(sub_chunk[i:i+max_chars])
                                temp_chunk = ""
                            else:
                                temp_chunk = sub_chunk
                    if temp_chunk:
                        final_chunks.append(temp_chunk)
                else:
                    # Split aggressively by words for English
                    words = chunk.split()
                    temp_chunk = ""
                    for word in words:
                        if len(temp_chunk) + len(word) + 1 <= max_chars:
                            temp_chunk += (" " + word) if temp_chunk else word
                        else:
                            if temp_chunk:
                                final_chunks.append(temp_chunk)
                                temp_chunk = word
                            else:
                                # Single word too long - truncate
                                final_chunks.append(word[:max_chars])
                    
                    if temp_chunk:
                        final_chunks.append(temp_chunk)
        
        return final_chunks
    
    def save_as_mp3(self, audio_data: np.ndarray, output_path: Path):
        """Save audio data as MP3 file using ffmpeg"""
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # First save as WAV
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav_path = Path(temp_wav.name)
        
        self._save_wav(audio_data, temp_wav_path)
        
        # Convert to MP3 using ffmpeg
        try:
            subprocess.run([
                'ffmpeg', '-i', str(temp_wav_path),
                '-acodec', 'libmp3lame',
                '-b:a', '128k',
                '-y',  # Overwrite output file
                str(output_path)
            ], check=True, capture_output=True)
            # Success! Clean up temp file and return the MP3 path
            temp_wav_path.unlink()
            return output_path
        except subprocess.CalledProcessError as e:
            # Fallback: save as WAV instead
            console.print(f"⚠️ FFmpeg failed, saving as WAV: {e}")
            wav_output_path = output_path.with_suffix('.wav')
            temp_wav_path.rename(wav_output_path)
            return wav_output_path
        except FileNotFoundError:
            # FFmpeg not installed, save as WAV
            console.print("⚠️ FFmpeg not found, saving as WAV")
            wav_output_path = output_path.with_suffix('.wav')
            temp_wav_path.rename(wav_output_path)
            return wav_output_path
        finally:
            # Clean up temp file if it still exists
            if temp_wav_path.exists():
                temp_wav_path.unlink()
    
    def _save_wav(self, audio_data: np.ndarray, output_path: Path):
        """Save audio data as WAV file"""
        with wave.open(str(output_path), 'wb') as wav_file:
            wav_file.setnchannels(1)  # mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(self.sample_rate)
            
            # Convert float32 to int16
            audio_int16 = (audio_data * 32767).astype(np.int16)
            wav_file.writeframes(audio_int16.tobytes())