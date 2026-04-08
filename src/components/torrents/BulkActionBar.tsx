import { useState } from 'react'
import { Play, Pause, Trash2, RotateCw, X, CheckSquare, Square } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { pauseTorrents, resumeTorrents, deleteTorrents, recheckTorrents } from '../../api/torrents'
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

  const allSelected = count === filteredTorrents.length && count > 0
  const s = count > 1 ? 's' : ''

  const handleResume = async () => { await resumeTorrents(hashes); toast(`${count} torrent${s} resumed`); clearSelection() }
  const handlePause = async () => { await pauseTorrents(hashes); toast(`${count} torrent${s} paused`); clearSelection() }
  const handleRecheck = async () => { await recheckTorrents(hashes); toast(`Rechecking ${count} torrent${s}`); clearSelection() }
  const handleDelete = async (withFiles: boolean) => {
    await deleteTorrents(hashes, withFiles)
    toast(`${count} torrent${s} deleted`)
    clearSelection()
    setConfirmDelete(false)
  }
  const handleToggleSelectAll = () => {
    if (allSelected) clearSelection()
    else selectAll(filteredTorrents.map((t) => t.hash))
  }

  const btnClass = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95'

  return (
    <div className="px-5 py-2 flex items-center gap-3 shrink-0 border-b border-glass-border bg-accent-blue/5">
      <span className="text-sm font-semibold text-accent-blue tabular-nums">{count} selected</span>
      <button
        onClick={handleToggleSelectAll}
        className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        {allSelected ? <Square size={13} /> : <CheckSquare size={13} />}
        {allSelected ? 'Deselect all' : `Select all ${filteredTorrents.length}`}
      </button>

      <div className="flex-1" />

      <button onClick={handleResume} className={`${btnClass} bg-accent-green/15 text-accent-green hover:bg-accent-green/25`}>
        <Play size={13} /> Resume
      </button>
      <button onClick={handlePause} className={`${btnClass} bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25`}>
        <Pause size={13} /> Pause
      </button>
      <button onClick={handleRecheck} className={`${btnClass} bg-accent-blue/15 text-accent-blue hover:bg-accent-blue/25`}>
        <RotateCw size={13} /> Recheck
      </button>

      {!confirmDelete ? (
        <button onClick={() => setConfirmDelete(true)} className={`${btnClass} bg-accent-red/15 text-accent-red hover:bg-accent-red/25`}>
          <Trash2 size={13} /> Delete
        </button>
      ) : (
        <>
          <button onClick={() => handleDelete(false)} className={`${btnClass} bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25`}>
            Torrent only
          </button>
          <button onClick={() => handleDelete(true)} className={`${btnClass} bg-accent-red/15 text-accent-red hover:bg-accent-red/25`}>
            + Files
          </button>
          <button onClick={() => setConfirmDelete(false)} className={`${btnClass} text-text-muted hover:bg-white/5`}>
            Cancel
          </button>
        </>
      )}

      <button onClick={clearSelection} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all active:scale-90" title="Clear selection">
        <X size={16} />
      </button>
    </div>
  )
}
