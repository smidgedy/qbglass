import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { login } from '../../api/auth'
import { useTorrentStore } from '../../store/useTorrentStore'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuthenticated = useTorrentStore((s) => s.setAuthenticated)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const ok = await login(username, password)
      if (ok) {
        setAuthenticated(true)
      } else {
        setError('Invalid credentials')
      }
    } catch {
      setError('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="glass-panel p-8 w-full max-w-sm flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">QBGlass</h1>
          <p className="text-text-secondary text-sm mt-1">qBittorrent WebUI</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-surface-raised border border-glass-border
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-accent-blue/50 transition-colors"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-surface-raised border border-glass-border
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>

        {error && (
          <p className="text-accent-red text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-accent-blue/20 border border-accent-blue/30
                     text-accent-blue font-medium flex items-center justify-center gap-2
                     hover:bg-accent-blue/30 transition-colors disabled:opacity-50"
        >
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
