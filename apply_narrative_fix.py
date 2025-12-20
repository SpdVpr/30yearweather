
import os
import re

def apply_fix():
    path = 'backend/etl.py'
    if not os.path.exists(path):
        print("etl.py not found")
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_code = '''
def generate_smart_narrative(config, yearly_stats, flight_data, health_data, weather_stats=None):
    city_name = config["name"]
    country_name = config["country"]
    connectivity_text = ""
    flight_score = 0
    if flight_data:
        flight_score = flight_data.get("pressure_score", 0)
        p_arrivals = flight_data.get("peak_daily_arrivals", 0)
        c_vars = []
        if flight_score > 80:
            c_vars = [
                f"{city_name} is a global hub with {p_arrivals:,} daily flights.",
                f"Accessibility to {city_name} is excellent.",
                f"High-frequency connections define {city_name}."
            ]
        elif flight_score > 50:
            c_vars = [
                f"{city_name} has steady regional connectivity.",
                f"Getting to {city_name} is efficient.",
                f"Tourist flow in {city_name} is consistent."
            ]
        else:
            c_vars = [
                f"{city_name} offers a secluded arrival experience.",
                f"Find a peaceful escape in {city_name}.",
                f"Accessing {city_name} involves regional transfers."
            ]
        connectivity_text = c_vars[len(city_name) % len(c_vars)]
    health_text = ""
    vaccine_count = 0
    if health_data:
        vaccines = health_data.get("vaccines", [])
        vaccine_count = len(vaccines)
        h_vars = []
        if vaccine_count > 6:
            h_vars = [
                f"Planning for {country_name} health is advised for {city_name}.",
                f"Health preparedness is important for {city_name}.",
                f"Stay informed on medical tips for {city_name}."
            ]
        elif vaccine_count > 0:
            h_vars = [
                f"Standard health standards apply for {city_name}.",
                f"Visiting {city_name} is simple regarding wellness.",
                f"Standard immunity is typical for {city_name}."
            ]
        else:
            h_vars = [f"Health in {city_name} follows global norms."]
        health_text = h_vars[len(city_name) % len(h_vars)]
    weather_text = ""
    if yearly_stats:
        avg_t = yearly_stats.get("avg_temp_annual", 15)
        w_vars = []
        if avg_t > 22:
            w_vars = [
                f"The warmth of {city_name} is perfect for sunseekers.",
                f"Sunlight defines {city_name} weather profile.",
                f"Expect warm days in {city_name}, {country_name}."
            ]
        elif avg_t < 11:
            w_vars = [
                f"{city_name} offers a cool climate for winter fans.",
                f"The brisk air of {city_name} adds charm to your visit.",
                f"Bracing weather in {city_name} is a highlight."
            ]
        else:
            w_vars = [
                f"{city_name} features a temperate climate.",
                f"Enjoy moderate temperatures in {city_name}.",
                f"Temperate weather in {city_name} ensures comfort."
            ]
        weather_text = w_vars[len(city_name) % len(w_vars)]
    s_titles = [f"About {city_name}", f"Planning {city_name}"]
    ai_ov = connectivity_text + (chr(10)*2) + health_text + (chr(10)*2) + weather_text
    return {
        "seo_title": s_titles[len(city_name) % len(s_titles)],
        "meta_description": f"{connectivity_text} {weather_text} {health_text}".strip(),
        "ai_overview": ai_ov,
        "tags": [
            "High Pressure" if flight_score > 70 else "Calm Flows"
        ]
    }
'''

    pattern = r'def generate_smart_narrative.*?return \{.*?\}'
    new_content = re.sub(pattern, new_code, content, flags=re.DOTALL)
    
    if new_content == content:
        start_idx = content.find('def generate_smart_narrative')
        if start_idx != -1:
            ret_idx = content.find('return {', start_idx)
            end_idx = content.find('}', ret_idx) + 1
            new_content = content[:start_idx] + new_code + content[end_idx:]

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success: generate_smart_narrative updated.")
    else:
        print("Failure: Nothing matched in etl.py")

if __name__ == "__main__":
    apply_fix()
