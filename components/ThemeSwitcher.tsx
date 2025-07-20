import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import Icon from './Icon';

const ThemeSwitcher: React.FC = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        // This should not happen if ThemeSwitcher is used within ThemeProvider
        return null;
    }

    const { theme, setTheme } = context;

    const themes = [
        { name: 'light', icon: 'sun' },
        { name: 'dark', icon: 'moon' },
        { name: 'system', icon: 'desktop' },
    ] as const;

    return (
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-700 rounded-full">
            {themes.map((t) => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-700 focus:ring-sky-500 ${
                        theme === t.name
                            ? 'bg-white dark:bg-slate-800 shadow text-sky-500'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    aria-label={`Switch to ${t.name} theme`}
                    title={`Switch to ${t.name} theme`}
                >
                    <Icon name={t.icon} className="w-5 h-5" />
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
