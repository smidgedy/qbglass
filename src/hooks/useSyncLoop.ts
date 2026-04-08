import { useEffect, useRef } from 'react'
import { useTorrentStore } from '../store/useTorrentStore'
import { fetchMainData } from '../api/sync'

const MAX_HISTORY = 60

export function useSyncLoop() {
  const authenticated = useTorrentStore((s) => s.authenticated)
  const applyMainDataDelta = useTorrentStore((s) => s.applyMainDataDelta)
  const ridRef = useRef(0)

  useEffect(() => {
    if (!authenticated) return

    let cancelled = false
    let timeoutId: number

    async function poll() {
      if (cancelled) return
      try {
        const data = await fetchMainData(ridRef.current)
        if (cancelled) return
        ridRef.current = data.rid
        applyMainDataDelta(data)

        // Record speed history
        const state = useTorrentStore.getState()
        if (state.serverState) {
          const dl = state.serverState.dl_info_speed
          const ul = state.serverState.up_info_speed
          useTorrentStore.setState({
            dlSpeedHistory: [...state.dlSpeedHistory.slice(-(MAX_HISTORY - 1)), dl],
            ulSpeedHistory: [...state.ulSpeedHistory.slice(-(MAX_HISTORY - 1)), ul],
          })
        }
      } catch (e) {
        if (cancelled) return
        if (e instanceof Error && e.message === 'Unauthorized') {
          useTorrentStore.getState().setAuthenticated(false)
          return
        }
      }
      if (!cancelled) {
        const torrents = useTorrentStore.getState().torrents
        const hasActive = Object.values(torrents).some(
          (t) => t.dlspeed > 0 || t.upspeed > 0,
        )
        timeoutId = window.setTimeout(poll, hasActive ? 2000 : 8000)
      }
    }

    poll()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [authenticated, applyMainDataDelta])
}
