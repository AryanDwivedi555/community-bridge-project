import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Command, X, Zap, Moon, Sun, 
  Navigation, ShieldCheck, Activity, Users, Globe, LayoutDashboard, Search, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function VoiceNavigator() {
  const navigate = useNavigate();
  const context = useApp();
  if (!context) return null;

  const { theme, toggleTheme, language } = context;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. ELITE COMMAND ENGINE (With Disable Dark Theme Protocol)
  const executeCommand = useCallback((cmd: string) => {
    const text = cmd.toLowerCase();
    setIsProcessing(true);
    
    // NAVIGATION LOGIC
    if (text.includes('dashboard') || text.includes('home')) {
      navigate('/');
      toast.success("Tactical Dashboard Live");
    } else if (text.includes('map') || text.includes('mission') || text.includes('tactical')) {
      navigate('/mission-control'); 
      toast.success("Mission Control Online");
    } else if (text.includes('intelligence') || text.includes('hub') || text.includes('chat')) {
      navigate('/chatbot');
      toast.success("Neural Link Established");
    } else if (text.includes('volunteer') || text.includes('agent')) {
      navigate('/volunteers');
      toast.success("Agent Directory Accessed");
    } else if (text.includes('report') || text.includes('analytics') || text.includes('impact')) {
      navigate('/reports');
      toast.success("Impact Reports Uplinked");
    } else if (text.includes('network') || text.includes('ngo')) {
      navigate('/ngo-network');
      toast.success("Partner Network Synced");
    } 
    
    // THEME PROTOCOLS (Enhanced with Disable Dark Mode)
    else if (text.includes('dark') || text.includes('stealth') || text.includes('night')) {
      if (theme !== 'dark') toggleTheme();
      toast("Stealth Mode Engaged", { icon: <Moon className="h-4 w-4" /> });
    }
    else if (text.includes('light') || text.includes('day') || text.includes('bright') || text.includes('disable dark')) {
      if (theme === 'dark') toggleTheme();
      toast("High-Vis Mode Engaged", { icon: <Sun className="h-4 w-4 text-orange-500" /> });
    }
    
    setTimeout(() => {
        setIsListening(false);
        setIsProcessing(false);
    }, 1000);
  }, [navigate, theme, toggleTheme]);

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return toast.error("Hardware Protocol Failure");

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = true; 
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('INITIALIZING LINK...');
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      if (event.results[0].isFinal) executeCommand(result);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => { if (!isProcessing) setIsListening(false); };
    recognition.start();
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <div className="fixed bottom-8 left-8 z-[2000]">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={startListening}
            className={cn(
              "h-20 w-20 rounded-[2.2rem] shadow-2xl border-4 transition-all duration-700 relative overflow-hidden",
              theme === 'dark' ? "border-white/10 shadow-blue-900/20" : "border-slate-200 shadow-blue-500/30",
              isListening ? "bg-red-600 border-red-400" : "bg-blue-600 hover:bg-blue-500"
            )}
          >
            {isListening ? <RadioWave /> : <Command className="h-8 w-8 text-white" />}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" 
            />
          </Button>
        </motion.div>
      </div>

      {/* TOP DETECTION TAB */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 30, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[2002] pointer-events-none"
          >
            <div className={cn(
                "px-8 py-4 rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl flex items-center gap-6",
                theme === 'dark' ? "bg-slate-900/90 border-white/10" : "bg-white/90 border-slate-200"
            )}>
                <div className="flex gap-2 items-center">
                    <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
                    <div className="h-3 w-3 rounded-full bg-red-600 animate-ping" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Audio Spectrum Detected</span>
                    <span className="text-sm font-bold italic text-blue-600 truncate max-w-[300px]">
                        "{transcript}"
                    </span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN HUD OVERLAY */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2001] flex items-center justify-center bg-slate-950/95 backdrop-blur-[100px]"
          >
            <motion.div
              initial={{ scale: 0.7, y: 60, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.7, y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "max-w-5xl w-full p-16 rounded-[5rem] border shadow-2xl text-center relative overflow-hidden",
                theme === 'dark' ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-100"
              )}
            >
              {/* 32-BAR SPECTRUM VISUALIZER */}
              <div className="flex items-end justify-center gap-1.5 h-40 mb-16 px-4">
                {[...Array(32)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                        height: isProcessing ? 15 : [15, Math.random() * 100 + 20, 15], 
                        opacity: isProcessing ? 0.1 : [0.4, 1, 0.4] 
                    }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.02 }}
                    className="flex-1 bg-gradient-to-t from-blue-700 via-blue-500 to-blue-300 rounded-full"
                  />
                ))}
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex items-center justify-center gap-3 text-blue-500">
                  <ShieldCheck className="h-6 w-6" />
                  <p className="text-[12px] font-black uppercase tracking-[1em] ml-2">Neural Link Active</p>
                </div>
                <motion.h3 
                  key={transcript}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("text-6xl font-black italic tracking-tighter uppercase leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}
                >
                  {transcript || "Speak..."}
                </motion.h3>
              </div>

              {/* TACTICAL HINTS GRID (Expanded to include Disable Dark Theme) */}
              <div className="grid grid-cols-4 gap-4 pt-4">
                {[
                  { label: 'Dashboard', icon: <LayoutDashboard /> },
                  { label: 'Tactical Map', icon: <Navigation /> },
                  { label: 'Intelligence Hub', icon: <Search /> },
                  { label: 'Volunteer Hub', icon: <Users /> },
                  { label: 'NGO Network', icon: <Globe /> },
                  { label: 'Impact Reports', icon: <Zap /> },
                  { label: 'Dark Mode', icon: <Moon /> },
                  { label: 'Light Mode', icon: <Sun /> }
                ].map((hint, idx) => (
                  <motion.div 
                    key={hint.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (idx * 0.04) }}
                    className="group p-5 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex flex-col items-center gap-3 transition-all hover:bg-blue-500/10 hover:scale-105"
                  >
                    <div className="text-blue-500 opacity-30 group-hover:opacity-100 transition-opacity">
                        {hint.icon}
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400">"{hint.label}"</p>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={() => setIsListening(false)}
                variant="ghost" 
                className="mt-14 rounded-full h-14 w-14 text-slate-500 hover:text-red-500 hover:bg-red-500/10"
              >
                <X className="h-8 w-8" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RadioWave() {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={{ height: [4, 24, 4] }}
          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
          className="w-1 bg-white rounded-full shadow-[0_0_10px_white]"
        />
      ))}
    </div>
  );
}