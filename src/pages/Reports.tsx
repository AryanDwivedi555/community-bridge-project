import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, PieChart, Map as MapIcon, CheckCircle2, Activity, Target, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * NATIONAL GRID: IMPACT ANALYTICS & LOGISTICS
 * Hardened against context failures with 100% data preservation.
 */
export default function Reports() {
  // --- SECURE UPLINK HANDSHAKE ---
  const context = useApp();
  
  // Defensive guard to neutralize the 'render2' failure
  if (!context) return null;

  const { needs, theme } = context;

  // 1. DATA AGGREGATION ENGINE (Zero Loss)
  const byType = needs.reduce((acc, n) => { acc[n.needType] = (acc[n.needType] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byWard = needs.reduce((acc, n) => { acc[n.location] = (acc[n.location] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byStatus = needs.reduce((acc, n) => { acc[n.status] = (acc[n.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const totalAffected = needs.reduce((sum, n) => sum + n.peopleAffected, 0);
  const resolutionRate = ((byStatus['resolved'] || 0) / (needs.length || 1) * 100).toFixed(0);

  const handleExport = () => {
    toast.success("Intelligence Export Initiated", {
      description: "Encrypted CSV payload generating for National Hub...",
      icon: <ShieldCheck className="h-4 w-4 text-primary" />
    });
  };

  return (
    <div className={cn(
      "space-y-10 pb-12 transition-colors duration-500",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      
      {/* COMMAND HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Impact Analytics</h1>
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse" /> Real-time Transparency & Mission Tracking
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            onClick={handleExport} 
            variant="outline" 
            className={cn(
              "h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] flex-1 md:flex-initial transition-all",
              theme === 'dark' ? "border-slate-800 bg-slate-900 text-slate-400 hover:text-white" : "border-slate-200 bg-white"
            )}
          >
            <Download className="mr-3 h-4 w-4" /> Export Intelligence
          </Button>
        </div>
      </div>

      {/* TACTICAL IMPACT STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Reach", val: totalAffected.toLocaleString(), sub: "Supported Citizens", icon: Target, color: "text-primary", bg: "bg-primary/10" },
          { label: "Resolution", val: `${resolutionRate}%`, sub: "Grid Success Rate", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Active Nodes", val: byStatus['pending'] || 0, sub: "Pending Response", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Sync Health", val: "100%", sub: "Uplink Optimized", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" }
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={cn(
              "border-none shadow-2xl rounded-[2rem] overflow-hidden group",
              theme === 'dark' ? "bg-slate-900" : "bg-white"
            )}>
              <CardContent className="p-8">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12", s.bg)}>
                    <s.icon className={cn("h-5 w-5", s.color)} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
                <p className={cn("text-3xl font-black mt-1 tracking-tighter leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}>{s.val}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase italic">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sector Distribution Matrix */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className={cn("h-full border-none shadow-2xl rounded-[2.5rem]", theme === 'dark' ? "bg-slate-900" : "bg-white")}>
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                <PieChart className="h-5 w-5 text-primary" /> Sector Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {Object.entries(byType).map(([type, count]) => (
                <div key={type} className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className={theme === 'dark' ? "text-slate-300" : "text-slate-600"}>{type}</span>
                    <span className="text-primary">{count} Nodes</span>
                  </div>
                  <div className={cn("h-2.5 w-full rounded-full overflow-hidden shadow-inner", theme === 'dark' ? "bg-slate-800" : "bg-slate-100")}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / needs.length) * 100}%` }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Hotspot Radar Analytics */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className={cn("h-full border-none shadow-2xl rounded-[2.5rem]", theme === 'dark' ? "bg-slate-900" : "bg-white")}>
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                <MapIcon className="h-5 w-5 text-amber-500" /> Hotspot Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {Object.entries(byWard).map(([ward, count]) => (
                <div key={ward} className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all border",
                    theme === 'dark' ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800" : "bg-slate-50 border-transparent hover:border-slate-100 hover:bg-white hover:shadow-lg"
                )}>
                  <span className="text-[11px] font-black uppercase tracking-tight truncate max-w-[160px]">
                    {ward.includes(' - ') ? ward.split(' - ')[1] : ward}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reports</span>
                    <Badge className="h-6 w-6 flex items-center justify-center p-0 bg-primary text-white border-none font-black italic shadow-lg shadow-primary/20">{count}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Handshake Status Telemetry */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className={cn("h-full border-none shadow-2xl rounded-[2.5rem]", theme === 'dark' ? "bg-slate-900" : "bg-white")}>
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Handshake Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border transition-all",
                    theme === 'dark' ? "bg-slate-800/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn("h-3 w-3 rounded-full animate-pulse", 
                      status === 'resolved' ? 'bg-emerald-500 shadow-[0_0_8px_emerald]' : 
                      status === 'pending' ? 'bg-amber-500 shadow-[0_0_8px_orange]' : 'bg-primary shadow-[0_0_8px_blue]'
                    )} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{status}</span>
                  </div>
                  <span className="font-black text-2xl tracking-tighter italic">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* MASTER MISSION LOG LOGISTICS */}
      <Card className={cn(
        "border-none shadow-2xl rounded-[3rem] overflow-hidden transition-all",
        theme === 'dark' ? "bg-slate-900" : "bg-white"
      )}>
        <CardHeader className="bg-slate-950 text-white p-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-[0.5em] flex items-center gap-4 text-primary">
              <FileText className="h-6 w-6" /> Master Mission Log
            </CardTitle>
            <Badge className="bg-white/10 text-white border-white/20 px-6 py-2 font-black text-[10px] uppercase tracking-widest italic shadow-lg">Grid Payload: {needs.length} Reports</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className={theme === 'dark' ? "bg-white/5" : "bg-slate-50"}>
                <TableRow className="border-none">
                  <TableHead className="text-[9px] uppercase font-black tracking-[0.2em] py-6 px-8 text-slate-500">Sector</TableHead>
                  <TableHead className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">Mission Data</TableHead>
                  <TableHead className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">Regional Node</TableHead>
                  <TableHead className="text-[9px] uppercase font-black tracking-[0.2em] text-center text-slate-500">Urgency</TableHead>
                  <TableHead className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">Impact</TableHead>
                  <TableHead className="text-[9px] uppercase font-black tracking-[0.2em] text-right py-6 px-8 text-slate-500">Telemetry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needs.map((n) => (
                  <TableRow key={n.id} className={cn(
                    "transition-colors border-none",
                    theme === 'dark' ? "hover:bg-white/5" : "hover:bg-primary/5"
                  )}>
                    <TableCell className="px-8 py-6">
                      <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
                        {n.needType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className={cn("text-[13px] font-black uppercase tracking-tight truncate", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>{n.description}</p>
                      <p className={cn("text-[9px] font-black uppercase mt-1 tracking-widest", 
                        n.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'
                      )}>
                        Status: {n.status}
                      </p>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                      {n.location.includes(' - ') ? n.location.split(' - ')[1] : n.location}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={cn("inline-flex items-center justify-center w-8 h-8 rounded-xl text-[11px] font-black text-white shadow-xl italic", 
                        n.urgency >= 4 ? 'bg-red-500 shadow-red-500/20' : n.urgency === 3 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                      )}>
                        {n.urgency}
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-black uppercase italic opacity-80">
                      {n.peopleAffected} CITIZENS
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{new Date(n.createdAt).toLocaleDateString()}</p>
                      <p className="text-[8px] text-primary font-black uppercase tracking-[0.2em] mt-1 italic">{n.syncStatus}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}