import { type ReactNode, useEffect } from 'react'
import { useAuthSession } from './AuthSession'
import { getRoleHome, normalizeRole } from './roleRoutes'
import { router } from '../router/appRouter'
import type { AppRole } from '../types/auth'

type RoleGateProps = {
  role: AppRole
  children: ReactNode
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0618] px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-900/40 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-900/25 blur-[110px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40">
          <span className="text-base font-black text-white">PS</span>
        </div>
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
        <p className="max-w-xs text-sm font-medium text-white/55">{message}</p>
      </div>
    </div>
  )
}

export function RoleGate({ role, children }: RoleGateProps) {
  const { isClerkLoaded, isSignedIn, backendUser, backendError, isReady } = useAuthSession()
  const normalizedBackendRole = normalizeRole(backendUser?.role)

  useEffect(() => {
    if (!isClerkLoaded || !isReady) {
      return
    }

    if (!isSignedIn) {
      if (router.state.location.pathname !== '/login') {
        void router.navigate({ to: '/login' })
      }
      return
    }

    if (normalizedBackendRole && normalizedBackendRole !== role) {
      const redirectTo = getRoleHome(normalizedBackendRole)
      if (router.state.location.pathname !== redirectTo) {
        void router.navigate({ to: redirectTo })
      }
    }
  }, [isClerkLoaded, isReady, isSignedIn, normalizedBackendRole, role])

  if (!isClerkLoaded || (!isReady && isSignedIn)) {
    return <LoadingState message="Checking your session..." />
  }

  if (backendError) {
    return <LoadingState message={`Login recognized, but the backend could not identify this user: ${backendError}`} />
  }

  if (!isSignedIn) {
    return <LoadingState message="Redirecting to login..." />
  }

  if (normalizedBackendRole && normalizedBackendRole !== role) {
    return <LoadingState message={`Redirecting to your ${normalizedBackendRole} workspace...`} />
  }

  return <>{children}</>
}
