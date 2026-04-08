import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { useFilteredTorrents } from '../../store/selectors'
import { useTorrentStore, type SortField } from '../../store/useTorrentStore'
import { TorrentRow } from './TorrentRow'

const COLUMNS: { field: SortField; label: string; className: string }[] = [
  { field: 'priority', label: '#', className: 'w-8 text-right justify-end' },
  { field: 'name', label: 'Name', className: 'flex-1 min-w-0' },
  { field: 'progress', label: 'Progress', className: 'w-16 text-right justify-end' },
  { field: 'speed', label: 'Speed', className: 'w-24 text-right justify-end' },
  { field: 'size', label: 'Size', className: 'w-20 text-right justify-end' },
  { field: 'eta', label: 'ETA', className: 'w-16 text-right justify-end' },
]

function ColumnHeader({ field, label, className }: { field: SortField; label: string; className: string }) {
  const sortField = useTorrentStore((s) => s.sortField)
  const sortDir = useTorrentStore((s) => s.sortDir)
  const setSort = useTorrentStore((s) => s.setSort)
  const active = sortField === field

  return (
    <button
      onClick={() => setSort(field)}
      className={clsx(
        'flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
        active ? 'text-accent-blue' : 'text-text-muted hover:text-text-secondary',
        className,
      )}
    >
      {label}
      {active && (
        sortDir === 'asc'
          ? <ChevronUp size={12} />
          : <ChevronDown size={12} />
      )}
    </button>
  )
}

export function TorrentList() {
  const torrents = useFilteredTorrents()
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: torrents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 10,
  })

  return (
    <>
      {/* Column headers */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-glass-border shrink-0">
        {/* Checkbox spacer */}
        <div className="w-5 shrink-0" />
        {/* Category badge spacer */}
        <div className="w-[13px] shrink-0" />

        {COLUMNS.map((col) => (
          <ColumnHeader key={col.field} {...col} />
        ))}
      </div>

      {torrents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-text-muted/40 text-4xl mb-3">~</div>
          <div className="text-text-secondary text-sm font-medium mb-1">No torrents found</div>
          <div className="text-text-muted text-xs">Try adjusting your filters or search</div>
        </div>
      ) : (
        <div ref={parentRef} className="flex-1 overflow-y-auto">
          <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <TorrentRow
                key={torrents[virtualItem.index].hash}
                torrent={torrents[virtualItem.index]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
