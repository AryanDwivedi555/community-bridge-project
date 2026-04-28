import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SKILLS, DAYS, WARDS } from '@/lib/mockData';
import { Plus, Trophy, MapPin, Car, Calendar, UserPlus, Star, Activity, ShieldCheck, Zap, Cpu, Sparkles, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { T } from '@/components/T'; 

export default function Volunteers() {
  const { volunteers, addVolunteer, removeVolunteer, theme } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [avail, setAvail] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [hasTransport, setHasTransport] = useState(false);

  // 🛡️ PERSISTENCE ENGINE: Prevents data loss on refresh
  useEffect(() => {
    const saved = localStorage.getItem('national_grid_volunteers');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Logic: Only populate if current state is empty to avoid duplication loops
      if (volunteers.length === 0 && parsed.length > 0) {
        parsed.forEach((v: any) => addVolunteer(v));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('national_grid_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  const leaderboard = [...volunteers].sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
    }
  };

  const itemVars = {
    hidden: { y: 30, opacity: 0, scale: 0.9, filter: "blur(10px)" },
    visible: { 
      y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const handleSubmit = () => {
    const finalSkills = [...skills];
    if (customSkill.trim()) finalSkills.push(customSkill.trim());
    if (!name || !location || finalSkills.length === 0) {
      toast.error(<T>Protocol Error</T>, { description: <T>Agent credentials incomplete.</T> });
      return;
    }
    
    addVolunteer({ name, skills: finalSkills, availability: avail, location, hasTransport, tasksCompleted: 0 });

    toast.success(<T>Agent Enlisted</T>, { 
        description: <T>{name} integrated into National Grid.</T>,
        icon: <Zap className="h-4 w-4 text-emerald-400" />
    });
    setShowForm(false);
    setName(''); setSkills([]); setCustomSkill(''); setAvail([]); setLocation(''); setHasTransport(false);
  };

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDay = (d: string) => setAvail(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className={cn(
      "space-y-12 pb-24 transition-all duration-1000",
      theme === 'dark' ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-900"
    )}>
      
      {/* 1. TACTICAL HEADER */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className={cn(
            "text-5xl font-black tracking-normal uppercase italic leading-[1.4] py-2 bg-gradient-to-r from-primary via-blue-600 to-emerald-600 bg-clip-text text-transparent"
          )}>
            <T>Response Agents</T>
          </h1>
          <p className={cn("text-[11px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-3", theme === 'dark' ? "text-slate-300" : "text-primary")}>
            <Activity className="h-4 w-4 animate-pulse" /> <T>National Volunteer Telemetry Directory</T>
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowForm(!showForm)} className={cn("h-16 px-10 rounded-[1.2rem] font-black uppercase tracking-widest transition-all shadow-3xl border-none", showForm ? "bg-slate-800 text-white" : "bg-primary text-white shadow-primary/30")}>
            {showForm ? <X className="h-5 w-5 mr-3 rotate-90" /> : <UserPlus className="h-5 w-5 mr-3" />}
            <T>{showForm ? 'Abort Entry' : 'Enlist Agent'}</T>
          </Button>
        </motion.div>
      </motion.div>

      {/* 2. ENLISTMENT FORM */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="overflow-hidden">
            <Card className={cn("border-none shadow-6xl rounded-[4rem] overflow-hidden mb-12 relative border-t border-white/10", theme === 'dark' ? "bg-slate-900/60 backdrop-blur-3xl" : "bg-white")}>
              <motion.div animate={{ y: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-40 w-full pointer-events-none" />
              
              <CardHeader className="p-12 border-b border-white/5 bg-primary/5">
                <CardTitle className="text-[15px] font-black uppercase tracking-[0.4em] flex items-center gap-5 text-primary">
                  <ShieldCheck className="h-7 w-7" /> <T>Agent Onboarding Protocol</T>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Legal Identity</T></Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Agent Full Name" className={cn("h-16 rounded-[1.5rem] border-none font-bold text-sm px-6 shadow-inner", theme === 'dark' ? "bg-slate-950 text-white focus:ring-2 focus:ring-primary/20" : "bg-slate-100/50")} />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Home Sector Node</T></Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className={cn("h-16 rounded-[1.5rem] border-none font-black text-[11px] uppercase px-6 shadow-inner", theme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-100/50")}>
                        <SelectValue placeholder="Select Grid Node" />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl border-none shadow-6xl backdrop-blur-3xl">
                        {WARDS.map(w => <SelectItem key={w} value={w} className="font-bold py-4 focus:bg-primary/10"><T>{w}</T></SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Operational Windows (Weekly)</T></Label>
                  <div className="flex flex-wrap gap-4">
                    {DAYS.map(d => (
                      <motion.button key={d} whileHover={{ scale: 1.1 }} onClick={() => toggleDay(d)} className={cn("w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-[11px] font-black transition-all border shadow-sm", avail.includes(d) ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30' : theme === 'dark' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-200')}>
                        <T>{d.slice(0, 3).toUpperCase()}</T>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><T>Certified Specializations</T></Label>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {SKILLS.map(s => (
                      <motion.button key={s} whileHover={{ scale: 1.05 }} onClick={() => toggleSkill(s)} className={cn("px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border", skills.includes(s) ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30' : theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-white text-slate-600')}>
                        <T>{s}</T>
                      </motion.button>
                    ))}
                  </div>
                  <div className="relative max-w-md">
                    <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input value={customSkill} onChange={e => setCustomSkill(e.target.value)} placeholder="Custom Specialization" className={cn("h-16 pl-14 rounded-[1.5rem] border-dashed border-2 font-bold text-sm", theme === 'dark' ? "bg-slate-950/50 border-slate-700 text-white" : "bg-white border-slate-300")} />
                  </div>
                </div>

                <div className={cn("flex flex-col md:flex-row items-center justify-between p-10 rounded-[3rem] border-2", theme === 'dark' ? "bg-slate-950/50 border-white/5" : "bg-slate-100/50 border-slate-200")}>
                  <div className="flex items-center gap-8">
                    {/* 🛡️ FIX: Mobility slide high-contrast ring for light mode visibility */}
                    <Switch checked={hasTransport} onCheckedChange={setHasTransport} className="scale-125 data-[state=checked]:bg-primary ring-1 ring-slate-400 dark:ring-0" />
                    <div>
                      <p className={cn("text-lg font-black uppercase", theme === 'dark' ? "text-white" : "text-slate-900")}><T>Mobility Access</T></p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1 opacity-60"><T>Available for logistics missions</T></p>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} className="h-16 px-14 bg-primary text-white font-black uppercase rounded-[1.5rem] shadow-3xl shadow-primary/40">
                    <T>Register Tactical Node</T>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutGroup>
        <Tabs defaultValue="directory" className="w-full">
          <TabsList className={cn("p-2 rounded-[1.8rem] h-16 mb-12", theme === 'dark' ? "bg-slate-900/80 border border-white/5" : "bg-slate-200/50")}>
            <TabsTrigger value="directory" className={cn("px-12 rounded-2xl font-black text-[11px] uppercase transition-all data-[state=active]:bg-primary data-[state=active]:text-white", theme === 'dark' ? "text-slate-100" : "text-slate-500")}><T>Active Directory</T></TabsTrigger>
            <TabsTrigger value="leaderboard" className={cn("px-12 rounded-2xl font-black text-[11px] uppercase transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950", theme === 'dark' ? "text-white !opacity-100" : "text-slate-600")}><T>Impact Ranking</T></TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="mt-0 outline-none">
            <motion.div variants={containerVars} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {volunteers.map((v) => (
                <motion.div key={v.id} variants={itemVars} whileHover={{ y: -15, scale: 1.02 }}>
                  <Card className={cn("border-none shadow-5xl rounded-[3.8rem] overflow-hidden group transition-all duration-500 relative pb-20", theme === 'dark' ? "bg-slate-900/40 hover:bg-slate-900 border border-white/5" : "bg-white")}>
                    <CardContent className="p-10 space-y-9">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-7">
                          <Avatar className="h-20 w-20 border-[6px] border-white dark:border-slate-800 shadow-4xl ring-2 ring-primary/20 transition-transform duration-500 group-hover:rotate-12">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-blue-800 text-white font-black italic text-2xl">{v.avatar || v.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={cn("font-black uppercase tracking-tight text-xl", theme === 'dark' ? "text-white" : "text-slate-900")}><T>{v.name}</T></p>
                            <div className="text-[10px] font-black flex items-center gap-2.5 mt-3 uppercase tracking-widest text-primary"><MapPin className="h-4 w-4" /> <T>{v.location}</T></div>
                          </div>
                        </div>
                        <Badge className="bg-primary/20 text-primary border border-primary/20 text-[10px] font-black px-4 py-2 rounded-full uppercase italic"><T>{v.tasksCompleted}</T> <T>Missions</T></Badge>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {v.skills.map(s => <span key={s} className="px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl text-[10px] font-black uppercase group-hover:bg-primary/10 transition-colors"><T>{s}</T></span>)}
                      </div>
                      <div className={cn("flex items-center justify-between text-[10px] font-black uppercase border-t border-white/5 pt-8", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                        <span className="flex items-center gap-3 italic"><Calendar className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} /> <T>{v.availability.length}</T> <T>Operational Nodes</T></span>
                        {v.hasTransport && <span className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ color: 'hsl(var(--primary))', background: 'hsla(var(--primary), 0.05)' }}><Car className="h-5 w-5 animate-bounce" /> <T>Mobility Link</T></span>}
                      </div>
                    </CardContent>

                    {/* 🛡️ CENTERED DELETE BUTTON: Positioned specifically to avoid text overlay */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVolunteer?.(v.id)} 
                        className="rounded-xl px-8 h-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> <T>Terminate Node</T>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0 outline-none">
            <Card className={cn("border-none shadow-6xl rounded-[4rem] overflow-hidden border-t border-white/5 shadow-slate-100", theme === 'dark' ? "bg-slate-900/40 backdrop-blur-3xl" : "bg-white")}>
              <CardContent className="p-12 space-y-8">
                {leaderboard.map((v, i) => (
                  <motion.div key={v.id} variants={itemVars} initial="hidden" animate="visible" className={cn("flex items-center gap-10 p-8 rounded-[3rem] border transition-all", theme === 'dark' ? "bg-slate-950/50 border-white/5 hover:bg-primary/10" : "bg-slate-50 border-transparent hover:bg-white shadow-sm")}>
                    <div className="font-black text-6xl w-28 text-center italic opacity-10 transition-all" style={{ color: 'hsl(var(--primary))' }}><T>{String(i + 1).padStart(2, '0')}</T></div>
                    <Avatar className="h-16 w-16 shadow-2xl border-4 border-white dark:border-slate-700 group-hover:scale-110 transition-transform">
                      <AvatarFallback className="bg-primary text-white text-lg font-black italic">{v.avatar || v.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className={cn("font-black uppercase tracking-tight text-2xl flex items-center gap-5", theme === 'dark' ? "text-white" : "text-slate-900")}><T>{v.name}</T>{i < 3 && <Star className="h-6 w-6 fill-amber-400 text-amber-400 animate-pulse" />}</div>
                      <p className="text-[12px] font-bold text-slate-500 uppercase mt-2 opacity-60"><T>{v.location}</T></p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-5" style={{ color: 'hsl(var(--primary))' }}><Trophy className="h-8 w-8" /> <span className="font-black text-5xl tracking-tighter italic leading-none"><T>{v.tasksCompleted}</T></span></div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LayoutGroup>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-6xl { box-shadow: 0 50px 100px -25px rgba(0,0,0,0.85); }
        .shadow-5xl { box-shadow: 0 40px 80px -20px rgba(0,0,0,0.7); }
        .shadow-4xl { box-shadow: 0 20px 60px -10px rgba(0,0,0,0.6); }
      `}} />
    </div>
  );
}