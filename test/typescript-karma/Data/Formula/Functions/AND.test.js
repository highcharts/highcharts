import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.AND', function (assert) {
    const table = new DataTable({
            columns: {
                values: [0, 1, '2', false, true, null, void 0]
            }
        }),
        formula1 = Formula.parseFormula('AND(A1:A10)'),
        formula2 = Formula.parseFormula('AND(A2:A3, A5)');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        false,
        'AND test should result in FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        true,
        'AND test should result in TRUE.'
    );
});
