import { Tv, Film, Music, BookOpen, FolderOpen } from 'lucide-react'
import { getCategoryConfig } from '../../utils/categories'

const iconMap = { Tv, Film, Music, BookOpen, FolderOpen } as const

export function CategoryBadge({ category }: { category: string }) {
  const config = getCategoryConfig(category)
  const Icon = iconMap[config.icon]

  return (
    <div className={`flex items-center gap-1 ${config.colorClass}`} title={config.label}>
      <Icon size={13} />
    </div>
  )
}
