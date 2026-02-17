import { useEffect, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreakingNewsTicker } from "@/components/news/BreakingNewsTicker";
import { FeaturedNews } from "@/components/news/FeaturedNews";
import { NewsList } from "@/components/news/NewsList";
import { CategoryFilter } from "@/components/news/CategoryFilter";
import { ServiceLinksSection } from "@/components/news/ServiceLinksSection";
import { useNewsArticles, usePinnedNews } from "@/hooks/useNews";
import { SEOHead } from "@/components/seo/SEOHead";
import { NewsListSEO } from "@/components/seo/NewsListSEO";
import { AdHeader } from "@/components/ads/AdHeader";
import { AdInArticle } from "@/components/ads/AdInArticle";
import { AdSidebar } from "@/components/ads/AdSidebar";
import { AdFooter } from "@/components/ads/AdFooter";
import { AdPopunder } from "@/components/ads/AdPopunder";
import {
  fetchBreakingNews,
  fetchCategories,
  fetchNewsArticles,
  fetchPinnedNews,
  fetchServiceLinks,
} from "@/lib/newsApi";

type IndexPageProps = {
  initialCategory: string;
  initialSearch: string;
};

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async (context) => {
  const categoryParam = typeof context.query.category === "string" ? context.query.category : "all";
  const searchParam = typeof context.query.search === "string" ? context.query.search : "";

  const queryClient = new QueryClient();
  const filters = {
    category: categoryParam !== "all" ? categoryParam : undefined,
    search: searchParam || undefined,
  };
  const filtersForKey = {
    category: categoryParam !== "all" ? categoryParam : null,
    search: searchParam || null,
  };

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["pinned-news"], queryFn: fetchPinnedNews }),
    queryClient.prefetchQuery({ queryKey: ["news", filtersForKey], queryFn: () => fetchNewsArticles(filters) }),
    queryClient.prefetchQuery({ queryKey: ["breaking-news"], queryFn: fetchBreakingNews }),
    queryClient.prefetchQuery({ queryKey: ["categories"], queryFn: fetchCategories }),
    queryClient.prefetchQuery({ queryKey: ["service-links"], queryFn: fetchServiceLinks }),
  ]);

  context.res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialCategory: categoryParam,
      initialSearch: searchParam,
    },
  };
};

const Index = ({ initialCategory, initialSearch }: IndexPageProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const categoryParam = useMemo(() => {
    if (!router.isReady) return initialCategory || "all";
    return typeof router.query.category === "string" ? router.query.category : "all";
  }, [router.isReady, router.query.category, initialCategory]);

  useEffect(() => {
    if (!router.isReady) return;
    const search = typeof router.query.search === "string" ? router.query.search : "";
    setSearchQuery(search);
  }, [router.isReady, router.query.search]);

  const { data: pinnedNews, isLoading: pinnedLoading } = usePinnedNews();
  const { data: articles, isLoading: articlesLoading } = useNewsArticles({
    category: categoryParam !== "all" ? categoryParam : undefined,
    search: searchQuery || undefined,
  });

  const handleCategoryChange = (category: string) => {
    const nextQuery: Record<string, string> = {};
    if (category !== "all") nextQuery.category = category;
    if (searchQuery) nextQuery.search = searchQuery;
    router.push({ pathname: "/", query: nextQuery }, undefined, { shallow: true });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const nextQuery: Record<string, string> = {};
    if (categoryParam !== "all") nextQuery.category = categoryParam;
    if (query) nextQuery.search = query;
    router.push({ pathname: "/", query: nextQuery }, undefined, { shallow: true });
  };

  const pinnedIds = useMemo(() => new Set(pinnedNews?.map((a) => a.id) || []), [pinnedNews]);
  const filteredArticles = useMemo(
    () => articles?.filter((a) => !pinnedIds.has(a.id)) || [],
    [articles, pinnedIds],
  );
  const seoArticles = useMemo(() => {
    const combined = [...(pinnedNews || []), ...(articles || [])];
    const seen = new Set<string>();
    return combined.filter((article) => {
      if (seen.has(article.id)) return false;
      seen.add(article.id);
      return true;
    });
  }, [pinnedNews, articles]);

  const getCategoryTitle = () => {
    if (categoryParam === "all") return "Latest News & Updates from India";
    const categoryName = categoryParam.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return `${categoryName} News - Latest Updates`;
  };

  const getCategoryDescription = () => {
    if (categoryParam === "all") {
      return "Get the latest news and updates from India. Breaking news, politics, technology, sports, jobs, health, and more. Your trusted source for verified news.";
    }
    const categoryName = categoryParam.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return `Latest ${categoryName} news and updates from India. Stay informed with the most recent ${categoryName.toLowerCase()} stories and developments.`;
  };

  const getCategoryKeywords = () => {
    const baseKeywords = "india news, latest news, breaking news";
    if (categoryParam === "all") {
      return `${baseKeywords}, technology, sports, jobs, health, politics, business, entertainment`;
    }
    const categoryName = categoryParam.replace(/-/g, " ");
    return `${categoryName} news, ${categoryName} updates, india ${categoryName}, latest ${categoryName}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdPopunder />
      <SEOHead
        title={getCategoryTitle()}
        description={getCategoryDescription()}
        keywords={getCategoryKeywords()}
        canonicalUrl={categoryParam === "all" ? "/" : `/?category=${categoryParam}`}
      />

      {seoArticles.length > 0 && (
        <NewsListSEO articles={seoArticles} category={categoryParam !== "all" ? categoryParam : undefined} />
      )}

      <BreakingNewsTicker />
      <Header onSearch={handleSearch} searchQuery={searchQuery} />

      <AdHeader />

      <main className="container py-8 page-transition">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {categoryParam === "all" && !searchQuery && (
              <>
                <section className="mb-10">
                  <FeaturedNews articles={pinnedNews || []} isLoading={pinnedLoading} />
                </section>

                <AdInArticle />

                <ServiceLinksSection />
              </>
            )}

            <section className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {categoryParam === "all"
                    ? "Latest News"
                    : `${categoryParam.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} News`}
                </h2>
                {searchQuery && (
                  <p className="text-muted-foreground">Showing results for &quot;{searchQuery}&quot;</p>
                )}
              </div>
              <CategoryFilter selectedCategory={categoryParam} onCategoryChange={handleCategoryChange} />
            </section>

            <AdInArticle className="mb-6" />

            <section>
              <NewsList articles={filteredArticles} isLoading={articlesLoading} />
            </section>
          </div>

          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <AdSidebar />
          </aside>
        </div>
      </main>

      <AdFooter />
      <Footer />
    </div>
  );
};

export default Index;
