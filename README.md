# battleship

This is just a fun project creating a game of battleship. Experimenting with functional programming and ES6 features.

A relatively recent version is running at https: //joshuaheagle.com/battleship/
## Modules

<dl>
<dt><a href="#module_numberHelpers">numberHelpers</a></dt>
<dd><p>Some number comparators and random number generators.</p>
</dd>
<dt><a href="#module_functionalHelpers">functionalHelpers</a></dt>
<dd><p>All of the functionalHelpers system functions for stringing together functions and simplifying logic.</p>
</dd>
<dt><a href="#module_collections">collections</a></dt>
<dd><p>All of the JSON DOM system functions for creating JSON components.</p>
</dd>
<dt><a href="#module_jDom">jDom</a></dt>
<dd><p>All of the JSON DOM system functions for creating JSON components.</p>
</dd>
<dt><a href="#module_jsonDom">jsonDom</a></dt>
<dd><p>All of the JSON DOM system functions for creating JSON components.</p>
</dd>
<dt><a href="#module_jDomMatrix">jDomMatrix</a></dt>
<dd><p>Add matrix ability using JSON DOM components</p>
</dd>
<dt><a href="#module_pseudoDom/objects">pseudoDom/objects</a> : <code>Object</code></dt>
<dd><p>All methods exported from this module are encapsulated within pseudoDom.</p>
</dd>
<dt><a href="#module_setup">setup</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_pieces">pieces</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_main">main</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_layout">layout</a> : <code>Object</code></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_functions">functions</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_actions">actions</a> : <code>Object</code></dt>
<dd><p>All methods exported from this module are encapsulated within gameActions.</p>
</dd>
<dt><a href="#module_game/setup">game/setup</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_game/functions">game/functions</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_game/actions">game/actions</a> : <code>Object</code></dt>
<dd><p>All methods exported from this module are encapsulated within gameActions.</p>
</dd>
<dt><a href="#module_game/pieces">game/pieces</a></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
<dt><a href="#module_game/layout">game/layout</a> : <code>Object</code></dt>
<dd><p>A reference to all functions to be used globally / exported</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#uniqueArray">uniqueArray(array)</a> ⇒ <code>Array</code></dt>
<dd><p>Remove duplicate values from an array.</p>
</dd>
<dt><a href="#compareArrayResult">compareArrayResult(arr1, arr2)</a> ⇒ <code>Array.&lt;module:arrayHelpers~compareArrayResult&gt;</code></dt>
<dd><p>Store the comparison result for an element that may exist in either of compared arrays.</p>
<ul>
<li>value stores the element value from the arrays being compared</li>
<li>results has the comparison results where first index (0) is result for first compared array
and the second index (1) will be the result for the second compared array</li>
</ul>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#documentItem">documentItem</a> : <code>module:jDom/core/dom/objects.documentItem</code></dt>
<dd><p>Create new private reference to the document</p>
</dd>
<dt><a href="#callWithMissing">callWithMissing</a> ⇒ <code>*</code></dt>
<dd><p>The return function which takes the missing parameter in order to call the preloaded function.</p>
</dd>
<dt><a href="#delayHandler">delayHandler</a> : <code>Object</code></dt>
<dd><p>Provide a way to cancel a request or attach a resolve event.</p>
</dd>
<dt><a href="#queueManagerHandle">queueManagerHandle</a> ⇒ <code>Promise</code></dt>
<dd><p>Each time queue handle is called the passed function is added to the queue to be called when ready.</p>
</dd>
<dt><a href="#queueTimeoutHandle">queueTimeoutHandle</a> ⇒ <code>Promise</code></dt>
<dd><p>Run Timeout functions one after the otherin queue.</p>
</dd>
</dl>

<a name="module_numberHelpers"></a>

