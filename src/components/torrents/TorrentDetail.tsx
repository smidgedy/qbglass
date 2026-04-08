import { useState, useEffect } from 'react'
import { X, Pause, Play, Trash2 } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { ProgressBar } from './ProgressBar'
import { CategoryBadge } from './CategoryBadge'
import { formatSpeed, formatSize, formatETA, formatProgress, formatRatio } from '../../utils/format'
import { stateToLabel, stateToColor, canResume } from '../../utils/torrentState'
import { pauseTorrents, resumeTorrents, deleteTorrents, getTorrentFiles, getTorrentTrackers } from '../../api/torrents'
import type { TorrentFile, TorrentTracker } from '../../api/types'

type Tab = 'overview' | 'files' | 'trackers'

export function TorrentDetail() {
  const selectedHash = useTorrentStore((s) => s.selectedHash)
  const torrent = useTorrentStore((s) => selectedHash ? s.torrents[selectedHash] : null)
  const setSelectedHash = useTorrentStore((s) => s.setSelectedHash)
  const [tab, setTab] = useState<Tab>('overview')
  const [files, setFiles] = useState<TorrentFile[]>([])
  const [trackers, setTrackers] = useState<TorrentTracker[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!selectedHash) return
    if (tab === 'files') getTorrentFiles(selectedHash).then(setFiles).catch(() => {})
    if (tab === 'trackers') getTorrentTrackers(selectedHash).then(setTrackers).catch(() => {})
  }, [selectedHash, tab])

  if (!torrent) return null

  const t = torrent
  const resumable = canResume(t.state)

  const handlePauseResume = () => {
    if (resumable) resumeTorrents([t.hash])
    else pauseTorrents([t.hash])
  }

  const handleDelete = (withFiles: boolean) => {
    deleteTorrents([t.hash], withFiles)
    setSelectedHash(null)
    setConfirmDelete(false)
  }

  return (
    <div className="w-96 h-full glass-panel-flat rounded-none border-y-0 border-r-0 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={t.category} />
            <span className={`text-xs ${stateToColor(t.state)}`}>{stateToLabel(t.state)}</span>
          </div>
          <h2 className="text-sm font-medium leading-snug break-words">{t.name}</h2>
        </div>
        <button onClick={() => setSelectedHash(null)} className="text-text-muted hover:text-text-primary mt-0.5">
          <X size={16} />
        </button>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex gap-2 border-b border-glass-border">
        <button
          onClick={handlePauseResume}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     bg-accent-blue/15 text-accent-blue hover:bg-accent-blue/25 transition-colors"
        >
          {resumable ? <Play size={13} /> : <Pause size={13} />}
          {resumable ? 'Resume' : 'Pause'}
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
          <div className="flex gap-1">
            <button
              onClick={() => handleDelete(false)}
              className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25 transition-colors"
            >
              Torrent only
            </button>
            <button
              onClick={() => handleDelete(true)}
              className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-accent-red/15 text-accent-red hover:bg-accent-red/25 transition-colors"
            >
              + Files
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1.5 rounded-lg text-[11px] font-medium text-text-muted hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-glass-border">
        {(['overview', 'files', 'trackers'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors
              ${tab === t ? 'text-text-primary border-b-2 border-accent-blue' : 'text-text-muted hover:text-text-secondary'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'overview' && <OverviewTab torrent={torrent} />}
        {tab === 'files' && <FilesTab files={files} />}
        {tab === 'trackers' && <TrackersTab trackers={trackers} />}
      </div>
    </div>
  )
}

function OverviewTab({ torrent: t }: { torrent: NonNullable<ReturnType<typeof useTorrentStore.getState>['torrents'][string]> }) {
  const rows = [
    ['Progress', formatProgress(t.progress)],
    ['Size', formatSize(t.total_size)],
    ['Downloaded', formatSize(t.downloaded)],
    ['Uploaded', formatSize(t.uploaded)],
    ['Ratio', formatRatio(t.ratio)],
    ['DL Speed', formatSpeed(t.dlspeed)],
    ['UL Speed', formatSpeed(t.upspeed)],
    ['ETA', formatETA(t.eta)],
    ['Seeds', String(t.num_seeds)],
    ['Peers', String(t.num_leechs)],
    ['Added', new Date(t.added_on * 1000).toLocaleDateString()],
    ['Save Path', t.save_path],
  ]

  return (
    <div className="flex flex-col gap-1">
      <ProgressBar progress={t.progress} state={t.state} className="mb-3" />
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between py-1">
          <span className="text-xs text-text-muted">{label}</span>
          <span className="text-xs font-mono text-text-secondary text-right max-w-[60%] truncate">{value}</span>
        </div>
      ))}
    </div>
  )
}

function FilesTab({ files }: { files: TorrentFile[] }) {
  if (files.length === 0) return <p className="text-xs text-text-muted">Loading files...</p>

  return (
    <div className="flex flex-col gap-2">
      {files.map((f) => (
        <div key={f.index} className="flex flex-col gap-1">
          <div className="text-xs truncate text-text-secondary" title={f.name}>{f.name}</div>
          <div className="flex items-center gap-2">
            <ProgressBar progress={f.progress} state={f.progress >= 1 ? 'stoppedUP' : 'downloading'} className="flex-1" />
            <span className="text-[10px] font-mono text-text-muted">{formatSize(f.size)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function TrackersTab({ trackers }: { trackers: TorrentTracker[] }) {
  if (trackers.length === 0) return <p className="text-xs text-text-muted">Loading trackers...</p>

  const statusLabel = (s: number) => {
    if (s === 0) return 'Disabled'
    if (s === 1) return 'Not contacted'
    if (s === 2) return 'Working'
    if (s === 3) return 'Updating'
    return 'Error'
  }

  const statusColor = (s: number) => {
    if (s === 2) return 'text-accent-green'
    if (s === 4) return 'text-accent-red'
    return 'text-text-muted'
  }

  return (
    <div className="flex flex-col gap-2">
      {trackers.filter((t) => t.url.startsWith('http') || t.url.startsWith('udp')).map((t, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="text-xs truncate text-text-secondary" title={t.url}>{t.url}</div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${statusColor(t.status)}`}>{statusLabel(t.status)}</span>
            <span className="text-[10px] text-text-muted">S: {t.num_seeds} P: {t.num_peers}</span>
            {t.msg && <span className="text-[10px] text-text-muted truncate">{t.msg}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
