import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.AVERAGE', function (assert) {
    const table = new DataTable({
            columns: { values: [1, 2, 3, 4, 5, 6, false, true, null, '7'] }
        }),
        formula = Formula.parseFormula('AVERAGE(A1:A9,A10)');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        3.5,
        'AVERAGE test should return expected value.'
    );
});
