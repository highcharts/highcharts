import DataPromise from '/base/js/Data/DataPromise.js';

QUnit.test('DataPromise API', function (assert) {

    const done = assert.async();

    let validateValue = NaN;

    assert.expect(3);

    DataPromise.noBuiltinPromise(true);
    DataPromise
        .resolve(-1)
        .then((v) => {
            validateValue = -1;
            assert.strictEqual(
                validateValue,
                -1,
                'Firt value should be a negative number.'
            );
        })
        .then(() => new DataPromise((resolve, reject) => {
            window.setTimeout(
                () => {
                    validateValue = 0;
                    resolve(validateValue);
                },
                1
            );
            window.setTimeout(
                () => reject(),
                2
            );
        }))
        .then((value) => {
            assert.strictEqual(
                value,
                validateValue,
                'Value should be zero.'
            );
        })
        .then(() => done());

    assert.ok(
        isNaN(validateValue),
        'Initial value schould not be a number.'
    );

});
