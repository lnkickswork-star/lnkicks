'use client';

import React from 'react';

export const OrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LNKICKS',
    url: 'https://www.lnkicks.com',
    logo: 'https://www.lnkicks.com/jordan_powder_blue_nobg.png',
    description: "India's premier destination for authentic luxury sneakers and hyped drops.",
    sameAs: [
      'https://instagram.com/lnkicks',
      'https://twitter.com/lnkicks'
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};
