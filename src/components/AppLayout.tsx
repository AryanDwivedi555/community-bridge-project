import { ReactNode } from 'react';
import { SidebarProvider } from './ui/sidebar'; 
import { AppSidebar } from './AppSidebar'; 
import { TopNavbar } from './TopNavbar'; 
import { ConnectivityBanner } from './ConnectivityBanner'; 
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import VoiceNavigator from './VoiceNavigator';

/**
 * NATIONAL GRID: SYSTEM ARCHITECTURE LAYOUT
 * Optimized for Split-View: Map (Full Screen) & Hub (Scrollable)
 */
export function AppLayout({ children }: { children: ReactNode }) {
  const context = useApp();
  const theme = context?.theme || 'light';

  return (
    <SidebarProvider>
      <div className={cn(
        "min-h-screen flex w-full transition-colors duration-500 selection:bg-primary/20 overflow-hidden",
        theme === 'dark' ? "bg-slate-950 selection:text-white" : "bg-slate-50/50 selection:text-primary"
      )}>
        
        {/* 1. TACTICAL SIDEBAR NAVIGATION */}
        <AppSidebar />
        
        {/* Changed to h-screen to fix the "half-cut" layout issue */}
        <div className="flex-1 flex flex-col h-screen min-w-0 relative z-10">
          
          {/* 2. COMMAND HEADER & NETWORK STATUS */}
          <TopNavbar />
          <ConnectivityBanner />
          
          {/* 3. CORE MISSION AREA (Optimized for Scroll vs Full-Screen) */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide perspective-1000">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-4 md:p-6 lg:p-10 max-w-[1800px] mx-auto w-full min-h-full flex flex-col"
            >
              {children}
            </motion.div>
          </main>

          {/* 4. TACTICAL BACKGROUND ACCENTS */}
          <div className={cn(
            "fixed top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700",
            theme === 'dark' ? "bg-primary/10 opacity-40" : "bg-primary/5 opacity-100"
          )} />
          
          <div className={cn(
            "fixed bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700",
            theme === 'dark' ? "bg-emerald-500/5" : "bg-slate-200/50"
          )} />
        </div>

        {/* 5. GLOBAL MISSION CO-PILOT */}
        <VoiceNavigator />
      </div>
    </SidebarProvider>
  );
}