import { useEffect, useState } from 'react'
import { useTorrentStore } from './store/useTorrentStore'
import { useSyncLoop } from './hooks/useSyncLoop'
import { useMediaQuery } from './hooks/useMediaQuery'
import { checkAuth } from './api/auth'
import { LoginPage } from './components/auth/LoginPage'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MobileLayout } from './components/layout/MobileLayout'

function SyncProvider({ children }: { children: React.ReactNode }) {
  useSyncLoop()
  return <>{children}</>
}

export default function App() {
  const authenticated = useTorrentStore((s) => s.authenticated)
  const setAuthenticated = useTorrentStore((s) => s.setAuthenticated)
  const [checking, setChecking] = useState(true)
  const isMobile = useMediaQuery('(max-width: 767px)')

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

  if (!authenticated) {
    return <LoginPage />
  }

  return (
    <SyncProvider>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </SyncProvider>
  )
}
