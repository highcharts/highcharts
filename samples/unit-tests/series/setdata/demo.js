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
        'Array with X given, indentical X - all points should be updated ' +
        'from existing'
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
        'Object with X, shift left - some points should be updated from ' +
        'existing'
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
        'Array with X, shift right - some points should be updated from ' +
        'existing'
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
        'Array with X, extend ends - some points should be updated from ' +
        'existing'
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
        'Array with X, multi shift left - some points should be updated from ' +
        'existing'
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
        'Array with X, duplicated X, requireSorting is true - all points ' +
        'should be updated from existing (#8995)'
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
        'Array with X, duplicated X, requireSorting is false - some points ' +
        'should be updated from existing (#8995)'
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
        chart.series[0].getColumn('y'),
        [4, 5, 5],
        'Data is set correctly when oldData has null values and the same ' +
        'length (#10187)'
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
    const correctSet = chart.series[0].getColumn('x', true).slice();

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
        chart.series[0].getColumn('x', true),
        correctSet,
        'Setting data on a updated series with cropped dataset should keep ' +
        'correct x-values (#12696).'
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
    'Hidden series after setData should call \'updatedData\' just once. #6012',
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

        assert.deepEqual(iterator, 1, 'Just one \'updatedData\' call');
    }
);

QUnit.test(
    '#8795: Hovering after zooming in and using setData with redraw ' +
    'set to false threw', assert => {
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

QUnit.test(
    `The setData method with the allowMutatingData property set to false
    should not mutate the data, #4259.`,
    assert => {
        const oriData = [
                [0, 0],
                [1, 1],
                {
                    x: 2,
                    y: 2
                },
                [3, 3],
                [4, 4]
            ],
            referenceArray = [
                [0, 0],
                [1, 1],
                {
                    x: 2,
                    y: 2
                },
                [3, 3],
                [4, 4]
            ],
            newData = [0, 2, 4, 6, 8],
            chart = Highcharts.chart('container', {
                chart: {
                    allowMutatingData: false
                },
                series: [{
                    data: oriData
                }]
            });

        assert.deepEqual(
            oriData,
            referenceArray,
            'Original data array should not be modified after initial render.'
        );

        chart.series[0].setData(newData);
        assert.deepEqual(
            oriData,
            referenceArray,
            'The setData should not mutate the original data array.'
        );

        chart.series[0].points[0].remove();
        assert.deepEqual(
            oriData,
            referenceArray,
            'Removing point should not mutate the original data array.'
        );

        chart.series[0].points[0].update({
            x: -1,
            y: -1
        });
        assert.deepEqual(
            oriData,
            referenceArray,
            'Updating point should not mutate the original data array.'
        );

        chart.series[0].addPoint({
            x: 10,
            y: 10
        });
        assert.deepEqual(
            oriData,
            referenceArray,
            'Adding point should not mutate the original data array.'
        );

        chart.series[0].update({
            data: [5, 4, 3, 2, 1]
        });
        assert.deepEqual(
            oriData,
            referenceArray,
            'Updating series should not mutate the original data array.'
        );

        chart.update({
            series: [{
                data: [8, 9, 8, 9, 8, 9, 8]
            }]
        });
        assert.deepEqual(
            oriData,
            referenceArray,
            'Updating chart should not mutate the original data array.'
        );

        chart.series[0].remove();
        assert.deepEqual(
            oriData,
            referenceArray,
            'Removing series should not mutate the original data array.'
        );
    }
);

QUnit.test(
    `Updating the allowMutatingData property to false and setting data
    should not mutate the original data, #4259.`,
    assert => {
        const oriData = [
                [0, 0],
                [1, 1],
                {
                    x: 2,
                    y: 2
                },
                [3, 3],
                [4, 4]
            ],
            referenceArray = [
                [0, 0],
                [1, 1],
                {
                    x: 2,
                    y: 2
                },
                [3, 3],
                [4, 4]
            ],
            newData = [0, 2, 4, 6, 8],
            chart = Highcharts.chart('container', {
                series: [{
                    data: oriData
                }]
            });

        assert.deepEqual(
            oriData,
            referenceArray,
            'Original data array should not be modified after initial render.'
        );

        chart.update({
            chart: {
                allowMutatingData: false
            }
        });
        chart.series[0].setData(newData);
        assert.deepEqual(
            oriData,
            referenceArray,
            `After updating the allowMutatingData property to false,
            setData should not mutate the original data.`
        );
    }
);

QUnit.test('setData renders axis labels correctly (#17393)', function (assert) {
    var data1 = [
            [1483315200000, 0.9557],
            [1483401600000, 0.963],
            [1483488000000, 0.9582],
            [1483574400000, 0.9524],
            [1483660800000, 0.9445],
            [1483920000000, 0.951],
            [1484006400000, 0.9464],
            [1484092800000, 0.9522],
            [1484179200000, 0.9365],
            [1484265600000, 0.9381],
            [1484524800000, 0.944],
            [1484611200000, 0.9361],
            [1484697600000, 0.9378],
            [1484784000000, 0.9375],
            [1484870400000, 0.9407],
            [1485129600000, 0.9334],
            [1485216000000, 0.9305],
            [1485302400000, 0.9309],
            [1485388800000, 0.9347],
            [1485475200000, 0.9363],
            [1485734400000, 0.9408],
            [1485820800000, 0.9299],
            [1485907200000, 0.9269],
            [1485993600000, 0.9253],
            [1486080000000, 0.9311],
            [1486339200000, 0.9336],
            [1486425600000, 0.9369],
            [1486512000000, 0.9377],
            [1486598400000, 0.9354],
            [1486684800000, 0.9409],
            [1486944000000, 0.9409],
            [1487030400000, 0.9415],
            [1487116800000, 0.9475],
            [1487203200000, 0.9389],
            [1487289600000, 0.9391],
            [1487548800000, 0.9421],
            [1487635200000, 0.9491],
            [1487721600000, 0.9513],
            [1487808000000, 0.9459],
            [1487894400000, 0.9427],
            [1488153600000, 0.9447],
            [1488240000000, 0.9438],
            [1488326400000, 0.9495],
            [1488412800000, 0.9512],
            [1488499200000, 0.9466],
            [1488758400000, 0.9442],
            [1488844800000, 0.9456],
            [1488931200000, 0.9474],
            [1489017600000, 0.9479],
            [1489104000000, 0.943],
            [1489363200000, 0.9379],
            [1489449600000, 0.9407],
            [1489536000000, 0.9415],
            [1489622400000, 0.9324],
            [1489708800000, 0.9315],
            [1489968000000, 0.9302],
            [1490054400000, 0.9259],
            [1490140800000, 0.9254],
            [1490227200000, 0.9272],
            [1490313600000, 0.9256],
            [1490572800000, 0.9185],
            [1490659200000, 0.921],
            [1490745600000, 0.9305],
            [1490832000000, 0.9315],
            [1490918400000, 0.9355],
            [1491177600000, 0.9381],
            [1491264000000, 0.939],
            [1491350400000, 0.9366],
            [1491436800000, 0.9377],
            [1491523200000, 0.9408],
            [1491782400000, 0.9455],
            [1491868800000, 0.9421],
            [1491955200000, 0.9431],
            [1492041600000, 0.9408],
            [1492473600000, 0.9363],
            [1492560000000, 0.9325],
            [1492646400000, 0.9308],
            [1492732800000, 0.9349],
            [1492992000000, 0.9219],
            [1493078400000, 0.9183],
            [1493164800000, 0.9181],
            [1493251200000, 0.9191],
            [1493337600000, 0.915],
            [1493683200000, 0.9163],
            [1493769600000, 0.9159],
            [1493856000000, 0.9153],
            [1493942400000, 0.9124],
            [1494201600000, 0.9143],
            [1494288000000, 0.9185],
            [1494374400000, 0.919],
            [1494460800000, 0.9209],
            [1494547200000, 0.9196],
            [1494806400000, 0.9115],
            [1494892800000, 0.9043],
            [1494979200000, 0.8996],
            [1495065600000, 0.8987],
            [1495152000000, 0.8946],
            [1495411200000, 0.8895],
            [1495497600000, 0.8918],
            [1495584000000, 0.8935],
            [1495670400000, 0.8918],
            [1495756800000, 0.8933],
            [1496016000000, 0.8939],
            [1496102400000, 0.8951],
            [1496188800000, 0.8913],
            [1496275200000, 0.8914]
        ],
        data2 = data1.map(function (point) {
            return [point[0], point[1] + 0.01];
        }),
        chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: data1
            }]
        }),
        series = chart.series[0],
        xAxis = series.xAxis;

    // Update data with only y values changed (same x values)
    series.setData(data2);

    // Check that ticks and labels are the same length
    assert.strictEqual(
        xAxis.tickPositions.length,
        xAxis.labelGroup.element.childNodes.length,
        'xAxis should have 6 ticks and labels after setData (#17393).'
    );
});

