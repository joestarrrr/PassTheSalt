import { Link } from '@tanstack/react-router'

const links = [
  { to: '/mob', label: 'Dashboard' },
  { to: '/mob/retros', label: 'Retros' },
  { to: '/mob/afterwork', label: 'Afterwork' },
  { to: '/mob/course', label: 'Course' },
]

export function MobNavigation() {
  return (
    <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}