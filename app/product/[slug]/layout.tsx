import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = PRODUCT_REGISTRY.find((p) => p.slug === params.slug) || PRODUCT_REGISTRY[0];
  return createRouteMetadata({
    title: `${product.seoTitle}`,
    description: product.seoDescription,
    path: `/product/${product.slug}`,
    image: product.primaryImage,
    ogType: 'article',
  });
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
