
import requests
import os
import time
import json
from dotenv import load_dotenv

# Load environment variables from .env file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Configuration
API_KEY = os.getenv("IDEOGRAM_API_KEY")
API_URL = "https://api.ideogram.ai/generate"

# Project Paths
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "images")

# 50 NEW CITIES PROMPTS - December 2023 Expansion
CITIES_PROMPTS = {
    # EUROPE (14 cities)
    "florence-hero.png": "Cinematic aerial cityscape photo of Florence Italy at golden hour, Duomo cathedral dome prominent, Ponte Vecchio bridge, Arno River, Tuscany hills in background, warm Mediterranean tones, premium travel photography, 8k photorealistic",
    "malaga-hero.png": "Cinematic coastal cityscape photo of Malaga Spain, Alcazaba fortress overlooking the Mediterranean, Costa del Sol beaches, palm trees, sunny blue sky, warm colors, premium travel photography, 8k photorealistic",
    "marseille-hero.png": "Cinematic aerial cityscape photo of Marseille France, Old Port Vieux-Port with colorful boats, Notre-Dame de la Garde basilica on the hill, Mediterranean Sea, golden hour, premium travel photography, 8k photorealistic",
    "bordeaux-hero.png": "Cinematic cityscape photo of Bordeaux France, Place de la Bourse with Water Mirror reflection, historic wine region architecture, Garonne River, elegant stone buildings, twilight, premium travel photography, 8k photorealistic",
    "thessaloniki-hero.png": "Cinematic coastal cityscape photo of Thessaloniki Greece, White Tower landmark on the waterfront, Byzantine churches, Aegean Sea, vibrant promenade, sunset colors, premium travel photography, 8k photorealistic",
    "tallinn-hero.png": "Cinematic aerial cityscape photo of Tallinn Estonia, medieval Old Town with red rooftops and church spires, Toompea Castle, Baltic Sea harbor, colorful facades, sunny day, premium travel photography, 8k photorealistic",
    "bergen-hero.png": "Cinematic cityscape photo of Bergen Norway, colorful wooden Bryggen wharf houses, surrounded by seven mountains, Norwegian fjords, dramatic sky, Nordic atmosphere, premium travel photography, 8k photorealistic",
    "salzburg-hero.png": "Cinematic cityscape photo of Salzburg Austria, Hohensalzburg Fortress on the hill, Salzach River, baroque domes, Austrian Alps backdrop, Mozart birthplace city, twilight, premium travel photography, 8k photorealistic",
    "bologna-hero.png": "Cinematic cityscape photo of Bologna Italy, Two Towers Asinelli and Garisenda, terracotta rooftops, medieval porticos, Piazza Maggiore, warm Italian light, premium travel photography, 8k photorealistic",
    "san-sebastian-hero.png": "Cinematic coastal cityscape photo of San Sebastian Spain, La Concha Beach with crescent bay, Monte Urgull, Basque Country architecture, golden sand, blue ocean, sunny day, premium travel photography, 8k photorealistic",
    "split-hero.png": "Cinematic coastal cityscape photo of Split Croatia, Diocletian's Palace ancient walls, Dalmatian coast waterfront, Riva promenade, Adriatic Sea, historic stone architecture, sunny Mediterranean, premium travel photography, 8k photorealistic",
    "mykonos-hero.png": "Cinematic coastal cityscape photo of Mykonos Greece, iconic white windmills on the hill, blue domed churches, Little Venice waterfront, Aegean Sea, whitewashed buildings, sunset, premium travel photography, 8k photorealistic",
    "crete-hero.png": "Cinematic coastal photo of Crete Greece, Venetian harbor of Chania with lighthouse, colorful harbor houses, turquoise Mediterranean waters, mountains in background, sunny day, premium travel photography, 8k photorealistic",
    "tbilisi-hero.png": "Cinematic cityscape photo of Tbilisi Georgia, Holy Trinity Cathedral Sameba, old town colorful houses on hillside, Narikala Fortress, Mtkvari River, Caucasus mountains, dramatic light, premium travel photography, 8k photorealistic",

    # NORTH AMERICA (6 cities)
    "seattle-hero.png": "Cinematic cityscape photo of Seattle USA, Space Needle against Mount Rainier backdrop, Puget Sound waterfront, modern skyline, Pike Place Market area, dramatic Pacific Northwest clouds, premium travel photography, 8k photorealistic",
    "washington-dc-hero.png": "Cinematic cityscape photo of Washington DC USA, Capitol Building dome, National Mall with Washington Monument, cherry blossoms if spring, Lincoln Memorial, American monuments, golden hour, premium travel photography, 8k photorealistic",
    "phoenix-hero.png": "Cinematic desert cityscape photo of Phoenix Arizona USA, Sonoran Desert with saguaro cacti, Camelback Mountain, modern skyline, dramatic desert sunset, warm desert tones, premium travel photography, 8k photorealistic",
    "quebec-city-hero.png": "Cinematic cityscape photo of Quebec City Canada, Chateau Frontenac castle hotel, old walled city, cobblestone streets, St. Lawrence River, French colonial architecture, snow or autumn colors, premium travel photography, 8k photorealistic",
    "havana-hero.png": "Cinematic cityscape photo of Havana Cuba, vintage American cars on the Malecon waterfront, colorful colonial buildings, El Capitolio, Caribbean Sea, vibrant pastel colors, tropical atmosphere, premium travel photography, 8k photorealistic",
    "tulum-hero.png": "Cinematic coastal photo of Tulum Mexico, ancient Mayan ruins on cliff overlooking turquoise Caribbean Sea, pristine white sand beach, palm trees, bohemian paradise, sunny tropical day, premium travel photography, 8k photorealistic",

    # SOUTH AMERICA (5 cities)
    "medellin-hero.png": "Cinematic cityscape photo of Medellin Colombia, valley city surrounded by Andes mountains, cable cars over hills, Botero Plaza, modern transformation, eternal spring weather, dramatic mountain backdrop, premium travel photography, 8k photorealistic",
    "salvador-hero.png": "Cinematic cityscape photo of Salvador Bahia Brazil, Pelourinho historic center with colorful colonial buildings, Lacerda Elevator, Afro-Brazilian culture, All Saints Bay, vibrant tropical colors, premium travel photography, 8k photorealistic",
    "fortaleza-hero.png": "Cinematic coastal cityscape photo of Fortaleza Brazil, golden sand beaches, modern beachfront skyline, palm trees, Atlantic Ocean, tropical northeast coast, sunny blue sky, premium travel photography, 8k photorealistic",
    "brasilia-hero.png": "Cinematic cityscape photo of Brasilia Brazil, modernist Oscar Niemeyer architecture, Congress building with twin towers, Cathedral of Brasilia, futuristic planned city, dramatic sky, premium travel photography, 8k photorealistic",
    "florianopolis-hero.png": "Cinematic coastal aerial photo of Florianopolis Brazil, island city with stunning beaches, Hercílio Luz Bridge, lagoons and dunes, Barra da Lagoa, tropical paradise, turquoise water, premium travel photography, 8k photorealistic",

    # ASIA (17 cities)
    "jaipur-hero.png": "Cinematic cityscape photo of Jaipur India Pink City, Hawa Mahal Palace of Winds, pink sandstone buildings, colorful markets, Amber Fort on hill, Rajasthani royal architecture, golden hour, premium travel photography, 8k photorealistic",
    "goa-hero.png": "Cinematic tropical beach photo of Goa India, palm-fringed golden beach, colorful fishing boats, Portuguese colonial church in background, Arabian Sea sunset, relaxed beach paradise, premium travel photography, 8k photorealistic",
    "bangalore-hero.png": "Cinematic cityscape photo of Bangalore India, Vidhana Soudha government building, modern IT parks, garden city with trees, Silicon Valley of India, cosmopolitan atmosphere, sunny day, premium travel photography, 8k photorealistic",
    "kochi-hero.png": "Cinematic coastal photo of Kochi Kerala India, iconic Chinese fishing nets at sunset, colonial Fort Kochi, backwaters, traditional boats, Portuguese heritage, Arabian Sea, warm tropical light, premium travel photography, 8k photorealistic",
    "da-nang-hero.png": "Cinematic coastal cityscape photo of Da Nang Vietnam, Dragon Bridge over Han River, modern beachfront, Marble Mountains in background, My Khe Beach, coastal resort city, sunny tropical day, premium travel photography, 8k photorealistic",
    "hoi-an-hero.png": "Cinematic evening photo of Hoi An Vietnam, ancient town with colorful lanterns illuminating streets, Thu Bon River, Japanese Covered Bridge, yellow painted buildings, romantic atmosphere, premium travel photography, 8k photorealistic",
    "cebu-hero.png": "Cinematic coastal aerial photo of Cebu Philippines, tropical island with pristine beaches, Magellan's Cross historic site, Cebu City skyline, turquoise waters, palm trees, sunny tropical paradise, premium travel photography, 8k photorealistic",
    "palawan-hero.png": "Cinematic tropical paradise photo of Palawan Philippines, El Nido limestone karst cliffs, crystal clear turquoise lagoons, island hopping boats, pristine beaches, world's best island, premium travel photography, 8k photorealistic",
    "naha-hero.png": "Cinematic cityscape photo of Naha Okinawa Japan, Shuri Castle gates, tropical urban atmosphere, Kokusai Street, East China Sea, unique Ryukyu culture, palm trees, sunny subtropical, premium travel photography, 8k photorealistic",
    "penang-hero.png": "Cinematic cityscape photo of Penang Georgetown Malaysia, colorful street art murals, colonial shophouses, Kek Lok Si Temple on hill, multicultural heritage, street food stalls, vibrant atmosphere, premium travel photography, 8k photorealistic",
    "langkawi-hero.png": "Cinematic aerial photo of Langkawi Malaysia, Sky Bridge on Gunung Mat Cincang, turquoise Andaman Sea, forested islands archipelago, duty-free paradise, tropical beach resort, premium travel photography, 8k photorealistic",
    "xian-hero.png": "Cinematic cityscape photo of Xi'an China, ancient city walls at night with illumination, Bell Tower and Drum Tower, Terracotta Warriors vibe, Silk Road starting point, historic atmosphere, premium travel photography, 8k photorealistic",
    "mandalay-hero.png": "Cinematic photo of Mandalay Myanmar, U Bein Bridge at sunset with monks walking, Irrawaddy River, golden pagodas, ancient temples, spiritual atmosphere, warm golden light, premium travel photography, 8k photorealistic",
    "luang-prabang-hero.png": "Cinematic photo of Luang Prabang Laos, golden temples and French colonial buildings, monks collecting alms at dawn, Mekong River, lush green mountains, UNESCO heritage town, serene atmosphere, premium travel photography, 8k photorealistic",
    "lombok-hero.png": "Cinematic tropical photo of Lombok Indonesia, pristine white sand beaches, Mount Rinjani volcano in background, traditional fishing boats, turquoise Gili Islands waters, unspoiled paradise, premium travel photography, 8k photorealistic",
    "yogyakarta-hero.png": "Cinematic photo of Yogyakarta Indonesia, Borobudur Temple at sunrise with mist, Javanese culture, Prambanan temple complex, volcanic landscapes, Sultan's Palace, spiritual atmosphere, premium travel photography, 8k photorealistic",

    # MIDDLE EAST (2 cities)
    "jerusalem-hero.png": "Cinematic cityscape photo of Jerusalem Israel, Dome of the Rock golden dome, Western Wall, Old City ancient walls, sacred city panorama, Mount of Olives, dramatic sky, spiritual atmosphere, premium travel photography, 8k photorealistic",
    "antalya-hero.png": "Cinematic coastal cityscape photo of Antalya Turkey, Kaleici old town with red rooftops, Mediterranean turquoise coast, Roman harbor, Hadrian's Gate, Taurus Mountains backdrop, Turkish Riviera, premium travel photography, 8k photorealistic",

    # AFRICA (2 cities)
    "durban-hero.png": "Cinematic coastal cityscape photo of Durban South Africa, Golden Mile beachfront promenade, Moses Mabhida Stadium arch, Indian Ocean waves, subtropical palm trees, multicultural city, sunny day, premium travel photography, 8k photorealistic",

    # OCEANIA (4 cities)
    "cairns-hero.png": "Cinematic tropical coastal photo of Cairns Australia, gateway to Great Barrier Reef, Esplanade lagoon, tropical palm trees, rainforest mountains backdrop, turquoise Coral Sea, sunny Queensland day, premium travel photography, 8k photorealistic",
    "gold-coast-hero.png": "Cinematic coastal aerial photo of Gold Coast Australia, Surfers Paradise skyline, golden sand beaches, surfing waves, theme parks area, modern high-rises along coast, sunny blue sky, premium travel photography, 8k photorealistic",
    "adelaide-hero.png": "Cinematic cityscape photo of Adelaide Australia, River Torrens parklands, elegant colonial architecture, wine region vibes, Adelaide Hills backdrop, cultural precinct, Mediterranean climate feel, premium travel photography, 8k photorealistic",
    "hamilton-hero.png": "Cinematic cityscape photo of Hamilton New Zealand, Waikato River garden city, lush green parks, Hamilton Gardens, rolling green hills, Hobbiton nearby vibes, sunny day, premium travel photography, 8k photorealistic",
}

