import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  product?: {
    name: string;
    description: string;
    image: string;
    reference: string;
    category: string;
  };
}

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  product 
}: SEOProps) => {
  const siteUrl = 'https://spiderhome.fr';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/logo-spiderhome.jpg`;

  const structuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": product.reference,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": "SpiderHome"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "EUR",
      "seller": {
        "@type": "Organization",
        "name": "SpiderHome"
      }
    }
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SpiderHome" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Données structurées */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
