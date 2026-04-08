import { WifiOff } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'

export function ConnectionLostOverlay() {
  const connectionLost = useTorrentStore((s) => s.connectionLost)

  if (!connectionLost) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface-card/80 border border-glass-border backdrop-blur-xl max-w-sm mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-accent-red/15 flex items-center justify-center">
          <WifiOff size={28} className="text-accent-red" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">Connection Lost</h2>
          <p className="text-sm text-text-secondary">
            Unable to reach qBittorrent. Retrying automatically...
          </p>
        </div>
        <div className="w-5 h-5 border-2 border-white/20 border-t-accent-red rounded-full animate-spin" />
      </div>
    </div>
  )
}
