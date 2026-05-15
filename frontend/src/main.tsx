import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router/appRouter'
import { AuthSessionProvider } from './auth/AuthSession'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <RouterProvider router={router} />
      </AuthSessionProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

