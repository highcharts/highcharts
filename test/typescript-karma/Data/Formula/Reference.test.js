import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';

QUnit.test('Formula.getReferenceValues', function (assert) {
    const table = new DataTable({ columns: { values: [0, 1, 2, 3, 4, 5] }}),
        formula1 = Formula.parseFormula('SUM(A1)'),
        result1 = Formula.processFormula(formula1, table);

    assert.strictEqual(
        result1,
        0,
        'Reference should return 0 (zero).'
    );
});
