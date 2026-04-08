export interface Theme {
  id: string
  name: string
  colors: {
    // Background
    bgFrom: string
    bgTo: string
    bgGlow: string
    // Glass
    glassBg: string
    glassBorder: string
    glassHover: string
    // Surfaces
    surface: string
    surfaceRaised: string
    surfaceSolid: string  // near-opaque for modals/sheets
    surfaceNav: string    // bottom nav
    // Accents
    accent: string        // primary accent
    accentGreen: string
    accentAmber: string
    accentRed: string
    accentPurple: string
    // Text
    textPrimary: string
    textSecondary: string
    textMuted: string
    // Arr categories
    sonarr: string
    radarr: string
    lidarr: string
    lazylibrarian: string
  }
}

export const themes: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      bgFrom: 'oklch(0.06 0.02 280)', bgTo: 'oklch(0.04 0.01 220)', bgGlow: 'oklch(0.2 0.08 240 / 0.15)',
      glassBg: 'oklch(0.15 0.01 260 / 0.6)', glassBorder: 'oklch(0.4 0.01 260 / 0.2)', glassHover: 'oklch(0.2 0.01 260 / 0.7)',
      surface: 'oklch(0.08 0.01 260)', surfaceRaised: 'oklch(0.12 0.01 260 / 0.8)',
      surfaceSolid: 'oklch(0.12 0.015 260 / 0.97)', surfaceNav: 'oklch(0.10 0.015 260 / 0.95)',
      accent: 'oklch(0.7 0.15 240)', accentGreen: 'oklch(0.7 0.15 150)', accentAmber: 'oklch(0.75 0.15 80)',
      accentRed: 'oklch(0.65 0.2 25)', accentPurple: 'oklch(0.7 0.12 300)',
      textPrimary: 'oklch(0.95 0 0)', textSecondary: 'oklch(0.65 0 0)', textMuted: 'oklch(0.45 0 0)',
      sonarr: 'oklch(0.65 0.15 220)', radarr: 'oklch(0.65 0.15 45)', lidarr: 'oklch(0.65 0.15 150)', lazylibrarian: 'oklch(0.65 0.12 60)',
    },
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    colors: {
      bgFrom: '#1e1e2e', bgTo: '#181825', bgGlow: 'oklch(0.55 0.15 265 / 0.1)',
      glassBg: 'oklch(0.25 0.02 265 / 0.6)', glassBorder: 'oklch(0.4 0.02 265 / 0.25)', glassHover: 'oklch(0.3 0.02 265 / 0.7)',
      surface: '#1e1e2e', surfaceRaised: 'oklch(0.28 0.02 265 / 0.8)',
      surfaceSolid: 'oklch(0.25 0.025 265 / 0.97)', surfaceNav: 'oklch(0.22 0.025 265 / 0.95)',
      accent: '#89b4fa', accentGreen: '#a6e3a1', accentAmber: '#f9e2af',
      accentRed: '#f38ba8', accentPurple: '#cba6f7',
      textPrimary: '#cdd6f4', textSecondary: '#a6adc8', textMuted: '#6c7086',
      sonarr: '#89b4fa', radarr: '#fab387', lidarr: '#a6e3a1', lazylibrarian: '#f9e2af',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      bgFrom: 'oklch(0.05 0.03 310)', bgTo: 'oklch(0.03 0.02 280)', bgGlow: 'oklch(0.4 0.2 325 / 0.15)',
      glassBg: 'oklch(0.12 0.03 310 / 0.6)', glassBorder: 'oklch(0.4 0.1 325 / 0.25)', glassHover: 'oklch(0.18 0.04 310 / 0.7)',
      surface: 'oklch(0.06 0.03 310)', surfaceRaised: 'oklch(0.10 0.03 310 / 0.8)',
      surfaceSolid: 'oklch(0.10 0.03 310 / 0.97)', surfaceNav: 'oklch(0.08 0.03 310 / 0.95)',
      accent: 'oklch(0.75 0.2 325)', accentGreen: 'oklch(0.8 0.2 155)', accentAmber: 'oklch(0.8 0.15 85)',
      accentRed: 'oklch(0.65 0.25 20)', accentPurple: 'oklch(0.6 0.2 290)',
      textPrimary: 'oklch(0.95 0.02 325)', textSecondary: 'oklch(0.7 0.03 310)', textMuted: 'oklch(0.45 0.02 310)',
      sonarr: 'oklch(0.7 0.15 325)', radarr: 'oklch(0.7 0.15 40)', lidarr: 'oklch(0.7 0.2 155)', lazylibrarian: 'oklch(0.7 0.12 60)',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    colors: {
      bgFrom: 'oklch(0.06 0.03 30)', bgTo: 'oklch(0.04 0.02 15)', bgGlow: 'oklch(0.3 0.15 30 / 0.15)',
      glassBg: 'oklch(0.14 0.02 25 / 0.6)', glassBorder: 'oklch(0.35 0.05 30 / 0.25)', glassHover: 'oklch(0.2 0.03 25 / 0.7)',
      surface: 'oklch(0.07 0.02 25)', surfaceRaised: 'oklch(0.12 0.02 25 / 0.8)',
      surfaceSolid: 'oklch(0.12 0.025 25 / 0.97)', surfaceNav: 'oklch(0.09 0.02 25 / 0.95)',
      accent: 'oklch(0.7 0.18 40)', accentGreen: 'oklch(0.7 0.12 155)', accentAmber: 'oklch(0.8 0.15 75)',
      accentRed: 'oklch(0.65 0.2 25)', accentPurple: 'oklch(0.6 0.12 340)',
      textPrimary: 'oklch(0.93 0.02 50)', textSecondary: 'oklch(0.65 0.03 40)', textMuted: 'oklch(0.45 0.02 30)',
      sonarr: 'oklch(0.65 0.12 40)', radarr: 'oklch(0.7 0.18 40)', lidarr: 'oklch(0.65 0.12 155)', lazylibrarian: 'oklch(0.65 0.1 70)',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      bgFrom: 'oklch(0.05 0.02 170)', bgTo: 'oklch(0.04 0.015 200)', bgGlow: 'oklch(0.3 0.12 165 / 0.15)',
      glassBg: 'oklch(0.13 0.02 175 / 0.6)', glassBorder: 'oklch(0.35 0.04 170 / 0.25)', glassHover: 'oklch(0.18 0.02 175 / 0.7)',
      surface: 'oklch(0.06 0.015 175)', surfaceRaised: 'oklch(0.11 0.02 175 / 0.8)',
      surfaceSolid: 'oklch(0.11 0.02 175 / 0.97)', surfaceNav: 'oklch(0.08 0.02 175 / 0.95)',
      accent: 'oklch(0.75 0.15 165)', accentGreen: 'oklch(0.75 0.15 140)', accentAmber: 'oklch(0.8 0.13 85)',
      accentRed: 'oklch(0.65 0.18 25)', accentPurple: 'oklch(0.65 0.15 290)',
      textPrimary: 'oklch(0.93 0.01 170)', textSecondary: 'oklch(0.65 0.02 170)', textMuted: 'oklch(0.45 0.015 170)',
      sonarr: 'oklch(0.65 0.12 200)', radarr: 'oklch(0.65 0.12 45)', lidarr: 'oklch(0.65 0.15 140)', lazylibrarian: 'oklch(0.65 0.1 65)',
    },
  },
  {
    id: 'royal',
    name: 'Royal',
    colors: {
      bgFrom: 'oklch(0.05 0.03 290)', bgTo: 'oklch(0.03 0.02 270)', bgGlow: 'oklch(0.25 0.12 290 / 0.15)',
      glassBg: 'oklch(0.13 0.03 285 / 0.6)', glassBorder: 'oklch(0.35 0.05 290 / 0.25)', glassHover: 'oklch(0.18 0.03 285 / 0.7)',
      surface: 'oklch(0.06 0.025 285)', surfaceRaised: 'oklch(0.11 0.03 285 / 0.8)',
      surfaceSolid: 'oklch(0.11 0.03 285 / 0.97)', surfaceNav: 'oklch(0.08 0.025 285 / 0.95)',
      accent: 'oklch(0.65 0.18 290)', accentGreen: 'oklch(0.7 0.12 155)', accentAmber: 'oklch(0.75 0.15 75)',
      accentRed: 'oklch(0.6 0.2 20)', accentPurple: 'oklch(0.7 0.15 310)',
      textPrimary: 'oklch(0.93 0.01 290)', textSecondary: 'oklch(0.65 0.02 285)', textMuted: 'oklch(0.45 0.02 285)',
      sonarr: 'oklch(0.6 0.12 290)', radarr: 'oklch(0.65 0.12 45)', lidarr: 'oklch(0.65 0.12 155)', lazylibrarian: 'oklch(0.6 0.1 60)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      bgFrom: 'oklch(0.05 0.02 230)', bgTo: 'oklch(0.03 0.015 210)', bgGlow: 'oklch(0.25 0.1 220 / 0.15)',
      glassBg: 'oklch(0.13 0.02 225 / 0.6)', glassBorder: 'oklch(0.35 0.04 230 / 0.25)', glassHover: 'oklch(0.18 0.02 225 / 0.7)',
      surface: 'oklch(0.06 0.02 225)', surfaceRaised: 'oklch(0.11 0.02 225 / 0.8)',
      surfaceSolid: 'oklch(0.11 0.02 225 / 0.97)', surfaceNav: 'oklch(0.08 0.02 225 / 0.95)',
      accent: 'oklch(0.7 0.13 220)', accentGreen: 'oklch(0.7 0.13 165)', accentAmber: 'oklch(0.75 0.13 80)',
      accentRed: 'oklch(0.65 0.18 25)', accentPurple: 'oklch(0.65 0.12 295)',
      textPrimary: 'oklch(0.93 0.01 220)', textSecondary: 'oklch(0.65 0.02 225)', textMuted: 'oklch(0.45 0.015 225)',
      sonarr: 'oklch(0.65 0.13 220)', radarr: 'oklch(0.65 0.12 45)', lidarr: 'oklch(0.65 0.13 165)', lazylibrarian: 'oklch(0.65 0.1 60)',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: {
      bgFrom: 'oklch(0.06 0 0)', bgTo: 'oklch(0.04 0 0)', bgGlow: 'oklch(0.25 0 0 / 0.1)',
      glassBg: 'oklch(0.15 0 0 / 0.6)', glassBorder: 'oklch(0.35 0 0 / 0.2)', glassHover: 'oklch(0.2 0 0 / 0.7)',
      surface: 'oklch(0.08 0 0)', surfaceRaised: 'oklch(0.12 0 0 / 0.8)',
      surfaceSolid: 'oklch(0.12 0 0 / 0.97)', surfaceNav: 'oklch(0.10 0 0 / 0.95)',
      accent: 'oklch(0.8 0 0)', accentGreen: 'oklch(0.7 0.1 150)', accentAmber: 'oklch(0.75 0.1 80)',
      accentRed: 'oklch(0.65 0.15 25)', accentPurple: 'oklch(0.65 0 0)',
      textPrimary: 'oklch(0.92 0 0)', textSecondary: 'oklch(0.6 0 0)', textMuted: 'oklch(0.4 0 0)',
      sonarr: 'oklch(0.6 0 0)', radarr: 'oklch(0.6 0 0)', lidarr: 'oklch(0.6 0 0)', lazylibrarian: 'oklch(0.6 0 0)',
    },
  },
  {
    id: 'solar',
    name: 'Solar',
    colors: {
      bgFrom: '#002b36', bgTo: '#001f27', bgGlow: 'oklch(0.5 0.1 195 / 0.1)',
      glassBg: 'oklch(0.2 0.03 195 / 0.6)', glassBorder: 'oklch(0.35 0.03 195 / 0.25)', glassHover: 'oklch(0.25 0.03 195 / 0.7)',
      surface: '#002b36', surfaceRaised: 'oklch(0.22 0.03 195 / 0.8)',
      surfaceSolid: 'oklch(0.22 0.035 195 / 0.97)', surfaceNav: 'oklch(0.18 0.03 195 / 0.95)',
      accent: '#268bd2', accentGreen: '#859900', accentAmber: '#b58900',
      accentRed: '#dc322f', accentPurple: '#6c71c4',
      textPrimary: '#fdf6e3', textSecondary: '#93a1a1', textMuted: '#586e75',
      sonarr: '#268bd2', radarr: '#cb4b16', lidarr: '#859900', lazylibrarian: '#b58900',
    },
  },
  {
    id: 'frosted-light',
    name: 'Frosted Light',
    colors: {
      bgFrom: 'oklch(0.95 0.01 250)', bgTo: 'oklch(0.92 0.01 230)', bgGlow: 'oklch(0.7 0.08 240 / 0.1)',
      glassBg: 'oklch(1 0 0 / 0.5)', glassBorder: 'oklch(0.7 0.01 250 / 0.2)', glassHover: 'oklch(1 0 0 / 0.6)',
      surface: 'oklch(0.95 0.005 250)', surfaceRaised: 'oklch(1 0 0 / 0.6)',
      surfaceSolid: 'oklch(0.96 0.005 250 / 0.97)', surfaceNav: 'oklch(0.97 0.005 250 / 0.95)',
      accent: 'oklch(0.55 0.2 255)', accentGreen: 'oklch(0.5 0.15 155)', accentAmber: 'oklch(0.6 0.15 75)',
      accentRed: 'oklch(0.55 0.2 25)', accentPurple: 'oklch(0.55 0.15 300)',
      textPrimary: 'oklch(0.15 0 0)', textSecondary: 'oklch(0.4 0 0)', textMuted: 'oklch(0.6 0 0)',
      sonarr: 'oklch(0.5 0.15 230)', radarr: 'oklch(0.55 0.15 45)', lidarr: 'oklch(0.5 0.15 155)', lazylibrarian: 'oklch(0.55 0.12 60)',
    },
  },
]

