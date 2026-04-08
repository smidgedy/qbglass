import type { TorrentState } from '../api/types'

export type FilterId = 'all' | 'active' | 'downloading' | 'seeding' | 'completed' | 'stalled' | 'metadata' | 'queued'

export interface FilterDef {
  value: FilterId
  label: string
  states: Set<TorrentState> | null
}

export const FILTER_DEFS: FilterDef[] = [
  { value: 'all', label: 'All', states: null },
  { value: 'active', label: 'Active', states: new Set(['downloading', 'uploading', 'stalledDL', 'stalledUP', 'metaDL', 'forcedDL', 'forcedUP', 'error', 'missingFiles']) },
  { value: 'downloading', label: 'Downloading', states: new Set(['downloading', 'stalledDL', 'metaDL', 'forcedDL', 'queuedDL']) },
  { value: 'seeding', label: 'Seeding', states: new Set(['uploading', 'stalledUP', 'forcedUP']) },
  { value: 'completed', label: 'Completed', states: new Set(['stoppedUP', 'pausedUP', 'queuedUP']) },
  { value: 'stalled', label: 'Stalled', states: new Set(['stalledDL', 'stalledUP']) },
  { value: 'metadata', label: 'Metadata', states: new Set(['metaDL']) },
  { value: 'queued', label: 'Queued', states: new Set(['queuedDL', 'stoppedDL', 'pausedDL']) },
]

export function matchesFilterDef(state: TorrentState, filterId: FilterId): boolean {
  const def = FILTER_DEFS.find((f) => f.value === filterId)
  if (!def || !def.states) return true
  return def.states.has(state)
}
