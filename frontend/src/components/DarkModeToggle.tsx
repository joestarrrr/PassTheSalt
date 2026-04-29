import { useDarkMode } from '../context/DarkModeContext'

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 1.707a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm2 2a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM15 11a4 4 0 11-8 0 4 4 0 018 0zm2.828-1.172a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM5 9a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM3.757 14.828a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM9 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm4.243.586a1 1 0 01.707 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM3 11a1 1 0 100-2H2a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}
