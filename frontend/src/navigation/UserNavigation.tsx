import { Link } from '@tanstack/react-router'

const links = [
  { to: '/user', label: 'Dashboard' },
  { to: '/user/retros', label: 'Retros' },
  { to: '/user/afterwork', label: 'Afterwork' },
  { to: '/user/course', label: 'Course' },
]

export function UserNavigation() {
  return (
    <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-900/50 dark:bg-slate-700/80 dark:text-slate-200 dark:hover:border-violet-800 dark:hover:bg-slate-600 dark:hover:text-violet-300"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}