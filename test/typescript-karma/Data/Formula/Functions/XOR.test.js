import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.XOR', function (assert) {
    const table = new DataTable({
            columns: {
                values: [0, 1, '2', false, true, null, void 0]
            }
        }),
        formula1 = Formula.parseFormula('XOR(A1, A4, A6:A10)'),
        formula2 = Formula.parseFormula('XOR(A2:A3, A5)'),
        formula3 = Formula.parseFormula('XOR(A1:A10)');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        false,
        'XOR test should result in FALSE. (1)'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        false,
        'XOR test should result in FALSE. (2)'
    );

    assert.strictEqual(
        Formula.processFormula(formula3, table),
        true,
        'XOR test should result in TRUE.'
    );
});
