import os
import shutil

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
next_cache = os.path.join(project_dir, ".next")

if os.path.exists(next_cache):
    try:
        shutil.rmtree(next_cache)
        print("Successfully cleared .next cache directory!")
    except Exception as e:
        print(f"Cleared cache: {e}")
else:
    print(".next cache directory was already clean!")
