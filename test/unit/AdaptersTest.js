var AdaptersTest = TestCase('AdaptersTest');

AdaptersTest.prototype.setUp = function () {
	// Map the three event functions to call our own instead.
	this.eventMonitor = new EventMonitor(addEvent, removeEvent, fireEvent);
}

/**
 * At tear down, log output from the event monitor and reset.
 */
AdaptersTest.prototype.tearDown = function() {
	this.eventMonitor.log();
	this.eventMonitor.reset();
	this.eventMonitor.disconnect();
	this.eventMonitor = null;
};

/**
 * Test general adapterRun.
 */
AdaptersTest.prototype.testAdapterRun = function() {
	
	// Issue #824, inner width of container not computed
	/*:DOC += <div id="outer" style="width: 100px"><div style="border: 10px solid red; padding: 10px" id="inner">Inner</div></div>*/
	var inner = document.getElementById('inner');

	assertNotUndefined('Inner div not undefined', inner);

	
	assertEquals('Inner width', 60, adapterRun(inner, 'width'));
};

/**
 * Test the each method.
 */
AdaptersTest.prototype.testEach = function() {
	// Arrange
	var arr = [1];

	// Act
	each(arr, function(value, i) {
		arr[i] = 2;
	});

	// Assert
	assertEquals('each value', 2, arr[0]);
	
	// Test scope in handler (#1184)
	/*var arr = [{}];
	each (arr, function () {
		this.foo = 'bar';
	});
	assertEquals('each scope', 'bar', arr[0].foo);*/
};


AdaptersTest.prototype.testInArray = function() {
	
	// test with no match
	assertEquals("In array -1", -1, inArray("bar", ["foo", "baz"]));
	
	// test with match
	assertEquals("In array 1", 1, inArray("bar", ["foo", "bar"]));
};

/**
 * Test each method on arrays.
 */
AdaptersTest.prototype.testEachOfDomNodes = function() {
	/*:DOC += <div id="testDiv"><p><p><p></div>*/
	var testDiv = document.getElementById('testDiv'),
		numbersOfPs = 0;

	assertNotUndefined('testDiv not undefined', testDiv);

	// Issue #611, mootools adapter, DOM collection 'childNodes' cannot be treated as an array
	each(testDiv.childNodes, function(value, i) {
		numbersOfPs++;
	});

	assertEquals('Numbers of paragraphs', 3, numbersOfPs);
};

/**
 * Test the each method with various numbers of parameters.
 */
AdaptersTest.prototype.testEachParams = function() {
	var arr = [{hello: undefined}];

	// Test indexing the array
	each(arr, function (value, i) {
		arr[i].hello = 'world';
	});

	assertEquals('each index', 'world', arr[0].hello);

	// Test without index
	arr = [{hello: undefined}];
	assertUndefined('each value undefined', arr[0].hello);
	each(arr, function (value) {
		value.hello = 'world';
	});

	assertEquals('each value', 'world', arr[0].hello);

	// Test with no parameters at all
	arr = [{hello: undefined}];
	assertUndefined('each no-param undefined', arr[0].hello);
	each(arr, function () {
		arr[0].hello = 'world';
	});

	assertEquals('each no-param', 'world', arr[0].hello);
};

/**
 * Test the grep method.
 */
AdaptersTest.prototype.testGrep = function() {
	// Arrange
	var arr = [1, 2];

	// Act
	arr = grep(arr, function(value) {
		return (value === 1);
	});

	// Assert
	assertEquals('grep length', 1, arr.length);
	assertEquals('grep value', 1, arr[0]);
};

/**
 * Test the map method.
 */
AdaptersTest.prototype.testMap = function() {
	// Arrange
	var arr = [1];

	// Act
	arr = map(arr, function(value) {
		return value + 1;
	});

	// Assert
	assertEquals('mapped value', 2, arr[0]);
};

/**
 * Test the merge method.
 */
