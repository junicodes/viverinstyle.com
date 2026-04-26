import { Helmet } from 'react-helmet';

interface SEOProps {
  products?: any[];
}

function isProductInStock(product: any): boolean {
  if (typeof product.inStock === 'boolean') return product.inStock;
  if (typeof product.stock === 'number') return product.stock > 0;
  return true;
}

export function SEO({ products = [] }: SEOProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'Vivere In Style',
    url: 'https://www.vivereinstyle.com',
    logo: 'https://www.vivereinstyle.com/logo.png',
    description: 'Premium Australian-designed furniture for modern living. Quality craftsmanship meets contemporary style.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8/105 O\'Sullivan Road',
      addressLocality: 'Lonsdale',
      addressRegion: 'SA',
      postalCode: '5160',
      addressCountry: 'AU',
    },
    telephone: '0424-023-996',
    email: 'hello@vivereinstyle.com',
    priceRange: '$$-$$$',
    openingHours: 'Mo-Fr 09:00-18:00, Sa 10:00-17:00, Su 11:00-16:00',
    sameAs: [
      'https://www.facebook.com/vivereinstyle',
      'https://www.instagram.com/vivereinstyle',
      'https://www.pinterest.com/vivereinstyle',
      'https://www.tiktok.com/@vivereinstyle',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vivere In Style',
    url: 'https://www.vivereinstyle.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.vivereinstyle.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vivereinstyle.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: 'https://www.vivereinstyle.com/collection',
      },
    ],
  };

  const productSchemas = products.slice(0, 10).map((product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Vivere In Style',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'AUD',
      availability: isProductInStock(product)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://www.vivereinstyle.com/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Vivere In Style',
      },
    },
    ...(product.rating && product.reviews > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews,
      },
    } : {}),
  }));

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {productSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export { isProductInStock };
