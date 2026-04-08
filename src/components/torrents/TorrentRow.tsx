import { clsx } from 'clsx'
import { Check } from 'lucide-react'
import type { Torrent } from '../../api/types'
import { useTorrentStore } from '../../store/useTorrentStore'
import { ProgressBar } from './ProgressBar'
import { CategoryBadge } from './CategoryBadge'
import { formatSpeed, formatETA, formatSize, formatProgress } from '../../utils/format'
import { stateToLabel, stateToColor, isDownloading } from '../../utils/torrentState'

interface TorrentRowProps {
  torrent: Torrent
  style?: React.CSSProperties
}

export function TorrentRow({ torrent, style }: TorrentRowProps) {
  const selectedHash = useTorrentStore((s) => s.selectedHash)
  const setSelectedHash = useTorrentStore((s) => s.setSelectedHash)
  const selectedHashes = useTorrentStore((s) => s.selectedHashes)
  const toggleSelected = useTorrentStore((s) => s.toggleSelected)
  const isDetailSelected = selectedHash === torrent.hash
  const isChecked = !!selectedHashes[torrent.hash]
  const hasSelection = Object.keys(selectedHashes).length > 0

  const t = torrent
  const hasDownSpeed = t.dlspeed > 0
  const hasUpSpeed = t.upspeed > 0

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || hasSelection) {
      e.preventDefault()
      toggleSelected(t.hash)
    } else {
      setSelectedHash(isDetailSelected ? null : t.hash)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSelected(t.hash)
  }

  return (
    <div
      style={style}
      onClick={handleClick}
      className={clsx(
        'h-16 px-4 flex items-center gap-3 border-b border-white/5 cursor-pointer transition-all duration-150',
        isChecked ? 'bg-accent-blue/10' : isDetailSelected ? 'bg-white/10' : 'hover:bg-white/[0.07]',
      )}
    >
      {/* Checkbox */}
      <div
        onClick={handleCheckboxClick}
        className={clsx(
          'w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-150',
          isChecked
            ? 'bg-accent-blue border-accent-blue scale-110'
            : 'border-white/20 hover:border-white/40 hover:scale-110',
        )}
      >
        {isChecked && <Check size={13} strokeWidth={3} className="text-white" />}
      </div>

      {/* Category icon */}
      <CategoryBadge category={t.category} />

      {/* Name + progress */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" title={t.name}>{t.name}</div>
        <div className="flex items-center gap-3 mt-1">
          <ProgressBar progress={t.progress} state={t.state} className="flex-1" />
          <span className="text-[11px] font-mono text-text-muted w-12 text-right shrink-0 tabular-nums">
            {formatProgress(t.progress)}
          </span>
        </div>
      </div>

      {/* Speed / State */}
      <div className="w-24 text-right shrink-0">
        {hasDownSpeed ? (
          <div className="text-xs font-mono text-accent-blue tabular-nums">{formatSpeed(t.dlspeed)}</div>
        ) : hasUpSpeed ? (
          <div className="text-xs font-mono text-accent-green tabular-nums">{formatSpeed(t.upspeed)}</div>
        ) : (
          <div className={clsx('text-xs', stateToColor(t.state))}>{stateToLabel(t.state)}</div>
        )}
        {hasDownSpeed && hasUpSpeed && (
          <div className="text-[10px] font-mono text-accent-green mt-0.5 tabular-nums">{formatSpeed(t.upspeed)}</div>
        )}
      </div>

      {/* Size */}
      <div className="w-20 text-right shrink-0">
        <div className="text-xs font-mono text-text-secondary tabular-nums">{formatSize(t.size)}</div>
        <div className="text-[10px] font-mono text-text-muted mt-0.5 tabular-nums">
          R: {t.ratio.toFixed(2)}
        </div>
      </div>

      {/* ETA */}
      <div className="w-16 text-right shrink-0">
        {isDownloading(t.state) && t.eta > 0 && t.eta < 8640000 ? (
          <div className="text-xs font-mono text-text-secondary tabular-nums">{formatETA(t.eta)}</div>
        ) : (
          <div className="text-xs font-mono text-text-muted">&mdash;</div>
        )}
      </div>
    </div>
  )
}
