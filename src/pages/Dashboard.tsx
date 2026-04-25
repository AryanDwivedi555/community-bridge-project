import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WARDS, NEED_TYPES, NGO_LANGS, liveEmergencies } from '@/lib/mockData';
import { 
  AlertTriangle, MapPin, TrendingUp, CheckCircle, 
  Globe, AlertCircle, Zap, ArrowRight, Activity, Shield, Radar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolunteerMatchDialog } from '@/components/VolunteerMatchDialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import VerificationSystem from '@/components/VerificationSystem';
import ManualAI from '@/components/ManualAI';
import { cn } from '@/lib/utils';

/**
 * NATIONAL GRID: INTELLIGENCE HUB DASHBOARD
 * Centralized Command & Control for National Mission Telemetry.
 * Integrated with Manual AI Instructor Hub.
 */
export default function Dashboard() {
  // --- SECURE UPLINK: CONTEXT ABSTRACTION ---
  const context = useApp();
  
  if (!context) return null;

  const { needs, language, changeLanguage, theme, volunteers = [] } = context;
  const [filterWard, setFilterWard] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [matchNeedId, setMatchNeedId] = useState<string | null>(null);

  // --- 1. CORE FILTERING ENGINE (Preserved) ---
  const filtered = useMemo(() => {
    return needs.filter(n => {
      if (filterWard !== 'all' && n.location !== filterWard) return false;
      if (filterType !== 'all' && n.needType !== filterType) return false;
      return true;
    });
  }, [needs, filterWard, filterType]);

  // --- 2. TACTICAL ANALYTICS (Preserved) ---
  const topUrgent = useMemo(() => [...needs].sort((a, b) => b.urgency - a.urgency).slice(0, 5), [needs]);
  const totalNeeds = needs.length;
  const avgUrgency = (needs.reduce((s, n) => s + n.urgency, 0) / (needs.length || 1)).toFixed(1);
  const resolved = needs.filter(n => n.status === 'resolved').length;
  const coverageCount = new Set(needs.map(n => n.location)).size;

  const areaCounts = needs.reduce((acc, n) => { acc[n.location] = (acc[n.location] || 0) + 1; return acc; }, {} as Record<string, number>);
  const mostAffected = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className={cn(
      "space-y-8 pb-12 animate-in fade-in duration-700 transition-colors duration-500",
      theme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50/30"
    )}>
      
      {/* 1. TACTICAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="h-6 w-6 text-white" />
             </div>
             <h1 className={cn(
               "text-3xl font-black tracking-tighter uppercase italic leading-none",
               theme === 'dark' ? "text-white" : "text-slate-900"
             )}>Intelligence Hub</h1>
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-2 font-black uppercase tracking-[0.3em]">
            <Activity className="h-3 w-3 text-primary animate-pulse" /> National Grid Node-01 Tactical Feed
          </p>
        </div>
        
        <div className={cn(
          "flex items-center gap-3 px-4 py-2 border rounded-2xl shadow-xl transition-all",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r pr-3">Language</span>
          <select 
            value={language}
            onChange={(e) => changeLanguage(e.target.value as any)}
            className="text-xs font-black bg-transparent border-none outline-none cursor-pointer text-primary focus:ring-0"
          >
            {NGO_LANGS.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. EMERGENCY ALERT FEED */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveEmergencies.map((e, idx) => (
            <motion.div key={e.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
              <Alert className="bg-destructive/5 border-l-4 border-l-destructive border-destructive/20 shadow-xl shadow-red-500/5 group hover:scale-[1.02] transition-transform rounded-2xl">
                <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                <AlertTitle className="font-black text-[10px] uppercase tracking-widest text-destructive">Tactical Alert: {e.place}</AlertTitle>
                <AlertDescription className="text-xs font-bold text-slate-600 mt-1">{e.issue}</AlertDescription>
              </Alert>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: VERIFICATION & CHATBOT */}
        <div className="xl:col-span-4 space-y-8">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="h-[600px]">
             <ManualAI />
           </motion.div>
           <VerificationSystem />
        </div>

        {/* RIGHT COLUMN: CORE ANALYTICS & GRID NODES */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* 3. CORE ANALYTICS RADAR (Preserved) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Network Points', value: totalNeeds, icon: Radar, color: 'text-primary' },
              { label: 'Avg Urgency', value: `${avgUrgency}/5`, icon: TrendingUp, color: 'text-amber-500' },
              { label: 'Resolved Missions', value: resolved, icon: CheckCircle, color: 'text-emerald-500' },
              { label: 'Sector Coverage', value: coverageCount, icon: MapPin, color: 'text-blue-500' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={cn(
                  "h-full border-none shadow-2xl rounded-[2.5rem] group hover:-translate-y-1 transition-all",
                  theme === 'dark' ? "bg-slate-900" : "bg-white"
                )}>
                  <CardContent className="p-8 flex flex-col justify-between h-full">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6", theme === 'dark' ? "bg-white/5" : "bg-slate-50")}>
                      <s.icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                      <p className={cn("text-4xl font-black mt-1 tracking-tighter leading-none", theme === 'dark' ? "text-white" : "text-slate-800")}>{s.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className={cn(
              "lg:col-span-2 border-none shadow-2xl rounded-[3rem] overflow-hidden transition-all",
              theme === 'dark' ? "bg-slate-900" : "bg-white"
            )}>
              <CardHeader className={cn("border-b p-8", theme === 'dark' ? "bg-white/5 border-slate-800" : "bg-slate-50 border-slate-100")}>
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" /> High-Priority Global Backlog
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {topUrgent.map((n, i) => (
                  <div key={n.id} className={cn(
                    "flex items-center gap-6 p-8 border-b last:border-0 hover:bg-primary/5 transition-all group",
                    theme === 'dark' ? "border-slate-800" : "border-slate-50"
                  )}>
                    <span className="text-3xl font-black text-primary/10 group-hover:text-primary transition-colors w-10">0{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-black uppercase tracking-tight", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>{n.description}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-primary" /> {n.location}
                      </p>
                    </div>
                    <Badge className={cn("px-5 py-2 font-black text-[10px] border-none shadow-xl", 
                      n.urgency >= 4 ? 'bg-destructive text-white shadow-destructive/20' : 'bg-primary text-white shadow-primary/20'
                    )}>U-{n.urgency}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-primary text-white border-none shadow-2xl rounded-[3rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all" />
                <CardContent className="p-8 relative z-10">
                  <MapPin className="h-10 w-10 text-white/50 mb-6" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Critical Hotspot</h3>
                  <p className="text-3xl font-black mt-2 leading-tight tracking-tighter uppercase">{mostAffected}</p>
                  <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between group-hover:translate-x-2 transition-transform">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">System Recommendation</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-emerald-500 text-white p-8 rounded-[3rem] flex items-center gap-6 shadow-2xl shadow-emerald-500/20">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Grid Stability</p>
                  <p className="text-xl font-black tracking-tight">{resolved} Resolved Missions</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. MISSION GRID NODES (Preserved) */}
          <div className={cn("pt-12 border-t", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="space-y-1">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">Mission Grid Nodes</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter sectoral reports</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select value={filterWard} onValueChange={setFilterWard}>
                    <SelectTrigger className={cn(
                      "w-48 border-none shadow-xl h-14 px-6 font-black text-[10px] uppercase tracking-widest rounded-2xl",
                      theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
                    )}><SelectValue placeholder="All Wards" /></SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all">Everywhere</SelectItem>
                      {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className={cn(
                      "w-48 border-none shadow-xl h-14 px-6 font-black text-[10px] uppercase tracking-widest rounded-2xl",
                      theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
                    )}><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all">All Sectors</SelectItem>
                      {NEED_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className={cn(
                    "border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-primary/10 transition-all",
                    theme === 'dark' ? "bg-slate-900" : "bg-white"
                  )}>
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-primary/10 text-primary border-none">
                          {n.needType}
                        </Badge>
                        <div className={cn("h-2.5 w-2.5 rounded-full", n.status === 'resolved' ? 'bg-emerald-500' : 'bg-primary animate-pulse')} />
                      </div>
                      
                      <p className={cn(
                        "text-[13px] font-black uppercase tracking-tight leading-relaxed min-h-[4rem] line-clamp-3",
                        theme === 'dark' ? "text-slate-200" : "text-slate-800"
                      )}>
                        {n.description}
                      </p>

                      <div className={cn(
                        "flex items-center justify-between text-[10px] font-black uppercase tracking-widest border-t pt-6",
                        theme === 'dark' ? "border-slate-800 text-slate-500" : "border-slate-50 text-slate-400"
                      )}>
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{n.location}</span>
                        <span className={cn(n.status === 'resolved' ? 'text-emerald-500' : 'text-primary')}>{n.status}</span>
                      </div>

                      {n.status === 'pending' && (
                        <button
                          onClick={() => setMatchNeedId(n.id)}
                          className="w-full mt-4 py-4 bg-primary text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-slate-900 active:scale-95"
                        >
                          Initialize Match <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {matchNeedId && (
        <VolunteerMatchDialog needId={matchNeedId} onClose={() => setMatchNeedId(null)} />
      )}
    </div>
  );
}