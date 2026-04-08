export interface ArrCategoryConfig {
  label: string
  icon: 'Tv' | 'Film' | 'Music' | 'BookOpen' | 'FolderOpen'
  colorClass: string
}

const ARR_CATEGORIES: Record<string, ArrCategoryConfig> = {
  sonarr:         { label: 'TV Shows',  icon: 'Tv',       colorClass: 'text-sonarr' },
  radarr:         { label: 'Movies',    icon: 'Film',     colorClass: 'text-radarr' },
  lidarr:         { label: 'Music',     icon: 'Music',    colorClass: 'text-lidarr' },
  lazylibrarian:  { label: 'Books',     icon: 'BookOpen', colorClass: 'text-lazylibrarian' },
}

export function getCategoryConfig(name: string): ArrCategoryConfig {
  return ARR_CATEGORIES[name.toLowerCase()] ?? {
    label: name || 'Uncategorized',
    icon: 'FolderOpen' as const,
    colorClass: 'text-text-secondary',
  }
}
