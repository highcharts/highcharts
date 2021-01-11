QUnit.test('Series.setData with updatePoints', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 3, 2, 4]
                }
            ]
        }),
        s = chart.series[0];

    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([2, 4, 3, 5]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true, true],
        'No X given - all points should be updated from existing'
    );

    // With X
    s.setData(
        [
            // reset
            [0, 1],
            [1, 1],
            [2, 2],
            [3, 3]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true, true],
        'Array with X given, indentical X - all points should be updated from existing'
    );

    // With X, shift left
    s.setData(
        [
            // reset
            [0, 1],
            [1, 1],
            [2, 2],
            [3, 3]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true, undefined],
        'Array with X, shift left - some points should be updated from existing'
    );

    // Object with X, shift left
    s.setData(
        [
            // reset
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 }
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 4 },
        { x: 4, y: 5 }
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true, undefined],
        'Object with X, shift left - some points should be updated from existing'
    );

    // With X, shift right
    s.setData(
        [
            // reset
            [0, 1],
            [1, 1],
            [2, 2],
            [3, 3]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [-1, 1],
        [0, 3],
        [1, 2],
        [2, 3]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [undefined, true, true, true],
        'Array with X, shift right - some points should be updated from existing'
    );

    // With X, extend both ends
    s.setData(
        [
            // reset
            [1, 1],
            [2, 2],
            [3, 3]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [0, 3],
        [1, 2],
        [2, 3],
        [3, 5],
        [4, 1]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [undefined, true, true, true, undefined],
        'Array with X, extend ends - some points should be updated from existing'
    );

    // With X, shift left with multiples
    s.setData(
        [
            // reset
            [0, 1],
            [1, 1],
            [2, 2],
            [3, 3]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [3, 4],
        [4, 5],
        [5, 2],
        [6, 1]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [true, undefined, undefined, undefined],
        'Array with X, multi shift left - some points should be updated from existing'
    );

    // With X, all new X
    s.setData(
        [
            // reset
            [0, 1],
            [1, 1],
            [2, 2],
            [3, 3]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [4, 5],
        [5, 2],
        [6, 1],
        [7, 2]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [undefined, undefined, undefined, undefined],
        'Array with X, all new X - all points should be new'
    );

    // With X, duplicated X, requireSorting is true
    s.setData(
        [
            // reset
            [0, 1],
            [1, 2],
            [1, 3],
            [1, 4]
        ],
        true,
        false,
        false
    );
    s.points.forEach(function (p) {
        p.wasThere = true;
    });
    s.setData([
        [0, 5],
        [1, 4],
        [1, 2],
        [1, 1]
    ]);
    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true, true],
        'Array with X, duplicated X, requireSorting is true - all points should be updated from existing (#8995)'
    );

    // With X, duplicated X, requireSorting is false
    var scatterS = chart.addSeries({ type: 'scatter' });
    scatterS.setData(
        [
            // reset
            [0, 1],
            [1, 2],
            [1, 3],
            [1, 4]
        ],
        true,
        false,
        false
    );
    scatterS.points.forEach(function (p) {
        p.wasThere = true;
    });
    scatterS.setData([
        [0, 5],
        [1, 4],
        [1, 2],
        [1, 1]
    ]);
    assert.deepEqual(
        scatterS.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, undefined, undefined],
        'Array with X, duplicated X, requireSorting is false - some points should be updated from existing (#8995)'
    );

    // Identify by id
    scatterS.setData(
        [
            {
                x: 0,
                y: 0,
                id: 'first'
            },
            {
                x: 1,
                y: 1,
                id: 'second'
            },
            {
                x: 2,
                y: 2,
                id: 'third'
            }
        ],
        true,
        false,
        false
    ); // reset
    scatterS.points.forEach(function (p) {
        p.wasThere = true;
    });
    scatterS.setData([
        {
            x: 1,
            y: 1,
            id: 'first'
        },
        {
            x: 2,
            y: 2,
            id: 'second'
        },
        {
            x: 3,
            y: 3,
            id: 'third'
        }
    ]);
    assert.deepEqual(
        scatterS.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true],
        'All points with id should be mapped'
    );

    // Id's and X values are set, X values change (#9861)
    scatterS.setData([
        {
            x: 0.9,
            y: 1,
            id: 'first'
        },
        {
            x: 2.1,
            y: 2,
            id: 'second'
        },
        {
            x: 3.1,
            y: 3,
            id: 'third'
        }
    ]);
    assert.deepEqual(
        scatterS.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true],
        'All points with id should be mapped, no errors'
    );

    // Pie series, no X
    var pieS = chart.addSeries({ type: 'pie' });
    pieS.setData(
        [
            // reset
            1,
            2,
            3
        ],
        true,
        false,
        false
    );
    pieS.points.forEach(function (p) {
        p.wasThere = true;
    });
    pieS.setData([2, 3, 4]);
    assert.deepEqual(
        pieS.points.map(function (p) {
            return p.wasThere;
        }),
        [true, true, true],
        'Pie with equal length, reuse all points'
    );

    // #8060
    // No redraw, keep previous markers on a chart:
    s.setData([
        [0, 0],
        [1, 1]
    ]);
    s.setData(
        [
            [0, 0],
            [1, 1],
            [2, 2]
        ],
        false,
        false,
        true
    );

    assert.deepEqual(
        s.points.map(function (p) {
            return Highcharts.defined(p.graphic);
        }),
        [true, true],
        'Old points have markers when redraw is set to false (#8060)'
    );

    chart = Highcharts.chart('container', {
        series: [
            {
                data: [4, 5, 5]
            }
        ]
    });

    chart.series[0].setData([null, null, 1]);
    chart.series[0].setData([4, 5, 5]);

    assert.deepEqual(
        chart.series[0].yData,
        [4, 5, 5],
        'Data is set correctly when oldData has null values and the same length (#10187)'
    );

    // #12333
    // Some points with ID's, others without
    chart.series[0].setData([
        {
            y: 10,
            id: 'main1'
        },
        {
            y: 20,
            id: 'main2'
        },
        {
            y: 10
        }
    ]);

    chart.series[0].setData([
        {
            y: 20,
            id: 'main1'
        },
        {
            y: 20
        }
    ]);

    assert.strictEqual(
        chart.series[0].points.length,
        2,
        'Two points should be rendered (#12333).'
    );

    // Auto incremented X should match current max X after update
    chart.series[0].setData([
        {
            id: 'one',
            y: 10
        },
        {
            id: 'two',
            y: 10
        },
        {
            y: 20
        }
    ]);

    chart.series[0].setData([
        {
            id: 'one',
            y: 20
        }
    ]);
    chart.series[0].addPoint({
        y: 100
    });

    assert.strictEqual(
        chart.series[0].points[1].x,
        1,
        'Auto incremented X should not overlap first point.'
    );

    chart.update({
        xAxis: {
            min: 3
        },
        series: {
            cropThreshold: 1,
            data: [
                [0, 2],
                [2, 1],
                [4, 2],
                [6, 1],
                [8, 2],
                [10, 1]
            ]
        }
    });
    const correctSet = chart.series[0].processedXData.slice();

    chart.series[0].update(
        {
            name: 'New test name'
        },
        false
    );
    chart.series[0].setData(
        [
            [0, 2],
            [2, 1],
            [4, 2],
            [6, 1],
            [8, 2],
            [10, 1]
        ],
        false
    );
    chart.redraw();

    assert.deepEqual(
        chart.series[0].processedXData,
        correctSet,
        'Setting data on a updated series with cropped dataset should keep correct x-values (#12696).'
    );
});

