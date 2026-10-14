import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import getAttackLock from './attackLock'
import queueTimeout from '../queue'
import updatePlayerStats from './updatePlayerStats'
import { applyLocalPlayerView } from './localPlayerView'
import { getSession } from '../setup/gameSession'
import { getGameMode } from '../setup/gameOptions'
import { clearHeatHint, showHeatHint, victimsOf } from './heatHint'
import { clearValidTargets, showValidTargets } from './validTargets'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/** How long a human attacker's own lock stays on once their turn starts. This used to be 400ms to match a
 * board-resize animation (sass/game-pieces.sass's old per-turn `.matrix` resize, confirmed via git history -
 * `d1be1695`); that resize was removed later and nothing on `.player` itself has ever had a CSS transition to
 * wait out, so the original value outlived the thing it was timed to. It stays non-zero, just much shorter, for
 * the one real job it still does in local hot-seat: attackFleet.ts's guard only blocks attacking the *current*
 * attacker's own board, so without this lock a human could rapid-click several different victims inside what
 * should be a single turn. Remote play already blocks the same thing independently, by socket identity
 * (lobbyServer.ts's gameAction handler), so this is redundant there - but it costs nothing to keep uniform. */
const ATTACKER_LOCK_MS = 100

/**
 * Track player stats such as attacks and turns
 * @param player
 * @param hitShip
 * @param sunkShip
 */
const updatePlayer = (player: Player, hitShip?: boolean, sunkShip: number = 0): Player => {
  if (player.attacker) {
    if (hitShip) {
      ++player.attacks.hit
    } else {
      ++player.attacks.miss
    }
    if (sunkShip) {
      ++player.attacks.sunk
    }
  }
  // If we add house rules options, enable replay on successful hit here
  // if (hitShip) {
  //   queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  //   return player
  // }
  player.attacker = !player.attacker
  const attackLock = getAttackLock(player)
  attackLock.isLocked = true
  // A human's heat-map hint shows on the boards they attack for the length of their turn
  // A human sees which cells of the boards they attack can still be hit
  if (!player.isRobot) {
    queueTimeout(player, () => victimsOf(player).forEach(victim => player.attacker ? showValidTargets(victim) : clearValidTargets(victim)), 0)
  }
  if (!player.isRobot && player.showHint) {
    queueTimeout(player, () => victimsOf(player).forEach(victim => player.attacker ? showHeatHint(victim) : clearHeatHint(victim)), 0)
  }
  if (player.attacker) {
    const root = jsonDom.getTopParentItem(player as unknown as DomItem) as DomItemRoot
    if (!player.isRobot) {
      queueTimeout(player, () => { attackLock.isLocked = false }, ATTACKER_LOCK_MS)
      // Remote play only (see gameSession.ts) - starts/resets this player's own turn-timeout deadline. Fired
      // synchronously, right as the turn actually begins, not queued - a queued call would start the clock
      // late relative to the real wall-clock deadline a remote client is shown.
      getSession(player as unknown as DomItem).onAttackerChanged?.(player, root)
    }
    // Local-only role recompute (never remote, which always sets onAttackerChanged above - that's what tells
    // hot-seat's own 'multi' apart from a remote room's identical GameMode). Hot-seat: the physical "whoever's
    // turn it is" is this mode's own "own" viewer, re-marked every turn so the role-based layout (see
    // localPlayerView.ts) follows whoever is currently holding the screen, human or robot. Solo: "own" is
    // always the one human, but target/summary still needs recomputing every turn - robots attack each other
    // too, not just the human, so a robot's own role genuinely changes depending on whose turn it actually is.
    // Robots-only needs no recompute at all - see startNewGame.ts's own one-time setup, never "own" either way.
    const mode = getGameMode(root)
    if (mode === 'multi' || mode === 'solo') {
      const players = jsonDom.getParentsByClass('boards', player as unknown as DomItem)[0].children as Player[]
      if (mode === 'solo') {
        applyLocalPlayerView(players, players.find(p => !p.isRobot) ?? null)
      } else if (!getSession(root).onAttackerChanged) {
        applyLocalPlayerView(players, player)
      }
    }
    ++player.turnCnt
  } else {
    queueTimeout(player, () => { attackLock.isLocked = false }, 0)
  }
  // Every board keeps its size. The player whose turn it is is marked with a yellow outline on their panel. The players
  // they can attack glow in that player's colour, so the target is clear
  queueTimeout(player, () => {
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(player, { attributes: { style: { outline: player.attacker ? '3px solid yellow' : 'none' } } }) as DomItem)
    victimsOf(player).forEach(victim => jsonDom.updateElement(siFunciona.mergeObjectsMutable(victim, { attributes: { style: { boxShadow: player.attacker ? `0 0 0 6px ${player.colour}` : 'none' } } }) as DomItem))
  }, 0)
  queueTimeout(player, () => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  return player
}

export default updatePlayer
