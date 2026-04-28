import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NeedReport, Volunteer, NGO, mockNeeds, mockVolunteers, mockNGOs } from '@/lib/mockData';
import { toast } from 'sonner';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'bho' | 'mai' | 'mr' | 'es' | 'fr';
export type ThemeCode = 'onyx' | 'midnight' | 'matrix' | 'crimson' | 'cobalt' | 'amber' | 'violet';

/**
 * ELITE APP STATE INTERFACE
 * Standardized tactical data hub for Community Bridge.
 * NO FEATURES REMOVED. PERSISTENCE ENGINE HARDENED.
 */
interface AppState {
  needs: NeedReport[];
  volunteers: Volunteer[];
  ngos: NGO[];
  isOnline: boolean;
  syncingCount: number;
  language: LanguageCode;
  theme: ThemeCode;
  voiceAgent: {
    enabled: boolean;
    voiceIndex: number;
    rate: number;
    pitch: number;
  };
  toggleTheme: () => void;
  changeTheme: (theme: ThemeCode) => void;
  updateVoiceConfig: (config: Partial<AppState['voiceAgent']>) => void;
  changeLanguage: (lang: LanguageCode) => void;
  addNeed: (need: Omit<NeedReport, 'id' | 'createdAt' | 'status' | 'otp'>) => void;
  addVolunteer: (vol: Omit<Volunteer, 'id' | 'tasksCompleted' | 'avatar'>) => void;
  removeVolunteer: (id: string) => void; // 🛡️ NEW: TACTICAL TERMINATION LOGIC
  addNGO: (ngo: Omit<NGO, 'id' | 'logo'>) => void;
  toggleOnline: () => void;
  acceptNeed: (needId: string, ngoName: string) => void;
  resolveNeed: (needId: string, enteredOtp: string) => boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- 1. COORDINATE INJECTION (GPS NATIONAL GRID) ---
  const injectCoordinates = (data: any[]) => data.map(item => ({
    ...item,
    lat: item.lat || 20.5937 + (Math.random() - 0.5) * 12,
    lng: item.lng || 78.9629 + (Math.random() - 0.5) * 12
  }));

  // --- 2. CORE STATE & HYDRATION (PERSISTENCE FIXED) ---
  const [needs, setNeeds] = useState<NeedReport[]>(() => {
    const saved = localStorage.getItem('community-bridge-needs');
    const initialData = saved ? JSON.parse(saved) : mockNeeds;
    return injectCoordinates(initialData);
  });

