import { useState, useEffect } from 'react'
import { X, Pause, Play, Trash2 } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { ProgressBar } from './ProgressBar'
import { CategoryBadge } from './CategoryBadge'
import { formatSpeed, formatSize, formatETA, formatProgress, formatRatio } from '../../utils/format'
import { stateToLabel, stateToColor, canResume } from '../../utils/torrentState'
import { pauseTorrents, resumeTorrents, deleteTorrents, getTorrentFiles, getTorrentTrackers } from '../../api/torrents'
import type { Torrent, TorrentFile, TorrentTracker } from '../../api/types'

interface MobileTorrentDetailProps {
  hash: string
  onClose: () => void
}

export function MobileTorrentDetail({ hash, onClose }: MobileTorrentDetailProps) {
  const torrent = useTorrentStore((s) => s.torrents[hash])
  const [tab, setTab] = useState<'overview' | 'files' | 'trackers'>('overview')
  const [files, setFiles] = useState<TorrentFile[]>([])
  const [trackers, setTrackers] = useState<TorrentTracker[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (tab === 'files') getTorrentFiles(hash).then(setFiles).catch(() => {})
    if (tab === 'trackers') getTorrentTrackers(hash).then(setTrackers).catch(() => {})
  }, [hash, tab])

  if (!torrent) return null

  const t = torrent
  const resumable = canResume(t.state)

  const handlePauseResume = () => {
    if (resumable) resumeTorrents([t.hash])
    else pauseTorrents([t.hash])
  }

  const handleDelete = (withFiles: boolean) => {
    deleteTorrents([t.hash], withFiles)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}>
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" />

      {/* Sheet */}
      <div
        className="rounded-t-2xl border border-glass-border border-b-0 max-h-[85vh] flex flex-col animate-slide-up"
        style={{ background: 'var(--color-surface-solid)', backdropFilter: 'blur(20px) saturate(1.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center py-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-glass-border shrink-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CategoryBadge category={t.category} />
                <span className={`text-xs ${stateToColor(t.state)}`}>{stateToLabel(t.state)}</span>
              </div>
              <h2 className="text-sm font-medium leading-snug break-words">{t.name}</h2>
            </div>
            <button onClick={onClose} className="text-text-muted p-1">
              <X size={18} />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <ProgressBar progress={t.progress} state={t.state} />
            <div className="flex items-center justify-between mt-1.5 text-xs">
              <span className="font-mono text-text-secondary">{formatProgress(t.progress)}</span>
              <div className="flex gap-3">
                {t.dlspeed > 0 && <span className="font-mono text-accent-blue">{formatSpeed(t.dlspeed)}</span>}
                {t.upspeed > 0 && <span className="font-mono text-accent-green">{formatSpeed(t.upspeed)}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-2 flex gap-2 border-b border-glass-border shrink-0">
          <button
            onClick={handlePauseResume}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                       bg-accent-blue/15 text-accent-blue active:bg-accent-blue/25 transition-colors"
          >
            {resumable ? <Play size={14} /> : <Pause size={14} />}
            {resumable ? 'Resume' : 'Pause'}
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                         bg-accent-red/15 text-accent-red active:bg-accent-red/25 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={() => handleDelete(false)}
                className="px-2.5 py-2 rounded-lg text-[11px] font-medium bg-accent-amber/15 text-accent-amber"
              >
                Torrent only
              </button>
              <button
                onClick={() => handleDelete(true)}
                className="px-2.5 py-2 rounded-lg text-[11px] font-medium bg-accent-red/15 text-accent-red"
              >
                + Files
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-2 rounded-lg text-[11px] font-medium text-text-muted"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-glass-border shrink-0">
          {(['overview', 'files', 'trackers'] as const).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors
                ${tab === tabName ? 'text-text-primary border-b-2 border-accent-blue' : 'text-text-muted'}`}
            >
              {tabName}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'overview' && <OverviewContent torrent={t} />}
          {tab === 'files' && <FilesContent files={files} />}
          {tab === 'trackers' && <TrackersContent trackers={trackers} />}
        </div>
      </div>
    </div>
  )
}

function OverviewContent({ torrent: t }: { torrent: Torrent }) {
  const rows: [string, string][] = [
    ['Size', formatSize(t.total_size)],
    ['Downloaded', formatSize(t.downloaded)],
    ['Uploaded', formatSize(t.uploaded)],
    ['Ratio', formatRatio(t.ratio)],
    ['ETA', formatETA(t.eta)],
    ['Seeds', String(t.num_seeds)],
    ['Peers', String(t.num_leechs)],
    ['Added', new Date(t.added_on * 1000).toLocaleDateString()],
    ['Save Path', t.save_path],
  ]

  return (
    <div className="flex flex-col gap-0.5">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between py-1.5">
          <span className="text-xs text-text-muted">{label}</span>
          <span className="text-xs font-mono text-text-secondary text-right max-w-[65%] truncate">{value}</span>
        </div>
      ))}
    </div>
  )
}

function FilesContent({ files }: { files: TorrentFile[] }) {
  if (files.length === 0) return <p className="text-xs text-text-muted">Loading files...</p>
  return (
    <div className="flex flex-col gap-3">
      {files.map((f) => (
        <div key={f.index}>
          <div className="text-xs truncate text-text-secondary mb-1" title={f.name}>{f.name}</div>
          <div className="flex items-center gap-2">
            <ProgressBar progress={f.progress} state={f.progress >= 1 ? 'stoppedUP' : 'downloading'} className="flex-1" />
            <span className="text-[10px] font-mono text-text-muted shrink-0">{formatSize(f.size)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function TrackersContent({ trackers }: { trackers: TorrentTracker[] }) {
  if (trackers.length === 0) return <p className="text-xs text-text-muted">Loading trackers...</p>

  const statusLabel = (s: number) =>
    s === 2 ? 'Working' : s === 3 ? 'Updating' : s === 4 ? 'Error' : s === 0 ? 'Disabled' : 'Not contacted'
  const statusColor = (s: number) =>
    s === 2 ? 'text-accent-green' : s === 4 ? 'text-accent-red' : 'text-text-muted'

  return (
    <div className="flex flex-col gap-2.5">
      {trackers.filter((t) => t.url.startsWith('http') || t.url.startsWith('udp')).map((t, i) => (
        <div key={i}>
          <div className="text-xs truncate text-text-secondary">{t.url}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] ${statusColor(t.status)}`}>{statusLabel(t.status)}</span>
            <span className="text-[10px] text-text-muted">S:{t.num_seeds} P:{t.num_peers}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
