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
  firstShown: boolean
}

// With several humans the first player is chosen at begin-play, so the first-player choice is only for the other games
export const gamePresets: Record<string, GamePreset> = {
  'preset-solo': { mode: 'solo', title: 'Lobby: Player vs Robots', humans: 1, robots: 1, humansShown: false, humansRange: [1, 1], robotsMin: 1, firstShown: true },
  'preset-multi': { mode: 'multi', title: 'Lobby: 2-4 Multiplayer', humans: 2, robots: 0, humansShown: true, humansRange: [2, 4], robotsMin: 0, firstShown: false },
  'preset-robots': { mode: 'robots', title: 'Lobby: Robot Battle', humans: 0, robots: 2, humansShown: false, humansRange: [0, 0], robotsMin: 2, firstShown: true }
}

/**
 * The preset for a given game mode, so the lobby can be shown for it without a preset button having been clicked.
 * @param mode
 */
export const presetForMode = (mode: GameMode): GamePreset => Object.values(gamePresets).find(preset => preset.mode === mode) as GamePreset
