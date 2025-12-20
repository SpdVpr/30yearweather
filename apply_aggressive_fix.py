
import os

def apply_aggressive_fix():
    path = 'backend/etl.py'
    if not os.path.exists(path):
        print("etl.py not found")
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    start_marker = 'def generate_smart_narrative'
    end_marker = 'def process_location'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Markers not found: start={start_idx}, end={end_idx}")
        return

    new_code = '''def generate_smart_narrative(config, yearly_stats, flight_data, health_data, weather_stats=None):
    import random
    city_name = config["name"]
    country_name = config["country"]
    connectivity_text = ""
    flight_score = 0
    if flight_data:
        flight_score = flight_data.get("pressure_score", 0)
        p_arrivals = flight_data.get("peak_daily_arrivals", 0)
        c_vars = []
        if flight_score > 80:
            c_vars = [f"{city_name} is a global hub.", f"Great connections in {city_name}."]
        elif flight_score > 50:
            c_vars = [f"{city_name} has good regional links."]
        else:
            c_vars = [f"{city_name} is a secluded escape."]
        connectivity_text = c_vars[len(city_name) % len(c_vars)]
    health_text = ""
    vaccine_count = 0
    if health_data:
        vaccines = health_data.get("vaccines", [])
        vaccine_count = len(vaccines)
        h_vars = [f"Healthy travel to {city_name} is priority."]
        health_text = h_vars[len(city_name) % len(h_vars)]
    weather_text = ""
    if yearly_stats:
        avg_t = yearly_stats.get("avg_temp_annual", 15)
        w_vars = [f"{city_name} weather is pleasant."]
        weather_text = w_vars[len(city_name) % len(w_vars)]
    ai_ov = connectivity_text + (chr(10)*2) + health_text + (chr(10)*2) + weather_text
    return {
        "seo_title": f"About {city_name}",
        "meta_description": f"{connectivity_text} {weather_text} {health_text}".strip(),
        "ai_overview": ai_ov,
        "tags": []
    }

'''

    new_content = content[:start_idx] + new_code + content[end_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Aggressive fix applied.")

if __name__ == "__main__":
    apply_aggressive_fix()