def generate_image(prompt, filename):
    print(f"🎨 Generating {filename}...")
    
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
    print(f"🖼️  GENERATING HERO IMAGES FOR {len(CITIES_PROMPTS)} NEW CITIES")
    print("==================================================")
    
    if not API_KEY:
        print("❌ IDEOGRAM_API_KEY not found in environment!")
        print("Set it with: $env:IDEOGRAM_API_KEY = 'your-key'")
        return
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    generated = 0
    skipped = 0
    failed = 0
    
    for filename, prompt in CITIES_PROMPTS.items():
        # Check if exists (check for .webp too, as we convert usually)
        base_name = filename.replace('.png', '')
        webp_path = os.path.join(OUTPUT_DIR, f"{base_name}.webp")
        png_path = os.path.join(OUTPUT_DIR, filename)
        
        if os.path.exists(webp_path):
             print(f"⏭️  Skipping {filename} - WebP already exists.")
             skipped += 1
             continue
        if os.path.exists(png_path):
             print(f"⏭️  Skipping {filename} - PNG already exists.")
             skipped += 1
             continue

        success = generate_image(prompt, filename)
        if success:
            generated += 1
        else:
            failed += 1
            
        time.sleep(2) # Politeness delay

    print(f"\n✅ Generation complete: {generated} generated, {skipped} skipped, {failed} failed")
    print("👉 Run: python convert_heroes_to_webp.py to convert all PNGs!")

if __name__ == "__main__":
    main()
