QUnit.test('Color axis update and resize. #6025', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            width: 500,
            height: 300
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: [
                [0, 0, 10],
                [0, 1, 19],
                [0, 2, 8],
                [0, 3, 24],
                [0, 4, 67],
                [1, 0, 92],
                [1, 1, 58],
                [1, 2, 78],
                [1, 3, 117],
                [1, 4, 48]
            ]
        }]
    });

    var plotHeight = chart.plotHeight;

    assert.ok(
        plotHeight > 100,
        'Ready'
    );

    chart.colorAxis[0].update({
        max: 500
    });

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'Geometry ok after update'
    );

    // Trigger a chart.redraw
    chart.setSize(490);

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'Geometry ok after resize'
    );
});
