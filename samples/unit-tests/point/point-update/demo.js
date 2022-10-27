QUnit.test(
    'Line series markers should be updated on redraw.(#4759)',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                series: [
                    {
                        data: [
                            {
                                y: 55,
                                name: 'Item 1',
                                color: 'blue'
                            },
                            {
                                y: 45,
                                name: 'Item 1',
                                color: 'green'
                            }
                        ]
                    }
                ]
            })
            .highcharts();

        chart.series[0].points[0].update({
            marker: {
                fillColor: 'red'
            }
        });

        chart.series[0].points[1].update({
            color: 'orange'
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('fill'),
            'red',
            'Proper color for a marker.'
        );

        assert.strictEqual(
            chart.series[0].points[1].graphic.attr('fill'),
            'orange',
            'Proper color for a marker.'
        );
    }
);

QUnit.test(
    'Column series point should be updated on redraw.',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                chart: {
                    type: 'column'
                },
                series: [
                    {
                        data: [
                            {
                                y: 55,
                                name: 'Item 1',
                                color: 'blue'
                            },
                            {
                                y: 45,
                                name: 'Item 1',
                                color: 'green'
                            }
                        ]
                    }
                ]
            })
            .highcharts();

        chart.series[0].points[0].update({
            color: 'red'
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('fill'),
            'red',
            'Proper color for a marker.'
        );
    }
);

QUnit.test('Pie series point should be updated on redraw.', function (assert) {
    var chart = $('#container')
        .highcharts({
            chart: {
                type: 'pie'
            },
            series: [
                {
                    data: [
                        {
                            y: 55,
                            name: 'Item 1',
                            color: 'blue'
                        },
                        {
                            y: 45,
                            name: 'Item 1',
                            color: 'green'
                        }
                    ]
                }
            ]
        })
        .highcharts();

    chart.series[0].points[0].update({
        color: 'red'
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('fill'),
        'red',
        'Proper color for a marker.'
    );
});

QUnit.test('Column update(#4284)', function (assert) {
    var chart = $('#container')
        .highcharts({
            chart: {
                animation: false
            },

            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ]
            },

            series: [
                {
                    type: 'column',
                    animation: false,
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
                        194.1,
                        95.6,
                        54.4
                    ]
                }
            ]
        })
        .highcharts();

    var point = chart.series[0].points[0];
    point.update({ y: 100 });

    assert.notEqual(
        point.graphic.element.getAttribute('visibility'),
        'hidden',
        'Point is visible'
    );
});
QUnit.test(
    'Preserve point config initial number type in options.data',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                navigator: {
                    enabled: true
                },

                series: [
                    {
                        data: [1, 2, 3],
                        turboThreshold: 2
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return typeof pointCfg;
                })
                .join(','),
            'number,number,number',
            'Points are numbers'
        );

        chart.series[0].points[2].update(100, true, false);

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return typeof pointCfg;
                })
                .join(','),
            'number,number,number',
            'Points are numbers'
        );

        chart.series[0].points[2].update([4, 200], true, false);

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return typeof pointCfg === 'object' ?
                        Object.prototype.toString.call(pointCfg) :
                        typeof pointCfg;
                })
                .join(','),
            'number,number,[object Array]',
            'Points are mixed'
        );

        chart.series[0].points[2].update({ x: 4, y: 200 }, true, false);

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return typeof pointCfg === 'object' ?
                        Object.prototype.toString.call(pointCfg) :
                        typeof pointCfg;
                })
                .join(','),
            'number,number,[object Object]',
            'Points are mixed'
        );

        chart.series[0].points[1].update();

        assert.strictEqual(
            chart.series[0].options.data[1],
            2,
            'Update without options should keep original value (#8023).'
        );

        assert.strictEqual(
            chart.xAxis[0].max,
            chart.xAxis[0].dataMax,
            'Correct extremes after point update (#8023).'
        );
    }
);

