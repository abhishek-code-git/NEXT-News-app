import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ArticleManager } from "@/components/admin/ArticleManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { ServiceLinkManager } from "@/components/admin/ServiceLinkManager";

type AdminTab = "dashboard" | "articles" | "categories" | "links";

export default function Admin() {
  const router = useRouter();
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "articles" as const, label: "Articles", icon: FileText },
    { id: "categories" as const, label: "Categories", icon: FolderOpen },
    { id: "links" as const, label: "Service Links", icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="New Digital India" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold">Admin</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border hidden lg:block">
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="New Digital India" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h1 className="font-bold text-lg">New Digital India</h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </a>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full admin-nav-item
                    ${activeTab === item.id ? "active" : "text-muted-foreground"}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {activeTab === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 min-h-screen lg:pt-0 pt-0">
          <div className="p-6 lg:p-8">
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "articles" && <ArticleManager />}
            {activeTab === "categories" && <CategoryManager />}
            {activeTab === "links" && <ServiceLinkManager />}
          </div>
        </main>
      </div>
    </div>
  );
}
