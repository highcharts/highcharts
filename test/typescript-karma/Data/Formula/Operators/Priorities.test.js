import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Operation priorities', function (assert) {

    assert.strictEqual(
        Formula.processFormula(
            Formula.parseFormula('21 = 1 + 2 + 3 * 36 ^ 0.5')
        ),
        true,
        'Formula `21 = 1 + 2 + 3 * 36 ^ 0.5` should be TRUE.'
    );

});
