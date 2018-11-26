QUnit.test('addOverlapToRelations', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        addOverlapToSets = vennPrototype.utils.addOverlapToSets,
        data,
        set;

    var isSetWithId = function (id) {
        return function (x) {
            return x.sets.length === 1 && x.sets[0] === id;
        };
    };

    data = [
        { sets: ['A'], value: 2 },
        { sets: ['B'], value: 2 },
        { sets: ['C'], value: 2 },
        { sets: ['A', 'B'], value: 1 },
        { sets: ['A', 'C'], value: 2 },
        { sets: ['B', 'C'], value: 3 }
    ];

    addOverlapToSets(data);

    set = data.find(isSetWithId('A'));
    assert.strictEqual(
        set.totalOverlap,
        3,
        'should set the property totalOverlap on set A to 3.'
    );
    assert.deepEqual(
        set.overlapping,
        {
            'B': 1,
            'C': 2
        },
        'should set the property overlapping on set A to include a map from id of overlapping set to the amount of overlap.'
    );

    set = data.find(isSetWithId('B'));
    assert.strictEqual(
        set.totalOverlap,
        4,
        'should set the property totalOverlap on set B to 4.'
    );
    assert.deepEqual(
        set.overlapping,
        {
            'A': 1,
            'C': 3
        },
        'should set the property overlapping on set B to include a map from id of overlapping set to the amount of overlap.'
    );

    set = data.find(isSetWithId('C'));
    assert.strictEqual(
        set.totalOverlap,
        5,
        'should set the property totalOverlap on set C to 5.'
    );
    assert.deepEqual(
        set.overlapping,
        {
            'A': 2,
            'B': 3
        },
        'should set the property overlapping on set C to include a map from id of overlapping set to the amount of overlap.'
    );

    assert.strictEqual(
        data.some(function (x) {
            return (
                x.sets.length !== 1 &&
                typeof x.totalOverlap !== 'undefined' &&
                typeof x.overlapping !== 'undefined'
            );
        }),
        false,
        'should not set the properties totalOverlap or overlapping on a relation that is not a set.'
    );
});

QUnit.test('binarySearch', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        binarySearch = vennPrototype.utils.binarySearch,
        arr = [1, 3, 5, 8, 10, 12, 16],
        noError = function (x) {
            return x;
        },
        allowError = function (x, value) {
            // Allow an error of 1
            return (Math.abs(value - x) <= 1) ? value : x;
        };

    assert.strictEqual(
        binarySearch(arr, 12, noError),
        5,
        'should return index 5 when looking for 12.'
    );

    assert.strictEqual(
        binarySearch(arr, 4, noError),
        -1,
        'should return index -1 since 4 does not exist in the array.'
    );

    assert.strictEqual(
        binarySearch(arr, 7, allowError),
        3,
        'should return index 3 when looking for 7, since fn allows an error of 1 which accepts 8.'
    );
});

QUnit.test('getOverlapBetweenCircles', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getOverlapBetweenCircles =
            vennPrototype.utils.getOverlapBetweenCirclesByDistance;

    assert.strictEqual(
        getOverlapBetweenCircles(3, 4, 5),
        6.64,
        'should return 6.64 when r1=3, r2=4 and d=5.'
    );

    assert.strictEqual(
        getOverlapBetweenCircles(8, 6, 1),
        113.09,
        'should return 113.09 when r1=8, r2=6 and d=1. The circles completely overlaps.'
    );

    assert.strictEqual(
        getOverlapBetweenCircles(2, 3, 6),
        0,
        'should return 0 when r1=2, r2=3 and d=6. The circles does not overlap.'
    );
});

QUnit.test('getDistanceBetweenPoints', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getDistanceBetweenPoints = vennPrototype.utils.getDistanceBetweenPoints;

    assert.strictEqual(
        getDistanceBetweenPoints({ x: 0, y: 0 }, { x: 2, y: 0 }),
        2,
        'should return 2 when points have the coordinates (0,0) and (2, 0).'
    );

    assert.strictEqual(
        getDistanceBetweenPoints({ x: -1, y: 1 }, { x: 3, y: 4 }),
        5,
        'should return 2 when points have the coordinates (-1,1) and (3, 4).'
    );
});

