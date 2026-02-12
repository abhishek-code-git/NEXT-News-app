export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source_name: string;
  source_url: string;
  category_id: string | null;
  category?: Category;
  image_url: string | null;
  is_pinned: boolean;
  is_breaking: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_id: string | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface NewsFilters {
  category?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ServiceLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
