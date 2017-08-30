'use strict';
(function () {

    /**
     * Create new private reference to the document
     */
    const documentItem = main(documentDOMItem())

    console.log(documentItem);

    //TODO: Create an update system to refresh all the elements with updated attributes / eventListeners / properties.
    //TODO: Synchronise all the DOMItem attributes with any changes on elements if this would ever happen
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
