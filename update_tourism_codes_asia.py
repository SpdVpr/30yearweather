import os

path = 'backend/etl_tourism.py'
try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    country_codes_asia = """COUNTRY_CODES = {
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
    'jp': 'JP',  # Japan
    'kr': 'KR',  # South Korea
    'cn': 'CN',  # China
    'hk': 'HK',  # Hong Kong
    'tw': 'TW',  # Taiwan (Note: World Bank might use specific code or omit, assume TW for now)
    'th': 'TH',  # Thailand
    'sg': 'SG',  # Singapore
    'my': 'MY',  # Malaysia
    'vn': 'VN',  # Vietnam
    'id': 'ID',  # Indonesia
    'ph': 'PH',  # Philippines
    'in': 'IN',  # India
    'ae': 'AE',  # UAE
    'tr': 'TR',  # Turkey
}"""

    # We need to find the block we inserted previously
    start_marker = "COUNTRY_CODES = {"
    end_marker = "'gr': 'GR',  # Greece"
    
    start_idx = content.find(start_marker)
    if start_idx != -1:
        # Find closing brace after start
        brace_idx = content.find("}", start_idx)
        if brace_idx != -1:
            old_block = content[start_idx:brace_idx+1]
            new_content = content.replace(old_block, country_codes_asia)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully updated etl_tourism.py with Asian codes")
        else:
            print("Could not find closing brace")
    else:
        print("Could not find COUNTRY_CODES block")

except Exception as e:
    print(f"Error: {e}")
