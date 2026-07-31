import os

latest_drops_html = """
        <!-- LATEST DROPS PRODUCT SLIDER CAROUSEL (MATCHING USER SCREENSHOT) -->
        <div class="latest-drops-section">
            <div class="latest-drops-header-row">
                <h2 class="latest-drops-title">LATEST DROPS</h2>
                <a href="#" class="latest-drops-explore">EXPLORE</a>
            </div>

            <div class="latest-drops-slider">
                
                <!-- CARD 1: AIR MAX PULSE -->
                <div class="drop-card">
                    <div class="drop-card-badge">NEW</div>
                    <button class="drop-card-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="drop-card-img">
                        <img src="af1_black_nobg.png" alt="Air Max Pulse">
                    </div>
                    <h3 class="drop-card-title">Air Max Pulse</h3>
                    <div class="drop-card-category">LIFESTYLE</div>
                    <div class="drop-card-price">&#8377;15,360</div>
                    <button class="btn-drop-add">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                        <span>Add</span>
                    </button>
                </div>

                <!-- CARD 2: JORDAN RETRO 4 -->
                <div class="drop-card">
                    <div class="drop-card-badge" style="background:#111;color:#fff;">HOT</div>
                    <button class="drop-card-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="drop-card-img" style="background:#111111;">
                        <img src="jordan_powder_blue_nobg.png" alt="Jordan Retro 4">
                    </div>
                    <h3 class="drop-card-title" style="color:#d97706;">Jordan Retro 4</h3>
                    <div class="drop-card-category">BASKETBALL</div>
                    <div class="drop-card-price">&#8377;20,160</div>
                    <button class="btn-drop-add">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                        <span>Add</span>
                    </button>
                </div>

                <!-- CARD 3: YEEZY BOOST 350 -->
                <div class="drop-card">
                    <div class="drop-card-badge">NEW</div>
                    <button class="drop-card-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="drop-card-img" style="background:#f4ece1;">
                        <img src="samba_og_nobg.png" alt="Yeezy Boost 350">
                    </div>
                    <h3 class="drop-card-title">Yeezy Boost 350</h3>
                    <div class="drop-card-category">LIFESTYLE</div>
                    <div class="drop-card-price">&#8377;22,080</div>
                    <button class="btn-drop-add">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                        <span>Add</span>
                    </button>
                </div>

                <!-- CARD 4: AIR JORDAN 1 LOW -->
                <div class="drop-card">
                    <div class="drop-card-badge">NEW</div>
                    <button class="drop-card-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="drop-card-img" style="background:#181818;">
                        <img src="nb_9060_nobg.png" alt="Air Jordan 1 Low">
                    </div>
                    <h3 class="drop-card-title">Air Jordan 1 Low</h3>
                    <div class="drop-card-category">LIFESTYLE</div>
                    <div class="drop-card-price">&#8377;10,560</div>
                    <button class="btn-drop-add">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                        <span>Add</span>
                    </button>
                </div>

            </div>
        </div>
"""

css_styles = """
/* LATEST DROPS SLIDER STYLES */
.latest-drops-section{
  margin-top:16px;
}
.latest-drops-header-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:16px;
}
.latest-drops-title{
  font-family:'Oswald',sans-serif;
  font-size:22px;
  font-weight:800;
  letter-spacing:0.04em;
  color:#111111;
  text-transform:uppercase;
}
.latest-drops-explore{
  font-size:12px;
  font-weight:700;
  letter-spacing:0.12em;
  color:#777777;
  text-decoration:underline;
}
.latest-drops-slider{
  display:flex;
  gap:16px;
  overflow-x:auto;
  scrollbar-width:none;
  padding-bottom:12px;
  margin:0 -20px;
  padding-left:20px;
  padding-right:20px;
}
.latest-drops-slider::-webkit-scrollbar{display:none}

.drop-card{
  min-width:180px;
  max-width:180px;
  background:#ffffff;
  border-radius:24px;
  padding:14px;
  display:flex;
  flex-direction:column;
  position:relative;
  box-shadow:0 6px 20px rgba(0,0,0,0.04);
  flex-shrink:0;
}
.drop-card-badge{
  position:absolute;
  top:12px;
  left:12px;
  background:#EAB308;
  color:#111111;
  font-family:'Oswald',sans-serif;
  font-size:9.5px;
  font-weight:800;
  padding:3px 10px;
  border-radius:12px;
  z-index:2;
}
.drop-card-heart{
  position:absolute;
  top:10px;
  right:10px;
  width:30px;
  height:30px;
  border-radius:50%;
  background:rgba(255,255,255,0.9);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#888888;
  z-index:2;
  border:none;
  box-shadow:0 2px 8px rgba(0,0,0,0.08);
}
.drop-card-img{
  height:140px;
  border-radius:16px;
  background:#F8F8FA;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:10px;
  padding:10px;
  overflow:hidden;
}
.drop-card-img img{
  max-height:110px;
  width:auto;
  object-fit:contain;
  filter:drop-shadow(0 8px 16px rgba(0,0,0,0.12));
}
.drop-card-title{
  font-size:14px;
  font-weight:700;
  color:#111111;
  line-height:1.2;
}
.drop-card-category{
  font-size:9.5px;
  font-weight:700;
  letter-spacing:0.12em;
  color:#aaaaaa;
  margin-top:2px;
}
.drop-card-price{
  font-size:14px;
  font-weight:800;
  color:#111111;
  margin-top:6px;
  margin-bottom:10px;
}
.btn-drop-add{
  background:#111111;
  color:#ffffff;
  border-radius:20px;
  padding:10px;
  font-size:12px;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border:none;
  cursor:pointer;
  width:100%;
}
"""

def update_mobile_page(filepath, is_backup=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    if '.latest-drops-section{' not in html:
        html = html.replace('</style>', css_styles + '\n</style>')
        
    categories_marker = '</div>\n        </div>\n\n        <!-- TRENDING NOW SECTION'
    if categories_marker in html:
        html = html.replace(categories_marker, '</div>\n        </div>\n\n' + latest_drops_html + '\n        <!-- TRENDING NOW SECTION')
    else:
        html = html.replace('<!-- TRENDING NOW SECTION', latest_drops_html + '\n        <!-- TRENDING NOW SECTION')

    if is_backup:
        html = html.replace('src="af1_black_nobg.png"', 'src="../af1_black_nobg.png"') \
                   .replace('src="jordan_powder_blue_nobg.png"', 'src="../jordan_powder_blue_nobg.png"') \
                   .replace('src="samba_og_nobg.png"', 'src="../samba_og_nobg.png"') \
                   .replace('src="nb_9060_nobg.png"', 'src="../nb_9060_nobg.png"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {filepath} with LATEST DROPS product slider!")

update_mobile_page('mobile.html')
update_mobile_page('mobile_screens/screen3_homepage.html', is_backup=True)
