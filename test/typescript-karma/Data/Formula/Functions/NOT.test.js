import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.test('Formula.processorFunctions.NOT', function (assert) {
    const table = new DataTable({
            columns: {
                values: [-1, 0, 1, false, true, null, undefined, '', '0']
            }
        }),
        formula1 = Formula.parseFormula('NOT(A1)'),
        formula2 = Formula.parseFormula('NOT(A2)'),
        formula3 = Formula.parseFormula('NOT(A3)'),
        formula4 = Formula.parseFormula('NOT(A4)'),
        formula5 = Formula.parseFormula('NOT(A5)'),
        formula6 = Formula.parseFormula('NOT(A6)'),
        formula7 = Formula.parseFormula('NOT(A7)'),
        formula8 = Formula.parseFormula('NOT(A8)'),
        formula9 = Formula.parseFormula('NOT(A9)');

    assert.strictEqual(
        Formula.processFormula(formula1, table),
        false,
        'NOT test should return expected value. (1)'
    );

    assert.strictEqual(
        Formula.processFormula(formula2, table),
        true,
        'NOT test should return expected value. (2)'
    );

    assert.strictEqual(
        Formula.processFormula(formula3, table),
        false,
        'NOT test should return expected value. (3)'
    );

    assert.strictEqual(
        Formula.processFormula(formula4, table),
        true,
        'NOT test should return expected value. (4)'
    );

    assert.strictEqual(
        Formula.processFormula(formula5, table),
        false,
        'NOT test should return expected value. (5)'
    );

    assert.strictEqual(
        Formula.processFormula(formula6, table),
        true,
        'NOT test should return expected value. (6)'
    );

    assert.strictEqual(
        Formula.processFormula(formula7, table),
        true,
        'NOT test should return expected value. (7)'
    );

    assert.ok(
        isNaN(Formula.processFormula(formula8, table)),
        'NOT test should fail. (1)'
    );

    assert.ok(
        isNaN(Formula.processFormula(formula9, table)),
        'NOT test should fail. (2)'
    );
});
