import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Mic, Send, BrainCircuit, Sparkles, Loader2, 
  Terminal, Zap, ShieldCheck, Coffee, Sun, Moon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ManualAI() {
  const context = useApp();
  if (!context) return null;

  const { theme, needs, volunteers } = context;
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. TEMPORAL LOGIC (Greetings) ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { msg: "Good Morning", icon: <Coffee className="h-4 w-4 text-amber-500" /> };
    if (hour < 17) return { msg: "Good Afternoon", icon: <Sun className="h-4 w-4 text-orange-500" /> };
    return { msg: "Good Evening", icon: <Moon className="h-4 w-4 text-indigo-400" /> };
  };

  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: `${getGreeting().msg}, Aryan. Local Heuristic Engine is active. How can I assist with the platform telemetry today?` 
    }
  ]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // --- 2. THE LOCAL "SMART" ENGINE ---
  const processCommand = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsThinking(true);
    setInput('');

    // Simulate "Neural Processing" delay
    setTimeout(() => {
      let response = "";
      const cmd = text.toLowerCase();

      // LOGIC A: MATH/CALCULATIONS
      if (/[0-9]/.test(cmd) && /[\+\-\*\/\%]/.test(cmd)) {
        try {
          const calc = cmd.replace(/[^-()\d/*+.]/g, '');
          const result = eval(calc);
          response = `Calculation finalized: ${calc} = ${result}. Precision verified.`;
        } catch {
          response = "Mathematical syntax error. Please provide a clear numerical expression.";
        }
      }
      // LOGIC B: WEBSITE IMPORTANCE
      else if (cmd.includes('website') || cmd.includes('importance') || cmd.includes('purpose')) {
        response = "The platform's primary importance is optimizing response logistics. By using real-time GPS tracking and 4-digit OTP verification, we ensure 100% mission transparency and efficiency.";
      }
      // LOGIC C: GREETINGS & STATUS
      else if (cmd.includes('hi') || cmd.includes('hello') || cmd.includes('hey')) {
        response = `Hello, Aryan! Systems are nominal. We are currently tracking ${volunteers.length} active agents across ${needs.length} mission nodes. What is your next directive?`;
      }
      // LOGIC D: TIME-BASED CHECKS
      else if (cmd.includes('time') || cmd.includes('greeting')) {
        response = `Current status: ${getGreeting().msg}. The system is in 24/7 monitoring mode.`;
      }
      // FALLBACK
      else {
        response = "Command acknowledged. I am operating in local heuristic mode. For unlimited generative reasoning, re-enable the Gemini Uplink.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <Card className={cn(
      "flex flex-col h-full border-none shadow-2xl rounded-[3rem] overflow-hidden",
      theme === 'dark' ? "bg-[#0a0c10] border border-white/5" : "bg-white"
    )}>
      {/* TACTICAL HEADER */}
      <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
             <BrainCircuit className={cn("h-6 w-6 text-primary", isThinking && "animate-pulse")} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none text-primary">Chatbot</h2>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Local Heuristic Link</span>
            </div>
          </div>
        </div>
        <Zap className="h-5 w-5 text-primary animate-pulse" />
      </div>

      <CardContent className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        <AnimatePresence mode='popLayout'>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] p-5 text-[12px] font-bold leading-relaxed shadow-lg rounded-[2rem]", m.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none")}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-3 p-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Scanning Local Nodes...</span>
            </div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </CardContent>

      <div className="p-8 bg-black/20 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-[2rem] border bg-slate-950 border-white/10 focus-within:border-primary transition-all">
          <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
             <Terminal className="h-4 w-4 text-primary" />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && processCommand(input)}
            placeholder="Hi / Calculate / Website Info..."
            className="flex-1 bg-transparent outline-none px-2 text-[10px] font-black uppercase tracking-widest text-primary placeholder:text-slate-700"
          />
          <Button onClick={() => processCommand(input)} className="h-10 w-16 rounded-full bg-primary"><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </Card>
  );
}