
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

# 50 NEW TRENDING CITIES - Based on Google Trends & Skyscanner 2024-2025
CITIES_PROMPTS = {
    # ========== TIER 1: CANARY ISLANDS ==========
    "tenerife-hero.png": "Cinematic aerial photo of Tenerife Canary Islands Spain, Mount Teide volcano snow-capped peak, lush green valleys, black sand beaches, resort towns, Atlantic Ocean, dramatic volcanic landscape, golden hour, premium travel photography, 8k photorealistic",
    "lanzarote-hero.png": "Cinematic aerial photo of Lanzarote Canary Islands Spain, volcanic lunar landscape, Timanfaya National Park fire mountains, white villages against black lava, vineyards in volcanic craters, azure ocean, premium travel photography, 8k photorealistic",
    "gran-canaria-hero.png": "Cinematic aerial photo of Gran Canaria Canary Islands Spain, Maspalomas sand dunes, palm tree oasis, colorful Las Palmas city, dramatic mountainous interior, blue Atlantic waters, sunny day, premium travel photography, 8k photorealistic",
    "fuerteventura-hero.png": "Cinematic aerial photo of Fuerteventura Canary Islands Spain, endless golden sand beaches, turquoise waters, windsurfing paradise, volcanic mountains, Corralejo dunes, pristine coastline, premium travel photography, 8k photorealistic",
    
    # ========== TIER 1: TRENDING DESTINATIONS ==========
    "curacao-hero.png": "Cinematic coastal photo of Willemstad Curaçao, colorful Dutch colonial handelskade waterfront, Queen Emma pontoon bridge, Caribbean turquoise waters, pastel buildings, vibrant tropical atmosphere, premium travel photography, 8k photorealistic",
    "siem-reap-hero.png": "Cinematic sunrise photo of Angkor Wat Cambodia Siem Reap, ancient temple silhouette reflecting in lotus pond, golden morning mist, dramatic sky, monks in orange robes, spiritual atmosphere, premium travel photography, 8k photorealistic",
    "tromso-hero.png": "Cinematic winter photo of Tromsø Norway Arctic, Northern Lights aurora borealis dancing over snowy mountains, Arctic Cathedral, colorful wooden houses, polar night atmosphere, premium travel photography, 8k photorealistic",
    "nha-trang-hero.png": "Cinematic coastal aerial photo of Nha Trang Vietnam, crescent bay beach, clear turquoise waters, resort high-rises along shoreline, fishing boats, Hon Chong islands, tropical sunshine, premium travel photography, 8k photorealistic",
    "reggio-calabria-hero.png": "Cinematic coastal photo of Reggio Calabria Italy, Lungomare promenade, Strait of Messina with Sicily Mount Etna visible, Art Nouveau buildings, Mediterranean blue waters, Italian Riviera atmosphere, premium travel photography, 8k photorealistic",
    "ibiza-hero.png": "Cinematic aerial sunset photo of Ibiza Spain, Dalt Vila old town fortress on hill, Mediterranean coves, luxury yachts, Es Vedrà rock island, nightclub beach vibes, golden Balearic sunset, premium travel photography, 8k photorealistic",
    
    # ========== TIER 2: HIGH PRIORITY ==========
    "valencia-hero.png": "Cinematic cityscape photo of Valencia Spain, City of Arts and Sciences futuristic architecture, Calatrava buildings, Turia Gardens, Mediterranean beach, Gothic cathedral, sunny blue sky, premium travel photography, 8k photorealistic",
    "bilbao-hero.png": "Cinematic cityscape photo of Bilbao Spain, Guggenheim Museum titanium curves, Nervión River, green Basque mountains, modern architecture mixed with old town, dramatic clouds, premium travel photography, 8k photorealistic",
    "krabi-hero.png": "Cinematic tropical photo of Krabi Thailand, dramatic limestone karst cliffs, Railay Beach, emerald Andaman Sea, longtail boats, tropical jungle, pristine paradise, sunny day, premium travel photography, 8k photorealistic",
    "amman-hero.png": "Cinematic cityscape photo of Amman Jordan, ancient Citadel overlooking white stone city, Roman amphitheater, modern downtown, Middle Eastern architecture on hills, golden hour, premium travel photography, 8k photorealistic",
    "hurghada-hero.png": "Cinematic aerial photo of Hurghada Egypt Red Sea, turquoise coral reef waters, desert meeting sea, resort hotels along coast, diving boats, Giftun Island, sunny beach paradise, premium travel photography, 8k photorealistic",
    "sharm-el-sheikh-hero.png": "Cinematic coastal photo of Sharm El Sheikh Egypt, Naama Bay beach resorts, Red Sea crystal waters, Sinai desert mountains backdrop, diving paradise, luxury hotels, golden sunset, premium travel photography, 8k photorealistic",
    "luxor-hero.png": "Cinematic sunset photo of Luxor Egypt, Karnak Temple ancient columns, Nile River with felucca boats, Valley of the Kings mountains, palm trees, golden desert light, Pharaonic grandeur, premium travel photography, 8k photorealistic",
    "jeddah-hero.png": "Cinematic cityscape photo of Jeddah Saudi Arabia, Al-Balad historic district coral houses, Red Sea corniche, modern King Abdullah Fountain, traditional souks, mix of old and new Arabia, premium travel photography, 8k photorealistic",
    "bodrum-hero.png": "Cinematic coastal photo of Bodrum Turkey, ancient castle of St Peter, white cubic houses cascading down hillside, turquoise Aegean Sea, luxury gulets, Turkish Riviera glamour, premium travel photography, 8k photorealistic",
    "antwerp-hero.png": "Cinematic cityscape photo of Antwerp Belgium, Cathedral of Our Lady spire, Grote Markt guild houses, diamond district, Scheldt River port, Flemish Renaissance architecture, golden hour, premium travel photography, 8k photorealistic",
    
    # ========== TIER 3: EMERGING MARKETS ==========
    "sarande-hero.png": "Cinematic coastal aerial photo of Sarandë Albania, Albanian Riviera crystal clear Ionian Sea, colorful promenade, mountains meeting sea, ancient Butrint ruins nearby, Mediterranean paradise, premium travel photography, 8k photorealistic",
    "tirana-hero.png": "Cinematic cityscape photo of Tirana Albania, colorful painted buildings, Skanderbeg Square, Et'hem Bey Mosque, Mount Dajti backdrop, vibrant post-communist capital, mix of Ottoman and modernist architecture, premium travel photography, 8k photorealistic",
    "kotor-hero.png": "Cinematic aerial photo of Kotor Montenegro, medieval walled old town in fjord, dramatic Bay of Kotor, fortress climbing mountainside, Adriatic blue waters, cruise ships, UNESCO heritage, premium travel photography, 8k photorealistic",
    "budva-hero.png": "Cinematic coastal photo of Budva Montenegro, ancient walled old town peninsula, beautiful Adriatic beaches, Sveti Stefan island nearby, nightlife promenade, Montenegrin Riviera glamour, premium travel photography, 8k photorealistic",
    "st-lucia-hero.png": "Cinematic aerial photo of St Lucia Caribbean, iconic twin Pitons volcanic peaks, lush rainforest, Soufrière bay, turquoise waters, luxury resorts, dramatic tropical landscape, premium travel photography, 8k photorealistic",
    "turks-caicos-hero.png": "Cinematic aerial photo of Providenciales Turks and Caicos, Grace Bay Beach pristine white sand, crystal turquoise Caribbean waters, luxury resorts, world's best beach, paradise island, premium travel photography, 8k photorealistic",
    "antigua-hero.png": "Cinematic coastal photo of Antigua Caribbean, English Harbour Nelson's Dockyard, 365 beaches coastline, sailing yachts, historic Georgian architecture, turquoise waters, tropical sunshine, premium travel photography, 8k photorealistic",
    "siargao-hero.png": "Cinematic aerial photo of Siargao Island Philippines, Cloud 9 surfing break, palm tree covered island, turquoise lagoons, mangrove forests, laid-back surf paradise, pristine beaches, premium travel photography, 8k photorealistic",
    "panglao-hero.png": "Cinematic aerial photo of Panglao Bohol Philippines, powder white Alona Beach, crystal clear waters, dive boats, Chocolate Hills vibe nearby, tropical island resort, premium travel photography, 8k photorealistic",
    "trivandrum-hero.png": "Cinematic cityscape photo of Thiruvananthapuram Kerala India, Padmanabhaswamy Temple golden gopuram, backwater palm trees, traditional Kerala architecture, Arabian Sea coast, tropical greenery, premium travel photography, 8k photorealistic",
    
    # ========== TIER 4: GEOGRAPHIC DIVERSITY ==========
    "tartu-hero.png": "Cinematic cityscape photo of Tartu Estonia, Town Hall Square neoclassical buildings, University of Tartu historic campus, Emajõgi River, charming Estonian town, intellectual bohemian atmosphere, premium travel photography, 8k photorealistic",
    "stuttgart-hero.png": "Cinematic cityscape photo of Stuttgart Germany, Schlossplatz palace, Mercedes-Benz Museum modernist architecture, vineyard-covered hills, Swabian Alps backdrop, automotive capital, premium travel photography, 8k photorealistic",
    "rotterdam-hero.png": "Cinematic cityscape photo of Rotterdam Netherlands, Cube Houses innovative architecture, Erasmus Bridge, modern skyline, harbor, post-war architectural marvel, bold contemporary design, premium travel photography, 8k photorealistic",
    "basel-hero.png": "Cinematic cityscape photo of Basel Switzerland, Rhine River waterfront, medieval old town with red sandstone Münster cathedral, three countries corner, art museums, charming Swiss elegance, premium travel photography, 8k photorealistic",
    "dusseldorf-hero.png": "Cinematic cityscape photo of Düsseldorf Germany, Rhine River promenade, Rheinturm tower, Medienhafen modern architecture by Frank Gehry, Altstadt old town, elegant shopping boulevards, premium travel photography, 8k photorealistic",
    "santander-hero.png": "Cinematic coastal photo of Santander Spain, El Sardinero beach golden crescent, Magdalena Palace, Cantabrian Sea blue waters, elegant Belle Époque architecture, green hills, northern Spanish charm, premium travel photography, 8k photorealistic",
    "cordoba-hero.png": "Cinematic photo of Córdoba Spain, Mezquita Cathedral unique arches interior, Guadalquivir River Roman bridge, flower-filled patios, Andalusian whitewashed streets, Moorish heritage, golden light, premium travel photography, 8k photorealistic",
    "dominica-hero.png": "Cinematic aerial photo of Dominica Caribbean nature island, Boiling Lake volcanic crater, lush rainforest waterfalls, Champagne Beach bubbling waters, unspoiled wilderness, dramatic green mountains, premium travel photography, 8k photorealistic",
    "suva-hero.png": "Cinematic coastal photo of Suva Fiji, colonial waterfront buildings, tropical harbor, lush green mountains, Polynesian culture, South Pacific capital, palm-fringed bay, vibrant markets, premium travel photography, 8k photorealistic",
    "quepos-hero.png": "Cinematic tropical aerial photo of Quepos Costa Rica, Manuel Antonio National Park, pristine beaches meeting rainforest, howler monkeys habitat, Pacific Ocean, dramatic coastline, biodiversity paradise, premium travel photography, 8k photorealistic",
    
    # ========== TIER 5: SEASONAL & NICHE ==========
    "limon-hero.png": "Cinematic coastal photo of Limón Costa Rica Caribbean coast, Afro-Caribbean culture, colorful Caribbean architecture, tropical rainforest meeting sea, Cahuita beaches, reggae vibes, pristine nature, premium travel photography, 8k photorealistic",
    "madeira-hero.png": "Cinematic aerial photo of Funchal Madeira Portugal, dramatic volcanic cliffs, terraced hillside gardens, Atlantic Ocean, levada hiking trails, colorful harbor, eternal spring island, premium travel photography, 8k photorealistic",
    "tucuman-hero.png": "Cinematic photo of San Miguel de Tucumán Argentina, colonial Casa de Tucumán independence house, Andes mountain foothills, lush green Garden of the Republic, historic plazas, gateway to northwest Argentina, premium travel photography, 8k photorealistic",
    "juneau-hero.png": "Cinematic aerial photo of Juneau Alaska USA, Mendenhall Glacier blue ice, wilderness capital surrounded by mountains, cruise ships in harbor, eagles, temperate rainforest, dramatic Alaskan landscape, premium travel photography, 8k photorealistic",
    "maui-hero.png": "Cinematic aerial photo of Maui Hawaii, Road to Hana coastal scenery, Haleakala volcano crater sunrise, golden beaches, palm trees, turquoise Pacific waters, tropical paradise, premium travel photography, 8k photorealistic",
    "nantucket-hero.png": "Cinematic coastal photo of Nantucket Island Massachusetts USA, historic Main Street cobblestones, gray shingled cottages, pristine beaches, lighthouse, New England charm, sailboats in harbor, premium travel photography, 8k photorealistic",
    "pondicherry-hero.png": "Cinematic coastal photo of Pondicherry India, French Quarter colorful colonial buildings, Promenade Beach, white town yellow facades, Auroville spiritual center nearby, Bay of Bengal, Tamil-French fusion, premium travel photography, 8k photorealistic",
    "somnath-hero.png": "Cinematic photo of Somnath Temple Gujarat India, magnificent Jyotirlinga temple complex on Arabian Sea coast, golden sandstone architecture, waves crashing on rocks, spiritual pilgrimage site, dramatic sunset, premium travel photography, 8k photorealistic",
    "sumba-hero.png": "Cinematic aerial photo of Sumba Island Indonesia, dramatic Weekuri Lagoon turquoise waters, traditional peaked-roof villages, wild horses on savanna, pristine empty beaches, untouched paradise, premium travel photography, 8k photorealistic",
    "mauritius-hero.png": "Cinematic aerial photo of Mauritius Indian Ocean, underwater waterfall illusion, Le Morne Brabant mountain, turquoise lagoons, seven colored earth Chamarel, tropical luxury resorts, pristine beaches, premium travel photography, 8k photorealistic",
}

