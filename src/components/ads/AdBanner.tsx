import { useEffect, useRef, memo } from "react";

interface AdBannerProps {
  adKey: string;
  width?: number;
  height?: number;
  format?: "iframe" | "native";
  className?: string;
}

export const AdBanner = memo(function AdBanner({
  adKey,
  width = 728,
  height = 90,
  format = "iframe",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current || !adRef.current) return;
    isLoaded.current = true;

    // Create and inject the ad script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      atOptions = {
        'key': '${adKey}',
        'format': '${format}',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    `;
    adRef.current.appendChild(script);

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;
    adRef.current.appendChild(invokeScript);
  }, [adKey, width, height, format]);

  return (
    <div 
      ref={adRef} 
      className={`ad-container flex items-center justify-center min-h-[${height}px] ${className}`}
      aria-label="Advertisement"
    />
  );
});
