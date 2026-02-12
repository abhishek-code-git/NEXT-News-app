import { NewsArticle } from "@/types/news";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedNewsProps {
  articles: NewsArticle[];
  isLoading?: boolean;
}

export function FeaturedNews({ articles, isLoading }: FeaturedNewsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-video md:aspect-[21/9] rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!articles?.length) return null;

  const [mainArticle, ...sideArticles] = articles;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main featured article */}
      <div className="lg:col-span-2">
        <NewsCard article={mainArticle} variant="featured" />
      </div>

      {/* Side articles */}
      <div className="space-y-4">
        {sideArticles.slice(0, 3).map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}
