import type { GameMode } from './gameOptions'

/**
 * A game type on the entry screen, and the lobby it sets up: its title, which fields it shows, and the limits on
 * those fields. `humans`/`robots` are this preset's defaults - a lobby can be shown with different values instead
 * (see showLobby), for returning to it with a game's actual settings.
 */
export interface GamePreset {
  mode: GameMode
  title: string
  humans: number
  robots: number
  humansShown: boolean
  humansRange: [number, number]
  robotsMin: number
  robotsMax: number
  totalMax: number
  firstShown: boolean
}

// With several humans the first player is chosen at begin-play, so the first-player choice is only for the other games.
// robotsMax differs per mode: solo/robots-only are mostly or entirely role-summary boards (see playerView.ts/
// game-pieces.sass's enhanced minimized treatment), so comfortably fit far more than multi's shared-screen boards,
// which stay closer to full size since several can be real, interactive targets at once. totalMax is separate from
// (and tighter than) humansRange[1] + robotsMax for multi specifically - several full-size boards at once is the
// real constraint there, not either field alone.
export const gamePresets: Record<string, GamePreset> = {
  'preset-solo': { mode: 'solo', title: 'Lobby: Player vs Robots', humans: 1, robots: 1, humansShown: false, humansRange: [1, 1], robotsMin: 1, robotsMax: 8, totalMax: 9, firstShown: true },
  'preset-multi': { mode: 'multi', title: 'Lobby: 2-4 Multiplayer', humans: 2, robots: 0, humansShown: true, humansRange: [2, 4], robotsMin: 0, robotsMax: 4, totalMax: 6, firstShown: false },
  'preset-robots': { mode: 'robots', title: 'Lobby: Robot Battle', humans: 0, robots: 2, humansShown: false, humansRange: [0, 0], robotsMin: 2, robotsMax: 12, totalMax: 12, firstShown: true }
}

/**
 * The preset for a given game mode, so the lobby can be shown for it without a preset button having been clicked.
 * @param mode
 */
export const presetForMode = (mode: GameMode): GamePreset => Object.values(gamePresets).find(preset => preset.mode === mode) as GamePreset
