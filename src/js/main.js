"use strict";
( function () {
  // Utility Functions
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
    return Object.assign(...args);
  }

  const fillArray = ( i, l, a = [] ) => {
    a = a.slice();
    a.push( i );
    return ( --l > 0 ? fillArray( cloneObject( i ), l, a ) : a );
  }

  const buildArray = curry( fillArray );

  const nextIndex = ( a, i ) => ( i < a.length - 1 ) ? ++i : a.length - 1;

  // Utility Objects
  const point = ( x, y ) => ( {
    x: x,
    y: y,
  } );

  const point3d = ( point, z ) => Object.assign( {}, point, {
    z: z
  } );

  const nextCell = ( pnt, dir ) => pnt.z ? {
    x: pnt.x + dir.x,
    y: pnt.y + dir.y,
    z: pnt.z + dir.z,
  } : {
    x: pnt.x + dir.x,
    y: pnt.y + dir.y,
  };

  const locateCells = (matrix, pnt = {}, depth = 0) => {
    if (!Object.keys(pnt).length){
      pnt = point(0, 0);
    }
    if (Array.isArray(matrix)){
      return matrix.map((arr, i) => {
        switch (depth){
          case 0:
            pnt = mergeObjects(pnt, {y: i});
            break;
          case 1:
            pnt = mergeObjects(pnt, {x: i});
            break;
          default:
            pnt = mergeObjects(pnt, {z: i});
        }
        return locateCells(arr, pnt, depth + 1);
      });
    }
    matrix.point = cloneObject(pnt);
    return matrix;
  }

  const configureHtml = ( config ) => {
    if (config.isHit){
      config.styles.backgroundColor = config.hasShip ? 'red' : 'white';
    }
    if ( Object.keys( config.styles ).length ) {
      Object.keys( config.styles ).forEach( ( styleName ) => config.element.style[ styleName ] = config.styles[ styleName ] );
    }
    // if ( Object.keys( config.events ).length ) {
    //   Object.keys( config.events ).forEach( ( eventName ) => {
    //     let args = Object.keys(config.events[ eventName ].args).map((arg) => arg === 'point'? config.point: config.events[ eventName ].args[ arg ]);
    //     console.log(args);
    //     return config.element.addEventListener(eventName, config.events[ eventName ].f(...args) );
    //   });
    // }
    return config;
  }

  const recurseHtml = ( types, matrix, depth = 0 ) => {
    var depth = depth || 0;
    let nextDepth = ( i ) => nextIndex( types, i );
    if ( depth === 0 ) {
      let elems = [];
      if ( Array.isArray( types[ depth ] ) ) {
        elems = types[ depth ].map( ( elem ) => document.createElement( elem ) );
      }
      matrix.forEach( ( a ) => elems[ elems.length - 1 ].appendChild( recurseHtml( types, a, nextDepth( depth ) ) ) );
      let prevElem = false;
      elems.forEach( ( elem ) => {
        if ( prevElem ) {
          prevElem.appendChild( elem );
        }
        prevElem = elem;
      } );
      return elems[ 0 ];
    }
    if ( Array.isArray( matrix ) ) {
      let el = document.createElement( types[ depth ] );
      matrix.forEach( ( a ) => el.appendChild( recurseHtml( types, a, nextDepth( depth ) ) ) );
      return el;
    }
    let el = document.createElement( types[ depth ] );
    if ( matrix instanceof Object ) {
      matrix = configureHtml( mergeObjects( matrix, { element: el, } ) );
    }
    return el;
  }

  const processHtml = ( types, matrix, parent = document.body ) => parent.appendChild( recurseHtml( types, matrix ) );
  const generateHtml = curry( processHtml );
  const createTable = generateHtml( [ [ 'table', 'tbody' ], 'tr', 'td' ] );

  const updateCell = ( config, matrix, x, y ) => configureHtml( mergeObjects( matrix[ y ][ x ], config ) );
  const alterCell = curry( updateCell );
  const update3dCell = ( config, matrix, x, y, z ) => configureHtml( mergeObjects( matrix[ y ][ x ][ z ], config ) );
  const alter3dCell = curry( update3dCell );

  const shipViewTile = () => ( {
    hasShip: true,
    styles : {
      backgroundColor: '#777',
    }
  } );

  const tile = () => ( {
    hasShip: false,
    isHit: false,
    point: {},
    styles: {
      border: '1px solid #333',
      width: '35px',
      height: '35px',
      backgroundColor: 'blue',
      cursor: 'pointer',
    },
    events: {
      click: {
        f: attackFleet,
        args: [
          'shipFleet',
          'point',
        ],
      },
    },
    element: {},
  } );

  const shipTile = () => ( {
    hasShip: true,
  } );

  const ship = () => ( {
    status: 100,
    parts: [],
  } );

  const hitTile = () => ( {
    isHit: true,
  } );

  const playerSet = (name = '') => ({
    name: name,
    status: 100,
    board: {},
    shipFleet: [],
  });

  const setViewShip = alterCell( mergeObjects(shipTile(), { styles : {backgroundColor: '#777',},}));
  const setHiddenShip = alterCell( shipTile() );
  const setShip = (matrix, point, view) => view ? setViewShip( matrix, point.x, point.y) : setHiddenShip(matrix, point.x, point.y );
  const setHit = alterCell( hitTile() );

  const attackFleet = ( matrix, fleet, target ) => {
    let hitCell = setHit( matrix, target.x, target.y );
    return hitCell.hasShip ? fleet.map( ( ship ) => {
      if (ship.hasOwnProperty('parts')){
        let healthy = ship.parts.filter( ( part ) => !part.isHit );
        ship.status = healthy.length / ship.parts.length * 100;
      }
      return ship;
    } ) : fleet;
  }

  const checkIfShipCell = (point, matrix) => matrix[point.y][point.x].hasShip;
  const checkIfAnyShip = (arr, matrix) => arr.filter((point) => !checkIfShipCell(point, matrix));

  const checkShipBetween = (start, end, matrix) => {
    if (checkIfShipCell(start, matrix) || checkIfShipCell(end, matrix)){
      return true;
    }
    let testArr = [];
    let xdiff = end.x - start.x;
    let ydiff = end.y - start.y;
    if (xdiff > 0){
      for (let i = start.x; i < end.x; ++i){
        if (checkIfShipCell({x: i, y: start.y}, matrix)){
          return true;
        }
      }
    } else if (ydiff > 0){
      for (let i = start.y; i < end.y; ++i){
        if (checkIfShipCell({x: start.x, y: i}, matrix)){
          return true;
        }
      }
    }
    return false;
  }

  const buildShip = ( l, start, dir, matrix, view = false ) => {
    let unit = ship();
    let cur = start;
    for ( let i = 0; i < l; ++i ) {
      unit.parts.push( setShip( matrix, cur, view ) );
      cur = nextCell( cur, dir );
    }
    return unit;
  }

  const buildFleet = ( shipStats, matrix, view = false ) => {
    let shipFleet = [];
    for (let size in shipStats){
      let start = point(0, 0);
      let dirSelect = 0;
      let dir = point(0, 1);
      let end = point(0, 0);
      do {
        dirSelect = Math.floor(Math.random() * 2);
        dir = dirSelect === 0 ? point(0, 1): point(1, 0);
        start = point(Math.floor(Math.random() * (matrix.length - ((shipStats[size]- 1) * dir.x))), Math.floor(Math.random() * (matrix[0].length - ((shipStats[size]- 1) * dir.y))));
        end = point(start.x + dir.x * (shipStats[size] - 1), start.y + dir.y * (shipStats[size] - 1));
      } while (checkShipBetween(start, end, matrix));
      shipFleet.push(buildShip( shipStats[size], start, dir, matrix, view ));
    }
    return shipFleet;
  }

  const fleetBuilder = curry(buildFleet);
  const defaultFleet = fleetBuilder([5, 4, 3, 3, 2]);

  const lineContent = buildArray( tile() );
  const rectMatrix = ( x, y ) => buildArray( lineContent( x ), y );
  const rect3d = ( x, y, z ) => buildArray( rectMatrix( x, y ), z );
  const squareMatrix = ( size ) => rectMatrix( size, size );
  const cube3d = ( size ) => rect3d( size, size, size );

  const launchAttack = curry(attackFleet);


  const bindListeners = ( matrix, func, board, fleet ) => {
    if (Array.isArray(matrix)){
      return matrix.map((arr) => {
        return bindListeners(arr, func, board, fleet);
      });
    }
    return matrix.element.addEventListener('click', () => launchAttack(board, fleet, matrix.point));
  }

  const buildPlayers = (num) => {
    let players = [];
    for (let i = 0; i < num; ++i){
      let player = playerSet();
      player.board = squareMatrix( 10 );
      let boardAttack = launchAttack(player.board);
      createTable(locateCells(player.board), document.body);
      player.shipFleet = defaultFleet(player.board, true);
      let focusFleet = (player.shipFleet);
      bindListeners(player.board, focusFleet, player.board, player.shipFleet );
      players.push(player);
    }
    return players;
  }

  let players = buildPlayers(1);
  console.log(players);

}() );
