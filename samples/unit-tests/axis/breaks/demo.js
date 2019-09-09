QUnit.test('Columnrange series should work with broken-axis. (#4868)', function (assert) {
    var iter = 0;

    $('#container').highcharts({
        chart: {
            type: 'columnrange'
        },
        yAxis: {
            breaks: [{
                from: 10,
                to: 20
            }],
            events: {
                pointBreak: function () {
                    iter++;
                }
            }
        },
        series: [{
            data: [[0, 5, 15], [1, 0, 30]]
        }]
    }).highcharts();

    assert.strictEqual(
        iter,
        1,
        'pointBreak called'
    );
});

QUnit.test('Sub-millisecond tooltip (#4247)', function (assert) {
    var chart;

    $('#container').highcharts({
        title: {
            text: "Y axis translation failed"
        },
        legend: {
            enabled: false
        },
        xAxis: {
            min: 5
        },
        yAxis: {
            breaks: [{
                from: 3,
                to: 8,
                breakSize: 1
            }]
        },
        chart: {
            type: "column",
            zoomType: "x"
        },
        series: [{
            data: [9, 8, 7, 6, 5, 4, 3, 2, 1]
        }]
    });

    chart = $('#container').highcharts();


    assert.equal(
        chart.yAxis[0].min,
        0,
        'Min makes sense'
    );
    assert.equal(
        chart.yAxis[0].max,
        3,
        'Max stops at break'
    );

});

QUnit.test('Null inside break (#4275)', function (assert) {
    var chart = $('#container').highcharts({
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
            breaks: [{
                from: 5,
                to: 10,
                breakSize: 1
            }]
        },
        series: [{
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
        }]
    }).highcharts();


    assert.notEqual(
        chart.series[0].graph.element.getAttribute('d').indexOf('M', 1),
        -1,
        'Graph has moveTo operator'
    );


    chart = $('#container').highcharts({
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
            breaks: [{
                from: 5,
                to: 10,
                breakSize: 1
            }]
        },
        series: [{
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
        }]
    }).highcharts();


    assert.equal(
        chart.series[0].graph.element.getAttribute('d').indexOf('M', 1),
        -1,
        'Graph does not have moveTo operator'
    );

});

