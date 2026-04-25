import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, Radio, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * NATIONAL GRID: CONNECTIVITY & SYNC TELEMETRY
 * 100% Logic Preservation | Architectural Sync Optimized
 */
export function ConnectivityBanner() {
  // --- SECURE CONTEXT UPLINK ---
  const context = useApp();
  const { isOnline, syncingCount = 0, theme = 'light' } = context || {};

  return (
    <AnimatePresence mode="wait">
      {/* 1. TACTICAL SYNC/OFFLINE DISPLAY */}
      {!isOnline || syncingCount > 0 ? (
        <motion.div
          key={isOnline ? 'syncing' : 'offline'}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative z-[70] flex items-center justify-center gap-4 px-6 py-2 text-[9px] font-black uppercase tracking-[0.3em] border-b transition-all duration-500 shadow-lg overflow-hidden",
            isOnline 
              ? theme === 'dark'
                ? 'bg-primary/20 text-primary border-primary/20 backdrop-blur-md'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : theme === 'dark'
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 backdrop-blur-md'
                : 'bg-amber-50 text-amber-600 border-amber-100'
          )}
        >
          {isOnline ? (
            <div className="flex items-center gap-3">
              <RefreshCw className="h-3 w-3 animate-spin text-primary" />
              <span className="flex items-center gap-2">
                <Radio className="h-3 w-3 animate-pulse" />
                Uplink Active: Synchronizing {syncingCount} Field Reports to National Grid
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <WifiOff className="h-3 w-3 animate-pulse text-amber-500" />
              <span className="flex items-center gap-2 italic">
                <Zap className="h-3 w-3 fill-amber-500" />
                Local Cache Mode: Data Encrypted & Secured in Offline Node
              </span>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}