import { hasTrait } from '../src/types'
import type { Board, Player, Ship, Tile } from '../src/types'
import type { CoreItem } from 'json-dom/dist/domItem/types'
import type { Matrix } from 'matrix-dom/dist/grid/types'

// A tile is both a matrix column and carries the battleship trait
const tile = {} as Tile
const hasShip: boolean = tile.hasShip
const isHit: boolean = tile.isHit
const axis: 'x' = tile.axis

// hasTrait narrows a generic item to Player / a Tile
const item = {} as CoreItem
let narrowedBoard: Board | null = null
let narrowedFleet: Ship[] | null = null
if (hasTrait(item, 'battleship.player')) {
  narrowedBoard = item.board
  narrowedFleet = item.shipFleet
}
let narrowedHasShip: boolean | null = null
if (hasTrait(item, 'battleship.tile')) {
  narrowedHasShip = item.hasShip
}

// a Board is a Matrix, and a Player's board is a Board
const player = {} as Player
const board: Matrix = player.board
const stats = player.playerStats

// @ts-expect-error - status is a number, not a string
const wrongStatus: Ship = { name: 'Destroyer', status: '100', parts: [] }
// @ts-expect-error - a tile needs hasShip and isHit
const notATile: Tile = { point: { x: 0, y: 0, z: 0 } }
// @ts-expect-error - there is no such trait
hasTrait(item, 'battleship.submarine')

export { hasShip, isHit, axis, narrowedBoard, narrowedFleet, narrowedHasShip, board, stats }
