import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.IF', function (assert) {
    const table = new DataTable({ columns: { values: [1, 2, 3, 4, 5, 6] }}),
        formula1 = Formula.parseFormula('AVERAGE( IF( 1 < 2, A1:A3, A4:A6) )'),
        formula2 = Formula.parseFormula('AVERAGE( IF( 3 <= 2, A1:A3, A4:A6) )');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        2,
        'IF test should succeed and AVERAGE should calculate first range.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        5,
        'IF test should fail and AVERAGE should calculate second range.'
    );
});
