# battleship

This is just a fun project creating a game of battleship. Experimenting with functional programming and ES6 features.

A relatively recent version is running at https: //joshuaheagle.com/battleship/

## Running locally

Solo, hot-seat and robots-only play are just the static page - nothing to run, open the built page
(e.g. http://battleship.local) in a browser.

Online Multiplayer additionally needs the lobby server running:

```
npm run serve:lobby
```

This compiles and starts `server/lobbyServer.ts` on port 3002 (`src/network/lobbySocket.ts`'s own
`DEFAULT_URL`). The page itself still needs to be served separately (same as local play) - this is
just the socket.io server it talks to for room hosting/joining and the remote game itself.
