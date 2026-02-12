import { Zap } from "lucide-react";
import { useBreakingNews } from "@/hooks/useNews";

export function BreakingNewsTicker() {
  const { data: breakingNews, isLoading } = useBreakingNews();

  if (isLoading || !breakingNews?.length) return null;

  return (
    <div className="bg-breaking text-breaking-foreground overflow-hidden">
      <div className="container flex items-center py-2">
        <div className="flex items-center gap-2 pr-4 border-r border-breaking-foreground/30 flex-shrink-0">
          <Zap className="h-4 w-4 animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wide">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1 ml-4">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {breakingNews.map((article, index) => (
              <a
                key={article.id}
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 hover:underline"
              >
                <span className="text-sm font-medium">{article.headline}</span>
                {index < breakingNews.length - 1 && (
                  <span className="text-breaking-foreground/50">•</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
