# battleship

This is just a fun project creating a game of battleship. Experimenting with functional programming and ES6 features.

A relatively recent version is running at https: //joshuaheagle.com/battleship/
## Members

<dl>
<dt><a href="#hasTrait">hasTrait</a></dt>
<dd><p>The typed version of json-dom&#39;s hasTrait, it narrows an item to the trait it was checked for.</p>
</dd>
<dt><a href="#DAMAGED_WEIGHT">DAMAGED_WEIGHT</a></dt>
<dd><p>Extra weight for placements which explain a ship that is already damaged, relative to a fresh ship.</p>
</dd>
<dt><a href="#ADJACENT_WEIGHT">ADJACENT_WEIGHT</a></dt>
<dd><p>Extra weight for an unattacked cell next to a hit on a ship which is not yet sunk, the partial-hit follow-up.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#queueTimeout">queueTimeout</a></dt>
<dd><p>The one timed queue the whole game runs on: steps queued here run one after another, after their delay.</p>
</dd>
<dt><a href="#defaultFleet">defaultFleet</a></dt>
<dd><p>Create a default fleet using the standard battleship lengths.</p>
</dd>
<dt><a href="#setViewShip">setViewShip</a></dt>
<dd><p>Set a visible ship part at the given coordinates (shown with a grey background).</p>
</dd>
<dt><a href="#setHit">setHit</a></dt>
<dd><p>Mark the cell at the given coordinates as hit.</p>
</dd>
<dt><a href="#setHiddenShip">setHiddenShip</a></dt>
<dd><p>Set a hidden ship part at the given coordinates (not shown, the default cell styling still applies).</p>
</dd>
<dt><a href="#attackLock">attackLock</a></dt>
<dd><p>Whether attacks are being ignored right now: the board is locked while the turn changes over. Shared by the code which
starts and ends a turn and the code which takes an attack.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#numDamagedParts">numDamagedParts(total, status)</a></dt>
<dd><p>Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.</p>
</dd>
<dt><a href="#getLowStatusItems">getLowStatusItems(items)</a></dt>
<dd><p>Given an array of items, return all items which have the lowest status property</p>
</dd>
<dt><a href="#getBrokenShipsPlayers">getBrokenShipsPlayers(players)</a></dt>
<dd><p>Return all of the players which have broken ships.</p>
</dd>
<dt><a href="#getBrokenItems">getBrokenItems(items)</a></dt>
<dd><p>Given an array of items, return all of the items which have a status less than 100, but more than 0</p>
</dd>
<dt><a href="#getAllNonHitCells">getAllNonHitCells(matrix)</a></dt>
<dd><p>Get all points which were not yet hit in the matrix.</p>
</dd>
<dt><a href="#getAdjEdgeNonHitCells">getAdjEdgeNonHitCells(pnt, matrix)</a></dt>
<dd><p>Get the points which have same edges with the provided point and are not hit.</p>
</dd>
<dt><a href="#getALowStatusItem">getALowStatusItem(items)</a></dt>
<dd><p>Given an array of items, return the item with the lowest status property (at the end of the array)</p>
</dd>
<dt><a href="#filterAdjacentPoints">filterAdjacentPoints(pnt)</a></dt>
<dd><p>Used to generate &#39;checkerboard&#39; style attack by only attacking every non-edge-touching cell</p>
</dd>
<dt><a href="#checkIfShipCell">checkIfShipCell(pnt, matrix)</a></dt>
<dd><p>Return the hasShip tile boolean at the specified point.</p>
</dd>
<dt><a href="#checkIfHitCell">checkIfHitCell(pnt, matrix)</a></dt>
<dd><p>Return the isHit tile boolean at the specified point.</p>
</dd>
<dt><a href="#startMenu">startMenu(parent)</a></dt>
<dd><p>The entry function</p>
</dd>
<dt><a href="#selectShipDirection">selectShipDirection()</a></dt>
<dd><p>Pick a random axis-aligned direction for a ship: only x or y (z is always 0, ships do not go diagonal or vertical).</p>
</dd>
<dt><a href="#restart">restart(e, button)</a></dt>
<dd></dd>
<dt><a href="#generateStartEnd">generateStartEnd(matrix, shipLength)</a></dt>
<dd><p>Get a qualifying start and direction point for a ship of specified length
WARNING: This is a recursive function.</p>
</dd>
<dt><a href="#generateRandomFleet">generateRandomFleet(ships, matrix, view)</a></dt>
<dd><p>Create a series of randomly placed ships based on the provided shipLengths.
The optional parameter view will set the visibility of the ships.</p>
</dd>
<dt><a href="#buildShip">buildShip(shipInfo, line, matrix, view)</a></dt>
<dd><p>Generate a ship with the provided line of points.
The visibility of the ship on the board is determined by the view parameter.</p>
</dd>
<dt><a href="#buildPlayers">buildPlayers(humans, robots, players)</a></dt>
<dd><p>Create players and associated properties.
Takes an integer for the number of players to generate.
Returns an array of players.
WARNING: This is a recursive function.</p>
</dd>
<dt><a href="#beginRound">beginRound(e, mainForm)</a></dt>
<dd><p>Logic for setting up and starting a new round
(selects random start player and calls computer attack if it is AI starting)</p>
</dd>
<dt><a href="#targetBrokenShips">targetBrokenShips(victim)</a></dt>
<dd><p>If there are existing broken ships, return the point(s) to target next: the cells adjacent to the hit parts, or,
once a ship is damaged in more than one place, a single decisive point (the gap between two hits, or the point
just past one end of a run of hits). Returns an empty array when there is nothing broken to follow up on.</p>
</dd>
<dt><a href="#selectTargetPlayer">selectTargetPlayer(players)</a></dt>
<dd><p>Choose which player to attack.</p>
</dd>
<dt><a href="#selectTargetCoordinate">selectTargetCoordinate(victim)</a></dt>
<dd><p>Choose which coordinate to attack, in layers: the density model first, then the follow-up on broken ships, then the
checkerboard over every unattacked cell. The highest-rated density cells are what gets displayed, so the choice can
be seen before the checkerboard tie-break narrows it.</p>
</dd>
<dt><a href="#resetTargets">resetTargets(data)</a></dt>
<dd></dd>
<dt><a href="#displayTargets">displayTargets(targets, target, victim)</a></dt>
<dd></dd>
<dt><a href="#buildShotState">buildShotState(victim)</a></dt>
<dd><p>Build what the robot is allowed to know about a victim: which cells were attacked, which of those were hits (the
hit parts of each ship, not the position of any part still unhit), and how many parts each unsunk ship has.
Hit or miss is read from the ship parts&#39; isHit flags, never from a tile&#39;s hasShip.</p>
</dd>
<dt><a href="#refineTies">refineTies(cells)</a></dt>
<dd><p>Among cells tied at the top score, prefer the checkerboard pattern used to find ships quickly. The partial-hit
follow-up is not handled here: it is extra weight inside scoreTargets, so it is already part of the score.</p>
</dd>
<dt><a href="#densityChoices">densityChoices(victim)</a></dt>
<dd><p>The cells the density model rates highest, and the subset the robot chooses from (the checkerboard among them).
<code>top</code> is for display only, so the score can be seen before the tie-break. <code>targets</code> is never empty while a ship remains.</p>
</dd>
<dt><a href="#densityTargets">densityTargets(victim)</a></dt>
<dd><p>The attack points the density model considers most likely to hold a ship part, or an empty array when there is none.</p>
</dd>
<dt><a href="#scoreTargets">scoreTargets(state, damagedWeight, adjacentWeight)</a></dt>
<dd><p>Score every cell by how many ways the remaining ships could still cover it. Each ship contributes every placement
consistent with what is known: it avoids misses, covers all of its own known hits, and touches no other ship&#39;s hit.
Cells already attacked score zero. Unattacked cells next to a hit on an unsunk ship then get the adjacent weight on top.</p>
</dd>
<dt><a href="#bestTargets">bestTargets(scores)</a></dt>
<dd><p>The unattacked cells which have the highest score. Empty when no score is above zero.</p>
</dd>
<dt><a href="#computerAttack">computerAttack(player, players)</a></dt>
<dd><p>Main AI logic for computer to attack, selects a target then performs attack function.</p>
</dd>
<dt><a href="#waterTile">waterTile()</a></dt>
<dd><p>Set the style for tiles representing water: a default (unhit, shipless) tile with an empty point, ready to be given
its real point when the board is built.</p>
</dd>
<dt><a href="#shipTile">shipTile()</a></dt>
<dd><p>Set status and custom properties for tiles that have a ship</p>
</dd>
<dt><a href="#ship">ship(name)</a></dt>
<dd><p>Store properties of a ship which includes an array of all associated ship tiles.</p>
</dd>
<dt><a href="#playerStats">playerStats(player, status)</a></dt>
<dd><p>The defined attributes for each player</p>
</dd>
<dt><a href="#playerSet">playerSet(board, name)</a></dt>
<dd><p>Store the player attributes. board and shipFleet start as placeholders (an empty object, an empty array); they are
given their real values once the board is built (see buildPlayers).</p>
</dd>
<dt><a href="#hitTile">hitTile()</a></dt>
<dd><p>Set the status of the tile to hit.</p>
</dd>
<dt><a href="#gameTile">gameTile()</a></dt>
<dd><p>Default properties for a tile in the battleship game.</p>
</dd>
<dt><a href="#mainMenu">mainMenu()</a></dt>
<dd><p>This will be the main menu for the game.</p>
</dd>
<dt><a href="#finalScore">finalScore(players)</a></dt>
<dd><p>Display the final scores after a game has ended and have a button to restart.</p>
</dd>
<dt><a href="#boards">boards(players)</a></dt>
<dd><p>Wrapper div for player data / boards</p>
</dd>
<dt><a href="#update3dCell">update3dCell(config, matrix, x, y, z, isRobot)</a></dt>
<dd><p>Given a cell and new config data, update the data of the cell</p>
</dd>
<dt><a href="#setShip">setShip(matrix, point, view)</a></dt>
<dd><p>Set a specified point to be part of a ship</p>
</dd>
<dt><a href="#configureHtml">configureHtml(config, isRobot)</a></dt>
<dd><p>Update view based on actions performed</p>
</dd>
<dt><a href="#colourHitCell">colourHitCell(config)</a></dt>
<dd><p>Colour a cell once it has been hit: red for a ship, white for water. Cells only have a style object once something
has resized or highlighted them, so it is created here when it is missing.</p>
</dd>
<dt><a href="#updateScore">updateScore(hitShip, sunkShip, players)</a></dt>
<dd><p>Update all game stats after each player round</p>
</dd>
<dt><a href="#updatePlayerStats">updatePlayerStats(player, status)</a></dt>
<dd></dd>
<dt><a href="#updatePlayer">updatePlayer(player, hitShip, sunkShip)</a></dt>
<dd><p>Track player stats such as attacks and turns</p>
</dd>
<dt><a href="#getNextAttacker">getNextAttacker(attacker, players, hitShip)</a></dt>
<dd><p>Based on the current attacker and list of players, return the next attacker.</p>
</dd>
<dt><a href="#findNextAttacker">findNextAttacker(attacker, players, attackerIndex)</a></dt>
<dd></dd>
<dt><a href="#endGame">endGame(winner)</a></dt>
<dd><p>Final state once a game is won (only one player remains)</p>
</dd>
<dt><a href="#attackListener">attackListener(e, target)</a></dt>
<dd><p>target is the board the listener was attached to (see buildPlayers): a DomItem here, like every listener&#39;s target,
but really always a Board.</p>
</dd>
<dt><a href="#attackFleet">attackFleet(target)</a></dt>
<dd><p>Perform attack on an enemy board / cell</p>
</dd>
</dl>

