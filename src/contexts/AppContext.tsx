import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NeedReport, Volunteer, NGO, mockNeeds, mockVolunteers, mockNGOs } from '@/lib/mockData';
import { toast } from 'sonner';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'bho' | 'mai' | 'mr' | 'es' | 'fr';
// --- NEW: THEME TYPE DEFINITION ---
export type ThemeCode = 'onyx' | 'midnight' | 'matrix' | 'crimson' | 'cobalt' | 'amber' | 'violet';

/**
 * ELITE APP STATE INTERFACE
 * Standardized tactical data hub for Community Bridge.
 * NO FEATURES REMOVED. ALL NEW REQUESTS INTEGRATED.
 */
interface AppState {
  needs: NeedReport[];
  volunteers: Volunteer[];
  ngos: NGO[];
  isOnline: boolean;
  syncingCount: number;
  language: LanguageCode;
  theme: ThemeCode; // Updated to support 7 themes
  voiceAgent: {
    enabled: boolean;
    voiceIndex: number;
    rate: number;
    pitch: number;
  };
  toggleTheme: () => void; // Preserved for backward compatibility
  changeTheme: (theme: ThemeCode) => void; // NEW: Multi-theme controller
  updateVoiceConfig: (config: Partial<AppState['voiceAgent']>) => void;
  changeLanguage: (lang: LanguageCode) => void;
  addNeed: (need: Omit<NeedReport, 'id' | 'createdAt' | 'status' | 'otp'>) => void;
  addVolunteer: (vol: Omit<Volunteer, 'id' | 'tasksCompleted' | 'avatar'>) => void;
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

  // --- 2. CORE STATE & HYDRATION ---
  const [needs, setNeeds] = useState<NeedReport[]>(() => {
    const saved = localStorage.getItem('community-bridge-needs');
    const initialData = saved ? JSON.parse(saved) : mockNeeds;
    return injectCoordinates(initialData);
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => injectCoordinates(mockVolunteers));
  const [ngos, setNGOs] = useState<NGO[]>(mockNGOs);
  const [isOnline, setIsOnline] = useState(true);
  const [syncingCount, setSyncingCount] = useState(0);
  
  // Updated initial theme logic to support 7 themes
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

  // --- 3. AUTO-SAVE & SYSTEM SYNC (ZENITH MULTI-THEME HANDSHAKE) ---
  useEffect(() => {
    localStorage.setItem('community-bridge-needs', JSON.stringify(needs));
    localStorage.setItem('cb-theme-pref', theme);
    
    // Injects the theme ID into the data-attribute for index.css logic
    document.documentElement.setAttribute('data-theme', theme);
    
    // Maintain Tailwind's .dark class for components using dark: prefix (Onyx is light)
    if (theme === 'onyx') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [needs, theme]);

  // NEW: PEAK MULTI-THEME CONTROLLER
  const changeTheme = useCallback((newTheme: ThemeCode) => {
    setTheme(newTheme);
    const themeNames: Record<ThemeCode, string> = {
      onyx: 'Onyx Ops', midnight: 'Stealth Grid', matrix: 'Tech Intel',
      crimson: 'High Alert', cobalt: 'Oceanic', amber: 'Industrial', violet: 'Neural Core'
    };
    toast.success(`Activating Profile: ${themeNames[newTheme]}`);
  }, []);

  // Preserved toggleTheme (mapped to main dark/light variants)
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

  // --- 4. TACTICAL ACTION LOGIC (STRICT PRESERVATION) ---
  
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
      toast.warning("Field Node: Offline Mode", { description: `Stored locally. Verification OTP is: ${generatedOtp}` });
    } else {
      toast.success("Tactical Report Uplinked", { description: `Verification OTP: ${generatedOtp}. Share this only when help arrives.`, duration: 12000 });
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
        id: `v${Date.now()}`, 
        tasksCompleted: 0, 
        avatar: initials || '??',
        lat: 20.5937 + (Math.random() - 0.5) * 4, 
        lng: 78.9629 + (Math.random() - 0.5) * 4 
    };
    setVolunteers(prev => [newVol, ...prev]);
    toast.success("Agent Enlisted in Tactical Network.");
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
      toast.success("Identity Verified. Mission Success: Report Resolved.");
      return true;
    }
    toast.error("Security Authentication Failed", { description: "The OTP entered does not match the requester's secret key." });
    return false;
  }, [needs]);

  return (
    <AppContext.Provider value={{ 
      needs, volunteers, ngos, isOnline, syncingCount, language, theme, voiceAgent,
      toggleTheme, changeTheme, updateVoiceConfig, changeLanguage, addNeed, addVolunteer, addNGO, toggleOnline, acceptNeed, resolveNeed 
    }}>
      {children}
    </AppContext.Provider>
  );
};