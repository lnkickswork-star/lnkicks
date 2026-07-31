'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? searchParams.get('q') || '' : '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Jordan 1', 'Samba OG', 'Air Force 1', 'Yeezy']);

  const popularTags = ['Jordan 1 Low', 'Samba OG', 'Air Force 1 Black', 'New Balance 9060', 'Puma Velophasis', 'Dunk High'];

  const filteredProducts = PRODUCT_REGISTRY.filter(p => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || p.brand.toUpperCase() === selectedBrand.toUpperCase();
    const matchesSize = selectedSize === 'All' || p.availableSizes.includes(selectedSize);
    return matchesQuery && matchesBrand && matchesSize;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleChipClick = (tag: string) => {
    setQuery(tag);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedBrand('All');
    setSelectedSize('All');
  };

  return (
    <ResponsiveAppLayout title="SEARCH">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>Search</span>
      </div>

      {/* SEARCH BAR INPUT */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '2px solid #111111', borderRadius: '30px', padding: '6px 8px 6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111111" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search sneakers, brands, categories..." 
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 500, color: '#111111', background: 'transparent' }} 
            />
          </div>
          <button type="submit" style={{ padding: '12px 24px', background: '#111111', color: '#ffffff', borderRadius: '24px', fontFamily: "var(--font-oswald), sans-serif", fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
            SEARCH
          </button>
        </div>
      </form>

      {/* POPULAR & RECENT SEARCH CHIPS */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777777', marginBottom: '10px' }}>POPULAR SEARCHES</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {popularTags.map((tag) => (
            <button key={tag} onClick={() => handleChipClick(tag)} style={{ padding: '6px 16px', background: query === tag ? '#111111' : '#F0F0F2', color: query === tag ? '#ffffff' : '#111111', borderRadius: '16px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* DISCOVERY CONTROL BAR & ACTIVE FILTERS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #EBEBEB', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '16px', fontSize: '12px', fontWeight: 600, color: '#111111', outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Brands</option>
            <option value="NIKE">Nike</option>
            <option value="ADIDAS">Adidas</option>
            <option value="PUMA">Puma</option>
            <option value="NEW BALANCE">New Balance</option>
          </select>

          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '16px', fontSize: '12px', fontWeight: 600, color: '#111111', outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Sizes</option>
            <option value="UK 7">UK 7</option>
            <option value="UK 8">UK 8</option>
            <option value="UK 9">UK 9</option>
            <option value="UK 10">UK 10</option>
          </select>

          {(query || selectedBrand !== 'All' || selectedSize !== 'All') && (
            <button onClick={resetFilters} style={{ padding: '8px 16px', background: '#FF3B30', color: '#ffffff', borderRadius: '16px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
              Reset Filters
            </button>
          )}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 600, color: '#777777' }}>
          {filteredProducts.length} Results Found
        </div>
      </div>

      {/* PRODUCT RESULTS GRID OR EMPTY STATE */}
      {filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.comparePrice} badge={p.newArrival ? 'NEW' : undefined} image={p.primaryImage} slug={p.slug} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #EBEBEB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <h2 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '24px', fontWeight: 800, color: '#111111', margin: 0 }}>No Products Found</h2>
          <p style={{ fontSize: '13px', color: '#777777', margin: '8px 0 24px' }}>We couldn&apos;t find any sneakers matching &quot;{query}&quot;. Try checking your spelling or reset filters.</p>
          <button onClick={resetFilters} style={{ padding: '12px 28px', background: '#111111', color: '#ffffff', borderRadius: '24px', fontFamily: "var(--font-oswald), sans-serif", fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            VIEW ALL PRODUCTS
          </button>
        </div>
      )}
    </ResponsiveAppLayout>
  );
}
