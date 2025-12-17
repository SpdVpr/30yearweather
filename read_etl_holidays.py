
with open('backend/etl.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i in range(970, 1000):
        if i < len(lines):
            print(f"{i+1}: {lines[i]}", end='')