<a name="hasTrait"></a>

## hasTrait
The typed version of json-dom's hasTrait, it narrows an item to the trait it was checked for.

**Kind**: global variable  
<a name="DAMAGED_WEIGHT"></a>

## DAMAGED\_WEIGHT
Extra weight for placements which explain a ship that is already damaged, relative to a fresh ship.

**Kind**: global variable  
<a name="ADJACENT_WEIGHT"></a>

## ADJACENT\_WEIGHT
Extra weight for an unattacked cell next to a hit on a ship which is not yet sunk, the partial-hit follow-up.

**Kind**: global variable  
<a name="queueTimeout"></a>

## queueTimeout
The one timed queue the whole game runs on: steps queued here run one after another, after their delay.

**Kind**: global constant  
<a name="defaultFleet"></a>

## defaultFleet
Create a default fleet using the standard battleship lengths.

**Kind**: global constant  

| Param |
| --- |
| matrix | 
| view | 

<a name="setViewShip"></a>

## setViewShip
Set a visible ship part at the given coordinates (shown with a grey background).

**Kind**: global constant  
<a name="setHit"></a>

## setHit
Mark the cell at the given coordinates as hit.

**Kind**: global constant  
<a name="setHiddenShip"></a>

## setHiddenShip
Set a hidden ship part at the given coordinates (not shown, the default cell styling still applies).

