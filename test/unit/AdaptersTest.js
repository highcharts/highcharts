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

