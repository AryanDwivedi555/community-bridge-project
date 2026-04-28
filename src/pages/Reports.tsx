import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, Download, PieChart, Map as MapIcon, CheckCircle2, 
  Activity, Target, ShieldCheck, Zap, BarChart3, TrendingUp, Sparkles, Globe 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { T } from '@/components/T';

export default function Reports() {
  const context = useApp();
  if (!context) return null;

  const { needs, theme } = context;

  // 1. DATA AGGREGATION ENGINE (Preserved)
  const byType = needs.reduce((acc, n) => { acc[n.needType] = (acc[n.needType] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byWard = needs.reduce((acc, n) => { acc[n.location] = (acc[n.location] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byStatus = needs.reduce((acc, n) => { acc[n.status] = (acc[n.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const totalAffected = needs.reduce((sum, n) => sum + n.peopleAffected, 0);
  const resolutionRate = ((byStatus['resolved'] || 0) / (needs.length || 1) * 100).toFixed(0);

  // PEAK PERFORMANCE VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 } 
    }
  };

  const handleExport = () => {
    toast.success(<T>Intelligence Export Initiated</T>, {
      description: <T>Encrypted CSV payload generating for National Hub...</T>,
      icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "space-y-12 pb-20 transition-all duration-1000 relative overflow-hidden px-4 md:px-8",
        theme === 'dark' ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-900"
      )}
    >
      {/* BACKGROUND AMBIENCE PARTICLES */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} 
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" 
        />
      </div>

      {/* 1. COMMAND HEADER - Scalable for Translation */}
      <motion.div variants={cardVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10 pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-primary/10 rounded-lg border border-primary/20"
             >
                <Globe className="h-5 w-5 text-primary" />
             </motion.div>
             <Badge variant="outline" className="border-primary/30 text-primary font-black px-4 py-1 rounded-full text-[9px] tracking-widest uppercase bg-primary/5">
                <T>Uplink Active</T>
             </Badge>
          </div>
          {/* FIX: Removed 'leading-none' to prevent text cutting in regional scripts */}
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent py-2">
            <T>Impact Analytics</T>
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" /> <T>Real-time Transparency & Mission Tracking</T>
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleExport} className="h-16 px-12 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] bg-primary text-white shadow-2xl shadow-primary/30 border-none hover:bg-blue-700 transition-all">
            <Download className="mr-3 h-5 w-5" /> <T>Export Intelligence</T>
          </Button>
        </motion.div>
      </motion.div>

      {/* 2. STAT STICKER BLOCKS - Dynamic Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {[
          { label: "Total Reach", val: totalAffected, sub: "Supported Citizens", icon: Target, color: "text-blue-600 dark:text-primary", bg: "from-blue-600/10 to-transparent", border: "border-blue-500/20", sticker: <TrendingUp className="h-16 w-16 text-blue-500/10 absolute -right-4 -top-4 rotate-12" /> },
          { label: "Resolution", val: `${resolutionRate}%`, sub: "Grid Success Rate", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-600/10 to-transparent", border: "border-emerald-500/20", sticker: <Sparkles className="h-16 w-16 text-emerald-500/10 absolute -right-4 -top-4 animate-pulse" /> },
          { label: "Active Nodes", val: byStatus['pending'] || 0, sub: "Pending Response", icon: Activity, color: "text-amber-600 dark:text-amber-400", bg: "from-amber-600/10 to-transparent", border: "border-amber-500/20", sticker: <Zap className="h-16 w-16 text-amber-500/10 absolute -right-4 -top-4 animate-bounce" /> },
          { label: "Sync Health", val: "100%", sub: "Uplink Optimized", icon: ShieldCheck, color: "text-indigo-600 dark:text-indigo-400", bg: "from-indigo-600/10 to-transparent", border: "border-indigo-500/20", sticker: <ShieldCheck className="h-16 w-16 text-indigo-500/10 absolute -right-4 -top-4 -rotate-12" /> }
        ].map((s, i) => (
          <motion.div key={s.label} variants={cardVariants} whileHover={{ y: -15, scale: 1.02 }}>
            <Card className={cn(
              "border-none shadow-xl rounded-[3rem] overflow-hidden group relative transition-all duration-500 min-h-[220px] flex flex-col justify-center",
              theme === 'dark' ? `bg-slate-900/40 backdrop-blur-3xl border-t ${s.border}` : "bg-white border border-slate-200"
            )}>
              {s.sticker}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", s.bg)} />
              
              <CardContent className="p-10 relative z-10">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-all group-hover:scale-110", theme === 'dark' ? "bg-slate-800" : "bg-slate-50")}
                >
                    <s.icon className={cn("h-7 w-7", s.color)} />
                </motion.div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2"><T>{s.label}</T></p>
                <p className={cn("text-5xl font-black tracking-tighter leading-tight mb-3", theme === 'dark' ? "text-white" : "text-slate-900")}>
                  <T>{s.val}</T>
                </p>
                <div className="h-1 w-12 bg-primary/30 rounded-full mb-4 group-hover:w-full transition-all duration-700" />
                <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest"><T>{s.sub}</T></p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. LOGISTICS MATRIX - Space-aware for Translation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <motion.div variants={cardVariants}>
          <Card className={cn("h-full border-none shadow-2xl rounded-[4rem] overflow-hidden", theme === 'dark' ? "bg-slate-900/40 backdrop-blur-3xl" : "bg-white border border-slate-200")}>
            <CardHeader className="p-12 border-b border-slate-100 dark:border-white/5 bg-primary/5">
              <CardTitle className="text-[14px] font-black uppercase tracking-[0.5em] text-primary flex items-center gap-4">
                <BarChart3 className="h-7 w-7" /> <T>Sector Distribution</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 space-y-12">
              {Object.entries(byType).map(([type, count]) => (
                <div key={type} className="group space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest px-2">
                    <span className={theme === 'dark' ? "text-slate-300" : "text-slate-600"}><T>{type}</T></span>
                    <Badge className="bg-primary/10 text-primary border-none font-mono text-[10px] px-3 py-1"><T>{count}</T> NODES</Badge>
                  </div>
                  <div className={cn("h-4 w-full rounded-full overflow-hidden shadow-inner p-1", theme === 'dark' ? "bg-slate-950" : "bg-slate-200")}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / needs.length) * 100}%` }}
                      transition={{ type: "spring", stiffness: 40, damping: 10 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className={cn("h-full border-none shadow-2xl rounded-[4rem] overflow-hidden", theme === 'dark' ? "bg-slate-900/40 backdrop-blur-3xl" : "bg-white border border-slate-200")}>
            <CardHeader className="p-12 border-b border-slate-100 dark:border-white/5 bg-amber-500/5">
              <CardTitle className="text-[14px] font-black uppercase tracking-[0.5em] text-amber-500 flex items-center gap-4">
                <MapIcon className="h-6 w-6" /> <T>Hotspot Analytics</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 space-y-6">
              {Object.entries(byWard).map(([ward, count]) => (
                <motion.div 
                  key={ward} 
                  whileHover={{ x: 15, backgroundColor: theme === 'dark' ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.05)" }} 
                  className={cn(
                    "flex items-center justify-between p-6 rounded-[2rem] transition-all border group cursor-pointer",
                    theme === 'dark' ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-100 shadow-sm"
                )}>
                  <span className="text-[13px] font-black uppercase tracking-tight truncate max-w-[180px] text-slate-700 dark:text-slate-300">
                    <T>{ward.includes(' - ') ? ward.split(' - ')[1] : ward}</T>
                  </span>
                  <div className="flex items-center gap-4">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_orange]" />
                    <Badge className="h-10 w-10 flex items-center justify-center p-0 bg-amber-500 text-slate-950 border-none font-black italic shadow-xl rounded-2xl">
                      <T>{count}</T>
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className={cn("h-full border-none shadow-2xl rounded-[4rem] overflow-hidden", theme === 'dark' ? "bg-slate-900/40 backdrop-blur-3xl" : "bg-white border border-slate-200")}>
            <CardHeader className="p-12 border-b border-slate-100 dark:border-white/5 bg-emerald-500/5">
              <CardTitle className="text-[14px] font-black uppercase tracking-[0.5em] text-emerald-500 flex items-center gap-4">
                <ShieldCheck className="h-6 w-6" /> <T>Grid Telemetry</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 space-y-8">
              {Object.entries(byStatus).map(([status, count]) => (
                <motion.div 
                  key={status} 
                  whileHover={{ scale: 1.05 }} 
                  className={cn(
                    "flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group",
                    theme === 'dark' ? "bg-slate-950/50 border-white/5" : "bg-slate-100 border-slate-200"
                )}>
                  <div className="flex items-center gap-6">
                    <div className={cn("h-5 w-5 rounded-full animate-ping shadow-glow", 
                      status === 'resolved' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-primary'
                    )} />
                    <span className="text-[14px] font-black uppercase tracking-[0.3em] text-slate-700 dark:text-slate-400 group-hover:text-primary transition-colors"><T>{status}</T></span>
                  </div>
                  <span className="font-black text-5xl tracking-tighter italic text-primary drop-shadow-2xl"><T>{count}</T></span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 4. MASTER MISSION LOG - Safety Grid */}
      <motion.div variants={cardVariants}>
        <Card className={cn(
          "border-none shadow-7xl rounded-[5rem] overflow-hidden transition-all relative border border-slate-200 dark:border-white/10",
          theme === 'dark' ? "bg-slate-900/60 backdrop-blur-2xl shadow-black" : "bg-white"
        )}>
          <CardHeader className="bg-[#020617] text-white p-12">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <CardTitle className="text-[16px] font-black uppercase tracking-[0.8em] flex items-center gap-8 text-primary">
                <FileText className="h-8 w-8 animate-pulse text-blue-500" /> <T>Master Mission Log</T>
              </CardTitle>
              <Badge className="bg-primary/20 text-primary border border-primary/40 px-10 py-4 font-black text-[12px] uppercase tracking-[0.3em] italic rounded-3xl">
                <T>Active Payload</T>: <T>{needs.length}</T> <T>Reports</T>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-hide">
              <Table>
                <TableHeader className="bg-slate-100 dark:bg-slate-950/80">
                  <TableRow className="border-none">
                    <TableHead className="text-[11px] uppercase font-black tracking-[0.4em] py-12 px-12 text-slate-500"><T>Sector</T></TableHead>
                    <TableHead className="text-[11px] uppercase font-black tracking-[0.4em] text-slate-500"><T>Mission Data</T></TableHead>
                    <TableHead className="text-[11px] uppercase font-black tracking-[0.4em] text-center text-slate-500"><T>Urgency</T></TableHead>
                    <TableHead className="text-[11px] uppercase font-black tracking-[0.4em] text-right py-12 px-12 text-slate-500"><T>Telemetry</T></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {needs.map((n, idx) => (
                      <motion.tr 
                        key={n.id} initial={{ opacity: 0, x: -20, filter: "blur(5px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ delay: idx * 0.05 }}
                        className="transition-all border-none group cursor-default border-b border-slate-200 dark:border-white/5 hover:bg-primary/5"
                      >
                        <TableCell className="px-12 py-10">
                          <Badge className="bg-primary/10 text-primary border-none text-[11px] font-black uppercase tracking-widest px-6 py-2 rounded-xl group-hover:scale-110 transition-all duration-500">
                            <T>{n.needType}</T>
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[400px]">
                          {/* FIX: Removed 'truncate' to prevent translated data loss */}
                          <p className="text-[18px] font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                            <T>{n.description}</T>
                          </p>
                          <p className="text-[11px] font-bold text-slate-500 uppercase mt-3 tracking-widest">
                            <T>Node Location</T>: <span className="text-primary italic"><T>{n.location}</T></span>
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("inline-flex items-center justify-center w-14 h-14 rounded-2xl text-xl font-black text-white shadow-2xl italic", 
                            n.urgency >= 4 ? 'bg-red-500 shadow-red-500/30' : 'bg-primary shadow-primary/30'
                          )}>
                            <T>{n.urgency}</T>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-12">
                          <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest leading-none"><T>{new Date(n.createdAt).toLocaleDateString()}</T></p>
                          <div className="flex items-center justify-end gap-3 mt-4">
                             <p className="text-[10px] text-primary font-black uppercase italic tracking-widest"><T>{n.syncStatus}</T></p>
                             <div className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-7xl { box-shadow: 0 80px 180px -40px rgba(0,0,0,0.3); }
        .shadow-glow { filter: drop-shadow(0 0 12px rgba(59,130,246,0.6)); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan { animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}} />
    </motion.div>
  );
}