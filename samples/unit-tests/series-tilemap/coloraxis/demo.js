QUnit.test('Tilemap and ColorAxis', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'tilemap'
            },
            colorAxis: {},
            series: [
                {
                    data: [
                        {
                            x: 0,
                            y: 0,
                            value: 0.02
                        },
                        {
                            x: 25,
                            y: 15,
                            value: 0.06
                        }
                    ]
                }
            ]
        }),
        extremes = chart.colorAxis[0].getExtremes();

    assert.strictEqual(
        extremes.min,
        0.02,
        'ColorAxis.min should be the same as min value in points (#11644)'
    );

    assert.strictEqual(
        extremes.max,
        0.06,
        'ColorAxis.max should be the same as max value in points (#11644)'
    );

    // Square shape: no errors should be visible in the console, #14267
    chart.series[0].update({
        tileShape: 'square'
    });

    chart.series[0].update({
        tileShape: 'circle'
    });

    const point = chart.series[0].points[1];
    point.setState('hover');

    assert.notEqual(
        point.graphic.element.getAttribute('cx'),
        'NaN',
        `Circle shape of tilemap should not have cx attribute with NaN values
        on hover.`
    );

    assert.notEqual(
        point.graphic.element.getAttribute('cy'),
        'NaN',
        `Circle shape of tilemap should not have cy attribute with NaN values
        on hover.`
    );

    chart.series[0].remove(false);
    chart.addSeries({
        tileShape: 'circle',
        data: [{
            x: 0,
            y: 0,
            value: 0.02
        }]
    });

    assert.notEqual(
        point.radius,
        0,
        `When there is a single data point in the series, circle shape tiles
        should render on the chart properly (#18647).`
    );

    chart.series[0].update({
        tileShape: 'diamond'
    });

    assert.ok(
        chart.series[0].points[0].shapeArgs.d[1][1] -
            chart.series[0].points[0].shapeArgs.d[3][1] > 0,
        `When there is a single data point in the series, diamond shape tiles
        should render on the chart properly (#18647).`
    );
});
