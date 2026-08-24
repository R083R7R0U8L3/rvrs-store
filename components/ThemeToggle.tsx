'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratación en Server Components
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center w-14 h-7 p-1 rounded-full bg-gray-200 dark:bg-neutral-800 transition-colors duration-300 focus:outline-none border border-gray-300 dark:border-neutral-700"
      aria-label="Cambiar tema"
    >
      {/* Iconos de fondo */}
      <div className="flex justify-between items-center w-full px-1 text-gray-500 dark:text-gray-400">
        <Sun className="w-4 h-4 text-amber-500" />
        <Moon className="w-4 h-4 text-indigo-400" />
      </div>

      {/* Switch deslizante */}
      <div
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-neutral-900 shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-indigo-400" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </div>
    </button>
  );
}