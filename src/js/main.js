"use strict";
(function() {
  const curry = (fn) => function curried(...args){ return args.length >= fn.length ? fn(...args) : (...a) => curried(...[...args, ...a]);}

  const tile = {
    hasShip: false,
    isHit: false,
    styles: {
      border: '1px solid #333',
      width: '24px',
      height: '24px',
    },
    element: {},
  }

  const shipTile = {
    hasShip: true,
  }

  const hitTile = {
    isHit: true,
  }

  const fillArray = (a, i, l) => {
    // create a new version of item so it is not linked by reference
    a = a.slice();
    i = JSON.parse(JSON.stringify(i));
    a.push(i);
    return (--l > 0 ? fillArray(a, i, l) : a);
  }
  const initArray = curry(fillArray);
  const buildArray = initArray([]);
  const lineContent = buildArray(tile);
  const rectMatrix = (x, y) => buildArray(lineContent(x), y);
  const rect3d = (x, y, z) => buildArray(rectMatrix(x, y), z);
  const squareMatrix = (size) => rectMatrix(size, size);
  const cube3d = (size) => rect3d(size, size, size);
  const board = squareMatrix(10);
  const cube = cube3d(10);

  // console.log(matrix);
  // console.log(cube);

  const recurseArray = (array) => Array.isArray(array)? array.map(recurseArray(arr)): array;


  const nextIndex = (a, i) => (i < a.length - 1) ? ++i : a.length - 1;

  const configureHtml = (el, config) => {
    if (config.hasShip){
      el.style['background-color'] = config.isHit? 'red': '#777';
    } else {
      el.style['background-color'] = config.isHit? '#222': 'blue';
    }
    if (Object.keys(config.styles).length){
      Object.keys(config.styles).forEach((styleName) => el.style[styleName] = config.styles[styleName]);
    }
    if (!config.element.length){
      config.element = el;
    }
  }

  const recurseHtml = (types, matrix, depth) => {
    var depth = depth || 0;
    let nextDepth = (i) => nextIndex(types, i);
    if (depth === 0){
      let elems = [];
      if (Array.isArray(types[depth])){
        elems = types[depth].map((elem) => document.createElement(elem));
      }
      matrix.forEach((a) => elems[elems.length - 1].appendChild(recurseHtml(types, a, nextDepth(depth))));
      let prevElem = false;
      elems.forEach((elem) => {
        if (prevElem){
          prevElem.appendChild(elem);
        }
        prevElem = elem;
      });
      return elems[0];
    }
    if (Array.isArray(matrix)){
      let el = document.createElement(types[depth]);
      matrix.forEach((a) => el.appendChild(recurseHtml(types, a, nextDepth(depth))));
      return el;
    }
    let el = document.createElement(types[depth]);
    if (matrix instanceof Object){
      configureHtml(el, matrix);
    }
    return el;
  }

  const createHtml = (types, matrix) => recurseHtml(types, matrix, 0);
  const generateHtml = curry(createHtml);
  const tableConfig = [['table', 'tbody'], 'tr', 'td'];
  const createTable = generateHtml(tableConfig);

  const updateCell = (matrix, config, x, y) => Object.assign(matrix[y][x], config);
  const alterCell = curry(updateCell);
  const update3dCell = (matrix, config, x, y, z) => Object.assign(matrix[y][x][z], config);
  const alter3dCell = curry(update3dCell);
  const updateBoard = alterCell(board);
  const setShip = updateBoard(shipTile);
  const setHit = updateBoard(hitTile);
  setShip(2, 3);
  setShip(2, 4);
  setShip(2, 5);
  setShip(2, 6);
  setShip(2, 7);
  setHit(2, 5);
  setHit(3, 5);

  const matrixTable = createTable(board);

  // console.log(board);
  document.body.appendChild(matrixTable);

}());