AdaptersTest.prototype.testMerge = function() {
	// Arrange
	var obj1 = {
			prop1: 1,
			prop2: null,
			prop3: {dummy: 1},
			firstLevel: {
				secondLevel: {
					thirdLevel: 1
				}
			}
		},
		obj2 = {
			prop1: null,
			prop2: 2,
			prop3: null,
			firstLevel: {
				originalProp: {
					thirdLevel: 2
				}
			}
		},
		obj3 = {
			firstLevel: {
				secondLevel: {
					thirdLevel: 3
				}
			},
			arr: [1]
		},
		obj4;

	// Act
	obj4 = merge(obj1, obj2, obj3);

	assertEquals('merge properties', 3, obj4.firstLevel.secondLevel.thirdLevel);
	assertEquals('merge properties', 2, obj4.firstLevel.originalProp.thirdLevel);
	assertEquals('merge length', 1, obj4.arr.length);
	assertNull('prop1 should be null', obj4.prop1);
	assertEquals('prop2 should be 2', 2, obj4.prop2);
	assertNull('prop3 should be null', obj4.prop3);
};

AdaptersTest.prototype.testMergeBooleanProperties = function () {
	var obj1 = {
			prop1: 1,
			prop2: 'prop2'
		},
		obj2 = false,
		obj3 = {
			prop2: 'propTwo'
		},
		obj4;

	obj4 = merge(obj1, obj2, obj3);

	assertEquals('merge properties', 1, obj4.prop1);
	assertEquals('merge properties', 'propTwo', obj4.prop2);
	assertUndefined('mootools stray merge properties', obj4.$constructor);
	assertUndefined('mootools stray merge properties', obj4.$family);
};

AdaptersTest.prototype.testMergeUndefinedProperties = function () {
	var obj1 = {
			prop1: 1,
			prop2: 'prop2'
		},
		obj2,
		obj3 = {
			prop2: 'propTwo'
		},
		obj4;

	obj4 = merge(obj2, obj1, obj3);

	assertEquals('merge properties', 1, obj4.prop1);
	assertEquals('merge properties', 'propTwo', obj4.prop2);
	assertUndefined('mootools stray merge properties', obj4.$constructor);
	assertUndefined('mootools stray merge properties', obj4.$family);
};

AdaptersTest.prototype.testMergeFunctionProperties = function () {
	var obj1 = {
			prop1: 1,
			prop2: 'prop2'
		},
		obj2,
		obj3 = {
			prop2: function () {}
		},
		obj4;

	obj4 = merge(obj1, obj2, obj3);

	assertEquals('merge properties', 1, obj4.prop1);
	assertEquals('merge properties', 'function', typeof obj4.prop2);
	assertUndefined('mootools stray merge properties', obj4.$constructor);
	assertUndefined('mootools stray merge properties', obj4.$family);
};

/**
 * Test an event that fires once and removes itself.
 *
 * The counter is just a property of an object.
 */
AdaptersTest.prototype.testObjectEventSelfRemove = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
			removeEvent(o, 'customEvent', f);
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test an event that triggers another event that remove itself.
 *
 * The counter is just a property of an object.
 */
AdaptersTest.prototype.testObjectEventChainedRemove = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Add a inner event handler
	addEvent(o, 'innerEvent', f);

	var removeHandler = function() {
		removeEvent(o, 'innerEvent', f);
		removeEvent(document, 'outerEvent', removeHandler);
	}

	// remove it on chart destroy
	addEvent(document, 'outerEvent', removeHandler);

	// Fire it once
	fireEvent(o, 'innerEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Fire outer to remove inner
	fireEvent(document, 'outerEvent', null, null);
	assertEquals('no change', 1, o.clickedCount);

	// Fire it again
	fireEvent(o, 'innerEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};


/**
 * Test event add/fire/remove on a POJO.
 *
 * The counter is just a property of an object.
 * Remove all handlers.
 */
AdaptersTest.prototype.testObjectEventRemoveAll = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test event add/fire/remove on a POJO.
 *
 * The counter is just a property of an object.
 * Remove handlers of a certain type.
 */
AdaptersTest.prototype.testObjectEventRemoveType = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'customEvent');

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test event add/fire/remove on a POJO.
 *
 * The counter is just a property of an object.
 * Remove a specific handler.
 */
AdaptersTest.prototype.testObjectEventRemoveHandler = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Tests that default action can be prevented by returning false.
 */
AdaptersTest.prototype.tXstObjectEventPreventDefaultByReturn = function () {
	var o = {clickedCount: 0},
		f = function () {
			o.clickedCount++;
			return false;
		},
		defaultFunction = function () {
			o.clickedCount = o.clickedCount + 10;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, defaultFunction);

	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, defaultFunction);
	assertEquals('clicked again, no change', 11, o.clickedCount);
};

