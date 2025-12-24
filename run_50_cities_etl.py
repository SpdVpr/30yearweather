"""
MASTER ETL SCRIPT - Add 50 New Trending Cities
===============================================
This script orchestrates the complete ETL process:
1. Patch config files with new cities
2. Download all raw data (health, holidays, flights)
3. Run main weather ETL
4. Generate tourism data
5. Generate hero images
6. Convert to WebP

Run with: python run_50_cities_etl.py
"""

import os
import sys
import subprocess
import time
from datetime import datetime, timedelta
import shutil

# Configuration
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, 'backend')
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, 'scripts')

# Import new cities data
sys.path.insert(0, PROJECT_ROOT)
from add_50_trending_cities import NEW_CITIES, AIRPORT_CODES_NEW, COUNTRY_CODES_NEW

def log(message, level="INFO"):
    """Print timestamped log message"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    icons = {"INFO": "ℹ️", "OK": "✅", "WARN": "⚠️", "ERROR": "❌", "RUN": "🚀"}
    icon = icons.get(level, "•")
    print(f"[{timestamp}] {icon} {message}")

def run_command(cmd, cwd=None, check=True):
    """Run a command and return success status"""
    log(f"Running: {cmd}", "RUN")
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd or PROJECT_ROOT,
            capture_output=False,
            text=True
        )
        if check and result.returncode != 0:
            log(f"Command failed with code {result.returncode}", "ERROR")
            return False
        return True
    except Exception as e:
        log(f"Command error: {e}", "ERROR")
        return False

def patch_config():
    """Add new cities to backend/config.py"""
    log("=" * 60)
    log("STEP 1: Patching config.py with 50 new cities")
    log("=" * 60)
    
    config_path = os.path.join(BACKEND_DIR, 'config.py')
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = config_path.replace('.py', f'_backup_{timestamp}.py')
    shutil.copy2(config_path, backup_path)
    log(f"Created backup: {backup_path}", "OK")
    
    with open(config_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check which cities already exist
    existing_count = 0
    new_count = 0
    
    cities_to_add = []
    for slug, city in NEW_CITIES.items():
        if f"'{slug}':" in content or f'"{slug}":' in content:
            log(f"  ⏭️  {slug} already exists", "WARN")
            existing_count += 1
        else:
            cities_to_add.append((slug, city))
            new_count += 1
    
    if not cities_to_add:
        log("All cities already exist in config.py", "OK")
        return True
    
    # Generate code for new cities
    new_code = f"\n    # ========== 50 NEW TRENDING CITIES - Added {datetime.now().strftime('%Y-%m-%d')} ==========\n"
    for slug, city in cities_to_add:
        new_code += f"    '{slug}': {{\n"
        new_code += f'        "name": "{city["name"]}",\n'
        new_code += f'        "country": "{city["country"]}",\n'
        new_code += f'        "lat": {city["lat"]},\n'
        new_code += f'        "lon": {city["lon"]},\n'
        new_code += f'        "is_coastal": {city["is_coastal"]},\n'
        new_code += f'        "timezone": "{city["timezone"]}",\n'
        new_code += f'        "desc": "{city["desc"]}"\n'
        new_code += f"    }},\n"
    
    # Find LOCATIONS dict and insert
    import re
    match = re.search(r'LOCATIONS\s*=\s*\{', content)
    if not match:
        log("Could not find LOCATIONS in config.py!", "ERROR")
        return False
    
    # Find closing brace
    start_pos = match.end()
    brace_count = 1
    insert_pos = start_pos
    
    for i, char in enumerate(content[start_pos:], start=start_pos):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                insert_pos = i
                break
    
    # Insert new cities
    new_content = content[:insert_pos] + new_code + content[insert_pos:]
    
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    log(f"Added {new_count} new cities to config.py ({existing_count} already existed)", "OK")
    return True

def patch_airport_codes():
    """Add new airport codes to backend/airport_codes.py"""
    log("Patching airport_codes.py")
    
    airport_path = os.path.join(BACKEND_DIR, 'airport_codes.py')
    
    with open(airport_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check which codes already exist
    codes_to_add = []
    for slug, icao in AIRPORT_CODES_NEW.items():
        if f"'{slug}':" in content:
            continue
        codes_to_add.append((slug, icao))
    
    if not codes_to_add:
        log("All airport codes already exist", "OK")
        return True
    
    # Generate new codes
    new_code = f"\n    # ========== 50 NEW TRENDING CITIES - Added {datetime.now().strftime('%Y-%m-%d')} ==========\n"
    for slug, icao in codes_to_add:
        new_code += f"    '{slug}': '{icao}',\n"
    
    # Find AIRPORT_CODES dict
    import re
    match = re.search(r'AIRPORT_CODES\s*=\s*\{', content)
    if not match:
        log("Could not find AIRPORT_CODES!", "ERROR")
        return False
    
    start_pos = match.end()
    brace_count = 1
    insert_pos = start_pos
    
    for i, char in enumerate(content[start_pos:], start=start_pos):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                insert_pos = i
                break
    
    new_content = content[:insert_pos] + new_code + content[insert_pos:]
    
    with open(airport_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    log(f"Added {len(codes_to_add)} new airport codes", "OK")
    return True

def download_raw_data():
    """Download all raw data needed for ETL"""
    log("=" * 60)
    log("STEP 2: Downloading raw data")
    log("=" * 60)
    
    steps = [
        ("Health data (CDC)", "python download_health_cdc.py"),
        ("Holiday data", "python scripts/download_holidays.py"),
        ("Flight seasonality data", "python download_seasonal_flights.py"),
    ]
    
    for name, cmd in steps:
        log(f"Downloading: {name}")
        if not run_command(cmd, check=False):
            log(f"Warning: {name} download had issues (continuing)", "WARN")
        else:
            log(f"{name} complete", "OK")
    
    return True

def run_weather_etl():
    """Run main weather ETL pipeline"""
    log("=" * 60)
    log("STEP 3: Running Weather ETL (30 years of data)")
    log("=" * 60)
    log("⏳ This may take 30-60 minutes for 50 cities...")
    
    return run_command("python backend/etl.py", check=False)

def run_tourism_etl():
    """Run tourism data ETL"""
    log("=" * 60)
    log("STEP 4: Running Tourism ETL")
    log("=" * 60)
    
    return run_command("python fix_missing_tourism.py", check=False)

def generate_hero_images():
    """Generate AI hero images for new cities"""
    log("=" * 60)
    log("STEP 5: Generating Hero Images")
    log("=" * 60)
    
    # First check if script exists
    script_path = os.path.join(SCRIPTS_DIR, 'generate_50_new_heroes.py')
    if not os.path.exists(script_path):
        log("Hero image script not found, creating template", "WARN")
        create_hero_generator_script()
    
    return run_command("python scripts/generate_50_new_heroes.py", check=False)

def create_hero_generator_script():
    """Create hero image generator script if missing"""
    script_content = '''"""
