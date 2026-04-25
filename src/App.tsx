import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { NotificationProvider } from "@/contexts/NotificationContext"; // INTELLIGENCE ENGINE
import { AppLayout } from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- FIXED IMPORT: Matching your actual filename in src/components ---
import VoiceNavigator from "./components/VoiceNavigator"; 

// Page Imports
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Volunteers from "./pages/Volunteers";
import NGONetwork from "./pages/NGONetwork";
import Reports from "./pages/Reports";
import MissionControl from "./pages/MissionControl"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * ELITE ROUTE WRAPPER
 * Handles the high-fidelity page transition animations.
 * Restored: Every original transition and scale property.
 */
const AnimatedRoutes = () => {
  const location = useLocation();
  const context = useApp();
  const theme = context?.theme || 'light';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.99, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.01, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full min-h-full flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mission-control" element={<MissionControl />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/ngo-network" element={<NGONetwork />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const context = useApp();
  
  if (!context) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
      </div>
    );
  }

  const { theme, isOnline } = context;

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans transition-colors duration-500 relative",
      theme === 'dark' ? "bg-slate-950 text-white" : "bg-white text-slate-900"
    )}>
      {/* PROFESSIONAL DECORATION: Neural Grid Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20",
          theme === 'dark' ? "bg-blue-600/30" : "bg-blue-200/40"
        )} />
      </div>

      {/* 1. TACTICAL GLOBAL CONNECTIVITY HEADER */}
      <div className={cn(
        "py-1.5 px-6 flex justify-center items-center gap-4 border-b transition-colors duration-500 z-[100]",
        theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-primary/5 border-primary/10"
      )}>
        <div className={cn(
          "h-2 w-2 rounded-full animate-pulse shadow-lg",
          isOnline ? "bg-emerald-500 shadow-emerald-500/50" : "bg-amber-500 shadow-amber-500/50"
        )} />
        <span className={cn(
          "text-[9px] font-black uppercase tracking-[0.4em]",
          theme === 'dark' ? "text-slate-500" : "text-primary/60"
        )}>
          National Grid Protocol 2.4 — {isOnline ? 'Uplink Established' : 'Local Cache Active'}
        </span>
      </div>

      {/* 2. MAIN ARCHITECTURE */}
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>

      {/* 3. TACTICAL OVERLAYS */}
      <VoiceNavigator />

      {/* 4. NOTIFICATION SYSTEMS */}
      <Toaster />
      <Sonner 
        position="bottom-right" 
        expand={true} 
        richColors 
        theme={theme === 'dark' ? 'dark' : 'light'}
        className="font-sans font-bold"
      />

      {/* GLOBAL CSS INJECTION for Tactical Scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${theme === 'dark' ? '#1e293b' : '#e2e8f0'}; 
          border-radius: 20px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* FIXED: Wrapped the entire app in NotificationProvider to solve the 'useIntel' crash */}
      <NotificationProvider>
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;