/* =========================================================
   LNKICKS CENTRALIZED ROUTE METADATA FACTORY
   ---------------------------------------------------------
   Generates a fully-populated Next.js Metadata object for a
   given route. Used by per-route layout.tsx files so that
   every page gets its own <title>, description, canonical
   URL, OpenGraph, Twitter Card, and robots directive.

   Per-route layout.tsx files import this helper and pass in
   a route-specific title, description, and path. The helper
   returns a typed Metadata object ready to be exported.
   ========================================================= */

import type { Metadata } from 'next';

export const SITE_URL = 'https://www.lnkicks.com';
export const SITE_NAME = 'LNKICKS';
export const SITE_TWITTER_HANDLE = '@lnkicks';
export const DEFAULT_OG_IMAGE = '/jordan_powder_blue_nobg.png';
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export interface RouteMetadataInput {
  /** Page title (will be used as <title> and OG/Twitter title). */
  title: string;
  /** Meta description (≤160 chars recommended). */
  description: string;
  /** Canonical path beginning with `/`, e.g. `/cart`. */
  path: string;
  /** Optional OG image path (defaults to brand OG image). */
  image?: string;
  /** Optional: set true to keep route out of search indices. */
  noIndex?: boolean;
  /** Optional: OpenGraph type. Defaults to 'website'. */
  ogType?: 'website' | 'article';
}

/**
 * Build a Next.js Metadata object for a route with sensible
 * SEO defaults (canonical URL, OpenGraph, Twitter Card, robots).
 */
export function createRouteMetadata(input: RouteMetadataInput): Metadata {
  const url = `${SITE_URL}${input.path}`;
  const image = input.image || DEFAULT_OG_IMAGE;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const ogType = input.ogType || 'website';

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_TWITTER_HANDLE,
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
  };
}
