import React, { createContext, useContext, useEffect, useState } from 'react';
import './ThemeProvider.css';

// Create context for theme
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
});

/**
 * ThemeProvider component for managing theme settings
 * 
 * @param {Object} props - Component props
 * @param {string} [props.defaultTheme='system'] - Default theme (light, dark, system)
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - ThemeProvider component
 */
export const ThemeProvider = ({
  defaultTheme = 'system',
  children,
}) => {
  const [theme, setTheme] = useState(defaultTheme);

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('ui-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Update HTML attribute and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(`${systemTheme}-theme`);
    } else {
      root.classList.add(`${theme}-theme`);
    }

    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light-theme', 'dark-theme');
      root.classList.add(
        `${mediaQuery.matches ? 'dark' : 'light'}-theme`
      );
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * @returns {Object} Theme context with theme value and setTheme function
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * ThemeToggle component to switch between themes
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} - ThemeToggle component
 */
export const ThemeToggle = (props) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="ui-theme-toggle"
      title="Toggle theme"
      type="button"
      {...props}
    >
      {/* Light mode icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`ui-theme-icon ${theme === 'light' ? 'active' : ''}`}
      >
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M12 3v1M12 20v1M3 12h1M20 12h1M18.364 5.636l-.707.707M6.343 17.657l-.707.707M5.636 5.636l.707.707M17.657 17.657l.707.707" />
      </svg>
      
      {/* Dark mode icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`ui-theme-icon ${theme === 'dark' ? 'active' : ''}`}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      
      {/* System preference icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`ui-theme-icon ${theme === 'system' ? 'active' : ''}`}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </button>
  );
}; 