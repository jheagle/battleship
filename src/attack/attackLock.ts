import { getSession } from '../setup/gameSession'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * Whether attacks are being ignored right now for the given item's game: the board is locked while the turn changes
 * over. Shared by the code which starts and ends a turn and the code which takes an attack. Each game has its own
 * lock (see gameSession), so one game's turn change never blocks another's.
 * @param item
 */
const getAttackLock = (item: DomItem): { isLocked: boolean } => getSession(item).attackLock

export default getAttackLock
