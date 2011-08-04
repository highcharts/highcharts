var UtilTest = TestCase("UtilitiesTest");

UtilTest.prototype.testExtend = function () {
	var empty = {};
	var extra = {key1: "k1", key2: "k2"};
	var extra2 = {key3: "k3", key4: "k4"};
	var result;

	// test extend of undefined
	result = extend(undefined, extra);
	assertEquals("Extended undefined", 2, this.countMembers(result));
	
	// test extend of null
	result = extend(null, extra);
	assertEquals("Extended null", 2, this.countMembers(result));
	
	// test extend of empty
	result = extend(empty, extra);
	assertEquals("Extended empty object", 2, this.countMembers(result));
	
	// test extend of same object
	result = extend(extra, extra);
	assertEquals("Extended object with object", 2, this.countMembers(result));

	// test extend of another object
	result = extend(extra, extra2);
	assertEquals("Extended object with object2", 4, this.countMembers(result));
};

UtilTest.prototype.countMembers = function (obj) {
	var count = 0;
	for (var member in obj) {
		count++;
	}
	
	return count;
};

UtilTest.prototype.testPInt = function () {
	// test without a base defined
	assertEquals("base not defined", 15, pInt("15"));

	// test with base 10
	assertEquals("base 10", 15, pInt("15", 10));

	// test with base 16
	assertEquals("base 16", 15, pInt("F", 16));
};

UtilTest.prototype.testIsString = function () {
	// test with undefined
	assertEquals("IsString undefined", false, isString(undefined));

	// test with null
	assertEquals("IsString null", false, isString(null));

	// test with empty object
	assertEquals("IsString {}", false, isString({}));

	// test with number
	assertEquals("IsString number", false, isString(15));

	// test with empty string
	assertEquals("IsString empty", true, isString(""));

	// test with string
	assertEquals("IsString string", true, isString("this is a string"));
};

UtilTest.prototype.testIsObject = function () {
	// test with undefined
	assertEquals("IsObject undefined", false, isObject(undefined));

	// test with null, surprise!!
	assertEquals("IsObject null", true, isObject(null));

	// test with number
	assertEquals("IsObject number", false, isObject(15));

	// test with string
	assertEquals("IsObject string", false, isObject("this is a string"));

	// test with object
	assertEquals("IsObject object", true, isObject({}));
};

UtilTest.prototype.testIsNumber = function () {
	// test with undefined
	assertEquals("IsNumber undefined", false, isNumber(undefined));

	// test with null
	assertEquals("IsNumber null", false, isNumber(null));

	// test with number
	assertEquals("IsNumber number", true, isNumber(15));

	// test with string
	assertEquals("IsNumber string", false, isNumber("this is a string"));

	// test with object
	assertEquals("IsNumber object", false, isNumber({}));
};

UtilTest.prototype.testLog2Lin = function () {
	// TODO: implement
};

UtilTest.prototype.testLin2Log = function () {
	// TODO: implement
};

/**
 * Tests if a point is inside a rectangle
 */
UtilTest.prototype.pointInRect = function (x, y, rect) {
	var inside = x >= rect.x && x <= (rect.x + rect.width) && y >= rect.y && y <= (rect.y + rect.height)
	return inside;
};

/**
 * Tests if a small rectangle is inside a bigger rectangle by testing each corner.
 */
UtilTest.prototype.rectInRect = function (smallRect, largeRect) {
	// (Maybe only two corners need to be tested)
	var inside = this.pointInRect(smallRect.x, smallRect.y, largeRect); // left top
	inside = inside && this.pointInRect(smallRect.x + smallRect.width, smallRect.y, largeRect); // right top
	inside = inside && this.pointInRect(smallRect.x + smallRect.width, smallRect.y + smallRect.height, largeRect); // right bottom
	inside = inside && this.pointInRect(smallRect.x, smallRect.y + smallRect.height, largeRect); // left bottom
	return inside;
};

/**
 * Test the placeBox utility function. It should adjust a tooltip rectangle to be inside the chart but not cover the point itself.
 */
UtilTest.prototype.testPlaceBox = function () {
	var chartRect = {x: 0, y: 0, width: 100, height: 100 },
		tooltipSize = {width: 50, height: 20},
		dataPoint = {x: 0, y: 50},
		tooltipPoint,
		boxPoint;

	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	jstestdriver.console.log(boxPoint.x, boxPoint.y, boxPoint.width, boxPoint.height);
	assertTrue('Left rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('Left tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.x = 100;
	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	jstestdriver.console.log(boxPoint.x, boxPoint.y, boxPoint.width, boxPoint.height);
	assertTrue('Right rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('Right tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.x = 50;
	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	jstestdriver.console.log(boxPoint.x, boxPoint.y, boxPoint.width, boxPoint.height);
	assertTrue('Mid rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('Mid tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));
};
