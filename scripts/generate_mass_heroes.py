
import requests
import os
import time
import json

# Configuration
API_KEY = "ZZYYK-I_5-AUne-V2k5YOA0O8UIBAJGDx51CgiTekioQ61VekIsU3ZL9FQAKg8UfHD8ny5jWgKxqMmEm-HdTxg"
API_URL = "https://api.ideogram.ai/generate"

# Project Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "images")

# CITIES & PROMPTS
CITIES_PROMPTS = {
    # EUROPE
    "hamburg-hero.png": "Cinematic cityscape photo of Hamburg, Germany, Speicherstadt warehouse district with canals and brick bridges at twilight, warm lighting, water reflections, high quality, photorealistic, 1024x1024",
    "seville-hero.png": "Cinematic cityscape photo of Seville, Spain, Plaza de España with iconic architecture and canal, golden hour sunlight, detailed, photorealistic, 1024x1024",
    "naples-hero.png": "Cinematic cityscape photo of Naples, Italy, vibrant colorful buildings with Mount Vesuvius looming in the background, bay of Naples, sunny day, high quality, photorealistic, 1024x1024",
    "valletta-hero.png": "Cinematic cityscape photo of Valletta, Malta, Grand Harbour with historic limestone fortifications and blue dome, mediterranean sea, sunny, high quality, photorealistic, 1024x1024",
    "rhodes-hero.png": "Cinematic cityscape photo of Rhodes, Greece, Medieval Old Town with Palace of the Grand Master, stone streets, historic atmosphere, sunny, high quality, photorealistic, 1024x1024",
    "sofia-hero.png": "Cinematic cityscape photo of Sofia, Bulgaria, Alexander Nevsky Cathedral with golden domes shining, dramatic sky, high quality, photorealistic, 1024x1024",
    "riga-hero.png": "Cinematic cityscape photo of Riga, Latvia, House of the Blackheads in Old Town Square, dutch renaissance architecture, evening lighting, high quality, photorealistic, 1024x1024",

    # NORTH AMERICA
    "chicago-hero.png": "Cinematic cityscape photo of Chicago, USA, skyline along Lake Michigan, riverwalk, modern skyscrapers, clear day, high quality, photorealistic, 1024x1024",
    "boston-hero.png": "Cinematic cityscape photo of Boston, USA, historic Acorn Street with cobblestones and red brick row houses, Beacon Hill, charming atmosphere, high quality, photorealistic, 1024x1024",
    "las-vegas-hero.png": "Cinematic cityscape photo of Las Vegas, USA, The Strip at night with neon lights, Bellagio fountains, vibrant energy, high quality, photorealistic, 1024x1024",
    "honolulu-hero.png": "Cinematic cityscape photo of Honolulu, Hawaii, Waikiki Beach with Diamond Head crater in background, turquoise ocean, palm trees, sunny, high quality, photorealistic, 1024x1024",
    "montreal-hero.png": "Cinematic cityscape photo of Montreal, Canada, Old Montreal with cobblestone streets and European architecture, port area, soft light, high quality, photorealistic, 1024x1024",
    "calgary-hero.png": "Cinematic cityscape photo of Calgary, Canada, modern skyline with snow-capped Canadian Rockies in the distance, Bow River, clear day, high quality, photorealistic, 1024x1024",
    "new-orleans-hero.png": "Cinematic cityscape photo of New Orleans, USA, French Quarter with iron balconies, vibrant street scene, jazz atmosphere, warm colors, high quality, photorealistic, 1024x1024",

    # SOUTH AMERICA
    "bogota-hero.png": "Cinematic cityscape photo of Bogota, Colombia, sprawling city nestled in the Andes mountains, viewed from Monserrate, cloudy dramatic sky, high quality, photorealistic, 1024x1024",
    "sao-paulo-hero.png": "Cinematic cityscape photo of Sao Paulo, Brazil, Octavio Frias de Oliveira Bridge (Estaiada) at night, dense skyscraper skyline, modern metropolis, high quality, photorealistic, 1024x1024",
    "quito-hero.png": "Cinematic cityscape photo of Quito, Ecuador, historic center with colonial churches, Pichincha volcano in background, mountain setting, high quality, photorealistic, 1024x1024",
    "cusco-hero.png": "Cinematic cityscape photo of Cusco, Peru, Plaza de Armas with colonial architecture and Andes mountains backdrop, historic inca capital, high quality, photorealistic, 1024x1024",
    "san-jose-cr-hero.png": "Cinematic cityscape photo of San Jose, Costa Rica, city valley surrounded by lush green mountains and volcanoes, tropical atmosphere, high quality, photorealistic, 1024x1024",

    # ASIA
    "sapporo-hero.png": "Cinematic cityscape photo of Sapporo, Japan, Odori Park with TV Tower, winter snow festival atmosphere or crisp clear day, urban park, high quality, photorealistic, 1024x1024",
    "busan-hero.png": "Cinematic cityscape photo of Busan, South Korea, Haeundae Beach with modern skyscrapers along the coast, blue ocean, sunny, high quality, photorealistic, 1024x1024",
    "chengdu-hero.png": "Cinematic cityscape photo of Chengdu, China, Anshun Bridge over Jinjiang River at night, illuminated traditional architecture, reflections, high quality, photorealistic, 1024x1024",
    "kathmandu-hero.png": "Cinematic cityscape photo of Kathmandu, Nepal, Boudhanath Stupa with fluttering prayer flags, Himalayas visible in distance, cultural atmosphere, high quality, photorealistic, 1024x1024",
    "colombo-hero.png": "Cinematic cityscape photo of Colombo, Sri Lanka, Lotus Tower rising above the city skyline, coastal view, tropical urban, high quality, photorealistic, 1024x1024",
    "almaty-hero.png": "Cinematic cityscape photo of Almaty, Kazakhstan, Zenkov Cathedral in Panfilov Park with Trans-Ili Alatau mountains in background, high quality, photorealistic, 1024x1024",
    "tashkent-hero.png": "Cinematic cityscape photo of Tashkent, Uzbekistan, Hazrati Imam complex with traditional blue domes and minarets, sunny day, high quality, photorealistic, 1024x1024",
    "fukuoka-hero.png": "Cinematic cityscape photo of Fukuoka, Japan, city skyline along the river at twilight, modern architecture mixed with shrines, high quality, photorealistic, 1024x1024",

    # MIDDLE EAST
    "abu-dhabi-hero.png": "Cinematic cityscape photo of Abu Dhabi, UAE, Sheikh Zayed Grand Mosque with pristine white domes and reflection pools, blue sky, high quality, photorealistic, 1024x1024",
    "doha-hero.png": "Cinematic cityscape photo of Doha, Qatar, futuristic West Bay skyline seen from the Corniche, Museum of Islamic Art, blue water, high quality, photorealistic, 1024x1024",
    "tel-aviv-hero.png": "Cinematic cityscape photo of Tel Aviv, Israel, Mediterranean beach with city skyline, Bauhaus architecture, sunny coastal vibe, high quality, photorealistic, 1024x1024",
    "muscat-hero.png": "Cinematic cityscape photo of Muscat, Oman, Corniche with white buildings and rocky mountains meeting the sea, traditional dhow boats, high quality, photorealistic, 1024x1024",

    # AFRICA
    "cairo-hero.png": "Cinematic cityscape photo of Cairo, Egypt, view towards the Pyramids of Giza in the hazy distance with Nile river in foreground, golden light, high quality, photorealistic, 1024x1024",
    "johannesburg-hero.png": "Cinematic cityscape photo of Johannesburg, South Africa, Hillbrow Tower and city skyline at sunset, golden urban glow, high quality, photorealistic, 1024x1024",
    "nairobi-hero.png": "Cinematic cityscape photo of Nairobi, Kenya, city skyline rising above the grass of Nairobi National Park, unique nature-urban contrast, high quality, photorealistic, 1024x1024",
    "casablanca-hero.png": "Cinematic cityscape photo of Casablanca, Morocco, Hassan II Mosque standing on the edge of the Atlantic Ocean, dramatic architecture, high quality, photorealistic, 1024x1024",

    # OCEANIA
    "brisbane-hero.png": "Cinematic cityscape photo of Brisbane, Australia, Story Bridge spanning the Brisbane River, city skyline, twilight, high quality, photorealistic, 1024x1024",
    "perth-hero.png": "Cinematic cityscape photo of Perth, Australia, skyline viewed from Kings Park with Swan River, sunny day, blue sky, high quality, photorealistic, 1024x1024",
    "christchurch-hero.png": "Cinematic cityscape photo of Christchurch, New Zealand, Avon River winding through botanical gardens, English style architecture, mountains in background, high quality, photorealistic, 1024x1024",
    "nadi-hero.png": "Cinematic cityscape photo of Nadi, Fiji, tropical coastline with palm trees, blue lagoon, distant mountains, resort paradise, high quality, photorealistic, 1024x1024",
    "papeete-hero.png": "Cinematic cityscape photo of Papeete, Tahiti, tropical harbor with lush green volcanic mountains in background, boats, pacific island vibe, high quality, photorealistic, 1024x1024"
}

