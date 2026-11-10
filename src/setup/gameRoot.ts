import { gameName } from '../theme'
import jsonDom from 'json-dom'
import type { DomItemRoot } from 'json-dom/dist/domItem/types'
import type { ListenerFunction } from 'json-dom/dist/events/types'

/**
 * The page's landmarks: a header with the page's h1 (visually hidden, so the game looks the same, but a screen reader
 * user can find the page by its heading) and the main element the game renders into. Reuses them when the page
 * already has them (a re-run, or a page which provides its own main or h1), creating them at the top of the body
 * otherwise. header is null when the page brought its own h1.
 * @param doc
 */
export const gameLayout = (doc: Document): { header: HTMLElement | null, main: HTMLElement } => {
  // A page which already has its own h1 (and header) keeps them: only one h1, and no second header landmark
  let header = doc.querySelector<HTMLElement>('header.game-header')
  if (!header && !doc.querySelector('h1')) {
    header = doc.createElement('header')
    header.className = 'game-header'
    const heading = doc.createElement('h1')
    heading.className = 'visually-hidden'
    heading.textContent = gameName
    // Inline too, so the heading stays hidden even on a page without the game's stylesheet (layouts.css)
    heading.style.cssText = 'position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; ' +
      'clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;'
    header.appendChild(heading)
    doc.body.insertBefore(header, doc.body.firstChild)
  }
  // Any main the page already has is the game's (a page has only one main landmark)
  let main = doc.querySelector<HTMLElement>('main')
  if (!main) {
    main = doc.createElement('main')
    if (header) {
      header.after(main)
    } else {
      doc.body.insertBefore(main, doc.body.firstChild)
    }
  }
  main.classList.add('game')
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
