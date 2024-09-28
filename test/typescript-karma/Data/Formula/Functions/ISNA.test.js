import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.ISNA', function (assert) {
    const formula1 = Formula.parseFormula('ISNA(1)'),
        formula2 = Formula.parseFormula('ISNA(2 / 0)'),
        formula3 = Formula.parseFormula('ISNA(TRUE)');

    assert.strictEqual(
        Formula.processFormula(formula1),
        false,
        'ISNA should return FALSE. (1)'
    );

    assert.strictEqual(
        Formula.processFormula(formula2),
        false,
        'ISNA should return FALSE. (2)'
    );

    assert.strictEqual(
        Formula.processFormula(formula3),
        true,
        'ISNA should return TRUE.'
    );
});