**Kind**: global constant  
<a name="attackLock"></a>

## attackLock
Whether attacks are being ignored right now: the board is locked while the turn changes over. Shared by the code which
starts and ends a turn and the code which takes an attack.

**Kind**: global constant  
<a name="numDamagedParts"></a>

## numDamagedParts(total, status)
Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.

**Kind**: global function  

| Param |
| --- |
| total | 
| status | 

<a name="getLowStatusItems"></a>

## getLowStatusItems(items)
Given an array of items, return all items which have the lowest status property

**Kind**: global function  

| Param |
| --- |
| items | 

<a name="getBrokenShipsPlayers"></a>

## getBrokenShipsPlayers(players)
Return all of the players which have broken ships.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="getBrokenItems"></a>

## getBrokenItems(items)
Given an array of items, return all of the items which have a status less than 100, but more than 0

**Kind**: global function  

| Param |
| --- |
| items | 

<a name="getAllNonHitCells"></a>

## getAllNonHitCells(matrix)
Get all points which were not yet hit in the matrix.

**Kind**: global function  

| Param |
| --- |
| matrix | 

<a name="getAdjEdgeNonHitCells"></a>

## getAdjEdgeNonHitCells(pnt, matrix)
Get the points which have same edges with the provided point and are not hit.

**Kind**: global function  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="getALowStatusItem"></a>

