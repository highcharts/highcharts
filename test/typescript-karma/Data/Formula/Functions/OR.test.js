import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.OR', function (assert) {
    const table = new DataTable({
            columns: {
                values: [0, 1, '2', false, true, null, void 0]
            }
        }),
        formula1 = Formula.parseFormula('OR(A1, A4, A6:A10)'),
        formula2 = Formula.parseFormula('OR(A4:A7)');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        false,
        'OR test should result in FALSE.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        true,
        'OR test should result in TRUE.'
    );
});
