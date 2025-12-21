"""
YouTube Shorts Generator using Replicate API
- Animates hero images using Stable Video Diffusion
- Adds text overlays
- Generates AI voiceover
"""

import replicate
import requests
import os
import json
from pathlib import Path

# Replicate API setup
REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")

def get_city_data(slug: str) -> dict:
    """Load city data from JSON"""
    data_path = Path(f"public/data/{slug}.json")
    if data_path.exists():
        with open(data_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def generate_script(city_data: dict, slug: str) -> dict:
    """Generate video script from city data"""
    meta = city_data.get('meta', {})
    yearly = city_data.get('yearly_stats', {})
    days = city_data.get('days', {})
    
    city_name = meta.get('name', slug.replace('-', ' ').title())
    
    # Find best months (highest wedding scores)
    MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    
    monthly_scores = {}
    for key, day in days.items():
        month = int(key.split('-')[0])
        score = day.get('scores', {}).get('wedding', 50)
        if month not in monthly_scores:
            monthly_scores[month] = []
        monthly_scores[month].append(score)
    
    avg_scores = {m: sum(s)/len(s) for m, s in monthly_scores.items()}
    sorted_months = sorted(avg_scores.items(), key=lambda x: x[1], reverse=True)
    best_month = MONTH_NAMES[sorted_months[0][0] - 1]
    worst_month = MONTH_NAMES[sorted_months[-1][0] - 1]
    
    # Get temperature data
    avg_temp = yearly.get('avg_temp_annual', 20)
    hottest = MONTH_NAMES[yearly.get('hottest_month', 7) - 1]
    coldest = MONTH_NAMES[yearly.get('coldest_month', 1) - 1]
    wettest = MONTH_NAMES[yearly.get('wettest_month', 6) - 1]
    
    return {
        'city_name': city_name,
        'hook': f"Planning a trip to {city_name}? Here's what 30 years of weather data tells us!",
        'best_month': best_month,
        'worst_month': worst_month,
        'avg_temp': round(avg_temp),
        'hottest': hottest,
        'coldest': coldest,
        'wettest': wettest,
        'voiceover': f"""
Planning a trip to {city_name}? 
Based on 30 years of NASA weather data, the best time to visit is {best_month}.
Avoid {wettest} if you don't like rain.
The hottest month is {hottest}, coldest is {coldest}.
Average temperature is around {round(avg_temp)} degrees.
Check out 30 year weather dot com for the full 365-day forecast!
        """.strip()
    }

def animate_image(image_path: str, output_path: str):
    """Use Replicate's Stable Video Diffusion to animate an image"""
    print(f"🎬 Animating {image_path}...")
    
    client = replicate.Client(api_token=REPLICATE_API_TOKEN)
    
    # Read image and upload
    with open(image_path, 'rb') as f:
        image_data = f.read()
    
    # Use Stable Video Diffusion
    output = client.run(
        "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
        input={
            "input_image": open(image_path, "rb"),
            "video_length": "25_frames_with_svd_xt",  # ~4 seconds
            "sizing_strategy": "maintain_aspect_ratio",
            "frames_per_second": 6,
            "motion_bucket_id": 40,  # Lower = less motion
            "cond_aug": 0.02,
        }
    )
    
    # Download video
    if output:
        video_url = output
        print(f"📥 Downloading video from {video_url}...")
        response = requests.get(video_url)
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f"✅ Saved to {output_path}")
        return output_path
    
    return None

def generate_voiceover(text: str, output_path: str):
    """Generate AI voiceover using Replicate TTS"""
    print(f"🎤 Generating voiceover...")
    
    client = replicate.Client(api_token=REPLICATE_API_TOKEN)
    
    # Use Kokoro TTS (simpler, no speaker sample needed)
    try:
        output = client.run(
            "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
            input={
                "text": text,
                "speed": 1.0,
                "voice": "af_sarah",
            }
        )
        
        if output:
            print(f"📥 Downloading voiceover...")
            response = requests.get(output)
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Saved to {output_path}")
            return output_path
    except Exception as e:
        print(f"⚠️ Voiceover generation failed: {e}")
        print(f"   You can add voiceover manually later.")
    
    return None

def create_short(slug: str):
    """Create a complete YouTube Short for a city"""
    print(f"\n{'='*50}")
    print(f"🎬 Creating YouTube Short for: {slug}")
    print(f"{'='*50}\n")
    
    # Setup paths
    output_dir = Path("output/youtube-shorts")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    hero_path = Path(f"public/images/{slug}-hero.png")
    if not hero_path.exists():
        hero_path = Path(f"public/images/{slug}-hero.webp")
    
    if not hero_path.exists():
        print(f"❌ No hero image found for {slug}")
        return None
    
    # Load city data and generate script
    city_data = get_city_data(slug)
    if not city_data:
        print(f"❌ No data found for {slug}")
        return None
    
    script = generate_script(city_data, slug)
    print(f"📝 Script generated:")
    print(f"   Hook: {script['hook']}")
    print(f"   Best month: {script['best_month']}")
    print(f"   Worst for rain: {script['wettest']}")
    
    # Save script
    script_path = output_dir / f"{slug}-script.json"
    with open(script_path, 'w') as f:
        json.dump(script, f, indent=2)
    
    # Generate animated video
    video_path = output_dir / f"{slug}-animated.mp4"
    animate_image(str(hero_path), str(video_path))
    
    # Generate voiceover
    audio_path = output_dir / f"{slug}-voiceover.wav"
    generate_voiceover(script['voiceover'], str(audio_path))
    
    print(f"\n✅ Generated files:")
    print(f"   📝 Script: {script_path}")
    print(f"   🎬 Video: {video_path}")
    print(f"   🎤 Audio: {audio_path}")
    
    return {
        'script': script_path,
        'video': video_path,
        'audio': audio_path
    }

if __name__ == "__main__":
    # Test with Tokyo
    result = create_short("tokyo")
    
    if result:
        print(f"\n🎉 SUCCESS!")
        print(f"\nNext steps:")
        print(f"1. Combine video + audio using FFmpeg or video editor")
        print(f"2. Add text overlays")
        print(f"3. Upload to YouTube Shorts!")
