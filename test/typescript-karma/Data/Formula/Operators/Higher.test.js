import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.basicOperation(`>`)', function (assert) {

    // boolean

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('FALSE > FALSE')),
        false,
        'Formula `FALSE > FALSE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('FALSE > TRUE')),
        false,
        'Formula `FALSE > TRUE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('TRUE > FALSE')),
        true,
        'Formula `TRUE > FALSE` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('TRUE > TRUE')),
        false,
        'Formula `TRUE > TRUE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('FALSE > 0')),
        true,
        'Formula `FALSE > 0` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('FALSE > "0"')),
        true,
        'Formula `FALSE > "0"` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('TRUE > 1')),
        true,
        'Formula `TRUE > 1` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('TRUE > "1"')),
        true,
        'Formula `TRUE > "1"` test should return TRUE.'
    );

    // number

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('0 > 0')),
        false,
        'Formula `0 > 0` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('0 > 1')),
        false,
        'Formula `0 > 1` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('1 > 0')),
        true,
        'Formula `1 > 0` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('1 > 1')),
        false,
        'Formula `1 > 1` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('0 > FALSE')),
        false,
        'Formula `0 > FALSE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('0 > "0"')),
        false,
        'Formula `0 > "0"` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('1 > TRUE')),
        false,
        'Formula `1 > TRUE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('1 > "1"')),
        false,
        'Formula `1 > "1"` test should return FALSE.'
    );

    // string

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"FALSE" > FALSE')),
        false,
        'Formula `"FALSE" > FALSE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"0" > 0')),
        true,
        'Formula `"0" > 0` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"TRUE" > TRUE')),
        false,
        'Formula `"TRUE" > TRUE` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"1" > 1')),
        true,
        'Formula `"1" > 1` test should return TRUE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"0" > "0"')),
        false,
        'Formula `"0" > "0"` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"0" > "1"')),
        false,
        'Formula `"0" > "1"` test should return FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('" " > "0"')),
        false,
        'Formula `" " > "0"` test should return FALSE, because space is lower ' +
        'than any other character.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"A" > "a"')),
        false,
        'Formula `"A" > "a"` test should return FALSE, because comparisons ' +
        'are case insensitive.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('"a" > "B"')),
        false,
        'Formula `"a" > "B"` test should return FALSE, because comparisons ' +
        'are case insensitive.'
    );

});
