QUnit.test('Extremes are calculated from all series. #6209', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {},
        series: [{
            data: [
                [0, 1, 0],
                [1, 2, 1]
            ]
        }, {
            data: [
                [3, 1, 100],
                [4, 2, 600]
            ]
        }]
    });

    assert.strictEqual(chart.colorAxis[0].max, 600, 'Max is 600');
    assert.strictEqual(chart.colorAxis[0].min, 0, 'Min is 0');
});
