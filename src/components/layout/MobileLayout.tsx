import { useState } from 'react'
import { Gauge, ListFilter, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { MobileDashboard } from '../dashboard/MobileDashboard'
import { MobileAllPage } from '../../pages/MobileAllPage'
import { MobileSettingsPage } from '../../pages/MobileSettingsPage'

type MobileTab = 'dashboard' | 'torrents' | 'settings'

const tabs: { value: MobileTab; icon: React.ComponentType<{ size: number }>; label: string }[] = [
  { value: 'dashboard', icon: Gauge, label: 'Overview' },
  { value: 'torrents', icon: ListFilter, label: 'Torrents' },
  { value: 'settings', icon: Settings, label: 'Settings' },
]

export function MobileLayout() {
  const [tab, setTab] = useState<MobileTab>('dashboard')

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      <div className="flex-1 overflow-y-auto">
        {tab === 'dashboard' && <MobileDashboard />}
        {tab === 'torrents' && <MobileAllPage />}
        {tab === 'settings' && <MobileSettingsPage />}
      </div>

      {/* Bottom nav */}
      <nav className="h-16 flex items-center shrink-0 border-t border-glass-border"
           style={{ background: 'oklch(0.10 0.015 260 / 0.95)', backdropFilter: 'blur(20px)' }}>
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-2 transition-colors',
              tab === t.value ? 'text-accent-blue' : 'text-text-secondary',
            )}
          >
            <t.icon size={20} />
            <span className="text-[11px] font-semibold">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
