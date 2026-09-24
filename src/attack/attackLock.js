/**
 * Whether attacks are being ignored right now: the board is locked while the turn changes over. Shared by the code which
 * starts and ends a turn and the code which takes an attack.
 */
const attackLock = { isLocked: false }

export default attackLock
