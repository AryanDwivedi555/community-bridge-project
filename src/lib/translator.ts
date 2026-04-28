// Tactical Neural Translator (Real-Time NMT)
export const translateTacticalStream = async (text: string, targetLang: string) => {
  if (!text || targetLang === 'en' || text.length < 1) return text;
  
  // Checking if text is just numbers/symbols
  if (/^[0-9\W]+$/.test(text)) return text;

  try {
    // Using a high-speed neural mirror (Lingva/Libre) for real-time inference
    const response = await fetch(
      `https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data.translation || text;
  } catch (e) {
    return text; // Fallback to original on network jitter
  }
};