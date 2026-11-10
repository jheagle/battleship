import jsonDom from 'json-dom'
import shadeShips from '../cells/shadeShips'
import { getSession } from '../setup/gameSession'
import { setGameMode } from '../setup/gameOptions'
import { startNewGame } from '../setup/startNewGame'
import type { DomItemRoot } from 'json-dom/dist/domItem/types'
import type { ListenerFunction } from 'json-dom/dist/events/types'
import type { Player } from '../types'

/** How many robots play the demo game behind the menu. */
export const DEMO_ROBOTS = 3

/** The pause after a demo game is won, before the next one starts. */
export const RESTART_MS = 4000

/** The demo game currently running, if any. */
let demoRoot: DomItemRoot | null = null

/**
 * Whether the main menu is showing: the demo only plays behind it, and stops once a real game replaces it.
 * @param doc
 */
const menuShowing = (doc: Document): boolean => doc.querySelector('main .main-menu') !== null

/**
 * The decorative layer behind the menu the demo game renders into. It is hidden from screen readers and inert, so its
 * boards are never announced, focused or clicked: it is scenery, not part of the page.
 * @param doc
 */
export const introLayer = (doc: Document): HTMLElement => {
  let layer = doc.querySelector<HTMLElement>('.intro-demo')
  if (!layer) {
    layer = doc.createElement('div')
    layer.className = 'intro-demo'
    layer.setAttribute('aria-hidden', 'true')
    layer.setAttribute('inert', '')
    const main = doc.querySelector('main')
    doc.body.insertBefore(layer, main)
  }
  return layer
}

/**
 * A game root of its own whose body is the demo layer, the same way the server gives every room its own root (see
 * server/gameplay.ts's buildIsolatedRoot): its own session, queue and boards, independent of the player's game.
 * @param listeners the real game's listeners (named listeners on the demo's boards must resolve)
 * @param layer
 */
const demoGameRoot = (listeners: Record<string, ListenerFunction>, layer: HTMLElement): DomItemRoot => {
  const head = jsonDom.createDomItem({ nodeName: 'head', attributes: {}, element: document.createElement('head'), children: [] })
  const body = jsonDom.createDomItem({ nodeName: 'div', attributes: { className: 'intro-demo' }, element: layer, children: [] })
  return jsonDom.documentDomItem(listeners, jsonDom.initRoot([head, body], listeners))
}

/**
 * Play one robots-only game, with every ship shown so the hits land on something visible.
 * @param root
 */
const playDemo = (root: DomItemRoot): void => {
  setGameMode(root, 'robots')
  startNewGame(root, 0, DEMO_ROBOTS, true, 'off')
  const boards = jsonDom.getChildrenByClass('boards', root.body)[0]
  ;((boards?.children ?? []) as Player[]).forEach(player => shadeShips(player, true))
}

/** Whether the player asked for less motion: the demo is then a still frame (boards and ships, no shots). */
const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

/** Stop the demo and clear its layer. */
export const stopIntroDemo = (): void => {
  demoRoot = null
  const layer = typeof document === 'undefined' ? null : document.querySelector('.intro-demo')
  layer?.replaceChildren()
}

/**
 * Robots play a real game of Cloakfall behind the menu, using the game's own code, and start another after each win.
 * With prefers-reduced-motion it is a still frame instead: the boards and their ships, and no shots.
 * Every step of the demo runs on its own queue, which stops it as soon as the menu is gone (a real game started), so
 * nothing needs to remember to stop it; showing the menu again (startMenu) starts a fresh one.
 * @param listeners
 */
export const startIntroDemo = (listeners: Record<string, ListenerFunction>): void => {
  if (demoRoot && menuShowing(document)) {
    return
  }
  const layer = introLayer(document)
  layer.replaceChildren()
  const root = demoGameRoot(listeners, layer)
  const session = getSession(root)
  const queue = session.queue
  const still = prefersReducedMotion()
  session.queue = (fn: Function, time: number = 0, ...args: any[]): Promise<any> => {
    if (still) {
      // Nothing moves: the robots never take a turn
      return Promise.resolve()
    }
    if (demoRoot !== root || !menuShowing(document)) {
      if (demoRoot === root) {
        stopIntroDemo()
      }
      return Promise.resolve()
    }
    return queue(fn, time, ...args)
  }
  session.onGameOver = () => {
    session.queue(() => playDemo(root), RESTART_MS)
  }
  demoRoot = root
  playDemo(root)
}
