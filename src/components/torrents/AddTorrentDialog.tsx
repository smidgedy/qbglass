import { useState, useRef } from 'react'
import { X, Link, Upload, Plus } from 'lucide-react'
import { addTorrentByMagnet, addTorrentByFile } from '../../api/torrents'
import { useTorrentStore } from '../../store/useTorrentStore'

interface AddTorrentDialogProps {
  onClose: () => void
}

export function AddTorrentDialog({ onClose }: AddTorrentDialogProps) {
  const categories = useTorrentStore((s) => s.categories)
  const [magnetUrl, setMagnetUrl] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMagnetSubmit = async () => {
    if (!magnetUrl.trim()) return
    setLoading(true)
    setError('')
    try {
      await addTorrentByMagnet(magnetUrl.trim(), category || undefined)
      onClose()
    } catch {
      setError('Failed to add torrent')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    try {
      await addTorrentByFile(file, category || undefined)
      onClose()
    } catch {
      setError('Failed to upload torrent')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleMagnetSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="rounded-2xl border border-accent-blue/20 p-6 w-full max-w-md relative z-10 flex flex-col gap-4"
        style={{
          background: 'var(--color-surface-solid)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          boxShadow: '0 8px 48px oklch(0 0 0 / 0.6), 0 0 40px color-mix(in oklch, var(--color-accent-blue) 12%, transparent), inset 0 1px 0 oklch(1 0 0 / 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Plus size={20} className="text-accent-blue" />
            Add Torrent
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={18} />
          </button>
        </div>

        {/* Magnet URL input */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Magnet Link or URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={magnetUrl}
                onChange={(e) => setMagnetUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="magnet:?xt=urn:btih:..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-raised border border-glass-border
                           text-sm text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:border-accent-blue/50 transition-colors"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Or upload .torrent file</label>
          <input ref={fileInputRef} type="file" accept=".torrent" onChange={handleFileUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-lg border border-dashed border-glass-border text-sm text-text-secondary
                       hover:bg-white/5 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            Choose .torrent file
          </button>
        </div>

        {/* Category selector */}
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Category (optional)</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-surface-raised border border-glass-border
                       text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 transition-colors"
          >
            <option value="">None</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-accent-red text-xs">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleMagnetSubmit}
          disabled={loading || !magnetUrl.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-blue/20 border border-accent-blue/30
                     text-accent-blue font-medium text-sm flex items-center justify-center gap-2
                     hover:bg-accent-blue/30 transition-colors disabled:opacity-40"
        >
          {loading ? 'Adding...' : 'Add Torrent'}
        </button>
      </div>
    </div>
  )
}
