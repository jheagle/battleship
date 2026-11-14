/**
 * @jest-environment jsdom
 */
import { lobbyUrl, LOBBY_PORT } from './lobbySocket'

describe('lobbyUrl', () => {
  test('the lobby is on port 3002 of the host the page came from, so another device on the network reaches it', () => {
    expect(lobbyUrl({ protocol: 'http:', hostname: '192.168.1.20' })).toBe('http://192.168.1.20:3002')
    expect(lobbyUrl({ protocol: 'http:', hostname: 'cloakfall.local' })).toBe('http://cloakfall.local:3002')
    expect(lobbyUrl({ protocol: 'https:', hostname: 'example.test' })).toBe('https://example.test:3002')
  })

  test('outside a web page (a file, no location), it is localhost', () => {
    expect(lobbyUrl({ protocol: 'file:', hostname: '' })).toBe('http://localhost:3002')
    expect(lobbyUrl(null)).toBe('http://localhost:3002')
  })

  test("by default it reads the page's own location", () => {
    expect(lobbyUrl()).toBe(`${window.location.protocol}//${window.location.hostname}:${LOBBY_PORT}`)
  })
})
