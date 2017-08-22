QUnit.test('Zeros showing as negative or positive based on visible data (#7046)', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: [{
            max: 4
        }],
        yAxis: [{
            max: 3e5
        }],
        series: [{
            type: 'column',
            minPointLength: 20,
            data: [-3e5, -2e5, 0, -1, -6e5, 3e5]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[2].graphic.attr('y'),
        chart.series[0].points[3].graphic.attr('y'),
        'All points using minPointLength starts on ' +
            chart.series[0].points[3].graphic.attr('y')
    );

    chart.update({
        yAxis: [{
            reversed: true
        }]
    });

    assert.strictEqual(
        chart.series[0].points[2].graphic.attr('y'),
        chart.series[0].points[3].graphic.attr('y'),
        'All points using minPointLength ends on ' +
            chart.series[0].points[3].graphic.attr('y')
    );

    chart.update({
        xAxis: [{
            max: 10
        }]
    });

    assert.strictEqual(
        chart.series[0].points[2]
            .graphic.attr('y') !== chart.series[0].points[3].graphic.attr('y'),
        true,
        'Zero as positive value if any positive value in series is visible'
    );
});
