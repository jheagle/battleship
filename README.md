# battleship

This is just a fun project creating a game of battleship. Experimenting with functional programming and ES6 features.

A relatively recent version is running at https: //joshuaheagle.com/battleship/
## Members

<dl>
<dt><a href="#hasTrait">hasTrait</a></dt>
<dd><p>The typed version of json-dom&#39;s hasTrait, it narrows an item to the trait it was checked for.</p>
</dd>
<dt><a href="#PLACEMENT_TIMEOUT_MS">PLACEMENT_TIMEOUT_MS</a></dt>
<dd><p>How long players have to finish placing before any still-pending ships are placed at random for them.</p>
</dd>
<dt><a href="#lastGameSettings">lastGameSettings</a></dt>
<dd><p>The settings the host last actually started a game with - Play Again (see remotePlayAgainListener.ts) has no
settings form of its own, it just reuses whatever the last real game used, the same way local hot-seat&#39;s own
playAgain.ts does. Set only from the waiting room&#39;s own Start Game click - never read before that happens.</p>
</dd>
<dt><a href="#playerColours">playerColours</a></dt>
<dd><p>The colour each player is identified by, in the order they are created. They are bright enough to read on the dark
background, and distinct from one another.</p>
</dd>
<dt><a href="#defaultShipSpecs">defaultShipSpecs</a></dt>
<dd><p>Create a default fleet using the standard battleship lengths.</p>
</dd>
<dt><a href="#STAGE_MS">STAGE_MS</a></dt>
<dd><p>How long each stage of the robot&#39;s attack is shown for, in turn.</p>
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
<dt><a href="#DEFAULT_URL">DEFAULT_URL</a></dt>
<dd><p>No server is deployed yet - this only works against a locally-run lobby server (npm run dev:lobby).</p>
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
</dl>

## Functions

