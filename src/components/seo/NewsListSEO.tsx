import Head from "next/head";
import { NewsArticle } from "@/types/news";

interface NewsListSEOProps {
  articles: NewsArticle[];
  category?: string;
}

export function NewsListSEO({ articles, category }: NewsListSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newdigital-india.vercel.app";

  // Create ItemList schema for the news feed
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "NewsArticle",
        headline: article.headline,
        description: article.summary,
        image: article.image_url || `${siteUrl}/logo.png`,
        datePublished: article.published_at,
        url: article.source_url,
        publisher: {
          "@type": "Organization",
          name: "New Digital India",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
          },
        },
        author: {
          "@type": "Organization",
          name: article.source_name,
        },
        articleSection: article.category?.name || category || "News",
      },
    })),
  };

  // BreadcrumbList for category pages
  const breadcrumbSchema = category
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            item: `${siteUrl}/?category=${category}`,
          },
        ],
      }
    : null;

  return (
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
    </Head>
  );
}
