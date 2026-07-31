with open('mobile.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'next-drop' in line or 'banner-shoe-img' in line or 'splash-shoe' in line or '<img' in line:
        print(f"Line {i+1}: {line.strip()[:120]}")
