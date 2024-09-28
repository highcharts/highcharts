import Formula from '/base/code/es-modules/Data/Formula/Formula.js';

QUnit.test('Formula.parseFormula', function (assert) {

    assert.deepEqual(
        Formula.parseFormula('SUM(1,2,3)+10'),
        [
          {
            "args": [
              1,
              2,
              3
            ],
            "name": "SUM",
            "type": "function"
          },
          "+",
          10
        ],
        'Parsing should result in the expected structure.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('SUM(1,2,3)+10')),
        16,
        'Processing should result in a value of 16.'
    );

    assert.strictEqual(
        Formula.processFormula(Formula.parseFormula('-10')),
        -10,
        'Processing should result in a value of -10.'
    );
});
