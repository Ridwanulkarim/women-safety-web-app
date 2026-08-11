import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className="p-1.5 sm:p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition min-h-[36px] sm:min-h-[40px] flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
    >
      {darkMode ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />}
    </button>
  );
};

export default ThemeToggle;
