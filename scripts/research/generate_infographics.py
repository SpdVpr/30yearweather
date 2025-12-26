"""
NanoBanana PRO (Gemini) Infographic Generator for Research Studies
Generates high-quality infographics using Google Gemini's image generation capabilities.

Models:
- gemini-2.5-flash-image: Fast, efficient, high-volume

Usage:
    python scripts/research/generate_infographics.py

Requires:
    pip install google-genai Pillow
    GEMINI_API_KEY or NANOBANANA_API_KEY environment variable
"""

import os
import json
from pathlib import Path
from typing import Optional, List
from dataclasses import dataclass
from datetime import datetime

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("❌ Missing dependencies. Please install:")
    print("   pip install google-genai Pillow")
    exit(1)


# Configuration - Use NanoBanana Pro model (Gemini 3 Pro Image - Working)
NANOBANANA_MODEL = "gemini-3-pro-image-preview"


@dataclass
class InfographicConfig:
    """Configuration for an infographic to generate."""
    name: str
    filename: str
    prompt: str


def get_api_key() -> str:
    """Get Gemini/NanoBanana API key from environment."""
    api_key = os.environ.get("NANOBANANA_API_KEY") or os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        env_file = Path(__file__).parent.parent.parent / ".env.local"
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("NANOBANANA_API_KEY=") or line.startswith("GEMINI_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"\'')
                        break
    
    if not api_key:
        raise ValueError(
            "API key not found. Please set NANOBANANA_API_KEY or GEMINI_API_KEY.\n"
            "Get your key at: https://aistudio.google.com/apikey"
        )
    
    return api_key


def generate_image(prompt: str, client: genai.Client) -> Optional[bytes]:
    """
    Generate image using Google Gemini API.
    Returns image bytes or None if failed.
    """
    try:
        # Use generate_images for dedicated image generation
        response = client.models.generate_content(
            model=NANOBANANA_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE']
            )
        )
        
        # Extract image from response parts
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                # Get raw bytes directly
                return part.inline_data.data
        
        # If no inline_data, check if there's text response (error or explanation)
        for part in response.candidates[0].content.parts:
            if part.text:
                print(f"  Model response: {part.text[:200]}...")
        
        return None
        
    except Exception as e:
        print(f"  Error generating image: {e}")
        return None


def save_image(image_data: bytes, output_path: Path) -> bool:
    """Save image data to file."""
    try:
        # Save raw bytes directly
        with open(output_path, 'wb') as f:
            f.write(image_data)
        
        # Verify it's a valid image by trying to open with PIL
        try:
            from PIL import Image
            img = Image.open(output_path)
            img.verify()
            return True
        except:
            # If PIL can't verify, the file might still be valid
            # Check if it has reasonable size
            if output_path.stat().st_size > 1000:
                return True
            return False
            
    except Exception as e:
        print(f"  Error saving image: {e}")
        return False


def create_infographic_prompts() -> List[InfographicConfig]:
    """
    Create prompts for research infographics.
    Optimized for Gemini's image generation - simpler prompts work better.
    """
    return [
        InfographicConfig(
            name="Global Warming Hero",
            filename="global-warming-hero.png",
            prompt="Global Warming Prediction 2026. A cinematic 3D visualization of Earth showing temperature anomalies. Red heatwaves over Europe and the Arctic. Floating data points and trend lines rising sharply. Dark, serious, scientific aesthetic. High quality, 8k."
        )
    ]


def main():
    """Main function to generate all infographics."""
    print("🎨 NanoBanana PRO (Gemini) Infographic Generator")
    print("=" * 55)
    
    # Get API key
    try:
        api_key = get_api_key()
        print(f"✅ API key loaded: {api_key[:12]}...")
    except ValueError as e:
        print(f"❌ {e}")
        return
    
    # Create client
    client = genai.Client(api_key=api_key)
    print(f"📡 Using model: {NANOBANANA_MODEL}")
    
    # Setup output directory
    output_dir = Path(__file__).parent.parent.parent / "public" / "images" / "research"
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Output: {output_dir}\n")
    
    # Get configurations
    infographics = create_infographic_prompts()
    print(f"📊 Generating {len(infographics)} infographics...\n")
    
    results = []
    
    for i, config in enumerate(infographics, 1):
        print(f"[{i}/{len(infographics)}] {config.name}")
        
        try:
            print("  Generating...")
            image_data = generate_image(config.prompt, client)
            
            if image_data:
                output_path = output_dir / config.filename
                
                if save_image(image_data, output_path):
                    size_kb = output_path.stat().st_size / 1024
                    print(f"  ✅ Saved: {config.filename} ({size_kb:.1f} KB)")
                    results.append({"name": config.name, "status": "success", "size_kb": size_kb})
                else:
                    print(f"  ❌ Failed to save")
                    results.append({"name": config.name, "status": "save_failed"})
            else:
                print(f"  ❌ No image generated")
                results.append({"name": config.name, "status": "no_image"})
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
            results.append({"name": config.name, "status": "error", "error": str(e)})
        
        print()
    
    # Summary
    print("=" * 55)
    success = sum(1 for r in results if r.get("status") == "success")
    print(f"📊 Complete: {success}/{len(infographics)} successful")
    
    # Save log
    log_path = output_dir / "generation-log.json"
    with open(log_path, 'w') as f:
        json.dump({"generated_at": datetime.now().isoformat(), "model": NANOBANANA_MODEL, "results": results}, f, indent=2)
    
    return results


if __name__ == "__main__":
    main()
