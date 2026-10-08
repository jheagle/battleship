import jsonDom from 'json-dom'
import { beginOrderSet, chooseOrderRandom, randomiseRemoteShips, readyRemotePlayer } from './remotePlacement'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * The remote placement/ordering panels' own buttons - each player's Randomise/Ready, and the host-only Random/
 * Set order. Told apart by class name, same pattern as local placement's own placementListener.
 * @param e
 * @param target
 */
const remotePlacementListener = (e: Event, target: DomItem): void => {
  const className = (e.target as HTMLElement).className
  if (className.includes('remote-placement-randomise')) {
    randomiseRemoteShips(jsonDom.getParentsByClass('player', target)[0] as Player)
    return
  }
  if (className.includes('remote-placement-ready')) {
    readyRemotePlayer(jsonDom.getParentsByClass('player', target)[0] as Player)
    return
  }
  if (className.includes('remote-order-random')) {
    chooseOrderRandom(target)
    return
  }
  if (className.includes('remote-order-set')) {
    beginOrderSet(target)
  }
}

export default remotePlacementListener
