import { ExternalLink, Clock, Pin, Zap } from "lucide-react";
import { NewsArticle } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "featured" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.published_at), { addSuffix: true });

  if (variant === "featured") {
    return (
      <a
        href={article.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block news-card bg-card rounded-xl overflow-hidden shadow-card"
      >
        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.headline}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-6xl opacity-20">📰</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3">
              {article.is_breaking && (
                <Badge variant="destructive" className="breaking-badge flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Breaking
                </Badge>
              )}
              {article.is_pinned && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-warning text-warning-foreground">
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
              {article.category && (
                <Badge 
                  variant="secondary" 
                  className="bg-primary-foreground/20 text-primary-foreground border-0"
                >
                  {article.category.name}
                </Badge>
              )}
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-primary-foreground mb-2 line-clamp-2 group-hover:underline decoration-2 underline-offset-4">
              {article.headline}
            </h2>
            <p className="text-primary-foreground/80 line-clamp-2 mb-3 hidden sm:block">
              {article.summary}
            </p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <span className="font-medium">{article.source_name}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo}
              </span>
              <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={article.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 p-4 news-card bg-card rounded-lg border border-border"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {article.is_breaking && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
                Breaking
              </Badge>
            )}
            {article.category && (
              <span className="text-xs font-medium text-muted-foreground">
                {article.category.name}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {article.headline}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{article.source_name}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
          </div>
        </div>
        {article.image_url && (
          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </a>
    );
  }

  return (
    <a
      href={article.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block news-card bg-card rounded-xl overflow-hidden border border-border"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.headline}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-4xl opacity-30">📰</span>
          </div>
        )}
        {(article.is_breaking || article.is_pinned) && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {article.is_breaking && (
              <Badge variant="destructive" className="breaking-badge flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Breaking
              </Badge>
            )}
            {article.is_pinned && (
              <Badge className="flex items-center gap-1 bg-warning text-warning-foreground border-0">
                <Pin className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        {article.category && (
          <Badge 
            variant="secondary" 
            className="mb-2 text-xs"
            style={{ 
              backgroundColor: `${article.category.color}20`,
              color: article.category.color 
            }}
          >
            {article.category.name}
          </Badge>
        )}
        <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.headline}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{article.source_name}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        </div>
      </div>
    </a>
  );
}
