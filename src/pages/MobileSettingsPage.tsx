import { LogOut, Gauge } from 'lucide-react'
import { useTorrentStore } from '../store/useTorrentStore'
import { logout } from '../api/auth'
import { toggleSpeedLimitsMode } from '../api/transfer'
import { GlassCard } from '../components/shared/GlassCard'

export function MobileSettingsPage() {
  const serverState = useTorrentStore((s) => s.serverState)
  const setAuthenticated = useTorrentStore((s) => s.setAuthenticated)

  const altSpeed = serverState?.use_alt_speed_limits ?? false

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-bold px-1">Settings</h2>

      <GlassCard className="p-4 flex flex-col gap-3">
        <button
          onClick={() => toggleSpeedLimitsMode()}
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-3">
            <Gauge size={18} className={altSpeed ? 'text-accent-amber' : 'text-text-muted'} />
            <span className="text-sm">Alternative Speed Limits</span>
          </div>
          <div className={`w-10 h-6 rounded-full transition-colors ${altSpeed ? 'bg-accent-amber' : 'bg-white/10'} flex items-center`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${altSpeed ? 'translate-x-4' : ''}`} />
          </div>
        </button>
      </GlassCard>

      <GlassCard className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-accent-red text-sm w-full py-1"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </GlassCard>

      <p className="text-center text-[10px] text-text-muted mt-4">
        QBGlass &middot; qBittorrent WebUI
      </p>
    </div>
  )
}