QUnit.test('processVennData', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        processVennData = vennPrototype.utils.processVennData,
        data;

    // data is undefined.
    assert.deepEqual(
        processVennData(data),
        [],
        'should return empty array when data is not an array.'
    );

    // values in data should be objects.
    data = [2];
    assert.deepEqual(
        processVennData(data),
        [],
        'should ignore values in data that are not of type object.'
    );

    // filter out sets that has a value < 1.
    data =  [{
        sets: ['A'],
        value: undefined
    }, {
        sets: ['B'],
        value: '3'
    }, {
        sets: ['C'],
        value: 2
    }];
    assert.deepEqual(
        processVennData(data),
        [{
            sets: ['C'],
            value: 2
        }],
        'should filter out sets that has a value < 1.'
    );

    // filter out relations that includes sets that has a value < 1.
    data =  [{
        sets: ['A'],
        value: 0
    }, {
        sets: ['B'],
        value: 2
    }, {
        sets: ['A', 'B'],
        value: 2
    }];
    assert.deepEqual(
        processVennData(data),
        [{
            sets: ['B'],
            value: 2
        }],
        'should filter out relations that includes sets that has a value < 1.'
    );

    // should filter out duplicate relations.
    data = [{
        sets: ['A'],
        value: 1
    }, {
        sets: ['A'],
        value: 2
    }, {
        sets: ['B'],
        value: 2
    }, {
        sets: ['A', 'B'],
        value: 1
    }, {
        sets: ['B', 'A'],
        value: 2
    }];
    assert.deepEqual(
        processVennData(data),
        [{
            sets: ['A'],
            value: 2
        }, {
            sets: ['B'],
            value: 2
        }, {
            sets: ['A', 'B'],
            value: 2
        }],
        'should remove duplicate sets and just update existing values for the set.'
    );

    // add missing relations between sets as value = 0.
    data = [{
        sets: ['A'],
        value: 1
    }, {
        sets: ['B'],
        value: 1
    }, {
        sets: ['C'],
        value: 1
    }];
    assert.deepEqual(
        processVennData(data),
        [{
            sets: ['A'],
            value: 1
        }, {
            sets: ['B'],
            value: 1
        }, {
            sets: ['C'],
            value: 1
        }, {
            sets: ['A', 'B'],
            value: 0
        }, {
            sets: ['A', 'C'],
            value: 0
        }, {
            sets: ['B', 'C'],
            value: 0
        }],
        'should add missing relations between sets as value = 0.'
    );

    // remove relations with duplicate sets
    data = [{
        sets: ['A'],
        value: 1
    }, {
        sets: ['A', 'A'],
        value: 1
    }];
    assert.deepEqual(
        processVennData(data),
        [{
            sets: ['A'],
            value: 1
        }],
        'should remove relations that has duplicate values in sets.'
    );

    // remove relations with invalid values in sets
    data = [{
        sets: [2],
        value: 1
    }];
    assert.deepEqual(
        processVennData(data),
        [],
        'should remove relations that has invalid values in sets.'
    );
});

QUnit.test('sortByTotalOverlap', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        sortByTotalOverlap = vennPrototype.utils.sortByTotalOverlap;

    assert.deepEqual(
        sortByTotalOverlap({ totalOverlap: 1 }, { totalOverlap: 2 }),
        1,
        'should return >0 when b is greater than a.'
    );

    assert.deepEqual(
        sortByTotalOverlap({ totalOverlap: 2 }, { totalOverlap: 1 }),
        -1,
        'should return <0 when a is greater than b.'
    );

    assert.deepEqual(
        sortByTotalOverlap({ totalOverlap: 2 }, { totalOverlap: 2 }),
        0,
        'should return 0 when a is equal to b.'
    );
});