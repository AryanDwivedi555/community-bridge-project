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
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function VerificationSystem() {
  const { needs, resolveNeed, theme, acceptNeed } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});

  // --- ELITE SEARCH ALGORITHM (Preserved) ---
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
      toast.error("Handshake Failed", { 
        description: "Protocol requires a 4-digit tactical code.",
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
      "min-h-screen p-4 lg:p-10 transition-colors duration-500",
      theme === 'dark' ? "bg-slate-950" : "bg-slate-50"
    )}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 1. TACTICAL COMMAND HEADER (Polished) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-10 rounded-[3rem] shadow-2xl border backdrop-blur-xl",
            theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"
          )}
        >
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 relative">
              <Bot className="h-10 w-10 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
            </div>
            <div>
              <h2 className={cn("text-4xl font-black tracking-tighter uppercase italic leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}>
                Intelligence <span className="text-primary">Hub</span>
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2 mt-3">
                <Fingerprint className="h-3 w-3 text-primary" /> Verification Protocol v2.4
              </p>
            </div>
          </div>
          
          <div className="relative group w-full lg:w-[450px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-all" />
            <input 
              type="text" 
              placeholder="Scan sector or node description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-16 pr-8 py-6 rounded-2xl text-xs font-black outline-none w-full transition-all shadow-inner",
                theme === 'dark' 
                  ? "bg-slate-950 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-primary/20" 
                  : "bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10"
              )}
            />
          </div>
        </motion.div>

        {/* 2. MISSION LISTING GRID (Optimized) */}
        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {filteredNeeds.map((need) => (
              <motion.div
                key={need.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group p-1 rounded-[3.2rem] transition-all duration-500 hover:translate-x-2",
                  need.urgency >= 4 ? "bg-gradient-to-r from-red-500 to-transparent" : "bg-gradient-to-r from-primary to-transparent"
                )}
              >
                <div className={cn(
                  "p-8 lg:p-12 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row gap-10 justify-between items-center",
                  theme === 'dark' ? "bg-slate-900" : "bg-white"
                )}>
                  
                  {/* Tactical Content */}
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <Badge className={cn("px-5 py-1.5 font-black text-[10px] uppercase tracking-widest border-none", 
                        need.urgency >= 4 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                      )}>
                        Priority {need.urgency}
                      </Badge>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {new Date(need.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className={cn("text-2xl lg:text-3xl font-black uppercase tracking-tighter italic", theme === 'dark' ? "text-white" : "text-slate-900")}>
                        {need.needType} — <span className="text-primary">{need.location}</span>
                      </h3>
                      <p className={cn(
                        "text-sm font-bold leading-relaxed mt-4 max-w-2xl opacity-70",
                        theme === 'dark' ? "text-slate-300" : "text-slate-600"
                      )}>{need.description}</p>
                    </div>
                  </div>

                  {/* Secure Input Area */}
                  <div className="w-full lg:w-96">
                    {need.status === 'pending' ? (
                      <button 
                        onClick={() => acceptNeed(need.id, 'Aryan Command')}
                        className="w-full py-6 bg-primary text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all active:scale-95 flex items-center justify-center gap-4"
                      >
                        <ShieldCheck className="h-5 w-5" /> Accept Mission
                      </button>
                    ) : (
                      <div className="space-y-4 p-8 bg-slate-100 dark:bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-inner">
                         <div className="flex items-center justify-between mb-4">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Handshake ID: {need.id.slice(0, 8)}</p>
                           <Zap className="h-4 w-4 text-primary animate-bounce" />
                         </div>
                         <div className={cn(
                           "flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all bg-white dark:bg-slate-900",
                           theme === 'dark' ? "border-slate-800" : "border-slate-200"
                         )}>
                           <Lock className="h-5 w-5 text-primary" />
                           <input 
                             type="text"
                             maxLength={4}
                             placeholder="OTP CODE"
                             value={otpInputs[need.id] || ''}
                             onChange={(e) => handleOtpChange(need.id, e.target.value)}
                             className="bg-transparent border-none outline-none text-base font-black w-full text-primary placeholder:text-slate-500 tracking-[0.8em]"
                           />
                         </div>
                         <button 
                          onClick={() => attemptResolution(need.id)}
                          className="w-full py-6 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                          <CheckCircle className="h-5 w-5" /> Complete Protocol
                        </button>
                      </div>
                    )}
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <div className="h-1 w-1 bg-primary rounded-full animate-ping" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        Mode: <span className="text-primary italic">{need.status}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 3. SYSTEM IDLE STATE (Polished) */}
          {filteredNeeds.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "py-40 rounded-[4rem] border-4 border-dashed text-center space-y-8",
                theme === 'dark' ? "bg-slate-900/20 border-slate-800" : "bg-slate-50 border-slate-200"
              )}
            >
              <div className="h-28 w-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto relative">
                <Activity className="h-12 w-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-slate-400 uppercase tracking-[0.6em] italic">No Reports</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Synchronizing with National Satellite Grid...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}