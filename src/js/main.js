"use strict";
(function() {
  // const curry = (fn) => function curried(...args){ return args.length >= fn.length ? fn(...args) : (a) => curried(...[...args, a]);}
  const curry = (fn) => function curried(...args){
    if (args.length >= fn.length) {
      return fn(...args)
    } else {
      return (a) => curried(...[...args, a]);
    }
  }

  const bTile = {
    hasShip: false,
    isHit: false,
    styles: {
      border: '1px solid #333',
      width: '24px',
      height: '24px',
    }
  }

  const shipTile = {
    hasShip: true,
  }

  const hitTile = {
    isHit: true,
  }

  const fillArray = (a, i, l) => {
    a.push(JSON.parse(JSON.stringify(i))); // create a new version of item so it is not linked by reference
    return (--l > 0 ? fillArray(a, i, l) : a.slice());
  }
  const initArray = (i, l) => fillArray([], i, l);
  const buildArray = curry(initArray)
  const lineContent = buildArray(bTile);
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
  }

  const recurseHtml = (types, matrix, el, depth) => {
    var el = el || {};
    var depth = depth || 0;
    let nextDepth = (i) => nextIndex(types, i);
    if (!(el instanceof window.Element)){
      el = document.createElement(Array.isArray(types[depth]) ? types[depth][types[depth].length - 1] : types[depth]);
      el = recurseHtml(types, matrix, el, nextDepth(depth));
      if (Array.isArray(types[depth])){
        let elem = document.createElement(types[depth][0]);
        elem.appendChild(el);
        return elem;
      }
      return el;
    }
    if (Array.isArray(matrix)){
      matrix.forEach((arr) => {
        el.appendChild(recurseHtml(types, arr, document.createElement(types[depth]), nextDepth(depth)));
      });
      return el;
    }
    el = document.createElement(types[depth])
    if (matrix instanceof Object){
      configureHtml(el, matrix);
    }
    return el;
  }

  const createHtml = (types, matrix) => recurseHtml(types, matrix, {}, 0);
  const generateHtml = curry(createHtml);
  const tableConfig = [['table', 'tbody'], 'tr', 'td'];
  const createTable = generateHtml(tableConfig);

  const updateCell = (matrix, config, x, y) => Object.assign(matrix[y][x], config);
  const update3dCell = (matrix, config, x, y, z) => Object.assign(matrix[y][x][z], config);
  const boardUbdate = (config, x, y) => updateCell(board, config, x, y);
  const alterBoard = curry(boardUbdate);
  alterBoard(shipTile, 2, 3);
  alterBoard(shipTile, 2, 4);
  alterBoard(shipTile, 2, 5);
  alterBoard(shipTile, 2, 6);
  alterBoard(shipTile, 2, 7);
  alterBoard(hitTile, 2, 5);
  alterBoard(hitTile, 3, 5);

  const matrixTable = createTable(board);
  document.body.appendChild(matrixTable);

}());
