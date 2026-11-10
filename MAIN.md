# Cloakfall

Every fleet is cloaked. Fire blind into the dark. The last fleet still hidden wins.

Cloakfall is a hidden-fleet grid game in a dark sector of space: 2 to 4 fleets, any mix of players and robots, in a
free-for-all where the robots hunt each other too. Play it solo against robots, hot-seat on one screen, online with
friends, or just watch the robots play. It is fully keyboard playable (Tab onto a board, arrow keys, Enter to fire) and
screen-reader friendly: every cell is named by its coordinate and what it shows ("B4, miss").

Play it at https://joshuaheagle.com/projects/cloakfall/play.html (docs: https://joshuaheagle.com/projects/cloakfall/docs/).

Built with TypeScript on [json-dom](https://github.com/jheagle/json-dom) (the page as data) and
[matrix-dom](https://github.com/jheagle/matrix-dom) (the grids), with a socket.io lobby server for online play.

*Formerly "Battleship": renamed in November 2026, since that name is Hasbro's trademark. The rules of the classic
pencil-and-paper game are free to use; the name, and Hasbro's own rules text, are not.*

## Running locally

Solo, hot-seat and robots-only play are just the static page - nothing to run, open the built page
(e.g. http://battleship.local, the local vhost's name from before the rename) in a browser.

Online Multiplayer additionally needs the lobby server running:

```
npm run serve:lobby
```

This compiles and starts `server/lobbyServer.ts` on port 3002 (`src/network/lobbySocket.ts`'s own
`DEFAULT_URL`). The page itself still needs to be served separately (same as local play) - this is
just the socket.io server it talks to for room hosting/joining and the remote game itself.
