import { Wifi, WifiOff, Bell, Settings2, RefreshCw, Radio, Zap, Shield, Activity, ShieldAlert, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';
import { useIntel } from '@/contexts/NotificationContext'; // Hook Integrated
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * NATIONAL GRID: COMMAND HEADER & TELEMETRY HUB
 * Professional Intelligence Feed Integrated | Zero Code Trimming
 */
export function TopNavbar() {
  const { isOnline, toggleOnline, syncingCount = 0, theme } = useApp();
  const { alerts, hasUnread, markAsRead } = useIntel(); // Intel Logic

  return (
    <header className={cn(
      "h-20 border-b sticky top-0 z-[100] flex items-center justify-between px-8 shrink-0 transition-all duration-500 backdrop-blur-xl",
      theme === 'dark' 
        ? "bg-slate-950/80 border-slate-800 shadow-2xl shadow-black/40" 
        : "bg-white/90 border-slate-100 shadow-sm"
    )}>
      
      {/* 1. LEFT: TACTICAL IDENTITY */}
      <div className="flex items-center gap-5">
        <SidebarTrigger className={cn(
          "transition-all p-2.5 rounded-xl hover:scale-110 active:scale-90",
          theme === 'dark' ? "text-slate-400 hover:text-primary hover:bg-primary/10" : "text-slate-500 hover:text-primary hover:bg-slate-50"
        )} />
        <div className={cn("h-8 w-[1px] hidden md:block", theme === 'dark' ? "bg-slate-800" : "bg-slate-200")} />
        <div className="hidden md:flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(var(--primary),0.6)]" />
            <div className="flex flex-col">
              <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] leading-none mb-1.5", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>
                Strategic Sector
              </span>
              <span className={cn("text-[12px] font-black uppercase italic tracking-tighter leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}>
                National Grid: Node-01
              </span>
            </div>
        </div>
      </div>

      {/* 2. RIGHT: COMMAND CONTROLS */}
      <div className="flex items-center gap-6 lg:gap-10">
        
        {/* Sync Indicator (Zero Trimming Logic) */}
        <AnimatePresence>
          {syncingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "hidden xl:flex items-center gap-3 rounded-full px-6 py-2 border shadow-2xl transition-all",
                theme === 'dark' ? "bg-primary/10 border-primary/20" : "bg-primary/5 border-primary/10"
              )}
            >
              <RefreshCw className="h-3.5 w-3.5 text-primary animate-spin" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">
                Uplinking {syncingCount} Reports
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connectivity Switch Engine */}
        <div className={cn(
          "flex items-center gap-4 px-5 py-2.5 rounded-full border shadow-2xl transition-all duration-500",
          theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
        )}>
          <div className="flex items-center gap-3">
            {isOnline ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
                <Wifi className="h-4 w-4 text-emerald-500" />
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]" />
                <WifiOff className="h-4 w-4 text-amber-500" />
              </motion.div>
            )}
          </div>
          
          <Switch 
            checked={isOnline} 
            onCheckedChange={toggleOnline} 
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700"
          />
          
          <span className={cn(
            "hidden lg:inline text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-colors",
            isOnline ? "text-emerald-500" : "text-amber-500"
          )}>
            {isOnline ? 'System Live' : 'Field Offline'}
          </span>
        </div>

        {/* Tactical Actions */}
        <div className="hidden sm:flex items-center gap-4">
          
          {/* THE NEW INTELLIGENCE FEED POPOVER */}
          <Popover onOpenChange={(open) => open && markAsRead()}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(
                "h-11 w-11 rounded-2xl transition-all relative group",
                theme === 'dark' ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-primary hover:bg-slate-100"
              )}>
                <Bell className={cn("h-5.5 w-5.5", hasUnread && "text-blue-500 animate-pulse")} />
                
                {/* UNREAD RED DOT INDICATOR */}
                <AnimatePresence>
                  {hasUnread && (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    />
                  )}
                </AnimatePresence>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-96 p-0 bg-slate-950 border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl z-[101]">
              <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Intelligence Feed</h4>
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{alerts.length} Nodes</span>
              </div>

              <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="p-12 text-center opacity-20 flex flex-col items-center">
                    <Shield className="h-10 w-10 mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest">No Active Telemetry</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className={cn(
                      "p-5 border-b border-white/5 transition-all hover:bg-white/5 relative group/item",
                      !alert.isRead && "bg-blue-500/5"
                    )}>
                      {!alert.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 shadow-[0_0_10px_#3b82f6]" />}
                      <div className="flex justify-between items-start mb-1.5">
                        <p className={cn("text-[8px] font-black uppercase tracking-widest", !alert.isRead ? "text-blue-400" : "text-slate-500")}>
                          {alert.type} protocol
                        </p>
                        <span className="text-[8px] font-medium text-slate-600 uppercase italic">{alert.timestamp}</span>
                      </div>
                      <h5 className="text-[11px] font-black text-white uppercase italic tracking-tight mb-1 group-hover/item:text-blue-400 transition-colors">
                        {alert.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        {alert.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className={cn(
            "h-11 w-11 rounded-2xl transition-all hover:scale-110",
            theme === 'dark' ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-primary hover:bg-slate-100"
          )}>
            <Settings2 className="h-5.5 w-5.5" />
          </Button>
        </div>

        {/* Identity Node (Aryan) */}
        <div className={cn(
          "flex items-center gap-5 pl-8 border-l transition-all",
          theme === 'dark' ? "border-slate-800" : "border-slate-200"
        )}>
          <div className="hidden lg:flex flex-col items-end">
            <span className={cn("text-[14px] font-black tracking-tighter uppercase italic", theme === 'dark' ? "text-white" : "text-slate-900")}>
              Aryan
            </span>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] leading-none mt-1.5">
              Command Lead
            </span>
          </div>
          <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.2)] ring-4 ring-primary/10 cursor-pointer hover:rotate-3 transition-all">
            <AvatarFallback className="bg-primary text-white text-[10px] font-black italic">
              AR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}