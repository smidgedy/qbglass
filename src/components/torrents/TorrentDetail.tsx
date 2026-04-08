import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { CategoryBadge } from './CategoryBadge'
import { DetailActions, DetailTabBar, DetailTabContent } from './DetailTabs'
import { stateToLabel, stateToColor } from '../../utils/torrentState'

export function TorrentDetail() {
  const selectedHash = useTorrentStore((s) => s.selectedHash)
  const torrent = useTorrentStore((s) => selectedHash ? s.torrents[selectedHash] : null)
  const setSelectedHash = useTorrentStore((s) => s.setSelectedHash)
  const [tab, setTab] = useState<'overview' | 'files' | 'trackers'>('overview')

  // Keep a snapshot of the last valid torrent for exit animation
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const lastTorrentRef = useRef(torrent)

  if (torrent) lastTorrentRef.current = torrent

  useEffect(() => {
    if (torrent) {
      setVisible(true)
      setClosing(false)
    } else if (visible) {
      setClosing(true)
    }
  }, [torrent, visible])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setSelectedHash(null)
      setVisible(false)
      setClosing(false)
    }, 200)
  }

  const handleAnimationEnd = () => {
    if (closing && !torrent) {
      setVisible(false)
      setClosing(false)
    }
  }

  const displayTorrent = torrent || lastTorrentRef.current
  if (!visible || !displayTorrent) return null

  return (
    <div
      className={`w-96 h-full rounded-none border-l border-glass-border flex flex-col shrink-0 overflow-hidden ${closing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
      style={{ background: 'color-mix(in oklch, var(--color-surface) 75%, transparent)', backdropFilter: 'blur(24px) saturate(1.2)', WebkitBackdropFilter: 'blur(24px) saturate(1.2)' }}
      role="dialog" aria-label="Torrent details"
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={displayTorrent.category} />
            <span className={`text-xs ${stateToColor(displayTorrent.state)}`}>{stateToLabel(displayTorrent.state)}</span>
          </div>
          <h2 className="text-sm font-medium leading-snug break-words">{displayTorrent.name}</h2>
        </div>
        <button onClick={handleClose} className="text-text-muted hover:text-text-primary mt-0.5" aria-label="Close details">
          <X size={16} />
        </button>
      </div>

      <DetailActions torrent={displayTorrent} onClose={handleClose} />
      <DetailTabBar tab={tab} setTab={setTab} />
      <DetailTabContent torrent={displayTorrent} tab={tab} />
    </div>
  )
}
