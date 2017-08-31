QUnit.test('Ticks for a single point.', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: {
            tickPositioner: function () {
                return [0, 0.2, 0.4, 0.6, 0.8];
            }
        },
        series: [{
            data: [0.2]
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'multiple ticks from tickPositioner for a single point (#6897)'
    );

    chart.yAxis[0].update({
        tickPositioner: function () {
            return;
        }
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        -0.3,
        'single tick and increased extremes for a single point'
    );
});

QUnit.test('Hide overlapping', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            type: 'column',
            data: [
                [992908800000, 3],
                [993427200000, 1],
                [993513600000, 1],
                [993600000000, 4],
                [994291200000, 1],
                [994636800000, 2],
                [994723200000, 1],
                [995328000000, 4],
                [995500800000, 1],
                [995587200000, 1],
                [995846400000, 1],
                [996019200000, 3],
                [996796800000, 2],
                [996883200000, 1],
                [997660800000, 2],
                [997747200000, 6],
                [997920000000, 1],
                [998611200000, 1],
                [999043200000, 3],
                [999648000000, 1],
                [999734400000, 2],
                [999820800000, 1],
                [1000080000000, 2],
                [1000252800000, 1],
                [1001376000000, 2],
                [1001548800000, 1]
            ]
        }]
    });

    chart.xAxis[0].setExtremes(993427200000, 1001548800000);

    assert.ok(
        chart.xAxis[0].ticks[
            chart.xAxis[0].tickPositions[
                chart.xAxis[0].tickPositions.length - 1]
            ].label.getBBox().width < 20,
        'Small width'
    );
});