def generate_image(prompt, filename):
    print(f"🎨 Generating {filename}...")
    
    # Try with both headers initially or stick to logic that worked.
    # Logic in generate_city_hero.py:
    # 1. Start with BOTH keys present? No, line 21 overwrites line 19 if dictionary assignment... oh wait.
    # In generate_city_hero.py:
    # headers = { "Api-Key": ..., "Authorization": ... } 
    # It sends INPUTS.
    
    headers = {
        "Api-Key": API_KEY, 
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "image_request": {
            "prompt": prompt,
            "aspect_ratio": "ASPECT_1_1", 
            "model": "V_2", 
            "magic_prompt": "AUTO"
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        
        # 404 Fallback
        if response.status_code == 404:
             print("Standard endpoint 404, trying v1/ideogram-v3/generate...")
             alt_url = "https://api.ideogram.ai/v1/ideogram-v3/generate"
             response = requests.post(alt_url, headers=headers, json=payload)

        if response.status_code != 200:
             print(f"❌ Error {response.status_code}: {response.text}")
             
             # 401 Fallback: Try ONLY Api-Key
             if response.status_code == 401:
                 print("Trying Api-Key header only...")
                 headers.pop("Authorization", None)
                 headers["Api-Key"] = API_KEY
                 response = requests.post(API_URL, headers=headers, json=payload)
                 
                 # 429 Check inside fallback
                 if response.status_code == 429:
                     print("⏳ Rate Limit! Waiting 30s...")
                     time.sleep(30)
                     return False
             
             # 429 Check (original request)
             if response.status_code == 429:
                 print("⏳ Rate Limit! Waiting 30s...")
                 time.sleep(30)
                 return False
                 
             if response.status_code != 200:
                  return False

        result = response.json()
        
        if "data" in result and len(result["data"]) > 0:
            image_url = result["data"][0]["url"]
            
            # Download
            img_data = requests.get(image_url).content
            output_path = os.path.join(OUTPUT_DIR, filename)
            
            with open(output_path, "wb") as f:
                f.write(img_data)
            print(f"✅ Saved to {output_path}")
            return True
        else:
            print("❌ No image data found.")
            return False

    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("==================================================")
    print(f"🖼️  GENERATING HERO IMAGES FOR {len(CITIES_PROMPTS)} CITIES")
    print("==================================================")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for filename, prompt in CITIES_PROMPTS.items():
        # Check if exists (check for .webp too, as we convert usually)
        # But here we generate png.
        # Check if target PNG or converted WEBP exists.
        base_name = filename.replace('.png', '')
        webp_path = os.path.join(OUTPUT_DIR, f"{base_name}.webp")
        png_path = os.path.join(OUTPUT_DIR, filename)
        
        if os.path.exists(webp_path):
             print(f"⏭️  Skipping {filename} - WebP already exists.")
             continue
        if os.path.exists(png_path):
             print(f"⏭️  Skipping {filename} - PNG already exists.")
             continue

        success = generate_image(prompt, filename)
        if success:
            # Automatic conversion to WebP?
            # User workflow usually runs conversion separately. 
            # But let's be nice and try to convert if script exists.
            pass
            
        time.sleep(2) # Politeness delay

    print("\n✅ All generation tasks completed.")
    print("👉 Now run: python convert_heroes_to_webp.py to convert all PNGs!")

if __name__ == "__main__":
    main()
