import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceLink } from "@/types/news";
import { fetchServiceLinks } from "@/lib/newsApi";

export function useServiceLinks() {
  return useQuery({
    queryKey: ["service-links"],
    queryFn: fetchServiceLinks,
  });
}

export function useAllServiceLinks() {
  return useQuery({
    queryKey: ["admin-service-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_links")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ServiceLink[];
    },
  });
}

export function useCreateServiceLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (link: Omit<ServiceLink, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("service_links")
        .insert([link])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin-service-links"] });
    },
  });
}

export function useUpdateServiceLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceLink> & { id: string }) => {
      const { data, error } = await supabase
        .from("service_links")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin-service-links"] });
    },
  });
}

export function useDeleteServiceLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin-service-links"] });
    },
  });
}
