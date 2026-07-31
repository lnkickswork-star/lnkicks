import os

with open('mobile.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('src="jordan_powder_blue.png"', 'src="jordan_powder_blue_nobg.png"')
content = content.replace('src="samba_og.png"', 'src="samba_og_nobg.png"')

with open('mobile.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("UPDATED mobile.html to use transparent Nike and Adidas shoes!")