QUnit.test("pointBreak callback wasn't called for xAxis and different series than column.(#4533)", function (assert) {

    var iteratorPB = 0,
        iteratorAB = 0;

    $('#container').highcharts({
        chart: {
            width: 500,
            height: 400
        },
        yAxis: {
            breaks: [{
                from: 5,
                to: 15,
                breakSize: 1
            }],
            events: {
                pointBreak: function () {
                    iteratorPB++;
                },
                afterBreaks: function () {
                    iteratorAB++;
                }
            }
        },
        xAxis: {
            breaks: [{
                from: 5,
                to: 15,
                breakSize: 1
            }],
            events: {
                pointBreak: function () {
                    iteratorPB++;
                },
                afterBreaks: function () {
                    iteratorAB++;

                }
            }
        },
        series: [{
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

    assert.strictEqual(
        iteratorAB,
        9,
        "All after breaks called"
    );
    assert.strictEqual(
        iteratorPB,
        8,
        "All point breaks called"
    );
});


QUnit.test('PointBreak with different thresholds(#4356)', function (assert) {
    var breaks = [{
        from: -40000,
        to: -20000
    }, {
        from: 20000,
        to: 40000
    }];

    var chart = $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Point break for positives and negatives, respecting treshold'
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
                        path = ['M', x, y, 'L', x + w * 0.25, y + 4, 'L', x + w * 0.75, y - 4, 'L', x + w, y];

                    if (!point[key]) {
                        point[key] = this.chart.renderer.path(path)
                            .attr({
                                'stroke-width': 3,
                                stroke: "red"
                            }).add(point.graphic.parentGroup);
                    } else {
                        point[key].attr({
                            d: path
                        });
                    }

                }
            }
        },
        series: [{
            name: 'Threshold 0',
            // threshold: 0, // default
            data: [10000, 50000, -10000, -70000]
        }, {
            name: 'Threshold 100k',
            threshold: 100000,
            data: [10000, 50000, -10000, -70000]
        }, {
            name: 'Threshold -100k',
            threshold: -100000,
            data: [10000, 50000, -10000, -70000]
        }, {
            name: 'Threshold null',
            threshold: null,
            data: [10000, 50000, -10000, -70000]
        }]
    }).highcharts();

    var series = chart.series;
    // Zero breaks:
    assert.strictEqual(
        !(series[0].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[0].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has zero breaks"
    );
    assert.strictEqual(
        !(series[0].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[0].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has zero breaks"
    );
    assert.strictEqual(
        !(series[1].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[1].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has zero breaks"
    );
    assert.strictEqual(
        !(series[2].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[2].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has zero breaks"
    );
    assert.strictEqual(
        !(series[3].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[3].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has zero breaks"
    );

    // Exactly one break:
    assert.strictEqual(
        !(series[0].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        (series[0].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (top) break"
    );
    assert.strictEqual(
        (series[0].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[0].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (bottom) break"
    );
    assert.strictEqual(
        !(series[1].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        (series[1].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (top) break"
    );
    assert.strictEqual(
        !(series[1].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        (series[1].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (top) break"
    );
    assert.strictEqual(
        (series[2].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[2].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (bottom) break"
    );
    assert.strictEqual(
        (series[2].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[2].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (bottom) break"
    );
    assert.strictEqual(
        (series[3].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[3].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (bottom) break"
    );
    assert.strictEqual(
        (series[3].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        !(series[3].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has exactly one (bottom) break"
    );
    // Two or more breaks:
    assert.strictEqual(
        (series[1].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        (series[1].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has two breaks"
    );
    assert.strictEqual(
        (series[2].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        (series[2].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has two breaks"
    );
    assert.strictEqual(
        (series[3].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
        (series[3].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
            Highcharts.SVGElement),
        true,
        "Has two breaks"
    );

});

QUnit.test(
    'Axis breaks and column width in Highstock (#5979)',
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
                breaks: [{
                    from: Date.UTC(2010, 6, 30, 0, 0, 0),
                    to: Date.UTC(2010, 6, 31, 21, 59, 59),
                    repeat: 7 * 24 * 36e5
                }]
            },
            series: [{
                type: 'column',
                data: data,
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].graphic.attr('width') > 7,
            'Width is great enough'
        );

    }
);
QUnit.test('Axis.isBroken', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].isBroken,
        false,
        'Axis.breaks: undefined results in Axis.isBroken: false.'
    );

    chart.xAxis[0].update({
        breaks: []
    });
    assert.strictEqual(
        chart.xAxis[0].isBroken,
        false,
        'Axis.breaks: [] results in Axis.isBroken: false.'
    );

    chart.xAxis[0].update({
        breaks: [{}]
    });
    assert.strictEqual(
        chart.xAxis[0].isBroken,
        true,
        'Axis.breaks: [{}] results in Axis.isBroken: true.'
    );
});

QUnit.test('Axis breaks with categories', function (assert) {
    var chart = Highcharts.chart('container', {

        xAxis: {
            categories: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],

            breaks: [{
                from: 2.5,
                to: 7.5
            }]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1]
        }]

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
            breaks: [{
                to: 1272240000000,
                from: 1272067200000
            }]
        },
        series: [{
            type: "scatter",
            data: [
                [
                    1271980800000,
                    0
                ],
                [
                    1272240000000,
                    2
                ],
                [
                    1272326400000,
                    1
                ],
                [
                    1272412800000,
                    5
                ],
                [
                    1272499200000,
                    4
                ]
            ]
        }]
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
            breaks: [{
                from: 50,
                to: 100,
                breakSize: 0
            }]
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
