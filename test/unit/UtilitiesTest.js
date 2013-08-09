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

	// test with array
	assertEquals("IsObject array", true, isObject([]));
};


UtilTest.prototype.testIsArray = function () {
	// test with undefined
	assertEquals("isArray undefined", false, isArray(undefined));

	// test with null
	assertEquals("isArray null", false, isArray(null));

	// test with number
	assertEquals("isArray number", false, isArray(15));

	// test with string
	assertEquals("isArray string", false, isArray("this is a string"));

	// test with object
	assertEquals("isArray object", false, isArray({}));

	// test with array
	assertEquals("isArray array", true, isArray([]));

}

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

UtilTest.prototype.testSplat = function() {

	// test with undefined
	assertEquals("splat undefined", 1, splat(undefined).length);

	// test with null
	assertEquals("splat null", 1, splat(null).length);

	// test with false
	assertEquals("splat false", 1, splat(false).length);

	// test with 0
	assertEquals("splat 0", 1, splat(0).length);

	// test with ""
	assertEquals("splat 0", 1, splat("").length);

	// test with object
	assertEquals("splat object", 1, splat({}).length);

	// test with array
	assertEquals("splat array", 3, splat([1,2,3]).length);
};


UtilTest.prototype.testLog2Lin = function () {
	// TODO: implement
};

UtilTest.prototype.testLin2Log = function () {
	// TODO: implement
};



/**
 * Tests that the stable sort utility works.
 */
UtilTest.prototype.testStableSort = function () {
	// Initialize the array, it needs to be a certain size to trigger the unstable quicksort algorithm.
	// These 11 items fails in Chrome due to its unstable sort.
	var arr = [
			{a: 1, b: 'F'},
			{a: 2, b: 'H'},
			{a: 1, b: 'G'},
			{a: 0, b: 'A'},
			{a: 0, b: 'B'},
			{a: 3, b: 'J'},
			{a: 0, b: 'C'},
			{a: 0, b: 'D'},
			{a: 0, b: 'E'},
			{a: 2, b: 'I'},
			{a: 3, b: 'K'}
		],
		result = [];

	// Do the sort
	stableSort(arr, function (a, b) {
		return a.a - b.a;
	})

	// Collect the result
	for (var i = 0; i < arr.length; i++) {
		result.push(arr[i].b);
	}

	assertEquals('Stable sort in action', 'ABCDEFGHIJK', result.join(''));
	assertUndefined('Stable sort index should not be there', arr[0].ss_i);
};


/**
 * Tests that destroyObjectProperties calls the destroy method on properties before delete.
 */
UtilTest.prototype.testDestroyObjectProperties = function () {
	var testObject = {}, // Test object with the properties to destroy
		destroyCount = 0; // Number of destroy calls made

	/**
	 * Class containing a destroy method.
	 */
	function DummyWithDestroy() {};

	DummyWithDestroy.prototype.destroy = function () {
		destroyCount++;
		return null;
	};

	// Setup three properties with destroy methods
	testObject.rect = new DummyWithDestroy();
	testObject.line = new DummyWithDestroy();
	testObject.label = new DummyWithDestroy();

	// And one without
	testObject.noDestroy = {};

	// Destroy them all
	destroyObjectProperties(testObject);

	assertEquals('Number of destroyed elements', 3, destroyCount);
	assertUndefined('Property should be undefined', testObject.rect);
	assertUndefined('Property should be undefined', testObject.line);
	assertUndefined('Property should be undefined', testObject.label);
	assertUndefined('Property should be undefined', testObject.noDestroy);
};

/**
 * Test number formatting
 */
UtilTest.prototype.testNumberFormat = function () {
	
	assertEquals('Integer with decimals', "1.00", numberFormat(1, 2));
	assertEquals('Integer with decimal point', "1,0", numberFormat(1, 1, ','));
	assertEquals('Integer with thousands sep', "1 000", numberFormat(1000, null, null, ' '));
	
	// auto decimals
	assertEquals('Auto decimals', "1.234", numberFormat(1.234, -1));
	assertEquals('Auto decimals on string', "0", numberFormat("String", -1));
	assertEquals('Auto decimals on integer', "10", numberFormat(10, -1));
	assertEquals('Auto decimals on undefined', "0", numberFormat(undefined, -1));
	assertEquals('Auto decimals on null', "0", numberFormat(null, -1));
};


UtilTest.prototype.testFormat = function () {
	
	// Arrange
	var point = {
	    key: 'January',
	    value: Math.PI,
	    long: 12345.6789,
	    date: Date.UTC(2012, 0, 1),
	    deep: {
	        deeper: 123
	    }
	};
	
	
    assertEquals('Basic replacement', Math.PI, format("{point.value}", { point: point }));
    
    assertEquals('Replacement with two decimals', '3.14', format("{point.value:.2f}", { point: point }));
    
    
    // localized thousands separator and decimal point
    setOptions({
        lang: {
            decimalPoint: ',',
            thousandsSep: ' '
        }
    });
    assertEquals('Localized format', "12 345,68", format("{point.long:,.2f}", { point: point }));
    
    
    // default thousands separator and decimal point
    setOptions({
        lang: {
            decimalPoint: '.',
            thousandsSep: ','
        }
    });
    assertEquals('Thousands separator format', '12,345.68', format("{point.long:,.2f}", { point: point }));
    
    
    // Date format with colon
    assertEquals('Date format with colon', '00:00:00', format("{point.date:%H:%M:%S}", { point: point }));
    
    // Deep access
    assertEquals('Deep access format', '123', format("{point.deep.deeper}", { point: point }));    
    
    // Shallow access
    assertEquals('Shallow access format', '123', format("{value}", { value: 123 }));
    
    // Formatted shallow access
    assertEquals('Shallow access format with decimals', '123.00', format("{value:.2f}", { value: 123 }));
    
    // Six decimals by default
    assertEquals('Keep decimals by default', '12345.567', format("{value:f}", { value: 12345.567 }));
    
    // Complicated string format
    assertEquals(
    	'Complex string format',
    	"Key: January, value: 3.14, date: 2012-01-01.",
    	format("Key: {point.key}, value: {point.value:.2f}, date: {point.date:%Y-%m-%d}.", { point: point })
    );
};


/**
 * Test date formatting
 */
UtilTest.prototype.testDateFormat = function () {
	
	// Issue #953
	assertEquals('Two occurences of a pattern', '2012-01-01, 00:00 - 00:59', 
		dateFormat('%Y-%m-%d, %H:00 - %H:59', Date.UTC(2012, 0, 1, 0, 0, 0)));
}
