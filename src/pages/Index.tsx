import { useApp } from '@/contexts/AppContext';
import { 
  Activity, 
  Users, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  Radar,
  Target,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { T } from '@/components/T'; // --- NEURAL BRIDGE INTEGRATED ---

const Dashboard = () => {
  const { language, needs, volunteers, theme } = useApp();
  
  // Tactical Real-time Stats (Preserved Logic)
  const pendingCount = needs.filter(n => n.status === 'pending' || n.status === 'assigned').length;
  const resolvedCount = needs.filter(n => n.status === 'resolved').length;

  const stats = [
    { label: "Active Missions", value: pendingCount, icon: Radar, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Resolved Nodes", value: resolvedCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Response Agents", value: volunteers.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Grid Stability", value: "98.2%", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className={cn(
      "space-y-12 pb-12 animate-in fade-in duration-1000 transition-colors duration-500",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      
      {/* 1. ELITE COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
               <T>System Uplink: Encrypted</T>
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "text-6xl font-black tracking-tighter italic uppercase leading-none",
                theme === 'dark' ? "text-white" : "text-slate-900"
            )}
          >
            <T>welcome</T>
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Zap className="h-5 w-5 text-primary fill-primary" />
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">
              <T>affiliation</T> — <span className={theme === 'dark' ? "text-primary" : "text-slate-900"}><T>National Node 01</T></span>
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
              "px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-5 border transition-all",
              theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1"><T>Active Locale</T></p>
            <p className="text-xs font-black uppercase italic"><T>{language}</T></p>
          </div>
        </motion.div>
      </div>

      {/* 2. SPATIAL ANALYTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: "easeOut" }}
            className={cn(
                "group relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-default overflow-hidden shadow-xl",
                theme === 'dark' ? "bg-slate-900 border-slate-800 hover:border-primary/40" : "bg-white border-slate-100 hover:border-primary/20 hover:shadow-primary/5"
            )}
          >
            <div className={cn(
                "absolute -right-6 -bottom-6 opacity-[0.03] transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12",
                theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              <stat.icon size={140} />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={cn("p-4 rounded-2xl transition-all duration-500 shadow-lg", stat.bg)}>
                <stat.icon className={cn("h-7 w-7", stat.color)} />
              </div>
              <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0",
                  theme === 'dark' ? "bg-slate-800" : "bg-slate-50"
              )}>
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"><T>{stat.label}</T></p>
              <p className={cn("text-5xl font-black tracking-tighter leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}>
                <T>{stat.value}</T>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. TACTICAL GRID INTERFACE (RADAR) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={cn(
            "relative overflow-hidden rounded-[4rem] border h-[520px] flex items-center justify-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] transition-all",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <div className="h-[300px] w-[300px] rounded-full border-2 border-primary animate-ping" />
          <div className="h-[600px] w-[600px] rounded-full border-2 border-primary animate-ping [animation-delay:1.5s]" />
          <div className="h-[900px] w-[900px] rounded-full border-2 border-primary animate-ping [animation-delay:3s]" />
        </div>
        
        <div className="text-center space-y-8 z-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-slate-950 p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
              <Activity className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 px-6">
            <h3 className={cn("font-black uppercase tracking-tighter text-3xl italic", theme === 'dark' ? "text-white" : "text-slate-900")}>
              <T>National Mission Grid</T>
            </h3>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] max-w-[320px] mx-auto leading-loose opacity-70">
              <T>Uplinking live telemetry from decentralized field response nodes</T>
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={cn(
                "h-2 w-2 rounded-full",
                i === 2 ? "bg-primary animate-bounce shadow-[0_0_10px_primary]" : "bg-primary/20"
              )} />
            ))}
          </div>
        </div>

        {/* TACTICAL FOOTER OVERLAY */}
        <div className={cn(
            "absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-8",
            theme === 'dark' ? "border-white/5" : "border-slate-50"
        )}>
           <div className="flex items-center gap-8">
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2"><T>Protocol</T></p>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <p className={cn("text-xs font-black uppercase", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      <T>AES-256 Secure</T>
                    </p>
                </div>
              </div>
              <div className={cn("h-8 w-[1px]", theme === 'dark' ? "bg-slate-800" : "bg-slate-100")} />
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2"><T>Latency</T></p>
                <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <p className={cn("text-xs font-black uppercase", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      <T>14ms Stable</T>
                    </p>
                </div>
              </div>
           </div>
           
           <button className="group flex items-center gap-4 bg-primary px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:bg-slate-950 transition-all active:scale-95">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                <T>Initialize Scan</T>
             </span>
             <ChevronRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;