const {test, only} = QUnit;

import DataConverter from '/base/js/Data/DataConverter.js';
const converter = new DataConverter();

test('guessType', function (assert) {
    const { guessType, asGuessedType } = converter;
    const testCases = [1, '1.1', 'this.should.be.string', `${(new Date()).toISOString()}`],
    expectations = ['number', 'number', 'string', 'Date']
    assert.deepEqual(
        testCases.map(value => guessType(value)),
        expectations
    )
    assert.deepEqual(
        testCases.map(function(value) {
            const type = typeof asGuessedType(value);
            return type === 'object' ? 'Date' : type;
        }),
        expectations,
        ''
    )
}
)