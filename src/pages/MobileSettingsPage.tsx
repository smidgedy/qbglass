import { LogOut, Gauge, Palette } from 'lucide-react'
import { clsx } from 'clsx'
import { useTorrentStore } from '../store/useTorrentStore'
import { logout } from '../api/auth'
import { toggleSpeedLimitsMode } from '../api/transfer'
import { useThemeContext } from '../App'
import { themes } from '../utils/themes'

export function MobileSettingsPage() {
  const serverState = useTorrentStore((s) => s.serverState)
  const setAuthenticated = useTorrentStore((s) => s.setAuthenticated)
  const { themeId, setTheme } = useThemeContext()

  const altSpeed = serverState?.use_alt_speed_limits ?? false

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-bold px-1">Settings</h2>

      {/* Speed limits */}
      <div className="glass-panel p-4 flex flex-col gap-3">
        <button
          onClick={() => toggleSpeedLimitsMode()}
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-3">
            <Gauge size={18} className={altSpeed ? 'text-accent-amber' : 'text-text-muted'} />
            <span className="text-sm">Alternative Speed Limits</span>
          </div>
          <div role="switch" aria-checked={altSpeed} aria-label="Alternative speed limits" className={`w-10 h-6 rounded-full transition-colors ${altSpeed ? 'bg-accent-amber' : 'bg-white/10'} flex items-center`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${altSpeed ? 'translate-x-4' : ''}`} />
          </div>
        </button>
      </div>

      {/* Theme picker */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-3 mb-3">
          <Palette size={18} className="text-accent-blue" />
          <span className="text-sm font-medium">Theme</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left',
                themeId === t.id
                  ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                  : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10',
              )}
            >
              <div
                className="w-5 h-5 rounded-full shrink-0 border border-white/10"
                style={{ background: `linear-gradient(135deg, ${t.colors.bgFrom}, ${t.colors.accent})` }}
              />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="glass-panel p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-accent-red text-sm w-full py-1"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <p className="text-center text-[10px] text-text-muted mt-4">
        QBGlass &middot; qBittorrent WebUI
      </p>
    </div>
  )
}
