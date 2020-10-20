const {test, only} = QUnit;

import DataConverter from '/base/js/Data/DataConverter.js';
const converter = new DataConverter();

test('guessType', function (assert) {
    const testCases = ['', '1', '1.1', 'this.should.be.string', `${(new Date()).toISOString()}`],
        expectations = ['string', 'number', 'number', 'string', 'Date']
    assert.deepEqual(
        testCases.map(value => converter.guessType(value)),
        expectations
    )
    assert.deepEqual(
        testCases.map(function (value) {
            const type = typeof converter.asGuessedType(value);
            return type === 'object' ? 'Date' : type;
        }),
        expectations,
        ''
    )
})

test('asNumber', function (assert) {
    const { asNumber } = converter;
    assert.strictEqual(
        asNumber('-3.1'),
        -3.1,
        'Should handle negative numbers'
    );
    assert.strictEqual(
        asNumber(''),
        0,
        'Should handle empty strings'
    );
})