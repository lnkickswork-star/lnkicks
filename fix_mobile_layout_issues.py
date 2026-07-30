import os

def fix_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Fix .next-drop-shoe-container and image sizing
    old_shoe_css = """.next-drop-shoe-container{
  width:100%;
  height:160px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:4px 0 12px;
}
.next-drop-shoe-container img{
  max-height:150px;
  width:auto;
  object-fit:contain;
  filter:drop-shadow(0 14px 24px rgba(0,0,0,0.15));
}"""

    fixed_shoe_css = """.next-drop-shoe-container{
  width:100%;
  max-width:240px;
  height:120px;
  margin:10px auto;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  overflow:hidden;
}
.next-drop-shoe-container img{
  max-height:110px;
  max-width:100%;
  width:auto;
  object-fit:contain;
  filter:drop-shadow(0 8px 18px rgba(0,0,0,0.18));
}"""

    if old_shoe_css in html:
        html = html.replace(old_shoe_css, fixed_shoe_css)
    else:
        # Replace any variation
        html = html.replace(".next-drop-shoe-container img{", ".next-drop-shoe-container img{max-height:110px!important;max-width:100%!important;")

    # Ensure all mobile images have max-width: 100%
    if 'img{max-width:100%}' not in html:
        html = html.replace('*,*::before,*::after{', '*,*::before,*::after{\n  img{max-width:100%}\n')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"FIXED image overflow and container height in {filepath}")

fix_page('mobile.html')
fix_page('mobile_screens/screen3_homepage.html')
