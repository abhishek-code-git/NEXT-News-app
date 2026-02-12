import { memo } from "react";
import { AdBanner } from "./AdBanner";

interface AdSidebarProps {
  className?: string;
}

export const AdSidebar = memo(function AdSidebar({ className = "" }: AdSidebarProps) {
  return (
    <div className={`sticky top-24 ${className}`}>
      <div className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wide">
        Sponsored
      </div>
      <div className="bg-muted/30 rounded-lg p-2">
        <AdBanner 
          adKey="36b892f7035bb813a28da975c82deeae" 
          width={300} 
          height={250} 
        />
      </div>
    </div>
  );
});
