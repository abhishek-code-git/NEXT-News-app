import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export function SEOHead({
  title = "New Digital India - Latest News & Updates",
  description = "New Digital India - Your trusted source for latest news and updates from India. Get breaking news, politics, technology, sports, jobs, and more.",
  keywords = "news, india news, breaking news, latest news, technology news, sports news, jobs, government schemes, digital india",
  ogImage = "/logo.png",
  ogType = "website",
  canonicalUrl,
  article,
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newdigital-india.vercel.app";
  const fullTitle = title.includes("New Digital India") ? title : `${title} | New Digital India`;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;
  const canonical = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  // JSON-LD structured data for the website
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "New Digital India",
    url: siteUrl,
    description: "Your trusted source for latest news and updates from India",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // JSON-LD for news publisher
  const publisherSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "New Digital India",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 200,
      height: 200,
    },
    sameAs: [
      "https://twitter.com/NewDigitalIndia",
      "https://facebook.com/NewDigitalIndia",
    ],
  };

  // JSON-LD for article (if article props provided)
  const articleSchema = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: description,
        image: fullOgImage,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        author: {
          "@type": "Organization",
          name: article.author || "New Digital India",
        },
        publisher: {
          "@type": "Organization",
          name: "New Digital India",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
          },
        },
        articleSection: article.section,
        keywords: article.tags?.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
      }
    : null;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="New Digital India" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="New Digital India" />
      <meta property="og:locale" content="en_IN" />

      {/* Article specific OG tags */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {article?.tags?.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@NewDigitalIndia" />
      <meta name="twitter:creator" content="@NewDigitalIndia" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#6b21a8" />
      <meta name="msapplication-TileColor" content="#6b21a8" />
      <meta name="format-detection" content="telephone=no" />

      {/* Geo targeting for India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="language" content="English" />
      <meta name="coverage" content="India" />
      <meta name="distribution" content="global" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(publisherSchema) }} />
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
    </Head>
  );
}
