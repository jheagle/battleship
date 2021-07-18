(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { const n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    module.exports = function (it) {
      if (typeof it !== 'function') {
        throw TypeError(String(it) + ' is not a function')
      } return it
    }
  }, {}],
  2: [function (require, module, exports) {
    const isObject = require('../internals/is-object')

    module.exports = function (it) {
      if (!isObject(it) && it !== null) {
        throw TypeError("Can't set " + String(it) + ' as a prototype')
      } return it
    }
  }, { '../internals/is-object': 82 }],
  3: [function (require, module, exports) {
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const create = require('../internals/object-create')
    const definePropertyModule = require('../internals/object-define-property')

    const UNSCOPABLES = wellKnownSymbol('unscopables')
    const ArrayPrototype = Array.prototype

    // Array.prototype[@@unscopables]
    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    if (ArrayPrototype[UNSCOPABLES] == undefined) {
      definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
        configurable: true,
        value: create(null)
      })
    }

    // add a key to Array.prototype[@@unscopables]
    module.exports = function (key) {
      ArrayPrototype[UNSCOPABLES][key] = true
    }
  }, { '../internals/object-create': 104, '../internals/object-define-property': 106, '../internals/well-known-symbol': 167 }],
  4: [function (require, module, exports) {
    'use strict'
    const charAt = require('../internals/string-multibyte').charAt

    // `AdvanceStringIndex` abstract operation
    // https://tc39.es/ecma262/#sec-advancestringindex
    module.exports = function (S, index, unicode) {
      return index + (unicode ? charAt(S, index).length : 1)
    }
  }, { '../internals/string-multibyte': 141 }],
  5: [function (require, module, exports) {
    module.exports = function (it, Constructor, name) {
      if (!(it instanceof Constructor)) {
        throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation')
      } return it
    }
  }, {}],
  6: [function (require, module, exports) {
    const isObject = require('../internals/is-object')

    module.exports = function (it) {
      if (!isObject(it)) {
        throw TypeError(String(it) + ' is not an object')
      } return it
    }
  }, { '../internals/is-object': 82 }],
  7: [function (require, module, exports) {
    // eslint-disable-next-line es/no-typed-arrays -- safe
    module.exports = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined'
  }, {}],
  8: [function (require, module, exports) {
    'use strict'
    const NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native')
    const DESCRIPTORS = require('../internals/descriptors')
    const global = require('../internals/global')
    const isObject = require('../internals/is-object')
    const has = require('../internals/has')
    const classof = require('../internals/classof')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const redefine = require('../internals/redefine')
    const defineProperty = require('../internals/object-define-property').f
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const setPrototypeOf = require('../internals/object-set-prototype-of')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const uid = require('../internals/uid')

    const Int8Array = global.Int8Array
    const Int8ArrayPrototype = Int8Array && Int8Array.prototype
    const Uint8ClampedArray = global.Uint8ClampedArray
    const Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype
    let TypedArray = Int8Array && getPrototypeOf(Int8Array)
    let TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype)
    const ObjectPrototype = Object.prototype
    const isPrototypeOf = ObjectPrototype.isPrototypeOf

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG')
    // Fixing native typed arrays in Opera Presto crashes the browser, see #595
    let NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera'
    let TYPED_ARRAY_TAG_REQIRED = false
    let NAME

    const TypedArrayConstructorsList = {
      Int8Array: 1,
      Uint8Array: 1,
      Uint8ClampedArray: 1,
      Int16Array: 2,
      Uint16Array: 2,
      Int32Array: 4,
      Uint32Array: 4,
      Float32Array: 4,
      Float64Array: 8
    }

    const BigIntArrayConstructorsList = {
      BigInt64Array: 8,
      BigUint64Array: 8
    }

    const isView = function isView (it) {
      if (!isObject(it)) return false
      const klass = classof(it)
      return klass === 'DataView' ||
    has(TypedArrayConstructorsList, klass) ||
    has(BigIntArrayConstructorsList, klass)
    }

    const isTypedArray = function (it) {
      if (!isObject(it)) return false
      const klass = classof(it)
      return has(TypedArrayConstructorsList, klass) ||
    has(BigIntArrayConstructorsList, klass)
    }

    const aTypedArray = function (it) {
      if (isTypedArray(it)) return it
      throw TypeError('Target is not a typed array')
    }

    const aTypedArrayConstructor = function (C) {
      if (setPrototypeOf) {
        if (isPrototypeOf.call(TypedArray, C)) return C
      } else {
        for (const ARRAY in TypedArrayConstructorsList) {
          if (has(TypedArrayConstructorsList, NAME)) {
            const TypedArrayConstructor = global[ARRAY]
            if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
              return C
            }
          }
        }
      } throw TypeError('Target is not a typed array constructor')
    }

    const exportTypedArrayMethod = function (KEY, property, forced) {
      if (!DESCRIPTORS) return
      if (forced) {
        for (const ARRAY in TypedArrayConstructorsList) {
          const TypedArrayConstructor = global[ARRAY]
          if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
            try {
              delete TypedArrayConstructor.prototype[KEY]
            } catch (error) { /* empty */ }
          }
        }
      }
      if (!TypedArrayPrototype[KEY] || forced) {
        redefine(TypedArrayPrototype, KEY, forced
          ? property
          : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property)
      }
    }

    const exportTypedArrayStaticMethod = function (KEY, property, forced) {
      let ARRAY, TypedArrayConstructor
      if (!DESCRIPTORS) return
      if (setPrototypeOf) {
        if (forced) {
          for (ARRAY in TypedArrayConstructorsList) {
            TypedArrayConstructor = global[ARRAY]
            if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
              try {
                delete TypedArrayConstructor[KEY]
              } catch (error) { /* empty */ }
            }
          }
        }
        if (!TypedArray[KEY] || forced) {
          // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
          try {
            return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property)
          } catch (error) { /* empty */ }
        } else return
      }
      for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global[ARRAY]
        if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
          redefine(TypedArrayConstructor, KEY, property)
        }
      }
    }

    for (NAME in TypedArrayConstructorsList) {
      if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false
    }

    // WebKit bug - typed arrays constructors prototype is Object.prototype
    if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray !== 'function' || TypedArray === Function.prototype) {
      // eslint-disable-next-line no-shadow -- safe
      TypedArray = function TypedArray () {
        throw TypeError('Incorrect invocation')
      }
      if (NATIVE_ARRAY_BUFFER_VIEWS) {
        for (NAME in TypedArrayConstructorsList) {
          if (global[NAME]) setPrototypeOf(global[NAME], TypedArray)
        }
      }
    }

    if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
      TypedArrayPrototype = TypedArray.prototype
      if (NATIVE_ARRAY_BUFFER_VIEWS) {
        for (NAME in TypedArrayConstructorsList) {
          if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype)
        }
      }
    }

    // WebKit bug - one more object in Uint8ClampedArray prototype chain
    if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
      setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype)
    }

    if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
      TYPED_ARRAY_TAG_REQIRED = true
      defineProperty(TypedArrayPrototype, TO_STRING_TAG, {
        get: function () {
          return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined
        }
      })
      for (NAME in TypedArrayConstructorsList) {
        if (global[NAME]) {
          createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME)
        }
      }
    }

    module.exports = {
      NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
      TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
      aTypedArray: aTypedArray,
      aTypedArrayConstructor: aTypedArrayConstructor,
      exportTypedArrayMethod: exportTypedArrayMethod,
      exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
      isView: isView,
      isTypedArray: isTypedArray,
      TypedArray: TypedArray,
      TypedArrayPrototype: TypedArrayPrototype
    }
  }, { '../internals/array-buffer-native': 7, '../internals/classof': 25, '../internals/create-non-enumerable-property': 35, '../internals/descriptors': 42, '../internals/global': 66, '../internals/has': 67, '../internals/is-object': 82, '../internals/object-define-property': 106, '../internals/object-get-prototype-of': 111, '../internals/object-set-prototype-of': 116, '../internals/redefine': 124, '../internals/uid': 164, '../internals/well-known-symbol': 167 }],
  9: [function (require, module, exports) {
    'use strict'
    const global = require('../internals/global')
    const DESCRIPTORS = require('../internals/descriptors')
    const NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const redefineAll = require('../internals/redefine-all')
    const fails = require('../internals/fails')
    const anInstance = require('../internals/an-instance')
    const toInteger = require('../internals/to-integer')
    const toLength = require('../internals/to-length')
    const toIndex = require('../internals/to-index')
    const IEEE754 = require('../internals/ieee754')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const setPrototypeOf = require('../internals/object-set-prototype-of')
    const getOwnPropertyNames = require('../internals/object-get-own-property-names').f
    const defineProperty = require('../internals/object-define-property').f
    const arrayFill = require('../internals/array-fill')
    const setToStringTag = require('../internals/set-to-string-tag')
    const InternalStateModule = require('../internals/internal-state')

    const getInternalState = InternalStateModule.get
    const setInternalState = InternalStateModule.set
    const ARRAY_BUFFER = 'ArrayBuffer'
    const DATA_VIEW = 'DataView'
    const PROTOTYPE = 'prototype'
    const WRONG_LENGTH = 'Wrong length'
    const WRONG_INDEX = 'Wrong index'
    const NativeArrayBuffer = global[ARRAY_BUFFER]
    let $ArrayBuffer = NativeArrayBuffer
    let $DataView = global[DATA_VIEW]
    const $DataViewPrototype = $DataView && $DataView[PROTOTYPE]
    const ObjectPrototype = Object.prototype
    const RangeError = global.RangeError

    const packIEEE754 = IEEE754.pack
    const unpackIEEE754 = IEEE754.unpack

    const packInt8 = function (number) {
      return [number & 0xFF]
    }

    const packInt16 = function (number) {
      return [number & 0xFF, number >> 8 & 0xFF]
    }

    const packInt32 = function (number) {
      return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF]
    }

    const unpackInt32 = function (buffer) {
      return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0]
    }

    const packFloat32 = function (number) {
      return packIEEE754(number, 23, 4)
    }

    const packFloat64 = function (number) {
      return packIEEE754(number, 52, 8)
    }

    const addGetter = function (Constructor, key) {
      defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key] } })
    }

    const get = function (view, count, index, isLittleEndian) {
      const intIndex = toIndex(index)
      const store = getInternalState(view)
      if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX)
      const bytes = getInternalState(store.buffer).bytes
      const start = intIndex + store.byteOffset
      const pack = bytes.slice(start, start + count)
      return isLittleEndian ? pack : pack.reverse()
    }

    const set = function (view, count, index, conversion, value, isLittleEndian) {
      const intIndex = toIndex(index)
      const store = getInternalState(view)
      if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX)
      const bytes = getInternalState(store.buffer).bytes
      const start = intIndex + store.byteOffset
      const pack = conversion(+value)
      for (let i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1]
    }

    if (!NATIVE_ARRAY_BUFFER) {
      $ArrayBuffer = function ArrayBuffer (length) {
        anInstance(this, $ArrayBuffer, ARRAY_BUFFER)
        const byteLength = toIndex(length)
        setInternalState(this, {
          bytes: arrayFill.call(new Array(byteLength), 0),
          byteLength: byteLength
        })
        if (!DESCRIPTORS) this.byteLength = byteLength
      }

      $DataView = function DataView (buffer, byteOffset, byteLength) {
        anInstance(this, $DataView, DATA_VIEW)
        anInstance(buffer, $ArrayBuffer, DATA_VIEW)
        const bufferLength = getInternalState(buffer).byteLength
        const offset = toInteger(byteOffset)
        if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset')
        byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength)
        if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH)
        setInternalState(this, {
          buffer: buffer,
          byteLength: byteLength,
          byteOffset: offset
        })
        if (!DESCRIPTORS) {
          this.buffer = buffer
          this.byteLength = byteLength
          this.byteOffset = offset
        }
      }

      if (DESCRIPTORS) {
        addGetter($ArrayBuffer, 'byteLength')
        addGetter($DataView, 'buffer')
        addGetter($DataView, 'byteLength')
        addGetter($DataView, 'byteOffset')
      }

      redefineAll($DataView[PROTOTYPE], {
        getInt8: function getInt8 (byteOffset) {
          return get(this, 1, byteOffset)[0] << 24 >> 24
        },
        getUint8: function getUint8 (byteOffset) {
          return get(this, 1, byteOffset)[0]
        },
        getInt16: function getInt16 (byteOffset /* , littleEndian */) {
          const bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined)
          return (bytes[1] << 8 | bytes[0]) << 16 >> 16
        },
        getUint16: function getUint16 (byteOffset /* , littleEndian */) {
          const bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined)
          return bytes[1] << 8 | bytes[0]
        },
        getInt32: function getInt32 (byteOffset /* , littleEndian */) {
          return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined))
        },
        getUint32: function getUint32 (byteOffset /* , littleEndian */) {
          return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0
        },
        getFloat32: function getFloat32 (byteOffset /* , littleEndian */) {
          return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23)
        },
        getFloat64: function getFloat64 (byteOffset /* , littleEndian */) {
          return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52)
        },
        setInt8: function setInt8 (byteOffset, value) {
          set(this, 1, byteOffset, packInt8, value)
        },
        setUint8: function setUint8 (byteOffset, value) {
          set(this, 1, byteOffset, packInt8, value)
        },
        setInt16: function setInt16 (byteOffset, value /* , littleEndian */) {
          set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined)
        },
        setUint16: function setUint16 (byteOffset, value /* , littleEndian */) {
          set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined)
        },
        setInt32: function setInt32 (byteOffset, value /* , littleEndian */) {
          set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined)
        },
        setUint32: function setUint32 (byteOffset, value /* , littleEndian */) {
          set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined)
        },
        setFloat32: function setFloat32 (byteOffset, value /* , littleEndian */) {
          set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined)
        },
        setFloat64: function setFloat64 (byteOffset, value /* , littleEndian */) {
          set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined)
        }
      })
    } else {
      /* eslint-disable no-new -- required for testing */
      if (!fails(function () {
        NativeArrayBuffer(1)
      }) || !fails(function () {
        new NativeArrayBuffer(-1)
      }) || fails(function () {
        new NativeArrayBuffer()
        new NativeArrayBuffer(1.5)
        new NativeArrayBuffer(NaN)
        return NativeArrayBuffer.name != ARRAY_BUFFER
      })) {
      /* eslint-enable no-new -- required for testing */
        $ArrayBuffer = function ArrayBuffer (length) {
          anInstance(this, $ArrayBuffer)
          return new NativeArrayBuffer(toIndex(length))
        }
        const ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE]
        for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
          if (!((key = keys[j++]) in $ArrayBuffer)) {
            createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key])
          }
        }
        ArrayBufferPrototype.constructor = $ArrayBuffer
      }

      // WebKit bug - the same parent prototype for typed arrays and data view
      if (setPrototypeOf && getPrototypeOf($DataViewPrototype) !== ObjectPrototype) {
        setPrototypeOf($DataViewPrototype, ObjectPrototype)
      }

      // iOS Safari 7.x bug
      const testView = new $DataView(new $ArrayBuffer(2))
      const $setInt8 = $DataViewPrototype.setInt8
      testView.setInt8(0, 2147483648)
      testView.setInt8(1, 2147483649)
      if (testView.getInt8(0) || !testView.getInt8(1)) {
        redefineAll($DataViewPrototype, {
          setInt8: function setInt8 (byteOffset, value) {
            $setInt8.call(this, byteOffset, value << 24 >> 24)
          },
          setUint8: function setUint8 (byteOffset, value) {
            $setInt8.call(this, byteOffset, value << 24 >> 24)
          }
        }, { unsafe: true })
      }
    }

    setToStringTag($ArrayBuffer, ARRAY_BUFFER)
    setToStringTag($DataView, DATA_VIEW)

    module.exports = {
      ArrayBuffer: $ArrayBuffer,
      DataView: $DataView
    }
  }, { '../internals/an-instance': 5, '../internals/array-buffer-native': 7, '../internals/array-fill': 11, '../internals/create-non-enumerable-property': 35, '../internals/descriptors': 42, '../internals/fails': 56, '../internals/global': 66, '../internals/ieee754': 72, '../internals/internal-state': 77, '../internals/object-define-property': 106, '../internals/object-get-own-property-names': 109, '../internals/object-get-prototype-of': 111, '../internals/object-set-prototype-of': 116, '../internals/redefine-all': 123, '../internals/set-to-string-tag': 135, '../internals/to-index': 151, '../internals/to-integer': 153, '../internals/to-length': 154 }],
  10: [function (require, module, exports) {
    'use strict'
    const toObject = require('../internals/to-object')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const toLength = require('../internals/to-length')

    const min = Math.min

    // `Array.prototype.copyWithin` method implementation
    // https://tc39.es/ecma262/#sec-array.prototype.copywithin
    // eslint-disable-next-line es/no-array-prototype-copywithin -- safe
    module.exports = [].copyWithin || function copyWithin (target /* = 0 */, start /* = 0, end = @length */) {
      const O = toObject(this)
      const len = toLength(O.length)
      let to = toAbsoluteIndex(target, len)
      let from = toAbsoluteIndex(start, len)
      const end = arguments.length > 2 ? arguments[2] : undefined
      let count = min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to)
      let inc = 1
      if (from < to && to < from + count) {
        inc = -1
        from += count - 1
        to += count - 1
      }
      while (count-- > 0) {
        if (from in O) O[to] = O[from]
        else delete O[to]
        to += inc
        from += inc
      } return O
    }
  }, { '../internals/to-absolute-index': 150, '../internals/to-length': 154, '../internals/to-object': 155 }],
  11: [function (require, module, exports) {
    'use strict'
    const toObject = require('../internals/to-object')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const toLength = require('../internals/to-length')

    // `Array.prototype.fill` method implementation
    // https://tc39.es/ecma262/#sec-array.prototype.fill
    module.exports = function fill (value /* , start = 0, end = @length */) {
      const O = toObject(this)
      const length = toLength(O.length)
      const argumentsLength = arguments.length
      let index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length)
      const end = argumentsLength > 2 ? arguments[2] : undefined
      const endPos = end === undefined ? length : toAbsoluteIndex(end, length)
      while (endPos > index) O[index++] = value
      return O
    }
  }, { '../internals/to-absolute-index': 150, '../internals/to-length': 154, '../internals/to-object': 155 }],
  12: [function (require, module, exports) {
    'use strict'
    const $forEach = require('../internals/array-iteration').forEach
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')

    const STRICT_METHOD = arrayMethodIsStrict('forEach')

    // `Array.prototype.forEach` method implementation
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    module.exports = !STRICT_METHOD ? function forEach (callbackfn /* , thisArg */) {
      return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      // eslint-disable-next-line es/no-array-prototype-foreach -- safe
    } : [].forEach
  }, { '../internals/array-iteration': 15, '../internals/array-method-is-strict': 18 }],
  13: [function (require, module, exports) {
    'use strict'
    const bind = require('../internals/function-bind-context')
    const toObject = require('../internals/to-object')
    const callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing')
    const isArrayIteratorMethod = require('../internals/is-array-iterator-method')
    const toLength = require('../internals/to-length')
    const createProperty = require('../internals/create-property')
    const getIteratorMethod = require('../internals/get-iterator-method')

    // `Array.from` method implementation
    // https://tc39.es/ecma262/#sec-array.from
    module.exports = function from (arrayLike /* , mapfn = undefined, thisArg = undefined */) {
      const O = toObject(arrayLike)
      const C = typeof this === 'function' ? this : Array
      const argumentsLength = arguments.length
      let mapfn = argumentsLength > 1 ? arguments[1] : undefined
      const mapping = mapfn !== undefined
      const iteratorMethod = getIteratorMethod(O)
      let index = 0
      let length, result, step, iterator, next, value
      if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2)
      // if the target is not iterable or it's an array with the default iterator - use a simple case
      if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
        iterator = iteratorMethod.call(O)
        next = iterator.next
        result = new C()
        for (;!(step = next.call(iterator)).done; index++) {
          value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value
          createProperty(result, index, value)
        }
      } else {
        length = toLength(O.length)
        result = new C(length)
        for (;length > index; index++) {
          value = mapping ? mapfn(O[index], index) : O[index]
          createProperty(result, index, value)
        }
      }
      result.length = index
      return result
    }
  }, { '../internals/call-with-safe-iteration-closing': 22, '../internals/create-property': 37, '../internals/function-bind-context': 60, '../internals/get-iterator-method': 63, '../internals/is-array-iterator-method': 78, '../internals/to-length': 154, '../internals/to-object': 155 }],
  14: [function (require, module, exports) {
    const toIndexedObject = require('../internals/to-indexed-object')
    const toLength = require('../internals/to-length')
    const toAbsoluteIndex = require('../internals/to-absolute-index')

    // `Array.prototype.{ indexOf, includes }` methods implementation
    const createMethod = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        const O = toIndexedObject($this)
        const length = toLength(O.length)
        let index = toAbsoluteIndex(fromIndex, length)
        let value
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare -- NaN check
        if (IS_INCLUDES && el != el) {
          while (length > index) {
            value = O[index++]
            // eslint-disable-next-line no-self-compare -- NaN check
            if (value != value) return true
          // Array#indexOf ignores holes, Array#includes - not
          }
        } else {
          for (;length > index; index++) {
            if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0
          }
        } return !IS_INCLUDES && -1
      }
    }

    module.exports = {
      // `Array.prototype.includes` method
      // https://tc39.es/ecma262/#sec-array.prototype.includes
      includes: createMethod(true),
      // `Array.prototype.indexOf` method
      // https://tc39.es/ecma262/#sec-array.prototype.indexof
      indexOf: createMethod(false)
    }
  }, { '../internals/to-absolute-index': 150, '../internals/to-indexed-object': 152, '../internals/to-length': 154 }],
  15: [function (require, module, exports) {
    const bind = require('../internals/function-bind-context')
    const IndexedObject = require('../internals/indexed-object')
    const toObject = require('../internals/to-object')
    const toLength = require('../internals/to-length')
    const arraySpeciesCreate = require('../internals/array-species-create')

    const push = [].push

    // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
    const createMethod = function (TYPE) {
      const IS_MAP = TYPE == 1
      const IS_FILTER = TYPE == 2
      const IS_SOME = TYPE == 3
      const IS_EVERY = TYPE == 4
      const IS_FIND_INDEX = TYPE == 6
      const IS_FILTER_OUT = TYPE == 7
      const NO_HOLES = TYPE == 5 || IS_FIND_INDEX
      return function ($this, callbackfn, that, specificCreate) {
        const O = toObject($this)
        const self = IndexedObject(O)
        const boundFunction = bind(callbackfn, that, 3)
        const length = toLength(self.length)
        let index = 0
        const create = specificCreate || arraySpeciesCreate
        const target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined
        let value, result
        for (;length > index; index++) {
          if (NO_HOLES || index in self) {
            value = self[index]
            result = boundFunction(value, index, O)
            if (TYPE) {
              if (IS_MAP) target[index] = result // map
              else if (result) {
                switch (TYPE) {
                  case 3: return true // some
                  case 5: return value // find
                  case 6: return index // findIndex
                  case 2: push.call(target, value) // filter
                }
              } else {
                switch (TYPE) {
                  case 4: return false // every
                  case 7: push.call(target, value) // filterOut
                }
              }
            }
          }
        }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target
      }
    }

    module.exports = {
      // `Array.prototype.forEach` method
      // https://tc39.es/ecma262/#sec-array.prototype.foreach
      forEach: createMethod(0),
      // `Array.prototype.map` method
      // https://tc39.es/ecma262/#sec-array.prototype.map
      map: createMethod(1),
      // `Array.prototype.filter` method
      // https://tc39.es/ecma262/#sec-array.prototype.filter
      filter: createMethod(2),
      // `Array.prototype.some` method
      // https://tc39.es/ecma262/#sec-array.prototype.some
      some: createMethod(3),
      // `Array.prototype.every` method
      // https://tc39.es/ecma262/#sec-array.prototype.every
      every: createMethod(4),
      // `Array.prototype.find` method
      // https://tc39.es/ecma262/#sec-array.prototype.find
      find: createMethod(5),
      // `Array.prototype.findIndex` method
      // https://tc39.es/ecma262/#sec-array.prototype.findIndex
      findIndex: createMethod(6),
      // `Array.prototype.filterOut` method
      // https://github.com/tc39/proposal-array-filtering
      filterOut: createMethod(7)
    }
  }, { '../internals/array-species-create': 21, '../internals/function-bind-context': 60, '../internals/indexed-object': 73, '../internals/to-length': 154, '../internals/to-object': 155 }],
  16: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-array-prototype-lastindexof -- safe */
    const toIndexedObject = require('../internals/to-indexed-object')
    const toInteger = require('../internals/to-integer')
    const toLength = require('../internals/to-length')
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')

    const min = Math.min
    const $lastIndexOf = [].lastIndexOf
    const NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0
    const STRICT_METHOD = arrayMethodIsStrict('lastIndexOf')
    const FORCED = NEGATIVE_ZERO || !STRICT_METHOD

    // `Array.prototype.lastIndexOf` method implementation
    // https://tc39.es/ecma262/#sec-array.prototype.lastindexof
    module.exports = FORCED ? function lastIndexOf (searchElement /* , fromIndex = @[*-1] */) {
      // convert -0 to +0
      if (NEGATIVE_ZERO) return $lastIndexOf.apply(this, arguments) || 0
      const O = toIndexedObject(this)
      const length = toLength(O.length)
      let index = length - 1
      if (arguments.length > 1) index = min(index, toInteger(arguments[1]))
      if (index < 0) index = length + index
      for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0
      return -1
    } : $lastIndexOf
  }, { '../internals/array-method-is-strict': 18, '../internals/to-indexed-object': 152, '../internals/to-integer': 153, '../internals/to-length': 154 }],
  17: [function (require, module, exports) {
    const fails = require('../internals/fails')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const V8_VERSION = require('../internals/engine-v8-version')

    const SPECIES = wellKnownSymbol('species')

    module.exports = function (METHOD_NAME) {
      // We can't use this feature detection in V8 since it causes
      // deoptimization and serious performance degradation
      // https://github.com/zloirock/core-js/issues/677
      return V8_VERSION >= 51 || !fails(function () {
        const array = []
        const constructor = array.constructor = {}
        constructor[SPECIES] = function () {
          return { foo: 1 }
        }
        return array[METHOD_NAME](Boolean).foo !== 1
      })
    }
  }, { '../internals/engine-v8-version': 52, '../internals/fails': 56, '../internals/well-known-symbol': 167 }],
  18: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = function (METHOD_NAME, argument) {
      const method = [][METHOD_NAME]
      return !!method && fails(function () {
        // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
        method.call(null, argument || function () { throw 1 }, 1)
      })
    }
  }, { '../internals/fails': 56 }],
  19: [function (require, module, exports) {
    const aFunction = require('../internals/a-function')
    const toObject = require('../internals/to-object')
    const IndexedObject = require('../internals/indexed-object')
    const toLength = require('../internals/to-length')

    // `Array.prototype.{ reduce, reduceRight }` methods implementation
    const createMethod = function (IS_RIGHT) {
      return function (that, callbackfn, argumentsLength, memo) {
        aFunction(callbackfn)
        const O = toObject(that)
        const self = IndexedObject(O)
        const length = toLength(O.length)
        let index = IS_RIGHT ? length - 1 : 0
        const i = IS_RIGHT ? -1 : 1
        if (argumentsLength < 2) {
          while (true) {
            if (index in self) {
              memo = self[index]
              index += i
              break
            }
            index += i
            if (IS_RIGHT ? index < 0 : length <= index) {
              throw TypeError('Reduce of empty array with no initial value')
            }
          }
        }
        for (;IS_RIGHT ? index >= 0 : length > index; index += i) {
          if (index in self) {
            memo = callbackfn(memo, self[index], index, O)
          }
        }
        return memo
      }
    }

    module.exports = {
      // `Array.prototype.reduce` method
      // https://tc39.es/ecma262/#sec-array.prototype.reduce
      left: createMethod(false),
      // `Array.prototype.reduceRight` method
      // https://tc39.es/ecma262/#sec-array.prototype.reduceright
      right: createMethod(true)
    }
  }, { '../internals/a-function': 1, '../internals/indexed-object': 73, '../internals/to-length': 154, '../internals/to-object': 155 }],
  20: [function (require, module, exports) {
    // TODO: use something more complex like timsort?
    const floor = Math.floor

    var mergeSort = function (array, comparefn) {
      const length = array.length
      const middle = floor(length / 2)
      return length < 8
        ? insertionSort(array, comparefn)
        : merge(
          mergeSort(array.slice(0, middle), comparefn),
          mergeSort(array.slice(middle), comparefn),
          comparefn
        )
    }

    var insertionSort = function (array, comparefn) {
      const length = array.length
      let i = 1
      let element, j

      while (i < length) {
        j = i
        element = array[i]
        while (j && comparefn(array[j - 1], element) > 0) {
          array[j] = array[--j]
        }
        if (j !== i++) array[j] = element
      } return array
    }

    var merge = function (left, right, comparefn) {
      const llength = left.length
      const rlength = right.length
      let lindex = 0
      let rindex = 0
      const result = []

      while (lindex < llength || rindex < rlength) {
        if (lindex < llength && rindex < rlength) {
          result.push(comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++])
        } else {
          result.push(lindex < llength ? left[lindex++] : right[rindex++])
        }
      } return result
    }

    module.exports = mergeSort
  }, {}],
  21: [function (require, module, exports) {
    const isObject = require('../internals/is-object')
    const isArray = require('../internals/is-array')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const SPECIES = wellKnownSymbol('species')

    // `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    module.exports = function (originalArray, length) {
      let C
      if (isArray(originalArray)) {
        C = originalArray.constructor
        // cross-realm fallback
        if (typeof C === 'function' && (C === Array || isArray(C.prototype))) C = undefined
        else if (isObject(C)) {
          C = C[SPECIES]
          if (C === null) C = undefined
        }
      } return new (C === undefined ? Array : C)(length === 0 ? 0 : length)
    }
  }, { '../internals/is-array': 79, '../internals/is-object': 82, '../internals/well-known-symbol': 167 }],
  22: [function (require, module, exports) {
    const anObject = require('../internals/an-object')
    const iteratorClose = require('../internals/iterator-close')

    // call something on iterator step with safe closing on error
    module.exports = function (iterator, fn, value, ENTRIES) {
      try {
        return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value)
      } catch (error) {
        iteratorClose(iterator)
        throw error
      }
    }
  }, { '../internals/an-object': 6, '../internals/iterator-close': 86 }],
  23: [function (require, module, exports) {
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')
    let SAFE_CLOSING = false

    try {
      let called = 0
      const iteratorWithReturn = {
        next: function () {
          return { done: !!called++ }
        },
        return: function () {
          SAFE_CLOSING = true
        }
      }
      iteratorWithReturn[ITERATOR] = function () {
        return this
      }
      // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
      Array.from(iteratorWithReturn, function () { throw 2 })
    } catch (error) { /* empty */ }

    module.exports = function (exec, SKIP_CLOSING) {
      if (!SKIP_CLOSING && !SAFE_CLOSING) return false
      let ITERATION_SUPPORT = false
      try {
        const object = {}
        object[ITERATOR] = function () {
          return {
            next: function () {
              return { done: ITERATION_SUPPORT = true }
            }
          }
        }
        exec(object)
      } catch (error) { /* empty */ }
      return ITERATION_SUPPORT
    }
  }, { '../internals/well-known-symbol': 167 }],
  24: [function (require, module, exports) {
    const toString = {}.toString

    module.exports = function (it) {
      return toString.call(it).slice(8, -1)
    }
  }, {}],
  25: [function (require, module, exports) {
    const TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support')
    const classofRaw = require('../internals/classof-raw')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    // ES3 wrong here
    const CORRECT_ARGUMENTS = classofRaw(function () { return arguments }()) == 'Arguments'

    // fallback for IE11 Script Access Denied error
    const tryGet = function (it, key) {
      try {
        return it[key]
      } catch (error) { /* empty */ }
    }

    // getting tag from ES6+ `Object.prototype.toString`
    module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
      let O, tag, result
      return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
        : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) === 'string' ? tag
        // builtinTag case
          : CORRECT_ARGUMENTS ? classofRaw(O)
          // ES3 arguments fallback
            : (result = classofRaw(O)) == 'Object' && typeof O.callee === 'function' ? 'Arguments' : result
    }
  }, { '../internals/classof-raw': 24, '../internals/to-string-tag-support': 159, '../internals/well-known-symbol': 167 }],
  26: [function (require, module, exports) {
    'use strict'
    const anObject = require('../internals/an-object')
    const aFunction = require('../internals/a-function')

    // https://github.com/tc39/collection-methods
    module.exports = function (/* ...elements */) {
      const collection = anObject(this)
      const remover = aFunction(collection.delete)
      let allDeleted = true
      let wasDeleted
      for (let k = 0, len = arguments.length; k < len; k++) {
        wasDeleted = remover.call(collection, arguments[k])
        allDeleted = allDeleted && wasDeleted
      }
      return !!allDeleted
    }
  }, { '../internals/a-function': 1, '../internals/an-object': 6 }],
  27: [function (require, module, exports) {
    'use strict'
    const defineProperty = require('../internals/object-define-property').f
    const create = require('../internals/object-create')
    const redefineAll = require('../internals/redefine-all')
    const bind = require('../internals/function-bind-context')
    const anInstance = require('../internals/an-instance')
    const iterate = require('../internals/iterate')
    const defineIterator = require('../internals/define-iterator')
    const setSpecies = require('../internals/set-species')
    const DESCRIPTORS = require('../internals/descriptors')
    const fastKey = require('../internals/internal-metadata').fastKey
    const InternalStateModule = require('../internals/internal-state')

    const setInternalState = InternalStateModule.set
    const internalStateGetterFor = InternalStateModule.getterFor

    module.exports = {
      getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var C = wrapper(function (that, iterable) {
          anInstance(that, C, CONSTRUCTOR_NAME)
          setInternalState(that, {
            type: CONSTRUCTOR_NAME,
            index: create(null),
            first: undefined,
            last: undefined,
            size: 0
          })
          if (!DESCRIPTORS) that.size = 0
          if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP })
        })

        const getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME)

        const define = function (that, key, value) {
          const state = getInternalState(that)
          let entry = getEntry(that, key)
          let previous, index
          // change existing entry
          if (entry) {
            entry.value = value
            // create new entry
          } else {
            state.last = entry = {
              index: index = fastKey(key, true),
              key: key,
              value: value,
              previous: previous = state.last,
              next: undefined,
              removed: false
            }
            if (!state.first) state.first = entry
            if (previous) previous.next = entry
            if (DESCRIPTORS) state.size++
            else that.size++
            // add to index
            if (index !== 'F') state.index[index] = entry
          } return that
        }

        var getEntry = function (that, key) {
          const state = getInternalState(that)
          // fast case
          const index = fastKey(key)
          let entry
          if (index !== 'F') return state.index[index]
          // frozen object case
          for (entry = state.first; entry; entry = entry.next) {
            if (entry.key == key) return entry
          }
        }

        redefineAll(C.prototype, {
          // `{ Map, Set }.prototype.clear()` methods
          // https://tc39.es/ecma262/#sec-map.prototype.clear
          // https://tc39.es/ecma262/#sec-set.prototype.clear
          clear: function clear () {
            const that = this
            const state = getInternalState(that)
            const data = state.index
            let entry = state.first
            while (entry) {
              entry.removed = true
              if (entry.previous) entry.previous = entry.previous.next = undefined
              delete data[entry.index]
              entry = entry.next
            }
            state.first = state.last = undefined
            if (DESCRIPTORS) state.size = 0
            else that.size = 0
          },
          // `{ Map, Set }.prototype.delete(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.delete
          // https://tc39.es/ecma262/#sec-set.prototype.delete
          delete: function (key) {
            const that = this
            const state = getInternalState(that)
            const entry = getEntry(that, key)
            if (entry) {
              const next = entry.next
              const prev = entry.previous
              delete state.index[entry.index]
              entry.removed = true
              if (prev) prev.next = next
              if (next) next.previous = prev
              if (state.first == entry) state.first = next
              if (state.last == entry) state.last = prev
              if (DESCRIPTORS) state.size--
              else that.size--
            } return !!entry
          },
          // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.foreach
          // https://tc39.es/ecma262/#sec-set.prototype.foreach
          forEach: function forEach (callbackfn /* , that = undefined */) {
            const state = getInternalState(this)
            const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
            let entry
            while (entry = entry ? entry.next : state.first) {
              boundFunction(entry.value, entry.key, this)
              // revert to the last existing entry
              while (entry && entry.removed) entry = entry.previous
            }
          },
          // `{ Map, Set}.prototype.has(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.has
          // https://tc39.es/ecma262/#sec-set.prototype.has
          has: function has (key) {
            return !!getEntry(this, key)
          }
        })

        redefineAll(C.prototype, IS_MAP ? {
          // `Map.prototype.get(key)` method
          // https://tc39.es/ecma262/#sec-map.prototype.get
          get: function get (key) {
            const entry = getEntry(this, key)
            return entry && entry.value
          },
          // `Map.prototype.set(key, value)` method
          // https://tc39.es/ecma262/#sec-map.prototype.set
          set: function set (key, value) {
            return define(this, key === 0 ? 0 : key, value)
          }
        } : {
          // `Set.prototype.add(value)` method
          // https://tc39.es/ecma262/#sec-set.prototype.add
          add: function add (value) {
            return define(this, value = value === 0 ? 0 : value, value)
          }
        })
        if (DESCRIPTORS) {
          defineProperty(C.prototype, 'size', {
            get: function () {
              return getInternalState(this).size
            }
          })
        }
        return C
      },
      setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
        const ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator'
        const getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME)
        const getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME)
        // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
        // https://tc39.es/ecma262/#sec-map.prototype.entries
        // https://tc39.es/ecma262/#sec-map.prototype.keys
        // https://tc39.es/ecma262/#sec-map.prototype.values
        // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
        // https://tc39.es/ecma262/#sec-set.prototype.entries
        // https://tc39.es/ecma262/#sec-set.prototype.keys
        // https://tc39.es/ecma262/#sec-set.prototype.values
        // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
        defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
          setInternalState(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind: kind,
            last: undefined
          })
        }, function () {
          const state = getInternalIteratorState(this)
          const kind = state.kind
          let entry = state.last
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous
          // get next entry
          if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
            // or finish the iteration
            state.target = undefined
            return { value: undefined, done: true }
          }
          // return step by kind
          if (kind == 'keys') return { value: entry.key, done: false }
          if (kind == 'values') return { value: entry.value, done: false }
          return { value: [entry.key, entry.value], done: false }
        }, IS_MAP ? 'entries' : 'values', !IS_MAP, true)

        // `{ Map, Set }.prototype[@@species]` accessors
        // https://tc39.es/ecma262/#sec-get-map-@@species
        // https://tc39.es/ecma262/#sec-get-set-@@species
        setSpecies(CONSTRUCTOR_NAME)
      }
    }
  }, { '../internals/an-instance': 5, '../internals/define-iterator': 40, '../internals/descriptors': 42, '../internals/function-bind-context': 60, '../internals/internal-metadata': 76, '../internals/internal-state': 77, '../internals/iterate': 85, '../internals/object-create': 104, '../internals/object-define-property': 106, '../internals/redefine-all': 123, '../internals/set-species': 134 }],
  28: [function (require, module, exports) {
    'use strict'
    const redefineAll = require('../internals/redefine-all')
    const getWeakData = require('../internals/internal-metadata').getWeakData
    const anObject = require('../internals/an-object')
    const isObject = require('../internals/is-object')
    const anInstance = require('../internals/an-instance')
    const iterate = require('../internals/iterate')
    const ArrayIterationModule = require('../internals/array-iteration')
    const $has = require('../internals/has')
    const InternalStateModule = require('../internals/internal-state')

    const setInternalState = InternalStateModule.set
    const internalStateGetterFor = InternalStateModule.getterFor
    const find = ArrayIterationModule.find
    const findIndex = ArrayIterationModule.findIndex
    let id = 0

    // fallback for uncaught frozen keys
    const uncaughtFrozenStore = function (store) {
      return store.frozen || (store.frozen = new UncaughtFrozenStore())
    }

    var UncaughtFrozenStore = function () {
      this.entries = []
    }

    const findUncaughtFrozen = function (store, key) {
      return find(store.entries, function (it) {
        return it[0] === key
      })
    }

    UncaughtFrozenStore.prototype = {
      get: function (key) {
        const entry = findUncaughtFrozen(this, key)
        if (entry) return entry[1]
      },
      has: function (key) {
        return !!findUncaughtFrozen(this, key)
      },
      set: function (key, value) {
        const entry = findUncaughtFrozen(this, key)
        if (entry) entry[1] = value
        else this.entries.push([key, value])
      },
      delete: function (key) {
        const index = findIndex(this.entries, function (it) {
          return it[0] === key
        })
        if (~index) this.entries.splice(index, 1)
        return !!~index
      }
    }

    module.exports = {
      getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var C = wrapper(function (that, iterable) {
          anInstance(that, C, CONSTRUCTOR_NAME)
          setInternalState(that, {
            type: CONSTRUCTOR_NAME,
            id: id++,
            frozen: undefined
          })
          if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP })
        })

        const getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME)

        const define = function (that, key, value) {
          const state = getInternalState(that)
          const data = getWeakData(anObject(key), true)
          if (data === true) uncaughtFrozenStore(state).set(key, value)
          else data[state.id] = value
          return that
        }

        redefineAll(C.prototype, {
          // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
          // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
          // https://tc39.es/ecma262/#sec-weakset.prototype.delete
          delete: function (key) {
            const state = getInternalState(this)
            if (!isObject(key)) return false
            const data = getWeakData(key)
            if (data === true) return uncaughtFrozenStore(state).delete(key)
            return data && $has(data, state.id) && delete data[state.id]
          },
          // `{ WeakMap, WeakSet }.prototype.has(key)` methods
          // https://tc39.es/ecma262/#sec-weakmap.prototype.has
          // https://tc39.es/ecma262/#sec-weakset.prototype.has
          has: function has (key) {
            const state = getInternalState(this)
            if (!isObject(key)) return false
            const data = getWeakData(key)
            if (data === true) return uncaughtFrozenStore(state).has(key)
            return data && $has(data, state.id)
          }
        })

        redefineAll(C.prototype, IS_MAP ? {
          // `WeakMap.prototype.get(key)` method
          // https://tc39.es/ecma262/#sec-weakmap.prototype.get
          get: function get (key) {
            const state = getInternalState(this)
            if (isObject(key)) {
              const data = getWeakData(key)
              if (data === true) return uncaughtFrozenStore(state).get(key)
              return data ? data[state.id] : undefined
            }
          },
          // `WeakMap.prototype.set(key, value)` method
          // https://tc39.es/ecma262/#sec-weakmap.prototype.set
          set: function set (key, value) {
            return define(this, key, value)
          }
        } : {
          // `WeakSet.prototype.add(value)` method
          // https://tc39.es/ecma262/#sec-weakset.prototype.add
          add: function add (value) {
            return define(this, value, true)
          }
        })

        return C
      }
    }
  }, { '../internals/an-instance': 5, '../internals/an-object': 6, '../internals/array-iteration': 15, '../internals/has': 67, '../internals/internal-metadata': 76, '../internals/internal-state': 77, '../internals/is-object': 82, '../internals/iterate': 85, '../internals/redefine-all': 123 }],
  29: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const isForced = require('../internals/is-forced')
    const redefine = require('../internals/redefine')
    const InternalMetadataModule = require('../internals/internal-metadata')
    const iterate = require('../internals/iterate')
    const anInstance = require('../internals/an-instance')
    const isObject = require('../internals/is-object')
    const fails = require('../internals/fails')
    const checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration')
    const setToStringTag = require('../internals/set-to-string-tag')
    const inheritIfRequired = require('../internals/inherit-if-required')

    module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
      const IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1
      const IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1
      const ADDER = IS_MAP ? 'set' : 'add'
      const NativeConstructor = global[CONSTRUCTOR_NAME]
      const NativePrototype = NativeConstructor && NativeConstructor.prototype
      let Constructor = NativeConstructor
      const exported = {}

      const fixMethod = function (KEY) {
        const nativeMethod = NativePrototype[KEY]
        redefine(NativePrototype, KEY,
          KEY == 'add'
            ? function add (value) {
              nativeMethod.call(this, value === 0 ? 0 : value)
              return this
            }
            : KEY == 'delete'
              ? function (key) {
                return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key)
              }
              : KEY == 'get'
                ? function get (key) {
                  return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key)
                }
                : KEY == 'has'
                  ? function has (key) {
                    return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key)
                  }
                  : function set (key, value) {
                    nativeMethod.call(this, key === 0 ? 0 : key, value)
                    return this
                  }
        )
      }

      const REPLACE = isForced(
        CONSTRUCTOR_NAME,
        typeof NativeConstructor !== 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
          new NativeConstructor().entries().next()
        }))
      )

      if (REPLACE) {
        // create collection constructor
        Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER)
        InternalMetadataModule.REQUIRED = true
      } else if (isForced(CONSTRUCTOR_NAME, true)) {
        const instance = new Constructor()
        // early implementations not supports chaining
        const HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
        // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
        const THROWS_ON_PRIMITIVES = fails(function () { instance.has(1) })
        // most early implementations doesn't supports iterables, most modern - not close it correctly
        // eslint-disable-next-line no-new -- required for testing
        const ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable) })
        // for early implementations -0 and +0 not the same
        const BUGGY_ZERO = !IS_WEAK && fails(function () {
          // V8 ~ Chromium 42- fails only with 5+ elements
          const $instance = new NativeConstructor()
          let index = 5
          while (index--) $instance[ADDER](index, index)
          return !$instance.has(-0)
        })

        if (!ACCEPT_ITERABLES) {
          Constructor = wrapper(function (dummy, iterable) {
            anInstance(dummy, Constructor, CONSTRUCTOR_NAME)
            const that = inheritIfRequired(new NativeConstructor(), dummy, Constructor)
            if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP })
            return that
          })
          Constructor.prototype = NativePrototype
          NativePrototype.constructor = Constructor
        }

        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod('delete')
          fixMethod('has')
          IS_MAP && fixMethod('get')
        }

        if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER)

        // weak collections should not contains .clear method
        if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear
      }

      exported[CONSTRUCTOR_NAME] = Constructor
      $({ global: true, forced: Constructor != NativeConstructor }, exported)

      setToStringTag(Constructor, CONSTRUCTOR_NAME)

      if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP)

      return Constructor
    }
  }, { '../internals/an-instance': 5, '../internals/check-correctness-of-iteration': 23, '../internals/export': 55, '../internals/fails': 56, '../internals/global': 66, '../internals/inherit-if-required': 74, '../internals/internal-metadata': 76, '../internals/is-forced': 80, '../internals/is-object': 82, '../internals/iterate': 85, '../internals/redefine': 124, '../internals/set-to-string-tag': 135 }],
  30: [function (require, module, exports) {
    const has = require('../internals/has')
    const ownKeys = require('../internals/own-keys')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const definePropertyModule = require('../internals/object-define-property')

    module.exports = function (target, source) {
      const keys = ownKeys(source)
      const defineProperty = definePropertyModule.f
      const getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key))
      }
    }
  }, { '../internals/has': 67, '../internals/object-define-property': 106, '../internals/object-get-own-property-descriptor': 107, '../internals/own-keys': 119 }],
  31: [function (require, module, exports) {
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const MATCH = wellKnownSymbol('match')

    module.exports = function (METHOD_NAME) {
      const regexp = /./
      try {
        '/./'[METHOD_NAME](regexp)
      } catch (error1) {
        try {
          regexp[MATCH] = false
          return '/./'[METHOD_NAME](regexp)
        } catch (error2) { /* empty */ }
      } return false
    }
  }, { '../internals/well-known-symbol': 167 }],
  32: [function (require, module, exports) {
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      function F () { /* empty */ }
      F.prototype.constructor = null
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype
    })
  }, { '../internals/fails': 56 }],
  33: [function (require, module, exports) {
    const requireObjectCoercible = require('../internals/require-object-coercible')

    const quot = /"/g

    // `CreateHTML` abstract operation
    // https://tc39.es/ecma262/#sec-createhtml
    module.exports = function (string, tag, attribute, value) {
      const S = String(requireObjectCoercible(string))
      let p1 = '<' + tag
      if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"'
      return p1 + '>' + S + '</' + tag + '>'
    }
  }, { '../internals/require-object-coercible': 131 }],
  34: [function (require, module, exports) {
    'use strict'
    const IteratorPrototype = require('../internals/iterators-core').IteratorPrototype
    const create = require('../internals/object-create')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const setToStringTag = require('../internals/set-to-string-tag')
    const Iterators = require('../internals/iterators')

    const returnThis = function () { return this }

    module.exports = function (IteratorConstructor, NAME, next) {
      const TO_STRING_TAG = NAME + ' Iterator'
      IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) })
      setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true)
      Iterators[TO_STRING_TAG] = returnThis
      return IteratorConstructor
    }
  }, { '../internals/create-property-descriptor': 36, '../internals/iterators': 88, '../internals/iterators-core': 87, '../internals/object-create': 104, '../internals/set-to-string-tag': 135 }],
  35: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const definePropertyModule = require('../internals/object-define-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = DESCRIPTORS
      ? function (object, key, value) {
        return definePropertyModule.f(object, key, createPropertyDescriptor(1, value))
      }
      : function (object, key, value) {
        object[key] = value
        return object
      }
  }, { '../internals/create-property-descriptor': 36, '../internals/descriptors': 42, '../internals/object-define-property': 106 }],
  36: [function (require, module, exports) {
    module.exports = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      }
    }
  }, {}],
  37: [function (require, module, exports) {
    'use strict'
    const toPrimitive = require('../internals/to-primitive')
    const definePropertyModule = require('../internals/object-define-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = function (object, key, value) {
      const propertyKey = toPrimitive(key)
      if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value))
      else object[propertyKey] = value
    }
  }, { '../internals/create-property-descriptor': 36, '../internals/object-define-property': 106, '../internals/to-primitive': 158 }],
  38: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')
    const padStart = require('../internals/string-pad').start

    const abs = Math.abs
    const DatePrototype = Date.prototype
    const getTime = DatePrototype.getTime
    const nativeDateToISOString = DatePrototype.toISOString

    // `Date.prototype.toISOString` method implementation
    // https://tc39.es/ecma262/#sec-date.prototype.toisostring
    // PhantomJS / old WebKit fails here:
    module.exports = (fails(function () {
      return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z'
    }) || !fails(function () {
      nativeDateToISOString.call(new Date(NaN))
    }))
      ? function toISOString () {
        if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value')
        const date = this
        const year = date.getUTCFullYear()
        const milliseconds = date.getUTCMilliseconds()
        const sign = year < 0 ? '-' : year > 9999 ? '+' : ''
        return sign + padStart(abs(year), sign ? 6 : 4, 0) +
    '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
    '-' + padStart(date.getUTCDate(), 2, 0) +
    'T' + padStart(date.getUTCHours(), 2, 0) +
    ':' + padStart(date.getUTCMinutes(), 2, 0) +
    ':' + padStart(date.getUTCSeconds(), 2, 0) +
    '.' + padStart(milliseconds, 3, 0) +
    'Z'
      }
      : nativeDateToISOString
  }, { '../internals/fails': 56, '../internals/string-pad': 143 }],
  39: [function (require, module, exports) {
    'use strict'
    const anObject = require('../internals/an-object')
    const toPrimitive = require('../internals/to-primitive')

    // `Date.prototype[@@toPrimitive](hint)` method implementation
    // https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
    module.exports = function (hint) {
      if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
        throw TypeError('Incorrect hint')
      } return toPrimitive(anObject(this), hint !== 'number')
    }
  }, { '../internals/an-object': 6, '../internals/to-primitive': 158 }],
  40: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createIteratorConstructor = require('../internals/create-iterator-constructor')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const setPrototypeOf = require('../internals/object-set-prototype-of')
    const setToStringTag = require('../internals/set-to-string-tag')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const redefine = require('../internals/redefine')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IS_PURE = require('../internals/is-pure')
    const Iterators = require('../internals/iterators')
    const IteratorsCore = require('../internals/iterators-core')

    const IteratorPrototype = IteratorsCore.IteratorPrototype
    const BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS
    const ITERATOR = wellKnownSymbol('iterator')
    const KEYS = 'keys'
    const VALUES = 'values'
    const ENTRIES = 'entries'

    const returnThis = function () { return this }

    module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
      createIteratorConstructor(IteratorConstructor, NAME, next)

      const getIterationMethod = function (KIND) {
        if (KIND === DEFAULT && defaultIterator) return defaultIterator
        if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND]
        switch (KIND) {
          case KEYS: return function keys () { return new IteratorConstructor(this, KIND) }
          case VALUES: return function values () { return new IteratorConstructor(this, KIND) }
          case ENTRIES: return function entries () { return new IteratorConstructor(this, KIND) }
        } return function () { return new IteratorConstructor(this) }
      }

      const TO_STRING_TAG = NAME + ' Iterator'
      let INCORRECT_VALUES_NAME = false
      var IterablePrototype = Iterable.prototype
      const nativeIterator = IterablePrototype[ITERATOR] ||
    IterablePrototype['@@iterator'] ||
    DEFAULT && IterablePrototype[DEFAULT]
      var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT)
      const anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator
      let CurrentIteratorPrototype, methods, KEY

      // fix native
      if (anyNativeIterator) {
        CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()))
        if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
          if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
            if (setPrototypeOf) {
              setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype)
            } else if (typeof CurrentIteratorPrototype[ITERATOR] !== 'function') {
              createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis)
            }
          }
          // Set @@toStringTag to native iterators
          setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true)
          if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis
        }
      }

      // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
      if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
        INCORRECT_VALUES_NAME = true
        defaultIterator = function values () { return nativeIterator.call(this) }
      }

      // define iterator
      if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
        createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator)
      }
      Iterators[NAME] = defaultIterator

      // export additional methods
      if (DEFAULT) {
        methods = {
          values: getIterationMethod(VALUES),
          keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
          entries: getIterationMethod(ENTRIES)
        }
        if (FORCED) {
          for (KEY in methods) {
            if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
              redefine(IterablePrototype, KEY, methods[KEY])
            }
          }
        } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods)
      }

      return methods
    }
  }, { '../internals/create-iterator-constructor': 34, '../internals/create-non-enumerable-property': 35, '../internals/export': 55, '../internals/is-pure': 83, '../internals/iterators': 88, '../internals/iterators-core': 87, '../internals/object-get-prototype-of': 111, '../internals/object-set-prototype-of': 116, '../internals/redefine': 124, '../internals/set-to-string-tag': 135, '../internals/well-known-symbol': 167 }],
  41: [function (require, module, exports) {
    const path = require('../internals/path')
    const has = require('../internals/has')
    const wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped')
    const defineProperty = require('../internals/object-define-property').f

    module.exports = function (NAME) {
      const Symbol = path.Symbol || (path.Symbol = {})
      if (!has(Symbol, NAME)) {
        defineProperty(Symbol, NAME, {
          value: wrappedWellKnownSymbolModule.f(NAME)
        })
      }
    }
  }, { '../internals/has': 67, '../internals/object-define-property': 106, '../internals/path': 120, '../internals/well-known-symbol-wrapped': 166 }],
  42: [function (require, module, exports) {
    const fails = require('../internals/fails')

    // Detect IE8's incomplete defineProperty implementation
    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7 } })[1] != 7
    })
  }, { '../internals/fails': 56 }],
  43: [function (require, module, exports) {
    const global = require('../internals/global')
    const isObject = require('../internals/is-object')

    const document = global.document
    // typeof document.createElement is 'object' in old IE
    const EXISTS = isObject(document) && isObject(document.createElement)

    module.exports = function (it) {
      return EXISTS ? document.createElement(it) : {}
    }
  }, { '../internals/global': 66, '../internals/is-object': 82 }],
  44: [function (require, module, exports) {
    // iterable DOM collections
    // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
    module.exports = {
      CSSRuleList: 0,
      CSSStyleDeclaration: 0,
      CSSValueList: 0,
      ClientRectList: 0,
      DOMRectList: 0,
      DOMStringList: 0,
      DOMTokenList: 1,
      DataTransferItemList: 0,
      FileList: 0,
      HTMLAllCollection: 0,
      HTMLCollection: 0,
      HTMLFormElement: 0,
      HTMLSelectElement: 0,
      MediaList: 0,
      MimeTypeArray: 0,
      NamedNodeMap: 0,
      NodeList: 1,
      PaintRequestList: 0,
      Plugin: 0,
      PluginArray: 0,
      SVGLengthList: 0,
      SVGNumberList: 0,
      SVGPathSegList: 0,
      SVGPointList: 0,
      SVGStringList: 0,
      SVGTransformList: 0,
      SourceBufferList: 0,
      StyleSheetList: 0,
      TextTrackCueList: 0,
      TextTrackList: 0,
      TouchList: 0
    }
  }, {}],
  45: [function (require, module, exports) {
    const userAgent = require('../internals/engine-user-agent')

    const firefox = userAgent.match(/firefox\/(\d+)/i)

    module.exports = !!firefox && +firefox[1]
  }, { '../internals/engine-user-agent': 51 }],
  46: [function (require, module, exports) {
    module.exports = typeof window === 'object'
  }, {}],
  47: [function (require, module, exports) {
    const UA = require('../internals/engine-user-agent')

    module.exports = /MSIE|Trident/.test(UA)
  }, { '../internals/engine-user-agent': 51 }],
  48: [function (require, module, exports) {
    const userAgent = require('../internals/engine-user-agent')

    module.exports = /(?:iphone|ipod|ipad).*applewebkit/i.test(userAgent)
  }, { '../internals/engine-user-agent': 51 }],
  49: [function (require, module, exports) {
    const classof = require('../internals/classof-raw')
    const global = require('../internals/global')

    module.exports = classof(global.process) == 'process'
  }, { '../internals/classof-raw': 24, '../internals/global': 66 }],
  50: [function (require, module, exports) {
    const userAgent = require('../internals/engine-user-agent')

    module.exports = /web0s(?!.*chrome)/i.test(userAgent)
  }, { '../internals/engine-user-agent': 51 }],
  51: [function (require, module, exports) {
    const getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('navigator', 'userAgent') || ''
  }, { '../internals/get-built-in': 62 }],
  52: [function (require, module, exports) {
    const global = require('../internals/global')
    const userAgent = require('../internals/engine-user-agent')

    const process = global.process
    const versions = process && process.versions
    const v8 = versions && versions.v8
    let match, version

    if (v8) {
      match = v8.split('.')
      version = match[0] < 4 ? 1 : match[0] + match[1]
    } else if (userAgent) {
      match = userAgent.match(/Edge\/(\d+)/)
      if (!match || match[1] >= 74) {
        match = userAgent.match(/Chrome\/(\d+)/)
        if (match) version = match[1]
      }
    }

    module.exports = version && +version
  }, { '../internals/engine-user-agent': 51, '../internals/global': 66 }],
  53: [function (require, module, exports) {
    const userAgent = require('../internals/engine-user-agent')

    const webkit = userAgent.match(/AppleWebKit\/(\d+)\./)

    module.exports = !!webkit && +webkit[1]
  }, { '../internals/engine-user-agent': 51 }],
  54: [function (require, module, exports) {
    // IE8- don't enum bug keys
    module.exports = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ]
  }, {}],
  55: [function (require, module, exports) {
    const global = require('../internals/global')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const redefine = require('../internals/redefine')
    const setGlobal = require('../internals/set-global')
    const copyConstructorProperties = require('../internals/copy-constructor-properties')
    const isForced = require('../internals/is-forced')

    /*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
    module.exports = function (options, source) {
      const TARGET = options.target
      const GLOBAL = options.global
      const STATIC = options.stat
      let FORCED, target, key, targetProperty, sourceProperty, descriptor
      if (GLOBAL) {
        target = global
      } else if (STATIC) {
        target = global[TARGET] || setGlobal(TARGET, {})
      } else {
        target = (global[TARGET] || {}).prototype
      }
      if (target) {
        for (key in source) {
          sourceProperty = source[key]
          if (options.noTargetGet) {
            descriptor = getOwnPropertyDescriptor(target, key)
            targetProperty = descriptor && descriptor.value
          } else targetProperty = target[key]
          FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced)
          // contained in target
          if (!FORCED && targetProperty !== undefined) {
            if (typeof sourceProperty === typeof targetProperty) continue
            copyConstructorProperties(sourceProperty, targetProperty)
          }
          // add a flag to not completely full polyfills
          if (options.sham || (targetProperty && targetProperty.sham)) {
            createNonEnumerableProperty(sourceProperty, 'sham', true)
          }
          // extend global
          redefine(target, key, sourceProperty, options)
        }
      }
    }
  }, { '../internals/copy-constructor-properties': 30, '../internals/create-non-enumerable-property': 35, '../internals/global': 66, '../internals/is-forced': 80, '../internals/object-get-own-property-descriptor': 107, '../internals/redefine': 124, '../internals/set-global': 133 }],
  56: [function (require, module, exports) {
    module.exports = function (exec) {
      try {
        return !!exec()
      } catch (error) {
        return true
      }
    }
  }, {}],
  57: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4` since it's moved to entry points
    require('../modules/es.regexp.exec')
    const redefine = require('../internals/redefine')
    const regexpExec = require('../internals/regexp-exec')
    const fails = require('../internals/fails')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')

    const SPECIES = wellKnownSymbol('species')
    const RegExpPrototype = RegExp.prototype

    module.exports = function (KEY, exec, FORCED, SHAM) {
      const SYMBOL = wellKnownSymbol(KEY)

      const DELEGATES_TO_SYMBOL = !fails(function () {
        // String methods call symbol-named RegEp methods
        const O = {}
        O[SYMBOL] = function () { return 7 }
        return ''[KEY](O) != 7
      })

      const DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
        // Symbol-named RegExp methods call .exec
        let execCalled = false
        let re = /a/

        if (KEY === 'split') {
          // We can't use real regex here since it causes deoptimization
          // and serious performance degradation in V8
          // https://github.com/zloirock/core-js/issues/306
          re = {}
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {}
          re.constructor[SPECIES] = function () { return re }
          re.flags = ''
          re[SYMBOL] = /./[SYMBOL]
        }

        re.exec = function () { execCalled = true; return null }

        re[SYMBOL]('')
        return !execCalled
      })

      if (
        !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
      ) {
        const nativeRegExpMethod = /./[SYMBOL]
        const methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
          const $exec = regexp.exec
          if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) }
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) }
          }
          return { done: false }
        })

        redefine(String.prototype, KEY, methods[0])
        redefine(RegExpPrototype, SYMBOL, methods[1])
      }

      if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true)
    }
  }, { '../internals/create-non-enumerable-property': 35, '../internals/fails': 56, '../internals/redefine': 124, '../internals/regexp-exec': 126, '../internals/well-known-symbol': 167, '../modules/es.regexp.exec': 296 }],
  58: [function (require, module, exports) {
    'use strict'
    const isArray = require('../internals/is-array')
    const toLength = require('../internals/to-length')
    const bind = require('../internals/function-bind-context')

    // `FlattenIntoArray` abstract operation
    // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
    var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
      let targetIndex = start
      let sourceIndex = 0
      const mapFn = mapper ? bind(mapper, thisArg, 3) : false
      let element

      while (sourceIndex < sourceLen) {
        if (sourceIndex in source) {
          element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex]

          if (depth > 0 && isArray(element)) {
            targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1
          } else {
            if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length')
            target[targetIndex] = element
          }

          targetIndex++
        }
        sourceIndex++
      }
      return targetIndex
    }

    module.exports = flattenIntoArray
  }, { '../internals/function-bind-context': 60, '../internals/is-array': 79, '../internals/to-length': 154 }],
  59: [function (require, module, exports) {
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
      return Object.isExtensible(Object.preventExtensions({}))
    })
  }, { '../internals/fails': 56 }],
  60: [function (require, module, exports) {
    const aFunction = require('../internals/a-function')

    // optional / simple context binding
    module.exports = function (fn, that, length) {
      aFunction(fn)
      if (that === undefined) return fn
      switch (length) {
        case 0: return function () {
          return fn.call(that)
        }
        case 1: return function (a) {
          return fn.call(that, a)
        }
        case 2: return function (a, b) {
          return fn.call(that, a, b)
        }
        case 3: return function (a, b, c) {
          return fn.call(that, a, b, c)
        }
      }
      return function (/* ...args */) {
        return fn.apply(that, arguments)
      }
    }
  }, { '../internals/a-function': 1 }],
  61: [function (require, module, exports) {
    'use strict'
    const aFunction = require('../internals/a-function')
    const isObject = require('../internals/is-object')

    const slice = [].slice
    const factories = {}

    const construct = function (C, argsLength, args) {
      if (!(argsLength in factories)) {
        for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']'
        // eslint-disable-next-line no-new-func -- we have no proper alternatives, IE8- only
        factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')')
      } return factories[argsLength](C, args)
    }

    // `Function.prototype.bind` method implementation
    // https://tc39.es/ecma262/#sec-function.prototype.bind
    module.exports = Function.bind || function bind (that /* , ...args */) {
      const fn = aFunction(this)
      const partArgs = slice.call(arguments, 1)
      var boundFunction = function bound (/* args... */) {
        const args = partArgs.concat(slice.call(arguments))
        return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args)
      }
      if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype
      return boundFunction
    }
  }, { '../internals/a-function': 1, '../internals/is-object': 82 }],
  62: [function (require, module, exports) {
    const path = require('../internals/path')
    const global = require('../internals/global')

    const aFunction = function (variable) {
      return typeof variable === 'function' ? variable : undefined
    }

    module.exports = function (namespace, method) {
      return arguments.length < 2
        ? aFunction(path[namespace]) || aFunction(global[namespace])
        : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method]
    }
  }, { '../internals/global': 66, '../internals/path': 120 }],
  63: [function (require, module, exports) {
    const classof = require('../internals/classof')
    const Iterators = require('../internals/iterators')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')

    module.exports = function (it) {
      if (it != undefined) {
        return it[ITERATOR] ||
    it['@@iterator'] ||
    Iterators[classof(it)]
      }
    }
  }, { '../internals/classof': 25, '../internals/iterators': 88, '../internals/well-known-symbol': 167 }],
  64: [function (require, module, exports) {
    const anObject = require('../internals/an-object')
    const getIteratorMethod = require('../internals/get-iterator-method')

    module.exports = function (it) {
      const iteratorMethod = getIteratorMethod(it)
      if (typeof iteratorMethod !== 'function') {
        throw TypeError(String(it) + ' is not iterable')
      } return anObject(iteratorMethod.call(it))
    }
  }, { '../internals/an-object': 6, '../internals/get-iterator-method': 63 }],
  65: [function (require, module, exports) {
    const toObject = require('../internals/to-object')

    const floor = Math.floor
    const replace = ''.replace
    const SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g
    const SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g

    // `GetSubstitution` abstract operation
    // https://tc39.es/ecma262/#sec-getsubstitution
    module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
      const tailPos = position + matched.length
      const m = captures.length
      let symbols = SUBSTITUTION_SYMBOLS_NO_NAMED
      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures)
        symbols = SUBSTITUTION_SYMBOLS
      }
      return replace.call(replacement, symbols, function (match, ch) {
        let capture
        switch (ch.charAt(0)) {
          case '$': return '$'
          case '&': return matched
          case '`': return str.slice(0, position)
          case "'": return str.slice(tailPos)
          case '<':
            capture = namedCaptures[ch.slice(1, -1)]
            break
          default: // \d\d?
            var n = +ch
            if (n === 0) return match
            if (n > m) {
              const f = floor(n / 10)
              if (f === 0) return match
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1)
              return match
            }
            capture = captures[n - 1]
        }
        return capture === undefined ? '' : capture
      })
    }
  }, { '../internals/to-object': 155 }],
  66: [function (require, module, exports) {
    (function (global) {
      (function () {
        const check = function (it) {
          return it && it.Math == Math && it
        }

        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis === 'object' && globalThis) ||
  check(typeof window === 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self === 'object' && self) ||
  check(typeof global === 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this })() || Function('return this')()
      }).call(this)
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {}],
  67: [function (require, module, exports) {
    const toObject = require('../internals/to-object')

    const hasOwnProperty = {}.hasOwnProperty

    module.exports = Object.hasOwn || function hasOwn (it, key) {
      return hasOwnProperty.call(toObject(it), key)
    }
  }, { '../internals/to-object': 155 }],
  68: [function (require, module, exports) {
    module.exports = {}
  }, {}],
  69: [function (require, module, exports) {
    const global = require('../internals/global')

    module.exports = function (a, b) {
      const console = global.console
      if (console && console.error) {
        arguments.length === 1 ? console.error(a) : console.error(a, b)
      }
    }
  }, { '../internals/global': 66 }],
  70: [function (require, module, exports) {
    const getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('document', 'documentElement')
  }, { '../internals/get-built-in': 62 }],
  71: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const fails = require('../internals/fails')
    const createElement = require('../internals/document-create-element')

    // Thank's IE8 for his funny defineProperty
    module.exports = !DESCRIPTORS && !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
      return Object.defineProperty(createElement('div'), 'a', {
        get: function () { return 7 }
      }).a != 7
    })
  }, { '../internals/descriptors': 42, '../internals/document-create-element': 43, '../internals/fails': 56 }],
  72: [function (require, module, exports) {
    // IEEE754 conversions based on https://github.com/feross/ieee754
    const abs = Math.abs
    const pow = Math.pow
    const floor = Math.floor
    const log = Math.log
    const LN2 = Math.LN2

    const pack = function (number, mantissaLength, bytes) {
      const buffer = new Array(bytes)
      let exponentLength = bytes * 8 - mantissaLength - 1
      const eMax = (1 << exponentLength) - 1
      const eBias = eMax >> 1
      const rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0
      const sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0
      let index = 0
      let exponent, mantissa, c
      number = abs(number)
      // eslint-disable-next-line no-self-compare -- NaN check
      if (number != number || number === Infinity) {
        // eslint-disable-next-line no-self-compare -- NaN check
        mantissa = number != number ? 1 : 0
        exponent = eMax
      } else {
        exponent = floor(log(number) / LN2)
        if (number * (c = pow(2, -exponent)) < 1) {
          exponent--
          c *= 2
        }
        if (exponent + eBias >= 1) {
          number += rt / c
        } else {
          number += rt * pow(2, 1 - eBias)
        }
        if (number * c >= 2) {
          exponent++
          c /= 2
        }
        if (exponent + eBias >= eMax) {
          mantissa = 0
          exponent = eMax
        } else if (exponent + eBias >= 1) {
          mantissa = (number * c - 1) * pow(2, mantissaLength)
          exponent = exponent + eBias
        } else {
          mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength)
          exponent = 0
        }
      }
      for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
      exponent = exponent << mantissaLength | mantissa
      exponentLength += mantissaLength
      for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
      buffer[--index] |= sign * 128
      return buffer
    }

    const unpack = function (buffer, mantissaLength) {
      const bytes = buffer.length
      const exponentLength = bytes * 8 - mantissaLength - 1
      const eMax = (1 << exponentLength) - 1
      const eBias = eMax >> 1
      let nBits = exponentLength - 7
      let index = bytes - 1
      let sign = buffer[index--]
      let exponent = sign & 127
      let mantissa
      sign >>= 7
      for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
      mantissa = exponent & (1 << -nBits) - 1
      exponent >>= -nBits
      nBits += mantissaLength
      for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
      if (exponent === 0) {
        exponent = 1 - eBias
      } else if (exponent === eMax) {
        return mantissa ? NaN : sign ? -Infinity : Infinity
      } else {
        mantissa = mantissa + pow(2, mantissaLength)
        exponent = exponent - eBias
      } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength)
    }

    module.exports = {
      pack: pack,
      unpack: unpack
    }
  }, {}],
  73: [function (require, module, exports) {
    const fails = require('../internals/fails')
    const classof = require('../internals/classof-raw')

    const split = ''.split

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    module.exports = fails(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins -- safe
      return !Object('z').propertyIsEnumerable(0)
    }) ? function (it) {
        return classof(it) == 'String' ? split.call(it, '') : Object(it)
      } : Object
  }, { '../internals/classof-raw': 24, '../internals/fails': 56 }],
  74: [function (require, module, exports) {
    const isObject = require('../internals/is-object')
    const setPrototypeOf = require('../internals/object-set-prototype-of')

    // makes subclassing work correct for wrapped built-ins
    module.exports = function ($this, dummy, Wrapper) {
      let NewTarget, NewTargetPrototype
      if (
      // it can work only with native `setPrototypeOf`
        setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) === 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
      ) setPrototypeOf($this, NewTargetPrototype)
      return $this
    }
  }, { '../internals/is-object': 82, '../internals/object-set-prototype-of': 116 }],
  75: [function (require, module, exports) {
    const store = require('../internals/shared-store')

    const functionToString = Function.toString

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (typeof store.inspectSource !== 'function') {
      store.inspectSource = function (it) {
        return functionToString.call(it)
      }
    }

    module.exports = store.inspectSource
  }, { '../internals/shared-store': 137 }],
  76: [function (require, module, exports) {
    const hiddenKeys = require('../internals/hidden-keys')
    const isObject = require('../internals/is-object')
    const has = require('../internals/has')
    const defineProperty = require('../internals/object-define-property').f
    const uid = require('../internals/uid')
    const FREEZING = require('../internals/freezing')

    const METADATA = uid('meta')
    let id = 0

    // eslint-disable-next-line es/no-object-isextensible -- safe
    const isExtensible = Object.isExtensible || function () {
      return true
    }

    const setMetadata = function (it) {
      defineProperty(it, METADATA, {
        value: {
          objectID: 'O' + id++, // object ID
          weakData: {} // weak collections IDs
        }
      })
    }

    const fastKey = function (it, create) {
      // return a primitive with prefix
      if (!isObject(it)) return typeof it === 'symbol' ? it : (typeof it === 'string' ? 'S' : 'P') + it
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return 'F'
        // not necessary to add metadata
        if (!create) return 'E'
        // add missing metadata
        setMetadata(it)
        // return object ID
      } return it[METADATA].objectID
    }

    const getWeakData = function (it, create) {
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true
        // not necessary to add metadata
        if (!create) return false
        // add missing metadata
        setMetadata(it)
        // return the store of weak collections IDs
      } return it[METADATA].weakData
    }

    // add metadata on freeze-family methods calling
    const onFreeze = function (it) {
      if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it)
      return it
    }

    var meta = module.exports = {
      REQUIRED: false,
      fastKey: fastKey,
      getWeakData: getWeakData,
      onFreeze: onFreeze
    }

    hiddenKeys[METADATA] = true
  }, { '../internals/freezing': 59, '../internals/has': 67, '../internals/hidden-keys': 68, '../internals/is-object': 82, '../internals/object-define-property': 106, '../internals/uid': 164 }],
  77: [function (require, module, exports) {
    const NATIVE_WEAK_MAP = require('../internals/native-weak-map')
    const global = require('../internals/global')
    const isObject = require('../internals/is-object')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const objectHas = require('../internals/has')
    const shared = require('../internals/shared-store')
    const sharedKey = require('../internals/shared-key')
    const hiddenKeys = require('../internals/hidden-keys')

    const OBJECT_ALREADY_INITIALIZED = 'Object already initialized'
    const WeakMap = global.WeakMap
    let set, get, has

    const enforce = function (it) {
      return has(it) ? get(it) : set(it, {})
    }

    const getterFor = function (TYPE) {
      return function (it) {
        let state
        if (!isObject(it) || (state = get(it)).type !== TYPE) {
          throw TypeError('Incompatible receiver, ' + TYPE + ' required')
        } return state
      }
    }

    if (NATIVE_WEAK_MAP || shared.state) {
      const store = shared.state || (shared.state = new WeakMap())
      const wmget = store.get
      const wmhas = store.has
      const wmset = store.set
      set = function (it, metadata) {
        if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED)
        metadata.facade = it
        wmset.call(store, it, metadata)
        return metadata
      }
      get = function (it) {
        return wmget.call(store, it) || {}
      }
      has = function (it) {
        return wmhas.call(store, it)
      }
    } else {
      const STATE = sharedKey('state')
      hiddenKeys[STATE] = true
      set = function (it, metadata) {
        if (objectHas(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED)
        metadata.facade = it
        createNonEnumerableProperty(it, STATE, metadata)
        return metadata
      }
      get = function (it) {
        return objectHas(it, STATE) ? it[STATE] : {}
      }
      has = function (it) {
        return objectHas(it, STATE)
      }
    }

    module.exports = {
      set: set,
      get: get,
      has: has,
      enforce: enforce,
      getterFor: getterFor
    }
  }, { '../internals/create-non-enumerable-property': 35, '../internals/global': 66, '../internals/has': 67, '../internals/hidden-keys': 68, '../internals/is-object': 82, '../internals/native-weak-map': 97, '../internals/shared-key': 136, '../internals/shared-store': 137 }],
  78: [function (require, module, exports) {
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const Iterators = require('../internals/iterators')

    const ITERATOR = wellKnownSymbol('iterator')
    const ArrayPrototype = Array.prototype

    // check on default Array iterator
    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
    }
  }, { '../internals/iterators': 88, '../internals/well-known-symbol': 167 }],
  79: [function (require, module, exports) {
    const classof = require('../internals/classof-raw')

    // `IsArray` abstract operation
    // https://tc39.es/ecma262/#sec-isarray
    // eslint-disable-next-line es/no-array-isarray -- safe
    module.exports = Array.isArray || function isArray (arg) {
      return classof(arg) == 'Array'
    }
  }, { '../internals/classof-raw': 24 }],
  80: [function (require, module, exports) {
    const fails = require('../internals/fails')

    const replacement = /#|\.prototype\./

    const isForced = function (feature, detection) {
      const value = data[normalize(feature)]
      return value == POLYFILL
        ? true
        : value == NATIVE
          ? false
          : typeof detection === 'function'
            ? fails(detection)
            : !!detection
    }

    var normalize = isForced.normalize = function (string) {
      return String(string).replace(replacement, '.').toLowerCase()
    }

    var data = isForced.data = {}
    var NATIVE = isForced.NATIVE = 'N'
    var POLYFILL = isForced.POLYFILL = 'P'

    module.exports = isForced
  }, { '../internals/fails': 56 }],
  81: [function (require, module, exports) {
    const isObject = require('../internals/is-object')

    const floor = Math.floor

    // `Number.isInteger` method implementation
    // https://tc39.es/ecma262/#sec-number.isinteger
    module.exports = function isInteger (it) {
      return !isObject(it) && isFinite(it) && floor(it) === it
    }
  }, { '../internals/is-object': 82 }],
  82: [function (require, module, exports) {
    module.exports = function (it) {
      return typeof it === 'object' ? it !== null : typeof it === 'function'
    }
  }, {}],
  83: [function (require, module, exports) {
    module.exports = false
  }, {}],
  84: [function (require, module, exports) {
    const isObject = require('../internals/is-object')
    const classof = require('../internals/classof-raw')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const MATCH = wellKnownSymbol('match')

    // `IsRegExp` abstract operation
    // https://tc39.es/ecma262/#sec-isregexp
    module.exports = function (it) {
      let isRegExp
      return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp')
    }
  }, { '../internals/classof-raw': 24, '../internals/is-object': 82, '../internals/well-known-symbol': 167 }],
  85: [function (require, module, exports) {
    const anObject = require('../internals/an-object')
    const isArrayIteratorMethod = require('../internals/is-array-iterator-method')
    const toLength = require('../internals/to-length')
    const bind = require('../internals/function-bind-context')
    const getIteratorMethod = require('../internals/get-iterator-method')
    const iteratorClose = require('../internals/iterator-close')

    const Result = function (stopped, result) {
      this.stopped = stopped
      this.result = result
    }

    module.exports = function (iterable, unboundFunction, options) {
      const that = options && options.that
      const AS_ENTRIES = !!(options && options.AS_ENTRIES)
      const IS_ITERATOR = !!(options && options.IS_ITERATOR)
      const INTERRUPTED = !!(options && options.INTERRUPTED)
      const fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED)
      let iterator, iterFn, index, length, result, next, step

      const stop = function (condition) {
        if (iterator) iteratorClose(iterator)
        return new Result(true, condition)
      }

      const callFn = function (value) {
        if (AS_ENTRIES) {
          anObject(value)
          return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1])
        } return INTERRUPTED ? fn(value, stop) : fn(value)
      }

      if (IS_ITERATOR) {
        iterator = iterable
      } else {
        iterFn = getIteratorMethod(iterable)
        if (typeof iterFn !== 'function') throw TypeError('Target is not iterable')
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
          for (index = 0, length = toLength(iterable.length); length > index; index++) {
            result = callFn(iterable[index])
            if (result && result instanceof Result) return result
          } return new Result(false)
        }
        iterator = iterFn.call(iterable)
      }

      next = iterator.next
      while (!(step = next.call(iterator)).done) {
        try {
          result = callFn(step.value)
        } catch (error) {
          iteratorClose(iterator)
          throw error
        }
        if (typeof result === 'object' && result && result instanceof Result) return result
      } return new Result(false)
    }
  }, { '../internals/an-object': 6, '../internals/function-bind-context': 60, '../internals/get-iterator-method': 63, '../internals/is-array-iterator-method': 78, '../internals/iterator-close': 86, '../internals/to-length': 154 }],
  86: [function (require, module, exports) {
    const anObject = require('../internals/an-object')

    module.exports = function (iterator) {
      const returnMethod = iterator.return
      if (returnMethod !== undefined) {
        return anObject(returnMethod.call(iterator)).value
      }
    }
  }, { '../internals/an-object': 6 }],
  87: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const has = require('../internals/has')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IS_PURE = require('../internals/is-pure')

    const ITERATOR = wellKnownSymbol('iterator')
    let BUGGY_SAFARI_ITERATORS = false

    const returnThis = function () { return this }

    // `%IteratorPrototype%` object
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
    let IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator

    /* eslint-disable es/no-array-prototype-keys -- safe */
    if ([].keys) {
      arrayIterator = [].keys()
      // Safari 8 has buggy iterators w/o `next`
      if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true
      else {
        PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator))
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype
      }
    }

    const NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
      const test = {}
      // FF44- legacy iterators case
      return IteratorPrototype[ITERATOR].call(test) !== test
    })

    if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {}

    // `%IteratorPrototype%[@@iterator]()` method
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
    if ((!IS_PURE || NEW_ITERATOR_PROTOTYPE) && !has(IteratorPrototype, ITERATOR)) {
      createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis)
    }

    module.exports = {
      IteratorPrototype: IteratorPrototype,
      BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
    }
  }, { '../internals/create-non-enumerable-property': 35, '../internals/fails': 56, '../internals/has': 67, '../internals/is-pure': 83, '../internals/object-get-prototype-of': 111, '../internals/well-known-symbol': 167 }],
  88: [function (require, module, exports) {
    arguments[4][68][0].apply(exports, arguments)
  }, { dup: 68 }],
  89: [function (require, module, exports) {
    // eslint-disable-next-line es/no-math-expm1 -- safe
    const $expm1 = Math.expm1
    const exp = Math.exp

    // `Math.expm1` method implementation
    // https://tc39.es/ecma262/#sec-math.expm1
    module.exports = (!$expm1 ||
  // Old FF bug
  $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168 ||
  // Tor Browser bug
  $expm1(-2e-17) != -2e-17
    ) ? function expm1 (x) {
        return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1
      } : $expm1
  }, {}],
  90: [function (require, module, exports) {
    const sign = require('../internals/math-sign')

    const abs = Math.abs
    const pow = Math.pow
    const EPSILON = pow(2, -52)
    const EPSILON32 = pow(2, -23)
    const MAX32 = pow(2, 127) * (2 - EPSILON32)
    const MIN32 = pow(2, -126)

    const roundTiesToEven = function (n) {
      return n + 1 / EPSILON - 1 / EPSILON
    }

    // `Math.fround` method implementation
    // https://tc39.es/ecma262/#sec-math.fround
    // eslint-disable-next-line es/no-math-fround -- safe
    module.exports = Math.fround || function fround (x) {
      const $abs = abs(x)
      const $sign = sign(x)
      let a, result
      if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32
      a = (1 + EPSILON32 / EPSILON) * $abs
      result = a - (a - $abs)
      // eslint-disable-next-line no-self-compare -- NaN check
      if (result > MAX32 || result != result) return $sign * Infinity
      return $sign * result
    }
  }, { '../internals/math-sign': 92 }],
  91: [function (require, module, exports) {
    const log = Math.log

    // `Math.log1p` method implementation
    // https://tc39.es/ecma262/#sec-math.log1p
    // eslint-disable-next-line es/no-math-log1p -- safe
    module.exports = Math.log1p || function log1p (x) {
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x)
    }
  }, {}],
  92: [function (require, module, exports) {
    // `Math.sign` method implementation
    // https://tc39.es/ecma262/#sec-math.sign
    // eslint-disable-next-line es/no-math-sign -- safe
    module.exports = Math.sign || function sign (x) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1
    }
  }, {}],
  93: [function (require, module, exports) {
    const global = require('../internals/global')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const macrotask = require('../internals/task').set
    const IS_IOS = require('../internals/engine-is-ios')
    const IS_WEBOS_WEBKIT = require('../internals/engine-is-webos-webkit')
    const IS_NODE = require('../internals/engine-is-node')

    const MutationObserver = global.MutationObserver || global.WebKitMutationObserver
    const document = global.document
    const process = global.process
    const Promise = global.Promise
    // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
    const queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask')
    const queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value

    let flush, head, last, notify, toggle, node, promise, then

    // modern engines have queueMicrotask method
    if (!queueMicrotask) {
      flush = function () {
        let parent, fn
        if (IS_NODE && (parent = process.domain)) parent.exit()
        while (head) {
          fn = head.fn
          head = head.next
          try {
            fn()
          } catch (error) {
            if (head) notify()
            else last = undefined
            throw error
          }
        } last = undefined
        if (parent) parent.enter()
      }

      // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
      // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
      if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
        toggle = true
        node = document.createTextNode('')
        new MutationObserver(flush).observe(node, { characterData: true })
        notify = function () {
          node.data = toggle = !toggle
        }
      // environments with maybe non-completely correct, but existent Promise
      } else if (Promise && Promise.resolve) {
        // Promise.resolve without an argument throws an error in LG WebOS 2
        promise = Promise.resolve(undefined)
        // workaround of WebKit ~ iOS Safari 10.1 bug
        promise.constructor = Promise
        then = promise.then
        notify = function () {
          then.call(promise, flush)
        }
      // Node.js without promises
      } else if (IS_NODE) {
        notify = function () {
          process.nextTick(flush)
        }
      // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout
      } else {
        notify = function () {
          // strange IE + webpack dev server bug - use .call(global)
          macrotask.call(global, flush)
        }
      }
    }

    module.exports = queueMicrotask || function (fn) {
      const task = { fn: fn, next: undefined }
      if (last) last.next = task
      if (!head) {
        head = task
        notify()
      } last = task
    }
  }, { '../internals/engine-is-ios': 48, '../internals/engine-is-node': 49, '../internals/engine-is-webos-webkit': 50, '../internals/global': 66, '../internals/object-get-own-property-descriptor': 107, '../internals/task': 148 }],
  94: [function (require, module, exports) {
    const global = require('../internals/global')

    module.exports = global.Promise
  }, { '../internals/global': 66 }],
  95: [function (require, module, exports) {
    /* eslint-disable es/no-symbol -- required for testing */
    const V8_VERSION = require('../internals/engine-v8-version')
    const fails = require('../internals/fails')

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
      const symbol = Symbol()
      // Chrome 38 Symbol has incorrect toString conversion
      // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
      return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41
    })
  }, { '../internals/engine-v8-version': 52, '../internals/fails': 56 }],
  96: [function (require, module, exports) {
    const fails = require('../internals/fails')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IS_PURE = require('../internals/is-pure')

    const ITERATOR = wellKnownSymbol('iterator')

    module.exports = !fails(function () {
      const url = new URL('b?a=1&b=2&c=3', 'http://a')
      const searchParams = url.searchParams
      let result = ''
      url.pathname = 'c%20d'
      searchParams.forEach(function (value, key) {
        searchParams.delete('b')
        result += key + value
      })
      return (IS_PURE && !url.toJSON) ||
    !searchParams.sort ||
    url.href !== 'http://a/c%20d?a=1&c=3' ||
    searchParams.get('c') !== '3' ||
    String(new URLSearchParams('?a=1')) !== 'a=1' ||
    !searchParams[ITERATOR] ||
    // throws in Edge
    new URL('https://a@b').username !== 'a' ||
    new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b' ||
    // not punycoded in Edge
    new URL('http://тест').host !== 'xn--e1aybc' ||
    // not escaped in Chrome 62-
    new URL('http://a#б').hash !== '#%D0%B1' ||
    // fails in Chrome 66-
    result !== 'a1c3' ||
    // throws in Safari
    new URL('http://x', undefined).host !== 'x'
    })
  }, { '../internals/fails': 56, '../internals/is-pure': 83, '../internals/well-known-symbol': 167 }],
  97: [function (require, module, exports) {
    const global = require('../internals/global')
    const inspectSource = require('../internals/inspect-source')

    const WeakMap = global.WeakMap

    module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap))
  }, { '../internals/global': 66, '../internals/inspect-source': 75 }],
  98: [function (require, module, exports) {
    'use strict'
    const aFunction = require('../internals/a-function')

    const PromiseCapability = function (C) {
      let resolve, reject
      this.promise = new C(function ($$resolve, $$reject) {
        if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor')
        resolve = $$resolve
        reject = $$reject
      })
      this.resolve = aFunction(resolve)
      this.reject = aFunction(reject)
    }

    // `NewPromiseCapability` abstract operation
    // https://tc39.es/ecma262/#sec-newpromisecapability
    module.exports.f = function (C) {
      return new PromiseCapability(C)
    }
  }, { '../internals/a-function': 1 }],
  99: [function (require, module, exports) {
    const isRegExp = require('../internals/is-regexp')

    module.exports = function (it) {
      if (isRegExp(it)) {
        throw TypeError("The method doesn't accept regular expressions")
      } return it
    }
  }, { '../internals/is-regexp': 84 }],
  100: [function (require, module, exports) {
    const global = require('../internals/global')

    const globalIsFinite = global.isFinite

    // `Number.isFinite` method
    // https://tc39.es/ecma262/#sec-number.isfinite
    // eslint-disable-next-line es/no-number-isfinite -- safe
    module.exports = Number.isFinite || function isFinite (it) {
      return typeof it === 'number' && globalIsFinite(it)
    }
  }, { '../internals/global': 66 }],
  101: [function (require, module, exports) {
    const global = require('../internals/global')
    const trim = require('../internals/string-trim').trim
    const whitespaces = require('../internals/whitespaces')

    const $parseFloat = global.parseFloat
    const FORCED = 1 / $parseFloat(whitespaces + '-0') !== -Infinity

    // `parseFloat` method
    // https://tc39.es/ecma262/#sec-parsefloat-string
    module.exports = FORCED
      ? function parseFloat (string) {
        const trimmedString = trim(String(string))
        const result = $parseFloat(trimmedString)
        return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result
      }
      : $parseFloat
  }, { '../internals/global': 66, '../internals/string-trim': 147, '../internals/whitespaces': 168 }],
  102: [function (require, module, exports) {
    const global = require('../internals/global')
    const trim = require('../internals/string-trim').trim
    const whitespaces = require('../internals/whitespaces')

    const $parseInt = global.parseInt
    const hex = /^[+-]?0[Xx]/
    const FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22

    // `parseInt` method
    // https://tc39.es/ecma262/#sec-parseint-string-radix
    module.exports = FORCED
      ? function parseInt (string, radix) {
        const S = trim(String(string))
        return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10))
      }
      : $parseInt
  }, { '../internals/global': 66, '../internals/string-trim': 147, '../internals/whitespaces': 168 }],
  103: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const fails = require('../internals/fails')
    const objectKeys = require('../internals/object-keys')
    const getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols')
    const propertyIsEnumerableModule = require('../internals/object-property-is-enumerable')
    const toObject = require('../internals/to-object')
    const IndexedObject = require('../internals/indexed-object')

    // eslint-disable-next-line es/no-object-assign -- safe
    const $assign = Object.assign
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    const defineProperty = Object.defineProperty

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    module.exports = !$assign || fails(function () {
      // should have correct order of operations (Edge bug)
      if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
        enumerable: true,
        get: function () {
          defineProperty(this, 'b', {
            value: 3,
            enumerable: false
          })
        }
      }), { b: 2 })).b !== 1) return true
      // should work with symbols and should have deterministic property order (V8 bug)
      const A = {}
      const B = {}
      // eslint-disable-next-line es/no-symbol -- safe
      const symbol = Symbol()
      const alphabet = 'abcdefghijklmnopqrst'
      A[symbol] = 7
      alphabet.split('').forEach(function (chr) { B[chr] = chr })
      return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet
    }) ? function assign (target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
        const T = toObject(target)
        const argumentsLength = arguments.length
        let index = 1
        const getOwnPropertySymbols = getOwnPropertySymbolsModule.f
        const propertyIsEnumerable = propertyIsEnumerableModule.f
        while (argumentsLength > index) {
          const S = IndexedObject(arguments[index++])
          const keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S)
          const length = keys.length
          let j = 0
          var key
          while (length > j) {
            key = keys[j++]
            if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key]
          }
        } return T
      } : $assign
  }, { '../internals/descriptors': 42, '../internals/fails': 56, '../internals/indexed-object': 73, '../internals/object-get-own-property-symbols': 110, '../internals/object-keys': 113, '../internals/object-property-is-enumerable': 114, '../internals/to-object': 155 }],
  104: [function (require, module, exports) {
    const anObject = require('../internals/an-object')
    const defineProperties = require('../internals/object-define-properties')
    const enumBugKeys = require('../internals/enum-bug-keys')
    const hiddenKeys = require('../internals/hidden-keys')
    const html = require('../internals/html')
    const documentCreateElement = require('../internals/document-create-element')
    const sharedKey = require('../internals/shared-key')

    const GT = '>'
    const LT = '<'
    const PROTOTYPE = 'prototype'
    const SCRIPT = 'script'
    const IE_PROTO = sharedKey('IE_PROTO')

    const EmptyConstructor = function () { /* empty */ }

    const scriptTag = function (content) {
      return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT
    }

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    const NullProtoObjectViaActiveX = function (activeXDocument) {
      activeXDocument.write(scriptTag(''))
      activeXDocument.close()
      const temp = activeXDocument.parentWindow.Object
      activeXDocument = null // avoid memory leak
      return temp
    }

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    const NullProtoObjectViaIFrame = function () {
      // Thrash, waste and sodomy: IE GC bug
      const iframe = documentCreateElement('iframe')
      const JS = 'java' + SCRIPT + ':'
      let iframeDocument
      iframe.style.display = 'none'
      html.appendChild(iframe)
      // https://github.com/zloirock/core-js/issues/475
      iframe.src = String(JS)
      iframeDocument = iframe.contentWindow.document
      iframeDocument.open()
      iframeDocument.write(scriptTag('document.F=Object'))
      iframeDocument.close()
      return iframeDocument.F
    }

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    // avoid IE GC bug
    let activeXDocument
    var NullProtoObject = function () {
      try {
        /* global ActiveXObject -- old IE */
        activeXDocument = document.domain && new ActiveXObject('htmlfile')
      } catch (error) { /* ignore */ }
      NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame()
      let length = enumBugKeys.length
      while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]]
      return NullProtoObject()
    }

    hiddenKeys[IE_PROTO] = true

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    module.exports = Object.create || function create (O, Properties) {
      let result
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O)
        result = new EmptyConstructor()
        EmptyConstructor[PROTOTYPE] = null
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O
      } else result = NullProtoObject()
      return Properties === undefined ? result : defineProperties(result, Properties)
    }
  }, { '../internals/an-object': 6, '../internals/document-create-element': 43, '../internals/enum-bug-keys': 54, '../internals/hidden-keys': 68, '../internals/html': 70, '../internals/object-define-properties': 105, '../internals/shared-key': 136 }],
  105: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const definePropertyModule = require('../internals/object-define-property')
    const anObject = require('../internals/an-object')
    const objectKeys = require('../internals/object-keys')

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    module.exports = DESCRIPTORS
      ? Object.defineProperties
      : function defineProperties (O, Properties) {
        anObject(O)
        const keys = objectKeys(Properties)
        const length = keys.length
        let index = 0
        let key
        while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key])
        return O
      }
  }, { '../internals/an-object': 6, '../internals/descriptors': 42, '../internals/object-define-property': 106, '../internals/object-keys': 113 }],
  106: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const IE8_DOM_DEFINE = require('../internals/ie8-dom-define')
    const anObject = require('../internals/an-object')
    const toPrimitive = require('../internals/to-primitive')

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    const $defineProperty = Object.defineProperty

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    exports.f = DESCRIPTORS ? $defineProperty : function defineProperty (O, P, Attributes) {
      anObject(O)
      P = toPrimitive(P, true)
      anObject(Attributes)
      if (IE8_DOM_DEFINE) {
        try {
          return $defineProperty(O, P, Attributes)
        } catch (error) { /* empty */ }
      }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported')
      if ('value' in Attributes) O[P] = Attributes.value
      return O
    }
  }, { '../internals/an-object': 6, '../internals/descriptors': 42, '../internals/ie8-dom-define': 71, '../internals/to-primitive': 158 }],
  107: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const propertyIsEnumerableModule = require('../internals/object-property-is-enumerable')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const toIndexedObject = require('../internals/to-indexed-object')
    const toPrimitive = require('../internals/to-primitive')
    const has = require('../internals/has')
    const IE8_DOM_DEFINE = require('../internals/ie8-dom-define')

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    const $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor (O, P) {
      O = toIndexedObject(O)
      P = toPrimitive(P, true)
      if (IE8_DOM_DEFINE) {
        try {
          return $getOwnPropertyDescriptor(O, P)
        } catch (error) { /* empty */ }
      }
      if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P])
    }
  }, { '../internals/create-property-descriptor': 36, '../internals/descriptors': 42, '../internals/has': 67, '../internals/ie8-dom-define': 71, '../internals/object-property-is-enumerable': 114, '../internals/to-indexed-object': 152, '../internals/to-primitive': 158 }],
  108: [function (require, module, exports) {
    /* eslint-disable es/no-object-getownpropertynames -- safe */
    const toIndexedObject = require('../internals/to-indexed-object')
    const $getOwnPropertyNames = require('../internals/object-get-own-property-names').f

    const toString = {}.toString

    const windowNames = typeof window === 'object' && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window)
      : []

    const getWindowNames = function (it) {
      try {
        return $getOwnPropertyNames(it)
      } catch (error) {
        return windowNames.slice()
      }
    }

    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    module.exports.f = function getOwnPropertyNames (it) {
      return windowNames && toString.call(it) == '[object Window]'
        ? getWindowNames(it)
        : $getOwnPropertyNames(toIndexedObject(it))
    }
  }, { '../internals/object-get-own-property-names': 109, '../internals/to-indexed-object': 152 }],
  109: [function (require, module, exports) {
    const internalObjectKeys = require('../internals/object-keys-internal')
    const enumBugKeys = require('../internals/enum-bug-keys')

    const hiddenKeys = enumBugKeys.concat('length', 'prototype')

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames (O) {
      return internalObjectKeys(O, hiddenKeys)
    }
  }, { '../internals/enum-bug-keys': 54, '../internals/object-keys-internal': 112 }],
  110: [function (require, module, exports) {
    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    exports.f = Object.getOwnPropertySymbols
  }, {}],
  111: [function (require, module, exports) {
    const has = require('../internals/has')
    const toObject = require('../internals/to-object')
    const sharedKey = require('../internals/shared-key')
    const CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter')

    const IE_PROTO = sharedKey('IE_PROTO')
    const ObjectPrototype = Object.prototype

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    // eslint-disable-next-line es/no-object-getprototypeof -- safe
    module.exports = CORRECT_PROTOTYPE_GETTER
      ? Object.getPrototypeOf
      : function (O) {
        O = toObject(O)
        if (has(O, IE_PROTO)) return O[IE_PROTO]
        if (typeof O.constructor === 'function' && O instanceof O.constructor) {
          return O.constructor.prototype
        } return O instanceof Object ? ObjectPrototype : null
      }
  }, { '../internals/correct-prototype-getter': 32, '../internals/has': 67, '../internals/shared-key': 136, '../internals/to-object': 155 }],
  112: [function (require, module, exports) {
    const has = require('../internals/has')
    const toIndexedObject = require('../internals/to-indexed-object')
    const indexOf = require('../internals/array-includes').indexOf
    const hiddenKeys = require('../internals/hidden-keys')

    module.exports = function (object, names) {
      const O = toIndexedObject(object)
      let i = 0
      const result = []
      let key
      for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key)
      // Don't enum bug & hidden keys
      while (names.length > i) {
        if (has(O, key = names[i++])) {
          ~indexOf(result, key) || result.push(key)
        }
      }
      return result
    }
  }, { '../internals/array-includes': 14, '../internals/has': 67, '../internals/hidden-keys': 68, '../internals/to-indexed-object': 152 }],
  113: [function (require, module, exports) {
    const internalObjectKeys = require('../internals/object-keys-internal')
    const enumBugKeys = require('../internals/enum-bug-keys')

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    module.exports = Object.keys || function keys (O) {
      return internalObjectKeys(O, enumBugKeys)
    }
  }, { '../internals/enum-bug-keys': 54, '../internals/object-keys-internal': 112 }],
  114: [function (require, module, exports) {
    'use strict'
    const $propertyIsEnumerable = {}.propertyIsEnumerable
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

    // Nashorn ~ JDK8 bug
    const NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1)

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    exports.f = NASHORN_BUG
      ? function propertyIsEnumerable (V) {
        const descriptor = getOwnPropertyDescriptor(this, V)
        return !!descriptor && descriptor.enumerable
      }
      : $propertyIsEnumerable
  }, {}],
  115: [function (require, module, exports) {
    'use strict'
    const IS_PURE = require('../internals/is-pure')
    const global = require('../internals/global')
    const fails = require('../internals/fails')
    const WEBKIT = require('../internals/engine-webkit-version')

    // Forced replacement object prototype accessors methods
    module.exports = IS_PURE || !fails(function () {
      // This feature detection crashes old WebKit
      // https://github.com/zloirock/core-js/issues/232
      if (WEBKIT && WEBKIT < 535) return
      const key = Math.random()
      // In FF throws only define methods
      // eslint-disable-next-line no-undef, no-useless-call -- required for testing
      __defineSetter__.call(null, key, function () { /* empty */ })
      delete global[key]
    })
  }, { '../internals/engine-webkit-version': 53, '../internals/fails': 56, '../internals/global': 66, '../internals/is-pure': 83 }],
  116: [function (require, module, exports) {
    /* eslint-disable no-proto -- safe */
    const anObject = require('../internals/an-object')
    const aPossiblePrototype = require('../internals/a-possible-prototype')

    // `Object.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.setprototypeof
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    // eslint-disable-next-line es/no-object-setprototypeof -- safe
    module.exports = Object.setPrototypeOf || ('__proto__' in {} ? (function () {
      let CORRECT_SETTER = false
      const test = {}
      let setter
      try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set
        setter.call(test, [])
        CORRECT_SETTER = test instanceof Array
      } catch (error) { /* empty */ }
      return function setPrototypeOf (O, proto) {
        anObject(O)
        aPossiblePrototype(proto)
        if (CORRECT_SETTER) setter.call(O, proto)
        else O.__proto__ = proto
        return O
      }
    }()) : undefined)
  }, { '../internals/a-possible-prototype': 2, '../internals/an-object': 6 }],
  117: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const objectKeys = require('../internals/object-keys')
    const toIndexedObject = require('../internals/to-indexed-object')
    const propertyIsEnumerable = require('../internals/object-property-is-enumerable').f

    // `Object.{ entries, values }` methods implementation
    const createMethod = function (TO_ENTRIES) {
      return function (it) {
        const O = toIndexedObject(it)
        const keys = objectKeys(O)
        const length = keys.length
        let i = 0
        const result = []
        let key
        while (length > i) {
          key = keys[i++]
          if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
            result.push(TO_ENTRIES ? [key, O[key]] : O[key])
          }
        }
        return result
      }
    }

    module.exports = {
      // `Object.entries` method
      // https://tc39.es/ecma262/#sec-object.entries
      entries: createMethod(true),
      // `Object.values` method
      // https://tc39.es/ecma262/#sec-object.values
      values: createMethod(false)
    }
  }, { '../internals/descriptors': 42, '../internals/object-keys': 113, '../internals/object-property-is-enumerable': 114, '../internals/to-indexed-object': 152 }],
  118: [function (require, module, exports) {
    'use strict'
    const TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support')
    const classof = require('../internals/classof')

    // `Object.prototype.toString` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    module.exports = TO_STRING_TAG_SUPPORT
      ? {}.toString
      : function toString () {
        return '[object ' + classof(this) + ']'
      }
  }, { '../internals/classof': 25, '../internals/to-string-tag-support': 159 }],
  119: [function (require, module, exports) {
    const getBuiltIn = require('../internals/get-built-in')
    const getOwnPropertyNamesModule = require('../internals/object-get-own-property-names')
    const getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols')
    const anObject = require('../internals/an-object')

    // all object keys, includes non-enumerable and symbols
    module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys (it) {
      const keys = getOwnPropertyNamesModule.f(anObject(it))
      const getOwnPropertySymbols = getOwnPropertySymbolsModule.f
      return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys
    }
  }, { '../internals/an-object': 6, '../internals/get-built-in': 62, '../internals/object-get-own-property-names': 109, '../internals/object-get-own-property-symbols': 110 }],
  120: [function (require, module, exports) {
    const global = require('../internals/global')

    module.exports = global
  }, { '../internals/global': 66 }],
  121: [function (require, module, exports) {
    module.exports = function (exec) {
      try {
        return { error: false, value: exec() }
      } catch (error) {
        return { error: true, value: error }
      }
    }
  }, {}],
  122: [function (require, module, exports) {
    const anObject = require('../internals/an-object')
    const isObject = require('../internals/is-object')
    const newPromiseCapability = require('../internals/new-promise-capability')

    module.exports = function (C, x) {
      anObject(C)
      if (isObject(x) && x.constructor === C) return x
      const promiseCapability = newPromiseCapability.f(C)
      const resolve = promiseCapability.resolve
      resolve(x)
      return promiseCapability.promise
    }
  }, { '../internals/an-object': 6, '../internals/is-object': 82, '../internals/new-promise-capability': 98 }],
  123: [function (require, module, exports) {
    const redefine = require('../internals/redefine')

    module.exports = function (target, src, options) {
      for (const key in src) redefine(target, key, src[key], options)
      return target
    }
  }, { '../internals/redefine': 124 }],
  124: [function (require, module, exports) {
    const global = require('../internals/global')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const has = require('../internals/has')
    const setGlobal = require('../internals/set-global')
    const inspectSource = require('../internals/inspect-source')
    const InternalStateModule = require('../internals/internal-state')

    const getInternalState = InternalStateModule.get
    const enforceInternalState = InternalStateModule.enforce
    const TEMPLATE = String(String).split('String');

    (module.exports = function (O, key, value, options) {
      const unsafe = options ? !!options.unsafe : false
      let simple = options ? !!options.enumerable : false
      const noTargetGet = options ? !!options.noTargetGet : false
      let state
      if (typeof value === 'function') {
        if (typeof key === 'string' && !has(value, 'name')) {
          createNonEnumerableProperty(value, 'name', key)
        }
        state = enforceInternalState(value)
        if (!state.source) {
          state.source = TEMPLATE.join(typeof key === 'string' ? key : '')
        }
      }
      if (O === global) {
        if (simple) O[key] = value
        else setGlobal(key, value)
        return
      } else if (!unsafe) {
        delete O[key]
      } else if (!noTargetGet && O[key]) {
        simple = true
      }
      if (simple) O[key] = value
      else createNonEnumerableProperty(O, key, value)
      // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, 'toString', function toString () {
      return typeof this === 'function' && getInternalState(this).source || inspectSource(this)
    })
  }, { '../internals/create-non-enumerable-property': 35, '../internals/global': 66, '../internals/has': 67, '../internals/inspect-source': 75, '../internals/internal-state': 77, '../internals/set-global': 133 }],
  125: [function (require, module, exports) {
    const classof = require('./classof-raw')
    const regexpExec = require('./regexp-exec')

    // `RegExpExec` abstract operation
    // https://tc39.es/ecma262/#sec-regexpexec
    module.exports = function (R, S) {
      const exec = R.exec
      if (typeof exec === 'function') {
        const result = exec.call(R, S)
        if (typeof result !== 'object') {
          throw TypeError('RegExp exec method returned something other than an Object or null')
        }
        return result
      }

      if (classof(R) !== 'RegExp') {
        throw TypeError('RegExp#exec called on incompatible receiver')
      }

      return regexpExec.call(R, S)
    }
  }, { './classof-raw': 24, './regexp-exec': 126 }],
  126: [function (require, module, exports) {
    'use strict'
    /* eslint-disable regexp/no-assertion-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
    /* eslint-disable regexp/no-useless-quantifier -- testing */
    const regexpFlags = require('../internals/regexp-flags')
    const stickyHelpers = require('../internals/regexp-sticky-helpers')
    const shared = require('../internals/shared')
    const create = require('../internals/object-create')
    const getInternalState = require('../internals/internal-state').get
    const UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all')
    const UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg')

    const nativeExec = RegExp.prototype.exec
    const nativeReplace = shared('native-string-replace', String.prototype.replace)

    let patchedExec = nativeExec

    const UPDATES_LAST_INDEX_WRONG = (function () {
      const re1 = /a/
      const re2 = /b*/g
      nativeExec.call(re1, 'a')
      nativeExec.call(re2, 'a')
      return re1.lastIndex !== 0 || re2.lastIndex !== 0
    })()

    const UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET

    // nonparticipating capturing group, copied from es5-shim's String#split patch.
    const NPCG_INCLUDED = /()??/.exec('')[1] !== undefined

    const PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG

    if (PATCH) {
      // eslint-disable-next-line max-statements -- TODO
      patchedExec = function exec (str) {
        const re = this
        const state = getInternalState(re)
        const raw = state.raw
        let result, reCopy, lastIndex, match, i, object, group

        if (raw) {
          raw.lastIndex = re.lastIndex
          result = patchedExec.call(raw, str)
          re.lastIndex = raw.lastIndex
          return result
        }

        const groups = state.groups
        const sticky = UNSUPPORTED_Y && re.sticky
        let flags = regexpFlags.call(re)
        let source = re.source
        let charsAdded = 0
        let strCopy = str

        if (sticky) {
          flags = flags.replace('y', '')
          if (flags.indexOf('g') === -1) {
            flags += 'g'
          }

          strCopy = String(str).slice(re.lastIndex)
          // Support anchored sticky behavior.
          if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
            source = '(?: ' + source + ')'
            strCopy = ' ' + strCopy
            charsAdded++
          }
          // ^(? + rx + ) is needed, in combination with some str slicing, to
          // simulate the 'y' flag.
          reCopy = new RegExp('^(?:' + source + ')', flags)
        }

        if (NPCG_INCLUDED) {
          reCopy = new RegExp('^' + source + '$(?!\\s)', flags)
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex

        match = nativeExec.call(sticky ? reCopy : re, strCopy)

        if (sticky) {
          if (match) {
            match.input = match.input.slice(charsAdded)
            match[0] = match[0].slice(charsAdded)
            match.index = re.lastIndex
            re.lastIndex += match[0].length
          } else re.lastIndex = 0
        } else if (UPDATES_LAST_INDEX_WRONG && match) {
          re.lastIndex = re.global ? match.index + match[0].length : lastIndex
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
          // Fix browsers whose `exec` methods don't consistently return `undefined`
          // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
          nativeReplace.call(match[0], reCopy, function () {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined
            }
          })
        }

        if (match && groups) {
          match.groups = object = create(null)
          for (i = 0; i < groups.length; i++) {
            group = groups[i]
            object[group[0]] = match[group[1]]
          }
        }

        return match
      }
    }

    module.exports = patchedExec
  }, { '../internals/internal-state': 77, '../internals/object-create': 104, '../internals/regexp-flags': 127, '../internals/regexp-sticky-helpers': 128, '../internals/regexp-unsupported-dot-all': 129, '../internals/regexp-unsupported-ncg': 130, '../internals/shared': 138 }],
  127: [function (require, module, exports) {
    'use strict'
    const anObject = require('../internals/an-object')

    // `RegExp.prototype.flags` getter implementation
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
    module.exports = function () {
      const that = anObject(this)
      let result = ''
      if (that.global) result += 'g'
      if (that.ignoreCase) result += 'i'
      if (that.multiline) result += 'm'
      if (that.dotAll) result += 's'
      if (that.unicode) result += 'u'
      if (that.sticky) result += 'y'
      return result
    }
  }, { '../internals/an-object': 6 }],
  128: [function (require, module, exports) {
    const fails = require('../internals/fails')

    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
    const RE = function (s, f) {
      return RegExp(s, f)
    }

    exports.UNSUPPORTED_Y = fails(function () {
      const re = RE('a', 'y')
      re.lastIndex = 2
      return re.exec('abcd') != null
    })

    exports.BROKEN_CARET = fails(function () {
      // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
      const re = RE('^r', 'gy')
      re.lastIndex = 2
      return re.exec('str') != null
    })
  }, { '../internals/fails': 56 }],
  129: [function (require, module, exports) {
    const fails = require('./fails')

    module.exports = fails(function () {
      // babel-minify transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
      const re = RegExp('.', (typeof '').charAt(0))
      return !(re.dotAll && re.exec('\n') && re.flags === 's')
    })
  }, { './fails': 56 }],
  130: [function (require, module, exports) {
    const fails = require('./fails')

    module.exports = fails(function () {
      // babel-minify transpiles RegExp('.', 'g') -> /./g and it causes SyntaxError
      const re = RegExp('(?<a>b)', (typeof '').charAt(5))
      return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc'
    })
  }, { './fails': 56 }],
  131: [function (require, module, exports) {
    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    module.exports = function (it) {
      if (it == undefined) throw TypeError("Can't call method on " + it)
      return it
    }
  }, {}],
  132: [function (require, module, exports) {
    // `SameValue` abstract operation
    // https://tc39.es/ecma262/#sec-samevalue
    // eslint-disable-next-line es/no-object-is -- safe
    module.exports = Object.is || function is (x, y) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y
    }
  }, {}],
  133: [function (require, module, exports) {
    const global = require('../internals/global')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')

    module.exports = function (key, value) {
      try {
        createNonEnumerableProperty(global, key, value)
      } catch (error) {
        global[key] = value
      } return value
    }
  }, { '../internals/create-non-enumerable-property': 35, '../internals/global': 66 }],
  134: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')
    const definePropertyModule = require('../internals/object-define-property')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const DESCRIPTORS = require('../internals/descriptors')

    const SPECIES = wellKnownSymbol('species')

    module.exports = function (CONSTRUCTOR_NAME) {
      const Constructor = getBuiltIn(CONSTRUCTOR_NAME)
      const defineProperty = definePropertyModule.f

      if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
        defineProperty(Constructor, SPECIES, {
          configurable: true,
          get: function () { return this }
        })
      }
    }
  }, { '../internals/descriptors': 42, '../internals/get-built-in': 62, '../internals/object-define-property': 106, '../internals/well-known-symbol': 167 }],
  135: [function (require, module, exports) {
    const defineProperty = require('../internals/object-define-property').f
    const has = require('../internals/has')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')

    module.exports = function (it, TAG, STATIC) {
      if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
        defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG })
      }
    }
  }, { '../internals/has': 67, '../internals/object-define-property': 106, '../internals/well-known-symbol': 167 }],
  136: [function (require, module, exports) {
    const shared = require('../internals/shared')
    const uid = require('../internals/uid')

    const keys = shared('keys')

    module.exports = function (key) {
      return keys[key] || (keys[key] = uid(key))
    }
  }, { '../internals/shared': 138, '../internals/uid': 164 }],
  137: [function (require, module, exports) {
    const global = require('../internals/global')
    const setGlobal = require('../internals/set-global')

    const SHARED = '__core-js_shared__'
    const store = global[SHARED] || setGlobal(SHARED, {})

    module.exports = store
  }, { '../internals/global': 66, '../internals/set-global': 133 }],
  138: [function (require, module, exports) {
    const IS_PURE = require('../internals/is-pure')
    const store = require('../internals/shared-store');

    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {})
    })('versions', []).push({
      version: '3.15.2',
      mode: IS_PURE ? 'pure' : 'global',
      copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
    })
  }, { '../internals/is-pure': 83, '../internals/shared-store': 137 }],
  139: [function (require, module, exports) {
    const anObject = require('../internals/an-object')
    const aFunction = require('../internals/a-function')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const SPECIES = wellKnownSymbol('species')

    // `SpeciesConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-speciesconstructor
    module.exports = function (O, defaultConstructor) {
      const C = anObject(O).constructor
      let S
      return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S)
    }
  }, { '../internals/a-function': 1, '../internals/an-object': 6, '../internals/well-known-symbol': 167 }],
  140: [function (require, module, exports) {
    const fails = require('../internals/fails')

    // check the existence of a method, lowercase
    // of a tag and escaping quotes in arguments
    module.exports = function (METHOD_NAME) {
      return fails(function () {
        const test = ''[METHOD_NAME]('"')
        return test !== test.toLowerCase() || test.split('"').length > 3
      })
    }
  }, { '../internals/fails': 56 }],
  141: [function (require, module, exports) {
    const toInteger = require('../internals/to-integer')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    // `String.prototype.{ codePointAt, at }` methods implementation
    const createMethod = function (CONVERT_TO_STRING) {
      return function ($this, pos) {
        const S = String(requireObjectCoercible($this))
        const position = toInteger(pos)
        const size = S.length
        let first, second
        if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined
        first = S.charCodeAt(position)
        return first < 0xD800 || first > 0xDBFF || position + 1 === size ||
      (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000
      }
    }

    module.exports = {
      // `String.prototype.codePointAt` method
      // https://tc39.es/ecma262/#sec-string.prototype.codepointat
      codeAt: createMethod(false),
      // `String.prototype.at` method
      // https://github.com/mathiasbynens/String.prototype.at
      charAt: createMethod(true)
    }
  }, { '../internals/require-object-coercible': 131, '../internals/to-integer': 153 }],
  142: [function (require, module, exports) {
    // https://github.com/zloirock/core-js/issues/280
    const userAgent = require('../internals/engine-user-agent')

    // eslint-disable-next-line unicorn/no-unsafe-regex -- safe
    module.exports = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent)
  }, { '../internals/engine-user-agent': 51 }],
  143: [function (require, module, exports) {
    // https://github.com/tc39/proposal-string-pad-start-end
    const toLength = require('../internals/to-length')
    const repeat = require('../internals/string-repeat')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    const ceil = Math.ceil

    // `String.prototype.{ padStart, padEnd }` methods implementation
    const createMethod = function (IS_END) {
      return function ($this, maxLength, fillString) {
        const S = String(requireObjectCoercible($this))
        const stringLength = S.length
        const fillStr = fillString === undefined ? ' ' : String(fillString)
        const intMaxLength = toLength(maxLength)
        let fillLen, stringFiller
        if (intMaxLength <= stringLength || fillStr == '') return S
        fillLen = intMaxLength - stringLength
        stringFiller = repeat.call(fillStr, ceil(fillLen / fillStr.length))
        if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen)
        return IS_END ? S + stringFiller : stringFiller + S
      }
    }

    module.exports = {
      // `String.prototype.padStart` method
      // https://tc39.es/ecma262/#sec-string.prototype.padstart
      start: createMethod(false),
      // `String.prototype.padEnd` method
      // https://tc39.es/ecma262/#sec-string.prototype.padend
      end: createMethod(true)
    }
  }, { '../internals/require-object-coercible': 131, '../internals/string-repeat': 145, '../internals/to-length': 154 }],
  144: [function (require, module, exports) {
    'use strict'
    // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
    const maxInt = 2147483647 // aka. 0x7FFFFFFF or 2^31-1
    const base = 36
    const tMin = 1
    const tMax = 26
    const skew = 38
    const damp = 700
    const initialBias = 72
    const initialN = 128 // 0x80
    const delimiter = '-' // '\x2D'
    const regexNonASCII = /[^\0-\u007E]/ // non-ASCII chars
    const regexSeparators = /[.\u3002\uFF0E\uFF61]/g // RFC 3490 separators
    const OVERFLOW_ERROR = 'Overflow: input needs wider integers to process'
    const baseMinusTMin = base - tMin
    const floor = Math.floor
    const stringFromCharCode = String.fromCharCode

    /**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
    const ucs2decode = function (string) {
      const output = []
      let counter = 0
      const length = string.length
      while (counter < length) {
        const value = string.charCodeAt(counter++)
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
          // It's a high surrogate, and there is a next character.
          const extra = string.charCodeAt(counter++)
          if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000)
          } else {
            // It's an unmatched surrogate; only append this code unit, in case the
            // next code unit is the high surrogate of a surrogate pair.
            output.push(value)
            counter--
          }
        } else {
          output.push(value)
        }
      }
      return output
    }

    /**
 * Converts a digit/integer into a basic code point.
 */
    const digitToBasic = function (digit) {
      //  0..25 map to ASCII a..z or A..Z
      // 26..35 map to ASCII 0..9
      return digit + 22 + 75 * (digit < 26)
    }

    /**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
    const adapt = function (delta, numPoints, firstTime) {
      let k = 0
      delta = firstTime ? floor(delta / damp) : delta >> 1
      delta += floor(delta / numPoints)
      for (; delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin)
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew))
    }

    /**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
    // eslint-disable-next-line max-statements -- TODO
    const encode = function (input) {
      const output = []

      // Convert the input in UCS-2 to an array of Unicode code points.
      input = ucs2decode(input)

      // Cache the length.
      const inputLength = input.length

      // Initialize the state.
      let n = initialN
      let delta = 0
      let bias = initialBias
      let i, currentValue

      // Handle the basic code points.
      for (i = 0; i < input.length; i++) {
        currentValue = input[i]
        if (currentValue < 0x80) {
          output.push(stringFromCharCode(currentValue))
        }
      }

      const basicLength = output.length // number of basic code points.
      let handledCPCount = basicLength // number of code points that have been handled;

      // Finish the basic string with a delimiter unless it's empty.
      if (basicLength) {
        output.push(delimiter)
      }

      // Main encoding loop:
      while (handledCPCount < inputLength) {
        // All non-basic code points < n have been handled already. Find the next larger one:
        let m = maxInt
        for (i = 0; i < input.length; i++) {
          currentValue = input[i]
          if (currentValue >= n && currentValue < m) {
            m = currentValue
          }
        }

        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
        const handledCPCountPlusOne = handledCPCount + 1
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          throw RangeError(OVERFLOW_ERROR)
        }

        delta += (m - n) * handledCPCountPlusOne
        n = m

        for (i = 0; i < input.length; i++) {
          currentValue = input[i]
          if (currentValue < n && ++delta > maxInt) {
            throw RangeError(OVERFLOW_ERROR)
          }
          if (currentValue == n) {
            // Represent delta as a generalized variable-length integer.
            let q = delta
            for (let k = base; /* no condition */; k += base) {
              const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias)
              if (q < t) break
              const qMinusT = q - t
              const baseMinusT = base - t
              output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)))
              q = floor(qMinusT / baseMinusT)
            }

            output.push(stringFromCharCode(digitToBasic(q)))
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength)
            delta = 0
            ++handledCPCount
          }
        }

        ++delta
        ++n
      }
      return output.join('')
    }

    module.exports = function (input) {
      const encoded = []
      const labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.')
      let i, label
      for (i = 0; i < labels.length; i++) {
        label = labels[i]
        encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label)
      }
      return encoded.join('.')
    }
  }, {}],
  145: [function (require, module, exports) {
    'use strict'
    const toInteger = require('../internals/to-integer')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    // `String.prototype.repeat` method implementation
    // https://tc39.es/ecma262/#sec-string.prototype.repeat
    module.exports = function repeat (count) {
      let str = String(requireObjectCoercible(this))
      let result = ''
      let n = toInteger(count)
      if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions')
      for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str
      return result
    }
  }, { '../internals/require-object-coercible': 131, '../internals/to-integer': 153 }],
  146: [function (require, module, exports) {
    const fails = require('../internals/fails')
    const whitespaces = require('../internals/whitespaces')

    const non = '\u200B\u0085\u180E'

    // check that a method works with the correct list
    // of whitespaces and has a correct name
    module.exports = function (METHOD_NAME) {
      return fails(function () {
        return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME
      })
    }
  }, { '../internals/fails': 56, '../internals/whitespaces': 168 }],
  147: [function (require, module, exports) {
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const whitespaces = require('../internals/whitespaces')

    const whitespace = '[' + whitespaces + ']'
    const ltrim = RegExp('^' + whitespace + whitespace + '*')
    const rtrim = RegExp(whitespace + whitespace + '*$')

    // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
    const createMethod = function (TYPE) {
      return function ($this) {
        let string = String(requireObjectCoercible($this))
        if (TYPE & 1) string = string.replace(ltrim, '')
        if (TYPE & 2) string = string.replace(rtrim, '')
        return string
      }
    }

    module.exports = {
      // `String.prototype.{ trimLeft, trimStart }` methods
      // https://tc39.es/ecma262/#sec-string.prototype.trimstart
      start: createMethod(1),
      // `String.prototype.{ trimRight, trimEnd }` methods
      // https://tc39.es/ecma262/#sec-string.prototype.trimend
      end: createMethod(2),
      // `String.prototype.trim` method
      // https://tc39.es/ecma262/#sec-string.prototype.trim
      trim: createMethod(3)
    }
  }, { '../internals/require-object-coercible': 131, '../internals/whitespaces': 168 }],
  148: [function (require, module, exports) {
    const global = require('../internals/global')
    const fails = require('../internals/fails')
    const bind = require('../internals/function-bind-context')
    const html = require('../internals/html')
    const createElement = require('../internals/document-create-element')
    const IS_IOS = require('../internals/engine-is-ios')
    const IS_NODE = require('../internals/engine-is-node')

    const location = global.location
    let set = global.setImmediate
    let clear = global.clearImmediate
    const process = global.process
    const MessageChannel = global.MessageChannel
    const Dispatch = global.Dispatch
    let counter = 0
    const queue = {}
    const ONREADYSTATECHANGE = 'onreadystatechange'
    let defer, channel, port

    const run = function (id) {
      // eslint-disable-next-line no-prototype-builtins -- safe
      if (queue.hasOwnProperty(id)) {
        const fn = queue[id]
        delete queue[id]
        fn()
      }
    }

    const runner = function (id) {
      return function () {
        run(id)
      }
    }

    const listener = function (event) {
      run(event.data)
    }

    const post = function (id) {
      // old engines have not location.origin
      global.postMessage(id + '', location.protocol + '//' + location.host)
    }

    // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
    if (!set || !clear) {
      set = function setImmediate (fn) {
        const args = []
        let i = 1
        while (arguments.length > i) args.push(arguments[i++])
        queue[++counter] = function () {
          // eslint-disable-next-line no-new-func -- spec requirement
          (typeof fn === 'function' ? fn : Function(fn)).apply(undefined, args)
        }
        defer(counter)
        return counter
      }
      clear = function clearImmediate (id) {
        delete queue[id]
      }
      // Node.js 0.8-
      if (IS_NODE) {
        defer = function (id) {
          process.nextTick(runner(id))
        }
      // Sphere (JS game engine) Dispatch API
      } else if (Dispatch && Dispatch.now) {
        defer = function (id) {
          Dispatch.now(runner(id))
        }
      // Browsers with MessageChannel, includes WebWorkers
      // except iOS - https://github.com/zloirock/core-js/issues/624
      } else if (MessageChannel && !IS_IOS) {
        channel = new MessageChannel()
        port = channel.port2
        channel.port1.onmessage = listener
        defer = bind(port.postMessage, port, 1)
        // Browsers with postMessage, skip WebWorkers
        // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
      } else if (
        global.addEventListener &&
    typeof postMessage === 'function' &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
      ) {
        defer = post
        global.addEventListener('message', listener, false)
        // IE8-
      } else if (ONREADYSTATECHANGE in createElement('script')) {
        defer = function (id) {
          html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
            html.removeChild(this)
            run(id)
          }
        }
      // Rest old browsers
      } else {
        defer = function (id) {
          setTimeout(runner(id), 0)
        }
      }
    }

    module.exports = {
      set: set,
      clear: clear
    }
  }, { '../internals/document-create-element': 43, '../internals/engine-is-ios': 48, '../internals/engine-is-node': 49, '../internals/fails': 56, '../internals/function-bind-context': 60, '../internals/global': 66, '../internals/html': 70 }],
  149: [function (require, module, exports) {
    const classof = require('../internals/classof-raw')

    // `thisNumberValue` abstract operation
    // https://tc39.es/ecma262/#sec-thisnumbervalue
    module.exports = function (value) {
      if (typeof value !== 'number' && classof(value) != 'Number') {
        throw TypeError('Incorrect invocation')
      }
      return +value
    }
  }, { '../internals/classof-raw': 24 }],
  150: [function (require, module, exports) {
    const toInteger = require('../internals/to-integer')

    const max = Math.max
    const min = Math.min

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    module.exports = function (index, length) {
      const integer = toInteger(index)
      return integer < 0 ? max(integer + length, 0) : min(integer, length)
    }
  }, { '../internals/to-integer': 153 }],
  151: [function (require, module, exports) {
    const toInteger = require('../internals/to-integer')
    const toLength = require('../internals/to-length')

    // `ToIndex` abstract operation
    // https://tc39.es/ecma262/#sec-toindex
    module.exports = function (it) {
      if (it === undefined) return 0
      const number = toInteger(it)
      const length = toLength(number)
      if (number !== length) throw RangeError('Wrong length or index')
      return length
    }
  }, { '../internals/to-integer': 153, '../internals/to-length': 154 }],
  152: [function (require, module, exports) {
    // toObject with fallback for non-array-like ES3 strings
    const IndexedObject = require('../internals/indexed-object')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    module.exports = function (it) {
      return IndexedObject(requireObjectCoercible(it))
    }
  }, { '../internals/indexed-object': 73, '../internals/require-object-coercible': 131 }],
  153: [function (require, module, exports) {
    const ceil = Math.ceil
    const floor = Math.floor

    // `ToInteger` abstract operation
    // https://tc39.es/ecma262/#sec-tointeger
    module.exports = function (argument) {
      return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument)
    }
  }, {}],
  154: [function (require, module, exports) {
    const toInteger = require('../internals/to-integer')

    const min = Math.min

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    module.exports = function (argument) {
      return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0 // 2 ** 53 - 1 == 9007199254740991
    }
  }, { '../internals/to-integer': 153 }],
  155: [function (require, module, exports) {
    const requireObjectCoercible = require('../internals/require-object-coercible')

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    module.exports = function (argument) {
      return Object(requireObjectCoercible(argument))
    }
  }, { '../internals/require-object-coercible': 131 }],
  156: [function (require, module, exports) {
    const toPositiveInteger = require('../internals/to-positive-integer')

    module.exports = function (it, BYTES) {
      const offset = toPositiveInteger(it)
      if (offset % BYTES) throw RangeError('Wrong offset')
      return offset
    }
  }, { '../internals/to-positive-integer': 157 }],
  157: [function (require, module, exports) {
    const toInteger = require('../internals/to-integer')

    module.exports = function (it) {
      const result = toInteger(it)
      if (result < 0) throw RangeError("The argument can't be less than 0")
      return result
    }
  }, { '../internals/to-integer': 153 }],
  158: [function (require, module, exports) {
    const isObject = require('../internals/is-object')

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string
    module.exports = function (input, PREFERRED_STRING) {
      if (!isObject(input)) return input
      let fn, val
      if (PREFERRED_STRING && typeof (fn = input.toString) === 'function' && !isObject(val = fn.call(input))) return val
      if (typeof (fn = input.valueOf) === 'function' && !isObject(val = fn.call(input))) return val
      if (!PREFERRED_STRING && typeof (fn = input.toString) === 'function' && !isObject(val = fn.call(input))) return val
      throw TypeError("Can't convert object to primitive value")
    }
  }, { '../internals/is-object': 82 }],
  159: [function (require, module, exports) {
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const test = {}

    test[TO_STRING_TAG] = 'z'

    module.exports = String(test) === '[object z]'
  }, { '../internals/well-known-symbol': 167 }],
  160: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const DESCRIPTORS = require('../internals/descriptors')
    const TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers')
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const ArrayBufferModule = require('../internals/array-buffer')
    const anInstance = require('../internals/an-instance')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const toLength = require('../internals/to-length')
    const toIndex = require('../internals/to-index')
    const toOffset = require('../internals/to-offset')
    const toPrimitive = require('../internals/to-primitive')
    const has = require('../internals/has')
    const classof = require('../internals/classof')
    const isObject = require('../internals/is-object')
    const create = require('../internals/object-create')
    const setPrototypeOf = require('../internals/object-set-prototype-of')
    const getOwnPropertyNames = require('../internals/object-get-own-property-names').f
    const typedArrayFrom = require('../internals/typed-array-from')
    const forEach = require('../internals/array-iteration').forEach
    const setSpecies = require('../internals/set-species')
    const definePropertyModule = require('../internals/object-define-property')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const InternalStateModule = require('../internals/internal-state')
    const inheritIfRequired = require('../internals/inherit-if-required')

    const getInternalState = InternalStateModule.get
    const setInternalState = InternalStateModule.set
    const nativeDefineProperty = definePropertyModule.f
    const nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f
    const round = Math.round
    const RangeError = global.RangeError
    const ArrayBuffer = ArrayBufferModule.ArrayBuffer
    const DataView = ArrayBufferModule.DataView
    const NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS
    const TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG
    const TypedArray = ArrayBufferViewCore.TypedArray
    const TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype
    const aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor
    const isTypedArray = ArrayBufferViewCore.isTypedArray
    const BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT'
    const WRONG_LENGTH = 'Wrong length'

    const fromList = function (C, list) {
      let index = 0
      const length = list.length
      const result = new (aTypedArrayConstructor(C))(length)
      while (length > index) result[index] = list[index++]
      return result
    }

    const addGetter = function (it, key) {
      nativeDefineProperty(it, key, {
        get: function () {
          return getInternalState(this)[key]
        }
      })
    }

    const isArrayBuffer = function (it) {
      let klass
      return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer'
    }

    const isTypedArrayIndex = function (target, key) {
      return isTypedArray(target) &&
    typeof key !== 'symbol' &&
    key in target &&
    String(+key) == String(key)
    }

    const wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor (target, key) {
      return isTypedArrayIndex(target, key = toPrimitive(key, true))
        ? createPropertyDescriptor(2, target[key])
        : nativeGetOwnPropertyDescriptor(target, key)
    }

    const wrappedDefineProperty = function defineProperty (target, key, descriptor) {
      if (isTypedArrayIndex(target, key = toPrimitive(key, true)) &&
    isObject(descriptor) &&
    has(descriptor, 'value') &&
    !has(descriptor, 'get') &&
    !has(descriptor, 'set') &&
    // TODO: add validation descriptor w/o calling accessors
    !descriptor.configurable &&
    (!has(descriptor, 'writable') || descriptor.writable) &&
    (!has(descriptor, 'enumerable') || descriptor.enumerable)
      ) {
        target[key] = descriptor.value
        return target
      } return nativeDefineProperty(target, key, descriptor)
    }

    if (DESCRIPTORS) {
      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor
        definePropertyModule.f = wrappedDefineProperty
        addGetter(TypedArrayPrototype, 'buffer')
        addGetter(TypedArrayPrototype, 'byteOffset')
        addGetter(TypedArrayPrototype, 'byteLength')
        addGetter(TypedArrayPrototype, 'length')
      }

      $({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
        getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
        defineProperty: wrappedDefineProperty
      })

      module.exports = function (TYPE, wrapper, CLAMPED) {
        const BYTES = TYPE.match(/\d+$/)[0] / 8
        const CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array'
        const GETTER = 'get' + TYPE
        const SETTER = 'set' + TYPE
        const NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME]
        let TypedArrayConstructor = NativeTypedArrayConstructor
        let TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype
        const exported = {}

        const getter = function (that, index) {
          const data = getInternalState(that)
          return data.view[GETTER](index * BYTES + data.byteOffset, true)
        }

        const setter = function (that, index, value) {
          const data = getInternalState(that)
          if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF
          data.view[SETTER](index * BYTES + data.byteOffset, value, true)
        }

        const addElement = function (that, index) {
          nativeDefineProperty(that, index, {
            get: function () {
              return getter(this, index)
            },
            set: function (value) {
              return setter(this, index, value)
            },
            enumerable: true
          })
        }

        if (!NATIVE_ARRAY_BUFFER_VIEWS) {
          TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
            anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME)
            let index = 0
            let byteOffset = 0
            let buffer, byteLength, length
            if (!isObject(data)) {
              length = toIndex(data)
              byteLength = length * BYTES
              buffer = new ArrayBuffer(byteLength)
            } else if (isArrayBuffer(data)) {
              buffer = data
              byteOffset = toOffset(offset, BYTES)
              const $len = data.byteLength
              if ($length === undefined) {
                if ($len % BYTES) throw RangeError(WRONG_LENGTH)
                byteLength = $len - byteOffset
                if (byteLength < 0) throw RangeError(WRONG_LENGTH)
              } else {
                byteLength = toLength($length) * BYTES
                if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH)
              }
              length = byteLength / BYTES
            } else if (isTypedArray(data)) {
              return fromList(TypedArrayConstructor, data)
            } else {
              return typedArrayFrom.call(TypedArrayConstructor, data)
            }
            setInternalState(that, {
              buffer: buffer,
              byteOffset: byteOffset,
              byteLength: byteLength,
              length: length,
              view: new DataView(buffer)
            })
            while (index < length) addElement(that, index++)
          })

          if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray)
          TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype)
        } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
          TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
            anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME)
            return inheritIfRequired((function () {
              if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data))
              if (isArrayBuffer(data)) {
                return $length !== undefined
                  ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
                  : typedArrayOffset !== undefined
                    ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
                    : new NativeTypedArrayConstructor(data)
              }
              if (isTypedArray(data)) return fromList(TypedArrayConstructor, data)
              return typedArrayFrom.call(TypedArrayConstructor, data)
            }()), dummy, TypedArrayConstructor)
          })

          if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray)
          forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
            if (!(key in TypedArrayConstructor)) {
              createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key])
            }
          })
          TypedArrayConstructor.prototype = TypedArrayConstructorPrototype
        }

        if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor)
        }

        if (TYPED_ARRAY_TAG) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME)
        }

        exported[CONSTRUCTOR_NAME] = TypedArrayConstructor

        $({
          global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
        }, exported)

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES)
        }

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES)
        }

        setSpecies(CONSTRUCTOR_NAME)
      }
    } else module.exports = function () { /* empty */ }
  }, { '../internals/an-instance': 5, '../internals/array-buffer': 9, '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15, '../internals/classof': 25, '../internals/create-non-enumerable-property': 35, '../internals/create-property-descriptor': 36, '../internals/descriptors': 42, '../internals/export': 55, '../internals/global': 66, '../internals/has': 67, '../internals/inherit-if-required': 74, '../internals/internal-state': 77, '../internals/is-object': 82, '../internals/object-create': 104, '../internals/object-define-property': 106, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-own-property-names': 109, '../internals/object-set-prototype-of': 116, '../internals/set-species': 134, '../internals/to-index': 151, '../internals/to-length': 154, '../internals/to-offset': 156, '../internals/to-primitive': 158, '../internals/typed-array-constructors-require-wrappers': 161, '../internals/typed-array-from': 163 }],
  161: [function (require, module, exports) {
    /* eslint-disable no-new -- required for testing */
    const global = require('../internals/global')
    const fails = require('../internals/fails')
    const checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration')
    const NATIVE_ARRAY_BUFFER_VIEWS = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS

    const ArrayBuffer = global.ArrayBuffer
    const Int8Array = global.Int8Array

    module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
      Int8Array(1)
    }) || !fails(function () {
      new Int8Array(-1)
    }) || !checkCorrectnessOfIteration(function (iterable) {
      new Int8Array()
      new Int8Array(null)
      new Int8Array(1.5)
      new Int8Array(iterable)
    }, true) || fails(function () {
      // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
      return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/check-correctness-of-iteration': 23, '../internals/fails': 56, '../internals/global': 66 }],
  162: [function (require, module, exports) {
    const aTypedArrayConstructor = require('../internals/array-buffer-view-core').aTypedArrayConstructor
    const speciesConstructor = require('../internals/species-constructor')

    module.exports = function (instance, list) {
      const C = speciesConstructor(instance, instance.constructor)
      let index = 0
      const length = list.length
      const result = new (aTypedArrayConstructor(C))(length)
      while (length > index) result[index] = list[index++]
      return result
    }
  }, { '../internals/array-buffer-view-core': 8, '../internals/species-constructor': 139 }],
  163: [function (require, module, exports) {
    const toObject = require('../internals/to-object')
    const toLength = require('../internals/to-length')
    const getIteratorMethod = require('../internals/get-iterator-method')
    const isArrayIteratorMethod = require('../internals/is-array-iterator-method')
    const bind = require('../internals/function-bind-context')
    const aTypedArrayConstructor = require('../internals/array-buffer-view-core').aTypedArrayConstructor

    module.exports = function from (source /* , mapfn, thisArg */) {
      let O = toObject(source)
      const argumentsLength = arguments.length
      let mapfn = argumentsLength > 1 ? arguments[1] : undefined
      const mapping = mapfn !== undefined
      const iteratorMethod = getIteratorMethod(O)
      let i, length, result, step, iterator, next
      if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
        iterator = iteratorMethod.call(O)
        next = iterator.next
        O = []
        while (!(step = next.call(iterator)).done) {
          O.push(step.value)
        }
      }
      if (mapping && argumentsLength > 2) {
        mapfn = bind(mapfn, arguments[2], 2)
      }
      length = toLength(O.length)
      result = new (aTypedArrayConstructor(this))(length)
      for (i = 0; length > i; i++) {
        result[i] = mapping ? mapfn(O[i], i) : O[i]
      }
      return result
    }
  }, { '../internals/array-buffer-view-core': 8, '../internals/function-bind-context': 60, '../internals/get-iterator-method': 63, '../internals/is-array-iterator-method': 78, '../internals/to-length': 154, '../internals/to-object': 155 }],
  164: [function (require, module, exports) {
    let id = 0
    const postfix = Math.random()

    module.exports = function (key) {
      return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36)
    }
  }, {}],
  165: [function (require, module, exports) {
    /* eslint-disable es/no-symbol -- required for testing */
    const NATIVE_SYMBOL = require('../internals/native-symbol')

    module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator === 'symbol'
  }, { '../internals/native-symbol': 95 }],
  166: [function (require, module, exports) {
    const wellKnownSymbol = require('../internals/well-known-symbol')

    exports.f = wellKnownSymbol
  }, { '../internals/well-known-symbol': 167 }],
  167: [function (require, module, exports) {
    const global = require('../internals/global')
    const shared = require('../internals/shared')
    const has = require('../internals/has')
    const uid = require('../internals/uid')
    const NATIVE_SYMBOL = require('../internals/native-symbol')
    const USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid')

    const WellKnownSymbolsStore = shared('wks')
    const Symbol = global.Symbol
    const createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid

    module.exports = function (name) {
      if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] === 'string')) {
        if (NATIVE_SYMBOL && has(Symbol, name)) {
          WellKnownSymbolsStore[name] = Symbol[name]
        } else {
          WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name)
        }
      } return WellKnownSymbolsStore[name]
    }
  }, { '../internals/global': 66, '../internals/has': 67, '../internals/native-symbol': 95, '../internals/shared': 138, '../internals/uid': 164, '../internals/use-symbol-as-uid': 165 }],
  168: [function (require, module, exports) {
    // a string of all valid unicode whitespaces
    module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  }, {}],
  169: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const setPrototypeOf = require('../internals/object-set-prototype-of')
    const create = require('../internals/object-create')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const iterate = require('../internals/iterate')

    var $AggregateError = function AggregateError (errors, message) {
      let that = this
      if (!(that instanceof $AggregateError)) return new $AggregateError(errors, message)
      if (setPrototypeOf) {
        // eslint-disable-next-line unicorn/error-message -- expected
        that = setPrototypeOf(new Error(undefined), getPrototypeOf(that))
      }
      if (message !== undefined) createNonEnumerableProperty(that, 'message', String(message))
      const errorsArray = []
      iterate(errors, errorsArray.push, { that: errorsArray })
      createNonEnumerableProperty(that, 'errors', errorsArray)
      return that
    }

    $AggregateError.prototype = create(Error.prototype, {
      constructor: createPropertyDescriptor(5, $AggregateError),
      message: createPropertyDescriptor(5, ''),
      name: createPropertyDescriptor(5, 'AggregateError')
    })

    // `AggregateError` constructor
    // https://tc39.es/ecma262/#sec-aggregate-error-constructor
    $({ global: true }, {
      AggregateError: $AggregateError
    })
  }, { '../internals/create-non-enumerable-property': 35, '../internals/create-property-descriptor': 36, '../internals/export': 55, '../internals/iterate': 85, '../internals/object-create': 104, '../internals/object-get-prototype-of': 111, '../internals/object-set-prototype-of': 116 }],
  170: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const arrayBufferModule = require('../internals/array-buffer')
    const setSpecies = require('../internals/set-species')

    const ARRAY_BUFFER = 'ArrayBuffer'
    const ArrayBuffer = arrayBufferModule[ARRAY_BUFFER]
    const NativeArrayBuffer = global[ARRAY_BUFFER]

    // `ArrayBuffer` constructor
    // https://tc39.es/ecma262/#sec-arraybuffer-constructor
    $({ global: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
      ArrayBuffer: ArrayBuffer
    })

    setSpecies(ARRAY_BUFFER)
  }, { '../internals/array-buffer': 9, '../internals/export': 55, '../internals/global': 66, '../internals/set-species': 134 }],
  171: [function (require, module, exports) {
    const $ = require('../internals/export')
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')

    const NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS

    // `ArrayBuffer.isView` method
    // https://tc39.es/ecma262/#sec-arraybuffer.isview
    $({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
      isView: ArrayBufferViewCore.isView
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/export': 55 }],
  172: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const ArrayBufferModule = require('../internals/array-buffer')
    const anObject = require('../internals/an-object')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const toLength = require('../internals/to-length')
    const speciesConstructor = require('../internals/species-constructor')

    const ArrayBuffer = ArrayBufferModule.ArrayBuffer
    const DataView = ArrayBufferModule.DataView
    const nativeArrayBufferSlice = ArrayBuffer.prototype.slice

    const INCORRECT_SLICE = fails(function () {
      return !new ArrayBuffer(2).slice(1, undefined).byteLength
    })

    // `ArrayBuffer.prototype.slice` method
    // https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
    $({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
      slice: function slice (start, end) {
        if (nativeArrayBufferSlice !== undefined && end === undefined) {
          return nativeArrayBufferSlice.call(anObject(this), start) // FF fix
        }
        const length = anObject(this).byteLength
        let first = toAbsoluteIndex(start, length)
        const fin = toAbsoluteIndex(end === undefined ? length : end, length)
        const result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first))
        const viewSource = new DataView(this)
        const viewTarget = new DataView(result)
        let index = 0
        while (first < fin) {
          viewTarget.setUint8(index++, viewSource.getUint8(first++))
        } return result
      }
    })
  }, { '../internals/an-object': 6, '../internals/array-buffer': 9, '../internals/export': 55, '../internals/fails': 56, '../internals/species-constructor': 139, '../internals/to-absolute-index': 150, '../internals/to-length': 154 }],
  173: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const isArray = require('../internals/is-array')
    const isObject = require('../internals/is-object')
    const toObject = require('../internals/to-object')
    const toLength = require('../internals/to-length')
    const createProperty = require('../internals/create-property')
    const arraySpeciesCreate = require('../internals/array-species-create')
    const arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const V8_VERSION = require('../internals/engine-v8-version')

    const IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable')
    const MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF
    const MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'

    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/679
    const IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
      const array = []
      array[IS_CONCAT_SPREADABLE] = false
      return array.concat()[0] !== array
    })

    const SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat')

    const isConcatSpreadable = function (O) {
      if (!isObject(O)) return false
      const spreadable = O[IS_CONCAT_SPREADABLE]
      return spreadable !== undefined ? !!spreadable : isArray(O)
    }

    const FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT

    // `Array.prototype.concat` method
    // https://tc39.es/ecma262/#sec-array.prototype.concat
    // with adding support of @@isConcatSpreadable and @@species
    $({ target: 'Array', proto: true, forced: FORCED }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      concat: function concat (arg) {
        const O = toObject(this)
        const A = arraySpeciesCreate(O, 0)
        let n = 0
        let i, k, length, len, E
        for (i = -1, length = arguments.length; i < length; i++) {
          E = i === -1 ? O : arguments[i]
          if (isConcatSpreadable(E)) {
            len = toLength(E.length)
            if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED)
            for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k])
          } else {
            if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED)
            createProperty(A, n++, E)
          }
        }
        A.length = n
        return A
      }
    })
  }, { '../internals/array-method-has-species-support': 17, '../internals/array-species-create': 21, '../internals/create-property': 37, '../internals/engine-v8-version': 52, '../internals/export': 55, '../internals/fails': 56, '../internals/is-array': 79, '../internals/is-object': 82, '../internals/to-length': 154, '../internals/to-object': 155, '../internals/well-known-symbol': 167 }],
  174: [function (require, module, exports) {
    const $ = require('../internals/export')
    const copyWithin = require('../internals/array-copy-within')
    const addToUnscopables = require('../internals/add-to-unscopables')

    // `Array.prototype.copyWithin` method
    // https://tc39.es/ecma262/#sec-array.prototype.copywithin
    $({ target: 'Array', proto: true }, {
      copyWithin: copyWithin
    })

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('copyWithin')
  }, { '../internals/add-to-unscopables': 3, '../internals/array-copy-within': 10, '../internals/export': 55 }],
  175: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $every = require('../internals/array-iteration').every
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')

    const STRICT_METHOD = arrayMethodIsStrict('every')

    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    $({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
      every: function every (callbackfn /* , thisArg */) {
        return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-iteration': 15, '../internals/array-method-is-strict': 18, '../internals/export': 55 }],
  176: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fill = require('../internals/array-fill')
    const addToUnscopables = require('../internals/add-to-unscopables')

    // `Array.prototype.fill` method
    // https://tc39.es/ecma262/#sec-array.prototype.fill
    $({ target: 'Array', proto: true }, {
      fill: fill
    })

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('fill')
  }, { '../internals/add-to-unscopables': 3, '../internals/array-fill': 11, '../internals/export': 55 }],
  177: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $filter = require('../internals/array-iteration').filter
    const arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support')

    const HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter')

    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    // with adding support of @@species
    $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
      filter: function filter (callbackfn /* , thisArg */) {
        return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-iteration': 15, '../internals/array-method-has-species-support': 17, '../internals/export': 55 }],
  178: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $findIndex = require('../internals/array-iteration').findIndex
    const addToUnscopables = require('../internals/add-to-unscopables')

    const FIND_INDEX = 'findIndex'
    let SKIPS_HOLES = true

    // Shouldn't skip holes
    if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false })

    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findindex
    $({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
      findIndex: function findIndex (callbackfn /* , that = undefined */) {
        return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      }
    })

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables(FIND_INDEX)
  }, { '../internals/add-to-unscopables': 3, '../internals/array-iteration': 15, '../internals/export': 55 }],
  179: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $find = require('../internals/array-iteration').find
    const addToUnscopables = require('../internals/add-to-unscopables')

    const FIND = 'find'
    let SKIPS_HOLES = true

    // Shouldn't skip holes
    if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false })

    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    $({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
      find: function find (callbackfn /* , that = undefined */) {
        return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      }
    })

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables(FIND)
  }, { '../internals/add-to-unscopables': 3, '../internals/array-iteration': 15, '../internals/export': 55 }],
  180: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const flattenIntoArray = require('../internals/flatten-into-array')
    const toObject = require('../internals/to-object')
    const toLength = require('../internals/to-length')
    const aFunction = require('../internals/a-function')
    const arraySpeciesCreate = require('../internals/array-species-create')

    // `Array.prototype.flatMap` method
    // https://tc39.es/ecma262/#sec-array.prototype.flatmap
    $({ target: 'Array', proto: true }, {
      flatMap: function flatMap (callbackfn /* , thisArg */) {
        const O = toObject(this)
        const sourceLen = toLength(O.length)
        let A
        aFunction(callbackfn)
        A = arraySpeciesCreate(O, 0)
        A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        return A
      }
    })
  }, { '../internals/a-function': 1, '../internals/array-species-create': 21, '../internals/export': 55, '../internals/flatten-into-array': 58, '../internals/to-length': 154, '../internals/to-object': 155 }],
  181: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const flattenIntoArray = require('../internals/flatten-into-array')
    const toObject = require('../internals/to-object')
    const toLength = require('../internals/to-length')
    const toInteger = require('../internals/to-integer')
    const arraySpeciesCreate = require('../internals/array-species-create')

    // `Array.prototype.flat` method
    // https://tc39.es/ecma262/#sec-array.prototype.flat
    $({ target: 'Array', proto: true }, {
      flat: function flat (/* depthArg = 1 */) {
        const depthArg = arguments.length ? arguments[0] : undefined
        const O = toObject(this)
        const sourceLen = toLength(O.length)
        const A = arraySpeciesCreate(O, 0)
        A.length = flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg))
        return A
      }
    })
  }, { '../internals/array-species-create': 21, '../internals/export': 55, '../internals/flatten-into-array': 58, '../internals/to-integer': 153, '../internals/to-length': 154, '../internals/to-object': 155 }],
  182: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const forEach = require('../internals/array-for-each')

    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    // eslint-disable-next-line es/no-array-prototype-foreach -- safe
    $({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
      forEach: forEach
    })
  }, { '../internals/array-for-each': 12, '../internals/export': 55 }],
  183: [function (require, module, exports) {
    const $ = require('../internals/export')
    const from = require('../internals/array-from')
    const checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration')

    const INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
      // eslint-disable-next-line es/no-array-from -- required for testing
      Array.from(iterable)
    })

    // `Array.from` method
    // https://tc39.es/ecma262/#sec-array.from
    $({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
      from: from
    })
  }, { '../internals/array-from': 13, '../internals/check-correctness-of-iteration': 23, '../internals/export': 55 }],
  184: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $includes = require('../internals/array-includes').includes
    const addToUnscopables = require('../internals/add-to-unscopables')

    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    $({ target: 'Array', proto: true }, {
      includes: function includes (el /* , fromIndex = 0 */) {
        return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined)
      }
    })

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('includes')
  }, { '../internals/add-to-unscopables': 3, '../internals/array-includes': 14, '../internals/export': 55 }],
  185: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-array-prototype-indexof -- required for testing */
    const $ = require('../internals/export')
    const $indexOf = require('../internals/array-includes').indexOf
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')

    const nativeIndexOf = [].indexOf

    const NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0
    const STRICT_METHOD = arrayMethodIsStrict('indexOf')

    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    $({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
      indexOf: function indexOf (searchElement /* , fromIndex = 0 */) {
        return NEGATIVE_ZERO
        // convert -0 to +0
          ? nativeIndexOf.apply(this, arguments) || 0
          : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-includes': 14, '../internals/array-method-is-strict': 18, '../internals/export': 55 }],
  186: [function (require, module, exports) {
    const $ = require('../internals/export')
    const isArray = require('../internals/is-array')

    // `Array.isArray` method
    // https://tc39.es/ecma262/#sec-array.isarray
    $({ target: 'Array', stat: true }, {
      isArray: isArray
    })
  }, { '../internals/export': 55, '../internals/is-array': 79 }],
  187: [function (require, module, exports) {
    'use strict'
    const toIndexedObject = require('../internals/to-indexed-object')
    const addToUnscopables = require('../internals/add-to-unscopables')
    const Iterators = require('../internals/iterators')
    const InternalStateModule = require('../internals/internal-state')
    const defineIterator = require('../internals/define-iterator')

    const ARRAY_ITERATOR = 'Array Iterator'
    const setInternalState = InternalStateModule.set
    const getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR)

    // `Array.prototype.entries` method
    // https://tc39.es/ecma262/#sec-array.prototype.entries
    // `Array.prototype.keys` method
    // https://tc39.es/ecma262/#sec-array.prototype.keys
    // `Array.prototype.values` method
    // https://tc39.es/ecma262/#sec-array.prototype.values
    // `Array.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
    // `CreateArrayIterator` internal method
    // https://tc39.es/ecma262/#sec-createarrayiterator
    module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
      setInternalState(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated), // target
        index: 0, // next index
        kind: kind // kind
      })
      // `%ArrayIteratorPrototype%.next` method
      // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
    }, function () {
      const state = getInternalState(this)
      const target = state.target
      const kind = state.kind
      const index = state.index++
      if (!target || index >= target.length) {
        state.target = undefined
        return { value: undefined, done: true }
      }
      if (kind == 'keys') return { value: index, done: false }
      if (kind == 'values') return { value: target[index], done: false }
      return { value: [index, target[index]], done: false }
    }, 'values')

    // argumentsList[@@iterator] is %ArrayProto_values%
    // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
    // https://tc39.es/ecma262/#sec-createmappedargumentsobject
    Iterators.Arguments = Iterators.Array

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('keys')
    addToUnscopables('values')
    addToUnscopables('entries')
  }, { '../internals/add-to-unscopables': 3, '../internals/define-iterator': 40, '../internals/internal-state': 77, '../internals/iterators': 88, '../internals/to-indexed-object': 152 }],
  188: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const IndexedObject = require('../internals/indexed-object')
    const toIndexedObject = require('../internals/to-indexed-object')
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')

    const nativeJoin = [].join

    const ES3_STRINGS = IndexedObject != Object
    const STRICT_METHOD = arrayMethodIsStrict('join', ',')

    // `Array.prototype.join` method
    // https://tc39.es/ecma262/#sec-array.prototype.join
    $({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
      join: function join (separator) {
        return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator)
      }
    })
  }, { '../internals/array-method-is-strict': 18, '../internals/export': 55, '../internals/indexed-object': 73, '../internals/to-indexed-object': 152 }],
  189: [function (require, module, exports) {
    const $ = require('../internals/export')
    const lastIndexOf = require('../internals/array-last-index-of')

    // `Array.prototype.lastIndexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.lastindexof
    // eslint-disable-next-line es/no-array-prototype-lastindexof -- required for testing
    $({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
      lastIndexOf: lastIndexOf
    })
  }, { '../internals/array-last-index-of': 16, '../internals/export': 55 }],
  190: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $map = require('../internals/array-iteration').map
    const arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support')

    const HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map')

    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    // with adding support of @@species
    $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
      map: function map (callbackfn /* , thisArg */) {
        return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-iteration': 15, '../internals/array-method-has-species-support': 17, '../internals/export': 55 }],
  191: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const createProperty = require('../internals/create-property')

    const ISNT_GENERIC = fails(function () {
      function F () { /* empty */ }
      // eslint-disable-next-line es/no-array-of -- required for testing
      return !(Array.of.call(F) instanceof F)
    })

    // `Array.of` method
    // https://tc39.es/ecma262/#sec-array.of
    // WebKit Array.of isn't generic
    $({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
      of: function of (/* ...args */) {
        let index = 0
        const argumentsLength = arguments.length
        const result = new (typeof this === 'function' ? this : Array)(argumentsLength)
        while (argumentsLength > index) createProperty(result, index, arguments[index++])
        result.length = argumentsLength
        return result
      }
    })
  }, { '../internals/create-property': 37, '../internals/export': 55, '../internals/fails': 56 }],
  192: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $reduceRight = require('../internals/array-reduce').right
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')
    const CHROME_VERSION = require('../internals/engine-v8-version')
    const IS_NODE = require('../internals/engine-is-node')

    const STRICT_METHOD = arrayMethodIsStrict('reduceRight')
    // Chrome 80-82 has a critical bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    const CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83

    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    $({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
      reduceRight: function reduceRight (callbackfn /* , initialValue */) {
        return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-method-is-strict': 18, '../internals/array-reduce': 19, '../internals/engine-is-node': 49, '../internals/engine-v8-version': 52, '../internals/export': 55 }],
  193: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $reduce = require('../internals/array-reduce').left
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')
    const CHROME_VERSION = require('../internals/engine-v8-version')
    const IS_NODE = require('../internals/engine-is-node')

    const STRICT_METHOD = arrayMethodIsStrict('reduce')
    // Chrome 80-82 has a critical bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    const CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83

    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    $({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
      reduce: function reduce (callbackfn /* , initialValue */) {
        return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-method-is-strict': 18, '../internals/array-reduce': 19, '../internals/engine-is-node': 49, '../internals/engine-v8-version': 52, '../internals/export': 55 }],
  194: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const isArray = require('../internals/is-array')

    const nativeReverse = [].reverse
    const test = [1, 2]

    // `Array.prototype.reverse` method
    // https://tc39.es/ecma262/#sec-array.prototype.reverse
    // fix for Safari 12.0 bug
    // https://bugs.webkit.org/show_bug.cgi?id=188794
    $({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
      reverse: function reverse () {
        // eslint-disable-next-line no-self-assign -- dirty hack
        if (isArray(this)) this.length = this.length
        return nativeReverse.call(this)
      }
    })
  }, { '../internals/export': 55, '../internals/is-array': 79 }],
  195: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const isObject = require('../internals/is-object')
    const isArray = require('../internals/is-array')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const toLength = require('../internals/to-length')
    const toIndexedObject = require('../internals/to-indexed-object')
    const createProperty = require('../internals/create-property')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support')

    const HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice')

    const SPECIES = wellKnownSymbol('species')
    const nativeSlice = [].slice
    const max = Math.max

    // `Array.prototype.slice` method
    // https://tc39.es/ecma262/#sec-array.prototype.slice
    // fallback for not array-like ES3 strings and DOM objects
    $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
      slice: function slice (start, end) {
        const O = toIndexedObject(this)
        const length = toLength(O.length)
        let k = toAbsoluteIndex(start, length)
        const fin = toAbsoluteIndex(end === undefined ? length : end, length)
        // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
        let Constructor, result, n
        if (isArray(O)) {
          Constructor = O.constructor
          // cross-realm fallback
          if (typeof Constructor === 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
            Constructor = undefined
          } else if (isObject(Constructor)) {
            Constructor = Constructor[SPECIES]
            if (Constructor === null) Constructor = undefined
          }
          if (Constructor === Array || Constructor === undefined) {
            return nativeSlice.call(O, k, fin)
          }
        }
        result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0))
        for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k])
        result.length = n
        return result
      }
    })
  }, { '../internals/array-method-has-species-support': 17, '../internals/create-property': 37, '../internals/export': 55, '../internals/is-array': 79, '../internals/is-object': 82, '../internals/to-absolute-index': 150, '../internals/to-indexed-object': 152, '../internals/to-length': 154, '../internals/well-known-symbol': 167 }],
  196: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $some = require('../internals/array-iteration').some
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')

    const STRICT_METHOD = arrayMethodIsStrict('some')

    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    $({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
      some: function some (callbackfn /* , thisArg */) {
        return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/array-iteration': 15, '../internals/array-method-is-strict': 18, '../internals/export': 55 }],
  197: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aFunction = require('../internals/a-function')
    const toObject = require('../internals/to-object')
    const toLength = require('../internals/to-length')
    const fails = require('../internals/fails')
    const internalSort = require('../internals/array-sort')
    const arrayMethodIsStrict = require('../internals/array-method-is-strict')
    const FF = require('../internals/engine-ff-version')
    const IE_OR_EDGE = require('../internals/engine-is-ie-or-edge')
    const V8 = require('../internals/engine-v8-version')
    const WEBKIT = require('../internals/engine-webkit-version')

    const test = []
    const nativeSort = test.sort

    // IE8-
    const FAILS_ON_UNDEFINED = fails(function () {
      test.sort(undefined)
    })
    // V8 bug
    const FAILS_ON_NULL = fails(function () {
      test.sort(null)
    })
    // Old WebKit
    const STRICT_METHOD = arrayMethodIsStrict('sort')

    const STABLE_SORT = !fails(function () {
      // feature detection can be too slow, so check engines versions
      if (V8) return V8 < 70
      if (FF && FF > 3) return
      if (IE_OR_EDGE) return true
      if (WEBKIT) return WEBKIT < 603

      let result = ''
      let code, chr, value, index

      // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
      for (code = 65; code < 76; code++) {
        chr = String.fromCharCode(code)

        switch (code) {
          case 66: case 69: case 70: case 72: value = 3; break
          case 68: case 71: value = 4; break
          default: value = 2
        }

        for (index = 0; index < 47; index++) {
          test.push({ k: chr + index, v: value })
        }
      }

      test.sort(function (a, b) { return b.v - a.v })

      for (index = 0; index < test.length; index++) {
        chr = test[index].k.charAt(0)
        if (result.charAt(result.length - 1) !== chr) result += chr
      }

      return result !== 'DGBEFHACIJK'
    })

    const FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT

    const getSortCompare = function (comparefn) {
      return function (x, y) {
        if (y === undefined) return -1
        if (x === undefined) return 1
        if (comparefn !== undefined) return +comparefn(x, y) || 0
        return String(x) > String(y) ? 1 : -1
      }
    }

    // `Array.prototype.sort` method
    // https://tc39.es/ecma262/#sec-array.prototype.sort
    $({ target: 'Array', proto: true, forced: FORCED }, {
      sort: function sort (comparefn) {
        if (comparefn !== undefined) aFunction(comparefn)

        const array = toObject(this)

        if (STABLE_SORT) return comparefn === undefined ? nativeSort.call(array) : nativeSort.call(array, comparefn)

        let items = []
        const arrayLength = toLength(array.length)
        let itemsLength, index

        for (index = 0; index < arrayLength; index++) {
          if (index in array) items.push(array[index])
        }

        items = internalSort(items, getSortCompare(comparefn))
        itemsLength = items.length
        index = 0

        while (index < itemsLength) array[index] = items[index++]
        while (index < arrayLength) delete array[index++]

        return array
      }
    })
  }, { '../internals/a-function': 1, '../internals/array-method-is-strict': 18, '../internals/array-sort': 20, '../internals/engine-ff-version': 45, '../internals/engine-is-ie-or-edge': 47, '../internals/engine-v8-version': 52, '../internals/engine-webkit-version': 53, '../internals/export': 55, '../internals/fails': 56, '../internals/to-length': 154, '../internals/to-object': 155 }],
  198: [function (require, module, exports) {
    const setSpecies = require('../internals/set-species')

    // `Array[@@species]` getter
    // https://tc39.es/ecma262/#sec-get-array-@@species
    setSpecies('Array')
  }, { '../internals/set-species': 134 }],
  199: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const toInteger = require('../internals/to-integer')
    const toLength = require('../internals/to-length')
    const toObject = require('../internals/to-object')
    const arraySpeciesCreate = require('../internals/array-species-create')
    const createProperty = require('../internals/create-property')
    const arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support')

    const HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice')

    const max = Math.max
    const min = Math.min
    const MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF
    const MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'

    // `Array.prototype.splice` method
    // https://tc39.es/ecma262/#sec-array.prototype.splice
    // with adding support of @@species
    $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
      splice: function splice (start, deleteCount /* , ...items */) {
        const O = toObject(this)
        const len = toLength(O.length)
        const actualStart = toAbsoluteIndex(start, len)
        const argumentsLength = arguments.length
        let insertCount, actualDeleteCount, A, k, from, to
        if (argumentsLength === 0) {
          insertCount = actualDeleteCount = 0
        } else if (argumentsLength === 1) {
          insertCount = 0
          actualDeleteCount = len - actualStart
        } else {
          insertCount = argumentsLength - 2
          actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart)
        }
        if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
          throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED)
        }
        A = arraySpeciesCreate(O, actualDeleteCount)
        for (k = 0; k < actualDeleteCount; k++) {
          from = actualStart + k
          if (from in O) createProperty(A, k, O[from])
        }
        A.length = actualDeleteCount
        if (insertCount < actualDeleteCount) {
          for (k = actualStart; k < len - actualDeleteCount; k++) {
            from = k + actualDeleteCount
            to = k + insertCount
            if (from in O) O[to] = O[from]
            else delete O[to]
          }
          for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1]
        } else if (insertCount > actualDeleteCount) {
          for (k = len - actualDeleteCount; k > actualStart; k--) {
            from = k + actualDeleteCount - 1
            to = k + insertCount - 1
            if (from in O) O[to] = O[from]
            else delete O[to]
          }
        }
        for (k = 0; k < insertCount; k++) {
          O[k + actualStart] = arguments[k + 2]
        }
        O.length = len - actualDeleteCount + insertCount
        return A
      }
    })
  }, { '../internals/array-method-has-species-support': 17, '../internals/array-species-create': 21, '../internals/create-property': 37, '../internals/export': 55, '../internals/to-absolute-index': 150, '../internals/to-integer': 153, '../internals/to-length': 154, '../internals/to-object': 155 }],
  200: [function (require, module, exports) {
    // this method was added to unscopables after implementation
    // in popular engines, so it's moved to a separate module
    const addToUnscopables = require('../internals/add-to-unscopables')

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('flatMap')
  }, { '../internals/add-to-unscopables': 3 }],
  201: [function (require, module, exports) {
    // this method was added to unscopables after implementation
    // in popular engines, so it's moved to a separate module
    const addToUnscopables = require('../internals/add-to-unscopables')

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('flat')
  }, { '../internals/add-to-unscopables': 3 }],
  202: [function (require, module, exports) {
    const $ = require('../internals/export')
    const ArrayBufferModule = require('../internals/array-buffer')
    const NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native')

    // `DataView` constructor
    // https://tc39.es/ecma262/#sec-dataview-constructor
    $({ global: true, forced: !NATIVE_ARRAY_BUFFER }, {
      DataView: ArrayBufferModule.DataView
    })
  }, { '../internals/array-buffer': 9, '../internals/array-buffer-native': 7, '../internals/export': 55 }],
  203: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')

    const getFullYear = Date.prototype.getFullYear

    // `Date.prototype.getYear` method
    // https://tc39.es/ecma262/#sec-date.prototype.getyear
    $({ target: 'Date', proto: true }, {
      getYear: function getYear () {
        return getFullYear.call(this) - 1900
      }
    })
  }, { '../internals/export': 55 }],
  204: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Date.now` method
    // https://tc39.es/ecma262/#sec-date.now
    $({ target: 'Date', stat: true }, {
      now: function now () {
        return new Date().getTime()
      }
    })
  }, { '../internals/export': 55 }],
  205: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const toInteger = require('../internals/to-integer')

    const getTime = Date.prototype.getTime
    const setFullYear = Date.prototype.setFullYear

    // `Date.prototype.setYear` method
    // https://tc39.es/ecma262/#sec-date.prototype.setyear
    $({ target: 'Date', proto: true }, {
      setYear: function setYear (year) {
        // validate
        getTime.call(this)
        const yi = toInteger(year)
        const yyyy = yi >= 0 && yi <= 99 ? yi + 1900 : yi
        return setFullYear.call(this, yyyy)
      }
    })
  }, { '../internals/export': 55, '../internals/to-integer': 153 }],
  206: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Date.prototype.toGMTString` method
    // https://tc39.es/ecma262/#sec-date.prototype.togmtstring
    $({ target: 'Date', proto: true }, {
      toGMTString: Date.prototype.toUTCString
    })
  }, { '../internals/export': 55 }],
  207: [function (require, module, exports) {
    const $ = require('../internals/export')
    const toISOString = require('../internals/date-to-iso-string')

    // `Date.prototype.toISOString` method
    // https://tc39.es/ecma262/#sec-date.prototype.toisostring
    // PhantomJS / old WebKit has a broken implementations
    $({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== toISOString }, {
      toISOString: toISOString
    })
  }, { '../internals/date-to-iso-string': 38, '../internals/export': 55 }],
  208: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const toObject = require('../internals/to-object')
    const toPrimitive = require('../internals/to-primitive')

    const FORCED = fails(function () {
      return new Date(NaN).toJSON() !== null ||
    Date.prototype.toJSON.call({ toISOString: function () { return 1 } }) !== 1
    })

    // `Date.prototype.toJSON` method
    // https://tc39.es/ecma262/#sec-date.prototype.tojson
    $({ target: 'Date', proto: true, forced: FORCED }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      toJSON: function toJSON (key) {
        const O = toObject(this)
        const pv = toPrimitive(O)
        return typeof pv === 'number' && !isFinite(pv) ? null : O.toISOString()
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/to-object': 155, '../internals/to-primitive': 158 }],
  209: [function (require, module, exports) {
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const dateToPrimitive = require('../internals/date-to-primitive')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_PRIMITIVE = wellKnownSymbol('toPrimitive')
    const DatePrototype = Date.prototype

    // `Date.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
    if (!(TO_PRIMITIVE in DatePrototype)) {
      createNonEnumerableProperty(DatePrototype, TO_PRIMITIVE, dateToPrimitive)
    }
  }, { '../internals/create-non-enumerable-property': 35, '../internals/date-to-primitive': 39, '../internals/well-known-symbol': 167 }],
  210: [function (require, module, exports) {
    const redefine = require('../internals/redefine')

    const DatePrototype = Date.prototype
    const INVALID_DATE = 'Invalid Date'
    const TO_STRING = 'toString'
    const nativeDateToString = DatePrototype[TO_STRING]
    const getTime = DatePrototype.getTime

    // `Date.prototype.toString` method
    // https://tc39.es/ecma262/#sec-date.prototype.tostring
    if (new Date(NaN) + '' != INVALID_DATE) {
      redefine(DatePrototype, TO_STRING, function toString () {
        const value = getTime.call(this)
        // eslint-disable-next-line no-self-compare -- NaN check
        return value === value ? nativeDateToString.call(this) : INVALID_DATE
      })
    }
  }, { '../internals/redefine': 124 }],
  211: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')

    const raw = /[\w*+\-./@]/

    const hex = function (code, length) {
      let result = code.toString(16)
      while (result.length < length) result = '0' + result
      return result
    }

    // `escape` method
    // https://tc39.es/ecma262/#sec-escape-string
    $({ global: true }, {
      escape: function escape (string) {
        const str = String(string)
        let result = ''
        const length = str.length
        let index = 0
        let chr, code
        while (index < length) {
          chr = str.charAt(index++)
          if (raw.test(chr)) {
            result += chr
          } else {
            code = chr.charCodeAt(0)
            if (code < 256) {
              result += '%' + hex(code, 2)
            } else {
              result += '%u' + hex(code, 4).toUpperCase()
            }
          }
        } return result
      }
    })
  }, { '../internals/export': 55 }],
  212: [function (require, module, exports) {
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind')

    // `Function.prototype.bind` method
    // https://tc39.es/ecma262/#sec-function.prototype.bind
    $({ target: 'Function', proto: true }, {
      bind: bind
    })
  }, { '../internals/export': 55, '../internals/function-bind': 61 }],
  213: [function (require, module, exports) {
    'use strict'
    const isObject = require('../internals/is-object')
    const definePropertyModule = require('../internals/object-define-property')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const HAS_INSTANCE = wellKnownSymbol('hasInstance')
    const FunctionPrototype = Function.prototype

    // `Function.prototype[@@hasInstance]` method
    // https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
    if (!(HAS_INSTANCE in FunctionPrototype)) {
      definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, {
        value: function (O) {
          if (typeof this !== 'function' || !isObject(O)) return false
          if (!isObject(this.prototype)) return O instanceof this
          // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
          while (O = getPrototypeOf(O)) if (this.prototype === O) return true
          return false
        }
      })
    }
  }, { '../internals/is-object': 82, '../internals/object-define-property': 106, '../internals/object-get-prototype-of': 111, '../internals/well-known-symbol': 167 }],
  214: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const defineProperty = require('../internals/object-define-property').f

    const FunctionPrototype = Function.prototype
    const FunctionPrototypeToString = FunctionPrototype.toString
    const nameRE = /^\s*function ([^ (]*)/
    const NAME = 'name'

    // Function instances `.name` property
    // https://tc39.es/ecma262/#sec-function-instances-name
    if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
      defineProperty(FunctionPrototype, NAME, {
        configurable: true,
        get: function () {
          try {
            return FunctionPrototypeToString.call(this).match(nameRE)[1]
          } catch (error) {
            return ''
          }
        }
      })
    }
  }, { '../internals/descriptors': 42, '../internals/object-define-property': 106 }],
  215: [function (require, module, exports) {
    const $ = require('../internals/export')
    const global = require('../internals/global')

    // `globalThis` object
    // https://tc39.es/ecma262/#sec-globalthis
    $({ global: true }, {
      globalThis: global
    })
  }, { '../internals/export': 55, '../internals/global': 66 }],
  216: [function (require, module, exports) {
    const $ = require('../internals/export')
    const getBuiltIn = require('../internals/get-built-in')
    const fails = require('../internals/fails')

    const $stringify = getBuiltIn('JSON', 'stringify')
    const re = /[\uD800-\uDFFF]/g
    const low = /^[\uD800-\uDBFF]$/
    const hi = /^[\uDC00-\uDFFF]$/

    const fix = function (match, offset, string) {
      const prev = string.charAt(offset - 1)
      const next = string.charAt(offset + 1)
      if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
        return '\\u' + match.charCodeAt(0).toString(16)
      } return match
    }

    const FORCED = fails(function () {
      return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"' ||
    $stringify('\uDEAD') !== '"\\udead"'
    })

    if ($stringify) {
      // `JSON.stringify` method
      // https://tc39.es/ecma262/#sec-json.stringify
      // https://github.com/tc39/proposal-well-formed-stringify
      $({ target: 'JSON', stat: true, forced: FORCED }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        stringify: function stringify (it, replacer, space) {
          const result = $stringify.apply(null, arguments)
          return typeof result === 'string' ? result.replace(re, fix) : result
        }
      })
    }
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/get-built-in': 62 }],
  217: [function (require, module, exports) {
    const global = require('../internals/global')
    const setToStringTag = require('../internals/set-to-string-tag')

    // JSON[@@toStringTag] property
    // https://tc39.es/ecma262/#sec-json-@@tostringtag
    setToStringTag(global.JSON, 'JSON', true)
  }, { '../internals/global': 66, '../internals/set-to-string-tag': 135 }],
  218: [function (require, module, exports) {
    'use strict'
    const collection = require('../internals/collection')
    const collectionStrong = require('../internals/collection-strong')

    // `Map` constructor
    // https://tc39.es/ecma262/#sec-map-objects
    module.exports = collection('Map', function (init) {
      return function Map () { return init(this, arguments.length ? arguments[0] : undefined) }
    }, collectionStrong)
  }, { '../internals/collection': 29, '../internals/collection-strong': 27 }],
  219: [function (require, module, exports) {
    const $ = require('../internals/export')
    const log1p = require('../internals/math-log1p')

    // eslint-disable-next-line es/no-math-acosh -- required for testing
    const $acosh = Math.acosh
    const log = Math.log
    const sqrt = Math.sqrt
    const LN2 = Math.LN2

    const FORCED = !$acosh ||
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  Math.floor($acosh(Number.MAX_VALUE)) != 710 ||
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  $acosh(Infinity) != Infinity

    // `Math.acosh` method
    // https://tc39.es/ecma262/#sec-math.acosh
    $({ target: 'Math', stat: true, forced: FORCED }, {
      acosh: function acosh (x) {
        return (x = +x) < 1
          ? NaN
          : x > 94906265.62425156
            ? log(x) + LN2
            : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1))
      }
    })
  }, { '../internals/export': 55, '../internals/math-log1p': 91 }],
  220: [function (require, module, exports) {
    const $ = require('../internals/export')

    // eslint-disable-next-line es/no-math-asinh -- required for testing
    const $asinh = Math.asinh
    const log = Math.log
    const sqrt = Math.sqrt

    function asinh (x) {
      return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1))
    }

    // `Math.asinh` method
    // https://tc39.es/ecma262/#sec-math.asinh
    // Tor Browser bug: Math.asinh(0) -> -0
    $({ target: 'Math', stat: true, forced: !($asinh && 1 / $asinh(0) > 0) }, {
      asinh: asinh
    })
  }, { '../internals/export': 55 }],
  221: [function (require, module, exports) {
    const $ = require('../internals/export')

    // eslint-disable-next-line es/no-math-atanh -- required for testing
    const $atanh = Math.atanh
    const log = Math.log

    // `Math.atanh` method
    // https://tc39.es/ecma262/#sec-math.atanh
    // Tor Browser bug: Math.atanh(-0) -> 0
    $({ target: 'Math', stat: true, forced: !($atanh && 1 / $atanh(-0) < 0) }, {
      atanh: function atanh (x) {
        return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2
      }
    })
  }, { '../internals/export': 55 }],
  222: [function (require, module, exports) {
    const $ = require('../internals/export')
    const sign = require('../internals/math-sign')

    const abs = Math.abs
    const pow = Math.pow

    // `Math.cbrt` method
    // https://tc39.es/ecma262/#sec-math.cbrt
    $({ target: 'Math', stat: true }, {
      cbrt: function cbrt (x) {
        return sign(x = +x) * pow(abs(x), 1 / 3)
      }
    })
  }, { '../internals/export': 55, '../internals/math-sign': 92 }],
  223: [function (require, module, exports) {
    const $ = require('../internals/export')

    const floor = Math.floor
    const log = Math.log
    const LOG2E = Math.LOG2E

    // `Math.clz32` method
    // https://tc39.es/ecma262/#sec-math.clz32
    $({ target: 'Math', stat: true }, {
      clz32: function clz32 (x) {
        return (x >>>= 0) ? 31 - floor(log(x + 0.5) * LOG2E) : 32
      }
    })
  }, { '../internals/export': 55 }],
  224: [function (require, module, exports) {
    const $ = require('../internals/export')
    const expm1 = require('../internals/math-expm1')

    // eslint-disable-next-line es/no-math-cosh -- required for testing
    const $cosh = Math.cosh
    const abs = Math.abs
    const E = Math.E

    // `Math.cosh` method
    // https://tc39.es/ecma262/#sec-math.cosh
    $({ target: 'Math', stat: true, forced: !$cosh || $cosh(710) === Infinity }, {
      cosh: function cosh (x) {
        const t = expm1(abs(x) - 1) + 1
        return (t + 1 / (t * E * E)) * (E / 2)
      }
    })
  }, { '../internals/export': 55, '../internals/math-expm1': 89 }],
  225: [function (require, module, exports) {
    const $ = require('../internals/export')
    const expm1 = require('../internals/math-expm1')

    // `Math.expm1` method
    // https://tc39.es/ecma262/#sec-math.expm1
    // eslint-disable-next-line es/no-math-expm1 -- required for testing
    $({ target: 'Math', stat: true, forced: expm1 != Math.expm1 }, { expm1: expm1 })
  }, { '../internals/export': 55, '../internals/math-expm1': 89 }],
  226: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fround = require('../internals/math-fround')

    // `Math.fround` method
    // https://tc39.es/ecma262/#sec-math.fround
    $({ target: 'Math', stat: true }, { fround: fround })
  }, { '../internals/export': 55, '../internals/math-fround': 90 }],
  227: [function (require, module, exports) {
    const $ = require('../internals/export')

    // eslint-disable-next-line es/no-math-hypot -- required for testing
    const $hypot = Math.hypot
    const abs = Math.abs
    const sqrt = Math.sqrt

    // Chrome 77 bug
    // https://bugs.chromium.org/p/v8/issues/detail?id=9546
    const BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity

    // `Math.hypot` method
    // https://tc39.es/ecma262/#sec-math.hypot
    $({ target: 'Math', stat: true, forced: BUGGY }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      hypot: function hypot (value1, value2) {
        let sum = 0
        let i = 0
        const aLen = arguments.length
        let larg = 0
        let arg, div
        while (i < aLen) {
          arg = abs(arguments[i++])
          if (larg < arg) {
            div = larg / arg
            sum = sum * div * div + 1
            larg = arg
          } else if (arg > 0) {
            div = arg / larg
            sum += div * div
          } else sum += arg
        }
        return larg === Infinity ? Infinity : larg * sqrt(sum)
      }
    })
  }, { '../internals/export': 55 }],
  228: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')

    // eslint-disable-next-line es/no-math-imul -- required for testing
    const $imul = Math.imul

    const FORCED = fails(function () {
      return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2
    })

    // `Math.imul` method
    // https://tc39.es/ecma262/#sec-math.imul
    // some WebKit versions fails with big numbers, some has wrong arity
    $({ target: 'Math', stat: true, forced: FORCED }, {
      imul: function imul (x, y) {
        const UINT16 = 0xFFFF
        const xn = +x
        const yn = +y
        const xl = UINT16 & xn
        const yl = UINT16 & yn
        return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0)
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56 }],
  229: [function (require, module, exports) {
    const $ = require('../internals/export')

    const log = Math.log
    const LOG10E = Math.LOG10E

    // `Math.log10` method
    // https://tc39.es/ecma262/#sec-math.log10
    $({ target: 'Math', stat: true }, {
      log10: function log10 (x) {
        return log(x) * LOG10E
      }
    })
  }, { '../internals/export': 55 }],
  230: [function (require, module, exports) {
    const $ = require('../internals/export')
    const log1p = require('../internals/math-log1p')

    // `Math.log1p` method
    // https://tc39.es/ecma262/#sec-math.log1p
    $({ target: 'Math', stat: true }, { log1p: log1p })
  }, { '../internals/export': 55, '../internals/math-log1p': 91 }],
  231: [function (require, module, exports) {
    const $ = require('../internals/export')

    const log = Math.log
    const LN2 = Math.LN2

    // `Math.log2` method
    // https://tc39.es/ecma262/#sec-math.log2
    $({ target: 'Math', stat: true }, {
      log2: function log2 (x) {
        return log(x) / LN2
      }
    })
  }, { '../internals/export': 55 }],
  232: [function (require, module, exports) {
    const $ = require('../internals/export')
    const sign = require('../internals/math-sign')

    // `Math.sign` method
    // https://tc39.es/ecma262/#sec-math.sign
    $({ target: 'Math', stat: true }, {
      sign: sign
    })
  }, { '../internals/export': 55, '../internals/math-sign': 92 }],
  233: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const expm1 = require('../internals/math-expm1')

    const abs = Math.abs
    const exp = Math.exp
    const E = Math.E

    const FORCED = fails(function () {
      // eslint-disable-next-line es/no-math-sinh -- required for testing
      return Math.sinh(-2e-17) != -2e-17
    })

    // `Math.sinh` method
    // https://tc39.es/ecma262/#sec-math.sinh
    // V8 near Chromium 38 has a problem with very small numbers
    $({ target: 'Math', stat: true, forced: FORCED }, {
      sinh: function sinh (x) {
        return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2)
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/math-expm1': 89 }],
  234: [function (require, module, exports) {
    const $ = require('../internals/export')
    const expm1 = require('../internals/math-expm1')

    const exp = Math.exp

    // `Math.tanh` method
    // https://tc39.es/ecma262/#sec-math.tanh
    $({ target: 'Math', stat: true }, {
      tanh: function tanh (x) {
        const a = expm1(x = +x)
        const b = expm1(-x)
        return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x))
      }
    })
  }, { '../internals/export': 55, '../internals/math-expm1': 89 }],
  235: [function (require, module, exports) {
    const setToStringTag = require('../internals/set-to-string-tag')

    // Math[@@toStringTag] property
    // https://tc39.es/ecma262/#sec-math-@@tostringtag
    setToStringTag(Math, 'Math', true)
  }, { '../internals/set-to-string-tag': 135 }],
  236: [function (require, module, exports) {
    const $ = require('../internals/export')

    const ceil = Math.ceil
    const floor = Math.floor

    // `Math.trunc` method
    // https://tc39.es/ecma262/#sec-math.trunc
    $({ target: 'Math', stat: true }, {
      trunc: function trunc (it) {
        return (it > 0 ? floor : ceil)(it)
      }
    })
  }, { '../internals/export': 55 }],
  237: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const global = require('../internals/global')
    const isForced = require('../internals/is-forced')
    const redefine = require('../internals/redefine')
    const has = require('../internals/has')
    const classof = require('../internals/classof-raw')
    const inheritIfRequired = require('../internals/inherit-if-required')
    const toPrimitive = require('../internals/to-primitive')
    const fails = require('../internals/fails')
    const create = require('../internals/object-create')
    const getOwnPropertyNames = require('../internals/object-get-own-property-names').f
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const defineProperty = require('../internals/object-define-property').f
    const trim = require('../internals/string-trim').trim

    const NUMBER = 'Number'
    const NativeNumber = global[NUMBER]
    const NumberPrototype = NativeNumber.prototype

    // Opera ~12 has broken Object#toString
    const BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER

    // `ToNumber` abstract operation
    // https://tc39.es/ecma262/#sec-tonumber
    const toNumber = function (argument) {
      let it = toPrimitive(argument, false)
      let first, third, radix, maxCode, digits, length, index, code
      if (typeof it === 'string' && it.length > 2) {
        it = trim(it)
        first = it.charCodeAt(0)
        if (first === 43 || first === 45) {
          third = it.charCodeAt(2)
          if (third === 88 || third === 120) return NaN // Number('+0x1') should be NaN, old V8 fix
        } else if (first === 48) {
          switch (it.charCodeAt(1)) {
            case 66: case 98: radix = 2; maxCode = 49; break // fast equal of /^0b[01]+$/i
            case 79: case 111: radix = 8; maxCode = 55; break // fast equal of /^0o[0-7]+$/i
            default: return +it
          }
          digits = it.slice(2)
          length = digits.length
          for (index = 0; index < length; index++) {
            code = digits.charCodeAt(index)
            // parseInt parses a string to a first unavailable symbol
            // but ToNumber should return NaN if a string contains unavailable symbols
            if (code < 48 || code > maxCode) return NaN
          } return parseInt(digits, radix)
        }
      } return +it
    }

    // `Number` constructor
    // https://tc39.es/ecma262/#sec-number-constructor
    if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
      var NumberWrapper = function Number (value) {
        const it = arguments.length < 1 ? 0 : value
        const dummy = this
        return dummy instanceof NumberWrapper &&
      // check on 1..constructor(foo) case
      (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy) }) : classof(dummy) != NUMBER)
          ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it)
      }
      for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
        // ES3:
          'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
    // ESNext
    'fromString,range'
        ).split(','), j = 0, key; keys.length > j; j++) {
        if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
          defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key))
        }
      }
      NumberWrapper.prototype = NumberPrototype
      NumberPrototype.constructor = NumberWrapper
      redefine(global, NUMBER, NumberWrapper)
    }
  }, { '../internals/classof-raw': 24, '../internals/descriptors': 42, '../internals/fails': 56, '../internals/global': 66, '../internals/has': 67, '../internals/inherit-if-required': 74, '../internals/is-forced': 80, '../internals/object-create': 104, '../internals/object-define-property': 106, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-own-property-names': 109, '../internals/redefine': 124, '../internals/string-trim': 147, '../internals/to-primitive': 158 }],
  238: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Number.EPSILON` constant
    // https://tc39.es/ecma262/#sec-number.epsilon
    $({ target: 'Number', stat: true }, {
      EPSILON: Math.pow(2, -52)
    })
  }, { '../internals/export': 55 }],
  239: [function (require, module, exports) {
    const $ = require('../internals/export')
    const numberIsFinite = require('../internals/number-is-finite')

    // `Number.isFinite` method
    // https://tc39.es/ecma262/#sec-number.isfinite
    $({ target: 'Number', stat: true }, { isFinite: numberIsFinite })
  }, { '../internals/export': 55, '../internals/number-is-finite': 100 }],
  240: [function (require, module, exports) {
    const $ = require('../internals/export')
    const isInteger = require('../internals/is-integer')

    // `Number.isInteger` method
    // https://tc39.es/ecma262/#sec-number.isinteger
    $({ target: 'Number', stat: true }, {
      isInteger: isInteger
    })
  }, { '../internals/export': 55, '../internals/is-integer': 81 }],
  241: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Number.isNaN` method
    // https://tc39.es/ecma262/#sec-number.isnan
    $({ target: 'Number', stat: true }, {
      isNaN: function isNaN (number) {
        // eslint-disable-next-line no-self-compare -- NaN check
        return number != number
      }
    })
  }, { '../internals/export': 55 }],
  242: [function (require, module, exports) {
    const $ = require('../internals/export')
    const isInteger = require('../internals/is-integer')

    const abs = Math.abs

    // `Number.isSafeInteger` method
    // https://tc39.es/ecma262/#sec-number.issafeinteger
    $({ target: 'Number', stat: true }, {
      isSafeInteger: function isSafeInteger (number) {
        return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF
      }
    })
  }, { '../internals/export': 55, '../internals/is-integer': 81 }],
  243: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Number.MAX_SAFE_INTEGER` constant
    // https://tc39.es/ecma262/#sec-number.max_safe_integer
    $({ target: 'Number', stat: true }, {
      MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
    })
  }, { '../internals/export': 55 }],
  244: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Number.MIN_SAFE_INTEGER` constant
    // https://tc39.es/ecma262/#sec-number.min_safe_integer
    $({ target: 'Number', stat: true }, {
      MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
    })
  }, { '../internals/export': 55 }],
  245: [function (require, module, exports) {
    const $ = require('../internals/export')
    const parseFloat = require('../internals/number-parse-float')

    // `Number.parseFloat` method
    // https://tc39.es/ecma262/#sec-number.parseFloat
    // eslint-disable-next-line es/no-number-parsefloat -- required for testing
    $({ target: 'Number', stat: true, forced: Number.parseFloat != parseFloat }, {
      parseFloat: parseFloat
    })
  }, { '../internals/export': 55, '../internals/number-parse-float': 101 }],
  246: [function (require, module, exports) {
    const $ = require('../internals/export')
    const parseInt = require('../internals/number-parse-int')

    // `Number.parseInt` method
    // https://tc39.es/ecma262/#sec-number.parseint
    // eslint-disable-next-line es/no-number-parseint -- required for testing
    $({ target: 'Number', stat: true, forced: Number.parseInt != parseInt }, {
      parseInt: parseInt
    })
  }, { '../internals/export': 55, '../internals/number-parse-int': 102 }],
  247: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const toInteger = require('../internals/to-integer')
    const thisNumberValue = require('../internals/this-number-value')
    const repeat = require('../internals/string-repeat')
    const fails = require('../internals/fails')

    const nativeToFixed = 1.0.toFixed
    const floor = Math.floor

    var pow = function (x, n, acc) {
      return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)
    }

    const log = function (x) {
      let n = 0
      let x2 = x
      while (x2 >= 4096) {
        n += 12
        x2 /= 4096
      }
      while (x2 >= 2) {
        n += 1
        x2 /= 2
      } return n
    }

    const multiply = function (data, n, c) {
      let index = -1
      let c2 = c
      while (++index < 6) {
        c2 += n * data[index]
        data[index] = c2 % 1e7
        c2 = floor(c2 / 1e7)
      }
    }

    const divide = function (data, n) {
      let index = 6
      let c = 0
      while (--index >= 0) {
        c += data[index]
        data[index] = floor(c / n)
        c = (c % n) * 1e7
      }
    }

    const dataToString = function (data) {
      let index = 6
      let s = ''
      while (--index >= 0) {
        if (s !== '' || index === 0 || data[index] !== 0) {
          const t = String(data[index])
          s = s === '' ? t : s + repeat.call('0', 7 - t.length) + t
        }
      } return s
    }

    const FORCED = nativeToFixed && (
      0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
    ) || !fails(function () {
      // V8 ~ Android 4.3-
      nativeToFixed.call({})
    })

    // `Number.prototype.toFixed` method
    // https://tc39.es/ecma262/#sec-number.prototype.tofixed
    $({ target: 'Number', proto: true, forced: FORCED }, {
      toFixed: function toFixed (fractionDigits) {
        let number = thisNumberValue(this)
        const fractDigits = toInteger(fractionDigits)
        const data = [0, 0, 0, 0, 0, 0]
        let sign = ''
        let result = '0'
        let e, z, j, k

        if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits')
        // eslint-disable-next-line no-self-compare -- NaN check
        if (number != number) return 'NaN'
        if (number <= -1e21 || number >= 1e21) return String(number)
        if (number < 0) {
          sign = '-'
          number = -number
        }
        if (number > 1e-21) {
          e = log(number * pow(2, 69, 1)) - 69
          z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1)
          z *= 0x10000000000000
          e = 52 - e
          if (e > 0) {
            multiply(data, 0, z)
            j = fractDigits
            while (j >= 7) {
              multiply(data, 1e7, 0)
              j -= 7
            }
            multiply(data, pow(10, j, 1), 0)
            j = e - 1
            while (j >= 23) {
              divide(data, 1 << 23)
              j -= 23
            }
            divide(data, 1 << j)
            multiply(data, 1, 1)
            divide(data, 2)
            result = dataToString(data)
          } else {
            multiply(data, 0, z)
            multiply(data, 1 << -e, 0)
            result = dataToString(data) + repeat.call('0', fractDigits)
          }
        }
        if (fractDigits > 0) {
          k = result.length
          result = sign + (k <= fractDigits
            ? '0.' + repeat.call('0', fractDigits - k) + result
            : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits))
        } else {
          result = sign + result
        } return result
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/string-repeat': 145, '../internals/this-number-value': 149, '../internals/to-integer': 153 }],
  248: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const thisNumberValue = require('../internals/this-number-value')

    const nativeToPrecision = 1.0.toPrecision

    const FORCED = fails(function () {
      // IE7-
      return nativeToPrecision.call(1, undefined) !== '1'
    }) || !fails(function () {
      // V8 ~ Android 4.3-
      nativeToPrecision.call({})
    })

    // `Number.prototype.toPrecision` method
    // https://tc39.es/ecma262/#sec-number.prototype.toprecision
    $({ target: 'Number', proto: true, forced: FORCED }, {
      toPrecision: function toPrecision (precision) {
        return precision === undefined
          ? nativeToPrecision.call(thisNumberValue(this))
          : nativeToPrecision.call(thisNumberValue(this), precision)
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/this-number-value': 149 }],
  249: [function (require, module, exports) {
    const $ = require('../internals/export')
    const assign = require('../internals/object-assign')

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    // eslint-disable-next-line es/no-object-assign -- required for testing
    $({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
      assign: assign
    })
  }, { '../internals/export': 55, '../internals/object-assign': 103 }],
  250: [function (require, module, exports) {
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const create = require('../internals/object-create')

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    $({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
      create: create
    })
  }, { '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-create': 104 }],
  251: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const FORCED = require('../internals/object-prototype-accessors-forced')
    const toObject = require('../internals/to-object')
    const aFunction = require('../internals/a-function')
    const definePropertyModule = require('../internals/object-define-property')

    // `Object.prototype.__defineGetter__` method
    // https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
    if (DESCRIPTORS) {
      $({ target: 'Object', proto: true, forced: FORCED }, {
        __defineGetter__: function __defineGetter__ (P, getter) {
          definePropertyModule.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true })
        }
      })
    }
  }, { '../internals/a-function': 1, '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-define-property': 106, '../internals/object-prototype-accessors-forced': 115, '../internals/to-object': 155 }],
  252: [function (require, module, exports) {
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const defineProperties = require('../internals/object-define-properties')

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    $({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
      defineProperties: defineProperties
    })
  }, { '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-define-properties': 105 }],
  253: [function (require, module, exports) {
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const objectDefinePropertyModile = require('../internals/object-define-property')

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    $({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
      defineProperty: objectDefinePropertyModile.f
    })
  }, { '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-define-property': 106 }],
  254: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const FORCED = require('../internals/object-prototype-accessors-forced')
    const toObject = require('../internals/to-object')
    const aFunction = require('../internals/a-function')
    const definePropertyModule = require('../internals/object-define-property')

    // `Object.prototype.__defineSetter__` method
    // https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
    if (DESCRIPTORS) {
      $({ target: 'Object', proto: true, forced: FORCED }, {
        __defineSetter__: function __defineSetter__ (P, setter) {
          definePropertyModule.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true })
        }
      })
    }
  }, { '../internals/a-function': 1, '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-define-property': 106, '../internals/object-prototype-accessors-forced': 115, '../internals/to-object': 155 }],
  255: [function (require, module, exports) {
    const $ = require('../internals/export')
    const $entries = require('../internals/object-to-array').entries

    // `Object.entries` method
    // https://tc39.es/ecma262/#sec-object.entries
    $({ target: 'Object', stat: true }, {
      entries: function entries (O) {
        return $entries(O)
      }
    })
  }, { '../internals/export': 55, '../internals/object-to-array': 117 }],
  256: [function (require, module, exports) {
    const $ = require('../internals/export')
    const FREEZING = require('../internals/freezing')
    const fails = require('../internals/fails')
    const isObject = require('../internals/is-object')
    const onFreeze = require('../internals/internal-metadata').onFreeze

    // eslint-disable-next-line es/no-object-freeze -- safe
    const $freeze = Object.freeze
    const FAILS_ON_PRIMITIVES = fails(function () { $freeze(1) })

    // `Object.freeze` method
    // https://tc39.es/ecma262/#sec-object.freeze
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
      freeze: function freeze (it) {
        return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/freezing': 59, '../internals/internal-metadata': 76, '../internals/is-object': 82 }],
  257: [function (require, module, exports) {
    const $ = require('../internals/export')
    const iterate = require('../internals/iterate')
    const createProperty = require('../internals/create-property')

    // `Object.fromEntries` method
    // https://github.com/tc39/proposal-object-from-entries
    $({ target: 'Object', stat: true }, {
      fromEntries: function fromEntries (iterable) {
        const obj = {}
        iterate(iterable, function (k, v) {
          createProperty(obj, k, v)
        }, { AS_ENTRIES: true })
        return obj
      }
    })
  }, { '../internals/create-property': 37, '../internals/export': 55, '../internals/iterate': 85 }],
  258: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const toIndexedObject = require('../internals/to-indexed-object')
    const nativeGetOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const DESCRIPTORS = require('../internals/descriptors')

    const FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1) })
    const FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    $({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor (it, key) {
        return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key)
      }
    })
  }, { '../internals/descriptors': 42, '../internals/export': 55, '../internals/fails': 56, '../internals/object-get-own-property-descriptor': 107, '../internals/to-indexed-object': 152 }],
  259: [function (require, module, exports) {
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const ownKeys = require('../internals/own-keys')
    const toIndexedObject = require('../internals/to-indexed-object')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const createProperty = require('../internals/create-property')

    // `Object.getOwnPropertyDescriptors` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
    $({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
      getOwnPropertyDescriptors: function getOwnPropertyDescriptors (object) {
        const O = toIndexedObject(object)
        const getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f
        const keys = ownKeys(O)
        const result = {}
        let index = 0
        let key, descriptor
        while (keys.length > index) {
          descriptor = getOwnPropertyDescriptor(O, key = keys[index++])
          if (descriptor !== undefined) createProperty(result, key, descriptor)
        }
        return result
      }
    })
  }, { '../internals/create-property': 37, '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-get-own-property-descriptor': 107, '../internals/own-keys': 119, '../internals/to-indexed-object': 152 }],
  260: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const getOwnPropertyNames = require('../internals/object-get-own-property-names-external').f

    // eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
    const FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1) })

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
      getOwnPropertyNames: getOwnPropertyNames
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/object-get-own-property-names-external': 108 }],
  261: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const toObject = require('../internals/to-object')
    const nativeGetPrototypeOf = require('../internals/object-get-prototype-of')
    const CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter')

    const FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1) })

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
      getPrototypeOf: function getPrototypeOf (it) {
        return nativeGetPrototypeOf(toObject(it))
      }
    })
  }, { '../internals/correct-prototype-getter': 32, '../internals/export': 55, '../internals/fails': 56, '../internals/object-get-prototype-of': 111, '../internals/to-object': 155 }],
  262: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const isObject = require('../internals/is-object')

    // eslint-disable-next-line es/no-object-isextensible -- safe
    const $isExtensible = Object.isExtensible
    const FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1) })

    // `Object.isExtensible` method
    // https://tc39.es/ecma262/#sec-object.isextensible
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
      isExtensible: function isExtensible (it) {
        return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/is-object': 82 }],
  263: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const isObject = require('../internals/is-object')

    // eslint-disable-next-line es/no-object-isfrozen -- safe
    const $isFrozen = Object.isFrozen
    const FAILS_ON_PRIMITIVES = fails(function () { $isFrozen(1) })

    // `Object.isFrozen` method
    // https://tc39.es/ecma262/#sec-object.isfrozen
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
      isFrozen: function isFrozen (it) {
        return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/is-object': 82 }],
  264: [function (require, module, exports) {
    const $ = require('../internals/export')
    const fails = require('../internals/fails')
    const isObject = require('../internals/is-object')

    // eslint-disable-next-line es/no-object-issealed -- safe
    const $isSealed = Object.isSealed
    const FAILS_ON_PRIMITIVES = fails(function () { $isSealed(1) })

    // `Object.isSealed` method
    // https://tc39.es/ecma262/#sec-object.issealed
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
      isSealed: function isSealed (it) {
        return isObject(it) ? $isSealed ? $isSealed(it) : false : true
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/is-object': 82 }],
  265: [function (require, module, exports) {
    const $ = require('../internals/export')
    const is = require('../internals/same-value')

    // `Object.is` method
    // https://tc39.es/ecma262/#sec-object.is
    $({ target: 'Object', stat: true }, {
      is: is
    })
  }, { '../internals/export': 55, '../internals/same-value': 132 }],
  266: [function (require, module, exports) {
    const $ = require('../internals/export')
    const toObject = require('../internals/to-object')
    const nativeKeys = require('../internals/object-keys')
    const fails = require('../internals/fails')

    const FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1) })

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
      keys: function keys (it) {
        return nativeKeys(toObject(it))
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/object-keys': 113, '../internals/to-object': 155 }],
  267: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const FORCED = require('../internals/object-prototype-accessors-forced')
    const toObject = require('../internals/to-object')
    const toPrimitive = require('../internals/to-primitive')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f

    // `Object.prototype.__lookupGetter__` method
    // https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
    if (DESCRIPTORS) {
      $({ target: 'Object', proto: true, forced: FORCED }, {
        __lookupGetter__: function __lookupGetter__ (P) {
          let O = toObject(this)
          const key = toPrimitive(P, true)
          let desc
          do {
            if (desc = getOwnPropertyDescriptor(O, key)) return desc.get
          } while (O = getPrototypeOf(O))
        }
      })
    }
  }, { '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-prototype-of': 111, '../internals/object-prototype-accessors-forced': 115, '../internals/to-object': 155, '../internals/to-primitive': 158 }],
  268: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const FORCED = require('../internals/object-prototype-accessors-forced')
    const toObject = require('../internals/to-object')
    const toPrimitive = require('../internals/to-primitive')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f

    // `Object.prototype.__lookupSetter__` method
    // https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
    if (DESCRIPTORS) {
      $({ target: 'Object', proto: true, forced: FORCED }, {
        __lookupSetter__: function __lookupSetter__ (P) {
          let O = toObject(this)
          const key = toPrimitive(P, true)
          let desc
          do {
            if (desc = getOwnPropertyDescriptor(O, key)) return desc.set
          } while (O = getPrototypeOf(O))
        }
      })
    }
  }, { '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-prototype-of': 111, '../internals/object-prototype-accessors-forced': 115, '../internals/to-object': 155, '../internals/to-primitive': 158 }],
  269: [function (require, module, exports) {
    const $ = require('../internals/export')
    const isObject = require('../internals/is-object')
    const onFreeze = require('../internals/internal-metadata').onFreeze
    const FREEZING = require('../internals/freezing')
    const fails = require('../internals/fails')

    // eslint-disable-next-line es/no-object-preventextensions -- safe
    const $preventExtensions = Object.preventExtensions
    const FAILS_ON_PRIMITIVES = fails(function () { $preventExtensions(1) })

    // `Object.preventExtensions` method
    // https://tc39.es/ecma262/#sec-object.preventextensions
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
      preventExtensions: function preventExtensions (it) {
        return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze(it)) : it
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/freezing': 59, '../internals/internal-metadata': 76, '../internals/is-object': 82 }],
  270: [function (require, module, exports) {
    const $ = require('../internals/export')
    const isObject = require('../internals/is-object')
    const onFreeze = require('../internals/internal-metadata').onFreeze
    const FREEZING = require('../internals/freezing')
    const fails = require('../internals/fails')

    // eslint-disable-next-line es/no-object-seal -- safe
    const $seal = Object.seal
    const FAILS_ON_PRIMITIVES = fails(function () { $seal(1) })

    // `Object.seal` method
    // https://tc39.es/ecma262/#sec-object.seal
    $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
      seal: function seal (it) {
        return $seal && isObject(it) ? $seal(onFreeze(it)) : it
      }
    })
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/freezing': 59, '../internals/internal-metadata': 76, '../internals/is-object': 82 }],
  271: [function (require, module, exports) {
    const $ = require('../internals/export')
    const setPrototypeOf = require('../internals/object-set-prototype-of')

    // `Object.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.setprototypeof
    $({ target: 'Object', stat: true }, {
      setPrototypeOf: setPrototypeOf
    })
  }, { '../internals/export': 55, '../internals/object-set-prototype-of': 116 }],
  272: [function (require, module, exports) {
    const TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support')
    const redefine = require('../internals/redefine')
    const toString = require('../internals/object-to-string')

    // `Object.prototype.toString` method
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    if (!TO_STRING_TAG_SUPPORT) {
      redefine(Object.prototype, 'toString', toString, { unsafe: true })
    }
  }, { '../internals/object-to-string': 118, '../internals/redefine': 124, '../internals/to-string-tag-support': 159 }],
  273: [function (require, module, exports) {
    const $ = require('../internals/export')
    const $values = require('../internals/object-to-array').values

    // `Object.values` method
    // https://tc39.es/ecma262/#sec-object.values
    $({ target: 'Object', stat: true }, {
      values: function values (O) {
        return $values(O)
      }
    })
  }, { '../internals/export': 55, '../internals/object-to-array': 117 }],
  274: [function (require, module, exports) {
    const $ = require('../internals/export')
    const parseFloatImplementation = require('../internals/number-parse-float')

    // `parseFloat` method
    // https://tc39.es/ecma262/#sec-parsefloat-string
    $({ global: true, forced: parseFloat != parseFloatImplementation }, {
      parseFloat: parseFloatImplementation
    })
  }, { '../internals/export': 55, '../internals/number-parse-float': 101 }],
  275: [function (require, module, exports) {
    const $ = require('../internals/export')
    const parseIntImplementation = require('../internals/number-parse-int')

    // `parseInt` method
    // https://tc39.es/ecma262/#sec-parseint-string-radix
    $({ global: true, forced: parseInt != parseIntImplementation }, {
      parseInt: parseIntImplementation
    })
  }, { '../internals/export': 55, '../internals/number-parse-int': 102 }],
  276: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aFunction = require('../internals/a-function')
    const newPromiseCapabilityModule = require('../internals/new-promise-capability')
    const perform = require('../internals/perform')
    const iterate = require('../internals/iterate')

    // `Promise.allSettled` method
    // https://tc39.es/ecma262/#sec-promise.allsettled
    $({ target: 'Promise', stat: true }, {
      allSettled: function allSettled (iterable) {
        const C = this
        const capability = newPromiseCapabilityModule.f(C)
        const resolve = capability.resolve
        const reject = capability.reject
        const result = perform(function () {
          const promiseResolve = aFunction(C.resolve)
          const values = []
          let counter = 0
          let remaining = 1
          iterate(iterable, function (promise) {
            const index = counter++
            let alreadyCalled = false
            values.push(undefined)
            remaining++
            promiseResolve.call(C, promise).then(function (value) {
              if (alreadyCalled) return
              alreadyCalled = true
              values[index] = { status: 'fulfilled', value: value }
              --remaining || resolve(values)
            }, function (error) {
              if (alreadyCalled) return
              alreadyCalled = true
              values[index] = { status: 'rejected', reason: error }
              --remaining || resolve(values)
            })
          })
          --remaining || resolve(values)
        })
        if (result.error) reject(result.value)
        return capability.promise
      }
    })
  }, { '../internals/a-function': 1, '../internals/export': 55, '../internals/iterate': 85, '../internals/new-promise-capability': 98, '../internals/perform': 121 }],
  277: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aFunction = require('../internals/a-function')
    const getBuiltIn = require('../internals/get-built-in')
    const newPromiseCapabilityModule = require('../internals/new-promise-capability')
    const perform = require('../internals/perform')
    const iterate = require('../internals/iterate')

    const PROMISE_ANY_ERROR = 'No one promise resolved'

    // `Promise.any` method
    // https://tc39.es/ecma262/#sec-promise.any
    $({ target: 'Promise', stat: true }, {
      any: function any (iterable) {
        const C = this
        const capability = newPromiseCapabilityModule.f(C)
        const resolve = capability.resolve
        const reject = capability.reject
        const result = perform(function () {
          const promiseResolve = aFunction(C.resolve)
          const errors = []
          let counter = 0
          let remaining = 1
          let alreadyResolved = false
          iterate(iterable, function (promise) {
            const index = counter++
            let alreadyRejected = false
            errors.push(undefined)
            remaining++
            promiseResolve.call(C, promise).then(function (value) {
              if (alreadyRejected || alreadyResolved) return
              alreadyResolved = true
              resolve(value)
            }, function (error) {
              if (alreadyRejected || alreadyResolved) return
              alreadyRejected = true
              errors[index] = error
              --remaining || reject(new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR))
            })
          })
          --remaining || reject(new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR))
        })
        if (result.error) reject(result.value)
        return capability.promise
      }
    })
  }, { '../internals/a-function': 1, '../internals/export': 55, '../internals/get-built-in': 62, '../internals/iterate': 85, '../internals/new-promise-capability': 98, '../internals/perform': 121 }],
  278: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const IS_PURE = require('../internals/is-pure')
    const NativePromise = require('../internals/native-promise-constructor')
    const fails = require('../internals/fails')
    const getBuiltIn = require('../internals/get-built-in')
    const speciesConstructor = require('../internals/species-constructor')
    const promiseResolve = require('../internals/promise-resolve')
    const redefine = require('../internals/redefine')

    // Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
    const NON_GENERIC = !!NativePromise && fails(function () {
      NativePromise.prototype.finally.call({ then: function () { /* empty */ } }, function () { /* empty */ })
    })

    // `Promise.prototype.finally` method
    // https://tc39.es/ecma262/#sec-promise.prototype.finally
    $({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
      finally: function (onFinally) {
        const C = speciesConstructor(this, getBuiltIn('Promise'))
        const isFunction = typeof onFinally === 'function'
        return this.then(
          isFunction
            ? function (x) {
              return promiseResolve(C, onFinally()).then(function () { return x })
            }
            : onFinally,
          isFunction
            ? function (e) {
              return promiseResolve(C, onFinally()).then(function () { throw e })
            }
            : onFinally
        )
      }
    })

    // makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
    if (!IS_PURE && typeof NativePromise === 'function') {
      const method = getBuiltIn('Promise').prototype.finally
      if (NativePromise.prototype.finally !== method) {
        redefine(NativePromise.prototype, 'finally', method, { unsafe: true })
      }
    }
  }, { '../internals/export': 55, '../internals/fails': 56, '../internals/get-built-in': 62, '../internals/is-pure': 83, '../internals/native-promise-constructor': 94, '../internals/promise-resolve': 122, '../internals/redefine': 124, '../internals/species-constructor': 139 }],
  279: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const IS_PURE = require('../internals/is-pure')
    const global = require('../internals/global')
    const getBuiltIn = require('../internals/get-built-in')
    const NativePromise = require('../internals/native-promise-constructor')
    const redefine = require('../internals/redefine')
    const redefineAll = require('../internals/redefine-all')
    const setPrototypeOf = require('../internals/object-set-prototype-of')
    const setToStringTag = require('../internals/set-to-string-tag')
    const setSpecies = require('../internals/set-species')
    const isObject = require('../internals/is-object')
    const aFunction = require('../internals/a-function')
    const anInstance = require('../internals/an-instance')
    const inspectSource = require('../internals/inspect-source')
    const iterate = require('../internals/iterate')
    const checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration')
    const speciesConstructor = require('../internals/species-constructor')
    const task = require('../internals/task').set
    const microtask = require('../internals/microtask')
    const promiseResolve = require('../internals/promise-resolve')
    const hostReportErrors = require('../internals/host-report-errors')
    const newPromiseCapabilityModule = require('../internals/new-promise-capability')
    const perform = require('../internals/perform')
    const InternalStateModule = require('../internals/internal-state')
    const isForced = require('../internals/is-forced')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IS_BROWSER = require('../internals/engine-is-browser')
    const IS_NODE = require('../internals/engine-is-node')
    const V8_VERSION = require('../internals/engine-v8-version')

    const SPECIES = wellKnownSymbol('species')
    const PROMISE = 'Promise'
    const getInternalState = InternalStateModule.get
    const setInternalState = InternalStateModule.set
    const getInternalPromiseState = InternalStateModule.getterFor(PROMISE)
    const NativePromisePrototype = NativePromise && NativePromise.prototype
    let PromiseConstructor = NativePromise
    let PromiseConstructorPrototype = NativePromisePrototype
    const TypeError = global.TypeError
    const document = global.document
    const process = global.process
    let newPromiseCapability = newPromiseCapabilityModule.f
    const newGenericPromiseCapability = newPromiseCapability
    const DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent)
    const NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent === 'function'
    const UNHANDLED_REJECTION = 'unhandledrejection'
    const REJECTION_HANDLED = 'rejectionhandled'
    const PENDING = 0
    const FULFILLED = 1
    const REJECTED = 2
    const HANDLED = 1
    const UNHANDLED = 2
    let SUBCLASSING = false
    let Internal, OwnPromiseCapability, PromiseWrapper, nativeThen

    const FORCED = isForced(PROMISE, function () {
      const PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor)
      const GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor)
      // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // We can't detect it synchronously, so just check versions
      if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true
      // We need Promise#finally in the pure version for preventing prototype pollution
      if (IS_PURE && !PromiseConstructorPrototype.finally) return true
      // We can't use @@species feature detection in V8 since it causes
      // deoptimization and performance degradation
      // https://github.com/zloirock/core-js/issues/679
      if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false
      // Detect correctness of subclassing with @@species support
      const promise = new PromiseConstructor(function (resolve) { resolve(1) })
      const FakePromise = function (exec) {
        exec(function () { /* empty */ }, function () { /* empty */ })
      }
      const constructor = promise.constructor = {}
      constructor[SPECIES] = FakePromise
      SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise
      if (!SUBCLASSING) return true
      // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT
    })

    const INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
      PromiseConstructor.all(iterable).catch(function () { /* empty */ })
    })

    // helpers
    const isThenable = function (it) {
      let then
      return isObject(it) && typeof (then = it.then) === 'function' ? then : false
    }

    const notify = function (state, isReject) {
      if (state.notified) return
      state.notified = true
      const chain = state.reactions
      microtask(function () {
        const value = state.value
        const ok = state.state == FULFILLED
        let index = 0
        // variable length - can't use forEach
        while (chain.length > index) {
          const reaction = chain[index++]
          const handler = ok ? reaction.ok : reaction.fail
          const resolve = reaction.resolve
          const reject = reaction.reject
          const domain = reaction.domain
          var result, then, exited
          try {
            if (handler) {
              if (!ok) {
                if (state.rejection === UNHANDLED) onHandleUnhandled(state)
                state.rejection = HANDLED
              }
              if (handler === true) result = value
              else {
                if (domain) domain.enter()
                result = handler(value) // can throw
                if (domain) {
                  domain.exit()
                  exited = true
                }
              }
              if (result === reaction.promise) {
                reject(TypeError('Promise-chain cycle'))
              } else if (then = isThenable(result)) {
                then.call(result, resolve, reject)
              } else resolve(result)
            } else reject(value)
          } catch (error) {
            if (domain && !exited) domain.exit()
            reject(error)
          }
        }
        state.reactions = []
        state.notified = false
        if (isReject && !state.rejection) onUnhandled(state)
      })
    }

    const dispatchEvent = function (name, promise, reason) {
      let event, handler
      if (DISPATCH_EVENT) {
        event = document.createEvent('Event')
        event.promise = promise
        event.reason = reason
        event.initEvent(name, false, true)
        global.dispatchEvent(event)
      } else event = { promise: promise, reason: reason }
      if (!NATIVE_REJECTION_EVENT && (handler = global['on' + name])) handler(event)
      else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason)
    }

    var onUnhandled = function (state) {
      task.call(global, function () {
        const promise = state.facade
        const value = state.value
        const IS_UNHANDLED = isUnhandled(state)
        let result
        if (IS_UNHANDLED) {
          result = perform(function () {
            if (IS_NODE) {
              process.emit('unhandledRejection', value, promise)
            } else dispatchEvent(UNHANDLED_REJECTION, promise, value)
          })
          // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
          state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED
          if (result.error) throw result.value
        }
      })
    }

    var isUnhandled = function (state) {
      return state.rejection !== HANDLED && !state.parent
    }

    var onHandleUnhandled = function (state) {
      task.call(global, function () {
        const promise = state.facade
        if (IS_NODE) {
          process.emit('rejectionHandled', promise)
        } else dispatchEvent(REJECTION_HANDLED, promise, state.value)
      })
    }

    const bind = function (fn, state, unwrap) {
      return function (value) {
        fn(state, value, unwrap)
      }
    }

    const internalReject = function (state, value, unwrap) {
      if (state.done) return
      state.done = true
      if (unwrap) state = unwrap
      state.value = value
      state.state = REJECTED
      notify(state, true)
    }

    var internalResolve = function (state, value, unwrap) {
      if (state.done) return
      state.done = true
      if (unwrap) state = unwrap
      try {
        if (state.facade === value) throw TypeError("Promise can't be resolved itself")
        const then = isThenable(value)
        if (then) {
          microtask(function () {
            const wrapper = { done: false }
            try {
              then.call(value,
                bind(internalResolve, wrapper, state),
                bind(internalReject, wrapper, state)
              )
            } catch (error) {
              internalReject(wrapper, error, state)
            }
          })
        } else {
          state.value = value
          state.state = FULFILLED
          notify(state, false)
        }
      } catch (error) {
        internalReject({ done: false }, error, state)
      }
    }

    // constructor polyfill
    if (FORCED) {
      // 25.4.3.1 Promise(executor)
      PromiseConstructor = function Promise (executor) {
        anInstance(this, PromiseConstructor, PROMISE)
        aFunction(executor)
        Internal.call(this)
        const state = getInternalState(this)
        try {
          executor(bind(internalResolve, state), bind(internalReject, state))
        } catch (error) {
          internalReject(state, error)
        }
      }
      PromiseConstructorPrototype = PromiseConstructor.prototype
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      Internal = function Promise (executor) {
        setInternalState(this, {
          type: PROMISE,
          done: false,
          notified: false,
          parent: false,
          reactions: [],
          rejection: false,
          state: PENDING,
          value: undefined
        })
      }
      Internal.prototype = redefineAll(PromiseConstructorPrototype, {
        // `Promise.prototype.then` method
        // https://tc39.es/ecma262/#sec-promise.prototype.then
        then: function then (onFulfilled, onRejected) {
          const state = getInternalPromiseState(this)
          const reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor))
          reaction.ok = typeof onFulfilled === 'function' ? onFulfilled : true
          reaction.fail = typeof onRejected === 'function' && onRejected
          reaction.domain = IS_NODE ? process.domain : undefined
          state.parent = true
          state.reactions.push(reaction)
          if (state.state != PENDING) notify(state, false)
          return reaction.promise
        },
        // `Promise.prototype.catch` method
        // https://tc39.es/ecma262/#sec-promise.prototype.catch
        catch: function (onRejected) {
          return this.then(undefined, onRejected)
        }
      })
      OwnPromiseCapability = function () {
        const promise = new Internal()
        const state = getInternalState(promise)
        this.promise = promise
        this.resolve = bind(internalResolve, state)
        this.reject = bind(internalReject, state)
      }
      newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
        return C === PromiseConstructor || C === PromiseWrapper
          ? new OwnPromiseCapability(C)
          : newGenericPromiseCapability(C)
      }

      if (!IS_PURE && typeof NativePromise === 'function' && NativePromisePrototype !== Object.prototype) {
        nativeThen = NativePromisePrototype.then

        if (!SUBCLASSING) {
          // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
          redefine(NativePromisePrototype, 'then', function then (onFulfilled, onRejected) {
            const that = this
            return new PromiseConstructor(function (resolve, reject) {
              nativeThen.call(that, resolve, reject)
            }).then(onFulfilled, onRejected)
            // https://github.com/zloirock/core-js/issues/640
          }, { unsafe: true })

          // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
          redefine(NativePromisePrototype, 'catch', PromiseConstructorPrototype.catch, { unsafe: true })
        }

        // make `.constructor === Promise` work for native promise-based APIs
        try {
          delete NativePromisePrototype.constructor
        } catch (error) { /* empty */ }

        // make `instanceof Promise` work for native promise-based APIs
        if (setPrototypeOf) {
          setPrototypeOf(NativePromisePrototype, PromiseConstructorPrototype)
        }
      }
    }

    $({ global: true, wrap: true, forced: FORCED }, {
      Promise: PromiseConstructor
    })

    setToStringTag(PromiseConstructor, PROMISE, false, true)
    setSpecies(PROMISE)

    PromiseWrapper = getBuiltIn(PROMISE)

    // statics
    $({ target: PROMISE, stat: true, forced: FORCED }, {
      // `Promise.reject` method
      // https://tc39.es/ecma262/#sec-promise.reject
      reject: function reject (r) {
        const capability = newPromiseCapability(this)
        capability.reject.call(undefined, r)
        return capability.promise
      }
    })

    $({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
      // `Promise.resolve` method
      // https://tc39.es/ecma262/#sec-promise.resolve
      resolve: function resolve (x) {
        return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x)
      }
    })

    $({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
      // `Promise.all` method
      // https://tc39.es/ecma262/#sec-promise.all
      all: function all (iterable) {
        const C = this
        const capability = newPromiseCapability(C)
        const resolve = capability.resolve
        const reject = capability.reject
        const result = perform(function () {
          const $promiseResolve = aFunction(C.resolve)
          const values = []
          let counter = 0
          let remaining = 1
          iterate(iterable, function (promise) {
            const index = counter++
            let alreadyCalled = false
            values.push(undefined)
            remaining++
            $promiseResolve.call(C, promise).then(function (value) {
              if (alreadyCalled) return
              alreadyCalled = true
              values[index] = value
              --remaining || resolve(values)
            }, reject)
          })
          --remaining || resolve(values)
        })
        if (result.error) reject(result.value)
        return capability.promise
      },
      // `Promise.race` method
      // https://tc39.es/ecma262/#sec-promise.race
      race: function race (iterable) {
        const C = this
        const capability = newPromiseCapability(C)
        const reject = capability.reject
        const result = perform(function () {
          const $promiseResolve = aFunction(C.resolve)
          iterate(iterable, function (promise) {
            $promiseResolve.call(C, promise).then(capability.resolve, reject)
          })
        })
        if (result.error) reject(result.value)
        return capability.promise
      }
    })
  }, { '../internals/a-function': 1, '../internals/an-instance': 5, '../internals/check-correctness-of-iteration': 23, '../internals/engine-is-browser': 46, '../internals/engine-is-node': 49, '../internals/engine-v8-version': 52, '../internals/export': 55, '../internals/get-built-in': 62, '../internals/global': 66, '../internals/host-report-errors': 69, '../internals/inspect-source': 75, '../internals/internal-state': 77, '../internals/is-forced': 80, '../internals/is-object': 82, '../internals/is-pure': 83, '../internals/iterate': 85, '../internals/microtask': 93, '../internals/native-promise-constructor': 94, '../internals/new-promise-capability': 98, '../internals/object-set-prototype-of': 116, '../internals/perform': 121, '../internals/promise-resolve': 122, '../internals/redefine': 124, '../internals/redefine-all': 123, '../internals/set-species': 134, '../internals/set-to-string-tag': 135, '../internals/species-constructor': 139, '../internals/task': 148, '../internals/well-known-symbol': 167 }],
  280: [function (require, module, exports) {
    const $ = require('../internals/export')
    const getBuiltIn = require('../internals/get-built-in')
    const aFunction = require('../internals/a-function')
    const anObject = require('../internals/an-object')
    const fails = require('../internals/fails')

    const nativeApply = getBuiltIn('Reflect', 'apply')
    const functionApply = Function.apply

    // MS Edge argumentsList argument is optional
    const OPTIONAL_ARGUMENTS_LIST = !fails(function () {
      nativeApply(function () { /* empty */ })
    })

    // `Reflect.apply` method
    // https://tc39.es/ecma262/#sec-reflect.apply
    $({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
      apply: function apply (target, thisArgument, argumentsList) {
        aFunction(target)
        anObject(argumentsList)
        return nativeApply
          ? nativeApply(target, thisArgument, argumentsList)
          : functionApply.call(target, thisArgument, argumentsList)
      }
    })
  }, { '../internals/a-function': 1, '../internals/an-object': 6, '../internals/export': 55, '../internals/fails': 56, '../internals/get-built-in': 62 }],
  281: [function (require, module, exports) {
    const $ = require('../internals/export')
    const getBuiltIn = require('../internals/get-built-in')
    const aFunction = require('../internals/a-function')
    const anObject = require('../internals/an-object')
    const isObject = require('../internals/is-object')
    const create = require('../internals/object-create')
    const bind = require('../internals/function-bind')
    const fails = require('../internals/fails')

    const nativeConstruct = getBuiltIn('Reflect', 'construct')

    // `Reflect.construct` method
    // https://tc39.es/ecma262/#sec-reflect.construct
    // MS Edge supports only 2 arguments and argumentsList argument is optional
    // FF Nightly sets third argument as `new.target`, but does not create `this` from it
    const NEW_TARGET_BUG = fails(function () {
      function F () { /* empty */ }
      return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F)
    })
    const ARGS_BUG = !fails(function () {
      nativeConstruct(function () { /* empty */ })
    })
    const FORCED = NEW_TARGET_BUG || ARGS_BUG

    $({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
      construct: function construct (Target, args /* , newTarget */) {
        aFunction(Target)
        anObject(args)
        const newTarget = arguments.length < 3 ? Target : aFunction(arguments[2])
        if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget)
        if (Target == newTarget) {
          // w/o altered newTarget, optimization for 0-4 arguments
          switch (args.length) {
            case 0: return new Target()
            case 1: return new Target(args[0])
            case 2: return new Target(args[0], args[1])
            case 3: return new Target(args[0], args[1], args[2])
            case 4: return new Target(args[0], args[1], args[2], args[3])
          }
          // w/o altered newTarget, lot of arguments case
          const $args = [null]
          $args.push.apply($args, args)
          return new (bind.apply(Target, $args))()
        }
        // with altered newTarget, not support built-in constructors
        const proto = newTarget.prototype
        const instance = create(isObject(proto) ? proto : Object.prototype)
        const result = Function.apply.call(Target, instance, args)
        return isObject(result) ? result : instance
      }
    })
  }, { '../internals/a-function': 1, '../internals/an-object': 6, '../internals/export': 55, '../internals/fails': 56, '../internals/function-bind': 61, '../internals/get-built-in': 62, '../internals/is-object': 82, '../internals/object-create': 104 }],
  282: [function (require, module, exports) {
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const anObject = require('../internals/an-object')
    const toPrimitive = require('../internals/to-primitive')
    const definePropertyModule = require('../internals/object-define-property')
    const fails = require('../internals/fails')

    // MS Edge has broken Reflect.defineProperty - throwing instead of returning false
    const ERROR_INSTEAD_OF_FALSE = fails(function () {
      // eslint-disable-next-line es/no-reflect -- required for testing
      Reflect.defineProperty(definePropertyModule.f({}, 1, { value: 1 }), 1, { value: 2 })
    })

    // `Reflect.defineProperty` method
    // https://tc39.es/ecma262/#sec-reflect.defineproperty
    $({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS }, {
      defineProperty: function defineProperty (target, propertyKey, attributes) {
        anObject(target)
        const key = toPrimitive(propertyKey, true)
        anObject(attributes)
        try {
          definePropertyModule.f(target, key, attributes)
          return true
        } catch (error) {
          return false
        }
      }
    })
  }, { '../internals/an-object': 6, '../internals/descriptors': 42, '../internals/export': 55, '../internals/fails': 56, '../internals/object-define-property': 106, '../internals/to-primitive': 158 }],
  283: [function (require, module, exports) {
    const $ = require('../internals/export')
    const anObject = require('../internals/an-object')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f

    // `Reflect.deleteProperty` method
    // https://tc39.es/ecma262/#sec-reflect.deleteproperty
    $({ target: 'Reflect', stat: true }, {
      deleteProperty: function deleteProperty (target, propertyKey) {
        const descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey)
        return descriptor && !descriptor.configurable ? false : delete target[propertyKey]
      }
    })
  }, { '../internals/an-object': 6, '../internals/export': 55, '../internals/object-get-own-property-descriptor': 107 }],
  284: [function (require, module, exports) {
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const anObject = require('../internals/an-object')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')

    // `Reflect.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-reflect.getownpropertydescriptor
    $({ target: 'Reflect', stat: true, sham: !DESCRIPTORS }, {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor (target, propertyKey) {
        return getOwnPropertyDescriptorModule.f(anObject(target), propertyKey)
      }
    })
  }, { '../internals/an-object': 6, '../internals/descriptors': 42, '../internals/export': 55, '../internals/object-get-own-property-descriptor': 107 }],
  285: [function (require, module, exports) {
    const $ = require('../internals/export')
    const anObject = require('../internals/an-object')
    const objectGetPrototypeOf = require('../internals/object-get-prototype-of')
    const CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter')

    // `Reflect.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-reflect.getprototypeof
    $({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
      getPrototypeOf: function getPrototypeOf (target) {
        return objectGetPrototypeOf(anObject(target))
      }
    })
  }, { '../internals/an-object': 6, '../internals/correct-prototype-getter': 32, '../internals/export': 55, '../internals/object-get-prototype-of': 111 }],
  286: [function (require, module, exports) {
    const $ = require('../internals/export')
    const isObject = require('../internals/is-object')
    const anObject = require('../internals/an-object')
    const has = require('../internals/has')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const getPrototypeOf = require('../internals/object-get-prototype-of')

    // `Reflect.get` method
    // https://tc39.es/ecma262/#sec-reflect.get
    function get (target, propertyKey /* , receiver */) {
      const receiver = arguments.length < 3 ? target : arguments[2]
      let descriptor, prototype
      if (anObject(target) === receiver) return target[propertyKey]
      if (descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey)) {
        return has(descriptor, 'value')
          ? descriptor.value
          : descriptor.get === undefined
            ? undefined
            : descriptor.get.call(receiver)
      }
      if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver)
    }

    $({ target: 'Reflect', stat: true }, {
      get: get
    })
  }, { '../internals/an-object': 6, '../internals/export': 55, '../internals/has': 67, '../internals/is-object': 82, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-prototype-of': 111 }],
  287: [function (require, module, exports) {
    const $ = require('../internals/export')

    // `Reflect.has` method
    // https://tc39.es/ecma262/#sec-reflect.has
    $({ target: 'Reflect', stat: true }, {
      has: function has (target, propertyKey) {
        return propertyKey in target
      }
    })
  }, { '../internals/export': 55 }],
  288: [function (require, module, exports) {
    const $ = require('../internals/export')
    const anObject = require('../internals/an-object')

    // eslint-disable-next-line es/no-object-isextensible -- safe
    const objectIsExtensible = Object.isExtensible

    // `Reflect.isExtensible` method
    // https://tc39.es/ecma262/#sec-reflect.isextensible
    $({ target: 'Reflect', stat: true }, {
      isExtensible: function isExtensible (target) {
        anObject(target)
        return objectIsExtensible ? objectIsExtensible(target) : true
      }
    })
  }, { '../internals/an-object': 6, '../internals/export': 55 }],
  289: [function (require, module, exports) {
    const $ = require('../internals/export')
    const ownKeys = require('../internals/own-keys')

    // `Reflect.ownKeys` method
    // https://tc39.es/ecma262/#sec-reflect.ownkeys
    $({ target: 'Reflect', stat: true }, {
      ownKeys: ownKeys
    })
  }, { '../internals/export': 55, '../internals/own-keys': 119 }],
  290: [function (require, module, exports) {
    const $ = require('../internals/export')
    const getBuiltIn = require('../internals/get-built-in')
    const anObject = require('../internals/an-object')
    const FREEZING = require('../internals/freezing')

    // `Reflect.preventExtensions` method
    // https://tc39.es/ecma262/#sec-reflect.preventextensions
    $({ target: 'Reflect', stat: true, sham: !FREEZING }, {
      preventExtensions: function preventExtensions (target) {
        anObject(target)
        try {
          const objectPreventExtensions = getBuiltIn('Object', 'preventExtensions')
          if (objectPreventExtensions) objectPreventExtensions(target)
          return true
        } catch (error) {
          return false
        }
      }
    })
  }, { '../internals/an-object': 6, '../internals/export': 55, '../internals/freezing': 59, '../internals/get-built-in': 62 }],
  291: [function (require, module, exports) {
    const $ = require('../internals/export')
    const anObject = require('../internals/an-object')
    const aPossiblePrototype = require('../internals/a-possible-prototype')
    const objectSetPrototypeOf = require('../internals/object-set-prototype-of')

    // `Reflect.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-reflect.setprototypeof
    if (objectSetPrototypeOf) {
      $({ target: 'Reflect', stat: true }, {
        setPrototypeOf: function setPrototypeOf (target, proto) {
          anObject(target)
          aPossiblePrototype(proto)
          try {
            objectSetPrototypeOf(target, proto)
            return true
          } catch (error) {
            return false
          }
        }
      })
    }
  }, { '../internals/a-possible-prototype': 2, '../internals/an-object': 6, '../internals/export': 55, '../internals/object-set-prototype-of': 116 }],
  292: [function (require, module, exports) {
    const $ = require('../internals/export')
    const anObject = require('../internals/an-object')
    const isObject = require('../internals/is-object')
    const has = require('../internals/has')
    const fails = require('../internals/fails')
    const definePropertyModule = require('../internals/object-define-property')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    // `Reflect.set` method
    // https://tc39.es/ecma262/#sec-reflect.set
    function set (target, propertyKey, V /* , receiver */) {
      const receiver = arguments.length < 4 ? target : arguments[3]
      let ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey)
      let existingDescriptor, prototype
      if (!ownDescriptor) {
        if (isObject(prototype = getPrototypeOf(target))) {
          return set(prototype, propertyKey, V, receiver)
        }
        ownDescriptor = createPropertyDescriptor(0)
      }
      if (has(ownDescriptor, 'value')) {
        if (ownDescriptor.writable === false || !isObject(receiver)) return false
        if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
          if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false
          existingDescriptor.value = V
          definePropertyModule.f(receiver, propertyKey, existingDescriptor)
        } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V))
        return true
      }
      return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true)
    }

    // MS Edge 17-18 Reflect.set allows setting the property to object
    // with non-writable property on the prototype
    const MS_EDGE_BUG = fails(function () {
      const Constructor = function () { /* empty */ }
      const object = definePropertyModule.f(new Constructor(), 'a', { configurable: true })
      // eslint-disable-next-line es/no-reflect -- required for testing
      return Reflect.set(Constructor.prototype, 'a', 1, object) !== false
    })

    $({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
      set: set
    })
  }, { '../internals/an-object': 6, '../internals/create-property-descriptor': 36, '../internals/export': 55, '../internals/fails': 56, '../internals/has': 67, '../internals/is-object': 82, '../internals/object-define-property': 106, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-prototype-of': 111 }],
  293: [function (require, module, exports) {
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const setToStringTag = require('../internals/set-to-string-tag')

    $({ global: true }, { Reflect: {} })

    // Reflect[@@toStringTag] property
    // https://tc39.es/ecma262/#sec-reflect-@@tostringtag
    setToStringTag(global.Reflect, 'Reflect', true)
  }, { '../internals/export': 55, '../internals/global': 66, '../internals/set-to-string-tag': 135 }],
  294: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const global = require('../internals/global')
    const isForced = require('../internals/is-forced')
    const inheritIfRequired = require('../internals/inherit-if-required')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const defineProperty = require('../internals/object-define-property').f
    const getOwnPropertyNames = require('../internals/object-get-own-property-names').f
    const isRegExp = require('../internals/is-regexp')
    const getFlags = require('../internals/regexp-flags')
    const stickyHelpers = require('../internals/regexp-sticky-helpers')
    const redefine = require('../internals/redefine')
    const fails = require('../internals/fails')
    const has = require('../internals/has')
    const enforceInternalState = require('../internals/internal-state').enforce
    const setSpecies = require('../internals/set-species')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all')
    const UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg')

    const MATCH = wellKnownSymbol('match')
    const NativeRegExp = global.RegExp
    const RegExpPrototype = NativeRegExp.prototype
    // TODO: Use only propper RegExpIdentifierName
    const IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/
    const re1 = /a/g
    const re2 = /a/g

    // "new" should create a new object, old webkit bug
    const CORRECT_NEW = new NativeRegExp(re1) !== re1

    const UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y

    const BASE_FORCED = DESCRIPTORS &&
  (!CORRECT_NEW || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function () {
    re2[MATCH] = false
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i'
  }))

    const handleDotAll = function (string) {
      const length = string.length
      let index = 0
      let result = ''
      let brackets = false
      let chr
      for (; index <= length; index++) {
        chr = string.charAt(index)
        if (chr === '\\') {
          result += chr + string.charAt(++index)
          continue
        }
        if (!brackets && chr === '.') {
          result += '[\\s\\S]'
        } else {
          if (chr === '[') {
            brackets = true
          } else if (chr === ']') {
            brackets = false
          } result += chr
        }
      } return result
    }

    const handleNCG = function (string) {
      const length = string.length
      let index = 0
      let result = ''
      const named = []
      const names = {}
      let brackets = false
      let ncg = false
      let groupid = 0
      let groupname = ''
      let chr
      for (; index <= length; index++) {
        chr = string.charAt(index)
        if (chr === '\\') {
          chr = chr + string.charAt(++index)
        } else if (chr === ']') {
          brackets = false
        } else if (!brackets) {
          switch (true) {
            case chr === '[':
              brackets = true
              break
            case chr === '(':
              if (IS_NCG.test(string.slice(index + 1))) {
                index += 2
                ncg = true
              }
              result += chr
              groupid++
              continue
            case chr === '>' && ncg:
              if (groupname === '' || has(names, groupname)) {
                throw new SyntaxError('Invalid capture group name')
              }
              names[groupname] = true
              named.push([groupname, groupid])
              ncg = false
              groupname = ''
              continue
          }
        }
        if (ncg) groupname += chr
        else result += chr
      } return [result, named]
    }

    // `RegExp` constructor
    // https://tc39.es/ecma262/#sec-regexp-constructor
    if (isForced('RegExp', BASE_FORCED)) {
      var RegExpWrapper = function RegExp (pattern, flags) {
        const thisIsRegExp = this instanceof RegExpWrapper
        const patternIsRegExp = isRegExp(pattern)
        const flagsAreUndefined = flags === undefined
        let groups = []
        let rawPattern = pattern
        let rawFlags, dotAll, sticky, handled, result, state

        if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
          return pattern
        }

        if (patternIsRegExp || pattern instanceof RegExpWrapper) {
          pattern = pattern.source
          if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : getFlags.call(rawPattern)
        }

        pattern = pattern === undefined ? '' : String(pattern)
        flags = flags === undefined ? '' : String(flags)
        rawPattern = pattern

        if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
          dotAll = !!flags && flags.indexOf('s') > -1
          if (dotAll) flags = flags.replace(/s/g, '')
        }

        rawFlags = flags

        if (UNSUPPORTED_Y && 'sticky' in re1) {
          sticky = !!flags && flags.indexOf('y') > -1
          if (sticky) flags = flags.replace(/y/g, '')
        }

        if (UNSUPPORTED_NCG) {
          handled = handleNCG(pattern)
          pattern = handled[0]
          groups = handled[1]
        }

        result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper)

        if (dotAll || sticky || groups.length) {
          state = enforceInternalState(result)
          if (dotAll) {
            state.dotAll = true
            state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags)
          }
          if (sticky) state.sticky = true
          if (groups.length) state.groups = groups
        }

        if (pattern !== rawPattern) {
          try {
          // fails in old engines, but we have no alternatives for unsupported regex syntax
            createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern)
          } catch (error) { /* empty */ }
        }

        return result
      }

      const proxy = function (key) {
        key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
          configurable: true,
          get: function () { return NativeRegExp[key] },
          set: function (it) { NativeRegExp[key] = it }
        })
      }

      for (let keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
        proxy(keys[index++])
      }

      RegExpPrototype.constructor = RegExpWrapper
      RegExpWrapper.prototype = RegExpPrototype
      redefine(global, 'RegExp', RegExpWrapper)
    }

    // https://tc39.es/ecma262/#sec-get-regexp-@@species
    setSpecies('RegExp')
  }, { '../internals/create-non-enumerable-property': 35, '../internals/descriptors': 42, '../internals/fails': 56, '../internals/global': 66, '../internals/has': 67, '../internals/inherit-if-required': 74, '../internals/internal-state': 77, '../internals/is-forced': 80, '../internals/is-regexp': 84, '../internals/object-define-property': 106, '../internals/object-get-own-property-names': 109, '../internals/redefine': 124, '../internals/regexp-flags': 127, '../internals/regexp-sticky-helpers': 128, '../internals/regexp-unsupported-dot-all': 129, '../internals/regexp-unsupported-ncg': 130, '../internals/set-species': 134, '../internals/well-known-symbol': 167 }],
  295: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all')
    const defineProperty = require('../internals/object-define-property').f
    const getInternalState = require('../internals/internal-state').get
    const RegExpPrototype = RegExp.prototype

    // `RegExp.prototype.dotAll` getter
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
    if (DESCRIPTORS && UNSUPPORTED_DOT_ALL) {
      defineProperty(RegExpPrototype, 'dotAll', {
        configurable: true,
        get: function () {
          if (this === RegExpPrototype) return undefined
          // We can't use InternalStateModule.getterFor because
          // we don't add metadata for regexps created by a literal.
          if (this instanceof RegExp) {
            return !!getInternalState(this).dotAll
          }
          throw TypeError('Incompatible receiver, RegExp required')
        }
      })
    }
  }, { '../internals/descriptors': 42, '../internals/internal-state': 77, '../internals/object-define-property': 106, '../internals/regexp-unsupported-dot-all': 129 }],
  296: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const exec = require('../internals/regexp-exec')

    // `RegExp.prototype.exec` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.exec
    $({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
      exec: exec
    })
  }, { '../internals/export': 55, '../internals/regexp-exec': 126 }],
  297: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const objectDefinePropertyModule = require('../internals/object-define-property')
    const regExpFlags = require('../internals/regexp-flags')
    const fails = require('../internals/fails')

    const FORCED = DESCRIPTORS && fails(function () {
      // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
      return Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call({ dotAll: true, sticky: true }) !== 'sy'
    })

    // `RegExp.prototype.flags` getter
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
    if (FORCED) {
      objectDefinePropertyModule.f(RegExp.prototype, 'flags', {
        configurable: true,
        get: regExpFlags
      })
    }
  }, { '../internals/descriptors': 42, '../internals/fails': 56, '../internals/object-define-property': 106, '../internals/regexp-flags': 127 }],
  298: [function (require, module, exports) {
    const DESCRIPTORS = require('../internals/descriptors')
    const UNSUPPORTED_Y = require('../internals/regexp-sticky-helpers').UNSUPPORTED_Y
    const defineProperty = require('../internals/object-define-property').f
    const getInternalState = require('../internals/internal-state').get
    const RegExpPrototype = RegExp.prototype

    // `RegExp.prototype.sticky` getter
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
    if (DESCRIPTORS && UNSUPPORTED_Y) {
      defineProperty(RegExpPrototype, 'sticky', {
        configurable: true,
        get: function () {
          if (this === RegExpPrototype) return undefined
          // We can't use InternalStateModule.getterFor because
          // we don't add metadata for regexps created by a literal.
          if (this instanceof RegExp) {
            return !!getInternalState(this).sticky
          }
          throw TypeError('Incompatible receiver, RegExp required')
        }
      })
    }
  }, { '../internals/descriptors': 42, '../internals/internal-state': 77, '../internals/object-define-property': 106, '../internals/regexp-sticky-helpers': 128 }],
  299: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4` since it's moved to entry points
    require('../modules/es.regexp.exec')
    const $ = require('../internals/export')
    const isObject = require('../internals/is-object')

    const DELEGATES_TO_EXEC = (function () {
      let execCalled = false
      const re = /[ac]/
      re.exec = function () {
        execCalled = true
        return /./.exec.apply(this, arguments)
      }
      return re.test('abc') === true && execCalled
    }())

    const nativeTest = /./.test

    // `RegExp.prototype.test` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.test
    $({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
      test: function (str) {
        if (typeof this.exec !== 'function') {
          return nativeTest.call(this, str)
        }
        const result = this.exec(str)
        if (result !== null && !isObject(result)) {
          throw new Error('RegExp exec method returned something other than an Object or null')
        }
        return !!result
      }
    })
  }, { '../internals/export': 55, '../internals/is-object': 82, '../modules/es.regexp.exec': 296 }],
  300: [function (require, module, exports) {
    'use strict'
    const redefine = require('../internals/redefine')
    const anObject = require('../internals/an-object')
    const fails = require('../internals/fails')
    const flags = require('../internals/regexp-flags')

    const TO_STRING = 'toString'
    const RegExpPrototype = RegExp.prototype
    const nativeToString = RegExpPrototype[TO_STRING]

    const NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b' })
    // FF44- RegExp#toString has a wrong name
    const INCORRECT_NAME = nativeToString.name != TO_STRING

    // `RegExp.prototype.toString` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
    if (NOT_GENERIC || INCORRECT_NAME) {
      redefine(RegExp.prototype, TO_STRING, function toString () {
        const R = anObject(this)
        const p = String(R.source)
        const rf = R.flags
        const f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf)
        return '/' + p + '/' + f
      }, { unsafe: true })
    }
  }, { '../internals/an-object': 6, '../internals/fails': 56, '../internals/redefine': 124, '../internals/regexp-flags': 127 }],
  301: [function (require, module, exports) {
    'use strict'
    const collection = require('../internals/collection')
    const collectionStrong = require('../internals/collection-strong')

    // `Set` constructor
    // https://tc39.es/ecma262/#sec-set-objects
    module.exports = collection('Set', function (init) {
      return function Set () { return init(this, arguments.length ? arguments[0] : undefined) }
    }, collectionStrong)
  }, { '../internals/collection': 29, '../internals/collection-strong': 27 }],
  302: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.anchor` method
    // https://tc39.es/ecma262/#sec-string.prototype.anchor
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('anchor') }, {
      anchor: function anchor (name) {
        return createHTML(this, 'a', 'name', name)
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  303: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.big` method
    // https://tc39.es/ecma262/#sec-string.prototype.big
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('big') }, {
      big: function big () {
        return createHTML(this, 'big', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  304: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.blink` method
    // https://tc39.es/ecma262/#sec-string.prototype.blink
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('blink') }, {
      blink: function blink () {
        return createHTML(this, 'blink', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  305: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.bold` method
    // https://tc39.es/ecma262/#sec-string.prototype.bold
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('bold') }, {
      bold: function bold () {
        return createHTML(this, 'b', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  306: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const codeAt = require('../internals/string-multibyte').codeAt

    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    $({ target: 'String', proto: true }, {
      codePointAt: function codePointAt (pos) {
        return codeAt(this, pos)
      }
    })
  }, { '../internals/export': 55, '../internals/string-multibyte': 141 }],
  307: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const toLength = require('../internals/to-length')
    const notARegExp = require('../internals/not-a-regexp')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const correctIsRegExpLogic = require('../internals/correct-is-regexp-logic')
    const IS_PURE = require('../internals/is-pure')

    // eslint-disable-next-line es/no-string-prototype-endswith -- safe
    const $endsWith = ''.endsWith
    const min = Math.min

    const CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith')
    // https://github.com/zloirock/core-js/pull/702
    const MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!(function () {
      const descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith')
      return descriptor && !descriptor.writable
    }())

    // `String.prototype.endsWith` method
    // https://tc39.es/ecma262/#sec-string.prototype.endswith
    $({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
      endsWith: function endsWith (searchString /* , endPosition = @length */) {
        const that = String(requireObjectCoercible(this))
        notARegExp(searchString)
        const endPosition = arguments.length > 1 ? arguments[1] : undefined
        const len = toLength(that.length)
        const end = endPosition === undefined ? len : min(toLength(endPosition), len)
        const search = String(searchString)
        return $endsWith
          ? $endsWith.call(that, search, end)
          : that.slice(end - search.length, end) === search
      }
    })
  }, { '../internals/correct-is-regexp-logic': 31, '../internals/export': 55, '../internals/is-pure': 83, '../internals/not-a-regexp': 99, '../internals/object-get-own-property-descriptor': 107, '../internals/require-object-coercible': 131, '../internals/to-length': 154 }],
  308: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.fixed` method
    // https://tc39.es/ecma262/#sec-string.prototype.fixed
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fixed') }, {
      fixed: function fixed () {
        return createHTML(this, 'tt', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  309: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.fontcolor` method
    // https://tc39.es/ecma262/#sec-string.prototype.fontcolor
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fontcolor') }, {
      fontcolor: function fontcolor (color) {
        return createHTML(this, 'font', 'color', color)
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  310: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.fontsize` method
    // https://tc39.es/ecma262/#sec-string.prototype.fontsize
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fontsize') }, {
      fontsize: function fontsize (size) {
        return createHTML(this, 'font', 'size', size)
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  311: [function (require, module, exports) {
    const $ = require('../internals/export')
    const toAbsoluteIndex = require('../internals/to-absolute-index')

    const fromCharCode = String.fromCharCode
    // eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
    const $fromCodePoint = String.fromCodePoint

    // length should be 1, old FF problem
    const INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length != 1

    // `String.fromCodePoint` method
    // https://tc39.es/ecma262/#sec-string.fromcodepoint
    $({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      fromCodePoint: function fromCodePoint (x) {
        const elements = []
        const length = arguments.length
        let i = 0
        let code
        while (length > i) {
          code = +arguments[i++]
          if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point')
          elements.push(code < 0x10000
            ? fromCharCode(code)
            : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
          )
        } return elements.join('')
      }
    })
  }, { '../internals/export': 55, '../internals/to-absolute-index': 150 }],
  312: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const notARegExp = require('../internals/not-a-regexp')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const correctIsRegExpLogic = require('../internals/correct-is-regexp-logic')

    // `String.prototype.includes` method
    // https://tc39.es/ecma262/#sec-string.prototype.includes
    $({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
      includes: function includes (searchString /* , position = 0 */) {
        return !!~String(requireObjectCoercible(this))
          .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/correct-is-regexp-logic': 31, '../internals/export': 55, '../internals/not-a-regexp': 99, '../internals/require-object-coercible': 131 }],
  313: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.italics` method
    // https://tc39.es/ecma262/#sec-string.prototype.italics
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('italics') }, {
      italics: function italics () {
        return createHTML(this, 'i', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  314: [function (require, module, exports) {
    'use strict'
    const charAt = require('../internals/string-multibyte').charAt
    const InternalStateModule = require('../internals/internal-state')
    const defineIterator = require('../internals/define-iterator')

    const STRING_ITERATOR = 'String Iterator'
    const setInternalState = InternalStateModule.set
    const getInternalState = InternalStateModule.getterFor(STRING_ITERATOR)

    // `String.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
    defineIterator(String, 'String', function (iterated) {
      setInternalState(this, {
        type: STRING_ITERATOR,
        string: String(iterated),
        index: 0
      })
      // `%StringIteratorPrototype%.next` method
      // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
    }, function next () {
      const state = getInternalState(this)
      const string = state.string
      const index = state.index
      let point
      if (index >= string.length) return { value: undefined, done: true }
      point = charAt(string, index)
      state.index += point.length
      return { value: point, done: false }
    })
  }, { '../internals/define-iterator': 40, '../internals/internal-state': 77, '../internals/string-multibyte': 141 }],
  315: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.link` method
    // https://tc39.es/ecma262/#sec-string.prototype.link
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {
      link: function link (url) {
        return createHTML(this, 'a', 'href', url)
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  316: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-string-prototype-matchall -- safe */
    const $ = require('../internals/export')
    const createIteratorConstructor = require('../internals/create-iterator-constructor')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const toLength = require('../internals/to-length')
    const aFunction = require('../internals/a-function')
    const anObject = require('../internals/an-object')
    const classof = require('../internals/classof-raw')
    const isRegExp = require('../internals/is-regexp')
    const getRegExpFlags = require('../internals/regexp-flags')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const fails = require('../internals/fails')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const speciesConstructor = require('../internals/species-constructor')
    const advanceStringIndex = require('../internals/advance-string-index')
    const InternalStateModule = require('../internals/internal-state')
    const IS_PURE = require('../internals/is-pure')

    const MATCH_ALL = wellKnownSymbol('matchAll')
    const REGEXP_STRING = 'RegExp String'
    const REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator'
    const setInternalState = InternalStateModule.set
    const getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR)
    const RegExpPrototype = RegExp.prototype
    const regExpBuiltinExec = RegExpPrototype.exec
    const nativeMatchAll = ''.matchAll

    const WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
      'a'.matchAll(/./)
    })

    const regExpExec = function (R, S) {
      const exec = R.exec
      let result
      if (typeof exec === 'function') {
        result = exec.call(R, S)
        if (typeof result !== 'object') throw TypeError('Incorrect exec result')
        return result
      } return regExpBuiltinExec.call(R, S)
    }

    // eslint-disable-next-line max-len -- ignore
    const $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator (regexp, string, global, fullUnicode) {
      setInternalState(this, {
        type: REGEXP_STRING_ITERATOR,
        regexp: regexp,
        string: string,
        global: global,
        unicode: fullUnicode,
        done: false
      })
    }, REGEXP_STRING, function next () {
      const state = getInternalState(this)
      if (state.done) return { value: undefined, done: true }
      const R = state.regexp
      const S = state.string
      const match = regExpExec(R, S)
      if (match === null) return { value: undefined, done: state.done = true }
      if (state.global) {
        if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode)
        return { value: match, done: false }
      }
      state.done = true
      return { value: match, done: false }
    })

    const $matchAll = function (string) {
      const R = anObject(this)
      const S = String(string)
      let C, flagsValue, flags, matcher, global, fullUnicode
      C = speciesConstructor(R, RegExp)
      flagsValue = R.flags
      if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
        flagsValue = getRegExpFlags.call(R)
      }
      flags = flagsValue === undefined ? '' : String(flagsValue)
      matcher = new C(C === RegExp ? R.source : R, flags)
      global = !!~flags.indexOf('g')
      fullUnicode = !!~flags.indexOf('u')
      matcher.lastIndex = toLength(R.lastIndex)
      return new $RegExpStringIterator(matcher, S, global, fullUnicode)
    }

    // `String.prototype.matchAll` method
    // https://tc39.es/ecma262/#sec-string.prototype.matchall
    $({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
      matchAll: function matchAll (regexp) {
        const O = requireObjectCoercible(this)
        let flags, S, matcher, rx
        if (regexp != null) {
          if (isRegExp(regexp)) {
            flags = String(requireObjectCoercible('flags' in RegExpPrototype
              ? regexp.flags
              : getRegExpFlags.call(regexp)
            ))
            if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes')
          }
          if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments)
          matcher = regexp[MATCH_ALL]
          if (matcher === undefined && IS_PURE && classof(regexp) == 'RegExp') matcher = $matchAll
          if (matcher != null) return aFunction(matcher).call(regexp, O)
        } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments)
        S = String(O)
        rx = new RegExp(regexp, 'g')
        return IS_PURE ? $matchAll.call(rx, S) : rx[MATCH_ALL](S)
      }
    })

    IS_PURE || MATCH_ALL in RegExpPrototype || createNonEnumerableProperty(RegExpPrototype, MATCH_ALL, $matchAll)
  }, { '../internals/a-function': 1, '../internals/advance-string-index': 4, '../internals/an-object': 6, '../internals/classof-raw': 24, '../internals/create-iterator-constructor': 34, '../internals/create-non-enumerable-property': 35, '../internals/export': 55, '../internals/fails': 56, '../internals/internal-state': 77, '../internals/is-pure': 83, '../internals/is-regexp': 84, '../internals/regexp-flags': 127, '../internals/require-object-coercible': 131, '../internals/species-constructor': 139, '../internals/to-length': 154, '../internals/well-known-symbol': 167 }],
  317: [function (require, module, exports) {
    'use strict'
    const fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic')
    const anObject = require('../internals/an-object')
    const toLength = require('../internals/to-length')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const advanceStringIndex = require('../internals/advance-string-index')
    const regExpExec = require('../internals/regexp-exec-abstract')

    // @@match logic
    fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
      return [
        // `String.prototype.match` method
        // https://tc39.es/ecma262/#sec-string.prototype.match
        function match (regexp) {
          const O = requireObjectCoercible(this)
          const matcher = regexp == undefined ? undefined : regexp[MATCH]
          return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O))
        },
        // `RegExp.prototype[@@match]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
        function (string) {
          const res = maybeCallNative(nativeMatch, this, string)
          if (res.done) return res.value

          const rx = anObject(this)
          const S = String(string)

          if (!rx.global) return regExpExec(rx, S)

          const fullUnicode = rx.unicode
          rx.lastIndex = 0
          const A = []
          let n = 0
          let result
          while ((result = regExpExec(rx, S)) !== null) {
            const matchStr = String(result[0])
            A[n] = matchStr
            if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode)
            n++
          }
          return n === 0 ? null : A
        }
      ]
    })
  }, { '../internals/advance-string-index': 4, '../internals/an-object': 6, '../internals/fix-regexp-well-known-symbol-logic': 57, '../internals/regexp-exec-abstract': 125, '../internals/require-object-coercible': 131, '../internals/to-length': 154 }],
  318: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $padEnd = require('../internals/string-pad').end
    const WEBKIT_BUG = require('../internals/string-pad-webkit-bug')

    // `String.prototype.padEnd` method
    // https://tc39.es/ecma262/#sec-string.prototype.padend
    $({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
      padEnd: function padEnd (maxLength /* , fillString = ' ' */) {
        return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/export': 55, '../internals/string-pad': 143, '../internals/string-pad-webkit-bug': 142 }],
  319: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $padStart = require('../internals/string-pad').start
    const WEBKIT_BUG = require('../internals/string-pad-webkit-bug')

    // `String.prototype.padStart` method
    // https://tc39.es/ecma262/#sec-string.prototype.padstart
    $({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
      padStart: function padStart (maxLength /* , fillString = ' ' */) {
        return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined)
      }
    })
  }, { '../internals/export': 55, '../internals/string-pad': 143, '../internals/string-pad-webkit-bug': 142 }],
  320: [function (require, module, exports) {
    const $ = require('../internals/export')
    const toIndexedObject = require('../internals/to-indexed-object')
    const toLength = require('../internals/to-length')

    // `String.raw` method
    // https://tc39.es/ecma262/#sec-string.raw
    $({ target: 'String', stat: true }, {
      raw: function raw (template) {
        const rawTemplate = toIndexedObject(template.raw)
        const literalSegments = toLength(rawTemplate.length)
        const argumentsLength = arguments.length
        const elements = []
        let i = 0
        while (literalSegments > i) {
          elements.push(String(rawTemplate[i++]))
          if (i < argumentsLength) elements.push(String(arguments[i]))
        } return elements.join('')
      }
    })
  }, { '../internals/export': 55, '../internals/to-indexed-object': 152, '../internals/to-length': 154 }],
  321: [function (require, module, exports) {
    const $ = require('../internals/export')
    const repeat = require('../internals/string-repeat')

    // `String.prototype.repeat` method
    // https://tc39.es/ecma262/#sec-string.prototype.repeat
    $({ target: 'String', proto: true }, {
      repeat: repeat
    })
  }, { '../internals/export': 55, '../internals/string-repeat': 145 }],
  322: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const isRegExp = require('../internals/is-regexp')
    const getRegExpFlags = require('../internals/regexp-flags')
    const getSubstitution = require('../internals/get-substitution')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IS_PURE = require('../internals/is-pure')

    const REPLACE = wellKnownSymbol('replace')
    const RegExpPrototype = RegExp.prototype
    const max = Math.max

    const stringIndexOf = function (string, searchValue, fromIndex) {
      if (fromIndex > string.length) return -1
      if (searchValue === '') return fromIndex
      return string.indexOf(searchValue, fromIndex)
    }

    // `String.prototype.replaceAll` method
    // https://tc39.es/ecma262/#sec-string.prototype.replaceall
    $({ target: 'String', proto: true }, {
      replaceAll: function replaceAll (searchValue, replaceValue) {
        const O = requireObjectCoercible(this)
        let IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement
        let position = 0
        let endOfLastMatch = 0
        let result = ''
        if (searchValue != null) {
          IS_REG_EXP = isRegExp(searchValue)
          if (IS_REG_EXP) {
            flags = String(requireObjectCoercible('flags' in RegExpPrototype
              ? searchValue.flags
              : getRegExpFlags.call(searchValue)
            ))
            if (!~flags.indexOf('g')) throw TypeError('`.replaceAll` does not allow non-global regexes')
          }
          replacer = searchValue[REPLACE]
          if (replacer !== undefined) {
            return replacer.call(searchValue, O, replaceValue)
          } else if (IS_PURE && IS_REG_EXP) {
            return String(O).replace(searchValue, replaceValue)
          }
        }
        string = String(O)
        searchString = String(searchValue)
        functionalReplace = typeof replaceValue === 'function'
        if (!functionalReplace) replaceValue = String(replaceValue)
        searchLength = searchString.length
        advanceBy = max(1, searchLength)
        position = stringIndexOf(string, searchString, 0)
        while (position !== -1) {
          if (functionalReplace) {
            replacement = String(replaceValue(searchString, position, string))
          } else {
            replacement = getSubstitution(searchString, string, position, [], undefined, replaceValue)
          }
          result += string.slice(endOfLastMatch, position) + replacement
          endOfLastMatch = position + searchLength
          position = stringIndexOf(string, searchString, position + advanceBy)
        }
        if (endOfLastMatch < string.length) {
          result += string.slice(endOfLastMatch)
        }
        return result
      }
    })
  }, { '../internals/export': 55, '../internals/get-substitution': 65, '../internals/is-pure': 83, '../internals/is-regexp': 84, '../internals/regexp-flags': 127, '../internals/require-object-coercible': 131, '../internals/well-known-symbol': 167 }],
  323: [function (require, module, exports) {
    'use strict'
    const fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic')
    const fails = require('../internals/fails')
    const anObject = require('../internals/an-object')
    const toLength = require('../internals/to-length')
    const toInteger = require('../internals/to-integer')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const advanceStringIndex = require('../internals/advance-string-index')
    const getSubstitution = require('../internals/get-substitution')
    const regExpExec = require('../internals/regexp-exec-abstract')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const REPLACE = wellKnownSymbol('replace')
    const max = Math.max
    const min = Math.min

    const maybeToString = function (it) {
      return it === undefined ? it : String(it)
    }

    // IE <= 11 replaces $0 with the whole match, as if it was $&
    // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
    const REPLACE_KEEPS_$0 = (function () {
      // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
      return 'a'.replace(/./, '$0') === '$0'
    })()

    // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
    const REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
      if (/./[REPLACE]) {
        return /./[REPLACE]('a', '$0') === ''
      }
      return false
    })()

    const REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
      const re = /./
      re.exec = function () {
        const result = []
        result.groups = { a: '7' }
        return result
      }
      return ''.replace(re, '$<a>') !== '7'
    })

    // @@replace logic
    fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
      const UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0'

      return [
        // `String.prototype.replace` method
        // https://tc39.es/ecma262/#sec-string.prototype.replace
        function replace (searchValue, replaceValue) {
          const O = requireObjectCoercible(this)
          const replacer = searchValue == undefined ? undefined : searchValue[REPLACE]
          return replacer !== undefined
            ? replacer.call(searchValue, O, replaceValue)
            : nativeReplace.call(String(O), searchValue, replaceValue)
        },
        // `RegExp.prototype[@@replace]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
        function (string, replaceValue) {
          if (
            typeof replaceValue === 'string' &&
        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
        replaceValue.indexOf('$<') === -1
          ) {
            const res = maybeCallNative(nativeReplace, this, string, replaceValue)
            if (res.done) return res.value
          }

          const rx = anObject(this)
          const S = String(string)

          const functionalReplace = typeof replaceValue === 'function'
          if (!functionalReplace) replaceValue = String(replaceValue)

          const global = rx.global
          if (global) {
            var fullUnicode = rx.unicode
            rx.lastIndex = 0
          }
          const results = []
          while (true) {
            var result = regExpExec(rx, S)
            if (result === null) break

            results.push(result)
            if (!global) break

            const matchStr = String(result[0])
            if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode)
          }

          let accumulatedResult = ''
          let nextSourcePosition = 0
          for (let i = 0; i < results.length; i++) {
            result = results[i]

            const matched = String(result[0])
            const position = max(min(toInteger(result.index), S.length), 0)
            const captures = []
            // NOTE: This is equivalent to
            //   captures = result.slice(1).map(maybeToString)
            // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
            // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
            // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
            for (let j = 1; j < result.length; j++) captures.push(maybeToString(result[j]))
            const namedCaptures = result.groups
            if (functionalReplace) {
              const replacerArgs = [matched].concat(captures, position, S)
              if (namedCaptures !== undefined) replacerArgs.push(namedCaptures)
              var replacement = String(replaceValue.apply(undefined, replacerArgs))
            } else {
              replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue)
            }
            if (position >= nextSourcePosition) {
              accumulatedResult += S.slice(nextSourcePosition, position) + replacement
              nextSourcePosition = position + matched.length
            }
          }
          return accumulatedResult + S.slice(nextSourcePosition)
        }
      ]
    }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE)
  }, { '../internals/advance-string-index': 4, '../internals/an-object': 6, '../internals/fails': 56, '../internals/fix-regexp-well-known-symbol-logic': 57, '../internals/get-substitution': 65, '../internals/regexp-exec-abstract': 125, '../internals/require-object-coercible': 131, '../internals/to-integer': 153, '../internals/to-length': 154, '../internals/well-known-symbol': 167 }],
  324: [function (require, module, exports) {
    'use strict'
    const fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic')
    const anObject = require('../internals/an-object')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const sameValue = require('../internals/same-value')
    const regExpExec = require('../internals/regexp-exec-abstract')

    // @@search logic
    fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
      return [
        // `String.prototype.search` method
        // https://tc39.es/ecma262/#sec-string.prototype.search
        function search (regexp) {
          const O = requireObjectCoercible(this)
          const searcher = regexp == undefined ? undefined : regexp[SEARCH]
          return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O))
        },
        // `RegExp.prototype[@@search]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
        function (string) {
          const res = maybeCallNative(nativeSearch, this, string)
          if (res.done) return res.value

          const rx = anObject(this)
          const S = String(string)

          const previousLastIndex = rx.lastIndex
          if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0
          const result = regExpExec(rx, S)
          if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex
          return result === null ? -1 : result.index
        }
      ]
    })
  }, { '../internals/an-object': 6, '../internals/fix-regexp-well-known-symbol-logic': 57, '../internals/regexp-exec-abstract': 125, '../internals/require-object-coercible': 131, '../internals/same-value': 132 }],
  325: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.small` method
    // https://tc39.es/ecma262/#sec-string.prototype.small
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('small') }, {
      small: function small () {
        return createHTML(this, 'small', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  326: [function (require, module, exports) {
    'use strict'
    const fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic')
    const isRegExp = require('../internals/is-regexp')
    const anObject = require('../internals/an-object')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const speciesConstructor = require('../internals/species-constructor')
    const advanceStringIndex = require('../internals/advance-string-index')
    const toLength = require('../internals/to-length')
    const callRegExpExec = require('../internals/regexp-exec-abstract')
    const regexpExec = require('../internals/regexp-exec')
    const stickyHelpers = require('../internals/regexp-sticky-helpers')
    const fails = require('../internals/fails')

    const UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y
    const arrayPush = [].push
    const min = Math.min
    const MAX_UINT32 = 0xFFFFFFFF

    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    // Weex JS has frozen built-in prototypes, so use try / catch wrapper
    const SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
      // eslint-disable-next-line regexp/no-empty-group -- required for testing
      const re = /(?:)/
      const originalExec = re.exec
      re.exec = function () { return originalExec.apply(this, arguments) }
      const result = 'ab'.split(re)
      return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b'
    })

    // @@split logic
    fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
      let internalSplit
      if (
        'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
      ) {
        // based on es5-shim implementation, need to rework it
        internalSplit = function (separator, limit) {
          const string = String(requireObjectCoercible(this))
          const lim = limit === undefined ? MAX_UINT32 : limit >>> 0
          if (lim === 0) return []
          if (separator === undefined) return [string]
          // If `separator` is not a regex, use native split
          if (!isRegExp(separator)) {
            return nativeSplit.call(string, separator, lim)
          }
          const output = []
          const flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '')
          let lastLastIndex = 0
          // Make `global` and avoid `lastIndex` issues by working with a copy
          const separatorCopy = new RegExp(separator.source, flags + 'g')
          let match, lastIndex, lastLength
          while (match = regexpExec.call(separatorCopy, string)) {
            lastIndex = separatorCopy.lastIndex
            if (lastIndex > lastLastIndex) {
              output.push(string.slice(lastLastIndex, match.index))
              if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1))
              lastLength = match[0].length
              lastLastIndex = lastIndex
              if (output.length >= lim) break
            }
            if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++ // Avoid an infinite loop
          }
          if (lastLastIndex === string.length) {
            if (lastLength || !separatorCopy.test('')) output.push('')
          } else output.push(string.slice(lastLastIndex))
          return output.length > lim ? output.slice(0, lim) : output
        }
      // Chakra, V8
      } else if ('0'.split(undefined, 0).length) {
        internalSplit = function (separator, limit) {
          return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit)
        }
      } else internalSplit = nativeSplit

      return [
        // `String.prototype.split` method
        // https://tc39.es/ecma262/#sec-string.prototype.split
        function split (separator, limit) {
          const O = requireObjectCoercible(this)
          const splitter = separator == undefined ? undefined : separator[SPLIT]
          return splitter !== undefined
            ? splitter.call(separator, O, limit)
            : internalSplit.call(String(O), separator, limit)
        },
        // `RegExp.prototype[@@split]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
        //
        // NOTE: This cannot be properly polyfilled in engines that don't support
        // the 'y' flag.
        function (string, limit) {
          const res = maybeCallNative(internalSplit, this, string, limit, internalSplit !== nativeSplit)
          if (res.done) return res.value

          const rx = anObject(this)
          const S = String(string)
          const C = speciesConstructor(rx, RegExp)

          const unicodeMatching = rx.unicode
          const flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y')

          // ^(? + rx + ) is needed, in combination with some S slicing, to
          // simulate the 'y' flag.
          const splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags)
          const lim = limit === undefined ? MAX_UINT32 : limit >>> 0
          if (lim === 0) return []
          if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : []
          let p = 0
          let q = 0
          const A = []
          while (q < S.length) {
            splitter.lastIndex = UNSUPPORTED_Y ? 0 : q
            const z = callRegExpExec(splitter, UNSUPPORTED_Y ? S.slice(q) : S)
            var e
            if (
              z === null ||
          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
            ) {
              q = advanceStringIndex(S, q, unicodeMatching)
            } else {
              A.push(S.slice(p, q))
              if (A.length === lim) return A
              for (let i = 1; i <= z.length - 1; i++) {
                A.push(z[i])
                if (A.length === lim) return A
              }
              q = p = e
            }
          }
          A.push(S.slice(p))
          return A
        }
      ]
    }, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y)
  }, { '../internals/advance-string-index': 4, '../internals/an-object': 6, '../internals/fails': 56, '../internals/fix-regexp-well-known-symbol-logic': 57, '../internals/is-regexp': 84, '../internals/regexp-exec': 126, '../internals/regexp-exec-abstract': 125, '../internals/regexp-sticky-helpers': 128, '../internals/require-object-coercible': 131, '../internals/species-constructor': 139, '../internals/to-length': 154 }],
  327: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const toLength = require('../internals/to-length')
    const notARegExp = require('../internals/not-a-regexp')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const correctIsRegExpLogic = require('../internals/correct-is-regexp-logic')
    const IS_PURE = require('../internals/is-pure')

    // eslint-disable-next-line es/no-string-prototype-startswith -- safe
    const $startsWith = ''.startsWith
    const min = Math.min

    const CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith')
    // https://github.com/zloirock/core-js/pull/702
    const MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!(function () {
      const descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith')
      return descriptor && !descriptor.writable
    }())

    // `String.prototype.startsWith` method
    // https://tc39.es/ecma262/#sec-string.prototype.startswith
    $({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
      startsWith: function startsWith (searchString /* , position = 0 */) {
        const that = String(requireObjectCoercible(this))
        notARegExp(searchString)
        const index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length))
        const search = String(searchString)
        return $startsWith
          ? $startsWith.call(that, search, index)
          : that.slice(index, index + search.length) === search
      }
    })
  }, { '../internals/correct-is-regexp-logic': 31, '../internals/export': 55, '../internals/is-pure': 83, '../internals/not-a-regexp': 99, '../internals/object-get-own-property-descriptor': 107, '../internals/require-object-coercible': 131, '../internals/to-length': 154 }],
  328: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.strike` method
    // https://tc39.es/ecma262/#sec-string.prototype.strike
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('strike') }, {
      strike: function strike () {
        return createHTML(this, 'strike', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  329: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.sub` method
    // https://tc39.es/ecma262/#sec-string.prototype.sub
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sub') }, {
      sub: function sub () {
        return createHTML(this, 'sub', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  330: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const requireObjectCoercible = require('../internals/require-object-coercible')
    const toInteger = require('../internals/to-integer')

    const slice = ''.slice
    const max = Math.max
    const min = Math.min

    // `String.prototype.substr` method
    // https://tc39.es/ecma262/#sec-string.prototype.substr
    $({ target: 'String', proto: true }, {
      substr: function substr (start, length) {
        const that = String(requireObjectCoercible(this))
        const size = that.length
        let intStart = toInteger(start)
        let intLength, intEnd
        if (intStart === Infinity) intStart = 0
        if (intStart < 0) intStart = max(size + intStart, 0)
        intLength = length === undefined ? size : toInteger(length)
        if (intLength <= 0 || intLength === Infinity) return ''
        intEnd = min(intStart + intLength, size)
        return intStart >= intEnd ? '' : slice.call(that, intStart, intEnd)
      }
    })
  }, { '../internals/export': 55, '../internals/require-object-coercible': 131, '../internals/to-integer': 153 }],
  331: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const createHTML = require('../internals/create-html')
    const forcedStringHTMLMethod = require('../internals/string-html-forced')

    // `String.prototype.sup` method
    // https://tc39.es/ecma262/#sec-string.prototype.sup
    $({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sup') }, {
      sup: function sup () {
        return createHTML(this, 'sup', '', '')
      }
    })
  }, { '../internals/create-html': 33, '../internals/export': 55, '../internals/string-html-forced': 140 }],
  332: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $trimEnd = require('../internals/string-trim').end
    const forcedStringTrimMethod = require('../internals/string-trim-forced')

    const FORCED = forcedStringTrimMethod('trimEnd')

    const trimEnd = FORCED ? function trimEnd () {
      return $trimEnd(this)
      // eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
    } : ''.trimEnd

    // `String.prototype.{ trimEnd, trimRight }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    // https://tc39.es/ecma262/#String.prototype.trimright
    $({ target: 'String', proto: true, forced: FORCED }, {
      trimEnd: trimEnd,
      trimRight: trimEnd
    })
  }, { '../internals/export': 55, '../internals/string-trim': 147, '../internals/string-trim-forced': 146 }],
  333: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $trimStart = require('../internals/string-trim').start
    const forcedStringTrimMethod = require('../internals/string-trim-forced')

    const FORCED = forcedStringTrimMethod('trimStart')

    const trimStart = FORCED ? function trimStart () {
      return $trimStart(this)
      // eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
    } : ''.trimStart

    // `String.prototype.{ trimStart, trimLeft }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    // https://tc39.es/ecma262/#String.prototype.trimleft
    $({ target: 'String', proto: true, forced: FORCED }, {
      trimStart: trimStart,
      trimLeft: trimStart
    })
  }, { '../internals/export': 55, '../internals/string-trim': 147, '../internals/string-trim-forced': 146 }],
  334: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $trim = require('../internals/string-trim').trim
    const forcedStringTrimMethod = require('../internals/string-trim-forced')

    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    $({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
      trim: function trim () {
        return $trim(this)
      }
    })
  }, { '../internals/export': 55, '../internals/string-trim': 147, '../internals/string-trim-forced': 146 }],
  335: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.asyncIterator` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.asynciterator
    defineWellKnownSymbol('asyncIterator')
  }, { '../internals/define-well-known-symbol': 41 }],
  336: [function (require, module, exports) {
    // `Symbol.prototype.description` getter
    // https://tc39.es/ecma262/#sec-symbol.prototype.description
    'use strict'
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const global = require('../internals/global')
    const has = require('../internals/has')
    const isObject = require('../internals/is-object')
    const defineProperty = require('../internals/object-define-property').f
    const copyConstructorProperties = require('../internals/copy-constructor-properties')

    const NativeSymbol = global.Symbol

    if (DESCRIPTORS && typeof NativeSymbol === 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
    )) {
      const EmptyStringDescriptionStore = {}
      // wrap Symbol constructor for correct work with undefined description
      var SymbolWrapper = function Symbol () {
        const description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0])
        const result = this instanceof SymbolWrapper
          ? new NativeSymbol(description)
        // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
          : description === undefined ? NativeSymbol() : NativeSymbol(description)
        if (description === '') EmptyStringDescriptionStore[result] = true
        return result
      }
      copyConstructorProperties(SymbolWrapper, NativeSymbol)
      const symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype
      symbolPrototype.constructor = SymbolWrapper

      const symbolToString = symbolPrototype.toString
      const native = String(NativeSymbol('test')) == 'Symbol(test)'
      const regexp = /^Symbol\((.*)\)[^)]+$/
      defineProperty(symbolPrototype, 'description', {
        configurable: true,
        get: function description () {
          const symbol = isObject(this) ? this.valueOf() : this
          const string = symbolToString.call(symbol)
          if (has(EmptyStringDescriptionStore, symbol)) return ''
          const desc = native ? string.slice(7, -1) : string.replace(regexp, '$1')
          return desc === '' ? undefined : desc
        }
      })

      $({ global: true, forced: true }, {
        Symbol: SymbolWrapper
      })
    }
  }, { '../internals/copy-constructor-properties': 30, '../internals/descriptors': 42, '../internals/export': 55, '../internals/global': 66, '../internals/has': 67, '../internals/is-object': 82, '../internals/object-define-property': 106 }],
  337: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.hasInstance` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.hasinstance
    defineWellKnownSymbol('hasInstance')
  }, { '../internals/define-well-known-symbol': 41 }],
  338: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.isConcatSpreadable` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
    defineWellKnownSymbol('isConcatSpreadable')
  }, { '../internals/define-well-known-symbol': 41 }],
  339: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.iterator` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.iterator
    defineWellKnownSymbol('iterator')
  }, { '../internals/define-well-known-symbol': 41 }],
  340: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const getBuiltIn = require('../internals/get-built-in')
    const IS_PURE = require('../internals/is-pure')
    const DESCRIPTORS = require('../internals/descriptors')
    const NATIVE_SYMBOL = require('../internals/native-symbol')
    const USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid')
    const fails = require('../internals/fails')
    const has = require('../internals/has')
    const isArray = require('../internals/is-array')
    const isObject = require('../internals/is-object')
    const anObject = require('../internals/an-object')
    const toObject = require('../internals/to-object')
    const toIndexedObject = require('../internals/to-indexed-object')
    const toPrimitive = require('../internals/to-primitive')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const nativeObjectCreate = require('../internals/object-create')
    const objectKeys = require('../internals/object-keys')
    const getOwnPropertyNamesModule = require('../internals/object-get-own-property-names')
    const getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external')
    const getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const definePropertyModule = require('../internals/object-define-property')
    const propertyIsEnumerableModule = require('../internals/object-property-is-enumerable')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const redefine = require('../internals/redefine')
    const shared = require('../internals/shared')
    const sharedKey = require('../internals/shared-key')
    const hiddenKeys = require('../internals/hidden-keys')
    const uid = require('../internals/uid')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped')
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')
    const setToStringTag = require('../internals/set-to-string-tag')
    const InternalStateModule = require('../internals/internal-state')
    const $forEach = require('../internals/array-iteration').forEach

    const HIDDEN = sharedKey('hidden')
    const SYMBOL = 'Symbol'
    const PROTOTYPE = 'prototype'
    const TO_PRIMITIVE = wellKnownSymbol('toPrimitive')
    const setInternalState = InternalStateModule.set
    const getInternalState = InternalStateModule.getterFor(SYMBOL)
    const ObjectPrototype = Object[PROTOTYPE]
    let $Symbol = global.Symbol
    const $stringify = getBuiltIn('JSON', 'stringify')
    const nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f
    const nativeDefineProperty = definePropertyModule.f
    const nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f
    const nativePropertyIsEnumerable = propertyIsEnumerableModule.f
    const AllSymbols = shared('symbols')
    const ObjectPrototypeSymbols = shared('op-symbols')
    const StringToSymbolRegistry = shared('string-to-symbol-registry')
    const SymbolToStringRegistry = shared('symbol-to-string-registry')
    const WellKnownSymbolsStore = shared('wks')
    const QObject = global.QObject
    // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
    let USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild

    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
    const setSymbolDescriptor = DESCRIPTORS && fails(function () {
      return nativeObjectCreate(nativeDefineProperty({}, 'a', {
        get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a }
      })).a != 7
    })
      ? function (O, P, Attributes) {
        const ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P)
        if (ObjectPrototypeDescriptor) delete ObjectPrototype[P]
        nativeDefineProperty(O, P, Attributes)
        if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
          nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor)
        }
      }
      : nativeDefineProperty

    const wrap = function (tag, description) {
      const symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE])
      setInternalState(symbol, {
        type: SYMBOL,
        tag: tag,
        description: description
      })
      if (!DESCRIPTORS) symbol.description = description
      return symbol
    }

    const isSymbol = USE_SYMBOL_AS_UID
      ? function (it) {
        return typeof it === 'symbol'
      }
      : function (it) {
        return Object(it) instanceof $Symbol
      }

    var $defineProperty = function defineProperty (O, P, Attributes) {
      if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes)
      anObject(O)
      const key = toPrimitive(P, true)
      anObject(Attributes)
      if (has(AllSymbols, key)) {
        if (!Attributes.enumerable) {
          if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}))
          O[HIDDEN][key] = true
        } else {
          if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false
          Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) })
        } return setSymbolDescriptor(O, key, Attributes)
      } return nativeDefineProperty(O, key, Attributes)
    }

    const $defineProperties = function defineProperties (O, Properties) {
      anObject(O)
      const properties = toIndexedObject(Properties)
      const keys = objectKeys(properties).concat($getOwnPropertySymbols(properties))
      $forEach(keys, function (key) {
        if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key])
      })
      return O
    }

    const $create = function create (O, Properties) {
      return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties)
    }

    var $propertyIsEnumerable = function propertyIsEnumerable (V) {
      const P = toPrimitive(V, true)
      const enumerable = nativePropertyIsEnumerable.call(this, P)
      if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false
      return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true
    }

    const $getOwnPropertyDescriptor = function getOwnPropertyDescriptor (O, P) {
      const it = toIndexedObject(O)
      const key = toPrimitive(P, true)
      if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return
      const descriptor = nativeGetOwnPropertyDescriptor(it, key)
      if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
        descriptor.enumerable = true
      }
      return descriptor
    }

    const $getOwnPropertyNames = function getOwnPropertyNames (O) {
      const names = nativeGetOwnPropertyNames(toIndexedObject(O))
      const result = []
      $forEach(names, function (key) {
        if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key)
      })
      return result
    }

    var $getOwnPropertySymbols = function getOwnPropertySymbols (O) {
      const IS_OBJECT_PROTOTYPE = O === ObjectPrototype
      const names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O))
      const result = []
      $forEach(names, function (key) {
        if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
          result.push(AllSymbols[key])
        }
      })
      return result
    }

    // `Symbol` constructor
    // https://tc39.es/ecma262/#sec-symbol-constructor
    if (!NATIVE_SYMBOL) {
      $Symbol = function Symbol () {
        if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor')
        const description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0])
        const tag = uid(description)
        var setter = function (value) {
          if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value)
          if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false
          setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value))
        }
        if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter })
        return wrap(tag, description)
      }

      redefine($Symbol[PROTOTYPE], 'toString', function toString () {
        return getInternalState(this).tag
      })

      redefine($Symbol, 'withoutSetter', function (description) {
        return wrap(uid(description), description)
      })

      propertyIsEnumerableModule.f = $propertyIsEnumerable
      definePropertyModule.f = $defineProperty
      getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor
      getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames
      getOwnPropertySymbolsModule.f = $getOwnPropertySymbols

      wrappedWellKnownSymbolModule.f = function (name) {
        return wrap(wellKnownSymbol(name), name)
      }

      if (DESCRIPTORS) {
        // https://github.com/tc39/proposal-Symbol-description
        nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
          configurable: true,
          get: function description () {
            return getInternalState(this).description
          }
        })
        if (!IS_PURE) {
          redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true })
        }
      }
    }

    $({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
      Symbol: $Symbol
    })

    $forEach(objectKeys(WellKnownSymbolsStore), function (name) {
      defineWellKnownSymbol(name)
    })

    $({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
      // `Symbol.for` method
      // https://tc39.es/ecma262/#sec-symbol.for
      for: function (key) {
        const string = String(key)
        if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string]
        const symbol = $Symbol(string)
        StringToSymbolRegistry[string] = symbol
        SymbolToStringRegistry[symbol] = string
        return symbol
      },
      // `Symbol.keyFor` method
      // https://tc39.es/ecma262/#sec-symbol.keyfor
      keyFor: function keyFor (sym) {
        if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol')
        if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym]
      },
      useSetter: function () { USE_SETTER = true },
      useSimple: function () { USE_SETTER = false }
    })

    $({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
      // `Object.create` method
      // https://tc39.es/ecma262/#sec-object.create
      create: $create,
      // `Object.defineProperty` method
      // https://tc39.es/ecma262/#sec-object.defineproperty
      defineProperty: $defineProperty,
      // `Object.defineProperties` method
      // https://tc39.es/ecma262/#sec-object.defineproperties
      defineProperties: $defineProperties,
      // `Object.getOwnPropertyDescriptor` method
      // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor
    })

    $({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
      // `Object.getOwnPropertyNames` method
      // https://tc39.es/ecma262/#sec-object.getownpropertynames
      getOwnPropertyNames: $getOwnPropertyNames,
      // `Object.getOwnPropertySymbols` method
      // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
      getOwnPropertySymbols: $getOwnPropertySymbols
    })

    // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
    // https://bugs.chromium.org/p/v8/issues/detail?id=3443
    $({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1) }) }, {
      getOwnPropertySymbols: function getOwnPropertySymbols (it) {
        return getOwnPropertySymbolsModule.f(toObject(it))
      }
    })

    // `JSON.stringify` method behavior with symbols
    // https://tc39.es/ecma262/#sec-json.stringify
    if ($stringify) {
      const FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
        const symbol = $Symbol()
        // MS Edge converts symbol values to JSON as {}
        return $stringify([symbol]) != '[null]' ||
      // WebKit converts symbol values to JSON as null
      $stringify({ a: symbol }) != '{}' ||
      // V8 throws on boxed symbols
      $stringify(Object(symbol)) != '{}'
      })

      $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        stringify: function stringify (it, replacer, space) {
          const args = [it]
          let index = 1
          let $replacer
          while (arguments.length > index) args.push(arguments[index++])
          $replacer = replacer
          if (!isObject(replacer) && it === undefined || isSymbol(it)) return // IE8 returns string on undefined
          if (!isArray(replacer)) {
            replacer = function (key, value) {
              if (typeof $replacer === 'function') value = $replacer.call(this, key, value)
              if (!isSymbol(value)) return value
            }
          }
          args[1] = replacer
          return $stringify.apply(null, args)
        }
      })
    }

    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
      createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf)
    }
    // `Symbol.prototype[@@toStringTag]` property
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
    setToStringTag($Symbol, SYMBOL)

    hiddenKeys[HIDDEN] = true
  }, { '../internals/an-object': 6, '../internals/array-iteration': 15, '../internals/create-non-enumerable-property': 35, '../internals/create-property-descriptor': 36, '../internals/define-well-known-symbol': 41, '../internals/descriptors': 42, '../internals/export': 55, '../internals/fails': 56, '../internals/get-built-in': 62, '../internals/global': 66, '../internals/has': 67, '../internals/hidden-keys': 68, '../internals/internal-state': 77, '../internals/is-array': 79, '../internals/is-object': 82, '../internals/is-pure': 83, '../internals/native-symbol': 95, '../internals/object-create': 104, '../internals/object-define-property': 106, '../internals/object-get-own-property-descriptor': 107, '../internals/object-get-own-property-names': 109, '../internals/object-get-own-property-names-external': 108, '../internals/object-get-own-property-symbols': 110, '../internals/object-keys': 113, '../internals/object-property-is-enumerable': 114, '../internals/redefine': 124, '../internals/set-to-string-tag': 135, '../internals/shared': 138, '../internals/shared-key': 136, '../internals/to-indexed-object': 152, '../internals/to-object': 155, '../internals/to-primitive': 158, '../internals/uid': 164, '../internals/use-symbol-as-uid': 165, '../internals/well-known-symbol': 167, '../internals/well-known-symbol-wrapped': 166 }],
  341: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.matchAll` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.matchall
    defineWellKnownSymbol('matchAll')
  }, { '../internals/define-well-known-symbol': 41 }],
  342: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.match` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.match
    defineWellKnownSymbol('match')
  }, { '../internals/define-well-known-symbol': 41 }],
  343: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.replace` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.replace
    defineWellKnownSymbol('replace')
  }, { '../internals/define-well-known-symbol': 41 }],
  344: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.search` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.search
    defineWellKnownSymbol('search')
  }, { '../internals/define-well-known-symbol': 41 }],
  345: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.species` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.species
    defineWellKnownSymbol('species')
  }, { '../internals/define-well-known-symbol': 41 }],
  346: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.split` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.split
    defineWellKnownSymbol('split')
  }, { '../internals/define-well-known-symbol': 41 }],
  347: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.toPrimitive` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.toprimitive
    defineWellKnownSymbol('toPrimitive')
  }, { '../internals/define-well-known-symbol': 41 }],
  348: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.toStringTag` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.tostringtag
    defineWellKnownSymbol('toStringTag')
  }, { '../internals/define-well-known-symbol': 41 }],
  349: [function (require, module, exports) {
    const defineWellKnownSymbol = require('../internals/define-well-known-symbol')

    // `Symbol.unscopables` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.unscopables
    defineWellKnownSymbol('unscopables')
  }, { '../internals/define-well-known-symbol': 41 }],
  350: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $copyWithin = require('../internals/array-copy-within')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.copyWithin` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
    exportTypedArrayMethod('copyWithin', function copyWithin (target, start /* , end */) {
      return $copyWithin.call(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-copy-within': 10 }],
  351: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $every = require('../internals/array-iteration').every

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.every` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
    exportTypedArrayMethod('every', function every (callbackfn /* , thisArg */) {
      return $every(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15 }],
  352: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $fill = require('../internals/array-fill')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.fill` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    exportTypedArrayMethod('fill', function fill (value /* , start, end */) {
      return $fill.apply(aTypedArray(this), arguments)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-fill': 11 }],
  353: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $filter = require('../internals/array-iteration').filter
    const fromSpeciesAndList = require('../internals/typed-array-from-species-and-list')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.filter` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
    exportTypedArrayMethod('filter', function filter (callbackfn /* , thisArg */) {
      const list = $filter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      return fromSpeciesAndList(this, list)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15, '../internals/typed-array-from-species-and-list': 162 }],
  354: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $findIndex = require('../internals/array-iteration').findIndex

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
    exportTypedArrayMethod('findIndex', function findIndex (predicate /* , thisArg */) {
      return $findIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15 }],
  355: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $find = require('../internals/array-iteration').find

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.find` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
    exportTypedArrayMethod('find', function find (predicate /* , thisArg */) {
      return $find(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15 }],
  356: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Float32Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Float32', function (init) {
      return function Float32Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  357: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Float64Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Float64', function (init) {
      return function Float64Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  358: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $forEach = require('../internals/array-iteration').forEach

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
    exportTypedArrayMethod('forEach', function forEach (callbackfn /* , thisArg */) {
      $forEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15 }],
  359: [function (require, module, exports) {
    'use strict'
    const TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers')
    const exportTypedArrayStaticMethod = require('../internals/array-buffer-view-core').exportTypedArrayStaticMethod
    const typedArrayFrom = require('../internals/typed-array-from')

    // `%TypedArray%.from` method
    // https://tc39.es/ecma262/#sec-%typedarray%.from
    exportTypedArrayStaticMethod('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS)
  }, { '../internals/array-buffer-view-core': 8, '../internals/typed-array-constructors-require-wrappers': 161, '../internals/typed-array-from': 163 }],
  360: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $includes = require('../internals/array-includes').includes

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.includes` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
    exportTypedArrayMethod('includes', function includes (searchElement /* , fromIndex */) {
      return $includes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-includes': 14 }],
  361: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $indexOf = require('../internals/array-includes').indexOf

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
    exportTypedArrayMethod('indexOf', function indexOf (searchElement /* , fromIndex */) {
      return $indexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-includes': 14 }],
  362: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Int16Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Int16', function (init) {
      return function Int16Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  363: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Int32Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Int32', function (init) {
      return function Int32Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  364: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Int8Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Int8', function (init) {
      return function Int8Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  365: [function (require, module, exports) {
    'use strict'
    const global = require('../internals/global')
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const ArrayIterators = require('../modules/es.array.iterator')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')
    const Uint8Array = global.Uint8Array
    const arrayValues = ArrayIterators.values
    const arrayKeys = ArrayIterators.keys
    const arrayEntries = ArrayIterators.entries
    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod
    const nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR]

    const CORRECT_ITER_NAME = !!nativeTypedArrayIterator &&
  (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined)

    const typedArrayValues = function values () {
      return arrayValues.call(aTypedArray(this))
    }

    // `%TypedArray%.prototype.entries` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
    exportTypedArrayMethod('entries', function entries () {
      return arrayEntries.call(aTypedArray(this))
    })
    // `%TypedArray%.prototype.keys` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
    exportTypedArrayMethod('keys', function keys () {
      return arrayKeys.call(aTypedArray(this))
    })
    // `%TypedArray%.prototype.values` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
    exportTypedArrayMethod('values', typedArrayValues, !CORRECT_ITER_NAME)
    // `%TypedArray%.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
    exportTypedArrayMethod(ITERATOR, typedArrayValues, !CORRECT_ITER_NAME)
  }, { '../internals/array-buffer-view-core': 8, '../internals/global': 66, '../internals/well-known-symbol': 167, '../modules/es.array.iterator': 187 }],
  366: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod
    const $join = [].join

    // `%TypedArray%.prototype.join` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    exportTypedArrayMethod('join', function join (separator) {
      return $join.apply(aTypedArray(this), arguments)
    })
  }, { '../internals/array-buffer-view-core': 8 }],
  367: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $lastIndexOf = require('../internals/array-last-index-of')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.lastIndexOf` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    exportTypedArrayMethod('lastIndexOf', function lastIndexOf (searchElement /* , fromIndex */) {
      return $lastIndexOf.apply(aTypedArray(this), arguments)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-last-index-of': 16 }],
  368: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $map = require('../internals/array-iteration').map
    const speciesConstructor = require('../internals/species-constructor')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.map` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
    exportTypedArrayMethod('map', function map (mapfn /* , thisArg */) {
      return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
        return new (aTypedArrayConstructor(speciesConstructor(O, O.constructor)))(length)
      })
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15, '../internals/species-constructor': 139 }],
  369: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers')

    const aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor
    const exportTypedArrayStaticMethod = ArrayBufferViewCore.exportTypedArrayStaticMethod

    // `%TypedArray%.of` method
    // https://tc39.es/ecma262/#sec-%typedarray%.of
    exportTypedArrayStaticMethod('of', function of (/* ...items */) {
      let index = 0
      const length = arguments.length
      const result = new (aTypedArrayConstructor(this))(length)
      while (length > index) result[index] = arguments[index++]
      return result
    }, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS)
  }, { '../internals/array-buffer-view-core': 8, '../internals/typed-array-constructors-require-wrappers': 161 }],
  370: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $reduceRight = require('../internals/array-reduce').right

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.reduceRicht` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
    exportTypedArrayMethod('reduceRight', function reduceRight (callbackfn /* , initialValue */) {
      return $reduceRight(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-reduce': 19 }],
  371: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $reduce = require('../internals/array-reduce').left

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
    exportTypedArrayMethod('reduce', function reduce (callbackfn /* , initialValue */) {
      return $reduce(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-reduce': 19 }],
  372: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod
    const floor = Math.floor

    // `%TypedArray%.prototype.reverse` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
    exportTypedArrayMethod('reverse', function reverse () {
      const that = this
      let length = aTypedArray(that).length
      const middle = floor(length / 2)
      let index = 0
      let value
      while (index < middle) {
        value = that[index]
        that[index++] = that[--length]
        that[length] = value
      } return that
    })
  }, { '../internals/array-buffer-view-core': 8 }],
  373: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const toLength = require('../internals/to-length')
    const toOffset = require('../internals/to-offset')
    const toObject = require('../internals/to-object')
    const fails = require('../internals/fails')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    const FORCED = fails(function () {
      // eslint-disable-next-line es/no-typed-arrays -- required for testing
      new Int8Array(1).set({})
    })

    // `%TypedArray%.prototype.set` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
    exportTypedArrayMethod('set', function set (arrayLike /* , offset */) {
      aTypedArray(this)
      const offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1)
      const length = this.length
      const src = toObject(arrayLike)
      const len = toLength(src.length)
      let index = 0
      if (len + offset > length) throw RangeError('Wrong length')
      while (index < len) this[offset + index] = src[index++]
    }, FORCED)
  }, { '../internals/array-buffer-view-core': 8, '../internals/fails': 56, '../internals/to-length': 154, '../internals/to-object': 155, '../internals/to-offset': 156 }],
  374: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const speciesConstructor = require('../internals/species-constructor')
    const fails = require('../internals/fails')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod
    const $slice = [].slice

    const FORCED = fails(function () {
      // eslint-disable-next-line es/no-typed-arrays -- required for testing
      new Int8Array(1).slice()
    })

    // `%TypedArray%.prototype.slice` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
    exportTypedArrayMethod('slice', function slice (start, end) {
      const list = $slice.call(aTypedArray(this), start, end)
      const C = speciesConstructor(this, this.constructor)
      let index = 0
      const length = list.length
      const result = new (aTypedArrayConstructor(C))(length)
      while (length > index) result[index] = list[index++]
      return result
    }, FORCED)
  }, { '../internals/array-buffer-view-core': 8, '../internals/fails': 56, '../internals/species-constructor': 139 }],
  375: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const $some = require('../internals/array-iteration').some

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.some` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
    exportTypedArrayMethod('some', function some (callbackfn /* , thisArg */) {
      return $some(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/array-iteration': 15 }],
  376: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const global = require('../internals/global')
    const fails = require('../internals/fails')
    const aFunction = require('../internals/a-function')
    const toLength = require('../internals/to-length')
    const internalSort = require('../internals/array-sort')
    const FF = require('../internals/engine-ff-version')
    const IE_OR_EDGE = require('../internals/engine-is-ie-or-edge')
    const V8 = require('../internals/engine-v8-version')
    const WEBKIT = require('../internals/engine-webkit-version')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod
    const Uint16Array = global.Uint16Array
    const nativeSort = Uint16Array && Uint16Array.prototype.sort

    // WebKit
    const ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !fails(function () {
      const array = new Uint16Array(2)
      array.sort(null)
      array.sort({})
    })

    const STABLE_SORT = !!nativeSort && !fails(function () {
      // feature detection can be too slow, so check engines versions
      if (V8) return V8 < 74
      if (FF) return FF < 67
      if (IE_OR_EDGE) return true
      if (WEBKIT) return WEBKIT < 602

      const array = new Uint16Array(516)
      const expected = Array(516)
      let index, mod

      for (index = 0; index < 516; index++) {
        mod = index % 4
        array[index] = 515 - index
        expected[index] = index - 2 * mod + 3
      }

      array.sort(function (a, b) {
        return (a / 4 | 0) - (b / 4 | 0)
      })

      for (index = 0; index < 516; index++) {
        if (array[index] !== expected[index]) return true
      }
    })

    const getSortCompare = function (comparefn) {
      return function (x, y) {
        if (comparefn !== undefined) return +comparefn(x, y) || 0
        // eslint-disable-next-line no-self-compare -- NaN check
        if (y !== y) return -1
        // eslint-disable-next-line no-self-compare -- NaN check
        if (x !== x) return 1
        if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1
        return x > y
      }
    }

    // `%TypedArray%.prototype.sort` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
    exportTypedArrayMethod('sort', function sort (comparefn) {
      const array = this
      if (comparefn !== undefined) aFunction(comparefn)
      if (STABLE_SORT) return nativeSort.call(array, comparefn)

      aTypedArray(array)
      const arrayLength = toLength(array.length)
      let items = Array(arrayLength)
      let index

      for (index = 0; index < arrayLength; index++) {
        items[index] = array[index]
      }

      items = internalSort(array, getSortCompare(comparefn))

      for (index = 0; index < arrayLength; index++) {
        array[index] = items[index]
      }

      return array
    }, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS)
  }, { '../internals/a-function': 1, '../internals/array-buffer-view-core': 8, '../internals/array-sort': 20, '../internals/engine-ff-version': 45, '../internals/engine-is-ie-or-edge': 47, '../internals/engine-v8-version': 52, '../internals/engine-webkit-version': 53, '../internals/fails': 56, '../internals/global': 66, '../internals/to-length': 154 }],
  377: [function (require, module, exports) {
    'use strict'
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const toLength = require('../internals/to-length')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const speciesConstructor = require('../internals/species-constructor')

    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod

    // `%TypedArray%.prototype.subarray` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
    exportTypedArrayMethod('subarray', function subarray (begin, end) {
      const O = aTypedArray(this)
      const length = O.length
      const beginIndex = toAbsoluteIndex(begin, length)
      return new (speciesConstructor(O, O.constructor))(
        O.buffer,
        O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
      )
    })
  }, { '../internals/array-buffer-view-core': 8, '../internals/species-constructor': 139, '../internals/to-absolute-index': 150, '../internals/to-length': 154 }],
  378: [function (require, module, exports) {
    'use strict'
    const global = require('../internals/global')
    const ArrayBufferViewCore = require('../internals/array-buffer-view-core')
    const fails = require('../internals/fails')

    const Int8Array = global.Int8Array
    const aTypedArray = ArrayBufferViewCore.aTypedArray
    const exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod
    const $toLocaleString = [].toLocaleString
    const $slice = [].slice

    // iOS Safari 6.x fails here
    const TO_LOCALE_STRING_BUG = !!Int8Array && fails(function () {
      $toLocaleString.call(new Int8Array(1))
    })

    const FORCED = fails(function () {
      return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString()
    }) || !fails(function () {
      Int8Array.prototype.toLocaleString.call([1, 2])
    })

    // `%TypedArray%.prototype.toLocaleString` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
    exportTypedArrayMethod('toLocaleString', function toLocaleString () {
      return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments)
    }, FORCED)
  }, { '../internals/array-buffer-view-core': 8, '../internals/fails': 56, '../internals/global': 66 }],
  379: [function (require, module, exports) {
    'use strict'
    const exportTypedArrayMethod = require('../internals/array-buffer-view-core').exportTypedArrayMethod
    const fails = require('../internals/fails')
    const global = require('../internals/global')

    const Uint8Array = global.Uint8Array
    const Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {}
    let arrayToString = [].toString
    const arrayJoin = [].join

    if (fails(function () { arrayToString.call({}) })) {
      arrayToString = function toString () {
        return arrayJoin.call(this)
      }
    }

    const IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString

    // `%TypedArray%.prototype.toString` method
    // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
    exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD)
  }, { '../internals/array-buffer-view-core': 8, '../internals/fails': 56, '../internals/global': 66 }],
  380: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Uint16Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Uint16', function (init) {
      return function Uint16Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  381: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Uint32Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Uint32', function (init) {
      return function Uint32Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  382: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Uint8Array` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Uint8', function (init) {
      return function Uint8Array (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    })
  }, { '../internals/typed-array-constructor': 160 }],
  383: [function (require, module, exports) {
    const createTypedArrayConstructor = require('../internals/typed-array-constructor')

    // `Uint8ClampedArray` constructor
    // https://tc39.es/ecma262/#sec-typedarray-objects
    createTypedArrayConstructor('Uint8', function (init) {
      return function Uint8ClampedArray (data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    }, true)
  }, { '../internals/typed-array-constructor': 160 }],
  384: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')

    const fromCharCode = String.fromCharCode
    const hex2 = /^[\da-f]{2}$/i
    const hex4 = /^[\da-f]{4}$/i

    // `unescape` method
    // https://tc39.es/ecma262/#sec-unescape-string
    $({ global: true }, {
      unescape: function unescape (string) {
        const str = String(string)
        let result = ''
        const length = str.length
        let index = 0
        let chr, slice
        while (index < length) {
          chr = str.charAt(index++)
          if (chr === '%') {
            if (str.charAt(index) === 'u') {
              slice = str.slice(index + 1, index + 5)
              if (hex4.test(slice)) {
                result += fromCharCode(parseInt(slice, 16))
                index += 5
                continue
              }
            } else {
              slice = str.slice(index, index + 2)
              if (hex2.test(slice)) {
                result += fromCharCode(parseInt(slice, 16))
                index += 2
                continue
              }
            }
          }
          result += chr
        } return result
      }
    })
  }, { '../internals/export': 55 }],
  385: [function (require, module, exports) {
    'use strict'
    const global = require('../internals/global')
    const redefineAll = require('../internals/redefine-all')
    const InternalMetadataModule = require('../internals/internal-metadata')
    const collection = require('../internals/collection')
    const collectionWeak = require('../internals/collection-weak')
    const isObject = require('../internals/is-object')
    const enforceIternalState = require('../internals/internal-state').enforce
    const NATIVE_WEAK_MAP = require('../internals/native-weak-map')

    const IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global
    // eslint-disable-next-line es/no-object-isextensible -- safe
    const isExtensible = Object.isExtensible
    let InternalWeakMap

    const wrapper = function (init) {
      return function WeakMap () {
        return init(this, arguments.length ? arguments[0] : undefined)
      }
    }

    // `WeakMap` constructor
    // https://tc39.es/ecma262/#sec-weakmap-constructor
    const $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak)

    // IE11 WeakMap frozen keys fix
    // We can't use feature detection because it crash some old IE builds
    // https://github.com/zloirock/core-js/issues/485
    if (NATIVE_WEAK_MAP && IS_IE11) {
      InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true)
      InternalMetadataModule.REQUIRED = true
      const WeakMapPrototype = $WeakMap.prototype
      const nativeDelete = WeakMapPrototype.delete
      const nativeHas = WeakMapPrototype.has
      const nativeGet = WeakMapPrototype.get
      const nativeSet = WeakMapPrototype.set
      redefineAll(WeakMapPrototype, {
        delete: function (key) {
          if (isObject(key) && !isExtensible(key)) {
            const state = enforceIternalState(this)
            if (!state.frozen) state.frozen = new InternalWeakMap()
            return nativeDelete.call(this, key) || state.frozen.delete(key)
          } return nativeDelete.call(this, key)
        },
        has: function has (key) {
          if (isObject(key) && !isExtensible(key)) {
            const state = enforceIternalState(this)
            if (!state.frozen) state.frozen = new InternalWeakMap()
            return nativeHas.call(this, key) || state.frozen.has(key)
          } return nativeHas.call(this, key)
        },
        get: function get (key) {
          if (isObject(key) && !isExtensible(key)) {
            const state = enforceIternalState(this)
            if (!state.frozen) state.frozen = new InternalWeakMap()
            return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key)
          } return nativeGet.call(this, key)
        },
        set: function set (key, value) {
          if (isObject(key) && !isExtensible(key)) {
            const state = enforceIternalState(this)
            if (!state.frozen) state.frozen = new InternalWeakMap()
            nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value)
          } else nativeSet.call(this, key, value)
          return this
        }
      })
    }
  }, { '../internals/collection': 29, '../internals/collection-weak': 28, '../internals/global': 66, '../internals/internal-metadata': 76, '../internals/internal-state': 77, '../internals/is-object': 82, '../internals/native-weak-map': 97, '../internals/redefine-all': 123 }],
  386: [function (require, module, exports) {
    'use strict'
    const collection = require('../internals/collection')
    const collectionWeak = require('../internals/collection-weak')

    // `WeakSet` constructor
    // https://tc39.es/ecma262/#sec-weakset-constructor
    collection('WeakSet', function (init) {
      return function WeakSet () { return init(this, arguments.length ? arguments[0] : undefined) }
    }, collectionWeak)
  }, { '../internals/collection': 29, '../internals/collection-weak': 28 }],
  387: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const IS_PURE = require('../internals/is-pure')
    const collectionDeleteAll = require('../internals/collection-delete-all')

    // `WeakMap.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'WeakMap', proto: true, real: true, forced: IS_PURE }, {
      deleteAll: function deleteAll (/* ...elements */) {
        return collectionDeleteAll.apply(this, arguments)
      }
    })
  }, { '../internals/collection-delete-all': 26, '../internals/export': 55, '../internals/is-pure': 83 }],
  388: [function (require, module, exports) {
    const global = require('../internals/global')
    const DOMIterables = require('../internals/dom-iterables')
    const forEach = require('../internals/array-for-each')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')

    for (const COLLECTION_NAME in DOMIterables) {
      const Collection = global[COLLECTION_NAME]
      const CollectionPrototype = Collection && Collection.prototype
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype && CollectionPrototype.forEach !== forEach) {
        try {
          createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach)
        } catch (error) {
          CollectionPrototype.forEach = forEach
        }
      }
    }
  }, { '../internals/array-for-each': 12, '../internals/create-non-enumerable-property': 35, '../internals/dom-iterables': 44, '../internals/global': 66 }],
  389: [function (require, module, exports) {
    const global = require('../internals/global')
    const DOMIterables = require('../internals/dom-iterables')
    const ArrayIteratorMethods = require('../modules/es.array.iterator')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')
    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const ArrayValues = ArrayIteratorMethods.values

    for (const COLLECTION_NAME in DOMIterables) {
      const Collection = global[COLLECTION_NAME]
      const CollectionPrototype = Collection && Collection.prototype
      if (CollectionPrototype) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[ITERATOR] !== ArrayValues) {
          try {
            createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues)
          } catch (error) {
            CollectionPrototype[ITERATOR] = ArrayValues
          }
        }
        if (!CollectionPrototype[TO_STRING_TAG]) {
          createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME)
        }
        if (DOMIterables[COLLECTION_NAME]) {
          for (const METHOD_NAME in ArrayIteratorMethods) {
          // some Chrome versions have non-configurable methods on DOMTokenList
            if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) {
              try {
                createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME])
              } catch (error) {
                CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME]
              }
            }
          }
        }
      }
    }
  }, { '../internals/create-non-enumerable-property': 35, '../internals/dom-iterables': 44, '../internals/global': 66, '../internals/well-known-symbol': 167, '../modules/es.array.iterator': 187 }],
  390: [function (require, module, exports) {
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const task = require('../internals/task')

    const FORCED = !global.setImmediate || !global.clearImmediate

    // http://w3c.github.io/setImmediate/
    $({ global: true, bind: true, enumerable: true, forced: FORCED }, {
      // `setImmediate` method
      // http://w3c.github.io/setImmediate/#si-setImmediate
      setImmediate: task.set,
      // `clearImmediate` method
      // http://w3c.github.io/setImmediate/#si-clearImmediate
      clearImmediate: task.clear
    })
  }, { '../internals/export': 55, '../internals/global': 66, '../internals/task': 148 }],
  391: [function (require, module, exports) {
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const microtask = require('../internals/microtask')
    const IS_NODE = require('../internals/engine-is-node')

    const process = global.process

    // `queueMicrotask` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
    $({ global: true, enumerable: true, noTargetGet: true }, {
      queueMicrotask: function queueMicrotask (fn) {
        const domain = IS_NODE && process.domain
        microtask(domain ? domain.bind(fn) : fn)
      }
    })
  }, { '../internals/engine-is-node': 49, '../internals/export': 55, '../internals/global': 66, '../internals/microtask': 93 }],
  392: [function (require, module, exports) {
    const $ = require('../internals/export')
    const global = require('../internals/global')
    const userAgent = require('../internals/engine-user-agent')

    const slice = [].slice
    const MSIE = /MSIE .\./.test(userAgent) // <- dirty ie9- check

    const wrap = function (scheduler) {
      return function (handler, timeout /* , ...arguments */) {
        const boundArgs = arguments.length > 2
        const args = boundArgs ? slice.call(arguments, 2) : undefined
        return scheduler(boundArgs ? function () {
          // eslint-disable-next-line no-new-func -- spec requirement
          (typeof handler === 'function' ? handler : Function(handler)).apply(this, args)
        } : handler, timeout)
      }
    }

    // ie9- setTimeout & setInterval additional parameters fix
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
    $({ global: true, bind: true, forced: MSIE }, {
      // `setTimeout` method
      // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
      setTimeout: wrap(global.setTimeout),
      // `setInterval` method
      // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
      setInterval: wrap(global.setInterval)
    })
  }, { '../internals/engine-user-agent': 51, '../internals/export': 55, '../internals/global': 66 }],
  393: [function (require, module, exports) {
    'use strict'
    // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
    require('../modules/es.array.iterator')
    const $ = require('../internals/export')
    const getBuiltIn = require('../internals/get-built-in')
    const USE_NATIVE_URL = require('../internals/native-url')
    const redefine = require('../internals/redefine')
    const redefineAll = require('../internals/redefine-all')
    const setToStringTag = require('../internals/set-to-string-tag')
    const createIteratorConstructor = require('../internals/create-iterator-constructor')
    const InternalStateModule = require('../internals/internal-state')
    const anInstance = require('../internals/an-instance')
    const hasOwn = require('../internals/has')
    const bind = require('../internals/function-bind-context')
    const classof = require('../internals/classof')
    const anObject = require('../internals/an-object')
    const isObject = require('../internals/is-object')
    const create = require('../internals/object-create')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const getIterator = require('../internals/get-iterator')
    const getIteratorMethod = require('../internals/get-iterator-method')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const $fetch = getBuiltIn('fetch')
    const Headers = getBuiltIn('Headers')
    const ITERATOR = wellKnownSymbol('iterator')
    const URL_SEARCH_PARAMS = 'URLSearchParams'
    const URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator'
    const setInternalState = InternalStateModule.set
    const getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS)
    const getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR)

    const plus = /\+/g
    const sequences = Array(4)

    const percentSequence = function (bytes) {
      return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'))
    }

    const percentDecode = function (sequence) {
      try {
        return decodeURIComponent(sequence)
      } catch (error) {
        return sequence
      }
    }

    const deserialize = function (it) {
      let result = it.replace(plus, ' ')
      let bytes = 4
      try {
        return decodeURIComponent(result)
      } catch (error) {
        while (bytes) {
          result = result.replace(percentSequence(bytes--), percentDecode)
        }
        return result
      }
    }

    const find = /[!'()~]|%20/g

    const replace = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+'
    }

    const replacer = function (match) {
      return replace[match]
    }

    const serialize = function (it) {
      return encodeURIComponent(it).replace(find, replacer)
    }

    const parseSearchParams = function (result, query) {
      if (query) {
        const attributes = query.split('&')
        let index = 0
        let attribute, entry
        while (index < attributes.length) {
          attribute = attributes[index++]
          if (attribute.length) {
            entry = attribute.split('=')
            result.push({
              key: deserialize(entry.shift()),
              value: deserialize(entry.join('='))
            })
          }
        }
      }
    }

    const updateSearchParams = function (query) {
      this.entries.length = 0
      parseSearchParams(this.entries, query)
    }

    const validateArgumentsLength = function (passed, required) {
      if (passed < required) throw TypeError('Not enough arguments')
    }

    const URLSearchParamsIterator = createIteratorConstructor(function Iterator (params, kind) {
      setInternalState(this, {
        type: URL_SEARCH_PARAMS_ITERATOR,
        iterator: getIterator(getInternalParamsState(params).entries),
        kind: kind
      })
    }, 'Iterator', function next () {
      const state = getInternalIteratorState(this)
      const kind = state.kind
      const step = state.iterator.next()
      const entry = step.value
      if (!step.done) {
        step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value]
      } return step
    })

    // `URLSearchParams` constructor
    // https://url.spec.whatwg.org/#interface-urlsearchparams
    var URLSearchParamsConstructor = function URLSearchParams (/* init */) {
      anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS)
      const init = arguments.length > 0 ? arguments[0] : undefined
      const that = this
      const entries = []
      let iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key

      setInternalState(that, {
        type: URL_SEARCH_PARAMS,
        entries: entries,
        updateURL: function () { /* empty */ },
        updateSearchParams: updateSearchParams
      })

      if (init !== undefined) {
        if (isObject(init)) {
          iteratorMethod = getIteratorMethod(init)
          if (typeof iteratorMethod === 'function') {
            iterator = iteratorMethod.call(init)
            next = iterator.next
            while (!(step = next.call(iterator)).done) {
              entryIterator = getIterator(anObject(step.value))
              entryNext = entryIterator.next
              if (
                (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
              ) throw TypeError('Expected sequence with length 2')
              entries.push({ key: first.value + '', value: second.value + '' })
            }
          } else for (key in init) if (hasOwn(init, key)) entries.push({ key: key, value: init[key] + '' })
        } else {
          parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '')
        }
      }
    }

    const URLSearchParamsPrototype = URLSearchParamsConstructor.prototype

    redefineAll(URLSearchParamsPrototype, {
      // `URLSearchParams.prototype.append` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-append
      append: function append (name, value) {
        validateArgumentsLength(arguments.length, 2)
        const state = getInternalParamsState(this)
        state.entries.push({ key: name + '', value: value + '' })
        state.updateURL()
      },
      // `URLSearchParams.prototype.delete` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
      delete: function (name) {
        validateArgumentsLength(arguments.length, 1)
        const state = getInternalParamsState(this)
        const entries = state.entries
        const key = name + ''
        let index = 0
        while (index < entries.length) {
          if (entries[index].key === key) entries.splice(index, 1)
          else index++
        }
        state.updateURL()
      },
      // `URLSearchParams.prototype.get` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-get
      get: function get (name) {
        validateArgumentsLength(arguments.length, 1)
        const entries = getInternalParamsState(this).entries
        const key = name + ''
        let index = 0
        for (; index < entries.length; index++) {
          if (entries[index].key === key) return entries[index].value
        }
        return null
      },
      // `URLSearchParams.prototype.getAll` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
      getAll: function getAll (name) {
        validateArgumentsLength(arguments.length, 1)
        const entries = getInternalParamsState(this).entries
        const key = name + ''
        const result = []
        let index = 0
        for (; index < entries.length; index++) {
          if (entries[index].key === key) result.push(entries[index].value)
        }
        return result
      },
      // `URLSearchParams.prototype.has` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-has
      has: function has (name) {
        validateArgumentsLength(arguments.length, 1)
        const entries = getInternalParamsState(this).entries
        const key = name + ''
        let index = 0
        while (index < entries.length) {
          if (entries[index++].key === key) return true
        }
        return false
      },
      // `URLSearchParams.prototype.set` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-set
      set: function set (name, value) {
        validateArgumentsLength(arguments.length, 1)
        const state = getInternalParamsState(this)
        const entries = state.entries
        let found = false
        const key = name + ''
        const val = value + ''
        let index = 0
        let entry
        for (; index < entries.length; index++) {
          entry = entries[index]
          if (entry.key === key) {
            if (found) entries.splice(index--, 1)
            else {
              found = true
              entry.value = val
            }
          }
        }
        if (!found) entries.push({ key: key, value: val })
        state.updateURL()
      },
      // `URLSearchParams.prototype.sort` method
      // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
      sort: function sort () {
        const state = getInternalParamsState(this)
        const entries = state.entries
        // Array#sort is not stable in some engines
        const slice = entries.slice()
        let entry, entriesIndex, sliceIndex
        entries.length = 0
        for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
          entry = slice[sliceIndex]
          for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
            if (entries[entriesIndex].key > entry.key) {
              entries.splice(entriesIndex, 0, entry)
              break
            }
          }
          if (entriesIndex === sliceIndex) entries.push(entry)
        }
        state.updateURL()
      },
      // `URLSearchParams.prototype.forEach` method
      forEach: function forEach (callback /* , thisArg */) {
        const entries = getInternalParamsState(this).entries
        const boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3)
        let index = 0
        let entry
        while (index < entries.length) {
          entry = entries[index++]
          boundFunction(entry.value, entry.key, this)
        }
      },
      // `URLSearchParams.prototype.keys` method
      keys: function keys () {
        return new URLSearchParamsIterator(this, 'keys')
      },
      // `URLSearchParams.prototype.values` method
      values: function values () {
        return new URLSearchParamsIterator(this, 'values')
      },
      // `URLSearchParams.prototype.entries` method
      entries: function entries () {
        return new URLSearchParamsIterator(this, 'entries')
      }
    }, { enumerable: true })

    // `URLSearchParams.prototype[@@iterator]` method
    redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries)

    // `URLSearchParams.prototype.toString` method
    // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
    redefine(URLSearchParamsPrototype, 'toString', function toString () {
      const entries = getInternalParamsState(this).entries
      const result = []
      let index = 0
      let entry
      while (index < entries.length) {
        entry = entries[index++]
        result.push(serialize(entry.key) + '=' + serialize(entry.value))
      } return result.join('&')
    }, { enumerable: true })

    setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS)

    $({ global: true, forced: !USE_NATIVE_URL }, {
      URLSearchParams: URLSearchParamsConstructor
    })

    // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
    // https://github.com/zloirock/core-js/issues/674
    if (!USE_NATIVE_URL && typeof $fetch === 'function' && typeof Headers === 'function') {
      $({ global: true, enumerable: true, forced: true }, {
        fetch: function fetch (input /* , init */) {
          const args = [input]
          let init, body, headers
          if (arguments.length > 1) {
            init = arguments[1]
            if (isObject(init)) {
              body = init.body
              if (classof(body) === URL_SEARCH_PARAMS) {
                headers = init.headers ? new Headers(init.headers) : new Headers()
                if (!headers.has('content-type')) {
                  headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
                }
                init = create(init, {
                  body: createPropertyDescriptor(0, String(body)),
                  headers: createPropertyDescriptor(0, headers)
                })
              }
            }
            args.push(init)
          } return $fetch.apply(this, args)
        }
      })
    }

    module.exports = {
      URLSearchParams: URLSearchParamsConstructor,
      getState: getInternalParamsState
    }
  }, { '../internals/an-instance': 5, '../internals/an-object': 6, '../internals/classof': 25, '../internals/create-iterator-constructor': 34, '../internals/create-property-descriptor': 36, '../internals/export': 55, '../internals/function-bind-context': 60, '../internals/get-built-in': 62, '../internals/get-iterator': 64, '../internals/get-iterator-method': 63, '../internals/has': 67, '../internals/internal-state': 77, '../internals/is-object': 82, '../internals/native-url': 96, '../internals/object-create': 104, '../internals/redefine': 124, '../internals/redefine-all': 123, '../internals/set-to-string-tag': 135, '../internals/well-known-symbol': 167, '../modules/es.array.iterator': 187 }],
  394: [function (require, module, exports) {
    'use strict'
    // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
    require('../modules/es.string.iterator')
    const $ = require('../internals/export')
    const DESCRIPTORS = require('../internals/descriptors')
    const USE_NATIVE_URL = require('../internals/native-url')
    const global = require('../internals/global')
    const defineProperties = require('../internals/object-define-properties')
    const redefine = require('../internals/redefine')
    const anInstance = require('../internals/an-instance')
    const has = require('../internals/has')
    const assign = require('../internals/object-assign')
    const arrayFrom = require('../internals/array-from')
    const codeAt = require('../internals/string-multibyte').codeAt
    const toASCII = require('../internals/string-punycode-to-ascii')
    const setToStringTag = require('../internals/set-to-string-tag')
    const URLSearchParamsModule = require('../modules/web.url-search-params')
    const InternalStateModule = require('../internals/internal-state')

    const NativeURL = global.URL
    const URLSearchParams = URLSearchParamsModule.URLSearchParams
    const getInternalSearchParamsState = URLSearchParamsModule.getState
    const setInternalState = InternalStateModule.set
    const getInternalURLState = InternalStateModule.getterFor('URL')
    const floor = Math.floor
    const pow = Math.pow

    const INVALID_AUTHORITY = 'Invalid authority'
    const INVALID_SCHEME = 'Invalid scheme'
    const INVALID_HOST = 'Invalid host'
    const INVALID_PORT = 'Invalid port'

    const ALPHA = /[A-Za-z]/
    // eslint-disable-next-line regexp/no-obscure-range -- safe
    const ALPHANUMERIC = /[\d+-.A-Za-z]/
    const DIGIT = /\d/
    const HEX_START = /^0x/i
    const OCT = /^[0-7]+$/
    const DEC = /^\d+$/
    const HEX = /^[\dA-Fa-f]+$/
    /* eslint-disable no-control-regex -- safe */
    const FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/
    const FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/
    const LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g
    const TAB_AND_NEW_LINE = /[\t\n\r]/g
    /* eslint-enable no-control-regex -- safe */
    let EOF

    const parseHost = function (url, input) {
      let result, codePoints, index
      if (input.charAt(0) == '[') {
        if (input.charAt(input.length - 1) != ']') return INVALID_HOST
        result = parseIPv6(input.slice(1, -1))
        if (!result) return INVALID_HOST
        url.host = result
        // opaque host
      } else if (!isSpecial(url)) {
        if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST
        result = ''
        codePoints = arrayFrom(input)
        for (index = 0; index < codePoints.length; index++) {
          result += percentEncode(codePoints[index], C0ControlPercentEncodeSet)
        }
        url.host = result
      } else {
        input = toASCII(input)
        if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST
        result = parseIPv4(input)
        if (result === null) return INVALID_HOST
        url.host = result
      }
    }

    var parseIPv4 = function (input) {
      const parts = input.split('.')
      let partsLength, numbers, index, part, radix, number, ipv4
      if (parts.length && parts[parts.length - 1] == '') {
        parts.pop()
      }
      partsLength = parts.length
      if (partsLength > 4) return input
      numbers = []
      for (index = 0; index < partsLength; index++) {
        part = parts[index]
        if (part == '') return input
        radix = 10
        if (part.length > 1 && part.charAt(0) == '0') {
          radix = HEX_START.test(part) ? 16 : 8
          part = part.slice(radix == 8 ? 1 : 2)
        }
        if (part === '') {
          number = 0
        } else {
          if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input
          number = parseInt(part, radix)
        }
        numbers.push(number)
      }
      for (index = 0; index < partsLength; index++) {
        number = numbers[index]
        if (index == partsLength - 1) {
          if (number >= pow(256, 5 - partsLength)) return null
        } else if (number > 255) return null
      }
      ipv4 = numbers.pop()
      for (index = 0; index < numbers.length; index++) {
        ipv4 += numbers[index] * pow(256, 3 - index)
      }
      return ipv4
    }

    // eslint-disable-next-line max-statements -- TODO
    var parseIPv6 = function (input) {
      const address = [0, 0, 0, 0, 0, 0, 0, 0]
      let pieceIndex = 0
      let compress = null
      let pointer = 0
      let value, length, numbersSeen, ipv4Piece, number, swaps, swap

      const char = function () {
        return input.charAt(pointer)
      }

      if (char() == ':') {
        if (input.charAt(1) != ':') return
        pointer += 2
        pieceIndex++
        compress = pieceIndex
      }
      while (char()) {
        if (pieceIndex == 8) return
        if (char() == ':') {
          if (compress !== null) return
          pointer++
          pieceIndex++
          compress = pieceIndex
          continue
        }
        value = length = 0
        while (length < 4 && HEX.test(char())) {
          value = value * 16 + parseInt(char(), 16)
          pointer++
          length++
        }
        if (char() == '.') {
          if (length == 0) return
          pointer -= length
          if (pieceIndex > 6) return
          numbersSeen = 0
          while (char()) {
            ipv4Piece = null
            if (numbersSeen > 0) {
              if (char() == '.' && numbersSeen < 4) pointer++
              else return
            }
            if (!DIGIT.test(char())) return
            while (DIGIT.test(char())) {
              number = parseInt(char(), 10)
              if (ipv4Piece === null) ipv4Piece = number
              else if (ipv4Piece == 0) return
              else ipv4Piece = ipv4Piece * 10 + number
              if (ipv4Piece > 255) return
              pointer++
            }
            address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece
            numbersSeen++
            if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++
          }
          if (numbersSeen != 4) return
          break
        } else if (char() == ':') {
          pointer++
          if (!char()) return
        } else if (char()) return
        address[pieceIndex++] = value
      }
      if (compress !== null) {
        swaps = pieceIndex - compress
        pieceIndex = 7
        while (pieceIndex != 0 && swaps > 0) {
          swap = address[pieceIndex]
          address[pieceIndex--] = address[compress + swaps - 1]
          address[compress + --swaps] = swap
        }
      } else if (pieceIndex != 8) return
      return address
    }

    const findLongestZeroSequence = function (ipv6) {
      let maxIndex = null
      let maxLength = 1
      let currStart = null
      let currLength = 0
      let index = 0
      for (; index < 8; index++) {
        if (ipv6[index] !== 0) {
          if (currLength > maxLength) {
            maxIndex = currStart
            maxLength = currLength
          }
          currStart = null
          currLength = 0
        } else {
          if (currStart === null) currStart = index
          ++currLength
        }
      }
      if (currLength > maxLength) {
        maxIndex = currStart
        maxLength = currLength
      }
      return maxIndex
    }

    const serializeHost = function (host) {
      let result, index, compress, ignore0
      // ipv4
      if (typeof host === 'number') {
        result = []
        for (index = 0; index < 4; index++) {
          result.unshift(host % 256)
          host = floor(host / 256)
        } return result.join('.')
        // ipv6
      } else if (typeof host === 'object') {
        result = ''
        compress = findLongestZeroSequence(host)
        for (index = 0; index < 8; index++) {
          if (ignore0 && host[index] === 0) continue
          if (ignore0) ignore0 = false
          if (compress === index) {
            result += index ? ':' : '::'
            ignore0 = true
          } else {
            result += host[index].toString(16)
            if (index < 7) result += ':'
          }
        }
        return '[' + result + ']'
      } return host
    }

    var C0ControlPercentEncodeSet = {}
    const fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
      ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
    })
    const pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
      '#': 1, '?': 1, '{': 1, '}': 1
    })
    const userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
      '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
    })

    var percentEncode = function (char, set) {
      const code = codeAt(char, 0)
      return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char)
    }

    const specialSchemes = {
      ftp: 21,
      file: null,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    }

    var isSpecial = function (url) {
      return has(specialSchemes, url.scheme)
    }

    const includesCredentials = function (url) {
      return url.username != '' || url.password != ''
    }

    const cannotHaveUsernamePasswordPort = function (url) {
      return !url.host || url.cannotBeABaseURL || url.scheme == 'file'
    }

    const isWindowsDriveLetter = function (string, normalized) {
      let second
      return string.length == 2 && ALPHA.test(string.charAt(0)) &&
    ((second = string.charAt(1)) == ':' || (!normalized && second == '|'))
    }

    const startsWithWindowsDriveLetter = function (string) {
      let third
      return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
        string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
      )
    }

    const shortenURLsPath = function (url) {
      const path = url.path
      const pathSize = path.length
      if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
        path.pop()
      }
    }

    const isSingleDot = function (segment) {
      return segment === '.' || segment.toLowerCase() === '%2e'
    }

    const isDoubleDot = function (segment) {
      segment = segment.toLowerCase()
      return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e'
    }

    // States:
    const SCHEME_START = {}
    const SCHEME = {}
    const NO_SCHEME = {}
    const SPECIAL_RELATIVE_OR_AUTHORITY = {}
    const PATH_OR_AUTHORITY = {}
    const RELATIVE = {}
    const RELATIVE_SLASH = {}
    const SPECIAL_AUTHORITY_SLASHES = {}
    const SPECIAL_AUTHORITY_IGNORE_SLASHES = {}
    const AUTHORITY = {}
    const HOST = {}
    const HOSTNAME = {}
    const PORT = {}
    const FILE = {}
    const FILE_SLASH = {}
    const FILE_HOST = {}
    const PATH_START = {}
    const PATH = {}
    const CANNOT_BE_A_BASE_URL_PATH = {}
    const QUERY = {}
    const FRAGMENT = {}

    // eslint-disable-next-line max-statements -- TODO
    const parseURL = function (url, input, stateOverride, base) {
      let state = stateOverride || SCHEME_START
      let pointer = 0
      let buffer = ''
      let seenAt = false
      let seenBracket = false
      let seenPasswordToken = false
      let codePoints, char, bufferCodePoints, failure

      if (!stateOverride) {
        url.scheme = ''
        url.username = ''
        url.password = ''
        url.host = null
        url.port = null
        url.path = []
        url.query = null
        url.fragment = null
        url.cannotBeABaseURL = false
        input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '')
      }

      input = input.replace(TAB_AND_NEW_LINE, '')

      codePoints = arrayFrom(input)

      while (pointer <= codePoints.length) {
        char = codePoints[pointer]
        switch (state) {
          case SCHEME_START:
            if (char && ALPHA.test(char)) {
              buffer += char.toLowerCase()
              state = SCHEME
            } else if (!stateOverride) {
              state = NO_SCHEME
              continue
            } else return INVALID_SCHEME
            break

          case SCHEME:
            if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
              buffer += char.toLowerCase()
            } else if (char == ':') {
              if (stateOverride && (
                (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
              )) return
              url.scheme = buffer
              if (stateOverride) {
                if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null
                return
              }
              buffer = ''
              if (url.scheme == 'file') {
                state = FILE
              } else if (isSpecial(url) && base && base.scheme == url.scheme) {
                state = SPECIAL_RELATIVE_OR_AUTHORITY
              } else if (isSpecial(url)) {
                state = SPECIAL_AUTHORITY_SLASHES
              } else if (codePoints[pointer + 1] == '/') {
                state = PATH_OR_AUTHORITY
                pointer++
              } else {
                url.cannotBeABaseURL = true
                url.path.push('')
                state = CANNOT_BE_A_BASE_URL_PATH
              }
            } else if (!stateOverride) {
              buffer = ''
              state = NO_SCHEME
              pointer = 0
              continue
            } else return INVALID_SCHEME
            break

          case NO_SCHEME:
            if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME
            if (base.cannotBeABaseURL && char == '#') {
              url.scheme = base.scheme
              url.path = base.path.slice()
              url.query = base.query
              url.fragment = ''
              url.cannotBeABaseURL = true
              state = FRAGMENT
              break
            }
            state = base.scheme == 'file' ? FILE : RELATIVE
            continue

          case SPECIAL_RELATIVE_OR_AUTHORITY:
            if (char == '/' && codePoints[pointer + 1] == '/') {
              state = SPECIAL_AUTHORITY_IGNORE_SLASHES
              pointer++
            } else {
              state = RELATIVE
              continue
            } break

          case PATH_OR_AUTHORITY:
            if (char == '/') {
              state = AUTHORITY
              break
            } else {
              state = PATH
              continue
            }

          case RELATIVE:
            url.scheme = base.scheme
            if (char == EOF) {
              url.username = base.username
              url.password = base.password
              url.host = base.host
              url.port = base.port
              url.path = base.path.slice()
              url.query = base.query
            } else if (char == '/' || (char == '\\' && isSpecial(url))) {
              state = RELATIVE_SLASH
            } else if (char == '?') {
              url.username = base.username
              url.password = base.password
              url.host = base.host
              url.port = base.port
              url.path = base.path.slice()
              url.query = ''
              state = QUERY
            } else if (char == '#') {
              url.username = base.username
              url.password = base.password
              url.host = base.host
              url.port = base.port
              url.path = base.path.slice()
              url.query = base.query
              url.fragment = ''
              state = FRAGMENT
            } else {
              url.username = base.username
              url.password = base.password
              url.host = base.host
              url.port = base.port
              url.path = base.path.slice()
              url.path.pop()
              state = PATH
              continue
            } break

          case RELATIVE_SLASH:
            if (isSpecial(url) && (char == '/' || char == '\\')) {
              state = SPECIAL_AUTHORITY_IGNORE_SLASHES
            } else if (char == '/') {
              state = AUTHORITY
            } else {
              url.username = base.username
              url.password = base.password
              url.host = base.host
              url.port = base.port
              state = PATH
              continue
            } break

          case SPECIAL_AUTHORITY_SLASHES:
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES
            if (char != '/' || buffer.charAt(pointer + 1) != '/') continue
            pointer++
            break

          case SPECIAL_AUTHORITY_IGNORE_SLASHES:
            if (char != '/' && char != '\\') {
              state = AUTHORITY
              continue
            } break

          case AUTHORITY:
            if (char == '@') {
              if (seenAt) buffer = '%40' + buffer
              seenAt = true
              bufferCodePoints = arrayFrom(buffer)
              for (let i = 0; i < bufferCodePoints.length; i++) {
                const codePoint = bufferCodePoints[i]
                if (codePoint == ':' && !seenPasswordToken) {
                  seenPasswordToken = true
                  continue
                }
                const encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet)
                if (seenPasswordToken) url.password += encodedCodePoints
                else url.username += encodedCodePoints
              }
              buffer = ''
            } else if (
              char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
            ) {
              if (seenAt && buffer == '') return INVALID_AUTHORITY
              pointer -= arrayFrom(buffer).length + 1
              buffer = ''
              state = HOST
            } else buffer += char
            break

          case HOST:
          case HOSTNAME:
            if (stateOverride && url.scheme == 'file') {
              state = FILE_HOST
              continue
            } else if (char == ':' && !seenBracket) {
              if (buffer == '') return INVALID_HOST
              failure = parseHost(url, buffer)
              if (failure) return failure
              buffer = ''
              state = PORT
              if (stateOverride == HOSTNAME) return
            } else if (
              char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
            ) {
              if (isSpecial(url) && buffer == '') return INVALID_HOST
              if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return
              failure = parseHost(url, buffer)
              if (failure) return failure
              buffer = ''
              state = PATH_START
              if (stateOverride) return
              continue
            } else {
              if (char == '[') seenBracket = true
              else if (char == ']') seenBracket = false
              buffer += char
            } break

          case PORT:
            if (DIGIT.test(char)) {
              buffer += char
            } else if (
              char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
            ) {
              if (buffer != '') {
                const port = parseInt(buffer, 10)
                if (port > 0xFFFF) return INVALID_PORT
                url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port
                buffer = ''
              }
              if (stateOverride) return
              state = PATH_START
              continue
            } else return INVALID_PORT
            break

          case FILE:
            url.scheme = 'file'
            if (char == '/' || char == '\\') state = FILE_SLASH
            else if (base && base.scheme == 'file') {
              if (char == EOF) {
                url.host = base.host
                url.path = base.path.slice()
                url.query = base.query
              } else if (char == '?') {
                url.host = base.host
                url.path = base.path.slice()
                url.query = ''
                state = QUERY
              } else if (char == '#') {
                url.host = base.host
                url.path = base.path.slice()
                url.query = base.query
                url.fragment = ''
                state = FRAGMENT
              } else {
                if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                  url.host = base.host
                  url.path = base.path.slice()
                  shortenURLsPath(url)
                }
                state = PATH
                continue
              }
            } else {
              state = PATH
              continue
            } break

          case FILE_SLASH:
            if (char == '/' || char == '\\') {
              state = FILE_HOST
              break
            }
            if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0])
              else url.host = base.host
            }
            state = PATH
            continue

          case FILE_HOST:
            if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
              if (!stateOverride && isWindowsDriveLetter(buffer)) {
                state = PATH
              } else if (buffer == '') {
                url.host = ''
                if (stateOverride) return
                state = PATH_START
              } else {
                failure = parseHost(url, buffer)
                if (failure) return failure
                if (url.host == 'localhost') url.host = ''
                if (stateOverride) return
                buffer = ''
                state = PATH_START
              } continue
            } else buffer += char
            break

          case PATH_START:
            if (isSpecial(url)) {
              state = PATH
              if (char != '/' && char != '\\') continue
            } else if (!stateOverride && char == '?') {
              url.query = ''
              state = QUERY
            } else if (!stateOverride && char == '#') {
              url.fragment = ''
              state = FRAGMENT
            } else if (char != EOF) {
              state = PATH
              if (char != '/') continue
            } break

          case PATH:
            if (
              char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
            ) {
              if (isDoubleDot(buffer)) {
                shortenURLsPath(url)
                if (char != '/' && !(char == '\\' && isSpecial(url))) {
                  url.path.push('')
                }
              } else if (isSingleDot(buffer)) {
                if (char != '/' && !(char == '\\' && isSpecial(url))) {
                  url.path.push('')
                }
              } else {
                if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                  if (url.host) url.host = ''
                  buffer = buffer.charAt(0) + ':' // normalize windows drive letter
                }
                url.path.push(buffer)
              }
              buffer = ''
              if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
                while (url.path.length > 1 && url.path[0] === '') {
                  url.path.shift()
                }
              }
              if (char == '?') {
                url.query = ''
                state = QUERY
              } else if (char == '#') {
                url.fragment = ''
                state = FRAGMENT
              }
            } else {
              buffer += percentEncode(char, pathPercentEncodeSet)
            } break

          case CANNOT_BE_A_BASE_URL_PATH:
            if (char == '?') {
              url.query = ''
              state = QUERY
            } else if (char == '#') {
              url.fragment = ''
              state = FRAGMENT
            } else if (char != EOF) {
              url.path[0] += percentEncode(char, C0ControlPercentEncodeSet)
            } break

          case QUERY:
            if (!stateOverride && char == '#') {
              url.fragment = ''
              state = FRAGMENT
            } else if (char != EOF) {
              if (char == "'" && isSpecial(url)) url.query += '%27'
              else if (char == '#') url.query += '%23'
              else url.query += percentEncode(char, C0ControlPercentEncodeSet)
            } break

          case FRAGMENT:
            if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet)
            break
        }

        pointer++
      }
    }

    // `URL` constructor
    // https://url.spec.whatwg.org/#url-class
    var URLConstructor = function URL (url /* , base */) {
      const that = anInstance(this, URLConstructor, 'URL')
      const base = arguments.length > 1 ? arguments[1] : undefined
      const urlString = String(url)
      const state = setInternalState(that, { type: 'URL' })
      let baseState, failure
      if (base !== undefined) {
        if (base instanceof URLConstructor) baseState = getInternalURLState(base)
        else {
          failure = parseURL(baseState = {}, String(base))
          if (failure) throw TypeError(failure)
        }
      }
      failure = parseURL(state, urlString, null, baseState)
      if (failure) throw TypeError(failure)
      const searchParams = state.searchParams = new URLSearchParams()
      const searchParamsState = getInternalSearchParamsState(searchParams)
      searchParamsState.updateSearchParams(state.query)
      searchParamsState.updateURL = function () {
        state.query = String(searchParams) || null
      }
      if (!DESCRIPTORS) {
        that.href = serializeURL.call(that)
        that.origin = getOrigin.call(that)
        that.protocol = getProtocol.call(that)
        that.username = getUsername.call(that)
        that.password = getPassword.call(that)
        that.host = getHost.call(that)
        that.hostname = getHostname.call(that)
        that.port = getPort.call(that)
        that.pathname = getPathname.call(that)
        that.search = getSearch.call(that)
        that.searchParams = getSearchParams.call(that)
        that.hash = getHash.call(that)
      }
    }

    const URLPrototype = URLConstructor.prototype

    var serializeURL = function () {
      const url = getInternalURLState(this)
      const scheme = url.scheme
      const username = url.username
      const password = url.password
      const host = url.host
      const port = url.port
      const path = url.path
      const query = url.query
      const fragment = url.fragment
      let output = scheme + ':'
      if (host !== null) {
        output += '//'
        if (includesCredentials(url)) {
          output += username + (password ? ':' + password : '') + '@'
        }
        output += serializeHost(host)
        if (port !== null) output += ':' + port
      } else if (scheme == 'file') output += '//'
      output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : ''
      if (query !== null) output += '?' + query
      if (fragment !== null) output += '#' + fragment
      return output
    }

    var getOrigin = function () {
      const url = getInternalURLState(this)
      const scheme = url.scheme
      const port = url.port
      if (scheme == 'blob') {
        try {
          return new URLConstructor(scheme.path[0]).origin
        } catch (error) {
          return 'null'
        }
      }
      if (scheme == 'file' || !isSpecial(url)) return 'null'
      return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '')
    }

    var getProtocol = function () {
      return getInternalURLState(this).scheme + ':'
    }

    var getUsername = function () {
      return getInternalURLState(this).username
    }

    var getPassword = function () {
      return getInternalURLState(this).password
    }

    var getHost = function () {
      const url = getInternalURLState(this)
      const host = url.host
      const port = url.port
      return host === null
        ? ''
        : port === null
          ? serializeHost(host)
          : serializeHost(host) + ':' + port
    }

    var getHostname = function () {
      const host = getInternalURLState(this).host
      return host === null ? '' : serializeHost(host)
    }

    var getPort = function () {
      const port = getInternalURLState(this).port
      return port === null ? '' : String(port)
    }

    var getPathname = function () {
      const url = getInternalURLState(this)
      const path = url.path
      return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : ''
    }

    var getSearch = function () {
      const query = getInternalURLState(this).query
      return query ? '?' + query : ''
    }

    var getSearchParams = function () {
      return getInternalURLState(this).searchParams
    }

    var getHash = function () {
      const fragment = getInternalURLState(this).fragment
      return fragment ? '#' + fragment : ''
    }

    const accessorDescriptor = function (getter, setter) {
      return { get: getter, set: setter, configurable: true, enumerable: true }
    }

    if (DESCRIPTORS) {
      defineProperties(URLPrototype, {
        // `URL.prototype.href` accessors pair
        // https://url.spec.whatwg.org/#dom-url-href
        href: accessorDescriptor(serializeURL, function (href) {
          const url = getInternalURLState(this)
          const urlString = String(href)
          const failure = parseURL(url, urlString)
          if (failure) throw TypeError(failure)
          getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query)
        }),
        // `URL.prototype.origin` getter
        // https://url.spec.whatwg.org/#dom-url-origin
        origin: accessorDescriptor(getOrigin),
        // `URL.prototype.protocol` accessors pair
        // https://url.spec.whatwg.org/#dom-url-protocol
        protocol: accessorDescriptor(getProtocol, function (protocol) {
          const url = getInternalURLState(this)
          parseURL(url, String(protocol) + ':', SCHEME_START)
        }),
        // `URL.prototype.username` accessors pair
        // https://url.spec.whatwg.org/#dom-url-username
        username: accessorDescriptor(getUsername, function (username) {
          const url = getInternalURLState(this)
          const codePoints = arrayFrom(String(username))
          if (cannotHaveUsernamePasswordPort(url)) return
          url.username = ''
          for (let i = 0; i < codePoints.length; i++) {
            url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet)
          }
        }),
        // `URL.prototype.password` accessors pair
        // https://url.spec.whatwg.org/#dom-url-password
        password: accessorDescriptor(getPassword, function (password) {
          const url = getInternalURLState(this)
          const codePoints = arrayFrom(String(password))
          if (cannotHaveUsernamePasswordPort(url)) return
          url.password = ''
          for (let i = 0; i < codePoints.length; i++) {
            url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet)
          }
        }),
        // `URL.prototype.host` accessors pair
        // https://url.spec.whatwg.org/#dom-url-host
        host: accessorDescriptor(getHost, function (host) {
          const url = getInternalURLState(this)
          if (url.cannotBeABaseURL) return
          parseURL(url, String(host), HOST)
        }),
        // `URL.prototype.hostname` accessors pair
        // https://url.spec.whatwg.org/#dom-url-hostname
        hostname: accessorDescriptor(getHostname, function (hostname) {
          const url = getInternalURLState(this)
          if (url.cannotBeABaseURL) return
          parseURL(url, String(hostname), HOSTNAME)
        }),
        // `URL.prototype.port` accessors pair
        // https://url.spec.whatwg.org/#dom-url-port
        port: accessorDescriptor(getPort, function (port) {
          const url = getInternalURLState(this)
          if (cannotHaveUsernamePasswordPort(url)) return
          port = String(port)
          if (port == '') url.port = null
          else parseURL(url, port, PORT)
        }),
        // `URL.prototype.pathname` accessors pair
        // https://url.spec.whatwg.org/#dom-url-pathname
        pathname: accessorDescriptor(getPathname, function (pathname) {
          const url = getInternalURLState(this)
          if (url.cannotBeABaseURL) return
          url.path = []
          parseURL(url, pathname + '', PATH_START)
        }),
        // `URL.prototype.search` accessors pair
        // https://url.spec.whatwg.org/#dom-url-search
        search: accessorDescriptor(getSearch, function (search) {
          const url = getInternalURLState(this)
          search = String(search)
          if (search == '') {
            url.query = null
          } else {
            if (search.charAt(0) == '?') search = search.slice(1)
            url.query = ''
            parseURL(url, search, QUERY)
          }
          getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query)
        }),
        // `URL.prototype.searchParams` getter
        // https://url.spec.whatwg.org/#dom-url-searchparams
        searchParams: accessorDescriptor(getSearchParams),
        // `URL.prototype.hash` accessors pair
        // https://url.spec.whatwg.org/#dom-url-hash
        hash: accessorDescriptor(getHash, function (hash) {
          const url = getInternalURLState(this)
          hash = String(hash)
          if (hash == '') {
            url.fragment = null
            return
          }
          if (hash.charAt(0) == '#') hash = hash.slice(1)
          url.fragment = ''
          parseURL(url, hash, FRAGMENT)
        })
      })
    }

    // `URL.prototype.toJSON` method
    // https://url.spec.whatwg.org/#dom-url-tojson
    redefine(URLPrototype, 'toJSON', function toJSON () {
      return serializeURL.call(this)
    }, { enumerable: true })

    // `URL.prototype.toString` method
    // https://url.spec.whatwg.org/#URL-stringification-behavior
    redefine(URLPrototype, 'toString', function toString () {
      return serializeURL.call(this)
    }, { enumerable: true })

    if (NativeURL) {
      const nativeCreateObjectURL = NativeURL.createObjectURL
      const nativeRevokeObjectURL = NativeURL.revokeObjectURL
      // `URL.createObjectURL` method
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      if (nativeCreateObjectURL) {
        redefine(URLConstructor, 'createObjectURL', function createObjectURL (blob) {
          return nativeCreateObjectURL.apply(NativeURL, arguments)
        })
      }
      // `URL.revokeObjectURL` method
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      if (nativeRevokeObjectURL) {
        redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL (url) {
          return nativeRevokeObjectURL.apply(NativeURL, arguments)
        })
      }
    }

    setToStringTag(URLConstructor, 'URL')

    $({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
      URL: URLConstructor
    })
  }, { '../internals/an-instance': 5, '../internals/array-from': 13, '../internals/descriptors': 42, '../internals/export': 55, '../internals/global': 66, '../internals/has': 67, '../internals/internal-state': 77, '../internals/native-url': 96, '../internals/object-assign': 103, '../internals/object-define-properties': 105, '../internals/redefine': 124, '../internals/set-to-string-tag': 135, '../internals/string-multibyte': 141, '../internals/string-punycode-to-ascii': 144, '../modules/es.string.iterator': 314, '../modules/web.url-search-params': 393 }],
  395: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')

    // `URL.prototype.toJSON` method
    // https://url.spec.whatwg.org/#dom-url-tojson
    $({ target: 'URL', proto: true, enumerable: true }, {
      toJSON: function toJSON () {
        return URL.prototype.toString.call(this)
      }
    })
  }, { '../internals/export': 55 }],
  396: [function (require, module, exports) {
    require('../modules/es.symbol')
    require('../modules/es.symbol.description')
    require('../modules/es.symbol.async-iterator')
    require('../modules/es.symbol.has-instance')
    require('../modules/es.symbol.is-concat-spreadable')
    require('../modules/es.symbol.iterator')
    require('../modules/es.symbol.match')
    require('../modules/es.symbol.match-all')
    require('../modules/es.symbol.replace')
    require('../modules/es.symbol.search')
    require('../modules/es.symbol.species')
    require('../modules/es.symbol.split')
    require('../modules/es.symbol.to-primitive')
    require('../modules/es.symbol.to-string-tag')
    require('../modules/es.symbol.unscopables')
    require('../modules/es.aggregate-error')
    require('../modules/es.array.concat')
    require('../modules/es.array.copy-within')
    require('../modules/es.array.every')
    require('../modules/es.array.fill')
    require('../modules/es.array.filter')
    require('../modules/es.array.find')
    require('../modules/es.array.find-index')
    require('../modules/es.array.flat')
    require('../modules/es.array.flat-map')
    require('../modules/es.array.for-each')
    require('../modules/es.array.from')
    require('../modules/es.array.includes')
    require('../modules/es.array.index-of')
    require('../modules/es.array.is-array')
    require('../modules/es.array.iterator')
    require('../modules/es.array.join')
    require('../modules/es.array.last-index-of')
    require('../modules/es.array.map')
    require('../modules/es.array.of')
    require('../modules/es.array.reduce')
    require('../modules/es.array.reduce-right')
    require('../modules/es.array.reverse')
    require('../modules/es.array.slice')
    require('../modules/es.array.some')
    require('../modules/es.array.sort')
    require('../modules/es.array.species')
    require('../modules/es.array.splice')
    require('../modules/es.array.unscopables.flat')
    require('../modules/es.array.unscopables.flat-map')
    require('../modules/es.array-buffer.constructor')
    require('../modules/es.array-buffer.is-view')
    require('../modules/es.array-buffer.slice')
    require('../modules/es.data-view')
    require('../modules/es.date.get-year')
    require('../modules/es.date.now')
    require('../modules/es.date.set-year')
    require('../modules/es.date.to-gmt-string')
    require('../modules/es.date.to-iso-string')
    require('../modules/es.date.to-json')
    require('../modules/es.date.to-primitive')
    require('../modules/es.date.to-string')
    require('../modules/es.escape')
    require('../modules/es.function.bind')
    require('../modules/es.function.has-instance')
    require('../modules/es.function.name')
    require('../modules/es.global-this')
    require('../modules/es.json.stringify')
    require('../modules/es.json.to-string-tag')
    require('../modules/es.map')
    require('../modules/es.math.acosh')
    require('../modules/es.math.asinh')
    require('../modules/es.math.atanh')
    require('../modules/es.math.cbrt')
    require('../modules/es.math.clz32')
    require('../modules/es.math.cosh')
    require('../modules/es.math.expm1')
    require('../modules/es.math.fround')
    require('../modules/es.math.hypot')
    require('../modules/es.math.imul')
    require('../modules/es.math.log10')
    require('../modules/es.math.log1p')
    require('../modules/es.math.log2')
    require('../modules/es.math.sign')
    require('../modules/es.math.sinh')
    require('../modules/es.math.tanh')
    require('../modules/es.math.to-string-tag')
    require('../modules/es.math.trunc')
    require('../modules/es.number.constructor')
    require('../modules/es.number.epsilon')
    require('../modules/es.number.is-finite')
    require('../modules/es.number.is-integer')
    require('../modules/es.number.is-nan')
    require('../modules/es.number.is-safe-integer')
    require('../modules/es.number.max-safe-integer')
    require('../modules/es.number.min-safe-integer')
    require('../modules/es.number.parse-float')
    require('../modules/es.number.parse-int')
    require('../modules/es.number.to-fixed')
    require('../modules/es.number.to-precision')
    require('../modules/es.object.assign')
    require('../modules/es.object.create')
    require('../modules/es.object.define-getter')
    require('../modules/es.object.define-properties')
    require('../modules/es.object.define-property')
    require('../modules/es.object.define-setter')
    require('../modules/es.object.entries')
    require('../modules/es.object.freeze')
    require('../modules/es.object.from-entries')
    require('../modules/es.object.get-own-property-descriptor')
    require('../modules/es.object.get-own-property-descriptors')
    require('../modules/es.object.get-own-property-names')
    require('../modules/es.object.get-prototype-of')
    require('../modules/es.object.is')
    require('../modules/es.object.is-extensible')
    require('../modules/es.object.is-frozen')
    require('../modules/es.object.is-sealed')
    require('../modules/es.object.keys')
    require('../modules/es.object.lookup-getter')
    require('../modules/es.object.lookup-setter')
    require('../modules/es.object.prevent-extensions')
    require('../modules/es.object.seal')
    require('../modules/es.object.set-prototype-of')
    require('../modules/es.object.to-string')
    require('../modules/es.object.values')
    require('../modules/es.parse-float')
    require('../modules/es.parse-int')
    require('../modules/es.promise')
    require('../modules/es.promise.all-settled')
    require('../modules/es.promise.any')
    require('../modules/es.promise.finally')
    require('../modules/es.reflect.apply')
    require('../modules/es.reflect.construct')
    require('../modules/es.reflect.define-property')
    require('../modules/es.reflect.delete-property')
    require('../modules/es.reflect.get')
    require('../modules/es.reflect.get-own-property-descriptor')
    require('../modules/es.reflect.get-prototype-of')
    require('../modules/es.reflect.has')
    require('../modules/es.reflect.is-extensible')
    require('../modules/es.reflect.own-keys')
    require('../modules/es.reflect.prevent-extensions')
    require('../modules/es.reflect.set')
    require('../modules/es.reflect.set-prototype-of')
    require('../modules/es.reflect.to-string-tag')
    require('../modules/es.regexp.constructor')
    require('../modules/es.regexp.dot-all')
    require('../modules/es.regexp.exec')
    require('../modules/es.regexp.flags')
    require('../modules/es.regexp.sticky')
    require('../modules/es.regexp.test')
    require('../modules/es.regexp.to-string')
    require('../modules/es.set')
    require('../modules/es.string.code-point-at')
    require('../modules/es.string.ends-with')
    require('../modules/es.string.from-code-point')
    require('../modules/es.string.includes')
    require('../modules/es.string.iterator')
    require('../modules/es.string.match')
    require('../modules/es.string.match-all')
    require('../modules/es.string.pad-end')
    require('../modules/es.string.pad-start')
    require('../modules/es.string.raw')
    require('../modules/es.string.repeat')
    require('../modules/es.string.replace')
    require('../modules/es.string.replace-all')
    require('../modules/es.string.search')
    require('../modules/es.string.split')
    require('../modules/es.string.starts-with')
    require('../modules/es.string.substr')
    require('../modules/es.string.trim')
    require('../modules/es.string.trim-end')
    require('../modules/es.string.trim-start')
    require('../modules/es.string.anchor')
    require('../modules/es.string.big')
    require('../modules/es.string.blink')
    require('../modules/es.string.bold')
    require('../modules/es.string.fixed')
    require('../modules/es.string.fontcolor')
    require('../modules/es.string.fontsize')
    require('../modules/es.string.italics')
    require('../modules/es.string.link')
    require('../modules/es.string.small')
    require('../modules/es.string.strike')
    require('../modules/es.string.sub')
    require('../modules/es.string.sup')
    require('../modules/es.typed-array.float32-array')
    require('../modules/es.typed-array.float64-array')
    require('../modules/es.typed-array.int8-array')
    require('../modules/es.typed-array.int16-array')
    require('../modules/es.typed-array.int32-array')
    require('../modules/es.typed-array.uint8-array')
    require('../modules/es.typed-array.uint8-clamped-array')
    require('../modules/es.typed-array.uint16-array')
    require('../modules/es.typed-array.uint32-array')
    require('../modules/es.typed-array.copy-within')
    require('../modules/es.typed-array.every')
    require('../modules/es.typed-array.fill')
    require('../modules/es.typed-array.filter')
    require('../modules/es.typed-array.find')
    require('../modules/es.typed-array.find-index')
    require('../modules/es.typed-array.for-each')
    require('../modules/es.typed-array.from')
    require('../modules/es.typed-array.includes')
    require('../modules/es.typed-array.index-of')
    require('../modules/es.typed-array.iterator')
    require('../modules/es.typed-array.join')
    require('../modules/es.typed-array.last-index-of')
    require('../modules/es.typed-array.map')
    require('../modules/es.typed-array.of')
    require('../modules/es.typed-array.reduce')
    require('../modules/es.typed-array.reduce-right')
    require('../modules/es.typed-array.reverse')
    require('../modules/es.typed-array.set')
    require('../modules/es.typed-array.slice')
    require('../modules/es.typed-array.some')
    require('../modules/es.typed-array.sort')
    require('../modules/es.typed-array.subarray')
    require('../modules/es.typed-array.to-locale-string')
    require('../modules/es.typed-array.to-string')
    require('../modules/es.unescape')
    require('../modules/es.weak-map')
    require('../modules/es.weak-set')
    require('../modules/web.dom-collections.for-each')
    require('../modules/web.dom-collections.iterator')
    require('../modules/web.immediate')
    require('../modules/web.queue-microtask')
    require('../modules/web.timers')
    require('../modules/web.url')
    require('../modules/web.url.to-json')
    require('../modules/web.url-search-params')

    module.exports = require('../internals/path')
  }, { '../internals/path': 120, '../modules/es.aggregate-error': 169, '../modules/es.array-buffer.constructor': 170, '../modules/es.array-buffer.is-view': 171, '../modules/es.array-buffer.slice': 172, '../modules/es.array.concat': 173, '../modules/es.array.copy-within': 174, '../modules/es.array.every': 175, '../modules/es.array.fill': 176, '../modules/es.array.filter': 177, '../modules/es.array.find': 179, '../modules/es.array.find-index': 178, '../modules/es.array.flat': 181, '../modules/es.array.flat-map': 180, '../modules/es.array.for-each': 182, '../modules/es.array.from': 183, '../modules/es.array.includes': 184, '../modules/es.array.index-of': 185, '../modules/es.array.is-array': 186, '../modules/es.array.iterator': 187, '../modules/es.array.join': 188, '../modules/es.array.last-index-of': 189, '../modules/es.array.map': 190, '../modules/es.array.of': 191, '../modules/es.array.reduce': 193, '../modules/es.array.reduce-right': 192, '../modules/es.array.reverse': 194, '../modules/es.array.slice': 195, '../modules/es.array.some': 196, '../modules/es.array.sort': 197, '../modules/es.array.species': 198, '../modules/es.array.splice': 199, '../modules/es.array.unscopables.flat': 201, '../modules/es.array.unscopables.flat-map': 200, '../modules/es.data-view': 202, '../modules/es.date.get-year': 203, '../modules/es.date.now': 204, '../modules/es.date.set-year': 205, '../modules/es.date.to-gmt-string': 206, '../modules/es.date.to-iso-string': 207, '../modules/es.date.to-json': 208, '../modules/es.date.to-primitive': 209, '../modules/es.date.to-string': 210, '../modules/es.escape': 211, '../modules/es.function.bind': 212, '../modules/es.function.has-instance': 213, '../modules/es.function.name': 214, '../modules/es.global-this': 215, '../modules/es.json.stringify': 216, '../modules/es.json.to-string-tag': 217, '../modules/es.map': 218, '../modules/es.math.acosh': 219, '../modules/es.math.asinh': 220, '../modules/es.math.atanh': 221, '../modules/es.math.cbrt': 222, '../modules/es.math.clz32': 223, '../modules/es.math.cosh': 224, '../modules/es.math.expm1': 225, '../modules/es.math.fround': 226, '../modules/es.math.hypot': 227, '../modules/es.math.imul': 228, '../modules/es.math.log10': 229, '../modules/es.math.log1p': 230, '../modules/es.math.log2': 231, '../modules/es.math.sign': 232, '../modules/es.math.sinh': 233, '../modules/es.math.tanh': 234, '../modules/es.math.to-string-tag': 235, '../modules/es.math.trunc': 236, '../modules/es.number.constructor': 237, '../modules/es.number.epsilon': 238, '../modules/es.number.is-finite': 239, '../modules/es.number.is-integer': 240, '../modules/es.number.is-nan': 241, '../modules/es.number.is-safe-integer': 242, '../modules/es.number.max-safe-integer': 243, '../modules/es.number.min-safe-integer': 244, '../modules/es.number.parse-float': 245, '../modules/es.number.parse-int': 246, '../modules/es.number.to-fixed': 247, '../modules/es.number.to-precision': 248, '../modules/es.object.assign': 249, '../modules/es.object.create': 250, '../modules/es.object.define-getter': 251, '../modules/es.object.define-properties': 252, '../modules/es.object.define-property': 253, '../modules/es.object.define-setter': 254, '../modules/es.object.entries': 255, '../modules/es.object.freeze': 256, '../modules/es.object.from-entries': 257, '../modules/es.object.get-own-property-descriptor': 258, '../modules/es.object.get-own-property-descriptors': 259, '../modules/es.object.get-own-property-names': 260, '../modules/es.object.get-prototype-of': 261, '../modules/es.object.is': 265, '../modules/es.object.is-extensible': 262, '../modules/es.object.is-frozen': 263, '../modules/es.object.is-sealed': 264, '../modules/es.object.keys': 266, '../modules/es.object.lookup-getter': 267, '../modules/es.object.lookup-setter': 268, '../modules/es.object.prevent-extensions': 269, '../modules/es.object.seal': 270, '../modules/es.object.set-prototype-of': 271, '../modules/es.object.to-string': 272, '../modules/es.object.values': 273, '../modules/es.parse-float': 274, '../modules/es.parse-int': 275, '../modules/es.promise': 279, '../modules/es.promise.all-settled': 276, '../modules/es.promise.any': 277, '../modules/es.promise.finally': 278, '../modules/es.reflect.apply': 280, '../modules/es.reflect.construct': 281, '../modules/es.reflect.define-property': 282, '../modules/es.reflect.delete-property': 283, '../modules/es.reflect.get': 286, '../modules/es.reflect.get-own-property-descriptor': 284, '../modules/es.reflect.get-prototype-of': 285, '../modules/es.reflect.has': 287, '../modules/es.reflect.is-extensible': 288, '../modules/es.reflect.own-keys': 289, '../modules/es.reflect.prevent-extensions': 290, '../modules/es.reflect.set': 292, '../modules/es.reflect.set-prototype-of': 291, '../modules/es.reflect.to-string-tag': 293, '../modules/es.regexp.constructor': 294, '../modules/es.regexp.dot-all': 295, '../modules/es.regexp.exec': 296, '../modules/es.regexp.flags': 297, '../modules/es.regexp.sticky': 298, '../modules/es.regexp.test': 299, '../modules/es.regexp.to-string': 300, '../modules/es.set': 301, '../modules/es.string.anchor': 302, '../modules/es.string.big': 303, '../modules/es.string.blink': 304, '../modules/es.string.bold': 305, '../modules/es.string.code-point-at': 306, '../modules/es.string.ends-with': 307, '../modules/es.string.fixed': 308, '../modules/es.string.fontcolor': 309, '../modules/es.string.fontsize': 310, '../modules/es.string.from-code-point': 311, '../modules/es.string.includes': 312, '../modules/es.string.italics': 313, '../modules/es.string.iterator': 314, '../modules/es.string.link': 315, '../modules/es.string.match': 317, '../modules/es.string.match-all': 316, '../modules/es.string.pad-end': 318, '../modules/es.string.pad-start': 319, '../modules/es.string.raw': 320, '../modules/es.string.repeat': 321, '../modules/es.string.replace': 323, '../modules/es.string.replace-all': 322, '../modules/es.string.search': 324, '../modules/es.string.small': 325, '../modules/es.string.split': 326, '../modules/es.string.starts-with': 327, '../modules/es.string.strike': 328, '../modules/es.string.sub': 329, '../modules/es.string.substr': 330, '../modules/es.string.sup': 331, '../modules/es.string.trim': 334, '../modules/es.string.trim-end': 332, '../modules/es.string.trim-start': 333, '../modules/es.symbol': 340, '../modules/es.symbol.async-iterator': 335, '../modules/es.symbol.description': 336, '../modules/es.symbol.has-instance': 337, '../modules/es.symbol.is-concat-spreadable': 338, '../modules/es.symbol.iterator': 339, '../modules/es.symbol.match': 342, '../modules/es.symbol.match-all': 341, '../modules/es.symbol.replace': 343, '../modules/es.symbol.search': 344, '../modules/es.symbol.species': 345, '../modules/es.symbol.split': 346, '../modules/es.symbol.to-primitive': 347, '../modules/es.symbol.to-string-tag': 348, '../modules/es.symbol.unscopables': 349, '../modules/es.typed-array.copy-within': 350, '../modules/es.typed-array.every': 351, '../modules/es.typed-array.fill': 352, '../modules/es.typed-array.filter': 353, '../modules/es.typed-array.find': 355, '../modules/es.typed-array.find-index': 354, '../modules/es.typed-array.float32-array': 356, '../modules/es.typed-array.float64-array': 357, '../modules/es.typed-array.for-each': 358, '../modules/es.typed-array.from': 359, '../modules/es.typed-array.includes': 360, '../modules/es.typed-array.index-of': 361, '../modules/es.typed-array.int16-array': 362, '../modules/es.typed-array.int32-array': 363, '../modules/es.typed-array.int8-array': 364, '../modules/es.typed-array.iterator': 365, '../modules/es.typed-array.join': 366, '../modules/es.typed-array.last-index-of': 367, '../modules/es.typed-array.map': 368, '../modules/es.typed-array.of': 369, '../modules/es.typed-array.reduce': 371, '../modules/es.typed-array.reduce-right': 370, '../modules/es.typed-array.reverse': 372, '../modules/es.typed-array.set': 373, '../modules/es.typed-array.slice': 374, '../modules/es.typed-array.some': 375, '../modules/es.typed-array.sort': 376, '../modules/es.typed-array.subarray': 377, '../modules/es.typed-array.to-locale-string': 378, '../modules/es.typed-array.to-string': 379, '../modules/es.typed-array.uint16-array': 380, '../modules/es.typed-array.uint32-array': 381, '../modules/es.typed-array.uint8-array': 382, '../modules/es.typed-array.uint8-clamped-array': 383, '../modules/es.unescape': 384, '../modules/es.weak-map': 385, '../modules/es.weak-set': 386, '../modules/web.dom-collections.for-each': 388, '../modules/web.dom-collections.iterator': 389, '../modules/web.immediate': 390, '../modules/web.queue-microtask': 391, '../modules/web.timers': 392, '../modules/web.url': 394, '../modules/web.url-search-params': 393, '../modules/web.url.to-json': 395 }],
  397: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.array.from.js')

    require('core-js/modules/es.array.slice.js')

    require('core-js/modules/es.function.name.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.compareArrays = exports.mergeArrays = exports.uniqueArray = exports.buildArrayOfReferences = exports.buildArray = void 0

    require('core-js/modules/es.array.filter.js')

    require('core-js/modules/es.array.index-of.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.includes.js')

    require('core-js/modules/es.string.includes.js')

    require('core-js/stable')

    const _objects = require('./objects')

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    /**
 * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
 * The length defines how long the array should be.
 * @function
 * @param {*} item - The item to be used for each array element
 * @param {number} length - The desired length of the array
 * @returns {Array.<*>}
 */
    const buildArray = function buildArray (item, length) {
      const arr = []

      while (arr.length < length) {
        const cloned = (0, _objects.cloneObject)(item)
        arr.push(cloned)
      }

      return arr
    }
    /**
 * Leverage buildArrayBase to generate an array filled with references to the provided item.
 * The length defines how long the array should be.
 * @function
 * @param {*} item - The item to be used for each array element
 * @param {number} length - The desired length of the array
 * @returns {Array.<*>}
 */

    exports.buildArray = buildArray

    const buildArrayOfReferences = function buildArrayOfReferences (item, length) {
      const arr = []

      while (arr.length < length) {
        arr.push(item)
      }

      return arr
    }
    /**
 * Remove duplicate values from an array.
 * @function uniqueArray
 * @param {Array} array - The array to make unique
 * @returns {Array}
 */

    exports.buildArrayOfReferences = buildArrayOfReferences

    const uniqueArray = function uniqueArray (array) {
      return array.filter(function (item, index) {
        return array.indexOf(item) === index
      })
    }
    /**
 * Take multiple arrays and then filter all these into one unique array.
 * @function
 * @param {...Array} arrays - Provide mulitple arrays to create one unique array
 * @returns {Array}
 */

    exports.uniqueArray = uniqueArray

    const mergeArrays = function mergeArrays () {
      for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
        arrays[_key] = arguments[_key]
      }

      return arrays.map(uniqueArray).reduce(function (merged, arr) {
        return [].concat(_toConsumableArray(merged), _toConsumableArray(arr.filter(function (attr) {
          return !merged.includes(attr)
        })))
      }, [])
    }
    /**
 * Store the comparison result for an element that may exist in either of compared arrays.
 * - value stores the element value from the arrays being compared
 * - results has the comparison results where first index (0) is result for first compared array
 *   and the second index (1) will be the result for the second compared array
 * @typedef {Object.<string, string|Array.<number>>} compareArrayResult
 * @property {string} value - The element value being compared
 * @property {Array.<Array.<string|number>>} keys - Keys in arrays associated with this value
 * @property {Array.<number>} result - The results in the order of the compared arrays
 * @example
 * // example of input and resulting output
 *
 * const arr1 = ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1']
 * const arr2 = ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
 *
 * // Taking the first element in both, then the value: 'match1' exists in both arrays
 * // compareArrayResult will be { value: 'match1', result: [0, 0] }
 * // First index of 0 indicates this value in the first array exists in the second array
 * // Second index of 0 indicates this value in the second array exists in the first array
 *
 * // Taking the second element in the first array, then the value: 'firstMismatch1' exists in only the first array
 * // compareArrayResult will be { value: 'firstMismatch1', result: [1, -1] }
 * // First index of 1 indicates this value in the first array might need to be added to the second array
 * // Second index of -1 indicates this value only exists in the first array
 *
 * // Taking the third element in the second array, then the value: 'secondMismatch1' exists in only the second array
 * // compareArrayResult will be { value: 'secondMismatch1', result: [-1, 1] }
 * // First index of -1 indicates this value only exists in the second array
 * // Second index of 1 indicates this value in the second array might need to be added to the first array

/**
 * Compare two Arrays and return the Object where the value for each property is as follows:
 * -1 to indicate val1 is less than val2
 * 0 to indicate both values are the equal
 * 1 to indicate val1 is greater than val2
 * The returned Object uses the element values as the property names
 * This functions works by first creating a concatenated array of all unique values. Then for each unique values,
 * convert to a string and use it as a new property name. Array filter each array checking if it has the unique value.
 * Use the lengths of these filtered arrays to compare. So if the first array has the value and the second one doesn't
 * the first length will be one or more and the second will be zero, if the both have the value then both will be one
 * or more.
 * @function
 * @example
 * // example of input and resulting output
 * compareArrays(
 *   ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
 *   ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
 * )
 * // unique array
 * ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1', 'secondMismatch1']
 * // result object
 * [
 *   {
 *     value: 'match1',
 *     keys: [[0], [0]],
 *     result: [0, 0]
 *   },
 *   {
 *     value: 'firstMismatch1',
 *     keys: [[1], []],
 *     result: [1, -1]
 *   },
 *   {
 *     value: 'match2',
 *     keys: [[2], [1]],
 *     result: [0, 0]
 *   },
 *   {
 *     value: 'firstMismatch2',
 *     keys: [[3], []],
 *     result: [1, -1]
 *   },
 *   {
 *     value: 'badMatch1',
 *     keys: [[4], [3, 4]],
 *     result: [0, 0]
 *   },
 *   {
 *     value: 'secondMismatch1',
 *     keys: [[], [2]],
 *     result: [-1, 1]
 *   }
 * ]
 *
 * @param {Array} arr1 - The first array to compare
 * @param {Array} arr2 - The second array to compare
 * @returns {Array.<module:arrayHelpers~compareArrayResult>}
 */

    exports.mergeArrays = mergeArrays

    const compareArrays = function compareArrays () {
      for (var _len2 = arguments.length, arrays = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arrays[_key2] = arguments[_key2]
      }

      return mergeArrays.apply(void 0, arrays).reduce(function (results, attr) {
        const attrType = _typeof(attr)

        const useArray = Array.isArray(attr)
        const keys = arrays.map(function (array) {
          return array.reduce(function (results, current, key) {
            const currentType = _typeof(current)

            if (attrType !== currentType) {
              return results
            }

            if (!(0, _objects.isObject)(attr)) {
              return current === attr ? [].concat(_toConsumableArray(results), [key]) : results
            }

            if (useArray !== Array.isArray(current)) {
              return results
            }

            const compareKeys = useArray ? compareArrays(attr, current) : compareArrays((0, _objects.objectKeys)(attr), (0, _objects.objectKeys)(current))
            return compareKeys.every(function (compare) {
              return compare.result.every(function (result) {
                return result === 0
              })
            })
              ? [].concat(_toConsumableArray(results), [key])
              : results
          }, [])
        })
        const arrayResults = keys.map(function (array) {
          return array.length ? 1 : -1
        })
        return [].concat(_toConsumableArray(results), [{
          value: attr,
          keys: keys,
          result: arrayResults.every(function (result) {
            return result === 1
          })
            ? arrayResults.map(function (result) {
              return 0
            })
            : arrayResults
        }])
      }, [])
    }

    exports.compareArrays = compareArrays
  }, { './objects': 400, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.filter.js': 177, 'core-js/modules/es.array.from.js': 183, 'core-js/modules/es.array.includes.js': 184, 'core-js/modules/es.array.index-of.js': 185, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.slice.js': 195, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.includes.js': 312, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  398: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.array.from.js')

    require('core-js/modules/es.function.name.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.queueTimeout = exports.queueManager = exports.delay = exports.preloadParams = exports.callWithParams = exports.pipe = exports.curry = void 0

    require('regenerator-runtime/runtime.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.slice.js')

    require('core-js/modules/es.array.splice.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.promise.js')

    require('core-js/stable')

    require('regenerator-runtime/runtime')

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    /**
 * Return a curried version of the passed function.
 * The returned function expects the same number of arguments minus the ones provided.
 * fn is the name of the function being curried.
 * @function
 * @param {Function} fn - Receives a function to be curried
 * @returns {Function|*}
 */
    const curry = function curry (fn) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key]
        }

        return args.length >= fn.length
          ? fn.apply(void 0, args)
          : function () {
            for (var _len2 = arguments.length, a = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              a[_key2] = arguments[_key2]
            }

            return curry(fn).apply(void 0, [].concat(args, a))
          }
      }
    }
    /**
 * Take one or more function with a single parameter and return value.
 * Pass a paramter and the value will be transformed by each function then returned.
 * @function
 * @param {...Function} fns - Takes a series of functions having the same parameter
 * @returns {*}
 */

    exports.curry = curry

    const pipe = function pipe () {
      for (var _len3 = arguments.length, fns = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fns[_key3] = arguments[_key3]
      }

      return function (x) {
        return fns.reduce(function (y, f) {
          return f(y)
        }, x)
      }
    }
    /**
 * Given a function, call with the correct number of paramters from an array of possible parameters.
 * @function
 * @param {Function} fn - The function to be called
 * @param {Array} params - Array of possible function parameters
 * @param {number} [minimum=2] - Minimumn number of parameters to use in the function
 * @returns {*}
 */

    exports.pipe = pipe

    const callWithParams = function callWithParams (fn) {
      const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []
      const minimum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2
      return fn.apply(void 0, _toConsumableArray(params.slice(0, fn.length || minimum)))
    }
    /**
 * The return function which takes the missing parameter in order to call the preloaded function.
 * @typedef {Function} callWithMissing
 * @param {*} missing - The missing parameter to be applied
 * @returns {*}
 */

    /**
 * Provide an array of parameters to be used with a function, allow the function to be called later
 * with the missing parameter.
 * @function
 * @param {Function} fn - The function to be called
 * @param {Array} params - The parameters to preload
 * @param {number} [unassignedParam=0] - Position of missing parameter (zero indexed)
 * @returns {module:functionHelpers~callWithMissing}
 */

    exports.callWithParams = callWithParams

    const preloadParams = function preloadParams (fn) {
      const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []
      const unassignedParam = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
      return function (missing) {
        params.splice(unassignedParam, 0, missing)
        return fn.apply(void 0, _toConsumableArray(params))
      }
    }
    /**
 * Provide a way to cancel a request or attach a resolve event.
 * @typedef {Object} delayHandler
 * @property {Promise} resolver
 * @property {Function} cancel
 */

    /**
 * Provide a timeout which returns a promise.
 * @function
 * @param {number} time - Delay in milliseconds
 * @returns {delayHandler}
 */

    exports.preloadParams = preloadParams

    const delay = function delay () {
      const time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0

      let cancel = function cancel () {
        return undefined
      }

      return {
        resolver: new Promise(function (resolve, reject) {
          if (isNaN(time)) {
            reject(new Error('Invalid delay: '.concat(time)))
          } else {
            const timeoutId = setTimeout(resolve, time, 'Delayed for: '.concat(time))

            cancel = function cancel () {
              clearTimeout(timeoutId)
              reject(new Error('Cancelled delay: '.concat(time)))
            }
          }
        }),
        cancel: cancel
      }
    }
    /**
 * Each time queue handle is called the passed function is added to the queue to be called when ready.
 * @typedef {Function} queueManagerHandle
 * @param {Function} fn - A function to enqueue
 * @param  {...*} args - Arguments to be passed to the function once it is ready
 * @returns {Promise}
 */

    /**
 * Manage functions to run sequentially.
 * @function
 * @param {Iterable} [queue=[]] - The iterable that can be used to store queued functions
 * @returns {module:functionHelpers~queueManagerHandle}
 */

    exports.delay = delay

    const queueManager = function queueManager () {
      const queue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      let isRunning = false
      return function (fn) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4]
        }

        const runNextItem = function runNextItem () {
          if (queue.length && !isRunning) {
            isRunning = true
            const toRun = queue.shift()
            toRun.generator.next(toRun.item)
          }

          return queue
        }

        return new Promise(function (resolve, reject) {
          const generator = /* #__PURE__ */regeneratorRuntime.mark(function _callee () {
            let item
            return regeneratorRuntime.wrap(function _callee$ (_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2
                    return

                  case 2:
                    item = _context.sent
                    return _context.abrupt('return', typeof item.fn === 'function' ? resolve(item.fn.apply(item, _toConsumableArray(item.args))) : reject(item))

                  case 4:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })()
          generator.next()
          queue.push({
            item: {
              fn: fn,
              args: args
            },
            generator: generator
          })
          runNextItem()
        }).then(function (resolvedResult) {
          isRunning = false
          runNextItem()
          return resolvedResult
        })
      }
    }
    /**
 * Run Timeout functions one after the otherin queue.
 * @typedef {Function} queueTimeoutHandle
 * @param {Function} fn - A callback function to be performed at some time in the future.
 * @param {number} time - The time in milliseconds to delay.
 * @param {...*} args - Arguments to be passed to the callback once it is implemented.
 * @returns {Promise}
 */

    /**
 * Manage functions to run sequentially with delays.
 * @function
 * @param {Iterable} [queue=[]] - The iterable that can be used to store queued functions
 * @returns {module:functionHelpers~queueTimeoutHandle}
 */

    exports.queueManager = queueManager

    const queueTimeout = function queueTimeout () {
      const queue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const manager = queueManager(queue)
      return function (fn) {
        const time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0

        for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
          args[_key5 - 2] = arguments[_key5]
        }

        return manager(function () {
          return delay(time).resolver.then(function () {
            return fn.apply(void 0, args)
          })
        })
      }
    }

    exports.queueTimeout = queueTimeout
  }, { 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.from.js': 183, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.slice.js': 195, 'core-js/modules/es.array.splice.js': 199, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.promise.js': 279, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396, 'regenerator-runtime/runtime': 423, 'regenerator-runtime/runtime.js': 423 }],
  399: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.compare = exports.randomInteger = exports.randomNumber = exports.getAbsoluteMin = exports.getAbsoluteMax = void 0

    require('core-js/stable')

    /**
 * Some number comparators and random number generators.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module numberHelpers
 */

    /**
 * Helper for returning the absolute max value
 * @function
 * @param {number} num1 - A number to compare
 * @param {number} num2 - Another number to be compared against
 * @returns {number}
 */
    const getAbsoluteMax = function getAbsoluteMax (num1, num2) {
      return Math.abs(num1) > Math.abs(num2) ? num1 : num2
    }
    /**
 * Helper for returning the absolute min value
 * @function
 * @param {number} num1 - A number to compare
 * @param {number} num2 - Another number to be compared against
 * @returns {number}
 */

    exports.getAbsoluteMax = getAbsoluteMax

    const getAbsoluteMin = function getAbsoluteMin (num1, num2) {
      return Math.abs(num1) < Math.abs(num2) ? num1 : num2
    }
    /**
 * Create a single random number within provided range. And with optional offset,
 * The distance between the result numbers can be adjusted with interval.
 * @function
 * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
 * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
 * @param {number} [interval=1] - Choose the distance between numbers (~5, ~10, ~15 would be 5 for interval, 1 for
 * offset, 2 for range)
 * @returns {number}
 */

    exports.getAbsoluteMin = getAbsoluteMin

    const randomNumber = function randomNumber (range) {
      const offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
      const interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1
      return (Math.random() * range + offset) * interval
    }
    /**
 * Create a single random integer within provide range. And with optional offset,
 * The distance between the result numbers can be adjusted with interval.
 * @function
 * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
 * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
 * @param {number} [interval=1] - Choose the distance between numbers (5, 10, 15 would be 5 for interval, 1 for
 * offset, 2 for range)
 * @returns {number}
 */

    exports.randomNumber = randomNumber

    const randomInteger = function randomInteger (range) {
      const offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
      const interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1
      return (Math.floor(Math.random() * range) + offset) * interval
    }
    /**
 * Compare two numbers and return:
 * -1 to indicate val1 is less than val2
 * 0 to indicate both values are the equal
 * 1 to indicate val1 is greater than val2
 * @function
 * @param {number} val1 - The first number to compare
 * @param {number} val2 - The second number to compare
 * @returns {number}
 */

    exports.randomInteger = randomInteger

    const compare = function compare (val1, val2) {
      return val1 === val2 ? 0 : val1 > val2 ? 1 : -1
    }

    exports.compare = compare
  }, { 'core-js/stable': 396 }],
  400: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.cloneObject = exports.mergeObjectsMutable = exports.mergeObjects = exports.mergeObjectsBase = exports.isCloneable = exports.isInstanceObject = exports.emptyObject = exports.reduceObject = exports.filterObject = exports.mapObject = exports.objectValues = exports.objectKeys = exports.isObject = exports.setAndReturnValue = exports.setValue = void 0

    require('core-js/modules/es.object.get-own-property-names.js')

    require('core-js/modules/es.parse-int.js')

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.filter.js')

    require('core-js/modules/es.array.includes.js')

    require('core-js/modules/es.function.name.js')

    require('core-js/modules/es.array.find.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/stable')

    const _functions = require('./functions')

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    /**
 * Set a value on an item, then return the item.
 * NOTE: Argument order designed for usage with pipe
 * @function
 * @param {string|number} key - The key on the item which will have its value set
 * @param {*} value - Any value to be applied to the key
 * @param {Object|Array} item - An object or array to be updated
 * @returns {Object|Array}
 */
    const setValue = function setValue (key, value, item) {
      item[key] = value
      return item
    }
    /**
 * Set a value on an item, then return the value
 * @function
 * @param {Object|Array} item - An object or array to be updated
 * @param {string|number} key - The key on the item which will have its value set
 * @param {*} value - Any value to be applied to the key
 * @returns {*}
 */

    exports.setValue = setValue

    const setAndReturnValue = function setAndReturnValue (item, key, value) {
      item[key] = value
      return value
    }

    exports.setAndReturnValue = setAndReturnValue

    const isObject = function isObject (object) {
      return _typeof(object) === 'object' && object !== null
    }
    /**
 * Get an array of keys from any object or array. Will return empty array when invalid or there are no keys.
 * Optional flag will include the inherited keys from prototype chain when set.
 * @param {Object|Array} object
 * @param {boolean} [includeInherited=false]
 * @returns {Array.<string|number>}
 */

    exports.isObject = isObject

    const objectKeys = function objectKeys (object) {
      const includeInherited = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

      if (typeof object !== 'function' && !isObject(object)) {
        return []
      }

      if (includeInherited) {
        const propNames = Object.getOwnPropertyNames(object)

        if (propNames.length) {
          return propNames
        }
      }

      const keys = []

      for (const key in object) {
        if (includeInherited || Object.prototype.hasOwnProperty.call(object, key)) {
          if (Array.isArray(object)) {
            keys.push(parseInt(key))
            continue
          }

          keys.push(key)
        }
      }

      return keys
    }
    /**
 * Get an array of values from any object or array. Will return empty array when invalid or there are no values.
 * Optional flag will include the inherited values from prototype chain when set.
 * @param {Object|Array} object
 * @param {boolean} [includeInherited=false]
 * @returns {Array}
 */

    exports.objectKeys = objectKeys

    const objectValues = function objectValues (object) {
      const includeInherited = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
      return objectKeys(object, includeInherited).map(function (key) {
        return object[key]
      })
    }
    /**
 * Function that produces a property of the new Object, taking three arguments
 * @callback mapCallback
 * @param {*} currentProperty - The current property being processed in the object.
 * @param {string} [currentIndex] - The property name of the current property being processed in the object.
 * @param {Object|Array} [object] - The object map was called upon.
 * @returns {*}
 */

    /**
 * This function is intended to replicate behaviour of the Array.map() function but for Objects.
 * If an array is passed in instead then it will perform standard map(). It is recommended to
 * always use the standard map() function when it is known that the object is actually an array.
 * @function
 * @param {Object|Array} obj - The Object (or Array) to be mapped
 * @param {module:objectHelpers~mapCallback|Function} fn - The function to be processed for each mapped property
 * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
 * @returns {Object|Array}
 */

    exports.objectValues = objectValues

    const mapObject = function mapObject (obj, fn) {
      const thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined
      return Array.isArray(obj)
        ? obj.map(fn, thisArg)
        : objectKeys(obj, true).reduce(function (newObj, curr) {
          return setValue(curr, (0, _functions.callWithParams)(fn.bind(thisArg), [obj[curr], curr, obj], 2), newObj)
        }, {})
    }
    /**
 * Function is a predicate, to test each property value of the object. Return true to keep the element, false
 * otherwise, taking three arguments
 * @callback filterCallback
 * @param {*} currentProperty - The current property being processed in the object.
 * @param {string} [currentIndex] - The property name of the current property being processed in the object.
 * @param {Object|Array} [object] - The object filter was called upon.
 * @returns {boolean}
 */

    /**
 * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
 * If an array is passed in instead then it will perform standard filter(). It is recommended to
 * always use the standard filter() function when it is known that the object is actually an array.
 * @function
 * @param {Object|Array} obj - The Object (or Array) to be filtered
 * @param {module:objectHelpers~filterCallback|Function} fn - The function to be processed for each filtered property
 * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
 * @returns {Object|Array}
 */

    exports.mapObject = mapObject

    const filterObject = function filterObject (obj, fn) {
      const thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined
      return Array.isArray(obj)
        ? obj.filter(fn, thisArg)
        : objectKeys(obj, true).reduce(function (newObj, curr) {
          if ((0, _functions.callWithParams)(fn.bind(thisArg), [obj[curr], curr, obj], 2)) {
            newObj[curr] = obj[curr]
          } else {
            delete newObj[curr]
          }

          return newObj
        }, {})
    }
    /**
 * Function to execute on each property in the object, taking four arguments
 * @callback reduceCallback
 * @param {*} [accumulator={}] - The accumulator accumulates the callback's return values; it is the accumulated
 * value previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
 * @param {*} [currentProperty={}] - The current property being processed in the object.
 * @param {string} [currentIndex=0] - The index of the current element being processed in the array. Starts at index
 * 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {Object|Array} [object={}] - The object reduce was called upon.
 * @returns {*}
 */

    /**
 * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
 * If an array is passed in instead then it will perform standard reduce(). It is recommended to
 * always use the standard reduce() function when it is known that the object is actually an array.
 * @function
 * @param {Object|Array} obj - The Object (or Array) to be filtered
 * @param {module:objectHelpers~reduceCallback|Function} fn - The function to be processed for each filtered property
 * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the
 * callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty
 * array without an initial value is an error.
 * @returns {Object|Array}
 */

    exports.filterObject = filterObject

    const reduceObject = function reduceObject (obj, fn) {
      const initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : obj[objectKeys(obj)[0]] || obj[0]
      return Array.isArray(obj)
        ? obj.reduce(fn, initialValue)
        : objectKeys(obj, true).reduce(function (newObj, curr) {
          return (0, _functions.callWithParams)(fn, [newObj, obj[curr], curr, obj], 2)
        }, initialValue)
    }
    /**
 * Helper function for testing if the item is an Object or Array that does not have any properties
 * @function
 * @param {Object|Array} item - Object or Array to test
 * @returns {boolean}
 */

    exports.reduceObject = reduceObject

    const emptyObject = function emptyObject (item) {
      return (typeof item === 'function' || isObject(item)) && !objectKeys(item).length
    }
    /**
 * Check if the current object has inherited properties.
 * @param {Object|Array} object
 * @returns {boolean}
 */

    exports.emptyObject = emptyObject

    const isInstanceObject = function isInstanceObject (object) {
      if (typeof object !== 'function' && !isObject(object)) {
        return false
      }

      if (!['Array', 'Function', 'Object'].includes(object.constructor.name)) {
        return true
      }

      return object.constructor.name !== 'Array' && objectKeys(object, true).length > objectKeys(object).length
    }
    /**
 * Determine if the value is a reference instance
 * @function
 * @param {Array|Object|*} value
 * @returns {boolean}
 */

    exports.isInstanceObject = isInstanceObject

    const isCloneable = function isCloneable (value) {
      return _typeof(value) === 'object' && value !== null && !isInstanceObject(value)
    }
    /**
 * Function that takes one or more objects and combines them into one.
 * @typedef {Function} module:objects~mergeObjectsCallback
 * @param {...Object} objects - Provide a list of objects which will be merged starting from the end up into the first
 * @returns {*}
 */

    /**
 * Perform a deep merge of objects. This will return a function that will combine all objects and sub-objects.
 * Objects having the same attributes will overwrite from last object to first.
 * @function
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=100]
 * @param {Iterable} [options.map=[]]
 * @param {bool} [options.useClone=false]
 * @returns {module:objects~mergeObjectsCallback}
 */

    exports.isCloneable = isCloneable

    const mergeObjectsBase = function mergeObjectsBase () {
      const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      const _ref$mapLimit = _ref.mapLimit
      const mapLimit = _ref$mapLimit === void 0 ? 50000 : _ref$mapLimit
      const _ref$map = _ref.map
      const map = _ref$map === void 0 ? [] : _ref$map
      const _ref$useClone = _ref.useClone
      const useClone = _ref$useClone === void 0 ? false : _ref$useClone

      return function () {
        for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
          objects[_key] = arguments[_key]
        }

        const firstObject = objects.shift()

        if (objects.length < 1) {
          return firstObject
        }

        return objects.reduce(function (newObj, arg) {
          if (!arg) {
            return newObj
          }

          map.push({
            source: arg,
            object: newObj
          })

          if (map.length > mapLimit) {
            map.shift()
          }

          return reduceObject(arg, function (returnObj, value, key) {
            if (isCloneable(value)) {
              let objectValue = newObj[key]
              const exists = map.find(function (existing) {
                return existing.source === value
              })

              if (exists) {
                return setValue(key, exists.object, returnObj)
              }

              if (!isCloneable(objectValue) || !objectValue) {
                objectValue = useClone ? Array.isArray(value) ? [] : {} : value
              }

              if (isCloneable(objectValue)) {
                return setValue(key, mergeObjectsBase({
                  mapLimit: mapLimit,
                  map: map,
                  useClone: useClone
                })(objectValue, value), returnObj)
              }

              map.push({
                source: value,
                object: objectValue
              })

              if (map.length > mapLimit) {
                map.shift()
              }
            }

            return setValue(key, value, returnObj)
          }, newObj)
        }, firstObject || {})
      }
    }
    /**
 * Uses mergeObjectsBase deep merge objects and arrays, merge by value.
 * @function
 * @see {@link module:objects~mergeObjectsCallback}
 * @param {...Object} objects - Provide a list of objects which will be merged starting from the end up into the first
 * @returns {*}
 */

    exports.mergeObjectsBase = mergeObjectsBase
    const mergeObjects = mergeObjectsBase({
      useClone: true
    })
    /**
 * Uses mergeObjectsBase deep merge objects and arrays, merge by reference.
 * @function
 * @see {@link module:objects~mergeObjectsCallback}
 * @param {...Object} objects - Provide a list of objects which will be merged starting from the end up into the first
 * @returns {*}
 */

    exports.mergeObjects = mergeObjects
    const mergeObjectsMutable = mergeObjectsBase()
    /**
 * Clone objects for manipulation without data corruption, returns a copy of the provided object.
 * @function
 * @param {Object} object - The original object that is being cloned
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=100]
 * @param {Iterable} [options.map=[]]
 * @returns {Object}
 */

    exports.mergeObjectsMutable = mergeObjectsMutable

    const cloneObject = function cloneObject (object) {
      const _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      const _ref2$mapLimit = _ref2.mapLimit
      const mapLimit = _ref2$mapLimit === void 0 ? 100 : _ref2$mapLimit
      const _ref2$map = _ref2.map
      const map = _ref2$map === void 0 ? [] : _ref2$map

      return mergeObjectsBase({
        mapLimit: mapLimit,
        map: map,
        useClone: true
      })(Array.isArray(object) ? [] : {}, object)
    }

    exports.cloneObject = cloneObject
  }, { './functions': 398, 'core-js/modules/es.array.filter.js': 177, 'core-js/modules/es.array.find.js': 179, 'core-js/modules/es.array.includes.js': 184, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.get-own-property-names.js': 260, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.parse-int.js': 275, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  401: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.array.from.js')

    require('core-js/modules/es.array.slice.js')

    require('core-js/modules/es.function.name.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.describeObjectMap = exports.sameDescriptor = exports.compareDescriptor = exports.describeObject = exports.assignDescriptor = exports.describeObjectDetail = void 0

    require('core-js/modules/web.dom-collections.for-each.js')

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.find.js')

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.array.filter.js')

    require('core-js/modules/es.array.includes.js')

    require('core-js/modules/es.string.includes.js')

    require('core-js/modules/es.array.find-index.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/stable')

    const _arrays = require('../arrays')

    const _objects = require('../objects')

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    /**
 * Trace an object's attribute and provide details about it.
 * @function
 * @param {*} value
 * @param {string|number} [key=0]
 * @param {number} [index=0]
 * @returns {module:descriptorSamples~descriptorDetail}
 */
    const describeObjectDetail = function describeObjectDetail (value) {
      const key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
      const index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0

      const type = _typeof(value)

      return {
        index: index,
        key: key,
        type: [type],
        value: [value],
        nullable: value === null,
        optional: false,
        circular: false,
        isReference: (0, _objects.isCloneable)(value) && !(0, _objects.emptyObject)(value),
        isInstance: (0, _objects.isInstanceObject)(value),
        arrayReference: null,
        objectReference: null
      }
    }
    /**
 * Get a new copy of an existing Descriptor Detail
 * @param {module:descriptorSamples~descriptorDetail} originalDetail
 * @returns {module:descriptorSamples~descriptorDetail}
 */

    exports.describeObjectDetail = describeObjectDetail

    const cloneDescriptorDetail = function cloneDescriptorDetail (originalDetail) {
      const copyDetail = {};
      (0, _objects.objectKeys)(originalDetail).forEach(function (key) {
        copyDetail[key] = Array.isArray(originalDetail[key])
          ? originalDetail[key].map(function (value) {
            return value
          })
          : originalDetail[key]
      })
      return copyDetail
    }
    /**
 * Make a copy of an object descriptor so that the original will not be mutated.
 * @function
 * @param {module:descriptorSamples~descriptor} originalMap
 * @returns {module:descriptorSamples~descriptor}
 */

    const cloneDescriptor = function cloneDescriptor (originalMap) {
      const copyMap = {}
      copyMap.index = originalMap.index || 0
      copyMap.details = originalMap.details.map(cloneDescriptorDetail)
      copyMap.length = originalMap.length
      copyMap.keys = originalMap.keys.map(function (key) {
        return key
      })
      copyMap.references = originalMap.references.map(function (reference) {
        return reference
      })
      copyMap.isArray = originalMap.isArray
      copyMap.complete = originalMap.complete
      return copyMap
    }
    /**
 * Assign properties from other details onto an existing detail.
 * @param {module:descriptorSamples~descriptorDetail} originalDetail
 * @param  {...module:descriptorSamples~descriptorDetail} details
 * @returns {module:descriptorSamples~descriptorDetail}
 */

    const assignDescriptorDetail = function assignDescriptorDetail (originalDetail) {
      for (var _len = arguments.length, details = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        details[_key - 1] = arguments[_key]
      }

      return details.reduce(function (existingDetail, newDetail) {
        existingDetail.type = (0, _arrays.uniqueArray)([].concat(_toConsumableArray(existingDetail.type), _toConsumableArray(newDetail.type)))
        existingDetail.value = (0, _arrays.uniqueArray)([].concat(_toConsumableArray(existingDetail.value), _toConsumableArray(newDetail.value)))
        existingDetail.nullable = existingDetail.nullable || newDetail.nullable
        existingDetail.optional = existingDetail.optional || newDetail.optional
        existingDetail.circular = existingDetail.circular || newDetail.circular
        existingDetail.isReference = existingDetail.isReference || newDetail.isReference
        existingDetail.isInstance = existingDetail.isInstance || newDetail.isInstance
        existingDetail.arrayReference = [existingDetail.arrayReference, newDetail.arrayReference].find(function (ref) {
          return typeof ref === 'number'
        })
        existingDetail.objectReference = [existingDetail.objectReference, newDetail.objectReference].find(function (ref) {
          return typeof ref === 'number'
        })
        existingDetail.arrayReference = typeof existingDetail.arrayReference === 'undefined' ? null : existingDetail.arrayReference
        existingDetail.objectReference = typeof existingDetail.objectReference === 'undefined' ? null : existingDetail.objectReference
        return existingDetail
      }, cloneDescriptorDetail(originalDetail))
    }
    /**
 * Apply one or more descriptors to an existing descriptor so that they represent a merged version of the descriptors.
 * @function
 * @param {module:descriptorSamples~descriptor} originalMap
 * @param  {...module:descriptorSamples~descriptor} descriptors
 * @returns {module:descriptorSamples~descriptor}
 */

    const assignDescriptor = function assignDescriptor (originalMap) {
      for (var _len2 = arguments.length, descriptors = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        descriptors[_key2 - 1] = arguments[_key2]
      }

      return descriptors.reduce(function (assignedDescriptor, descriptor) {
        const detailsDiff = (0, _arrays.compareArrays)(assignedDescriptor.keys, descriptor.keys)
        detailsDiff.forEach(function (diff) {
          const existingDetail = assignedDescriptor.details.find(function (detail) {
            return detail.key === diff.value
          })
          const newDetail = descriptor.details.find(function (detail) {
            return detail.key === diff.value
          })

          if (diff.result.every(function (result) {
            return result === 0
          })) {
            assignedDescriptor.details[existingDetail.index] = assignDescriptorDetail(existingDetail, newDetail)
            return assignedDescriptor
          }

          const useDetail = diff[0] > 0 ? existingDetail : newDetail

          if (!useDetail) {
            assignedDescriptor.details[existingDetail.index].optional = true
            return assignedDescriptor
          }

          const useIndex = diff[0] > 0 ? useDetail.index : assignedDescriptor.length
          assignedDescriptor.details[useIndex] = Object.assign({}, useDetail, {
            index: useIndex,
            optional: true
          })
          assignedDescriptor.length = assignedDescriptor.length < assignedDescriptor.details.length ? assignedDescriptor.details.length : assignedDescriptor.length
          return assignedDescriptor
        })
        assignedDescriptor.keys = (0, _arrays.uniqueArray)(assignedDescriptor.details.map(function (detail) {
          return detail.key
        }))
        assignedDescriptor.references = (0, _arrays.uniqueArray)(assignedDescriptor.details.filter(function (detail) {
          return detail.isReference
        }).map(function (detail) {
          return detail.index
        }))
        assignedDescriptor.isArray = assignedDescriptor.length
          ? assignedDescriptor.details.every(function (detail) {
            return typeof detail.key === 'number'
          })
          : assignedDescriptor.isArray
        assignedDescriptor.complete = !assignedDescriptor.references.length || assignedDescriptor.complete || descriptor.complete
        return assignedDescriptor
      }, cloneDescriptor(originalMap))
    }
    /**
 * Trace an object and return the descriptor which defines the object's structure and attributes.
 * @function
 * @param {Object} object
 * @returns {module:descriptorSamples~descriptor}
 */

    exports.assignDescriptor = assignDescriptor

    const describeObject = function describeObject (object) {
      const descriptor = {
        index: 0,
        details: [],
        length: 0,
        keys: [],
        references: [],
        isArray: false,
        complete: false
      }
      const keys = (0, _objects.objectKeys)(object)

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i]
        const newDetail = describeObjectDetail(object[key], key, descriptor.length++)

        if (typeof key === 'number' && descriptor.details.length) {
          descriptor.details[0] = assignDescriptorDetail(descriptor.details[0], newDetail)
          descriptor.keys = [0]

          if (newDetail.isReference) {
            descriptor.references = [0]
          }

          continue
        }

        descriptor.details.push(newDetail)
        descriptor.keys.push(newDetail.key)

        if (newDetail.isReference) {
          descriptor.references.push(newDetail.index)
        }
      }

      descriptor.isArray = Array.isArray(object)
      descriptor.complete = !descriptor.references.length
      return descriptor
    }
    /**
 * Check if two descriptors are the same or similar in that they have similar keys and the associated types are the same.
 * @function
 * @param {module:descriptorSamples~descriptor} descriptor1
 * @param {module:descriptorSamples~descriptor} descriptor2
 * @returns {boolean}
 */

    exports.describeObject = describeObject

    const compareDescriptor = function compareDescriptor (descriptor1, descriptor2) {
      if (descriptor1.isArray !== descriptor2.isArray) {
        return false
      }

      if (descriptor1.length === 0 || descriptor2.length === 0) {
        return descriptor1.length === descriptor2.length
      }

      const smallerDescriptor = descriptor1.length <= descriptor2.length ? descriptor1 : descriptor2
      const largerDescriptor = descriptor2.length >= descriptor1.length ? descriptor2 : descriptor1
      return smallerDescriptor.keys.every(function (key) {
        return largerDescriptor.keys.includes(key)
      })
        ? smallerDescriptor.details.every(function (detail) {
          return detail.type.some(function (type) {
            return largerDescriptor.details.find(function (foundDetail) {
              return foundDetail.key === detail.key
            }).type.includes(type)
          })
        })
        : false
    }

    exports.compareDescriptor = compareDescriptor

    const sameDescriptor = function sameDescriptor (descriptor1, descriptor2) {
      return descriptor1.details.every(function (detail, index) {
        return detail.value.some(function (dVal) {
          return descriptor2.details[index].value.includes(dVal)
        })
      })
    }
    /**
 * Find the index of the next descriptorDetail to build a resource for.
 * @param {module:descriptorSamples~descriptor} descriptor
 * @param {number} currentReference
 * @returns {number|undefined}
 */

    exports.sameDescriptor = sameDescriptor

    const nextReference = function nextReference (descriptor, currentReference) {
      return descriptor.references.find(function (nextRef) {
        if (nextRef <= currentReference) {
          return false
        }

        const val = descriptor.details[nextRef].value[descriptor.details[nextRef].value.length - 1]

        if (_typeof(val) !== 'object' || val === null || typeof val === 'undefined' || descriptor.details[nextRef].circular || descriptor.details[nextRef].isInstance) {
          return false
        }

        return !!(0, _objects.objectKeys)(val).length
      })
    }
    /**
 * Check if the descriptors references have all been built and set complete to true if they have.
 * @param {module:descriptorSamples~descriptor} descriptor
 * @returns {module:descriptorSamples~descriptor}
 */

    const checkDescriptorComplete = function checkDescriptorComplete (descriptor) {
      return (0, _objects.setValue)('complete', descriptor.references.every(function (refId) {
        return [descriptor.details[refId].arrayReference, descriptor.details[refId].objectReference].some(function (ref) {
          return typeof ref === 'number'
        })
      }), descriptor)
    }
    /**
 * Check if we should clear the values on this descriptor
 * @param {module:descriptorSamples~descriptor} descriptor
 * @param {boolean} [keepValues=false]
 * @returns {module:descriptorSamples~descriptor}
 */

    const checkClearValues = function checkClearValues (descriptor) {
      const keepValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
      return (0, _objects.setValue)('details', descriptor.complete && !keepValues
        ? descriptor.details.map(function (detail) {
          return (0, _objects.setValue)('value', [], detail)
        })
        : descriptor.details, descriptor)
    }
    /**
 * Trace out the entire object including nested objects.
 * @function
 * @param {Object|Array} object
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=1000000000]
 * @param {number} [options.depthLimit=-1]
 * @param {boolean} [options.keepValues=false]
 * @returns {module:descriptorSamples~descriptorMap}
 */

    const describeObjectMap = function describeObjectMap (object) {
      const _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      const _ref$mapLimit = _ref.mapLimit
      const mapLimit = _ref$mapLimit === void 0 ? 1000000000 : _ref$mapLimit
      const _ref$depthLimit = _ref.depthLimit
      const depthLimit = _ref$depthLimit === void 0 ? -1 : _ref$depthLimit
      const _ref$keepValues = _ref.keepValues
      const keepValues = _ref$keepValues === void 0 ? false : _ref$keepValues

      const descriptorMap = [describeObject(object)]
      descriptorMap[0].index = 0

      const describeReferences = function describeReferences (descriptor, currentDetail) {
        let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1
        const returnCallback = arguments.length > 3 && arguments[3] !== undefined
          ? arguments[3]
          : function (returnMap) {
            return returnMap
          }
        let index = descriptorMap.length
        const nextRef = currentDetail ? nextReference(descriptor, currentDetail.index) : undefined
        const nextDetail = typeof nextRef !== 'undefined' ? descriptor.details[nextRef] : null

        if (currentDetail) {
          const vals = descriptor.isArray ? currentDetail.value : [currentDetail.value[currentDetail.value.length - 1]]
          vals.forEach(function (val) {
            const tempDescriptor = describeObject(val)
            const existingDescriptorIndex = descriptorMap.findIndex(function (existingDescriptor) {
              return compareDescriptor(tempDescriptor, existingDescriptor)
            })

            if (existingDescriptorIndex >= 0) {
              index = existingDescriptorIndex

              if (tempDescriptor.length && sameDescriptor(tempDescriptor, descriptorMap[existingDescriptorIndex])) {
                currentDetail.circular = true
                descriptor.details[currentDetail.index] = currentDetail
              }
            }

            if (index >= mapLimit) {
              return descriptorMap
            }

            if (limit === 0) {
              return descriptorMap
            }

            if (tempDescriptor.isArray) {
              let _currentDetail$arrayR

              index = (_currentDetail$arrayR = currentDetail.arrayReference) !== null && _currentDetail$arrayR !== void 0 ? _currentDetail$arrayR : index
              descriptor.details[currentDetail.index].arrayReference = index
            } else {
              let _currentDetail$object

              index = (_currentDetail$object = currentDetail.objectReference) !== null && _currentDetail$object !== void 0 ? _currentDetail$object : index
              descriptor.details[currentDetail.index].objectReference = index
            }

            tempDescriptor.index = index

            if (existingDescriptorIndex < 0) {
              descriptorMap[index] = descriptorMap[index] ? assignDescriptor(descriptorMap[index], tempDescriptor) : tempDescriptor
            }

            descriptorMap[descriptor.index] = assignDescriptor(descriptorMap[descriptor.index], descriptor)
            currentDetail = descriptorMap[descriptor.index].details.find(function (detail) {
              return detail.key === currentDetail.key
            })

            if (!currentDetail.circular) {
              const newReference = nextReference(tempDescriptor, -1)
              const newDetail = typeof newReference !== 'undefined' ? tempDescriptor.details[newReference] : null
              return describeReferences(tempDescriptor, newDetail, --limit, function (returnMap) {
                return describeReferences(descriptor, nextDetail, --limit)
              })
            }
          })
        }

        descriptorMap[descriptor.index] = assignDescriptor(descriptorMap[descriptor.index], checkDescriptorComplete(descriptor))
        descriptorMap[descriptor.index] = checkClearValues(descriptorMap[descriptor.index], keepValues)
        return nextDetail ? describeReferences(descriptor, nextDetail, --limit) : returnCallback(descriptorMap)
      }

      const descriptor = descriptorMap[0]
      const currentReference = nextReference(descriptor, -1)

      if (typeof currentReference === 'undefined') {
        descriptorMap[0] = assignDescriptor(descriptorMap[0], checkDescriptorComplete(descriptor, keepValues))
        descriptorMap[0] = checkClearValues(descriptorMap[0], keepValues)
        return descriptorMap
      }

      return describeReferences(descriptor, descriptor.details[currentReference], depthLimit)
    }

    exports.describeObjectMap = describeObjectMap
  }, { '../arrays': 397, '../objects': 400, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.filter.js': 177, 'core-js/modules/es.array.find-index.js': 178, 'core-js/modules/es.array.find.js': 179, 'core-js/modules/es.array.from.js': 183, 'core-js/modules/es.array.includes.js': 184, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.slice.js': 195, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.includes.js': 312, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.for-each.js': 388, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  402: [function (require, module, exports) {
    (function (global) {
      (function () {
        'use strict'

        function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

        require('core-js/modules/es.array.iterator.js')

        require('core-js/modules/es.object.to-string.js')

        require('core-js/modules/es.string.iterator.js')

        require('core-js/modules/es.weak-map.js')

        require('core-js/modules/esnext.weak-map.delete-all.js')

        require('core-js/modules/web.dom-collections.iterator.js')

        require('core-js/modules/es.object.get-own-property-descriptor.js')

        require('core-js/modules/es.symbol.js')

        require('core-js/modules/es.symbol.description.js')

        require('core-js/modules/es.symbol.iterator.js')

        Object.defineProperty(exports, '__esModule', {
          value: true
        })
        exports.default = void 0

        require('core-js/modules/es.object.assign.js')

        require('core-js/stable')

        const arrayHelpers = _interopRequireWildcard(require('./helpers/arrays'))

        const descriptors = _interopRequireWildcard(require('./helpers/objects/descriptors'))

        const functionHelpers = _interopRequireWildcard(require('./helpers/functions'))

        const numberHelpers = _interopRequireWildcard(require('./helpers/numbers'))

        const objectHelpers = _interopRequireWildcard(require('./helpers/objects'))

        function _getRequireWildcardCache (nodeInterop) { if (typeof WeakMap !== 'function') return null; const cacheBabelInterop = new WeakMap(); const cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop })(nodeInterop) }

        function _interopRequireWildcard (obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

        /**
 * All of the functionalHelpers system functions for stringing together functions and simplifying logic.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module functionalHelpers
 */

        /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
        const root = void 0 || window || global || {}
        /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

        const previousFunctionalHelpers = root.functionalHelpers || {}
        /**
   * All methods exported from this module are encapsulated within functionalHelpers.
   * @typedef {module:functionalHelpers|module:arrayHelpers|module:functionHelpers|module:numberHelpers|module:objectHelpers} functionalHelpers
   */

        const functionalHelpers = {}
        root.functionalHelpers = functionalHelpers
        /**
   * Return a reference to this library while preserving the original same-named library
   * @function
   * @returns {module:functionalHelpers~functionalHelpers}
   */

        const noConflict = function noConflict () {
          root.functionalHelpers = previousFunctionalHelpers
          return functionalHelpers
        }

        functionalHelpers.noConflict = noConflict

        const _default = Object.assign(functionalHelpers, arrayHelpers, descriptors, functionHelpers, numberHelpers, objectHelpers)

        exports.default = _default
      }).call(this)
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, { './helpers/arrays': 397, './helpers/functions': 398, './helpers/numbers': 399, './helpers/objects': 400, './helpers/objects/descriptors': 401, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-own-property-descriptor.js': 258, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/es.weak-map.js': 385, 'core-js/modules/esnext.weak-map.delete-all.js': 387, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  403: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/es.weak-map.js')

    require('core-js/modules/esnext.weak-map.delete-all.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.object.get-own-property-descriptor.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.symbol.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0

    require('core-js/modules/es.object.assign.js')

    require('core-js/stable')

    const Linker = _interopRequireWildcard(require('./classes/Linker'))

    const LinkedList = _interopRequireWildcard(require('./classes/LinkedList'))

    const TreeLinker = _interopRequireWildcard(require('./classes/TreeLinker'))

    const LinkedTreeList = _interopRequireWildcard(require('./classes/LinkedTreeList'))

    function _getRequireWildcardCache (nodeInterop) { if (typeof WeakMap !== 'function') return null; const cacheBabelInterop = new WeakMap(); const cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop })(nodeInterop) }

    function _interopRequireWildcard (obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

    /**
 * All of the JSON DOM system functions for creating JSON components.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module collections
 */
    const _default = Object.assign(Linker, LinkedList, TreeLinker, LinkedTreeList)

    exports.default = _default
  }, { './classes/LinkedList': 404, './classes/LinkedTreeList': 405, './classes/Linker': 406, './classes/TreeLinker': 407, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-own-property-descriptor.js': 258, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/es.weak-map.js': 385, 'core-js/modules/esnext.weak-map.delete-all.js': 387, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  404: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.LinkedList = void 0

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    const _Linker = require('./Linker')

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    /**
 *
 */
    const LinkedList = /* #__PURE__ */(function () {
      /**
   *
   * @param LinkerClass
   * @param ListClass
   */
      function LinkedList () {
        const LinkerClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _Linker.Linker
        const ListClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LinkedList

        _classCallCheck(this, LinkedList)

        this.LinkerClass = LinkerClass
        this.ListClass = ListClass
        this.innerList = new this.LinkerClass()
      }
      /**
   *
   * @returns {Linker}
   */

      _createClass(LinkedList, [{
        key: 'first',
        get: function get () {
          let head = this.innerList
          let prev = head.prev

          while (prev !== null) {
            head = prev
            prev = head.prev
          }

          return head
        }
        /**
     *
     * @returns {Linker}
     */

      }, {
        key: 'last',
        get: function get () {
          let tail = this.innerList
          let next = tail.next

          while (next !== null) {
            tail = next
            next = tail.next
          }

          return tail
        }
        /**
     *
     * @returns {number}
     */

      }, {
        key: 'length',
        get: function get () {
          let current = this.first
          let length = 0

          while (current !== null) {
            ++length
            current = current.next
          }

          return length
        }
        /**
     *
     * @param node
     */

      }, {
        key: 'append',
        value: function append (node) {
          this.last.after(node)
          return this.first
        }
        /**
     *
     * @param node
     */

      }, {
        key: 'prepend',
        value: function prepend (node) {
          return this.first.before(node)
        }
        /**
     *
     * @param index
     * @returns {null|*}
     */

      }, {
        key: 'item',
        value: function item (index) {
          if (index >= 0) {
            let _current = this.first

            let _currentIndex = -1

            while (++_currentIndex < index && _current !== null) {
              _current = _current.next
            }

            return _currentIndex === index ? _current : null
          }

          let current = this.last
          let currentIndex = this.length
          const calculatedIndex = this.length + index

          if (calculatedIndex < 0) {
            return null
          }

          while (--currentIndex > calculatedIndex && current !== null) {
            current = current.prev
          }

          return currentIndex === calculatedIndex ? current : null
        }
        /**
     *
     * @param callback
     */

      }, {
        key: 'forEach',
        value: function forEach (callback) {
          let current = this.first

          while (current !== null) {
            callback(current)
            current = current.next
          }
        }
        /**
     *
     * @returns {{next: (function(): {value: (*|null), done: boolean})}}
     */

      }, {
        key: Symbol.iterator,
        value: function value () {
          let current = this.first
          return {
            next: function next () {
              const result = {
                value: current,
                done: !current
              }
              current = current ? current.next : null
              return result
            }
          }
        }
      }])

      return LinkedList
    }())
    /**
 *
 * @param values
 * @param LinkerClass
 * @param ListClass
 * @returns {LinkedList}
 */

    exports.LinkedList = LinkedList

    LinkedList.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Linker.Linker
      const ListClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LinkedList
      const list = new ListClass(LinkerClass)
      list.innerList = list.LinkerClass.fromArray(values, LinkerClass)
      return list
    }
  }, { './Linker': 406, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  405: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.reflect.construct.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.LinkedTreeList = void 0

    require('core-js/modules/es.array.index-of.js')

    require('core-js/modules/es.array.from.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/es.object.set-prototype-of.js')

    require('core-js/modules/es.object.get-prototype-of.js')

    const _LinkedList2 = require('./LinkedList')

    const _TreeLinker = require('./TreeLinker')

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const LinkedTreeList = /* #__PURE__ */(function (_LinkedList) {
      _inherits(LinkedTreeList, _LinkedList)

      const _super = _createSuper(LinkedTreeList)

      function LinkedTreeList () {
        const LinkerClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _TreeLinker.TreeLinker
        const ListClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LinkedTreeList

        _classCallCheck(this, LinkedTreeList)

        return _super.call(this, LinkerClass, ListClass)
      }

      _createClass(LinkedTreeList, [{
        key: 'parent',
        get: function get () {
          return this.first.parent
        },
        set: function set (parent) {
          if (parent === void 0) {
            parent = null
          }

          let current = this.first

          while (current !== null) {
            current.parent = parent
            current = current.next
          }

          if (parent) {
            parent.children = this
          }
        }
      }, {
        key: 'rootParent',
        get: function get () {
          let current = this.first
          let parent = this.first.parent

          while (parent !== null) {
            current = parent
            parent = current.parent
          }

          return current
        }
      }, {
        key: 'setChildren',
        value: function setChildren (item) {
          const children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

          if (Array.from(this).indexOf(item) < 0) {
            console.error('item is not a child of this')
          }

          children.parent = item
        }
      }])

      return LinkedTreeList
    }(_LinkedList2.LinkedList))
    /**
 *
 * @param values
 * @param LinkerClass
 * @param ListClass
 * @returns {LinkedList}
 */

    exports.LinkedTreeList = LinkedTreeList

    LinkedTreeList.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _TreeLinker.TreeLinker
      const ListClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LinkedTreeList
      const list = new ListClass(LinkerClass)
      list.innerList = list.LinkerClass.fromArray(values, LinkerClass)
      return list
    }
  }, { './LinkedList': 404, './TreeLinker': 407, 'core-js/modules/es.array.from.js': 183, 'core-js/modules/es.array.index-of.js': 185, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.get-prototype-of.js': 261, 'core-js/modules/es.object.set-prototype-of.js': 271, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.reflect.construct.js': 281, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  406: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.Linker = void 0

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.object.assign.js')

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    /**
 * @file doubly linked list item.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 *
 */
    const Linker = /* #__PURE__ */(function () {
      /**
   *
   * @param data
   * @param prev
   * @param next
   * @param LinkerClass
   */
      function Linker () {
        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$data = _ref.data
        const data = _ref$data === void 0 ? null : _ref$data
        const _ref$prev = _ref.prev
        const prev = _ref$prev === void 0 ? null : _ref$prev
        const _ref$next = _ref.next
        const next = _ref$next === void 0 ? null : _ref$next

        const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Linker

        _classCallCheck(this, Linker)

        this.LinkerClass = LinkerClass
        this.data = data
        this.prev = prev
        this.next = next
      }
      /**
   *
   * @param node
   * @returns {Linker}
   */

      _createClass(Linker, [{
        key: 'after',
        value: function after (node) {
          if (!node.LinkerClass) {
            if (_typeof(node) !== 'object') {
              node = {
                data: node
              }
            }

            node = new this.LinkerClass(node)
          }

          node.next = this.next
          node.prev = this
          this.next = node

          if (node.next) {
            node.next.prev = node
          }

          return node
        }
        /**
     *
     * @param node
     * @returns {Linker}
     */

      }, {
        key: 'before',
        value: function before (node) {
          if (!node.LinkerClass) {
            if (_typeof(node) !== 'object') {
              node = {
                data: node
              }
            }

            node = new this.LinkerClass(node)
          }

          node.prev = this.prev
          node.next = this
          this.prev = node

          if (node.prev) {
            node.prev.next = node
          }

          return node
        }
      }])

      return Linker
    }())
    /**
 *
 * @param values
 * @param LinkerClass
 * @returns {Linker}
 */

    exports.Linker = Linker

    Linker.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Linker
      return values.reduce(function (list, element) {
        if (list === null) {
          if (_typeof(element) !== 'object') {
            element = {
              data: element
            }
          }

          return new LinkerClass(Object.assign({}, element, {
            prev: list
          }))
        }

        return Linker.prototype.after.apply(list, [element])
      }, null)
    }
  }, { 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  407: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.reflect.construct.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.TreeLinker = void 0

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.object.set-prototype-of.js')

    require('core-js/modules/es.object.get-prototype-of.js')

    const _Linker2 = require('./Linker')

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const TreeLinker = /* #__PURE__ */(function (_Linker) {
      _inherits(TreeLinker, _Linker)

      const _super = _createSuper(TreeLinker)

      /**
   *
   * @param data
   * @param prev
   * @param next
   * @param children
   * @param parent
   * @param LinkerClass
   */
      function TreeLinker () {
        let _this

        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$data = _ref.data
        const data = _ref$data === void 0 ? null : _ref$data
        const _ref$prev = _ref.prev
        const prev = _ref$prev === void 0 ? null : _ref$prev
        const _ref$next = _ref.next
        const next = _ref$next === void 0 ? null : _ref$next
        const _ref$children = _ref.children
        const children = _ref$children === void 0 ? null : _ref$children
        const _ref$parent = _ref.parent
        const parent = _ref$parent === void 0 ? null : _ref$parent

        const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TreeLinker

        _classCallCheck(this, TreeLinker)

        _this = _super.call(this, {
          data: data,
          prev: prev,
          next: next
        }, LinkerClass)
        _this.parent = parent
        _this.children = _this.childrenFromArray(children, LinkerClass)
        return _this
      }

      _createClass(TreeLinker, [{
        key: 'childrenFromArray',
        value: function childrenFromArray () {
          const _this2 = this

          const children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
          const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TreeLinker
          return children !== null
            ? _Linker2.Linker.fromArray.apply(this, [children.map(function (child) {
              return Object.assign({}, child, {
                parent: _this2
              })
            }), LinkerClass])
            : null
        }
      }])

      return TreeLinker
    }(_Linker2.Linker))

    exports.TreeLinker = TreeLinker
  }, { './Linker': 406, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-prototype-of.js': 261, 'core-js/modules/es.object.set-prototype-of.js': 271, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.reflect.construct.js': 281, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  408: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/es.weak-map.js')

    require('core-js/modules/esnext.weak-map.delete-all.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.object.get-own-property-descriptor.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.symbol.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0

    require('core-js/modules/es.object.assign.js')

    require('core-js/stable')

    const jDomCore = _interopRequireWildcard(require('./source/functions'))

    const jDomObjects = _interopRequireWildcard(require('./source/objects'))

    function _getRequireWildcardCache (nodeInterop) { if (typeof WeakMap !== 'function') return null; const cacheBabelInterop = new WeakMap(); const cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop })(nodeInterop) }

    function _interopRequireWildcard (obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

    /**
 * All of the JSON DOM system functions for creating JSON components.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module jDom
 */
    const _default = Object.assign(jDomCore, jDomObjects)

    exports.default = _default
  }, { './source/functions': 409, './source/objects': 410, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-own-property-descriptor.js': 258, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/es.weak-map.js': 385, 'core-js/modules/esnext.weak-map.delete-all.js': 387, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  409: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.renderHTML = exports.getTopParentItem = exports.getParentsByTagName = exports.getParentsByName = exports.getParentsByClass = exports.getParentsFromAttribute = exports.getChildrenByName = exports.getChildrenByClass = exports.getChildrenFromAttribute = exports.gatherChildItems = exports.bindAllListeners = exports.bindListeners = exports.appendListeners = exports.assignListener = exports.retrieveListener = exports.registerListeners = exports.registerListener = exports.removeChild = exports.appendHTML = exports.bindElement = exports.generateElement = exports.updateElements = exports.updateElement = exports.setAndReturnAttribute = exports.setAttribute = exports.elementChanges = exports.elementCompareClassList = exports.elementHasAttribute = void 0

    require('core-js/modules/es.regexp.exec.js')

    require('core-js/modules/es.string.split.js')

    require('core-js/modules/es.object.keys.js')

    require('core-js/modules/es.array.includes.js')

    require('core-js/modules/es.string.includes.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.splice.js')

    require('core-js/modules/es.array.index-of.js')

    require('core-js/modules/es.function.name.js')

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.map.js')

    const _functionalHelpers = _interopRequireDefault(require('functional-helpers'))

    const _objects = require('./objects')

    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

    function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    /**
 * Check if the provided Element has the provided attributes.
 * Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.
 * @function elementHasAttribute
 * @param {HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} element - Receive the element to be assessed
 * @param {string} key - The attribute name to search for
 * @param {string|Object} attr - The expected value of the attribute to compare against
 * @returns {boolean|Object.<string, number>}
 */
    const elementHasAttribute = function elementHasAttribute (element, key, attr) {
      if (!element.style) {
        // if element is not a valid element then return false
        return false
      }

      if (/^(style|className)$/.test(key)) {
        // For attributes which are objects or multi-part strings
        // -1 = remove attribute, 0 = no change, 1 = add attribute
        return _functionalHelpers.default.compareArrays(typeof attr === 'string' ? attr.split(' ') : Object.keys(attr), typeof attr === 'string' ? element[key].split(' ') : Object.keys(element[key]))
      } // Check that the key is a property of the element
      // Compare current to new one

      return element.hasAttribute(key) && element.getAttribute(key) === attr
    }
    /**
 * Check if a class exists on the element, return object with keys for each class and a -1, 0, 1 difference indicator.
 * @param {HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} element - Provide an element to check classes
 * on.
 * @param {string} classes - A string of classes (like the content of the 'class' attribute) to be compared
 * @returns {Object<string, number>|*}
 */

    exports.elementHasAttribute = elementHasAttribute

    const elementCompareClassList = function elementCompareClassList (element, classes) {
      return _functionalHelpers.default.compareArrays(classes.split(' '), [].from(element.classList))
    }
    /**
 * Given a jDomObjects.DomItem as config, this function will return the changes to be applied
 * to the stored element property.
 * @function elementChanges
 * @param {module:dom/objects.DomItem} config - The DomItem having config changes to be applied to its
 * element
 * @returns {module:dom/objects.DomItem}
 */

    exports.elementCompareClassList = elementCompareClassList

    const elementChanges = function elementChanges (config) {
      return config.element.tagName.toLowerCase() !== config.tagName.toLowerCase() // Generate a new element since the tag has changed
        ? generateElement(config) // Remove all the similarities
        : _functionalHelpers.default.setValue('attributes', _functionalHelpers.default.filterObject(config.attributes, // For each attribute, check if it becomes true / false based on the comparison results
          function (attr1, key1) {
            return _functionalHelpers.default.filterObject( // Get attributes as object of truthy and falsy values
              _functionalHelpers.default.mapObject(config.attributes, function (attr2, key2) {
                return _typeof(attr2) === 'object' || key2 === 'className' // Apply custom logic for class and styles, only keep the updates
                  ? _functionalHelpers.default.filterObject(elementHasAttribute(config.element, key2, attr2), function (attr3) {
                    return attr3 === 1
                  }) // True when the element does not already have the attribute
                  : !elementHasAttribute(config.element, key2, attr2)
              }), // Remove when the attr4 value is 0 or false, or not empty object
              function (attr4) {
                return !!attr4
              })[key1]
          }), config)
    }
    /**
 * Set an attribute on the element within a DomItem, then return the config data.
 * @function setAttribute
 * @param {module:dom/objects.DomItem} config - The DomItem having config changes to be applied to its
 * element
 * @param {string} name - The attribute name to be updated
 * @param {string} value - The new value to be applied to the attribute
 * @returns {module:dom/objects.DomItem}
 */

    exports.elementChanges = elementChanges

    const setAttribute = function setAttribute (config, name, value) {
      config.element.setAttribute(name, value)
      return config
    }
    /**
 * Set an attribute on the element within a DomItem, then return the attribute.
 * @function setAndReturnAttribute
 * @param {module:dom/objects.DomItem} config - The DomItem having config changes to be applied to its
 * element
 * @param {string} name - The attribute name to be updated
 * @param {string} value - The new value to be applied to the attribute
 * @returns {string}
 */

    exports.setAttribute = setAttribute

    const setAndReturnAttribute = function setAndReturnAttribute (config, name, value) {
      config.element.setAttribute(name, value)
      return value
    }
    /**
 * Update a single objects.DomItem element with the provided attributes / style / elementProperties
 * @function updateElement
 * @param {module:dom/objects.DomItem} config - The DomItem having config changes to be applied to its
 * element
 * @returns {module:dom/objects.DomItem}
 */

    exports.setAndReturnAttribute = setAndReturnAttribute

    const updateElement = function updateElement (config) {
      if (!config.element.style) {
        // if element is not a valid element then return the config without changes
        return config
      }

      const domItem = elementChanges(config) // Set the the current attributes to contain all the changes

      domItem.attributes = _functionalHelpers.default.mapObject( // Retrieve only the changes to be applied from the attributes
        domItem.attributes, function (attr, key) {
          if (!_functionalHelpers.default.isObject(attr) || _functionalHelpers.default.emptyObject(attr)) {
            return key in config.element ? _functionalHelpers.default.setAndReturnValue(config.element, key, attr) : setAndReturnAttribute(config, key, attr)
          }

          const cleanedStyles = _functionalHelpers.default.filterObject( // Remove attributes which have a numeric key (these are unwanted styles stored on elements)
            attr, function (param, k) {
              return /^\D+$/.test(k)
            })

          return _functionalHelpers.default.reduceObject(cleanedStyles, function (newStyle, p, i) {
            return _functionalHelpers.default.setValue(i, p, newStyle)
          }, config.element.style)
        })
      return domItem
    }
    /**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @function updateElements
 * @param {module:dom/objects.DomItem} config - The DomItem having child DomItems with config changes to be
 * applied
 * @returns {module:dom/objects.DomItem}
 */

    exports.updateElement = updateElement

    const updateElements = function updateElements (config) {
      const domItem = updateElement(config)
      return _functionalHelpers.default.setValue('children', _functionalHelpers.default.mapObject(domItem.children, function (child) {
        return updateElements(child)
      }), domItem)
    }
    /**
 * Create an HTML element based on the provided attributes and return the element as an Object.
 * @function generateElement
 * @param {module:dom/objects.DomItem} config - The DomItem requiring matching HTML element property
 * @return {module:dom/objects.DomItem}
 */

    exports.updateElements = updateElements

    var generateElement = function generateElement (config) {
      return updateElement(_functionalHelpers.default.setValue('element', document.createElement(config.tagName), config))
    }
    /**
 * Generate HTML element data for a provided DomItem
 * @function bindElement
 * @param {module:dom/objects.DomItem} item - The DomItem needing element to be generated
 * @return {module:dom/objects.DomItem}
 */

    exports.generateElement = generateElement

    const bindElement = function bindElement (item) {
      return _functionalHelpers.default.setValue('element', !item.element || !item.element.style ? generateElement(item).element : item.element, item)
    }
    /**
 * Simplify detecting the parent item which can be appended to, whether root, or just a parent at any part of the tree
 * @param {
 * module:dom/objects.DomItemRoot|module:dom/objects.DomItem
 * } parent - A parent DomItem which may or may not have a body
 * @returns {module:dom/objects.DomItemBody|module:dom/objects.DomItem}
 */

    exports.bindElement = bindElement

    const retrieveParentItem = function retrieveParentItem (parent) {
      return parent.body ? parent.body : parent
    }
    /**
 * Having an array and a potential new array element, check if the element is in the array, if not append to array.
 * @param {module:dom/objects.DomItem|*} item - An potential array element, possibly a DomItem
 * @param {Array} array - An array where an element may be appended.
 * @returns {Array|Buffer|*|T[]|string}
 */

    const addUniqueToArray = function addUniqueToArray (item, array) {
      return !array.includes(item) ? array.concat([item]) : array
    }
    /**
 * Provide a DomItem to be appended to a parent item, return the DomItem.
 * @param {module:dom/objects.DomItem} child - A DomItem to be appended
 * @param {module:dom/objects.DomItem} parent - A parent item to have a new child appended
 * @returns {module:dom/objects.DomItem}
 */

    const appendAndReturnChild = function appendAndReturnChild (child) {
      const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objects.documentItem.body
      retrieveParentItem(parent).element.appendChild(child.element)
      return child
    }
    /**
 * Append a new DomItem which has the element generated.
 * @function appendHTML
 * @param {module:dom/objects.DomItem} item - A new DomItem to append
 * @param {module:dom/objects.DomItem} parent - The parent to have DomItems appended
 * @returns {module:dom/objects.DomItem}
 */

    const appendHTML = function appendHTML (item) {
      const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objects.documentItem.body
      return appendAndReturnChild(bindElement(item), _functionalHelpers.default.setValue('children', addUniqueToArray(item, retrieveParentItem(parent).children), retrieveParentItem(parent)))
    }
    /**
 * Reverse of appendHTML, remove a DomItem and have the associated element removed.
 * @function removeChild
 * @param {module:dom/objects.DomItem} item - The DomItem with HTMLElement to be removed
 * @param {module:dom/objects.DomItem} parent - The parent of the items
 * @returns {Array.<HTMLElement|PseudoHTMLElement>}
 */

    exports.appendHTML = appendHTML

    const removeChild = function removeChild (item) {
      const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objects.documentItem.body
      parent.element.removeChild(item.element)
      return parent.children.splice(parent.children.indexOf(item), 1)
    }
    /**
 * Register a single listener function as part of the root jDomObjects.DomItem.
 * @function registerListener
 * @param {module:dom/objects~listenerFunction|function} listener - Provide a function which will be called
 * when a Dom event is triggered.
 * @param {string} [name] - The name of the listener to be used.
 * @param {module:dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
 * stores has eventListeners property.
 * @returns {Object.<string, module:dom/objects~listenerFunction>}
 */

    exports.removeChild = removeChild

    const registerListener = function registerListener (listener) {
      const name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : listener.name
      const parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objects.documentItem
      return Object.assign(parent.eventListeners, _defineProperty({}, name, listener))
    }
    /**
 * Register multiple listeners from an array of functions.
 * @function registerListeners
 * @param {Array.<module:dom/objects~listenerFunction|function>} listeners - An array of functions to be
 * used as the registered event listeners.
 * @param {module:dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
 * stores has eventListeners property.
 * @returns {module:dom/objects.DomItemRoot|Object}
 */

    exports.registerListener = registerListener

    const registerListeners = function registerListeners (listeners) {
      const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objects.documentItem
      return _functionalHelpers.default.setValue('eventListeners', _functionalHelpers.default.mergeObjectsMutable(parent.eventListeners, listeners), parent)
    }
    /**
 * Based on the provided function / listener name, retrieve the associated function from the root jDomObjects.DomItem
 * @function retrieveListener
 * @param {string} listenerName - The name of one of the registered listener functions.
 * @param {module:dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
 * stores has eventListeners property.
 * @returns {module:dom/objects~listenerFunction|function|Object}
 */

    exports.registerListeners = registerListeners

    const retrieveListener = function retrieveListener (listenerName) {
      const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objects.documentItem
      return Object.keys(parent.eventListeners).includes(listenerName) ? parent.eventListeners[listenerName] : {}
    }
    /**
 * Provide compatibility for using the options parameter of addEventListener
 * @param {module:dom/objects.EventListenerOptions} options - An object or boolean with the listener options
 * @returns {boolean}
 */

    exports.retrieveListener = retrieveListener

    const listenerOptions = function listenerOptions (options) {
      if (typeof listenerOptions.supportsOptions === 'undefined') {
        // Check if supportsOptions has been defined. This is a compatibility checking flag.
        listenerOptions.supportsOptions = true

        try {
          // If it is possible to use OptionsObject, then set our flag to true
          window.addEventListener('test', null, {
            capture: false,
            once: false,
            passive: false
          })
        } catch (err) {
          // When using an OptionsObjects fails, it is only possible to pass the boolean UseCapture as the option
          listenerOptions.supportsOptions = false
        }
      }

      return _typeof(options) === 'object' && listenerOptions.supportsOptions ? options : false
    }
    /**
 * Provide compatibility for assigning listeners.
 * @function assignListener
 * @param {string} trigger - The name of the event which will trigger the listenerFunction on the element.
 * @param {HTMLElement|module:pseudoDom/objects~PseudoHTMLElement} elem - An element to append the listener onto
 * @param {module:dom/objects~listenerFunction|function} fn - The function which will be invoked when the
 * event is triggered
 * @param {module:dom/objects.EventListenerOptions} options - Additional options to how the event will be
 * fired
 * @returns {module:dom/objects~listenerFunction|function}
 */

    const assignListener = function assignListener (trigger, elem, fn, options) {
      // Attaching a listener may be done differently based on the browser support
      if (elem.addEventListener) {
        // Latest support is provided fro addEventListener with the options parameter varying slightly
        elem.addEventListener(trigger, fn, listenerOptions(options))
      } else if (elem.attachEvent) {
        // Older browsers, especially Internet Explorer
        elem.attachEvent('on'.concat(trigger), fn)
      } else {
        // General support for adding a new function onto the element which can be called to trigger the function
        elem['on'.concat(trigger)] = fn
      }

      return fn
    }
    /**
 * When there may be extra data needed for the event listener function call, this function may be used as a helper
 * to pass the additional data. Also, if it is desirable to add event listeners during run-time, this function can be
 * used to achieve this.
 * WARNING: This is a recursive function.
 * @function appendListeners
 * @param {module:dom/objects.DomItem} item - The DomItem which will have its eventListeners updated.
 * @param {string} event - The string name of the event trigger type to be added.
 * @param {string} listener - The name of the function to be called once the event is triggered.
 * @param {Object} args - Additional arguments to be used in the listener function.
 * @param {module:dom/objects.EventListenerOptions} options - The strategy used when the event is triggered.
 * @returns {module:dom/objects.DomItem}
 */

    exports.assignListener = assignListener

    const appendListeners = function appendListeners (item, event, listener) {
      const args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}
      const options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false
      return _functionalHelpers.default.setValue('children', _functionalHelpers.default.mapObject(item.children, function (i) {
        return appendListeners(i, event, listener, args, options)
      }), _functionalHelpers.default.setValue('eventListeners', _functionalHelpers.default.setValue(event, {
        listenerFunc: listener,
        listenerArgs: args,
        listenerOptions: options
      }, item.eventListeners), item))
    }
    /**
 * Receive a DomItem with eventListeners and apply the event listeners onto the Dom element.
 * @param {module:dom/objects.DomItem} item - The DomItem which has eventListeners to apply to its element
 * @returns {module:dom/objects.DomItem}
 */

    exports.appendListeners = appendListeners

    const bindElementListeners = function bindElementListeners (item) {
      return _functionalHelpers.default.setValue('eventListeners', _functionalHelpers.default.mapObject(item.eventListeners, function (attr, event) {
        return assignListener(event, item.element, function (e) {
          return attr.listenerFunc(e, item, attr.listenerArgs)
        }, attr.listenerOptions)
      }), item)
    }
    /**
 * Based on the eventListeners property of the provided item, bind the
 * listeners to the associated element property for the provided jDomObjects.DomItem.
 * @function bindListeners
 * @param {module:dom/objects.DomItem} item - The DomItem which may have eventListeners to apply to its
 * element
 * @returns {module:dom/objects.DomItem}
 */

    const bindListeners = function bindListeners (item) {
      return item.eventListeners && Object.keys(item.eventListeners).length && item.element.style ? bindElementListeners(item) : item
    }
    /**
 * Based on the eventListeners property of the provided item, bind the listeners to the associated element property
 * for each item in the jDomObjects.DomItem structure.
 * WARNING: This is a recursive function.
 * @function bindAllListeners
 * @param {module:dom/objects.DomItem} item - The DomItem with an associated HTMLElement to have a listener
 * assigned
 * @returns {module:dom/objects.DomItem}
 */

    exports.bindListeners = bindListeners

    const bindAllListeners = function bindAllListeners (item) {
      return _functionalHelpers.default.setValue('children', _functionalHelpers.default.mapObject(item.children, function (i) {
        return bindAllListeners(i)
      }), bindListeners(item))
    }
    /**
 * To be used with gatherChildItems which will start at item and recurse over all child items, this test
 * will then choose which child items will be returned as the result of the test.
 * @callback module:dom/core~testChildItem
 * @param {module:dom/objects.DomItem|Object} item - The DomItem is the child being tested
 * @param {Array.<module:dom/objects.DomItem>} gatheredResults - All of the child items gathered based on
 * the test
 * @returns {Array.<module:dom/objects.DomItem>}
 */

    /**
 * A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.
 * This function will check all the children starting from and including item, and run the test function on each
 * child encountered. The return array contains children returned from the test from all levels.
 * WARNING: This is a recursive function.
 * @function gatherChildItems
 * @param {module:dom/objects.DomItem} item - The DomItem which may have child items matching the attribute
 * criteria
 * @param {module:dom/core~testChildItem} test - Assess each child, and return the ones which qualify
 * @returns {Array.<module:dom/objects.DomItem>}
 */

    exports.bindAllListeners = bindAllListeners

    const gatherChildItems = function gatherChildItems (item, test) {
      return test(item, item.children.reduce(function (a, b) {
        return a.concat(gatherChildItems(b, test))
      }, []))
    }
    /**
 * Retrieve the {@link module:dom/core~testChildItem} function by providing an attribute and value to check.
 * @param {string} attr - Provide the attribute name to be searched
 * @param {*} value - The attribute value to be compared
 * @returns {module:dom/core~testChildItem}
 */

    exports.gatherChildItems = gatherChildItems

    const getChildTest = function getChildTest (attr, value) {
      return function (item, gatheredResults) {
        return item.attributes[attr] && item.attributes[attr] === value ? gatheredResults.concat([item]) : gatheredResults
      }
    }
    /**
 * A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.
 * This function will check all the children starting from item, and scan the attributes
 * property for matches. The returned array contains children matching from all levels.
 * WARNING: This calls a recursive function.
 * @function getChildrenFromAttribute
 * @param {string} attr - Provide the attribute name to be searched
 * @param {*} value - The attribute value to be compared
 * @param {module:dom/objects.DomItem} item - The DomItem which may have child items matching the attribute
 * criteria
 * @returns {Array.<module:dom/objects.DomItem>}
 */

    const getChildrenFromAttribute = function getChildrenFromAttribute (attr, value) {
      const item = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objects.documentItem.body
      return gatherChildItems(item, getChildTest(attr, value))
    }
    /**
 * Helper for getting all jDomObjects.DomItems starting at parent and having specified className attribute
 * @function getChildrenByClass
 * @returns {module:dom/objects.DomItem[]}
 */

    exports.getChildrenFromAttribute = getChildrenFromAttribute

    const getChildrenByClass = _functionalHelpers.default.curry(getChildrenFromAttribute)('className')
    /**
 * Helper for getting all jDomObjects.DomItems starting at parent and having specified name attribute
 * @function getChildrenByName
 * @returns {module:dom/objects.DomItem[]}
 */

    exports.getChildrenByClass = getChildrenByClass

    const getChildrenByName = _functionalHelpers.default.curry(getChildrenFromAttribute)('name')
    /**
 * A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.
 * This function will check all the children starting from item, and scan the attributes
 * property for matches. The return array contains children matching from all levels.
 * WARNING: This is a recursive function.
 * @function getParentsFromAttribute
 * @param {string} attr - Provide the attribute name to be searched
 * @param {*} value - The attribute value to be compared
 * @param {module:dom/objects.DomItem} item - The DomItem which may have parent items matching the
 * attribute criteria
 * @returns {Array}
 */

    exports.getChildrenByName = getChildrenByName

    const getParentsFromAttribute = function getParentsFromAttribute (attr, value) {
      const item = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objects.documentItem.body
      return Object.keys(item.parentItem).length ? (item.parentItem.attributes[attr] || item[attr] || false) === value ? getParentsFromAttribute(attr, value, item.parentItem).concat([item.parentItem]) : getParentsFromAttribute(attr, value, item.parentItem) : []
    }
    /**
 * Helper for getting all jDomObjects.DomItems starting at child and having specified className attribute
 * @function getParentsByClass
 * @returns {Array}
 */

    exports.getParentsFromAttribute = getParentsFromAttribute

    const getParentsByClass = _functionalHelpers.default.curry(getParentsFromAttribute)('className')
    /**
 * Helper for getting all jDomObjects.DomItems starting at child and having specified name attribute
 * @function getParentsByName
 * @returns {Array}
 */

    exports.getParentsByClass = getParentsByClass

    const getParentsByName = _functionalHelpers.default.curry(getParentsFromAttribute)('name')
    /**
 * Helper for getting all jDomObjects.DomItems starting at child and having specified tagName
 * @function getParentsByTagName
 * @returns {Array}
 */

    exports.getParentsByName = getParentsByName

    const getParentsByTagName = _functionalHelpers.default.curry(getParentsFromAttribute)('tagName')
    /**
 * Get the upper parentItem for the provided child. (usually this is a documentItem reference)
 * WARNING: This is a recursive function.
 * @function getTopParentItem
 * @param {module:dom/objects.DomItem} item - The DomItem which we want the highest parent item of
 * @returns {module:dom/objects.DomItemRoot}
 */

    exports.getParentsByTagName = getParentsByTagName

    const getTopParentItem = function getTopParentItem (item) {
      return Object.keys(item.parentItem).length ? getTopParentItem(item.parentItem) : item
    }
    /**
 * This is a shortcut for building the specified HTML elements and appending them to the Dom
 * with associated listeners.
 * The final argument is specific for adding event listeners with options.
 * @function renderHTML
 * @param {module:dom/objects.DomItem} item - The DomItem that we want to render the element for
 * @param {module:dom/objects.DomItemRoot} parent - The Base Dom item which is the parent of all the items
 * @returns {module:dom/objects.DomItem}
 */

    exports.getTopParentItem = getTopParentItem

    const renderHTML = function renderHTML (item) {
      const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objects.documentItem
      return _functionalHelpers.default.pipe(function (domItem) {
        return _functionalHelpers.default.setValue('element', domItem.element && domItem.element.style ? domItem.element : bindElement(domItem).element, domItem)
      }, function (domItem) {
        return _functionalHelpers.default.setValue('eventListeners', _functionalHelpers.default.mapObject(domItem.eventListeners, function (prop) {
          return _functionalHelpers.default.mergeObjects(prop, {
            listenerFunc: retrieveListener(prop.listenerFunc, getTopParentItem(parent))
          })
        }), domItem)
      }, _functionalHelpers.default.curry(_functionalHelpers.default.setValue)('parentItem', parent.body || parent), function (domItem) {
        return bindListeners(appendHTML(domItem, parent))
      }, function (domItem) {
        return _functionalHelpers.default.setValue('children', domItem.children.map(function (child) {
          return renderHTML(child, domItem)
        }), domItem)
      })(_functionalHelpers.default.reduceObject((0, _objects.createDomItem)(item), function (domItem, prop, name) {
        return _functionalHelpers.default.setValue(name, prop, domItem)
      }, item))
    }

    exports.renderHTML = renderHTML
  }, { './objects': 410, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.includes.js': 184, 'core-js/modules/es.array.index-of.js': 185, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.splice.js': 199, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.keys.js': 266, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.regexp.exec.js': 296, 'core-js/modules/es.string.includes.js': 312, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.string.split.js': 326, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389, 'functional-helpers': 402 }],
  410: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.documentItem = exports.documentDomItem = exports.createDomItem = void 0

    require('core-js/modules/web.dom-collections.for-each.js')

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.object.assign.js')

    const _functionalHelpers = _interopRequireDefault(require('functional-helpers'))

    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

    /**
 * @file Core objects for representing the DOM in JSON.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * This is the standard definition of a listenerFunction to be used
 * @callback listenerFunction
 * @callback listenerFunction
 * @param {Event|module:pseudoDom/objects.PseudoEvent} e - The event object passed to the listener
 * @param {module:dom/objects.DomItem} target - The element which triggered the event
 * @param {...*} [args] - Optional args as required by the listener
 */

    /**
 * A Boolean indicating whether events of this type will be dispatched to the registered listerFunction before being
 * dispatched to any EventTarget beneath it in the Dom tree.
 * @typedef {boolean} module:dom/objects.UseCapture
 */

    /**
 * OptionsObject defines the structure for the options to be passed to addEventListener
 * @typedef {Object} module:dom/objects.OptionsObject
 * @property {boolean} capture - Indicate that events of this type will be dispatched to the registered
 * listenerFunction before being dispatched to any EventTarget beneath it in the Dom tree.
 * @property {boolean} once - Indicate that the listenerFunction should be invoked at most once after being added. If
 * 'true', the listenerFunction would be automatically removed when invoked.
 * @property {boolean} passive - Indicate that, if 'true', indicates that the listenerFunction will never call
 * preventDefault(). If preventDefault() is called, the user agent will do nothing with it.
 */

    /**
 * EventListenerOptions is either a boolean as UseCapture or an Object as OptionsObject
 * @typedef {
 * module:dom/objects.OptionsObject|module:dom/objects.UseCapture
 * } module:dom/objects.EventListenerOptions
 */

    /**
 * An EventListener Object to be appended to the element within the DomItem
 * @typedef {Object} EventListener
 * @typedef {Object} EventListener
 * @property {string} listenerFunc - A string function name matching an existing
 * {@link module:dom/objects~listenerFunction}.
 * @property {Object} listenerArgs - Additional args required for the listener function
 * @property {module:dom/objects.EventListenerOptions} listenerOptions - Provides support for options
 * parameter of addEventListener, or false for default
 */

    /**
 * DomItem defines the structure for a single element in the Dom
 * @typedef {Object} module:dom/objects.DomItem
 * @property {string} tagName - This is any valid HTMLElement tagName
 * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
 * (including the defaulted style object)
 * @property {(Object|HTMLElement|module:pseudoDom/objects.PseudoHTMLElement)} element - A reference to an existing HTML element will be stored here (default
 * empty object)
 * @property {Object.<Event, module:dom/objects~EventListener>} eventListeners - An object holding all
 * events to be registered for the associated element
 * @property {module:dom/objects.DomItem} parentItem - A reference to the parent of this object
 * @property {Array.<module:dom/objects.DomItem>} children - A reference to an array of child objects
 */

    /**
 * This is the basic Object for representing the Dom in a virtual perspective. All incoming attributes will be merged
 * to the specified format.
 * @function createDomItem
 * @param {...Object} attributes - DomItem-like object(s) to be merged as a DomItem
 * @returns {module:dom/objects.DomItem}
 */
    const createDomItem = function createDomItem () {
      const item = {
        tagName: 'div',
        attributes: {
          style: {}
        },
        element: {},
        eventListeners: {},
        parentItem: {},
        children: []
      }

      for (var _len = arguments.length, attributes = new Array(_len), _key = 0; _key < _len; _key++) {
        attributes[_key] = arguments[_key]
      }

      attributes.forEach(function (attributeGroup) {
        for (const attribute in attributeGroup) {
          if (!(attribute in item) || !_functionalHelpers.default.isCloneable(attributeGroup[attribute])) {
            item[attribute] = attributeGroup[attribute]
            continue
          }

          item[attribute] = _functionalHelpers.default.mergeObjectsMutable(item[attribute], attributeGroup[attribute])
        }
      })

      if (!('style' in item.attributes)) {
        item.attributes.style = {}
      }

      return item
    }
    /**
 * DomItemHead defines the structure for a single element in the Dom
 * @typedef {module:dom/objects.DomItem} module:dom/objects.DomItemHead
 * @typedef {module:dom/objects.DomItem} DomItemHead
 * @property {string} [tagName=head] - This is set to the string head referring to the HTML element of the same name
 * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
 * @property {HTMLHeadElement|module:pseudoDom/objects.PseudoHTMLElement} element - A reference to the HTML head element
 * @property {Array.<module:dom/objects.DomItem>} children - A reference to an array of child objects
 */

    /**
 * DomItemBody defines the structure for a single element in the Dom
 * @typedef {module:dom/objects.DomItem} module:dom/objects.DomItemBody
 * @typedef {module:dom/objects.DomItem} DomItemBody
 * @property {string} [tagName=body] - This is set to the string body referring to the HTML element of the same name
 * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
 * @property {HTMLBodyElement|module:pseudoDom/objects.PseudoHTMLElement} element - A reference to the HTML body element
 * @property {Array.<module:dom/objects.DomItem>} children - A reference to an array of child objects
 */

    /**
 * Initiate the children of Root / DocumentItem. This is a helper for {@link documentDomItem}.
 * @returns {Array.<module:dom/objects~DomItemHead|module:dom/objects~DomItemBody>}
 */

    exports.createDomItem = createDomItem

    const initChildren = function initChildren () {
      return [createDomItem({
        tagName: 'head',
        attributes: {},
        element: document.head,
        children: []
      }), createDomItem({
        tagName: 'body',
        attributes: {},
        element: document.body,
        children: []
      })]
    }
    /**
 * DomItemRoot defines the structure for a single element in the Dom
 * @typedef {module:dom/objects.DomItem} module:dom/objects.DomItemRoot
 * @property {string} [tagName=html] - This is set to the string html referring to the HTML element of the same name
 * @property {Object} attributes - Empty object as attributes placeholder
 * @property {HTMLDocument|module:pseudoDom/objects.PseudoHTMLDocument} element - A reference to the entire Document
 * @property {Object.<string, module:dom/objects~listenerFunction>} eventListeners - all registered
 * listeners stored as listener name and function pairs
 * @property {
 * Array.<module:dom/objects~DomItemHead|module:dom/objects~DomItemBody>
 *   } children - Two references: for head and body
 * @property {module:dom/objects~DomItemHead} head - A specific reference to head item
 * @property {module:dom/objects~DomItemBody} body - A specific reference to body item
 */

    /**
 * Initiate the Root for DocumentItem. This is primary a helper for {@link documentDomItem}.
 * @param {
 * Array.<module:dom/objects~DomItemHead|module:dom/objects~DomItemBody>
 *   } children - Provide an array of Head and Body (usually via {@link initChildren})
 * @param {Object.<string, module:dom/objects~listenerFunction>} listeners - An object of all event
 * listeners to be registered in the Dom
 * @returns {module:dom/objects.DomItemRoot|module:dom/objects.DomItem}
 */

    const initRoot = function initRoot (children) {
      const listeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      return createDomItem({
        tagName: 'html',
        attributes: {},
        element: document,
        eventListeners: listeners,
        children: children,
        head: children[0],
        body: children[1]
      })
    }
    /**
 * Return a DomItem reference to the document. The rootItem argument is a system variable and not necessary to
 * implement.
 * @function documentDomItem
 * @param {Object.<string, module:dom/objects~listenerFunction>} listeners - An object of all event
 * listeners to be registered in the Dom
 * @param {module:dom/objects.DomItemRoot|module:dom/objects.DomItem} [rootItem] - This is a
 * reference to DomItemRoot which will be defaulted with {@link initRoot}
 * @returns {module:dom/objects.DomItemRoot|module:dom/objects.DomItem}
 */

    const documentDomItem = function documentDomItem () {
      const listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const rootItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : initRoot(initChildren(), listeners)
      rootItem.children = rootItem.children.map(function (child) {
        return createDomItem(child, {
          parentItem: rootItem
        })
      })
      Object.assign(rootItem.head, rootItem.children[0])
      Object.assign(rootItem.body, rootItem.children[1])
      return createDomItem(rootItem)
    }
    /**
 * Create reference for storing document changes
 * @member documentItem
 * @type {module:dom/objects.DomItemRoot}
 */

    exports.documentDomItem = documentDomItem
    const documentItem = documentDomItem()
    exports.documentItem = documentItem
  }, { 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/web.dom-collections.for-each.js': 388, 'functional-helpers': 402 }],
  411: [function (require, module, exports) {
    (function (global) {
      (function () {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true
        })
        exports.default = void 0

        require('core-js/modules/es.object.assign.js')

        require('core-js/stable')

        const _all = _interopRequireDefault(require('./collections/all'))

        const _all2 = _interopRequireDefault(require('./dom/all'))

        const _all3 = _interopRequireDefault(require('./pseudoDom/all'))

        const _all4 = _interopRequireDefault(require('./matrix/all'))

        function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

        /**
 * All of the JSON DOM system functions for creating JSON components.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module jsonDom
 */

        /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
        const root = void 0 || window || global || {}
        /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

        const previousJsonDom = root.jsonDom || {}
        /**
   * All methods exported from this module are encapsulated within jsonDom.
   * @typedef {module:jsonDom|module:collections|module:jDom|module:pseudoDom|module:matrix} jsonDom
   */

        const jsonDom = {}
        root.jsonDom = jsonDom
        /**
   * Return a reference to this library while preserving the original same-named library
   * @function
   * @returns {module:jsonDom~jsonDom}
   */

        const noConflict = function noConflict () {
          root.jsonDom = previousJsonDom
          return jsonDom
        }

        jsonDom.noConflict = noConflict

        const _default = root.jsonDom = Object.assign(jsonDom, _all.default, _all2.default, _all3.default, _all4.default)

        exports.default = _default
      }).call(this)
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, { './collections/all': 403, './dom/all': 408, './matrix/all': 412, './pseudoDom/all': 415, 'core-js/modules/es.object.assign.js': 249, 'core-js/stable': 396 }],
  412: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/es.weak-map.js')

    require('core-js/modules/esnext.weak-map.delete-all.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.object.get-own-property-descriptor.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.symbol.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0

    require('core-js/modules/es.object.assign.js')

    require('core-js/stable')

    const jDomMatrixCore = _interopRequireWildcard(require('./source/functions'))

    const jDomMatrixObjects = _interopRequireWildcard(require('./source/objects'))

    function _getRequireWildcardCache (nodeInterop) { if (typeof WeakMap !== 'function') return null; const cacheBabelInterop = new WeakMap(); const cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop })(nodeInterop) }

    function _interopRequireWildcard (obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

    /**
 * Add matrix ability using JSON DOM components
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module jDomMatrix
 */
    const _default = Object.assign(jDomMatrixCore, jDomMatrixObjects)

    exports.default = _default
  }, { './source/functions': 413, './source/objects': 414, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-own-property-descriptor.js': 258, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/es.weak-map.js': 385, 'core-js/modules/esnext.weak-map.delete-all.js': 387, 'core-js/modules/web.dom-collections.iterator.js': 389, 'core-js/stable': 396 }],
  413: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.array.slice.js')

    require('core-js/modules/es.function.name.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.getDomItemFromElement = exports.getPointFromElement = exports.adjacentEdgePoints = exports.adjacentPoints = exports.getAllPoints = exports.getDomItemFromPoint = exports.checkValidPoint = exports.randDirection = exports.getAxisLengths = exports.checkInBetween = exports.testPointsBetween = exports.getPointsLines = exports.getPointsLine = exports.lineEndPoint = exports.randomStart = exports.pointsToDirection = exports.getFirstAxisOfCoordinate = exports.getHighestAbsoluteCoordinate = exports.areEqualPoints = exports.pointDifference = exports.nextCell = exports.bindPointData = void 0

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.array.filter.js')

    require('core-js/modules/es.object.keys.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.index-of.js')

    require('core-js/modules/es.array.from.js')

    require('core-js/modules/es.string.iterator.js')

    const _functionalHelpers = _interopRequireDefault(require('functional-helpers'))

    const _objects = require('./objects')

    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

    /**
   * Generate point data for each item in the matrix
   * WARNING: This is a recursive function.
   * @function bindPointData
   * @param {module:matrix/objects.MatrixColumn|module:matrix/objects.MatrixRow} item - A special DomItem
   * which is either a layer, row, or column in a matrix.
   * @param {module:matrix/objects.Point} pnt - A point to be added to a specific Matrix Column
   * @returns {module:matrix/objects.MatrixColumn|module:matrix/objects.MatrixRow}
   */
    const bindPointData = function bindPointData (item) {
      const pnt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _objects.point)(0, 0, 0)
      return _functionalHelpers.default.mergeObjects(item, item.point
        ? {
            point: _functionalHelpers.default.cloneObject(pnt)
          }
        : {
            children: item.children.map(function (el, i) {
              return bindPointData(el, Object.assign(pnt, _defineProperty({}, el.axis, i)))
            })
          })
    }
    /**
   * Based on provided point and point direction generate next point.
   * @function nextCell
   * @param {module:matrix/objects.Point} pnt - Provide the current / initial point
   * @param {module:matrix/objects.Direction} dir - Provide the direction to be applied to find the next point
   * @returns {module:matrix/objects.Point}
   */

    exports.bindPointData = bindPointData

    const nextCell = function nextCell (pnt, dir) {
      return (0, _objects.point)(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)
    }
    /**
   * Based on provided point and another point, get a point with the difference between each axis
   * @function pointDifference
   * @param {module:matrix/objects.Point} start - The first point to compare
   * @param {module:matrix/objects.Point} end - The other point to be compared
   * @returns {module:matrix/objects.Point}
   */

    exports.nextCell = nextCell

    const pointDifference = function pointDifference (start, end) {
      return (0, _objects.point)(end.x - start.x, end.y - start.y, end.z - start.z)
    }
    /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @function areEqualPoints
   * @param {module:matrix/objects.Point} p1 - The first point to compare
   * @param {module:matrix/objects.Point} p2 - The other point to be compared
   * @returns {boolean}
   */

    exports.pointDifference = pointDifference

    const areEqualPoints = function areEqualPoints (p1, p2) {
      return p1.x === p2.x && p1.y === p2.y && p1.z === p2.z
    }
    /**
   * Return the first coordinate number with the highest absolute value.
   * @function getHighestAbsoluteCoordinate
   * @param {module:matrix/objects.Point} pnt - A Point to be assessed.
   * @returns {module:matrix/objects.coordinate}
   */

    exports.areEqualPoints = areEqualPoints

    const getHighestAbsoluteCoordinate = function getHighestAbsoluteCoordinate (pnt) {
      return _functionalHelpers.default.reduceObject(pnt, _functionalHelpers.default.getAbsoluteMax, 0)
    }
    /**
   * Having provided a coordinate number, find all corresponding axis, return the first match.
   * @function getFirstAxisOfCoordinate
   * @param {module:matrix/objects.Point} pnt - The Point containing a matching coordinate.
   * @param {module:matrix/objects.coordinate} coordinate - The coordinate to search for.
   * @returns {false|module:matrix/objects.axis}
   */

    exports.getHighestAbsoluteCoordinate = getHighestAbsoluteCoordinate

    const getFirstAxisOfCoordinate = function getFirstAxisOfCoordinate (pnt, coordinate) {
      return Object.keys(pnt).filter(function (key) {
        return pnt[key] === coordinate
      })[0] || false
    }
    /**
   * Given a point and the value of the highest coordinate select the corresponding axis which will be the direction
   * (-1 or 1) to and set the other axis to 0.
   * @param {module:matrix/objects.Point} pnt - The which will be converted to a direction.
   * @param {module:matrix/objects.coordinate} highestCoordinate - The highest coordinate provided by the point.
   * @returns {module:matrix/objects.Direction}
   */

    exports.getFirstAxisOfCoordinate = getFirstAxisOfCoordinate

    const pointAndCoordinateToDirection = function pointAndCoordinateToDirection (pnt, highestCoordinate) {
      return (function (axis) {
        return axis !== false ? _functionalHelpers.default.mergeObjects((0, _objects.point)(0, 0, 0), _defineProperty({}, ''.concat(axis), highestCoordinate > 0 ? 1 : -1)) : (0, _objects.point)(0, 0, 0)
      }(getFirstAxisOfCoordinate(pnt, highestCoordinate)))
    }
    /**
   * Having a point, convert it to a direction where the axis with the highest coordinate value will be set to -1 or 1.
   * @param {module:matrix/objects.Point} pnt - The point to be converted to a direction.
   * @returns {module:matrix/objects.Direction}
   */

    const pointToDirection = function pointToDirection (pnt) {
      return pointAndCoordinateToDirection(pnt, getHighestAbsoluteCoordinate(pnt))
    }
    /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero coordinates and a single coordinate of 1 / -1)
   * @function pointsToDirection
   * @param {module:matrix/objects.Point} start - The first point to assess.
   * @param {module:matrix/objects.Point} end - The other point to assess.
   * @returns {module:matrix/objects.Direction}
   */

    const pointsToDirection = function pointsToDirection (start, end) {
      return pointToDirection(pointDifference(start, end))
    }
    /**
   * Generate a random starting point for a line with the provided length and direction.
   * @function randomStart
   * @param {number} length - The intended length the resulting line.
   * @param {module:matrix/objects.Direction} dir - The direction the line will extend towards.
   * @param {module:matrix/objects.Point} [lengthLimits={x: 10, y: 10, z: 10}] - The maximum grid size.
   * @returns {module:matrix/objects.Point}
   */

    exports.pointsToDirection = pointsToDirection

    const randomStart = function randomStart (length, dir) {
      const lengthLimits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _objects.point)(10, 10, 10)
      return (0, _objects.point)(_functionalHelpers.default.randomInteger(lengthLimits.x - (length - 1) * dir.x), _functionalHelpers.default.randomInteger(lengthLimits.y - (length - 1) * dir.y), _functionalHelpers.default.randomInteger(lengthLimits.z - (length - 1) * dir.z))
    }
    /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @function lineEndPoint
   * @param {module:matrix/objects.Point} start - The selected starting point.
   * @param {number} length - The total length of the line.
   * @param {module:matrix/objects.Direction} dir - The direction of the line.
   * @returns {module:matrix/objects.Point}
   */

    exports.randomStart = randomStart

    const lineEndPoint = function lineEndPoint (start, length, dir) {
      return (0, _objects.point)(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1))
    }
    /**
   * Having provided two points, return an array of transition points connecting 'start' and 'end'. Return array
   * includes 'start' (line[0]) and 'end' (line[line.length-1])
   * @function getPointsLine
   * @param {module:matrix/objects.Point} start - The starting location of the line.
   * @param {module:matrix/objects.Point} end - The final line destination.
   * @param {Array.<module:matrix/objects.Point>} [line=[]] - The resulting line to connect start and end.
   * @returns {Array.<module:matrix/objects.Point>}
   */

    exports.lineEndPoint = lineEndPoint

    const getPointsLine = function getPointsLine (start, end) {
      const line = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : []
      return areEqualPoints(start, end) ? line.concat([start]) : getPointsLine(nextCell(start, pointsToDirection(start, end)), end, line.concat([start]))
    }
    /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points. Returns an
   * array of all points captured for each line segment
   * @function getPointsLines
   * @param {Array.<Array.<module:matrix/objects.Point>>} lines - An array of lines only containing start and end.
   * @returns {Array.<Array.<module:matrix/objects.Point>>}
   */

    exports.getPointsLine = getPointsLine

    const getPointsLines = function getPointsLines (lines) {
      return lines.reduce(function (pointsArray, line) {
        return pointsArray.concat(getPointsLine.apply(void 0, _toConsumableArray(line)))
      }, [])
    }
    /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:matrix/core~testPointStatus
   * @param {module:matrix/objects.MatrixColumn|Object} pnt - A point which may have some status.
   * @param {module:matrix/objects.Matrix|Object} matrix - A matrix of points to find the point within.
   * @returns {boolean}
   */

    /**
   * Given a start and end point, test the points between with the provided function. Return the points as part of true
   * and / or false properties based on the test.
   * @function module:matrix/core~testPointsBetween
   * @param {module:matrix/objects.Point} start - The beginning point to check.
   * @param {module:matrix/objects.Point} end - The terminating point to check between.
   * @param {module:matrix/objects.Matrix} matrix - The grid of points all the points can exist on.
   * @param {module:matrix/core~testPointStatus} func - The test function which will return true or false.
   * @param {boolean} [inclusive=true] - Choose whether to include or exclude the start and end points in the results.
   * @returns {Object.<string, Array.<module:matrix/objects.Point>>}
   */

    exports.getPointsLines = getPointsLines

    const testPointsBetween = function testPointsBetween (start, end, matrix, func) {
      const inclusive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true
      return getPointsLine(start, end).filter(function (prop, i, line) {
        return i !== 0 && i !== line.length - 1 || inclusive
      }).reduce(function (newPoints, next) {
        return _functionalHelpers.default.mergeObjects(newPoints, _defineProperty({}, ''.concat(func(next, matrix)), [next]))
      }, {
        true: [],
        false: []
      })
    }
    /**
   * Given two points, check the cells between using specified function.
   * When inclusive is set to true the provided start and end points will also be tested
   * @function checkInBetween
   * @param {...*} args - These args match the parameter list for {@link module:matrix/core~testPointsBetween}
   * @returns {boolean}
   */

    exports.testPointsBetween = testPointsBetween

    const checkInBetween = function checkInBetween () {
      return !!testPointsBetween.apply(void 0, arguments).true.length
    }
    /**
   * Return point-like object with all of the axis lengths.
   * @function getAxisLengths
   * @param {module:matrix/objects.Matrix} matrix - The matrix to get the dimensions of.
   * @returns {module:matrix/objects.Point}
   */

    exports.checkInBetween = checkInBetween

    const getAxisLengths = function getAxisLengths (matrix) {
      return (0, _objects.point)(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length)
    }
    /**
   * Get random direction point
   * @function randDirection
   * @param {Array.<module:matrix/objects.Point>} [useCoordinates=[]] - An array of possible directions.
   * @returns {module:matrix/objects.Direction}
   */

    exports.getAxisLengths = getAxisLengths

    const randDirection = function randDirection () {
      const useCoordinates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      return useCoordinates.length ? useCoordinates[_functionalHelpers.default.randomInteger(useCoordinates.length)] : (0, _objects.point)(0, 0, 0)
    }
    /**
   * Test if the provided point exists in the matrix.
   * @function checkValidPoint
   * @param {module:matrix/objects.Point} pnt - Provide a point to validate.
   * @param {module:matrix/objects.Matrix} matrix - The matrix that contains valid points.
   * @returns {boolean}
   */

    exports.randDirection = randDirection

    const checkValidPoint = function checkValidPoint (pnt, matrix) {
      return !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point
    }
    /**
   * Retrieve the DomItem associated with the provided point
   * @function getDomItemFromPoint
   * @param {module:matrix/objects.Point} pnt - A point corresponding to a DomItem.
   * @param {module:matrix/objects.Matrix} matrix - The matrix containing the point.
   * @returns {false|module:dom/objects.DomItem}
   */

    exports.checkValidPoint = checkValidPoint

    const getDomItemFromPoint = function getDomItemFromPoint (pnt, matrix) {
      return checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false
    }
    /**
   * Return an array of all the points in the matrix
   * @function getAllPoints
   * @param {module:matrix/objects.Matrix|module:matrix/objects.MatrixColumn} matrix - The matrix to retrieve
   * points from.
   * @param {Array.<module:matrix/objects.Point>} [allPoints=[]] - The array of points to be returned
   * @returns {Array.<module:matrix/objects.Point>}
   */

    exports.getDomItemFromPoint = getDomItemFromPoint

    const getAllPoints = function getAllPoints (matrix) {
      const allPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []
      return matrix.point
        ? allPoints.concat([matrix.point])
        : matrix.children.reduce(function (allPoints, child) {
          return allPoints.concat(getAllPoints(child, []))
        }, [])
    }
    /**
   * Return all valid points surrounding a provided point
   * @function adjacentPoints
   * @param {module:matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:matrix/objects.Point>}
   */

    exports.getAllPoints = getAllPoints

    const adjacentPoints = function adjacentPoints (pnt, matrix) {
      return getPointsLines([[(0, _objects.point)(-1, 1, 1), (0, _objects.point)(1, -1, -1)], [(0, _objects.point)(1, 1, 1), (0, _objects.point)(-1, 1, -1)], [(0, _objects.point)(-1, -1, 1), (0, _objects.point)(1, -1, 1)], [(0, _objects.point)(1, 0, 0), (0, _objects.point)(1, 1, -1)], [(0, _objects.point)(-1, 1, 0), (0, _objects.point)(1, 1, 0)]]).concat([(0, _objects.point)(0, 0, 1), (0, _objects.point)(1, 0, 0), (0, _objects.point)(-1, 0, -1), (0, _objects.point)(0, 0, -1)]).map(function (p) {
        return nextCell(pnt, p)
      }).filter(function (p) {
        return checkValidPoint(nextCell(pnt, p), matrix)
      })
    }
    /**
   * Return all points which touch on edges (not diagonal)
   * @function adjacentEdgePoints
   * @param {module:matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:matrix/objects.Point>}
   */

    exports.adjacentPoints = adjacentPoints

    const adjacentEdgePoints = function adjacentEdgePoints (pnt, matrix) {
      return [(0, _objects.point)(-1, 0, 0), (0, _objects.point)(1, 0, 0), (0, _objects.point)(0, -1, 0), (0, _objects.point)(0, 1, 0), (0, _objects.point)(0, 0, -1), (0, _objects.point)(0, 0, 1)].map(function (p) {
        return nextCell(pnt, p)
      }).filter(function (p) {
        return checkValidPoint(p, matrix)
      })
    }
    /**
   * Retrieve the point associated with the provided element.
   * @function getPointFromElement
   * @param {Node|HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} elem - Provide an element associated with
   * a point.
   * @returns {module:matrix/objects.Point}
   */

    exports.adjacentEdgePoints = adjacentEdgePoints

    const getPointFromElement = function getPointFromElement (elem) {
      return (0, _objects.point)(Array.from(elem.parentNode.childNodes).indexOf(elem), Array.from(elem.parentNode.parentNode.childNodes).indexOf(elem.parentNode), Array.from(elem.parentNode.parentNode.parentNode.childNodes).indexOf(elem.parentNode.parentNode))
    }
    /**
   * Retrieve the DomItem associated with the provided element in the matrix
   * @function getDomItemFromElement
   * @param {Node|HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} elem - Provide an element having an
   * associated DomItem.
   * @param {module:matrix/objects.Matrix} matrix - The matrix potentially containing the DomItem with Point.
   * @returns {module:dom/objects.DomItem}
   */

    exports.getPointFromElement = getPointFromElement

    const getDomItemFromElement = function getDomItemFromElement (elem, matrix) {
      return getDomItemFromPoint(getPointFromElement(elem), matrix)
    }

    exports.getDomItemFromElement = getDomItemFromElement
  }, { './objects': 414, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.filter.js': 177, 'core-js/modules/es.array.from.js': 183, 'core-js/modules/es.array.index-of.js': 185, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.slice.js': 195, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.keys.js': 266, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389, 'functional-helpers': 402 }],
  414: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.array.from.js')

    require('core-js/modules/es.array.slice.js')

    require('core-js/modules/es.function.name.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.cube = exports.square = exports.matrix = exports.tile = exports.point = void 0

    require('core-js/modules/es.array.concat.js')

    const _objects = require('../../dom/source/objects')

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    /**
 * A string representing an axis: x, y, z
 * @typedef {string} module:matrix/objects.axis
 */

    /**
 * A number representing a coordinate in a {@link module:matrix/objects.Matrix}
 * @typedef {number} module:matrix/objects.coordinate
 */

    /**
 * Point stores a location in a {@link module:matrix/objects.Matrix} defined by three key-value pairs
 * ({@link module:matrix/objects.axis}=>{@link module:matrix/objects.coordinate})
 * @typedef {
 * Object.<module:matrix/objects.axis, module:matrix/objects.coordinate>
 *   } module:matrix/objects.Point
 * @property {module:matrix/objects.coordinate} x - The X-coordinate of a Point
 * @property {module:matrix/objects.coordinate} y - The Y-coordinate of a Point
 * @property {module:matrix/objects.coordinate} z - The Z-coordinate of a Point
 */

    /**
 * Point stores a location in a {@link module:matrix/objects.Matrix} defined by three key-value pairs
 * @typedef {module:matrix/objects.Point} module:matrix/objects.Direction
 * @property {module:matrix/objects.coordinate} x - The X-coordinate must be either -1, 0, or 1
 * @property {module:matrix/objects.coordinate} y - The Y-coordinate must be either -1, 0, or 1
 * @property {module:matrix/objects.coordinate} z - The Z-coordinate must be either -1, 0, or 1
 */

    /**
 * Store the point data for an x, y, z {@link module:matrix/objects.Matrix}.
 * @function point
 * @param {module:matrix/objects.coordinate} x - The numeric value for X-coordinate
 * @param {module:matrix/objects.coordinate} y - The numeric value for Y-coordinate
 * @param {module:matrix/objects.coordinate} [z=0] - The numeric value for Z-coordinate (default to 0 for 2D
 * {@link module:matrix/objects.Matrix})
 * @returns {module:matrix/objects.Point}
 */
    const point = function point (x, y) {
      const z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
      return {
        x: x,
        y: y,
        z: z
      }
    }
    /**
 * MatrixTile is an Object which stores a reference a {@link Point} and can be populated with additionally associated
 * fields.
 * @typedef {Object.<string, module:matrix/objects.Point>} module:matrix/objects.MatrixTile
 * @property {module:matrix/objects.Point} point - a reference to its location in a
 * {@link module:matrix/objects.Matrix}
 * @property {module:matrix/objects.axis} axis - The axis will be 'x'
 */

    /**
 * A default tile in the {@link module:matrix/objects.Matrix}
 * @function tile
 * @returns {module:matrix/objects.MatrixTile}
 */

    exports.point = point

    const tile = function tile () {
      return {
        point: {}
      }
    }
    /**
 * MatrixColumn is a DomItem which represents the x axis and also stores {@link module:matrix/objects.MatrixTile}
 * @typedef {
 * module:dom/objects.DomItem|module:matrix/objects.MatrixTile
 * } module:matrix/objects.MatrixColumn
 */

    /**
 * MatrixRow is the parent of a group of {@link module:matrix/objects.MatrixTile}
 * @typedef {module:dom/objects.DomItem} module:matrix/objects.MatrixRow
 * @property {module:matrix/objects.axis} axis - The axis will be 'y'
 * @property {Array.<module:matrix/objects.MatrixColumn>} children - all of the MatrixTile items as part of this
 * MatrixRow
 */

    /**
 * MatrixLayer is the parent of a group of {@link module:matrix/objects.MatrixTile}
 * @typedef {module:dom/objects.DomItem} module:matrix/objects.MatrixLayer
 * @property {module:matrix/objects.axis} axis - The axis will be 'y'
 * @property {Array.<module:matrix/objects.MatrixRow>} children - all of the MatrixRow items as part of this
 * MatrixLayer
 */

    /**
 * Matrix is a multi-level {@link module:dom/objects.DomItem} which is used to visually represent a
 * mathematical grid / matrix.
 * The matrix consists of four DomItem levels, at the top tier is the Matrix container with class matrix.
 * The second tier represents the z axis (with property axis='z') and has the class layer.
 * The third tier represents the y axis (with property axis='y') and has the class row.
 * The fourth (final) tier represents the x axis (with property axis='x') and has the class column.
 * The {@link module:matrix/objects.MatrixTile} is attached on the x axis tier.
 * The number of children at each level is defined by the size of the matrix, the end result is a multidimensional
 * array.
 * @typedef {module:dom/objects.DomItem} module:matrix/objects.Matrix
 * @augments module:dom/objects.DomItem
 */

    /**
 * Create a 3d matrix of i with x by y by z size, add additional objects for each layer as well
 * @function matrix
 * @param {
 * {coordinate: module:matrix/objects.coordinate, props: Array.<module:matrix/objects.MatrixTile>}
 * } x - Properties and a coordinate defining the width of the matrix.
 * @param {
 * {coordinate: module:matrix/objects.coordinate, props: Array.<module:matrix/objects.MatrixRow>}
 * } y - Properties and a coordinate defining the height of the matrix.
 * @param {
 * {coordinate: module:matrix/objects.coordinate, props: Array.<module:matrix/objects.MatrixLayer>}
 * } z - Properties and a coordinate defining the depth of the matrix.
 * @param {Array.<module:matrix/objects.Matrix>} matrixProps - Properties to be added to the matrix
 * @returns {module:matrix/objects.Matrix}
 */

    exports.tile = tile

    const matrix = function matrix () {
      const x = arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : {
            coordinate: 0,
            props: []
          }
      const y = arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : {
            coordinate: 0,
            props: []
          }
      const z = arguments.length > 2 && arguments[2] !== undefined
        ? arguments[2]
        : {
            coordinate: 1,
            props: []
          }
      const matrixProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : []

      const matrix = _objects.createDomItem.apply(void 0, [{
        tagName: 'div',
        attributes: {
          className: 'matrix'
        },
        children: []
      }].concat(_toConsumableArray(matrixProps)))

      for (let zAxis = 0; zAxis < z.coordinate; ++zAxis) {
        const layer = _objects.createDomItem.apply(void 0, [{
          axis: 'z',
          tagName: 'div',
          attributes: {
            className: 'layer'
          },
          children: [],
          parentItem: matrix
        }].concat(_toConsumableArray(z.props)))

        for (let yAxis = 0; yAxis < y.coordinate; ++yAxis) {
          const row = _objects.createDomItem.apply(void 0, [{
            axis: 'y',
            tagName: 'div',
            attributes: {
              className: 'row'
            },
            children: [],
            parentItem: layer
          }].concat(_toConsumableArray(y.props)))

          for (let xAxis = 0; xAxis < x.coordinate; ++xAxis) {
            const column = _objects.createDomItem.apply(void 0, [{
              axis: 'x',
              tagName: 'div',
              attributes: {
                className: 'column'
              },
              children: [],
              parentItem: row
            }].concat(_toConsumableArray(x.props)))

            row.children.push(column)
          }

          layer.children.push(row)
        }

        matrix.children.push(layer)
      }

      return matrix
    }
    /**
 * Return a single layer matrix where x and y are equal
 * @function square
 * @param {Array.<module:matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
 * specified point, requires MatrixTile base
 * @param {Array.<module:matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
 * @param {Array.<module:matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
 * @param {Array.<module:matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
 * @param {number} size - Used to define height and width as equal values (depth is set to 1)
 * @returns {module:matrix/objects.Matrix}
 */

    exports.matrix = matrix

    const square = function square () {
      const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      const _ref$x = _ref.x
      const x = _ref$x === void 0 ? [] : _ref$x
      const _ref$y = _ref.y
      const y = _ref$y === void 0 ? [] : _ref$y
      const _ref$z = _ref.z
      const z = _ref$z === void 0 ? [] : _ref$z
      const _ref$matrixProps = _ref.matrixProps
      const matrixProps = _ref$matrixProps === void 0 ? [] : _ref$matrixProps

      const size = arguments.length > 1 ? arguments[1] : undefined
      return matrix({
        coordinate: size,
        props: x
      }, {
        coordinate: size,
        props: y
      }, {
        coordinate: 1,
        props: z
      }, matrixProps)
    }
    /**
 * Return a matrix where x, y, and z are equal
 * @function cube
 * @param {Array.<module:matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
 * specified point, requires MatrixTile base
 * @param {Array.<module:matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
 * @param {Array.<module:matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
 * @param {Array.<module:matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
 * @param {number} size - Used to define height, width, and depth as equal values
 * @returns {module:matrix/objects.Matrix}
 */

    exports.square = square

    const cube = function cube () {
      const _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      const _ref2$x = _ref2.x
      const x = _ref2$x === void 0 ? [] : _ref2$x
      const _ref2$y = _ref2.y
      const y = _ref2$y === void 0 ? [] : _ref2$y
      const _ref2$z = _ref2.z
      const z = _ref2$z === void 0 ? [] : _ref2$z
      const _ref2$matrixProps = _ref2.matrixProps
      const matrixProps = _ref2$matrixProps === void 0 ? [] : _ref2$matrixProps

      const size = arguments.length > 1 ? arguments[1] : undefined
      return matrix({
        coordinate: size,
        props: x
      }, {
        coordinate: size,
        props: y
      }, {
        coordinate: size,
        props: z
      }, matrixProps)
    }

    exports.cube = cube
  }, { '../../dom/source/objects': 410, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.from.js': 183, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.slice.js': 195, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  415: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/es.weak-map.js')

    require('core-js/modules/esnext.weak-map.delete-all.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    require('core-js/modules/es.object.get-own-property-descriptor.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.symbol.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0

    require('core-js/modules/es.object.assign.js')

    const PseudoEvent = _interopRequireWildcard(require('./class/PseudoEvent'))

    const PseudoEventTarget = _interopRequireWildcard(require('./class/PseudoEventTarget'))

    const PseudoNode = _interopRequireWildcard(require('./class/PseudoNode'))

    const PseudoElement = _interopRequireWildcard(require('./class/PseudoElement'))

    const PseudoHTMLElement = _interopRequireWildcard(require('./class/PseudoHTMLElement'))

    const PseudoHTMLDocument = _interopRequireWildcard(require('./class/PseudoHTMLDocument'))

    function _getRequireWildcardCache (nodeInterop) { if (typeof WeakMap !== 'function') return null; const cacheBabelInterop = new WeakMap(); const cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop })(nodeInterop) }

    function _interopRequireWildcard (obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

    /**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
*/

    /**
   * All methods exported from this module are encapsulated within pseudoDom.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} pseudoDom
   * @module pseudoDom/objects
   */
    const pseudoDom = {}
    /**
   * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
   * context.
   * @function generate
   * @param {Object} root
   * @param {Object} context
   * @returns {Window|PseudoEventTarget}
   */

    pseudoDom.generate = function (root) {
      const context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

      /**
     *
     * @type {Window|PseudoEventTarget}
     */
      const newWindow = typeof root.document === 'undefined' ? root : new pseudoDom.PseudoEventTarget()
      /**
     * @type {Node|PseudoNode}
     */

      const Node = root.Node || new pseudoDom.PseudoNode()

      if (typeof newWindow.Node === 'undefined') {
        newWindow.Node = Node
      }
      /**
     *
     * @type {Element|PseudoElement}
     */

      const Element = root.Element || new pseudoDom.PseudoElement()

      if (typeof newWindow.Element === 'undefined') {
        newWindow.Element = Element
      }
      /**
     * Create an instance of HTMLElement if not available
     * @type {HTMLElement|PseudoHTMLElement}
     */

      const HTMLElement = root.HTMLElement || new pseudoDom.PseudoHTMLElement()

      if (typeof newWindow.HTMLElement === 'undefined') {
        newWindow.HTMLElement = HTMLElement
      }
      /**
     * Define document when not available
     * @type {Document|PseudoHTMLDocument}
     */

      const document = root.document || new pseudoDom.PseudoHTMLDocument()

      if (typeof newWindow.document === 'undefined') {
        newWindow.document = document
      }

      return context ? Object.assign(context, pseudoDom, newWindow) : Object.assign(root, newWindow)
    }

    const _default = Object.assign(pseudoDom, PseudoEvent, PseudoEventTarget, PseudoNode, PseudoElement, PseudoHTMLElement, PseudoHTMLDocument)

    exports.default = _default
  }, { './class/PseudoElement': 416, './class/PseudoEvent': 417, './class/PseudoEventTarget': 419, './class/PseudoHTMLDocument': 420, './class/PseudoHTMLElement': 421, './class/PseudoNode': 422, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-own-property-descriptor.js': 258, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/es.weak-map.js': 385, 'core-js/modules/esnext.weak-map.delete-all.js': 387, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  416: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.reflect.construct.js')

    require('core-js/modules/es.reflect.get.js')

    require('core-js/modules/es.object.get-own-property-descriptor.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoElement = void 0

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.function.name.js')

    require('core-js/modules/es.array.find.js')

    require('core-js/modules/es.object.set-prototype-of.js')

    require('core-js/modules/es.object.get-prototype-of.js')

    const _PseudoNode2 = require('./PseudoNode')

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _get (target, property, receiver) { if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get } else { _get = function _get (target, property, receiver) { const base = _superPropBase(target, property); if (!base) return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value } } return _get(target, property, receiver || target) }

    function _superPropBase (object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break } return object }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    /**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoNode
 * @property {string} tagName
 * @property {string} className
 * @property {string} id
 * @property {string} innerHtml
 * @property {Array} attributes
 * @property {function} hasAttribute
 * @property {function} setAttribute
 * @property {function} getAttribute
 * @property {function} removeAttribute
 */
    const PseudoElement = /* #__PURE__ */(function (_PseudoNode) {
      _inherits(PseudoElement, _PseudoNode)

      const _super = _createSuper(PseudoElement)

      /**
   * Simulate the Element object when the Dom is not available
   * @param {string} [tagName=''] - The
   * @param {array} [attributes=[]]
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @constructor
   */
      function PseudoElement () {
        let _this

        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$tagName = _ref.tagName
        const tagName = _ref$tagName === void 0 ? '' : _ref$tagName
        const _ref$attributes = _ref.attributes
        const attributes = _ref$attributes === void 0 ? [] : _ref$attributes
        const _ref$parent = _ref.parent
        const parent = _ref$parent === void 0 ? {} : _ref$parent
        const _ref$children = _ref.children
        const children = _ref$children === void 0 ? [] : _ref$children

        _classCallCheck(this, PseudoElement)

        _this = _super.call(this, {
          parent: parent,
          children: children
        })
        _this.tagName = tagName
        _this.attributes = attributes.concat([{
          name: 'className',
          value: ''
        }, {
          name: 'id',
          value: ''
        }, {
          name: 'innerHTML',
          value: ''
        }])
        /**
     * Map all incoming attributes to the attributes array and attach each as a property of this element
     */

        _this.attributes.map(function (_ref2) {
          const name = _ref2.name
          const value = _ref2.value
          _this[name] = value
          return {
            name: name,
            value: value
          }
        }) // this.classList = new DOMSettableTokenList(this.className)

        _this.classList = _this.className
        return _this
      }
      /**
   *
   * @returns {Function}
   */

      _createClass(PseudoElement, [{
        key: 'applyDefaultEvent',
        value: function applyDefaultEvent () {
          const _this2 = this

          let callback = function callback (event) {
            return undefined
          }

          switch (this.tagName) {
            case 'form':
              this.addEventListener('submit', callback)
              break

            case 'button':
            case 'input':
              if (/^(submit|image)$/i.test(this.type || '')) {
                callback = function callback (event) {
                  const forms = require('./PseudoEvent').getParentNodesFromAttribute('tagName', 'form', _this2)

                  if (forms) {
                    forms[0].submit()
                  }
                }

                _get(_getPrototypeOf(PseudoElement.prototype), 'setDefaultEvent', this).call(this, 'click', callback)
              }
          }

          return callback
        }
        /**
     *
     * @param {PseudoNode|PseudoElement} childElement
     * @returns {PseudoNode}
     */

      }, {
        key: 'appendChild',
        value: function appendChild (childElement) {
          _get(_getPrototypeOf(PseudoElement.prototype), 'appendChild', this).call(this, childElement)

          childElement.applyDefaultEvent()
          return childElement
        }
        /**
     * Check if an attribute is assigned to this element.
     * @param {string} attributeName - The attribute name to check
     * @returns {boolean}
     */

      }, {
        key: 'hasAttribute',
        value: function hasAttribute (attributeName) {
          return this.getAttribute(attributeName) !== 'undefined'
        }
        /**
     * Assign a new attribute or overwrite an assigned attribute with name and value.
     * @param {string} attributeName - The name key of the attribute to append
     * @param {string|Object} attributeValue - The value of the attribute to append
     * @returns {undefined}
     */

      }, {
        key: 'setAttribute',
        value: function setAttribute (attributeName, attributeValue) {
          if (this.hasAttribute(attributeName) || this[attributeName] === 'undefined') {
            this[attributeName] = attributeValue
            this.attributes.push({
              name: attributeName,
              value: attributeValue
            })
          }

          return undefined
        }
        /**
     * Retrieve the value of the specified attribute from the Element
     * @param {string} attributeName - A string representing the name of the attribute to be retrieved
     * @returns {string|Object}
     */

      }, {
        key: 'getAttribute',
        value: function getAttribute (attributeName) {
          return this.attributes.find(function (attribute) {
            return attribute.name === attributeName
          })
        } // noinspection JSUnusedGlobalSymbols

        /**
     * Remove an assigned attribute from the Element
     * @param {string} attributeName - The string name of the attribute to be removed
     * @returns {null}
     */

      }, {
        key: 'removeAttribute',
        value: function removeAttribute (attributeName) {
          if (this.hasAttribute(attributeName)) {
            delete this[attributeName]
            delete this.getAttribute(attributeName)
          }

          return null
        }
      }])

      return PseudoElement
    }(_PseudoNode2.PseudoNode))

    exports.PseudoElement = PseudoElement
  }, { './PseudoEvent': 417, './PseudoNode': 422, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.find.js': 179, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.get-own-property-descriptor.js': 258, 'core-js/modules/es.object.get-prototype-of.js': 261, 'core-js/modules/es.object.set-prototype-of.js': 271, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.reflect.construct.js': 281, 'core-js/modules/es.reflect.get.js': 286, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  417: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoEvent = void 0

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.array.map.js')

    require('core-js/modules/es.object.keys.js')

    require('core-js/modules/es.array.slice.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/es.array.reduce.js')

    function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    /**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {number} NONE
 * @property {number} CAPTURING_PHASE
 * @property {number} AT_TARGET
 * @property {number} BUBBLING_PHASE
 * @property {boolean} bubbles - A Boolean indicating whether the event bubbles up through the Dom or not.
 * @property {boolean} cancelable - A Boolean indicating whether the event is cancelable.
 * @property {boolean} composed - A Boolean value indicating whether or not the event can bubble across the boundary
 * between the shadow Dom and the regular Dom.
 * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
 * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
 * through re-targeting.
 * @property {boolean} defaultPrevented - Indicates whether or not event.preventDefault() has been called on the event.
 * @property {boolean} immediatePropagationStopped - Flag that no further propagation should occur, including on current
 * target.
 * @property {boolean} propagationStopped - Flag that no further propagation should occur.
 * @property {int} eventPhase - Indicates which phase of the event flow is being processed. Uses PseudoEvent constants.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether or not the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */
    const PseudoEvent = /* #__PURE__ */(function () {
      /**
   *
   * @param typeArg
   * @param bubbles
   * @param cancelable
   * @param composed
   * @returns {PseudoEvent}
   * @constructor
   */
      function PseudoEvent () {
        const _this = this

        const typeArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

        const _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        const _ref$bubbles = _ref.bubbles
        const bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles
        const _ref$cancelable = _ref.cancelable
        const cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable
        const _ref$composed = _ref.composed
        const composed = _ref$composed === void 0 ? true : _ref$composed

        _classCallCheck(this, PseudoEvent)

        let properties = {
          bubbles: bubbles,
          cancelable: cancelable,
          composed: composed,
          currentTarget: function currentTarget () {
            return undefined
          },
          defaultPrevented: false,
          immediatePropagationStopped: false,
          propagationStopped: false,
          eventPhase: '',
          target: function target () {
            return undefined
          },
          timeStamp: Math.floor(Date.now() / 1000),
          type: typeArg,
          isTrusted: true
        }

        this.setReadOnlyProperties = function () {
          const updateProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
          properties = Object.assign({}, properties, updateProps)

          _this.getReadOnlyProperties = (function (properties) {
            return function () {
              const name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
              return properties[name]
            }
          }(properties))

          return properties
        }

        this.setReadOnlyProperties()
        Object.keys(properties).map(function (propKey) {
          return Object.defineProperty(_this, propKey, {
            enumerable: true,
            get: function get () {
              return _this.getReadOnlyProperties(propKey)
            }
          })
        })
      }
      /**
   * A selector function for retrieving existing parent PseudoNode from the given child item.
   * This function will check all the parents starting from node, and scan the attributes
   * property for matches. The return array contains all matching parent ancestors.
   * WARNING: This is a recursive function.
   * @param {string} attr
   * @param {number|string} value
   * @param {PseudoNode} node
   * @returns {Array.<PseudoNode>}
   */

      _createClass(PseudoEvent, [{
        key: 'composedPath',
        value:
    /**
     * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
     * @method
     * @returns {Array.<PseudoEventTarget>}
     */
    function composedPath () {
      switch (this.eventPhase) {
        case PseudoEvent.CAPTURING_PHASE:
          return PseudoEvent.getParentNodes(this.target)

        case PseudoEvent.BUBBLING_PHASE:
          return PseudoEvent.getParentNodes(this.target).slice().reverse()

        case PseudoEvent.AT_TARGET:
          return [this.target]

        default:
          return []
      }
    }
    /**
     * Cancels the event (if it is cancelable).
     * @method
     * @returns {null}
     */

      }, {
        key: 'preventDefault',
        value: function preventDefault () {
          this.setReadOnlyProperties({
            defaultPrevented: true
          })
          return null
        }
        /**
     * For this particular event, no other listener will be called.
     * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
     * capture phase, for instance)
     * @method
     * @returns {null}
     */

      }, {
        key: 'stopImmediatePropagation',
        value: function stopImmediatePropagation () {
          this.setReadOnlyProperties({
            immediatePropagationStopped: true
          })
          return null
        }
        /**
     * Stops the propagation of events further along in the Dom.
     * @method
     * @returns {null}
     */

      }, {
        key: 'stopPropagation',
        value: function stopPropagation () {
          this.setReadOnlyProperties({
            propagationStopped: true
          })
          return null
        }
      }], [{
        key: 'getParentNodesFromAttribute',
        value: function getParentNodesFromAttribute (attr, value, node) {
          return Object.keys(node.parentNode).length ? (node.parentNode[attr] || false) === value ? PseudoEvent.getParentNodesFromAttribute(attr, value, node.parentNode).concat([node.parentNode]) : PseudoEvent.getParentNodesFromAttribute(attr, value, node.parentNode) : []
        }
        /**
     * A helper selector function for retrieving all parent PseudoNode for the given child node.
     * @param {PseudoNode} node
     * @returns {Array.<PseudoNode>}
     */

      }, {
        key: 'getParentNodes',
        value: function getParentNodes (node) {
          return PseudoEvent.getParentNodesFromAttribute('', false, node)
        }
      }])

      return PseudoEvent
    }()) // Set up the class constants

    exports.PseudoEvent = PseudoEvent;
    ['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].reduce(function (phases, phase, key) {
      Object.defineProperty(PseudoEvent, phase, {
        value: key,
        writable: false,
        static: {
          get: function get () {
            return key
          }
        }
      })
      return Object.assign({}, phases, _defineProperty({}, ''.concat(phase), key))
    }, {})
  }, { 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.map.js': 190, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.slice.js': 195, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.keys.js': 266 }],
  418: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoEventListener = void 0

    const _PseudoEvent = require('./PseudoEvent')

    /**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventTypes
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
    const PseudoEventListener = {
      eventType: '',
      eventOptions: {
        capture: false,
        once: false,
        passive: false
      },
      isDefault: false,

      /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {undefined}
   */
      handleEvent: function handleEvent (event) {
        return undefined
      },

      /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doCapturePhase: function doCapturePhase (event) {
        return event.eventPhase === _PseudoEvent.PseudoEvent.CAPTURING_PHASE && this.eventOptions.capture
      },

      /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doTargetPhase: function doTargetPhase (event) {
        return event.eventPhase === _PseudoEvent.PseudoEvent.AT_TARGET
      },

      /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      doBubblePhase: function doBubblePhase (event) {
        return event.eventPhase === _PseudoEvent.PseudoEvent.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
      },

      /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      skipPhase: function skipPhase (event) {
        return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
      },

      /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      skipDefault: function skipDefault (event) {
        return this.isDefault && event.defaultPrevented
      },

      /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      stopPropagation: function stopPropagation (event) {
        return !this.doTargetPhase(event) && event.propagationStopped
      },

      /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      nonPassiveHalt: function nonPassiveHalt (event) {
        return !this.eventOptions.passive && (this.skipDefault(event) || event.immediatePropagationStopped || this.stopPropagation(event))
      },

      /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {*|boolean}
   */
      rejectEvent: function rejectEvent (event) {
        return this.nonPassiveHalt(event) || this.skipPhase(event)
      }
    }
    exports.PseudoEventListener = PseudoEventListener
  }, { './PseudoEvent': 417 }],
  419: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoEventTarget = void 0

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.array.concat.js')

    require('core-js/modules/web.dom-collections.for-each.js')

    require('core-js/modules/es.object.keys.js')

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.array.splice.js')

    const _PseudoEvent = require('./PseudoEvent')

    const _PseudoEventListener = require('./PseudoEventListener')

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    /**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
    const PseudoEventTarget = /* #__PURE__ */(function () {
      /**
   * @constructor
   */
      function PseudoEventTarget () {
        _classCallCheck(this, PseudoEventTarget)

        this.listeners = []
        this.defaultEvent = []
      }
      /**
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */

      _createClass(PseudoEventTarget, [{
        key: 'runEvents',
        value: function runEvents (event) {
          if (!(event.type in this.listeners)) {
            return true
          }
          /**
       *
       * @type {Array<PseudoEventListener>}
       */

          const stack = this.listeners[event.type]
          let eventReturn = null
          this.listeners[event.type] = stack.reduce(
          /**
       *
       * @param {Array<PseudoEventListener>} listeners
       * @param {PseudoEventListener} listener
       * @returns {Array<PseudoEventListener>}
       */
            function (listeners, listener) {
              if (event.immediatePropagationStopped || listener.rejectEvent(event)) {
                return listeners.concat(listener)
              }

              eventReturn = listener.handleEvent(event)

              if (listener.eventOptions.once) {
                event.currentTarget.removeEventListener(event.eventType, event.handleEvent)
                return listeners
              }

              return listeners.concat(listener)
            }, [])
          return eventReturn
        }
        /**
     *
     * @param {string} type
     * @param {Function} callback
     */

      }, {
        key: 'setDefaultEvent',
        value: function setDefaultEvent (type, callback) {
          const _this = this

          if (!(type in this.listeners)) {
            this[type] = function () {
              return _this.startEvents(type)
            }

            this.listeners[type] = []
          }

          this.defaultEvent[type] = callback
        }
        /**
     *
     * @param {PseudoEvent} event
     * @returns {boolean}
     */

      }, {
        key: 'runDefaultEvent',
        value: function runDefaultEvent (event) {
          if (event.defaultPrevented) {
            return false
          }

          this.defaultEvent[event.type](event)
        }
        /**
     *
     * @param {PseudoEvent} eventType
     * @returns {boolean}
     */

      }, {
        key: 'startEvents',
        value: function startEvents (eventType) {
          const _this2 = this

          /**
       * type PseudoEvent
       */
          const event = new _PseudoEvent.PseudoEvent(eventType)
          event.setReadOnlyProperties({
            target: this
          })
          console.log('startEvents', event.type, event.target);
          [_PseudoEvent.PseudoEvent.CAPTURING_PHASE, _PseudoEvent.PseudoEvent.AT_TARGET, _PseudoEvent.PseudoEvent.BUBBLING_PHASE].forEach(function (phase) {
            let continueEvents = null

            if (phase === _PseudoEvent.PseudoEvent.AT_TARGET || !event.propagationStopped) {
              event.setReadOnlyProperties({
                eventPhase: phase
              })
              event.composedPath().forEach(function (target) {
                event.setReadOnlyProperties({
                  currentTarget: target
                })
                continueEvents = event.currentTarget.runEvents(event)
              })
            }

            if (event.eventPhase === _PseudoEvent.PseudoEvent.AT_TARGET && typeof continueEvents !== 'boolean' && _this2.defaultEvent[eventType]) {
              _this2.runDefaultEvent(event)
            }
          })
          return true
        }
        /**
     *
     * @param {string} type
     * @param {function|Object} callback
     * @param {boolean|Object} [useCapture=false]
     */

      }, {
        key: 'addEventListener',
        value: function addEventListener (type, callback) {
          const _this3 = this

          const useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
          let options = {
            capture: false,
            once: false,
            passive: false
          }

          if (_typeof(useCapture) === 'object') {
            options = Object.keys(useCapture).reduce(function (opts, opt) {
              opts[opt] = useCapture[opt]
              return opts
            }, options)
          } else {
            options.capture = useCapture
          }

          if (!(type in this.listeners)) {
            this[type] = function () {
              return _this3.startEvents(type)
            }

            this.listeners[type] = []
          }

          this.listeners[type] = this.listeners[type].concat([Object.assign(Object.create(_PseudoEventListener.PseudoEventListener), _PseudoEventListener.PseudoEventListener, {
            eventType: type,
            eventOptions: Object.assign({}, _PseudoEventListener.PseudoEventListener.eventOptions, options),
            handleEvent: (callback.handleEvent || callback).bind(this)
          })])
          const groupedDefault = this.listeners[type].reduce(function (listeners, listener) {
            return listener.isDefault
              ? Object.assign({}, listeners, {
                default: listeners.default.concat([listener])
              })
              : Object.assign({}, listeners, {
                explicit: listeners.explicit.concat([listener])
              })
          }, {
            explicit: [],
            default: []
          })
          this.listeners[type] = [].concat(groupedDefault.explicit, groupedDefault.default)
        }
        /**
     *
     * @param {string} type
     * @param {function} callback
     */

      }, {
        key: 'removeEventListener',
        value: function removeEventListener (type, callback) {
          if (!(type in this.listeners)) {
            return
          }

          const stack = this.listeners[type]

          for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i].handleEvent === callback && !stack[i].isDefault) {
              stack.splice(i, 1)
              return
            }
          }
        }
        /**
     *
     * @param {Event|PseudoEvent} event
     * @param {EventTarget|PseudoEventTarget} target
     * @returns {boolean}
     */

      }, {
        key: 'dispatchEvent',
        value: function dispatchEvent (event) {
          const target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
          event.setReadOnlyProperties({
            target: target
          })

          if (!(event.type in this.listeners)) {
            return true
          }

          this.runEvents(event)
          return !event.defaultPrevented
        }
      }])

      return PseudoEventTarget
    }())

    exports.PseudoEventTarget = PseudoEventTarget
  }, { './PseudoEvent': 417, './PseudoEventListener': 418, 'core-js/modules/es.array.concat.js': 173, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.splice.js': 199, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.keys.js': 266, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.for-each.js': 388, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  420: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.reflect.construct.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoHTMLDocument = void 0

    require('core-js/modules/es.object.set-prototype-of.js')

    require('core-js/modules/es.object.get-prototype-of.js')

    const _PseudoHTMLElement2 = require('./PseudoHTMLElement')

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    /**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
    const PseudoHTMLDocument = /* #__PURE__ */(function (_PseudoHTMLElement) {
      _inherits(PseudoHTMLDocument, _PseudoHTMLElement)

      const _super = _createSuper(PseudoHTMLDocument)

      /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @returns {PseudoHTMLDocument}
   * @constructor
   */
      function PseudoHTMLDocument () {
        let _this

        _classCallCheck(this, PseudoHTMLDocument)

        _this = _super.call(this)
        const html = new _PseudoHTMLElement2.PseudoHTMLElement({
          tagName: 'html',
          parent: _assertThisInitialized(_this)
        })
        /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */

        _this.head = new _PseudoHTMLElement2.PseudoHTMLElement({
          tagName: 'head',
          parent: html
        })
        /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */

        _this.body = new _PseudoHTMLElement2.PseudoHTMLElement({
          tagName: 'body',
          parent: html
        })
        html.children = [_this.head, _this.body]
        /**
     * Create document child element
     * @type {PseudoHTMLElement[]}
     */

        _this.children = [html]
        return _this
      }
      /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */

      _createClass(PseudoHTMLDocument, [{
        key: 'createElement',
        value: function createElement () {
          const tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div'
          const returnElement = new _PseudoHTMLElement2.PseudoHTMLElement({
            tagName: tagName
          })
          returnElement.parent = this
          return returnElement
        }
      }])

      return PseudoHTMLDocument
    }(_PseudoHTMLElement2.PseudoHTMLElement))

    exports.PseudoHTMLDocument = PseudoHTMLDocument
  }, { './PseudoHTMLElement': 421, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.get-prototype-of.js': 261, 'core-js/modules/es.object.set-prototype-of.js': 271, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.reflect.construct.js': 281, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  421: [function (require, module, exports) {
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    require('core-js/modules/es.reflect.construct.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoHTMLElement = void 0

    require('core-js/modules/es.object.set-prototype-of.js')

    require('core-js/modules/es.object.get-prototype-of.js')

    const _PseudoElement2 = require('./PseudoElement')

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    /**
 * Simulate the behaviour of the HTMLElement Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoElement
 * @property {boolean} hidden - State of whether element is visible
 * @property {number} offsetHeight - The height of the element as offset by the parent element
 * @property {number} offsetLeft - The position of the left side of the element based on the parent element
 * @property {PseudoHTMLElement} offsetParent - A reference to the closest positioned parent element
 * @property {number} offsetTop - The position of the top side of the element based on the parent element
 * @property {number} offsetWidth - The width of the element as offset by the parent element
 * @property {Object} style - A container to define all applied inline-styles
 * @property {string} title - The title attribute which affects the text visible on hover
 */
    const PseudoHTMLElement = /* #__PURE__ */(function (_PseudoElement) {
      _inherits(PseudoHTMLElement, _PseudoElement)

      const _super = _createSuper(PseudoHTMLElement)

      /**
   * Simulate the HTMLELement object when the Dom is not available
   * @param {string} [tagName=''] - The
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @returns {PseudoHTMLElement}
   * @constructor
   */
      function PseudoHTMLElement () {
        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$tagName = _ref.tagName
        const tagName = _ref$tagName === void 0 ? '' : _ref$tagName
        const _ref$parent = _ref.parent
        const parent = _ref$parent === void 0 ? {} : _ref$parent
        const _ref$children = _ref.children
        const children = _ref$children === void 0 ? [] : _ref$children

        _classCallCheck(this, PseudoHTMLElement)

        return _super.call(this, {
          tagName: tagName,
          attributes: [{
            name: 'hidden',
            value: false
          }, {
            name: 'offsetHeight',
            value: 0
          }, {
            name: 'offsetLeft',
            value: 0
          }, {
            name: 'offsetParent',
            value: null
          }, {
            name: 'offsetTop',
            value: 0
          }, {
            name: 'offsetWidth',
            value: 0
          }, {
            name: 'style',
            value: {}
          }, {
            name: 'title',
            value: ''
          }],
          parent: parent,
          children: children
        })
      }

      return PseudoHTMLElement
    }(_PseudoElement2.PseudoElement))

    exports.PseudoHTMLElement = PseudoHTMLElement
  }, { './PseudoElement': 416, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.object.get-prototype-of.js': 261, 'core-js/modules/es.object.set-prototype-of.js': 271, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.reflect.construct.js': 281, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  422: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/es.reflect.construct.js')

    require('core-js/modules/es.symbol.js')

    require('core-js/modules/es.symbol.description.js')

    require('core-js/modules/es.object.to-string.js')

    require('core-js/modules/es.symbol.iterator.js')

    require('core-js/modules/es.array.iterator.js')

    require('core-js/modules/es.string.iterator.js')

    require('core-js/modules/web.dom-collections.iterator.js')

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.generateNode = exports.NodeFactory = exports.PseudoNode = void 0

    require('core-js/modules/es.array.index-of.js')

    require('core-js/modules/es.function.name.js')

    require('core-js/modules/es.array.splice.js')

    require('core-js/modules/es.array.reduce.js')

    require('core-js/modules/es.object.assign.js')

    require('core-js/modules/es.object.set-prototype-of.js')

    require('core-js/modules/es.object.get-prototype-of.js')

    const _TreeLinker2 = require('../../collections/classes/TreeLinker')

    const _PseudoEventTarget2 = require('./PseudoEventTarget')

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    /**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
    const PseudoNode = /* #__PURE__ */(function (_PseudoEventTarget) {
      _inherits(PseudoNode, _PseudoEventTarget)

      const _super = _createSuper(PseudoNode)

      /**
   *
   * @constructor
   */
      function PseudoNode () {
        let _this

        _classCallCheck(this, PseudoNode)

        _this = _super.call(this)
        _this.nodeValue = ''
        _this.textContext = ''
        _this.children = []
        _this.parent = undefined
        return _this
      }

      _createClass(PseudoNode, [{
        key: 'baseURI',
        get: function get () {
          return window.location || '/'
        }
      }, {
        key: 'childNodes',
        get: function get () {
          return this.children
        }
      }, {
        key: 'firstChild',
        get: function get () {
          return this.children[0]
        }
      }, {
        key: 'isConnected',
        get: function get () {
          return !!this.parent
        }
      }, {
        key: 'lastChild',
        get: function get () {
          return this.children[this.children.length - 1]
        }
      }, {
        key: 'nextSibling',
        get: function get () {
          return this.isConnected ? this.parent.children[this.parent.children.indexOf(this) + 1] : null
        }
      }, {
        key: 'nodeName',
        get: function get () {
          return this.name || ''
        }
      }, {
        key: 'nodeType',
        get: function get () {
          const typeName = 'DEFAULT_NODE'
          const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
          return nodeTypes.indexOf(typeName)
        }
      }, {
        key: 'ownerDocument',
        get: function get () {
          return undefined
        }
      }, {
        key: 'parentNode',
        get: function get () {
          return this.parent
        }
      }, {
        key: 'parentElement',
        get: function get () {
          return this.parent.nodeType === 1 ? this.parent : null
        }
      }, {
        key: 'previousSibling',
        get: function get () {
          return this.isConnected ? this.parent.children[this.parent.children.indexOf(this) - 1] : null
        }
        /**
     *
     * @param {PseudoNode} childNode
     * @returns {PseudoNode}
     */

      }, {
        key: 'appendChild',
        value: function appendChild (childNode) {
          this.children.push(childNode)
          return childNode
        }
      }, {
        key: 'cloneNode',
        value: function cloneNode () {}
      }, {
        key: 'compareDocumentPosition',
        value: function compareDocumentPosition () {}
      }, {
        key: 'contains',
        value: function contains () {}
      }, {
        key: 'getRootNode',
        value: function getRootNode () {
          return this.parent.getRootNode() || this.parent
        }
      }, {
        key: 'hasChildNodes',
        value: function hasChildNodes () {
          return this.children.length > 0
        }
      }, {
        key: 'insertBefore',
        value: function insertBefore () {}
      }, {
        key: 'isDefaultNamespace',
        value: function isDefaultNamespace () {}
      }, {
        key: 'isEqualNode',
        value: function isEqualNode () {}
      }, {
        key: 'isSameNode',
        value: function isSameNode () {}
      }, {
        key: 'lookupPrefix',
        value: function lookupPrefix () {}
      }, {
        key: 'lookupNamespaceURI',
        value: function lookupNamespaceURI () {}
      }, {
        key: 'normalize',
        value: function normalize () {}
        /**
     *
     * @param {PseudoNode} childElement
     * @returns {PseudoNode}
     */

      }, {
        key: 'removeChild',
        value: function removeChild (childElement) {
          return this.children.splice(this.children.indexOf(childElement), 1)[0]
        }
      }, {
        key: 'replaceChild',
        value: function replaceChild () {}
      }])

      return PseudoNode
    }(_PseudoEventTarget2.PseudoEventTarget))

    exports.PseudoNode = PseudoNode

    const NodeFactory = /* #__PURE__ */(function (_TreeLinker) {
      _inherits(NodeFactory, _TreeLinker)

      const _super2 = _createSuper(NodeFactory)

      function NodeFactory () {
        _classCallCheck(this, NodeFactory)

        return _super2.apply(this, arguments)
      }

      return NodeFactory
    }(_TreeLinker2.TreeLinker))

    exports.NodeFactory = NodeFactory

    const generateNode = function generateNode () {
      NodeFactory.fromArray = function () {
        const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NodeFactory
        return values.reduce(function (list, element) {
          if (_typeof(element) !== 'object') {
            element = {
              data: element
            }
          }

          let newList = false

          if (list === null) {
            newList = true
            list = new LinkerClass(Object.assign({}, element, {
              prev: list
            }))
          }
          /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */

          const PseudoNodeAttached = /* #__PURE__ */(function (_PseudoNode) {
            _inherits(PseudoNodeAttached, _PseudoNode)

            const _super3 = _createSuper(PseudoNodeAttached)

            /**
         *
         * @constructor
         */
            function PseudoNodeAttached () {
              let _this2

              _classCallCheck(this, PseudoNodeAttached)

              _this2 = _super3.call(this)
              _this2.nodeValue = element.data
              _this2.textContext = ''
              return _this2
            }

            _createClass(PseudoNodeAttached, [{
              key: 'baseURI',
              get: function get () {
                return window.location || '/'
              }
            }, {
              key: 'childNodes',
              get: function get () {
                return list.children
              }
            }, {
              key: 'firstChild',
              get: function get () {
                return list.children.first.data
              }
            }, {
              key: 'isConnected',
              get: function get () {
                return list.parent !== null
              }
            }, {
              key: 'lastChild',
              get: function get () {
                return list.children.last.data
              }
            }, {
              key: 'nextSibling',
              get: function get () {
                return list.next.data
              }
            }, {
              key: 'nodeName',
              get: function get () {
                return this.name || ''
              }
            }, {
              key: 'nodeType',
              get: function get () {
                const typeName = 'DEFAULT_NODE'
                const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
                return nodeTypes.indexOf(typeName)
              }
            }, {
              key: 'ownerDocument',
              get: function get () {
                return list.rootParent
              }
            }, {
              key: 'parentNode',
              get: function get () {
                return list.parent
              }
            }, {
              key: 'parentElement',
              get: function get () {
                return list.parent.nodeType === 1 ? list.parent : null
              }
            }, {
              key: 'previousSibling',
              get: function get () {
                return list.prev
              }
              /**
           *
           * @param {PseudoNode} childNode
           * @returns {PseudoNode}
           */

            }, {
              key: 'appendChild',
              value: function appendChild (childNode) {
                list.after(list, [childNode])
                return childNode
              }
            }, {
              key: 'cloneNode',
              value: function cloneNode () {}
            }, {
              key: 'compareDocumentPosition',
              value: function compareDocumentPosition () {}
            }, {
              key: 'contains',
              value: function contains () {}
            }, {
              key: 'getRootNode',
              value: function getRootNode () {
                return list.rootParent
              }
            }, {
              key: 'hasChildNodes',
              value: function hasChildNodes () {}
            }, {
              key: 'insertBefore',
              value: function insertBefore () {}
            }, {
              key: 'isDefaultNamespace',
              value: function isDefaultNamespace () {}
            }, {
              key: 'isEqualNode',
              value: function isEqualNode () {}
            }, {
              key: 'isSameNode',
              value: function isSameNode () {}
            }, {
              key: 'lookupPrefix',
              value: function lookupPrefix () {}
            }, {
              key: 'lookupNamespaceURI',
              value: function lookupNamespaceURI () {}
            }, {
              key: 'normalize',
              value: function normalize () {}
              /**
           *
           * @param {PseudoNode} childElement
           * @returns {PseudoNode}
           */

            }, {
              key: 'removeChild',
              value: function removeChild (childElement) {
                return this.children.splice(this.children.indexOf(childElement), 1)[0]
              }
            }, {
              key: 'replaceChild',
              value: function replaceChild () {}
            }])

            return PseudoNodeAttached
          }(PseudoNode))

          if (newList) {
            list.data = new PseudoNodeAttached()
            return list
          }

          element.data = new PseudoNodeAttached()
          return _TreeLinker2.TreeLinker.prototype.after.apply(list, [element])
        }, null)
      }

      return NodeFactory
    }

    exports.generateNode = generateNode
  }, { '../../collections/classes/TreeLinker': 407, './PseudoEventTarget': 419, 'core-js/modules/es.array.index-of.js': 185, 'core-js/modules/es.array.iterator.js': 187, 'core-js/modules/es.array.reduce.js': 193, 'core-js/modules/es.array.splice.js': 199, 'core-js/modules/es.function.name.js': 214, 'core-js/modules/es.object.assign.js': 249, 'core-js/modules/es.object.get-prototype-of.js': 261, 'core-js/modules/es.object.set-prototype-of.js': 271, 'core-js/modules/es.object.to-string.js': 272, 'core-js/modules/es.reflect.construct.js': 281, 'core-js/modules/es.string.iterator.js': 314, 'core-js/modules/es.symbol.description.js': 336, 'core-js/modules/es.symbol.iterator.js': 339, 'core-js/modules/es.symbol.js': 340, 'core-js/modules/web.dom-collections.iterator.js': 389 }],
  423: [function (require, module, exports) {
    /**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

    const runtime = (function (exports) {
      'use strict'

      const Op = Object.prototype
      const hasOwn = Op.hasOwnProperty
      let undefined // More compressible than void 0.
      const $Symbol = typeof Symbol === 'function' ? Symbol : {}
      const iteratorSymbol = $Symbol.iterator || '@@iterator'
      const asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator'
      const toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag'

      function define (obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        })
        return obj[key]
      }
      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, '')
      } catch (err) {
        define = function (obj, key, value) {
          return obj[key] = value
        }
      }

      function wrap (innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        const protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator
        const generator = Object.create(protoGenerator.prototype)
        const context = new Context(tryLocsList || [])

        // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.
        generator._invoke = makeInvokeMethod(innerFn, self, context)

        return generator
      }
      exports.wrap = wrap

      // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.
      function tryCatch (fn, obj, arg) {
        try {
          return { type: 'normal', arg: fn.call(obj, arg) }
        } catch (err) {
          return { type: 'throw', arg: err }
        }
      }

      const GenStateSuspendedStart = 'suspendedStart'
      const GenStateSuspendedYield = 'suspendedYield'
      const GenStateExecuting = 'executing'
      const GenStateCompleted = 'completed'

      // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.
      const ContinueSentinel = {}

      // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.
      function Generator () {}
      function GeneratorFunction () {}
      function GeneratorFunctionPrototype () {}

      // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.
      let IteratorPrototype = {}
      IteratorPrototype[iteratorSymbol] = function () {
        return this
      }

      const getProto = Object.getPrototypeOf
      const NativeIteratorPrototype = getProto && getProto(getProto(values([])))
      if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype
      }

      const Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype)
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype
      GeneratorFunctionPrototype.constructor = GeneratorFunction
      GeneratorFunction.displayName = define(
        GeneratorFunctionPrototype,
        toStringTagSymbol,
        'GeneratorFunction'
      )

      // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.
      function defineIteratorMethods (prototype) {
        ['next', 'throw', 'return'].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg)
          })
        })
      }

      exports.isGeneratorFunction = function (genFun) {
        const ctor = typeof genFun === 'function' && genFun.constructor
        return ctor
          ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === 'GeneratorFunction'
          : false
      }

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype
          define(genFun, toStringTagSymbol, 'GeneratorFunction')
        }
        genFun.prototype = Object.create(Gp)
        return genFun
      }

      // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.
      exports.awrap = function (arg) {
        return { __await: arg }
      }

      function AsyncIterator (generator, PromiseImpl) {
        function invoke (method, arg, resolve, reject) {
          const record = tryCatch(generator[method], generator, arg)
          if (record.type === 'throw') {
            reject(record.arg)
          } else {
            const result = record.arg
            const value = result.value
            if (value &&
            typeof value === 'object' &&
            hasOwn.call(value, '__await')) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke('next', value, resolve, reject)
              }, function (err) {
                invoke('throw', err, resolve, reject)
              })
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped
              resolve(result)
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke('throw', error, resolve, reject)
            })
          }
        }

        let previousPromise

        function enqueue (method, arg) {
          function callInvokeWithMethodAndArg () {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject)
            })
          }

          return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg()
        }

        // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).
        this._invoke = enqueue
      }

      defineIteratorMethods(AsyncIterator.prototype)
      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this
      }
      exports.AsyncIterator = AsyncIterator

      // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.
      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise

        const iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        )

        return exports.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function (result) {
            return result.done ? result.value : iter.next()
          })
      }

      function makeInvokeMethod (innerFn, self, context) {
        let state = GenStateSuspendedStart

        return function invoke (method, arg) {
          if (state === GenStateExecuting) {
            throw new Error('Generator is already running')
          }

          if (state === GenStateCompleted) {
            if (method === 'throw') {
              throw arg
            }

            // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            return doneResult()
          }

          context.method = method
          context.arg = arg

          while (true) {
            const delegate = context.delegate
            if (delegate) {
              const delegateResult = maybeInvokeDelegate(delegate, context)
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue
                return delegateResult
              }
            }

            if (context.method === 'next') {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg
            } else if (context.method === 'throw') {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted
                throw context.arg
              }

              context.dispatchException(context.arg)
            } else if (context.method === 'return') {
              context.abrupt('return', context.arg)
            }

            state = GenStateExecuting

            const record = tryCatch(innerFn, self, context)
            if (record.type === 'normal') {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done
                ? GenStateCompleted
                : GenStateSuspendedYield

              if (record.arg === ContinueSentinel) {
                continue
              }

              return {
                value: record.arg,
                done: context.done
              }
            } else if (record.type === 'throw') {
              state = GenStateCompleted
              // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.
              context.method = 'throw'
              context.arg = record.arg
            }
          }
        }
      }

      // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.
      function maybeInvokeDelegate (delegate, context) {
        const method = delegate.iterator[context.method]
        if (method === undefined) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null

          if (context.method === 'throw') {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator.return) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = 'return'
              context.arg = undefined
              maybeInvokeDelegate(delegate, context)

              if (context.method === 'throw') {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel
              }
            }

            context.method = 'throw'
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method")
          }

          return ContinueSentinel
        }

        const record = tryCatch(method, delegate.iterator, context.arg)

        if (record.type === 'throw') {
          context.method = 'throw'
          context.arg = record.arg
          context.delegate = null
          return ContinueSentinel
        }

        const info = record.arg

        if (!info) {
          context.method = 'throw'
          context.arg = new TypeError('iterator result is not an object')
          context.delegate = null
          return ContinueSentinel
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value

          // Resume execution at the desired location (see delegateYield).
          context.next = delegate.nextLoc

          // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.
          if (context.method !== 'return') {
            context.method = 'next'
            context.arg = undefined
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info
        }

        // The delegate iterator is finished, so forget it and continue with
        // the outer generator.
        context.delegate = null
        return ContinueSentinel
      }

      // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.
      defineIteratorMethods(Gp)

      define(Gp, toStringTagSymbol, 'Generator')

      // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.
      Gp[iteratorSymbol] = function () {
        return this
      }

      Gp.toString = function () {
        return '[object Generator]'
      }

      function pushTryEntry (locs) {
        const entry = { tryLoc: locs[0] }

        if (1 in locs) {
          entry.catchLoc = locs[1]
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2]
          entry.afterLoc = locs[3]
        }

        this.tryEntries.push(entry)
      }

      function resetTryEntry (entry) {
        const record = entry.completion || {}
        record.type = 'normal'
        delete record.arg
        entry.completion = record
      }

      function Context (tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{ tryLoc: 'root' }]
        tryLocsList.forEach(pushTryEntry, this)
        this.reset(true)
      }

      exports.keys = function (object) {
        const keys = []
        for (const key in object) {
          keys.push(key)
        }
        keys.reverse()

        // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.
        return function next () {
          while (keys.length) {
            const key = keys.pop()
            if (key in object) {
              next.value = key
              next.done = false
              return next
            }
          }

          // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.
          next.done = true
          return next
        }
      }

      function values (iterable) {
        if (iterable) {
          const iteratorMethod = iterable[iteratorSymbol]
          if (iteratorMethod) {
            return iteratorMethod.call(iterable)
          }

          if (typeof iterable.next === 'function') {
            return iterable
          }

          if (!isNaN(iterable.length)) {
            let i = -1; const next = function next () {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i]
                  next.done = false
                  return next
                }
              }

              next.value = undefined
              next.done = true

              return next
            }

            return next.next = next
          }
        }

        // Return an iterator with no values.
        return { next: doneResult }
      }
      exports.values = values

      function doneResult () {
        return { value: undefined, done: true }
      }

      Context.prototype = {
        constructor: Context,

        reset: function (skipTempReset) {
          this.prev = 0
          this.next = 0
          // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.
          this.sent = this._sent = undefined
          this.done = false
          this.delegate = null

          this.method = 'next'
          this.arg = undefined

          this.tryEntries.forEach(resetTryEntry)

          if (!skipTempReset) {
            for (const name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === 't' &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
                this[name] = undefined
              }
            }
          }
        },

        stop: function () {
          this.done = true

          const rootEntry = this.tryEntries[0]
          const rootRecord = rootEntry.completion
          if (rootRecord.type === 'throw') {
            throw rootRecord.arg
          }

          return this.rval
        },

        dispatchException: function (exception) {
          if (this.done) {
            throw exception
          }

          const context = this
          function handle (loc, caught) {
            record.type = 'throw'
            record.arg = exception
            context.next = loc

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = 'next'
              context.arg = undefined
            }

            return !!caught
          }

          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i]
            var record = entry.completion

            if (entry.tryLoc === 'root') {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle('end')
            }

            if (entry.tryLoc <= this.prev) {
              const hasCatch = hasOwn.call(entry, 'catchLoc')
              const hasFinally = hasOwn.call(entry, 'finallyLoc')

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true)
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc)
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true)
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc)
                }
              } else {
                throw new Error('try statement without catch or finally')
              }
            }
          }
        },

        abrupt: function (type, arg) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i]
            if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, 'finallyLoc') &&
            this.prev < entry.finallyLoc) {
              var finallyEntry = entry
              break
            }
          }

          if (finallyEntry &&
          (type === 'break' ||
           type === 'continue') &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null
          }

          const record = finallyEntry ? finallyEntry.completion : {}
          record.type = type
          record.arg = arg

          if (finallyEntry) {
            this.method = 'next'
            this.next = finallyEntry.finallyLoc
            return ContinueSentinel
          }

          return this.complete(record)
        },

        complete: function (record, afterLoc) {
          if (record.type === 'throw') {
            throw record.arg
          }

          if (record.type === 'break' ||
          record.type === 'continue') {
            this.next = record.arg
          } else if (record.type === 'return') {
            this.rval = this.arg = record.arg
            this.method = 'return'
            this.next = 'end'
          } else if (record.type === 'normal' && afterLoc) {
            this.next = afterLoc
          }

          return ContinueSentinel
        },

        finish: function (finallyLoc) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i]
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc)
              resetTryEntry(entry)
              return ContinueSentinel
            }
          }
        },

        catch: function (tryLoc) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i]
            if (entry.tryLoc === tryLoc) {
              const record = entry.completion
              if (record.type === 'throw') {
                var thrown = record.arg
                resetTryEntry(entry)
              }
              return thrown
            }
          }

          // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.
          throw new Error('illegal catch attempt')
        },

        delegateYield: function (iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          }

          if (this.method === 'next') {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined
          }

          return ContinueSentinel
        }
      }

      // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.
      return exports
    }(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      typeof module === 'object' ? module.exports : {}
    ))

    try {
      regeneratorRuntime = runtime
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function('r', 'regeneratorRuntime = r')(runtime)
    }
  }, {}]
}, {}, [402, 411])
