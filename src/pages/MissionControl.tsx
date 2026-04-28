import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import FieldMap from '@/components/FieldMap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, ShieldCheck, Activity, Settings,
  Target, Zap, AlertCircle, Navigation, Maximize, Minimize,
  Layers, Signal, Scan, LocateFixed, Radar, Cpu, Globe, Crosshair, MapPin, Loader2
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { calculatePreciseDistance } from '@/lib/geospatial';
import { getTacticalPhrase } from '@/lib/voiceDictionary';
import { Button } from '@/components/ui/button';
import { T } from '@/components/T'; 

export default function MissionControl() {
  const context = useApp();
  if (!context) return null;

  const { language, theme, needs, volunteers = [], voiceAgent, updateVoiceConfig } = context;
  
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const notifiedPairs = useRef<Set<string>>(new Set());

  // --- 1. FULLSCREEN PROTOCOL (Zero Feature Loss) ---
  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await mapSectionRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Uplink Error", err);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // --- 2. PROXIMITY TELEMETRY ENGINE (Hardened Logic) ---
  useEffect(() => {
    if (!volunteers || !needs) return;
    volunteers.forEach(v => {
      needs.forEach(n => {
        const result = calculatePreciseDistance({ lat: v.lat, lng: v.lng }, { lat: n.lat, lng: n.lng });
        const pairId = `${v.id}-${n.id}`;
        if (result.kilometers < 1.5 && !notifiedPairs.current.has(pairId)) {
          notifiedPairs.current.add(pairId);
          const newIntercept = {
            id: pairId, agent: v.name, location: n.location, distance: result.formatted,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            urgency: n.urgency
          };
          setIntercepts(prev => [newIntercept, ...prev].slice(0, 10));
          if (voiceAgent.enabled) {
            const speech = new SpeechSynthesisUtterance(getTacticalPhrase('proximity_alert', language as any));
            speech.lang = language === 'hi' ? 'hi-IN' : 'en-US';
            window.speechSynthesis.speak(speech);
          }
        }
      });
    });
  }, [volunteers, needs, language, voiceAgent.enabled]);

  // --- ANIMATION VARIANTS ---
  const sidebarVariants = {
    hidden: { x: 50, opacity: 0, filter: "blur(10px)" },
    visible: { 
      x: 0, opacity: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15, staggerChildren: 0.1 } 
    }
  };

  const interceptItemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col h-[calc(100vh-120px)] gap-6 overflow-hidden p-4 transition-all duration-1000 relative",
        theme === 'dark' ? "bg-[#020617]" : "bg-slate-50"
      )}
    >
      {/* 1. DYNAMIC COMMAND HEADER (Contrast & Theme Logic Fixed) */}
      <AnimatePresence>
        {!isFullScreen && (
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={cn(
              "flex items-center justify-between px-10 py-5 rounded-[2.5rem] shadow-5xl border backdrop-blur-3xl z-50 transition-all duration-500",
              theme === 'dark' 
                ? "bg-slate-950/40 border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.1)]" 
                : "bg-white/60 border-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.05)]"
            )}
          >
            <div className="flex items-center gap-6">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="h-14 w-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center shadow-3xl shadow-primary/30"
              >
                <ShieldCheck className="text-white h-7 w-7" />
              </motion.div>
              <div className="space-y-1">
                {/* 🛡️ RECOVERY: Forced Visibility for Header Title */}
                <h1 className={cn(
                  "text-4xl font-black tracking-tighter uppercase italic leading-none transition-colors",
                  theme === 'dark' ? "text-white !opacity-100" : "text-slate-900"
                )}>
                  <T>Tactical Map</T>
                </h1>
                <div className="flex items-center gap-3 px-1">
                  <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                  {/* 🛡️ RECOVERY: Forced Visibility for Operational Label */}
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-[0.4em]",
                    theme === 'dark' ? "text-slate-200" : "text-slate-600"
                  )}>
                    <T>Grid Operational</T>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              {/* 🛡️ RECOVERY: Sector Scanning Label Visibility Fixed */}
              <div className={cn(
                "hidden md:flex items-center gap-3 px-6 py-2 rounded-full border transition-all",
                theme === 'dark' ? "bg-slate-900/50 border-white/10" : "bg-slate-100/50 border-slate-200"
              )}>
                <Radar className="h-4 w-4 text-primary animate-spin-slow" />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  theme === 'dark' ? "text-white !opacity-100" : "text-slate-800"
                )}>
                  <T>Sector Scanning</T>
                </span>
              </div>
              <Badge className="bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-full text-[10px] gap-3 shadow-3xl animate-in fade-in zoom-in duration-500">
                <div className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
                <T>{volunteers.length}</T> <T>ACTIVE AGENTS</T>
              </Badge>
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => updateVoiceConfig({ enabled: !voiceAgent.enabled })}
                className={cn(
                  "p-4 rounded-xl transition-all border-2",
                  voiceAgent.enabled ? "bg-primary text-white border-primary shadow-glow" : "bg-slate-500/5 border-white/5 text-slate-500"
                )}
              >
                <Settings className={cn("h-6 w-6", voiceAgent.enabled && "animate-spin-slow")} />
              </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <LayoutGroup>
        <div className="flex flex-1 gap-6 min-h-0 relative">
          
          {/* 2. SPATIAL MATRIX SECTION */}
          <motion.section 
            ref={mapSectionRef}
            layout
            className={cn(
              "flex-1 overflow-hidden shadow-7xl relative z-10 group transition-all duration-1000",
              isFullScreen 
                ? "rounded-0 border-0 fixed inset-0 h-screen w-screen z-[999] bg-slate-950" 
                : "rounded-[3.5rem] border-[8px] border-white dark:border-slate-900 shadow-black/50"
            )}
          >
            {/* MAP HUD OVERLAY - Fullscreen Toggle Only */}
            <div className="absolute top-0 right-0 p-6 z-[1000] pointer-events-none">
              <motion.button 
                layout
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullScreen}
                className="p-4 rounded-xl bg-slate-950/90 text-white border border-white/10 shadow-5xl pointer-events-auto transition-colors hover:bg-primary"
              >
                {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
              </motion.button>
            </div>

            <FieldMap />

            {/* RADAR SWEEP EFFECT */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(var(--primary),0.3)_360deg)]"
               />
            </div>
          </motion.section>

          {/* 3. TACTICAL SIDEBAR */}
          <AnimatePresence>
            {!isFullScreen && (
              <motion.aside 
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-[380px] hidden xl:flex flex-col gap-6"
              >
                <Card className={cn(
                  "flex-1 flex flex-col border-none shadow-6xl rounded-[3.5rem] overflow-hidden",
                  theme === 'dark' ? "bg-slate-900/40 backdrop-blur-3xl" : "bg-white"
                )}>
                  {/* SIDEBAR HEADER */}
                  <div className="p-8 bg-[#020617] text-white flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-primary/20 rounded-xl border border-primary/30">
                        <LocateFixed className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[13px] font-black uppercase tracking-[0.3em] block leading-none"><T>Intercept Feed</T></span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2 block italic">Live Neural Trace</span>
                      </div>
                    </div>
                    <Zap className="h-5 w-5 animate-bounce text-amber-400 relative z-10" />
                    
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
                  </div>
                  
                  <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/5">
                    <AnimatePresence mode="popLayout">
                      {intercepts.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center py-40 gap-6 opacity-20"
                        >
                          <Loader2 className="h-12 w-12 animate-spin text-primary" />
                          <p className="text-[10px] font-black uppercase tracking-[0.8em]"><T>Scanning Grid</T></p>
                        </motion.div>
                      ) : (
                        intercepts.map((n_intercept) => (
                          <motion.div 
                            key={n_intercept.id} 
                            variants={interceptItemVariants}
                            layout
                            whileHover={{ scale: 1.02, x: 5 }}
                            className={cn(
                              "p-6 rounded-[2rem] border-l-[10px] shadow-xl transition-all cursor-pointer group relative overflow-hidden",
                              theme === 'dark' ? "bg-slate-800/40 border-white/5 hover:bg-slate-800" : "bg-slate-50 hover:bg-white",
                              n_intercept.urgency >= 4 ? "border-l-red-500" : "border-l-primary"
                            )}
                          >
                            <div className="flex justify-between items-start relative z-10">
                               <div className="space-y-1">
                                 <p className="text-[14px] font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                                   <T>{n_intercept.agent}</T>
                                 </p>
                                 <div className="flex items-center gap-2">
                                   <MapPin className="h-3 w-3 text-slate-500" />
                                   <span className="text-[9px] font-bold text-slate-500 uppercase"><T>{n_intercept.location}</T></span>
                                 </div>
                               </div>
                               <Badge variant="outline" className="text-[8px] font-mono border-white/10 text-slate-500">
                                  {n_intercept.timestamp}
                               </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 relative z-10">
                               <div className="flex items-center gap-3 text-primary">
                                 <Navigation className="h-3.5 w-3.5 animate-pulse" />
                                 <p className="text-[10px] font-black tracking-[0.2em]"><T>{n_intercept.distance}</T></p>
                               </div>
                               <Crosshair className="h-4 w-4 text-white/5 group-hover:text-primary group-hover:scale-125 transition-all" />
                            </div>
                            <Cpu className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] group-hover:opacity-10 rotate-12 transition-opacity" />
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .shadow-glow { box-shadow: 0 0 20px rgba(var(--primary), 0.5); }
        .shadow-7xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--primary), 0.3); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </motion.div>
  );
}