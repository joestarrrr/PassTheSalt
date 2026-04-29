import { type ReactNode } from 'react'
import { RoleGate } from '../auth/RoleGate'
import { UserNavigation } from '../navigation/UserNavigation'
import { LogoutButton } from '../auth/LogoutButton'
import { DarkModeToggle } from '../components/DarkModeToggle'

type UserLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

export function UserLayout({ title, description, children }: UserLayoutProps) {
  return (
    <RoleGate role="user">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 dark:bg-[radial-gradient(circle_at_top,_#1a1a2e_0%,_#16213e_30%,_#0f3460_100%)] dark:text-slate-100 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">User Mode</p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-[220px] flex-1">
                <UserNavigation />
              </div>
              <div className="flex items-center gap-3">
                <DarkModeToggle />
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="space-y-6">{children}</div>
          </div>
      </div>
    </RoleGate>
  )
}