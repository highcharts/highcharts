QUnit.test('Pie: innerSize and thickness', assert => {
    const chart = Highcharts.chart('container', {
        series: [
            {
                type: 'pie',
                innerSize: 200,
                data: [1, 2, 3, 4, 5, 6]
            }
        ]
    });

    const series = chart.series[0],
        center = series.center;

    assert.strictEqual(
        center[3] > center[2],
        false,
        'The innerSize should not be greater than size, #3623.'
    );

    series.update({
        innerSize: '50%'
    });

    const innerSize = series.options.innerSize;

    assert.strictEqual(
        series.center[3],
        (series.center[2] * parseInt(innerSize, 10)) / 100,
        'Inner size should be 50% of outer size'
    );

    let clicks = 0;

    series.update({
        innerSize: undefined,
        events: {
            click: () => {
                clicks++;
            }
        }
    });

    const controller = new TestController(chart);

    controller.moveTo(
        chart.plotLeft + chart.series[0].center[0] - 25,
        chart.plotTop + chart.series[0].center[1] + 5
    );

    controller.click(
        chart.plotLeft + chart.series[0].center[0] - 25,
        chart.plotTop + chart.series[0].center[1] + 5
    );

    assert.strictEqual(
        clicks,
        1,
        'Clicking on a side of a pie slice should fire click event.'
    );

    chart.series[0].update({
        thickness: 20
    });

    assert.strictEqual(
        clicks,
        1,
        'Clicking on a empty field should not incrase the clicks variable.'
    );

    const thickness = series.options.thickness;

    assert.strictEqual(
        thickness,
        series.points[0].shapeArgs.r - series.points[0].shapeArgs.innerR,
        'Thickness should be same as points length.'
    );

    assert.strictEqual(
        thickness + series.points[0].shapeArgs.innerR,
        series.center[2] / 2,
        'Thickness should not be greater than size.'
    );

    series.update({
        thickness: undefined
    });

    assert.strictEqual(
        series.points[0].shapeArgs.innerR,
        0,
        'If thickness is undefined, point.shapeArgs.innerR should be 0.'
    );

    series.update({
        innerSize: 30
    });

    assert.strictEqual(
        series.points[0].shapeArgs.innerR,
        15,
        'It should be equal to half innerSize.'
    );

    series.update({
        thickness: 20
    });

    assert.notEqual(
        series.points[0].shapeArgs.innerR,
        15,
        'Thickness should overwrite innerSize.'
    );
});

QUnit.test(
    'The inner size of a pie with an additional gauge series (#13629).',
    assert => {
        const chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'gauge',
                    data: [10]
                },
                {
                    type: 'pie',
                    innerSize: '50%',
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '60%'],
                    data: [1, 2, 3]
                }
            ]
        });

        assert.notEqual(
            chart.series[1].center[3],
            0,
            'The innerSize is not equal 0.'
        );
    }
);