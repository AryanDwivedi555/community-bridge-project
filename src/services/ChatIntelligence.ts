import { Coordinates, calculatePreciseDistance } from '@/lib/geospatial';
import { getTacticalPhrase } from '@/lib/voiceDictionary';

export type SignalType = 'INTEL' | 'COORDINATE' | 'EMERGENCY' | 'LOGISTICS' | 'HANDSHAKE';

export interface TacticalSignal {
  id: string;
  sender: { id: string; name: string; node: string };
  content: string;
  timestamp: number;
  type: SignalType;
  priority: 1 | 2 | 3 | 4 | 5;
  geo?: Coordinates;
  entropy?: string; // Encrypted hash for handshake verification
}

/**
 * ELITE CHAT INTELLIGENCE SERVICE
 * An asynchronous, event-driven engine for National Grid communication.
 */
class ChatIntelligenceService {
  private static instance: ChatIntelligenceService;
  private subscribers: ((signal: TacticalSignal) => void)[] = [];

  private constructor() {}

  public static getInstance(): ChatIntelligenceService {
    if (!ChatIntelligenceService.instance) {
      ChatIntelligenceService.instance = new ChatIntelligenceService();
    }
    return ChatIntelligenceService.instance;
  }

  /**
   * SIGNAL BROADCASTER
   * Broadcasts processed signals to all subscribed UI components (Map, Toasts, etc.)
   */
  public subscribe(callback: (signal: TacticalSignal) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  /**
   * ADVANCED TELEMETRY PROCESSOR
   * Uses regex and logic gates to determine signal intent and urgency.
   */
  public async processInboundSignal(
    rawContent: string, 
    sender: { id: string; name: string; node: string }
  ): Promise<TacticalSignal> {
    const timestamp = Date.now();
    const id = `SIG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 1. COORDINATE EXTRACTION (@lat,lng)
    const geoMatch = rawContent.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    const geo = geoMatch ? { lat: parseFloat(geoMatch[1]), lng: parseFloat(geoMatch[2]) } : undefined;

    // 2. PRIORITY & TYPE CLASSIFICATION
    let type: SignalType = 'INTEL';
    let priority: 1 | 2 | 3 | 4 | 5 = 1;

    if (rawContent.includes('🚨') || rawContent.toLowerCase().includes('emergency')) {
      type = 'EMERGENCY';
      priority = 5;
    } else if (geo) {
      type = 'COORDINATE';
      priority = 3;
    } else if (rawContent.includes('🤝') || rawContent.toLowerCase().includes('verify')) {
      type = 'HANDSHAKE';
      priority = 4;
    }

    const signal: TacticalSignal = { id, sender, content: rawContent, timestamp, type, priority, geo };

    // Trigger internal subscribers
    this.subscribers.forEach(sub => sub(signal));
    
    return signal;
  }

  /**
   * PROXIMITY FILTERING
   * Filters the global signal stream based on the agent's current sector.
   */
  public filterByRadius(
    signals: TacticalSignal[], 
    agentLoc: Coordinates, 
    radiusKm: number = 10
  ): TacticalSignal[] {
    return signals.filter(sig => {
      if (!sig.geo) return true; // System messages always pass
      const dist = calculatePreciseDistance(agentLoc, sig.geo);
      return dist.kilometers <= radiusKm;
    });
  }

  /**
   * EMOJI-TO-INTENT MAPPING
   * Translates visual telemetry into grid actions.
   */
  public translateTelemetry(content: string): string {
    const dictionary: Record<string, string> = {
      '🏥': 'Medical assistance requested at node.',
      '📦': 'Logistics payload ready for dispatch.',
      '⚠️': 'Structural hazard detected in sector.',
      '✅': 'Mission objectives finalized.'
    };

    let translation = content;
    Object.entries(dictionary).forEach(([emoji, text]) => {
      if (content.includes(emoji)) translation = text;
    });

    return translation;
  }
}

export const chatIntelligence = ChatIntelligenceService.getInstance();