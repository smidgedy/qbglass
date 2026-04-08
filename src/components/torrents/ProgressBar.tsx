import { clsx } from 'clsx'
import type { TorrentState } from '../../api/types'

interface ProgressBarProps {
  progress: number
  state: TorrentState
  className?: string
}

export function ProgressBar({ progress, state, className }: ProgressBarProps) {
  const isActive = state === 'downloading' || state === 'forcedDL'
  const isSeeding = state === 'uploading' || state === 'forcedUP' || state === 'stalledUP'
  const isError = state === 'error' || state === 'missingFiles'

  const gradientClass = isError
    ? 'bg-gradient-to-r from-accent-red to-accent-red/70'
    : isSeeding
      ? 'bg-gradient-to-r from-accent-green to-accent-green/70'
      : 'bg-gradient-to-r from-accent-blue to-accent-purple'

  return (
    <div className={clsx('h-1.5 rounded-full bg-white/5 overflow-hidden', className)}>
      <div
        className={clsx('h-full rounded-full transition-[width] duration-500 relative', gradientClass)}
        style={{ width: `${Math.max(progress * 100, 0.5)}%` }}
      >
        {isActive && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ animation: 'shimmer 2s infinite' }}
          />
        )}
      </div>
    </div>
  )
}
