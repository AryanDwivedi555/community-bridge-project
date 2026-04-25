import { useApp } from '@/contexts/AppContext';
import { SKILL_TO_NEED } from '@/lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Car, Calendar, Star, CheckCircle2, MessageSquare, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  needId: string;
  onClose: () => void; 
}

export function VolunteerMatchDialog({ needId, onClose }: Props) {
  const { needs, volunteers, theme } = useApp();
  const need = needs.find(n => n.id === needId);
  
  if (!need) return null;

  const relevantSkills = SKILL_TO_NEED[need.needType] || [];

  /**
   * ELITE HEURISTIC MATCHING ENGINE (V2)
   * Calculates score based on GPS Coordinates + Professional Skills
   */
  const scored = volunteers.map(v => {
    let score = 0;
    
    // 1. Skill Alignment (Primary Weight: 4x)
    const skillMatchCount = v.skills.filter(s => relevantSkills.includes(s)).length;
    score += skillMatchCount * 4;
    
    // 2. Geospatial Proximity (National Grid Logic)
    // Calculate distance delta - closer volunteers get higher priority
    const distanceDelta = Math.sqrt(Math.pow(v.lat - need.lat, 2) + Math.pow(v.lng - need.lng, 2));
    if (distanceDelta < 0.05) score += 10; // Extreme Proximity
    else if (distanceDelta < 0.2) score += 5; // Regional Proximity
    
    // 3. Logistics & Infrastructure Bonus
    if (v.hasTransport) score += 2;
    
    // 4. Operational Capacity
    score += Math.min(v.availability.length, 3);
    
    return { volunteer: v, score, skillMatch: skillMatchCount > 0, dist: distanceDelta.toFixed(2) };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden transition-colors duration-500",
        theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      )}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Neural Match Engine</span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">Top Matched Agents</DialogTitle>
          <DialogDescription className={cn(
            "text-xs font-bold leading-relaxed",
            theme === 'dark' ? "text-slate-400" : "text-slate-500"
          )}>
            Optimized for <span className="text-primary font-black uppercase tracking-widest">{need.needType}</span> mission parameters in {need.location}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {scored.map(({ volunteer: v, score, skillMatch }, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, ease: "easeOut" }}
            >
              <Card className={cn(
                "border-none shadow-lg transition-all duration-300 rounded-[1.5rem] overflow-hidden group hover:scale-[1.02]",
                theme === 'dark' ? "bg-slate-800/50 hover:bg-slate-800" : "bg-slate-50 hover:bg-white hover:shadow-primary/5"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-5">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-primary/20 ring-4 ring-primary/5">
                        <AvatarFallback className="bg-primary text-white font-black italic">{v.avatar}</AvatarFallback>
                      </Avatar>
                      {i === 0 && (
                        <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5 shadow-xl border-2 border-white dark:border-slate-800">
                          <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                           <p className={cn("font-black uppercase tracking-tight text-sm", theme === 'dark' ? "text-white" : "text-slate-900")}>{v.name}</p>
                           <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Agent Verified</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black italic">SCORE: {score}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {v.skills.map(s => (
                          <Badge 
                            key={s} 
                            variant="outline"
                            className={cn(
                              "text-[9px] px-2 py-0.5 font-black uppercase tracking-widest transition-colors",
                              relevantSkills.includes(s) 
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                : theme === 'dark' ? 'text-slate-500 border-slate-700' : 'text-slate-400 border-slate-200'
                            )}
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>

                      <div className={cn(
                        "flex items-center justify-between mt-5 pt-4 border-t",
                        theme === 'dark' ? "border-slate-700" : "border-slate-100"
                      )}>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <Target className="h-3 w-3 text-primary" /> Sector Node: {v.location}
                           </span>
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <Activity className="h-3 w-3 text-emerald-500" /> Availability: {v.availability.length} Nodes
                           </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-primary text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                        >
                          Dispatch
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className={cn(
          "mt-6 pt-5 border-t text-center",
          theme === 'dark' ? "border-slate-800" : "border-slate-100"
        )}>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] leading-relaxed italic">
            MATCHING ALGORITHM V2.4: GPS PROXIMITY + SKILLSET CLUSTERING + LOGISTICAL TELEMETRY.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}