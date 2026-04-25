import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import FieldMap from '@/components/FieldMap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, ShieldCheck, Activity, Settings,
  Target, Zap, AlertCircle, Navigation, Maximize, Minimize,
  Layers, Signal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { calculatePreciseDistance } from '@/lib/geospatial';
import { getTacticalPhrase } from '@/lib/voiceDictionary';
import { Button } from '@/components/ui/button';

export default function MissionControl() {
  const context = useApp();
  if (!context) return null;

  const { language, theme, needs, volunteers = [], voiceAgent, updateVoiceConfig } = context;
  
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const notifiedPairs = useRef<Set<string>>(new Set());

  // --- 1. ELITE FULLSCREEN PROTOCOL ---
  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await mapSectionRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Uplink Error: Fullscreen Protocol Interrupted", err);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // --- 2. PROXIMITY TELEMETRY ENGINE (Zero-Trimmed) ---
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

  return (
    <div className={cn(
      "flex flex-col h-[calc(100vh-120px)] gap-4 overflow-hidden p-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      
      {/* 1. DYNAMIC COMMAND HEADER */}
      <AnimatePresence>
        {!isFullScreen && (
          <motion.header 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex items-center justify-between px-8 py-4 rounded-[2rem] shadow-2xl border backdrop-blur-xl z-50",
              theme === 'dark' ? "bg-slate-900/80 border-slate-800" : "bg-white/90 border-slate-100"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Tactical Map</h1>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2 mt-1">
                  <Activity className="h-3 w-3 animate-pulse" /> Grid Operational
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black px-4 py-2 rounded-full text-[9px] gap-2">
                <Radio className="h-3 w-3 animate-pulse" /> {volunteers.length} ACTIVE AGENTS
              </Badge>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors" onClick={() => updateVoiceConfig({ enabled: !voiceAgent.enabled })}>
                <Settings className={cn("h-5 w-5", voiceAgent.enabled ? "text-primary rotate-90" : "text-slate-400")} />
              </Button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="flex flex-1 gap-4 min-h-0 relative">
        
        {/* 2. SPATIAL MATRIX SECTION (Morphing Logic) */}
        <motion.section 
          ref={mapSectionRef}
          layout
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex-1 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10 transition-all duration-700",
            isFullScreen 
              ? "rounded-0 border-0 fixed inset-0 h-screen w-screen z-[999]" 
              : "rounded-[3rem] border-[6px] border-white dark:border-slate-900"
          )}
        >
          <FieldMap />
          
          {/* FLOATING HUD CONTROLS */}
          <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-4 items-end pointer-events-none">
            {/* Morphing Toggle Button */}
            <motion.button 
              layout
              onClick={toggleFullScreen}
              className="pointer-events-auto bg-slate-950/80 hover:bg-primary text-white p-4 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-2xl transition-all active:scale-90 group"
            >
              {isFullScreen ? (
                <Minimize className="h-5 w-5 group-hover:scale-110 transition-transform" />
              ) : (
                <Maximize className="h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
            </motion.button>

            {/* Telemetry HUD */}
            <motion.div 
              layout
              className="bg-slate-950/80 text-white px-6 py-5 rounded-[2rem] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-8">
                <div className="flex flex-col"><span className="text-xs font-black text-primary uppercase tracking-widest mb-1">Status</span><span className="text-sm font-black italic">ENCRYPTED</span></div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col"><span className="text-xs font-black text-primary uppercase tracking-widest mb-1">Latency</span><span className="text-sm font-black italic">14MS</span></div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col items-center"><Layers className="h-4 w-4 text-primary mb-1" /><span className="text-[8px] font-black uppercase">Grid v2</span></div>
              </div>
            </motion.div>
          </div>

          {/* Top Left Status (Only in Fullscreen) */}
          <AnimatePresence>
            {isFullScreen && (
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="absolute top-8 left-8 z-[1000] bg-primary/20 backdrop-blur-xl border border-primary/30 px-6 py-3 rounded-full flex items-center gap-3"
              >
                <Signal className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Live Satellite Link Active</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 3. TACTICAL SIDEBAR */}
        <AnimatePresence>
          {!isFullScreen && (
            <motion.aside 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-80 hidden xl:flex flex-col gap-4"
            >
              <Card className={cn(
                "flex-1 flex flex-col border-none shadow-2xl rounded-[2.5rem] overflow-hidden",
                theme === 'dark' ? "bg-slate-900" : "bg-white"
              )}>
                <div className="p-5 bg-primary text-white flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Intercept Feed</span>
                  <Zap className="h-3 w-3 animate-pulse" />
                </div>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                  {intercepts.map(n => (
                    <motion.div key={n.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={cn("p-4 rounded-2xl border-l-4", theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100", n.urgency >= 4 ? "border-l-red-500" : "border-l-emerald-500")}>
                      <p className="text-[10px] font-black uppercase leading-tight">{n.agent} near {n.location}</p>
                      <p className="text-[8px] font-bold text-primary mt-1">{n.distance}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}