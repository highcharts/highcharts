import DataTable from '/base/code/es-modules/Data/DataTable.js';
import MathModifier from '/base/code/es-modules/Data/Modifiers/MathModifier.js';

QUnit.test('MathModifier back references', function (assert) {
    const table = new DataTable({
        columns: {
            Integers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '=SUM(A1:A10)'],
            Primes: [2, 3, 5, 7, 11, 13, 19, 23, 29, 31, '=AVERAGE(B1:B10)'],
            Test: [0, 0, 0, 0, 0, 0, 0, 0, '=C10', '=A11+B11', '=SUM(A11:B11)']
        }
    });

    table.setModifier(new MathModifier());

    const modified = table.modified;

    assert.strictEqual(
        modified.getCell('Integers', 10), // table indexes begin with 0 (=A1)
        55,
        'First formula should have expected value.'
    );

    assert.strictEqual(
        modified.getCell('Primes', 10),
        14.3,
        'Second formula should have expected value.'
    );

    assert.ok(
        isNaN(modified.getCell('Test', 8)),
        'Third formula should be not a number (NaN).'
    );

    // Pointers to formulas
    assert.strictEqual(
        modified.getCell('Test', 9),
        69.3,
        'Fourth formula should have expected value.'
    );

    // Range to formulas
    assert.strictEqual(
        modified.getCell('Test', 10),
        69.3,
        'Fifth formula should have expected value.'
    );
});

QUnit.test('MathModifier column formula', function (assert) {
    const table = new DataTable({
        columns: {
            Kelvin: [273.15, 283.15, 293.15, 303.15, 313.15]
        }
    });

    table.setModifier(new MathModifier({
        columnFormulas: [{
            column: 'Celsius',
            formula: 'A1 - 273.15'
        }, {
            column: 'Fahrenheit',
            formula: '= A1 * 1.8 - 459.67'
        }]
    }));

    assert.strictEqual(
        table.modified.getCell('Celsius', 1),
        10,
        'Celsius should be calculated.'
    );

    assert.deepEqual(
        table.modified.getColumn('Fahrenheit'),
        [32, 50, 68, 86, 104],
        'Fahrenheit should be calculated without endless decimals.'
    );

});
