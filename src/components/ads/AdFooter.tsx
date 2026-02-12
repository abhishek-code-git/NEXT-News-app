import { memo } from "react";
import { AdNative } from "./AdNative";

interface AdFooterProps {
  className?: string;
}

export const AdFooter = memo(function AdFooter({ className = "" }: AdFooterProps) {
  return (
    <div className={`w-full bg-muted/30 py-6 ${className}`}>
      <div className="container">
        <div className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wide">
          You May Also Like
        </div>
        <AdNative 
          adKey="c7b0543d90ae3ae0f92e997a5d37d0ab" 
          containerId="container-c7b0543d90ae3ae0f92e997a5d37d0ab" 
        />
      </div>
    </div>
  );
});
