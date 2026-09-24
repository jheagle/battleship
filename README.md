# battleship

This is just a fun project creating a game of battleship. Experimenting with functional programming and ES6 features.

A relatively recent version is running at https: //joshuaheagle.com/battleship/
## Constants

<dl>
<dt><a href="#queueTimeout">queueTimeout</a></dt>
<dd><p>The one timed queue the whole game runs on: steps queued here run one after another, after their delay.</p>
</dd>
<dt><a href="#defaultFleet">defaultFleet</a> ⇒ <code>Array</code></dt>
<dd><p>Create a default fleet using the standard battleship lengths.</p>
</dd>
<dt><a href="#setViewShip">setViewShip</a></dt>
<dd></dd>
<dt><a href="#setHit">setHit</a></dt>
<dd></dd>
<dt><a href="#setHiddenShip">setHiddenShip</a></dt>
<dd></dd>
<dt><a href="#attackLock">attackLock</a></dt>
<dd><p>Whether attacks are being ignored right now: the board is locked while the turn changes over. Shared by the code which
starts and ends a turn and the code which takes an attack.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#numDamagedParts">numDamagedParts(total, status)</a> ⇒ <code>number</code></dt>
<dd><p>Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.</p>
</dd>
<dt><a href="#getLowStatusItems">getLowStatusItems(items)</a> ⇒ <code>Array</code></dt>
<dd><p>Given an array of items, return all items which have the lowest status property</p>
</dd>
<dt><a href="#getBrokenShipsPlayers">getBrokenShipsPlayers(players)</a> ⇒ <code>Array</code></dt>
<dd><p>Return all of the players which have broken ships.</p>
</dd>
<dt><a href="#getBrokenItems">getBrokenItems(items)</a> ⇒ <code>Array</code></dt>
<dd><p>Given an array of items, return all of the items which have a status less than 100, but more than 0</p>
</dd>
<dt><a href="#getAllNonHitCells">getAllNonHitCells(matrix)</a> ⇒ <code>Array</code></dt>
<dd><p>Get all points which were not yet hit in the matrix.</p>
</dd>
<dt><a href="#getAdjEdgeNonHitCells">getAdjEdgeNonHitCells(pnt, matrix)</a> ⇒ <code>Array</code></dt>
<dd><p>Get the points which have same edges with the provided point and are not hit.</p>
</dd>
<dt><a href="#getALowStatusItem">getALowStatusItem(items)</a> ⇒ <code>Array</code></dt>
<dd><p>Given an array of items, return the item with the lowest status property (at the end of the array)</p>
</dd>
<dt><a href="#filterAdjacentPoints">filterAdjacentPoints(pnt)</a> ⇒ <code>boolean</code></dt>
<dd><p>Used to generate &#39;checkerboard&#39; style attack by only attacking every non-edge-touching cell</p>
</dd>
<dt><a href="#checkIfShipCell">checkIfShipCell(pnt, matrix)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return the hasShip tile boolean at the specified point.</p>
</dd>
<dt><a href="#checkIfHitCell">checkIfHitCell(pnt, matrix)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return the isHit tile boolean at the specified point.</p>
</dd>
<dt><a href="#startMenu">startMenu(parent)</a> ⇒ <code>module:jDom/core/dom/objects.documentItem</code></dt>
<dd><p>The entry function</p>
</dd>
<dt><a href="#selectShipDirection">selectShipDirection()</a></dt>
<dd></dd>
<dt><a href="#restart">restart(e, button)</a></dt>
<dd></dd>
<dt><a href="#generateStartEnd">generateStartEnd(matrix, shipLength, startDir)</a> ⇒ <code>Array</code></dt>
<dd><p>Get a qualifying start and direction point for a ship of specified length
WARNING: This is a recursive function.</p>
</dd>
<dt><a href="#generateRandomFleet">generateRandomFleet(ships, matrix, [view])</a> ⇒ <code>Array</code></dt>
<dd><p>Create a series of randomly placed ships based on the provided shipLengths.
The optional parameter view will set the visibility of the ships.</p>
</dd>
<dt><a href="#buildShip">buildShip(shipInfo, line, matrix, view)</a> ⇒ <code>Object</code></dt>
<dd><p>Generate a ship with the provided line of points.
The visibility of the ship on the board is determined by the view parameter.</p>
</dd>
<dt><a href="#buildPlayers">buildPlayers(humans, robots, players)</a> ⇒ <code>Array</code></dt>
<dd><p>Create players and associated properties.
Takes an integer for the number of players to generate.
Returns an array of players.
WARNING: This is a recursive function.</p>
</dd>
<dt><a href="#beginRound">beginRound(e, mainForm)</a> ⇒ <code>boolean</code></dt>
<dd><p>Logic for setting up and starting a new round
(selects random start player and calls computer attack if it is AI starting)</p>
</dd>
<dt><a href="#selectTargetPlayer">selectTargetPlayer(players)</a> ⇒ <code>*</code></dt>
<dd><p>Choose which player to attack.</p>
</dd>
<dt><a href="#selectTargetCoordinate">selectTargetCoordinate(victim)</a> ⇒ <code>*</code></dt>
<dd><p>Choose which coordinate to attack.</p>
</dd>
<dt><a href="#resetTargets">resetTargets(data)</a> ⇒ <code>void</code> | <code>Array</code> | <code>Object</code> | <code>*</code></dt>
<dd></dd>
<dt><a href="#displayTargets">displayTargets(targets, target, victim)</a> ⇒ <code>Array</code></dt>
<dd></dd>
<dt><a href="#computerAttack">computerAttack(player, players)</a></dt>
<dd><p>Main AI logic for computer to attack, selects a target then performs attack function.</p>
</dd>
<dt><a href="#waterTile">waterTile()</a> ⇒ <code>Object</code></dt>
<dd><p>Set the style for tiles representing water.</p>
</dd>
<dt><a href="#shipTile">shipTile()</a> ⇒ <code>Object</code></dt>
<dd><p>Set status and custom properties for tiles that have a ship</p>
</dd>
<dt><a href="#ship">ship(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Store properties of a ship which includes an array of all associated ship tiles.</p>
</dd>
<dt><a href="#playerStats">playerStats([player], [status&#x3D;])</a> ⇒ <code>Object</code></dt>
<dd><p>The defined attributes for each player</p>
</dd>
<dt><a href="#playerSet">playerSet(board, name)</a> ⇒ <code>Object</code></dt>
<dd><p>Store the player attributes.</p>
</dd>
<dt><a href="#hitTile">hitTile()</a> ⇒ <code>Object</code></dt>
<dd><p>Set the status of the tile to hit.</p>
</dd>
<dt><a href="#gameTile">gameTile()</a> ⇒ <code>module:jDom/core/dom/objects.DomItem</code></dt>
<dd><p>Default properties for a tile in the battleship game.</p>
</dd>
<dt><a href="#mainMenu">mainMenu()</a> ⇒ <code>module:jDom/core/dom/objects.DomItem</code></dt>
<dd><p>This will be the main menu for the game.</p>
</dd>
<dt><a href="#finalScore">finalScore(players)</a> ⇒ <code>module:jDom/core/dom/objects.DomItem</code></dt>
<dd><p>Display the final scores after a game has ended and have a button to restart.</p>
</dd>
<dt><a href="#boards">boards([players])</a> ⇒ <code>module:jDom/core/dom/objects.DomItem</code></dt>
<dd><p>Wrapper div for player data / boards</p>
</dd>
<dt><a href="#update3dCell">update3dCell(config, matrix, x, y, z, isRobot)</a></dt>
<dd><p>Given a cell and new config data, update the data of the cell</p>
</dd>
<dt><a href="#setShip">setShip(matrix, point, view)</a></dt>
<dd><p>Set a specified point to be part of a ship</p>
</dd>
<dt><a href="#configureHtml">configureHtml(config, isRobot)</a> ⇒ <code>*</code></dt>
<dd><p>Update view based on actions performed</p>
</dd>
<dt><a href="#colourHitCell">colourHitCell(config)</a></dt>
<dd><p>Colour a cell once it has been hit: red for a ship, white for water. Cells only have a style object once something
has resized or highlighted them, so it is created here when it is missing.</p>
</dd>
<dt><a href="#updateScore">updateScore(hitShip, sunkShip, players)</a> ⇒ <code>*</code></dt>
<dd><p>Update all game stats after each player round</p>
</dd>
<dt><a href="#updatePlayerStats">updatePlayerStats(player, status)</a> ⇒ <code>*</code></dt>
<dd></dd>
<dt><a href="#updatePlayer">updatePlayer(player, hitShip, sunkShip)</a></dt>
<dd><p>Track player stats such as attacks and turns</p>
</dd>
<dt><a href="#getNextAttacker">getNextAttacker(attacker, players, hitShip)</a> ⇒ <code>*</code></dt>
<dd><p>Based on the current attacker and list of players, return the next attacker.</p>
</dd>
<dt><a href="#findNextAttacker">findNextAttacker(attacker, players, attackerIndex)</a> ⇒ <code>*</code></dt>
<dd></dd>
<dt><a href="#endGame">endGame(winner)</a> ⇒ <code>Array.&lt;*&gt;</code></dt>
<dd><p>Final state once a game is won (only one player remains)</p>
</dd>
<dt><a href="#attackListener">attackListener(e, target)</a> ⇒ <code>*</code></dt>
<dd></dd>
<dt><a href="#attackFleet">attackFleet(target)</a> ⇒ <code>*</code></dt>
<dd><p>Perform attack on an enemy board / cell</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#documentItem">documentItem</a> : <code>module:jDom/core/dom/objects.documentItem</code></dt>
<dd><p>Create new private reference to the document</p>
</dd>
</dl>

<a name="queueTimeout"></a>

## queueTimeout
The one timed queue the whole game runs on: steps queued here run one after another, after their delay.

**Kind**: global constant  
<a name="defaultFleet"></a>

## defaultFleet ⇒ <code>Array</code>
Create a default fleet using the standard battleship lengths.

**Kind**: global constant  

| Param | Type | Default |
| --- | --- | --- |
| matrix | <code>Object</code> |  | 
| [view] | <code>boolean</code> | <code>false</code> | 

<a name="setViewShip"></a>

## setViewShip
**Kind**: global constant  
<a name="setHit"></a>

## setHit
**Kind**: global constant  
<a name="setHiddenShip"></a>

## setHiddenShip
**Kind**: global constant  
<a name="attackLock"></a>

## attackLock
Whether attacks are being ignored right now: the board is locked while the turn changes over. Shared by the code which
starts and ends a turn and the code which takes an attack.

**Kind**: global constant  
<a name="numDamagedParts"></a>

## numDamagedParts(total, status) ⇒ <code>number</code>
Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.

**Kind**: global function  

| Param |
| --- |
| total | 
| status | 

<a name="getLowStatusItems"></a>

## getLowStatusItems(items) ⇒ <code>Array</code>
Given an array of items, return all items which have the lowest status property

**Kind**: global function  

| Param |
| --- |
| items | 

<a name="getBrokenShipsPlayers"></a>

## getBrokenShipsPlayers(players) ⇒ <code>Array</code>
Return all of the players which have broken ships.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="getBrokenItems"></a>

## getBrokenItems(items) ⇒ <code>Array</code>
Given an array of items, return all of the items which have a status less than 100, but more than 0

**Kind**: global function  

| Param |
| --- |
| items | 

<a name="getAllNonHitCells"></a>

## getAllNonHitCells(matrix) ⇒ <code>Array</code>
Get all points which were not yet hit in the matrix.

**Kind**: global function  

| Param |
| --- |
| matrix | 

<a name="getAdjEdgeNonHitCells"></a>

## getAdjEdgeNonHitCells(pnt, matrix) ⇒ <code>Array</code>
Get the points which have same edges with the provided point and are not hit.

**Kind**: global function  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="getALowStatusItem"></a>

## getALowStatusItem(items) ⇒ <code>Array</code>
Given an array of items, return the item with the lowest status property (at the end of the array)

**Kind**: global function  

| Param |
| --- |
| items | 

<a name="filterAdjacentPoints"></a>

## filterAdjacentPoints(pnt) ⇒ <code>boolean</code>
Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell

**Kind**: global function  

| Param |
| --- |
| pnt | 

<a name="checkIfShipCell"></a>

## checkIfShipCell(pnt, matrix) ⇒ <code>boolean</code>
Return the hasShip tile boolean at the specified point.

**Kind**: global function  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="checkIfHitCell"></a>

## checkIfHitCell(pnt, matrix) ⇒ <code>boolean</code>
Return the isHit tile boolean at the specified point.

**Kind**: global function  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="startMenu"></a>

## startMenu(parent) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
The entry function

**Kind**: global function  

| Param |
| --- |
| parent | 

<a name="selectShipDirection"></a>

## selectShipDirection()
**Kind**: global function  
<a name="restart"></a>

## restart(e, button)
**Kind**: global function  

| Param |
| --- |
| e | 
| button | 

<a name="generateStartEnd"></a>

## generateStartEnd(matrix, shipLength, startDir) ⇒ <code>Array</code>
Get a qualifying start and direction point for a ship of specified lengthWARNING: This is a recursive function.

**Kind**: global function  

| Param |
| --- |
| matrix | 
| shipLength | 
| startDir | 

<a name="generateRandomFleet"></a>

## generateRandomFleet(ships, matrix, [view]) ⇒ <code>Array</code>
Create a series of randomly placed ships based on the provided shipLengths.The optional parameter view will set the visibility of the ships.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| ships | <code>Array</code> |  | 
| matrix | <code>Object</code> |  | 
| [view] | <code>boolean</code> | <code>false</code> | 

<a name="buildShip"></a>

## buildShip(shipInfo, line, matrix, view) ⇒ <code>Object</code>
Generate a ship with the provided line of points.The visibility of the ship on the board is determined by the view parameter.

**Kind**: global function  

| Param | Default |
| --- | --- |
| shipInfo |  | 
| line |  | 
| matrix |  | 
| view | <code>false</code> | 

<a name="buildPlayers"></a>

## buildPlayers(humans, robots, players) ⇒ <code>Array</code>
Create players and associated properties.Takes an integer for the number of players to generate.Returns an array of players.WARNING: This is a recursive function.

**Kind**: global function  

| Param | Default |
| --- | --- |
| humans |  | 
| robots | <code>0</code> | 
| players |  | 

<a name="beginRound"></a>

## beginRound(e, mainForm) ⇒ <code>boolean</code>
Logic for setting up and starting a new round(selects random start player and calls computer attack if it is AI starting)

**Kind**: global function  

| Param |
| --- |
| e | 
| mainForm | 

<a name="selectTargetPlayer"></a>

## selectTargetPlayer(players) ⇒ <code>\*</code>
Choose which player to attack.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="selectTargetCoordinate"></a>

## selectTargetCoordinate(victim) ⇒ <code>\*</code>
Choose which coordinate to attack.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="resetTargets"></a>

## resetTargets(data) ⇒ <code>void</code> \| <code>Array</code> \| <code>Object</code> \| <code>\*</code>
**Kind**: global function  

| Param |
| --- |
| data | 

<a name="displayTargets"></a>

## displayTargets(targets, target, victim) ⇒ <code>Array</code>
**Kind**: global function  

| Param |
| --- |
| targets | 
| target | 
| victim | 

<a name="computerAttack"></a>

## computerAttack(player, players)
Main AI logic for computer to attack, selects a target then performs attack function.

**Kind**: global function  

| Param |
| --- |
| player | 
| players | 

<a name="waterTile"></a>

## waterTile() ⇒ <code>Object</code>
Set the style for tiles representing water.

**Kind**: global function  
<a name="shipTile"></a>

## shipTile() ⇒ <code>Object</code>
Set status and custom properties for tiles that have a ship

**Kind**: global function  
<a name="ship"></a>

## ship(name) ⇒ <code>Object</code>
Store properties of a ship which includes an array of all associated ship tiles.

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="playerStats"></a>

## playerStats([player], [status&#x3D;]) ⇒ <code>Object</code>
The defined attributes for each player

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [player] | <code>Object</code> | <code>{}</code> | 
| [status=] | <code>Object</code> |  | 

<a name="playerSet"></a>

## playerSet(board, name) ⇒ <code>Object</code>
Store the player attributes.

**Kind**: global function  

| Param | Type |
| --- | --- |
| board | <code>Object</code> | 
| name | <code>string</code> | 

<a name="hitTile"></a>

## hitTile() ⇒ <code>Object</code>
Set the status of the tile to hit.

**Kind**: global function  
<a name="gameTile"></a>

## gameTile() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Default properties for a tile in the battleship game.

**Kind**: global function  
<a name="mainMenu"></a>

## mainMenu() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
This will be the main menu for the game.

**Kind**: global function  
<a name="finalScore"></a>

## finalScore(players) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Display the final scores after a game has ended and have a button to restart.

**Kind**: global function  

| Param | Type |
| --- | --- |
| players | <code>Array</code> | 

<a name="boards"></a>

## boards([players]) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Wrapper div for player data / boards

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [players] | <code>Array</code> | <code>[]</code> | 

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

## configureHtml(config, isRobot) ⇒ <code>\*</code>
Update view based on actions performed

**Kind**: global function  

| Param |
| --- |
| config | 
| isRobot | 

<a name="colourHitCell"></a>

## colourHitCell(config)
Colour a cell once it has been hit: red for a ship, white for water. Cells only have a style object once somethinghas resized or highlighted them, so it is created here when it is missing.

**Kind**: global function  

| Param |
| --- |
| config | 

<a name="updateScore"></a>

## updateScore(hitShip, sunkShip, players) ⇒ <code>\*</code>
Update all game stats after each player round

**Kind**: global function  

| Param |
| --- |
| hitShip | 
| sunkShip | 
| players | 

<a name="updatePlayerStats"></a>

## updatePlayerStats(player, status) ⇒ <code>\*</code>
**Kind**: global function  

| Param |
| --- |
| player | 
| status | 

<a name="updatePlayer"></a>

## updatePlayer(player, hitShip, sunkShip)
Track player stats such as attacks and turns

**Kind**: global function  

| Param |
| --- |
| player | 
| hitShip | 
| sunkShip | 

<a name="getNextAttacker"></a>

## getNextAttacker(attacker, players, hitShip) ⇒ <code>\*</code>
Based on the current attacker and list of players, return the next attacker.

**Kind**: global function  

| Param |
| --- |
| attacker | 
| players | 
| hitShip | 

<a name="findNextAttacker"></a>

## findNextAttacker(attacker, players, attackerIndex) ⇒ <code>\*</code>
**Kind**: global function  

| Param |
| --- |
| attacker | 
| players | 
| attackerIndex | 

<a name="endGame"></a>

## endGame(winner) ⇒ <code>Array.&lt;\*&gt;</code>
Final state once a game is won (only one player remains)

**Kind**: global function  

| Param |
| --- |
| winner | 

<a name="attackListener"></a>

## attackListener(e, target) ⇒ <code>\*</code>
**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="attackFleet"></a>

## attackFleet(target) ⇒ <code>\*</code>
Perform attack on an enemy board / cell

**Kind**: global function  

| Param |
| --- |
| target | 

<a name="documentItem"></a>

## documentItem : <code>module:jDom/core/dom/objects.documentItem</code>
Create new private reference to the document

**Kind**: global typedef  
