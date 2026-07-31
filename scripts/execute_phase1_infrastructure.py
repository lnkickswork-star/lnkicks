import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"

# Verify all Phase 1 Infrastructure files exist
phase1_files = [
    os.path.join(project_dir, "app", "layout.tsx"),
    os.path.join(project_dir, "app", "page.tsx"),
    os.path.join(project_dir, "components", "context", "AppContext.tsx"),
    os.path.join(project_dir, "components", "layout", "ResponsiveAppLayout.tsx"),
    os.path.join(project_dir, "components", "layout", "Header.tsx"),
    os.path.join(project_dir, "components", "layout", "MobileFooter.tsx"),
    os.path.join(project_dir, "package.json"),
    os.path.join(project_dir, "tsconfig.json"),
    os.path.join(project_dir, "next.config.js")
]

missing = [f for f in phase1_files if not os.path.exists(f)]
if missing:
    print(f"Missing Phase 1 files: {missing}")
else:
    print("ALL Phase 1 Infrastructure & Layout Engine files are 100% verified!")
