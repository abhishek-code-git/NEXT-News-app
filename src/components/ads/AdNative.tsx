import { useEffect, useRef, memo } from "react";

interface AdNativeProps {
  adKey: string;
  containerId: string;
  className?: string;
}

export const AdNative = memo(function AdNative({
  adKey,
  containerId,
  className = "",
}: AdNativeProps) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    // Create and inject the native ad script
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://pl28640273.effectivegatecpm.com/${adKey}/invoke.js`;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [adKey]);

  return (
    <div 
      id={containerId} 
      className={`ad-native-container ${className}`}
      aria-label="Advertisement"
    />
  );
});
