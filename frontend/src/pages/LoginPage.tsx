import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthSession } from '../auth/AuthSession'
import { getRoleHome } from '../auth/roleRoutes'
import { router } from '../router/appRouter'

export function LoginPage() {
  const { backendUser, backendError, refreshBackendUser } = useAuthSession()

  useEffect(() => {
    if (backendUser?.role) {
      void router.navigate({ to: getRoleHome(backendUser.role) })
    }
  }, [backendUser?.role])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0618] px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[700px] w-[700px] rounded-full bg-violet-900/50 blur-[140px]" />
        <div className="absolute -right-32 top-1/2 h-[500px] w-[500px] rounded-full bg-fuchsia-900/35 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white">PassTheSalt</h1>
        <p className="mt-2 text-sm text-white/60">Authentication tokens are disabled in this build.</p>

        {backendError ? (
          <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{backendError}</p>
        ) : (
          <p className="mt-4 text-sm text-white/50">Trying to resolve your backend user profile.</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={refreshBackendUser}
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-fuchsia-500"
          >
            Retry backend lookup
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/15"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}