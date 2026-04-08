import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: 'blue' | 'green' | 'red'
  onClick?: () => void
}

export function GlassCard({ children, className, glow, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-panel',
        glow === 'blue' && 'glass-glow-blue',
        glow === 'green' && 'glass-glow-green',
        glow === 'red' && 'glass-glow-red',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
