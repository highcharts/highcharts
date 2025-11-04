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

    const modified = table.getModified();

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
        }, {
            column: 'Celsius_Opposite',
            formula: 'B1 * -1'
        }]
    }));

    assert.strictEqual(
        table.getModified().getCell('Celsius', 1),
        10,
        'Celsius should be calculated.'
    );

    assert.deepEqual(
        table.getModified().getColumn('Fahrenheit'),
        [32, 50, 68, 86, 104],
        'Fahrenheit should be calculated without endless decimals.'
    );

    assert.strictEqual(
        table.getModified().getCell('Celsius_Opposite', 1),
        -10,
        'Opposite celsius is a negative value.'
    );
});

QUnit.test('MathModifier advanced formulas', function (assert) {
    const table = new DataTable({
        columns: {
            ColumnA: [10, 20, -30, 40, 50],
            ColumnB: [-20, 50, -20, 10, 40],
            ColumnC: [40, -10, -50, 30, -20]
        }
    });

    table.setModifier(new MathModifier({
        columnFormulas: [{
            column: 'ColumnD',
            formula: '-1 * (B1 + -(A1 - -C1 * B1 / -10) ^ 2) - (A1 + B1) / -1'
        }, {
            column: 'ColumnE',
            formula: '(PRODUCT(A1:A2) / -A1 + SUM(C1:C5) * C1) ^ 2 - (AVERAGE(B1:B5) * -MEDIAN(A1:A5))'
        }]
    }));

    assert.deepEqual(
        table.getModified().getColumn('ColumnD'),
        [8110, 4920, 16870, 140, 16950],
        'The advanced basic operators formula is properly calculated.'
    );

    assert.deepEqual(
        table.getModified().getColumn('ColumnE'),
        [176040, 281000, 3842000, 63625, 161201],
        'The advanced aggregate functions formula is properly calculated.'
    );
});
