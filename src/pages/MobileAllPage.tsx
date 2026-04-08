import { useRef, useMemo, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Plus } from 'lucide-react'
import { clsx } from 'clsx'
import { useTorrentStore } from '../store/useTorrentStore'
import { ProgressBar } from '../components/torrents/ProgressBar'
import { CategoryBadge } from '../components/torrents/CategoryBadge'
import { MobileTorrentDetail } from '../components/torrents/MobileTorrentDetail'
import { AddTorrentDialog } from '../components/torrents/AddTorrentDialog'
import { formatSpeed } from '../utils/format'
import { stateToColor } from '../utils/torrentState'
import { SearchBar } from '../components/shared/SearchBar'
import { getCategoryConfig } from '../utils/categories'
import { FILTER_DEFS, matchesFilterDef, type FilterId } from '../utils/filterDefs'
import type { Torrent } from '../api/types'

export function MobileAllPage() {
  const allTorrents = useTorrentStore((s) => s.torrents)
  const categories = useTorrentStore((s) => s.categories)
  const search = useTorrentStore((s) => s.searchQuery)
  const [filter, setFilter] = useState<FilterId>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [detailHash, setDetailHash] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  const torrents = useMemo(() => {
    let list = Object.values(allTorrents)

    if (filter !== 'all') {
      list = list.filter((t) => matchesFilterDef(t.state, filter))
    }
    if (categoryFilter) {
      list = list.filter((t) => t.category === categoryFilter)
    }
    if (search) {
      const lower = search.toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(lower))
    }

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
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar" role="tablist" aria-label="Torrent filters">
        {FILTER_DEFS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0',
              filter === f.value
                ? 'bg-accent-blue/25 text-accent-blue border border-accent-blue/40'
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
                      {t.dlspeed > 0 ? formatSpeed(t.dlspeed) : ''}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FAB: Add torrent */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40"
        aria-label="Add torrent"
        style={{ boxShadow: '0 4px 20px color-mix(in oklch, var(--color-accent-blue) 40%, transparent)' }}
      >
        <Plus size={24} />
      </button>

      {detailHash && <MobileTorrentDetail hash={detailHash} onClose={() => setDetailHash(null)} />}
      {showAddDialog && <AddTorrentDialog onClose={() => setShowAddDialog(false)} />}
    </div>
  )
}
