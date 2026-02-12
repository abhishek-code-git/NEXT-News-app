import Image from "next/image";
import { FileText, FolderOpen, Eye, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllNewsArticles, useAllCategories } from "@/hooks/useNews";

export function AdminDashboard() {
  const { data: articles } = useAllNewsArticles();
  const { data: categories } = useAllCategories();

  const publishedCount = articles?.filter(a => a.is_published).length || 0;
  const breakingCount = articles?.filter(a => a.is_breaking).length || 0;
  const pinnedCount = articles?.filter(a => a.is_pinned).length || 0;

  const stats = [
    {
      title: "Total Articles",
      value: articles?.length || 0,
      icon: FileText,
      description: "All news articles",
      color: "bg-info/10 text-info",
    },
    {
      title: "Published",
      value: publishedCount,
      icon: Eye,
      description: "Live on website",
      color: "bg-success/10 text-success",
    },
    {
      title: "Breaking News",
      value: breakingCount,
      icon: Zap,
      description: "Marked as breaking",
      color: "bg-breaking/10 text-breaking",
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      icon: FolderOpen,
      description: "Active categories",
      color: "bg-warning/10 text-warning",
    },
  ];

  const recentArticles = articles?.slice(0, 5) || [];

  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your news platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt=""
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground line-clamp-1">
                      {article.headline}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {article.source_name}
                      </span>
                      {article.is_breaking && (
                        <span className="text-xs bg-breaking/10 text-breaking px-2 py-0.5 rounded-full">
                          Breaking
                        </span>
                      )}
                      {article.is_pinned && (
                        <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                      {!article.is_published && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No articles yet. Start by adding your first news article!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
