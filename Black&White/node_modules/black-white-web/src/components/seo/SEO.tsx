// apps/web/src/components/seo/SEO.tsx
import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  productData?: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    sku: string;
    brand: string;
    inStock: boolean;
  };
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical, image, productData }) => {
  const siteTitle = 'Black & White Haute Couture';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription =
    description || 'Black & White Haute Couture — Fine Menswear, Tailored Suits & Luxury Apparel.';
  const ogImage = image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200';

  useEffect(() => {
    document.title = fullTitle;

    // Inject JSON-LD Schema
    const schemaId = 'bw-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaObj: any = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://blackandwhite.luxury/#organization',
          name: 'Black & White Haute Couture',
          url: 'https://blackandwhite.luxury',
          logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
          sameAs: [
            'https://instagram.com/blackandwhitecouture',
            'https://twitter.com/blackwhitecouture',
          ],
        },
      ],
    };

    if (productData) {
      schemaObj['@graph'].push({
        '@type': 'Product',
        name: productData.name,
        description: productData.description,
        image: [productData.image],
        sku: productData.sku,
        brand: {
          '@type': 'Brand',
          name: productData.brand,
        },
        offers: {
          '@type': 'Offer',
          url: window.location.href,
          priceCurrency: productData.currency,
          price: productData.price,
          availability: productData.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      });
    }

    scriptTag.textContent = JSON.stringify(schemaObj);
  }, [fullTitle, metaDescription, productData]);

  return (
    <>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {canonical && <link rel="canonical" href={canonical} />}
    </>
  );
};

export default SEO;
