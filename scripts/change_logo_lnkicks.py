import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace KM / KICKS MACHINE brand references with LNKICKS
content = content.replace('<div class="logo-mark">KM</div>', '<div class="logo-mark">LNKICKS</div>')
content = content.replace('<div class="logo-text">KICKS MACHINE</div>', '<div class="logo-text">STOCK &amp; LOADED</div>')
content = content.replace('KICKS MACHINE', 'LNKICKS')
content = content.replace('<title>Kicks Machine — Stocked &amp; Loaded</title>', '<title>LNKICKS — Stocked &amp; Loaded</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("UPDATED Logo and brand text from KM / KICKS MACHINE to LNKICKS!")
