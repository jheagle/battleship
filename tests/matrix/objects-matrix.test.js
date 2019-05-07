const jDomObjectsMatrix = require('../../src/js/jDom/matrix/objects.js')

// cube
// matrix
// noConflict
// point
// square
it('grid is 1 deep, and 10 by 10', () => {
  const grid = jDomObjectsMatrix.square({}, 10)
  expect(grid.children.length).toBe(1)
  expect(grid.children[0].children.length).toBe(10)
  expect(grid.children[0].children[0].children.length).toBe(10)
})

// tile