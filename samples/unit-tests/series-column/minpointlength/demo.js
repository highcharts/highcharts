QUnit.test('Negative or positive minPointLength', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                minPointLength: 10
            }
        },
        series: [
            {
                data: [100]
            },
            {
                data: [0, 0]
            }
        ]
    });

    assert.strictEqual(
        chart.series[1].points[0].graphic.attr('y') + 5 < chart.plotHeight,
        true,
        'Not negative is there is no space in the yAxis (#7311)'
    );
});

QUnit.test('All zero values', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                minPointLength: 10
            }
        },
        series: [
            {
                data: [0, 0, 0, 0, 0]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].shapeArgs.y < 145, // 145 value of negative point
        true,
        'Zero values are draw as positive columns (#10646)'
    );

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.negative;
        }),
        [false, false, false, false, false],
        'Points below threshold should have point.negative set to false.'
    );

    chart.addSeries({
        data: [-1, -2]
    });

    assert.strictEqual(
        Math.round(chart.series[0].points[0].shapeArgs.y),
        0,
        'Zero values should only be drawn as positive when there is room for it (#14876)'
    );

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.negative;
        }),
        [true, true, true, true, true],
        'Only points below threshold should have point.negative set to true.'
    );

});
