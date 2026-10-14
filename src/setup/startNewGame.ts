import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import boards from '../components/layout/boards'
import buildPlayers from './buildPlayers'
import computerAttack from '../robot/computerAttack'
import updatePlayer from '../attack/updatePlayer'
import { applyLocalPlayerView } from '../attack/localPlayerView'
import { startPlacement } from './placement'
import { getGameMode, setHintSetting } from './gameOptions'
import showShipsControl from '../components/layout/showShipsControl'
import type { GameMode, HintSetting } from './gameOptions'
import type { DomItemRoot } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Remove everything from the page: whatever screen was showing (the menu, a finished game's final scores, or a game
 * in progress), so a new one can be built on a blank page.
 * @param parent
 */
const clearBody = (parent: DomItemRoot): void => {
  for (let i = parent.body.children.length - 1; i >= 0; --i) {
    jsonDom.removeChild(parent.body, parent.body.children[i])
  }
}

/**
 * Set every player's role for robots-only/watch, the one mode whose view never changes by turn at all - nobody
 * is ever "own", so there is nothing for updatePlayer.ts's own per-turn hook to recompute (see its own comment).
 * Solo's "own" viewer is also fixed (always the human) but its opponents' target/summary split still depends on
 * whose turn it actually is (robots attack each other too, not just the human), so solo is recomputed on every
 * turn the same way hot-seat is - see updatePlayer.ts - not set up here. Remote's own per-socket roles are
 * applied separately, per viewer, by redactGameState.ts - never here, on the one shared server tree.
 * @param players
 * @param mode
 */
const applyInitialLocalView = (players: Player[], mode: GameMode): void => {
  if (mode === 'robots') {
    applyLocalPlayerView(players, null)
  }
}

/**
 * Pick the first attacker, and let a robot start if it is one.
 * @param order
 * @param firstGoesFirst undefined when the order was chosen, so the first player of it goes first
 */
const startRound = (order: Player[], firstGoesFirst: boolean | undefined): void => {
  const firstAttacker = updatePlayer(firstGoesFirst === false ? order[siFunciona.randomInteger(order.length)] : order[0])
  if (firstAttacker.isRobot) {
    computerAttack(firstAttacker, order)
  }
}

/**
 * Build the players, place their ships, and start the round. Shared by beginRound (reading these settings from the
 * lobby form) and playAgain (reading them from the settings the last game was started with) - either way, this is
 * the one place a round actually begins. A remote game passes startRemotePlacement (simultaneous per-player
 * placement, no handoff) in place of the default, and onPlayersBuilt to set each player's real name before
 * anything is ever rendered or pushed - see server/gameplay.ts. Local play needs neither: a human types their own
 * name during their own handoff screen (see placement.ts's nameInput), since there is nothing to know upfront.
 * @param parent
 * @param humans
 * @param robots
 * @param firstGoesFirst
 * @param hints
 * @param placementStarter
 * @param onPlayersBuilt
 */
export const startNewGame = (
  parent: DomItemRoot,
  humans: number,
  robots: number,
  firstGoesFirst: boolean,
  hints: HintSetting,
  placementStarter: typeof startPlacement = startPlacement,
  onPlayersBuilt: (players: Player[]) => void = () => {}
): void => {
  setHintSetting(parent, hints)
  clearBody(parent)
  // Robots only: one control above the boards shows every ship at once
  if (getGameMode(parent) === 'robots') {
    jsonDom.renderHtml(jsonDom.createDomItem(showShipsControl()), parent.body)
  }
  const players = jsonDom.renderHtml(boards(buildPlayers(humans, parent.body, robots)), parent.body).children as Player[]
  // With hints on for everyone, every human gets them on their turn; with them off or optional, nobody does by default
  players.filter(player => !player.isRobot).forEach(player => { player.showHint = hints === 'on' })
  onPlayersBuilt(players)
  const mode = getGameMode(parent)
  placementStarter(players, parent.body, order => {
    // Only once placement is actually finished - any earlier would shrink/pin boards while a human is still
    // trying to place ships on them.
    applyInitialLocalView(order, mode)
    startRound(order, humans > 1 ? undefined : firstGoesFirst)
  })
}
