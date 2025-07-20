
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { supportedLanguages } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as keyof typeof supportedLanguages)}
        className="text-sm font-medium bg-transparent text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 focus:outline-none appearance-none pr-6"
        aria-label="Select language"
      >
        {Object.entries(supportedLanguages).map(([code, name]) => (
          <option key={code} value={code} className="text-black">
            {name}
          </option>
        ))}
      </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600 dark:text-slate-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
