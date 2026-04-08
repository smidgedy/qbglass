import { useState } from 'react'
import { Tv, Film, Music, BookOpen, FolderOpen, Activity, List, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { useTorrentStore, type FilterState } from '../../store/useTorrentStore'
import { useCategoryCounts, useActiveTorrentCount } from '../../store/selectors'
import { getCategoryConfig } from '../../utils/categories'
import { DesktopSettingsDialog } from '../shared/DesktopSettingsDialog'

const iconMap = {
  Tv, Film, Music, BookOpen, FolderOpen,
} as const

export function Sidebar() {
  const [showSettings, setShowSettings] = useState(false)
  const categories = useTorrentStore((s) => s.categories)
  const filterState = useTorrentStore((s) => s.filterState)
  const categoryFilter = useTorrentStore((s) => s.categoryFilter)
  const setFilterState = useTorrentStore((s) => s.setFilterState)
  const setCategoryFilter = useTorrentStore((s) => s.setCategoryFilter)
  const torrents = useTorrentStore((s) => s.torrents)
  const counts = useCategoryCounts()
  const activeCount = useActiveTorrentCount()
  const totalCount = Object.keys(torrents).length

  const handleFilterClick = (filter: FilterState) => {
    setFilterState(filter)
    setCategoryFilter(null)
  }

  const handleCategoryClick = (catName: string) => {
    setCategoryFilter(categoryFilter === catName ? null : catName)
  }

  return (
    <div className="w-60 h-full glass-panel-flat rounded-none border-y-0 border-l-0 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center gap-3 border-b border-glass-border">
        <img src="./favicon.svg" alt="" className="w-7 h-7" />
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-accent-blue">QB</span>Glass
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
        {/* View filters */}
        <SidebarItem
          icon={<Activity size={16} />}
          label="Active"
          count={activeCount}
          active={filterState === 'active' && !categoryFilter}
          onClick={() => handleFilterClick('active')}
          accentCount
        />
        <SidebarItem
          icon={<List size={16} />}
          label="All Torrents"
          count={totalCount}
          active={filterState === 'all' && !categoryFilter}
          onClick={() => handleFilterClick('all')}
        />

        {/* Divider */}
        <div className="h-px bg-glass-border my-2" />

        {/* Categories */}
        <p className="text-[10px] uppercase tracking-widest text-text-muted px-3 mb-1">Categories</p>
        {Object.keys(categories).map((catName) => {
          const config = getCategoryConfig(catName)
          const Icon = iconMap[config.icon]
          const catCounts = counts[catName]
          return (
            <SidebarItem
              key={catName}
              icon={<Icon size={16} className={config.colorClass} />}
              label={config.label}
              count={catCounts?.total ?? 0}
              activeCount={catCounts?.active ?? 0}
              active={categoryFilter === catName}
              onClick={() => handleCategoryClick(catName)}
            />
          )
        })}

        {/* Bottom spacer + settings */}
        <div className="flex-1" />
        <div className="h-px bg-glass-border my-2" />
        <SidebarItem
          icon={<Settings size={16} />}
          label="Settings"
          count={0}
          active={false}
          onClick={() => setShowSettings(true)}
          hideCount
        />
      </div>

      {showSettings && <DesktopSettingsDialog onClose={() => setShowSettings(false)} />}
    </div>
  )
}

function SidebarItem({
  icon,
  label,
  count,
  activeCount,
  active,
  onClick,
  accentCount,
  hideCount,
}: {
  icon: React.ReactNode
  label: string
  count: number
  activeCount?: number
  active: boolean
  onClick: () => void
  accentCount?: boolean
  hideCount?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
        active
          ? 'bg-white/10 text-text-primary'
          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
      )}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {!hideCount && (
        <span className={clsx(
          'text-xs font-mono tabular-nums',
          accentCount ? 'text-accent-blue' : 'text-text-muted',
        )}>
          {count}
        </span>
      )}
      {activeCount !== undefined && activeCount > 0 && (
        <span className="text-[10px] font-mono bg-accent-blue/20 text-accent-blue px-1.5 py-0.5 rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  )
}
