import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.COUNT', function (assert) {
    const table = new DataTable({
            columns: { values: [1, 2, 3, 4, 5, 6, false, true, null, '7'] }
        }),
        formula = Formula.parseFormula('COUNT( A1:A5, A6:A10 )');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        6,
        'COUNT test should return expected value.'
    );
});
