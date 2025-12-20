
import os
import sys

def patch_etl_interpretation():
    file_path = 'backend/etl.py'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to inject a helper function 'generate_smart_narrative' near the top or before process_location
    # And then call it inside process_location before returning final_data.

    # 1. Insert Helper Function
    helper_code = '''
def generate_smart_narrative(config, yearly_stats, flight_data, health_data, weather_stats=None):
    """
    Generates a unique, SEO-friendly narrative based on combined data points.
    Targeted for LMMs and User context.
    """
    city_name = config['name']
    country_name = config['country']
    
    # --- 1. Connectivity & Vibrancy (Flight Data) ---
    connectivity_text = ""
    flight_score = 0
    peak_month = None
    
    if flight_data:
        flight_score = flight_data.get('pressure_score', 0)
        daily_pax = flight_data.get('peak_daily_arrivals', flight_data.get('total_daily_arrivals', 0)) * 150 # Est pax
        
        if flight_score > 80:
            connectivity_text = f"{city_name} is a **major global hub** with exceptional accessibility. Expect a bustling atmosphere with over {flight_data.get('peak_daily_arrivals', 0):,} daily flights."
        elif flight_score > 50:
            connectivity_text = f"{city_name} is **well-connected** regionally, making it accessible from major international gateways."
        elif flight_score > 20:
            connectivity_text = f"{city_name} offers **moderate connectivity**. Direct flights may be limited to specific days or regional hubs."
        else:
            connectivity_text = f"{city_name} is a **remote gem**. Reaching this destination typically requires connecting flights, offering a secluded atmosphere away from mass tourism."

        # Routes Context
        routes = flight_data.get('top_routes', [])
        if routes:
            top_3 = ", ".join([r.split('(')[0].strip() for r in routes[:3]])
            connectivity_text += f" Key connections include flights from {top_3}."
            
        # Seasonality Context (Find peak month)
        seasonality = flight_data.get('seasonality', {})
        if seasonality:
            # simple max
            peak_month_num = max(seasonality, key=seasonality.get)
            import calendar
            peak_month_name = calendar.month_name[peak_month_num]
            connectivity_text += f" Tourist arrivals peak in **{peak_month_name}**, so plan accordingly for crowds."

    # --- 2. Health & Safety Context (Health Data) ---
    health_text = ""
    vaccine_count = 0
    if health_data:
        vaccines = health_data.get('vaccines', [])
        vaccine_count = len(vaccines)
        
        if vaccine_count > 6:
            health_text = f"Visiting {country_name} requires **advanced health planning**. The CDC recommends checking vaccinations for {', '.join([v['disease'] for v in vaccines[:3]])} and others approx 4-6 weeks before travel."
        elif vaccine_count > 3:
            health_text = f"Standard travel health precautions apply. Ensure routine vaccinations are up to date, and consider coverage for {vaccines[0]['disease']}."
        else:
            health_text = "No special vaccinations are typically required for travelers from major regions, assuming routine immunizations are up to date."
            
    # --- 3. Weather Personality ---
    weather_text = ""
    if yearly_stats:
        hottest_m = yearly_stats.get('hottest_month')
        wettest_m = yearly_stats.get('wettest_month')
        avg_temp = yearly_stats.get('avg_temp_annual')
        
        if avg_temp > 25:
            weather_text = f"Expect a **tropical/hot climate** year-round."
        elif avg_temp < 10:
            weather_text = f"This is a **cold-climate destination**, perfect for winter sports or cozy retreats."
        else:
            weather_text = f"The city enjoys a **temperate climate** with distinct seasons."
            
    # Combine into a structured SEO Object
    return {
        "seo_title": f"Travel to {city_name}: Weather, Flights, and Health Guide",
        "meta_description": f"Plan your trip to {city_name}, {country_name}. {connectivity_text} {weather_text} Get safety and health insights.",
        "ai_overview": f"{connectivity_text}\n\n{health_text}\n\n{weather_text}",
        "tags": [
            "High Traffic" if flight_score > 60 else "Hidden Gem",
            "Medical Prep Needed" if vaccine_count > 5 else "Easy Access",
            "Tropical" if yearly_stats.get('avg_temp_annual', 0) > 20 else "Temperate"
        ]
    }
'''

    # Insert helper before process_location
    target_helper = "def process_location(slug, config):"
    if target_helper not in content:
        print("Error: process_location definition not found")
        return
        
    content = content.replace(target_helper, helper_code + "\n\n" + target_helper)
    
    # 2. Call helper inside process_location
    # We need to find where final_data is ready.
    # Look for: "return final_data" at the end of the function.
    
    # We will insert the call just before returning.
    # BUT we need to handle the indentation of the function.
    
    # Let's find "    return final_data" (indentation usually 4 spaces)
    # Actually, process_location has indentation 0, body has 4.
    target_return = "    return final_data"
    
    logic_call = '''
    # 7. Generate SEO/LMM Narrative (Interpretation Layer)
    print("   🧠 Generating AI/SEO Interpretation...")
    narrative = generate_smart_narrative(
        config, 
        final_data.get('yearly_stats'), 
        final_data.get('meta', {}).get('flight_info'), 
        final_data.get('meta', {}).get('health_info')
    )
    
    if 'meta' not in final_data: final_data['meta'] = {}
    final_data['meta']['seo_content'] = narrative
'''
    
    # We replace the LAST occurrence of "return final_data" in process_location? 
    # Actually, process_location updates final_data in both branches (full calc vs existing).
    # So placing it before the return is safe.
    
    # NOTE: Be careful not to replace the return inside helpers.
    # The indentation of process_location return is 4 spaces. Helpers have 8 or more.
    
    # Simple strategy: append to the end of the function body?
    # No, python whitespace is tricky with replace.
    
    # Let's look for: "    return final_data" (4 spaces)
    # It usually appears once at the very end of process_location.
    
    # Let's check regex count or just replace.
    # Python's replace replaces ALL occurrences.
    # There might be 2 returns (one for main logic, one for simple)?
    # etl.py structure:
    # def process_location...
    #   if ...
    #   else ...
    #   return final_data
    
    # So replacing "    return final_data" with "    # Logic\n    return final_data" should work.
    
    content = content.replace(target_return, logic_call + "\n" + target_return)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Successfully patched backend/etl.py with Interpretation Layer")

if __name__ == "__main__":
    patch_etl_interpretation()
