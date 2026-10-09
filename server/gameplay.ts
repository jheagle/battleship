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
  //
  // Everything else already in the body (boards - still holding every player's own placement panel, and
  // remote-ordering - only ever hidden via style, never removed) is cleared first, not left as a stale sibling:
  // their own buttons still reference remotePlacementListener, which the real client only ever registers as a
  // forwarder (see main.ts, which never registers it directly - forwarding is what makes that safe normally).
  // Once forwarding turns off for the finished game (remoteGame.ts's own enterRemoteGame, for this exact
  // button to run as a real local listener), rendering that stale sibling would throw "Undefined listener
  // function" partway through - before the final-score screen itself ever rendered, clearing the whole page
  // with nothing on it at all.
  getSession(root).onGameOver = (players, parent) => {
    for (let i = parent.body.children.length - 1; i >= 0; --i) {
      jsonDom.removeChild(parent.body, parent.body.children[i])
    }
    jsonDom.renderHtml(remoteFinalScore(players), parent.body)
  }
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

/** How long to wait, after a queued engine step resolves, for any others to follow before actually broadcasting
 * - see watchRoomGame's own comment on why this exists only for that one path. Short enough that nobody could
 * perceive the wait as its own delay, long enough to reliably catch the handful of 0ms-declared steps a single
 * turn change queues one after another (valid-target highlighting, outline, stats - see updatePlayer.ts). */
export const QUEUE_BROADCAST_DEBOUNCE_MS = 60

/**
 * Push each connected player their own redacted view of the whole screen - the same markup local play renders
 * (boards, placement panel and all), with the boards wrapper's own children replaced per redactGameBody. Called
 * once up front, then arranges for every subsequent queued engine step (an attack, a robot's turn, a placement
 * animation...) to push again once it resolves - every timed engine action for this game funnels through its own
 * session's queue (see gameSession.ts), so wrapping it once here is the one hook point that catches all of them,
 * with no changes needed to the engine itself. The returned function broadcasts again on demand, immediately,
 * with no debounce - needed because plenty of real actions (continueTurn, placeCell, finishTurn, choosing/
 * clicking a player to set the turn order) run entirely synchronously, queuing nothing at all, so the queue hook
 * alone would never see them; the caller handling an incoming forwarded action calls this once right after
 * dispatching it, to cover that case too, and whoever just acted deserves to see the result land instantly.
 *
 * The queue-driven path is different: a single turn change queues several follow-up steps in a row (see
 * updatePlayer.ts) - valid-target highlighting, the attacker's outline, stats, twice over (once for whoever's
 * turn just ended, once for whoever's just starting) - and broadcasting after every one of them, unmodified,
 * meant a real redact-and-serialize-and-emit round trip per step, most of which only ever re-send cosmetic
 * detail nobody asked to see again. Debouncing just this path (never the immediate one above) coalesces that
 * whole burst into one real broadcast once it actually settles, without changing the engine's own timing or
 * touching anything local hot-seat relies on - this function is never called for a local game at all.
 * @param game
 * @param push
 */
export const watchRoomGame = (game: RoomGame, push: (socketId: string, redactedBody: DomItem) => void): () => void => {
  const broadcast = (): void => {
    game.playerBySocket.forEach((viewer, socketId) => push(socketId, redactGameBody(game.root.body, game.players, viewer)))
  }
  let debounceTimer: NodeJS.Timeout | null = null
  const debouncedBroadcast = (): void => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
    }
    // unref so a pending debounce never keeps the process (or a test) alive on its own - nothing here is load
    // for anyone unless broadcast() actually needs to run.
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      broadcast()
    }, QUEUE_BROADCAST_DEBOUNCE_MS).unref()
  }
  const session = getSession(game.root)
  const originalQueue = session.queue
  session.queue = (fn, time, ...args) => originalQueue(fn, time, ...args).then(result => {
    debouncedBroadcast()
    return result
  })
  broadcast()
  return broadcast
}
