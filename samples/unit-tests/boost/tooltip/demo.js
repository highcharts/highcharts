QUnit.test('Tooltip on a boosted chart with categories', function (assert) {
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
});
