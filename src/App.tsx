import { createContext, useContext, useEffect, useState } from 'react'
import { useTorrentStore } from './store/useTorrentStore'
import { useSyncLoop } from './hooks/useSyncLoop'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useTheme } from './hooks/useTheme'
import { checkAuth } from './api/auth'
import { LoginPage } from './components/auth/LoginPage'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MobileLayout } from './components/layout/MobileLayout'

const ThemeContext = createContext<ReturnType<typeof useTheme> | null>(null)
export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeContext not found')
  return ctx
}

function SyncProvider({ children }: { children: React.ReactNode }) {
  useSyncLoop()
  return <>{children}</>
}

export default function App() {
  const authenticated = useTorrentStore((s) => s.authenticated)
  const setAuthenticated = useTorrentStore((s) => s.setAuthenticated)
  const [checking, setChecking] = useState(true)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const themeState = useTheme()

  useEffect(() => {
    checkAuth().then((ok) => {
      setAuthenticated(ok)
      setChecking(false)
    })
  }, [setAuthenticated])

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-text-secondary text-sm">Connecting...</div>
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={themeState}>
      {!authenticated ? (
        <LoginPage />
      ) : (
        <SyncProvider>
          {isMobile ? <MobileLayout /> : <DesktopLayout />}
        </SyncProvider>
      )}
    </ThemeContext.Provider>
  )
}
