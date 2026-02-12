import { NewsArticle } from "@/types/news";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AdInArticle } from "@/components/ads/AdInArticle";
import { AdNative } from "@/components/ads/AdNative";
import { Fragment } from "react";

interface NewsListProps {
  articles: NewsArticle[];
  isLoading?: boolean;
  variant?: "grid" | "list";
}

function NewsCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// Show ad after every N articles
const AD_INTERVAL = 4;

export function NewsList({ articles, isLoading, variant = "grid" }: NewsListProps) {
  if (isLoading) {
    return (
      <div className={variant === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!articles?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No news found</h3>
        <p className="text-muted-foreground">
          Check back later for updates or try a different search.
        </p>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {articles.map((article, index) => (
          <Fragment key={article.id}>
            <NewsCard article={article} variant="compact" />
            {/* Insert ad after every AD_INTERVAL articles */}
            {(index + 1) % AD_INTERVAL === 0 && index < articles.length - 1 && (
              <AdInArticle className="my-4" />
            )}
          </Fragment>
        ))}
      </div>
    );
  }

  // For grid layout, we need to break out of the grid for full-width ads
  const chunks: NewsArticle[][] = [];
  for (let i = 0; i < articles.length; i += AD_INTERVAL) {
    chunks.push(articles.slice(i, i + AD_INTERVAL));
  }

  return (
    <div className="space-y-6">
      {chunks.map((chunk, chunkIndex) => (
        <Fragment key={chunkIndex}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chunk.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          {/* Insert ad after each chunk except the last */}
          {chunkIndex < chunks.length - 1 && (
            chunkIndex % 2 === 0 ? (
              <AdInArticle />
            ) : (
              <div className="py-4">
                <div className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wide">Sponsored</div>
                <AdNative 
                  adKey="c7b0543d90ae3ae0f92e997a5d37d0ab" 
                  containerId={`container-native-${chunkIndex}`} 
                />
              </div>
            )
          )}
        </Fragment>
      ))}
    </div>
  );
}
