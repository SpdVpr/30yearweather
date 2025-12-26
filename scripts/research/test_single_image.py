"""
Test NanoBanana PRO (Gemini) - Single image generation test
"""

import os
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("❌ pip install google-genai")
    exit(1)

# API key
API_KEY = os.environ.get("NANOBANANA_API_KEY") or os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("❌ Set NANOBANANA_API_KEY or GEMINI_API_KEY")
    exit(1)

print(f"✅ API Key: {API_KEY[:15]}...")

# Create client
client = genai.Client(api_key=API_KEY)

# Simple test prompt
prompt = """Generate a simple infographic image:

Title text: "SHOULDER SEASON 2025"
Subtitle: "Best European Destinations"

Dark blue/gray background.
Orange accent colors.
Simple, clean design.

Size: 1200x630 pixels landscape."""

print(f"📝 Prompt: {prompt[:100]}...")
print("🔄 Generating image...")

try:
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['IMAGE']
        )
    )
    
    print(f"📦 Response received")
    print(f"   Candidates: {len(response.candidates)}")
    
    if response.candidates:
        parts = response.candidates[0].content.parts
        print(f"   Parts: {len(parts)}")
        
        for i, part in enumerate(parts):
            print(f"   Part {i}: inline_data={part.inline_data is not None}, text={part.text is not None}")
            
            if part.inline_data:
                data = part.inline_data.data
                mime = part.inline_data.mime_type
                print(f"   MIME: {mime}, Size: {len(data)} bytes")
                
                # Save
                output_dir = Path(__file__).parent.parent.parent / "public" / "images" / "research"
                output_dir.mkdir(parents=True, exist_ok=True)
                output_path = output_dir / "test-image.png"
                
                with open(output_path, 'wb') as f:
                    f.write(data)
                
                print(f"✅ Saved to: {output_path}")
                print(f"   File size: {output_path.stat().st_size / 1024:.1f} KB")
                
            elif part.text:
                print(f"   Text: {part.text[:300]}...")
    else:
        print("❌ No candidates in response")
        
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")
