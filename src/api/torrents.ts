import { apiPost, apiGet, ApiError } from './client'
import type { TorrentFile, TorrentTracker } from './types'

export async function pauseTorrents(hashes: string[]): Promise<void> {
  await apiPost('/torrents/pause', { hashes: hashes.join('|') })
}

export async function resumeTorrents(hashes: string[]): Promise<void> {
  await apiPost('/torrents/resume', { hashes: hashes.join('|') })
}

export async function deleteTorrents(hashes: string[], deleteFiles: boolean): Promise<void> {
  await apiPost('/torrents/delete', {
    hashes: hashes.join('|'),
    deleteFiles: String(deleteFiles),
  })
}

export async function addTorrentByMagnet(urls: string, category?: string): Promise<void> {
  await apiPost('/torrents/add', {
    urls,
    ...(category ? { category } : {}),
  })
}

export async function addTorrentByFile(file: File, category?: string): Promise<void> {
  const formData = new FormData()
  formData.append('torrents', file)
  if (category) formData.append('category', category)

  const res = await fetch('/api/v2/torrents/add', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    throw new ApiError(res.status, await res.text())
  }
}

export async function getTorrentFiles(hash: string): Promise<TorrentFile[]> {
  return apiGet<TorrentFile[]>('/torrents/files', { hash })
}

export async function getTorrentTrackers(hash: string): Promise<TorrentTracker[]> {
  return apiGet<TorrentTracker[]>('/torrents/trackers', { hash })
}
