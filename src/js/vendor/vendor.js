"use strict";function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(function(){var e=this||{},t=e.jDomCore||{},n={};e.jDomCore=n,n.noConflict=function(){return e.jDomCore=t,n},n.curry=function(e){return function(){for(var t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return r.length>=e.length?e.apply(void 0,r):function(){for(var t=arguments.length,o=new Array(t),i=0;i<t;i++)o[i]=arguments[i];return n.curry(e).apply(void 0,[].concat(r,o))}}},n.pipe=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return t.reduce((function(e,t){return t(e)}),e)}},n.setValue=function(e,t,n){return n[e]=t,n},n.setAndReturnValue=function(e,t,n){return e[t]=n,n},n.mapObject=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;return Array.isArray(e)?e.map(t,r):Object.keys(e).reduce((function(r,o){return n.setValue(o,t.apply(void 0,_toConsumableArray([e[o],o,e].slice(0,t.length||2))),r)}),r||{})},n.mapProperty=function(e,t,r){return r[e]=n.mapObject(r[e]||[],t),r},n.filterObject=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;return Array.isArray(e)?e.filter(t,n):Object.keys(e).reduce((function(n,r){return t.apply(void 0,_toConsumableArray([e[r],r,e].slice(0,t.length||2)))?n[r]=e[r]:delete n[r],n}),n||{})},n.reduceObject=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e[Object.keys(e)[0]]||e[0];return Array.isArray(e)?e.reduce(t,n):Object.keys(e).reduce((function(n,r){return t.apply(void 0,_toConsumableArray([n,e[r],r,e].slice(0,t.length||2)))}),n)},n.notEmptyObjectOrArray=function(e){return!!("object"===_typeof(e)&&Object.keys(e).length||Array.isArray(e)&&e.length)};n.cloneObject=function(e){return function e(t,r){return n.notEmptyObjectOrArray(t)?n.reduceObject(t,(function(t,n,o){return t[o]=r[o]&&!/^(parentItem|listenerArgs|element)$/.test(o)?e(n,r[o]):n,t}),r):r}(e,JSON.parse(JSON.stringify(e,(function(e,t){return/^(parentItem|listenerArgs|element)$/.test(e)?void 0:t}))))};var r=function(e,t,r){var o=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return n.notEmptyObjectOrArray(r)?n.mapObject(r,(function(n,r){return t[r]&&!/^(parentItem|listenerArgs|element)$/.test(r)?e(t[r],n):n}),o?t:n.cloneObject(t)):r};n.mergeObjects=function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return 2===t.length?r(n.mergeObjects,t[0],t[1]):1===t.length?n.cloneObject(t[0]):t.reduce(n.curry(r)(n.mergeObjects),{})},n.mergeObjectsMutable=function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return 2===t.length?r(n.mergeObjectsMutable,t[0],t[1],!0):1===t.length?t[0]:t.reduce(n.curry(r)(n.mergeObjectsMutable),{})};var o=function e(t,r,o){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];return--o>0?e(t,t?r:n.cloneObject(r),o,i.concat([r])):i.concat([r])};n.buildArray=n.curry(o)(!1),n.buildArrayOfReferences=n.curry(o)(!0),n.inArray=function(e,t){return e.indexOf(t)>=0},n.getAbsoluteMax=function(e,t){return Math.abs(e)>Math.abs(t)?e:t},n.getAbsoluteMin=function(e,t){return Math.abs(e)<Math.abs(t)?e:t},n.randomNumber=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return(Math.random()*e+t)*n},n.randomInteger=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return(Math.floor(Math.random()*e)+t)*n},n.compare=function(e,t){return e===t?0:e>t?1:-1},n.compareArrays=function(e,t){return t.filter((function(t){return!n.inArray(e,t)})).concat(e).reduce((function(r,o){return n.setValue("string"==typeof o?o:JSON.stringify(o,(function(e,t){return/^(parentItem|listenerArgs|element)$/.test(e)?void 0:t})),n.compare(e.filter((function(e){return e===o})).length,t.filter((function(e){return e===o})).length),r)}),{})},n.trace=function(e){return function(t){return console.info("".concat(e,": "),t),t}},n.queueTimeout=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;n.queueTimeout.queue=n.queueTimeout.queue||[],n.queueTimeout.isRunning=n.queueTimeout.isRunning||!1;for(var r=arguments.length,o=new Array(r>2?r-2:0),i=2;i<r;i++)o[i-2]=arguments[i];var u={id:0,func:e,timeout:t,args:o,result:0};if(e&&n.queueTimeout.queue.push(u),n.queueTimeout.queue.length&&!n.queueTimeout.isRunning){n.queueTimeout.isRunning=!0;var c=n.queueTimeout.queue.shift();return c.id=setTimeout((function(){return c.result=c.func.apply(c,_toConsumableArray(c.args)),n.queueTimeout.isRunning=!1,n.queueTimeout(!1)}),c.timeout),c}return u},"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=n),exports=Object.assign(exports,n))}).call(window||{}),function(){var e=this||{},t=e.document;Object.keys(e).length||("undefined"!=typeof require?(e=require("../../pseudoDom/objects.js").generate(e),t=e.document):console.error("objects.js requires pseudoDom/objects"));var n=e.jDomObjectsDom||{},r={};e.jDomObjectsDom=r,r.noConflict=function(){return e.jDomObjectsDom=n,r};var o=e.jDomCore;void 0===o&&("undefined"!=typeof require?o=require("../core.js"):console.error("core/dom/objects requires core/core")),r.createDomItem=function(){for(var e,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return(e=o).mergeObjectsMutable.apply(e,[{tagName:"div",attributes:{style:{}},element:{},eventListeners:{},parentItem:{},children:[]}].concat(n))};var i=function(){return[r.createDomItem({tagName:"head",attributes:{},element:t.head,children:[]}),r.createDomItem({tagName:"body",attributes:{},element:t.body,children:[]})]},u=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return r.createDomItem({tagName:"html",attributes:{},element:t,eventListeners:n,children:e,head:e[0],body:e[1]})};r.documentDomItem=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u(i(),e);return t.children=t.children.map((function(e){return r.createDomItem(e,{parentItem:t})})),Object.assign(t.head,t.children[0]),Object.assign(t.body,t.children[1]),r.createDomItem(t)},r.documentItem=r.documentDomItem(),"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=r),exports=Object.assign(exports,r))}.call(window||{}),function(){var e=this||{},t=e.jDomCoreDom||{},n={};e.jDomCoreDom=n,n.noConflict=function(){return e.jDomCoreDom=t,n};var r=e.document;void 0===r&&("undefined"!=typeof require?(e=require("../../pseudoDom/objects.js").generate(e),r=e.document):console.error("core/dom/core requires pseudoDom/objects"));var o=e.jDomCore;void 0===o&&("undefined"!=typeof require?o=require("../core.js"):console.error("core/dom/core requires core/core"));var i=e.jDomObjectsDom;void 0===i&&("undefined"!=typeof require?i=require("./objects.js"):console.error("core/dom/core requires core/dom/objects")),n.elementHasAttribute=function(e,t,n){return!!e.style&&(/^(style|className)$/.test(t)?o.compareArrays("string"==typeof n?n.split(" "):Object.keys(n),"string"==typeof n?e[t].split(" "):Object.keys(e[t])):e.hasAttribute(t)&&e.getAttribute(t)===n)},n.elementCompareClassList=function(e,t){return o.compareArrays(t.split(" "),[].from(e.classList))},n.elementChanges=function(e){return e.element.tagName.toLowerCase()!==e.tagName.toLowerCase()?n.generateElement(e):o.setValue("attributes",o.filterObject(e.attributes,(function(t,r){return o.filterObject(o.mapObject(e.attributes,(function(t,r){return"object"===_typeof(t)||"className"===r?o.filterObject(n.elementHasAttribute(e.element,r,t),(function(e){return 1===e})):!n.elementHasAttribute(e.element,r,t)})),(function(e){return!!e}))[r]})),e)},n.setAttribute=function(e,t,n){return e.element.setAttribute(t,n),e},n.setAndReturnAttribute=function(e,t,n){return e.element.setAttribute(t,n),n},n.updateElement=function(e){return e.element.style?o.setValue("attributes",o.mapObject(n.elementChanges(e).attributes,(function(t,r){return o.notEmptyObjectOrArray(t)?o.mapObject(o.filterObject(t,(function(e,t){return/^\D+$/.test(t)})),(function(t,n){return o.setAndReturnValue(e.element.style,n,t)}),e.element.style):r in e.element?o.setAndReturnValue(e.element,r,t):n.setAndReturnAttribute(e,r,t)})),e):e},n.updateElements=function(e){return o.mapProperty("children",(function(e){return n.updateElements(e)}),n.updateElement(e))},n.generateElement=function(e){return n.updateElement(o.setValue("element",r.createElement(e.tagName),e))},n.bindElement=function(e){return o.setValue("element",e.element&&e.element.style?e.element:n.generateElement(e).element,e)};var u=function(e){return e.body?e.body:e},c=function(e,t){return o.inArray(t,e)?t:t.concat([e])},a=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.documentItem.body;return u(t).element.appendChild(e.element),e};n.appendHTML=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.documentItem.body;return a(n.bindElement(e),o.setValue("children",c(e,u(t).children),u(t)))},n.removeChild=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.documentItem.body;return t.element.removeChild(e.element),t.children.splice(t.children.indexOf(e),1)},n.registerListener=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.name,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.documentItem;return Object.assign(n.eventListeners,_defineProperty({},t,e))},n.registerListeners=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.documentItem;return o.mergeObjects(t,{eventListeners:t.eventListeners},{eventListeners:e})},n.retrieveListener=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.documentItem;return o.inArray(Object.keys(t.eventListeners),e)?t.eventListeners[e]:{}};n.assignListener=function(e,t,n,r){return t.addEventListener?t.addEventListener(e,n,function e(t){if(void 0===e.supportsOptions){e.supportsOptions=!0;try{window.addEventListener("test",null,{capture:!1,once:!1,passive:!1})}catch(t){e.supportsOptions=!1}}return!("object"!==_typeof(t)||!e.supportsOptions)&&t}(r)):t.attachEvent?t.attachEvent("on".concat(e),n):t["on".concat(e)]=n,n},n.appendListeners=function(e,t,r){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},u=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return o.mapProperty("children",(function(e){return n.appendListeners(e,t,r,i,u)}),o.setValue("eventListeners",o.setValue(t,{listenerFunc:r,listenerArgs:i,listenerOptions:u},e.eventListeners),e))};n.bindListeners=function(e){return e.eventListeners&&Object.keys(e.eventListeners).length&&e.element.style?function(e){return o.mapProperty("eventListeners",(function(t,r){return n.assignListener(r,e.element,(function(n){return t.listenerFunc(n,e,t.listenerArgs)}),t.listenerOptions)}),e)}(e):e},n.bindAllListeners=function(e){return o.mapProperty("children",(function(e){return n.bindAllListeners(e)}),n.bindListeners(e))},n.gatherChildItems=function(e,t){return t(e,e.children.reduce((function(e,r){return e.concat(n.gatherChildItems(r,t))}),[]))};var s=function(e,t){return function(n,r){return n.attributes[e]&&n.attributes[e]===t?r.concat([n]):r}};n.getChildrenFromAttribute=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.documentItem.body;return n.gatherChildItems(r,s(e,t))},n.getChildrenByClass=o.curry(n.getChildrenFromAttribute)("className"),n.getChildrenByName=o.curry(n.getChildrenFromAttribute)("name"),n.getParentsFromAttribute=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i.documentItem.body;return Object.keys(r.parentItem).length?(r.parentItem.attributes[e]||r[e]||!1)===t?n.getParentsFromAttribute(e,t,r.parentItem).concat([r.parentItem]):n.getParentsFromAttribute(e,t,r.parentItem):[]},n.getParentsByClass=o.curry(n.getParentsFromAttribute)("className"),n.getParentsByName=o.curry(n.getParentsFromAttribute)("name"),n.getParentsByTagName=o.curry(n.getParentsFromAttribute)("tagName"),n.getTopParentItem=function(e){return Object.keys(e.parentItem).length?n.getTopParentItem(e.parentItem):e},n.renderHTML=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.documentItem;return o.pipe((function(e){return o.setValue("element",e.element&&e.element.style?e.element:n.bindElement(e).element,e)}),(function(e){return o.setValue("eventListeners",o.mapObject(e.eventListeners,(function(e){return o.mergeObjects(e,{listenerFunc:n.retrieveListener(e.listenerFunc,n.getTopParentItem(t))})})),e)}),o.curry(o.setValue)("parentItem",t.body||t),(function(e){return n.bindListeners(n.appendHTML(e,t))}),(function(e){return o.mapProperty("children",(function(t){return n.renderHTML(t,e)}),e)}))(o.mapObject(i.createDomItem(e),(function(e){return e}),e))},"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=n),exports=Object.assign(exports,n))}.call(window||{}),function(){var e=this||{},t=e.jDomMatrixObjects||{},n={};e.jDomMatrixObjects=n,n.noConflict=function(){return e.jDomMatrixObjects=t,n};var r=e.jDomCore;void 0===r&&("undefined"!=typeof require?r=require("../core/core.js"):console.error("objects.js requires jDomCore"));var o=e.jDomObjectsDom;void 0===o&&("undefined"!=typeof require?o=require("../core/dom/objects.js"):console.error("core.js requires objects")),n.point=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return{x:e,y:t,z:n}},n.tile=function(){return{point:{}}},n.matrix=function(){var e,t,n,i,u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{coordinate:0,props:[]},c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{coordinate:0,props:[]},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{coordinate:1,props:[]},s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];return(e=o).createDomItem.apply(e,[{tagName:"div",attributes:{className:"matrix"},children:r.buildArray((t=o).createDomItem.apply(t,[{axis:"z",tagName:"div",attributes:{className:"layer"},children:r.buildArray((n=o).createDomItem.apply(n,[{axis:"y",tagName:"div",attributes:{className:"row"},children:r.buildArray((i=o).createDomItem.apply(i,[{axis:"x",tagName:"div",attributes:{className:"column"}}].concat(_toConsumableArray(u.props))),u.coordinate)}].concat(_toConsumableArray(c.props))),c.coordinate)}].concat(_toConsumableArray(a.props))),a.coordinate)}].concat(_toConsumableArray(s)))},n.square=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.x,r=void 0===t?[]:t,o=e.y,i=void 0===o?[]:o,u=e.z,c=void 0===u?[]:u,a=e.matrixProps,s=void 0===a?[]:a,l=arguments.length>1?arguments[1]:void 0;return n.matrix({coordinate:l,props:r},{coordinate:l,props:i},{coordinate:1,props:c},s)},n.cube=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.x,r=void 0===t?[]:t,o=e.y,i=void 0===o?[]:o,u=e.z,c=void 0===u?[]:u,a=e.matrixProps,s=void 0===a?[]:a,l=arguments.length>1?arguments[1]:void 0;return n.matrix({coordinate:l,props:r},{coordinate:l,props:i},{coordinate:l,props:c},s)},"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=n),exports=Object.assign(exports,n))}.call(window||{}),function(){var e=this||{},t=e.jDomMatrixCore||{},n={};e.jDomMatrixCore=n,n.noConflict=function(){return e.jDomMatrixCore=t,n};var r=e.jDomCore;void 0===r&&("undefined"!=typeof require?r=require("../core/core.js"):console.error("matrix/core requires core/core"));var o=e.jDomMatrixObjects;void 0===o&&("undefined"!=typeof require?o=require("./objects.js"):console.error("matrix/core requires matrix/objects")),n.bindPointData=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.point(0,0,0);return r.mergeObjects(e,e.point?{point:r.cloneObject(t)}:{children:e.children.map((function(e,r){return n.bindPointData(e,Object.assign(t,_defineProperty({},e.axis,r)))}))})},n.nextCell=function(e,t){return o.point(e.x+t.x,e.y+t.y,e.z+t.z)},n.pointDifference=function(e,t){return o.point(t.x-e.x,t.y-e.y,t.z-e.z)},n.areEqualPoints=function(e,t){return e.x===t.x&&e.y===t.y&&e.z===t.z},n.getHighestAbsoluteCoordinate=function(e){return r.reduceObject(e,r.getAbsoluteMax,0)},n.getFirstAxisOfCoordinate=function(e,t){return Object.keys(e).filter((function(n){return e[n]===t}))[0]||!1};var i=function(e){return function(e,t){return!1!==(i=n.getFirstAxisOfCoordinate(e,t))?r.mergeObjects(o.point(0,0,0),_defineProperty({},"".concat(i),t>0?1:-1)):o.point(0,0,0);var i}(e,n.getHighestAbsoluteCoordinate(e))};n.pointsToDirection=function(e,t){return i(n.pointDifference(e,t))},n.randomStart=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:o.point(10,10,10);return o.point(r.randomInteger(n.x-(e-1)*t.x),r.randomInteger(n.y-(e-1)*t.y),r.randomInteger(n.z-(e-1)*t.z))},n.lineEndPoint=function(e,t,n){return o.point(e.x+n.x*(t-1),e.y+n.y*(t-1),e.z+n.z*(t-1))},n.getPointsLine=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return n.areEqualPoints(e,t)?r.concat([e]):n.getPointsLine(n.nextCell(e,n.pointsToDirection(e,t)),t,r.concat([e]))},n.getPointsLines=function(e){return e.reduce((function(e,t){return e.concat(n.getPointsLine.apply(n,_toConsumableArray(t)))}),[])},n.testPointsBetween=function(e,t,o,i){var u=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return n.getPointsLine(e,t).filter((function(e,t,n){return 0!==t&&t!==n.length-1||u})).reduce((function(e,t){return r.mergeObjects(e,_defineProperty({},"".concat(i(t,o)),[t]))}),{true:[],false:[]})},n.checkInBetween=function(){return!!n.testPointsBetween.apply(n,arguments).true.length},n.getAxisLengths=function(e){return o.point(e.children[0].children[0].children.length,e.children[0].children.length,e.children.length)},n.randDirection=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e.length?e[r.randomInteger(e.length)]:o.point(0,0,0)},n.checkValidPoint=function(e,t){return!!(t.children[e.z]&&t.children[e.z].children[e.y]&&t.children[e.z].children[e.y].children[e.x]&&t.children[e.z].children[e.y].children[e.x].point)},n.getDomItemFromPoint=function(e,t){return!!n.checkValidPoint(e,t)&&t.children[e.z].children[e.y].children[e.x]},n.getAllPoints=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return e.point?t.concat([e.point]):e.children.reduce((function(e,t){return e.concat(n.getAllPoints(t,[]))}),[])},n.adjacentPoints=function(e,t){return n.getPointsLines([[o.point(-1,1,1),o.point(1,-1,-1)],[o.point(1,1,1),o.point(-1,1,-1)],[o.point(-1,-1,1),o.point(1,-1,1)],[o.point(1,0,0),o.point(1,1,-1)],[o.point(-1,1,0),o.point(1,1,0)]]).concat([o.point(0,0,1),o.point(1,0,0),o.point(-1,0,-1),o.point(0,0,-1)]).map((function(t){return n.nextCell(e,t)})).filter((function(r){return n.checkValidPoint(n.nextCell(e,r),t)}))},n.adjacentEdgePoints=function(e,t){return[o.point(-1,0,0),o.point(1,0,0),o.point(0,-1,0),o.point(0,1,0),o.point(0,0,-1),o.point(0,0,1)].map((function(t){return n.nextCell(e,t)})).filter((function(e){return n.checkValidPoint(e,t)}))},n.getPointFromElement=function(e){return o.point(Array.from(e.parentNode.childNodes).indexOf(e),Array.from(e.parentNode.parentNode.childNodes).indexOf(e.parentNode),Array.from(e.parentNode.parentNode.parentNode.childNodes).indexOf(e.parentNode.parentNode))},n.getDomItemFromElement=function(e,t){return n.getDomItemFromPoint(n.getPointFromElement(e),t)},"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=n),exports=Object.assign(exports,n))}.call(window||{}),function(){var e=this||{},t=e.jsonDom||{},n={};e.jsonDom=n,n.noConflict=function(){return e.jsonDom=t,n},n.jDomCore=e.jDomCore,n.jDomObjectsDom=e.jDomObjectsDom,n.jDomCoreDom=e.jDomCoreDom,n.jDomMatrixObjects=e.jDomMatrixObjects,n.jDomMatrixCore=e.jDomMatrixCore,n.documentItem=n.jDomObjectsDom.documentDomItem()}.call(window||{});