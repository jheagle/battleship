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
import jsonDom from 'json-dom'
import { isNode } from 'browser-or-node'

const battleship = (): void => {
  // Create new private reference to the document
  const documentItem = startMenu(jsonDom.documentDomItem({
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
  }))

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

export default battleship

if (this) {
  // @ts-ignore
  this.battleship = battleship
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.battleship = battleship
}
