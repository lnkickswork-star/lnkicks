import os

premium_footer_css = """
/* PREMIUM LUXURY DARK CYLINDRICAL FLOATING PILL FOOTER */
.app-bottom-nav{
  position:fixed;
  bottom:16px;
  left:50%;
  transform:translateX(-50%);
  width:calc(100% - 32px);
  max-width:408px;
  height:68px;
  background:#111111;
  border-radius:36px;
  border:1px solid rgba(255,255,255,0.14);
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  align-items:center;
  z-index:1000;
  box-shadow:0 16px 40px rgba(0,0,0,0.38);
  padding:0 8px;
  backdrop-filter:blur(16px);
}
.nav-item{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
  color:rgba(255,255,255,0.7);
  font-size:10.5px;
  font-weight:600;
  text-decoration:none;
  transition:all 0.2s ease;
}
.nav-item svg{
  width:20px;
  height:20px;
  stroke:rgba(255,255,255,0.85);
}
.nav-item.active{
  color:#ffffff;
}
.nav-item-pill{
  background:#ffffff;
  padding:8px 20px;
  border-radius:24px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#111111;
  box-shadow:0 6px 18px rgba(255,255,255,0.22);
}
.nav-item-pill svg{
  stroke:#111111 !important;
  color:#111111 !important;
}
.nav-item-pill span{
  font-size:11px;
  font-weight:800;
  letter-spacing:0.04em;
  color:#111111;
}
"""

def update_mobile_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace old footer css with premium_footer_css
    if '/* CYLINDRICAL FLOATING PILL' in html:
        old_css_start = html.find('/* CYLINDRICAL FLOATING PILL')
        old_css_end = html.find('</style>', old_css_start)
        html = html[:old_css_start] + premium_footer_css + '\n' + html[old_css_end:]
    elif '/* STICKY BOTTOM APP NAVIGATION BAR' in html:
        old_css_start = html.find('/* STICKY BOTTOM APP NAVIGATION BAR')
        old_css_end = html.find('</style>', old_css_start)
        html = html[:old_css_start] + premium_footer_css + '\n' + html[old_css_end:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {filepath} with Premium Dark Cylindrical Footer!")

update_mobile_page('mobile.html')
update_mobile_page('mobile_screens/screen3_homepage.html')
