import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.ABS', function (assert) {
    const table = new DataTable({
            columns: {
                values: [0, -1, '2', false, true, null, void 0]
            }
        }),
        formula1 = Formula.parseFormula('ABS(A1:A10)'),
        formula2 = Formula.parseFormula('AVERAGE(ABS(A1:A2))'),
        formula3 = Formula.parseFormula('ABS(-6/7)');

    assert.ok(
        isNaN(Formula.processFormula(formula1, table)),
        'ABS test should not support non-numbers.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        0.5,
        'ABS test should result in positive numbers.'
    );

    assert.strictEqual(
        Formula.processFormula(formula3, table),
        0.857142857,
        'ABS test should result in positive decimal number.'
    );
});
