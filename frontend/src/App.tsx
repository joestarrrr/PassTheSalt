import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_PROD_BACKEND_URL = 'https://passthesalt-production.up.railway.app'
const IS_LOCAL_HOST =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const BACKEND_URL =
  typeof __BACKEND_URL__ !== 'undefined' && __BACKEND_URL__
    ? __BACKEND_URL__
    : IS_LOCAL_HOST
      ? 'http://localhost:8080'
      : DEFAULT_PROD_BACKEND_URL

const API_ROOT_URL = `${BACKEND_URL}/`

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_ROOT_URL}api/auth/me`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setMessage(data.email || data.fullName || 'Authenticated backend response received')
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setMessage('')
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [])

  return (
    <div className="app">
      <h1>PassTheSalt</h1>
      <div className="container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {message && <p className="message">Message from backend: <strong>{message}</strong></p>}
      </div>
    </div>
  )
}

export default App

