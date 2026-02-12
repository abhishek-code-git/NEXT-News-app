import { useEffect, useRef, memo } from "react";

export const AdPopunder = memo(function AdPopunder() {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.effectivegatecpm.com/p4ihx42c?key=9ca8b22b06b232db2a48716273150eef";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
});
