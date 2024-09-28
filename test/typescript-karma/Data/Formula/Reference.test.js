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

QUnit.test('Formula.translateReferences', function (assert) {
    const formula = [{
        args: [{
            column: 4,
            columnRelative: true,
            row: 0,
            rowRelative: true,
            type: 'reference'
        }],
        name: 'LEN',
        type: 'function'
    }];
    const result1 = Formula.translateReferences(formula, 0, 1);

    assert.strictEqual(
        result1[0].args[0].row,
        1,
        'Translation of reference arguments should succeed.'
    );
});
