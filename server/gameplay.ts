import './installPseudoDom'
import jsonDom from 'json-dom'
import attackListener from '../src/attack/attackListener'
import hintListener from '../src/attack/hintListener'
import placementListener from '../src/setup/placementListener'
import shipsListener from '../src/attack/shipsListener'
import { startNewGame } from '../src/setup/startNewGame'
import { getSession } from '../src/setup/gameSession'
import { redactGameState } from '../src/network/redactGameState'
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
 * @param socketIds the room's players, in join order - buildPlayers generates players in this same order, so
 * this is what maps a socket to the player it owns
 * @param hints
 * @param firstGoesFirst
 */
export const startRoomGame = (socketIds: string[], hints: HintSetting, firstGoesFirst: boolean): RoomGame => {
  const root = buildIsolatedRoot({ attackListener, hintListener, placementListener, shipsListener })
  startNewGame(root, socketIds.length, 0, firstGoesFirst, hints)
  const players = jsonDom.getChildrenByClass('boards', root.body)[0].children as Player[]
  const playerBySocket = new Map(socketIds.map((socketId, i) => [socketId, players[i]]))
  return { root, players, playerBySocket }
}

/**
 * Push each connected player their own redacted view of the game, and arrange for every subsequent queued engine
 * step (an attack, a robot's turn, a placement animation...) to push again once it resolves - every timed engine
 * action for this game funnels through its own session's queue (see gameSession.ts), so wrapping it once here is
 * the one hook point that catches all of them, with no changes needed to the engine itself.
 * @param game
 * @param push
 */
export const watchRoomGame = (game: RoomGame, push: (socketId: string, redacted: Player[]) => void): void => {
  const broadcast = (): void => {
    game.playerBySocket.forEach((viewer, socketId) => push(socketId, redactGameState(game.players, viewer)))
  }
  const session = getSession(game.root)
  const originalQueue = session.queue
  session.queue = (fn, time, ...args) => originalQueue(fn, time, ...args).then(result => {
    broadcast()
    return result
  })
  broadcast()
}
