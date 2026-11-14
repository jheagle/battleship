import { installGlobal } from 'pseudo-dom'

/**
 * The server builds each room's game as a real treeloom tree (gameplay.ts creates its head and body with
 * `document.createElement`, and rendering writes elements), so a plain Node process needs a global `document`, plus
 * Node/Element/HTMLElement - which a browser or jsdom already has. This file's only job is that one side effect:
 * import it first, before anything that builds or renders a tree. (Importing treeloom itself no longer needs it:
 * treeloom builds its own documentItem lazily, on first use, since treeloom#121.)
 */
installGlobal()
