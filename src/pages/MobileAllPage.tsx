import { useRef, useMemo, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { clsx } from 'clsx'
import { useTorrentStore } from '../store/useTorrentStore'
import { ProgressBar } from '../components/torrents/ProgressBar'
import { CategoryBadge } from '../components/torrents/CategoryBadge'
import { MobileTorrentDetail } from '../components/torrents/MobileTorrentDetail'
import { formatSpeed } from '../utils/format'
import { stateToLabel, stateToColor } from '../utils/torrentState'
import { SearchBar } from '../components/shared/SearchBar'
import { getCategoryConfig } from '../utils/categories'
import type { Torrent, TorrentState } from '../api/types'

type MobileFilter = 'all' | 'active' | 'downloading' | 'seeding' | 'completed' | 'stalled' | 'metadata' | 'queued'

const FILTER_DEFS: { value: MobileFilter; label: string; states?: Set<TorrentState> }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active', states: new Set(['downloading', 'uploading', 'stalledDL', 'stalledUP', 'metaDL', 'forcedDL', 'forcedUP', 'error', 'missingFiles']) },
  { value: 'downloading', label: 'Downloading', states: new Set(['downloading', 'stalledDL', 'metaDL', 'forcedDL', 'queuedDL']) },
  { value: 'seeding', label: 'Seeding', states: new Set(['uploading', 'stalledUP', 'forcedUP']) },
  { value: 'completed', label: 'Completed', states: new Set(['stoppedUP', 'pausedUP', 'queuedUP']) },
  { value: 'stalled', label: 'Stalled', states: new Set(['stalledDL', 'stalledUP']) },
  { value: 'metadata', label: 'Metadata', states: new Set(['metaDL']) },
  { value: 'queued', label: 'Queued', states: new Set(['queuedDL', 'stoppedDL', 'pausedDL']) },
]

export function MobileAllPage() {
  const allTorrents = useTorrentStore((s) => s.torrents)
  const categories = useTorrentStore((s) => s.categories)
  const search = useTorrentStore((s) => s.searchQuery)
  const [filter, setFilter] = useState<MobileFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [detailHash, setDetailHash] = useState<string | null>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const torrents = useMemo(() => {
    let list = Object.values(allTorrents)

    // State filter
    const filterDef = FILTER_DEFS.find((f) => f.value === filter)
    if (filterDef?.states) {
      list = list.filter((t) => filterDef.states!.has(t.state))
    }

    // Category filter
    if (categoryFilter) {
      list = list.filter((t) => t.category === categoryFilter)
    }

    // Search
    if (search) {
      const lower = search.toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(lower))
    }

    // Sort: active first by speed, then alphabetical
    return list.sort((a, b) => {
      if (a.dlspeed !== b.dlspeed) return b.dlspeed - a.dlspeed
      if (a.upspeed !== b.upspeed) return b.upspeed - a.upspeed
      return a.name.localeCompare(b.name)
    })
  }, [allTorrents, filter, categoryFilter, search]) as Torrent[]

  const virtualizer = useVirtualizer({
    count: torrents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  })

  const categoryNames = Object.keys(categories)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <SearchBar />
      </div>

      {/* State filter chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
        {FILTER_DEFS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0',
              filter === f.value
                ? 'bg-accent-blue/25 text-accent-blue border border-accent-blue/40 shadow-[0_0_12px_oklch(0.7_0.15_240_/_0.2)]'
                : 'bg-white/5 text-text-secondary border border-white/10 active:bg-white/10',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category filter chips */}
      {categoryNames.length > 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
          {categoryNames.map((cat) => {
            const config = getCategoryConfig(cat)
            const active = categoryFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(active ? null : cat)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                  active
                    ? `bg-white/15 border border-white/25 ${config.colorClass}`
                    : 'bg-white/5 text-text-secondary border border-white/10 active:bg-white/10',
                )}
              >
                {config.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Count */}
      <div className="px-4 py-1.5 text-[10px] text-text-muted uppercase tracking-wider shrink-0">
        {torrents.length} torrent{torrents.length !== 1 && 's'}
      </div>

      {/* Virtual list */}
      <div ref={parentRef} className="flex-1 overflow-y-auto">
        {torrents.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-text-muted text-sm">
            No torrents match filters
          </div>
        ) : (
          <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualizer.getVirtualItems().map((item) => {
              const t = torrents[item.index]
              return (
                <div
                  key={t.hash}
                  className="absolute left-0 w-full px-4 py-2 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer"
                  style={{
                    height: `${item.size}px`,
                    transform: `translateY(${item.start}px)`,
                  }}
                  onClick={() => setDetailHash(t.hash)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={t.category} />
                    <span className="text-xs font-medium truncate flex-1">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar progress={t.progress} state={t.state} className="flex-1" />
                    <span className={`text-[10px] font-mono shrink-0 ${stateToColor(t.state)}`}>
                      {t.dlspeed > 0 ? formatSpeed(t.dlspeed) : stateToLabel(t.state)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail sheet */}
      {detailHash && (
        <MobileTorrentDetail hash={detailHash} onClose={() => setDetailHash(null)} />
      )}
    </div>
  )
}
