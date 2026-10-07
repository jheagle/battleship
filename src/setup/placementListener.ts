import { chooseOrder, continueTurn, finishTurn, randomOrder, randomise } from './placement'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * The placement buttons: Continue (after the handoff), Randomise, and Done. They are told apart by class name.
 * @param e
 * @param target
 */
const placementListener = (e: Event, target: DomItem): void => {
  const className = (e.target as HTMLElement).className
  if (className.includes('placement-continue')) {
    continueTurn(target)
  } else if (className.includes('placement-randomise')) {
    randomise(target)
  } else if (className.includes('placement-done')) {
    finishTurn(target)
  } else if (className.includes('begin-random')) {
    randomOrder(target)
  } else if (className.includes('begin-order')) {
    chooseOrder(target)
  }
}

export default placementListener