  // 🛡️ FIXED: Volunteers now load from localStorage to survive refreshes
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('national_grid_volunteers');
    const initialData = saved ? JSON.parse(saved) : mockVolunteers;
    return injectCoordinates(initialData);
  });

  const [ngos, setNGOs] = useState<NGO[]>(mockNGOs);
  const [isOnline, setIsOnline] = useState(true);
  const [syncingCount, setSyncingCount] = useState(0);
  
  const [theme, setTheme] = useState<ThemeCode>(() => 
    (localStorage.getItem('cb-theme-pref') as ThemeCode) || 'onyx'
  );

  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('cb-lang-pref') as LanguageCode) || 'en';
  });

  const [voiceAgent, setVoiceAgent] = useState({
    enabled: true,
    voiceIndex: 0,
    rate: 0.9,
    pitch: 1.0
  });

  // --- 3. AUTO-SAVE & SYSTEM SYNC ---
  useEffect(() => {
    localStorage.setItem('community-bridge-needs', JSON.stringify(needs));
    localStorage.setItem('national_grid_volunteers', JSON.stringify(volunteers)); // 🛡️ Save volunteers
    localStorage.setItem('cb-theme-pref', theme);
    
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    if (theme === 'onyx') {
      root.classList.remove('dark');
      root.style.backgroundColor = "";
    } else {
      root.classList.add('dark');
      root.style.backgroundColor = "#020617"; 
    }
  }, [needs, volunteers, theme]); // Added volunteers to dependency array

  const changeTheme = useCallback((newTheme: ThemeCode) => {
    setTheme(newTheme);
    const themeNames: Record<ThemeCode, string> = {
      onyx: 'Onyx Ops', midnight: 'Stealth Grid', matrix: 'Tech Intel',
      crimson: 'High Alert', cobalt: 'Oceanic', amber: 'Industrial', violet: 'Neural Core'
    };
    toast.success(`Activating Profile: ${themeNames[newTheme]}`);
  }, []);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'onyx' ? 'midnight' : 'onyx'), []);
  
  const updateVoiceConfig = useCallback((config: Partial<typeof voiceAgent>) => {
    setVoiceAgent(prev => ({ ...prev, ...config }));
  }, []);

  const changeLanguage = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('cb-lang-pref', lang);
    const langNames: Record<string, string> = { 
        en: 'English', hi: 'Hindi', bho: 'Bhojpuri', mai: 'Maithili', 
        bn: 'Bengali', mr: 'Marathi', es: 'Spanish', fr: 'French' 
    };
    toast.success(`Switching to ${langNames[lang] || lang.toUpperCase()}`);
  }, []);

  // --- 4. TACTICAL ACTION LOGIC ---
  
  const addNeed = useCallback((need: Omit<NeedReport, 'id' | 'createdAt' | 'status' | 'otp'>) => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newNeed: NeedReport = {
      ...need,
      id: `n${Date.now()}`,
      status: 'pending',
      otp: generatedOtp,
      createdAt: new Date().toISOString(),
      syncStatus: isOnline ? 'synced' : 'pending',
      lat: (need as any).lat || 20.5937 + (Math.random() - 0.5) * 5,
      lng: (need as any).lng || 78.9629 + (Math.random() - 0.5) * 5,
    };
    setNeeds(prev => [newNeed, ...prev]);
    if (!isOnline) {
      toast.warning("Field Node: Offline Mode", { description: `Stored locally. Verification OTP: ${generatedOtp}` });
    } else {
      toast.success("Tactical Report Uplinked", { description: `Verification OTP: ${generatedOtp}.`, duration: 12000 });
    }
  }, [isOnline]);

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      const becomingOnline = !prev;
      if (becomingOnline) {
        const pending = needs.filter(n => n.syncStatus === 'pending');
        if (pending.length > 0) {
          setSyncingCount(pending.length);
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: `Syncing ${pending.length} reports to National Hub...`,
              success: () => {
                setNeeds(current => current.map(n => ({ ...n, syncStatus: 'synced' })));
                setSyncingCount(0);
                return "Global Database Synchronized.";
              },
              error: "Uplink failure.",
            }
          );
        }
      }
      return becomingOnline;
    });
  }, [needs]);

  const addVolunteer = useCallback((vol: Omit<Volunteer, 'id' | 'tasksCompleted' | 'avatar'>) => {
    const initials = vol.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newVol: Volunteer = { 
        ...vol, 
        id: (vol as any).id || `v${Date.now()}`, 
        tasksCompleted: (vol as any).tasksCompleted || 0, 
        avatar: (vol as any).avatar || initials || '??',
        lat: vol.lat || 20.5937 + (Math.random() - 0.5) * 4, 
        lng: vol.lng || 78.9629 + (Math.random() - 0.5) * 4 
    };
    setVolunteers(prev => [newVol, ...prev]);
    if (!(vol as any).id) toast.success("Agent Enlisted in Tactical Network.");
  }, []);

  // 🛡️ NEW: DELETE LOGIC (Center-Targeted Removal)
  const removeVolunteer = useCallback((id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    toast.error("Agent Discharged", { description: "Node terminated from National Grid." });
  }, []);

  const addNGO = useCallback((ngo: Omit<NGO, 'id' | 'logo'>) => {
    const newNGO: NGO = { ...ngo, id: `ngo${Date.now()}`, logo: ngo.name.slice(0, 2).toUpperCase() };
    setNGOs(prev => [newNGO, ...prev]);
  }, []);

  const acceptNeed = useCallback((needId: string, ngoName: string) => {
    setNeeds(prev => prev.map(n => n.id === needId ? { ...n, acceptedBy: ngoName, status: 'assigned' } : n));
  }, []);

  const resolveNeed = useCallback((needId: string, enteredOtp: string) => {
    const target = needs.find(n => n.id === needId);
    if (target?.otp === enteredOtp) {
      setNeeds(prev => prev.map(n => n.id === needId ? { ...n, status: 'resolved' } : n));
      toast.success("Identity Verified. Mission Success.");
      return true;
    }
    toast.error("Security Authentication Failed");
    return false;
  }, [needs]);

  return (
    <AppContext.Provider value={{ 
      needs, volunteers, ngos, isOnline, syncingCount, language, theme, voiceAgent,
      toggleTheme, changeTheme, updateVoiceConfig, changeLanguage, addNeed, addVolunteer, removeVolunteer, addNGO, toggleOnline, acceptNeed, resolveNeed 
    }}>
      {children}
    </AppContext.Provider>
  );
};