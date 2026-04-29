import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router/appRouter'
import { AuthSessionProvider } from './auth/AuthSession'
import { getAppRootUrl } from './auth/appUrls'
import './index.css'

const queryClient = new QueryClient()
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const appRootUrl = getAppRootUrl()

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in frontend/.env')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      afterSignOutUrl={appRootUrl}
      signInFallbackRedirectUrl={appRootUrl}
      signInForceRedirectUrl={appRootUrl}
      signUpFallbackRedirectUrl={appRootUrl}
      signUpForceRedirectUrl={appRootUrl}
    >
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>
          <RouterProvider router={router} />
        </AuthSessionProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
)