QUnit.test(
    'Preserve point config initial array type in options.data',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                accessibility: {
                    enabled: false // Forces markers
                },
                series: [
                    {
                        data: [
                            [0, 1],
                            [1, 2],
                            [2, 3]
                        ],
                        turboThreshold: 2
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return Highcharts.isArray(pointCfg);
                })
                .join(','),
            'true,true,true',
            'Points are arrays'
        );

        chart.series[0].points[2].update([2, 100], true, false);

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return Highcharts.isArray(pointCfg);
                })
                .join(','),
            'true,true,true',
            'Points are arrays'
        );

        chart.series[0].points[2].update([4, 200], true, false);

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return typeof pointCfg === 'object' ?
                        Object.prototype.toString.call(pointCfg) :
                        typeof pointCfg;
                })
                .join(','),
            '[object Array],[object Array],[object Array]',
            'Points are mixed'
        );

        chart.series[0].points[2].update({ x: 4, y: 200 }, true, false);

        assert.strictEqual(
            chart.series[0].options.data
                .map(function (pointCfg) {
                    return typeof pointCfg === 'object' ?
                        Object.prototype.toString.call(pointCfg) :
                        typeof pointCfg;
                })
                .join(','),
            '[object Array],[object Array],[object Object]',
            'Points are mixed'
        );

        chart.series[0].update({
            pointStart: 5,
            pointInterval: 2
        });
        chart.series[0].setData([[1], [2], [3]], true, false, false);

        assert.deepEqual(
            chart.series[0].xData,
            [5, 7, 9],
            '#15117: pointStart/pointInterval should work with turboed 2d array data'
        );
        assert.deepEqual(
            chart.series[0].yData,
            [1, 2, 3],
            '#15117: pointStart/pointInterval should work with turboed 2d array data'
        );

        const map = Highcharts.Series.types.line.prototype.pointArrayMap;
        Highcharts.Series.types.line.prototype.pointArrayMap = ['y'];

        chart.series[0].setData([[2], [4], [6]], true, false, false);

        assert.deepEqual(
            chart.series[0].xData,
            [5, 7, 9],
            '#15117: pointStart/pointInterval should work with turboed pointArrayMap series'
        );
        assert.deepEqual(
            chart.series[0].yData,
            [[2], [4], [6]],
            '#15117: pointStart/pointInterval should work with turboed pointArrayMap series'
        );

        Highcharts.Series.types.line.prototype.pointArrayMap = map;
    }
);

QUnit.test(
    'Preserve data values when updating from array to object config (#4916)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            accessibility: {
                enabled: false // Forces markers
            },
            xAxis: {
                type: 'datetime'
            },
            series: [
                {
                    data: [
                        [1, 2],
                        [3, 4],
                        [5, 6]
                    ]
                }
            ]
        });

        assert.strictEqual(
            chart.series[0].options.data.toString(),
            '1,2,3,4,5,6',
            'Initial arrays'
        );

        chart.series[0].points[0].update({
            marker: {
                lineColor: 'red'
            }
        });

        assert.deepEqual(
            chart.series[0].options.data[0],
            {
                x: 1,
                y: 2,
                marker: {
                    lineColor: 'red'
                }
            },
            'Object with data preserved'
        );
    }
);

QUnit.test(
    'marker.symbol=null should be accepted in point.update() (#6792)',
    function (assert) {
        var chart = Highcharts.chart('container', {
                accessibility: {
                    enabled: false // Forces markers
                },
                series: [
                    {
                        data: [
                            {
                                y: 10,
                                marker: {
                                    symbol: 'square'
                                }
                            },
                            {
                                y: 10
                            }
                        ]
                    }
                ]
            }),
            point = chart.series[0].points[0],
            prevGraphic = point.graphic;

        point.update({
            marker: {
                symbol: null
            }
        });

        assert.strictEqual(
            point.graphic !== prevGraphic,
            true,
            'Point.graphic updated'
        );
    }
);

QUnit.test('Pie series point update', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        series: [
            {
                data: [
                    {
                        name: 'Americas',
                        y: 100,
                        color: 'yellow'
                    },
                    {
                        name: 'Europe',
                        y: 200,
                        color: 'green'
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].connector.attr('stroke'),
        'yellow',
        'Initial connector color'
    );

    chart.series[0].points[0].update({ color: 'red' });
    assert.strictEqual(
        chart.series[0].points[0].connector.attr('stroke'),
        'red',
        'Connector color updated'
    );
});
