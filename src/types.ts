import treeloom from 'treeloom'
import type { DomItem, WithTraits } from 'treeloom/dist/domItem/types'
import type hasTraitType from 'treeloom/dist/domItem/traits/hasTrait'
import type { Matrix, MatrixColumn } from 'treeloom-matrix/dist/grid/types'

/**
 * The traits of a game: a tile (a treeloom-matrix column which also has a ship and a hit state) and a player. They are
 * added to treeloom's TraitRegistry, so `hasTrait(item, 'cloakfall.player')` narrows an item to a Player.
 */
declare module 'treeloom/dist/domItem/types' {
  interface TraitRegistry {
    /** The tile has a ship on it, and whether it has been hit. */
    'cloakfall.tile': { hasShip: boolean, isHit: boolean }
    /** The item is a player: their board, fleet and stats. */
    'cloakfall.player': {
      name: string
      isRobot: boolean
      /** The colour this player is identified by on the boards. */
      colour: string
      status: number
      turnCnt: number
      attacker: boolean
      /** The human has switched on the heat-map hint for their own turn. */
      showHint: boolean
      /** The player has chosen to see their own ships during play (one-player game). */
      showShips: boolean
      attacks: Attacks
      board: Board
      shipFleet: Ship[]
      playerStats: DomItem
    }
  }
}

/**
 * The typed version of treeloom's hasTrait, it narrows an item to the trait it was checked for.
 */
export const hasTrait: typeof hasTraitType = treeloom.hasTrait

treeloom.defineTrait('cloakfall.tile', { keys: ['hasShip', 'isHit'] })
treeloom.defineTrait('cloakfall.player', { keys: ['name', 'isRobot', 'status', 'turnCnt', 'attacker', 'showHint', 'attacks', 'board', 'shipFleet', 'playerStats'] })

/** A cell of a player's board: a treeloom-matrix column which also carries whether it has a ship and has been hit. */
export type Tile = MatrixColumn & WithTraits<'cloakfall.tile'>

/** A player's board: a treeloom-matrix matrix of Tiles. */
export type Board = Matrix

/** How many of a player's attacks hit, missed, or sunk a ship. */
export interface Attacks {
  hit: number
  miss: number
  sunk: number
}

/** A ship: its name, health (0-100), and the tiles which make it up. */
export interface Ship {
  name: string
  /** A percentage (0-100) of parts which have not been hit. */
  status: number
  parts: Tile[]
}

/** A player: their board, fleet, stats panel and turn state, rendered as an item in the tree. */
export type Player = DomItem & WithTraits<'cloakfall.player'>

/** The name and length of a ship, before it has been placed on a board. */
export interface ShipSpec {
  name: string
  size: number
}
