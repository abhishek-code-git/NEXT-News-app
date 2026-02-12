-- Create service_links table for external service links
CREATE TABLE public.service_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.service_links ENABLE ROW LEVEL SECURITY;

-- Public can view active links
CREATE POLICY "Service links are viewable by everyone"
ON public.service_links
FOR SELECT
USING (is_active = true OR (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
)));

-- Admins can insert links
CREATE POLICY "Admins can insert service links"
ON public.service_links
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Admins can update links
CREATE POLICY "Admins can update service links"
ON public.service_links
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Admins can delete links
CREATE POLICY "Admins can delete service links"
ON public.service_links
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Add trigger for updated_at
CREATE TRIGGER update_service_links_updated_at
BEFORE UPDATE ON public.service_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();