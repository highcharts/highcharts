import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.MIN', function (assert) {
    const table = new DataTable({
            columns: {
                values: ['-7', -6, -3, 0, 3, 6, false, true, null, '7']
            }
        }),
        formula = Formula.parseFormula('MIN( A1:A10 )');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        -6,
        'MIN test should return expected value.'
    );
});
