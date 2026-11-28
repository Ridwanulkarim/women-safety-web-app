import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      aria-label="Toggle dark mode"
      className="h-9 w-9 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] border border-zinc-900/10 dark:border-white/10 hover:border-zinc-900/20 dark:hover:border-white/20 flex items-center justify-center cursor-pointer transition-colors duration-150"
    >
      {darkMode ? <FiSun className="w-4 h-4 dispatch-icon" /> : <FiMoon className="w-4 h-4 dispatch-icon" />}
    </button>
  );
};

export default ThemeToggle;
