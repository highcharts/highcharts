import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';

QUnit.test('Formula.getRangeValues', function (assert) {
    const table = new DataTable({ columns: { values: [1, 2, 3, 4, 5, 6] }}),
        formula1 = Formula.parseFormula('SUM(A1:A6)'),
        formula2 = Formula.parseFormula('SUM(SUM(A1:A3), SUM(A4:A6))'),
        result1 = Formula.processFormula(formula1, table),
        result2 = Formula.processFormula(formula2, table);

    assert.strictEqual(
        result1,
        21,
        'Range should result in a sum of 21.'
    );

    assert.strictEqual(
        result2,
        result1,
        'Subdivisions of ranges should result in the same sum.'
    );
});
