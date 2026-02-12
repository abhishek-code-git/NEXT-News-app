import { ExternalLink } from "lucide-react";
import { useServiceLinks } from "@/hooks/useServiceLinks";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";

export function ServiceLinksSection() {
  const { data: serviceLinks, isLoading } = useServiceLinks();

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Useful Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!serviceLinks?.length) {
    return null;
  }

  const isCustomIconUrl = (iconName: string | null) => {
    return iconName && (iconName.startsWith("http://") || iconName.startsWith("https://"));
  };

  const getIcon = (iconName: string | null): React.ComponentType<{ className?: string }> | null => {
    if (!iconName || isCustomIconUrl(iconName)) return null;
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    const IconComponent = icons[iconName];
    return IconComponent || ExternalLink;
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Useful Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceLinks.map((link) => {
          const Icon = getIcon(link.icon);
          const isCustomIcon = isCustomIconUrl(link.icon);
          
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-5 bg-card border border-border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors overflow-hidden">
                  {isCustomIcon ? (
                    <img 
                      src={link.icon!} 
                      alt={link.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>';
                      }}
                    />
                  ) : Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
              </div>
              {link.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
