import * as React from "react";

/**
 * Community Bridge - Responsive Viewport Hook
 * Standardized at 768px to match Tailwind's 'md' breakpoint.
 */
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // We create the listener once for performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Optimized handler using the event's built-in 'matches' property
    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    // Initialize state on mount
    setIsMobile(mql.matches);

    // Modern event listener syntax
    mql.addEventListener("change", onChange);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}