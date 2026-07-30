import os

notify_and_categories_html = """
        <!-- NEXT DROP COUNTDOWN & NOTIFY ME CARD (MATCHING USER SCREENSHOT) -->
        <div class="next-drop-card">
            <div class="next-drop-badge">NEXT DROP</div>
            <h3 class="next-drop-title">DUNK HIGH 'DEEP ROYAL'</h3>
            <div class="next-drop-sub">Exclusively for LNKICKS Members</div>
            
            <div class="next-drop-shoe-container">
                <img src="jordan_powder_blue_nobg.png" alt="Dunk High Deep Royal">
            </div>

            <!-- LIVE COUNTDOWN TIMER -->
            <div class="countdown-timer-row">
                <div class="countdown-unit">
                    <div class="countdown-val">02</div>
                    <div class="countdown-lbl">DAYS</div>
                </div>
                <div class="countdown-colon">:</div>
                <div class="countdown-unit">
                    <div class="countdown-val">13</div>
                    <div class="countdown-lbl">HOURS</div>
                </div>
                <div class="countdown-colon">:</div>
                <div class="countdown-unit">
                    <div class="countdown-val">59</div>
                    <div class="countdown-lbl">MINUTES</div>
                </div>
                <div class="countdown-colon">:</div>
                <div class="countdown-unit">
                    <div class="countdown-val countdown-sec" id="timer-seconds">39</div>
                    <div class="countdown-lbl">SECONDS</div>
                </div>
            </div>

            <button class="btn-notify-me" onclick="alert('Notification set! You will be alerted when Dunk High Deep Royal drops.')">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span>NOTIFY ME</span>
            </button>
        </div>

        <!-- CATEGORIES SECTION (MATCHING USER SCREENSHOT) -->
        <div class="categories-section">
            <div class="categories-header-row">
                <h2 class="categories-title">CATEGORIES</h2>
                <a href="#" class="categories-view-all">VIEW ALL</a>
            </div>

            <div class="categories-icons-slider">
                <!-- ADIDAS -->
                <div class="cat-icon-card">
                    <div class="cat-tile">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>
                    </div>
                    <div class="cat-tile-name">ADIDAS</div>
                </div>

                <!-- NIKE -->
                <div class="cat-icon-card">
                    <div class="cat-tile">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    </div>
                    <div class="cat-tile-name">NIKE</div>
                </div>

                <!-- PUMA -->
                <div class="cat-icon-card">
                    <div class="cat-tile">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v5"/></svg>
                    </div>
                    <div class="cat-tile-name">PUMA</div>
                </div>

                <!-- REEBOK -->
                <div class="cat-icon-card">
                    <div class="cat-tile">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    </div>
                    <div class="cat-tile-name">REEBOK</div>
                </div>

                <!-- ONITSUKA TIGER -->
                <div class="cat-icon-card">
                    <div class="cat-tile">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div class="cat-tile-name">ONITSUKA TIGER</div>
                </div>

                <!-- JORDAN -->
                <div class="cat-icon-card">
                    <div class="cat-tile">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 4 3 12h14l3-12-6 7-4-5-4 5-6-7z"/></svg>
                    </div>
                    <div class="cat-tile-name">JORDAN</div>
                </div>
            </div>
        </div>
"""

css_styles = """
/* NEXT DROP CARD STYLES */
.next-drop-card{
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
}
.next-drop-badge{
  background:#111111;
  color:#ffffff;
  font-family:'Oswald',sans-serif;
  font-size:10px;
  font-weight:800;
  letter-spacing:0.14em;
  padding:5px 14px;
  border-radius:14px;
  margin-bottom:12px;
}
.next-drop-title{
  font-family:'Oswald',sans-serif;
  font-size:26px;
  font-weight:800;
  color:#111111;
  letter-spacing:-0.01em;
  line-height:1.1;
}
.next-drop-sub{
  font-size:13px;
  color:#777777;
  margin-top:4px;
  margin-bottom:12px;
}
.next-drop-shoe-container{
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
}
.countdown-timer-row{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  margin-bottom:20px;
}
.countdown-unit{
  display:flex;
  flex-direction:column;
  align-items:center;
}
.countdown-val{
  font-family:'Oswald',sans-serif;
  font-size:28px;
  font-weight:800;
  color:#111111;
  line-height:1;
}
.countdown-sec{
  color:#FF3B30;
}
.countdown-lbl{
  font-size:9px;
  font-weight:700;
  color:#aaaaaa;
  letter-spacing:0.1em;
  margin-top:4px;
}
.countdown-colon{
  font-family:'Oswald',sans-serif;
  font-size:20px;
  font-weight:700;
  color:#cccccc;
  margin-top:-12px;
}
.btn-notify-me{
  background:#111111;
  color:#ffffff;
  font-family:'Oswald',sans-serif;
  font-size:14px;
  font-weight:700;
  letter-spacing:0.12em;
  padding:14px 36px;
  border-radius:30px;
  display:inline-flex;
  align-items:center;
  gap:10px;
  border:none;
  cursor:pointer;
  box-shadow:0 8px 20px rgba(0,0,0,0.18);
  transition:transform 0.2s;
}
.btn-notify-me:active{
  transform:scale(0.96);
}

/* CATEGORIES SECTION STYLES */
.categories-section{
  margin-top:10px;
}
.categories-header-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:16px;
}
.categories-title{
  font-family:'Oswald',sans-serif;
  font-size:20px;
  font-weight:800;
  letter-spacing:0.04em;
  color:#111111;
}
.categories-view-all{
  font-size:12px;
  font-weight:700;
  letter-spacing:0.08em;
  color:#777777;
  text-decoration:underline;
}
.categories-icons-slider{
  display:flex;
  gap:14px;
  overflow-x:auto;
  scrollbar-width:none;
  padding-bottom:10px;
  margin:0 -20px;
  padding-left:20px;
  padding-right:20px;
}
.categories-icons-slider::-webkit-scrollbar{display:none}
.cat-icon-card{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  flex-shrink:0;
}
.cat-tile{
  width:64px;
  height:64px;
  border-radius:20px;
  background:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#111111;
  box-shadow:0 4px 16px rgba(0,0,0,0.04);
  border:1px solid rgba(0,0,0,0.03);
}
.cat-tile-name{
  font-size:10px;
  font-weight:700;
  letter-spacing:0.06em;
  color:#111111;
}
"""

# Insert css_styles into <style> and notify_and_categories_html below Hot Deals in mobile.html
def update_mobile_page(filepath, is_backup=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    if '.next-drop-card{' not in html:
        html = html.replace('</style>', css_styles + '\n</style>')
        
    hot_deals_marker = '</div>\n        </div>\n\n        <!-- TRENDING NOW SECTION'
    if hot_deals_marker in html:
        html = html.replace(hot_deals_marker, '</div>\n        </div>\n\n' + notify_and_categories_html + '\n        <!-- TRENDING NOW SECTION')
    else:
        # Fallback placement
        html = html.replace('<!-- TRENDING NOW SECTION', notify_and_categories_html + '\n        <!-- TRENDING NOW SECTION')

    if is_backup:
        html = html.replace('src="jordan_powder_blue_nobg.png"', 'src="../jordan_powder_blue_nobg.png"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {filepath} with Next Drop Notify card and Categories!")

update_mobile_page('mobile.html')
update_mobile_page('mobile_screens/screen3_homepage.html', is_backup=True)
