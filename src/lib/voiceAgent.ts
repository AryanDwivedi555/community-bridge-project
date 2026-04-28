/**
 * NATIONAL STRATEGIC GRID: UNIVERSAL VOICE ENGINE (V6.0)
 * Logic: Forced script-to-engine mapping and fuzzy voice detection.
 */

export type TacticalGender = 'male' | 'female';

class NeuralVoiceAgent {
  private synth: SpeechSynthesis;
  private lastSpokenText: string = "";
  private lastSpokenTime: number = 0;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  /**
   * 🗺️ UNIVERSAL LANGUAGE BRIDGE
   * Maps every tactical dialect to a browser-supported voice engine.
   */
  private getSupportedLocale(lang: string): string {
    const normalize = lang.toLowerCase();
    
    const dialectMap: Record<string, string> = {
      // Direct Regional Mappings
      'bn': 'bn-IN', // Bengali
      'bn-in': 'bn-IN',
      'mr': 'hi-IN', // Marathi (Devanagari - best read by Hindi engine)
      'bho': 'hi-IN', // Bhojpuri (Uses Devanagari)
      'mai': 'hi-IN', // Maithili (Uses Devanagari)
      'hi': 'hi-IN',
      
      // European Mappings
      'fr': 'fr-FR',
      'es': 'es-ES',
      'en': 'en-US'
    };
    
    return dialectMap[normalize] || 'en-US';
  }

  public speak(text: string, lang: string, gender: TacticalGender = 'female') {
    if (!text || !this.synth) return;

    // 1. Anti-Stutter Guard (1 second window)
    const now = Date.now();
    if (text === this.lastSpokenText && (now - this.lastSpokenTime) < 1000) return;

    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    // 2. Kill current transmission
    this.synth.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = this.getSupportedLocale(lang);
    utterance.lang = targetLocale;

    // 3. FUZZY VOICE SEARCH
    // We look for any voice that matches the locale (e.g., 'bn-IN')
    const voices = this.synth.getVoices();
    
    let selectedVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      const voiceLang = v.lang.toLowerCase().replace('_', '-');
      const target = targetLocale.toLowerCase();
      
      // Match language (e.g., bn-in)
      const isLangMatch = voiceLang === target || voiceLang.startsWith(target.split('-')[0]);
      
      // Match Gender
      const isGenderMatch = gender === 'female' 
        ? (name.includes('female') || name.includes('zira') || name.includes('pallavi') || name.includes('google'))
        : (name.includes('male') || name.includes('david') || name.includes('google'));
        
      return isLangMatch && isGenderMatch;
    });

    // Fallback: If no gender match, just take any voice of that language
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLocale.toLowerCase().split('-')[0]));
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    // 4. TACTICAL CALIBRATION
    // Regional scripts (Bengali/Marathi/Bhojpuri) need specific pacing
    utterance.pitch = gender === 'female' ? 1.1 : 0.9;
    
    // Slow down Bhojpuri/Maithili slightly for better pronunciation
    if (['bho', 'mai', 'bn'].includes(lang)) {
        utterance.rate = 0.85; 
    } else {
        utterance.rate = 0.95;
    }
    
    utterance.volume = 1.0;

    // 5. Execute
    this.synth.speak(utterance);
  }
}

export const VoiceAgent = new NeuralVoiceAgent();