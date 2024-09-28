import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.MEDIAN', function (assert) {
    const table = new DataTable({
            columns: { values: [1, 2, 3, 4, 5, 6, false, true, null, '7'] }
        }),
        formula1 = Formula.parseFormula('MEDIAN(A1:A10)'),
        formula2 = Formula.parseFormula('MEDIAN(A1,A1:A10)');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        3.5,
        'MEDIAN test should return expected value.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        3,
        'MEDIAN test should return expected value.'
    );
});
