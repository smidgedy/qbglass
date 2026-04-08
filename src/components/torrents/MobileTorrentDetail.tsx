import { useState } from 'react'
import { X } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { ProgressBar } from './ProgressBar'
import { CategoryBadge } from './CategoryBadge'
import { DetailActions, DetailTabBar, DetailTabContent } from './DetailTabs'
import { formatSpeed, formatProgress } from '../../utils/format'
import { stateToLabel, stateToColor } from '../../utils/torrentState'

interface MobileTorrentDetailProps {
  hash: string
  onClose: () => void
}

export function MobileTorrentDetail({ hash, onClose }: MobileTorrentDetailProps) {
  const torrent = useTorrentStore((s) => s.torrents[hash])
  const [tab, setTab] = useState<'overview' | 'files' | 'trackers'>('overview')

  if (!torrent) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose} role="dialog" aria-modal="true" aria-label="Torrent details">
      <div className="flex-1 bg-black/40" />

      <div
        className="rounded-t-2xl border border-glass-border border-b-0 max-h-[85vh] flex flex-col animate-slide-up"
        style={{ background: 'var(--color-surface-solid)', backdropFilter: 'blur(20px) saturate(1.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center py-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-glass-border shrink-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CategoryBadge category={torrent.category} />
                <span className={`text-xs ${stateToColor(torrent.state)}`}>{stateToLabel(torrent.state)}</span>
              </div>
              <h2 className="text-sm font-medium leading-snug break-words">{torrent.name}</h2>
            </div>
            <button onClick={onClose} className="text-text-muted p-1" aria-label="Close details">
              <X size={18} />
            </button>
          </div>

          {/* Progress summary */}
          <div className="mt-3">
            <ProgressBar progress={torrent.progress} state={torrent.state} />
            <div className="flex items-center justify-between mt-1.5 text-xs">
              <span className="font-mono text-text-secondary">{formatProgress(torrent.progress)}</span>
              <div className="flex gap-3">
                {torrent.dlspeed > 0 && <span className="font-mono text-accent-blue">{formatSpeed(torrent.dlspeed)}</span>}
                {torrent.upspeed > 0 && <span className="font-mono text-accent-green">{formatSpeed(torrent.upspeed)}</span>}
              </div>
            </div>
          </div>
        </div>

        <DetailActions torrent={torrent} onClose={onClose} />
        <DetailTabBar tab={tab} setTab={setTab} />
        <DetailTabContent torrent={torrent} tab={tab} />
      </div>
    </div>
  )
}
