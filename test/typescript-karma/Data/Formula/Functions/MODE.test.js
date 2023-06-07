import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions["MODE.SNGL"]', function (assert) {
    const table = new DataTable({
            columns: {
                as: [ -1, 0, 1, 2, 3, 4, '5', '6', null, 8, 9 ],
                bs: [ -9, -8, -7, -6, false, false, -3, -2, -1, 0, 1 ] 
            }
        }),
        formula = Formula.parseFormula('MODE( A2, A1:A11, A1 )');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        -1,
        'MODE test should return expected value.'
    );
});


QUnit.test('Formula.processorFunctions["MODE.MULT"]', function (assert) {
    const table = new DataTable({
            columns: {
                values: [ 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 7 ]
            }
        }),
        formula = Formula.parseFormula('SUM( MODE.MULT( A1:A12 ) )');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        17,
        'MODE.MULT test should return expected values.'
    );
});


QUnit.test('Formula.processorFunctions["MODE.SNGL"]', function (assert) {
    const table = new DataTable({
            columns: {
                as: [ -1, 0, 1, 2, 3, 4, '5', '6', null, 8, 9 ],
                bs: [ -9, -8, -7, -6, false, false, -3, -2, -1, 0, 1 ] 
            }
        }),
        formula = Formula.parseFormula('MODE.SNGL( B1:B11, A1, B2, 1, 1 )');

    assert.strictEqual(
        Formula.processFormula(formula, table),
        1,
        'MODE.SNGL test should return expected value.'
    );
});
