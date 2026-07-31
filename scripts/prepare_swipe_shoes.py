from PIL import Image
import os

def remove_white_bg(img_path, out_path):
    if not os.path.exists(img_path):
        print(f"File {img_path} not found, skipping.")
        return
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved transparent image to {out_path}")

remove_white_bg('jordan_powder_blue.png', 'jordan_powder_blue_nobg.png')
remove_white_bg('samba_og.png', 'samba_og_nobg.png')
remove_white_bg('af1_black.png', 'af1_black_nobg.png')
remove_white_bg('yeezy_700.png', 'puma_velo_nobg.png')
remove_white_bg('dunk_australia.png', 'nb_9060_nobg.png')
