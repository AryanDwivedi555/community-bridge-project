import { useState } from 'react';
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
import { Plus, Trophy, MapPin, Car, Calendar, UserPlus, Star, ChevronRight, ShieldCheck, Activity, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Volunteers() {
  const { volunteers, addVolunteer, theme } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [hasTransport, setHasTransport] = useState(false);

  const leaderboard = [...volunteers].sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const handleSubmit = () => {
    if (!name || !location || skills.length === 0) {
      toast.error("Protocol Error", { description: "Agent credentials incomplete." });
      return;
    }
    
    addVolunteer({ 
      name, 
      skills, 
      availability: avail, 
      location, 
      hasTransport,
      tasksCompleted: 0,
    });

    toast.success("Agent Enlisted", { description: `${name} integrated into National Grid.` });
    setShowForm(false);
    setName(''); setSkills([]); setAvail([]); setLocation(''); setHasTransport(false);
  };

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDay = (d: string) => setAvail(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className={cn(
      "space-y-10 pb-12 transition-colors duration-500",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      
      {/* 1. TACTICAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Response Agents</h1>
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse" /> National Volunteer Telemetry Directory
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className={cn(
            "h-14 px-8 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
            showForm ? "bg-slate-800 text-white" : "bg-primary text-white shadow-primary/20 hover:bg-slate-900"
          )}
        >
          {showForm ? <Plus className="h-5 w-5 mr-3 rotate-45 transition-transform" /> : <UserPlus className="h-5 w-5 mr-3" />}
          {showForm ? 'Abort Entry' : 'Enlist Agent'}
        </Button>
      </div>

      {/* 2. ENLISTMENT FORM (Zero Trimming - Preserved Logic) */}
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
                  <ShieldCheck className="h-5 w-5" /> Agent Onboarding Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Identity</Label>
                    <Input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Agent Full Name" 
                      className={cn(
                        "h-14 rounded-2xl border-none font-bold text-xs px-5 shadow-inner",
                        theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-50"
                      )} 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Home Sector Node</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className={cn(
                        "h-14 rounded-2xl border-none font-black text-[10px] uppercase px-5 shadow-inner",
                        theme === 'dark' ? "bg-slate-800 text-white" : "bg-slate-50"
                      )}>
                        <SelectValue placeholder="Select Grid Node" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">{WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Certified Specializations</Label>
                  <div className="flex flex-wrap gap-3">
                    {SKILLS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm",
                          skills.includes(s) 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                            : theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700 hover:border-primary/50' : 'bg-white text-slate-600 border-slate-100 hover:border-primary/50'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Windows (Weekly)</Label>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map(d => (
                      <button
                        key={d}
                        onClick={() => toggleDay(d)}
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all border shadow-sm",
                          avail.includes(d) 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                            : theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-500/30'
                        )}
                      >
                        {d.slice(0, 3).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn(
                    "flex flex-col md:flex-row items-center justify-between p-8 rounded-[2rem] border transition-all",
                    theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"
                )}>
                  <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <Switch checked={hasTransport} onCheckedChange={setHasTransport} className="data-[state=checked]:bg-primary" />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">Mobility Access</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Available for logistics & transport missions</p>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} className="h-14 px-10 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:bg-slate-950 active:scale-95 transition-all">
                    Register Tactical Node
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className={cn(
          "p-1.5 rounded-2xl h-14 mb-8",
          theme === 'dark' ? "bg-slate-900" : "bg-slate-100/50"
        )}>
          <TabsTrigger value="directory" className="px-10 rounded-xl font-black text-[10px] uppercase tracking-widest">Active Directory</TabsTrigger>
          <TabsTrigger value="leaderboard" className="px-10 rounded-xl font-black text-[10px] uppercase tracking-widest">Impact Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteers.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className={cn(
                  "border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300",
                  theme === 'dark' ? "bg-slate-900" : "bg-white"
                )}>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-5">
                        <Avatar className="h-16 w-16 border-4 border-white dark:border-slate-800 shadow-2xl ring-2 ring-primary/20">
                          <AvatarFallback className="bg-primary text-white font-black italic text-lg">{v.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={cn("font-black uppercase tracking-tight text-lg leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}>{v.name}</p>
                          <p className="text-[10px] font-black text-slate-400 flex items-center gap-2 mt-2 uppercase tracking-widest">
                            <MapPin className="h-3.5 w-3.5 text-primary" /> {v.location}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-3 py-1 uppercase tracking-widest italic">{v.tasksCompleted} Missions</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {v.skills.map(s => (
                        <span key={s} className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className={cn(
                        "flex items-center justify-between text-[9px] font-black uppercase tracking-widest border-t pt-6",
                        theme === 'dark' ? "border-slate-800" : "border-slate-50"
                    )}>
                      <span className="flex items-center gap-2 text-slate-400 italic">
                        <Calendar className="h-4 w-4 text-primary" /> {v.availability.length} Operational Nodes
                      </span>
                      {v.hasTransport && (
                        <span className="flex items-center gap-2 text-emerald-500">
                          <Car className="h-4 w-4" /> Mobility Link
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0 outline-none">
          <Card className={cn(
            "border-none shadow-2xl rounded-[3rem] overflow-hidden",
            theme === 'dark' ? "bg-slate-900" : "bg-white"
          )}>
            <CardContent className="p-8 space-y-4">
              {leaderboard.map((v, i) => (
                <motion.div 
                  key={v.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-6 p-6 rounded-[2rem] border transition-all group",
                    theme === 'dark' ? "bg-slate-800/30 border-slate-800 hover:bg-slate-800" : "bg-slate-50 border-transparent hover:bg-white hover:shadow-xl hover:border-slate-100"
                  )}
                >
                  <div className="font-black text-4xl w-16 text-center italic opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <Avatar className="h-12 w-12 shadow-lg ring-2 ring-white dark:ring-slate-700">
                    <AvatarFallback className="bg-primary text-white text-sm font-black italic">{v.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-black uppercase tracking-tight text-sm flex items-center gap-3", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {v.name}
                      {i < 3 && <Star className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.location}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 text-primary">
                      <Trophy className="h-5 w-5" />
                      <span className="font-black text-3xl tracking-tighter italic leading-none">{v.tasksCompleted}</span>
                    </div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Impact Analytics</p>
                  </div>
                  <div className="hidden sm:flex h-10 w-10 rounded-full items-center justify-center bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}