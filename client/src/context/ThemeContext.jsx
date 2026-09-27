import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Supported Themes: 'warm' (Warm Light) | 'light' (Crisp Light) | 'dark' (Deep Midnight)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('labhsetu_theme');
      if (saved === 'warm' || saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // ignore localStorage errors
    }
    return 'warm';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Clean previous theme classes
    root.classList.remove('dark', 'warm', 'light');
    body.classList.remove('dark', 'warm', 'light');

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'warm') {
      root.classList.add('warm');
      body.classList.add('warm');
      root.setAttribute('data-theme', 'warm');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('light');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
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
