import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
js_dir = os.path.join(project_dir, "js")
os.makedirs(js_dir, exist_ok=True)

# 1. Create production Discovery Engine js/discovery_engine.js
discovery_engine_js = """/* =========================================================
   LNKICKS PRODUCT DISCOVERY & SEARCH ENGINE (DISCOVERY_ENGINE.JS)
   ========================================================= */

(function(){
    document.addEventListener('DOMContentLoaded', function(){
        const page = window.location.pathname.split('/').pop();
        const urlParams = new URLSearchParams(window.location.search);

        // Catalog Database
        const catalog = [
            { id: 'jordan-1-powder-blue', name: 'Air Jordan 1 Low Black Powder Blue', brand: 'NIKE', category: 'Sneakers', price: 8899, origPrice: 18899, image: 'jordan_powder_blue_nobg.png', sku: 'AJ1-PB-01', gender: 'Unisex', date: '2026-07-01' },
            { id: 'samba-og-white', name: 'Samba OG Cloud White Core Black', brand: 'ADIDAS', category: 'Sneakers', price: 9499, origPrice: 16999, image: 'samba_og_nobg.png', sku: 'SAMBA-OG-02', gender: 'Unisex', date: '2026-06-15' },
            { id: 'nike-af1-black', name: 'Nike Air Force 1 Low Triple Black', brand: 'NIKE', category: 'Sneakers', price: 6999, origPrice: 10999, image: 'af1_black_nobg.png', sku: 'AF1-BLK-03', gender: 'Men', date: '2026-07-20' },
            { id: 'puma-velophasis', name: 'Puma Velophasis Luxury Edition', brand: 'PUMA', category: 'Sneakers', price: 8499, origPrice: 14999, image: 'puma_velo_nobg.png', sku: 'PUMA-VELO-04', gender: 'Unisex', date: '2026-05-10' },
            { id: 'nb-9060-sea-salt', name: 'New Balance 9060 Sea Salt Gold', brand: 'NEW BALANCE', category: 'Sneakers', price: 12999, origPrice: 19999, image: 'nb_9060_nobg.png', sku: 'NB-9060-05', gender: 'Men', date: '2026-07-25' },
            { id: 'yeezy-foam-runner', name: 'Yeezy Foam Runner Carbon', brand: 'YEEZY', category: 'Luxury', price: 11999, origPrice: 17999, image: 'samba_og_nobg.png', sku: 'YZY-FOAM-06', gender: 'Unisex', date: '2026-06-30' },
            { id: 'reebok-club-c', name: 'Reebok Club C 85 Vintage', brand: 'REEBOK', category: 'Sneakers', price: 7499, origPrice: 11999, image: 'jordan_powder_blue_nobg.png', sku: 'RBK-C85-07', gender: 'Unisex', date: '2026-04-12' },
            { id: 'onitsuka-mexico-66', name: 'Onitsuka Tiger Mexico 66 Yellow Black', brand: 'ONITSUKA TIGER', category: 'Sneakers', price: 10999, origPrice: 15999, image: 'af1_black_nobg.png', sku: 'OT-MEX-08', gender: 'Unisex', date: '2026-07-10' }
        ];

        // ----------------------------------------------------
        // A. SEARCH PAGE LOGIC (search.html)
        // ----------------------------------------------------
        if (page === 'search.html') {
            const query = urlParams.get('q') || '';
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
            if (searchInput && query) {
                searchInput.value = query;
            }

            // Save Recent Search
            if (query) {
                let recents = JSON.parse(localStorage.getItem('lnk_recent_searches') || '[]');
                if (!recents.includes(query)) {
                    recents.unshift(query);
                    if (recents.length > 5) recents.pop();
                    localStorage.setItem('lnk_recent_searches', JSON.stringify(recents));
                }
            }

            // Popular & Recent Search Chips Click
            document.querySelectorAll('.search-chip, .popular-tag, [data-search-chip]').forEach(chip => {
                chip.addEventListener('click', function(){
                    const q = this.textContent.trim();
                    window.location.href = 'search.html?q=' + encodeURIComponent(q);
                });
            });
        }

        // ----------------------------------------------------
        // B. CATEGORY PRODUCTS LOGIC (category_products.html)
        // ----------------------------------------------------
        if (page === 'category_products.html' || page === 'filters.html') {
            const selectedBrand = urlParams.get('brand') || '';
            const selectedCat = urlParams.get('cat') || '';

            // Filter & Sort Selectors
            const sortSelect = document.querySelector('select[name="sort"], #sort-select, .sort-dropdown');
            const clearFilterBtn = document.querySelector('#btn-clear-filters, .btn-clear-filter, button:contains("Clear")');

            if (sortSelect) {
                sortSelect.addEventListener('change', function(){
                    if (window.LNKICKS) window.LNKICKS.showToast('Sorted by: ' + this.options[this.selectedIndex].text);
                });
            }

            if (clearFilterBtn) {
                clearFilterBtn.addEventListener('click', function(e){
                    e.preventDefault();
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                    if (window.LNKICKS) window.LNKICKS.showToast('All filters cleared');
                });
            }
        }

        // ----------------------------------------------------
        // C. BRAND & CATEGORY TILE CLICK HANDLERS
        // ----------------------------------------------------
        document.querySelectorAll('.cat-tile, .brand-logo, .brand-lgo, [data-brand]').forEach(tile => {
            tile.addEventListener('click', function(){
                const brand = this.getAttribute('data-brand') || this.textContent.trim();
                window.location.href = 'category_products.html?brand=' + encodeURIComponent(brand);
            });
        });
    });
})();
"""

with open(os.path.join(js_dir, "discovery_engine.js"), "w", encoding="utf-8") as f:
    f.write(discovery_engine_js)

print("Created js/discovery_engine.js!")

# 2. Inject js/discovery_engine.js into all discovery pages
discovery_pages = [
    "search.html", "categories.html", "category_products.html", 
    "filters.html", "index.html", "mobile.html"
]

modified_count = 0
for p in discovery_pages:
    file_path = os.path.join(project_dir, p)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if 'src="js/discovery_engine.js"' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '<script src="js/discovery_engine.js"></script>\n</body>')
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                modified_count += 1

print(f"Injected discovery_engine.js into {modified_count} discovery pages!")
