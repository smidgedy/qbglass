import { create } from 'zustand'
import type { Torrent, Category, ServerState, MainDataResponse } from '../api/types'

export type FilterState = 'active' | 'downloading' | 'seeding' | 'completed' | 'stalled' | 'metadata' | 'queued' | 'all'
export type SortField = 'name' | 'size' | 'progress' | 'speed' | 'eta' | 'ratio' | 'added' | 'state' | 'priority'
export type SortDir = 'asc' | 'desc'

interface TorrentStore {
  authenticated: boolean
  rid: number
  torrents: Record<string, Torrent>
  categories: Record<string, Category>
  tags: string[]
  serverState: ServerState | null
  selectedHash: string | null
  selectedHashes: Record<string, true>
  filterState: FilterState
  categoryFilter: string | null
  searchQuery: string
  sortField: SortField
  sortDir: SortDir
  dlSpeedHistory: number[]
  ulSpeedHistory: number[]
  connectionLost: boolean

  setAuthenticated: (v: boolean) => void
  applyMainDataDelta: (delta: MainDataResponse) => void
  setSelectedHash: (hash: string | null) => void
  toggleSelected: (hash: string) => void
  selectAll: (hashes: string[]) => void
  clearSelection: () => void
  setFilterState: (f: FilterState) => void
  setCategoryFilter: (c: string | null) => void
  setSearchQuery: (q: string) => void
  setSort: (field: SortField) => void
  setConnectionLost: (v: boolean) => void
}

export const useTorrentStore = create<TorrentStore>((set) => ({
  authenticated: false,
  rid: 0,
  torrents: {},
  categories: {},
  tags: [],
  serverState: null,
  selectedHash: null,
  selectedHashes: {},
  filterState: 'active',
  categoryFilter: null,
  searchQuery: '',
  sortField: 'name',
  sortDir: 'asc',
  dlSpeedHistory: [],
  ulSpeedHistory: [],
  connectionLost: false,

  setAuthenticated: (v) => set({ authenticated: v }),
  setConnectionLost: (v) => set({ connectionLost: v }),

  applyMainDataDelta: (delta) =>
    set((state) => {
      let newTorrents = state.torrents

      if (delta.full_update) {
        newTorrents = {}
      } else if (delta.torrents || delta.torrents_removed) {
        newTorrents = { ...state.torrents }
      }

      if (delta.torrents) {
        for (const [hash, update] of Object.entries(delta.torrents)) {
          newTorrents[hash] = {
            ...newTorrents[hash],
            ...update,
            hash,
          } as Torrent
        }
      }

      if (delta.torrents_removed) {
        for (const hash of delta.torrents_removed) {
          delete newTorrents[hash]
        }
      }

      let newCategories = state.categories
      if (delta.categories) {
        newCategories = delta.full_update
          ? { ...delta.categories }
          : { ...state.categories, ...delta.categories }
      }
      if (delta.categories_removed) {
        newCategories = { ...newCategories }
        for (const cat of delta.categories_removed) {
          delete newCategories[cat]
        }
      }

      let newTags = state.tags
      if (delta.tags) {
        newTags = delta.full_update
          ? delta.tags
          : [...new Set([...state.tags, ...delta.tags])]
      }
      if (delta.tags_removed) {
        const removeSet = new Set(delta.tags_removed)
        newTags = newTags.filter((t) => !removeSet.has(t))
      }

      const newServerState = delta.server_state
        ? { ...state.serverState, ...delta.server_state } as ServerState
        : state.serverState

      return {
        rid: delta.rid,
        torrents: newTorrents,
        categories: newCategories,
        tags: newTags,
        serverState: newServerState,
      }
    }),

  setSelectedHash: (hash) => set({ selectedHash: hash }),
  toggleSelected: (hash) => set((state) => {
    const next = { ...state.selectedHashes }
    if (next[hash]) delete next[hash]
    else next[hash] = true
    return { selectedHashes: next }
  }),
  selectAll: (hashes) => set({
    selectedHashes: Object.fromEntries(hashes.map((h) => [h, true as const])),
  }),
  clearSelection: () => set({ selectedHashes: {} }),
  setFilterState: (f) => set({ filterState: f }),
  setCategoryFilter: (c) => set({ categoryFilter: c }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSort: (field) => set((state) => ({
    sortField: field,
    sortDir: state.sortField === field && state.sortDir === 'asc' ? 'desc' : 'asc',
  })),
}))
