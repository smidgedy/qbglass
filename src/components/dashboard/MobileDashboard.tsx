import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Activity, Upload, Clock, HardDrive, ChevronUp, Pause, Play } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { useActiveTorrentCount, useStateCount, ACTIVE_STATES } from '../../store/selectors'
import { FILTER_DEFS } from '../../utils/filterDefs'
import type { TorrentState } from '../../api/types'

const DOWNLOADING_STATES = FILTER_DEFS.find((f) => f.value === 'downloading')!.states as Set<TorrentState>
const SEEDING_STATES = FILTER_DEFS.find((f) => f.value === 'seeding')!.states as Set<TorrentState>
import { formatSpeed, formatSize, formatETA } from '../../utils/format'
import { GlassCard } from '../shared/GlassCard'
import { ProgressBar } from '../torrents/ProgressBar'
import { CategoryBadge } from '../torrents/CategoryBadge'
import { MobileTorrentDetail } from '../torrents/MobileTorrentDetail'
import { canResume } from '../../utils/torrentState'
import { pauseTorrents, resumeTorrents } from '../../api/torrents'
import type { Torrent } from '../../api/types'

export function MobileDashboard() {
  const serverState = useTorrentStore((s) => s.serverState)
  const torrents = useTorrentStore((s) => s.torrents)
  const activeCount = useActiveTorrentCount()
  const downloadingCount = useStateCount(DOWNLOADING_STATES)
  const seedingCount = useStateCount(SEEDING_STATES)
  const totalCount = Object.keys(torrents).length
  const [detailHash, setDetailHash] = useState<string | null>(null)

  const activeTorrents = useMemo(() =>
    Object.values(torrents)
      .filter((t) => ACTIVE_STATES.has(t.state))
      .sort((a, b) => b.dlspeed - a.dlspeed || b.upspeed - a.upspeed || a.name.localeCompare(b.name)),
    [torrents],
  )

  if (!serverState) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        Connecting...
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* === First fold: Overview (viewport height minus bottom nav) === */}
      <div className="p-4 flex flex-col gap-4" style={{ minHeight: 'calc(100dvh - 4rem)' }}>
        {/* Header */}
        <div className="text-center py-2">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-accent-blue">QB</span>Glass
          </h1>
        </div>

        {/* Speed card */}
        <GlassCard className="p-6" glow={serverState.dl_info_speed > 0 ? 'blue' : undefined}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center flex-1">
              <ArrowDown size={20} className="text-accent-blue mb-1" />
              <span className="text-3xl font-bold font-mono text-accent-blue">
                {formatSpeed(serverState.dl_info_speed)}
              </span>
              <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Download</span>
            </div>
            <div className="w-px h-16 bg-glass-border" />
            <div className="flex flex-col items-center flex-1">
              <ArrowUp size={20} className="text-accent-green mb-1" />
              <span className="text-3xl font-bold font-mono text-accent-green">
                {formatSpeed(serverState.up_info_speed)}
              </span>
              <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Upload</span>
            </div>
          </div>
        </GlassCard>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 flex items-center gap-3">
            <Activity size={18} className="text-accent-blue shrink-0" />
            <div>
              <div className="text-2xl font-bold font-mono">{downloadingCount}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Downloading</div>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-3">
            <Upload size={18} className="text-accent-green shrink-0" />
            <div>
              <div className="text-2xl font-bold font-mono">{seedingCount}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Seeding</div>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-3">
            <Clock size={18} className="text-accent-amber shrink-0" />
            <div>
              <div className="text-2xl font-bold font-mono">{totalCount - activeCount}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Queued</div>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-3">
            <HardDrive size={18} className="text-text-secondary shrink-0" />
            <div>
              <div className="text-lg font-bold font-mono">{formatSize(serverState.free_space_on_disk)}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Free Space</div>
            </div>
          </GlassCard>
        </div>

        {/* Session totals */}
        <GlassCard className="p-4">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Session DL</span>
            <span className="font-mono text-text-secondary">{formatSize(serverState.dl_info_data)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-text-muted">Session UL</span>
            <span className="font-mono text-text-secondary">{formatSize(serverState.up_info_data)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-text-muted">Peers</span>
            <span className="font-mono text-text-secondary">{serverState.total_peer_connections}</span>
          </div>
        </GlassCard>

        {/* Swipe hint — push to bottom of fold */}
        <div className="flex-1" />
        {activeTorrents.length > 0 && (
          <div className="flex flex-col items-center pb-2 animate-bounce">
            <ChevronUp size={20} className="text-text-muted" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">
              {activeTorrents.length} active torrent{activeTorrents.length !== 1 && 's'}
            </span>
          </div>
        )}
      </div>

      {/* === Second fold: Active torrent list === */}
      {activeTorrents.length > 0 && (
        <div style={{ minHeight: 'calc(100dvh - 4rem)' }}>
          {/* Sticky header */}
          <div className="sticky top-0 z-10 glass-panel-flat rounded-none border-x-0 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Active Torrents
            </span>
            <span className="text-xs font-mono text-accent-blue">{activeTorrents.length}</span>
          </div>

          {/* Torrent rows */}
          {activeTorrents.map((t) => (
            <ActiveTorrentRow key={t.hash} torrent={t} onTap={() => setDetailHash(t.hash)} />
          ))}

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      )}

      {/* Detail sheet */}
      {detailHash && (
        <MobileTorrentDetail hash={detailHash} onClose={() => setDetailHash(null)} />
      )}
    </div>
  )
}

function ActiveTorrentRow({ torrent: t, onTap }: { torrent: Torrent; onTap: () => void }) {
  const resumable = canResume(t.state)

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (resumable) resumeTorrents([t.hash])
    else pauseTorrents([t.hash])
  }

  return (
    <div className="px-4 py-3 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer" onClick={onTap}>
      <div className="flex items-center gap-2 mb-1.5">
        <CategoryBadge category={t.category} />
        <span className="text-sm font-medium truncate flex-1">{t.name}</span>
        <button
          onClick={handleAction}
          className="shrink-0 p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-text-primary transition-colors active:bg-white/10"
        >
          {resumable ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <ProgressBar progress={t.progress} state={t.state} className="mb-1.5" />
      <div className="flex items-center gap-3 text-xs">
        {t.dlspeed > 0 && (
          <span className="font-mono text-accent-blue">{formatSpeed(t.dlspeed)}</span>
        )}
        {t.upspeed > 0 && (
          <span className="font-mono text-accent-green">{formatSpeed(t.upspeed)}</span>
        )}
        {t.eta > 0 && t.eta < 8640000 && (
          <span className="font-mono text-text-muted">{formatETA(t.eta)}</span>
        )}
        <span className="font-mono text-text-muted ml-auto">
          {(t.progress * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}
