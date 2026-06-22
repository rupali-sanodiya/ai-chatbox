
// components/settings.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const SettingsComponent = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration error fix karne ke liye
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6 dark:text-white">Settings</h2>
        
        <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-sm font-medium dark:text-slate-300">Dark Mode</span>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};