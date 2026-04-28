import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useMemo } from 'react';

/**
 * NATIONAL GRID: ZENITH THEME CONTROLLER (V5.0)
 * Logic: Hardware-accelerated DOM synchronization & pitch-black state persistence.
 * Performance: O(1) attribute injection for total-tab blackout.
 */
export default function ThemeToggle() {
  const context = useApp();
  if (!context) return null;
  const { theme, changeTheme } = context;

  // DERIVED STATE: Determine if Space Ops (Blackout) is active
  // This checks the DOM directly for 100% accuracy with space-theme.css
  const isSpaceActive = useMemo(() => theme !== 'onyx', [theme]);

  const handleProtocolShift = useCallback((target: 'light' | 'space') => {
    const root = document.documentElement;
    
    if (target === 'space') {
      root.classList.add('dark');
      // If the current skin is light, we move to Midnight as the default Dark foundation
      changeTheme(theme === 'onyx' ? 'midnight' : theme);
    } else {
      root.classList.remove('dark');
      changeTheme('onyx');
    }
  }, [theme, changeTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative h-12 w-12 rounded-2xl transition-all duration-700 group overflow-hidden border",
            isSpaceActive 
              ? "bg-[#020617] border-white/10 text-primary shadow-[0_0_25px_rgba(var(--primary),0.1)]" 
              : "bg-white border-slate-200 text-slate-500 shadow-xl"
          )}
        >
          {/* 💎 TACTICAL RADIANCE FIELD */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl",
            isSpaceActive ? "bg-primary" : "bg-blue-500"
          )} />

          <AnimatePresence mode="wait" initial={false}>
            {isSpaceActive ? (
              <motion.div
                key="space-ops"
                initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 1.5, rotate: -90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative z-10"
              >
                <Moon className="h-5 w-5 fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="daylight-ops"
                initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 1.5, rotate: 90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative z-10"
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-64 p-3 rounded-[2rem] border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 backdrop-blur-3xl",
          isSpaceActive ? "bg-[#020617]/90 border-white/10 text-white" : "bg-white/90 border-slate-100"
        )}
      >
        <div className="px-4 py-3 mb-2 flex items-center gap-3 border-b border-foreground/5">
          <Zap className={cn("h-3 w-3 animate-pulse", isSpaceActive ? "text-primary" : "text-blue-500")} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-50">Neural Telemetry</span>
        </div>

        {/* DAYLIGHT PROTOCOL */}
        <DropdownMenuItem 
          onClick={() => handleProtocolShift('light')}
          className={cn(
            "rounded-xl px-4 py-4 cursor-pointer flex items-center justify-between transition-all duration-300 mb-1",
            !isSpaceActive ? "bg-primary text-white shadow-lg" : "hover:bg-white/5"
          )}
        >
          <div className="flex items-center gap-4">
            <Sun className={cn("h-4 w-4", !isSpaceActive ? "text-white" : "text-amber-500")} />
            <span className="text-[10px] font-black uppercase tracking-widest">Daylight Mode</span>
          </div>
          {!isSpaceActive && <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
        </DropdownMenuItem>

        {/* STEALTH PROTOCOL (SPACE MODE) */}
        <DropdownMenuItem 
          onClick={() => handleProtocolShift('space')}
          className={cn(
            "rounded-xl px-4 py-4 cursor-pointer flex items-center justify-between transition-all duration-300 mb-1",
            isSpaceActive ? "bg-primary text-white shadow-lg" : "hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-4">
            <Moon className={cn("h-4 w-4", isSpaceActive ? "text-white" : "text-slate-400")} />
            <span className="text-[10px] font-black uppercase tracking-widest">Space Ops</span>
          </div>
          {isSpaceActive && <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
        </DropdownMenuItem>

        <DropdownMenuItem className="rounded-xl px-4 py-4 flex items-center gap-4 text-muted-foreground opacity-30 cursor-not-allowed">
          <Monitor className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">System Default</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}