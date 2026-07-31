import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
import { CATEGORY_REGISTRY } from '@/components/category/CategoryRegistry';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = CATEGORY_REGISTRY.find((c) => c.slug === params.slug);
  const title = category ? `${category.name} — LNKICKS` : 'Category — LNKICKS';
  const description = category
    ? category.description
    : 'Browse authentic luxury sneakers and apparel by category at LNKICKS.';
  const path = category ? `/category/${category.slug}` : '/categories';
  return createRouteMetadata({
    title,
    description,
    path,
    image: category ? `/${category.image}` : undefined,
  });
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
