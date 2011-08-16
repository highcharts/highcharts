var AdaptersTest = TestCase('AdaptersTest');

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

/**
 * Test an event that fires once and removes itself.
 *
 * The counter is just a property of an object.
 */
AdaptersTest.prototype.testObjectEventSelfRemove = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
			removeEvent(o, 'myEvent', f);
		};

	// Setup event handler
	addEvent(o, 'myEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'myEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'myEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test an event that triggers another event that remove itself.
 *
 * The counter is just a property of an object.
 */
AdaptersTest.prototype.tXstObjectEventChainedRemove = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Add a runf handler
	addEvent(o, 'innerEvent', f);

	// remove it on chart destroy
	addEvent(document, 'outerEvent', function() {
		jstestdriver.console.log('about to remove innerEvent');
		removeEvent(o, 'innerEvent', f);
	});

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
	addEvent(o, 'myEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'myEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'myEvent', null, null);
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
	addEvent(o, 'myEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'myEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'myEvent');

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'myEvent', null, null);
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
	addEvent(o, 'myEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'myEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'myEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'myEvent', null, null);
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

	// Setup event handler
	addEvent(o, 'my:Event', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'my:Event', null, null);
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'my:Event', null, null);
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
}

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

	// Setup event handler
	addEvent(o, 'my:Event', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'my:Event', null, null);
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'my:Event');

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'my:Event', null, null);
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
}

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

	// Setup event handler
	addEvent(o, 'my:Event', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'my:Event', null, null);
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'my:Event', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'my:Event', null, null);
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/*
AdaptersTest.prototype.testChartEvent = function() {
	TODO: Implement
}

AdaptersTest.prototype.testDocumentEvent = function() {
	TODO: Implement
}

AdaptersTest.prototype.testWindowEvent = function() {
	TODO: Implement
}
*/