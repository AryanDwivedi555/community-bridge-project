import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '@/contexts/AppContext';
import { Maximize, Navigation2 } from 'lucide-react';

/**
 * NATIONAL GRID: SPATIAL INTELLIGENCE MATRIX
 * 100% Feature Preservation | Cinematic Pacing | Zero-Trim Implementation
 */
export default function FieldMap() {
  const { theme, needs, volunteers } = useApp();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  // --- 1. CINEMATIC NAVIGATION ENGINE ---
  const flyBackToGlobal = () => {
    if (!map.current) return;
    
    const bounds = new maplibregl.LngLatBounds();
    needs.forEach(n => bounds.extend([n.lng, n.lat]));
    volunteers.forEach(v => bounds.extend([v.lng, v.lat]));

    // Tactical Reset: Bounds-aware framing of the National Grid
    map.current.fitBounds(bounds, { 
      padding: 120, // Increased for full-screen comfort
      speed: 1.4, 
      curve: 1.8, 
      pitch: 45, 
      easing: (t) => t * (2 - t), 
      essential: true 
    });
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const API_KEY = 'VQuJaQEevzYgcY6cAKfR';
    const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [78.9629, 20.5937], // Central India Uplink
      zoom: 4.5,
      pitch: 45,
      bearing: -5, // Adds a slight tactical angle
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // --- 2. INTERACTIVE TACTICAL MARKERS ---
  useEffect(() => {
    if (!map.current) return;

    // Flush old signals
    markers.current.forEach(m => m.remove());
    markers.current = [];

    // CRISIS NODES (Needs)
    needs?.filter(n => n.status !== 'resolved').forEach(need => {
      const el = document.createElement('div');
      el.className = "flex flex-col items-center cursor-pointer group transition-all duration-300";
      el.innerHTML = `
        <div class="bg-red-600 text-white p-2.5 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.5)] border-2 border-white group-hover:bg-red-700 active:scale-90 transition-all">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2L2 7l10 5-10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div class="bg-white px-3 py-1.5 rounded-full text-[10px] font-black mt-2 shadow-2xl text-red-600 uppercase border border-red-100 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all whitespace-nowrap">
          ${need.needType} Crisis
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        map.current?.flyTo({
          center: [need.lng, need.lat],
          zoom: 16, // Deeper street-level immersion
          pitch: 65,
          speed: 0.95, 
          curve: 1.35,
          easing: (t) => 1 - Math.pow(1 - t, 3), 
          essential: true
        });
      });
      
      const m = new maplibregl.Marker({ element: el }).setLngLat([need.lng, need.lat]).addTo(map.current!);
      markers.current.push(m);
    });

    // AGENT NODES (Volunteers)
    volunteers?.forEach(vol => {
      const el = document.createElement('div');
      el.className = "flex flex-col items-center cursor-pointer group transition-all duration-300";
      el.innerHTML = `
        <div class="bg-emerald-500 p-2.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] border-2 border-white group-hover:bg-emerald-600 active:scale-90 transition-all">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div class="bg-slate-950 text-white px-3 py-1.5 rounded-full text-[10px] font-black mt-2 shadow-2xl uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all whitespace-nowrap">
          Agent: ${vol.name}
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        map.current?.flyTo({
          center: [vol.lng, vol.lat],
          zoom: 17, // Max tactical focus
          pitch: 50,
          speed: 0.95,
          curve: 1.35,
          easing: (t) => 1 - Math.pow(1 - t, 3), 
          essential: true
        });
      });
      
      const m = new maplibregl.Marker({ element: el }).setLngLat([vol.lng, vol.lat]).addTo(map.current!);
      markers.current.push(m);
    });

  }, [needs, volunteers]);

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-900">
      <div ref={mapContainer} className="w-full h-full" />

      {/* --- FLOATING COMMAND HUD (Uplink Controls) --- */}
      <div className="absolute bottom-8 left-8 z-[100] flex flex-col gap-4">
        <button 
          onClick={flyBackToGlobal}
          className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
          <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Maximize className="h-5 w-5 group-hover:rotate-90 transition-transform duration-700" />
          </div>
          <div className="flex flex-col text-left pr-4">
            <span className="text-[11px] font-black uppercase tracking-tighter leading-none dark:text-white">National View</span>
            <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mt-1.5 italic">Synchronize Grid</span>
          </div>
        </button>

        <div className="bg-slate-950/80 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4 shadow-2xl pointer-events-none border-l-4 border-l-primary">
          <Navigation2 className="h-4 w-4 text-primary animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Live Telemetry</span>
            <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Uplink Secured</span>
          </div>
        </div>
      </div>

      <style>{`
        .maplibregl-canvas { outline: none; transition: filter 0.5s ease; }
        .maplibregl-ctrl-group { 
          margin-top: 40px !important; 
          margin-right: 40px !important;
          border-radius: 24px !important; 
          border: none !important; 
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 30px 60px -12px rgb(0 0 0 / 0.4) !important;
        }
        .maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out, .maplibregl-ctrl-compass {
          width: 44px !important;
          height: 44px !important;
        }
      `}</style>
    </div>
  );
}