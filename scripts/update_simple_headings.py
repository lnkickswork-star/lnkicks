import os

def update_headings(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Playfair Display italic styles with clean, simple, bold Oswald sans-serif font
    content = content.replace(
        "font-family:'Playfair Display',serif;\n  font-size:34px;\n  font-weight:700;\n  font-style:italic;",
        "font-family:'Oswald',sans-serif;\n  font-size:32px;\n  font-weight:800;\n  font-style:normal;\n  text-transform:uppercase;"
    )
    
    content = content.replace(
        "font-family:'Playfair Display',serif;\n  font-size:22px;\n  font-weight:700;\n  font-style:italic;",
        "font-family:'Oswald',sans-serif;\n  font-size:22px;\n  font-weight:800;\n  font-style:normal;\n  text-transform:uppercase;"
    )
    
    content = content.replace(".section-title-italic{", ".section-title-italic{\n  font-family:'Oswald',sans-serif;\n  font-style:normal;\n  font-weight:800;\n  text-transform:uppercase;")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated headings in {filepath}")

update_headings('mobile.html')
update_headings('mobile_screens/screen3_homepage.html')
