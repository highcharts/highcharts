QUnit.test('utils.calculateLevelSizes', function (assert) {
    var sunburstPrototype = Highcharts.Series.types.sunburst.prototype,
        calculateLevelSizes = sunburstPrototype.utils.calculateLevelSizes,
        mapOptionsToLevel = {
            0: {
                levelSize: {
                    value: 1,
                    unit: 'weight'
                }
            }
        };
    assert.deepEqual(
        calculateLevelSizes(),
        undefined,
        'should return undefined if mapOptionsToLevel is undefined.'
    );
    assert.deepEqual(
        calculateLevelSizes(mapOptionsToLevel),
        {
            0: {
                levelSize: {
                    value: 0,
                    unit: 'pixels'
                }
            }
        },
        'should have params.diffRadius default to 0.'
    );

    assert.deepEqual(
        calculateLevelSizes(mapOptionsToLevel, {
            diffRadius: 1000
        }),
        {
            0: {
                levelSize: {
                    value: 1000,
                    unit: 'pixels'
                }
            }
        },
        'should have params.from and params.to default to 0.'
    );

    mapOptionsToLevel[1] = {
        levelSize: {
            value: 2,
            unit: 'weight'
        }
    };
    assert.deepEqual(
        calculateLevelSizes(mapOptionsToLevel, {
            diffRadius: 1000,
            from: 0,
            to: 0
        }),
        {
            0: {
                levelSize: {
                    value: 1000,
                    unit: 'pixels'
                }
            },
            1: {
                levelSize: {
                    value: 0,
                    unit: 'pixels'
                }
            }
        },
        'should set all levels not in interval [params.from, params.to] to ' +
        'have 0 pixels.'
    );

    mapOptionsToLevel[2] = {
        levelSize: {
            value: 400,
            unit: 'pixels'
        }
    };
    assert.deepEqual(
        calculateLevelSizes(mapOptionsToLevel, {
            diffRadius: 1000,
            from: 0,
            to: 2
        }),
        {
            0: {
                levelSize: {
                    value: 200,
                    unit: 'pixels'
                }
            },
            1: {
                levelSize: {
                    value: 400,
                    unit: 'pixels'
                }
            },
            2: {
                levelSize: {
                    value: 400,
                    unit: 'pixels'
                }
            }
        },
        'should share remaining radius, after pixels and percentage, between ' +
        'all weighted levels.'
    );
});

QUnit.test('utils.getLevelFromAndTo', function (assert) {
    const {
        getLevelFromAndTo
    } = Highcharts.Series.types.sunburst.prototype.utils;
    assert.deepEqual(
        getLevelFromAndTo({ level: 0, height: 3 }),
        { from: 1, to: 3 },
        'should display levels from 1 to 3 when node is on level 0 and has ' +
        'the height of 3. Should never display level 0'
    );
    assert.deepEqual(
        getLevelFromAndTo({ level: 1, height: 2 }),
        { from: 1, to: 3 },
        'should display levels from 1 to 3 when node is on level 1 and has ' +
        'the height of 2'
    );
    assert.deepEqual(
        getLevelFromAndTo({ level: 4, height: 10 }),
        { from: 4, to: 14 },
        'should display levels from 4 to 14 when node is on level 4 and has ' +
        'the height of 10'
    );
});

QUnit.test('utils.range', function (assert) {
    var sunburstPrototype = Highcharts.Series.types.sunburst.prototype,
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
