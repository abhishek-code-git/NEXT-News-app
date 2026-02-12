import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// Map GNews topics to our category slugs
const topicToCategoryMap: Record<string, string> = {
  'breaking-news': 'breaking-news',
  'nation': 'india',
  'world': 'world',
  'technology': 'technology',
  'business': 'business',
  'sports': 'sports',
  'health': 'health',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY');
    if (!GNEWS_API_KEY) {
      throw new Error('GNEWS_API_KEY is not configured');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase environment variables not configured');
    }

    // Create Supabase client with service role for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all active categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('is_active', true);

    if (catError) {
      throw new Error(`Failed to fetch categories: ${catError.message}`);
    }

    const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);
    
    console.log('Starting news fetch from GNews API...');
    
    let totalInserted = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    // Fetch news for different topics
    const topics = ['breaking-news', 'nation', 'world', 'technology', 'business', 'sports', 'health'];

    for (const topic of topics) {
      try {
        // GNews API endpoint - using India as country, English language
        const apiUrl = `https://gnews.io/api/v4/top-headlines?topic=${topic}&country=in&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
        
        console.log(`Fetching ${topic} news...`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`GNews API error for ${topic}: ${response.status} - ${errorText}`);
          errors.push(`${topic}: API error ${response.status}`);
          continue;
        }

        const data: GNewsResponse = await response.json();
        
        if (!data.articles || data.articles.length === 0) {
          console.log(`No articles found for topic: ${topic}`);
          continue;
        }

        console.log(`Found ${data.articles.length} articles for ${topic}`);

        // Get the category ID for this topic
        const categorySlug = topicToCategoryMap[topic] || 'india';
        const categoryId = categoryMap.get(categorySlug);

        for (const article of data.articles) {
          // Check if article already exists (by source URL)
          const { data: existing } = await supabase
            .from('news_articles')
            .select('id')
            .eq('source_url', article.url)
            .maybeSingle();

          if (existing) {
            totalSkipped++;
            continue;
          }

          // Insert new article
          const { error: insertError } = await supabase
            .from('news_articles')
            .insert({
              headline: article.title,
              summary: article.description || article.content?.substring(0, 500) || '',
              source_name: article.source.name,
              source_url: article.url,
              category_id: categoryId || null,
              image_url: article.image || null,
              is_pinned: false,
              is_breaking: topic === 'breaking-news',
              is_published: true,
              published_at: article.publishedAt || new Date().toISOString(),
            });

          if (insertError) {
            console.error(`Failed to insert article: ${insertError.message}`);
            errors.push(`Insert error: ${insertError.message}`);
          } else {
            totalInserted++;
          }
        }

        // Small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (topicError) {
        console.error(`Error fetching ${topic}:`, topicError);
        errors.push(`${topic}: ${topicError instanceof Error ? topicError.message : 'Unknown error'}`);
      }
    }

    console.log(`News fetch complete. Inserted: ${totalInserted}, Skipped: ${totalSkipped}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `News fetch complete`,
        inserted: totalInserted,
        skipped: totalSkipped,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
