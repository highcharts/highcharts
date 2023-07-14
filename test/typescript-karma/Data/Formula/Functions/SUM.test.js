import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.SUM', function (assert) {
    const table = new DataTable({
            columns: {
                values: [0, 1, 2, 3, 4, '6', false, true, null, void 0]
            }
        }),
        formula1 = Formula.parseFormula('SUM(A1:A5, A6:A11)');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        10,
        'SUM test should return expected value.'
    );
});
