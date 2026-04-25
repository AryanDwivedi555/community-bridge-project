/**
 * NATIONAL GRID: TACTICAL VOICE DICTIONARY
 * High-fidelity vocal response mappings for AI Agent synthesis.
 */

export type VoiceTacticalEvent = 
  | 'welcome' 
  | 'mission_accepted' 
  | 'proximity_alert' 
  | 'sync_complete' 
  | 'verification_success' 
  | 'security_fail'
  | 'offline_mode';

interface VoiceSchema {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const VOICE_COMMAND_FEEDBACK: VoiceSchema = {
  welcome: {
    en: "Command Node Alpha online. National Strategic Grid uplink established. Welcome, Lead Agent Aryan.",
    hi: "कमांड नोड अल्फा ऑनलाइन। नेशनल स्ट्रैटेजिक ग्रिड अपलिंक स्थापित। स्वागत है, लीड एजेंट आर्यन।"
  },
  mission_accepted: {
    en: "Mission intercept confirmed. Telemetry parameters synced to local node. Good luck, agent.",
    hi: "मिशन इंटरसेप्ट की पुष्टि हो गई है। टेलीमेट्री पैरामीटर्स स्थानीय नोड से सिंक किए गए हैं। शुभकामनाएं, एजेंट।"
  },
  proximity_alert: {
    en: "Priority Alert. Active volunteer detected within strategic range of a high-urgency mission node.",
    hi: "प्रायोरिटी अलर्ट। हाई-अर्जेंसी मिशन नोड के रणनीतिक दायरे में सक्रिय स्वयंसेवक का पता चला है।"
  },
  sync_complete: {
    en: "Global data uplink complete. Local cache synchronized with National Hub.",
    hi: "ग्लोबल डेटा अपलिंक पूरा हुआ। स्थानीय कैश को नेशनल हब के साथ सिंक्रोनाइज़ किया गया है।"
  },
  verification_success: {
    en: "Handshake verified. Accessing encrypted mission parameters.",
    hi: "हैंडशेक सत्यापित। एन्क्रिप्टेड मिशन मापदंडों तक पहुंच प्राप्त हो गई है।"
  },
  security_fail: {
    en: "Verification protocol failed. Access denied. System logged unauthorized attempt.",
    hi: "सत्यापन प्रोटोकॉल विफल रहा। पहुंच अस्वीकृत। सिस्टम ने अनधिकृत प्रयास दर्ज किया है।"
  },
  offline_mode: {
    en: "Network signal lost. Switching to autonomous local cache mode. Data integrity maintained.",
    hi: "नेटवर्क सिग्नल टूट गया। स्वायत्त स्थानीय कैश मोड पर स्विच कर रहे हैं। डेटा अखंडता बनाए रखी गई है।"
  }
};

/**
 * TACTICAL COMMAND RECOGNITION KEYS
 * Fuzzy match phrases used by the VoiceNavigator to trigger routing.
 */
export const VOICE_NAV_KEYS = {
  dashboard: ['dashboard', 'home', 'intel', 'intelligence', 'मुख्य पृष्ठ'],
  mission: ['mission', 'control', 'map', 'grid', 'tactical', 'मानचित्र'],
  volunteers: ['agents', 'volunteers', 'directory', 'responders', 'स्वयंसेवक'],
  verify: ['verify', 'chat', 'terminal', 'handshake', 'सत्यापन'],
  reports: ['reports', 'analytics', 'impact', 'data', 'रिपोर्ट'],
  network: ['ngo', 'federated', 'partners', 'nodes', 'नेटवर्क']
};

/**
 * UTILITY: TACTICAL SPEECH SYNTHESIZER
 * Helper to retrieve the correct string based on current grid locale.
 */
export const getTacticalPhrase = (
  event: VoiceTacticalEvent, 
  lang: 'en' | 'hi' = 'en'
): string => {
  return VOICE_COMMAND_FEEDBACK[event]?.[lang] || VOICE_COMMAND_FEEDBACK[event]['en'];
};