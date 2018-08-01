QUnit.test('Data classes and redundant text labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {
            dataClasses: [{
                to: 3
            }, {
                from: 3,
                to: 10
            }, {
                from: 10,
                to: 30
            }, {
                from: 30,
                to: 100
            }, {
                from: 100,
                to: 300
            }, {
                from: 300,
                to: 1000
            }, {
                from: 1000
            }]
        },
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

    assert.strictEqual(
        Object.keys(chart.colorAxis[0].ticks).length,
        0,
        'Data class axis has no ticks (#6914)'
    );


    var initialChildLength = chart.container
        .querySelectorAll('.highcharts-legend .highcharts-legend-item')
        .length;

    chart.addSeries({
        type: 'pie',
        data: [1, 3, 2, 4]
    });

    assert.strictEqual(
        chart.container
            .querySelectorAll('.highcharts-legend .highcharts-legend-item')
            .length,
        initialChildLength,
        'The number of child nodes should not change after adding a pie (#8478)'
    );
});
