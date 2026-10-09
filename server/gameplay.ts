import './installPseudoDom'
import jsonDom from 'json-dom'
import attackListener from '../src/attack/attackListener'
import hintListener from '../src/attack/hintListener'
import placementListener from '../src/setup/placementListener'
import remotePlacementListener from '../src/setup/remotePlacementListener'
import shipsListener from '../src/attack/shipsListener'
import { startNewGame } from '../src/setup/startNewGame'
import { startRemotePlacement } from '../src/setup/remotePlacement'
import { setGameMode } from '../src/setup/gameOptions'
import { getSession } from '../src/setup/gameSession'
import { redactGameBody } from '../src/network/redactGameState'
import remoteFinalScore from '../src/components/layout/remoteFinalScore'
import updatePlayerStats from '../src/attack/updatePlayerStats'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'
import type { ListenerFunction } from 'json-dom/dist/events/types'
import type { HintSetting } from '../src/setup/gameOptions'
import type { Player } from '../src/types'

/** One room's started game: its own document root, its players, and which socket owns which player. */
export interface RoomGame {
  root: DomItemRoot
  players: Player[]
  playerBySocket: Map<string, Player>
}

/**
 * A root with its own independent head/body elements, rather than json-dom's own default (documentDomItem's
 * default root construction, via initChildren, reads document.head/document.body - the *one* global document's
 * own fixed elements, shared by every call in this process). That default is exactly right for a browser or a
 * single jsdom test, where there is only ever one document - but a server holding several rooms' games at once
 * needs each one fully independent, so this builds the root's head/body from freshly-created elements instead.
 * @param listeners
 */
const buildIsolatedRoot = (listeners: Record<string, ListenerFunction>): DomItemRoot => {
  const head = jsonDom.createDomItem({ nodeName: 'head', attributes: {}, element: document.createElement('head'), children: [] }) as DomItem
  const body = jsonDom.createDomItem({ nodeName: 'body', attributes: {}, element: document.createElement('body'), children: [] }) as DomItem
  return jsonDom.documentDomItem(listeners, jsonDom.initRoot([head, body], listeners))
}

/** remoteFinalScore.ts's own Play Again button needs this name registered just for renderHtml's own binding
 * step to succeed - it is never meant to actually run server-side. The real implementation
 * (src/setup/remotePlayAgainListener.ts) only ever runs client-side, once forwarding has already been turned
 * off for this exact reason (see remoteGame.ts's enterRemoteGame) - a forwarded click for this listener name
 * should never reach here at all. */
const remotePlayAgainListener: ListenerFunction = () => {}

/**
 * Build and start a real game for a room's connected players, reusing the engine entirely unmodified - the same
 * startNewGame local play uses, just handed a pseudo-dom-backed root instead of a real browser one (the engine
 * already runs headless this way, see battleship's own Node self-start path and its whole test suite), with
 * startRemotePlacement in place of local hot-seat's own handoff-based placement. Every seat is a connected
 * human, so robots are always 0.
 * @param roomPlayers the room's players, in join order - buildPlayers generates players in this same order, so
 * this is what maps a socket to the player it owns. Real names are set as soon as the players exist (via
 * startNewGame's onPlayersBuilt hook), before placement ever renders anything - buildPlayers itself has no way
 * to take them in at build time, and setting them any later left the very first thing a player sees (their own
 * name, in their own stats panel) showing the default "Player N" instead.
 * @param hints
 * @param firstGoesFirst
 * @param onTimerChange called whenever remote placement's own server-side deadline fires and changes state on
 * its own (auto-placing a not-yet-ready player, moving everyone into ordering) - the one state change in the
 * whole game that happens on a raw timer rather than in response to a dispatched/forwarded action, so it is the
 * one case watchRoomGame's own broadcast hooks (wrapping the session queue, and the gameAction handler's own
 * post-dispatch broadcast) can never see on their own. See remotePlacement.ts's startRemotePlacement.
 */
export const startRoomGame = (roomPlayers: Array<[socketId: string, name: string]>, hints: HintSetting, firstGoesFirst: boolean, onTimerChange: () => void = () => {}): RoomGame => {
  const root = buildIsolatedRoot({ attackListener, hintListener, placementListener, remotePlacementListener, remotePlayAgainListener, shipsListener })
  // Every seat is a connected human, so this is always the multiplayer game mode - startNewGame itself reads this
  // (its own robots-only branch would otherwise fire, since a fresh session's mode defaults to 'robots').
  setGameMode(root, 'multi')
  // Local hot-seat's own final-score screen (Play Again/Change Settings/Main Menu) assumes one physical screen
  // controlling the whole game - none of those make sense yet for several independent remote clients, and
  // registering their listeners here would wire them to local-only flows (starting hot-seat placement again,
  // wiping this room's own root back to a menu) that would corrupt the room for everyone. Show the real result
  // with no buttons instead - see endGame.ts and remoteFinalScore.ts.
  getSession(root).onGameOver = (players, parent) => jsonDom.renderHtml(remoteFinalScore(players), parent.body)
  let players: Player[] = []
  const playerBySocket = new Map<string, Player>()
  startNewGame(root, roomPlayers.length, 0, firstGoesFirst, hints, (p, body, done) => startRemotePlacement(p, body, done, onTimerChange), builtPlayers => {
    players = builtPlayers
    builtPlayers.forEach((player, i) => {
      player.name = roomPlayers[i][1]
      updatePlayerStats(player)
      playerBySocket.set(roomPlayers[i][0], player)
    })
  })
  return { root, players, playerBySocket }
}

/**
 * Push each connected player their own redacted view of the whole screen - the same markup local play renders
 * (boards, placement panel and all), with the boards wrapper's own children replaced per redactGameBody. Called
 * once up front, then arranges for every subsequent queued engine step (an attack, a robot's turn, a placement
 * animation...) to push again once it resolves - every timed engine action for this game funnels through its own
 * session's queue (see gameSession.ts), so wrapping it once here is the one hook point that catches all of them,
 * with no changes needed to the engine itself. The returned function broadcasts again on demand - needed because
 * plenty of real actions (continueTurn, placeCell, finishTurn, choosing/clicking a player to set the turn order)
 * run entirely synchronously, queuing nothing at all, so the queue hook alone would never see them; the caller
 * handling an incoming forwarded action calls this once right after dispatching it, to cover that case too.
 * @param game
 * @param push
 */
export const watchRoomGame = (game: RoomGame, push: (socketId: string, redactedBody: DomItem) => void): () => void => {
  const broadcast = (): void => {
    game.playerBySocket.forEach((viewer, socketId) => push(socketId, redactGameBody(game.root.body, game.players, viewer)))
  }
  const session = getSession(game.root)
  const originalQueue = session.queue
  session.queue = (fn, time, ...args) => originalQueue(fn, time, ...args).then(result => {
    broadcast()
    return result
  })
  broadcast()
  return broadcast
}
