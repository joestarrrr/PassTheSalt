import { Link } from '@tanstack/react-router'
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useAuthSession } from '../auth/AuthSession'
import { getAppRootUrl } from '../auth/appUrls'
import { getRoleHome } from '../auth/roleRoutes'
import { router } from '../router/appRouter'

const appRootUrl = getAppRootUrl()

const highlights = [
  { icon: '📝', title: 'Daily Retros', desc: 'Reflect on every learning day' },
  { icon: '👥', title: 'Mob Groups', desc: 'Track and manage programming pairs' },
  { icon: '🍻', title: 'Afterwork Events', desc: 'Discover what\'s happening on the map' },
]

export function LoginPage() {
  const { backendUser, backendError, isClerkLoaded, isSignedIn, refreshBackendUser } = useAuthSession()

  useEffect(() => {
    if (backendUser?.role) {
      void router.navigate({ to: getRoleHome(backendUser.role) })
    }
  }, [backendUser?.role])

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#0c0618]">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[700px] w-[700px] rounded-full bg-violet-900/50 blur-[140px]" />
        <div className="absolute -right-32 top-1/2 h-[500px] w-[500px] rounded-full bg-fuchsia-900/35 blur-[120px]" />
      </div>

      {/* Left brand panel — desktop only */}
      <div className="relative z-10 hidden w-[46%] flex-col justify-between px-12 py-10 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40">
            <span className="text-sm font-black text-white">PS</span>
          </div>
          <span className="text-lg font-bold text-white/90">PassTheSalt</span>
        </Link>

        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-white">
            Welcome back.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Your cohort awaits.
            </span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/45">
            Sign in and the app will route you to the right workspace automatically based on your role.
          </p>

          <div className="mt-10 space-y-4">
            {highlights.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-base">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{title}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/20">© 2024 PassTheSalt · Salt Hackweek</p>
      </div>

      {/* Right form panel */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-14">
        {/* Mobile logo */}
        <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40">
            <span className="text-sm font-black text-white">PS</span>
          </div>
          <span className="text-lg font-bold text-white/90">PassTheSalt</span>
        </Link>

        <div className="w-full max-w-sm">
          <SignedOut>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Sign in</h1>
              <p className="mt-1 text-sm text-white/45">Continue to your workspace</p>
            </div>

            <SignIn
              routing="hash"
              forceRedirectUrl={appRootUrl}
              fallbackRedirectUrl={appRootUrl}
              appearance={{
                variables: {
                  colorPrimary: '#7c3aed',
                  colorBackground: '#160d26',
                  colorInputBackground: '#231540',
                  colorText: '#f1f5f9',
                  colorTextSecondary: '#94a3b8',
                  colorInputText: '#f1f5f9',
                  colorNeutral: '#64748b',
                  borderRadius: '0.75rem',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                },
                elements: {
                  card: 'bg-transparent shadow-none border-0 p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-white/30',
                  formFieldInput: 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition',
                  formFieldLabel: 'text-white/60 text-xs font-medium',
                  formButtonPrimary: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] transition',
                  footerActionLink: 'text-violet-400 hover:text-violet-300',
                  identityPreviewText: 'text-white/80',
                  identityPreviewEditButton: 'text-violet-400',
                  alertText: 'text-rose-400',
                  formFieldSuccessText: 'text-emerald-400',
                },
              }}
            />

            <Link
              to="/"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/60 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:text-white/80"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-white">You're signed in</p>
              <p className="mt-1 text-sm text-white/45">Routing you to your workspace...</p>
              <div className="mt-5 flex justify-center">
                <UserButton afterSignOutUrl={appRootUrl} />
              </div>
            </div>
          </SignedIn>

          {!isClerkLoaded || (isSignedIn && !backendUser) ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
                Loading your account...
              </div>
              {backendError ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-rose-400">{backendError}</p>
                  <button
                    type="button"
                    onClick={refreshBackendUser}
                    className="inline-flex items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
                  >
                    Retry account lookup
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}