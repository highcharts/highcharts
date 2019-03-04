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
            B: 1,
            C: 2
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
            A: 1,
            C: 3
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
            A: 2,
            B: 3
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

QUnit.test('getAreaOfIntersectionBetweenCircles', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getAreaOfIntersectionBetweenCircles =
            vennPrototype.utils.geometryCircles
                .getAreaOfIntersectionBetweenCircles;

    assert.deepEqual(
        getAreaOfIntersectionBetweenCircles([
            { x: 0, y: 0, r: 3 },
            { x: 5, y: 0, r: 3 }
        ]).d,
        [
            ['M', 2.5, 1.6583123951777],
            ['A', 3, 3, 0, 0, 1, 2.5, -1.6583123951777],
            ['A', 3, 3, 0, 0, 1, 2.5, 1.6583123951777]
        ],
        'should return a path representing the area of overlap between the two circles.'
    );

    assert.deepEqual(
        getAreaOfIntersectionBetweenCircles([
            { x: 5.75, y: 0, r: 2.763953195770684 },
            { x: 3.24, y: 0, r: 1.9544100476116797 }
        ]).d,
        [
            ['M', 3.73409987366425, 1.89092145501881],
            ['A', 2.763953195770684, 2.763953195770684, 0, 0, 1, 3.73409987366425, -1.89092145501881],
            ['A', 1.9544100476116797, 1.9544100476116797, 0, 0, 1, 3.73409987366425, 1.89092145501881]
        ],
        'should return a path representing the area of overlap between the two circles.'
    );
});

QUnit.test('getCenterOfPoints', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getCenterOfPoints =
            vennPrototype.utils.geometry.getCenterOfPoints;

    assert.deepEqual(
        getCenterOfPoints([
            { x: -2, y: 1 },
            { x: -2, y: 3 },
            { x: 0, y: 3 },
            { x: 0, y: 1 }
        ]),
        { x: -1, y: 2 },
        'should return center (-1, 2) when points are [(-2, 1), (-2, 3), (0, 3), (0, 1).'
    );
});

QUnit.test('getOverlapBetweenCircles', assert => {
    var { prototype: vennPrototype } = Highcharts.seriesTypes.venn,
        { getOverlapBetweenCircles } = vennPrototype.utils.geometryCircles;

    assert.strictEqual(
        getOverlapBetweenCircles(3, 4, 5),
        6.64167470270706,
        'should return 6.64167470270706 when r1=3, r2=4 and d=5.'
    );

    assert.strictEqual(
        getOverlapBetweenCircles(8, 6, 1),
        113.09733552923257,
        'should return 113.09733552923257 when r1=8, r2=6 and d=1. The circles completely overlaps.'
    );

    assert.strictEqual(
        getOverlapBetweenCircles(2.5231325220201604, 3.0901936161855166, 0.7011044346618891),
        19.68884261304518,
        'should return 19.68884261304518 when r1=2.5231325220201604, r2=3.0901936161855166 and d=0.7011044346618891.'
    );

    assert.strictEqual(
        getOverlapBetweenCircles(2, 3, 6),
        0,
        'should return 0 when r1=2, r2=3 and d=6. The circles does not overlap.'
    );

    assert.strictEqual(
        getOverlapBetweenCircles(1.9544100476116797, 1.9544100476116797, 0),
        12,
        'should return the area of one of the circles when they have equal position and radius.'
    );
});

QUnit.test('getDistanceBetweenCirclesByOverlap', assert => {
    var { prototype: vennPrototype } = Highcharts.seriesTypes.venn,
        { getDistanceBetweenCirclesByOverlap } = vennPrototype.utils;

    assert.strictEqual(
        getDistanceBetweenCirclesByOverlap(3, 4, 6.64),
        5.0003489085283945,
        'should return a distance of 5.0003489085283945 when r1=3, r2=4 and overlap=6.64.'
    );
    assert.strictEqual(
        getDistanceBetweenCirclesByOverlap(1.1283791670955126, 0.5641895835477563, 1),
        0,
        'should return a distance of 0 when r1=1.1283791670955126, r2=0.5641895835477563 and overlap=1. The circles completely overlap.'
    );
    assert.strictEqual(
        getDistanceBetweenCirclesByOverlap(25.2313252202016, 25.2313252202016, 1000),
        20.385535837223518,
        'should return a distance of 20.385535837223518 when r1=r2=25.2313252202016 and overlap=1000.'
    );
    assert.strictEqual(
        getDistanceBetweenCirclesByOverlap(600, 300, 250000),
        387.2988213671704,
        'should return a distance of 387.2988213671704 when r1=600, r2=300 and overlap=250000.'
    );
});

