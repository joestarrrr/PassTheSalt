import { Link } from '@tanstack/react-router'

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/mob-groups', label: 'Mob Groups' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/afterwork', label: 'Afterwork' },
  { to: '/admin/feedback', label: 'Feedback' },
]

export function AdminNavigation() {
  return (
    <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
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