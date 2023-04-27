import DataConverter from '/base/code/es-modules/Data/Converters/DataConverter.js';
import DataTable from '/base/code/es-modules/Data/DataTable.js';

const {test, only} = QUnit;

test('guessType', function (assert) {
    const testCases = [
        '',
        '1',
        '1.1',
        'this.should.be.string',
        100
    ], expectations = [
        'string',
        'number',
        'number',
        'string',
        'number'
    ];

    let converter = new DataConverter();

    assert.deepEqual(
        testCases.map(value => converter.guessType(value)),
        expectations
    );

    assert.deepEqual(
        testCases.map(function (value) {
            const type = typeof converter.asGuessedType(value);
            return type === 'object' ? 'Date' : type;
        }),
        expectations,
        ''
    );

    converter = new DataConverter({ decimalPoint: ',' });
    assert.strictEqual(
        converter.guessType('-5,9'),
        'number',
        'Should guess number when decimal point is set by a user.'
    );
});

test('asBoolean', function (assert) {
    const sampleTable = new DataTable({
        columns: {
            id: ['a', 'b', 'c'],
            column1: ['value1', 'value1', 'value1'],
            column2: [0.0002, 'value2', 'value2'],
            column3: [false, new DataTable({
                id: ['ba', 'bb', 'bc'],
                column1: ['value1', 'value1', 'value1']
            }), 'value3']
        }
    });

    const testCases = [
        '',
        'string',
        new Date('1980-01-01'),
        100,
        0,
        true,
        null,
        undefined,
        new DataTable(),
        sampleTable
    ];

    let converter = new DataConverter();

    assert.deepEqual(
        testCases.map(value => converter.asBoolean(value)),
        [false, true, true, true, false, true, false, false, false, true],
        'Should convert all values properly.'
    );
});

test('asNumber', function (assert) {
    let converter = new DataConverter();

    assert.strictEqual(
        converter.asNumber('-3.1'),
        -3.1,
        'Should handle negative numbers'
    );

    assert.ok(
        isNaN(converter.asNumber('')),
        'Should handle empty strings'
    );

    converter = new DataConverter({ decimalPoint: ',' });
    assert.strictEqual(
        converter.asNumber('-5,9'),
        -5.9,
        'Should handle decimal point set by a user.'
    );
});

test('asDate', function (assert) {
    let converter = new DataConverter({
        parseDate: function (value) {
            return new Date('2009-01-01').getTime();
        }
    });

    assert.strictEqual(
        converter.asDate('2020-01-01').getTime(),
        new Date('2009-01-01').getTime(),
        'Should use parseDate function defined by a user.'
    );

    converter = new DataConverter({ dateFormat: 'mm/dd/YYYY' });
    let timestamp = converter.asDate('1/9/2020').getTime();
    assert.strictEqual(
        timestamp,
        new Date('2020-01-09').getTime(),
        'Should use dateFormat defined by a user.'
    );

    converter = new DataConverter();
    timestamp = new Date('2020-01-09').getTime();
    assert.strictEqual(
        converter.asDate(timestamp).getTime(),
        timestamp,
        'Should return a correct date when value is number.'
    );

    assert.strictEqual(
        converter.asDate(new Date('2020-01-09')).getTime(),
        new Date('2020-01-09').getTime(),
        'Should return a correct date when value is date.'
    );

    assert.ok(
        isNaN(converter.asDate('string').getTime()),
        'Should return date for NaN timestamp when value does not fit any format.'
    );

    converter.deduceDateFormat(['10/08/2020', '10/12/2020', '10/22/2020'], null, true);
    timestamp = converter.asDate('10/14/2020').getTime();
    assert.strictEqual(
        timestamp,
        new Date('2020-10-14').getTime(),
        'Should deduce correct dateFormat - mm/dd/YYYY.'
    );

    converter.deduceDateFormat(['9/1/19', '9/22/19', '9/26/19'], null, true);
    timestamp = converter.asDate('9/10/19').getTime();
    assert.strictEqual(
        timestamp,
        new Date('2019-09-10').getTime(),
        'Should deduce correct dateFormat - mm/dd/YY.'
    );
});