Generate hero images for new trending cities using Ideogram API
"""
import os
import sys
import requests
import time
from dotenv import load_dotenv

load_dotenv()

# Add parent directory for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from add_50_trending_cities import NEW_CITIES

IDEOGRAM_API_KEY = os.getenv('IDEOGRAM_API_KEY')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'images')

def generate_hero(slug, city_data):
    """Generate a hero image for a city"""
    output_path = os.path.join(OUTPUT_DIR, f"{slug}-hero.png")
    
    if os.path.exists(output_path):
        print(f"  ⏭️  {slug}-hero.png already exists")
        return True
    
    if not IDEOGRAM_API_KEY:
        print("  ❌ IDEOGRAM_API_KEY not set")
        return False
    
    prompt = f"Cinematic aerial cityscape of {city_data['name']}, {city_data['country']}, iconic landmarks, golden hour lighting, warm travel photography tones, 8k professional photo, vibrant colors"
    
    try:
        response = requests.post(
            "https://api.ideogram.ai/generate",
            headers={
                "Api-Key": IDEOGRAM_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "image_request": {
                    "prompt": prompt,
                    "aspect_ratio": "ASPECT_16_9",
                    "model": "V_2",
                    "magic_prompt_option": "AUTO"
                }
            },
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                image_url = data['data'][0].get('url')
                if image_url:
                    img_response = requests.get(image_url, timeout=60)
                    if img_response.status_code == 200:
                        with open(output_path, 'wb') as f:
                            f.write(img_response.content)
                        print(f"  ✅ Generated {slug}-hero.png")
                        return True
        
        print(f"  ❌ Failed to generate {slug}")
        return False
        
    except Exception as e:
        print(f"  ❌ Error generating {slug}: {e}")
        return False

def main():
    print("=" * 60)
    print("🖼️  GENERATING HERO IMAGES FOR 50 NEW CITIES")
    print("=" * 60)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    success = 0
    failed = 0
    skipped = 0
    
    for slug, city_data in NEW_CITIES.items():
        output_path = os.path.join(OUTPUT_DIR, f"{slug}-hero.png")
        if os.path.exists(output_path):
            skipped += 1
            continue
            
        if generate_hero(slug, city_data):
            success += 1
        else:
            failed += 1
        
        # Rate limiting
        time.sleep(2)
    
    print(f"\\n{'='*60}")
    print(f"Generated: {success}, Failed: {failed}, Skipped: {skipped}")
    print("=" * 60)

if __name__ == "__main__":
    main()
'''
    
    script_path = os.path.join(SCRIPTS_DIR, 'generate_50_new_heroes.py')
    os.makedirs(SCRIPTS_DIR, exist_ok=True)
    
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    log(f"Created hero generator script: {script_path}", "OK")

def convert_to_webp():
    """Convert PNG images to WebP"""
    log("=" * 60)
    log("STEP 6: Converting PNG to WebP")
    log("=" * 60)
    
    return run_command("python convert_heroes_to_webp.py", check=False)

def verify_results():
    """Verify the ETL results"""
    log("=" * 60)
    log("VERIFICATION: Checking results")
    log("=" * 60)
    
    public_data = os.path.join(PROJECT_ROOT, 'public', 'data')
    public_images = os.path.join(PROJECT_ROOT, 'public', 'images')
    tourism_data = os.path.join(BACKEND_DIR, 'data', 'tourism')
    
    # Count new city JSONs
    json_count = 0
    missing_jsons = []
    for slug in NEW_CITIES.keys():
        json_path = os.path.join(public_data, f"{slug}.json")
        if os.path.exists(json_path):
            json_count += 1
        else:
            missing_jsons.append(slug)
    
    log(f"Weather JSONs: {json_count}/{len(NEW_CITIES)} generated", "OK" if json_count == len(NEW_CITIES) else "WARN")
    
    # Count images
    image_count = 0
    for slug in NEW_CITIES.keys():
        if os.path.exists(os.path.join(public_images, f"{slug}-hero.webp")):
            image_count += 1
        elif os.path.exists(os.path.join(public_images, f"{slug}-hero.png")):
            image_count += 1
    
    log(f"Hero images: {image_count}/{len(NEW_CITIES)} generated", "OK" if image_count == len(NEW_CITIES) else "WARN")
    
    # Count tourism data
    tourism_count = 0
    for slug in NEW_CITIES.keys():
        if os.path.exists(os.path.join(tourism_data, f"{slug}_tourism.json")):
            tourism_count += 1
    
    log(f"Tourism data: {tourism_count}/{len(NEW_CITIES)} generated", "OK" if tourism_count == len(NEW_CITIES) else "WARN")
    
    if missing_jsons:
        log(f"Missing JSONs: {', '.join(missing_jsons[:10])}{'...' if len(missing_jsons) > 10 else ''}", "WARN")
    
    return json_count > 0

def main():
    start_time = time.time()
    
    print("\n" + "=" * 70)
    print("🌍 30YearWeather - 50 NEW TRENDING CITIES ETL PIPELINE")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Cities to add: {len(NEW_CITIES)}")
    print("=" * 70 + "\n")
    
    # Step 1: Patch config files
    if not patch_config():
        log("Failed to patch config.py", "ERROR")
        return 1
    
    if not patch_airport_codes():
        log("Failed to patch airport_codes.py (continuing)", "WARN")
    
    # Step 2: Download raw data
    download_raw_data()
    
    # Step 3: Run Weather ETL
    run_weather_etl()
    
    # Step 4: Run Tourism ETL
    run_tourism_etl()
    
    # Step 5: Generate hero images (optional - requires API key)
    generate_hero_images()
    
    # Step 6: Convert to WebP
    convert_to_webp()
    
    # Verify
    verify_results()
    
    # Summary
    elapsed = time.time() - start_time
    elapsed_str = str(timedelta(seconds=int(elapsed)))
    
    print("\n" + "=" * 70)
    print("🎉 ETL PIPELINE COMPLETE!")
    print("=" * 70)
    print(f"Total time: {elapsed_str}")
    print("\nNext steps:")
    print("  1. Run: npm run dev")
    print("  2. Verify new cities at http://localhost:3000")
    print("  3. Commit changes: git add . && git commit -m 'Add 50 new cities'")
    print("=" * 70)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
