import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  X, 
  Zap, 
  Target,
  Activity,
  Cpu,
  Wifi,
  Lock,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface TacticalToastProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning' | 'mission';
  onClose: () => void;
  visible: boolean;
}

/**
 * NATIONAL GRID: TACTICAL TELEMETRY TOAST v4.0
 * 100% Replaceable - Hardened with Staggered Initialization & Holographic Buffers.
 */
export const TacticalToast = ({ 
  title, 
  description, 
  type = 'info', 
  onClose, 
  visible 
}: TacticalToastProps) => {
  const { theme } = useApp();

  const configs = {
    success: {
      icon: CheckCircle2,
      secondary: Lock,
      color: "text-emerald-500",
      accent: "bg-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "Link Secured"
    },
    error: {
      icon: ShieldAlert,
      secondary: Cpu,
      color: "text-red-500",
      accent: "bg-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      label: "Critical Breach"
    },
    warning: {
      icon: Zap,
      secondary: Wifi,
      color: "text-amber-500",
      accent: "bg-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      label: "Grid Instability"
    },
    mission: {
      icon: Target,
      secondary: Terminal,
      color: "text-blue-500",
      accent: "bg-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      label: "Mission Uplink"
    },
    info: {
      icon: Info,
      secondary: Bell,
      color: "text-slate-400",
      accent: "bg-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
      label: "System Intel"
    }
  };

  const config = configs[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          layout
          initial={{ opacity: 0, x: 80, filter: 'blur(15px)', scale: 0.9 }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, x: 20, filter: 'blur(5px)', scale: 0.95 }}
          className="fixed bottom-10 right-10 z-[2000] pointer-events-none"
        >
          <motion.div
            className={cn(
              "pointer-events-auto relative flex w-[420px] overflow-hidden rounded-[2.5rem] border transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
              config.border,
              theme === 'dark' ? "bg-slate-950/90 backdrop-blur-3xl" : "bg-white/95 backdrop-blur-2xl"
            )}
          >
            {/* --- 0. BACKGROUND DECORATION (SCANLINE) --- */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="flex w-full p-6">
              <div className="flex flex-1 items-start gap-6">
                {/* --- 1. TACTICAL HEXAGON-CORE ICON --- */}
                <div className="relative shrink-0">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className={cn("absolute -inset-1.5 rounded-2xl border border-dashed opacity-20", config.border)}
                  />
                  <div className={cn(
                    "relative flex h-14 w-14 items-center justify-center rounded-[1.2rem] transition-transform hover:scale-110",
                    config.bg,
                    "shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] border border-white/5"
                  )}>
                    <config.icon className={cn("h-7 w-7 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]", config.color)} />
                  </div>
                </div>

                {/* --- 2. DATA PAYLOAD --- */}
                <div className="flex flex-1 flex-col pt-1.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-ping", config.accent)} />
                      <p className={cn("text-[10px] font-black uppercase tracking-[0.5em] leading-none", config.color)}>
                        {config.label}
                      </p>
                    </div>
                    {/* ENHANCED STATUS BARS */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div 
                          key={i} 
                          animate={{ opacity: [0.1, 0.4, 0.1] }}
                          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                          className={cn("h-1 w-2 rounded-full", config.accent)} 
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className={cn(
                    "text-sm font-black uppercase tracking-tight italic mb-1 text-balance",
                    theme === 'dark' ? "text-white" : "text-slate-900"
                  )}>
                    {title}
                  </h4>
                  
                  {description && (
                    <p className="text-[11px] font-bold leading-relaxed text-slate-500/90 line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>

                {/* --- 3. COMMAND OVERRIDE (CLOSE) --- */}
                <button
                  onClick={onClose}
                  className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 transition-all"
                >
                  <X size={14} className="text-slate-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* --- 4. TACTICAL SIDE-BAR INDICATOR --- */}
            <div className={cn("absolute left-0 top-6 bottom-6 w-1 rounded-r-full", config.accent)} />

            {/* --- 5. TTL (TIME-TO-LIVE) BUFFER BAR --- */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
              <motion.div 
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className={cn("h-full origin-left", config.accent)}
                style={{ filter: "blur(0.5px)" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};