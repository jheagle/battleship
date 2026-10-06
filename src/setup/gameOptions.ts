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
