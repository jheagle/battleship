'use strict';
(function () {

    /**
     * Create new private reference to the document
     */
    const documentItem = main(documentDOMItem())
    console.log(documentItem);
    // let mtrx = bindPointData(cube(mergeObjects(DOMItem(), tile()), 10))
    // console.log(mtrx)
    // console.log(adjacentPoints(point(4, 4, 4), mtrx))
    // console.log(getPointsLine(point(-1, 1, 1), point(1, -1, -1))) // point(-1, 1, 1), point(-1, 0, 1), point(-1, 0, 0), point(-1, -1, 0), point(-1, -1, -1), point(0, -1, -1), point(1, -1, -1)
    // console.log(getPointsLine(point(1, 1, 1), point(-1, 1, -1))) // point(1, 1, 1), point(0, 1, 1), point(0, 1, 0), point(-1, 1, 0), point(-1, 1, -1)
    // console.log(getPointsLine(point(-1, -1, 1), point(1, -1, 1))) // point(-1, -1, 1), point(0, -1, 1), point(1, -1, 1)
    // console.log(getPointsLine(point(1, 0, 0), point(1, 1, -1))) // point(1, 0, 0), point(1, 0, -1), point(1, 1, -1)
    // console.log(getPointsLine(point(-1, 1, 0), point(1, 1, 0))) // point(-1, 1, 0), point(0, 1, 0), point(1, 1, 0)
    // console.log([point(0, 0, 1), point(1, 0, 0), point(-1, 0, -1), point(0, 0, -1)]) // point(-1, 0, -1), point(0, 0, -1), point(-1, 0, -1), point(0, 0, -1)
    // console.log(getPointsLine(point(-1, 1, 1), point(1, -1, -1)).concat(getPointsLine(point(1, 1, 1), point(-1, 1, -1)).concat(getPointsLine(point(-1, -1, 1), point(1, -1, 1)).concat(getPointsLine(point(1, 0, 0), point(1, 1, -1)).concat(getPointsLine(point(-1, 1, 0), point(1, 1, 0)).concat([point(0, 0, 1), point(1, 0, 0), point(1, 0, 1), point(-1, 0, -1), point(0, 0, -1)]))))))


    // samples expanded from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge#new-answer
    // let results = mergeObjects({
    //     a: { a: 1},
    // },{
    //     a: { b: 1},
    // },{
    //     a: { b: 2, c: 1},
    //     b: 2,
    // })
    // console.log(results)
}())