QUnit.test('Boosted series with updatePoints', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                boostThreshold: 1,
                type: 'scatter',
                data: [
                    [0, 0],
                    [1, 1],
                    [2, 2]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points
            .map(function (p) {
                return p.x;
            })
            .toString(),
        '0,1,2',
        'Initial data'
    );

    chart.series[0].setData([
        [3, 3],
        [4, 4],
        [5, 5]
    ]);

    assert.strictEqual(
        chart.series[0].points
            .map(function (p) {
                return p.x;
            })
            .toString(),
        '3,4,5',
        'Updated data'
    );
});

QUnit.test(
    "Hidden series after setData should call 'updatedData' callback just once. #6012",
    function (assert) {
        var iterator = 0,
            chart = Highcharts.chart(
                'container',
                {
                    series: [
                        {
                            data: [5, 10, 15],
                            visible: false
                        },
                        {
                            data: [5, 10, 15]
                        },
                        {
                            data: [15, 10, 5]
                        }
                    ]
                },
                function (chart) {
                    Highcharts.addEvent(
                        chart.series[0],
                        'updatedData',
                        function () {
                            iterator++;
                        }
                    );
                }
            );

        chart.series[0].setData([3, 4, 5]);
        chart.series[1].hide();
        chart.series[1].show();

        assert.deepEqual(iterator, 1, "Just one 'updatedData' call");
    }
);

QUnit.test('#8795: Hovering after zooming in and using setData with redraw set to false threw', assert => {
    const data = () => {
        const ret = [];
        for (let i = 0; i < 500; i++) {
            ret[i] = Math.random();
        }
        return ret;
    };

    const chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        series: [{
            data: data()
        }]
    });

    const controller = new TestController(chart);
    controller.pan([200, 150], [250, 150]);
    chart.series[0].setData(data(), false);
    controller.moveTo(150, 150);

    assert.ok(true, 'It should not throw');
});