import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { dictionary } from "@/lib/i18n";
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, Loader2, ChevronLeft, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * NATIONAL GRID: SECURITY VERIFICATION SYSTEM
 * Handles multi-factor authentication for sensitive mission telemetry.
 * Hardened against context failures with 100% feature preservation.
 */
export default function VerificationSystem() {
  // --- SECURE UPLINK HANDSHAKE ---
  const context = useApp();
  
  // Defensive guard to neutralize 'render2' failures during mount
  if (!context) return null;

  const { language, theme } = context;
  const t = (key: string) => dictionary[language]?.[key] || key;
  
  const [step, setStep] = useState<"idle" | "otp" | "loading" | "success">("idle");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // TACTICAL OTP LOGIC: Auto-focus jump & Backspace telemetry
  const handleChange = (index: number, value: string) => {
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
      toast.error("Protocol Error", { description: "Please enter the full 4-digit security code." });
      return;
    }

    setStep("loading");
    
    // Simulate High-Side National Grid Authentication
    setTimeout(() => {
      toast.success("Identity Authenticated", {
        description: "Uplink secured. Accessing National Grid telemetry...",
        icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
      });
      setStep("success");
    }, 1800);
  };

  return (
    <Card className={cn(
      "border-l-4 overflow-hidden relative shadow-2xl transition-all duration-500 rounded-[2.5rem]",
      theme === 'dark' ? "bg-slate-900 border-l-primary border-slate-800" : "bg-white/90 border-l-primary border-slate-100 backdrop-blur-md"
    )}>
      {/* Decorative Branding Background */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
        <ShieldCheck className={cn("h-24 w-24", theme === 'dark' ? "text-white" : "text-primary")} />
      </div>

      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
            <Lock className="h-3 w-3 text-primary" /> Security Protocol
            </CardTitle>
            {step === "otp" && (
                <button onClick={() => setStep("idle")} className="text-slate-400 hover:text-primary transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                </button>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 text-left relative z-10">
        <AnimatePresence mode="wait">
          {step === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              <p className={cn(
                "text-xs font-bold leading-relaxed",
                theme === 'dark' ? "text-slate-400" : "text-slate-600"
              )}>
                Verification required to unlock <span className="text-primary font-black uppercase italic tracking-tighter">Priority Mission Parameters</span>.
              </p>
              
              <Button 
                onClick={() => setStep("otp")} 
                className={cn(
                  "w-full justify-between h-14 border-none transition-all group rounded-2xl shadow-lg",
                  theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-50 hover:bg-white text-slate-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Fingerprint className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Biometric Link</span>
                </div>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enter Access Code</p>
                <Badge className="bg-amber-500/10 text-amber-500 border-none animate-pulse text-[9px] font-black">WAITING</Badge>
              </div>
              
              <div className="flex gap-3">
                {otp.map((digit, i) => (
                  <input 
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className={cn(
                      "w-full h-14 border-2 rounded-2xl text-center font-black text-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner",
                      theme === 'dark' 
                        ? "bg-slate-800 border-slate-700 text-white focus:border-primary" 
                        : "bg-slate-50 border-slate-100 text-slate-900 focus:border-primary"
                    )} 
                  />
                ))}
              </div>

              <Button 
                onClick={handleVerify} 
                className="w-full bg-primary hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] h-14 shadow-xl shadow-primary/20 rounded-2xl active:scale-95 transition-all"
              >
                Authenticate Node
              </Button>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div 
              key="loading"
              className="py-10 text-center space-y-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Validating Payload</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Securing Encryption</p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "text-center py-8 rounded-[2rem] border transition-colors",
                theme === 'dark' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"
              )}
            >
              <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Access Granted</p>
              <p className={cn(
                "text-xs font-bold px-8 leading-relaxed",
                theme === 'dark' ? "text-emerald-400" : "text-emerald-700"
              )}>
                National Node-01 Tactical Parameters Successfully Unlocked.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}