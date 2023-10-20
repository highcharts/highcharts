QUnit.test(
    'Columnrange series should work with broken-axis. (#4868)',
    function (assert) {
        var iter = 0;

        Highcharts.chart('container', {
            chart: {
                type: 'columnrange'
            },
            yAxis: {
                breaks: [
                    {
                        from: 10,
                        to: 20
                    }
                ],
                events: {
                    pointBreak: function () {
                        iter++;
                    }
                }
            },
            series: [
                {
                    data: [
                        [0, 5, 15],
                        [1, 0, 30]
                    ]
                }
            ]
        });

        assert.strictEqual(iter, 1, 'pointBreak called');
    }
);

QUnit.test('Sub-millisecond tooltip (#4247)', function (assert) {
    const chart = Highcharts.chart('container', {
        title: {
            text: 'Y axis translation failed'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            min: 5
        },
        yAxis: {
            breaks: [
                {
                    from: 3,
                    to: 8,
                    breakSize: 1
                }
            ]
        },
        chart: {
            type: 'column',
            zoomType: 'x'
        },
        series: [
            {
                data: [9, 8, 7, 6, 5, 4, 3, 2, 1]
            }
        ]
    });

    assert.equal(chart.yAxis[0].min, 0, 'Min makes sense');
    assert.equal(chart.yAxis[0].max, 3, 'Max stops at break');
});

QUnit.test('Null inside break (#4275)', function (assert) {
    let chart = Highcharts.chart('container', {
        title: {
            text: 'Sample of a simple break'
        },
        subtitle: {
            text: 'Line should be interrupted between 5 and 10'
        },
        plotOptions: {
            series: {
                connectNulls: false
            }
        },
        xAxis: {
            tickInterval: 1,
            breaks: [
                {
                    from: 5,
                    to: 10,
                    breakSize: 1
                }
            ]
        },
        series: [
            {
                marker: {
                    enabled: true
                },
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 20; i++) {
                        if (i <= 5 || i >= 10) {
                            arr.push(i);
                        } else {
                            arr.push(null);
                        }
                    }
                    return arr;
                }())
            }
        ]
    });

    assert.notEqual(
        chart.series[0].graph.element.getAttribute('d').indexOf('M', 1),
        -1,
        'Graph has moveTo operator'
    );

    chart = Highcharts.chart('container', {
        title: {
            text: 'Sample of a simple break'
        },
        subtitle: {
            text: 'Line should be interrupted between 5 and 10'
        },
        plotOptions: {
            series: {
                connectNulls: true
            }
        },
        xAxis: {
            tickInterval: 1,
            breaks: [
                {
                    from: 5,
                    to: 10,
                    breakSize: 1
                }
            ]
        },
        series: [
            {
                marker: {
                    enabled: true
                },
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 20; i++) {
                        if (i <= 5 || i >= 10) {
                            arr.push(i);
                        } else {
                            arr.push(null);
                        }
                    }
                    return arr;
                }())
            }
        ]
    });

    assert.equal(
        chart.series[0].graph.element.getAttribute('d').indexOf('M', 1),
        -1,
        'Graph does not have moveTo operator'
    );
});

QUnit.test(
    'pointBreak callback wasn\'t called for xAxis and different ' +
        'series than column.(#4533)',
    function (assert) {
        var iteratorPB = 0,
            iteratorAB = 0,
            iteratorPOB = 0;

        const chart = Highcharts.chart('container', {
            chart: {
                width: 500,
                height: 400,
                zoomType: 'y',
                type: 'column'
            },
            yAxis: {
                breaks: [
                    {
                        from: 5,
                        to: 15,
                        breakSize: 1
                    }
                ],
                events: {
                    pointBreak() {
                        iteratorPB++;
                    },
                    afterBreaks() {
                        iteratorAB++;
                    },
                    pointOutsideOfBreak() {
                        iteratorPOB++;
                    }
                }
            },
            xAxis: {
                breaks: [
                    {
                        from: 5,
                        to: 15,
                        breakSize: 1
                    }
                ],
                events: {
                    pointBreak() {
                        iteratorPB++;
                    },
                    afterBreaks() {
                        iteratorAB++;
                    }
                }
            },
            series: [
                {
                    data: (function () {
                        var data = [],
                            i;
                        for (i = 0; i < 20; i = i + 1) {
                            data.push(i);
                        }
                        return data;
                    }())
                }
            ]
        });

        assert.strictEqual(iteratorAB, 7, 'All after breaks called.');
        assert.strictEqual(iteratorPB, 8, 'All point breaks called.');

        assert.strictEqual(
            iteratorPOB,
            0,
            'No point breaks out should be called initially.'
        );

        chart.yAxis[0].setExtremes(0, 5);
        assert.strictEqual(
            iteratorPOB,
            chart.series[0].points.length,
            'The pointOutsideOfBreak event should be called for all points.'
        );
    }
);

