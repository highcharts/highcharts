QUnit.test('Styled mode for pie type series', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'pie',
                allowPointSelect: true,
                data: [1, 3, 2, 4]
            }]
        }),
        startingColor = chart.series[0].points[2].graphic.getStyle('fill');

    chart.series[0].points[2].update({
        selected: true,
        sliced: true
    });

    assert.strictEqual(
        chart.series[0].points[2].graphic.getStyle('fill'),
        startingColor,
        'Selected slice has the same color as before the selection (#6005)'
    );
});