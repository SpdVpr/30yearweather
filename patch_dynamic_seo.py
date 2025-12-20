
import os

def patch_dynamic_seo():
    file_path = 'backend/etl.py'
    if not os.path.exists(file_path):
        print("etl.py not found")
        return

    # Using chr(10) to avoid any backslash mangling during patch injection
    lines = [
        "def generate_smart_narrative(config, yearly_stats, flight_data, health_data, weather_stats=None):",
        "    import random",
        "    city_name = config['name']",
        "    country_name = config['country']",
        "    connectivity_text = ''",
        "    flight_score = 0",
        "    if flight_data:",
        "        flight_score = flight_data.get('pressure_score', 0)",
        "        p_arrivals = flight_data.get('peak_daily_arrivals', 0)",
        "        c_variants = []",
        "        if flight_score > 80:",
        "            c_variants = [",
        "                f'{city_name} stands as a premier global destination with massive arrival volumes, supported by {p_arrivals:,} estimated daily flights.',",
        "                f'As a major international gateway, {city_name} offers unparalleled accessibility for global travelers.',",
        "                f'Travel dynamics for {city_name} are characterized by high-frequency connections and significant tourist throughput.'",
        "            ]",
        "        elif flight_score > 50:",
        "            c_variants = [",
        "                f'{city_name} is highly accessible via major regional hubs, making it a convenient choice for international visitors.',",
        "                f'With stable flight pressure, {city_name} maintains consistently good connectivity throughout the year.',",
        "                f'Reaching {city_name} is straightforward thanks to its integration into key travel corridors.'",
        "            ]",
        "        else:",
        "            c_variants = [",
        "                f'{city_name} offers a more intimate travel experience with selective flight connectivity.',",
        "                f'For those seeking a path less traveled, {city_name} provides a tranquil escape with managed arrival flows.',",
        "                f'Accessing {city_name} usually involves regional transfers, emphasizing its status as a specialized destination.'",
        "            ]",
        "        connectivity_text = c_variants[len(city_name) % len(c_variants)]",
        "        routes = flight_data.get('top_routes', [])",
        "        if routes:",
        "            top_3 = ', '.join([r.split('(')[0].strip() for r in routes[:3]])",
        "            connectivity_text += f' Visitors frequently arrive from {top_3}.'",
        "    health_text = ''",
        "    vaccine_count = 0",
        "    if health_data:",
        "        vaccines = health_data.get('vaccines', [])",
        "        vaccine_count = len(vaccines)",
        "        h_variants = []",
        "        if vaccine_count > 6:",
        "            h_variants = [",
        "                f'Preparing for {country_name} involves detailed health considerations, including checks for {vaccines[0][\"disease\"]} and local advisories.',",
        "                f'Health preparedness is a key part of the {city_name} experience; consulting a travel clinic before departure is highly recommended.',",
        "                f'Travelers to {city_name} should prioritize high-standard medical prep to ensure a smooth stay in {country_name}.'",
        "            ]",
        "        elif vaccine_count > 0:",
        "            h_variants = [",
        "                f'Standard international travel protocols apply for {city_name}, ensuring core immunizations are current.',",
        "                f'Visiting {city_name} is generally smooth from a health perspective, with routine wellness checks being sufficient.',",
        "                f'Keep your health records handy for your {country_name} trip, as standard travel wellness is prioritized here.'",
        "            ]",
        "        else:",
        "            h_variants = ['Routine health standards make this a straightforward destination for most global travelers.']",
        "        health_text = h_variants[len(city_name) % len(h_variants)]",
        "    weather_text = ''",
        "    if yearly_stats:",
        "        avg_temp = yearly_stats.get('avg_temp_annual', 15)",
        "        w_variants = []",
        "        if avg_temp > 22:",
        "            w_variants = [",
        "                f'The climate in {city_name} is defined by its warm, tropical character, perfect for sun-seekers.',",
        "                f\"{city_name} enjoys a radiant heat profile that remains consistent across most seasons.\",",
        "                f'Expect vibrant, sun-drenched days with the classic warmth associated with {country_name}.'",
        "            ]",
        "        elif avg_temp < 10:",
        "            w_variants = [",
        "                f'{city_name} is a haven for those who enjoy crisp, cool air and authentic seasonal shifts.',",
        "                f'The colder climate of {city_name} adds a unique charm to its architecture and local lifestyle.',",
        "                f'Prepare for a refreshing, cooler environment that sets {city_name} apart from tropical hubs.'",
        "            ]",
        "        else:",
        "            w_variants = [",
        "                f'Enjoy a balanced temperate climate in {city_name}, featuring moderate temperatures year-round.',",
        "                f'The mild weather of {city_name} makes it suitable for exploration at any time of day.',",
        "                f\"{city_name} provides a comfortable climatic backdrop for both urban and nature activities.\"",
        "            ]",
        "        weather_text = w_variants[len(city_name) % len(w_variants)]",
        "    s_titles = [",
        "        f'Travel Guide to {city_name}: Weather & Logistics',",
        "        f'Planning {city_name}: Flights, Health & Climate',",
        "        f'Visiting {city_name}, {country_name} - Historical Insights',",
        "        f'{city_name} Travel Intelligence: What to Expect'",
        "    ]",
        "    ai_desc = connectivity_text + (chr(10)*2) + health_text + (chr(10)*2) + weather_text",
        "    return {",
        "        'seo_title': s_titles[len(city_name) % len(s_titles)],",
        "        'meta_description': f'{connectivity_text} {weather_text} {health_text}'.strip(),",
        "        'ai_overview': ai_desc,",
        "        'tags': [",
        "            'High Traffic' if flight_score > 60 else 'Hidden Gem',",
        "            'Medical Prep' if vaccine_count > 5 else 'Easy Access',",
        "            'Tropical' if yearly_stats.get('avg_temp_annual', 0) > 20 else 'Temperate'",
        "        ]",
        "    }"
    ]
    
    new_func_code = "\n".join(lines)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    import re
    pattern = r'def generate_smart_narrative.*?return \{.*?\}'
    new_content = re.sub(pattern, new_func_code, content, flags=re.DOTALL)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully updated generate_smart_narrative using chr(10).")
    else:
        print("Failed to replace generate_smart_narrative.")

if __name__ == "__main__":
    patch_dynamic_seo()
