import { Link } from '@tanstack/react-router'
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useAuthSession } from '../auth/AuthSession'
import { getRoleHome } from '../auth/roleRoutes'

export function LoginPage() {
  const { backendUser, backendError, isClerkLoaded, isSignedIn, refreshBackendUser } = useAuthSession()

  useEffect(() => {
    if (backendUser?.role) {
      window.location.replace(getRoleHome(backendUser.role))
    }
  }, [backendUser?.role])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_28%,_#f8fafc_62%,_#eef2ff_100%)] px-4 py-8 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[10%] top-[12%] h-3 w-3 rounded-full bg-violet-300/70" />
        <span className="absolute right-[12%] top-[18%] h-2 w-2 rounded-full bg-pink-300/70" />
        <span className="absolute bottom-[16%] left-[16%] h-2 w-12 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-[22%] right-[18%] text-2xl text-violet-300/70">✦</span>
        <span className="absolute left-[22%] top-[34%] text-xl text-pink-300/70">♡</span>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">
          Pass the Salt
        </p>

        <div className="mb-8 space-y-3">
          <h1 className="relative inline-block text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Login
            <span className="absolute -bottom-2 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-violet-300/80 blur-[1px]" />
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
            Sign in with Clerk and the app will route you to the right workspace automatically.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(109,40,217,0.12)] backdrop-blur-sm sm:p-8">
          <SignedOut>
            <div className="rounded-[1.5rem] border-2 border-dashed border-violet-200 bg-violet-50/70 px-6 py-6 text-center">
              <p className="text-base font-semibold text-slate-700">Sign in with Clerk</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                The backend verifies the session token and loads your local app role from the database.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-violet-100 bg-white p-3">
              <SignIn />
            </div>

            <Link
              to="/"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-violet-200 bg-white px-6 py-4 text-base font-semibold text-violet-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
            >
              Back to home
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="rounded-[1.5rem] border-2 border-dashed border-violet-200 bg-violet-50/70 px-6 py-10 text-center">
              <p className="text-base font-semibold text-slate-700">You are signed in</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                We are loading your role and routing you to the right workspace.
              </p>
              <div className="mt-4 flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>

          {!isClerkLoaded || (isSignedIn && !backendUser) ? (
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p>Loading your account...</p>
              {backendError ? (
                <div className="space-y-2">
                  <p className="text-rose-500">{backendError}</p>
                  <button
                    type="button"
                    onClick={refreshBackendUser}
                    className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
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