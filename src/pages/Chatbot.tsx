import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  CheckCircle, ShieldCheck, Search, Activity, Lock, Clock, Bot, Zap, 
  Fingerprint, Terminal, Cpu, AlertTriangle, Users, MapPin, 
  CheckCircle2, History, X, Send, ShieldAlert, Phone, Mail, 
  FileText, Star, Trophy, ArrowRight, ShieldQuestion, Loader2, Camera,
  Map as MapIcon, Crosshair, Navigation, Target, Locate
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T } from '@/components/T'; 
import FieldMap from '@/components/FieldMap';

export default function VerificationSystem() {
  const { needs, resolveNeed, theme, acceptNeed, addNeed } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("report");
  
  const [otpInputs, setOtpInputs] = useState<Record<string, string[]>>({});
  const otpRefs = useRef<Record<string, (HTMLInputElement | null)[]>>({});

  const [isReporting, setIsReporting] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '',
    category: 'food', customCategory: '', title: '', description: '', affected: 1,
    lat: 25.5941, lng: 85.1376 
  });

  // --- GPS NEURAL TRACKING ---
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast.error(<T>Hardware Error</T>, { description: <T>Geolocation not supported by this node.</T> });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          location: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        });
        toast.success(<T>Coordinates Locked</T>, { description: <T>GPS Telemetry integrated.</T> });
        setIsLocating(false);
      },
      () => {
        toast.error(<T>Signal Lost</T>, { description: <T>Unable to retrieve current coordinates.</T> });
        setIsLocating(false);
      }
    );
  };

  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  const refreshCaptcha = () => setCaptcha({ a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 10) + 1 });
  useEffect(() => { refreshCaptcha(); }, []);

  const calculateAIUrgency = (affected: number, category: string) => {
    let level = 1;
    if (affected > 50) level = 5;
    else if (affected > 20) level = 4;
    else if (affected > 10) level = 3;
    else if (affected > 5) level = 2;
    if (['medical', 'security', 'water leakage'].includes(category)) level = Math.min(5, level + 1);
    return level;
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaInput) !== captcha.a + captcha.b) {
      toast.error(<T>Identity Check Failed</T>);
      return;
    }
    
    // FIXED: Added OTP generation for mission verification
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const finalCategory = formData.category === 'custom' ? formData.customCategory : formData.category;
    const urgency = calculateAIUrgency(formData.affected, finalCategory);
    
    addNeed({
      needType: finalCategory,
      description: `${formData.title}: ${formData.description}`,
      location: formData.location,
      urgency: urgency,
      peopleAffected: formData.affected,
      lat: formData.lat,
      lng: formData.lng,
      contact: { name: formData.name, email: formData.email, phone: formData.phone },
      otp: generatedOtp // Crucial for Verification phase
    } as any);

    toast.success(<T>Tactical Uplink Success</T>, { 
      description: `Verification Code: ${generatedOtp} (In production, this is sent via SMS)`
    });
    
    setActiveTab("pending");
    setFormData({ name: '', email: '', phone: '', location: '', category: 'food', customCategory: '', title: '', description: '', affected: 1, lat: 25.5941, lng: 85.1376 });
    setCaptchaInput("");
    refreshCaptcha();
  };

  const handleOtpChange = (missionId: string, index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const currentOtp = otpInputs[missionId] || ["", "", "", ""];
    const newOtp = [...currentOtp];
    newOtp[index] = value.slice(-1);
    setOtpInputs({ ...otpInputs, [missionId]: newOtp });
    if (value && index < 3) otpRefs.current[missionId]?.[index + 1]?.focus();
  };

  const handleOtpKeyDown = (missionId: string, index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInputs[missionId]?.[index] && index > 0) {
      otpRefs.current[missionId]?.[index - 1]?.focus();
    }
  };

  const MissionCard = ({ need, status }: { need: any, status: string }) => (
    <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={cn(
      "p-10 rounded-[4rem] border-2 transition-all mb-8 group relative overflow-hidden",
      theme === 'dark' ? "bg-slate-900/80 border-white/10 shadow-2xl" : "bg-white border-slate-100 shadow-xl"
    )}>
      <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <Badge className={cn("text-lg font-black px-6 py-2 italic rounded-2xl", need.urgency >= 4 ? "bg-red-500" : "bg-primary")}>LVL {need.urgency}</Badge>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-primary/5 px-5 py-2 rounded-full border border-primary/10">{need.id}</span>
          </div>
          <h3 className={cn("text-4xl font-black uppercase italic tracking-tighter leading-tight transition-colors", theme === 'dark' ? "text-white" : "text-slate-900")}>
            <T>{need.needType}</T> — <span className="text-primary"><T>{need.location}</T></span>
          </h3>
          <p className={cn("text-lg font-bold opacity-80 leading-relaxed max-w-3xl", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>{need.description}</p>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col justify-center gap-6">
          {status === 'pending' && (
            <Button onClick={() => acceptNeed(need.id, 'Aryan Command')} className="w-full h-20 rounded-[2rem] bg-primary hover:bg-slate-950 font-black uppercase tracking-[0.3em] text-sm shadow-glow shadow-primary/40 text-white">
              <Zap className="mr-3 h-6 w-6" /> <T>Accept Mission</T>
            </Button>
          )}
          {status === 'assigned' && (
            <div className="space-y-6">
              <div className="flex justify-between gap-4">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={el => {
                      if (!otpRefs.current[need.id]) otpRefs.current[need.id] = [];
                      otpRefs.current[need.id][idx] = el;
                    }}
                    type="text" maxLength={1}
                    className={cn(
                        "w-16 h-20 border-2 rounded-2xl text-center text-3xl font-black focus:border-primary transition-all outline-none",
                        theme === 'dark' ? "bg-slate-950 border-white/20 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    )}
                    value={otpInputs[need.id]?.[idx] || ""}
                    onChange={e => handleOtpChange(need.id, idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(need.id, idx, e)}
                  />
                ))}
              </div>
              <Button onClick={() => resolveNeed(need.id, (otpInputs[need.id] || []).join(''))} className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest text-white">
                <ShieldCheck className="mr-3" /> <T>Verify & Close</T>
              </Button>
            </div>
          )}
          {status === 'resolved' && (
            <div className="text-center py-8 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20">
               <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
               <p className="text-sm font-black text-emerald-500 uppercase italic tracking-widest"><T>Mission Successful</T></p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={cn("min-h-screen p-6 lg:p-12 transition-colors duration-500", theme === 'dark' ? "bg-[#020617]" : "bg-slate-50")}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col xl:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="h-24 w-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-glow animate-pulse"><Cpu className="text-white h-12 w-12" /></div>
            <h2 className={cn("text-6xl font-black uppercase italic tracking-tighter leading-none transition-colors", theme === 'dark' ? "text-white" : "text-slate-900")}>
              <T>Intelligence</T> <span className="text-primary">HUB</span>
            </h2>
          </div>
          <TabsList className={cn("p-2 h-20 rounded-[2.5rem] transition-all", theme === 'dark' ? "bg-slate-900 border border-white/10" : "bg-slate-200")}>
            {['report', 'pending', 'assigned', 'completed'].map(t => (
              <TabsTrigger key={t} value={t} className={cn(
                  "rounded-[1.8rem] px-10 font-black text-[10px] uppercase tracking-[0.3em] transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-white",
                  theme === 'dark' ? "text-slate-400" : "text-slate-500"
              )}>
                <T>{t}</T>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="report" className="outline-none">
          <Card className={cn("border-none shadow-7xl rounded-[4rem] overflow-hidden", theme === 'dark' ? "bg-slate-900/60" : "bg-white")}>
            <CardContent className="p-12 lg:p-20 space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-2">Contact Phone (For SMS OTP)</Label>
                      <Input value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXX" className={cn("h-16 rounded-2xl px-6 font-black text-sm", theme === 'dark' ? "bg-slate-950 border-white/20 text-white" : "bg-slate-100 border-slate-200 text-slate-900")} />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-2">Contact Email (For Backup)</Label>
                      <Input value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="agent@grid.com" className={cn("h-16 rounded-2xl px-6 font-black text-sm", theme === 'dark' ? "bg-slate-950 border-white/20 text-white" : "bg-slate-100 border-slate-200 text-slate-900")} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-2">Operational Sector / Manual Address</Label>
                    <div className="flex gap-4">
                      <Input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="Workspace or Home Address" className={cn("h-16 rounded-2xl font-black px-6 flex-1", theme === 'dark' ? "bg-slate-950 border-white/20 text-white" : "bg-slate-100 border-none text-slate-900")}/>
                      <Button onClick={handleGetCurrentLocation} disabled={isLocating} className="h-16 w-16 rounded-2xl bg-emerald-500 shadow-lg text-white">
                        {isLocating ? <Loader2 className="animate-spin" /> : <Locate size={24}/>}
                      </Button>
                      <Button onClick={()=>setShowMapSelector(true)} className="h-16 px-8 rounded-2xl bg-primary shadow-glow text-white"><MapIcon size={24}/></Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-2">Grid Category</Label>
                      <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className={cn("w-full h-16 rounded-2xl px-6 font-black text-sm uppercase outline-none border-2 transition-all", theme === 'dark' ? "bg-slate-950 border-white/20 text-white focus:border-primary" : "bg-slate-100 border-slate-200 text-slate-900")}>
                        {['food', 'water leakage', 'electricity', 'road', 'medical', 'security', 'custom'].map(c=><option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                    </div>
                    {formData.category === 'custom' && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <Label className="text-xs font-black uppercase text-primary tracking-widest ml-2">Specify Custom Problem</Label>
                        <Input value={formData.customCategory} onChange={e=>setFormData({...formData, customCategory: e.target.value})} placeholder="E.G. GAS LEAK" className={cn("h-16 rounded-2xl font-black text-sm", theme === 'dark' ? "bg-slate-800 text-white border-primary/40" : "bg-slate-100 text-slate-900")} />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-2">Telemetry Description</Label>
                    <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className={cn("w-full h-40 rounded-[2rem] p-8 font-bold text-lg outline-none border-2 transition-all", theme === 'dark' ? "bg-slate-950 border-white/20 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
                  </div>
                </div>
              </div>

              {/* CAPTCHA & SUBMIT */}
              <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-8 p-8 bg-slate-950 rounded-[2.5rem] border border-white/10 shadow-inner">
                  <div className="flex items-center gap-4"><Fingerprint className="text-primary h-8 w-8" /><span className="text-xl font-black text-white italic">Verify: {captcha.a} + {captcha.b} = </span></div>
                  <input value={captchaInput} onChange={e=>setCaptchaInput(e.target.value)} className="w-24 h-16 bg-white/10 border-none text-center font-black text-primary text-3xl rounded-xl" />
                </div>
                <Button onClick={handleReportSubmit} className="h-24 px-20 bg-primary hover:bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-lg shadow-glow shadow-primary/40">
                  <Send className="mr-4 h-6 w-6" /> <T>Uplink Mission</T>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6 outline-none">
          {needs.filter(n => n.status === 'pending').map(n => <MissionCard key={n.id} need={n} status="pending" />)}
        </TabsContent>
        <TabsContent value="assigned" className="space-y-6 outline-none">
          {needs.filter(n => n.status === 'assigned').map(n => <MissionCard key={n.id} need={n} status="assigned" />)}
        </TabsContent>
        <TabsContent value="completed" className="space-y-6 outline-none">
          {needs.filter(n => n.status === 'resolved').map(n => <MissionCard key={n.id} need={n} status="resolved" />)}
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {showMapSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-xl p-10 flex items-center justify-center">
            <div className="w-full max-w-6xl h-[80vh] bg-slate-900 rounded-[4rem] overflow-hidden relative border border-white/10 shadow-7xl">
              <FieldMap /> 
              <div className="absolute top-10 left-10 z-10 flex gap-4">
                <Button onClick={()=>setShowMapSelector(false)} className="bg-red-500 rounded-2xl h-14 px-8 font-black uppercase text-xs text-white">Abort</Button>
                <Button onClick={()=>setShowMapSelector(false)} className="bg-emerald-500 rounded-2xl h-14 px-8 font-black uppercase text-xs text-white">Confirm Node Location</Button>
              </div>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center"><Crosshair size={48} className="text-primary animate-pulse" /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-7xl { box-shadow: 0 50px 150px -30px rgba(0,0,0,0.7); }
        .shadow-glow { box-shadow: 0 0 30px hsla(var(--primary),0.6); }
        select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1.5rem center; background-size: 1.5rem; }
      `}} />
    </div>
  );
}