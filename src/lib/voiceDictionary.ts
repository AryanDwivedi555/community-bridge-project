/**
 * NATIONAL STRATEGIC GRID: GLOBAL VOICE DICTIONARY
 * Extended support for Regional and International Command Phrases.
 */

export type SupportedLocale = 'en' | 'hi' | 'mr' | 'bn' | 'fr' | 'es' | 'bho' | 'mai';

interface VoiceSchema {
  [key: string]: {
    [locale in SupportedLocale]?: string;
  } & { en: string }; // English acts as the hard-coded fallback
}

export const VOICE_COMMAND_FEEDBACK: VoiceSchema = {
  welcome: {
    en: "Command Node Alpha online. Welcome, Lead Agent Aryan.",
    hi: "कमांड नोड अल्फा ऑनलाइन। स्वागत है, लीड एजेंट आर्यन।",
    mr: "कमांड नोड अल्फा ऑनलाइन. स्वागत आहे, लीड एजंट आर्यन.",
    bn: "কমান্ড নোড আলফা অনলাইন। স্বাগত, লিড এজেন্ট আরিয়ান।",
    fr: "Nœud de commande Alpha en ligne. Bienvenue, Agent Principal Aryan.",
    es: "Nodo de comando Alfa en línea. Bienvenido, Agente Principal Aryan.",
    bho: "कमांड नोड अल्फा ऑनलाइन बा। स्वागत बा, लीड एजेंट आर्यन।",
    mai: "कमांड नोड अल्फा ऑनलाइन अछि। स्वागत अछि, लीड एजेंट आर्यन।"
  },
  map_active: {
    en: "Tactical Map initialized. Satellite uplink secured.",
    hi: "सामरिक मानचित्र सक्रिय। सैटेलाइट अपलिंक सुरक्षित।",
    mr: "धोरणात्मक नकाशा सक्रिय. सॅटेलाइट अपलिंक सुरक्षित आहे.",
    bn: "কৌশলগত মানচিত্র সক্রিয়। স্যাটেলাইট আপলিঙ্ক সুরক্ষিত।",
    fr: "Carte tactique initialisée. Liaison satellite sécurisée.",
    es: "Mapa táctico inicializado. Enlace satelital asegurado.",
    bho: "सामरिक मानचित्र चालू हो गईल बा। सैटेलाइट अपलिंक सुरक्षित बा।",
    mai: "सामरिक मानचित्र सक्रिय भ गेल अछि। सैटेलाइट अपलिंक सुरक्षित अछि।"
  },
  proximity_alert: {
    en: "Priority Alert. Active volunteer detected nearby.",
    hi: "प्रायोरिटी अलर्ट। पास में सक्रिय स्वयंसेवक का पता चला है।",
    mr: "प्रायोरिटी अलर्ट. जवळच सक्रिय स्वयंसेवक आढळला आहे.",
    bn: "প্রায়োরিটি অ্যালার্ট। কাছাকাছি সক্রিয় স্বেচ্ছাসেবক সনাক্ত করা হয়েছে।",
    fr: "Alerte prioritaire. Bénévole actif détecté à proximité.",
    es: "Alerta de prioridad. Voluntario activo detectado cerca.",
    bho: "प्रायोरिटी अलर्ट। लगे में सक्रिय स्वयंसेवक मिलल बाड़न।",
    mai: "प्रायोरिटी अलर्ट। लग में सक्रिय स्वयंसेवकक पता चलल अछि।"
  },
  sync_complete: {
    en: "Data uplink complete. Cache synchronized.",
    hi: "डेटा अपलिंक पूरा हुआ। कैश सिंक्रोनाइज़ हो गया है।",
    bn: "ডেটা আপলিঙ্ক সম্পূর্ণ। ক্যাশ সিঙ্ক্রোনাইজ করা হয়েছে।",
    mr: "डेटा अपलिंक पूर्ण झाला. कॅश सिंक्रोनाइझ झाली आहे.",
    fr: "Liaison de données terminée. Cache synchronisé.",
    es: "Carga de datos completa. Caché sincronizada.",
    bho: "डेटा अपलिंक पूरा भ गईल। कैश सिंक हो गईल बा।",
    mai: "डेटा अपलिंक पूरा भ गेल। कैश सिंक भ गेल अछि।"
  }
};

/**
 * UPDATED UTILITY: TACTICAL SPEECH SYNTHESIZER
 * Now dynamically detects voice capability based on the selected grid locale.
 */
export const getTacticalPhrase = (
  event: string, 
  lang: SupportedLocale = 'en'
): string => {
  const phraseMap = VOICE_COMMAND_FEEDBACK[event];
  if (!phraseMap) return "";

  // Return specific language, or fallback to English if the translation is missing
  return phraseMap[lang] || phraseMap['en'];
};

/**
 * RECOGNITION KEYS: Expanded for Multi-Lingual Navigation
 */
export const VOICE_NAV_KEYS = {
  dashboard: ['dashboard', 'home', 'intel', 'मुख्य पृष्ठ', 'accueil', 'inicio', 'घर'],
  mission: ['mission', 'control', 'map', 'मानचित्र', 'carte', 'mapa', 'नक्शा'],
  volunteers: ['agents', 'volunteers', 'स्वयंसेवक', 'bénévoles', 'voluntarios', 'सेवक'],
  reports: ['reports', 'analytics', 'रिपोर्ट', 'rapports', 'informes', 'डेटा']
};