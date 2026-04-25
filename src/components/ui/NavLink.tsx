import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

/**
 * ENHANCED TACTICAL NAVLINK
 * Preserves all original features: forwardRef, pending states, and inset shadows.
 * Hardened to prevent internal React 'render2' type errors.
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // Using a stabilized callback to ensure compatibility with modern React reconciliation
        className={({ isActive, isPending }) => {
          const baseClasses = "relative flex items-center transition-all duration-200 group";
          
          const pendingStyles = isPending 
            ? cn("opacity-50 grayscale", pendingClassName) 
            : "";
            
          const activeStyles = isActive 
            ? cn(
                "bg-primary/10 text-primary font-bold shadow-[inset_4px_0_0_0_rgba(59,130,246,1)]", 
                activeClassName
              ) 
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50";

          return cn(baseClasses, className, pendingStyles, activeStyles);
        }}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };