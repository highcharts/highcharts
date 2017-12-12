QUnit.test('utils.range', function (assert) {
    var sunburstPrototype = Highcharts.seriesTypes.sunburst.prototype,
        range = sunburstPrototype.utils.range;
    assert.deepEqual(
        range(),
        [],
        'should return an empty array when no parameters.'
    );
    assert.deepEqual(
        range(null, 1),
        [],
        'should return an empty array when from is not a number.'
    );
    assert.deepEqual(
        range(0, null),
        [],
        'should return an empty array when to is not a number.'
    );
    assert.deepEqual(
        range(1, 0),
        [],
        'should return an empty array when from is larger then to.'
    );
    assert.deepEqual(
        range(0, 0),
        [0],
        'should return an array with one element when from is equal to to.'
    );
    assert.deepEqual(
        range(1, 10),
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'should give an array with numbers from 1 to 10.'
    );
});