import { Link } from '@tanstack/react-router'

const links = [
  { to: '/admin', label: 'Dashboard', badge: 'DB', exact: true },
  { to: '/admin/courses', label: 'Courses', badge: 'CR' },
  { to: '/admin/mob-groups', label: 'Mob Groups', badge: 'MG' },
  { to: '/admin/users', label: 'Users', badge: 'US' },
  { to: '/admin/afterwork', label: 'Afterwork', badge: 'AW' },
  { to: '/admin/feedback', label: 'Feedback', badge: 'FB' },
]

export function AdminNavigation() {
  return (
    <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" aria-label="Admin sections">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          activeOptions={link.exact ? { exact: true } : undefined}
          title={`Go to ${link.label}`}
          activeProps={{
            className:
              'group rounded-2xl border border-violet-400 bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-md',
          }}
          className="group rounded-2xl border border-violet-100 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-extrabold tracking-wide text-violet-700 transition-colors group-hover:bg-violet-200 group-hover:text-violet-800">
              {link.badge}
            </span>
            <span>{link.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  )
}