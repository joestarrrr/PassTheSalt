import { Link } from '@tanstack/react-router'

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_28%,_#f8fafc_62%,_#eef2ff_100%)] px-4 py-8 text-slate-800 dark:bg-[radial-gradient(circle_at_top,_#1a1a2e_0%,_#16213e_28%,_#0f1419_62%,_#0a0e27_100%)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[10%] h-3 w-3 rounded-full bg-violet-300/70 dark:bg-violet-500/50" />
        <span className="absolute left-[15%] top-[18%] h-1.5 w-1.5 rounded-full bg-pink-300/70 dark:bg-pink-500/50" />
        <span className="absolute right-[14%] top-[14%] h-4 w-4 rounded-full bg-violet-200/70 dark:bg-violet-600/50" />
        <span className="absolute bottom-[18%] left-[12%] h-2 w-10 rounded-full bg-violet-200/70 dark:bg-violet-600/50" />
        <span className="absolute bottom-[22%] right-[10%] h-2.5 w-2.5 rounded-full bg-pink-200/70 dark:bg-pink-500/50" />
        <span className="absolute left-[20%] top-[36%] text-2xl text-violet-300/70 dark:text-violet-400/50">✦</span>
        <span className="absolute right-[20%] top-[38%] text-xl text-pink-300/70 dark:text-pink-400/50">♡</span>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/80">
          Pass the Salt
        </p>

        <div className="mb-8 space-y-3">
          <h1 className="relative inline-block text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Welcome!
            <span className="absolute -bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-violet-300/80 dark:bg-violet-500/60 blur-[1px]" />
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Choose the mode you want to explore. Each role lands on its own dashboard and page set.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <Link
            to="/login"
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] dark:hover:border-slate-600"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/80">Admin</p>
            <p className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Sign in as Admin</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Clerk login routes admins to admin-only pages.</p>
          </Link>

          <Link
            to="/login"
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] dark:hover:border-slate-600"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/80">User</p>
            <p className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Sign in as User</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Clerk login routes users to the user workspace.</p>
          </Link>

          <Link
            to="/login"
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] dark:hover:border-slate-600"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/80">Mob</p>
            <p className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Sign in as Mob</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Clerk login routes mob users to mob pages.</p>
          </Link>
        </div>
      </section>
    </main>
  )
}