## getALowStatusItem(items)
Given an array of items, return the item with the lowest status property (at the end of the array)

**Kind**: global function  

| Param |
| --- |
| items | 

<a name="filterAdjacentPoints"></a>

## filterAdjacentPoints(pnt)
Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell

**Kind**: global function  

| Param |
| --- |
| pnt | 

<a name="checkIfShipCell"></a>

## checkIfShipCell(pnt, matrix)
Return the hasShip tile boolean at the specified point.

**Kind**: global function  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="checkIfHitCell"></a>

## checkIfHitCell(pnt, matrix)
Return the isHit tile boolean at the specified point.

**Kind**: global function  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="startMenu"></a>

## startMenu(parent)
The entry function

**Kind**: global function  

| Param |
| --- |
| parent | 

<a name="selectShipDirection"></a>

## selectShipDirection()
Pick a random axis-aligned direction for a ship: only x or y (z is always 0, ships do not go diagonal or vertical).

**Kind**: global function  
<a name="restart"></a>

## restart(e, button)
**Kind**: global function  

| Param |
| --- |
| e | 
| button | 

<a name="generateStartEnd"></a>

## generateStartEnd(matrix, shipLength)
Get a qualifying start and direction point for a ship of specified length
WARNING: This is a recursive function.

**Kind**: global function  

| Param |
| --- |
| matrix | 
| shipLength | 

<a name="generateRandomFleet"></a>

