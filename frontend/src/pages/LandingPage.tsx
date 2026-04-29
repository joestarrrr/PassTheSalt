import { Link } from '@tanstack/react-router'

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_28%,_#f8fafc_62%,_#eef2ff_100%)] px-4 py-8 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[10%] h-3 w-3 rounded-full bg-violet-300/70" />
        <span className="absolute left-[15%] top-[18%] h-1.5 w-1.5 rounded-full bg-pink-300/70" />
        <span className="absolute right-[14%] top-[14%] h-4 w-4 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-[18%] left-[12%] h-2 w-10 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-[22%] right-[10%] h-2.5 w-2.5 rounded-full bg-pink-200/70" />
        <span className="absolute left-[20%] top-[36%] text-2xl text-violet-300/70">✦</span>
        <span className="absolute right-[20%] top-[38%] text-xl text-pink-300/70">♡</span>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">
          Pass the Salt
        </p>

        <div className="mb-8 space-y-3">
          <h1 className="relative inline-block text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Welcome!
            <span className="absolute -bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-violet-300/80 blur-[1px]" />
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
            Choose the mode you want to explore. Each role lands on its own dashboard and page set.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <Link
            to="/login"
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Admin</p>
            <p className="mt-3 text-xl font-bold text-slate-900">Sign in as Admin</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Clerk login routes admins to admin-only pages.</p>
          </Link>

          <Link
            to="/login"
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">User</p>
            <p className="mt-3 text-xl font-bold text-slate-900">Sign in as User</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Clerk login routes users to the user workspace.</p>
          </Link>

          <Link
            to="/login"
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Mob</p>
            <p className="mt-3 text-xl font-bold text-slate-900">Sign in as Mob</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Clerk login routes mob users to mob pages.</p>
          </Link>
        </div>
      </section>
    </main>
  )
}