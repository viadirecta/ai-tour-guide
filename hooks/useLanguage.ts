
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { supportedLanguages } from '../i18n';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  const { language, setLanguage, t } = context;

  const languageName = supportedLanguages[language] || supportedLanguages['en'];
  
  return { language, setLanguage, t, languageName };
};
