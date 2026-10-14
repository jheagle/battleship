module.exports = {
  // 'ws' publishes a "browser" export condition that replaces its real Node implementation with a stub that just
  // throws (browsers can't run a WebSocket server) - Jest's jsdom test environment honors that condition for a
  // bare `require('ws')`, which breaks any test that runs a real socket.io/engine.io server in-process inside a
  // jsdom file. Force the real implementation everywhere, regardless of test environment.
  moduleNameMapper: {
    '^ws$': '<rootDir>/node_modules/ws/index.js'
  }
}
