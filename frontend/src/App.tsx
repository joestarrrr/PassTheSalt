import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8080/hello')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.text()
        setMessage(data)
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

