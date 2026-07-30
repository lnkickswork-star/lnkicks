import os

# New Products to append inside .trending-products-grid
extra_products_html = """
                <!-- PRODUCT 5 -->
                <div class="mob-product-card">
                    <span class="mob-badge-sale">18% OFF</span>
                    <button class="mob-btn-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="mob-card-img-wrap">
                        <img src="puma_velo_nobg.png" alt="Puma Velophasis">
                    </div>
                    <span class="mob-card-brand">PUMA</span>
                    <h3 class="mob-card-title">Puma Velophasis Hype Edition</h3>
                    <div class="mob-card-price">&#8377;8,499.00 <span class="orig">&#8377;14,999.00</span></div>
                </div>

                <!-- PRODUCT 6 -->
                <div class="mob-product-card">
                    <span class="mob-badge-sale" style="background:#111;color:#fff;">LIMITED</span>
                    <button class="mob-btn-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="mob-card-img-wrap">
                        <img src="samba_og_nobg.png" alt="Yeezy Foam Runner">
                    </div>
                    <span class="mob-card-brand">YEEZY</span>
                    <h3 class="mob-card-title">Yeezy Foam Runner Carbon</h3>
                    <div class="mob-card-price">&#8377;11,999.00 <span class="orig">&#8377;17,999.00</span></div>
                </div>
"""

# Updated CSS for Cylindrical Floating Pill Bottom Navigation Footer
cylindrical_footer_css = """
/* CYLINDRICAL FLOATING PILL BOTTOM NAVIGATION BAR */
.app-bottom-nav{
  position:fixed;
  bottom:16px;
  left:50%;
  transform:translateX(-50%);
  width:calc(100% - 32px);
  max-width:408px;
  height:66px;
  background:#ffffff;
  border-radius:36px;
  border:1px solid rgba(0,0,0,0.06);
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  align-items:center;
  z-index:1000;
  box-shadow:0 12px 32px rgba(0,0,0,0.12);
  padding:0 8px;
}
.nav-item{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
  color:#888888;
  font-size:10.5px;
  font-weight:600;
  text-decoration:none;
}
.nav-item.active{
  color:#111111;
}
.nav-item-pill{
  background:#111111;
  padding:8px 20px;
  border-radius:24px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#ffffff;
  box-shadow:0 4px 14px rgba(0,0,0,0.18);
}
.nav-item-pill svg{color:#ffffff;}
.nav-item-pill span{font-size:11px;font-weight:700;letter-spacing:0.04em;}
.nav-item svg{width:20px;height:20px}
.mobile-home-container{
  padding:44px 20px 110px;
}
"""

def update_mobile_page(filepath, is_backup=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add 2 more products to Trending Now grid
    product_4_marker = '<!-- PRODUCT 4 -->'
    if product_4_marker in html and '<!-- PRODUCT 5 -->' not in html:
        # Find where product 4 ends
        p4_end = html.find('</div>\n\n            </div>\n        </div>', html.find(product_4_marker))
        if p4_end != -1:
            html = html[:p4_end + 6] + extra_products_html + html[p4_end + 6:]

    # 2. Update Cylindrical Footer CSS
    if '/* CYLINDRICAL FLOATING PILL' not in html:
        html = html.replace('/* STICKY BOTTOM APP NAVIGATION BAR', cylindrical_footer_css + '\n/* STICKY BOTTOM APP NAVIGATION BAR')

    if is_backup:
        html = html.replace('src="puma_velo_nobg.png"', 'src="../puma_velo_nobg.png"') \
                   .replace('src="samba_og_nobg.png"', 'src="../samba_og_nobg.png"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {filepath} with 2 new Trending products and Cylindrical Floating Footer!")

update_mobile_page('mobile.html')
update_mobile_page('mobile_screens/screen3_homepage.html', is_backup=True)
