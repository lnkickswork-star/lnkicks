/**
 * lib/images.ts — Centralized image URL resolver.
 * ============================================================
 *
 * Problem
 * -------
 * Every `public/*.png` product image in the repo is a Git LFS pointer
 * (131-byte ASCII text starting with `version https://git-lfs.github.com/spec/v1`).
 * They render as broken images. The homepage works because it bypasses
 * `/public/` and uses external Google-hosted CDN URLs.
 *
 * Solution
 * --------
 * This module maps every known broken LFS path to its working CDN
 * counterpart. Call `resolveImage(src)` anywhere a product/category
 * image is rendered. If the src is already a URL (http/https), it is
 * returned untouched. If it is a known-broken `/foo.png`, the working
 * CDN URL is returned. Otherwise the original src is returned (so
 * future real images in /public/ keep working).
 *
 * Image hosts used
 * ----------------
 *  - lh3.googleusercontent.com/aida-public/...   (Google-hosted, used by homepage)
 *  - z-cdn.chatglm.cn/image-search-mcp/...        (ZAI image-search OSS, used by Designer sneakers)
 *
 * Both hosts MUST be added to next.config.js `images.remotePatterns`
 * for next/image to optimize them. (Raw <img> tags work regardless.)
 */

/**
 * Mapping from broken /public/*.png LFS-pointer paths to working CDN URLs.
 * Curated from components/desktop/sliderProducts.ts (verified-working URLs
 * already in production on the homepage).
 */
const IMAGE_MAP: Record<string, string> = {
  // ── Air Jordan 1 Low Black Powder Blue ───────────────────────────
  '/jordan_powder_blue_nobg.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
  '/jordan_powder_blue.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',

  // ── Adidas Samba OG ──────────────────────────────────────────────
  '/samba_og_nobg.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
  '/samba_og.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',

  // ── Nike Dunk Low Rose Whisper ───────────────────────────────────
  '/dunk_rose.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',

  // ── Nike Air Force 1 Triple Black ────────────────────────────────
  '/af1_black_nobg.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
  '/af1_black.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',

  // ── Puma Velophasis ──────────────────────────────────────────────
  '/puma_velo_nobg.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',

  // ── New Balance 9060 Sea Salt Gold ───────────────────────────────
  '/nb_9060_nobg.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',

  // ── Yeezy Foam Runner ────────────────────────────────────────────
  '/foam_runner.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',

  // ── Yeezy Slide Onyx ─────────────────────────────────────────────
  '/yeezy_slide.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',

  // ── Yeezy 700 ────────────────────────────────────────────────────
  '/yeezy_700.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',

  // ── Nike Dunk Australia ──────────────────────────────────────────
  '/dunk_australia.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',

  // ── Kodak Box (accessory) ────────────────────────────────────────
  '/kodak_box.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',

  // ── Hero banner (legacy product hero, not the homepage heroes) ───
  '/hero_banner.png':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
};

/**
 * Resolve a product image src to a working URL.
 *
 * - Already-absolute URLs (http/https) are returned untouched.
 * - Data URIs are returned untouched.
 * - Known broken LFS-pointer paths are mapped to working CDN URLs.
 * - Unknown /public/ paths are returned as-is (they may be real assets
 *   that were added after this map was last updated).
 *
 * Always pass image src through this resolver before handing to
 * <img src> or <Image src>.
 */
export function resolveImage(src: string | undefined | null): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  // Normalize leading slash (map keys are all "/foo.png")
  const key = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return IMAGE_MAP[key] ?? trimmed;
}

/**
 * Returns true if the given src is a known-broken LFS pointer path
 * (and thus will be substituted by resolveImage).
 */
export function isKnownBrokenImage(src: string | undefined | null): boolean {
  if (!src) return false;
  const trimmed = src.trim();
  if (!trimmed.startsWith('/')) return false;
  return Object.prototype.hasOwnProperty.call(IMAGE_MAP, trimmed);
}

export default resolveImage;
