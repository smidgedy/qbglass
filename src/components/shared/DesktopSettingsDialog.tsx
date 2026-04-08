import { X, Gauge, Palette, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useTorrentStore } from '../../store/useTorrentStore'
import { logout } from '../../api/auth'
import { toggleSpeedLimitsMode } from '../../api/transfer'
import { useThemeContext } from '../../App'
import { themes } from '../../utils/themes'

export function DesktopSettingsDialog({ onClose }: { onClose: () => void }) {
  const serverState = useTorrentStore((s) => s.serverState)
  const setAuthenticated = useTorrentStore((s) => s.setAuthenticated)
  const { themeId, setTheme } = useThemeContext()
  const altSpeed = serverState?.use_alt_speed_limits ?? false

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="rounded-2xl border border-glass-border p-6 w-full max-w-lg relative z-10 flex flex-col gap-5"
        style={{
          background: 'var(--color-surface-solid)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          boxShadow: '0 8px 48px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={18} />
          </button>
        </div>

        {/* Speed limits */}
        <div className="flex items-center justify-between py-2 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <Gauge size={18} className={altSpeed ? 'text-accent-amber' : 'text-text-muted'} />
            <span className="text-sm">Alternative Speed Limits</span>
          </div>
          <button
            onClick={() => toggleSpeedLimitsMode()}
            className={`w-10 h-6 rounded-full transition-colors ${altSpeed ? 'bg-accent-amber' : 'bg-white/10'} flex items-center`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${altSpeed ? 'translate-x-4' : ''}`} />
          </button>
        </div>

        {/* Theme picker */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Palette size={18} className="text-accent-blue" />
            <span className="text-sm font-medium">Theme</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
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
        <div className="pt-2 border-t border-glass-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-accent-red text-sm py-1 hover:text-accent-red/80 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
