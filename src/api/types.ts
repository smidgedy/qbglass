export interface Torrent {
  added_on: number
  amount_left: number
  auto_tmm: boolean
  availability: number
  category: string
  completed: number
  completion_on: number
  content_path: string
  dl_limit: number
  dlspeed: number
  download_path: string
  downloaded: number
  downloaded_session: number
  eta: number
  f_l_piece_prio: boolean
  force_start: boolean
  has_metadata: boolean
  hash: string
  infohash_v1: string
  last_activity: number
  magnet_uri: string
  name: string
  num_complete: number
  num_incomplete: number
  num_leechs: number
  num_seeds: number
  popularity: number
  priority: number
  progress: number
  ratio: number
  save_path: string
  seeding_time: number
  seen_complete: number
  seq_dl: boolean
  size: number
  state: TorrentState
  super_seeding: boolean
  tags: string
  time_active: number
  total_size: number
  tracker: string
  trackers_count: number
  up_limit: number
  uploaded: number
  uploaded_session: number
  upspeed: number
}

export type TorrentState =
  | 'downloading'
  | 'stalledDL'
  | 'queuedDL'
  | 'stoppedUP'
  | 'uploading'
  | 'stalledUP'
  | 'queuedUP'
  | 'metaDL'
  | 'forcedDL'
  | 'forcedUP'
  | 'missingFiles'
  | 'error'
  | 'pausedDL'
  | 'pausedUP'
  | 'stoppedDL'
  | 'checkingDL'
  | 'checkingUP'
  | 'checkingResumeData'
  | 'moving'
  | 'unknown'

export interface Category {
  name: string
  savePath: string
}

export interface ServerState {
  alltime_dl: number
  alltime_ul: number
  connection_status: string
  dht_nodes: number
  dl_info_data: number
  dl_info_speed: number
  dl_rate_limit: number
  free_space_on_disk: number
  global_ratio: string
  up_info_data: number
  up_info_speed: number
  up_rate_limit: number
  use_alt_speed_limits: boolean
  total_peer_connections: number
  refresh_interval: number
}

export interface MainDataResponse {
  rid: number
  full_update?: boolean
  torrents?: Record<string, Partial<Torrent>>
  torrents_removed?: string[]
  categories?: Record<string, Category>
  categories_removed?: string[]
  tags?: string[]
  tags_removed?: string[]
  server_state?: Partial<ServerState>
}

export interface TorrentFile {
  index: number
  name: string
  size: number
  progress: number
  priority: number
  piece_range: [number, number]
  availability: number
}

export interface TorrentTracker {
  url: string
  status: number
  tier: number
  num_peers: number
  num_seeds: number
  num_leeches: number
  num_downloaded: number
  msg: string
}

export interface TransferInfo {
  connection_status: string
  dht_nodes: number
  dl_info_data: number
  dl_info_speed: number
  dl_rate_limit: number
  up_info_data: number
  up_info_speed: number
  up_rate_limit: number
}
