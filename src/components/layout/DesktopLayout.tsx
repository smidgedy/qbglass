import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { TorrentList } from '../torrents/TorrentList'
import { TorrentDetail } from '../torrents/TorrentDetail'
import { BulkActionBar } from '../torrents/BulkActionBar'
import { FilterTabs } from '../shared/FilterTabs'
import { SearchBar } from '../shared/SearchBar'
import { useTorrentStore } from '../../store/useTorrentStore'

export function DesktopLayout() {
  const selectedHash = useTorrentStore((s) => s.selectedHash)
  const selectionCount = useTorrentStore((s) => Object.keys(s.selectedHashes).length)

  return (
    <div className="h-screen flex">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />

        {/* Toolbar */}
        <div className="px-5 py-3 flex items-center gap-4 shrink-0">
          <FilterTabs />
          <div className="flex-1" />
          <div className="w-64">
            <SearchBar />
          </div>
        </div>

        {/* Bulk action bar */}
        {selectionCount > 0 && <BulkActionBar />}

        {/* Torrent list */}
        <TorrentList />

        {/* Detail panel - overlaid on right */}
        {selectedHash && selectionCount === 0 && (
          <div className="absolute top-0 right-0 h-full z-10">
            <TorrentDetail />
          </div>
        )}
      </div>
    </div>
  )
}
