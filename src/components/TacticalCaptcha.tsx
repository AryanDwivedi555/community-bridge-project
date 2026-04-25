import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, Lock, Unlock, Hash, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TacticalCaptchaProps {
  onVerify: (isValid: boolean) => void;
  theme?: 'light' | 'dark';
}

/**
 * ELITE HUMAN VERIFICATION PROTOCOL
 * Generates dynamic math challenges to verify human operation 
 * within the National Grid.
 */
export default function TacticalCaptcha({ onVerify, theme = 'light' }: TacticalCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shake, setShake] = useState(false);

  // 1. DYNAMIC PROTOCOL GENERATION
  const generateChallenge = useCallback(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserInput('');
    setStatus('idle');
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  // 2. VERIFICATION LOGIC
  const checkVerification = () => {
    const result = parseInt(userInput);
    if (result === num1 + num2) {
      setStatus('success');
      onVerify(true);
    } else {
      setStatus('error');
      setShake(true);
      onVerify(false);
      setTimeout(() => setShake(false), 500);
      // Optional: Auto-reset on fail for security
      setTimeout(generateChallenge, 1500);
    }
  };

  return (
    <div className={cn(
      "w-full p-6 rounded-[2rem] border transition-all duration-500 shadow-xl overflow-hidden relative",
      status === 'success' ? "border-emerald-500/50 bg-emerald-500/5" : 
      status === 'error' ? "border-red-500/50 bg-red-500/5" :
      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
    )}>
      
      {/* Background Icon Watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
        <ShieldCheck size={120} />
      </div>

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
              status === 'success' ? "bg-emerald-500" : "bg-primary"
            )}>
              {status === 'success' ? <Unlock size={16} className="text-white" /> : <Lock size={16} className="text-white" />}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 leading-none mb-1">Human Auth</p>
              <p className={cn("text-[11px] font-bold uppercase italic", theme === 'dark' ? "text-white" : "text-slate-900")}>
                {status === 'success' ? 'Protocol Passed' : 'Verification Required'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={generateChallenge}
            disabled={status === 'success'}
            className="text-slate-400 hover:text-primary transition-colors disabled:opacity-0"
          >
            <RefreshCw size={14} className={cn(status === 'idle' && "hover:rotate-180 transition-transform duration-500")} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            <motion.div 
              key="challenge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, x: shake ? [-5, 5, -5, 5, 0] : 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className={cn(
                "flex items-center justify-center gap-6 py-4 rounded-2xl border-2 border-dashed transition-colors",
                theme === 'dark' ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
              )}>
                <div className="flex items-center gap-4 text-2xl font-black italic tracking-tighter opacity-80">
                  <span className="text-primary">{num1}</span>
                  <span className="text-slate-400 text-sm font-normal">+</span>
                  <span className="text-primary">{num2}</span>
                  <span className="text-slate-400 text-sm font-normal">=</span>
                </div>
                <input 
                  type="number"
                  placeholder="?"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkVerification()}
                  className={cn(
                    "w-20 h-14 rounded-xl text-center text-xl font-black outline-none transition-all shadow-inner",
                    theme === 'dark' 
                      ? "bg-slate-800 text-white focus:ring-4 focus:ring-primary/20" 
                      : "bg-white text-slate-900 border border-slate-100 focus:ring-4 focus:ring-primary/10"
                  )}
                />
              </div>

              <Button 
                onClick={checkVerification}
                disabled={!userInput}
                className="w-full h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Validate Identity
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center justify-center space-y-3"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Security Clearance Active</p>
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'error' && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center"
          >
            <AlertCircle size={10} className="inline mr-1 mb-0.5" /> Identity Mismatch. Retry.
          </motion.p>
        )}
      </div>
    </div>
  );
}