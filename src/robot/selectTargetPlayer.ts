import { eliminationRule } from './victimRules'
import type { VictimRule } from './victimRules'
import type { Player } from '../types'

/**
 * Choose which player to attack, using the rule for the game style (elimination for now).
 * @param players
 * @param rule
 */
const selectTargetPlayer = (players: Player[], rule: VictimRule = eliminationRule): Player => rule(players)

export default selectTargetPlayer
