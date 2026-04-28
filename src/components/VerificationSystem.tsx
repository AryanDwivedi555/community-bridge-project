import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Loader2, 
  ChevronLeft, 
  Fingerprint, 
  Cpu, 
  ShieldAlert 
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { T } from "@/components/T"; // --- NEURAL BRIDGE IMPORT ---

/**
 * NATIONAL GRID: SECURITY VERIFICATION SYSTEM (ZENITH V4.0)
 * Handles multi-factor authentication with Neural Localization.
 */
export default function VerificationSystem() {
  const context = useApp();
  if (!context) return null;

  const { theme } = context;
  
  const [step, setStep] = useState<"idle" | "otp" | "loading" | "success">("idle");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // AUTO-FOCUS ON STEP TRANSITION
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length < 4) {
      toast.error(<T>Protocol Error</T>, { 
        description: <T>Please enter the full 4-digit security code.</T> 
      });
      return;
    }

    setStep("loading");
    
    setTimeout(() => {
      toast.success(<T>Identity Authenticated</T>, {
        description: <T>Uplink secured. Accessing National Grid telemetry...</T>,
        icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
      });
      setStep("success");
    }, 2200);
  };

  return (
    <LayoutGroup>
      <motion.div layout>
        <Card className={cn(
          "border-l-4 overflow-hidden relative shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 rounded-[3rem]",
          theme === 'dark' 
            ? "bg-slate-900/80 border-l-primary border-white/5 backdrop-blur-2xl" 
            : "bg-white border-l-primary border-slate-100 shadow-slate-200"
        )}>
          {/* EXPERT DECORATIVE LAYER */}
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
            <Cpu size={250} />
          </div>
          <div className="absolute bottom-4 left-4 opacity-[0.05] pointer-events-none">
            <ShieldAlert size={80} />
          </div>

          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                  <Lock className="h-4 w-4 text-primary animate-pulse" /> <T>Security Protocol</T>
                </CardTitle>
                <AnimatePresence>
                  {step === "otp" && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setStep("idle")} 
                      className="h-8 w-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-left relative z-10">
            <AnimatePresence mode="wait">
              {step === "idle" && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="space-y-6"
                >
                  <p className={cn(
                    "text-sm font-bold leading-relaxed",
                    theme === 'dark' ? "text-slate-400" : "text-slate-600"
                  )}>
                    <T>Verification required to unlock</T> <span className="text-primary font-black uppercase italic tracking-tighter"><T>Priority Mission Parameters</T></span>.
                  </p>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => setStep("otp")} 
                      className={cn(
                        "w-full justify-between h-16 border-none transition-all group rounded-2xl shadow-2xl",
                        theme === 'dark' ? "bg-slate-800 hover:bg-primary text-white" : "bg-slate-50 hover:bg-white text-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-white/20 transition-colors">
                          <Fingerprint className="h-6 w-6 text-primary group-hover:text-white" />
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-[0.2em]"><T>Biometric Link</T></span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]"><T>Enter Access Code</T></p>
                    <Badge className="bg-amber-500/10 text-amber-500 border-none animate-pulse text-[10px] font-black px-4 py-1 rounded-full">
                      <T>WAITING</T>
                    </Badge>
                  </div>
                  
                  <div className="flex gap-4 justify-between">
                    {otp.map((digit, i) => (
                      <motion.input 
                        key={i}
                        whileFocus={{ scale: 1.05, y: -5 }}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onChange={(e) => handleChange(i, e.target.value)}
                        className={cn(
                          "w-16 h-20 border-2 rounded-2xl text-center font-black text-3xl focus:ring-8 focus:ring-primary/10 outline-none transition-all shadow-inner",
                          theme === 'dark' 
                            ? "bg-slate-950 border-white/5 text-white focus:border-primary" 
                            : "bg-slate-50 border-slate-100 text-slate-900 focus:border-primary"
                        )} 
                      />
                    ))}
                  </div>

                  <Button 
                    onClick={handleVerify} 
                    className="w-full bg-primary hover:bg-slate-950 text-white font-black text-[12px] uppercase tracking-[0.4em] h-16 shadow-3xl shadow-primary/30 rounded-2xl active:scale-95 transition-all border-none"
                  >
                    <T>Authenticate Node</T>
                  </Button>
                </motion.div>
              )}

              {step === "loading" && (
                <motion.div 
                  key="loading"
                  className="py-16 text-center space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="relative inline-block">
                    <Loader2 className="h-14 w-14 text-primary animate-spin" />
                    <div className="absolute inset-0 h-14 w-14 border-4 border-primary/10 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[13px] font-black text-primary uppercase tracking-[0.4em]"><T>Validating Payload</T></p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><T>Securing Encryption</T></p>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className={cn(
                    "text-center py-12 rounded-[2.5rem] border-2 transition-all relative overflow-hidden",
                    theme === 'dark' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"
                  )}
                >
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.2, type: "spring" }}
                    className="h-20 w-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-3xl shadow-emerald-500/40"
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>
                  <p className="text-[13px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3"><T>Access Granted</T></p>
                  <p className={cn(
                    "text-sm font-bold px-10 leading-relaxed opacity-80",
                    theme === 'dark' ? "text-emerald-400" : "text-emerald-700"
                  )}>
                    <T>National Node-01 Tactical Parameters Successfully Unlocked.</T>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </LayoutGroup>
  );
}