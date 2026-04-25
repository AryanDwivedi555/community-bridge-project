import { useApp } from '@/contexts/AppContext';
import { dictionary, LanguageCode } from '@/lib/i18n';

export function useTranslation() {
  const { language } = useApp();
  const t = (key: string) => {
    return dictionary[language as LanguageCode]?.[key] || key;
  };
  return { t };
}