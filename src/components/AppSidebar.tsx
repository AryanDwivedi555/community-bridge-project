import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Shield, 
  Languages,
  Map as MapIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Radio,
  Zap
} from 'lucide-react';
import { NavLink } from './ui/NavLink';
import { useApp } from '@/contexts/AppContext';
import { dictionary, languageNames, LanguageCode } from '@/lib/i18n';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, 
  useSidebar,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { T } from '@/components/T';

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  const { 
    isOnline, language, changeLanguage, theme, toggleTheme, 
    voiceAgent, updateVoiceConfig 
  } = useApp();

  // 🛡️ PEAK SAFETY LOGIC: Use theme from context instead of document.documentElement
  // This prevents the "Blank Screen" crash during server-side hydration.
  const isSpaceActive = theme !== 'onyx';
  
  const t = (key: string) => dictionary[language]?.[key] || key;

  const items = [
    { title: t('nav_dashboard'), url: '/', icon: LayoutDashboard },
    { title: "Tactical Map", url: '/mission-control', icon: MapIcon },
    { title: "Intelligence Hub", url: '/chatbot', icon: Zap },
    { title: t('nav_volunteers'), url: '/volunteers', icon: Users },
    { title: t('nav_ngo'), url: '/ngo-network', icon: Building2 },
    { title: t('nav_reports'), url: '/reports', icon: FileText },
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      /* ELITE DAYLIGHT LOCK: Fixed white background for Command Lead clarity */
      className="border-r border-slate-200 bg-white transition-all duration-700 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]"
    >
      <SidebarContent className="pt-6">
        <div className={cn("px-4 mb-8 transition-all duration-300", isCollapsed ? "flex justify-center" : "px-6")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-[12px] font-black tracking-tighter leading-tight uppercase italic text-slate-900">
                  Community
                </span>
                <span className="text-[11px] font-black text-primary leading-tight mt-1 uppercase tracking-widest">
                  BRIDGE
                </span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-12">
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-4 rounded-2xl transition-all duration-300 hover:bg-slate-50 text-slate-600"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                          <T>{item.title}</T>
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn(
        "p-4 space-y-4 border-t transition-colors bg-slate-50 border-slate-100",
        isCollapsed ? "pb-20" : "pb-28"
      )}>
        
        <div className={cn("flex items-center justify-between gap-2", isCollapsed ? "flex-col" : "px-2")}>
            <button 
              onClick={toggleTheme}
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 border",
                isSpaceActive 
                  ? "bg-slate-950 text-amber-500 border-slate-800 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                  : "bg-white text-slate-400 border-slate-200 shadow-sm"
              )}
            >
              {isSpaceActive ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {!isCollapsed && (
              <button 
                onClick={() => updateVoiceConfig({ enabled: !voiceAgent.enabled })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 px-4 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  voiceAgent.enabled ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-200 text-slate-400 shadow-sm"
                )}
              >
                {voiceAgent.enabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span><T>{voiceAgent.enabled ? "Voice ON" : "Muted"}</T></span>
              </button>
            )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={cn(
              "flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all border bg-white border-slate-200 text-slate-700 shadow-sm hover:border-primary/30",
              isCollapsed && "justify-center"
            )}>
              <Languages className="h-4 w-4 text-primary" />
              {!isCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest flex-1 whitespace-nowrap">
                  {languageNames[language]}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-52 rounded-2xl shadow-2xl p-2 z-[1001] bg-white border-slate-100">
            {(Object.keys(languageNames) as LanguageCode[]).map((lang) => (
              <DropdownMenuItem 
                key={lang} 
                onClick={() => changeLanguage(lang)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-xl px-4 py-3 mb-1 transition-all",
                  language === lang ? "bg-primary text-white" : "hover:bg-slate-50 text-slate-600"
                )}
              >
                {languageNames[lang]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className={cn(
          "flex items-center gap-3 p-4 rounded-2xl border transition-all bg-white border-slate-200 shadow-inner",
          isCollapsed && "justify-center"
        )}>
          <div className="relative">
             <Radio className={cn("h-4 w-4", isOnline ? "text-emerald-500" : "text-amber-500")} />
             <span className={cn(
               "absolute -top-1 -right-1 h-2 w-2 rounded-full border-2 border-white transition-colors animate-pulse",
               isOnline ? "bg-emerald-500" : "bg-amber-500"
             )} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 leading-tight mb-1">
                <T>Grid Uplink</T>
              </span>
              <span className={cn("text-[10px] font-black uppercase italic leading-tight", isOnline ? "text-emerald-500" : "text-amber-500")}>
                <T>{isOnline ? "Operational" : "Offline Cache"}</T>
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}