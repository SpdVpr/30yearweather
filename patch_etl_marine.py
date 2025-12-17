
import os

etl_path = os.path.join('backend', 'etl.py')

with open(etl_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add time import if missing (it usually is there but let's check) -- actually it is imported as it is used elsewhere usually.
# If not, I should add it. But 'etl.py' likely has 'import time'.

# 2. Patch the retry loop
original_loop = """    # Retry logic
    for attempt in range(3):
        try:
            response = requests.get(url, params=params, timeout=20, verify=False)"""

patched_loop = """    # Retry logic
    for attempt in range(5):
        if attempt > 0:
            import time
            time.sleep(5 * attempt)
        try:
            import time
            # Rate limit protection for Marine API
            time.sleep(2) 
            response = requests.get(url, params=params, timeout=20, verify=False)"""

content = content.replace(original_loop, patched_loop)

# 3. Patch the exception handling to handle 429 specifically
original_except = """        except requests.exceptions.RequestException as e:
            print(f"   ⚠️  Marine fetch failed (attempt {attempt+1}): {e}")"""

patched_except = """        except requests.exceptions.RequestException as e:
            print(f"   ⚠️  Marine fetch failed (attempt {attempt+1}): {e}")
            if "429" in str(e):
                print("   🛑 Rate limit hit! Waiting 20s...")
                import time
                time.sleep(20)"""

content = content.replace(original_except, patched_except)

with open(etl_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Patched etl.py with Marine API rate limiting")
