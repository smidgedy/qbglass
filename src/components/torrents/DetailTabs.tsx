import { useState, useEffect } from 'react'
import { Pause, Play, Trash2, RotateCw, Zap } from 'lucide-react'
import type { Torrent, TorrentFile, TorrentTracker } from '../../api/types'
import { ProgressBar } from './ProgressBar'
import { formatSpeed, formatSize, formatETA, formatProgress, formatRatio } from '../../utils/format'
import { stateToLabel, canResume } from '../../utils/torrentState'
import { pauseTorrents, resumeTorrents, deleteTorrents, recheckTorrents, setForceStart, getTorrentFiles, getTorrentTrackers } from '../../api/torrents'
import { useToast } from '../shared/Toast'

type Tab = 'overview' | 'files' | 'trackers'

interface DetailTabsProps {
  torrent: Torrent
  onClose: () => void
}

export function useDetailActions(torrent: Torrent, onClose: () => void) {
  const { toast } = useToast()
  const resumable = canResume(torrent.state)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handlePauseResume = async () => {
    if (resumable) {
      await resumeTorrents([torrent.hash])
      toast('Torrent resumed')
    } else {
      await pauseTorrents([torrent.hash])
      toast('Torrent paused')
    }
  }

  const handleDelete = async (withFiles: boolean) => {
    await deleteTorrents([torrent.hash], withFiles)
    toast(withFiles ? 'Torrent and files deleted' : 'Torrent removed')
    onClose()
    setConfirmDelete(false)
  }

  const handleRecheck = async () => {
    await recheckTorrents([torrent.hash])
    toast('Recheck started')
  }

  const handleForceStart = async () => {
    await setForceStart([torrent.hash], !torrent.force_start)
    toast(torrent.force_start ? 'Force start disabled' : 'Force start enabled')
  }

  return { resumable, confirmDelete, setConfirmDelete, handlePauseResume, handleDelete, handleRecheck, handleForceStart }
}

export function DetailActions({ torrent, onClose }: DetailTabsProps) {
  const { resumable, confirmDelete, setConfirmDelete, handlePauseResume, handleDelete, handleRecheck, handleForceStart } = useDetailActions(torrent, onClose)

  return (
    <div className="px-4 py-2 flex gap-2 border-b border-glass-border shrink-0 flex-wrap" role="toolbar" aria-label="Torrent actions">
      <button onClick={handlePauseResume}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-blue/15 text-accent-blue hover:bg-accent-blue/25 active:bg-accent-blue/30 transition-colors">
        {resumable ? <Play size={13} /> : <Pause size={13} />}
        {resumable ? 'Resume' : 'Pause'}
      </button>
      <button onClick={handleRecheck}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25 transition-colors">
        <RotateCw size={13} /> Recheck
      </button>
      <button onClick={handleForceStart}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-purple/15 text-accent-purple hover:bg-accent-purple/25 transition-colors">
        <Zap size={13} /> {torrent.force_start ? 'Unforce' : 'Force'}
      </button>
      {!confirmDelete ? (
        <button onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-red/15 text-accent-red hover:bg-accent-red/25 transition-colors">
          <Trash2 size={13} /> Delete
        </button>
      ) : (
        <>
          <button onClick={() => handleDelete(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-amber/15 text-accent-amber hover:bg-accent-amber/25 transition-colors">
            Torrent only
          </button>
          <button onClick={() => handleDelete(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-red/15 text-accent-red hover:bg-accent-red/25 transition-colors">
            + Files
          </button>
          <button onClick={() => setConfirmDelete(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </>
      )}
    </div>
  )
}

export function DetailTabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex border-b border-glass-border shrink-0" role="tablist">
      {(['overview', 'files', 'trackers'] as Tab[]).map((t) => (
        <button key={t} onClick={() => setTab(t)}
          role="tab" aria-selected={tab === t}
          className={`flex-1 py-2 text-xs font-medium capitalize transition-colors
            ${tab === t ? 'text-text-primary border-b-2 border-accent-blue' : 'text-text-muted hover:text-text-secondary'}`}>
          {t}
        </button>
      ))}
    </div>
  )
}

export function DetailTabContent({ torrent, tab }: { torrent: Torrent; tab: Tab }) {
  const [files, setFiles] = useState<TorrentFile[]>([])
  const [trackers, setTrackers] = useState<TorrentTracker[]>([])

  useEffect(() => {
    if (tab === 'files') getTorrentFiles(torrent.hash).then(setFiles).catch(() => {})
    if (tab === 'trackers') getTorrentTrackers(torrent.hash).then(setTrackers).catch(() => {})
  }, [torrent.hash, tab])

  return (
    <div className="flex-1 overflow-y-auto p-4" role="tabpanel">
      {tab === 'overview' && <OverviewTab torrent={torrent} />}
      {tab === 'files' && <FilesTab files={files} />}
      {tab === 'trackers' && <TrackersTab trackers={trackers} />}
    </div>
  )
}

function OverviewTab({ torrent: t }: { torrent: Torrent }) {
  const rows: [string, string][] = [
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
    ['State', stateToLabel(t.state)],
  ]

  return (
    <div className="flex flex-col gap-0.5">
      <ProgressBar progress={t.progress} state={t.state} className="mb-3" />
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between py-1">
          <span className="text-xs text-text-muted">{label}</span>
          <span className="text-xs font-mono text-text-secondary text-right max-w-[65%] truncate">{value}</span>
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

const trackerStatusLabel = (s: number) =>
  s === 2 ? 'Working' : s === 3 ? 'Updating' : s === 4 ? 'Error' : s === 0 ? 'Disabled' : 'Not contacted'
const trackerStatusColor = (s: number) =>
  s === 2 ? 'text-accent-green' : s === 4 ? 'text-accent-red' : 'text-text-muted'

function TrackersTab({ trackers }: { trackers: TorrentTracker[] }) {
  if (trackers.length === 0) return <p className="text-xs text-text-muted">Loading trackers...</p>
  return (
    <div className="flex flex-col gap-2">
      {trackers.filter((t) => t.url.startsWith('http') || t.url.startsWith('udp')).map((t, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="text-xs truncate text-text-secondary" title={t.url}>{t.url}</div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${trackerStatusColor(t.status)}`}>{trackerStatusLabel(t.status)}</span>
            <span className="text-[10px] text-text-muted">S: {t.num_seeds} P: {t.num_peers}</span>
            {t.msg && <span className="text-[10px] text-text-muted truncate">{t.msg}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
