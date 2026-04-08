import type { TorrentState } from '../api/types'

export function stateToLabel(state: TorrentState): string {
  const map: Record<TorrentState, string> = {
    downloading: 'Downloading',
    stalledDL: 'Stalled',
    queuedDL: 'Queued',
    stoppedUP: 'Stopped',
    uploading: 'Seeding',
    stalledUP: 'Seeding',
    queuedUP: 'Queued',
    metaDL: 'Metadata',
    forcedDL: 'Forced DL',
    forcedUP: 'Forced UL',
    missingFiles: 'Missing',
    error: 'Error',
    pausedDL: 'Paused',
    pausedUP: 'Paused',
    stoppedDL: 'Stopped',
    checkingDL: 'Checking',
    checkingUP: 'Checking',
    checkingResumeData: 'Checking',
    moving: 'Moving',
    unknown: 'Unknown',
  }
  return map[state] ?? state
}

export function stateToColor(state: TorrentState): string {
  if (state === 'downloading' || state === 'forcedDL' || state === 'metaDL')
    return 'text-accent-blue'
  if (state === 'uploading' || state === 'stalledUP' || state === 'forcedUP')
    return 'text-accent-green'
  if (state === 'stalledDL')
    return 'text-accent-purple'
  if (state === 'error' || state === 'missingFiles')
    return 'text-accent-red'
  if (state.startsWith('queued') || state.startsWith('stopped') || state.startsWith('paused'))
    return 'text-text-muted'
  return 'text-text-secondary'
}

export function isDownloading(state: TorrentState): boolean {
  return state === 'downloading' || state === 'forcedDL'
}

export function isSeeding(state: TorrentState): boolean {
  return state === 'uploading' || state === 'forcedUP'
}

export function canResume(state: TorrentState): boolean {
  return state.startsWith('paused') || state.startsWith('stopped') || state.startsWith('queued')
}
