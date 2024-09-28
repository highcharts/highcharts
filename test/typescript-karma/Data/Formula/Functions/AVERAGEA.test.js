import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.AVERAGEA', function (assert) {
    const table = new DataTable({
            columns: { values: [1, 3, 4, 5, 6, 7, false, true, null, '7'] }
        }),
        formula = Formula.parseFormula('AVERAGEA(A1:A9,A10)');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        3,
        'AVERAGEA test should return expected value.'
    );
});
