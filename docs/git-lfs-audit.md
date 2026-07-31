# Git LFS Audit Report

Generated: 2026-07-31
Audited directory: `/public/`
Total images audited: **15**

## Summary

| Status | Count |
|---|---|
| Valid binary images | 0 |
| Broken Git LFS pointers (binary missing) | 15 |
| Unknown binary format | 0 |

## Findings

### Broken Git LFS Pointers (HIGH severity)

The following files are Git LFS pointer files (131-byte ASCII text) 
instead of real binary images. They were committed with `.gitattributes` 
rules that route `*.png` through Git LFS, but the actual binary 
content was never pushed to / pulled from the LFS store.

| File | LFS OID (sha256) | Expected binary size | Actual file size |
|---|---|---|---|
| `af1_black.png` | `e2d89e1eed3abf8bea92abec12ae9a8a67d1d24569199751ac60134c32ae3f32` | 466,189 bytes | 131 bytes |
| `af1_black_nobg.png` | `fb2a7a64fd79a542b107c23d7a2dbdaa2e816d23f8ed68186f62bbfcc5a8d3f1` | 435,297 bytes | 131 bytes |
| `dunk_australia.png` | `6be102d1c3deca1ec0782afc14f6b52a123ed9cb9d859cc19113dfb4c03d1c07` | 486,920 bytes | 131 bytes |
| `dunk_rose.png` | `19f85cb9c094a5ac99ef291cbf773898e4a9130489328ce28739cb326f97cdf8` | 482,674 bytes | 131 bytes |
| `foam_runner.png` | `90596748eec0d094759427ea2ceda06510a5b660f58374134c94b7503ec96598` | 405,879 bytes | 131 bytes |
| `hero_banner.png` | `c24bd9b203ebf543a60fa3a63e897e905f2a38e5958df17c0ad0231e82c61738` | 679,013 bytes | 131 bytes |
| `jordan_powder_blue.png` | `2498d3fda8ddb892ad5a94845c9848850c0fa46a1f2d24b46bb792c6988d80aa` | 470,423 bytes | 131 bytes |
| `jordan_powder_blue_nobg.png` | `20d365b981701a23851488a2899b46831b3b7da77cd1d0f4f3f28b6984c6b5b9` | 479,616 bytes | 131 bytes |
| `kodak_box.png` | `a0d80257068e765a28ce73dce089aa681cf367ea7502c0051711e73862ce89e2` | 622,995 bytes | 131 bytes |
| `nb_9060_nobg.png` | `b5dae2c58bd23bc8359f14253b1443c46f7a3aa7b3a862162d6c1b9af3202d65` | 482,311 bytes | 131 bytes |
| `puma_velo_nobg.png` | `c669b5db40bef811d714179d6f286f511cdac81458122ef89c7ebb1df2a6a49a` | 567,488 bytes | 131 bytes |
| `samba_og.png` | `a05b6d58c309895b23d6ed639b5435ff24a12bdb93786f9a4b7a81bfc536d292` | 372,209 bytes | 131 bytes |
| `samba_og_nobg.png` | `579705ffd1784de62221b5b1f6ea094fdc44ca140717a712e6763c608b2c1b51` | 357,645 bytes | 131 bytes |
| `yeezy_700.png` | `8a009c797ca89ee32c642862af266a8c49979b201e671f1d1121e91d54dd0b9b` | 510,827 bytes | 131 bytes |
| `yeezy_slide.png` | `b5e1440c54677ea999441045c4a50aa8ca79ad1cba6d398a443171fb78f74298` | 421,698 bytes | 131 bytes |

## Root Cause

The repository’s `.gitattributes` file declares:

```
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
```

This means any PNG/JPG committed to the repo is automatically converted 
to a Git LFS pointer on commit. The pointer file is a 131-byte ASCII text 
containing the SHA-256 oid and the original binary size. To get the real 
binary back, you must run `git lfs install` (one-time setup) followed by 
`git lfs pull` (fetches all LFS objects for the current commit).

However, the LFS store on the remote (GitHub) appears to be **empty** for 
this repository — the binaries were never pushed to GitHub’s LFS service. 
This is consistent with the OAuth token used to push having empty scopes, 
preventing LFS object uploads during the initial `git push`.

## Impact

1. **Production images are broken.** Every `<Image>` component in the app 
   that references one of these files will receive a 131-byte text file 
   instead of a binary image. The browser will fail to render the image.
2. **Open Graph / Twitter Card images are broken.** The default OG image 
   (`/jordan_powder_blue_nobg.png`) is a pointer file.
3. **Build does not fail.** Next.js Image component does not validate 
   binary content at build time for static public assets, so `npm run build` 
   succeeds even with broken images.

## Recommended Remediation (NOT applied automatically)

Per the Phase E directive, this audit is informational only. The following 
options are available — each requires explicit approval before execution:

**Option 1 (LOW risk): Replace with real binaries**
Source real PNG files for each LFS pointer and overwrite the files in 
/public/. Commit and push normally. No .gitattributes changes needed.

**Option 2 (MEDIUM risk): Disable LFS for new PNGs**
Remove `*.png filter=lfs diff=lfs merge=lfs -text` from `.gitattributes` 
and re-add the binaries as plain Git objects. Existing pointer files 
remain pointer files until manually replaced.

**Option 3 (HIGH risk): Migrate LFS to plain Git**
Use `git lfs migrate export` to convert all LFS-tracked files in history 
to plain Git objects. This rewrites history — violates the user’s 
"Do NOT modify git history" rule. NOT RECOMMENDED.
