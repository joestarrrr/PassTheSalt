import { Link } from '@tanstack/react-router'
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useAuthSession } from '../auth/AuthSession'
import { getAppRootUrl } from '../auth/appUrls'
import { getRoleHome } from '../auth/roleRoutes'
import { router } from '../router/appRouter'

const appRootUrl = getAppRootUrl()

export function LoginPage() {
  const { backendUser, backendError, isClerkLoaded, isSignedIn, refreshBackendUser } = useAuthSession()

  useEffect(() => {
    if (backendUser?.role) {
      void router.navigate({ to: getRoleHome(backendUser.role) })
    }
  }, [backendUser?.role])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_28%,_#f8fafc_62%,_#eef2ff_100%)] px-4 py-8 text-slate-800 dark:bg-[radial-gradient(circle_at_top,_#1a1a2e_0%,_#16213e_28%,_#0f1419_62%,_#0a0e27_100%)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[10%] top-[12%] h-3 w-3 rounded-full bg-violet-300/70 dark:bg-violet-500/50" />
        <span className="absolute right-[12%] top-[18%] h-2 w-2 rounded-full bg-pink-300/70 dark:bg-pink-500/50" />
        <span className="absolute bottom-[16%] left-[16%] h-2 w-12 rounded-full bg-violet-200/70 dark:bg-violet-600/50" />
        <span className="absolute bottom-[22%] right-[18%] text-2xl text-violet-300/70 dark:text-violet-400/50">✦</span>
        <span className="absolute left-[22%] top-[34%] text-xl text-pink-300/70 dark:text-pink-400/50">♡</span>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/80">
          Pass the Salt
        </p>

        <div className="mb-8 space-y-3">
          <h1 className="relative inline-block text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Login
            <span className="absolute -bottom-2 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-violet-300/80 dark:bg-violet-500/60 blur-[1px]" />
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Sign in with Clerk and the app will route you to the right workspace automatically.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(109,40,217,0.12)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] sm:p-8">
          <SignedOut>
            <div className="rounded-[1.5rem] border-2 border-dashed border-violet-200 bg-violet-50/70 px-6 py-6 text-center dark:border-violet-900/50 dark:bg-violet-950/40">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Sign in with Clerk</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                The backend verifies the session token and loads your local app role from the database.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-violet-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <SignIn
                routing="hash"
                forceRedirectUrl={appRootUrl}
                fallbackRedirectUrl={appRootUrl}
              />
            </div>

            <Link
              to="/"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-violet-200 bg-white px-6 py-4 text-base font-semibold text-violet-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:ring-violet-500/60"
            >
              Back to home
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="rounded-[1.5rem] border-2 border-dashed border-violet-200 bg-violet-50/70 px-6 py-10 text-center dark:border-violet-900/50 dark:bg-violet-950/40">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">You are signed in</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                We are loading your role and routing you to the right workspace.
              </p>
              <div className="mt-4 flex justify-center">
                <UserButton afterSignOutUrl={appRootUrl} />
              </div>
            </div>
          </SignedIn>

          {!isClerkLoaded || (isSignedIn && !backendUser) ? (
            <div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <p>Loading your account...</p>
              {backendError ? (
                <div className="space-y-2">
                  <p className="text-rose-500 dark:text-rose-400">{backendError}</p>
                  <button
                    type="button"
                    onClick={refreshBackendUser}
                    className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:ring-violet-500/60"
                  >
                    Retry account lookup
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}