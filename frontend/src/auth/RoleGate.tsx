import { type ReactNode, useEffect } from 'react'
import { useAuthSession } from './AuthSession'
import { getRoleHome } from './roleRoutes'
import { router } from '../router/appRouter'
import type { AppRole } from '../types/auth'

type RoleGateProps = {
  role: AppRole
  children: ReactNode
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-6 text-center text-slate-700">
      <div className="max-w-md rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Pass the Salt</p>
        <p className="mt-3 text-base font-medium text-slate-900">{message}</p>
      </div>
    </div>
  )
}

export function RoleGate({ role, children }: RoleGateProps) {
  const { isClerkLoaded, isSignedIn, backendUser, backendError, isReady } = useAuthSession()

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

    if (backendUser?.role && backendUser.role !== role) {
      const redirectTo = getRoleHome(backendUser.role)
      if (router.state.location.pathname !== redirectTo) {
        void router.navigate({ to: redirectTo })
      }
    }
  }, [backendUser?.role, isClerkLoaded, isReady, isSignedIn, role])

  if (!isClerkLoaded || (!isReady && isSignedIn)) {
    return <LoadingState message="Checking your session..." />
  }

  if (backendError) {
    return <LoadingState message={`Login recognized, but the backend could not identify this user: ${backendError}`} />
  }

  if (!isSignedIn) {
    return <LoadingState message="Redirecting to login..." />
  }

  if (backendUser?.role && backendUser.role !== role) {
    return <LoadingState message={`Redirecting to your ${backendUser.role} workspace...`} />
  }

  return <>{children}</>
}
