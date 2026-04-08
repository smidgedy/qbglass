import { useState, useEffect } from 'react'
import { getStoredThemeId, getTheme, applyTheme, type Theme } from '../utils/themes'

export function useTheme() {
  const [themeId, setThemeId] = useState(getStoredThemeId)

  useEffect(() => {
    applyTheme(getTheme(themeId))
  }, [themeId])

  const setTheme = (id: string) => setThemeId(id)
  const theme: Theme = getTheme(themeId)

  return { theme, themeId, setTheme }
}
