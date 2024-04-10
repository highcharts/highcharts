QUnit.test('variwide', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'variwide'
        },

        xAxis: {
            type: 'category',
            crosshair: true
        }
    });

    assert.strictEqual(chart.series.length, 0, 'No series');

    chart.addSeries({
        data: [
            [1, 1],
            [2, 2],
            [3, 3]
        ]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        3,
        'Series successfully added'
    );

    chart.series[0].addPoint({
        y: 20,
        z: 50
    });

    assert.deepEqual(chart.series[0].points.length, 4, 'addPoint');

    chart.series[0].removePoint(0);
    assert.deepEqual(chart.series[0].points.length, 3, 'removePoint');

    // Show crosshair
    chart.series[0].points[1].onMouseOver();
    assert.close(
        chart.xAxis[0].cross.attr('stroke-width'),
        chart.series[0].points[1].crosshairWidth,
        1,
        'Crosshair has the same width as category (#8083)'
    );

    // Disable crosshair
    chart.xAxis[0].update({ crosshair: false });
    chart.series[0].points[0].onMouseOver();
    assert.ok(true, 'No errors with disabled crosshair (#8173)');

    chart.update(
        {
            xAxis: {
                minRange: 1
            },
            series: [
                {
                    type: 'variwide',
                    borderWidth: 0,
                    cropThreshold: 1,

                    data: [
                        [0, 1, 1],
                        [1, 2, 1],
                        [2, 3, 1],
                        [3, 2, 1]
                    ]
                }
            ]
        },
        true,
        true,
        false
    );

    chart.xAxis[0].setExtremes(0, 1, true, false);
    chart.reflow();
    chart.xAxis[0].setExtremes(0, 3, true, false);

    assert.strictEqual(
        chart.series[0].points.length,
        4,
        'Correct number of points after zoom and redraw (#9525)'
    );

    chart.update({
        chart: {
            inverted: true
        },
        xAxis: {
            labels: {
                enabled: false
            }
        }
    });

    assert.ok(true, 'No errors with disabled xAxis labels (#11476)');

    chart.xAxis[0].setExtremes(0, 10000, true, false);

    chart.update(
        {
            chart: {
                inverted: false
            },
            series: [
                {
                    data: [
                        [0, 2, 1],
                        [1, 1, 400]
                    ]
                }
            ],
            xAxis: {
                type: 'linear'
            }
        },
        true,
        true,
        false
    );

    assert.strictEqual(
        chart.series[0].points[0].graphic.getBBox().width >= 1,
        true,
        'The width of the first point should not be less than 1px (#11510)'
    );
});

QUnit.test('variwide null points', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'variwide'
        },

        xAxis: {
            type: 'category'
        },

        series: [
            {
                data: [
                    [1, 1],
                    [2, null],
                    [null, 3],
                    [null, null],
                    [3, 3]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points
            .map(function (p) {
                return p.isNull ? 'null' : 'valid';
            })
            .join(','),
        'valid,null,null,null,valid',
        'Nulls detected'
    );
});

QUnit.test('#8635: Variwide zoom', assert => {
    [
        {},
        {
            xAxis: {
                reversed: true
            }
        }/* ,
        {
            chart: {
                inverted: true
            }
        }*/
    ].forEach(config => {
        const chart = Highcharts.chart('container', Highcharts.merge({
            chart: {
                type: 'variwide',
                zoomType: 'x'
            },
            xAxis: {
                type: 'category'
            },
            series: [{
                data: [
                    ['Norway', 50.2, 335504],
                    ['Denmark', 42, 277339],
                    ['Belgium', 39.2, 421611],
                    ['Sweden', 38, 462057],
                    ['France', 35.6, 2228857],
                    ['Netherlands', 34.3, 702641],
                    ['Finland', 33.2, 215615],
                    ['Germany', 33.0, 3144050],
                    ['Austria', 32.7, 349344],
                    ['Ireland', 30.4, 275567],
                    ['Italy', 27.8, 1672438],
                    ['United Kingdom', 26.7, 2366911],
                    ['Spain', 21.3, 1113851],
                    ['Greece', 14.2, 175887],
                    ['Portugal', 13.7, 184933],
                    ['Czech Republic', 10.2, 176564],
                    ['Poland', 8.6, 424269],
                    ['Romania', 5.5, 169578]
                ]
            }]
        }, config));

        const center = chart.plotLeft + chart.plotWidth / 2;
        const controller = new TestController(chart);
        controller.pan([center - 25, 150], [center + 25, 150]);

        const points = chart.xAxis[0].reversed ?
            chart.series[0].points.slice().reverse() :
            chart.series[0].points;

        let prevRight = -Infinity;

        assert.ok(
            points.every(point => {
                const ret = prevRight <= point.shapeArgs.x;
                prevRight = point.shapeArgs.x + point.shapeArgs.width;
                return ret;
            }),
            'Points should be positioned correctly'
        );
    });
});
