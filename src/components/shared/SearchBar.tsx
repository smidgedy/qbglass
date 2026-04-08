import { Search, X } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'

export function SearchBar() {
  const searchQuery = useTorrentStore((s) => s.searchQuery)
  const setSearchQuery = useTorrentStore((s) => s.setSearchQuery)

  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        placeholder="Search torrents..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-white/5 border border-glass-border
                   text-sm text-text-primary placeholder:text-text-muted
                   focus:outline-none focus:border-accent-blue/40 transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