/**
 * Tests that preventDefault function exists in the event handler.
 */
AdaptersTest.prototype.testObjectEventPreventDefaultExists = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			assertEquals('preventDefault should exist', typeof e.preventDefault, 'function');
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 1}, null);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);
};

/**
 * Test that 'type' property exists in event handler.
 */
AdaptersTest.prototype.tXstObjectEventTypeExists = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			assertNotUndefined('type should exist', e.type);
			assertEquals('type should be correct', e.type, 'customEvent');
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 1}, null);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);
};

/**
 * Tests that 'target' property exists in event handler.
 */
AdaptersTest.prototype.tXstObjectEventTargetExists = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			assertNotUndefined('target should exist', e.target);
			assertEquals('target should be correct', e.target, o);
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 1}, null);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);
};

/**
 * Tests that stopPropagation exists in event handler.
 */
AdaptersTest.prototype.tXstObjectEventStopPropagationExists = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			assertEquals('preventDefault should exist', typeof e.stopPropagation, 'function');
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 1}, null);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);
};

/**
 * Tests that it is possible to prevent the default action by calling preventDefault.
 */
AdaptersTest.prototype.testObjectEventPreventDefaultByFunction = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			o.clickedCount += e.inc;
			e.preventDefault();
		},
		defaultFunction = function (e) {
			o.clickedCount += e.inc;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 1}, defaultFunction);

	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', {inc: 10}, defaultFunction);
	assertEquals('clicked again, no change', 11, o.clickedCount);
};

/**
 * Test that it is possible to prevent the default action from one
 * handler and still not running the default.
 */
AdaptersTest.prototype.testObjectEventPreventDefaultByFunctionMultiple = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			o.clickedCount += e.inc;
			e.preventDefault();
		},
		g = function (e) {
			o.clickedCount += e.inc;
			// e.preventDefault(); Do not prevent the default.
		},
		defaultFunction = function (e) {
			o.clickedCount += e.inc;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	addEvent(o, 'customEvent', g);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 1}, defaultFunction);

	assertEquals('now clicked', 2, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should fire 'g' which is not preventing the default
	fireEvent(o, 'customEvent', {inc: 10}, defaultFunction);
	assertEquals('clicked again, no change', 22, o.clickedCount); // 2 (from before) + 2 * 10 (handler + default)
	removeEvent(o, 'customEvent', g);
};

/**
 * Test that arguments are passed to the event handler.
 */
AdaptersTest.prototype.testObjectEventArgumentToHandler = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			o.clickedCount += e.inc;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 2}, null);

	assertEquals('now clicked', 2, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', {inc: 2}, null);
	assertEquals('clicked again, no change', 2, o.clickedCount);
};

/**
 * Test that arguments are passed to the default function.
 */
AdaptersTest.prototype.testObjectEventArgumentToDefaultFunction = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			o.clickedCount += e.inc;
		},
		defaultFunction = function (e) {
			o.clickedCount += e.inc;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 2}, defaultFunction);

	assertEquals('now clicked', 4, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should only run the default function, since the handler is removed
	fireEvent(o, 'customEvent', {inc: 2}, defaultFunction);
	assertEquals('clicked again, no change', 6, o.clickedCount);
};

/**
 * Tests that properties set in the handler is passed on to the default function.
 */
