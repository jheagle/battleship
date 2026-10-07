/**
 * The heat-map hint setting chosen in the lobby. Off hides it, Optional gives each human a checkbox in their panel, and
 * On shows it to every human on their turn.
 */
export type HintSetting = 'off' | 'optional' | 'on'

const options: { hints: HintSetting } = { hints: 'optional' }

export const getHintSetting = (): HintSetting => options.hints

export const setHintSetting = (hints: HintSetting): void => {
  options.hints = hints
}

/**
 * The game type chosen on the entry screen: one player against robots, multiplayer with two to four humans, or a battle
 * of robots only.
 */
export type GameMode = 'solo' | 'multi' | 'robots'

const mode: { current: GameMode } = { current: 'robots' }

export const getGameMode = (): GameMode => mode.current

export const setGameMode = (current: GameMode): void => {
  mode.current = current
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

const settings: { current: GameSettings } = { current: { humans: 0, robots: 2, firstGoesFirst: true } }

export const getGameSettings = (): GameSettings => settings.current

export const setGameSettings = (current: GameSettings): void => {
  settings.current = current
}
