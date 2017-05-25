const configureHtml = (config) => {
    if (config.isHit) {
        config.styles.backgroundColor = config.hasShip ? 'red' : 'white';
    }
    addElementStyles(config.element, config.styles);
    // if ( Object.keys( config.events ).length ) {
    //   Object.keys( config.events ).forEach( ( eventName ) => {
    //     let args = Object.keys(config.events[ eventName ].args).map((arg) => arg === 'point'? config.point: config.events[ eventName ].args[ arg ]);
    //     console.log(args);
    //     return config.element.addEventListener(eventName, config.events[ eventName ].f(...args) );
    //   });
    // }
    return config;
}

const addElementStyles = (elem, styles) => (Object.keys(styles).length && elem.style) ? Object.keys(styles).forEach((styleName) => elem.style[styleName] = styles[styleName]) : elem;

const generateElement = (elemAttr) => {
    let elem = document.createElement(elemAttr.type);
    Object.keys(elemAttr).map((attr) => {
        if (attr !== 'type' && attr !== 'styles') {
            elem.setAttribute(attr, elemAttr[attr]);
        }
    });
    if (elemAttr.styles){
        addElementStyles(elem, elemAttr.styles);
    }
    return elem;
}

const recurseHtml = (types, matrix, depth = 0, layer = 0) => {
    let nextDepth = (i) => nextIndex(types, i);
    if (depth === 0) {
        let elems = [];
        if (Array.isArray(types[depth])) {
            elems = types[depth].map(generateElement);
        }
        matrix.forEach((a) => elems[elems.length - 1].appendChild(recurseHtml(types, a, nextDepth(depth), layer++)));
        let prevElem = false;
        elems.forEach((elem) => {
            if (prevElem) {
                prevElem.appendChild(elem);
            }
            prevElem = elem;
        });
        return elems[0];
    }
    if (depth === 1 && types.length > 2){
        types[depth].styles.zIndex = layer;
    }
    if (Array.isArray(matrix)) {
        let el = generateElement(types[depth]);
        matrix.forEach((a) => el.appendChild(recurseHtml(types, a, nextDepth(depth), layer)));
        return el;
    }
    let el = generateElement(types[depth]);
    if (matrix instanceof Object) {
        matrix = configureHtml(mergeObjects(matrix, {element: el,}));
    }
    return el;
}

const processHtml = (types, matrix, parent = document.body) => parent.appendChild(recurseHtml(types, matrix));
const generateHtml = curry(processHtml);
const createTable = generateHtml(boardHTML());

const updateCell = (config, matrix, x, y) => configureHtml(mergeObjects(matrix[y][x], config));
const alterCell = curry(updateCell);
const update3dCell = (config, matrix, x, y, z) => configureHtml(mergeObjects(matrix[y][x][z], config));
const alter3dCell = curry(update3dCell);

const setViewShip = alterCell(mergeObjects(shipTile(), {styles: {backgroundColor: '#777',},}));
const setHiddenShip = alterCell(shipTile());
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y) : setHiddenShip(matrix, point.x, point.y);
const setHit = alterCell(hitTile());

const attackFleet = (matrix, fleet, target) => {
    let hitCell = setHit(matrix, target.x, target.y);
    return hitCell.hasShip ? fleet.map((ship) => {
            if (ship.hasOwnProperty('parts')) {
                let healthy = ship.parts.filter((part) => !part.isHit);
                ship.status = healthy.length / ship.parts.length * 100;
            }
            return ship;
        }) : fleet;
}

const launchAttack = curry(attackFleet);

const bindListeners = (matrix, func, board, fleet) => {
    if (Array.isArray(matrix)) {
        return matrix.map((arr) => {
            return bindListeners(arr, func, board, fleet);
        });
    }
    return matrix.element instanceof HTMLElement ? matrix.element.addEventListener('click', () => launchAttack(board, fleet, matrix.point)) : matrix.element;
}