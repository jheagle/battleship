import attackListener from './attack/attackListener'
import placementListener from './setup/placementListener'
import presetListener from './setup/presetListener'
import remoteListener, { showRemoteEntry } from './setup/remoteListener'
import remotePlayAgainListener from './setup/remotePlayAgainListener'
import remoteLeaveListener from './setup/remoteLeaveListener'
import shipsListener from './attack/shipsListener'
import hintListener from './attack/hintListener'
import beginRound from './setup/beginRound'
import restart from './setup/restart'
import playAgain from './setup/playAgain'
import returnToLobby from './setup/returnToLobby'
import startMenu from './setup/startMenu'
import gameRoot from './setup/gameRoot'
import jsonDom from 'json-dom'
import { isNode } from 'browser-or-node'

const cloakfall = (): void => {
  // Create new private reference to the document. In a browser the game renders into a <main> (see gameRoot), under a
  // header with the page's h1; on Node (the server's own module use) it keeps json-dom's default document root.
  const listeners = {
    beginRound,
    attackListener,
    hintListener,
    placementListener,
    presetListener,
    remoteListener,
    remotePlayAgainListener,
    remoteLeaveListener,
    shipsListener,
    restart,
    playAgain,
    returnToLobby
  }
  const documentItem = startMenu(isNode ? jsonDom.documentDomItem(listeners) : gameRoot(listeners))

  // Trigger game to start if running as a Node module. This used to check
  // `!(document instanceof HTMLDocument)`, but pseudo-dom's installGlobal (which must already have run - see below -
  // for `document` to exist here at all) now correctly makes its document satisfy `instanceof HTMLDocument`, since
  // that is the whole point: code should not be able to tell a real document from pseudo-dom's. isNode checks the
  // runtime itself instead, which still works regardless of how close pseudo-dom's document gets to a real one.
  if (isNode) {
    const form = jsonDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
    const submitBtn = jsonDom.getChildrenFromAttribute('type', 'submit', form)
    ;(submitBtn[0].element as HTMLElement).click()
  } else {
    // A shared join link (see remoteListener.ts's enterWaitingRoom) puts the room's own code here - jump
    // straight to the join form with it already filled in, instead of making a joiner read it off the host and
    // type it in by hand.
    const roomCode = new URLSearchParams(window.location.search).get('room')
    if (roomCode) {
      showRemoteEntry(jsonDom.getChildrenByClass('main-menu', documentItem.body)[0], roomCode.toUpperCase())
    }
  }
}

// `export =` (CommonJS `module.exports = cloakfall`), not `export default` (`exports.default = cloakfall`)
// - this is the bundle's own entry point, and js-build-tools' browserify `standalone` option exposes this
// module's exports AS the global a bare <script> tag gets (see js-build-tools' bundle.mjs) - with a default
// export instead, that global ends up `{ default: cloakfall }`, not the callable `cloakfall` itself, which
// silently broke index.html's own `battleship()` call, as it was then named (confirmed via a real browser: "battleship is not a
// function", a dark screen with no menu at all). The explicit window/this assignment right below already set
// the global correctly on its own - the bug was browserify's own standalone wrapper running after it and
// overwriting it with the wrong shape, not anything wrong with that assignment itself.
export = cloakfall

// The game was called Battleship until 2026-11 (renamed for the trademark): `battleship()` stays as an alias, so a page
// still calling the old name keeps working
if (this) {
  // @ts-ignore
  this.cloakfall = cloakfall
  // @ts-ignore
  this.battleship = cloakfall
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.cloakfall = cloakfall
  // @ts-ignore
  window.battleship = cloakfall
}
