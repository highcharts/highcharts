QUnit.test('Stacked boost series with extremes', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            min: 0,
            max: 3
        },
        yAxis: [
            {
                min: 0,
                max: 10
            }
        ],
        plotOptions: {
            series: {
                boostThreshold: 1,
                stacking: 'normal'
            }
        },
        series: [
            {
                data: [1, 4, 2, 5, 6, 3, 2]
            }
        ]
    });
    const controller = new TestController(chart);

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-boost-canvas').length,
        1,
        'Chart with boost canvas should be created (#7481)'
    );

    chart.series[0].update({
        cropThreshold: 1
    });
    chart.xAxis[0].setExtremes(3, 6);

    controller.moveTo(560, 200, true);
    assert.strictEqual(
        chart.container.querySelector('.highcharts-tooltip text tspan')
            .textContent,
        '5',
        'The tooltip should reflect the actual point when cropped data (#18756)'
    );

});
