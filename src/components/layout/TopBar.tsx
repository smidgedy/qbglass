import { useState } from 'react'
import { ArrowDown, ArrowUp, HardDrive, Wifi, WifiOff, Gauge, Plus } from 'lucide-react'
import { useTorrentStore } from '../../store/useTorrentStore'
import { useActiveTorrentCount } from '../../store/selectors'
import { formatSpeed, formatSize } from '../../utils/format'
import { toggleSpeedLimitsMode } from '../../api/transfer'
import { Sparkline } from '../shared/Sparkline'
import { AddTorrentDialog } from '../torrents/AddTorrentDialog'

export function TopBar() {
  const serverState = useTorrentStore((s) => s.serverState)
  const activeCount = useActiveTorrentCount()
  const dlHistory = useTorrentStore((s) => s.dlSpeedHistory)
  const ulHistory = useTorrentStore((s) => s.ulSpeedHistory)
  const [showAddDialog, setShowAddDialog] = useState(false)

  if (!serverState) return null

  const connected = serverState.connection_status === 'connected'
  const altSpeed = serverState.use_alt_speed_limits

  return (
    <>
      <div className="glass-panel-flat rounded-none border-x-0 border-t-0 h-14 px-5 flex items-center gap-5 shrink-0">
        {/* Download speed + sparkline */}
        <div className="flex items-center gap-2">
          <ArrowDown size={16} className="text-accent-blue" />
          <Sparkline data={dlHistory} width={80} height={28} color="oklch(0.7 0.15 240)" />
          <span className="font-mono text-sm font-semibold text-accent-blue">
            {formatSpeed(serverState.dl_info_speed)}
          </span>
        </div>

        {/* Upload speed + sparkline */}
        <div className="flex items-center gap-2">
          <ArrowUp size={16} className="text-accent-green" />
          <Sparkline data={ulHistory} width={80} height={28} color="oklch(0.7 0.15 150)" />
          <span className="font-mono text-sm font-semibold text-accent-green">
            {formatSpeed(serverState.up_info_speed)}
          </span>
        </div>

        <div className="w-px h-6 bg-glass-border" />

        {/* Active count */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Active</span>
          <span className="text-sm font-semibold font-mono">{activeCount}</span>
        </div>

        <div className="flex-1" />

        {/* Add torrent button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     bg-accent-blue/15 text-accent-blue hover:bg-accent-blue/25 transition-colors
                     border border-accent-blue/20"
        >
          <Plus size={14} />
          Add
        </button>

        {/* Speed limit toggle */}
        <button
          onClick={() => toggleSpeedLimitsMode()}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors
            ${altSpeed
              ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
              : 'text-text-muted hover:text-text-secondary'
            }`}
          title={altSpeed ? 'Alt speed limits active' : 'Speed limits off'}
        >
          <Gauge size={14} />
          {altSpeed && 'Limited'}
        </button>

        {/* Disk space */}
        <div className="flex items-center gap-2 text-text-secondary">
          <HardDrive size={14} />
          <span className="text-xs font-mono">{formatSize(serverState.free_space_on_disk)}</span>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-1.5 text-text-secondary" title={`DHT: ${serverState.dht_nodes} nodes`}>
          {connected ? <Wifi size={14} className="text-accent-green" /> : <WifiOff size={14} className="text-accent-red" />}
        </div>
      </div>

      {showAddDialog && <AddTorrentDialog onClose={() => setShowAddDialog(false)} />}
    </>
  )
}