## numberHelpers
Some number comparators and random number generators.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [numberHelpers](#module_numberHelpers)
    * _static_
        * [.isObject](#module_numberHelpers.isObject) ⇒ <code>Array.&lt;(string\|number)&gt;</code>
        * [.objectKeys](#module_numberHelpers.objectKeys) ⇒ <code>Array</code>
        * [.emptyObject](#module_numberHelpers.emptyObject) ⇒ <code>boolean</code>
        * [.describeObjectDetail](#module_numberHelpers.describeObjectDetail) ⇒ <code>module:descriptorSamples~descriptorDetail</code>
        * [.sameDescriptor](#module_numberHelpers.sameDescriptor) ⇒ <code>number</code> \| <code>undefined</code>
        * [.getAbsoluteMax(num1, num2)](#module_numberHelpers.getAbsoluteMax) ⇒ <code>number</code>
        * [.getAbsoluteMin(range, [offset], [interval])](#module_numberHelpers.getAbsoluteMin) ⇒ <code>number</code>
        * [.randomNumber(range, [offset], [interval])](#module_numberHelpers.randomNumber) ⇒ <code>number</code>
        * [.randomInteger(val1, val2)](#module_numberHelpers.randomInteger) ⇒ <code>number</code>
        * [.setValue(item, key, value)](#module_numberHelpers.setValue) ⇒ <code>\*</code>
        * [.objectValues(obj, fn, [thisArg])](#module_numberHelpers.objectValues) ⇒ <code>Object</code> \| <code>Array</code>
        * [.mapObject(obj, fn, [thisArg])](#module_numberHelpers.mapObject) ⇒ <code>Object</code> \| <code>Array</code>
        * [.filterObject(obj, fn, [initialValue])](#module_numberHelpers.filterObject) ⇒ <code>Object</code> \| <code>Array</code>
        * [.reduceObject(item)](#module_numberHelpers.reduceObject) ⇒ <code>boolean</code>
        * [.isInstanceObject(value)](#module_numberHelpers.isInstanceObject) ⇒ <code>boolean</code>
        * [.isCloneable([options])](#module_numberHelpers.isCloneable) ⇒ [<code>mergeObjectsCallback</code>](#module_objects..mergeObjectsCallback)
        * [.mergeObjectsBase(...objects)](#module_numberHelpers.mergeObjectsBase) ⇒ <code>\*</code>
        * [.mergeObjects(...objects)](#module_numberHelpers.mergeObjects) ⇒ <code>\*</code>
        * [.mergeObjectsMutable(object, [options])](#module_numberHelpers.mergeObjectsMutable) ⇒ <code>Object</code>
        * [.assignDescriptor(object)](#module_numberHelpers.assignDescriptor) ⇒ <code>module:descriptorSamples~descriptor</code>
        * [.describeObject(descriptor1, descriptor2)](#module_numberHelpers.describeObject) ⇒ <code>boolean</code>
    * _inner_
        * [~mapCallback](#module_numberHelpers..mapCallback) ⇒ <code>\*</code>
        * [~filterCallback](#module_numberHelpers..filterCallback) ⇒ <code>boolean</code>
        * [~reduceCallback](#module_numberHelpers..reduceCallback) ⇒ <code>\*</code>

<a name="module_numberHelpers.isObject"></a>

### numberHelpers.isObject ⇒ <code>Array.&lt;(string\|number)&gt;</code>
Get an array of keys from any object or array. Will return empty array when invalid or there are no keys.Optional flag will include the inherited keys from prototype chain when set.

**Kind**: static property of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| object | <code>Object</code> \| <code>Array</code> |  | 
| [includeInherited] | <code>boolean</code> | <code>false</code> | 

<a name="module_numberHelpers.objectKeys"></a>

### numberHelpers.objectKeys ⇒ <code>Array</code>
Get an array of values from any object or array. Will return empty array when invalid or there are no values.Optional flag will include the inherited values from prototype chain when set.

**Kind**: static property of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| object | <code>Object</code> \| <code>Array</code> |  | 
| [includeInherited] | <code>boolean</code> | <code>false</code> | 

<a name="module_numberHelpers.emptyObject"></a>

### numberHelpers.emptyObject ⇒ <code>boolean</code>
Check if the current object has inherited properties.

**Kind**: static property of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type |
| --- | --- |
| object | <code>Object</code> \| <code>Array</code> | 

<a name="module_numberHelpers.describeObjectDetail"></a>

### numberHelpers.describeObjectDetail ⇒ <code>module:descriptorSamples~descriptorDetail</code>
Get a new copy of an existing Descriptor Detail

**Kind**: static property of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type |
| --- | --- |
| originalDetail | <code>module:descriptorSamples~descriptorDetail</code> | 

<a name="module_numberHelpers.sameDescriptor"></a>

### numberHelpers.sameDescriptor ⇒ <code>number</code> \| <code>undefined</code>
Find the index of the next descriptorDetail to build a resource for.

**Kind**: static property of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type |
| --- | --- |
| descriptor | <code>module:descriptorSamples~descriptor</code> | 
| currentReference | <code>number</code> | 

<a name="module_numberHelpers.getAbsoluteMax"></a>

### numberHelpers.getAbsoluteMax(num1, num2) ⇒ <code>number</code>
Helper for returning the absolute min value

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| num1 | <code>number</code> | A number to compare |
| num2 | <code>number</code> | Another number to be compared against |

<a name="module_numberHelpers.getAbsoluteMin"></a>

### numberHelpers.getAbsoluteMin(range, [offset], [interval]) ⇒ <code>number</code>
Create a single random number within provided range. And with optional offset,The distance between the result numbers can be adjusted with interval.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| range | <code>number</code> |  | Choose the breadth of the random number (0-100 would be 100 for range) |
| [offset] | <code>number</code> | <code>0</code> | Choose the starting number (1-10 would be 1 for offset, 9 for range) |
| [interval] | <code>number</code> | <code>1</code> | Choose the distance between numbers (~5, ~10, ~15 would be 5 for interval, 1 for offset, 2 for range) |

<a name="module_numberHelpers.randomNumber"></a>

### numberHelpers.randomNumber(range, [offset], [interval]) ⇒ <code>number</code>
Create a single random integer within provide range. And with optional offset,The distance between the result numbers can be adjusted with interval.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| range | <code>number</code> |  | Choose the breadth of the random number (0-100 would be 100 for range) |
| [offset] | <code>number</code> | <code>0</code> | Choose the starting number (1-10 would be 1 for offset, 9 for range) |
| [interval] | <code>number</code> | <code>1</code> | Choose the distance between numbers (5, 10, 15 would be 5 for interval, 1 for offset, 2 for range) |

<a name="module_numberHelpers.randomInteger"></a>

### numberHelpers.randomInteger(val1, val2) ⇒ <code>number</code>
Compare two numbers and return:-1 to indicate val1 is less than val20 to indicate both values are the equal1 to indicate val1 is greater than val2

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| val1 | <code>number</code> | The first number to compare |
| val2 | <code>number</code> | The second number to compare |

<a name="module_numberHelpers.setValue"></a>

### numberHelpers.setValue(item, key, value) ⇒ <code>\*</code>
Set a value on an item, then return the value

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> \| <code>Array</code> | An object or array to be updated |
| key | <code>string</code> \| <code>number</code> | The key on the item which will have its value set |
| value | <code>\*</code> | Any value to be applied to the key |

<a name="module_numberHelpers.objectValues"></a>

### numberHelpers.objectValues(obj, fn, [thisArg]) ⇒ <code>Object</code> \| <code>Array</code>
This function is intended to replicate behaviour of the Array.map() function but for Objects.If an array is passed in instead then it will perform standard map(). It is recommended toalways use the standard map() function when it is known that the object is actually an array.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> \| <code>Array</code> | The Object (or Array) to be mapped |
| fn | <code>module:objectHelpers~mapCallback</code> \| <code>function</code> | The function to be processed for each mapped property |
| [thisArg] | <code>Object</code> \| <code>Array</code> | Optional. Value to use as this when executing callback. |

<a name="module_numberHelpers.mapObject"></a>

### numberHelpers.mapObject(obj, fn, [thisArg]) ⇒ <code>Object</code> \| <code>Array</code>
This function is intended to replicate behaviour of the Array.filter() function but for Objects.If an array is passed in instead then it will perform standard filter(). It is recommended toalways use the standard filter() function when it is known that the object is actually an array.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> \| <code>Array</code> | The Object (or Array) to be filtered |
| fn | <code>module:objectHelpers~filterCallback</code> \| <code>function</code> | The function to be processed for each filtered property |
| [thisArg] | <code>Object</code> \| <code>Array</code> | Optional. Value to use as this when executing callback. |

<a name="module_numberHelpers.filterObject"></a>

### numberHelpers.filterObject(obj, fn, [initialValue]) ⇒ <code>Object</code> \| <code>Array</code>
This function is intended to replicate behaviour of the Array.reduce() function but for Objects.If an array is passed in instead then it will perform standard reduce(). It is recommended toalways use the standard reduce() function when it is known that the object is actually an array.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> \| <code>Array</code> | The Object (or Array) to be filtered |
| fn | <code>module:objectHelpers~reduceCallback</code> \| <code>function</code> | The function to be processed for each filtered property |
| [initialValue] | <code>Object</code> \| <code>Array</code> | Optional. Value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty array without an initial value is an error. |

<a name="module_numberHelpers.reduceObject"></a>

### numberHelpers.reduceObject(item) ⇒ <code>boolean</code>
Helper function for testing if the item is an Object or Array that does not have any properties

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> \| <code>Array</code> | Object or Array to test |

<a name="module_numberHelpers.isInstanceObject"></a>

### numberHelpers.isInstanceObject(value) ⇒ <code>boolean</code>
Determine if the value is a reference instance

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type |
| --- | --- |
| value | <code>Array</code> \| <code>Object</code> \| <code>\*</code> | 

<a name="module_numberHelpers.isCloneable"></a>

### numberHelpers.isCloneable([options]) ⇒ [<code>mergeObjectsCallback</code>](#module_objects..mergeObjectsCallback)
Perform a deep merge of objects. This will return a function that will combine all objects and sub-objects.Objects having the same attributes will overwrite from last object to first.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.mapLimit] | <code>number</code> | <code>100</code> | 
| [options.map] | <code>Iterable</code> | <code>[]</code> | 
| [options.useClone] | <code>bool</code> | <code>false</code> | 

<a name="module_numberHelpers.mergeObjectsBase"></a>

### numberHelpers.mergeObjectsBase(...objects) ⇒ <code>\*</code>
Uses mergeObjectsBase deep merge objects and arrays, merge by value.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  
**See**: [mergeObjectsCallback](#module_objects..mergeObjectsCallback)  

| Param | Type | Description |
| --- | --- | --- |
| ...objects | <code>Object</code> | Provide a list of objects which will be merged starting from the end up into the first |

<a name="module_numberHelpers.mergeObjects"></a>

### numberHelpers.mergeObjects(...objects) ⇒ <code>\*</code>
Uses mergeObjectsBase deep merge objects and arrays, merge by reference.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  
**See**: [mergeObjectsCallback](#module_objects..mergeObjectsCallback)  

| Param | Type | Description |
| --- | --- | --- |
| ...objects | <code>Object</code> | Provide a list of objects which will be merged starting from the end up into the first |

<a name="module_numberHelpers.mergeObjectsMutable"></a>

### numberHelpers.mergeObjectsMutable(object, [options]) ⇒ <code>Object</code>
Clone objects for manipulation without data corruption, returns a copy of the provided object.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>Object</code> |  | The original object that is being cloned |
| [options] | <code>Object</code> | <code>{}</code> |  |
| [options.mapLimit] | <code>number</code> | <code>100</code> |  |
| [options.map] | <code>Iterable</code> | <code>[]</code> |  |

<a name="module_numberHelpers.assignDescriptor"></a>

### numberHelpers.assignDescriptor(object) ⇒ <code>module:descriptorSamples~descriptor</code>
Trace an object and return the descriptor which defines the object's structure and attributes.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type |
| --- | --- |
| object | <code>Object</code> | 

<a name="module_numberHelpers.describeObject"></a>

### numberHelpers.describeObject(descriptor1, descriptor2) ⇒ <code>boolean</code>
Check if two descriptors are the same or similar in that they have similar keys and the associated types are the same.

**Kind**: static method of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type |
| --- | --- |
| descriptor1 | <code>module:descriptorSamples~descriptor</code> | 
| descriptor2 | <code>module:descriptorSamples~descriptor</code> | 

<a name="module_numberHelpers..mapCallback"></a>

### numberHelpers~mapCallback ⇒ <code>\*</code>
Function that produces a property of the new Object, taking three arguments

**Kind**: inner typedef of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| currentProperty | <code>\*</code> | The current property being processed in the object. |
| [currentIndex] | <code>string</code> | The property name of the current property being processed in the object. |
| [object] | <code>Object</code> \| <code>Array</code> | The object map was called upon. |

<a name="module_numberHelpers..filterCallback"></a>

### numberHelpers~filterCallback ⇒ <code>boolean</code>
Function is a predicate, to test each property value of the object. Return true to keep the element, falseotherwise, taking three arguments

**Kind**: inner typedef of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| currentProperty | <code>\*</code> | The current property being processed in the object. |
| [currentIndex] | <code>string</code> | The property name of the current property being processed in the object. |
| [object] | <code>Object</code> \| <code>Array</code> | The object filter was called upon. |

<a name="module_numberHelpers..reduceCallback"></a>

### numberHelpers~reduceCallback ⇒ <code>\*</code>
Function to execute on each property in the object, taking four arguments

**Kind**: inner typedef of [<code>numberHelpers</code>](#module_numberHelpers)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [accumulator] | <code>\*</code> | <code>{}</code> | The accumulator accumulates the callback's return values; it is the accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied (see below). |
| [currentProperty] | <code>\*</code> | <code>{}</code> | The current property being processed in the object. |
| [currentIndex] | <code>string</code> | <code>0</code> | The index of the current element being processed in the array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise. |
| [object] | <code>Object</code> \| <code>Array</code> | <code>{}</code> | The object reduce was called upon. |

<a name="module_functionalHelpers"></a>

## functionalHelpers
All of the functionalHelpers system functions for stringing together functions and simplifying logic.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="module_functionalHelpers..functionalHelpers"></a>

### functionalHelpers~functionalHelpers : [<code>functionalHelpers</code>](#module_functionalHelpers) \| <code>module:arrayHelpers</code> \| <code>module:functionHelpers</code> \| [<code>numberHelpers</code>](#module_numberHelpers) \| <code>module:objectHelpers</code>
All methods exported from this module are encapsulated within functionalHelpers.

**Kind**: inner typedef of [<code>functionalHelpers</code>](#module_functionalHelpers)  
<a name="module_collections"></a>

## collections
All of the JSON DOM system functions for creating JSON components.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [collections](#module_collections)
    * [.LinkedList](#module_collections.LinkedList) ⇒ <code>LinkedList</code>
    * [.LinkedTreeList](#module_collections.LinkedTreeList) ⇒ <code>LinkedList</code>
    * [.Linker](#module_collections.Linker) ⇒ <code>Linker</code>

<a name="module_collections.LinkedList"></a>

### collections.LinkedList ⇒ <code>LinkedList</code>
**Kind**: static property of [<code>collections</code>](#module_collections)  

| Param |
| --- |
| values | 
| LinkerClass | 
| ListClass | 

<a name="module_collections.LinkedTreeList"></a>

### collections.LinkedTreeList ⇒ <code>LinkedList</code>
**Kind**: static property of [<code>collections</code>](#module_collections)  

| Param |
| --- |
| values | 
| LinkerClass | 
| ListClass | 

<a name="module_collections.Linker"></a>

### collections.Linker ⇒ <code>Linker</code>
**Kind**: static property of [<code>collections</code>](#module_collections)  

| Param |
| --- |
| values | 
| LinkerClass | 

<a name="module_jDom"></a>

## jDom
All of the JSON DOM system functions for creating JSON components.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [jDom](#module_jDom)
    * _static_
        * [.elementHasAttribute](#module_jDom.elementHasAttribute) ⇒ <code>Object.&lt;string, number&gt;</code> \| <code>\*</code>
        * [.bindElement](#module_jDom.bindElement) ⇒ <code>module:dom/objects.DomItemBody</code> \| [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [.retrieveListener](#module_jDom.retrieveListener) ⇒ <code>boolean</code>
        * [.appendListeners](#module_jDom.appendListeners) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [.gatherChildItems](#module_jDom.gatherChildItems) ⇒ [<code>testChildItem</code>](#module_dom/core..testChildItem)
        * [.createDomItem](#module_jDom.createDomItem) ⇒ <code>Array.&lt;(module:dom/objects~DomItemHead\|module:dom/objects~DomItemBody)&gt;</code>
    * _inner_
        * [~documentItem](#module_jDom..documentItem) : [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot)
        * [~elementHasAttribute(element, key, attr)](#module_jDom..elementHasAttribute) ⇒ <code>boolean</code> \| <code>Object.&lt;string, number&gt;</code>
        * [~elementChanges(config)](#module_jDom..elementChanges) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~setAttribute(config, name, value)](#module_jDom..setAttribute) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~setAndReturnAttribute(config, name, value)](#module_jDom..setAndReturnAttribute) ⇒ <code>string</code>
        * [~updateElement(config)](#module_jDom..updateElement) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~updateElements(config)](#module_jDom..updateElements) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~generateElement(config)](#module_jDom..generateElement) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~bindElement(item)](#module_jDom..bindElement) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~appendHTML(item, parent)](#module_jDom..appendHTML) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~removeChild(item, parent)](#module_jDom..removeChild) ⇒ <code>Array.&lt;(HTMLElement\|PseudoHTMLElement)&gt;</code>
        * [~registerListener(listener, [name], [parent])](#module_jDom..registerListener) ⇒ <code>Object.&lt;string, module:dom/objects~listenerFunction&gt;</code>
        * [~registerListeners(listeners, [parent])](#module_jDom..registerListeners) ⇒ [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| <code>Object</code>
        * [~retrieveListener(listenerName, [parent])](#module_jDom..retrieveListener) ⇒ <code>module:dom/objects~listenerFunction</code> \| <code>function</code> \| <code>Object</code>
        * [~assignListener(trigger, elem, fn, options)](#module_jDom..assignListener) ⇒ <code>module:dom/objects~listenerFunction</code> \| <code>function</code>
        * [~appendListeners(item, event, listener, args, options)](#module_jDom..appendListeners) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~bindListeners(item)](#module_jDom..bindListeners) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~bindAllListeners(item)](#module_jDom..bindAllListeners) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~gatherChildItems(item, test)](#module_jDom..gatherChildItems) ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
        * [~getChildrenFromAttribute(attr, value, item)](#module_jDom..getChildrenFromAttribute) ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
        * [~getChildrenByClass()](#module_jDom..getChildrenByClass) ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
        * [~getChildrenByName()](#module_jDom..getChildrenByName) ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
        * [~getParentsFromAttribute(attr, value, item)](#module_jDom..getParentsFromAttribute) ⇒ <code>Array</code>
        * [~getParentsByClass()](#module_jDom..getParentsByClass) ⇒ <code>Array</code>
        * [~getParentsByName()](#module_jDom..getParentsByName) ⇒ <code>Array</code>
        * [~getParentsByTagName()](#module_jDom..getParentsByTagName) ⇒ <code>Array</code>
        * [~getTopParentItem(item)](#module_jDom..getTopParentItem) ⇒ [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot)
        * [~renderHTML(item, parent)](#module_jDom..renderHTML) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~createDomItem(...attributes)](#module_jDom..createDomItem) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~documentDomItem(listeners, [rootItem])](#module_jDom..documentDomItem) ⇒ [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~listenerFunction](#module_jDom..listenerFunction) : <code>function</code>
        * [~EventListener](#module_jDom..EventListener) : <code>Object</code>
        * [~DomItemHead](#module_jDom..DomItemHead) : [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~DomItemBody](#module_jDom..DomItemBody) : [<code>DomItem</code>](#module_dom/objects.DomItem)

<a name="module_jDom.elementHasAttribute"></a>

### jDom.elementHasAttribute ⇒ <code>Object.&lt;string, number&gt;</code> \| <code>\*</code>
Check if a class exists on the element, return object with keys for each class and a -1, 0, 1 difference indicator.

**Kind**: static property of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> \| <code>module:pseudoDom/objects.PseudoHTMLElement</code> | Provide an element to check classes on. |
| classes | <code>string</code> | A string of classes (like the content of the 'class' attribute) to be compared |

<a name="module_jDom.bindElement"></a>

### jDom.bindElement ⇒ <code>module:dom/objects.DomItemBody</code> \| [<code>DomItem</code>](#module_dom/objects.DomItem)
Simplify detecting the parent item which can be appended to, whether root, or just a parent at any part of the tree

**Kind**: static property of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| parent | [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| [<code>DomItem</code>](#module_dom/objects.DomItem) | A parent DomItem which may or may not have a body |

<a name="module_jDom.retrieveListener"></a>

### jDom.retrieveListener ⇒ <code>boolean</code>
Provide compatibility for using the options parameter of addEventListener

**Kind**: static property of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>EventListenerOptions</code>](#module_dom/objects.EventListenerOptions) | An object or boolean with the listener options |

<a name="module_jDom.appendListeners"></a>

### jDom.appendListeners ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Receive a DomItem with eventListeners and apply the event listeners onto the Dom element.

**Kind**: static property of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which has eventListeners to apply to its element |

<a name="module_jDom.gatherChildItems"></a>

### jDom.gatherChildItems ⇒ [<code>testChildItem</code>](#module_dom/core..testChildItem)
Retrieve the [testChildItem](#module_dom/core..testChildItem) function by providing an attribute and value to check.

**Kind**: static property of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| attr | <code>string</code> | Provide the attribute name to be searched |
| value | <code>\*</code> | The attribute value to be compared |

<a name="module_jDom.createDomItem"></a>

### jDom.createDomItem ⇒ <code>Array.&lt;(module:dom/objects~DomItemHead\|module:dom/objects~DomItemBody)&gt;</code>
Initiate the children of Root / DocumentItem. This is a helper for [documentDomItem](documentDomItem).

**Kind**: static property of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..documentItem"></a>

### jDom~documentItem : [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot)
Create reference for storing document changes

**Kind**: inner property of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..elementHasAttribute"></a>

### jDom~elementHasAttribute(element, key, attr) ⇒ <code>boolean</code> \| <code>Object.&lt;string, number&gt;</code>
Check if the provided Element has the provided attributes.Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> \| <code>module:pseudoDom/objects.PseudoHTMLElement</code> | Receive the element to be assessed |
| key | <code>string</code> | The attribute name to search for |
| attr | <code>string</code> \| <code>Object</code> | The expected value of the attribute to compare against |

<a name="module_jDom..elementChanges"></a>

### jDom~elementChanges(config) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Given a jDomObjects.DomItem as config, this function will return the changes to be appliedto the stored element property.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem having config changes to be applied to its element |

<a name="module_jDom..setAttribute"></a>

### jDom~setAttribute(config, name, value) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Set an attribute on the element within a DomItem, then return the config data.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem having config changes to be applied to its element |
| name | <code>string</code> | The attribute name to be updated |
| value | <code>string</code> | The new value to be applied to the attribute |

<a name="module_jDom..setAndReturnAttribute"></a>

### jDom~setAndReturnAttribute(config, name, value) ⇒ <code>string</code>
Set an attribute on the element within a DomItem, then return the attribute.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem having config changes to be applied to its element |
| name | <code>string</code> | The attribute name to be updated |
| value | <code>string</code> | The new value to be applied to the attribute |

<a name="module_jDom..updateElement"></a>

### jDom~updateElement(config) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Update a single objects.DomItem element with the provided attributes / style / elementProperties

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem having config changes to be applied to its element |

<a name="module_jDom..updateElements"></a>

### jDom~updateElements(config) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Generate HTML element data for each object in the matrixWARNING: This is a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem having child DomItems with config changes to be applied |

<a name="module_jDom..generateElement"></a>

### jDom~generateElement(config) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Create an HTML element based on the provided attributes and return the element as an Object.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem requiring matching HTML element property |

<a name="module_jDom..bindElement"></a>

### jDom~bindElement(item) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Generate HTML element data for a provided DomItem

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem needing element to be generated |

<a name="module_jDom..appendHTML"></a>

### jDom~appendHTML(item, parent) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Append a new DomItem which has the element generated.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | A new DomItem to append |
| parent | [<code>DomItem</code>](#module_dom/objects.DomItem) | The parent to have DomItems appended |

<a name="module_jDom..removeChild"></a>

### jDom~removeChild(item, parent) ⇒ <code>Array.&lt;(HTMLElement\|PseudoHTMLElement)&gt;</code>
Reverse of appendHTML, remove a DomItem and have the associated element removed.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem with HTMLElement to be removed |
| parent | [<code>DomItem</code>](#module_dom/objects.DomItem) | The parent of the items |

<a name="module_jDom..registerListener"></a>

### jDom~registerListener(listener, [name], [parent]) ⇒ <code>Object.&lt;string, module:dom/objects~listenerFunction&gt;</code>
Register a single listener function as part of the root jDomObjects.DomItem.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>module:dom/objects~listenerFunction</code> \| <code>function</code> | Provide a function which will be called when a Dom event is triggered. |
| [name] | <code>string</code> | The name of the listener to be used. |
| [parent] | [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| <code>Object</code> | The parent DomItem which is DomItemRoot which stores has eventListeners property. |

<a name="module_jDom..registerListeners"></a>

### jDom~registerListeners(listeners, [parent]) ⇒ [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| <code>Object</code>
Register multiple listeners from an array of functions.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| listeners | <code>Array.&lt;(module:dom/objects~listenerFunction\|function())&gt;</code> | An array of functions to be used as the registered event listeners. |
| [parent] | [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| <code>Object</code> | The parent DomItem which is DomItemRoot which stores has eventListeners property. |

<a name="module_jDom..retrieveListener"></a>

### jDom~retrieveListener(listenerName, [parent]) ⇒ <code>module:dom/objects~listenerFunction</code> \| <code>function</code> \| <code>Object</code>
Based on the provided function / listener name, retrieve the associated function from the root jDomObjects.DomItem

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| listenerName | <code>string</code> | The name of one of the registered listener functions. |
| [parent] | [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| <code>Object</code> | The parent DomItem which is DomItemRoot which stores has eventListeners property. |

<a name="module_jDom..assignListener"></a>

### jDom~assignListener(trigger, elem, fn, options) ⇒ <code>module:dom/objects~listenerFunction</code> \| <code>function</code>
Provide compatibility for assigning listeners.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| trigger | <code>string</code> | The name of the event which will trigger the listenerFunction on the element. |
| elem | <code>HTMLElement</code> \| <code>module:pseudoDom/objects~PseudoHTMLElement</code> | An element to append the listener onto |
| fn | <code>module:dom/objects~listenerFunction</code> \| <code>function</code> | The function which will be invoked when the event is triggered |
| options | [<code>EventListenerOptions</code>](#module_dom/objects.EventListenerOptions) | Additional options to how the event will be fired |

<a name="module_jDom..appendListeners"></a>

### jDom~appendListeners(item, event, listener, args, options) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
When there may be extra data needed for the event listener function call, this function may be used as a helperto pass the additional data. Also, if it is desirable to add event listeners during run-time, this function can beused to achieve this.WARNING: This is a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which will have its eventListeners updated. |
| event | <code>string</code> | The string name of the event trigger type to be added. |
| listener | <code>string</code> | The name of the function to be called once the event is triggered. |
| args | <code>Object</code> | Additional arguments to be used in the listener function. |
| options | [<code>EventListenerOptions</code>](#module_dom/objects.EventListenerOptions) | The strategy used when the event is triggered. |

<a name="module_jDom..bindListeners"></a>

### jDom~bindListeners(item) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Based on the eventListeners property of the provided item, bind thelisteners to the associated element property for the provided jDomObjects.DomItem.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which may have eventListeners to apply to its element |

<a name="module_jDom..bindAllListeners"></a>

### jDom~bindAllListeners(item) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Based on the eventListeners property of the provided item, bind the listeners to the associated element propertyfor each item in the jDomObjects.DomItem structure.WARNING: This is a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem with an associated HTMLElement to have a listener assigned |

<a name="module_jDom..gatherChildItems"></a>

### jDom~gatherChildItems(item, test) ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.This function will check all the children starting from and including item, and run the test function on eachchild encountered. The return array contains children returned from the test from all levels.WARNING: This is a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which may have child items matching the attribute criteria |
| test | [<code>testChildItem</code>](#module_dom/core..testChildItem) | Assess each child, and return the ones which qualify |

<a name="module_jDom..getChildrenFromAttribute"></a>

### jDom~getChildrenFromAttribute(attr, value, item) ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.This function will check all the children starting from item, and scan the attributesproperty for matches. The returned array contains children matching from all levels.WARNING: This calls a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| attr | <code>string</code> | Provide the attribute name to be searched |
| value | <code>\*</code> | The attribute value to be compared |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which may have child items matching the attribute criteria |

<a name="module_jDom..getChildrenByClass"></a>

### jDom~getChildrenByClass() ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
Helper for getting all jDomObjects.DomItems starting at parent and having specified className attribute

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..getChildrenByName"></a>

### jDom~getChildrenByName() ⇒ [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem)
Helper for getting all jDomObjects.DomItems starting at parent and having specified name attribute

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..getParentsFromAttribute"></a>

### jDom~getParentsFromAttribute(attr, value, item) ⇒ <code>Array</code>
A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.This function will check all the children starting from item, and scan the attributesproperty for matches. The return array contains children matching from all levels.WARNING: This is a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| attr | <code>string</code> | Provide the attribute name to be searched |
| value | <code>\*</code> | The attribute value to be compared |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which may have parent items matching the attribute criteria |

<a name="module_jDom..getParentsByClass"></a>

### jDom~getParentsByClass() ⇒ <code>Array</code>
Helper for getting all jDomObjects.DomItems starting at child and having specified className attribute

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..getParentsByName"></a>

### jDom~getParentsByName() ⇒ <code>Array</code>
Helper for getting all jDomObjects.DomItems starting at child and having specified name attribute

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..getParentsByTagName"></a>

### jDom~getParentsByTagName() ⇒ <code>Array</code>
Helper for getting all jDomObjects.DomItems starting at child and having specified tagName

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  
<a name="module_jDom..getTopParentItem"></a>

### jDom~getTopParentItem(item) ⇒ [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot)
Get the upper parentItem for the provided child. (usually this is a documentItem reference)WARNING: This is a recursive function.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem which we want the highest parent item of |

<a name="module_jDom..renderHTML"></a>

### jDom~renderHTML(item, parent) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
This is a shortcut for building the specified HTML elements and appending them to the Domwith associated listeners.The final argument is specific for adding event listeners with options.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DomItem</code>](#module_dom/objects.DomItem) | The DomItem that we want to render the element for |
| parent | [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) | The Base Dom item which is the parent of all the items |

<a name="module_jDom..createDomItem"></a>

### jDom~createDomItem(...attributes) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
This is the basic Object for representing the Dom in a virtual perspective. All incoming attributes will be mergedto the specified format.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| ...attributes | <code>Object</code> | DomItem-like object(s) to be merged as a DomItem |

<a name="module_jDom..documentDomItem"></a>

### jDom~documentDomItem(listeners, [rootItem]) ⇒ [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| [<code>DomItem</code>](#module_dom/objects.DomItem)
Return a DomItem reference to the document. The rootItem argument is a system variable and not necessary toimplement.

**Kind**: inner method of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| listeners | <code>Object.&lt;string, module:dom/objects~listenerFunction&gt;</code> | An object of all event listeners to be registered in the Dom |
| [rootItem] | [<code>DomItemRoot</code>](#module_dom/objects.DomItemRoot) \| [<code>DomItem</code>](#module_dom/objects.DomItem) | This is a reference to DomItemRoot which will be defaulted with [initRoot](initRoot) |

<a name="module_jDom..listenerFunction"></a>

### jDom~listenerFunction : <code>function</code>
This is the standard definition of a listenerFunction to be used

**Kind**: inner typedef of [<code>jDom</code>](#module_jDom)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Event</code> \| <code>module:pseudoDom/objects.PseudoEvent</code> | The event object passed to the listener |
| target | [<code>DomItem</code>](#module_dom/objects.DomItem) | The element which triggered the event |
| [...args] | <code>\*</code> | Optional args as required by the listener |

<a name="module_jDom..EventListener"></a>

### jDom~EventListener : <code>Object</code>
An EventListener Object to be appended to the element within the DomItem

**Kind**: inner typedef of [<code>jDom</code>](#module_jDom)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| listenerFunc | <code>string</code> | A string function name matching an existing [module:dom/objects~listenerFunction](module:dom/objects~listenerFunction). |
| listenerArgs | <code>Object</code> | Additional args required for the listener function |
| listenerOptions | [<code>EventListenerOptions</code>](#module_dom/objects.EventListenerOptions) | Provides support for options parameter of addEventListener, or false for default |

<a name="module_jDom..DomItemHead"></a>

### jDom~DomItemHead : [<code>DomItem</code>](#module_dom/objects.DomItem)
DomItemHead defines the structure for a single element in the Dom

**Kind**: inner typedef of [<code>jDom</code>](#module_jDom)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;head&quot;</code> | This is set to the string head referring to the HTML element of the same name |
| attributes | <code>Object.&lt;string, (string\|Object)&gt;</code> |  | All potential HTML element attributes can be defined here |
| element | <code>HTMLHeadElement</code> \| <code>module:pseudoDom/objects.PseudoHTMLElement</code> |  | A reference to the HTML head element |
| children | [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem) |  | A reference to an array of child objects |

<a name="module_jDom..DomItemBody"></a>

### jDom~DomItemBody : [<code>DomItem</code>](#module_dom/objects.DomItem)
DomItemBody defines the structure for a single element in the Dom

**Kind**: inner typedef of [<code>jDom</code>](#module_jDom)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;body&quot;</code> | This is set to the string body referring to the HTML element of the same name |
| attributes | <code>Object.&lt;string, (string\|Object)&gt;</code> |  | All potential HTML element attributes can be defined here |
| element | <code>HTMLBodyElement</code> \| <code>module:pseudoDom/objects.PseudoHTMLElement</code> |  | A reference to the HTML body element |
| children | [<code>Array.&lt;DomItem&gt;</code>](#module_dom/objects.DomItem) |  | A reference to an array of child objects |

<a name="module_jsonDom"></a>

## jsonDom
All of the JSON DOM system functions for creating JSON components.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="module_jsonDom..jsonDom"></a>

### jsonDom~jsonDom : [<code>jsonDom</code>](#module_jsonDom) \| [<code>collections</code>](#module_collections) \| [<code>jDom</code>](#module_jDom) \| <code>module:pseudoDom</code> \| <code>module:matrix</code>
All methods exported from this module are encapsulated within jsonDom.

**Kind**: inner typedef of [<code>jsonDom</code>](#module_jsonDom)  
<a name="module_jDomMatrix"></a>

## jDomMatrix
Add matrix ability using JSON DOM components

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [jDomMatrix](#module_jDomMatrix)
    * _static_
        * [.getFirstAxisOfCoordinate](#module_jDomMatrix.getFirstAxisOfCoordinate) ⇒ [<code>Direction</code>](#module_matrix/objects.Direction)
    * _inner_
        * [~bindPointData(item, pnt)](#module_jDomMatrix..bindPointData) ⇒ [<code>MatrixColumn</code>](#module_matrix/objects.MatrixColumn) \| [<code>MatrixRow</code>](#module_matrix/objects.MatrixRow)
        * [~nextCell(pnt, dir)](#module_jDomMatrix..nextCell) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~pointDifference(start, end)](#module_jDomMatrix..pointDifference) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~areEqualPoints(p1, p2)](#module_jDomMatrix..areEqualPoints) ⇒ <code>boolean</code>
        * [~getHighestAbsoluteCoordinate(pnt)](#module_jDomMatrix..getHighestAbsoluteCoordinate) ⇒ [<code>coordinate</code>](#module_matrix/objects.coordinate)
        * [~getFirstAxisOfCoordinate(pnt, coordinate)](#module_jDomMatrix..getFirstAxisOfCoordinate) ⇒ <code>false</code> \| [<code>axis</code>](#module_matrix/objects.axis)
        * [~pointsToDirection(start, end)](#module_jDomMatrix..pointsToDirection) ⇒ [<code>Direction</code>](#module_matrix/objects.Direction)
        * [~randomStart(length, dir, [lengthLimits])](#module_jDomMatrix..randomStart) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~lineEndPoint(start, length, dir)](#module_jDomMatrix..lineEndPoint) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~getPointsLine(start, end, [line])](#module_jDomMatrix..getPointsLine) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
        * [~getPointsLines(lines)](#module_jDomMatrix..getPointsLines) ⇒ <code>Array.&lt;Array.&lt;module:matrix/objects.Point&gt;&gt;</code>
        * [~checkInBetween(...args)](#module_jDomMatrix..checkInBetween) ⇒ <code>boolean</code>
        * [~getAxisLengths(matrix)](#module_jDomMatrix..getAxisLengths) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~randDirection([useCoordinates])](#module_jDomMatrix..randDirection) ⇒ [<code>Direction</code>](#module_matrix/objects.Direction)
        * [~checkValidPoint(pnt, matrix)](#module_jDomMatrix..checkValidPoint) ⇒ <code>boolean</code>
        * [~getDomItemFromPoint(pnt, matrix)](#module_jDomMatrix..getDomItemFromPoint) ⇒ <code>false</code> \| [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~getAllPoints(matrix, [allPoints])](#module_jDomMatrix..getAllPoints) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
        * [~adjacentPoints(pnt, matrix)](#module_jDomMatrix..adjacentPoints) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
        * [~adjacentEdgePoints(pnt, matrix)](#module_jDomMatrix..adjacentEdgePoints) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
        * [~getPointFromElement(elem)](#module_jDomMatrix..getPointFromElement) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~getDomItemFromElement(elem, matrix)](#module_jDomMatrix..getDomItemFromElement) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
        * [~point(x, y, [z])](#module_jDomMatrix..point) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
        * [~tile()](#module_jDomMatrix..tile) ⇒ [<code>MatrixTile</code>](#module_matrix/objects.MatrixTile)
        * [~matrix(x, y, z, matrixProps)](#module_jDomMatrix..matrix) ⇒ [<code>Matrix</code>](#module_matrix/objects.Matrix)
        * [~square([x], [y], [z], [matrixProps], size)](#module_jDomMatrix..square) ⇒ [<code>Matrix</code>](#module_matrix/objects.Matrix)
        * [~cube([x], [y], [z], [matrixProps], size)](#module_jDomMatrix..cube) ⇒ [<code>Matrix</code>](#module_matrix/objects.Matrix)

<a name="module_jDomMatrix.getFirstAxisOfCoordinate"></a>

### jDomMatrix.getFirstAxisOfCoordinate ⇒ [<code>Direction</code>](#module_matrix/objects.Direction)
Given a point and the value of the highest coordinate select the corresponding axis which will be the direction(-1 or 1) to and set the other axis to 0.

**Kind**: static property of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | The which will be converted to a direction. |
| highestCoordinate | [<code>coordinate</code>](#module_matrix/objects.coordinate) | The highest coordinate provided by the point. |

<a name="module_jDomMatrix..bindPointData"></a>

### jDomMatrix~bindPointData(item, pnt) ⇒ [<code>MatrixColumn</code>](#module_matrix/objects.MatrixColumn) \| [<code>MatrixRow</code>](#module_matrix/objects.MatrixRow)
Generate point data for each item in the matrixWARNING: This is a recursive function.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>MatrixColumn</code>](#module_matrix/objects.MatrixColumn) \| [<code>MatrixRow</code>](#module_matrix/objects.MatrixRow) | A special DomItem which is either a layer, row, or column in a matrix. |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | A point to be added to a specific Matrix Column |

<a name="module_jDomMatrix..nextCell"></a>

### jDomMatrix~nextCell(pnt, dir) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Based on provided point and point direction generate next point.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | Provide the current / initial point |
| dir | [<code>Direction</code>](#module_matrix/objects.Direction) | Provide the direction to be applied to find the next point |

<a name="module_jDomMatrix..pointDifference"></a>

### jDomMatrix~pointDifference(start, end) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Based on provided point and another point, get a point with the difference between each axis

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| start | [<code>Point</code>](#module_matrix/objects.Point) | The first point to compare |
| end | [<code>Point</code>](#module_matrix/objects.Point) | The other point to be compared |

<a name="module_jDomMatrix..areEqualPoints"></a>

### jDomMatrix~areEqualPoints(p1, p2) ⇒ <code>boolean</code>
Given two points, compare the x, y, and z of each to see if they are the same

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Point</code>](#module_matrix/objects.Point) | The first point to compare |
| p2 | [<code>Point</code>](#module_matrix/objects.Point) | The other point to be compared |

<a name="module_jDomMatrix..getHighestAbsoluteCoordinate"></a>

### jDomMatrix~getHighestAbsoluteCoordinate(pnt) ⇒ [<code>coordinate</code>](#module_matrix/objects.coordinate)
Return the first coordinate number with the highest absolute value.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | A Point to be assessed. |

<a name="module_jDomMatrix..getFirstAxisOfCoordinate"></a>

### jDomMatrix~getFirstAxisOfCoordinate(pnt, coordinate) ⇒ <code>false</code> \| [<code>axis</code>](#module_matrix/objects.axis)
Having provided a coordinate number, find all corresponding axis, return the first match.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | The Point containing a matching coordinate. |
| coordinate | [<code>coordinate</code>](#module_matrix/objects.coordinate) | The coordinate to search for. |

<a name="module_jDomMatrix..pointsToDirection"></a>

### jDomMatrix~pointsToDirection(start, end) ⇒ [<code>Direction</code>](#module_matrix/objects.Direction)
Retrieve a directional coordinate value based on two provided points(directions consist of two zero coordinates and a single coordinate of 1 / -1)

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| start | [<code>Point</code>](#module_matrix/objects.Point) | The first point to assess. |
| end | [<code>Point</code>](#module_matrix/objects.Point) | The other point to assess. |

<a name="module_jDomMatrix..randomStart"></a>

### jDomMatrix~randomStart(length, dir, [lengthLimits]) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Generate a random starting point for a line with the provided length and direction.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| length | <code>number</code> |  | The intended length the resulting line. |
| dir | [<code>Direction</code>](#module_matrix/objects.Direction) |  | The direction the line will extend towards. |
| [lengthLimits] | [<code>Point</code>](#module_matrix/objects.Point) | <code>{x: 10, y: 10, z: 10}</code> | The maximum grid size. |

<a name="module_jDomMatrix..lineEndPoint"></a>

### jDomMatrix~lineEndPoint(start, length, dir) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Given a start point, line length, and a direction, generate the end point of the line.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| start | [<code>Point</code>](#module_matrix/objects.Point) | The selected starting point. |
| length | <code>number</code> | The total length of the line. |
| dir | [<code>Direction</code>](#module_matrix/objects.Direction) | The direction of the line. |

<a name="module_jDomMatrix..getPointsLine"></a>

### jDomMatrix~getPointsLine(start, end, [line]) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
Having provided two points, return an array of transition points connecting 'start' and 'end'. Return arrayincludes 'start' (line[0]) and 'end' (line[line.length-1])

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | [<code>Point</code>](#module_matrix/objects.Point) |  | The starting location of the line. |
| end | [<code>Point</code>](#module_matrix/objects.Point) |  | The final line destination. |
| [line] | [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point) | <code>[]</code> | The resulting line to connect start and end. |

<a name="module_jDomMatrix..getPointsLines"></a>

### jDomMatrix~getPointsLines(lines) ⇒ <code>Array.&lt;Array.&lt;module:matrix/objects.Point&gt;&gt;</code>
Takes an array of arrays containing two points each. Calls getPointsLine for each array of points. Returns anarray of all points captured for each line segment

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| lines | <code>Array.&lt;Array.&lt;module:matrix/objects.Point&gt;&gt;</code> | An array of lines only containing start and end. |

<a name="module_jDomMatrix..checkInBetween"></a>

### jDomMatrix~checkInBetween(...args) ⇒ <code>boolean</code>
Given two points, check the cells between using specified function.When inclusive is set to true the provided start and end points will also be tested

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | These args match the parameter list for [testPointsBetween](#module_matrix/core..testPointsBetween) |

<a name="module_jDomMatrix..getAxisLengths"></a>

### jDomMatrix~getAxisLengths(matrix) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Return point-like object with all of the axis lengths.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) | The matrix to get the dimensions of. |

<a name="module_jDomMatrix..randDirection"></a>

### jDomMatrix~randDirection([useCoordinates]) ⇒ [<code>Direction</code>](#module_matrix/objects.Direction)
Get random direction point

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [useCoordinates] | [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point) | <code>[]</code> | An array of possible directions. |

<a name="module_jDomMatrix..checkValidPoint"></a>

### jDomMatrix~checkValidPoint(pnt, matrix) ⇒ <code>boolean</code>
Test if the provided point exists in the matrix.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | Provide a point to validate. |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) | The matrix that contains valid points. |

<a name="module_jDomMatrix..getDomItemFromPoint"></a>

### jDomMatrix~getDomItemFromPoint(pnt, matrix) ⇒ <code>false</code> \| [<code>DomItem</code>](#module_dom/objects.DomItem)
Retrieve the DomItem associated with the provided point

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | A point corresponding to a DomItem. |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) | The matrix containing the point. |

<a name="module_jDomMatrix..getAllPoints"></a>

### jDomMatrix~getAllPoints(matrix, [allPoints]) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
Return an array of all the points in the matrix

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) \| [<code>MatrixColumn</code>](#module_matrix/objects.MatrixColumn) |  | The matrix to retrieve points from. |
| [allPoints] | [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point) | <code>[]</code> | The array of points to be returned |

<a name="module_jDomMatrix..adjacentPoints"></a>

### jDomMatrix~adjacentPoints(pnt, matrix) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
Return all valid points surrounding a provided point

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | The point we want to find adjacent points for. |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) | The matrix having the point. |

<a name="module_jDomMatrix..adjacentEdgePoints"></a>

### jDomMatrix~adjacentEdgePoints(pnt, matrix) ⇒ [<code>Array.&lt;Point&gt;</code>](#module_matrix/objects.Point)
Return all points which touch on edges (not diagonal)

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| pnt | [<code>Point</code>](#module_matrix/objects.Point) | The point we want to find adjacent points for. |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) | The matrix having the point. |

<a name="module_jDomMatrix..getPointFromElement"></a>

### jDomMatrix~getPointFromElement(elem) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Retrieve the point associated with the provided element.

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Node</code> \| <code>HTMLElement</code> \| <code>module:pseudoDom/objects.PseudoHTMLElement</code> | Provide an element associated with a point. |

<a name="module_jDomMatrix..getDomItemFromElement"></a>

### jDomMatrix~getDomItemFromElement(elem, matrix) ⇒ [<code>DomItem</code>](#module_dom/objects.DomItem)
Retrieve the DomItem associated with the provided element in the matrix

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Node</code> \| <code>HTMLElement</code> \| <code>module:pseudoDom/objects.PseudoHTMLElement</code> | Provide an element having an associated DomItem. |
| matrix | [<code>Matrix</code>](#module_matrix/objects.Matrix) | The matrix potentially containing the DomItem with Point. |

<a name="module_jDomMatrix..point"></a>

### jDomMatrix~point(x, y, [z]) ⇒ [<code>Point</code>](#module_matrix/objects.Point)
Store the point data for an x, y, z [Matrix](#module_matrix/objects.Matrix).

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | [<code>coordinate</code>](#module_matrix/objects.coordinate) |  | The numeric value for X-coordinate |
| y | [<code>coordinate</code>](#module_matrix/objects.coordinate) |  | The numeric value for Y-coordinate |
| [z] | [<code>coordinate</code>](#module_matrix/objects.coordinate) | <code>0</code> | The numeric value for Z-coordinate (default to 0 for 2D [Matrix](#module_matrix/objects.Matrix)) |

<a name="module_jDomMatrix..tile"></a>

### jDomMatrix~tile() ⇒ [<code>MatrixTile</code>](#module_matrix/objects.MatrixTile)
A default tile in the [Matrix](#module_matrix/objects.Matrix)

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  
<a name="module_jDomMatrix..matrix"></a>

### jDomMatrix~matrix(x, y, z, matrixProps) ⇒ [<code>Matrix</code>](#module_matrix/objects.Matrix)
Create a 3d matrix of i with x by y by z size, add additional objects for each layer as well

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Object</code> | Properties and a coordinate defining the width of the matrix. |
| y | <code>Object</code> | Properties and a coordinate defining the height of the matrix. |
| z | <code>Object</code> | Properties and a coordinate defining the depth of the matrix. |
| matrixProps | [<code>Array.&lt;Matrix&gt;</code>](#module_matrix/objects.Matrix) | Properties to be added to the matrix |

<a name="module_jDomMatrix..square"></a>

### jDomMatrix~square([x], [y], [z], [matrixProps], size) ⇒ [<code>Matrix</code>](#module_matrix/objects.Matrix)
Return a single layer matrix where x and y are equal

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [x] | [<code>Array.&lt;MatrixTile&gt;</code>](#module_matrix/objects.MatrixTile) | <code>[]</code> | All the data to be presented as part of the specified point, requires MatrixTile base |
| [y] | [<code>Array.&lt;MatrixRow&gt;</code>](#module_matrix/objects.MatrixRow) | <code>[]</code> | Additional data to append to the MatrixRow |
| [z] | [<code>Array.&lt;MatrixLayer&gt;</code>](#module_matrix/objects.MatrixLayer) | <code>[]</code> | Additional data to append to the MatrixLayer |
| [matrixProps] | [<code>Array.&lt;Matrix&gt;</code>](#module_matrix/objects.Matrix) | <code>[]</code> | Additional data to append to the Matrix |
| size | <code>number</code> |  | Used to define height and width as equal values (depth is set to 1) |

<a name="module_jDomMatrix..cube"></a>

### jDomMatrix~cube([x], [y], [z], [matrixProps], size) ⇒ [<code>Matrix</code>](#module_matrix/objects.Matrix)
Return a matrix where x, y, and z are equal

**Kind**: inner method of [<code>jDomMatrix</code>](#module_jDomMatrix)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [x] | [<code>Array.&lt;MatrixTile&gt;</code>](#module_matrix/objects.MatrixTile) | <code>[]</code> | All the data to be presented as part of the specified point, requires MatrixTile base |
| [y] | [<code>Array.&lt;MatrixRow&gt;</code>](#module_matrix/objects.MatrixRow) | <code>[]</code> | Additional data to append to the MatrixRow |
| [z] | [<code>Array.&lt;MatrixLayer&gt;</code>](#module_matrix/objects.MatrixLayer) | <code>[]</code> | Additional data to append to the MatrixLayer |
| [matrixProps] | [<code>Array.&lt;Matrix&gt;</code>](#module_matrix/objects.Matrix) | <code>[]</code> | Additional data to append to the Matrix |
| size | <code>number</code> |  | Used to define height, width, and depth as equal values |

<a name="module_pseudoDom/objects"></a>

## pseudoDom/objects : <code>Object</code>
All methods exported from this module are encapsulated within pseudoDom.

**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="module_pseudoDom/objects..generate"></a>

### pseudoDom/objects~generate(root, context) ⇒ <code>Window</code> \| <code>PseudoEventTarget</code>
Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browsercontext.

**Kind**: inner method of [<code>pseudoDom/objects</code>](#module_pseudoDom/objects)  

| Param | Type |
| --- | --- |
| root | <code>Object</code> | 
| context | <code>Object</code> | 

<a name="module_setup"></a>

## setup
A reference to all functions to be used globally / exported


* [setup](#module_setup)
    * [~noConflict()](#module_setup..noConflict) ⇒ <code>gameStart</code>
    * [~beginRound(e, mainForm)](#module_setup..beginRound) ⇒ <code>boolean</code>
    * [~main(parent)](#module_setup..main) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
    * [~restart(e, button)](#module_setup..restart)
    * [~functionalHelpers](#module_setup..functionalHelpers) : <code>\*</code> \| [<code>functionalHelpers</code>](#module_functionalHelpers)
    * [~jsonDom](#module_setup..jsonDom) : <code>\*</code> \| <code>module:json-dom</code>
    * [~gameLayout](#module_setup..gameLayout) : <code>\*</code> \| [<code>layout</code>](#module_layout)
    * [~gamePieces](#module_setup..gamePieces) : <code>\*</code> \| [<code>pieces</code>](#module_pieces)
    * [~gameUtils](#module_setup..gameUtils) : <code>\*</code> \| [<code>functions</code>](#module_functions)
    * [~gameActions](#module_setup..gameActions) : <code>\*</code> \| [<code>actions</code>](#module_actions)

<a name="module_setup..noConflict"></a>

### setup~noConflict() ⇒ <code>gameStart</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>setup</code>](#module_setup)  
<a name="module_setup..beginRound"></a>

### setup~beginRound(e, mainForm) ⇒ <code>boolean</code>
Logic for setting up and starting a new round(selects random start player and calls computer attack if it is AI starting)

**Kind**: inner method of [<code>setup</code>](#module_setup)  

| Param |
| --- |
| e | 
| mainForm | 

<a name="module_setup..main"></a>

### setup~main(parent) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
The entry function

**Kind**: inner method of [<code>setup</code>](#module_setup)  

| Param |
| --- |
| parent | 

<a name="module_setup..restart"></a>

### setup~restart(e, button)
**Kind**: inner method of [<code>setup</code>](#module_setup)  

| Param |
| --- |
| e | 
| button | 

<a name="module_setup..functionalHelpers"></a>

### setup~functionalHelpers : <code>\*</code> \| [<code>functionalHelpers</code>](#module_functionalHelpers)
Verify availability of functional-helpers

**Kind**: inner typedef of [<code>setup</code>](#module_setup)  
<a name="module_setup..jsonDom"></a>

### setup~jsonDom : <code>\*</code> \| <code>module:json-dom</code>
Verify availability of jsonDom

**Kind**: inner typedef of [<code>setup</code>](#module_setup)  
<a name="module_setup..gameLayout"></a>

### setup~gameLayout : <code>\*</code> \| [<code>layout</code>](#module_layout)
Verify availability of gameLayout

**Kind**: inner typedef of [<code>setup</code>](#module_setup)  
<a name="module_setup..gamePieces"></a>

### setup~gamePieces : <code>\*</code> \| [<code>pieces</code>](#module_pieces)
Verify availability of gamePieces

**Kind**: inner typedef of [<code>setup</code>](#module_setup)  
<a name="module_setup..gameUtils"></a>

### setup~gameUtils : <code>\*</code> \| [<code>functions</code>](#module_functions)
Verify availability of gameUtils

**Kind**: inner typedef of [<code>setup</code>](#module_setup)  
<a name="module_setup..gameActions"></a>

### setup~gameActions : <code>\*</code> \| [<code>actions</code>](#module_actions)
Verify availability of gameActions

**Kind**: inner typedef of [<code>setup</code>](#module_setup)  
<a name="module_pieces"></a>

## pieces
A reference to all functions to be used globally / exported


* [pieces](#module_pieces)
    * [~noConflict()](#module_pieces..noConflict) ⇒ <code>gamePieces</code>
    * [~waterTile()](#module_pieces..waterTile) ⇒ <code>Object</code>
    * [~shipTile()](#module_pieces..shipTile) ⇒ <code>Object</code>
    * [~ship(name)](#module_pieces..ship) ⇒ <code>Object</code>
    * [~hitTile()](#module_pieces..hitTile) ⇒ <code>Object</code>
    * [~playerSet(board, name)](#module_pieces..playerSet) ⇒ <code>Object</code>
    * [~playerStats([player], [status&#x3D;])](#module_pieces..playerStats) ⇒ <code>Object</code>
    * [~functionalHelpers](#module_pieces..functionalHelpers) : <code>\*</code> \| [<code>functionalHelpers</code>](#module_functionalHelpers)
    * [~jsonDom](#module_pieces..jsonDom) : <code>\*</code> \| <code>module:json-dom</code>

<a name="module_pieces..noConflict"></a>

### pieces~noConflict() ⇒ <code>gamePieces</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  
<a name="module_pieces..waterTile"></a>

### pieces~waterTile() ⇒ <code>Object</code>
Set the style for tiles representing water.

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  
<a name="module_pieces..shipTile"></a>

### pieces~shipTile() ⇒ <code>Object</code>
Set status and custom properties for tiles that have a ship

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  
<a name="module_pieces..ship"></a>

### pieces~ship(name) ⇒ <code>Object</code>
Store properties of a ship which includes an array of all associated ship tiles.

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="module_pieces..hitTile"></a>

### pieces~hitTile() ⇒ <code>Object</code>
Set the status of the tile to hit.

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  
<a name="module_pieces..playerSet"></a>

### pieces~playerSet(board, name) ⇒ <code>Object</code>
Store the player attributes.

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  

| Param | Type |
| --- | --- |
| board | <code>Object</code> | 
| name | <code>string</code> | 

<a name="module_pieces..playerStats"></a>

### pieces~playerStats([player], [status&#x3D;]) ⇒ <code>Object</code>
The defined attributes for each player

**Kind**: inner method of [<code>pieces</code>](#module_pieces)  

| Param | Type | Default |
| --- | --- | --- |
| [player] | <code>Object</code> | <code>{}</code> | 
| [status=] | <code>Object</code> |  | 

<a name="module_pieces..functionalHelpers"></a>

### pieces~functionalHelpers : <code>\*</code> \| [<code>functionalHelpers</code>](#module_functionalHelpers)
Verify availability of functional-helpers

**Kind**: inner typedef of [<code>pieces</code>](#module_pieces)  
<a name="module_pieces..jsonDom"></a>

### pieces~jsonDom : <code>\*</code> \| <code>module:json-dom</code>
Verify availability of jsonDom

**Kind**: inner typedef of [<code>pieces</code>](#module_pieces)  
<a name="module_main"></a>

## main
A reference to all functions to be used globally / exported


* [main](#module_main)
    * [~noConflict()](#module_main..noConflict) ⇒ <code>gameMain</code>
    * [~jsonDom](#module_main..jsonDom) : <code>\*</code> \| <code>module:json-dom</code>
    * [~gameActions](#module_main..gameActions) : <code>\*</code> \| [<code>actions</code>](#module_actions)
    * [~gameStart](#module_main..gameStart) : <code>\*</code> \| [<code>setup</code>](#module_setup)
    * [~documentItem](#module_main..documentItem) : <code>module:json-dom.documentItem</code>

<a name="module_main..noConflict"></a>

### main~noConflict() ⇒ <code>gameMain</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>main</code>](#module_main)  
<a name="module_main..jsonDom"></a>

### main~jsonDom : <code>\*</code> \| <code>module:json-dom</code>
Verify availability of jsonDom

**Kind**: inner typedef of [<code>main</code>](#module_main)  
<a name="module_main..gameActions"></a>

### main~gameActions : <code>\*</code> \| [<code>actions</code>](#module_actions)
Verify availability of gameActions

**Kind**: inner typedef of [<code>main</code>](#module_main)  
<a name="module_main..gameStart"></a>

### main~gameStart : <code>\*</code> \| [<code>setup</code>](#module_setup)
Verify availability of gameStart

**Kind**: inner typedef of [<code>main</code>](#module_main)  
<a name="module_main..documentItem"></a>

### main~documentItem : <code>module:json-dom.documentItem</code>
Create new private reference to the document

**Kind**: inner typedef of [<code>main</code>](#module_main)  
<a name="module_layout"></a>

## layout : <code>Object</code>
A reference to all functions to be used globally / exported


* [layout](#module_layout) : <code>Object</code>
    * [~noConflict()](#module_layout..noConflict) ⇒ <code>gameLayout</code>
    * [~mainMenu()](#module_layout..mainMenu) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~boards([players])](#module_layout..boards) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~finalScore(players)](#module_layout..finalScore) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~jsonDom](#module_layout..jsonDom) : <code>\*</code> \| <code>module:json-dom</code>

<a name="module_layout..noConflict"></a>

### layout~noConflict() ⇒ <code>gameLayout</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>layout</code>](#module_layout)  
<a name="module_layout..mainMenu"></a>

### layout~mainMenu() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
This will be the main menu for the game.

**Kind**: inner method of [<code>layout</code>](#module_layout)  
<a name="module_layout..boards"></a>

### layout~boards([players]) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Wrapper div for player data / boards

**Kind**: inner method of [<code>layout</code>](#module_layout)  

| Param | Type | Default |
| --- | --- | --- |
| [players] | <code>Array</code> | <code>[]</code> | 

<a name="module_layout..finalScore"></a>

### layout~finalScore(players) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Display the final scores after a game has ended and have a button to restart.

**Kind**: inner method of [<code>layout</code>](#module_layout)  

| Param | Type |
| --- | --- |
| players | <code>Array</code> | 

<a name="module_layout..jsonDom"></a>

### layout~jsonDom : <code>\*</code> \| <code>module:json-dom</code>
Verify availability of jsonDom

**Kind**: inner typedef of [<code>layout</code>](#module_layout)  
<a name="module_functions"></a>

## functions
A reference to all functions to be used globally / exported


* [functions](#module_functions)
    * [~noConflict()](#module_functions..noConflict) ⇒ <code>gameUtils</code>
    * [~checkIfShipCell(pnt, matrix)](#module_functions..checkIfShipCell) ⇒ <code>boolean</code>
    * [~checkIfHitCell(pnt, matrix)](#module_functions..checkIfHitCell) ⇒ <code>boolean</code>
    * [~getAllNonHitCells(matrix)](#module_functions..getAllNonHitCells) ⇒ <code>Array</code>
    * [~getAdjEdgeNonHitCells(pnt, matrix)](#module_functions..getAdjEdgeNonHitCells) ⇒ <code>Array</code>
    * [~getALowStatusItem(items)](#module_functions..getALowStatusItem) ⇒ <code>Array</code>
    * [~getLowStatusItems(items)](#module_functions..getLowStatusItems) ⇒ <code>Array</code>
    * [~getBrokenItems(items)](#module_functions..getBrokenItems) ⇒ <code>Array</code>
    * [~getBrokenShipsPlayers(players)](#module_functions..getBrokenShipsPlayers) ⇒ <code>Array</code>
    * [~numDamagedParts(total, status)](#module_functions..numDamagedParts) ⇒ <code>number</code>
    * [~filterAdjacentPoints(pnt)](#module_functions..filterAdjacentPoints) ⇒ <code>boolean</code>
    * [~jsonDom](#module_functions..jsonDom) : <code>\*</code> \| <code>module:json-dom</code>

<a name="module_functions..noConflict"></a>

### functions~noConflict() ⇒ <code>gameUtils</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>functions</code>](#module_functions)  
<a name="module_functions..checkIfShipCell"></a>

### functions~checkIfShipCell(pnt, matrix) ⇒ <code>boolean</code>
Return the hasShip tile boolean at the specified point.

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_functions..checkIfHitCell"></a>

### functions~checkIfHitCell(pnt, matrix) ⇒ <code>boolean</code>
Return the isHit tile boolean at the specified point.

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_functions..getAllNonHitCells"></a>

### functions~getAllNonHitCells(matrix) ⇒ <code>Array</code>
Get all points which were not yet hit in the matrix.

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| matrix | 

<a name="module_functions..getAdjEdgeNonHitCells"></a>

### functions~getAdjEdgeNonHitCells(pnt, matrix) ⇒ <code>Array</code>
Get the points which have same edges with the provided point and are not hit.

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_functions..getALowStatusItem"></a>

### functions~getALowStatusItem(items) ⇒ <code>Array</code>
Given an array of items, return the item with the lowest status property (at the end of the array)

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| items | 

<a name="module_functions..getLowStatusItems"></a>

### functions~getLowStatusItems(items) ⇒ <code>Array</code>
Given an array of items, return all items which have the lowest status property

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| items | 

<a name="module_functions..getBrokenItems"></a>

### functions~getBrokenItems(items) ⇒ <code>Array</code>
Given an array of items, return all of the items which have a status less than 100, but more than 0

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| items | 

<a name="module_functions..getBrokenShipsPlayers"></a>

### functions~getBrokenShipsPlayers(players) ⇒ <code>Array</code>
Return all of the players which have broken ships.

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| players | 

<a name="module_functions..numDamagedParts"></a>

### functions~numDamagedParts(total, status) ⇒ <code>number</code>
Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| total | 
| status | 

<a name="module_functions..filterAdjacentPoints"></a>

### functions~filterAdjacentPoints(pnt) ⇒ <code>boolean</code>
Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell

**Kind**: inner method of [<code>functions</code>](#module_functions)  

| Param |
| --- |
| pnt | 

<a name="module_functions..jsonDom"></a>

### functions~jsonDom : <code>\*</code> \| <code>module:json-dom</code>
Verify availability of jsonDom

**Kind**: inner typedef of [<code>functions</code>](#module_functions)  
<a name="module_actions"></a>

## actions : <code>Object</code>
All methods exported from this module are encapsulated within gameActions.


* [actions](#module_actions) : <code>Object</code>
    * [~noConflict()](#module_actions..noConflict) ⇒ <code>gameActions</code>
    * [~setShip(matrix, point, view)](#module_actions..setShip)
    * [~updatePlayer(player, playAgain, sunkShip)](#module_actions..updatePlayer)
    * [~attackFleet(target)](#module_actions..attackFleet) ⇒ <code>\*</code>
    * [~attackListener(e, target)](#module_actions..attackListener) ⇒ <code>\*</code>
    * [~computerAttack(player, players)](#module_actions..computerAttack)
    * [~functionalHelpers](#module_actions..functionalHelpers) : <code>\*</code> \| [<code>functionalHelpers</code>](#module_functionalHelpers)
    * [~jsonDom](#module_actions..jsonDom) : <code>\*</code> \| <code>module:json-dom</code>
    * [~gameLayout](#module_actions..gameLayout) : <code>\*</code> \| [<code>layout</code>](#module_layout)
    * [~gamePieces](#module_actions..gamePieces) : <code>\*</code> \| [<code>pieces</code>](#module_pieces)
    * [~gameUtils](#module_actions..gameUtils) : <code>\*</code> \| [<code>functions</code>](#module_functions)

<a name="module_actions..noConflict"></a>

### actions~noConflict() ⇒ <code>gameActions</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>actions</code>](#module_actions)  
<a name="module_actions..setShip"></a>

### actions~setShip(matrix, point, view)
Set a specified point to be part of a ship

**Kind**: inner method of [<code>actions</code>](#module_actions)  

| Param |
| --- |
| matrix | 
| point | 
| view | 

<a name="module_actions..updatePlayer"></a>

### actions~updatePlayer(player, playAgain, sunkShip)
Track player stats such as attacks and turns

**Kind**: inner method of [<code>actions</code>](#module_actions)  

| Param |
| --- |
| player | 
| playAgain | 
| sunkShip | 

<a name="module_actions..attackFleet"></a>

### actions~attackFleet(target) ⇒ <code>\*</code>
Perform attack on an enemy board / cell

**Kind**: inner method of [<code>actions</code>](#module_actions)  

| Param |
| --- |
| target | 

<a name="module_actions..attackListener"></a>

### actions~attackListener(e, target) ⇒ <code>\*</code>
**Kind**: inner method of [<code>actions</code>](#module_actions)  

| Param |
| --- |
| e | 
| target | 

<a name="module_actions..computerAttack"></a>

### actions~computerAttack(player, players)
Main AI logic for computer to attack, selects a target then performs attack function.

**Kind**: inner method of [<code>actions</code>](#module_actions)  

| Param |
| --- |
| player | 
| players | 

<a name="module_actions..functionalHelpers"></a>

### actions~functionalHelpers : <code>\*</code> \| [<code>functionalHelpers</code>](#module_functionalHelpers)
Verify availability of functional-helpers

**Kind**: inner typedef of [<code>actions</code>](#module_actions)  
<a name="module_actions..jsonDom"></a>

### actions~jsonDom : <code>\*</code> \| <code>module:json-dom</code>
Verify availability of json-dom

**Kind**: inner typedef of [<code>actions</code>](#module_actions)  
<a name="module_actions..gameLayout"></a>

### actions~gameLayout : <code>\*</code> \| [<code>layout</code>](#module_layout)
Verify availability of gameLayout

**Kind**: inner typedef of [<code>actions</code>](#module_actions)  
<a name="module_actions..gamePieces"></a>

### actions~gamePieces : <code>\*</code> \| [<code>pieces</code>](#module_pieces)
Verify availability of gamePieces

**Kind**: inner typedef of [<code>actions</code>](#module_actions)  
<a name="module_actions..gameUtils"></a>

### actions~gameUtils : <code>\*</code> \| [<code>functions</code>](#module_functions)
Verify availability of gameUtils

**Kind**: inner typedef of [<code>actions</code>](#module_actions)  
<a name="module_game/setup"></a>

## game/setup
A reference to all functions to be used globally / exported


* [game/setup](#module_game/setup)
    * [~defaultFleet](#module_game/setup..defaultFleet) ⇒ <code>Array</code>
    * [~buildShip(shipInfo, line, matrix, view)](#module_game/setup..buildShip) ⇒ <code>Object</code>
    * [~selectShipDirection(lengths, shipLength)](#module_game/setup..selectShipDirection)
    * [~randomStartDir(lengths, shipLength, dir)](#module_game/setup..randomStartDir) ⇒ <code>Object</code>
    * [~generateStartEnd(matrix, shipLength, lengths, startDir)](#module_game/setup..generateStartEnd) ⇒ <code>Array</code>
    * [~generateRandomFleet(ships, matrix, [view])](#module_game/setup..generateRandomFleet) ⇒ <code>Array</code>
    * [~buildPlayers(humans, robots, players)](#module_game/setup..buildPlayers) ⇒ <code>Array</code>
    * [~beginRound(e, mainForm)](#module_game/setup..beginRound) ⇒ <code>boolean</code>
    * [~main(parent)](#module_game/setup..main) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
    * [~restart(e, button)](#module_game/setup..restart)

<a name="module_game/setup..defaultFleet"></a>

### game/setup~defaultFleet ⇒ <code>Array</code>
Create a default fleet using the standard battleship lengths.

**Kind**: inner constant of [<code>game/setup</code>](#module_game/setup)  

| Param | Type | Default |
| --- | --- | --- |
| matrix | <code>Object</code> |  | 
| [view] | <code>boolean</code> | <code>false</code> | 

<a name="module_game/setup..buildShip"></a>

### game/setup~buildShip(shipInfo, line, matrix, view) ⇒ <code>Object</code>
Generate a ship with the provided line of points.The visibility of the ship on the board is determined by the view parameter.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param | Default |
| --- | --- |
| shipInfo |  | 
| line |  | 
| matrix |  | 
| view | <code>false</code> | 

<a name="module_game/setup..selectShipDirection"></a>

### game/setup~selectShipDirection(lengths, shipLength)
**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| lengths | 
| shipLength | 

<a name="module_game/setup..randomStartDir"></a>

### game/setup~randomStartDir(lengths, shipLength, dir) ⇒ <code>Object</code>
**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| lengths | 
| shipLength | 
| dir | 

<a name="module_game/setup..generateStartEnd"></a>

### game/setup~generateStartEnd(matrix, shipLength, lengths, startDir) ⇒ <code>Array</code>
Get a qualifying start and direction point for a ship of specified lengthWARNING: This is a recursive function.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| matrix | 
| shipLength | 
| lengths | 
| startDir | 

<a name="module_game/setup..generateRandomFleet"></a>

### game/setup~generateRandomFleet(ships, matrix, [view]) ⇒ <code>Array</code>
Create a series of randomly placed ships based on the provided shipLengths.The optional parameter view will set the visibility of the ships.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param | Type | Default |
| --- | --- | --- |
| ships | <code>Array</code> |  | 
| matrix | <code>Object</code> |  | 
| [view] | <code>boolean</code> | <code>false</code> | 

<a name="module_game/setup..buildPlayers"></a>

### game/setup~buildPlayers(humans, robots, players) ⇒ <code>Array</code>
Create players and associated properties.Takes an integer for the number of players to generate.Returns an array of players.WARNING: This is a recursive function.

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param | Default |
| --- | --- |
| humans |  | 
| robots | <code>0</code> | 
| players |  | 

<a name="module_game/setup..beginRound"></a>

### game/setup~beginRound(e, mainForm) ⇒ <code>boolean</code>
Logic for setting up and starting a new round(selects random start player and calls computer attack if it is AI starting)

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| e | 
| mainForm | 

<a name="module_game/setup..main"></a>

### game/setup~main(parent) ⇒ <code>module:jDom/core/dom/objects.documentItem</code>
The entry function

**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| parent | 

<a name="module_game/setup..restart"></a>

### game/setup~restart(e, button)
**Kind**: inner method of [<code>game/setup</code>](#module_game/setup)  

| Param |
| --- |
| e | 
| button | 

<a name="module_game/functions"></a>

## game/functions
A reference to all functions to be used globally / exported


* [game/functions](#module_game/functions)
    * [~checkIfShipCell(pnt, matrix)](#module_game/functions..checkIfShipCell) ⇒ <code>boolean</code>
    * [~checkIfHitCell(pnt, matrix)](#module_game/functions..checkIfHitCell) ⇒ <code>boolean</code>
    * [~getAllNonHitCells(matrix)](#module_game/functions..getAllNonHitCells) ⇒ <code>Array</code>
    * [~getAdjEdgeNonHitCells(pnt, matrix)](#module_game/functions..getAdjEdgeNonHitCells) ⇒ <code>Array</code>
    * [~getALowStatusItem(items)](#module_game/functions..getALowStatusItem) ⇒ <code>Array</code>
    * [~getLowStatusItems(items)](#module_game/functions..getLowStatusItems) ⇒ <code>Array</code>
    * [~getBrokenItems(items)](#module_game/functions..getBrokenItems) ⇒ <code>Array</code>
    * [~getBrokenShipsPlayers(players)](#module_game/functions..getBrokenShipsPlayers) ⇒ <code>Array</code>
    * [~numDamagedParts(total, status)](#module_game/functions..numDamagedParts) ⇒ <code>number</code>
    * [~filterAdjacentPoints(pnt)](#module_game/functions..filterAdjacentPoints) ⇒ <code>boolean</code>

<a name="module_game/functions..checkIfShipCell"></a>

### game/functions~checkIfShipCell(pnt, matrix) ⇒ <code>boolean</code>
Return the hasShip tile boolean at the specified point.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_game/functions..checkIfHitCell"></a>

### game/functions~checkIfHitCell(pnt, matrix) ⇒ <code>boolean</code>
Return the isHit tile boolean at the specified point.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_game/functions..getAllNonHitCells"></a>

### game/functions~getAllNonHitCells(matrix) ⇒ <code>Array</code>
Get all points which were not yet hit in the matrix.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| matrix | 

<a name="module_game/functions..getAdjEdgeNonHitCells"></a>

### game/functions~getAdjEdgeNonHitCells(pnt, matrix) ⇒ <code>Array</code>
Get the points which have same edges with the provided point and are not hit.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 
| matrix | 

<a name="module_game/functions..getALowStatusItem"></a>

### game/functions~getALowStatusItem(items) ⇒ <code>Array</code>
Given an array of items, return the item with the lowest status property (at the end of the array)

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| items | 

<a name="module_game/functions..getLowStatusItems"></a>

### game/functions~getLowStatusItems(items) ⇒ <code>Array</code>
Given an array of items, return all items which have the lowest status property

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| items | 

<a name="module_game/functions..getBrokenItems"></a>

### game/functions~getBrokenItems(items) ⇒ <code>Array</code>
Given an array of items, return all of the items which have a status less than 100, but more than 0

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| items | 

<a name="module_game/functions..getBrokenShipsPlayers"></a>

### game/functions~getBrokenShipsPlayers(players) ⇒ <code>Array</code>
Return all of the players which have broken ships.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| players | 

<a name="module_game/functions..numDamagedParts"></a>

### game/functions~numDamagedParts(total, status) ⇒ <code>number</code>
Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| total | 
| status | 

<a name="module_game/functions..filterAdjacentPoints"></a>

### game/functions~filterAdjacentPoints(pnt) ⇒ <code>boolean</code>
Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell

**Kind**: inner method of [<code>game/functions</code>](#module_game/functions)  

| Param |
| --- |
| pnt | 

<a name="module_game/actions"></a>

## game/actions : <code>Object</code>
All methods exported from this module are encapsulated within gameActions.


* [game/actions](#module_game/actions) : <code>Object</code>
    * [~setViewShip](#module_game/actions..setViewShip)
    * [~setHiddenShip](#module_game/actions..setHiddenShip)
    * [~setHit](#module_game/actions..setHit)
    * [~configureHtml(config, isRobot)](#module_game/actions..configureHtml) ⇒ <code>\*</code>
    * [~update3dCell(config, matrix, x, y, z, isRobot)](#module_game/actions..update3dCell)
    * [~setShip(matrix, point, view)](#module_game/actions..setShip)
    * [~updatePlayerStats(player, status)](#module_game/actions..updatePlayerStats) ⇒ <code>\*</code>
    * [~updatePlayer(player, playAgain, sunkShip)](#module_game/actions..updatePlayer)
    * [~endGame(winner)](#module_game/actions..endGame) ⇒ <code>Array.&lt;\*&gt;</code>
    * [~findNextAttacker(attacker, players, attackerIndex)](#module_game/actions..findNextAttacker) ⇒ <code>\*</code>
    * [~getNextAttacker(attacker, players, playAgain)](#module_game/actions..getNextAttacker) ⇒ <code>\*</code>
    * [~updateScore(player, hitShip, sunkShip, players)](#module_game/actions..updateScore) ⇒ <code>\*</code>
    * [~attackFleet(target)](#module_game/actions..attackFleet) ⇒ <code>\*</code>
    * [~attackListener(e, target)](#module_game/actions..attackListener) ⇒ <code>\*</code>
    * [~selectTargetPlayer(players)](#module_game/actions..selectTargetPlayer) ⇒ <code>\*</code>
    * [~selectTargetCoordinate(victim)](#module_game/actions..selectTargetCoordinate) ⇒ <code>\*</code>
    * [~displayTargets(targets, target, victim)](#module_game/actions..displayTargets) ⇒ <code>Array</code>
    * [~resetTargets(data)](#module_game/actions..resetTargets) ⇒ <code>void</code> \| <code>Array</code> \| <code>Object</code> \| <code>\*</code>
    * [~computerAttack(player, players)](#module_game/actions..computerAttack)

<a name="module_game/actions..setViewShip"></a>

### game/actions~setViewShip
**Kind**: inner constant of [<code>game/actions</code>](#module_game/actions)  
<a name="module_game/actions..setHiddenShip"></a>

### game/actions~setHiddenShip
**Kind**: inner constant of [<code>game/actions</code>](#module_game/actions)  
<a name="module_game/actions..setHit"></a>

### game/actions~setHit
**Kind**: inner constant of [<code>game/actions</code>](#module_game/actions)  
<a name="module_game/actions..configureHtml"></a>

### game/actions~configureHtml(config, isRobot) ⇒ <code>\*</code>
Update view based on actions performed

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| config | 
| isRobot | 

<a name="module_game/actions..update3dCell"></a>

### game/actions~update3dCell(config, matrix, x, y, z, isRobot)
Given a cell and new config data, update the data of the cell

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param | Default |
| --- | --- |
| config |  | 
| matrix |  | 
| x |  | 
| y |  | 
| z |  | 
| isRobot | <code>false</code> | 

<a name="module_game/actions..setShip"></a>

### game/actions~setShip(matrix, point, view)
Set a specified point to be part of a ship

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| matrix | 
| point | 
| view | 

<a name="module_game/actions..updatePlayerStats"></a>

### game/actions~updatePlayerStats(player, status) ⇒ <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| status | 

<a name="module_game/actions..updatePlayer"></a>

### game/actions~updatePlayer(player, playAgain, sunkShip)
Track player stats such as attacks and turns

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| playAgain | 
| sunkShip | 

<a name="module_game/actions..endGame"></a>

### game/actions~endGame(winner) ⇒ <code>Array.&lt;\*&gt;</code>
Final state once a game is won (only one player remains)

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| winner | 

<a name="module_game/actions..findNextAttacker"></a>

### game/actions~findNextAttacker(attacker, players, attackerIndex) ⇒ <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| attacker | 
| players | 
| attackerIndex | 

<a name="module_game/actions..getNextAttacker"></a>

### game/actions~getNextAttacker(attacker, players, playAgain) ⇒ <code>\*</code>
Based on the current attacker and list of players, return the next attacker.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| attacker | 
| players | 
| playAgain | 

<a name="module_game/actions..updateScore"></a>

### game/actions~updateScore(player, hitShip, sunkShip, players) ⇒ <code>\*</code>
Update all game stats after each player round

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| hitShip | 
| sunkShip | 
| players | 

<a name="module_game/actions..attackFleet"></a>

### game/actions~attackFleet(target) ⇒ <code>\*</code>
Perform attack on an enemy board / cell

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| target | 

<a name="module_game/actions..attackListener"></a>

### game/actions~attackListener(e, target) ⇒ <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| e | 
| target | 

<a name="module_game/actions..selectTargetPlayer"></a>

### game/actions~selectTargetPlayer(players) ⇒ <code>\*</code>
Choose which player to attack.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| players | 

<a name="module_game/actions..selectTargetCoordinate"></a>

### game/actions~selectTargetCoordinate(victim) ⇒ <code>\*</code>
Choose which coordinate to attack.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| victim | 

<a name="module_game/actions..displayTargets"></a>

### game/actions~displayTargets(targets, target, victim) ⇒ <code>Array</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| targets | 
| target | 
| victim | 

<a name="module_game/actions..resetTargets"></a>

### game/actions~resetTargets(data) ⇒ <code>void</code> \| <code>Array</code> \| <code>Object</code> \| <code>\*</code>
**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| data | 

<a name="module_game/actions..computerAttack"></a>

### game/actions~computerAttack(player, players)
Main AI logic for computer to attack, selects a target then performs attack function.

**Kind**: inner method of [<code>game/actions</code>](#module_game/actions)  

| Param |
| --- |
| player | 
| players | 

<a name="module_game/pieces"></a>

## game/pieces
A reference to all functions to be used globally / exported


* [game/pieces](#module_game/pieces)
    * [~gameTile()](#module_game/pieces..gameTile) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~waterTile()](#module_game/pieces..waterTile) ⇒ <code>Object</code>
    * [~shipTile()](#module_game/pieces..shipTile) ⇒ <code>Object</code>
    * [~ship(name)](#module_game/pieces..ship) ⇒ <code>Object</code>
    * [~hitTile()](#module_game/pieces..hitTile) ⇒ <code>Object</code>
    * [~playerSet(board, name)](#module_game/pieces..playerSet) ⇒ <code>Object</code>
    * [~playerStats([player], [status&#x3D;])](#module_game/pieces..playerStats) ⇒ <code>Object</code>

<a name="module_game/pieces..gameTile"></a>

### game/pieces~gameTile() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Default properties for a tile in the battleship game.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..waterTile"></a>

### game/pieces~waterTile() ⇒ <code>Object</code>
Set the style for tiles representing water.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..shipTile"></a>

### game/pieces~shipTile() ⇒ <code>Object</code>
Set status and custom properties for tiles that have a ship

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..ship"></a>

### game/pieces~ship(name) ⇒ <code>Object</code>
Store properties of a ship which includes an array of all associated ship tiles.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="module_game/pieces..hitTile"></a>

### game/pieces~hitTile() ⇒ <code>Object</code>
Set the status of the tile to hit.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  
<a name="module_game/pieces..playerSet"></a>

### game/pieces~playerSet(board, name) ⇒ <code>Object</code>
Store the player attributes.

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  

| Param | Type |
| --- | --- |
| board | <code>Object</code> | 
| name | <code>string</code> | 

<a name="module_game/pieces..playerStats"></a>

### game/pieces~playerStats([player], [status&#x3D;]) ⇒ <code>Object</code>
The defined attributes for each player

**Kind**: inner method of [<code>game/pieces</code>](#module_game/pieces)  

| Param | Type | Default |
| --- | --- | --- |
| [player] | <code>Object</code> | <code>{}</code> | 
| [status=] | <code>Object</code> |  | 

<a name="module_game/layout"></a>

## game/layout : <code>Object</code>
A reference to all functions to be used globally / exported


* [game/layout](#module_game/layout) : <code>Object</code>
    * [~mainMenu()](#module_game/layout..mainMenu) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~boards([players])](#module_game/layout..boards) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
    * [~finalScore(players)](#module_game/layout..finalScore) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>

<a name="module_game/layout..mainMenu"></a>

### game/layout~mainMenu() ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
This will be the main menu for the game.

**Kind**: inner method of [<code>game/layout</code>](#module_game/layout)  
<a name="module_game/layout..boards"></a>

### game/layout~boards([players]) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Wrapper div for player data / boards

**Kind**: inner method of [<code>game/layout</code>](#module_game/layout)  

| Param | Type | Default |
| --- | --- | --- |
| [players] | <code>Array</code> | <code>[]</code> | 

<a name="module_game/layout..finalScore"></a>

### game/layout~finalScore(players) ⇒ <code>module:jDom/core/dom/objects.DomItem</code>
Display the final scores after a game has ended and have a button to restart.

**Kind**: inner method of [<code>game/layout</code>](#module_game/layout)  

| Param | Type |
| --- | --- |
| players | <code>Array</code> | 

<a name="uniqueArray"></a>

## uniqueArray(array) ⇒ <code>Array</code>
Remove duplicate values from an array.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to make unique |

<a name="compareArrayResult"></a>

## compareArrayResult(arr1, arr2) ⇒ <code>Array.&lt;module:arrayHelpers~compareArrayResult&gt;</code>
Store the comparison result for an element that may exist in either of compared arrays.- value stores the element value from the arrays being compared- results has the comparison results where first index (0) is result for first compared array  and the second index (1) will be the result for the second compared array

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| arr1 | <code>Array</code> | The first array to compare |
| arr2 | <code>Array</code> | The second array to compare |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | The element value being compared |
| keys | <code>Array.&lt;Array.&lt;(string\|number)&gt;&gt;</code> | Keys in arrays associated with this value |
| result | <code>Array.&lt;number&gt;</code> | The results in the order of the compared arrays |

**Example**  
```js
// example of input and resulting outputconst arr1 = ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1']const arr2 = ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']// Taking the first element in both, then the value: 'match1' exists in both arrays// compareArrayResult will be { value: 'match1', result: [0, 0] }// First index of 0 indicates this value in the first array exists in the second array// Second index of 0 indicates this value in the second array exists in the first array// Taking the second element in the first array, then the value: 'firstMismatch1' exists in only the first array// compareArrayResult will be { value: 'firstMismatch1', result: [1, -1] }// First index of 1 indicates this value in the first array might need to be added to the second array// Second index of -1 indicates this value only exists in the first array// Taking the third element in the second array, then the value: 'secondMismatch1' exists in only the second array// compareArrayResult will be { value: 'secondMismatch1', result: [-1, 1] }// First index of -1 indicates this value only exists in the second array// Second index of 1 indicates this value in the second array might need to be added to the first array

/**Compare two Arrays and return the Object where the value for each property is as follows:-1 to indicate val1 is less than val20 to indicate both values are the equal1 to indicate val1 is greater than val2The returned Object uses the element values as the property namesThis functions works by first creating a concatenated array of all unique values. Then for each unique values,convert to a string and use it as a new property name. Array filter each array checking if it has the unique value.Use the lengths of these filtered arrays to compare. So if the first array has the value and the second one doesn'tthe first length will be one or more and the second will be zero, if the both have the value then both will be oneor more.
```
**Example**  
```js
// example of input and resulting outputcompareArrays(  ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],  ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1'])// unique array['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1', 'secondMismatch1']// result object[  {    value: 'match1',    keys: [[0], [0]],    result: [0, 0]  },  {    value: 'firstMismatch1',    keys: [[1], []],    result: [1, -1]  },  {    value: 'match2',    keys: [[2], [1]],    result: [0, 0]  },  {    value: 'firstMismatch2',    keys: [[3], []],    result: [1, -1]  },  {    value: 'badMatch1',    keys: [[4], [3, 4]],    result: [0, 0]  },  {    value: 'secondMismatch1',    keys: [[], [2]],    result: [-1, 1]  }]
```
<a name="documentItem"></a>

## documentItem : <code>module:jDom/core/dom/objects.documentItem</code>
Create new private reference to the document

**Kind**: global typedef  
<a name="callWithMissing"></a>

## callWithMissing ⇒ <code>\*</code>
The return function which takes the missing parameter in order to call the preloaded function.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| missing | <code>\*</code> | The missing parameter to be applied |

<a name="delayHandler"></a>

## delayHandler : <code>Object</code>
Provide a way to cancel a request or attach a resolve event.

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| resolver | <code>Promise</code> | 
| cancel | <code>function</code> | 

<a name="queueManagerHandle"></a>

## queueManagerHandle ⇒ <code>Promise</code>
Each time queue handle is called the passed function is added to the queue to be called when ready.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A function to enqueue |
| ...args | <code>\*</code> | Arguments to be passed to the function once it is ready |

<a name="queueTimeoutHandle"></a>

## queueTimeoutHandle ⇒ <code>Promise</code>
Run Timeout functions one after the otherin queue.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A callback function to be performed at some time in the future. |
| time | <code>number</code> | The time in milliseconds to delay. |
| ...args | <code>\*</code> | Arguments to be passed to the callback once it is implemented. |

