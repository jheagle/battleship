let core = require('../src/js/core.js')

const newCore = core.noConflict()
console.log(newCore)
core = {}
console.log(core)
const randomDigit = newCore.randomNumber.noConflict()

core.randomNumber = (i = 0, j = 0, k = 0) => `I am a new function, you gave me the following. i: ${i}, j: ${j}, k: ${k}`

console.log(core.randomNumber(100))
console.log(randomDigit(100))