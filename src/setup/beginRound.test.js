/**
 * @jest-environment jsdom
 */

import jsonDom from 'json-dom'
import { useGameLifecycle, startGame, getPlayers, attacker } from '../../tests/helpers/game'
import beginRound from './beginRound'
import startMenu from './startMenu'

useGameLifecycle()

describe('setup: choosing the players', () => {
  test.each([
    // humans, robots -> [humans expected, robots expected]
    [2, 0, 2, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 1], // a lone human always gets a robot to play
    [0, 0, 0, 2], // nobody chosen means two robots play each other
    [0, 1, 0, 2],
    [0, 3, 0, 3],
    [3, 2, 3, 2]
  ])('%i humans and %i robots start a game of %i humans and %i robots', (humans, robots, expectedHumans, expectedRobots) => {
    const { players } = startGame({ humans, robots })
    expect(players).toHaveLength(expectedHumans + expectedRobots)
    expect(players.filter(player => !player.isRobot)).toHaveLength(expectedHumans)
    expect(players.filter(player => player.isRobot)).toHaveLength(expectedRobots)
    expect(players.map(player => player.name)).toEqual(players.map((player, i) => `Player ${i + 1}`))
    // Humans always come first
    expect(players.map(player => player.isRobot)).toEqual([...Array(expectedHumans).fill(false), ...Array(expectedRobots).fill(true)])
  })

  test.each([[101, 0], [0, 101], [-1, 2], [2, -1]])('%i humans and %i robots is refused and leaves the menu showing', (humans, robots) => {
    const { doc, players } = startGame({ humans, robots })
    expect(players).toHaveLength(0)
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('starting the game removes the menu', () => {
    const { doc } = startGame({ humans: 2 })
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(0)
    expect(getPlayers(doc)).toHaveLength(2)
  })
})

describe('setup: who goes first', () => {
  test('with "first player starts" ticked, player 1 attacks first, every time', () => {
    for (let i = 0; i < 10; i++) {
      const { players } = startGame({ humans: 3, firstGoesFirst: true })
      expect(players.map(player => player.attacker)).toEqual([true, false, false])
      expect(players[0].turnCnt).toBe(1)
    }
  })

  test('otherwise exactly one player attacks first, and every player has a chance', () => {
    const firsts = new Set()
    for (let i = 0; i < 60; i++) {
      const { players } = startGame({ humans: 3, firstGoesFirst: false })
      expect(players.filter(player => player.attacker)).toHaveLength(1)
      firsts.add(attacker(players).name)
    }
    expect(firsts.size).toBe(3)
  })
})

describe('setup: beginRound', () => {
  test('ignores a submit which is not aimed at the form itself (an event which only bubbled through)', () => {
    const doc = startMenu(jsonDom.documentDomItem({ beginRound }))
    const form = jsonDom.getChildrenByClass('main-menu-form', doc.body)[0]
    const preventDefault = jest.fn()
    expect(beginRound({ eventPhase: 3, type: 'submit', preventDefault }, form)).toBe(false)
    expect(beginRound({ eventPhase: 1, type: 'submit', preventDefault }, form)).toBe(false)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
    expect(getPlayers(doc)).toHaveLength(0)
  })
})
