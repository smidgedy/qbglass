import { useState } from 'react'
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

  if (!torrent) return null

  return (
    <div
      className="w-96 h-full glass-panel-flat rounded-none border-y-0 border-r-0 flex flex-col shrink-0 overflow-hidden animate-slide-in-right"
      role="dialog" aria-label="Torrent details"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={torrent.category} />
            <span className={`text-xs ${stateToColor(torrent.state)}`}>{stateToLabel(torrent.state)}</span>
          </div>
          <h2 className="text-sm font-medium leading-snug break-words">{torrent.name}</h2>
        </div>
        <button onClick={() => setSelectedHash(null)} className="text-text-muted hover:text-text-primary mt-0.5" aria-label="Close details">
          <X size={16} />
        </button>
      </div>

      <DetailActions torrent={torrent} onClose={() => setSelectedHash(null)} />
      <DetailTabBar tab={tab} setTab={setTab} />
      <DetailTabContent torrent={torrent} tab={tab} />
    </div>
  )
}
