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

QUnit.test('sortRelationsByOverlap', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        sortRelationsByOverlap = vennPrototype.utils.sortRelationsByOverlap,
        data;

    data = [
        { sets: ['A'], value: 2 },
        { sets: ['B'], value: 2 },
        { sets: ['C'], value: 2 },
        { sets: ['A', 'B'], value: 1 },
        { sets: ['A', 'C'], value: 2 },
        { sets: ['B', 'C'], value: 3 }
    ];
    assert.deepEqual(
        sortRelationsByOverlap(data),
        [{
            sets: ['C'],
            value: 2
        }, {
            sets: ['B'],
            value: 2
        }, {
            sets: ['A'],
            value: 2
        }],
        'should sort sets from the most overlapping to the least.'
    );
});