QUnit.test('getDistanceBetweenPoints', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getDistanceBetweenPoints = vennPrototype.utils.geometry
            .getDistanceBetweenPoints;

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

QUnit.test('getCircleCircleIntersection', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getCircleCircleIntersection =
            vennPrototype.utils.geometryCircles.getCircleCircleIntersection;
    var a = { x: 0, y: 0, r: 3 };
    var b = { x: 1, y: 0, r: 1 };
    var c = { x: 5, y: 0, r: 3 };

    assert.deepEqual(
        getCircleCircleIntersection(b, c),
        [],
        'should return empty array if no overlap.'
    );

    assert.deepEqual(
        getCircleCircleIntersection(a, b),
        [],
        'should return empty array if circles completely overlap.'
    );

    assert.deepEqual(
        getCircleCircleIntersection(a, c),
        [{ x: 2.5, y: 1.6583123951777 }, { x: 2.5, y: -1.6583123951777 }],
        'should return (2.5, 1.6583123951777) and (2.5, -1.6583123951777) when c1(0, 0, 3) and c2(5, 0, 3).'
    );
});

QUnit.test('getCirclesIntersectionPoints', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        getCirclesIntersectionPoints =
            vennPrototype.utils.geometryCircles.getCirclesIntersectionPoints,
        circles = [
            { x: 0, y: 0, r: 3 },
            { x: 5, y: 0, r: 3 },
            { x: -3, y: 3, r: 3 }
        ];

    assert.deepEqual(
        getCirclesIntersectionPoints(circles),
        [
            { x: 2.5, y: 1.6583123951777, indexes: [0, 1] },
            { x: 2.5, y: -1.6583123951777, indexes: [0, 1] },
            { x: -3, y: 0, indexes: [0, 2] },
            { x: 0, y: 3, indexes: [0, 2] }
        ],
        'should return a list of all the intersection points between the circles.'
    );
});

QUnit.test('getCircularSegmentArea', assert => {
    var { prototype: vennPrototype } = Highcharts.seriesTypes.venn,
        { getCircularSegmentArea } = vennPrototype.utils.geometryCircles;

    assert.strictEqual(
        getCircularSegmentArea(1, 1),
        Math.PI / 2,
        'should return PI/2 when r=1 and h=1 and circle area is equal to PI.'
    );

    assert.strictEqual(
        getCircularSegmentArea(1, 2),
        Math.PI,
        'should return PI when r=1 and h=2 and circle area is equal to PI.'
    );
});

QUnit.test('isPointInsideCircle', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        isPointInsideCircle =
            vennPrototype.utils.geometryCircles.isPointInsideCircle;

    assert.strictEqual(
        isPointInsideCircle({ x: 1, y: 1 }, { x: 0, y: 0, r: 3 }),
        true,
        'should return true for P(1, 1) and C(0, 0, 3).'
    );

    assert.strictEqual(
        isPointInsideCircle({ x: 4, y: 1 }, { x: 0, y: 0, r: 3 }),
        false,
        'should return true for P(4, 1) and C(0, 0, 3).'
    );
});

