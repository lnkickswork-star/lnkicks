from PIL import Image

def remove_white_bg(img_path, out_path, tolerance=15):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if pixel is close to pure white / light beige background
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0)) # Make transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved transparent background image to {out_path}")

remove_white_bg('jordan_powder_blue.png', 'jordan_powder_blue_nobg.png')
remove_white_bg('samba_og.png', 'samba_og_nobg.png')
