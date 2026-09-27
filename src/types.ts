import 'core-js/stable'
import jsonDom from 'json-dom'
import type { DomItem, WithTraits } from 'json-dom/dist/domItem/types'
import type { Matrix, MatrixColumn } from 'matrix-dom/dist/grid/types'

/**
 * The traits of a game: a tile (a matrix-dom column which also has a ship and a hit state) and a player. They are
 * added to json-dom's TraitRegistry, so `hasTrait(item, 'battleship.player')` narrows an item to a Player.
 */
declare module 'json-dom/dist/domItem/types' {
  interface TraitRegistry {
    /** The tile has a ship on it, and whether it has been hit. */
    'battleship.tile': { hasShip: boolean, isHit: boolean }
    /** The item is a player: their board, fleet and stats. */
    'battleship.player': {
      name: string
      isRobot: boolean
      status: number
      turnCnt: number
      attacker: boolean
      attacks: Attacks
      board: Board
      shipFleet: Ship[]
      playerStats: DomItem
    }
  }
}

/**
 * The typed version of json-dom's hasTrait, it narrows an item to the trait it was checked for.
 */
export const hasTrait: typeof jsonDom.hasTrait = jsonDom.hasTrait

jsonDom.defineTrait('battleship.tile', { keys: ['hasShip', 'isHit'] })
jsonDom.defineTrait('battleship.player', { keys: ['name', 'isRobot', 'status', 'turnCnt', 'attacker', 'attacks', 'board', 'shipFleet', 'playerStats'] })

/** A cell of a player's board: a matrix-dom column which also carries whether it has a ship and has been hit. */
export type Tile = MatrixColumn & WithTraits<'battleship.tile'>

/** A player's board: a matrix-dom matrix of Tiles. */
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
export type Player = DomItem & WithTraits<'battleship.player'>
