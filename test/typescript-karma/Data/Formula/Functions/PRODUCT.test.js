import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.PRODUCT', function (assert) {
    const table = new DataTable({
            columns: {
                values: [0, 1, 2, 3, 4, '6', false, true, null, void 0]
            }
        }),
        formula1 = Formula.parseFormula('PRODUCT(A1:A10)'),
        formula2 = Formula.parseFormula('PRODUCT(A1:A5)');

    assert.ok(
        isNaN(Formula.processFormula(formula1, table)),
        'PRODUCT test should return not a number.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        0,
        'PRODUCT test should return expected value.'
    );
});
