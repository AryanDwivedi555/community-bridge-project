import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/contexts/AppContext';
import { 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  Users, 
  FileText, 
  Send, 
  Navigation,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NEED_TYPES, WARDS } from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// 1. TACTICAL VALIDATION SCHEMA
const formSchema = z.object({
  needType: z.string().min(1, "Sector must be identified"),
  location: z.string().min(1, "Deployment ward required"),
  description: z.string().min(10, "Intelligence payload too short"),
  urgency: z.string().min(1, "Priority level required"),
  peopleAffected: z.coerce.number().min(1, "Impact count must be > 0"),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

export default function ReportForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addNeed, theme } = useApp();
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultOptions: {
      needType: "",
      location: "",
      description: "",
      urgency: "3",
      peopleAffected: 1,
    },
  });

  // 2. GEOSPATIAL TELEMETRY FETCH
  const getGPSLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue('lat', pos.coords.latitude);
        form.setValue('lng', pos.coords.longitude);
        setIsLocating(false);
        toast.success("GPS Uplink Established", { description: "Coordinates injected into report payload." });
      },
      () => {
        setIsLocating(false);
        toast.error("GPS Fail", { description: "Permission denied or signal lost." });
      }
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const reportData = {
      ...values,
      id: `MISSION-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      syncStatus: 'synced' as const,
      urgency: parseInt(values.urgency),
    };

    addNeed(reportData);
    toast.success("Report Synchronized", {
      description: `Mission Node ${reportData.id} is now live on the National Grid.`,
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
    });
    
    form.reset();
    if (onSuccess) onSuccess();
  };

  return (
    <Card className={cn(
      "border-none shadow-2xl rounded-[3rem] overflow-hidden",
      theme === 'dark' ? "bg-slate-900" : "bg-white"
    )}>
      <div className="bg-primary p-8 flex items-center justify-between">
        <div>
          <h2 className="text-white font-black uppercase italic tracking-tighter text-xl">New Mission Report</h2>
          <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Grid Injection Protocol v4.0</p>
        </div>
        <Zap className="text-white/20 h-10 w-10" />
      </div>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SECTOR SELECTOR */}
              <FormField
                control={form.control}
                name="needType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Sector</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-2xl h-12 border-slate-200 dark:border-slate-800 bg-transparent">
                          <SelectValue placeholder="Identify Sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NEED_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[9px] uppercase font-bold" />
                  </FormItem>
                )}
              />

              {/* WARD SELECTOR */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deployment Ward</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-2xl h-12 border-slate-200 dark:border-slate-800 bg-transparent">
                          <SelectValue placeholder="Select Ward" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DESCRIPTION PAYLOAD */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Intelligence Payload</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the mission requirements in detail..." 
                      className="rounded-2xl min-h-[100px] border-slate-200 dark:border-slate-800 bg-transparent resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* IMPACT COUNT */}
               <FormField
                control={form.control}
                name="peopleAffected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                       <Users className="h-3 w-3" /> Impact Radius
                    </FormLabel>
                    <FormControl>
                      <Input type="number" className="rounded-2xl h-12 border-slate-200 dark:border-slate-800 bg-transparent font-bold" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* URGENCY SELECTOR */}
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Priority (1-5)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-2xl h-12 border-slate-200 dark:border-slate-800 bg-transparent">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['1','2','3','4','5'].map(lv => <SelectItem key={lv} value={lv}>Level {lv}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* GPS TRIGGER */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Geospatial Uplink</label>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={getGPSLocation}
                  disabled={isLocating}
                  className="h-12 rounded-2xl border-dashed border-2 border-primary/30 text-primary hover:bg-primary/5 font-black uppercase text-[9px] tracking-widest"
                >
                  <Navigation className={cn("mr-2 h-3 w-3", isLocating && "animate-spin")} />
                  {isLocating ? "Syncing..." : "Inject GPS"}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-primary transition-all text-white font-black uppercase tracking-[0.3em] italic shadow-2xl active:scale-95"
            >
              <Send className="mr-3 h-5 w-5" /> Uplink Report to Grid
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}