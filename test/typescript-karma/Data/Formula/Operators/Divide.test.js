import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Divide decimal digits', function (assert) {

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('6 / 7')),
        0.857142857,
        'Formula `6 / 7` should result in a decimal with 9 digits.'
    );

});