def generate_image(prompt, filename):
    print(f"🎨 Generating {filename}...")
    
    headers = {
        "Api-Key": API_KEY, 
        "Content-Type": "application/json"
    }
    
    payload = {
        "image_request": {
            "prompt": prompt,
            "aspect_ratio": "ASPECT_16_9",  # Better for hero images
            "model": "V_2", 
            "magic_prompt_option": "AUTO"
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        if response.status_code == 429:
            print("⏳ Rate Limit! Waiting 60s...")
            time.sleep(60)
            return False
            
        if response.status_code != 200:
            print(f"❌ Error {response.status_code}: {response.text[:200]}")
            return False

        result = response.json()
        
        if "data" in result and len(result["data"]) > 0:
            image_url = result["data"][0].get("url")
            if image_url:
                # Download
                img_data = requests.get(image_url, timeout=60).content
                output_path = os.path.join(OUTPUT_DIR, filename)
                
                with open(output_path, "wb") as f:
                    f.write(img_data)
                print(f"✅ Saved to {output_path}")
                return True
        
        print("❌ No image data found.")
        return False

    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("=" * 70)
    print(f"🖼️  GENERATING HERO IMAGES FOR {len(CITIES_PROMPTS)} NEW TRENDING CITIES")
    print("=" * 70)
    
    if not API_KEY:
        print("❌ IDEOGRAM_API_KEY not found in environment!")
        print("Set it in .env file: IDEOGRAM_API_KEY=your-key")
        return
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    generated = 0
    skipped = 0
    failed = 0
    
    for filename, prompt in CITIES_PROMPTS.items():
        # Check if exists (check for .webp too)
        base_name = filename.replace('.png', '')
        webp_path = os.path.join(OUTPUT_DIR, f"{base_name}.webp")
        png_path = os.path.join(OUTPUT_DIR, filename)
        
        if os.path.exists(webp_path):
            print(f"⏭️  Skipping {filename} - WebP exists")
            skipped += 1
            continue
        if os.path.exists(png_path):
            print(f"⏭️  Skipping {filename} - PNG exists")
            skipped += 1
            continue

        success = generate_image(prompt, filename)
        if success:
            generated += 1
        else:
            failed += 1
            
        time.sleep(3)  # Rate limiting

    print(f"\n{'='*70}")
    print(f"✅ Complete: {generated} generated, {skipped} skipped, {failed} failed")
    print("👉 Run: python convert_heroes_to_webp.py to convert PNGs!")
    print("=" * 70)

if __name__ == "__main__":
    main()
