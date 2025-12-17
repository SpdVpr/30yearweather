
import os

path = os.path.join('backend', 'etl_tourism.py')

# New complete dictionary including all 84 cities' countries
NEW_CODES_BLOCK = """COUNTRY_CODES = {
    # Europe
    'cz': 'CZ', 'de': 'DE', 'fr': 'FR', 'at': 'AT', 'it': 'IT',
    'es': 'ES', 'uk': 'GB', 'pl': 'PL', 'nl': 'NL', 'be': 'BE',
    'hu': 'HU', 'pt': 'PT', 'ie': 'IE', 'se': 'SE', 'dk': 'DK',
    'no': 'NO', 'fi': 'FI', 'sk': 'SK', 'hr': 'HR', 'gr': 'GR',
    'ch': 'CH', 'is': 'IS', 'tr': 'TR',
    
    # North America
    'us': 'US', 'ca': 'CA', 'mx': 'MX', 'do': 'DO', 'bs': 'BS',
    'pr': 'PR', 'jm': 'JM',
    
    # South America
    'br': 'BR', 'ar': 'AR', 'pe': 'PE', 'cl': 'CL', 'co': 'CO',
    
    # Asia & Middle East
    'jp': 'JP', 'kr': 'KR', 'cn': 'CN', 'hk': 'HK', 'tw': 'TW',
    'th': 'TH', 'sg': 'SG', 'my': 'MY', 'vn': 'VN', 'id': 'ID',
    'ph': 'PH', 'in': 'IN', 'ae': 'AE', 'mv': 'MV',
    
    # Oceania
    'au': 'AU', 'nz': 'NZ', 'pf': 'PF',
    
    # Africa
    'za': 'ZA', 'ma': 'MA', 'tz': 'TZ'
}"""

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Naive replacement: Find the variable start and try to replace until closing brace.
# Since python dicts can be messy, I'll use a marker based on what I saw in `Get-Content`.
# It started with 'cz': 'CZ'.

if "COUNTRY_CODES = {" in content:
    # Find start index
    start_idx = content.find("COUNTRY_CODES = {")
    # Find end index - look for the closing brace after 'sk': 'SK' which was the last one in preview
    # Actually, counting braces is safer.
    
    brace_count = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i + 1
                break
    
    if end_idx != -1:
        old_block = content[start_idx:end_idx]
        new_content = content.replace(old_block, NEW_CODES_BLOCK)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Updated COUNTRY_CODES in etl_tourism.py")
    else:
        print("❌ Could not find end of dictionary")
else:
    print("❌ Could not find COUNTRY_CODES variable")
