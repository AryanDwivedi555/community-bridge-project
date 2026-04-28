import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Send, BrainCircuit, Loader2, 
  Zap, Coffee, Sun, Moon, AlertTriangle, Bot, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- 🧠 SIMPLE CLEAN FORMATTER (No heavy libraries needed) ---
const FormattedMessage = ({ text, role }: { text: string; role: string }) => {
  // Logic to make AI responses look like professional reports
  if (role === 'user') return <p>{text}</p>;

  return (
    <div className="space-y-3">
      {text.split('\n').map((line, i) => {
        // Render Headers (e.g., 1. Situation Summary)
        if (line.match(/^\d+\./) || line.includes('**')) {
          const cleanLine = line.replace(/\*\*/g, '');
          return <h4 key={i} className="font-black text-blue-500 uppercase tracking-tighter text-xs mt-4 mb-1">{cleanLine}</h4>;
        }
        // Render Bullet Points
        if (line.trim().startsWith('*')) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-blue-400">•</span>
              <p className="flex-1 text-slate-300">{line.replace(/^\*/, '').trim()}</p>
            </div>
          );
        }
        return <p key={i} className={cn(i === 0 ? "text-slate-100 font-medium italic" : "text-slate-300")}>{line}</p>;
      })}
    </div>
  );
};

export default function ManualAI() {
  const context = useApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!context) return null;
  const { theme } = context;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { msg: "Good Morning", icon: <Coffee className="h-4 w-4 text-amber-500" /> };
    if (hour < 17) return { msg: "Good Afternoon", icon: <Sun className="h-4 w-4 text-orange-500" /> };
    return { msg: "Good Evening", icon: <Moon className="h-4 w-4 text-indigo-400" /> };
  };

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `${getGreeting().msg}. Emergency Intelligence Assistant active. Please describe the situation.`
    }
  ]);

  const processEmergencyWithAI = async (message: string) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an emergency medical/safety assistant. Analyze this: "${message}". 
              Structure your response exactly like this:
              1. SITUATION SUMMARY: (Briefly explain)
              2. DO STEPS: (List actions with * bullets)
              3. DON'T STEPS: (List warnings with * bullets)
              Keep it extremely concise.`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.error) return `Error: ${data.error.message}`;
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I cannot provide specific instructions. Call emergency services.";
    } catch (err) {
      return "Network error. Call local authorities immediately.";
    }
  };

  const processCommand = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setIsThinking(true);
    setInput('');
    const response = await processEmergencyWithAI(trimmed);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsThinking(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <Card className={cn(
      "flex flex-col h-[700px] w-full max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500",
      theme === 'dark' ? "bg-slate-950 border-white/10 shadow-2xl" : "bg-white border-slate-200"
    )}>
      
      {/* HEADER */}
      <div className="p-6 bg-slate-900 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl">
            <BrainCircuit className={cn("h-6 w-6 text-blue-400", isThinking && "animate-pulse")} />
          </div>
          <div>
            <h2 className="font-black text-white italic uppercase tracking-tighter text-xl">Intelligence Hub</h2>
            <p className="text-[10px] text-blue-400 font-mono font-bold tracking-widest">TACTICAL ANALYTICS ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <Zap className="h-4 w-4 text-yellow-400" />
        </div>
      </div>

      {/* CHAT AREA */}
      <CardContent className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-xl border relative",
                m.role === 'user'
                  ? "bg-blue-600 text-white rounded-tr-none border-blue-400"
                  : "bg-slate-900 text-slate-100 rounded-tl-none border-white/10"
              )}>
                <div className="absolute -top-3 left-4 bg-slate-800 px-2 py-0.5 rounded text-[8px] font-black uppercase text-blue-400 border border-white/5">
                  {m.role === 'user' ? 'Local Agent' : 'Hub Intel'}
                </div>
                <FormattedMessage text={m.text} role={m.role} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 w-fit">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">Scanning Bio-Signs...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </CardContent>

      {/* INPUT AREA */}
      <div className="p-6 bg-slate-950 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); processCommand(input); }} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe emergency (e.g., 'Heavy bleeding on leg')..."
            className="flex-1 p-4 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
            disabled={isThinking}
          />
          <Button 
            type="submit" 
            disabled={isThinking || !input.trim()}
            className="rounded-2xl h-14 w-14 bg-blue-600 hover:bg-slate-950 transition-all border-b-4 border-blue-800 active:border-b-0"
          >
            {isThinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="text-[10px] text-center mt-4 text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <AlertTriangle className="h-3 w-3 text-amber-500" /> 
          Strategic Info Only — Contact Authorities Immediately
        </p>
      </div>
    </Card>
  );
}