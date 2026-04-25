import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WARDS } from '@/lib/mockData';
import { Plus, Building2, MapPin, Users, CheckCircle, Share2, Globe, ShieldCheck, Activity, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'; 
import { cn } from '@/lib/utils';

/**
 * NATIONAL GRID: FEDERATED NETWORK COORDINATION
 * Manages cross-organizational node integration and mission dispatch.
 * Hardened against context failures with zero feature loss.
 */
export default function NGONetwork() {
  // --- SECURE UPLINK: CONTEXT ABSTRACTION ---
  const context = useApp();
  
  // Defensive guard to neutralize the 'render2' failure
  if (!context) return null;

  const { ngos, addNGO, needs, acceptNeed, theme } = context;
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [focus, setFocus] = useState('');

  // Node Context: First NGO in the grid acts as the current operational node
  const currentNGO = ngos[0]; 
  const networkNeeds = needs.filter(n => n.status !== 'resolved');

  const handleSubmit = () => {
    if (!name || !area || !focus) {
      toast.error("Protocol Error", { description: "Please provide all organization credentials." });
      return;
    }
    addNGO({ 
      name, 
      areaCovered: area, 
      focusArea: focus,
      logo: name.substring(0, 2).toUpperCase()
    });
    setShowForm(false); setName(''); setArea(''); setFocus('');
    toast.success('Node Integrated', { description: 'Organization registered in Federated National Grid.' });
  };

  const handleAccept = (needId: string) => {
    acceptNeed(needId, currentNGO?.name || 'Authorized Partner');
    toast.success('Mission Assigned', {
      description: `Task has been linked to Node: ${currentNGO?.name || 'Partner'}.`,
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
    });
  };

  return (
    <div className={cn(
      "space-y-10 pb-12 transition-colors duration-500",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      
      {/* 1. TACTICAL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Federated Network</h1>
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <Globe className="h-4 w-4 animate-spin-slow" /> Cross-Organizational National Coordination
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className={cn(
            "h-14 px-8 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
            showForm ? "bg-slate-800 text-white" : "bg-primary text-white shadow-primary/20 hover:bg-slate-900"
          )}
        >
          <Plus className={cn("h-5 w-5 mr-3 transition-transform duration-500", showForm ? 'rotate-45' : '')} />
          {showForm ? 'Abort Entry' : 'Register Node'}
        </Button>
      </div>

      {/* 2. ONBOARDING FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="overflow-hidden"
          >
            <Card className={cn(
              "border-none shadow-2xl rounded-[2.5rem] overflow-hidden",
              theme === 'dark' ? "bg-slate-900" : "bg-white"
            )}>
              <CardHeader className="p-8 border-b border-white/5 bg-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 text-primary">
                  <Building2 className="h-5 w-5" /> Node Registration Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Identity</Label>
                    <Input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Organization Name" 
                      className={cn(
                        "h-14 rounded-2xl border-none font-bold text-xs px-5 shadow-inner",
                        theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-50"
                      )} 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sector Coverage</Label>
                    <Select value={area} onValueChange={setArea}>
                      <SelectTrigger className={cn(
                        "h-14 rounded-2xl border-none font-black text-[10px] uppercase px-5 shadow-inner",
                        theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-50"
                      )}>
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">{WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Discipline</Label>
                    <Select value={focus} onValueChange={setFocus}>
                      <SelectTrigger className={cn(
                        "h-14 rounded-2xl border-none font-black text-[10px] uppercase px-5 shadow-inner",
                        theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-50"
                      )}>
                        <SelectValue placeholder="Select Domain" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {['Food Security', 'Medical Aid', 'Education', 'Infrastructure', 'Community Development'].map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSubmit} className="h-14 px-10 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20">
                    Confirm Node Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ACTIVE NODES DIRECTORY */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
          <Share2 className="h-4 w-4 text-primary" /> Established Network Nodes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ngos.map((ngo, i) => (
            <motion.div key={ngo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className={cn(
                "border-none shadow-xl rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300",
                theme === 'dark' ? "bg-slate-900" : "bg-white"
              )}>
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span className="text-white text-sm font-black italic">{ngo.logo}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={cn("font-black text-sm uppercase tracking-tight truncate", theme === 'dark' ? "text-white" : "text-slate-900")}>{ngo.name}</p>
                    <p className="text-[9px] font-black text-slate-400 flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                        <MapPin className="h-3 w-3 text-primary" /> {ngo.areaCovered}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                       <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">{ngo.focusArea}</Badge>
                       <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. DISPATCH CENTER */}
      <div className={cn("pt-10 border-t", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
        <Tabs defaultValue="network" className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" /> Mission Dispatch Center
            </h2>
            <TabsList className={cn(
              "p-1.5 rounded-2xl h-14",
              theme === 'dark' ? "bg-slate-900" : "bg-slate-100"
            )}>
              <TabsTrigger value="network" className="px-8 rounded-xl font-black text-[10px] uppercase tracking-widest">Global Queue</TabsTrigger>
              <TabsTrigger value="my" className="px-8 rounded-xl font-black text-[10px] uppercase tracking-widest">Node Assignments</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="network">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {networkNeeds.map(n => (
                <Card key={n.id} className={cn(
                  "border-none shadow-xl rounded-[2.5rem] border-l-[10px] transition-all",
                  theme === 'dark' ? "bg-slate-900" : "bg-white",
                  n.urgency >= 4 ? 'border-l-red-500' : 'border-l-primary'
                )}>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-4 py-1 tracking-widest">{n.needType}</Badge>
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">U-LEVEL</span>
                         <Badge className={cn("font-black text-[10px] px-3 py-1 border-none", n.urgency >= 4 ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary text-white shadow-primary/20')}>{n.urgency}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className={cn("text-sm font-black uppercase tracking-tight leading-relaxed", theme === 'dark' ? "text-white" : "text-slate-800")}>{n.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> {n.location}</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Users className="h-3 w-3 text-emerald-500" /> {n.peopleAffected} Impacted</span>
                      </div>
                    </div>
                    
                    <div className={cn("pt-6 border-t flex items-center justify-between", theme === 'dark' ? "border-slate-800" : "border-slate-100")}>
                      {n.sharedBy && <span className="text-[8px] font-black text-slate-500 uppercase italic tracking-widest">Source: {n.sharedBy}</span>}
                      {n.acceptedBy ? (
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.2em]">
                          <CheckCircle className="h-4 w-4" /> Locked by {n.acceptedBy}
                        </div>
                      ) : (
                        <Button onClick={() => handleAccept(n.id)} className="bg-slate-900 dark:bg-primary text-white h-11 px-8 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                          Intercept Mission
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {needs.filter(n => n.acceptedBy === currentNGO?.name).length > 0 ? (
                needs.filter(n => n.acceptedBy === currentNGO?.name).map(n => (
                  <Card key={n.id} className={cn(
                    "border-none shadow-xl rounded-[2.5rem] border-l-[10px] border-l-emerald-500",
                    theme === 'dark' ? "bg-slate-900" : "bg-white"
                  )}>
                    <CardContent className="p-8">
                      <div className="flex justify-between mb-4">
                        <Badge className="bg-emerald-500 text-white font-black uppercase text-[9px] tracking-widest border-none px-4 py-1 shadow-lg shadow-emerald-500/20 italic">Node Assigned</Badge>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-700">{n.needType}</Badge>
                      </div>
                      <p className={cn("text-sm font-black uppercase tracking-tight", theme === 'dark' ? "text-white" : "text-slate-800")}>{n.description}</p>
                      <div className="mt-6 flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-500" /> {n.location}</span>
                        <Button variant="ghost" className="h-9 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                          Logistics Data <Target className="h-3 w-3 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className={cn(
                  "col-span-full py-24 text-center border-4 border-dashed rounded-[3rem] transition-colors",
                  theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                )}>
                  <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-6 opacity-30" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">No Missions Intercepted by this Node</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}