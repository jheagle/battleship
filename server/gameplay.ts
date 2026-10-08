import './installPseudoDom'
import jsonDom from 'json-dom'
import attackListener from '../src/attack/attackListener'
import hintListener from '../src/attack/hintListener'
import placementListener from '../src/setup/placementListener'
import shipsListener from '../src/attack/shipsListener'
import { startNewGame } from '../src/setup/startNewGame'
import { setGameMode } from '../src/setup/gameOptions'
import { getSession } from '../src/setup/gameSession'
import { redactGameBody } from '../src/network/redactGameState'
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

/**
 * Build and start a real game for a room's connected players, reusing the engine entirely unmodified - the same
 * startNewGame local play uses, just handed a pseudo-dom-backed root instead of a real browser one (the engine
 * already runs headless this way, see battleship's own Node self-start path and its whole test suite). Every
 * seat is a connected human, so robots are always 0.
 * @param roomPlayers the room's players, in join order - buildPlayers generates players in this same order, so
 * this is what maps a socket to the player it owns. buildPlayers has no way to take the real names in at build
 * time (the default "Player N" names are all it knows there), so they are set, and the stats panel they are
 * already baked into refreshed, right after.
 * @param hints
 * @param firstGoesFirst
 */
export const startRoomGame = (roomPlayers: Array<[socketId: string, name: string]>, hints: HintSetting, firstGoesFirst: boolean): RoomGame => {
  const root = buildIsolatedRoot({ attackListener, hintListener, placementListener, shipsListener })
  // Every seat is a connected human, so this is always the multiplayer game mode - startNewGame itself reads this
  // (its own robots-only branch would otherwise fire, since a fresh session's mode defaults to 'robots').
  setGameMode(root, 'multi')
  startNewGame(root, roomPlayers.length, 0, firstGoesFirst, hints)
  const players = jsonDom.getChildrenByClass('boards', root.body)[0].children as Player[]
  players.forEach((player, i) => {
    player.name = roomPlayers[i][1]
    updatePlayerStats(player)
  })
  const playerBySocket = new Map(roomPlayers.map(([socketId], i) => [socketId, players[i]]))
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
