import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth, useUser } from '@clerk/clerk-react'
import { router } from '../router/appRouter'
import { getCurrentUser } from '../api.js'
import { clearSessionToken, setSessionToken } from './sessionToken'
import { getRoleHome } from './roleRoutes'
import type { BackendUser } from '../types/auth'

type AuthSessionValue = {
  isClerkLoaded: boolean
  isSignedIn: boolean
  clerkEmail: string
  backendUser: BackendUser | null
  backendError: string | null
  authToken: string
  isReady: boolean
  refreshBackendUser: () => void
}

const AuthSessionContext = createContext<AuthSessionValue | undefined>(undefined)

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const clerkEmail = user?.primaryEmailAddress?.emailAddress?.trim() ?? ''
  const [authToken, setAuthToken] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!isLoaded) {
      return () => {
        cancelled = true
      }
    }

    if (!isSignedIn) {
      clearSessionToken()
      setAuthToken('')
      return () => {
        cancelled = true
      }
    }

    void getToken().then((token) => {
      if (cancelled) {
        return
      }

      const nextToken = token?.trim() ?? ''
      setAuthToken(nextToken)
      if (nextToken) {
        setSessionToken(nextToken)
      }
    })

    return () => {
      cancelled = true
    }
  }, [getToken, isLoaded, isSignedIn])

  const currentUserQuery = useQuery<BackendUser>({
    queryKey: ['current-user', authToken],
    queryFn: () => getCurrentUser(authToken, clerkEmail) as Promise<BackendUser>,
    enabled: isLoaded && isSignedIn && Boolean(authToken),
    retry: 2,
    retryDelay: 750,
  })

  const backendUser = currentUserQuery.data ?? null
  const backendError = currentUserQuery.error instanceof Error ? currentUserQuery.error.message : null

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !backendUser?.role) {
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
  }, [backendUser?.role, isLoaded, isSignedIn])

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (!isSignedIn) {
      clearSessionToken()
      return
    }

    if (authToken) {
      setSessionToken(authToken)
    }
  }, [authToken, isLoaded, isSignedIn])

  const value = useMemo<AuthSessionValue>(
    () => ({
      isClerkLoaded: isLoaded,
      isSignedIn: Boolean(isSignedIn),
      clerkEmail,
      backendUser,
      backendError,
      authToken,
      isReady: isLoaded && (!isSignedIn || currentUserQuery.isSuccess || currentUserQuery.isError),
      refreshBackendUser: () => {
        void currentUserQuery.refetch()
      },
    }),
    [
      authToken,
      backendError,
      backendUser,
      clerkEmail,
      currentUserQuery.isError,
      currentUserQuery.isSuccess,
      currentUserQuery.refetch,
      isLoaded,
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

  return getRoleHome(backendUser.role)
}
