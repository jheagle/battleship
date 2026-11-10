import jsonDom from 'json-dom'
import type { DomItemRoot } from 'json-dom/dist/domItem/types'
import type { ListenerFunction } from 'json-dom/dist/events/types'

/**
 * The page's landmarks: a header with the page's h1 (visually hidden, so the game looks the same, but a screen reader
 * user can find the page by its heading) and the main element the game renders into. Reuses them when the page
 * already has them (a re-run, or a page which provides its own), creating them at the top of the body otherwise.
 * @param doc
 */
export const gameLayout = (doc: Document): { header: HTMLElement, main: HTMLElement } => {
  let header = doc.querySelector<HTMLElement>('header.game-header')
  if (!header) {
    header = doc.createElement('header')
    header.className = 'game-header'
    const heading = doc.createElement('h1')
    heading.className = 'visually-hidden'
    heading.textContent = 'Battleship'
    header.appendChild(heading)
    doc.body.insertBefore(header, doc.body.firstChild)
  }
  let main = doc.querySelector<HTMLElement>('main.game')
  if (!main) {
    main = doc.createElement('main')
    main.className = 'game'
    header.after(main)
  }
  return { header, main }
}

/**
 * The game's root, like json-dom's documentDomItem, but its body is the page's main element rather than the body
 * itself, so everything the game renders is inside the main landmark. The tree keeps the same shape (root -> body ->
 * [boards, panels]), which remote play relies on (see remoteGame.ts); the server builds its rooms' roots the same way
 * (gameplay.ts's buildIsolatedRoot).
 * @param listeners
 */
const gameRoot = (listeners: Record<string, ListenerFunction>): DomItemRoot => {
  const { main } = gameLayout(document)
  const head = jsonDom.createDomItem({ nodeName: 'head', attributes: {}, element: document.head, children: [] })
  const body = jsonDom.createDomItem({ nodeName: 'main', attributes: { className: 'game' }, element: main, children: [] })
  return jsonDom.documentDomItem(listeners, jsonDom.initRoot([head, body], listeners))
}

export default gameRoot
