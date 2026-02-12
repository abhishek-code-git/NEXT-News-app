import { supabase } from "@/integrations/supabase/client";
import { Category, NewsArticle, NewsFilters, ServiceLink } from "@/types/news";

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function fetchNewsArticles(filters?: NewsFilters) {
  let query = supabase
    .from("news_articles")
    .select(
      `
          *,
          category:categories(*)
        `,
    )
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  if (filters?.category && filters.category !== "all") {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .maybeSingle();

    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (filters?.search) {
    query = query.or(`headline.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.limit(50);
  if (error) throw error;
  return data as NewsArticle[];
}

export async function fetchBreakingNews() {
  const { data, error } = await supabase
    .from("news_articles")
    .select(
      `
          *,
          category:categories(*)
        `,
    )
    .eq("is_published", true)
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data as NewsArticle[];
}

export async function fetchPinnedNews() {
  const { data, error } = await supabase
    .from("news_articles")
    .select(
      `
          *,
          category:categories(*)
        `,
    )
    .eq("is_published", true)
    .eq("is_pinned", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) throw error;
  return data as NewsArticle[];
}

export async function fetchServiceLinks() {
  const { data, error } = await supabase
    .from("service_links")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data as ServiceLink[];
}

