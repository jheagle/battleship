/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, click, getPlayers, playToTheEnd, startGame, unhitShipCells, unhitWaterCells, settle, twoHumans } from '../../tests/helpers/game'

useGameLifecycle()

describe('ending the game', () => {
  // Player 1 hits every ship cell of player 2; player 2 just misses.
  const winAsPlayerOne = async ({ players: [one, two] }) => {
    while (two.status > 0) {
      await click(unhitShipCells(two)[0])
      if (two.status > 0) {
        await click(unhitWaterCells(one)[0])
      }
    }
    await settle(2000)
  }

  test('sinking every ship ends the game and shows the final scores', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const [one, two] = game.players
    expect(two.status).toBe(0)
    expect(one.status).toBe(100)
    expect(document.querySelectorAll('.final-scores')).toHaveLength(1)
    expect(document.querySelectorAll('.score-card')).toHaveLength(2)
  })

  test('the winner is marked and the final cards have each player\'s numbers', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const [one, two] = game.players
    expect(one.playerStats.element.textContent).toContain('Player 1: WINNER')
    const cardText = [...document.querySelectorAll('.score-card')].map(card => card.textContent.replace(/\s+/g, ' '))
    expect(cardText[0]).toContain('Player 1')
    expect(cardText[0]).toContain(`Hit: ${one.attacks.hit} / Miss: ${one.attacks.miss}`)
    expect(cardText[0]).toContain(`Turns: ${one.turnCnt}`)
    expect(cardText[1]).toContain('Player 2')
    expect(cardText[1]).toContain('Status: 0%')
    expect(one.attacks).toMatchObject({ hit: 17, sunk: 5 })
    expect(two.attacks.hit).toBe(0)
  })

  test('once a player is out, their board can no longer be attacked', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const [, two] = game.players
    const cell = unhitWaterCells(two)[0]
    await click(cell)
    expect(cell.isHit).toBeFalsy()
  })

  test('the Main Menu button goes back to choosing a game type', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const restart = document.querySelector('.final-scores .new-game')
    expect(restart).not.toBeNull()
    restart.click()
    await settle()
    expect(document.querySelector('.main-menu')).not.toBeNull()
    expect(document.querySelector('.final-scores')).toBeNull()
    expect(document.querySelector('.boards')).toBeNull()
  })

  test('Play Again starts a new multiplayer game with the same settings: it still places ships', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    document.querySelector('.final-scores .play-again').click()
    await settle()
    expect(document.querySelector('.final-scores')).toBeNull()
    expect(document.querySelector('.main-menu')).toBeNull()
    // multiplayer still places ships, even with the same settings as last time
    expect(document.querySelector('.placement')).not.toBeNull()
    const newPlayers = getPlayers(game.doc)
    expect(newPlayers).toHaveLength(2)
    expect(newPlayers.every(player => player.status === 100)).toBe(true)
  })

  test('Change Settings shows the lobby pre-filled with the game just played, not a fresh preset', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    document.querySelector('.final-scores .return-to-lobby').click()
    expect(document.querySelector('.main-menu')).not.toBeNull()
    expect(document.querySelector('.presets').style.display).toBe('none')
    const lobby = document.querySelector('.main-menu-form')
    expect(lobby.style.display).not.toBe('none')
    expect(document.querySelector('.lobby-title').innerHTML).toBe('Lobby: 2-4 Multiplayer')
    expect(document.querySelector('input[name=human-players]').value).toBe('2')
  })
  test('Play Again starts a new robots-only game straight away: no placement needed', async () => {
    const game = startGame({ humans: 0, robots: 2 })
    await playToTheEnd()
    document.querySelector('.final-scores .play-again').click()
    await settle(2000)
    expect(document.querySelector('.final-scores')).toBeNull()
    expect(document.querySelector('.placement')).toBeNull()
    expect(document.querySelector('.boards')).not.toBeNull()
    expect(getPlayers(game.doc)).toHaveLength(2)
  }, 120000)

})
