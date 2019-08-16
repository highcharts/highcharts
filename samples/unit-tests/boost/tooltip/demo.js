QUnit.test('Tooltip on a boosted chart', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                categories: ['categoryName', 'B', 'C']
            },
            series: [{
                boostThreshold: 1,
                data: [0, 1, 2]
            }]
        }),
        controller = new TestController(chart);

    controller.moveTo(chart.plotLeft + 5, chart.plotTop + 5);

    assert.ok(
        document.getElementsByClassName('highcharts-tooltip')[0].textContent.match('categoryName') !== null,
        '`categoryName` found in the tooltip (#10432).'
    );

    chart.yAxis[0].setExtremes(0, 1, false);

    chart.series[0].setData([
        { x: 0, y: 0.5 },
        { x: 1, y: 10 }
    ]);

    controller.moveTo(chart.plotLeft + 5, chart.plotTop + 5);

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-tooltip')[0].style.visibility,
        '',
        'Tooltip should be visible after hover and {x, y} data format (#11608)'
    );

});
