/**
 * Cloakfall's look in one place: the colours a board cell can show. Every fleet is cloaked in a dark sector of
 * space; a shot that finds nothing is a dim scatter of empty space, a hit is a bright flare, and a player's own
 * visible ships are silver.
 *
 * Colour is never the only signal: a shot cell also gets data-shot (hit / miss), which the CSS marks with a shape
 * (a cross for a hit, a dot for a miss), since a hit and a shown ship differ mostly by hue.
 *
 * These are the only states a player can see on a board, so the cell names a screen reader hears (labelTile) and the
 * remote redaction of hidden ships (redactBoard) both read them from here.
 */
export const colours = {
  /** A shot that hit a ship: a bright orange flare. */
  hit: '#ff8a3d',
  /** A shot into empty space: slate (3.9:1 against an unshot cell). */
  miss: '#6e7898',
  /** A player's own ship, when shown (placement, "Show my ships"). */
  ship: '#9aa4bd'
}

/** The game's name, as players see it. */
export const gameName = 'Cloakfall'