<dl>
<dt><a href="#queueTimeout">queueTimeout(item, fn, time, ...args)</a></dt>
<dd><p>The timed queue the given item&#39;s game runs on: steps queued here run one after another, after their delay. Each
game has its own queue (see gameSession), so two games&#39; turn changes, robot attacks, and animations never interleave.</p>
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
<dt><a href="#clearBody">clearBody(parent)</a></dt>
<dd><p>Remove everything from the page: whatever screen was showing (the menu, a finished game&#39;s final scores, or a game
in progress), so a new one can be built on a blank page.</p>
</dd>
<dt><a href="#startRound">startRound(order, firstGoesFirst)</a></dt>
<dd><p>Pick the first attacker, and let a robot start if it is one.</p>
</dd>
<dt><a href="#startNewGame">startNewGame(parent, humans, robots, firstGoesFirst, hints, placementStarter, onPlayersBuilt)</a></dt>
<dd><p>Build the players, place their ships, and start the round. Shared by beginRound (reading these settings from the
lobby form) and playAgain (reading them from the settings the last game was started with) - either way, this is
the one place a round actually begins. A remote game passes startRemotePlacement (simultaneous per-player
placement, no handoff) in place of the default, and onPlayersBuilt to set each player&#39;s real name before
anything is ever rendered or pushed - see server/gameplay.ts. Local play needs neither: a human types their own
name during their own handoff screen (see placement.ts&#39;s nameInput), since there is nothing to know upfront.</p>
</dd>
<dt><a href="#startMenu">startMenu(parent)</a></dt>
<dd><p>The entry function</p>
</dd>
<dt><a href="#update">update(item, attributes)</a></dt>
<dd><p>Update an item&#39;s attributes in place on the real element.</p>
</dd>
<dt><a href="#show">show(item, shown)</a></dt>
<dd><p>Show or hide an item by its display style.</p>
</dd>
<dt><a href="#showLobby">showLobby(menu, preset, values)</a></dt>
<dd><p>Show the lobby for a game type, inside an already-rendered main menu: sets its title and field limits from the
preset, fills in the given values (or the preset&#39;s own defaults), and reveals it in place of the game types.</p>
</dd>
<dt><a href="#returnToLobby">returnToLobby(e, button)</a></dt>
<dd><p>Back to the lobby, with the settings from the game that just ended already filled in, so they can be changed
before playing again - unlike the main menu button, which goes all the way back to choosing the game type.</p>
</dd>
<dt><a href="#restart">restart(e, button)</a></dt>
<dd></dd>
<dt><a href="#remotePlayAgainListener">remotePlayAgainListener(e, target)</a></dt>
<dd><p>The final-score screen&#39;s Play Again button, for a remote game - host-only (enforced server-side, see
lobbyServer.ts&#39;s startGame handler; disabled on a non-host&#39;s own redacted copy too, see redactGameState.ts).
Reuses the settings the last real game actually started with (see remoteListener.ts&#39;s getLastGameSettings) -
there is no settings form on this screen, same as local hot-seat&#39;s own playAgain.ts. This only ever runs
client-side with forwarding already turned off for this exact reason (see remoteGame.ts&#39;s enterRemoteGame) -
the server&#39;s own copy of this listener name is a trivial stand-in, never meant to actually run.</p>
</dd>
<dt><a href="#remotePlacementListener">remotePlacementListener(e, target)</a></dt>
<dd><p>The remote placement/ordering panels&#39; own buttons - each player&#39;s Randomise/Ready, and the host-only Random/
Set order. Told apart by class name, same pattern as local placement&#39;s own placementListener.</p>
</dd>
<dt><a href="#isRemoteSessionActive">isRemoteSessionActive()</a></dt>
<dd><p>Whether a remote placement/ordering phase is running for this item&#39;s game - so a board click during it is
routed here instead of to a normal attack (see attackListener.ts).</p>
</dd>
<dt><a href="#isHostOnlyStage">isHostOnlyStage()</a></dt>
<dd><p>Whether only the host may act right now - every stage except placing itself (see server/lobbyServer.ts).</p>
</dd>
<dt><a href="#renderPanel">renderPanel()</a></dt>
<dd><p>Refresh one player&#39;s own placement panel to match their current state.</p>
</dd>
<dt><a href="#showStart">showStart()</a></dt>
<dd><p>Mark which cells a ship-in-progress could end on, same visual as local placement&#39;s own showStart.</p>
</dd>
<dt><a href="#startRemotePlacement">startRemotePlacement(players, body, done, onTimerChange)</a></dt>
<dd><p>Begin a remote game&#39;s placement phase: every human places their own ships on their own board at the same
time - no handoff, no &quot;look away&quot;. <code>done</code> runs once the order is set, with the order play will take.
<code>onTimerChange</code> runs whenever the deadline below actually fires and changes state on its own - every other
state change in this module happens inside a function a dispatched/forwarded click calls directly, which the
server&#39;s own broadcast-after-dispatch already covers; the deadline is the one change that happens on a raw
timer with nothing else watching for it, so without this hook a client that lets it expire sees nothing at
all, even though the server&#39;s own state has already moved on.</p>
</dd>
<dt><a href="#placeRemoteShip">placeRemoteShip(tile, board)</a></dt>
<dd><p>A click on a player&#39;s own board during placement: the first click sets where a ship starts, the second where
it ends (an invalid second click is refused and the start is forgotten) - exactly local placement&#39;s own
two-click mechanic, just resolved from the clicked board&#39;s own owner instead of a shared &quot;current player&quot;.</p>
</dd>
<dt><a href="#pickOrderPlayer">pickOrderPlayer()</a></dt>
<dd><p>A click on a player&#39;s own board while the order is being set (see beginOrderSet) - adds them to the order.</p>
</dd>
<dt><a href="#handleRemoteBoardClick">handleRemoteBoardClick()</a></dt>
<dd><p>A board click while a remote placement/ordering phase is running - routed by the current stage.</p>
</dd>
<dt><a href="#beginOrdering">beginOrdering()</a></dt>
<dd><p>Once every player is ready (or the timer below fires), hide their panels and show the ordering choice.</p>
</dd>
<dt><a href="#autoFinishPlacement">autoFinishPlacement()</a></dt>
<dd><p>Any player still not ready when the deadline passes has their remaining ships placed for them at random.</p>
</dd>
<dt><a href="#readyRemotePlayer">readyRemotePlayer()</a></dt>
<dd><p>The Ready button: locks a player&#39;s own fleet in once nothing is left pending.</p>
</dd>
<dt><a href="#randomiseRemoteShips">randomiseRemoteShips()</a></dt>
<dd><p>The Randomise button: re-rolls just this player&#39;s own remaining fleet, same as local placement&#39;s own version.</p>
</dd>
<dt><a href="#beginOrderSet">beginOrderSet()</a></dt>
<dd><p>The Set order button: from here, clicking each player&#39;s board in turn (see pickOrderPlayer) sets the order.</p>
</dd>
<dt><a href="#highlightOnly">highlightOnly()</a></dt>
<dd><p>Outline one player&#39;s panel, and clear the outline from the others - the random order&#39;s own shuffle animation.</p>
</dd>
<dt><a href="#shuffle">shuffle()</a></dt>
<dd><p>A shuffled copy of the players, in a random order - identical to local placement&#39;s own version.</p>
</dd>
<dt><a href="#chooseOrderRandom">chooseOrderRandom()</a></dt>
<dd><p>The Random button: a short highlight passes over the players, then lands on a full random order.</p>
</dd>
<dt><a href="#finishOrdering">finishOrdering()</a></dt>
<dd><p>The order is set (either way) - show it briefly, then begin the round.</p>
</dd>
<dt><a href="#getLastGameSettings">getLastGameSettings()</a></dt>
<dd><p>The settings the current room&#39;s game last actually started with, if any.</p>
</dd>
<dt><a href="#showRemoteEntry">showRemoteEntry()</a></dt>
<dd><p>Show the remote entry form in place of the game-type tiles, optionally with a room code already filled in -
used both by clicking the Online Multiplayer tile and by a shared join link (see main.ts).</p>
</dd>
<dt><a href="#renderRoomState">renderRoomState()</a></dt>
<dd><p>Replace the waiting room&#39;s player list, room code and host controls with a freshly-received room state.</p>
</dd>
<dt><a href="#leaveToPresets">leaveToPresets()</a></dt>
<dd><p>Leave whatever room is open and show the game types again, clearing any status message.</p>
</dd>
<dt><a href="#enterWaitingRoom">enterWaitingRoom()</a></dt>
<dd><p>Once a room is created or joined, watch it for changes and show the waiting room. Puts the room&#39;s own code in
the address bar too, so the host (or anyone else) can just copy the current URL to share a join link - see
showRemoteEntry, which reads it back out on the receiving end.</p>
</dd>
<dt><a href="#remoteListener">remoteListener(e, target)</a></dt>
<dd><p>The Online Multiplayer tile, its host/join form, and the waiting room it leads to. Room/presence only - actual
gameplay over the socket is a separate, later piece.</p>
</dd>
<dt><a href="#presetListener">presetListener(e, target)</a></dt>
<dd><p>The game types on the entry screen. Each reveals the lobby for that type (see showLobby). Back hides the lobby
again. Presets (and Back) are told apart by their class names, so one listener handles all of them.</p>
</dd>
<dt><a href="#playerColour">playerColour(index)</a></dt>
<dd><p>The colour for the player at this position in the game.</p>
</dd>
<dt><a href="#playAgain">playAgain(e, button)</a></dt>
<dd><p>Play again with the same settings as the game that just ended: the same humans, robots, who goes first, and hint
setting. Only the settings carry over, not the fleets or the board state - a new game still places its ships,
for multiplayer same as the first time.</p>
</dd>
<dt><a href="#placementListener">placementListener(e, target)</a></dt>
<dd><p>The placement buttons: Continue (after the handoff), Randomise, and Done. They are told apart by class name.</p>
</dd>
<dt><a href="#setBadge">setBadge(player, text)</a></dt>
<dd><p>The label above a player&#39;s board, which shows their place in the order.</p>
</dd>
<dt><a href="#nameInput">nameInput()</a></dt>
<dd><p>The name field on the placement panel.</p>
</dd>
<dt><a href="#readName">readName(session, player)</a></dt>
<dd><p>Save the name typed for a player, if one was typed. The default name (Player N) is kept otherwise.</p>
</dd>
<dt><a href="#isPlacing">isPlacing()</a></dt>
<dd><p>Whether a placement phase is running for this item&#39;s game, so board clicks are placements rather than attacks.</p>
</dd>
<dt><a href="#startPlacement">startPlacement(players, body, done)</a></dt>
<dd><p>Show the panel and start with the first human&#39;s handoff. <code>done</code> runs once the round is ready to start, with the order
the players will take turns in. With several players that order is chosen here; otherwise it is the seat order.</p>
</dd>
<dt><a href="#setStatsShown">setStatsShown(players, shown)</a></dt>
<dd><p>Show or hide every player&#39;s stats (health, and the hint checkbox), which are not wanted during placement.</p>
</dd>
<dt><a href="#showOnly">showOnly(session, player)</a></dt>
<dd><p>Show only this player&#39;s board, or with null hide every board.</p>
</dd>
<dt><a href="#showAll">showAll()</a></dt>
<dd><p>Show every board, so the players can see and click each other&#39;s.</p>
</dd>
<dt><a href="#continueTurn">continueTurn(item)</a></dt>
<dd><p>Continue: from a handoff it starts that player&#39;s placement; from the ready screen it starts the round.</p>
</dd>
<dt><a href="#showStart">showStart(session, point, size)</a></dt>
<dd><p>Show where a ship has started, and the cells it could end on: every cell in a straight line from the start which would
be a valid placement. Clicking the start again, or any other cell which is not valid, cancels the start. With no start
(null) every mark is removed.</p>
</dd>
<dt><a href="#endCount">endCount(session, start, size)</a></dt>
<dd><p>The number of cells a ship of this size could end on from the start, so the message can say when there are none.</p>
</dd>
<dt><a href="#placeCell">placeCell(tile, board)</a></dt>
<dd><p>A click on a board: during placement, the first click sets where a ship starts and the second where it ends (an
invalid second click is refused and the start is forgotten). While the order is being set, a click picks that player.</p>
</dd>
<dt><a href="#randomise">randomise(item)</a></dt>
<dd><p>Clear the current player&#39;s board, then place their whole fleet at random.</p>
</dd>
<dt><a href="#hideShips">hideShips(player)</a></dt>
<dd><p>Hide a player&#39;s ships again: during placement they are shaded so the player can see them, and in play they must not be.</p>
</dd>
<dt><a href="#showReady">showReady(session)</a></dt>
<dd><p>Every human has placed. With several players, the boards are shown again and they choose who goes first. With one
human, or robots only, the boards are hidden and everyone is asked to confirm. The ships are cleared while no board
is showing, so they cannot be seen fading out.</p>
</dd>
<dt><a href="#chooseOrder">chooseOrder(item)</a></dt>
<dd><p>Set the order by clicking the boards: each click adds that player to the end of the order.</p>
</dd>
<dt><a href="#ordinal">ordinal(place)</a></dt>
<dd><p>The word for a place in the order: 1st, 2nd, 3rd, then 4th and so on.</p>
</dd>
<dt><a href="#pickPlayer">pickPlayer(session, board)</a></dt>
<dd><p>Add a clicked board&#39;s player to the end of the order, and finish once everyone is in it.</p>
</dd>
<dt><a href="#showOrder">showOrder(session)</a></dt>
<dd><p>Show the order which has been set, and wait for Continue to start.</p>
</dd>
<dt><a href="#randomOrder">randomOrder(item)</a></dt>
<dd><p>Random: a short highlight passes over the players, then lands on a full random order.</p>
</dd>
<dt><a href="#shuffle">shuffle(players)</a></dt>
<dd><p>A shuffled copy of the players, in a random order.</p>
</dd>
<dt><a href="#highlightOnly">highlightOnly(session, chosen)</a></dt>
<dd><p>Outline one player&#39;s panel, and clear the outline from the others.</p>
</dd>
<dt><a href="#reorderBoards">reorderBoards(order)</a></dt>
<dd><p>Put the boards in turn order, so the page reads in the order play will go in, and turns follow it. The game&#39;s tree and
the page are both reordered: moving a panel with json-dom would detach it from the page.</p>
</dd>
<dt><a href="#startRound">startRound(session, order)</a></dt>
<dd><p>The round starts: every board and its stats are shown in turn order, and the placement panel goes.</p>
</dd>
<dt><a href="#finishTurn">finishTurn(item)</a></dt>
<dd><p>The player is happy with their fleet: the next human places, or, after the last, everyone is asked to confirm.</p>
</dd>
<dt><a href="#isValidPlacement">isValidPlacement(board, start, end, length)</a></dt>
<dd><p>Whether a ship of this length can go from start to end: a straight horizontal or vertical line of exactly that many
cells, inside the board, and not touching a ship which is already there.</p>
</dd>
<dt><a href="#placeShip">placeShip(board, shipInfo, start, end, view)</a></dt>
<dd><p>Place a ship from the player&#39;s chosen start and end points, if the placement is valid. Returns false if it is not.</p>
</dd>
<dt><a href="#validPlacements">validPlacements(matrix, shipLength)</a></dt>
<dd><p>Every straight, horizontal or vertical, start and end point of a ship of this length which fits on the board without
touching a ship already there. Ships only go along one axis for now (no diagonals, z is always 0); diagonal or 3D
ships, if they come in a later version, would add their own directions here.</p>
</dd>
<dt><a href="#generateStartEnd">generateStartEnd(matrix, shipLength)</a></dt>
<dd><p>Pick a start and end point for a ship of the given length, at random from every placement that fits. Throws if no
placement fits, rather than searching forever.</p>
</dd>
<dt><a href="#generateRandomFleet">generateRandomFleet(ships, matrix, view)</a></dt>
<dd><p>Create a series of randomly placed ships based on the provided shipLengths.
The optional parameter view will set the visibility of the ships.</p>
</dd>
<dt><a href="#getSession">getSession(item)</a></dt>
<dd><p>The session for whichever game <code>item</code> belongs to - any DomItem in that game&#39;s tree, or its root itself, works the
same way. A game gets its own session the first time anything asks for it, and it is garbage-collected along with
its root once nothing else references the game any more - there is nothing to explicitly tear down.</p>
</dd>
<dt><a href="#presetForMode">presetForMode(mode)</a></dt>
<dd><p>The preset for a given game mode, so the lobby can be shown for it without a preset button having been clicked.</p>
</dd>
<dt><a href="#buildShip">buildShip(shipInfo, line, matrix, view)</a></dt>
<dd><p>Generate a ship with the provided line of points.
The visibility of the ship on the board is determined by the view parameter.</p>
</dd>
<dt><a href="#buildPlayers">buildPlayers(humans, root, robots, players)</a></dt>
<dd><p>Create players and associated properties.
Takes an integer for the number of players to generate.
Returns an array of players.
WARNING: This is a recursive function.</p>
</dd>
<dt><a href="#beginRound">beginRound(e, mainForm)</a></dt>
<dd><p>Logic for setting up and starting a new round from the lobby form.</p>
</dd>
<dt><a href="#remainingHitPoints">remainingHitPoints(player)</a></dt>
<dd><p>The hits still needed to sink a player&#39;s unsunk ships: the unhit parts of every ship which is not yet sunk.</p>
</dd>
<dt><a href="#best">best(players, score, highest)</a></dt>
<dd><p>The players with the lowest score, or with the highest when <code>highest</code> is set.</p>
</dd>
<dt><a href="#afloat">afloat(players)</a></dt>
<dd><p>The players still afloat, or everyone when none is.</p>
</dd>
<dt><a href="#eliminationRule">eliminationRule(players)</a></dt>
<dd><p>Elimination first: attack the player with the fewest hits still needed to sink everything they have left, so the
robot knocks them out soonest. Ties are picked at random. This is the rule the game uses.</p>
</dd>
<dt><a href="#hitChanceRule">hitChanceRule(players)</a></dt>
<dd><p>Hit chance first: attack the player whose best cell has the highest chance of holding a ship part. Not used by the game
yet. In simulation it prolongs games, because it favours boards with more ship left, but a game style which scores hits
may want it.</p>
</dd>
<dt><a href="#selectTargetPlayer">selectTargetPlayer(players, rule)</a></dt>
<dd><p>Choose which player to attack, using the rule for the game style (elimination for now).</p>
</dd>
<dt><a href="#selectTargetCoordinate">selectTargetCoordinate(victim)</a></dt>
<dd><p>Choose which coordinate to attack, in layers: the density model first, then the checkerboard over every unattacked
cell. The density scores are shown as a heat map, so the robot&#39;s thinking can be seen before the checkerboard narrows
the choice.</p>
</dd>
<dt><a href="#shade">shade(intensity)</a></dt>
<dd><p>A faint yellow for the weakest cells up to a solid one for the strongest, so the spread of the robot&#39;s thinking shows.</p>
</dd>
<dt><a href="#paint">paint(victim, point, color)</a></dt>
<dd></dd>
<dt><a href="#resetTargets">resetTargets(data)</a></dt>
<dd></dd>
<dt><a href="#outlineBoard">outlineBoard(player, color)</a></dt>
<dd><p>Colour every row of a player&#39;s board, which is how a whole board is outlined.</p>
</dd>
<dt><a href="#displayTargets">displayTargets(cells, target, victim, opponents)</a></dt>
<dd><p>The stages of the robot&#39;s thinking, shown in turn: the boards it is choosing between, the chosen board, the cells it
weighs, then the cell it picks at random. The shot itself comes after the last stage (see computerAttack).</p>
</dd>
<dt><a href="#clearTargets">clearTargets(victim, opponents)</a></dt>
<dd><p>Take the display away once the robot has chosen: the heat map and every board outline.</p>
</dd>
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
<dd><p>The density model&#39;s picture of the board: every unattacked cell with a score, shaded by how far it is from the top
score (<code>heat</code>, for display), and the cells the robot chooses from (<code>targets</code>: the highest, narrowed to the
checkerboard among them). <code>targets</code> is never empty while a ship remains.</p>
</dd>
<dt><a href="#densityTargets">densityTargets(victim)</a></dt>
<dd><p>The attack points the density model considers most likely to hold a ship part, or an empty array when there is none.</p>
</dd>
<dt><a href="#bestHitChance">bestHitChance(victim)</a></dt>
<dd><p>The best chance that a shot at this player&#39;s board hits a ship: the highest per-cell hit chance.</p>
</dd>
<dt><a href="#consistent">consistent(placement, shipHitKeys, missKeys, hitKeys)</a></dt>
<dd><p>Whether a placement could be where a ship really is: it avoids misses, covers all of the ship&#39;s own known hits, and
touches no other ship&#39;s hit.</p>
</dd>
<dt><a href="#scoreTargets">scoreTargets(state, damagedWeight, adjacentWeight)</a></dt>
<dd><p>Score every cell by how many ways the remaining ships could still cover it. Each ship contributes every placement
consistent with what is known: it avoids misses, covers all of its own known hits, and touches no other ship&#39;s hit.
Cells already attacked score zero. Unattacked cells next to a hit on an unsunk ship then get the adjacent weight on top.</p>
</dd>
<dt><a href="#bestTargets">bestTargets(scores)</a></dt>
<dd><p>The unattacked cells which have the highest score. Empty when no score is above zero.</p>
</dd>
<dt><a href="#hitChances">hitChances(state, damagedWeight)</a></dt>
<dd><p>The chance that each unattacked cell holds a part of some remaining ship. Each ship&#39;s placements are weighted as in
scoreTargets, then turned into a share of that ship&#39;s total, so a ship counts once however many placements it has.
Not used by the game&#39;s robot yet: it is kept for game styles where the chance of a hit matters more than elimination.</p>
</dd>
<dt><a href="#computerAttack">computerAttack(player, players)</a></dt>
<dd><p>Main AI logic for computer to attack, selects a target then performs attack function.</p>
</dd>
<dt><a href="#clearChildren">clearChildren()</a></dt>
<dd><p>Remove every one of a parent&#39;s children - the same pattern startNewGame&#39;s clearBody uses locally.</p>
</dd>
<dt><a href="#deadlineOf">deadlineOf()</a></dt>
<dd><p>The placement deadline a pushed body carries, if placement is still running.</p>
</dd>
<dt><a href="#isGameOver">isGameOver()</a></dt>
<dd><p>Whether a pushed body is the final-score screen (see remoteFinalScore.ts) - the one point in a remote
game&#39;s own lifecycle where forwarding has to come back off, so its Play Again button&#39;s click runs as a real
local listener instead of being forwarded into a game that is already over.</p>
</dd>
<dt><a href="#ensureCountdownElement">ensureCountdownElement()</a></dt>
<dd><p>Create the countdown element if there is not already a live one in the page - not just a non-null reference:
something else clearing the page for a fresh game (without going through leaveRemoteGame) can detach the old
one from the document while this module&#39;s own reference to it lives on.</p>
</dd>
<dt><a href="#setCountdownDeadline">setCountdownDeadline()</a></dt>
<dd><p>Start, update, or stop the visual countdown, as each new deadline (or its absence) comes in.</p>
</dd>
<dt><a href="#stopCountdown">stopCountdown()</a></dt>
<dd><p>Remove the countdown entirely - called once the remote game is left.</p>
</dd>
<dt><a href="#renderInto">renderInto(root, redactedBody)</a></dt>
<dd><p>Replace the root&#39;s own body content with a freshly-inflated redacted body&#39;s children, rendered directly as the
body&#39;s own children - not nested one level deeper under some other wrapper - so a path captured from this tree
(getItemPath) and one resolved against the server&#39;s own root (getItemByPath) agree: both are root -&gt; body -&gt;
[boards, placement panel], the exact shape redactGameBody sends.</p>
</dd>
<dt><a href="#stopForwarding">stopForwarding()</a></dt>
<dd><p>Stop forwarding (and the countdown, which can&#39;t be running once the game has ended anyway) without touching
whatever is currently rendered - used once the game is actually over, so the final score screen&#39;s own Play
Again button (already rendered by the same push that triggered this) resolves to a real local listener on
its next click instead of being forwarded into a game that no longer exists.</p>
</dd>
<dt><a href="#enterRemoteGame">enterRemoteGame(root, firstUpdate)</a></dt>
<dd><p>Start rendering and interacting with a remote game, reusing the app&#39;s own existing root rather than a second
one (a second documentDomItem() would claim the same real document.head/body the app&#39;s own root already has -
exactly the collision the server&#39;s own per-room roots had to avoid, see server/gameplay.ts). Every click/change
on the rendered tree is forwarded to the server instead of run locally (setForwardEvents) - the server&#39;s own
receiveForwardedEvent resolves and dispatches it, and the resulting gameUpdate re-renders this same tree fresh.
Leaving the lobby&#39;s own listeners (presetListener, remoteListener, ...) alone is safe because the lobby&#39;s own
markup is no longer in the tree by the time this runs - clearChildren above already removed it.</p>
<p>Forwarding comes back off once the game actually ends (see isGameOver/stopForwarding) - the final-score
screen&#39;s own Play Again button needs to run as a real local listener, not a forwarded one - and back on
again for whatever the next gameUpdate turns out to be once Play Again succeeds and a fresh game starts.</p>
</dd>
<dt><a href="#leaveRemoteGame">leaveRemoteGame()</a></dt>
<dd><p>Stop forwarding and clear whatever the remote game last rendered, so the root can go back to running locally.</p>
</dd>
<dt><a href="#redactBoard">redactBoard(board, ownBoard)</a></dt>
<dd><p>A redacted clone of a board: every tile is kept (same count, same tree position - nothing is removed, so it
stays renderable and clickable exactly like a local board), but hasShip is set to false on any tile that is
neither hit nor on the viewer&#39;s own board. Which cells to redact is read from the real board, matching the
rule the robot&#39;s own targeting already follows (see robot/densityTargets.ts&#39;s buildShotState), generalized
from &quot;what the AI may read&quot; to &quot;what a remote viewer may be sent&quot; - only the hidden tiles&#39; hasShip is mutated
on the clone.</p>
<p>setViewShip (src/cells/setViewShip.ts) also bakes a grey <code>backgroundColor</code> directly onto a ship tile&#39;s own
<code>attributes.style</code> the moment it is placed - meant for local play, where seeing your own ship as you place it
is the point. That baked style survives this clone untouched unless cleared here too, which would leak every
unhit ship&#39;s exact position through the rendered colour even with hasShip correctly hidden - clearing it only
for the same cells hasShip is cleared for keeps a legitimate hit&#39;s own red/white colouring (set afterwards by
colourHitCell, both colours equally public) untouched.</p>
</dd>
<dt><a href="#redactShip">redactShip(ship)</a></dt>
<dd><p>A ship, reduced to what is always public: its name, length and status - never its parts&#39; positions. parts is
kept as an array of the right length (playerStats reads parts.length), but its entries are placeholders - a
ship&#39;s parts are the same Tile objects the board holds, so leaving them as-is on a redacted clone would leak
exact ship position through this second path even with the board&#39;s own tiles correctly redacted.</p>
</dd>
<dt><a href="#classNameOf">classNameOf()</a></dt>
<dd><p>The class name of an item, if it has one - the same lightweight check used throughout this file.</p>
</dd>
<dt><a href="#disableControls">disableControls(panel)</a></dt>
<dd><p>A clone of a panel with every one of its own controls (anything but its message, which is never secret - ship
sizes are public fleet knowledge, only position is hidden) disabled - used for a remote placement/ordering
panel that is not this viewer&#39;s own to interact with. Builds a new object rather than mutating the given one,
since it is already part of an outer clone (redactPlayer/redactGameBody) that must stay independent of the
real tree.</p>
</dd>
<dt><a href="#redactPlayer">redactPlayer(player, viewer)</a></dt>
<dd><p>One player, redacted for a given viewer: a clone of the real player, with its board and fleet redacted per
redactBoard/redactShip, and (for a remote game) its own placement panel disabled unless this is that player&#39;s
own viewer. Everything else (name, colour, robot/human, overall status, whose turn it is, playerStats -
already public, see redactShip) passes through unchanged. children is kept in step with whichever of its own
entries changed, by index, rather than assumed to always be exactly [turn-badge, board, stats] - a remote
game&#39;s own fourth child (its placement panel) would otherwise silently be dropped.</p>
</dd>
<dt><a href="#redactGameState">redactGameState(players, viewer)</a></dt>
<dd><p>The whole game, redacted for one viewer: every player, each with their own board redacted according to whether
<code>viewer</code> owns it. This is what is safe to send to a remote client for <code>viewer</code>&#39;s own connection - it contains
nothing about any board&#39;s hidden ship positions except the viewer&#39;s own, and - unlike a flat data snapshot -
it is still a real, renderable, clickable DomItem tree: a remote client can inflate and render it with the
exact same components local play already uses, and forward its clicks the same way.</p>
</dd>
<dt><a href="#redactGameBody">redactGameBody(body, players, viewer)</a></dt>
<dd><p>A whole screen&#39;s worth of game state, redacted for one viewer - the boards wrapper&#39;s own children replaced with
redactGameState&#39;s result, and (for a remote game) the global ordering panel&#39;s own Random/Set order controls,
and the final-score screen&#39;s own Play Again button, both disabled for anyone but the host - players[0] is
always the room&#39;s host for as long as any game of theirs is running (the host is always the first to join a
room, and the whole room closes if they ever leave, so this holds without needing to thread a separate host
id through here). Everything else (the robots-only show-all-ships control, if present) is kept as is, since
none of it carries anything secret. This is what a remote client actually renders and interacts with: the
exact same markup local play already uses, inflated from this instead of built fresh.</p>
</dd>
<dt><a href="#connectLobbySocket">connectLobbySocket(url)</a></dt>
<dd><p>The lobby socket, connecting on first use. A test can connect it to its own ephemeral server before triggering any
UI action, by calling this directly with that server&#39;s URL - the UI&#39;s own calls below then reuse that connection.</p>
</dd>
<dt><a href="#disconnectLobbySocket">disconnectLobbySocket()</a></dt>
<dd><p>Close the lobby socket and forget it, so the next connectLobbySocket call starts fresh.</p>
</dd>
<dt><a href="#createRoom">createRoom()</a></dt>
<dd><p>Create a room as its host, resolving with the room&#39;s state once the server acknowledges it, or an error.</p>
</dd>
<dt><a href="#joinRoom">joinRoom()</a></dt>
<dd><p>Join an existing room by its code, resolving with the room&#39;s state, or an error if it could not be joined.</p>
</dd>
<dt><a href="#onRoomUpdate">onRoomUpdate()</a></dt>
<dd><p>Be told whenever the room&#39;s state changes (a player joins or leaves).</p>
</dd>
<dt><a href="#onRoomClosed">onRoomClosed()</a></dt>
<dd><p>Be told if the host leaves, closing the room for everyone still in it.</p>
</dd>
<dt><a href="#getSocketId">getSocketId()</a></dt>
<dd><p>This connection&#39;s own socket id, once connected - used to tell whether this player is the room&#39;s host.</p>
</dd>
<dt><a href="#startGame">startGame()</a></dt>
<dd><p>The host starts the game: every connected player becomes a human player, in the room&#39;s own join order.</p>
</dd>
<dt><a href="#onGameUpdate">onGameUpdate()</a></dt>
<dd><p>Be told whenever the game&#39;s state changes - the redacted view of the whole screen, for this connection alone.</p>
</dd>
<dt><a href="#sendGameAction">sendGameAction()</a></dt>
<dd><p>Forward a user interaction to the server instead of running its listener locally - see setForwardEvents.</p>
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
<dt><a href="#playerStats">playerStats(player, status, item)</a></dt>
<dd><p>The defined attributes for each player. The name and status run across the top; the player&#39;s checkboxes are stacked
on the left, and the ship list is on the right.</p>
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
<dt><a href="#showShipsControl">showShipsControl()</a></dt>
<dd><p>The one control for the robots-only game: a single checkbox to show every ship on every board, rather than one per
board. It sits above the boards.</p>
</dd>
<dt><a href="#remotePlacementPanel">remotePlacementPanel()</a></dt>
<dd><p>Each player&#39;s own placement controls, rendered as part of their own subtree (not one shared panel at the body
level, like local hot-seat&#39;s placementPanel) - so every connected player places their own ships on their own
board whenever they want, with no &quot;look away&quot; handoff. Redacted per viewer (see redactGameState.ts): only the
owning player&#39;s own copy is ever enabled - everyone else&#39;s is always disabled, showing only ready/not-ready.</p>
</dd>
<dt><a href="#remoteOrderingPanel">remoteOrderingPanel()</a></dt>
<dd><p>How the turn order is decided once every player has placed: the host picks Random or Set order (clicking each
player&#39;s board in turn); everyone else sees the exact same status message, with no controls of their own.
Enforced server-side (see server/lobbyServer.ts&#39;s gameAction handler, which rejects a non-host&#39;s action during
any stage but placing), not just by these buttons being disabled on a non-host&#39;s own redacted copy.</p>
</dd>
<dt><a href="#remoteFinalScore">remoteFinalScore(players)</a></dt>
<dd><p>The final score screen for a remote room&#39;s game: the same public score cards local hot-seat shows (see
finalScore.ts), plus a single host-only Play Again button (see remotePlayAgainListener.ts) - disabled on a
non-host&#39;s own redacted copy, same as the ordering panel (see redactGameState.ts). Change Settings and Main
Menu/leave-the-room are still not built - both assume one physical screen controlling the whole shared game,
which does not hold for several independent remote clients, and restarting with different settings or
leaving the room are each their own, separate feature.</p>
</dd>
<dt><a href="#placementPanel">placementPanel(message)</a></dt>
<dd><p>The panel shown during the placement phase: a message for whoever is placing, and their buttons. Each button has one
class name, which is how the layer finds it and how one listener tells them apart (see placementListener).</p>
</dd>
<dt><a href="#mainMenu">mainMenu()</a></dt>
<dd><p>The entry screen. It shows the game types (presets) first. Choosing one reveals the lobby, which is the form for the
game: how many humans and robots, the hint setting, and who goes first. Start in the lobby submits the form, as before.</p>
</dd>
<dt><a href="#finalScore">finalScore(players)</a></dt>
<dd><p>Display the final scores after a game has ended, with three ways to go on: Play Again (same settings,
places ships again), Change Settings (back to the lobby, pre-filled with this game&#39;s settings), and Main Menu
(back to choosing the game type).</p>
</dd>
<dt><a href="#boards">boards(players)</a></dt>
<dd><p>Wrapper div for player data / boards</p>
</dd>
<dt><a href="#update3dCell">update3dCell(config, matrix, x, y, z, isRobot)</a></dt>
<dd><p>Given a cell and new config data, update the data of the cell</p>
</dd>
<dt><a href="#shadeShips">shadeShips(player, shown)</a></dt>
<dd><p>Show or hide a player&#39;s ships on their board. Ships which have been hit keep the colour they were given when hit, so
only the parts not yet hit change.</p>
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
<dt><a href="#markBoard">markBoard(victim, attackable)</a></dt>
<dd><p>Mark the cells of a board which can still be attacked: the ones not yet hit. The class is what the stylesheet uses to
show a target cursor and a highlight when hovered. Tiles keep their own class (&#39;column&#39;), so only this is added.</p>
</dd>
<dt><a href="#showValidTargets">showValidTargets(victim)</a></dt>
<dd><p>Show a human which cells of the board they are attacking can still be hit.</p>
</dd>
<dt><a href="#clearValidTargets">clearValidTargets(victim)</a></dt>
<dd><p>Remove the markers when the turn passes.</p>
</dd>
<dt><a href="#updateScore">updateScore(hitShip, sunkShip, players)</a></dt>
<dd><p>Update all game stats after each player round</p>
</dd>
<dt><a href="#updatePlayerStats">updatePlayerStats(player, status)</a></dt>
<dd></dd>
<dt><a href="#updatePlayer">updatePlayer(player, hitShip, sunkShip)</a></dt>
<dd><p>Track player stats such as attacks and turns</p>
</dd>
<dt><a href="#shipsListener">shipsListener(e, target)</a></dt>
<dd><p>The ship toggles. A player&#39;s own checkbox (one-player game) shows or hides their ships. The all-ships control
(robots-only game) does the same for every board at once.</p>
</dd>
<dt><a href="#hintListener">hintListener(e, target)</a></dt>
<dd><p>The hint checkbox in a human&#39;s panel: switching it on shows the heat map at once if it is their turn.</p>
</dd>
<dt><a href="#victimsOf">victimsOf(player)</a></dt>
<dd><p>The boards a player is attacking: every other player&#39;s board.</p>
</dd>
<dt><a href="#showHeatHint">showHeatHint(victim)</a></dt>
<dd><p>Shade a board&#39;s cells by the robot&#39;s weighting, as a hint to a human about where a ship may be. The weighting only
uses what a player can already see: attacked cells, hit parts and the lengths of unsunk ships.</p>
</dd>
<dt><a href="#clearHeatHint">clearHeatHint(victim)</a></dt>
<dd><p>Put a board&#39;s cells back to their normal border.</p>
</dd>
<dt><a href="#getNextAttacker">getNextAttacker(attacker, players, hitShip)</a></dt>
<dd><p>Based on the current attacker and list of players, return the next attacker.</p>
</dd>
<dt><a href="#findNextAttacker">findNextAttacker(attacker, players, attackerIndex)</a></dt>
<dd></dd>
<dt><a href="#endGame">endGame(winner)</a></dt>
<dd><p>Final state once a game is won (only one player remains). Local hot-seat&#39;s own finalScore screen (Play Again,
Change Settings, Main Menu) assumes one physical screen controlling the whole game - a remote room&#39;s own game
session overrides this via onGameOver (see gameSession.ts, server/gameplay.ts) with something that makes
sense for several independent, already-forwarding clients instead.</p>
</dd>
<dt><a href="#getAttackLock">getAttackLock(item)</a></dt>
<dd><p>Whether attacks are being ignored right now for the given item&#39;s game: the board is locked while the turn changes
over. Shared by the code which starts and ends a turn and the code which takes an attack. Each game has its own
lock (see gameSession), so one game&#39;s turn change never blocks another&#39;s.</p>
</dd>
<dt><a href="#attackListener">attackListener(e, target)</a></dt>
<dd><p>target is the board the listener was attached to (see buildPlayers): a DomItem here, like every listener&#39;s target,
but really always a Board. During the placement phase a click places a ship rather than attacking - local
hot-seat&#39;s own handoff-based placement, or (for a remote game) simultaneous per-player placement/ordering;
exactly one of the two is ever active for a given game, never both.</p>
</dd>
<dt><a href="#attackFleet">attackFleet(target)</a></dt>
<dd><p>Perform attack on an enemy board / cell</p>
</dd>
</dl>

<a name="hasTrait"></a>

## hasTrait
The typed version of json-dom's hasTrait, it narrows an item to the trait it was checked for.

**Kind**: global variable  
<a name="PLACEMENT_TIMEOUT_MS"></a>

## PLACEMENT\_TIMEOUT\_MS
How long players have to finish placing before any still-pending ships are placed at random for them.

**Kind**: global variable  
<a name="lastGameSettings"></a>

## lastGameSettings
The settings the host last actually started a game with - Play Again (see remotePlayAgainListener.ts) has no
settings form of its own, it just reuses whatever the last real game used, the same way local hot-seat's own
playAgain.ts does. Set only from the waiting room's own Start Game click - never read before that happens.

**Kind**: global variable  
<a name="playerColours"></a>

## playerColours
The colour each player is identified by, in the order they are created. They are bright enough to read on the dark
background, and distinct from one another.

**Kind**: global variable  
<a name="defaultShipSpecs"></a>

## defaultShipSpecs
Create a default fleet using the standard battleship lengths.

**Kind**: global variable  

| Param |
| --- |
| matrix | 
| view | 

<a name="STAGE_MS"></a>

## STAGE\_MS
How long each stage of the robot's attack is shown for, in turn.

**Kind**: global variable  
<a name="DAMAGED_WEIGHT"></a>

## DAMAGED\_WEIGHT
Extra weight for placements which explain a ship that is already damaged, relative to a fresh ship.

**Kind**: global variable  
<a name="ADJACENT_WEIGHT"></a>

## ADJACENT\_WEIGHT
Extra weight for an unattacked cell next to a hit on a ship which is not yet sunk, the partial-hit follow-up.

**Kind**: global variable  
<a name="DEFAULT_URL"></a>

## DEFAULT\_URL
No server is deployed yet - this only works against a locally-run lobby server (npm run dev:lobby).

**Kind**: global constant  
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
<a name="queueTimeout"></a>

## queueTimeout(item, fn, time, ...args)
The timed queue the given item's game runs on: steps queued here run one after another, after their delay. Each
game has its own queue (see gameSession), so two games' turn changes, robot attacks, and animations never interleave.

**Kind**: global function  

| Param | Default |
| --- | --- |
| item |  | 
| fn |  | 
| time | <code>0</code> | 
| ...args |  | 

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

<a name="clearBody"></a>

## clearBody(parent)
Remove everything from the page: whatever screen was showing (the menu, a finished game's final scores, or a game
in progress), so a new one can be built on a blank page.

**Kind**: global function  

| Param |
| --- |
| parent | 

<a name="startRound"></a>

## startRound(order, firstGoesFirst)
Pick the first attacker, and let a robot start if it is one.

**Kind**: global function  

| Param | Description |
| --- | --- |
| order |  |
| firstGoesFirst | undefined when the order was chosen, so the first player of it goes first |

<a name="startNewGame"></a>

## startNewGame(parent, humans, robots, firstGoesFirst, hints, placementStarter, onPlayersBuilt)
Build the players, place their ships, and start the round. Shared by beginRound (reading these settings from the
lobby form) and playAgain (reading them from the settings the last game was started with) - either way, this is
the one place a round actually begins. A remote game passes startRemotePlacement (simultaneous per-player
placement, no handoff) in place of the default, and onPlayersBuilt to set each player's real name before
anything is ever rendered or pushed - see server/gameplay.ts. Local play needs neither: a human types their own
name during their own handoff screen (see placement.ts's nameInput), since there is nothing to know upfront.

**Kind**: global function  

| Param |
| --- |
| parent | 
| humans | 
| robots | 
| firstGoesFirst | 
| hints | 
| placementStarter | 
| onPlayersBuilt | 

<a name="startMenu"></a>

## startMenu(parent)
The entry function

**Kind**: global function  

| Param |
| --- |
| parent | 

<a name="update"></a>

## update(item, attributes)
Update an item's attributes in place on the real element.

**Kind**: global function  

| Param |
| --- |
| item | 
| attributes | 

<a name="show"></a>

## show(item, shown)
Show or hide an item by its display style.

**Kind**: global function  

| Param |
| --- |
| item | 
| shown | 

<a name="showLobby"></a>

## showLobby(menu, preset, values)
Show the lobby for a game type, inside an already-rendered main menu: sets its title and field limits from the
preset, fills in the given values (or the preset's own defaults), and reveals it in place of the game types.

**Kind**: global function  

| Param |
| --- |
| menu | 
| preset | 
| values | 

<a name="returnToLobby"></a>

## returnToLobby(e, button)
Back to the lobby, with the settings from the game that just ended already filled in, so they can be changed
before playing again - unlike the main menu button, which goes all the way back to choosing the game type.

**Kind**: global function  

| Param |
| --- |
| e | 
| button | 

<a name="restart"></a>

## restart(e, button)
**Kind**: global function  

| Param |
| --- |
| e | 
| button | 

<a name="remotePlayAgainListener"></a>

## remotePlayAgainListener(e, target)
The final-score screen's Play Again button, for a remote game - host-only (enforced server-side, see
lobbyServer.ts's startGame handler; disabled on a non-host's own redacted copy too, see redactGameState.ts).
Reuses the settings the last real game actually started with (see remoteListener.ts's getLastGameSettings) -
there is no settings form on this screen, same as local hot-seat's own playAgain.ts. This only ever runs
client-side with forwarding already turned off for this exact reason (see remoteGame.ts's enterRemoteGame) -
the server's own copy of this listener name is a trivial stand-in, never meant to actually run.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="remotePlacementListener"></a>

## remotePlacementListener(e, target)
The remote placement/ordering panels' own buttons - each player's Randomise/Ready, and the host-only Random/
Set order. Told apart by class name, same pattern as local placement's own placementListener.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="isRemoteSessionActive"></a>

## isRemoteSessionActive()
Whether a remote placement/ordering phase is running for this item's game - so a board click during it is
routed here instead of to a normal attack (see attackListener.ts).

**Kind**: global function  
<a name="isHostOnlyStage"></a>

## isHostOnlyStage()
Whether only the host may act right now - every stage except placing itself (see server/lobbyServer.ts).

**Kind**: global function  
<a name="renderPanel"></a>

## renderPanel()
Refresh one player's own placement panel to match their current state.

**Kind**: global function  
<a name="showStart"></a>

## showStart()
Mark which cells a ship-in-progress could end on, same visual as local placement's own showStart.

**Kind**: global function  
<a name="startRemotePlacement"></a>

## startRemotePlacement(players, body, done, onTimerChange)
Begin a remote game's placement phase: every human places their own ships on their own board at the same
time - no handoff, no "look away". `done` runs once the order is set, with the order play will take.
`onTimerChange` runs whenever the deadline below actually fires and changes state on its own - every other
state change in this module happens inside a function a dispatched/forwarded click calls directly, which the
server's own broadcast-after-dispatch already covers; the deadline is the one change that happens on a raw
timer with nothing else watching for it, so without this hook a client that lets it expire sees nothing at
all, even though the server's own state has already moved on.

**Kind**: global function  

| Param |
| --- |
| players | 
| body | 
| done | 
| onTimerChange | 

<a name="placeRemoteShip"></a>

## placeRemoteShip(tile, board)
A click on a player's own board during placement: the first click sets where a ship starts, the second where
it ends (an invalid second click is refused and the start is forgotten) - exactly local placement's own
two-click mechanic, just resolved from the clicked board's own owner instead of a shared "current player".

**Kind**: global function  

| Param |
| --- |
| tile | 
| board | 

<a name="pickOrderPlayer"></a>

## pickOrderPlayer()
A click on a player's own board while the order is being set (see beginOrderSet) - adds them to the order.

**Kind**: global function  
<a name="handleRemoteBoardClick"></a>

## handleRemoteBoardClick()
A board click while a remote placement/ordering phase is running - routed by the current stage.

**Kind**: global function  
<a name="beginOrdering"></a>

## beginOrdering()
Once every player is ready (or the timer below fires), hide their panels and show the ordering choice.

**Kind**: global function  
<a name="autoFinishPlacement"></a>

## autoFinishPlacement()
Any player still not ready when the deadline passes has their remaining ships placed for them at random.

**Kind**: global function  
<a name="readyRemotePlayer"></a>

## readyRemotePlayer()
The Ready button: locks a player's own fleet in once nothing is left pending.

**Kind**: global function  
<a name="randomiseRemoteShips"></a>

## randomiseRemoteShips()
The Randomise button: re-rolls just this player's own remaining fleet, same as local placement's own version.

**Kind**: global function  
<a name="beginOrderSet"></a>

## beginOrderSet()
The Set order button: from here, clicking each player's board in turn (see pickOrderPlayer) sets the order.

**Kind**: global function  
<a name="highlightOnly"></a>

## highlightOnly()
Outline one player's panel, and clear the outline from the others - the random order's own shuffle animation.

**Kind**: global function  
<a name="shuffle"></a>

## shuffle()
A shuffled copy of the players, in a random order - identical to local placement's own version.

**Kind**: global function  
<a name="chooseOrderRandom"></a>

## chooseOrderRandom()
The Random button: a short highlight passes over the players, then lands on a full random order.

**Kind**: global function  
<a name="finishOrdering"></a>

## finishOrdering()
The order is set (either way) - show it briefly, then begin the round.

**Kind**: global function  
<a name="getLastGameSettings"></a>

## getLastGameSettings()
The settings the current room's game last actually started with, if any.

**Kind**: global function  
<a name="showRemoteEntry"></a>

## showRemoteEntry()
Show the remote entry form in place of the game-type tiles, optionally with a room code already filled in -
used both by clicking the Online Multiplayer tile and by a shared join link (see main.ts).

**Kind**: global function  
<a name="renderRoomState"></a>

## renderRoomState()
Replace the waiting room's player list, room code and host controls with a freshly-received room state.

**Kind**: global function  
<a name="leaveToPresets"></a>

## leaveToPresets()
Leave whatever room is open and show the game types again, clearing any status message.

**Kind**: global function  
<a name="enterWaitingRoom"></a>

## enterWaitingRoom()
Once a room is created or joined, watch it for changes and show the waiting room. Puts the room's own code in
the address bar too, so the host (or anyone else) can just copy the current URL to share a join link - see
showRemoteEntry, which reads it back out on the receiving end.

**Kind**: global function  
<a name="remoteListener"></a>

## remoteListener(e, target)
The Online Multiplayer tile, its host/join form, and the waiting room it leads to. Room/presence only - actual
gameplay over the socket is a separate, later piece.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="presetListener"></a>

## presetListener(e, target)
The game types on the entry screen. Each reveals the lobby for that type (see showLobby). Back hides the lobby
again. Presets (and Back) are told apart by their class names, so one listener handles all of them.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="playerColour"></a>

## playerColour(index)
The colour for the player at this position in the game.

**Kind**: global function  

| Param |
| --- |
| index | 

<a name="playAgain"></a>

## playAgain(e, button)
Play again with the same settings as the game that just ended: the same humans, robots, who goes first, and hint
setting. Only the settings carry over, not the fleets or the board state - a new game still places its ships,
for multiplayer same as the first time.

**Kind**: global function  

| Param |
| --- |
| e | 
| button | 

<a name="placementListener"></a>

## placementListener(e, target)
The placement buttons: Continue (after the handoff), Randomise, and Done. They are told apart by class name.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="setBadge"></a>

## setBadge(player, text)
The label above a player's board, which shows their place in the order.

**Kind**: global function  

| Param |
| --- |
| player | 
| text | 

<a name="nameInput"></a>

## nameInput()
The name field on the placement panel.

**Kind**: global function  
<a name="readName"></a>

## readName(session, player)
Save the name typed for a player, if one was typed. The default name (Player N) is kept otherwise.

**Kind**: global function  

| Param |
| --- |
| session | 
| player | 

<a name="isPlacing"></a>

## isPlacing()
Whether a placement phase is running for this item's game, so board clicks are placements rather than attacks.

**Kind**: global function  
<a name="startPlacement"></a>

## startPlacement(players, body, done)
Show the panel and start with the first human's handoff. `done` runs once the round is ready to start, with the order
the players will take turns in. With several players that order is chosen here; otherwise it is the seat order.

**Kind**: global function  

| Param |
| --- |
| players | 
| body | 
| done | 

<a name="setStatsShown"></a>

## setStatsShown(players, shown)
Show or hide every player's stats (health, and the hint checkbox), which are not wanted during placement.

**Kind**: global function  

| Param |
| --- |
| players | 
| shown | 

<a name="showOnly"></a>

## showOnly(session, player)
Show only this player's board, or with null hide every board.

**Kind**: global function  

| Param |
| --- |
| session | 
| player | 

<a name="showAll"></a>

## showAll()
Show every board, so the players can see and click each other's.

**Kind**: global function  
<a name="continueTurn"></a>

## continueTurn(item)
Continue: from a handoff it starts that player's placement; from the ready screen it starts the round.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="showStart"></a>

## showStart(session, point, size)
Show where a ship has started, and the cells it could end on: every cell in a straight line from the start which would
be a valid placement. Clicking the start again, or any other cell which is not valid, cancels the start. With no start
(null) every mark is removed.

**Kind**: global function  

| Param |
| --- |
| session | 
| point | 
| size | 

<a name="endCount"></a>

## endCount(session, start, size)
The number of cells a ship of this size could end on from the start, so the message can say when there are none.

**Kind**: global function  

| Param |
| --- |
| session | 
| start | 
| size | 

<a name="placeCell"></a>

## placeCell(tile, board)
A click on a board: during placement, the first click sets where a ship starts and the second where it ends (an
invalid second click is refused and the start is forgotten). While the order is being set, a click picks that player.

**Kind**: global function  

| Param | Description |
| --- | --- |
| tile |  |
| board | the board that was clicked |

<a name="randomise"></a>

## randomise(item)
Clear the current player's board, then place their whole fleet at random.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="hideShips"></a>

## hideShips(player)
Hide a player's ships again: during placement they are shaded so the player can see them, and in play they must not be.

**Kind**: global function  

| Param |
| --- |
| player | 

<a name="showReady"></a>

## showReady(session)
Every human has placed. With several players, the boards are shown again and they choose who goes first. With one
human, or robots only, the boards are hidden and everyone is asked to confirm. The ships are cleared while no board
is showing, so they cannot be seen fading out.

**Kind**: global function  

| Param |
| --- |
| session | 

<a name="chooseOrder"></a>

## chooseOrder(item)
Set the order by clicking the boards: each click adds that player to the end of the order.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="ordinal"></a>

## ordinal(place)
The word for a place in the order: 1st, 2nd, 3rd, then 4th and so on.

**Kind**: global function  

| Param |
| --- |
| place | 

<a name="pickPlayer"></a>

## pickPlayer(session, board)
Add a clicked board's player to the end of the order, and finish once everyone is in it.

**Kind**: global function  

| Param |
| --- |
| session | 
| board | 

<a name="showOrder"></a>

## showOrder(session)
Show the order which has been set, and wait for Continue to start.

**Kind**: global function  

| Param |
| --- |
| session | 

<a name="randomOrder"></a>

## randomOrder(item)
Random: a short highlight passes over the players, then lands on a full random order.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="shuffle"></a>

## shuffle(players)
A shuffled copy of the players, in a random order.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="highlightOnly"></a>

## highlightOnly(session, chosen)
Outline one player's panel, and clear the outline from the others.

**Kind**: global function  

| Param |
| --- |
| session | 
| chosen | 

<a name="reorderBoards"></a>

## reorderBoards(order)
Put the boards in turn order, so the page reads in the order play will go in, and turns follow it. The game's tree and
the page are both reordered: moving a panel with json-dom would detach it from the page.

**Kind**: global function  

| Param |
| --- |
| order | 

<a name="startRound"></a>

## startRound(session, order)
The round starts: every board and its stats are shown in turn order, and the placement panel goes.

**Kind**: global function  

| Param |
| --- |
| session | 
| order | 

<a name="finishTurn"></a>

## finishTurn(item)
The player is happy with their fleet: the next human places, or, after the last, everyone is asked to confirm.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="isValidPlacement"></a>

## isValidPlacement(board, start, end, length)
Whether a ship of this length can go from start to end: a straight horizontal or vertical line of exactly that many
cells, inside the board, and not touching a ship which is already there.

**Kind**: global function  

| Param |
| --- |
| board | 
| start | 
| end | 
| length | 

<a name="placeShip"></a>

## placeShip(board, shipInfo, start, end, view)
Place a ship from the player's chosen start and end points, if the placement is valid. Returns false if it is not.

**Kind**: global function  

| Param | Default |
| --- | --- |
| board |  | 
| shipInfo |  | 
| start |  | 
| end |  | 
| view | <code>true</code> | 

<a name="validPlacements"></a>

## validPlacements(matrix, shipLength)
Every straight, horizontal or vertical, start and end point of a ship of this length which fits on the board without
touching a ship already there. Ships only go along one axis for now (no diagonals, z is always 0); diagonal or 3D
ships, if they come in a later version, would add their own directions here.

**Kind**: global function  

| Param |
| --- |
| matrix | 
| shipLength | 

<a name="generateStartEnd"></a>

## generateStartEnd(matrix, shipLength)
Pick a start and end point for a ship of the given length, at random from every placement that fits. Throws if no
placement fits, rather than searching forever.

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

<a name="getSession"></a>

## getSession(item)
The session for whichever game `item` belongs to - any DomItem in that game's tree, or its root itself, works the
same way. A game gets its own session the first time anything asks for it, and it is garbage-collected along with
its root once nothing else references the game any more - there is nothing to explicitly tear down.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="presetForMode"></a>

## presetForMode(mode)
The preset for a given game mode, so the lobby can be shown for it without a preset button having been clicked.

**Kind**: global function  

| Param |
| --- |
| mode | 

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

## buildPlayers(humans, root, robots, players)
Create players and associated properties.
Takes an integer for the number of players to generate.
Returns an array of players.
WARNING: This is a recursive function.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| humans |  |  |
| root |  | the game's own root, since a player isn't attached to it yet at this point - see playerStats |
| robots | <code>0</code> |  |
| players |  |  |

<a name="beginRound"></a>

## beginRound(e, mainForm)
Logic for setting up and starting a new round from the lobby form.

**Kind**: global function  

| Param |
| --- |
| e | 
| mainForm | 

<a name="remainingHitPoints"></a>

## remainingHitPoints(player)
The hits still needed to sink a player's unsunk ships: the unhit parts of every ship which is not yet sunk.

**Kind**: global function  

| Param |
| --- |
| player | 

<a name="best"></a>

## best(players, score, highest)
The players with the lowest score, or with the highest when `highest` is set.

**Kind**: global function  

| Param | Default |
| --- | --- |
| players |  | 
| score |  | 
| highest | <code>false</code> | 

<a name="afloat"></a>

## afloat(players)
The players still afloat, or everyone when none is.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="eliminationRule"></a>

## eliminationRule(players)
Elimination first: attack the player with the fewest hits still needed to sink everything they have left, so the
robot knocks them out soonest. Ties are picked at random. This is the rule the game uses.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="hitChanceRule"></a>

## hitChanceRule(players)
Hit chance first: attack the player whose best cell has the highest chance of holding a ship part. Not used by the game
yet. In simulation it prolongs games, because it favours boards with more ship left, but a game style which scores hits
may want it.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="selectTargetPlayer"></a>

## selectTargetPlayer(players, rule)
Choose which player to attack, using the rule for the game style (elimination for now).

**Kind**: global function  

| Param |
| --- |
| players | 
| rule | 

<a name="selectTargetCoordinate"></a>

## selectTargetCoordinate(victim)
Choose which coordinate to attack, in layers: the density model first, then the checkerboard over every unattacked
cell. The density scores are shown as a heat map, so the robot's thinking can be seen before the checkerboard narrows
the choice.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="shade"></a>

## shade(intensity)
A faint yellow for the weakest cells up to a solid one for the strongest, so the spread of the robot's thinking shows.

**Kind**: global function  

| Param |
| --- |
| intensity | 

<a name="paint"></a>

## paint(victim, point, color)
**Kind**: global function  

| Param |
| --- |
| victim | 
| point | 
| color | 

<a name="resetTargets"></a>

## resetTargets(data)
**Kind**: global function  

| Param |
| --- |
| data | 

<a name="outlineBoard"></a>

## outlineBoard(player, color)
Colour every row of a player's board, which is how a whole board is outlined.

**Kind**: global function  

| Param |
| --- |
| player | 
| color | 

<a name="displayTargets"></a>

## displayTargets(cells, target, victim, opponents)
The stages of the robot's thinking, shown in turn: the boards it is choosing between, the chosen board, the cells it
weighs, then the cell it picks at random. The shot itself comes after the last stage (see computerAttack).

**Kind**: global function  

| Param |
| --- |
| cells | 
| target | 
| victim | 
| opponents | 

<a name="clearTargets"></a>

## clearTargets(victim, opponents)
Take the display away once the robot has chosen: the heat map and every board outline.

**Kind**: global function  

| Param |
| --- |
| victim | 
| opponents | 

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
The density model's picture of the board: every unattacked cell with a score, shaded by how far it is from the top
score (`heat`, for display), and the cells the robot chooses from (`targets`: the highest, narrowed to the
checkerboard among them). `targets` is never empty while a ship remains.

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

<a name="bestHitChance"></a>

## bestHitChance(victim)
The best chance that a shot at this player's board hits a ship: the highest per-cell hit chance.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="consistent"></a>

## consistent(placement, shipHitKeys, missKeys, hitKeys)
Whether a placement could be where a ship really is: it avoids misses, covers all of the ship's own known hits, and
touches no other ship's hit.

**Kind**: global function  

| Param |
| --- |
| placement | 
| shipHitKeys | 
| missKeys | 
| hitKeys | 

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

<a name="hitChances"></a>

## hitChances(state, damagedWeight)
The chance that each unattacked cell holds a part of some remaining ship. Each ship's placements are weighted as in
scoreTargets, then turned into a share of that ship's total, so a ship counts once however many placements it has.
Not used by the game's robot yet: it is kept for game styles where the chance of a hit matters more than elimination.

**Kind**: global function  

| Param |
| --- |
| state | 
| damagedWeight | 

<a name="computerAttack"></a>

## computerAttack(player, players)
Main AI logic for computer to attack, selects a target then performs attack function.

**Kind**: global function  

| Param |
| --- |
| player | 
| players | 

<a name="clearChildren"></a>

## clearChildren()
Remove every one of a parent's children - the same pattern startNewGame's clearBody uses locally.

**Kind**: global function  
<a name="deadlineOf"></a>

## deadlineOf()
The placement deadline a pushed body carries, if placement is still running.

**Kind**: global function  
<a name="isGameOver"></a>

## isGameOver()
Whether a pushed body is the final-score screen (see remoteFinalScore.ts) - the one point in a remote
game's own lifecycle where forwarding has to come back off, so its Play Again button's click runs as a real
local listener instead of being forwarded into a game that is already over.

**Kind**: global function  
<a name="ensureCountdownElement"></a>

## ensureCountdownElement()
Create the countdown element if there is not already a live one in the page - not just a non-null reference:
something else clearing the page for a fresh game (without going through leaveRemoteGame) can detach the old
one from the document while this module's own reference to it lives on.

**Kind**: global function  
<a name="setCountdownDeadline"></a>

## setCountdownDeadline()
Start, update, or stop the visual countdown, as each new deadline (or its absence) comes in.

**Kind**: global function  
<a name="stopCountdown"></a>

## stopCountdown()
Remove the countdown entirely - called once the remote game is left.

**Kind**: global function  
<a name="renderInto"></a>

## renderInto(root, redactedBody)
Replace the root's own body content with a freshly-inflated redacted body's children, rendered directly as the
body's own children - not nested one level deeper under some other wrapper - so a path captured from this tree
(getItemPath) and one resolved against the server's own root (getItemByPath) agree: both are root -> body ->
[boards, placement panel], the exact shape redactGameBody sends.

**Kind**: global function  

| Param |
| --- |
| root | 
| redactedBody | 

<a name="stopForwarding"></a>

## stopForwarding()
Stop forwarding (and the countdown, which can't be running once the game has ended anyway) without touching
whatever is currently rendered - used once the game is actually over, so the final score screen's own Play
Again button (already rendered by the same push that triggered this) resolves to a real local listener on
its next click instead of being forwarded into a game that no longer exists.

**Kind**: global function  
<a name="enterRemoteGame"></a>

## enterRemoteGame(root, firstUpdate)
Start rendering and interacting with a remote game, reusing the app's own existing root rather than a second
one (a second documentDomItem() would claim the same real document.head/body the app's own root already has -
exactly the collision the server's own per-room roots had to avoid, see server/gameplay.ts). Every click/change
on the rendered tree is forwarded to the server instead of run locally (setForwardEvents) - the server's own
receiveForwardedEvent resolves and dispatches it, and the resulting gameUpdate re-renders this same tree fresh.
Leaving the lobby's own listeners (presetListener, remoteListener, ...) alone is safe because the lobby's own
markup is no longer in the tree by the time this runs - clearChildren above already removed it.

Forwarding comes back off once the game actually ends (see isGameOver/stopForwarding) - the final-score
screen's own Play Again button needs to run as a real local listener, not a forwarded one - and back on
again for whatever the next gameUpdate turns out to be once Play Again succeeds and a fresh game starts.

**Kind**: global function  

| Param | Description |
| --- | --- |
| root |  |
| firstUpdate | the redacted body already received (the game has already started by the time this is called) |

<a name="leaveRemoteGame"></a>

## leaveRemoteGame()
Stop forwarding and clear whatever the remote game last rendered, so the root can go back to running locally.

**Kind**: global function  
<a name="redactBoard"></a>

## redactBoard(board, ownBoard)
A redacted clone of a board: every tile is kept (same count, same tree position - nothing is removed, so it
stays renderable and clickable exactly like a local board), but hasShip is set to false on any tile that is
neither hit nor on the viewer's own board. Which cells to redact is read from the real board, matching the
rule the robot's own targeting already follows (see robot/densityTargets.ts's buildShotState), generalized
from "what the AI may read" to "what a remote viewer may be sent" - only the hidden tiles' hasShip is mutated
on the clone.

setViewShip (src/cells/setViewShip.ts) also bakes a grey `backgroundColor` directly onto a ship tile's own
`attributes.style` the moment it is placed - meant for local play, where seeing your own ship as you place it
is the point. That baked style survives this clone untouched unless cleared here too, which would leak every
unhit ship's exact position through the rendered colour even with hasShip correctly hidden - clearing it only
for the same cells hasShip is cleared for keeps a legitimate hit's own red/white colouring (set afterwards by
colourHitCell, both colours equally public) untouched.

**Kind**: global function  

| Param | Description |
| --- | --- |
| board |  |
| ownBoard | whether the viewer this is being redacted for owns this board |

<a name="redactShip"></a>

## redactShip(ship)
A ship, reduced to what is always public: its name, length and status - never its parts' positions. parts is
kept as an array of the right length (playerStats reads parts.length), but its entries are placeholders - a
ship's parts are the same Tile objects the board holds, so leaving them as-is on a redacted clone would leak
exact ship position through this second path even with the board's own tiles correctly redacted.

**Kind**: global function  

| Param |
| --- |
| ship | 

<a name="classNameOf"></a>

## classNameOf()
The class name of an item, if it has one - the same lightweight check used throughout this file.

**Kind**: global function  
<a name="disableControls"></a>

## disableControls(panel)
A clone of a panel with every one of its own controls (anything but its message, which is never secret - ship
sizes are public fleet knowledge, only position is hidden) disabled - used for a remote placement/ordering
panel that is not this viewer's own to interact with. Builds a new object rather than mutating the given one,
since it is already part of an outer clone (redactPlayer/redactGameBody) that must stay independent of the
real tree.

**Kind**: global function  

| Param |
| --- |
| panel | 

<a name="redactPlayer"></a>

## redactPlayer(player, viewer)
One player, redacted for a given viewer: a clone of the real player, with its board and fleet redacted per
redactBoard/redactShip, and (for a remote game) its own placement panel disabled unless this is that player's
own viewer. Everything else (name, colour, robot/human, overall status, whose turn it is, playerStats -
already public, see redactShip) passes through unchanged. children is kept in step with whichever of its own
entries changed, by index, rather than assumed to always be exactly [turn-badge, board, stats] - a remote
game's own fourth child (its placement panel) would otherwise silently be dropped.

**Kind**: global function  

| Param |
| --- |
| player | 
| viewer | 

<a name="redactGameState"></a>

## redactGameState(players, viewer)
The whole game, redacted for one viewer: every player, each with their own board redacted according to whether
`viewer` owns it. This is what is safe to send to a remote client for `viewer`'s own connection - it contains
nothing about any board's hidden ship positions except the viewer's own, and - unlike a flat data snapshot -
it is still a real, renderable, clickable DomItem tree: a remote client can inflate and render it with the
exact same components local play already uses, and forward its clicks the same way.

**Kind**: global function  

| Param |
| --- |
| players | 
| viewer | 

<a name="redactGameBody"></a>

## redactGameBody(body, players, viewer)
A whole screen's worth of game state, redacted for one viewer - the boards wrapper's own children replaced with
redactGameState's result, and (for a remote game) the global ordering panel's own Random/Set order controls,
and the final-score screen's own Play Again button, both disabled for anyone but the host - players[0] is
always the room's host for as long as any game of theirs is running (the host is always the first to join a
room, and the whole room closes if they ever leave, so this holds without needing to thread a separate host
id through here). Everything else (the robots-only show-all-ships control, if present) is kept as is, since
none of it carries anything secret. This is what a remote client actually renders and interacts with: the
exact same markup local play already uses, inflated from this instead of built fresh.

**Kind**: global function  

| Param |
| --- |
| body | 
| players | 
| viewer | 

<a name="connectLobbySocket"></a>

## connectLobbySocket(url)
The lobby socket, connecting on first use. A test can connect it to its own ephemeral server before triggering any
UI action, by calling this directly with that server's URL - the UI's own calls below then reuse that connection.

**Kind**: global function  

| Param |
| --- |
| url | 

<a name="disconnectLobbySocket"></a>

## disconnectLobbySocket()
Close the lobby socket and forget it, so the next connectLobbySocket call starts fresh.

**Kind**: global function  
<a name="createRoom"></a>

## createRoom()
Create a room as its host, resolving with the room's state once the server acknowledges it, or an error.

**Kind**: global function  
<a name="joinRoom"></a>

## joinRoom()
Join an existing room by its code, resolving with the room's state, or an error if it could not be joined.

**Kind**: global function  
<a name="onRoomUpdate"></a>

## onRoomUpdate()
Be told whenever the room's state changes (a player joins or leaves).

**Kind**: global function  
<a name="onRoomClosed"></a>

## onRoomClosed()
Be told if the host leaves, closing the room for everyone still in it.

**Kind**: global function  
<a name="getSocketId"></a>

## getSocketId()
This connection's own socket id, once connected - used to tell whether this player is the room's host.

**Kind**: global function  
<a name="startGame"></a>

## startGame()
The host starts the game: every connected player becomes a human player, in the room's own join order.

**Kind**: global function  
<a name="onGameUpdate"></a>

## onGameUpdate()
Be told whenever the game's state changes - the redacted view of the whole screen, for this connection alone.

**Kind**: global function  
<a name="sendGameAction"></a>

## sendGameAction()
Forward a user interaction to the server instead of running its listener locally - see setForwardEvents.

**Kind**: global function  
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

## playerStats(player, status, item)
The defined attributes for each player. The name and status run across the top; the player's checkboxes are stacked
on the left, and the ship list is on the right.

**Kind**: global function  

| Param | Description |
| --- | --- |
| player |  |
| status |  |
| item | any item already attached to the game's root, to read its settings from - defaults to player, which works once the player is rendered, but not for the first call from buildPlayers (before anything is attached) |

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
<a name="showShipsControl"></a>

## showShipsControl()
The one control for the robots-only game: a single checkbox to show every ship on every board, rather than one per
board. It sits above the boards.

**Kind**: global function  
<a name="remotePlacementPanel"></a>

## remotePlacementPanel()
Each player's own placement controls, rendered as part of their own subtree (not one shared panel at the body
level, like local hot-seat's placementPanel) - so every connected player places their own ships on their own
board whenever they want, with no "look away" handoff. Redacted per viewer (see redactGameState.ts): only the
owning player's own copy is ever enabled - everyone else's is always disabled, showing only ready/not-ready.

**Kind**: global function  
<a name="remoteOrderingPanel"></a>

## remoteOrderingPanel()
How the turn order is decided once every player has placed: the host picks Random or Set order (clicking each
player's board in turn); everyone else sees the exact same status message, with no controls of their own.
Enforced server-side (see server/lobbyServer.ts's gameAction handler, which rejects a non-host's action during
any stage but placing), not just by these buttons being disabled on a non-host's own redacted copy.

**Kind**: global function  
<a name="remoteFinalScore"></a>

## remoteFinalScore(players)
The final score screen for a remote room's game: the same public score cards local hot-seat shows (see
finalScore.ts), plus a single host-only Play Again button (see remotePlayAgainListener.ts) - disabled on a
non-host's own redacted copy, same as the ordering panel (see redactGameState.ts). Change Settings and Main
Menu/leave-the-room are still not built - both assume one physical screen controlling the whole shared game,
which does not hold for several independent remote clients, and restarting with different settings or
leaving the room are each their own, separate feature.

**Kind**: global function  

| Param |
| --- |
| players | 

<a name="placementPanel"></a>

## placementPanel(message)
The panel shown during the placement phase: a message for whoever is placing, and their buttons. Each button has one
class name, which is how the layer finds it and how one listener tells them apart (see placementListener).

**Kind**: global function  

| Param |
| --- |
| message | 

<a name="mainMenu"></a>

## mainMenu()
The entry screen. It shows the game types (presets) first. Choosing one reveals the lobby, which is the form for the
game: how many humans and robots, the hint setting, and who goes first. Start in the lobby submits the form, as before.

**Kind**: global function  
<a name="finalScore"></a>

## finalScore(players)
Display the final scores after a game has ended, with three ways to go on: Play Again (same settings,
places ships again), Change Settings (back to the lobby, pre-filled with this game's settings), and Main Menu
(back to choosing the game type).

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

<a name="shadeShips"></a>

## shadeShips(player, shown)
Show or hide a player's ships on their board. Ships which have been hit keep the colour they were given when hit, so
only the parts not yet hit change.

**Kind**: global function  

| Param |
| --- |
| player | 
| shown | 

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

<a name="markBoard"></a>

## markBoard(victim, attackable)
Mark the cells of a board which can still be attacked: the ones not yet hit. The class is what the stylesheet uses to
show a target cursor and a highlight when hovered. Tiles keep their own class ('column'), so only this is added.

**Kind**: global function  

| Param |
| --- |
| victim | 
| attackable | 

<a name="showValidTargets"></a>

## showValidTargets(victim)
Show a human which cells of the board they are attacking can still be hit.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="clearValidTargets"></a>

## clearValidTargets(victim)
Remove the markers when the turn passes.

**Kind**: global function  

| Param |
| --- |
| victim | 

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

<a name="shipsListener"></a>

## shipsListener(e, target)
The ship toggles. A player's own checkbox (one-player game) shows or hides their ships. The all-ships control
(robots-only game) does the same for every board at once.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="hintListener"></a>

## hintListener(e, target)
The hint checkbox in a human's panel: switching it on shows the heat map at once if it is their turn.

**Kind**: global function  

| Param |
| --- |
| e | 
| target | 

<a name="victimsOf"></a>

## victimsOf(player)
The boards a player is attacking: every other player's board.

**Kind**: global function  

| Param |
| --- |
| player | 

<a name="showHeatHint"></a>

## showHeatHint(victim)
Shade a board's cells by the robot's weighting, as a hint to a human about where a ship may be. The weighting only
uses what a player can already see: attacked cells, hit parts and the lengths of unsunk ships.

**Kind**: global function  

| Param |
| --- |
| victim | 

<a name="clearHeatHint"></a>

## clearHeatHint(victim)
Put a board's cells back to their normal border.

**Kind**: global function  

| Param |
| --- |
| victim | 

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
Final state once a game is won (only one player remains). Local hot-seat's own finalScore screen (Play Again,
Change Settings, Main Menu) assumes one physical screen controlling the whole game - a remote room's own game
session overrides this via onGameOver (see gameSession.ts, server/gameplay.ts) with something that makes
sense for several independent, already-forwarding clients instead.

**Kind**: global function  

| Param |
| --- |
| winner | 

<a name="getAttackLock"></a>

## getAttackLock(item)
Whether attacks are being ignored right now for the given item's game: the board is locked while the turn changes
over. Shared by the code which starts and ends a turn and the code which takes an attack. Each game has its own
lock (see gameSession), so one game's turn change never blocks another's.

**Kind**: global function  

| Param |
| --- |
| item | 

<a name="attackListener"></a>

## attackListener(e, target)
target is the board the listener was attached to (see buildPlayers): a DomItem here, like every listener's target,
but really always a Board. During the placement phase a click places a ship rather than attacking - local
hot-seat's own handoff-based placement, or (for a remote game) simultaneous per-player placement/ordering;
exactly one of the two is ever active for a given game, never both.

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

