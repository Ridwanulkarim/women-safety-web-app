import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition"
    >
      {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