AdaptersTest.prototype.testObjectEventPropertiesSetInHandlerSuppliedToDefaultFunction = function () {
	var o = {clickedCount: 0},
		f = function (e) {
			o.clickedCount += e.inc;
			e.extraInc = 100;
		},
		defaultFunction = function (e) {
			o.clickedCount += e.inc;
			o.clickedCount += (e.extraInc || 0);
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', {inc: 2}, defaultFunction);

	assertEquals('now clicked', 104, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should only run the default function, since the handler is removed
	fireEvent(o, 'customEvent', {inc: 2}, defaultFunction);
	assertEquals('clicked again, no change', 106, o.clickedCount);
};

/**
 * Tests that the default function is executed even when no listeners are registered.
 */
AdaptersTest.prototype.testObjectEventDefaultFunctionShouldRunWhenNoHandlersAreRegistered = function () {
	var o = {clickedCount: 0},
		defaultFunction = function (e) {
			o.clickedCount += e.inc;
		};

	// Fire it, should only run the default function, since there is no handler
	fireEvent(o, 'customEvent', {inc: 1}, defaultFunction);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test event add/fire/remove on DOM element.
 *
 * The counter is stored as innerHTML in a div.
 */
AdaptersTest.prototype.testDomElementEventRemoveAll = function() {
	/*:DOC += <div id="o">0</div>*/
	var o = document.getElementById('o'),
		f = function() {
			o.innerHTML = pInt(o.innerHTML) + 1;
		};

	// 1. Test custom events
	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom now clicked', 1, pInt(o.innerHTML));

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, pInt(o.innerHTML));


	// 2. Test HTML events
	// Reset the counter
	o.innerHTML = 0;

	// Setup event handler
	addEvent(o, 'click', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	this.safeFireEvent(o, 'click');
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(o, 'click');
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/**
 * Test event add/fire/remove on DOM element.
 *
 * The counter is stored as innerHTML in a div.
 */
AdaptersTest.prototype.testDomElementEventRemoveType = function() {
	/*:DOC += <div id="o">0</div>*/
	var o = document.getElementById('o'),
		f = function() {
			o.innerHTML = pInt(o.innerHTML) + 1;
		};

	// 1. Test custom events
	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'customEvent');

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, pInt(o.innerHTML));

	// 2. Test HTML events
	// Reset the counter
	o.innerHTML = 0;

	// Setup event handler
	addEvent(o, 'click', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	this.safeFireEvent(o, 'click');
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'click');

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(o, 'click');
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/**
 * Test event add/fire/remove on DOM element.
 *
 * The counter is stored as innerHTML in a div.
 */
AdaptersTest.prototype.testDomElementEventRemoveHandler = function() {
	/*:DOC += <div id="o">0</div>*/
	var o = document.getElementById('o'),
		f = function() {
			o.innerHTML = pInt(o.innerHTML) + 1;
		};

	// 1. Test custom events.
	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, pInt(o.innerHTML));

	// 2. Test HTML events
	// Reset the counter
	o.innerHTML = 0;

	// Setup event handler
	addEvent(o, 'click', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	this.safeFireEvent(o, 'click');
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'click', f);

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(o, 'click');
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/*
AdaptersTest.prototype.testChartEvent = function() {
	TODO: Implement
}

AdaptersTest.prototype.testDocumentEvent = function() {
	TODO: Implement
}
*/

AdaptersTest.prototype.tXstWindowEvent = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// 1. Test custom events.
	// Setup event handler
	addEvent(window, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(window, 'customEvent', null, null);
	assertEquals('custom clicked', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(window, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(window, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, o.clickedCount);

	// 2. Test HTML events
	// Reset the counter
	o.clickedCount = 0;

	// Setup event handler
	addEvent(window, 'mousemove', f);
	assertEquals('not yet moved', 0, o.clickedCount);

	// Fire it once
	this.safeFireEvent(window, 'mousemove')
	assertEquals('now moved', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(window, 'mousemove', f);

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(window, 'mousemove')
	assertEquals('mousemove again, no change', 1, o.clickedCount);
};


/**
 * A safe way of doing fireEvent. Prototype does not support fireing
 * HTML events it seems.
 */
AdaptersTest.prototype.safeFireEvent = function(target, eventName) {
	if (!this.isPrototypeAdapter()) {
		fireEvent(target, eventName);
	} else {
		this.simulate(target, eventName);
	}
}

/**
 * Simple way to test if we are using the prototype adapter. The prototype
 * library does not fire dom events properly so, use this test to shortcut those tests.
 * Uses implementation details of the adapter.
 */
AdaptersTest.prototype.isPrototypeAdapter = function() {
	return globalAdapter && globalAdapter._extend;
};

/**
 * Simulates events of type HTMLEvent and MouseEvent.
 */
AdaptersTest.prototype.simulate = function(element, eventName) {
	var eventMatchers = {
			'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
			'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
		},
		defaultOptions = {
			pointerX: 0,
			pointerY: 0,
			button: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			bubbles: true,
			cancelable: true
		},
		options = extend(defaultOptions, arguments[2] || {}),
		oEvent, eventType = null;

	for (var name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}

	if (!eventType)
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents')
		{
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else
		{
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
				options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	} else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}

	return element;
}

