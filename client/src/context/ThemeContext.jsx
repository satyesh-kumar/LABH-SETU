import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Themes: 'warm' | 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('labhsetu_theme');
      if (saved === 'warm' || saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // ignore localStorage errors
    }
    // Default to 'warm' light mode as requested
    return 'warm';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'warm', 'light');
    root.removeAttribute('data-theme');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'warm') {
      root.classList.add('warm');
      root.setAttribute('data-theme', 'warm');
    } else {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }

    try {
      localStorage.setItem('labhsetu_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'warm') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('warm');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