## generateRandomFleet(ships, matrix, view)
Create a series of randomly placed ships based on the provided shipLengths.
The optional parameter view will set the visibility of the ships.

**Kind**: global function  

| Param | Default |
| --- | --- |
| ships |  | 
| matrix |  | 
| view | <code>false</code> | 

<a name="buildShip"></a>

## buildShip(shipInfo, line, matrix, view)
Generate a ship with the provided line of points.
The visibility of the ship on the board is determined by the view parameter.

**Kind**: global function  

| Param | Default |
| --- | --- |
| shipInfo |  | 
| line |  | 
| matrix |  | 
| view | <code>false</code> | 

<a name="buildPlayers"></a>

## buildPlayers(humans, robots, players)
Create players and associated properties.
Takes an integer for the number of players to generate.
Returns an array of players.
WARNING: This is a recursive function.

**Kind**: global function  

| Param | Default |
| --- | --- |
| humans |  | 
| robots | <code>0</code> | 
| players |  | 

<a name="beginRound"></a>

## beginRound(e, mainForm)
Logic for setting up and starting a new round
(selects random start player and calls computer attack if it is AI starting)

**Kind**: global function  

| Param |
| --- |
| e | 
| mainForm | 

<a name="targetBrokenShips"></a>

## targetBrokenShips(victim)
If there are existing broken ships, return the point(s) to target next: the cells adjacent to the hit parts, or,
once a ship is damaged in more than one place, a single decisive point (the gap between two hits, or the point
just past one end of a run of hits). Returns an empty array when there is nothing broken to follow up on.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="selectTargetPlayer"></a>

## selectTargetPlayer(players)
Choose which player to attack.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="selectTargetCoordinate"></a>

## selectTargetCoordinate(victim)
Choose which coordinate to attack, in layers: the density model first, then the follow-up on broken ships, then the
checkerboard over every unattacked cell. The highest-rated density cells are what gets displayed, so the choice can
be seen before the checkerboard tie-break narrows it.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="resetTargets"></a>

## resetTargets(data)
**Kind**: global function  

| Param |
| --- |
| data | 

<a name="displayTargets"></a>

## displayTargets(targets, target, victim)
**Kind**: global function  

| Param |
| --- |
| targets | 
| target | 
| victim | 

<a name="buildShotState"></a>

## buildShotState(victim)
Build what the robot is allowed to know about a victim: which cells were attacked, which of those were hits (the
hit parts of each ship, not the position of any part still unhit), and how many parts each unsunk ship has.
Hit or miss is read from the ship parts' isHit flags, never from a tile's hasShip.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="refineTies"></a>

## refineTies(cells)
Among cells tied at the top score, prefer the checkerboard pattern used to find ships quickly. The partial-hit
follow-up is not handled here: it is extra weight inside scoreTargets, so it is already part of the score.

**Kind**: global function  

| Param |
| --- |
| cells | 

<a name="densityChoices"></a>

## densityChoices(victim)
The cells the density model rates highest, and the subset the robot chooses from (the checkerboard among them).
`top` is for display only, so the score can be seen before the tie-break. `targets` is never empty while a ship remains.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="densityTargets"></a>

## densityTargets(victim)
The attack points the density model considers most likely to hold a ship part, or an empty array when there is none.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="scoreTargets"></a>

## scoreTargets(state, damagedWeight, adjacentWeight)
Score every cell by how many ways the remaining ships could still cover it. Each ship contributes every placement
consistent with what is known: it avoids misses, covers all of its own known hits, and touches no other ship's hit.
Cells already attacked score zero. Unattacked cells next to a hit on an unsunk ship then get the adjacent weight on top.

**Kind**: global function  

| Param |
| --- |
| state | 
| damagedWeight | 
| adjacentWeight | 

<a name="bestTargets"></a>

## bestTargets(scores)
The unattacked cells which have the highest score. Empty when no score is above zero.

**Kind**: global function  

| Param |
| --- |
| scores | 

<a name="computerAttack"></a>

## computerAttack(player, players)
Main AI logic for computer to attack, selects a target then performs attack function.

**Kind**: global function  

