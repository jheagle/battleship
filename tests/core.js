let jDomCore = require('../src/js/core.js')

const newCore = jDomCore.noConflict()
console.log(newCore)
jDomCore = {}
console.log(jDomCore)
const randomDigit = newCore.randomNumber.noConflict()

jDomCore.randomNumber = (i = 0, j = 0, k = 0) => `I am a new function, you gave me the following. i: ${i}, j: ${j}, k: ${k}`

console.log(jDomCore.randomNumber(100))
console.log(randomDigit(100))