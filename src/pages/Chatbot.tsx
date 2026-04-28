import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  CheckCircle, 
  ShieldCheck, 
  Search,
  Activity,
  Lock,
  Clock,
  Bot,
  Zap,
  Fingerprint,
  Terminal,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { T } from '@/components/T'; // --- NEURAL BRIDGE IMPORT ---

export default function VerificationSystem() {
  const { needs, resolveNeed, theme, acceptNeed } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});

  // --- ELITE SEARCH ALGORITHM (Preserved & Optimized) ---
  const filteredNeeds = needs.filter(n => 
    n.status !== 'resolved' && 
    (n.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
     n.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
     n.needType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOtpChange = (id: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setOtpInputs(prev => ({ ...prev, [id]: value }));
    }
  };

  const attemptResolution = (id: string) => {
    const enteredOtp = otpInputs[id] || '';
    if (enteredOtp.length !== 4) {
      toast.error(<T>Handshake Failed</T>, { 
        description: <T>Protocol requires a 4-digit tactical code.</T>,
        className: "font-black uppercase text-[10px]"
      });
      return;
    }
    
    const success = resolveNeed(id, enteredOtp);
    if (success) {
      setOtpInputs(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return (
    <div className={cn(
      "min-h-screen p-6 lg:p-12 transition-all duration-1000",
      theme === 'dark' ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-900"
    )}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. TACTICAL COMMAND HEADER (Zenith Style) */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex flex-col lg:flex-row lg:items-center justify-between gap-10 p-12 rounded-[4rem] shadow-6xl border backdrop-blur-3xl relative overflow-hidden",
            theme === 'dark' ? "bg-slate-900/40 border-white/5 shadow-black" : "bg-white border-slate-200 shadow-slate-200"
          )}
        >
          {/* Ambient Background Element */}
          <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 pointer-events-none">
             <Cpu size={200} />
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <div className="h-24 w-24 bg-gradient-to-br from-primary to-blue-700 rounded-[2rem] flex items-center justify-center shadow-3xl shadow-primary/40 relative group">
              <Bot className="h-12 w-12 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 animate-ping" />
            </div>
            <div className="space-y-2">
              <h2 className={cn("text-5xl font-black tracking-tighter uppercase italic leading-none")}>
                <T>Intelligence</T> <span className="text-primary"><T>Hub</T></span>
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-2 mt-3">
                <Fingerprint className="h-4 w-4 text-primary" /> <T>Verification Protocol v2.4</T>
              </p>
            </div>
          </div>
          
          <div className="relative group w-full lg:w-[500px] z-10">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-primary transition-all duration-500" />
            <input 
              type="text" 
              placeholder="Scan sector or node description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-16 pr-10 py-7 rounded-[2rem] text-sm font-black outline-none w-full transition-all shadow-inner border-2",
                theme === 'dark' 
                  ? "bg-slate-950/50 border-white/5 text-white placeholder:text-slate-800 focus:border-primary/40" 
                  : "bg-slate-100 border-transparent text-slate-900 placeholder:text-slate-400 focus:bg-white"
              )}
            />
          </div>
        </motion.div>

        {/* 2. MISSION LISTING GRID (Max Impact) */}
        <LayoutGroup>
          <div className="grid gap-10">
            <AnimatePresence mode="popLayout">
              {filteredNeeds.map((need, idx) => (
                <motion.div
                  key={need.id}
                  layout
                  initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                  className={cn(
                    "group p-1 rounded-[4rem] transition-all duration-700 hover:translate-x-3",
                    need.urgency >= 4 
                      ? "bg-gradient-to-r from-red-500/40 via-red-500/5 to-transparent" 
                      : "bg-gradient-to-r from-primary/40 via-primary/5 to-transparent"
                  )}
                >
                  <div className={cn(
                    "p-10 lg:p-14 rounded-[3.8rem] shadow-5xl flex flex-col lg:flex-row gap-12 justify-between items-center relative overflow-hidden",
                    theme === 'dark' ? "bg-slate-900/80 backdrop-blur-2xl" : "bg-white"
                  )}>
                    
                    {/* Tactical Content */}
                    <div className="space-y-8 flex-1 relative z-10">
                      <div className="flex items-center gap-6">
                        <Badge className={cn("px-6 py-2 font-black text-[11px] uppercase tracking-[0.2em] border-none shadow-xl", 
                          need.urgency >= 4 ? "bg-red-500 text-white" : "bg-primary text-white"
                        )}>
                          <T>Priority</T> <T>{need.urgency}</T>
                        </Badge>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 bg-slate-500/5 px-5 py-2 rounded-full">
                          <Clock className="h-4 w-4 text-primary" /> <T>{new Date(need.createdAt).toLocaleTimeString()}</T>
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className={cn("text-3xl lg:text-4xl font-black uppercase tracking-tighter italic leading-tight group-hover:text-primary transition-colors")}>
                          <T>{need.needType}</T> — <span className="text-primary italic"><T>{need.location}</T></span>
                        </h3>
                        <p className={cn(
                          "text-lg font-bold leading-relaxed max-w-3xl opacity-60",
                          theme === 'dark' ? "text-slate-200" : "text-slate-600"
                        )}>
                           <T>{need.description}</T>
                        </p>
                      </div>
                    </div>

                    {/* Secure Input Area */}
                    <div className="w-full lg:w-[420px] relative z-10">
                      {need.status === 'pending' ? (
                        <motion.button 
                          whileHover={{ scale: 1.02, backgroundColor: theme === 'dark' ? "#1e40af" : "#2563eb" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => acceptNeed(need.id, 'Aryan Command')}
                          className="w-full py-8 bg-primary text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-3xl shadow-primary/30 transition-all flex items-center justify-center gap-5 border-none"
                        >
                          <ShieldCheck className="h-6 w-6" /> <T>Accept Mission</T>
                        </motion.button>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-6 p-10 bg-slate-950 rounded-[3rem] border border-white/10 shadow-6xl relative group"
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1 opacity-50"><T>Handshake ID</T></span>
                                 <span className="text-xs font-black text-white font-mono">{need.id.slice(0, 12).toUpperCase()}</span>
                              </div>
                              <Zap className="h-6 w-6 text-primary animate-bounce shadow-glow" />
                           </div>

                           <div className={cn(
                             "flex items-center gap-5 px-8 py-6 rounded-2xl border-2 transition-all bg-slate-900 focus-within:border-primary/50",
                             "border-white/5 shadow-inner"
                           )}>
                             <Lock className="h-6 w-6 text-primary" />
                             <input 
                               type="text"
                               maxLength={4}
                               placeholder="CODE"
                               value={otpInputs[need.id] || ''}
                               onChange={(e) => handleOtpChange(need.id, e.target.value)}
                               className="bg-transparent border-none outline-none text-2xl font-black w-full text-primary placeholder:text-slate-800 tracking-[0.8em] text-center"
                             />
                           </div>
                           
                           <button 
                             onClick={() => attemptResolution(need.id)}
                             className="w-full py-7 bg-emerald-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-4 active:scale-95 border-none"
                           >
                             <CheckCircle className="h-6 w-6" /> <T>Complete Protocol</T>
                           </button>
                        </motion.div>
                      )}
                      
                      <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="h-2 w-2 bg-primary rounded-full animate-ping shadow-[0_0_10px_primary]" />
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">
                          <T>Mode</T>: <span className="text-primary italic"><T>{need.status}</T></span>
                        </p>
                      </div>
                    </div>

                    {/* Absolute Background Watermark */}
                    <Terminal className="absolute -bottom-10 -left-10 h-64 w-64 opacity-[0.02] text-white -rotate-12 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 3. SYSTEM IDLE STATE (Elite Sync) */}
            {filteredNeeds.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "py-48 rounded-[5rem] border-4 border-dashed text-center space-y-10 relative overflow-hidden",
                  theme === 'dark' ? "bg-slate-900/20 border-slate-800" : "bg-slate-50 border-slate-200"
                )}
              >
                <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto relative z-10">
                  <Activity className="h-16 w-16 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
                <div className="space-y-4 relative z-10">
                  <p className="text-4xl font-black text-slate-400 uppercase tracking-[0.8em] italic"><T>No Reports</T></p>
                  <p className="text-[12px] text-slate-500 font-bold uppercase tracking-[0.4em]">
                     <T>Synchronizing with National Satellite Grid...</T>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </LayoutGroup>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-6xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.8); }
        .shadow-5xl { box-shadow: 0 40px 80px -15px rgba(0,0,0,0.7); }
        .shadow-glow { filter: drop-shadow(0 0 10px rgba(59,130,246,0.8)); }
        input::placeholder { letter-spacing: normal !important; }
      `}} />
    </div>
  );
}