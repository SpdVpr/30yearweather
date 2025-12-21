"""
YouTube Shorts Generator v2 - Text-to-Video
Uses high-quality text-to-video AI models from Replicate
Output: 16:9, 720p+
"""

import replicate
import requests
import os
import json
from pathlib import Path

REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")

def get_city_data(slug: str) -> dict:
    """Load city data from JSON"""
    data_path = Path(f"public/data/{slug}.json")
    if data_path.exists():
        with open(data_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def generate_video_prompt(city_name: str, city_data: dict) -> str:
    """Generate a cinematic video prompt for the city"""
    
    meta = city_data.get('meta', {})
    is_coastal = meta.get('is_coastal', False)
    country = meta.get('country', '')
    
    # City-specific elements for better results
    city_elements = {
        'tokyo': 'neon-lit Shibuya crossing at night, cherry blossoms in spring, ancient temples, Mount Fuji on horizon, bullet trains',
        'paris': 'Eiffel Tower at golden hour, Seine river boats, charming café terraces, Champs-Élysées, autumn leaves',
        'bali': 'terraced green rice paddies, tropical beach with palm trees, Hindu temple ceremonies, Ubud jungle, volcanic sunrise',
        'london': 'Big Ben at sunset, red double-decker buses on Westminster Bridge, Thames river panorama, Tower Bridge opening',
        'dubai': 'Burj Khalifa piercing clouds, desert dunes with camel caravan, futuristic skyline, Palm Jumeirah aerial view',
        'new-york': 'Times Square neon lights, Central Park autumn, Brooklyn Bridge at dawn, Manhattan skyline from river',
        'barcelona': 'Sagrada Familia spires, Mediterranean beach at sunset, Gothic Quarter streets, Park Güell mosaics',
        'rome': 'Colosseum at golden hour, Trevi Fountain, Vatican dome, ancient ruins with tourists, Roman piazzas',
        'sydney': 'Opera House and Harbour Bridge together, Bondi Beach surfers, coastal cliffs, blue harbour waters',
        'prague': 'Charles Bridge at sunrise with statues, Prague Castle, Old Town Square clock, red rooftops panorama',
    }
    
    elements = city_elements.get(city_name.lower().replace(' ', '-'), 
                                 f'iconic landmarks of {city_name}, vibrant streets, beautiful architecture, tourists enjoying')
    
    # Create cinematic prompt
    prompt = f"""
Cinematic drone footage of {city_name}, {country}. 
{elements}.
Golden hour sunlight, professional travel documentary cinematography, 
smooth camera movement, epic establishing shot,
8K film quality, rich vibrant colors, dreamy cinematic look.
Aerial view slowly revealing the city's beauty.
    """.strip()
    
    return prompt

def generate_text_to_video(prompt: str, output_path: str, city_name: str):
    """Generate video from text prompt using Replicate"""
    print(f"🎬 Generating video for {city_name}...")
    print(f"📝 Prompt: {prompt[:100]}...")
    
    client = replicate.Client(api_token=REPLICATE_API_TOKEN)
    
    # Try Minimax (Hailuo) - reliable and good quality
    try:
        print(f"   🔄 Using Minimax Video-01...")
        
        output = client.run(
            "minimax/video-01",
            input={
                "prompt": prompt,
                "prompt_optimizer": True,
            }
        )
        
        if output:
            video_url = str(output)
            print(f"📥 Downloading video from {video_url[:50]}...")
            response = requests.get(video_url)
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            file_size = os.path.getsize(output_path)
            print(f"✅ Success! Saved {file_size/1024/1024:.1f} MB to {output_path}")
            return output_path
            
    except Exception as e:
        print(f"   ⚠️ Minimax failed: {str(e)}")
    
    # Fallback: Try Wan-Video
    try:
        print(f"   🔄 Trying Wan-Video as fallback...")
        
        output = client.run(
            "wan-video/wan-2.1-t2v-480p",
            input={
                "prompt": prompt,
                "max_frames": 81,  # ~5 seconds at 16fps
            }
        )
        
        if output:
            video_url = str(output)
            print(f"📥 Downloading video...")
            response = requests.get(video_url)
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Success with Wan-Video!")
            return output_path
            
    except Exception as e:
        print(f"   ⚠️ Wan-Video failed: {str(e)}")
    
    # Fallback 2: LTX-Video
    try:
        print(f"   🔄 Trying LTX-Video...")
        
        output = client.run(
            "lightricks/ltx-video",
            input={
                "prompt": prompt,
                "negative_prompt": "low quality, blurry, distorted",
                "num_frames": 97,
            }
        )
        
        if output:
            video_url = str(output)
            print(f"📥 Downloading video...")
            response = requests.get(video_url)
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Success with LTX-Video!")
            return output_path
            
    except Exception as e:
        print(f"   ⚠️ LTX-Video failed: {str(e)}")
    
    print("❌ All models failed")
    return None

def create_short(slug: str):
    """Create a complete YouTube Short for a city"""
    print(f"\n{'='*60}")
    print(f"🎬 Creating YouTube Short for: {slug}")
    print(f"   Format: 16:9, 720p+")
    print(f"{'='*60}\n")
    
    # Setup paths
    output_dir = Path("output/youtube-shorts-v2")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load city data
    city_data = get_city_data(slug)
    if not city_data:
        print(f"❌ No data found for {slug}")
        return None
    
    city_name = city_data.get('meta', {}).get('name', slug.replace('-', ' ').title())
    
    # Generate video prompt
    prompt = generate_video_prompt(city_name, city_data)
    
    # Save prompt
    prompt_path = output_dir / f"{slug}-prompt.txt"
    with open(prompt_path, 'w') as f:
        f.write(prompt)
    print(f"📝 Saved prompt to {prompt_path}")
    
    # Generate video
    video_path = output_dir / f"{slug}.mp4"
    result = generate_text_to_video(prompt, str(video_path), city_name)
    
    if result:
        print(f"\n" + "="*60)
        print(f"🎉 SUCCESS!")
        print(f"="*60)
        print(f"\n📁 Output files:")
        print(f"   📝 Prompt: {prompt_path}")
        print(f"   🎬 Video:  {video_path}")
        print(f"\n💡 Next steps:")
        print(f"   1. Add text overlay with weather data")
        print(f"   2. Add voiceover or music")
        print(f"   3. Upload to YouTube Shorts")
        return {'video': video_path, 'prompt': prompt_path}
    
    return None

if __name__ == "__main__":
    import sys
    
    # Get city from command line or default to tokyo
    city = sys.argv[1] if len(sys.argv) > 1 else "tokyo"
    
    result = create_short(city)
    
    if not result:
        print(f"\n❌ Generation failed. Check your Replicate API credits.")
        print(f"   Visit: https://replicate.com/account/billing")