const STORAGE_KEY = 'qbglass-theme'

export function getStoredThemeId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'midnight'
  } catch {
    return 'midnight'
  }
}

export function storeThemeId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {}
}

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0]
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  const c = theme.colors

  root.style.setProperty('--color-glass-bg', c.glassBg)
  root.style.setProperty('--color-glass-border', c.glassBorder)
  root.style.setProperty('--color-glass-hover', c.glassHover)
  root.style.setProperty('--color-surface', c.surface)
  root.style.setProperty('--color-surface-raised', c.surfaceRaised)
  root.style.setProperty('--color-surface-solid', c.surfaceSolid)
  root.style.setProperty('--color-surface-nav', c.surfaceNav)
  root.style.setProperty('--color-accent-blue', c.accent)
  root.style.setProperty('--color-accent-green', c.accentGreen)
  root.style.setProperty('--color-accent-amber', c.accentAmber)
  root.style.setProperty('--color-accent-red', c.accentRed)
  root.style.setProperty('--color-accent-purple', c.accentPurple)
  root.style.setProperty('--color-text-primary', c.textPrimary)
  root.style.setProperty('--color-text-secondary', c.textSecondary)
  root.style.setProperty('--color-text-muted', c.textMuted)
  root.style.setProperty('--color-sonarr', c.sonarr)
  root.style.setProperty('--color-radarr', c.radarr)
  root.style.setProperty('--color-lidarr', c.lidarr)
  root.style.setProperty('--color-lazylibrarian', c.lazylibrarian)

  // Background gradient and glow
  document.body.style.background = `linear-gradient(135deg, ${c.bgFrom}, ${c.bgTo})`
  document.body.style.color = c.textPrimary

  // Update the ::before glow via a CSS variable
  root.style.setProperty('--bg-glow', c.bgGlow)

  storeThemeId(theme.id)
}
