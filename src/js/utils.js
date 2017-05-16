"use strict";
// Utility Functions
// const curry = ( func, ...first) => (...second) => func(...first, ...second);
const curry = ( fn ) => function curried( ...args ) {
  return args.length >= fn.length ? fn( ...args ) : ( ...a ) => curried( ...[ ...args, ...a ] );
}

const cloneObject = ( object ) => {
  return JSON.parse( JSON.stringify( object ) );
}

const mergeObjects = ( ...args) => {
  // if (obj instanceof Object){
  //   changes = Object.keys(changes).map((prop) => {
  //     return obj.hasOwnProperty(prop) ? mergeObjects(obj[prop], changes[prop]) : changes[prop];
  //   });
  // }
  return Object.assign({}, ...args);
}
