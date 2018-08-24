QUnit.test('snap', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                crosshair: {
                    snap: true
                }
            },
            yAxis: {
                crosshair: {
                    snap: true
                }
            },
            plotOptions: {
                series: {
                    kdNow: true
                }
            },
            series: [{
                type: 'bubble',
                data: [
                    [1, 1, 1]
                ]
            }]
        }),
        point = chart.series[0].points[0],
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];

    assert.strictEqual(
        !!xAxis.cross,
        false,
        'before interaction: crosshair on xAxis is not drawn.'
    );
    assert.strictEqual(
        !!yAxis.cross,
        false,
        'before interaction: crosshair on yAxis is not drawn.'
    );

    point.onMouseOver();
    assert.strictEqual(
        !!xAxis.cross,
        true,
        'mouseOver: crosshair on xAxis is added.'
    );
    assert.strictEqual(
        !!yAxis.cross,
        true,
        'mouseOver: crosshair on yAxis is added.'
    );

    // TODO Remove crosshairs on mouseOut
    // point.onMouseOut();
    // assert.strictEqual(
    //     !!xAxis.cross,
    //     false,
    //     'mouseOut: crosshair on xAxis is removed.'
    // );
    // assert.strictEqual(
    //     !!yAxis.cross,
    //     false,
    //     'mouseOut: crosshair on yAxis is removed.'
    // );

    // TODO Test positioning of crosshairs.
});

QUnit.test('Show only one crosshair at the same time (#6420, #7219).', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: [{
                crosshair: true
            }, {
                opposite: true,
                crosshair: true
            }],
            yAxis: [{
                height: '50%',
                crosshair: {
                    snap: false,
                    label: {
                        enabled: true
                    }
                }
            }, {
                top: '50%',
                height: '50%',
                crosshair: {
                    snap: false,
                    label: {
                        enabled: true
                    }
                }
            }],
            series: [{
                name: 'Installation',
                data: [1, 2, 3],
                xAxis: 0,
                yAxis: 0
            }, {
                name: 'Manufacturing',
                data: [1, 2, 3].reverse(),
                xAxis: 1,
                yAxis: 1
            }]
        }),
        series1 = chart.series[0],
        series2 = chart.series[1];

    series1.points[0].onMouseOver();
    assert.strictEqual(
        series1.xAxis.cross.attr('visibility'),
        'visible',
        'Hover Series 1: crosshair on xAxis of Series 1 is visible (#6420)'
    );
    assert.strictEqual(
        !!series2.xAxis.cross,
        false,
        'Hover Series 1: crosshair on xAxis of Series 2 does not exist (#6420)'
    );
    assert.strictEqual(
        series1.yAxis.crossLabel.attr('visibility'),
        'visible',
        'Hover Series 1: crosshair label on yAxis of Series 1 is visible (#7219)'
    );
    assert.strictEqual(
        !!series2.yAxis.crossLabel,
        false,
        'Hover Series 1: crosshair label on yAxis of Series 2 does not exist (#7219)'
    );

    series2.points[2].onMouseOver();
    assert.strictEqual(
        series1.xAxis.cross.attr('visibility'),
        'hidden',
        'Hover Series 2: crosshair on xAxis of Series 1 is hidden (#6420)'
    );
    assert.strictEqual(
        series2.xAxis.cross.attr('visibility'),
        'visible',
        'Hover Series 2: crosshair on xAxis of Series 2 is visible (#6420)'
    );

    series1.points[1].onMouseOver();
    assert.strictEqual(
        series1.yAxis.crossLabel.attr('visibility'),
        'visible',
        'Hover Series 1 back: crosshair label on yAxis of Series 1 is visible (#7219)'
    );
    assert.strictEqual(
        series2.yAxis.crossLabel.attr('visibility'),
        'hidden',
        'Hover Series 1 back: crosshair label on yAxis of Series 2 is hidden (#7219)'
    );
});

QUnit.test('Use correct hover point for axis. #6860', function (assert) {
    var AxisPrototype = Highcharts.Axis.prototype,
        drawCrosshair = AxisPrototype.drawCrosshair,
        events = [],
        override = function (e, p) {
            var txt = [
                this.isXAxis ? 'xAxis' : 'yAxis',
                'side: ' + this.side,
                'point: ' + (p ? p.series.name + '.' + p.index : 'undefined')
            ].join();
            events.push(txt);
            drawCrosshair.call(this, e, p);
        },
        options = {
            yAxis: [{
                crosshair: true
            }, {
                opposite: true,
                crosshair: true
            }],
            tooltip: {
                shared: true
            },
            series: [{
                name: 'A',
                data: [1, 2, 3],
                yAxis: 0
            }, {
                name: 'B',
                data: [1, 2, 3].reverse(),
                yAxis: 1
            }]
        },
        chart,
        series;
    AxisPrototype.drawCrosshair = override;
    chart = Highcharts.chart('container', options);
    series = chart.series[0];
    series.points[0].onMouseOver();
    assert.strictEqual(
        events.shift(),
        'xAxis,side: 2,point: A.0',
        'xAxis is assigned point A.0'
    );
    assert.strictEqual(
        events.shift(),
        'yAxis,side: 3,point: A.0',
        'yAxis left side is assigned point A.0'
    );
    assert.strictEqual(
        events.shift(),
        'yAxis,side: 1,point: B.0',
        'yAxis on right side is assigned point B.0'
    );
});


QUnit.test('Show crosshair label on logarithmic axis correctly. #8542', function (assert) {

    var chart = Highcharts.chart('container', {
        xAxis: {
            crosshair: true
        },

        yAxis: {
            type: 'logarithmic',
            crosshair: {
                enabled: true,
                label: {
                    enabled: true
                }
            }
        },

        series: [{
            data: [1, 512],
            pointStart: 1
        }]
    });

    chart.series[0].points[1].onMouseOver();

    assert.strictEqual(
        chart.yAxis[0].crossLabel.attr('visibility'),
        'visible',
        'Crosshair label is visible on logarithmic axis for the second point (#8542)'
    );
});
