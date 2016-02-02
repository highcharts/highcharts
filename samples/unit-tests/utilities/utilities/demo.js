/* eslint func-style:0, object-curly-spacing: 0 */
$(function () {

    var dateFormat = Highcharts.dateFormat,
        extend = Highcharts.extend,
        format = Highcharts.format,
        numberFormat = Highcharts.numberFormat,
        pInt = Highcharts.pInt,
        setOptions = Highcharts.setOptions,
        splat = Highcharts.splat,
        stableSort = Highcharts.stabeSort;

    /**
     * Wrapper because of fast migration from earlier system
     */
    function assertEquals(assert, message, actual, expected) {
        assert.equal(expected, actual, message);
    }
    function assertUndefined(assert, message, actual) {
        assert.strictEqual(undefined, actual, message);
    }

    function countMembers(obj) {
        var count = 0;
        for (var member in obj) {
            if (obj.hasOwnProperty(member)) {
                count++;
            }
        }

        return count;
    }

    QUnit.test('Extend', function (assert) {
        var empty = {};
        var extra = {key1: "k1", key2: "k2"};
        var extra2 = {key3: "k3", key4: "k4"};
        var result;

        // test extend of undefined
        result = extend(undefined, extra);
        assertEquals(assert, "Extended undefined", 2, countMembers(result));

        // test extend of null
        result = extend(null, extra);
        assertEquals(assert, "Extended null", 2, countMembers(result));

        // test extend of empty
        result = extend(empty, extra);
        assertEquals(assert, "Extended empty object", 2, countMembers(result));

        // test extend of same object
        result = extend(extra, extra);
        assertEquals(assert, "Extended object with object", 2, countMembers(result));

        // test extend of another object
        result = extend(extra, extra2);
        assertEquals(assert, "Extended object with object2", 4, countMembers(result));
    });

    QUnit.test('PInt', function (assert) {
        // test without a base defined
        assertEquals(assert, "base not defined", 15, pInt("15"));

        // test with base 10
        assertEquals(assert, "base 10", 15, pInt("15", 10));

        // test with base 16
        assertEquals(assert, "base 16", 15, pInt("F", 16));
    });

/*
    QUnit.test('IsString', function (assert) {
        // test with undefined
        assertEquals(assert, "IsString undefined", false, isString(undefined));

        // test with null
        assertEquals(assert, "IsString null", false, isString(null));

        // test with empty object
        assertEquals(assert, "IsString {}", false, isString({}));

        // test with number
        assertEquals(assert, "IsString number", false, isString(15));

        // test with empty string
        assertEquals(assert, "IsString empty", true, isString(""));

        // test with string
        assertEquals(assert, "IsString string", true, isString("this is a string"));
    });
*/
/*
    QUnit.test('IsObject', function (assert) {
        // test with undefined
        assertEquals(assert, "IsObject undefined", false, isObject(undefined));

        // test with null, surprise!!
        assertEquals(assert, "IsObject null", true, isObject(null));

        // test with number
        assertEquals(assert, "IsObject number", false, isObject(15));

        // test with string
        assertEquals(assert, "IsObject string", false, isObject("this is a string"));

        // test with object
        assertEquals(assert, "IsObject object", true, isObject({}));

        // test with array
        assertEquals(assert, "IsObject array", true, isObject([]));
    });
*/
/*
    QUnit.test('IsArray', function (assert) {
        // test with undefined
        assertEquals(assert, "isArray undefined", false, isArray(undefined));

        // test with null
        assertEquals(assert, "isArray null", false, isArray(null));

        // test with number
        assertEquals(assert, "isArray number", false, isArray(15));

        // test with string
        assertEquals(assert, "isArray string", false, isArray("this is a string"));

        // test with object
        assertEquals(assert, "isArray object", false, isArray({}));

        // test with array
        assertEquals(assert, "isArray array", true, isArray([]));

    });
*/
/*
    QUnit.test('IsNumber', function (assert) {
        // test with undefined
        assertEquals(assert, "IsNumber undefined", false, isNumber(undefined));

        // test with null
        assertEquals(assert, "IsNumber null", false, isNumber(null));

        // test with number
        assertEquals(assert, "IsNumber number", true, isNumber(15));

        // test with string
        assertEquals(assert, "IsNumber string", false, isNumber("this is a string"));

        // test with object
        assertEquals(assert, "IsNumber object", false, isNumber({}));
    });
*/
    QUnit.test('Splat', function (assert) {

        // test with undefined
        assertEquals(assert, "splat undefined", 1, splat(undefined).length);

        // test with null
        assertEquals(assert, "splat null", 1, splat(null).length);

        // test with false
        assertEquals(assert, "splat false", 1, splat(false).length);

        // test with 0
        assertEquals(assert, "splat 0", 1, splat(0).length);

        // test with ""
        assertEquals(assert, "splat 0", 1, splat("").length);

        // test with object
        assertEquals(assert, "splat object", 1, splat({}).length);

        // test with array
        assertEquals(assert, "splat array", 3, splat([1,2,3]).length);
    });

/*
    QUnit.test('StableSort', function (assert) {
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
        });

        // Collect the result
        for (var i = 0; i < arr.length; i++) {
            result.push(arr[i].b);
        }

        assertEquals(assert, 'Stable sort in action', 'ABCDEFGHIJK', result.join(''));
        assertUndefined(assert, 'Stable sort index should not be there', arr[0].ss_i);
    });
*/

    /**
     * Tests that destroyObjectProperties calls the destroy method on properties before delete.
     * /
    QUnit.test('DestroyObjectProperties', function (assert) {
        var testObject = {}, // Test object with the properties to destroy
            destroyCount = 0; // Number of destroy calls made

        function DummyWithDestroy() {}

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

        assertEquals(assert, 'Number of destroyed elements', 3, destroyCount);
        assertUndefined(assert, 'Property should be undefined', testObject.rect);
        assertUndefined(assert, 'Property should be undefined', testObject.line);
        assertUndefined(assert, 'Property should be undefined', testObject.label);
        assertUndefined(assert, 'Property should be undefined', testObject.noDestroy);
    });*/

    /**
     * Test number formatting
     */
    QUnit.test('NumberFormat', function (assert) {

        assertEquals(assert, 'Integer with decimals', "1.00", numberFormat(1, 2));
        assertEquals(assert, 'Integer with decimal point', "1,0", numberFormat(1, 1, ','));
        assertEquals(assert, 'Integer with thousands sep', "1 000", numberFormat(1000, null, null, ' '));

        // auto decimals
        assertEquals(assert, 'Auto decimals', "1.234", numberFormat(1.234, -1));
        assertEquals(assert, 'Auto decimals on string', "0", numberFormat("String", -1));
        assertEquals(assert, 'Auto decimals on integer', "10", numberFormat(10, -1));
        assertEquals(assert, 'Auto decimals on undefined', "0", numberFormat(undefined, -1));
        assertEquals(assert, 'Auto decimals on null', "0", numberFormat(null, -1));

        // issues
        assertEquals(assert, 'Rounding', "29.12", numberFormat(29.115, 2));
        assertEquals(assert, 'Rounding', "29.1150", numberFormat(29.115, 4));
        assertEquals(assert, 'Rounding negative (#4573)', "-342 000.00", numberFormat(-342000, 2));
        assertEquals(assert, 'String decimal count', "2 016", numberFormat(2016, '0'));
        assertEquals(assert, 'Rounding', "2.0", numberFormat(1.96, 1));
    });


    QUnit.test('Format', function (assert) {

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

        assertEquals(assert, 'Basic replacement', Math.PI, format("{point.value}", { point: point }));

        assertEquals(assert, 'Replacement with two decimals', '3.14', format("{point.value:.2f}", { point: point }));


        // localized thousands separator and decimal point
        setOptions({
            lang: {
                decimalPoint: ',',
                thousandsSep: ' '
            }
        });
        assertEquals(assert, 'Localized format', "12 345,68", format("{point.long:,.2f}", { point: point }));


        // default thousands separator and decimal point
        setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        assertEquals(assert, 'Thousands separator format', '12,345.68', format("{point.long:,.2f}", { point: point }));


        // Date format with colon
        assertEquals(assert, 'Date format with colon', '00:00:00', format("{point.date:%H:%M:%S}", { point: point }));

        // Deep access
        assertEquals(assert, 'Deep access format', '123', format("{point.deep.deeper}", { point: point }));

        // Shallow access
        assertEquals(assert, 'Shallow access format', '123', format("{value}", { value: 123 }));

        // Formatted shallow access
        assertEquals(assert, 'Shallow access format with decimals', '123.00', format("{value:.2f}", { value: 123 }));

        // Six decimals by default
        assertEquals(assert, 'Keep decimals by default', '12345.567', format("{value:f}", { value: 12345.567 }));

        // Complicated string format
        assertEquals(assert,
            'Complex string format',
            "Key: January, value: 3.14, date: 2012-01-01.",
            format("Key: {point.key}, value: {point.value:.2f}, date: {point.date:%Y-%m-%d}.", { point: point })
        );
    });


    /**
     * Test date formatting
     */
    QUnit.test('DateFormat', function (assert) {

        // Issue #953
        assertEquals(assert, 'Two occurences of a pattern', '2012-01-01, 00:00 - 00:59',
            dateFormat('%Y-%m-%d, %H:00 - %H:59', Date.UTC(2012, 0, 1, 0, 0, 0)));

        assertEquals(assert, 'Hours in 24 hours format', '5:55', dateFormat('%k:%M',
            Date.UTC(2015, 0, 1, 5, 55, 0)));
    });


});