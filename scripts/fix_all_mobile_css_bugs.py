import os

def fix_mobile_css(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Fix .splash-screen.hide to use display: none !important;
    html = html.replace('.splash-screen.hide{\n  transform:translate(-50%, -100%);\n  opacity:0;\n  pointer-events:none;\n}',
                        '.splash-screen.hide{\n  display:none !important;\n  opacity:0;\n  pointer-events:none;\n}')
    html = html.replace('.splash-screen.hide{', '.splash-screen.hide{\n  display:none !important;')

    # 2. Fix .next-drop-card and .next-drop-shoe-container CSS
    old_next_drop_css = """.next-drop-card{
  background:#F8F8FA;
  border-radius:28px;
  padding:28px 20px 24px;
  text-align:center;
  display:flex;
  flex-direction:column;
  align-items:center;
  position:relative;
  box-shadow:0 8px 24px rgba(0,0,0,0.03);
  margin-top:10px;
}"""

    new_next_drop_css = """.next-drop-card{
  background:#ffffff;
  border-radius:28px;
  padding:24px 20px;
  text-align:center;
  display:flex;
  flex-direction:column;
  align-items:center;
  position:relative;
  box-shadow:0 6px 20px rgba(0,0,0,0.04);
  margin-top:10px;
  overflow:hidden;
}"""
    if old_next_drop_css in html:
        html = html.replace(old_next_drop_css, new_next_drop_css)

    # 3. Clean up .next-drop-shoe-container height & max-width
    html = html.replace('height:160px;', 'height:110px;')
    html = html.replace('max-height:150px;', 'max-height:100px;max-width:100%;')

    # 4. Make sure app-viewport allows proper smooth scrolling
    html = html.replace('overflow:hidden;\n  box-shadow:0 0 40px rgba(0,0,0,0.5);\n  display:flex;',
                        'overflow-x:hidden;\n  overflow-y:auto;\n  box-shadow:0 0 40px rgba(0,0,0,0.5);\n  display:flex;')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"FIXED all splash screen and CSS bugs in {filepath}")

fix_mobile_css('mobile.html')
fix_mobile_css('mobile_screens/screen3_homepage.html')
