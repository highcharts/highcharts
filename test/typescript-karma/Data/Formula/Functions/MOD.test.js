import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.MOD', function (assert) {
    const table = new DataTable({
            columns: {
                as: [ 3.1, 0],
                bs: [ 0, 2] 
            }
        }),
        formula1 = Formula.parseFormula('MOD( A1, B1 )'),
        formula2 = Formula.parseFormula('MOD( A1, B2 )');

    assert.ok(
        isNaN(Formula.processFormula(formula1, table)),
        'MOD test should return not a number.'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        1.1,
        'MOD test should return expected value.'
    );
});
