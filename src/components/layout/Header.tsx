import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Newspaper, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useNews";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const { data: categories } = useCategories();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <span className="hidden sm:block">Your trusted source for latest news</span>
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/80">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="New Digital India" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">New Digital India</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">News & Updates</p>
            </div>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search news..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-4 w-full bg-secondary border-0 focus-visible:ring-1"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-4 w-full bg-secondary border-0"
            />
          </div>
        </form>
      </div>

      {/* Category Navigation */}
      <nav className="border-t border-border bg-card">
        <div className="container">
          <div className={`${isMenuOpen ? "block" : "hidden"} md:block`}>
            <ul className="flex flex-col md:flex-row md:items-center md:gap-1 py-2 md:py-0 md:overflow-x-auto custom-scrollbar">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All News
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/?category=${category.slug}`}
                    className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors whitespace-nowrap"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
