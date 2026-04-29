import { useDarkMode } from '../context/DarkModeContext'

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      role="switch"
      aria-checked={isDark}
      className="group relative inline-flex h-9 w-16 items-center rounded-full border border-slate-200 bg-white/95 p-1 transition-all duration-300 hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-800"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="absolute left-2 text-[10px] font-semibold uppercase tracking-wide text-amber-500 dark:text-slate-500">L</span>
      <span className="absolute right-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-violet-300">D</span>
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full text-xs shadow-md transition-all duration-300 ${
          isDark
            ? 'translate-x-7 bg-violet-600 text-white shadow-violet-900/40'
            : 'translate-x-0 bg-amber-400 text-slate-900 shadow-amber-500/40'
        }`}
      >
        {isDark ? 'D' : 'L'}
      </span>
    </button>
  )
}
