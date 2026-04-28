import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

// HELPER: Get/Set from Local Storage to keep translations after refresh
const getStoredCache = () => {
  try {
    const saved = localStorage.getItem('tactical_neural_cache');
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};

const saveToStore = (cache: any) => {
  localStorage.setItem('tactical_neural_cache', JSON.stringify(cache));
};

export const useNeuralTranslation = (text: string | number) => {
  const context = useApp();
  const language = context?.language || 'en';
  const inputString = text?.toString().trim() || "";

  // 1. Initial State: Check if we already know this translation locally
  const [output, setOutput] = useState(() => {
    const cache = getStoredCache();
    return cache[language]?.[inputString] || inputString;
  });

  useEffect(() => {
    // 2. Safety Gates
    if (!inputString || language === 'en') {
      setOutput(inputString);
      return;
    }

    // 3. Check Memory Cache
    const currentCache = getStoredCache();
    if (currentCache[language]?.[inputString]) {
      setOutput(currentCache[language][inputString]);
      return;
    }

    // 4. Background Fetch (Doesn't block the UI)
    const process = async () => {
      try {
        const res = await fetch(
          `https://lingva.ml/api/v1/en/${language}/${encodeURIComponent(inputString)}`
        );
        const data = await res.json();
        let result = data.translation || inputString;

        // Number Localization
        const locale = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
        const formatter = new Intl.NumberFormat(locale);
        result = result.replace(/\d+/g, (d: string) => formatter.format(parseInt(d)));

        // 5. Update Local Storage
        const updatedCache = getStoredCache();
        if (!updatedCache[language]) updatedCache[language] = {};
        updatedCache[language][inputString] = result;
        saveToStore(updatedCache);

        setOutput(result);
      } catch (error) {
        setOutput(inputString);
      }
    };

    // Use a small delay to batch requests
    const timer = setTimeout(process, 150);
    return () => clearTimeout(timer);

  }, [inputString, language]);

  return output;
};