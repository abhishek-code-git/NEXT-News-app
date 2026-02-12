import { memo } from "react";
import { AdBanner } from "./AdBanner";

interface AdInArticleProps {
  className?: string;
}

export const AdInArticle = memo(function AdInArticle({ className = "" }: AdInArticleProps) {
  return (
    <div className={`py-4 ${className}`}>
      <div className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wide">
        Advertisement
      </div>
      <div className="flex justify-center">
        {/* Mobile ad - 320x50 */}
        <div className="block sm:hidden">
          <AdBanner 
            adKey="5b98ddba224c19ffbc9b26b5a511cc88" 
            width={320} 
            height={50} 
          />
        </div>
        {/* Desktop ad - 728x90 */}
        <div className="hidden sm:block">
          <AdBanner 
            adKey="43252125c585224a1a15b6297dc7dc0e" 
            width={728} 
            height={90} 
          />
        </div>
      </div>
    </div>
  );
});
