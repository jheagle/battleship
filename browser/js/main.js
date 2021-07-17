(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { const n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    'use strict'
    /**
 * Create new private reference to the document
 * @typedef {module:jDom/core/dom/objects.documentItem} documentItem
 */

    const documentItem = gameStart.main(jsonDom.documentDomItem({
      beginRound: gameStart.beginRound,
      attackListener: gameActions.attackListener,
      restart: gameStart.restart
    }))
    console.log('Document Item: ', documentItem) // eslint-disable-next-line no-undef

    if (typeof document === 'undefined' || !(document instanceof HTMLDocument)) {
      // Trigger game to start if running as node module
      const form = jsonDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
      const submitBtn = jsonDom.getChildrenFromAttribute('type', 'submit', form)
      submitBtn[0].element.click()
    }
  }, {}]
}, {}, [1])