QUnit.test('isPointInsideAllCircles', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        isPointInsideAllCircles =
            vennPrototype.utils.geometryCircles.isPointInsideAllCircles,
        circles = [{ x: 0, y: 0, r: 3 }, { x: 4, y: 0, r: 3 }];

    assert.strictEqual(
        isPointInsideAllCircles({ x: 2, y: 0 }, circles),
        true,
        'should return true for P(2, 0) and [(0, 0, 3), (4, 0, 3)].'
    );

    assert.strictEqual(
        isPointInsideAllCircles({ x: -1, y: 0 }, circles),
        false,
        'should return true for P(-1, 0) and [(0, 0, 3), (4, 0, 3)].'
    );
});

/**
 * Since there is no "correct" positions for a specific input value, this test
 * wont tell if a change in return values is correct or not, but it will alert
 * of any unexpected changes.
 */
QUnit.test('layoutGreedyVenn', assert => {
    const { prototype: vennPrototype } = Highcharts.seriesTypes.venn;
    const { layoutGreedyVenn } = vennPrototype.utils;

    // Data from #9844
    const relations1 = [{
        id: "A",
        sets: ["A"],
        value: 8.707145671877052
    }, {
        id: "C",
        sets: ["C"],
        value: 3.269735977932484
    }, {
        id: "B",
        sets: ["B"],
        value: 3.0135951661631424
    }, {
        id: "A_C",
        sets: ["A", "C"],
        value: 2.798830947064232
    }, {
        id: "A_B",
        sets: ["A", "B"],
        value: 2.078352817548929
    }, {
        id: "B_C",
        sets: ["B", "C"],
        value: 0.7966636017338763
    }, {
        id: "A_B_C",
        sets: ["A", "B", "C"],
        value: 0.6833705503743597
    }];
    assert.deepEqual(
        layoutGreedyVenn(relations1),
        {
            A: { r: 1.66480345620763, x: 0, y: 0 },
            B: { r: 0.9794167317058717, x: 0.50013676238039, y: 1.16865602691445 },
            C: { r: 1.0201908091071663, x: 0.9751416859635283, y: 0 }
        },
        'should return expected positions and sizes for the sets in relations1.'
    );

    // Data from #10006
    const relations2 = [{
        sets: ['A'],
        value: 1000
    }, {
        sets: ['B'],
        value: 600
    }, {
        sets: ['C'],
        value: 50
    }, {
        sets: ['A', 'B'],
        value: 100
    }, {
        sets: ['A', 'C'],
        value: 5
    }, {
        sets: ['B', 'C'],
        value: 10
    }];
    assert.deepEqual(
        layoutGreedyVenn(relations2),
        {
            A: { r: 17.841241161527712, x: 24.351995419742487, y: 0 },
            B: { r: 13.81976597885342, x: 0, y: 0 },
            C: { r: 3.989422804014327, x: 8.56494669770081, y: 13.08868212641161 }
        },
        'should return expected positions and sizes for the sets in relations2.'
    );
});

QUnit.test('loss', function (assert) {
    var vennPrototype = Highcharts.seriesTypes.venn.prototype,
        loss = vennPrototype.utils.loss,
        map = {
            A: { x: 0, y: 0, r: 3 },
            B: { x: 6, y: 0, r: 3 },
            C: { x: 5.074, y: 0, r: 3 }
        };

    assert.strictEqual(
        loss(
            map,
            [{
                sets: ['A', 'B'],
                value: 2
            }]
        ),
        4,
        'should return a loss of 4, since overlap between A and B equals 0.'
    );

    assert.strictEqual(
        loss(
            map,
            [{
                sets: ['A', 'C'],
                value: 2
            }]
        ),
        0.00009108128,
        'should return a loss of 0, since overlap between A and C equals 2.'
    );

    assert.strictEqual(
        loss(
            map,
            [{
                sets: ['B', 'C'],
                value: 24
            }]
        ),
        1.58641695078,
        'should return a loss of 1.5876, since overlap between B and C equals 22.74.'
    );

    assert.strictEqual(
        loss(
            map,
            [{
                sets: ['A', 'B'],
                value: 2
            }, {
                sets: ['A', 'C'],
                value: 2
            }, {
                sets: ['B', 'C'],
                value: 24
            }]
        ),
        5.586508032059999,
        'should return a total loss of 5.5876 between A∩B, A∩C, B∩C.'
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