import { useState, useMemo, useEffect } from 'react'; 
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WARDS, NEED_TYPES, NGO_LANGS, liveEmergencies } from '@/lib/mockData';
import { 
  AlertTriangle, MapPin, TrendingUp, CheckCircle, 
  Globe, AlertCircle, Zap, ArrowRight, Activity, Shield, Radar, MessageSquare, X, Cpu, Layers, Palette, Check
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'; 
import { VolunteerMatchDialog } from '@/components/VolunteerMatchDialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import VerificationSystem from '@/components/VerificationSystem';
import ManualAI from '@/components/ManualAI';
import { cn } from '@/lib/utils';

// --- PEAK TACTICAL PROFILES ---
const TACTICAL_PROFILES = [
  { id: 'matrix', color: '#10b981', label: 'Matrix' },
  { id: 'crimson', color: '#ef4444', label: 'Crimson' },
  { id: 'cobalt', color: '#0ea5e9', label: 'Cobalt' },
  { id: 'amber', color: '#f59e0b', label: 'Amber' },
  { id: 'violet', color: '#8b5cf6', label: 'Violet' },
];

const translationCache: Record<string, string> = {};

const translateNeuralStream = async (text: string, targetLang: string) => {
  if (!text || targetLang === 'en' || /^[0-9\W]+$/.test(text)) return text;
  const cacheKey = `${text}-${targetLang}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];
  try {
    const res = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
    const data = await res.json();
    const result = data.translation || text;
    translationCache[cacheKey] = result;
    return result;
  } catch { return text; }
};

const localizeTelemetry = (val: number | string, lang: string) => {
  const f = new Intl.NumberFormat(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : 'en-US');
  if (typeof val === 'number') return f.format(val);
  return val.toString().replace(/\d/g, (d) => f.format(parseInt(d)));
};

const NeuralText = ({ text }: { text: string }) => {
  const { language } = useApp() || { language: 'en' };
  const [out, setOut] = useState(text);
  useEffect(() => {
    let active = true;
    const process = async () => {
      const translated = await translateNeuralStream(text, language);
      if (active) setOut(translated);
    };
    process();
    return () => { active = false; };
  }, [text, language]);
  return <>{out}</>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.98, filter: "blur(8px)" },
  visible: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: 'spring', stiffness: 100, damping: 20, mass: 1 } }
};

const cardHover = { scale: 1.02, y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } };

export default function Dashboard() {
  const context = useApp();
  if (!context) return null;

  const { needs, language, changeLanguage, theme, changeTheme } = context;
  const [filterWard, setFilterWard] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [matchNeedId, setMatchNeedId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [translated, setTranslated] = useState<Record<string, string>>({});

  // 🛡️ INDEPENDENT THEME LOGIC: Detects Dark/Light independent of Skin
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const process = async () => {
      if (language === 'en') { setTranslated({}); return; }
      const keys = ["Strategic Operations", "National Grid Node-01 Tactical Feed", "Network Points", "Avg Urgency", "Resolved Missions", "Sector Coverage", "High-Priority Global Back backlog", "Critical Hotspot", "System Recommendation", "Grid Stability", "Mission Grid Nodes", "Initialize Match", "Filter sectoral reports", "Tactical Alert", "Chat Intelligence", "resolved", "pending", "Tactical Skin"];
      const results = await Promise.all(keys.map(k => translateNeuralStream(k, language)));
      const map: Record<string, string> = {};
      keys.forEach((k, i) => map[k] = results[i]);
      setTranslated(map);
    };
    process();
  }, [language]);

  const t = (key: string) => translated[key] || key;
  const n = (val: number | string) => localizeTelemetry(val, language);

  const filtered = useMemo(() => {
    return needs.filter(n => {
      if (filterWard !== 'all' && n.location !== filterWard) return false;
      if (filterType !== 'all' && n.needType !== filterType) return false;
      return true;
    });
  }, [needs, filterWard, filterType]);

  const topUrgent = useMemo(() => [...needs].sort((a, b) => b.urgency - a.urgency).slice(0, 5), [needs]);
  const totalNeeds = needs.length;
  const avgUrgency = (needs.reduce((s, n) => s + n.urgency, 0) / (needs.length || 1)).toFixed(1);
  const resolved = needs.filter(n => n.status === 'resolved').length;
  const coverageCount = new Set(needs.map(n => n.location)).size;
  const mostAffected = Object.entries(needs.reduce((acc, n) => { acc[n.location] = (acc[n.location] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "space-y-12 pb-24 transition-all duration-1000 ease-in-out px-4 lg:px-0",
        isDarkMode ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-slate-900"
      )}
    >
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
        <motion.div variants={itemVariants} className="relative group">
          <div className="flex items-center gap-6">
             <motion.div whileHover={{ rotate: 180, scale: 1.1 }} className="h-16 w-16 bg-gradient-to-tr from-primary via-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                <Shield className="h-9 w-9 text-white" />
             </motion.div>
             <div>
               <h1 className={cn(
                 "text-5xl font-black tracking-tighter uppercase italic leading-none bg-gradient-to-r from-primary to-blue-400 bg-clip-text",
                 isDarkMode ? "text-white" : "text-transparent"
               )}>
                 {t("Strategic Operations")}
               </h1>
               <p className={cn(
                 "text-[12px] flex items-center gap-3 font-black uppercase tracking-[0.4em] mt-3 opacity-80",
                 isDarkMode ? "text-slate-400" : "text-slate-500"
               )}>
                 <Activity className="h-4 w-4 text-primary animate-pulse" /> {t("National Grid Node-01 Tactical Feed")}
               </p>
             </div>
          </div>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-4">
          <motion.div variants={itemVariants} className={cn(
            "flex items-center gap-4 px-6 py-3 border rounded-[2.5rem] shadow-xl backdrop-blur-xl transition-all",
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-200 pr-4">{t("Tactical Skin")}</span>
            <div className="flex items-center gap-2">
              {TACTICAL_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => changeTheme(p.id)}
                  className={cn(
                    "h-6 w-6 rounded-full transition-all border flex items-center justify-center relative",
                    theme === p.id ? "border-primary scale-125 z-10 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                  )}
                  style={{ backgroundColor: p.color }}
                >
                  {theme === p.id && <Check className={cn("h-3 w-3", p.id === 'onyx' ? "text-black" : "text-white")} />}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={cn(
            "flex items-center gap-4 px-8 py-4 border rounded-[2.5rem] shadow-xl backdrop-blur-xl transition-all",
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <Globe className="h-5 w-5 text-primary animate-spin-slow" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-200 pr-6">Grid Access</span>
            <select 
              value={language} 
              onChange={(e) => changeLanguage(e.target.value as any)} 
              className={cn("text-xs font-black bg-transparent border-none outline-none cursor-pointer text-primary appearance-none", isDarkMode && "text-white")}
            >
              {NGO_LANGS.map(lang => ( <option key={lang.code} value={lang.code} className="text-black">{lang.name}</option> ))}
            </select>
          </motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {liveEmergencies.map((e) => (
          <motion.div key={e.id} whileHover={{ y: -5, scale: 1.01 }}>
            <Alert className={cn(
              "border-none shadow-2xl ring-1 rounded-[2.5rem] p-7 group cursor-crosshair overflow-hidden relative",
              isDarkMode ? "bg-slate-900 ring-slate-800" : "bg-white ring-slate-100"
            )}>
              <AlertCircle className="h-6 w-6 text-destructive animate-bounce mb-4" />
              <AlertTitle className="font-black text-[11px] uppercase tracking-[0.2em] text-destructive mb-3"> {t("Tactical Alert")}: <NeuralText text={e.place} /> </AlertTitle>
              <AlertDescription className={cn("text-sm font-bold opacity-90 leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}> <NeuralText text={e.issue} /> </AlertDescription>
              <div className="absolute top-0 right-0 h-1 w-0 bg-destructive group-hover:w-full transition-all duration-700" />
            </Alert>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Network Points", value: n(totalNeeds), icon: Radar, color: 'text-primary' },
          { label: "Avg Urgency", value: `${n(avgUrgency)}/${n(5)}`, icon: TrendingUp, color: 'text-amber-500' },
          { label: "Resolved Missions", value: n(resolved), icon: CheckCircle, color: 'text-emerald-500' },
          { label: "Sector Coverage", value: n(coverageCount), icon: MapPin, color: 'text-blue-500' },
        ].map((s) => (
          <motion.div key={s.label} variants={itemVariants} whileHover={cardHover}>
            <Card className={cn(
              "h-full border-none shadow-3xl rounded-[3.5rem] overflow-hidden group transition-all duration-700 relative",
              isDarkMode ? "bg-slate-900 shadow-none" : "bg-white shadow-slate-200"
            )}>
              <div className={cn("absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r", s.color.replace('text', 'from'), "to-transparent opacity-0 group-hover:opacity-100 transition-opacity")} />
              <CardContent className="p-10">
                <div className={cn("h-16 w-16 rounded-[1.8rem] flex items-center justify-center mb-10 transition-transform group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg", isDarkMode ? "bg-slate-800" : "bg-slate-50", s.color)}>
                  <s.icon className="h-8 w-8" />
                </div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 leading-none">{t(s.label)}</p>
                <p className={cn("text-6xl font-black tracking-tighter italic leading-none transition-colors", s.color)}>{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-4 space-y-10">
           <motion.div variants={itemVariants} whileHover={{ x: 10 }}> <VerificationSystem /> </motion.div>
           <motion.div variants={itemVariants} className={cn(
             "p-10 rounded-[3.5rem] border border-dashed flex flex-col items-center justify-center text-center gap-6",
             isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"
           )}>
             <Cpu className="h-12 w-12 text-primary animate-pulse" />
             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Sync Engaged</p>
           </motion.div>
        </div>

        <div className="xl:col-span-8 space-y-10">
          <LayoutGroup>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <motion.div variants={itemVariants} whileHover={cardHover} layout>
                <Card className={cn("border-none shadow-3xl rounded-[4rem] overflow-hidden", isDarkMode ? "bg-slate-900 shadow-none" : "bg-white shadow-slate-200")}>
                  <CardHeader className="p-12 border-b border-slate-50 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
                    <CardTitle className="text-[13px] font-black uppercase tracking-[0.5em] text-primary flex items-center gap-5">
                      <Zap className="h-6 w-6 animate-pulse" /> {t("High-Priority Global Backlog")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {topUrgent.map((need, i) => (
                      <motion.div key={need.id} whileHover={{ x: 15, backgroundColor: isDarkMode ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.05)" }} className={cn("flex items-center gap-8 p-10 border-b last:border-0 transition-all cursor-crosshair group", isDarkMode ? "border-slate-800" : "border-slate-50")}>
                        <span className="text-5xl font-black text-primary/10 group-hover:text-primary transition-colors italic font-mono">{n(`0${i+1}`)}</span>
                        <div className="flex-1">
                          <p className={cn("text-[17px] font-black uppercase tracking-tight leading-tight", isDarkMode && "text-white")}><NeuralText text={need.description} /></p>
                          <p className="text-[11px] font-bold text-slate-500 mt-4 flex items-center gap-3 italic"><MapPin className="h-4 w-4 text-primary" /> <NeuralText text={need.location} /></p>
                        </div>
                        <Badge className="bg-destructive hover:bg-destructive text-white rounded-2xl px-6 py-3 font-black italic shadow-xl shadow-destructive/20 border-none">U-{n(need.urgency)}</Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
              <div className="space-y-10">
                <motion.div variants={itemVariants} whileHover={cardHover}>
                  <Card className="bg-gradient-to-br from-primary via-blue-700 to-indigo-950 text-white border-none shadow-[0_40px_80px_-20px_rgba(59,130,246,0.4)] rounded-[4rem] p-12 relative overflow-hidden group">
                    <Radar className="absolute -right-16 -bottom-16 h-80 w-80 opacity-10 group-hover:rotate-45 transition-transform duration-[3s] ease-linear" />
                    <MapPin className="h-14 w-14 text-white/40 mb-10" />
                    <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50">{t("Critical Hotspot")}</h3>
                    <p className="text-5xl font-black mt-8 uppercase italic tracking-tighter leading-none"><NeuralText text={mostAffected} /></p>
                  </Card>
                </motion.div>
              </div>
            </div>
          </LayoutGroup>
        </div>
      </div>

      <motion.div variants={itemVariants} className={cn("pt-24 border-t", isDarkMode ? "border-slate-800" : "border-slate-200")}>
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
            <div className="space-y-5">
              <div className="flex items-center gap-4"> <Layers className="h-8 w-8 text-primary" /> <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">{t("Mission Grid Nodes")}</h2> </div>
              <p className="text-[13px] font-black text-slate-500 uppercase tracking-[0.5em]">{t("Filter sectoral reports")}</p>
            </div>
            <div className="flex gap-8">
              <Select value={filterWard} onValueChange={setFilterWard}>
                <SelectTrigger className={cn("w-80 border-none shadow-3xl h-20 px-10 font-black text-[12px] uppercase tracking-widest rounded-[2.5rem] ring-1 transition-all", isDarkMode ? "bg-slate-900 text-white ring-slate-800" : "bg-white ring-slate-200 text-slate-900")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={cn("rounded-[2rem] border-none p-2", isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900")}>
                  <SelectItem value="all" className="rounded-xl font-black uppercase text-[10px] tracking-widest">Global Access</SelectItem>
                  {WARDS.map(w => <SelectItem key={w} value={w} className="rounded-xl font-black uppercase text-[10px] tracking-widest">{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
        </div>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((n_item) => (
              <motion.div key={n_item.id} variants={itemVariants} whileHover={cardHover} layout initial="hidden" animate="visible" exit={{ scale: 0.8, opacity: 0 }}>
                <Card className={cn("border-none shadow-4xl rounded-[4rem] overflow-hidden group transition-all duration-700 relative h-full", isDarkMode ? "bg-slate-900 shadow-none" : "bg-white shadow-slate-200")}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4.5rem] group-hover:bg-primary/10 transition-colors" />
                  <CardContent className="p-12 space-y-12 relative flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <Badge className="text-[11px] font-black uppercase tracking-[0.2em] px-8 py-3 bg-primary/10 text-primary border-none rounded-2xl shadow-sm"> <NeuralText text={n_item.needType} /> </Badge>
                      <motion.div animate={n_item.status === 'resolved' ? {} : { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className={cn("h-4 w-4 rounded-full shadow-lg", n_item.status === 'resolved' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-primary shadow-primary/50')} />
                    </div>
                    <p className={cn("text-2xl font-black uppercase tracking-tight leading-[1.3] min-h-[7rem] group-hover:text-primary transition-colors flex-1", isDarkMode && "text-white")}> <NeuralText text={n_item.description} /> </p>
                    <div className={cn("flex items-center justify-between text-[11px] font-black uppercase tracking-widest pt-10 border-t opacity-70 italic", isDarkMode ? "border-slate-800" : "border-slate-100")}>
                      <span className="flex items-center gap-4"><MapPin className="h-5 w-5 text-primary" /> <NeuralText text={n_item.location} /></span>
                      <span className={cn(n_item.status === 'resolved' ? 'text-emerald-500' : 'text-primary')}>{t(n_item.status)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 🛡️ TACTICAL CHATBOT POPUP: Compact sizing for maximum visibility */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 100 }}
            className="fixed bottom-32 right-12 z-[1001] w-[360px] h-[550px] rounded-[3rem] shadow-7xl overflow-hidden border border-white/5 bg-slate-950/80 backdrop-blur-2xl"
          >
            <ManualAI onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-12 right-12 z-[1000] flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute h-28 w-28 bg-primary/30 rounded-full blur-2xl" />
        <motion.button 
          whileHover={{ scale: 1.15, rotate: 5 }} 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className={cn(
            "relative h-24 w-24 rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(59,130,246,0.7)] flex items-center justify-center text-white transition-all duration-500 ring-4 ring-primary/20", 
            isChatOpen ? "bg-slate-900 rotate-90" : "bg-gradient-to-br from-primary to-blue-600"
          )}
        >
          {isChatOpen ? <X className="h-10 w-10" /> : <MessageSquare className="h-10 w-10" />}
        </motion.button>
      </div>

      {matchNeedId && <VolunteerMatchDialog needId={matchNeedId} onClose={() => setMatchNeedId(null)} />}
      <style dangerouslySetInnerHTML={{ __html: ` @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 15s linear infinite; } .custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 20px; } `}} />
    </motion.div>
  );
}