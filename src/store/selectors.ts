import { useMemo } from 'react'
import { useTorrentStore, type FilterState, type SortField, type SortDir } from './useTorrentStore'
import type { Torrent, TorrentState } from '../api/types'

const ACTIVE_STATES = new Set<TorrentState>([
  'downloading', 'uploading', 'stalledDL', 'stalledUP',
  'metaDL', 'forcedDL', 'forcedUP', 'error', 'missingFiles',
])

const DOWNLOADING_STATES = new Set<TorrentState>([
  'downloading', 'stalledDL', 'metaDL', 'forcedDL', 'queuedDL',
])

const SEEDING_STATES = new Set<TorrentState>([
  'uploading', 'stalledUP', 'forcedUP',
])

const COMPLETED_STATES = new Set<TorrentState>([
  'stoppedUP', 'pausedUP', 'queuedUP',
])

const STALLED_STATES = new Set<TorrentState>([
  'stalledDL', 'stalledUP',
])

const METADATA_STATES = new Set<TorrentState>([
  'metaDL',
])

function matchesFilter(t: Torrent, filter: FilterState): boolean {
  switch (filter) {
    case 'active': return ACTIVE_STATES.has(t.state)
    case 'downloading': return DOWNLOADING_STATES.has(t.state)
    case 'seeding': return SEEDING_STATES.has(t.state)
    case 'completed': return COMPLETED_STATES.has(t.state)
    case 'stalled': return STALLED_STATES.has(t.state)
    case 'metadata': return METADATA_STATES.has(t.state)
    case 'all': return true
  }
}

function getSortValue(t: Torrent, field: SortField): number | string {
  switch (field) {
    case 'name': return t.name.toLowerCase()
    case 'size': return t.size
    case 'progress': return t.progress
    case 'speed': return t.dlspeed + t.upspeed
    case 'eta': return (t.eta <= 0 || t.eta >= 8640000) ? Infinity : t.eta
    case 'ratio': return t.ratio
    case 'added': return t.added_on
    case 'state': return t.state
  }
}

function compareTorrents(a: Torrent, b: Torrent, field: SortField, dir: SortDir): number {
  const va = getSortValue(a, field)
  const vb = getSortValue(b, field)

  // For ETA sort: items with no ETA (Infinity) always go to the bottom regardless of direction
  if (field === 'eta') {
    const aInf = va === Infinity
    const bInf = vb === Infinity
    if (aInf && !bInf) return 1
    if (!aInf && bInf) return -1
    if (aInf && bInf) return 0
  }

  let cmp = 0
  if (typeof va === 'string' && typeof vb === 'string') cmp = va.localeCompare(vb)
  else if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb
  return dir === 'desc' ? -cmp : cmp
}

export function useFilteredTorrents(): Torrent[] {
  const torrents = useTorrentStore((s) => s.torrents)
  const filter = useTorrentStore((s) => s.filterState)
  const category = useTorrentStore((s) => s.categoryFilter)
  const search = useTorrentStore((s) => s.searchQuery)
  const sortField = useTorrentStore((s) => s.sortField)
  const sortDir = useTorrentStore((s) => s.sortDir)

  return useMemo(() => {
    const list = Object.values(torrents)
    const searchLower = search.toLowerCase()

    return list
      .filter((t) => matchesFilter(t, filter))
      .filter((t) => !category || t.category === category)
      .filter((t) => !search || t.name.toLowerCase().includes(searchLower))
      .sort((a, b) => compareTorrents(a, b, sortField, sortDir))
  }, [torrents, filter, category, search, sortField, sortDir])
}

export function useActiveTorrentCount(): number {
  const torrents = useTorrentStore((s) => s.torrents)
  return useMemo(
    () => Object.values(torrents).filter((t) => ACTIVE_STATES.has(t.state)).length,
    [torrents],
  )
}

export function useCategoryCounts(): Record<string, { total: number; active: number }> {
  const torrents = useTorrentStore((s) => s.torrents)
  return useMemo(() => {
    const counts: Record<string, { total: number; active: number }> = {}
    for (const t of Object.values(torrents)) {
      const cat = t.category || '(uncategorized)'
      if (!counts[cat]) counts[cat] = { total: 0, active: 0 }
      counts[cat].total++
      if (ACTIVE_STATES.has(t.state)) counts[cat].active++
    }
    return counts
  }, [torrents])
}

export function useStateCount(states: Set<TorrentState>): number {
  const torrents = useTorrentStore((s) => s.torrents)
  return useMemo(
    () => Object.values(torrents).filter((t) => states.has(t.state)).length,
    [torrents, states],
  )
}

export { ACTIVE_STATES, DOWNLOADING_STATES, SEEDING_STATES, COMPLETED_STATES, STALLED_STATES, METADATA_STATES, matchesFilter }