QUnit.test('Point.update with only y value changed', function (assert) {
    var data1 = [
            [1483315200000, 0.9557],
            [1483401600000, 0.963],
            [1483488000000, 0.9582],
            [1483574400000, 0.9524],
            [1483660800000, 0.9445],
            [1483920000000, 0.951],
            [1484006400000, 0.9464],
            [1484092800000, 0.9522],
            [1484179200000, 0.9365],
            [1484265600000, 0.9381],
            [1484524800000, 0.944],
            [1484611200000, 0.9361],
            [1484697600000, 0.9378],
            [1484784000000, 0.9375],
            [1484870400000, 0.9407],
            [1485129600000, 0.9334],
            [1485216000000, 0.9305],
            [1485302400000, 0.9309],
            [1485388800000, 0.9347],
            [1485475200000, 0.9363],
            [1485734400000, 0.9408],
            [1485820800000, 0.9299],
            [1485907200000, 0.9269],
            [1485993600000, 0.9253],
            [1486080000000, 0.9311],
            [1486339200000, 0.9336],
            [1486425600000, 0.9369],
            [1486512000000, 0.9377],
            [1486598400000, 0.9354],
            [1486684800000, 0.9409],
            [1486944000000, 0.9409],
            [1487030400000, 0.9415],
            [1487116800000, 0.9475],
            [1487203200000, 0.9389],
            [1487289600000, 0.9391],
            [1487548800000, 0.9421],
            [1487635200000, 0.9491],
            [1487721600000, 0.9513],
            [1487808000000, 0.9459],
            [1487894400000, 0.9427],
            [1488153600000, 0.9447],
            [1488240000000, 0.9438],
            [1488326400000, 0.9495],
            [1488412800000, 0.9512],
            [1488499200000, 0.9466],
            [1488758400000, 0.9442],
            [1488844800000, 0.9456],
            [1488931200000, 0.9474],
            [1489017600000, 0.9479],
            [1489104000000, 0.943],
            [1489363200000, 0.9379],
            [1489449600000, 0.9407],
            [1489536000000, 0.9415],
            [1489622400000, 0.9324],
            [1489708800000, 0.9315],
            [1489968000000, 0.9302],
            [1490054400000, 0.9259],
            [1490140800000, 0.9254],
            [1490227200000, 0.9272],
            [1490313600000, 0.9256],
            [1490572800000, 0.9185],
            [1490659200000, 0.921],
            [1490745600000, 0.9305],
            [1490832000000, 0.9315],
            [1490918400000, 0.9355],
            [1491177600000, 0.9381],
            [1491264000000, 0.939],
            [1491350400000, 0.9366],
            [1491436800000, 0.9377],
            [1491523200000, 0.9408],
            [1491782400000, 0.9455],
            [1491868800000, 0.9421],
            [1491955200000, 0.9431],
            [1492041600000, 0.9408],
            [1492473600000, 0.9363],
            [1492560000000, 0.9325],
            [1492646400000, 0.9308],
            [1492732800000, 0.9349],
            [1492992000000, 0.9219],
            [1493078400000, 0.9183],
            [1493164800000, 0.9181],
            [1493251200000, 0.9191],
            [1493337600000, 0.915],
            [1493683200000, 0.9163],
            [1493769600000, 0.9159],
            [1493856000000, 0.9153],
            [1493942400000, 0.9124],
            [1494201600000, 0.9143],
            [1494288000000, 0.9185],
            [1494374400000, 0.919],
            [1494460800000, 0.9209],
            [1494547200000, 0.9196],
            [1494806400000, 0.9115],
            [1494892800000, 0.9043],
            [1494979200000, 0.8996],
            [1495065600000, 0.8987],
            [1495152000000, 0.8946],
            [1495411200000, 0.8895],
            [1495497600000, 0.8918],
            [1495584000000, 0.8935],
            [1495670400000, 0.8918],
            [1495756800000, 0.8933],
            [1496016000000, 0.8939],
            [1496102400000, 0.8951],
            [1496188800000, 0.8913],
            [1496275200000, 0.8914]
        ],
        chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: data1
            }]
        }),
        series = chart.series[0],
        xAxis = series.xAxis,
        // initialTickCount = xAxis.tickPositions.length,
        // initialLabelCount = xAxis.labelGroup.element.childNodes.length,
        point = series.points[0],
        newY = data1[0][1];

    // Update point with only y value changed
    point.update({ y: newY });

    // Check that tick count remains the same
    assert.strictEqual(
        xAxis.tickPositions.length,
        xAxis.labelGroup.element.childNodes.length,
        'xAxis tick count should remain the same after point.update (#17393).'
    );
});
