
import os

def fix_syntax_error():
    file_path = 'backend/etl.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # We look for the broken lines around 1132
    # The broken block looks lke:
    # "ai_overview": f"{connectivity_text}
    #
    # {health_text}
    #
    # {weather_text}",
    
    new_lines = []
    skip = False
    
    for i, line in enumerate(lines):
        if skip:
            skip = False
            continue
            
        if '"ai_overview": f"{connectivity_text}' in line.strip():
            # We found the broken start. 
            # We want to replace this and the next few lines with a valid one-liner or triple quote.
            
            # Let's verify context by peeking ahead?
            # Actually, simply replacing the block is safer.
            
            # Construct valid line
            # "ai_overview": f"{connectivity_text}\n\n{health_text}\n\n{weather_text}",
            
            valid_line = '        "ai_overview": f"{connectivity_text}\\n\\n{health_text}\\n\\n{weather_text}",\n'
            new_lines.append(valid_line)
            
            # We need to skip the next 4 lines (broken parts)
            # The broken part ends with {weather_text}",
            
            # Let's implement a smarter skip loop
            # We consume next lines until we find the closing quote
            j = i + 1
            while j < len(lines):
                if '{weather_text}",' in lines[j]:
                    # This is the last line of the broken block
                    # Skip it too (since we replaced the whole thing)
                    # And proceed loop from j+1
                    # But the main loop uses enumerate. 
                    # We can sets line[j] to None/Empty or use a while loop for main.
                    pass 
                    break
                j += 1
            
            # Since I can't easily jump the enumerate iterator, I will use a different approach.
            # I will just write the file completely using string replacement if unique.
            break 
    else:
        # If loop finished without break, we didn't use the simple break logic
        pass

    # Alternative: Read whole content and replace the specific broken string pattern
    # The broken string pattern in content is:
    # f"{connectivity_text}\n\n{health_text}\n\n{weather_text}"
    # BUT in the file it appears as literal newlines.
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The broken literal string in the file:
    broken_pattern = '''"ai_overview": f"{connectivity_text}

{health_text}

{weather_text}",'''

    # The fixed pattern
    fixed_pattern = '''"ai_overview": f"{connectivity_text}\\n\\n{health_text}\\n\\n{weather_text}",'''

    if broken_pattern in content:
        new_content = content.replace(broken_pattern, fixed_pattern)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Fixed syntax error via string replacement.")
    else:
        print("Could not find exact broken pattern. Manual fix needed?")
        # Debugging: print what it sees
        # print(content[45000:46000]) # approximate location

if __name__ == "__main__":
    fix_syntax_error()
