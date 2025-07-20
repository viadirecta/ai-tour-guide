

import React, { useState, useEffect, createContext, useCallback } from 'react';
import SuperAdminPage from './components/SuperAdmin';
import ChatInterface from './components/ChatInterface';
import TipPage from './components/TipPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TourList from './components/TourList';
import AdminPage from './components/Admin';
import { LanguageProvider } from './contexts/LanguageContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme) || 'system'
    );

    const applyTheme = useCallback((t: Theme) => {
        const root = window.document.documentElement;
        const isDark =
            t === 'dark' ||
            (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(isDark ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    }, [theme, applyTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


const App: React.FC = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let pageContent;

  const path = hash.replace(/^#\/?/, '');
  const parts = path.split('/');
  const route = parts[0];
  const id = parts[1];

  switch (route) {
    case 'superadmin':
      pageContent = <SuperAdminPage />;
      break;
    case 'login':
      pageContent = <LoginPage />;
      break;
    case 'register':
      pageContent = <RegisterPage />;
      break;
    case 'tour':
      pageContent = <ChatInterface tourId={id} />;
      break;
    case 'admin':
      pageContent = <AdminPage tourId={id} />;
      break;
    case 'tip':
      pageContent = <TipPage tourId={id} />;
      break;
    case '':
    case 'tours':
    default:
      pageContent = <TourList />;
      break;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        {pageContent}
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;