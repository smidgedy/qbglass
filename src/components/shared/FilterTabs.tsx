import { useMemo } from 'react'
import { clsx } from 'clsx'
import { useTorrentStore } from '../../store/useTorrentStore'
import { FILTER_DEFS, matchesFilterDef, type FilterId } from '../../utils/filterDefs'

export function FilterTabs() {
  const filterState = useTorrentStore((s) => s.filterState)
  const setFilterState = useTorrentStore((s) => s.setFilterState)
  const setCategoryFilter = useTorrentStore((s) => s.setCategoryFilter)
  const torrents = useTorrentStore((s) => s.torrents)

  const counts = useMemo(() => {
    const all = Object.values(torrents)
    const result: Record<string, number> = {}
    for (const f of FILTER_DEFS) {
      result[f.value] = all.filter((t) => matchesFilterDef(t.state, f.value)).length
    }
    return result
  }, [torrents])

  return (
    <div className="flex gap-1" role="tablist" aria-label="Torrent filters">
      {FILTER_DEFS.map((f) => (
        <button
          key={f.value}
          role="tab"
          aria-selected={filterState === f.value}
          onClick={() => { setFilterState(f.value as FilterId); setCategoryFilter(null) }}
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
