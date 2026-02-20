import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsArticle, Category, NewsFilters } from "@/types/news";
import {
  fetchBreakingNews,
  fetchCategories,
  fetchNewsArticles,
  fetchPinnedNews,
} from "@/lib/newsApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useNewsArticles(filters?: NewsFilters) {
  return useQuery({
    queryKey: ["news", filters],
    queryFn: () => fetchNewsArticles(filters),
    placeholderData: keepPreviousData,
  });
}

export function useBreakingNews() {
  return useQuery({
    queryKey: ["breaking-news"],
    queryFn: fetchBreakingNews,
  });
}

export function usePinnedNews() {
  return useQuery({
    queryKey: ["pinned-news"],
    queryFn: fetchPinnedNews,
  });
}

// Admin hooks
export function useAllNewsArticles() {
  return useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select(`
          *,
          category:categories(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NewsArticle[];
    },
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
      const { data, error } = await supabase
        .from("news_articles")
        .insert([article])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["breaking-news"] });
      queryClient.invalidateQueries({ queryKey: ["pinned-news"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsArticle> & { id: string }) => {
      const { data, error } = await supabase
        .from("news_articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["breaking-news"] });
      queryClient.invalidateQueries({ queryKey: ["pinned-news"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("news_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["breaking-news"] });
      queryClient.invalidateQueries({ queryKey: ["pinned-news"] });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("categories")
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}
