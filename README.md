# battleship

This is just a fun project creating a game of battleship. Experimenting with functional programming and ES6 features.

A relatively recent version is running at https: //joshuaheagle.com/battleship/
## Modules

<dl>
<dt><a href="#module_game/setup">game/setup</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_game/functions">game/functions</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_game/actions">game/actions</a> : <code>Object</code></dt>
<dd><p>All methods exported from this module are encapsulated within gameActions.</p>
</dd>
<dt><a href="#module_game/pieces">game/pieces</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_game/layout">game/layout</a> : <code>Object</code></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#documentItem">documentItem</a> : <code>module:jDom/core/dom/objects.documentItem</code></dt>
<dd><p>Create new private reference to the document</p>
</dd>
</dl>

<a name="module_game/setup"></a>

## game/setup
A reference to all functions to be used globally / exported


* [game/setup](#module_game/setup)
    * [~defaultFleet](#module_game/setup..defaultFleet) ⇒ <code>Array</code>
    * [~buildShip(shipInfo, line, matrix, view)](#module_game/setup..buildShip) ⇒ <code>Object</code>
    * [~selectShipDirection(lengths, shipLength)](#module_game/setup..selectShipDirection)
    * [~randomStartDir(lengths, shipLength, dir)](#module_game/setup..randomStartDir) ⇒ <code>Object</code>
    * [~generateStartEnd(matrix, shipLength, lengths, startDir)](#module_game/setup..generateStartEnd) ⇒ <code>Array</code>
    * [~generateRandomFleet(ships, matrix, [view])](#module_game/setup..generateRandomFleet) ⇒ <code>Array</code>
    * [~buildPlayers(humans, robots, players)](#module_game/setup..buildPlayers) ⇒ <code>Array</code>
    * [~beginRound(e, mainForm)](#module_game/setup..beginRound) ⇒ <code>boolean</code>
    * [~main(parent)](#module_game/setup..main) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
    * [~restart(e, button)](#module_game/setup..restart)

<a name="module_game/setup..defaultFleet"></a>

### game/setup~defaultFleet ⇒ <code>Array</code>
Create a default fleet using the standard battleship lengths.

**Kind**: inner constant of [<code>game/setup</code>](#module_game/setup)  

| Param | Type | Default |
| --- | --- | --- |
| matrix | <code>Object</code> |  | 
| [view] | <code>boolean</code> | <code>false</code> | 

<a name="module_game/setup..buildShip"></a>

### game/setup~buildShip(shipInfo, line, matrix, view) ⇒ <code>Object</code>
Generate a ship with the provided line of points.The visibility of the ship on the board is determined by the view parameter.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param | Default |
| --- | --- |
| shipInfo |  | 
| line |  | 
| matrix |  | 
| view | <code>false</code> | 

<a name="module_game/setup..selectShipDirection"></a>

### game/setup~selectShipDirection(lengths, shipLength)
**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| lengths | 
| shipLength | 

<a name="module_game/setup..randomStartDir"></a>

### game/setup~randomStartDir(lengths, shipLength, dir) ⇒ <code>Object</code>
**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| lengths | 
| shipLength | 
| dir | 

<a name="module_game/setup..generateStartEnd"></a>

### game/setup~generateStartEnd(matrix, shipLength, lengths, startDir) ⇒ <code>Array</code>
Get a qualifying start and direction point for a ship of specified lengthWARNING: This is a recursive function.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| matrix | 
| shipLength | 
| lengths | 
| startDir | 

<a name="module_game/setup..generateRandomFleet"></a>

### game/setup~generateRandomFleet(ships, matrix, [view]) ⇒ <code>Array</code>
Create a series of randomly placed ships based on the provided shipLengths.The optional parameter view will set the visibility of the ships.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param | Type | Default |
| --- | --- | --- |
| ships | <code>Array</code> |  | 
| matrix | <code>Object</code> |  | 
| [view] | <code>boolean</code> | <code>false</code> | 

<a name="module_game/setup..buildPlayers"></a>

### game/setup~buildPlayers(humans, robots, players) ⇒ <code>Array</code>
Create players and associated properties.Takes an integer for the number of players to generate.Returns an array of players.WARNING: This is a recursive function.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param | Default |
| --- | --- |
| humans |  | 
| robots | <code>0</code> | 
| players |  | 

<a name="module_game/setup..beginRound"></a>

### game/setup~beginRound(e, mainForm) ⇒ <code>boolean</code>
Logic for setting up and starting a new round(selects random start player and calls computer attack if it is AI starting)

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| e | 
| mainForm | 

<a name="module_game/setup..main"></a>

### game/setup~main(parent) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
The entry function

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| parent | 

<a name="module_game/setup..restart"></a>

### game/setup~restart(e, button)
**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| e | 
| button | 

<a name="module_game/functions"></a>

## game/functions
A reference to all functions to be used globally / exported


* [game/functions](#module_game/functions)
    * [~checkIfShipCell(pnt, matrix)](#module_game/functions..checkIfShipCell) ⇒ <code>boolean</code>
    * [~checkIfHitCell(pnt, matrix)](#module_game/functions..checkIfHitCell) ⇒ <code>boolean</code>
    * [~getAllNonHitCells(matrix)](#module_game/functions..getAllNonHitCells) ⇒ <code>Array</code>
    * [~getAdjEdgeNonHitCells(pnt, matrix)](#module_game/functions..getAdjEdgeNonHitCells) ⇒ <code>Array</code>
    * [~getALowStatusItem(items)](#module_game/functions..getALowStatusItem) ⇒ <code>Array</code>
    * [~getLowStatusItems(items)](#module_game/functions..getLowStatusItems) ⇒ <code>Array</code>
    * [~getBrokenItems(items)](#module_game/functions..getBrokenItems) ⇒ <code>Array</code>
    * [~getBrokenShipsPlayers(players)](#module_game/functions..getBrokenShipsPlayers) ⇒ <code>Array</code>
    * [~numDamagedParts(total, status)](#module_game/functions..numDamagedParts) ⇒ <code>number</code>
    * [~filterAdjacentPoints(pnt)](#module_game/functions..filterAdjacentPoints) ⇒ <code>boolean</code>

<a name="module_game/functions..checkIfShipCell"></a>

### game/functions~checkIfShipCell(pnt, matrix) ⇒ <code>boolean</code>
Return the hasShip tile boolean at the specified point.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_game/functions..checkIfHitCell"></a>

### game/functions~checkIfHitCell(pnt, matrix) ⇒ <code>boolean</code>
Return the isHit tile boolean at the specified point.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_game/functions..getAllNonHitCells"></a>

### game/functions~getAllNonHitCells(matrix) ⇒ <code>Array</code>
Get all points which were not yet hit in the matrix.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| matrix | 

<a name="module_game/functions..getAdjEdgeNonHitCells"></a>

### game/functions~getAdjEdgeNonHitCells(pnt, matrix) ⇒ <code>Array</code>
Get the points which have same edges with the provided point and are not hit.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_game/functions..getALowStatusItem"></a>

### game/functions~getALowStatusItem(items) ⇒ <code>Array</code>
Given an array of items, return the item with the lowest status property (at the end of the array)

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| items | 

<a name="module_game/functions..getLowStatusItems"></a>

### game/functions~getLowStatusItems(items) ⇒ <code>Array</code>
Given an array of items, return all items which have the lowest status property

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| items | 

<a name="module_game/functions..getBrokenItems"></a>

### game/functions~getBrokenItems(items) ⇒ <code>Array</code>
Given an array of items, return all of the items which have a status less than 100, but more than 0

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| items | 

<a name="module_game/functions..getBrokenShipsPlayers"></a>

### game/functions~getBrokenShipsPlayers(players) ⇒ <code>Array</code>
Return all of the players which have broken ships.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| players | 

<a name="module_game/functions..numDamagedParts"></a>

### game/functions~numDamagedParts(total, status) ⇒ <code>number</code>
Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| total | 
| status | 

<a name="module_game/functions..filterAdjacentPoints"></a>

### game/functions~filterAdjacentPoints(pnt) ⇒ <code>boolean</code>
Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 

<a name="module_game/actions"></a>

## game/actions : <code>Object</code>
All methods exported from this module are encapsulated within gameActions.


* [game/actions](#module_game/actions) : <code>Object</code>
    * [~setViewShip](#module_game/actions..setViewShip)
    * [~setHiddenShip](#module_game/actions..setHiddenShip)
    * [~setHit](#module_game/actions..setHit)
    * [~configureHtml(config, isRobot)](#module_game/actions..configureHtml) ⇒ <code>\*</code>
    * [~update3dCell(config, matrix, x, y, z, isRobot)](#module_game/actions..update3dCell)
    * [~setShip(matrix, point, view)](#module_game/actions..setShip)
    * [~updatePlayerStats(player, status)](#module_game/actions..updatePlayerStats) ⇒ <code>\*</code>
    * [~updatePlayer(player, playAgain, sunkShip)](#module_game/actions..updatePlayer)
    * [~endGame(winner)](#module_game/actions..endGame) ⇒ <code>Array.&lt;\*&gt;</code>
    * [~findNextAttacker(attacker, players, attackerIndex)](#module_game/actions..findNextAttacker) ⇒ <code>\*</code>
    * [~getNextAttacker(attacker, players, playAgain)](#module_game/actions..getNextAttacker) ⇒ <code>\*</code>
    * [~updateScore(player, hitShip, sunkShip, players)](#module_game/actions..updateScore) ⇒ <code>\*</code>
    * [~attackFleet(target)](#module_game/actions..attackFleet) ⇒ <code>\*</code>
    * [~attackListener(e, target)](#module_game/actions..attackListener) ⇒ <code>\*</code>
    * [~selectTargetPlayer(players)](#module_game/actions..selectTargetPlayer) ⇒ <code>\*</code>
    * [~selectTargetCoordinate(victim)](#module_game/actions..selectTargetCoordinate) ⇒ <code>\*</code>
    * [~displayTargets(targets, target, victim)](#module_game/actions..displayTargets) ⇒ <code>Array</code>
    * [~resetTargets(data)](#module_game/actions..resetTargets) ⇒ <code>void</code> \| <code>Array</code> \| <code>Object</code> \| <code>\*</code>
    * [~computerAttack(player, players)](#module_game/actions..computerAttack)

<a name="module_game/actions..setViewShip"></a>

### game/actions~setViewShip
**Kind**: inner constant of [<code>game/actions</code>](#module_game/actions)  
<a name="module_game/actions..setHiddenShip"></a>

### game/actions~setHiddenShip
**Kind**: inner constant of [<code>game/actions</code>](#module_game/actions)  
<a name="module_game/actions..setHit"></a>

### game/actions~setHit
**Kind**: inner constant of [<code>game/actions</code>](#module_game/actions)  
<a name="module_game/actions..configureHtml"></a>

### game/actions~configureHtml(config, isRobot) ⇒ <code>\*</code>
Update view based on actions performed

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| config | 
| isRobot | 

<a name="module_game/actions..update3dCell"></a>

### game/actions~update3dCell(config, matrix, x, y, z, isRobot)
Given a cell and new config data, update the data of the cell

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param | Default |
| --- | --- |
| config |  | 
| matrix |  | 
| x |  | 
| y |  | 
| z |  | 
| isRobot | <code>false</code> | 

<a name="module_game/actions..setShip"></a>

### game/actions~setShip(matrix, point, view)
Set a specified point to be part of a ship

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| matrix | 
| point | 
| view | 

<a name="module_game/actions..updatePlayerStats"></a>

### game/actions~updatePlayerStats(player, status) ⇒ <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| status | 

<a name="module_game/actions..updatePlayer"></a>

### game/actions~updatePlayer(player, playAgain, sunkShip)
Track player stats such as attacks and turns

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| playAgain | 
| sunkShip | 

<a name="module_game/actions..endGame"></a>

### game/actions~endGame(winner) ⇒ <code>Array.&lt;\*&gt;</code>
Final state once a game is won (only one player remains)

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| winner | 

<a name="module_game/actions..findNextAttacker"></a>

### game/actions~findNextAttacker(attacker, players, attackerIndex) ⇒ <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| attacker | 
| players | 
| attackerIndex | 

<a name="module_game/actions..getNextAttacker"></a>

### game/actions~getNextAttacker(attacker, players, playAgain) ⇒ <code>\*</code>
Based on the current attacker and list of players, return the next attacker.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| attacker | 
| players | 
| playAgain | 

<a name="module_game/actions..updateScore"></a>

### game/actions~updateScore(player, hitShip, sunkShip, players) ⇒ <code>\*</code>
Update all game stats after each player round

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| hitShip | 
| sunkShip | 
| players | 

<a name="module_game/actions..attackFleet"></a>

### game/actions~attackFleet(target) ⇒ <code>\*</code>
Perform attack on an enemy board / cell

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| target | 

<a name="module_game/actions..attackListener"></a>

### game/actions~attackListener(e, target) ⇒ <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| e | 
| target | 

<a name="module_game/actions..selectTargetPlayer"></a>

### game/actions~selectTargetPlayer(players) ⇒ <code>\*</code>
Choose which player to attack.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| players | 

<a name="module_game/actions..selectTargetCoordinate"></a>

### game/actions~selectTargetCoordinate(victim) ⇒ <code>\*</code>
Choose which coordinate to attack.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| victim | 

<a name="module_game/actions..displayTargets"></a>

### game/actions~displayTargets(targets, target, victim) ⇒ <code>Array</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| targets | 
| target | 
| victim | 

<a name="module_game/actions..resetTargets"></a>

### game/actions~resetTargets(data) ⇒ <code>void</code> \| <code>Array</code> \| <code>Object</code> \| <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| data | 

<a name="module_game/actions..computerAttack"></a>

### game/actions~computerAttack(player, players)
Main AI logic for computer to attack, selects a target then performs attack function.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| players | 

<a name="module_game/pieces"></a>

## game/pieces
A reference to all functions to be used globally / exported


* [game/pieces](#module_game/pieces)
    * [~gameTile()](#module_game/pieces..gameTile) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~waterTile()](#module_game/pieces..waterTile) ⇒ <code>Object</code>
    * [~shipTile()](#module_game/pieces..shipTile) ⇒ <code>Object</code>
    * [~ship(name)](#module_game/pieces..ship) ⇒ <code>Object</code>
    * [~hitTile()](#module_game/pieces..hitTile) ⇒ <code>Object</code>
    * [~playerSet(board, name)](#module_game/pieces..playerSet) ⇒ <code>Object</code>
    * [~playerStats([player], [status&#x3D;])](#module_game/pieces..playerStats) ⇒ <code>Object</code>

<a name="module_game/pieces..gameTile"></a>

### game/pieces~gameTile() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Default properties for a tile in the battleship game.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..waterTile"></a>

### game/pieces~waterTile() ⇒ <code>Object</code>
Set the style for tiles representing water.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..shipTile"></a>

### game/pieces~shipTile() ⇒ <code>Object</code>
Set status and custom properties for tiles that have a ship

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..ship"></a>

### game/pieces~ship(name) ⇒ <code>Object</code>
Store properties of a ship which includes an array of all associated ship tiles.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="module_game/pieces..hitTile"></a>

### game/pieces~hitTile() ⇒ <code>Object</code>
Set the status of the tile to hit.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..playerSet"></a>

### game/pieces~playerSet(board, name) ⇒ <code>Object</code>
Store the player attributes.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  

| Param | Type |
| --- | --- |
| board | <code>Object</code> | 
| name | <code>string</code> | 

<a name="module_game/pieces..playerStats"></a>

### game/pieces~playerStats([player], [status&#x3D;]) ⇒ <code>Object</code>
The defined attributes for each player

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  

| Param | Type | Default |
| --- | --- | --- |
| [player] | <code>Object</code> | <code>{}</code> | 
| [status=] | <code>Object</code> |  | 

<a name="module_game/layout"></a>

## game/layout : <code>Object</code>
A reference to all functions to be used globally / exported


* [game/layout](#module_game/layout) : <code>Object</code>
    * [~mainMenu()](#module_game/layout..mainMenu) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~boards([players])](#module_game/layout..boards) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~finalScore(players)](#module_game/layout..finalScore) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>

<a name="module_game/layout..mainMenu"></a>

### game/layout~mainMenu() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
This will be the main menu for the game.

**Kind**: inner method of [<code>game/layout</code>](#module_game/layout)  
<a name="module_game/layout..boards"></a>

### game/layout~boards([players]) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Wrapper div for player data / boards

**Kind**: inner method of [<code>game/layout</code>](#module_game/layout)  

| Param | Type | Default |
| --- | --- | --- |
| [players] | <code>Array</code> | <code>[]</code> | 

<a name="module_game/layout..finalScore"></a>

### game/layout~finalScore(players) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Display the final scores after a game has ended and have a button to restart.

**Kind**: inner method of [<code>game/layout</code>](#module_game/layout)  

| Param | Type |
| --- | --- |
| players | <code>Array</code> | 

<a name="documentItem"></a>

## documentItem : <code>module:jDom/core/dom/objects.documentItem</code>
Create new private reference to the document

**Kind**: global typedef  
