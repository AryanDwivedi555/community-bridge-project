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
import { Plus, Building2, MapPin, Users, CheckCircle, Share2, Globe, ShieldCheck, Activity, Target, Zap, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'sonner'; 
import { cn } from '@/lib/utils';
import { T } from '@/components/T'; 

/**
 * NATIONAL GRID: FEDERATED NETWORK COORDINATION (ZENITH V4.0)
 * Logic: NGO Integration & Mission Dispatch with AAA strategic aesthetics.
 */
export default function NGONetwork() {
  const context = useApp();
  if (!context) return null;

  const { ngos, addNGO, needs, acceptNeed, theme } = context;
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [focus, setFocus] = useState('');

  const currentNGO = ngos[0]; 
  const networkNeeds = needs.filter(n => n.status !== 'resolved');

  // Stagger variants for list loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const handleSubmit = () => {
    if (!name || !area || !focus) {
      toast.error(<T>Protocol Error</T>, { description: <T>Please provide all organization credentials.</T> });
      return;
    }
    addNGO({ 
      name, areaCovered: area, focusArea: focus,
      logo: name.substring(0, 2).toUpperCase()
    });
    setShowForm(false); setName(''); setArea(''); setFocus('');
    toast.success(<T>Node Integrated</T>, { 
      description: <T>Organization registered in Federated National Grid.</T>,
      icon: <Zap className="h-4 w-4 text-emerald-400" />
    });
  };

  const handleAccept = (needId: string) => {
    acceptNeed(needId, currentNGO?.name || 'Authorized Partner');
    toast.success(<T>Mission Intercepted</T>, {
      description: <T>Task linked to Node 01.</T>,
      icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />
    });
  };

  return (
    <div className={cn(
      "space-y-12 pb-16 transition-all duration-1000",
      theme === 'dark' ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-900"
    )}>
      
      {/* 1. ELITE COMMAND HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            <T>Federated Network</T>
          </h1>
          <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
            <Globe className="h-4 w-4 animate-spin-slow" /> <T>Cross-Organizational National Coordination</T>
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className={cn(
              "h-16 px-10 rounded-[1.2rem] font-black uppercase tracking-widest transition-all shadow-3xl active:scale-95 border-none",
              showForm ? "bg-slate-800 text-white" : "bg-primary text-white shadow-primary/30"
            )}
          >
            <Plus className={cn("h-5 w-5 mr-3 transition-transform duration-700", showForm ? 'rotate-45' : '')} />
            <T>{showForm ? 'Abort Entry' : 'Register Node'}</T>
          </Button>
        </motion.div>
      </motion.div>

      {/* 2. ONBOARDING FORM (Preserved Features, Upgraded Visuals) */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.9, filter: "blur(20px)" }} 
            animate={{ opacity: 1, height: 'auto', scale: 1, filter: "blur(0px)" }} 
            exit={{ opacity: 0, height: 0, scale: 0.9, filter: "blur(20px)" }} 
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            className="overflow-hidden"
          >
            <Card className={cn(
              "border-none shadow-6xl rounded-[4rem] overflow-hidden mb-12 relative overflow-hidden",
              theme === 'dark' ? "bg-slate-900/60 backdrop-blur-3xl border border-white/5" : "bg-white"
            )}>
              {/* Animated Accent Bar */}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1 }} className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 origin-left" />

              <CardHeader className="p-12 border-b border-white/5 bg-emerald-500/5">
                <CardTitle className="text-[15px] font-black uppercase tracking-[0.4em] flex items-center gap-5 text-emerald-400">
                  <Building2 className="h-7 w-7" /> <T>Node Registration Protocol</T>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Legal Identity</T></Label>
                    <Input 
                      value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Red Cross India" 
                      className={cn("h-16 rounded-[1.5rem] border-none font-bold text-sm px-6 shadow-inner", theme === 'dark' ? "bg-slate-950/50 text-white placeholder:text-slate-800" : "bg-slate-50")} 
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Sector Coverage</T></Label>
                    <Select value={area} onValueChange={setArea}>
                      <SelectTrigger className={cn("h-16 rounded-[1.5rem] border-none font-black text-[11px] uppercase px-6 shadow-inner", theme === 'dark' ? "bg-slate-950/50 text-white" : "bg-slate-50")}>
                        <SelectValue placeholder="Select Operational Area" />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl border-none shadow-6xl backdrop-blur-3xl">
                        {WARDS.map(w => <SelectItem key={w} value={w} className="font-bold py-4 focus:bg-emerald-500/10"><T>{w}</T></SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Core Discipline</T></Label>
                    <Select value={focus} onValueChange={setFocus}>
                      <SelectTrigger className={cn("h-16 rounded-[1.5rem] border-none font-black text-[11px] uppercase px-6 shadow-inner", theme === 'dark' ? "bg-slate-950/50 text-white" : "bg-slate-50")}>
                        <SelectValue placeholder="Select Focus Domain" />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl border-none shadow-6xl">
                        {['Food Security', 'Medical Aid', 'Education', 'Infrastructure', 'Community Development'].map(f => (
                          <SelectItem key={f} value={f} className="font-bold py-4 focus:bg-emerald-500/10"><T>{f}</T></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                   <motion.button onClick={handleSubmit} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="h-16 px-14 bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-3xl shadow-emerald-500/30 transition-all border-none">
                     <T>Confirm Node Integration</T>
                   </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ACTIVE NODES DIRECTORY (Staggered Load) */}
      <div className="space-y-10">
        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-5">
          <Share2 className="h-5 w-5 text-emerald-400" /> <T>Established Network Nodes</T>
        </h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {ngos.map((ngo) => (
            <motion.div 
              key={ngo.id} 
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3, type: "spring" } }}
              className="relative group"
            >
              <Card className={cn(
                "border-none shadow-4xl rounded-[3rem] overflow-hidden transition-all duration-500 relative",
                theme === 'dark' ? "bg-slate-900/50 hover:bg-slate-900 border border-white/5" : "bg-white hover:shadow-emerald-500/5"
              )}>
                <CardContent className="p-10 flex items-center gap-7">
                  <div className="h-16 w-16 rounded-[1.6rem] bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shrink-0 shadow-3xl shadow-emerald-500/30 group-hover:rotate-[15deg] transition-transform duration-500">
                    <span className="text-slate-950 text-xl font-black italic">{ngo.logo}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={cn("font-black text-sm uppercase tracking-tight truncate", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      <T>{ngo.name}</T>
                    </p>
                    <div className="text-[10px] font-black text-slate-500 flex items-center gap-2.5 mt-2.5 uppercase tracking-widest opacity-60">
                        <MapPin className="h-4 w-4 text-emerald-400" /> <T>{ngo.areaCovered}</T>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                       <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black px-3 py-1.5 uppercase tracking-widest rounded-lg">
                         <T>{ngo.focusArea}</T>
                       </Badge>
                       <ShieldCheck className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 4. DISPATCH CENTER (Layout Smoothing) */}
      <LayoutGroup>
        <div className={cn("pt-16 border-t", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
          <Tabs defaultValue="network" className="w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-5">
                <Activity className="h-6 w-6 text-red-500 animate-pulse" /> <T>Mission Dispatch Center</T>
              </h2>
              <TabsList className={cn(
                "p-2 rounded-[1.8rem] h-16",
                theme === 'dark' ? "bg-slate-900/60" : "bg-slate-100"
              )}>
                <TabsTrigger value="network" className="px-12 rounded-2xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
                  <T>Global Queue</T>
                </TabsTrigger>
                <TabsTrigger value="my" className="px-12 rounded-2xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 transition-all duration-300">
                  <T>Node Assignments</T>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="network" className="outline-none">
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {networkNeeds.map((n) => (
                  <motion.div key={n.id} layout variants={itemVariants}>
                    <Card className={cn(
                      "border-none shadow-5xl rounded-[3.5rem] border-l-[16px] transition-all duration-500 group overflow-hidden relative",
                      theme === 'dark' ? "bg-slate-900/60 hover:bg-slate-900 border border-white/5" : "bg-white",
                      n.urgency >= 4 ? 'border-l-red-500 shadow-red-500/5' : 'border-l-primary'
                    )}>
                      <CardContent className="p-12 space-y-9">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary/10 text-primary border-none text-[11px] font-black uppercase px-6 py-2 tracking-widest rounded-xl">
                            <T>{n.needType}</T>
                          </Badge>
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-50">U-LEVEL</span>
                             <Badge className={cn("font-black text-[13px] px-5 py-2 border-none shadow-2xl italic rounded-xl animate-pulse", n.urgency >= 4 ? 'bg-red-500 text-white' : 'bg-primary text-white')}>
                               <T>{n.urgency}</T>
                             </Badge>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className={cn("text-xl font-black uppercase tracking-tight leading-relaxed", theme === 'dark' ? "text-white" : "text-slate-800")}>
                            <T>{n.description}</T>
                          </p>
                          <div className="mt-8 flex flex-wrap items-center gap-8">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><MapPin className="h-4 w-4 text-emerald-400" /> <T>{n.location}</T></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><Users className="h-4 w-4 text-emerald-400" /> <T>{n.peopleAffected}</T> <T>Impacted</T></span>
                          </div>
                        </div>
                        
                        <div className={cn("pt-8 border-t flex items-center justify-between", theme === 'dark' ? "border-white/5" : "border-slate-100")}>
                          {n.sharedBy && <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest"><T>Source</T>: <T>{n.sharedBy}</T></span>}
                          {n.acceptedBy ? (
                            <div className="flex items-center gap-3 text-emerald-400 font-black text-[11px] uppercase tracking-[0.3em] bg-emerald-500/5 px-4 py-2 rounded-lg">
                              <CheckCircle className="h-5 w-5" /> <T>Locked by</T> <T>{n.acceptedBy}</T>
                            </div>
                          ) : (
                            <motion.button onClick={() => handleAccept(n.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-primary hover:bg-slate-950 text-white h-14 px-10 rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest shadow-3xl active:scale-90 transition-all border-none">
                                <T>Intercept Mission</T>
                            </motion.button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="my" className="outline-none">
              <AnimatePresence mode="popLayout">
                {needs.filter(n => n.acceptedBy === currentNGO?.name).length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {needs.filter(n => n.acceptedBy === currentNGO?.name).map((n) => (
                      <motion.div 
                        key={n.id}
                        layout
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                      >
                        <Card className={cn(
                          "border-none shadow-6xl rounded-[3.5rem] border-l-[16px] border-l-emerald-500 transition-all group overflow-hidden border-t border-white/5",
                          theme === 'dark' ? "bg-slate-900/60 backdrop-blur-xl" : "bg-white"
                        )}>
                          <CardContent className="p-12">
                            <div className="flex justify-between mb-8">
                              <Badge className="bg-emerald-500 text-slate-950 font-black uppercase text-[10px] tracking-widest border-none px-6 py-2 shadow-3xl shadow-emerald-500/20 italic rounded-xl animate-pulse">
                                <T>Node Assigned</T>
                              </Badge>
                              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-700 px-5 py-2 rounded-xl">
                                <T>{n.needType}</T>
                              </Badge>
                            </div>
                            <p className={cn("text-2xl font-black uppercase tracking-tight", theme === 'dark' ? "text-white" : "text-slate-800")}>
                              <T>{n.description}</T>
                            </p>
                            <div className="mt-10 flex justify-between items-center pt-8 border-t border-white/5">
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 opacity-70"><MapPin className="h-5 w-5 text-emerald-400" /> <T>{n.location}</T></span>
                              <Button variant="ghost" className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/5 transition-colors">
                                <T>Logistics Data</T> <Target className="h-5 w-5 ml-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "col-span-full py-40 text-center border-4 border-dashed rounded-[5rem] transition-all backdrop-blur-md",
                      theme === 'dark' ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-200"
                    )}
                  >
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }}>
                       <Building2 className="h-28 w-28 text-slate-700 mx-auto mb-10 opacity-30" />
                    </motion.div>
                    <p className="text-[16px] font-black text-slate-600 uppercase tracking-[0.7em] italic">
                      <T>No Missions Intercepted</T>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </LayoutGroup>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-6xl { box-shadow: 0 45px 120px -25px rgba(0,0,0,0.85); }
        .shadow-5xl { box-shadow: 0 35px 90px -20px rgba(0,0,0,0.7); }
        .shadow-4xl { box-shadow: 0 20px 70px -15px rgba(0,0,0,0.6); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}