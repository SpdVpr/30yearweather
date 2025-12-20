
import subprocess
import time
import sys
import os

# List of all newly added cities
NEW_CITIES_SLUGS = [
    # EUROPE
    "hamburg", "seville", "naples", "valletta", "rhodes", "sofia", "riga",
    # NORTH AMERICA
    "chicago", "boston", "las-vegas", "honolulu", "montreal", "calgary", "new-orleans",
    # SOUTH AMERICA
    "bogota", "sao-paulo", "quito", "cusco", "san-jose-cr",
    # ASIA
    "sapporo", "busan", "chengdu", "kathmandu", "colombo", "almaty", "tashkent", "fukuoka",
    # MIDDLE EAST
    "abu-dhabi", "doha", "tel-aviv", "muscat",
    # AFRICA
    "cairo", "johannesburg", "nairobi", "casablanca",
    # OCEANIA
    "brisbane", "perth", "christchurch", "nadi", "papeete"
]

def run_command(command, description):
    print(f"\n🚀 Starting {description}...")
    try:
        # Run command and wait for it
        # FORCE using explicit python path to ensure dependencies (requests, pandas) are found
        # "python" alias sometimes points to a different/broken environment in subprocess
        PYTHON_PATH = r"C:\Users\micha\AppData\Local\Microsoft\WindowsApps\python.exe"
        full_command = [PYTHON_PATH] + command.split()
        subprocess.run(full_command, check=True)
        print(f"✅ {description} completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed with error: {e}")
        # Continue? Or stop? For batch, maybe continue and log error?
        pass

def main():
    print("==================================================")
    print(f"🌍 STARTING MASSIVE DATA IMPORT FOR {len(NEW_CITIES_SLUGS)} CITIES")
    print("==================================================")
    
    # 1. Download Health Data (One run covers all countries in config)
    # Since config.py is updated, running the existing script should cover new countries.
    run_command("download_health_cdc.py", "Health Data Download (All Countries)")
    
    # 2. Per City Processing
    for i, slug in enumerate(NEW_CITIES_SLUGS):
        print(f"\n\n--------------------------------------------------")
        print(f"📍 CITY {i+1}/{len(NEW_CITIES_SLUGS)}: {slug.upper()}")
        print(f"--------------------------------------------------")
        
        # A. Download Flight Data (Using the new Robust script)
        # Note: download_seasonal_flights.py (robust version) iterates ALL cities in config.
        # But that might take too long if we re-run it 40 times.
        # It has meaningful "Skip if exists" logic.
        # So running it ONCE globally is better than per city?
        # Yes, let's run flight download globally ONCE first.
        pass
        
    print("\n✈️  Running Flight Data Download for ALL cities (Skip existing)...")
    run_command("download_seasonal_flights.py", "Flight Data Download (Global)")
    
    # 3. Weather ETL + Tourism ETL (Per City)
    # We need to run these per city or modify them to run on the list.
    # backend/etl.py runs on ALL locations in config if main() is called without args.
    # But 40 cities weather download is heavy (rate limits!).
    # etl.py has delays built-in.
    
    print("\n🌩️  Running Weather ETL for ALL cities...")
    # This might take hours.
    run_command("backend/etl.py", "Weather ETL (All New Cities)")
    
    print("\n🏖️  Running Tourism ETL for ALL cities...")
    run_command("backend/etl_tourism.py", "Tourism ETL (All New Cities)")

    print("\n==================================================")
    print("🎉 MASSIVE BATCH IMPORT COMPLETE")
    print("==================================================")

if __name__ == "__main__":
    main()
