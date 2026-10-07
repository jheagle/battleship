import { getSession } from './gameSession'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * The heat-map hint setting chosen in the lobby. Off hides it, Optional gives each human a checkbox in their panel, and
 * On shows it to every human on their turn.
 */
export type HintSetting = 'off' | 'optional' | 'on'

export const getHintSetting = (item: DomItem): HintSetting => getSession(item).hints

export const setHintSetting = (item: DomItem, hints: HintSetting): void => {
  getSession(item).hints = hints
}

/**
 * The game type chosen on the entry screen: one player against robots, multiplayer with two to four humans, or a battle
 * of robots only.
 */
export type GameMode = 'solo' | 'multi' | 'robots'

export const getGameMode = (item: DomItem): GameMode => getSession(item).mode

export const setGameMode = (item: DomItem, mode: GameMode): void => {
  getSession(item).mode = mode
}

/**
 * The settings a game was actually started with: how many humans and robots, and who goes first. Set once, when
 * beginRound starts a game from the lobby form; read by playAgain (to start an identical game again) and
 * returnToLobby (to show the lobby pre-filled with them, rather than a preset's defaults).
 */
export interface GameSettings {
  humans: number
  robots: number
  firstGoesFirst: boolean
}

export const getGameSettings = (item: DomItem): GameSettings => getSession(item).settings

export const setGameSettings = (item: DomItem, settings: GameSettings): void => {
  getSession(item).settings = settings
}
