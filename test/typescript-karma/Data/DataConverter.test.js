const {test, only} = QUnit;

import DataConverter from '/base/js/Data/DataConverter.js';
import DataTable from '/base/js/Data/DataTable.js';

const sampleTable = DataTable.fromJSON({
    $class: 'DataTable',
    rows: [{
        $class: 'DataTableRow',
        id: 'a',
        column1: 'value1',
        column2: 0.0002,
        column3: false
    }, {
        $class: 'DataTableRow',
        id: 'b',
        column1: 'value1',
        column2: 'value2',
        column3: {
            $class: 'DataTable',
            rows: [{
                $class: 'DataTableRow',
                id: 'ba',
                column1: 'value1'
            }, {
                $class: 'DataTableRow',
                id: 'bb',
                column1: 'value1'
            }, {
                $class: 'DataTableRow',
                id: 'bc',
                column1: 'value1'
            }]
        }
    }, {
        $class: 'DataTableRow',
        id: 'c',
        column1: 'value1',
        column2: 'value2',
        column3: 'value3'
    }]
});

let converter = new DataConverter(),
    timestamp;

test('guessType', function (assert) {
    const testCases = [
        '',
        '1',
        '1.1',
        'this.should.be.string',
        `${(new Date()).toISOString()}`,
        new Date('1980-01-01').getTime(),
        100,
        '2020-01-01'
    ], expectations = [
        'string',
        'number',
        'number',
        'string',
        'Date',
        'Date',
        'number',
        'Date'
    ];

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

    assert.deepEqual(
        testCases.map(value => converter.asBoolean(value)),
        [false, true, true, true, false, true, false, false, false, true],
        'Should convert all values properly.'
    );
});

test('asNumber', function (assert) {
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
    converter = new DataConverter({}, function (value) {
        return new Date('2009-01-01').getTime();
    });

    assert.strictEqual(
        converter.asDate('2020-01-01').getTime(),
        new Date('2009-01-01').getTime(),
        'Should use parseDate function defined by a user.'
    );

    converter = new DataConverter({ dateFormat: 'mm/dd/YYYY' });
    timestamp = converter.asDate('1/9/2020').getTime();
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
