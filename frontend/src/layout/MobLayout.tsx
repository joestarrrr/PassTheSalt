import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { RoleGate } from '../auth/RoleGate'
import { LogoutButton } from '../auth/LogoutButton'

type MobLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

const navItems = [
  {
    to: '/mob',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/mob/retros',
    label: 'Retros',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="2" />
        <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    to: '/mob/afterwork',
    label: 'Afterwork',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    to: '/mob/course',
    label: 'Course',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
]

export function MobLayout({ title, description, children }: MobLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <RoleGate role="mob">
      <div className="relative flex h-screen overflow-hidden bg-[#0c0618]">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-900/40 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-900/25 blur-[100px]" />
        </div>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={[
            'relative z-30 fixed inset-y-0 left-0 flex w-60 flex-col bg-[#160d26] border-r border-white/8',
            'shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out',
            'lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          {/* Brand */}
          <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/8 px-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
              <span className="text-[11px] font-black tracking-tight text-white">PS</span>
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-white/90">PassTheSalt</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Mob Mode</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Mob navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={item.exact ? { exact: true } : undefined}
                onClick={() => setSidebarOpen(false)}
                activeProps={{
                  className:
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25',
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/6 hover:text-white/80 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <div className="flex-shrink-0 border-t border-white/8 p-4">
            <LogoutButton
              label="Sign out"
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white/80"
            />
          </div>
        </aside>

        {/* Content */}
        <div className="relative z-10 flex flex-1 min-w-0 flex-col overflow-hidden">
          {/* Mobile top bar */}
          <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-white/8 bg-[#160d26]/80 px-4 backdrop-blur-md lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/8"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="truncate text-sm font-bold text-white/90">{title}</span>
          </div>

          {/* Scrollable page area */}
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6 lg:mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Mob Mode</p>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">{description}</p>
            </div>
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </RoleGate>
  )
}