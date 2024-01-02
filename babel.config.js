<<<<<<< HEAD
const babelConfig = require('js-build-tools/babel.config')
module.exports = babelConfig
=======
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: { version: '3.6', proposals: true }
    }]
  ]
}
>>>>>>> main
