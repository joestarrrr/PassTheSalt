import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { router } from '../router/appRouter'
import { getCurrentUser } from '../api.js'
import { getRoleHome, normalizeRole } from './roleRoutes'
import type { BackendUser } from '../types/auth'

type AuthSessionValue = {
  isClerkLoaded: boolean
  isSignedIn: boolean
  backendUser: BackendUser | null
  backendError: string | null
  authToken: string
  isReady: boolean
  refreshBackendUser: () => void
}

const AuthSessionContext = createContext<AuthSessionValue | undefined>(undefined)

function normalizeBackendUser(user: BackendUser | null): BackendUser | null {
  if (!user) {
    return null
  }

  const normalizedRole = normalizeRole(user.role)
  if (!normalizedRole || normalizedRole === user.role) {
    return user
  }

  return {
    ...user,
    role: normalizedRole,
  }
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const currentUserQuery = useQuery<BackendUser>({
    queryKey: ['current-user'],
    queryFn: () => getCurrentUser() as Promise<BackendUser>,
    retry: 2,
    retryDelay: 750,
  })

  const backendUser = normalizeBackendUser(currentUserQuery.data ?? null)
  const backendError = currentUserQuery.error instanceof Error ? currentUserQuery.error.message : null
  const isLoaded = true
  const isSignedIn = Boolean(backendUser)
  const authToken = ''

  useEffect(() => {
    if (!backendUser?.role) {
      return
    }

    const redirectTargets = new Set(['/login', '/'])
    const currentPath = router.state.location.pathname
    if (redirectTargets.has(currentPath)) {
      const redirectTo = getRoleHome(backendUser.role)
      if (currentPath !== redirectTo) {
        void router.navigate({ to: redirectTo })
      }
    }
  }, [backendUser?.role])

  const value = useMemo<AuthSessionValue>(
    () => ({
      isClerkLoaded: isLoaded,
      isSignedIn,
      backendUser,
      backendError,
      authToken,
      isReady: !currentUserQuery.isLoading,
      refreshBackendUser: () => {
        void currentUserQuery.refetch()
      },
    }),
    [
      authToken,
      backendError,
      backendUser,
      currentUserQuery.isError,
      currentUserQuery.isLoading,
      currentUserQuery.refetch,
      isSignedIn,
    ],
  )

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

export function useAuthSession() {
  const value = useContext(AuthSessionContext)

  if (!value) {
    throw new Error('useAuthSession must be used within AuthSessionProvider')
  }

  return value
}

export function useCurrentRoleHome() {
  const { backendUser } = useAuthSession()

  if (!backendUser) {
    return '/login'
  }

  const normalizedRole = normalizeRole(backendUser.role)
  return normalizedRole ? getRoleHome(normalizedRole) : '/login'
}
