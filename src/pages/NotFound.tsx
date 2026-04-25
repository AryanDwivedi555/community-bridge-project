import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Home, SearchX, ArrowLeft, Radio, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useApp();

  useEffect(() => {
    // CSE Protocol: Log unauthorized route access to the console
    console.error(
      "GRID ERROR: 404 Route Terminated ->",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={cn(
      "flex min-h-[85vh] items-center justify-center p-6 transition-colors duration-500",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      <div className="max-w-md w-full text-center space-y-10">
        
        {/* 1. TACTICAL ERROR VISUAL */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className={cn(
            "h-40 w-40 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border transition-all duration-500",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          )}>
            <SearchX className="h-16 w-16 text-primary/30" />
          </div>

          {/* Pulsing Alert Node */}
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20"
          >
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </motion.div>
        </motion.div>

        {/* 2. TEXTUAL TELEMETRY */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl font-black tracking-tighter italic leading-none opacity-20"
          >
            404
          </motion.h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">Signal Terminated</h2>
            <p className={cn(
              "text-xs font-bold leading-relaxed px-4",
              theme === 'dark' ? "text-slate-400" : "text-slate-500"
            )}>
              The coordinates at <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md italic">{location.pathname}</span> do not correspond to any active mission node in the National Grid.
            </p>
          </div>
        </div>

        {/* 3. RECOVERY ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            asChild 
            variant="ghost" 
            className={cn(
              "h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]",
              theme === 'dark' ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Link to={-1 as any}>
              <ArrowLeft className="mr-3 h-4 w-4" /> Previous Sector
            </Link>
          </Button>
          
          <Button asChild className="h-14 px-8 bg-primary hover:bg-slate-900 text-white shadow-xl shadow-primary/20 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
            <Link to="/">
              <Home className="mr-3 h-4 w-4" /> Return to Command
            </Link>
          </Button>
        </div>

        {/* 4. FOOTER BRANDING */}
        <div className="flex items-center justify-center gap-4 opacity-40">
           <div className="h-[1px] w-8 bg-slate-500" />
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
             National Grid Infrastructure
           </p>
           <div className="h-[1px] w-8 bg-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;