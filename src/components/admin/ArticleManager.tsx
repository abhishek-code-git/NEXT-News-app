import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Pin, Zap, Eye, EyeOff, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  useAllNewsArticles, 
  useAllCategories,
  useCreateArticle, 
  useUpdateArticle, 
  useDeleteArticle 
} from "@/hooks/useNews";
import { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export function ArticleManager() {
  const { toast } = useToast();
  const { data: articles, isLoading, refetch } = useAllNewsArticles();
  const { data: categories } = useAllCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isFetchingNews, setIsFetchingNews] = useState(false);

  // Form state
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const handleFetchNews = async () => {
    setIsFetchingNews(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news');
      
      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        toast({
          title: "News fetched successfully",
          description: `Added ${data.inserted} new articles, ${data.skipped} already existed.`,
        });
        refetch();
      } else {
        throw new Error(data?.error || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error fetching news",
        description: error instanceof Error ? error.message : "Failed to fetch news from API",
        variant: "destructive",
      });
    } finally {
      setIsFetchingNews(false);
    }
  };

  const resetForm = () => {
    setHeadline("");
    setSummary("");
    setSourceName("");
    setSourceUrl("");
    setImageUrl("");
    setCategoryId("");
    setIsPinned(false);
    setIsBreaking(false);
    setIsPublished(true);
    setEditingArticle(null);
  };

  const openEditDialog = (article: NewsArticle) => {
    setEditingArticle(article);
    setHeadline(article.headline);
    setSummary(article.summary);
    setSourceName(article.source_name);
    setSourceUrl(article.source_url);
    setImageUrl(article.image_url || "");
    setCategoryId(article.category_id || "");
    setIsPinned(article.is_pinned);
    setIsBreaking(article.is_breaking);
    setIsPublished(article.is_published);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const articleData = {
      headline,
      summary,
      source_name: sourceName,
      source_url: sourceUrl,
      image_url: imageUrl || null,
      category_id: categoryId || null,
      is_pinned: isPinned,
      is_breaking: isBreaking,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      author_id: null,
    };

    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({ id: editingArticle.id, ...articleData });
        toast({ title: "Article updated successfully" });
      } else {
        await createArticle.mutateAsync(articleData);
        toast({ title: "Article created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save article. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteArticle.mutateAsync(deleteConfirmId);
      toast({ title: "Article deleted successfully" });
      setDeleteConfirmId(null);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete article.",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (article: NewsArticle) => {
    try {
      await updateArticle.mutateAsync({ 
        id: article.id, 
        is_published: !article.is_published 
      });
      toast({ 
        title: article.is_published ? "Article unpublished" : "Article published" 
      });
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const togglePinned = async (article: NewsArticle) => {
    try {
      await updateArticle.mutateAsync({ 
        id: article.id, 
        is_pinned: !article.is_pinned 
      });
      toast({ 
        title: article.is_pinned ? "Article unpinned" : "Article pinned" 
      });
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground mt-1">
            Manage your news articles and updates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleFetchNews}
            disabled={isFetchingNews}
          >
            {isFetchingNews ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isFetchingNews ? "Fetching..." : "Fetch News"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Article" : "Add New Article"}
                </DialogTitle>
                <DialogDescription>
                  {editingArticle 
                    ? "Update the article details below." 
                    : "Fill in the details to create a new news article."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline *</Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter news headline"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief summary of the news"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceName">Source Name *</Label>
                    <Input
                      id="sourceName"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="e.g., BBC News"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceUrl">Source URL *</Label>
                    <Input
                      id="sourceUrl"
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPublished"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                    <Label htmlFor="isPublished">Published</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPinned"
                      checked={isPinned}
                      onCheckedChange={setIsPinned}
                    />
                    <Label htmlFor="isPinned">Pinned</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isBreaking"
                      checked={isBreaking}
                      onCheckedChange={setIsBreaking}
                    />
                    <Label htmlFor="isBreaking">Breaking News</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createArticle.isPending || updateArticle.isPending}
                  >
                    {createArticle.isPending || updateArticle.isPending 
                      ? "Saving..." 
                      : editingArticle ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Article</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading articles...
                  </TableCell>
                </TableRow>
              ) : articles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No articles yet. Add your first article to get started.
                  </TableCell>
                </TableRow>
              ) : (
                articles?.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {article.image_url ? (
                          <img 
                            src={article.image_url} 
                            alt="" 
                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-1">{article.headline}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.category ? (
                        <Badge 
                          variant="secondary"
                          style={{ 
                            backgroundColor: `${article.category.color}20`,
                            color: article.category.color 
                          }}
                        >
                          {article.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <a 
                        href={article.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        {article.source_name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.is_published ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        {article.is_breaking && (
                          <Badge variant="destructive" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Breaking
                          </Badge>
                        )}
                        {article.is_pinned && (
                          <Badge className="bg-warning/10 text-warning text-xs">
                            <Pin className="h-3 w-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublished(article)}
                          title={article.is_published ? "Unpublish" : "Publish"}
                        >
                          {article.is_published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePinned(article)}
                          title={article.is_pinned ? "Unpin" : "Pin"}
                        >
                          <Pin className={`h-4 w-4 ${article.is_pinned ? "text-warning" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(article.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
