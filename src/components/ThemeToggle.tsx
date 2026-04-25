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

/**
 * NATIONAL GRID: ELITE THEME CONTROLLER
 * Manages High-Visibility (Daylight) and Stealth Ops (Dark) transitions.
 * Hardened against context-level re-render loops.
 */
export default function ThemeToggle() {
  const context = useApp();
  
  // Defensive guard for context availability
  if (!context) return null;
  const { theme, toggleTheme } = context;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative h-12 w-12 rounded-2xl transition-all duration-500 group overflow-hidden border",
            theme === 'dark' 
              ? "bg-slate-900 border-slate-800 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
              : "bg-white border-slate-200 text-slate-500 shadow-xl"
          )}
        >
          {/* Tactical Glow Accent */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl",
            theme === 'dark' ? "bg-amber-500" : "bg-primary"
          )} />

          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ y: 20, rotate: 45, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -20, rotate: -45, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <Moon className="h-5 w-5 fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ y: 20, rotate: -45, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -20, rotate: 45, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
          "w-52 p-2 rounded-[2rem] border shadow-2xl transition-all duration-500 backdrop-blur-2xl",
          theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-100"
        )}
      >
        <div className="px-4 py-3 mb-1 flex items-center gap-3 border-b border-white/5">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Optical Telemetry</span>
        </div>

        <DropdownMenuItem 
          onClick={() => theme !== 'light' && toggleTheme()}
          className={cn(
            "rounded-xl px-4 py-4 cursor-pointer flex items-center gap-4 transition-all mb-1",
            theme === 'light' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5"
          )}
        >
          <Sun className={cn("h-4 w-4", theme === 'light' ? "text-white" : "text-amber-500")} />
          <span className="text-[10px] font-black uppercase tracking-widest">Daylight Protocol</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => theme !== 'dark' && toggleTheme()}
          className={cn(
            "rounded-xl px-4 py-4 cursor-pointer flex items-center gap-4 transition-all mb-1",
            theme === 'dark' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50"
          )}
        >
          <Moon className={cn("h-4 w-4", theme === 'dark' ? "text-white" : "text-slate-400")} />
          <span className="text-[10px] font-black uppercase tracking-widest">Stealth Protocol</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="rounded-xl px-4 py-4 cursor-pointer flex items-center gap-4 text-slate-400 opacity-40 cursor-not-allowed">
          <Monitor className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Global OS Default</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}