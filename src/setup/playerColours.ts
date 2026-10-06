/**
 * The colour each player is identified by, in the order they are created. They are bright enough to read on the dark
 * background, and distinct from one another.
 */
export const playerColours: string[] = ['#ff6b6b', '#51cf66', '#4dabf7', '#ffa94d']

/**
 * The colour for the player at this position in the game.
 * @param index
 */
const playerColour = (index: number): string => playerColours[index % playerColours.length]

export default playerColour
