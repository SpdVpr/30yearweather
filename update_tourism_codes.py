import os

path = 'backend/etl_tourism.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

country_codes_new = """COUNTRY_CODES = {
    'cz': 'CZ',  # Czech Republic
    'de': 'DE',  # Germany
    'fr': 'FR',  # France
    'at': 'AT',  # Austria
    'it': 'IT',  # Italy
    'es': 'ES',  # Spain
    'uk': 'GB',  # United Kingdom
    'pl': 'PL',  # Poland
    'nl': 'NL',  # Netherlands
    'be': 'BE',  # Belgium
    'hu': 'HU',  # Hungary
    'pt': 'PT',  # Portugal
    'ie': 'IE',  # Ireland
    'se': 'SE',  # Sweden
    'dk': 'DK',  # Denmark
    'no': 'NO',  # Norway
    'fi': 'FI',  # Finland
    'sk': 'SK',  # Slovakia
    'gr': 'GR',  # Greece
}"""

# Exact block from previous view
block_to_replace = """COUNTRY_CODES = {
    'cz': 'CZ',  # Czech Republic
    'de': 'DE',  # Germany
    'fr': 'FR',  # France
    'at': 'AT',  # Austria
    'it': 'IT',  # Italy
    'es': 'ES',  # Spain
    'uk': 'GB',  # United Kingdom
    'pl': 'PL',  # Poland
}"""

if block_to_replace in content:
    new_content = content.replace(block_to_replace, country_codes_new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated etl_tourism.py")
else:
    # Fallback: finding roughly where it is
    print("Exact match failed. Trying relaxed match...")
    # This serves as a debug step if indentation was wrong
    start = content.find("COUNTRY_CODES = {")
    if start != -1:
        end = content.find("}", start)
        if end != -1:
            print(f"Found block from {start} to {end}")
            old_block = content[start:end+1]
            print(f"Old block:\n{old_block}")
            new_content = content.replace(old_block, country_codes_new)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Replaced using start/end indices.")
        else:
            print("Could not find closing brace.")
    else:
        print("Could not find COUNTRY_CODES start.")
