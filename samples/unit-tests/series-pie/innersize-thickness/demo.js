QUnit.test('Thickness cannot be greater than size.(#6647)', assert => {
    let clicks = 0;
    const chart = new Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        plotOptions: {
            pie: {
                events: {
                    click: () => {
                        clicks++;
                    }
                }
            }
        },
        series: [
            {
                data: [
                    ['Firefox', 44.2],
                    ['IE7', 26.6],
                    ['IE6', 20],
                    ['Chrome', 3.1],
                    ['Other', 5.4]
                ]
            }
        ]
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
        clicks, 1, 'Clicking on a side of a pie slice should fire click event.'
    );

    chart.series[0].update({
        thickness: 20,
    });

    assert.strictEqual(
        clicks, 1, 'Clicking on a empty field should not incrase the clicks.'
    );

    const series = chart.series[0],
        thickness = series.options.thickness,
        size = series.center[2];

    assert.strictEqual(
        thickness,
        series.points[0].shapeArgs.r - series.points[0].shapeArgs.innerR,
        'Thickness should be same as points distance.'
    );

    assert.strictEqual(
        thickness + series.points[0].shapeArgs.innerR,
        size / 2,
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
    )

    series.update({
        thickness: 20,
    });
    
    assert.notEqual(
        series.points[0].shapeArgs.innerR,
        15,
        'It should not be equal to half innerSize.'
    )
});