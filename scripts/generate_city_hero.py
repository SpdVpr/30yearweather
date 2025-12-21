import requests
import os
import sys

# Configuration
API_KEY = os.getenv("IDEOGRAM_API_KEY")
# Using the generally compatible endpoint. If 2.0/3.0 specific is needed, we might need to adjust.
# Based on search results, V2 endpoint is commonly https://api.ideogram.ai/generate
API_URL = "https://api.ideogram.ai/generate"

# Project Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "images")

def generate_image(prompt, filename):
    print(f"Generating image for {filename}...")
    
    headers = {
        "Api-Key": API_KEY, # Some docs say Api-Key, some say Authorization. Let's try Api-Key first if search result 1 implied it, but search result 2 said Authorization.
        # Actually search result 9 said Authorization: Bearer. I'll stick to Authorization: Bearer which is standard.
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Payload for Ideogram
    payload = {
        "image_request": {
            "prompt": prompt,
            "aspect_ratio": "ASPECT_4_3",
            "model": "V_2", 
            "magic_prompt": "AUTO"
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        
        # Check for common errors or 404
        if response.status_code == 404:
             print("Standard endpoint 404, trying v1/ideogram-v3/generate...")
             alt_url = "https://api.ideogram.ai/v1/ideogram-v3/generate"
             response = requests.post(alt_url, headers=headers, json=payload)
             
        if response.status_code != 200:
             print(f"Error Status: {response.status_code}")
             print(f"Response: {response.text}")
             # If unauthorized, maybe try Api-Key header?
             if response.status_code == 401:
                 print("Trying Api-Key header...")
                 headers.pop("Authorization")
                 headers["Api-Key"] = API_KEY
                 response = requests.post(API_URL, headers=headers, json=payload)

        response.raise_for_status()
        result = response.json()
        
        if "data" in result and len(result["data"]) > 0:
            image_url = result["data"][0]["url"]
            print(f"Image generated! URL: {image_url}")
            
            # Download image
            print("Downloading...")
            img_data = requests.get(image_url).content
            
            output_path = os.path.join(OUTPUT_DIR, filename)
            with open(output_path, "wb") as f:
                f.write(img_data)
            print(f"Saved to {output_path}")
            return True
        else:
            print("No image data found in response.")
            print(result)
            return False

    except Exception as e:
        print(f"Exception during generation: {e}")
        return False

if __name__ == "__main__":
    # Test Case: Lyon (France)
    # New city test
    PROMPT = "Cinematic cityscape photo of Lyon, France, view of the Saône river and Old Lyon (Vieux Lyon) with colorful renaissance buildings, Basilica of Notre-Dame de Fourvière on the hill in background, warm golden sunset lighting, premium travel photography, 8k resolution, professional composition, historic charm"
    FILENAME = "lyon-fr-hero.png"
    
    success = generate_image(PROMPT, FILENAME)
    
    if success:
        print("\nImage saved. Converting to WebP...")
        converter_script = os.path.join(BASE_DIR, "convert_heroes_to_webp.py")
        if os.path.exists(converter_script):
            # Use sys.executable to ensure we use the same python environment (with installed packages)
            import subprocess
            subprocess.run([sys.executable, converter_script], check=True)
        else:
            print(f"Converter script not found at {converter_script}")
