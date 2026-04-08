import { useState } from 'react'
import { Play, Pause, Trash2, X, CheckSquare } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { pauseTorrents, resumeTorrents, deleteTorrents } from '../../api/torrents'
import { useFilteredTorrents } from '../../store/selectors'
import { useToast } from '../shared/Toast'

export function BulkActionBar() {
  const selectedHashes = useTorrentStore((s) => s.selectedHashes)
  const clearSelection = useTorrentStore((s) => s.clearSelection)
  const selectAll = useTorrentStore((s) => s.selectAll)
  const filteredTorrents = useFilteredTorrents()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { toast } = useToast()

  const hashes = Object.keys(selectedHashes)
  const count = hashes.length
  if (count === 0) return null

  const handleResume = async () => { await resumeTorrents(hashes); toast(`${count} torrent${count > 1 ? 's' : ''} resumed`); clearSelection() }
  const handlePause = async () => { await pauseTorrents(hashes); toast(`${count} torrent${count > 1 ? 's' : ''} paused`); clearSelection() }
  const handleDelete = async (withFiles: boolean) => {
    await deleteTorrents(hashes, withFiles)
    toast(`${count} torrent${count > 1 ? 's' : ''} deleted`)
    clearSelection()
    setConfirmDelete(false)
  }
  const handleSelectAll = () => {
    selectAll(filteredTorrents.map((t) => t.hash))
  }

  return (
    <div className="px-5 py-2 flex items-center gap-3 shrink-0 border-b border-glass-border bg-accent-blue/5">
      {/* Count + select all */}
      <span className="text-sm font-semibold text-accent-blue">{count} selected</span>
      <button
        onClick={handleSelectAll}
        className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        <CheckSquare size={13} /> Select all
      </button>

      <div className="flex-1" />

      {/* Actions */}
      <button
        onClick={handleResume}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                   bg-accent-green/15 text-accent-green hover:bg-accent-green/25 transition-colors"
      >
        <Play size={13} /> Resume
      </button>
      <button
        onClick={handlePause}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                   bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25 transition-colors"
      >
        <Pause size={13} /> Pause
      </button>

      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     bg-accent-red/15 text-accent-red hover:bg-accent-red/25 transition-colors"
        >
          <Trash2 size={13} /> Delete
        </button>
      ) : (
        <>
          <button
            onClick={() => handleDelete(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25 transition-colors"
          >
            Torrent only
          </button>
          <button
            onClick={() => handleDelete(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-red/15 text-accent-red hover:bg-accent-red/25 transition-colors"
          >
            + Files
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </>
      )}

      {/* Clear selection */}
      <button
        onClick={clearSelection}
        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
        title="Clear selection"
      >
        <X size={16} />
      </button>
    </div>
  )
}