| Param |
| --- |
| player | 
| players | 

<a name="waterTile"></a>

## waterTile()
Set the style for tiles representing water: a default (unhit, shipless) tile with an empty point, ready to be given
its real point when the board is built.

**Kind**: global function  
<a name="shipTile"></a>

## shipTile()
Set status and custom properties for tiles that have a ship

**Kind**: global function  
<a name="ship"></a>

## ship(name)
Store properties of a ship which includes an array of all associated ship tiles.

**Kind**: global function  

| Param |
| --- |
| name | 

<a name="playerStats"></a>

## playerStats(player, status)
The defined attributes for each player

**Kind**: global function  

| Param |
| --- |
| player | 
| status | 

<a name="playerSet"></a>

## playerSet(board, name)
Store the player attributes. board and shipFleet start as placeholders (an empty object, an empty array); they are
given their real values once the board is built (see buildPlayers).

**Kind**: global function  

| Param |
| --- |
| board | 
| name | 

<a name="hitTile"></a>

## hitTile()
Set the status of the tile to hit.

**Kind**: global function  
<a name="gameTile"></a>

## gameTile()
Default properties for a tile in the battleship game.

**Kind**: global function  
<a name="mainMenu"></a>

## mainMenu()
This will be the main menu for the game.

**Kind**: global function  
<a name="finalScore"></a>

## finalScore(players)
Display the final scores after a game has ended and have a button to restart.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="boards"></a>

## boards(players)
Wrapper div for player data / boards

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="update3dCell"></a>

## update3dCell(config, matrix, x, y, z, isRobot)
Given a cell and new config data, update the data of the cell

**Kind**: global function  

| Param | Default |
| --- | --- |
| config |  | 
| matrix |  | 
| x |  | 
| y |  | 
| z |  | 
| isRobot | <code>false</code> | 

<a name="setShip"></a>

## setShip(matrix, point, view)
Set a specified point to be part of a ship

**Kind**: global function  

| Param |
| --- |
| matrix | 
| point | 
| view | 

<a name="configureHtml"></a>

## configureHtml(config, isRobot)
Update view based on actions performed

**Kind**: global function  

| Param |
| --- |
| config | 
| isRobot | 

<a name="colourHitCell"></a>

## colourHitCell(config)
Colour a cell once it has been hit: red for a ship, white for water. Cells only have a style object once something
has resized or highlighted them, so it is created here when it is missing.

**Kind**: global function  

| Param |
| --- |
| config | 

<a name="updateScore"></a>

## updateScore(hitShip, sunkShip, players)
Update all game stats after each player round

**Kind**: global function  

| Param |
| --- |
| hitShip | 
| sunkShip | 
| players | 

<a name="updatePlayerStats"></a>

## updatePlayerStats(player, status)
**Kind**: global function  

| Param |
| --- |
| player | 
| status | 

<a name="updatePlayer"></a>

## updatePlayer(player, hitShip, sunkShip)
Track player stats such as attacks and turns

**Kind**: global function  

| Param | Default |
| --- | --- |
| player |  | 
| hitShip |  | 
| sunkShip | <code>0</code> | 

<a name="getNextAttacker"></a>

## getNextAttacker(attacker, players, hitShip)
Based on the current attacker and list of players, return the next attacker.

**Kind**: global function  

| Param |
| --- |
| attacker | 
| players | 
| hitShip | 

<a name="findNextAttacker"></a>

## findNextAttacker(attacker, players, attackerIndex)
**Kind**: global function  

| Param |
| --- |
| attacker | 
| players | 
| attackerIndex | 

<a name="endGame"></a>

## endGame(winner)
Final state once a game is won (only one player remains)

**Kind**: global function  

| Param |
| --- |
| winner | 

<a name="attackListener"></a>

## attackListener(e, target)
target is the board the listener was attached to (see buildPlayers): a DomItem here, like every listener's target,
but really always a Board.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="attackFleet"></a>

## attackFleet(target)
Perform attack on an enemy board / cell

**Kind**: global function  

| Param |
| --- |
| target | 

