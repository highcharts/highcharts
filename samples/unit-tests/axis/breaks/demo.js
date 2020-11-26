QUnit.test(
    'Columnrange series should work with broken-axis. (#4868)',
    function (assert) {
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
    }
);

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

QUnit.test(
    'pointBreak callback wasn\'t called for xAxis and different ' +
    'series than column.(#4533)',
    function (assert) {
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
            'All after breaks called'
        );
        assert.strictEqual(
            iteratorPB,
            8,
            'All point breaks called'
        );
    }
);


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
            text: 'Point break for positives and negatives, ' +
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
                            'M', x, y, 'L', x + w * 0.25, y + 4,
                            'L', x + w * 0.75, y - 4, 'L', x + w, y
                        ];

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
        !(
            series[0].points[0][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
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
        ) && !(
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
        ) && !(
            series[1].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has zero breaks'
    );
    assert.strictEqual(
        !(
            series[2].points[3][[
                'brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
            series[2].points[3][[
                'brk', breaks[1].from, breaks[1].to]
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
        ) && !(
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
        ) && (
            series[0].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (top) break'
    );
    assert.strictEqual(
        (
            series[0].points[3][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
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
        ) && (
            series[1].points[0][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (top) break'
    );
    assert.strictEqual(
        !(
            series[1].points[2][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && (
            series[1].points[2][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (top) break'
    );
    assert.strictEqual(
        (
            series[2].points[0][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
            series[2].points[0][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        (
            series[2].points[2][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
            series[2].points[2][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        (
            series[3].points[0][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
            series[3].points[0][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (bottom) break'
    );
    assert.strictEqual(
        (
            series[3].points[2][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && !(
            series[3].points[2][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has exactly one (bottom) break'
    );
    // Two or more breaks:
    assert.strictEqual(
        (
            series[1].points[3][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && (
            series[1].points[3][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has two breaks'
    );
    assert.strictEqual(
        (
            series[2].points[1][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && (
            series[2].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has two breaks'
    );
    assert.strictEqual(
        (
            series[3].points[1][
                ['brk', breaks[0].from, breaks[0].to]
            ] instanceof Highcharts.SVGElement
        ) && (
            series[3].points[1][
                ['brk', breaks[1].from, breaks[1].to]
            ] instanceof Highcharts.SVGElement
        ),
        true,
        'Has two breaks'
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
QUnit.test('Axis.brokenAxis.hasBreaks', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4]
        }]
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
        true,
        'Axis.breaks: [{}] results in Axis.brokenAxis.hasBreaks: true.'
    );
});

QUnit.test('Axis breaks with categories', function (assert) {
    var chart = Highcharts.chart('container', {

        xAxis: {
            categories: [
                'zero', 'one', 'two', 'three', 'four',
                'five', 'six', 'seven', 'eight', 'nine'
            ],

            breaks: [{
                from: 2.5,
                to: 7.5
            }]
        },

        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0,
                176.0, 135.6, 148.5, 216.4, 194.1
            ]
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
                    [1597912097000, 0],
                    [1597914113000, 0],
                    [1597916129000, 0],
                    [1597918145000, 0],
                    [1597920161000, 0],
                    [1597922177000, 0],
                    [1597924193000, 0],
                    [1597926209000, 0],
                    [1597928225000, 0],
                    [1597930241000, 0],
                    [1597932257000, 0],
                    [1597934273000, 0],
                    [1597936289000, 0],
                    [1597938305000, 0],
                    [1597940321000, 0],
                    [1597942337000, 0],
                    [1597944353000, 0],
                    [1597946369000, 0],
                    [1597948385000, 0],
                    [1597950401000, 0],
                    [1597952417000, 0],
                    [1597954433000, 0],
                    [1597956449000, 0],
                    [1597958465000, 0],
                    [1597960481000, 0],
                    [1597962497000, 0],
                    [1597964513000, 0],
                    [1597966529000, 0],
                    [1597968545000, 0],
                    [1597970561000, 0],
                    [1597972577000, 0],
                    [1597974593000, 0],
                    [1597976609000, 0],
                    [1597978625000, 0],
                    [1597980641000, 0],
                    [1597982657000, 0],
                    [1597984673000, 0],
                    [1597986689000, 0],
                    [1597988705000, 0],
                    [1597990721000, 0],
                    [1597992737000, 0],
                    [1597994753000, 0],
                    [1597996769000, 0],
                    [1597998785000, 0],
                    [1598000801000, 0],
                    [1598002817000, 0],
                    [1598004833000, 0],
                    [1598006849000, 0],
                    [1598008865000, 0],
                    [1598010881000, 0],
                    [1598012897000, 0],
                    [1598014913000, 0],
                    [1598016929000, 0],
                    [1598018945000, 0],
                    [1598020961000, 0],
                    [1598022977000, 0],
                    [1598024993000, 0],
                    [1598027009000, 0],
                    [1598029025000, 0],
                    [1598031041000, 0],
                    [1598033057000, 0],
                    [1598035073000, 0],
                    [1598037089000, 0],
                    [1598039105000, 0],
                    [1598041121000, 0],
                    [1598043137000, 0],
                    [1598045153000, 0],
                    [1598047169000, 0],
                    [1598049185000, 0],
                    [1598051201000, 0],
                    [1598053217000, 0],
                    [1598055233000, 0],
                    [1598057249000, 0],
                    [1598059265000, 0],
                    [1598061281000, 0],
                    [1598063297000, 0],
                    [1598065313000, 0],
                    [1598067329000, 0],
                    [1598069345000, 0],
                    [1598071361000, 0],
                    [1598073377000, 0],
                    [1598075393000, 0],
                    [1598077409000, 0],
                    [1598079425000, 0],
                    [1598081441000, 0],
                    [1598083457000, 0],
                    [1598085473000, 0],
                    [1598087489000, 0],
                    [1598089505000, 0],
                    [1598091521000, 0],
                    [1598093537000, 0],
                    [1598095553000, 0],
                    [1598097569000, 0],
                    [1598099585000, 0],
                    [1598101601000, 0],
                    [1598103617000, 0],
                    [1598105633000, 0],
                    [1598107649000, 0],
                    [1598109665000, 0],
                    [1598111681000, 0],
                    [1598113697000, 0],
                    [1598115713000, 0],
                    [1598117729000, 0],
                    [1598119745000, 0],
                    [1598121761000, 0],
                    [1598123777000, 0],
                    [1598125793000, 0],
                    [1598127809000, 0],
                    [1598129825000, 0],
                    [1598131841000, 0],
                    [1598133857000, 0],
                    [1598135873000, 0],
                    [1598137889000, 0],
                    [1598139905000, 0],
                    [1598141921000, 0],
                    [1598143937000, 0],
                    [1598145953000, 0],
                    [1598147969000, 0],
                    [1598149985000, 0],
                    [1598152001000, 0],
                    [1598154017000, 0],
                    [1598156033000, 0],
                    [1598158049000, 0],
                    [1598160065000, 0],
                    [1598162081000, 0],
                    [1598164097000, 0],
                    [1598166113000, 0],
                    [1598168129000, 0],
                    [1598170145000, 0],
                    [1598172161000, 0],
                    [1598174177000, 0],
                    [1598176193000, 0],
                    [1598178209000, 0],
                    [1598180225000, 0],
                    [1598182241000, 0],
                    [1598184257000, 0],
                    [1598186273000, 0],
                    [1598188289000, 0],
                    [1598190305000, 0],
                    [1598192321000, 0],
                    [1598194337000, 0],
                    [1598196353000, 0],
                    [1598198369000, 0],
                    [1598200385000, 0],
                    [1598202401000, 0],
                    [1598204417000, 0],
                    [1598206433000, 0],
                    [1598208449000, 0],
                    [1598210465000, 0],
                    [1598212481000, 0],
                    [1598214497000, 0],
                    [1598216513000, 0],
                    [1598218529000, 0],
                    [1598220545000, 0],
                    [1598222561000, 0],
                    [1598224577000, 0],
                    [1598226593000, 0],
                    [1598228609000, 0],
                    [1598230625000, 0],
                    [1598232641000, 0],
                    [1598234657000, 0],
                    [1598236673000, 0],
                    [1598238689000, 0],
                    [1598240705000, 0],
                    [1598242721000, 0],
                    [1598244737000, 0],
                    [1598246753000, 0],
                    [1598248769000, 0],
                    [1598250785000, 0],
                    [1598252801000, 0],
                    [1598254817000, 0],
                    [1598256833000, 0],
                    [1598258849000, 0],
                    [1598260865000, 0],
                    [1598262881000, 0],
                    [1598264897000, 0],
                    [1598266913000, 0],
                    [1598268929000, 0],
                    [1598270945000, 0],
                    [1598272961000, 0],
                    [1598274977000, 0],
                    [1598276993000, 0],
                    [1598279009000, 0],
                    [1598281025000, 0],
                    [1598283041000, 0],
                    [1598285057000, 0],
                    [1598287073000, 0],
                    [1598289089000, 0],
                    [1598291105000, 0],
                    [1598293121000, 0],
                    [1598295137000, 0],
                    [1598297153000, 0],
                    [1598299169000, 0],
                    [1598301185000, 0],
                    [1598303201000, 0],
                    [1598305217000, 0],
                    [1598307233000, 0],
                    [1598309249000, 0],
                    [1598311265000, 0],
                    [1598313281000, 0],
                    [1598315297000, 0],
                    [1598317313000, 0],
                    [1598319329000, 0],
                    [1598321345000, 0],
                    [1598323361000, 0],
                    [1598325377000, 0],
                    [1598327393000, 0],
                    [1598329409000, 0],
                    [1598331425000, 0],
                    [1598333441000, 0],
                    [1598335457000, 0],
                    [1598337473000, 0],
                    [1598339489000, 0],
                    [1598341505000, 0],
                    [1598343521000, 0],
                    [1598345537000, 0],
                    [1598347553000, 0],
                    [1598349569000, 0],
                    [1598351585000, 0],
                    [1598353601000, 0],
                    [1598355617000, 0],
                    [1598357633000, 0],
                    [1598359649000, 0],
                    [1598361665000, 0],
                    [1598363681000, 0],
                    [1598365697000, 0],
                    [1598367713000, 0],
                    [1598369729000, 0],
                    [1598371745000, 0],
                    [1598373761000, 0],
                    [1598375777000, 0],
                    [1598377793000, 0],
                    [1598379809000, 0],
                    [1598381825000, 0],
                    [1598383841000, 0],
                    [1598385857000, 0],
                    [1598387873000, 0],
                    [1598389889000, 0],
                    [1598391905000, 0],
                    [1598393921000, 0],
                    [1598395937000, 0],
                    [1598397953000, 0],
                    [1598399969000, 0],
                    [1598401985000, 0],
                    [1598404001000, 0],
                    [1598406017000, 0],
                    [1598408033000, 0],
                    [1598410049000, 0],
                    [1598412065000, 0],
                    [1598414081000, 0],
                    [1598416097000, 0],
                    [1598418113000, 0],
                    [1598420129000, 0],
                    [1598422145000, 0],
                    [1598424161000, 0],
                    [1598426177000, 0],
                    [1598428193000, 0],
                    [1598430209000, 0],
                    [1598432225000, 0],
                    [1598434241000, 0],
                    [1598436257000, 0],
                    [1598438273000, 0],
                    [1598440289000, 0],
                    [1598442305000, 0],
                    [1598444321000, 0],
                    [1598446337000, 0],
                    [1598448353000, 0],
                    [1598450369000, 0],
                    [1598452385000, 0],
                    [1598454401000, 0],
                    [1598456417000, 0],
                    [1598458433000, 0],
                    [1598460449000, 0],
                    [1598462465000, 0],
                    [1598464481000, 0],
                    [1598466497000, 0],
                    [1598468513000, 0],
                    [1598470529000, 0],
                    [1598472545000, 0],
                    [1598474561000, 0],
                    [1598476577000, 0],
                    [1598478593000, 0],
                    [1598480609000, 0],
                    [1598482625000, 0],
                    [1598484641000, 0],
                    [1598486657000, 0],
                    [1598488673000, 0],
                    [1598490689000, 0],
                    [1598492705000, 0],
                    [1598494721000, 0],
                    [1598496737000, 0],
                    [1598498753000, 0],
                    [1598500769000, 0],
                    [1598502785000, 0],
                    [1598504801000, 0],
                    [1598506817000, 0],
                    [1598508833000, 0],
                    [1598510849000, 0],
                    [1598512865000, 0],
                    [1598514881000, 0],
                    [1598516897000, 0]
                ]
            },
            {
                type: 'area',
                data: [
                    [1598345537000, 0],
                    [1598347553000, 0],
                    [1598349569000, 0],
                    [1598351585000, 0],
                    [1598353601000, 0],
                    [1598355617000, 2],
                    [1598357633000, 0],
                    [1598359649000, 0],
                    [1598361665000, 0],
                    [1598363681000, 0],
                    [1598365697000, 0],
                    [1598367713000, 0],
                    [1598369729000, 0],
                    [1598371745000, 0],
                    [1598373761000, 0],
                    [1598375777000, 0],
                    [1598377793000, 0],
                    [1598379809000, 0],
                    [1598381825000, 0],
                    [1598383841000, 0],
                    [1598385857000, 0],
                    [1598387873000, 0],
                    [1598389889000, 0],
                    [1598391905000, 0],
                    [1598393921000, 0],
                    [1598395937000, 0],
                    [1598397953000, 0],
                    [1598399969000, 0],
                    [1598401985000, 0],
                    [1598404001000, 0],
                    [1598406017000, 0],
                    [1598408033000, 0],
                    [1598410049000, 0],
                    [1598412065000, 0],
                    [1598414081000, 0],
                    [1598416097000, 0],
                    [1598418113000, 0],
                    [1598420129000, 0],
                    [1598422145000, 0],
                    [1598424161000, 0],
                    [1598426177000, 0],
                    [1598428193000, 0],
                    [1598430209000, 2],
                    [1598432225000, 0],
                    [1598434241000, 1],
                    [1598436257000, 1],
                    [1598438273000, 1],
                    [1598440289000, 1],
                    [1598442305000, 1],
                    [1598444321000, 1],
                    [1598446337000, 0],
                    [1598448353000, 0],
                    [1598450369000, 2],
                    [1598452385000, 2],
                    [1598454401000, 3],
                    [1598456417000, 0],
                    [1598458433000, 0],
                    [1598460449000, 0],
                    [1598462465000, 0],
                    [1598464481000, 0],
                    [1598466497000, 0],
                    [1598468513000, 0],
                    [1598470529000, 0],
                    [1598472545000, 0],
                    [1598474561000, 0],
                    [1598476577000, 0],
                    [1598478593000, 0],
                    [1598480609000, 0],
                    [1598482625000, 0],
                    [1598484641000, 0],
                    [1598486657000, 0],
                    [1598488673000, 0],
                    [1598490689000, 0],
                    [1598492705000, 0],
                    [1598494721000, 0],
                    [1598496737000, 0],
                    [1598498753000, 0],
                    [1598500769000, 0],
                    [1598502785000, 0],
                    [1598504801000, 0],
                    [1598506817000, 0],
                    [1598508833000, 0],
                    [1598510849000, 0],
                    [1598512865000, 0],
                    [1598514881000, 0],
                    [1598516897000, 0]
                ]
            },
            {
                type: 'area',
                data: [
                    [1598345537000, 0],
                    [1598347553000, 0],
                    [1598349569000, 0],
                    [1598351585000, 0],
                    [1598353601000, 0],
                    [1598357633000, 0],
                    [1598359649000, 0],
                    [1598361665000, 0],
                    [1598363681000, 0],
                    [1598365697000, 0],
                    [1598367713000, 0],
                    [1598369729000, 0],
                    [1598371745000, 0],
                    [1598373761000, 0],
                    [1598375777000, 0],
                    [1598377793000, 0],
                    [1598379809000, 0],
                    [1598381825000, 0],
                    [1598383841000, 0],
                    [1598385857000, 0],
                    [1598387873000, 0],
                    [1598389889000, 0],
                    [1598391905000, 0],
                    [1598393921000, 0],
                    [1598395937000, 0],
                    [1598397953000, 0],
                    [1598399969000, 0],
                    [1598401985000, 0],
                    [1598404001000, 0],
                    [1598406017000, 0],
                    [1598408033000, 0],
                    [1598410049000, 0],
                    [1598412065000, 0],
                    [1598414081000, 0],
                    [1598416097000, 0],
                    [1598418113000, 0],
                    [1598420129000, 0],
                    [1598422145000, 0],
                    [1598424161000, 0],
                    [1598426177000, 0],
                    [1598428193000, 0],
                    [1598430209000, 0],
                    [1598432225000, 0],
                    [1598434241000, 0],
                    [1598436257000, 0],
                    [1598438273000, 0],
                    [1598440289000, 0],
                    [1598442305000, 0],
                    [1598444321000, 0],
                    [1598446337000, 0],
                    [1598448353000, 0],
                    [1598450369000, 0],
                    [1598452385000, 0],
                    [1598454401000, 0],
                    [1598456417000, 0],
                    [1598458433000, 0],
                    [1598460449000, 0],
                    [1598462465000, 0],
                    [1598464481000, 0],
                    [1598466497000, 0],
                    [1598468513000, 0],
                    [1598470529000, 0],
                    [1598472545000, 0],
                    [1598474561000, 0],
                    [1598476577000, 0],
                    [1598478593000, 0],
                    [1598480609000, 0],
                    [1598482625000, 0],
                    [1598484641000, 0],
                    [1598486657000, 0],
                    [1598488673000, 0],
                    [1598490689000, 0],
                    [1598492705000, 0],
                    [1598494721000, 0],
                    [1598496737000, 0],
                    [1598498753000, 0],
                    [1598500769000, 0],
                    [1598502785000, 0],
                    [1598504801000, 0],
                    [1598506817000, 0],
                    [1598508833000, 0],
                    [1598510849000, 0],
                    [1598512865000, 0],
                    [1598514881000, 0],
                    [1598516897000, 0]
                ]
            },
            {
                type: 'area',
                data: [
                    [1598345537000, 3],
                    [1598347553000, 3],
                    [1598349569000, 3],
                    [1598351585000, 3],
                    [1598353601000, 1],
                    [1598355617000, 0],
                    [1598357633000, 1],
                    [1598359649000, 1],
                    [1598361665000, 3],
                    [1598363681000, 4],
                    [1598365697000, 1],
                    [1598367713000, 1],
                    [1598369729000, 3],
                    [1598371745000, 1],
                    [1598373761000, 4],
                    [1598375777000, 4],
                    [1598377793000, 4],
                    [1598379809000, 4],
                    [1598381825000, 4],
                    [1598383841000, 4],
                    [1598385857000, 4],
                    [1598387873000, 4],
                    [1598389889000, 4],
                    [1598391905000, 4],
                    [1598393921000, 4],
                    [1598395937000, 4],
                    [1598397953000, 4],
                    [1598399969000, 4],
                    [1598401985000, 4],
                    [1598404001000, 4],
                    [1598406017000, 4],
                    [1598408033000, 4],
                    [1598410049000, 4],
                    [1598412065000, 4],
                    [1598414081000, 4],
                    [1598416097000, 4],
                    [1598418113000, 4],
                    [1598420129000, 4],
                    [1598422145000, 4],
                    [1598424161000, 4],
                    [1598426177000, 4],
                    [1598428193000, 4],
                    [1598430209000, 3],
                    [1598432225000, 5],
                    [1598434241000, 4],
                    [1598436257000, 4],
                    [1598438273000, 4],
                    [1598440289000, 4],
                    [1598442305000, 4],
                    [1598444321000, 4],
                    [1598446337000, 3],
                    [1598448353000, 5],
                    [1598450369000, 3],
                    [1598452385000, 3],
                    [1598454401000, 2],
                    [1598456417000, 5],
                    [1598458433000, 5],
                    [1598460449000, 5],
                    [1598462465000, 5],
                    [1598464481000, 5],
                    [1598466497000, 5],
                    [1598468513000, 5],
                    [1598470529000, 5],
                    [1598472545000, 5],
                    [1598474561000, 5],
                    [1598476577000, 5],
                    [1598478593000, 5],
                    [1598480609000, 5],
                    [1598482625000, 5],
                    [1598484641000, 5],
                    [1598486657000, 5],
                    [1598488673000, 5],
                    [1598490689000, 5],
                    [1598492705000, 5],
                    [1598494721000, 5],
                    [1598496737000, 5],
                    [1598498753000, 5],
                    [1598500769000, 5],
                    [1598502785000, 5],
                    [1598504801000, 5],
                    [1598506817000, 5],
                    [1598508833000, 5],
                    [1598510849000, 5],
                    [1598512865000, 5],
                    [1598514881000, 5],
                    [1598516897000, 5]
                ]
            },
            {
                type: 'area',
                data: [
                    [1598345013000, 2],
                    [1598345843000, 6],
                    [1598346673000, 6],
                    [1598347503000, 6],
                    [1598348333000, 6],
                    [1598349163000, 6],
                    [1598349993000, 6],
                    [1598350823000, 6],
                    [1598351653000, 6],
                    [1598352483000, 6],
                    [1598353313000, 2],
                    [1598354143000, 10],
                    [1598354973000, 10],
                    [1598357463000, 2],
                    [1598359123000, 2],
                    [1598360783000, 6],
                    [1598361613000, 6],
                    [1598362443000, 8],
                    [1598363273000, 8],
                    [1598364103000, 6],
                    [1598364933000, 2],
                    [1598365763000, 2],
                    [1598366593000, 2],
                    [1598367423000, 2],
                    [1598368253000, 2],
                    [1598369083000, 4],
                    [1598369913000, 10],
                    [1598370743000, 2],
                    [1598372403000, 8],
                    [1598373233000, 8],
                    [1598374063000, 8],
                    [1598374893000, 8],
                    [1598375723000, 8],
                    [1598376553000, 8],
                    [1598377383000, 8],
                    [1598378213000, 8],
                    [1598379043000, 8],
                    [1598379873000, 8],
                    [1598380703000, 8],
                    [1598381533000, 8],
                    [1598382363000, 8],
                    [1598383193000, 8],
                    [1598384023000, 8],
                    [1598384853000, 8],
                    [1598385683000, 8],
                    [1598386513000, 8],
                    [1598387343000, 8],
                    [1598388173000, 8],
                    [1598389003000, 8],
                    [1598389833000, 8],
                    [1598390663000, 8],
                    [1598391493000, 8],
                    [1598392323000, 8]
                ]
            }
        ]
    });

    assert.notOk(
        chart.series[3].areaPath.some(p => p[2] === null),
        'There should be no null yBottoms'
    );
});