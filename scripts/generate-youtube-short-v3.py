"""
YouTube Shorts Generator v3 - ByteDance Seedance
Model: bytedance/seedance-1-lite
Output: 9:16 (vertical), 720p, 10 seconds
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
    country = meta.get('country', '')
    
    # City-specific scenes for engaging Shorts
    city_scenes = {
        'tokyo': 'Walking through neon-lit Shibuya crossing at night, crowds of people, Japanese signs, rain reflections on street',
        'paris': 'Walking along Seine river at sunset, Eiffel Tower in background, romantic atmosphere, golden light',
        'bali': 'Walking through lush green rice terraces, palm trees swaying, tropical paradise, golden hour light',
        'london': 'Walking across Tower Bridge at sunset, Thames river below, iconic London skyline',
        'dubai': 'Walking through Dubai Marina at dusk, Burj Khalifa visible, modern skyscrapers, luxury atmosphere',
        'new-york': 'Walking through Times Square at night, bright billboards, yellow taxis, urban energy',
        'barcelona': 'Walking down La Rambla street, colorful buildings, Mediterranean vibes, sunny day',
        'rome': 'Walking past the Colosseum at golden hour, ancient ruins, tourists admiring, warm light',
        'sydney': 'Walking along Circular Quay with Opera House view, harbour boats, sunny day, blue sky',
        'prague': 'Walking across Charles Bridge at sunrise, statues silhouettes, Prague Castle in background, misty morning',
        'santorini': 'Walking through white and blue Greek village streets, ocean view, sunset colors, romantic',
        'bangkok': 'Walking through vibrant Thai night market, street food stalls, neon signs, busy atmosphere',
    }
    
    scene = city_scenes.get(city_name.lower().replace(' ', '-'), 
                            f'Walking through beautiful streets of {city_name}, iconic landmarks visible, travel documentary style')
    
    # Create engaging first-person style prompt
    prompt = f"{scene}, cinematic POV shot, smooth camera movement, professional travel video, 4K quality, vibrant colors"
    
    return prompt

def generate_seedance_video(prompt: str, output_path: str, city_name: str):
    """Generate video using ByteDance Seedance-1-Lite"""
    print(f"🎬 Generating video for {city_name}...")
    print(f"📝 Prompt: {prompt[:80]}...")
    print(f"⚙️  Settings: 9:16, 720p, 10 seconds, 24fps")
    
    client = replicate.Client(api_token=REPLICATE_API_TOKEN)
    
    try:
        output = client.run(
            "bytedance/seedance-1-lite",
            input={
                "fps": 24,
                "prompt": prompt,
                "duration": 10,
                "resolution": "720p",
                "aspect_ratio": "9:16",
                "camera_fixed": False,
            }
        )
        
        if output:
            video_url = str(output)
            print(f"📥 Downloading video...")
            response = requests.get(video_url)
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            file_size = os.path.getsize(output_path)
            print(f"✅ Success! Saved {file_size/1024/1024:.1f} MB")
            return output_path
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    return None

def create_short(slug: str):
    """Create a YouTube Short for a city"""
    print(f"\n{'='*60}")
    print(f"🎬 YOUTUBE SHORT: {slug.upper()}")
    print(f"   Model: ByteDance Seedance-1-Lite")
    print(f"   Format: 9:16 vertical, 720p, 10 seconds")
    print(f"{'='*60}\n")
    
    # Setup paths
    output_dir = Path("output/youtube-shorts-v3")
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
    
    # Generate video
    video_path = output_dir / f"{slug}.mp4"
    result = generate_seedance_video(prompt, str(video_path), city_name)
    
    if result:
        print(f"\n{'='*60}")
        print(f"🎉 SUCCESS!")
        print(f"{'='*60}")
        print(f"\n📁 Files:")
        print(f"   🎬 {video_path}")
        print(f"   📝 {prompt_path}")
        print(f"\n💡 Next: Add text overlay with weather data in CapCut")
        return {'video': video_path, 'prompt': prompt_path}
    
    return None

if __name__ == "__main__":
    import sys
    
    city = sys.argv[1] if len(sys.argv) > 1 else "tokyo"
    result = create_short(city)
    
    if not result:
        print(f"\n❌ Failed. Check Replicate credits: https://replicate.com/account/billing")
