import { memo } from "react";
import { AdBanner } from "./AdBanner";

interface AdHeaderProps {
  className?: string;
}

export const AdHeader = memo(function AdHeader({ className = "" }: AdHeaderProps) {
  return (
    <div className={`w-full bg-muted/50 py-2 ${className}`}>
      <div className="container">
        <div className="flex justify-center">
          {/* Mobile leaderboard - 320x50 */}
          <div className="block md:hidden">
            <AdBanner 
              adKey="5b98ddba224c19ffbc9b26b5a511cc88" 
              width={320} 
              height={50} 
            />
          </div>
          {/* Desktop leaderboard - 728x90 */}
          <div className="hidden md:block">
            <AdBanner 
              adKey="43252125c585224a1a15b6297dc7dc0e" 
              width={728} 
              height={90} 
            />
          </div>
        </div>
      </div>
    </div>
  );
});
