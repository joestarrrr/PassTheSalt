import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


console.log('Clerk Publishable Key:', key)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

