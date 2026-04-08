import { useMemo } from 'react'
import { clsx } from 'clsx'
import { useTorrentStore, type FilterState } from '../../store/useTorrentStore'
import { matchesFilter } from '../../store/selectors'

const FILTERS: { value: FilterState; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'downloading', label: 'Downloading' },
  { value: 'seeding', label: 'Seeding' },
  { value: 'completed', label: 'Completed' },
  { value: 'stalled', label: 'Stalled' },
  { value: 'metadata', label: 'Metadata' },
  { value: 'all', label: 'All' },
]

export function FilterTabs() {
  const filterState = useTorrentStore((s) => s.filterState)
  const setFilterState = useTorrentStore((s) => s.setFilterState)
  const setCategoryFilter = useTorrentStore((s) => s.setCategoryFilter)
  const torrents = useTorrentStore((s) => s.torrents)

  const counts = useMemo(() => {
    const all = Object.values(torrents)
    const result: Record<string, number> = {}
    for (const f of FILTERS) {
      result[f.value] = all.filter((t) => matchesFilter(t, f.value)).length
    }
    return result
  }, [torrents])

  return (
    <div className="flex gap-1">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => { setFilterState(f.value); setCategoryFilter(null) }}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
            filterState === f.value
              ? 'bg-white/10 text-text-primary'
              : 'text-text-muted hover:text-text-secondary hover:bg-white/5',
          )}
        >
          {f.label}
          <span className={clsx(
            'font-mono text-[10px] tabular-nums',
            filterState === f.value ? 'text-accent-blue' : 'text-text-muted/60',
          )}>
            {counts[f.value]}
          </span>
        </button>
      ))}
    </div>
  )
}
