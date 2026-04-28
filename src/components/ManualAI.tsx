import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Send, BrainCircuit, Loader2, 
  Zap, Coffee, Sun, Moon, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Change this to your environment variable name
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an emergency medical/safety assistant. Analyze this: "${message}". Provide: 1. Situation Summary, 2. DO steps (Immediate actions), 3. DON'T steps (Warnings). Keep it concise and high-priority.`
            }]
          }]
        })
      });

      const data = await response.json();

      // Handle safety blocks or API errors
      if (data.error) return `Error: ${data.error.message}`;
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      return "I cannot provide specific instructions for this. Please call emergency services immediately.";
    } catch (err) {
      return "Network error. If this is a life-threatening emergency, call local authorities now.";
    }
  };

  const processCommand = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setIsThinking(true);
    setInput('');

    // Let Gemini handle everything—it's better at math and nuances than basic regex
    const response = await processEmergencyWithAI(trimmed);

    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsThinking(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <Card className={cn(
      "flex flex-col h-[600px] w-full max-w-2xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl",
      theme === 'dark' ? "bg-[#0a0c10] border-slate-800" : "bg-white border-slate-200"
    )}>
      
      {/* HEADER */}
      <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <BrainCircuit className={cn("h-5 w-5 text-blue-400", isThinking && "animate-pulse")} />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight uppercase">Intelligence Hub</h2>
            <p className="text-[10px] text-blue-300 font-mono">SYSTEM READY</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
            <Zap className="h-4 w-4 text-yellow-400" />
        </div>
      </div>

      {/* CHAT AREA */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                m.role === 'user'
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
              )}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is analyzing situation...
          </div>
        )}
        <div ref={scrollRef} />
      </CardContent>

      {/* INPUT AREA */}
      <div className="p-4 bg-slate-50 dark:bg-black/40 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            processCommand(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'Bleeding', 'Fire', or 'How to perform CPR'..."
            className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            disabled={isThinking}
          />
          <Button 
            type="submit" 
            disabled={isThinking || !input.trim()}
            className="rounded-xl px-5"
          >
            {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <p className="text-[9px] text-center mt-3 text-slate-500 flex items-center justify-center gap-1">
          <AlertTriangle className="h-3 w-3 text-amber-500" /> 
          AI advice is for informational purposes. Always call professional emergency services.
        </p>
      </div>
    </Card>
  );
}