QUnit.test('PointBreak with different thresholds(#4356)', function (assert) {
    var breaks = [
        {
            from: -40000,
            to: -20000
        },
        {
            from: 20000,
            to: 40000
        }
    ];

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text:
                'Point break for positives and negatives, ' +
                'respecting treshold'
        },
        yAxis: {
            tickInterval: 5000,
            breaks: breaks,
            events: {
                pointBreak: function (e) {
                    var point = e.point,
                        brk = e.brk,
                        shapeArgs = point.shapeArgs,
                        x = shapeArgs.x,
                        y = this.toPixels(brk.from, true),
                        w = shapeArgs.width,
                        key = ['brk', brk.from, brk.to],
                        path = [
                            'M',
                            x,
                            y,
                            'L',
                            x + w * 0.25,
                            y + 4,
                            'L',
                            x + w * 0.75,
                            y - 4,
                            'L',
                            x + w,
                            y
                        ];

                    if (!point[key]) {
                        point[key] = this.chart.renderer
                            .path(path)
                            .attr({
                                'stroke-width': 3,
                                stroke: 'red'
                            })
                            .add(point.graphic.parentGroup);
                    } else {
                        point[key].attr({
                            d: path
                        });
                    }
                }
            }
        },
        series: [
            {
                name: 'Threshold 0',
                // threshold: 0, // default
                data: [10000, 50000, -10000, -70000]
            },
            {
                name: 'Threshold 100k',
                threshold: 100000,
                data: [10000, 50000, -10000, -70000]
            },
            {
                name: 'Threshold -100k',
                threshold: -100000,
                data: [10000, 50000, -10000, -70000]
            },
            {
                name: 'Threshold null',
                threshold: null,
                data: [10000, 50000, -10000, -70000]
            }
        ]
    });

    var series = chart.series;
    // Zero breaks:
    assert.strictEqual(
        !(
            series[0].points[0][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            !(
                series[0].points[0][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has zero breaks'
    );
    assert.strictEqual(
        !(
            series[0].points[2][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            !(
                series[0].points[2][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has zero breaks'
    );
    assert.strictEqual(
        !(
            series[1].points[1][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            !(
                series[1].points[1][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has zero breaks'
    );
    assert.strictEqual(
        !(
            series[2].points[3][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            !(
                series[2].points[3][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has zero breaks'
    );
    assert.strictEqual(
        !(
            series[3].points[3][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            !(
                series[3].points[3][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has zero breaks'
    );

    // Exactly one break:
    assert.strictEqual(
        !(
            series[0].points[1][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            series[0].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement,
        true,
        'Has exactly one (top) break'
    );
    assert.strictEqual(
        series[0].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            !(
                series[0].points[3][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        !(
            series[1].points[0][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            series[1].points[0][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement,
        true,
        'Has exactly one (top) break'
    );
    assert.strictEqual(
        !(
            series[1].points[2][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) &&
            series[1].points[2][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement,
        true,
        'Has exactly one (top) break'
    );
    assert.strictEqual(
        series[2].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            !(
                series[2].points[0][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        series[2].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            !(
                series[2].points[2][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        series[3].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            !(
                series[3].points[0][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        series[3].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            !(
                series[3].points[2][
                    ['brk', breaks[1].from, breaks[1].to]
                ] instanceof Highcharts.SVGElement
            ),
        true,
        'Has exactly one (bottom) break'
    );
    // Two or more breaks:
    assert.strictEqual(
        series[1].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            series[1].points[3][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement,
        true,
        'Has two breaks'
    );
    assert.strictEqual(
        series[2].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            series[2].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement,
        true,
        'Has two breaks'
    );
    assert.strictEqual(
        series[3].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof
            Highcharts.SVGElement &&
            series[3].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement,
        true,
        'Has two breaks'
    );
});

QUnit.test(
    'Axis breaks and column metrics in Highcharts Stock.',
    function (assert) {
        var data = [];
        for (
            var x = Date.UTC(2010, 0, 8), y = 1;
            x < Date.UTC(2010, 1, 22);
            x += 24 * 36e5, y++
        ) {
            if (y % 7 !== 2 && y % 7 !== 3) {
                data.push([x, y]);
            }
        }

        var chart = Highcharts.stockChart('container', {
            xAxis: {
                ordinal: false,
                type: 'datetime',
                breaks: [
                    {
                        from: Date.UTC(2010, 6, 30, 0, 0, 0),
                        to: Date.UTC(2010, 6, 31, 21, 59, 59),
                        repeat: 7 * 24 * 36e5
                    }
                ]
            },
            series: [
                {
                    type: 'column',
                    data: data,
                    animation: false
                }
            ]
        });

        assert.ok(
            chart.series[0].points[0].graphic.attr('width') > 7,
            'Width is great enough, #5979.'
        );

        // #16368
        chart.xAxis[0].update({
            breaks: undefined
        });

        chart.series[0].update({
            data: [
                [
                    1630421539000,
                    36.25
                ],
                [
                    1630422102000,
                    35.8
                ],
                [
                    1630424354000,
                    36
                ],
                [
                    1630425480000,
                    35.5
                ],
                [
                    1630426043000,
                    35.45
                ],
                [
                    1630427732000,
                    36.4
                ],
                [
                    1630428295000,
                    36.15
                ],
                [
                    1630429984000,
                    35.95
                ],
                [
                    1630430547000,
                    36.15
                ],
                [
                    1630431110000,
                    36.1
                ],
                [
                    1630433362000,
                    34.05
                ]
            ]
        });

        const initialWidth = chart.series[0].points[0].shapeArgs.width;

        chart.xAxis[0].update({
            breaks: []
        });

        assert.strictEqual(
            initialWidth,
            chart.series[0].points[0].shapeArgs.width,
            'Presence of axis.breaks option should not affect the columns width, #16368.'
        );

        chart.series[0].update({
            type: 'candlestick',
            data: [
                [
                    1630417035000,
                    37.15,
                    37.15,
                    37.15,
                    37.15
                ],
                [
                    1630418161000,
                    37.2,
                    37.2,
                    35.5,
                    35.5
                ],
                [
                    1630418724000,
                    34.6,
                    35.3,
                    34.4,
                    35
                ],
                [
                    1630419287000,
                    35,
                    35,
                    34.95,
                    34.95
                ],
                [
                    1630419850000,
                    35.1,
                    35.1,
                    35.1,
                    35.1
                ],
                [
                    1630420413000,
                    35.3,
                    36.25,
                    35.3,
                    36.25
                ],
                [
                    1630421539000,
                    36.25,
                    36.35,
                    36.25,
                    36.35
                ],
                [
                    1630422102000,
                    35.8,
                    35.8,
                    35.8,
                    35.8
                ],
                [
                    1630424354000,
                    36,
                    36,
                    35.75,
                    35.75
                ],
                [
                    1630425480000,
                    35.5,
                    35.5,
                    35.45,
                    35.45
                ],
                [
                    1630426043000,
                    35.45,
                    35.45,
                    35.45,
                    35.45
                ],
                [
                    1630427732000,
                    36.4,
                    36.4,
                    36.15,
                    36.15
                ],
                [
                    1630428295000,
                    36.15,
                    36.15,
                    35.95,
                    35.95
                ],
                [
                    1630429984000,
                    35.95,
                    36.15,
                    35.95,
                    36.15
                ],
                [
                    1630430547000,
                    36.15,
                    36.15,
                    36.15,
                    36.15
                ],
                [
                    1630431110000,
                    36.1,
                    36.1,
                    34.05,
                    34.4
                ],
                [
                    1630433362000,
                    34.05,
                    34.05,
                    34.05,
                    34.05
                ],
                [
                    1630499233000,
                    35.45,
                    35.55,
                    35.45,
                    35.55
                ],
                [
                    1630502611000,
                    35.55,
                    35.55,
                    34.65,
                    34.65
                ],
                [
                    1630507115000,
                    34.6,
                    35.1,
                    34.6,
                    35.1
                ],
                [
                    1630507678000,
                    35.1,
                    35.9,
                    35.1,
                    35.9
                ],
                [
                    1630508241000,
                    36,
                    37.05,
                    36,
                    37.05
                ],
                [
                    1630509367000,
                    37.05,
                    37.05,
                    37.05,
                    37.05
                ],
                [
                    1630511056000,
                    37.05,
                    37.05,
                    37.05,
                    37.05
                ],
                [
                    1630513308000,
                    37.05,
                    38,
                    37.05,
                    38
                ],
                [
                    1630513871000,
                    38.05,
                    39.15,
                    38.05,
                    39.15
                ],
                [
                    1630514434000,
                    39.15,
                    39.75,
                    39.15,
                    39.75
                ]
            ]
        }, false);

        chart.xAxis[0].update({
            breaks: [{
                from: 1630433362000,
                to: 1630499233000
            }]
        }, false);

        chart.xAxis[0].setExtremes();

        const point1 = chart.series[0].points[0].shapeArgs,
            point2 = chart.series[0].points[1].shapeArgs;
        assert.ok(
            point1.x + point2.width < point2.x,
            'Points should not overlap after applying breaks property, #16368.'
        );
    }
);
QUnit.test('Axis.brokenAxis.hasBreaks', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(
        chart.xAxis[0].brokenAxis.hasBreaks,
        false,
        'Axis.breaks: undefined results in Axis.brokenAxis.hasBreaks: false.'
    );

    chart.xAxis[0].update({
        breaks: []
    });
    assert.strictEqual(
        chart.xAxis[0].brokenAxis.hasBreaks,
        false,
        'Axis.breaks: [] results in Axis.brokenAxis.hasBreaks: false.'
    );

    chart.xAxis[0].update({
        breaks: [{}]
    });
    assert.strictEqual(
        chart.xAxis[0].brokenAxis.hasBreaks,
        false,
        'Axis.breaks: [{}] results in Axis.brokenAxis.hasBreaks: false.'
    );

    chart.xAxis[0].update({
        breaks: [{
            from: 1,
            to: 2
        }]
    });
    assert.strictEqual(
        chart.xAxis[0].brokenAxis.hasBreaks,
        true,
        'Axis.breaks with correct config results in Axis.brokenAxis.hasBreaks: true.'
    );
});

QUnit.test('Axis breaks with categories', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            categories: [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine'
            ],

            breaks: [
                {
                    from: 2.5,
                    to: 7.5
                }
            ]
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1
                ]
            }
        ]
    });

    var gridBox = chart.xAxis[0].gridGroup.getBBox();

    assert.strictEqual(
        gridBox.x + 0.5,
        chart.plotLeft,
        'Left tick is left of plot area'
    );
    assert.strictEqual(
        gridBox.width,
        chart.plotWidth,
        'Right tick is right of plot area'
    );
});

QUnit.test('Axis breaks with scatter series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            breaks: [
                {
                    to: 1272240000000,
                    from: 1272067200000
                }
            ]
        },
        series: [
            {
                type: 'scatter',
                data: [
                    [1271980800000, 0],
                    [1272240000000, 2],
                    [1272326400000, 1],
                    [1272412800000, 5],
                    [1272499200000, 4]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        4,
        'X axis has ticks (#7275)'
    );
});

QUnit.test('Axis breaks on Y axis', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: {
            breaks: [
                {
                    from: 50,
                    to: 100,
                    breakSize: 0
                }
            ]
        },
        series: [{ data: [0, 49, 101, 150] }]
    });

    assert.strictEqual(
        typeof chart.yAxis[0].toPixels(50),
        'number',
        'Axis to pixels ok'
    );
    assert.strictEqual(
        chart.yAxis[0].toPixels(50),
        chart.yAxis[0].toPixels(100),
        '50 and 100 translate to the same axis position'
    );
});

QUnit.test('#14236: Stacked area chart null yBottom', assert => {
    const chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                connectNulls: true
            },
            series: {
                gapSize: 1
            }
        },
        series: [
            {
                type: 'area',
                data: [
                    [0, 0],
                    [1, 0],
                    [3, 0],
                    [4, 0]
                ]
            },
            {
                type: 'area',
                data: [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1],
                    [4, 1]
                ]
            }
        ]
    });

    assert.notOk(
        chart.series[1].areaPath.some(p => p[2] === null),
        'There should be no null yBottoms'
    );
});

QUnit.test('#14833: Column series axis break regression', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            tickInterval: 1,
            breaks: [{
                from: 5,
                to: 10,
                breakSize: 1
            }]
        },
        series: [{
            gapSize: 1,
            data: (function () {
                var data = [],
                    i;
                for (i = 0; i < 20; i = i + 1) {
                    data.push(i);
                }
                return data;
            }())
        }]
    });

    assert.ok(
        chart.series[0].points.slice(6, 10).every(point => point.graphic.visibility === 'hidden'),
        'Points in break should not render'
    );
});

QUnit.test('connectNulls and stacking', assert => {
    const chart = Highcharts.chart('container', {
        yAxis: [{}, {}],
        plotOptions: {
            series: {
                connectNulls: false
            }
        },
        series: [{
            type: 'line',
            stacking: false,
            data: [4, 4, null, null, 4, 4, 4]
        }, {
            type: 'area',
            stacking: 'normal',
            yAxis: 1,
            data: [1, 1, null, null, 1, 1, 1]
        }]
    });

    assert.notStrictEqual(
        chart.series[1].graph.element.getAttribute('d').indexOf('M', 1),
        -1,
        '#14882: Area graph should have a gap'
    );
});

QUnit.test('Axis with breaks and toValue method calculation, #13238.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        xAxis: {
            breaks: [{
                from: 3,
                to: 7
            }]
        },
        series: [{
            data: [
                [0, 1],
                [1, 1],
                [5, 2],
                [6, 2],
                [7, 2],
                [8, 2]
            ]
        }]
    });

    assert.close(
        chart.xAxis[0].toValue(100),
        0.26227,
        0.05,
        'The toValue method should return correct value when breakes enabled.'
    );
});
