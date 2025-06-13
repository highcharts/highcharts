QUnit.test('Inactive state and styledMode', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'dependencywheel',
                styledMode: true,
                className: 'fix-11389'
            },

            series: [
                {
                    data: [
                        {
                            from: 'A',
                            to: 'B',
                            weight: 1
                        },
                        {
                            from: 'A',
                            to: 'C',
                            weight: 1
                        }
                    ]
                }
            ]
        }),
        controller = new TestController(chart),
        x = chart.chartWidth / 2,
        y = chart.chartHeight / 2,
        inactivePoints;

    controller.mouseOver(x, y);

    inactivePoints = document.querySelectorAll(
        '.fix-11389 .highcharts-point-inactive'
    );

    assert.strictEqual(
        inactivePoints.length,
        2,
        'Exactly one point should have inactive state.'
    );

    assert.strictEqual(
        document.querySelectorAll('.fix-11389 .highcharts-series-inactive')
            .length,
        0,
        'Series should not have inactive state class, ' +
            'when points within inherit state'
    );

    chart.series[0].update({
        type: 'bar',
        data: [1]
    });

    chart.series[0].points[0].onMouseOver();

    assert.strictEqual(
        getComputedStyle(chart.series[0].points[0].graphic.element).fillOpacity,
        '0.75',
        'Bar point graphic after hover should have different brightness, #23081'
    );
});
