import { useCategories } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
        ))}
      </div>
    );
  }

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("all")}
        className="flex-shrink-0"
      >
        All News
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.slug)}
          className="flex-shrink-0 gap-1.5"
          style={selectedCategory === category.slug ? {
            backgroundColor: category.color || undefined,
            borderColor: category.color || undefined,
          } : {}}
        >
          {getIcon(category.icon)}
          {category.name}
        </Button>
      ))}
    </div>
  );
}
