import { Link } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'

const features = [
  { icon: '📝', label: 'Daily Retros' },
  { icon: '👥', label: 'Mob Groups' },
  { icon: '🍻', label: 'Afterwork Events' },
  { icon: '📊', label: 'Course Insights' },
  { icon: '🗺️', label: 'Event Map' },
  { icon: '❓', label: 'Anonymous Q&A' },
]

export function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth()

  // If Clerk has loaded and user is already signed in, show a loading state
  // while AuthSession fetches the backend user and then navigates to role home.
  if (isLoaded && isSignedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0618]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-900/40 blur-[130px]" />
          <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-900/25 blur-[110px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40">
            <span className="text-base font-black text-white">PS</span>
          </div>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
          <p className="max-w-xs text-sm font-medium text-white/55">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#0c0618]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[700px] w-[700px] rounded-full bg-violet-900/50 blur-[140px]" />
        <div className="absolute -right-48 top-1/3 h-[600px] w-[600px] rounded-full bg-fuchsia-900/35 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-900/30 blur-[120px]" />
      </div>

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40">
            <span className="text-sm font-black text-white">PS</span>
          </div>
          <span className="text-base font-bold text-white/90">PassTheSalt</span>
        </div>
        <Link
          to="/login"
          className="rounded-full border border-white/15 bg-white/8 px-5 py-2 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/15 hover:text-white"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-8 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
          Cohort management platform
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
          Pass the{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Salt
          </span>
        </h1>

        {/* Sub */}
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-white/50 sm:text-lg">
          Retros, mob groups, afterwork events, and course tools — everything your cohort needs in one place.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-9 py-3.5 text-base font-bold text-white shadow-[0_0_40px_rgba(139,92,246,0.45)] transition duration-200 hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(139,92,246,0.65)]"
          >
            Get started
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M2.5 7.5h10M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-2.5">
          {features.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-sm font-medium text-white/60 backdrop-blur-sm"
            >
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center text-xs text-white/20">
        PassTheSalt · Built with ♥ at Salt Hackweek
      </footer>
    </main>
  )
}